#!/usr/bin/env python3
"""Akın / Savaş – Osmanlı tarihi serisi müzik kütüphanesi (tarz: akin).

Hızlı, nabzı yüksek: akıncı süvarileri ve meydan savaşları. 9/8 aksak (2+2+2+3) darbuka/def/davul,
timpani ostinatosu, kontrbas + çello spiccato ostinatosu, leitmotif kornoda ve violada parçalanmış hâlde (Re Hicaz).
♩ = 126 (sekizlik = 252/dk). Çatışma "çeliği" yok: enerji ritmik dürtüden gelir, tizler yumuşak.

Çalıştırma:  python3 tarih-reels/shared/muzik/akin/uret.py
Çıktı:       out/akin__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, 24 bit, stereo),
             onizleme.mp3 (128 kbps), meta.json (ölçümler dahil), KAYNAKLAR.tsv.
Gerekenler:  numpy, ffmpeg, git (CC0 örnekler gerektiğinde VSCO-2-CE / VCSL depolarından tek tek çekilir).
Deterministik: sabit tohum; aynı girdilerle aynı çıktı.
"""
import json, os, subprocess, sys
import numpy as np

ID = "akin"
SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
SFX = os.path.normpath(os.path.join(HERE, "..", "..", "sfx"))
OUT = os.path.join(HERE, "out")
TMP = os.environ.get("MUZIK_TMP", f"/tmp/claude-0/muzik-{ID}")
KLON = os.environ.get("MUZIK_KLON", "/tmp/claude-0/sfx")
REPOS = {"VSCO-2-CE": "https://github.com/sgossner/VSCO-2-CE", "VCSL": "https://github.com/sgossner/VCSL"}
KATMANLAR = ("zemin", "ritim", "melodi")
KULLANILAN = []          # (dosya-kimliği, depo, yol) – KAYNAKLAR.tsv / meta için

# =====================================================================================
# Çekirdek: örnek yükleme, süzgeç, perde kaydırma, yerleştirme, oda yankısı
# =====================================================================================
_CACHE = {}


def ornek_yolu(repo, path):
    """CC0 örneği yerel önbellekten verir; yoksa kısmi klondan `git show` ile tek dosya çeker."""
    dst = os.path.join(TMP, "ornek", repo, path)
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return dst
    rdir = os.path.join(KLON, repo)
    if not os.path.isdir(os.path.join(rdir, ".git")):
        rdir = os.path.join(TMP, "klon", repo)
        if not os.path.isdir(os.path.join(rdir, ".git")):
            subprocess.run(["git", "clone", "--filter=blob:none", "--no-checkout", "--depth", "1", REPOS[repo], rdir], check=True)
    data = subprocess.run(["git", "-C", rdir, "show", f"HEAD:{path}"], capture_output=True, check=True).stdout
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with open(dst, "wb") as f:
        f.write(data)
    return dst


def yukle(path):
    if path not in _CACHE:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
        _CACHE[path] = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
    return _CACHE[path]


def ornek(repo, path):
    if (repo, path) not in [(r, p) for _, r, p in KULLANILAN]:
        KULLANILAN.append((os.path.basename(path), repo, path))
    return yukle(ornek_yolu(repo, path))


def sfx(sid):
    if ("shared/sfx", sid) not in [(r, p) for _, r, p in KULLANILAN]:
        KULLANILAN.append((sid, "shared/sfx", sid))
    return yukle(os.path.join(SFX, sid + ".flac"))


def filtre(x, lo=None, hi=None, n_lo=2, n_hi=2, tepe=()):
    """Sıfır fazlı FFT süzgeci: Butterworth genlik eğrili alçak/yüksek geçiren + çan EQ'lar [(fc, bant_okt, dB)]."""
    pad = int(0.05 * SR)
    xp = np.concatenate([x, np.zeros((pad,) + x.shape[1:])])
    N = len(xp)
    f = np.fft.rfftfreq(N, 1 / SR)
    m = np.ones_like(f)
    if lo:
        m /= np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * n_lo))
    if hi:
        m /= np.sqrt(1 + (f / hi) ** (2 * n_hi))
    for fc, bw, g in tepe:
        m *= 10 ** (g / 20 * np.exp(-0.5 * (np.log2(np.maximum(f, 1) / fc) / bw) ** 2))
    X = np.fft.rfft(xp, axis=0)
    y = np.fft.irfft(X * (m[:, None] if xp.ndim == 2 else m), N, axis=0)
    return y[: len(x)]


def oku(x, inc, bas=0.0):
    """Örneği değişken hızla okur (perde kaydırma + glissando/vibrato). inc: çıkış örneği başına okuma adımı."""
    pos = bas + np.concatenate(([0.0], np.cumsum(inc[:-1])))
    ok = pos < len(x) - 2
    pos = np.minimum(pos, len(x) - 2)
    i = pos.astype(np.int64)
    fr = (pos - i)[:, None]
    y = x[i] * (1 - fr) + x[i + 1] * fr
    y[~ok] = 0
    return y


def kaydir(x, oran):
    """Sabit oranlı perde kaydırma (yeniden örnekleme). oran<1: pes, daha uzun."""
    n = int((len(x) - 2) / oran)
    return oku(x, np.full(n, oran))


def baslangic(x, esik_db=-36):
    e = np.abs(x).max(1)
    return int(np.argmax(e > e.max() * 10 ** (esik_db / 20)))


def rms(x):
    return float(np.sqrt(np.mean(x ** 2)) + 1e-12)


def yumusak_rampa(n):
    return np.sin(np.linspace(0, np.pi / 2, max(n, 1))) ** 2


def zarf(n, atak, birak, egri=1.0, esit_guc=False):
    """Yumuşak atak/bırakma zarfı. esit_guc=True: sin rampası (üst üste binen dron notalarında sabit güç)."""
    e = np.ones(n)
    a, r = min(int(atak * SR), n), min(int(birak * SR), n)
    us = 0.5 if esit_guc else 1.0
    if a:
        e[:a] = yumusak_rampa(a) ** us
    if r:
        e[n - r:] *= (yumusak_rampa(r)[::-1] ** us) ** egri
    return e


def yerles(sig, pan):
    if sig.ndim == 1:
        sig = np.stack([sig, sig], 1)
    a = (pan + 1) * np.pi / 4
    return sig * (np.array([np.cos(a), np.sin(a)]) * np.sqrt(2))


def uzat(x, hedef_n, rng, a_sn=0.5, xf_sn=0.35):
    """Sürekli sesi çapraz geçişli parçalarla uzatır (boru/zurna dronları için)."""
    if len(x) >= hedef_n:
        return x
    a = int(a_sn * SR)
    b = len(x) - int(0.8 * SR)
    xf = int(xf_sn * SR)
    out = x[:b].copy()
    while len(out) < hedef_n:
        seg_n = int(1.6 * SR)
        s = int(rng.integers(a, max(a + 1, b - seg_n - xf)))
        seg = x[s: s + seg_n + xf].copy()
        r = yumusak_rampa(xf)[:, None]
        seg *= rms(out[-xf:]) / (rms(seg[:xf]) + 1e-9) if rms(seg[:xf]) > 0 else 1
        out[-xf:] = out[-xf:] * np.sqrt(1 - r) + seg[:xf] * np.sqrt(r)
        out = np.concatenate([out, seg[xf:]])
    return out


