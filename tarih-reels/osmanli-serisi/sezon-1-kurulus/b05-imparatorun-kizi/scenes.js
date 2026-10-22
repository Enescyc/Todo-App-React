/* Sezon 1 · Bölüm 5 sahneleri: İmparatorun Kızı. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js
 * Portre yok: kişiler siluetle. Düğün sahnesi nötr (keten perde, ahşap sahne; mor-altın vurgu, taht, ipek yok). Sancaklar düz renk.
 * Taşınan nesneler: iki taç (küçük = genç imparator, büyük = Kantakuzenos), gemiler, Pelekanon'un iki oku, altın çağrı çizgisi, rüya ağacı.
 * Bölüme özel çizimler bu dosyada: tac, taht, kadirga, kordon, muhurCiz, perdeCiz, kadin, oturan, kapiCiz, aile, kar, dotLL, surHalka, geceTon, fener. */
'use strict';
const C = cue;
const camAt = (keys, t, creep = .008) => camPath(keys, t, { creep });   // monoton kübik + log-zoom + sürekli hafif itme
const ID = [W / 2, H / 2, 1];                                             // birim kamera: arrow/glowPath'i ekran koordinatında kullanmak için
const OSMC = '#a8322a', BIZC = '#7a5a9a', SRPC = '#3f5f8f', AYDC = '#c98a3e', RIM = 'rgba(255,190,120,.55)';
// harita noktaları (km). CITY listesinde olmayanlar LL ile ve YAKLAŞIK (FACTS.md "Konum notları")
const KON = CITY['Konstantinopolis'], DIM = CITY['Dimetoka'], GEL = CITY['Gelibolu'], PEL = CITY['Palekanon'];
const BUR = CITY['Bursa'], IZM = CITY['İzmir'], IZN = CITY['İznik'];
const SIL = LL(28.25, 41.07), USK = LL(29.02, 41.02), CIM = LL(26.72, 40.46), LAP = LL(26.68, 40.34), ASY = LL(29.32, 40.83);
// Meriç: ağızdan (Ege) Dimetoka'ya, nehir çizgisinin kendisi (shared/data/anadolu_balkan.js)
const MERIC_UP = (() => {
  const r = GEO.rivers['Meriç'][0], pts = []; for (let i = 0; i < r.length; i += 2) pts.push([r[i], r[i + 1]]);
  let best = 0, bd = 1e9; pts.forEach((p, i) => { const d = Math.hypot(p[0] - DIM[0], p[1] - DIM[1]); if (d < bd) { bd = d; best = i; } });
  return [[-254, -16], [-246, -30], ...pts.slice(best).reverse().filter((_, i, a) => i % 2 === 0 || i === a.length - 1)];
})();
const SHIP_SIL = [[...SIL], [-48, -50], [-20, -40], [6, -37], [...ASY]];          // Silivri → Anadolu yakası (şematik)

