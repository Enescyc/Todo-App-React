#!/usr/bin/env python3
"""Tarih Reels ortak ses hattı: seslendirme hizalama + müzik + efekt + miks.

Kullanım:  python3 shared/make_audio.py <bölüm-klasörü>
  1) <bölüm>/vo/p1.mp3 … pN.mp3 varsa: konuşma bölgeleri bulunur, kelime zamanları hece oranıyla
     yalnızca konuşulan anlara dağıtılır → audio/vo_timing.js (window.VO). Hızlandırma YOK.
  2) index.html headless açılır, exportCues() ile sahne/vuruş/müzik zamanları alınır.
  3) Müzik + efekt: "lib:*" stilleri ve "kategori/ad" efektleri shared/sfx CC0 kütüphanesinden (shared/sesler.py),
     "trk:<tarz>" stilleri shared/muzik tarz parçalarından, eski stiller numpy sentezinden gelir. Ortak oda yankısı + tiz
     yumuşatma uygulanır, seslendirme varsa müzik altında kısılır → audio/final.wav + .m4a
Gerekli: numpy, ffmpeg, node + playwright.
"""
import json, os, re, subprocess, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sesler

EPD = os.path.abspath(sys.argv[1]); HERE = os.path.dirname(os.path.abspath(__file__))
SR = 44100; rnd = np.random.default_rng(1914)
os.makedirs(os.path.join(EPD, "audio"), exist_ok=True)


def load_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def movavg(x, k):
    """np.convolve(x, np.ones(k) / k, "same") ile aynı sonuç; birikimli toplamla O(N) (doğrudan konvolüsyon dakikalar sürüyordu).
    Girdi negatif olmayan bir sinyaldir (enerji, genlik); yuvarlama eksisi sıfıra kırpılır (sqrt/log için)."""
    h, n = (k - 1) // 2, len(x); c = np.concatenate([[0.0], np.cumsum(x)]); i = np.arange(n)
    return np.maximum((c[np.clip(i + h + 1, 0, n)] - c[np.clip(i + h + 1 - k, 0, n)]) / k, 0.0)


