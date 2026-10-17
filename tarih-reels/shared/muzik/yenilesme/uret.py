#!/usr/bin/env python3
"""yenilesme – "Yenileşme / Avrupa ile karşılaşma (18.–20. yy)" (Osmanlı serisi müzik kütüphanesi)

Lale Devri, matbaa, Nizam-ı Cedid, Tanzimat, Avrupa diplomasisi, 1876, 1908; serinin geç sezonları.
Batı oda müziği ile Türk makamının karşılaşması: klavsen (VCSL, "lute" registeri) düzenli bir Alberti figürüyle başlar,
solo keman galant bir cümle söyler; kanun benzeri telli (VCSL Đàn tranh örnekleri) ve Karplus-Strong ud, ortak
leitmotifi Re Hicaz'da cevaplar. İki dünya sohbet eder, sonra Napoliten/Hicaz kadansında buluşur (E♭ → D).
Son bölümde yumuşak askerî trampet ve alçak yaylı ostinatosu ile 1914'e doğru ciddileşir. ♩ = 96, 4/4 (ölçü 2.5 sn).

Çalıştırma : python3 tarih-reels/shared/muzik/yenilesme/uret.py
Çıktı      : out/yenilesme__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, stereo, 24 bit), onizleme.mp3, meta.json
Gereken    : numpy, ffmpeg; CC0 örnek klonları (VCSL, VSCO-2-CE; yol VCSL_DIR / VSCO_DIR ile değiştirilebilir).
             Eksik örnek dosyaları kısmi klondan git ile kendiliğinden indirilir.
Deterministik: sabit tohum; aynı girdiyle aynı çıktı.
Döngü      : gövde dairesel işlenir (uzayan notalar ve yankı kuyrukları gövde başına katlanır) → meta.json'daki
             dongu = [bas_sn, son_sn] aralığı örnek düzeyinde kesintisiz tekrar eder. Giriş kendi müziğidir
             (klavsen + pedal) ve son 1 sn'de gövdenin sonuna (yumuşak Re pedalı) çapraz geçer.
"""
import json, os, subprocess, sys, time
import numpy as np

ID = "yenilesme"
HERE = os.path.dirname(os.path.abspath(__file__))
SHARED = os.path.abspath(os.path.join(HERE, "..", ".."))           # tarih-reels/shared
SFX = os.path.join(SHARED, "sfx")
OUT = os.path.join(HERE, "out")
TMP = f"/tmp/claude-0/muzik-{ID}"
REPOS = {"VCSL": os.environ.get("VCSL_DIR", "/tmp/claude-0/sfx/VCSL"),
         "VSCO-2-CE": os.environ.get("VSCO_DIR", "/tmp/claude-0/sfx/VSCO-2-CE")}
SR = 44100
RNG = np.random.default_rng(1839)          # Tanzimat Fermanı
os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)

# =====================================================================================
# 1) Örnekler
# =====================================================================================
USED = {}   # kullanılan harici örnekler → KAYNAKLAR.tsv


