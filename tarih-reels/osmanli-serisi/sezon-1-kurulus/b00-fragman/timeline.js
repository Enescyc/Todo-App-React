// Sezon 1 · Fragman: Uçtaki Beylik (sezon tanıtımı). Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun.
// Metin: SENARYOLAR.md → Fragman (onaylı v6, 22 Ekim 2026; kelimesi kelimesine, 6 paragraf). Olgular: FACTS.md. Çekimler: STORYBOARD.md.
// Biçim: sezon montajı. Her cümle sezondan bir an; aynı zaman haritası boyunca Söğüt'ten Ankara'ya yolculuk, yıl sayacı 1300 → 1402.
// Ses gelene kadar tahmini hece hızı (rate 6.5); vo/full.mp3 gelince make_audio hizalar ve bütün çapalar kendiliğinden kayar.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 0, of: 10 },
  rate: 6.5, lead: .35, gap: .55, tail: 4.6, film: false, duckDb: 15,
  paras: [
    { text: "Bin üç yüzlerin başında, Söğüt çevresinde küçük bir sınır beyliği vardı. Onu Osman adında bir bey yönetiyordu.",
      hl: ["Söğüt", "küçük", "Osman"] },
    { text: "Sonraki yüz yılda bu beylik Bizans'ın ordusunu yenecek ve kuşattığı bir şehri kılıç çekmeden teslim alacaktı.",
      hl: ["yüz", "Bizans'ın", "kılıç"] },
    { text: "Bir Bizans imparatoru kızını Osmanlı hükümdarıyla evlendirecekti. Bir deprem Gelibolu'nun surlarını yıkacak ve Osmanlılar Avrupa'ya yerleşecekti.",
      hl: ["imparatoru", "deprem", "Avrupa'ya"] },
    { text: "Bir sultan savaş meydanında hayatını kaybedecekti. Avrupa'nın şövalyeleri Tuna kıyısında bozguna uğrayacak ve devletin toprakları Balkanlar'dan Fırat'a kadar uzanacaktı.",
      hl: ["sultan", "Tuna", "Balkanlar'dan", "Fırat'a"] },
    { text: "Ama bin dört yüz iki yazında, Ankara'da her şey tek bir günde değişecekti.",
      hl: ["Ama", "Ankara'da", "tek"], pause: 2.5 },                                   // harita sessizliği (T15): harita çatlar, ağaç kurur
    { text: "Bu, Söğüt'ten Ankara'ya uzanan yüz yılın hikâyesi.",
      hl: ["Söğüt'ten", "Ankara'ya"] },
  ],
  // Haritalı sahneler aynı zaman haritasını paylaşır; kamera bir sahnenin son karesinden ötekine devam eder (scenes.js).
  scenes: [
    { id: 'sogut', from: 'p1', note: 'YAKLAŞIK SINIRLAR · ~1300' },              // Söğüt'te filiz, küçük kızıl leke; kamera geri çekilir
    { id: 'osman', from: 'p1:Onu-0.2' },                                         // şafak: çadır, düz kırmızı sancak, atlı bey, filiz
    { id: 'bafeus', from: 'p2-0.25', note: 'YAKLAŞIK SINIRLAR · 1302–1326' },    // yıl sayacı akar; Bafeus okları; Bursa çevresinde daralan halka
    { id: 'kapi', from: 'p2:çekmeden-0.2' },                                     // Bursa surları: kapı açılır, ışık dökülür
    { id: 'gelin', from: 'p3-0.25', note: 'YAKLAŞIK SINIRLAR · 1346' },          // Silivri, gelin gemisi Marmara'yı geçer
    { id: 'deprem', from: 'p3:Bir#2-0.15' },                                     // #1 = "Bir Bizans"; gece, Gelibolu surları yıkılır
    { id: 'avrupa', from: 'p3:Osmanlılar-0.05', note: 'YAKLAŞIK SINIRLAR · 1354–1361' }, // boğazı geçen ok, Trakya kızıla döner
    { id: 'kosova', from: 'p4-0.25', note: 'YAKLAŞIK SINIRLAR · 1389' },         // flyTo Kosova, sayaç 1361 → 1389
    { id: 'meydan', from: 'p4:hayatını-0.15' },                                  // savaş meydanı: tuğ devrilir
    { id: 'nigbolu', from: "p4:Avrupa'nın-0.25", note: 'YAKLAŞIK SINIRLAR · 1396' }, // Tuna boyunca Haçlı oku kırılır
    { id: 'zirve', from: 'p4:devletin-0.3', note: 'YAKLAŞIK SINIRLAR · 1400' },  // geri çekiliş: Balkanlar'dan Fırat'a, ağaç tam büyümüş
    { id: 'ankara', from: 'p5-0.2', note: 'YAKLAŞIK SINIRLAR · 1402' },          // "Ama": renk soğur, iki ok Ankara'da buluşur, çatlak
    { id: 'sessizlik', from: 'p5.end+0.15', note: 'YAKLAŞIK SINIRLAR · 1402–1403' }, // 2,5 sn sessizlik: harita çatlar, ağaç kurur
    { id: 'yol', from: 'p6-0.2', note: 'YAKLAŞIK SINIRLAR · 1403' },             // sezonun yolu Söğüt'ten Ankara'ya; tek filiz; sezon kartı
  ],
  transitions: [
    { at: 'p1:Onu-0.2', type: 'dive', d: .3 },          // Söğüt'teki filize dalış → çadır
    { at: 'p2-0.25', type: 'rise', d: .3 },             // çadırdan haritaya geri çekiliş
    { at: 'p2:çekmeden-0.2', type: 'dive', d: .3 },     // daralan halkadan Bursa kapısına dalış
    { at: 'p3-0.25', type: 'flash', d: .22 },           // kapının ışığı → harita
    { at: 'p3:Bir#2-0.15', type: 'dip', d: .25 },       // Marmara'dan Gelibolu gecesine
    { at: 'p3:Osmanlılar-0.05', type: 'rise', d: .25 }, // yıkılan surdan haritaya (yıkılış "yıkacak"tan bir nefes önce başlar)
    { at: 'p4:hayatını-0.15', type: 'dive', d: .28 },   // Kosova iğnesine dalış → meydan
    { at: "p4:Avrupa'nın-0.25", type: 'whip', d: .24 }, // meydandan Tuna'ya
  ],
  badges: [
    { from: 'p1:Söğüt', to: 'p1.end+0.3', k: 'belge', src: 'Söğüt ve Osman · ~1300' },
    { from: "p2:Bizans'ın", to: 'p2:kuşattığı-0.1', k: 'tartismali', src: 'Bafeus Savaşı · 1301/1302' },
    { from: 'p2:kuşattığı', to: 'p2.end+0.3', k: 'tartismali', src: 'Bursa · 1326 · müzakereyle teslim' },
    { from: 'p3:imparatoru', to: 'p3:Bir#2-0.2', k: 'belge', src: 'Theodora ile Orhan · Silivri 1346' },
    { from: 'p3:deprem', to: 'p3.end+0.3', k: 'tartismali', src: 'Gelibolu depremi · 1354' },
    { from: 'p4:sultan', to: "p4:Avrupa'nın-0.3", k: 'belge', src: 'Kosova 1389 · I. Murad meydanda öldü' },
    { from: "p4:Avrupa'nın", to: 'p4:devletin-0.3', k: 'belge', src: 'Niğbolu · 25 Eylül 1396' },
    { from: "p5:Ankara'da", to: 'p5.end+2.6', k: 'belge', src: 'Ankara Savaşı · Temmuz 1402' },
  ],
  cards: [
    { type: 'next', from: 'p6.end+0.7', kicker: 'OSMANLI · SEZON 1', title: ['UÇTAKİ', 'BEYLİK'], sub: 'BÖLÜM 1 · SINIRIN İKİ YAKASI' },
  ],
  // Konuşma altındaki vuruşlar kısık (yalnız sarsıntı + iz); güçlü sesler konuşmasız anlarda: harita sessizliği ve sezon kartı.
  hits: [
    { at: 'p1:Söğüt', amp: 0, sfx: 'ritim/def_boguk', gain: .12 },
    { at: 'p1:Osman', amp: 4, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: 'p2:yenecek', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .1 },
    { at: 'p2:teslim', amp: 4, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: 'p3:kızını', amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p3:yıkacak', amp: 12, sfx: 'vurus/buyuk_davul_ff', gain: .1 },
    { at: "p3:Avrupa'ya", amp: 5, sfx: 'ritim/def_buyuk', gain: .12 },
    { at: 'p4:kaybedecekti', amp: 9, sfx: 'vurus/buyuk_davul_mf', gain: .1 },
    { at: 'p4:bozguna', amp: 10, sfx: 'vurus/buyuk_davul_ff', gain: .1 },
    { at: "p4:Fırat'a", amp: 6, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: 'p5:değişecekti', amp: 6, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: 'p5.end+0.1', amp: 14, sfx: 'vurus/buyuk_davul_ff', gain: .75 },   // harita sessizliği: harita çatlar
    { at: 'p5.end+1.4', amp: 0, sfx: 'vurus/timpani_alcak', gain: .4 },      // ağaç kurur
    { at: 'p6.end+0.7', amp: 4, sfx: 'vurus/buyuk_davul_mf', gain: .45 },    // sezon kartı
    { at: 'p6.end+0.7', amp: 0, sfx: 'vurus/gong_mf', gain: .3 },
  ],
  risers: [   // kısık timpani ruloları: sesin sonu vuruşa varır
    { to: 'p3:yıkacak', sfx: 'vurus/timpani_rulo', gain: .1 },
    { to: 'p5.end+0.1', sfx: 'vurus/timpani_rulo_2', gain: .14 },
  ],
  blur: [
    { from: 'p4-0.25', to: 'p4:savaş' },                       // Gelibolu → Kosova uçuşu
    { from: 'p4:devletin-0.3', to: "p4:Balkanlar'dan+0.2" },   // zirveye geri çekiliş
  ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi], fallback = parça yoksa kütüphane stili.
  // Konuşma altındaki yatak kısık (duckDb 15); konuşmasız iki an (harita sessizliği, sezon kartı) aynı parçanın ayrı, yüksek kopyasıyla öne çıkar.
  music: [
    { from: 'p1', to: 'p2-0.25', style: 'trk:kurulus', sync: ['p1:Osman', 20], gain: .2, fallback: 'lib:theme' },                // ney motifi "Osman"da
    { from: 'p2-0.25', to: 'p5-0.2', style: 'trk:destan', sync: ["p4:Balkanlar'dan", 42.6], gain: .2, fallback: 'lib:theme' },     // tam motif ~Gelibolu, doruk zirvede
    { from: 'p5-0.2', to: 'p5.end', style: 'trk:agit', sync: ['p5.end', 23], gain: .2, fallback: 'lib:dark' },                   // "Ama": ağıt
    { from: 'p5.end', to: 'p6-0.2', style: 'trk:agit', sync: ['p5.end', 23], gain: .75, fallback: 'lib:dark' },                  // harita sessizliği: yarım kalan motif öne çıkar
    { from: 'p6-0.2', to: 'p6.end+0.7', style: 'trk:kurulus', sync: ['p6.end+0.7', 20], gain: .2, fallback: 'lib:theme' },
    { from: 'p6.end+0.7', to: 'end', style: 'trk:kurulus', sync: ['p6.end+0.7', 20], gain: .75, fallback: 'lib:theme' },          // sezon kartı: ney motifi
  ],
};
