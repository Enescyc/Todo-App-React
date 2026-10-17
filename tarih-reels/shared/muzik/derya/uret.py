#!/usr/bin/env python3
"""derya – "Derya / Deniz ve keşif" (Osmanlı serisi müzik kütüphanesi)

Gelibolu'ya geçiş, Boğazlar, Barbaros ve Preveze, Akdeniz kıyı şehirleri için geniş ve ferah bir zemin.
6/8 salınım (♪ = 144 → ♩ ≈ 72, ♩. = 48; bir ölçü 2.5 sn), Re merkezli açık beşliler (D–A), yaylı ensemble legato,
kornoda serinin ortak leitmotifi (Re Hicaz) geniş ve uzun notalarla; çok alçak seviyede deniz dokusu.

Çalıştırma : python3 tarih-reels/shared/muzik/derya/uret.py
Çıktı      : out/derya__{tam,zemin,ritim,melodi,vurgu}.flac (44.1 kHz, stereo, 24 bit), onizleme.mp3, meta.json
Gereken    : numpy, ffmpeg; CC0 örnek klonları (VCSL, VSCO-2-CE; yol VCSL_DIR / VSCO_DIR ile değiştirilebilir).
             Eksik örnek dosyaları kısmi klondan git ile kendiliğinden indirilir.
Deterministik: sabit tohum; aynı girdiyle aynı çıktı.
Döngü      : gövde dairesel (döngüsel) işlenir; uzayan notalar ve yankı kuyrukları gövde başına katlanır →
             meta.json'daki dongu = [bas_sn, son_sn] aralığı örnek düzeyinde kesintisiz tekrar eder.
"""
import json, os, subprocess, sys, time
import numpy as np

ID = "derya"
HERE = os.path.dirname(os.path.abspath(__file__))
SHARED = os.path.abspath(os.path.join(HERE, "..", ".."))           # tarih-reels/shared
SFX = os.path.join(SHARED, "sfx")
OUT = os.path.join(HERE, "out")
TMP = f"/tmp/claude-0/muzik-{ID}"
REPOS = {"VCSL": os.environ.get("VCSL_DIR", "/tmp/claude-0/sfx/VCSL"),
         "VSCO-2-CE": os.environ.get("VSCO_DIR", "/tmp/claude-0/sfx/VSCO-2-CE")}
SR = 44100
RNG = np.random.default_rng(1354)          # Gelibolu'ya geçiş
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
# 2) Zaman çizelgesi, bölümler, katmanlar
# =====================================================================================
BAR, BT = 2.5, 1.25                      # 6/8: ölçü = iki büyük vuruş (♩.)
A_SEC, L_SEC, O_SEC = 2 * BAR, 28 * BAR, 7.0   # giriş 5 sn · gövde 70 sn (döngü) · kapanış 7 sn
TAIL = 12.0
SEC = {"giris": A_SEC, "govde": L_SEC, "kapanis": O_SEC, "vurgu": 5.0}
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
    """Gövde içi zaman: bar 1'den başlar, beat = büyük vuruş (♩.)."""
    return (bar - 1) * BAR + beat * BT


def hum(ms=8.0):
    return float(RNG.uniform(-ms, ms)) / 1000.0


def legato(sec, stem, grp, bank, seq, vel=1.0, att0=.5, ovl=.35, rel_end=.9, pan=0.0, swell=0.0, vjit=1.0, skip0=.02):
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
        put(sec, stem, grp, t + (0 if tied_in else hum()), sig, 1.0, pan)


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


def wave(sec, depth=2.0, beat_depth=.6, phase=1.25):
    """Deniz dalgası gibi kabarma: 2 ölçülük (5 sn) salınım + her büyük vuruşta hafif 6/8 sallanması (dB)."""
    n = int((SEC[sec] + TAIL) * SR)
    t = np.arange(n) / SR
    db = depth * np.sin(2 * np.pi * (t - phase) / (2 * BAR) - np.pi / 2) + beat_depth * np.cos(2 * np.pi * t / BT)
    return 10 ** (db / 20)


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
V = "VSCO-2-CE"
CELLO = Bank([(V, "Strings/Cello Section/susvib/susvib_G1_v1_1.wav", 97.92),
              (V, "Strings/Cello Section/susvib/susvib_B1_v1_1.wav", 123.55),
              (V, "Strings/Cello Section/susvib/susvib_D2_v1_1.wav", 147.04),
              (V, "Strings/Cello Section/susvib/susvib_F2_v1_1.wav", 174.61),
              (V, "Strings/Cello Section/susvib/susvib_A2_v1_1.wav", 219.85),
              (V, "Strings/Cello Section/susvib/susvib_C3_v1_1.wav", 261.52)], hi=7500)
