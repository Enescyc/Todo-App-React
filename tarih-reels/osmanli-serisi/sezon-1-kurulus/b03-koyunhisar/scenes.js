/* Sezon 1 · Bölüm 3 sahneleri: Koyunhisar. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js
 * Portre yok: kişiler siluetle. Olgular FACTS.md'de (Bafeus 🟢/🟡, Koyunhisar adı 🟡, kuleler 🟡, Mudanya 🟡, gümüş kubbe 🔴).
 * Bölüme özel çizimler bu dosyada: gumusKubbe (Bölüm 4 ile ortak tarif), asker, yedekAt, yaya, koylu, karasaban, ayakta, blok (harita birliği),
 * tepeler, bursaSahne (Uludağ, kayalar, surlar, iki kule), havaleKule, dotLL ve surHalka (Bölüm 2'den), fener. */
'use strict';
const C = cue;
const camAt = (keys, t, creep = .008) => camPath(keys, t, { creep });   // monoton kübik + log-zoom + sürekli hafif itme
const OSMC = '#a8322a', BIZC = '#7a5a9a', ALANC = '#a194b8', BEYC = '#c9a564';
// harita noktaları (km). CITY: Bafeus, İzmit, İznik, Bursa, Mudanya, Konstantinopolis, Söğüt. Diğerleri LL(boylam, enlem) (FACTS §C)
const BAF = CITY['Bafeus'], IZM = CITY['İzmit'], IZN = CITY['İznik'], BUR = CITY['Bursa'], MUD = CITY['Mudanya'], KON = CITY['Konstantinopolis'];
const YEN = LL(29.65, 40.26), ULU = LL(29.22, 40.07), PAF = LL(33.75, 41.62), KDZ = LL(32.4, 42.45);
const ORDU = [BAF[0] - 1.2, BAF[1] + 2.6];          // Bizans ordusunun ovadaki yeri: Bafeus'un hemen güneyi (temsilî)
const KAPI = [IZM[0] - 2.2, IZM[1] + 2.0];          // İzmit surlarının güneybatı yaklaşımı (temsilî)
const OSM_ALAN = [[104, 60], [101, 40], [88, 30], [66, 15], [48, 15], [38, 32], [38, 52], [56, 58], [82, 60], [104, 60]];   // Bölüm 2'deki yaklaşık beylik alanı (~1300)
const B2_OK = [[...KON], [8, -50], [26, -40], [44, -32], [58, -27]];   // Bölüm 2'nin son karesindeki imparator ordusu oku

/* ---------- GÜMÜŞ KUBBE: Bölüm 3 ↔ Bölüm 4 süreklilik nesnesi (ortak tarif) ----------
 * Yuvarlak bir Bizans şapeli gövdesi (taş, sıcak gri #8d8577), üstünde yarım küre kubbe (gümüş #cfd6dc, kenar #9aa3ab).
 * o.shine 0..1: kubbenin sol üstünden geçen beyaz parıltı ve hafif hale (glow). Kubbenin tepesinde sembol yok.
 * (x, y): gövdenin taban ortası; s = 1 → gövde çapı 160 px, toplam yükseklik ~170 px. */
