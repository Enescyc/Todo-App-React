/* Sezon 1 · Fragman sahneleri. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js */
'use strict';
const C = cue;
const A = (n, i) => { const p = CITY[n]; return [p[0] + (i?.[0] || 0), p[1] + (i?.[1] || 0)]; };
// sırtta ordugâh: çadırlar, sancaklar, tuğlar (siluet)
function camp(t, k, sil) {
  const R = rng(14);
  for (let i = 0; i < 9; i++) { const x = 60 + i * 120 + R() * 40, y = 1190 + Math.sin(i * 1.3) * 22; tent(x, y, .32 + R() * .1, t, { sil, door: k > .4 ? null : undefined, smoke: i % 3 === 0 }); }
  for (let i = 0; i < 14; i++) { const x = 30 + i * 78 + R() * 30, y = 1215 + Math.sin(i) * 20; pennant(x, y, .45 + R() * .2, t + i * .3, { sil }); }
  tug(250, 1240, .42, t, { sil }); tug(820, 1235, .46, t + 1, { sil });
}

window.SCENE_FNS = {
  /* "Bir sabah, bir imparatorluk vardı." – şafakta Çubuk Ovası */
  dawn(t, s) {
    const k = seg(t, s.t0, s.t1 + 1), z = 1 + .05 * k;
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    skyLand(t, { k: lerp(.25, .75, k) });
    camp(t, k, '#0d0906');
    ctx.restore();
    smokeLayer(t, .5, '#3a3028');
    ctx.save(); ctx.globalAlpha = seg(t, s.t0 + .3, s.t0 + 1.2) * (1 - seg(t, s.t1 - .4, s.t1));
    setFont(30, F.mont, 900); ctx.letterSpacing = '8px'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,236,200,.9)'; ctx.fillText('ÇUBUK OVASI · ANKARA', W / 2, 420);
    setFont(26, F.mont, 800); ctx.fillStyle = 'rgba(255,236,200,.6)'; ctx.fillText('TEMMUZ 1402', W / 2, 466); ctx.restore();
  },
  /* "Balkanlar'dan Fırat'a uzanan topraklar, yenilmez sanılan bir ordu" – 1402'de zirve */
  empire(t, s) {
    const k = seg(t, s.t0, s.t1), cam = [lerp(130, 110, k), lerp(20, 30, k), lerp(.58, .63, eIO(k))], Y = 1402.4;
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .45 });
    const tb = C("p1:Balkanlar'dan"), tf = C("p1:Fırat'a"), to = C('p1:yenilmez');
    riverGlow(cam, 'Tuna', seg(t, tb, tb + .4) * (1 - .5 * seg(t, tf, tf + .4)));
    riverGlow(cam, 'Fırat', seg(t, tf, tf + .4));
    ownerLabels(cam, Y, { only: ['OSM', 'TIM', 'BIZ'], a: seg(t, s.t0, s.t0 + .6), offset: { OSM: [-60, -40] } });
    const [bx, by] = W2S(cam, ...LL(24.2, 43.9)), [fx, fy] = W2S(cam, ...LL(39.0, 37.6));
    kinetic('BALKANLAR', bx, by - 70, 50, t, tb, { mode: 'slam', fam: F.cinzel, w: 900, col: '#fff' });
    kinetic('FIRAT', fx + 20, fy + 70, 50, t, tf, { mode: 'slam', fam: F.cinzel, w: 900, col: '#fff' });
    // ordu: Bursa'dan Ankara'ya
    arrow(cam, [A('Edirne'), A('Bursa', [0, 20]), LL(31.0, 40.2), A('Ankara', [-10, 0])], eIO(seg(t, to - .2, to + 1.1)), 26, '#a8322a', { col0: '#d0574a' });
    ownCity(cam, 'Ankara', Y, { r: 7, size: 26 });
  },
  /* "ve Yıldırım lakaplı bir sultan." – tuğ ve şimşek */
  sultan(t, s) {
    const fl = hitPulse(t, C('p1:Yıldırım'), .5);
    ctx.fillStyle = lg(0, 0, 0, H, [[0, mix('#0d0f1c', '#6b7aa8', fl)], [.6, '#120c10'], [1, '#050302']]); ctx.fillRect(0, 0, W, H);
    smokeLayer(t, .7, '#1a1620', 8);
    if (fl > 0) { ctx.save(); ctx.strokeStyle = `rgba(230,240,255,${fl})`; ctx.lineWidth = 6; ctx.shadowColor = '#bcd'; ctx.shadowBlur = 30; const R = rng(4); let x = 700, y = 0; ctx.beginPath(); ctx.moveTo(x, y); while (y < 700) { x += (R() - .55) * 90; y += 60 + R() * 40; ctx.lineTo(x, y); } ctx.stroke(); ctx.restore(); }
    glow(W / 2, 520, 420, 'rgba(255,190,90,.25)');
    tug(W / 2, 1420, 1.75, t, { fall: 0 });
    ctx.fillStyle = lg(0, 1250, 0, H, [[0, 'rgba(5,3,2,0)'], [.3, '#050302']]); ctx.fillRect(0, 1250, W, H - 1250);
    kinetic('I. BAYEZİD', W / 2, 360, 92, t, C('p1:Yıldırım') - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 4 });
    kinetic('“YILDIRIM”', W / 2, 470, 54, t, C('p1:lakaplı'), { mode: 'fade', fam: F.mont, w: 900, col: '#e8e2ff', spacing: 10, stroke: false });
  },
  /* "Bir gün içinde ordu dağıldı, sultan esir düştü." – Timur'un yürüyüşü, çöküş */
  collapse(t, s) {
    const td = C('p2:dağıldı'), te = C('p2:esir'), Y = lerp(1402.45, 1403.0, eIO(seg(t, td + .2, s.t1 - .1)));
    const cam = [lerp(560, 420, eIO(seg(t, s.t0, s.t1))), 60, .62];
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .35 });
    ownerLabels(cam, Y, { only: ['OSM', 'TIM', 'KRM', 'GER', 'AYD', 'SAR', 'MEN', 'CAN'], a: .9 });
    arrow(cam, [LL(41.2, 39.9), A('Sivas'), A('Kayseri', [0, -20]), LL(34.2, 39.4), A('Ankara', [30, 10])], eIO(seg(t, s.t0, td)), 30, '#2e3a2c', { col0: '#55644f', edge: '#0b0f0a' });
    const red = 1 - seg(t, td, td + .5);
    if (red > 0) { ctx.save(); ctx.globalAlpha = red; arrow(cam, [A('Bursa', [0, 20]), LL(31.0, 40.2), A('Ankara', [-30, 0])], 1, 26, '#a8322a'); ctx.restore(); }
    const [ax, ay] = W2S(cam, ...CITY['Ankara']);
    cracks(ax, ay, seg(t, td, td + .6), 21, { len: 700 });
    glow(ax, ay, 260 * hitPulse(t, td, .8), 'rgba(255,170,80,.9)');
    mapPin(cam, ...CITY['Ankara'], t, s.t0 + .2, 'ANKARA', { date: 'TEMMUZ 1402', left: true });
    const tf = seg(t, te, te + .8); if (t > te - .1) { ctx.save(); ctx.globalAlpha = 1 - seg(t, te + 1.2, te + 1.6); tug(ax + 60, ay - 40, .32, t, { fall: tf, dir: 1 }); ctx.restore(); }
  },
  /* "Ankara, bin dört yüz iki." */
  ankara(t, s) {
    skyLand(t, { k: .12, sun: false });
    ctx.save(); ctx.globalAlpha = .9; const R = rng(2);
    for (let i = 0; i < 9; i++) { const x = 80 + i * 120 + R() * 30, y = 1240 + R() * 40; ctx.save(); ctx.translate(x, y); ctx.rotate((R() - .5) * 1.6); pennant(0, 0, .4, t, { sil: '#0b0705' }); ctx.restore(); }
    tug(560, 1300, .6, t, { fall: 1, dir: -1, sil: '#0b0705' }); ctx.restore();
    smokeLayer(t, 1, '#2a2018', 3); embers(t, .9);
    const t0 = C('p2:Ankara');
    kinetic('ANKARA', W / 2, 720, 190, t, t0 - .05, { mode: 'slam', fam: F.anton, col: '#f4ead2' });
    kinetic('1402', W / 2, 880, 120, t, C('p2:bin'), { mode: 'slam', fam: F.cinzel, w: 900, gold: true, spacing: 8 });
  },
  /* "Peki bu devlet, nasıl olmuştu da yüz yıl önce ... bir sınır beyliğinden buraya gelmişti?" – geri sarma */
  rewind(t, s) {
    const ts = C('p3:sınır'), kr = eIO(seg(t, s.t0 + .1, ts)), Y = lerp(1403, 1300, kr);
    const cam = [lerp(300, 100, eIO(seg(t, ts - 1.2, ts + .4))), lerp(-40, 48, eIO(seg(t, ts - 1.2, ts + .4))), lerp(.42, 2.4, eIO(seg(t, ts - 1.4, ts + .6)))];
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .5 });
    if (kr < .98) ownerLabels(cam, Y, { only: ['OSM'], a: .8 });
    const lk = seg(t, ts + .2, ts + .8); if (lk > 0) { mapLabel(cam, 'BİZANS', ...LL(29.3, 40.35), 46, { a: lk }); mapLabel(cam, 'SELÇUKLU · MOĞOL TABİİYETİ', ...LL(31.6, 39.55), 30, { a: lk, sp: 3 }); }
    const p = W2S(cam, ...CITY['Söğüt']), pa = seg(t, ts - .2, ts + .4);
    if (pa > 0) { glow(p[0], p[1], 220, `rgba(255,120,70,${.7 * pa})`); for (let i = 0; i < 3; i++) { const r = ((t - ts) * .9 + i / 3) % 1; ctx.strokeStyle = `rgba(255,214,140,${pa * (1 - r)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 20 + r * 160, 0, TAU); ctx.stroke(); } }
    mapPin(cam, ...CITY['Söğüt'], t, ts, 'SÖĞÜT', { date: '~1300' });
    rewindFX(t, (1 - seg(t, ts - .4, ts)) * seg(t, s.t0, s.t0 + .3));
    yearTicker(W / 2, 330, Y, 130, { a: 1 - seg(t, ts + .6, ts + 1.2) });
  },
  /* "Ve neden, bütün bu hikâyenin başını, kimse yazmamıştı?" – boş parşömen, mürekkep damlası, sezon kartı */
  blank(t, s) {
    ctx.fillStyle = rg(W / 2, H * .45, 100, H * .8, [[0, '#3a2716'], [1, '#0d0805']]); ctx.fillRect(0, 0, W, H);
    const k = eOut(seg(t, s.t0, s.t0 + 1)) * (1 - seg(t, C('p3.end+0.5'), C('p3.end+1.2')));
    if (k <= 0) return;
    parchment(W / 2, 880 + (1 - k) * 60, 760, 980, { a: k, rot: -.02, seed: 1243 });
    const tk = C('p3:kimse');
    ctx.save(); ctx.globalAlpha = k; inkDrop(W / 2 + 40, 860, t, tk - .05, { r: 110 }); ctx.restore();
    ctx.save(); ctx.globalAlpha = k * (1 - seg(t, tk - .3, tk)); ctx.strokeStyle = 'rgba(60,40,20,.25)'; ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2 - 320, 520 + i * 64); ctx.lineTo(W / 2 + 320, 520 + i * 64); ctx.stroke(); } ctx.restore();
  },
};
