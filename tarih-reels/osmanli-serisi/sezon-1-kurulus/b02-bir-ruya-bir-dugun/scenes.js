/* Sezon 1 · Bölüm 2 sahneleri: Bir Rüya, Bir Düğün. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js
 * Portre yok: kişiler siluetle. Rüya ve düğün RİVAYET (FACTS.md); Nilüfer Hatun, I. Murad, ~1300 haritası, Muzalon'un ordusu belgeli/tartışmalı.
 * Bölüme özel çizimler bu dosyada: emanetYuk ve golgeAdam (Bölüm 1'den birebir kopya), atYuku, yaya, evCiz, nilufer, dotLL, surHalka. */
'use strict';
const C = cue;
const camAt = (keys, t, creep = .008) => camPath(keys, t, { creep });   // monoton kübik + log-zoom + sürekli hafif itme
const RIM = 'rgba(242,199,92,.55)';
const OSMC = '#a8322a', BIZC = '#7a5a9a';
// harita noktaları (km). Yenişehir, İnegöl: koordinat; Yarhisar: konumu yaklaşık (Yenişehir'in kuzeybatısı; FACTS #21)
const YEN = LL(29.65, 40.26), INE = LL(29.51, 40.08), YAR = LL(29.58, 40.30);
const BIL = CITY['Bilecik'], SOG = CITY['Söğüt'], IZN = CITY['İznik'], KON = CITY['Konstantinopolis'], BAF = CITY['Bafeus'];

/* ---------- bölüme özel çizimler ---------- */
// emanet yükü: kilim desenli, iple çaprazlanmış denk. Bölüm 1'in scenes.js'inden BİREBİR kopya (görsel süreklilik: Bölüm 1 p6'daki emanet yükleri)
function emanetYuk(x, y, s, o = {}) {
  const d = o.dark ?? 0, w = 64, h = 42;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  ctx.fillStyle = mix('#7a2c1e', '#160a08', d); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 12); ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = mix('#d4a24a', '#2a1a10', d); ctx.fillRect(-w / 2, -6, w, 12);
  ctx.fillStyle = mix('#2a1410', '#0a0504', d); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 13 - 5, 0); ctx.lineTo(i * 13, -5); ctx.lineTo(i * 13 + 5, 0); ctx.lineTo(i * 13, 5); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = mix('#a8483a', '#1a0c0a', d); ctx.fillRect(-w / 2, -h / 2 + 5, w, 4); ctx.fillRect(-w / 2, h / 2 - 9, w, 4); ctx.restore();
  ctx.strokeStyle = mix('#3a2412', '#060303', d); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 12); ctx.stroke();
  ctx.strokeStyle = mix('#e0c890', '#3a2a18', d); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-w / 2 + 7, -h / 2 + 4); ctx.lineTo(w / 2 - 7, h / 2 - 4); ctx.moveTo(w / 2 - 7, -h / 2 + 4); ctx.lineTo(-w / 2 + 7, h / 2 - 4); ctx.stroke();
  ctx.restore();
}
// yere/duvara düşen silahlı adam gölgesi: Bölüm 1'in scenes.js'inden BİREBİR kopya (Bölüm 1'de yük gölgeleri bu gölgelere dönüşür)
function golgeAdam(x, y, h, a, i) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#080302'; ctx.strokeStyle = '#080302'; ctx.translate(x, y); const k = h / 330; ctx.scale(k * (1 + i * .04), k);
  ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(-36, -190); ctx.quadraticCurveTo(0, -216, 36, -190); ctx.lineTo(44, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -238, 23, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-26, -242); ctx.lineTo(0, -292); ctx.lineTo(26, -242); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(52, 10); ctx.lineTo(64, -390); ctx.stroke(); ctx.beginPath(); ctx.moveTo(66, -420); ctx.lineTo(56, -386); ctx.lineTo(74, -386); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// mızrak ucu (yükün arasından çıkan silah): kısa sap + yaprak uç; glint 0..1 sıcak ışıltı
