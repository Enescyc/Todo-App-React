#!/usr/bin/env python3
"""Seri müzik kütüphanesi · tarz `bizans` — "Bizans ilahisi / Konstantinopolis".

Kullanım:  python3 tarih-reels/shared/muzik/bizans/uret.py
Çıktı:     out/bizans__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, stereo, 24 bit), onizleme.mp3, meta.json
           Spektrogram/dalga PNG'leri: /tmp/claude-0/muzik-bizans/ (git dışı).
Deterministik (sabit tohum). Gerekli: numpy, ffmpeg, git (CC0 örnekler talep üzerine kısmi klondan çekilir).

Ses tasarımı (Bizans kilise müziğine – psaltiki – saygılı bir yorum; birebir ilahi değil)
  zemin  : sürekli ISON (Pa = Re): 12 sesli erkek korosu, toplamsal formant sentezi ("o / ɔ / a / u" vokalleri,
           kademeli nefes, her sesin kendi kayması/vibratosu). Altında çok hafif VSCO 2 CE çello grubu (Re3) ve
           kontrbas (Re2) uzun notası: sıcaklık için, koronun 12+ dB altında.
  melodi : tek sesli psaltis (sentez bariton): portamento, "omalon" benzeri salınım, alttan yaklaşma, gecikmeli vibrato.
           Dizi: 1. echos (Echos protos, Pa = Re, diyatonik) – Chrysanthine 72 moria aralıklarına yaklaşık
           (Vou/Mi ≈ −33 sent, Zo/Si ≈ −33 sent, inişte Zo♭ ≈ Si♭). Döngünün 37–49. saniyesinde melodi kısa bir an
           Hicaz başına döner (La–Si♭–La–Sol–Fa♯–Sol): ison üzerinde yaklaşan Osmanlı leitmotifinin İMASI; sonra
           diyatonik Fa–Mi–Re ile Bizans dünyasına geri çözülür.
  ritim  : vuruş yok. Bu katmanda yalnız seyrek, uzak kilise çanları var (shared/sfx can/kilise_cani_D3 bir oktav pes;
           can/kilise_cani_C3 La'ya pes) – yumuşatılmış saldırı (≥18 ms), tiz raf, çok ıslak.
  oda    : taş kubbe: ~3.0 sn (alçak) → ~0.8 sn (çok tiz) sönüm, sıcak; %24 ıslak (çanlar %60).
Döngü: [GIRIS, GIRIS+DONGU] aralığı dairesel üretilir (ison perdeleri tam sayıda periyot, yankı kuyrukları başa sarılır):
ses motoru döngü sonundan başına atladığında dalga ve yankı kesintisizdir.
"""
import json, os, subprocess, time
import numpy as np

SR = 44100
ID = "bizans"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
SFX = os.path.normpath(os.path.join(HERE, "..", "..", "sfx"))
KLON = os.environ.get("CC0_KLON", "/tmp/claude-0/sfx")
TMP = os.environ.get("MUZIK_TMP", "/tmp/claude-0/muzik-" + ID)
rng = np.random.default_rng(330)          # Konstantinopolis 330

GIRIS, DONGU, KAPANIS = 5.0, 70.0, 6.5    # sn
NG, ND, NK = int(GIRIS * SR), int(DONGU * SR), int(KAPANIS * SR)
H = 64                                     # kontrol hızı adımı (örnek)
RE3 = 146.832
KULLANILAN = []                            # (repo/kaynak, yol) – KAYNAKLAR.tsv için


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


# ───────────────────────── oda (taş kubbe) ─────────────────────────
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


# ───────────────────────── formant ses sentezi ─────────────────────────
VOKAL = {  # erkek (bariton) formantları F1..F5 ve bant genişlikleri (Hz); koyu, "örtülü" renk
    "a": ([680, 1100, 2450, 3250, 3700], [90, 100, 130, 170, 220]),
    "o": ([460, 800, 2450, 3200, 3650], [80, 90, 120, 170, 220]),
    "ɔ": ([560, 880, 2450, 3200, 3650], [85, 95, 125, 170, 220]),
    "u": ([330, 700, 2350, 3150, 3600], [70, 85, 120, 170, 220]),
    "e": ([460, 1550, 2450, 3250, 3700], [80, 100, 130, 170, 220]),
}


