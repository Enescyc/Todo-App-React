// Tarih Reels kalite kontrolü – tam render'dan ÖNCE çalıştırılır.
//   NODE_PATH=$(npm root -g) node shared/tools/kontrol.js <bölüm> [--tablo] [--serit t0 t1 n] [--kare t1,t2,..] [--det] [--guvenli]
//   --tablo   : her sahneden 1–3 kare → <bölüm>/kontrol/tablo.png (sahne adı ve saniye etiketli iletişim tablosu)
//   --serit   : t0–t1 arası n kare → kontrol/serit_<t0>-<t1>.png (en zor 2–4 saniyeyi kare kare görmek için)
//   --kare    : tam boy tek kareler → kontrol/kare_<t>.png
//   --det     : determinizm testi: aynı kareler karışık sırayla iki kez çizilir, özetler aynı olmalı
//   --guvenli : Instagram arayüz bölgelerini (üst 220, alt 420, sağ 140 px) kırmızı tarar; yazı bu bölgelere taşmamalı
//   --capalar : timeline.js'teki bütün çapaların saniyesini ve yakaladığı kelimeyi listeler (yanlış kelimeye oturan çapa için)
//   --tara [adım] : bütün zaman çizgisini (varsayılan 0.1 sn adımla) çizip hata veren anları listeler (render çökmesini önler)
// Bayrak verilmezse --tablo --det --guvenli --tara çalışır.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const argv = process.argv.slice(2), ep = path.resolve(argv[0]), has = n => argv.includes(n), val = (n, k = 1) => argv.slice(argv.indexOf(n) + 1, argv.indexOf(n) + 1 + k);
  const any = ['--tablo', '--serit', '--kare', '--det', '--tara', '--capalar'].some(has), safe = has('--guvenli') || !any;
  const outDir = path.join(ep, 'kontrol'); fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.join(ep, 'index.html') + '?capture');
  const ready = await page.waitForFunction(() => window.READY, null, { timeout: 20000 }).then(() => true, () => false);
  const missing = ready ? await page.evaluate(() => typeof exportCues !== 'function' ? ['(motor yüklenmedi)'] : !window.SCENE_FNS ? ['(SCENE_FNS yok: scenes.js yüklenmedi)'] : exportCues().scenes.map(s => s.id).filter(id => typeof window.SCENE_FNS[id] !== 'function')).catch(e => ['(' + e.message + ')']) : ['(sayfa READY olmadı)'];
  if (!ready || missing.length) {
    console.log('SAYFA AÇILAMADI ya da eksik sahne fonksiyonu: ' + missing.join(', '));
    if (errors.length) console.log('SAYFA HATALARI:\n  ' + [...new Set(errors)].join('\n  '));
    await browser.close(); process.exit(1);
  }
  // sayfa içi yardımcılar: kareleri küçültüp tek tuvalde birleştirir
  await page.evaluate(() => {
    window.__sheet = (items, cols, tw, safe) => {
      const th = Math.round(tw * 16 / 9), lab = 34, rows = Math.ceil(items.length / cols);
      const S = document.createElement('canvas'); S.width = cols * tw; S.height = rows * (th + lab); const g = S.getContext('2d');
      g.fillStyle = '#111'; g.fillRect(0, 0, S.width, S.height);
      items.forEach((it, i) => {
        renderAt(it.t); const x = (i % cols) * tw, y = Math.floor(i / cols) * (th + lab);
        g.drawImage(document.getElementById('c'), x, y + lab, tw, th);
        if (safe) { const k = tw / 1080; g.fillStyle = 'rgba(255,0,0,.10)'; g.fillRect(x, y + lab, tw, 220 * k); g.fillRect(x, y + lab + th - 420 * k, tw, 420 * k); g.fillRect(x + tw - 140 * k, y + lab + 220 * k, 140 * k, th - 640 * k); }
        g.fillStyle = '#f2c75c'; g.font = '800 15px Montserrat, sans-serif'; g.textBaseline = 'middle'; g.fillText(it.label, x + 8, y + lab / 2);
        g.strokeStyle = '#000'; g.strokeRect(x + .5, y + .5, tw - 1, th + lab - 1);
      });
      return S.toDataURL('image/png').split(',')[1];
    };
    window.__hash = t => { renderAt(t); const d = document.getElementById('c').getContext('2d').getImageData(0, 0, 1080, 1920).data; let h = 2166136261; for (let i = 0; i < d.length; i += 7) { h ^= d[i]; h = Math.imul(h, 16777619) >>> 0; } return h.toString(16); };
  });
  const cues = await page.evaluate(() => exportCues()), dur = cues.duration, save = (f, b64) => { fs.writeFileSync(path.join(outDir, f), Buffer.from(b64, 'base64')); console.log('yazıldı:', path.join(path.relative(process.cwd(), outDir), f)); };
  console.log(`süre ${dur.toFixed(2)} sn · ${cues.scenes.length} sahne · ${cues.transitions.length} geçiş · ${cues.hits.length} vuruş`);
  if (has('--tablo') || !any) {
    const items = [];
    cues.scenes.forEach((s, i) => {
      const d = s.t1 - s.t0, ts = d > 4.5 ? [s.t0 + 1.0, s.t0 + d / 2, s.t1 - .45] : d > 2.2 ? [s.t0 + .6, s.t1 - .4] : [s.t0 + Math.min(1.0, d * .55)];
      ts.forEach((t, j) => items.push({ t: Math.min(t, dur - .05), label: `${i + 1}${ts.length > 1 ? 'abc'[j] : ''} ${s.id} · ${t.toFixed(1)}s` }));
    });
    items.push({ t: dur - .1, label: `son kare · ${(dur - .1).toFixed(1)}s` });
    save('tablo.png', await page.evaluate(([it, sf]) => window.__sheet(it, 4, 270, sf), [items, safe]));
    const short = cues.scenes.filter(s => s.t1 - s.t0 < 1.4).map(s => `${s.id} (${(s.t1 - s.t0).toFixed(2)} sn)`);
    if (short.length) console.log('UYARI: 1.4 sn\'den kısa sahne (okunmaz olabilir):', short.join(', '));
  }
  if (has('--serit')) {
    const [a, b, n] = val('--serit', 3).map(Number), items = [];
    for (let i = 0; i < n; i++) { const t = a + (b - a) * i / Math.max(1, n - 1); items.push({ t, label: `${t.toFixed(2)}s` }); }
    save(`serit_${a}-${b}.png`, await page.evaluate(([it, sf, c]) => window.__sheet(it, c, 180, sf), [items, safe, Math.min(6, n)]));
  }
  if (has('--kare')) for (const t of val('--kare')[0].split(',').map(Number)) {
    const b64 = await page.evaluate(t => { renderAt(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, t);
    save(`kare_${t}.png`, b64);
  }
  if (has('--det') || !any) {
    const ts = Array.from({ length: 10 }, (_, i) => +(dur * (i + .5) / 10).toFixed(3)), shuffled = [...ts].sort((x, y) => (x * 7919 % 1) - (y * 7919 % 1));
    const h1 = {}, h2 = {}; for (const t of ts) h1[t] = await page.evaluate(t => window.__hash(t), t);
    for (const t of shuffled) h2[t] = await page.evaluate(t => window.__hash(t), t);
    const bad = ts.filter(t => h1[t] !== h2[t]);
    console.log(bad.length ? `DETERMİNİZM HATASI: ${bad.join(', ')} sn farklı çizildi (Math.random, Date veya kareler arası durum var)` : 'determinizm: 10/10 kare aynı');
  }
  if (has('--capalar')) {
    const rows = await page.evaluate(() => {
      const E = window.EP, out = [], add = (kind, c) => { if (c === undefined || typeof c === 'number') return; let t = null, err = null; try { t = cue(c); } catch (e) { err = e.message; } out.push([kind, c, t, CUE_WORD[c] || '', err]); };
      (E.scenes || []).forEach(x => add('sahne ' + x.id, x.from)); (E.transitions || []).forEach(x => add('geçiş ' + x.type, x.at));
      (E.badges || []).forEach(x => { add('rozet ' + x.k, x.from); add('rozet bitiş', x.to); }); (E.cards || []).forEach(x => { add('kart', x.from); add('kart bitiş', x.to); });
      (E.hits || []).forEach(x => add('vuruş ' + x.sfx, x.at)); (E.risers || []).forEach(x => add('yükselen ' + x.sfx, x.to));
      (E.music || []).forEach(x => { add('müzik ' + x.style, x.from); if (x.sync) add('müzik sync', x.sync[0]); }); (E.blur || []).forEach(x => { add('bulanıklık', x.from); add('bulanıklık bitiş', x.to); });
      return out.sort((a, b) => (a[2] ?? -1) - (b[2] ?? -1));
    });
    console.log('ÇAPALAR (saniye · çapa · yakalanan kelime · kullanıldığı yer):');
    for (const [k, c, t, w, e] of rows) console.log(e ? `  HATA   ${c}  → ${e}  (${k})` : `  ${t.toFixed(2).padStart(6)}  ${c.padEnd(28)} ${(w ? '«' + w + '»' : '').padEnd(18)} ${k}`);
  }
  if (has('--tara') || !any) {
    const step = has('--tara') && !isNaN(+val('--tara')[0]) ? +val('--tara')[0] : .1;
    const bad = await page.evaluate(([dur, step]) => { const out = []; for (let t = 0; t < dur; t += step) { try { renderAt(t); } catch (e) { out.push([+t.toFixed(2), e.message.split('\n')[0]]); } } return out; }, [dur, step]);
    if (bad.length) { const grp = {}; for (const [t, m] of bad) (grp[m] = grp[m] || []).push(t); console.log('ÇİZİM HATASI (render bu anlarda çöker):'); for (const m in grp) console.log(`  ${grp[m][0]}–${grp[m][grp[m].length - 1]} sn (${grp[m].length} kare): ${m}`); }
    else console.log(`tarama: ${Math.ceil(dur / step)} kare hatasız (${step} sn adım)`);
  }
  if (errors.length) console.log('SAYFA HATALARI:\n  ' + [...new Set(errors)].join('\n  '));
  await browser.close();
})();
