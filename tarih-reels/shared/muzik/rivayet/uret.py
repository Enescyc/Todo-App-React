#!/usr/bin/env python3
"""Rivayet / Rüya / Efsane (`rivayet`) – Osmanlı serisi müzik kütüphanesi.

Osman Bey'in rüyası, efsaneler, "kaynaklar ne diyor?" sorgusu. Gizemli, rüya gibi, zamansız; ritim yok.
Re (D) merkez: kadeh (cam sürtünme) dronu Re–La, perdeye kilitli 'fısıltı' havası, alçaltılmış Nepal çanları,
uzaktan ney benzeri serbest taksim (Hicaz'a yaklaşım, komalı) ve rüyanın ortasında TEK BAŞINA, uzaktan,
yarı saydam leitmotif (el çanları + uzun yankı): A4 B♭4 A4 G4 | F♯4 G4 E♭4 D4.

Kullanım:  python3 tarih-reels/shared/muzik/rivayet/uret.py
Çıktı:     out/rivayet__tam.flac, __zemin, __melodi, __vurgu (ritim katmanı YOK – bkz. meta.json)
           onizleme.mp3, meta.json, KAYNAKLAR.tsv; spektrogram /tmp/claude-0/muzik-rivayet/ altına.
Gerekenler: numpy, ffmpeg. Örnekler: shared/sfx (depoda) + VSCO-2-CE / VCSL kısmi klonları
           (CC0_KLON ortam değişkeni, varsayılan /tmp/claude-0/sfx; eksik dosyayı `git checkout` ile kendisi indirir).
Deterministiktir (sabit tohum).
"""
import json, os, re, subprocess, sys, zlib
import numpy as np

ID = "rivayet"
TOHUM = 1299

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


def nota(o, f, sure, att=.06, rel=.5, bas=0.0, kayma=None, zarf=None, esguc=False):
    """o: Ornek; f: Hz ya da örnek başına Hz dizisi; sure: tutuş (s); rel: bırakış (s);
    bas: örnek içinde başlangıç (s; legato için yay saldırısını atlar); kayma: (f_önceki, s) portamento;
    zarf: tutuş boyunca [(oran, değer)] dinamik eğrisi; esguc: giriş/bırakış eş-güç (sin/cos) rampaları
    (döngüde kendi kuyruğuyla örtüşen uzun dronlarda ilintisiz örtüşme seviyeyi düşürmesin diye)."""
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
    ka = max(1, int(att * SR)); kr = max(1, int(rel * SR))
    if esguc:
        a[:ka] = np.sin(np.pi / 2 * np.arange(ka) / ka); a[n - kr:] *= np.cos(np.pi / 2 * np.arange(kr) / kr)
    else:
        a[:ka] = .5 - .5 * np.cos(np.pi * np.arange(ka) / ka); a[n - kr:] *= .5 + .5 * np.cos(np.pi * np.arange(kr) / kr)
    if zarf:
        ns = int(sure * SR); z = np.ones(n); z[:ns] = egri(ns, zarf); z[ns:] = zarf[-1][1]; a *= z
    return y * a[:, None]


def yumusat_zarf(y, oran=.6, hizli=4.0, yavas=.2):
    """Yavaş sıkıştırıcı: hızlı genlik dalgalanmalarını (dB cinsinden) `oran` kadar azaltır, yavaş seyri korur."""
    p = y.mean(1) ** 2
    e1 = np.sqrt(np.maximum(lp(p, hizli, 1), 1e-12)); e2 = np.sqrt(np.maximum(lp(p, yavas, 1), 1e-12))
    return y * ((e2 / e1) ** oran)[:, None]


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


