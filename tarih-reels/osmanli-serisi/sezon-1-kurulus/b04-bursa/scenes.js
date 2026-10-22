/* Sezon 1 · Bölüm 4 sahneleri: Bursa: Akıncılardan Devlete. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js
 * Portre yok: kişiler siluet ve nesneyle (tuğ, akçe, taç). Olgular ve rozetler FACTS.md'de; ⚪ ayrıntılar ekrana girmez.
 * Bölüme özel çizimler bu dosyada: gumusKubbe (Bölüm 3 ile ortak tarif), kapiManzara, nobetAtli, gocmen, kagni, kilic, muhur,
 * kiliseCiz, minare, revakCiz, rahle, yolAti, kaleIsaret, camiCiz, aseviCiz, hanCiz, dukkan, tacCiz, bizansTaci. */
'use strict';
const C = cue;
const camAt = (keys, t, creep = .008) => camPath(keys, t, { creep });   // monoton kübik + log-zoom + sürekli hafif itme
const OSMC = '#a8322a', BIZC = '#7a5a9a';
// harita noktaları (km). Hepsi CITY listesinden; Üsküdar (Boğaz geçişi) koordinatla (FACTS §C)
const BUR = CITY['Bursa'], IZN = CITY['İznik'], IZM = CITY['İzmit'], KON = CITY['Konstantinopolis'], PEL = CITY['Palekanon'];
const SOG = CITY['Söğüt'], BIL = CITY['Bilecik'], MUD = CITY['Mudanya'];
const USK = LL(29.02, 41.02);
const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

/* ======================= bölüme özel çizimler ======================= */
// GÜMÜŞ KUBBE: Bölüm 3–4 süreklilik nesnesi (ortak tarif). Yuvarlak Bizans şapeli gövdesi (taş, sıcak gri #8d8577), üstünde yarım küre
// gümüş kubbe (#cfd6dc, kenar #9aa3ab). o.shine 0..1: kubbenin sol üstünden geçen beyaz parıltı + hafif hale (glow). Tepede sembol YOK.
// (x, y) gövdenin taban ortası; s = 1 → gövde 240 px geniş, toplam ~300 px. o: {shade 0..1 akşam karartısı, lit (pencereler), door 0..1 kapı ışığı}
function gumusKubbe(x, y, s, t, o = {}) {
  const R = 120, Hb = 150, Rd = 112, top = -Hb, sh = clamp(o.shade ?? 0), sn = clamp(o.shine ?? 0);
  const stone = mix('#8d8577', '#26221d', sh), brick = mix('#8a5a46', '#2a1c16', sh);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // gövde: silindir
  const body = () => { ctx.beginPath(); ctx.moveTo(-R, top); ctx.lineTo(-R, 0); ctx.ellipse(0, 0, R, R * .2, 0, Math.PI, 0, true); ctx.lineTo(R, top); ctx.closePath(); };
  body(); ctx.fillStyle = lg(-R, 0, R, 0, [[0, mix(stone, '#000000', .45)], [.32, mix(stone, '#ffffff', .1)], [.68, stone], [1, mix(stone, '#000000', .55)]]); ctx.fill();
  ctx.save(); body(); ctx.clip();
  ctx.strokeStyle = rgba(brick, .75); ctx.lineWidth = 5;                                            // tuğla hatıllar (Bizans duvar dokusu)
  for (const yy of [-122, -86, -50, -16]) { ctx.beginPath(); ctx.ellipse(0, yy, R, R * .2, 0, 0, Math.PI); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(30,24,18,.18)'; ctx.lineWidth = 1.5;
  for (const yy of [-104, -68, -32]) { ctx.beginPath(); ctx.ellipse(0, yy, R, R * .2, 0, 0, Math.PI); ctx.stroke(); }
  ctx.restore();
  // kemerli pencereler ve kapı
  const win = (wx, wy, ww, wh, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy + wh); ctx.lineTo(wx - ww / 2, wy + ww / 2); ctx.arc(wx, wy + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww / 2, wy + wh); ctx.closePath(); ctx.fill(); };
  const wcol = o.lit ? `rgba(255,196,120,${.55 + .35 * o.lit})` : mix('#1c1612', '#0a0806', sh);
  win(-70, -124, 16, 40, wcol); win(70, -124, 16, 40, wcol); win(0, -130, 22, 44, wcol);
  const dk = clamp(o.door ?? 0);
  win(0, -78, 44, 78, mix('#140f0b', '#ffbf78', dk));
  if (dk > 0) glow(0, -30, 120 * dk, `rgba(255,170,90,${.45 * dk})`);
  // korniş
  ctx.strokeStyle = mix('#5d574c', '#14110e', sh); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, top, R + 4, (R + 4) * .2, 0, 0, Math.PI); ctx.stroke();
  // kubbe
  const dome = () => { ctx.beginPath(); ctx.moveTo(-Rd, top); ctx.ellipse(0, top, Rd, Rd * .9, 0, Math.PI, TAU); ctx.ellipse(0, top, Rd, Rd * .2, 0, 0, Math.PI); ctx.closePath(); };
  dome(); ctx.fillStyle = rg(-Rd * .35, top - Rd * .55, 4, Rd * 1.55, [[0, mix('#f6f9fb', '#3a3f44', sh * .85)], [.35, mix('#cfd6dc', '#2c3034', sh * .85)], [.8, mix('#9aa3ab', '#1e2226', sh * .85)], [1, mix('#6f777e', '#14171a', sh * .85)]]); ctx.fill();
  ctx.strokeStyle = 'rgba(70,78,86,.35)'; ctx.lineWidth = 2;                                       // kubbe dilimleri
  for (const k of [-.66, -.33, 0, .33, .66]) { ctx.beginPath(); ctx.moveTo(Rd * k, top + Rd * .2 * Math.sqrt(1 - k * k)); ctx.quadraticCurveTo(Rd * k * 1.08, top - Rd * .62, 0, top - Rd * .9); ctx.stroke(); }
  dome(); ctx.strokeStyle = mix('#9aa3ab', '#2a2e33', sh * .8); ctx.lineWidth = 4; ctx.stroke();
  if (sn > 0 && sn < 1) {                                                                           // parıltı: sol üstten sağ alta geçen beyaz bant
    const I = Math.sin(Math.PI * sn);
    ctx.save(); dome(); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(-Rd * 1.25, top - Rd * 1.15, Rd * 1.15, top + Rd * .45);
    g.addColorStop(clamp(sn - .14), 'rgba(255,255,255,0)'); g.addColorStop(clamp(sn), `rgba(255,255,255,${.8 * I})`); g.addColorStop(clamp(sn + .14), 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(-Rd * 1.3, top - Rd * 1.2, Rd * 2.6, Rd * 1.6); ctx.restore();
    glow(-Rd * .3, top - Rd * .5, Rd * 2.6, 'rgba(236,244,250,.55)', .7 * I);
  }
  if (o.halo) glow(0, top - Rd * .45, Rd * 2.2, 'rgba(226,236,244,.35)', o.halo);
  ctx.restore();
}

