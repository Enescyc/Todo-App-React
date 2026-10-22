/* Sezon 1 · Fragman sahneleri: Uçtaki Beylik (sezon montajı). Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js
 * Her cümle sezondan bir an. Haritalı sahneler aynı zaman haritasında birbirine bağlanır (kamera bir sahnenin son karesinden devam eder);
 * yıl sayacı ve "ileri bakış" şeridi 1300 → 1402 akar (metnin "-ecekti" kipinin görsel karşılığı).
 * Sezon ipliği (ANLATICI-DILI §9): rüya ağacı Söğüt'te filiz → dalları haritaya yayılır → zirvede tam → Ankara'da kurur → tek filiz kalır.
 * Portre yok: Osman atlı siluet ve düz kırmızı sancak, sultan tuğ, gelin gemi, şövalyeler ok. Ay-yıldız yok; gökte ay da çizilmez.
 * Bölüme özel çizimler: yilHUD, dallar, agac, etiket, gemi, surKapi, gelibolu, soguk. Konumlar ve olgular: FACTS.md. */
'use strict';
const C = cue;
const camAt = (keys, t, creep = .006) => camPath(keys, t, { creep });   // monoton kübik + log-zoom + sürekli hafif itme
const OSMC = '#a8322a', BIZC = '#7a5a9a', TIMC = '#3e4a3c', HACC = '#5f7fa0', ASH = '#7d746a';
const T0 = id => SCN.find(x => x.id === id).t0, T1 = id => SCN.find(x => x.id === id).t1;
// harita noktaları (km). Silivri, Lapseki, Malatya: koordinat (shared/data şehir listesinde yok; FACTS C)
const P = {
  SOG: CITY['Söğüt'], BAF: CITY['Bafeus'], BUR: CITY['Bursa'], IZM: CITY['İzmit'], KON: CITY['Konstantinopolis'],
  SIL: LL(28.25, 41.07), LAP: LL(26.69, 40.34), GEL: CITY['Gelibolu'], BOL: CITY['Bolayır'], EDI: CITY['Edirne'],
  KOS: CITY['Kosova'], NIG: CITY['Niğbolu'], TIR: CITY['Tırnova'], VID: CITY['Vidin'], SOF: CITY['Sofya'], SEL: CITY['Selanik'],
  ANK: CITY['Ankara'], CUB: CITY['Çubuk Ovası'], AMA: CITY['Amasya'], KNY: CITY['Konya'], SIV: CITY['Sivas'], KAY: CITY['Kayseri'],
  MAL: LL(38.31, 38.35),
};

/* ---------- yıl sayacı: tek zaman ekseni (bütün sahneler aynı yılı okur) ---------- */
const YIL = (() => {
  const k = [['p2:yüz', 1300], ['p2:yenecek', 1302], ['p2:kuşattığı', 1302.6], ['p2:teslim', 1326], ['p2:teslim+0.8', 1326.6], ['p3:kızını', 1346], ['p3:evlendirecekti+0.4', 1346.6],
    ['p3:deprem', 1354], ['p3:yıkacak+0.3', 1354.1], ['p3:Osmanlılar', 1354.15], ["p3:Avrupa'ya+0.2", 1354.8], ['p3:yerleşecekti+0.4', 1361],
    ['p4:savaş', 1389], ['p4:kaybedecekti+0.5', 1389.6], ['p4:bozguna', 1396], ['p4:bozguna+0.6', 1396.6], ['p4:uzanacaktı', 1400],
    ['p5:bin', 1400.6], ['p5:yazında', 1402], ['p5:değişecekti', 1402.45]].map(([c, y]) => [C(c), y]);
  for (let i = 1; i < k.length; i++) if (k[i][0] <= k[i - 1][0]) k[i][0] = k[i - 1][0] + .05;   // gerçek seste de artan kalsın
  return { ts: k.map(x => x[0]), ys: k.map(x => x[1]) };
})();
const yilAt = t => mono(YIL.ts, YIL.ys, t);
const YIL_IZ = [1302, 1326, 1346, 1354, 1389, 1396, 1402];   // şeritteki olay işaretleri (FACTS B)
function yilHUD(t, a = 1) {
  if (a <= 0) return;
  const Y = yilAt(t);
  yearTicker(W / 2, 452, Y, 104, { approx: t < C('p2:yüz') - .05, a });
  const x0 = 250, x1 = 830, yb = 536, X = yr => lerp(x0, x1, (yr - 1300) / 102), xk = X(Math.min(Y, 1402));
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(16,10,5,.6)'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,240,210,.32)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(xk, yb); ctx.stroke();
  for (const yr of YIL_IZ) {
    const on = Y >= yr - .02, x = X(yr), sc = on ? 1 + .5 * clamp(1 - (Y - yr) / 1.5) : .8;
    ctx.save(); ctx.translate(x, yb); ctx.rotate(Math.PI / 4); ctx.scale(sc, sc);
    ctx.fillStyle = on ? GOLD : 'rgba(255,240,210,.35)'; ctx.strokeStyle = 'rgba(16,10,5,.9)'; ctx.lineWidth = 2.5; ctx.fillRect(-6, -6, 12, 12); ctx.strokeRect(-6, -6, 12, 12); ctx.restore();
  }
  ctx.restore();
  glow(xk, yb, 34, 'rgba(255,214,130,.9)', a);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(xk, yb, 5, 0, TAU); ctx.fill(); ctx.restore();
}

