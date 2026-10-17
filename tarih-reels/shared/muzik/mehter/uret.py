#!/usr/bin/env python3
"""Mehter yürüyüşü – Osmanlı tarihi serisi müzik kütüphanesi (tarz: mehter).

Ağır, görkemli, törensel ordu yürüyüşü: davul (düm/tek), kös, nakkare, yumuşatılmış zil,
boru dronu ve zurna/kaba zurna heterofonisiyle serinin leitmotifi (Re Hicaz).
Usul: düyek'e yaklaşım (8/8 = düm-tek-·-tek-düm-·-tek-·), ♩ = 84.

Çalıştırma:  python3 tarih-reels/shared/muzik/mehter/uret.py
Çıktı:       out/mehter__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, 24 bit, stereo),
             onizleme.mp3 (128 kbps), meta.json (ölçümler dahil).
Gerekenler:  numpy, ffmpeg, git (CC0 örnekler gerektiğinde VSCO-2-CE / VCSL depolarından tek tek çekilir).
Deterministik: sabit tohum; aynı girdilerle aynı çıktı.
"""
import json, os, subprocess, sys
import numpy as np

ID = "mehter"
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
RNG = np.random.default_rng(1453)


class Nefesli:
    """Örnek tabanlı nefesli (zurna = obua, kaba zurna = fagot, boru = korno). Notalar en yakın örnekten kaydırılır."""

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
          legato=True, atak=0.018, nefes=4.0):
    """Nota listesini [(ölçü, vuruş, süre_vuruş, 'A4'), ...] tek ses olarak üretir (legato, kayma, süsleme)."""
    out = []
    onceki_bitis, onceki_f = None, None
    for idx, (olc_i, vur, sure, ad) in enumerate(notalar):
        f = hz(ad, koma) * 2 ** okt * 2 ** (detune / 1200)
        bas = t0 + (olc_i * 4 + vur) * vurus + gecik
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


def davul_dum(vel, rr):
    a = ornek("VSCO-2-CE", f"VSCO 1 Percussion/drums/other/ethnic/giant/mallet/EthnicLargeMallet_hit_{'f' if rr % 2 == 0 else 'mf'}_1.wav")
    b = sfx("vurus/buyuk_davul_mf")
    n = int(1.6 * SR)
    a = a[baslangic(a):][:n]
    b = b[baslangic(b):][:n]
    a = np.pad(a, ((0, n - len(a)), (0, 0)))
    b = np.pad(b, ((0, n - len(b)), (0, 0)))
    t = np.arange(n) / SR
    y = a / np.abs(a).max() + 0.3 * b / np.abs(b).max() * np.exp(-t * 2.6)[:, None]
    y = filtre(y, lo=60, hi=900 + 1500 * vel, n_lo=2, n_hi=2, tepe=[(190, 0.9, 3.0), (480, 0.8, 3.0)])
    return y * zarf(n, 0.004, 0.25)[:, None] * vel ** 1.4


def davul_tek(vel, rr):
    a = ornek("VSCO-2-CE", f"VSCO 1 Percussion/drums/other/ethnic/giant/sticks/EthnicLargeSticks_hit_{'mf' if rr % 2 == 0 else 'f'}_1.wav")
    n = int(0.55 * SR)
    a = a[baslangic(a):][:n]
    y = filtre(a / np.abs(a).max(), lo=170, hi=2600, n_lo=2, n_hi=2, tepe=[(700, 0.8, 2.0)])
    return y * zarf(n, 0.003, 0.2)[:, None] * vel ** 1.3


_KOS = {}