class Bolum:
    """Bir bölümün (giriş / gövde / kapanış / vurgu) kuru katman tamponları."""

    def __init__(self, sure_sn, kuyruk_sn=4.0, periyodik=False):
        self.L = int(round(sure_sn * SR))
        self.n = self.L + int(kuyruk_sn * SR)
        self.periyodik = periyodik
        self.s = {k: np.zeros((self.n, 2)) for k in KATMANLAR}

    def ekle(self, katman, t, sig, kazanc=1.0, pan=0.0):
        i = int(round(t * SR))
        sig = yerles(sig, pan) * kazanc
        if i < 0:   # bölüm başından önceye düşen (insanileştirme kayması) olay kesilmez, 0'a kaydırılır
            i = 0
        m = min(len(sig), self.n - i)
        if m > 0:
            self.s[katman][i: i + m] += sig[:m]


def oda_ir():
    """Serinin ortak odası: ~1.8 sn, sıcak (tizler daha hızlı söner), 12 ms ön gecikme. Sabit tohum."""
    rng = np.random.default_rng(1299)
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    f = np.fft.rfftfreq(n, 1 / SR)
    bantlar = [(0, 300, 2.0), (300, 1200, 1.8), (1200, 3000, 1.3), (3000, 6000, 0.8), (6000, SR / 2 + 1, 0.4)]
    ir = np.zeros((n, 2))
    for ch in range(2):
        W = np.fft.rfft(rng.standard_normal(n))
        for lo, hi, rt in bantlar:
            b = np.fft.irfft(W * ((f >= lo) & (f < hi)), n)
            ir[:, ch] += b * np.exp(-6.91 * t / rt)
    pre = int(0.012 * SR)
    ir = np.concatenate([np.zeros((pre, 2)), ir])[:n]
    ir[pre:] *= np.minimum(1, np.arange(n - pre) / (0.010 * SR))[:, None]
    ir /= np.sqrt((ir ** 2).sum(0))
    return ir


IR = oda_ir()
ISLAK = 0.18


def yanki(x):
    n = len(x) + len(IR) - 1
    N = 1 << (n - 1).bit_length()
    y = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], N) * np.fft.rfft(IR[:, c], N), N)[:n] for c in range(2)], 1)
    out = y * ISLAK
    out[: len(x)] += x * (1 - ISLAK)
    return out


def katla(x, L):
    """Doğrusal gövde çıktısını L periyoduyla katlar → kusursuz döngü (kuyruklar başa eklenir)."""
    P = np.zeros((L, 2))
    for k in range(0, len(x), L):
        seg = x[k: k + L]
        P[: len(seg)] += seg
    return P


def birlestir(giris, govde, kapanis, b0, L, son_n, xf_sn=0.15, son_fade_sn=1.5):
    """Katman bazında: giriş (b0'da kapanır) + periyodik gövde [b0, b0+L) + gövde kuyrukları ve kapanış."""
    xf = int(xf_sn * SR)
    toplam = b0 + L + son_n
    w = np.ones(b0)
    w[b0 - xf:] = yumusak_rampa(xf)[::-1]
    sonuc = {}
    for k in KATMANLAR:
        y = np.zeros((toplam, 2))
        gi = yanki(giris.s[k])[:b0]
        y[:b0] += gi * w[:, None]
        gv = yanki(govde.s[k])
        P = katla(gv, L)
        y[b0: b0 + L] += P
        y[b0 - xf: b0] += P[L - xf:] * (1 - w[b0 - xf:])[:, None]   # önden çapraz geçiş (dron sürekliliği)
        tl = gv[L:]
        m = min(len(tl), son_n)
        y[b0 + L: b0 + L + m] += tl[:m]
        kp = yanki(kapanis.s[k])
        m = min(len(kp), son_n)
        y[b0 + L: b0 + L + m] += kp[:m]
        f = int(son_fade_sn * SR)
        y[-f:] *= yumusak_rampa(f)[::-1, None]
        sonuc[k] = y
    return sonuc


# ------------------------------- ölçüm --------------------------------------------
def spektrum(x, nfft=8192):
    m = x.mean(1) if x.ndim == 2 else x
    hop = nfft // 2
    w = np.hanning(nfft)
    P = np.zeros(nfft // 2 + 1)
    for i in range(0, len(m) - nfft, hop):
        P += np.abs(np.fft.rfft(m[i: i + nfft] * w)) ** 2
    return np.fft.rfftfreq(nfft, 1 / SR), P


def merkezler(x, pencere_sn=0.25):
    m = x.mean(1)
    n = int(pencere_sn * SR)
    w = np.hanning(n)
    f = np.fft.rfftfreq(n, 1 / SR)
    sel = (f >= 20) & (f <= 16000)
    c, r = [], []
    for i in range(0, len(m) - n + 1, n):
        seg = m[i: i + n]
        P = np.abs(np.fft.rfft(seg * w)) ** 2
        c.append((P[sel] * f[sel]).sum() / (P[sel].sum() + 1e-20))
        r.append(20 * np.log10(rms(seg)))
    return np.array(c), np.array(r)


def olc(x, b0=None, b1=None, olcu_n=None):
    o = {}
    o["rms_dbfs"] = round(20 * np.log10(rms(x)), 2)
    o["tepe_dbfs"] = round(20 * np.log10(np.abs(x).max() + 1e-12), 2)
    o["kirpilma_ornek"] = int((np.abs(x) >= 0.999).sum())
    f, P = spektrum(x)
    o["tiz_4k_ustu_oran"] = round(float(P[f > 4000].sum() / P.sum()), 4)
    o["konusma_1k5_4k_oran"] = round(float(P[(f >= 1500) & (f < 4000)].sum() / P.sum()), 4)
    o["spektral_merkez_ort_hz"] = round(float((P * f).sum() / P.sum()), 1)
    c, r = merkezler(x)
    gecerli = r > max(-50.0, o["rms_dbfs"] - 30)
    j = [abs(np.log2(c[i + 1] / c[i])) for i in range(len(c) - 1) if gecerli[i] and gecerli[i + 1]]
    o["merkez_sicrama_max_oktav"] = round(float(max(j)), 3) if j else 0.0
    o["merkez_sicrama_p99_oktav"] = round(float(np.percentile(j, 99)), 3) if j else 0.0
    n3 = int(3.0 * SR)
    st = np.array([20 * np.log10(rms(x[i: i + n3])) for i in range(0, len(x) - n3, SR)])
    ic = st[2:-3] if len(st) > 8 else st
    o["yogunluk_3sn_max_sicrama_db"] = round(float(np.max(np.abs(np.diff(ic)))), 2) if len(ic) > 1 else 0.0
    if b0 is not None:
        g = x[b0:b1]
        o["govde_rms_dbfs"] = round(20 * np.log10(rms(g)), 2)
        # Döngü dikişi: döngü sonu → başı geçişi, gövdedeki diğer ölçü başı geçişleriyle kıyaslanır
        # (dikiş bir ölçü başına denk gelir; orada da vuruş başlar – bu süreksizlik değil, müziğin kendisidir).
        q = int(0.25 * SR)
        gg = np.concatenate([g[-q:], g[:q]])
        dikis = float(np.abs(g[0] - g[-1]).max())
        ce, _ = merkezler(gg)
        o["dongu_dikis_ornek_adim"] = round(dikis, 5)
        o["dongu_dikis_rms_fark_db"] = round(20 * np.log10(rms(g[:q]) / rms(g[-q:])), 2)
        o["dongu_dikis_merkez_sicrama_oktav"] = round(float(abs(np.log2(ce[1] / ce[0]))), 3)
        if olcu_n:
            adim, rf = [], []
            for k in range(olcu_n, len(g) - olcu_n + 1, olcu_n):
                adim.append(float(np.abs(g[k] - g[k - 1]).max()))
                rf.append(20 * np.log10(rms(g[k: k + q]) / rms(g[k - q: k])))
            o["olcu_basi_ornek_adim_max"] = round(max(adim), 5)
            o["dongu_ici_ornek_adim_max"] = round(float(np.abs(np.diff(g, axis=0)).max()), 5)
            o["olcu_basi_rms_fark_db_aralik"] = [round(min(rf), 2), round(max(rf), 2)]
            o["dongu_dikisi_olagan"] = bool(dikis <= o["dongu_ici_ornek_adim_max"] and min(rf) - 1 <= o["dongu_dikis_rms_fark_db"] <= max(rf) + 1)
    return o


def yaz_flac(path, x):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f64le", "-ac", "2", "-ar", str(SR), "-i", "-",
                    "-c:a", "flac", "-sample_fmt", "s32", "-bits_per_raw_sample", "24", path],
                   input=np.ascontiguousarray(x).astype(np.float64).tobytes(), check=True)


