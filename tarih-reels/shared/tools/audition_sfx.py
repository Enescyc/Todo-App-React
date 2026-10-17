#!/usr/bin/env python3
"""Ses kütüphanesini dinlemek için: (1) katalog dosyası + zaman listesi, (2) kısa sinematik demo miks."""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.path.join(HERE, "..", "sfx"); OUT = sys.argv[1]; SR = 44100
os.makedirs(OUT, exist_ok=True)
def load(sid):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(LIB, sid + ".flac"), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
def write(x, name):
    p = os.path.join(OUT, name)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-b:a", "192k", p], input=x.astype(np.float32).tobytes(), check=True)
    return p
def fade(x, a=.02, b=.4):
    x = x.copy(); n1, n2 = int(a * SR), min(len(x), int(b * SR)); x[:n1] *= np.linspace(0, 1, n1)[:, None]; x[-n2:] *= np.linspace(1, 0, n2)[:, None]; return x
def pitch(x, semis):  # basit yeniden örnekleme ile perde kaydırma
    r = 2 ** (semis / 12); idx = np.arange(0, len(x) - 1, r)
    return np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in range(2)], 1)

# 1) katalog
cat = json.load(open(os.path.join(LIB, "katalog.json"), encoding="utf-8")); parts, t, lines = [], 0.0, []
for c in cat:
    x = fade(load(c["id"])[: int(6 * SR)]) * .9; parts += [x, np.zeros((int(.8 * SR), 2))]
    lines.append(f"{int(t // 60)}:{t % 60:04.1f}  {c['id']:28s} {c['aciklama']}"); t += len(x) / SR + .8
write(np.concatenate(parts), "1-katalog.mp3"); open(os.path.join(OUT, "1-katalog-zamanlari.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")

# 2) demo miks: Bizans gecesi → gerilim → Osmanlı ritmi → doruk → destan
D = 30; mix = np.zeros((int(D * SR), 2))
def put(sid, at, g=1.0, dur=None, semis=0, fin=.02, fout=.6):
    x = load(sid)
    if semis: x = pitch(x, semis)
    if dur: x = x[: int(dur * SR)]
    x = fade(x, fin, fout) * g; i = int(at * SR); mix[i: i + len(x)] += x[: len(mix) - i]
put("doga/deniz_1", 0, .35, 9, fin=1.5, fout=2)                                   # gece, deniz
put("muzik/kontrbas_D1", 0, .22, 13, fin=2, fout=3); put("muzik/cello_D2", 1, .2, 12, fin=2, fout=3)
put("can/kilise_cani_D3", 2.5, .35, 8)                                             # uzakta Bizans çanı
put("gecis/zil_yay", 5, .25, 6, fin=1.5, fout=2)
put("muzik/cello_tremolo_D2", 8, .3, 6, fin=1, fout=1.5)                           # tehdit yaklaşıyor
for k, tt in enumerate(np.arange(9.5, 15.5, .6)):                                  # def ve darbuka: Osmanlı ritmi
    put("ritim/def_buyuk" if k % 4 == 0 else ("ritim/darbuka_dum" if k % 2 == 0 else "ritim/darbuka_3"), tt, 1.0 + .3 * (k % 4 == 0), 1.2)
put("metal/zincir_surtunme", 12.6, .4, fin=.06)                                             # zincir
put("gecis/zil_kresendo_4s", 12.0, .7, fout=.05)                                   # yükselen zil → doruk
put("vurus/zil_gong", 15.9, 1.3); put("vurus/buyuk_davul_ff", 15.9, 2.2, 6); put("vurus/timpani_alcak", 15.9, 1.8)
put("muzik/korno_D2", 16.4, .2, 12, fin=1.2, fout=3); put("muzik/korno_A2", 17.4, .15, 11, fin=1.5, fout=3)   # destan teması
put("muzik/cello_D2", 16, .2, 13, fin=.8, fout=3); put("muzik/keman_A3", 18, .15, 10, fin=1.5, fout=3)
put("vurus/timpani_rulo", 21, .5, 6, fin=1, fout=.05); put("vurus/gong_mf", 27, 1.0, 3)
# ortak oda: hafif yankı (tüm sesler aynı mekânda) + genel tiz yumuşatma (7 kHz üstü -4 dB)
rng = np.random.default_rng(7); ir_t = np.arange(int(1.8 * SR)) / SR
ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.2)[:, None]; ir[0] = 0
n = 1 << (len(mix) + len(ir)).bit_length()
wet = np.stack([np.fft.irfft(np.fft.rfft(mix[:, c], n) * np.fft.rfft(ir[:, c], n), n)[: len(mix)] for c in range(2)], 1)
mix = mix + wet / np.abs(wet).max() * np.abs(mix).max() * .18
F = np.fft.rfftfreq(len(mix), 1 / SR); shelf = 10 ** (-4 * np.clip(np.log2(np.maximum(F, 1) / 7000), 0, 1) / 20)
mix = np.fft.irfft(np.fft.rfft(mix, axis=0) * shelf[:, None], len(mix), axis=0)
mix = np.tanh(mix / np.abs(mix).max() * 2.4) * .9
f = int(2 * SR); mix[-f:] *= np.linspace(1, 0, f)[:, None]
write(mix, "2-demo-miks.mp3"); print("hazır:", OUT)