def fetch(repo, path):
    """Kısmi klondaki dosyayı (gerekirse git checkout ile) indirir; index kilitliyse blob'u doğrudan yazar."""
    full = os.path.join(REPOS[repo], path)
    USED[(repo, path)] = True
    if os.path.exists(full) and os.path.getsize(full) > 1000:
        return full
    for _ in range(20):
        r = subprocess.run(["git", "-C", REPOS[repo], "checkout", "HEAD", "--", path], capture_output=True)
        if r.returncode == 0 and os.path.exists(full):
            return full
        time.sleep(1.0)
    blob = subprocess.run(["git", "-C", REPOS[repo], "show", f"HEAD:{path}"], capture_output=True, check=True).stdout
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "wb") as f:
        f.write(blob)
    return full


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def fmask(n, lo=None, hi=None, order=2):
    f = np.fft.rfftfreq(n, 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    if hi: m *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    return m


def filt(x, lo=None, hi=None, order=2):
    """FFT ile sıfır fazlı Butterworth-benzeri süzgeç (stereo ya da mono)."""
    n = len(x); m = fmask(n, lo, hi, order)
    if x.ndim == 1:
        return np.fft.irfft(np.fft.rfft(x) * m, n)
    return np.fft.irfft(np.fft.rfft(x, axis=0) * m[:, None], n, axis=0)


class Smp:
    """Tek bir örnek: baştaki sessizlik kırpılır, sürdürme bölümünün RMS'i 0.1'e (−20 dBFS) eşitlenir."""

    def __init__(self, x, f0, kind="sus", lo=None, hi=None, name=""):
        env = np.abs(x).max(1)
        thr = env.max() * 10 ** (-50 / 20)
        i0 = max(0, int(np.argmax(env > thr)) - int(.003 * SR))
        x = x[i0:]
        if lo or hi:
            x = filt(x, lo, hi)
        h = int(.05 * SR)
        sm = np.sqrt(np.convolve((x ** 2).mean(1), np.ones(h) / h, "same"))
        ref = np.percentile(sm[: int(len(sm) * .8)], 90)
        self.t70 = float(np.argmax(sm > .7 * ref) / SR)                   # sürdürme düzeyine ulaşma zamanı
        last = len(sm) - int(np.argmax(sm[::-1] > .5 * ref))               # sürdürmenin bittiği yer
        self.loop_s = int((self.t70 + .3) * SR)
        self.loop_e = max(self.loop_s + int(2.5 * SR), last - int(.3 * SR))
        if kind == "sus":
            seg = x[int(self.t70 * SR): int((self.t70 + 2.0) * SR)]
        else:                                                               # vuruşlu / telli: ilk 0.4 sn
            seg = x[: int(.4 * SR)]
        x = x / (np.sqrt((seg ** 2).mean()) + 1e-12) * .1
        self.x, self.f0, self.kind, self.name = x, f0, kind, name
        self._ext = {}

    def uzat(self, need):
        """Uzun notalar için sürdürme bölümünü eşit güçlü çapraz geçişlerle döngüler (deterministik)."""
        x = self.x
        if len(x) >= need:
            return x
        key = need // SR
        if key in self._ext and len(self._ext[key]) >= need:
            return self._ext[key]
        rng = np.random.default_rng(int(self.f0 * 10) + key)
        seg, xf = int(1.8 * SR), int(.45 * SR)
        ls, le = self.loop_s, min(self.loop_e, len(x))
        if le - ls < seg + xf:
            ls = max(0, le - seg - xf - 1)
        out = x[:le].copy()
        w = np.sin(np.linspace(0, np.pi / 2, xf)) [:, None]
        while len(out) < need:
            s = int(rng.integers(ls, max(ls + 1, le - seg)))
            piece = x[s: s + seg]
            out[-xf:] = out[-xf:] * w[::-1] + piece[:xf] * w
            out = np.concatenate([out, piece[xf:]])
        self._ext[key] = out
        return out


class Bank:
    def __init__(self, items, **kw):
        self.s = [Smp(load(fetch(r, p) if r != "sfx" else os.path.join(SFX, p)), f0, name=p, **kw) for r, p, f0 in items]

    def pick(self, f):
        return min(self.s, key=lambda s: abs(np.log2(f / s.f0)))


NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
KOMA = {3: +15.0, 6: -15.0}   # Hicaz rengi: E♭ ≈ +15 sent, F♯ ≈ −15 sent (bkz. BRIEF)


def hz(n):
    if not isinstance(n, str):
        return float(n)
    letter, rest, acc = n[0], n[1:], 0
    while rest and rest[0] in "#b":
        acc += 1 if rest[0] == "#" else -1
        rest = rest[1:]
    midi = 12 * (int(rest) + 1) + NOTE[letter] + acc
    return 440.0 * 2 ** ((midi - 69) / 12 + KOMA.get(midi % 12, 0.0) / 1200)


def cubic(x, pos):
    """Catmull-Rom ara değerleme ile x'i (stereo) kesirli konumlarda okur."""
    i = np.floor(pos).astype(np.int64)
    f = (pos - i)[:, None]
    xp = np.concatenate([x[:1], x, np.zeros((4, x.shape[1]))])
    i = np.clip(i + 1, 1, len(xp) - 3)
    y0, y1, y2, y3 = xp[i - 1], xp[i], xp[i + 1], xp[i + 2]
    return y1 + .5 * f * (y2 - y0 + f * (2 * y0 - 5 * y1 + 4 * y2 - y3 + f * (3 * (y1 - y2) + y3 - y0)))


def nota(bank, p, dur, vel=1.0, att=.15, rel=.5, skip=0.0, swell=0.0):
    """Örnekten nota: perdeye yeniden örnekleme, yumuşak atak (sin²), bırakış (cos²), isteğe bağlı kabarma (dB)."""
    f = hz(p)
    s = bank.pick(f)
    r = f / s.f0
    if skip == "sus":
        skip = max(0.0, s.t70 - .05)
    elif skip == "half":
        skip = s.t70 * .6
    n = int((dur + rel) * SR)
    st = int(skip * SR)
    src = s.uzat(st + int(n * r) + 16)
    y = cubic(src, st + np.arange(n) * r)
    env = np.ones(n)
    na = max(1, min(n, int(att * SR)))
    env[:na] = np.sin(np.linspace(0, np.pi / 2, na)) ** 2
    nd = min(n, int(dur * SR))
    if n > nd:
        env[nd:] *= np.cos(np.linspace(0, np.pi / 2, n - nd)) ** 2
    if swell:
        u = np.clip(np.arange(n) / max(1, nd), 0, 1)
        env *= 10 ** (swell * np.sin(np.pi * u) / 20)
    return y * env[:, None] * vel


def vurus(smp, vel=1.0, rate=1.0, att_ms=4.0, length=None):
    """Vuruşlu örnek: isteğe bağlı perde oranı, ≥4 ms yumuşatılmış atak."""
    x = smp.x
    if rate != 1.0:
        n = int(len(x) / rate)
        x = cubic(x, np.arange(n) * rate)
    if length:
        x = x[: int(length * SR)].copy()
        k = min(len(x), int(.25 * SR))
        x[-k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None] ** 2
    else:
        x = x.copy()
    na = int(att_ms / 1000 * SR)
    x[:na] *= np.sin(np.linspace(0, np.pi / 2, na))[:, None] ** 2
    return x * vel


# =====================================================================================


def pluck(bank, p, vel=1.0, length=1.6, att_ms=3.0, tail=.25):
    """Telli/klavsen örneği: perdeye yeniden örnekleme, doğal sönüm, `length` sn sonra yumuşak susturma."""
    f = hz(p)
    s = bank.pick(f)
    r = f / s.f0
    n = int((length + tail) * SR)
    src = s.x if len(s.x) > int(n * r) + 8 else np.concatenate([s.x, np.zeros((int(n * r) + 16 - len(s.x), 2))])
    y = cubic(src, np.arange(n) * r)
    na = max(1, int(att_ms / 1000 * SR))
    y[:na] *= np.sin(np.linspace(0, np.pi / 2, na))[:, None] ** 2
    k = int(tail * SR)
    y[-k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None] ** 2
    return y * vel


UD_CACHE = {}


def ud(p, vel=1.0, length=1.8, bright=2400.0, t60=2.0):
    """Karplus-Strong ud: mızrap benzeri yumuşak gürültü darbesi (tutuş noktası tarağı), üç uçlu kayıp süzgeci
    (naylon/bağırsak tel sıcaklığı), perde düzeltmesi için yeniden örnekleme, gövde rezonansları (≈ 110/240/480 Hz), ≥ 4 ms atak."""
    key = (p, length, bright, t60)
    if key not in UD_CACHE:
        f = hz(p)
        P = int(round(SR / f))
        n = int((length + .3) * SR)
        rng = np.random.default_rng(int(f * 100))
        j = np.arange(P) / P                                             # telin ilk biçimi: tutuş noktasında üçgen
        tri = np.where(j < .27, j / .27, (1 - j) / .73) - .5
        exc = tri + .7 * filt(rng.uniform(-1, 1, P * 2), hi=bright, order=1)[:P]
        exc = exc - exc.mean()
        y = np.zeros(n + P + 2)
        y[2: P + 2] = exc
        rho = 10 ** (-3 * P / (t60 * SR))
        k = 1
        while k * P + 2 < len(y):
            a, b = k * P + 2, min(len(y), (k + 1) * P + 2)
            y[a:b] += rho * (.15 * y[a - P + 1: b - P + 1] + .7 * y[a - P: b - P] + .15 * y[a - P - 1: b - P - 1])
            k += 1
        y = y[2: n + 2]
        r = f * P / SR                                                      # tamsayı gecikme → tam perde
        y = cubic(np.stack([y, y], 1), np.arange(int(n / r) - 4) * r)[:, 0]
        tb = np.arange(int(.12 * SR)) / SR
        body = np.zeros(len(tb)); body[0] = 1.0
        for fr, dec, pk in ((110, .014, 1.0), (240, .010, .8), (480, .007, .5), (1000, .004, .25)):   # tepe kazancı ≈ 1+pk
            body += pk * 2 / (dec * SR) * np.sin(2 * np.pi * fr * tb) * np.exp(-tb / dec)
        nf = 1 << (len(y) + len(body)).bit_length()
        y = np.fft.irfft(np.fft.rfft(y, nf) * np.fft.rfft(body, nf), nf)[: len(y)]
        y = filt(y, lo=45, hi=3000, order=2)
        na = int(.004 * SR)
        y[:na] *= np.sin(np.linspace(0, np.pi / 2, na)) ** 2
        m = int(.25 * SR)
        y[-m:] *= np.cos(np.linspace(0, np.pi / 2, m)) ** 2
        y = y / (np.sqrt((y[: int(.4 * SR)] ** 2).mean()) + 1e-12) * .1
        UD_CACHE[key] = np.stack([y, y], 1)
    return UD_CACHE[key] * vel


# =====================================================================================
# 2) Zaman çizelgesi, bölümler, katmanlar
# =====================================================================================
BEAT = 60 / 96                          # ♩ = 96
BAR, E8, S16 = 4 * BEAT, BEAT / 2, BEAT / 4
A_SEC, L_SEC, O_SEC = 2 * BAR, 28 * BAR, 7.0   # giriş 5 sn · gövde 70 sn (döngü) · kapanış 7 sn
XF = 1.0                                 # giriş → gövde sonu çapraz geçiş (sn)
TAIL = 12.0
SEC = {"giris": A_SEC + 1.0, "govde": L_SEC, "kapanis": O_SEC, "vurgu": 5.0}
STEMS = ["zemin", "ritim", "melodi"]
BUF = {}


def buf(sec, stem, grp):
    k = (sec, stem, grp)
    if k not in BUF:
        BUF[k] = np.zeros((int((SEC[sec] + TAIL) * SR), 2))
    return BUF[k]


def put(sec, stem, grp, t, sig, gain=1.0, pan=0.0):
    b = buf(sec, stem, grp)
    i = int(round(max(0.0, t) * SR))
    if i >= len(b):
        return
    th = (pan + 1) * np.pi / 4
    g = np.array([np.cos(th), np.sin(th)]) * np.sqrt(2) * gain
    sig = sig[: len(b) - i]
    b[i: i + len(sig)] += sig * g


def T(bar, beat=0.0):
    """Gövde içi zaman: bar 1'den başlar, beat = çeyrek nota (0–3)."""
    return (bar - 1) * BAR + beat * BEAT


def hum(ms=8.0):
    return float(RNG.uniform(-ms, ms)) / 1000.0


def legato(sec, stem, grp, bank, seq, vel=1.0, att0=.5, ovl=.35, rel_end=.9, pan=0.0, swell=0.0, vjit=1.0, skip0=.02, jit=8.0):
    """Legato hat: seq = [(t, dur, perde, vel_çarpanı)]. Bitişik notalar `ovl` sn eşit genlikli çapraz geçişle bağlanır
    (önceki nota t_k'da bırakır, sonraki t_k'da atak yapar; döngü sınırında da aynı geçiş katlanmayla oluşur)."""
    for k, (t, d, p, v) in enumerate(seq):
        nxt = seq[k + 1] if k + 1 < len(seq) else None
        prv = seq[k - 1] if k > 0 else None
        tied_in = prv is not None and abs(prv[0] + prv[1] - t) < 1e-3
        tied_out = nxt is not None and abs(t + d - nxt[0]) < 1e-3
        a = ovl if tied_in else att0
        r = ovl if tied_out else rel_end
        g = vel * v * 10 ** (float(RNG.uniform(-vjit, vjit)) / 20)
        sig = nota(bank, p, d, g, att=a, rel=r, skip="sus" if tied_in else skip0, swell=swell)
        put(sec, stem, grp, t + (0 if tied_in else hum(jit)), sig, 1.0, pan)


def line(events, max_len=2 * BAR):
    """[(t, dur, perde)] → aynı perdeli bitişik notaları birleştir (en çok max_len; uzun notalar yeniden yaylanır)."""
    out = []
    for t, d, p in events:
        if p is None:
            continue
        if out and out[-1][2] == p and abs(out[-1][0] + out[-1][1] - t) < 1e-6 and out[-1][1] + d <= max_len + 1e-6:
            out[-1] = (out[-1][0], out[-1][1] + d, p, 1.0)
        else:
            out.append((t, d, p, 1.0))
    return out


def curve(points, sec):
    """[(zaman_sn, dB)] doğrusal ara değerleme → kazanç dizisi; gövdede dairesel (t mod L)."""
    n = int((SEC[sec] + TAIL) * SR)
    t = np.arange(n) / SR
    if sec == "govde":
        t = np.mod(t, L_SEC)
    xs, ys = zip(*points)
    return 10 ** (np.interp(t, xs, ys) / 20)


# =====================================================================================
# 3) Ortak oda (kısa, sıcak yankı ~1.8 sn, %20 ıslak) – serinin diğer tarzlarıyla aynı mekân
# =====================================================================================
def oda_ir(seed=1453):
    rng = np.random.default_rng(seed)
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal((n, 2))
    F = np.fft.rfft(nz, axis=0)
    f = np.fft.rfftfreq(n, 1 / SR)
    ir = np.zeros((n, 2))
    edges = [(0, 450, 2.0), (450, 2200, 1.7), (2200, 5000, 1.1), (5000, SR / 2, .6)]   # (alt, üst, RT60)
    for lo, hi, rt in edges:
        m = np.ones_like(f)
        if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
        if hi < SR / 2: m *= 1 / (1 + (f / hi) ** 4)
        ir += np.fft.irfft(F * m[:, None], n, axis=0) * np.exp(-6.91 * t / rt)[:, None]
    ir *= (1 - np.exp(-t / .006))[:, None]
    ir /= np.sqrt((ir ** 2).sum(0) / .85)
    pre = int(.012 * SR)
    ir = np.concatenate([np.zeros((pre, 2)), ir])
    for d, g in ((.004, .16), (.009, .13), (.014, .11), (.021, .09), (.029, .07)):
        ir[int(d * SR), 0] += g
        ir[int((d + .0023) * SR), 1] += g
    ir = filt(ir, hi=7000)
    return ir / np.sqrt((ir ** 2).sum(0)).mean()


IR = oda_ir()
WET = .20


def reverb(x):
    n = len(x) + len(IR)
    nf = 1 << (n - 1).bit_length()
    xin = np.stack([.75 * x[:, 0] + .25 * x[:, 1], .75 * x[:, 1] + .25 * x[:, 0]], 1)
    X = np.fft.rfft(xin, nf, axis=0)
    H = np.fft.rfft(IR, nf, axis=0)
    wet = np.fft.irfft(X * H, nf, axis=0)[: len(x)]
    return (1 - WET) * x + WET * wet




# =====================================================================================
# 4) Çalgılar
# =====================================================================================
V, C = "VSCO-2-CE", "VCSL"
HL = "Chordophones/Zithers/Harpsichord, English/Sustains/Lute/ZuckermannKitHarpsi_Lute_Sus_{}_rr1.wav"
# VCSL klavsen adları gerçek perdenin bir oktav altıdır (ölçülen f0 kullanılır)
KLAVSEN = Bank([(C, HL.format(n), f) for n, f in (("D1", 73.39), ("E1", 82.35), ("F#1", 92.56), ("G#1", 103.54), ("A#1", 116.27),
                                                   ("D2", 146.68), ("E2", 165.43), ("F#2", 185.00), ("G#2", 208.05), ("A#2", 233.41),
                                                   ("C3", 261.53), ("D3", 293.54), ("E3", 330.05), ("F#3", 370.31), ("G#3", 415.36),
                                                   ("A#3", 469.13), ("C4", 525.94))], kind="hit", hi=4200)
DT = "Chordophones/Zithers/Dan Tranh/{}/{}.wav"
KANUN = Bank([(C, DT.format("Normal", n + "_f_1"), f) for n, f in (("D#2", 157.63), ("F#2", 185.57), ("G#2", 209.57), ("B2", 248.03),
                                                                    ("C#3", 285.30), ("D#3", 312.33), ("F#3", 368.31), ("G#3", 413.58),
                                                                    ("B3", 493.02), ("C#4", 553.67))], kind="hit", hi=2500)
KTREM = Bank([(C, DT.format("Tremolo", n + "_Trem_1"), f) for n, f in (("D#3", 314.77), ("F#3", 372.44), ("B3", 492.27))], kind="sus", hi=2200)
SOLO = Bank([(V, f"Strings/Solo Violin/Arco Vib/LLVln_ArcoVib_{n}_p.wav", f) for n, f in (("G3", 195.65), ("A3", 220.28), ("C4", 265.46),
                                                                                        ("E4", 330.59), ("G4", 391.20), ("A4", 441.65), ("C5", 522.92))], hi=5000)
CELLO = Bank([(V, "Strings/Cello Section/susvib/susvib_G1_v1_1.wav", 97.92),
              (V, "Strings/Cello Section/susvib/susvib_B1_v1_1.wav", 123.55),
              (V, "Strings/Cello Section/susvib/susvib_D2_v1_1.wav", 147.04),
              (V, "Strings/Cello Section/susvib/susvib_F2_v1_1.wav", 174.61),
              (V, "Strings/Cello Section/susvib/susvib_A2_v1_1.wav", 219.85),
              (V, "Strings/Cello Section/susvib/susvib_C3_v1_1.wav", 261.52)], hi=7000)
VIOLA = Bank([(V, "Strings/Viola Section/susvib/ViolaEns_susvib_D2_v1_1.wav", 146.81),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_E2_v1_1.wav", 164.86),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_G2_v1_1.wav", 195.92),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_B2_v1_1.wav", 246.84),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_D3_v1_1.wav", 293.55),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_F3_v1_1.wav", 349.31),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_A3_v1_1.wav", 440.07)], hi=7000)
VIOLIN = Bank([(V, "Strings/Violin Section/susVib/VlnEns_susVib_D3_v1.wav", 293.86),
               (V, "Strings/Violin Section/susVib/VlnEns_susVib_F#3_v1.wav", 370.16),
               (V, "Strings/Violin Section/susVib/VlnEns_susVib_A3_v1.wav", 439.18),
               (V, "Strings/Violin Section/susVib/VlnEns_susVib_C4_v1.wav", 523.03)], hi=6500)
