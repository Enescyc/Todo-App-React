/* Gemiler Karadan Yürür – 1080x1920 deterministik animasyon. render(t) her kareyi sıfırdan çizer. */
'use strict';
const W = 1080, H = 1920, TL = window.TL, VO = window.VO, DUR = VO ? VO.duration : TL.duration;
// seslendirme varsa: gerçek ses zamanı -> animasyon zamanı (parça parça doğrusal eşleme)
function toAnim(t) {
  if (!VO) return t; const w = VO.warp;
  for (let i = 1; i < w.length; i++) if (t <= w[i][1]) return w[i - 1][0] + (t - w[i - 1][1]) / (w[i][1] - w[i - 1][1]) * (w[i][0] - w[i - 1][0]);
  return w[w.length - 1][0] + (t - w[w.length - 1][1]);
}
const main = document.getElementById('c');
let ctx = main.getContext('2d');

/* ================= yardımcılar ================= */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eIO = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eOut = k => 1 - Math.pow(1 - k, 3);
const eBack = k => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const TAU = Math.PI * 2;
function rng(s) { return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function hexRGB(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
function mix(a, b, k) { const A = hexRGB(a), B = hexRGB(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join(''); }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function lg(x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rg(x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function glow(x, y, r, col, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.fillStyle = rg(x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
// zaman çizelgesindeki darbelerden kamera sarsıntısı
function shakeAt(t) {
  let x = 0, y = 0;
  for (const h of TL.hits) { const d = t - h.t; if (d >= 0 && d < .5 && h.amp) { const a = h.amp * Math.pow(1 - d / .5, 2); x += Math.sin(d * 90 + h.t) * a; y += Math.cos(d * 77 + h.t * 3) * a; } }
  return [x, y];
}
const hitPulse = (t, at, len = .35) => { const d = t - at; return d >= 0 && d < len ? Math.pow(1 - d / len, 2) : 0; };
// Catmull-Rom ile pürüzsüz çoklu çizgi
function spline(pts, n = 10, closed = false) {
  const out = [], P = i => closed ? pts[(i + pts.length) % pts.length] : pts[clamp(i, 0, pts.length - 1)];
  const last = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let j = 0; j < n; j++) {
      const s = j / n, s2 = s * s, s3 = s2 * s;
      out.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * s + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * s2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * s3)));
    }
  }
  if (!closed) out.push(pts[pts.length - 1]);
  return out;
}
function polyLen(p) { const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return L; }
function pointAt(p, L, k) {
  const d = k * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), a = p[i - 1], b = p[i];
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])];
}
function tracePath(p) { ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); }

/* ================= metin ================= */
const F = { anton: '"Anton", Impact, sans-serif', cinzel: '"Cinzel", "DejaVu Serif", serif', mont: '"Montserrat", "DejaVu Sans", sans-serif' };
const up = s => s.toLocaleUpperCase('tr-TR');
function setFont(size, fam = F.anton, w = 400) { ctx.font = `${w} ${size}px ${fam}`; }
// gölge + kontur + (isteğe bağlı) altın gradyanlı başlık
function title(s, x, y, size, o = {}) {
  ctx.save(); setFont(size, o.fam || F.anton, o.w || 400); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  if (o.spacing) ctx.letterSpacing = o.spacing + 'px';
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = size * .25; ctx.shadowOffsetY = size * .06;
  if (o.stroke !== false) { ctx.lineJoin = 'round'; ctx.lineWidth = size * (o.sw || .12); ctx.strokeStyle = o.strokeCol || '#120a06'; ctx.strokeText(s, x, y); }
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = o.gold ? lg(0, y - size * .5, 0, y + size * .5, [[0, '#fff4c2'], [.45, '#f2c75c'], [.55, '#d89a2b'], [1, '#ffe08a']]) : (o.col || '#fff');
  ctx.fillText(s, x, y); ctx.restore();
}
// kinetik giriş: harf harf düşerek ya da ölçek-pop
function kinetic(s, x, y, size, t, t0, o = {}) {
  const t1 = o.out ?? 1e9; if (t < t0 || t > t1 + .3) return;
  const outK = eIO(seg(t, t1, t1 + .3));
  if (o.mode === 'letters') {
    setFont(size, o.fam || F.anton, o.w || 400); if (o.spacing) ctx.letterSpacing = o.spacing + 'px';
    const chars = [...s], widths = chars.map(c => ctx.measureText(c).width + (o.spacing || 0)), total = widths.reduce((a, b) => a + b, 0);
    let cx = x - total / 2; ctx.letterSpacing = '0px';
    chars.forEach((c, i) => {
      const k = eBack(seg(t, t0 + i * .035, t0 + i * .035 + .35));
      ctx.save(); ctx.globalAlpha = clamp(k) * (1 - outK); ctx.translate(cx + widths[i] / 2, y + (1 - k) * size * .5 - outK * 40);
      title(c, 0, 0, size, { ...o, spacing: 0 }); ctx.restore(); cx += widths[i];
    });
    return;
  }
  const k = seg(t, t0, t0 + .38), s1 = o.mode === 'slam' ? lerp(2.2, 1, eOut(k)) : eBack(k);
  ctx.save(); ctx.globalAlpha = clamp(k * 2.5) * (1 - outK); ctx.translate(x, y - outK * 40); ctx.rotate(o.rot || 0); ctx.scale(s1, s1); title(s, 0, 0, size, o); ctx.restore();
}

/* ================= altyazı (kelime kelime karaoke) ================= */
const syll = w => /\d/.test(w) ? w.replace(/\D/g, '').length * 1.7 : Math.max(1, (w.match(/[aeıioöuüâîûAEIİOÖUÜ]/g) || []).length);
const CAPS = (() => {
  const chunks = [];
  for (const [li, L0] of TL.lines.entries()) {
    const L = VO ? { ...L0, t0: VO.lines[li][0], t1: VO.lines[li][1] } : L0;
    const words = L.text.split(/\s+/), tot = words.reduce((a, w) => a + syll(w) + .6, 0), span = L.t1 - L.t0;
    let acc = 0; const wt = words.map(w => { const a = L.t0 + acc / tot * span; acc += syll(w) + .6; return { w, t: a, hl: L.hl.includes(w.toLocaleLowerCase('tr-TR')) }; });
    let cur = [];
    wt.forEach((x, i) => { cur.push(x); const len = cur.map(c => c.w).join(' ').length; if (cur.length >= 3 || len > 19 || /[.,:!…]$/.test(x.w) || i === wt.length - 1) { chunks.push({ words: cur, t0: cur[0].t, t1: i === wt.length - 1 ? L.t1 + .15 : wt[i + 1].t }); cur = []; } });
  }
  return chunks;
})();
function captions(t) {
  const c = CAPS.find(c => t >= c.t0 && t < c.t1); if (!c) return;
  const size = 74, y = 1515, k = eBack(seg(t, c.t0, c.t0 + .18));
  ctx.save(); setFont(size, F.mont, 900); ctx.textBaseline = 'middle';
  const parts = c.words.map(w => up(w.w)), sp = ctx.measureText(' ').width, ws = parts.map(p => ctx.measureText(p).width);
  const total = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1), scale = Math.min(1, 940 / total);
  ctx.translate(W / 2, y); ctx.scale(scale * (.85 + .15 * k), scale * (.85 + .15 * k)); ctx.globalAlpha = clamp(k * 2);
  let x = -total / 2;
  c.words.forEach((w, i) => {
    const active = t >= w.t, now = active && (i === c.words.length - 1 || t < c.words[i + 1].t), pk = now ? eBack(seg(t, w.t, w.t + .15)) : 1;
    ctx.save(); ctx.translate(x + ws[i] / 2, 0); ctx.scale(now ? .9 + .14 * pk : 1, now ? .9 + .14 * pk : 1);
    ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = '#000'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 18;
    ctx.strokeText(parts[i], 0, 0); ctx.shadowBlur = 0;
    ctx.fillStyle = w.hl && active ? '#ffcf4a' : active ? '#ffffff' : 'rgba(255,255,255,.55)'; ctx.fillText(parts[i], 0, 0); ctx.restore();
    x += ws[i] + sp;
  });
  ctx.restore();
}

/* ================= son işlem: grenli film, vinyet ================= */
const GRAIN = (() => { const c = mkCanvas(512, 512), g = c.getContext('2d'), d = g.createImageData(512, 512), r = rng(3); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; })();
function finish(t) {
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .07;
  const f = Math.floor(t * 24), ox = (f * 137) % 512, oy = (f * 251) % 512;
  ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.translate(-ox, -oy); ctx.fillRect(0, 0, W + 512, H + 512); ctx.restore();
  ctx.fillStyle = rg(W / 2, H * .45, H * .3, H * .78, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.6)']]); ctx.fillRect(0, 0, W, H);
  // marka rozeti
  ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = 'rgba(10,6,4,.55)'; ctx.beginPath(); ctx.roundRect(54, 96, 330, 58, 29); ctx.fill();
  ctx.strokeStyle = 'rgba(242,199,92,.6)'; ctx.lineWidth = 2; ctx.stroke();
  setFont(28, F.cinzel, 900); ctx.fillStyle = '#f2c75c'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('40 SN TARİH', 84, 126);
  setFont(22, F.mont, 800); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText('· 1453', 286, 127); ctx.restore();
}