def read_ep():
    src = open(os.path.join(EPD, "timeline.js"), encoding="utf-8").read()
    out = subprocess.run(["node", "-e", "global.window={};eval(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(JSON.stringify(window.EP))", os.path.join(EPD, "timeline.js")], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def syll(w):
    if re.search(r"\d", w): return len(re.sub(r"\D", "", w)) * 1.7
    return max(1, len(re.findall(r"[aeıioöuüâîûAEIİOÖUÜÂÎÛ]", w)))


def split_full(path, n, texts):
    """Tek parça seslendirmeyi n paragrafa böler: en uzun n-1 sessizlik (paragraf arası [long pause]) kesim noktasıdır.
    Kontrol: her parçanın süresi hece oranıyla kabaca uyuşmalı; uymazsa uyarır."""
    v = load_audio(path); hop = int(.01 * SR)
    db = 20 * np.log10(np.sqrt(movavg(v ** 2, hop)[::hop]) + 1e-9)
    sil = db < max(-45, db.max() - 38); gaps, i = [], 0
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]: j += 1
            if i > 0 and j < len(sil): gaps.append((j - i, i, j))
            i = j
        else: i += 1
    # adaylar: belirgin duraklamalar. Seçim: paragrafların okunma hızı (konuşma süresi / hece) en tutarlı olan
    # kesim kombinasyonu; uzun duraklama küçük bir bonus alır.
    from itertools import combinations
    want = np.array([sum(syll(w) for w in t.split()) for t in texts], float)
    cand = sorted([g for g in gaps if g[0] >= 35], key=lambda g: g[1])
    if len(cand) > 30: cand = sorted(sorted(cand, reverse=True)[:30], key=lambda g: g[1])
    voiced_cum = np.concatenate([[0], np.cumsum(~sil)])
    best = None
    for combo in combinations(range(len(cand)), n - 1):
        b = [0] + [(cand[c][1] + cand[c][2]) // 2 for c in combo] + [len(sil)]
        sp = np.array([voiced_cum[b[k + 1]] - voiced_cum[b[k]] for k in range(n)], float)
        if (sp <= 0).any(): continue
        rate = np.log(sp / want); score = rate.std() - .004 * sum(cand[c][0] for c in combo)
        if best is None or score < best[0]: best = (score, combo, rate)
    assert best, f"yeterli duraklama yok ({len(cand)} aday, {n - 1} gerekli)"
    cuts = [cand[c] for c in best[1]]
    bounds = [0] + [(a + b) // 2 for _, a, b in cuts] + [len(sil)]
    parts = [v[bounds[k] * hop: bounds[k + 1] * hop] for k in range(n)]
    ratio = np.exp(best[2] - best[2].mean())
    print("paragraf kesimleri (sn):", " ".join(f"{b / 100:.2f}" for b in bounds[1:-1]), "| hız oranı:", " ".join(f"p{k + 1}:{r:.2f}" for k, r in enumerate(ratio)))
    if (np.abs(np.log(ratio)) > .3).any(): print("UYARI: bir paragraf sınırı yanlış olabilir – kontrol edin")
    tmp = []
    for k, p in enumerate(parts):
        f = os.path.join(EPD, "audio", f"_p{k + 1}.wav")
        with wave.open(f, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(p / np.abs(v).max(), -1, 1) * 32767).astype(np.int16).tobytes())
        tmp.append(f)
    return tmp


# ---------------- 1) seslendirme ----------------
EP = read_ep()
vo_files = [os.path.join(EPD, "vo", f"p{i + 1}.mp3") for i in range(len(EP["paras"]))]
full = next((os.path.join(EPD, "vo", f) for f in sorted(os.listdir(os.path.join(EPD, "vo"))) if f.startswith("full.")), None) if os.path.isdir(os.path.join(EPD, "vo")) else None
if not all(os.path.exists(f) for f in vo_files) and full:
    vo_files = split_full(full, len(EP["paras"]), [P["text"] for P in EP["paras"]])
VO_CLIPS = None
if all(os.path.exists(f) for f in vo_files):
    lead, gap, VO_CLIPS, paras = EP.get("lead", .4), EP.get("gap", .55), [], []
    t = lead
    for P, f in zip(EP["paras"], vo_files):
        v = load_audio(f); hop = int(.01 * SR)
        db = 20 * np.log10(np.sqrt(movavg(v ** 2, hop)[::hop]) + 1e-9)
        voiced = db > max(-40, db.max() - 32)
        idx = np.where(voiced)[0]; a, b = idx[0], idx[-1] + 1          # baştaki/sondaki sessizliği kırp
        v = v[max(0, (a - 3) * hop): (b + 5) * hop]; voiced = voiced[max(0, a - 3): b + 5]
        cum = np.concatenate([[0], np.cumsum(voiced)]) / max(1, voiced.sum())  # konuşulan zamanın birikimli oranı
        words = P["text"].split(); w = np.array([syll(x) for x in words], float); edges = np.concatenate([[0], np.cumsum(w)]) / w.sum()
        # kelime başı: sessizlikten SONRAKİ ilk konuşma karesi; kelime sonu: son konuşma karesi
        start_of = lambda q: max(0, int(np.searchsorted(cum, q, side="right")) - 1)
        end_of = lambda q: int(np.searchsorted(cum, q, side="left"))
        wt = [[round(t + start_of(edges[i]) / 100, 3), round(t + max(end_of(edges[i + 1]), start_of(edges[i]) + 2) / 100, 3)] for i in range(len(words))]
        # noktalamalı kelimelerin sonunu yakındaki gerçek duraklamaya yasla (anlatıcı orada nefes alır)
        pauses, i = [], 0
        while i < len(voiced):
            if not voiced[i]:
                j = i
                while j < len(voiced) and not voiced[j]: j += 1
                if j - i >= 12 and i > 0 and j < len(voiced): pauses.append((t + i / 100, t + j / 100))
                i = j
            else: i += 1
        used = set()
        for k, w_ in enumerate(words[:-1]):
            if not re.search(r"[.,;:!?…]$", w_): continue
            near = [(abs(a - wt[k][1]), a, b) for a, b in pauses if abs(a - wt[k][1]) < .7 and a not in used]
            if not near: continue
            _, a, b = min(near); used.add(a)
            # bu kelimeye kadar olanları [önceki çapa, a], sonrasını [b, sonraki çapa] aralığına orantılı sıkıştır
            wt[k][1] = a; wt[k + 1][0] = b
        for k in range(1, len(wt)):  # sıralamayı koru
            if wt[k][0] < wt[k - 1][0] + .05: wt[k][0] = wt[k - 1][0] + .05
            wt[k - 1][1] = min(wt[k - 1][1], wt[k][0]) if wt[k - 1][1] > wt[k][0] else wt[k - 1][1]
        VO_CLIPS.append((t, v)); paras.append({"t0": wt[0][0], "t1": t + len(v) / SR, "words": wt})
        t += len(v) / SR + gap + P.get("pause", 0)                      # paras[].pause: harita sessizliği
    dur = round(t - gap + EP.get("tail", 3.0), 2)
    with open(os.path.join(EPD, "audio", "vo_timing.js"), "w", encoding="utf-8") as f:
        f.write("// shared/make_audio.py üretti: seslendirmenin gerçek kelime zamanları\nwindow.VO = " + json.dumps({"duration": dur, "paras": paras}) + ";\n")
    print(f"seslendirme: {len(paras)} paragraf, süre {dur} sn (hızlandırma yok)")
else:
    p = os.path.join(EPD, "audio", "vo_timing.js")
    if os.path.exists(p): os.remove(p)
    print("seslendirme yok → tahmini zamanlama ile önizleme sesi")

# ---------------- 2) çözülmüş zaman çizelgesi ----------------
js = """const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+process.argv[1]+'?capture');await p.waitForFunction(()=>window.READY,null,{timeout:20000});
process.stdout.write(JSON.stringify(await p.evaluate(()=>exportCues())));await b.close();})();"""
env = dict(os.environ, NODE_PATH=subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip())
CUES = json.loads(subprocess.run(["node", "-e", js, os.path.join(EPD, "index.html")], capture_output=True, text=True, check=True, env=env).stdout)
DUR = CUES["duration"]; N = int((DUR + 3) * SR)
music, sfx, amb = np.zeros((N, 2)), np.zeros((N, 2)), np.zeros((N, 2))


def tt(sec): return np.arange(int(sec * SR)) / SR
def noise(sec): return rnd.standard_normal(int(sec * SR))


def add(buf, at, sig, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or len(sig) == 0: return
    if i < 0: sig, i = sig[-i:], 0
    sig = sig[: N - i]
    if sig.ndim == 1: sig = np.stack([sig * np.sqrt(1 - pan), sig * np.sqrt(1 + pan)], 1)
    buf[i: i + len(sig)] += sig * gain


def ff(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def sweep(f0, f1, sec, k=30):
    t = tt(sec); f = f1 + (f0 - f1) * np.exp(-t * k); return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ---------------- enstrümanlar / efektler ----------------
def timpani(f=70, g=1.0):
    t = tt(1.6); return np.tanh((sweep(f * 1.6, f, 1.6, 20) * np.exp(-t * 3.2) + ff(noise(1.6), hi=1200) * np.exp(-t * 30) * .4) * 1.5) * g
def kos():
    t = tt(2.6); return np.tanh(((sweep(120, 38, 2.6, 9) + .5 * np.sin(2 * np.pi * 32 * t)) * np.exp(-t * 1.6) + ff(noise(2.6), hi=500) * np.exp(-t * 7) * .8) * 2.2)
def snare(g=1.0):
    t = tt(.3); return (ff(noise(.3), 1200, 9000) * np.exp(-t * 22) + sweep(260, 180, .3, 40) * np.exp(-t * 30) * .5) * g
def tick(hi=True):
    t = tt(.06); return np.sin(2 * np.pi * (2400 if hi else 1800) * t) * np.exp(-t * 120) + ff(noise(.06), 3000) * np.exp(-t * 200) * .3
def shot():
    t = tt(1.8); crack = ff(noise(1.8), 800) * np.exp(-t * 60); body = sweep(180, 50, 1.8, 25) * np.exp(-t * 8)
    tail = ff(noise(1.8), 200, 2500) * np.exp(-t * 2.5) * .25; return np.tanh((crack * 1.4 + body + tail) * 2.0)
def explosion():
    t = tt(3.0); return np.tanh((ff(noise(3.0), hi=900) * np.exp(-t * 2.2) * 1.2 + sweep(90, 30, 3.0, 6) * np.exp(-t * 1.5)) * 2.5)
def cannon(): return explosion() * .9 + np.pad(kos()[: int(3.0 * SR)], (0, max(0, int(3.0 * SR) - len(kos()))))[: int(3.0 * SR)] * .5
def page():
    t = tt(.45); return ff(noise(.45), 1500, 7000) * np.sin(np.pi * t / .45) ** 2 * .6
def brake():
    t = tt(1.2); f = 2400 - 900 * t; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * .3 + ff(noise(1.2), 1500, 5000) * .3) * np.exp(-t * 2) * np.minimum(1, t * 20)
def clink(f0=1870):
    t = tt(.35); return sum(np.sin(2 * np.pi * f0 * m * t) * a for m, a in ((1, 1), (1.57, .7), (2.36, .5), (3.2, .3))) * np.exp(-t * 18)
def chain():
    out = np.zeros(int(1.4 * SR))
    for i in range(10):
        s = clink(1700 + rnd.random() * 400) * (1 - i / 12); j = int((i * .09 + rnd.random() * .04) * SR); out[j: j + len(s)] += s[: len(out) - j]
    return out * .45
def coins():
    out = np.zeros(int(1.6 * SR))
    for i in range(12):
        s = clink(3200 + rnd.random() * 1600) * .5; j = int((i * .11 + rnd.random() * .06) * SR); out[j: j + len(s)] += s[: len(out) - j]
    return out
def stamp():
    t = tt(.5); return np.tanh((sweep(140, 55, .5, 22) * np.exp(-t * 12) + ff(noise(.5), hi=1500) * np.exp(-t * 40)) * 2)
def quill():
    t = tt(1.2); return ff(noise(1.2), 2500, 8000) * (.4 + .6 * np.abs(np.sin(2 * np.pi * 3.5 * t))) * np.exp(-t * .8) * .25
def horn():
    t = tt(2.6); f = 98 * (1 + .003 * np.sin(2 * np.pi * 5 * t)); ph = 2 * np.pi * np.cumsum(f) / SR
    s = sum(np.sin(ph * h) / h for h in range(1, 9)); env = np.minimum(1, t * 6) * np.minimum(1, (2.6 - t) * 3)
    return ff(s, 60, 1800) * env * .5
def morse(sec):
    out = np.zeros(int(sec * SR)); x = 0.0
    while x < sec - .2:
        d = .06 if rnd.random() < .6 else .18; j = int(x * SR); n = int(d * SR)
        out[j: j + n] += np.sin(2 * np.pi * 820 * np.arange(n) / SR) * np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / 80)
        x += d + (.06 if rnd.random() < .7 else .22)
    return out * .35
def pad(freqs, sec, cutoff=900, vib=0.0):
    t = tt(sec); s = np.zeros_like(t)
    for f in freqs:
        for d in (-.12, 0, .12):
            ph = 2 * np.pi * np.cumsum(np.full_like(t, f * (1 + d / 100)) * (1 + vib * np.sin(2 * np.pi * 5 * t))) / SR
            s += 2 * ((ph / (2 * np.pi)) % 1) - 1
    s = ff(s, 40, cutoff) / (len(freqs) * 3); env = np.clip(np.minimum(t / 1.0, (sec - t) / .8), 0, 1)
    return s * env
def oud(freq, sec=.9):
    n = int(sec * SR); p = int(SR / freq); buf = rnd.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = .996 * (.5 * buf[i % p] + .5 * buf[(i + 1) % p])
    t = tt(sec); return ff(out, 90, 4000) * np.minimum(1, t * 400) * np.exp(-t * 2)
def riser(sec):
    t = tt(sec); k = t / sec; return (ff(noise(sec), 400, 7000) * .5 + np.sin(2 * np.pi * np.cumsum(150 + 600 * k ** 2) / SR) * .25) * k ** 2.2
def whoosh(sec=.6):
    t = tt(sec); env = np.sin(np.pi * t / sec) ** 2; k = t / sec
    return (ff(noise(sec), 200, 1200) * (1 - k) + ff(noise(sec), 1500, 6000) * k) * env

DM = [73.42, 110.0, 146.83]          # re minör kök
HICAZ = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 523.25, 587.33]
OUDC = {}
def oudn(f):
    if f not in OUDC: OUDC[f] = oud(f)
    return OUDC[f]