function mizrak(x, y, len, ang, glint = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = '#1a120a'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke();
  ctx.fillStyle = lg(-6, -len - 34, 6, -len, [[0, '#d9d2c2'], [.5, '#8e877a'], [1, '#4a453c']]);
  ctx.beginPath(); ctx.moveTo(0, -len - 38); ctx.quadraticCurveTo(9, -len - 12, 0, -len); ctx.quadraticCurveTo(-9, -len - 12, 0, -len - 38); ctx.fill();
  if (glint > 0) glow(0, -len - 26, 46 * glint, 'rgba(255,214,150,.75)');
  ctx.restore();
}
// yük atı (yandan, sağa yürür): sırtında iki denk. o.still: duran at; o.load: false yüksüz
function atYuku(x, y, s, t, o = {}) {
  const g = o.still ? .1 : fract(t * (o.speed || .8) + (o.ph || 0)), bob = o.still ? 0 : Math.sin(g * TAU * 2) * 2.5;
  ctx.save(); ctx.translate(x, y + bob * s); ctx.scale(s, s); ctx.fillStyle = o.sil || '#120b07'; ctx.strokeStyle = o.sil || '#120b07'; ctx.lineCap = 'round';
  ctx.lineWidth = 10;
  for (const [hx, ph] of [[-58, 0], [-44, .5], [46, .25], [60, .75]]) { const a = o.still ? 0 : Math.sin((g + ph) * TAU) * .32; ctx.beginPath(); ctx.moveTo(hx, -72); const kx = hx + Math.sin(a) * 16, ky = -36; ctx.lineTo(kx, ky); ctx.lineTo(kx + Math.sin(a + .3) * 8, 0); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, -90, 80, 30, 0, 0, TAU); ctx.fill();
  const hd = o.still ? -6 : Math.sin(g * TAU * 2) * 3;
  ctx.beginPath(); ctx.moveTo(54, -106); ctx.quadraticCurveTo(90, -132 + hd, 110, -124 + hd); ctx.lineTo(132, -98 + hd); ctx.lineTo(122, -86 + hd); ctx.quadraticCurveTo(98, -100, 76, -80); ctx.fill();
  ctx.beginPath(); ctx.moveTo(104, -128 + hd); ctx.lineTo(110, -146 + hd); ctx.lineTo(116, -126 + hd); ctx.fill();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-78, -100); ctx.quadraticCurveTo(-98, -80, -94, -44); ctx.stroke();
  if (o.load !== false) { ctx.fillStyle = 'rgba(30,18,10,.9)'; ctx.fillRect(-46, -126, 92, 16); emanetYuk(-28, -144, 1.3, { dark: o.dark, rot: -.04 }); emanetYuk(32, -140, 1.2, { dark: o.dark, rot: .05 }); }
  ctx.restore();
}
// yürüyen adam (sağa): pelerin, asa. o.spear: asanın ucu mızrak (0..1 ortaya çıkış)
function yaya(x, y, s, t, o = {}) {
  const g = fract(t * (o.speed || .8) + (o.ph || 0)), sw = Math.sin(g * TAU);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = o.sil || '#120b07'; ctx.strokeStyle = o.sil || '#120b07'; ctx.lineCap = 'round';
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-4, -78); ctx.lineTo(-4 + sw * 18, 0); ctx.moveTo(4, -78); ctx.lineTo(4 - sw * 18, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-26, -72); ctx.quadraticCurveTo(-30, -150, -10, -176); ctx.lineTo(16, -176); ctx.quadraticCurveTo(32, -140, 26, -72); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -192, 17, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(4, -204, 20, 10, 0, 0, TAU); ctx.fill();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(30, -10); ctx.lineTo(40, -230); ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(10, -150); ctx.lineTo(36, -128); ctx.stroke();
  ctx.restore();
  if (o.spear > 0) { ctx.save(); ctx.globalAlpha *= clamp(o.spear * 2); mizrak(x + 40 * s, y - 226 * s, 4 * s, .045, o.glint || 0); ctx.restore(); }
}
// taş ev (şeyhin evi): ışıklı pencere, baca dumanı. o.inside 0..1: pencereden içerisi (iki oturan siluet, mum)
function evCiz(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 7; i++) { const k = fract(t * .2 + i / 7); ctx.globalAlpha = .22 * (1 - k); ctx.fillStyle = '#cbbda6'; ctx.beginPath(); ctx.arc(118 + Math.sin(k * 5 + i) * 14 + k * 50, -322 - k * 230, 12 + k * 34, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
  glow(-70, -110, 260, 'rgba(255,160,70,.32)');
  ctx.fillStyle = '#0c0806'; ctx.fillRect(-220, -205, 440, 205);
  ctx.beginPath(); ctx.moveTo(-252, -200); ctx.lineTo(0, -292); ctx.lineTo(252, -200); ctx.closePath(); ctx.fill();
  ctx.fillRect(100, -300, 34, 74);
  ctx.strokeStyle = 'rgba(80,60,40,.35)'; ctx.lineWidth = 2; for (let r = -180; r < 0; r += 26) { ctx.beginPath(); ctx.moveTo(-220, r); ctx.lineTo(220, r); ctx.stroke(); }
  // pencere (kemerli) ve içerisi
  const wx = -70, wy = -150, ww = 92, wh = 104;
  ctx.save(); ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy + wh / 2); ctx.lineTo(wx - ww / 2, wy - wh / 2 + ww / 2); ctx.arc(wx, wy - wh / 2 + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww / 2, wy + wh / 2); ctx.closePath(); ctx.clip();
  ctx.fillStyle = rg(wx, wy + 20, 4, 120, [[0, '#ffd590'], [.5, '#e08a3a'], [1, '#6a2e12']]); ctx.fillRect(wx - ww, wy - wh, ww * 2, wh * 2);
  const ins = o.inside || 0;
  if (ins > 0) { ctx.globalAlpha = ins; seated(wx - 26, wy + 50, .17, { hat: 'kece', beard: true, col: '#1a0d06' }); seated(wx + 26, wy + 50, .17, { flip: true, hat: 'sarik', col: '#1a0d06' }); candle(wx, wy + 48, .3, t, 1, 2); ctx.globalAlpha = 1; }
  ctx.restore();
  ctx.strokeStyle = '#0c0806'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx, wy - wh / 2); ctx.lineTo(wx, wy + wh / 2); ctx.moveTo(wx - ww / 2, wy + 6); ctx.lineTo(wx + ww / 2, wy + 6); ctx.stroke();
  // kapı
  ctx.fillStyle = 'rgba(255,170,80,.28)'; ctx.fillRect(80, -120, 64, 120); ctx.fillStyle = '#0c0806'; ctx.fillRect(86, -114, 52, 114);
  ctx.restore();
}
// nilüfer çiçeği (yandan): k 0..1 açılma
function nilufer(x, y, s, k, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  glow(0, -60, 340, `rgba(255,214,130,${.35 * k})`);
  const layer = (n, len, wid, open, closed, sh) => {
    for (let i = 0; i < n; i++) {
      const u = n > 1 ? i / (n - 1) - .5 : 0, a = u * 2 * lerp(closed, open, k) + Math.sin(t * .8 + i) * .015;
      ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-wid, -len * .3, -wid * .55, -len * .85, 0, -len); ctx.bezierCurveTo(wid * .55, -len * .85, wid, -len * .3, 0, 0);
      ctx.fillStyle = lg(0, 0, 0, -len, [[0, `rgba(226,170,70,${.9 * sh})`], [.6, `rgba(250,226,170,${.95 * sh})`], [1, 'rgba(255,248,226,.98)']]); ctx.fill();
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
    }
  };
  ctx.fillStyle = '#122a22'; ctx.beginPath(); ctx.ellipse(0, 10, 230, 34, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(242,199,92,.35)'; ctx.lineWidth = 2; ctx.stroke();
  layer(7, 170, 46, 1.35, .25, .8); layer(5, 150, 40, .85, .15, .9); layer(3, 120, 34, .32, .06, 1);
  ctx.restore();
}
// harita: dünya noktasında şehir noktası + etiket (CITY listesinde olmayan yerler için)
function dotLL(cam, p, label, o = {}) {
  const [x, y] = W2S(cam, ...p), r = o.r || 8; if (x < -200 || x > W + 200 || y < -200 || y > H + 200) return [x, y];
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.fillStyle = o.col || OSMC; ctx.strokeStyle = '#f4e8cc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  if (label && (o.la ?? 1) > 0) { ctx.globalAlpha = (o.a ?? 1) * (o.la ?? 1); setFont(o.size || 30, F.mont, 800); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(240,228,198,.9)'; const dx = o.align === 'right' ? -16 : 16; ctx.strokeText(label, x + dx, y); ctx.fillStyle = '#1a120a'; ctx.fillText(label, x + dx, y); }
  ctx.restore(); return [x, y];
}
// sur halkası: şehrin çevresinde ekran yarıçapı r (km × zoom)
function surHalka(x, y, r, col, a, w = 6, dash) {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) { ctx.setLineDash(dash); }
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
}
// harita üstüne gece tonu (tuzak, baskın öncesi): multiply mavi
function geceTon(a) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.fillStyle = '#3a4a78'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
// fener noktası
function fener(x, y, a, r = 7) { if (a <= 0) return; glow(x, y, r * 7, `rgba(255,180,90,${.55 * a})`); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffdc9a'; ctx.beginPath(); ctx.arc(x, y, r * .6, 0, TAU); ctx.fill(); ctx.restore(); }

/* ---------- ortak kameralar: aynı haritayı kullanan ardışık sahneler aynı anahtarları paylaşır ---------- */
function bitCam(t) {   // bilecik → tuzak (p4)
  const a = C('p4-0.3'), b = C('p4:Bilecik'), d = C('p4:düğünle'), y = C('p4:Yarhisar'), m = C('p4:Ama'), tz = C('p4:tuzakmış'), h = C('p4:haber'), e = C('p5-0.3');
  return camAt([[a, 64, 16, 4.6], [b + .6, 80, 37, 10.4], [d, 79, 36, 10.9], [y + .5, 67, 31, 9.3], [m, 71, 33, 9.4], [tz + .2, 85, 41, 10.6], [h + .5, 91, 46, 11.6], [e, 90, 45, 12.6]], t, .004);
}
function ucCam(t) {    // uc → iznik → soru (p7–p8)
  const a = C('p7-0.3'), b = C('p7:Bilecik'), d = C('p7:elindeydi'), e = C('p7:Osman#2'), f = C('p7:Yenişehir'), g = C('p7:Akıncıları'), h = C('p7:sıkıştı'), i = C('p8-0.3');
  return camAt([[a, 70, 30, 5.4], [b + .2, 72, 36, 7.3], [d + .3, 70, 37, 7.6], [e + .2, 63, 27, 8.6], [f + .4, 60, 20, 10.4], [g + .6, 61, 13, 11.2], [h + .2, 61, 10, 12.6], [i, 61, 10, 12.9]], t, .004);
}

window.SCENE_FNS = {
  /* "Osman Bey'in ünlü rüyasını duymuşsunuzdur." */
  gece(t, s) {
    const k = eIO(seg(t, s.t0, s.t1 + .4)), dy = lerp(0, -140, k);
    ctx.fillStyle = '#050403'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(0, dy);
    skyLand(t, { k: .08, sun: false }); stars(t, .95); crescentMoon(560, 500, 34);
    // rüya ağacı gökte belirir (sezon motifi): ilk karede çizilmeye başlamış
    const tr = C('p1:rüyasını'), g = lerp(.42, 1, eOut(seg(t, 0, tr + .4)));
    ctx.save(); ctx.globalAlpha = .62; glow(540, 700, 380, 'rgba(255,214,130,.22)'); miniTree(540, 1010, 1.55, g, t, { leaves: g > .95 }); ctx.restore();
    goldDust(t, .45);
    ctx.fillStyle = '#0b0805'; ctx.fillRect(-100, 1380, W + 200, 400);
    evCiz(700, 1215, .42, t, {});
    ctx.restore();
  },
  /* "Anlatılır ki Osman bir gece Şeyh Edebali'nin evinde misafir kalmış." */
  ev(t, s) {
    const tm = C('p1:misafir'), z = lerp(1, 1.12, eIO(seg(t, s.t0, tm))) * lerp(1, 3.1, eIn(seg(t, tm - .2, s.t1 + .3)));
    const k2 = eIO(seg(t, tm - .2, s.t1)), pwx = lerp(540, 470, k2), pwy = lerp(1100, 1050, k2), sy = lerp(1100, 960, k2);   // pencereye it
    ctx.save(); ctx.translate(540, sy); ctx.scale(z, z); ctx.translate(-pwx, -pwy);
    skyLand(t, { k: .1, sun: false, mist: false }); stars(t, .8); crescentMoon(830, 470, 30);
    ctx.fillStyle = lg(0, 1180, 0, H, [[0, '#0d0a08'], [1, '#040302']]); ctx.fillRect(-300, 1180, W + 600, H);
    // çıplak ağaç ve bağlı at (misafir)
    ctx.save(); ctx.globalAlpha = .9; miniTree(170, 1190, 1.05, 1, t, { col: '#0b0806', leaves: false }); ctx.restore();
    atYuku(830, 1196, .62, t, { still: true, load: false, sil: '#0b0806' });
    ctx.strokeStyle = '#0b0806'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(895, 1124); ctx.quadraticCurveTo(880, 1150, 868, 1190); ctx.stroke();
    evCiz(540, 1200, 1, t, { inside: seg(t, tm - .3, tm + .5) });
    ctx.restore();
    kinetic('ŞEYH EDEBALİ', W / 2, 560, 34, t, C('p1:Şeyh'), { mode: 'fade', fam: F.mont, w: 900, spacing: 6, col: 'rgba(255,240,215,.95)', stroke: false, out: tm + .3 });
  },
  /* "O gece rüyasında, şeyhin göğsünden bir ay doğduğunu ve gelip kendi göğsüne girdiğini görmüş. Sonra göbeğinden bir ağaç yükselmiş" */
  ay(t, s) {
    const td = C('p2:doğduğunu'), tg = C('p2:girdiğini'), tb = C('p2:göbeğinden'), te = C('p2:şeyhin'), to = C('p2:kendi');
    const tilt = 200 * eIO(seg(t, tb - .2, s.t1 + .2));
    ctx.fillStyle = rg(540, 800, 60, 1300, [[0, '#1c2350'], [.6, '#0e1230'], [1, '#05060f']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(0, tilt * .4); stars(t, .8); ctx.restore();
    goldDust(t, .7);
    const z = lerp(1, 1.06, eIO(seg(t, s.t0, tb)));
    ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100); ctx.translate(0, tilt);
    ctx.fillStyle = rg(540, 1200, 40, 620, [[0, 'rgba(242,199,92,.18)'], [1, 'rgba(242,199,92,0)']]); ctx.fillRect(0, 700, W, 900);
    const ec = seated(250, 1180, 1.05, { hat: 'kece', beard: true, rim: RIM }), O = sleeper(745, 1190, .92, { rim: RIM });
    // ay: şeyhin göğsünden doğar, altın yayla Osman'ın göğsüne girer
    const P = k => { const u = 1 - k; return [u * u * ec[0] + 2 * u * k * 470 + k * k * O.chest[0], u * u * ec[1] + 2 * u * k * 420 + k * k * O.chest[1]]; };
    const born = seg(t, te, td + .2), mk = eIO(seg(t, td + .1, tg + .1));
    if (born > 0 && mk < 1) {
      const tr = []; for (let i = 0; i <= 40; i++) tr.push(P(mk * i / 40));
      ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'screen'; for (const [w, a] of [[22, .15], [9, .4], [3, .9]]) { ctx.strokeStyle = rgba(GOLD, a); ctx.lineWidth = w; tracePath(tr); ctx.stroke(); } ctx.restore();
      const [mx, my] = P(mk); fullMoon(mx, my, lerp(16, 44, eOut(born)) * (1 - .4 * seg(t, tg - .2, tg + .1)), clamp(born * 2));
    }
    if (born <= 0) glow(...ec, 120 * (.6 + .4 * Math.sin(t * 3)), 'rgba(255,220,150,.35)');
    const hp = hitPulse(t, tg, 1.4); if (hp > 0) glow(...O.chest, 380 * hp, 'rgba(255,220,150,.9)');
    if (t > tg) glow(...O.chest, 70, 'rgba(255,214,130,.5)');
    const g = eOut(seg(t, tb - .1, s.t1)); if (g > 0) miniTree(...O.navel, 1.7, g, t);
    kinetic('ŞEYH EDEBALİ', 250, 1262, 28, t, te, { mode: 'fade', fam: F.mont, w: 900, spacing: 5, col: 'rgba(255,240,215,.92)', stroke: false, out: tb });
    kinetic('OSMAN', 745, 1262, 28, t, to, { mode: 'fade', fam: F.mont, w: 900, spacing: 5, col: 'rgba(255,240,215,.92)', stroke: false, out: tb });
    ctx.restore();
  },
  /* "ve gölgesi bütün dünyayı kaplamış." — harita ~1290 (Bölüm 1'in kaldığı yer) */
  cihan(t, s) {
    const td = C('p2:dünyayı'), tg = C('p2:gölgesi'), Y = 1290;
    const cam = camAt([[s.t0, 101, 53, 1.9], [td, 130, -60, .6], [s.t1, 140, -150, .45]], t);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .35 });
    ownCity(cam, 'Söğüt', Y, { size: 30, a: 1 - seg(t, s.t0 + .5, s.t0 + 1.1) });
    const [rx, ry] = W2S(cam, ...SOG), ts = lerp(.5, 2.0, eIO(seg(t, s.t0, td + .5)));
    const sh = eOut(seg(t, tg, td + .8));
    if (sh > 0) { ctx.save(); ctx.globalAlpha = .55 * sh; ctx.fillStyle = rg(rx, ry - 330 * ts, 60, 300 + 1300 * sh, [[0, 'rgba(12,8,24,.85)'], [1, 'rgba(12,8,24,0)']]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    glow(rx, ry - 200 * ts, 240 * ts, 'rgba(255,214,130,.35)');
    miniTree(rx, ry, ts, 1, t);
  },
  /* "Sabah olunca Edebali rüyayı bu soyun cihana hükmedeceğine yormuş ve kızını Osman'a vermiş." */
  yorum(t, s) {
    const ts = C('p3:Sabah'), tc = C('p3:cihana'), tk = C('p3:kızını');
    const dawn = eIO(seg(t, ts - .1, ts + 2.2)), z = lerp(1, 1.08, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000);
    ctx.fillStyle = rg(540, 1080, 40, 1250, [[0, mix('#3a2818', '#6a4426', dawn)], [.35, mix('#1c130c', '#342012', dawn)], [1, '#070403']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    // kemerli pencere: şafak
    const wx = 540, wy = 620, ww = 210, wh = 330;
    ctx.save(); ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy + wh / 2); ctx.lineTo(wx - ww / 2, wy - wh / 2 + ww / 2); ctx.arc(wx, wy - wh / 2 + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww / 2, wy + wh / 2); ctx.closePath(); ctx.clip();
    ctx.fillStyle = lg(0, wy - wh / 2, 0, wy + wh / 2, [[0, mix('#0e1430', '#f2b56a', dawn)], [.7, mix('#141a36', '#ffd9a0', dawn)], [1, mix('#1a1a2a', '#c27a3a', dawn)]]); ctx.fillRect(wx - ww, wy - wh, ww * 2, wh * 2);
    ctx.fillStyle = '#120a06'; ctx.beginPath(); ctx.moveTo(wx - ww, wy + wh / 2); for (let x = -ww; x <= ww; x += 20) ctx.lineTo(wx + x, wy + wh * .3 - 18 * Math.sin(x * .03 + 1)); ctx.lineTo(wx + ww, wy + wh / 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#0a0604'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(wx, wy - wh / 2 + 30); ctx.lineTo(wx, wy + wh / 2); ctx.moveTo(wx - ww / 2, wy + 20); ctx.lineTo(wx + ww / 2, wy + 20); ctx.stroke();
    // şafak ışığı huzmesi
    if (dawn > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .22 * dawn; ctx.fillStyle = lg(0, wy, 0, 1300, [[0, 'rgba(255,210,150,.9)'], [1, 'rgba(255,210,150,0)']]); ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy + wh / 2); ctx.lineTo(wx + ww / 2, wy + wh / 2); ctx.lineTo(wx + 330, 1300); ctx.lineTo(wx - 330, 1300); ctx.fill(); ctx.restore(); }
    // duvardaki rüya ağacı "cihana"da parlar
    const ga = .14 + .4 * eOut(seg(t, tc - .1, tc + 1.2));
    ctx.save(); ctx.globalAlpha = ga; miniTree(540, 1180, 1.9, 1, t, { col: GOLD, leaves: ga > .3 }); ctx.restore();
    ctx.fillStyle = lg(0, 1200, 0, H, [[0, '#120a05'], [1, '#050302']]); ctx.fillRect(-100, 1200, W + 200, H);
    seated(285, 1210, 1.0, { hat: 'kece', beard: true, rim: 'rgba(255,170,80,.5)' });
    seated(795, 1210, 1.0, { flip: true, hat: 'sarik', rim: 'rgba(255,170,80,.5)' });
    candle(500, 1200, 1, t, 1 - .6 * dawn, 0); candle(580, 1200, 1, t, eOut(seg(t, tk, tk + .5)), 3);
    const hk = hitPulse(t, tk + .1, 1.4); if (hk > 0) glow(540, 1110, 300 * hk, 'rgba(255,214,140,.55)');
    ctx.restore();
  },
  /* "Peki Osman, Bilecik hisarını nasıl aldı? Bu da bir düğünle anlatılır. Bilecik tekfuru Yarhisar tekfurunun kızıyla evlenecekmiş." */
  bilecik(t, s) {
    const Y = 1298.6, cam = bitCam(t), tb = C('p4:Bilecik'), td = C('p4:düğünle'), ty = C('p4:Yarhisar'), te = C('p4:evlenecekmiş');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    mapLabel(cam, 'BİZANS', ...LL(29.45, 40.72), 46, { a: seg(t, s.t0 + .2, s.t0 + .7) * (1 - seg(t, tb, tb + .5)) });
    ownCity(cam, 'Söğüt', Y, { size: 30 });
    ownCity(cam, 'Bilecik', Y, { label: false });
    const [bx, by] = W2S(cam, ...BIL), [yx, yy] = W2S(cam, ...YAR);
    // düğün: Bilecik çevresinde fenerler
    const fa = seg(t, td - .1, td + .6);
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * .25, r = 52 + 10 * Math.sin(i * 1.7); fener(bx + Math.cos(a) * r, by + Math.sin(a) * r * .6, fa * (.6 + .4 * Math.sin(t * 3 + i)), 6); }
    // Bilecik ↔ Yarhisar: altın düğün bağı ve üzerinde akan fenerler
    const gk = eIO(seg(t, te - .3, te + .9));
    if (gk > 0) {
      const pts = [[...BIL], [(BIL[0] + YAR[0]) / 2, (BIL[1] + YAR[1]) / 2 - 8], [...YAR]];
      glowPath(cam, pts, t, gk, { w: 7, col: '#ffcf6a' });
      if (gk >= 1) { const P = spline(pts.map(p => W2S(cam, ...p)), 12), L = polyLen(P); for (let i = 0; i < 6; i++) { const [x, y] = pointAt(P, L, fract(t * .22 + i / 6)); fener(x, y, .9, 5); } }
    }
    mapPin(cam, ...YAR, t, ty - .05, 'YARHİSAR', { left: true, size: 32 });
    mapPin(cam, ...BIL, t, tb - .05, 'BİLECİK', { left: true, size: 34 });
  },
  /* "Ama düğün aslında Osman'a kurulmuş bir tuzakmış ve haber ona sızmış." — aynı harita, gece tonu */
  tuzak(t, s) {
    const Y = 1298.6, cam = bitCam(t), to = C("p4:Osman'a"), tz = C('p4:tuzakmış'), th = C('p4:haber');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    geceTon(.62 * eIO(seg(t, s.t0, s.t0 + 1.2)));
    ownCity(cam, 'Söğüt', Y, { size: 30 });
    ownCity(cam, 'Bilecik', Y, { label: false });
    const [bx, by] = W2S(cam, ...BIL);
    // düğün bağı koyulaşır
    const pts = [[...BIL], [(BIL[0] + YAR[0]) / 2, (BIL[1] + YAR[1]) / 2 - 8], [...YAR]];
    glowPath(cam, pts, t, 1, { w: 7, col: '#c0392b', a: 1 - .5 * seg(t, s.t0, tz) });
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * .25, r = 52 + 10 * Math.sin(i * 1.7); fener(bx + Math.cos(a) * r, by + Math.sin(a) * r * .6, (1 - seg(t, s.t0, s.t0 + 1.5)) * (.6 + .4 * Math.sin(t * 3 + i)), 6); }
    // Osman'ın yolu (Söğüt → Bilecik) ve üzerine kurulan tuzak halkası
    const M = [(SOG[0] + BIL[0]) / 2 + 1, (SOG[1] + BIL[1]) / 2 - 1];
    glowPath(cam, [[...SOG], M, [...BIL]], t, eIO(seg(t, to - .1, to + .9)), { w: 6, col: '#ffcf6a', dash: true });
    const [mx, my] = W2S(cam, ...M), rk = eOut(seg(t, tz - .25, tz + .5));
    if (rk > 0) {
      const r = lerp(16, 6.2, rk) * cam[2], a = clamp(rk * 2);
      surHalka(mx, my, r + 12, 'rgba(192,57,43,.28)', a, 22); surHalka(mx, my, r, '#c0392b', a, 5, [16, 10]);
      arrow(cam, [[BIL[0] + 1, BIL[1] + 2], [BIL[0] + 3, BIL[1] + 6], [M[0] - 4, M[1] - 1.5]], eIO(seg(t, tz - .4, tz + .3)), 14, '#8a1f17');
    }
    // haber Söğüt'e sızar: ince altın noktalı iz
    const hk = eIO(seg(t, th - .1, th + 1.1));
    if (hk > 0) {
      const P = spline([[...BIL], [BIL[0] + 9, BIL[1] - 4], [SOG[0] - 4, SOG[1] - 10], [...SOG]].map(p => W2S(cam, ...p)), 12), L = polyLen(P);
      ctx.save(); for (let i = 0; i < 26; i++) { const k = i / 25; if (k > hk) break; const [x, y] = pointAt(P, L, k); ctx.globalAlpha = .85; ctx.fillStyle = '#ffd98a'; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, TAU); ctx.fill(); }
      const [hx, hy] = pointAt(P, L, hk); glow(hx, hy, 60, 'rgba(255,214,130,.8)'); ctx.restore();
      const [sx, sy] = W2S(cam, ...SOG), sp = hitPulse(t, th + 1.0, 1.2); if (sp > 0) glow(sx, sy, 220 * sp, 'rgba(255,214,130,.7)');
    }
    mapPin(cam, ...YAR, t, -9, 'YARHİSAR', { left: true, size: 32, a: 1 - seg(t, s.t0, s.t0 + .8) });
    mapPin(cam, ...BIL, t, -9, 'BİLECİK', { left: true, size: 34 });
  },
  /* "Osman da her yaz olduğu gibi yüklerini Bilecik hisarına göndermiş." — kervan hisara yaklaşır */
  kervan(t, s) {
    const el = t - s.t0, zk = eIO(seg(t, s.t0 + 2.0, s.t1 + .3)), cx = 960 - el * 20;
    const z = lerp(1, 1.3, zk) * (1 + .008 * el), fx = lerp(540, cx - 60, zk), fy = lerp(1000, 1080, zk), dusk = 1 - .35 * zk;
    ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-fx, -fy);
    // akşam göğü: ufuk bandı kervanın arkasında (siluetler ışığa karşı okunur)
    ctx.fillStyle = lg(0, 300, 0, 1290, [[0, '#14142a'], [.45, mix('#2a2238', '#4a3040', dusk)], [.78, mix('#5a3a3a', '#c2703a', dusk)], [1, mix('#7a4a34', '#f0ae62', dusk)]]); ctx.fillRect(-300, -200, W + 600, 1500);
    glow(300, 1230, 520, `rgba(255,190,110,${.55 * dusk})`); ctx.fillStyle = `rgba(255,222,160,${.85 * dusk})`; ctx.beginPath(); ctx.arc(300, 1250, 58, Math.PI, 0); ctx.fill();
    stars(t, .5 * (1 - dusk));
    ctx.fillStyle = mix('#3a2a34', '#7a5248', dusk); ctx.beginPath(); ctx.moveTo(-300, 1290); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, 1215 - 26 * Math.sin(x * .006 + .8) - 10 * Math.cos(x * .017)); ctx.lineTo(W + 300, 1290); ctx.fill();
    // hisar: tepe üstünde, yaklaşır; kapısı ışıklı
    ctx.fillStyle = '#1c1216'; ctx.beginPath(); ctx.moveTo(cx - 420, 1290); ctx.quadraticCurveTo(cx - 160, 1060, cx, 1040); ctx.quadraticCurveTo(cx + 200, 1050, cx + 460, 1290); ctx.fill();
    castle(cx, 1040, .5, '#140d10');
    ctx.fillStyle = 'rgba(255,170,80,.7)'; ctx.fillRect(cx - 16, 1005, 32, 34); glow(cx, 1022, 90, 'rgba(255,170,80,.35)');
    // yol ve zemin
    ctx.fillStyle = lg(0, 1285, 0, 1560, [[0, mix('#2a1a10', '#5e3c22', dusk)], [.35, mix('#1a100a', '#3a2414', dusk)], [1, '#080504']]); ctx.fillRect(-300, 1285, W + 600, 1000);
    ctx.strokeStyle = 'rgba(200,150,90,.18)'; ctx.lineWidth = 3; for (let i = 0; i < 12; i++) { const x = ((i * 140 - el * 46) % 1700 + 1700) % 1700 - 200; ctx.beginPath(); ctx.moveTo(x, 1330); ctx.lineTo(x + 60, 1330); ctx.stroke(); }
    // kervan: yaya, at, at, yaya, at (sağa yürür); yükler Bölüm 1'deki emanet yükleri
    const walk = el * 14;
    yaya(40 + walk, 1300, .95, t, { ph: .1 });
    atYuku(260 + walk, 1300, 1, t, { ph: .3 });
    atYuku(520 + walk, 1300, 1, t, { ph: .7 });
    yaya(700 + walk, 1300, .95, t, { ph: .55 });
    atYuku(900 + walk, 1300, 1, t, { ph: .9 });
    ctx.restore();
    geceTon(.25 * zk);
  },
  /* "Bu kez aralarında silahlı adamlar varmış." — hisar kapısında meşale; yüklerin gölgeleri silahlı adam gölgelerine döner (Bölüm 1 p6'nın karşılığı) */
  kapi(t, s) {
    const tsl = C('p5:silahlı'), m = eIO(seg(t, tsl - .3, C('p5:varmış') + .2)), el = t - s.t0, z = lerp(1, 1.07, eIO(seg(t, s.t0, s.t1)));
    const fl = .88 + .08 * Math.sin(t * 13) + .04 * Math.sin(t * 29), dx = Math.sin(t * 11) * 5;
    ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.translate(-540, -1050);
    ctx.fillStyle = '#2a1914'; ctx.fillRect(-100, -100, W + 200, H + 200);
    const R = rng(131); ctx.strokeStyle = 'rgba(10,5,3,.55)'; ctx.lineWidth = 3;
    for (let r = 0; r < 14; r++) { const y = 300 + r * 70, off = r % 2 ? 0 : 60; for (let c = -1; c < 9; c++) { const x = off + c * 130 + R() * 10; ctx.strokeRect(x, y, 128, 68); } }
    ctx.fillStyle = rg(160, 720, 30, 1100 * fl, [[0, 'rgba(255,180,100,.55)'], [.4, 'rgba(160,80,40,.25)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    // geçen yüklü atlar (ön plan) ve duvardaki gölgeleri
    const hs = [0, 1, 2].map(i => 140 + i * 330 + el * 42);
    hs.forEach((hx, i) => {
      const bx = hx - 30, by = 1180, sx = bx + (bx - 150) * .3 + 90 + dx, sy = by - 110 - i * 6;
      if (m < 1) { ctx.save(); ctx.globalAlpha = .62 * (1 - m); ctx.fillStyle = '#0a0503'; ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.roundRect(sx - 120, sy - 70, 250, 140, 34); ctx.fill(); ctx.restore(); }
      if (m > 0) golgeAdam(sx, sy + 60, lerp(160, 560 + i * 36, m), m * .82, i);
    });
    // kapı kemeri: geçidin içi
    ctx.fillStyle = '#0c0705'; ctx.beginPath(); ctx.rect(-200, -200, W + 400, H + 400); ctx.moveTo(60, 1500); ctx.lineTo(60, 640); ctx.quadraticCurveTo(60, 300, 540, 290); ctx.quadraticCurveTo(1020, 300, 1020, 640); ctx.lineTo(1020, 1500); ctx.closePath(); ctx.fill('evenodd');
    ctx.fillStyle = lg(0, 1240, 0, 1500, [[0, '#1a0f0a'], [1, '#070403']]); ctx.fillRect(-100, 1240, W + 200, 900);
    hs.forEach((hx, i) => atYuku(hx, 1300, 1.12, t, { ph: .3 + i * .37, speed: .7, sil: '#0b0604', dark: .1 }));
    // yüklerin arasından mızrak uçları
    const sp = eOut(seg(t, tsl - .1, tsl + .6)), gl = hitPulse(t, tsl + .2, 1.2) + .3 * sp;
    if (sp > 0) hs.forEach((hx, i) => { if (i === 1) { mizrak(hx - 2, 1138, 34 + 46 * sp, -.1, gl); mizrak(hx + 10, 1140, 24 + 52 * sp, .09, gl * .8); } });
    // meşale
    ctx.fillStyle = '#120a06'; ctx.fillRect(140, 735, 16, 120); ctx.fillRect(126, 728, 44, 12);
    glow(150, 700, 420 * fl, 'rgba(255,160,70,.45)'); glow(150, 705, 120 * fl, 'rgba(255,220,150,.8)');
    ctx.save(); ctx.translate(150, 728); ctx.scale(1, fl); ctx.fillStyle = 'rgba(255,190,90,.95)'; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.quadraticCurveTo(-18, -36, 0, -76 + Math.sin(t * 9) * 6); ctx.quadraticCurveTo(18, -36, 16, 0); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .3; ctx.fillStyle = '#b0302a'; ctx.fillRect(0, 0, W, H); ctx.restore();
  },
  /* "Garnizon düğündeyken hisar kısa sürede düşmüş," */
  hisar(t, s) {
    const th = C('p5:hisar#2'), tf = C('p5:kısa') + .2, td = C('p5:düşmüş'), el = t - s.t0, z = 1 + .03 * el + .05 * eIO(seg(t, th, td));   // sancak "kısa sürede" iner: whip'ten önce okunsun
    ctx.save(); ctx.translate(560, 1000); ctx.scale(z, z); ctx.translate(-560, -1000);
    ctx.fillStyle = lg(0, 0, 0, 1300, [[0, '#060918'], [.6, '#10162c'], [.85, '#2a2030'], [1, '#3a2620']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    stars(t, .6);
    // uzakta düğün: garnizonun gittiği yer (sol ova)
    ctx.fillStyle = '#0d0a10'; ctx.beginPath(); ctx.moveTo(-100, 1240); for (let x = -100; x <= W + 100; x += 40) ctx.lineTo(x, 1150 - 30 * Math.sin(x * .005 + .4)); ctx.lineTo(W + 100, 1300); ctx.lineTo(-100, 1300); ctx.fill();
    ctx.fillStyle = lg(0, 1295, 0, 1900, [[0, '#0d0a10'], [1, '#040305']]); ctx.fillRect(-100, 1295, W + 200, 900);
    for (let i = 0; i < 11; i++) { const x = 110 + (i % 6) * 30 + (i > 5 ? 14 : 0), y = 1150 + (i > 5 ? 16 : 0) + Math.sin(i * 2.1) * 4; fener(x, y, .55 + .3 * Math.sin(t * 3 + i * 1.3), 4); }
    tent(160, 1175, .16, t, { sil: '#0a0710', door: 'rgba(255,170,80,.7)' }); tent(260, 1180, .13, t, { sil: '#0a0710', door: 'rgba(255,170,80,.6)', smoke: false });
    // hisar
    const fall = seg(t, tf - .1, tf + .5);
    castle(640, 1060, .9, '#06050a');
    const wf = hitPulse(t, td, 1.4); if (wf > 0) glow(640, 930, 420 * wf, 'rgba(255,160,80,.55)');
    // kapı: yükler içeride
    ctx.fillStyle = 'rgba(255,170,80,.75)'; ctx.beginPath(); ctx.moveTo(612, 1062); ctx.lineTo(612, 1016); ctx.arc(640, 1016, 28, Math.PI, 0); ctx.lineTo(668, 1062); ctx.fill();
    emanetYuk(630, 1048, .42, { dark: .25 }); emanetYuk(652, 1052, .38, { dark: .3, rot: .1 });
    // sancak: hisarın mor sancağı iner, yerine kırmızı sancak çıkar
    const px = 640 + 70 * .9, py = 1060 - 170 * .9 - 12;
    ctx.save(); ctx.translate(px, py); ctx.rotate(1.3 * eIn(fall)); ctx.globalAlpha = 1 - seg(t, tf + .2, tf + .6); pennant(0, 0, .36, t, { col: BIZC }); ctx.restore();
    const up = eOut(seg(t, tf + .2, tf + .8)); if (up > 0) { ctx.save(); ctx.beginPath(); ctx.rect(px - 10, py - 120, 120, 120); ctx.clip(); pennant(px, py + 100 * (1 - up), .36, t, { col: OSMC }); ctx.restore(); }
    if (t > tf) smokeLayer(t, .5 * seg(t, tf, tf + 1.5), '#2a2018', 7);
    ctx.restore();
  },
  /* "düğün alayı baskına uğramış ve gelin esir alınmış." — doruk */
  baskin(t, s) {
    const tb = C('p5:baskına'), te = C('p5:esir'), pan = eIO(seg(t, s.t0, s.t1)), z = lerp(1, 1.06, pan);
    ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-540, -1150);
    ctx.fillStyle = lg(0, 0, 0, 1300, [[0, '#070a18'], [.6, '#141a34'], [.85, '#3a2a30'], [1, '#5a3424']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.save(); ctx.translate(-30 * pan, 0); stars(t, .7); crescentMoon(800, 470, 34);
    ctx.fillStyle = '#120d14'; ctx.beginPath(); ctx.moveTo(-100, 1300); for (let x = -100; x <= W + 100; x += 40) ctx.lineTo(x, 1070 - 40 * Math.sin(x * .004 + 1.3) - 20 * Math.cos(x * .011)); ctx.lineTo(W + 100, 1300); ctx.fill();
    castle(840, 1000, .55, '#0a0810'); ctx.restore();
    const fl = 1 - .45 * seg(t, tb + .3, s.t1);
    ctx.fillStyle = lg(0, 960, 0, 1310, [[0, 'rgba(255,150,70,0)'], [.6, `rgba(255,160,80,${.42 * fl})`], [1, `rgba(255,150,70,${.1 * fl})`]]); ctx.fillRect(-100, 960, W + 200, 350);
    ctx.fillStyle = lg(0, 1290, 0, H, [[0, '#0a0706'], [1, '#020101']]); ctx.fillRect(-100, 1290, W + 200, H);
    ctx.save(); ctx.translate(-120 * pan, 0);
    const sc = eOut(seg(t, tb, tb + 1.4)), bx0 = 470 + (te - s.t0) * 36;
    // düğün alayı: fenerli; baskında dağılır. i = 2 gelin
    for (let i = 0; i < 5; i++) {
      if (i === 2) continue;
      const back = i < 2, x = 170 + i * 150 + (t - s.t0) * 36 + (back ? -1 : 1) * sc * 240, y = 1190 + (i % 2) * 8;
      rider(x, y, .78, t, { speed: lerp(.9, 2.4, sc), ph: i * .23, sil: '#060404', spear: false, flip: back && sc > .3 });
      const la = 1 - .85 * seg(t, tb + .2, tb + 1.2), lx = x + (back && sc > .3 ? -50 : 50), ly = y - 200 + sc * 120 * (i % 2);
      ctx.strokeStyle = '#060404'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + (back && sc > .3 ? -12 : 12), y - 130); ctx.lineTo(lx, ly + 12); ctx.stroke();
      if (la > .05) { glow(lx, ly, 160 * la, 'rgba(255,170,80,.6)'); ctx.save(); ctx.globalAlpha = la; ctx.fillStyle = '#ffd890'; ctx.fillRect(lx - 8, ly - 12, 16, 24); ctx.restore(); }
    }
    const gx = t < te ? bx0 : bx0 - (t - te) * 360 + 30;
    if (t < te + .4) { const la = 1 - seg(t, te, te + .4); glow(gx + 50, 990, 170 * la, 'rgba(255,190,110,.65)'); }
    rider(gx, 1192, .78, t, { speed: t < te ? .9 : 2.6, ph: .5, sil: '#060404', spear: false, flag: '#efe2c4', flip: t >= te });
    // akıncılar (ön plan): soldan dalar; "esir"den sonra gelinle sola döner
    const hp = hitPulse(t, tb, .9); if (hp > 0) glow(bx0, 1080, 560 * hp, 'rgba(255,200,130,.7)');
    for (let j = 0; j < 3; j++) {
      const xin = lerp(-520 - j * 230, bx0 - 40 - j * 210, eOut(seg(t, tb - .7, tb + .35))), x = t < te ? xin : xin - (t - te) * 380, y = 1300 + j * 6;
      const da = seg(t, tb - .6, tb) * (1 - seg(t, te + 1, te + 2.2));
      if (da > 0) { ctx.fillStyle = rg(x - 160, y - 30, 0, 230, [[0, `rgba(110,85,70,${.35 * da})`], [1, 'rgba(110,85,70,0)']]); ctx.fillRect(x - 400, y - 260, 480, 300); }
      rider(x, y, 1.2 - j * .1, t, { speed: 2.6, ph: j * .37, sil: '#030202', flag: j === 0 ? OSMC : null, flip: t >= te });
    }
    ctx.restore(); ctx.restore();
  },
  /* harita sessizliği (2 sn): Bilecik kızıla döner */
  sessizlik(t, s) {
    const k = seg(t, s.t0, s.t1), Y = lerp(1298.9, 1300.9, eIO(k)), tp = C('p5.end+1.0');
    const cam = camAt([[s.t0, 86, 42, 11.2], [s.t1, 80, 38, 8.6]], t, .003);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    ownCity(cam, 'Söğüt', Y, { size: 30 });
    ownCity(cam, 'Bilecik', Y, { size: 30, label: false });
    const [bx, by] = W2S(cam, ...BIL), up = eOut(seg(t, tp - .1, tp + .7)), hp = hitPulse(t, tp, 1.3);
    if (hp > 0) glow(bx, by, 260 * hp, 'rgba(255,190,120,.6)');
    if (up > 0) { ctx.save(); ctx.beginPath(); ctx.rect(bx - 20, by - 140, 140, 140); ctx.clip(); pennant(bx, by + 100 * (1 - up), .36, t, { col: OSMC }); ctx.restore(); }
  },
  /* "Gelin, Osman'ın oğlu Orhan'la evlendirilmiş ve adı Nilüfer olmuş. Nilüfer Hatun ileride, Orhan'dan sonra tahta çıkan Birinci Murad'ın annesi olacaktı." */
  nilufer(t, s) {
    const tn = C('p6:Nilüfer'), tn2 = C('p6:Nilüfer#2'), tor = C("p6:Orhan'dan"), tm = C('p6:Birinci');
    ctx.fillStyle = lg(0, 0, 0, H, [[0, '#0a1420'], [.55, '#07101a'], [1, '#020508']]); ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) { const r = fract((t - s.t0) * .45 + i / 3); ctx.strokeStyle = `rgba(242,199,92,${.3 * (1 - r)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(540, 1120, 120 + r * 420, (120 + r * 420) * .18, 0, 0, TAU); ctx.stroke(); }
    // çiçek: önce ortada büyük; "Nilüfer Hatun"da sağa kayıp soy çizgisinin bir ucu olur
    const mv = eIO(seg(t, tn2 - .1, tn2 + .9)), nz = lerp(1, 1.1, eIO(seg(t, s.t0, tn2)));
    const fx = lerp(540, 760, mv), fy = lerp(1110, 900, mv), fs = lerp(1.25, .62, mv) * nz;
    nilufer(fx, fy, fs, spring(t, s.t0 + .05, { freq: .9, damp: .8 }), t);
    kinetic('NİLÜFER', W / 2, 560, 120, t, tn - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6, out: tn2 - .1 });
    // soy çizgisi (rüya ağacının dalları gibi altın): Orhan — Nilüfer Hatun → I. Murad
    const oa = eOut(seg(t, tor - .1, tor + .5)), ma = eOut(seg(t, tm - .1, tm + .6)), la = seg(t, tn2 + .3, tn2 + .9);
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = GOLD; ctx.lineWidth = 5;
    if (oa > 0) { ctx.globalAlpha = oa; ctx.beginPath(); ctx.moveTo(lerp(640, 300, oa), 990); ctx.lineTo(640, 990); ctx.stroke(); }
    if (ma > 0) { ctx.globalAlpha = ma; ctx.beginPath(); ctx.moveTo(530, 990); ctx.lineTo(530, lerp(990, 1150, ma)); ctx.stroke(); }
    ctx.restore();
    const node = (x, y, a, t0) => { if (a <= 0) return; const p = spring(t, t0, { freq: 1.6, damp: .6 }); ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(p, p); ctx.rotate(Math.PI / 4); ctx.fillStyle = GOLD; ctx.fillRect(-11, -11, 22, 22); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-11, -11, 22, 22); ctx.restore(); };
    node(300, 990, oa, tor - .1); node(530, 1162, ma, tm);
    kinetic('NİLÜFER HATUN', 760, 1050, 32, t, tn2 + .3, { mode: 'fade', fam: F.mont, w: 900, spacing: 4, col: '#f4ead2' });
    kinetic('ORHAN', 300, 925, 56, t, tor, { mode: 'fade', fam: F.cinzel, w: 900, gold: true, spacing: 4 });
    kinetic('I. MURAD', 530, 1238, 76, t, tm, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 4 });
    if (la > 0 && la < 1) glow(760, 900, 220 * la, 'rgba(255,214,130,.25)');
  },
  /* "Bin üç yüze doğru Bilecik, Yarhisar ve İnegöl Osman'ın elindeydi." */
  uc(t, s) {
    const Y = lerp(1300, 1300.8, seg(t, s.t0, s.t1)), cam = ucCam(t), tb = C('p7:Bilecik'), ty = C('p7:Yarhisar'), ti = C('p7:İnegöl'), te = C('p7:elindeydi');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    // beylik alanı (yaklaşık): "elindeydi"de kızıl hale
    const ek = eOut(seg(t, te - .1, te + .9));
    if (ek > 0) inWorld(cam, () => {
      const P = spline([[104, 60], [101, 40], [88, 30], [66, 15], [48, 15], [38, 32], [38, 52], [56, 58], [82, 60], [104, 60]], 10);
      ctx.save(); ctx.globalAlpha = .3 * ek; ctx.fillStyle = OSMC; tracePath(P); ctx.fill(); ctx.globalAlpha = .8 * ek; ctx.strokeStyle = '#7a1f17'; ctx.lineWidth = 3 / cam[2]; ctx.setLineDash([12 / cam[2], 9 / cam[2]]); ctx.stroke(); ctx.restore();
    });
    ownCity(cam, 'Söğüt', Y, { size: 30 });
    yearTicker(W / 2, 470, 1300, 116, { approx: true, a: seg(t, s.t0 + .1, s.t0 + .5) * (1 - seg(t, te + .3, te + .8)) });
    mapPin(cam, ...YAR, t, ty - .05, 'YARHİSAR', { left: true, size: 30 });
    mapPin(cam, ...INE, t, ti - .05, 'İNEGÖL', { left: true, size: 30 });
    mapPin(cam, ...BIL, t, tb - .05, 'BİLECİK', { size: 30 });
  },
  /* "Osman İznik'e bakan Yenişehir'i kendine üs yaptı. Akıncıları İznik'in çevresini sardı ve şehir surlarının içine sıkıştı." */
  iznik(t, s) {
    const Y = lerp(1300.8, 1301.4, seg(t, s.t0, s.t1)), cam = ucCam(t), tiz = C("p7:İznik"), tyn = C('p7:Yenişehir'), ta = C('p7:Akıncıları'), tsr = C('p7:sardı'), tsk = C('p7:sıkıştı'), tsu = C('p7:surlarının');
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    inWorld(cam, () => {
      const P = spline([[104, 60], [101, 40], [88, 30], [66, 15], [48, 15], [38, 32], [38, 52], [56, 58], [82, 60], [104, 60]], 10);
      ctx.save(); ctx.globalAlpha = .3; ctx.fillStyle = OSMC; tracePath(P); ctx.fill(); ctx.globalAlpha = .8; ctx.strokeStyle = '#7a1f17'; ctx.lineWidth = 3 / cam[2]; ctx.setLineDash([12 / cam[2], 9 / cam[2]]); ctx.stroke(); ctx.restore();
    });
    ownCity(cam, 'Söğüt', Y, { size: 30, label: false });
    const pf = 1 - seg(t, s.t0, s.t0 + .6);
    if (pf > 0) { mapPin(cam, ...YAR, t, -9, 'YARHİSAR', { left: true, size: 30, a: pf }); mapPin(cam, ...INE, t, -9, 'İNEGÖL', { left: true, size: 30, a: pf }); mapPin(cam, ...BIL, t, -9, 'BİLECİK', { size: 30, a: pf }); }
    dotLL(cam, YAR, null, { r: 7, a: 1 - pf }); dotLL(cam, INE, null, { r: 7, a: 1 - pf }); dotLL(cam, BIL, null, { r: 7, a: 1 - pf });
    // İznik: Bizans şehri, surları
    const [ix, iy] = W2S(cam, ...IZN), z = cam[2];
    const sq = eIO(seg(t, tsu - .2, tsk + .4)), wr = lerp(4.2, 3.4, sq) * z;
    surHalka(ix, iy, wr, BIZC, seg(t, tiz - .2, tiz + .4), 7);
    // akıncılar: Yenişehir'den İznik'in çevresine
    const k1 = eIO(seg(t, ta - .1, tsr + .2)), k2 = eIO(seg(t, ta + .2, tsr + .5)), k3 = eIO(seg(t, ta + .4, tsr + .7));
    arrow(cam, [[YEN[0] + 2, YEN[1] - 3], [66, 19], [72, 10], [70, 1]], k1, 15, OSMC);
    arrow(cam, [[YEN[0] + 1, YEN[1] - 4], [58, 17], [63, 14]], k2, 13, OSMC);
    arrow(cam, [[YEN[0] + 3, YEN[1] - 2], [74, 20], [78, 6], [72, -4], [63, -3]], k3, 13, OSMC);
    // kuşatma halkası daralır: şehir surların içine sıkışır
    const rk = seg(t, tsr - .2, tsr + .6);
    if (rk > 0) { const r = lerp(11, 6.2, sq) * z; surHalka(ix, iy, r + 10, 'rgba(168,50,42,.25)', rk, 20); surHalka(ix, iy, r, OSMC, rk, 5, [18, 11]); }
    const hp = hitPulse(t, tsk, 1.2); if (hp > 0) glow(ix, iy, 160 * hp, 'rgba(255,190,120,.5)');
    ownCity(cam, 'İznik', Y, { size: 34, a: seg(t, tiz - .2, tiz + .3) });
    const yl = seg(t, ta - .2, ta + .3);   // etiket okları örtmesin: akıncılar çıkınca yalnız iğne kalır
    mapPin(cam, ...YEN, t, tyn - .05, 'YENİŞEHİR', { date: "OSMAN'IN ÜSSÜ", size: 32, a: 1 - yl });
    if (yl > 0) mapPin(cam, ...YEN, t, tyn - .05, null, { a: yl });
  },
  /* "Sonunda imparator, bu küçük beyliği durdurmak için Boğaz'ın öte yakasına bir ordu gönderdi. Bizans ile Osman ilk kez savaş meydanında karşı karşıya gelecekti." */
  soru(t, s) {
    const Y = 1301.5, ti = C('p8:imparator'), tbg = C("p8:Boğaz'ın"), tg = C('p8:gönderdi'), tbz = C('p8:Bizans'), tk = C('p8:karşı'), tend = C('p8.end');
    const A = ucCam(s.t0), K = [24, -50, 9.2], M = [40, -16, 6.4], tA = C('p8:beyliği');
    const cam = t < tA ? flyTo(A, K, eIO(seg(t, s.t0, tA))) : camAt([[tA, ...K], [tg + .3, ...M], [tk, 52, -14, 7.4], [tend + 1.5, 58, -16, 8.2]], t, .003);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    inWorld(cam, () => {
      const P = spline([[104, 60], [101, 40], [88, 30], [66, 15], [48, 15], [38, 32], [38, 52], [56, 58], [82, 60], [104, 60]], 10);
      ctx.save(); ctx.globalAlpha = .3; ctx.fillStyle = OSMC; tracePath(P); ctx.fill(); ctx.restore();
    });
    ownCity(cam, 'İznik', Y, { size: 30, a: 1 - seg(t, s.t0, s.t0 + .6) });
    const kf = 1 - seg(t, tend + .3, tend + .8);   // sıradaki kartından önce harita yazıları söner
    ownCity(cam, 'İzmit', Y, { size: 28, a: seg(t, tg, tg + .5) * kf });
    mapLabel(cam, 'BİZANS', ...LL(29.3, 40.6), 44, { a: seg(t, tbz - .1, tbz + .4) * kf });
    // imparatorun ordusu: Konstantinopolis'ten Boğaz'ı geçip Bitinya'ya
    arrow(cam, [[...KON], [8, -50], [26, -40], [44, -32], [58, -27]], eIO(seg(t, tbg - .2, tg + .4)), 22, BIZC, { col0: '#5a3f78' });
    // Osman'ın kuvvetleri karşıdan
    arrow(cam, [[60, 24], [66, 8], [66, -6], [64, -18]], eIO(seg(t, tbz, tk + .2)), 20, OSMC);
    const [qx, qy] = W2S(cam, ...BAF), mk = seg(t, tk - .1, tk + .5);
    if (mk > 0) { const hp = hitPulse(t, tk, 1.2); glow(qx, qy, 120 + 220 * hp, `rgba(255,200,130,${.35 + .4 * hp})`); }
    const qa = spring(t, C('p8:gelecekti'), { freq: 1.5, damp: .7 }) * (1 - seg(t, tend + .5, tend + .9));
    if (qa > 0) { ctx.save(); ctx.globalAlpha = clamp(qa); title('?', qx, qy - 140 + Math.sin(t * 2.4) * 5, 170 * clamp(qa, .2, 1.2), { fam: F.cinzel, w: 900, gold: true }); ctx.restore(); }
    mapPin(cam, ...KON, t, ti - .05, 'KONSTANTİNOPOLİS', { date: 'İMPARATOR II. ANDRONİKOS', size: 30, col: BIZC, a: kf });
  },
};