/* ================= dünya: İstanbul haritası (dünya birimi ≈ 2000) ================= */
const WATER = spline([
  [-700, 1470], [0, 1460], [500, 1440], [900, 1390], [1100, 1265], [1180, 1150],
  [1000, 1080], [820, 982], [650, 902], [520, 862], [455, 842],
  [520, 818], [680, 830], [840, 900], [1020, 990], [1212, 1050],
  [1300, 850], [1420, 600], [1500, 300], [1560, 0], [1600, -700],
  [1770, -700], [1700, 0], [1640, 250], [1560, 550], [1450, 800], [1370, 1050], [1330, 1260],
  [1500, 1400], [2000, 1450], [2700, 1460], [2700, 2700], [-700, 2700]], 8, true);
const CITY = spline([[650, 905], [820, 985], [1000, 1083], [1176, 1150], [1100, 1262], [900, 1388], [520, 1436], [585, 1170]], 8, true);
const LANDWALL = [[650, 905], [610, 1030], [585, 1170], [560, 1300], [520, 1436]];
const CHAIN = [[1172, 1140], [1206, 1058]];
const ROUTE = spline([[1318, 872], [1268, 852], [1180, 800], [1060, 790], [960, 838], [905, 900], [888, 948]], 12);
const ROUTE_L = polyLen(ROUTE);
const WAVES = (() => { const c = mkCanvas(1, 1).getContext('2d'), r = rng(11), out = []; c.beginPath(); WATER.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath();
  while (out.length < 520) { const x = -600 + r() * 3200, y = -600 + r() * 3200; if (c.isPointInPath(x, y)) out.push([x, y, r() * TAU]); } return out; })();