# ---------------- müzik bölümleri ----------------
for m in CUES["music"]:
    a, b, st = m["t0"], m["t1"], m["style"]; L = b - a
    if L <= .05: continue
    if st.startswith("trk:"):
        off = m.get("offset")
        if m.get("sync"): off = max(0.0, m["sync"][1] - (m["syncT"] - a))   # parçanın sync[1]. saniyesi sync[0] çapasına denk gelsin
        ok = sesler.track(music, st[4:], a, b, m.get("gain", .8), tuple(m.get("layers", ["tam"])), off)
        if ok: continue
        st = m.get("fallback", "lib:theme"); print(f"uyarı: {m['style']} parçası yok → {st}")
    if st in sesler.STYLES:
        sesler.STYLES[st](music, a, b); continue
    if st == "dread":
        add(music, a, pad(DM, L + .8, 450), .55)
        for x in np.arange(a + .6, b, 1.3): add(music, x, kos() * .25, .5, pan=rnd.uniform(-.6, .6))
    elif st == "clock":
        add(music, a, pad([73.42, 77.78], L + .6, 500), .35)
        for i, x in enumerate(np.arange(a, b, .5)): add(music, x, tick(i % 2 == 0), .35)
    elif st == "tension":
        add(music, a, pad([73.42, 110.0], L + .6, 700), .4)
        for i, x in enumerate(np.arange(a, b, .25)): add(music, x, pad([146.83 if i % 4 else 155.56], .22, 1500), .18)
        for i, x in enumerate(np.arange(a, b, .5)): add(music, x, tick(i % 2 == 0), .18)
    elif st == "pulse":
        add(music, a, pad([73.42, 110.0, 174.61], L + .8, 800), .42)
        for x in np.arange(a, b, .9): add(music, x, timpani(55, .5), .6); add(music, x + .22, timpani(55, .3), .5)
    elif st == "telegraph":
        add(music, a, pad([73.42, 110.0], L + .6, 600), .35); add(music, a + .2, morse(L - .2), .5, pan=.3)
        for i, x in enumerate(np.arange(a, b, .5)): add(music, x, tick(i % 2 == 0), .25)
    elif st == "march":
        add(music, a, pad([73.42, 110.0, 146.83, 174.61], L + .8, 1400), .4)
        x, beat = a, .52
        while x < b - .05:
            k = (x - a) / L; bt = beat * (1 - .25 * k)
            add(music, x, timpani(62, .7), .55); add(music, x + bt, snare(.6), .4); add(music, x + bt * 1.5, snare(.4), .3); add(music, x + bt * 2, timpani(62, .5), .45)
            for r in range(4): add(music, x + bt * 3 + r * bt / 4, snare(.35 + .1 * r), .3)
            x += bt * 4
    elif st == "oriental":
        add(music, a, pad([73.42, 110.0], L + .8, 600), .35)
        notes = [0, 1, 2, 1, 0, 6, 0, 4]
        for i, x in enumerate(np.arange(a + .3, b - .2, .42)): add(music, x, oudn(HICAZ[notes[i % len(notes)]] / 2), .3, pan=.25 if i % 2 else -.25)
    elif st == "battle":
        add(music, a, pad([73.42, 110.0, 146.83], L + .8, 1600), .45)
        for x in np.arange(a, b, .6): add(music, x, timpani(58, .8), .6)
    elif st == "elegy":
        add(music, a, pad([73.42, 110.0, 174.61, 220.0], L + 1.0, 1200, vib=.002), .45)
        notes = [4, 2, 1, 0, 1, 2, 0]
        for i, x in enumerate(np.arange(a + .5, b - 1.0, 1.1)): add(music, x, oudn(HICAZ[notes[i % len(notes)]]), .26)

