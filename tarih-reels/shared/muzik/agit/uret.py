#!/usr/bin/env python3
"""Ağıt / Çöküş (`agit`) – Osmanlı serisi müzik kütüphanesi.

Yenilgi, kayıp, bir dönemin sonu. ♩ = 52, Re (D) Kürdi/minör; ney hattında Hicaz rengi (komalı).
Seri leitmotifi burada YAVAŞLATILMIŞ (değerler 2 katı), MİNÖRLEŞMİŞ (F♯ → F) ve YARIM KALAN biçimde:
çello A3 B♭3 A3 G3 | F3 G3 E♭3 … – son D hiç gelmez, E♭ Re pedalının üstünde sönerek asılı kalır.

Kullanım:  python3 tarih-reels/shared/muzik/agit/uret.py
Çıktı:     out/agit__tam.flac, __zemin, __ritim, __melodi, __vurgu (44.1 kHz, stereo, 24 bit FLAC)
           onizleme.mp3, meta.json, KAYNAKLAR.tsv; spektrogram /tmp/claude-0/muzik-agit/ altına.
Gerekenler: numpy, ffmpeg. Örnekler: shared/sfx (depoda) + VSCO-2-CE / VCSL kısmi klonları
           (CC0_KLON ortam değişkeni, varsayılan /tmp/claude-0/sfx; eksik dosyayı `git checkout` ile kendisi indirir).
Deterministiktir (sabit tohum): aynı girdilerle her çalıştırmada aynı dosyalar.
"""
import json, os, re, subprocess, sys, zlib
import numpy as np

ID = "agit"
TOHUM = 1402

# =====================================================================================================
# ORTAK MOTOR (agit ve rivayet uret.py'lerinde aynı kod)
# =====================================================================================================
SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
SFX = os.path.normpath(os.path.join(HERE, "..", "..", "sfx"))
KLON = os.environ.get("CC0_KLON", "/tmp/claude-0/sfx")
OUT = os.path.join(HERE, "out")
TMP = f"/tmp/claude-0/muzik-{ID}"
KAYNAK = {}


def sh(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def load(path):
    raw = sh(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def yol_sfx(kid):
    KAYNAK[kid] = ("shared/sfx", f"tarih-reels/shared/sfx/{kid}.flac", "CC0 1.0 (bkz. shared/sfx/katalog.json)")
    return os.path.join(SFX, kid + ".flac")


def yol_cc0(repo, path):
    p = os.path.join(KLON, repo, path)
    if not os.path.exists(p):
        d = os.path.join(KLON, repo)
        if not os.path.isdir(d):
            sys.exit(f"CC0 klonu bulunamadı: {d}\n  git clone --filter=blob:none --no-checkout --depth 1 "
                     f"https://github.com/sgossner/{repo} {d}\n  (ya da CC0_KLON=<klasör> verin)")
        sh(["git", "-C", d, "checkout", "HEAD", "--", path], capture_output=True)
    KAYNAK[f"{repo}:{path}"] = (f"https://github.com/sgossner/{repo}", path, "CC0 1.0 Universal (depodaki LICENSE)")
    return p


def fastlen(n):
    best = 1 << (n - 1).bit_length()
    a = 1
    while a < best:
        b = a
        while b < best:
            p = b
            while p < n: p *= 2
            best = min(best, p); b *= 3
        a *= 5
    return best


def fft_filtre(x, kazanc):
    """Sıfır fazlı FFT süzgeci; kazanc(f) -> genlik. Sonuna sıfır eklenir (dairesel taşma yok)."""
    tek = x.ndim == 1
    if tek: x = x[:, None]
    N = fastlen(len(x) + int(.3 * SR))
    f = np.fft.rfftfreq(N, 1 / SR)
    y = np.fft.irfft(np.fft.rfft(x, N, axis=0) * kazanc(f)[:, None], N, axis=0)[: len(x)]
    return y[:, 0] if tek else y


def lp(x, fc, k=2): return fft_filtre(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * k)))
def hp(x, fc, k=2): return fft_filtre(x, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * k)))
def bp_(x, lo, hi, k=2): return fft_filtre(x, lambda f: 1 / np.sqrt(1 + (f / hi) ** (2 * k)) / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * k)))


def tiz_raf(x, fc, db, gen=1.0):
    """fc'den başlayıp `gen` oktavda tam değerine ulaşan yumuşak tiz rafı (high-shelf)."""
    return fft_filtre(x, lambda f: 10 ** (db * np.clip(np.log2(np.maximum(f, 1) / fc) / gen, 0, 1) / 20))


def interp(src, pos):
    """Catmull-Rom ara değerleme (değişken hızlı okuma = perde kaydırma)."""
    n = len(src)
    i = np.floor(pos).astype(np.int64); fr = (pos - i)[:, None]
    i = np.clip(i, 1, n - 3)
    a, b, c, d = src[i - 1], src[i], src[i + 1], src[i + 2]
    return b + fr * (.5 * (c - a) + fr * (a - 2.5 * b + 2 * c - .5 * d + fr * (1.5 * (b - c) + .5 * (d - a))))


