/* Sezon 1 · Bölüm 1 sahneleri: Sınırın İki Yakası. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js
 * Olgular: FACTS.md · çekim listesi: STORYBOARD.md. Portre yok: kişiler siluet ve nesneyle (tuğ, sancak, yük).
 * p1–p3 tek harita yolculuğudur (doğudan batıya): kamera MAPCAM, yıl MAPYIL; yedi sahne aynı çizimi paylaşır, kesme görünmez. */
'use strict';
const C = cue;
const A = (n, d) => { const p = CITY[n]; return [p[0] + (d?.[0] || 0), p[1] + (d?.[1] || 0)]; };
// listede olmayan yerler (FACTS.md'de koordinat notu var)
const DOMANIC = LL(29.61, 39.80), KARACA = LL(30.55, 39.75), INEGOL = LL(29.51, 40.08);
const MOG = '#3a342c', SELC = '#3f7f7a', OSMC = '#a8322a', BIZC = '#7a5a9a', OBAC = '#c9a564';
// uç çizgisi (şematik): Selçuklu–Bizans sınır boyu, Karadeniz'den Menteşe'ye
const UC_PTS = [[32.4, 41.7], [31.9, 41.1], [31.2, 40.7], [30.6, 40.35], [30.2, 40.0], [29.8, 39.5], [29.4, 38.9], [29.0, 38.3], [28.7, 37.7], [28.3, 37.1]].map(p => LL(...p));
// uca biriken obalar: çizginin doğu yanında, deterministik
const UC_OBA = (() => { const R = rng(1255), P = spline(UC_PTS, 8), L = polyLen(P), out = []; for (let i = 0; i < 42; i++) { const [x, y, a] = pointAt(P, L, .03 + .94 * R()), off = 10 + R() * 52; out.push([x + Math.sin(a) * off, y - Math.cos(a) * off, R()]); } return out; })();

/* ================= bölüme özel çizimler ================= */
// ekranda kâğıt haleli etiket
function ekranEtiket(s, x, y, size, a = 1, o = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); setFont(size, o.fam || F.mont, 900); ctx.letterSpacing = (o.sp ?? 3) + 'px'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = size * .32; ctx.strokeStyle = o.halo || 'rgba(240,228,198,.9)'; ctx.strokeText(s, x, y); ctx.fillStyle = o.col || '#24170b'; ctx.fillText(s, x, y); ctx.restore();
}
// harita üstünde küçük oba (çadır) işareti
function cadirIsaret(x, y, r, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = '#f2e6c8'; ctx.strokeStyle = '#2a1d10'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - r, y + r * .6); ctx.quadraticCurveTo(x, y - r * 1.5, x + r, y + r * .6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
// harita üstünde hisar simgesi (castle'ın küçüğü); renk: sahibinin tonu
function hisarIsaret(x, y, sc, col, a = 1, gl) {
  if (a <= 0) return; if (gl) glow(x, y - 12, 90 * sc / .15, gl, a);
  ctx.save(); ctx.globalAlpha = clamp(a); castle(x, y, sc, col); ctx.restore();
}
// koyun (yandan)
function koyun(x, y, s, t, ph = 0, col = '#ece6d8') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const b = Math.sin(t * 7 + ph) * 3;
  ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 4; ctx.beginPath(); [-14, -6, 8, 15].forEach((lx, i) => { ctx.moveTo(lx, -8); ctx.lineTo(lx + (i % 2 ? b : -b), 8); }); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, -16, 24, 14, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(40,30,20,.55)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#2a2018'; ctx.beginPath(); ctx.ellipse(24, -22, 8, 6, .3, 0, TAU); ctx.fill(); ctx.restore();
}
// Bizans sınır bekçisi (ayakta, mızrak ve kalkan); o.walk: yürüme salınımı
function bekci(x, y, s, t, o = {}) {
  const a = Math.sin(t * 6 + (o.ph || 0)) * .4 * (o.walk || 0);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); const col = o.col || '#0b0d14'; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 18; }
  ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-6, -95); ctx.lineTo(-10 + Math.sin(a) * 30, 0); ctx.moveTo(6, -95); ctx.lineTo(10 - Math.sin(a) * 30, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-27, -98); ctx.lineTo(-20, -190); ctx.quadraticCurveTo(0, -206, 20, -190); ctx.lineTo(29, -98); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -214, 15, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-17, -218); ctx.lineTo(0, -252); ctx.lineTo(17, -218); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(34, 8); ctx.lineTo(34, -300); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(34, -324); ctx.lineTo(27, -298); ctx.lineTo(41, -298); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(14, -182); ctx.lineTo(34, -140); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-30, -146, 26, 34, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
