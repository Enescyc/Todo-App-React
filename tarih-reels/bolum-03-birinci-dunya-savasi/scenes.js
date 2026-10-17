/* Bölüm 3 sahneleri – Birinci Dünya Savaşı'nın başlangıcı. Çapalar: timeline.js, araçlar: shared/engine.js */
'use strict';
const C = cue;
const CITY = GEO.cities;
// domino konumları (dünya km) ve renkleri
const DOM = {
  DE: { p: [-560, -480], bloc: 'central', label: 'ALMANYA' },
  AH: { p: [-170, -10], bloc: 'central', label: 'AVUSTURYA' },
  RS: { p: [95, 330], bloc: 'entente', label: 'SIRBİSTAN' },
  RU: { p: [620, -640], bloc: 'entente', label: 'RUSYA' },
  FR: { p: [-1130, -180], bloc: 'entente', label: 'FRANSA' },
  GB: { p: [-1330, -780], bloc: 'entente', label: 'İNGİLTERE' },
  OT: { p: [900, 760], bloc: 'central', label: 'OSMANLI' },
};
const BRIGHT = { central: '#b8322a', entente: '#3a72b0' };
const tint = (bloc, a) => rgba(BLOC[bloc], a);
const WIDE = [-250, -120, .36];
// alev noktaları: her devletin içinde rastgele noktalar
const FIRE = (() => {
  const c = mkCanvas(2, 2).getContext('2d'), r = rng(19), out = {};
  for (const k of ['DE', 'AH', 'RU', 'FR', 'GB', 'RS', 'BE', 'OT']) {
    out[k] = []; let tries = 0;
    const box = { DE: [-1000, -900, 200, 0], AH: [-600, -300, 500, 400], RU: [0, -1600, 1500, 400], FR: [-1700, -700, -800, 400], GB: [-1700, -1300, -1100, -500], RS: [-50, 200, 300, 600], BE: [-1200, -620, -950, -420], OT: [500, 500, 2200, 1600] }[k];
    while (out[k].length < (k === 'RU' ? 14 : k === 'BE' || k === 'RS' ? 3 : 8) && tries++ < 4000) { const x = lerp(box[0], box[2], r()), y = lerp(box[1], box[3], r()); if (c.isPointInPath(PATHS.st[k], x, y)) out[k].push([x, y, r() * TAU, .6 + r() * .6]); }
  }
  return out;
})();
function fireOverlay(t, cam, states, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const k of states) for (const [x, y, ph, s] of FIRE[k] || []) {
    const [sx, sy] = W2S(cam, x, y), fl = .7 + .3 * Math.sin(t * 7 + ph) + .15 * Math.sin(t * 13 + ph * 2), r = 80 * s * cam[2] / .36 * fl;
    ctx.globalAlpha = a * .42; ctx.fillStyle = rg(sx, sy, 0, r, [[0, 'rgba(255,190,90,.9)'], [.4, 'rgba(255,90,20,.5)'], [1, 'rgba(120,20,0,0)']]); ctx.fillRect(sx - r, sy - r, 2 * r, 2 * r);
  }
  ctx.restore();
  // duman
  ctx.save(); const r = rng(5);
  for (let i = 0; i < 26; i++) { const life = 5, ph = (t * .4 + r() * life) % life / life, x = r() * W + Math.sin(t * .3 + i) * 40, y = H * (.75 - ph * .9);
    ctx.globalAlpha = a * .1 * Math.sin(ph * Math.PI); ctx.fillStyle = rg(x, y, 0, 220, [[0, '#2a1a12'], [1, 'rgba(42,26,18,0)']]); ctx.fillRect(x - 220, y - 220, 440, 440); }
  ctx.restore();
}
function standingDominoes(t, cam, codes, o = {}) {
  for (const k of codes) {
    const d = DOM[k], [x, y] = W2S(cam, ...d.p), app = o.appear ? eBack(seg(t, o.appear[k] ?? -1, (o.appear[k] ?? -1) + .4)) : 1;
    if (app <= 0) continue;
    const fall = o.fall && o.fall[k] !== undefined ? seg(t, o.fall[k], o.fall[k] + .45) : 0, wob = o.wobble === k ? Math.sin(t * 9) * .06 : 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(app, app); ctx.rotate(wob);
    domino(0, 0, (o.size || .62) * Math.min(1.6, cam[2] / .36), k, fall, o.dir && o.dir[k] || 1, { label: '' });
    ctx.restore();
  }
}
function chainLink(cam, a, b, k, col) {
  if (k <= 0) return;
  const [x0, y0] = W2S(cam, ...DOM[a].p), [x1, y1] = W2S(cam, ...DOM[b].p), ex = lerp(x0, x1, k), ey = lerp(y0, y1, k);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.setLineDash([16, 10]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0 - 40); ctx.lineTo(ex, ey - 40); ctx.stroke(); ctx.restore();
}
function dateTag(cam, k, s, t, t0) {
  const [x, y] = W2S(cam, ...DOM[k].p); const a = eBack(seg(t, t0, t0 + .3)); if (a <= 0) return;
  ctx.save(); ctx.translate(x, y + 40); ctx.scale(a, a); ctx.fillStyle = '#1a0f08'; ctx.beginPath(); ctx.roundRect(-70, -22, 140, 44, 10); ctx.fill();
  setFont(26, F.mont, 900); ctx.fillStyle = '#ffcf4a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 1); ctx.restore();
}