BASS = Bank([(V, "Strings/Solo Contrabass/SusVib/BKCtbss_SusVib_D1_v3_rr1.wav", 73.39),
             (V, "Strings/Solo Contrabass/SusVib/BKCtbss_SusVib_A1_v1_rr1.wav", 110.04)], hi=3000)
SN = "Membranophones/Struck Membranophones/Legacy Snares/drum3_marching/snare3_{}.wav"
SNARE = [Smp(load(fetch(C, SN.format(n))), 200.0, kind="hit", lo=90, hi=2600) for n in ("p_rr1", "p_rr2", "p_rr3", "p_rr4")]
SNARE_PP = [Smp(load(fetch(C, SN.format(n))), 200.0, kind="hit", lo=90, hi=2600) for n in ("pp_rr1", "pp_rr2")]
DEF_DUM = Smp(load(os.path.join(SFX, "ritim/def_buyuk.flac")), 78.3, kind="hit", hi=2500)
DEF_TEK = Smp(load(os.path.join(SFX, "ritim/def_kucuk.flac")), 107.7, kind="hit", hi=2500)
DEF_KA = Smp(load(os.path.join(SFX, "ritim/def_boguk.flac")), 94.5, kind="hit", hi=2500)

ALB = {  # klavsen: sağ el Alberti üçlüsü (alt, orta, üst), sol el bas (1. yarı, 2. yarı)
    "Dm": (("D4", "F4", "A4"), ("D3", "A2")), "Gm": (("D4", "G4", "Bb4"), ("Bb2", "D3")),
    "A7": (("C#4", "E4", "G4"), ("A2", "E3")), "A": (("C#4", "E4", "A4"), ("A2", "E3")),
    "Bb": (("D4", "F4", "Bb4"), ("Bb2", "F3")), "D": (("D4", "F#4", "A4"), ("D3", "A2")),
    "Eb": (("Eb4", "G4", "Bb4"), ("Eb3", "Bb2")), "Cm": (("C4", "Eb4", "G4"), ("C3", "G2"))}
