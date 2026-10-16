#!/usr/bin/env python3
"""Müzik + ses efektleri + (varsa) seslendirme miksi.

Kullanım:  python3 make_audio.py
  vo/full.mp3 varsa  -> tek parça seslendirme 0.15 sn'den başlar
  vo/01.mp3 … 12.mp3 -> her satır timeline.js'teki t0 anına yerleşir
Çıktı: audio/final.wav ve audio/final.m4a
Her şey numpy ile sentezlenir (hicaz makamında ud, mehter davulu, kös, zil…).
"""
import json, os, re, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 44100
TL = json.loads(re.search(r"=\s*(\{.*\})\s*;", open(os.path.join(HERE, "timeline.js"), encoding="utf-8").read(), re.S).group(1))
rnd = np.random.default_rng(1453)


def load_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def prepare_vo():
    """vo/full.mp3: konuşma bloklarını bul, uzun duraklamaları kısalt, hedef süreye göre tempo ver.
    Dönüş: (ses, satır [t0,t1] listesi, eski->yeni zaman eşleme noktaları, yeni süre)"""
    cfg = TL.get("vo"); path = cfg and os.path.join(HERE, cfg["file"])
    if not path or not os.path.exists(path): return None
    v = load_audio(path); hop = int(.01 * SR)
    db = 20 * np.log10(np.sqrt(np.convolve(v ** 2, np.ones(hop) / hop, "same")[::hop]) + 1e-9)
    speech = db > -38; segs = []; i = 0
    while i < len(speech):
        if speech[i]:
            j = i
            while j < len(speech) and (speech[j] or (j + 18 < len(speech) and speech[j:j + 18].any())): j += 1
            segs.append([i / 100, j / 100]); i = j
        else: i += 1
    segs = [sg for sg in segs if sg[1] - sg[0] > .08]
    starts = set(cfg["line_seg"])
    print(f"seslendirme: {len(segs)} konuşma bloğu, {len(cfg['line_seg'])} satır")
    assert max(cfg["line_seg"]) < len(segs), "line_seg blok sayısını aşıyor – timeline.js'teki vo.line_seg'i güncelleyin"
    pieces, pos, seg_new = [], 0.0, []
    pad = .04
    for k, (a, b) in enumerate(segs):
        if k:
            gap = a - segs[k - 1][1]; g = min(gap, cfg["max_line_gap"] if k in starts else cfg["max_gap"])
            pieces.append(np.zeros(int(g * SR))); pos += g
        a2, b2 = max(0, a - pad), min(len(v) / SR, b + pad)
        pieces.append(v[int(a2 * SR): int(b2 * SR)]); seg_new.append([pos + (a - a2), pos + (a - a2) + (b - a)]); pos += b2 - a2
    comp = np.concatenate(pieces)
    speed = float(np.clip(len(comp) / SR / cfg["target"], 1.0, cfg["max_speed"]))
    tmp_in, tmp_out = os.path.join(HERE, "audio", "_vo_in.wav"), os.path.join(HERE, "audio", "_vo_out.wav")
    os.makedirs(os.path.dirname(tmp_in), exist_ok=True)
    with wave.open(tmp_in, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(comp / np.abs(comp).max(), -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp_in, "-af", f"atempo={speed:.4f}", tmp_out], check=True)
    out = load_audio(tmp_out); os.remove(tmp_in); os.remove(tmp_out)
    lead = .15; seg_new = [[lead + a / speed, lead + b / speed] for a, b in seg_new]
    ls = cfg["line_seg"] + [len(segs)]
    lines = [[seg_new[ls[i]][0], seg_new[ls[i + 1] - 1][1]] for i in range(len(cfg["line_seg"]))]
    dur = round(lines[-1][1] + 1.5, 2)
    dur = round(lines[-1][1] + 1.3, 2)
    warp = [[0, 0]] + [[L["t0"], lines[i][0]] for i, L in enumerate(TL["lines"])] + [[TL["lines"][-1]["t1"], lines[-1][1]], [TL["duration"], dur]]
    warp += [[o, seg_new[k][0] - .04] for o, k in cfg.get("anchors", [])]  # vuruşlar kelimenin başına kilitlenir
    warp.sort(); assert all(b[1] > a[1] for a, b in zip(warp, warp[1:])), warp
    print(f"tempo x{speed:.3f} → konuşma {lines[-1][1]:.1f} sn, video {dur} sn")
    return out, lead, lines, warp, dur


