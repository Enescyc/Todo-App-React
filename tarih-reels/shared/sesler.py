"""Örnek tabanlı ses araçları: shared/sfx CC0 kütüphanesi ve shared/muzik tarz parçaları (make_audio.py kullanır).

Kütüphane sesleri zaten "uyumlandı" (4 kHz üstü enerji ≤ %6, çok tizler oktav pes). Burada:
  - lib(id)               : kütüphane sesi (stereo, 44.1 kHz)
  - put / sustain / motif : yerleştirme, döngüyle uzatma, leitmotif çalma
  - STYLES['lib:*']       : sahne müzikleri (zemin + ritim + motif), anlatının altında kalacak seviyede
  - track('trk:<id>')     : alt ajanların ürettiği tarz parçaları (shared/muzik/<id>/out/<id>__<katman>.flac)
"""
import json, os, subprocess
import numpy as np

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
LIBDIR, MUZDIR = os.path.join(HERE, "sfx"), os.path.join(HERE, "muzik")
_cache = {}


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def lib(sid):
    if sid not in _cache: _cache[sid] = load(os.path.join(LIBDIR, sid + ".flac"))
    return _cache[sid]


def pitch(x, semis):
    if not semis: return x
    r = 2 ** (semis / 12); idx = np.arange(0, len(x) - 1, r)
    return np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in range(2)], 1)


def fade(x, fin=.02, fout=.4):
    x = x.copy(); n1, n2 = min(len(x), int(fin * SR)), min(len(x), int(fout * SR))
    if n1: x[:n1] *= np.linspace(0, 1, n1)[:, None]
    if n2: x[-n2:] *= np.linspace(1, 0, n2)[:, None]
    return x