// Bursa'nın kapısı ve surları (dünya: 1080 geniş, zemin y = 1240). open 0..1 kanatlar açılır; o.dawn 0..1 şafak
function kapiManzara(t, open, o = {}) {
  const dw = o.dawn ?? .6, gx = 540, gw = 130, gy = 1240, arch = 980;
  ctx.fillStyle = lg(0, -200, 0, 1240, [[0, mix('#0d1430', '#2c3f6a', dw)], [.45, mix('#1a1e38', '#a8768a', dw)], [.75, mix('#2a2234', '#f0b27a', dw)], [1, mix('#3a2a2a', '#ffd9a0', dw)]]); ctx.fillRect(-400, -400, W + 800, 1700);
  glow(250, 900, 700, `rgba(255,200,140,${.35 * dw})`);
  // Uludağ: karlı zirve, surların ardında
  ctx.fillStyle = mix('#232036', '#6a5a72', dw * .7); ctx.beginPath(); ctx.moveTo(-400, 900);
  for (let x = -400; x <= W + 400; x += 30) ctx.lineTo(x, 900 - 520 * Math.exp(-Math.pow((x - 700) / 420, 2)) - 30 * Math.sin(x * .013) - 14 * Math.cos(x * .041));
  ctx.lineTo(W + 400, 1240); ctx.lineTo(-400, 1240); ctx.fill();
  ctx.save(); ctx.globalAlpha = .55 + .3 * dw; ctx.fillStyle = '#f2ece6'; ctx.beginPath(); ctx.moveTo(470, 470);
  for (let x = 470; x <= 930; x += 15) ctx.lineTo(x, 900 - 520 * Math.exp(-Math.pow((x - 700) / 420, 2)) - 30 * Math.sin(x * .013) - 14 * Math.cos(x * .041) + (x === 470 || x === 930 ? 0 : 0));
  for (let x = 930; x >= 470; x -= 15) ctx.lineTo(x, 470 + 60 * Math.pow(Math.abs(x - 700) / 230, 1.6) + 18 * Math.sin(x * .07));
  ctx.closePath(); ctx.clip(); ctx.fillStyle = lg(400, 380, 900, 560, [[0, '#fff8f0'], [1, '#c9bcc8']]); ctx.fillRect(400, 300, 600, 400); ctx.restore();
  ctx.fillStyle = mix('#1a1622', '#4a3a44', dw * .6); ctx.beginPath(); ctx.moveTo(-400, 1240); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, 930 - 50 * Math.sin(x * .006 + 1.1)); ctx.lineTo(W + 400, 1240); ctx.fill();
  // surlar
  const wallC = mix('#2a2026', '#6e5a50', dw * .8), wallD = mix('#1a1418', '#4a3c36', dw * .8);
  ctx.fillStyle = wallC; ctx.fillRect(-400, 720, W + 800, 530);
  for (let x = -400; x < W + 400; x += 44) ctx.fillRect(x, 690, 26, 32);
  ctx.strokeStyle = 'rgba(20,12,10,.28)'; ctx.lineWidth = 2;
  for (let r = 0; r < 12; r++) { const yy = 740 + r * 42, off = r % 2 ? 0 : 36; ctx.beginPath(); ctx.moveTo(-400, yy); ctx.lineTo(W + 400, yy); ctx.stroke(); for (let x = -400 + off; x < W + 400; x += 72) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy + 42); ctx.stroke(); } }
  ctx.fillStyle = 'rgba(120,60,40,.25)'; for (const yy of [800, 960, 1120]) ctx.fillRect(-400, yy, W + 800, 10);   // tuğla hatıl
  for (const tx of [250, 830]) {
    ctx.fillStyle = wallD; ctx.fillRect(tx - 92, 560, 184, 690); for (let i = 0; i < 5; i++) ctx.fillRect(tx - 92 + i * 40, 528, 24, 34);
    ctx.fillStyle = 'rgba(255,190,110,.65)'; ctx.fillRect(tx - 6, 640, 12, 30);
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(tx + 40, 560, 52, 690);
  }
  // kapının içi: şehrin ışığı (açıldıkça)
  const opening = () => { ctx.beginPath(); ctx.moveTo(gx - gw, gy); ctx.lineTo(gx - gw, arch); ctx.arc(gx, arch, gw, Math.PI, 0); ctx.lineTo(gx + gw, gy); ctx.closePath(); };
  ctx.save(); opening(); ctx.clip();
  ctx.fillStyle = lg(0, 850, 0, gy, [[0, '#ffe2b0'], [.6, '#f6b46c'], [1, '#c87a40']]); ctx.fillRect(gx - gw, 840, gw * 2, 420);
  ctx.fillStyle = 'rgba(120,70,40,.55)';                                                             // içerideki evler (uzak siluet)
  for (let i = 0; i < 6; i++) { const hx = gx - gw + 10 + i * 44, hh = 40 + 26 * Math.sin(i * 2.1 + 1); ctx.fillRect(hx, gy - 70 - hh, 38, hh + 70); ctx.beginPath(); ctx.moveTo(hx - 4, gy - 70 - hh); ctx.lineTo(hx + 19, gy - 92 - hh); ctx.lineTo(hx + 42, gy - 70 - hh); ctx.fill(); }
  // kanatlar: açıldıkça içeri döner, daralır
  const lw = gw * (1 - .84 * eIO(clamp(open)));
  for (const d of [-1, 1]) {
    const x0 = gx + d * gw, x1 = x0 - d * lw;
    ctx.fillStyle = lg(Math.min(x0, x1), 0, Math.max(x0, x1), 0, d < 0 ? [[0, '#2a1a10'], [1, mix('#4a3020', '#2a1a10', open)]] : [[0, mix('#4a3020', '#2a1a10', open)], [1, '#2a1a10']]);
    ctx.fillRect(Math.min(x0, x1), 820, Math.abs(lw), gy - 820);
    ctx.fillStyle = 'rgba(10,6,4,.6)'; for (let r = 0; r < 7; r++) for (let c = 0; c < 3; c++) { const px = x0 - d * lw * (c + .5) / 3; ctx.beginPath(); ctx.arc(px, 1000 + r * 34, 3.4 * (lw / gw + .3), 0, TAU); ctx.fill(); }
    ctx.strokeStyle = 'rgba(10,6,4,.7)'; ctx.lineWidth = 6; for (const yy of [1030, 1170]) { ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke(); }
  }
  ctx.restore();
  if (open < .05) { const p = .7 + .3 * Math.sin(t * 3.1); ctx.fillStyle = `rgba(255,214,150,${.9 * p})`; ctx.fillRect(gx - 2, 860, 4, gy - 860); glow(gx, 1080, 160 * p, 'rgba(255,190,110,.55)'); }
  // kemer taşları
  ctx.strokeStyle = mix('#3a2c26', '#7a6458', dw * .6); ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(gx, arch, gw + 11, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = 'rgba(20,12,10,.4)'; ctx.lineWidth = 2; for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * gw, arch + Math.sin(a) * gw); ctx.lineTo(gx + Math.cos(a) * (gw + 22), arch + Math.sin(a) * (gw + 22)); ctx.stroke(); }
  // zemin ve yol
  ctx.fillStyle = lg(0, gy, 0, 1920, [[0, mix('#1c140e', '#5a4430', dw * .7)], [1, '#0a0705']]); ctx.fillRect(-400, gy, W + 800, 900);
  ctx.fillStyle = lg(0, gy, 0, 1920, [[0, mix('#3a2a1c', '#a07a52', dw * .7)], [1, '#1a120c']]);
  ctx.beginPath(); ctx.moveTo(gx - gw, gy); ctx.lineTo(gx + gw, gy); ctx.lineTo(gx + 620, 1920); ctx.lineTo(gx - 620, 1920); ctx.closePath(); ctx.fill();
  const sp = clamp(open); if (sp > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .38 * sp; ctx.fillStyle = lg(0, gy, 0, 1700, [[0, 'rgba(255,200,130,.9)'], [1, 'rgba(255,200,130,0)']]); ctx.beginPath(); ctx.moveTo(gx - gw * .9, gy); ctx.lineTo(gx + gw * .9, gy); ctx.lineTo(gx + 420, 1700); ctx.lineTo(gx - 420, 1700); ctx.fill(); ctx.restore(); glow(gx, 1060, 420 * sp, `rgba(255,200,130,${.4 * sp})`); }
}
// bekleyen atlı (yandan): at durur, binici dik; mızrak dik (saldırmıyor), ucunda düz kırmızı flama. o.flip sola bakar
function nobetAtli(x, y, s, t, o = {}) {
  const ph = o.ph || 0, hb = Math.sin(t * 1.3 + ph) * 3, tl = Math.sin(t * 1.7 + ph * 2) * 6;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); const c = o.sil || '#140c08'; ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineCap = 'round';
  ctx.lineWidth = 9; for (const [hx, dx] of [[-60, -4], [-46, 2], [50, -2], [64, 4]]) { ctx.beginPath(); ctx.moveTo(hx, -70); ctx.lineTo(hx + dx, -34); ctx.lineTo(hx + dx, 0); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, -88, 82, 30, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(54, -104); ctx.quadraticCurveTo(84, -140 + hb, 100, -160 + hb); ctx.lineTo(128, -132 + hb); ctx.lineTo(120, -120 + hb); ctx.quadraticCurveTo(98, -128, 80, -94); ctx.fill();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-80, -100); ctx.quadraticCurveTo(-104, -80 + tl * .3, -100 + tl * .4, -40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-14, -112); ctx.lineTo(-4, -186); ctx.lineTo(22, -186); ctx.lineTo(22, -112); ctx.fill();
  ctx.beginPath(); ctx.arc(10, -204, 16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-8, -214); ctx.quadraticCurveTo(10, -246, 28, -214); ctx.fill();
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(30, -60); ctx.lineTo(34, -360); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(34, -384); ctx.lineTo(28, -356); ctx.lineTo(40, -356); ctx.closePath(); ctx.fill();
  if (o.flag !== false) { ctx.fillStyle = o.flag || OSMC; ctx.beginPath(); ctx.moveTo(34, -352); ctx.quadraticCurveTo(58, -350 + Math.sin(t * 4 + ph) * 4, 76, -342 + Math.sin(t * 4 + ph + 1) * 5); ctx.lineTo(34, -330); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
// kapıdan çıkan kişi (önden, kameraya yürür): sırtında/başında bohça. kind: 0 sırtında bohça, 1 başında sepet, 2 çocuk, 3 asalı yaşlı
function gocmen(x, y, s, t, o = {}) {
  const ph = o.ph || 0, g = fract(t * 1.05 + ph), bob = Math.abs(Math.sin(g * TAU)) * 4, sw = Math.sin(g * TAU);
  const kind = o.kind || 0, k = kind === 2 ? .66 : 1, c = o.sil || '#120a06';
  ctx.save(); ctx.translate(x, y - bob * s); ctx.scale(s * k, s * k); ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineCap = 'round';
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-9, -60); ctx.lineTo(-9 + sw * 3, 0); ctx.moveTo(9, -60); ctx.lineTo(9 - sw * 3, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-30, -52); ctx.quadraticCurveTo(-34, -140, -18, -176); ctx.lineTo(18, -176); ctx.quadraticCurveTo(34, -140, 30, -52); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -194, 18, 0, TAU); ctx.fill();
  if (kind === 1) { ctx.beginPath(); ctx.moveTo(-20, -196); ctx.quadraticCurveTo(0, -226, 20, -196); ctx.lineTo(24, -150); ctx.lineTo(-24, -150); ctx.closePath(); ctx.fill(); ctx.fillStyle = o.load || '#3a2414'; ctx.beginPath(); ctx.ellipse(0, -226, 32, 16, 0, 0, TAU); ctx.fill(); }
  else if (kind === 0) { ctx.fillStyle = o.load || '#3a2414'; ctx.beginPath(); ctx.ellipse(o.side || 26, -150, 34, 42, .2 * (o.side < 0 ? -1 : 1), 0, TAU); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-6, -174); ctx.lineTo(o.side || 26, -112); ctx.stroke(); }
  else if (kind === 3) { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(30, -150); ctx.lineTo(40 + sw * 4, 0); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -210, 22, 12, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// kağnı (önden): iki tekerlek, yüklü kasa, önde iki öküz başı
function kagni(x, y, s, t, o = {}) {
  const c = o.sil || '#120a06', bob = Math.abs(Math.sin(t * 2.2 + (o.ph || 0))) * 3;
  ctx.save(); ctx.translate(x, y - bob * s); ctx.scale(s, s); ctx.fillStyle = c; ctx.strokeStyle = c;
  ctx.fillStyle = o.load || '#4a3020'; ctx.beginPath(); ctx.roundRect(-92, -190, 184, 96, 18); ctx.fill();
  ctx.fillStyle = 'rgba(160,110,60,.5)'; ctx.fillRect(-92, -152, 184, 10);
  ctx.fillStyle = c; ctx.fillRect(-100, -100, 200, 18);
  ctx.lineWidth = 12; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 104, -48, 14, 50, 0, 0, TAU); ctx.stroke(); }
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 40, -20, 30, 38, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(d * 40 - 30, -46); ctx.quadraticCurveTo(d * 40 - 52, -70, d * 40 - 44, -82); ctx.lineTo(d * 40 - 22, -52); ctx.fill(); ctx.beginPath(); ctx.moveTo(d * 40 + 30, -46); ctx.quadraticCurveTo(d * 40 + 52, -70, d * 40 + 44, -82); ctx.lineTo(d * 40 + 22, -52); ctx.fill(); }
  ctx.restore();
}
// kılıç ve kın: (x, y) kabza ucu, ang yön, len uzunluk; drawn 0..1 kınından çıkmış bıçak oranı
function kilic(x, y, ang, len, drawn) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.lineCap = 'round';
  const bl = len * .78, out = bl * clamp(drawn), sx = 64 + out;                                       // kın, çıkan bıçak kadar ileride başlar
  ctx.fillStyle = '#2a140c'; ctx.beginPath(); ctx.moveTo(sx, -13); ctx.quadraticCurveTo(sx + bl * .6, -18, sx + bl, -2); ctx.lineTo(sx + bl - 6, 10); ctx.quadraticCurveTo(sx + bl * .6, 6, sx, 13); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c9a24a'; ctx.fillRect(sx - 4, -15, 16, 30); ctx.fillRect(sx + bl * .45, -15, 12, 28); ctx.beginPath(); ctx.moveTo(sx + bl - 22, -8); ctx.lineTo(sx + bl, -2); ctx.lineTo(sx + bl - 8, 10); ctx.lineTo(sx + bl - 26, 8); ctx.fill();
  if (out > 0) { ctx.fillStyle = lg(0, -10, 0, 10, [[0, '#f2efe6'], [.5, '#a9a59a'], [1, '#5a564e']]); ctx.beginPath(); ctx.moveTo(64, -9); ctx.lineTo(64 + out + 4, -9); ctx.lineTo(64 + out + 4, 9); ctx.lineTo(64, 9); ctx.fill(); }
  ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.roundRect(52, -30, 14, 60, 6); ctx.fill();            // balçak
  ctx.fillStyle = '#1a0e08'; ctx.beginPath(); ctx.roundRect(0, -9, 54, 18, 8); ctx.fill();                  // kabza
  ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.arc(-4, 0, 11, 0, TAU); ctx.fill();
  ctx.restore();
}
// mum mühür: kırmızı balmumu, kabartmalı geometrik gül (sembol değil). k 0..1 basılma
function muhur(x, y, r, k) {
  if (k <= 0) return; const sc = lerp(1.9, 1, eOut(clamp(k))), R = rng(77);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 3);
  ctx.fillStyle = '#7a1a14'; ctx.beginPath(); for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU, rr = r * (1.12 + .1 * Math.sin(i * 2.7) + .05 * R()); ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
  ctx.fillStyle = rg(-r * .3, -r * .3, 2, r, [[0, '#d0483a'], [1, '#8a1f17']]); ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(60,8,6,.75)'; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(0, 0, r * .7, 0, TAU); ctx.stroke();
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i / 8 * TAU); ctx.beginPath(); ctx.ellipse(0, -r * .36, r * .1, r * .26, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = 'rgba(255,170,150,.35)'; ctx.lineWidth = r * .03; ctx.beginPath(); ctx.arc(-r * .05, -r * .05, r * .82, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
  ctx.restore();
}
// büyük kilise (İznik): bazilika gövdesi, kasnaklı merkezî kubbe, apsis. Tepede sembol yok. o.light pencereler
function kiliseCiz(x, y, s, o = {}) {
  const c = o.col || '#4a3a30', d = mix(c, '#000000', .35);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = c;
  ctx.fillStyle = d; ctx.fillRect(-300, -150, 600, 150);                                             // yan nefler
  ctx.beginPath(); ctx.moveTo(-310, -150); ctx.lineTo(-300, -178); ctx.lineTo(300, -178); ctx.lineTo(310, -150); ctx.fill();
  ctx.fillStyle = c; ctx.fillRect(-230, -250, 460, 250);                                              // orta nef
  ctx.beginPath(); ctx.moveTo(-246, -250); ctx.lineTo(0, -300); ctx.lineTo(246, -250); ctx.fill();
  ctx.beginPath(); ctx.arc(300, -70, 70, -Math.PI / 2, Math.PI / 2); ctx.fill();                       // apsis
  ctx.fillStyle = d; ctx.fillRect(-70, -360, 140, 110);                                               // kasnak
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, -360, 80, 70, 0, Math.PI, TAU); ctx.fill();      // kubbe
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, -360, 80, 70, 0, Math.PI, TAU); ctx.stroke();
  ctx.fillStyle = 'rgba(120,60,40,.35)'; for (const yy of [-200, -120, -40]) ctx.fillRect(-300, yy, 600, 7);
  const lc = o.light ? `rgba(255,196,120,${.45 + .45 * o.light})` : 'rgba(20,14,10,.9)';
  ctx.fillStyle = lc; const win = (wx, wy, w, h) => { ctx.beginPath(); ctx.moveTo(wx - w / 2, wy + h); ctx.lineTo(wx - w / 2, wy + w / 2); ctx.arc(wx, wy + w / 2, w / 2, Math.PI, 0); ctx.lineTo(wx + w / 2, wy + h); ctx.fill(); };
  for (let i = -2; i <= 2; i++) win(i * 70, -232, 26, 54); for (let i = -3; i <= 3; i++) if (i) win(i * 80, -128, 22, 46); for (let i = -1; i <= 1; i++) win(i * 34, -342, 14, 34);
  win(0, -100, 60, 100);
  ctx.restore();
}
// minare (tuğla gövde, şerefe, kurşun külah; alem yok). h 0..1 yükselme
function minare(x, y, s, h, o = {}) {
  if (h <= 0) return; const H2 = 460 * eOut(clamp(h));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.rect(-80, -H2 - 120, 160, H2 + 120); ctx.clip();
  ctx.translate(0, 460 - H2);
  ctx.fillStyle = o.col || '#7a3e2c'; ctx.fillRect(-38, -360, 76, 360); ctx.fillRect(-48, -60, 96, 60);
  ctx.strokeStyle = 'rgba(40,16,10,.4)'; ctx.lineWidth = 2; for (let yy = -350; yy < -60; yy += 16) { ctx.beginPath(); ctx.moveTo(-38, yy); ctx.lineTo(38, yy); ctx.stroke(); }
  ctx.fillStyle = o.dark || '#4a2418'; ctx.fillRect(-54, -372, 108, 16); ctx.fillRect(-48, -356, 96, 8);
  ctx.fillStyle = o.col || '#7a3e2c'; ctx.fillRect(-30, -430, 60, 60);
  ctx.fillStyle = '#6a6e72'; ctx.beginPath(); ctx.moveTo(-34, -430); ctx.lineTo(0, -520); ctx.lineTo(34, -430); ctx.fill();
  if (o.light) { ctx.fillStyle = `rgba(255,196,120,${.6 * o.light})`; ctx.fillRect(-8, -410, 16, 26); }
  ctx.restore();
}
// medrese revakı: n kemer, arkada kubbeli hücreler; lamps 0..1 hücrelerde kandil (soldan sağa yanar)
function revakCiz(cx, y, w, n, t, lamps) {
  const bw = w / n, h = 300;
  ctx.save();
  ctx.fillStyle = '#2a1e16'; ctx.fillRect(cx - w / 2, y - h - 40, w, h + 40);
  for (let i = 0; i < n; i++) {                                                                           // hücre kubbeleri
    const x = cx - w / 2 + bw * (i + .5);
    ctx.fillStyle = '#3a2a20'; ctx.beginPath(); ctx.ellipse(x, y - h - 40, bw * .42, bw * .36, 0, Math.PI, TAU); ctx.fill();
    const L = clamp(lamps * (n + 1) - i); const fl = .85 + .1 * Math.sin(t * 9 + i * 2.3);
    ctx.fillStyle = mix('#140d09', '#ffb868', L * fl); ctx.beginPath(); ctx.moveTo(x - bw * .18, y - 60); ctx.lineTo(x - bw * .18, y - 150); ctx.arc(x, y - 150, bw * .18, Math.PI, 0); ctx.lineTo(x + bw * .18, y - 60); ctx.fill();
    if (L > 0) glow(x, y - 120, 150 * L * fl, 'rgba(255,170,80,.4)');
  }
  ctx.fillStyle = '#4e3a2c'; ctx.fillRect(cx - w / 2, y - h, w, 26);                                    // revak saçağı
  for (let i = 0; i <= n; i++) { const x = cx - w / 2 + bw * i; ctx.fillRect(x - 12, y - h + 20, 24, h - 20); }
  ctx.fillStyle = '#4e3a2c'; for (let i = 0; i < n; i++) { const x = cx - w / 2 + bw * (i + .5); ctx.beginPath(); ctx.moveTo(x - bw / 2, y - h + 26); ctx.lineTo(x + bw / 2, y - h + 26); ctx.lineTo(x + bw / 2, y - h + 90); ctx.arc(x, y - h + 90 + bw * .1, bw / 2 - 12, 0, Math.PI, true); ctx.lineTo(x - bw / 2, y - h + 90); ctx.fill(); }
  ctx.fillStyle = 'rgba(200,130,80,.25)'; for (let i = 0; i < n; i++) { const x = cx - w / 2 + bw * (i + .5); ctx.beginPath(); ctx.arc(x, y - h + 90 + bw * .1, bw / 2 - 12, Math.PI, TAU); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(160,90,60,.45)'; ctx.stroke(); }
  ctx.restore();
}
// rahle ve açık kitap; k 0..1 kitap ışığı
function rahle(x, y, s, t, k) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (k > 0) glow(0, -70, 260 * k, 'rgba(255,200,130,.45)');
  ctx.strokeStyle = '#1a0e08'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(60, -90); ctx.moveTo(70, 0); ctx.lineTo(-60, -90); ctx.stroke();
  ctx.fillStyle = mix('#8a7656', '#f4e6c6', k); ctx.beginPath(); ctx.moveTo(-90, -96); ctx.quadraticCurveTo(-45, -118, 0, -100); ctx.quadraticCurveTo(45, -118, 90, -96); ctx.lineTo(84, -78); ctx.quadraticCurveTo(45, -98, 0, -82); ctx.quadraticCurveTo(-45, -98, -84, -78); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(60,40,20,.55)'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * 14, -94 + i * 4 - 4); ctx.quadraticCurveTo(d * 45, -108 + i * 4, d * 76, -92 + i * 4); ctx.stroke(); } }
  ctx.restore();
}
// yürüyen at (yandan, sağa): binicili ya da yüklü. o.rider: üstünde sarıklı yolcu; o.load: yük dengi
function yolAti(x, y, s, t, o = {}) {
  const g = fract(t * (o.speed || .7) + (o.ph || 0)), bob = Math.sin(g * TAU * 2) * 2.5, c = o.sil || '#120b07';
  ctx.save(); ctx.translate(x, y + bob * s); ctx.scale(s, s); ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineCap = 'round';
  ctx.lineWidth = 10; for (const [hx, ph] of [[-58, 0], [-44, .5], [46, .25], [60, .75]]) { const a = Math.sin((g + ph) * TAU) * .32; ctx.beginPath(); ctx.moveTo(hx, -72); const kx = hx + Math.sin(a) * 16; ctx.lineTo(kx, -36); ctx.lineTo(kx + Math.sin(a + .3) * 8, 0); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, -90, 80, 30, 0, 0, TAU); ctx.fill();
  const hd = Math.sin(g * TAU * 2) * 3;
  ctx.beginPath(); ctx.moveTo(54, -106); ctx.quadraticCurveTo(90, -132 + hd, 110, -124 + hd); ctx.lineTo(132, -98 + hd); ctx.lineTo(122, -86 + hd); ctx.quadraticCurveTo(98, -100, 76, -80); ctx.fill();
  ctx.beginPath(); ctx.moveTo(104, -128 + hd); ctx.lineTo(110, -146 + hd); ctx.lineTo(116, -126 + hd); ctx.fill();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-78, -100); ctx.quadraticCurveTo(-98, -80, -94, -44); ctx.stroke();
  if (o.rider) { ctx.beginPath(); ctx.moveTo(-22, -114); ctx.quadraticCurveTo(-30, -170, -8, -196); ctx.lineTo(16, -196); ctx.quadraticCurveTo(30, -160, 22, -112); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -212, 16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(4, -226, 22, 13, 0, 0, TAU); ctx.fill();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(14, -170); ctx.lineTo(60, -130); ctx.stroke(); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-30, -160); ctx.lineTo(-40, -60); ctx.stroke(); }
  if (o.load) { ctx.fillStyle = o.load; ctx.beginPath(); ctx.roundRect(-58, -150, 54, 44, 12); ctx.fill(); ctx.beginPath(); ctx.roundRect(4, -146, 50, 40, 12); ctx.fill(); ctx.fillStyle = 'rgba(200,150,80,.45)'; ctx.fillRect(-58, -132, 54, 6); ctx.fillRect(4, -130, 50, 6); }
  ctx.restore();
}
// harita kale işareti: küçük burç; lit 0..1 altın parıltı
function kaleIsaret(x, y, sc, a, lit = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(sc, sc);
  if (lit > 0) glow(0, -8, 40 * lit, 'rgba(255,214,130,.85)');
  ctx.fillStyle = mix(OSMC, '#f2c75c', lit * .7); ctx.strokeStyle = '#1a0a05'; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(-9, 2); ctx.lineTo(-9, -14); ctx.lineTo(-6, -14); ctx.lineTo(-6, -18); ctx.lineTo(-2, -18); ctx.lineTo(-2, -14); ctx.lineTo(2, -14); ctx.lineTo(2, -18); ctx.lineTo(6, -18); ctx.lineTo(6, -14); ctx.lineTo(9, -14); ctx.lineTo(9, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// erken Osmanlı camisi (revaklı, iki kubbe, tuğla minare). k 0..1 yükselme (tabandan açılır)
function camiCiz(x, y, s, k, o = {}) {
  if (k <= 0) return; const c = o.col || '#c9a27a', d = mix(c, '#3a2418', .45), up = 1 - eOut(clamp(k));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.rect(-260, -560, 520, 560); ctx.clip(); ctx.translate(0, up * 360);
  ctx.fillStyle = d; ctx.fillRect(-150, -170, 300, 170);
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(-48, -170, 70, 64, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(70, -170, 56, 50, 0, Math.PI, TAU); ctx.fill();
  ctx.fillStyle = '#8a8e92'; ctx.globalAlpha = .55; ctx.beginPath(); ctx.ellipse(-48, -170, 70, 64, 0, Math.PI, Math.PI * 1.5); ctx.lineTo(-48, -170); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = c; ctx.fillRect(-170, -96, 340, 96);                                                  // son cemaat revakı
  ctx.fillStyle = d; for (let i = 0; i < 5; i++) { const ax = -136 + i * 68; ctx.beginPath(); ctx.moveTo(ax - 24, 0); ctx.lineTo(ax - 24, -46); ctx.arc(ax, -46, 24, Math.PI, 0); ctx.lineTo(ax + 24, 0); ctx.fill(); }
  ctx.fillStyle = 'rgba(120,60,40,.35)'; ctx.fillRect(-170, -100, 340, 8);
  ctx.restore();
  minare(x + 190 * s, y, s * .62, clamp(k * 1.4 - .2), { col: '#9a5038', dark: '#5a2a1c' });
}
// aşevi (imaret): üç kubbe, bacalar; k yükselme, smoke duman
function aseviCiz(x, y, s, k, t, smoke) {
  if (k <= 0) return; const c = '#b8956c', d = '#6e5034', up = 1 - eOut(clamp(k));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (smoke > 0) for (const bx of [-70, 70]) for (let i = 0; i < 6; i++) { const q = fract(t * .3 + i / 6 + bx * .01); ctx.globalAlpha = .3 * smoke * (1 - q); ctx.fillStyle = '#d8cbb4'; ctx.beginPath(); ctx.arc(bx + Math.sin(q * 5 + i) * 12 + q * 40, -210 - q * 200, 10 + q * 30, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1; ctx.beginPath(); ctx.rect(-220, -480, 440, 480); ctx.clip(); ctx.translate(0, up * 300);
  ctx.fillStyle = d; ctx.fillRect(-170, -130, 340, 130);
  ctx.fillStyle = c; for (const [dx, r] of [[-100, 46], [0, 56], [100, 46]]) { ctx.beginPath(); ctx.ellipse(dx, -130, r, r * .9, 0, Math.PI, TAU); ctx.fill(); }
  ctx.fillStyle = d; ctx.fillRect(-80, -210, 20, 60); ctx.fillRect(60, -210, 20, 60);
  ctx.fillStyle = 'rgba(255,190,110,.75)'; for (const dx of [-110, -40, 40, 110]) ctx.fillRect(dx - 8, -86, 16, 30);
  ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-22, -50); ctx.arc(0, -50, 22, Math.PI, 0); ctx.lineTo(22, 0); ctx.fill();
  ctx.restore();
}
// han: iki katlı, revaklı cephe, ortada kapı; k yükselme
function hanCiz(x, y, s, k, t, o = {}) {
  if (k <= 0) return; const c = '#a8845e', d = '#5e4028', up = 1 - eOut(clamp(k));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.rect(-260, -420, 520, 420); ctx.clip(); ctx.translate(0, up * 300);
  ctx.fillStyle = c; ctx.fillRect(-220, -230, 440, 230);
  ctx.fillStyle = 'rgba(120,60,40,.35)'; for (const yy of [-180, -110, -40]) ctx.fillRect(-220, yy, 440, 7);
  ctx.fillStyle = d; for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) { const ax = -183 + i * 73, ay = row ? -16 : -126, lit = o.lit ? .4 + .6 * clamp(o.lit * 7 - i - row * 3) : 0;
    ctx.fillStyle = lit > 0 ? mix(d, '#ffbe72', lit) : d; ctx.beginPath(); ctx.moveTo(ax - 22, ay); ctx.lineTo(ax - 22, ay - 60); ctx.arc(ax, ay - 60, 22, Math.PI, 0); ctx.lineTo(ax + 22, ay); ctx.fill(); }
  ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-34, -84); ctx.arc(0, -84, 34, Math.PI, 0); ctx.lineTo(34, 0); ctx.fill();
  ctx.fillStyle = d; ctx.fillRect(-230, -244, 460, 16); for (const bx of [-150, -40, 70, 170]) ctx.fillRect(bx, -278, 18, 36);
  ctx.restore();
}
// çarşı dükkânı: tezgâh + saçak (soluk renkli bez); k belirme, lamp fener
function dukkan(x, y, s, k, col, lamp) {
  if (k <= 0) return; const p = eBack(clamp(k));
  ctx.save(); ctx.translate(x, y); ctx.scale(s * p, s * p);
  ctx.fillStyle = '#3a2618'; ctx.fillRect(-46, -60, 92, 60);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-56, -64); ctx.lineTo(56, -64); ctx.lineTo(48, -40); ctx.lineTo(-48, -40); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i = -3; i <= 3; i += 2) ctx.fillRect(i * 12 - 4, -64, 8, 24);
  ctx.fillStyle = '#c99a5c'; ctx.fillRect(-40, -26, 80, 10);
  ctx.restore();
  if (lamp > 0) glow(x, y - 50 * s, 60 * s * lamp, 'rgba(255,190,110,.55)');
}
// Bizans tacı (sembolsüz: kubbeli altın taç, inci sıraları, yanlarda sarkan inci dizileri, mor taşlar). Merkez (0,0)
function tacCiz(t) {
  ctx.fillStyle = lg(0, -170, 0, 10, [[0, '#fff0b8'], [.4, '#e8b448'], [1, '#8a5a18']]);
  ctx.beginPath(); ctx.moveTo(-120, -60); ctx.quadraticCurveTo(-118, -180, 0, -186); ctx.quadraticCurveTo(118, -180, 120, -60); ctx.closePath(); ctx.fill();   // kubbe
  ctx.strokeStyle = 'rgba(90,50,10,.6)'; ctx.lineWidth = 3; for (const k of [-.55, 0, .55]) { ctx.beginPath(); ctx.moveTo(k * 120, -60); ctx.quadraticCurveTo(k * 130, -150, 0, -184); ctx.stroke(); }
  ctx.fillStyle = lg(0, -70, 0, 20, [[0, '#ffe6a0'], [.5, '#d8a038'], [1, '#7a4c12']]); ctx.beginPath(); ctx.roundRect(-136, -70, 272, 84, 14); ctx.fill();          // bant
  ctx.strokeStyle = '#5a3608'; ctx.lineWidth = 3; ctx.stroke();
  for (let i = -3; i <= 3; i++) { const gx = i * 36; ctx.fillStyle = i % 2 ? '#6a2a8a' : '#a8322a'; ctx.beginPath(); ctx.ellipse(gx, -28, 11, 15, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(gx - 3, -33, 3.5, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#f6f0e2'; for (let i = 0; i <= 16; i++) { ctx.beginPath(); ctx.arc(-128 + i * 16, -64, 4.5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-128 + i * 16, 8, 4.5, 0, TAU); ctx.fill(); }
  for (const d of [-1, 1]) { const sw = Math.sin(t * 1.6 + d) * 4; ctx.strokeStyle = 'rgba(240,230,210,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(d * 120, 12); ctx.lineTo(d * 126 + sw, 120); ctx.stroke();
    ctx.fillStyle = '#f6f0e2'; for (let i = 1; i <= 7; i++) { ctx.beginPath(); ctx.arc(d * 120 + (d * 6 + sw) * i / 7, 12 + i * 15, 5, 0, TAU); ctx.fill(); } ctx.fillStyle = '#6a2a8a'; ctx.beginPath(); ctx.ellipse(d * 126 + sw, 132, 9, 13, 0, 0, TAU); ctx.fill(); }
}
// taç: split 0..1 ortadan çatlayıp iki yana ayrılır (iki imparator → Bölüm 5)
const CRACK = [[8, -200], [-10, -150], [12, -104], [-8, -60], [10, -16], [-6, 30], [6, 150]];
function bizansTaci(x, y, s, t, split, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s);
  glow(0, -70, 360, 'rgba(160,110,200,.35)');
  if (split <= 0) tacCiz(t);
  else {
    const sp = eOut(clamp(split)), dx = 70 * sp, rot = .16 * sp;
    for (const d of [-1, 1]) {
      ctx.save(); ctx.translate(d * dx, 14 * sp); ctx.rotate(d * rot);
      ctx.beginPath(); ctx.moveTo(d * 400, -400); ctx.lineTo(CRACK[0][0], -400); for (const [cx, cy] of CRACK) ctx.lineTo(cx, cy); ctx.lineTo(CRACK[CRACK.length - 1][0], 400); ctx.lineTo(d * 400, 400); ctx.closePath(); ctx.clip();
      tacCiz(t); ctx.restore();
    }
    const gk = Math.sin(Math.PI * clamp(split * 1.6)); if (gk > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,120,90,${.8 * gk})`; ctx.lineWidth = 10; tracePath(CRACK); ctx.stroke(); ctx.restore(); }
  }
  ctx.restore();
}
// harita: sur halkası (ekran yarıçapı)
function surHalka(x, y, r, col, a, w = 6, dash) {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
}
// ekran yazısı etiketi (Montserrat, kâğıt halesiz; koyu kontur)
function etiket(s, x, y, size, a, o = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); setFont(size, o.fam || F.mont, o.w || 900); ctx.letterSpacing = (o.sp ?? 4) + 'px'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = size * .28; ctx.strokeStyle = 'rgba(10,6,4,.8)'; ctx.strokeText(s, x, y); ctx.fillStyle = o.col || '#f4ead2'; ctx.fillText(s, x, y); ctx.restore();
}
// harita gece/akşam tonu
function tonOrt(col, a) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }

/* ======================= kale işaretleri (temsilî; sayı ve konum iddia edilmez, FACTS #29) ======================= */
const KALELER = (() => {
  const poly = [[28.55, 40.05], [28.75, 40.32], [29.05, 40.38], [29.3, 40.47], [29.65, 40.52], [30.1, 40.55], [30.4, 40.75], [30.75, 40.85], [31.1, 40.7], [31.2, 40.3], [30.9, 39.85], [30.4, 39.7], [29.8, 39.65], [29.2, 39.7], [28.7, 39.85]];
  const inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const lake = (x, y, cx, cy, rx, ry) => Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2) < 1;
  const R = rng(1333), pts = [];
  for (let n = 0; n < 4000 && pts.length < 44; n++) {
    const lon = 28.5 + R() * 2.75, lat = 39.62 + R() * 1.25;
    if (!inside(lon, lat) || lake(lon, lat, 29.55, 40.44, .24, .09) || lake(lon, lat, 28.55, 40.17, .18, .06)) continue;
    const p = LL(lon, lat); if (pts.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 15)) continue;
    pts.push(p);
  }
  // dolaşma sırası: Bursa'dan başlayan en yakın komşu yolu
  const order = [], left = pts.slice(); let cur = BUR;
  while (left.length) { let bi = 0, bd = 1e9; left.forEach((q, i) => { const d = Math.hypot(q[0] - cur[0], q[1] - cur[1]); if (d < bd) { bd = d; bi = i; } }); cur = left.splice(bi, 1)[0]; order.push(cur); }
  return order;
})();

/* ======================= ortak kameralar ======================= */
function bizCam(t) {   // bizans → sefer → pelekanon → sessizlik → iznik (p4–p5)
  const a = C('p4-0.3'), b = C('p4:Bin'), A = [5, 40, 12], K = [6, -42, 9.5];
  if (t < b) return flyTo(A, K, eIO(seg(t, a, b)));
  return camAt([[b, ...K], [C('p4:Andronikos') + .4, 4, -46, 10.5], [C('p4:kuşatma') + .7, 30, -18, 7.2], [C("p4:Boğaz'ı") + .3, 22, -31, 8.4],
    [C('p4:Ama') + .3, 27, -31, 9.6], [C('p4:dağıldı') + .4, 25, -33, 10.6], [C('p5-0.3'), 34, -12, 7.0], [C('p5:iki'), 50, 0, 9.5],
    [C('p5:açtı') + .4, 58, 3.5, 13.5], [C('p5:Şehrin'), 60, 5.5, 15.5]], t, .004);
}
function ucCam(t) {    // kaleler → izmit → bitinya (p6–p7)
  return camAt([[C('p6:Ona-0.25'), 70, 36, 3.5], [C('p6:yüz'), 74, 30, 4.0], [C('p6.end'), 72, 30, 4.25], [C('p7:İzmit') + .3, 70, -22, 10.5],
    [C('p7:teslim') + .4, 74, -26, 12], [C("p7:Bitinya'nın") + .6, 46, 6, 7.4], [C('p8-0.3'), 40, 10, 7.6]], t, .004);
}

window.SCENE_FNS = {
  /* p1: "Bin üç yüz yirmi altı baharında, yıllarca süren kuşatmanın sonunda Bursa'nın kapıları açıldı." */
  kapi(t, s) {
    const ta = C('p1:açıldı'), open = eIO(seg(t, ta - .25, ta + 1.3));
    const z = lerp(1, 1.1, eIO(seg(t, s.t0, ta))) * lerp(1, 1.5, eIn(seg(t, ta + .2, s.t1 + .3)));
    ctx.save(); ctx.translate(540, 1080); ctx.scale(z, z); ctx.translate(-540, -1080);
    kapiManzara(t, open, { dawn: lerp(.45, .75, seg(t, s.t0, s.t1)) });
    // kapının önünde bekleyen atlılar (kenarda)
    nobetAtli(150, 1300, .78, t, { ph: .3 }); nobetAtli(930, 1300, .78, t, { ph: 1.1, flip: true });
    ctx.restore();
    const hp = hitPulse(t, ta, 1.2); if (hp > 0) glow(540, 1080, 700 * hp, 'rgba(255,220,160,.6)');
    // T1: yıl levhası ilk karede; başlık kartı gelince söner
    const tc = C('p1:baharında+0.2');
    yearTicker(W / 2, 470, 1326, 120, { label: 'BAHAR', a: 1 - seg(t, tc - .3, tc) });
  },
  /* "Şehir kılıçla değil bir anlaşmayla teslim oldu:" — kılıç kınına girer, mühür basılır */
  anlasma(t, s) {
    const tk = C('p1:kılıçla'), td = C('p1:değil'), tn = C('p1:anlaşmayla'), z = lerp(1.06, 1.14, eIO(seg(t, s.t0, s.t1)));
    ctx.fillStyle = rg(540, 900, 60, 1200, [[0, '#4a3020'], [.6, '#24160e'], [1, '#0a0604']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.rotate(-.02); ctx.translate(-540, -900);
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.moveTo(-100, 300 + i * 110); ctx.lineTo(W + 100, 280 + i * 110); ctx.stroke(); }
    parchment(540, 900, 640, 760, { rot: -.035, seed: 13 });
    inkScript(540, 650, 470, 9, t, s.t0 - 3, .01, { style: 'arabic', lh: 46, seed: 4, col: 'rgba(42,26,12,.8)' });
    // kılıç: yarı çekik → "kılıçla"da kınına girer → "değil"de kalkıp çekilir
    const sh = eIO(seg(t, tk, td + .1)), lift = eIO(seg(t, td, tn + .1));
    ctx.save(); ctx.globalAlpha = 1 - seg(t, tn - .1, tn + .2);
    kilic(lerp(215, -120, lift), lerp(1190, 1500, lift), -.62 - .3 * lift, 640, lerp(.42, 0, sh));
    ctx.restore();
    const mk = seg(t, tn + .25, tn + .5); muhur(700, 1120, 58, mk);
    const hp = hitPulse(t, tn + .3, 1.0); if (hp > 0) glow(700, 1120, 220 * hp, 'rgba(255,150,110,.5)');
    ctx.restore();
    glow(300, 600, 600, 'rgba(255,180,110,.12)');
  },
  /* "kimseye dokunulmayacak, gitmek isteyen malını alıp gidecekti." — aynı kapıdan halk eşyasıyla çıkar */
  cikis(t, s) {
    const tg = C('p1:gitmek'), el = t - s.t0, z = lerp(.92, .98, eIO(seg(t, s.t0, s.t1))), px = lerp(0, -30, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540 + px, -1100);
    kapiManzara(t, 1, { dawn: .85 });
    // atlılar yolun iki yanında; mızraklar dik (kimseye dokunulmayacak)
    nobetAtli(90, 1330, .8, t, { ph: .2 }); nobetAtli(230, 1360, .86, t, { ph: .9 });
    nobetAtli(850, 1360, .86, t, { ph: 1.4, flip: true }); nobetAtli(990, 1330, .8, t, { ph: 2.1, flip: true });
    // kapıdan çıkanlar: iki kol (sola ve sağa), uzaklaştıkça büyür; "gitmek"te akış sıklaşır
    const R = rng(1326), N = 16;
    const people = [];
    for (let i = 0; i < N; i++) {
      const start = i * .42 - 1.2 + R() * .2 - (i > 7 ? .9 * seg(tg - s.t0, 0, 2) : 0), side = i % 2 ? 1 : -1, kind = Math.floor(R() * 4), u = (el - start) / 4.2;
      if (u <= 0 || u >= 1) continue;
      const e = eIn(u * .85 + .15) / eIn(1);
      people.push({ u, x: 540 + side * (12 + 230 * e) + (R() - .5) * 30, y: lerp(1245, 1440, e), sc: lerp(.22, .92, e), kind, ph: R(), side });
    }
    people.sort((p, q) => p.y - q.y).forEach(p => { if (p.kind === 3 && p.u > .3 && p.u < .32) {} gocmen(p.x, p.y, p.sc, t, { kind: p.kind === 3 && p.side > 0 ? 0 : p.kind, ph: p.ph, side: p.side * 26, load: p.kind === 1 ? '#5a3a20' : '#3a2414' }); });
    // kağnı (yüklü) "malını"da kapıdan çıkar
    const ku = (t - C('p1:malını') + .6) / 4.2; if (ku > 0 && ku < 1) { const e = eIn(ku * .85 + .15); kagni(540 - 40 * e, lerp(1245, 1440, e), lerp(.22, .9, e), t, { ph: .4 }); }
    ctx.restore();
  },
  /* p2: "Ama Osman bu günü göremedi; beyliğin başında artık oğlu Orhan vardı." */
  tug(t, s) {
    const to = C('p2:Osman'), tg = C('p2:göremedi'), tor = C('p2:Orhan'), dim = eIO(seg(t, tg - .1, tg + 1.0)), pan = eIO(seg(t, tg + .6, tor + .2));
    ctx.fillStyle = lg(0, 0, 0, 1300, [[0, '#120e22'], [.5, '#3a2638'], [.8, '#8a4a3a'], [1, '#c4703e']]); ctx.fillRect(0, 0, W, H);
    glow(820, 1180, 600, 'rgba(255,160,90,.35)');
    stars(t, .35);
    const cx = lerp(380, 700, pan), z = lerp(1.0, 1.05, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-cx, -1100);
    ctx.fillStyle = '#1a1018'; ctx.beginPath(); ctx.moveTo(-300, 1300); for (let x = -300; x <= 1500; x += 30) ctx.lineTo(x, 1180 - 40 * Math.sin(x * .004 + .6) - 12 * Math.cos(x * .013)); ctx.lineTo(1500, 1400); ctx.lineTo(-300, 1400); ctx.fill();
    ctx.fillStyle = lg(0, 1200, 0, H, [[0, '#120a0e'], [1, '#030203']]); ctx.fillRect(-300, 1260, 1800, 900);
    // Osman'ın tuğu: söner (rüzgâr durur, renk solar)
    const tt = lerp(t, tg + 1.0, dim);
    ctx.save(); ctx.globalAlpha = 1 - .55 * dim; tug(380, 1235, .92, tt, { sil: dim > .5 ? '#2a2026' : null }); ctx.restore();
    if (dim < 1) glow(380, 1235 - 590, 160 * (1 - dim), 'rgba(255,214,140,.45)');
    // Orhan'ın tuğu: ışığı alır
    const ok = eOut(seg(t, tor - .3, tor + .8));
    tug(760, 1235, .98, t, {}); if (ok > 0) glow(760, 1235 - 600, 260 * ok, 'rgba(255,214,140,.55)');
    ctx.restore();
    kinetic('OSMAN', W / 2 + (380 - cx) * z, 520, 64, t, to, { mode: 'fade', fam: F.cinzel, w: 900, col: mix('#f4ead2', '#8a8088', dim), spacing: 6, out: tor - .4 });
    kinetic('ORHAN', W / 2 + (760 - cx) * z, 520, 76, t, tor, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6 });
  },
  /* "Orhan babasını Bursa'da, eski bir manastırın gümüş kubbesinin altına gömdü." — sakin, hüzünlü (Bölüm 3'teki rivayetin karşılığı) */
  kubbe(t, s) {
    const tgu = C('p2:gümüş'), tgo = C('p2:gömdü'), z = lerp(1.0, 1.16, eIO(seg(t, s.t0, s.t1 + .4)));
    ctx.fillStyle = lg(0, 0, 0, 1300, [[0, '#0e1226'], [.55, '#2a2440'], [.85, '#6a4250'], [1, '#a0624a']]); ctx.fillRect(0, 0, W, H);
    stars(t, .5);
    ctx.save(); ctx.translate(560, 980); ctx.scale(z, z); ctx.translate(-560, -980);
    // Uludağ silueti ve hisar tepesi
    ctx.fillStyle = '#211c30'; ctx.beginPath(); ctx.moveTo(-200, 1000); for (let x = -200; x <= 1300; x += 30) ctx.lineTo(x, 900 - 330 * Math.exp(-Math.pow((x - 260) / 380, 2)) - 18 * Math.sin(x * .02)); ctx.lineTo(1300, 1300); ctx.lineTo(-200, 1300); ctx.fill();
    ctx.fillStyle = '#16121c'; ctx.beginPath(); ctx.moveTo(-200, 1300); ctx.quadraticCurveTo(200, 1110, 560, 1080); ctx.quadraticCurveTo(900, 1090, 1300, 1240); ctx.lineTo(1300, 1700); ctx.lineTo(-200, 1700); ctx.fill();
    ctx.fillStyle = '#100d14'; for (let x = 60; x < 1040; x += 46) { const yy = 1105 + Math.pow((x - 560) / 520, 2) * 120; ctx.fillRect(x, yy - 34, 30, 40); } // hisar dişleri
    // selviler
    for (const [cx2, h] of [[300, 260], [360, 200], [800, 280], [870, 210]]) { ctx.fillStyle = '#0c0a10'; ctx.beginPath(); ctx.moveTo(cx2, 1100 - h); ctx.quadraticCurveTo(cx2 + 30, 1100 - h * .5, cx2 + 14, 1100); ctx.lineTo(cx2 - 14, 1100); ctx.quadraticCurveTo(cx2 - 30, 1100 - h * .5, cx2, 1100 - h); ctx.fill(); }
    const door = .9 - .6 * eIO(seg(t, tgo, tgo + 1.6));
    gumusKubbe(560, 1092, 1.5, t, { shade: .45, shine: seg(t, tgu - .1, tgu + 1.5), door, halo: .25 });
    // kapıdaki yas tutanlar (siluet, hareketsiz)
    ctx.fillStyle = '#0a080c';
    for (const [mx, sc] of [[452, .95], [492, 1], [640, .98], [676, .9]]) { ctx.save(); ctx.translate(mx, 1098); ctx.scale(sc * .55, sc * .55); ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(-30, -110, -14, -150); ctx.lineTo(14, -150); ctx.quadraticCurveTo(30, -110, 26, 0); ctx.fill(); ctx.beginPath(); ctx.arc(0, -168, 17, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -180, 22, 12, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore();
  },
  /* p3: "Bursa, Orhan'ın elinde beyliğin yeni merkezine dönüştü." — harita 1326 */
  merkez(t, s) {
    const tb = C('p3:Bursa'), tm = C('p3:merkezine'), Y = lerp(1326.15, 1326.7, eIO(seg(t, s.t0 + .2, tb + .8)));
    const cam = camAt([[s.t0, 6, 42, 13], [tb + .5, 20, 44, 8.5], [tm + .4, 52, 50, 6.0], [s.t1 - .5, 40, 46, 7.0], [s.t1 + .3, 8, 38, 16]], t, .004);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25, glowCol: '#000000' });
    tonOrt('#6a5a80', .25 * (1 - seg(t, s.t0, s.t0 + 1.2)));
    const gk = eIO(seg(t, tm - .2, tm + 1.1));
    if (gk > 0) glowPath(cam, [[...SOG], [62, 52], [30, 40], [...BUR]], t, gk, { w: 7, col: '#ffcf6a', dash: true });
    ownCity(cam, 'Söğüt', Y, { size: 28, a: 1 - .45 * gk });
    ownCity(cam, 'Bursa', Y, { label: false, r: 9 });
    const [bx, by] = W2S(cam, ...BUR), rp = eOut(seg(t, tm + .6, tm + 1.4));
    if (rp > 0) { surHalka(bx, by, 26 + 10 * Math.sin(t * 2.4), '#f2c75c', rp * .9, 5); glow(bx, by, 150 * rp, 'rgba(255,214,130,.45)'); }
    const hp = hitPulse(t, tb + .5, 1.2); if (hp > 0) glow(bx, by, 200 * hp, 'rgba(255,190,120,.6)');
    mapPin(cam, ...BUR, t, tb - .05, 'BURSA', { date: '1326', size: 34, left: true, a: 1 - seg(t, s.t1 - .6, s.t1 - .2) });
  },
  /* "Burada basılan akçelerin üzerinde artık Orhan'ın adıyla birlikte şehrin adı yazıyordu." — yakın plan akçe */
  akce(t, s) {
    const tbs = C('p3:basılan'), to = C("p3:Orhan'ın#2"), tsh = C('p3:şehrin'), z = lerp(1, 1.08, eIO(seg(t, s.t0, s.t1)));
    ctx.fillStyle = rg(540, 900, 40, 1300, [[0, '#3a2414'], [.55, '#1c120a'], [1, '#060403']]); ctx.fillRect(0, 0, W, H);
    const R = rng(727);
    ctx.save(); for (let i = 0; i < 9; i++) { const x = R() * W, y = 380 + R() * 1100, r = 40 + R() * 50; ctx.globalAlpha = .18 + .12 * R(); coinIcon(x, y, r); } ctx.restore();
    glow(540, 900, 520, 'rgba(255,200,130,.18)');
    ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
    const ent = eOut(seg(t, s.t0, tbs + .5)), spin = eOut(seg(t, s.t0, tbs + 1.1)), fx = Math.cos(spin * TAU * 2);
    const r = 230 * lerp(.35, 1, ent);
    coin(540, 900 - 220 * (1 - ent), r, t, { flip: Math.abs(fx) < .04 ? .04 : fx, seed: 727, shine: lerp(-.3, 1.3, seg(t, tsh + .6, tsh + 1.8)) });
    // ok çizgileri: ORHAN (üst satır) ve BURSA (alt satır, darp yeri)
    const la = eOut(seg(t, to - .05, to + .45)), lb = eOut(seg(t, tsh - .05, tsh + .45));
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.fillStyle = GOLD;
    if (la > 0) { ctx.globalAlpha = la; ctx.beginPath(); ctx.moveTo(540, 612); ctx.lineTo(540, lerp(612, 820, la)); ctx.stroke(); ctx.beginPath(); ctx.arc(540, 826, 7 * la, 0, TAU); ctx.fill(); }
    if (lb > 0) { ctx.globalAlpha = lb; ctx.beginPath(); ctx.moveTo(540, 1180); ctx.lineTo(540, lerp(1180, 980, lb)); ctx.stroke(); ctx.beginPath(); ctx.arc(540, 974, 7 * lb, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.restore();
    kinetic('ORHAN', W / 2, 560, 72, t, to, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6 });
    kinetic('BURSA', W / 2, 1225, 72, t, tsh, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6 });
  },
  /* p4: "Bizans bu yükselişe seyirci kalmadı. Bin üç yüz yirmi dokuz yazında imparator Üçüncü Andronikos," — sikke düşer, Konstantinopolis'e uçuş */
  bizans(t, s) { bizHarita(t, s); },
  /* "kuşatma altındaki İznik'i kurtarmak için ordusuyla Boğaz'ı geçti." */
  sefer(t, s) { bizHarita(t, s); },
  /* "Ama Pelekanon'da bacağından yaralanınca "İmparator ölüyor" sözü bir anda yayıldı ve ordu dağıldı." */
  pelekanon(t, s) { bizHarita(t, s); },
  /* harita sessizliği (2 sn): dağılan ordu denize çekilir; İznik yalnız kalır */
  sessizlik(t, s) { bizHarita(t, s); },
  /* p5: "Kurtarılamayan İznik, iki yıl sonra kapılarını Orhan'a açtı." */
  iznik(t, s) { bizHarita(t, s); },
  /* "Şehrin büyük kilisesi camiye çevrildi" */
  kilise(t, s) {
    const tc = C('p5:camiye'), z = lerp(1, 1.08, eIO(seg(t, s.t0, s.t1)));
    ctx.fillStyle = lg(0, 0, 0, 1200, [[0, '#3c5a7a'], [.55, '#a8b4b8'], [.8, '#f2d2a2'], [1, '#e8b880']]); ctx.fillRect(0, 0, W, H);
    glow(820, 1000, 520, 'rgba(255,220,160,.35)');
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
    ctx.fillStyle = '#5a6a7e'; ctx.beginPath(); ctx.moveTo(-200, 1000); for (let x = -200; x <= 1300; x += 30) ctx.lineTo(x, 960 - 60 * Math.sin(x * .004 + 2) - 20 * Math.cos(x * .011)); ctx.lineTo(1300, 1100); ctx.lineTo(-200, 1100); ctx.fill();
    ctx.fillStyle = lg(0, 1000, 0, 1130, [[0, '#8aa0aa'], [1, '#5e7480']]); ctx.fillRect(-200, 1010, 1500, 120);   // İznik gölü
    ctx.strokeStyle = 'rgba(255,240,210,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { const x = fract(t * .05 + i / 6) * 1300 - 100; ctx.beginPath(); ctx.moveTo(x, 1040 + i * 14); ctx.lineTo(x + 80, 1040 + i * 14); ctx.stroke(); }
    ctx.fillStyle = lg(0, 1120, 0, H, [[0, '#3a2a20'], [1, '#0e0806']]); ctx.fillRect(-200, 1125, 1500, 900);
    kiliseCiz(560, 1230, 1.0, { col: '#5a4434', light: seg(t, tc, tc + 1.2) });
    minare(205, 1230, 1.0, seg(t, tc - .1, tc + 1.3), { light: seg(t, tc + .8, tc + 1.6) });
    ctx.restore();
  },
  /* "ve Orhan burada, Osmanlıların ilk medresesi olarak hatırlanan okulu kurdu." */
  medrese(t, s) {
    const tm = C('p5:medresesi'), tk = C('p5:okulu'), z = lerp(1.0, 1.12, eIO(seg(t, s.t0, s.t1)));
    ctx.fillStyle = lg(0, 0, 0, 1100, [[0, '#141a30'], [.6, '#3a2c3a'], [1, '#7a4a3a']]); ctx.fillRect(0, 0, W, H);
    stars(t, .4);
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
    revakCiz(540, 1170, 1000, 5, t, seg(t, tm - .3, tk + .4));
    ctx.fillStyle = lg(0, 1170, 0, H, [[0, '#2a1c14'], [1, '#080504']]); ctx.fillRect(-200, 1168, 1500, 900);
    ctx.strokeStyle = 'rgba(120,90,60,.25)'; ctx.lineWidth = 2; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-200, 1190 + i * 26); ctx.lineTo(1300, 1190 + i * 26); ctx.stroke(); }
    rahle(540, 1300, 1.05, t, eOut(seg(t, tk - .1, tk + .8)));
    seated(320, 1310, .62, { hat: 'sarik', rim: 'rgba(255,170,80,.45)', col: '#0c0806' });
    seated(760, 1310, .62, { hat: 'sarik', flip: true, rim: 'rgba(255,170,80,.45)', col: '#0c0806' });
    ctx.restore();
    kinetic('İZNİK MEDRESESİ', W / 2, 520, 46, t, tm, { mode: 'fade', fam: F.cinzel, w: 900, gold: true, spacing: 5 });
  },
  /* p6: "Bu yıllarda Fas'tan gelen gezgin İbn Battûta da Orhan'ın topraklarından geçti." */
  gezgin(t, s) {
    const ti = C('p6:İbn'), el = t - s.t0, cx = 380 + el * 40;
    skyLand(t, { k: .9, sun: true, mist: true });
    ctx.save(); ctx.translate(540 - cx + 380, 0);
    ctx.fillStyle = '#5e5440'; ctx.beginPath(); ctx.moveTo(-400, 1300); for (let x = -400; x <= 2200; x += 40) ctx.lineTo(x, 1215 - 26 * Math.sin(x * .005 + .4) - 10 * Math.cos(x * .015)); ctx.lineTo(2200, 1400); ctx.lineTo(-400, 1400); ctx.fill();
    ctx.fillStyle = lg(0, 1260, 0, H, [[0, '#6e5a3a'], [.3, '#3a2c1c'], [1, '#0e0906']]); ctx.fillRect(-400, 1270, 2600, 900);
    ctx.strokeStyle = 'rgba(230,200,150,.25)'; ctx.lineWidth = 3; ctx.setLineDash([40, 30]); ctx.beginPath(); ctx.moveTo(-400, 1318); ctx.lineTo(2200, 1318); ctx.stroke(); ctx.setLineDash([]);
    for (const [tx, h] of [[150, 160], [900, 210], [1500, 180]]) { ctx.fillStyle = '#2a2418'; ctx.beginPath(); ctx.arc(tx, 1250 - h, h * .45, 0, TAU); ctx.fill(); ctx.fillRect(tx - 8, 1250 - h, 16, h); }
    const wx = 260 + el * 40;
    yolAti(wx - 250, 1310, .82, t, { load: '#4a3020', ph: .5, sil: '#141008' });
    yolAti(wx, 1310, .95, t, { rider: true, ph: .1, sil: '#100c06' });
    ctx.restore();
    kinetic('İBN BATTÛTA', W / 2, 520, 72, t, ti, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 4 });
  },
  /* "Ona göre Orhan, Türkmen beylerinin en zenginiydi: yüz kadar kalesi vardı ve vaktinin çoğu onları tek tek dolaşmakla geçiyordu." */
  kaleler(t, s) {
    const Y = 1333.3, cam = ucCam(t), tz = C('p6:zenginiydi'), ty = C('p6:yüz'), td = C('p6:onları'), tend = C('p7-0.3');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2, glowCol: '#000000' });
    // zenginlik: yollardan Bursa'ya akan akçeler
    const fa = seg(t, tz - .9, tz) * (1 - seg(t, ty - .2, ty + .4));
    flowDots(cam, [[...SOG], [62, 50], [30, 40], [...BUR]], t, fa, { n: 9, speed: .3, r: 10 });
    flowDots(cam, [[...IZN], [36, 18], [...BUR]], t, fa, { n: 7, speed: .32, r: 10 });
    flowDots(cam, [LL(29.3, 39.75), [-6, 70], [...BUR]], t, fa, { n: 7, speed: .28, r: 10 });
    ownCity(cam, 'Bursa', Y, { size: 30, label: false });
    const [bx, by] = W2S(cam, ...BUR); if (fa > 0) glow(bx, by, 120 * fa, 'rgba(255,214,130,.55)');
    mapLabel(cam, 'BURSA', BUR[0] - 4, BUR[1] + 12, 30, { a: 1 - seg(t, ty, ty + .5) });
    // yüz kadar kale (temsilî işaretler) ve onları tek tek dolaşan altın iz
    const N = KALELER.length, rk = eIO(seg(t, td - .2, tend)), route = [[...BUR], ...KALELER];
    if (rk > 0) glowPath(cam, route, t, rk, { w: 4, col: '#ffcf6a', a: .9 });
    KALELER.forEach((p, i) => {
      const t0 = ty - .15 + i * .02, a = spring(t, t0, { freq: 2.4, damp: .55 }), [x, y] = W2S(cam, ...p);
      const lit = clamp(rk * (N + 1) - i - 1, 0, 1) * (1 - .5 * clamp(rk * (N + 1) - i - 3));
      kaleIsaret(x, y, 1.15 * clamp(a, 0, 1.3), clamp(a), lit);
    });
    if (rk > 0 && rk < 1) { const P = spline(route.map(p => W2S(cam, ...p)), 12), L = polyLen(P), [rx, ry] = pointAt(P, L, rk); glow(rx, ry, 70, 'rgba(255,224,150,.9)'); ctx.fillStyle = '#fff4d0'; ctx.beginPath(); ctx.arc(rx, ry, 7, 0, TAU); ctx.fill(); }
  },
  /* p7: "Geriye Bizans'ın bölgedeki son büyük şehri İzmit kalmıştı. Bin üç yüz otuz yedide erzakı tükenince o da teslim oldu" */
  izmit(t, s) { ucHarita(t, s); },
  /* "ve Bitinya'nın üç büyük şehri Orhan'ın eline geçti." */
  bitinya(t, s) { ucHarita(t, s); },
  /* p8: "Fetihlerin ardından Orhan Bursa'yı imar etti. Surların dışında bir cami, bir aşevi ve bir han yaptırdı." */
  imar(t, s) { bursaSehir(t, s); },
  /* "Çarşı bu hanın çevresinde büyüdü ve uçtaki beylik bir devlete dönüştü." — sezon ağacı büyür */
  carsi(t, s) { bursaSehir(t, s); },
  /* p9: "Ama Bizans'ın asıl yarası dışarıdan değil, içeriden açılacaktı." — Konstantinopolis; taç içeriden çatlar */
  yara(t, s) {
    const Y = 1340, tb = C("p9:Bizans'ın"), tdis = C('p9:dışarıdan'), tic = C('p9:içeriden'), tend = C('p9.end');
    const A = [40, 10, 7.6], K = [-2, -40, 12];
    const cam = t < tb + .4 ? flyTo(A, K, eIO(seg(t, s.t0, tb + .4))) : camAt([[tb + .4, ...K], [tic, -2, -44, 13.5], [tend + 2, -2, -46, 14.5]], t, .004);
    drawTimeMap(t, cam, Y, { focus: 'BIZ', dim: .35, glowCol: '#000000' });
    tonOrt('#4a3a6a', .3 * seg(t, s.t0, tb + .5));
    const [kx, ky] = W2S(cam, ...KON);
    // dışarıdan gelen oklar Boğaz'da durur
    const ak = eIO(seg(t, tdis - .3, tdis + .6)), stop = 1 - seg(t, tic - .2, tic + .4) * .6;
    if (ak > 0) { ctx.save(); ctx.globalAlpha = stop; arrow(cam, [[40, -10], [22, -26], [10, -38]], ak * .9, 16, OSMC); arrow(cam, [[30, 20], [16, -6], [8, -28]], ak * .8, 14, OSMC); ctx.restore(); }
    ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 10 });
    // içeriden çatlak: şehrin üzerinde
    const ck = seg(t, tic - .05, tic + 1.0); if (ck > 0) { ctx.save(); ctx.globalAlpha = .9; cracks(kx, ky, ck, 21, { n: 6, len: 260 }); ctx.restore(); }
    // Bizans tacı şehrin üstünde
    const ta = eOut(seg(t, tb - .1, tb + .7));
    bizansTaci(W / 2, 760 + 12 * Math.sin(t * 1.2), .95 * lerp(.7, 1, ta), t, seg(t, tic, tic + 1.4), ta);
    const hp = hitPulse(t, tic, 1.3); if (hp > 0) glow(W / 2, 700, 380 * hp, 'rgba(255,120,90,.5)');
    mapLabel(cam, 'KONSTANTİNOPOLİS', KON[0] - 2, KON[1] + 7, 30, { a: seg(t, tb, tb + .5) * (1 - seg(t, tend + .3, tend + .8)), col: '#2a1838' });
  },
};

/* ---------- p4–p5 haritası: Bizans'ın kurtarma seferi, Pelekanon, İznik ---------- */
// dağılan ordu: noktalar okun ucundan saçılır, sonra kıyıdan Konstantinopolis'e çekilir
const ORDU = (() => { const R = rng(1329); return Array.from({ length: 30 }, () => ({ dx: (R() - .5) * 16, dy: (R() - .5) * 12, lag: R() * .9, j: R() * TAU, r: 3 + R() * 3 })); })();
function bizHarita(t, s) {
  const tBz = C('p4:Bizans'), tBin = C('p4:Bin'), tImp = C('p4:imparator'), tKus = C('p4:kuşatma'), tOr = C('p4:ordusuyla'), tGe = C('p4:geçti');
  const tAma = C('p4:Ama'), tPel = C("p4:Pelekanon'da"), tYar = C('p4:yaralanınca'), tSoz = C('p4:imparator#2'), tDag = C('p4:dağıldı'), tEnd = C('p4.end');
  const tP5 = C('p5-0.3'), tIki = C('p5:iki'), tOrh = C("p5:Orhan'a"), tAc = C('p5:açtı');
  // yıl: 1329 (Pelekanon) → p5'te 1331 (İznik'in teslimi). Harita yılı İznik'in rengini tam "açtı"da değiştirir
  const yTk = t < tIki ? 1329 : lerp(1329, 1331, eIO(seg(t, tIki, C('p5:sonra') + .3)));
  const Y = t < tIki ? 1329.45 : t < tAc - .1 ? lerp(1329.45, 1331.15, seg(t, tIki, tAc - .1)) : lerp(1331.15, 1331.6, seg(t, tAc - .1, tAc + .5));
  const cam = bizCam(t);
  drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .22, glowCol: '#000000' });
  // sikke haritaya düşer (akçe sahnesinden taşınan nesne)
  const cf = 1 - seg(t, s.t0 + .1, s.t0 + .9); if (s.id === 'bizans' && cf > 0) { const [bx, by] = W2S(cam, ...BUR); ctx.save(); ctx.globalAlpha = cf; coinIcon(bx, by, 26 * (.6 + .4 * cf)); ctx.restore(); }
  ownCity(cam, 'Bursa', Y, { size: 26, a: 1 - seg(t, tBin, tBin + .6) });
  mapLabel(cam, 'BİZANS', -6, -76, 44, { a: seg(t, tBz - .1, tBz + .5) * (1 - seg(t, tKus, tKus + .6)), col: '#3a2250' });
  // İznik: Bizans surları + Osmanlı kuşatma halkası (1329'da kuşatma altında)
  const [ix, iy] = W2S(cam, ...IZN), z = cam[2];
  const ia = seg(t, tKus - .3, tKus + .4), turned = seg(t, tAc - .1, tAc + .5);
  surHalka(ix, iy, 3.6 * z, mix(BIZC, OSMC, turned), Math.max(ia, t > tP5 ? 1 : 0), 6);
  const sq = t < tEnd ? 0 : eIO(seg(t, tEnd, tAc));
  const rr = lerp(8.5, 5.2, sq) * z;
  surHalka(ix, iy, rr + 9, 'rgba(168,50,42,.22)', Math.max(ia, t > tP5 ? 1 : 0) * (1 - turned), 18);
  surHalka(ix, iy, rr, OSMC, Math.max(ia, t > tP5 ? 1 : 0) * (1 - turned), 5, [16, 10]);
  ownCity(cam, 'İznik', Y, { label: false, r: 8, a: Math.max(ia, t > tP5 ? 1 : 0) });
  if (turned > 0) { const hp = hitPulse(t, tAc, 1.4); glow(ix, iy, 120 + 260 * hp, `rgba(255,200,130,${.3 + .4 * hp})`); }
  mapLabel(cam, 'İZNİK', IZN[0] + 1, IZN[1] - 11, 30, { a: ia * (1 - seg(t, tP5 - .4, tP5)) });
  // imparatorun ordusu: Konstantinopolis → Boğaz → kıyı boyunca Pelekanon
  const path = [[...KON], [...USK], [12, -46], [24, -38], [PEL[0] - 2, PEL[1] - 2]];
  const ak = eIO(seg(t, tOr - .2, tGe + .5)), gone = seg(t, tDag - .05, tDag + .45);
  const jit = hitPulse(t, tYar, .9);
  if (ak > 0 && gone < 1) { const P2 = path.map(p => p.slice()); P2[P2.length - 1][0] += Math.sin(t * 46) * 1.2 * jit; ctx.save(); ctx.globalAlpha = 1 - gone; arrow(cam, P2, ak, 24, BIZC, { col0: '#5a3f78' }); ctx.restore(); }
  // Orhan'ın kuvvetleri İznik'ten Pelekanon'a
  const ok = eIO(seg(t, tAma - .1, tPel + .5)), oa = 1 - seg(t, tEnd + .4, tP5 + .2);
  if (ok > 0 && oa > 0) { ctx.save(); ctx.globalAlpha = oa; arrow(cam, [[IZN[0] - 7, IZN[1] - 6], [48, -10], [42, -22], [PEL[0] + 4, PEL[1] + 1]], ok, 20, OSMC); ctx.restore(); }
  const [px, py] = W2S(cam, ...PEL);
  const hp1 = hitPulse(t, tPel + .3, 1.2); if (hp1 > 0) glow(px, py, 260 * hp1, 'rgba(255,210,150,.6)');
  // yara: okun ucunda kırmızı halka
  const yk = seg(t, tYar, tYar + .8); if (yk > 0 && gone < 1) { const [hx, hy] = W2S(cam, PEL[0] - 2, PEL[1] - 2); surHalka(hx, hy, lerp(10, 70, eOut(yk)), '#c0392b', (1 - yk) * (1 - gone), 6); glow(hx, hy, 140 * (1 - yk), 'rgba(220,60,40,.55)'); }
  // söylenti: okun ucundan mor ordunun üstüne yayılan halkalar
  const sa = seg(t, tSoz - .1, tSoz + .3) * (1 - seg(t, tDag + .2, tDag + .9));
  if (sa > 0) { const [hx, hy] = W2S(cam, PEL[0] - 2, PEL[1] - 2); for (let i = 0; i < 3; i++) { const q = fract((t - tSoz) * .8 + i / 3); ctx.save(); ctx.globalAlpha = sa * (1 - q) * .8; ctx.strokeStyle = '#efe6ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(hx - 40 * q, hy - 30 * q, 30 + 300 * q, 20 + 200 * q, -.5, 0, TAU); ctx.stroke(); ctx.restore(); } }
  // ordu dağılır: noktalar saçılır, sonra Boğaz'a ve Konstantinopolis'e çekilir
  if (t > tDag - .05) {
    const back = [[PEL[0] - 2, PEL[1] - 2], [24, -38], [12, -46], [...USK], [...KON]];
    const BP = spline(back, 10), BL = polyLen(BP);
    ORDU.forEach(d => {
      const sc = eOut(seg(t, tDag - .05, tDag + .5)), u = eIO(seg(t, tDag + .4 + d.lag, tP5 + .6 + d.lag));
      const [bx2, by2] = pointAt(BP, BL, u), off = (1 - u) * sc;
      const wx = bx2 + d.dx * off + Math.sin(t * 3 + d.j) * .4, wy = by2 + d.dy * off;
      const [sx, sy] = W2S(cam, wx, wy), a = clamp(sc * 2) * (1 - seg(u, .85, 1));
      if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = BIZC; ctx.strokeStyle = '#2a1838'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(sx, sy, d.r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); }
    });
  }
  const dp = hitPulse(t, tDag, 1.2); if (dp > 0) glow(px, py, 340 * dp, 'rgba(255,200,150,.5)');
  ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 9 });
  const ka = 1 - .5 * seg(t, tEnd, tEnd + 1.2);
  mapPin(cam, ...KON, t, tImp - .05, 'KONSTANTİNOPOLİS', { date: 'III. ANDRONİKOS', size: 30, col: BIZC, a: ka * (1 - seg(t, tP5 - .2, tP5 + .3)) });
  mapPin(cam, ...PEL, t, tPel - .05, 'PELEKANON', { size: 30, left: true, col: BIZC, a: 1 - seg(t, tEnd + .6, tP5) });
  mapPin(cam, ...IZN, t, tAc - .05, 'İZNİK', { size: 34, left: true });
  // yıl sayacı: 1329 (p4) · 1331 (p5)
  const ya = seg(t, tBin - .1, tBin + .3) * (1 - seg(t, tAma - .3, tAma + .1)) + seg(t, tIki - .2, tIki + .2) * (1 - seg(t, tAc + .6, tAc + 1.0));
  if (ya > 0) yearTicker(W / 2, 470, yTk, 116, { a: clamp(ya) });
}

/* ---------- p6–p7 haritası: İzmit ve Bitinya'nın üç şehri ---------- */
function ucHarita(t, s) {
  const tIz = C('p7:İzmit'), tBin = C('p7:Bin'), tYe = C('p7:yedide'), tEr = C('p7:erzakı'), tTe = C('p7:teslim'), tBi = C("p7:Bitinya'nın"), tUc = C('p7:üç#2'), tSe = C('p7:şehri#2'), tOr = C("p7:Orhan'ın"), tEnd = C('p7.end');
  const yTk = lerp(1333, 1337, eIO(seg(t, tBin - .1, tYe + .3)));
  const Y = t < tTe - .1 ? Math.min(lerp(1333.3, 1336.95, seg(t, s.t0, tTe - .1)), 1336.95) : lerp(1336.95, 1338.0, eIO(seg(t, tTe - .1, tEnd)));
  const cam = ucCam(t);
  drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .22 });
  const [zx, zy] = W2S(cam, ...IZM), z = cam[2], turned = seg(t, tTe - .1, tTe + .5);
  // kuşatılmış İzmit: Bizans surları, içeride ışıklar; erzak tükendikçe ışıklar söner
  const lamps = 1 - eIO(seg(t, tEr - .1, tTe));
  const R = rng(1337); for (let i = 0; i < 10; i++) { const a = R() * TAU, d = R() * 2.4 * z; const fl = .7 + .3 * Math.sin(t * 4 + i); if (lamps > 0) { glow(zx + Math.cos(a) * d, zy + Math.sin(a) * d * .7, 22 * lamps * fl, 'rgba(255,190,110,.75)'); } }
  surHalka(zx, zy, 3.4 * z, mix(BIZC, OSMC, turned), 1, 6);
  const sq = eIO(seg(t, tEr - .2, tTe)), rr = lerp(8, 5, sq) * z;
  surHalka(zx, zy, rr + 9, 'rgba(168,50,42,.22)', seg(t, s.t0, s.t0 + .6) * (1 - turned), 18);
  surHalka(zx, zy, rr, OSMC, seg(t, s.t0, s.t0 + .6) * (1 - turned), 5, [16, 10]);
  if (turned > 0) { const hp = hitPulse(t, tTe, 1.4); glow(zx, zy, 120 + 260 * hp, `rgba(255,200,130,${.3 + .4 * hp})`); }
  ownCity(cam, 'İzmit', Y, { label: false, r: 9 });
  // Bitinya'nın üç şehri: Bursa, İznik, İzmit altın halkalarla, aralarında altın üçgen
  const tri = [[BUR, tUc], [IZN, tUc + .25], [IZM, tSe]];
  ownCity(cam, 'Bursa', Y, { label: false, r: 9 }); ownCity(cam, 'İznik', Y, { label: false, r: 9 });
  const lk = eIO(seg(t, tOr - .2, tOr + 1.0));
  if (lk > 0) { const P = [BUR, IZN, IZM, BUR].map(p => W2S(cam, ...p)), L = polyLen(P), sp = []; for (let i = 0; i <= 60; i++) sp.push(pointAt(P, L, i / 60 * lk)); ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'screen'; for (const [w, a] of [[16, .2], [7, .45], [3, .95]]) { ctx.strokeStyle = rgba(GOLD, a); ctx.lineWidth = w; tracePath(sp); ctx.stroke(); } ctx.restore(); }
  tri.forEach(([p, t0], i) => { const a = spring(t, t0 - .05, { freq: 2, damp: .6 }); if (a <= 0) return; const [x, y] = W2S(cam, ...p); surHalka(x, y, 30 * clamp(a, 0, 1.3), GOLD, clamp(a), 5); const hp = hitPulse(t, t0, 1.0); if (hp > 0) glow(x, y, 160 * hp, 'rgba(255,214,130,.6)'); });
  const la = seg(t, tBi - .1, tBi + .5);
  mapLabel(cam, 'BİTİNYA', 34, 4, 50, { a: la * .9, col: '#3a1a10' });
  const nm = seg(t, tUc - .1, tUc + .4) * (1 - seg(t, tEnd + .2, tEnd + .6));
  mapLabel(cam, 'BURSA', BUR[0] - 2, BUR[1] + 10, 28, { a: nm }); mapLabel(cam, 'İZNİK', IZN[0] + 4, IZN[1] + 10, 28, { a: nm });
  mapPin(cam, ...IZM, t, tIz - .05, 'İZMİT', { size: 34, left: true, a: 1 - seg(t, tBi - .2, tBi + .3) });
  mapLabel(cam, 'İZMİT', IZM[0] + 2, IZM[1] - 9, 28, { a: nm });
  const ya = seg(t, tBin - .2, tBin + .2) * (1 - seg(t, tBi - .3, tBi + .1));
  if (ya > 0) yearTicker(W / 2, 470, yTk, 116, { a: ya });
}

/* ---------- p8: Bursa manzarası (imar → çarşı → devlet) ---------- */
const DUKKAN = (() => { const R = rng(1340), cols = ['#8a5a3a', '#6a6a4a', '#7a4a4a', '#5a6a6a', '#8a7048']; return Array.from({ length: 12 }, (_, i) => ({ dx: (i % 6 - 2.5) * 96 + (R() - .5) * 18, row: Math.floor(i / 6), col: cols[Math.floor(R() * cols.length)], d: R() * .5 })); })();
function bursaSehir(t, s) {
  const tSu = C('p8:Surların'), tCa = C('p8:cami'), tAs = C('p8:aşevi'), tHa = C('p8:han'), tCr = C('p8:Çarşı'), tUc = C('p8:uçtaki'), tDv = C('p8:devlete'), tDo = C('p8:dönüştü'), tEnd = C('p8.end');
  // kamera: geniş (hisar + ova) → surların dışına → hana → geri çekiliş (ağaç)
  const k1 = eIO(seg(t, tSu - .3, tCa + .3)), k2 = eIO(seg(t, tCr - .3, tCr + 1.2)), k3 = eIO(seg(t, tUc - .4, tDo + .4));
  const fx = lerp(lerp(lerp(600, 480, k1), 640, k2), 560, k3), fy = lerp(lerp(lerp(1000, 1080, k1), 1100, k2), 900, k3), z = lerp(lerp(lerp(.95, 1.08, k1), 1.32, k2), .86, k3) * (1 + .006 * (t - C('p8-0.3')));
  ctx.fillStyle = lg(0, 0, 0, 1250, [[0, '#2a3c66'], [.5, '#c88a6a'], [.8, '#f2c486'], [1, '#ffe2aa']]); ctx.fillRect(0, 0, W, H);
  const dk = k3 * .55; if (dk > 0) tonOrt('#3a3070', dk * .6);
  ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-fx, -fy);
  // Uludağ
  ctx.fillStyle = '#6a5a72'; ctx.beginPath(); ctx.moveTo(-400, 960); for (let x = -400; x <= 1600; x += 30) ctx.lineTo(x, 960 - 460 * Math.exp(-Math.pow((x - 820) / 460, 2)) - 24 * Math.sin(x * .013)); ctx.lineTo(1600, 1300); ctx.lineTo(-400, 1300); ctx.fill();
  ctx.save(); ctx.globalAlpha = .7; ctx.fillStyle = '#f4ece6'; ctx.beginPath(); ctx.moveTo(620, 640); for (let x = 620; x <= 1020; x += 20) ctx.lineTo(x, 960 - 460 * Math.exp(-Math.pow((x - 820) / 460, 2)) - 24 * Math.sin(x * .013)); for (let x = 1020; x >= 620; x -= 20) ctx.lineTo(x, 600 + 50 * Math.pow(Math.abs(x - 820) / 200, 1.6) + 14 * Math.sin(x * .08)); ctx.fill(); ctx.restore();
  // hisar tepesi (sağda), surlar, içeride gümüş kubbe ve evler
  ctx.fillStyle = '#4a3a34'; ctx.beginPath(); ctx.moveTo(560, 1200); ctx.quadraticCurveTo(760, 960, 1000, 950); ctx.quadraticCurveTo(1250, 960, 1450, 1200); ctx.fill();
  for (let i = 0; i < 9; i++) { const hx = 760 + i * 52, hy = 1000 + Math.abs(i - 4) * 14; ctx.fillStyle = i % 2 ? '#8a6a52' : '#9a785a'; ctx.fillRect(hx, hy - 40, 40, 40); ctx.fillStyle = '#6a3a2a'; ctx.beginPath(); ctx.moveTo(hx - 4, hy - 40); ctx.lineTo(hx + 20, hy - 58); ctx.lineTo(hx + 44, hy - 40); ctx.fill(); }
  gumusKubbe(1010, 978, .42, t, { shade: .15, halo: .15 });
  ctx.fillStyle = '#5a4a40'; ctx.beginPath(); ctx.moveTo(640, 1130); ctx.quadraticCurveTo(780, 1000, 1000, 990); ctx.quadraticCurveTo(1220, 1000, 1360, 1130); ctx.lineTo(1360, 1150); ctx.quadraticCurveTo(1220, 1030, 1000, 1020); ctx.quadraticCurveTo(780, 1030, 660, 1150); ctx.fill();
  for (const bx of [700, 830, 1170, 1300]) { const by = 1000 + Math.pow((bx - 1000) / 300, 2) * 70; ctx.fillRect(bx - 18, by - 46, 36, 50); }
  // ova (surların dışı)
  ctx.fillStyle = lg(0, 1180, 0, 1400, [[0, '#7a6a48'], [1, '#3a2c1c']]); ctx.fillRect(-400, 1180, 2000, 900);
  ctx.fillStyle = '#5a4a30'; ctx.beginPath(); ctx.moveTo(-400, 1190); for (let x = -400; x <= 1600; x += 40) ctx.lineTo(x, 1180 + 8 * Math.sin(x * .02)); ctx.lineTo(1600, 1210); ctx.lineTo(-400, 1210); ctx.fill();
  // yapılar: cami, aşevi, han (sırayla yükselir)
  const kc = seg(t, tCa - .15, tCa + .9), ka = seg(t, tAs - .15, tAs + .9), kh = seg(t, tHa - .15, tHa + .9);
  camiCiz(170, 1200, .78, kc);
  aseviCiz(420, 1200, .7, ka, t, seg(t, tAs + .7, tAs + 2));
  // çarşı: hanın çevresinde dükkânlar
  const cr = seg(t, tCr - .1, tUc);
  DUKKAN.forEach((d, i) => { if (d.row === 0) dukkan(660 + d.dx, 1206, .55, clamp(cr * 2.2 - d.d - i * .06), d.col, cr); });
  hanCiz(660, 1200, .62, kh, t, { lit: seg(t, tCr - .2, tUc) });
  DUKKAN.forEach((d, i) => { if (d.row === 1) dukkan(660 + d.dx * 1.15, 1262, .72, clamp(cr * 2.2 - d.d - i * .06 + .3), d.col, cr); });
  if (cr > 0) { const R = rng(9); for (let i = 0; i < 18; i++) { const x = 380 + R() * 560 + Math.sin(t * .6 + i) * 18, y = 1236 + R() * 50; ctx.save(); ctx.globalAlpha = clamp(cr * 2 - R()); ctx.fillStyle = '#1a120a'; ctx.beginPath(); ctx.ellipse(x, y - 14, 5, 13, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, y - 31, 5, 0, TAU); ctx.fill(); ctx.restore(); } }
  ctx.restore();
  // etiketler (yapı adları)
  const lab = (txt, wx, wy, t0) => { const a = seg(t, t0 + .3, t0 + .7) * (1 - seg(t, tCr - .4, tCr)); const [sx, sy] = [540 + (wx - fx) * z, 1000 + (wy - fy) * z]; etiket(txt, sx, sy, 30, a, { col: '#f4ead2', sp: 5 }); };
  lab('CAMİ', 170, 900, tCa); lab('AŞEVİ', 420, 980, tAs); lab('HAN', 660, 990, tHa);
  // sezon ağacı: uçtaki beylik devlete dönüşür (T18)
  const g = eOut(seg(t, tUc - .2, tDo + .5));
  if (g > 0) { ctx.save(); ctx.globalAlpha = .9; glow(540, 760, 520 * g, 'rgba(255,214,130,.22)'); miniTree(540, 1150, 2.3, g, t); ctx.restore(); }
  const hp = hitPulse(t, tDo, 1.4); if (hp > 0) glow(540, 700, 500 * hp, 'rgba(255,220,150,.45)');
}