def f0_olc(x, f_nom):
    """Nominal perdeye yakın (±70 sent) ilk üç harmonikten ağırlıklı f0."""
    m = x.mean(1)[: int(4 * SR)]
    N = 1 << 21; df = SR / N
    S = np.abs(np.fft.rfft(m * np.hanning(len(m)), N))
    est, w = [], []
    for k in (1, 2, 3):
        a = int(k * f_nom * 2 ** (-.7 / 12) / df); b = int(k * f_nom * 2 ** (.7 / 12) / df) + 1
        j = a + int(np.argmax(S[a:b]))
        y0, y1, y2 = np.log(S[j - 1: j + 2] + 1e-12)
        est.append((j + .5 * (y0 - y2) / (y0 - 2 * y1 + y2)) * df / k); w.append(S[j])
    return float(np.average(est, weights=w))


class Ornek:
    """Bir örnek: baş sessizliği kırpılmış, sürdürme bölgesi bulunmuş, seviyesi eşitlenmiş (sürdürme RMS = -20 dBFS)."""

    def __init__(self, path, f_nom=None, f0=None, norm="sus", esik=-40):
        x = load(path)
        env = np.abs(x).max(1); pk = env.max()
        i0 = max(0, int(np.argmax(env > pk * 10 ** (esik / 20))) - int(.004 * SR))
        x = x[i0:]
        h = int(.05 * SR); m = len(x) // h
        fr = np.sqrt((x[: m * h] ** 2).mean(1).reshape(m, h).mean(1)) + 1e-12
        db = 20 * np.log10(fr); top = np.percentile(db, 97)
        sus = np.where(db > top - 10)[0]
        self.on, self.off = int(sus[0] * h), int((sus[-1] + 1) * h)
        g = .1 / np.sqrt((x[self.on: self.off] ** 2).mean()) if norm == "sus" else .5 / pk
        self.x = x * g
        self.f0 = f0 if f0 else (f0_olc(self.x[self.on: self.off], f_nom) if f_nom else None)
        self.rng = np.random.default_rng(zlib.crc32(os.path.basename(path).encode()))
        self._ext = {}
        self.ad = os.path.basename(path)

    def uzat(self, n_gerek):
        """Doğal sürdürme yetmezse WSOLA benzeri, faz hizalı, eş-güç örtüşmeli tanelerle uzatır."""
        if n_gerek <= self.off: return self.x
        key = n_gerek // SR + 1
        if key in self._ext: return self._ext[key]
        n_gerek = key * SR
        g = int(min(2.0, (self.off - self.on) / SR / 3) * SR); g -= g % 2; h = g // 2
        w = np.sin(np.pi * (np.arange(g) + .5) / g)[:, None]
        x = self.x; mono = x.mean(1)
        lo = self.on + int(.25 * SR); hi = self.off - g - 1
        assert hi > lo + SR // 10, f"{self.ad}: sürdürme bölgesi kısa"
        D = int(SR / 45); M = min(2048, h // 2); c0 = h // 2 - M // 2
        out = np.zeros((n_gerek + 2 * g, 2))
        p = self.off - g
        out[: p + h] = x[: p + h]; out[p: p + h] *= w[h:]
        q = p
        while p < n_gerek:
            r = int(self.rng.integers(lo, hi))
            a = max(lo - r, -D); b = min(hi - r, D)
            ref = mono[q + c0: q + c0 + M]
            seg = mono[r + a + c0: r + b + c0 + M]
            cc = np.correlate(seg, ref, "valid") / (np.sqrt(np.convolve(seg ** 2, np.ones(M), "valid")) + 1e-9)
            r = r + a + int(np.argmax(cc))
            out[p: p + g] += x[r: r + g] * w
            q = r + h; p += h
        self._ext[key] = out[:n_gerek]
        return self._ext[key]


def egri(n, noktalar):
    """Kırık çizgi zarf: noktalar = [(oran 0..1, değer), ...] n örnek boyunca."""
    t, v = zip(*noktalar)
    return np.interp(np.linspace(0, 1, n), t, v)


def nota(o, f, sure, att=.06, rel=.5, bas=0.0, kayma=None, zarf=None):
    """o: Ornek; f: Hz ya da örnek başına Hz dizisi; sure: tutuş (s); rel: bırakış (s);
    bas: örnek içinde başlangıç (s; legato için yay saldırısını atlar); kayma: (f_önceki, s) portamento;
    zarf: tutuş boyunca [(oran, değer)] dinamik eğrisi."""
    n = int((sure + rel) * SR)
    fc = np.full(n, float(f)) if np.isscalar(f) else np.asarray(f, float)[:n]
    if kayma:
        f_on, tg = kayma; k = min(n, max(2, int(tg * SR)))
        s = .5 - .5 * np.cos(np.pi * np.arange(k) / k)
        fc[:k] = f_on * (fc[:k] / f_on) ** s
    ratio = fc / o.f0 if o.f0 else np.ones(n)
    pos = bas * SR + np.concatenate([[0.], np.cumsum(ratio[:-1])])
    y = interp(o.uzat(int(pos[-1]) + 8), pos)
    a = np.ones(n)
    ka = max(1, int(att * SR)); a[:ka] = .5 - .5 * np.cos(np.pi * np.arange(ka) / ka)
    kr = max(1, int(rel * SR)); a[n - kr:] *= .5 + .5 * np.cos(np.pi * np.arange(kr) / kr)
    if zarf:
        ns = int(sure * SR); z = np.ones(n); z[:ns] = egri(ns, zarf); z[ns:] = zarf[-1][1]; a *= z
    return y * a[:, None]


def pan_(y, p):
    if not p: return y
    return y * np.array([np.cos((p + 1) * np.pi / 4), np.sin((p + 1) * np.pi / 4)]) * np.sqrt(2)


class Iz:
    """Doğrusal iz (giriş/kapanış olayları, vurgu)."""

    def __init__(self, n): self.b = np.zeros((n, 2))

    def ekle(self, t, y, g=1.0, pan=0.0):
        i = int(round(t * SR)); y = pan_(y, pan) * g
        j0, j1 = max(0, i), min(len(self.b), i + len(y))
        if j1 > j0: self.b[j0:j1] += y[j0 - i: j1 - i]


class Dongu(Iz):
    """Dairesel iz: döngü gövdesi. Sona taşan her şey (nota kuyruğu) başa sarar → kusursuz döngü."""

    def __init__(self, L): self.L = L; self.b = np.zeros((L, 2))

    def ekle(self, t, y, g=1.0, pan=0.0):
        i = int(round(t * SR)) % self.L; y = pan_(y, pan) * g; k = 0
        while k < len(y):
            m = min(self.L - i, len(y) - k); self.b[i: i + m] += y[k: k + m]; k += m; i = 0


def ir_yap(rt, sure, tohum, on_gecikme=.012, rt_tiz=None, rt_bas=None):
    """Sıcak oda yankısı: üç bantta farklı sönümlü (tiz hızlı söner) gürültü + erken yansımalar; birim enerji."""
    r = np.random.default_rng(tohum); n = int(sure * SR); t = np.arange(n) / SR
    z = r.standard_normal((n, 2))
    zl = lp(z, 250); zh = hp(z, 2500); zm = z - zl - zh
    dec = lambda T: (10 ** (-3 * t / T))[:, None]
    ir = zl * dec(rt_bas or rt * 1.1) + zm * dec(rt) + zh * dec(rt_tiz or rt * .4)
    ir *= (1 - np.exp(-t / .008))[:, None]
    k = int(.25 * SR); ir[-k:] *= np.linspace(1, 0, k)[:, None]
    for c in range(2):
        for _ in range(7):
            j = int(r.uniform(.006, .05) * SR); ir[j, c] += r.choice([-1, 1]) * 10 * np.exp(-j / SR / .03)
    ir = np.vstack([np.zeros((int(on_gecikme * SR), 2)), ir])
    return ir / np.sqrt((ir ** 2).sum(0))


def konv(x, ir, dairesel=False):
    if dairesel:
        L = len(x); H = np.fft.rfft(np.vstack([ir, np.zeros((L - len(ir), 2))]), axis=0)
        return np.fft.irfft(np.fft.rfft(x, axis=0) * H, L, axis=0)
    N = fastlen(len(x) + len(ir))
    return np.fft.irfft(np.fft.rfft(x, N, axis=0) * np.fft.rfft(ir, N, axis=0), N, axis=0)[: len(x)]


def oda(x, ir, pay, dairesel=False):
    """Islak payı `pay` (enerji oranı; 0.18 ≈ %18 ıslak)."""
    return np.sqrt(1 - pay) * x + np.sqrt(pay) * konv(x, ir, dairesel)


def yumusak(n, a, b, yukari=True):
    """a..b örnek aralığında kosinüs rampası (0→1 ya da 1→0) içeren n uzunluklu eğri."""
    t = np.clip((np.arange(n) - a) / max(1, b - a), 0, 1)
    r = .5 - .5 * np.cos(np.pi * t)
    return r if yukari else 1 - r


def birlestir(per, A_n, C_n, g_in, g_out, ek):
    """Tam dosya = giriş zarfı × (gövdenin geriye uzantısı) + gövde + kapanış zarfı × (gövdenin ileri uzantısı) + ek olaylar."""
    L = len(per); T = A_n + L + C_n
    idx = (np.arange(T) - A_n) % L
    g = np.ones(T); g[:A_n] = g_in; g[A_n + L:] = g_out
    return per[idx] * g[:, None] + ek


def yaz_flac(path, x):
    sh(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-c:a", "flac",
        "-sample_fmt", "s32", "-bits_per_raw_sample", "24", path], input=x.astype(np.float32).tobytes())