def put(buf, at, x, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i >= len(buf) or len(x) == 0: return
    if i < 0: x, i = x[-i:], 0
    x = x[: len(buf) - i]
    if pan: x = x * np.array([np.sqrt(1 - pan), np.sqrt(1 + pan)])
    buf[i: i + len(x)] += x * gain


def stretch_loop(x, need, xf=1.2, start=.0):
    """x'i (start'tan itibaren) çapraz geçişli döngüyle en az need saniyeye uzatır."""
    x = x[int(start * SR):]; n, f = int(need * SR), int(xf * SR)
    out = x.copy()
    while len(out) < n:
        seg = x[int(.3 * SR):]
        if len(seg) <= 2 * f: seg = x
        a = out[-f:] * np.linspace(1, 0, f)[:, None] + seg[:f] * np.linspace(0, 1, f)[:, None]
        out = np.concatenate([out[:-f], a, seg[f:]])
    return out[:n]


def sustain(buf, sid, a, b, gain=1.0, semis=0, fin=1.0, fout=1.5, start=0.0, pan=0.0):
    if b - a <= .05: return
    x = stretch_loop(pitch(lib(sid), semis), b - a + fout, start=start)
    put(buf, a, fade(x, fin, fout), gain, pan)


# leitmotif (Re Hicaz): A B♭ A G | F♯ G E♭ D – A'ya göre yarım ses ve vuruş
MOTIF = [(0, 1), (1, 1), (0, 2), (-2, 1), (-3, 1), (-2, 1), (-6, 1), (-7, 2.5)]


def motif(buf, sid, a, beat, gain=1.0, seq=MOTIF, base=0, pan=0.0, legato=.5, until=None):
    t = a
    for semis, beats in seq:
        if until and t > until - .3: break
        d = beats * beat + legato
        x = pitch(lib(sid), base + semis)[: int(d * SR)]
        put(buf, t, fade(x, .06, min(.6, d * .5)), gain, pan)
        t += beats * beat
    return t


def rhythm(buf, a, b, step, pattern, gain=1.0, accel=0.0):
    """pattern: her adım için kütüphane kimliği ya da None; accel: sona doğru hızlanma oranı."""
    t, i = a, 0
    while t < b - .05:
        sid = pattern[i % len(pattern)]
        if sid:
            s, g = sid if isinstance(sid, tuple) else (sid, 1.0)
            put(buf, t, fade(lib(s)[: int(1.2 * SR)], .002, .25), gain * g)
        k = (t - a) / max(.01, b - a); t += step * (1 - accel * k); i += 1


def track(buf, tid, a, b, gain=1.0, layers=("tam",), offset=None, fin=1.0, fout=2.0):
    """Alt ajanların tarz parçası. Yoksa False döner (çağıran kütüphane stiline düşer)."""
    d = os.path.join(MUZDIR, tid)
    files = [os.path.join(d, "out", f"{tid}__{L}.flac") for L in layers]
    if not all(os.path.exists(f) for f in files):
        gen = os.path.join(d, "uret.py")
        if os.path.exists(gen): subprocess.run(["python3", gen], check=False, capture_output=True)
        if not all(os.path.exists(f) for f in files): return False
    x = sum(load(f) for f in files)
    meta = json.load(open(os.path.join(d, "meta.json"), encoding="utf-8")) if os.path.exists(os.path.join(d, "meta.json")) else {}
    lp = meta.get("dongu") or [0, len(x) / SR]
    st = offset if offset is not None else max(0.0, lp[0] - .5)
    need = b - a + fout
    body = x[int(st * SR):]
    if len(body) < need * SR:   # döngü gövdesiyle uzat
        loop = x[int(lp[0] * SR): int(lp[1] * SR)]; f = int(1.0 * SR)
        while len(body) < need * SR:
            body = np.concatenate([body[:-f], body[-f:] * np.linspace(1, 0, f)[:, None] + loop[:f] * np.linspace(0, 1, f)[:, None], loop[f:]])
    put(buf, a, fade(body[: int(need * SR)], fin, fout), gain)
    return True


# ---------------- sahne müzikleri (kütüphaneden) ----------------
def _drone(buf, a, b, g=1.0, dark=False):
    sustain(buf, "muzik/kontrbas_D1", a, b, .55 * g, fin=1.5, fout=2.0)
    sustain(buf, "muzik/cello_D2", a + .4, b, .32 * g, semis=-1 if dark else 0, fin=2.0, fout=2.0, start=.4)


def s_dawn(buf, a, b):
    sustain(buf, "doga/ortam_1", a, b, .5, fin=1.5, fout=1.5)
    _drone(buf, a, b, .9)
    if b - a > 2.5: sustain(buf, "muzik/korno_D2", a + 1.2, b, .28, fin=1.8, fout=1.5)


def s_tension(buf, a, b):
    sustain(buf, "muzik/kontrbas_D1", a, b, .5, fin=.6, fout=1.2)
    sustain(buf, "muzik/cello_tremolo_D2", a, b, .42, fin=.5, fout=1.0)
    if b - a > 2: sustain(buf, "vurus/timpani_rulo", max(a, b - 3.5), b, .25, fin=2.0, fout=.4)


def s_collapse(buf, a, b):
    sustain(buf, "muzik/kontrbas_D1", a, b, .6, fin=.4, fout=1.5)
    sustain(buf, "muzik/cello_tremolo_D2", a, b, .4, semis=-1, fin=.3, fout=1.2)
    rhythm(buf, a, b, .42, ["ritim/def_boguk", None, "ritim/darbuka_dum", None], .5, accel=.35)


def s_dark(buf, a, b):
    _drone(buf, a, b, .9, dark=True)
    sustain(buf, "doga/ortam_1", a, b, .35, fin=1.0, fout=1.5)


def s_rewind(buf, a, b):
    x = lib("gecis/zil_kresendo_4s")[::-1]; put(buf, a, fade(x[: int((b - a + .3) * SR)], .3, .3), .3)
    rhythm(buf, a, b, .22, ["ritim/darbuka_3", "ritim/darbuka_2"], .22, accel=.5)
    sustain(buf, "muzik/kontrbas_D1", a, b, .4, fin=.4, fout=.8)


def s_theme(buf, a, b):
    _drone(buf, a, b, .85)
    if b - a > 4: motif(buf, "muzik/korno_A2", a + 1.2, .78, .32, until=b)


def s_march(buf, a, b):
    _drone(buf, a, b, .7)
    D, T, B = ("ritim/darbuka_dum", .9), ("ritim/darbuka_3", .55), ("ritim/def_buyuk", .8)
    rhythm(buf, a + .2, b, .3, [B, None, T, T, D, None, T, None], .55)   # düyek benzeri 8/8
    if b - a > 3: sustain(buf, "muzik/korno_D2", a + 1.0, b, .22, fin=1.5, fout=1.2)


def s_dream(buf, a, b):
    sustain(buf, "doku/fx_uzun_1", a, b, .35, fin=1.2, fout=1.5)
    sustain(buf, "doku/kadeh_D#4", a + .5, b, .14, fin=1.5, fout=1.5)
    sustain(buf, "muzik/cello_D2", a, b, .25, fin=1.5, fout=1.5)
    if b - a > 3: motif(buf, "muzik/keman_A3", a + 1.0, 1.0, .12, until=b)


def s_byz(buf, a, b):
    sustain(buf, "muzik/cello_D2", a, b, .35, semis=7, fin=1.2, fout=2.0)          # ison (A)
    sustain(buf, "muzik/kontrbas_D1", a, b, .35, fin=1.2, fout=2.0)
    put(buf, a + .2, fade(lib("can/kilise_cani_D3"), .01, 2.0), .3, pan=-.3)
    if b - a > 3: sustain(buf, "muzik/keman_A3", a + 1.5, b, .14, fin=2.0, fout=2.0)


def s_sea(buf, a, b):
    sustain(buf, "doga/deniz_1", a, b, .5, fin=1.5, fout=1.5); _drone(buf, a, b, .7)


def s_battle(buf, a, b):
    _drone(buf, a, b, .8)
    D, T, B = ("ritim/darbuka_dum", 1.0), ("ritim/darbuka_3", .6), ("ritim/def_buyuk", .9)
    rhythm(buf, a, b, .22, [B, T, T, D, T, None, D, T, T], .55)                      # 9/8 aksak hissi
    for x in np.arange(a, b - .5, 1.98): put(buf, x, fade(lib("vurus/timpani_alcak")[: int(1.6 * SR)], .002, .5), .35)


STYLES = {"lib:dawn": s_dawn, "lib:tension": s_tension, "lib:collapse": s_collapse, "lib:dark": s_dark, "lib:rewind": s_rewind,
          "lib:theme": s_theme, "lib:march": s_march, "lib:dream": s_dream, "lib:byz": s_byz, "lib:sea": s_sea, "lib:battle": s_battle}


# ---------------- ortak oda ve ton ----------------
def room(x, wet=.18, seed=7, decay=3.2, sec=1.8):
    rng = np.random.default_rng(seed); t = np.arange(int(sec * SR)) / SR
    ir = rng.standard_normal((len(t), 2)) * np.exp(-t * decay)[:, None]; ir[0] = 0
    n = 1 << (len(x) + len(ir)).bit_length()
    w = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], n) * np.fft.rfft(ir[:, c], n), n)[: len(x)] for c in range(2)], 1)
    return x + w / (np.abs(w).max() + 1e-9) * (np.abs(x).max() + 1e-9) * wet


def soften(x, fc=7000.0, db=-4.0):
    F = np.fft.rfftfreq(len(x), 1 / SR); g = 10 ** (db * np.clip(np.log2(np.maximum(F, 1) / fc), 0, 1) / 20)
    return np.fft.irfft(np.fft.rfft(x, axis=0) * g[:, None], len(x), axis=0)