# Ortak oda: bütün tarzlarda aynı tohum → aynı mekân. Tohumlar, gürültü tabanlı yankının dar rezonans tepeleri
# serinin gam seslerine (D Hicaz/Kürdi, komalı ve 12-TET) en az denk gelecek biçimde 0–119 arasında tarandı.
ODA_TOHUM = 58


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
        k = np.clip((t[i0:i1] - t0 - .35) / .7, 0, 1) * np.clip((t0 + dd - t[i0:i1]) / .25, 0, 1)
        vd[i0:i1] = 4 + k * (vib_sent - 4) * (dd > .9)    # hep ~4 sent canlılık; uzun notada geciken tam titreşim
        t0 += dd
    ker = np.hanning(int(.085 * SR)); ker /= ker.sum()
    lf = np.convolve(np.pad(lf, (len(ker), len(ker)), "edge"), ker, "same")[len(ker):-len(ker)]
    ker2 = np.hanning(int(.16 * SR)); ker2 /= ker2.sum()
    amp = np.convolve(np.pad(amp, (len(ker2), len(ker2)), "edge"), ker2, "same")[len(ker2):-len(ker2)]
    lf += kaydir / 1200 * (1 - np.clip(t / .22, 0, 1)) ** 2          # başta aşağıdan kayarak giriş
    ph = rng.uniform(0, 2 * np.pi)
    lf += vd / 1200 * np.sin(2 * np.pi * vib_hz * t * (1 + .03 * np.sin(2 * np.pi * .3 * t)) + ph)
    sap = lp(np.cumsum(rng.standard_normal(n)), 1.2); lf += 3 / 1200 * (sap - sap.mean()) / (np.abs(sap - sap.mean()).max() + 1e-9)
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
    # flütten 'ney' kovukluğuna: perdeye kilitli 2. (≈−8 dB) ve 3. (≈−17 dB) harmonik, tonun kendi zarfıyla (sınırlı)
    e = np.sqrt(2 * np.maximum(lp(ton.mean(1) ** 2, 20, 1), 0))
    ton = ton + (e * (.40 * np.sin(2 * faz + .5) + .14 * np.sin(3 * faz + 1.1)))[:, None]
    nz = lambda c: (lambda z: z / (rms(z) + 1e-12))(lp(rng.standard_normal(n), c))
    b1 = nz(45) * np.sin(faz); b2 = nz(60) * np.sin(2 * faz + 1.0)
    hava = bp_(rng.standard_normal(n), 300, 2400); hava /= rms(hava)
    ufle = np.exp(-t / .07) * (t < .5)
    nef = (.022 * b1 + .010 * b2 + .010 * hava * (1 + 3 * ufle)) * nefes
    y = (ton + nef[:, None] * np.array([1, .9])) * amp[:, None]
    return lp(y, 3000, 2)


# =====================================================================================================
# RİVAYET – BESTE
# =====================================================================================================
BPM = 60                          # nominal; zaman serbest (1 vuruş = 1 sn)
A_n = int(5.0 * SR)               # giriş
L = int(68.0 * SR)                # döngü gövdesi
C_n = int(6.0 * SR)               # kapanış
T_n = A_n + L + C_n
rng = np.random.default_rng(TOHUM)
KOMA = lambda s: hz(s, {"F#": -15, "Eb": 15}.get(s[:-1], 0))    # Hicaz rengi


def fisilti(f, sure, rng, bw=18.0, att=3.0, rel=3.0, sapma=4.0, ton=.45):
    """Perdeye kilitli dar bant gürültü (rüzgârda şarkı söyleyen hava / uzak nefes) + çok az saf ton."""
    n = int(sure * SR); t = np.arange(n) / SR
    z = lp(rng.standard_normal((n, 2)), bw, 2); z /= rms(z)
    d = lp(np.cumsum(rng.standard_normal(n)), .25); d = (d - d.mean()) / (np.abs(d - d.mean()).max() + 1e-9) * sapma / 1200
    ph = 2 * np.pi * np.cumsum(f * 2 ** d) / SR
    y = z * np.sin(ph)[:, None] + ton * np.stack([np.sin(ph), np.sin(ph + .7)], 1)
    a = np.sin(np.pi / 2 * np.clip(t / att, 0, 1)) * np.cos(np.pi / 2 * np.clip((t - (sure - rel)) / rel, 0, 1))
    return y * a[:, None] * .1