def vokal_kazanci(v, f0=170.0, egim=1.2):
    """Vokalin toplam enerjisini eşitleyen kazanç (vokal değişince ses yüksekliği sıçramasın)."""
    k = np.arange(1, int(3800 / f0) + 1); fk = k * f0; g = np.ones(len(k))
    for Fi, Bi in zip(*VOKAL[v]): g = g * Fi ** 2 / np.sqrt((Fi ** 2 - fk ** 2) ** 2 + (fk * Bi) ** 2)
    return 1 / np.sqrt(np.sum((g * k ** -egim) ** 2))


def formant_yolu(olaylar, C, gecis_s, dairesel, olcek=1.0, ref_f0=170.0):
    """olaylar: [(t_sn, vokal)] → kontrol hızında (5,C) F ve B ve (C,) vokal eşitleme kazancı; geçişler gecis_s boyunca yumuşar."""
    t = np.arange(C) * H / SR; v0 = olaylar[-1 if dairesel else 0][1]
    F = np.tile(np.array(VOKAL[v0][0], float)[:, None], (1, C))
    B = np.tile(np.array(VOKAL[v0][1], float)[:, None], (1, C)); G = np.full(C, vokal_kazanci(v0, ref_f0))
    for i, (t0, v) in enumerate(olaylar):
        t1 = olaylar[i + 1][0] if i + 1 < len(olaylar) else 1e9
        m = (t >= t0) & (t < t1)
        F[:, m] = np.array(VOKAL[v][0], float)[:, None]; B[:, m] = np.array(VOKAL[v][1], float)[:, None]; G[m] = vokal_kazanci(v, ref_f0)
    k = gecis_s * SR / H
    return yumusat(F, k, dairesel) * olcek, yumusat(B, k, dairesel), yumusat(G / G.mean(), k, dairesel)[0]


def ses_sentezi(f0, genlik, F, B, egim, rg, fmax=3800.0, dairesel=False, parlaklik=1.5):
    """Toplamsal kaynak–süzgeç sentezi: k. harmonik = k^-egim × Π_i F_i² / √((F_i²−f²)² + (f·B_i)²) × (1 + p·e^{-((f−2.7k)/1k)²}),
    f = k·f0. Son çarpan: kademeli formant modelinin eksik bıraktığı üst kutupların düzeltmesi (≈ +8 dB, 2.7 kHz) – sesi
    "kapalı ağız" mırıltısından insan sesine yaklaştırır; yine de 1.5–4 kHz bölgesi hafif kalır."""
    n = len(f0); ph = 2 * np.pi * np.cumsum(f0) / SR
    C = F.shape[1]; ci = np.minimum(np.arange(C) * H, n - 1); f0c = f0[ci]
    akt = genlik > 1e-7
    K = int(fmax / (f0[akt].min() if akt.any() else f0.min()))
    egim = np.broadcast_to(np.asarray(egim, float), (C,))
    y = np.zeros(n); ph0 = rg.uniform(0, 2 * np.pi, K + 1)
    for k in range(1, K + 1):
        fk = k * f0c; g = np.ones(C)
        for i in range(F.shape[0]):
            g *= F[i] ** 2 / np.sqrt((F[i] ** 2 - fk ** 2) ** 2 + (fk * B[i]) ** 2)
        g *= 1 + parlaklik * np.exp(-((fk - 2700) / 1000) ** 2)
        a = g * k ** (-egim) * np.clip((fmax - fk) / (.3 * fmax), 0, 1)
        if a.max() < 1e-5: continue
        y += ornek_hizina(a, n, dairesel) * np.sin(k * ph + ph0[k])
    return y * genlik


def nefes_cukuru(t, tn, T):
    """tn'de başlayan nefes boşluğu: 0.35 sn iniş, 0.25 sn sessiz, 0.5 sn çıkış (dairesel)."""
    u = (t - tn) % T; d = np.zeros_like(t); a, h, r = .35, .25, .5
    m = u < a; d[m] = np.sin(.5 * np.pi * u[m] / a) ** 2
    d[(u >= a) & (u < a + h)] = 1
    m = (u >= a + h) & (u < a + h + r); d[m] = np.cos(.5 * np.pi * (u[m] - a - h) / r) ** 2
    return d


