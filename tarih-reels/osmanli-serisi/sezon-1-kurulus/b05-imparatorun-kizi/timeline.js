// Sezon 1 · Bölüm 5: İmparatorun Kızı. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun (bekleniyor).
// Metin: SENARYOLAR.md → Bölüm 5 (onaylı, 22 Ekim 2026; kelimesi kelimesine, 8 paragraf, 250 kelime). Olgular: FACTS.md. Çekimler: STORYBOARD.md.
// Ses gelene kadar tahmini hece hızı (rate 6.5); vo/full.mp3 gelince make_audio hizalar, çapalar kendiliğinden kayar.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 5, of: 10 },
  rate: 6.5, lead: .8, gap: .6, tail: 4.4, film: false, duckDb: 15,
  paras: [
    { text: "Bin üç yüz kırk bir yazında Bizans imparatoru Üçüncü Andronikos öldü ve tahtı küçük oğluna kaldı. Ölen imparatorun en yakın adamı Kantakuzenos'tu, ama o seferdeyken imparatoriçe ve saraydaki rakipleri yönetimi ele geçirip mallarına el koydu.",
      hl: ["Andronikos", "öldü", "Kantakuzenos'tu", "mallarına"] },
    { text: "Bunun üzerine Kantakuzenos Dimetoka'da kendini imparator ilan etti. Artık iki imparator vardı ve Bizans altı yıl sürecek bir iç savaşa sürüklendi.",
      hl: ["Dimetoka'da", "iki", "savaşa"] },
    { text: "Bu savaşta Kantakuzenos'a denizin öte yakasından eski bir dostu yardım etti: Aydınoğlu Umur Bey. Dimetoka kuşatıldığında Umur'un gemileri Meriç'ten yukarı, surların dibine kadar çıktı.",
      hl: ["dostu", "Umur", "Meriç'ten", "surların"] },
    { text: "Ama Umur kendi topraklarına dönmek zorunda kalınca Kantakuzenos yeni bir müttefik aradı. Peki kimdi bu müttefik? Yıllar önce Pelekanon'da karşısında savaştığı adam, Orhan. Böylece Osmanlı askerleri ilk kez Avrupa'ya geçti ve Trakya'da Kantakuzenos için savaştı.",
      hl: ["Peki", "Pelekanon'da", "Orhan", "Avrupa'ya"] },
    { text: "Bu ittifakı bir evlilik mühürledi. Bin üç yüz kırk altı yazında Silivri'de perdeler açıldı ve Kantakuzenos'un kızı Theodora kalabalığın karşısına çıktı. Damat törende yoktu; gemiler gelini Boğaz'ın öte yakasına, Orhan'a götürdü.",
      hl: ["evlilik", "Silivri'de", "Theodora", "gemiler"], pause: 2 },             // kahraman an (düğün) → 2 sn harita sessizliği
    { text: "Ertesi yıl İstanbul'un kapıları Kantakuzenos'a açıldı ve iç savaş onun zaferiyle bitti. Kısa süre sonra Theodora, kocasını babasıyla Üsküdar'da buluşturdu; Pelekanon'da karşı karşıya gelen iki adam şimdi aynı sofradaydı.",
      hl: ["İstanbul'un", "Üsküdar'da", "aynı"] },
    { text: "Ama barış uzun sürmedi. Bin üç yüz elli ikide genç imparator Sırpların desteğiyle yeniden silaha sarılınca Kantakuzenos yine damadından yardım istedi. Bu kez Orhan'ın oğlu Süleyman geldi ve Osmanlı süvarileri Dimetoka yakınlarında Sırp ordusunu dağıttı.",
      hl: ["barış", "Sırpların", "Süleyman", "dağıttı"] },
    { text: "Savaştan sonra Süleyman'ın askerlerinden bir kısmı kışı geçirmek için Gelibolu'nun kuzeyindeki küçük Çimpe kalesinde kaldı. Kısa sürede kaleye aileleri de geldi. Kantakuzenos onları kendisi çağırmıştı; şimdi gitmelerini istiyordu. Ama bir gece yer sarsılacak ve bu soruyu bir daha kimse sormayacaktı.",
      hl: ["Çimpe", "aileleri", "gitmelerini", "sarsılacak"] },
  ],
  // Haritalı sahnelerin yılı scenes.js'te; not yalnız "yaklaşık" uyarısıdır (sahiplik: osmanli-serisi/ortak/sahiplik.js).
  scenes: [
    { id: 'taht', from: 'p1' },                                                      // 1341: boş taht, mumlar söner, küçük taç
    { id: 'sefer', from: 'p1:Ölen-0.25', note: 'YAKLAŞIK SINIRLAR · 1341' },          // küçük taç başkentte; Kantakuzenos Trakya'da; naiplik, el koyma
    { id: 'ilan', from: 'p2-0.25', note: 'YAKLAŞIK SINIRLAR · 1341' },                // Dimetoka iğnesi, ikinci taç
    { id: 'bolunme', from: 'p2:Artık-0.2', note: 'YAKLAŞIK SINIRLAR · 1341' },        // iki taç; Bizans çatlar (iç savaş)
    { id: 'dost', from: 'p3-0.25', note: 'YAKLAŞIK SINIRLAR · ~1343' },               // uçuş: Ege'nin öte yakası, Umur Bey; dostluk yayı
    { id: 'meric', from: 'p3:Dimetoka-0.2', note: 'YAKLAŞIK SINIRLAR · ~1343' },      // kuşatma halkası; gemiler Meriç'ten yukarı
    { id: 'surlar', from: 'p3:surların-0.2' },                                       // yakın plan: gemiler surların dibinde
    { id: 'donus', from: 'p4-0.25', note: 'YAKLAŞIK SINIRLAR · ~1344' },              // Umur döner; Kantakuzenos müttefik arar
    { id: 'soru', from: 'p4:Peki-0.2', note: 'YAKLAŞIK SINIRLAR · ~1344' },           // T4: kamera durur, "?"
    { id: 'pelekanon', from: 'p4:Yıllar-0.2', note: 'YAKLAŞIK SINIRLAR · 1329' },    // yıl geri sarılır: Pelekanon'daki iki ok; ORHAN
    { id: 'gecis', from: 'p4:Böylece-0.2', note: 'YAKLAŞIK SINIRLAR · ~1345' },      // Çanakkale Boğazı'ndan Trakya'ya ilk geçiş
    { id: 'muhur', from: 'p5-0.3' },                                                 // iki kordon, bir mühür
    { id: 'silivri', from: 'p5:Bin-0.25', note: 'YAKLAŞIK SINIRLAR · 1346' },         // Silivri iğnesi
    { id: 'perde', from: 'p5:perdeler-0.2' },                                        // KAHRAMAN AN: perdeler açılır; gelin; damadın boş yeri
    { id: 'gelin', from: 'p5:gemiler-0.2', note: 'YAKLAŞIK SINIRLAR · 1346' },        // gemiler gelini Anadolu yakasına götürür
    { id: 'sessizlik', from: 'p5.end+0.25', note: 'YAKLAŞIK SINIRLAR · 1346' },      // 2 sn harita sessizliği: rüya ağacının dalları Marmara'yı aşar (T18)
    { id: 'kapilar', from: 'p6-0.25' },                                              // 1347: kent kapısı açılır, iki taç yan yana
    { id: 'uskudar', from: 'p6:Kısa-0.2', note: 'YAKLAŞIK SINIRLAR · 1347' },         // Boğaz: Theodora iki yolu Üsküdar'da buluşturur
    { id: 'sofra', from: 'p6:Pelekanon-0.2' },                                       // iki karşıt ok → aynı sofra; "Ama barış uzun sürmedi"
    { id: 'yeniden', from: 'p7:Bin-0.25', note: 'YAKLAŞIK SINIRLAR · 1352' },         // 1352: genç imparator ve Sırp okları; damada çağrı
    { id: 'suleyman', from: 'p7:Bu-0.2', note: 'YAKLAŞIK SINIRLAR · 1352' },          // Süleyman Trakya'ya geçer
    { id: 'suvari', from: 'p7:süvarileri-0.2' },                                     // süvari hücumu, Sırp sancakları dağılır
    { id: 'cimpe', from: 'p8-0.3', note: 'YAKLAŞIK SINIRLAR · ~1352' },              // kış: Gelibolu'nun kuzeyinde Çimpe
    { id: 'kis', from: 'p8:Kısa-0.2' },                                              // kalede çadırlar, ocak dumanı, gelen aileler
    { id: 'istek', from: 'p8:Kantakuzenos-0.2', note: 'YAKLAŞIK SINIRLAR · ~1353' },  // çağrının altın izi; "gidin" oku sönük kalır
    { id: 'sarsinti', from: 'p8:Ama-0.2', note: 'YAKLAŞIK SINIRLAR · ~1353' },        // gece; hafif titreşim, kılcal çatlak → Bölüm 6
  ],
  transitions: [
    { at: 'p1:Ölen-0.25', type: 'rise', d: .3 },            // tahttan haritaya; küçük taç başkente taşınır
    { at: 'p3:surların-0.2', type: 'dive', d: .3 },         // Dimetoka'ya dalış → surlar
    { at: 'p4-0.25', type: 'rise', d: .3 },                 // surlardan haritaya
    { at: 'p5-0.3', type: 'dip', d: .3 },                   // ok → kordon
    { at: 'p5:Bin-0.25', type: 'rise', d: .3 },             // mühürden haritaya
    { at: 'p5:perdeler-0.2', type: 'dive', d: .35 },        // Silivri iğnesine dalış → tören
    { at: 'p5:gemiler-0.2', type: 'rise', d: .3 },          // törenden Marmara'ya
    { at: 'p6-0.25', type: 'dip', d: .35 },                 // zaman atlaması: ertesi yıl
    { at: 'p6:Kısa-0.2', type: 'rise', d: .3 },             // kapıdan Boğaz haritasına
    { at: 'p6:Pelekanon-0.2', type: 'dive', d: .3 },        // Üsküdar'a dalış → sofra
    { at: 'p7:Bin-0.25', type: 'dip', d: .35 },             // zaman atlaması: 1352
    { at: 'p7:süvarileri-0.2', type: 'whip', d: .22 },      // haritadan hücuma
    { at: 'p8-0.3', type: 'rise', d: .3 },                  // hücumdan kış haritasına
    { at: 'p8:Kısa-0.2', type: 'dive', d: .3 },             // Çimpe iğnesine dalış → kale
    { at: 'p8:Kantakuzenos-0.2', type: 'rise', d: .3 },     // kaleden haritaya
  ],
  badges: [
    { from: 'p1:Andronikos', to: 'p1:Ölen-0.3', k: 'belge', src: 'III. Andronikos öldü: Haziran 1341' },
    { from: "p1:Kantakuzenos'tu", to: 'p1.end+0.25', k: 'belge', src: 'Anna, Kalekas, Apokaukos: 1341' },
    { from: "p2:Dimetoka'da", to: 'p2:Artık-0.3', k: 'belge', src: 'Dimetoka: 26 Ekim 1341' },
    { from: 'p2:Artık', to: 'p2.end+0.3', k: 'belge', src: 'İç savaş: 1341–1347' },
    { from: 'p3:Aydınoğlu', to: 'p3.end+0.25', k: 'tartismali', src: "Umur'un filosu: 1342 sonu–1343" },
    { from: 'p4:Peki', to: 'p4:Böylece-0.3', k: 'belge', src: "Orhan'la ittifak: 1344–45" },
    { from: 'p4:Böylece', to: 'p4.end+0.25', k: 'tartismali', src: "Avrupa'ya ilk geçiş: ~1345–46" },
    { from: 'p5:Bin', to: 'p6-0.35', k: 'belge', src: "Düğün: Kantakuzenos'un anlatımı" },
    { from: 'p6', to: 'p6.end+0.25', k: 'belge', src: 'İstanbul ve Üsküdar: 1347' },
    { from: 'p7:Bu', to: 'p7.end+0.25', k: 'tartismali', src: 'Dimetoka yakını: Ekim 1352' },
    { from: 'p8', to: 'p8:Kantakuzenos-0.3', k: 'belge', src: 'Çimpe ve aileler: 1352–53' },
    { from: 'p8:Kantakuzenos', to: 'p8:Ama-0.3', k: 'tartismali', src: 'Kalenin geri istenmesi: İnalcık' },
  ],
  cards: [
    { from: 'p1:Bizans', to: 'p1:öldü+0.1', kicker: 'BÖLÜM 5', title: ['İMPARATORUN', 'KIZI'], y: 640 },
    { type: 'next', from: 'p8.end+0.9', kicker: 'SIRADAKİ · BÖLÜM 6', title: ['GELİBOLU'], sub: 'YER SARSILDIĞINDA' },
  ],
  hits: [
    // Konuşma altındaki vuruşların sesi kısık (yalnız sarsıntı + iz); güçlü sesler konuşmasız anlarda (sessizlik başı, kapanış kartı).
    { at: 'p1:öldü', amp: 6, sfx: 'vurus/timpani_alcak', gain: .12 },             // mumlar söner
    { at: 'p2:ilan', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .1 },              // ikinci taç
    { at: 'p2:sürüklendi', amp: 7, sfx: 'vurus/timpani_alcak', gain: .12 },        // Bizans çatlar
    { at: 'p3:çıktı', amp: 6, sfx: 'vurus/timpani_alcak', gain: .1 },              // gemiler surların dibinde
    { at: 'p4:Orhan', amp: 9, sfx: 'vurus/buyuk_davul_mf', gain: .12 },            // Peki–cevap: ORHAN
    { at: 'p4:geçti', amp: 7, sfx: 'ritim/def_buyuk', gain: .12 },                 // Avrupa'ya ilk geçiş
    { at: 'p5:mühürledi', amp: 5, sfx: 'ritim/def_boguk', gain: .14 },             // mühür
    { at: 'p5:açıldı', amp: 3, sfx: 'vurus/timpani_alcak', gain: .08 },            // perdeler açılır
    { at: 'p5.end', amp: 4, sfx: 'vurus/timpani_alcak', gain: .55 },               // kahraman anın sonu → 2 sn harita sessizliği
    { at: 'p5.end+1.0', amp: 0, sfx: 'ritim/def_buyuk', gain: .4 },                // ağacın dalı Avrupa yakasına uzanır
    { at: 'p6:açıldı', amp: 6, sfx: 'vurus/buyuk_davul_mf', gain: .1 },            // kent kapısı
    { at: 'p6:aynı', amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p7:sürmedi', amp: 5, sfx: 'vurus/timpani_alcak', gain: .12 },           // mum söner
    { at: 'p7:silaha', amp: 6, sfx: 'vurus/buyuk_davul_mf', gain: .08 },
    { at: 'p7:dağıttı', amp: 13, sfx: 'vurus/buyuk_davul_ff', gain: .14 },         // süvari hücumu
    { at: 'p8:Çimpe', amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p8:sarsılacak', amp: 4, sfx: 'vurus/buyuk_davul_kresendo', gain: .1 },  // önsezi: hafif titreşim, uzak gürleme
    { at: 'p8.end+0.9', amp: 4, sfx: 'vurus/buyuk_davul_mf', gain: .45 },          // sıradaki kartı
    { at: 'p8.end+0.9', amp: 0, sfx: 'vurus/gong_mf', gain: .3 },
  ],
  risers: [   // kısık timpani ruloları: konuşmanın altında kalır, sesi konuşmasız vuruşa varır
    { to: 'p5.end', sfx: 'vurus/timpani_rulo', gain: .1 },
    { to: 'p7:dağıttı', sfx: 'vurus/timpani_rulo_2', gain: .07 },
    { to: 'p8.end+0.9', sfx: 'vurus/timpani_rulo', gain: .1 },
  ],
  blur: [ { from: 'p7:dağıttı-0.25', to: 'p7:dağıttı+0.7' } ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi], fallback = parça yoksa kütüphane stili.
  // Konuşma altındaki yatak kısık (gain .17, duckDb 15); konuşmasız iki an (sessizlik, kapanış kartı) ayrı, yüksek kopyayla öne çıkar.
  music: [
    { from: 'p1', to: 'p2-0.25', style: 'trk:bizans', sync: ['p1', 2], gain: .17, fallback: 'lib:byz' },                 // Bizans sarayı: ison
    { from: 'p2-0.25', to: 'p3-0.25', style: 'trk:saray', sync: ['p2:Artık', 18.3], gain: .17, fallback: 'lib:dark' },   // iç savaş: bas motifi "Artık iki imparator"da
    { from: 'p3-0.25', to: 'p4:Peki-0.2', style: 'trk:derya', sync: ['p3:çıktı', 35], gain: .17, fallback: 'lib:theme' }, // Umur'un gemileri: korno motifi "dostu"nda, Re majör "çıktı"da
    { from: 'p4:Peki-0.2', to: 'p5-0.3', style: 'trk:kurulus', sync: ['p4:Orhan', 20], gain: .17, fallback: 'lib:theme' }, // ney motifi "Orhan"da
    { from: 'p5-0.3', to: 'p5:gemiler-0.2', style: 'trk:bizans', sync: ['p5:açıldı', 42.2], gain: .17, fallback: 'lib:byz' }, // düğün: Bizans töreni, motif iması "açıldı"da
    { from: 'p5:gemiler-0.2', to: 'p5.end', style: 'trk:derya', sync: ['p5.end+0.3', 35], gain: .17, fallback: 'lib:theme' },
    { from: 'p5.end', to: 'p5.end+0.8', style: 'trk:derya', sync: ['p5.end+0.3', 35], gain: .75, fallback: 'lib:theme' }, // harita sessizliği: müzik öne çıkar
    { from: 'p6-0.25', to: 'p7-0.2', style: 'trk:kurulus', sync: ['p6:aynı', 20], gain: .17, fallback: 'lib:theme' },     // ney motifi "aynı sofradaydı"da
    { from: 'p7-0.2', to: 'p7:Bu-0.2', style: 'trk:saray', sync: ['p7:silaha', 38.3], gain: .17, fallback: 'lib:dark' },  // gerilim (C) "silaha"da
    { from: 'p7:Bu-0.2', to: 'p8-0.3', style: 'trk:akin', sync: ['p7:dağıttı', 38], gain: .17, fallback: 'lib:battle' },  // akın doruğu "dağıttı"da
    { from: 'p8-0.3', to: 'p8:Ama-0.2', style: 'trk:kurulus', layers: ['zemin', 'melodi'], sync: ['p8:aileleri', 20], gain: .17, fallback: 'lib:theme' }, // kış kampı: ritimsiz
    { from: 'p8:Ama-0.2', to: 'p8.end', style: 'trk:saray', sync: ['p8:sarsılacak', 40], gain: .17, fallback: 'lib:dark' },
    { from: 'p8.end', to: 'end', style: 'trk:saray', sync: ['p8:sarsılacak', 40], gain: .7, fallback: 'lib:dark' },      // kapanış kartı
  ],
};