VO = prepare_vo()
if VO:
    _, _, VO_LINES, WARP, DUR = VO
    _wo, _wn = np.array(WARP).T
    def W(t): return float(np.interp(t, _wo, _wn))
    with open(os.path.join(HERE, "audio", "vo_timing.js"), "w", encoding="utf-8") as f:
        f.write("// make_audio.py tarafından üretildi: seslendirmenin gerçek zamanlaması\nwindow.VO = " + json.dumps({"duration": DUR, "lines": VO_LINES, "warp": WARP}) + ";\n")
else:
    DUR = TL["duration"]
    def W(t): return t
N = int((DUR + 3) * SR)

music = np.zeros((N, 2)); sfx = np.zeros((N, 2)); amb = np.zeros((N, 2))


def tt(sec): return np.arange(int(sec * SR)) / SR


def add(buf, at, sig, gain=1.0, pan=0.0, raw=False):
    i = int((at if raw else W(at)) * SR)
    if i >= N: return
    if i < 0: sig, i = sig[-i:], 0
    sig = sig[: N - i]
    if sig.ndim == 1:
        l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    buf[i: i + len(sig)] += sig * gain


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def noise(sec): return rnd.standard_normal(int(sec * SR))


def sweep(f0, f1, sec, k=30):
    t = tt(sec); f = f1 + (f0 - f1) * np.exp(-t * k)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ---------------- vurmalılar ----------------
def davul(g=1.0):
    t = tt(.9); body = sweep(150, 55, .9, 28) * np.exp(-t * 6)
    skin = fft_filter(noise(.9), hi=2500) * np.exp(-t * 45) * .5
    return np.tanh((body + skin) * 1.6) * g


def kos():
    t = tt(2.6); body = (sweep(120, 38, 2.6, 9) + .5 * np.sin(2 * np.pi * 32 * t)) * np.exp(-t * 1.6)
    burst = fft_filter(noise(2.6), hi=500) * np.exp(-t * 7)
    return np.tanh((body + burst * .8) * 2.2)


def tek():
    t = tt(.25); return (sweep(320, 200, .25, 40) * np.exp(-t * 26) + fft_filter(noise(.25), lo=2500) * np.exp(-t * 60) * .4)


def zil(sec=1.4):
    t = tt(sec); metal = sum(np.sin(2 * np.pi * f * t + rnd.random() * 6) for f in (3120, 4385, 5270, 6890, 8130, 9470))
    return (fft_filter(noise(sec), lo=5000) * .7 + metal * .08) * np.exp(-t * 3.2)


def thud():
    t = tt(.6); return np.tanh((sweep(140, 55, .6, 22) * np.exp(-t * 9) + fft_filter(noise(.6), hi=900) * np.exp(-t * 30)) * 1.8)


def clink():
    t = tt(.35); return sum(np.sin(2 * np.pi * f * t) * a for f, a in ((1870, 1), (2930, .7), (4410, .5), (6020, .3))) * np.exp(-t * 18)


def chain():
    out = np.zeros(int(1.6 * SR))
    for i in range(14):
        at = i * .085 + rnd.random() * .04; s = clink() * (1 - i / 16) * (.6 + .4 * rnd.random()); j = int(at * SR)
        out[j: j + len(s)] += s[: len(out) - j]
    t = tt(1.6); out += fft_filter(noise(1.6), 200, 1500) * np.exp(-t * 3) * .3
    return out * .5


def chime():
    t = tt(3.5); f = 880
    return sum(np.sin(2 * np.pi * f * m * t) * a * np.exp(-t * d) for m, a, d in ((1, 1, 1.2), (2.76, .5, 2), (5.4, .3, 3), (8.93, .15, 4)))


def stamp():
    t = tt(.4); return thud()[: len(t)] * .7 + fft_filter(noise(.4), 800, 5000) * np.exp(-t * 25) * .4


def whoosh(sec=.6):
    t = tt(sec); env = np.sin(np.pi * t / sec) ** 2
    lo = fft_filter(noise(sec), 200, 1200); hi = fft_filter(noise(sec), 1500, 6000)
    k = t / sec
    return (lo * (1 - k) + hi * k) * env


def riser(sec):
    t = tt(sec); k = t / sec
    n = noise(sec); chunks = []
    step = 2048
    for i in range(0, len(n), step):
        c = n[i: i + step]
        if len(c) < 64: chunks.append(c * 0); continue
        chunks.append(fft_filter(c, 300, 600 + 9000 * (i / len(n)) ** 2))
    n = np.concatenate(chunks)[: len(t)]
    tone = np.sin(2 * np.pi * np.cumsum(180 + 700 * k ** 2) / SR)
    return (n * .7 + tone * .25) * k ** 2.2