def flajole(f, sure=3.4):
    """Arp flajoleti benzeri saf, yumuşak 'damla' (12 ms giriş)."""
    n = int(sure * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + .05 * np.sin(4 * np.pi * f * t + .3) + .015 * np.sin(6 * np.pi * f * t)
    e = (1 - np.exp(-t / .012)) * np.exp(-t / .95); e[-int(.3 * SR):] *= np.linspace(1, 0, int(.3 * SR))
    return np.stack([y, np.roll(y, 29)], 1) * e[:, None] * .12


def main():
    os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
    V2 = "VSCO-2-CE"; VC = "VCSL"
    # ---------------- örnekler ----------------
    kadeh = Ornek(yol_sfx("doku/kadeh_D#4"), f_nom=hz("D#5", 30))
    can1 = load(yol_sfx("doku/fx_uzun_1")); can2 = load(yol_sfx("doku/fx_uzun_2"))
    kb_D = Ornek(yol_sfx("muzik/kontrbas_D1"), f_nom=hz("D2"))
    cello_v1 = [Ornek(yol_cc0(V2, f"Strings/Cello Section/susvib/susvib_{k}_v1_1.wav"), f_nom=hz(a)) for k, a in (("D2", "D3"), ("A2", "A3"))]
    flut = [Ornek(yol_cc0(V2, f"Woodwinds/Flute/susNV/LDFlute_susNV_{k}_v1_1.wav"), f_nom=hz(a)) for k, a in
            (("E3", "E4"), ("A3", "A4"), ("C4", "C5"))]
    canlar = [Ornek(yol_cc0(VC, f"Idiophones/Struck Idiophones/Hand Chimes/sus_{k}_r01_main.wav"), f_nom=hz(a), norm="tepe", esik=-50)
              for k, a in (("D3", "D4"), ("E3", "E4"), ("F#3", "F#4"), ("G#3", "G#4"), ("A#3", "A#4"))]
    for o in canlar:   # el çanları: ilk 1.2 sn enerjisine göre eşitle (uzun çınlayan Re4 öbürlerini bastırmasın)
        o.x = o.x * (.12 / rms(o.x[: int(1.2 * SR)]))
    for o in [kadeh, kb_D] + cello_v1 + flut + canlar:
        print(f"  {o.ad:44s} f0 {o.f0:8.2f} Hz  sürdürme {o.on / SR:4.2f}–{o.off / SR:5.2f} s")

    ir = ir_yap(1.8, 2.6, ODA_TOHUM)                                    # ortak oda (agit ile aynı)
    ir_rua = ir_yap(4.6, 6.5, 58, on_gecikme=.035, rt_tiz=1.4)          # uzaklık / rüya salonu (tohum: gam seslerinde en düz)

    # ---------------- ZEMİN ----------------
    zem = Dongu(L); zemU = Dongu(L)
    # alçak sıcak dron: kontrbas D2 + çello D3, A3 (yumuşak); döngü boyunca kesintisiz (kendi kuyruğuna sarar)
    for o, f, g, pan in ((kb_D, hz("D2"), .15, 0), (cello_v1[0], hz("D3"), .20, -.3), (cello_v1[1], hz("A3"), .12, .3)):
        y = nota(o, f, 68.0 + 5.0, att=5.0, rel=5.0, bas=.6, esguc=True)
        zem.ekle(-5.0, lp(hp(y, 40, 3), 1400), g, pan)
    # kadeh dronu: Re5 sürekli, La4 iki bölümde (rüya ortasında çekilir)
    y = nota(kadeh, hz("D5"), 68.0 + 5.0, att=5.0, rel=5.0, bas=.3, esguc=True)
    zemU.ekle(-5.0, lp(yumusat_zarf(y), 2500), .07, -.2)
    for t0, d in ((3.0, 27.0), (44.0, 22.0)):
        y = nota(kadeh, hz("A4"), d, att=3.5, rel=3.5, bas=2.0, esguc=True)
        zemU.ekle(t0, lp(yumusat_zarf(y), 2500), .058, .35)
    # fısıltı havası (Re–La–Re), 44. sn'de gelir, 27–30 arası çekilir (motif tek başına kalsın)
    for f, g, pan in ((hz("D4"), .55, -.4), (hz("A4"), .36, .4), (hz("D5"), .22, 0)):
        zemU.ekle(43.0, fisilti(f, 55.0, rng, att=4.0, rel=4.0), g, pan)
    # Nepal çanları: ~1.15 oktav pes (0.4527×): kısmi sesler La4–Re5–La5'e oturur; yumuşak giriş, alçak seviye
    for x, t0, g in ((can1, 60.0, .055), (can2, 43.0, .05)):
        n = int(len(x) / .4527) - 8; y = interp(x, np.arange(n) * .4527)
        y = lp(hp(y, 150), 1800) * (yumusak(n, 0, int(3 * SR)) * yumusak(n, n - int(6 * SR), n, yukari=False))[:, None]
        zemU.ekle(t0, y, g)
    # rüya ortasında (29–44 sn) alçak dron ve kadeh La'sı geri çekilir
    oto = 1 - .55 * (yumusak(L, int(27 * SR), int(31 * SR)) * yumusak(L, int(42 * SR), int(46 * SR), yukari=False))
    zem.b *= oto[:, None]
    zem_w = oda(zem.b, ir, .18, True) + oda(oda(zemU.b, ir_rua, .45, True), ir, .18, True)

    # ---------------- MELODİ ----------------
    mel = Dongu(L); melU = Dongu(L)
    # uzak ney taksimi (serbest zaman; süreler saniye)
    NEY = [(7.0, .25, [("G4", 2.4, .7), ("A4", .8, .8), ("G4", 2.4, .68)]),
           (14.4, -.1, [("A4", 1.0, .72), ("Bb4", .7, .74), ("C5", 1.6, .72), ("Bb4", .6, .68), ("A4", 2.4, .66)]),
           (22.0, .15, [("G4", .8, .7), ("F#4", .6, .72), ("Eb4", 1.3, .75), ("F#4", .7, .72), ("G4", 2.6, .66)]),
           (46.8, -.2, [("D5", 2.2, .52), ("C5", .7, .6), ("Bb4", .7, .66), ("A4", 2.6, .68)]),
           (54.6, .1, [("G4", .9, .7), ("F#4", .6, .7), ("Eb4", 1.0, .72), ("D4", 3.8, .66)])]
    for k, (t0, pan, cm) in enumerate(NEY):
        y = ney_cumle([(KOMA(s), d, v) for s, d, v in cm], 1.0, flut, rng, rel=.7, son_sonus=k in (2, 4), vib_sent=11)
        melU.ekle(t0, lp(y, 2600), .6, pan)
    # LEITMOTIF – rüyanın ortasında tek başına: el çanları (yumuşatılmış saldırı) + ince cam hâlesi
    MOTIF = [("A4", 1.0, .5), ("Bb4", 1.0, .5), ("A4", 2.0, .5), ("G4", 1.0, .46), ("F#4", 1.05, .46), ("G4", 1.1, .46), ("Eb4", 1.25, .46), ("D4", 3.6, .38)]

    def can_nota(f, sure=5.0, hale=True):
        o = en_yakin(canlar, f); n = int(sure * SR)
        y = interp(o.x, np.arange(n) * (f / o.f0) + 4)
        k = int(.028 * SR); y[:k] *= (.5 - .5 * np.cos(np.pi * np.arange(k) / k))[:, None]   # tokmak sesini yumuşat
        y *= yumusak(n, n - int(1.2 * SR), n, yukari=False)[:, None]
        if hale:   # cam hâlesi: aynı perdede yavaş girişli saf ton (yarı saydam sürdürme)
            t = np.arange(n) / SR; h = np.sin(2 * np.pi * f * t) * (1 - np.exp(-t / .35)) * np.exp(-t / 1.6)
            y = y + .05 * np.stack([h, np.roll(h, 41)], 1)
        return lp(y, 2000, 3)

    t = 31.5
    for s, d, g in MOTIF:
        melU.ekle(t + float(rng.normal(0, .015)), can_nota(KOMA(s)), g, pan=float(rng.uniform(-.2, .2)))
        t += d
    for t0, s in ((3.0, "D5"), (13.2, "A4"), (45.0, "D5"), (63.0, "A4")):
        mel.ekle(t0, flajole(hz(s)), .5, pan=float(rng.uniform(-.4, .4)))
    mel_w = oda(mel.b, ir, .18, True) + oda(oda(melU.b, ir_rua, .5, True), ir, .18, True)

    # ---------------- giriş / kapanış ----------------
    g_in_z = yumusak(A_n, 0, A_n); g_in_m = yumusak(A_n, A_n - int(1.5 * SR), A_n)
    g_out_z = yumusak(C_n, int(1.0 * SR), C_n, yukari=False) ** .7
    g_out_m = yumusak(C_n, 0, int(2.0 * SR), yukari=False)
    B0 = (A_n + L) / SR
    ek = Iz(T_n); ek.ekle(B0 + .6, can_nota(hz("D4"), 5.0), .36, -.05)
    ek_m = oda(oda(ek.b, ir_rua, .5), ir, .18)
    zem_t = birlestir(zem_w, A_n, C_n, g_in_z, g_out_z, 0)
    mel_t = birlestir(mel_w, A_n, C_n, g_in_m, g_out_m, ek_m)
    son = yumusak(T_n, T_n - int(.35 * SR), T_n, yukari=False)[:, None]
    zem_t *= son; mel_t *= son

    # ---------------- seviye ----------------
    tam = zem_t + mel_t
    g = 10 ** (-20 / 20) / rms(tam)
    zem_t *= g; mel_t *= g; tam *= g
    print(f"katman RMS: zemin {db(rms(zem_t)):.1f}  melodi {db(rms(mel_t)):.1f}  tam {db(rms(tam)):.1f} dBFS, tepe {db(np.abs(tam).max()):.1f}")

    # ---------------- VURGU: rüyaya geçiş (ters şişme → el çanı ikilisi D4+A4) ----------------
    vn = int(5.2 * SR); vU = Iz(vn + int(3 * SR)); tz = 1.6
    sis = lambda n: (np.clip(np.arange(n) / (tz * SR), 0, 1) ** 2.2 * np.exp(-np.maximum(np.arange(n) / SR - tz, 0) / 1.3))[:, None]
    for f, gg, pan in ((hz("D4"), .55, -.4), (hz("A4"), .4, .4), (hz("D5"), .25, 0)):
        y = fisilti(f, 5.0, rng, att=.05, rel=.5); vU.ekle(0, y * sis(len(y)), gg * 1.6, pan)
    y = nota(kadeh, hz("D5"), 4.5, att=.05, rel=.5, bas=1.0); vU.ekle(0, lp(y, 2500) * sis(len(y)), .12)
    vU.ekle(tz - .02, can_nota(hz("D4"), 4.0), .55, -.1); vU.ekle(tz + .03, can_nota(hz("A4"), 4.0), .4, .15)
    vU.ekle(tz + .05, flajole(hz("D5")), .45, .3)
    vurgu = oda(oda(vU.b, ir_rua, .45), ir, .18)
    vurgu = vurgu[:vn] * yumusak(vn, vn - int(1.0 * SR), vn, yukari=False)[:, None]
    vurgu *= 10 ** (-19 / 20) / rms(vurgu[: int(3.5 * SR)])
    if np.abs(vurgu).max() > 10 ** (-1.5 / 20): vurgu *= 10 ** (-1.5 / 20) / np.abs(vurgu).max()

    # ---------------- yaz ----------------
    dosya = {}
    for ad, x in (("tam", tam), ("zemin", zem_t), ("melodi", mel_t), ("vurgu", vurgu)):
        p = os.path.join(OUT, f"{ID}__{ad}.flac"); yaz_flac(p, x); dosya[ad] = p
    eski = os.path.join(OUT, f"{ID}__ritim.flac")
    if os.path.exists(eski): os.remove(eski)
    mp3 = os.path.join(HERE, "onizleme.mp3")
    sh(["ffmpeg", "-v", "error", "-y", "-i", dosya["tam"], "-c:a", "libmp3lame", "-b:a", "128k", mp3])

    # ---------------- ölç ----------------
    o = olc(tam, A_n, A_n + L)
    o.update(ebur128(dosya["tam"]))
    o["katman_toplami_hata_maks"] = float(np.abs(zem_t + mel_t - tam).max())
    o["katman_rms_dbfs"] = {"zemin": round(db(rms(zem_t)), 2), "melodi": round(db(rms(mel_t)), 2)}
    hv, mv, _ = spektrum_oranlari(vurgu)
    o["vurgu"] = {"sure_sn": round(vn / SR, 2), "rms_dbfs": round(db(rms(vurgu)), 2), "tepe_dbfs": round(db(np.abs(vurgu).max()), 2),
                  "tiz_4k_ustu_oran": round(hv, 4), "konusma_1k5_4k_oran": round(mv, 4)}
    gorsel(dosya["tam"], os.path.join(TMP, "spektrogram.png"), T_n / SR)
    gorsel(dosya["vurgu"], os.path.join(TMP, "vurgu_spektrogram.png"), vn / SR)
    for k, v in o.items(): print(f"  {k}: {v}")

    # ---------------- meta + kaynaklar ----------------
    meta = {
        "id": ID, "ad": "Rivayet / Rüya / Efsane",
        "tarz": "rüya, gizem, zamansızlık; ritimsiz doku (kadeh dronu, fısıltı havası, alçak Nepal çanları), uzak ney benzeri taksim, tek başına leitmotif (el çanları)",
        "kullanim": ["Osman Bey'in rüyası", "Bilecik düğün baskını rivayeti", "demir kafes efsanesi",
                     "'RİVAYET' rozetli bütün anlar", "'kaynaklar ne diyor?' sorgusu", "geçmişe dönüş / rüyaya geçişler (vurgu dosyası)"],
        "donem": [1, 2, 3, 4, 5, 6, 7, 8],
        "ton_makam": "Re (D) merkez; Hicaz'a yaklaşım (D E♭ F♯ G A B♭ C, ney ve motifte E♭ +15 sent, F♯ −15 sent), dronlar Re–La boş beşli",
        "bpm": BPM, "usul_olcu": "serbest zaman (ölçüsüz taksim); usul ve ritim yok – ♩=60 yalnız nominal",
        "sure": round(T_n / SR, 3), "dongu": [round(A_n / SR, 6), round((A_n + L) / SR, 6)], "dongu_ornek": [A_n, A_n + L],
        "katmanlar": [
            {"ad": "zemin", "dosya": f"out/{ID}__zemin.flac", "icerik": "kadeh (cam sürtünme) dronu Re5/La4, fısıltı havası Re–La–Re, alçak kontrbas+çello dronu, alçaltılmış Nepal çanları"},
            {"ad": "ritim", "dosya": None, "icerik": "YOK – bu tarz ritimsizdir; motor bu katmanı atlamalı"},
            {"ad": "melodi", "dosya": f"out/{ID}__melodi.flac", "icerik": "uzak ney benzeri taksim (5 cümle, Hicaz), rüya ortasında tek başına leitmotif (el çanları + cam hâlesi), seyrek flajole damlaları"},
            {"ad": "vurgu", "dosya": f"out/{ID}__vurgu.flac", "icerik": "5.2 sn rüyaya geçiş: ters şişen hava + kadeh → el çanı ikilisi Re4+La4 ve flajole"}],
        "ritim_katmani": False,
        "yogunluk": "dusuk",
        "leitmotif": "rüyanın ortasında (gövde 31.5–44 sn, tam dosyada 36.5–49 sn) tek başına, el çanlarıyla, uzun yankıyla: "
                     "A4 B♭4 A4 G4 | F♯4 G4 E♭4 D4 (hafif rubato); bu sırada alçak dron ve fısıltı çekilir",
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