# =====================================================================================
# Perdeler: Re Hicaz (E♭ +15 sent, F♯ −15 sent; koma renkleri) ve miyan için Rast rengi (segah −15 sent)
# =====================================================================================
ADLAR = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "D#": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7,
         "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
KOMA = {"Eb": +15, "F#": -15}


def hz(nota, koma=True):
    """'A4', 'Bb4', 'F#4', 'B4-' (− = 15 sent pes, + = 15 sent tiz). Hicaz komaları koma=True ise uygulanır."""
    d = 0
    while nota[-1] in "+-":
        d += 15 if nota[-1] == "+" else -15
        nota = nota[:-1]
    ad, okt = nota[:-1], int(nota[-1])
    if koma:
        d += KOMA.get(ad, 0)
    m = 12 * (okt + 1) + ADLAR[ad]
    return 440.0 * 2 ** ((m - 69) / 12 + d / 1200)


# =====================================================================================
# Çalgılar
# =====================================================================================
RNG = np.random.default_rng(1396)


class Nefesli:
    """Örnek tabanlı sürekli ses (korno, yaylı uzun nota). Notalar en yakın örnekten kaydırılır."""

    def __init__(self, ornekler, uzunluk_sn=16.0):
        self.o = []
        for kaynak, path, f0 in ornekler:
            x = sfx(path) if kaynak == "sfx" else ornek(kaynak, path)
            on = baslangic(x)
            x = x[max(0, on - int(0.004 * SR)):]
            x = x / rms(x[int(0.3 * SR): int(1.5 * SR)]) * 0.1
            x = uzat(x, int(uzunluk_sn * SR), RNG)
            self.o.append((f0, x))

    def nota(self, f, sure, atak=0.015, birak=0.12, onceki=None, suslem=None, vib=(0.0, 5.2), atla=0.0, kayma_sn=0.045,
             nefes=0.0, esit_guc=False):
        f0, x = min(self.o, key=lambda o: abs(np.log(f / o[0])))
        n = int((sure + birak) * SR)
        t = np.arange(n) / SR
        cent = np.zeros(n)
        if onceki is not None:                     # legato: önceki perdeden kayarak gel
            k = np.clip(t / kayma_sn, 0, 1)
            cent += 1200 * np.log2(onceki / f) * (1 - (3 * k ** 2 - 2 * k ** 3))
        if suslem is not None:                     # çarpma: üst komşudan kısa süsleme
            fu, sl = suslem
            k = np.clip((t - sl) / 0.025, 0, 1)
            cent = cent * k + 1200 * np.log2(fu / f) * (1 - k)
        if vib[0] > 0:
            derinlik = vib[0] * np.clip((t - 0.25) / 0.35, 0, 1)
            cent += derinlik * np.sin(2 * np.pi * vib[1] * t + RNG.uniform(0, 2 * np.pi))
        if nefes > 0:                              # hafif nefes dalgalanması (canlılık)
            cent += nefes * np.sin(2 * np.pi * 0.7 * t + RNG.uniform(0, 6.28))
        inc = (f / f0) * 2 ** (cent / 1200)
        y = oku(x, inc, atla * SR)
        return y * zarf(n, atak, birak, esit_guc=esit_guc)[:, None]


def cizgi(ses, notalar, t0, vurus, kazanc=1.0, koma=True, okt=0, gecik=0.0, detune=0.0, suslemeler=(), vib=(9.0, 5.3),
          legato=True, atak=0.018, nefes=4.0, olcu_vurus=4):
    """Nota listesini [(ölçü, vuruş, süre_vuruş, 'A4'), ...] tek ses olarak üretir (legato, kayma, süsleme)."""
    out = []
    onceki_bitis, onceki_f = None, None
    for idx, (olc_i, vur, sure, ad) in enumerate(notalar):
        f = hz(ad, koma) * 2 ** okt * 2 ** (detune / 1200)
        bas = t0 + (olc_i * olcu_vurus + vur) * vurus + gecik
        bitisik = legato and onceki_bitis is not None and abs(onceki_bitis - bas) < 1e-6
        sus = None
        if idx in suslemeler:
            ust = suslemeler[idx] if isinstance(suslemeler, dict) else None
            sus = (hz(ust, koma) * 2 ** okt, 0.075) if ust else None
        y = ses.nota(f, sure * vurus, atak=0.035 if bitisik else atak,
                     birak=0.06 if idx + 1 < len(notalar) else 0.22, onceki=onceki_f if bitisik else None,
                     suslem=sus, vib=vib if sure * vurus > 0.6 else (0, 5), atla=0.09 if bitisik else 0.0, nefes=nefes)
        out.append((bas, y * kazanc))
        onceki_bitis, onceki_f = bas + sure * vurus, f
    return out