/* ---------- çizim yardımcıları: araba, bina, savaş gemisi ---------- */
function motorcar(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const body = o.sil || '#1d2a2a', trim = o.sil || '#b89b5e';
  // tekerlekler
  for (const wx of [-150, 150]) { ctx.fillStyle = o.sil || '#111'; ctx.beginPath(); ctx.arc(wx, -48, 48, 0, TAU); ctx.fill(); if (!o.sil) { ctx.strokeStyle = '#8a7a5a'; ctx.lineWidth = 3; for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + (o.spin || 0); ctx.beginPath(); ctx.moveTo(wx, -48); ctx.lineTo(wx + Math.cos(a) * 38, -48 + Math.sin(a) * 38); ctx.stroke(); } ctx.fillStyle = '#c9b27a'; ctx.beginPath(); ctx.arc(wx, -48, 9, 0, TAU); ctx.fill(); } }
  // gövde
  ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-230, -70); ctx.lineTo(-230, -150); ctx.quadraticCurveTo(-225, -175, -190, -175); ctx.lineTo(60, -175); ctx.lineTo(80, -140); ctx.lineTo(250, -135); ctx.quadraticCurveTo(270, -130, 268, -100); ctx.lineTo(262, -70); ctx.closePath(); ctx.fill();
  ctx.fillStyle = trim; ctx.fillRect(-230, -112, 495, 6);
  // çamurluk ve basamak
  ctx.strokeStyle = body; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(-150, -48, 60, Math.PI * 1.05, Math.PI * 1.95); ctx.moveTo(90, -60); ctx.arc(150, -48, 60, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-95, -38); ctx.lineTo(95, -38); ctx.stroke();
  // ön cam ve far
  ctx.strokeStyle = o.sil || '#8a8a80'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(70, -175); ctx.lineTo(55, -240); ctx.stroke();
  ctx.fillStyle = o.sil || '#d9c48a'; ctx.beginPath(); ctx.arc(262, -120, 13, 0, TAU); ctx.fill();
  // yolcular: şoför, veliaht (tüylü miğfer), Sophie (geniş şapka)
  const P = o.sil || '#14100c';
  ctx.fillStyle = P; ctx.beginPath(); ctx.arc(20, -210, 17, 0, TAU); ctx.fill(); ctx.fillRect(4, -232, 32, 8);
  ctx.beginPath(); ctx.arc(-120, -222, 20, 0, TAU); ctx.fill(); ctx.fillRect(-145, -205, 50, 40);
  ctx.fillStyle = o.sil || '#2d4a2a'; ctx.beginPath(); ctx.ellipse(-120, -244, 26, 11, 0, 0, TAU); ctx.fill();
  if (!o.noPlume) { ctx.fillStyle = o.sil || '#3f8a3a'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(-122 - i * 3, -258 - i * 4 + Math.sin(t * 6 + i) * 2, 9, 22, -.5 - i * .12, 0, TAU); ctx.fill(); } }
  ctx.fillStyle = P; ctx.beginPath(); ctx.arc(-178, -214, 17, 0, TAU); ctx.fill(); ctx.fillRect(-200, -198, 44, 32);
  ctx.fillStyle = o.sil || '#efe7d6'; ctx.beginPath(); ctx.ellipse(-178, -232, 36, 10, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-178, -236, 15, Math.PI, 0); ctx.fill();
  ctx.restore();
}
function facades(x0, base, seed, cols, o = {}) {
  const r = rng(seed); let x = x0;
  while (x < x0 + (o.width || W + 400)) {
    const w = 150 + r() * 120, h = 360 + r() * 260, c = cols[Math.floor(r() * cols.length)];
    ctx.fillStyle = c; ctx.fillRect(x, base - h, w + 2, h);
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(x, base - h, w, 16); ctx.fillRect(x, base - h * .52, w, 8);
    const fl = Math.floor(h / 120);
    for (let f = 0; f < fl; f++) for (let i = 0; i < Math.floor(w / 55); i++) { const wx = x + 18 + i * 55, wy = base - h + 40 + f * 110; ctx.fillStyle = 'rgba(40,28,18,.65)'; ctx.fillRect(wx, wy, 26, 52); ctx.fillStyle = 'rgba(255,240,210,.25)'; ctx.fillRect(wx, wy - 6, 30, 5); }
    ctx.fillStyle = 'rgba(20,12,6,.5)'; ctx.fillRect(x + w / 2 - 22, base - 90, 44, 90);
    x += w + 4;
  }
}
// 1914 zırhlısı (yandan, sağa bakar)
function warship(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const hull = o.sil || '#4a5058', dark = o.sil || '#2a2e34', funnels = o.funnels || 2;
  // duman
  if (o.smoke !== false) for (let f = 0; f < funnels; f++) { const fx = 40 - f * 90; for (let i = 0; i < 9; i++) { const k = ((t * .5 + i / 9) % 1); ctx.globalAlpha = (o.smokeA ?? .5) * (1 - k); ctx.fillStyle = o.smokeCol || '#3a3632'; ctx.beginPath(); ctx.arc(fx - k * 340, -250 - k * 120 + Math.sin(i + t) * 10, 22 + k * 60, 0, TAU); ctx.fill(); } }
  ctx.globalAlpha = 1;
  // gövde
  ctx.fillStyle = hull; ctx.beginPath(); ctx.moveTo(-430, -40); ctx.quadraticCurveTo(-445, 10, -400, 30); ctx.lineTo(400, 30); ctx.lineTo(450, -60); ctx.lineTo(-430, -60); ctx.closePath(); ctx.fill();
  if (!o.sil) { ctx.fillStyle = '#7a2a22'; ctx.fillRect(-410, 14, 830, 16); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(-430, -60, 880, 8); }
  // üst yapı
  ctx.fillStyle = dark; ctx.fillRect(-180, -110, 300, 52); ctx.fillRect(-120, -150, 150, 42); ctx.fillRect(90, -170, 50, 112);
  // bacalar
  for (let f = 0; f < funnels; f++) { const fx = 40 - f * 90; ctx.fillStyle = dark; ctx.fillRect(fx - 22, -230, 44, 125); if (!o.sil) { ctx.fillStyle = '#1a1a1a'; ctx.fillRect(fx - 22, -232, 44, 14); } }
  // direkler
  ctx.strokeStyle = dark; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(150, -170); ctx.lineTo(150, -330); ctx.moveTo(-230, -110); ctx.lineTo(-230, -290); ctx.stroke();
  // taretler
  for (const [tx, dir] of [[300, 1], [210, 1], [-280, -1], [-360, -1]]) { ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(tx - 34, -92, 68, 34, 8); ctx.fill(); ctx.fillRect(tx + (dir > 0 ? 30 : -110), -82, 80, 9); }
  // sancak
  if (o.flag) { const fx = -420, fy = -150, w = Math.sin(t * 6) * 6; ctx.strokeStyle = dark; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx, -60); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.save(); ctx.translate(fx - 100, fy); ctx.beginPath(); ctx.moveTo(100, 0); ctx.quadraticCurveTo(50, w - 6, 0, w); ctx.lineTo(0, 64 + w); ctx.quadraticCurveTo(50, 58 + w, 100, 64); ctx.closePath(); ctx.clip();
    if (o.flag === 'DEWAR') { ctx.fillStyle = '#f4f4f0'; ctx.fillRect(0, -10, 100, 90); ctx.fillStyle = '#111'; ctx.fillRect(38, -10, 12, 90); ctx.fillRect(0, 26, 100, 12); ctx.fillStyle = '#111'; ctx.fillRect(0, -10, 34, 32); ctx.fillStyle = '#f4f4f0'; ctx.fillRect(0, 2, 34, 6); ctx.fillStyle = '#c8102e'; ctx.fillRect(0, 12, 34, 10); }
    else FLAGS[o.flag](100, 70);
    ctx.restore(); }
  if (o.flash) { glow(470, -78, 160 * o.flash, 'rgba(255,220,140,.95)'); glow(470, -78, 60 * o.flash, 'rgba(255,255,230,1)'); }
  ctx.restore();
}
function seaBand(t, y, h, top, bot, refl) {
  ctx.fillStyle = lg(0, y, 0, y + h, [[0, top], [1, bot]]); ctx.fillRect(0, y, W, h);
  ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) { const yy = y + 12 + i * i * 3.2, ox = (t * 25 * (1 + i % 3 * .3) + i * 97) % 200; for (let x = -200 + ox; x < W; x += 200) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.quadraticCurveTo(x + 30, yy - 5, x + 60, yy); ctx.stroke(); } }
  if (refl) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const yy = y + 6 + i * i * 1.8, w = 60 + i * 16; ctx.fillStyle = refl.replace('A', .28 * (1 - i / 16)); ctx.fillRect(W * .5 - w / 2 + Math.sin(t * 2 + i) * 10, yy, w, 3); } ctx.restore(); }
}
function sarajevoMap(t, o) {
  // tepeden şehir planı: Miljacka nehri, Appel rıhtımı, Latin Köprüsü, Franz Joseph Sokağı
  ctx.fillStyle = '#e4d3ab'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(o.z, o.z); ctx.rotate(o.rot || 0); ctx.translate(-o.cx, -o.cy);
  const r = rng(4); ctx.fillStyle = '#c9b48a';
  for (let bx = -1400; bx < 2400; bx += 130) for (let by = -1400; by < 900; by += 130) { if (Math.abs(bx - 560) < 90) continue; ctx.fillRect(bx + 14 + r() * 10, by + 14, 96 - r() * 20, 96 - r() * 20); }
  for (let bx = -1400; bx < 2400; bx += 130) for (let by = 1260; by < 2600; by += 130) ctx.fillRect(bx + 14, by + 14, 96 - r() * 20, 96 - r() * 20);
  ctx.fillStyle = '#6f8f98'; ctx.fillRect(-1600, 1080, 4400, 150);
  ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 3; for (let x = -1600; x < 2800; x += 80) { ctx.beginPath(); ctx.moveTo(x + (t * 30) % 80, 1130); ctx.lineTo(x + 30 + (t * 30) % 80, 1130); ctx.stroke(); }
  ctx.fillStyle = '#f2e6c8'; ctx.fillRect(-1600, 960, 4400, 110); ctx.fillRect(500, -1600, 110, 2620);
  ctx.fillStyle = '#b8a27a'; ctx.fillRect(520, 1070, 70, 170);
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 3; ctx.strokeRect(520, 1070, 70, 170);
  ctx.restore();
}