def db(v): return float(20 * np.log10(max(v, 1e-12)))


def rms(x): return float(np.sqrt(np.mean(x ** 2)))


def spektrum_oranlari(x):
    m = x.mean(1); n = 4096; h = 2048; w = np.hanning(n)
    fr = np.lib.stride_tricks.sliding_window_view(m, n)[::h] * w
    P = (np.abs(np.fft.rfft(fr, axis=1)) ** 2).sum(0); f = np.fft.rfftfreq(n, 1 / SR)
    return float(P[f > 4000].sum() / P.sum()), float(P[(f >= 1500) & (f < 4000)].sum() / P.sum()), float((P * f).sum() / P.sum())


def merkezler(x, esik_db):
    """250 ms pencerelerde spektral merkez (Hz); sessiz pencereler (esik_db altı) None."""
    m = x.mean(1); n = int(.25 * SR); w = np.hanning(n); f = np.fft.rfftfreq(n, 1 / SR); c = []
    for i in range(0, len(m) - n + 1, n):
        s = m[i: i + n]
        if db(rms(s)) < esik_db: c.append(None); continue
        P = np.abs(np.fft.rfft(s * w)) ** 2; c.append(float((P * f).sum() / P.sum()))
    return c


def olc(tam, A_n, B_n, gov_ad="gövde"):
    o = {}
    o["rms_dbfs"] = round(db(rms(tam)), 2)
    o["rms_govde_dbfs"] = round(db(rms(tam[A_n:B_n])), 2)
    o["tepe_dbfs"] = round(db(np.abs(tam).max()), 2)
    o["kirpilma_ornek"] = int((np.abs(tam) >= .999).sum())
    hf, orta, cen = spektrum_oranlari(tam)
    o["tiz_4k_ustu_oran"] = round(hf, 4); o["konusma_1k5_4k_oran"] = round(orta, 4); o["ortalama_spektral_merkez_hz"] = round(cen, 1)
    c = merkezler(tam, db(rms(tam)) - 30)
    j = [abs(np.log2(c[i] / c[i - 1])) for i in range(1, len(c)) if c[i] and c[i - 1]]
    o["merkez_sicrama_maks_oktav"] = round(float(max(j)), 3); o["merkez_sicrama_p99_oktav"] = round(float(np.percentile(j, 99)), 3)
    vc = [v for v in c if v]
    o["merkez_aralik_hz"] = [round(min(vc)), round(max(vc))]
    k = int(.25 * SR)
    o["dongu_rms_son250ms_dbfs"] = round(db(rms(tam[B_n - k: B_n])), 2)
    o["dongu_rms_bas250ms_dbfs"] = round(db(rms(tam[A_n: A_n + k])), 2)
    d = np.abs(np.diff(tam[A_n:B_n], axis=0)).max(1)
    o["dongu_eklem_sicrama"] = round(float(np.abs(tam[A_n] - tam[B_n - 1]).max()), 6)
    o["dongu_tipik_ornek_farki_p99"] = round(float(np.percentile(d, 99)), 6)
    # eklemde merkez: döngü sonu 250 ms → döngü başı 250 ms
    def cen1(s):
        P = np.abs(np.fft.rfft(s.mean(1) * np.hanning(len(s)))) ** 2; f = np.fft.rfftfreq(len(s), 1 / SR); return (P * f).sum() / P.sum()
    o["dongu_eklem_merkez_sicrama_oktav"] = round(float(abs(np.log2(cen1(tam[A_n: A_n + k]) / cen1(tam[B_n - k: B_n])))), 3)
    return o