class Kisa:
    """Kısa notalı örnek çalgı (spiccato yaylı, stakato korno): en yakın perde, hız katmanı (p/f), dönüşümlü (rr) örnek."""

    def __init__(self, ornekler, ton=None):
        self.o = []
        for repo, path, f0, kat in ornekler:
            x = ornek(repo, path)
            on = baslangic(x, -40)
            x = x[max(0, on - int(0.002 * SR)):][: int(2.5 * SR)]
            if ton:
                x = filtre(x, **ton)
            x = x / np.abs(x[: int(0.25 * SR)]).max()
            self.o.append((f0, kat, x))
        self.say = 0

    def nota(self, f, vel, sure, birak=0.16):
        kat = "f" if vel > 0.78 else "p"
        aday = [o for o in self.o if o[1] == kat] or self.o
        en = min(abs(np.log(f / o[0])) for o in aday)
        aday = [o for o in aday if abs(abs(np.log(f / o[0])) - en) < 1e-9]
        f0, _, x = aday[self.say % len(aday)]
        self.say += 1
        n = int((sure + birak) * SR)
        y = oku(x, np.full(n, f / f0))
        return y * zarf(n, 0.003, birak)[:, None] * vel


# =====================================================================================
# Ölçü: 9/8 aksak (2+2+2+3), sekizlik = 252/dk (♩ = 126)
# =====================================================================================
BPM = 126
E = 60.0 / 252                          # sekizlik = 10500 örnek
OLCU = 9 * E
GIRIS_OLCU, GOVDE_OLCU, KAPANIS_OLCU = 2, 32, 2
KAPANIS_KUYRUK = 1.6

VCSL_D = "Membranophones/Struck Membranophones/"
_V = "VSCO-2-CE"

CELLO = Kisa([(_V, f"Strings/Cello Section/spic/spic_{ad}_v{v}_RR{r}.wav", f0, "p" if v == 1 else "f")
              for ad, f0 in (("D2", 146.83), ("G1", 98.0), ("B1", 123.47), ("F2", 174.61), ("A2", 220.0))
              for v in (1, 2) for r in (1, 2)], ton=dict(lo=50, hi=3000, n_hi=2))
KONTRBAS = Kisa([(_V, f"Strings/Solo Contrabass/Spic/BKCtbss_Spic_{ad}_v{v}_rr{r}.wav", f0, "p" if v == 1 else "f")
                 for ad, f0, vs in (("D1", 73.42, (1, 3)), ("C1", 65.41, (1, 3)), ("G0", 49.0, (1, 3)), ("E1", 82.41, (1, 3)))
                 for v in vs for r in (1, 2)], ton=dict(lo=35, hi=1400, n_hi=2))
VIOLA = Kisa([(_V, f"Strings/Viola Section/spic/Violas_spic_{ad}_v{v}_rr{r}.wav", f0, "p" if v == 1 else "f")
              for ad, f0 in (("D3", 293.66), ("F3", 349.23), ("A3", 440.0))
              for v in (1, 2) for r in (1, 2)], ton=dict(lo=120, hi=2800, n_hi=2, tepe=[(2000, 0.7, -2.0)]))
KORNO_ST = Kisa([(_V, f"Brass/F Horn/stac/MOHorn_stac_{ad}_v2_rr{r}.wav", f0, "f")
                 for ad, f0 in (("D2", 146.83), ("F2", 174.61), ("A2", 220.0)) for r in (1, 2)],
                ton=dict(lo=70, hi=2200, n_hi=2))
KORNO = Nefesli([(_V, "Brass/F Horn/sus/MOHorn_sus_D2_v2_1.wav", 146.83),
                 (_V, "Brass/F Horn/sus/MOHorn_sus_F2_v2_1.wav", 174.61),
                 (_V, "Brass/F Horn/sus/MOHorn_sus_A2_v2_1.wav", 220.0),
                 (_V, "Brass/F Horn/sus/MOHorn_sus_C3_v2_1.wav", 261.63)])


def darbuka(tur, vel, rr):
    """D = düm (Darbuka_1), T = tek (Darbuka_4 + çok az Darbuka_2), K = hafif ka/hayalet vuruş (Darbuka_5/3)."""
    katman = 2 if vel > 0.7 else 1
    r = 1 + rr % 2
    if tur == "D":
        x = ornek("VCSL", f"{VCSL_D}Darbuka/Darbuka_1_hit_vl{katman}_rr{r}.wav")
        ton = dict(lo=45, hi=2200, n_hi=2)
    elif tur == "T":
        x = ornek("VCSL", f"{VCSL_D}Darbuka/Darbuka_4_hit_vl{katman}_rr{r}.wav")
        x2 = ornek("VCSL", f"{VCSL_D}Darbuka/Darbuka_2_hit_vl1_rr{r}.wav")
        m = min(len(x), len(x2))
        x = x[:m] / np.abs(x).max() + 0.25 * x2[:m] / np.abs(x2).max()
        ton = dict(lo=110, hi=3200, n_hi=2, tepe=[(2400, 0.6, -2.0)])
    else:
        x = ornek("VCSL", f"{VCSL_D}Darbuka/Darbuka_{5 if rr % 2 else 3}_hit_vl1_rr{r}.wav")
        ton = dict(lo=120, hi=2200, n_hi=2)
    x = x[baslangic(x):][: int(0.6 * SR)]
    x = filtre(x / np.abs(x).max(), **ton)
    n = len(x)
    return x * zarf(n, 0.002, 0.15)[:, None] * vel ** 1.3


def def_vur(vel, rr, bogus=False):
    v = 3 if vel > 0.7 else 2
    ad = f"HDrumL_HitMuted_v{v}_rr{1 + rr % 2}_Sum" if bogus else f"HDrumL_Hit_v{v}_rr{1 + rr % 2}_Sum"
    x = ornek("VCSL", f"{VCSL_D}Frame Drum/{ad}.wav")
    x = x[baslangic(x):][: int(0.9 * SR)]
    x = filtre(x / np.abs(x).max(), lo=50, hi=2000, n_hi=2, tepe=[(110, 0.8, -2.0)])
    return x * zarf(len(x), 0.003, 0.35)[:, None] * vel ** 1.3


def davul(vel, rr):
    x = ornek(_V, f"VSCO 1 Percussion/drums/other/ethnic/giant/mallet/EthnicLargeMallet_hit_{'f' if rr % 2 == 0 else 'mf'}_1.wav")
    x = x[baslangic(x):][: int(1.1 * SR)]
    x = filtre(x / np.abs(x).max(), lo=60, hi=1600, n_hi=2, tepe=[(190, 0.9, 2.0), (480, 0.8, 2.5)])
    return x * zarf(len(x), 0.004, 0.4)[:, None] * vel ** 1.4


_TIMP = {}


def timpani(nota, vel, rr):
    """Timpani: Re2 (VSCO Timpani1 ~89.8 Hz'den), La2 ve Si♭2 (Timpani2 ~121.8 Hz'den). Kısaltılmış (ostinato bulanmasın)."""
    katman = "v3" if vel > 0.55 or nota != "D2" else "v1"
    if nota != "D2":
        katman = "v4" if vel > 0.85 else "v3"
    key = (nota, katman, rr % 2)
    if key not in _TIMP:
        no, f0 = (1, 89.8) if nota == "D2" else (2, 121.8)
        x = ornek(_V, f"Percussion/Timpani/Timpani{no}_Hit_{katman}_rr{1 + rr % 2}_Sum.wav")
        x = kaydir(x[baslangic(x):], hz(nota, False) / f0)[: int(1.5 * SR)]
        n = len(x)
        t = np.arange(n) / SR
        x = filtre(x / np.abs(x).max(), lo=45, hi=1500, n_hi=2) * (np.exp(-t / 0.45) * zarf(n, 0.004, 0.3))[:, None]
        _TIMP[key] = x / np.abs(x).max()
    return _TIMP[key] * vel ** 1.3


