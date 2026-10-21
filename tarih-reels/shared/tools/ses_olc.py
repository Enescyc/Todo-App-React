#!/usr/bin/env python3
"""Tarih Reels ses ölçümü. Dinlemeden önce nesnel kontrol.

Kullanım: python3 shared/tools/ses_olc.py <bölüm-klasörü | ses dosyası> [...]
Bölüm klasörü verilirse audio/final.wav ölçülür; audio/_vo.wav ve audio/_arka.wav varsa anlatıcı/müzik farkı da raporlanır.
Hedefler (shared/muzik/BRIEF.md ve REFERANS-DEPOLAR.md):
  • bütünleşik ses yüksekliği −14 LUFS (±1), tepe ≤ −1 dBFS
  • 4 kHz üstü enerji ≤ %6 (kulak tırmalamaz)
  • bas → tiz sıçrama yok: 250 ms pencerede spektral merkez < 300 Hz iken bir sonraki pencerede 900 Hz'i ve 1.5 oktavı aşmamalı.
    Bölüm klasöründe audio/_arka.wav varsa bu ölçüt müzik + efekt izinde değerlendirilir: anlatıcının kendi ünlüden ş/s/z'ye
    geçişleri de bu kalıba uyar ama kulak tırmalayan şey değildir (kullanıcının şikâyeti efekt ve müzikteki bas → tiz zıtlığıydı).
    Karışımdaki sayı bilgi olarak yazılır.
  • anlatıcı konuşurken müziğin ≥ 10 dB üstünde
"""
import os, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import sesler
SR = sesler.SR


def oku(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def merkezler(x, w=int(.25 * SR)):
    m = x.mean(1); out = []
    for i in range(0, len(m) - w, w):
        s = m[i: i + w]; r = np.sqrt((s ** 2).mean())
        if r < 10 ** (-45 / 20): out.append((i / SR, np.nan, r)); continue
        S = np.abs(np.fft.rfft(s * np.hanning(w))) ** 2; f = np.fft.rfftfreq(w, 1 / SR)
        out.append((i / SR, (S * f).sum() / S.sum(), r))
    return out


def sicramalar(x):
    c = merkezler(x)
    return c, [(t1, c0, c1) for (t0, c0, _), (t1, c1, _) in zip(c, c[1:]) if not np.isnan(c0) and not np.isnan(c1) and c0 < 300 and c1 > 900 and np.log2(c1 / c0) > 1.5]


def olc(p, arka=None):
    x = oku(p); m = x.mean(1); X = np.abs(np.fft.rfft(m)) ** 2; F = np.fft.rfftfreq(len(m), 1 / SR)
    L, pk = sesler.lufs(x), 20 * np.log10(np.abs(x).max() + 1e-12)
    hf, mid = X[F > 4000].sum() / X.sum() * 100, X[(F > 1500) & (F < 4000)].sum() / X.sum() * 100
    c, sic = sicramalar(x)
    ok = lambda b: "✓" if b else "✗"
    print(f"\n{p}  ({len(x) / SR:.1f} sn)")
    print(f"  {ok(abs(L + 14) <= 1)} ses yüksekliği {L:.1f} LUFS (hedef −14)   {ok(pk <= -0.9)} tepe {pk:.1f} dBFS (≤ −1)")
    print(f"  {ok(hf <= 6)} 4 kHz üstü %{hf:.2f} (≤ 6)   · 1.5–4 kHz %{mid:.2f}   · spektral merkez medyanı {np.nanmedian([q[1] for q in c]):.0f} Hz")
    liste = lambda S: ", ".join(f"{t:.2f} sn ({a:.0f}→{b:.0f} Hz)" for t, a, b in S) if S else "yok"
    if arka is not None and os.path.exists(arka):
        _, sa = sicramalar(oku(arka))
        print(f"  {ok(not sa)} bas → tiz sıçrama, müzik + efekt: {liste(sa)}")
        print(f"  · bilgi: karışımda {len(sic)} an (anlatıcının ş/s/z geçişleri dahil; ölçüt değil)")
    else:
        print(f"  {ok(not sic)} bas → tiz sıçrama: {liste(sic)}")
    return x


for a in sys.argv[1:]:
    if os.path.isdir(a):
        v, b = os.path.join(a, "audio", "_vo.wav"), os.path.join(a, "audio", "_arka.wav")
        olc(os.path.join(a, "audio", "final.wav"), b)
        if os.path.exists(v) and os.path.exists(b):
            V, B = oku(v).mean(1), oku(b).mean(1); w = int(.5 * SR); fark = []
            for i in range(0, min(len(V), len(B)) - w, w):
                rv, rb = np.sqrt((V[i: i + w] ** 2).mean()), np.sqrt((B[i: i + w] ** 2).mean())
                if rv > 10 ** (-35 / 20): fark.append(20 * np.log10(rv / (rb + 1e-9)))
            if fark:
                fark = np.array(fark); print(f"  {'✓' if np.percentile(fark, 10) >= 10 else '✗'} anlatıcı − müzik: medyan {np.median(fark):.1f} dB, en kötü %10 {np.percentile(fark, 10):.1f} dB (≥ 10)")
        else:
            print("  (seslendirme yok: anlatıcı/müzik farkı ölçülmedi)")
    else:
        olc(a)