VIOLA = Bank([(V, "Strings/Viola Section/susvib/ViolaEns_susvib_G2_v1_1.wav", 195.92),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_B2_v1_1.wav", 246.84),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_D3_v1_1.wav", 293.55),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_F3_v1_1.wav", 349.31),
              (V, "Strings/Viola Section/susvib/ViolaEns_susvib_A3_v1_1.wav", 440.07)], hi=7500)
VIOLIN = Bank([(V, "Strings/Violin Section/susVib/VlnEns_susVib_D3_v1.wav", 293.86),
               (V, "Strings/Violin Section/susVib/VlnEns_susVib_F#3_v1.wav", 370.16),
               (V, "Strings/Violin Section/susVib/VlnEns_susVib_A3_v1.wav", 439.18),
               (V, "Strings/Violin Section/susVib/VlnEns_susVib_C4_v1.wav", 523.03)], hi=7000)
BASS = Bank([(V, "Strings/Solo Contrabass/SusVib/BKCtbss_SusVib_D1_v3_rr1.wav", 73.39),
             (V, "Strings/Solo Contrabass/SusVib/BKCtbss_SusVib_A1_v1_rr1.wav", 110.04)], hi=3000)
HORN = Bank([("sfx", "muzik/korno_D2.flac", 146.20),                          # shared/sfx (VSCO F Horn sus D2 v2)
             ("sfx", "muzik/korno_A2.flac", 219.97),                          # shared/sfx (VSCO F Horn sus A2 v2)
             (V, "Brass/F Horn/sus/MOHorn_sus_F2_v2_1.wav", 173.97),
             (V, "Brass/F Horn/sus/MOHorn_sus_C3_v2_1.wav", 261.55),
             (V, "Brass/F Horn/sus/MOHorn_sus_A#1_v2_1.wav", 116.50)], hi=6000)
TIMP = Smp(load(fetch(V, "Percussion/Timpani/Rolls/Timpani3_Roll_v3_rr1_Sum.wav")), 141.6, kind="sus", hi=3000)
DEF_DUM = Smp(load(os.path.join(SFX, "ritim/def_buyuk.flac")), 78.3, kind="hit", hi=2500)
DEF_TEK = Smp(load(os.path.join(SFX, "ritim/def_boguk.flac")), 94.5, kind="hit", hi=2500)
DEF_KUC = Smp(load(os.path.join(SFX, "ritim/def_kucuk.flac")), 107.7, kind="hit", hi=2200)
SEA = [filt(load(os.path.join(SFX, f"doga/deniz_{k}.flac")), lo=90, hi=900, order=2) for k in (1, 2)]
for k in range(2):
    SEA[k] /= np.sqrt((SEA[k] ** 2).mean()) / .1


def timp_roll(sec, t, dur, pitch="D3", peak=1.0, rise=.6):
    """Timpani rulosu: kresendo (rise oranında) → diminuendo; ≥ 0.3 sn yumuşak başlangıç."""
    r = hz(pitch) / TIMP.f0
    n = int(dur * SR)
    src = TIMP.uzat(int(.4 * SR + n * r) + 32)
    y = cubic(src, .4 * SR + np.arange(n) * r)
    u = np.arange(n) / n
    env = np.where(u < rise, np.sin(np.pi / 2 * u / rise) ** 2, np.cos(np.pi / 2 * (u - rise) / (1 - rise)) ** 2)
    put(sec, "ritim", "timpani", t, y * env[:, None] * peak)