/* ---------- harita yardımcıları ---------- */
// soğuma: renk solar, mavi-gri ton (Ankara ve sonrası)
function soguk(a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = clamp(.6 * a); ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = clamp(.5 * a); ctx.fillStyle = '#a6b4c6'; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function harita(t, cam, Y, o = {}) {
  const S = drawTimeMap(t, cam, Y, { focus: 'OSM', dim: o.dim ?? .35, riverA: .55, after: o.after });
  soguk(o.cool || 0);
  return S;
}
// iğnesiz etiket (filiz ya da nokta işaretin kendisi): altın Cinzel kutu
function etiket(cam, p, s, t, t0, o = {}) {
  const k = eBack(seg(t, t0, t0 + .35)); if (k <= 0) return;
  const [x, y] = W2S(cam, ...p);
  ctx.save(); ctx.globalAlpha = clamp(k) * (o.a ?? 1); setFont(o.size || 34, F.cinzel, 900); ctx.letterSpacing = '3px';
  const w = ctx.measureText(s).width + 40, bx = o.left ? x - 30 - w : x + 30, by = y + (o.dy ?? -28), sc = lerp(.7, 1, clamp(k));
  ctx.translate(bx + w / 2, by); ctx.scale(sc, sc); ctx.translate(-(bx + w / 2), -by);
  ctx.fillStyle = 'rgba(14,9,5,.84)'; ctx.beginPath(); ctx.roundRect(bx, by - 29, w, 58, 10); ctx.fill(); ctx.strokeStyle = rgba(GOLD, .75); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = GOLD; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, bx + 20, by + 2);
  ctx.restore();
}
// harita üstünde kalın yer adı (ekranın güvenli bölgesine sıkıştırılır)
function bolgeAdi(cam, s, p, t, t0, size, o = {}) {
  const [x, y] = W2S(cam, ...p); setFont(size, F.cinzel, 900); ctx.letterSpacing = '6px'; const hw = ctx.measureText(s).width / 2 + 40; ctx.letterSpacing = '0px';
  kinetic(s, clamp(x, hw, W - 150 - hw), clamp(y, 640, 1240), size, t, t0, { mode: 'slam', fam: F.cinzel, w: 900, col: '#fff7e6', spacing: 6 });
}

/* ---------- sezon ağacı: Söğüt'ten haritaya yayılan dallar (simgesel; fetih yolu değil, FACTS B) ---------- */
const DAL = [
  ['SOG', 'BAF', "p2:Bizans'ın", 'p2:yenecek+0.3', 1, 1], ['SOG', 'BUR', 'p2:kuşattığı', 'p2:teslim+0.3', 1, -1],
  ['BUR', 'SIL', 'p3:kızını-0.2', 'p3:evlendirecekti+0.4', .8, 1], ['BUR', 'GEL', 'p3:Osmanlılar-0.3', "p3:Avrupa'ya", .9, -1],
  ['GEL', 'EDI', "p3:Avrupa'ya-0.1", 'p3:yerleşecekti+0.4', .85, 1],
  ['EDI', 'KOS', 'p4-0.1', 'p4:savaş+0.3', .75, -1], ['EDI', 'SOF', 'p4:savaş', 'p4:meydanında+0.3', .45, 1], ['EDI', 'SEL', 'p4:savaş+0.2', 'p4:hayatını+0.2', .45, -1],
  ['EDI', 'NIG', 'p4:şövalyeleri-0.2', 'p4:bozguna+0.3', .75, 1],
  ['SOG', 'ANK', 'p4:devletin-0.2', "p4:Balkanlar'dan+0.2", .9, 1], ['ANK', 'AMA', "p4:Balkanlar'dan", "p4:Fırat'a", .5, -1],
  ['ANK', 'KNY', "p4:Balkanlar'dan+0.2", "p4:Fırat'a+0.2", .5, 1], ['ANK', 'MAL', "p4:Fırat'a-0.3", 'p4:uzanacaktı+0.4', .75, -1],
].map(([a, b, c0, c1, w, sg], i) => {
  const A = P[a], B = P[b], dx = B[0] - A[0], dy = B[1] - A[1];
  return { A, B, t0: C(c0), t1: C(c1), w, i, c: [(A[0] + B[0]) / 2 - dy * .17 * sg, (A[1] + B[1]) / 2 + dx * .17 * sg] };
});
function dallar(cam, t, o = {}) {
  const w = o.wither || 0, A = o.a ?? 1, col = mix(GOLD, ASH, w);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const d of DAL) {
    const k = eIO(seg(t, d.t0, d.t1)); if (k <= 0) continue;
    const n = Math.max(2, Math.ceil(22 * k) + 1), pts = [];
    for (let j = 0; j < n; j++) { const u = k * j / (n - 1), v = 1 - u; pts.push(W2S(cam, v * v * d.A[0] + 2 * v * u * d.c[0] + u * u * d.B[0], v * v * d.A[1] + 2 * v * u * d.c[1] + u * u * d.B[1])); }
    ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = A * .3 * (1 - .8 * w); ctx.strokeStyle = col; ctx.lineWidth = 18 * d.w; tracePath(pts); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    for (const pass of [0, 1]) for (let j = 1; j < n; j++) {
      const lw = lerp(8, 2.6, k * j / (n - 1)) * d.w;
      ctx.globalAlpha = A * (pass ? 1 - .25 * w : .7); ctx.strokeStyle = pass ? col : 'rgba(40,24,8,.8)'; ctx.lineWidth = pass ? lw : lw + 3.5;
      ctx.beginPath(); ctx.moveTo(...pts[j - 1]); ctx.lineTo(...pts[j]); ctx.stroke();
    }
    const [tx, ty] = pts[n - 1];
    if (k < .98) { ctx.globalAlpha = A; glow(tx, ty, 26, 'rgba(255,220,140,.9)'); }
    else {   // yapraklar: dal tamamlanınca; kurudukça düşer
      const R = rng(31 + d.i * 7);
      for (let l = 0; l < 4; l++) {
        const ox = (R() - .5) * 28, oy = (R() - .5) * 22, sp = .6 + R() * .8, fall = w * w * 260 * sp;
        ctx.globalAlpha = A * (1 - w) * (.6 + .3 * Math.sin(t * 2.4 + l + d.i));
        ctx.fillStyle = mix('#ffd98a', ASH, w); ctx.beginPath(); ctx.arc(tx + ox + Math.sin(t * 2 + l) * 12 * w, ty + oy + fall, 4.6, 0, TAU); ctx.fill();
      }
    }
  }
  ctx.restore();
}
// Söğüt'teki ağaç: büyüme sezon boyunca, kuruma Ankara'da
const AGAC = (() => { const k = [['p1', .15], ['p2:yüz', .19], ['p2:teslim', .32], ['p3:yerleşecekti', .48], ['p4:bozguna', .7], ['p4:uzanacaktı', 1]].map(([c, g]) => [C(c), g]);
  for (let i = 1; i < k.length; i++) if (k[i][0] <= k[i - 1][0]) k[i][0] = k[i - 1][0] + .05; return { ts: k.map(x => x[0]), gs: k.map(x => x[1]) }; })();
