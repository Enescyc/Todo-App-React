#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""destan – "Destansı yükseliş" (seri leitmotifinin büyük, sinematik hali)

Fetih / dönüm noktası anları (Bursa'nın teslimi, Gelibolu, Kosova, İstanbul), sezon finali öncesi doruk.
Kademeli yükselen yapı: sessiz giriş (dem + timpani rulosu) → düyek vurgulu çello spiccato ostinatosu →
leitmotifin korno + violalarla TAM verilişi → doruk (keman/viola oktavda, korno, timpani düyek, büyük davul)
→ ♭II–I (E♭→D) Hicaz kadansı → geri çekilme (korno yankısı) → döngü.
Örnekler: VSCO 2 CE (CC0) yaylı bölümleri, korno, timpani, büyük davul. Zil/crash YOK.
D Hicaz (12-TET; orkestra), kontrbas D pedalı. ♩ = 76, 4/4 (ostinato vurguları düyek: Düm Tek . Tek Düm . Tek .).

Çalıştırma:  python3 tarih-reels/shared/muzik/destan/uret.py
Çıktı:       out/destan__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, stereo, 24 bit), onizleme.mp3, meta.json
Gerekenler:  numpy, ffmpeg, git (CC0 örnekler VSCO-2-CE kısmi klonundan çekilir; SFX_KLON ortam değişkeni ile yer değiştirilebilir).
Deterministik: sabit tohum (TOHUM).
"""
import json, os, subprocess, sys, time
import numpy as np

ID = "destan"
SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
SHARED = os.path.abspath(os.path.join(HERE, "..", ".."))
SFX = os.path.join(SHARED, "sfx")
OUT = os.path.join(HERE, "out")
TMP = os.environ.get("MUZIK_TMP", f"/tmp/claude-0/muzik-{ID}")
KLON = os.environ.get("SFX_KLON", "/tmp/claude-0/sfx")
REPO = {"VCSL": "https://github.com/sgossner/VCSL", "VSCO-2-CE": "https://github.com/sgossner/VSCO-2-CE"}
TOHUM = 1453

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


def kararli_bolge(x, esik_db=4.5, bas=0.6, son=0.6):
    """Sürekli örnekte seviyesi ortancanın esik_db altına düşmeyen en uzun bölge (yay değişimi/çukurlardan kaçınır)."""
    m = x.mean(1); W = int(0.1 * SR); k = len(m) // W
    e = db(np.sqrt((m[:k * W].reshape(k, W) ** 2).mean(1)))
    i0, i1 = int(bas * SR / W), k - int(son * SR / W)
    ok = e[i0:i1] >= np.median(e[i0:i1]) - esik_db
    en, cur, en_bas, cur_bas = 0, 0, i0, i0
    for i, v in enumerate(ok):
        if v:
            if cur == 0: cur_bas = i0 + i
            cur += 1
            if cur > en: en, en_bas = cur, cur_bas
        else: cur = 0
    return en_bas * W, (en_bas + en) * W


def uzat(x, n, rng, xf=0.3, bas=0.8, son=0.6, ara=800):
    """Sürekli bir sesi n örneğe uzatır: kararlı bölgeden faz hizalı taneler, kısa çapraz geçişler."""
    if len(x) >= n:
        return x[:n].copy()
    X = int(xf * SR); K = 4096; s0, s1 = kararli_bolge(x, bas=bas, son=son); s0 += ara; s1 -= ara
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


def surekli_dongu(x, L, rng, xf=0.25, bas=1.0, son=0.6, ara=800):
    """Periyodik (uzunluk L) sürekli ses: kararlı bölgeden faz hizalı taneler; sarma noktası da hizalanır
    (son tane gerekirse ≤ %0.3 yeniden örneklenir). Saldırı yok, çukur yok."""
    X = int(xf * SR); K = 4096
    s0, s1 = kararli_bolge(x, bas=bas, son=son); s0 += ara; s1 -= ara
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
    return np.roll(P, int(rng.integers(L)), axis=0)        # sarma noktaları sesler arasında ve döngü noktasında çakışmasın


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
    o["rms_1sn_max_artis_db"] = round(float(max(v)), 2)          # tüm dosya (girişin sessizlikten açılışı dahil)
    o["rms_1sn_max_azalis_db"] = round(float(-min(v)), 2)        # tüm dosya (kapanışın sönüşü dahil)
    if bas is not None:                                          # yalnız döngü gövdesi (tekrar tekrar duyulan bölüm)
        i0, i1 = -(-bas // W1), son // W1
        vg = [r1[i + 1] - r1[i] for i in range(i0, i1 - 1)]
        o["govde_rms_1sn_max_artis_db"] = round(float(max(vg)), 2)
        o["govde_rms_1sn_max_azalis_db"] = round(float(-min(vg)), 2)
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


def sinirla(stems, tavan_db=-1.2, ileri=0.02, tut=0.08):
    """Gerekirse yumuşak tepe sınırlayıcı (20 ms ileri bakış, 80 ms tutma, 20 ms yumuşak geçiş). Kazanç eğrisi miksten
    hesaplanıp tüm katmanlara AYNEN uygulanır (katmanların toplamı tam miksi vermeye devam eder)."""
    mix = sum(stems); tavan = 10 ** (tavan_db / 20)
    a = np.abs(mix).max(1)
    if a.max() <= tavan: return stems, 0.0
    g = np.minimum(1.0, tavan / np.maximum(a, 1e-9))
    B = 32; nb = -(-len(g) // B)
    gb = np.pad(g, (0, nb * B - len(g)), constant_values=1.0).reshape(nb, B).min(1)
    on, arka = int(ileri * SR / B) + 1, int(tut * SR / B) + 1
    gp = np.pad(gb, (arka, on), constant_values=1.0)
    gm = np.minimum.reduce([gp[k:k + nb] for k in range(on + arka + 1)])      # [−tut, +ileri] penceresinde en küçük
    ker = np.hanning(2 * on + 1); ker /= ker.sum()
    gs = np.repeat(np.convolve(np.pad(gm, (on, on), mode="edge"), ker, "valid"), B)[:len(g)]
    gs = np.minimum(gs, g)
    return [s * gs[:, None] for s in stems], round(float(db(gs.min())), 2)


# =====================================================================================
# ÖRNEKLEYİCİ – VSCO 2 CE (CC0). Dosya adlarındaki nota bir oktav pestir (C3 = orta do) → vsco_hz().
# =====================================================================================
V = "VSCO-2-CE"
BOLUM = {
    #  ad      : (yol şablonu, VSCO nota adları, dinamik katmanları)
    "kb":     ("Strings/Solo Contrabass/SusNV/BKCtbss_SusNV_{ad}_v{k}_rr1.wav", ["C1", "D1", "E1"], [1, 3]),
    "vc":     ("Strings/Cello Section/susvib/susvib_{ad}_v{k}_1.wav", ["G1", "B1", "D2", "F2", "A2", "C3"], [1, 3]),
    "vla":    ("Strings/Viola Section/susvib/ViolaEns_susvib_{ad}_v{k}_1.wav", ["C2", "E2", "G2", "B2", "D3", "F3", "A3", "C4"], [1, 2]),
    "vln":    ("Strings/Violin Section/susVib/VlnEns_susVib_{ad}_v{k}.wav", ["G2", "B2", "D3", "F#3", "A3", "C4", "E4"], [1, 2]),
    "korno":  ("Brass/F Horn/sus/MOHorn_sus_{ad}_v{k}_1.wav", ["G1", "A#1", "D2", "F2", "A2", "C3"], [1, 2, 3]),
}
SPIC = ("Strings/Cello Section/spic/spic_{ad}_v{k}_RR{r}.wav", ["B1", "D2", "C3"], [1, 2])
PIZZ = ("Strings/Solo Contrabass/Pizz/BKCtbss_Pizz_{ad}_v1_rr{r}.wav", ["D1"])
TIMP = "Percussion/Timpani/Timpani{d}_Hit_v{k}_rr{r}_Sum.wav"
TIMP_KAT = {1: [1, 3], 2: [1, 3, 4]}
TIMP_HZ = {1: 90.5, 2: 122.0}            # ana (1,1) kipinin ölçülen frekansı → D2 / A2'ye kaydırılır
TIMP_RULO = "Percussion/Timpani/Rolls/Timpani1_Roll_v{k}_rr1_Sum.wav"
DAVUL = "Percussion/BDrumNewhit_v{k}_rr{r}_Sum.wav"


def gerekli():
    l = []
    for yol, adlar, ks in BOLUM.values():
        l += [(V, yol.format(ad=a, k=k)) for a in adlar for k in ks]
    l += [(V, SPIC[0].format(ad=a, k=k, r=r)) for a in SPIC[1] for k in SPIC[2] for r in (1, 2)]
    l += [(V, PIZZ[0].format(ad=a, r=r)) for a in PIZZ[1] for r in (1, 2)]
    l += [(V, TIMP.format(d=d, k=k, r=r)) for d, ks in TIMP_KAT.items() for k in ks for r in (1, 2)]
    l += [(V, TIMP_RULO.format(k=k)) for k in (3, 5)]
    l += [(V, DAVUL.format(k=k, r=r)) for k in range(1, 8) for r in (1, 2)]
    return l


_NORM = {}
def orn(yol, tur="sus"):
    """Örneği yükle ve normalize et: sürekli → kararlı bölge RMS −20 dBFS; kısa → tepe −6 dBFS."""
    if yol not in _NORM:
        x = kl(V, yol)
        if tur == "sus":
            a, b = kararli_bolge(x); x = x * (0.1 / max(np.sqrt((x[a:b] ** 2).mean()), 1e-9))
        else:
            x = x * (0.5 / max(np.abs(x).max(), 1e-9))
        _NORM[yol] = x
    return _NORM[yol]


def en_yakin(adlar, f):
    a = min(adlar, key=lambda a: abs(np.log2(f / vsco_hz(a))))
    return a, f / vsco_hz(a)


def din_db(d): return -16.0 + 16.0 * d          # dinamik 0..1 → −16..0 dB


def sus_nota(bolum, f, sure, din, rng, legato=False, a=None, r=0.35, din2=None):
    """Sürekli (yay/üfleme) nota: dinamik katmanları eşit güçle harmanlanır (p ↔ f tını), gerekirse faz hizalı uzatılır.
    legato=True → örneğin saldırısı atlanır (0.16 sn), yumuşak giriş (önceki notanın bırakmasıyla çapraz geçer)."""
    yol, adlar, ks = BOLUM[bolum]
    n = int((sure + r) * SR)
    dm = din if din2 is None else max(din, din2)
    p = dm * (len(ks) - 1); i0 = min(int(p), len(ks) - 2); fr = p - i0
    out = np.zeros((n, 2))
    ad, oran = en_yakin(adlar, f)
    for k, w in ((ks[i0], np.cos(fr * np.pi / 2)), (ks[i0 + 1], np.sin(fr * np.pi / 2))):
        if w < 0.03: continue
        x = orn(yol.format(ad=ad, k=k))
        y = kaydir(x, oran, bas=0.16 * SR if legato else 0.0)
        if len(y) < n: y = uzat(y, n, rng)
        out += y[:n] * w
    g = 10 ** (din_db(din) / 20) if din2 is None else 10 ** (np.interp(np.arange(n), [0, int(sure * SR)], [din_db(din), din_db(din2)]) / 20)[:, None]
    return out * g * zarf(n, a if a else (0.10 if legato else 0.03), r)[:, None]


def cizgi(kat, bolum, notalar, rng, p=0.0, r_son=0.6, xf=0.14, sapma=0.008):
    """Legato çizgi: notalar [(bas_vurus, sure_vurus, nota, din[, din2])]; bitişik ve farklı perdeli notalar bağlanır."""
    for i, nt in enumerate(notalar):
        bv, sv, nota, din = nt[:4]; din2 = nt[4] if len(nt) > 4 else None; op = nt[5] if len(nt) > 5 else {}
        once = notalar[i - 1] if i else None
        sonra = notalar[i + 1] if i + 1 < len(notalar) else None
        legato = once is not None and abs(once[0] + once[1] - bv) < 0.05 and once[2] != nota
        bagli = sonra is not None and abs(bv + sv - sonra[0]) < 0.05 and sonra[2] != nota
        s = sus_nota(bolum, hz(nota, False), sv * VUR, din, rng, legato=legato, a=op.get("a"), r=xf if bagli else r_son, din2=din2)
        kat.ekle(bv * VUR + (rng.normal(0, sapma) if not legato else 0.0), s, 1.0, p)


def kisa(sablon, adlar, ks, f, vel, rr, sure=0.7):
    a, oran = en_yakin(adlar, f)
    k = ks[0] if vel < 0.62 or len(ks) == 1 else ks[-1]
    x = orn(sablon.format(ad=a, k=k, r=rr), "kisa")
    y = kaydir(x, oran, n=int(sure * SR))
    return y * zarf(len(y), 0.002, 0.15)[:, None] * vel ** 1.3


def timpani(nota, vel, rng):
    d = 1 if nota == "D2" else 2
    ks = TIMP_KAT[d]; k = ks[min(len(ks) - 1, int(vel * len(ks)))]
    x = orn(TIMP.format(d=d, k=k, r=int(rng.integers(1, 3))), "kisa")
    y = kaydir(x, hz(nota, False) / TIMP_HZ[d] * 2 ** (rng.normal(0, 4) / 1200), n=int(5.0 * SR))
    return y * zarf(len(y), 0.0015, 1.8)[:, None] * vel ** 1.25


def timpani_rulo(sure, d0, d1, nota="D2"):
    """Timpani rulosu (VSCO Timpani1 rulo, p/f katman harmanı), d0→d1 kresendo/dekresendo."""
    n = int(sure * SR); oran = hz(nota, False) / 91.5
    y3 = kaydir(orn(TIMP_RULO.format(k=3)), oran, n=n, bas=0.4 * SR)
    y5 = kaydir(orn(TIMP_RULO.format(k=5)), oran, n=n, bas=0.4 * SR)
    d = np.linspace(d0, d1, n)
    s = y3 * np.cos(d * np.pi / 2)[:, None] + y5 * np.sin(d * np.pi / 2)[:, None]
    return s * (10 ** ((-24 + 24 * d) / 20))[:, None] * zarf(n, 0.25, 0.3)[:, None]


def davul(vel, rng):
    k = int(np.clip(round(1 + vel * 6), 1, 7))
    x = orn(DAVUL.format(k=k, r=int(rng.integers(1, 3))), "kisa")[:int(5 * SR)]
    return x * zarf(len(x), 0.002, 1.5)[:, None] * vel ** 1.25


def egri(noktalar, L):
    """Periyodik dinamik eğrisi: [(vuruş, din, açık)] → (din[], açık[]) gövde boyunca (L örnek)."""
    b = np.arange(L) / SR / VUR
    v = [p[0] for p in noktalar]
    return np.interp(b, v, [p[1] for p in noktalar]), np.interp(b, v, [p[2] for p in noktalar])


def dron(bolum, ad_nota, L, rng, noktalar):
    """Periyodik (döngü boyu) sürekli dem sesi; p/f katmanları dinamik eğrisine göre harmanlanır."""
    yol, adlar, ks = BOLUM[bolum]
    f = hz(ad_nota, False); a, oran = en_yakin(adlar, f)
    Pp = surekli_dongu(kaydir(orn(yol.format(ad=a, k=ks[0])), oran), L, rng)
    Pf = surekli_dongu(kaydir(orn(yol.format(ad=a, k=ks[-1])), oran), L, rng)
    d, ac = egri(noktalar, L)
    g = 10 ** (din_db(d) / 20) * ac
    return (Pp * np.cos(d * np.pi / 2)[:, None] + Pf * np.sin(d * np.pi / 2)[:, None]) * g[:, None]


# =====================================================================================
# DÜZENLEME – destan
# =====================================================================================
BPM = 76
VUR = 60 / BPM
GOVDE_VURUS = 88          # 22 ölçü (döngü gövdesi)
GIRIS_VURUS = 6           # giriş = gövdenin son 6 vuruşu (dem + timpani rulosu), yükselerek açılır (≈ 4.7 sn)
KAPANIS_SN = 7.0

# ---- ZEMİN
KB_EGRI = [(0, .15, 1), (16, .25, 1), (32, .45, 1), (44, .6, 1), (48, .8, 1), (63.6, .8, 1), (64.2, .8, 0), (67.8, .7, 0),
           (68.3, .55, 1), (72, .35, 1), (80, .15, 1), (88, .15, 1)]
VC_EGRI = [(0, .15, 1), (16, .25, 1), (30, .3, 1), (32, .3, 0), (66, .3, 0), (68.5, .4, 1), (72, .32, 1), (80, .15, 1), (88, .15, 1)]
KB_NOTA = [(64, 4.1, "Eb2", .7, .55)]                                  # ♭II: pedal 17. ölçüde E♭'ye kalkar
VC_KOK = [  # çellolar: motif armonisinin kökleri (1. veriliş), Hicaz dörtlüsüyle yükseliş, doruk, kadans
    (32, 1, "D3", .55), (33, 1, "G2", .55), (34, 2, "D3", .55), (36, 1, "C3", .55), (37, 1, "D3", .55), (38, 1, "G2", .55), (39, 1, "Eb3", .58),
    (40, 4, "D3", .58), (44, 1, "D3", .6), (45, 1, "Eb3", .65), (46, 1, "F#3", .7), (47, 1, "G3", .75),
    (48, 1, "D3", .8), (49, 1, "G2", .8), (50, 2, "D3", .8), (52, 1, "C3", .8), (53, 1, "D3", .82), (54, 1, "G2", .82), (55, 1, "Eb3", .85),
    (56, 4, "D3", .85), (60, 4, "D3", .85), (64, 4, "Eb3", .7, .5)]
VLA_PAD = [  # violalar (divisi): D5 → Gm → C°7 gerilimi (korno F♯ ile)
    [(16, 8, "A3", .22, .36, {"a": 3.0}), (24, 4, "Bb3", .38), (28, 4, "C4", .42, .5)],
    [(16, 8, "D4", .22, .36, {"a": 3.4}), (24, 4, "D4", .38), (28, 4, "Eb4", .42, .5)],
    [(72, 8, "D4", .2, .08)],                                           # geri çekilme: pp dem
]
AKOR = [  # doruk sonu: D – E♭ – D (♭II–I), keman divisi + viola
    ("vln", [(60, 4, "F#4", .82), (64, 4, "G4", .66, .52), (68, 4, "F#4", .45, .2)]),
    ("vln", [(60, 4, "A4", .8), (64, 4, "Bb4", .64, .5), (68, 4, "A4", .42, .18)]),
    ("vla", [(60, 4, "D4", .8), (64, 4, "Eb4", .64, .5), (68, 4, "D4", .42, .2)]),
]
# ---- MELODİ
MOTIF = [("A", 0, 1), ("Bb", 1, 1), ("A", 2, 2), ("G", 4, 1), ("F#", 5, 1), ("G", 6, 1), ("Eb", 7, 1), ("D", 8, 4)]
def motif(b0, okt, din, son_sure=4):
    return [(b0 + bb, (s if n != "D" else son_sure), f"{n}{okt}", din) for n, bb, s in MOTIF]

KORNO = (
    [(16, 1, "A3", .28, .3, {"a": 0.25}), (17, 1, "Bb3", .34), (18, 2, "A3", .34)] +   # parça (ima)
    [(24, 1, "A3", .42), (25, 1, "Bb3", .46), (26, 1.5, "A3", .45), (27.5, .5, "G3", .45), (28, 3.6, "F#3", .48, .62)] +
    motif(32, 3, .6, 3.6) +                                                              # 1. veriliş: TAM (korno + viola)
    [(44, 4, "A3", .5, .72)] +                                                           # Hicaz dörtlüsü üstünde çağrı
    motif(48, 3, .86) + [(60, 4, "A3", .85), (64, 4, "G3", .7, .5), (68, 3.5, "F#3", .45, .22)] +   # doruk + kadans
    [(72, 1, "F#3", .3), (73, 1, "G3", .32), (74, 1, "Eb3", .32), (75, 3.2, "D3", .3, .12)]       # yankı (geri çekilme)
)
VLA_MEL = motif(32, 3, .42, 3.6) + motif(48, 3, .66)
VLN_MEL = motif(48, 4, .74)

# ---- RİTİM
DUYEK = [1.0, .78, .5, .82, .95, .5, .8, .55]           # Düm Tek . Tek Düm . Tek . (sekizlik vurguları)
OST_OLCU = [.32, .36, .41, .46, .50, .53, .57, .62, .68, .70, .72, (.78, .9), .92, .92, .94, .94, (.8, .62), (.5, .32)]
TIMP_OLAY = (
    [(0, "D2", .26), (8, "D2", .34), (12, "D2", .36)] +
    [(b, "D2", .31 + .03 * i) for i, b in enumerate([16, 18, 20, 22, 24, 26])] +
    [(o * 4 + x, n, v) for o in (8, 9, 10) for x, n, v in ((0, "D2", .65), (2, "A2", .5))] +
    [(o * 4 + x, n, v) for o in (12, 13, 14, 15) for x, n, v in ((0, "D2", .86), (.5, "A2", .45), (1.5, "A2", .52), (2, "D2", .74), (3, "A2", .55))] +
    [(68, "D2", .45)]
)
TIMP_RULO_OLAY = [(28, 4, .3, .68), (44, 4, .45, .85), (64, 4, .7, .35), (82, 6.05, .08, .44)]
DAVUL_OLAY = [(8, .26), (24, .4), (32, .58), (36, .6), (40, .62), (44, .6), (46, .66),
              (48, .85), (50, .62), (52, .84), (54, .62), (56, .86), (58, .64), (60, .86), (62, .66), (64, .7), (68, .5)]


def ostinato(kat, rng):
    """Çello spiccato ostinatosu (1–18. ölçüler), düyek vurgulu sekizlikler; dorukta oktav katlaması."""
    sab, adlar, ks = SPIC
    rr = 1
    for o, olc_ in enumerate(OST_OLCU):
        v0, v1 = olc_ if isinstance(olc_, tuple) else (olc_, olc_)
        desen = ["D3", "D3", "D3", "Eb3", "D3", "D3", "C3", "D3"] if o != 16 else ["Eb3"] * 8
        for i, nota in enumerate(desen):
            b = o * 4 + i * 0.5
            v = (v0 + (v1 - v0) * i / 7) * DUYEK[i] * 10 ** (rng.normal(0, 0.8) / 20)
            kat.ekle(b * VUR + rng.normal(0, 0.006), kisa(sab, adlar, ks, hz(nota, False), v, rr, 0.55), 1.0, 0.3)
            if 12 <= o <= 15:
                kat.ekle(b * VUR + 0.004, kisa(sab, adlar, ks, hz(nota, False) * 2, v * 0.55, 3 - rr, 0.45), 1.0, 0.2)
            rr = 3 - rr
        if 4 <= o <= 16:                                   # kontrbas pizz düm'lerde
            for x in (0, 2):
                pn = "Eb2" if o == 16 else "D2"
                kat.ekle((o * 4 + x) * VUR, kisa(PIZZ[0], PIZZ[1], [1], hz(pn, False), 0.8 * v0, 1 + x // 2, 1.2), 0.9, 0.4)


def main():
    global IR
    t_bas = time.time()
    getir(gerekli())
    IR = oda_ir()
    rng = np.random.default_rng(TOHUM)
    L = int(round(GOVDE_VURUS * VUR * SR)); bas = int(round(GIRIS_VURUS * VUR * SR)); son = bas + L
    T = son + int(KAPANIS_SN * SR)
    bas_s, son_s = bas / SR, son / SR

    def K(ad): return Katman(ad, L, T)
    # ---------------- ZEMİN ----------------
    kb, vc, vla, akor = K("kb"), K("vc"), K("vla_pad"), K("akor")
    kb.g[kb.O:kb.O + L] += pan(dron("kb", "D2", L, rng, KB_EGRI), 0.35)
    cizgi(kb, "kb", KB_NOTA, rng, 0.35)
    vc.g[vc.O:vc.O + L] += pan(dron("vc", "D3", L, rng, VC_EGRI), 0.3)
    cizgi(vc, "vc", VC_KOK, rng, 0.3)
    for ses in VLA_PAD: cizgi(vla, "vla", ses, rng, 0.2)
    for bol, ses in AKOR: cizgi(akor, bol, ses, rng, -0.3 if bol == "vln" else 0.2)
    # kapanış (son'dan itibaren): D–A–D dem akoru, uzun bırakma
    for kat, bol, nota, d, p in ((kb, "kb", "D2", .3, .35), (vc, "vc", "D3", .3, .3), (vla, "vla", "A3", .22, .2), (vla, "vla", "D4", .2, .2)):
        s = sus_nota(bol, hz(nota, False), 2.2, d, rng, a=0.6, r=4.4, din2=d * 0.6)
        kat.ekle_d(son_s, s, 1.0, p)
    # ---------------- MELODİ ----------------
    korno, vla_m, vln_m = K("korno"), K("vla_mel"), K("vln_mel")
    cizgi(korno, "korno", KORNO, rng, -0.15)
    cizgi(vla_m, "vla", VLA_MEL, rng, 0.2)
    cizgi(vln_m, "vln", VLN_MEL, rng, -0.35)
    s1 = sus_nota("korno", hz("Eb3", False), 0.7, .3, rng, a=0.2, r=0.14)
    s2 = sus_nota("korno", hz("D3", False), 1.8, .32, rng, legato=True, r=3.2, din2=.12)
    korno.ekle_d(son_s + 0.25, s1, 1.0, -0.15); korno.ekle_d(son_s + 0.25 + 0.7, s2, 1.0, -0.15)
    # ---------------- RİTİM ----------------
    ost, timp, dav = K("ostinato"), K("timpani"), K("davul")
    ostinato(ost, rng)
    for b, nota, v in TIMP_OLAY: timp.ekle(b * VUR + rng.normal(0, 0.004), timpani(nota, v, rng), 1.0, 0.0)
    for b, sr_, d0, d1 in TIMP_RULO_OLAY: timp.ekle(b * VUR, timpani_rulo(sr_ * VUR + 0.3, d0, d1), 1.0, 0.0)
    for b, v in DAVUL_OLAY: dav.ekle(b * VUR + rng.normal(0, 0.004), davul(v, rng), 1.0, -0.05)
    timp.ekle_d(son_s + 0.01, timpani("D2", .36, rng), 1.0, 0.0)

    # ---------------- süzgeç, seviye, oda ----------------
    eq = {"kb": dict(hp=32, lp=2500), "vc": dict(hp=55, lp=3800, raf=(2500, -3)), "vla_pad": dict(hp=110, lp=3800, raf=(2500, -3)),
          "akor": dict(hp=140, lp=3800, raf=(2500, -4)), "korno": dict(hp=60, lp=3200, raf=(1900, -4), can=[(500, 1.5, 0.8)]),
          "vla_mel": dict(hp=110, lp=3800, raf=(2500, -3)), "vln_mel": dict(hp=150, lp=3800, raf=(2400, -4.5)),
          "ostinato": dict(hp=65, lp=3600, raf=(2500, -3)), "timpani": dict(hp=30, lp=3000), "davul": dict(hp=28, lp=2500)}
    hedef = {"kb": -22.5, "vc": -22.0, "vla_pad": -26.0, "akor": -23.0, "korno": -19.5, "vla_mel": -24.0, "vln_mel": -23.0,
             "ostinato": -22.0, "timpani": -23.0, "davul": -27.0}
    islak = {"kb": .18, "vc": .2, "vla_pad": .22, "akor": .22, "korno": .24, "vla_mel": .22, "vln_mel": .24,
             "ostinato": .18, "timpani": .2, "davul": .18}
    katlar = [kb, vc, vla, akor, korno, vla_m, vln_m, ost, timp, dav]
    for k in katlar:
        k.katla()
        k.isle(lambda x, d, e=eq[k.ad]: suzgec(x, dongusel=d, **e))
        k.seviye(hedef[k.ad])
        k.isle(lambda x, d, w=islak[k.ad]: yanki(x, w, d))

    # ---------------- giriş/kapanış zarfları ----------------
    z_zem = gecis_zarfi(T, giris=(0.0, bas_s * 0.9), cikis=(son_s + 0.25, son_s + 2.2))
    z_mel = gecis_zarfi(T, giris=(0.0, 0.3), cikis=(son_s, son_s + 0.4))
    z_rit = gecis_zarfi(T, giris=(0.0, 1.2), cikis=(son_s + 0.02, son_s + 0.25))
    zemin = sum(k.cikti(bas, z_zem) for k in (kb, vc, vla, akor))
    melodi = sum(k.cikti(bas, z_mel) for k in (korno, vla_m, vln_m))
    ritim = sum(k.cikti(bas, z_rit) for k in (ost, timp, dav))
    son_fade = gecis_zarfi(T, cikis=(T / SR - 0.6, T / SR))[:, None]
    stems = [zemin * son_fade, ritim * son_fade, melodi * son_fade]

    mix = sum(stems)
    g = 10 ** ((-20.0 - db(np.sqrt((mix ** 2).mean()))) / 20)
    stems = [s * g for s in stems]
    stems, gr = sinirla(stems, -1.2)
    mix = sum(stems)
    o = olc(mix, bas, son)
    o["sinirlayici_max_kazanc_azaltma_db"] = gr
    o["katman_rms_dbfs"] = {ad: round(float(db(np.sqrt((s ** 2).mean()))), 2) for ad, s in zip(("zemin", "ritim", "melodi"), stems)}
    W = int(VUR * 4 * SR)
    o["olcu_rms_dbfs"] = [round(float(db(np.sqrt((mix[bas + i * W:bas + (i + 1) * W] ** 2).mean()))), 1) for i in range(GOVDE_VURUS // 4)]

    os.makedirs(OUT, exist_ok=True)
    yaz_flac(os.path.join(OUT, f"{ID}__tam.flac"), mix)
    for ad, s in zip(("zemin", "ritim", "melodi"), stems):
        yaz_flac(os.path.join(OUT, f"{ID}__{ad}.flac"), s)
    vur = vurgu(rng)
    ov = olc(vur)
    yaz_flac(os.path.join(OUT, f"{ID}__vurgu.flac"), vur)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, f"{ID}__tam.flac"), "-c:a", "libmp3lame", "-b:a", "128k",
                    os.path.join(HERE, "onizleme.mp3")], check=True)
    spektrogram(mix, os.path.join(TMP, "spektrogram_tam.png"), f"{ID} tam")
    for ad, st in zip(("zemin", "ritim", "melodi"), stems):
        spektrogram(st, os.path.join(TMP, f"spektrogram_{ad}.png"), f"{ID} {ad}")
    spektrogram(vur, os.path.join(TMP, "spektrogram_vurgu.png"), f"{ID} vurgu")

    ilk = 32 * VUR + bas_s
    meta = {
        "id": ID, "ad": "Destansı yükseliş",
        "tarz": "sinematik orkestral yükseliş: yaylılar (kontrbas pedalı, çello spiccato ostinatosu, viola/keman), korno, timpani, büyük davul; seri leitmotifinin büyük hali",
        "kullanim": ["fetih / dönüm noktası", "Bursa'nın teslimi", "Gelibolu'ya geçiş", "Kosova", "İstanbul'un fethi", "sezon finali öncesi doruk",
                     "zafer sonrası geniş plan"],
        "donem": [1, 2, 3, 4, 5, 6, 7, 8],
        "ton_makam": "D Hicaz (orkestrada 12-TET; Hicaz'a yaklaşım), kontrbas D pedalı; armoni D – Gm – Cm – E♭ (♭II–I Hicaz kadansı)",
        "bpm": BPM, "usul_olcu": "4/4 – ostinato sekizlik vurguları düyek kalıbında (Düm Tek . Tek Düm . Tek .); timpani dorukta düyek",
        "sure": round(T / SR, 3),
        "dongu": [round(bas_s, 6), round(son_s, 6)],
        "dongu_ornek": [bas, son],
        "katmanlar": [{"ad": "zemin", "dosya": f"out/{ID}__zemin.flac", "icerik": "kontrbas D pedalı, çello dem'i ve kök çizgisi, viola dolgusu, doruk sonu akorları"},
                      {"ad": "ritim", "dosya": f"out/{ID}__ritim.flac", "icerik": "çello spiccato ostinatosu (düyek vurgulu) + kontrbas pizz, timpani (D2/A2, rulolar), büyük davul"},
                      {"ad": "melodi", "dosya": f"out/{ID}__melodi.flac", "icerik": "korno (leitmotif, parçalar, yankı), viola unison, dorukta keman oktavı"}],
        "vurgu": {"dosya": f"out/{ID}__vurgu.flac", "sure": round(len(vur) / SR, 3), "olcumler": ov},
        "yogunluk": "yuksek",
        "leitmotif": f"5–8. ölçüler parça (ima), 9–11. ölçüler TAM (korno + viola; tam miksde {ilk:.2f} sn), 13–15. ölçüler doruk (korno + viola + keman oktavı), 19–20. ölçüler motif sonu yankısı",
        "yapi_olcu": {"1-4": "ostinato başlar (pp→p), D pedalı", "5-8": "violalar, korno parçaları, kresendo, 8. ölçüde C°7 gerilimi + timpani rulosu",
                      "9-11": "leitmotif tam (korno + viola), çellolar armoni kökleri", "12": "Hicaz dörtlüsü yükselişi, rulo kresendo",
                      "13-16": "DORUK: motif keman/viola/korno oktavında, timpani düyek, büyük davul", "17-18": "E♭ → D (♭II–I) kadansı, dekresendo",
                      "19-20": "geri çekilme: korno yankısı (F♯ G E♭ D)", "21-22": "dem + timpani rulosu (giriş malzemesi) → döngü başı"},
        "olcumler": o,
        "kaynaklar": [{"dosya": "VSCO-2-CE " + y, "lisans": "CC0 1.0", "repo": REPO["VSCO-2-CE"]} for y in sorted({p.rsplit("/", 1)[0] + "/" for _, p in gerekli()})] +
                     [{"dosya": "sentez", "lisans": "kendi üretimimiz", "not": "oda yankısı (RT60 ≈ 1.8 sn), düzenleme, miks"}],
        "uretim_sn": round(time.time() - t_bas, 1),
    }
    with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=1)
    print(json.dumps({"sure": meta["sure"], "dongu": meta["dongu"], "olcumler": o, "vurgu": ov}, ensure_ascii=False, indent=1))


def vurgu(rng):
    """Vurgu sting'i (~5 sn): timpani + büyük davul, D–A–D yaylı akoru, korno E♭→D (Hicaz kadansı), sıcak oda. Zil yok."""
    T = int(5.3 * SR)
    v = Katman("vurgu", T, T)
    v.ekle_d(0.02, timpani("D2", .78, rng)); v.ekle_d(0.02, davul(.72, rng), 0.9, -0.05)
    for bol, nota, d, p in (("kb", "D2", .6, .35), ("vc", "D3", .6, .3), ("vla", "A3", .5, .2), ("vla", "D4", .45, .2), ("vln", "F#4", .32, -.3)):
        s = suzgec(sus_nota(bol, hz(nota, False), 1.4, d, rng, a=0.04, r=3.4, din2=d * 0.55), hp=35, lp=3600, raf=(2400, -4))
        v.ekle_d(0.0, s, {"kb": 1.0, "vc": 1.0, "vla": 0.6, "vln": 0.5}[bol], p)
    s1 = sus_nota("korno", hz("Eb3", False), 0.5, .6, rng, a=0.05, r=0.14)
    s2 = sus_nota("korno", hz("D3", False), 1.3, .6, rng, legato=True, r=3.0, din2=.3)
    v.ekle_d(0.03, suzgec(s1, hp=60, lp=3200, raf=(1900, -4)), 1.6, -0.15)
    v.ekle_d(0.53, suzgec(s2, hp=60, lp=3200, raf=(1900, -4)), 1.6, -0.15)
    x = yanki(v.d[:T], 0.22)
    x *= gecis_zarfi(T, cikis=(T / SR - 1.2, T / SR))[:, None]
    x *= 10 ** ((-18.0 - db(np.sqrt((x ** 2).mean()))) / 20)
    if np.abs(x).max() > 10 ** (-1.2 / 20): x *= 10 ** (-1.2 / 20) / np.abs(x).max()
    return x


if __name__ == "__main__":
    main()
