// Sezon S · Bölüm N: <Başlık>. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun.
// Bu dosya şablondur: <...> alanlarını doldurun, kullanılmayan satırları silin.
window.EP = {
  series: { season: '<SEZON ADI>', n: <N>, of: 10 },
  rate: 6.5, lead: .8, gap: .6, tail: 4.4, film: false,   // rate: ses gelene kadar tahmini hece/sn
  paras: [
    { text: "<Paragraf 1: kanca. Seslendirme metniyle kelimesi kelimesine aynı.>", hl: ["<vurgulanacak kelime başı>"] },
    { text: "<Paragraf 2: doruk. Kısa cümleler, şimdiki zaman.>", hl: [], pause: 2.0 },   // pause: paragraftan sonra harita sessizliği (sn)
    { text: "<Paragraf 3>", hl: [] },
  ],
  scenes: [
    { id: '<giris>', from: 'p1' },
    { id: '<harita>', from: "p2-0.2", note: 'YAKLAŞIK SINIRLAR · <yıl>' },
  ],
  transitions: [
    { at: 'p2-0.2', type: 'dive', d: .35 },          // flash | dip | whip | dive | rise
  ],
  badges: [
    { from: 'p2:<kelime>', to: 'p2.end', k: 'belge', src: '<kısa kaynak>' },   // belge | tartismali | rivayet | dogrulanacak
  ],
  cards: [
    { from: 'p1:<kelime>+0.2', to: 'p2:<kelime>', kicker: 'BÖLÜM <N>', title: ['<SATIR 1>', '<SATIR 2>'], y: 760 },
    { type: 'next', from: 'p<son>.end+0.9', kicker: 'SIRADAKİ · BÖLÜM <N+1>', title: ['<SATIR>'], sub: '<ALT BAŞLIK>' },
  ],
  hits: [
    { at: 'p2:<eylem kelimesi>', amp: 12, sfx: 'vurus/buyuk_davul_ff', gain: .8 },   // amp: sarsıntı + zoom tepmesi (0 = yalnız ses)
  ],
  risers: [
    { to: 'p2:<eylem kelimesi>', sfx: 'vurus/timpani_rulo', gain: .45 },
  ],
  blur: [ /* { from: 'p3:<kelime>', to: 'p3:<kelime>+0.6' } */ ],
  music: [   // tarz parçası + leitmotifi bir kelimeye denk getiren sync; parça yoksa fallback kütüphane stili
    { from: 'p1', to: 'p2-0.2', style: 'trk:rivayet', sync: ['p1', 3], gain: .9, fallback: 'lib:theme' },
    { from: 'p2-0.2', to: 'end', style: 'trk:kurulus', sync: ['p2:<kelime>', 20], gain: .9, fallback: 'lib:theme' },
  ],
};
