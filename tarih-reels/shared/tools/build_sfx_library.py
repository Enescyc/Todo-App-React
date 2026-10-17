#!/usr/bin/env python3
"""CC0 ses kütüphanesini (Versilian VCSL + VSCO 2 CE) seri için hazırlar.

Kullanım: python3 build_sfx_library.py <klon-klasörü>   # içinde VCSL/ ve VSCO-2-CE/ olmalı
  Klonlama (yalnız gereken dosyalar):
    git clone --filter=blob:none --no-checkout --depth 1 https://github.com/sgossner/VCSL
    git clone --filter=blob:none --no-checkout --depth 1 https://github.com/sgossner/VSCO-2-CE
    (sonra KAYNAKLAR.tsv'deki yolları `git checkout HEAD -- <yol>` ile indirin)
Çıktı: shared/sfx/<kategori>/<ad>.flac + shared/sfx/katalog.json
İşlem: 44.1 kHz, baş/son sessizlik kırpma (-55 dBFS), en çok 14 sn, son 0.3 sn yumuşak bitiş,
ton uyumlama (tiz >4 kHz enerjisi en çok %6; çok tiz seslere 1–2 oktav pes), tepe -1 dBFS.
"""
import json, os, subprocess, sys
import numpy as np

SRC = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "sfx"); SR = 44100

def load(p):
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-of", "json", p], capture_output=True, text=True).stdout)["streams"][0]
    ch = min(2, int(info["channels"]))
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", str(ch), "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).astype(np.float64)

def hf_ratio(x):
    X = np.abs(np.fft.rfft(x.mean(1)[: int(4 * SR)])) ** 2; f = np.fft.rfftfreq(min(len(x), int(4 * SR)), 1 / SR)
    return X[f > 4000].sum() / X.sum()


def harmonize(x, target=.06, fc=2500.0, max_cut=-18.0):
    """Ton uyumlama: tiz enerji (>4 kHz) hedefi aşıyorsa, 2.5 kHz'den başlayan yumuşak bir tiz rafı (high-shelf)
    hedefe inene kadar kısar. Bas vuruşlardan sonra gelen parlak seslerin kulağa batmasını önler."""
    if hf_ratio(x) <= target: return x, 0.0
    n = len(x); f = np.fft.rfftfreq(n, 1 / SR); X = np.fft.rfft(x, axis=0)
    ramp = np.clip(np.log2(np.maximum(f, 1) / fc) / 1.5, 0, 1)   # fc'den 1.5 oktav boyunca yumuşak geçiş
    g = 0.0
    while g > max_cut:
        g -= 1.5
        y = np.fft.irfft(X * (10 ** (g * ramp / 20))[:, None], n, axis=0)
        if hf_ratio(y) <= target: break
    return y, g


cat = []
for line in open(os.path.join(OUT, "KAYNAKLAR.tsv"), encoding="utf-8"):
    sid, repo, path, desc = line.rstrip("\n").split("\t")
    x = load(os.path.join(SRC, repo, path))
    env = np.abs(x).max(1); thr = env.max() * 10 ** (-55 / 20); idx = np.where(env > thr)[0]
    x = x[max(0, idx[0] - 200): idx[-1] + 1][: int(14 * SR)]
    f = min(len(x), int(.3 * SR)); x[-f:] *= np.linspace(1, 0, f)[:, None]
    x, shelf_db = harmonize(x)
    octaves = 0
    while hf_ratio(x) > .15 and octaves < 2:   # doğası gereği çok tiz sesler: bir oktav pes → diğer seslerle aynı perde bölgesi
        idx = np.arange(0, len(x) - 1, .5); x = np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in range(x.shape[1])], 1)[: int(14 * SR)]
        octaves += 1; x, extra = harmonize(x); shelf_db += extra
    x = x / np.abs(x).max() * 10 ** (-1 / 20)
    dst = os.path.join(OUT, sid + ".flac"); os.makedirs(os.path.dirname(dst), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", str(x.shape[1]), "-ar", str(SR), "-i", "-", "-c:a", "flac", "-sample_fmt", "s16", dst],
                   input=x.astype(np.float32).tobytes(), check=True)
    rms = 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)
    cat.append({"id": sid, "dosya": sid + ".flac", "sure": round(len(x) / SR, 2), "kanal": x.shape[1], "rms_db": round(rms, 1), "aciklama": desc, "tiz_kisma_db": shelf_db, "oktav_pes": octaves,
                "kaynak": f"{repo}: {path}", "lisans": "CC0 1.0 (kamu malı)", "repo": f"https://github.com/sgossner/{repo}"})
    print(f"{sid:32s} {len(x)/SR:5.1f} sn  rms {rms:6.1f} dB  tiz kısma {shelf_db:5.1f} dB  pes {octaves} okt  tiz oranı %{hf_ratio(x)*100:4.1f}")
json.dump(cat, open(os.path.join(OUT, "katalog.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(cat), "ses →", OUT)