const agacG = t => mono(AGAC.ts, AGAC.gs, t);
const YAPRAK = (() => { const R = rng(1402); return Array.from({ length: 18 }, () => [(R() - .5) * 320, -170 - R() * 190, R() * TAU, .5 + R()]); })();
function agac(cam, t, o = {}) {
  const [x, y] = W2S(cam, ...P.SOG), w = o.wither || 0, g = o.g ?? agacG(t), s = (o.s ?? 1) * (.4 + .38 * g);
  if (w < 1) glow(x, y - 110 * s, 240 * s + 70, 'rgba(255,214,130,.42)', 1 - w);
  miniTree(x, y, s, g, t, { col: w > 0 ? mix(GOLD, ASH, w) : GOLD, leaves: w <= 0 });
  if (w > 0 && w < 1 && g > .85) { ctx.save(); ctx.fillStyle = '#ffd98a';
    for (const [lx, ly, ph, sp] of YAPRAK) { ctx.globalAlpha = (1 - w) * .7; ctx.beginPath(); ctx.arc(x + lx * s + Math.sin(t * 2 + ph) * 14 * w, y + ly * s + w * w * 340 * sp, 4, 0, TAU); ctx.fill(); }
    ctx.restore(); }
}

/* ---------- gelin gemisi: tek direkli, latin yelkenli, kıçta köşk (sayı iddiası yok) ---------- */
function gemi(x, y, s, t) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2.3) * 2.2); ctx.scale(s, s); ctx.rotate(Math.sin(t * 1.7) * .03);
  glow(-46, -26, 70, 'rgba(255,190,100,.6)');
  ctx.strokeStyle = '#1a0f08'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const x0 = -30 + i * 13, sw = Math.sin(t * 3.2 + i * .4) * 5; ctx.beginPath(); ctx.moveTo(x0, 6); ctx.lineTo(x0 - 9 + sw, 26); ctx.stroke(); }
  ctx.fillStyle = '#2a170c'; ctx.strokeStyle = 'rgba(255,236,200,.8)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-72, -12); ctx.quadraticCurveTo(-62, 14, -30, 16); ctx.lineTo(44, 16); ctx.quadraticCurveTo(70, 10, 84, -16); ctx.lineTo(70, -6); ctx.lineTo(-60, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#1a0f08'; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(8, -6); ctx.lineTo(8, -98); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-40, -30); ctx.lineTo(56, -112); ctx.stroke();
  ctx.fillStyle = '#efe3c6'; ctx.strokeStyle = 'rgba(40,24,8,.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-36, -33); ctx.quadraticCurveTo(14, -44, 53, -108); ctx.lineTo(10, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#8a2a20'; ctx.beginPath(); ctx.roundRect(-60, -32, 30, 26, 4); ctx.fill(); ctx.fillStyle = GOLD; ctx.fillRect(-62, -35, 34, 5);
  ctx.restore();
}

/* ---------- Bursa: sur, iki kule ve açılan kapı (op 0..1) ---------- */
const SUR = { top: 870, base: 1345, gx0: 432, gx1: 648, gTop: 1080, gR: 108 };
function surKapi(t, op) {
  const { top, base, gx0, gx1, gTop, gR } = SUR;
  const arch = () => { ctx.beginPath(); ctx.moveTo(gx0, base); ctx.lineTo(gx0, gTop); ctx.arc(540, gTop, gR, Math.PI, 0); ctx.lineTo(gx1, base); ctx.closePath(); };
  // duvar ve kuleler (şafağa karşı koyu)
  ctx.fillStyle = '#2b2019'; ctx.fillRect(-80, top, W + 160, base - top);
  for (let x = -60; x < W + 60; x += 66) ctx.fillRect(x, top - 34, 40, 36);
  for (const tx of [250, 830]) { ctx.fillRect(tx - 98, 730, 196, base - 730); for (let i = 0; i < 4; i++) ctx.fillRect(tx - 98 + i * 52, 698, 36, 34); }
  ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 2; const R = rng(1326);
  for (let y = top + 30; y < base; y += 38) { ctx.beginPath(); ctx.moveTo(-80, y); ctx.lineTo(W + 80, y); ctx.stroke(); const off = (y / 38) % 2 ? 0 : 40; for (let x = -80 + off; x < W + 80; x += 80 + R() * 10) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 38); ctx.stroke(); } }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,200,140,.16)'; ctx.fillRect(-80, top - 2, W + 160, 5); for (const tx of [250, 830]) ctx.fillRect(tx - 98, 728, 196, 4);
  for (const [wx, wy] of [[250, 820], [830, 820], [250, 960], [830, 960]]) { ctx.fillStyle = 'rgba(255,180,100,.75)'; ctx.fillRect(wx - 6, wy, 12, 26); }
  // kapı: ardında şehrin ışığı, iki kanat dışarı açılır
  ctx.save(); arch(); ctx.clip();
  ctx.fillStyle = rg(540, 1230, 20, 420, [[0, '#fff1c8'], [.45, '#f2b45a'], [1, '#6a3216']]); ctx.fillRect(gx0, gTop - gR, gx1 - gx0, base - gTop + gR);
  const half = (gx1 - gx0) / 2, pw = half * Math.cos(op * 1.32), shade = .55 * op;
  for (const sd of [-1, 1]) {
    const hx = sd < 0 ? gx0 : gx1, x0 = sd < 0 ? hx : hx - pw;
    ctx.fillStyle = mix('#4a2c16', '#140a04', shade); ctx.fillRect(x0, gTop - gR - 10, pw, base - gTop + gR + 10);
    ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 3; for (let i = 1; i < 4; i++) { const x = x0 + pw * i / 4; ctx.beginPath(); ctx.moveTo(x, gTop - gR); ctx.lineTo(x, base); ctx.stroke(); }
    ctx.fillStyle = 'rgba(20,14,10,.85)'; for (const by of [gTop - 40, gTop + 90, base - 60]) ctx.fillRect(x0, by, pw, 9);
  }
  ctx.restore();
  ctx.strokeStyle = '#120c08'; ctx.lineWidth = 16; arch(); ctx.stroke();
}