/* ---------- bölüme özel çizimler ---------- */
// Bizans tacı (stemma): bant, kubbe, inci tepe, yanlarda inci sarkıtlar. o.a saydamlık, o.glow 0..1, o.dim 0..1 soğuk/sönük
function tac(x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= .01 || s <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  if (o.glow > 0) glow(0, -18, 130 * o.glow, 'rgba(255,214,140,.6)');
  const d = o.dim || 0, g = lg(0, -56, 0, 12, [[0, mix('#fff0b8', '#a6a8b2', d)], [.45, mix('#e8b84e', '#6e707c', d)], [1, mix('#8a5a16', '#34363e', d)]]);
  ctx.lineJoin = 'round'; ctx.fillStyle = g; ctx.strokeStyle = '#2a1806'; ctx.lineWidth = 2.6 / s;
  ctx.beginPath(); ctx.moveTo(-34, -8); ctx.bezierCurveTo(-37, -52, 37, -52, 34, -8); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(70,40,8,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, -44); ctx.moveTo(-31, -10); ctx.quadraticCurveTo(-20, -38, 0, -44); ctx.moveTo(31, -10); ctx.quadraticCurveTo(20, -38, 0, -44); ctx.stroke();
  ctx.fillStyle = g; ctx.strokeStyle = '#2a1806'; ctx.lineWidth = 2.6 / s; ctx.beginPath(); ctx.roundRect(-40, -12, 80, 22, 4); ctx.fill(); ctx.stroke();
  for (let i = -2; i <= 2; i++) { ctx.fillStyle = mix(i % 2 ? '#8a2030' : '#2a6a7a', '#3a3c44', d); ctx.beginPath(); ctx.arc(i * 15, -1, 4.6, 0, TAU); ctx.fill(); }
  ctx.fillStyle = mix('#f8f0e0', '#9a9ca4', d); ctx.beginPath(); ctx.arc(0, -50, 6, 0, TAU); ctx.fill();
  for (const sx of [-1, 1]) for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(sx * 37, 17 + j * 9, 3.3, 0, TAU); ctx.fill(); }
  ctx.restore();
}
const mapTac = (cam, p, s, t, o = {}) => { const [x, y] = W2S(cam, ...p); tac(x + (o.dx || 0), y - (o.dy ?? 74) + Math.sin(t * 2 + (o.ph || 0)) * 3, s, o); return [x, y]; };
// yüksek arkalıklı taht (sarayın boş tahtı; yalnız açılışta, düğünde YOK). y = taban
function taht(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = o.col || '#0d0710';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 34; }
  ctx.beginPath(); ctx.moveTo(-150, -280); ctx.lineTo(-150, -560); ctx.quadraticCurveTo(-150, -700, 0, -722); ctx.quadraticCurveTo(150, -700, 150, -560); ctx.lineTo(150, -280); ctx.closePath(); ctx.fill();
  ctx.fillRect(-212, -318, 424, 64); ctx.fillRect(-232, -430, 52, 190); ctx.fillRect(180, -430, 52, 190);
  ctx.fillRect(-202, -256, 42, 236); ctx.fillRect(160, -256, 42, 236); ctx.fillRect(-262, -22, 524, 22); ctx.fillRect(-304, 0, 608, 26);
  ctx.shadowBlur = 0; ctx.strokeStyle = o.line || 'rgba(242,199,92,.32)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-118, -318); ctx.lineTo(-118, -556); ctx.quadraticCurveTo(-118, -668, 0, -688); ctx.quadraticCurveTo(118, -668, 118, -556); ctx.lineTo(118, -318); ctx.stroke();
  ctx.fillStyle = o.cushion || '#2c1830'; ctx.beginPath(); ctx.roundRect(-176, -338, 352, 30, 12); ctx.fill();
  ctx.restore();
}
// kadırga (yandan, sağa gider; o.flip sola): gövde, kürekler, Latin yelkeni, kıçta düz renkli flama
function kadirga(x, y, s, t, o = {}) {
  const sil = o.sil || '#140d08';
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2.2 + (o.ph || 0)) * 2 * s); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = sil; ctx.lineWidth = 3;
  for (let i = 0; i < 9; i++) { const ox = -96 + i * 22, a = Math.sin(t * 3.2 + i * .35 + (o.ph || 0)) * .32; ctx.beginPath(); ctx.moveTo(ox, -6); ctx.lineTo(ox - 16 + Math.sin(a) * 18, 30); ctx.stroke(); }
  ctx.fillStyle = sil; ctx.beginPath(); ctx.moveTo(-142, -22); ctx.quadraticCurveTo(-120, 4, -60, 6); ctx.lineTo(96, 6); ctx.quadraticCurveTo(140, 2, 156, -16); ctx.lineTo(126, -12); ctx.lineTo(-118, -12); ctx.closePath(); ctx.fill();
  ctx.fillRect(-140, -40, 36, 22);
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(10, -12); ctx.lineTo(16, -132); ctx.stroke();
  ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(-70, -26); ctx.lineTo(96, -150); ctx.stroke();
  ctx.fillStyle = o.sail || '#d9ccb0'; ctx.beginPath(); ctx.moveTo(-64, -30); ctx.quadraticCurveTo(10, -60 + Math.sin(t * 1.4) * 4, 92, -146); ctx.lineTo(16, -18); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = sil; ctx.lineWidth = 1.5; ctx.stroke();
  if (o.flag) { ctx.fillStyle = o.flag; ctx.beginPath(); ctx.moveTo(-122, -40); ctx.lineTo(-122, -74); ctx.lineTo(-86 + Math.sin(t * 5) * 4, -66); ctx.lineTo(-122, -58); ctx.fill(); ctx.strokeStyle = sil; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-122, -40); ctx.lineTo(-122, -78); ctx.stroke(); }
  ctx.restore();
}
// harita üstünde küçük kadırga ikonu (dünya noktası); dir: +1 sağa, -1 sola
function mapGemi(cam, p, s, t, o = {}) { const [x, y] = W2S(cam, ...p); if (x < -100 || x > W + 100 || y < -100 || y > H + 100) return; ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = 'rgba(20,30,36,.28)'; ctx.beginPath(); ctx.ellipse(x, y + 4, 34 * s, 7 * s, 0, 0, TAU); ctx.fill(); kadirga(x, y, .26 * s, t, { flip: o.flip, ph: o.ph, flag: o.flag, sil: '#1c120a', sail: '#efe4cc' }); ctx.restore(); }
// gemi kafilesi bir yol boyunca: k 0..1 ilerleme, n gemi arka arkaya
function gemiKafile(cam, pts, k, t, o = {}) {
  if (k <= 0) return; const P = spline(pts.map(p => W2S(cam, ...p)), 10), L = polyLen(P), n = o.n || 3;
  if (o.wake) { ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'screen'; const sp = []; for (let i = 0; i <= 40; i++) { const kk = i / 40 * Math.max(0, k - .02); sp.push(pointAt(P, L, kk)); } for (const [w, a] of [[16, .16], [6, .5]]) { ctx.strokeStyle = rgba(o.wake, a * (o.a ?? 1)); ctx.lineWidth = w; tracePath(sp); ctx.stroke(); } ctx.restore(); }
  for (let i = 0; i < n; i++) {
    const kk = clamp(k - i * (o.gap ?? .06)); if (kk <= 0) continue; const [x, y, ang] = pointAt(P, L, kk);
    ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = 'rgba(20,30,36,.28)'; ctx.beginPath(); ctx.ellipse(x, y + 4, 32 * (o.s || 1), 7 * (o.s || 1), 0, 0, TAU); ctx.fill();
    kadirga(x, y, .25 * (o.s || 1), t, { flip: Math.cos(ang) < 0, ph: i * 1.3, flag: o.flag, sil: '#1c120a', sail: '#efe4cc' }); ctx.restore();
  }
}
// harita: dünya noktasında şehir noktası + etiket (CITY listesinde olmayan yerler için)
function dotLL(cam, p, label, o = {}) {
  const [x, y] = W2S(cam, ...p), r = o.r || 8; if (x < -200 || x > W + 200 || y < -200 || y > H + 200) return [x, y];
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = o.col || OSMC; ctx.strokeStyle = '#f4e8cc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  if (label && (o.la ?? 1) > 0) { ctx.globalAlpha = (o.a ?? 1) * (o.la ?? 1); setFont(o.size || 30, F.mont, 800); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(240,228,198,.9)'; const dx = o.align === 'right' ? -16 : 16; ctx.strokeText(label, x + dx, y); ctx.fillStyle = '#1a120a'; ctx.fillText(label, x + dx, y); }
  ctx.restore(); return [x, y];
}
function surHalka(x, y, r, col, a, w = 6, dash) {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
}
function geceTon(a, col = '#3a4a78') { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function fener(x, y, a, r = 7) { if (a <= 0) return; glow(x, y, r * 7, `rgba(255,180,90,${.55 * a})`); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffdc9a'; ctx.beginPath(); ctx.arc(x, y, r * .6, 0, TAU); ctx.fill(); ctx.restore(); }
// harita üstünde düz renkli sancak (dünya noktası)
// düz renkli sancak, krem kenarlı (aynı renkli harita zemininde de okunur). y = gönderin dibi; o.flip sola dalgalanır
function sancak(x, y, s, t, col, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.lineJoin = 'round';
  const flag = () => { ctx.beginPath(); ctx.moveTo(0, -255); for (let i = 0; i <= 12; i++) { const k = i / 12, w = Math.sin(t * 5 - k * 5) * 10 * k; ctx.lineTo(k * 170, -255 + w + k * 30); } for (let i = 12; i >= 0; i--) { const k = i / 12, w = Math.sin(t * 5 - k * 5) * 10 * k; ctx.lineTo(k * 170, -170 + w - k * 55); } ctx.closePath(); };
  ctx.strokeStyle = o.edge || 'rgba(246,236,214,.95)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -262); ctx.stroke(); flag(); ctx.stroke();
  ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -262); ctx.stroke();
  ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.moveTo(0, -284); ctx.lineTo(-8, -262); ctx.lineTo(8, -262); ctx.fill();
  flag(); ctx.fillStyle = col; ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(0, -200, 170, 4);
  ctx.restore();
}
function mapSancak(cam, p, s, t, col, a = 1, rise = 1) {
  if (a <= 0 || rise <= 0) return; const [x, y] = W2S(cam, ...p);
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(x - 30, y - 310 * s - 16, 240 * s + 30, 310 * s + 18); ctx.clip(); sancak(x, y + 270 * s * (1 - eOut(rise)), s, t, col); ctx.restore();
}
// iki kordon (mühür sahnesi): soldan mor, sağdan kızıl; k 0..1 uzama
function kordon(x0, y0, x1, y1, k, col, w = 16, t = 0) {
  if (k <= 0) return; const P = spline([[x0, y0], [lerp(x0, x1, .35), y0 - 60], [lerp(x0, x1, .7), y1 + 40], [x1, y1]], 14), L = polyLen(P), sp = [];
  for (let i = 0; i <= 50; i++) sp.push(pointAt(P, L, i / 50 * k));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = w + 6; ctx.save(); ctx.translate(0, 8); tracePath(sp); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = col; ctx.lineWidth = w; tracePath(sp); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,240,220,.22)'; ctx.lineWidth = w * .35; ctx.setLineDash([w * .7, w * .7]); ctx.lineDashOffset = 0; tracePath(sp); ctx.stroke();
  ctx.restore();
}
// mühür mumu: düzensiz kenar, iç halka ve iç içe iki halka kabartması (evlilik)
function muhurCiz(x, y, r, k) {
  if (k <= 0) return; const sc = lerp(2.2, 1, eOut(clamp(k * 1.6))), R = rng(77);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 3);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(6, 12, r * 1.05, r * .98, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); for (let i = 0; i <= 36; i++) { const a = i / 36 * TAU, rr = r * (1 + .08 * Math.sin(a * 5 + 1) + .05 * (R() - .5)); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.fillStyle = rg(-r * .3, -r * .35, r * .1, r * 1.1, [[0, '#c4503a'], [.6, '#8a2418'], [1, '#4a0f0a']]); ctx.fill();
  ctx.strokeStyle = 'rgba(40,6,4,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, TAU); ctx.stroke();
  for (const dx of [-.2, .2]) { ctx.strokeStyle = 'rgba(40,6,4,.55)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(dx * r, 0, r * .32, 0, TAU); ctx.stroke(); ctx.strokeStyle = 'rgba(255,190,160,.35)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(dx * r - 2, -2, r * .32, 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// ayakta duran kadın siluet (gelin): uzun elbise, omuzlara inen duvak. y = ayak
function kadin(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = o.col || '#17100c';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 30; }
  ctx.beginPath(); ctx.moveTo(-92, 0); ctx.quadraticCurveTo(-70, -150, -44, -250); ctx.quadraticCurveTo(-40, -300, -30, -312); ctx.lineTo(30, -312); ctx.quadraticCurveTo(40, -300, 44, -250); ctx.quadraticCurveTo(70, -150, 92, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -340, 26, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-6, -372); ctx.quadraticCurveTo(-58, -350, -62, -250); ctx.quadraticCurveTo(-30, -270, -24, -312); ctx.lineTo(24, -312); ctx.quadraticCurveTo(30, -270, 62, -250); ctx.quadraticCurveTo(58, -350, 6, -372); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// oturan siluet (gorsel.js seated() biçimi; şapka: 'sarik' | 'skiadion' (Bizans saray şapkası)). Göğüs noktasını döndürür
function oturan(x, y, s, o = {}) {
  const f = o.flip ? -1 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s); ctx.fillStyle = o.col || '#0b0710';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 26; }
  ctx.beginPath(); ctx.ellipse(10, -30, 128, 34, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-92, -34); ctx.quadraticCurveTo(-96, -150, -50, -212); ctx.lineTo(46, -212); ctx.quadraticCurveTo(92, -160, 104, -34); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, -170); ctx.quadraticCurveTo(110, -120, 120, -60); ctx.lineTo(96, -52); ctx.quadraticCurveTo(80, -110, 30, -140); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(8, -246, 34, 0, TAU); ctx.fill();
  if (o.hat === 'skiadion') { ctx.beginPath(); ctx.ellipse(8, -268, 50, 10, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-28, -268); ctx.quadraticCurveTo(-32, -330, 8, -336); ctx.quadraticCurveTo(48, -330, 44, -268); ctx.closePath(); ctx.fill(); }
  else { ctx.beginPath(); ctx.ellipse(8, -272, 46, 24, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(8, -290, 24, 16, 0, 0, TAU); ctx.fill(); }
  if (o.beard) { ctx.beginPath(); ctx.moveTo(22, -234); ctx.quadraticCurveTo(52, -196, 18, -180); ctx.lineTo(0, -214); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  return [x + 36 * s * f, y - 168 * s];
}
// yürüyen aile: yetişkin (sırtında bohça) + çocuk; sağa yürür
function aile(x, y, s, t, o = {}) {
  const g = fract(t * .7 + (o.ph || 0)), sw = Math.sin(g * TAU);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = o.sil || '#10131a'; ctx.strokeStyle = o.sil || '#10131a'; ctx.lineCap = 'round';
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-4, -78); ctx.lineTo(-4 + sw * 16, 0); ctx.moveTo(4, -78); ctx.lineTo(4 - sw * 16, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-26, -72); ctx.quadraticCurveTo(-30, -150, -10, -176); ctx.lineTo(16, -176); ctx.quadraticCurveTo(32, -140, 26, -72); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -192, 17, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-30, -150, 30, 36, -.2, 0, TAU); ctx.fill();
  const cx = 62, c2 = Math.sin(g * TAU + 1.5);
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx - 3, -46); ctx.lineTo(cx - 3 + c2 * 10, 0); ctx.moveTo(cx + 3, -46); ctx.lineTo(cx + 3 - c2 * 10, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 16, -44); ctx.quadraticCurveTo(cx - 18, -92, cx - 6, -104); ctx.lineTo(cx + 10, -104); ctx.quadraticCurveTo(cx + 20, -84, cx + 16, -44); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 2, -116, 12, 0, TAU); ctx.fill();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(22, -130); ctx.quadraticCurveTo(40, -110, cx - 8, -96); ctx.stroke();
  ctx.restore();
}
// kar taneleri (deterministik)
const SNOW = (() => { const R = rng(1352); return Array.from({ length: 110 }, () => [R() * W, R() * H, 1.2 + R() * 2.8, 30 + R() * 60, R() * TAU]); })();
function kar(t, a = 1) { if (a <= 0) return; ctx.save(); ctx.fillStyle = '#f2f4f8'; for (const [x, y, r, sp, ph] of SNOW) { ctx.globalAlpha = a * (.35 + .35 * Math.sin(t + ph)); ctx.beginPath(); ctx.arc(x + Math.sin(t * .6 + ph) * 26, fract((y + t * sp) / H) * H, r, 0, TAU); ctx.fill(); } ctx.restore(); }
// haritada kış tonu (soğuk mavi-gri) ve harita üstü kar
function kisTon(a) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .45 * a; ctx.fillStyle = '#8a9ab4'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .12 * a; ctx.fillStyle = '#dfe6f0'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
// sahne ışığı: konik huzme
function huzme(x0, y0, w0, x1, y1, w1, col, a) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.fillStyle = lg(x0, y0, x1, y1, [[0, col], [1, 'rgba(0,0,0,0)']]); ctx.beginPath(); ctx.moveTo(x0 - w0, y0); ctx.lineTo(x0 + w0, y0); ctx.lineTo(x1 + w1, y1); ctx.lineTo(x1 - w1, y1); ctx.closePath(); ctx.fill(); ctx.restore(); }
// küçük yazı (ad etiketi, ekran altı değil): Montserrat 900, krem
const ad = (s, x, y, t, t0, out, size = 30, o = {}) => kinetic(s, x, y, size, t, t0, { mode: 'fade', fam: F.mont, w: 900, spacing: o.sp ?? 5, col: o.col || 'rgba(255,242,220,.95)', stroke: o.stroke ?? true, sw: .1, out });