const HILLS = [[1080, 840, 260, .2], [860, 1190, 300, .16], [1620, 1100, 340, .18], [200, 1050, 420, .12], [1250, 400, 280, .14]];
const CAM = {
  siege: [[3.6, 760, 1120, .74], [5.6, 720, 1150, .86], [7.0, 860, 1150, 1.15], [8.0, 1185, 1105, 2.15], [10.4, 1195, 1095, 2.3], [11.2, 1250, 1010, 1.55], [13.4, 1255, 990, 1.68]],
  route: [[17.5, 1110, 900, 1.45], [19.9, 1085, 880, 2.3]],
  fall: [[31.8, 920, 1060, 1.02], [33.4, 820, 1130, 1.15], [36.2, 760, 1180, 1.42]]
};
function camAt(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i], k = eIO(seg(t, a[0], b[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; }
  return keys[keys.length - 1].slice(1);
}
let Z = 1; // geçerli harita yakınlaştırması (ekran sabit çizgi kalınlıkları için)
function mapBase(t, cam, o = {}) {
  const [cx, cy, z] = cam; Z = z;
  ctx.fillStyle = '#d8c59a'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy);
  // kabartma (tepeler)
  for (const [x, y, r, a] of HILLS) { ctx.fillStyle = rg(x, y, 0, r, [[0, `rgba(96,78,40,${a})`], [1, 'rgba(96,78,40,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  for (const [x, y, r] of HILLS) { ctx.fillStyle = rg(x - r * .25, y - r * .25, 0, r * .6, [[0, 'rgba(255,248,220,.18)'], [1, 'rgba(255,248,220,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  // şehir dokusu
  ctx.fillStyle = 'rgba(150,110,70,.18)'; tracePath(CITY); ctx.fill();
  if (o.cityRed) { ctx.fillStyle = `rgba(178,28,38,${.55 * o.cityRed})`; tracePath(CITY); ctx.fill(); }
  // su
  tracePath(WATER); ctx.closePath();
  ctx.fillStyle = lg(0, -400, 0, 2400, [[0, '#3e7184'], [1, '#26495d']]); ctx.fill();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = 'rgba(214,236,236,.35)'; ctx.lineWidth = 18 / z; tracePath(WATER); ctx.closePath(); ctx.stroke(); // sığlık
  ctx.strokeStyle = 'rgba(210,235,240,.28)'; ctx.lineWidth = 1.6 / z;
  for (const [x, y, ph] of WAVES) { const dx = Math.sin(t * .6 + ph) * 4; ctx.beginPath(); ctx.moveTo(x + dx - 8, y); ctx.quadraticCurveTo(x + dx - 4, y - 3, x + dx, y); ctx.quadraticCurveTo(x + dx + 4, y + 3, x + dx + 8, y); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2.6 / z; tracePath(WATER); ctx.closePath(); ctx.stroke();
  // surlar
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#4a3420'; ctx.lineWidth = 9 / z; tracePath(spline(LANDWALL, 6)); ctx.stroke();
  ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 3.5 / z; tracePath(spline(LANDWALL, 6)); ctx.stroke();
  for (const [x, y] of spline(LANDWALL, 3)) { ctx.fillStyle = '#4a3420'; ctx.fillRect(x - 6 / z, y - 6 / z, 12 / z, 12 / z); }
  ctx.strokeStyle = 'rgba(74,52,32,.8)'; ctx.lineWidth = 4 / z; tracePath(CITY.slice(0, Math.floor(CITY.length * .78))); ctx.stroke();
  // Galata surları
  const GAL = spline([[1105, 1022], [1118, 960], [1170, 935], [1222, 1000], [1212, 1046]], 6);
  ctx.fillStyle = 'rgba(150,110,70,.22)'; tracePath(GAL); ctx.fill(); ctx.strokeStyle = 'rgba(74,52,32,.8)'; ctx.lineWidth = 3.5 / z; tracePath(GAL); ctx.stroke();
  ctx.fillStyle = '#4a3420'; ctx.beginPath(); ctx.arc(1162, 962, 7, 0, TAU); ctx.fill();
  ctx.restore();
}
const W2S = (cam, x, y) => [W / 2 + (x - cam[0]) * cam[2], H / 2 + (y - cam[1]) * cam[2]];
function mapLabel(cam, s, x, y, size, o = {}) {
  const [sx, sy] = W2S(cam, x, y); ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.translate(sx, sy); ctx.rotate(o.rot || 0);
  setFont(size, o.fam || F.cinzel, 900); ctx.letterSpacing = (o.sp ?? size * .25) + 'px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = size * .28; ctx.lineJoin = 'round'; ctx.strokeStyle = o.halo || 'rgba(232,218,184,.85)'; ctx.strokeText(s, 0, 0);
  ctx.fillStyle = o.col || '#3a2a18'; ctx.fillText(s, 0, 0); ctx.restore();
}
// K&G tarzı konik ok
function arrow(cam, pts, k, w, col, o = {}) {
  if (k <= 0) return;
  const P = spline(pts, 14), L = polyLen(P), end = k * L[L.length - 1], S = [];
  for (let i = 0; i < P.length && L[i] <= end; i++) S.push(P[i]);
  S.push(pointAt(P, L, k)); if (S.length < 2) return;
  const head = w * 2.2, sp = S.map(([x, y]) => W2S(cam, x, y)), ww = w * cam[2], hl = head * cam[2];
  const n = sp.length, Ls = polyLen(sp), tot = Ls[n - 1], left = [], right = [];
  let cut = n - 1; while (cut > 1 && tot - Ls[cut] < hl) cut--;
  for (let i = 0; i <= cut; i++) {
    const a = sp[Math.max(0, i - 1)], b = sp[Math.min(n - 1, i + 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), hw = ww * (.35 + .65 * (Ls[i] / tot)) / 2;
    left.push([sp[i][0] + Math.sin(ang) * hw, sp[i][1] - Math.cos(ang) * hw]); right.push([sp[i][0] - Math.sin(ang) * hw, sp[i][1] + Math.cos(ang) * hw]);
  }
  const tip = sp[n - 1], base = sp[cut], ang = Math.atan2(tip[1] - base[1], tip[0] - base[0]), hw = ww * 1.1;
  const poly = [...left, [base[0] + Math.sin(ang) * hw, base[1] - Math.cos(ang) * hw], tip, [base[0] - Math.sin(ang) * hw, base[1] + Math.cos(ang) * hw], ...right.reverse()];
  ctx.save(); ctx.translate(0, 6); ctx.fillStyle = 'rgba(30,15,5,.3)'; tracePath(poly); ctx.fill(); ctx.restore();
  ctx.fillStyle = lg(sp[0][0], sp[0][1], tip[0], tip[1], [[0, o.col0 || col], [1, col]]); tracePath(poly); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = o.edge || '#2a0d08'; ctx.lineWidth = 3; ctx.stroke();
}
// tepeden gemi ikonu (dünya birimi)
function shipIcon(x, y, ang, col, s = 1, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(20,10,5,.3)'; ctx.beginPath(); ctx.ellipse(2, 4, 17, 6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = col; ctx.strokeStyle = '#1a0c06'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(20, 0); ctx.quadraticCurveTo(6, -7, -16, -5); ctx.lineTo(-16, 5); ctx.quadraticCurveTo(6, 7, 20, 0); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#f3e6c4'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-4, -9); ctx.lineTo(6, 9); ctx.stroke();
  ctx.restore();
}
function inWorld(cam, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); fn(); ctx.restore(); }
function compass(x, y, r, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * .3) * .03); ctx.globalAlpha = .75;
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * .8, 0, TAU); ctx.stroke();
  for (let i = 0; i < 8; i++) { const l = i % 2 ? r * .55 : r * 1.05; ctx.save(); ctx.rotate(i * TAU / 8); ctx.fillStyle = i % 2 ? '#7a5a34' : '#3a2a18'; ctx.beginPath(); ctx.moveTo(0, -l); ctx.lineTo(r * .12, 0); ctx.lineTo(-r * .12, 0); ctx.fill(); ctx.restore(); }
  setFont(r * .45, F.cinzel, 900); ctx.fillStyle = '#3a2a18'; ctx.textAlign = 'center'; ctx.fillText('K', 0, -r * 1.25); ctx.restore();
}
function paperFrame() {
  ctx.fillStyle = rg(W / 2, H / 2, H * .25, H * .7, [[0, 'rgba(120,80,30,0)'], [1, 'rgba(70,40,10,.45)']]); ctx.fillRect(0, 0, W, H);
}
// harita üstü kart (yıl damgası vb.)
function stamp(s, x, y, size, t, t0, col = '#9b1c1c', rot = -.08) {
  const k = seg(t, t0, t0 + .25); if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const sc = lerp(2.4, 1, eOut(k)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 3) * .92;
  setFont(size, F.cinzel, 900); ctx.letterSpacing = size * .08 + 'px'; const w = ctx.measureText(s).width + size * .9;
  ctx.strokeStyle = col; ctx.lineWidth = size * .07; ctx.strokeRect(-w / 2, -size * .78, w, size * 1.56); ctx.lineWidth = size * .025; ctx.strokeRect(-w / 2 + 10, -size * .78 + 10, w - 20, size * 1.56 - 20);
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, size * .05); ctx.restore();
}

/* ================= sinematik öğeler ================= */
const STARS = (() => { const r = rng(7); return Array.from({ length: 160 }, () => [r() * W, r() * 1100, r() * 1.8 + .4, r() * 6]); })();
function stars(t, a) { ctx.fillStyle = '#fff'; for (const [x, y, r, p] of STARS) { ctx.globalAlpha = a * (.45 + .55 * Math.sin(t * 1.7 + p)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
const CLOUD = (() => { const c = mkCanvas(900, 300), g = c.getContext('2d'), r = rng(5);
  for (let i = 0; i < 60; i++) { const x = 120 + r() * 660, y = 150 + (r() - .5) * 90 * (1 - Math.abs(x - 450) / 450), rr = 40 + r() * 70, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  return c; })();
function cloud(x, y, s, a, tint) { ctx.save(); ctx.globalAlpha = a; ctx.drawImage(CLOUD, x - 450 * s, y - 150 * s, 900 * s, 300 * s); if (tint) { ctx.globalCompositeOperation = 'source-atop'; } ctx.restore(); }
function moon(x, y, r, t) {
  glow(x, y, r * 5, 'rgba(190,210,255,.35)'); glow(x, y, r * 2, 'rgba(230,236,255,.5)');
  ctx.fillStyle = rg(x - r * .3, y - r * .3, r * .1, r, [[0, '#fffdf2'], [1, '#d9dcd0']]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(150,150,140,.25)'; [[.3, -.2, .18], [-.25, .25, .22], [.1, .4, .12], [-.35, -.3, .1]].forEach(([a, b, c]) => { ctx.beginPath(); ctx.arc(x + a * r, y + b * r, c * r, 0, TAU); ctx.fill(); });
}
function sun(x, y, r, a = 1) { glow(x, y, r * 8, 'rgba(255,170,80,.45)', a); glow(x, y, r * 3, 'rgba(255,220,150,.7)', a); ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function godRays(x, y, t, col, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y);
  for (let i = 0; i < 9; i++) { const ang = Math.PI * .55 + i * .14 + Math.sin(t * .4 + i) * .03, l = 1900, w = .035 + (i % 3) * .015;
    ctx.fillStyle = lg(0, 0, Math.cos(ang) * l, Math.sin(ang) * l, [[0, col.replace('A', a)], [1, col.replace('A', 0)]]);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang - w) * l, Math.sin(ang - w) * l); ctx.lineTo(Math.cos(ang + w) * l, Math.sin(ang + w) * l); ctx.fill(); }
  ctx.restore();
}
function ridge(base, amp, seed, col, x0 = 0, freq = 1) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-50, H + 10);
  for (let x = -50; x <= W + 50; x += 12) { const X = x + x0; ctx.lineTo(x, base - amp * (.55 * Math.sin(X * .004 * freq + seed) + .3 * Math.sin(X * .011 * freq + seed * 2) + .15 * Math.sin(X * .027 * freq + seed * 3))); }
  ctx.lineTo(W + 50, H + 10); ctx.fill();
}
function fog(y, h, col, a, t, sp = 20) {
  for (let i = 0; i < 4; i++) { const x = ((t * sp * (1 + i * .3) + i * 400) % (W + 900)) - 450; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rg(x, y + i * h * .2, 0, 520, [[0, col], [1, col.replace(/[\d.]+\)$/, '0)')]]); ctx.scale(1, h / 520); ctx.beginPath(); ctx.arc(x, (y + i * h * .2) * 520 / h, 520, 0, TAU); ctx.restore(); ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y + i * h * .15); ctx.scale(1.8, h / 520); ctx.fillStyle = rg(0, 0, 0, 520, [[0, col], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(-520, -520, 1040, 1040); ctx.restore(); }
}
function galataTower(x, y, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-28, -230); ctx.lineTo(28, -230); ctx.lineTo(34, 0); ctx.fill();
  ctx.fillRect(-38, -250, 76, 24); for (let i = -3; i <= 3; i++) ctx.fillRect(i * 11 - 4, -262, 7, 14);
  ctx.beginPath(); ctx.moveTo(-34, -260); ctx.lineTo(0, -340); ctx.lineTo(34, -260); ctx.fill(); ctx.restore();
}
// Osmanlı kadırgası – yandan görünüm. o.sail: 0..1 açılma, o.oars: kürek fazı, o.night: ışık
function galley(x, y, s, ang, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s * (o.flip ? -1 : 1), s);
  const sil = o.sil; // tek renk siluet
  const C = sil ? { hull: sil, hull2: sil, rail: sil, band: sil, sail: sil, sail2: sil, mast: sil, oar: sil, flag: sil } :
    { hull: '#6b3f1d', hull2: '#24130a', rail: '#e2b65a', band: '#9e1f24', sail: '#f1e6cc', sail2: '#b8262b', mast: '#3a2412', oar: '#8a5a30', flag: '#c4222e' };
  const sailK = o.sail ?? 1;
  // direkler ve yelkenler (gövdenin arkasında)
  const masts = [[30, 360, 1], [210, 250, .72]];
  for (const [mx, mh, ms] of masts) {
    ctx.strokeStyle = C.mast; ctx.lineWidth = 12 * ms; ctx.beginPath(); ctx.moveTo(mx, -60); ctx.lineTo(mx, -60 - mh); ctx.stroke();
    // latin seren
    const yx0 = mx - 150 * ms, yy0 = -80 - mh * .25, yx1 = mx + 210 * ms, yy1 = -60 - mh * 1.05;
    ctx.lineWidth = 8 * ms; ctx.beginPath(); ctx.moveTo(yx0, yy0); ctx.lineTo(yx1, yy1); ctx.stroke();
    if (sailK > 0) {
      const bil = Math.sin(t * 2.3 + mx) * 10 * ms, foot = [lerp(yx1, mx + 30 * ms, sailK), lerp(yy1, -80, sailK)], foot2 = [lerp(yx0, mx - 120 * ms, sailK), lerp(yy0, -100, sailK)];
      ctx.save(); ctx.beginPath(); ctx.moveTo(yx0, yy0); ctx.lineTo(yx1, yy1);
      ctx.quadraticCurveTo((yx1 + foot[0]) / 2 + 60 * ms * sailK + bil, (yy1 + foot[1]) / 2, foot[0], foot[1]);
      ctx.quadraticCurveTo((foot[0] + foot2[0]) / 2, foot[1] + 20 * sailK, foot2[0], foot2[1]); ctx.closePath();
      ctx.fillStyle = sil ? C.sail : lg(yx0, yy1, foot[0], foot[1], [[0, '#fff8e6'], [1, '#cbb98f']]); ctx.fill();
      if (!sil) { ctx.strokeStyle = C.sail2; ctx.lineWidth = 7 * ms; ctx.stroke(); ctx.clip();
        ctx.strokeStyle = 'rgba(120,90,50,.25)'; ctx.lineWidth = 2; for (let i = -4; i < 6; i++) { ctx.beginPath(); ctx.moveTo(mx + i * 45 * ms, -60 - mh * 1.1); ctx.lineTo(mx + i * 45 * ms - 60 * ms, -40); ctx.stroke(); }
        if (sailK > .6) { const cx = mx + 40 * ms, cy = -60 - mh * .55; ctx.globalAlpha = (sailK - .6) / .4; ctx.fillStyle = C.sail2; ctx.beginPath(); ctx.arc(cx, cy, 34 * ms, 0, TAU); ctx.fill(); ctx.fillStyle = '#f6ecd4'; ctx.beginPath(); ctx.arc(cx + 9 * ms, cy, 28 * ms, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
        ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(mx - 300, -60 - mh, 600, mh * .4); }
      ctx.restore();
    }
    // flama
    const fx = mx, fy = -60 - mh - 4, wv = Math.sin(t * 7 + mx) * 8;
    ctx.fillStyle = C.flag; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(fx - 50 * ms, fy - 12 + wv, fx - 120 * ms, fy + 4 + wv * 1.5); ctx.quadraticCurveTo(fx - 50 * ms, fy + 12 + wv, fx, fy + 22 * ms); ctx.fill();
  }
  // kıç sancağı
  if (!sil) { const wv = Math.sin(t * 5) * 10; ctx.strokeStyle = C.mast; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-300, -110); ctx.lineTo(-330, -260); ctx.stroke();
    ctx.fillStyle = C.flag; ctx.beginPath(); ctx.moveTo(-330, -260); ctx.quadraticCurveTo(-400, -268 + wv, -460, -246 + wv); ctx.lineTo(-450, -196 + wv); ctx.quadraticCurveTo(-400, -206 + wv, -324, -200); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-392, -228 + wv * .6, 15, 0, TAU); ctx.fill(); ctx.fillStyle = C.flag; ctx.beginPath(); ctx.arc(-386, -228 + wv * .6, 12.5, 0, TAU); ctx.fill(); }
  // gövde
  ctx.beginPath(); ctx.moveTo(-318, -135); ctx.quadraticCurveTo(-305, -60, -255, -8); ctx.quadraticCurveTo(0, 12, 255, -8); ctx.quadraticCurveTo(305, -30, 360, -52); ctx.lineTo(372, -60); ctx.lineTo(300, -66); ctx.lineTo(-282, -74); ctx.quadraticCurveTo(-300, -95, -318, -135); ctx.closePath();
  ctx.fillStyle = sil ? C.hull : lg(0, -74, 0, 10, [[0, C.hull], [1, C.hull2]]); ctx.fill();
  if (!sil) {
    ctx.save(); ctx.clip();
    ctx.fillStyle = C.band; ctx.fillRect(-330, -74, 720, 22);
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-300, -40 + i * 12); ctx.quadraticCurveTo(0, -30 + i * 12 + 10, 320, -44 + i * 6); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,220,160,.12)'; ctx.fillRect(-330, -74, 720, 8);
    ctx.restore();
    ctx.strokeStyle = C.rail; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-282, -74); ctx.lineTo(300, -66); ctx.stroke();
    ctx.fillStyle = '#e2b65a'; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.arc(i * 36, -42, 4, 0, TAU); ctx.fill(); }
    // fener
    glow(-300, -150, 70, 'rgba(255,190,90,.8)', o.lamp ?? .8); ctx.fillStyle = '#ffd27a'; ctx.fillRect(-308, -160, 16, 22);
  }
  // kürekler – karada havada çekiliyor
  if (o.oars !== undefined) {
    ctx.strokeStyle = C.oar; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let i = -6; i <= 6; i++) { const ph = o.oars + i * .12, a = .9 + .35 * Math.sin(ph), l = 150; ctx.beginPath(); ctx.moveTo(i * 36, -42); ctx.lineTo(i * 36 - Math.cos(a) * l * .5 - Math.sin(ph) * 30, -42 + Math.sin(a) * l); ctx.stroke(); }
  }
  ctx.restore();
}
// yeniçeri/asker (börk ile) – çekme pozu
function soldier(x, y, s, ph, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const lean = o.lean ?? .35, sw = Math.sin(ph) * 16, sil = o.sil, body = sil || o.col || '#8e1c22', skin = sil || '#c08a5e', dark = sil || '#2a160c', hat = sil || '#efe6d2';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = dark; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(-8 + sw, 0); ctx.moveTo(0, -48); ctx.lineTo(10 - sw, 0); ctx.stroke();
  ctx.save(); ctx.rotate(lean);
  ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-16, -50); ctx.lineTo(16, -50); ctx.lineTo(12, -112); ctx.lineTo(-12, -112); ctx.closePath(); ctx.fill();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(2, -126, 13, 0, TAU); ctx.fill();
  // börk: arkaya düşen uzun beyaz başlık
  ctx.fillStyle = hat; ctx.beginPath(); ctx.moveTo(-12, -134); ctx.lineTo(14, -134); ctx.quadraticCurveTo(10, -170, -6, -180); ctx.quadraticCurveTo(-34, -150, -40, -112); ctx.quadraticCurveTo(-26, -122, -12, -134); ctx.fill();
  ctx.strokeStyle = skin; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, -104); ctx.lineTo(o.drum ? 22 + Math.max(0, Math.sin(ph * 2)) * 18 : 34, o.drum ? -122 + Math.max(0, Math.sin(ph * 2)) * 40 : -92); ctx.stroke();
  if (o.drum) { ctx.fillStyle = sil || '#7a1a1a'; ctx.beginPath(); ctx.ellipse(18, -78, 18, 26, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = sil || '#e2b65a'; ctx.lineWidth = 3; ctx.stroke(); }
  if (o.torch) { ctx.strokeStyle = '#3a2412'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(30, -90); ctx.lineTo(40, -170); ctx.stroke(); }
  ctx.restore(); ctx.restore();
}
function oxen(x, y, s, ph, sil) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const col = sil || '#3a261a', hi = sil || '#5a3c28', sw = Math.sin(ph) * 14;
  ctx.strokeStyle = col; ctx.lineWidth = 13; ctx.lineCap = 'round';
  [[-50, sw], [-26, -sw], [36, -sw], [58, sw]].forEach(([lx, d]) => { ctx.beginPath(); ctx.moveTo(lx, -40); ctx.lineTo(lx + d, 0); ctx.stroke(); });
  ctx.fillStyle = sil ? col : lg(0, -110, 0, -30, [[0, hi], [1, col]]); ctx.beginPath(); ctx.ellipse(0, -66, 78, 36, -.05, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(74, -78, 26, 22, .5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(96, -64, 16, 13, .4, 0, TAU); ctx.fill();
  ctx.strokeStyle = sil || '#e9dcc0'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(70, -96); ctx.quadraticCurveTo(64, -124, 84, -128); ctx.moveTo(82, -96); ctx.quadraticCurveTo(96, -120, 112, -112); ctx.stroke();
  ctx.strokeStyle = sil || '#5a3a1a'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(48, -104); ctx.lineTo(70, -104); ctx.stroke();
  ctx.restore();
}
function torchPole(x, y, s, t, seed = 0) {
  ctx.strokeStyle = '#1e120a'; ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 170 * s); ctx.stroke();
  const fl = .8 + .2 * Math.sin(t * 19 + seed) + .1 * Math.sin(t * 31 + seed * 2);
  ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(x, y - 190 * s, 12 * s * fl, 26 * s * fl, Math.sin(t * 5 + seed) * .15, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff2c0'; ctx.beginPath(); ctx.ellipse(x, y - 184 * s, 5 * s, 11 * s, 0, 0, TAU); ctx.fill();
}
function embers(t, srcs, seed = 1) {
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) { const [sx, sy] = srcs[i % srcs.length], life = 2 + r() * 2, ph = (t + r() * life) % life, k = ph / life;
    const x = sx + Math.sin(ph * 2 + i) * 30 + (r() - .5) * 40 + k * 40, y = sy - k * 320;
    ctx.globalAlpha = (1 - k) * .9; ctx.fillStyle = '#ffb04a'; ctx.beginPath(); ctx.arc(x, y, 2.5 * (1 - k) + .8, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// "dünyayı" gece mavisine boyayıp meşale ışığı ekleyen ışık geçişi
function grade(col, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function lightPool(x, y, r, col, a) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = a; ctx.fillStyle = rg(x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
// Osmanlı geometrik desen (8 köşeli yıldız)
function pattern(t, col, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 2; const s = 120;
  for (let y = -s; y < H + s; y += s) for (let x = -s; x < W + s; x += s) { ctx.save(); ctx.translate(x + (y / s % 2) * s / 2, y + (t * 8) % s);
    ctx.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 22 : 46, ang = i * TAU / 16; i ? ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r) : ctx.moveTo(r, 0); } ctx.closePath(); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}

/* ================= SAHNELER ================= */
const S = {};
// ---- 1. KANCA: ay önünde tepeyi aşan gemi
S.hook = t => {
  const push = 1 + t * .035;
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#050818'], [.5, '#121b44'], [.75, '#2a2350'], [1, '#07060c']]); ctx.fillRect(0, 0, W, H);
  stars(t, .9);
  ctx.save(); ctx.translate(W / 2, H * .55); ctx.scale(push, push); ctx.translate(-W / 2, -H * .55);
  moon(560, 900, 250, t);
  cloud(250 + t * 18, 700, 1.3, .35); cloud(900 - t * 12, 1120, 1.1, .3);
  ridge(1330, 120, 2, '#0d1230', t * 10);
  // tepe ve gemi siluet
  const crest = x => 1290 - 260 * Math.exp(-Math.pow((x - 560) / 380, 2));
  ctx.fillStyle = '#04050c'; ctx.beginPath(); ctx.moveTo(-60, H); for (let x = -60; x <= W + 60; x += 10) ctx.lineTo(x, crest(x)); ctx.lineTo(W + 60, H); ctx.fill();
  const sx = 380 + t * 55, sy = crest(sx) - 8, sa = Math.atan2(crest(sx + 4) - crest(sx - 4), 8);
  galley(sx, sy, .95, sa, t, { sil: '#04050c', sail: 1, oars: t * 3 });
  oxen(sx + 430, crest(sx + 430), .9, t * 6, '#04050c'); oxen(sx + 600, crest(sx + 600), .9, t * 6 + 1, '#04050c');
  for (let i = 0; i < 5; i++) { const x = sx + 330 + i * 70; soldier(x, crest(x), 1, t * 7 + i, { sil: '#04050c', lean: .45 }); }
  ctx.strokeStyle = '#04050c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx + 330, sy - 80); ctx.lineTo(sx + 640, crest(sx + 640) - 70); ctx.stroke();
  [[sx - 240, 1], [sx + 760, 2]].forEach(([x, i]) => { torchPole(x, crest(x), 1, t, i); lightPool(x, crest(x) - 190, 300, 'rgba(255,150,60,.7)', .8); });
  ctx.restore();
  embers(t, [[sx - 240, crest(sx - 240) - 200], [sx + 760, crest(sx + 760) - 200]], 4);
  fog(1500, 300, 'rgba(60,70,130,.5)', .5, t);
  // başlıklar – davul vuruşlarıyla
  const tp = 300;
  kinetic('70 GEMİ', W / 2, tp, 190, t, .28, { mode: 'slam', gold: true });
  kinetic('TEK GECE', W / 2, tp + 190, 150, t, 1.38, { mode: 'slam' });
  kinetic('KARADAN!', W / 2, tp + 370, 170, t, 2.43, { mode: 'slam', gold: true, rot: -.03 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,220,160,${.35 * (hitPulse(t, .3) + hitPulse(t, 1.4) + hitPulse(t, 2.45) * 1.5)})`; ctx.fillRect(0, 0, W, H); ctx.restore();
};

// ---- 2. KUŞATMA HARİTASI: ordu, zincir, durdurulan donanma
S.siege = t => {
  const cam = camAt(CAM.siege, t), z = cam[2]; mapBase(t, cam);
  inWorld(cam, () => {
    // Osmanlı ordugâhı
    const camp = seg(t, 3.9, 5.2);
    for (let i = 0; i < 14; i++) { const x = 180 + (i % 5) * 50 + (i % 2) * 18, y = 1020 + Math.floor(i / 5) * 120 + (i % 3) * 20, k = eBack(seg(t, 4 + i * .05, 4.4 + i * .05));
      if (k > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#a3202a'; ctx.strokeStyle = '#2a0d08'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-16, 12); ctx.lineTo(0, -16); ctx.lineTo(16, 12); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); } }
    if (camp > 0) { ctx.save(); ctx.globalAlpha = camp; ctx.translate(300, 1180); ctx.fillStyle = '#d4a63a'; ctx.strokeStyle = '#2a0d08'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-34, 22); ctx.quadraticCurveTo(0, -60, 34, 22); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    // donanma Boğaz'da (Diplokionion)
    [[1365, 760], [1395, 800], [1350, 820], [1400, 860], [1370, 880]].forEach(([x, y], i) => { const k = seg(t, 4.6 + i * .08, 5 + i * .08); if (t < 10.4 && k > 0) shipIcon(x, y + Math.sin(t * 2 + i) * 2, 1.9, '#b3262d', 1.2, k); });
    // Bizans gemileri zincirin ardında
    [[1080, 1062], [1035, 1035], [1120, 1090], [990, 1030]].forEach(([x, y], i) => shipIcon(x, y + Math.sin(t * 2 + i) * 1.5, -2.7, '#3b5ba8', 1.1, seg(t, 8.6, 9)));
  });
  // ordu okları
  [[[60, 900], [330, 960], [590, 1000]], [[40, 1190], [330, 1190], [548, 1180]], [[60, 1480], [330, 1400], [505, 1365]]].forEach((p, i) => arrow(cam, p, eIO(seg(t, 4.2 + i * .25, 6.2 + i * .25)), 30, '#c0262f', { col0: 'rgba(192,38,47,.4)' }));
  // zincir
  const ck = eIO(seg(t, 7.9, 8.9));
  if (ck > 0) {
    const [a, b] = CHAIN.map(p => W2S(cam, ...p)), e = [lerp(a[0], b[0], ck), lerp(a[1], b[1], ck)], pulse = .6 + .4 * Math.sin(t * 6);
    glow((a[0] + e[0]) / 2, (a[1] + e[1]) / 2, 160, `rgba(255,200,80,${.55 * pulse})`);
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#2a1a08'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...e); ctx.stroke();
    const n = Math.floor(Math.hypot(e[0] - a[0], e[1] - a[1]) / 14), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    for (let i = 0; i <= n; i++) { const x = a[0] + Math.cos(ang) * i * 14, y = a[1] + Math.sin(ang) * i * 14; ctx.save(); ctx.translate(x, y); ctx.rotate(ang + (i % 2 ? Math.PI / 2 : 0)); ctx.strokeStyle = '#f2c75c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, 9, 5, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.restore();
  }
  // donanma zincire çarpar
  if (t > 10.4) inWorld(cam, () => {
    [[1330, 1015], [1355, 1060], [1310, 1090]].forEach(([x0, y0], i) => {
      const go = eIO(seg(t, 10.5 + i * .15, 11.5 + i * .15)), back = Math.sin(seg(t, 11.5 + i * .15, 12.3 + i * .15) * Math.PI) * 26;
      const x = lerp(x0 + 60, 1236 + i * 6, go) + back, y = lerp(y0 - 30, 1092 + i * 18 - 20, go);
      shipIcon(x, y, Math.PI + .4, '#b3262d', 1.3);
    });
  });
  if (t > 11.6) { const [x, y] = W2S(cam, 1215, 1100), k = eBack(seg(t, 11.6, 11.9)); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.strokeStyle = '#c0262f'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.shadowColor = '#000'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(-40, -40); ctx.lineTo(40, 40); ctx.moveTo(40, -40); ctx.lineTo(-40, 40); ctx.stroke(); ctx.restore(); }
  // etiketler
  const la = 1 - seg(t, 7.4, 7.9);
  mapLabel(cam, 'MARMARA DENİZİ', 900, 1640, 30, { a: la, col: '#e6f0f0', halo: 'rgba(30,60,80,.6)' });
  mapLabel(cam, 'İSTANBUL', 860, 1235, 46, { a: seg(t, 5, 5.6) }); mapLabel(cam, 'BİZANS BAŞKENTİ', 860, 1290, 20, { a: seg(t, 5.3, 5.9) * la, fam: F.mont });
  mapLabel(cam, 'OSMANLI ORDUSU', 260, 940, 26, { a: seg(t, 4.6, 5.2) * la, col: '#8e1c22' });
  mapLabel(cam, 'BOĞAZ', 1450, 560, 30, { rot: -1.2, col: '#e6f0f0', halo: 'rgba(30,60,80,.6)', a: la });
  mapLabel(cam, 'HALİÇ', 860, 936, 30 * Math.min(1, 2 / z) + 6, { rot: .42, col: '#e6f0f0', halo: 'rgba(30,60,80,.6)' });
  mapLabel(cam, 'GALATA', 1150, 960, 24, { a: seg(t, 7.8, 8.3) });
  mapLabel(cam, 'DONANMA', 1450, 700, 22, { a: seg(t, 5, 5.5) * la, col: '#8e1c22' });
  if (t > 8.2) { const [x, y] = W2S(cam, 1250, 1180); kinetic('ZİNCİR', x + 90, y + 130, 80, t, 8.2, { gold: true, rot: -.05 }); }
  paperFrame(); compass(965, 330, 52, t);
  stamp('1453', W / 2, 330, 120, t, 4.1);
  if (t > 11.7) kinetic('GEÇİT YOK!', W / 2, 560, 120, t, 11.7, { col: '#ffdfd8', strokeCol: '#5a0a0a', rot: .03 });
};

// ---- 3. PORTRE: II. Mehmed
function fatihProfile(t) {
  ctx.save(); ctx.translate(560, 1010); ctx.scale(1.55, 1.55);
  const rim = lg(-200, 0, 200, 0, [[0, 'rgba(0,0,0,0)'], [.7, 'rgba(242,199,92,.0)'], [1, 'rgba(255,214,120,.95)']]);
  // kaftan & kürk yaka
  ctx.fillStyle = '#1a0a0c'; ctx.beginPath(); ctx.moveTo(-300, 520); ctx.quadraticCurveTo(-270, 250, -120, 190); ctx.lineTo(90, 185); ctx.quadraticCurveTo(250, 230, 290, 520); ctx.fill();
  ctx.fillStyle = '#4a2a1a'; ctx.beginPath(); ctx.moveTo(-150, 200); ctx.quadraticCurveTo(-10, 300, 120, 200); ctx.quadraticCurveTo(140, 260, 100, 330); ctx.quadraticCurveTo(-10, 360, -150, 300); ctx.closePath(); ctx.fill();
  // boyun & yüz profili (sağa bakıyor)
  ctx.fillStyle = '#140708'; ctx.beginPath();
  ctx.moveTo(-70, 200); ctx.lineTo(-80, 60); ctx.quadraticCurveTo(-105, -10, -80, -70);
  ctx.lineTo(55, -70); ctx.quadraticCurveTo(70, -45, 72, -20); ctx.quadraticCurveTo(82, -5, 108, 22); ctx.quadraticCurveTo(116, 34, 100, 40);
  ctx.quadraticCurveTo(96, 46, 98, 52); ctx.quadraticCurveTo(94, 60, 96, 66);
  ctx.quadraticCurveTo(104, 110, 80, 160); ctx.quadraticCurveTo(40, 200, -10, 190); ctx.lineTo(-20, 210); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,214,120,.85)'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(55, -70); ctx.quadraticCurveTo(70, -45, 72, -20); ctx.quadraticCurveTo(82, -5, 108, 22); ctx.quadraticCurveTo(116, 34, 100, 40); ctx.quadraticCurveTo(96, 46, 98, 52); ctx.quadraticCurveTo(94, 60, 96, 66); ctx.quadraticCurveTo(104, 110, 80, 160); ctx.stroke();
  ctx.fillStyle = 'rgba(255,214,120,.9)'; ctx.beginPath(); ctx.ellipse(70, -12, 7, 3, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,214,120,.5)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-80, 60); ctx.quadraticCurveTo(-105, -10, -80, -70); ctx.stroke();
  // kavuk (büyük sarık) + kırmızı tac
  ctx.fillStyle = '#9e1f24'; ctx.beginPath(); ctx.ellipse(-5, -215, 52, 70, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = lg(-150, -230, 150, -60, [[0, '#8f8676'], [.6, '#efe7d6'], [1, '#fff8e8']]); ctx.beginPath(); ctx.ellipse(-10, -150, 150, 95, -.05, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(120,105,85,.6)'; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(-10, -150 + i * 4, 150 - i * 6, 95 - i * 14, -.05 - i * .04, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
  ctx.fillStyle = '#d4a63a'; ctx.beginPath(); ctx.arc(110, -150, 10, 0, TAU); ctx.fill();
  ctx.restore();
}
S.portrait = t => {
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#2a0508'], [.6, '#4a0c10'], [1, '#120204']]); ctx.fillRect(0, 0, W, H);
  pattern(t, '#f2c75c', .07);
  godRays(W * .5, -100, t, 'rgba(255,200,120,A)', .12);
  glow(640, 900, 700, 'rgba(255,150,60,.25)');
  const k = eOut(seg(t, 13.4, 14.6));
  ctx.save(); ctx.translate((1 - k) * 120, 0); ctx.globalAlpha = k; fatihProfile(t); ctx.restore();
  // fikir: altın mürekkeple çizilen plan şeması
  if (t > 15.5) {
    const pk = eIO(seg(t, 15.6, 16.9)); ctx.save(); ctx.translate(W / 2, 640); ctx.globalAlpha = clamp(pk * 3);
    glow(0, 0, 360, 'rgba(255,200,90,.35)');
    ctx.strokeStyle = '#ffd77a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); for (let x = -380; x <= -150; x += 10) ctx.lineTo(x, 60 + Math.sin(x * .08 + t * 3) * 6); ctx.stroke();
    ctx.beginPath(); for (let x = 150; x <= 380; x += 10) ctx.lineTo(x, 60 + Math.sin(x * .08 + t * 3) * 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-150, 60); ctx.quadraticCurveTo(0, -150, 150, 60); ctx.stroke();
    ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 40; ctx.beginPath();
    const pts = 40; for (let i = 0; i <= pts * pk; i++) { const u = i / pts, x = lerp(-300, 300, u), y = 20 - Math.sin(u * Math.PI) * 200; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
    const u = pk, sx = lerp(-300, 300, u), sy = 20 - Math.sin(u * Math.PI) * 200; ctx.save(); ctx.translate(sx, sy - 10); ctx.scale(.16, .16); galley(0, 0, 1, Math.cos(u * Math.PI) * -.5, t, { sil: '#ffd77a', sail: 1 }); ctx.restore();
    ctx.restore();
  }
  kinetic('II. MEHMED', W / 2, 300, 110, t, 13.6, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 8 });
  kinetic('21 YAŞINDA', W / 2, 430, 84, t, 14.2, { col: '#fff', fam: F.anton });
  ctx.fillStyle = lg(0, 1150, 0, 1920, [[0, 'rgba(18,2,4,0)'], [.5, 'rgba(18,2,4,.9)'], [1, '#120204']]); ctx.fillRect(0, 1150, W, 770);
};

// ---- 4. ROTA HARİTASI: karadan geçiş yolu
S.route = t => {
  const cam = camAt(CAM.route, t); mapBase(t, cam);
  const k = eIO(seg(t, 17.6, 19.3));
  // rota: parlayan kesikli çizgi + ok
  const sp = ROUTE.map(p => W2S(cam, ...p)), Ls = polyLen(sp), n = Math.max(2, Math.floor(sp.length * k));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255,190,80,.35)'; ctx.lineWidth = 40; tracePath(sp.slice(0, n)); ctx.stroke();
  ctx.strokeStyle = '#a3202a'; ctx.lineWidth = 14; ctx.setLineDash([30, 18]); ctx.lineDashOffset = -t * 80; tracePath(sp.slice(0, n)); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  arrow(cam, [[1318, 872], [1268, 852], [1180, 800], [1060, 790], [960, 838], [905, 900], [888, 948]], k, 22, '#c0262f', { col0: 'rgba(192,38,47,0)' });
  inWorld(cam, () => {
    for (let i = 0; i < 5; i++) { const u = clamp(k * 1.05 - i * .1); if (u <= 0) continue; const [x, y, a] = pointAt(ROUTE, ROUTE_L, u); shipIcon(x, y, a, '#b3262d', 1.25); }
    [[1360, 800], [1380, 840]].forEach(([x, y], i) => shipIcon(x, y, 2.2, '#b3262d', 1.2));
    [[1080, 1062], [1035, 1035], [1120, 1090]].forEach(([x, y], i) => shipIcon(x, y, -2.7, '#3b5ba8', 1.1));
    // zincir
    ctx.strokeStyle = '#f2c75c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(...CHAIN[0]); ctx.lineTo(...CHAIN[1]); ctx.stroke();
  });
  mapLabel(cam, 'HALİÇ', 860, 940, 26, { rot: .42, col: '#e6f0f0', halo: 'rgba(30,60,80,.6)' });
  mapLabel(cam, 'GALATA', 1160, 975, 20); mapLabel(cam, 'BOĞAZ', 1420, 760, 22, { rot: -1.2, col: '#e6f0f0', halo: 'rgba(30,60,80,.6)' });
  mapLabel(cam, 'KASIMPAŞA', 860, 1000, 18, { a: seg(t, 18.8, 19.2), fam: F.mont });
  paperFrame();
  kinetic('KARADAN!', W / 2, 360, 170, t, 17.6, { mode: 'slam', gold: true, rot: -.03 });
};

// ---- 5. GECE: kütükler üzerinde gemiler tepeye çekiliyor
S.haul = t => {
  const lt = t - 19.9, camX = lt * 120, camY = camX * .24, zoom = 1.12 + eIO(seg(t, 24.2, 27.4)) * .3;
  // gökyüzü
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#03051a'], [.45, '#0f1a4a'], [.7, '#24224e'], [1, '#05040a']]); ctx.fillRect(0, 0, W, H);
  stars(t, 1); moon(820, 360, 90, t); cloud(500 - lt * 8, 520, 1.2, .25);
  // uzak: Boğaz ve Asya yakası ışıkları
  ctx.save(); ctx.translate(-camX * .08, 0);
  ridge(980, 70, 5, '#121a3c', camX * .08); ctx.fillStyle = '#16244e'; ctx.fillRect(-100, 1000, W + 400, 120);
  ctx.restore();
  ctx.save(); ctx.translate(W / 2, H * .62); ctx.scale(zoom, zoom); ctx.translate(-W / 2, -H * .62);
  // Galata kulesi ve uzak sırt (gemi siluetleri sırtı aşıyor)
  ctx.save(); ctx.translate(-camX * .25, 0);
  const far = x => 1040 - 120 * Math.sin((x + 300) * .0022);
  ctx.fillStyle = '#0d1430'; ctx.beginPath(); ctx.moveTo(-200, H); for (let x = -200; x < W + 900; x += 15) ctx.lineTo(x, far(x)); ctx.lineTo(W + 900, H); ctx.fill();
  galataTower(980, far(980) + 10, .9, '#0d1430');
  for (let i = 0; i < 4; i++) { const x = ((lt * 30 + i * 300) % 1300) - 100; galley(x, far(x) - 4, .22, Math.atan2(far(x + 3) - far(x - 3), 6), t, { sil: '#0d1430', sail: 1 }); }
  for (let i = 0; i < 18; i++) { const x = i * 75 - 40; ctx.fillStyle = '#ffb347'; ctx.globalAlpha = .6 + .4 * Math.sin(t * 9 + i); ctx.beginPath(); ctx.arc(x, far(x) - 30, 3, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
  ctx.restore();
  fog(1060, 220, 'rgba(70,80,150,.6)', .45, t, 25);
  // ana zemin
  const g = x => 1360 - .24 * x - 40 * Math.sin(x * .004);
  ctx.save(); ctx.translate(-camX, camY - 40);
  const x0 = camX - 200, x1 = camX + W + 200;
  ctx.fillStyle = lg(0, 900, 0, 1500, [[0, '#2b3a22'], [1, '#141a10']]); ctx.beginPath(); ctx.moveTo(x0, H); for (let x = x0; x <= x1; x += 10) ctx.lineTo(x, g(x)); ctx.lineTo(x1, H); ctx.fill();
  // yağlanmış kütükler (yandan halka)
  for (let x = Math.floor(x0 / 46) * 46; x < x1; x += 46) { const y = g(x) - 12; ctx.fillStyle = '#4a2c16'; ctx.beginPath(); ctx.arc(x, y, 13, 0, TAU); ctx.fill(); ctx.strokeStyle = '#7a4a26'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.stroke(); ctx.fillStyle = 'rgba(255,230,170,.5)'; ctx.beginPath(); ctx.arc(x - 4, y - 6, 3, 0, TAU); ctx.fill(); }
  // meşaleler
  const torches = []; for (let x = Math.floor(x0 / 360) * 360 + 120; x < x1; x += 360) { torchPole(x, g(x) + 30, 1, t, x); torches.push([x, g(x) - 160]); }
  // arka gemi
  const bx = camX - 620 + lt * 20; galley(bx, g(bx) - 26, .8, Math.atan2(g(bx + 4) - g(bx - 4), 8), t, { sail: 1, oars: t * 3.2 + 1, lamp: .5 });
  // kahraman gemi
  const hx = camX + 470, hy = g(hx) - 26, ha = Math.atan2(g(hx + 4) - g(hx - 4), 8), sailK = eIO(seg(t, 24.3, 25.4));
  galley(hx, hy, 1.0, ha, t, { sail: .08 + sailK * .92, oars: t * 3.4 });
  // çeken ekip: halat, öküzler, askerler
  const ropeEnd = hx + 900;
  ctx.strokeStyle = '#c9b58a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx + 330, hy - 60); ctx.quadraticCurveTo(hx + 600, g(hx + 600) - 60, ropeEnd, g(ropeEnd) - 70); ctx.stroke();
  oxen(hx + 760, g(hx + 760) + 4, 1.05, t * 6.5); oxen(hx + 990, g(hx + 990) + 4, 1.05, t * 6.5 + 1.3);
  for (let i = 0; i < 6; i++) { const x = hx + 420 + i * 62; soldier(x, g(x) + 6, 1.05, t * 7 + i * .9, { lean: .5, col: i % 2 ? '#8e1c22' : '#1f3e6e' }); }
  // davulcular
  const drumX = hx - 120; [0, 1].forEach(i => soldier(drumX - i * 80, g(drumX - i * 80) + 30, 1.15, t * Math.PI * 2 * 1.6 / 2 + i, { lean: .05, drum: true, col: '#6e1218' }));
  ctx.restore(); ctx.restore();
  // ışık: gece rengi + meşale havuzları
  grade('#7484c4', .85);
  const scr = ([x, y]) => [(x - camX - W / 2) * zoom + W / 2, (y + camY - 40 - H * .62) * zoom + H * .62];
  for (const p of torches) lightPool(...scr(p), 460 * zoom, 'rgba(255,140,50,.9)', .8);
  lightPool(W * .45, H * .62, 700, 'rgba(255,150,70,.35)', .6);
  embers(t, torches.map(scr), 9);
  // ön plan: geçen mızraklı siluetler
  ctx.fillStyle = '#020204';
  for (let i = 0; i < 3; i++) { const x = ((i * 520 - lt * 260) % 1600 + 1600) % 1600 - 260; soldier(x, H + 120, 2.6, t * 6 + i, { sil: '#020204', lean: .2 }); }
  fog(1700, 200, 'rgba(40,40,80,.7)', .5, t, 40);
  kinetic('22 NİSAN 1453 · GECE', W / 2, 300, 66, t, 20.1, { fam: F.cinzel, w: 900, mode: 'letters', spacing: 4, out: 24 });
  if (t > 24.3) { kinetic('YELKENLER AÇIK', W / 2, 330, 120, t, 24.4, { gold: true }); kinetic('DAVULLAR ÇALARAK', W / 2, 470, 96, t, 25.4, {}); }
};

// ---- 6. ŞAFAK: surlardan Haliç'e bakış
S.dawn = t => {
  const lt = t - 27.6, k = seg(t, 27.6, 31.8), reveal = eIO(seg(t, 28.2, 30.1)), push = 1 + lt * .04;
  ctx.fillStyle = lg(0, 0, 0, H, [[0, mix('#1c1640', '#3a3170', k)], [.38, mix('#6a3d6a', '#d77a5a', k)], [.52, mix('#c76b4e', '#ffc07a', k)], [1, '#140c1c']]); ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H * .55); ctx.scale(push, push); ctx.translate(-W / 2, -H * .55);
  sun(820, 930 - k * 90, 70, .4 + k * .6); godRays(820, 930 - k * 90, t, 'rgba(255,190,120,A)', .14 * k);
  // Galata tepeleri + kule
  const hill = x => 900 - 110 * Math.sin((x + 120) * .0035) - 40 * Math.sin(x * .011);
  ctx.fillStyle = mix('#3a2a50', '#7a5070', k); ctx.beginPath(); ctx.moveTo(-50, 1100); for (let x = -50; x <= W + 50; x += 12) ctx.lineTo(x, hill(x)); ctx.lineTo(W + 50, 1100); ctx.fill();
  galataTower(300, hill(300) + 20, .8, mix('#3a2a50', '#6a4062', k));
  // Haliç suyu
  ctx.fillStyle = lg(0, 1000, 0, 1500, [[0, mix('#5a4a78', '#e09a7a', k)], [1, '#1c1630']]); ctx.fillRect(0, 1000, W, 600);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const y = 1010 + i * i * 1.8, w = 60 + i * 14; ctx.fillStyle = `rgba(255,200,140,${.25 * k * (1 - i / 16)})`; ctx.fillRect(820 - w / 2 + Math.sin(t * 2 + i) * 10, y, w, 3); } ctx.restore();
  // sisten çıkan Osmanlı gemileri
  [[150, 1080, .42], [520, 1110, .5], [880, 1070, .38], [330, 1180, .62], [760, 1220, .7]].forEach(([x, y, s], i) => {
    const a = clamp(reveal * 1.6 - i * .15); ctx.save(); ctx.globalAlpha = a;
    galley(x + Math.sin(t * .6 + i) * 6, y + Math.sin(t * 1.4 + i) * 4, s, Math.sin(t * 1.2 + i) * .015, t, { sil: mix('#1e1026', '#2e1830', i / 5), sail: 1 }); ctx.restore();
  });
  fog(1100, 260, `rgba(255,220,220,.8)`, .75 * (1 - reveal * .7), t, 15);
  ctx.restore();
  // ön plan: sur dişleri ve Bizans askerleri
  const fg = '#0d0710';
  ctx.fillStyle = fg; ctx.fillRect(0, 1380, W, 600); for (let x = -20; x < W; x += 150) ctx.fillRect(x, 1290, 90, 100);
  const flinch = eOut(seg(t, 30.15, 30.6)) * 30;
  [[300, 1.45, 0], [700, 1.6, 1]].forEach(([x, s, i]) => {
    ctx.save(); ctx.translate(x - (i ? flinch : 0), 1395); ctx.scale(s, s); ctx.fillStyle = fg;
    ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-48, -150); ctx.quadraticCurveTo(0, -175, 48, -150); ctx.lineTo(62, 0); ctx.fill(); // pelerin
    ctx.beginPath(); ctx.arc(0, -185, 30, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-34, -190); ctx.quadraticCurveTo(0, -250, 34, -190); ctx.fill(); ctx.fillRect(-3, -255, 6, 30); // miğfer
    ctx.fillRect(i ? 52 : -60, -420, 8, 420); ctx.beginPath(); ctx.moveTo((i ? 56 : -56) - 10, -420); ctx.lineTo(i ? 56 : -56, -460); ctx.lineTo((i ? 56 : -56) + 10, -420); ctx.fill();
    ctx.strokeStyle = `rgba(255,170,100,${.7 * k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -185, 30, -1.2, .4); ctx.stroke(); ctx.restore();
  });
  kinetic('ŞAFAK · 22 NİSAN', W / 2, 300, 64, t, 27.8, { fam: F.cinzel, w: 900, mode: 'letters', spacing: 4, out: 29.9 });
  kinetic('HALİÇ’TE!', W / 2, 420, 190, t, 30.15, { mode: 'slam', gold: true, rot: -.03 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,220,180,${.5 * hitPulse(t, 30.15, .5)})`; ctx.fillRect(0, 0, W, H); ctx.restore();
};

// ---- 7. DÜŞÜŞ HARİTASI: savunma bölünür, şehir düşer
S.fall = t => {
  const cam = camAt(CAM.fall, t), red = eIO(seg(t, 34.1, 35.6)); mapBase(t, cam, { cityRed: red });
  inWorld(cam, () => {
    [[800, 935], [870, 965], [950, 1010], [720, 900]].forEach(([x, y], i) => shipIcon(x, y + Math.sin(t * 2 + i) * 2, -2.6, '#b3262d', 1.3));
    for (let i = 0; i < 10; i++) { const x = 330 + (i % 3) * 60, y = 950 + i * 50; ctx.fillStyle = '#a3202a'; ctx.strokeStyle = '#2a0d08'; ctx.lineWidth = 2; ctx.fillRect(x - 14, y - 9, 28, 18); ctx.strokeRect(x - 14, y - 9, 28, 18); }
  });
  // savunma ikiye bölünür (mavi oklar)
  arrow(cam, [[640, 1180], [720, 1100], [820, 1010]], eIO(seg(t, 31.9, 33.2)), 22, '#3b5ba8', { col0: 'rgba(59,91,168,.3)', edge: '#0d1838' });
  arrow(cam, [[620, 1240], [780, 1160], [960, 1070]], eIO(seg(t, 32.1, 33.4)), 22, '#3b5ba8', { col0: 'rgba(59,91,168,.3)', edge: '#0d1838' });
  // taarruz (kırmızı oklar)
  [[[380, 1180], [600, 1190], [800, 1210]], [[380, 1050], [580, 1060], [760, 1110]], [[380, 1320], [600, 1290], [820, 1290]]].forEach((p, i) => arrow(cam, p, eIO(seg(t, 33.9 + i * .12, 35.2 + i * .12)), 32, '#c0262f', { col0: 'rgba(192,38,47,.35)' }));
  if (t > 34.05) { const [x, y] = W2S(cam, 585, 1185); const k = seg(t, 34.05, 34.7); ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(x, y, 260 * eOut(k), `rgba(255,170,60,${1 - k})`); ctx.restore(); }
  mapLabel(cam, 'İSTANBUL', 860, 1235, 44); mapLabel(cam, 'HALİÇ', 860, 936, 24, { rot: .42, col: '#e6f0f0', halo: 'rgba(30,60,80,.6)' });
  mapLabel(cam, 'KARA SURLARI', 470, 1120, 20, { rot: -1.35, fam: F.mont, a: seg(t, 32, 32.5) });
  if (t > 34.2) { const [x, y] = W2S(cam, 860, 1180); const k = eBack(seg(t, 34.2, 34.6)); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fill(); ctx.fillStyle = '#b21c26'; ctx.beginPath(); ctx.arc(14, 0, 45, 0, TAU); ctx.fill(); ctx.restore(); }
  paperFrame();
  kinetic('SAVUNMA BÖLÜNDÜ', W / 2, 340, 100, t, 31.9, { out: 33.6 });
  stamp('29 MAYIS 1453', W / 2, 360, 84, t, 34.0, '#9b1c1c', -.05);
};

// ---- 8. FİNAL: gün doğarken İstanbul silueti
function skyline(t, base, col, minK) {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-20, H); for (let x = -20; x <= W + 20; x += 20) ctx.lineTo(x, base - 60 - 30 * Math.sin(x * .006 + 1)); ctx.lineTo(W + 20, H); ctx.fill();
  ctx.fillRect(-20, base - 40, W + 40, 200); for (let x = 0; x < W; x += 40) ctx.fillRect(x, base - 62, 24, 24);
  [[90, 120], [330, 110], [860, 130], [1010, 100]].forEach(([x, h]) => { ctx.fillRect(x - 30, base - 40 - h, 60, h); for (let i = 0; i < 3; i++) ctx.fillRect(x - 30 + i * 24, base - 58 - h, 14, 20); });
  const cx = 560, cy = base - 210;
  ctx.fillRect(cx - 230, cy, 460, 200);
  ctx.beginPath(); ctx.ellipse(cx, cy, 170, 130, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(cx - 4, cy - 170, 8, 50);
  [[-1, 1]].flat().forEach(d => { ctx.beginPath(); ctx.ellipse(cx + d * 200, cy + 30, 80, 60, 0, Math.PI, 0); ctx.fill(); });
  [[-280, 360], [280, 360], [-330, 300], [330, 300]].forEach(([dx, mh]) => { const h = mh * minK; if (h <= 2) return; const x = cx + dx;
    ctx.fillRect(x - 10, cy + 200 - h, 20, h); ctx.fillRect(x - 17, cy + 200 - h * .7, 34, 8); ctx.fillRect(x - 15, cy + 200 - h * .9, 30, 7);
    ctx.beginPath(); ctx.moveTo(x - 14, cy + 200 - h); ctx.lineTo(x, cy + 200 - h - 80 * minK); ctx.lineTo(x + 14, cy + 200 - h); ctx.fill(); });
}
S.finale = t => {
  const k = seg(t, 36.2, 39), lt = t - 36.2;
  ctx.fillStyle = lg(0, 0, 0, H, [[0, mix('#3a2a60', '#6a4a80', k)], [.35, mix('#d0704a', '#f0a050', k)], [.55, mix('#ffc070', '#ffe2a0', k)], [1, '#2a1018']]); ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H * .6); const z = 1.08 - lt * .02; ctx.scale(z, z); ctx.translate(-W / 2, -H * .6);
  sun(560, 1000 - k * 120, 110); godRays(560, 1000 - k * 120, t, 'rgba(255,210,140,A)', .2);
  for (let i = 0; i < 9; i++) { const bx = ((lt * (60 + i * 8) + i * 130) % 1300) - 100, by = 640 + (i % 4) * 60 + Math.sin(lt * 2 + i) * 10, f = Math.sin(t * 9 + i) * 10; ctx.strokeStyle = '#2a1420'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 16, by - f); ctx.quadraticCurveTo(bx - 6, by - 6, bx, by); ctx.quadraticCurveTo(bx + 6, by - 6, bx + 16, by - f); ctx.stroke(); }
  skyline(t, 1330, '#24101c', eIO(seg(t, 36.6, 38.4)));
  // sancak
  const fy = lerp(1180, 900, eIO(seg(t, 36.4, 37.8))), wv = Math.sin(t * 6) * 10; ctx.fillStyle = '#24101c'; ctx.fillRect(1006, 880, 8, 330);
  ctx.fillStyle = '#c4222e'; ctx.beginPath(); ctx.moveTo(1014, fy); ctx.quadraticCurveTo(940, fy - 16 + wv, 870, fy + wv); ctx.lineTo(870, fy + 90 + wv); ctx.quadraticCurveTo(940, fy + 74 + wv, 1014, fy + 90); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(950, fy + 45 + wv * .5, 22, 0, TAU); ctx.fill(); ctx.fillStyle = '#c4222e'; ctx.beginPath(); ctx.arc(942, fy + 45 + wv * .5, 18, 0, TAU); ctx.fill();
  ctx.fillStyle = lg(0, 1380, 0, H, [[0, '#4a2a3a'], [1, '#120810']]); ctx.fillRect(0, 1380, W, 600);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 18; i++) { const y = 1390 + i * i * 1.6, w = 80 + i * 18; ctx.fillStyle = `rgba(255,210,150,${.3 * (1 - i / 18)})`; ctx.fillRect(560 - w / 2 + Math.sin(t * 2 + i) * 12, y, w, 3); } ctx.restore();
  ctx.restore();
  // ORTA ÇAĞ → YENİ ÇAĞ
  const strike = eIO(seg(t, 36.9, 37.3));
  if (t > 36.4) { kinetic('ORTA ÇAĞ', W / 2, 330, 120, t, 36.4, { fam: F.cinzel, w: 900, col: '#f3e6c4', out: 37.6 });
    if (t < 37.9) { ctx.strokeStyle = '#c0262f'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W / 2 - 330, 340); ctx.lineTo(W / 2 - 330 + 660 * strike, 320); ctx.stroke(); } }
  kinetic('YENİ ÇAĞ', W / 2, 330, 124, t, 37.75, { fam: F.cinzel, w: 900, gold: true, mode: 'letters', spacing: 6 });
  // CTA
  const c = eOut(seg(t, 38.9, 39.3));
  if (c > 0) { ctx.save(); ctx.globalAlpha = c; ctx.translate(0, (1 - c) * 40);
    ctx.fillStyle = 'rgba(14,6,8,.82)'; ctx.beginPath(); ctx.roundRect(110, 1400, 860, 230, 34); ctx.fill(); ctx.strokeStyle = 'rgba(242,199,92,.7)'; ctx.lineWidth = 3; ctx.stroke();
    title('TAKİP ET', W / 2, 1468, 78, { gold: true }); setFont(36, F.mont, 800); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('Sonraki bölüm: Şahi Topları', W / 2, 1572); ctx.restore(); }
};

/* ================= kurgu: sahneler + geçişler ================= */
const bufA = mkCanvas(W, H), bufB = mkCanvas(W, H);
function drawScene(id, t, target) {
  const prev = ctx; ctx = target; ctx.save(); ctx.clearRect(0, 0, W, H);
  const [sx, sy] = shakeAt(t); ctx.translate(sx, sy); ctx.translate(W / 2, H / 2); ctx.scale(1.02, 1.02); ctx.translate(-W / 2, -H / 2);
  S[id](t); ctx.restore(); ctx = prev;
}
const sceneAt = t => (TL.scenes.find(s => t >= s.t0 && t < s.t1) || TL.scenes[TL.scenes.length - 1]);
function render(tReal) {
  const t = toAnim(tReal);
  const out = main.getContext('2d'), tr = TL.transitions.find(x => Math.abs(t - x.t) < x.d);
  out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = 1; out.globalCompositeOperation = 'source-over';
  if (!tr) { drawScene(sceneAt(t).id, t, out); }
  else {
    const a = sceneAt(tr.t - .001).id, b = sceneAt(tr.t + .001).id, k = (t - (tr.t - tr.d)) / (2 * tr.d);
    drawScene(a, t, bufA.getContext('2d')); drawScene(b, t, bufB.getContext('2d'));
    out.fillStyle = '#000'; out.fillRect(0, 0, W, H);
    const blit = (img, alpha, s = 1, dx = 0) => { out.save(); out.globalAlpha = alpha; out.translate(W / 2 + dx, H / 2); out.scale(s, s); out.drawImage(img, -W / 2, -H / 2); out.restore(); };
    if (tr.type === 'flash') { blit(bufA, 1, 1 + eIO(k) * .25); blit(bufB, eIO(k), 1.15 - eIO(k) * .15); out.fillStyle = `rgba(255,244,220,${Math.pow(1 - Math.abs(2 * k - 1), 2)})`; out.fillRect(0, 0, W, H); }
    else if (tr.type === 'dip') { if (k < .5) blit(bufA, 1 - k * 2); else blit(bufB, k * 2 - 1); }
    else if (tr.type === 'whip') { const e = eIO(k); for (let i = 0; i < 6; i++) { const o = i / 6 * 120 * Math.sin(k * Math.PI); blit(bufA, (1 - e) / 3, 1, -e * W - o); blit(bufB, e / 3, 1, (1 - e) * W - o); } }
    else if (tr.type === 'dive') { blit(bufA, 1 - eIO(k), 1 + eIO(k) * 2.5); blit(bufB, eIO(k), .8 + eIO(k) * .2); }
  }
  ctx = out; captions(tReal); finish(t);
}
window.renderAt = render; window.DUR = DUR;