PAD = {  # yaylı zemin: çello, viyola alt, viyola üst
    "Dm": ("D3", "F3", "A3"), "Gm": ("Bb2", "G3", "D4"), "A7": ("A2", "G3", "C#4"), "A": ("A2", "E3", "C#4"),
    "Bb": ("Bb2", "F3", "D4"), "D": ("D3", "F#3", "A3"), "Eb": ("Eb3", "G3", "Bb3"), "Cm": ("C3", "G3", "Eb4"),
    "D5": ("D3", "A3", "D4"), "Di": ("D3", "A3", None), "Eb/D": ("D3", "G3", "Eb4")}


def alberti(sec, t_bar, chords, vel=1.0, halves=(0, 1)):
    """Klavsen Alberti figürü (sekizlikler: alt–üst–orta–üst) + sol el bas; her yarım ölçüye bir akor."""
    for h in halves:
        rh, lh = ALB[chords[h]]
        t0 = t_bar + h * 2 * BEAT
        for i, p in enumerate((rh[0], rh[2], rh[1], rh[2], rh[0], rh[2], rh[1], rh[2])[:4]):
            v = vel * (1.0 if i == 0 else .74 + .06 * (i == 2)) * (1.0 if h == 0 else .93)
            put(sec, "zemin", "klavsen", t0 + i * E8 + hum(5), pluck(KLAVSEN, p, v, length=.85), 1.0, .2)
        put(sec, "zemin", "klavsen", t0 + hum(4), pluck(KLAVSEN, lh[h], vel * .5, length=1.5), 1.0, -.1)


def arpej(sec, t, notes, vel=1.0, gap=.035, length=2.2):
    for i, p in enumerate(notes):
        put(sec, "zemin", "klavsen", t + i * gap, pluck(KLAVSEN, p, vel * (1 - .04 * i), length=length), 1.0, -.1 + .06 * i)


def kanun(sec, t, p, vel=1.0, length=1.3, pan=.25):
    put(sec, "melodi", "kanun", t + hum(5), pluck(KANUN, p, vel, length=length), 1.0, pan)


def kanun_trem(sec, t, p, dur, vel=1.0, pan=.25):
    put(sec, "melodi", "kanun", t + hum(4), nota(KTREM, p, dur, vel, att=.04, rel=.35), 1.0, pan)


def udn(sec, t, p, vel=1.0, length=1.6, pan=-.3):
    put(sec, "melodi", "ud", t + hum(6), ud(p, vel, length), 1.0, pan)


def snare(sec, t, vel=1.0, pp=False, pan=.08):
    pool = SNARE_PP if pp else SNARE
    put(sec, "ritim", "trampet", t + hum(4), vurus(pool[int(RNG.integers(len(pool)))], vel, att_ms=6), 1.0, pan)