/* ================= SAHNELER ================= */
const S = window.SCENE_FNS = {};

// 1 · Gelecekten bakış: alevler içinde Avrupa
S.future = (t, s) => {
  const k = seg(t, s.t0, s.t1), cam = [lerp(-200, -120, k), lerp(-150, -90, k), lerp(.34, .4, k)];
  drawMap(t, cam, { sea: '#4a4e52', land: '#8a7458', fill: c => DOM[c] ? mix(BRIGHT[DOM[c].bloc], '#2a1208', .2) : c === 'BE' ? '#8a4a3a' : null });
  fireOverlay(t, cam, ['DE', 'AH', 'RU', 'FR', 'GB', 'RS', 'BE', 'OT'], 1);
  ctx.fillStyle = 'rgba(20,6,0,.12)'; ctx.fillRect(0, 0, W, H);
  kinetic('1914 – 1918', W / 2, 340, 120, t, s.t0 + .2, { fam: F.cinzel, w: 900, gold: true, mode: 'letters', spacing: 8 });
  kinetic('BÜYÜK SAVAŞ', W / 2, 470, 86, t, C('p1:felaketlerinden'), { col: '#f4e8cc' });
};
// 2 · Geri sarma → tek bir sokak ayrımı
S.rewind = (t, s) => {
  const k = seg(t, s.t0, s.t1), rw = 1 - seg(t, s.t0, s.t0 + .5);
  sarajevoMap(t, { cx: 600, cy: 1000, z: lerp(.9, 1.2, eIO(k)), rot: -.05 });
  // araba: rıhtım boyunca gelip sağa (kuzeye) sapar
  const path = [[1500, 1015], [900, 1015], [640, 1015], [560, 980], [555, 850]], P = spline(path, 10), L = polyLen(P), u = eIO(seg(t, s.t0 + .3, s.t1 - .3));
  const [x, y, a] = pointAt(P, L, u);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(lerp(.9, 1.2, eIO(k)), lerp(.9, 1.2, eIO(k))); ctx.rotate(-.05); ctx.translate(-600, -1000);
  ctx.strokeStyle = 'rgba(42,111,58,.6)'; ctx.lineWidth = 10; ctx.setLineDash([24, 14]); ctx.beginPath(); ctx.moveTo(1500, 1015); ctx.lineTo(-400, 1015); ctx.stroke();
  ctx.strokeStyle = 'rgba(178,34,34,.9)'; ctx.setLineDash([]); tracePath(P.slice(0, Math.max(2, Math.floor(P.length * u)))); ctx.stroke();
  ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#1d2a2a'; ctx.beginPath(); ctx.roundRect(-40, -20, 80, 40, 8); ctx.fill(); ctx.fillStyle = '#2d4a2a'; ctx.fillRect(-20, -12, 26, 24);
  ctx.restore();
  if (rw > 0) { ctx.fillStyle = `rgba(255,255,255,${rw * .5})`; ctx.fillRect(0, 0, W, H); setFont(160, F.mont, 900); ctx.fillStyle = `rgba(30,20,10,${rw})`; ctx.textAlign = 'center'; ctx.fillText('◀◀', W / 2, H / 2); }
  kinetic('YANLIŞ BİR DÖNÜŞ', W / 2, 360, 104, t, C('p1:yanlış'), { gold: true, rot: -.02 });
};
// 3 · Kıvılcım Saraybosna'dan İstanbul'a
S.spark = (t, s) => {
  const k = seg(t, s.t0, s.t1), cam = [lerp(-100, 300, eIO(k)), lerp(380, 480, eIO(k)), lerp(.75, .55, eIO(k))];
  const otK = seg(t, C("p1:Osmanlı'yı"), C("p1:Osmanlı'yı") + .6);
  drawMap(t, cam, { fill: c => c === 'OT' ? mix(BLOC.paper, BRIGHT.central, otK) : null });
  const a = CITY['Saraybosna'], b = CITY['İstanbul'], u = eIO(seg(t, s.t0 + .2, C("p1:Osmanlı'yı") + .1));
  const P = spline([a, [330, 300], b], 20), L = polyLen(P), sp = P.slice(0, Math.max(2, Math.ceil(P.length * u))).map(p => W2S(cam, ...p));
  ctx.save(); ctx.strokeStyle = 'rgba(255,150,40,.85)'; ctx.lineWidth = 7; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 60; tracePath(sp); ctx.stroke(); ctx.restore();
  const [hx, hy] = W2S(cam, ...pointAt(P, L, u)); glow(hx, hy, 90, 'rgba(255,170,60,.9)'); glow(hx, hy, 30, 'rgba(255,255,220,1)');
  cityDot(cam, 'Saraybosna'); cityDot(cam, 'İstanbul');
  kinetic('4 AY', W / 2, 360, 150, t, C('p1:dört'), { gold: true });
  kinetic('28 HAZİRAN → 29 EKİM 1914', W / 2, 480, 44, t, C('p1:dört') + .3, { fam: F.mont, w: 900 });
};
// 4 · Saraybosna, 28 Haziran 1914: konvoy ve bomba
S.sarajevo = (t, s) => {
  const lt = t - s.t0, bombT = C('p2:bomba'), boomT = bombT + .35;
  // takvim yaprağı
  const cal = 1 - seg(t, C('p2:Saraybosna') + .2, C('p2:Saraybosna') + .7);
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#cdb48a'], [1, '#8a7050']]); ctx.fillRect(0, 0, W, H);
  // sahne: sokak, binalar, nehir korkuluğu
  ctx.save(); const pan = lt * 18; ctx.translate(-pan, 0);
  facades(-200, 1000, 7, ['#d8c39a', '#cbb084', '#e0cfa8', '#bfa478']);
  ctx.restore();
  ctx.fillStyle = '#8a7656'; ctx.fillRect(0, 1000, W, 920); ctx.fillStyle = '#6e5c42'; ctx.fillRect(0, 1000, W, 14); ctx.fillStyle = '#9a8666'; ctx.fillRect(0, 1250, W, 670);
  // kalabalık
  const r = rng(12); for (let i = 0; i < 26; i++) { const x = ((i * 47 - lt * 18) % (W + 100) + W + 100) % (W + 100) - 50, h = 70 + r() * 30; ctx.fillStyle = '#2a2018'; ctx.beginPath(); ctx.arc(x, 1000 - h, 12, 0, TAU); ctx.fill(); ctx.fillRect(x - 12, 1000 - h + 10, 24, h - 10); if (r() > .5) ctx.fillRect(x - 16, 1000 - h - 14, 32, 6); }
  // konvoy
  const cx = lerp(-300, 760, seg(t, s.t0 + .3, s.t1 - .2));
  motorcar(cx - 640, 1220, .85, t, { noPlume: true, spin: t * 6 });
  motorcar(cx, 1240, .95, t, { spin: t * 6 });
  // bomba yayı ve patlama
  if (t > bombT && t < boomT) { const u = seg(t, bombT, boomT), bx = lerp(cx + 100, cx - 520, u), by = 1060 - Math.sin(u * Math.PI) * 220; ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(bx, by, 14, 0, TAU); ctx.fill(); }
  if (t > boomT) { const u = seg(t, boomT, boomT + 2.2), ex = cx - 560; ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ex, 1120, 420 * (1 - u * .6), `rgba(255,200,120,${1 - u})`); ctx.restore();
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, d = 60 + u * 260; ctx.globalAlpha = .55 * (1 - u); ctx.fillStyle = '#3a3028'; ctx.beginPath(); ctx.arc(ex + Math.cos(a) * d * .8, 1120 - Math.abs(Math.sin(a)) * d - u * 120, 70 + u * 90, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
  if (cal > 0) { ctx.save(); ctx.globalAlpha = cal; ctx.translate(W / 2, 900 - (1 - cal) * 200); ctx.rotate(-(1 - cal) * .4);
    ctx.fillStyle = '#f4ecd8'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.fillRect(-300, -380, 600, 700); ctx.shadowBlur = 0;
    ctx.fillStyle = '#9b1c1c'; ctx.fillRect(-300, -380, 600, 150); setFont(64, F.cinzel, 900); ctx.fillStyle = '#f4ecd8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('HAZİRAN', 0, -305);
    setFont(330, F.anton, 400); ctx.fillStyle = '#1a120a'; ctx.fillText('28', 0, 20); setFont(70, F.cinzel, 900); ctx.fillText('1914', 0, 240); ctx.restore(); }
  kinetic('SARAYBOSNA', W / 2, 330, 110, t, C('p2:Saraybosna'), { fam: F.cinzel, w: 900, gold: true, mode: 'letters', spacing: 6, out: C('p2:Avusturya') + .6 });
  kinetic('VELİAHT FRANZ FERDINAND', W / 2, 330, 64, t, C('p2:veliahdı'), { fam: F.mont, w: 900, out: boomT - .3 });
  kinetic('BOMBA ISKALADI', W / 2, 330, 96, t, boomT + .3, { col: '#ffdfd8', strokeCol: '#5a0a0a' });
};
// 5 · Yanlış dönüş ve Princip
S.wrongturn = (t, s) => {
  const zK = eIO(seg(t, C('p2:durduğunda'), C('p2:yaşındaki') + .3)), z = lerp(.75, 1.25, zK), cx = lerp(600, 640, zK), cy = lerp(980, 1000, zK);
  sarajevoMap(t, { cx, cy, z });
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy);
  // planlanan rota (yeşil) ve gerçek rota (kırmızı)
  ctx.strokeStyle = 'rgba(42,111,58,.7)'; ctx.lineWidth = 10; ctx.setLineDash([24, 14]); ctx.beginPath(); ctx.moveTo(1700, 1015); ctx.lineTo(-500, 1015); ctx.stroke(); ctx.setLineDash([]);
  const turnT = C('p2:yanlış#1'), stopT = C('p2:durduğunda'), path = spline([[1700, 1015], [900, 1015], [640, 1015], [570, 990], [555, 900], [555, 820]], 10), L = polyLen(path);
  let u = seg(t, s.t0, stopT) * .97; if (t > stopT) u = .97 - eOut(seg(t, stopT + .2, stopT + 1.2)) * .1;
  const [x, y, a] = pointAt(path, L, u);
  ctx.strokeStyle = 'rgba(178,34,34,.9)'; ctx.lineWidth = 10; tracePath(path.slice(0, Math.max(2, Math.floor(path.length * u)))); ctx.stroke();
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#1d2a2a'; ctx.beginPath(); ctx.roundRect(-46, -22, 92, 44, 8); ctx.fill(); ctx.fillStyle = '#3f8a3a'; ctx.beginPath(); ctx.arc(-6, 0, 12, 0, TAU); ctx.fill(); ctx.restore();
  // Princip
  const pk = eBack(seg(t, C('p2:tam'), C('p2:tam') + .4));
  if (pk > 0) { ctx.save(); ctx.translate(640, 930); ctx.scale(pk, pk); ctx.fillStyle = '#9b1c1c'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.strokeStyle = '#9b1c1c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 40 + Math.sin(t * 6) * 6, 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  mapLabel([cx, cy, z], 'MILJACKA', 1000, 1160, 28, { col: '#e8f0f0', halo: 'rgba(40,70,80,.6)' });
  mapLabel([cx, cy, z], 'APPEL RIHTIMI', 1050, 1015, 22, { fam: F.mont });
  mapLabel([cx, cy, z], 'FRANZ JOSEPH SK.', 555, 700, 22, { fam: F.mont, rot: -Math.PI / 2 });
  mapLabel([cx, cy, z], 'LATİN KÖPRÜSÜ', 555, 1290, 20, { fam: F.mont });
  kinetic('YANLIŞ SOKAK', W / 2, 330, 110, t, turnT, { col: '#ffdfd8', strokeCol: '#5a0a0a', out: C('p2:tam') - .1 });
  kinetic('GAVRILO PRINCIP', W / 2, 330, 92, t, C('p2:Gavrilo'), { gold: true });
  kinetic('19 YAŞINDA', W / 2, 450, 70, t, C('p2:yaşındaki'), {});
};
// 6 · İki el ateş
S.shot = (t, s) => {
  const f1 = C('p2:İki'), f2 = C('p2:ateş,');
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#1a1410'], [1, '#050302']]); ctx.fillRect(0, 0, W, H);
  for (const ft of [f1, f2]) { const p = hitPulse(t, ft, .25); if (p > 0) { ctx.fillStyle = `rgba(255,240,210,${p * .8})`; ctx.fillRect(0, 0, W, H); } }
  // yere düşen tüylü miğfer (ağır çekim)
  const u = eOut(seg(t, f2 + .1, s.t1)), hx = W / 2 + u * 80, hy = lerp(560, 1150, u), rot = u * 2.4;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(rot); ctx.scale(2.6, 2.6);
  ctx.fillStyle = '#5ea24f'; for (let i = 0; i < 14; i++) { const a = -2.6 + i * .16; ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, -46, 7, 34 + (i % 3) * 6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#26301f'; ctx.beginPath(); ctx.ellipse(0, 0, 46, 40, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-46, -2, 92, 12);
  ctx.fillStyle = '#14180f'; ctx.beginPath(); ctx.ellipse(36, 10, 26, 7, .1, 0, TAU); ctx.fill();
  ctx.fillStyle = '#d4a63a'; ctx.fillRect(-46, -6, 92, 7); ctx.beginPath(); ctx.arc(0, -40, 7, 0, TAU); ctx.fill();
  ctx.restore();
  glow(W / 2, 1200, 400, 'rgba(120,20,10,.25)', u);
  stamp('SUİKAST', W / 2, 360, 96, t, C('p2:ölü'), '#c43a2a', -.06);
};
// 7 · Barut fıçısı: ittifaklar ve dominolar
S.powder = (t, s) => {
  const zK = eIO(seg(t, C('p3:taş'), s.t1)), cam = [lerp(WIDE[0], -60, zK), lerp(WIDE[1], 160, zK), lerp(WIDE[2], .62, zK)];
  const ap = { DE: C('p3:Almanya'), AH: C('p3:Almanya') + .25, RU: C('p3:Rusya'), RS: C('p3:Rusya') + .25, FR: C('p3:Fransa'), GB: C('p3:İngiltere'), OT: 1e9 };
  drawMap(t, cam, { fill: c => DOM[c] && t > ap[c] ? tint(DOM[c].bloc, .55 * seg(t, ap[c], ap[c] + .4)) : null });
  // blok renkleri kağıt üstüne karışsın diye: tint alpha → üstüne kağıt
  chainLink(cam, 'DE', 'AH', seg(t, ap.AH, ap.AH + .5), '#7a1a14');
  chainLink(cam, 'RU', 'RS', seg(t, ap.RS, ap.RS + .5), '#1d3f6a');
  chainLink(cam, 'RU', 'FR', seg(t, ap.FR, ap.FR + .7), '#1d3f6a');
  chainLink(cam, 'FR', 'GB', seg(t, ap.GB, ap.GB + .5), '#1d3f6a');
  standingDominoes(t, cam, ['GB', 'FR', 'DE', 'AH', 'RS', 'RU'], { appear: ap, wobble: t > C('p3:taş') ? 'RS' : null });
  kinetic('BARUT FIÇISI', W / 2, 340, 110, t, C('p3:barut'), { gold: true, out: C('p3:Almanya') + .5 });
  const lk = seg(t, C('p3:Fransa') + .6, C('p3:Fransa') + 1);
  if (lk > 0) { ctx.save(); ctx.globalAlpha = lk; title('İTTİFAK', W * .3, 330, 70, { col: '#e88a7a', fam: F.cinzel, w: 900 }); title('İTİLAF', W * .7, 330, 70, { col: '#9cc0ea', fam: F.cinzel, w: 900 }); title('↔', W / 2, 330, 60, { col: '#f4e8cc' }); ctx.restore(); }
};
// 8 · Ültimatom: telgraf ve 48 saat
S.ultimatum = (t, s) => {
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#3a2a1c'], [1, '#1a120a']]); ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, 880); ctx.rotate(-.03);
  ctx.fillStyle = '#efe2c0'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.fillRect(-420, -420, 840, 780); ctx.shadowBlur = 0;
  ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 3; ctx.strokeRect(-395, -395, 790, 730);
  setFont(46, F.cinzel, 900); ctx.fillStyle = '#5a3a1a'; ctx.textAlign = 'center'; ctx.fillText('TELGRAF', 0, -330);
  ctx.restore();
  typewriter(['VİYANA → BELGRAD', '23 TEMMUZ 1914', '', 'KRALİYET SIRP HÜKÜMETİNE', 'ÜLTİMATOM', '', 'CEVAP SÜRESİ: 48 SAAT'], 150, 640, 40, t, s.t0 + .1, 34);
  // geri sayım
  const ck = seg(t, C('p4:kırk'), C('p4:suikastten')), hrs = Math.max(0, 48 - 48 * ck), hh = Math.floor(hrs), mm = Math.floor((hrs - hh) * 60);
  setFont(150, F.mono, 700); ctx.textAlign = 'center'; ctx.fillStyle = ck >= 1 ? '#e24a3a' : '#f4e8cc'; ctx.fillText(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, W / 2, 380);
  // takvim yaprakları: 28 Haziran → 28 Temmuz
  const ft = C('p4:sonra'), fk = seg(t, ft - .4, ft + .5);
  if (fk > 0) {
    const day = Math.round(lerp(0, 30, fk)), d = new Date(1914, 5, 28 + day), m = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ'][d.getMonth()];
    ctx.save(); ctx.fillStyle = 'rgba(10,6,4,.7)'; ctx.fillRect(0, 0, W, H); ctx.translate(W / 2, 950);
    ctx.fillStyle = '#f4ecd8'; ctx.fillRect(-280, -360, 560, 660); ctx.fillStyle = '#9b1c1c'; ctx.fillRect(-280, -360, 560, 140);
    setFont(60, F.cinzel, 900); ctx.fillStyle = '#f4ecd8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(m, 0, -290);
    setFont(300, F.anton, 400); ctx.fillStyle = '#1a120a'; ctx.fillText(String(d.getDate()), 0, 20); setFont(64, F.cinzel, 900); ctx.fillText('1914', 0, 230);
    ctx.restore();
    if (fk >= 1) stamp('SAVAŞ İLANI', W / 2, 1300, 80, t, ft + .5, '#c43a2a', -.06);
  }
};
// 9 · Dominolar devriliyor
S.dominoes = (t, s) => {
  const cam = [lerp(-300, -260, seg(t, s.t0, s.t1)), -150, lerp(.38, .35, seg(t, s.t0, s.t1))];
  const fall = { AH: C('p4:taşlar'), RU: C('p4:Rusya'), DE: C('p4:Almanya'), FR: C("p4:Fransa'ya"), GB: C('p4:İngiltere') };
  const atWar = { AH: fall.AH, RS: fall.AH + .4, RU: fall.RU, DE: fall.DE, FR: fall.FR, BE: C('p4:Belçika'), GB: fall.GB };
  drawMap(t, cam, { fill: c => {
    const bloc = c === 'BE' ? 'entente' : DOM[c] && DOM[c].bloc; if (!bloc) return null;
    const on = atWar[c] !== undefined ? seg(t, atWar[c], atWar[c] + .4) : 0;
    return on > 0 ? mix(BLOC.paper, BRIGHT[bloc], .25 + .6 * on) : rgba(BLOC[bloc], .0) && mix(BLOC.paper, BLOC[bloc], c === 'BE' || c === 'OT' ? 0 : .3);
  } });
  const burn = seg(t, C('p4:hafta') - .4, C('p4:ateşin') + .4);
  fireOverlay(t, cam, ['DE', 'AH', 'RU', 'FR', 'RS', 'BE', 'GB'], burn * .9);
  // Belçika üzerinden Fransa'ya Alman okları
  const bk = eIO(seg(t, C('p4:Belçika'), C('p4:Belçika') + 1.1));
  arrow(cam, [[-760, -560], [-960, -520], [-1080, -420], [-1150, -300]], bk, 34, '#b8322a', { col0: 'rgba(184,50,42,.3)' });
  arrow(cam, [[-760, -420], [-900, -380], [-1000, -260]], bk * .9, 26, '#b8322a', { col0: 'rgba(184,50,42,.3)' });
  standingDominoes(t, cam, ['GB', 'FR', 'DE', 'AH', 'RS', 'RU', 'OT'], { fall, dir: { AH: 1, RU: -1, DE: -1, FR: -1, GB: 1 }, size: .62 });
  dateTag(cam, 'AH', '28 TEM', t, fall.AH + .3); dateTag(cam, 'RU', 'SEFERBERLİK', t, fall.RU + .3); dateTag(cam, 'DE', '1 AĞU', t, fall.DE + .3); dateTag(cam, 'FR', '3 AĞU', t, fall.FR + .3); dateTag(cam, 'GB', '4 AĞU', t, fall.GB + .3);
  kinetic('1 HAFTA', W / 2, 360, 150, t, C('p4:hafta'), { gold: true });
};
// 10 · Osmanlı tarafsız mı? Gizli ittifak
S.neutral = (t, s) => {
  const k = eIO(seg(t, s.t0, s.t0 + 2)), cam = [lerp(-300, 520, k), lerp(-150, 380, k), lerp(.36, .62, k)], deal = C('p5:gizlice');
  drawMap(t, cam, { fill: c => {
    if (c === 'OT') return mix(BLOC.paper, '#9a9488', .5 - .5 * seg(t, deal, deal + 1) + 0) && (t > deal ? mix('#a8a294', BLOC.central, seg(t, deal + .3, deal + 1.2) * .45) : '#a8a294');
    const bloc = c === 'BE' ? 'entente' : DOM[c] && DOM[c].bloc; return bloc ? mix(BLOC.paper, BRIGHT[bloc], .7) : null; } });
  fireOverlay(t, cam, ['DE', 'AH', 'RU', 'RS', 'FR'], .45);
  standingDominoes(t, cam, ['OT'], { size: .62 });
  // gizli antlaşma: Berlin'e kırmızı iplik
  if (t > deal) { const [ox, oy] = W2S(cam, ...DOM.OT.p), [bx, by] = W2S(cam, ...CITY['Berlin']), u = eIO(seg(t, deal, deal + 1.2));
    ctx.save(); ctx.strokeStyle = '#c43a2a'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(ox, oy - 60); ctx.lineTo(lerp(ox, bx, u), lerp(oy - 60, by, u)); ctx.stroke(); ctx.restore();
    const dk = eBack(seg(t, deal + .2, deal + .7)); ctx.save(); ctx.translate(W / 2, 1000); ctx.rotate(.05); ctx.scale(dk, dk);
    ctx.fillStyle = '#efe2c0'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.fillRect(-260, -170, 520, 340); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(60,40,20,.5)'; for (let i = 0; i < 6; i++) ctx.fillRect(-210, -110 + i * 34, 420 - (i % 3) * 60, 8);
    ctx.fillStyle = '#9b1c1c'; ctx.beginPath(); ctx.arc(160, 110, 46, 0, TAU); ctx.fill(); setFont(24, F.cinzel, 900); ctx.fillStyle = '#f4e8cc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('GİZLİ', 160, 112);
    ctx.restore(); }
  kinetic('TARAFSIZ?', W / 2, 360, 130, t, s.t0 + .3, { col: '#f4e8cc', out: deal - .2 });
  kinetic('2 AĞUSTOS 1914', W / 2, 340, 84, t, deal, { fam: F.cinzel, w: 900, gold: true });
  kinetic('GİZLİ İTTİFAK', W / 2, 450, 70, t, deal + .3, {});
};
// 11 · Halkın parasıyla alınan zırhlılara el konuldu
S.ships = (t, s) => {
  const coins = C('p5:bağışlarıyla'), seize = C('p5:el');
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#6a7480'], [.55, '#9aa0a0'], [1, '#3a3a3a']]); ctx.fillRect(0, 0, W, H);
  // tersane vinçleri
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 10; for (const x of [140, 900]) { ctx.beginPath(); ctx.moveTo(x, 1120); ctx.lineTo(x, 520); ctx.lineTo(x + (x < 500 ? 260 : -260), 560); ctx.stroke(); }
  seaBand(t, 1120, 800, '#55606a', '#22282e');
  const zk = eOut(seg(t, s.t0, s.t0 + 1.2));
  warship(W / 2 + 20, 1090, 1.05 * lerp(.85, 1, zk), t, { funnels: 2, flag: t > seize ? 'GB' : 'OT', smoke: false });
  setFont(40, F.cinzel, 900); ctx.fillStyle = '#f4e8cc'; ctx.textAlign = 'center'; ctx.fillText('SULTAN OSMAN-I EVVEL  ·  REŞADİYE', W / 2, 1210);
  // bağış: kutuya düşen paralar
  if (t > coins - .2) { const ck = seg(t, coins - .2, seize);
    ctx.save(); ctx.translate(W / 2, 640); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(-150, -60, 300, 170); ctx.fillStyle = '#3a2410'; ctx.fillRect(-60, -64, 120, 12);
    setFont(30, F.mont, 900); ctx.fillStyle = '#f2c75c'; ctx.textAlign = 'center'; ctx.fillText('DONANMA İÇİN', 0, 40);
    const r = rng(3); for (let i = 0; i < 14; i++) { const st = r() * .9, u = seg(ck, st, st + .25); if (u <= 0 || u >= 1) continue; ctx.fillStyle = '#e8c15a'; ctx.beginPath(); ctx.ellipse((r() - .5) * 60, -420 + u * 360, 16, 16 * Math.abs(Math.cos(u * 12)), 0, 0, TAU); ctx.fill(); }
    ctx.restore(); }
  stamp('EL KONULDU', W / 2, 900, 110, t, seize, '#c43a2a', -.1);
  kinetic('HALKIN BAĞIŞLARIYLA', W / 2, 340, 84, t, coins - .1, { gold: true, out: seize - .1 });
  kinetic('İNGİLTERE', W / 2, 340, 110, t, seize, { col: '#ffdfd8', strokeCol: '#5a0a0a' });
};
// 12 · Yavuz ve Midilli Çanakkale'den giriyor
S.yavuz = (t, s) => {
  const lt = t - s.t0, flagT = C('p5:Yavuz');
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#2a2440'], [.4, '#a8584a'], [.55, '#f0a060'], [1, '#2a1a20']]); ctx.fillRect(0, 0, W, H);
  glow(W * .62, 900, 500, 'rgba(255,170,90,.5)'); ctx.fillStyle = '#fff1cc'; ctx.beginPath(); ctx.arc(W * .62, 930, 70, 0, TAU); ctx.fill();
  ridge(980, 90, 3, '#3a2830', 0); ctx.fillStyle = '#3a2830';
  seaBand(t, 1000, 600, '#8a5a50', '#1a1420', 'rgba(255,190,120,A)');
  warship(lerp(1300, 620, eOut(seg(t, s.t0, s.t1))), 1180, .78, t, { funnels: 2, flag: t > flagT ? 'OT' : 'DEWAR', sil: '#1a1218', smokeCol: '#1a1218', smokeA: .4 });
  warship(lerp(1700, 1080, eOut(seg(t, s.t0 + .2, s.t1))), 1110, .45, t, { funnels: 4, flag: t > flagT + .4 ? 'OT' : 'DEWAR', sil: '#241820', smokeCol: '#241820', smokeA: .35 });
  kinetic('YAVUZ', W * .38, 380, 120, t, flagT, { gold: true, fam: F.cinzel, w: 900 });
  kinetic('MİDİLLİ', W * .68, 500, 90, t, C('p5:Midilli'), { gold: true, fam: F.cinzel, w: 900 });
  kinetic('ÇANAKKALE BOĞAZI · 10 AĞUSTOS 1914', W / 2, 260, 36, t, s.t0 + .3, { fam: F.mont, w: 900, out: flagT - .3 });
};
function ridge(base, amp, seed, col, x0) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-50, H); for (let x = -50; x <= W + 50; x += 12) { const X = x + x0; ctx.lineTo(x, base - amp * (.55 * Math.sin(X * .004 + seed) + .3 * Math.sin(X * .011 + seed * 2) + .3)); } ctx.lineTo(W + 50, H); ctx.fill();
}
// 13 · Karadeniz baskını
S.raid = (t, s) => {
  const f1 = C('p6:bombaladı'), f2 = f1 + .6;
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#05070f'], [.55, '#141a30'], [1, '#05050a']]); ctx.fillRect(0, 0, W, H);
  // kıyı ve yanan liman
  ridge(1020, 70, 8, '#0a0c14', 0);
  const burn = seg(t, f1 + .3, f1 + 1.5);
  for (const [x, w] of [[180, 90], [330, 70], [460, 110]]) { ctx.fillStyle = '#0a0c14'; ctx.fillRect(x - w / 2, 930, w, 90); if (burn > 0) { glow(x, 900, 260 * burn, 'rgba(255,120,30,.8)'); glow(x, 920, 90 * burn, 'rgba(255,220,140,1)'); } }
  // projektörler
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [x, ph] of [[260, 0], [520, 1.5]]) { const a = -Math.PI / 2 + Math.sin(t * .8 + ph) * .5; ctx.fillStyle = lg(x, 1000, x + Math.cos(a) * 1200, 1000 + Math.sin(a) * 1200, [[0, 'rgba(200,220,255,.18)'], [1, 'rgba(200,220,255,0)']]); ctx.beginPath(); ctx.moveTo(x, 1000); ctx.lineTo(x + Math.cos(a - .05) * 1400, 1000 + Math.sin(a - .05) * 1400); ctx.lineTo(x + Math.cos(a + .05) * 1400, 1000 + Math.sin(a + .05) * 1400); ctx.fill(); } ctx.restore();
  seaBand(t, 1020, 600, '#0e1428', '#05060c', burn > 0 ? 'rgba(255,140,60,A)' : null);
  warship(760, 1230, .85, t, { funnels: 2, flag: 'OT', sil: '#020306', smokeCol: '#05070c', smokeA: .5, flip: true, flash: Math.max(hitPulse(t, f1, .3), hitPulse(t, f2, .3)) });
  kinetic('29 EKİM 1914', W / 2, 330, 110, t, s.t0 + .2, { fam: F.cinzel, w: 900, gold: true });
  kinetic('KARADENİZ BASKINI', W / 2, 450, 70, t, s.t0 + .5, {});
  kinetic('SAVAŞ!', W / 2, 620, 140, t, C('p6:resmen'), { col: '#ffdfd8', strokeCol: '#5a0a0a' });
};
// 14 · Osmanlı taşı da düştü
S.collapse = (t, s) => {
  const ft = s.t0 + .15, dark = seg(t, C('p6:imparatorluğun'), C('p6:Peki')), cam = [lerp(400, 0, eIO(seg(t, s.t0, s.t1))), lerp(300, 150, eIO(seg(t, s.t0, s.t1))), lerp(.55, .4, eIO(seg(t, s.t0, s.t1)))];
  drawMap(t, cam, { fill: c => {
    if (c === 'OT') return mix('#a8a294', BRIGHT.central, seg(t, ft + .3, ft + .8));
    const bloc = c === 'BE' ? 'entente' : DOM[c] && DOM[c].bloc; return bloc ? mix(BLOC.paper, BRIGHT[bloc], .7) : null; } });
  fireOverlay(t, cam, ['DE', 'AH', 'RU', 'RS', 'FR', 'BE', 'OT'], .6);
  standingDominoes(t, cam, ['OT'], { fall: { OT: ft }, dir: { OT: -1 } });
  ctx.fillStyle = `rgba(5,3,2,${dark * .7})`; ctx.fillRect(0, 0, W, H);
  kinetic('1914 → 1918', W / 2, 360, 130, t, C('p6:imparatorluğun'), { fam: F.cinzel, w: 900, gold: true });
};
// 15 · Merak kancası: Çanakkale
S.cta = (t, s) => {
  const lt = t - s.t0;
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#1c2440'], [.45, '#a86a5a'], [.6, '#f2b878'], [1, '#141018']]); ctx.fillRect(0, 0, W, H);
  sunAt(W * .5, 1020 - lt * 12, 90);
  ridge(1050, 160, 11, '#2a2030', 0); ctx.save(); ctx.translate(0, 40); ridge(1100, 80, 2, '#1a141e', 300); ctx.restore();
  seaBand(t, 1120, 520, '#c08070', '#141018', 'rgba(255,200,140,A)');
  for (let i = 0; i < 4; i++) { const x = ((i * 330 + lt * 30) % (W + 600)) - 300; ctx.save(); ctx.globalAlpha = .25; ctx.fillStyle = rg(x, 1110, 0, 400, [[0, 'rgba(255,230,220,.9)'], [1, 'rgba(255,230,220,0)']]); ctx.scale(1, .3); ctx.fillRect(x - 400, 1110 / .3 - 400, 800, 800); ctx.restore(); }
  kinetic('SIRADAKİ BÖLÜM', W / 2, 330, 54, t, s.t0 + .2, { fam: F.mont, w: 900, col: '#f4e8cc' });
  kinetic('ÇANAKKALE', W / 2, 450, 112, t, C('p6:Çanakkale'), { fam: F.cinzel, w: 900, gold: true, mode: 'letters', spacing: 3 });
  const c = eOut(seg(t, C('p6:Sıradaki') + .4, C('p6:Sıradaki') + .9));
  if (c > 0) { ctx.save(); ctx.globalAlpha = c; ctx.fillStyle = 'rgba(14,6,8,.82)'; ctx.beginPath(); ctx.roundRect(170, 1500, 740, 130, 30); ctx.fill(); ctx.strokeStyle = 'rgba(242,199,92,.7)'; ctx.lineWidth = 3; ctx.stroke(); title('TAKİP ET', W / 2, 1566, 70, { gold: true }); ctx.restore(); }
};
function sunAt(x, y, r) { glow(x, y, r * 7, 'rgba(255,170,90,.45)'); glow(x, y, r * 2.5, 'rgba(255,220,160,.7)'); ctx.fillStyle = '#fff4d8'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