def kos(vel, rr):
    """Kös: alçak timpani (Re2'ye akortlu) + büyük davul gövdesi; derin ve yumuşak saldırılı."""
    rr = rr % 2
    if rr not in _KOS:
        tp = ornek("VSCO-2-CE", f"Percussion/Timpani/Timpani1_Hit_v3_rr{1 + rr % 2}_Sum.wav")
        tp = kaydir(tp[baslangic(tp):], hz("D2", False) / 89.8)
        bd = sfx("vurus/buyuk_davul_ff")
        bd = bd[baslangic(bd):]
        n = int(3.2 * SR)
        tp = np.pad(tp[:n], ((0, max(0, n - len(tp))), (0, 0)))
        bd = np.pad(bd[:n], ((0, max(0, n - len(bd))), (0, 0)))
        t = np.arange(n) / SR
        y = 0.85 * tp / np.abs(tp).max() + 0.4 * bd / np.abs(bd).max() * np.exp(-t * 1.1)[:, None]
        y = filtre(y, lo=45, hi=650, n_lo=2, n_hi=2, tepe=[(150, 0.8, 2.0)])
        _KOS[rr] = y * zarf(n, 0.015, 0.8)[:, None]
    return _KOS[rr] * vel ** 1.3


def nakkare(f0, vel, rr):
    """Nakkare (küçük çift kudüm): sentez – zar kipleri + yumuşatılmış tokmak tıkırtısı."""
    rng = np.random.default_rng(100 + rr)
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    fk = f0 * (1 + 0.035 * np.exp(-t * 35))
    y = np.zeros(n)
    for oran, a, d in ((1.0, 1.0, 16), (1.59, 0.45, 24), (2.14, 0.25, 32), (2.30, 0.18, 38), (2.65, 0.10, 46)):
        y += a * np.sin(2 * np.pi * np.cumsum(fk * oran * (1 + rng.uniform(-0.004, 0.004))) / SR) * np.exp(-t * d)
    tik = filtre(rng.standard_normal(n), lo=300, hi=2200, n_lo=1, n_hi=2) * np.exp(-t * 260) * 0.25
    y = (y + tik) * zarf(n, 0.004, 0.08)
    return y / np.abs(y).max() * vel ** 1.5


_ZIL = {}


def zil(vel, rr):
    """Mehter zili: sfx zil_crash bir oktav pes, tizi kısılmış, yumuşak saldırılı (≥12 ms), kısa susturulmuş."""
    if rr not in _ZIL:
        x = sfx("vurus/zil_crash")
        x = x[baslangic(x):]
        x = oku(x, np.full(int(2.2 * SR), 0.5 * (1 + 0.02 * rr)))       # 1 oktav pes
        x = filtre(x, lo=220, hi=2400, n_lo=2, n_hi=3)
        n = len(x)
        t = np.arange(n) / SR
        x = x * (np.exp(-t / 0.42) * zarf(n, 0.014, 0.5))[:, None]
        _ZIL[rr] = x / np.abs(x).max()
    return _ZIL[rr] * vel ** 1.5


# =====================================================================================
# Beste: düyek, ♩ = 84
# =====================================================================================
BPM = 84
VURUS = 60.0 / BPM                    # 31500 örnek
OLCU = 4 * VURUS
SEKIZLIK = VURUS / 2
GIRIS_OLCU, GOVDE_OLCU, KAPANIS_OLCU = 2, 24, 2

# Leitmotif (4/4'e uyarlanmış: | A B♭ A— | G F♯ G E♭ | D—— · |)
MOTIF = [(0, 0, 1, "A4"), (0, 1, 1, "Bb4"), (0, 2, 2, "A4"), (1, 0, 1, "G4"), (1, 1, 1, "F#4"), (1, 2, 1, "G4"),
         (1, 3, 1, "Eb4"), (2, 0, 3, "D4")]
CEVAP_1 = [(0, 0, .5, "D4"), (0, .5, .5, "Eb4"), (0, 1, 1, "F#4"), (0, 2, 1, "G4"), (0, 3, 1, "A4")]
CEVAP_2 = [(0, 0, 1, "D4"), (0, 1, 1, "F#4"), (0, 2, 1, "A4"), (0, 3, .5, "Bb4"), (0, 3.5, .5, "A4")]
MIYAN = [(0, 0, 1, "G4"), (0, 1, 1, "A4"), (0, 2, 2, "B4-"), (1, 0, 1, "C5"), (1, 1, 1, "B4-"), (1, 2, 1, "A4"),
         (1, 3, 1, "G4"), (2, 0, 1, "A4"), (2, 1, 1, "Bb4"), (2, 2, 1, "A4"), (2, 3, 1, "G4"), (3, 0, 1, "F#4"),
         (3, 1, 1, "Eb4"), (3, 2, 2, "D4")]
