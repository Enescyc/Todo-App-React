/* Sezon 1 · Bölüm 1 sahneleri: Kimsenin Yazmadığı Başlangıç. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js */
'use strict';
const C = cue;
const A = (n, d) => { const p = CITY[n]; return [p[0] + (d?.[0] || 0), p[1] + (d?.[1] || 0)]; };
const MONGOL = '#3a342c', SELC = '#3f7f7a';
function darkDesk() { ctx.fillStyle = rg(W / 2, H * .45, 100, H * .85, [[0, '#2e1f12'], [1, '#090604']]); ctx.fillRect(0, 0, W, H); }
// harita kamerası: anahtar karelerle [t, x, y, z]
const camAt = (keys, t) => camPath(keys, t, { creep: .008 });   // monoton kübik + log-zoom + saniyede %0.8 itme

window.SCENE_FNS = {
  /* "Altı yüz yılı aşkın süre ayakta kalan bir imparatorluğun nasıl kurulduğunu, aslında kimse yazmadı." */
  cold(t, s) {
    darkDesk(); embers(t, .25, 8);
    const tk = C('p1:kurulduğunu'), ta = C('p1:ayakta');
    timeline(t, { from: 1280, to: 1940, step: 100, y: 1010, k: seg(t, s.t0 + .2, ta + .6),
      marks: [[1299, '?', 'BAŞLANGIÇ', tk], [1922, '1922', 'SON', ta + .4]] });
    kinetic('600+ YIL', W / 2, 640, 150, t, C('p1:Altı') + .1, { mode: 'slam', fam: F.anton, col: '#f4ead2', out: C('p1:kimse') });
    const q = hitPulse(t, tk, 1.2); if (q > 0) glow(110 + (1299 - 1280) / 660 * 860, 1010, 260 * q, 'rgba(255,120,80,.8)');
  },
  /* "Hikâye, 1243'te, Sivas ile Erzincan arasındaki Kösedağ'da başlar." */
  kosedag(t, s) {
    const tk = C("p2:Kösedağ'da"), cam = camAt([[s.t0, 900, 40, .7], [tk, 810, 20, 1.1], [s.t1, 800, 20, 1.12]], t), Y = 1243.3;
    drawTimeMap(t, cam, Y, { focus: 'SEL', dim: .3 });
    const la = seg(t, s.t0, s.t0 + .6); mapLabel(cam, 'SELÇUKLU', ...LL(35.6, 39.0), 46, { a: la }); mapLabel(cam, 'MOĞOLLAR', ...LL(42.2, 39.35), 44, { a: la });
    ownCity(cam, 'Sivas', Y, { a: seg(t, C('p2:Sivas'), C('p2:Sivas') + .3), size: 30 });
    ownCity(cam, 'Erzincan', Y, { a: seg(t, C('p2:Erzincan'), C('p2:Erzincan') + .3), size: 30 });
    arrow(cam, [CITY['Tebriz'], LL(43.0, 39.8), LL(41.3, 39.95), A('Kösedağ', [40, 0])], eIO(seg(t, s.t0 + .2, tk + .3)), 34, MONGOL, { col0: '#6b6458' });
    arrow(cam, [LL(43.1, 40.9), LL(41.2, 40.4), A('Kösedağ', [30, -25])], eIO(seg(t, s.t0 + .6, tk + .5)), 26, MONGOL, { col0: '#6b6458' });
    arrow(cam, [CITY['Konya'], A('Kayseri'), A('Sivas', [20, 0]), A('Kösedağ', [-40, 10])], eIO(seg(t, s.t0 + .3, tk + .2)), 30, SELC, { col0: '#5aa19a' });
    mapPin(cam, ...CITY['Kösedağ'], t, tk - .1, 'KÖSEDAĞ', { date: '26 HAZİRAN 1243', left: true });
  },
  /* "Moğollar Selçuklu ordusunu yener ve Anadolu Selçuklu Devleti vergi ödeyen bir tabi devlete dönüşür." */
  tabi(t, s) {
    const ty = C('p2:yener'), tv = C('p2:vergi'), tt = C('p2:tabi');
    const cam = camAt([[s.t0, 800, 20, 1.12], [ty + .4, 700, 30, 1.0], [tv, 470, 90, .64], [s.t1, 450, 90, .62]], t);
    const Y = lerp(1243.3, 1243.85, eIO(seg(t, tt - .3, tt + .5)));
    drawTimeMap(t, cam, Y, { focus: 'SEL', dim: .3 });
    mapLabel(cam, 'SELÇUKLU', ...LL(33.0, 38.7), 48, {}); mapLabel(cam, 'MOĞOLLAR', ...LL(42.2, 39.35), 44, { a: 1 - seg(t, ty, ty + .6) }); mapLabel(cam, 'BİZANS', ...LL(28.3, 39.2), 40, { a: seg(t, tv, tv + .5) });
    const brk = seg(t, ty, ty + .5);
    ctx.save(); ctx.globalAlpha = 1 - brk; arrow(cam, [CITY['Konya'], A('Kayseri'), A('Sivas', [20, 0]), A('Kösedağ', [-40, 10])], 1, 30, SELC); ctx.restore();
    arrow(cam, [CITY['Tebriz'], LL(43.0, 39.8), LL(41.3, 39.95), A('Kösedağ', [40, 0])], 1, 34 + 10 * brk, MONGOL, { col0: '#6b6458' });
    const [kx, ky] = W2S(cam, ...CITY['Kösedağ']); cracks(kx, ky, brk, 4, { n: 6, len: 320 });
    flowDots(cam, [CITY['Konya'], A('Kayseri'), A('Sivas'), A('Erzincan'), LL(43.5, 39.4), CITY['Tebriz']], t, seg(t, tv, tv + .5), { n: 14, speed: .3 });
    const [lx, ly] = W2S(cam, ...LL(33.0, 38.7));
    kinetic('MOĞOLLARA TABİ', lx, ly + 70, 44, t, tt, { mode: 'slam', fam: F.cinzel, w: 900, col: '#fff' });
  },
  /* "Merkez zayıfladıkça, batıdaki sınır bölgelerinde, yani uçlarda, küçük beylikler ortaya çıkar." */
  uclar(t, s) {
    const tu = C('p2:uçlarda'), tb = C('p2:beylikler');
    const cam = camAt([[s.t0, 450, 90, .62], [tu, 210, 110, .78], [s.t1, 180, 115, .82]], t);
    const Y = lerp(1250, 1312, eIO(seg(t, tu - .3, s.t1 - .2)));
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: 0 });
    glowPath(cam, [LL(34.0, 41.6), LL(32.3, 41.0), LL(31.4, 40.6), LL(30.5, 40.15), LL(29.9, 39.6), LL(29.3, 38.9), LL(29.0, 38.0), LL(28.4, 37.2)], t, eIO(seg(t, tu - .1, tu + .8)), { w: 12, dash: true, a: 1 - seg(t, s.t1 - .6, s.t1) * .5 });
    const [ux, uy] = W2S(cam, ...LL(29.2, 38.7));
    kinetic('UÇLAR', ux - 120, uy, 56, t, tu, { mode: 'slam', fam: F.cinzel, w: 900, col: '#fff3c8' });
    ownerLabels(cam, Y, { only: ['GER', 'KRS', 'SAR', 'AYD', 'MEN', 'HAM', 'KRM', 'CAN', 'BIZ', 'ORT'], a: seg(t, tb - .1, tb + .5), minArea: 3000, size: [20, 40] });
    yearTicker(W / 2, 430, Y, 110, { approx: true });
  },
  /* "Bunlardan biri, Bizans sınırında, Söğüt çevresindeki küçük bir topluluktur." */
  sogut(t, s) {
    const ts = C('p3:Söğüt'), tb = C('p3:Bizans');
    const cam = camAt([[s.t0, 180, 115, .82], [ts, 105, 45, 2.0], [s.t1, 100, 45, 2.3]], t), Y = 1300.4;
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    const lb = seg(t, tb, tb + .4); if (lb > 0) mapLabel(cam, 'BİZANS', ...LL(29.75, 40.78), 52, { a: lb });
    const le = seg(t, ts + .3, ts + .8); if (le > 0) mapLabel(cam, 'SELÇUKLU · İLHANLI', ...LL(31.7, 39.6), 32, { a: le, sp: 3 });
    ownCity(cam, 'Bursa', Y, { a: lb, size: 28 }); ownCity(cam, 'İznik', Y, { a: lb, size: 28 }); ownCity(cam, 'İzmit', Y, { a: lb, size: 28 });
    const p = W2S(cam, ...CITY['Söğüt']), pa = seg(t, ts, ts + .5);
    if (pa > 0) { glow(p[0], p[1], 260, `rgba(255,120,70,${.6 * pa})`); for (let i = 0; i < 3; i++) { const r = fract((t - ts) * .8 + i / 3); ctx.strokeStyle = `rgba(255,214,140,${pa * (1 - r)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 24 + r * 170, 0, TAU); ctx.stroke(); } }
    const tt = C('p3:topluluktur'); for (let i = 0; i < 5; i++) { const a = eBack(seg(t, tt + i * .08, tt + i * .08 + .3)); if (a > 0) { const [x, y] = W2S(cam, ...LL(30.18 + [-.12, .1, -.03, .16, -.18][i], 40.02 + [.06, .05, -.04, -.03, -.06][i])); ctx.save(); ctx.globalAlpha = clamp(a); tent(x, y, .1 * a, t, { door: null, smoke: false }); ctx.restore(); } }
    mapPin(cam, ...CITY['Söğüt'], t, ts - .05, 'SÖĞÜT', { date: '~1300' });
  },
  /* "Liderinin adı Osman'dır." */
  osman(t, s) {
    const k = seg(t, s.t0, s.t1 + 2);
    skyLand(t, { k: .55, sun: true });
    tent(300, 1230, .7, t, {}); pennant(470, 1240, .9, t, {});
    for (let i = 0; i < 3; i++) rider(lerp(-200, 1300, ((t - s.t0) * .09 + i * .12) % 1.2), 1300 + i * 14, .55, t, { ph: i * .3, sil: '#0b0705', flag: i === 0 ? '#a8322a' : null });
    ctx.fillStyle = lg(0, 1260, 0, H, [[0, 'rgba(8,5,3,0)'], [.25, '#080503']]); ctx.fillRect(0, 1260, W, H - 1260);
    const to = C("p3:Osman'dır");
    kinetic('OSMAN', W / 2, 560 - k * 20, 170, t, to - .1, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 8 });
    kinetic('SÖĞÜT · ~1300', W / 2, 690 - k * 20, 34, t, to + .4, { mode: 'fade', fam: F.mont, w: 900, spacing: 10, col: 'rgba(255,240,215,.9)', stroke: false });
  },
  /* "Ama Osman döneminden kalma tek bir Osmanlı belgesi yoktur." */
  arsiv(t, s) {
    emptyArchive(t, { zoom: lerp(1, 1.18, eIO(seg(t, s.t0, s.t1))) });
    const tt = C('p4:tek');
    ctx.save(); ctx.globalAlpha = seg(t, tt, tt + .4); ctx.fillStyle = 'rgba(255,220,150,.9)'; ctx.fillRect(W / 2 - 150, 905, 300, 48);
    setFont(26, F.mont, 900); ctx.letterSpacing = '3px'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('OSMAN DÖNEMİ', W / 2, 930); ctx.restore();
    stamp('BELGE YOK', W / 2, 720, 92, t, C('p4:yoktur'), '#c0392b', -.1);
  },
  /* "İlk Osmanlı tarihleri ancak yüz yıl ve daha sonra yazılacaktır." */
  bosluk(t, s) {
    darkDesk();
    const ty = C('p4:yüz');
    timeline(t, { from: 1280, to: 1520, step: 50, y: 1000, k: seg(t, s.t0, s.t0 + .8),
      marks: [[1324, 'OSMAN', 'ö. ~1324', s.t0 + .3], [1410, 'İLK KRONİKLER', '15. YÜZYIL', C('p4:tarihleri')], [1484, 'ÂŞIKPAŞAZÂDE', '~1480', C('p4:sonra')]],
      gap: [1324, 1410, '~100 YIL'], gapK: seg(t, ty - .1, ty + 1.0) });
    kinetic('KURULUŞ ANLATILARI', W / 2, 520, 56, t, s.t0 + .2, { mode: 'fade', fam: F.cinzel, w: 900, col: '#f4ead2' });
    kinetic('SONRADAN YAZILDI', W / 2, 590, 40, t, s.t0 + .5, { mode: 'fade', fam: F.mont, w: 900, col: GOLD, spacing: 6, stroke: false });
  },
  /* "Bugün elimizdeki en somut iz, küçük bir sikkedir. Üzerinde, okunabildiği kadarıyla, Ertuğrul oğlu Osman yazar." */
  sikke(t, s) {
    ctx.fillStyle = rg(W / 2, 820, 50, 1100, [[0, '#4a1a16'], [.6, '#22100c'], [1, '#080403']]); ctx.fillRect(0, 0, W, H);
    smokeLayer(t, .35, '#3a1a14', 12);
    const ts = C('p5:sikkedir'), to = C('p5:okunabildiği'), te = C('p5:Ertuğrul');
    const enter = eOut(seg(t, s.t0 + .1, ts + .2)), flip = Math.cos((1 - enter) * Math.PI * 2.5);
    glow(W / 2, 760, 520, `rgba(255,210,150,${.25 * enter})`);
    ctx.save(); ctx.globalAlpha = clamp(enter * 2); coin(W / 2, 760 + (1 - enter) * 200, 280, t, { flip, shine: ((t - ts) / 2.6) % 1.4 - .2, seed: 1299 }); ctx.restore();
    const sc = seg(t, to, te + .2); if (sc > 0 && sc < 1) { const yy = lerp(480, 1040, sc); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg(0, yy - 30, 0, yy + 30, [[0, 'rgba(255,230,160,0)'], [.5, 'rgba(255,230,160,.5)'], [1, 'rgba(255,230,160,0)']]); ctx.fillRect(W / 2 - 300, yy - 30, 600, 60); ctx.restore(); }
    kinetic('OSMAN BİN ERTUĞRUL', W / 2, 1120, 58, t, te, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 3 });
    kinetic('“Ertuğrul oğlu Osman”', W / 2, 1190, 36, t, te + .5, { mode: 'fade', fam: F.mont, w: 800, col: 'rgba(255,240,215,.9)', stroke: false });
    ctx.save(); ctx.globalAlpha = seg(t, ts + .3, ts + .8) * .8; setFont(22, F.mont, 800); ctx.letterSpacing = '3px'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,240,215,.75)';
    ctx.fillText('GÜMÜŞ SİKKE · 1977\'DE YAYIMLANDI (İ. ARTUK)', W / 2, 410); ctx.restore();
  },
  /* "Peki Osman'ı o yıllarda görüp kaydeden biri var mıydı? Vardı." */
  tanik(t, s) {
    const tv = C('p6:Vardı'), cam = camAt([[s.t0, 60, 10, 1.25], [tv, 20, -20, 1.4], [s.t1, 10, -25, 1.45]], t), Y = 1301;
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .3 });
    mapLabel(cam, 'BİZANS', ...LL(29.6, 40.85), 50, { a: .9 });
    ownCity(cam, 'Konstantinopolis', Y, { size: 28 }); ownCity(cam, 'İzmit', Y, { size: 28 }); ownCity(cam, 'Bursa', Y, { size: 28 });
    mapPin(cam, ...CITY['Söğüt'], t, s.t0, 'OSMAN', { date: '~1300' });
    const [qx, qy] = W2S(cam, ...LL(29.4, 39.3)), qa = seg(t, s.t0 + .3, s.t0 + .7) * (1 - seg(t, tv, tv + .3));
    ctx.save(); ctx.globalAlpha = qa; title('?', qx, qy + Math.sin(t * 3) * 8, 220, { fam: F.cinzel, w: 900, gold: true }); ctx.restore();
    const [cx, cy] = W2S(cam, ...CITY['Konstantinopolis']), va = hitPulse(t, tv, 1.4); if (va > 0) glow(cx, cy, 360 * va, 'rgba(190,150,255,.8)');
    kinetic('VARDI.', W / 2, 520, 120, t, tv, { mode: 'slam', fam: F.anton, col: '#f4ead2' });
  },
  /* "Ama o kişi bir Türk değil, bir Bizanslıydı." */
  bizansli(t, s) {
    ctx.fillStyle = rg(W * .45, H * .55, 50, H * .8, [[0, '#5a3a1e'], [.45, '#2a1a0e'], [1, '#060403']]); ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = rg(330, 980, 20, 520, [[0, 'rgba(255,190,110,.55)'], [1, 'rgba(255,190,110,0)']]); ctx.fillRect(0, 400, W, 1200);
    scribe(330, 1360, 1.05, t, { write: true });
    parchment(760, 900, 520, 640, { rot: .05, seed: 1302 });
    inkScript(560, 700, 400, 7, t, s.t0 + .2, 4.5, { style: 'greek', lh: 62, seed: 6 });
    const tb = C('p6:Bizanslıydı');
    kinetic('BİZANSLI', W / 2, 400, 110, t, tb - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6 });
    kinetic('BİR TARİHÇİ', W / 2, 500, 44, t, tb + .4, { mode: 'fade', fam: F.mont, w: 900, spacing: 12, col: 'rgba(255,240,215,.9)', stroke: false });
  },
};
