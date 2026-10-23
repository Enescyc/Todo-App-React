// Storyboard iskeleti: timeline.js + audio/vo_timing.js + kontrol --capalar çıktısından STORYBOARD.md tablolarını üretir
// (Anlatım tablosu: paragraf başları ve vurgu kelimelerinin gerçek zamanları; Çekimler: sahne, çapa saniyesi, süre, not, geçiş, rozet, ses).
// Başlık kısmı (biçim, kahraman an, renk yayı, süreklilik, yasaklar) elle yazılır; örnek: sezon-1-kurulus/b03-koyunhisar/STORYBOARD.md.
// kullanım (tarih-reels/ içinden, gerçek kayıt hizalandıktan sonra):
//   NODE_PATH=$(npm root -g) node shared/tools/kontrol.js <bölüm> --capalar > /tmp/capalar.txt
//   node shared/tools/storyboard_iskelet.js <bölüm> /tmp/capalar.txt > /tmp/tablolar.md
const fs = require('fs'), path = require('path'), vm = require('vm');
const [ep, capf] = process.argv.slice(2);
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ep, 'timeline.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ep, 'audio', 'vo_timing.js'), 'utf8'), ctx);
const EP = ctx.window.EP, VO = ctx.window.VO, src = fs.readFileSync(path.join(ep, 'timeline.js'), 'utf8');
const T = {};   // çapa → saniye
for (const l of fs.readFileSync(capf, 'utf8').split('\n')) { const m = l.match(/^\s*([\d.]+)\s+(\S+)/); if (m && !(m[2] in T)) T[m[2]] = +m[1]; }
const f = x => x == null ? '?' : x.toFixed(2).replace('.', ',');
const f1 = x => x.toFixed(1).replace('.', ',');
const cmt = re => { const l = src.split('\n').find(s => re.test(s)); const m = l && l.match(/\/\/\s*(.*)$/); return m ? m[1].trim() : ''; };
const norm = s => s.toLocaleLowerCase('tr').replace(/[.,;:!?"“”«»()]/g, '');
const out = [];
// anlatım tablosu
out.push('| p | Başlangıç | Ana kelime çapaları | Duraklama |', '|---|---|---|---|');
EP.paras.forEach((P, i) => {
  const V = VO.paras[i], words = P.text.split(/\s+/);
  const hl = (P.hl || []).map(h => { const k = words.findIndex(w => norm(w).startsWith(norm(h))); return k >= 0 && V.words[k] ? `${h} ${f(V.words[k][0])}` : h; });
  out.push(`| p${i + 1} | ${f(V.t0)} | ${hl.join(' · ')} · son ${f(V.t1)} | ${P.pause ? `+${P.pause} sn harita sessizliği` : ''} |`);
});
out.push('');
// çekimler
const S = EP.scenes, dur = VO.duration;
const st = S.map(s => T[s.from]);
out.push('| # | Çapa (sn) | ~Süre | Sahne | Görüntü ve amaç (timeline notu) | Geçiş | Rozet | Ses |', '|---|---|---|---|---|---|---|---|');
S.forEach((s, i) => {
  const t0 = st[i], t1 = i + 1 < S.length ? st[i + 1] : dur;
  const tr = (EP.transitions || []).find(x => x.at === s.from);
  const bd = (EP.badges || []).filter(b => { const bt = T[b.from]; return bt != null && bt >= t0 - .05 && bt < t1 - .05; }).map(b => `${({ belge: '🟢', tartismali: '🟡', rivayet: '🔴' })[b.k] || ''} ${b.src}`);
  const mu = (EP.music || []).filter(m => { const mt = m.from === 'p1' ? T['p1'] : T[m.from]; return mt != null && Math.abs(mt - t0) < .06; }).map(m => `\`${m.style}\`${m.gain > .5 ? ' (öne çıkar)' : ''}`);
  const hits = (EP.hits || []).filter(h => { const ht = T[h.at]; return ht != null && ht >= t0 && ht < t1 && (h.gain || 0) >= .3; }).map(h => `\`${h.sfx}\``);
  const id = s.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  out.push(`| ${i + 1} | ${s.from} (${f(t0)}) | ${f1(t1 - t0)} | \`${s.id}\` | ${cmt(new RegExp(`id: '${id}'`))}${s.note ? ` · not: ${s.note}` : ''} | ${tr ? `${tr.type} ${tr.d}` : '—'} | ${bd.join('; ') || '—'} | ${[...mu, ...hits].join(', ')} |`);
});
console.log(out.join('\n'));