INIS = [(0, 0, 1, "Eb4"), (0, 1, 1, "F#4"), (0, 2, .5, "G4"), (0, 2.5, .5, "F#4"), (0, 3, 1, "Eb4"), (1, 0, 3, "D4")]
SON = [(0, 0, 1, "F#4"), (0, 1, 1, "G4"), (0, 2, 1, "Eb4"), (0, 3, 4.2, "D4")]


def kaydir_olcu(notalar, d):
    return [(o + d, v, s, a) for o, v, s, a in notalar]


def zurna_ekle(B, notalar, t0, kaz=1.0, sesler=("z1",), kaba=False):
    """Zurna takımı: z1 (obua, sade), z2 (obua vibratolu, gecikmeli + süslemeli), kaba zurna (fagot, 1 oktav pes)."""
    if "z1" in sesler:
        for t, y in cizgi(ZURNA, notalar, t0, VURUS, kazanc=0.95 * kaz, suslemeler={}, vib=(8.0, 5.4)):
            B.ekle("melodi", t, y, pan=-0.12)
    if "z2" in sesler:
        sus = {i: _ust(a) for i, (_, v, s, a) in enumerate(notalar) if s >= 1 and i % 3 == 1}
        for t, y in cizgi(ZURNA2, notalar, t0, VURUS, kazanc=0.7 * kaz, gecik=0.018, detune=+7, suslemeler=sus,
                          vib=(0.0, 5.0)):
            B.ekle("melodi", t, y, pan=+0.22)
    if kaba:
        for t, y in cizgi(KABA, notalar, t0, VURUS, kazanc=0.62 * kaz * float(kaba), okt=-1, gecik=0.008, detune=-5, vib=(6.0, 4.8)):
            B.ekle("melodi", t, y, pan=0.0)


def _ust(ad):
    sira = ["C4", "D4", "Eb4", "F#4", "G4", "A4", "Bb4", "B4-", "C5", "D5"]
    if ad in sira and sira.index(ad) + 1 < len(sira):
        return sira[sira.index(ad) + 1]
    return None


def boru_dron(B, t0, sure, notalar=("D3", "A3"), kaz=1.0, atak=1.2, birak=1.6):
    for i, ad in enumerate(notalar):
        y = BORU.nota(hz(ad, False), sure, atak=atak, birak=birak, vib=(0, 5), nefes=2.0, esit_guc=True)
        B.ekle("zemin", t0, y, kazanc=kaz * (0.55 if i else 0.7), pan=(-0.25 if i else 0.2))


def dusuk_pedal(B, t0, sure, kaz=1.0):
    for sid, g, pan in (("muzik/kontrbas_D1", 0.55, 0.0), ("muzik/cello_D2", 0.35, -0.1)):
        x = sfx(sid)
        x = x[baslangic(x):]
        x = uzat(x / rms(x[SR: 3 * SR]) * 0.1, int((sure + 2) * SR), RNG)
        n = int((sure + 1.5) * SR)
        y = filtre(x[:n], hi=900) * zarf(n, 1.5, 1.5, esit_guc=True)[:, None]
        B.ekle("zemin", t0, y, kazanc=kaz * g, pan=pan)