def buyuk_davul(vel):
    x = sfx("vurus/buyuk_davul_mf")
    x = x[baslangic(x):][: int(2.5 * SR)]
    n = len(x)
    t = np.arange(n) / SR
    x = filtre(x, lo=48, hi=600, n_hi=2) * (np.exp(-t * 1.6) * zarf(n, 0.008, 0.5))[:, None]
    return x / np.abs(x).max() * vel ** 1.3


def uzun(sid, f0, f, sure, atak, birak, hi=1500):
    """sfx'teki uzun yaylı notasından (çello/kontrbas/tremolo) perde kaydırmalı sürekli nota."""
    x = sfx(sid)
    x = x[baslangic(x):]
    x = uzat(x / rms(x[SR: 3 * SR]) * 0.1, int((sure + birak + 2) * SR * max(1, f / f0)), RNG)
    n = int((sure + birak) * SR)
    y = oku(x, np.full(n, f / f0))
    return filtre(y, lo=35, hi=hi) * zarf(n, atak, birak, esit_guc=True)[:, None]


# ---------------- desenler ----------------
#        sekizlik:  0      1      2      3      4      5      6      7      8      (gruplar 2+2+2+3)
OST = {"D": ["D3", "D3", "A2", "D3", "D3", "D3", "Eb3", "D3", "C3"],
       "G": ["G2", "G2", "D3", "G2", "G2", "G2", "Bb2", "A2", "F#2"],
       "Eb": ["Eb3", "Eb3", "Bb2", "Eb3", "Eb3", "Eb3", "D3", "Eb3", "D3"]}
OST_VEL = [1.0, 0.55, 0.85, 0.55, 0.85, 0.55, 0.95, 0.6, 0.75]
KB = {"D": {0: "D2", 6: "D2"}, "G": {0: "G1", 6: "G1"}, "Eb": {0: "Eb2", 6: "Eb2"}}
DARB = ["D", "K", "T", "K", "T", "K", "D", "K", "T"]
DARB_VEL = {"D": 1.0, "T": 0.82, "K": 0.45}

HARM = ["D"] * 10 + ["G", "G"] + ["D"] * 7 + ["Eb", "Eb", "D", "Eb", "D"] + ["D"] * 8
assert len(HARM) == GOVDE_OLCU
DIN = [0.80, 0.80, 0.82, 0.84, 0.84, 0.84, 0.86, 0.86, 0.88, 0.88, 0.88, 0.9, 0.9, 0.92, 0.92, 0.94,
       1.0, 1.0, 1.0, 0.98, 0.96, 0.96, 0.96, 0.94, 0.78, 0.76, 0.76, 0.78, 0.8, 0.82, 0.84, 0.86]

FRAG1 = [(0, 0, 2, "A3"), (0, 2, 2, "Bb3"), (0, 4, 5, "A3")]
FRAG1_UZUN = [(0, 0, 2, "A3"), (0, 2, 2, "Bb3"), (0, 4, 9, "A3")]
FRAG2 = [(0, 0, 2, "G3"), (0, 2, 2, "F#3"), (0, 4, 2, "G3"), (0, 6, 3, "Eb3")]
MOTIF = FRAG1 + [(1, o, s, a) for _, o, s, a in FRAG2] + [(2, 0, 7, "D3")]


def ostinato(B, t0, harm, vel, kb=True, cello=True, rr=0, viola=0.0):
    for s in range(9):
        j = RNG.normal(0, 0.004)
        v = vel * OST_VEL[s] * RNG.uniform(0.94, 1.03)
        if cello:
            B.ekle("zemin", t0 + s * E + j, CELLO.nota(hz(OST[harm][s]), v, E * 0.9, birak=0.14), kazanc=0.5, pan=-0.18)
        if viola > 0:     # violalar ostinatoyu bir oktav üstte ikiler (orta bölgeyi doldurur)
            B.ekle("zemin", t0 + s * E + j + 0.006, VIOLA.nota(hz(OST[harm][s]) * 2, v * 0.9, E * 0.8, birak=0.1),
                   kazanc=0.22 * viola, pan=0.28)
        if kb and s in KB[harm]:
            B.ekle("zemin", t0 + s * E + j, KONTRBAS.nota(hz(KB[harm][s]), min(1.0, v * 1.05), E * 1.6, birak=0.25),
                   kazanc=0.24, pan=0.08)


def darbuka_olcu(B, t0, vel, hayalet=True, son_doldur=False):
    for s in range(9):
        tur = DARB[s]
        if tur == "K" and not hayalet:
            continue
        j = RNG.normal(0, 0.003)
        v = vel * DARB_VEL[tur] * RNG.uniform(0.9, 1.04)
        B.ekle("ritim", t0 + s * E + j, darbuka(tur, v, s), kazanc={"D": 0.36, "T": 0.58, "K": 0.5}[tur], pan=0.22 if tur != "D" else 0.12)
    if son_doldur:     # son grupta onaltılıklar (kalkış)
        for k in range(5):
            B.ekle("ritim", t0 + (6 + k * 0.5 + 0.5) * E, darbuka("T" if k % 2 else "K", vel * (0.45 + 0.08 * k), k), kazanc=0.4, pan=0.25)


def def_olcu(B, t0, vel):
    B.ekle("ritim", t0 + RNG.normal(0, 0.003), def_vur(vel, 0), kazanc=0.34, pan=-0.25)
    B.ekle("ritim", t0 + 4 * E + RNG.normal(0, 0.003), def_vur(vel * 0.6, 1, bogus=True), kazanc=0.3, pan=-0.28)
    B.ekle("ritim", t0 + 6 * E + RNG.normal(0, 0.003), def_vur(vel * 0.9, 1), kazanc=0.34, pan=-0.25)


def timpani_olcu(B, t0, desen, harm, vel):
    """desen: {sekizlik: 'kök'|'beşli'} – kök: Re2 (Eb ölçülerinde Si♭2), beşli: La2."""
    for s, rol in desen.items():
        if harm == "Eb":
            nota = "Bb2"
        elif harm == "G":
            nota = "D2"
        else:
            nota = "D2" if rol == "k" else "A2"
        v = vel * (1.0 if s in (0, 6) else 0.72) * RNG.uniform(0.94, 1.03)
        B.ekle("ritim", t0 + s * E + RNG.normal(0, 0.003), timpani(nota, v, s), kazanc=0.36, pan=0.0)


def korno_cizgi(B, notalar, t0, kaz=1.0, kat=("tek",)):
    for t, y in cizgi(KORNO, notalar, t0, E, kazanc=0.55 * kaz, vib=(6.0, 5.0), atak=0.04, nefes=2.0, olcu_vurus=9):
        B.ekle("melodi", t, y, pan=-0.2)
    if "cift" in kat:   # ikinci korno, hafif gecikmeli (bölük)
        for t, y in cizgi(KORNO, notalar, t0, E, kazanc=0.4 * kaz, gecik=0.012, detune=-6, vib=(5.0, 4.7), atak=0.05,
                          nefes=2.0, olcu_vurus=9):
            B.ekle("melodi", t, y, pan=0.15)