function gumusKubbe(x, y, s, t, o = {}) {
  const R = 80, bh = 92, ry = R * .2, Rd = R * .92, dy = -bh - 6, sh = clamp(o.shine ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // gövde: önden görülen silindir, taş
  ctx.fillStyle = lg(-R, 0, R, 0, [[0, '#5f594f'], [.3, '#9a9284'], [.55, '#8d8577'], [1, '#56504a']]);
  ctx.beginPath(); ctx.moveTo(-R, -bh); ctx.lineTo(-R, 0); ctx.ellipse(0, 0, R, ry, 0, Math.PI, 0, true); ctx.lineTo(R, -bh); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = 'rgba(40,30,20,.32)'; ctx.lineWidth = 2;
  for (let yy = -bh + 16; yy < 4; yy += 15) { ctx.beginPath(); ctx.ellipse(0, yy, R, ry, 0, Math.PI, 0, true); ctx.stroke(); }
  for (const wx of [-50, -2, 46]) {   // kemerli pencereler (yanlarda daralır)
    const w = 15 * Math.sqrt(1 - Math.pow(wx / R, 2)); ctx.fillStyle = '#231c16';
    ctx.beginPath(); ctx.moveTo(wx - w / 2, -24); ctx.lineTo(wx - w / 2, -58); ctx.arc(wx, -58, w / 2, Math.PI, 0); ctx.lineTo(wx + w / 2, -24); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(30,22,16,.6)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-R, -bh); ctx.lineTo(-R, 0); ctx.ellipse(0, 0, R, ry, 0, Math.PI, 0, true); ctx.lineTo(R, -bh); ctx.stroke();
  // korniş
  ctx.fillStyle = '#7a7367'; ctx.beginPath(); ctx.ellipse(0, -bh, R + 5, ry + 3, 0, 0, TAU); ctx.fill();
  // kubbe: yarım küre, gümüş
  const dome = () => { ctx.beginPath(); ctx.moveTo(-Rd, dy); ctx.arc(0, dy, Rd, Math.PI, 0); ctx.ellipse(0, dy, Rd, Rd * .2, 0, 0, Math.PI); ctx.closePath(); };
  dome(); ctx.fillStyle = rg(-Rd * .38, dy - Rd * .5, Rd * .04, Rd * 1.3, [[0, '#f6f8fa'], [.3, '#cfd6dc'], [.75, '#a9b2ba'], [1, '#848d95']]); ctx.fill();
  ctx.save(); dome(); ctx.clip();
  ctx.strokeStyle = 'rgba(110,120,130,.32)'; ctx.lineWidth = 1.6;   // kurşun/gümüş levha dikişleri
  for (const k of [-.66, -.33, 0, .33, .66]) { ctx.beginPath(); ctx.ellipse(0, dy, Math.abs(k) * Rd + .5, Rd, 0, k < 0 ? Math.PI / 2 : -Math.PI / 2, k < 0 ? Math.PI * 1.5 : Math.PI / 2); ctx.stroke(); }
  ctx.fillStyle = rg(-Rd * .42, dy - Rd * .55, 0, Rd * .35, [[0, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(-Rd, dy - Rd, Rd * 2, Rd * 1.3);
  if (sh > 0 && sh < 1) {   // parıltı süpürmesi: sol üstten geçer
    ctx.translate(0, dy - Rd * .3); ctx.rotate(-.75); const bx = lerp(-Rd * 1.5, Rd * 1.5, sh);
    ctx.fillStyle = lg(bx - 26, 0, bx + 26, 0, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,.9)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(bx - 30, -Rd * 2, 60, Rd * 4);
  }
  ctx.restore();
  dome(); ctx.strokeStyle = '#9aa3ab'; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
  const hale = o.halo ?? sh * (1 - Math.pow(sh, 6) * .3);
  if (hale > 0) glow(x - Rd * .3 * s, y + (dy - Rd * .45) * s, Rd * 3.2 * s, 'rgba(232,240,248,.5)', clamp(hale));
}

/* ---------- siluetler ---------- */
// Bizans piyadesi (yandan, yüzü sağa; o.flip sola): sivri miğfer, yuvarlak kalkan, mızrak. o.sway huzursuz salınım, o.turn baş,
// o.lean geriye yatma (dağılma), o.run 0..1 koşma, o.spearA mızrak açısı, o.rim arka ışık
function asker(x, y, s, t, o = {}) {
  const f = o.flip ? -1 : 1, ph = o.ph || 0, sw = (o.sway || 0) * (Math.sin(t * 2.1 + ph * 3.7) + .5 * Math.sin(t * 5.3 + ph));
  const run = o.run || 0, A = Math.sin(fract(t * 1.7 + ph) * TAU) * run;
  ctx.save(); ctx.translate(x, y - Math.abs(A) * 8 * s); ctx.scale(s * f, s); ctx.rotate(sw * .05 + (o.lean || 0));
  ctx.fillStyle = o.sil || '#140d0a'; ctx.strokeStyle = o.sil || '#140d0a'; ctx.lineCap = 'round';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 20; }
  ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(-6, -92); ctx.lineTo(-10 + A * 26, 0); ctx.moveTo(6, -92); ctx.lineTo(10 - A * 26, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-31, -82); ctx.lineTo(-22, -170); ctx.quadraticCurveTo(0, -182, 22, -170); ctx.lineTo(31, -82); ctx.closePath(); ctx.fill();
  const hx = (o.turn || 0) * 5 + sw * 1.5;
  ctx.beginPath(); ctx.arc(2 + hx, -194, 16, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-17 + hx, -195); ctx.quadraticCurveTo(-15 + hx, -222, 2 + hx, -228); ctx.quadraticCurveTo(19 + hx, -222, 21 + hx, -195); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.translate(32, -122); ctx.rotate((o.spearA || 0) + sw * .04);
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 96); ctx.lineTo(0, -228); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -262); ctx.quadraticCurveTo(7, -240, 0, -226); ctx.quadraticCurveTo(-7, -240, 0, -262); ctx.fill();
  ctx.restore();
  ctx.shadowBlur = 0; ctx.fillStyle = o.shield || '#1d1412'; ctx.beginPath(); ctx.arc(18, -128, 34, 0, TAU); ctx.fill();
  ctx.strokeStyle = o.shieldRim || 'rgba(140,110,170,.55)'; ctx.lineWidth = 4; ctx.stroke();
  ctx.restore();
}
// yedek at (yandan, sağa yürür, eyerli ve binicisiz). Bölüm 2'deki atYuku'nun yüksüz hali
function yedekAt(x, y, s, t, o = {}) {
  const g = o.still ? .1 : fract(t * (o.speed || .8) + (o.ph || 0)), bob = o.still ? 0 : Math.sin(g * TAU * 2) * 2.5;
  ctx.save(); ctx.translate(x, y + bob * s); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.fillStyle = o.sil || '#120b07'; ctx.strokeStyle = o.sil || '#120b07'; ctx.lineCap = 'round';
  ctx.lineWidth = 10;
  for (const [hx, ph] of [[-58, 0], [-44, .5], [46, .25], [60, .75]]) { const a = o.still ? 0 : Math.sin((g + ph) * TAU) * .32; ctx.beginPath(); ctx.moveTo(hx, -72); const kx = hx + Math.sin(a) * 16; ctx.lineTo(kx, -36); ctx.lineTo(kx + Math.sin(a + .3) * 8, 0); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, -90, 80, 30, 0, 0, TAU); ctx.fill();
  const hd = o.still ? -6 : Math.sin(g * TAU * 2) * 3;
  ctx.beginPath(); ctx.moveTo(54, -106); ctx.quadraticCurveTo(90, -132 + hd, 110, -124 + hd); ctx.lineTo(132, -98 + hd); ctx.lineTo(122, -86 + hd); ctx.quadraticCurveTo(98, -100, 76, -80); ctx.fill();
  ctx.beginPath(); ctx.moveTo(104, -128 + hd); ctx.lineTo(110, -146 + hd); ctx.lineTo(116, -126 + hd); ctx.fill();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-78, -100); ctx.quadraticCurveTo(-98, -80, -94, -44); ctx.stroke();
  ctx.fillStyle = o.saddle || '#3a2418'; ctx.beginPath(); ctx.roundRect(-30, -128, 52, 14, 6); ctx.fill();
  ctx.restore();
}
// yürüyen adam (sağa): pelerin, asa. Bölüm 2'deki yaya'nın silahsız hali
function yaya(x, y, s, t, o = {}) {
  const g = fract(t * (o.speed || .8) + (o.ph || 0)), sw = Math.sin(g * TAU) * (o.still ? 0 : 1);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.fillStyle = o.sil || '#120b07'; ctx.strokeStyle = o.sil || '#120b07'; ctx.lineCap = 'round';
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-4, -78); ctx.lineTo(-4 + sw * 18, 0); ctx.moveTo(4, -78); ctx.lineTo(4 - sw * 18, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-26, -72); ctx.quadraticCurveTo(-30, -150, -10, -176); ctx.lineTo(16, -176); ctx.quadraticCurveTo(32, -140, 26, -72); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -192, 17, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(4, -204, 20, 10, 0, 0, TAU); ctx.fill();
  if (o.lead) { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, -120); ctx.quadraticCurveTo(70, -90, 106, -116); ctx.stroke(); }   // yular
  else { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(30, -10); ctx.lineTo(40, -230); ctx.stroke(); }
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(10, -150); ctx.lineTo(36, -128); ctx.stroke();
  ctx.restore();
}
// göç eden köylü (sağa yürür): sırtında bohça; o.child küçük boy, o.stoop eğilme
function koylu(x, y, s, t, o = {}) {
  const g = fract(t * (o.speed || .7) + (o.ph || 0)), sw = Math.sin(g * TAU);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.stoop || .08); ctx.fillStyle = o.sil || '#0d0a0c'; ctx.strokeStyle = o.sil || '#0d0a0c'; ctx.lineCap = 'round';
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-4, -78); ctx.lineTo(-4 + sw * 16, 0); ctx.moveTo(4, -78); ctx.lineTo(4 - sw * 16, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-28, -60); ctx.quadraticCurveTo(-30, -150, -10, -172); ctx.lineTo(14, -172); ctx.quadraticCurveTo(30, -130, 28, -60); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -188, 16, 0, TAU); ctx.fill();
  if (!o.child) { ctx.beginPath(); ctx.ellipse(-30, -146, 30, 34, -.2, 0, TAU); ctx.fill(); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-6, -170); ctx.lineTo(-30, -112); ctx.stroke(); }
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(12, -146); ctx.lineTo(30 + sw * 4, -100); ctx.stroke();
  ctx.restore();
}
// terk edilmiş karasaban (tarlada)
function karasaban(x, y, s, col = '#120c0a') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-150, -10); ctx.lineTo(60, -60); ctx.stroke();                 // ok (çeki)
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(50, -58); ctx.lineTo(90, 0); ctx.stroke();                    // gövde
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(80, -12); ctx.lineTo(118, -110); ctx.stroke();                 // sap
  ctx.beginPath(); ctx.moveTo(84, -4); ctx.lineTo(140, 6); ctx.lineTo(96, 10); ctx.closePath(); ctx.fill();     // demir uç
  ctx.restore();
}
// ayakta duran, pelerinli, asaya dayanan siluet (yüzü sağa): kişi portresi değil
function ayakta(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = o.col || '#0b0706'; ctx.strokeStyle = o.col || '#0b0706'; ctx.lineCap = 'round';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 26; }
  const wv = Math.sin(t * 1.6) * 6;
  ctx.beginPath(); ctx.moveTo(-52 - wv, 0); ctx.quadraticCurveTo(-58, -120, -34, -220); ctx.quadraticCurveTo(0, -246, 30, -222); ctx.quadraticCurveTo(48, -120, 44, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -256, 26, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4, -278, 38, 22, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(4, -294, 22, 14, 0, 0, TAU); ctx.fill();   // sarık
  ctx.beginPath(); ctx.moveTo(20, -244); ctx.quadraticCurveTo(40, -214, 16, -204); ctx.lineTo(4, -230); ctx.closePath(); ctx.fill();          // sakal
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(72, 4); ctx.lineTo(60, -230); ctx.stroke();                                                 // asa
  ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(26, -190); ctx.quadraticCurveTo(50, -170, 62, -176); ctx.stroke();
  ctx.restore();
}
// fener / meşale noktası
function fener(x, y, a, r = 7) { if (a <= 0) return; glow(x, y, r * 7, `rgba(255,180,90,${.55 * a})`); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffdc9a'; ctx.beginPath(); ctx.arc(x, y, r * .6, 0, TAU); ctx.fill(); ctx.restore(); }
// toz bulutu (atların arkasında)
function toz(x, y, r, a, col = '150,120,90') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rg(x, y, 0, r, [[0, `rgba(${col},.55)`], [1, `rgba(${col},0)`]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }

/* ---------- harita yardımcıları ---------- */
// harita: dünya noktasında şehir noktası + etiket (CITY listesinde olmayan yerler için). Bölüm 2'den
function dotLL(cam, p, label, o = {}) {
  const [x, y] = W2S(cam, ...p), r = o.r || 8; if (x < -200 || x > W + 200 || y < -200 || y > H + 200) return [x, y];
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = o.col || OSMC; ctx.strokeStyle = '#f4e8cc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  if (label && (o.la ?? 1) > 0) { ctx.globalAlpha = (o.a ?? 1) * (o.la ?? 1); setFont(o.size || 30, F.mont, 800); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(240,228,198,.9)'; const dx = o.align === 'right' ? -16 : 16; ctx.strokeText(label, x + dx, y); ctx.fillStyle = '#1a120a'; ctx.fillText(label, x + dx, y); }
  ctx.restore(); return [x, y];
}
// sur halkası: şehrin çevresinde ekran yarıçapı r. Bölüm 2'den
function surHalka(x, y, r, col, a, w = 6, dash) {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) { ctx.setLineDash(dash); }
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
}
// yaklaşık beylik alanı (Bölüm 2'nin ~1300 haritasıyla aynı)
function osmAlan(cam, a = .25) {
  if (a <= 0) return; inWorld(cam, () => { const P = spline(OSM_ALAN, 10); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = OSMC; tracePath(P); ctx.fill();
    ctx.globalAlpha = a * 2.6; ctx.strokeStyle = '#7a1f17'; ctx.lineWidth = 2.5 / cam[2]; ctx.setLineDash([12 / cam[2], 9 / cam[2]]); ctx.stroke(); ctx.restore(); });
}
// dağ taraması (gravür): Samanlı dağları, İznik gölü ile İzmit körfezi arası (temsilî işaretler)
const TEPE = (() => { const R = rng(1302), out = []; for (let i = 0; i < 90; i++) out.push([36 + R() * 56, -19.5 + R() * 11, .7 + R() * .7]); return out; })();
function tepeler(cam, a = 1) {
  if (a <= 0) return; inWorld(cam, () => { const z = cam[2]; ctx.save(); ctx.globalAlpha = a * .55; ctx.strokeStyle = '#5a4428'; ctx.lineWidth = 1.8 / z; ctx.lineJoin = 'round';
    for (const [x, y, sz] of TEPE) { const w = .9 * sz, h = .7 * sz; ctx.beginPath(); ctx.moveTo(x - w, y + h * .4); ctx.lineTo(x, y - h * .6); ctx.lineTo(x + w, y + h * .4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + .1, y - h * .5); ctx.lineTo(x + w * .45, y + h * .2); ctx.stroke(); }
    ctx.restore(); });
}
// harita birliği (dünya koordinatı, km): dikdörtgen blok, ön kenarında mızrak çizgileri. ang: ön yüzün dönüşü (0 = güneye bakar)
function blok(x, y, ang, col, a, z, o = {}) {
  if (a <= 0) return; const w = o.w || 1.5, h = o.h || .55;
  ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = 'rgba(30,15,5,.3)'; ctx.fillRect(-w / 2 + .1, -h / 2 + .14, w, h);
  ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = '#1a0a05'; ctx.lineWidth = 2 / z; ctx.strokeRect(-w / 2, -h / 2, w, h);
  if (o.stripe) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.6 / z; ctx.beginPath(); ctx.moveTo(-w / 2 + .15, 0); ctx.lineTo(w / 2 - .15, 0); ctx.stroke(); }
  ctx.strokeStyle = '#1a0a05'; ctx.lineWidth = 1.4 / z; ctx.beginPath(); for (let i = 0; i < 5; i++) { const xx = -w / 2 + w * (i + .5) / 5; ctx.moveTo(xx, h / 2); ctx.lineTo(xx, h / 2 + .24); } ctx.stroke();
  ctx.restore();
}
// dizilişler (km kayması): Bizans 8 blok (2 saf), Alanlar 5 blok (doğu kanadı), Osman'ın atlıları 24 blok (3 saf). Blok sayıları temsilîdir, rakam iddiası yok
const BIZ_F = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) BIZ_F.push([(c - 1.5) * 2.0, -r * 1.2]);
const ALAN_F = [[5.4, -.5], [5.9, .8], [6.9, -1.0], [7.2, .4], [8.0, -.3]];
const OSM_F = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) OSM_F.push([(c - 3.5) * 2.05 + (r % 2) * .8, r * 1.3]);
const DAG = (() => { const R = rng(31), o = []; for (let i = 0; i < 13; i++) o.push([(R() - .5) * 3.2, (R() - .5) * 2.4, (R() - .5) * 1.4]); return o; })();   // hattın dağılışı
const OSM_ON = [ORDU[0] + .8, ORDU[1] + 5.4];   // Osman'ın atlılarının ova kenarındaki yeri (geçitten inince)
// Bizans ordusu ve Alanlar: ovada bekler (o.jit: huzursuz kıpırtı)
function biz0(cam, t, a = 1, o = {}) {
  inWorld(cam, () => { const z = cam[2];
    BIZ_F.forEach(([dx, dy], i) => blok(ORDU[0] + dx + Math.sin(t * 1.4 + i) * (o.jit || 0), ORDU[1] + dy, Math.sin(t * 2 + i * 2) * (o.jit || 0) * .6, BIZC, a, z));
    ALAN_F.forEach(([dx, dy], i) => blok(ORDU[0] + dx, ORDU[1] + dy, -.25, ALANC, a, z, { stripe: true }));
  });
}
// Osman'ın atlıları: k 0..1 tepelerden ova kenarına iner (blok blok)
function osm0(cam, t, t0, a = 1) {
  inWorld(cam, () => { const z = cam[2];
    OSM_F.forEach(([dx, dy], i) => { const k = eOut(seg(t, t0 + i * .045, t0 + i * .045 + .55)); if (k <= 0) return; blok(OSM_ON[0] + dx, OSM_ON[1] + dy + (1 - k) * 4, Math.PI, OSMC, a * clamp(k * 2), z); });
  });
}

/* ---------- Bursa manzarası (p6–p8): Uludağ, sarp kayalar üstünde surlar, iki havale kulesi ----------
 * Taban koordinatı 1080×1920; sahneler kamerayı sahneCam ile verir. o: {gece 0..1, altin 0..1, kule 0..1, bayrak 0..1, ates 0..1, isik 0..1, shine, rider} */