# =====================================================================================
# 5) Düzenleme (gövde: 28 ölçü 6/8)
# =====================================================================================
#         çello alt, çello üst, viyola alt, viyola üst, keman
CH = {"D5": ("D3", "A3", "D4", "A4", "A4"),
      "D": ("D3", "A3", "D4", "F#4", "A4"),
      "G/D": ("D3", "G3", "B3", "D4", "G4"),
      "Gm/D": ("D3", "G3", "Bb3", "D4", "G4"),
      "Eb/D": ("D3", "G3", "Bb3", "Eb4", "G4"),
      "C/D": ("D3", "G3", "C4", "E4", "G4")}
# her büyük vuruş için akor (28 ölçü × 2)
PROG = ("D5 D5  D5 D5  G/D G/D  D5 D5 "            # 1–4   kıyı: açık beşli, ferah G
        "D D  Eb/D Eb/D  C/D C/D  D D "             # 5–8   ilk dalga: Hicaz'a göz kırpan E♭/D, umutlu C/D
        "D5 Gm/D  D D  Gm/D D  Eb/D Eb/D  D D  D D "  # 9–14  kornoda leitmotif
        "G/D G/D  D D  C/D C/D  D5 D5 "            # 15–18 açık deniz
        "D5 Gm/D  D D  Gm/D D  Eb/D Eb/D  D D  D D "  # 19–24 leitmotif II (keman + korno oktav)
        "D D  Eb/D Eb/D  D5 D5  D5 D5").split()     # 25–28 dinginleşme, dönüş
assert len(PROG) == 56
VIOLA_ON = lambda bar: bar >= 3
VIOLIN_ON = lambda bar: bar in (13, 14, 23, 24, 25, 26)

S = "govde"
# --- zemin: kontrbas pedalı (her 2 ölçüde yeniden yaylanır)
legato(S, "zemin", "bas", BASS, [(T(b), 2 * BAR, "D2", 1.0) for b in range(1, 29, 2)], vel=.55, att0=.6, ovl=.6)
# --- zemin: yaylı akorları (5 ses)
for v, (bank, on, vv, pan) in enumerate([(CELLO, lambda b: True, .50, -.25), (CELLO, lambda b: True, .42, -.10),
                                          (VIOLA, VIOLA_ON, .34, .12), (VIOLA, VIOLA_ON, .30, .28), (VIOLIN, VIOLIN_ON, .22, .35)]):
    ev = []
    for k, c in enumerate(PROG):
        bar = k // 2 + 1
        ev.append((k * BT, BT, CH[c][v] if on(bar) else None))
    legato(S, "zemin", "yay", bank, line(ev), vel=vv, att0=.9, ovl=.4, rel_end=1.0, pan=pan)
# --- zemin: deniz dokusu (çok düşük; her 2 ölçüde bir dalga)
for k in range(14):
    src = SEA[k % 2]
    off = int(((k * 2.3) % 5.5) * SR)
    n = int(7.5 * SR)
    seg = src[off: off + n] * (np.sin(np.pi * np.arange(n) / n) ** 2)[:, None]
    put(S, "zemin", "deniz", k * 2 * BAR, seg, .17, pan=.3 if k % 2 else -.3)

# --- melodi: viyola karşı ezgisi (ölçü 5–8): A3–B♭3–G3–F♯3 → leitmotifin büyütülmüş gölgesi
legato(S, "melodi", "viyola", VIOLA, [(T(5), BAR, "A3", 1.0), (T(6), BAR, "Bb3", 1.05), (T(7), BAR, "G3", 1.0), (T(8), BAR, "F#3", .9)],
       vel=.55, att0=.8, ovl=.35, rel_end=1.2, pan=.15, swell=1.5)
# --- melodi: kornoda leitmotif (ölçü 9–14): A B♭ | A | G F♯ | G E♭ | D (4 vuruş)
MOTIF = [(0, 1, "A"), (1, 1, "Bb"), (2, 2, "A"), (4, 1, "G"), (5, 1, "F#"), (6, 1, "G"), (7, 1, "Eb"), (8, 4, "D")]
VEL_M = [.9, 1.0, .95, .9, .85, .9, .95, 1.0]


