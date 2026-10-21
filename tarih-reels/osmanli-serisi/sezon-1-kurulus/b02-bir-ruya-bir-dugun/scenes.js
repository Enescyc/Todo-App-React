/* Sezon 1 · Bölüm 2 sahneleri: Bir Rüya, Bir Düğün. Çapalar: timeline.js · araçlar: shared/engine.js + osmanli-serisi/ortak/gorsel.js
 * Portre yok: kişiler siluetle. Rüya ve düğün RİVAYET (FACTS.md #1–#3, #10–#11). */
'use strict';
const C = cue;
const A = (n, d) => { const p = CITY[n]; return [p[0] + (d?.[0] || 0), p[1] + (d?.[1] || 0)]; };
const camAt = (keys, t) => camPath(keys, t, { creep: .008 });   // monoton kübik + log-zoom + saniyede %0.8 itme
const RIM = 'rgba(242,199,92,.55)';

/* ---------- bölüme özel çizimler ---------- */
function darkDesk() { ctx.fillStyle = rg(W / 2, H * .45, 100, H * .85, [[0, '#2e1f12'], [1, '#090604']]); ctx.fillRect(0, 0, W, H); }
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
// altın ağaç mühürü: k 0..1 basılma
function agacMuhur(x, y, r, t, k) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); const sc = lerp(2.6, 1, eOut(k)); ctx.scale(sc, sc); ctx.rotate(-.06); ctx.globalAlpha = clamp(k * 3);
  ctx.fillStyle = rg(-r * .3, -r * .35, r * .1, r * 1.05, [[0, '#fff0b8'], [.5, '#e2ae4a'], [1, '#8a5e16']]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#5a3a0c'; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(0, 0, r * .9, 0, TAU); ctx.stroke(); ctx.lineWidth = r * .02; ctx.beginPath(); ctx.arc(0, 0, r * .74, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#5a3a0c'; for (let i = 0; i < 36; i++) { const a = i / 36 * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .82, Math.sin(a) * r * .82, r * .022, 0, TAU); ctx.fill(); }
  miniTree(0, r * .6, r * 1.1 / 330, 1, t, { col: '#6a1c12', leaves: false });
  ctx.restore();
}
// mürekkep kaplaması: bir dikdörtgeni soğuk griye çeker (Bizans sayfası)
function cool(x, y, w, h, a) { ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.globalAlpha = a; ctx.fillStyle = '#8a8f9a'; ctx.fillRect(x, y, w, h); ctx.restore(); }