const KAYA = (() => { const R = rng(1326), L = [], Q = [];
  for (let i = 0; i <= 16; i++) { const k = i / 16; L.push([lerp(236, 346, Math.pow(k, .55)) + (R() - .5) * 30 * (1 - k * .6), lerp(1338, 958, k)]); }
  for (let i = 0; i <= 16; i++) { const k = i / 16; Q.push([lerp(778, 905, Math.pow(k, 1.6)) + (R() - .5) * 30 * (.4 + k * .6), lerp(958, 1338, k)]); }
  const ST = []; for (let i = 0; i < 26; i++) ST.push([R(), R(), .3 + R() * .5]); return { L, Q, ST }; })();
const AGAC = (() => { const R = rng(77), o = []; for (let i = 0; i < 40; i++) o.push([-400 + R() * 1900, 1345 + R() * 230, 14 + R() * 22]); return o.sort((a, b) => a[1] - b[1]); })();
function bRenk(o) {
  const g = clamp(o.gece || 0), a = clamp(o.altin || 0), m = (d, n, gl) => mix(mix(d, gl, a), n, g);
  return { s0: m('#6f8aa4', '#03060e', '#3a4676'), s1: m('#d8d2c2', '#151d33', '#f4b468'), mtn: m('#7a8798', '#121827', '#8c6c6c'), mtnD: m('#5d6878', '#0b0f19', '#6a4c50'),
    snow: m('#eef1f2', '#3c4558', '#ffe2c0'), hill: m('#55604c', '#090c11', '#5a3e34'), rock: m('#8a8174', '#17171d', '#a27a5c'), rockD: m('#585248', '#0c0c10', '#5e3e2c'),
    wall: m('#a89d8a', '#20202a', '#d2a272'), wallD: m('#6b6256', '#111117', '#7c5636'), ground: m('#646446', '#08090b', '#6e4c30'), groundD: m('#3a3a28', '#040506', '#3a2416') };
}
function sahneCam(cx, cy, z) { ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function havaleKule(x, y, h, t, o = {}) {
  const P = o.P, th = 236, top = y - th * h;
  ctx.save(); ctx.fillStyle = P.hill; ctx.beginPath(); ctx.ellipse(x, y + 18, 150, 38, 0, Math.PI, 0); ctx.lineTo(x + 150, y + 60); ctx.lineTo(x - 150, y + 60); ctx.fill(); ctx.restore();
  if (h <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 60, top - 40, 120, y - top + 42); ctx.clip();
  ctx.fillStyle = lg(x - 36, 0, x + 36, 0, [[0, P.wallD], [.45, P.wall], [1, P.wallD]]); ctx.beginPath(); ctx.moveTo(x - 38, y); ctx.lineTo(x - 32, y - th); ctx.lineTo(x + 32, y - th); ctx.lineTo(x + 38, y); ctx.fill();
  ctx.strokeStyle = 'rgba(20,14,10,.35)'; ctx.lineWidth = 2; for (let yy = y - 18; yy > y - th; yy -= 20) { ctx.beginPath(); ctx.moveTo(x - 36, yy); ctx.lineTo(x + 36, yy); ctx.stroke(); }
  ctx.fillStyle = P.wallD; for (let i = 0; i < 4; i++) ctx.fillRect(x - 36 + i * 20, y - th - 16, 13, 18);
  ctx.fillStyle = '#140e0a'; ctx.fillRect(x - 5, y - th + 60, 10, 22);
  ctx.restore();
  if (h < 1) { toz(x, y - 10, 140, .5 * Math.sin(Math.PI * h), '170,150,120'); return; }
  if ((o.ates || 0) > 0) { const fl = .85 + .15 * Math.sin(t * 11 + x); glow(x, y - th - 18, 160 * fl, 'rgba(255,150,60,.55)', o.ates); glow(x, y - th - 18, 46 * fl, 'rgba(255,220,150,.9)', o.ates); }
  if (o.isik > 0) { ctx.save(); ctx.globalAlpha = o.isik; ctx.fillStyle = 'rgba(255,190,110,.9)'; ctx.fillRect(x - 4, y - th + 62, 8, 18); ctx.restore(); }
  const b = o.bayrak || 0; if (b > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - th - 230, 220, 214); ctx.clip(); pennant(x, y - th - 16 + 200 * (1 - eOut(b)), .5, t, { col: OSMC }); ctx.restore(); }
}
function bursaSahne(t, o = {}) {
  const P = bRenk(o);
  ctx.fillStyle = lg(0, -600, 0, 980, [[0, P.s0], [1, P.s1]]); ctx.fillRect(-1600, -1600, 4300, 2700);
  if ((o.gece || 0) > .3) { ctx.save(); ctx.globalAlpha = clamp((o.gece - .3) / .7); stars(t, .9); ctx.restore(); }
  if ((o.altin || 0) > 0) { glow(230, 560, 520, 'rgba(255,190,110,.55)', o.altin); ctx.save(); ctx.globalAlpha = o.altin; ctx.fillStyle = 'rgba(255,232,180,.95)'; ctx.beginPath(); ctx.arc(230, 600, 54, 0, TAU); ctx.fill(); ctx.restore(); }
  // Uludağ: geniş kütle, karlı doruk
  const M = [[-1400, 1020], [-200, 880], [100, 760], [320, 640], [520, 480], [640, 430], [760, 470], [960, 590], [1250, 700], [1700, 860], [2600, 1000]];
  ctx.fillStyle = lg(0, 430, 0, 1060, [[0, P.mtn], [1, P.mtnD]]); ctx.beginPath(); ctx.moveTo(-1600, 1100); for (const [x, y] of M) ctx.lineTo(x, y); ctx.lineTo(2700, 1100); ctx.fill();
  ctx.fillStyle = P.snow; ctx.beginPath(); ctx.moveTo(470, 520); ctx.lineTo(520, 480); ctx.lineTo(640, 430); ctx.lineTo(760, 470); ctx.lineTo(840, 520); ctx.lineTo(790, 535); ctx.lineTo(740, 512); ctx.lineTo(690, 548); ctx.lineTo(630, 520); ctx.lineTo(575, 552); ctx.lineTo(530, 530); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.mtnD, .6); ctx.lineWidth = 3; for (const [x0, y0, x1, y1] of [[640, 440, 560, 700], [700, 455, 760, 690], [420, 560, 330, 760], [880, 540, 980, 740]]) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + 20, (y0 + y1) / 2, x1, y1); ctx.stroke(); }
  // ön tepeler
  ctx.fillStyle = P.hill; ctx.beginPath(); ctx.moveTo(-1600, 1360); for (let x = -1600; x <= 2700; x += 60) ctx.lineTo(x, 1010 - 40 * Math.sin(x * .004 + 1) - 22 * Math.cos(x * .011)); ctx.lineTo(2700, 1360); ctx.fill();
  // ova
  ctx.fillStyle = lg(0, 1300, 0, 1900, [[0, P.ground], [1, P.groundD]]); ctx.fillRect(-1600, 1300, 4300, 1400);
  for (const [x, y, r] of AGAC) { ctx.fillStyle = P.hill; ctx.beginPath(); ctx.arc(x, y - r, r, 0, TAU); ctx.fill(); ctx.fillRect(x - 3, y - r, 6, r); }
  ctx.strokeStyle = rgba(P.s1, .25); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-500, 1600); ctx.quadraticCurveTo(200, 1420, 470, 1340); ctx.stroke();   // yol
  // kayalık: sarp yamaçlar
  ctx.fillStyle = lg(0, 958, 0, 1340, [[0, P.rock], [1, P.rockD]]); ctx.beginPath(); for (const [x, y] of KAYA.L) ctx.lineTo(x, y); for (const [x, y] of KAYA.Q) ctx.lineTo(x, y); ctx.lineTo(236, 1340); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(P.rockD, .8); ctx.lineWidth = 3;
  for (const [u, v, l] of KAYA.ST) { const y = lerp(990, 1320, v), x = lerp(260, 860, u); ctx.beginPath(); ctx.moveTo(x - 90 * l, y); ctx.lineTo(x - 30 * l, y - 6); ctx.lineTo(x + 70 * l, y + 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 10, y + 4); ctx.lineTo(x + 18, y + 40 * l); ctx.stroke(); }
  ctx.fillStyle = rgba(P.rockD, .5); ctx.fillRect(236, 958, 70, 400); ctx.fillRect(800, 958, 110, 400); ctx.restore();
  // iç kale: çatılar ve gümüş kubbe (surların ardında)
  ctx.fillStyle = P.wallD; for (const [x, w, h] of [[400, 56, 30], [470, 70, 40], [700, 64, 34]]) { ctx.beginPath(); ctx.moveTo(x - w / 2, 905); ctx.lineTo(x - w / 2, 905 - h); ctx.lineTo(x, 905 - h - 22); ctx.lineTo(x + w / 2, 905 - h); ctx.lineTo(x + w / 2, 905); ctx.fill(); }
  gumusKubbe(600, 904, .44, t, { shine: o.shine || 0, halo: o.halo });
  // surlar: kayanın kenarında, kuleli
  ctx.fillStyle = lg(0, 890, 0, 970, [[0, P.wall], [1, P.wallD]]); ctx.fillRect(338, 898, 446, 66);
  for (let x = 338; x < 784; x += 22) ctx.fillRect(x, 886, 13, 13);
  for (const x of [348, 446, 548, 650, 770]) { ctx.fillRect(x - 20, 866, 40, 98); for (let i = 0; i < 3; i++) ctx.fillRect(x - 20 + i * 15, 856, 10, 11); }
  ctx.strokeStyle = 'rgba(20,14,10,.35)'; ctx.lineWidth = 1.5; for (let y = 912; y < 964; y += 14) { ctx.beginPath(); ctx.moveTo(338, y); ctx.lineTo(784, y); ctx.stroke(); }
  if ((o.isik || 0) > 0) { ctx.save(); ctx.globalAlpha = o.isik; ctx.fillStyle = 'rgba(255,190,110,.9)'; for (const [x, y] of [[348, 900], [446, 910], [548, 896], [650, 906], [770, 900], [470, 875], [700, 880]]) { ctx.fillRect(x - 3, y, 6, 11); glow(x, y + 5, 26, 'rgba(255,170,80,.45)'); } ctx.restore(); }
  // iki havale kulesi: şehrin iki yanında
  havaleKule(120, 1300, clamp(o.kuleL ?? o.kule ?? 0), t, { P, bayrak: o.bayrak, ates: o.ates, isik: o.isik });
  havaleKule(962, 1300, clamp(o.kuleR ?? o.kule ?? 0), t, { P, bayrak: o.bayrak, ates: o.ates, isik: o.isik });
  if (o.gece > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .35 * o.gece; ctx.fillStyle = '#2a3a6a'; ctx.fillRect(-1600, -1600, 4300, 4300); ctx.restore(); }
}