def viola_sekizlik(B, t0, perdeler, vel, kaz=1.0):
    """Motif perdelerini aksak gruplara yayılmış tekrar eden sekizliklerle (parçalanmış motif)."""
    for s, ad in enumerate(perdeler):
        if ad is None:
            continue
        v = vel * (1.0 if s in (0, 2, 4, 6) else 0.62) * RNG.uniform(0.94, 1.03)
        B.ekle("melodi", t0 + s * E + RNG.normal(0, 0.003), VIOLA.nota(hz(ad), v, E * 0.85, birak=0.12), kazanc=0.32 * kaz, pan=0.3)


def korno_vurgu(B, t0, perdeler, vel, sekizlikler=(0, 6)):
    for s in sekizlikler:
        for ad in perdeler:
            B.ekle("melodi", t0 + s * E, KORNO_ST.nota(hz(ad), vel, E * 2.2, birak=0.35), kazanc=0.2, pan=-0.1)


def dron(B, t0, sure, harm="D", kaz=1.0):
    B.ekle("zemin", t0, uzun("muzik/cello_D2", 146.83, 146.83, sure, 1.4, 1.4, hi=1200), kazanc=0.22 * kaz, pan=-0.3)
    B.ekle("zemin", t0, uzun("muzik/kontrbas_D1", 73.42, 73.42, sure, 1.4, 1.4, hi=800), kazanc=0.1 * kaz, pan=0.1)


# ---------------- bölümler ----------------
def govde_yaz():
    B = Bolum(GOVDE_OLCU * OLCU, kuyruk_sn=5.0)
    # dron: üst üste binen uzun Re notaları; 19–23 gerilim ölçülerinde dron yerine çello tremolosu (E♭/Re)
    for o, s_ in ((0, 4), (4, 4), (8, 4), (12, 4), (16, 3), (24, 4), (28, 4)):
        dron(B, o * OLCU, s_ * OLCU, "D", kaz=1.25 if o == 24 else 1.0)
    for o, s_ in ((19, 2), (21, 1), (22, 1), (23, 1)):
        ad = "Eb3" if HARM[o] == "Eb" else "D3"
        B.ekle("zemin", o * OLCU, uzun("muzik/cello_tremolo_D2", 146.83, hz(ad), s_ * OLCU - 0.2, 0.35, 0.45),
               kazanc=0.26, pan=-0.3)
    for o in range(GOVDE_OLCU):
        t = o * OLCU
        h, v = HARM[o], DIN[o]
        kirilma = 24 <= o < 28
        # zemin: ostinato
        ostinato(B, t, h, v, kb=not kirilma, rr=o, viola=1.0 if (12 <= o < 24 or o >= 29) else (0.6 if 4 <= o < 12 else 0.5))
        # ritim
        darbuka_olcu(B, t, v, hayalet=not (24 <= o < 27), son_doldur=o in (15, 19, 31))
        def_olcu(B, t, v * (0.7 if kirilma else 1.0))
        if o < 4:
            timpani_olcu(B, t, {0: "k", 6: "k"}, h, v * 0.8)
        elif o < 12:
            timpani_olcu(B, t, {0: "k", 4: "b", 6: "k", 8: "k"}, h, v * 0.85)
        elif o < 16:
            timpani_olcu(B, t, {0: "k", 2: "k", 4: "b", 6: "k", 7: "k", 8: "k"}, h, v * 0.85)
        elif o == 19:
            timpani_olcu(B, t, {s: ("k" if s % 2 == 0 else "b") for s in range(9)}, h, v * 0.8)
        elif o < 24:
            timpani_olcu(B, t, {0: "k", 2: "k", 4: "b", 6: "k", 7: "k", 8: "k"}, h, v * 0.9)
        elif kirilma:
            timpani_olcu(B, t, {0: "k"}, h, 0.5)
        elif o < 31:
            timpani_olcu(B, t, {0: "k", 4: "b", 6: "k"} if o < 30 else {0: "k", 4: "b", 6: "k", 8: "k"}, h, v * 0.8)
        else:
            timpani_olcu(B, t, {0: "k", 4: "b", 6: "k", 7: "k", 8: "k"}, h, v * 0.85)
        if 12 <= o < 24 or o >= 30:
            B.ekle("ritim", t + RNG.normal(0, 0.003), davul(v * 0.95, o), kazanc=0.42, pan=-0.08)
            B.ekle("ritim", t + 6 * E + RNG.normal(0, 0.003), davul(v * 0.8, o + 1), kazanc=0.38, pan=-0.08)
        if o in (16, 18, 20, 22):
            B.ekle("ritim", t, buyuk_davul(0.8), kazanc=0.32, pan=0.0)
    # melodi
    korno_cizgi(B, FRAG1_UZUN, 4 * OLCU, kaz=0.85)
    korno_cizgi(B, FRAG2 + [(1, 0, 7, "D3")], 6 * OLCU, kaz=0.85)
    korno_cizgi(B, FRAG1, 8 * OLCU, kaz=0.9)
    korno_cizgi(B, [(0, 0, 2, "Bb3"), (0, 2, 2, "C4"), (0, 4, 5, "Bb3"),
                    (1, 0, 2, "A3"), (1, 2, 2, "G3"), (1, 4, 2, "F#3"), (1, 6, 3, "G3")], 10 * OLCU, kaz=0.9)
    # 12–15: violalar motifi sekizliklerle; kornolar beşli pedal
    viola_sekizlik(B, 12 * OLCU, ["A4", "A4", "Bb4", "Bb4", "A4", "A4", "A4", "A4", "A4"], 0.8)
    viola_sekizlik(B, 13 * OLCU, ["G4", "G4", "F#4", "F#4", "G4", "G4", "Eb4", "Eb4", "Eb4"], 0.82)
    viola_sekizlik(B, 14 * OLCU, ["D4"] * 9, 0.82)
    viola_sekizlik(B, 15 * OLCU, ["D4", "D4", "Eb4", "Eb4", "F#4", "F#4", "G4", "G4", "A4"], 0.86)
    for ad, pan in (("D3", -0.2), ("A3", 0.2)):
        B.ekle("melodi", 12 * OLCU, KORNO.nota(hz(ad, False), 4 * OLCU - 0.3, atak=0.8, birak=0.8, nefes=2.0, esit_guc=True),
               kazanc=0.28, pan=pan)
    # 16–18 doruk: tam motif, iki korno + violalar oktav üstte sekizliklerle
    korno_cizgi(B, MOTIF, 16 * OLCU, kaz=1.0, kat=("tek", "cift"))
    viola_sekizlik(B, 16 * OLCU, ["A4", "A4", "Bb4", "Bb4", "A4", "A4", "A4", "A4", "A4"], 0.9)
    viola_sekizlik(B, 17 * OLCU, ["G4", "G4", "F#4", "F#4", "G4", "G4", "Eb4", "Eb4", "Eb4"], 0.9)
    viola_sekizlik(B, 18 * OLCU, ["D4"] * 9, 0.88)
    viola_sekizlik(B, 19 * OLCU, ["Eb4", "Eb4", "D4", "Eb4", "Eb4", "D4", "Eb4", "D4", "Eb4"], 0.8)
    # 19–23: gerilim – korno vurguları (Eb–Bb / D–A), violada motif başı cevapları
    for o in range(19, 24):
        korno_vurgu(B, o * OLCU, ("Eb3", "Bb3") if HARM[o] == "Eb" else ("D3", "A3"), 0.85)
    for o in (21, 23):
        viola_sekizlik(B, o * OLCU, ["A4", "A4", "Bb4", "Bb4", "A4", "A4", None, None, None], 0.78)
    # 24–27 kırılma: uzun korno Re, ölçü 26'da motif başı yumuşak
    B.ekle("melodi", 24 * OLCU, KORNO.nota(hz("D3", False), 2 * OLCU, atak=0.9, birak=0.9, nefes=2.0, esit_guc=True), kazanc=0.3, pan=-0.2)
    korno_cizgi(B, FRAG1_UZUN, 26 * OLCU, kaz=0.7)
    # 28–31 yeniden kuruluş
    viola_sekizlik(B, 28 * OLCU, ["D4"] * 9, 0.6)
    viola_sekizlik(B, 29 * OLCU, ["D4"] * 9, 0.68)
    korno_cizgi(B, FRAG2 + [(1, 0, 7, "D3")], 30 * OLCU, kaz=0.85)
    return B, B.L