# ---------------- melodik ----------------
HICAZ = {"D": 293.66, "Eb": 311.13, "F#": 369.99, "G": 392.0, "A": 440.0, "Bb": 466.16, "C": 523.25, "D2": 587.33}


def oud(freq, sec=.9, bright=.5):
    n = int(sec * SR); p = int(SR / freq); buf = rnd.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = .996 * (bright * buf[i % p] + (1 - bright) * buf[(i + 1) % p]) if True else 0
    t = tt(sec); return fft_filter(out, 90, 4000) * np.minimum(1, t * 400) * np.exp(-t * 2)


OUD_CACHE = {}


def oudc(name, octv=1.0):
    k = (name, octv)
    if k not in OUD_CACHE: OUD_CACHE[k] = oud(HICAZ[name] * octv)
    return OUD_CACHE[k]


def pad(freqs, sec, cutoff=900, vib=0.0):
    t = tt(sec); s = np.zeros_like(t)
    for f in freqs:
        for d in (-.12, 0, .12):
            ph = 2 * np.pi * np.cumsum(np.full_like(t, f * (1 + d / 100)) * (1 + vib * np.sin(2 * np.pi * 5 * t))) / SR
            s += (2 * ((ph / (2 * np.pi)) % 1) - 1)
    s = fft_filter(s, 40, cutoff) / (len(freqs) * 3)
    env = np.minimum(1, t / 1.2) * np.minimum(1, (sec - t) / 1.0)
    return s * np.clip(env, 0, 1)


def sec_range(a, b): return a, b - a


# ---------------- düzenleme ----------------
BEAT = .6
# 1) drone boyunca (re + la), sahneye göre seviye
for a, b, g, cut in ((0, 3.6, .5, 500), (3.6, 13.4, .35, 700), (13.4, 17.5, .3, 500), (17.5, 27.6, .38, 900), (27.6, 31.8, .3, 400), (31.8, 36.2, .4, 900)):
    add(music, a - .3, pad([73.42, 110, 146.83], b - a + .9, cut), g)
add(music, 36.0, pad([73.42, 146.83, 185.0, 220.0, 293.66], 4.6, 2200), .55)  # finalde re majör (hicaz dominantı)
# yüksek gerilim teli (portre, şafak)
add(music, 13.3, pad([587.33, 880.0], 4.4, 3000, vib=.003), .12)
add(music, 27.5, pad([587.33, 622.25], 2.8, 2500, vib=.004), .1)

# 2) ud ostinatosu (hicaz)
def ostinato(a, b, notes, step, gain, octv=1.0):
    i = 0; x = a
    while x < b - .05:
        add(music, x, oudc(notes[i % len(notes)], octv), gain, pan=-.25 if i % 2 else .25); x += step; i += 1

ostinato(3.75, 12.4, ["D", "Eb", "F#", "Eb", "D", "C", "D", "A"], BEAT / 2, .32, .5)
ostinato(13.6, 17.4, ["D", "F#", "A", "D2"], BEAT, .22)
ostinato(19.95, 27.5, ["D", "Eb", "F#", "G", "A", "G", "F#", "Eb", "D", "Eb", "F#", "A", "Bb", "A", "G", "F#"], BEAT / 2, .3)
ostinato(31.9, 36.1, ["A", "Bb", "A", "G", "F#", "Eb", "F#", "D"], BEAT / 2, .34)
ostinato(36.4, 39.4, ["D", "F#", "A", "D2", "A", "F#"], BEAT / 2, .26)

# 3) mehter vuruşları
def mehter(a, b, full=True, g=1.0):
    bar = 0; x = a
    while x < b - .05:
        add(music, x, davul(), .55 * g)
        add(music, x + BEAT, tek(), .35 * g, pan=.3)
        add(music, x + 2 * BEAT, davul(.9), .5 * g)
        if full:
            add(music, x + 2.5 * BEAT, tek(), .3 * g, pan=-.3)
            add(music, x + 3 * BEAT, davul(.8), .45 * g)
            if bar % 2 == 1: add(music, x + 3 * BEAT, zil(1.0), .12 * g)
        x += 4 * BEAT; bar += 1

