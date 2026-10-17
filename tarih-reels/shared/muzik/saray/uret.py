#!/usr/bin/env python3
"""Seri müzik kütüphanesi · tarz `saray` — "Saray entrikası / Gerilim".

Kullanım:  python3 tarih-reels/shared/muzik/saray/uret.py
Çıktı:     out/saray__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, stereo, 24 bit), onizleme.mp3, meta.json
           Spektrogram PNG'leri: /tmp/claude-0/muzik-saray/ (git dışı).
Deterministik (sabit tohum). Gerekli: numpy, ffmpeg, git (CC0 örnekler talep üzerine kısmi klondan çekilir).

Ses tasarımı (♩ = 72, 4/4, Re; döngü 20 ölçü = 66.67 sn)
  zemin  : pes yaylı TREMOLO yatağı Re2 + Re3 (VSCO 2 CE çello ve kontrbas tremolo, shared/sfx muzik/cello_tremolo_D2)
           + çok hafif kontrbas Re2 uzun notası; bölümlere göre yavaş kabarıp çekilir.
  ritim  : yumuşak ahşap "tik-tak" (VCSL slit drum / log drum, her vuruş, tiz raf + yumuşatılmış saldırı),
           pes nabız: yumuşak timpani Re2 (VSCO, perde ayarlı) + kontrbas pizzicato Re2 (C bölümünde Re–Re–Mi♭–Re sürtüşmesi).
  melodi : LEITMOTIF bas hattında, iki kat yavaş (♩→𝅗𝅥) ve karanlık: çello grubu + kontrbas unison
           (B bölümü tam, D bölümü parçalanmış); viyola/keman grubunda yarım ses sürtüşmeli uzun notalar
           (Re4/Mi♭4, La3/Si♭3, Fa♯4/Sol4) – en tiz nota Sol4 (392 Hz), çığlık yok.
  oda    : ortak sıcak oda: ~1.9 sn (orta) sönüm, %18 ıslak.
Döngü dairesel üretilir (olaylar ve yankı kuyrukları başa sarılır; viyola Re4 pedalı ek yerinden geçer):
ses motoru döngü sonundan başına atladığında kesinti olmaz.
"""
import json, os, subprocess, time
import numpy as np

SR = 44100
ID = "saray"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
SFX = os.path.normpath(os.path.join(HERE, "..", "..", "sfx"))
KLON = os.environ.get("CC0_KLON", "/tmp/claude-0/sfx")
TMP = os.environ.get("MUZIK_TMP", "/tmp/claude-0/muzik-" + ID)
rng = np.random.default_rng(1341)         # Bizans iç savaşı 1341

BPM = 72; VURUS = 60 / BPM; OLCU = 4 * VURUS; OLCU_SAYISI = 20
GIRIS, DONGU, KAPANIS = 5.0, OLCU_SAYISI * OLCU, 6.0
NG, ND, NK = int(GIRIS * SR), int(round(DONGU * SR)), int(KAPANIS * SR)
H = 64
KULLANILAN = []


def zt(olcu, vurus=1.0):
    """Ölçü (1…20) ve vuruş (1…4.x) → döngü içi saniye."""
    return ((olcu - 1) * 4 + (vurus - 1)) * VURUS


# ───────────────────────── yardımcılar ─────────────────────────
def ornek(repo, yol):
    """CC0 örneği kısmi klondan getirir (yoksa klonlar). Başka süreç index.lock tutuyorsa bekler."""
    KULLANILAN.append((repo, yol))
    d = os.path.join(KLON, repo); p = os.path.join(d, yol)
    if os.path.exists(p): return p
    if not os.path.isdir(os.path.join(d, ".git")):
        os.makedirs(KLON, exist_ok=True)
        subprocess.run(["git", "clone", "--filter=blob:none", "--no-checkout", "--depth", "1",
                        f"https://github.com/sgossner/{repo}", d], check=True)
    err = ""
    for _ in range(30):
        r = subprocess.run(["git", "-C", d, "checkout", "HEAD", "--", yol], capture_output=True, text=True)
        if r.returncode == 0 and os.path.exists(p): return p
        err = r.stderr; time.sleep(2)
    raise RuntimeError(f"örnek alınamadı: {repo}:{yol}\n{err}")


def sfx(kimlik):
    KULLANILAN.append(("shared/sfx", kimlik + ".flac"))
    return os.path.join(SFX, kimlik + ".flac")


def yukle(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def yaz_flac(p, x):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                    "-c:a", "flac", "-sample_fmt", "s32", "-bits_per_raw_sample", "24", p],
                   input=np.clip(x, -1, 1).astype(np.float32).tobytes(), check=True)


def _uygula(x, g):
    N = len(x); X = np.fft.rfft(x, axis=0)
    return np.fft.irfft(X * (g[:, None] if x.ndim == 2 else g), N, axis=0)


def suz(x, lo=None, hi=None, n=2):
    """Sıfır fazlı FFT süzgeci (Butterworth genlik eğrisi). Dairesel: döngü malzemesi için doğal."""
    f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m /= np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * n))
    if hi: m /= np.sqrt(1 + (f / hi) ** (2 * n))
    return _uygula(x, m)


def tiz_raf(x, fc, db, genislik=1.5):
    """fc'den başlayıp `genislik` oktav boyunca `db`'ye inen yumuşak tiz raf."""
    f = np.fft.rfftfreq(len(x), 1 / SR)
    r = np.clip(np.log2(np.maximum(f, 1) / fc) / genislik, 0, 1)
    return _uygula(x, 10 ** (db * r / 20))