def ison_korosu(rg):
    """Döngü uzunluğunda, dairesel ison: 4 bas (Re2) + 8 tenor/bariton (Re3)."""
    n = ND; C = -(-n // H); t = np.arange(C) * H / SR; hiz = SR / H
    vokal = [(0, "o"), (11, "ɔ"), (22, "o"), (31, "a"), (40, "o"), (52, "u"), (60, "o")]
    sesler = [(RE3 / 2, .72, rg.uniform(-.35, .35)) for _ in range(4)] + [(RE3, 1.0, p) for p in np.linspace(-.55, .55, 8)]
    # nefesler sırayla: her tur her ses bir kez, olaylar eşit aralıklı → aynı anda en çok ~1 ses nefes alır
    tur = 5; ara = DONGU / (len(sesler) * tur)
    sira = np.concatenate([rg.permutation(len(sesler)) for _ in range(tur)])
    nefes = {j: [i * ara + rg.uniform(-.15, .15) * ara for i in np.where(sira == j)[0]] for j in range(len(sesler))}
    out = np.zeros((n, 2))
    for js, (temel, kaz, pan) in enumerate(sesler):
        sent = (rg.normal(0, 4) + periyodik_gurultu(C, .08, hiz, rg) * 5 + periyodik_gurultu(C, 9, hiz, rg) * 1.2
                + (6 + 3 * np.tanh(periyodik_gurultu(C, .1, hiz, rg))) * np.sin(2 * np.pi * round(rg.uniform(4.6, 5.6) * DONGU) / DONGU * t + rg.uniform(0, 6.3)))
        f0 = temel * 2 ** (ornek_hizina(sent, n, True) / 1200)
        dev = f0.sum() / SR; f0 *= round(dev) / dev           # tam sayıda periyot → döngü noktasında faz sürekli
        g = kaz * (1 + .1 * periyodik_gurultu(C, .25, hiz, rg))
        for tn in nefes[js]: g *= 1 - .97 * nefes_cukuru(t, tn, DONGU)
        F, B, G = formant_yolu(vokal, C, 1.8, True, olcek=rg.uniform(.96, 1.04), ref_f0=temel); g *= G
        y = ses_sentezi(f0, ornek_hizina(g, n, True), F, B, 1.2, rg, fmax=3600, dairesel=True, parlaklik=1.2)
        out += panla(y, pan)
    return out


# ───────────────────────── psaltis melodisi ─────────────────────────
P = {  # Re3 = 0 sent. 1. echos (Pa=Re) Chrysanthine diyatonik yaklaşımı + Hicaz (leitmotif iması)
    "Ni_": -200, "Pa": 0, "Vou": 167, "Ga": 300, "Di": 500, "Ke": 700, "Zo": 867, "Zo♭": 800, "Ni": 1000, "Pa2": 1200,
    "Mi♭": 115, "Fa♯": 385, "Si♭": 800}

CUMLELER = [  # (başlangıç sn, dinamik, [(perde, süre sn, vokal, süs)])  süs: sc = alttan yaklaşma, om = omalon, v = vibrato
    (1.2, .85, [("Pa", .9, "a", ""), ("Vou", .5, "e", ""), ("Ga", .7, "a", "sc"), ("Vou", .45, "e", ""), ("Pa", 2.3, "e", "v")]),
    (7.0, .95, [("Pa", .55, "o", ""), ("Ga", .6, "o", ""), ("Di", .85, "a", "sc"), ("Ke", 1.7, "a", "om"), ("Di", .5, "a", ""),
                ("Ke", .5, "o", ""), ("Zo♭", .45, "o", ""), ("Ke", 1.2, "o", "v"), ("Di", .6, "a", ""), ("Ga", .5, "a", ""), ("Di", 1.9, "a", "v")]),
    (17.4, 1.0, [("Ke", .7, "e", ""), ("Zo", .45, "e", ""), ("Ni", .6, "a", ""), ("Pa2", 1.6, "a", "sc"), ("Ni", .45, "a", ""), ("Zo", .4, "o", ""),
                 ("Ke", .9, "o", "om"), ("Zo", .5, "a", ""), ("Ni", .5, "a", ""), ("Pa2", .65, "a", ""), ("Ni", .45, "o", ""), ("Ke", 2.0, "o", "v")]),
    (28.0, .9, [("Di", .8, "ɔ", ""), ("Ke", .6, "ɔ", ""), ("Di", .5, "a", ""), ("Ga", .6, "a", ""), ("Vou", .7, "a", "om"), ("Ga", .5, "o", ""),
                ("Vou", .5, "o", ""), ("Pa", 2.7, "o", "v")]),
    # leitmotif iması: Hicaz başı, yavaş (♩≈0.9 sn): La – Si♭ – La – Sol – Fa♯ – Sol …
    (37.2, .8, [("Ke", .95, "a", "sc"), ("Si♭", .95, "a", ""), ("Ke", 1.8, "a", "v"), ("Di", .85, "o", ""), ("Fa♯", 1.15, "o", ""), ("Di", 1.4, "o", "v")]),
    # … ve diyatonik çözülme: Fa – Mi – Re
    (45.0, .85, [("Ga", .7, "a", ""), ("Vou", .95, "a", "om"), ("Pa", 2.2, "o", "v")]),
    (50.4, .9, [("Pa", .6, "a", ""), ("Vou", .5, "a", ""), ("Ga", 1.0, "e", "sc"), ("Vou", .5, "e", ""), ("Pa", .6, "a", ""), ("Ni_", 1.4, "o", "v"),
                ("Pa", .6, "o", ""), ("Vou", .55, "a", ""), ("Ga", .6, "a", ""), ("Di", 1.2, "a", "om"), ("Ga", .5, "o", ""), ("Vou", .5, "o", ""),
                ("Pa", 3.3, "u", "v")]),
]
KAPANIS_CUMLESI = [(.6, .75, [("Ga", .55, "a", ""), ("Vou", .8, "a", "om"), ("Pa", 3.0, "o", "v")])]
SIRA = ["Ni_", "Pa", "Vou", "Ga", "Di", "Ke", "Zo", "Ni", "Pa2"]


def psaltis(cumleler, n, rg, gecikme=0.0, olcek=1.0, sapma=0.0):
    """Tek ses: kontrol hızında perde (sent), genlik ve vokal yolları → formant sentezi.
    gecikme (sn), olcek (gırtlak boyu → formant ölçeği), sapma (sent): koro içindeki diğer psaltlar için."""
    C = -(-n // H); t = np.arange(C) * H / SR - gecikme; hiz = SR / H
    sent = np.full(C, np.nan); amp = np.zeros(C); vok = []; sus = np.zeros(C); kaz = np.zeros(C)
    son = 0.0
    for t0, dyn, notalar in cumleler:
        x = t0; t_end = t0 + sum(d for _, d, _, _ in notalar)
        m = (t >= t0 - .02) & (t < t_end + .5)
        # cümle zarfı: 0.25 sn yumuşak giriş, 0.35 sn çıkış
        e = np.clip((t - t0) / .25, 0, 1) * np.clip((t_end + .12 - t) / .35, 0, 1)
        amp = np.maximum(amp, np.where(m, np.sin(.5 * np.pi * e) ** 2 * dyn, 0))
        for j, (p, d, v, s) in enumerate(notalar):
            mm = (t >= x) & (t < x + d) if j < len(notalar) - 1 else (t >= x) & (t < t_end + .5)
            sent[mm] = P[p]; vok.append((x, v))
            u = t - x
            if d >= 1.4:                                       # uzun notada hafif şişip sönme
                kaz[mm] += .08 * np.sin(np.pi * np.clip(u[mm] / d, 0, 1))
            if j == len(notalar) - 1:                          # cümle sonu: hafifçe söner
                kaz[mm] -= .18 * np.clip(u[mm] / d, 0, 1)
            if s == "sc":                                      # alttan yaklaşma + hafif vurgu
                q = (u >= 0) & (u < .4); sus[q] += -75 * np.exp(-u[q] / .055); kaz[q] += .1 * np.exp(-u[q] / .15)
            if s == "om":                                      # omalon benzeri: üst komşuya 3 hafif salınım
                i = SIRA.index(p) if p in SIRA else 1
                ust = (P[SIRA[min(i + 1, len(SIRA) - 1)]] - P[p]) * .55
                q = (u >= .1) & (u < .1 + 3 / 6.2)
                sus[q] += ust * .5 * (1 - np.cos(2 * np.pi * 6.2 * (u[q] - .1))) * np.sin(np.pi * (u[q] - .1) / (3 / 6.2))
            if d >= 1.0 or s == "v":                           # gecikmeli vibrato
                q = mm & (u > .35); dv = (14 if s == "v" else 8) * np.clip((u[q] - .35) / .5, 0, 1)
                sus[q] += dv * np.sin(2 * np.pi * 5.3 * (u[q] - .35))
            if j > 0 and v != notalar[j - 1][2]:               # hece (vokal) değişiminde kısa yumuşak çukur
                q = np.abs(u) < .05; kaz[q] -= .3 * np.cos(.5 * np.pi * u[q] / .05) ** 2
            x += d
        son = max(son, t_end)
    # cümle aralarında perde: bir sonraki cümlenin ilk perdesi (girişte kayma olmasın)
    gecerli = np.where(~np.isnan(sent))[0]
    j = np.searchsorted(gecerli, np.arange(C)); j = np.minimum(j, len(gecerli) - 1)
    sent = np.where(np.isnan(sent), sent[gecerli[j]], sent)
    sent = yumusat(sent, .085 * hiz, False)[0] + sus + sapma + periyodik_gurultu(C, 7, hiz, rg) * 2.5 + periyodik_gurultu(C, .3, hiz, rg) * 3
    amp = amp * np.clip(1 + kaz, 0, 1.5)
    amp = yumusat(amp, .02 * hiz, False)[0]
    vok.sort()
    F, B, G = formant_yolu([(v_t + gecikme, v) for v_t, v in vok], C, .09, False, olcek=olcek, ref_f0=200.0); amp = amp * G
    egim = 1.2 - .2 * np.clip(amp / (amp.max() + 1e-9), 0, 1)    # gür yerde biraz daha parlak
    f0 = RE3 * 2 ** (ornek_hizina(sent, n, False) / 1200)
    a_s = ornek_hizina(amp, n, False)
    y = ses_sentezi(f0, a_s, F, B, egim, rg, fmax=3800, parlaklik=2.5)
    # nefes payı: formant bölgesinde süzülmüş, genliğe bağlı çok hafif hava gürültüsü
    hava = suz(rg.standard_normal(n), lo=450, hi=2200, n=2)
    y += hava / hava.std() * a_s * np.sqrt(np.mean(y ** 2)) / (np.sqrt(np.mean(a_s ** 2)) + 1e-9) * .05
    return y


def psaltis_korosu(cumleler, n, rg):
    """Bizans pratiğinde melos birkaç psalt tarafından unison söylenir: baş psalt + iki eşlikçi
    (−6 dB, 25–45 ms gecikme, ±5 sent, farklı gırtlak boyu). Hâlâ tek sesli (monofonik) bir çizgi."""
    y = panla(psaltis(cumleler, n, rg), .0)
    for gec, olc_, sap, pan in ((.028, 1.035, -5, -.35), (.043, .97, 4, .35)):
        y += panla(psaltis(cumleler, n, rg, gecikme=gec, olcek=olc_, sapma=sap), pan) * .5
    return y


# ───────────────────────── çanlar, yaylı yatak ─────────────────────────
def can_hazirla(yol, oran):
    """Kilise çanı: pes (oran), yumuşak saldırı (18 ms), tiz raf; uzak duyulsun diye koyu."""
    x = yukle(yol); x = yeniden_ornekle(x, oran)[: int(14 * SR)]
    f = int(4 * SR); x[-f:] *= np.cos(.5 * np.pi * np.arange(f) / f)[:, None] ** 2     # kuyruk 4 sn'de yumuşak biter
    x = np.concatenate([x, np.zeros((SR, 2))])
    x = tiz_raf(suz(x, lo=60, hi=1700, n=2), 700, -7)
    a = int(.018 * SR); x[:a] *= (np.sin(.5 * np.pi * np.arange(a) / a) ** 2)[:, None]
    return x / np.abs(x).max()


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


# ───────────────────────── üretim ─────────────────────────
def main():
    os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
    ir = oda_ir((3.0, 2.8, 2.3, 1.4, .8), rg=rng)
    ISLAK, ISLAK_CAN = .24, .60

    # — zemin: ison korosu + çok hafif yaylı yatak (dairesel) —
    koro = ison_korosu(rng); koro *= 10 ** ((-24 - rms_db(koro)) / 20)
    cello = yukle(ornek("VSCO-2-CE", "Strings/Cello Section/susvib/susvib_D2_v1_1.wav"))       # Re3 (VSCO adı bir oktav pes yazar)
    kbas = yukle(ornek("VSCO-2-CE", "Strings/Solo Contrabass/SusNV/BKCtbss_SusNV_D1_v1_rr1.wav"))  # Re2
    yay = doku_dongusu(cello, ND, 1.2, len(cello) / SR - 1.2, 4.2, 1.6, rng) * .6 + doku_dongusu(kbas, ND, 1.0, len(kbas) / SR - 1.5, 5.0, 1.8, rng)
    yay = suz(yay, hi=1400, n=2); yay *= 10 ** ((-37 - rms_db(yay)) / 20)
    zemin_kuru = koro + yay

    # — melodi (psaltis) —
    mel_ham = psaltis_korosu(CUMLELER, ND, rng)
    mel_g = 10 ** ((-25 - rms_db(mel_ham[int(1 * SR): int(62.5 * SR)])) / 20)   # cümlelerin sürdüğü bölümde −25 dB
    mel_kuru = mel_ham * mel_g

    # — ritim: uzak kilise çanları —
    can_re = can_hazirla(sfx("can/kilise_cani_D3"), .5)            # bir oktav pes → büyük çan
    can_la = can_hazirla(sfx("can/kilise_cani_C3"), 2 ** (-15 / 12))  # Do → La (1 oktav + 3 yarım ses pes)
    def pan_c(s, p): return s * np.array([np.sqrt(1 - p), np.sqrt(1 + p)])
    can_kuru = np.zeros((ND, 2))
    for t0, s, g, p in ((35.3, can_re, 1.0, -.35), (65.4, can_re, .95, -.3), (67.4, can_la, .6, .25)):
        ekle(can_kuru, t0, pan_c(s, p), g, dairesel=True)
    can_g = 10 ** ((-22 - 20 * np.log10(np.abs(can_kuru).max())) / 20)       # kuru çan tepesi −22 dBFS (karışım öncesi)
    can_kuru *= can_g

    # — döngü: dairesel yankı —
    zemin_C, _ = dairesel_yankila(zemin_kuru, ir, ISLAK)
    mel_C, mel_kuyruk = dairesel_yankila(mel_kuru, ir, ISLAK)
    can_C, can_kuyruk = dairesel_yankila(can_kuru, ir, ISLAK_CAN)

    # — giriş: döngünün son GIRIS saniyesi, katmana göre açılarak (motor GIRIS'te döngüye girer → kesintisiz) —
    def acilis(sure_s):
        u = np.clip(np.arange(NG) / (sure_s * SR), 0, 1); return (np.sin(.5 * np.pi * u) ** 2)[:, None]
    zemin_G = zemin_C[-NG:] * acilis(4.5)
    mel_G = mel_C[-NG:] * acilis(2.0)
    can_G = can_C[-NG:] * acilis(.3)

    # — kapanış: ison döngü başından devam edip söner; son kadans ve son çan doğrusal yankıyla —
    tk = np.arange(NK) / SR
    son_zarf = np.where(tk < 2.0, 1.0, np.cos(.5 * np.pi * np.clip((tk - 2.0) / 4.3, 0, 1)) ** 2)[:, None]
    zemin_K = zemin_C[:NK] * son_zarf
    mk = psaltis_korosu(KAPANIS_CUMLESI, NK, rng) * mel_g
    mel_K = yankila(mk, ir, ISLAK)[:NK] + np.pad(mel_kuyruk, ((0, max(0, NK - len(mel_kuyruk))), (0, 0)))[:NK]
    ck = np.zeros((NK, 2)); ekle(ck, .35, pan_c(can_re, -.2), .9 * can_g)
    can_K = yankila(ck, ir, ISLAK_CAN)[:NK] + np.pad(can_kuyruk, ((0, max(0, NK - len(can_kuyruk))), (0, 0)))[:NK]
    bitis = np.ones((NK, 1)); fz = int(.6 * SR); bitis[-fz:, 0] = np.cos(.5 * np.pi * np.arange(fz) / fz) ** 2
    mel_K *= bitis; can_K *= bitis; zemin_K *= bitis

    katman = {"zemin": np.concatenate([zemin_G, zemin_C, zemin_K]),
              "ritim": np.concatenate([can_G, can_C, can_K]),
              "melodi": np.concatenate([mel_G, mel_C, mel_K])}
    tam = sum(katman.values())
    g = 10 ** ((-20.0 - rms_db(tam)) / 20)
    tam *= g
    for k in katman: katman[k] *= g
    tepe = np.abs(tam).max()
    if tepe > 10 ** (-1.2 / 20):
        h = 10 ** (-1.2 / 20) / tepe; tam *= h
        for k in katman: katman[k] *= h

    # — vurgu (sting): koro "a→o→u" şişip söner + uzak çan, 5.5 sn —
    vurgu = sting(ir, can_re)

    # — yaz —
    dosyalar = {}
    for ad, x in [("tam", tam)] + list(katman.items()) + [("vurgu", vurgu)]:
        p = os.path.join(OUT, f"{ID}__{ad}.flac"); yaz_flac(p, x); dosyalar[ad] = p
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", dosyalar["tam"], "-c:a", "libmp3lame", "-b:a", "128k",
                    os.path.join(HERE, "onizleme.mp3")], check=True)

    # — ölç —
    dongu = [GIRIS, GIRIS + DONGU]
    olcum = {"tam": olc(tam, dongu, govde=dongu)}
    for ad in ("zemin", "ritim", "melodi"):
        o = olc(katman[ad]); olcum[ad] = {k: o[k] for k in ("rms_dbfs", "tepe_dbfs", "tiz_4k_ustu_oran", "konusma_1k5_4k_oran")}
    ov = olc(vurgu); olcum["vurgu"] = {k: ov[k] for k in ("rms_dbfs", "tepe_dbfs", "tiz_4k_ustu_oran", "konusma_1k5_4k_oran", "merkez_sicrama_maks_oktav")}
    olcum["katman_toplami_fark_db"] = round(rms_db(sum(katman.values()) - tam) - rms_db(tam), 1)
    # döngü testi: gövde iki kez arka arkaya → ek yerinde merkez sıçraması
    gov = tam[int(dongu[0] * SR): int(dongu[1] * SR)]
    olcum["tam"]["dongu"]["ek_yeri_merkez_sicrama_oktav"] = olc(np.concatenate([gov[-int(2 * SR):], gov[: int(2 * SR)]]))["merkez_sicrama_maks_oktav"]
    gorsel(tam, f"{ID}_tam", dongu); gorsel(vurgu, f"{ID}_vurgu")
    for ad in katman: gorsel(katman[ad], f"{ID}_{ad}", dongu)
    gorsel(np.concatenate([gov[-int(10 * SR):], gov[: int(10 * SR)]]), f"{ID}_dongu_eki", [10.0])

    kaynaklar = sorted(set(KULLANILAN))
    meta = {
        "id": ID, "ad": "Bizans ilahisi / Konstantinopolis",
        "tarz": "Bizans kilise müziği (psaltiki) yorumu: sürekli ison (Re) üzerinde serbest ritimli tek sesli psaltis melodisi, uzak kilise çanı, taş kubbe yankısı",
        "kullanim": ["Bizans sarayı ve imparator", "Konstantinopolis / Ayasofya şehir görüntüleri", "Bizanslı tarihçiler (Pakhymeres, Gregoras, Kantakuzenos) alıntıları",
                     "törensel anlar (Theodora'nın 1346 düğünü, taç giyme, antlaşma)", "Bizans tarafının bakış açısı / karşı taraf tanıtımı"],
        "donem": [1, 2],
        "ton_makam": "Re (Pa) üzerinde ison; Bizans 1. echos'una (Echos protos, diyatonik, Chrysanthine aralıklarına yaklaşık) yaklaşım; 37–49. sn'de (döngü içi) kısa Hicaz başı = leitmotif iması (Mi♭ +15, Fa♯ −15 sent)",
        "bpm": "serbest (psaltiki; hece birimi ≈ 0.5–0.9 sn, ♩≈60–66 hissi)", "usul_olcu": "serbest ritim (ölçüsüz)",
        "sure": round(len(tam) / SR, 2), "dongu": dongu, "dongu_ornek": [NG, NG + ND], "ornek_hizi": SR,
        "katmanlar": [{"ad": "zemin", "dosya": f"out/{ID}__zemin.flac", "icerik": "ison korosu (Re2+Re3, formant sentezi) + çok hafif çello/kontrbas Re"},
                      {"ad": "ritim", "dosya": f"out/{ID}__ritim.flac", "icerik": "vuruş YOK; seyrek uzak kilise çanları (döngüde 3 vuruş + kapanışta 1)"},
                      {"ad": "melodi", "dosya": f"out/{ID}__melodi.flac", "icerik": "tek sesli psaltis (sentez bariton), 1. echos + leitmotif iması"},
                      {"ad": "vurgu", "dosya": f"out/{ID}__vurgu.flac", "icerik": "5.5 sn kapanış: koro 'a-o-u' şişip söner + uzak Re çanı"}],
        "yogunluk": "dusuk", "olcumler": olcum,
        "kaynaklar": [f"{r}: {y}" for r, y in kaynaklar] + ["sentez: numpy toplamsal formant sesi (koro ve psaltis), oda yankısı"],
    }
    with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=1)
    print(json.dumps(olcum, ensure_ascii=False, indent=1))


