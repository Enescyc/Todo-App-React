/* Osmanlı serisi – ortak görsel dil (shared/engine.js'ten SONRA, bölümün scenes.js'inden ÖNCE yüklenir).
 * Seri imzası, güven rozetleri, başlık/sonraki bölüm kartları, yıl sayacı, harita iğnesi, sikke, parşömen, mürekkep,
 * rüya ağacı, çadır, sancak, tuğ, atlı, Bizanslı tarihçi, boş arşiv, zaman çizgisi boşluğu, çatlak ve geri sarma efektleri.
 * Portre yok: kişiler siluet ve nesneyle anlatılır. EP.series = {season:'UÇTAKİ BEYLİK', n:1, of:10} (n:0 = fragman). */
'use strict';
const GOLD = '#f2c75c', INK = '#1a120a', PAPER = '#e8d5a8';
// coğrafi koordinattan harita km'sine (AB_MAP projeksiyonu)
const LL = (lon, lat) => {
  const P = GEO.proj, r = Math.PI / 180, l = lon * r, p = lat * r, l0 = P.lon0 * r, p0 = P.lat0 * r;
  const k = Math.sqrt(2 / (1 + Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0)));
  return [6371 * k * Math.cos(p) * Math.sin(l - l0), -6371 * k * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0))];
};
const CITY = GEO.cities;
// şehir noktası + km kayması: cityPt('Bursa', [0, 20])
const cityPt = (n, d) => { const p = CITY[n]; return [p[0] + (d?.[0] || 0), p[1] + (d?.[1] || 0)]; };
// nehri parlat (Tuna, Fırat, Meriç...)
function riverGlow(cam, name, a, col = '#bfe6ff') {
  if (a <= 0 || !PATHS.rivers[name]) return;
  inWorld(cam, () => { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'screen';
    for (const [w, al] of [[16, .25], [7, .55], [3, .95]]) { ctx.strokeStyle = rgba(col, al * a); ctx.lineWidth = w / cam[2]; ctx.stroke(PATHS.rivers[name]); } ctx.restore(); });
}
// Instagram Reels güvenli alanı: üst ~220 px ve alt ~420 px arayüzle örtülür → imza, rozet ve notlar bu bölgelerin dışında
const SAFE_TOP = 232, NOTE_Y = 1452;
const BADGE = {
  belge: { c: '#3f9a4a', s: 'BELGE' }, tartismali: { c: '#d9a21b', s: 'TARTIŞMALI' },
  rivayet: { c: '#c0392b', s: 'RİVAYET' }, dogrulanacak: { c: '#b8b2a6', s: 'DOĞRULANACAK' },
};
const BADGES_R = (EP.badges || []).map(b => ({ ...b, t0: cue(b.from), t1: cue(b.to) }));
const CARDS_R = (EP.cards || []).map(c => ({ ...c, t0: cue(c.from), t1: c.to ? cue(c.to) : DUR + 1 }));
const blink = (t, t0, t1, a = .25, b = .3) => clamp(Math.min(seg(t, t0, t0 + a), 1 - seg(t, t1 - b, t1)));