def giris_yaz():
    T = GIRIS_OLCU * OLCU
    B = Bolum(T, kuyruk_sn=3.0)
    r = sfx("vurus/timpani_rulo")
    r = kaydir(r[baslangic(r):], hz("D2", False) / 94.5)
    r = filtre(r[: int((T + 0.5) * SR)], lo=40, hi=600)
    n = len(r)
    t = np.arange(n) / SR
    r = r * (0.1 + 0.9 * np.clip(t / T, 0, 1) ** 1.4)[:, None] * zarf(n, 0.25, 0.05)[:, None]
    B.ekle("ritim", 0.0, r / np.abs(r).max(), kazanc=0.5)
    B.ekle("zemin", 0.0, uzun("muzik/cello_tremolo_D2", 146.83, 146.83, T + 0.3, 1.8, 0.3), kazanc=0.3, pan=-0.3)
    dron(B, 0.2, T, "D", kaz=0.9)
    ostinato(B, OLCU, "D", 0.62, kb=True)
    darbuka_olcu(B, OLCU, 0.6, hayalet=True, son_doldur=True)
    timpani_olcu(B, OLCU, {0: "k", 6: "k", 7: "k", 8: "k"}, "D", 0.6)
    return B


def kapanis_yaz():
    T = KAPANIS_OLCU * OLCU + KAPANIS_KUYRUK
    B = Bolum(T, kuyruk_sn=3.0)
    ostinato(B, 0.0, "D", 0.95)
    darbuka_olcu(B, 0.0, 0.95, son_doldur=True)
    def_olcu(B, 0.0, 0.95)
    timpani_olcu(B, 0.0, {0: "k", 2: "k", 4: "b", 6: "k", 7: "k", 8: "k"}, "D", 0.9)
    B.ekle("ritim", 0.0, davul(0.9, 0), kazanc=0.55)
    korno_cizgi(B, FRAG2, 0.0, kaz=1.0, kat=("tek", "cift"))
    viola_sekizlik(B, 0.0, ["G4", "G4", "F#4", "F#4", "G4", "G4", "Eb4", "Eb4", "Eb4"], 0.85)
    dron(B, 0.0, OLCU + 0.5, "D", kaz=1.0)
    # son vuruş: Re unison
    t1 = OLCU
    B.ekle("ritim", t1, timpani("D2", 1.0, 0), kazanc=0.6)
    B.ekle("ritim", t1, buyuk_davul(0.9), kazanc=0.5)
    B.ekle("ritim", t1, davul(1.0, 0), kazanc=0.55)
    B.ekle("ritim", t1, def_vur(0.9, 0), kazanc=0.5)
    B.ekle("zemin", t1, KONTRBAS.nota(hz("D2"), 1.0, 0.5, birak=0.6), kazanc=0.38)
    B.ekle("zemin", t1, CELLO.nota(hz("D3"), 1.0, 0.4, birak=0.5), kazanc=0.38)
    B.ekle("zemin", t1, uzun("muzik/cello_D2", 146.83, 146.83, 2.2, 0.05, 1.6, hi=1200), kazanc=0.3, pan=-0.2)
    B.ekle("zemin", t1, uzun("muzik/kontrbas_D1", 73.42, 73.42, 2.2, 0.05, 1.6, hi=800), kazanc=0.22, pan=0.1)
    for ad, pan in (("D3", -0.2), ("A3", 0.2)):
        B.ekle("melodi", t1, KORNO.nota(hz(ad, False), 2.0, atak=0.04, birak=1.4, nefes=1.5), kazanc=0.32, pan=pan)
    B.ekle("melodi", t1, VIOLA.nota(hz("D4"), 0.95, 0.3, birak=0.3), kazanc=0.3, pan=0.3)
    return B


def vurgu_yaz():
    """Sting (~3.6 sn): iki sekizlik kalkış (timpani + çello) → Re unison vuruşu, korno beşlisi söner."""
    T = 3.6
    B = Bolum(T, kuyruk_sn=2.0)
    for k, v in ((0, 0.7), (1, 0.82)):
        if k:
            B.ekle("ritim", k * E, timpani("D2", v, k), kazanc=0.3)
        B.ekle("ritim", k * E, darbuka("T" if k else "K", v, k), kazanc=0.35, pan=0.22)
        B.ekle("zemin", k * E, CELLO.nota(hz("D3"), v, E * 0.9), kazanc=0.5, pan=-0.18)
    t1 = 2 * E
    B.ekle("ritim", t1, timpani("D2", 1.0, 0), kazanc=0.6)
    B.ekle("ritim", t1, buyuk_davul(0.9), kazanc=0.5)
    B.ekle("ritim", t1, davul(1.0, 0), kazanc=0.55)
    B.ekle("ritim", t1, darbuka("D", 1.0, 0), kazanc=0.5)
    B.ekle("zemin", t1, KONTRBAS.nota(hz("D2"), 1.0, 0.5, birak=0.6), kazanc=0.6)
    B.ekle("zemin", t1, CELLO.nota(hz("D3"), 1.0, 0.4, birak=0.5), kazanc=0.5)
    B.ekle("zemin", t1, uzun("muzik/cello_D2", 146.83, 146.83, 1.8, 0.03, 1.2, hi=1200), kazanc=0.35, pan=-0.2)
    B.ekle("zemin", t1, uzun("muzik/kontrbas_D1", 73.42, 73.42, 1.8, 0.03, 1.2, hi=800), kazanc=0.4, pan=0.1)
    for ad, pan in (("D3", -0.2), ("A3", 0.2)):
        B.ekle("melodi", t1, KORNO.nota(hz(ad, False), 1.6, atak=0.03, birak=1.2, nefes=1.5), kazanc=0.5, pan=pan)
    return B, T