def yeniden_ornekle(x, oran):
    """Bant sınırlı (FFT) yeniden örnekleme; oran<1 → pes ve uzun."""
    xp = np.concatenate([x, np.zeros((int(.05 * SR),) + x.shape[1:])])
    n1 = len(xp); n2 = int(round(n1 / oran)); X = np.fft.rfft(xp, axis=0)
    Y = np.zeros((n2 // 2 + 1,) + X.shape[1:], complex); k = min(len(Y), len(X)); Y[:k] = X[:k]
    return np.fft.irfft(Y, n2, axis=0) * (n2 / n1)


def periyodik_gurultu(n, bw, hiz, rg):
    """Dairesel (periyodik) yumuşak gürültü, birim std: bw Hz'e kadar."""
    W = np.fft.rfft(rg.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / hiz)
    W *= np.exp(-.5 * (f / bw) ** 2); W[0] = 0
    y = np.fft.irfft(W, n); return y / (y.std() + 1e-12)


def ornek_hizina(a, n, dairesel):
    ci = np.arange(len(a)) * H
    if dairesel: return np.interp(np.arange(n), np.append(ci, n), np.append(a, a[0]))
    return np.interp(np.arange(n), ci, a)


def yumusat(a, k, dairesel):
    """Satır satır Hann çekirdeğiyle yumuşatma (k kontrol adımı)."""
    k = max(3, int(k) | 1); w = np.hanning(k); w /= w.sum()
    a = np.atleast_2d(a); out = np.empty_like(a)
    for i, r in enumerate(a):
        if dairesel:
            W = np.zeros(len(r)); W[:k] = w; W = np.roll(W, -(k // 2))
            out[i] = np.fft.irfft(np.fft.rfft(r) * np.fft.rfft(W), len(r))
        else:
            out[i] = np.convolve(np.pad(r, k // 2, mode="edge"), w, "valid")
    return out


def panla(y, p):
    """Eşit güçlü pan, p ∈ [-1, 1]."""
    return np.stack([y * np.sqrt((1 - p) / 2), y * np.sqrt((1 + p) / 2)], 1) * np.sqrt(2)


def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-12)


def ekle(buf, t, sig, g=1.0, dairesel=False):
    i = int(round(t * SR)); n = len(buf)
    if dairesel:                                   # len(sig) ≤ n → yinelenen indis yok
        idx = (i + np.arange(len(sig))) % n; buf[idx] += sig * g; return
    if i >= n: return
    sig = sig[: n - i]; buf[i: i + len(sig)] += sig * g


# ───────────────────────── oda ─────────────────────────
def oda_ir(rt, sure=5.0, on_gecikme=.024, rg=None):
    """Bantlara göre sönen (alçak uzun, tiz kısa → sıcak) stereo gürültü yankı tepkisi, birim enerji."""
    n = int(sure * SR); t = np.arange(n) / SR; f = np.fft.rfftfreq(n, 1 / SR)
    sinir = [0, 200, 800, 2500, 6000, None]
    def s(fc): return np.ones_like(f) if fc == 0 else (np.zeros_like(f) if fc is None else 1 / (1 + (fc / np.maximum(f, 1e-3)) ** 6))
    ir = np.zeros((n, 2))
    for c in range(2):
        W = np.fft.rfft(rg.standard_normal(n))
        for b in range(5):
            ir[:, c] += np.fft.irfft(W * (s(sinir[b]) - s(sinir[b + 1])), n) * np.exp(-6.91 * t / rt[b])
    ir *= (1 - np.exp(-t / .025))[:, None]                    # dağınık kuyruk yavaş kurulur
    for dt, g, p in ((.009, .55, -.4), (.014, .45, .5), (.021, .38, -.15), (.029, .3, .35), (.038, .26, -.55), (.051, .2, .2)):
        j = int(dt * SR); ir[j, 0] += g * np.sqrt((1 - p) / 2) * 3; ir[j, 1] += g * np.sqrt((1 + p) / 2) * 3
    ir = suz(ir, hi=5500, n=2)
    ir = np.concatenate([np.zeros((int(on_gecikme * SR), 2)), ir])
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def yankila(x, ir, islak):
    """Doğrusal evrişim (kuyruk dahil, uzunluk len(x)+len(ir)-1); kuru √(1-w), ıslak √w."""
    N = len(x) + len(ir) - 1; nf = 1 << (N - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nf, axis=0) * np.fft.rfft(ir, nf, axis=0), nf, axis=0)[:N]
    out = y * np.sqrt(islak); out[: len(x)] += x * np.sqrt(1 - islak); return out


def dairesel_yankila(x, ir, islak):
    """Döngü malzemesi için: kuyruk başa sarılır. Döndürür: (dairesel döngü, katlanmadan önceki kuyruk)."""
    y = yankila(x, ir, islak); n = len(x); kuyruk = y[n:].copy(); c = y[:n].copy()
    for j in range(0, len(kuyruk), n): c[: len(kuyruk[j: j + n])] += kuyruk[j: j + n]
    return c, kuyruk



# ───────────────────────── döngüsel doku ─────────────────────────
def doku_dongusu(x, n, bas_s, son_s, parca_s, xf_s, rg):
    """Örneğin sürekli bölümünden eşit güçlü çapraz geçişlerle dairesel uzun doku (n örnek)."""
    xf = int(xf_s * SR); adet = max(2, round(n / (int(parca_s * SR) - xf)))
    p = np.round(np.arange(adet + 1) * n / adet).astype(int)
    r = np.arange(xf) / xf; y = np.zeros((n, 2)); a0, a1 = int(bas_s * SR), int(son_s * SR)
    for j in range(adet):
        L = p[j + 1] - p[j] + xf; s = int(rg.integers(a0, max(a0 + 1, a1 - L)))
        seg = x[s: s + L].copy(); seg[:xf] *= np.sin(.5 * np.pi * r)[:, None]; seg[-xf:] *= np.cos(.5 * np.pi * r)[:, None]
        ekle(y, p[j] / SR, seg, dairesel=True)
    return y


# ───────────────────────── ölçüm ─────────────────────────
def olc(x, dongu=None, esik_db=-45.0, govde=None):
    m = x.mean(1); X = np.abs(np.fft.rfft(m)) ** 2; f = np.fft.rfftfreq(len(m), 1 / SR); top = X.sum()
    w = int(.25 * SR); win = np.hanning(w); fw = np.fft.rfftfreq(w, 1 / SR); mer, sev = [], []
    for i in range(0, len(m) - w + 1, w):
        S = np.abs(np.fft.rfft(m[i: i + w] * win)) ** 2
        mer.append((fw * S).sum() / (S.sum() + 1e-20)); sev.append(rms_db(x[i: i + w]))
    mer, sev = np.array(mer), np.array(sev)
    gec = (sev[1:] > esik_db) & (sev[:-1] > esik_db)
    sic = np.abs(np.diff(np.log2(np.maximum(mer, 1)))); sic[~gec] = 0
    s1 = int(.5 * SR); xb = x if govde is None else x[int(govde[0] * SR): int(govde[1] * SR)]
    r1 = np.array([rms_db(xb[i: i + s1]) for i in range(0, len(xb) - s1 + 1, s1)])
    o = {"rms_dbfs": round(rms_db(x), 2), "tepe_dbfs": round(20 * np.log10(np.abs(x).max()), 2),
         "kirpilma_ornek": int((np.abs(x) >= .9999).sum()),
         "tiz_4k_ustu_oran": round(float(X[f > 4000].sum() / top), 4),
         "konusma_1k5_4k_oran": round(float(X[(f >= 1500) & (f < 4000)].sum() / top), 4),
         "spektral_merkez_ort_hz": round(float(np.median(mer[sev > esik_db])), 1),
         "merkez_sicrama_maks_oktav": round(float(sic.max()), 3),
         "merkez_sicrama_zamani_sn": round(float((np.argmax(sic) + 1) * .25), 2),
         "yogunluk_artisi_maks_db_0_5sn": round(float(np.max(np.diff(r1[r1 > -60]))) if (r1 > -60).sum() > 1 else 0.0, 2)}
    if dongu:
        s, e = int(dongu[0] * SR), int(dongu[1] * SR); d = np.abs(np.diff(x[s:e], axis=0)).max(1)
        sicrama = float(np.abs(x[s] - x[e - 1]).max())
        n50 = int(.05 * SR); r50 = np.array([rms_db(x[i: i + n50]) for i in range(s, e - n50 + 1, n50)])
        o["dongu"] = {"govde_bitisik_50ms_rms_fark_p95_db": round(float(np.percentile(np.abs(np.diff(r50)), 95)), 3),"dalga_sicramasi": round(sicrama, 6), "govde_ornek_farki_p99_9": round(float(np.percentile(d, 99.9)), 6),
                      "rms_fark_db_50ms": round(abs(rms_db(x[e - n50: e]) - rms_db(x[s: s + n50])), 3),
                      "merkez_fark_oktav": round(float(abs(np.log2(mer[int(dongu[1] / .25) - 1] / mer[int(dongu[0] / .25)]))), 3)}
    return o


def png_yaz(yol, rgb):
    import struct, zlib
    h, w, _ = rgb.shape; raw = b"".join(b"\x00" + rgb[i].tobytes() for i in range(h))
    def parca(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    with open(yol, "wb") as fh:
        fh.write(b"\x89PNG\r\n\x1a\n" + parca(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
                 + parca(b"IDAT", zlib.compress(raw, 6)) + parca(b"IEND", b""))


def spektrogram(x, yol, dongu=None, fmin=30.0, fmax=8000.0, W=1600, Hs=520, Hb=140):
    """Log-frekans spektrogram (8192 örnek pencere → bas bölgede de doğru) + alt şerit: 250 ms RMS (beyaz, −50…−5 dBFS)
    ve spektral merkez (turuncu, 100 Hz…4 kHz log). Yatay çizgiler: 100 Hz ve 1 kHz (gri), 1.5 kHz ve 4 kHz (camgöbeği);
    dikey: 5 sn işaretleri (gri), döngü noktaları (yeşil)."""
    m = x.mean(1); nf = 8192; hop = max(1, (len(m) - nf) // (W - 1)); win = np.hanning(nf)
    fr = np.fft.rfftfreq(nf, 1 / SR); satir = np.geomspace(fmin, fmax, Hs + 1); bi = np.searchsorted(fr, satir)
    img = np.zeros((Hs, W))
    for c in range(W):
        seg = m[c * hop: c * hop + nf]; seg = np.pad(seg, (0, nf - len(seg)))
        S = np.abs(np.fft.rfft(seg * win)) ** 2
        img[:, c] = 10 * np.log10(np.maximum.reduceat(S, bi[:-1])[: Hs] + 1e-20)
    v = np.clip((img - img.max() + 100) / 100, 0, 1)[::-1]
    R = np.array([[0, 0, 0], [40, 10, 90], [120, 20, 120], [200, 50, 60], [245, 130, 30], [250, 220, 80], [255, 255, 240]], float)
    k = v * (len(R) - 1); j = np.clip(k.astype(int), 0, len(R) - 2); q = (k - j)[..., None]
    ust = (R[j] * (1 - q) + R[j + 1] * q).astype(np.uint8)
    for fg, rk in ((100, (110, 110, 110)), (1000, (110, 110, 110)), (1500, (60, 200, 255)), (4000, (60, 200, 255))):
        ust[Hs - 1 - np.searchsorted(satir, fg), ::3] = rk
    alt = np.full((Hb, W, 3), 18, np.uint8); sure = len(m) / SR
    w = int(.25 * SR); xs, rm, me = [], [], []
    for i in range(0, len(m) - w + 1, w):
        seg = m[i: i + w] * np.hanning(w); S = np.abs(np.fft.rfft(seg)) ** 2; f = np.fft.rfftfreq(w, 1 / SR)
        xs.append(min(W - 1, int((i + w / 2) / len(m) * W))); rm.append(rms_db(x[i: i + w])); me.append((f * S).sum() / (S.sum() + 1e-20))
    for xx, r_, c_ in zip(xs, rm, me):
        y1 = int(np.clip((r_ + 50) / 45, 0, 1) * (Hb - 1)); alt[Hb - 1 - y1, max(0, xx - 1): xx + 2] = (240, 240, 240)
        if r_ > -45:
            y2 = int(np.clip(np.log2(max(c_, 100) / 100) / np.log2(40), 0, 1) * (Hb - 1)); alt[Hb - 1 - y2, max(0, xx - 1): xx + 2] = (255, 150, 30)
    rgb = np.concatenate([ust, np.full((4, W, 3), 60, np.uint8), alt])
    for ts in np.arange(0, sure, 5.0): rgb[:, min(W - 1, int(ts / sure * W)), :] = np.maximum(rgb[:, min(W - 1, int(ts / sure * W)), :], 70)
    for ts in (dongu or []): rgb[:, min(W - 1, int(ts / sure * W)), :] = (40, 230, 90)
    png_yaz(yol, rgb)


def gorsel(x, ad, dongu=None):
    os.makedirs(TMP, exist_ok=True); spektrogram(x, os.path.join(TMP, ad + "_spektrogram.png"), dongu)


# ───────────────────────── örnek bankası (yaylılar) ─────────────────────────
V, L = "VSCO-2-CE", "VCSL"
# gerçek perde (MIDI) → VSCO dosya adı. VSCO adları gerçek perdenin bir oktav altını yazar (YIN ile doğrulandı:
# ör. "susvib_D2" = Re3 147 Hz, "BKCtbss_SusNV_D1" = Re2 73 Hz).
BANKA = {
    "cello": {36: "C1", 40: "E1", 43: "G1", 47: "B1", 50: "D2", 53: "F2", 57: "A2"},
    "kbas": {31: "G0", 34: "A#0", 36: "C1", 38: "D1", 40: "E1", 42: "F#1", 44: "G#1", 45: "A1"},
    "viyola": {48: "C2", 50: "D2", 52: "E2", 55: "G2", 59: "B2", 62: "D3", 65: "F3", 69: "A3"},
    "keman": {55: "G2", 57: "A2", 59: "B2", 62: "D3", 66: "F#3", 69: "A3"},
}
YOL = {"cello": "Strings/Cello Section/susvib/susvib_{}_v1_1.wav",
       "kbas": "Strings/Solo Contrabass/SusNV/BKCtbss_SusNV_{}_v1_rr1.wav",
       "viyola": "Strings/Viola Section/susvib/ViolaEns_susvib_{}_v1_1.wav",
       "keman": "Strings/Violin Section/susVib/VlnEns_susVib_{}_v1.wav"}
NOTA = {"C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
KOMA = {"Eb": 15, "F#": -15}          # Hicaz rengi (sent): Mi♭ biraz tiz, Fa♯ biraz pes
_onb = {}


def midi_no(ad): return 12 * (int(ad[-1]) + 1) + NOTA[ad[:-1]]


def perdeli(ens, ad):
    """Enstrümanın en yakın örneğinden (≤ 2 yarım ses; eşitlikte üstteki örnek aşağı kaydırılır) perdeli nota."""
    if (ens, ad) not in _onb:
        m = midi_no(ad); k = min(BANKA[ens], key=lambda q: (abs(q - m), q < m))
        x = yukle(ornek(V, YOL[ens].format(BANKA[ens][k])))
        oran = 2 ** ((m - k + KOMA.get(ad[:-1], 0) / 100) / 12)
        _onb[(ens, ad)] = x if abs(oran - 1) < 1e-9 else yeniden_ornekle(x, oran)
    return _onb[(ens, ad)]


def uzat(x, n, rg, bas_s=1.0, xf_s=.8, parca_s=3.0):
    """Örneği n örneğe uzatır: baş (saldırı) korunur; sonrası sürekli bölümden eşit güçlü çapraz geçişli parçalar."""
    xf = int(xf_s * SR); a0 = int(bas_s * SR); a1 = len(x) - int(.8 * SR); L = min(int(parca_s * SR), a1 - a0)
    r = np.arange(xf) / xf; yuk = np.sin(.5 * np.pi * r)[:, None]; dus = np.cos(.5 * np.pi * r)[:, None]
    bas = min(a1, n); y = np.zeros((n + L + xf, 2)); y[:bas] = x[:bas]
    if bas >= n: return y[:n]
    pos = bas - xf; y[pos:bas] *= dus
    while pos < n:
        s = int(rg.integers(a0, max(a0 + 1, a1 - L)))
        seg = x[s: s + L].copy(); seg[:xf] *= yuk; seg[-xf:] *= dus
        y[pos: pos + L] += seg; pos += L - xf
    return y[:n]


def nota(ens, ad, sure_s, rg, atak_s=.2, birakma_s=1.0, dinamik=None):
    """Yay notası: uzatılmış örnek × zarf (sin² giriş, cos² bırakma) × dinamik eğrisi [(0…1 göreli zaman, kazanç)]."""
    n = int((sure_s + birakma_s) * SR); y = uzat(perdeli(ens, ad), n, rg); t = np.arange(n) / SR
    e = np.sin(.5 * np.pi * np.clip(t / atak_s, 0, 1)) ** 2
    e *= np.where(t < sure_s, 1, np.cos(.5 * np.pi * np.clip((t - sure_s) / birakma_s, 0, 1)) ** 2)
    if dinamik: e *= np.interp(np.minimum(t / sure_s, 1), [d[0] for d in dinamik], [d[1] for d in dinamik])
    return y * e[:, None]


def denge(x, p):
    """Stereo kaynağa pan dengesi (p ∈ [-1, 1])."""
    return x * np.array([np.sqrt(1 - p), np.sqrt(1 + p)])


def vurmali(yol, oran=1.0, hi=2000.0, atak_ms=6.0, en_uzun_s=None):
    """Vurmalı örnek: (perde) → yumuşatılmış saldırı (atak_ms sin² rampa, tepe öncesinden) → alçak geçiren → tepe 1."""
    x = yukle(yol)
    if oran != 1.0: x = yeniden_ornekle(x, oran)
    if en_uzun_s: x = x[: int(en_uzun_s * SR)]
    zarf = np.abs(x).max(1); i0 = max(0, int(np.argmax(zarf > zarf.max() * .05)) - int(.002 * SR))
    x = np.concatenate([x[i0:], np.zeros((int(.3 * SR), 2))])
    a = int(atak_ms / 1000 * SR); x[:a] *= (np.sin(.5 * np.pi * np.arange(a) / a) ** 2)[:, None]
    f = int(.25 * SR); x[-f - int(.3 * SR): -int(.3 * SR)] *= (np.cos(.5 * np.pi * np.arange(f) / f) ** 2)[:, None]
    x = suz(x, lo=30, hi=hi, n=2)
    return x / np.abs(x).max()


def bolum_egrisi(noktalar):
    """[(ölçü, kazanç)] → döngü boyunca dairesel, yumuşak kazanç eğrisi (örnek hızında)."""
    xs = [zt(o) for o, _ in noktalar]; ys = [g for _, g in noktalar]
    xs = xs + [xs[0] + DONGU]; ys = ys + [ys[0]]
    C = -(-ND // H); tc = np.arange(C) * H / SR
    g = np.interp(tc, xs, ys, period=None) if xs[0] == 0 else np.interp((tc - xs[0]) % DONGU + xs[0], xs, ys)
    return ornek_hizina(yumusat(g, 1.2 * SR / H, True)[0], ND, True)


# ───────────────────────── katmanlar ─────────────────────────
def tremolo_yatagi(rg):
    """Re2 + Re3 pes yaylı tremolo + çok hafif kontrbas Re2; dairesel (ND örnek)."""
    c_e2 = yeniden_ornekle(yukle(ornek(V, "Strings/Cello Section/trem/trem_E1_v1_1.wav")), 2 ** (-2 / 12))      # Mi2 → Re2
    k_e2 = yeniden_ornekle(yukle(ornek(V, "Strings/Solo Contrabass/Trem/BKCtbss_Trem_E1_v1_rr1.wav")), 73.416 / 81.37)  # Mi2 (−22 sent) → Re2
    c_d3a = yukle(sfx("muzik/cello_tremolo_D2"))                                                            # Re3
    c_d3b = yukle(ornek(V, "Strings/Cello Section/trem/trem_D2_v1_1.wav"))                                  # Re3
    kb = yukle(ornek(V, "Strings/Solo Contrabass/SusNV/BKCtbss_SusNV_D1_v1_rr1.wav"))                       # Re2 uzun
    def dd(x, parca=3.0, xf=1.0): return doku_dongusu(x, ND, .6, len(x) / SR - .6, parca, xf, rg)
    re2 = denge(dd(c_e2), -.2) + denge(dd(k_e2), .2)
    re3 = denge(dd(c_d3a), -.45) + denge(dd(c_d3b), .45)
    y = re2 / np.sqrt(np.mean(re2 ** 2)) + .6 * re3 / np.sqrt(np.mean(re3 ** 2)) + .3 * (lambda p: p / np.sqrt(np.mean(p ** 2)))(dd(kb, 4.0, 1.4))
    y = tiz_raf(suz(y, lo=35, hi=2400, n=2), 900, -4)
    return y * bolum_egrisi([(1, .84), (4.5, .86), (5.5, .8), (9, .84), (11, 1.02), (13, 1.3), (14.6, 1.05), (15.5, .86), (19, .85), (20.6, .84)])[:, None]


def vurmali_bankasi():
    P = {}
    P["tik"] = [vurmali(ornek(L, f"Idiophones/Struck Idiophones/Slit Drum/LogDrumHi_MedM_v{v}_rr1_Sum.wav"), hi=1800, atak_ms=7) for v in (1, 2)]
    P["tak"] = [vurmali(ornek(L, f"Idiophones/Struck Idiophones/Slit Drum/LogDrumLo_MedM_v{v}_rr1_Sum.wav"), hi=1800, atak_ms=7) for v in (1, 2)]
    P["timp"] = [vurmali(ornek(V, f"Percussion/Timpani/Timpani1_Hit_v1_rr{r}_Sum.wav"), 73.416 / 89.7, hi=1100, atak_ms=9) for r in (1, 2)]
    P["timp_guclu"] = vurmali(ornek(V, "Percussion/Timpani/Timpani1_Hit_v3_rr1_Sum.wav"), 73.416 / 89.7, hi=1300, atak_ms=8)
    pz = [ornek(V, f"Strings/Solo Contrabass/Pizz/BKCtbss_Pizz_D1_v1_rr{r}.wav") for r in (1, 2)]
    P["pizz"] = [vurmali(p, hi=1400, atak_ms=6) for p in pz]
    P["pizz_eb"] = vurmali(pz[0], 2 ** (1.15 / 12), hi=1400, atak_ms=6)        # Mi♭2 (+15 sent)
    return P


def ritim_kuru(P, rg):
    y = np.zeros((ND, 2))
    def koy(t, s, g, p=0.0): ekle(y, t + rg.normal(0, .005), denge(s, p), g, dairesel=True)
    for o in range(1, OLCU_SAYISI + 1):
        b = "A" if o <= 4 else "B" if o <= 10 else "C" if o <= 14 else "D"
        for v in range(1, 5):                                   # ahşap tik-tak: her vuruş
            s = P["tik"][int(rg.integers(2))] if v % 2 else P["tak"][int(rg.integers(2))]
            koy(zt(o, v), s, (.8 if v == 1 else .66 if v == 3 else .6) * 10 ** (rg.normal(0, .8) / 20), .3 if v % 2 else -.25)
            if b == "C" and v in (2, 4): koy(zt(o, v + .5), P["tak"][1], .28, -.25)       # C: araya hafif "tak"
        if (b == "A" and o in (1, 3)) or (b == "D" and o in (15, 17, 19)): koy(zt(o), P["timp"][o % 2], .62)
        elif b == "B": koy(zt(o), P["timp"][o % 2], .5 if o == 5 else .62)
        elif b == "C": koy(zt(o), P["timp"][0], .85); koy(zt(o, 3), P["timp"][1], .62)
        if b == "B":
            koy(zt(o), P["pizz"][0], .5 if o == 5 else .66, .15); koy(zt(o, 3), P["pizz"][1], .54, .15)
        elif b == "C":                                           # nabız hızlanır: Re–Re–Mi♭–Re
            for v, (s, g) in enumerate([(P["pizz"][0], .85), (P["pizz"][1], .62), (P["pizz_eb"], .78), (P["pizz"][1], .62)], 1): koy(zt(o, v), s, g, .15)
        elif b == "D":
            koy(zt(o), P["pizz"][0], .68 if o <= 18 else .55, .15)
            if o <= 18: koy(zt(o, 3), P["pizz"][1], .52, .15)
    return y


MOTIF_B = [(5, 1, "A2", 2), (5, 3, "Bb2", 2), (6, 1, "A2", 4), (7, 1, "G2", 2), (7, 3, "F#2", 2), (8, 1, "G2", 2), (8, 3, "Eb2", 2), (9, 1, "D2", 6)]
MOTIF_D = [(15, 1, "A2", 2), (15, 3, "Bb2", 2), (16, 1, "A2", 4), (17, 3, "F#2", 2), (18, 1, "G2", 2), (18, 3, "Eb2", 2), (19, 1, "D2", 7)]
UST = [  # (enstrüman, nota, (ölçü, vuruş), süre (vuruş), dinamik, pan) — yarım ses sürtüşmeleri
    ("viyola", "D4", (17, 1), 28, [(0, 0), (.12, .5), (.4, .58), (.75, .5), (1, .4)], -.3),   # ek yerinden geçen pedal (17 → 4)
    ("keman", "Eb4", (3, 1), 7, [(0, 0), (.45, .38), (1, .3)], .35),                          # Re4/Mi♭4
    ("viyola", "A3", (5, 1), 15, [(0, 0), (.25, .45), (1, .38)], -.3),
    ("keman", "Bb3", (7, 1), 11, [(0, 0), (.3, .36), (1, .28)], .35),                         # La3/Si♭3
    ("viyola", "D4", (11, 1), 15, [(0, 0), (.15, .55), (.55, .82), (1, .45)], -.3),
    ("keman", "F#4", (11, 3), 13, [(0, 0), (.2, .45), (.55, .7), (1, .35)], .35),
    ("viyola", "G4", (12, 1), 10, [(0, 0), (.3, .38), (.5, .6), (1, .3)], -.1),            # Fa♯4/Sol4
    ("keman", "Eb4", (18, 1), 9, [(0, 0), (.35, .33), (1, .26)], .35),                        # Re4/Mi♭4
]


def melodi_kuru(rg):
    y = np.zeros((ND, 2))
    for bolum, motif, kaz in (("B", MOTIF_B, 1.0), ("D", MOTIF_D, .82)):
        tampon = np.zeros((ND, 2))
        for j, (o, v, ad, vur) in enumerate(motif):
            son = j == len(motif) - 1; d = vur * VURUS + (0 if son else .18)       # legato: bir sonrakine hafif bindirme
            dyn = ([(0, .95), (.35, 1.0), (1, .5)] if bolum == "B" else [(0, .9), (.3, .85), (1, .1)]) if son else [(0, .85), (.5, 1.0), (1, .92)]
            at = .8 if j == 0 else .22                                                 # ilk nota yavaşça belirir
            s = denge(nota("cello", ad, d, rg, atak_s=at, birakma_s=.5 if not son else 1.2, dinamik=dyn), -.15) * .8 \
                + denge(nota("kbas", ad, d, rg, atak_s=at + .03, birakma_s=.5 if not son else 1.2, dinamik=dyn), .1)
            ekle(tampon, zt(o, v), s, kaz, dairesel=True)
        if bolum == "D": tampon = suz(tampon, hi=700, n=2)         # parçalanmış dönüş: daha koyu
        y += tampon
    bas = y / np.sqrt(np.mean(y ** 2))
    ust = np.zeros((ND, 2))
    for ens, ad, (o, v), vur, dyn, p in UST:
        ekle(ust, zt(o, v), denge(nota(ens, ad, vur * VURUS, rg, atak_s=.6, birakma_s=1.6, dinamik=dyn), p), 1.0, dairesel=True)
    ust = tiz_raf(suz(ust, hi=2600, n=2), 1300, -6)
    ust = ust / np.sqrt(np.mean(ust ** 2))
    return bas, ust


def main():
    os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
    ir = oda_ir((2.1, 1.9, 1.6, 1.1, .6), sure=3.5, on_gecikme=.015, rg=rng)
    ISLAK = .18

    zemin_k = tremolo_yatagi(rng); zemin_k *= 10 ** ((-23.5 - rms_db(zemin_k)) / 20)
    P = vurmali_bankasi()
    ritim_k = ritim_kuru(P, rng); rit_g = 10 ** ((-28 - rms_db(ritim_k)) / 20); ritim_k *= rit_g
    bas, ust = melodi_kuru(rng)
    BAS_DB, UST_DB = -28.0, -29.0                    # döngü ortalaması (bas yalnız ~%55 sürede çalar)
    mel_k = bas * 10 ** (BAS_DB / 20) + ust * 10 ** (UST_DB / 20)

    zemin_C, _ = dairesel_yankila(zemin_k, ir, ISLAK)
    ritim_C, ritim_kuyruk = dairesel_yankila(ritim_k, ir, ISLAK)
    mel_C, _ = dairesel_yankila(mel_k, ir, ISLAK)

    def acilis(s):
        u = np.clip(np.arange(NG) / (s * SR), 0, 1); return (np.sin(.5 * np.pi * u) ** 2)[:, None]
    zemin_G, ritim_G, mel_G = zemin_C[-NG:] * acilis(4.0), ritim_C[-NG:] * acilis(2.5), mel_C[-NG:] * acilis(3.0)

    # kapanış: yaylılar döngü başından sürüp söner; vurmalılar durur, son vuruşta timpani + pizz Re; çello+kontrbas Re2 kapanışı
    tk = np.arange(NK) / SR
    sondur = (np.where(tk < 1.0, 1, np.cos(.5 * np.pi * np.clip((tk - 1.0) / 4.4, 0, 1)) ** 2))[:, None]
    zemin_K = zemin_C[:NK] * sondur
    rk = np.zeros((NK, 2)); ekle(rk, 0, P["timp"][0], .55 * rit_g); ekle(rk, .01, denge(P["pizz"][0], .15), .55 * rit_g)
    ritim_K = yankila(rk, ir, ISLAK)[:NK] + np.pad(ritim_kuyruk, ((0, max(0, NK - len(ritim_kuyruk))), (0, 0)))[:NK]
    son_re = (denge(nota("cello", "D2", 3.4, rng, atak_s=.9, birakma_s=1.8, dinamik=[(0, .9), (.3, 1), (1, .45)]), -.15) * .8
              + denge(nota("kbas", "D2", 3.4, rng, atak_s=.9, birakma_s=1.8, dinamik=[(0, .9), (.3, 1), (1, .45)]), .1))
    son_re = suz(son_re, hi=900, n=2) * 10 ** (BAS_DB / 20)
    mk = np.zeros((NK, 2)); ekle(mk, 0, son_re, 1.0)
    mel_K = mel_C[:NK] * sondur + yankila(mk, ir, ISLAK)[:NK]
    bitis = np.ones((NK, 1)); fz = int(.6 * SR); bitis[-fz:, 0] = np.cos(.5 * np.pi * np.arange(fz) / fz) ** 2
    zemin_K *= bitis; ritim_K *= bitis; mel_K *= bitis

    katman = {"zemin": np.concatenate([zemin_G, zemin_C, zemin_K]),
              "ritim": np.concatenate([ritim_G, ritim_C, ritim_K]),
              "melodi": np.concatenate([mel_G, mel_C, mel_K])}
    tam = sum(katman.values())
    g = 10 ** ((-20.0 - rms_db(tam)) / 20); tam *= g
    for k in katman: katman[k] *= g
    tepe = np.abs(tam).max()
    if tepe > 10 ** (-1.2 / 20):
        h = 10 ** (-1.2 / 20) / tepe; tam *= h
        for k in katman: katman[k] *= h

    vurgu = sting(ir, P, rng)

    dosyalar = {}
    for ad, x in [("tam", tam)] + list(katman.items()) + [("vurgu", vurgu)]:
        p = os.path.join(OUT, f"{ID}__{ad}.flac"); yaz_flac(p, x); dosyalar[ad] = p
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", dosyalar["tam"], "-c:a", "libmp3lame", "-b:a", "128k",
                    os.path.join(HERE, "onizleme.mp3")], check=True)

    dongu = [GIRIS, round(GIRIS + DONGU, 4)]
    olcum = {"tam": olc(tam, dongu, govde=dongu)}
    for ad in ("zemin", "ritim", "melodi"):
        o = olc(katman[ad]); olcum[ad] = {k: o[k] for k in ("rms_dbfs", "tepe_dbfs", "tiz_4k_ustu_oran", "konusma_1k5_4k_oran", "merkez_sicrama_maks_oktav")}
    ov = olc(vurgu); olcum["vurgu"] = {k: ov[k] for k in ("rms_dbfs", "tepe_dbfs", "tiz_4k_ustu_oran", "konusma_1k5_4k_oran", "merkez_sicrama_maks_oktav")}
    olcum["katman_toplami_fark_db"] = round(rms_db(sum(katman.values()) - tam) - rms_db(tam), 1)
    gov = tam[int(dongu[0] * SR): int(dongu[0] * SR) + ND]
    olcum["tam"]["dongu"]["ek_yeri_merkez_sicrama_oktav"] = olc(np.concatenate([gov[-int(2 * SR):], gov[: int(2 * SR)]]))["merkez_sicrama_maks_oktav"]
    gorsel(tam, f"{ID}_tam", dongu); gorsel(vurgu, f"{ID}_vurgu")
    for ad in katman: gorsel(katman[ad], f"{ID}_{ad}", dongu)
    gorsel(np.concatenate([gov[-int(10 * SR):], gov[: int(10 * SR)]]), f"{ID}_dongu_eki", [10.0])

    kaynaklar = sorted(set(KULLANILAN))
    meta = {
        "id": ID, "ad": "Saray entrikası / Gerilim",
        "tarz": "Karanlık gerilim: pes yaylı tremolo, yumuşak ahşap tik-tak ve pes nabız (timpani + kontrbas pizzicato), "
                "bas hattında yavaşlatılmış leitmotif, viyola/kemanda yarım ses sürtüşmeli uzun notalar",
        "kullanim": ["taht kavgaları ve veraset meseleleri", "iç savaş (Bizans iç savaşı 1341–47, Kantakuzenos)", "Fetret dönemi (1402–13)",
                     "kardeş katli, suikast, komplo", "gizli diplomasi, belirsizlik", "\"ama bir sorun vardı\" dönüş anları"],
        "donem": [1, 2, 3, 4, 5, 6, 7],
        "ton_makam": "Re; Re pedalı üzerinde Hicaz dizisi (Re–Mi♭–Fa♯–Sol–La–Si♭–Do), Mi♭ +15 / Fa♯ −15 sent koma; "
                     "leitmotif bas hattında iki kat yavaş (tam: 18.3–36.7 sn, parçalı: 51.7–70.8 sn)",
        "bpm": BPM, "usul_olcu": "4/4 (usul değil; batı ölçüsü, saat tik-takı hissi)",
        "sure": round(len(tam) / SR, 2), "dongu": dongu, "dongu_ornek": [NG, NG + ND], "ornek_hizi": SR,
        "katmanlar": [{"ad": "zemin", "dosya": f"out/{ID}__zemin.flac", "icerik": "pes yaylı tremolo Re2+Re3 + kontrbas Re2 (bölümlere göre kabarır)"},
                      {"ad": "ritim", "dosya": f"out/{ID}__ritim.flac", "icerik": "ahşap tik-tak (her vuruş), yumuşak timpani Re2, kontrbas pizzicato Re2/Mi♭2"},
                      {"ad": "melodi", "dosya": f"out/{ID}__melodi.flac", "icerik": "bas leitmotifi (çello+kontrbas) + viyola/keman yarım ses sürtüşmeleri"},
                      {"ad": "vurgu", "dosya": f"out/{ID}__vurgu.flac", "icerik": "4.5 sn karanlık vurgu: timpani + pizz Re2, Re/Mi♭ tremolo kümesi şişip söner, viyola Re4 / keman Mi♭4"}],
        "yogunluk": "orta", "olcumler": olcum,
        "kaynaklar": [f"{r}: {y}" for r, y in kaynaklar] + ["sentez: yok (yalnız işleme: perde kaydırma, döngüsel doku, süzgeç, oda yankısı)"],
    }
    with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=1)
    print(json.dumps(olcum, ensure_ascii=False, indent=1))


def sting(ir, P, rg):
    """4.5 sn: timpani + pizz Re2 vuruşu; Re2/Re3/Mi♭3 tremolo kümesi hızlı şişip yavaş söner; viyola Re4 + keman Mi♭4."""
    n = int(4.5 * SR); y = np.zeros((n, 2)); t = np.arange(n) / SR
    ekle(y, 0, P["timp_guclu"], .9); ekle(y, .012, denge(P["pizz"][0], .15), .7)
    trem = [(yeniden_ornekle(yukle(ornek(V, "Strings/Cello Section/trem/trem_E1_v1_1.wav")), 2 ** (-2 / 12)), 1.0, -.2),
            (yukle(ornek(V, "Strings/Cello Section/trem/trem_D2_v1_1.wav")), .6, .35),
            (yeniden_ornekle(yukle(ornek(V, "Strings/Cello Section/trem/trem_D2_v1_1.wav")), 2 ** (1.15 / 12)), .45, -.4)]   # Mi♭3 sürtüşmesi
    zarf = (np.sin(.5 * np.pi * np.clip(t / .09, 0, 1)) ** 2 * np.where(t < .35, 1, np.cos(.5 * np.pi * np.clip((t - .35) / 3.6, 0, 1)) ** 2))[:, None]
    k = np.zeros((n, 2))
    for x, g_, p in trem:
        s = x[int(.3 * SR): int(.3 * SR) + n]; k[: len(s)] += denge(s / np.sqrt(np.mean(s ** 2)), p) * g_
    k = tiz_raf(suz(k, lo=35, hi=2200, n=2), 900, -4) * zarf
    ust = np.zeros((n, 2))
    ekle(ust, .25, denge(nota("viyola", "D4", 2.6, rg, atak_s=.5, birakma_s=1.2, dinamik=[(0, .6), (.4, .7), (1, .4)]), -.3))
    ekle(ust, .45, denge(nota("keman", "Eb4", 2.3, rg, atak_s=.7, birakma_s=1.2, dinamik=[(0, .5), (.5, .6), (1, .35)]), .35))
    ust = tiz_raf(suz(ust, hi=2600, n=2), 1300, -6)
    vur = y / np.sqrt(np.mean(y[: int(1.5 * SR)] ** 2)) * 10 ** (-24 / 20)
    k = k / np.sqrt(np.mean(k[: int(1.5 * SR)] ** 2)) * 10 ** (-22 / 20)
    ust = ust / np.sqrt(np.mean(ust[int(.5 * SR): int(2.5 * SR)] ** 2)) * 10 ** (-29 / 20)
    out = yankila(vur + k + ust, ir, .2)[:n]
    fz = int(.4 * SR); out[-fz:] *= (np.cos(.5 * np.pi * np.arange(fz) / fz) ** 2)[:, None]
    out *= 10 ** ((-19 - rms_db(out[: int(2 * SR)])) / 20)
    tp = 20 * np.log10(np.abs(out).max())
    if tp > -1.5: out *= 10 ** ((-1.5 - tp) / 20)
    return out


if __name__ == "__main__":
    main()
