#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""kurulus – "Uç / Kuruluş teması" (Sezon 1–2 ana teması)

Anadolu bozkırı, göçebe Türkmen uç beyliği, sabah sisi: sakin ama umutlu.
  * ney benzeri nefesli (sentez: sinüs harmonikleri + perdeli nefes gürültüsü + nefes zarfı, portamento, vibrato)
    leitmotifi TAM ve AÇIK verir;
  * ud/kopuz benzeri telli (Karplus-Strong, çift tel, perdesiz kaydırma, çarpma, tremolo) taksim gibi serbest süsler;
  * zemin: kontrbas D2 + çello D3/A3 (VSCO 2 CE, CC0) dem'i + bozkır rüzgârı (filtreli gürültü);
  * çok hafif bendir/def, sofyan usulü (VCSL Frame Drum, CC0).
D Hicaz (koma: E♭ +15 sent, F♯ −15 sent; perdesiz sazlar), 12. ölçüde Uşşak rengi (E segah −40 sent, F natürel).
♩ = 66, 4/4 (sofyan: Düm . Te Ke).

Çalıştırma:  python3 tarih-reels/shared/muzik/kurulus/uret.py
Çıktı:       out/kurulus__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, stereo, 24 bit), onizleme.mp3, meta.json
Gerekenler:  numpy, ffmpeg, git (CC0 örnekler VCSL / VSCO-2-CE kısmi klonundan çekilir; SFX_KLON ortam değişkeni ile yer değiştirilebilir).
Deterministik: sabit tohum (TOHUM).
"""
import json, os, subprocess, sys, time
import numpy as np

ID = "kurulus"
SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
SHARED = os.path.abspath(os.path.join(HERE, "..", ".."))
SFX = os.path.join(SHARED, "sfx")
OUT = os.path.join(HERE, "out")
TMP = os.environ.get("MUZIK_TMP", f"/tmp/claude-0/muzik-{ID}")
KLON = os.environ.get("SFX_KLON", "/tmp/claude-0/sfx")
REPO = {"VCSL": "https://github.com/sgossner/VCSL", "VSCO-2-CE": "https://github.com/sgossner/VSCO-2-CE"}
TOHUM = 1299

# =====================================================================================
# ORTAK ARAÇLAR (örnek yükleme, perde, süzgeç, oda yankısı, döngülü katman, ölçüm)
# =====================================================================================

def getir(liste):
    """[(repo, yol)] – eksik CC0 örnekleri kısmi klondan indirir (klon yoksa --filter=blob:none ile klonlar)."""
    eksik = {}
    for repo, yol in liste:
        if not os.path.exists(os.path.join(KLON, repo, yol)):
            eksik.setdefault(repo, []).append(yol)
    for repo, yollar in eksik.items():
        d = os.path.join(KLON, repo)
        if not os.path.isdir(os.path.join(d, ".git")):
            os.makedirs(KLON, exist_ok=True)
            subprocess.run(["git", "clone", "--filter=blob:none", "--no-checkout", "--depth", "1", REPO[repo], d], check=True)
        r = None
        for deneme in range(6):
            r = subprocess.run(["git", "-c", "gc.auto=0", "-C", d, "checkout", "HEAD", "--", *yollar], capture_output=True, text=True)
            if all(os.path.exists(os.path.join(d, y)) for y in yollar):
                break
            time.sleep(3 + 4 * deneme)          # başka bir süreç index.lock tutuyor olabilir
        else:
            raise RuntimeError(f"{repo}: örnekler indirilemedi\n{r.stderr[-800:]}")


_ONB = {}
def yukle(yol):
    """Ses dosyası → stereo float64 (44.1 kHz), baştaki sessizlik kırpılır (−50 dB, 3 ms ön pay)."""
    if yol not in _ONB:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", yol, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                             capture_output=True, check=True).stdout
        x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
        a = np.abs(x).max(1)
        i = int(np.argmax(a > a.max() * 10 ** (-50 / 20)))
        _ONB[yol] = x[max(0, i - int(0.003 * SR)):]
    return _ONB[yol]


def kl(repo, yol): return yukle(os.path.join(KLON, repo, yol))
def sfx(kimlik): return yukle(os.path.join(SFX, kimlik + ".flac"))


_AD = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
KOMA = {"Eb": 15.0, "F#": -15.0}           # Hicaz rengi (sent) – yalnız perdesiz sazlarda


def hz(n, koma=True):
    """'A4', 'Bb4', 'F#3', 'E-4' (Uşşak segahı: E −40 sent). koma=True → E♭ +15, F♯ −15 sent."""
    harf, i, sapma, yari = n[0], 1, 0.0, 0
    while i < len(n) and n[i] in "#b-":
        yari += {"#": 1, "b": -1, "-": 0}[n[i]]
        sapma -= 40.0 if n[i] == "-" else 0.0
        i += 1
    midi = 12 * (int(n[i:]) + 1) + _AD[harf] + yari
    if koma and (harf + n[1:i]) in KOMA:
        sapma += KOMA[harf + n[1:i]]
    return 440.0 * 2 ** ((midi - 69 + sapma / 100) / 12)


def vsco_hz(ad):
    """VSCO 2 CE dosya adlarındaki nota (C3 = orta do) → gerçek Hz (bir oktav yukarı; ölçümle doğrulandı)."""
    return hz(ad, koma=False) * 2


def kaydir(x, oran, n=None, bas=0.0):
    """Yeniden örnekleyerek perde kaydırma (oran > 1 tiz). Doğrusal ara değerleme."""
    nmax = int((len(x) - 2 - bas) / oran)
    n = nmax if n is None else max(0, min(n, nmax))
    p = bas + np.arange(n) * oran
    i = p.astype(np.int64)
    f = (p - i)[:, None]
    return x[i] * (1 - f) + x[i + 1] * f


def _yk(k):
    return np.sin(0.5 * np.pi * np.linspace(0, 1, max(k, 1)))[:, None]


def zarf(n, a=0.01, r=0.1):
    e = np.ones(n)
    na = min(n, int(a * SR)); nr = min(n - na, int(r * SR))
    if na: e[:na] = np.sin(0.5 * np.pi * np.linspace(0, 1, na)) ** 2
    if nr: e[n - nr:] *= np.cos(0.5 * np.pi * np.linspace(0, 1, nr)) ** 2
    return e


def _hiza(x, o_aday, ref, K=4096, ara=800, alt=0, ust=None):
    """x[o : o+K] penceresinin x[ref : ref+K] ile en uyumlu (en yüksek ilintili) olduğu o (o_aday ± ara).
    Aynı perdeli sürekli sesin taneleri birleşirken faz sönümlemesini (çukurları) önler."""
    m = x.mean(1) if x.ndim == 2 else x
    ust = len(m) - K - 1 if ust is None else ust
    lo = max(alt, o_aday - ara); hi = min(ust, o_aday + ara)
    if hi <= lo: return int(np.clip(o_aday, alt, ust))
    r = m[ref:ref + K]; seg = m[lo:hi + K]
    n = 1 << int(np.ceil(np.log2(len(seg) + K)))
    c = np.fft.irfft(np.fft.rfft(seg, n) * np.conj(np.fft.rfft(r, n)), n)[:hi - lo + 1]
    e = np.convolve(seg ** 2, np.ones(K), "valid")[:hi - lo + 1]
    return lo + int(np.argmax(c / np.sqrt(np.maximum(e, 1e-12))))


def _sk(k):   # genlik-tamamlayıcı geçiş (sin²) – hizalı (eş fazlı) taneler için
    return (np.sin(0.5 * np.pi * np.linspace(0, 1, max(k, 1))) ** 2)[:, None]


def uzat(x, n, rng, xf=0.45, bas=0.8, son=0.6, ara=800):
    """Sürekli bir sesi n örneğe uzatır: kararlı bölgeden faz hizalı taneler, kısa çapraz geçişler."""
    if len(x) >= n:
        return x[:n].copy()
    X = int(xf * SR); K = 4096; s0 = int(min(bas * SR, len(x) * 0.25)) + ara; s1 = len(x) - int(son * SR) - ara
    out = np.zeros((n + len(x), x.shape[1]))
    out[:s1] = x[:s1]; out[s1 - X:s1] *= _sk(X)[::-1]
    pos, kaynak_son = s1 - X, s1
    while pos < n:
        glen = int(rng.integers(min(2 * X + SR, s1 - s0 - 1), s1 - s0))
        o = int(rng.integers(s0, s1 - glen + 1))
        o = _hiza(x, o + X // 2 - K // 2, kaynak_son - X // 2 - K // 2, K, ara, s0 + X // 2 - K // 2, s1 - glen + X // 2 - K // 2) - X // 2 + K // 2
        g = x[o:o + glen].copy(); g[:X] *= _sk(X); g[-X:] *= _sk(X)[::-1]
        out[pos:pos + glen] += g
        pos += glen - X; kaynak_son = o + glen
    return out[:n]


def surekli_dongu(x, L, rng, xf=0.5, bas=1.0, son=0.6, ara=800):
    """Periyodik (uzunluk L) sürekli ses: kararlı bölgeden faz hizalı taneler; sarma noktası da hizalanır
    (son tane gerekirse ≤ %0.3 yeniden örneklenir). Saldırı yok, çukur yok."""
    X = int(xf * SR); K = 4096
    s0 = int(min(bas * SR, len(x) * 0.25)) + ara; s1 = len(x) - int(son * SR) - ara
    gmax = s1 - s0 - 2 * ara
    out = np.zeros((L + X + 8, x.shape[1])); pos = 0; o_ilk = None; kaynak_son = None
    while True:
        kalan = L + X - pos
        if kalan <= gmax: glen, bitti = kalan, True
        elif kalan < gmax + 2 * X: glen, bitti = (kalan + X) // 2, False
        else: glen, bitti = int(rng.integers(max(2 * X + SR, gmax // 2), gmax + 1)), False
        o = int(rng.integers(s0, s1 - glen + 1))
        if kaynak_son is not None:
            o = _hiza(x, o + X // 2 - K // 2, kaynak_son - X // 2 - K // 2, K, ara,
                      s0 + X // 2 - K // 2, s1 - glen + X // 2 - K // 2) - X // 2 + K // 2
        g = x[o:o + glen + 2]
        if bitti and o_ilk is not None:      # sarma: son tanenin bitişi ilk tanenin başıyla eş fazlı olsun
            e = o + glen - X // 2 - K // 2
            e2 = _hiza(x, e, o_ilk + X // 2 - K // 2, K, ara, alt=e - ara, ust=min(e + ara, len(x) - K - X - 4))
            g = kaydir(x[o:o + glen + (e2 - e) + 4], (glen + (e2 - e)) / glen, n=glen)
        g = g[:glen].copy(); g[:X] *= _sk(X); g[-X:] *= _sk(X)[::-1]
        out[pos:pos + glen] += g
        if o_ilk is None: o_ilk = o
        if bitti: break
        pos += glen - X; kaynak_son = o + glen
    P = out[:L].copy(); P[:X + 8] += out[L:L + X + 8]
    return P


def _fft_filtre(x, kazanc, dongusel):
    """dongusel=True: x periyodik kabul edilir (iki uçtan 1.5 sn sarılarak süzülür → sonuç da periyodik)."""
    n = len(x); pay = int(1.5 * SR) if dongusel else 0
    if dongusel:
        x = np.concatenate([x[n - pay:], x, x[:pay]])
    N = 1 << int(np.ceil(np.log2(len(x) + SR)))
    X = np.fft.rfft(x, N, axis=0)
    g = kazanc(np.fft.rfftfreq(N, 1 / SR))
    return np.fft.irfft(X * (g[:, None] if x.ndim == 2 else g), N, axis=0)[pay:pay + n]


def suzgec(x, lp=None, hp=None, lp_d=2, hp_d=2, can=(), raf=None, dongusel=False):
    """Sıfır fazlı FFT süzgeci: Butterworth genlikli LP/HP, çan (f0, dB, bant_oktav), tiz raf (fc, dB)."""
    def g(f):
        f = np.maximum(f, 1.0); k = np.ones_like(f); db = np.zeros_like(f)
        if lp: k /= np.sqrt(1 + (f / lp) ** (2 * lp_d))
        if hp: k /= np.sqrt(1 + (hp / f) ** (2 * hp_d))
        for f0, G, bw in can: db += G * np.exp(-0.5 * (np.log2(f / f0) / bw) ** 2)
        if raf: db += raf[1] / (1 + np.exp(-4 * np.log2(f / raf[0])))
        return k * 10 ** (db / 20)
    return _fft_filtre(x, g, dongusel)


def pan(s, p=0.0, gen=1.0):
    """Mono → stereo (sabit güç) ya da stereo denge + genişlik."""
    if s.ndim == 1:
        a = (p + 1) * np.pi / 4
        return np.stack([s * np.cos(a), s * np.sin(a)], 1) * np.sqrt(2)
    m = s.mean(1, keepdims=True); d = (s[:, :1] - s[:, 1:]) / 2 * gen
    s = np.concatenate([m + d, m - d], 1)
    if p: s = s * np.array([np.sqrt(1 - p), np.sqrt(1 + p)])
    return s


def oda_ir(rt60=1.8, sure=2.8, on_gecikme=0.015, tohum=7):
    """Ortak oda: sıcak, kısa yankı (RT60 ≈ 1.8 sn; tiz bantlar daha hızlı söner). Birim enerji, stereo."""
    rng = np.random.default_rng(tohum)
    n = int(sure * SR); t = np.arange(n) / SR; f = np.fft.rfftfreq(n, 1 / SR)
    ir = np.zeros((n, 2))
    for c in range(2):
        G = np.fft.rfft(rng.standard_normal(n)); o = np.zeros(n)
        for lo, hi, k in [(0, 250, 1.1), (250, 1000, 1.0), (1000, 3000, 0.72), (3000, 7000, 0.45), (7000, SR, 0.25)]:
            o += np.fft.irfft(G * ((f >= lo) & (f < hi)), n) * np.exp(-6.91 * t / (rt60 * k))
        ir[:, c] = o * np.minimum(1, t / 0.025)
    d = int(on_gecikme * SR)
    ir = np.concatenate([np.zeros((d, 2)), ir])[:n]
    for ms, a, p in [(6, 9, -.5), (9, 8, .5), (13, 7, -.2), (19, 6, .35), (27, 5, -.4), (37, 4, .2)]:
        i = int(ms / 1000 * SR); ir[i, 0] += a * (1 - p) / 2; ir[i, 1] += a * (1 + p) / 2
    ir = suzgec(ir, lp=7000)
    return ir / np.sqrt((ir ** 2).sum(0, keepdims=True))


IR = None


def yanki(x, islak, dongusel=False):
    """Ortak odaya gönder: (1−ıslak)·kuru + ıslak·yankı. dongusel=True → dairesel evrişim (periyodik gövde)."""
    n = len(x); pay = len(IR) if dongusel else 0
    xe = np.concatenate([x[n - pay:], x]) if dongusel else x       # dairesel: sonun kuyruğu başa sarılır
    N = 1 << int(np.ceil(np.log2(len(xe) + len(IR))))
    irp = np.zeros((N, 2)); irp[:len(IR)] = IR
    w = np.fft.irfft(np.fft.rfft(xe, N, axis=0) * np.fft.rfft(irp, N, axis=0), N, axis=0)[pay:pay + n]
    return x * (1 - islak) + w * islak


class Katman:
    """Bir enstrüman: döngü gövdesi (periyodik, L örnek; olaylar dairesel katlanır) + doğrusal (giriş/kapanış) olaylar."""
    def __init__(self, ad, L, T):
        self.ad, self.L, self.T = ad, L, T
        self.O = int(10 * SR)
        self.g = np.zeros((self.O + L + int(25 * SR), 2))
        self.d = np.zeros((T + int(8 * SR), 2))

    @staticmethod
    def _ekle(buf, i, s, k, p):
        s = pan(s, p) if s.ndim == 1 else (pan(s, p) if p else s)
        if i < 0: s, i = s[-i:], 0
        j = min(len(buf), i + len(s))
        if j > i: buf[i:j] += s[:j - i] * k

    def ekle(self, t, s, k=1.0, p=0.0):            # t: gövde zamanı (sn), negatif olabilir
        self._ekle(self.g, self.O + int(round(t * SR)), s, k, p)

    def ekle_d(self, t, s, k=1.0, p=0.0):          # t: mutlak zaman (sn)
        self._ekle(self.d, int(round(t * SR)), s, k, p)

    def katla(self):
        L, O = self.L, self.O
        P = self.g[O:O + L].copy(); kuyruk = self.g[O + L:]
        for k in range(0, len(kuyruk), L):
            m = min(L, len(kuyruk) - k); P[:m] += kuyruk[k:k + m]
        P[L - O:] += self.g[:O]
        self.P = P
        return self

    def isle(self, fn):
        """fn(x, dongusel) hem periyodik gövdeye hem doğrusal kısma uygulanır."""
        self.P = fn(self.P, True); self.d = fn(self.d, False)
        return self

    def etkin_rms(self):
        x = np.concatenate([self.P, self.d]).mean(1); W = int(0.1 * SR)
        r = (x[:len(x) // W * W].reshape(-1, W) ** 2).mean(1)
        r = r[r > r.max() * 1e-3]
        return 10 * np.log10(r.mean() + 1e-20)

    def seviye(self, hedef_db):
        k = 10 ** ((hedef_db - self.etkin_rms()) / 20); self.P *= k; self.d *= k
        return self

    def cikti(self, bas, zarf_):
        idx = (np.arange(self.T) - bas) % self.L
        return self.P[idx] * zarf_[:, None] + self.d[:self.T]


def gecis_zarfi(T, giris=None, cikis=None):
    """giris=(t0, t1): t0 öncesi 0, t0→t1 sin² ile 1'e. cikis=(t2, t3): t2→t3 cos² ile 0'a, sonrası 0."""
    t = np.arange(T) / SR; e = np.ones(T)
    if giris:
        a, b = giris; r = np.clip((t - a) / max(b - a, 1e-6), 0, 1); e *= np.sin(0.5 * np.pi * r) ** 2
    if cikis:
        a, b = cikis; r = np.clip((t - a) / max(b - a, 1e-6), 0, 1); e *= np.cos(0.5 * np.pi * r) ** 2
    return e


def db(x): return 20 * np.log10(np.maximum(x, 1e-12))


def olc(mix, bas=None, son=None):
    """Brifteki doğrulama ölçümleri."""
    m = mix.mean(1); o = {}
    o["rms_dbfs"] = round(float(db(np.sqrt((mix ** 2).mean()))), 2)
    o["tepe_dbfs"] = round(float(db(np.abs(mix).max())), 2)
    o["kirpilma_ornek"] = int((np.abs(mix) >= 0.999).sum())
    N, H = 8192, 4096; w = np.hanning(N); P = np.zeros(N // 2 + 1)
    for i in range(0, len(m) - N, H): P += np.abs(np.fft.rfft(m[i:i + N] * w)) ** 2
    f = np.fft.rfftfreq(N, 1 / SR)
    o["enerji_4k_ustu_oran"] = round(float(P[f > 4000].sum() / P.sum()), 4)
    o["enerji_1k5_4k_oran"] = round(float(P[(f >= 1500) & (f < 4000)].sum() / P.sum()), 4)
    W = int(0.25 * SR); k = len(m) // W
    seg = m[:k * W].reshape(k, W)
    S = np.abs(np.fft.rfft(seg * np.hanning(W), axis=1)) ** 2; fq = np.fft.rfftfreq(W, 1 / SR)
    c = (S * fq).sum(1) / np.maximum(S.sum(1), 1e-20)
    r = db(np.sqrt((seg ** 2).mean(1)))
    ok = r > -50
    j = [abs(np.log2(c[i + 1] / c[i])) for i in range(k - 1) if ok[i] and ok[i + 1]]
    o["merkez_250ms_hz_ortanca"] = round(float(np.median(c[ok])), 1)
    o["merkez_sicrama_max_oktav"] = round(float(max(j)), 3)
    o["merkez_sicrama_p95_oktav"] = round(float(np.percentile(j, 95)), 3)
    o["merkez_sicrama_1oktav_ustu_sayi"] = int(sum(x > 1.0 for x in j))
    W1 = SR; k1 = len(m) // W1
    r1 = db(np.sqrt((mix[:k1 * W1].reshape(k1, W1, 2) ** 2).mean((1, 2))))
    v = [r1[i + 1] - r1[i] for i in range(k1 - 1) if r1[i] > -45 and r1[i + 1] > -45]
    o["rms_1sn_max_artis_db"] = round(float(max(v)), 2)
    o["rms_1sn_max_azalis_db"] = round(float(-min(v)), 2)
    o["rms_1sn_aralik_db"] = [round(float(r1[r1 > -45].min()), 1), round(float(r1.max()), 1)]
    if bas is not None:
        once, sonra = mix[son - W:son], mix[bas:bas + W]
        adim = np.abs(mix[bas] - mix[son - 1]).max()
        yerel = np.abs(np.diff(mix[son - int(0.05 * SR):son], axis=0)).max()
        o["dongu"] = {
            "bas_ornek": int(bas), "son_ornek": int(son),
            "gecis_ornek_adimi": round(float(adim), 6),
            "yerel_max_ornek_adimi": round(float(yerel), 6),
            "adim_orani": round(float(adim / max(yerel, 1e-9)), 3),
            "rms_farki_db_250ms": round(float(db(np.sqrt((sonra ** 2).mean())) - db(np.sqrt((once ** 2).mean()))), 2),
        }
        def cm(x):
            X = np.abs(np.fft.rfft(x.mean(1) * np.hanning(len(x)))) ** 2; ff = np.fft.rfftfreq(len(x), 1 / SR)
            return (X * ff).sum() / X.sum()
        o["dongu"]["merkez_sicramasi_oktav"] = round(float(abs(np.log2(cm(sonra) / cm(once)))), 3)
    return o


def yaz_flac(yol, x):
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                    "-c:a", "flac", "-sample_fmt", "s32", "-bits_per_raw_sample", "24", yol],
                   input=np.clip(x, -1, 1).astype(np.float32).tobytes(), check=True)


def spektrogram(x, png, baslik=""):
    """Log-frekans spektrogram PNG'si (görsel kontrol için; /tmp altına). PIL yoksa ffmpeg showspectrumpic."""
    os.makedirs(os.path.dirname(png), exist_ok=True)
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        tmp = png + ".flac"; yaz_flac(tmp, x)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-lavfi", "showspectrumpic=s=1600x700:fscale=log:scale=log", png], check=True)
        os.remove(tmp); return
    m = x.mean(1); W, H, N, fmin, fmax = 1600, 600, 8192, 30.0, 12000.0
    hop = max(64, (len(m) - N) // W); win = np.hanning(N)
    S = np.array([np.abs(np.fft.rfft(np.pad(m[i * hop:i * hop + N], (0, max(0, N - len(m[i * hop:i * hop + N])))) * win)) ** 2
                  for i in range(W)]).T
    f = np.fft.rfftfreq(N, 1 / SR); fy = 2 ** np.linspace(np.log2(fmin), np.log2(fmax), H)
    im = 10 * np.log10(S[np.clip(np.searchsorted(f, fy), 1, len(f) - 1)] / (win.sum() ** 2 / 4) + 1e-20)
    v = np.clip((im + 100) / 100, 0, 1)[::-1]
    rgb = np.stack([np.clip(v * 1.7, 0, 1), np.clip(v * 2.2 - 1.1, 0, 1), np.clip(np.sin(v * np.pi) * .55 + np.clip(v * 3 - 2.4, 0, 1), 0, 1)], -1)
    c = Image.new("RGB", (W + 64, H + 34)); c.paste(Image.fromarray((rgb * 255).astype(np.uint8)), (60, 0)); d = ImageDraw.Draw(c)
    for fl in [50, 73.4, 147, 294, 587, 1000, 1500, 2000, 3000, 4000, 6000, 8000]:
        y = H - 1 - int(np.log2(fl / fmin) / np.log2(fmax / fmin) * (H - 1)); d.line([(54, y), (60, y)], fill="white"); d.text((2, y - 6), f"{fl:g}", fill="white")
    dur = len(m) / SR
    for t in range(0, int(dur) + 1, 5):
        xx = 60 + int(t / dur * W); d.line([(xx, H), (xx, H + 5)], fill="white"); d.text((xx - 6, H + 8), str(t), fill="white")
    d.text((W - 300, H + 20), baslik, fill="white")
    c.save(png)


def sinirla(stems, tavan_db=-1.2):
    """Gerekirse yumuşak tepe sınırlayıcı: kazanç eğrisi miksten hesaplanıp tüm katmanlara aynen uygulanır
    (katmanların toplamı tam miksi vermeye devam eder)."""
    mix = sum(stems); tavan = 10 ** (tavan_db / 20)
    a = np.abs(mix).max(1)
    if a.max() <= tavan: return stems, 0.0
    g = np.minimum(1.0, tavan / np.maximum(a, 1e-9))
    W = int(0.004 * SR)                       # 4 ms ileri bakış: minimumu yay, sonra yumuşat
    gm = np.minimum.reduce([np.roll(g, -k) for k in range(0, W, max(1, W // 16))])
    ker = np.hanning(2 * W + 1); ker /= ker.sum()
    gs = np.minimum(np.convolve(gm, ker, "same"), g)
    return [s * gs[:, None] for s in stems], round(float(db(gs.min())), 2)


# =====================================================================================
# ENSTRÜMANLAR
# =====================================================================================

def ks_tel(f_hz, sure, rng, hiz=0.6, t60=None, konum=0.17, kay=None, c=0.24):
    """Karplus–Strong tek tel (bloklu vektörel). kay=(f_bas, sn): tel f_bas'tan f_hz'e perdesiz kayar."""
    n = int(sure * SR)
    if t60 is None:
        t60 = float(np.clip(2.4 - 0.55 * np.log2(f_hz / 110.0), 0.9, 2.8))
    fk = np.full(n, f_hz)
    if kay:
        fb, ks_ = kay; r = np.clip((np.arange(n) - 0.035 * SR) / (ks_ * SR), 0, 1); r = r * r * (3 - 2 * r)
        fk = 2 ** (np.log2(fb) + (np.log2(f_hz) - np.log2(fb)) * r)
    P0 = SR / fk[0]; m = int(P0)
    exc = rng.uniform(-1, 1, m)
    fc = min(3000.0, fk[0] * (3.0 + 8.0 * hiz))             # mızrap parlaklığı: hızla artar, sıcak kalır
    fe = np.fft.rfftfreq(m, 1 / SR); exc = np.fft.irfft(np.fft.rfft(exc) / np.sqrt(1 + (fe / fc) ** 4), m)
    d = max(1, int(konum * P0)); exc = exc - np.concatenate([np.zeros(d), exc[:-d]])
    exc -= exc.mean(); exc /= np.abs(exc).max() + 1e-9
    y = np.zeros(n + 8); y[:m] = exc
    pos = m
    while pos < n:
        f = fk[pos]; D = SR / f - 1.0; M = int(D); fr = D - M
        B = min(M, n - pos)
        g = 10 ** (-3 / (f * t60))
        a0 = (1 - fr) * c; a1 = (1 - fr) * (1 - 2 * c) + fr * c; a2 = (1 - fr) * c + fr * (1 - 2 * c); a3 = fr * c
        i = np.arange(pos, pos + B)
        y[pos:pos + B] = g * (a0 * y[i - M] + a1 * y[i - M - 1] + a2 * y[i - M - 2] + a3 * y[i - M - 3])
        pos += B
    return y[:n]


def ud_nota(f_hz, sure, rng, hiz=0.6, kay=None, birak=0.07):
    """Ud/kopuz benzeri çift tel (iki tel ±1.5 sent, mızrap 4–9 ms arayla), sonda parmakla susturma."""
    a = ks_tel(f_hz * 2 ** (1.5 / 1200), sure, rng, hiz, konum=0.15 + rng.uniform(0, .03), kay=kay)
    b = ks_tel(f_hz * 2 ** (-1.5 / 1200), sure, rng, hiz * 0.9, konum=0.19 + rng.uniform(0, .03), kay=kay)
    gk = int(rng.uniform(0.004, 0.009) * SR)
    b = np.concatenate([np.zeros(gk), b[:len(b) - gk]])
    s = np.stack([a * 0.6 + b * 0.4, a * 0.4 + b * 0.6], 1) * hiz
    return s * zarf(len(s), 0.003, birak)[:, None]


def ney_cumle(notalar, vurus, rng, guc=1.0):
    """Ney benzeri nefesli, tek nefeste (legato) bir cümle.
    notalar: [(bas_vurus, sure_vurus, nota, {ops})]; ops: 'dil' (nefes vurgusu), 'carpma': süs notası,
    'vib': vibrato derinliği (sent), 'kay': portamento süresi (sn), 'dim': sonda azalma.
    Döner: (başlangıç_sn, mono sinyal) – sinyal, ilk notadan ON sn önce başlar (ön nefes)."""
    ON, REL = 0.07, 0.32
    t0 = notalar[0][0] * vurus
    bitis = (notalar[-1][0] + notalar[-1][1]) * vurus - t0
    n = int((ON + bitis + REL + 0.05) * SR); t = np.arange(n) / SR - ON
    lf = np.full(n, np.log2(hz(notalar[0][2])))
    amp = np.zeros(n); vib = np.zeros(n); vurgu = np.zeros(n)
    once = None
    for (b, s, nota, op) in notalar:
        a = b * vurus - t0; e = a + s * vurus; f = np.log2(hz(nota))
        if once is not None:
            g = op.get("kay", 0.065 if abs(f - once) < 0.13 else 0.11)
            r = np.clip((t - (a - 0.6 * g)) / g, 0, 1); r = r * r * (3 - 2 * r)
            m = t >= a - 0.6 * g
            lf[m] = (once + (f - once) * r)[m]
        if "carpma" in op:                                   # süs (çarpma): üst/alt komşudan hızlı iniş
            fc = np.log2(hz(op["carpma"])); d = 0.085
            m = (t >= a - 0.02) & (t < a + d)
            r = np.clip((t - (a + d - 0.03)) / 0.03, 0, 1); r = r * r * (3 - 2 * r)
            lf[m] = (fc + (f - fc) * r)[m]
        L_ = e - a
        if L_ > 0.6:                                          # gecikmeli vibrato
            dv = op.get("vib", 13.0)
            v0 = a + 0.32
            dep = np.clip((t - v0) / 0.6, 0, 1) * np.clip((e - 0.05 - t) / 0.15, 0, 1) * dv
            hzv = 5.1 + 0.3 * rng.standard_normal()
            vib += np.where((t > v0) & (t < e), dep * np.sin(2 * np.pi * hzv * (t - v0)), 0.0)
        hedef = op.get("v", 1.0)
        sw = 1.0
        if L_ > 1.1:                                          # uzun notada hafif şişme
            x = np.clip((t - a) / L_, 0, 1)
            sw = 1 + 0.10 * np.sin(np.pi * x) - (0.35 * x ** 1.5 if op.get("dim") else 0.0)
        amp += np.where((t >= a) & (t < e), hedef * sw, 0.0)
        if op.get("dil") or once is None:
            vurgu += 0.9 * np.exp(-np.maximum(t - a + 0.015, 0) / 0.05) * (t >= a - 0.015)
            amp *= 1 - 0.28 * np.exp(-((t - a) / 0.03) ** 2) * (once is not None)
        once = f
    # cümle zarfı: yumuşak giriş, nefes sonu bırakma
    sondaki = amp[np.searchsorted(t, bitis - 0.02)]
    amp = np.where(t >= bitis, sondaki, amp)
    k = int(0.035 * SR); amp = np.convolve(amp, np.ones(k) / k, "same")
    amp *= np.clip((t + 0.02) / 0.11, 0, 1) ** 2 * np.cos(0.5 * np.pi * np.clip((t - bitis) / REL, 0, 1)) ** 2
    # giriş kayması (scoop) −30 sent
    r = np.clip(t / 0.13, 0, 1); lf += (1 - r * r * (3 - 2 * r)) * (-30 / 1200)
    # yavaş sapma (±4 sent)
    kk = rng.standard_normal(n // 4410 + 3); dr = np.interp(np.arange(n) / 4410, np.arange(len(kk)), kk) * 3.5
    fr = 2 ** (lf + (vib + dr) / 1200)
    ph = 2 * np.pi * np.cumsum(fr) / SR
    a_n = amp / max(amp.max(), 1e-9)
    harm = [1.0, 0.30, 0.15, 0.065, 0.03, 0.012]
    ton = sum(h * (0.55 + 0.45 * a_n) ** (i) * np.sin((i + 1) * ph + rng.uniform(0, 6.28)) for i, h in enumerate(harm))
    # perdeli nefes: dar bant gürültü × taşıyıcılar
    nb = suzgec(rng.standard_normal(n), lp=110, lp_d=2); nb /= np.sqrt((nb ** 2).mean()) + 1e-9
    pnefes = nb * (0.55 * np.sin(ph + 0.4) + 0.22 * np.sin(2 * ph + 1.1)) * 0.20
    # hava: geniş bant nefes
    hava = suzgec(rng.standard_normal(n), lp=2600, hp=450, lp_d=2, hp_d=1); hava /= np.sqrt((hava ** 2).mean()) + 1e-9
    on_nefes = np.clip((t + ON) / ON, 0, 1) * (t < 0.05)
    y = amp * (ton + pnefes) + hava * (0.045 * amp + 0.10 * vurgu * (amp + 0.25) + 0.05 * on_nefes)
    y = suzgec(y, lp=3000, hp=160, lp_d=2, hp_d=2, can=[(900, -1.5, 0.8)])
    return t0 - ON, y * guc


UD_GOVDE = [(110, 3.0, 0.5), (230, 2.5, 0.6), (600, 1.5, 0.7), (1500, -3.0, 0.6)]   # armudi gövde rezonansları (yaklaşık)


def tremolo(bas, sure, hz_, v, adim=0.088):
    """Ud tremolosu: hızlı ardışık mızrap (aşağı/yukarı), her vuruş öncekini susturur."""
    k = max(2, int(sure / adim))
    return [(bas + i * adim, hz_, v * (1.0 if i % 2 == 0 else 0.72) * (1 - 0.25 * i / k), None, adim + 0.02) for i in range(k)]


# =====================================================================================
# DÜZENLEME – kurulus
# =====================================================================================
BPM = 66
VUR = 60 / BPM
GOVDE_VURUS = 80          # 20 ölçü (döngü gövdesi)
GIRIS_VURUS = 6           # giriş = gövdenin son 6 vuruşunun yükselerek açılması (≈ 5.45 sn)
KAPANIS_SN = 7.0

VCSL_DEF = "Membranophones/Struck Membranophones/Frame Drum/"
VSCO_CELLO = "Strings/Cello Section/susvib/"
VSCO_KB = "Strings/Solo Contrabass/SusVib/"
GEREKLI = [("VCSL", VCSL_DEF + f) for f in [
    "HDrumL_Hit_v2_rr1_Sum.wav", "HDrumL_Hit_v2_rr2_Sum.wav", "HDrumL_Hit_v3_rr1_Sum.wav", "HDrumL_Hit_v3_rr2_Sum.wav",
    "HDrumL_HitMuted_v2_rr1_Sum.wav", "HDrumL_HitMuted_v2_rr2_Sum.wav", "HDrumL_HitMuted_v3_rr1_Sum.wav", "HDrumL_HitMuted_v3_rr2_Sum.wav",
    "HDrumS_HitMuted_v2_rr1_Sum.wav", "HDrumS_HitMuted_v2_rr2_Sum.wav", "HDrumS_HitMuted_v3_rr2_Sum.wav"]] + [
    ("VSCO-2-CE", VSCO_CELLO + "susvib_D2_v1_1.wav"), ("VSCO-2-CE", VSCO_CELLO + "susvib_A2_v1_1.wav"),
    ("VSCO-2-CE", VSCO_KB + "BKCtbss_SusVib_D1_v1_rr1.wav")]

# --- telli (ud/kopuz) : (vuruş, nota, hız, ops) ; ops: 'cin' çınlasın, 'carpma': süs, 'kay': kaydırma başlangıç notası,
#     'trem': tremolo süresi (vuruş)
TELLI = [
    # 1–4: taksim (serbest; vuruş ızgarasına bağlı değil)
    (0.80, "D3", .55, {"cin": 1}), (0.84, "A3", .32, {"cin": 1}),
    (2.10, "A3", .60, {"carpma": "Bb3"}), (2.85, "G3", .50, {}), (3.30, "F#3", .50, {}), (3.72, "G3", .52, {"kay": "F#3"}),
    (4.62, "Eb3", .52, {"carpma": "F#3"}), (5.40, "D3", .62, {"trem": 1.0}), (6.55, "D3", .40, {"cin": 1}), (6.58, "A2", .30, {"cin": 1}),
    (8.00, "D3", .42, {}), (8.28, "Eb3", .44, {}), (8.56, "F#3", .48, {}), (8.86, "G3", .52, {}), (9.25, "A3", .66, {"trem": 1.2}),
    (10.62, "Bb3", .55, {"carpma": "C4"}), (11.25, "A3", .58, {"kay": "Bb3"}), (12.10, "G3", .48, {}), (12.48, "F#3", .48, {}),
    (12.90, "G3", .50, {}), (13.50, "A3", .62, {"cin": 1}), (13.53, "D3", .34, {"cin": 1}),
    # 5–7: ney motifi altında dem
    (16.00, "D3", .34, {"cin": 1}), (16.03, "A3", .24, {"cin": 1}), (20.00, "D3", .30, {"cin": 1}), (20.03, "A3", .22, {"cin": 1}),
    (24.00, "D2", .36, {"cin": 1}), (24.03, "D3", .28, {"cin": 1}), (24.06, "A3", .22, {"cin": 1}),
    (27.00, "D3", .30, {}), (27.30, "Eb3", .30, {}), (27.60, "D3", .34, {"cin": 1}),
    # 8: telli cevabı (motif sonu yankısı)
    (28.20, "G3", .55, {}), (28.70, "F#3", .50, {}), (29.20, "Eb3", .55, {"carpma": "F#3"}), (30.00, "D3", .60, {"trem": 1.1}),
    (31.25, "A2", .34, {}), (31.60, "D3", .40, {"cin": 1}),
    # 9–11: heterofoni (motifi bir oktav pesten, hafif gecikmeli izler)
    (32.06, "A3", .40, {}), (33.06, "Bb3", .36, {}), (34.06, "A3", .40, {"trem": 1.6}), (36.06, "G3", .36, {}), (37.06, "F#3", .36, {}),
    (38.06, "G3", .36, {}), (39.06, "Bb3", .36, {}), (40.06, "A3", .44, {"trem": 1.8}), (42.00, "D3", .30, {"cin": 1}), (42.03, "A3", .22, {"cin": 1}),
    # 12: Uşşak renkli köprü (E segah, F natürel)
    (44.20, "D3", .50, {}), (44.60, "E-3", .50, {}), (45.00, "F3", .54, {}), (45.42, "G3", .58, {}), (46.00, "F3", .50, {"kay": "G3"}),
    (46.50, "E-3", .50, {}), (47.00, "D3", .58, {"trem": 0.9}),
    # 13–16: gelişme altında pedal
    (48.00, "D3", .30, {"cin": 1}), (48.03, "A3", .22, {"cin": 1}), (52.00, "D3", .28, {"cin": 1}), (52.03, "A3", .20, {"cin": 1}),
    (56.00, "D3", .30, {"trem": 1.4}), (60.00, "A3", .28, {"cin": 1}), (60.03, "D3", .22, {"cin": 1}), (62.55, "Bb3", .30, {}), (63.05, "A3", .34, {"cin": 1}),
    # 17–18: motif imâsı telli, ney cevaplar
    (64.00, "A3", .62, {}), (65.00, "Bb3", .58, {"carpma": "C4"}), (66.00, "A3", .62, {"trem": 1.55}), (67.70, "G3", .52, {"cin": 1}),
    (72.00, "D3", .30, {"cin": 1}), (72.03, "A3", .22, {"cin": 1}),
    # 19–20 (son 6 vuruş = GİRİŞ): sisin içinden açılan jest
    (74.60, "D3", .46, {"kay": "C3"}), (76.00, "A3", .42, {"carpma": "Bb3"}), (76.90, "G3", .36, {}), (77.40, "F#3", .36, {}),
    (78.20, "D3", .40, {"cin": 1}), (78.23, "A3", .28, {"cin": 1}),
]

# --- ney cümleleri (vuruş, süre, nota, ops)
NEY = [
    # 5–7: LEITMOTIF – tam ve açık
    [(16, 1, "A4", {"v": .95}), (17, 1, "Bb4", {}), (18, 2, "A4", {"dil": 1, "vib": 12}), (20, 1, "G4", {}), (21, 1, "F#4", {"dil": 1}),
     (22, 1, "G4", {}), (23, 1, "Eb4", {}), (24, 2.7, "D4", {"vib": 14, "dim": 1})],
    # 9–11: ikinci veriliş, süslü, A'da açık biter
    [(32, 1, "A4", {}), (33, 1, "Bb4", {}), (34, 2, "A4", {"dil": 1, "vib": 14}), (36, 1, "G4", {"carpma": "A4"}), (37, 1, "F#4", {}),
     (38, 1, "G4", {"dil": 1}), (39, 1, "Bb4", {}), (40, 2.75, "A4", {"vib": 15, "dim": 1})],
    # 13–16: gelişme – Uşşak renginden Hicaz'a, umutlu yükseliş (D5)
    [(48, 1, "D4", {"v": .85}), (49, .5, "E-4", {}), (49.5, .5, "F4", {}), (50, 1, "G4", {}), (51, 1, "A4", {"dil": 1}),
     (52, 1.5, "C5", {"vib": 12}), (53.5, .5, "Bb4", {}), (54, 1.6, "A4", {"vib": 12, "dim": 1})],
    [(56, .5, "A4", {"v": .9}), (56.5, .5, "Bb4", {}), (57, 1, "C5", {}), (58, 2, "D5", {"vib": 15, "v": 1.0}),
     (60, .75, "C5", {"dil": 1}), (60.75, .25, "Bb4", {}), (61, 2.6, "A4", {"vib": 14, "dim": 1})],
    # 18: cevap (motif sonu)
    [(68, 1, "F#4", {"v": .9}), (69, 1, "G4", {}), (70, 1, "Eb4", {"carpma": "F#4"}), (71, 2.1, "D4", {"vib": 13, "dim": 1})],
]

# --- sofyan (Düm . Te Ke) – bendir/def, 5–18. ölçüler, çok hafif
def sofyan():
    olay = []
    for olcu in range(4, 18):
        b = olcu * 4
        k = 0.62 if olcu < 8 else 0.74 if olcu < 12 else 0.85 if olcu < 16 else 0.7
        olay += [(b, "dum", 1.0 * k), (b + 2, "te", 0.55 * k), (b + 3, "ke", 0.42 * k)]
        if olcu % 4 == 3: olay.append((b + 3.5, "ke", 0.28 * k))
        if olcu % 4 == 1: olay.append((b + 1.5, "dum", 0.38 * k))
    olay.append((72, "dum", 0.55))
    return olay


def ud_partisyon(liste, vurus, rng, mutlak=False):
    """TELLI listesini nota olaylarına açar: (t_sn, sinyal)."""
    olay = []
    for i, (b, nota, v, op) in enumerate(liste):
        t = b * vurus + rng.normal(0, 0.008)
        sonraki = next((liste[j][0] for j in range(i + 1, len(liste)) if liste[j][0] - b > 0.05), b + 4)
        sure = 3.2 if op.get("cin") else max(0.25, (sonraki - b) * vurus + 0.03)
        f = hz(nota)
        if "carpma" in op:
            olay.append((t - 0.085, ud_nota(hz(op["carpma"]), 0.11, rng, v * 0.75, birak=0.02)))
        if "trem" in op:
            for (tt, ff, vv, _, ss) in tremolo(t, op["trem"] * vurus, f, v):
                olay.append((tt, ud_nota(ff, ss, rng, vv, birak=0.02)))
            continue
        kay = (hz(op["kay"]), 0.13) if "kay" in op else None
        olay.append((t, ud_nota(f, sure, rng, v, kay=kay, birak=0.09 if not op.get("cin") else 0.6)))
    return olay


def def_ornek(tur, rng):
    yol = {"dum": ["HDrumL_Hit_v3_rr1_Sum.wav", "HDrumL_Hit_v3_rr2_Sum.wav", "HDrumL_Hit_v2_rr1_Sum.wav", "HDrumL_Hit_v2_rr2_Sum.wav"],
           "te": ["HDrumL_HitMuted_v3_rr1_Sum.wav", "HDrumL_HitMuted_v3_rr2_Sum.wav", "HDrumL_HitMuted_v2_rr1_Sum.wav", "HDrumL_HitMuted_v2_rr2_Sum.wav"],
           "ke": ["HDrumS_HitMuted_v2_rr1_Sum.wav", "HDrumS_HitMuted_v2_rr2_Sum.wav", "HDrumS_HitMuted_v3_rr2_Sum.wav"]}[tur]
    x = kl("VCSL", VCSL_DEF + yol[int(rng.integers(len(yol)))])
    x = x / (np.abs(x).max() + 1e-9)
    x = kaydir(x, 2 ** (rng.normal(0, 18) / 1200))                 # her vuruş biraz farklı
    return x[:int(1.6 * SR)] * zarf(min(len(x), int(1.6 * SR)), 0.002, 0.4)[:, None]


def dron_kaynaklari():
    return [  # (örnek, kaynak Hz, hedef nota, seviye dB, pan, faz)
        (kl("VSCO-2-CE", VSCO_KB + "BKCtbss_SusVib_D1_v1_rr1.wav"), vsco_hz("D1"), "D2", -4.0, 0.0, 0.3),
        (kl("VSCO-2-CE", VSCO_CELLO + "susvib_D2_v1_1.wav"), vsco_hz("D2"), "D3", 0.0, -0.25, 1.7),
        (kl("VSCO-2-CE", VSCO_CELLO + "susvib_A2_v1_1.wav"), vsco_hz("A2"), "A3", -3.5, 0.3, 4.1),
    ]


def main():
    global IR
    t_bas = time.time()
    getir(GEREKLI)
    IR = oda_ir()
    rng = np.random.default_rng(TOHUM)
    L = int(round(GOVDE_VURUS * VUR * SR)); bas = int(round(GIRIS_VURUS * VUR * SR)); son = bas + L
    T = son + int(KAPANIS_SN * SR)
    Ls = L / SR; bas_s = bas / SR; son_s = son / SR

    # ---------------- ZEMİN: dem (yaylı) + bozkır rüzgârı ----------------
    dron = Katman("dron", L, T)
    for x, f0, nota, sv, p, fz in dron_kaynaklari():
        y = kaydir(x, hz(nota, False) / f0)
        P = surekli_dongu(y, L, rng)
        tt = np.arange(L) / SR
        nefes = 1 + 0.18 * np.sin(2 * np.pi * 4 * tt / Ls + fz) + 0.08 * np.sin(2 * np.pi * 9 * tt / Ls + 2 * fz)
        dron.g[dron.O:dron.O + L] += pan(P, p, 0.8) * (10 ** (sv / 20)) * nefes[:, None]
    dron.katla().isle(lambda x, d: suzgec(x, lp=1400, hp=45, can=[(2600, -4, 0.7)], dongusel=d))
    # kapanış: D2–D3–A3 dem'i uzun nota olarak sönsün (doğrusal olaylar döngü sonundan ÖNCE başlamaz)
    for x, f0, nota, sv, p, fz in dron_kaynaklari():
        y = uzat(kaydir(x, hz(nota, False) / f0), int(7.0 * SR), rng)[int(0.6 * SR):]
        dron.ekle_d(son_s, y * zarf(len(y), 1.6, 4.6)[:, None], 10 ** (sv / 20), p)
    dron.d = suzgec(dron.d, lp=1400, hp=45)

    ruzgar = Katman("ruzgar", L, T)
    tt = np.arange(L) / SR
    nz = rng.standard_normal((L, 2))
    alt = suzgec(nz, lp=480, hp=110, lp_d=2, hp_d=1, dongusel=True)
    ust = suzgec(nz[::-1].copy(), lp=1100, hp=380, lp_d=2, hp_d=1, dongusel=True)
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 7 * tt / Ls + 0.8)
    gz = 0.65 + 0.35 * (0.6 * np.sin(2 * np.pi * 5 * tt / Ls + 1.3) + 0.4 * np.sin(2 * np.pi * 13 * tt / Ls + 0.2))
    ruzgar.P = (alt * (1 - 0.6 * lfo)[:, None] + ust * (0.25 + 0.35 * lfo)[:, None]) * gz[:, None]

    # ---------------- MELODİ: telli + ney ----------------
    telli = Katman("telli", L, T)
    for t, s in ud_partisyon(TELLI, VUR, rng):
        telli.ekle(t, s, 1.0, -0.18)
    # kapanış: dem akoru + küçük süs
    for t, s in ud_partisyon([(0.25, "D2", .42, {"cin": 1}), (0.28, "D3", .36, {"cin": 1}), (0.31, "A3", .28, {"cin": 1}),
                              (2.70, "Eb3", .22, {}), (2.95, "D3", .26, {"cin": 1})], VUR, rng):
        telli.ekle_d(son_s + t, s, 1.0, -0.18)
    govde_eq = lambda x, d: suzgec(x, hp=70, lp=2800, lp_d=2, can=UD_GOVDE, raf=(2200, -4.0), dongusel=d)
    telli.katla().isle(govde_eq)

    ney = Katman("ney", L, T)
    for cumle in NEY:
        t, s = ney_cumle(cumle, VUR, rng)
        ney.ekle(t, s, 1.0, 0.12)
    t, s = ney_cumle([(0.0, 0.25, "Eb4", {"v": .8}), (0.25, 3.1, "D4", {"vib": 13, "dim": 1})], VUR, rng)
    ney.ekle_d(son_s + 0.55 + t, s, 0.85, 0.12)
    ney.katla()

    # ---------------- RİTİM: bendir/def (sofyan) ----------------
    defk = Katman("def", L, T)
    for b, tur, v in sofyan():
        defk.ekle(b * VUR + rng.normal(0, 0.006), def_ornek(tur, rng), v * 10 ** (rng.normal(0, 1.2) / 20), -0.1)
    defk.ekle_d(son_s + 0.25, def_ornek("dum", rng), 0.5, -0.1)
    defk.katla().isle(lambda x, d: suzgec(x, hp=45, lp=2600, lp_d=2, dongusel=d))

    # ---------------- seviye dengesi + oda ----------------
    hedef = {"dron": -21.0, "ruzgar": -35.0, "telli": -21.5, "ney": -17.0, "def": -29.0}
    islak = {"dron": 0.18, "ruzgar": 0.10, "telli": 0.22, "ney": 0.24, "def": 0.20}
    for k in (dron, ruzgar, telli, ney, defk):
        k.seviye(hedef[k.ad])
        k.isle(lambda x, d, w=islak[k.ad]: yanki(x, w, d))

    # ---------------- giriş/kapanış zarfları + katmanlar ----------------
    z_dron = gecis_zarfi(T, giris=(0.0, bas_s * 0.85), cikis=(son_s + 0.3, son_s + 2.5))
    z_ruz = gecis_zarfi(T, giris=(0.0, bas_s), cikis=(son_s, son_s + 6.0))
    z_mel = gecis_zarfi(T, giris=(0.0, 0.45), cikis=(son_s, son_s + 0.55))
    z_rit = gecis_zarfi(T, giris=(0.0, 0.3), cikis=(son_s, son_s + 0.4))
    zemin = dron.cikti(bas, z_dron) + ruzgar.cikti(bas, z_ruz)
    melodi = telli.cikti(bas, z_mel) + ney.cikti(bas, z_mel)
    ritim = defk.cikti(bas, z_rit)
    son_fade = gecis_zarfi(T, cikis=(T / SR - 0.6, T / SR))[:, None]
    stems = [zemin * son_fade, ritim * son_fade, melodi * son_fade]

    # ---------------- normalizasyon (RMS −20 dBFS), tepe sınırlama ----------------
    mix = sum(stems)
    g = 10 ** ((-20.0 - db(np.sqrt((mix ** 2).mean()))) / 20)
    stems = [s * g for s in stems]
    stems, gr = sinirla(stems, -1.2)
    mix = sum(stems)
    o = olc(mix, bas, son)
    o["sinirlayici_max_kazanc_azaltma_db"] = gr
    o["katman_rms_dbfs"] = {ad: round(float(db(np.sqrt((s ** 2).mean()))), 2) for ad, s in zip(("zemin", "ritim", "melodi"), stems)}

    os.makedirs(OUT, exist_ok=True)
    yaz_flac(os.path.join(OUT, f"{ID}__tam.flac"), mix)
    for ad, s in zip(("zemin", "ritim", "melodi"), stems):
        yaz_flac(os.path.join(OUT, f"{ID}__{ad}.flac"), s)

    # ---------------- VURGU (sting, ~5 sn) ----------------
    vur = vurgu(rng)
    ov = olc(vur)
    yaz_flac(os.path.join(OUT, f"{ID}__vurgu.flac"), vur)

    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, f"{ID}__tam.flac"), "-c:a", "libmp3lame", "-b:a", "128k",
                    os.path.join(HERE, "onizleme.mp3")], check=True)
    spektrogram(mix, os.path.join(TMP, "spektrogram_tam.png"), f"{ID} tam")
    for ad, st in zip(("zemin", "ritim", "melodi"), stems):
        spektrogram(st, os.path.join(TMP, f"spektrogram_{ad}.png"), f"{ID} {ad}")
    spektrogram(vur, os.path.join(TMP, "spektrogram_vurgu.png"), f"{ID} vurgu")

    meta = {
        "id": ID, "ad": "Uç / Kuruluş teması",
        "tarz": "Anadolu bozkırı, göçebe Türkmen uç beyliği; ney benzeri nefesli + ud/kopuz benzeri telli taksim + yaylı dem + çok hafif bendir",
        "kullanim": ["harita açılışı", "Söğüt / uç beyliği", "belirsiz başlangıç", "kuruluş anlatısı", "sabah / yolculuk / bozkır manzarası",
                     "sezon açılışı"],
        "donem": [1, 2],
        "ton_makam": "D Hicaz (Hicaz'a yaklaşım; perdesiz sazlarda E♭ +15, F♯ −15 sent koma), 12. ölçüde Uşşak rengi (E −40 sent, F natürel); dem D–A",
        "bpm": BPM, "usul_olcu": "4/4 – sofyan (Düm . Te Ke)",
        "sure": round(T / SR, 3),
        "dongu": [round(bas_s, 6), round(son_s, 6)],
        "dongu_ornek": [bas, son],
        "katmanlar": [{"ad": "zemin", "dosya": f"out/{ID}__zemin.flac", "icerik": "kontrbas D2 + çello D3/A3 dem'i, bozkır rüzgârı"},
                      {"ad": "ritim", "dosya": f"out/{ID}__ritim.flac", "icerik": "bendir/def, sofyan (5–18. ölçüler), çok hafif"},
                      {"ad": "melodi", "dosya": f"out/{ID}__melodi.flac", "icerik": "ney benzeri nefesli (leitmotif tam) + ud/kopuz benzeri telli (taksim, heterofoni)"}],
        "vurgu": {"dosya": f"out/{ID}__vurgu.flac", "sure": round(len(vur) / SR, 3), "olcumler": ov},
        "yogunluk": "dusuk",
        "leitmotif": "tam ve açık: ney, 5–7. ölçüler (gövde 7.27–18.18 sn → tam miksde 12.73–23.64 sn); 9–11. ölçülerde süslü ikinci veriliş (A'da açık biter); 17–18. ölçülerde telli+ney parçalı",
        "olcumler": o,
        "kaynaklar": [
            {"dosya": "VCSL " + VCSL_DEF + "HDrum{L,S}_Hit/HitMuted_*", "lisans": "CC0 1.0", "repo": REPO["VCSL"], "not": "bendir/def (= shared/sfx ritim/def_*)"},
            {"dosya": "VSCO-2-CE " + VSCO_CELLO + "susvib_{D2,A2}_v1_1.wav", "lisans": "CC0 1.0", "repo": REPO["VSCO-2-CE"]},
            {"dosya": "VSCO-2-CE " + VSCO_KB + "BKCtbss_SusVib_D1_v1_rr1.wav", "lisans": "CC0 1.0", "repo": REPO["VSCO-2-CE"]},
            {"dosya": "sentez", "lisans": "kendi üretimimiz", "not": "ney (additive + perdeli nefes), ud/kopuz (Karplus-Strong), rüzgâr, oda yankısı"}],
        "uretim_sn": round(time.time() - t_bas, 1),
    }
    with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=1)
    print(json.dumps({"sure": meta["sure"], "dongu": meta["dongu"], "olcumler": o, "vurgu": ov}, ensure_ascii=False, indent=1))


def vurgu(rng):
    """Kapanış/vurgu sting'i (~5 sn): dem akoru + ney'in E♭→D inişi + hafif bendir, sıcak oda."""
    T = int(5.2 * SR)
    v = Katman("vurgu", T, T)
    for x, f0, nota, sv, p, fz in dron_kaynaklari():
        y = uzat(kaydir(x, hz(nota, False) / f0), int(4.6 * SR), rng)
        v.ekle_d(0.0, suzgec(y, lp=1400, hp=45) * zarf(len(y), 0.25, 3.2)[:, None], 0.30 * 10 ** (sv / 20), p)
    for t, s in ud_partisyon([(0.0, "D2", .55, {"cin": 1}), (0.03, "D3", .45, {"cin": 1}), (0.06, "A3", .36, {"cin": 1}),
                              (1.10, "Eb3", .30, {"carpma": "F#3"}), (1.45, "D3", .34, {"cin": 1})], VUR, rng):
        v.ekle_d(0.02 + t, suzgec(s, hp=70, lp=2800, can=UD_GOVDE, raf=(2200, -4.0)), 0.55, -0.18)
    t, s = ney_cumle([(0.0, 0.3, "Eb4", {"v": .85}), (0.3, 2.4, "D4", {"vib": 13, "dim": 1})], VUR, rng)
    v.ekle_d(0.45 + t, s, 0.30, 0.12)
    v.ekle_d(0.0, suzgec(def_ornek("dum", rng), hp=45, lp=2600), 0.35, -0.1)
    x = yanki(v.d[:T], 0.22)
    x *= gecis_zarfi(T, cikis=(T / SR - 1.2, T / SR))[:, None]
    x *= 10 ** ((-19.0 - db(np.sqrt((x ** 2).mean()))) / 20)
    if np.abs(x).max() > 10 ** (-1.2 / 20): x *= 10 ** (-1.2 / 20) / np.abs(x).max()
    return x


if __name__ == "__main__":
    main()