def snare_roll(sec, t0, dur, v0, v1, step=S16 / 2):
    k = int(round(dur / step))
    for i in range(k):
        u = i / max(1, k - 1)
        snare(sec, t0 + i * step, (v0 + (v1 - v0) * u) * (1.0 if i % 2 == 0 else .82), pp=True)


def defs(sec, t_bar, vel=1.0, fill=False):
    """Sofyan usulüne yaklaşım (4/4): Düm (1) – Tek (3) – Ka (4); her ikinci ölçüde hafif 'te-ke' süslemesi."""
    put(sec, "ritim", "def", t_bar + hum(5), vurus(DEF_DUM, vel), 1.0, -.15)
    put(sec, "ritim", "def", t_bar + 2 * BEAT + hum(5), vurus(DEF_TEK, vel * .55), 1.0, .2)
    put(sec, "ritim", "def", t_bar + 3 * BEAT + hum(5), vurus(DEF_KA, vel * .5), 1.0, .1)
    if fill:
        put(sec, "ritim", "def", t_bar + 3.5 * BEAT + hum(5), vurus(DEF_KA, vel * .3), 1.0, .25)


# =====================================================================================
# 5) Düzenleme – gövde (28 ölçü, 4/4)
# =====================================================================================
PROG = ("Dm Dm  Gm Gm  A7 A7  Dm Dm  Bb Bb  Gm A "                      # 1–6   Batı: klavsen + oda yaylıları
        "D5 D5  D5 D5  D5 D5  D5 D5  D5 D5  D5 D5 "                      # 7–12  Doğu cevabı: kanun/ud, Re–La isonu
        "Dm Dm  Gm A7  D5 D5  D5 D5  D D  Gm Eb  D D  Eb D "             # 13–20 sohbet → Napoliten/Hicaz buluşması
        "Dm Dm  Gm Cm  D5 D5  Dm Dm  Gm Eb  D5 D5 "                      # 21–26 ciddileşme (trampet, ostinato)
        "D5 D5  D5 D5").split()                                          # 27–28 geri çekiliş, Re pedalı
assert len(PROG) == 56
S = "govde"
# --- zemin: yaylı akorları (çello, viyola ×2); çello 21–26'da ostinato/leitmotife geçer
for v, (bank, vv, pan) in enumerate([(CELLO, .46, -.2), (VIOLA, .30, .1), (VIOLA, .26, .3)]):
    ev = []
    for k, c in enumerate(PROG):
        bar = k // 2 + 1
        p = PAD[c][v]
        if v == 0 and 21 <= bar <= 26:
            p = None
        ev.append((k * 2 * BEAT, 2 * BEAT, p))
    legato(S, "zemin", "yay", bank, line(ev), vel=vv, att0=.8, ovl=.3, rel_end=1.0, pan=pan)
# --- zemin: kontrbas – Doğu bölümünde Re isonu, sonda Re pedalı
legato(S, "zemin", "bas", BASS, [(T(7), 2 * BAR, "D2", 1.0), (T(9), 2 * BAR, "D2", 1.0), (T(11), 2 * BAR, "D2", 1.0)], vel=.42, att0=1.0, ovl=.5, rel_end=1.2)
legato(S, "zemin", "bas", BASS, [(T(15), 2 * BAR, "D2", 1.0)], vel=.34, att0=.8, rel_end=1.0)
legato(S, "zemin", "bas", BASS, [(T(27), 2 * BAR, "D2", 1.0)], vel=.42, att0=.3, rel_end=.9)
# --- zemin: klavsen Alberti figürü (Batı) – 1–6, 13–14, 17–20 (sentez)
KV = {1: .5, 2: .56, 3: .58, 4: .58, 5: .58, 6: .6, 13: .58, 14: .6, 17: .42, 18: .42, 19: .4, 20: .48}
for bar, vel in KV.items():
    alberti(S, T(bar), PROG[2 * (bar - 1): 2 * bar], vel)
alberti(S, T(28), ("A7", "A7"), .4)                         # uzaktan dönen klavsen: A7 → (döngü) Dm
# --- zemin: alçak ostinato (21–26) – kontrbas + çello sekizlikleri (détaché)
ACC = [1.0, .58, .78, .6, .92, .58, .8, .66]
for bar in range(21, 27):
    for i in range(8):
        t = T(bar) + i * E8
        put(S, "zemin", "ostinato", t + hum(4), nota(BASS, "D2", .2, .55 * ACC[i], att=.02, rel=.14, skip=.25), 1.0, -.1)
        put(S, "zemin", "ostinato", t + hum(4), nota(CELLO, "D3", .19, .32 * ACC[i], att=.02, rel=.12, skip=.3), 1.0, .05)

# --- melodi: solo keman galant cümlesi (3–6): sorulan Batı sorusu, C♯ ile yarım kadans
VL = [(3, 0, 2, "A4"), (3, 2, 1, "G4"), (3, 3, 1, "E4"), (4, 0, 2, "F4"), (4, 2, 1, "E4"), (4, 3, 1, "D4"),
      (5, 0, 1, "D4"), (5, 1, 1, "F4"), (5, 2, 2, "Bb4"), (6, 0, 1, "A4"), (6, 1, 1, "G4"), (6, 2, 1, "E4"), (6, 3, 1, "C#4")]
legato(S, "melodi", "keman", SOLO, [(T(b, s), d * BEAT, p, 1.0 if s == 0 else .9) for b, s, d, p in VL],
       vel=.55, att0=.12, ovl=.1, rel_end=.7, pan=-.2, skip0="half", swell=1.0)
# --- melodi: Doğu cevabı – kanunda leitmotif (7–9), sonra Hicaz cümlesi (10–12); ud bir oktav aşağıdan heterofoni
KM = [(7, 0, "A4", 1, False), (7, 1, "Bb4", 1, False), (7, 2, "A4", 2, True), (8, 0, "G4", 1, False), (8, 1, "F#4", 1, False),
      (8, 2, "G4", 1, False), (8, 3, "Eb4", 1, False), (9, 0, "D4", 3, True),
      (10, 0, "D4", .5, False), (10, .5, "Eb4", .5, False), (10, 1, "F#4", .5, False), (10, 1.5, "G4", .5, False), (10, 2, "A4", 1, False),
      (10, 3, "Bb4", .5, False), (10, 3.5, "A4", .5, False), (11, 0, "G4", 1, False), (11, 1, "F#4", .5, False), (11, 1.5, "G4", .5, False),
      (11, 2, "Eb4", 1, False), (11, 3, "D4", 1, False), (12, 0, "D4", 2, True), (12, 2, "C4", 1, False), (12, 3, "D4", 1.6, False)]
for b, s, p, d, trem in KM:
    if trem:
        kanun_trem(S, T(b, s), p, d * BEAT - .05, .23)
    else:
        kanun(S, T(b, s), p, .45 if s % 1 == 0 else .38, length=max(.5, d * BEAT + .35))