mehter(3.75, 12.3, full=False, g=.6)
mehter(17.6, 19.9, full=True, g=.8)
mehter(19.95, 24.4, full=True, g=1.0)
mehter(24.4, 27.4, full=True, g=1.25)
for x in np.arange(24.4, 27.4, BEAT / 2): add(music, x + BEAT / 4, tek(), .18, pan=-.4)  # yoğunlaşan nakkare
mehter(31.85, 36.1, full=True, g=1.15)

# 4) zaman çizelgesindeki darbeler
SFX = {"davul": lambda: davul() * 1.0, "boom": lambda: kos(), "stamp": stamp, "chain": chain, "thud": thud, "chime": chime}
for h in TL["hits"]:
    add(sfx, h["t"] - (.02 if h["sfx"] != "chime" else 0), SFX[h["sfx"]](), {"boom": .5, "davul": .55, "chime": .25, "chain": .9, "thud": .7, "stamp": .5}[h["sfx"]])
    if h["sfx"] == "boom": add(sfx, h["t"], zil(2.0), .18)
for a, b in TL["risers"]: add(sfx, a, riser(b - a), .35)
for tr in TL["transitions"]: add(sfx, tr["t"] - .3, whoosh(.6), .32, pan=.3 if tr["type"] == "whip" else 0)

# 5) ortam: rüzgâr, deniz, meşale çıtırtısı
wind = fft_filter(np.cumsum(rnd.standard_normal(N)) * .002, 30, 600); wind /= np.abs(wind).max()
amb[:, 0] += wind * .06; amb[:, 1] += np.roll(wind, 900) * .06
for a, b in ((3.6, 13.4), (17.5, 19.9), (27.6, 36.2)):
    t = tt(b - a); sea = fft_filter(noise(b - a), 150, 1800) * (.5 + .5 * np.sin(2 * np.pi * t / 3.2)) * np.minimum(1, t) * np.minimum(1, (b - a - t))
    add(amb, a, sea, .05)
crack = np.zeros(int(7.7 * SR))
for _ in range(240):
    j = rnd.integers(0, len(crack) - 500); crack[j: j + 300] += rnd.standard_normal(300) * np.exp(-np.arange(300) / 40)
add(amb, 19.9, fft_filter(crack, 1500, 8000), .07)

# ---------------- seslendirme ----------------
vo = np.zeros(N); vodir = os.path.join(HERE, "vo")
if VO:
    v, lead = VO[0], VO[1]; j = int(lead * SR); vo[j: j + len(v)] = v[: N - j]
else:
    for i, L in enumerate(TL["lines"], 1):
        p = os.path.join(vodir, f"{i:02d}.mp3")
        if os.path.exists(p):
            v = load_audio(p); j = int(L["t0"] * SR); vo[j: j + len(v)] += v[: N - j]
has_vo = np.abs(vo).max() > 0
if has_vo:
    vo = vo / np.abs(vo).max() * .85
    env = np.convolve(np.abs(vo), np.ones(int(.05 * SR)) / int(.05 * SR), "same")
    env = np.convolve((env > .02).astype(float), np.ones(int(.3 * SR)) / int(.3 * SR), "same")
    duck = 1 - .55 * np.clip(env, 0, 1)
    music *= duck[:, None]; amb *= duck[:, None]

# ---------------- reverb + master ----------------
ir_t = tt(2.4); ir = rnd.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 2.6)[:, None]; ir[0] = 1
def reverb(x, wet):
    L = len(x) + len(ir); n = 1 << (L - 1).bit_length()
    out = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], n) * np.fft.rfft(ir[:, c], n), n)[: len(x)] for c in range(2)], 1)
    return x * (1 - wet) + out / np.abs(out).max() * np.abs(x).max() * wet

mix = reverb(music, .25) * .9 + reverb(sfx, .18) + amb
if has_vo: mix += np.stack([vo, vo], 1) * 1.1
fade = np.ones(N); e = int(DUR * SR); fade[e - int(1.2 * SR): e] = np.linspace(1, 0, int(1.2 * SR)); fade[e:] = 0
mix *= fade[:, None]
mix = np.tanh(mix / np.abs(mix).max() * 2.2) * .89
mix = mix[: int(DUR * SR)]

os.makedirs(os.path.join(HERE, "audio"), exist_ok=True)
wav = os.path.join(HERE, "audio", "final.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-c:a", "aac", "-b:a", "192k", os.path.join(HERE, "audio", "final.m4a")], check=True)
print("tamam:", wav, "| seslendirme:", "VAR" if has_vo else "yok (yalnız müzik+efekt)")