// gözcü kulesi (taş), tepesinde işaret ateşi yeri
function kule(x, y, s, col = '#0d0f17') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-50, 6); ctx.lineTo(-40, -200); ctx.lineTo(40, -200); ctx.lineTo(50, 6); ctx.closePath(); ctx.fill();
  ctx.fillRect(-52, -224, 104, 26); for (let i = 0; i < 4; i++) ctx.fillRect(-52 + i * 29, -244, 17, 22);
  ctx.restore();
}
// işaret ateşi: a 0..1 (sönerken küçülür), sönünce duman
function isaretAtesi(x, y, s, t, a, seed, tOut) {
  if (a > 0) { const fl = .85 + .12 * Math.sin(t * 13 + seed) + .06 * Math.sin(t * 31 + seed * 3);
    glow(x, y - 20 * s, 260 * s * fl * a, 'rgba(255,150,60,.55)'); glow(x, y - 20 * s, 90 * s * fl * a, 'rgba(255,215,140,.8)');
    ctx.save(); ctx.translate(x, y); ctx.scale(s * a, s * a * fl); ctx.fillStyle = 'rgba(255,190,90,.95)';
    ctx.beginPath(); ctx.moveTo(-18, 0); ctx.quadraticCurveTo(-20, -40, 0, -78 + Math.sin(t * 9 + seed) * 6); ctx.quadraticCurveTo(20, -40, 18, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,190,.95)'; ctx.beginPath(); ctx.ellipse(0, -16, 8, 18, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  if (tOut !== undefined && t > tOut) { const R = rng(seed * 13 + 1); ctx.save();
    for (let i = 0; i < 7; i++) { const k = fract((t - tOut) * .35 + i / 7), age = clamp((t - tOut) * 1.5 - i * .15); if (age <= 0) continue;
      ctx.globalAlpha = .28 * (1 - k) * age; ctx.fillStyle = '#9aa0ac'; ctx.beginPath(); ctx.arc(x + Math.sin(k * 5 + R() * 6) * 16 * s + k * 50 * s, y - 20 * s - k * 260 * s, (10 + k * 34) * s, 0, TAU); ctx.fill(); }
    ctx.restore(); }
}
// emanet yükü: kilim desenli, iple bağlı denk (Bölüm 2'de aynı nesne hisara geri döner). d: kararma 0..1
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
// yüklü at (yandan, sağa yürür)
function yukluAt(x, y, s, t, o = {}) {
  const g = fract(t * (o.speed || .9) + (o.ph || 0)), A_ = Math.sin(g * TAU);
  ctx.save(); ctx.translate(x, y + Math.abs(A_) * -3 * s); ctx.scale(s, s);
  const col = o.sil || '#120a0e'; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 18; }
  ctx.lineWidth = 9; for (const [hx, ph] of [[-62, 0], [-48, .5], [52, .5], [66, 0]]) { const a = Math.sin((g + ph) * TAU) * .35, kx = hx + Math.sin(a) * 18; ctx.beginPath(); ctx.moveTo(hx, -70); ctx.lineTo(kx, -35); ctx.lineTo(kx + Math.sin(a + .4) * 14, 0); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, -88, 82, 30, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(56, -104); ctx.quadraticCurveTo(84, -134, 98, -142); ctx.lineTo(126, -118); ctx.lineTo(120, -106); ctx.quadraticCurveTo(98, -112, 80, -86); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-80, -100); ctx.quadraticCurveTo(-104, -80, -108, -50 + A_ * 4); ctx.stroke();
  ctx.shadowBlur = 0;
  if (o.load !== false) { emanetYuk(-32, -130, .95, { dark: o.dark }); emanetYuk(30, -126, .85, { dark: o.dark, rot: .05 }); }
  ctx.restore();
}
// yürüyen adam (keçe börk, değnek); o.carry: elinde/sırtında küçük çıkın
function yaya(x, y, s, t, o = {}) {
  const a = Math.sin(fract(t * (o.speed || .9) + (o.ph || 0)) * TAU) * .45;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.sil || '#120a0e'; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = 16; }
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(Math.sin(a) * 34, 0); ctx.moveTo(0, -90); ctx.lineTo(-Math.sin(a) * 34, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-22, -92); ctx.lineTo(-16, -180); ctx.quadraticCurveTo(0, -192, 18, -180); ctx.lineTo(26, -92); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(2, -202, 15, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(2, -216, 16, 9, 0, 0, TAU); ctx.fill();
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(30, 4); ctx.lineTo(40, -210); ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(10, -170); ctx.lineTo(34, -128); ctx.stroke();
  ctx.shadowBlur = 0;
  if (o.carry) emanetYuk(46, -120, .5, { dark: o.dark ?? .15 });
  ctx.restore();
}
// sırt çizgisi (deterministik)
const sirtY = (x, base, amp, seed, f = .004) => base - amp * (.5 + .5 * Math.sin(x * f + seed) * Math.cos(x * f * .53 + seed * 2.1));
function sirt(base, amp, col, seed, f = .004) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-200, H + 200); for (let x = -200; x <= W + 200; x += 24) ctx.lineTo(x, sirtY(x, base, amp, seed, f)); ctx.lineTo(W + 200, H + 200); ctx.closePath(); ctx.fill(); }
// kar ya da yaprak: deterministik süzülen parçacık
function suzulen(t, n, seed, o = {}) {
  const R = rng(seed); ctx.save(); ctx.fillStyle = o.col || '#f4f6fa';
  for (let i = 0; i < n; i++) { const x0 = R() * (W + 200) - 100, sp = (o.speed || 60) * (.6 + R() * .8), r = (o.r || 3) * (.5 + R()), ph = R() * TAU;
    const y = fract(R() + t * sp / H) * (H + 100) - 50, x = x0 + Math.sin(t * .8 + ph) * 30 + (o.drift || 0) * t;
    ctx.globalAlpha = (o.a ?? .8) * (.5 + .5 * R()); ctx.beginPath(); if (o.leaf) ctx.ellipse(((x % (W + 200)) + W + 200) % (W + 200) - 100, y, r * 1.8, r, ph + t, 0, TAU); else ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  ctx.restore();
}

/* ================= p1–p3: tek harita yolculuğu (doğudan batıya) ================= */
function MAPCAM(t) {
  return camPath([
    [0, 900, 45, 1.0],
    [C("p1:Kösedağ'da"), 845, 30, 1.12],
    [C('p1:dağıldı'), 810, 20, 1.15],
    [C('p1:Anadolu'), 560, -40, .6],
    [C('p2:vergiler'), 800, 0, .7],
    [C('p2:Türkmen'), 480, -10, .66],
    [C('p2:Bizans'), 330, 10, .74],
    [C('p2:uçlar'), 200, 40, .9],
    [C('p3'), 150, 40, .98],
    [C('p3:Bizans'), 120, 30, .98],
    [C("p3:İstanbul'u") + .2, 10, -50, 1.7],
    [C('p3:gözü'), -60, -50, 1.4],
    [C('p3:batıdaydı') + .9, -300, 0, .68],
    [C("p3:Anadolu'da") + .3, -320, 0, .66],
  ], t, { creep: .004 });
}
function MAPYIL(t) {
  return 1243.3 + .7 * eIO(seg(t, C('p1:bedelini'), C('p1:ödedi') + .4)) + 6 * eIO(seg(t, C('p2:Moğol'), C('p2:Bu')))
    + 10 * eIO(seg(t, C('p2:Sınır'), C('p2.end'))) + .4 * seg(t, C('p3'), C('p3:Bizans')) + 1.6 * eIO(seg(t, C('p3:Bin'), C("p3:İstanbul'u") + .6));
}
function harita1(t) {
  const T = { K: C("p1:Kösedağ'da"), D: C('p1:dağıldı'), Bu: C('p1:Bu'), Od: C('p1:ödedi'), p2: C('p2'), Mo: C('p2:Moğol'), To: C('p2:topluyordu'), Tu: C('p2:Türkmen'), Bz: C('p2:Bizans'),
    Ce: C('p2:çekildi'), Si: C('p2:Sınır'), Uc: C('p2:uçlar'), Ka: C('p2:kalabalıklaşıyordu'), p2e: C('p2.end'), p3: C('p3'), Ob: C('p3:öbür'), B: C('p3:Bizans'), Bin: C('p3:Bin'),
    Is: C("p3:İstanbul'u"), Go: C('p3:gözü'), Ba: C('p3:batıdaydı') };
  const cam = MAPCAM(t), Y = MAPYIL(t);
  const before = t < T.B, dim = before ? .3 * (1 - seg(t, T.Bu, T.p2)) : .38 * eIO(seg(t, T.B, T.B + .8));
  const bz = .5 * hitPulse(t, T.B, 1.5) + .1 * seg(t, T.B, T.B + .4) * (1 - seg(t, T.Go, T.Go + 1));
  drawTimeMap(t, cam, Y, { focus: before ? 'SEL' : 'BIZ', dim, after: (z, S) => {
    if (bz <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = bz; ctx.fillStyle = '#c3a6ec';
    for (const k in PATHS.st) if (S[k].o === 'BIZ') ctx.fill(PATHS.st[k], 'evenodd'); ctx.restore(); } });
  const W2 = p => W2S(cam, ...p);

  // --- Kösedağ: oklar, iğne, kırılma ---
  const mA = 1 - seg(t, C('p1:Anadolu'), T.p2);
  if (mA > 0) { ctx.save(); ctx.globalAlpha = mA;
    arrow(cam, [CITY['Tebriz'], [1300, 70], [1100, 20], A('Kösedağ', [40, 0])], eIO(seg(t, -2.4, T.K + .3)), 34, MOG, { col0: '#6b6458' });
    arrow(cam, [[1250, -70], [1060, -30], A('Kösedağ', [30, -25])], eIO(seg(t, -1.8, T.K + .6)), 24, MOG, { col0: '#6b6458' });
    ctx.restore(); }
  const sA = 1 - seg(t, T.D, T.D + .55);
  if (sA > 0) { ctx.save(); ctx.globalAlpha = sA; arrow(cam, [CITY['Konya'], A('Kayseri'), A('Sivas', [20, 0]), A('Kösedağ', [-40, 10])], eIO(seg(t, -2, T.K + .2)), 30, SELC, { col0: '#5aa19a' }); ctx.restore(); }
  const [kx, ky] = W2(CITY['Kösedağ']), cA = 1 - seg(t, C('p1:Anadolu'), T.p2);
  if (cA > 0) { ctx.save(); ctx.globalAlpha = cA; cracks(kx, ky, seg(t, T.D, T.D + .5), 4, { n: 7, len: 300 }); ctx.restore(); }
  const hp = hitPulse(t, T.D, 1); if (hp > 0) glow(kx, ky, 320 * hp, 'rgba(255,170,90,.85)');
  smokeLayer(t, .45 * seg(t, T.D, T.D + 1.2) * (1 - seg(t, T.p2 - .4, T.p2 + .6)), '#2a2018', 7);
  { const da = .55 * (1 - seg(t, T.D + .4, T.D + 1.4)); if (da > 0) glow(kx + 20, ky, 220 + 40 * Math.sin(t * 3), 'rgba(170,130,90,.5)', da * (.5 + .5 * seg(t, 0, T.K))); }   // buluşma noktasında toz
  mapPin(cam, ...CITY['Kösedağ'], t, T.K - .1, 'KÖSEDAĞ', { date: '26 HAZİRAN 1243', left: true, a: 1 - seg(t, T.Bu - .2, T.Bu + .3) });
  const la = seg(t, .3, .9) * (1 - seg(t, T.Bu - .3, T.Bu));
  mapLabel(cam, 'SELÇUKLU', 560, 175, 40, { a: la });
  mapLabel(cam, 'MOĞOLLAR', 1050, -45, 36, { a: la });
  mapLabel(cam, 'MOĞOLLAR', 1080, -85, 40, { a: seg(t, T.Mo - .2, T.Mo + .3) * (1 - seg(t, T.Tu, T.Tu + .5)) });
  ctx.save(); ctx.globalAlpha = 1 - seg(t, T.K - .1, T.K + .3); if (t < T.K + .3) yearTicker(W / 2, 430, 1243, 120, {}); ctx.restore();
  const ta = seg(t, C('p1:bütün') - .1, C('p1:bütün') + .4) * (1 - seg(t, T.Mo - .4, T.Mo));
  mapLabel(cam, 'MOĞOLLARA TABİ', 420, 175, 38, { a: ta, sp: 4 });

  // --- vergi: akçe doğuya akar, tahsildarlar batıya gelir ---
  const vA = seg(t, T.Mo - .1, T.Mo + .5) * (1 - seg(t, T.Tu + .5, T.Bz));
  if (vA > 0) {
    const V1 = [CITY['Konya'], CITY['Kayseri'], CITY['Malatya'], [1150, 150], CITY['Tebriz']], V2 = [CITY['Ankara'], CITY['Amasya'], CITY['Sivas'], CITY['Erzincan'], [1200, 60], CITY['Tebriz']];
    flowDots(cam, V1, t, vA, { n: 12, speed: .16, r: 15 }); flowDots(cam, V2, t, vA, { n: 14, speed: .16, r: 15 });
    const P = spline(V2.slice().reverse().map(W2), 12), L = polyLen(P);
    for (let i = 0; i < 3; i++) { const k = eOut(seg(t, T.Mo - .4 + i * .3, T.To + 1.2 + i * .3)) * .62, [x, y] = pointAt(P, L, .08 + k);
      ctx.save(); ctx.globalAlpha = vA * seg(t, T.Mo - .4 + i * .3, T.Mo + i * .3); rider(x, y + 8, .26, t, { sil: '#1a120a', flip: true, speed: 2.2, ph: i * .3, flag: i ? null : '#3a342c' }); ctx.restore(); }
  }

  // --- göç: Türkmen obaları batıya ---
  const G = [[A('Amasya'), [430, -70], [260, -55]], [CITY['Kayseri'], [430, 130], [300, 95], [175, 75]], [CITY['Konya'], [180, 300], [45, 310]]];
  const gA = 1 - .55 * seg(t, T.p2e, T.B) - .45 * seg(t, T.B, T.B + .8);
  if (t > T.Tu - .4) G.forEach((pts, i) => {
    const k = eIO(seg(t, T.Tu - .3 + i * .2, T.Ce + .3 + i * .2)); ctx.save(); ctx.globalAlpha = gA; arrow(cam, pts, k, 22, OBAC, { col0: '#e8d3a0' }); ctx.restore();
    if (k > .2) { const P = spline(pts.map(W2), 12), L = polyLen(P); for (let j = 0; j < 5; j++) { const q = fract(t * .22 + j / 5 + i * .13) * k * .9, [x, y] = pointAt(P, L, q); cadirIsaret(x, y - 6, 13, gA * Math.sin(q / Math.max(k, .01) * Math.PI) * .95); } }
  });
  const [tx, ty] = W2([380, 205]);
  kinetic('TÜRKMEN OBALARI', tx, ty, 40, t, T.Tu, { mode: 'fade', fam: F.cinzel, w: 900, col: '#fff6dc', out: T.Si - .3 });
  mapLabel(cam, 'BİZANS', -68, 67, 46, { a: seg(t, T.Bz, T.Bz + .4) * (1 - seg(t, T.p3 - .2, T.p3 + .3)) });

  // --- uçlar: sınır boyu parlar, obalar birikir, yıllar akar ---
  const uk = eIO(seg(t, T.Si - .1, T.Uc + .7)), uA = 1 - .65 * seg(t, T.Go, T.Ba + .6);
  if (uk > 0) glowPath(cam, UC_PTS, t, uk, { w: 11, dash: true, a: uA });
  if (t > T.Uc) UC_OBA.forEach(([x, y, r], i) => { const t0 = lerp(T.Uc, T.p2e, i / UC_OBA.length), a = spring(t, t0, { freq: 2, damp: .6 }); if (a <= 0) return;
    const [sx, sy] = W2([x, y]); cadirIsaret(sx, sy, 14 * clamp(a, 0, 1.3), .95 * gA * (1 - .35 * r)); });
  const [ux, uy] = W2([190, 150]);
  kinetic('UÇLAR', ux, uy, 70, t, T.Uc, { mode: 'slam', fam: F.cinzel, w: 900, col: '#fff3c8', out: T.p3 - .3 });
  const yk = seg(t, T.Si - .1, T.Si + .4) * (1 - seg(t, T.Go + .3, T.Go + .8));
  if (yk > 0) yearTicker(W / 2, 430, t < T.Bin ? Y : Math.min(Y, 1261.5), 110, { approx: t < T.Bin, a: yk });

  // --- soru: sınırın öbür yanı sisli; "Bizans." ile açılır ---
  const fog = seg(t, T.p3 - .1, T.p3 + .5) * (1 - seg(t, T.B - .1, T.B + .35));
  if (fog > 0) { ctx.save(); ctx.globalAlpha = fog; ctx.fillStyle = lg(0, 0, 620, 0, [[0, 'rgba(16,12,26,.86)'], [.7, 'rgba(16,12,26,.45)'], [1, 'rgba(16,12,26,0)']]); ctx.fillRect(0, 0, 620, H); ctx.restore();
    const [qx, qy] = W2([-40, 60]), qa = clamp(spring(t, T.Ob - .1, { freq: 1.6, damp: .7 })) * (1 - seg(t, T.B - .1, T.B + .1));
    if (qa > 0) { glow(qx, qy, 200, 'rgba(255,214,130,.35)', qa); ctx.save(); ctx.globalAlpha = qa; title('?', qx, qy + Math.sin(t * 2.4) * 8, 220, { fam: F.cinzel, w: 900, gold: true }); ctx.restore(); } }
  const [bx, by] = W2(LL(28.4, 40.1));
  kinetic('BİZANS', bx, by, 92, t, T.B - .05, { mode: 'slam', fam: F.cinzel, w: 900, col: '#f4ecff', out: T.Is - .2 });

  // --- 1261: İstanbul yeniden Bizans'ın; gözü batıda ---
  if (t > T.Bin - .5) ownCity(cam, 'Konstantinopolis', Y, { label: false, r: 9, a: seg(t, T.Bin - .5, T.Bin) });
  const [cx, cy] = W2(CITY['Konstantinopolis']), ip = hitPulse(t, T.Bin + .6, 1.4); if (ip > 0) glow(cx, cy, 300 * ip, 'rgba(200,170,255,.8)');
  mapPin(cam, ...CITY['Konstantinopolis'], t, T.Is - .1, 'İSTANBUL', { left: true, a: 1 - seg(t, T.Go - .3, T.Go + .2) });
  const wk = eIO(seg(t, T.Go - .1, T.Ba + .7));
  if (wk > 0) { arrow(cam, [CITY['Konstantinopolis'], [-200, -95], [-450, -60]], wk, 34, BIZC, { col0: '#a58ac4' });
    arrow(cam, [A('Konstantinopolis', [-10, 20]), [-190, 60], [-420, 210]], eIO(seg(t, T.Go + .1, T.Ba + .9)), 28, BIZC, { col0: '#a58ac4' }); }
}

window.SCENE_FNS = {
  /* p1 "Bin iki yüz kırk üç yazında, Kösedağ'da Selçuklu ordusu Moğollar karşısında dağıldı." */
  kosedag(t) { harita1(t); },
  /* p1 "Bu yenilginin bedelini bütün Anadolu ödedi." – geri çekilme, tabiiyet taraması, başlık kartı */
  anadolu(t) { harita1(t); },
  /* p2 "Moğol tahsildarları ağır vergiler topluyordu." */
  vergi(t) { harita1(t); },
  /* p2 "Bu yükten kaçan Türkmen obaları batıya, Bizans topraklarına doğru çekildi." */
  goc(t) { harita1(t); },
  /* p2 "Sınır boyları, yani uçlar, her yıl biraz daha kalabalıklaşıyordu." */
  uclar(t) { harita1(t); },
  /* p3 "Peki sınırın öbür yanında kim vardı?" */
  soru(t) { harita1(t); },
  /* p3 "Bizans. Bin iki yüz altmış birde İstanbul'u geri alan imparatorluğun gözü artık batıdaydı." */
  bizans(t) { harita1(t); },

  /* p3 "Anadolu'da sınırı kuşaklardır bekleyen dağ köylüleri vergiye bağlandı ve bu bekçiler dağılmaya başladı." */
  bekciler(t, s) {
    const tv = C('p3:vergiye'), td = C('p3:dağılmaya'), k = seg(t, s.t0, s.t1), cool = eIO(seg(t, tv, td + 1.2));
    ctx.fillStyle = lg(0, 0, 0, 1250, [[0, mix('#1e2a44', '#121826', cool)], [.55, mix('#4a4a62', '#2c3040', cool)], [.82, mix('#b8785a', '#5e5c6c', cool)], [1, mix('#e0a070', '#7a7684', cool)]]); ctx.fillRect(0, 0, W, H);
    glow(260, 1120, 520, 'rgba(255,170,100,.35)', 1 - cool * .8);
    const z = lerp(1, 1.07, eIO(k)), px = lerp(24, -24, k);
    ctx.save(); ctx.translate(540 + px, 1150); ctx.scale(z, z); ctx.translate(-540, -1150);
    sirt(960, 160, mix('#3a3448', '#262836', cool), 2.1, .0035);
    sirt(1120, 110, mix('#1e1a26', '#16171f', cool), 4.7, .0045);
    const TW = [[190, 4.7, 1.2], [560, 4.7, 1.5], [900, 4.7, 1.12]];
    TW.forEach(([x, sd, sc], i) => {
      const y = sirtY(x, 1120, 110, sd, .0045) + 14, out = td + i * .38, a = 1 - eIO(seg(t, out, out + .5));
      kule(x, y, sc); isaretAtesi(x, y - 244 * sc, sc, t, a, i + 1, out + .3);
      for (let j = 0; j < 2; j++) { const dir = j ? 1 : -1, wk = clamp((t - out - .2) * .9), gx = x + dir * (70 + j * 18) * sc + dir * wk * 160 * sc;
        ctx.save(); ctx.globalAlpha = 1 - seg(t, out + .6, out + 1.8); bekci(gx, y + 4, .5 * sc, t, { flip: dir < 0 ? !wk : dir > 0 && wk > 0 ? false : true, walk: wk > 0 ? 1 : 0, ph: i + j, rim: 'rgba(255,170,100,.35)' }); ctx.restore(); }
      // vergi: kulelerden batıya (sola) süzülen akçeler
      for (let c = 0; c < 3; c++) { const q = seg(t, tv + c * .25 + i * .12, tv + 1.6 + c * .25 + i * .12); if (q <= 0 || q >= 1) continue;
        ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); coinIcon(x - q * 300, y - 150 * sc - Math.sin(q * Math.PI) * 140, 16); ctx.restore(); }
    });
    sirt(1300, 60, '#0a0a10', 8.3, .006);
    ctx.restore();
    ctx.fillStyle = lg(0, 1280, 0, H, [[0, 'rgba(6,6,10,0)'], [.3, '#06060a']]); ctx.fillRect(0, 1280, W, H - 1280);
    kinetic('BİZANS SINIR BEKÇİLERİ', W / 2, 470, 34, t, s.t0 + .35, { mode: 'fade', fam: F.mont, w: 900, spacing: 6, col: 'rgba(236,240,255,.94)', stroke: false });
  },

  /* p4 "Bir an kendinizi bu iki dünyanın arasında, Söğüt'te düşünün." */
  sogut(t, s) {
    const ti = C('p4:iki'), ts = C("p4:Söğüt'te"), Y = 1279;
    const cam = camPath([[s.t0, 230, 40, .66], [ti, 205, 45, .72], [ts, 120, 52, 2.0], [s.t1, 102, 53, 3.3]], t, { creep: .006 });
    drawTimeMap(t, cam, Y, {});
    glowPath(cam, UC_PTS, t, 1, { w: 10, dash: true, a: .55 });
    const la = seg(t, ti - .1, ti + .4) * (1 - seg(t, ts, ts + .5)), pul = 1 + .06 * hitPulse(t, C('p4:arasında'), .8);
    mapLabel(cam, 'BİZANS', ...LL(28.0, 40.55), 50 * pul, { a: la });
    mapLabel(cam, 'SELÇUKLU · MOĞOL', ...LL(33.3, 38.9), 34 * pul, { a: la, sp: 3 });
    ownCity(cam, 'Söğüt', Y, { label: false, r: 8 });
    const p = W2S(cam, ...CITY['Söğüt']), pa = seg(t, ts - .3, ts + .3);
    if (pa > 0) { glow(p[0], p[1], 240, 'rgba(255,140,80,.6)', pa); for (let i = 0; i < 3; i++) { const r = fract((t - ts) * .8 + i / 3); ctx.strokeStyle = `rgba(255,214,140,${pa * (1 - r)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 24 + r * 170, 0, TAU); ctx.stroke(); } }
    mapPin(cam, ...CITY['Söğüt'], t, ts - .05, 'SÖĞÜT', {});
  },

  /* p4 "Ertuğrul adında bir beyin obası kışı burada geçiriyor." – kışlak */
  oba(t, s) {
    const te = C('p4:Ertuğrul'), k = seg(t, s.t0, s.t1 + .5), z = lerp(1, 1.1, eIO(k));
    ctx.fillStyle = lg(0, 0, 0, 1300, [[0, '#1d2840'], [.5, '#4e5874'], [.8, '#a2949a'], [1, '#d6c2b2']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-540 + lerp(-20, 30, k), -1150);
    glow(780, 900, 460, 'rgba(255,200,150,.35)');
    sirt(900, 190, '#6d7590', 1.3, .003);
    ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = '#e8ecf4'; ctx.beginPath(); ctx.moveTo(-200, H); for (let x = -200; x <= W + 200; x += 24) ctx.lineTo(x, sirtY(x, 900, 190, 1.3, .003) + 2); for (let x = W + 200; x >= -200; x -= 24) ctx.lineTo(x, sirtY(x, 900, 190, 1.3, .003) + 30); ctx.closePath(); ctx.fill(); ctx.restore();
    sirt(1010, 100, '#9ea6b6', 3.9, .005);
    ctx.fillStyle = lg(0, 1040, 0, 1500, [[0, '#cdd3dc'], [1, '#8a91a0']]); ctx.beginPath(); ctx.moveTo(-200, 1500); for (let x = -200; x <= W + 200; x += 24) ctx.lineTo(x, sirtY(x, 1070, 30, 6.1, .006)); ctx.lineTo(W + 200, 1500); ctx.closePath(); ctx.fill();
    const TN = [[140, 1150, .5], [380, 1112, .42], [610, 1205, .88], [880, 1140, .52], [1010, 1170, .38]];
    TN.forEach(([x, y, sc], i) => { tent(x, y, sc, t + i * 2.3, { door: i === 2 ? undefined : 'rgba(255,170,80,.7)' });
      ctx.save(); ctx.fillStyle = 'rgba(244,246,250,.85)'; ctx.translate(x, y); ctx.scale(sc, sc); ctx.beginPath(); ctx.moveTo(-150, -118); ctx.quadraticCurveTo(0, -268, 150, -118); ctx.quadraticCurveTo(0, -232, -150, -118); ctx.fill(); ctx.restore(); });
    tug(805, 1222, .72, t, {});
    for (let i = 0; i < 9; i++) koyun(190 + (i % 5) * 58 + (i > 4 ? 28 : 0), 1250 + (i > 4 ? 30 : 0), 1.15, t * .3, i, '#e6e2d8');
    ctx.restore();
    suzulen(t, 110, 41, { speed: 70, r: 3.2, a: .85, drift: -8 });
    ctx.fillStyle = lg(0, 1330, 0, H, [[0, 'rgba(10,12,18,0)'], [.35, '#0a0c12']]); ctx.fillRect(0, 1330, W, H - 1330);
    kinetic('ERTUĞRUL', W / 2, 470, 104, t, te - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6 });
    kinetic('KIŞLAK · SÖĞÜT', W / 2, 568, 30, t, te + .5, { mode: 'fade', fam: F.mont, w: 900, spacing: 8, col: 'rgba(255,246,232,.95)', stroke: false });
  },

  /* p4 "Yaz gelince de sürüleriyle Domaniç yaylasına çıkıyor." – yayla yolu */
  yayla(t, s) {
    const ty = C('p4:Yaz'), tsr = C('p4:sürüleriyle'), td = C('p4:Domaniç'), Y = 1279.6;
    const cam = camPath([[s.t0, 86, 60, 6.0], [td, 76, 66, 7.0], [s.t1, 72, 68, 7.3]], t, { creep: .006 });
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .3 });   // soluk zemin: yol ve sürü öne çıksın
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .35 * seg(t, s.t0, ty + .6); ctx.fillStyle = '#ffcf7a'; ctx.fillRect(0, 0, W, H); ctx.restore();
    // Domaniç dağları: tarama işaretleri
    const R = rng(29); ctx.save(); ctx.strokeStyle = 'rgba(60,40,20,.55)'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
    for (let i = 0; i < 30; i++) { const [mx, my] = W2S(cam, DOMANIC[0] + (R() - .65) * 44, DOMANIC[1] + (R() - .25) * 30), h = 14 + R() * 16; ctx.beginPath(); ctx.moveTo(mx - h, my + h * .5); ctx.lineTo(mx, my - h * .6); ctx.lineTo(mx + h, my + h * .5); ctx.stroke(); }
    ctx.restore();
    const path = [CITY['Söğüt'], [88, 58], [75, 65], [62, 72], DOMANIC];
    glowPath(cam, path, t, eIO(seg(t, s.t0 + .2, td + .3)), { w: 12, dash: true, col: '#ffd98a' });
    ownCity(cam, 'Söğüt', Y, { text: 'SÖĞÜT', size: 30, r: 8 });
    const P = spline(path.map(p => W2S(cam, ...p)), 12), L = polyLen(P), R2 = rng(7);
    for (let i = 0; i < 16; i++) { const off = (R2() - .5) * 40, lag = i * .028 + R2() * .02, q = clamp(eIO(seg(t, tsr - .4, s.t1 + 1.6)) * 1.05 - lag); if (q <= 0) continue;
      const [x, y, a] = pointAt(P, L, Math.min(q, .97)); koyun(x - Math.sin(a) * off, y + Math.cos(a) * off, .75, t, i, '#f4efe2'); }
    mapPin(cam, ...DOMANIC, t, td - .05, 'DOMANİÇ', { date: 'YAYLA', left: true });
  },

  /* p5 "Bin iki yüz seksenlerin başında Ertuğrul öldü ve obanın başına oğlu Osman geçti." – tuğ eğilir, sancak yükselir */
  vefat(t, s) {
    const te = C('p5:Ertuğrul'), to = C('p5:öldü'), tO = C('p5:Osman');
    const night = eIO(seg(t, to - .2, to + 1.2)), dawn = eIO(seg(t, tO - .6, tO + 1.4)), kk = lerp(lerp(.34, .07, night), .62, dawn);
    const z = lerp(1, 1.07, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 1200); ctx.scale(z, z); ctx.translate(-540, -1200);
    skyLand(t, { k: kk, sun: true });
    if (night > .2) stars(t, (night - .2) * (1 - dawn));
    tent(300, 1300, .62, t, { sil: '#0c0806' });
    const fall = .34 * eIO(seg(t, to, to + 1.6)) * (1 - eIO(seg(t, tO - .4, tO + .6)));
    glow(650, 900, 360, 'rgba(255,200,120,.3)', .4 + .6 * dawn);
    tug(650, 1380, 1.1, t, { fall, dir: 1, sil: '#0b0705' });
    const py = (1 - eOut(seg(t, tO, tO + 1))) * 420; if (t > tO - .1) pennant(790, 1385 + py, 1.15, t, { col: '#a8322a' });
    ctx.fillStyle = lg(0, 1300, 0, H, [[0, '#0b0805'], [1, '#050302']]); ctx.fillRect(-100, 1330, W + 200, H);
    ctx.restore();
    yearTicker(W / 2, 430, 1281, 110, { approx: true, a: seg(t, s.t0 + .2, s.t0 + .6) * (1 - seg(t, s.t1 - .5, s.t1)) });
    kinetic('ERTUĞRUL', W / 2, 565, 84, t, te - .05, { mode: 'fade', fam: F.cinzel, w: 900, col: '#e9e2d4', out: to + 1.1 });
    kinetic('OSMAN', W / 2, 565, 120, t, tO - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 8 });
  },

  /* p5 "Osman ilk yıllarında komşu Bizans tekfurlarıyla, yani hisar beyleriyle iyi geçindi." – çevredeki hisarlar */
  komsu(t, s) {
    const tb = C('p5:komşu'), th = C('p5:hisar'), ti = C('p5:iyi'), Y = 1284;
    const cam = camPath([[s.t0, 98, 58, 4.2], [tb, 94, 60, 4.8], [ti, 92, 60, 5.0], [s.t1, 84, 44, 6.6]], t, { creep: .005 });
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .15 });
    komsuKatman(t, cam, { tb, th, ti, links: eIO(seg(t, ti - .3, ti + .5)), kc: 0 });
  },

  /* p6 "Anlatılır ki oba yaylaya çıkarken ağır yüklerini Bilecik tekfuruna emanet bırakırmış." – RİVAYET */
  emanet(t, s) { kervan(t, s, 0); },
  /* p6 "Dönüşte de ona yayladan armağanlar götürürmüş." */
  armagan(t, s) { kervan(t, s, 1); },

  /* p6 "Ama bu komşuluk yıllar sonra bambaşka bir hikâyeye dönüşecekti." – yüklerin gölgesi */
  golge(t, s) {
    const tb = C('p6:bambaşka'), m = eIO(seg(t, tb - .1, C('p6:dönüşecekti') + .7)), z = lerp(1, 1.09, eIO(seg(t, s.t0, s.t1)));
    const fl = .88 + .08 * Math.sin(t * 13) + .04 * Math.sin(t * 29), dx = Math.sin(t * 11) * 5;
    ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.translate(-540, -1050);
    ctx.fillStyle = '#2a1914'; ctx.fillRect(-100, -100, W + 200, H + 200);
    const R = rng(77); ctx.strokeStyle = 'rgba(10,5,3,.55)'; ctx.lineWidth = 3;
    for (let r = 0; r < 14; r++) { const y = 300 + r * 70, off = r % 2 ? 0 : 60; for (let c = -1; c < 9; c++) { const x = off + c * 130 + R() * 10; ctx.strokeRect(x, y, 128, 68); } }
    ctx.fillStyle = rg(160, 720, 30, 1100 * fl, [[0, 'rgba(255,180,100,.55)'], [.4, 'rgba(160,80,40,.25)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    // gölgeler: yükler → silahlı adamlar (Bölüm 2'deki rivayetin önsezisi)
    const piles = [[360, 1232, 2.5], [545, 1240, 2.4], [455, 1140, 2.3], [700, 1250, 2.0]];
    piles.forEach(([x, y, sc], i) => {
      const sx = x + (x - 150) * .3 + 90 + dx, sy = y - 70 - i * 6;
      if (m < 1) { ctx.save(); ctx.globalAlpha = .62 * (1 - m); ctx.fillStyle = '#0a0503'; ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.roundRect(sx - 40 * sc, sy - 30 * sc, 86 * sc, 56 * sc, 14 * sc); ctx.fill(); ctx.restore(); }
      if (m > 0) golgeAdam(sx, sy + 24 * sc, lerp(140, 540 + i * 36, m), m * .82, i);
    });
    // kemer: kapının içi
    ctx.fillStyle = '#0c0705'; ctx.beginPath(); ctx.rect(-200, -200, W + 400, H + 400); ctx.moveTo(60, 1500); ctx.lineTo(60, 640); ctx.quadraticCurveTo(60, 300, 540, 290); ctx.quadraticCurveTo(1020, 300, 1020, 640); ctx.lineTo(1020, 1500); ctx.closePath(); ctx.fill('evenodd');
    ctx.fillStyle = lg(0, 1240, 0, 1500, [[0, '#1a0f0a'], [1, '#070403']]); ctx.fillRect(-100, 1240, W + 200, 600);
    piles.forEach(([x, y, sc], i) => emanetYuk(x, y, sc, { dark: .15 + i * .05, rot: (i - 1.5) * .04 }));
    // meşale
    ctx.fillStyle = '#120a06'; ctx.fillRect(140, 735, 16, 120); ctx.fillRect(126, 728, 44, 12);
    glow(150, 700, 420 * fl, 'rgba(255,160,70,.45)'); glow(150, 705, 120 * fl, 'rgba(255,220,150,.8)');
    ctx.save(); ctx.translate(150, 728); ctx.scale(1, fl); ctx.fillStyle = 'rgba(255,190,90,.95)'; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.quadraticCurveTo(-18, -36, 0, -76 + Math.sin(t * 9) * 6); ctx.quadraticCurveTo(18, -36, 16, 0); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .3; ctx.fillStyle = '#b0302a'; ctx.fillRect(0, 0, W, H); ctx.restore();
  },

  /* p7 "Sınırda dengeler çabuk değişiyordu. On yıl dolmadan Karacahisar kalesi Osman'ın eline geçti." + 1,5 sn harita sessizliği */
  karacahisar(t, s) {
    const tdn = C('p7:dengeler'), tOn = C('p7:On'), tk = C('p7:Karacahisar'), tg = C('p7:geçti'), te = C('p7.end'), th = C('p7.end+0.5'), Y = lerp(1286, 1289, seg(t, s.t0, s.t1));
    const cam = camPath([[s.t0, 92, 56, 4.4], [tdn, 100, 60, 4.2], [tOn, 122, 64, 4.4], [tk, 145, 72, 5.0], [th, 150, 75, 5.6], [s.t1, 122, 62, 3.4]], t, { creep: .004 });
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .15 });
    const kc = eIO(seg(t, th - .05, th + .35));   // hisar, vuruşla (cümleden bir nefes sonra) kırmızıya döner
    // Karacahisar: yerel işaret (sahiplik.js'te il birimi değişmez; FACTS #22)
    if (kc > 0) { const [x, y] = W2S(cam, ...KARACA); ctx.save(); ctx.globalAlpha = .4 * kc; ctx.fillStyle = OSMC; ctx.beginPath(); ctx.arc(x, y, 15 * cam[2], 0, TAU); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = .9 * kc; ctx.strokeStyle = OSMC; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(x, y, 15 * cam[2], 0, TAU); ctx.stroke(); ctx.restore(); }
    const ak = eIO(seg(t, tOn - .1, tg - .1));
    if (ak > 0) { arrow(cam, [CITY['Söğüt'], [112, 61], [124, 71], [129, 77]], ak, 28, OSMC, { col0: '#d0574a' }); arrow(cam, [A('Söğüt', [6, -8]), [120, 54], [132, 68], [133, 75]], eIO(seg(t, tOn + .2, tg)), 22, OSMC, { col0: '#d0574a' }); }
    komsuKatman(t, cam, { tb: -10, th: -10, ti: -10, links: 1 - eIO(seg(t, tdn, C('p7:değişiyordu') + .5)), wob: seg(t, tdn - .2, tdn + .3) * (1 - seg(t, tOn, tOn + .6)), kc, karaEtiket: 1 - seg(t, tk - .3, tk) });
    const hp = hitPulse(t, th, 1.3); if (hp > 0) { const [x, y] = W2S(cam, ...KARACA); glow(x, y, 380 * hp, 'rgba(255,170,90,.9)'); }
    mapPin(cam, ...KARACA, t, tk - .05, 'KARACAHİSAR', { date: '~1288', size: 32 });
    // harita sessizliği: rüya ağacı Söğüt'te ilk kez filizlenir (sezon motifi)
    const g = .46 * eOut(seg(t, th + .2, s.t1 + .4)); if (g > 0) { const [x, y] = W2S(cam, ...CITY['Söğüt']); glow(x, y - 70, 260, 'rgba(255,214,130,.45)', clamp(g * 2.4)); miniTree(x, y, .95, g, t); }
  },

  /* p8 "Aynı yıllarda Bilecik yakınlarında, adı Osman'ınkiyle birlikte anılacak bir şeyh yaşıyordu: Edebali." */
  edebali(t, s) {
    const tb = C('p8:Bilecik'), te = C('p8:Edebali'), z = lerp(1, 1.08, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.translate(-540, -1050);
    ctx.fillStyle = rg(600, 1120, 40, 1300, [[0, '#5e3618'], [.4, '#2c180c'], [1, '#080403']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    // pencere: gece göğü, uzakta Bilecik hisarı
    ctx.save(); ctx.beginPath(); ctx.moveTo(690, 910); ctx.lineTo(690, 700); ctx.quadraticCurveTo(690, 610, 790, 600); ctx.quadraticCurveTo(890, 610, 890, 700); ctx.lineTo(890, 910); ctx.closePath(); ctx.clip();
    ctx.fillStyle = lg(0, 600, 0, 910, [[0, '#0d1430'], [1, '#2a2c4a']]); ctx.fillRect(680, 590, 220, 330);
    const R = rng(88); ctx.fillStyle = '#fff0d2'; for (let i = 0; i < 26; i++) { ctx.globalAlpha = .35 + .3 * Math.sin(t * 1.3 + i); ctx.beginPath(); ctx.arc(690 + R() * 200, 610 + R() * 200, .8 + R() * 1.5, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
    const ca = seg(t, tb - .1, tb + .6); ctx.globalAlpha = .35 + .65 * ca; castle(800, 870, .22, '#05060c'); ctx.globalAlpha = 1;
    ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.moveTo(670, 940); for (let x = 670; x <= 910; x += 20) ctx.lineTo(x, 890 + Math.sin(x * .05) * 8); ctx.lineTo(910, 940); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#140a04'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(690, 910); ctx.lineTo(690, 700); ctx.quadraticCurveTo(690, 610, 790, 600); ctx.quadraticCurveTo(890, 610, 890, 700); ctx.lineTo(890, 910); ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(790, 600); ctx.lineTo(790, 910); ctx.moveTo(690, 760); ctx.lineTo(890, 760); ctx.stroke();
    // duvarda soluk ağaç (Bölüm 2'deki rüyaya köprü)
    miniTree(150, 1150, 1.05, lerp(.55, .8, seg(t, s.t0, s.t1)), t, { col: 'rgba(242,199,92,.12)', leaves: false });
    ctx.fillStyle = lg(0, 1180, 0, H, [[0, '#160b05'], [1, '#050302']]); ctx.fillRect(-100, 1185, W + 200, H);
    ctx.fillStyle = 'rgba(122,44,30,.55)'; ctx.beginPath(); ctx.ellipse(420, 1210, 300, 34, 0, 0, TAU); ctx.fill();
    seated(360, 1220, 1.15, { hat: 'kece', beard: true, rim: 'rgba(255,170,80,.55)' });
    ctx.save(); ctx.translate(660, 1196); ctx.rotate(-.05); ctx.fillStyle = '#d9c39a'; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(0, -10); ctx.lineTo(60, 0); ctx.lineTo(60, 8); ctx.lineTo(0, -2); ctx.lineTo(-60, 8); ctx.closePath(); ctx.fill(); ctx.restore();
    candle(560, 1205, 1.25, t, 1, 2);
    ctx.restore();
    kinetic('EDEBALİ', W / 2, 470, 110, t, te - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6, out: C('p8.end+0.6') });
    kinetic('ŞEYH · BİLECİK', W / 2, 572, 32, t, te + .4, { mode: 'fade', fam: F.mont, w: 900, spacing: 8, col: '#fff3dc', out: C('p8.end+0.6') });
  },
};

/* ---------- komşu hisarlar katmanı (komsu + karacahisar ortak) ---------- */
function komsuKatman(t, cam, o) {
  const sc = .03 * cam[2], s0 = W2S(cam, ...CITY['Söğüt']);
  const H_ = [['BİLECİK', CITY['Bilecik'], [0, -78]], ['İNEGÖL', INEGOL, [0, 52]], ['KARACAHİSAR', KARACA, [0, 52]]];
  if (o.links > 0) H_.forEach(([, p], i) => { const [x, y] = W2S(cam, ...p); ctx.save(); ctx.globalAlpha = o.links * (.75 + .25 * Math.sin(t * 3 + i)); ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 30;
    ctx.beginPath(); ctx.moveTo(...s0); ctx.lineTo(x, y - 10); ctx.stroke(); ctx.restore(); });
  H_.forEach(([n, p, off], i) => {
    const a = o.tb < 0 ? 1 : clamp(spring(t, o.tb + i * .25, { freq: 1.8, damp: .6 }), 0, 1.15), [x, y] = W2S(cam, ...p); if (a <= 0) return;
    const red = i === 2 ? o.kc : 0, wob = (o.wob || 0) * Math.sin(t * 9 + i * 2) * .07, pul = o.th > 0 ? 1 + .12 * hitPulse(t, o.th + i * .12, .6) : 1;
    ctx.save(); ctx.translate(x, y); ctx.rotate(wob); ctx.scale(a * pul, a * pul); ctx.translate(-x, -y);
    hisarIsaret(x, y, sc, mix('#3b2a55', '#5a1410', red), 1, red > .5 ? 'rgba(255,120,90,.45)' : 'rgba(170,130,230,.4)'); ctx.restore();
    const ea = clamp(a) * (i === 2 ? (o.karaEtiket ?? 1) : 1) * seg(x, 110, 170) * (1 - seg(x, 880, 940));
    ekranEtiket(n, x + off[0], y + off[1], 24, ea, { sp: 3 });
  });
  ownCity(cam, 'Söğüt', 1284, { text: 'SÖĞÜT', size: 28, r: 9 });
}

/* ---------- kervan: gidişte yükler hisara emanet, dönüşte armağan (RİVAYET) ---------- */
function kervan(t, s, mode) {
  const tE = C('p6:emanet'), tY = C('p6:yüklerini'), tB = C('p6:Bilecik'), tA = C('p6:armağanlar');
  const z = lerp(1, 1.06, eIO(seg(t, s.t0, s.t1)));
  ctx.fillStyle = mode ? lg(0, 0, 0, 1150, [[0, '#28283e'], [.5, '#6a4c50'], [.8, '#c98a58'], [1, '#eab878']]) : lg(0, 0, 0, 1150, [[0, '#15112a'], [.5, '#3e2444'], [.8, '#a2584a'], [1, '#d89068']]);
  ctx.fillRect(0, 0, W, H);
  if (!mode) { stars(t, .5); crescentMoon(260, 560, 30); } else glow(220, 980, 420, 'rgba(255,200,120,.35)');
  ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
  sirt(1010, 110, mode ? '#4a3036' : '#2a1a2c', 3.3, .004);
  // Bilecik hisarı ve kapı ışığı
  castle(800, 960, .8, mode ? '#1c1014' : '#120a12');
  const gate = (mode ? .8 : .55 + .45 * seg(t, tE - .8, tE)) * (.9 + .1 * Math.sin(t * 7));
  glow(800, 935, 160 * gate, 'rgba(255,170,80,.55)'); ctx.fillStyle = `rgba(255,196,120,${.9 * gate})`; ctx.beginPath(); ctx.moveTo(782, 962); ctx.lineTo(782, 930); ctx.quadraticCurveTo(800, 908, 818, 930); ctx.lineTo(818, 962); ctx.fill();
  // yol: önden hisar kapısına
  const P0 = [70, 1420], P1 = [300, 1060], P2 = [790, 968], RP = u => { const v = 1 - u; return [v * v * P0[0] + 2 * v * u * P1[0] + u * u * P2[0], v * v * P0[1] + 2 * v * u * P1[1] + u * u * P2[1]]; };
  ctx.fillStyle = mode ? 'rgba(150,110,80,.55)' : 'rgba(110,74,70,.55)'; ctx.beginPath();
  for (let i = 0; i <= 30; i++) { const u = i / 30, [x, y] = RP(u), w = lerp(150, 10, u); ctx.lineTo(x - w * .3, y + w * .45); }
  for (let i = 30; i >= 0; i--) { const u = i / 30, [x, y] = RP(u), w = lerp(150, 10, u); ctx.lineTo(x + w * .3, y - w * .45); }
  ctx.closePath(); ctx.fill();
  // kapıdaki emanet yükleri
  const pk = mode ? 1 : clamp(spring(t, tE - .1, { freq: 1.6, damp: .65 }), 0, 1.1);
  if (pk > 0) { ctx.save(); ctx.translate(745, 968); ctx.scale(pk, pk); [[-20, 0], [12, 0], [-4, -16]].forEach(([x, y], i) => emanetYuk(x, y, .42, { dark: .25, rot: (i - 1) * .06 })); ctx.restore();
    if (!mode) { const hp = hitPulse(t, tE, 1.2); if (hp > 0) glow(745, 960, 220 * hp, 'rgba(255,210,140,.8)'); } }
  // kervan: atlar ve yayalar yol boyunca
  const base = mode ? lerp(.05, .72, eIO(seg(t, s.t0 - .3, s.t1 + .4))) : lerp(.12, .86, eIO(seg(t, s.t0 - .6, tE + .2)));
  const ROLE = ['at', 'yaya', 'at', 'at', 'yaya'];
  for (let i = ROLE.length - 1; i >= 0; i--) {
    const u = base - i * .085; if (u < 0 || u > .97) continue; const [x, y] = RP(u), sc = lerp(1.0, .17, Math.pow(u, .85));
    const fade = !mode ? 1 - seg(u, .88, .96) : 1, rim = mode ? 'rgba(255,200,120,.5)' : 'rgba(255,150,110,.45)';
    ctx.save(); ctx.globalAlpha = fade;
    if (ROLE[i] === 'at') yukluAt(x, y, sc * .95, t, { ph: i * .21, rim, load: !mode, dark: .2 });
    else yaya(x, y, sc * .95, t, { ph: i * .3, rim, carry: !!mode, dark: .1 });
    ctx.restore();
  }
  if (mode) { const ga = seg(t, tA - .2, tA + .4); if (ga > 0) { const u = base - .085, [x, y] = RP(Math.max(0, u)), sc = lerp(1.0, .17, Math.pow(Math.max(0, u), .85)); glow(x + 46 * sc, y - 120 * sc, 160 * sc + 40, 'rgba(255,214,130,.7)', ga); } }
  ctx.restore();
  ctx.fillStyle = lg(0, 1300, 0, H, [[0, 'rgba(8,4,6,0)'], [.3, '#080406']]); ctx.fillRect(0, 1300, W, H - 1300);
  if (mode) suzulen(t, 26, 17, { speed: 45, r: 4, a: .7, leaf: true, col: '#c9802e', drift: 14 });
  if (!mode) kinetic('BİLECİK HİSARI', 740, 770, 30, t, tB, { mode: 'fade', fam: F.mont, w: 900, spacing: 6, col: 'rgba(255,240,220,.95)', stroke: false });
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .22; ctx.fillStyle = '#9a2a3a'; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// duvardaki silahlı adam gölgesi (önsezi; rivayet)
function golgeAdam(x, y, h, a, i) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#080302'; ctx.strokeStyle = '#080302'; ctx.translate(x, y); const k = h / 330; ctx.scale(k * (1 + i * .04), k);
  ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(-36, -190); ctx.quadraticCurveTo(0, -216, 36, -190); ctx.lineTo(44, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -238, 23, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-26, -242); ctx.lineTo(0, -292); ctx.lineTo(26, -242); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(52, 10); ctx.lineTo(64, -390); ctx.stroke(); ctx.beginPath(); ctx.moveTo(66, -420); ctx.lineTo(56, -386); ctx.lineTo(74, -386); ctx.closePath(); ctx.fill();
  ctx.restore();
}