/* ---------- seri imzası: sol üst ---------- */
window.BRAND = t => {
  const S = EP.series || {}; if (S.hide) return;
  ctx.save(); ctx.fillStyle = 'rgba(10,6,4,.55)'; ctx.beginPath(); ctx.roundRect(54, SAFE_TOP, 404, 66, 33); ctx.fill();
  ctx.strokeStyle = 'rgba(242,199,92,.55)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(242,199,92,.12)'; ctx.beginPath(); ctx.arc(94, SAFE_TOP + 33, 24, 0, TAU); ctx.fill(); miniTree(94, SAFE_TOP + 54, .135, 1, t, { leaves: false });
  setFont(26, F.cinzel, 900); ctx.fillStyle = GOLD; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '2px'; ctx.fillText(S.season || 'OSMANLI', 124, SAFE_TOP + 26);
  setFont(19, F.mont, 800); ctx.letterSpacing = '3px'; ctx.fillStyle = 'rgba(255,255,255,.78)';
  ctx.fillText(S.n ? `BÖLÜM ${S.n}/${S.of}` : 'FRAGMAN', 125, SAFE_TOP + 48);
  if (S.n) for (let i = 0; i < S.of; i++) { ctx.fillStyle = i < S.n ? GOLD : 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(300 + i * 14, SAFE_TOP + 48, i === S.n - 1 ? 5 : 3.6, 0, TAU); ctx.fill(); }
  ctx.restore();
};
/* ---------- son katman: sıcak ton + rozetler + kartlar ---------- */
window.POST = (t, s) => {
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .22; ctx.fillStyle = '#c8a46a'; ctx.fillRect(0, 0, W, H); ctx.restore();
  for (const b of BADGES_R) if (t > b.t0 - .1 && t < b.t1 + .1) badge(t, b);
  for (const c of CARDS_R) if (t > c.t0 - .1 && t < c.t1 + .1) (c.type === 'next' ? nextCard : titleCard)(t, c);
  if (s && s.note) mapNote(s.note);
};
function badge(t, b) {
  const k = blink(t, b.t0, b.t1, .35, .3); if (k <= 0) return;
  const B = BADGE[b.k], pop = eBack(seg(t, b.t0, b.t0 + .35));
  ctx.save(); setFont(24, F.mont, 900); ctx.letterSpacing = '3px';
  const w = ctx.measureText(B.s).width + 86, x = W - 54 - w, y = SAFE_TOP;
  ctx.globalAlpha = k; ctx.translate(x + w, y + 33); ctx.scale(lerp(.6, 1, pop), lerp(.6, 1, pop)); ctx.translate(-(x + w), -(y + 33));
  ctx.fillStyle = 'rgba(10,6,4,.62)'; ctx.beginPath(); ctx.roundRect(x, y, w, 66, 33); ctx.fill();
  ctx.strokeStyle = rgba(B.c, .9); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = B.c; ctx.beginPath(); ctx.arc(x + 36, y + 33, 13, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(x + 32, y + 29, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(B.s, x + 60, y + 35);
  if (b.src) { setFont(20, F.mont, 800); ctx.letterSpacing = '1px'; ctx.textAlign = 'right'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(b.src, x + w - 6, y + 92); ctx.fillStyle = 'rgba(255,255,255,.88)'; ctx.fillText(b.src, x + w - 6, y + 92); }
  ctx.restore();
}
function mapNote(s) {
  ctx.save(); setFont(20, F.mont, 800); ctx.letterSpacing = '2px'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(20,12,6,.55)'; const w = ctx.measureText(s).width + 28; ctx.beginPath(); ctx.roundRect(W - 40 - w, NOTE_Y, w, 36, 18); ctx.fill();
  ctx.fillStyle = 'rgba(255,240,210,.8)'; ctx.fillText(s, W - 54, NOTE_Y + 19); ctx.restore();
}
// bölüm başlığı: {kicker, title:[satırlar], sub}
function titleCard(t, c) {
  const k = blink(t, c.t0, c.t1, .5, .45); if (k <= 0) return;
  const y = c.y ?? 780;
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = lg(0, y - 300, 0, y + 300, [[0, 'rgba(8,5,3,0)'], [.3, 'rgba(8,5,3,.72)'], [.7, 'rgba(8,5,3,.72)'], [1, 'rgba(8,5,3,0)']]); ctx.fillRect(0, y - 300, W, 600);
  const rl = eOut(seg(t, c.t0 + .1, c.t0 + .9)) * 300;
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - rl, y - 150); ctx.lineTo(W / 2 + rl, y - 150); ctx.moveTo(W / 2 - rl, y + 150); ctx.lineTo(W / 2 + rl, y + 150); ctx.stroke();
  for (const sx of [-1, 1]) { ctx.save(); ctx.translate(W / 2 + sx * (rl + 14), y - 150); ctx.rotate(Math.PI / 4); ctx.fillStyle = GOLD; ctx.fillRect(-6, -6, 12, 12); ctx.restore(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = k;
  if (c.kicker) kinetic(c.kicker, W / 2, y - 105, 34, t, c.t0 + .15, { mode: 'fade', fam: F.mont, w: 900, spacing: 10, col: GOLD, stroke: false });
  (c.title || []).forEach((l, i, a) => kinetic(l, W / 2, y + (i - (a.length - 1) / 2) * 92 + 8, 84, t, c.t0 + .3 + i * .15, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 2 }));
  if (c.sub) kinetic(c.sub, W / 2, y + 112, 30, t, c.t0 + .8, { mode: 'fade', fam: F.mont, w: 800, spacing: 4, col: 'rgba(255,255,255,.85)', stroke: false });
  ctx.restore();
}
// sonraki bölüm kartı: {n, title, sub}
function nextCard(t, c) {
  const k = blink(t, c.t0, c.t1, .5, .3); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(6,4,2,.86)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.globalAlpha = k;
  miniTree(W / 2, 1270, .8, eOut(seg(t, c.t0 + .3, c.t0 + 1.8)), t);
  kinetic(c.kicker || 'SIRADAKİ', W / 2, 560, 34, t, c.t0 + .1, { mode: 'fade', fam: F.mont, w: 900, spacing: 10, col: GOLD, stroke: false });
  (c.title || []).forEach((l, i) => kinetic(l, W / 2, 660 + i * 90, 80, t, c.t0 + .25 + i * .12, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 2 }));
  if (c.sub) { setFont(30, F.mont, 800); const sw = Math.min(1, 960 / (ctx.measureText(c.sub).width + 4 * c.sub.length)); ctx.save(); ctx.translate(W / 2, 680 + (c.title || []).length * 90); ctx.scale(sw, sw); kinetic(c.sub, 0, 0, 30, t, c.t0 + .7, { mode: 'fade', fam: F.mont, w: 800, spacing: 4, col: 'rgba(255,255,255,.85)', stroke: false }); ctx.restore(); }
  ctx.restore();
}

/* ---------- yıl sayacı ---------- */
function yearTicker(x, y, Y, size = 120, o = {}) {
  const s = (o.approx ? '~' : '') + Math.floor(Y + 1e-6);
  ctx.save(); ctx.globalAlpha = o.a ?? 1; title(s, x, y, size, { fam: F.cinzel, w: 900, gold: true, spacing: 4, sw: .08 });
  if (o.label) { setFont(size * .22, F.mont, 900); ctx.letterSpacing = size * .06 + 'px'; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, x, y + size * .72); }
  ctx.restore();
}
/* ---------- harita iğnesi: dünya koordinatı, etiket, tarih ---------- */
function mapPin(cam, x, y, t, t0, label, o = {}) {
  const k = seg(t, t0, t0 + .45); if (k <= 0) return; const [sx, sy] = W2S(cam, x, y), drop = (1 - eOut(k)) * -120, col = o.col || '#a8322a';
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  for (let i = 0; i < 2; i++) { const r = ((t - t0 - .35 - i * .7) % 1.4 + 1.4) % 1.4 / 1.4; if (t - t0 > .35) { ctx.strokeStyle = rgba(col, .6 * (1 - r)); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, sy, 20 + r * 70, (20 + r * 70) * .45, 0, 0, TAU); ctx.stroke(); } }
  ctx.translate(sx, sy + drop);
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0, -drop + 4, 14, 6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-22, -30, -26, -46, -26, -56); ctx.arc(0, -56, 26, Math.PI, 0); ctx.bezierCurveTo(26, -46, 22, -30, 0, 0); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f4e8cc'; ctx.beginPath(); ctx.arc(0, -56, 10, 0, TAU); ctx.fill();
  if (label) {
    const lk = eBack(seg(t, t0 + .3, t0 + .65)); ctx.globalAlpha = (o.a ?? 1) * clamp(lk);
    setFont(o.size || 36, F.cinzel, 900); ctx.letterSpacing = '3px'; const w = ctx.measureText(label).width + 44, dir = o.left ? -1 : 1, bx = dir > 0 ? 40 : -40 - w;
    ctx.fillStyle = 'rgba(14,9,5,.82)'; ctx.beginPath(); ctx.roundRect(bx, -92, w, 58, 10); ctx.fill(); ctx.strokeStyle = rgba(GOLD, .7); ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = GOLD; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, bx + 22, -61);
    if (o.date) { setFont(24, F.mont, 900); ctx.letterSpacing = '3px'; ctx.fillStyle = '#fff'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(o.date, bx + 22, -14); ctx.fillText(o.date, bx + 22, -14); }
  }
  ctx.restore();
}
// harita üzerinde parlayan yol (uç bölgesi, sınır, ticaret): dünya noktaları
function glowPath(cam, pts, t, k, o = {}) {
  if (k <= 0) return; const P = spline(pts, 12), L = polyLen(P), sp = [];
  for (let i = 0; i < P.length && L[i] <= k * L[L.length - 1]; i++) sp.push(W2S(cam, ...P[i]));
  if (sp.length < 2) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'screen';
  for (const [w, a] of [[o.w * 3 || 46, .18], [o.w * 1.6 || 24, .35], [o.w || 10, .85]]) { ctx.strokeStyle = rgba(o.col || '#ffcf6a', a * (o.a ?? 1)); ctx.lineWidth = w; tracePath(sp); ctx.stroke(); }
  if (o.dash) { ctx.globalCompositeOperation = 'source-over'; ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = rgba(INK, .55 * (o.a ?? 1)); ctx.lineWidth = 3; tracePath(sp); ctx.stroke(); }
  ctx.restore();
}
// vergi/haraç akışı: noktalar bir yol boyunca akar
function flowDots(cam, pts, t, a = 1, o = {}) {
  if (a <= 0) return; const P = spline(pts.map(p => W2S(cam, ...p)), 12), L = polyLen(P);
  for (let i = 0; i < (o.n || 12); i++) { const k = fract(t * (o.speed || .35) + i / (o.n || 12)), [x, y] = pointAt(P, L, k), f = Math.sin(k * Math.PI);
    ctx.save(); ctx.globalAlpha = a * f; coinIcon(x, y, (o.r || 11) * (.7 + .3 * f)); ctx.restore(); }
}
function coinIcon(x, y, r) {
  ctx.fillStyle = rg(x - r * .3, y - r * .3, 0, r * 1.2, [[0, '#fff3c0'], [.5, '#e0b04a'], [1, '#8a6418']]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#5a400e'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r * .62, 0, TAU); ctx.stroke();
}

/* ---------- sikke (akçe): x,y merkez, r yarıçap; o: {flip (-1..1 dönüş), shine (0..1), seed, tr} ---------- */
const COIN_CACHE = {};
function coinFace(r, seed) {
  const key = r + ':' + seed; if (COIN_CACHE[key]) return COIN_CACHE[key];
  const S = Math.ceil(r * 2.2), c = mkCanvas(S, S), g = c.getContext('2d'), R = rng(seed), cx = S / 2;
  const edge = []; for (let i = 0; i < 90; i++) edge.push(r * (1 + (R() - .5) * .05 + Math.sin(i * .37 + seed) * .02));
  const shape = () => { g.beginPath(); edge.forEach((e, i) => { const a = i / 90 * TAU; g[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * e, cx + Math.sin(a) * e); }); g.closePath(); };
  shape(); g.fillStyle = (() => { const q = g.createRadialGradient(cx - r * .3, cx - r * .35, r * .1, cx, cx, r * 1.05); q.addColorStop(0, '#f1eee4'); q.addColorStop(.55, '#b9b4a6'); q.addColorStop(1, '#6f6b62'); return q; })(); g.fill();
  g.save(); shape(); g.clip();
  // aşınma ve patina
  for (let i = 0; i < 60; i++) { const a = R() * TAU, d = R() * r, rr = r * (.05 + R() * .18); g.fillStyle = `rgba(${R() > .5 ? '70,60,45' : '60,80,70'},${.05 + R() * .1})`; g.beginPath(); g.arc(cx + Math.cos(a) * d, cx + Math.sin(a) * d, rr, 0, TAU); g.fill(); }
  // kabartma çizgiler: önce koyu gölge, sonra açık vurgu
  const relief = (fn) => { g.save(); g.translate(1.5, 1.5); g.strokeStyle = 'rgba(40,36,30,.55)'; fn(); g.restore(); g.save(); g.translate(-1, -1); g.strokeStyle = 'rgba(255,255,250,.55)'; fn(); g.restore(); };
  g.lineCap = 'round'; g.lineJoin = 'round';
  relief(() => { g.lineWidth = r * .035; g.beginPath(); g.arc(cx, cx, r * .86, 0, TAU); g.stroke(); g.beginPath(); g.arc(cx, cx, r * .62, 0, TAU); g.stroke(); });
  relief(() => { g.lineWidth = r * .02; for (let i = 0; i < 44; i++) { const a = i / 44 * TAU; g.beginPath(); g.arc(cx + Math.cos(a) * r * .74, cx + Math.sin(a) * r * .74, r * .028, 0, TAU); g.stroke(); } });
  // merkez: soyut hat kümeleri (gerçek yazıyı taklit etmez)
  relief(() => {
    g.lineWidth = r * .045;
    for (let row = 0; row < 3; row++) {
      const yy = cx + (row - 1) * r * .32; let x = cx - r * .42;
      while (x < cx + r * .4) {
        const w = r * (.08 + R() * .14), h = r * (.06 + R() * .12);
        g.beginPath(); g.moveTo(x, yy); g.bezierCurveTo(x + w * .3, yy - h * (R() > .5 ? 1.6 : -.4), x + w * .7, yy + h * .4, x + w, yy - h * .2); g.stroke();
        if (R() > .55) { g.beginPath(); g.moveTo(x + w * .5, yy - h * 1.6); g.lineTo(x + w * .5, yy + h * .1); g.stroke(); }
        if (R() > .7) { g.beginPath(); g.arc(x + w * .4, yy + h * 1.1, r * .02, 0, TAU); g.stroke(); }
        x += w + r * .03;
      }
    }
  });
  g.restore();
  shape(); g.strokeStyle = 'rgba(50,46,40,.8)'; g.lineWidth = 2; g.stroke();
  return (COIN_CACHE[key] = c);
}
function coin(x, y, r, t, o = {}) {
  const img = coinFace(Math.round(r), o.seed || 1299), fx = o.flip ?? 1, S = img.width;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(r * .08, r * 1.12, r * .9 * Math.abs(fx), r * .14, 0, 0, TAU); ctx.fill();
  ctx.scale(Math.max(.04, Math.abs(fx)), 1);
  if (Math.abs(fx) < .999) { ctx.fillStyle = '#7d786c'; ctx.beginPath(); ctx.arc(r * .06 * Math.sign(fx), 0, r, 0, TAU); ctx.fill(); }
  ctx.drawImage(img, -S / 2, -S / 2);
  if (o.shine !== undefined && o.shine > -1 && o.shine < 2) {
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    const sx = lerp(-r * 1.6, r * 1.6, o.shine); ctx.fillStyle = lg(sx - r * .5, -r, sx + r * .5, r, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,250,235,.45)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.restore();
  }
  ctx.restore();
}

/* ---------- parşömen ve mürekkep ---------- */
const PARCH_CACHE = {};
function parchmentImg(w, h, seed) {
  const key = [w, h, seed].join(':'); if (PARCH_CACHE[key]) return PARCH_CACHE[key];
  const c = mkCanvas(w + 40, h + 40), g = c.getContext('2d'), R = rng(seed);
  g.translate(20, 20); const pts = [];
  const jag = (x0, y0, x1, y1, n) => { for (let i = 0; i < n; i++) { const k = i / n; pts.push([lerp(x0, x1, k) + (R() - .5) * 10, lerp(y0, y1, k) + (R() - .5) * 10]); } };
  jag(0, 0, w, 0, 30); jag(w, 0, w, h, 50); jag(w, h, 0, h, 30); jag(0, h, 0, 0, 50);
  g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y)); g.closePath();
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 30; g.shadowOffsetY = 12; g.fillStyle = PAPER; g.fill(); g.shadowColor = 'transparent';
  g.save(); g.clip();
  const q = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .2, w / 2, h / 2, Math.max(w, h) * .75); q.addColorStop(0, 'rgba(255,245,220,.5)'); q.addColorStop(.7, 'rgba(160,110,50,.15)'); q.addColorStop(1, 'rgba(70,40,10,.75)'); g.fillStyle = q; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const x = R() * w, y = R() * h, r = 20 + R() * 90; g.fillStyle = `rgba(120,80,30,${.03 + R() * .05})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  g.strokeStyle = 'rgba(110,80,40,.08)'; g.lineWidth = 1; for (let i = 0; i < 200; i++) { const x = R() * w, y = R() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - .5) * 60, y + (R() - .5) * 8); g.stroke(); }
  g.restore();
  return (PARCH_CACHE[key] = c);
}
function parchment(x, y, w, h, o = {}) { const img = parchmentImg(w, h, o.seed || 7); ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.drawImage(img, -w / 2 - 20, -h / 2 - 20); ctx.restore(); }
// soyut el yazısı satırları (okunur metin taklidi yok). style: 'greek' (dik, yuvarlak) | 'arabic' (yatay, akıcı, sağdan sola)
const SCRIPT_CACHE = {};
function scriptStrokes(w, n, seed, style) {
  const key = [w, n, seed, style].join(':'); if (SCRIPT_CACHE[key]) return SCRIPT_CACHE[key];
  const R = rng(seed), lines = [];
  for (let l = 0; l < n; l++) {
    const pts = []; let x = 0; const lw = w * (l === n - 1 ? .55 : .9 + R() * .1);
    while (x < lw) {
      if (style === 'greek') {
        const g = Math.floor(R() * 6), h = 12 + R() * 8, c = (a, rx, ry, a0, a1, n = 6) => { for (let i = 0; i <= n; i++) { const q = a0 + (a1 - a0) * i / n; pts.push([x + a + Math.cos(q) * rx, -h * .45 + Math.sin(q) * ry]); } };
        if (g === 0) c(6, 6, h * .45, Math.PI * .5, Math.PI * 2.6);                                   // o
        else if (g === 1) { pts.push([x + 2, -h * 1.6], [x + 3, 0], [x + 9, -h * .7], [x + 12, 0]); }    // h benzeri
        else if (g === 2) { pts.push([x, 0], [x + 2, -h * .8]); c(8, 6, h * .4, Math.PI, Math.PI * 2, 5); pts.push([x + 14, 0]); } // n
        else if (g === 3) { c(6, 6, h * .4, -Math.PI * .2, Math.PI * 1.3, 6); pts.push([x + 13, -h * .9], [x + 13, h * .5]); } // a/q
        else if (g === 4) { pts.push([x, -h * .9], [x + 6, 0], [x + 12, -h * .9]); }                 // v
        else { c(6, 6, h * .45, Math.PI * .1, Math.PI * 1.7, 6); pts.push([x + 10, -h * .5]); }        // e
        x += 16 + R() * 5; if (R() > .82) { pts.push(null); x += 14; } else if (R() > .6) pts.push(null);
      }
      else { const h = 6 + R() * 10; pts.push([x, 0], [x + 10, -h * .3], [x + 18, 2], [x + 26, -(R() > .6 ? h * 2.4 : h)], [x + 30, 0]); x += 34 + R() * 10; if (R() > .75) { pts.push(null); x += 18; } }
    }
    lines.push(pts);
  }
  return (SCRIPT_CACHE[key] = lines);
}
function inkScript(x, y, w, n, t, t0, dur, o = {}) {
  const lines = scriptStrokes(w, n, o.seed || 3, o.style || 'greek'), lh = o.lh || 54, total = lines.reduce((a, l) => a + l.length, 0);
  let budget = clamp((t - t0) / dur) * total; if (budget <= 0) return null; let tip = null;
  ctx.save(); ctx.strokeStyle = o.col || 'rgba(40,22,8,.85)'; ctx.lineWidth = o.lw || 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  lines.forEach((pts, li) => {
    if (budget <= 0) return; const m = Math.min(pts.length, Math.floor(budget)); budget -= pts.length;
    const rtl = o.style === 'arabic', base = y + li * lh;
    ctx.beginPath(); let pen = false;
    for (let i = 0; i < m; i++) { const p = pts[i]; if (!p) { pen = false; continue; } const px = rtl ? x + w - p[0] : x + p[0], py = base + p[1]; pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py); pen = true; tip = [px, py]; }
    ctx.stroke();
  });
  ctx.restore(); return tip;
}
// mürekkep damlası: üstten düşer, kâğıtta yayılır
function inkDrop(x, y, t, t0, o = {}) {
  const fall = seg(t, t0, t0 + .35), sp = eOut(seg(t, t0 + .35, t0 + 2.2)); if (fall <= 0) return;
  ctx.save(); ctx.fillStyle = o.col || INK;
  if (fall < 1) { const yy = lerp(y - 700, y, eIn(fall)); ctx.beginPath(); ctx.ellipse(x, yy, 9, 16, 0, 0, TAU); ctx.fill(); }
  else {
    const R = rng(o.seed || 11), r = (o.r || 120) * sp; ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, rr = r * (.75 + .25 * Math.sin(a * 5 + 1) * Math.cos(a * 3) + .12 * R()); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .8); }
    ctx.fill(); for (let i = 0; i < 9; i++) { const a = R() * TAU, d = r * (1.1 + R() * .5); ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .8, 3 + R() * 9 * sp, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

/* ---------- rüya ağacı (sezon motifi; RİVAYET'ten gelir, logo olarak kullanılır) ---------- */
const TREE = (() => { const R = rng(1299), br = []; (function grow(x, y, a, len, d, p) { const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, id = br.length; br.push({ x, y, x2, y2, d, w: Math.max(1, 9 - d * 1.2), p }); if (d < 7) { const n = d < 2 ? 3 : 2; for (let i = 0; i < n; i++) grow(x2, y2, a + (i - (n - 1) / 2) * (.5 + R() * .25) + (R() - .5) * .2, len * (.72 + R() * .1), d + 1, id); } })(0, 0, -Math.PI / 2, 90, 0, -1); return br; })();
function miniTree(x, y, s, g, t, o = {}) {
  if (g <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.strokeStyle = o.col || GOLD;
  for (const b of TREE) { const k = clamp(g * 8 - b.d); if (k <= 0) continue; ctx.lineWidth = b.w; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(lerp(b.x, b.x2, k), lerp(b.y, b.y2, k)); ctx.stroke(); }
  if (o.leaves !== false && g > .85) { ctx.globalCompositeOperation = 'lighter'; for (const b of TREE) if (b.d === 7) { const a = clamp((g - .85) / .15) * (.6 + .4 * Math.sin(t * 2 + b.x)); ctx.fillStyle = `rgba(255,214,120,${.5 * a})`; ctx.beginPath(); ctx.arc(b.x2, b.y2, 6, 0, TAU); ctx.fill(); } }
  ctx.restore();
}

/* ---------- siluetler: çadır, sancak, tuğ, atlı, Bizanslı tarihçi ---------- */
function pennant(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.sil || o.col || '#a8322a';
  ctx.strokeStyle = o.sil || '#2a1a0c'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -260); ctx.stroke();
  ctx.fillStyle = o.sil || '#c9a24a'; ctx.beginPath(); ctx.moveTo(0, -282); ctx.lineTo(-7, -262); ctx.lineTo(7, -262); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -255);
  for (let i = 0; i <= 12; i++) { const k = i / 12, xx = k * 170, w = Math.sin(t * 5 - k * 5) * 10 * k; ctx.lineTo(xx, -255 + w + k * 30); }
  for (let i = 12; i >= 0; i--) { const k = i / 12, xx = k * 170, w = Math.sin(t * 5 - k * 5) * 10 * k; ctx.lineTo(xx, -170 + w - k * 55); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function tent(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const sil = o.sil;
  if (o.smoke !== false) for (let i = 0; i < 8; i++) { const k = fract(t * .25 + i / 8); ctx.globalAlpha = .25 * (1 - k); ctx.fillStyle = '#d9cbb0'; ctx.beginPath(); ctx.arc(Math.sin(k * 6 + i) * 20 + k * 60, -230 - k * 260, 14 + k * 40, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
  ctx.fillStyle = sil || '#6b4a2a'; ctx.beginPath(); ctx.moveTo(-170, 0); ctx.lineTo(-160, -110); ctx.quadraticCurveTo(0, -260, 160, -110); ctx.lineTo(170, 0); ctx.closePath(); ctx.fill();
  if (!sil) { ctx.strokeStyle = 'rgba(30,18,8,.45)'; ctx.lineWidth = 4; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 45, 0); ctx.lineTo(i * 18, -200); ctx.stroke(); }
    ctx.fillStyle = '#8a2a20'; ctx.fillRect(-165, -118, 330, 14); }
  ctx.fillStyle = o.door || 'rgba(255,170,80,.9)'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-30, -90); ctx.quadraticCurveTo(0, -112, 30, -90); ctx.lineTo(34, 0); ctx.fill();
  if (o.door !== null) glow(0, -45, 140, 'rgba(255,150,60,.35)');
  ctx.restore();
}
// tuğ: gönder, yaldızlı tepelik, at kılı püskülleri. o.fall: 0..1 devrilme
function tug(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate((o.fall ? eIn(clamp(o.fall)) : 0) * 1.45 * (o.dir || 1)); const sil = o.sil;
  ctx.strokeStyle = sil || '#3a2412'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -520); ctx.stroke();
  ctx.fillStyle = sil || lg(-20, -600, 20, -520, [[0, '#fff0b0'], [.5, '#d9a43a'], [1, '#7a5216']]);
  ctx.beginPath(); ctx.moveTo(0, -640); ctx.quadraticCurveTo(22, -590, 0, -560); ctx.quadraticCurveTo(-22, -590, 0, -640); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -548, 18, 0, TAU); ctx.fill();
  for (let i = 0; i < 26; i++) {
    const a = (i / 25 - .5) * 1.1, sw = Math.sin(t * 2.2 + i * .4) * 10;
    ctx.strokeStyle = sil || (i % 3 ? '#1b1410' : '#3a2a1e'); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -530);
    ctx.bezierCurveTo(Math.sin(a) * 60, -480, Math.sin(a) * 75 + sw, -420, Math.sin(a) * 60 + sw * 1.6, -330 - Math.abs(a) * 40); ctx.stroke();
  }
  ctx.restore();
}
// atlı: yandan, sağa bakar; gait 0..1 dörtnala döngüsü
function rider(x, y, s, t, o = {}) {
  const g = fract(t * (o.speed || 2.2) + (o.ph || 0)), A = Math.sin(g * TAU), B = Math.cos(g * TAU);
  ctx.save(); ctx.translate(x, y + Math.abs(A) * -6 * s); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.fillStyle = o.sil || '#1a120a'; ctx.strokeStyle = o.sil || '#1a120a'; ctx.lineCap = 'round';
  // bacaklar
  ctx.lineWidth = 9; for (const [hx, ph] of [[-62, 0], [-48, .5], [52, .25], [66, .75]]) { const a = Math.sin((g + ph) * TAU) * .6; ctx.beginPath(); ctx.moveTo(hx, -70); const kx = hx + Math.sin(a) * 30, ky = -35; ctx.lineTo(kx, ky); ctx.lineTo(kx + Math.sin(a + .6) * 26, 0); ctx.stroke(); }
  // gövde, boyun, baş, kuyruk
  ctx.beginPath(); ctx.ellipse(0, -88, 82, 30, -.03, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(56, -104); ctx.quadraticCurveTo(88, -150 + B * 3, 104, -168); ctx.lineTo(132, -150); ctx.lineTo(126, -138); ctx.quadraticCurveTo(100, -140, 84, -96); ctx.fill();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-80, -100); ctx.quadraticCurveTo(-118, -96 + A * 6, -128, -60 + A * 8); ctx.stroke();
  // binici
  ctx.beginPath(); ctx.moveTo(-14, -112); ctx.lineTo(-2, -186); ctx.lineTo(24, -186); ctx.lineTo(22, -112); ctx.fill();
  ctx.beginPath(); ctx.arc(12, -204, 16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-6, -214); ctx.quadraticCurveTo(12, -246, 30, -214); ctx.fill();
  if (o.spear !== false) { ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-40, -120); ctx.lineTo(120, -250); ctx.stroke(); }
  if (o.flag) { ctx.fillStyle = o.flag; ctx.beginPath(); ctx.moveTo(110, -242); ctx.lineTo(60 + A * 3, -236); ctx.lineTo(96, -222); ctx.fill(); }
  ctx.restore();
}
// Bizanslı tarihçi: masada yazan siluet, mum ışığı. o.write: kalem hareketi
function scribe(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const fl = .85 + .1 * Math.sin(t * 13) + .05 * Math.sin(t * 29);
  glow(260, -330, 520 * fl, 'rgba(255,170,70,.35)'); glow(260, -330, 180 * fl, 'rgba(255,210,140,.45)');
  ctx.fillStyle = '#120b06';
  ctx.fillRect(-120, -250, 520, 26); ctx.fillRect(-90, -224, 22, 224); ctx.fillRect(330, -224, 22, 224);                 // masa
  ctx.save(); ctx.translate(120, -262); ctx.rotate(-.06); ctx.fillStyle = '#d9c39a'; ctx.fillRect(-90, -8, 180, 14); ctx.fillStyle = '#b8a07a'; ctx.fillRect(-90, -2, 180, 4); ctx.restore(); // açık kitap
  ctx.fillStyle = '#e8dcc0'; ctx.fillRect(250, -300, 18, 50); ctx.fillStyle = '#120b06'; ctx.fillRect(238, -252, 42, 6);    // mum
  ctx.fillStyle = `rgba(255,200,110,${fl})`; ctx.beginPath(); ctx.ellipse(259, -314, 7, 17 * fl, Math.sin(t * 7) * .1, 0, TAU); ctx.fill();
  ctx.fillStyle = '#120b06';
  // keşiş: başlık, sakal, sırt
  ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(-250, -300); ctx.quadraticCurveTo(-240, -420, -160, -440); ctx.quadraticCurveTo(-90, -450, -70, -380); ctx.lineTo(-40, -330); ctx.quadraticCurveTo(-60, -300, -90, -290); ctx.lineTo(-110, -200); ctx.lineTo(-100, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-70, -360); ctx.quadraticCurveTo(-40, -300, -84, -270); ctx.lineTo(-96, -330); ctx.fill();
  const w = o.write ? Math.sin(t * 9) * 8 : 0, w2 = o.write ? Math.cos(t * 6) * 4 : 0;
  ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.strokeStyle = '#120b06'; ctx.beginPath(); ctx.moveTo(-150, -330); ctx.quadraticCurveTo(-40, -250, 70 + w, -278 + w2); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = '#e8dcc0'; ctx.beginPath(); ctx.moveTo(78 + w, -272 + w2); ctx.quadraticCurveTo(100 + w, -330, 140 + w, -360 + w2); ctx.stroke();
  ctx.restore();
}
// boş arşiv rafları; spot ışığı ve toz
function emptyArchive(t, o = {}) {
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#1d140c'], [1, '#0b0805']]); ctx.fillRect(0, 0, W, H);
  const R = rng(5); ctx.save(); ctx.translate(W / 2, H * .46); const z = o.zoom || 1; ctx.scale(z, z); ctx.translate(-W / 2, -H * .46);
  for (let row = 0; row < 7; row++) for (let col = 0; col < 4; col++) {
    const x = 90 + col * 230, y = 260 + row * 190, empty = !(o.fill && R() > .7);
    ctx.fillStyle = '#3a2716'; ctx.fillRect(x, y, 210, 170); ctx.fillStyle = '#1c120a'; ctx.fillRect(x + 12, y + 12, 186, 146);
    ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(x + 12, y + 12, 186, 8);
    if (!empty) { ctx.fillStyle = '#7a5a36'; for (let i = 0; i < 4; i++) ctx.fillRect(x + 30 + i * 40, y + 40, 26, 118); }
    ctx.fillStyle = '#4a3220'; ctx.fillRect(x + 80, y + 150, 50, 10);
  }
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg(W / 2, 0, W / 2, H, [[0, 'rgba(255,220,160,.18)'], [1, 'rgba(255,220,160,0)']]);
  ctx.beginPath(); ctx.moveTo(W / 2 - 60, 0); ctx.lineTo(W / 2 + 60, 0); ctx.lineTo(W / 2 + 330, H); ctx.lineTo(W / 2 - 330, H); ctx.fill();
  for (let i = 0; i < 70; i++) { const x = W / 2 + (R() - .5) * 500, y = (R() * H + t * (8 + R() * 14)) % H, a = .15 + .25 * Math.sin(t * 2 + i); ctx.fillStyle = `rgba(255,235,200,${a})`; ctx.beginPath(); ctx.arc(x + Math.sin(t + i) * 10, y, 1.5 + R() * 2, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// zaman çizgisi: {from, to, y, marks:[[yıl, etiket, alt]], gap:[a,b,etiket], k (çizim ilerlemesi)}
function timeline(t, o) {
  const x0 = 110, x1 = W - 160, X = yr => lerp(x0, x1, (yr - o.from) / (o.to - o.from)), y = o.y || 960, k = o.k ?? 1;
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(242,199,92,.85)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, eIO(k)), y); ctx.stroke();
  const st = o.step || 50; for (let yr = Math.ceil(o.from / st) * st; yr <= o.to; yr += st) { if (X(yr) > lerp(x0, x1, k)) break; ctx.fillStyle = 'rgba(242,199,92,.9)'; ctx.fillRect(X(yr) - 2, y - 16, 4, 32); setFont(26, F.mont, 800); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.textAlign = 'center'; ctx.fillText(yr, X(yr), y + 50); }
  if (o.gap) { const [a, b, lab] = o.gap, gk = o.gapK ?? 1; if (gk > 0) {
    const xa = X(a), xb = lerp(xa, X(b), eIO(gk)); ctx.fillStyle = 'rgba(192,57,43,.35)'; ctx.fillRect(xa, y - 60, xb - xa, 120); ctx.strokeStyle = 'rgba(232,90,70,.9)'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.strokeRect(xa, y - 60, xb - xa, 120); ctx.setLineDash([]);
    if (gk > .6) { ctx.globalAlpha = clamp((gk - .6) / .4); title(lab, (xa + X(b)) / 2, y - 120, 64, { fam: F.anton, col: '#ff8a70' }); ctx.globalAlpha = 1; } } }
  (o.marks || []).forEach(([yr, lab, sub, at], i) => {
    const mk = eBack(seg(t, at ?? -1, (at ?? -1) + .4)); if (mk <= 0) return; const x = X(yr), up = i % 2 === 0;
    ctx.save(); ctx.globalAlpha = clamp(mk); ctx.translate(x, y); ctx.scale(mk, mk);
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = 'rgba(242,199,92,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, up ? -18 : 18); ctx.lineTo(0, up ? -150 : 150); ctx.stroke();
    setFont(34, F.cinzel, 900); ctx.textAlign = 'center'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.strokeText(lab, 0, up ? -190 : 190); ctx.fillStyle = '#fff'; ctx.fillText(lab, 0, up ? -190 : 190);
    if (sub) { setFont(24, F.mont, 800); ctx.strokeText(sub, 0, up ? -158 : 222); ctx.fillStyle = GOLD; ctx.fillText(sub, 0, up ? -158 : 222); }
    ctx.restore();
  });
  ctx.restore();
}

/* ---------- efektler ---------- */
// çatlak: (cx,cy)'den yayılan kırık çizgiler; k 0..1
function cracks(cx, cy, k, seed = 9, o = {}) {
  if (k <= 0) return; const R = rng(seed);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (let i = 0; i < (o.n || 9); i++) {
    let a = R() * TAU, x = cx, y = cy; const len = (o.len || 900) * (.5 + R() * .5) * eOut(k), pts = [[x, y]];
    for (let d = 0; d < len; d += 40) { a += (R() - .5) * .7; x += Math.cos(a) * 40; y += Math.sin(a) * 40; pts.push([x, y]); }
    ctx.strokeStyle = 'rgba(255,200,120,.35)'; ctx.lineWidth = 10; tracePath(pts); ctx.stroke();
    ctx.strokeStyle = '#140c06'; ctx.lineWidth = 4; tracePath(pts); ctx.stroke();
  }
  ctx.restore();
}
// geri sarma: yatay bant kaymaları, tarama çizgileri; k 0..1 şiddet
function rewindFX(t, k) {
  if (k <= 0) return; const R = rng(Math.floor(t * 30) + 1);
  ctx.save(); ctx.globalAlpha = .5 * k;
  for (let i = 0; i < 7; i++) { const y = R() * H, h = 10 + R() * 60; ctx.drawImage(ctx.canvas, 0, y, W, h, (R() - .5) * 120 * k, y, W, h); }
  ctx.globalAlpha = .12 * k; ctx.fillStyle = '#000'; for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
  ctx.globalAlpha = .35 * k; ctx.fillStyle = '#fff'; const by = (t * 900) % (H + 200) - 100; ctx.fillRect(0, by, W, 30 * k);
  ctx.restore();
  ctx.save(); ctx.globalAlpha = .8 * k; title('◀◀', W - 150, 330, 70, { col: '#fff' }); ctx.restore();
}
function smokeLayer(t, a = 1, col = '#2a2018', seed = 5) {
  if (a <= 0) return; const R = rng(seed); ctx.save();
  for (let i = 0; i < 22; i++) { const life = 6, ph = (t * .3 + R() * life) % life / life, x = R() * W + Math.sin(t * .2 + i) * 60, y = H * (.95 - ph * .9), r = 200 + R() * 160;
    ctx.globalAlpha = a * .16 * Math.sin(ph * Math.PI); ctx.fillStyle = rg(x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  ctx.restore();
}
function embers(t, a = 1, seed = 3) {
  if (a <= 0) return; const R = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) { const sp = 40 + R() * 80, x = (R() * W + Math.sin(t * .8 + i) * 40), y = H - ((t * sp + R() * H) % H);
    ctx.globalAlpha = a * (.3 + .5 * R()) * (.6 + .4 * Math.sin(t * 6 + i)); ctx.fillStyle = '#ffb060'; ctx.beginPath(); ctx.arc(x, y, 1.5 + R() * 2.5, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// şafak/gün batımı göğü ve tepe siluetleri
function skyLand(t, o = {}) {
  const k = o.k ?? 0; // 0 gece → 1 şafak
  ctx.fillStyle = lg(0, 0, 0, H, [[0, mix('#0b1022', '#2a3e66', k)], [.45, mix('#141a30', '#d98a4a', k)], [.62, mix('#1a1820', '#f6c27a', k)], [1, '#0b0805']]); ctx.fillRect(0, 0, W, H);
  if (o.sun !== false) { const sy = lerp(1250, 1030, k); glow(W * .62, sy, 520, `rgba(255,190,110,${.5 * k})`); ctx.fillStyle = `rgba(255,226,170,${.9 * k})`; ctx.beginPath(); ctx.arc(W * .62, sy, 70, 0, TAU); ctx.fill(); }
  const hills = (base, amp, col, seed) => { const R = rng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, base - amp * (.5 + .5 * Math.sin(x * .004 + seed) * Math.cos(x * .0021 + seed * 2)) - R() * 8); ctx.lineTo(W, H); ctx.fill(); };
  hills(1150, 140, mix('#141018', '#4a3a40', k * .6), 3); hills(1260, 110, mix('#0e0b10', '#2a2026', k * .4), 7); hills(1380, 70, '#0b0805', 11);
  if (o.mist !== false) { ctx.save(); ctx.globalAlpha = .25 + .15 * k; ctx.fillStyle = lg(0, 1150, 0, 1420, [[0, 'rgba(240,220,200,0)'], [.5, 'rgba(240,220,200,.5)'], [1, 'rgba(240,220,200,0)']]); ctx.fillRect(0, 1150, W, 270); ctx.restore(); }
}

/* ---------- gece göğü, figürler, mekân (Bölüm 2 denemesinden genelleştirildi) ---------- */
const STARS = (() => { const R = rng(1324); return Array.from({ length: 150 }, () => [R() * W, R() * H * .6, .6 + R() * 1.8, R() * TAU]); })();
function stars(t, a = 1) { ctx.save(); ctx.fillStyle = '#fff0d2'; for (const [x, y, r, ph] of STARS) { ctx.globalAlpha = a * (.3 + .3 * Math.sin(t * 1.3 + ph)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.restore(); }
const DUST = (() => { const R = rng(1299); return Array.from({ length: 60 }, () => [R() * W, R() * H, 1 + R() * 2.5, 10 + R() * 30, R() * TAU]); })();
// süzülen altın toz (rüya, rivayet)
function goldDust(t, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#ffd98a'; for (const [x, y, r, sp, ph] of DUST) { ctx.globalAlpha = a * (.25 + .25 * Math.sin(t * 2 + ph)); ctx.beginPath(); ctx.arc(x + Math.sin(t * .5 + ph) * 30, fract((y - t * sp) / H) * H, r, 0, TAU); ctx.fill(); } ctx.restore(); }
// gökteki ay (sembol değil, gece göğü)
function crescentMoon(x, y, r) { glow(x, y, r * 3.2, 'rgba(255,236,190,.3)'); ctx.save(); ctx.fillStyle = '#f6e7bf'; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2); ctx.ellipse(x, y, r * .45, r, 0, Math.PI / 2, -Math.PI / 2, true); ctx.fill(); ctx.restore(); }
function fullMoon(x, y, r, a = 1) { glow(x, y, r * 4, 'rgba(255,230,170,.55)', a); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rg(x - r * .3, y - r * .3, r * .1, r, [[0, '#fffbe8'], [.7, '#f6e2a8'], [1, '#e2c27a']]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }
// oturan siluet (yüzü sağa; o.flip sola). o.hat: 'kece' (derviş külahı) | 'sarik'; o.beard; o.rim: arka ışık rengi. Döner: göğüs noktası
function seated(x, y, s, o = {}) {
  const f = o.flip ? -1 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s); ctx.fillStyle = o.col || '#0b0710';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 26; }
  ctx.beginPath(); ctx.ellipse(10, -30, 128, 34, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-92, -34); ctx.quadraticCurveTo(-96, -150, -50, -212); ctx.lineTo(46, -212); ctx.quadraticCurveTo(92, -160, 104, -34); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, -170); ctx.quadraticCurveTo(110, -120, 120, -60); ctx.lineTo(96, -52); ctx.quadraticCurveTo(80, -110, 30, -140); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(8, -246, 34, 0, TAU); ctx.fill();
  if (o.hat === 'kece') { ctx.beginPath(); ctx.moveTo(-26, -262); ctx.quadraticCurveTo(-30, -338, 6, -352); ctx.quadraticCurveTo(34, -338, 30, -262); ctx.closePath(); ctx.fill(); }
  else { ctx.beginPath(); ctx.ellipse(8, -272, 46, 24, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(8, -290, 24, 16, 0, 0, TAU); ctx.fill(); }
  if (o.beard) { ctx.beginPath(); ctx.moveTo(22, -234); ctx.quadraticCurveTo(52, -200, 20, -184); ctx.lineTo(0, -214); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  return [x + 36 * s * f, y - 168 * s];
}
// uzanmış, uyuyan siluet (baş solda). Döner: {chest, navel}
function sleeper(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = o.col || '#0b0710';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 26; }
  ctx.beginPath(); ctx.roundRect(-260, -18, 520, 26, 10); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-205, -34, 48, 20, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(-196, -66, 30, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-232, -70, 24, 32, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-172, -22); ctx.quadraticCurveTo(-150, -92, -60, -84); ctx.quadraticCurveTo(20, -80, 60, -76); ctx.quadraticCurveTo(120, -124, 172, -82); ctx.quadraticCurveTo(222, -52, 244, -20); ctx.closePath(); ctx.fill();
  ctx.restore();
  return { chest: [x - 110 * s, y - 88 * s], navel: [x + 10 * s, y - 80 * s] };
}
// mum (a: alevin yoğunluğu)
function candle(x, y, s, t, a = 1, seed = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#e8dcc0'; ctx.fillRect(-9, -70, 18, 70); ctx.fillStyle = '#120b06'; ctx.fillRect(-22, -4, 44, 8);
  if (a > 0) { const fl = .85 + .1 * Math.sin(t * 13 + seed) + .05 * Math.sin(t * 29 + seed * 2);
    glow(0, -88, 300 * fl * a, 'rgba(255,170,70,.35)'); glow(0, -88, 90 * fl * a, 'rgba(255,215,140,.55)');
    ctx.globalAlpha = a; ctx.fillStyle = `rgba(255,205,115,${fl})`; ctx.beginPath(); ctx.ellipse(0, -86, 7, 17 * fl, Math.sin(t * 7 + seed) * .1, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// tepe üstünde kale siluet, ışıklı pencereler
function castle(x, y, s, col = '#06050a') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-320, 60); ctx.quadraticCurveTo(-120, -30, 0, -10); ctx.quadraticCurveTo(160, -30, 340, 60); ctx.lineTo(340, 200); ctx.lineTo(-320, 200); ctx.fill();
  ctx.fillRect(-170, -90, 340, 90);
  for (const [tx, th] of [[-180, 150], [-60, 125], [70, 170], [180, 135]]) { ctx.fillRect(tx - 26, -th, 52, th); for (let i = 0; i < 3; i++) ctx.fillRect(tx - 26 + i * 20, -th - 12, 12, 12); }
  for (let i = 0; i < 12; i++) ctx.fillRect(-170 + i * 30, -102, 16, 12);
  ctx.fillStyle = 'rgba(255,190,110,.85)'; for (const [wx, wy] of [[-60, -80], [70, -120], [-180, -100], [10, -50]]) ctx.fillRect(wx - 4, wy, 8, 14);
  ctx.restore();
}