/* ---------- ortak kameralar: aynı haritayı kullanan ardışık sahneler aynı anahtarları paylaşır ---------- */
function trakCam(t) {   // sefer → ilan → bolunme (p1:Ölen – p3)
  return camAt([
    [C('p1:Ölen-0.25'), -18, -62, 6.2], [C("p1:Kantakuzenos'tu") + .4, -104, -80, 3.05], [C('p1:imparatoriçe'), -96, -78, 3.25], [C('p1:mallarına'), -100, -76, 3.2],
    [C('p2-0.25'), -102, -78, 3.3], [C("p2:Dimetoka'da") + .3, -201, -99, 7.0], [C('p2:ilan'), -199, -101, 7.5],
    [C('p2:Artık') + .5, -100, -84, 3.0], [C('p2:Bizans') + .2, -150, -78, 2.35], [C('p3-0.25'), -155, -74, 2.25]], t, .004);
}
const EGE = [-185, 132, 2.4];
function egeCam(t) {    // dost → meric (p3)
  const a = C('p3-0.25'), b = C('p3:yakasından') + .2, A = trakCam(a);
  if (t < b) return flyTo(A, EGE, eIO(seg(t, a, b)));
  return camAt([[b, ...EGE], [C('p3:Dimetoka-0.2'), -186, 126, 2.48], [C('p3:kuşatıldığında') + .3, -222, -70, 7.4], [C('p3:surların-0.2') + .3, -217, -82, 8.4]], t, .004);
}
function ittifakCam(t) {   // donus → soru → pelekanon → gecis (p4)
  const PK = [28, -29, 6.6], GC = [-182, -32, 3.0];
  const tp = C('p4:Yıllar-0.2'), tpe = C("p4:Pelekanon'da") + .25, tb = C('p4:Böylece-0.2'), ta = C("p4:Avrupa'ya");
  const hold = [-96, 6, 2.1];
  if (t < tp) return camAt([[C('p4-0.25'), -214, -78, 6.6], [C('p4:dönmek') + .4, -186, 128, 2.42], [C('p4:aradı') + .3, ...hold], [tp, hold[0] + .3, hold[1], hold[2] * 1.004]], t, 0);
  if (t < tpe) return flyTo(hold, PK, eIO(seg(t, tp, tpe)));
  if (t < tb) return camAt([[tpe, ...PK], [tb, 31, -30, 7.1]], t, 0);
  if (t < ta) return flyTo([31, -30, 7.1], GC, eIO(seg(t, tb, ta)));
  return camAt([[ta, ...GC], [C('p5-0.3') + .3, -186, -40, 3.15]], t, .004);
}
function marmaraCam(t) {   // gelin → sessizlik (p5 sonu)
  return camAt([[C('p5:gemiler-0.2'), -42, -46, 5.2], [C("p5:Orhan'a") + .3, -16, -40, 4.7], [C('p5.end+0.25'), -14, -38, 4.4], [C('p6-0.25') + .35, -48, -40, 2.45]], t, .003);
}
function cam52(t) {        // yeniden → suleyman (p7)
  return camAt([[C('p7:Bin-0.25'), -270, -112, 1.62], [C('p7:silaha') + .3, -300, -118, 1.5], [C('p7:Kantakuzenos') + .2, -150, -66, 2.0], [C('p7:damadından') + .5, -112, -36, 2.3],
    [C('p7:Bu-0.2'), -122, -40, 2.3], [C('p7:Süleyman') + .4, -178, -50, 2.75], [C('p7:süvarileri-0.2') + .2, -196, -74, 3.4]], t, .003);
}
function gelCam(t) {        // cimpe (p8 başı)
  return camAt([[C('p8-0.3'), -196, -62, 3.0], [C('p8:askerlerinden'), -198, -44, 3.5], [C("p8:Gelibolu'nun") + .2, -196, -4, 7.2], [C('p8:Çimpe') + .3, -193, 0, 10.4], [C('p8:Kısa-0.2') + .3, -192, 1, 11.4]], t, .003);
}
function sonCam(t) {        // istek → sarsinti (p8 sonu)
  return camAt([[C('p8:Kantakuzenos-0.2'), -110, -20, 3.45], [C('p8:gitmelerini'), -104, -24, 3.25], [C('p8:Ama-0.2'), -118, -16, 3.5], [C('p8:sarsılacak') + .2, -182, -4, 6.4], [C('p8.end'), -192, 0, 9.4], [C('end'), -193, 1, 10.4]], t, .003);
}

