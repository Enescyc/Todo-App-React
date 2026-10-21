/* Tarih Reels ortak motoru – 1080x1920 deterministik canvas animasyonu.
 * Bölüm dosyaları: timeline.js (window.EP: paragraflar, sahne/geçiş/vuruş/müzik çapaları)
 *                  scenes.js   (window.SCENE_FNS: sahne çizim fonksiyonları)
 * Zamanlar saniye değil "çapa" ile verilir: "p2", "p2.end", "p2:bomba", "p2:savaş#2+0.3", "end", sayı.
 * Seslendirme gelince (audio/vo_timing.js → window.VO) bütün çapalar gerçek kelime zamanlarına oturur. */
'use strict';
const W = 1080, H = 1920, TAU = Math.PI * 2;
const EP = window.EP, VO = window.VO || null;

/* ================= yardımcılar ================= */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eIO = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eOut = k => 1 - Math.pow(1 - k, 3);
const eIn = k => k * k * k;
const eBack = k => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
function rng(s) { return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function hexRGB(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
function mix(a, b, k) { const A = hexRGB(a), B = hexRGB(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function rgba(hex, a) { const [r, g, b] = hexRGB(hex); return `rgba(${r},${g},${b},${a})`; }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
let ctx = document.getElementById('c').getContext('2d');
function lg(x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rg(x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function glow(x, y, r, col, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.fillStyle = rg(x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
function tracePath(p) { ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); }
function spline(pts, n = 10) {
  const out = [], P = i => pts[clamp(i, 0, pts.length - 1)];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let j = 0; j < n; j++) { const s = j / n, s2 = s * s, s3 = s2 * s; out.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * s + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * s2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * s3))); }
  }
  out.push(pts[pts.length - 1]); return out;
}
function polyLen(p) { const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return L; }
function pointAt(p, L, k) { const d = k * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++; const f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [lerp(p[i - 1][0], p[i][0], f), lerp(p[i - 1][1], p[i][1], f), Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0])]; }
// anahtar karelerden yumuşak değer: keys = [[t, a, b, ...], ...]
function keyed(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i], k = eIO(seg(t, a[0], b[0])); return a.slice(1).map((v, j) => lerp(v, b[j + 1], k)); }
  return keys[keys.length - 1].slice(1);
}

/* ================= kamera ve hareket ================= */
// monoton kübik (Fritsch–Carlson): anahtar karelerde hız sıfırlanmaz, aşma (overshoot) olmaz; uçlarda durağan başlar/biter
function mono(ts, vs, t) {
  const n = ts.length; if (n === 1 || t <= ts[0]) return vs[0]; if (t >= ts[n - 1]) return vs[n - 1];
  const d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((vs[i + 1] - vs[i]) / (ts[i + 1] - ts[i]));
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) { if (!d[i]) { m[i] = m[i + 1] = 0; continue; } const a = m[i] / d[i], b = m[i + 1] / d[i], q = a * a + b * b; if (q > 9) { const k = 3 / Math.sqrt(q); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; } }
  let i = 0; while (t > ts[i + 1]) i++;
  const h = ts[i + 1] - ts[i], u = (t - ts[i]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * vs[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * vs[i + 1] + (u3 - u2) * h * m[i + 1];
}
// kamera yolu: keys = [[t, x, y, zoom], ...]. Zoom log uzayında (algıda eşit hız). o.creep: son karede saniyede bu oranda yavaş itme (ör. .02)
function camPath(keys, t, o = {}) {
  const ts = keys.map(k => k[0]), z = Math.exp(mono(ts, keys.map(k => Math.log(k[3])), t));
  const hold = o.creep ? 1 + o.creep * Math.max(0, t - ts[ts.length - 1]) : 1;
  return [mono(ts, keys.map(k => k[1]), t), mono(ts, keys.map(k => k[2]), t), z * hold];
}
// uzak iki nokta arası "uzaklaş → kay → yakınlaş" uçuşu (van Wijk & Nuij 2003). a, b = [x, y, zoom]; k 0..1 (dışarıda yumuşatın: eIO(seg(...)))
function flyTo(a, b, k, rho = 1.4) {
  const w0 = W / a[2], w1 = W / b[2], dx = b[0] - a[0], dy = b[1] - a[1], d2 = dx * dx + dy * dy, r2 = rho * rho;
  if (d2 < 1e-6) return [a[0], a[1], W / (w0 * Math.exp(Math.log(w1 / w0) * k))];
  const d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + r2 * r2 * d2) / (2 * w0 * r2 * d1), b1 = (w1 * w1 - w0 * w0 - r2 * r2 * d2) / (2 * w1 * r2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), S = (r1 - r0) / rho, s = k * S;
  const u = w0 / (r2 * d1) * (Math.cosh(r0) * Math.tanh(rho * s + r0) - Math.sinh(r0));
  return [a[0] + u * dx, a[1] + u * dy, W / (w0 * Math.cosh(r0) / Math.cosh(rho * s + r0))];
}
// kapalı formda sönümlü yay (0 → 1, doğal aşma). freq Hz, damp 0..1
function spring(t, t0, o = {}) {
  const d = t - t0; if (d <= 0) return 0;
  const w = TAU * (o.freq || 2.2), z = o.damp ?? .45, wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * d) * (Math.cos(wd * d) + z * w / wd * Math.sin(wd * d));
}
// hedefi birçok kez değişen değer: steps = [[t, değer], ...] → her değişim için bir yay toplanır (durum taşımadan, deterministik)
function springSeq(t, steps, o = {}) { let v = steps[0][1]; for (let i = 1; i < steps.length; i++) v += (steps[i][1] - steps[i - 1][1]) * spring(t, steps[i][0], o); return v; }
// el kamerası kayması: iki oktav değer gürültüsü (piksel)
const vnoise = x => { const i = Math.floor(x), f = x - i, h = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }, u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u) * 2 - 1; };
const handheld = (t, amp = 4) => [amp * (vnoise(t * .7) + .5 * vnoise(t * 1.9 + 7)), amp * (vnoise(t * .6 + 3) + .5 * vnoise(t * 1.7 + 11))];