def sting(ir, can_re):
    n = int(5.5 * SR); C = -(-n // H); t = np.arange(C) * H / SR; hiz = SR / H; r = np.random.default_rng(1346)
    zarf = np.sin(.5 * np.pi * np.clip(t / .7, 0, 1)) ** 2 * np.where(t < 2.6, 1, np.cos(.5 * np.pi * np.clip((t - 2.6) / 2.0, 0, 1)) ** 2)
    out = np.zeros((n, 2))
    for temel, kaz, pan in [(RE3 / 2, .75, p) for p in (-.3, 0, .3)] + [(RE3, 1.0, p) for p in np.linspace(-.5, .5, 5)]:
        sent = r.normal(0, 4) + periyodik_gurultu(C, .3, hiz, r) * 4 + 7 * np.sin(2 * np.pi * r.uniform(4.8, 5.5) * t + r.uniform(0, 6.3)) * np.clip(t / 1.2, 0, 1)
        f0 = temel * 2 ** (ornek_hizina(sent, n, False) / 1200)
        F, B, G = formant_yolu([(0, "a"), (2.0, "o"), (3.3, "u")], C, .6, False, olcek=r.uniform(.96, 1.04), ref_f0=temel)
        e = zarf * (1 + .08 * periyodik_gurultu(C, .5, hiz, r)) * kaz * G
        out += panla(ses_sentezi(f0, ornek_hizina(e, n, False), F, B, 1.2, r, fmax=3600), pan)
    out *= 10 ** ((-21 - rms_db(out[: int(3 * SR)])) / 20)
    # gövde: çello (Re3) + kontrbas (Re2) uzun notasının başı, şişip söner
    yay = np.zeros((n, 2))
    for yol, g_ in (("Strings/Cello Section/susvib/susvib_D2_v1_1.wav", .7), ("Strings/Solo Contrabass/SusNV/BKCtbss_SusNV_D1_v1_rr1.wav", 1.0)):
        a = yukle(ornek("VSCO-2-CE", yol))[:n]; yay[: len(a)] += a * g_
    tz = np.arange(n) / SR; yay *= (np.where(tz < 2.8, 1, np.cos(.5 * np.pi * np.clip((tz - 2.8) / 2.0, 0, 1)) ** 2))[:, None]
    yay = suz(yay, hi=1400, n=2); yay *= 10 ** ((-29 - rms_db(yay[: int(3 * SR)])) / 20)
    c = np.zeros((n, 2)); ekle(c, .05, can_re, 1.0); c *= 10 ** ((-21 - 20 * np.log10(np.abs(c).max())) / 20)
    y = yankila(out + yay, ir, .26)[:n] + yankila(c, ir, .6)[:n]
    fz = int(.5 * SR); y[-fz:] *= (np.cos(.5 * np.pi * np.arange(fz) / fz) ** 2)[:, None]
    y *= 10 ** ((-1.5 - 20 * np.log10(np.abs(y).max())) / 20) if 20 * np.log10(np.abs(y).max()) > -1.5 else 1
    return y


if __name__ == "__main__":
    main()