/* ---------- ortak kamera: hücumdan sonra harita (ricat → sessizlik → koyunhisar → dalga) ---------- */
function zaferCam(t) {
  const a = C('p4:Yalnızca-0.2'), i = C('p4:İzmit'), s = C('p4:sığındı'), m = C('p4:Meydan'), e = C('p4.end'), p5 = C('p5-0.3'), k = C('p5:Koyunhisar'), z = C('p5:Zaferin'), kd = C('p5:Karadeniz'), pf = C("p5:Paflagonya'ya"), u = C('p5:uç'), ko = C('p5:koştu'), b = C("p5:Bitinya'nın-0.3");
  return camAt([[a, 66, -22.5, 12.4], [i, 70, -25, 11.0], [s + .5, 70, -25.5, 11.4], [m, 66, -23.5, 12.6], [e + .2, 64, -23.5, 13.2], [p5, 64, -21, 8.6], [k + .6, 66, -17, 6.4], [z, 72, -12, 5.0], [kd, 160, -60, 2.5], [pf + .5, 262, -66, 1.8], [u + .3, 236, -40, 1.9], [ko + .3, 160, -6, 2.5], [b, 150, -2, 2.7]], t, .003);
}
// ricat sırasındaki birlik konumları (saf fonksiyon)
function ricatBirlik(cam, t, o = {}) {
  const ty = C('p4:Yalnızca'), tk = C('p4:korudu'), tku = C('p4:kurtulanlar'), tsg = C('p4:sığındı'), tm = C('p4:Meydan'), tkl = C('p4:kaldı');
  const fade = o.fade ?? 1;
  inWorld(cam, () => { const z = cam[2];
    // Bizans: dağılmış bloklar İzmit'e kaçar, surlara girince söner
    BIZ_F.forEach(([dx, dy], i) => {
      const d = DAG[i], p0 = [ORDU[0] + dx + d[0], ORDU[1] + dy + d[1] - 1], f = eIO(seg(t, ty - .5 + i * .14, tsg + .2 + i * .06));
      const M = [lerp(p0[0], KAPI[0], .5) + 1.5, lerp(p0[1], KAPI[1], .5) + 2.2], u = 1 - f;
      const x = u * u * p0[0] + 2 * u * f * M[0] + f * f * KAPI[0], y = u * u * p0[1] + 2 * u * f * M[1] + f * f * KAPI[1];
      const dxx = 2 * u * (M[0] - p0[0]) + 2 * f * (KAPI[0] - M[0]), dyy = 2 * u * (M[1] - p0[1]) + 2 * f * (KAPI[1] - M[1]);
      blok(x, y, f > .02 ? Math.atan2(-dxx, dyy) : d[2], BIZC, (1 - seg(f, .8, 1)) * fade, z, { w: 1.3 });
    });
    // Alanlar: kanattan arka muhafız hattına, kaçanları korur; sonra onlar da çekilir
    ALAN_F.forEach(([dx, dy], i) => {
      const p0 = [ORDU[0] + dx, ORDU[1] + dy], G = [ORDU[0] + 2.4 + i * 1.7, ORDU[1] + 1.6 + Math.abs(i - 2) * .35];
      const k1 = eIO(seg(t, ty, tk + .2)), k2 = eIO(seg(t, tku + .3 + i * .1, tsg + 1.2 + i * .1));
      let x = lerp(p0[0], G[0], k1), y = lerp(p0[1], G[1], k1); x = lerp(x, KAPI[0], k2); y = lerp(y, KAPI[1], k2);
      blok(x, y, k2 > .05 ? Math.atan2(-(KAPI[0] - G[0]), KAPI[1] - G[1]) : .5, ALANC, (1 - seg(k2, .8, 1)) * fade, z, { stripe: true });
    });
    // Osman'ın atlıları: kovalar, "Meydan"da ovayı doldurur
    OSM_F.forEach(([dx, dy], i) => {
      const ch = eIO(seg(t, ty - .3, tku)), adv = eIO(seg(t, tm - .3 + i * .02, tkl + .3));
      const x = OSM_ON[0] + dx * lerp(1, .9, adv), y = OSM_ON[1] + dy - ch * 1.6 - adv * 4.2;
      blok(x, y, Math.PI, OSMC, fade, z);
    });
  });
}