def ebur128(path):
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    s = e[e.rfind("Summary:"):]
    I = re.search(r"I:\s+(-?[\d.]+) LUFS", s); P = re.search(r"Peak:\s+(-?[\d.]+) dBFS", s)
    return {"lufs_entegre": float(I[1]) if I else None, "gercek_tepe_dbtp": float(P[1]) if P else None}


def gorsel(path, png, sure):
    sh(["ffmpeg", "-v", "error", "-y", "-i", path, "-lavfi",
        f"showspectrumpic=s=1600x720:mode=combined:scale=log:fscale=log:stop=12000:drange=100:legend=1", png])
    sh(["ffmpeg", "-v", "error", "-y", "-i", path, "-lavfi", "showwavespic=s=1600x240:split_channels=0:colors=white", png.replace(".png", "_dalga.png")])


NOTA = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def hz(s, sent=0.0):
    m = re.fullmatch(r"([A-G])([b#]?)(-?\d)", s)
    n = NOTA[m[1]] + {"b": -1, "#": 1, "": 0}[m[2]] + 12 * (int(m[3]) + 1)
    return 440 * 2 ** ((n - 69) / 12 + sent / 1200)


def midi(s): return 69 + 12 * np.log2(hz(s) / 440)


def en_yakin(orn, f):
    """Perdeye en yakın örnek (yarım ses cinsinden)."""
    return min(orn, key=lambda o: abs(np.log2(f / o.f0)))


