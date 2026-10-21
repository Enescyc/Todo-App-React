// Sezon 1 · Bölüm 2: Bir Rüya, Bir Düğün: Efsaneler. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun.
// Metin: SENARYOLAR.md → Bölüm 2 (birebir, 6 paragrafa bölündü). Olgular: FACTS.md. Çekimler: STORYBOARD.md.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 2, of: 10 },
  rate: 6.5, lead: .8, gap: .6, tail: 4.4, film: false,   // rate: ses gelene kadar tahmini hece/sn
  paras: [
    { text: "Osman Bey'in rüyasını belki duymuşsunuzdur.",
      hl: ["rüyasını"] },
    { text: "Şeyh Edebali'nin göğsünden bir ay doğar ve Osman'ın göğsüne girer. Osman'ın göbeğinden bir ağaç yükselir, gölgesi bütün dünyayı kaplar. Edebali rüyayı yorumlar: Bu soy cihana hükmedecektir. Ve kızını Osman'a verir.",
      hl: ["ay", "ağaç", "dünyayı", "cihana", "kızını"] },
    { text: "Güzel bir hikâye. Ama bu rüya ilk kez, Osman'ın ölümünden yüz yılı aşkın süre sonra yazılan kroniklerde karşımıza çıkar. Pek çok tarihçi onu, büyüyen bir hanedana kutsal bir başlangıç kazandıran bir kuruluş efsanesi olarak görür.",
      hl: ["Ama", "yüz", "kroniklerde", "efsanesi"] },
    { text: "Bilecik'teki düğün baskını da öyle. Rivayete göre Osman, Bilecik tekfurunun düğününe baskın yapar, gelini esir alır ve oğlu Orhan'la evlendirir. Gelinin adı Nilüfer'dir.",
      hl: ["Rivayete", "baskın", "esir", "Nilüfer'dir"] },
    { text: "Ancak bu olay, Bizans kaynaklarında doğrulanmaz. Efsaneler, güçlenen hanedanlara meşruiyet kazandırır.",
      hl: ["doğrulanmaz", "meşruiyet"] },
    { text: "Peki o hâlde, belgelere geçen ilk an neydi?",
      hl: ["belgelere", "ilk"] },
  ],
  scenes: [
    { id: 'gece', from: 'p1' },
    { id: 'ay', from: 'p2-0.25' },
    { id: 'cihan', from: 'p2:yükselir-0.1', note: 'YAKLAŞIK SINIRLAR · ~1300' },
    { id: 'yorum', from: 'p2:Edebali#2-0.15' },               // #2: ilk eşleşme "Edebali'nin"
    { id: 'bosluk', from: 'p3:Ama-0.1' },
    { id: 'kronik', from: 'p3:Pek-0.1' },
    { id: 'bilecik', from: 'p4-0.15', note: 'YAKLAŞIK SINIRLAR · ~1299' },
    { id: 'baskin', from: 'p4:Rivayete-0.1' },
    { id: 'nilufer', from: 'p4:Gelinin-0.1' },                // "gelini" ≠ "Gelinin" (önek "gelinin")
    { id: 'elyazmasi', from: 'p5:Bizans-0.15' },             // "Ancak bu olay" nilüfer adında kalır (yazı ≥ 1.2 sn)
    { id: 'muhur', from: 'p5:Efsaneler-0.1' },
    { id: 'soru', from: 'p6-0.15', note: 'YAKLAŞIK SINIRLAR · ~1301' },
  ],
  transitions: [
    { at: 'p2-0.25', type: 'dive', d: .35 },                  // çadır kapısının ışığına dalış → rüya
    { at: 'p2:yükselir-0.1', type: 'rise', d: .3 },           // ağaçtan haritaya geri çekiliş
    { at: 'p2:Edebali#2-0.15', type: 'dip', d: .3 },
    { at: 'p3:Ama-0.1', type: 'whip', d: .22 },
    { at: 'p3:Pek-0.1', type: 'dive', d: .3 },                // Âşıkpaşazâde işaretinden kitaba
    { at: 'p4-0.15', type: 'rise', d: .3 },                   // mürekkep lekesinden haritaya
    { at: 'p4:Rivayete-0.1', type: 'dive', d: .3 },           // Bilecik iğnesinden geceye
    { at: 'p4:Gelinin-0.1', type: 'flash', d: .22 },
    { at: 'p5:Bizans-0.15', type: 'dip', d: .3 },
    { at: 'p5:Efsaneler-0.1', type: 'dip', d: .3 },
    { at: 'p6-0.15', type: 'rise', d: .3 },
  ],
  badges: [
    { from: 'p1:rüyasını', to: 'p3:Ama-0.1', k: 'rivayet', src: 'Rüya: Âşıkpaşazâde, 15. yy sonu' },
    { from: 'p3:Ama', to: 'p3:Pek-0.1', k: 'belge', src: 'İlk kayıt: 15. yy kronikleri' },
    { from: 'p3:Pek', to: 'p3.end+0.3', k: 'tartismali', src: 'Yorum: hanedan efsanesi' },
    { from: 'p4:düğün', to: 'p4:Gelinin-0.1', k: 'rivayet', src: 'Düğün baskını: geç kronikler' },
    { from: "p4:Nilüfer'dir", to: 'p5:Bizans-0.2', k: 'belge', src: 'Kişi belgeli, düğün hikâyesi rivayet' },
    { from: 'p5:Bizans', to: 'p5:Efsaneler-0.1', k: 'rivayet', src: 'Bizans kaynaklarında kaydı yok' },
    { from: 'p5:Efsaneler', to: 'p5.end+0.3', k: 'tartismali', src: 'Yorum: efsane ve meşruiyet' },
  ],
  cards: [
    { from: 'p1:rüyasını+0.2', to: 'p2-0.3', kicker: 'BÖLÜM 2', title: ['BİR RÜYA,', 'BİR DÜĞÜN'], sub: 'EFSANELER', y: 760 },
    { type: 'next', from: 'p6.end+0.9', kicker: 'SIRADAKİ · BÖLÜM 3', title: ['KOYUNHİSAR'], sub: 'TARİHE GİRİLEN GÜN' },
  ],
  hits: [
    { at: 'p1:rüyasını', amp: 0, sfx: 'doku/fx_uzun_1', gain: .35 },
    { at: 'p2:doğar', amp: 0, sfx: 'doku/kadeh_D#4', gain: .35 },
    { at: 'p2:girer', amp: 6, sfx: 'vurus/timpani_alcak', gain: .6 },
    { at: 'p2:dünyayı', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .55 },
    { at: 'p3:yüz', amp: 0, sfx: 'doku/kadeh_D#4', gain: .3 },
    { at: 'p4:baskın#2', amp: 12, sfx: 'vurus/buyuk_davul_ff', gain: .8 },     // #1 = "baskını" (p4 başı)
    { at: 'p5:doğrulanmaz', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .55 },
    { at: 'p5:meşruiyet', amp: 6, sfx: 'vurus/zil_timpani', gain: .5 },
    { at: 'p6.end+0.9', amp: 0, sfx: 'vurus/gong_mf', gain: .4 },
  ],
  risers: [
    { to: 'p4:baskın#2', sfx: 'vurus/timpani_rulo', gain: .45 },
    { to: 'p5:meşruiyet', sfx: 'vurus/timpani_rulo', gain: .35 },
  ],
  blur: [ { from: 'p4:baskın#2-0.2', to: 'p4:baskın#2+0.8' } ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi], fallback = parça yoksa kütüphane stili
  music: [
    { from: 'p1', to: 'p3:Ama-0.1', style: 'trk:rivayet', sync: ['p2:doğar', 36.5], gain: .85, fallback: 'lib:dream' },
    { from: 'p3:Ama-0.1', to: 'p4:Rivayete-0.1', style: 'trk:saray', sync: ['p3:yüz', 18], gain: .8, fallback: 'lib:dark' },
    { from: 'p4:Rivayete-0.1', to: 'p4:Gelinin-0.1', style: 'trk:akin', sync: ['p4:baskın#2', 38], gain: .75, fallback: 'lib:battle' },
    { from: 'p4:Gelinin-0.1', to: 'p5:Efsaneler-0.1', style: 'trk:bizans', sync: ['p5:Bizans', 42], gain: .85, fallback: 'lib:byz' },
    { from: 'p5:Efsaneler-0.1', to: 'end', style: 'trk:kurulus', sync: ['p5:meşruiyet', 20], gain: .9, fallback: 'lib:theme' },
  ],
};