def duyek(B, t0, vel=1.0, ek=(), yok=(), dum_kaz=1.0, tek_kaz=1.0):
    """Düyek: 8 sekizlik – düm(0) tek(1) · tek(3) düm(4) · tek(6) ·  (+ ek sekizlik tekler)."""
    desen = {0: ("d", 1.0), 1: ("t", 0.75), 3: ("t", 0.85), 4: ("d", 0.82), 6: ("t", 0.8)}
    for s in ek:
        desen[s] = ("t", 0.55)
    for s, (tur, v) in sorted(desen.items()):
        if s in yok:
            continue
        j = RNG.normal(0, 0.005)
        vv = vel * v * RNG.uniform(0.93, 1.03)
        if tur == "d":
            B.ekle("ritim", t0 + s * SEKIZLIK + j, davul_dum(vv, s // 4), kazanc=1.0 * dum_kaz, pan=-0.05)
        else:
            B.ekle("ritim", t0 + s * SEKIZLIK + j, davul_tek(vv, s), kazanc=0.55 * tek_kaz, pan=0.18)


def nakkare_desen(B, t0, sekizlikler, vel=0.6, onaltilik=()):
    for s in sekizlikler:
        f = 220.0 if s % 2 == 0 else 293.66
        B.ekle("ritim", t0 + s * SEKIZLIK + RNG.normal(0, 0.004), nakkare(f, vel * RNG.uniform(0.85, 1.0), s),
               kazanc=0.22, pan=0.42 if s % 2 else 0.3)
    for s in onaltilik:
        B.ekle("ritim", t0 + s * SEKIZLIK / 2, nakkare(293.66 if s % 2 else 220.0, vel * 0.8, s), kazanc=0.2, pan=0.36)


def zil_vur(B, t, vel=0.6, rr=0):
    B.ekle("ritim", t, zil(vel, rr), kazanc=0.16, pan=-0.35)


def kos_vur(B, t, vel=0.8, rr=0):
    B.ekle("ritim", t + RNG.normal(0, 0.004), kos(vel, rr), kazanc=0.5, pan=-0.12)


# ---------------- çalgı örnekleri (CC0) ----------------
ZURNA = Nefesli([("VSCO-2-CE", "Woodwinds/Oboe/Sus/Oboe_Sus_D3_v1_Main.wav", 293.66),
                 ("VSCO-2-CE", "Woodwinds/Oboe/Sus/Oboe_Sus_F3_v1_Main.wav", 349.23),
                 ("VSCO-2-CE", "Woodwinds/Oboe/Sus/Oboe_Sus_A#3_v1_Main.wav", 466.16)])
ZURNA2 = Nefesli([("VSCO-2-CE", "Woodwinds/Oboe/Vib/Oboe_Vib_D3_v1_Main.wav", 293.66),
                  ("VSCO-2-CE", "Woodwinds/Oboe/Vib/Oboe_Vib_F3_v1_Main.wav", 349.23),
                  ("VSCO-2-CE", "Woodwinds/Oboe/Vib/Oboe_Vib_A#3_v1_Main.wav", 466.16)])
KABA = Nefesli([("VSCO-2-CE", "Woodwinds/Bassoon/vib/PSBassoon_C2_v1_1.wav", 130.81),
                ("VSCO-2-CE", "Woodwinds/Bassoon/vib/PSBassoon_G2_v1_1.wav", 196.0),
                ("VSCO-2-CE", "Woodwinds/Bassoon/vib/PSBassoon_A2_v2_1.wav", 220.0),
                ("VSCO-2-CE", "Woodwinds/Bassoon/vib/PSBassoon_C3_v1_1.wav", 261.63)])
BORU = Nefesli([("sfx", "muzik/korno_D2", 146.83), ("sfx", "muzik/korno_A2", 220.0),
                ("VSCO-2-CE", "Brass/F Horn/sus/MOHorn_sus_G1_v2_1.wav", 98.0),
                ("VSCO-2-CE", "Brass/F Horn/sus/MOHorn_sus_C3_v2_1.wav", 261.63)], uzunluk_sn=20.0)


def govde_yaz():
    B = Bolum(GOVDE_OLCU * OLCU, kuyruk_sn=5.0, periyodik=True)
    L = B.L
    # --- zemin: boru dronu (2 ölçüde bir nefes, üst üste binen) + çok alçak pedal
    for o in range(0, GOVDE_OLCU, 2):
        notalar = ("G2", "D3") if o == 12 else ("D3", "A3")
        kaz = {0: 0.8, 4: 0.85, 8: 0.9, 12: 0.75, 14: 0.85, 16: 1.0, 18: 1.0, 20: 0.9, 22: 0.85}.get(o, 0.85)
        boru_dron(B, o * OLCU, 2 * OLCU - 0.2, notalar, kaz=kaz, atak=1.2, birak=1.4)
    for o in range(0, GOVDE_OLCU, 4):
        dusuk_pedal(B, o * OLCU, 4 * OLCU + 0.6, kaz=0.9 if 12 <= o < 16 else 1.0)
    # --- ritim
    dinamik = [0.78, 0.8, 0.82, 0.84, 0.82, 0.84, 0.84, 0.86, 0.9, 0.9, 0.9, 0.92, 0.74, 0.74, 0.78, 0.82,
               0.98, 0.98, 1.0, 1.0, 0.9, 0.88, 0.86, 0.86]
    for o in range(GOVDE_OLCU):
        t = o * OLCU
        v = dinamik[o]
        ek = (7,) if o % 4 == 3 else ()
        if 16 <= o < 20:
            ek = ek + (5,)
        if o == GOVDE_OLCU - 1:
            ek = (5, 7)
        duyek(B, t, v, ek=ek)
        if not (12 <= o < 16) or o in (12, 14):
            kos_vur(B, t, (0.75 * v + 0.1) * (0.85 if o < 8 or 12 <= o < 16 else 1.0), rr=o)
        if 16 <= o < 20:
            kos_vur(B, t + 2 * VURUS, 0.6, rr=o + 1)
        # nakkare
        if o in (2, 3):
            nakkare_desen(B, t, (2, 6), 0.5)
        elif 4 <= o < 8:
            nakkare_desen(B, t, (2, 3, 6, 7), 0.55)
        elif 8 <= o < 12:
            nakkare_desen(B, t, (1, 2, 3, 5, 6, 7), 0.6)
        elif 12 <= o < 16:
            nakkare_desen(B, t, (1, 3, 5, 7), 0.5)
        elif 16 <= o < 20:
            nakkare_desen(B, t, (1, 2, 3, 5, 6, 7), 0.68, onaltilik=(13, 15) if o == 19 else ())
        elif o in (20, 21, 22):
            nakkare_desen(B, t, (2, 6), 0.5)
        # zil
        if o in (0, 4, 6, 12, 20, 22) or 8 <= o < 12 or 16 <= o < 20:
            zil_vur(B, t, 0.55 if o in (12,) else 0.68, rr=o % 3)
        if 16 <= o < 20:
            zil_vur(B, t + 2 * VURUS, 0.45, rr=(o + 1) % 3)
    # --- melodi: zemin (B), nakarat (C), miyan (D), dönüş/doruk (E), boru çağrısı (F)
    zurna_ekle(B, MOTIF + kaydir_olcu(CEVAP_1, 3), 4 * OLCU, kaz=0.9, sesler=("z1",), kaba=0.8)
    zurna_ekle(B, MOTIF + kaydir_olcu(CEVAP_2, 3), 8 * OLCU, kaz=0.95, sesler=("z1", "z2"), kaba=True)
    zurna_ekle(B, MIYAN[:7], 12 * OLCU, kaz=0.85, sesler=("z1", "z2"))
    zurna_ekle(B, kaydir_olcu(MIYAN[7:], -2), 14 * OLCU, kaz=0.9, sesler=("z1", "z2"), kaba=True)
    zurna_ekle(B, MOTIF + kaydir_olcu(INIS, 3), 16 * OLCU, kaz=1.0, sesler=("z1", "z2"), kaba=True)
    cagri = [(0, 2, 2, "D3"), (1, 0, 1, "A3"), (1, 1, 1, "A3"), (1, 2, 2, "D4"), (2, 0, 3, "A3")]
    for t, y in cizgi(BORU, cagri, 20 * OLCU, VURUS, kazanc=0.5, koma=False, vib=(0, 5), atak=0.05, nefes=1.5):
        B.ekle("melodi", t, y, pan=-0.3)
    # doruk: boru uzun notaları zurnayı destekler
    for o, ad, s in ((16, "A3", 4), (17, "G3", 4), (18, "D3", 3)):
        B.ekle("melodi", o * OLCU, BORU.nota(hz(ad, False), s * VURUS, atak=0.25, birak=0.5, nefes=1.5), kazanc=0.32, pan=-0.3)
    return B, L


def giris_yaz():
    B = Bolum(GIRIS_OLCU * OLCU, kuyruk_sn=3.0)
    T = GIRIS_OLCU * OLCU
    r = sfx("vurus/timpani_rulo")
    r = kaydir(r[baslangic(r):], hz("D2", False) / 94.5)          # rulo ~94.5 Hz → Re2
    r = filtre(r[: int((T + 0.5) * SR)], lo=40, hi=500)
    n = len(r)
    t = np.arange(n) / SR
    r = r * (0.08 + 0.92 * np.clip(t / T, 0, 1) ** 1.6)[:, None] * zarf(n, 0.3, 0.05)[:, None]
    B.ekle("ritim", 0.0, r / np.abs(r).max(), kazanc=0.55)
    boru_dron(B, 0.15, T + 0.3, ("D3",), kaz=0.75, atak=2.6, birak=0.3)
    boru_dron(B, OLCU, T - OLCU + 0.3, ("A3",), kaz=0.6, atak=1.8, birak=0.3)
    dusuk_pedal(B, 0.0, T + 0.3, kaz=0.8)
    duyek(B, OLCU, 0.7, yok=(1, 3), ek=(5, 7))
    kos_vur(B, OLCU, 0.6, rr=1)
    return B


def kapanis_yaz():
    T = KAPANIS_OLCU * OLCU
    B = Bolum(T, kuyruk_sn=3.0)
    duyek(B, 0.0, 0.95, ek=(7,))
    kos_vur(B, 0.0, 0.85, rr=0)
    zil_vur(B, 0.0, 0.68, rr=1)
    zurna_ekle(B, SON, 0.0, kaz=1.0, sesler=("z1", "z2"), kaba=True)
    boru_dron(B, 0.0, T - 0.8, ("D3", "A3"), kaz=0.9, atak=0.2, birak=2.6)
    dusuk_pedal(B, 0.0, T - 1.0, kaz=0.9)
    B.ekle("ritim", OLCU, davul_dum(0.92, 0), kazanc=1.0, pan=-0.05)
    kos_vur(B, OLCU, 0.85, rr=1)
    zil_vur(B, OLCU, 0.6, rr=2)
    return B


def vurgu_yaz():
    """Sting (~4.5 sn): tek-tek → DÜM + kös + zil + zurna/kaba/boru Re üzerinde."""
    T = 4.5
    B = Bolum(T, kuyruk_sn=2.5)
    B.ekle("ritim", 0.0, davul_tek(0.8, 0), kazanc=0.55, pan=0.18)
    B.ekle("ritim", SEKIZLIK, davul_tek(0.9, 1), kazanc=0.55, pan=0.18)
    t1 = VURUS
    B.ekle("ritim", t1, davul_dum(1.0, 0), kazanc=1.0)
    kos_vur(B, t1, 1.0, rr=0)
    zil_vur(B, t1, 0.65, rr=1)
    son = [(0, 0, 3.6, "D4")]
    zurna_ekle(B, son, t1, kaz=1.0, sesler=("z1", "z2"), kaba=True)
    boru_dron(B, t1, 2.6, ("D3", "A3"), kaz=1.0, atak=0.08, birak=1.2)
    dusuk_pedal(B, t1, 2.4, kaz=0.9)
    return B, T


# =====================================================================================
# Miks, yazım, ölçüm
# =====================================================================================
KATMAN_KAZANC = {"zemin": 0.78, "ritim": 0.9, "melodi": 0.74}
TON = {  # katman başına son ton ayarı (yumuşak tiz, konuşma bölgesi hafif boş)
    "zemin": dict(lo=30, hi=1800, n_hi=2),
    "ritim": dict(lo=30, hi=3200, n_hi=2, tepe=[(2600, 0.7, -3.0), (75, 1.0, -3.0)]),
    "melodi": dict(lo=100, hi=2000, n_hi=2, tepe=[(420, 1.0, 2.5), (1500, 0.7, -2.0)]),
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
    st = birlestir(giris, govde, kapanis, b0, L, son_n)
    g = 10 ** (HEDEF_RMS_DB / 20) / rms(sum(st[k] for k in KATMANLAR))
    # 2. geçiş: ritim tepeleri −6 dBFS'ten itibaren yumuşakça −3 dBFS tavanına bükülür (kuru sinyalde)
    for B in (govde, giris, kapanis):
        B.s["ritim"] = yumusak_tavan(B.s["ritim"], 10 ** (-6 / 20) / g, 10 ** (-3 / 20) / g)
    st = birlestir(giris, govde, kapanis, b0, L, son_n)
    tam = sum(st[k] for k in KATMANLAR)
    g = 10 ** (HEDEF_RMS_DB / 20) / rms(tam)
    g = min(g, 10 ** (-1.5 / 20) / np.abs(tam).max())     # güvenlik: tepe ≤ −1.5 dBFS (gerekirse RMS biraz düşer)
    tam *= g
    for k in KATMANLAR:
        st[k] *= g
    vb, vT = vurgu_yaz()
    tonla(vb)
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

    # ---------------- ölçümler (diskteki dosyalardan) ----------------
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
        "ad": "Mehter yürüyüşü",
        "tarz": "Törensel ordu yürüyüşü – davul, kös, nakkare, zil, zurna/kaba zurna, boru (mehter geleneğine saygılı sinematik yorum)",
        "kullanim": ["ordu yürüyüşü", "sefer başlangıcı", "tahta çıkış (cülus) töreni", "ordu toplanması / alay", "zafer sonrası resmî geçit"],
        "donem": [1, 2, 3, 4, 5, 6],
        "ton_makam": "Re Hicaz (E♭ +15 sent, F♯ −15 sent koma renkleri); miyanda Sol üzerinde Rast rengi (Si −15 sent) – yaklaşım",
        "bpm": BPM,
        "usul_olcu": "Düyek'e yaklaşım, 8/8 (düm-tek-·-tek-düm-·-tek-·), 4/4 ölçü olarak yazıldı",
        "sure": round(sure, 3),
        "dongu": [round(b0 / SR, 6), round((b0 + L) / SR, 6)],
        "dongu_ornek": [b0, b0 + L],
        "katmanlar": [f"{ID}__zemin.flac", f"{ID}__ritim.flac", f"{ID}__melodi.flac"],
        "vurgu": f"{ID}__vurgu.flac",
        "yogunluk": "orta",
        "olcumler": o,
        "kaynaklar": [{"dosya": a, "depo": r, "yol": p, "lisans": "CC0 1.0"} for a, r, p in KULLANILAN] +
                     [{"dosya": "nakkare (sentez)", "depo": "-", "yol": "uret.py:nakkare()", "lisans": "kendi üretimimiz"}],
    }
    with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    with open(os.path.join(HERE, "KAYNAKLAR.tsv"), "w", encoding="utf-8") as f:
        f.write("dosya\tdepo\tyol\tlisans\n")
        for a, r, p in KULLANILAN:
            repo = {"VSCO-2-CE": "https://github.com/sgossner/VSCO-2-CE", "VCSL": "https://github.com/sgossner/VCSL"}.get(r, "tarih-reels/shared/sfx (CC0, kendi kataloğumuz)")
            f.write(f"{a}\t{repo}\t{p}\tCC0 1.0 (kamu malı)\n")
    print(json.dumps({k: v for k, v in o.items() if k not in ("katmanlar",)}, ensure_ascii=False, indent=1))
    print("katmanlar:", json.dumps(o["katmanlar"], ensure_ascii=False))
    print(f"süre {sure:.2f} sn · döngü {b0 / SR:.4f}–{(b0 + L) / SR:.4f} sn")


if __name__ == "__main__":
    main()