def ney_cumle(notalar, b, flutler, rng, rel=.5, kaydir=-70, vib_hz=4.7, vib_sent=13, nefes=1.0, son_sonus=False):
    """Ney benzeri nefesli cümle. notalar = [(Hz, süre_vuruş, dinamik), ...].
    Gerçek flüt örneği (VSCO 2 CE, kesintisiz değişken hızla okunur → notalar arası doğal kaydırmalar)
    + perdeye kilitli dar bant nefes gürültüsü (1. ve 2. harmonik çevresi) + geniş bant hava sesi + başta 'üfleme' sesi."""
    durs = [d * b for _, d, _ in notalar]; T = sum(durs); n = int((T + rel) * SR)
    t = np.arange(n) / SR
    lf = np.zeros(n); amp = np.zeros(n); vd = np.zeros(n); t0 = 0
    for (f, d, v), dd in zip(notalar, durs):
        i0, i1 = int(t0 * SR), min(n, int((t0 + dd) * SR))
        lf[i0:] = np.log2(f); amp[i0:] = v
        if dd > 1.0:   # uzun notada geciken titreşim
            k = np.clip((t[i0:i1] - t0 - .45) / .8, 0, 1) * np.clip((t0 + dd - t[i0:i1]) / .25, 0, 1)
            vd[i0:i1] = k * vib_sent
        t0 += dd
    ker = np.hanning(int(.085 * SR)); ker /= ker.sum()
    lf = np.convolve(np.pad(lf, (len(ker), len(ker)), "edge"), ker, "same")[len(ker):-len(ker)]
    ker2 = np.hanning(int(.16 * SR)); ker2 /= ker2.sum()
    amp = np.convolve(np.pad(amp, (len(ker2), len(ker2)), "edge"), ker2, "same")[len(ker2):-len(ker2)]
    lf += kaydir / 1200 * (1 - np.clip(t / .22, 0, 1)) ** 2          # başta aşağıdan kayarak giriş
    ph = rng.uniform(0, 2 * np.pi)
    lf += vd / 1200 * np.sin(2 * np.pi * vib_hz * t * (1 + .03 * np.sin(2 * np.pi * .3 * t)) + ph)
    fc = 2 ** lf
    if son_sonus:   # son nota tutuşu boyunca sönerek kaybolur (çözülmeden)
        i0 = int((T - durs[-1]) * SR); amp[i0:] *= np.concatenate([np.linspace(1, 0, n - i0 - int(rel * SR)) ** 1.5, np.zeros(int(rel * SR))])
    ka = int(.14 * SR); amp[:ka] *= .5 - .5 * np.cos(np.pi * np.arange(ka) / ka)
    kr = int(rel * SR); amp[n - kr:] *= .5 + .5 * np.cos(np.pi * np.arange(kr) / kr)
    gm = 2 ** np.mean(lf[: int(T * SR)])
    o = en_yakin(flutler, gm)
    ratio = fc / o.f0
    pos = .05 * SR + np.concatenate([[0.], np.cumsum(ratio[:-1])])
    ton = interp(o.uzat(int(pos[-1]) + 8), pos)
    faz = 2 * np.pi * np.cumsum(fc) / SR
    nz = lambda c: (lambda z: z / (rms(z) + 1e-12))(lp(rng.standard_normal(n), c))
    b1 = nz(45) * np.sin(faz); b2 = nz(60) * np.sin(2 * faz + 1.0)
    hava = bp_(rng.standard_normal(n), 300, 2400); hava /= rms(hava)
    ufle = np.exp(-t / .07) * (t < .5)
    nef = (.022 * b1 + .010 * b2 + .010 * hava * (1 + 3 * ufle)) * nefes
    y = (ton + nef[:, None] * np.array([1, .9])) * amp[:, None]
    return lp(y, 3000, 2)


# =====================================================================================================
# AĞIT – BESTE
# =====================================================================================================
BPM = 52
b = 60 / BPM                      # vuruş (s)
A_n = int(round(4 * b * SR))      # giriş: 1 ölçü
L = int(round(64 * b * SR))       # döngü gövdesi: 16 ölçü
C_n = int(round(6.6 * SR))        # kapanış
T_n = A_n + L + C_n
rng = np.random.default_rng(TOHUM)


def V(vurus): return vurus * b   # gövde içi vuruş → saniye