window.SCENE_FNS = {
  /* "Bin üç yüz kırk bir yazında Bizans imparatoru Üçüncü Andronikos öldü ve tahtı küçük oğluna kaldı." */
  taht(t, s) {
    const to = C('p1:öldü'), tk = C('p1:küçük'), dark = eIO(seg(t, to - .05, to + .9));
    const z = lerp(1, 1.12, eIO(seg(t, s.t0, s.t1 + .3))), fy = lerp(1050, 1010, eIO(seg(t, tk - .4, s.t1)));
    ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.translate(-540, -fy);
    ctx.fillStyle = lg(0, 0, 0, H, [[0, mix('#1c1028', '#0b0e1a', dark)], [.55, mix('#2c1832', '#141a2a', dark)], [1, '#050306']]); ctx.fillRect(-200, -200, W + 400, H + 400);
    // apsis kemeri ve sütunlar (soluk mozaik pırıltısı)
    const R = rng(1341);
    ctx.save(); ctx.beginPath(); ctx.moveTo(240, 1330); ctx.lineTo(240, 700); ctx.arc(540, 700, 300, Math.PI, 0); ctx.lineTo(840, 1330); ctx.closePath();
    ctx.fillStyle = lg(0, 380, 0, 1330, [[0, mix('#3a2440', '#1c2234', dark)], [1, mix('#1a0e1c', '#0c0f18', dark)]]); ctx.fill(); ctx.clip();
    for (let i = 0; i < 140; i++) { const x = 250 + R() * 580, y = 400 + R() * 420, a = (.15 + .25 * Math.sin(t * 1.5 + i)) * (1 - .7 * dark); ctx.fillStyle = `rgba(242,199,92,${a * .5})`; ctx.fillRect(x, y, 4, 4); }
    ctx.restore();
    ctx.fillStyle = '#07040a'; for (const cx of [170, 910]) { ctx.fillRect(cx - 40, 560, 80, 800); ctx.fillRect(cx - 58, 540, 116, 34); ctx.fillRect(cx - 58, 1330, 116, 30); }
    ctx.strokeStyle = 'rgba(242,199,92,.18)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(540, 700, 300, Math.PI, 0); ctx.stroke();
    // soğuk ay ışığı (mumlar sönünce) yüksek pencereden
    huzme(380, 380, 30, 560, 1330, 200, 'rgba(160,180,230,.5)', .35 * dark);
    // mum ışığı
    glow(540, 1050, 640, 'rgba(255,170,80,.30)', 1 - dark);
    taht(540, 1330, 1, { rim: dark < .5 ? 'rgba(255,170,80,.5)' : 'rgba(150,170,220,.35)', line: `rgba(242,199,92,${.32 - .18 * dark})` });
    // şamdanlar: "öldü"de söner, duman yükselir
    for (const [cx, sd] of [[300, 1], [780, 2]]) {
      ctx.fillStyle = '#0a0608'; ctx.fillRect(cx - 5, 1150, 10, 180); ctx.fillRect(cx - 34, 1322, 68, 10); ctx.fillRect(cx - 26, 1146, 52, 8);
      candle(cx, 1146, 1.25, t, 1 - dark, sd);
      if (t > to) for (let i = 0; i < 6; i++) { const k = fract((t - to) * .35 + i / 6), a = .3 * (1 - k) * seg(t, to, to + .6) * (1 - seg(t, to + 4, to + 6)); const sx = cx + Math.sin(k * 6 + i + sd) * 16 * (1 + k), sy = 1050 - k * 380, sr = 14 + k * 46; ctx.fillStyle = rg(sx, sy, 0, sr, [[0, `rgba(205,205,220,${a})`], [1, 'rgba(205,205,220,0)']]); ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2); }
    }
    // küçük taç: tahtın büyük oturağına iner (ölçek karşıtlığı)
    const dk = eOut(seg(t, tk - .2, tk + .9)), sp = spring(t, tk + .4, { freq: 1.6, damp: .6 });
    if (dk > 0) { const y = lerp(620, 990, dk) - (1 - sp) * 0; glow(540, y - 10, 120, 'rgba(200,215,255,.35)', dk); tac(540, y, .62, { a: clamp(dk * 2), glow: .3 * dk }); }
    ctx.restore();
    yearTicker(W / 2, 480, 1341, 120, { label: 'BİZANS', a: 1 - seg(t, C('p1:Bizans') - .35, C('p1:Bizans')) });
  },
  /* "Ölen imparatorun en yakın adamı Kantakuzenos'tu, ama o seferdeyken imparatoriçe ve saraydaki rakipleri yönetimi ele geçirip mallarına el koydu." */
  sefer(t, s) {
    const Y = 1341.5, cam = trakCam(t), tk = C("p1:Kantakuzenos'tu"), tsf = C('p1:seferdeyken'), ti = C('p1:imparatoriçe'), ty = C('p1:yönetimi'), tm = C('p1:mallarına');
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .25 });
    mapLabel(cam, 'BİZANS', -128, -132, 46, { a: seg(t, s.t0 + .6, s.t0 + 1.2) });
    // seferdeki Kantakuzenos: Trakya'da mor sancak (şematik konum, Dimetoka çevresi)
    const KCAMP = [DIM[0] + 6, DIM[1] + 10];
    glowPath(cam, [[...KON], [-60, -82], [-140, -96], [...KCAMP]], t, eIO(seg(t, tsf - .2, tsf + .9)), { w: 5, col: '#e8d8ff', dash: true, a: .8 * (1 - seg(t, ty, ty + .6)) });
    mapSancak(cam, KCAMP, .3, t, BIZC, 1, seg(t, tk - .1, tk + .6));
    const [kx, ky] = W2S(cam, ...KCAMP); ad('KANTAKUZENOS', kx + 4, ky + 46, t, tk + .1, 1e9, 26);
    // başkent: küçük taç (tahttan taşınan nesne), naiplik halkası, el konan mallar
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 9 });
    const [cx, cy] = W2S(cam, ...KON), rk = eOut(seg(t, ty - .2, ty + .7));
    for (let i = 0; i < 3; i++) { const a = i / 3 * TAU - Math.PI / 2 + .4, k = eOut(seg(t, ti + i * .35, ti + i * .35 + .5)); if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#2a1830'; ctx.strokeStyle = '#e8d8ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * lerp(70, 36, rk), cy + Math.sin(a) * lerp(70, 36, rk), 13, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); } }
    if (rk > 0) { surHalka(cx, cy, lerp(90, 52, rk), 'rgba(30,14,36,.5)', rk, 20); surHalka(cx, cy, lerp(90, 52, rk), '#2a1830', rk, 5, [14, 9]); }
    mapTac(cam, KON, .55, t, { a: seg(t, s.t0, s.t0 + .5), dy: 90 });
    mapPin(cam, ...KON, t, s.t0 + .25, 'KONSTANTİNOPOLİS', { left: true, size: 30, col: BIZC, a: 1 - seg(t, ti - .5, ti) });
    flowDots(cam, [[...KCAMP], [-150, -100], [-70, -80], [...KON]], t, seg(t, tm - .1, tm + .4), { n: 12, speed: .45, r: 11 });
  },
  /* "Bunun üzerine Kantakuzenos Dimetoka'da kendini imparator ilan etti." */
  ilan(t, s) {
    const Y = 1341.8, cam = trakCam(t), td = C("p2:Dimetoka'da"), ti = C('p2:ilan');
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .25 });
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 9 });
    mapTac(cam, KON, .55, t, { dy: 90 });
    const KCAMP = [DIM[0] + 6, DIM[1] + 10];
    mapSancak(cam, KCAMP, .3, t, BIZC, 1 - seg(t, td, td + .4));
    mapPin(cam, ...DIM, t, td - .05, 'DİMETOKA', { date: '26 EKİM 1341', size: 34, col: BIZC });
    const up = spring(t, ti, { freq: 1.4, damp: .55 }), hp = hitPulse(t, ti + .1, 1.2);
    if (up > 0) { const [x, y] = W2S(cam, ...DIM); glow(x, y - 170, 260 * (.4 + hp), 'rgba(255,214,140,.55)'); tac(x, y - 120 - 70 * up + Math.sin(t * 2) * 3, 1.15 * clamp(up, 0, 1.2), { glow: .4 + hp }); }
  },
  /* "Artık iki imparator vardı ve Bizans altı yıl sürecek bir iç savaşa sürüklendi." */
  bolunme(t, s) {
    const Y = 1341.9, cam = trakCam(t), ti = C('p2:iki'), tb = C('p2:Bizans'), ts = C('p2:sürüklendi');
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .25 });
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 8 }); ownCity(cam, 'Dimetoka', Y, { label: false, r: 8 });
    const pk = hitPulse(t, ti, 1.0) + hitPulse(t, ti + .45, 1.0);
    mapTac(cam, KON, .5 + .08 * hitPulse(t, ti + .45, 1), t, { dy: 78, glow: .5 * hitPulse(t, ti + .45, 1) });
    mapTac(cam, DIM, .78 + .08 * hitPulse(t, ti, 1), t, { dy: 84, ph: 1, glow: .5 * hitPulse(t, ti, 1) });
    mapLabel(cam, 'BİZANS', -150, -150, 44, { a: seg(t, tb - .1, tb + .4) });
    // iç savaş: Bizans toprağında çatlak (simgesel; cepheler bölgeden bölgeye değişti)
    const ck = eOut(seg(t, ts - .5, ts + .5));
    if (ck > 0) {
      const crack = [[-96, -235], [-110, -196], [-98, -160], [-122, -122], [-104, -92], [-126, -60], [-112, -34]];
      const P = spline(crack.map(p => W2S(cam, ...p)), 6), L = polyLen(P), sp = []; for (let i = 0; i <= 60; i++) sp.push(pointAt(P, L, i / 60 * ck));
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,200,140,.4)'; ctx.lineWidth = 14; tracePath(sp); ctx.stroke(); ctx.strokeStyle = '#1a0a10'; ctx.lineWidth = 5; tracePath(sp); ctx.stroke(); ctx.restore();
      const hp = hitPulse(t, ts, 1.1); if (hp > 0) { const [x, y] = pointAt(P, L, .55); glow(x, y, 300 * hp, 'rgba(255,170,110,.45)'); }
    }
    kinetic('1341 – 1347', W / 2, 470, 82, t, ts - .1, { mode: 'slam', fam: F.cinzel, w: 900, gold: true, spacing: 4 });
  },
  /* "Bu savaşta Kantakuzenos'a denizin öte yakasından eski bir dostu yardım etti: Aydınoğlu Umur Bey." */
  dost(t, s) {
    const Y = 1342.8, cam = egeCam(t), tdo = C('p3:dostu'), tu = C('p3:Aydınoğlu');
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .2 });
    ownCity(cam, 'Dimetoka', Y, { label: false, r: 8 });
    mapTac(cam, DIM, .62, t, { dy: 70, ph: 1 });
    // eski dostluk: Dimetoka ile İzmir arasında denizin üstünden altın yay
    glowPath(cam, [[...DIM], [-232, 10], [-215, 130], [...IZM]], t, eIO(seg(t, tdo - .3, tdo + 1.1)), { w: 6, col: '#ffcf6a', dash: true });
    mapLabel(cam, 'EGE DENİZİ', ...LL(25.2, 39.75), 34, { a: seg(t, C('p3:denizin') - .2, C('p3:denizin') + .4), col: '#1d3540', halo: 'rgba(200,220,225,.6)', sp: 6 });
    ownCity(cam, 'İzmir', Y, { label: false, r: 9 });
    mapSancak(cam, [IZM[0] + 4, IZM[1] - 2], .3, t, AYDC, 1, seg(t, tu - .2, tu + .5));
    mapPin(cam, ...IZM, t, tu - .05, 'UMUR BEY', { date: 'AYDINOĞLU', left: true, size: 32, col: AYDC });
  },
  /* "Dimetoka kuşatıldığında Umur'un gemileri Meriç'ten yukarı, surların dibine kadar çıktı." */
  meric(t, s) {
    const Y = 1343, cam = egeCam(t), tk = C('p3:kuşatıldığında'), tg = C('p3:gemileri'), tm = C("p3:Meriç'ten"), tsr = C('p3:surların');
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .2 });
    riverGlow(cam, 'Meriç', seg(t, tm - .5, tm + .3));
    const [dx, dy] = W2S(cam, ...DIM), z = cam[2], rk = eOut(seg(t, tk - .1, tk + .6)), lift = seg(t, tsr - .1, tsr + .8);
    if (rk > 0) { const r = lerp(14, 7.5, rk) * z; surHalka(dx, dy, r + 10, 'rgba(30,16,30,.25)', rk * (1 - lift), 22); surHalka(dx, dy, r, '#2a1a2e', rk * (1 - lift), 5, [16, 10]); }
    ownCity(cam, 'Dimetoka', Y, { size: 30, a: seg(t, s.t0, s.t0 + .5) });
    mapTac(cam, DIM, .55, t, { dy: 90, ph: 1, a: 1 - seg(t, tk - .2, tk + .2) * .6 });
    gemiKafile(cam, MERIC_UP, eIO(seg(t, tg - .5, tsr + .6)), t, { n: 3, gap: .08, flag: AYDC, wake: '#ffe2a8', s: 1.45 });
  },
  /* "...surların dibine kadar çıktı." — yakın plan */
  surlar(t, s) {
    const tc = C('p3:çıktı'), el = t - s.t0, z = 1 + .035 * el, arr = eOut(seg(t, s.t0 - .3, tc + .3));
    ctx.save(); ctx.translate(560, 1000); ctx.scale(z, z); ctx.translate(-560, -1000);
    ctx.fillStyle = lg(0, 0, 0, 1200, [[0, '#0e1226'], [.55, '#2a2440'], [.82, '#8a5a48'], [1, '#d08a52']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    stars(t, .45);
    ctx.fillStyle = '#1a1420'; ctx.beginPath(); ctx.moveTo(-100, 1160); for (let x = -100; x <= W + 100; x += 40) ctx.lineTo(x, 1090 - 28 * Math.sin(x * .006 + 1.1)); ctx.lineTo(W + 100, 1200); ctx.lineTo(-100, 1200); ctx.fill();
    castle(650, 1000, 1.05, '#0c0910');
    // kuşatanların ateşleri: gemiler gelince söner
    for (let i = 0; i < 7; i++) { const x = 70 + i * 34, y = 1112 + Math.sin(i * 2.3) * 6; fener(x, y, (.5 + .3 * Math.sin(t * 3 + i)) * (1 - seg(t, tc, tc + 1.2)), 5); }
    // nehir
    ctx.fillStyle = lg(0, 1160, 0, 1330, [[0, '#2a3446'], [1, '#121824']]); ctx.fillRect(-100, 1160, W + 200, 200);
    ctx.strokeStyle = 'rgba(255,200,140,.18)'; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { const x = ((i * 97 + t * 30) % 1300) - 100, y = 1180 + (i % 5) * 26; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 70, y); ctx.stroke(); }
    ctx.fillStyle = '#07060a'; ctx.fillRect(-100, 1330, W + 200, 800);
    // gemiler surların dibine
    for (let i = 0; i < 3; i++) { const x = lerp(-260 - i * 300, 560 - i * 250, arr), y = 1236 + i * 18; kadirga(x, y, .95 - i * .12, t, { ph: i, flag: AYDC, sil: '#07050a', sail: '#cdbb98' }); }
    const hp = hitPulse(t, tc, 1.2); if (hp > 0) glow(620, 1000, 420 * hp, 'rgba(255,190,120,.45)');
    ctx.restore();
  },
  /* "Ama Umur kendi topraklarına dönmek zorunda kalınca Kantakuzenos yeni bir müttefik aradı." */
  donus(t, s) {
    const Y = 1344, cam = ittifakCam(t), td = C('p4:dönmek'), tk = C('p4:Kantakuzenos'), ty = C('p4:yeni'), ta = C('p4:aradı');
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .2 });
    ownCity(cam, 'Dimetoka', Y, { label: false, r: 8 }); ownCity(cam, 'İzmir', Y, { label: false, r: 8 });
    // Umur'un gemileri geri döner (Meriç ağzından İzmir'e)
    gemiKafile(cam, [[-250, -24], [-262, 40], [-236, 150], [-190, 222], [...IZM]], eIO(seg(t, s.t0 + .2, td + 1.3)), t, { n: 3, gap: .05, flag: AYDC, s: 1.3, a: 1 - seg(t, ta - .4, ta + .2) });
    mapSancak(cam, [IZM[0] + 4, IZM[1] - 2], .26, t, AYDC, 1 - seg(t, ty, ty + .5));
    mapTac(cam, DIM, .6, t, { dy: 72, ph: 1, glow: .4 * hitPulse(t, tk, 1.2) });
    // arayış: Anadolu'nun üstünde gezinen ışık
    const sk = eIO(seg(t, ty - .3, ta + .7));
    if (sk > 0 && sk < 1) { const p = [lerp(-200, 10, sk), lerp(80, 20, sk) + Math.sin(sk * 7) * 18], [x, y] = W2S(cam, ...p); glow(x, y, 200, 'rgba(255,230,170,.45)', Math.sin(sk * Math.PI)); }
  },
  /* "Peki kimdi bu müttefik?" — kamera durur */
  soru(t, s) {
    const Y = 1344.2, cam = ittifakCam(t);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .1 });
    ctx.save(); ctx.fillStyle = 'rgba(8,5,3,.42)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    const [bx, by] = W2S(cam, 20, 4), qa = spring(t, s.t0 + .15, { freq: 1.5, damp: .7 });
    glow(bx, by, 260, 'rgba(255,200,130,.25)');
    if (qa > 0) { ctx.save(); ctx.globalAlpha = clamp(qa); title('?', bx, by - 60 + Math.sin(t * 2.4) * 4, 230 * clamp(qa, .2, 1.15), { fam: F.cinzel, w: 900, gold: true }); ctx.restore(); }
    mapTac(cam, DIM, .5, t, { dy: 64, ph: 1, a: .7 });
  },
  /* "Yıllar önce Pelekanon'da karşısında savaştığı adam, Orhan." — yıl geri sarılır (1329), Bölüm 4'ün iki oku */
  pelekanon(t, s) {
    const tp = C("p4:Pelekanon'da"), tk = C('p4:karşısında'), tsv = C('p4:savaştığı'), to = C('p4:Orhan');
    const Y = lerp(1344, 1329, eIO(seg(t, s.t0, s.t0 + .9))), cam = ittifakCam(t);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .15 });
    ownCity(cam, 'İznik', Y, { size: 28, a: seg(t, s.t0 + .6, s.t0 + 1.1) * (1 - seg(t, to - .4, to)) });
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 8 });
    // iki ok: imparatorun ordusu (mor) ve Orhan'ın kuvvetleri (kızıl) Pelekanon'da karşı karşıya
    arrow(cam, [[KON[0] + 4, KON[1] + 4], [12, -44], [26, -36], [PEL[0] - 4, PEL[1] - 1]], eIO(seg(t, tp - .2, tk + .5)), 22, BIZC, { col0: '#5a3f78' });
    arrow(cam, [[IZN[0] - 6, IZN[1] - 6], [58, -6], [48, -22], [PEL[0] + 4, PEL[1] + 1]], eIO(seg(t, tk - .1, tsv + .4)), 22, OSMC);
    const [px, py] = W2S(cam, ...PEL), hp = hitPulse(t, tsv + .2, 1.2), ho = hitPulse(t, to, 1.4);
    if (hp > 0) glow(px, py, 240 * hp, 'rgba(255,200,130,.6)');
    mapPin(cam, ...PEL, t, tp - .05, 'PELEKANON', { size: 30, left: true, col: '#5a4a3a' });
    yearTicker(W / 2, 480, Y, 116, { a: seg(t, s.t0, s.t0 + .2) * (1 - seg(t, to - .5, to - .2)) });
    if (ho > 0) { const [ix, iy] = W2S(cam, ...IZN); glow(ix, iy, 360 * ho, 'rgba(255,150,110,.5)'); }
    kinetic('ORHAN', W / 2, 500, 120, t, to - .05, { mode: 'slam', fam: F.cinzel, w: 900, gold: true, spacing: 8 });
  },
  /* "Böylece Osmanlı askerleri ilk kez Avrupa'ya geçti ve Trakya'da Kantakuzenos için savaştı." */
  gecis(t, s) {
    const ta = C("p4:Avrupa'ya"), tg = C('p4:geçti'), tt = C("p4:Trakya'da"), tk = C('p4:Kantakuzenos#2');
    const Y = lerp(1329, 1345.5, eIO(seg(t, s.t0, s.t0 + .9))), cam = ittifakCam(t);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    yearTicker(W / 2, 480, Y, 116, { approx: Y > 1344.5, a: (1 - seg(t, ta - .6, ta - .2)) });
    // Çanakkale Boğazı'nın parlaması: Asya ile Avrupa arasındaki geçit
    glowPath(cam, [LL(26.2, 40.04), LL(26.42, 40.2), [...LAP], [...GEL], LL(26.85, 40.48)], t, eIO(seg(t, ta - .5, ta + .4)), { w: 7, col: '#bfe6ff', a: .7 * (1 - seg(t, tt, tt + .8)) });
    mapLabel(cam, 'ASYA', ...LL(27.55, 40.08), 40, { a: seg(t, ta - .2, ta + .3) });
    mapLabel(cam, 'AVRUPA', ...LL(27.35, 41.22), 46, { a: seg(t, ta, ta + .4) });
    // ilk geçiş (şematik yol; kesin geçiş yeri iddiası yok)
    arrow(cam, [LL(27.3, 40.05), LL(26.95, 40.2), [...LAP], LL(26.62, 40.5), LL(26.7, 40.85), LL(26.62, 41.1)], eIO(seg(t, C('p4:askerleri') - .2, tg + .3)), 22, OSMC);
    const fk = eIO(seg(t, tt - .2, tk + .5));
    arrow(cam, [LL(26.62, 41.1), LL(26.5, 41.22), [DIM[0] + 6, DIM[1] + 12]], fk, 16, OSMC);
    arrow(cam, [LL(26.62, 41.1), LL(26.95, 41.18), LL(27.25, 41.1)], fk, 16, OSMC);
    ownCity(cam, 'Gelibolu', Y, { label: false, r: 7 });
    mapTac(cam, DIM, .55, t, { dy: 66, ph: 1, glow: .5 * hitPulse(t, tk, 1.3) });
    const hp = hitPulse(t, tg, 1.2); if (hp > 0) { const [x, y] = W2S(cam, ...GEL); glow(x, y, 300 * hp, 'rgba(255,190,120,.5)'); }
  },
  /* "Bu ittifakı bir evlilik mühürledi." — iki kordon, bir mühür */
  muhur(t, s) {
    const te = C('p5:evlilik'), tm = C('p5:mühürledi'), z = lerp(1, 1.08, eIO(seg(t, s.t0, s.t1 + .3)));
    ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000);
    ctx.fillStyle = rg(540, 960, 60, 1200, [[0, '#4a3020'], [.55, '#24160c'], [1, '#0a0604']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3; for (let i = 0; i < 18; i++) { const y = 420 + i * 70 + Math.sin(i * 1.7) * 8; ctx.beginPath(); ctx.moveTo(-100, y); ctx.bezierCurveTo(300, y + 14, 700, y - 12, W + 100, y + 6); ctx.stroke(); }
    glow(300, 600, 600, 'rgba(255,170,80,.22)');
    const kk = lerp(.3, 1, eIO(seg(t, s.t0 - .2, te + .2)));
    kordon(-60, 900, 520, 1000, kk, '#5e4a72', 20, t);
    kordon(W + 60, 1110, 560, 1000, kk, '#8a2a22', 20, t);
    if (kk >= 1) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#5e4a72'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(520, 1000); ctx.quadraticCurveTo(560, 960, 590, 1010); ctx.stroke(); ctx.strokeStyle = '#8a2a22'; ctx.beginPath(); ctx.moveTo(560, 1000); ctx.quadraticCurveTo(520, 1046, 490, 990); ctx.stroke(); ctx.restore(); }
    muhurCiz(540, 1000, 96, seg(t, tm - .15, tm + .25));
    const hp = hitPulse(t, tm + .1, 1.1); if (hp > 0) glow(540, 1000, 380 * hp, 'rgba(255,190,140,.4)');
    ctx.restore();
  },
  /* "Bin üç yüz kırk altı yazında Silivri'de" */
  silivri(t, s) {
    const Y = 1346.4, cam = camAt([[s.t0, -36, -50, 4.4], [C("p5:Silivri'de"), -58, -60, 7.6], [s.t1 + .35, -62, -63, 10.5]], t, .004);
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .2 });
    ownCity(cam, 'Konstantinopolis', Y, { size: 28, align: 'right', a: 1 - seg(t, C("p5:Silivri'de") - .2, C("p5:Silivri'de") + .3) });   // sağa yaslı: etiket kenarda kesilmesin
    mapPin(cam, ...SIL, t, s.t0 + .2, 'SİLİVRİ', { date: 'YAZ 1346', size: 34, col: BIZC });
  },
  /* "...perdeler açıldı ve Kantakuzenos'un kızı Theodora kalabalığın karşısına çıktı. Damat törende yoktu;" — KAHRAMAN AN (nötr perde, ahşap sahne) */
  perde(t, s) {
    const ta = C('p5:açıldı'), tth = C('p5:Theodora'), tkl = C('p5:kalabalığın'), tdm = C('p5:Damat'), ty = C('p5:yoktu');
    const op = eIO(seg(t, ta - .15, ta + 1.3)), back = eIO(seg(t, tkl - .3, tkl + 1.4)), pan = eIO(seg(t, tdm - .2, tdm + .9));
    const z = lerp(1.2, 1.0, back) * lerp(1, 1.08, pan) * (1 + .006 * (t - s.t0)), fx = lerp(540, 660, pan), fy = lerp(880, 960, back);
    ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-fx, -fy);
    // gökyüzü: ılık ikindi, nötr
    ctx.fillStyle = lg(0, 0, 0, 1100, [[0, '#5c6678'], [.5, '#a8927c'], [.8, '#d2ae88'], [1, '#c09a78']]); ctx.fillRect(-300, -200, W + 600, 1400);
    // uzakta Silivri surları
    ctx.fillStyle = 'rgba(80,66,60,.55)'; ctx.fillRect(-300, 930, W + 600, 90);
    for (let x = -280; x < W + 300; x += 150) { ctx.fillRect(x, 880, 50, 140); for (let i = 0; i < 3; i++) ctx.fillRect(x - 6 + i * 22, 866, 12, 14); }
    for (let x = -300; x < W + 300; x += 26) ctx.fillRect(x, 920, 14, 10);
    ctx.fillStyle = lg(0, 1000, 0, H, [[0, '#7a6450'], [1, '#2a2018']]); ctx.fillRect(-300, 1010, W + 600, 1200);
    // ahşap sahne
    ctx.fillStyle = '#4a3220'; ctx.fillRect(150, 1060, 780, 26); ctx.fillStyle = '#2e1f14'; ctx.fillRect(170, 1086, 740, 90);
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 3; for (let x = 190; x < 910; x += 60) { ctx.beginPath(); ctx.moveTo(x, 1090); ctx.lineTo(x, 1176); ctx.stroke(); }
    // perde çerçevesi ve arka ışık
    const L0 = 270, R0 = 810, T0 = 560;
    ctx.fillStyle = lg(0, T0, 0, 1060, [[0, 'rgba(255,240,215,.55)'], [1, 'rgba(255,228,190,.25)']]); ctx.fillRect(L0, T0, R0 - L0, 1060 - T0);
    glow(470, 820, 300, 'rgba(255,236,205,.5)', op);
    // gelin (Theodora) ve damadın boş yeri
    kadin(470, 1060, 1.0, { col: '#1c1410', rim: 'rgba(255,236,205,.6)' });
    ctx.fillStyle = '#6e6250'; ctx.beginPath(); ctx.roundRect(612, 1030, 150, 30, 10); ctx.fill(); ctx.fillStyle = '#857862'; ctx.beginPath(); ctx.roundRect(622, 1022, 130, 14, 7); ctx.fill();
    huzme(687, T0 + 10, 30, 687, 1060, 110, 'rgba(255,240,215,.55)', .55 * seg(t, tdm - .1, ty + .2));
    // perdeler: keten, nötr; ortadan iki yana açılır
    const half = (x0, x1, side) => {
      const w = Math.abs(x1 - x0), n = Math.max(4, Math.round(16 - 10 * (w / 270)));
      ctx.fillStyle = '#d6cab0'; ctx.beginPath(); ctx.moveTo(x0, T0); ctx.lineTo(x1, T0);
      for (let i = 0; i <= 10; i++) { const k = i / 10; ctx.lineTo(x1 + Math.sin(t * 1.2 + k * 4) * 3 * side, T0 + k * (1062 - T0)); }
      ctx.lineTo(x0, 1062); ctx.closePath(); ctx.fill();
      for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + .5) / n); ctx.fillStyle = 'rgba(70,56,40,.22)'; ctx.fillRect(x - w / n * .22, T0, w / n * .44, 1062 - T0); ctx.fillStyle = 'rgba(255,250,240,.16)'; ctx.fillRect(x + w / n * .22, T0, w / n * .12, 1062 - T0); }
    };
    half(L0, lerp(540, 312, op), 1); half(R0, lerp(540, 768, op), -1);
    ctx.fillStyle = '#3a2614'; ctx.fillRect(L0 - 24, T0 - 30, R0 - L0 + 48, 34); ctx.fillRect(L0 - 24, T0, 20, 500); ctx.fillRect(R0 + 4, T0, 20, 500);
    // kalabalık (ön plan siluetleri)
    const R = rng(1346);
    for (let i = 0; i < 16; i++) {
      const x = -80 + i * 82 + (R() - .5) * 30, sc = .85 + R() * .4, lift = back * (8 + R() * 10) * Math.max(0, Math.sin(t * 1.3 + i));
      const y = 1240 + (i % 3) * 34 + (R() * 20) - lift;
      ctx.fillStyle = mix('#140e0a', '#24180f', (i % 3) / 3); ctx.beginPath(); ctx.ellipse(x, y + 120 * sc, 70 * sc, 130 * sc, 0, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y - 10 * sc, 30 * sc, 0, TAU); ctx.fill();
      if (i % 4 === 1) { ctx.beginPath(); ctx.ellipse(x, y - 30 * sc, 34 * sc, 16 * sc, 0, 0, TAU); ctx.fill(); }
    }
    ctx.fillStyle = '#0c0806'; ctx.fillRect(-300, 1400, W + 600, 900);
    ctx.restore();
    ad('THEODORA', W / 2, 470, t, tth - .05, tdm - .2, 40, { sp: 10 });
  },
  /* "...gemiler gelini Boğaz'ın öte yakasına, Orhan'a götürdü." */
  gelin(t, s) {
    const Y = 1346.6, cam = marmaraCam(t), to = C("p5:Orhan'a");
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    dotLL(cam, SIL, 'Silivri', { col: BIZC, size: 28, r: 8 });
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 8 });
    gemiKafile(cam, SHIP_SIL, eIO(seg(t, s.t0 + .1, to + .5)), t, { n: 3, gap: .07, flag: OSMC, wake: '#ffe2a8', s: 1.45 });
    mapSancak(cam, [ASY[0] + 3, ASY[1] + 2], .32, t, OSMC, 1, seg(t, to - .1, to + .6));
    const [ax, ay] = W2S(cam, ASY[0] + 3, ASY[1] + 2); ad('ORHAN', ax + 46, ay + 44, t, to + .05, 1e9, 32);
  },
  /* harita sessizliği (2 sn): gemiler kıyıda; rüya ağacının dalları Marmara'yı aşıp Avrupa yakasına uzanır (T18) */
  sessizlik(t, s) {
    const Y = 1346.7, cam = marmaraCam(t), k = seg(t, s.t0, s.t1), tp = C('p5.end+1.0');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    dotLL(cam, SIL, null, { col: BIZC, r: 7 });
    gemiKafile(cam, SHIP_SIL, 1, t, { n: 3, gap: .07, flag: OSMC, wake: '#ffe2a8', s: 1.3, a: 1 - seg(t, s.t0 + .8, s.t1) });
    mapSancak(cam, [ASY[0] + 3, ASY[1] + 2], .32, t, OSMC, 1);
    const [bx, by] = W2S(cam, ...BUR), g = lerp(.5, .97, eOut(seg(t, s.t0 - .1, tp + .9)));
    ctx.save(); ctx.globalAlpha = .78; glow(bx, by - 260, 320, 'rgba(255,214,130,.3)'); miniTree(bx, by, 1.45, g, t, { leaves: g > .9 }); ctx.restore();
    const hp = hitPulse(t, tp, 1.3); if (hp > 0) glow(bx - 120, by - 420, 260 * hp, 'rgba(255,214,130,.5)');
  },
  /* "Ertesi yıl İstanbul'un kapıları Kantakuzenos'a açıldı ve iç savaş onun zaferiyle bitti." */
  kapilar(t, s) {
    const ta = C('p6:açıldı'), tz = C('p6:zaferiyle'), op = eIO(seg(t, ta - .2, ta + 1.4)), z = lerp(1, 1.14, eIO(seg(t, s.t0, s.t1 + .3)));
    ctx.save(); ctx.translate(540, 1080); ctx.scale(z, z); ctx.translate(-540, -1080);
    ctx.fillStyle = lg(0, 0, 0, 1200, [[0, '#1e2438'], [.6, '#5a4a5a'], [1, '#c48a58']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    // sur: taş bloklar, mazgallar, iki kule
    const R = rng(1347); ctx.fillStyle = '#3a3036'; ctx.fillRect(-100, 780, W + 200, 560);
    ctx.strokeStyle = 'rgba(15,10,12,.45)'; ctx.lineWidth = 3; for (let r = 0; r < 9; r++) { const y = 790 + r * 62, off = r % 2 ? 0 : 55; for (let c = -1; c < 11; c++) ctx.strokeRect(off + c * 110 + R() * 6, y, 108, 60); }
    ctx.fillStyle = '#3a3036'; for (let x = -100; x < W + 100; x += 64) ctx.fillRect(x, 750, 38, 34);
    for (const tx of [250, 830]) { ctx.fillStyle = '#463a40'; ctx.fillRect(tx - 110, 620, 220, 720); for (let i = 0; i < 5; i++) ctx.fillRect(tx - 110 + i * 48, 590, 30, 34); ctx.strokeStyle = 'rgba(15,10,12,.4)'; for (let r = 0; r < 11; r++) ctx.strokeRect(tx - 110, 630 + r * 62, 220, 62); mapSancakEkran(tx + 10, 590, .32, t, BIZC); }
    // kapı kemeri: içi ışıkla dolar
    const gx = 540, gw = 150, gTop = 920, gBot = 1340;
    ctx.save(); ctx.beginPath(); ctx.moveTo(gx - gw, gBot); ctx.lineTo(gx - gw, gTop + gw); ctx.arc(gx, gTop + gw, gw, Math.PI, 0); ctx.lineTo(gx + gw, gBot); ctx.closePath(); ctx.clip();
    ctx.fillStyle = lg(0, gTop, 0, gBot, [[0, mix('#20181c', '#fff0d0', op)], [1, mix('#141012', '#ffd9a0', op)]]); ctx.fillRect(gx - gw, gTop, gw * 2, gBot - gTop);
    const lw = gw * (1 - .82 * op);
    for (const sd of [-1, 1]) { const x0 = gx + sd * gw, x1 = x0 - sd * lw; ctx.fillStyle = '#2a1a10'; ctx.fillRect(Math.min(x0, x1), gTop - 20, Math.abs(x1 - x0), gBot - gTop + 20); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 4; for (let i = 1; i < 5; i++) { const x = lerp(x0, x1, i / 5); ctx.beginPath(); ctx.moveTo(x, gTop); ctx.lineTo(x, gBot); ctx.stroke(); } ctx.fillStyle = '#1a1008'; for (const yy of [1020, 1180, 1300]) ctx.fillRect(Math.min(x0, x1), yy, Math.abs(x1 - x0), 12); }
    ctx.restore();
    ctx.strokeStyle = '#241c20'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(gx - gw, gBot); ctx.lineTo(gx - gw, gTop + gw); ctx.arc(gx, gTop + gw, gw, Math.PI, 0); ctx.lineTo(gx + gw, gBot); ctx.stroke();
    huzme(gx, 1180, 120, gx, 1700, 420, 'rgba(255,225,170,.6)', .55 * op);
    ctx.fillStyle = lg(0, 1330, 0, H, [[0, '#2a2026'], [1, '#0a0608']]); ctx.fillRect(-100, 1338, W + 200, 800);
    // iki taç yan yana: kıdemli (büyük) ve genç imparator (küçük)
    const ck = eOut(seg(t, tz - .2, tz + .6));
    if (ck > 0) { glow(540, 700, 300 * ck, 'rgba(255,214,140,.35)'); tac(500, 720 - 10 * Math.sin(t * 2), 1.15 * ck, { a: ck, glow: .4 }); tac(650, 740 - 10 * Math.sin(t * 2 + 1), .62 * ck, { a: ck }); }
    ctx.restore();
    yearTicker(W / 2, 470, 1347, 116, { a: seg(t, s.t0 + .2, s.t0 + .6) * (1 - seg(t, tz - .6, tz - .2)) });
  },
  /* "Kısa süre sonra Theodora, kocasını babasıyla Üsküdar'da buluşturdu;" */
  uskudar(t, s) {
    const Y = 1347.3, tth = C('p6:Theodora'), tko = C('p6:kocasını'), tba = C('p6:babasıyla'), tu = C("p6:Üsküdar'da");
    const cam = camAt([[s.t0, 6, -50, 6.2], [tu, 3, -56, 11.5], [s.t1 + .35, 2, -57, 13.5]], t, .004);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .15 });
    ownCity(cam, 'Konstantinopolis', Y, { size: 26, align: 'right', a: 1 - seg(t, tu - .2, tu + .2) * .5 });
    glowPath(cam, [[30, -44], [18, -52], [8, -56], [...USK]], t, eIO(seg(t, tko - .2, tko + .7)), { w: 6, col: '#ff9a7a' });
    glowPath(cam, [[...KON], [0, -57.6], [...USK]], t, eIO(seg(t, tba - .2, tba + .6)), { w: 6, col: '#d8c0ff' });
    const [ux, uy] = W2S(cam, ...USK), th = eOut(seg(t, tth - .1, tth + .5));
    if (th > 0) { glow(ux, uy, 140 * th * (1 + .15 * Math.sin(t * 4)), 'rgba(255,220,150,.7)'); ctx.save(); ctx.globalAlpha = th; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(ux, uy, 10, 0, TAU); ctx.fill(); ctx.restore(); }
    mapPin(cam, ...USK, t, tu - .05, 'ÜSKÜDAR', { date: '1347', size: 32 });
  },
  /* "Pelekanon'da karşı karşıya gelen iki adam şimdi aynı sofradaydı. Ama barış uzun sürmedi." */
  sofra(t, s) {
    const tk = C('p6:karşı'), ti = C('p6:iki'), ta = C('p6:aynı'), tam = C('p7:Ama'), tsu = C('p7:sürmedi');
    const cool = eIO(seg(t, tam - .1, tsu + .6)), z = lerp(1, 1.07, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.translate(-540, -1050);
    // akşam: arkada Boğaz ve karşı kıyıda kent silueti
    ctx.fillStyle = lg(0, 0, 0, 1000, [[0, mix('#1c1a2c', '#10141e', cool)], [.7, mix('#6a4a4a', '#2a3040', cool)], [1, mix('#c0805a', '#4a4e5a', cool)]]); ctx.fillRect(-100, -100, W + 200, 1200);
    ctx.fillStyle = mix('#2a3444', '#1a2230', cool); ctx.fillRect(-100, 930, W + 200, 90);
    ctx.fillStyle = mix('#241a24', '#141820', cool); ctx.beginPath(); ctx.moveTo(-100, 940); for (let x = -100; x <= W + 100; x += 30) ctx.lineTo(x, 900 - 20 * Math.sin(x * .01) - (x > 300 && x < 760 ? 40 + 26 * Math.sin(x * .05) : 0)); ctx.lineTo(W + 100, 940); ctx.fill();
    ctx.fillStyle = mix('#241a24', '#141820', cool); ctx.beginPath(); ctx.arc(540, 852, 54, Math.PI, 0); ctx.fill();
    for (let i = 0; i < 9; i++) fener(330 + i * 50, 915 + Math.sin(i) * 6, (.4 + .2 * Math.sin(t * 2 + i)) * (1 - cool), 3);
    // yer: kilim, sini
    ctx.fillStyle = mix('#3a2418', '#1e1a1e', cool); ctx.fillRect(-100, 1010, W + 200, 900);
    ctx.fillStyle = mix('#6a2a20', '#2e2428', cool); ctx.beginPath(); ctx.ellipse(540, 1200, 430, 92, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = mix('#c8a060', '#4a4448', cool); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(540, 1200, 400, 80, 0, 0, TAU); ctx.stroke();
    // Theodora: arkada, ortada (gelin silueti)
    kadin(540, 1110, .62, { col: mix('#150e0c', '#0c0c12', cool), rim: `rgba(255,200,140,${.45 * (1 - cool)})` });
    // sini ve mum
    ctx.fillStyle = mix('#b0884a', '#4a4650', cool); ctx.beginPath(); ctx.ellipse(540, 1176, 140, 30, 0, 0, TAU); ctx.fill(); ctx.fillStyle = mix('#5a3a1a', '#26242a', cool); ctx.fillRect(470, 1176, 140, 40);
    for (const bx of [490, 590]) { ctx.fillStyle = mix('#6a4a2a', '#2a282e', cool); ctx.beginPath(); ctx.ellipse(bx, 1166, 26, 9, 0, 0, TAU); ctx.fill(); }
    const cand = seg(t, ta - .2, ta + .4) * (1 - seg(t, tsu - .1, tsu + .3));
    candle(540, 1168, .7, t, cand, 4);
    // iki adam: solda Kantakuzenos (Bizans şapkası), sağda Orhan (sarık)
    const lit = eOut(seg(t, ti - .3, ti + .6)), rim = `rgba(255,190,120,${.6 * lit * (1 - cool)})`;
    oturan(260, 1200, .95, { hat: 'skiadion', beard: true, rim, col: '#0c0810' });
    oturan(820, 1200, .95, { hat: 'sarik', beard: true, flip: true, rim, col: '#0c0810' });
    // sofrada yan yana iki sancak; barış bozulunca ayrılır
    const pa = seg(t, ta - .1, ta + .5), tilt = .32 * eIO(seg(t, tsu - .2, tsu + .8));
    if (pa > 0) for (const [dx, col, sd] of [[-34, BIZC, -1], [34, OSMC, 1]]) { ctx.save(); ctx.globalAlpha = pa; ctx.translate(540 + dx, 1050); ctx.rotate(sd * tilt); pennant(0, 0, .42, t, { col: mix(col, '#3a3a44', cool * .6) }); ctx.restore(); }
    ctx.restore();
    // Pelekanon'un iki oku: karşı karşıya gelir, sonra söner (Bölüm 4 ve bu bölümün 10. sahnesi)
    const ak = eIO(seg(t, s.t0, tk + .3)), af = 1 - seg(t, ti - .2, ti + .5);
    if (af > 0) {
      ctx.save(); ctx.globalAlpha = af;
      arrow(ID, [[90, 640], [300, 610], [lerp(300, 510, ak), lerp(610, 640, ak)]], ak, 26, BIZC, { col0: '#5a3f78' });
      arrow(ID, [[990, 640], [780, 610], [lerp(780, 570, ak), lerp(610, 640, ak)]], ak, 26, OSMC);
      const hp = hitPulse(t, tk + .2, 1.1); if (hp > 0) glow(540, 640, 220 * hp, 'rgba(255,200,130,.6)');
      ctx.restore();
    }
    ad('KANTAKUZENOS', 280, 1262, t, ti, tam - .2, 26);
    ad('ORHAN', 800, 1262, t, ti + .1, tam - .2, 26);
    geceTon(.35 * cool, '#5a6a90');
  },
  /* "Bin üç yüz elli ikide genç imparator Sırpların desteğiyle yeniden silaha sarılınca Kantakuzenos yine damadından yardım istedi." */
  yeniden(t, s) {
    const Y = 1352.5, cam = cam52(t), tg = C('p7:genç'), tsr = C('p7:Sırpların'), tsl = C('p7:silaha'), tk = C('p7:Kantakuzenos'), tdm = C('p7:damadından');
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .2 });
    yearTicker(W / 2, 480, 1352, 116, { a: seg(t, s.t0 + .2, s.t0 + .6) * (1 - seg(t, tsr - .4, tsr)) });
    const JV = LL(26.05, 41.55);
    mapTac(cam, JV, .5, t, { dy: 66, a: seg(t, tg - .2, tg + .4) });
    mapLabel(cam, 'V. İOANNES', JV[0], JV[1] + 22, 26, { a: seg(t, tg, tg + .4) * (1 - seg(t, tk - .4, tk)), sp: 3 });
    mapLabel(cam, 'SIRPLAR', ...LL(22.7, 41.25), 46, { a: seg(t, tsr - .1, tsr + .4), col: '#16243a' });
    const ak = eIO(seg(t, tsr, tsl + .5));
    arrow(cam, [LL(22.9, 41.05), LL(23.9, 41.12), LL(24.9, 41.3), [JV[0] - 14, JV[1] + 2]], ak, 22, SRPC, { col0: '#2a4060' });
    arrow(cam, [LL(23.3, 41.75), LL(24.4, 41.85), LL(25.4, 41.75), [JV[0] - 12, JV[1] - 6]], eIO(seg(t, tsr + .3, tsl + .8)), 18, SRPC, { col0: '#2a4060' });
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 8 });
    mapTac(cam, KON, .7, t, { dy: 80, ph: 1, a: seg(t, tk - .3, tk + .3), glow: .5 * hitPulse(t, tk, 1.2) });
    // yine damada: altın çağrı çizgisi Konstantinopolis'ten Bursa'ya (Orhan)
    glowPath(cam, [[...KON], [14, -30], [12, 0], [...BUR]], t, eIO(seg(t, tdm - .2, tdm + .9)), { w: 6, col: '#ffcf6a', dash: true });
    ownCity(cam, 'Bursa', Y, { label: false, r: 8, a: seg(t, tdm - .3, tdm) });
    const [bx, by] = W2S(cam, ...BUR); ad('ORHAN', bx, by + 48, t, tdm + .5, 1e9, 30);
  },
  /* "Bu kez Orhan'ın oğlu Süleyman geldi" */
  suleyman(t, s) {
    const Y = 1352.8, cam = cam52(t), ts = C('p7:Süleyman'), tg = C('p7:geldi');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    const JV = LL(26.05, 41.55);
    mapTac(cam, JV, .5, t, { dy: 66, a: .85 });
    arrow(cam, [LL(23.9, 41.12), LL(24.9, 41.3), [JV[0] - 14, JV[1] + 2]], 1, 20, SRPC, { col0: '#2a4060' });
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 8 });
    mapTac(cam, KON, .62, t, { dy: 80, ph: 1, a: 1 - seg(t, ts, ts + .6) });
    glowPath(cam, [[...KON], [14, -30], [12, 0], [...BUR]], t, 1, { w: 6, col: '#ffcf6a', dash: true, a: 1 - seg(t, s.t0, s.t0 + .8) });
    ownCity(cam, 'Bursa', Y, { label: false, r: 8 });
    // Süleyman'ın kuvveti Trakya'ya (şematik yol)
    arrow(cam, [[...BUR], LL(28.2, 40.2), LL(27.2, 40.15), [...LAP], LL(26.6, 40.6), LL(26.5, 41.0), [DIM[0] + 8, DIM[1] + 16]], eIO(seg(t, ts - .4, tg + .7)), 24, OSMC);
    mapLabel(cam, 'SÜLEYMAN', ...LL(27.6, 40.42), 40, { a: seg(t, ts - .1, ts + .4), col: '#3a0e0a' });
    ownCity(cam, 'Dimetoka', Y, { size: 28, a: seg(t, tg, tg + .4) });
  },
  /* "...ve Osmanlı süvarileri Dimetoka yakınlarında Sırp ordusunu dağıttı." */
  suvari(t, s) {
    const td = C('p7:dağıttı'), el = t - s.t0, [hx, hy] = handheld(t, 3), z = 1.03 + .02 * el;
    ctx.save(); ctx.translate(540 + hx, 1100 + hy); ctx.scale(z, z); ctx.translate(-540, -1100);
    ctx.fillStyle = lg(0, 0, 0, 1250, [[0, '#2a2a3a'], [.55, '#7a6050'], [.85, '#c8986a'], [1, '#d8aa78']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    glow(820, 1060, 520, 'rgba(255,200,130,.35)');
    ctx.fillStyle = '#4a3a30'; ctx.beginPath(); ctx.moveTo(-100, 1150); for (let x = -100; x <= W + 100; x += 40) ctx.lineTo(x, 1110 - 24 * Math.sin(x * .004 + 2)); ctx.lineTo(W + 100, 1250); ctx.lineTo(-100, 1250); ctx.fill();
    ctx.fillStyle = lg(0, 1180, 0, H, [[0, '#3a2c22'], [1, '#0e0a08']]); ctx.fillRect(-100, 1180, W + 200, 900);
    // Sırp hattı (sağda): mızraklı siluetler ve çelik mavisi düz sancaklar; "dağıttı"da devrilir, dağılır
    const sc = eOut(seg(t, td - .1, td + 1.0)), R = rng(1352);
    for (let i = 0; i < 9; i++) {
      const x0 = 640 + i * 52 + (R() - .5) * 20, y0 = 1250 + (i % 3) * 16, dx = sc * (120 + R() * 220), ang = sc * (R() - .3) * 1.2;
      ctx.save(); ctx.globalAlpha = 1 - .6 * sc; ctx.translate(x0 + dx, y0); ctx.rotate(ang); ctx.fillStyle = '#16120e'; ctx.fillRect(-14, -120, 28, 120); ctx.beginPath(); ctx.arc(0, -134, 15, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#16120e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-20, -40); ctx.lineTo(-30, -250); ctx.stroke(); ctx.restore();
    }
    for (let i = 0; i < 3; i++) { ctx.save(); ctx.globalAlpha = 1 - .5 * sc; ctx.translate(700 + i * 120 + sc * (90 + i * 60), 1250); ctx.rotate(sc * (.9 + i * .25)); pennant(0, 0, .5, t, { col: SRPC }); ctx.restore(); }
    // Osmanlı süvarileri soldan
    const ck = eIO(seg(t, s.t0 - .4, td + .2));
    for (let j = 0; j < 5; j++) { const x = lerp(-420 - j * 170, 520 - j * 120, ck) + (t > td ? (t - td) * 160 : 0), y = 1290 + (j % 2) * 30; rider(x, y, 1.15 - (j % 3) * .08, t, { speed: 2.6, ph: j * .31, sil: '#0c0806', flag: j === 0 ? OSMC : null }); }
    const hp = hitPulse(t, td, 1.3); if (hp > 0) { glow(640, 1150, 520 * hp, 'rgba(255,210,150,.5)'); }
    smokeLayer(t, .55 * seg(t, td - .2, td + .8), '#8a7058', 9);
    ctx.restore();
    ad('DİMETOKA · 1352', W / 2, 470, t, s.t0 + .25, 1e9, 34, { sp: 8 });
  },
  /* "Savaştan sonra Süleyman'ın askerlerinden bir kısmı kışı geçirmek için Gelibolu'nun kuzeyindeki küçük Çimpe kalesinde kaldı." */
  cimpe(t, s) {
    const Y = 1352.9, cam = gelCam(t), ta = C('p8:askerlerinden'), tki = C('p8:kışı'), tg = C("p8:Gelibolu'nun"), tc = C('p8:Çimpe');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    kisTon(seg(t, tki - .3, tki + .9));
    ownCity(cam, 'Dimetoka', Y, { size: 26, a: 1 - seg(t, tg - .6, tg) });
    // askerlerin bir kısmı yarımadaya iner
    const mk = eIO(seg(t, ta - .2, tg + .2));
    for (let i = 0; i < 5; i++) { const k = clamp(mk - i * .06), p = [lerp(DIM[0] + 6 + i * 3, CIM[0] - 2 + i * .8, k), lerp(DIM[1] + 14, CIM[1] - 3 + (i % 2) * 2, k)]; dotLL(cam, p, null, { r: 6, a: seg(t, ta - .3, ta) }); }
    ownCity(cam, 'Gelibolu', Y, { size: 30, a: seg(t, tg - .1, tg + .4), text: 'GELİBOLU' });
    if (t > tc - .1) { mapSancak(cam, [CIM[0] + .4, CIM[1] - .4], .26, t, OSMC, 1, seg(t, tc + .2, tc + .8)); }
    mapPin(cam, ...CIM, t, tc - .05, 'ÇİMPE', { left: true, size: 34 });
    ctx.save(); ctx.globalAlpha = .7; kar(t, seg(t, tki - .2, tki + .8)); ctx.restore();
  },
  /* "Kısa sürede kaleye aileleri de geldi." — kış kampı */
  kis(t, s) {
    const tai = C('p8:aileleri'), el = t - s.t0, z = 1 + .03 * el;
    ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.translate(-540, -1050);
    ctx.fillStyle = lg(0, 0, 0, 1100, [[0, '#1a2232'], [.6, '#4a5468'], [1, '#8a8e9a']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.fillStyle = '#34404e'; ctx.fillRect(-100, 960, W + 200, 80);
    ctx.strokeStyle = 'rgba(220,230,240,.18)'; ctx.lineWidth = 2; for (let i = 0; i < 10; i++) { const x = ((i * 113 + t * 18) % 1250) - 80; ctx.beginPath(); ctx.moveTo(x, 975 + (i % 4) * 16); ctx.lineTo(x + 60, 975 + (i % 4) * 16); ctx.stroke(); }
    // kıyı tepesinde küçük kale
    ctx.fillStyle = '#9aa2ae'; ctx.beginPath(); ctx.moveTo(380, 1060); ctx.quadraticCurveTo(620, 900, 900, 1000); ctx.lineTo(1180, 1060); ctx.fill();
    castle(700, 960, .5, '#1a1e28');
    // karlı zemin
    ctx.fillStyle = lg(0, 1040, 0, H, [[0, '#c4cad4'], [.4, '#8a909c'], [1, '#2a2e36']]); ctx.fillRect(-100, 1040, W + 200, 900);
    // çadırlar, ocak dumanı
    tent(250, 1150, .5, t, { sil: '#1c2028', door: 'rgba(255,170,80,.85)' });
    tent(520, 1110, .38, t, { sil: '#1c2028', door: 'rgba(255,170,80,.8)' });
    tent(860, 1160, .46, t, { sil: '#1c2028', door: 'rgba(255,170,80,.85)' });
    for (const [x, y] of [[390, 1200], [700, 1190]]) { glow(x, y, 120, 'rgba(255,150,70,.5)'); ctx.fillStyle = '#ffb060'; ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.quadraticCurveTo(x, y - 40 - 6 * Math.sin(t * 9), x + 14, y); ctx.fill(); }
    // gelen aileler (soldan yol boyunca)
    const ak = eOut(seg(t, tai - .5, s.t1 + .4));
    for (let i = 0; i < 3; i++) { const x = lerp(-260 - i * 190, 150 - i * 150, ak), y = 1290 + i * 22; if (x > -200) aile(x, y, .9 - i * .08, t, { ph: i * .4, sil: '#12161e' }); }
    kar(t, .85);
    ctx.restore();
  },
  /* "Kantakuzenos onları kendisi çağırmıştı; şimdi gitmelerini istiyordu." */
  istek(t, s) {
    const Y = 1353.3, cam = sonCam(t), tk = C('p8:Kantakuzenos'), tc = C('p8:çağırmıştı'), tgi = C('p8:gitmelerini'), tis = C('p8:istiyordu');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    kisTon(1);
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 8 }); ownCity(cam, 'Gelibolu', Y, { label: false, r: 7 });
    mapTac(cam, KON, .72, t, { dy: 82, ph: 1, glow: .5 * hitPulse(t, tk, 1.3) });
    // çağrının altın izi: başkentten Anadolu'ya, oradan Çimpe'ye (müttefik çağrısı)
    glowPath(cam, [[...KON], [12, -20], [-60, 10], [-150, 20], [...LAP], [...CIM]], t, eIO(seg(t, tc - .3, tc + .9)), { w: 5, col: '#ffcf6a', dash: true, a: 1 - .5 * seg(t, tgi, tgi + .5) });
    // "gidin": mor kesik ok Çimpe'den Asya'ya doğru uzanır ama yarıda söner
    const gk = eIO(seg(t, tgi - .1, tis + .5));
    ctx.save(); ctx.globalAlpha = .85 * (1 - .6 * seg(t, tis + .4, s.t1)); ctx.setLineDash([]); arrow(cam, [[CIM[0] + 4, CIM[1] + 2], [-180, 24], [-172, 40]], gk * .8, 16, BIZC, { col0: '#5a3f78' }); ctx.restore();
    mapSancak(cam, [CIM[0] + .4, CIM[1] - .4], .26, t, OSMC, 1);
    dotLL(cam, CIM, null, { r: 7 });
    const [cx, cy] = W2S(cam, ...CIM); ad('ÇİMPE', cx - 70, cy + 40, t, s.t0 + .2, 1e9, 26);
  },
  /* "Ama bir gece yer sarsılacak ve bu soruyu bir daha kimse sormayacaktı." — önsezi: hafif titreşim, kılcal çatlak */
  sarsinti(t, s) {
    const Y = 1353.6, cam = sonCam(t), tsa = C('p8:sarsılacak'), tend = C('p8.end');
    const tr = seg(t, tsa - .05, tsa + .1) * (1 - seg(t, tsa + .6, tsa + 1.6)), jx = tr * 4 * Math.sin(t * 61), jy = tr * 3 * Math.sin(t * 47 + 1);
    ctx.save(); ctx.translate(jx, jy);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    kisTon(1 - seg(t, s.t0, s.t0 + 1));
    geceTon(.66 * eIO(seg(t, s.t0, s.t0 + 1.2)), '#2a3a68');
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 8, a: 1 - seg(t, s.t0, s.t0 + 1) });
    ownCity(cam, 'Gelibolu', Y, { size: 30, text: 'GELİBOLU', a: seg(t, s.t0 + .6, s.t0 + 1.2) * (1 - seg(t, tend + .3, tend + .8)) });
    mapSancak(cam, [CIM[0] + .4, CIM[1] - .4], .26, t, OSMC, 1);
    dotLL(cam, CIM, null, { r: 7 });
    // kılcal çatlak: yarımadanın üstünden geçer (deprem Bölüm 6'da)
    const [gx, gy] = W2S(cam, GEL[0] + 3, GEL[1] - 5);
    ctx.save(); ctx.globalAlpha = .9; cracks(gx, gy, .32 * eOut(seg(t, tsa, tsa + 1.0)), 54, { n: 4, len: 520 }); ctx.restore();
    const hp = hitPulse(t, tsa, 1.6); if (hp > 0) glow(gx, gy, 300 * hp, 'rgba(255,170,110,.35)');
    ctx.restore();
    // toz: yukarıdan süzülen ince parçacıklar (titreşimden sonra)
    const da = seg(t, tsa, tsa + .4) * (1 - seg(t, tsa + 2.5, tsa + 4)); if (da > 0) { const R = rng(54); ctx.save(); ctx.fillStyle = 'rgba(220,200,170,.55)'; for (let i = 0; i < 40; i++) { const x = R() * W, y = ((R() * 700 + (t - tsa) * (60 + R() * 80)) % 1300) + 300; ctx.globalAlpha = da * (.3 + .4 * R()); ctx.beginPath(); ctx.arc(x, y, 1.5 + R() * 2, 0, TAU); ctx.fill(); } ctx.restore(); }
  },
};
// kule sancağı (ekran koordinatı)
function mapSancakEkran(x, y, s, t, col) { pennant(x, y, s, t, { col }); }