UDM = [(7, 0, "D2", .45), (7, 0, "A3", .5), (7, 1, "Bb3", .45), (7, 2, "A3", .5), (8, 0, "G3", .5), (8, 1, "F#3", .45), (8, 2, "G3", .45),
       (8, 3, "Eb3", .5), (9, 0, "D3", .55), (9, 2, "A2", .35), (10, 0, "D2", .45), (10, 2, "A2", .35), (11, 0, "D2", .45), (11, 2, "G2", .35),
       (12, 0, "D3", .5), (12, 2, "C3", .45), (12, 3, "D3", .5)]
for b, s, p, v in UDM:
    udn(S, T(b, s) + .025, p, v * .85, length=1.4 if p[-1] == "2" else 1.1)
# --- sohbet (13–20): klavsen soruyor (13–14), kanun cevaplıyor (15–16), ud ekliyor; 17–19 keman leitmotifi makamla söylüyor
for i, p in enumerate(("D4", "Eb4", "F#4", "G4", "A4", "G4", "F#4", "Eb4")):
    kanun(S, T(15, i * .5), p, .58 if i % 2 == 0 else .48, length=.7)
kanun_trem(S, T(16), "D4", 2 * BEAT - .05, .23)
udn(S, T(15), "D2", .55, 1.6)
for i, p in enumerate(("G3", "F#3", "Eb3", "D3")):
    udn(S, T(16, 2 + i * .5), p, .55 - .03 * i, 1.0)
MOT = [(0, 1, "A4"), (1, 1, "Bb4"), (2, 2, "A4"), (4, 1, "G4"), (5, 1, "F#4"), (6, 1, "G4"), (7, 1, "Eb4"), (8, 3, "D4")]
legato(S, "melodi", "keman", SOLO, [(T(17) + s * BEAT, d * BEAT, p, 1.0) for s, d, p in MOT], vel=.55, att0=.15, ovl=.12, rel_end=.9,
       pan=-.2, skip0="half", swell=1.5)
for s, d, p in MOT:                                    # kanun: bir oktav aşağıdan heterofoni (süslü, yumuşak)
    q = p[:-1] + "3"
    kanun(S, T(17) + s * BEAT + .03, q, .38, length=d * BEAT + .3, pan=.3)
    if d >= 2:
        kanun(S, T(17) + (s + 1) * BEAT + .03, q, .26, length=d * BEAT, pan=.3)
for bar in (17, 18, 19):
    udn(S, T(bar), "D2", .45, 1.5)
for i, p in enumerate(("G4", "F#4", "Eb4", "D4")):     # 20: iki dünya aynı kadansta: klavsen E♭ → D, kanun/ud Hicaz inişi
    kanun(S, T(20, i), p, .5, length=.9 if i < 3 else 1.8)
    udn(S, T(20, i) + .02, p[:-1] + "3", .42, 1.2)
# --- ciddileşme (21–26): leitmotif çellolarda, sonra kemanlar + çellolar oktav
legato(S, "melodi", "cello", CELLO, [(T(21) + s * BEAT, d * BEAT, p[:-1] + "3", 1.0) for s, d, p in MOT], vel=.5, att0=.3, ovl=.15,
       rel_end=.8, pan=-.15, swell=1.5)
legato(S, "melodi", "cello", CELLO, [(T(24) + s * BEAT, d * BEAT, p[:-1] + "3", 1.0) for s, d, p in MOT], vel=.5, att0=.25, ovl=.15,
       rel_end=1.0, pan=-.15, swell=1.5)
legato(S, "melodi", "keman", VIOLIN, [(T(24) + s * BEAT, d * BEAT, p, 1.0) for s, d, p in MOT], vel=.38, att0=.3, ovl=.15,
       rel_end=1.0, pan=.25, skip0="half", swell=2.0)
# --- ritim: Sofyan (def) 7–12, 15–20; askerî trampet 21–27
for bar in range(7, 13):
    defs(S, T(bar), .5, fill=bar % 2 == 0)
for bar in range(15, 21):
    defs(S, T(bar), .42 if bar < 17 else .34, fill=bar % 2 == 0)
PAT = [(0, 1.0), (2, .42), (4, .66), (8, .9), (10, .42), (12, .52), (13, .58), (14, .66)]
for bar in range(21, 27):
    pat = PAT if bar >= 23 else [(0, 1.0), (8, .8)] if bar == 21 else [(0, 1.0), (4, .6), (8, .85), (12, .55)]
    for pos, v in pat:
        snare(S, T(bar) + pos * S16, .8 * v)
snare_roll(S, T(26, 3), BEAT, .35, .6)                      # 26 sonu: kısa kresendo rulosu
snare_roll(S, T(27), 3 * BEAT, .55, .08)                    # 27: diminuendo rulosu → sessizlik
B = lambda bar: (bar - 1) * BAR
DYN = {
    ("zemin", "yay"): [(B(1), -3), (B(6.5), -2.5), (B(7), -.5), (B(12.5), -.5), (B(13), -3), (B(17), -2), (B(21), -2), (B(24), -.5), (B(26), 0), (B(27), -1.5), (B(28), -3), (B(29), -3)],
    ("zemin", "ostinato"): [(B(1), -40), (B(20.9), -40), (B(21), -11), (B(23), -6), (B(25), -2.5), (B(26), -1.5), (B(27), -8), (B(28), -40), (B(29), -40)],
    ("ritim", "trampet"): [(B(1), -40), (B(20.9), -40), (B(21), -12), (B(23), -8), (B(25), -4), (B(26), -2), (B(27), -3), (B(28), -40), (B(29), -40)],
    ("ritim", "def"): [(B(1), -40), (B(6.9), -40), (B(7), -4), (B(12), -4), (B(15), -5), (B(17), -9), (B(21), -40), (B(29), -40)],
}

# =====================================================================================
# 6) Giriş (kendi müziği): klavsen tek başına Dm → A7, altında yumuşak Re–La pedalı (gövdenin 28. ölçüsüyle aynı A7'ye geçer)
# =====================================================================================
S = "giris"
alberti(S, 0.0, ("Dm", "Dm"), .52)
alberti(S, BAR, ("A7", "A7"), .46)
legato(S, "zemin", "yay", CELLO, [(0, 6.0, "D3", 1.0)], vel=.30, att0=1.5, rel_end=1.0, pan=-.2)
legato(S, "zemin", "yay", VIOLA, [(0, 6.0, "A3", 1.0)], vel=.18, att0=1.8, rel_end=1.0, pan=.1)
legato(S, "zemin", "bas", BASS, [(0, 6.0, "D2", 1.0)], vel=.26, att0=1.8, rel_end=1.0)
DYN_G = {}

# =====================================================================================
# 7) Kapanış: E♭/D → Re, çellolarda leitmotifin son iki notası, trampet rulosu ve tek vuruş
# =====================================================================================
S = "kapanis"
for v, (bank, vv, pan) in enumerate([(CELLO, .40, -.2), (VIOLA, .30, .1), (VIOLA, .26, .3)]):
    seq = line([(0, 2 * BEAT, PAD["Eb/D"][v]), (2 * BEAT, 4.3, PAD["D5"][v])], max_len=10)
    legato(S, "zemin", "yay", bank, seq, vel=vv, att0=.3, ovl=.3, rel_end=1.4, pan=pan)
