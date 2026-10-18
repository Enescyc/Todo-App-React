// Sezon 1 · Fragman: Bir Günde Çöküş. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 0, of: 10 },
  rate: 6.5, lead: .9, gap: .6, tail: 4.6, film: false,
  paras: [
    { text: "Bir sabah, bir imparatorluk vardı. Balkanlar'dan Fırat'a uzanan topraklar, yenilmez sanılan bir ordu ve Yıldırım lakaplı bir sultan.",
      hl: ["imparatorluk", "Balkanlar'dan", "Fırat'a", "yenilmez", "Yıldırım"] },
    { text: "Bir gün içinde ordu dağıldı, sultan esir düştü. Ankara, bin dört yüz iki.",
      hl: ["dağıldı", "esir", "Ankara"] },
    { text: "Peki bu devlet, nasıl olmuştu da yüz yıl önce adı bile bilinmeyen bir sınır beyliğinden buraya gelmişti? Ve neden, bütün bu hikâyenin başını, kimse yazmamıştı?",
      hl: ["yüz", "sınır", "kimse"] },
  ],
  scenes: [
    { id: 'dawn', from: 'p1' },
    { id: 'empire', from: "p1:Balkanlar'dan-0.25", note: 'YAKLAŞIK SINIRLAR · 1402' },
    { id: 'sultan', from: 'p1:Yıldırım-0.2' },
    { id: 'collapse', from: 'p2-0.1', note: 'YAKLAŞIK SINIRLAR' },
    { id: 'ankara', from: 'p2:Ankara-0.15' },
    { id: 'rewind', from: 'p3-0.2', note: 'YAKLAŞIK SINIRLAR' },
    { id: 'blank', from: 'p3:Ve-0.1' },
  ],
  transitions: [
    { at: "p1:Balkanlar'dan-0.25", type: 'dive', d: .35 },
    { at: 'p1:Yıldırım-0.2', type: 'flash', d: .2 },
    { at: 'p2-0.1', type: 'dip', d: .25 },
    { at: 'p2:Ankara-0.15', type: 'flash', d: .2 },
    { at: 'p3-0.2', type: 'whip', d: .25 },
    { at: 'p3:Ve-0.1', type: 'dip', d: .35 },
  ],
  badges: [
    { from: 'p2', to: 'p2.end+0.6', k: 'belge', src: 'Ankara Savaşı · Temmuz 1402' },
  ],
  cards: [
    { type: 'next', from: 'p3.end+0.7', kicker: 'OSMANLI · SEZON 1', title: ['UÇTAKİ', 'BEYLİK'], sub: 'BÖLÜM 1 · KİMSENİN YAZMADIĞI BAŞLANGIÇ' },
  ],
  // ekran sarsıntısı + ses efekti (sfx: shared/sfx kütüphane kimliği)
  hits: [
    { at: 'p1:Yıldırım', amp: 8, sfx: 'vurus/timpani_alcak', gain: .8 },
    { at: 'p2:dağıldı', amp: 14, sfx: 'vurus/buyuk_davul_ff', gain: .9 },
    { at: 'p2:esir', amp: 0, sfx: 'metal/zincir_surtunme', gain: .45 },
    { at: 'p2:Ankara', amp: 12, sfx: 'vurus/buyuk_davul_ff', gain: .85 },
    { at: 'p2:Ankara', amp: 0, sfx: 'vurus/timpani_alcak', gain: .6 },
    { at: 'p3:sınır', amp: 0, sfx: 'doku/kadeh_D#4', gain: .35 },
    { at: 'p3:kimse+0.35', amp: 4, sfx: 'vurus/timpani_alcak', gain: .5 },
    { at: 'p3.end+0.7', amp: 0, sfx: 'vurus/gong_mf', gain: .45 },
  ],
  risers: [
    { to: 'p2:dağıldı', sfx: 'vurus/timpani_rulo', gain: .55 },
    { to: 'p2:Ankara', sfx: 'vurus/timpani_rulo', gain: .45 },
  ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi] (leitmotif doğru kelimeye denk gelsin), fallback = parça yoksa kütüphane stili
  music: [
    { from: 'p1', to: 'p2-0.1', style: 'trk:destan', sync: ['p1:Yıldırım', 30], gain: .8, fallback: 'lib:dawn' },
    { from: 'p2-0.1', to: 'p2:Ankara-0.15', style: 'trk:akin', sync: ['p2:dağıldı', 40], gain: .75, fallback: 'lib:collapse' },
    { from: 'p2:Ankara-0.15', to: 'p3-0.2', style: 'trk:agit', sync: ['p2:Ankara', 23], gain: .9, fallback: 'lib:dark' },
    { from: 'p3-0.2', to: 'p3:Ve-0.1', style: 'trk:rivayet', sync: ['p3:sınır', 37], gain: .9, fallback: 'lib:rewind' },
    { from: 'p3:Ve-0.1', to: 'end', style: 'trk:kurulus', sync: ['p3.end+0.7', 20], gain: .9, fallback: 'lib:theme' },
  ],
};