/* ================= zamanlama: paragraf → kelime → çapa ================= */
const trLower = s => s.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]/gu, '');
const syll = w => /\d/.test(w) ? w.replace(/\D/g, '').length * 1.7 : Math.max(1, (w.match(/[aeıioöuüâîûAEIİOÖUÜÂÎÛ]/g) || []).length);
const TIMING = (() => {
  const RATE = EP.rate || 5.4, paras = [];
  let t = EP.lead ?? .4;
  EP.paras.forEach((P, pi) => {
    const words = P.text.split(/\s+/).filter(Boolean);
    let wt;
    if (VO && VO.paras && VO.paras[pi]) { wt = VO.paras[pi].words; t = VO.paras[pi].t0; }
    else {
      wt = []; let x = t;
      for (const w of words) { const d = syll(w) / RATE; wt.push([x, x + d]); x += d + (/[.!?:;]$/.test(w) ? .42 : /[,—]$/.test(w) ? .2 : .03); }
    }
    paras.push({ words, wt, t0: wt[0][0], t1: wt[wt.length - 1][1] });
    t = (VO && VO.paras && VO.paras[pi + 1]) ? VO.paras[pi + 1].t0 : paras[pi].t1 + (EP.gap ?? .55);
  });
  const dur = VO && VO.duration ? VO.duration : paras[paras.length - 1].t1 + (EP.tail ?? 2.6);
  return { paras, dur };
})();
const DUR = TIMING.dur;
const CUE_CACHE = {};
function cue(c) {
  if (typeof c === 'number') return c;
  if (c in CUE_CACHE) return CUE_CACHE[c];
  const m = /^(?:(end)|p(\d+)(?:\.(end))?(?::([^#+\-]+)(?:#(\d+))?)?)([+\-][\d.]+)?$/u.exec(c);
  if (!m) throw new Error('çapa okunamadı: ' + c);
  let v;
  if (m[1]) v = DUR;
  else {
    const P = TIMING.paras[+m[2] - 1]; if (!P) throw new Error('paragraf yok: ' + c);
    if (m[3]) v = P.t1;
    else if (m[4]) {
      const key = trLower(m[4]), nth = +(m[5] || 1); let n = 0, idx = -1;
      P.words.forEach((w, i) => { if (idx < 0 && trLower(w).startsWith(key) && ++n === nth) idx = i; });
      if (idx < 0) throw new Error('kelime bulunamadı: ' + c);
      v = P.wt[idx][0];
    } else v = P.t0;
  }
  return (CUE_CACHE[c] = v + (m[6] ? parseFloat(m[6]) : 0));
}

/* ================= metin ================= */
const F = { anton: '"Anton", Impact, sans-serif', cinzel: '"Cinzel", "DejaVu Serif", serif', mont: '"Montserrat", "DejaVu Sans", sans-serif', mono: '"DejaVu Sans Mono", monospace' };
const up = s => s.toLocaleUpperCase('tr-TR');
function setFont(size, fam = F.anton, w = 400) { ctx.font = `${w} ${size}px ${fam}`; }
function title(s, x, y, size, o = {}) {
  ctx.save(); setFont(size, o.fam || F.anton, o.w || 400); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  if (o.spacing) ctx.letterSpacing = o.spacing + 'px';
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = size * .25; ctx.shadowOffsetY = size * .06;
  if (o.stroke !== false) { ctx.lineJoin = 'round'; ctx.lineWidth = size * (o.sw || .12); ctx.strokeStyle = o.strokeCol || '#120a06'; ctx.strokeText(s, x, y); }
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = o.gold ? lg(0, y - size * .5, 0, y + size * .5, [[0, '#fff4c2'], [.45, '#f2c75c'], [.55, '#d89a2b'], [1, '#ffe08a']]) : (o.col || '#fff');
  ctx.fillText(s, x, y); ctx.restore();
}
function kinetic(s, x, y, size, t, t0, o = {}) {
  const t1 = o.out ?? 1e9; if (t < t0 || t > t1 + .3) return;
  const outK = eIO(seg(t, t1, t1 + .3));
  if (o.mode === 'letters') {
    setFont(size, o.fam || F.anton, o.w || 400); const sp = o.spacing || 0;
    const chars = [...s], widths = chars.map(c => ctx.measureText(c).width + sp), total = widths.reduce((a, b) => a + b, 0);
    let cx = x - total / 2;
    chars.forEach((c, i) => { const k = eBack(seg(t, t0 + i * .03, t0 + i * .03 + .35)); ctx.save(); ctx.globalAlpha = clamp(k) * (1 - outK); ctx.translate(cx + widths[i] / 2, y + (1 - k) * size * .5 - outK * 40); title(c, 0, 0, size, { ...o, spacing: 0 }); ctx.restore(); cx += widths[i]; });
    return;
  }
  const k = seg(t, t0, t0 + .38), s1 = o.mode === 'slam' ? lerp(2.2, 1, eOut(k)) : o.mode === 'fade' ? 1 : eBack(k);
  ctx.save(); ctx.globalAlpha = clamp(k * 2.5) * (1 - outK); ctx.translate(x, y - outK * 40 + (o.mode === 'fade' ? (1 - eOut(k)) * 30 : 0)); ctx.rotate(o.rot || 0); ctx.scale(s1, s1); title(s, 0, 0, size, o); ctx.restore();
}
function stamp(s, x, y, size, t, t0, col = '#9b1c1c', rot = -.08) {
  const k = seg(t, t0, t0 + .25); if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const sc = lerp(2.4, 1, eOut(k)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 3) * .92;
  setFont(size, F.cinzel, 900); ctx.letterSpacing = size * .08 + 'px'; const w = ctx.measureText(s).width + size * .9;
  ctx.strokeStyle = col; ctx.lineWidth = size * .07; ctx.strokeRect(-w / 2, -size * .78, w, size * 1.56); ctx.lineWidth = size * .025; ctx.strokeRect(-w / 2 + 10, -size * .78 + 10, w - 20, size * 1.56 - 20);
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, size * .05); ctx.restore();
}
// eski telgraf/daktilo yazısı – harf harf
function typewriter(lines, x, y, size, t, t0, cps = 26, col = '#2a1a0c') {
  setFont(size, F.mono, 700); ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  let n = Math.floor((t - t0) * cps); if (n <= 0) return 0;
  lines.forEach((l, i) => { const s = l.slice(0, Math.max(0, n)); n -= l.length + 3; ctx.fillText(s, x, y + i * size * 1.45); });
  return n;
}

/* ================= altyazı: anlam gruplarıyla karaoke ================= */
const CAPS = (() => {
  const out = [];
  TIMING.paras.forEach((P, pi) => {
    const hl = (EP.paras[pi].hl || []).map(trLower); let cur = [];
    P.words.forEach((w, i) => {
      cur.push({ w, t: P.wt[i][0], hl: hl.some(h => trLower(w).startsWith(h)) });
      const len = cur.map(c => c.w).join(' ').length, last = i === P.words.length - 1, nextLen = last ? 0 : P.words[i + 1].length;
      if (last || /[.,:;!?—]$/.test(w) || cur.length >= 4 || len + nextLen > 22) { out.push({ words: cur, t0: cur[0].t, t1: last ? P.t1 + .25 : P.wt[i + 1][0] }); cur = []; }
    });
  });
  return out;
})();
function captions(t, y = 1360) {
  const c = CAPS.find(c => t >= c.t0 && t < c.t1); if (!c) return;
  const size = 68, k = eBack(seg(t, c.t0, c.t0 + .16));
  ctx.save(); setFont(size, F.mont, 900); ctx.textBaseline = 'middle';
  const parts = c.words.map(w => up(w.w)), sp = ctx.measureText(' ').width, ws = parts.map(p => ctx.measureText(p).width);
  const total = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1), scale = Math.min(1, 900 / total);
  ctx.translate(W / 2 - 30, y); ctx.scale(scale * (.88 + .12 * k), scale * (.88 + .12 * k)); ctx.globalAlpha = clamp(k * 2);
  let x = -total / 2;
  c.words.forEach((w, i) => {
    const active = t >= w.t, now = active && (i === c.words.length - 1 || t < c.words[i + 1].t), pk = now ? eBack(seg(t, w.t, w.t + .14)) : 1;
    ctx.save(); ctx.translate(x + ws[i] / 2, 0); const s = now ? .92 + .1 * pk : 1; ctx.scale(s, s);
    ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 15; ctx.strokeStyle = '#000'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 16;
    ctx.strokeText(parts[i], 0, 0); ctx.shadowBlur = 0;
    ctx.fillStyle = w.hl && active ? '#ffcf4a' : active ? '#fff' : 'rgba(255,255,255,.5)'; ctx.fillText(parts[i], 0, 0); ctx.restore();
    x += ws[i] + sp;
  });
  ctx.restore();
}

/* ================= son işlem: gren, vinyet, eski film ================= */
const GRAIN = (() => { const c = mkCanvas(512, 512), g = c.getContext('2d'), d = g.createImageData(512, 512), r = rng(3); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; })();
function grain(t, a = .07) {
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a; const f = Math.floor(t * 24);
  ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.translate(-(f * 137) % 512, -(f * 251) % 512); ctx.fillRect(0, 0, W + 512, H + 512); ctx.restore();
}
function vignette(a = .6) { ctx.fillStyle = rg(W / 2, H * .45, H * .3, H * .78, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${a})`]]); ctx.fillRect(0, 0, W, H); }
// 1914 film havası: sepya tonlama, titreşim, çizik ve toz
function oldFilm(t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = .55 * a; ctx.globalCompositeOperation = 'color'; ctx.fillStyle = '#a07a48'; ctx.fillRect(0, 0, W, H); ctx.restore();
  const f = Math.floor(t * 24), r = rng(f * 7 + 1);
  ctx.save(); ctx.globalAlpha = a * (.04 + .04 * r()); ctx.fillStyle = r() > .5 ? '#fff' : '#000'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.globalAlpha = .35 * a; ctx.strokeStyle = '#f4e8cc'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 2; i++) if (r() > .45) { const x = r() * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (r() - .5) * 20, H); ctx.stroke(); }
  ctx.fillStyle = '#1a120a'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(r() * W, r() * H, r() * 3 + .5, 0, TAU); ctx.fill(); }
  ctx.restore();
}
const hitPulse = (t, at, len = .35) => { const d = t - at; return d >= 0 && d < len ? Math.pow(1 - d / len, 2) : 0; };
// vuruş sarsıntısı: sönümlü sinüs (yönü vuruşa göre sabit) + kısa zoom tepmesi (×1.0x). Döner: [dx, dy, zoomÇarpanı]
function shakeAt(t) {
  let x = 0, y = 0, z = 1;
  for (const h of HITS_R) { const d = t - h.t; if (d >= 0 && d < .7 && h.amp) { const e = Math.exp(-d * 7), a = h.amp * e, ang = h.t * 2.399; x += Math.cos(ang) * Math.sin(d * TAU * 9) * a; y += Math.sin(ang) * Math.sin(d * TAU * 9 + 1.1) * a; z += .0022 * h.amp * Math.exp(-d * 5) * (1 - Math.exp(-d * 60)); } }
  return [x, y, z];
}
function brand() {
  ctx.save(); ctx.fillStyle = 'rgba(10,6,4,.55)'; ctx.beginPath(); ctx.roundRect(54, 96, 360, 58, 29); ctx.fill();
  ctx.strokeStyle = 'rgba(242,199,92,.6)'; ctx.lineWidth = 2; ctx.stroke();
  setFont(28, F.cinzel, 900); ctx.fillStyle = '#f2c75c'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('TARİH REELS', 84, 126);
  setFont(22, F.mont, 800); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText('· ' + (EP.badge || ''), 296, 127); ctx.restore();
}

/* ================= harita modülü (EUROPE1914 ya da AB_MAP, birim km) ================= */
const GEO = window.EUROPE1914 || window.AB_MAP;
const PATHS = (() => {
  if (!GEO) return null;
  const mk = polys => { const p = new Path2D(); for (const poly of polys) for (const r of poly) { for (let i = 0; i < r.length; i += 2) i ? p.lineTo(r[i], r[i + 1]) : p.moveTo(r[i], r[i + 1]); p.closePath(); } return p; };
  const ln = ls => { const p = new Path2D(); for (const r of ls) for (let i = 0; i < r.length; i += 2) i ? p.lineTo(r[i], r[i + 1]) : p.moveTo(r[i], r[i + 1]); return p; };
  const src = GEO.states ? Object.fromEntries(Object.entries(GEO.states).map(([k, v]) => [k, v.polys])) : GEO.units;
  const st = {}; for (const k in src) st[k] = mk(src[k]);
  return {
    st, other: mk(GEO.other || []),
    edges: (GEO.edges || []).map(([a, b, ls]) => ({ a, b, p: ln(ls) })),
    coast: GEO.coast ? ln(GEO.coast) : null, lakes: GEO.lakes ? mk(GEO.lakes) : null,
    rivers: Object.fromEntries(Object.entries(GEO.rivers || {}).map(([k, v]) => [k, ln(v)])),
  };
})();
const W2S = (cam, x, y) => [W / 2 + (x - cam[0]) * cam[2], H / 2 + (y - cam[1]) * cam[2]];
function inWorld(cam, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); fn(); ctx.restore(); }
const BLOC = { central: '#9c2a24', entente: '#2f5f95', neutral: '#cdbf9c', paper: '#e3d3ac' };
// fill(k) -> renk ya da null (kâğıt rengi)
function drawMap(t, cam, o = {}) {
  ctx.fillStyle = o.sea || '#7f9fa6'; ctx.fillRect(0, 0, W, H);
  // deniz çizgileri (gravür)
  ctx.save(); ctx.globalAlpha = .12; ctx.strokeStyle = '#1d3540'; ctx.lineWidth = 1.2;
  for (let y = -40; y < H + 40; y += 18) { ctx.beginPath(); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, y + Math.sin(x * .01 + y * .3 + t * .4) * 3); ctx.stroke(); }
  ctx.restore();
  inWorld(cam, () => {
    const z = cam[2];
    ctx.lineJoin = 'round';
    // kıyı halesi
    ctx.strokeStyle = 'rgba(235,240,225,.35)'; ctx.lineWidth = 14 / z;
    ctx.stroke(PATHS.other); for (const k in PATHS.st) ctx.stroke(PATHS.st[k]);
    ctx.fillStyle = o.land || BLOC.paper; ctx.fill(PATHS.other, 'evenodd');
    for (const k in PATHS.st) { ctx.fillStyle = (o.fill && o.fill(k)) || o.land || BLOC.paper; ctx.fill(PATHS.st[k], 'evenodd'); }
    if (o.after) o.after(z);
    ctx.strokeStyle = 'rgba(45,30,15,.75)'; ctx.lineWidth = 1.3 / z;
    ctx.stroke(PATHS.other); for (const k in PATHS.st) ctx.stroke(PATHS.st[k]);
  });
  // kâğıt dokusu
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .18; ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore();
}
function mapLabel(cam, s, x, y, size, o = {}) {
  const [sx, sy] = W2S(cam, x, y); if (sx < -300 || sx > W + 300 || sy < -100 || sy > H + 100) return;
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.translate(sx, sy); ctx.rotate(o.rot || 0);
  setFont(size, o.fam || F.cinzel, 900); ctx.letterSpacing = (o.sp ?? size * .18) + 'px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = size * .3; ctx.lineJoin = 'round'; ctx.strokeStyle = o.halo || 'rgba(240,228,198,.85)'; ctx.strokeText(s, 0, 0);
  ctx.fillStyle = o.col || '#2a1d10'; ctx.fillText(s, 0, 0); ctx.restore();
}
function cityDot(cam, name, o = {}) {
  const p = GEO.cities[name]; const [x, y] = W2S(cam, p[0], p[1]); const r = o.r || 7;
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = o.col || '#1a120a'; ctx.strokeStyle = '#f4e8cc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  if (o.label !== false) { setFont(o.size || 30, F.mont, 800); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(240,228,198,.9)'; const dx = o.align === 'right' ? -16 : 16; ctx.strokeText(o.text || name, x + dx, y); ctx.fillStyle = '#1a120a'; ctx.fillText(o.text || name, x + dx, y); }
  ctx.restore(); return [x, y];
}
// K&G tarzı konik ok (dünya koordinatı)
function arrow(cam, pts, k, w, col, o = {}) {
  if (k <= 0) return;
  const P = spline(pts, 14), L = polyLen(P), end = k * L[L.length - 1], S = [];
  for (let i = 0; i < P.length && L[i] <= end; i++) S.push(P[i]);
  S.push(pointAt(P, L, k)); if (S.length < 2) return;
  const sp = S.map(([x, y]) => W2S(cam, x, y)), ww = w, hl = w * 2.2, n = sp.length, Ls = polyLen(sp), tot = Ls[n - 1], left = [], right = [];
  let cut = n - 1; while (cut > 1 && tot - Ls[cut] < hl) cut--;
  for (let i = 0; i <= cut; i++) { const a = sp[Math.max(0, i - 1)], b = sp[Math.min(n - 1, i + 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), hw = ww * (.35 + .65 * (Ls[i] / tot)) / 2; left.push([sp[i][0] + Math.sin(ang) * hw, sp[i][1] - Math.cos(ang) * hw]); right.push([sp[i][0] - Math.sin(ang) * hw, sp[i][1] + Math.cos(ang) * hw]); }
  const tip = sp[n - 1], base = sp[cut], ang = Math.atan2(tip[1] - base[1], tip[0] - base[0]), hw = ww * 1.1;
  const poly = [...left, [base[0] + Math.sin(ang) * hw, base[1] - Math.cos(ang) * hw], tip, [base[0] - Math.sin(ang) * hw, base[1] + Math.cos(ang) * hw], ...right.reverse()];
  ctx.save(); ctx.translate(0, 6); ctx.fillStyle = 'rgba(30,15,5,.3)'; tracePath(poly); ctx.fill(); ctx.restore();
  ctx.fillStyle = lg(sp[0][0], sp[0][1], tip[0], tip[1], [[0, o.col0 || col], [1, col]]); tracePath(poly); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = o.edge || '#1a0a05'; ctx.lineWidth = 3; ctx.stroke();
}

/* ================= zaman haritası: AB_MAP + sahiplik tablosu (window.OWNERS) =================
 * OWNERS = { pal: {KOD: {c: renk, n: 'AD' | [[yıl,'AD'],...]}}, units: {birim: [[yıl, 'KOD' | 'KOD/v' | null, geçiş_yılı], ...]}, cities: {şehir: [...]} }
 * 'KOD/v' = Osmanlı'ya tabi (kırmızı tarama), 'KOD/m' = Moğollara tabi (koyu tarama). Geçiş yılı (varsayılan 1) boyunca renk yumuşakça değişir;
 * belirsiz tarihler (ör. Edirne 1361–1369) uzun geçişle "adım adım" gösterilir. */
const OWN = window.OWNERS || null;
const ownParse = c => c ? c.split('/') : [null, null];
function ownState(list, Y) {
  let i = -1; for (let j = 0; j < list.length; j++) if (list[j][0] <= Y) i = j;
  const e = list[Math.max(0, i)], [o, v] = ownParse(e[1]), [po, pv] = i > 0 ? ownParse(list[i - 1][1]) : [o, v];
  return { o, v: v || null, po, pv: pv || null, k: i > 0 ? clamp((Y - e[0]) / (e[2] ?? 1)) : 1, y: e[0] };
}
const NEUTRAL = { o: null, v: null, po: null, pv: null, k: 1, y: 0 };
const unitState = (k, Y) => OWN && OWN.units[k] ? ownState(OWN.units[k], Y) : NEUTRAL;
function cityState(name, Y) {
  if (OWN && OWN.cities && OWN.cities[name]) return ownState(OWN.cities[name], Y);
  const u = GEO.cityUnit && GEO.cityUnit[name]; return u ? unitState(u, Y) : NEUTRAL;
}
const ownCol = (c, land) => c && OWN.pal[c] ? OWN.pal[c].c : land;
function ownName(c, Y) { const n = OWN.pal[c] && OWN.pal[c].n; if (!n || typeof n === 'string') return n; let s = n[0][1]; for (const [y, v] of n) if (y <= Y) s = v; return s; }
const HATCH = (() => { const c = mkCanvas(22, 22), g = c.getContext('2d'); g.strokeStyle = '#fff'; g.lineWidth = 5; for (const d of [-22, 0, 22]) { g.beginPath(); g.moveTo(d, 22); g.lineTo(d + 22, 0); g.stroke(); } return c; })();
const HATCH_T = {};
function hatchPattern(col) {
  if (!HATCH_T[col]) { const c = mkCanvas(22, 22), g = c.getContext('2d'); g.drawImage(HATCH, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, 22, 22); HATCH_T[col] = c; }
  return ctx.createPattern(HATCH_T[col], 'repeat');
}
// o: {land, sea, focus:'OSM', dim:0..1 (odak dışı soluklaştırma), rivers:true, riverA, borderA, after(z), glowCol}
function drawTimeMap(t, cam, Y, o = {}) {
  const land = o.land || '#e3d3ac', z = cam[2];
  ctx.fillStyle = o.sea || '#7f9fa6'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .12; ctx.strokeStyle = '#1d3540'; ctx.lineWidth = 1.2;
  for (let y = -40; y < H + 40; y += 18) { ctx.beginPath(); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, y + Math.sin(x * .01 + y * .3 + t * .4) * 3); ctx.stroke(); }
  ctx.restore();
  const S = {}; for (const k in PATHS.st) S[k] = unitState(k, Y);
  inWorld(cam, () => {
    ctx.lineJoin = 'round';
    if (PATHS.coast) { ctx.strokeStyle = 'rgba(235,240,225,.35)'; ctx.lineWidth = 14 / z; ctx.stroke(PATHS.coast); }
    // kâğıt altlık: kaynak verilerin birleşim yerlerindeki ince boşlukları kapatır
    ctx.fillStyle = land; ctx.strokeStyle = land; ctx.lineWidth = 3.5;
    ctx.fill(PATHS.other, 'evenodd'); for (const k in PATHS.st) { ctx.fill(PATHS.st[k], 'evenodd'); ctx.stroke(PATHS.st[k]); }
    for (const k in PATHS.st) {
      const s = S[k]; if (!s.o && !s.po) continue;
      let col = mix(ownCol(s.po, land), ownCol(s.o, land), eIO(s.k));
      if (o.focus && o.dim) { const f = (s.o === o.focus ? eIO(s.k) : 0) + (s.po === o.focus ? 1 - eIO(s.k) : 0); col = mix(col, land, o.dim * (1 - f)); }
      ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 1.5 / z; ctx.fill(PATHS.st[k], 'evenodd'); ctx.stroke(PATHS.st[k]);
    }
    // tabiiyet taraması
    for (const k in PATHS.st) {
      const s = S[k], a = (s.v ? (s.v === s.pv ? 1 : eIO(s.k)) : 0) + (s.pv && s.pv !== s.v ? 1 - eIO(s.k) : 0), v = s.v || s.pv; if (!v || a <= .01) continue;
      const pat = hatchPattern(v === 'm' ? '#3a342c' : '#a8322a'); pat.setTransform(new DOMMatrix().scale(1 / z));
      ctx.save(); ctx.globalAlpha = .5 * a * (o.hatchA ?? 1); ctx.fillStyle = pat; ctx.fill(PATHS.st[k], 'evenodd'); ctx.restore();
    }
    // yeni katılan birimlerde parıltı (geçiş süresince)
    if (o.focus) for (const k in PATHS.st) {
      const s = S[k]; if (s.o !== o.focus || s.po === o.focus || s.k >= 1) continue;
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .55 * Math.sin(Math.PI * s.k); ctx.fillStyle = o.glowCol || '#ffd27a'; ctx.fill(PATHS.st[k], 'evenodd'); ctx.restore();
    }
    if (PATHS.lakes) { ctx.fillStyle = o.sea || '#7f9fa6'; ctx.fill(PATHS.lakes, 'evenodd'); ctx.strokeStyle = 'rgba(40,28,14,.55)'; ctx.lineWidth = 1 / z; ctx.stroke(PATHS.lakes); }
    if (o.rivers !== false) { ctx.strokeStyle = rgba('#4f7480', o.riverA ?? .75); ctx.lineCap = 'round'; ctx.lineWidth = 1.7 / z; for (const k in PATHS.rivers) ctx.stroke(PATHS.rivers[k]); }
    if (o.after) o.after(z, S);
    // sahip sınırları: iki yanın sahibi farklıysa (geçişte yumuşak)
    const bA = o.borderA ?? 1;
    for (const e of PATHS.edges) {
      let str;
      if (e.b === 'other') str = S[e.a].o || S[e.a].po ? 1 : .35;
      else {
        const a = S[e.a], b = S[e.b], dc = a.o !== b.o || a.v !== b.v, dp = a.po !== b.po || a.pv !== b.pv;
        str = lerp(+dp, +dc, eIO(Math.min(a.k, b.k)));
      }
      if (str <= .02) continue;
      ctx.strokeStyle = `rgba(30,18,8,${.22 * str * bA})`; ctx.lineWidth = 5 / z; ctx.stroke(e.p);
      ctx.strokeStyle = `rgba(30,18,8,${.85 * str * bA})`; ctx.lineWidth = 1.8 / z; ctx.stroke(e.p);
    }
    if (PATHS.coast) { ctx.strokeStyle = 'rgba(40,26,12,.85)'; ctx.lineWidth = 1.6 / z; ctx.stroke(PATHS.coast); }
  });
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .18; ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore();
  return S;
}
// sahip adları: her sahibin en büyük bitişik toprağının ağırlık merkezine. o: {only:[kodlar], a, minArea, size:[min,max], col}
const ADJ = (() => { const m = {}; if (GEO && GEO.edges) for (const [a, b] of GEO.edges) if (b !== 'other') { (m[a] = m[a] || []).push(b); (m[b] = m[b] || []).push(a); } return m; })();
function ownerLabels(cam, Y, o = {}) {
  if (!OWN) return; const S = {}, by = {};
  for (const k in PATHS.st) { const s = unitState(k, Y); S[k] = s; if (s.o) (by[s.o] = by[s.o] || []).push(k); }
  for (const c in by) {
    if (o.only && !o.only.includes(c)) continue; const name = ownName(c, Y); if (!name) continue;
    const seen = new Set(), comps = [];
    for (const k of by[c]) { if (seen.has(k)) continue; const q = [k], comp = []; seen.add(k); while (q.length) { const u = q.pop(); comp.push(u); for (const v of ADJ[u] || []) if (!seen.has(v) && S[v].o === c) { seen.add(v); q.push(v); } } comps.push(comp); }
    const best = comps.map(cm => { let A = 0, x = 0, y = 0; for (const u of cm) { const w = GEO.area[u] * eIO(S[u].k) + 1e-3; A += w; x += GEO.centroid[u][0] * w; y += GEO.centroid[u][1] * w; } return { A, x: x / A, y: y / A }; }).sort((p, q) => q.A - p.A)[0];
    if (!best || best.A < (o.minArea ?? 6000)) continue;
    const off = (o.offset && o.offset[c]) || [0, 0], sz = clamp(Math.sqrt(best.A) * cam[2] * .09, ...(o.size || [20, 54]));
    mapLabel(cam, name, best.x + off[0], best.y + off[1], sz, { a: (o.a ?? 1) * clamp((best.A - (o.minArea ?? 6000)) / 4000), col: o.col || '#24170b', halo: o.halo });
  }
}
// sahibinin renginde şehir noktası
function ownCity(cam, name, Y, o = {}) {
  const s = cityState(name, Y), col = mix(ownCol(s.po, '#6b5a40'), ownCol(s.o, '#6b5a40'), eIO(s.k));
  return cityDot(cam, name, { ...o, col });
}

/* ================= bayraklar ve domino taşları ================= */
const FLAGS = {
  DE: (w, h) => { [['#111', 0], ['#f4f4f0', 1], ['#c8102e', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(0, i * h / 3, w, h / 3 + 1); }); },
  AH: (w, h) => { ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h / 2); ctx.fillStyle = '#f2c230'; ctx.fillRect(0, h / 2, w, h / 2); },
  RU: (w, h) => { [['#f4f4f0', 0], ['#1f4aa8', 1], ['#d52b1e', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(0, i * h / 3, w, h / 3 + 1); }); },
  RS: (w, h) => { [['#c6363c', 0], ['#0c4076', 1], ['#f4f4f0', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(0, i * h / 3, w, h / 3 + 1); }); },
  FR: (w, h) => { [['#1f3f99', 0], ['#f4f4f0', 1], ['#e1001f', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(i * w / 3, 0, w / 3 + 1, h); }); },
  BE: (w, h) => { [['#111', 0], ['#f7d117', 1], ['#e0263a', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(i * w / 3, 0, w / 3 + 1, h); }); },
  GB: (w, h) => {
    ctx.fillStyle = '#1f3a7a'; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = h * .2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, h); ctx.moveTo(w, 0); ctx.lineTo(0, h); ctx.stroke();
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = h * .07; ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = h * .3; ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = h * .17; ctx.stroke(); ctx.restore();
  },
  OT: (w, h) => {
    ctx.fillStyle = '#d0101e'; ctx.fillRect(0, 0, w, h); const r = h * .27, cx = w * .43, cy = h / 2;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#d0101e'; ctx.beginPath(); ctx.arc(cx + r * .25, cy, r * .8, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .17 : r * .42; ctx.lineTo(cx + r * 1.02 + Math.cos(a) * rr, cy + Math.sin(a) * rr); } ctx.fill();
  },
};
// ayakta duran / devrilen domino. fall: 0..1, dir: +1 sağa, -1 sola
function domino(x, y, s, code, fall = 0, dir = 1, o = {}) {
  const w = 74 * s, h = 136 * s, d = 18 * s, a = eIn(clamp(fall)) * Math.PI / 2 * dir;
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  ctx.fillStyle = 'rgba(20,10,5,.35)'; ctx.beginPath(); ctx.ellipse(x + Math.sin(a) * h * .5, y + 4, w * .6 + Math.abs(Math.sin(a)) * h * .5, 8 * s, 0, 0, TAU); ctx.fill();
  ctx.translate(x + (dir > 0 ? w / 2 : -w / 2), y); ctx.rotate(a); ctx.translate(dir > 0 ? -w / 2 : w / 2, 0);
  // kalınlık (yan yüz)
  ctx.fillStyle = '#b9ab8c'; ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2 + d, -d * .6); ctx.lineTo(w / 2 + d, -h - d * .6); ctx.lineTo(w / 2, -h); ctx.fill();
  ctx.fillStyle = '#d9cdb0'; ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(-w / 2 + d, -h - d * .6); ctx.lineTo(w / 2 + d, -h - d * .6); ctx.lineTo(w / 2, -h); ctx.fill();
  // ön yüz
  ctx.fillStyle = lg(0, -h, 0, 0, [[0, '#fbf6e8'], [1, '#e2d6b8']]); ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, 8 * s); ctx.fill();
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.save(); ctx.translate(-w / 2 + 8 * s, -h + 10 * s); ctx.beginPath(); ctx.roundRect(0, 0, w - 16 * s, h * .42, 4 * s); ctx.clip(); FLAGS[code](w - 16 * s, h * .42); ctx.restore();
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2 + 10 * s, -h * .5); ctx.lineTo(w / 2 - 10 * s, -h * .5); ctx.stroke();
  setFont(26 * s, F.cinzel, 900); ctx.fillStyle = '#2a1d10'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label || code, 0, -h * .25);
  ctx.restore();
}

/* ================= kurgu: sahneler, geçişler, vuruşlar ================= */
const SCN = EP.scenes.map((s, i) => ({ ...s, t0: i ? cue(s.from) : 0, t1: i < EP.scenes.length - 1 ? cue(EP.scenes[i + 1].from) : DUR }));
const TRN = (EP.transitions || []).map(x => ({ ...x, t: cue(x.at), d: x.d || .25 }));
const HITS_R = (EP.hits || []).map(h => ({ ...h, t: cue(h.at) }));
const bufA = mkCanvas(W, H), bufB = mkCanvas(W, H);
const sceneAt = t => SCN.find(s => t >= s.t0 && t < s.t1) || SCN[SCN.length - 1];
function drawScene(s, t, target) {
  const prev = ctx; ctx = target; if (ctx.reset) ctx.reset(); ctx.save();   // reset: önceki karenin çizim durumu (font, harf aralığı…) sızmasın → determinizm ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
  const [sx, sy, sz] = shakeAt(t); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(1.03 * sz, 1.03 * sz); ctx.translate(-W / 2, -H / 2);
  window.SCENE_FNS[s.id](t, s); ctx.restore(); ctx = prev;
}
function render(t) {
  const out = document.getElementById('c').getContext('2d'), tr = TRN.find(x => Math.abs(t - x.t) < x.d);
  if (out.reset) out.reset(); out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = 1; out.globalCompositeOperation = 'source-over';
  if (!tr) drawScene(sceneAt(t), t, out);
  else {
    const a = sceneAt(tr.t - .001), b = sceneAt(tr.t + .001), k = (t - (tr.t - tr.d)) / (2 * tr.d);
    drawScene(a, t, bufA.getContext('2d')); drawScene(b, t, bufB.getContext('2d'));
    out.fillStyle = '#000'; out.fillRect(0, 0, W, H);
    const blit = (img, alpha, s = 1, dx = 0) => { out.save(); out.globalAlpha = clamp(alpha); out.translate(W / 2 + dx, H / 2); out.scale(s, s); out.drawImage(img, -W / 2, -H / 2); out.restore(); };
    const e = eIO(k);
    if (tr.type === 'flash') { blit(bufA, 1, 1 + e * .25); blit(bufB, e, 1.15 - e * .15); out.fillStyle = `rgba(255,244,220,${Math.pow(1 - Math.abs(2 * k - 1), 2)})`; out.fillRect(0, 0, W, H); }
    else if (tr.type === 'dip') { if (k < .5) blit(bufA, 1 - k * 2); else blit(bufB, k * 2 - 1); }
    else if (tr.type === 'whip') { for (let i = 0; i < 6; i++) { const o = i / 6 * 120 * Math.sin(k * Math.PI); blit(bufA, (1 - e) / 3, 1, -e * W - o); blit(bufB, e / 3, 1, (1 - e) * W - o); } }
    else if (tr.type === 'dive') { blit(bufA, 1 - e, 1 + e * 2.5); blit(bufB, e, .8 + e * .2); }
    else if (tr.type === 'rise') { blit(bufA, 1 - e, 1 - e * .4); blit(bufB, e, 1.6 - e * .6); }
    else { blit(bufA, 1 - e); blit(bufB, e); }
  }
  ctx = out; ctx.setTransform(1, 0, 0, 1, 0, 0);
  const s = sceneAt(t);
  grain(t, .07); vignette(.55); if (s.film !== false && (EP.film ?? true)) oldFilm(t, s.film ?? .6);
  (window.BRAND || brand)(t); if (window.POST) window.POST(t, s); captions(t, EP.capY || 1360);
}
// make_audio.py için çözülmüş zaman çizelgesi
window.exportCues = () => ({
  duration: DUR,
  paras: TIMING.paras.map(p => [p.t0, p.t1]),
  scenes: SCN.map(s => ({ id: s.id, t0: s.t0, t1: s.t1 })),
  transitions: TRN.map(x => ({ t: x.t, type: x.type })),
  hits: HITS_R.map(h => ({ t: h.t, sfx: h.sfx, gain: h.gain ?? 1 })),
  risers: (EP.risers || []).map(r => ({ ...r, t: cue(r.to) })),
  music: (EP.music || []).map(m => ({ ...m, t0: cue(m.from), t1: cue(m.to), syncT: m.sync ? cue(m.sync[0]) : undefined })),
});
window.renderAt = render; window.DUR = DUR;
// hareket bulanıklığı: hızlı anlarda (geçişler + EP.blur aralıkları) n alt kare ortalaması. render.js --mb N ile kullanır
const BLUR_SPANS = [...TRN.map(x => [x.t - x.d, x.t + x.d]), ...(EP.blur || []).map(b => [cue(b.from), cue(b.to)])];
window.blurAt = t => BLUR_SPANS.some(([a, b]) => t >= a && t <= b);
const ACC = mkCanvas(W, H);
window.renderBlurred = (t, n, dt) => {
  const c = document.getElementById('c'), g = ACC.getContext('2d');
  for (let j = 0; j < n; j++) { render(t + (j / (n - 1) - .5) * dt); g.globalAlpha = 1 / (j + 1); g.drawImage(c, 0, 0); }
  const o = c.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.globalAlpha = 1; o.globalCompositeOperation = 'source-over'; o.drawImage(ACC, 0, 0);
};