def main():
    os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
    V2 = "VSCO-2-CE"; VC = "VCSL"
    # ---------------- örnekler ----------------
    cello_v3 = [Ornek(yol_cc0(V2, f"Strings/Cello Section/susvib/susvib_{k}_v3_1.wav"), f_nom=hz(a)) for k, a in
                (("G1", "G2"), ("B1", "B2"), ("D2", "D3"), ("F2", "F3"), ("A2", "A3"), ("C3", "C4"))]
    cello_v1 = [Ornek(yol_cc0(V2, f"Strings/Cello Section/susvib/susvib_{k}_v1_1.wav"), f_nom=hz(a)) for k, a in
                (("G1", "G2"), ("B1", "B2"), ("D2", "D3"), ("F2", "F3"), ("A2", "A3"))]
    kb_D = Ornek(yol_sfx("muzik/kontrbas_D1"), f_nom=hz("D2"))
    kb = [Ornek(yol_cc0(V2, f"Strings/Solo Contrabass/SusNV/BKCtbss_SusNV_{k}_v1_rr1.wav"), f_nom=hz(a)) for k, a in
          (("A#0", "Bb1"), ("C1", "C2"), ("D1", "D2"))]
    flut = [Ornek(yol_cc0(V2, f"Woodwinds/Flute/susNV/LDFlute_susNV_{k}_v1_1.wav"), f_nom=hz(a)) for k, a in
            (("E3", "E4"), ("A3", "A4"), ("C4", "C5"))]
    davul = [Ornek(yol_cc0(VC, f"Membranophones/Struck Membranophones/Bass Drum 2/bassdrum_hit_{k}.wav"), f0=42.1, norm="tepe", esik=-50)
             for k in ("pp1", "pp2")]
    timp = Ornek(yol_cc0(VC, "Membranophones/Struck Membranophones/Timpani 2/Hit/Timpani1B_hit_v3_rr1_main.wav"), f0=74.02, norm="tepe", esik=-50)
    for o in cello_v3 + cello_v1 + kb + [kb_D] + flut:
        print(f"  {o.ad:44s} f0 {o.f0:8.2f} Hz  sürdürme {o.on / SR:4.2f}–{o.off / SR:5.2f} s")

    # ---------------- ZEMİN: kontrbas + çello (v1, yumuşak) akorları ----------------
    zem = Dongu(L)
    # (başlangıç vuruşu, süre vuruş, bas, üst sesler) – ağıt basında inen dörtlü: D – C – B♭ – A
    AKOR = [(60, 24, "D2", ["A2", "D3", "F3"]),      # 16. ölçüden 5. ölçü sonuna (döngü başına sarar): Dm
            (20, 4, "C2", ["A2", "C3", "F3"]),        # F/C
            (24, 4, "Bb1", ["Bb2", "D3", "G3"]),      # Gm/B♭
            (28, 4, "A1", ["A2", "C3", "G3"]),        # Aø (E♭ melodide)
            (32, 8, "D2", ["A2", "D3", "F3"]),        # Dm – çözülmeyen E♭'in altında
            (40, 4, "Bb1", ["Bb2", "D3", "F3"]),      # B♭
            (44, 4, "G1", ["G2", "Bb2", "D3"]),       # Gm
            (48, 8, "D2", ["A2", "D3", "F3"]),        # Dm (ney girer)
            (56, 4, "A1", ["A2", "C3", "G3"])]        # A°: ney'in F♯–E♭'i ile Hicaz dominantı
    for bas_v, sure_v, bas, ust in AKOR:
        t0 = V(bas_v) - .35; d = V(sure_v) + .35
        fb = hz(bas)
        if bas == "D2":
            y = nota(kb_D, fb, d, att=1.2, rel=1.6, bas=.4)
            zem.ekle(t0, lp(hp(y, 40, 3), 900), .34)
        else:
            y = nota(en_yakin(kb, fb), fb, d, att=1.0, rel=1.6, bas=.4)
            zem.ekle(t0, lp(hp(y, 40, 3), 900), .40)
        for k, s in enumerate(ust):
            f = hz(s); o = en_yakin(cello_v1, f)
            y = nota(o, f, d, att=1.3 + .25 * k, rel=1.8, bas=.3 + .2 * k)
            zem.ekle(t0 + .06 * k, lp(hp(y, 75), 2200), .30 - .03 * k, pan=(-.35, .3, -.1)[k])
    zem_dry = hp(zem.b, 35, 3)

    # ---------------- MELODİ: çello (v3) – ağıt cümleleri ve yarım kalan motif ----------------
    mel = Dongu(L)
    # (vuruş, nota, süre vuruş, dinamik, zarf-türü)  zarf: "s" şişen, "d" düz, "f" sönen (çözülmeden kaybolur)
    CELLO = [
        # 1. cümle (2.–3. ölçü): pes bir iç çekiş F – E♭ – D
        (5.0, "F3", 1.5, .55, "s"), (6.5, "Eb3", 1.0, .52, "d"), (7.5, "D3", 3.5, .50, "f"),
        # LEITMOTIF (5.–9. ölçü): yavaşlatılmış, minörleşmiş, yarım kalan
        (16.0, "A3", 2.0, .78, "s"), (18.0, "Bb3", 2.0, .84, "s"), (20.0, "A3", 4.0, .90, "s"),
        (24.0, "G3", 2.0, .80, "d"), (26.0, "F3", 2.0, .74, "d"), (28.0, "G3", 2.0, .80, "s"),
        (30.0, "Eb3", 6.5, .82, "f"),
        # 2. cümle (11.–13. ölçü): daha yüksek, cevap; La'da (dominant) asılı kalır
        (40.0, "D4", 2.0, .66, "s"), (42.0, "C4", 1.0, .64, "d"), (43.0, "Bb3", 1.0, .64, "d"),
        (44.0, "A3", 3.0, .72, "s"), (47.0, "G3", 1.0, .58, "d"), (48.0, "F3", 3.0, .52, "f"),
    ]
    ZARF = {"s": [(0, .78), (.45, 1.0), (1, .86)], "d": [(0, .95), (1, .9)], "f": [(0, 1.0), (.2, 1.0), (1, .0)]}

    def cello_hatti(iz, notalar, t_of, pan=-.12, kaz=1.45):
        for i, (v, s, d, dyn, z) in enumerate(notalar):
            f = hz(s); o = en_yakin(cello_v3, f)
            onc = notalar[i - 1] if i else None
            leg = onc is not None and abs(onc[0] + onc[2] - v) < 1e-6
            sonr = notalar[i + 1] if i + 1 < len(notalar) else None
            sonra_leg = sonr is not None and abs(v + d - sonr[0]) < 1e-6
            jit = float(rng.normal(0, .018))
            rel = .16 if sonra_leg else (.5 if z == "f" else 1.0)
            if leg:
                y = nota(o, f, V(d), att=.12, rel=rel, bas=.45, kayma=(hz(onc[1]), .14), zarf=ZARF[z])
                iz.ekle(t_of(v) - .06 + jit, lp(tiz_raf(hp(y, 70), 1800, -4), 3200), dyn * kaz, pan)
            else:
                y = nota(o, f, V(d), att=.07, rel=rel, bas=.02, zarf=ZARF[z])
                iz.ekle(t_of(v) + jit, lp(tiz_raf(hp(y, 70), 1800, -4), 3200), dyn * kaz, pan)

    cello_hatti(mel, CELLO, V)

    # ney: motifin ikinci yarısı Hicaz renginde (F♯ −15 sent, E♭ +15 sent), yine çözülmeden
    NEY = [(hz("A4"), 3.0, .75), (hz("Bb4"), 1.0, .85), (hz("A4"), 2.0, .8), (hz("G4"), 1.0, .72),
           (hz("F#4", -15), 1.0, .78), (hz("G4"), 1.0, .74), (hz("Eb4", 15), 3.5, .7)]
    ney = ney_cumle(NEY, b, flut, rng, rel=.6, son_sonus=True)
    ir_uzak = ir_yap(3.2, 4.0, TOHUM + 7, on_gecikme=.03, rt_tiz=1.0)
    ney = oda(np.vstack([ney, np.zeros((int(3.5 * SR), 2))]), ir_uzak, .35)
    mel.ekle(V(49.5), ney, .62, pan=.22)
    mel_dry = mel.b

    # ---------------- RİTİM: kalp atışı (büyük davul, D2'ye akortlu) + uzak timpani ----------------
    rit = Dongu(L)
    davul_D = hz("D2") / 42.1

    def kalp(iz, t, g):
        for k, (o, gg, dt) in enumerate(((davul[0], 1.0, 0), (davul[1], .55, .30))):
            n = int(1.9 * SR); pos = np.arange(n) * davul_D
            y = interp(o.x, pos) * np.exp(-np.arange(n) / SR / .55)[:, None]
            y[: int(.012 * SR)] *= np.linspace(0, 1, int(.012 * SR))[:, None]
            iz.ekle(t + dt, lp(hp(y, 45, 3), 320), g * gg * .7)

    def timpani(iz, t, g):
        n = int(5.0 * SR); pos = np.arange(n) * (hz("D2") / timp.f0)
        y = interp(timp.x, pos) * yumusak(n, int(1.2 * SR), n, yukari=False)[:, None]
        y[: int(.015 * SR)] *= np.linspace(0, 1, int(.015 * SR))[:, None]
        iz.ekle(t, lp(hp(y, 45, 3), 700), g * .8)

    # ölçünün 2. vuruşunda (döngü noktası sakin kalsın), seyrek; motif ve doruk ölçülerinde her ölçü
    KALP = [(1, .55), (9, .55), (17, .7), (21, .62), (25, .66), (29, .7), (33, .74), (37, .62), (41, .62),
            (45, .66), (49, .6), (57, .52), (62, .45)]
    for v, g in KALP: kalp(rit, V(v) + float(rng.normal(0, .012)), g)
    for v, g in ((16, .5), (32, .55), (48, .45)): timpani(rit, V(v) - .02, g)
    rit_dry = rit.b

    # ---------------- oda yankısı (dairesel: döngü gövdesinin kararlı hâli) ----------------
    ir = ir_yap(1.8, 2.6, TOHUM)
    zem_w = oda(zem_dry, ir, .18, True); mel_w = oda(mel_dry, ir, .18, True); rit_w = oda(rit_dry, ir, .20, True)

    # ---------------- giriş / kapanış ----------------
    g_in_z = yumusak(A_n, 0, A_n); g_in_r = yumusak(A_n, int(1.2 * SR), A_n) * .6 + yumusak(A_n, 0, A_n) * .4
    g_in_m = yumusak(A_n, A_n - int(.4 * SR), A_n)
    g_out_z = yumusak(C_n, 0, C_n - int(.3 * SR), yukari=False)
    g_out_r = yumusak(C_n, int(1.5 * SR), int(3.6 * SR), yukari=False)
    g_out_m = yumusak(C_n, 0, int(1.4 * SR), yukari=False)
    # kapanış olayı: çellonun kırık son sözü A3 – B♭3 – A3 … (çözülmez)
    ek_m = Iz(T_n); B0 = (A_n + L) / SR
    SON = [(0.0, "A3", 1.0, .6, "d"), (1.0, "Bb3", 1.0, .62, "d"), (2.0, "A3", 3.2, .6, "f")]
    cello_hatti(ek_m, SON, lambda v: B0 + .25 + V(v), pan=-.12)
    ek_m = oda(ek_m.b, ir, .18)
    zem_t = birlestir(zem_w, A_n, C_n, g_in_z, g_out_z, 0)
    rit_t = birlestir(rit_w, A_n, C_n, g_in_r, g_out_r, 0)
    mel_t = birlestir(mel_w, A_n, C_n, g_in_m, g_out_m, ek_m)
    son = yumusak(T_n, T_n - int(.35 * SR), T_n, yukari=False)[:, None]
    zem_t *= son; rit_t *= son; mel_t *= son

    # ---------------- seviye: tam miks RMS = -20 dBFS (aynı kazanç bütün katmanlara) ----------------
    tam = zem_t + rit_t + mel_t
    g = 10 ** (-20 / 20) / rms(tam)
    zem_t *= g; rit_t *= g; mel_t *= g; tam *= g
    print(f"katman RMS: zemin {db(rms(zem_t)):.1f}  ritim {db(rms(rit_t)):.1f}  melodi {db(rms(mel_t)):.1f}  tam {db(rms(tam)):.1f} dBFS, tepe {db(np.abs(tam).max()):.1f}")

    # ---------------- VURGU (sting): Re pedalı + timpani + çello B♭3 → A3 (açık kalır) ----------------
    vn = int(5.4 * SR); vz = Iz(vn + int(2.6 * SR))
    timpani(vz, .0, .55); kalp(vz, .0, .6)
    vz.ekle(.0, lp(nota(kb_D, hz("D2"), 3.6, att=.25, rel=1.6, bas=.4), 900), .5)
    for k, s in enumerate(("A2", "D3", "F3")):
        f = hz(s); vz.ekle(.03 * k, lp(nota(en_yakin(cello_v1, f), f, 3.4, att=.35 + .1 * k, rel=1.7, bas=.3), 2200), .3 - .03 * k, pan=(-.35, .3, -.1)[k])
    vm = Iz(vn + int(2.6 * SR))
    cello_hatti(vm, [(0.0, "Bb3", .8, .8, "s"), (.8, "A3", 2.4, .78, "f")], lambda v: .12 + V(v))
    vurgu = oda(vz.b, ir, .2) + oda(vm.b, ir, .18)
    vurgu = vurgu[:vn] * yumusak(vn, vn - int(1.2 * SR), vn, yukari=False)[:, None]
    vurgu *= 10 ** (-19 / 20) / rms(vurgu[: int(3.5 * SR)])
    if np.abs(vurgu).max() > 10 ** (-1.5 / 20): vurgu *= 10 ** (-1.5 / 20) / np.abs(vurgu).max()

    # ---------------- yaz ----------------
    dosya = {}
    for ad, x in (("tam", tam), ("zemin", zem_t), ("ritim", rit_t), ("melodi", mel_t), ("vurgu", vurgu)):
        p = os.path.join(OUT, f"{ID}__{ad}.flac"); yaz_flac(p, x); dosya[ad] = p
    mp3 = os.path.join(HERE, "onizleme.mp3")
    sh(["ffmpeg", "-v", "error", "-y", "-i", dosya["tam"], "-c:a", "libmp3lame", "-b:a", "128k", mp3])

    # ---------------- ölç ----------------
    o = olc(tam, A_n, A_n + L)
    o.update(ebur128(dosya["tam"]))
    o["katman_toplami_hata_maks"] = float(np.abs(zem_t + rit_t + mel_t - tam).max())
    o["katman_rms_dbfs"] = {"zemin": round(db(rms(zem_t)), 2), "ritim": round(db(rms(rit_t)), 2), "melodi": round(db(rms(mel_t)), 2)}
    hv, mv, _ = spektrum_oranlari(vurgu)
    o["vurgu"] = {"sure_sn": round(vn / SR, 2), "rms_dbfs": round(db(rms(vurgu)), 2), "tepe_dbfs": round(db(np.abs(vurgu).max()), 2),
                  "tiz_4k_ustu_oran": round(hv, 4), "konusma_1k5_4k_oran": round(mv, 4)}
    gorsel(dosya["tam"], os.path.join(TMP, "spektrogram.png"), T_n / SR)
    gorsel(dosya["vurgu"], os.path.join(TMP, "vurgu_spektrogram.png"), vn / SR)
    for k, v in o.items(): print(f"  {k}: {v}")

    # ---------------- meta + kaynaklar ----------------
    meta = {
        "id": ID, "ad": "Ağıt / Çöküş", "tarz": "ağıt; yavaş, seyrek, derin (solo çello hattı, kontrbas–çello zemini, uzak kalp atışı, ney benzeri tek hat)",
        "kullanim": ["Ankara 1402 – Bayezid'in esir düşüşü", "Kosova 1389 – Murad'ın ölümü", "Süleyman Paşa'nın ölümü (1357)",
                     "Zigetvar 1566 – Kanuni'nin ölümü", "Viyana 1683 bozgunu", "1922 – saltanatın sonu (seri finali)",
                     "sezon finalleri, kayıp/yenilgi/ölüm sahneleri, 'bir dönemin sonu' anlatımı"],
        "donem": [1, 2, 3, 4, 5, 8],
        "ton_makam": "Re (D) merkezli Kürdi/minör renk (D E♭ F G A B♭ C); ney cümlesinde Hicaz'a yaklaşım (F♯ −15 sent, E♭ +15 sent), çello/zemin 12-TET",
        "bpm": BPM, "usul_olcu": "4/4, serbest rubato; usul yok (kalp atışı ölçü başlarında, seyrek)",
        "sure": round(T_n / SR, 3), "dongu": [round(A_n / SR, 6), round((A_n + L) / SR, 6)], "dongu_ornek": [A_n, A_n + L],
        "katmanlar": [
            {"ad": "zemin", "dosya": f"out/{ID}__zemin.flac", "icerik": "kontrbas pedalı ve ağıt basında inen dörtlü (D–C–B♭–A), yumuşak çello akorları"},
            {"ad": "ritim", "dosya": f"out/{ID}__ritim.flac", "icerik": "uzak kalp atışı (büyük davul, D2'ye akortlu, 'lub-dub'), 3 yumuşak timpani (D2)"},
            {"ad": "melodi", "dosya": f"out/{ID}__melodi.flac", "icerik": "çello: iç çekiş, yarım kalan leitmotif, cevap cümlesi; sonda ney benzeri tek hat (Hicaz rengi)"},
            {"ad": "vurgu", "dosya": f"out/{ID}__vurgu.flac", "icerik": "5.4 sn kapanış: timpani + kalp atışı + Re pedalı, çello B♭3 → A3 (çözülmez)"}],
        "yogunluk": "dusuk",
        "leitmotif": "yavaşlatılmış (değerler ×2), minörleşmiş (F♯→F) ve yarım kalan: A3 B♭3 A3 G3 | F3 G3 E♭3 (Re'ye inmez); "
                     "ney'de ikinci yarı Hicaz rengiyle tekrar, yine E♭'te asılı; kapanışta A3 B♭3 A3 kırığı",
        "olcumler": o,
        "kaynaklar": [f"{v[0]} · {v[1]} · {v[2]}" for v in KAYNAK.values()],
    }
    json.dump(meta, open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    with open(os.path.join(HERE, "KAYNAKLAR.tsv"), "w", encoding="utf-8") as f:
        f.write("dosya\tdepo\tyol\tlisans\n")
        for k, (repo, path, lis) in KAYNAK.items():
            f.write(f"{os.path.basename(path)}\t{repo}\t{path}\t{lis}\n")
    print("tamam →", OUT)


if __name__ == "__main__":
    main()