SFX = {"boom": (kos, .55), "explosion": (explosion, .75), "page": (page, .5), "brake": (brake, .5), "shot": (shot, .9), "chain": (chain, .8),
       "timpani": (lambda: timpani(65, 1.0), .8), "quill": (quill, .6), "coins": (coins, .55), "stamp": (stamp, .7), "horn": (horn, .6), "cannon": (cannon, .8)}
for h in CUES["hits"]:
    if "/" in h["sfx"]: sesler.put(sfx, h["t"] - .01, sesler.fade(sesler.lib(h["sfx"]), .003, 1.0), .9 * h.get("gain", 1)); continue
    fn, g = SFX[h["sfx"]]; add(sfx, h["t"] - .01, fn(), g * h.get("gain", 1))
for r in CUES.get("risers", []):   # yükselen ses: sonu çapaya oturur
    x = sesler.lib(r["sfx"]); n = int(r.get("len", 2.2) * SR); x = x[:n] if len(x) > n else x
    sesler.put(sfx, r["t"] - len(x) / SR, sesler.fade(x, .8, .05), r.get("gain", .4))
LIBMODE = any("/" in h["sfx"] for h in CUES["hits"]) or any(m["style"].startswith(("lib:", "trk:")) for m in CUES["music"])
for tr in CUES["transitions"]: add(sfx, tr["t"] - .3, ff(whoosh(.6), hi=1800) if LIBMODE else whoosh(.6), .2 if LIBMODE else .28, pan=.3 if tr["type"] == "whip" else 0)
# rüzgâr zemini
wind = ff(np.cumsum(rnd.standard_normal(N)) * .002, 30, 600); wind /= np.abs(wind).max()
amb[:, 0] += wind * .05; amb[:, 1] += np.roll(wind, 900) * .05