/* ---------- Gelibolu: tepe, surlar, yıkılan bölüm ---------- */
const GSUR = { x0: 452, x1: 628, top: 930, base: 1050, towers: [175, 400, 680, 905] };
const GTAS = (() => { const R = rng(1354), out = []; for (let y = GSUR.top; y < GSUR.base; y += 24) for (let x = GSUR.x0; x < GSUR.x1; x += 35) out.push({ x, y, w: 34, h: 23, d: R() * .22 + (GSUR.base - y) / 900, vx: (R() - .5) * 160, vy: -R() * 90, r: (R() - .5) * 5 }); return out; })();
function gelibolu(t, ty) {
  const { x0, x1, top, base, towers } = GSUR, down = t >= ty;
  ctx.fillStyle = '#0c0a0d';
  ctx.beginPath(); ctx.moveTo(-60, 1210); ctx.lineTo(-60, 1080); for (let x = -60; x <= W + 60; x += 30) ctx.lineTo(x, base - 6 + Math.sin(x * .011) * 10 + (x < 120 ? (120 - x) * .5 : 0) + (x > 960 ? (x - 960) * .6 : 0)); ctx.lineTo(W + 60, 1210); ctx.closePath(); ctx.fill();
  const wall = (a, b) => { ctx.fillRect(a, top, b - a, base - top + 8); for (let x = a; x < b - 20; x += 46) ctx.fillRect(x + 4, top - 26, 26, 28); };
  ctx.fillStyle = '#151218';
  if (!down) wall(70, 1010);
  else { wall(70, x0); wall(x1, 1010); ctx.beginPath(); ctx.moveTo(x0, base + 8); const R = rng(77); for (let x = x0; x <= x1; x += 16) ctx.lineTo(x, base - 18 - R() * 30); ctx.lineTo(x1, base + 8); ctx.closePath(); ctx.fill(); }
  for (const tx of towers) { ctx.fillRect(tx - 43, top - 110, 86, base - top + 118); for (let i = 0; i < 3; i++) ctx.fillRect(tx - 43 + i * 32, top - 136, 22, 28); }
  ctx.fillStyle = 'rgba(150,170,210,.14)'; ctx.fillRect(70, top - 2, 940, 3);
  for (const tx of [175, 905]) { const fl = .8 + .2 * Math.sin(t * 11 + tx); glow(tx, top - 60, 70 * fl, 'rgba(255,170,80,.65)'); }
  if (down) for (const b of GTAS) {
    const tau = t - ty - b.d * .5; if (tau <= 0) { ctx.fillStyle = '#151218'; ctx.fillRect(b.x, b.y, b.w, b.h); continue; }
    const a = 1 - seg(tau, .45, .95); if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(b.x + b.w / 2 + b.vx * tau, Math.min(1230, b.y + b.h / 2 + b.vy * tau + 1300 * tau * tau)); ctx.rotate(b.r * tau);
    ctx.fillStyle = '#1b171d'; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.strokeStyle = 'rgba(150,170,210,.2)'; ctx.lineWidth = 1.5; ctx.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
  }
}