def motif(bar0, octave, bank, grp, vel, pan, swell=1.5):
    seq = [(T(bar0, s), d * BT, f"{n}{octave}", VEL_M[i]) for i, (s, d, n) in enumerate(MOTIF)]
    legato(S, "melodi", grp, bank, seq, vel=vel, att0=.35, ovl=.22, rel_end=1.4, pan=pan, swell=swell, skip0="half")


motif(9, 3, HORN, "korno", .74, -.05)
# --- melodi: açık deniz (15–18) kemanlarda yükselen çizgi; korno A3 pedalıyla ikinci söyleyişe hazırlar
legato(S, "melodi", "keman", VIOLIN, [(T(15), BAR, "D4", .9), (T(16), BAR, "F#4", 1.0), (T(17), BT, "G4", 1.0),
                                      (T(17, 1), BT, "E4", .9), (T(18), BAR, "F#4", .95)], vel=.48, att0=.9, ovl=.35, rel_end=.8, pan=.25, swell=1.5, skip0="half")
legato(S, "melodi", "korno", HORN, [(T(17), 2 * BAR, "A3", 1.0)], vel=.30, att0=1.2, rel_end=.6, pan=-.1, swell=3.0)
# --- melodi: leitmotif II (19–24) – kemanlar A4'ten, korno bir oktav aşağıda
motif(19, 4, VIOLIN, "keman", .50, .25, swell=2.0)
motif(19, 3, HORN, "korno", .62, -.1, swell=2.0)
# --- melodi: uzak korno çağrısı (27–28): A3 → D3 (giriş de bu çağrıyla başlar)
legato(S, "melodi", "korno", HORN, [(T(27), BAR, "A3", .8), (T(28), BAR, "D3", 1.0)], vel=.36, att0=.7, ovl=.3, rel_end=1.2, pan=-.15, swell=2.0)

# --- ritim: def ile 6/8 sallanması (9–24), timpani rulosu kabarmaları
for bar in range(9, 25):
    put(S, "ritim", "def", T(bar) + hum(6), vurus(DEF_DUM, .85), 1.0, -.1)
    put(S, "ritim", "def", T(bar, 1) + hum(6), vurus(DEF_TEK, .42), 1.0, .15)
    if bar >= 19:
        put(S, "ritim", "def", T(bar, 1) + 2 * BAR / 6 + hum(6), vurus(DEF_KUC, .22), 1.0, .3)
timp_roll(S, T(12), 1.6 * BAR, "D3", .30, rise=.62)
timp_roll(S, T(21), 3.3 * BAR, "D3", .42, rise=.62)
timp_roll(S, T(17, 1), 1.4 * BAR, "A2", .18, rise=.7)

# --- dinamikler (dB, ölçü başları; gövdede dairesel)
B = lambda bar: (bar - 1) * BAR
DYN = {
    ("zemin", "yay"): [(B(1), -5), (B(3), -4), (B(5), -3), (B(9), -2.5), (B(13), -.5), (B(15), -1), (B(19), -.5), (B(23), 1), (B(25), -2), (B(27), -4), (B(29), -5)],
    ("zemin", "bas"): [(B(1), -3), (B(9), -2), (B(13), 0), (B(19), 0), (B(23), 1), (B(25), -2), (B(29), -3)],
    ("zemin", "deniz"): [(B(1), 0), (B(5), -2), (B(9), -4), (B(19), -6), (B(25), -3), (B(27), 0), (B(29), 0)],
    ("ritim", "def"): [(B(1), -40), (B(9), -14), (B(11), -4), (B(13), -1), (B(15), -5), (B(19), -1), (B(23), 0), (B(24.5), -8), (B(25), -40), (B(29), -40)],
}
WAVE = {("zemin", "yay"): (2.0, .6), ("zemin", "bas"): (1.2, .4), ("zemin", "deniz"): (4.0, 0.0)}