window.SCENE_FNS = {
  /* "Bin üç yüzlerin hemen başında, bir temmuz günü, imparatorun gönderdiği ordu İzmit Körfezi'ne bakan bir ovada Osman'ı bekliyordu." */
  ova(t, s) {
    const Y = 1302.5, tt = C('p1:temmuz'), ti = C('p1:imparatorun'), tz = C('p1:İzmit'), tk = C("p1:Körfezi'ne"), tv = C('p1:ovada'), to = C("p1:Osman'ı");
    const cam = camAt([[0, 58, -16, 8.2], [tz, 63.5, -36, 12.4], [tv + .3, 64, -30, 13.4], [s.t1, 64, -27.5, 15.2]], t, .006);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    osmAlan(cam, .22); tepeler(cam, 1);
    // Bölüm 2'nin son karesi: imparatorun ordusunun oku; ordu ovaya varmış, ok söner
    const oa = 1 - seg(t, .6, ti); if (oa > 0) { ctx.save(); ctx.globalAlpha = oa; arrow(cam, B2_OK, 1, 22, BIZC, { col0: '#5a3f78' }); ctx.restore(); }
    biz0(cam, t, 1, { jit: .06 });
    mapLabel(cam, 'BİZANS ORDUSU', ORDU[0] + 2.2, ORDU[1] + 2.4, 26, { a: seg(t, ti + .2, ti + .7) * (1 - seg(t, s.t1 - .6, s.t1 - .2)), sp: 3 });
    ownCity(cam, 'İzmit', Y, { size: 30, a: seg(t, tz - .15, tz + .35) });
    mapLabel(cam, 'İZMİT KÖRFEZİ', 47, -29.2, 24, { a: seg(t, tk - .1, tk + .4), col: '#1f3a44', halo: 'rgba(200,222,226,.75)', sp: 4 });
    // "Osman'ı": tepelerin ardında kızıl bir ışık (beklenen düşman)
    const oh = seg(t, to - .2, to + .6); if (oh > 0) { const [gx, gy] = W2S(cam, ORDU[0] + 1, ORDU[1] + 9); glow(gx, gy, 260, 'rgba(200,50,35,.55)', oh * (.75 + .25 * Math.sin(t * 4))); }
    mapPin(cam, ...BAF, t, tv - .05, 'BAFEUS', { left: true, size: 30, col: BIZC });
    // T1 levhası: ~1302 · 27 TEMMUZ (başlık kartından önce)
    const la = seg(t, .35, .8) * (1 - seg(t, ti - .5, ti - .1));
    if (la > 0) { yearTicker(W / 2, 540, 1302, 124, { approx: true, a: la }); kinetic('27 TEMMUZ', W / 2, 660, 50, t, tt - .05, { mode: 'fade', fam: F.mont, w: 900, spacing: 8, col: '#f4ead2', out: ti - .5 }); }
  },
  /* "Ama bu ordu daha savaş başlamadan huzursuzdu." — ovada bekleyen saflar */
  saflar(t, s) {
    const th = C('p2:huzursuzdu'), el = t - s.t0, z = 1.0 + .012 * el, pan = -18 * el;
    const hz = .4 + .9 * eIO(seg(t, th - .3, th + .6));
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540 + pan * .3, -1100);
    ovaFon(t, { k: 0 });
    // arka saf: sancaklar
    for (let i = 0; i < 9; i++) asker(40 + i * 128 + pan * .4, 1170, .62, t, { ph: i * .7 + 3, sway: hz, sil: '#2a2026', shield: '#2a2026', shieldRim: 'rgba(160,130,190,.5)', turn: Math.sin(i * 2.3) });
    for (const x of [210, 590, 930]) pennant(x + pan * .4, 1172, .55, t, { col: BIZC });
    // ön saf
    for (let i = 0; i < 8; i++) asker(-10 + i * 150 + pan, 1395, 1.05, t, { ph: i * 1.3, sway: hz * 1.3, turn: Math.sin(i * 1.7 + t * .8) * hz, rim: 'rgba(255,210,150,.35)' });
    ctx.restore();
  },
  /* "Komutanı Muzalon, kendi askerlerinin atlarını alıp bozkırdan gelen Alan paralı askerlerine vermişti" */
  atlar(t, s) {
    const tm = C('p2:Muzalon'), ta = C('p2:atlarını'), tal = C('p2:Alan'), tv = C('p2:vermişti'), el = t - s.t0;
    const pan = 330 * eIO(seg(t, ta - .4, tv + .3)), z = 1.04 + .01 * el;
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540 - pan, -1100);
    ovaFon(t, { k: .15, wide: true });
    // Muzalon'un çadırı ve sancağı (solda)
    tent(250, 1290, .82, t, { sil: '#1c1420', door: 'rgba(255,190,120,.55)', smoke: false });
    pennant(410, 1300, .72, t, { col: BIZC });
    // atsız kalan askerler (ön sol)
    for (let i = 0; i < 4; i++) asker(40 + i * 120, 1440, 1.0, t, { ph: i * 1.1, sway: .9, turn: .9, rim: 'rgba(255,210,150,.3)' });
    // atlar götürülür: seyisler yular ile sağa yürür
    const walk = Math.max(0, t - ta + .3) * 135;
    for (let i = 0; i < 4; i++) { const x = 300 + i * 190 + walk; if (x > 1500) continue; yaya(x - 70, 1330, .78, t, { ph: i * .3, lead: true, sil: '#170f0b' }); yedekAt(x + 40, 1330, .78, t, { ph: i * .21 + .4, sil: '#170f0b' }); }
    // Alanlar (sağda): atlı paralı askerler
    for (let i = 0; i < 5; i++) rider(1220 + i * 95 + (i % 2) * 30, 1300 + (i % 2) * 18, .78, t, { speed: .25, ph: i * .31, sil: '#121014', flag: i === 2 ? '#a194b8' : null });
    ctx.restore();
    kinetic('MUZALON', 330 - pan * z, 900, 40, t, tm - .05, { mode: 'fade', fam: F.mont, w: 900, spacing: 8, col: '#f4ead2', out: ta + .2 });
    kinetic('ALANLAR', 760, 900, 46, t, tal - .05, { mode: 'fade', fam: F.cinzel, w: 900, gold: true, spacing: 6, out: s.t1 - .3 });
  },
  /* "ve saflarda öfke büyüyordu." */
  ofke(t, s) {
    const k = eIO(seg(t, s.t0, s.t1)), z = lerp(1.18, 1.3, k);
    ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-540 + 40 * k, -1150);
    ovaFon(t, { k: .3 });
    for (let i = 0; i < 9; i++) asker(30 + i * 128, 1180, .6, t, { ph: i * .7 + 3, sway: 2.2, sil: '#2a1a1c', shield: '#2a1a1c', turn: 1 });
    for (let i = 0; i < 7; i++) asker(20 + i * 170, 1420, 1.1, t, { ph: i * 1.3, sway: 2.6, turn: Math.sin(i * 1.7 + t * 2.6), rim: `rgba(220,70,40,${.35 + .4 * k})` });
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .25 + .3 * k; ctx.fillStyle = '#b0302a'; ctx.fillRect(0, 0, W, H); ctx.restore();
  },
  /* "Tam bu sırada Osman'ın atlıları dağ geçidinden indi ve birden ovada belirdi." */
  gecit(t, s) {
    const ti = C('p3:indi'), tb = C('p3:birden'), tbl = C('p3:belirdi'), el = t - s.t0;
    const cam = [[s.t0, 560, 780, 1.45], [ti, 548, 1000, 1.2], [tb, 540, 1150, 1.0], [s.t1, 540, 1190, .95]];
    const [cx, cy, z] = camPath(cam, t, { creep: .004 });
    ctx.save(); sahneCam(cx, cy, z);
    ctx.fillStyle = lg(0, 200, 0, 1300, [[0, '#4a5a7a'], [.55, '#e0a868'], [1, '#f6d29a']]); ctx.fillRect(-800, -800, 2700, 2400);
    glow(560, 600, 520, 'rgba(255,200,120,.6)');
    // dağlar: geçidi açan iki kütle
    ctx.fillStyle = '#3a3036'; ctx.beginPath(); ctx.moveTo(-800, 1500); ctx.lineTo(-300, 900); ctx.lineTo(120, 520); ctx.lineTo(260, 380); ctx.lineTo(420, 560); ctx.lineTo(520, 650); ctx.lineTo(560, 690); ctx.lineTo(560, 1600); ctx.lineTo(-800, 1600); ctx.fill();
    ctx.fillStyle = '#2e262c'; ctx.beginPath(); ctx.moveTo(560, 690); ctx.lineTo(620, 640); ctx.lineTo(760, 420); ctx.lineTo(860, 330); ctx.lineTo(1100, 620); ctx.lineTo(1500, 900); ctx.lineTo(1900, 1600); ctx.lineTo(560, 1600); ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,140,.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(260, 380); ctx.lineTo(420, 560); ctx.lineTo(560, 690); ctx.lineTo(760, 420); ctx.lineTo(860, 330); ctx.stroke();
    // yol: geçitten ovaya kıvrılır
    const path = spline([[562, 690], [600, 820], [500, 960], [620, 1110], [520, 1260], [560, 1420]], 14), L = polyLen(path);
    ctx.strokeStyle = 'rgba(200,160,110,.35)'; ctx.lineWidth = 16; tracePath(path); ctx.stroke();
    // atlılar sırayla iner
    const base = (t - s.t0) * .2 + .05;
    for (let i = 11; i >= 0; i--) {
      const k = base - i * .055; if (k <= 0 || k >= 1) continue;
      const [x, y, ang] = pointAt(path, L, k), sc = lerp(.16, .5, k), fl = Math.cos(ang) < 0;
      toz(x - (fl ? -40 : 40) * sc * 2, y - 8, 90 * sc * 2, .5);
      rider(x, y, sc, t, { speed: 1.6, ph: i * .17, sil: '#140c0a', flip: fl, flag: i % 4 === 0 ? OSMC : null });
    }
    // ova kenarı: "birden" geniş bir cephe belirir
    ctx.fillStyle = '#20181a'; ctx.beginPath(); ctx.moveTo(-800, 1480); for (let x = -800; x <= 1900; x += 50) ctx.lineTo(x, 1450 - 14 * Math.sin(x * .01)); ctx.lineTo(1900, 1700); ctx.lineTo(-800, 1700); ctx.fill();
    const up = eOut(seg(t, tb - .2, tbl + .3));
    if (up > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(-800, 0, 2700, 1462); ctx.clip();
      for (let i = 0; i < 15; i++) { const x = -260 + i * 112 + (i % 2) * 40, y = 1460 + (1 - up) * 160 + (i % 3) * 6; rider(x, y, .5, t, { speed: .9, ph: i * .29, sil: '#120a08', flag: i % 3 === 1 ? OSMC : null }); }
      ctx.restore();
      const hp = hitPulse(t, tbl, 1.0); if (hp > 0) glow(540, 1400, 600 * hp, 'rgba(255,190,120,.45)');
      toz(540, 1430, 900, .35 * up);
    }
    ctx.fillStyle = lg(0, 1460, 0, 1900, [[0, '#1a1214'], [1, '#080506']]); ctx.fillRect(-800, 1462, 2700, 800);
    ctx.restore();
  },
  /* "Sayıca Bizanslılardan çok daha fazlaydılar." — harita: kızıl bloklar */
  kuvvet(t, s) {
    const Y = 1302.5, ts = C('p3:Sayıca'), tf = C('p3:fazlaydılar');
    const cam = camAt([[s.t0, 63.5, -19.5, 10.6], [s.t1, 64, -20.5, 12.0]], t, .004);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    osmAlan(cam, .22); tepeler(cam, 1);
    ownCity(cam, 'İzmit', Y, { size: 28 });
    // geçitten inen yol: kızıl oklar tepelerin içinden
    const ak = eIO(seg(t, s.t0, ts + .6));
    for (const [x0, x1] of [[56, 58.5], [63, 63.5], [70, 68]]) arrow(cam, [[x0, -6], [x0 + 1, -11], [x1, -16]], ak, 14, OSMC);
    biz0(cam, t, 1, { jit: .1 });
    osm0(cam, t, ts - .1);
    const hp = hitPulse(t, tf, 1.1); if (hp > 0) { const [x, y] = W2S(cam, ...OSM_ON); glow(x, y, 360 * hp, 'rgba(220,80,50,.45)'); }
  },
  /* "Türk atlıları hücuma kalkınca Bizans hattı dağıldı." — kahraman an */
  hucum(t, s) {
    const th = C('p4:hücuma'), td = C('p4:dağıldı'), el = t - s.t0, pan = 150 * eIO(seg(t, s.t0, s.t1)), br = seg(t, td - .1, td + .9);
    ctx.save(); ctx.translate(-pan, 0);
    ctx.fillStyle = lg(0, 0, 0, 1150, [[0, '#56627a'], [.6, '#d9a56c'], [1, '#f0c890']]); ctx.fillRect(-200, -200, W + 600, H + 400);
    glow(860, 900, 480, 'rgba(255,200,130,.45)');
    ctx.fillStyle = '#4a4046'; ctx.beginPath(); ctx.moveTo(-200, 1120); for (let x = -200; x <= W + 400; x += 40) ctx.lineTo(x, 1040 - 40 * Math.sin(x * .004 + 2) - 16 * Math.cos(x * .013)); ctx.lineTo(W + 400, 1130); ctx.fill();
    ctx.fillStyle = lg(0, 1110, 0, H, [[0, '#6a5038'], [.3, '#3a2a1e'], [1, '#0a0705']]); ctx.fillRect(-200, 1110, W + 600, H);
    // Bizans hattı (sağda, sola bakar): "dağıldı"da kırılır, kaçar
    for (let i = 0; i < 7; i++) {
      const x0 = 700 + i * 82 + (i % 2) * 20, y0 = 1250 + (i % 2) * 22, ph = i * 1.37, kk = clamp(br * 1.4 - (i % 3) * .15);
      const lean = kk * (.25 + .2 * Math.sin(ph)), run = kk > .35;
      asker(x0 + kk * (90 + i * 30) + (run ? (t - td) * 120 : 0), y0, .74, t, { flip: !run, ph, sway: .8 * (1 - kk), lean: run ? -.08 : lean, run: run ? 1 : 0, spearA: kk * (1.1 + .3 * Math.sin(ph)) * (run ? -1 : 1), rim: 'rgba(255,200,140,.3)' });
    }
    if (t > td) smokeLayer(t, .6 * seg(t, td, td + 1.5), '#3a2a20', 9);
    // hücum: üç katman atlı soldan sağa
    const go = t - th;
    for (const [n, y, sc, v, x0, gap] of [[7, 1180, .45, 260, -320, 150], [5, 1300, .78, 420, -520, 230], [3, 1480, 1.3, 620, -760, 380]]) {
      for (let i = 0; i < n; i++) {
        const x = x0 - i * gap * .35 + (i % 2) * gap + Math.max(0, go + .6) * v + 120 * el * (sc < .5 ? 1 : 0), yy = y + (i % 2) * 14 * sc;
        toz(x - 160 * sc, yy - 20 * sc, 260 * sc, .45 * seg(t, th - .3, th + .3));
        rider(x, yy, sc, t, { speed: 2.6, ph: i * .31 + sc, sil: sc > 1 ? '#080404' : '#140a08', flag: i === 0 ? OSMC : null });
      }
    }
    const hp = hitPulse(t, td, 1.0); if (hp > 0) glow(760, 1220, 620 * hp, 'rgba(255,210,150,.5)');
    ctx.restore();
  },
  /* "Yalnızca Alan atlıları geride kalıp kaçanları korudu ve kurtulanlar İzmit surlarının ardına sığındı. Meydan Osman'ın atlılarına kaldı." */
  ricat(t, s) {
    const Y = 1302.5, cam = zaferCam(t), ty = C('p4:Yalnızca'), tk = C('p4:korudu'), tku = C('p4:kurtulanlar'), tiz = C('p4:İzmit'), tsg = C('p4:sığındı'), tm = C('p4:Meydan'), tkl = C('p4:kaldı');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    osmAlan(cam, .22); tepeler(cam, 1);
    // kaçış okları: ovadan İzmit'e
    const ra = 1 - seg(t, tsg + .6, tm);
    if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; const k = eIO(seg(t, ty - .3, tsg)); arrow(cam, [[ORDU[0] - 1, ORDU[1] - .5], [ORDU[0] + 4, ORDU[1] - 2.2], [KAPI[0] - 3, KAPI[1] + 1.2], [...KAPI]], k, 18, BIZC, { col0: '#5a3f78' }); ctx.restore(); }
    // Alanların koruma hattı
    const ga = seg(t, tk - .4, tk + .2) * (1 - seg(t, tku + .2, tku + .8));
    if (ga > 0) glowPath(cam, [[ORDU[0] + 2, ORDU[1] + 2.6], [ORDU[0] + 5.6, ORDU[1] + 3.2], [ORDU[0] + 9.6, ORDU[1] + 2.6]], t, 1, { w: 6, col: '#c9b8e8', a: ga });
    // İzmit surları: "İzmit"te halka, "sığındı"da kapanır
    const [ix, iy] = W2S(cam, ...IZM), sa = seg(t, tiz - .2, tiz + .3), cl = eIO(seg(t, tsg - .2, tsg + .4));
    surHalka(ix, iy, 2.6 * cam[2], BIZC, sa, lerp(5, 9, cl), cl < 1 ? [lerp(14, 40, cl), lerp(12, 0.01, cl)] : null);
    const hs = hitPulse(t, tsg + .1, 1.2); if (hs > 0) glow(ix, iy, 200 * hs, 'rgba(200,170,240,.55)');
    ricatBirlik(cam, t);
    ownCity(cam, 'İzmit', Y, { size: 30, a: sa });
    // meydan: kızıl ışık ve sancak
    const [px, py] = W2S(cam, ...ORDU), mk = seg(t, tm - .1, tkl + .4);
    if (mk > 0) glow(px, py, 12 * cam[2] * (.6 + .4 * mk), 'rgba(200,60,40,.4)', mk);
    const up = eOut(seg(t, tkl - .1, tkl + .6)); if (up > 0) { ctx.save(); ctx.beginPath(); ctx.rect(px - 20, py - 160, 160, 160); ctx.clip(); pennant(px, py + 130 * (1 - up), .5, t, { col: OSMC }); ctx.restore(); }
  },
  /* harita sessizliği (2 sn): meydan kızıl; rüya ağacı zafer meydanında filizlenir (sezon ipliği) */
  sessizlik(t, s) {
    const Y = 1302.5, cam = zaferCam(t), te = C('p4.end'), tp = C('p4.end+1.0');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    osmAlan(cam, .22); tepeler(cam, 1);
    const [ix, iy] = W2S(cam, ...IZM); surHalka(ix, iy, 2.6 * cam[2], BIZC, 1, 9);
    ricatBirlik(cam, t);
    ownCity(cam, 'İzmit', Y, { size: 30 });
    const [px, py] = W2S(cam, ...ORDU), hp = hitPulse(t, tp, 1.4);
    glow(px, py, 12 * cam[2], 'rgba(200,60,40,.42)'); if (hp > 0) glow(px, py, 300 * hp, 'rgba(255,200,130,.6)');
    const g = eOut(seg(t, te + .45, te + 2.0)); if (g > 0) { ctx.save(); ctx.globalAlpha = .95; glow(px, py - 120, 260 * g, 'rgba(255,214,130,.3)'); miniTree(px, py, clamp(cam[2] * .085, .3, 1.15), g, t); ctx.restore(); }
    pennant(px, py, .5, t, { col: OSMC });
  },
  /* "Bu zaferi Türkler Koyunhisar diye andı." — aynı kamera geri çekilir */
  koyunhisar(t, s) {
    const Y = 1303, cam = zaferCam(t), tk = C('p5:Koyunhisar'), tz = C('p5:Zaferin');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    osmAlan(cam, .22); tepeler(cam, 1 - seg(t, s.t0, s.t1));
    const [ix, iy] = W2S(cam, ...IZM); surHalka(ix, iy, 2.6 * cam[2], BIZC, 1, 7);
    ricatBirlik(cam, t, { fade: 1 - seg(t, s.t0, s.t0 + 1.2) });
    ownCity(cam, 'İzmit', Y, { size: 28 });
    const [px, py] = W2S(cam, ...ORDU);
    glow(px, py, 12 * cam[2], 'rgba(200,60,40,.42)');
    miniTree(px, py, clamp(cam[2] * .085, .3, 1.15), 1, t);
    pennant(px, py, .5 * clamp(cam[2] / 10, .55, 1), t, { col: OSMC });
    const hk = hitPulse(t, tk, 1.2); if (hk > 0) glow(px, py, 380 * hk, 'rgba(255,214,140,.55)');
    kinetic('KOYUNHİSAR', W / 2, 600, 84, t, tk - .08, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 3, out: tz - .25 });
    const rl = eOut(seg(t, tk + .2, tk + .9)) * (1 - seg(t, tz - .25, tz + .05)) * 300;
    if (rl > 1) { ctx.save(); ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - rl, 668); ctx.lineTo(W / 2 + rl, 668); ctx.stroke(); ctx.restore(); }
  },
  /* "Zaferin haberi kısa sürede Karadeniz kıyısındaki Paflagonya'ya kadar ulaştı ve uç savaşçıları Osman'ın sancağı altına koştu." */
  dalga(t, s) {
    const Y = 1303, cam = zaferCam(t), tz = C('p5:Zaferin'), tkd = C('p5:Karadeniz'), tpf = C("p5:Paflagonya'ya"), tu = C('p5:uç'), tsn = C('p5:sancağı'), tko = C('p5:koştu');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    osmAlan(cam, .25);
    // Paflagonya (yaklaşık: Kastamonu, Sinop, Bartın, Karabük)
    const pa = seg(t, tpf - .3, tpf + .5) * (1 - .5 * seg(t, tu, tu + 1));
    if (pa > 0) inWorld(cam, () => { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .5 * pa; ctx.fillStyle = '#ffcf6a'; for (const u of ['TUR:Kastamonu', 'TUR:Sinop', 'TUR:Bartın', 'TUR:Karabük']) if (PATHS.st[u]) ctx.fill(PATHS.st[u], 'evenodd'); ctx.restore(); });
    // haber dalgası: Bafeus'tan halka halka
    inWorld(cam, () => { const z = cam[2];
      for (let j = 0; j < 4; j++) { const r = (t - tz - j * .55) * 112; if (r <= 0 || r > 470) continue; const a = (1 - r / 470);
        ctx.save(); ctx.globalAlpha = .9 * a; ctx.strokeStyle = '#f2c75c'; ctx.lineWidth = 6 / z; ctx.beginPath(); ctx.arc(ORDU[0], ORDU[1], r, 0, TAU); ctx.stroke();
        ctx.globalAlpha = .25 * a; ctx.lineWidth = 22 / z; ctx.stroke(); ctx.restore(); }
    });
    const [px, py] = W2S(cam, ...ORDU); miniTree(px, py, clamp(cam[2] * .085, .2, 1.15), 1, t, { leaves: false });
    mapLabel(cam, 'KARADENİZ', KDZ[0] - 20, KDZ[1] + 10, 40, { a: seg(t, tkd - .1, tkd + .4), col: '#1f3a44', halo: 'rgba(200,222,226,.75)', sp: 10 });
    mapLabel(cam, 'PAFLAGONYA', PAF[0] - 32, PAF[1] + 18, 34, { a: seg(t, tpf - .1, tpf + .4), sp: 5 });
    // uç savaşçıları: çeşitli yönlerden Osman'ın sancağına
    const ak = k0 => eIO(seg(t, tu - .2 + k0, tko + .2 + k0));
    arrow(cam, [[340, -115], [250, -70], [150, -10], [YEN[0] + 12, YEN[1] - 8]], ak(0), 14, BEYC, { col0: '#e8d29a' });
    arrow(cam, [[230, 60], [160, 50], [YEN[0] + 14, YEN[1] + 4]], ak(.15), 12, BEYC, { col0: '#e8d29a' });
    arrow(cam, [[150, 170], [110, 100], [YEN[0] + 6, YEN[1] + 12]], ak(.3), 12, BEYC, { col0: '#e8d29a' });
    const [yx, yy] = W2S(cam, ...YEN), up = eOut(seg(t, tsn - .2, tsn + .5));
    if (up > 0) { const hp = hitPulse(t, tko, 1.2); if (hp > 0) glow(yx, yy, 220 * hp, 'rgba(255,200,130,.6)'); ctx.save(); ctx.beginPath(); ctx.rect(yx - 20, yy - 150, 160, 152); ctx.clip(); pennant(yx, yy + 140 * (1 - up), .48, t, { col: OSMC }); ctx.restore(); }
  },
  /* "Bitinya'nın köylüleri ise tarlalarını bırakıp İstanbul'a kaçtı" */
  kacis(t, s) {
    const el = t - s.t0, ti = C("p5:İstanbul'a"), pan = 26 * el, z = 1 + .01 * el;
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540 - pan, -1100);
    ctx.fillStyle = lg(0, 0, 0, 960, [[0, '#1c1c34'], [.6, '#5a4058'], [.9, '#c27a52'], [1, '#e09a62']]); ctx.fillRect(-300, -300, W + 900, 1300);
    glow(960, 940, 520, 'rgba(255,170,100,.4)');
    // deniz ve öte yakada surlu şehir (İstanbul)
    ctx.fillStyle = lg(0, 930, 0, 1010, [[0, '#7a6a78'], [1, '#3a3446']]); ctx.fillRect(-300, 930, W + 900, 90);
    ctx.strokeStyle = 'rgba(255,200,150,.25)'; ctx.lineWidth = 2; for (let i = 0; i < 14; i++) { const y = 945 + i * 5, x = ((i * 173 + el * 30) % 1400) - 200; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 90, y); ctx.stroke(); }
    const ia = .7 + .3 * seg(t, ti - .2, ti + .8);
    ctx.fillStyle = '#2a2236'; ctx.fillRect(760, 902, 520, 30);
    for (let i = 0; i < 12; i++) { const x = 770 + i * 44, h = 18 + (i % 3) * 12; ctx.fillRect(x, 902 - h, 22, h); }
    ctx.save(); ctx.globalAlpha = ia; for (let i = 0; i < 9; i++) fener(790 + i * 52 + (i % 2) * 12, 914 - (i % 3) * 8, .7, 4); ctx.restore();
    // tarla: başaklar, terk edilmiş karasaban
    ctx.fillStyle = lg(0, 1010, 0, H, [[0, '#4a3628'], [.4, '#2a1c14'], [1, '#0a0605']]); ctx.fillRect(-300, 1010, W + 900, H);
    const R = rng(54); ctx.strokeStyle = 'rgba(210,170,100,.35)'; ctx.lineWidth = 3;
    for (let i = 0; i < 140; i++) { const x = -250 + R() * (W + 800), y = 1040 + R() * 520, h = 20 + R() * 40, sw = Math.sin(t * 1.4 + x * .01) * 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * .5, y - h * .6, x + sw, y - h); ctx.stroke(); }
    karasaban(150, 1420, 1.1);
    // göç eden köylüler (sağa, kıyıya)
    const walk = el * 60;
    const fam = [[380, 1300, .95, 0], [470, 1310, .62, 1], [640, 1295, .9, 0], [860, 1305, .95, 0], [950, 1312, .6, 1], [1120, 1300, .9, 0]];
    fam.forEach(([x, y, sc, ch], i) => koylu(x + walk, y, sc, t, { ph: i * .27, child: !!ch, sil: '#0c080a' }));
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .3; ctx.fillStyle = '#3a4a7a'; ctx.fillRect(0, 0, W, H); ctx.restore();
  },
  /* "ve Bizans'ın elinde yalnızca surlu şehirler kaldı. Bu surlu şehirlerden biri de Uludağ'ın eteğindeki Bursa'ydı." */
  surlar(t, s) {
    const Y = 1303, ts = C('p5:surlu'), tb = C('p6'), tu = C("p6:Uludağ'ın"), tbr = C("p6:Bursa'ydı");
    const cam = camAt([[s.t0, 40, -10, 3.6], [tb + .2, 36, -4, 3.9], [tu, 16, 26, 6.6], [tbr + .3, 8, 33, 9.6], [s.t1, 7, 34, 10.4]], t, .004);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    // kırsal boşalır: Bizans kırsalı solar (temsilî; sahiplik tablosu değişmez)
    const wa = .62 * eIO(seg(t, s.t0 + .1, ts));
    if (wa > 0) inWorld(cam, () => { ctx.save(); ctx.globalAlpha = wa; ctx.fillStyle = '#e3d3ac'; for (const u of ['TUR:Bursa', 'TUR:Kocaeli', 'TUR:Yalova', 'TUR:Sakarya']) if (PATHS.st[u]) ctx.fill(PATHS.st[u], 'evenodd');
      ctx.globalAlpha = wa * .5; ctx.strokeStyle = 'rgba(122,90,154,.6)'; ctx.lineWidth = 1.5 / cam[2]; ctx.setLineDash([6 / cam[2], 6 / cam[2]]); for (const u of ['TUR:Bursa', 'TUR:Kocaeli', 'TUR:Yalova', 'TUR:Sakarya']) if (PATHS.st[u]) ctx.stroke(PATHS.st[u]); ctx.restore(); });
    osmAlan(cam, .25);
    mapLabel(cam, 'BİTİNYA', 30, -6, 40, { a: seg(t, s.t0 + .2, s.t0 + .7) * (1 - seg(t, tb, tb + .5)), sp: 12 });
    // surlu şehirler: mor halkalar
    [['Konstantinopolis', 5.5], ['İzmit', 3.2], ['İznik', 3.2], ['Bursa', 3.2]].forEach(([n, r], i) => {
      const [x, y] = W2S(cam, ...CITY[n]), k = spring(t, ts - .1 + i * .14, { freq: 1.8, damp: .55 });
      surHalka(x, y, r * cam[2] * clamp(k, 0, 1.3), BIZC, clamp(k * 1.5), 6);
      if (k > 0) { ctx.save(); ctx.globalAlpha = .3 * clamp(k); ctx.fillStyle = BIZC; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r * cam[2] * clamp(k, 0, 1.3)), 0, TAU); ctx.fill(); ctx.restore(); }
    });
    const ca = 1 - seg(t, tu - .4, tu + .2);
    for (const n of ['Konstantinopolis', 'İzmit', 'İznik']) ownCity(cam, n, Y, { size: 28, a: seg(t, ts, ts + .5) * ca });
    // Uludağ: dağ işareti
    const ua = seg(t, tu - .2, tu + .4);
    if (ua > 0) inWorld(cam, () => { const z = cam[2]; ctx.save(); ctx.globalAlpha = ua;
      for (const [dx, dy, sz] of [[0, 0, 1], [-5, 2, .7], [5.5, 1.5, .75], [-9, 3.5, .5], [10, 3.2, .55]]) { const x = ULU[0] + dx, y = ULU[1] + dy, w = 5 * sz, h = 6 * sz;
        ctx.fillStyle = '#8a7a62'; ctx.beginPath(); ctx.moveTo(x - w, y + h * .4); ctx.lineTo(x, y - h * .6); ctx.lineTo(x + w, y + h * .4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#f4f0e6'; ctx.beginPath(); ctx.moveTo(x - w * .32, y - h * .22); ctx.lineTo(x, y - h * .6); ctx.lineTo(x + w * .32, y - h * .22); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#3a2c1c'; ctx.lineWidth = 2 / z; ctx.beginPath(); ctx.moveTo(x - w, y + h * .4); ctx.lineTo(x, y - h * .6); ctx.lineTo(x + w, y + h * .4); ctx.stroke(); }
      ctx.restore(); });
    mapLabel(cam, 'ULUDAĞ', ULU[0] + 1, ULU[1] + 8, 30, { a: ua, sp: 6 });
    mapPin(cam, ...BUR, t, tbr - .05, 'BURSA', { size: 34, col: BIZC });
  },
  /* "Ama Bursa'nın surları sarp kayalara yaslanıyordu ve şehir kılıçla alınacak gibi değildi." */
  kayalar(t, s) {
    const tsr = C('p6:sarp'), ty = C('p6:yaslanıyordu'), tk = C('p6:kılıçla'), td = C('p6:değildi');
    const K = [[s.t0, 560, 1230, 1.9], [tsr, 560, 1150, 1.75], [ty + .3, 555, 1000, 1.55], [tk, 548, 990, 1.42], [s.t1, 540, 960, 1.38]];
    ctx.save(); sahneCam(...camPath(K, t, { creep: .004 }));
    bursaSahne(t, { gece: 0, altin: .15 });
    // kayanın dibinde küçük kalan atlılar (ölçek: sur kılıçla alınmaz)
    const ra = seg(t, tk - .4, tk + .2), st = eOut(seg(t, tk - .4, td));
    if (ra > 0) for (let i = 0; i < 5; i++) { ctx.save(); ctx.globalAlpha = ra; rider(380 + i * 52 + st * 40, 1336 + (i % 2) * 6, .2, t, { speed: lerp(2, .3, st), ph: i * .3, sil: '#1a0e0a', flag: i === 2 ? OSMC : null }); ctx.restore(); }
    const hp = hitPulse(t, td, 1.0); if (hp > 0) glow(560, 930, 240 * hp, 'rgba(255,220,170,.35)');
    ctx.restore();
  },
  /* "Bu yüzden Osman saldırmak yerine şehrin iki yanına iki kule diktirdi. Birinin başına yeğeni Aktimur'u, ötekinin başına Balabancık'ı koydu." */
  kuleler(t, s) {
    const ts = C('p6:saldırmak'), tk = C('p6:iki#2'), tdk = C('p6:diktirdi'), ta = C("p6:Aktimur'u"), tb = C("p6:Balabancık'ı");
    const K = [[s.t0, 540, 960, 1.38], [ts, 540, 1000, 1.12], [tk, 540, 1040, .92], [tdk + .5, 540, 1040, .86], [s.t1, 540, 1030, .9]];
    ctx.save(); sahneCam(...camPath(K, t, { creep: .004 }));
    const kL = eOut(seg(t, tk - .35, tdk + .1)), kR = eOut(seg(t, tk - .1, tdk + .35));
    bursaSahne(t, { gece: 0, altin: .2 + .2 * seg(t, s.t0, s.t1), kuleL: kL, kuleR: kR, bayrak: seg(t, tdk + .1, tdk + .9) });
    ctx.restore();
    kinetic('AKTİMUR', W / 2, 500, 70, t, ta - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 3, out: s.t1 - .35 });
    kinetic('BALABANCIK', W / 2, 600, 70, t, tb - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 3, out: s.t1 - .35 });
  },
  /* "Düşünün: bu kuleler yıllarca şehri gözledi ve Bursa'ya ne yiyecek ne yardım ulaşabildi." — öznel kamera: kulenin tepesinden */
  gozetleme(t, s) {
    const el = t - s.t0, ty = C('p7:yıllarca'), tyi = C('p7:yiyecek'), tul = C('p7:ulaşabildi');
    const sp = .32 + .5 * seg(t, ty - .2, ty + 1.2), ph = el * sp + .02, gece = .5 + .5 * Math.cos(TAU * ph), z = 1 + .012 * el;
    ctx.save(); ctx.translate(540, 900); ctx.scale(.66 * z, .66 * z); ctx.translate(-540, -960);
    bursaSahne(t, { gece, isik: gece * (1 - .6 * seg(t, ty, s.t1)), kule: 1, bayrak: 1, ates: gece });
    // yardım kervanı: meşaleler şehre yaklaşır, durur ve geri döner
    const ka = seg(t, tyi - .3, tyi + .3) * (1 - seg(t, tul + .5, tul + 1.1)), back = eIO(seg(t, tul - .2, tul + 1.1));
    for (let i = 0; i < 5; i++) { const k = clamp(eOut(seg(t, tyi - .4, tul)) * .55 - i * .05 - back * .45, 0, 1), x = lerp(-420, 360, k) - i * 26, y = lerp(1560, 1345, k) + i * 6; fener(x, y, ka * (.5 + .5 * gece), 8); }
    ctx.restore();
    // ön plan: kulenin mazgalları, mangal, nöbetçi
    ctx.fillStyle = '#0c0a0c'; ctx.fillRect(0, 1360, W, 600);
    for (const x of [-20, 300, 620, 940]) ctx.fillRect(x, 1210, 180, 160);
    ctx.fillStyle = 'rgba(255,170,90,.12)'; ctx.fillRect(0, 1360, W, 8);
    const fl = .85 + .15 * Math.sin(t * 12);
    glow(840, 1180, 300 * fl, 'rgba(255,150,60,.5)'); glow(840, 1190, 90 * fl, 'rgba(255,220,150,.9)');
    ctx.fillStyle = '#0c0a0c'; ctx.beginPath(); ctx.moveTo(790, 1210); ctx.lineTo(890, 1210); ctx.lineTo(870, 1240); ctx.lineTo(810, 1240); ctx.fill();
    asker(250, 1385, 1.25, t, { ph: 2, sway: .25, sil: '#070506', shield: '#070506', rim: `rgba(255,160,80,${.25 + .3 * gece})` });
  },
  /* "Bu arada Osman yaşlanıp hastalandı; seferlere artık oğlu Orhan çıkıyordu." */
  yaslilik(t, s) {
    const to = C('p7:Osman'), th = C('p7:hastalandı'), tor = C('p7:Orhan'), tsf = C('p7:seferlere'), el = t - s.t0;
    const pan = 170 * eIO(seg(t, tsf - .3, tor + .4)), z = 1.02 + .01 * el;
    ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.translate(-540 - pan, -1050);
    ctx.fillStyle = lg(0, 300, 0, 1500, [[0, '#2a1a10'], [.6, '#3e2616'], [1, '#120a06']]); ctx.fillRect(-300, -200, W + 800, H + 400);
    ctx.strokeStyle = 'rgba(10,5,3,.4)'; ctx.lineWidth = 6; for (let x = -280; x < W + 500; x += 70) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.quadraticCurveTo(x + 20, 800, x - 10, 1300); ctx.stroke(); }
    // kapı aralığı: dışarısı gündüz
    const dx0 = 820, dx1 = 1060;
    ctx.save(); ctx.beginPath(); ctx.moveTo(dx0, 1300); ctx.lineTo(dx0 + 30, 760); ctx.quadraticCurveTo((dx0 + dx1) / 2, 690, dx1 - 30, 760); ctx.lineTo(dx1, 1300); ctx.closePath(); ctx.clip();
    ctx.fillStyle = lg(0, 700, 0, 1300, [[0, '#cfd8dc'], [.6, '#f1d7a4'], [.62, '#b49a6a'], [1, '#7a6440']]); ctx.fillRect(dx0, 680, dx1 - dx0, 640);
    const ra = seg(t, tor - .5, tor), rx = lerp(dx0 + 40, dx1 + 140, eIn(seg(t, tor - .3, s.t1 + .3)));
    if (ra > 0) { toz(rx - 50, 1068, 110, .5 * ra, '200,170,120'); rider(rx, 1080, .42, t, { speed: 2.4, ph: .2, sil: '#2a1a12', flag: OSMC }); }
    ctx.restore();
    glow((dx0 + dx1) / 2, 1100, 420, 'rgba(255,220,160,.22)');
    // Osman: oturan, yaşlı siluet; yanında tuğ, önünde sönen mum
    const slump = .06 * eIO(seg(t, th - .4, th + 1.2));
    tug(170, 1330, .78, t, { sil: '#120a06' });
    ctx.save(); ctx.translate(420, 1250); ctx.rotate(slump); ctx.translate(-420, -1250); seated(420, 1250, 1.1, { hat: 'sarik', beard: true, rim: 'rgba(255,170,80,.5)', col: '#0a0605' }); ctx.restore();
    candle(640, 1250, 1, t, 1 - .55 * seg(t, th, th + 1.5), 4);
    ctx.fillStyle = lg(0, 1250, 0, H, [[0, '#1a0f08'], [1, '#050302']]); ctx.fillRect(-300, 1250, W + 800, H);
    ctx.restore();
    kinetic('OSMAN', 420 - pan * z, 800, 52, t, to - .05, { mode: 'fade', fam: F.cinzel, w: 900, gold: true, spacing: 4, out: tor - .3 });
    kinetic('ORHAN', 790, 650, 52, t, tor - .05, { mode: 'fade', fam: F.cinzel, w: 900, gold: true, spacing: 4, out: s.t1 - .2 });
  },
  /* "Şehrin denize açılan kapısı Mudanya da düşünce Bursa büsbütün yalnız kaldı." */
  mudanya(t, s) {
    const Y = 1321, tdn = C('p7:denize'), tm = C('p7:Mudanya'), td = C('p7:düşünce'), tbs = C('p7:büsbütün'), tk = C('p7:kaldı');
    const cam = camAt([[s.t0, 0, 4, 5.6], [tm, -4, 12, 6.8], [tbs, 2, 26, 8.4], [s.t1, 4, 30, 9.4]], t, .004);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    // deniz yolu: Mudanya → Konstantinopolis; "düşünce" kesilir
    const cut = seg(t, td, td + .6), ra = seg(t, tdn - .3, tdn + .4) * (1 - cut);
    const yol = [[...MUD], [-15, 2], [-16, -22], [-9, -44], [...KON]];
    if (ra > 0) { glowPath(cam, yol, t, eIO(seg(t, tdn - .3, tdn + .8)), { w: 5, col: '#b9a2d8', dash: true, a: ra });
      const P = spline(yol.map(p => W2S(cam, ...p)), 12), L = polyLen(P); ctx.save(); ctx.globalAlpha = ra; for (let i = 0; i < 4; i++) { const [x, y] = pointAt(P, L, fract(t * .12 + i / 4)); ctx.fillStyle = '#efe6f8'; ctx.strokeStyle = '#2a1a3a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 9, 4, 0, 0, TAU); ctx.fill(); ctx.stroke(); } ctx.restore(); }
    if (cut > 0 && cut < 1) { const [x, y] = W2S(cam, -15.5, -8); ctx.save(); ctx.globalAlpha = 1 - cut; ctx.strokeStyle = OSMC; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 40, y - 30); ctx.lineTo(x + 40, y + 30); ctx.stroke(); ctx.restore(); }
    // Bursa: mor sur halkası; çevresinde daralan kızıl abluka halkası
    const [bx, by] = W2S(cam, ...BUR), z = cam[2];
    surHalka(bx, by, 2.4 * z, BIZC, 1, 7);
    const sq = eIO(seg(t, tbs - .3, tk + .5)); surHalka(bx, by, lerp(7.5, 4.2, sq) * z + 10, 'rgba(168,50,42,.25)', 1, 18); surHalka(bx, by, lerp(7.5, 4.2, sq) * z, OSMC, 1, 5, [16, 10]);
    const hb = hitPulse(t, tbs, 1.4); if (hb > 0) glow(bx, by, 180 * hb, 'rgba(200,170,240,.5)');
    ownCity(cam, 'Bursa', Y, { size: 32 });
    // Mudanya: mor nokta → "düşünce" kızıl
    const [mx, my] = W2S(cam, ...MUD), mc = mix(BIZC, OSMC, seg(t, td - .1, td + .4)), hm = hitPulse(t, td, 1.2);
    if (hm > 0) glow(mx, my, 200 * hm, 'rgba(255,190,120,.6)');
    ctx.save(); ctx.fillStyle = mc; ctx.strokeStyle = '#f4e8cc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(mx, my, 9, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    mapPin(cam, ...MUD, t, tm - .05, 'MUDANYA', { left: true, size: 32, col: mc, a: 1 - seg(t, tbs, tbs + .4) });
    ownCity(cam, 'Konstantinopolis', Y, { size: 26, a: seg(t, tdn, tdn + .4) * (1 - seg(t, tbs - .3, tbs + .2)) });
  },
  /* "Anlatılır ki Osman kuşatılmış şehri uzaktan seyrederken güneşte gümüş gibi parlayan bir kubbe görmüş ve o kubbenin altına gömülmeyi dilemiş." — RİVAYET */
  kubbe(t, s) {
    const tsy = C('p8:seyrederken'), tg = C('p8:güneşte'), tgm = C('p8:gümüş'), tpr = C('p8:parlayan'), tkb = C('p8:kubbe'), tkn = C('p8:kubbenin'), tgo = C('p8:gömülmeyi');
    const K = [[s.t0, 520, 1080, .9], [tsy, 540, 1040, .96], [tgm - .2, 575, 960, 1.3], [tkb + .3, 598, 900, 2.5], [tgo, 600, 884, 3.3], [s.t1, 600, 880, 3.5]];
    const [cx, cy, z] = camPath(K, t, { creep: .003 });
    const shine = seg(t, tgm - .15, tpr + .7), halo = .35 * seg(t, tgm, tpr) + .65 * eOut(seg(t, tkn - .2, tgo + .6));
    ctx.save(); sahneCam(cx, cy, z);
    bursaSahne(t, { altin: 1, kule: 1, bayrak: 1, shine, halo });
    // ön plan: tepede uzaktan seyreden siluet ve tuğ
    const fa = 1 - seg(t, tgm, tkb);
    if (fa > 0) { ctx.save(); ctx.globalAlpha = fa; ctx.fillStyle = '#140a08'; ctx.beginPath(); ctx.moveTo(-500, 1700); ctx.quadraticCurveTo(80, 1420, 520, 1480); ctx.quadraticCurveTo(800, 1520, 1100, 1800); ctx.lineTo(1100, 2400); ctx.lineTo(-500, 2400); ctx.fill();
      tug(100, 1505, .62, t, { sil: '#140a08' }); ayakta(230, 1478, .78, t, { col: '#140a08', rim: 'rgba(255,190,110,.5)' }); ctx.restore(); }
    ctx.restore();
    goldDust(t, .35);
    const sg = seg(t, tg - .2, tg + .8) * (1 - seg(t, tkb, tkn)); if (sg > 0) glow(160, 520, 500, 'rgba(255,200,120,.35)', sg);
  },
  /* "Bursa'nın kapıları hâlâ kapalıydı, ama açılacakları gün yaklaşıyordu." */
  kapi(t, s) {
    const ta = C('p8:açılacakları'), tg = C('p8:gün#2'), el = t - s.t0, z = 1 + .012 * el, li = eOut(seg(t, ta - .2, tg + 1.2));
    ctx.save(); ctx.translate(540, 980); ctx.scale(z, z); ctx.translate(-540, -980);
    ctx.fillStyle = '#3a3438'; ctx.fillRect(-100, -100, W + 200, H + 200);
    const R = rng(1326); ctx.strokeStyle = 'rgba(15,10,10,.55)'; ctx.lineWidth = 3;
    for (let r = 0; r < 26; r++) { const y = 180 + r * 62, off = r % 2 ? 0 : 70; for (let c = -1; c < 9; c++) ctx.strokeRect(off + c * 140 + R() * 8, y, 138, 60); }
    ctx.fillStyle = rg(540, 1100, 100, 1100, [[0, 'rgba(255,190,120,.12)'], [1, 'rgba(0,0,0,.45)']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    // kemer ve iki kanat
    const gx0 = 270, gx1 = 810, gy0 = 600, gy1 = 1390;
    ctx.fillStyle = '#18100c'; ctx.beginPath(); ctx.moveTo(gx0 - 40, gy1); ctx.lineTo(gx0 - 40, gy0 + 270); ctx.arc(540, gy0 + 270, 310, Math.PI, 0); ctx.lineTo(gx1 + 40, gy1); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.moveTo(gx0, gy1); ctx.lineTo(gx0, gy0 + 270); ctx.arc(540, gy0 + 270, 270, Math.PI, 0); ctx.lineTo(gx1, gy1); ctx.closePath(); ctx.clip();
    ctx.fillStyle = lg(gx0, 0, gx1, 0, [[0, '#3a2414'], [.48, '#5a3a20'], [.52, '#5a3a20'], [1, '#3a2414']]); ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
    ctx.strokeStyle = 'rgba(20,10,5,.6)'; ctx.lineWidth = 4; for (let x = gx0 + 45; x < gx1; x += 45) { ctx.beginPath(); ctx.moveTo(x, gy0); ctx.lineTo(x, gy1); ctx.stroke(); }
    ctx.fillStyle = '#1e1612'; for (const y of [760, 980, 1200]) ctx.fillRect(gx0, y, gx1 - gx0, 26);
    ctx.fillStyle = '#4a4440'; for (const y of [773, 993, 1213]) for (let x = gx0 + 22; x < gx1; x += 45) { ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill(); }
    // aralıktan sızan ışık
    if (li > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg(540 - 30, 0, 540 + 30, 0, [[0, 'rgba(255,200,120,0)'], [.5, `rgba(255,226,170,${.95 * li})`], [1, 'rgba(255,200,120,0)']]); ctx.fillRect(510, gy0, 60, gy1 - gy0); ctx.restore(); }
    ctx.restore();
    ctx.fillStyle = '#121010'; ctx.fillRect(538, gy0 + 10, 4, gy1 - gy0 - 10);
    if (li > 0) { glow(540, 1050, 520 * li, 'rgba(255,200,130,.35)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5 * li; ctx.fillStyle = lg(0, gy1, 0, gy1 + 400, [[0, 'rgba(255,210,150,.6)'], [1, 'rgba(255,210,150,0)']]); ctx.beginPath(); ctx.moveTo(520, gy1); ctx.lineTo(560, gy1); ctx.lineTo(760, gy1 + 420); ctx.lineTo(320, gy1 + 420); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = lg(0, gy1, 0, H, [[0, '#1a1412'], [1, '#060404']]); ctx.fillRect(-100, gy1, W + 200, H);
    if (li > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 * li; ctx.fillStyle = lg(0, gy1, 0, gy1 + 420, [[0, 'rgba(255,210,150,.6)'], [1, 'rgba(255,210,150,0)']]); ctx.beginPath(); ctx.moveTo(520, gy1); ctx.lineTo(560, gy1); ctx.lineTo(760, gy1 + 420); ctx.lineTo(320, gy1 + 420); ctx.fill(); ctx.restore(); }
    ctx.restore();
  },
};

/* ---------- küçük yardımcılar ---------- */
// ova arka planı: körfez, karşı kıyı, ova. o.k: 0..1 öğle sıcağı → kızıl
function ovaFon(t, o = {}) {
  const k = o.k || 0;
  ctx.fillStyle = lg(0, 0, 0, 980, [[0, mix('#5c6e88', '#4a4a66', k)], [.7, mix('#d8b888', '#d49a70', k)], [1, mix('#ead2a2', '#e2a878', k)]]); ctx.fillRect(-600, -400, W + 1600, 1500);
  glow(760, 860, 520, 'rgba(255,214,150,.4)');
  ctx.fillStyle = mix('#6c6a78', '#5a4a5a', k); ctx.beginPath(); ctx.moveTo(-600, 905); for (let x = -600; x <= W + 1000; x += 50) ctx.lineTo(x, 880 - 26 * Math.sin(x * .005 + .7) - 12 * Math.cos(x * .017)); ctx.lineTo(W + 1000, 910); ctx.fill();
  ctx.fillStyle = lg(0, 905, 0, 975, [[0, '#8aa0a8'], [1, '#5f7a84']]); ctx.fillRect(-600, 905, W + 1600, 70);
  ctx.strokeStyle = 'rgba(255,240,210,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 16; i++) { const y = 915 + (i % 5) * 11, x = ((i * 211 + t * 18) % 1700) - 500; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 70, y); ctx.stroke(); }
  ctx.fillStyle = lg(0, 970, 0, H, [[0, mix('#8a7650', '#7a5a40', k)], [.35, mix('#4a3a26', '#4a2a1e', k)], [1, '#0c0806']]); ctx.fillRect(-600, 970, W + 1600, H);
}