# =====================================================================================
# Miks, yazım, ölçüm
# =====================================================================================
KATMAN_KAZANC = {"zemin": 0.85, "ritim": 1.0, "melodi": 1.35}
TON = {
    "zemin": dict(lo=50, hi=2800, n_hi=2, tepe=[(90, 0.8, -2.0)]),
    "ritim": dict(lo=40, hi=3600, n_hi=2, tepe=[(2600, 0.7, -2.0), (80, 1.0, -4.0)]),
    "melodi": dict(lo=80, hi=2600, n_hi=2, tepe=[(1700, 0.7, -1.5)]),
}
HEDEF_RMS_DB = -20.0


def tonla(B):
    for k in KATMANLAR:
        B.s[k] = filtre(B.s[k], **TON[k]) * KATMAN_KAZANC[k]


def yumusak_tavan(x, diz, tavan):
    """Belleksiz yumuşak dizli tepe sınırlayıcı (yalnız ritim katmanına; vuruş tepelerini törpüler)."""
    a = np.abs(x)
    y = np.where(a <= diz, a, diz + (tavan - diz) * np.tanh((a - diz) / (tavan - diz)))
    return np.sign(x) * y


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(TMP, exist_ok=True)
    govde, L = govde_yaz()
    giris = giris_yaz()
    kapanis = kapanis_yaz()
    for B in (govde, giris, kapanis):
        tonla(B)
    b0 = giris.L
    son_n = kapanis.L
    st = birlestir(giris, govde, kapanis, b0, L, son_n, son_fade_sn=1.2)
    g = 10 ** (HEDEF_RMS_DB / 20) / rms(sum(st[k] for k in KATMANLAR))
    for B in (govde, giris, kapanis):
        B.s["ritim"] = yumusak_tavan(B.s["ritim"], 10 ** (-7 / 20) / g, 10 ** (-3.5 / 20) / g)
    st = birlestir(giris, govde, kapanis, b0, L, son_n, son_fade_sn=1.2)
    tam = sum(st[k] for k in KATMANLAR)
    g = 10 ** (HEDEF_RMS_DB / 20) / rms(tam)
    g = min(g, 10 ** (-1.5 / 20) / np.abs(tam).max())     # güvenlik: tepe ≤ −1.5 dBFS (gerekirse RMS biraz düşer)
    tam *= g
    for k in KATMANLAR:
        st[k] *= g
    vb, vT = vurgu_yaz()
    tonla(vb)
    vb.s["ritim"] = yumusak_tavan(vb.s["ritim"], 10 ** (-7 / 20) / g, 10 ** (-3.5 / 20) / g)
    v = sum(yanki(vb.s[k]) for k in KATMANLAR)[: int((vT + 0.3) * SR)] * g
    fv = int(0.6 * SR)
    v[-fv:] *= yumusak_rampa(fv)[::-1, None]
    if np.abs(v).max() > 10 ** (-1 / 20):
        v *= 10 ** (-1 / 20) / np.abs(v).max()

    yaz_flac(os.path.join(OUT, f"{ID}__tam.flac"), tam)
    for k in KATMANLAR:
        yaz_flac(os.path.join(OUT, f"{ID}__{k}.flac"), st[k])
    yaz_flac(os.path.join(OUT, f"{ID}__vurgu.flac"), v)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, f"{ID}__tam.flac"), "-c:a", "libmp3lame",
                    "-b:a", "128k", os.path.join(HERE, "onizleme.mp3")], check=True)

    tam_d = yukle(os.path.join(OUT, f"{ID}__tam.flac"))
    toplam_d = sum(yukle(os.path.join(OUT, f"{ID}__{k}.flac")) for k in KATMANLAR)
    o = olc(tam_d, b0, b0 + L, olcu_n=int(round(OLCU * SR)))
    o["katman_toplami_fark_max"] = float(np.abs(toplam_d - tam_d).max())
    o["katmanlar"] = {k: {kk: vv for kk, vv in olc(st[k]).items() if kk in ("rms_dbfs", "tepe_dbfs", "tiz_4k_ustu_oran", "konusma_1k5_4k_oran")} for k in KATMANLAR}
    o["vurgu"] = {kk: vv for kk, vv in olc(v).items() if kk in ("rms_dbfs", "tepe_dbfs", "tiz_4k_ustu_oran", "konusma_1k5_4k_oran", "merkez_sicrama_max_oktav")}
    o["oda_yankisi"] = {"rt60_sn": "2.0 (bas) / 1.8 (orta) / 1.3–0.4 (tiz)", "on_gecikme_ms": 12, "islak_oran": ISLAK}
    sure = len(tam_d) / SR
    meta = {
        "id": ID,
        "ad": "Akın / Savaş",
        "tarz": "Hızlı savaş/akın müziği – 9/8 aksak darbuka-def-davul, timpani ve yaylı spiccato ostinatosu, kornoda parçalanmış leitmotif",
        "kullanim": ["meydan savaşı", "akıncı baskını / süvari hücumu", "harita okları: ordu ve akıncı hareketi", "kuşatma hücumu", "kovalamaca / geri çekilme"],
        "donem": [1, 2, 3, 4, 5],
        "ton_makam": "Re Hicaz (E♭ +15 sent, F♯ −15 sent koma renkleri) – yaklaşım; ostinato Re pedalı, ara bölümde Sol ve E♭ (Hicaz'ın II. derecesi) renkleri",
        "bpm": BPM,
        "usul_olcu": "9/8 aksak (2+2+2+3), sekizlik = 252/dk; darbuka: D k T k T k D k T",
        "sure": round(sure, 3),
        "dongu": [round(b0 / SR, 6), round((b0 + L) / SR, 6)],
        "dongu_ornek": [b0, b0 + L],
        "katmanlar": [f"{ID}__zemin.flac", f"{ID}__ritim.flac", f"{ID}__melodi.flac"],
        "vurgu": f"{ID}__vurgu.flac",
        "yogunluk": "yuksek",
        "olcumler": o,
        "kaynaklar": [{"dosya": a, "depo": r, "yol": p, "lisans": "CC0 1.0"} for a, r, p in KULLANILAN],
    }
    with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    with open(os.path.join(HERE, "KAYNAKLAR.tsv"), "w", encoding="utf-8") as f:
        f.write("dosya\tdepo\tyol\tlisans\n")
        for a, r, p in KULLANILAN:
            repo = REPOS.get(r, "tarih-reels/shared/sfx (CC0, kendi kataloğumuz)")
            f.write(f"{a}\t{repo}\t{p}\tCC0 1.0 (kamu malı)\n")
    print(json.dumps({k: v for k, v in o.items() if k not in ("katmanlar",)}, ensure_ascii=False, indent=1))
    print("katmanlar:", json.dumps(o["katmanlar"], ensure_ascii=False))
    print(f"süre {sure:.2f} sn · döngü {b0 / SR:.4f}–{(b0 + L) / SR:.4f} sn")


if __name__ == "__main__":
    main()