legato(S, "zemin", "bas", BASS, [(0, 5.6, "D2", 1.0)], vel=.42, att0=.3, rel_end=1.4)
legato(S, "melodi", "cello", CELLO, [(0, 2 * BEAT, "Eb3", .95), (2 * BEAT, 4.2, "D3", 1.0)], vel=.5, att0=.3, ovl=.15, rel_end=1.4, pan=-.15, swell=1.0)
snare_roll(S, 0.0, 2 * BEAT - S16 / 2, .12, .5)
snare(S, 2 * BEAT, .62)
DYN_K = {("zemin", "yay"): [(0, -3), (2, -4), (7, -7)], ("ritim", "trampet"): [(0, -4), (7, -4)]}

# =====================================================================================
# 8) Vurgu (sting, 4.6 sn): trampet rulosu + E♭/D kabarması → klavsen D majör arpeji, kanun Re tremolosu
# =====================================================================================
S = "vurgu"
snare_roll(S, 0.0, 1.2, .1, .55)
snare(S, 1.25, .7)
for v, (bank, vv, pan) in enumerate([(CELLO, .42, -.2), (VIOLA, .32, .1), (VIOLA, .28, .3)]):
    seq = line([(0, 1.25, PAD["Eb/D"][v]), (1.25, 2.3, PAD["D"][v])], max_len=10)
    legato(S, "zemin", "yay", bank, seq, vel=vv, att0=.6, ovl=.25, rel_end=1.0, pan=pan, swell=1.0)
legato(S, "zemin", "bas", BASS, [(1.25, 2.3, "D2", 1.0)], vel=.45, att0=.08, rel_end=1.0)
arpej(S, 1.25, ("D2", "A2", "D3", "F#3", "A3", "D4"), .6, gap=.03, length=2.4)
kanun_trem(S, 1.3, "D4", 2.0, .5)
udn(S, 1.25, "D2", .5, 2.0)


# =====================================================================================
# 9) Montaj: giriş (kendi müziği, son 1 sn'de gövde sonuna çapraz geçer) + dairesel gövde + kapanış
# =====================================================================================
def section_stem(sec, stem, dyn):
    out = np.zeros((int((SEC[sec] + TAIL) * SR), 2))
    for (s, st, g), b in BUF.items():
        if s != sec or st != stem:
            continue
        x = b.copy()
        if (st, g) in dyn:
            x *= curve(dyn[(st, g)], sec)[:, None]
        out += x
    return reverb(out)


GRP_RMS = {}
for (s_, st_, g_), b_ in BUF.items():
    if s_ == "govde":
        y_ = b_[: int(L_SEC * SR)] * (curve(DYN[(st_, g_)], s_)[: int(L_SEC * SR), None] if (st_, g_) in DYN else 1)
        GRP_RMS[f"{st_}/{g_}"] = np.sqrt((y_ ** 2).mean())
nA, nL, nO = int(round(A_SEC * SR)), int(round(L_SEC * SR)), int(round(O_SEC * SR))
N = nA + nL + nO
STEM = {}
for stem in STEMS:
    yb = section_stem("govde", stem, DYN)
    bc = yb[:nL].copy()
    bc[: len(yb) - nL] += yb[nL:][: nL]                                     # kuyrukları gövde başına katla (döngü)
    yi = section_stem("giris", stem, DYN_G)
    yk = section_stem("kapanis", stem, DYN_K)
    x = np.zeros((N, 2))
    u = np.clip((np.arange(nA) / SR - (A_SEC - XF)) / XF, 0, 1)
    x[:nA] = yi[:nA] * np.cos(np.pi / 2 * u)[:, None] + bc[nL - nA:] * np.sin(np.pi / 2 * u)[:, None]
    fi = int(.02 * SR)
    x[:fi] *= np.linspace(0, 1, fi)[:, None]
    x[nA: nA + nL] = bc
    x[nA + nL:] = yb[nL: nL + nO] + yk[:nO]                                 # gövde kuyruğu doğrusal devam eder
    fo = int(2.0 * SR)
    x[N - fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 2)[:, None]
    STEM[stem] = x
FULL = sum(STEM.values())
STING = sum(section_stem("vurgu", st, {}) for st in STEMS)[: int(4.6 * SR)]
k = int(.6 * SR)
STING[-k:] *= (np.cos(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]

# seviye: RMS −20 dBFS, tepe ≤ −1 dBFS (tüm katmanlara aynı kazanç → katmanların toplamı tam miksi verir)
rms = np.sqrt((FULL ** 2).mean())
G = 10 ** (-20 / 20) / rms
pk = np.abs(FULL).max() * G
if pk > 10 ** (-1.2 / 20):
    G *= 10 ** (-1.2 / 20) / pk
for s in STEMS:
    STEM[s] *= G
FULL = FULL * G
srms = np.sqrt((STING[: int(3.5 * SR)] ** 2).mean())
STING *= min(10 ** (-18 / 20) / srms, 10 ** (-1.2 / 20) / np.abs(STING).max())

# =====================================================================================
# 10) Ölçümler
# =====================================================================================
def db(v):
    return float(20 * np.log10(max(v, 1e-12)))


def olc(x, loop=None):
    m = x.mean(1)
    res = {"rms_dbfs": round(db(np.sqrt((x ** 2).mean())), 2), "tepe_dbfs": round(db(np.abs(x).max()), 2),
           "kirpilma_ornek": int((np.abs(x) >= .999).sum())}
    nf, hop = 8192, 4096
    win = np.hanning(nf)
    P = np.zeros(nf // 2 + 1)
    for i in range(0, len(m) - nf, hop):
        P += np.abs(np.fft.rfft(m[i: i + nf] * win)) ** 2
    f = np.fft.rfftfreq(nf, 1 / SR)
    res["tiz_4k_ustu_oran"] = round(float(P[f > 4000].sum() / P.sum()), 4)
    res["konusma_1k5_4k_oran"] = round(float(P[(f >= 1500) & (f <= 4000)].sum() / P.sum()), 4)
    w = int(.25 * SR)
    win = np.hanning(w)
    f = np.fft.rfftfreq(w, 1 / SR)
    band = (f >= 20) & (f <= 20000)
    cents, levels = [], []
    for i in range(0, len(m) - w + 1, w):
        seg = m[i: i + w]
        lv = db(np.sqrt((seg ** 2).mean()))
        Pw = np.abs(np.fft.rfft(seg * win)) ** 2
        cents.append(float((f[band] * Pw[band]).sum() / max(Pw[band].sum(), 1e-20)))
        levels.append(lv)
    cents, levels = np.array(cents), np.array(levels)
    ok = levels > -45
    jumps = [abs(np.log2(cents[i + 1] / cents[i])) for i in range(len(cents) - 1) if ok[i] and ok[i + 1]]
    res["merkez_hz_ortanca"] = round(float(np.median(cents[ok])), 1)
    res["merkez_sicrama_max_oktav"] = round(float(max(jumps)), 3) if jumps else 0.0
    res["merkez_sicrama_p99_oktav"] = round(float(np.percentile(jumps, 99)), 3) if jumps else 0.0
    if loop:
        a, b = loop
        q = int(.25 * SR)
        d_seam = np.abs(x[a] - x[b - 1]).max()
        d_typ = np.median(np.abs(np.diff(x[a: b], axis=0)).max(1))
        d_p999 = np.percentile(np.abs(np.diff(x[a: b], axis=0)).max(1), 99.9)
        res["dongu"] = {"dalga_sicrama": round(float(d_seam), 6), "dalga_sicrama_tipik": round(float(d_typ), 6),
                        "dalga_sicrama_p99_9": round(float(d_p999), 6),
                        "rms_fark_db": round(db(np.sqrt((x[b - q: b] ** 2).mean())) - db(np.sqrt((x[a: a + q] ** 2).mean())), 2),
                        "rms_fark_1sn_db": round(db(np.sqrt((x[b - SR: b] ** 2).mean())) - db(np.sqrt((x[a: a + SR] ** 2).mean())), 2)}
        lv = np.array([db(np.sqrt((x[i: i + q] ** 2).mean())) for i in range(a, b - q, q)])
        res["dongu"]["govde_250ms_rms_ardisik_max_fark_db"] = round(float(np.abs(np.diff(lv)).max()), 2)
    return res


LOOP = (nA, nA + nL)
M = olc(FULL, LOOP)
M["katmanlar_rms_dbfs"] = {s: round(db(np.sqrt((STEM[s] ** 2).mean())), 2) for s in STEMS}
M["katman_toplam_hata_max"] = float(np.abs(sum(STEM.values()) - FULL).max())
_ref = np.sqrt((FULL[LOOP[0]: LOOP[1]] ** 2).mean()) / G
M["grup_seviye_db_govdeye_gore"] = {k: round(db(v / _ref), 1) for k, v in sorted(GRP_RMS.items())}
M["vurgu"] = olc(STING)
print(json.dumps(M, ensure_ascii=False, indent=1))




# =====================================================================================
# 11) Yazma
# =====================================================================================
def flac(path, x):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                    "-c:a", "flac", "-sample_fmt", "s32", "-bits_per_raw_sample", "24", path],
                   input=np.clip(x, -1, 1).astype(np.float32).tobytes(), check=True)