window.SCENE_FNS = {
  /* p1 "Bin üç yüzlerin başında, Söğüt çevresinde küçük bir sınır beyliği vardı." – ilk kare: Söğüt'te sezon ağacının filizi */
  sogut(t, s) {
    const ts = C('p1:Söğüt'), tk = C('p1:küçük'), tn = C('p1:sınır'), tv = C('p1:vardı');
    const cam = sogutCam(t), Y = lerp(1300.9, 1302.6, seg(t, 0, s.t1));
    harita(t, cam, Y, { dim: .3 });
    const lb = seg(t, tn - .2, tn + .5); if (lb > 0) mapLabel(cam, 'BİZANS', ...LL(29.05, 40.33), 46, { a: lb, col: '#3c2a55' });
    agac(cam, t, { s: 1.5, g: lerp(.2, .24, seg(t, 0, s.t1)) });
    etiket(cam, P.SOG, 'SÖĞÜT', t, ts - .1, { dy: -40 });
    const hk = hitPulse(t, tk, 1.1); if (hk > 0) { const [x, y] = W2S(cam, ...P.SOG); ctx.save(); ctx.strokeStyle = `rgba(255,214,140,${hk})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 30 + (1 - hk) * 120, 0, TAU); ctx.stroke(); ctx.restore(); }
    yilHUD(t);
  },
  /* p1 "Onu Osman adında bir bey yönetiyordu." – şafak: çadır, düz kırmızı sancak, atlı bey (siluet), filiz */
  osman(t, s) {
    const to = C('p1:Osman'), z = lerp(1, 1.07, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(W / 2, 1200); ctx.scale(z, z); ctx.translate(-W / 2, -1200);
    skyLand(t, { k: lerp(.5, .68, seg(t, s.t0, s.t1)) });
    // ön plan: bozkır sırtı (çimen siluetleri), nesneler bu sırtın üstünde
    ctx.fillStyle = '#120c08'; ctx.beginPath(); ctx.moveTo(-80, H); ctx.lineTo(-80, 1330); for (let x = -80; x <= W + 80; x += 30) ctx.lineTo(x, 1318 + Math.sin(x * .009 + 1) * 14); ctx.lineTo(W + 80, H); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#120c08'; ctx.lineWidth = 3; const R = rng(1300); for (let i = 0; i < 70; i++) { const x = R() * W, h = 10 + R() * 22, b = 1322 + Math.sin(x * .009 + 1) * 14; ctx.beginPath(); ctx.moveTo(x, b + 4); ctx.lineTo(x + Math.sin(t * 1.5 + i) * 3 + (R() - .5) * 8, b - h); ctx.stroke(); }
    tent(270, 1326, .78, t);
    pennant(470, 1336, 1.05, t, { col: OSMC });
    const fg = lerp(.17, .3, eOut(seg(t, to, s.t1 + .3)));
    glow(745, 1260, 280, 'rgba(255,214,130,.5)'); miniTree(745, 1330, .95, fg, t);
    const kx = eOut(seg(t, s.t0 - .2, to + .9));
    rider(lerp(1260, 945, kx), 1346, .9, s.t0 + kx * 1.6, { flip: true, flag: OSMC });
    ctx.restore();
    ctx.fillStyle = lg(0, 1330, 0, H, [[0, 'rgba(10,6,4,0)'], [.35, 'rgba(10,6,4,.85)'], [1, '#050302']]); ctx.fillRect(0, 1330, W, H - 1330);
    kinetic('OSMAN', W / 2, 652, 98, t, to - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 8 });
    yilHUD(t);
  },
  /* p2 "Sonraki yüz yılda bu beylik Bizans'ın ordusunu yenecek ve kuşattığı bir şehri" – sayaç akar; Bafeus; Bursa çevresinde daralan halka */
  bafeus(t, s) {
    const tb = C("p2:Bizans'ın"), to = C('p2:ordusunu'), ty = C('p2:yenecek'), tk = C('p2:kuşattığı');
    const cam = bafeusCam(t), Y = yilAt(t);
    harita(t, cam, Y);
    dallar(cam, t); agac(cam, t);
    const fade = 1 - seg(t, ty + .1, ty + .7);
    if (fade > 0) { ctx.save(); ctx.globalAlpha = fade; arrow(cam, [P.KON, LL(29.2, 40.86), P.BAF], eIO(seg(t, tb - .35, to + .45)), 30, BIZC, { col0: '#9a7ab8' }); ctx.restore(); }
    const rt = 1 - seg(t, tk, tk + .5); if (rt > 0) { ctx.save(); ctx.globalAlpha = rt; arrow(cam, [P.BAF, LL(29.86, 40.75), P.IZM], eIO(seg(t, ty + .15, ty + .8)), 16, BIZC); ctx.restore(); }
    arrow(cam, [P.SOG, LL(29.95, 40.45), P.BAF], eIO(seg(t, to - .2, ty + .05)), 30, OSMC, { col0: '#d0574a' });
    const hp = hitPulse(t, ty, .9); if (hp > 0) glow(...W2S(cam, ...P.BAF), 300 * hp, 'rgba(255,190,110,.85)');
    mapPin(cam, ...P.BAF, t, ty - .25, 'BAFEUS', { size: 32, left: true });
    const rk = seg(t, tk - .1, s.t1 + .5);
    if (rk > 0) {
      const [bx, by] = W2S(cam, ...P.BUR), r = Math.max(4, lerp(46, 15, eIO(rk)) * cam[2]);
      ctx.save(); ctx.globalAlpha = clamp(rk * 3); ctx.strokeStyle = 'rgba(168,50,42,.25)'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = OSMC; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.stroke(); ctx.restore();
    }
    ownCity(cam, 'Bursa', Y, { r: 8, size: 30, a: seg(t, tk - .2, tk + .3), text: 'BURSA', align: 'right' });
    yilHUD(t);
  },
  /* p2 "kılıç çekmeden teslim alacaktı." – Bursa kapısı açılır */
  kapi(t, s) {
    const tt = C('p2:teslim'), op = eIO(seg(t, tt - .05, tt + 1.1)), z = lerp(1, 1.09, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(W / 2, 1150); ctx.scale(z, z); ctx.translate(-W / 2, -1150);
    ctx.fillStyle = lg(0, 0, 0, 1350, [[0, '#121828'], [.5, '#463844'], [.85, '#a8744e'], [1, '#d8985c']]); ctx.fillRect(-80, -80, W + 160, 1440);
    glow(W / 2, 1180, 680, 'rgba(255,190,120,.22)');
    ctx.fillStyle = '#3a2a2a'; ctx.beginPath(); ctx.moveTo(-80, 900); for (let x = -80; x <= W + 80; x += 40) ctx.lineTo(x, 820 + Math.sin(x * .006 + 1) * 40); ctx.lineTo(W + 80, 900); ctx.fill();
    surKapi(t, op);
    pennant(250, 730, .42, t, { col: BIZC }); pennant(830, 730, .42, t, { col: BIZC });
    ctx.fillStyle = lg(0, 1345, 0, H, [[0, '#1c130c'], [1, '#060403']]); ctx.fillRect(-80, 1345, W + 160, H);
    if (op > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5 * op;
      ctx.fillStyle = lg(0, 1345, 0, H, [[0, 'rgba(255,200,120,.9)'], [1, 'rgba(255,200,120,0)']]);
      ctx.beginPath(); ctx.moveTo(SUR.gx0, 1345); ctx.lineTo(SUR.gx1, 1345); ctx.lineTo(SUR.gx1 + 300, H); ctx.lineTo(SUR.gx0 - 300, H); ctx.closePath(); ctx.fill();
      const R = rng(9); ctx.fillStyle = '#ffe8b8'; for (let i = 0; i < 40; i++) { const x = 540 + (R() - .5) * 300, y = 1000 + fract(R() + t * (.05 + R() * .08)) * 400; ctx.globalAlpha = .5 * op * (.4 + .6 * Math.sin(t * 2 + i)); ctx.beginPath(); ctx.arc(x + Math.sin(t + i) * 12, y, 1.5 + R() * 2, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    rider(300, 1530, .82, .35, { flag: OSMC }); rider(790, 1560, .78, .8, { flip: true, flag: OSMC });   // bekleyen atlılar: kılıçlar kında
    ctx.restore();
    kinetic('BURSA', W / 2, 642, 46, t, s.t0 + .15, { mode: 'fade', fam: F.mont, w: 900, spacing: 16, col: '#f4ead2', stroke: false });
    yilHUD(t);
  },
  /* p3 "Bir Bizans imparatoru kızını Osmanlı hükümdarıyla evlendirecekti." – Silivri; gelin gemisi Marmara'yı geçer */
  gelin(t, s) {
    const ti = C('p3:imparatoru'), tk = C('p3:kızını');
    const cam = gelinCam(t), Y = yilAt(t);
    harita(t, cam, Y);
    dallar(cam, t); agac(cam, t);
    const lb = seg(t, ti - .3, ti + .4); if (lb > 0) mapLabel(cam, 'BİZANS', ...LL(27.35, 41.62), 40, { a: lb, col: '#3c2a55' });
    mapPin(cam, ...P.SIL, t, ti - .2, 'SİLİVRİ', { col: BIZC, left: true, size: 32 });
    const gk = eIO(seg(t, tk - .1, s.t1 + .8));
    if (gk > 0) {
      const PP = spline([P.SIL, LL(28.32, 40.8), LL(28.55, 40.56), LL(28.74, 40.44)].map(p => W2S(cam, ...p)), 12), L = polyLen(PP), [x, y] = pointAt(PP, L, gk);
      const tr = []; for (let i = 0; i < PP.length && L[i] <= gk * L[L.length - 1]; i++) tr.push(PP[i]); tr.push([x, y]);
      ctx.save(); ctx.strokeStyle = 'rgba(240,250,255,.6)'; ctx.lineWidth = 3; ctx.setLineDash([10, 9]); ctx.lineDashOffset = t * 30; tracePath(tr); ctx.stroke(); ctx.restore();
      gemi(x, y - 8, .6, t);
    }
    ownCity(cam, 'Bursa', Y, { r: 7, size: 26, text: 'BURSA', a: .9 });
    yilHUD(t);
  },
  /* p3 "Bir deprem Gelibolu'nun surlarını yıkacak" – gece; surlar çatlar ve yıkılır */
  deprem(t, s) {
    const td = C('p3:deprem'), tg = C("p3:Gelibolu'nun"), tsu = C('p3:surlarını'), ty = C('p3:yıkacak') - .25;   // yıkılış sözcükten bir nefes önce başlar
    const amp = 10 * seg(t, td - .1, td + .35) * (1 - .7 * seg(t, ty + .6, s.t1)) + 8 * hitPulse(t, ty, .7), [hx, hy] = handheld(t * 7, amp);
    ctx.fillStyle = lg(0, 0, 0, 1200, [[0, '#070b18'], [.55, '#1c2540'], [.85, '#3a3e58'], [1, '#55506a']]); ctx.fillRect(0, 0, W, H);
    glow(W / 2, 1150, 620, 'rgba(150,140,200,.18)');
    stars(t, .45);
    ctx.fillStyle = '#141a28'; ctx.beginPath(); ctx.moveTo(0, 1190); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 1168 + Math.sin(x * .008 + 2) * 10); ctx.lineTo(W, 1190); ctx.fill();
    ctx.fillStyle = lg(0, 1180, 0, H, [[0, '#13202a'], [1, '#05080b']]); ctx.fillRect(0, 1180, W, H - 1180);
    ctx.save(); ctx.globalAlpha = .3; ctx.strokeStyle = '#9fb4c8'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { const y = 1215 + i * 26, ox = Math.sin(t * .8 + i) * 40; ctx.beginPath(); ctx.moveTo(140 + ox + i * 30, y); ctx.lineTo(420 + ox + i * 20, y); ctx.stroke(); } ctx.restore();
    ctx.save(); ctx.translate(hx, hy); gelibolu(t, ty);
    const ck = eOut(seg(t, tsu - .05, ty)) * (1 - seg(t, ty, ty + .35)); if (ck > 0) cracks(540, 1000, ck, 77, { n: 6, len: 300 });
    ctx.restore();
    if (t > ty) { const k = seg(t, ty, ty + 1.6), R = rng(5); ctx.save();
      for (let i = 0; i < 9; i++) { const x = 540 + (R() - .5) * 360 * (.4 + k), y = 1000 - k * 120 * R(), r = 90 + 260 * k * (.6 + R() * .5); ctx.globalAlpha = .38 * (1 - seg(t, ty + .8, s.t1 + .6)); ctx.fillStyle = rg(x, y, 0, r, [[0, '#7c6e60'], [1, 'rgba(60,52,46,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
      ctx.restore(); }
    kinetic('GELİBOLU', W / 2, 642, 46, t, tg - .1, { mode: 'fade', fam: F.mont, w: 900, spacing: 16, col: '#f4ead2', stroke: false });
    yilHUD(t);
  },
  /* p3 "ve Osmanlılar Avrupa'ya yerleşecekti." – boğazı geçen ok, Trakya kızıla döner */
  avrupa(t, s) {
    const tos = C('p3:Osmanlılar'), ta = C("p3:Avrupa'ya"), tyr = C('p3:yerleşecekti');
    const cam = avrupaCam(t), Y = yilAt(t);
    harita(t, cam, Y);
    dallar(cam, t); agac(cam, t);
    const ck = 1 - seg(t, s.t0 + .1, tos + .3); if (ck > 0) { const [x, y] = W2S(cam, ...P.GEL); ctx.save(); ctx.globalAlpha = ck; cracks(x, y + 30, .55, 77, { n: 5, len: 260 }); ctx.restore(); }
    arrow(cam, [P.LAP, P.GEL, P.BOL, LL(27.05, 40.95), LL(26.75, 41.35)], eIO(seg(t, tos - .25, tyr + .3)), 30, OSMC, { col0: '#d0574a' });
    ownCity(cam, 'Gelibolu', Y, { r: 7, size: 28, text: 'GELİBOLU', align: 'right' });
    bolgeAdi(cam, 'AVRUPA', LL(26.3, 41.75), t, ta - .05, 84);
    yilHUD(t);
  },
  /* p4 "Bir sultan savaş" – Gelibolu'dan Kosova'ya uçuş, sayaç 1361 → 1389 */
  kosova(t, s) {
    const tsv = C('p4:savaş'), cam = kosovaCam(t), Y = yilAt(t);
    harita(t, cam, Y);
    dallar(cam, t);
    mapPin(cam, ...P.KOS, t, tsv - .2, 'KOSOVA', { size: 34 });
    yilHUD(t);
  },
  /* p4 "meydanında hayatını kaybedecekti." – savaş meydanı: tuğ devrilir (sultan siluetle değil, tuğla anlatılır) */
  meydan(t, s) {
    const tk = C('p4:kaybedecekti'), fall = seg(t, tk - .15, tk + .75), z = lerp(1, 1.06, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(W / 2, 1300); ctx.scale(z, z); ctx.translate(-W / 2, -1300);
    ctx.fillStyle = lg(0, 0, 0, 1420, [[0, '#1a1220'], [.5, '#552820'], [.82, '#a4502c'], [1, '#3a1c10']]); ctx.fillRect(-80, -80, W + 160, H + 160);
    glow(W / 2, 1200, 640, 'rgba(255,150,80,.38)');
    ctx.fillStyle = '#20110c'; ctx.beginPath(); ctx.moveTo(-80, 1300); for (let x = -80; x <= W + 80; x += 40) ctx.lineTo(x, 1250 + Math.sin(x * .007 + 3) * 26); ctx.lineTo(W + 80, 1300); ctx.fill();
    smokeLayer(t, .9, '#2a1a16', 9);
    ctx.fillStyle = lg(0, 1380, 0, H, [[0, '#1e100a'], [.5, '#120a06'], [1, '#070403']]); ctx.fillRect(-80, 1380, W + 160, H);
    ctx.fillStyle = 'rgba(255,140,70,.10)'; ctx.fillRect(-80, 1380, W + 160, 6);
    const R = rng(1389); ctx.strokeStyle = '#0c0705'; ctx.lineCap = 'round';
    for (let i = 0; i < 16; i++) { const x = R() * W, y = 1370 + R() * 260, a = -Math.PI / 2 + (R() - .5) * 1.4, l = (110 + R() * 150) * (1 + (y - 1370) / 400); ctx.lineWidth = 5 + (y - 1370) / 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); }
    for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(120 + i * 380 + R() * 60, 1420 + i % 2 * 120); ctx.rotate(-1.2 + R() * .4); pennant(0, 0, .36 + i * .05, t + i, { sil: '#0c0705' }); ctx.restore(); }
    glow(W / 2, 880, 300, 'rgba(255,200,120,.3)', 1 - fall);
    tug(W / 2, 1450, 1.0, t, { fall, dir: -1 });
    embers(t, .35 + .6 * fall);
    ctx.restore();
    kinetic('KOSOVA', W / 2, 642, 46, t, s.t0 + .15, { mode: 'fade', fam: F.mont, w: 900, spacing: 16, col: '#f4ead2', stroke: false });
    yilHUD(t);
  },
  /* p4 "Avrupa'nın şövalyeleri Tuna kıyısında bozguna uğrayacak" – Haçlı oku Tuna boyunca gelir, Niğbolu'da kırılır */
  nigbolu(t, s) {
    const tsv = C('p4:şövalyeleri'), ttu = C('p4:Tuna'), tki = C('p4:kıyısında'), tbo = C('p4:bozguna');
    const cam = nigCam(t), Y = yilAt(t);
    harita(t, cam, Y);
    riverGlow(cam, 'Tuna', seg(t, ttu - .15, ttu + .4) * (1 - .45 * seg(t, tbo, tbo + 1)));
    dallar(cam, t);
    const hf = 1 - seg(t, tbo + .05, tbo + .8);
    if (hf > 0) { ctx.save(); ctx.globalAlpha = hf; arrow(cam, [LL(22.4, 44.72), P.VID, LL(24.0, 43.72), P.NIG], eIO(seg(t, tsv - .3, tbo)), 32, HACC, { col0: '#8aa0b8' }); ctx.restore(); }
    arrow(cam, [P.TIR, LL(24.95, 43.25), P.NIG], eIO(seg(t, tki - .2, tbo + .1)), 28, OSMC, { col0: '#d0574a' });
    const [nx, ny] = W2S(cam, ...P.NIG), hp = hitPulse(t, tbo, 1.0);
    if (hp > 0) glow(nx, ny, 320 * hp, 'rgba(255,190,110,.85)');
    if (t > tbo) cracks(nx - 30, ny - 10, eOut(seg(t, tbo, tbo + .5)) * (1 - seg(t, tbo + 1.4, tbo + 2)), 13, { n: 5, len: 160 });
    mapPin(cam, ...P.NIG, t, tbo - .3, 'NİĞBOLU', { left: true, size: 32 });
    yilHUD(t);
  },
  /* p4 "ve devletin toprakları Balkanlar'dan Fırat'a kadar uzanacaktı." – geri çekiliş; ağaç ve dalları tam */
  zirve(t, s) {
    const tbk = C("p4:Balkanlar'dan"), tfr = C("p4:Fırat'a"), tuz = C('p4:uzanacaktı');
    const cam = zirveCam(t), Y = yilAt(t), hl = .22 * seg(t, tuz - .2, tuz + .6) * (1 - .3 * seg(t, tuz + .6, s.t1));
    harita(t, cam, Y, { after: hl > 0 ? (z, S) => { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = hl; ctx.fillStyle = '#ffcf7a'; for (const k in S) if (S[k].o === 'OSM') ctx.fill(PATHS.st[k], 'evenodd'); ctx.restore(); } : undefined });
    riverGlow(cam, 'Tuna', seg(t, tbk - .1, tbk + .4)); riverGlow(cam, 'Fırat', seg(t, tfr - .1, tfr + .4));
    dallar(cam, t); agac(cam, t);
    bolgeAdi(cam, 'BALKANLAR', LL(23.4, 42.85), t, tbk - .05, 62);
    bolgeAdi(cam, 'FIRAT', LL(37.3, 38.8), t, tfr - .05, 56, { xmax: 830 });
    yilHUD(t);
  },
  /* p5 "Ama bin dört yüz iki yazında, Ankara'da her şey tek bir günde değişecekti." – renk soğur; iki ok Ankara'da buluşur */
  ankara(t, s) {
    const ta = C('p5:Ama'), tb = C('p5:bin'), tyz = C('p5:yazında'), tan = C("p5:Ankara'da"), td = C('p5:değişecekti');
    const cam = ankaraCam(t), Y = yilAt(t);
    harita(t, cam, Y, { cool: .55 * seg(t, ta - .1, ta + 1.3) });
    dallar(cam, t); agac(cam, t);
    arrow(cam, [LL(42.6, 39.65), P.SIV, P.KAY, LL(33.9, 39.4), P.CUB], eIO(seg(t, tb - .2, tan + .25)), 34, TIMC, { col0: '#55644f', edge: '#0b0f0a' });
    const lt = seg(t, tb + .2, tb + .7) * (1 - seg(t, tan - .3, tan + .2)); if (lt > 0) mapLabel(cam, 'TİMUR', ...LL(36.4, 39.85), 36, { a: lt, col: '#1e261c' });
    mapPin(cam, ...P.ANK, t, tan - .15, '');
    etiket(cam, P.ANK, 'ANKARA', t, tan + .1, { left: true, dy: 46 });
    const [ax, ay] = W2S(cam, ...P.ANK);
    cracks(ax, ay, catlak(t) * .4, 21, { n: 11, len: 1100 });
    const hp = hitPulse(t, td, 1.2); if (hp > 0) glow(ax, ay, 320 * hp, 'rgba(255,170,80,.9)');
    yilHUD(t);
  },
  /* p5 sonrası 2,5 sn harita sessizliği – harita çatlar, Anadolu'da sınırlar geri döner, ağaç kurur */
  sessizlik(t, s) {
    const w = eIO(seg(t, s.t0 + .25, s.t1 - .15)), cam = sessizCam(t);
    const Y = lerp(1402.5, 1403.05, eIO(seg(t, s.t0 + .3, s.t1 - .2)));
    harita(t, cam, Y, { cool: .55 + .35 * w });
    dallar(cam, t, { wither: w }); agac(cam, t, { wither: w });
    const [ax, ay] = W2S(cam, ...P.ANK);
    cracks(ax, ay, lerp(.4, 1, catlak(t)), 21, { n: 11, len: 1100 });
    const hp = hitPulse(t, C('p5.end+0.1'), 1.4); if (hp > 0) glow(ax, ay, 420 * hp, 'rgba(255,170,80,.85)');
    yilHUD(t, 1 - .35 * w);
  },
  /* p6 "Bu, Söğüt'ten Ankara'ya uzanan yüz yılın hikâyesi." – sezonun yolu; kurumuş ağacın dibinde tek filiz; sezon kartı */
  yol(t, s) {
    const ts = C("p6:Söğüt'ten"), ta = C("p6:Ankara'ya"), tu = C('p6:uzanan'), th = C('p6:hikâyesi');
    const cam = yolCam(t);
    harita(t, cam, 1403.05, { cool: .9, dim: .5 });
    dallar(cam, t, { wither: 1, a: .5 }); agac(cam, t, { wither: 1 });
    const route = [P.SOG, P.BAF, P.BUR, P.SIL, P.GEL, P.EDI, P.KOS, P.NIG, LL(28.6, 41.45), P.ANK], rk = eIO(seg(t, ts - .15, tu + .35));
    glowPath(cam, route, t, rk, { w: 6, col: '#ffd27a' });
    route.forEach((p, i) => { const on = seg(rk, i / (route.length - 1) - .02, i / (route.length - 1) + .06); if (on <= 0) return; const [x, y] = W2S(cam, ...p); ctx.save(); ctx.globalAlpha = on; ctx.fillStyle = GOLD; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); });
    etiket(cam, P.SOG, 'SÖĞÜT', t, ts - .05, { left: true, dy: -44 });
    etiket(cam, P.ANK, 'ANKARA', t, ta - .05, { left: true, dy: 50 });
    const fg = .15 * eOut(seg(t, th - .2, th + .8)); if (fg > 0) { const [x, y] = W2S(cam, ...P.SOG); glow(x, y - 30, 120, 'rgba(255,214,130,.7)'); miniTree(x, y, .55, fg, t, { col: '#ffe08a' }); }
    yilHUD(t, 1 - seg(t, s.t0, s.t0 + .6));
  },
};

/* ---------- kamera yolları: ardışık harita sahneleri birbirinin son karesinden başlar ---------- */
function sogutCam(t) {
  const ts = C('p1:Söğüt'), tk = C('p1:küçük'), tv = C('p1:vardı');
  return camAt([[0, 100, 40, 5.4], [ts, 97, 38, 5.0], [tk, 86, 30, 4.0], [tv + .3, 68, 16, 2.9], [T1('sogut') + .4, 64, 12, 2.7]], t);
}
function bafeusCam(t) {
  const s0 = T0('bafeus'), tb = C("p2:Bizans'ın"), ty = C('p2:yenecek'), tk = C('p2:kuşattığı');
  return camAt([[s0, 70, 10, 2.9], [tb, 52, -6, 3.4], [ty + .3, 48, -10, 3.7], [tk, 30, 12, 4.2], [T1('bafeus') + .3, 10, 30, 5.8]], t);
}
function gelinCam(t) {
  const s0 = T0('gelin'), ti = C('p3:imparatoru') + .1, te = C('p3:evlendirecekti'), A = [8, 30, 5.2], K = [-36, -22, 3.0];
  return t < ti ? flyTo(A, K, eIO(seg(t, s0, ti))) : camAt([[ti, ...K], [te, -42, -24, 3.25], [T1('gelin') + .3, -70, -12, 3.0]], t, .004);
}
function avrupaCam(t) {
  const s0 = T0('avrupa'), tos = C('p3:Osmanlılar'), ta = C("p3:Avrupa'ya");
  return camAt([[s0, -196, 12, 4.6], [tos, -194, 2, 4.0], [ta, -192, -28, 2.7], [T1('avrupa'), -222, -78, 1.7]], t);
}
function kosovaCam(t) {
  const s0 = T0('kosova'), tsv = C('p4:savaş'), A = avrupaCam(s0), K = [-610, -255, 2.6];
  return t < tsv ? flyTo(A, K, eIO(seg(t, s0, tsv))) : camAt([[tsv, ...K], [T1('kosova') + .5, -625, -262, 3.0]], t, .004);
}
function nigCam(t) {
  const s0 = T0('nigbolu'), ttu = C('p4:Tuna'), tbo = C('p4:bozguna');
  return camAt([[s0, -432, -382, 2.0], [ttu, -385, -385, 2.3], [tbo + .3, -350, -372, 2.8], [T1('nigbolu'), -330, -352, 2.5]], t);
}
function zirveCam(t) {
  const s0 = T0('zirve'), tbk = C("p4:Balkanlar'dan"), tuz = C('p4:uzanacaktı');
  return camAt([[s0, ...nigCam(s0)], [tbk, -60, -170, .95], [tuz, 118, -72, .62], [T1('zirve'), 124, -66, .6]], t);
}
function ankaraCam(t) {
  const s0 = T0('ankara'), tyz = C('p5:yazında'), tan = C("p5:Ankara'da"), td = C('p5:değişecekti');
  return camAt([[s0, ...zirveCam(s0)], [tyz, 245, -8, .78], [tan, 312, 32, 1.2], [td + .4, 324, 46, 1.55], [T1('ankara') + .3, 327, 50, 1.6]], t);
}
function sessizCam(t) { const s0 = T0('sessizlik'); return camAt([[s0, ...ankaraCam(s0)], [T1('sessizlik'), 170, -40, .95]], t, .003); }
function yolCam(t) { const s0 = T0('yol'), tu = C('p6:uzanan'); return camAt([[s0, ...sessizCam(s0)], [tu + .4, -128, -140, .72], [T1('yol'), -132, -146, .7]], t, .003); }
// Ankara çatlağı: "değişecekti"de başlar, harita sessizliği boyunca yayılır (iki sahnede aynı ilerleme)
const catlak = t => eOut(seg(t, C('p5:değişecekti'), C('p5.end+0.1') + 2.2));