# =====================================================================================
# 6) Kapanış (gövdeden sonra) – Hicaz kadansı E♭/D → D, korno E♭3 → D3, timpani D
# =====================================================================================
S = "kapanis"
legato(S, "zemin", "bas", BASS, [(0, 5.2, "D2", 1.0)], vel=.55, att0=.6, rel_end=1.3)
for v, (bank, vv, pan) in enumerate([(CELLO, .50, -.25), (CELLO, .42, -.10), (VIOLA, .34, .12), (VIOLA, .30, .28), (VIOLIN, .20, .35)]):
    seq = line([(0, BT, CH["Eb/D"][v]), (BT, 4.0, CH["D"][v])], max_len=10)
    legato(S, "zemin", "yay", bank, seq, vel=vv, att0=.4, ovl=.4, rel_end=1.3, pan=pan)
legato(S, "melodi", "korno", HORN, [(0, BT, "Eb3", .9), (BT, 3.9, "D3", 1.0)], vel=.40, att0=.4, ovl=.25, rel_end=1.4, pan=-.1, swell=1.5)
timp_roll(S, 0.0, 5.6, "D3", .22, rise=.35)
n = int(7.0 * SR)
u = np.arange(n) / SR
put(S, "zemin", "deniz", 0.0, SEA[0][int(1.1 * SR): int(1.1 * SR) + n] * np.where(u < 2.5, np.sin(np.pi / 2 * u / 2.5) ** 2, np.cos(np.pi / 2 * (u - 2.5) / 4.5) ** 2)[:, None], .17, -.3)
DYN_K = {("zemin", "yay"): [(0, -4), (2, -3.5), (7, -5)], ("zemin", "bas"): [(0, -3), (7, -4)], ("zemin", "deniz"): [(0, 0), (7, 0)]}

# =====================================================================================
# 7) Vurgu (sting, 4.5 sn): timpani kabarması + E♭/D → geniş D majör, kornolar D3 + A3
# =====================================================================================
S = "vurgu"
timp_roll(S, 0.0, 3.6, "D3", .45, rise=.33)
legato(S, "zemin", "bas", BASS, [(0, 3.4, "D2", 1.0)], vel=.6, att0=.25, rel_end=1.0)
for v, (bank, vv, pan) in enumerate([(CELLO, .55, -.25), (CELLO, .45, -.10), (VIOLA, .38, .12), (VIOLA, .34, .28), (VIOLIN, .28, .35)]):
    seq = line([(0, 1.2, CH["Eb/D"][v]), (1.2, 2.3, CH["D"][v])], max_len=10)
    legato(S, "zemin", "yay", bank, seq, vel=vv, att0=.5, ovl=.3, rel_end=1.0, pan=pan, swell=1.0)
legato(S, "melodi", "korno", HORN, [(0, 1.2, "Eb3", .85), (1.2, 2.3, "D3", 1.0)], vel=.55, att0=.3, ovl=.2, rel_end=1.0, pan=-.15, swell=1.0)
legato(S, "melodi", "korno", HORN, [(1.2, 2.3, "A3", 1.0)], vel=.42, att0=.25, rel_end=1.0, pan=.15, swell=1.0)


# =====================================================================================
# 8) Montaj: giriş (gövdenin son 2 ölçüsü, yumuşak açılış) + dairesel gövde + kapanış
# =====================================================================================
def section_stem(sec, stem, dyn):
    out = np.zeros((int((SEC[sec] + TAIL) * SR), 2))
    for (s, st, g), b in BUF.items():
        if s != sec or st != stem:
            continue
        x = b.copy()
        if (st, g) in dyn:
            x *= curve(dyn[(st, g)], sec)[:, None]
        if sec == "govde" and (st, g) in WAVE:
            x *= wave(sec, *WAVE[(st, g)])[:, None]
        out += x
    return reverb(out)


GRP_RMS = {}
for (s_, st_, g_), b_ in BUF.items():
    if s_ == "govde":
        y_ = b_[: int(L_SEC * SR)] * (curve(DYN[(st_, g_)], s_)[: int(L_SEC * SR), None] if (st_, g_) in DYN else 1)
        GRP_RMS[f"{st_}/{g_}"] = np.sqrt((y_ ** 2).mean())