window.SCENE_FNS = {
  /* "Osman Bey'in rüyasını belki duymuşsunuzdur." */
  gece(t, s) {
    const k = eIn(seg(t, s.t0, s.t1)), dz = lerp(1, 1.4, k), dy = lerp(1212, 1000, k);
    ctx.save(); ctx.translate(540, dy); ctx.scale(dz, dz); ctx.translate(-540, -1212);
    skyLand(t, { k: .1, sun: false }); stars(t, .9); crescentMoon(520, 560, 40);   // x 520: imza (≤458) ile rozet yazısı (≥650) arasındaki boşluktan geçer
    ctx.fillStyle = lg(0, 1210, 0, H, [[0, '#0d0a08'], [1, '#050302']]); ctx.fillRect(-200, 1210, W + 400, H);
    const tr = C('p1:rüyasını'), ga = eOut(seg(t, tr - .1, tr + 1.6));
    if (ga > 0) { ctx.save(); ctx.globalAlpha = .55 * ga; glow(540, 980, 260 * ga, 'rgba(255,214,130,.35)'); miniTree(540, 1130, 1.1, ga, t, { leaves: false }); ctx.restore(); }
    tent(540, 1240, .62, t, {}); pennant(720, 1250, .8, t, {});
    ctx.restore();
  },
  /* "Şeyh Edebali'nin göğsünden bir ay doğar ve Osman'ın göğsüne girer. Osman'ın göbeğinden bir ağaç yükselir," */
  ay(t, s) {
    const td = C('p2:doğar'), tg = C('p2:girer'), tb = C('p2:göbeğinden'), te = C("p2:Edebali'nin"), to = C("p2:Osman'ın");
    const tilt = 200 * eIO(seg(t, tb - .2, s.t1 + .2));
    ctx.fillStyle = rg(540, 800, 60, 1300, [[0, '#1c2350'], [.6, '#0e1230'], [1, '#05060f']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(0, tilt * .4); stars(t, .8); ctx.restore();
    goldDust(t, .7);
    ctx.save(); ctx.translate(0, tilt);
    ctx.fillStyle = rg(540, 1200, 40, 620, [[0, 'rgba(242,199,92,.18)'], [1, 'rgba(242,199,92,0)']]); ctx.fillRect(0, 700, W, 900);
    const ec = seated(250, 1180, 1.05, { hat: 'kece', beard: true, rim: RIM }), O = sleeper(745, 1190, .92, { rim: RIM });
    // ay: Edebali'nin göğsünden doğar, altın yayla Osman'ın göğsüne girer
    const P = k => { const u = 1 - k; return [u * u * ec[0] + 2 * u * k * 470 + k * k * O.chest[0], u * u * ec[1] + 2 * u * k * 420 + k * k * O.chest[1]]; };
    const born = seg(t, s.t0 + .2, td + .1), mk = eIO(seg(t, td, tg + .1));
    if (born > 0 && mk < 1) {
      const tr = []; for (let i = 0; i <= 40; i++) tr.push(P(mk * i / 40));
      ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'screen'; for (const [w, a] of [[22, .15], [9, .4], [3, .9]]) { ctx.strokeStyle = rgba(GOLD, a); ctx.lineWidth = w; tracePath(tr); ctx.stroke(); } ctx.restore();
      const [mx, my] = P(mk); fullMoon(mx, my, lerp(16, 44, eOut(born)) * (1 - .4 * seg(t, tg - .2, tg + .1)), clamp(born * 2));
    }
    const hp = hitPulse(t, tg, 1.4); if (hp > 0) glow(...O.chest, 380 * hp, 'rgba(255,220,150,.9)');
    if (t > tg) glow(...O.chest, 70, 'rgba(255,214,130,.5)');
    const g = eOut(seg(t, tb - .1, s.t1)); if (g > 0) miniTree(...O.navel, 1.7, g, t);
    kinetic('ŞEYH EDEBALİ', 250, 1262, 28, t, te, { mode: 'fade', fam: F.mont, w: 900, spacing: 5, col: 'rgba(255,240,215,.92)', stroke: false, out: tb });
    kinetic('OSMAN', 745, 1262, 28, t, to, { mode: 'fade', fam: F.mont, w: 900, spacing: 5, col: 'rgba(255,240,215,.92)', stroke: false, out: tb });
    ctx.restore();
  },
  /* "gölgesi bütün dünyayı kaplar." */
  cihan(t, s) {
    const td = C('p2:dünyayı'), tg = C('p2:gölgesi'), Y = 1300;
    const cam = camAt([[s.t0, 101, 53, 1.9], [td, 130, -60, .6], [s.t1, 140, -150, .45]], t);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .35 });
    ownCity(cam, 'Söğüt', Y, { size: 30, a: 1 - seg(t, s.t0 + .5, s.t0 + 1.1) });
    const [rx, ry] = W2S(cam, ...CITY['Söğüt']), ts = lerp(.5, 2.0, eIO(seg(t, s.t0, td + .5)));
    const sh = eOut(seg(t, tg, td + .8));
    if (sh > 0) { ctx.save(); ctx.globalAlpha = .55 * sh; ctx.fillStyle = rg(rx, ry - 330 * ts, 60, 300 + 1300 * sh, [[0, 'rgba(12,8,24,.85)'], [1, 'rgba(12,8,24,0)']]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    glow(rx, ry - 200 * ts, 240 * ts, 'rgba(255,214,130,.35)');
    miniTree(rx, ry, ts, 1, t);
  },
  /* "Edebali rüyayı yorumlar: Bu soy cihana hükmedecektir. Ve kızını Osman'a verir. Güzel bir hikâye." */
  yorum(t, s) {
    const tk = C('p2:kızını'), tz = C('p3:Güzel'), m = eIO(seg(t, tz - .05, tz + .7));
    if (m > 0) { darkDesk(); parchment(540, 880, lerp(1180, 800, m), lerp(2100, 1400, m), { seed: 1480 }); }
    const sc = lerp(1, .6, m);
    ctx.save(); ctx.translate(540, 880); ctx.scale(sc, sc); ctx.translate(-540, -880);
    if (m > 0) { ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); }
    const z = lerp(1, 1.07, eIO(seg(t, s.t0, tz)));
    ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000);
    ctx.fillStyle = rg(540, 1080, 40, 1250, [[0, '#5a3418'], [.35, '#2a170b'], [1, '#070403']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    miniTree(540, 1180, 1.9, 1, t, { col: 'rgba(242,199,92,.16)', leaves: false });
    ctx.fillStyle = lg(0, 1200, 0, H, [[0, '#120a05'], [1, '#050302']]); ctx.fillRect(-100, 1200, W + 200, H);
    seated(285, 1210, 1.0, { hat: 'kece', beard: true, rim: 'rgba(255,170,80,.45)' });
    seated(795, 1210, 1.0, { flip: true, hat: 'sarik', rim: 'rgba(255,170,80,.45)' });
    candle(500, 1200, 1, t, 1, 0); candle(580, 1200, 1, t, eOut(seg(t, tk, tk + .5)), 3);
    ctx.restore();
    if (m > 0) { ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.globalAlpha = .75 * m; ctx.fillStyle = '#a07a48'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    ctx.restore();
    if (m > 0) { ctx.save(); ctx.globalAlpha = m; ctx.strokeStyle = 'rgba(40,22,8,.85)'; ctx.lineWidth = 5; const w = W * sc, h = H * sc; ctx.strokeRect(540 - w / 2 - 10, 880 - h / 2 - 10, w + 20, h + 20); ctx.lineWidth = 1.5; ctx.strokeRect(540 - w / 2 - 20, 880 - h / 2 - 20, w + 40, h + 40); ctx.restore(); }
  },
  /* "Ama bu rüya ilk kez, Osman'ın ölümünden yüz yılı aşkın süre sonra yazılan kroniklerde karşımıza çıkar." */
  bosluk(t, s) {
    darkDesk();
    const ty = C('p3:yüz'), bz = lerp(1, 1.04, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 900); ctx.scale(bz, bz); ctx.translate(-540, -900);
    timeline(t, { from: 1300, to: 1540, step: 50,   // timeline() x1 = 970 sağ güvenli alana girer; aralık 1500'de biter y: 1000, k: seg(t, s.t0, s.t0 + .8),
      marks: [[1324, 'OSMAN', 'ö. ~1324', C("p3:Osman'ın")], [1484, 'ÂŞIKPAŞAZÂDE', '15. YY SONU', C('p3:kroniklerde')]],
      gap: [1324, 1484, '100+ YIL'], gapK: seg(t, ty - .1, ty + 1.2) });
    kinetic('RÜYANIN İLK KAYDI', W / 2, 520, 58, t, s.t0 + .2, { mode: 'fade', fam: F.cinzel, w: 900, col: '#f4ead2' });
    const tx = 110 + (1324 - 1300) / 240 * 860, ga = seg(t, s.t0 + .4, s.t0 + 1);
    if (ga > 0) { ctx.save(); ctx.globalAlpha = ga * .9; miniTree(tx, 760, .42, 1, t, { leaves: false }); ctx.restore(); }
    ctx.restore();
  },
  /* "Pek çok tarihçi onu, büyüyen bir hanedana kutsal bir başlangıç kazandıran bir kuruluş efsanesi olarak görür." */
  kronik(t, s) {
    const tk = C('p3:kuruluş'), m = eIO(seg(t, s.t0 + .3, tk));
    darkDesk(); glow(160, 520, 420, 'rgba(255,170,80,.18)');
    const z = lerp(1, 1.08, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(540, 840); ctx.scale(z, z); ctx.translate(-540, -840);
    parchment(540, 840, 780, 880, { seed: 1484, rot: -.02 });
    inkScript(210, 520, 660, 4, t, s.t0 + .1, 2.6, { style: 'arabic', lh: 50, seed: 14 });
    ctx.save(); ctx.globalAlpha = 1 - m; glow(540, 950, 300, 'rgba(255,214,130,.35)'); miniTree(540, 1130, 1.25, 1, t); ctx.restore();
    ctx.save(); ctx.globalAlpha = m; miniTree(540, 1130, 1.25, 1, t, { col: 'rgba(40,22,8,.85)', leaves: false }); ctx.restore();
    inkScript(210, 1185, 660, 2, t, s.t0 + 1.4, 1.6, { style: 'arabic', lh: 50, seed: 15 });
    inkDrop(540, 1140, t, tk + .1, { r: 80, seed: 3 });
    ctx.restore();
    const la = seg(t, s.t0 + .4, s.t0 + .8); if (la > 0) { ctx.save(); ctx.globalAlpha = la; ctx.fillStyle = 'rgba(255,220,150,.92)'; ctx.fillRect(W / 2 - 200, 404, 400, 50);
      setFont(26, F.mont, 900); ctx.letterSpacing = '3px'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('15. YÜZYIL KRONİĞİ', W / 2, 430); ctx.restore(); }
  },
  /* "Bilecik'teki düğün baskını da öyle." */
  bilecik(t, s) {
    const Y = 1298.6, tb = C('p4:Bilecik');
    const cam = camAt([[s.t0, 110, 60, 2.4], [s.t1, 88, 44, 4.6]], t);
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .2 });
    mapLabel(cam, 'BİZANS', ...LL(29.45, 40.75), 46, { a: seg(t, s.t0, s.t0 + .5) });
    ownCity(cam, 'Söğüt', Y, { size: 30 });
    ownCity(cam, 'Bilecik', Y, { size: 30, label: false });
    mapPin(cam, ...CITY['Bilecik'], t, tb - .05, 'BİLECİK', { date: 'RİVAYET · ~1299', left: true, col: '#c0392b' });   // rivayet kırmızısı; mor zeminde okunur
  },
  /* "Rivayete göre Osman, Bilecik tekfurunun düğününe baskın yapar, gelini esir alır ve oğlu Orhan'la evlendirir." */
  baskin(t, s) {
    const tb = C('p4:baskın#2'), te = C('p4:esir'), pan = eIO(seg(t, s.t0, s.t1)), z = lerp(1, 1.06, pan);
    ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-540, -1150);
    // gök, uzak tepe ve Bilecik kalesi (yavaş katman)
    ctx.fillStyle = lg(0, 0, 0, 1300, [[0, '#070a18'], [.6, '#141a34'], [.85, '#3a2a30'], [1, '#5a3424']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.save(); ctx.translate(-30 * pan, 0); stars(t, .7); crescentMoon(800, 470, 34);
    ctx.fillStyle = '#120d14'; ctx.beginPath(); ctx.moveTo(-100, 1300); for (let x = -100; x <= W + 100; x += 40) ctx.lineTo(x, 1070 - 40 * Math.sin(x * .004 + 1.3) - 20 * Math.cos(x * .011)); ctx.lineTo(W + 100, 1300); ctx.fill();
    castle(840, 1000, .55, '#0a0810'); ctx.restore();
    // fenerlerin aydınlattığı sis bandı: siluetler bunun önünde okunur
    const fl = 1 - .45 * seg(t, tb + .3, s.t1);
    ctx.fillStyle = lg(0, 960, 0, 1310, [[0, 'rgba(255,150,70,0)'], [.6, `rgba(255,160,80,${.42 * fl})`], [1, `rgba(255,150,70,${.1 * fl})`]]); ctx.fillRect(-100, 960, W + 200, 350);
    ctx.fillStyle = lg(0, 1290, 0, H, [[0, '#0a0706'], [1, '#020101']]); ctx.fillRect(-100, 1290, W + 200, H);
    ctx.save(); ctx.translate(-120 * pan, 0);
    const sc = eOut(seg(t, tb, tb + 1.4)), bx0 = 470 + (te - s.t0) * 36;
    // düğün alayı (orta plan): fenerli, yavaş; baskında dağılır. i = 2 gelin
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
    // akıncılar (ön plan, büyük): soldan dalar; "esir"den sonra gelinle sola döner
    const hp = hitPulse(t, tb, .9); if (hp > 0) glow(bx0, 1080, 560 * hp, 'rgba(255,200,130,.7)');
    for (let j = 0; j < 3; j++) {
      const xin = lerp(-520 - j * 230, bx0 - 40 - j * 210, eOut(seg(t, tb - .7, tb + .35))), x = t < te ? xin : xin - (t - te) * 380, y = 1300 + j * 6;
      const da = seg(t, tb - .6, tb) * (1 - seg(t, te + 1, te + 2.2));
      if (da > 0) { ctx.fillStyle = rg(x - 160, y - 30, 0, 230, [[0, `rgba(110,85,70,${.35 * da})`], [1, 'rgba(110,85,70,0)']]); ctx.fillRect(x - 400, y - 260, 480, 300); }
      rider(x, y, 1.2 - j * .1, t, { speed: 2.6, ph: j * .37, sil: '#030202', flag: j === 0 ? '#a8322a' : null, flip: t >= te });
    }
    ctx.restore(); ctx.restore();
  },
  /* "Gelinin adı Nilüfer'dir." */
  nilufer(t, s) {
    const tn = C('p4:Nilüfer');
    ctx.fillStyle = lg(0, 0, 0, H, [[0, '#0a1420'], [.55, '#07101a'], [1, '#020508']]); ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) { const r = fract((t - s.t0) * .45 + i / 3); ctx.strokeStyle = `rgba(242,199,92,${.35 * (1 - r)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(540, 1080, 120 + r * 420, (120 + r * 420) * .18, 0, 0, TAU); ctx.stroke(); }
    const nz = lerp(1, 1.12, eIO(seg(t, s.t0, s.t1 + .5))); ctx.save(); ctx.translate(540, 1070); ctx.scale(nz, nz); ctx.translate(-540, -1070);
    nilufer(540, 1070, 1.25, spring(t, s.t0 + .05, { freq: .9, damp: .8 }), t); ctx.restore();
    kinetic('NİLÜFER', W / 2, 520, 120, t, tn - .05, { mode: 'letters', fam: F.cinzel, w: 900, gold: true, spacing: 6 });
    kinetic("ORHAN'IN EŞİ · I. MURAD'IN ANNESİ", W / 2, 620, 26, t, tn + .5, { mode: 'fade', fam: F.mont, w: 900, spacing: 3, col: 'rgba(255,240,215,.92)', stroke: false });
  },
  /* "Ancak bu olay, Bizans kaynaklarında doğrulanmaz." */
  elyazmasi(t, s) {
    const td = C('p5:doğrulanmaz');
    ctx.fillStyle = lg(0, 0, 0, H, [[0, '#1a1e26'], [1, '#07080b']]); ctx.fillRect(0, 0, W, H);
    candle(150, 1240, 1.2, t, 1, 5);
    const z = lerp(1, 1.06, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(560, 880); ctx.scale(z, z); ctx.translate(-560, -880);
    parchment(560, 880, 720, 900, { seed: 1354, rot: .03 }); cool(180, 410, 760, 940, .45);
    ctx.fillStyle = 'rgba(122,90,154,.8)'; ctx.fillRect(232, 470, 14, 800);
    inkScript(280, 520, 580, 6, t, s.t0 + .1, 2.2, { style: 'greek', lh: 56, seed: 9 });
    const sw = seg(t, s.t0 + 1, td); if (sw > 0 && sw < 1) { const yy = lerp(850, 1280, sw); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg(0, yy - 40, 0, yy + 40, [[0, 'rgba(255,230,170,0)'], [.5, 'rgba(255,230,170,.28)'], [1, 'rgba(255,230,170,0)']]); ctx.fillRect(260, yy - 40, 620, 80); ctx.restore(); }
    stamp('KAYIT YOK', 560, 1060, 84, t, td, '#c0392b', -.12);
    ctx.restore();
  },
  /* "Efsaneler, güçlenen hanedanlara meşruiyet kazandırır." */
  muhur(t, s) {
    const tm = C('p5:meşruiyet'), k = seg(t, tm, tm + .28);
    ctx.fillStyle = rg(560, 900, 60, 1300, [[0, '#3a0f0b'], [1, '#070302']]); ctx.fillRect(0, 0, W, H);
    const z = lerp(1, 1.06, eIO(seg(t, s.t0, s.t1)));
    ctx.save(); ctx.translate(560, 960); ctx.scale(z, z); ctx.translate(-560, -960);
    const tu = eOut(seg(t, s.t0 + .1, s.t0 + 1.3)); glow(190, 980, 380 * tu, 'rgba(255,160,80,.35)');
    tug(190, 1460 + 420 * (1 - tu), .95, t, {});
    parchment(610, 860, 620, 820, { seed: 1402, rot: .02 });
    inkScript(340, 560, 540, 5, t, s.t0 - 2, 1, { style: 'arabic', lh: 52, seed: 21 });
    // altın ağaç küçülerek mühüre dönüşür
    const g = eIO(seg(t, s.t0, tm)), ta = 1 - seg(t, tm - .1, tm + .1);
    if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; glow(610, 900, 300, 'rgba(255,214,130,.3)'); miniTree(610, lerp(1150, 1150, g), lerp(1.3, .45, g), 1, t); ctx.restore(); }
    const hp = hitPulse(t, tm, 1.2); if (hp > 0) glow(610, 1080, 420 * hp, 'rgba(255,214,130,.7)');
    agacMuhur(610, 1080, 118, t, k);
    ctx.restore();
  },
  /* "Peki o hâlde, belgelere geçen ilk an neydi?" */
  soru(t, s) {
    const tn = C('p6:neydi'), Y = 1301;
    const cam = flyTo([101, 53, 3.2], [72, -12, 2.0], eIO(seg(t, s.t0, tn + .4)));
    drawTimeMap(t, cam, Y, { focus: 'OSM', dim: .25 });
    const bz = LL(28.2, 41.25), bx = W2S(cam, ...bz)[0]; mapLabel(cam, 'BİZANS', ...bz, 46, { a: seg(t, s.t0 + .3, s.t0 + .8) * clamp((bx - 170) / 120) });   // Trakya: "?" ile çakışmasın
    ownCity(cam, 'Söğüt', Y, { size: 28 }); ownCity(cam, 'İzmit', Y, { size: 28 }); ownCity(cam, 'İznik', Y, { size: 28 });
    const [qx, qy] = W2S(cam, ...CITY['Bafeus']), qa = spring(t, C('p6:belgelere'), { freq: 1.6, damp: .7 }) * (1 - seg(t, C('p6.end') + .5, C('p6.end') + .9));   /* sıradaki kartından önce söner */
    if (qa > 0) { glow(qx, qy - 150, 220 * clamp(qa), 'rgba(255,214,130,.45)'); ctx.save(); ctx.globalAlpha = clamp(qa); title('?', qx, qy - 150 + Math.sin(t * 2.4) * 6, 200 * clamp(qa, .2, 1.2), { fam: F.cinzel, w: 900, gold: true }); ctx.restore(); }
  },
};