# ---------------- seslendirme + ducking ----------------
vo = np.zeros(N)
if VO_CLIPS:
    for t0, v in VO_CLIPS: j = int(t0 * SR); vo[j: j + len(v)] += v[: N - j]
    vo = vo / np.abs(vo).max() * .85
    env = movavg(np.abs(vo), int(.05 * SR))
    env = movavg((env > .02).astype(float), int(.3 * SR))
    # konuşma altında müzik: kütüphane modunda EP.duckDb (varsayılan 15 dB; anlatıcı müziğin 10–15 dB üstünde), eski bölümlerde ~7 dB
    depth = 1 - 10 ** (-EP.get("duckDb", 15) / 20) if LIBMODE else .55
    duck = 1 - depth * np.clip(env, 0, 1); music *= duck[:, None]; amb *= duck[:, None]; sfx *= (1 - .3 * np.clip(env, 0, 1))[:, None]

ir_t = tt(2.2); ir = rnd.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 2.8)[:, None]; ir[0] = 1
def reverb(x, wet):
    n = 1 << (len(x) + len(ir) - 1).bit_length()
    out = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], n) * np.fft.rfft(ir[:, c], n), n)[: len(x)] for c in range(2)], 1)
    return x * (1 - wet) + out / (np.abs(out).max() + 1e-9) * np.abs(x).max() * wet