nA, nL, nO = int(A_SEC * SR), int(L_SEC * SR), int(O_SEC * SR)
N = nA + nL + nO
STEM = {}
for stem in STEMS:
    yb = section_stem("govde", stem, DYN)
    bc = yb[:nL].copy()
    bc[: len(yb) - nL] += yb[nL: nL + len(yb) - nL][: nL]                  # kuyrukları gövde başına katla (döngü)
    yk = section_stem("kapanis", stem, DYN_K)
    x = np.zeros((N, 2))
    u = np.clip(np.arange(nA) / (3.5 * SR), 0, 1)
    x[:nA] = bc[nL - nA:] * (np.sin(np.pi / 2 * u) ** 2)[:, None]          # giriş: gövdenin son iki ölçüsü, açılarak
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
# 9) Ölçümler
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
# 10) Yazma
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

meta = {
    "id": ID,
    "ad": "Derya – Deniz ve keşif",
    "tarz": "Geniş, ferah sinematik yaylı + korno; 6/8 dalga salınımı, Re merkezli açık beşliler, Hicaz'a göz kırpan E♭/D geçişleri, çok alçak deniz dokusu",
    "kullanim": ["deniz geçişleri (Gelibolu'ya geçiş 1354)", "Boğaz sahneleri (Rumeli Hisarı, İstanbul Boğazı)", "donanma ve deniz savaşları öncesi/sonrası (Barbaros, Preveze 1538)",
                 "liman ve kıyı şehirleri", "keşif ve genişleme haritaları", "Akdeniz hâkimiyeti anlatıları"],
    "donem": [1, 2, 3, 4],
    "ton_makam": "Re (D) merkezli; açık beşli D–A, D majör/Miksolidyen umut renkleri (G/D, C/D) ve Hicaz'a göz kırpan E♭/D, Gm/D; leitmotif Re Hicaz (12-TET + koma: E♭ +15 sent, F♯ −15 sent)",
    "bpm": 72,
    "usul_olcu": "6/8 (♪ = 144, ♩. = 48; bir ölçü 2.5 sn, iki büyük vuruşlu salınım)",
    "sure": round(N / SR, 2),
    "dongu": [round(LOOP[0] / SR, 3), round(LOOP[1] / SR, 3)],
    "katmanlar": ["zemin", "ritim", "melodi"],
    "katman_aciklama": {"zemin": "kontrbas D pedalı, çello/viyola/keman akorları (dalga dinamiği), deniz dokusu",
                        "ritim": "def ile yumuşak 6/8 sallanması (ölçü 9–24), timpani rulosu kabarmaları (Re ve La)",
                        "melodi": "viyola karşı ezgisi, kornoda leitmotif, kemanlarda açık deniz çizgisi ve leitmotif II (korno ile oktav)"},
    "vurgu": f"out/{ID}__vurgu.flac (4.6 sn: timpani kabarması + E♭/D → D majör, kornolar D3+A3)",
    "yogunluk": "orta",
    "olcumler": M,
    "kaynaklar": sorted({f"{r}: {p}" for (r, p) in USED} | {"shared/sfx: muzik/korno_D2, muzik/korno_A2, doga/deniz_1, doga/deniz_2, ritim/def_buyuk, ritim/def_boguk, ritim/def_kucuk"}),
}
with open(os.path.join(HERE, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=1)
with open(os.path.join(HERE, "KAYNAKLAR.tsv"), "w", encoding="utf-8") as f:
    f.write("dosya\tdepo\tyol\tlisans\n")
    for (r, p) in sorted(USED):
        f.write(f"{os.path.basename(p)}\thttps://github.com/sgossner/{r}\t{p}\tCC0 1.0 (kamu malı)\n")
    for p in ("muzik/korno_D2.flac", "muzik/korno_A2.flac", "doga/deniz_1.flac", "doga/deniz_2.flac", "ritim/def_buyuk.flac", "ritim/def_boguk.flac", "ritim/def_kucuk.flac"):
        f.write(f"{os.path.basename(p)}\ttarih-reels/shared/sfx (kaynağı katalog.json'da: VCSL / VSCO-2-CE)\tshared/sfx/{p}\tCC0 1.0 (kamu malı)\n")
print("tamam:", OUT, f"{N / SR:.1f} sn, döngü {LOOP[0] / SR:.2f}–{LOOP[1] / SR:.2f} sn")
