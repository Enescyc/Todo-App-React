// Sezon 1 · Bölüm 2: Bir Rüya, Bir Düğün. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun (vo/full.mp3).
// Metin: SENARYOLAR.md → Bölüm 2 (onaylı v6, kelimesi kelimesine; 8 paragraf). Olgular: FACTS.md. Çekimler: STORYBOARD.md.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 2, of: 10 },
  rate: 6.5, lead: .35, gap: .5, tail: 4.0, film: false, duckDb: 15,   // gerçek ses geldi: zamanlar audio/vo_timing.js'ten; hızlandırma yok
  paras: [
    { text: "Osman Bey'in ünlü rüyasını duymuşsunuzdur. Anlatılır ki Osman bir gece Şeyh Edebali'nin evinde misafir kalmış.",
      hl: ["rüyasını", "Anlatılır", "Edebali"] },
    { text: "O gece rüyasında, şeyhin göğsünden bir ay doğduğunu ve gelip kendi göğsüne girdiğini görmüş. Sonra göbeğinden bir ağaç yükselmiş ve gölgesi bütün dünyayı kaplamış.",
      hl: ["ay", "girdiğini", "ağaç", "dünyayı"] },
    { text: "Sabah olunca Edebali rüyayı bu soyun cihana hükmedeceğine yormuş ve kızını Osman'a vermiş.",
      hl: ["Sabah", "cihana", "kızını"] },
    { text: "Peki Osman, Bilecik hisarını nasıl aldı? Bu da bir düğünle anlatılır. Bilecik tekfuru Yarhisar tekfurunun kızıyla evlenecekmiş. Ama düğün aslında Osman'a kurulmuş bir tuzakmış ve haber ona sızmış.",
      hl: ["Peki", "Bilecik", "düğünle", "tuzakmış"] },
    { text: "Osman da her yaz olduğu gibi yüklerini Bilecik hisarına göndermiş. Bu kez aralarında silahlı adamlar varmış. Garnizon düğündeyken hisar kısa sürede düşmüş, düğün alayı baskına uğramış ve gelin esir alınmış.",
      hl: ["yüklerini", "silahlı", "düşmüş", "baskına", "esir"], pause: 2 },            // doruk (kesik üçleme) → 2 sn harita sessizliği
    { text: "Gelin, Osman'ın oğlu Orhan'la evlendirilmiş ve adı Nilüfer olmuş. Nilüfer Hatun ileride, Orhan'dan sonra tahta çıkan Birinci Murad'ın annesi olacaktı.",
      hl: ["Nilüfer", "Orhan", "Murad"] },
    { text: "Bin üç yüze doğru Bilecik, Yarhisar ve İnegöl Osman'ın elindeydi. Osman İznik'e bakan Yenişehir'i kendine üs yaptı. Akıncıları İznik'in çevresini sardı ve şehir surlarının içine sıkıştı.",
      hl: ["Bilecik", "Yarhisar", "İnegöl", "Yenişehir"] },
    { text: "Sonunda imparator, bu küçük beyliği durdurmak için Boğaz'ın öte yakasına bir ordu gönderdi. Bizans ile Osman ilk kez savaş meydanında karşı karşıya gelecekti.",
      hl: ["imparator", "ordu", "ilk", "savaş"] },
  ],
  scenes: [
    { id: 'gece', from: 'p1' },                                                  // gece göğü, rüya ağacının gölgesi, uzakta şeyhin evi
    { id: 'ev', from: 'p1:Anlatılır-0.15' },                                       // şeyhin evi; kamera ışıklı pencereye iter
    { id: 'ay', from: 'p2-0.25' },                                                // rüya: ay şeyhin göğsünden doğar, Osman'ın göğsüne girer, ağaç yükselir
    { id: 'cihan', from: 'p2:yükselmiş-0.1', note: 'YAKLAŞIK SINIRLAR · ~1290' },  // ağaç Söğüt'te, gölgesi haritayı kaplar
    { id: 'yorum', from: 'p3-0.3' },                                              // sabah: yorum ve evlilik sözü
    { id: 'bilecik', from: 'p4-0.3', note: 'YAKLAŞIK SINIRLAR · ~1299' },         // soru: Bilecik iğnesi; düğün Bilecik ↔ Yarhisar
    { id: 'tuzak', from: 'p4:Ama-0.15', note: 'YAKLAŞIK SINIRLAR · ~1299' },      // aynı kamera: tuzak halkası, haber Söğüt'e sızar
    { id: 'kervan', from: 'p5-0.3' },                                             // yük kervanı hisara yaklaşır (Bölüm 1'in emanet yükleri)
    { id: 'kapi', from: 'p5:Bu-0.15' },                                           // kapıda meşale: yük gölgeleri silahlı adam gölgelerine döner
    { id: 'hisar', from: 'p5:Garnizon-0.2' },                                     // garnizon düğünde, hisar düşer
    { id: 'baskin', from: 'p5:düğün#2-0.2' },                                     // #1 = "düğündeyken"; düğün alayı baskına uğrar, gelin esir
    { id: 'sessizlik', from: 'p5.end+0.25', note: 'YAKLAŞIK SINIRLAR · ~1300' },  // 2 sn harita sessizliği: Bilecik kızıla döner
    { id: 'nilufer', from: 'p6-0.25' },                                           // Nilüfer; Orhan ve I. Murad (belgeli kısım)
    { id: 'uc', from: 'p7-0.3', note: 'YAKLAŞIK SINIRLAR · ~1300' },              // Bilecik, Yarhisar, İnegöl
    { id: 'iznik', from: 'p7:Osman#2-0.25', note: 'YAKLAŞIK SINIRLAR · ~1301' },  // #1 = "Osman'ın"; Yenişehir üssü, İznik sarılır
    { id: 'soru', from: 'p8-0.3', note: 'YAKLAŞIK SINIRLAR · ~1301' },            // imparatorun ordusu Boğaz'ı geçer → Bölüm 3
  ],
  transitions: [
    { at: 'p1:Anlatılır-0.15', type: 'dip', d: .25 },
    { at: 'p2-0.25', type: 'dive', d: .35 },               // pencerenin ışığına dalış → rüya
    { at: 'p2:yükselmiş-0.1', type: 'rise', d: .3 },       // ağaçtan haritaya geri çekiliş
    { at: 'p3-0.3', type: 'dip', d: .3 },                  // gece haritası → sabah
    { at: 'p4-0.3', type: 'rise', d: .3 },                 // odadan haritaya (soru)
    { at: 'p5-0.3', type: 'dive', d: .3 },                 // Bilecik'e dalış → yol
    { at: 'p5:Bu-0.15', type: 'dive', d: .3 },              // ışıklı kapıya dalış
    { at: 'p5:Garnizon-0.2', type: 'dip', d: .25 },
    { at: 'p5:düğün#2-0.2', type: 'whip', d: .22 },
    { at: 'p5.end+0.25', type: 'rise', d: .3 },            // baskından haritaya: sessizlik
    { at: 'p6-0.25', type: 'flash', d: .22 },
    { at: 'p7-0.3', type: 'rise', d: .3 },
  ],
  badges: [
    { from: 'p1:Anlatılır', to: 'p3.end+0.3', k: 'rivayet', src: 'Rüya: Âşıkpaşazâde, 15. yy' },
    { from: 'p4:Bilecik', to: 'p4:anlatılır-0.3', k: 'tartismali', src: "Bilecik'in alınışı: ~1299–1300" },
    { from: 'p4:anlatılır', to: 'p6:Nilüfer#2-0.2', k: 'rivayet', src: 'Düğün: Âşıkpaşazâde kroniği' },
    { from: 'p6:Nilüfer#2', to: 'p6.end+0.2', k: 'belge', src: "Nilüfer Hatun: I. Murad'ın annesi" },
    { from: 'p7', to: 'p7:Akıncıları-0.2', k: 'tartismali', src: 'Bilecik, Yarhisar, İnegöl: ~1300' },
    { from: 'p7:Akıncıları', to: 'p7.end+0.2', k: 'tartismali', src: "İznik'in sarılması: ~1301" },
    { from: 'p8:imparator', to: 'p8.end+0.6', k: 'belge', src: "Muzalon'un ordusu: Pakhymeres" },
  ],
  cards: [
    { from: 'p1:rüyasını+0.1', to: 'p1:Anlatılır+0.5', kicker: 'BÖLÜM 2', title: ['BİR RÜYA,', 'BİR DÜĞÜN'], y: 760 },
    { type: 'next', from: 'p8.end+0.9', kicker: 'SIRADAKİ · BÖLÜM 3', title: ['KOYUNHİSAR'], sub: 'TARİHE GİRİLEN GÜN' },
  ],
  hits: [
    // Konuşma altındaki vuruşların sesi kısık ya da 0 (yalnız sarsıntı): anlatıcı müziğin ≥ 10 dB üstünde kalsın (ses_olc).
    // Güçlü vuruş sesleri konuşma aralarına alındı: doruğun son darbesi sessizliğin başında, kapanış davulu ve gong kartta.
    { at: 'p2:girdiğini', amp: 6, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: 'p2:dünyayı', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .08 },
    { at: 'p4:Bilecik', amp: 0, sfx: 'ritim/def_boguk', gain: .12 },
    { at: 'p4:tuzakmış', amp: 5, sfx: 'vurus/timpani_alcak', gain: .1 },
    { at: 'p5:düşmüş', amp: 7, sfx: 'vurus/timpani_alcak', gain: .14 },          // kesik üçleme: sarsıntı küçükten büyüğe
    { at: 'p5:baskına', amp: 10, sfx: 'vurus/buyuk_davul_mf', gain: .1 },
    { at: 'p5:esir', amp: 13, sfx: 'vurus/buyuk_davul_ff', gain: .08 },
    { at: 'p5.end', amp: 5, sfx: 'vurus/buyuk_davul_ff', gain: .7 },             // doruğun son darbesi → 2 sn harita sessizliği
    { at: 'p5.end+1.0', amp: 0, sfx: 'ritim/def_buyuk', gain: .45 },             // sessizlikte Bilecik kızıla döner
    { at: 'p7:Bilecik', amp: 0, sfx: 'ritim/def_boguk', gain: .12 },
    { at: 'p7:Yarhisar', amp: 0, sfx: 'ritim/def_boguk', gain: .12 },
    { at: 'p7:İnegöl', amp: 3, sfx: 'ritim/def_buyuk', gain: .12 },
    { at: 'p7:Yenişehir', amp: 4, sfx: 'ritim/def_buyuk', gain: .12 },
    { at: 'p7:sıkıştı', amp: 6, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: 'p8:gönderdi', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .08 },
    { at: 'p8:karşı', amp: 9, sfx: 'vurus/buyuk_davul_ff', gain: .08 },
    { at: 'p8.end+0.9', amp: 4, sfx: 'vurus/buyuk_davul_mf', gain: .45 },        // sıradaki kartı
    { at: 'p8.end+0.9', amp: 0, sfx: 'vurus/gong_mf', gain: .3 },
  ],
  risers: [   // kısık timpani ruloları: konuşmanın altında kalır, sesi konuşmasız vuruşa varır
    { to: 'p5.end', sfx: 'vurus/timpani_rulo', gain: .1 },
    { to: 'p8.end+0.9', sfx: 'vurus/timpani_rulo_2', gain: .1 },
  ],
  blur: [ { from: 'p5:baskına-0.2', to: 'p5:baskına+0.8' } ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi], fallback = parça yoksa kütüphane stili.
  // Konuşma altındaki yatak kısık (gain 0.17, duckDb 15); konuşmasız iki an (sessizlik, kapanış kartı) aynı parçanın ayrı, yüksek kopyasıyla öne çıkar.
  music: [
    { from: 'p1', to: 'p4-0.3', style: 'trk:rivayet', sync: ['p2:göbeğinden', 36.5], gain: .17, fallback: 'lib:dream' },   // el çanı motifi ağaçta
    { from: 'p4-0.3', to: 'p5:Garnizon-0.2', style: 'trk:saray', sync: ['p4:Ama', 18], gain: .17, fallback: 'lib:dark' },      // B motifi "Ama"da: tuzak
    { from: 'p5:Garnizon-0.2', to: 'p5.end', style: 'trk:akin', sync: ['p5:baskına', 38], gain: .17, fallback: 'lib:battle' }, // doruk baskında
    { from: 'p5.end', to: 'p5.end+0.8', style: 'trk:akin', sync: ['p5:baskına', 38], gain: .75, fallback: 'lib:battle' },    // harita sessizliği: müzik öne çıkar
    { from: 'p6-0.25', to: 'p8-0.3', style: 'trk:kurulus', sync: ['p6:Nilüfer', 20], gain: .17, fallback: 'lib:theme' },       // ney motifi "Nilüfer"de
    { from: 'p8-0.3', to: 'p8.end', style: 'trk:bizans', sync: ['p8:Bizans', 42], gain: .17, fallback: 'lib:byz' },           // motif iması "Bizans"ta
    { from: 'p8.end', to: 'end', style: 'trk:bizans', sync: ['p8:Bizans', 42], gain: .75, fallback: 'lib:byz' },             // kapanış kartı
  ],
};