if LIBMODE:   # kütüphane modu: bütün sesler aynı odada, tiz raf ile yumuşatılmış
    mix = sesler.soften(sesler.room(music * .85 + sfx, .18) + amb)
else:
    mix = reverb(music, .25) * .85 + reverb(sfx, .2) + amb
e = int(DUR * SR); fade = np.ones(N); fade[e - int(1.5 * SR): e] = np.linspace(1, 0, int(1.5 * SR)); fade[e:] = 0
if LIBMODE:   # −14 LUFS, tepe ≤ −1 dBFS; ölçüm için ara katmanlar audio/_arka.wav ve audio/_vo.wav
    bg = mix * fade[:, None]; full = bg + (np.stack([vo, vo], 1) * 1.15 * fade[:, None] if VO_CLIPS else 0)
    mix, g = sesler.master(full[:e])
    for name, sig in (("_arka", bg[:e] * g),) + ((("_vo", np.stack([vo, vo], 1)[:e] * 1.15 * g),) if VO_CLIPS else ()):
        with wave.open(os.path.join(EPD, "audio", name + ".wav"), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(sig, -1, 1) * 32767).astype(np.int16).tobytes())
    print(f"mastering: {sesler.lufs(mix):.1f} LUFS, tepe {20 * np.log10(np.abs(mix).max()):.1f} dBFS")
else:
    if VO_CLIPS: mix += np.stack([vo, vo], 1) * 1.15
    mix = np.tanh(mix * fade[:, None] / np.abs(mix).max() * 2.0) * .89
    mix = mix[:e]
wav = os.path.join(EPD, "audio", "final.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-c:a", "aac", "-b:a", "192k", os.path.join(EPD, "audio", "final.m4a")], check=True)
print(f"tamam: {wav} · {DUR:.1f} sn · seslendirme {'VAR' if VO_CLIPS else 'yok'}")
