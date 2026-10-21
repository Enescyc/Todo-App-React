// Sezon 1 · Bölüm 1: Sınırın İki Yakası. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun.
// Metin: SENARYOLAR.md → Bölüm 1 (v6, onaylı; kelimesi kelimesine). Olgular: FACTS.md. Çekimler: STORYBOARD.md.
// Klasör adı (b01-kimsenin-yazmadigi-baslangic) eski başlıktan kaldı; değiştirilmedi.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 1, of: 10 },
  rate: 6.5, lead: .8, gap: .6, tail: 4.4, film: false, duckDb: 18,
  paras: [
    { text: "Bin iki yüz kırk üç yazında, Kösedağ'da Selçuklu ordusu Moğollar karşısında dağıldı. Bu yenilginin bedelini bütün Anadolu ödedi.",
      hl: ["Kösedağ'da", "Moğollar", "dağıldı", "Anadolu"] },
    { text: "Moğol tahsildarları ağır vergiler topluyordu. Bu yükten kaçan Türkmen obaları batıya, Bizans topraklarına doğru çekildi. Sınır boyları, yani uçlar, her yıl biraz daha kalabalıklaşıyordu.",
      hl: ["vergiler", "Türkmen", "batıya", "uçlar"] },
    { text: "Peki sınırın öbür yanında kim vardı? Bizans. Bin iki yüz altmış birde İstanbul'u geri alan imparatorluğun gözü artık batıdaydı. Anadolu'da sınırı kuşaklardır bekleyen dağ köylüleri vergiye bağlandı ve bu bekçiler dağılmaya başladı.",
      hl: ["Peki", "Bizans", "İstanbul'u", "bekçiler"] },
    { text: "Bir an kendinizi bu iki dünyanın arasında, Söğüt'te düşünün. Ertuğrul adında bir beyin obası kışı burada geçiriyor. Yaz gelince de sürüleriyle Domaniç yaylasına çıkıyor.",
      hl: ["Söğüt'te", "Ertuğrul", "Domaniç"] },
    { text: "Bin iki yüz seksenlerin başında Ertuğrul öldü ve obanın başına oğlu Osman geçti. Osman ilk yıllarında komşu Bizans tekfurlarıyla, yani hisar beyleriyle iyi geçindi.",
      hl: ["Ertuğrul", "Osman", "tekfurlarıyla"] },
    { text: "Anlatılır ki oba yaylaya çıkarken ağır yüklerini Bilecik tekfuruna emanet bırakırmış. Dönüşte de ona yayladan armağanlar götürürmüş. Ama bu komşuluk yıllar sonra bambaşka bir hikâyeye dönüşecekti.",
      hl: ["Anlatılır", "Bilecik", "emanet", "bambaşka"] },
    { text: "Sınırda dengeler çabuk değişiyordu. On yıl dolmadan Karacahisar kalesi Osman'ın eline geçti.",
      hl: ["Karacahisar", "geçti"], pause: 1.5 },          // harita sessizliği (T15): ağaç ilk kez filizlenir
    { text: "Aynı yıllarda Bilecik yakınlarında, adı Osman'ınkiyle birlikte anılacak bir şeyh yaşıyordu: Edebali.",
      hl: ["Bilecik", "Edebali"] },
  ],
  // p1–p3 tek harita yolculuğu: doğudan (Kösedağ) batıya (İstanbul); kamera ve yıl scenes.js'te ortak (MAPCAM, MAPYIL)
  scenes: [
    { id: 'kosedag', from: 'p1', note: 'YAKLAŞIK SINIRLAR · 1243' },
    { id: 'anadolu', from: 'p1:Bu-0.15', note: 'YAKLAŞIK SINIRLAR · 1243' },
    { id: 'vergi', from: 'p2-0.2', note: 'YAKLAŞIK SINIRLAR · ~1250' },
    { id: 'goc', from: 'p2:Bu-0.1', note: 'YAKLAŞIK SINIRLAR · ~1250' },
    { id: 'uclar', from: 'p2:Sınır-0.1', note: 'YAKLAŞIK SINIRLAR · ~1255' },
    { id: 'soru', from: 'p3-0.2', note: 'YAKLAŞIK SINIRLAR · ~1260' },
    { id: 'bizans', from: 'p3:Bizans-0.15', note: 'YAKLAŞIK SINIRLAR · 1261' },
    { id: 'bekciler', from: "p3:Anadolu'da-0.2" },
    { id: 'sogut', from: 'p4-0.2', note: 'YAKLAŞIK SINIRLAR · ~1280' },
    { id: 'oba', from: 'p4:Ertuğrul-0.15' },
    { id: 'yayla', from: 'p4:Yaz-0.1', note: 'YAKLAŞIK SINIRLAR · ~1280' },
    { id: 'vefat', from: 'p5-0.2' },
    { id: 'komsu', from: 'p5:Osman#2-0.2', note: 'YAKLAŞIK SINIRLAR · ~1285' },   // #1 = "oğlu Osman geçti"
    { id: 'emanet', from: 'p6-0.2' },
    { id: 'armagan', from: 'p6:Dönüşte-0.1' },
    { id: 'golge', from: 'p6:Ama-0.1' },
    { id: 'karacahisar', from: 'p7-0.2', note: 'YAKLAŞIK SINIRLAR · ~1288' },
    { id: 'edebali', from: 'p8-0.2' },
  ],
  transitions: [
    { at: "p3:Anadolu'da-0.2", type: 'whip', d: .25 },     // Balkanlar'dan Anadolu sınırına geri dönüş
    { at: 'p4-0.2', type: 'rise', d: .3 },                 // sönen fenerlerden haritaya
    { at: 'p4:Ertuğrul-0.15', type: 'dive', d: .35 },       // Söğüt iğnesine dalış → kışlak
    { at: 'p4:Yaz-0.1', type: 'rise', d: .3 },             // kışlaktan yayla yoluna
    { at: 'p5-0.2', type: 'dip', d: .35 },                 // zaman atlaması (~1281)
    { at: 'p5:Osman#2-0.2', type: 'rise', d: .3 },         // tuğdan hisarlar haritasına
    { at: 'p6-0.2', type: 'dive', d: .35 },                // Bilecik hisarı simgesine dalış → rivayet
    { at: 'p6:Dönüşte-0.1', type: 'dip', d: .3 },          // mevsim atlaması: yayladan dönüş
    { at: 'p6:Ama-0.1', type: 'dive', d: .3 },             // kapıdaki yüklere
    { at: 'p7-0.2', type: 'rise', d: .3 },                 // yüklerin gölgesinden haritaya
    { at: 'p8-0.2', type: 'dip', d: .35 },                 // harita sessizliğinden mum ışığına
  ],
  badges: [
    { from: "p1:Kösedağ'da", to: 'p2-0.3', k: 'belge', src: 'Kösedağ · 26 Haziran 1243' },
    { from: 'p2:Moğol', to: 'p2.end+0.3', k: 'belge', src: 'Moğol vergisi ve Türkmen göçü' },
    { from: 'p3:Bin', to: 'p3:gözü-0.1', k: 'belge', src: 'İstanbul geri alındı · 1261' },
    { from: 'p3:gözü', to: 'p3.end+0.3', k: 'tartismali', src: 'Pakhymeres anlatır · yorum tartışmalı' },
    { from: 'p4:Ertuğrul', to: 'p4.end+0.3', k: 'tartismali', src: 'Kışlak Söğüt, yaylak Domaniç' },
    { from: 'p5:Ertuğrul', to: 'p5:Osman#2-0.3', k: 'tartismali', src: "Ertuğrul'un ölümü · ~1281" },
    { from: 'p5:Osman#2', to: 'p5.end+0.3', k: 'tartismali', src: 'Komşuluk: Âşıkpaşazâde anlatısı' },
    { from: 'p6:Anlatılır', to: 'p6.end+0.3', k: 'rivayet', src: 'Âşıkpaşazâde, 15. yy sonu' },
    { from: 'p7:Karacahisar', to: 'p7.end+1.5', k: 'tartismali', src: 'Karacahisar · ~1288 (1286–1291)' },
    { from: 'p8:Bilecik', to: 'p8.end+0.6', k: 'tartismali', src: 'Edebali · Bilecik zaviyesi' },
  ],
  cards: [
    { from: 'p1:Bu', to: 'p2:Moğol-0.25', kicker: 'BÖLÜM 1', title: ['SINIRIN', 'İKİ YAKASI'], y: 640 },
    { type: 'next', from: 'p8.end+0.9', kicker: 'SIRADAKİ · BÖLÜM 2', title: ['BİR RÜYA,', 'BİR DÜĞÜN'] },
  ],
  hits: [
    { at: 'p1:dağıldı', amp: 12, sfx: 'vurus/buyuk_davul_ff', gain: .4 },
    { at: 'p3:Bizans', amp: 8, sfx: 'vurus/timpani_alcak', gain: .35 },        // soruya cevap: "Bizans."
    { at: 'p5:öldü', amp: 0, sfx: 'vurus/timpani_alcak', gain: .25 },
    { at: 'p5:Osman', amp: 6, sfx: 'vurus/timpani_alcak', gain: .3 },
    { at: 'p6:bambaşka', amp: 5, sfx: 'vurus/timpani_alcak', gain: .22 },
    { at: 'p7.end+0.5', amp: 14, sfx: 'vurus/buyuk_davul_ff', gain: .7 },    // kahraman an: "geçti."den sonra bir nefes, harita sessizliğinin içinde
    { at: 'p8:Edebali', amp: 0, sfx: 'doku/fx_uzun_1', gain: .14 },
    { at: 'p8.end+0.9', amp: 0, sfx: 'vurus/gong_mf', gain: .4 },
  ],
  risers: [
    { to: 'p1:dağıldı', sfx: 'vurus/timpani_rulo', gain: .25 },
    { to: 'p7.end+0.5', sfx: 'vurus/timpani_rulo', gain: .15 },
  ],
  blur: [ { from: 'p7.end+0.4', to: 'p7.end+1.2' } ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi], fallback = parça yoksa kütüphane stili.
  // Kazançlar ses_olc.py ölçümüyle ayarlandı (21 Ekim 2026): konuşma altında anlatıcı ≥ 10 dB önde (en kötü %10: 10,6 dB);
  // ducking konuşmanın sesli payıyla orantılı çalıştığı için müzik zemini düşük tutuldu (duckDb 18). Son kartta konuşma yok: 0.6.
  music: [
    { from: 'p1-0.8', to: 'p1:Bu-0.15', style: 'trk:akin', sync: ['p1:dağıldı', 38], gain: 0.2, fallback: 'lib:battle' },
    { from: 'p1:Bu-0.15', to: 'p2:Sınır-0.1', style: 'trk:agit', sync: ['p1:ödedi', 23], gain: 0.2, fallback: 'lib:dark' },
    { from: 'p2:Sınır-0.1', to: 'p3:Bizans-0.15', style: 'trk:kurulus', sync: ['p2:Sınır', 8], gain: 0.2, fallback: 'lib:theme' },
    { from: 'p3:Bizans-0.15', to: "p3:Anadolu'da-0.2", style: 'trk:bizans', sync: ['p3:Bizans', 42], gain: 0.24, fallback: 'lib:byz' },
    { from: "p3:Anadolu'da-0.2", to: 'p4-0.2', style: 'trk:saray', sync: ['p3:dağılmaya', 38], gain: 0.23, fallback: 'lib:tension' },
    { from: 'p4-0.2', to: 'p5-0.2', style: 'trk:kurulus', sync: ["p4:Söğüt'te", 6], gain: 0.26, fallback: 'lib:theme' },
    { from: 'p5-0.2', to: 'p5:Osman-0.3', style: 'trk:agit', sync: ['p5:öldü', 23], gain: 0.24, fallback: 'lib:dark' },
    { from: 'p5:Osman-0.3', to: 'p6-0.2', style: 'trk:kurulus', sync: ['p5:Osman', 20], gain: 0.26, fallback: 'lib:theme' },   // leitmotif: Osman başa geçerken
    { from: 'p6-0.2', to: 'p6:Ama-0.1', style: 'trk:rivayet', sync: ['p6:emanet', 36.5], gain: 0.2, fallback: 'lib:dream' },
    { from: 'p6:Ama-0.1', to: 'p7-0.2', style: 'trk:saray', sync: ['p6:bambaşka', 18.3], gain: 0.18, fallback: 'lib:dark' },
    { from: 'p7-0.2', to: 'p8-0.2', style: 'trk:destan', sync: ['p7.end+0.5', 44], gain: 0.18, fallback: 'lib:theme' },
    { from: 'p8-0.2', to: 'p8.end+0.6', style: 'trk:rivayet', sync: ['p8:Edebali', 36.5], gain: 0.24, fallback: 'lib:dream' },
    { from: 'p8.end+0.6', to: 'end', style: 'trk:kurulus', sync: ['p8.end+0.9', 20], gain: .6, fallback: 'lib:theme' },
  ],
};