flac(os.path.join(OUT, f"{ID}__tam.flac"), FULL)
for s in STEMS:
    flac(os.path.join(OUT, f"{ID}__{s}.flac"), STEM[s])
flac(os.path.join(OUT, f"{ID}__vurgu.flac"), STING)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, f"{ID}__tam.flac"), "-c:a", "libmp3lame", "-b:a", "128k",
                os.path.join(HERE, "onizleme.mp3")], check=True)
for nm, src in (("spektrogram", f"{ID}__tam.flac"), ("spektrogram_vurgu", f"{ID}__vurgu.flac")):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, src), "-lavfi",
                    "showspectrumpic=s=1400x700:legend=1:fscale=log:scale=log:stop=12000", os.path.join(TMP, nm + ".png")], check=True)

SFX_USED = ("ritim/def_buyuk.flac", "ritim/def_kucuk.flac", "ritim/def_boguk.flac")
meta = {
    "id": ID,
    "ad": "Yenileşme – Avrupa ile karşılaşma (18.–20. yy)",
    "tarz": "Batı oda müziği (klavsen Alberti figürü, solo keman, yaylı continuo) ile Türk makamının (kanun benzeri telli, ud, Sofyan usulü) sohbeti; Napoliten/Hicaz kadansında buluşma; yumuşak askerî trampetle 1914'e doğru ciddileşen kapanış",
    "kullanim": ["reform anlatıları (Lale Devri, matbaa, Nizam-ı Cedid, Tanzimat, Islahat)", "elçilikler ve Avrupa diplomasisi",
                 "saray–Avrupa ilişkileri, Batılılaşma tartışmaları", "Kanun-i Esasi 1876, II. Meşrutiyet 1908", "geç dönem haritaları",
                 "Bölüm 1914'e giriş (ciddileşen son bölüm ve kapanış)"],
    "donem": [5, 6, 7, 8],
    "ton_makam": "Re (D) merkezli; Batı bölümleri Re minör (C♯ yeden, A7 → Dm), Doğu bölümleri Re Hicaz (E♭–F♯; 12-TET + koma: E♭ +15 sent, F♯ −15 sent); buluşma: E♭ majör (Napoliten = Hicaz'ın 2. derecesi) → D",
    "bpm": 96,
    "usul_olcu": "4/4 (♩ = 96, ölçü 2.5 sn); Doğu bölümlerinde def ile Sofyan usulüne yaklaşım (Düm–Tek–Ka), son bölümde askerî trampet kalıbı",
    "sure": round(N / SR, 2),
    "dongu": [round(LOOP[0] / SR, 3), round(LOOP[1] / SR, 3)],
    "katmanlar": ["zemin", "ritim", "melodi"],
    "katman_aciklama": {"zemin": "klavsen Alberti figürü ve arpejleri, oda yaylıları (çello + viyolalar), kontrbas Re isonu, son bölümde kontrbas/çello sekizlik ostinatosu",
                        "ritim": "def ile Sofyan usulü (ölçü 7–12, 15–20), yumuşak askerî trampet (21–27; 27'de diminuendo rulosu)",
                        "melodi": "solo keman galant cümlesi ve leitmotif (makamla), kanun benzeri tellide leitmotif + Hicaz cümlesi + tremolo, Karplus-Strong ud heterofonisi, son bölümde çellolar/kemanlar leitmotif"},
    "vurgu": f"out/{ID}__vurgu.flac (4.6 sn: trampet rulosu + E♭/D kabarması → klavsen D majör arpeji, kanun Re tremolosu, ud)",
    "yogunluk": "orta",
    "olcumler": M,
    "kaynaklar": sorted({f"{r}: {p}" for (r, p) in USED} | {"shared/sfx: " + ", ".join(p[:-5] for p in SFX_USED), "sentez: Karplus-Strong ud (numpy)"}),
}
with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=1)
with open(os.path.join(HERE, "KAYNAKLAR.tsv"), "w", encoding="utf-8") as f:
    f.write("dosya\tdepo\tyol\tlisans\n")
    for (r, p) in sorted(USED):
        f.write(f"{os.path.basename(p)}\thttps://github.com/sgossner/{r}\t{p}\tCC0 1.0 (kamu malı)\n")
    for p in SFX_USED:
        f.write(f"{os.path.basename(p)}\ttarih-reels/shared/sfx (kaynağı katalog.json'da: VCSL)\tshared/sfx/{p}\tCC0 1.0 (kamu malı)\n")
print("tamam:", OUT, f"{N / SR:.1f} sn, döngü {LOOP[0] / SR:.2f}–{LOOP[1] / SR:.2f} sn")
