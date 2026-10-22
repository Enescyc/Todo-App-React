// Sezon 1 · Bölüm 3: Koyunhisar. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun (bekleniyor; vo/full.mp3).
// Metin: SENARYOLAR.md → Bölüm 3 (onaylı, 22 Ekim 2026; kelimesi kelimesine, 8 paragraf). Olgular: FACTS.md. Çekimler: STORYBOARD.md.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 3, of: 10 },
  rate: 6.5, lead: .5, gap: .6, tail: 4.4, film: false, duckDb: 15,   // rate: ses gelene kadar tahmini hece/sn
  paras: [
    { text: "Bin üç yüzlerin hemen başında, bir temmuz günü, imparatorun gönderdiği ordu İzmit Körfezi'ne bakan bir ovada Osman'ı bekliyordu.",
      hl: ["temmuz", "ordu", "İzmit", "Osman'ı"] },
    { text: "Ama bu ordu daha savaş başlamadan huzursuzdu. Komutanı Muzalon, kendi askerlerinin atlarını alıp bozkırdan gelen Alan paralı askerlerine vermişti ve saflarda öfke büyüyordu.",
      hl: ["huzursuzdu", "Muzalon", "Alan", "öfke"] },
    { text: "Tam bu sırada Osman'ın atlıları dağ geçidinden indi ve birden ovada belirdi. Sayıca Bizanslılardan çok daha fazlaydılar.",
      hl: ["dağ", "birden", "Sayıca"] },
    { text: "Türk atlıları hücuma kalkınca Bizans hattı dağıldı. Yalnızca Alan atlıları geride kalıp kaçanları korudu ve kurtulanlar İzmit surlarının ardına sığındı. Meydan Osman'ın atlılarına kaldı.",
      hl: ["hücuma", "dağıldı", "Alan", "Meydan"], pause: 2 },                       // kahraman an → 2 sn harita sessizliği
    { text: "Bu zaferi Türkler Koyunhisar diye andı. Zaferin haberi kısa sürede Karadeniz kıyısındaki Paflagonya'ya kadar ulaştı ve uç savaşçıları Osman'ın sancağı altına koştu. Bitinya'nın köylüleri ise tarlalarını bırakıp İstanbul'a kaçtı ve Bizans'ın elinde yalnızca surlu şehirler kaldı.",
      hl: ["Koyunhisar", "Paflagonya'ya", "sancağı", "surlu"] },
    { text: "Bu surlu şehirlerden biri de Uludağ'ın eteğindeki Bursa'ydı. Ama Bursa'nın surları sarp kayalara yaslanıyordu ve şehir kılıçla alınacak gibi değildi. Bu yüzden Osman saldırmak yerine şehrin iki yanına iki kule diktirdi. Birinin başına yeğeni Aktimur'u, ötekinin başına Balabancık'ı koydu.",
      hl: ["Uludağ'ın", "kule", "Aktimur'u", "Balabancık'ı"] },
    { text: "Düşünün: bu kuleler yıllarca şehri gözledi ve Bursa'ya ne yiyecek ne yardım ulaşabildi. Bu arada Osman yaşlanıp hastalandı; seferlere artık oğlu Orhan çıkıyordu. Şehrin denize açılan kapısı Mudanya da düşünce Bursa büsbütün yalnız kaldı.",
      hl: ["Düşünün", "yıllarca", "Orhan", "Mudanya"] },
    { text: "Anlatılır ki Osman kuşatılmış şehri uzaktan seyrederken güneşte gümüş gibi parlayan bir kubbe görmüş ve o kubbenin altına gömülmeyi dilemiş. Bursa'nın kapıları hâlâ kapalıydı, ama açılacakları gün yaklaşıyordu.",
      hl: ["Anlatılır", "gümüş", "kubbenin", "açılacakları"] },
  ],
  scenes: [
    { id: 'ova', from: 'p1', note: 'YAKLAŞIK SINIRLAR · ~1302' },                  // Bölüm 2'nin son haritası: Bizans ordusu körfeze bakan ovada
    { id: 'saflar', from: 'p2-0.3' },                                              // dalış: ovada bekleyen Bizans safları, huzursuz
    { id: 'atlar', from: 'p2:Komutanı-0.2' },                                      // Muzalon'un çadırı; atlar Alanlara götürülür
    { id: 'ofke', from: 'p2:saflarda-0.2' },                                       // atsız kalan saflarda öfke
    { id: 'gecit', from: 'p3-0.3' },                                               // Osman'ın atlıları dağ geçidinden iner, ovada belirir
    { id: 'kuvvet', from: 'p3:Sayıca-0.2', note: 'YAKLAŞIK SINIRLAR · ~1302' },    // harita: kızıl bloklar mor bloklardan çok
    { id: 'hucum', from: 'p4-0.2' },                                               // hücum; Bizans hattı dağılır
    { id: 'ricat', from: 'p4:Yalnızca-0.2', note: 'YAKLAŞIK SINIRLAR · ~1302' },   // Alanlar kaçanları korur, İzmit surları; meydan Osman'ın
    { id: 'sessizlik', from: 'p4.end+0.2', note: 'YAKLAŞIK SINIRLAR · ~1302' },    // 2 sn harita sessizliği: meydan kızıl, rüya ağacı filizlenir
    { id: 'koyunhisar', from: 'p5-0.3', note: 'YAKLAŞIK SINIRLAR · ~1302' },       // aynı kamera geri çekilir: KOYUNHİSAR
    { id: 'dalga', from: 'p5:Zaferin-0.2', note: 'YAKLAŞIK SINIRLAR · ~1302' },    // haber dalgası Paflagonya'ya; uç savaşçıları sancağa
    { id: 'kacis', from: "p5:Bitinya'nın-0.3" },                                   // köylüler tarlaları bırakıp İstanbul'a
    { id: 'surlar', from: "p5:Bizans'ın-0.3", note: 'YAKLAŞIK SINIRLAR · ~1303' }, // yalnız surlu şehirler; Uludağ ve Bursa
    { id: 'kayalar', from: 'p6:Ama-0.2' },                                         // Bursa sarp kayaların üstünde
    { id: 'kuleler', from: 'p6:yüzden-0.2' },                                      // iki yanına iki kule
    { id: 'gozetleme', from: 'p7-0.3' },                                           // "Düşünün": kuleden yıllarca gözlenen şehir
    { id: 'yaslilik', from: 'p7:arada-0.45' },                                     // yaşlanan Osman, seferlere çıkan Orhan
    { id: 'mudanya', from: 'p7:Şehrin-0.3', note: 'YAKLAŞIK SINIRLAR · ~1321' },   // Mudanya düşer, deniz yolu kesilir
    { id: 'kubbe', from: 'p8-0.3' },                                               // rivayet: güneşte gümüş gibi parlayan kubbe
    { id: 'kapi', from: "p8:Bursa'nın-0.3" },                                      // kapalı kapılar; aralıktan ışık
  ],
  transitions: [
    { at: 'p2-0.3', type: 'dive', d: .35 },               // haritadan ovaya dalış
    { at: 'p2:Komutanı-0.2', type: 'whip', d: .22 },      // saflardan çadıra
    { at: 'p2:saflarda-0.2', type: 'whip', d: .22 },      // çadırdan atsız saflara
    { at: 'p3-0.3', type: 'dip', d: .25 },                // "Tam bu sırada": dağ geçidi
    { at: 'p3:Sayıca-0.2', type: 'rise', d: .3 },         // geçitten haritaya
    { at: 'p4-0.2', type: 'dive', d: .3 },                // haritadan hücuma
    { at: 'p4:Yalnızca-0.2', type: 'rise', d: .3 },       // hücumdan haritaya
    { at: "p5:Bitinya'nın-0.3", type: 'dive', d: .3 },    // haritadan tarlalara
    { at: "p5:Bizans'ın-0.3", type: 'rise', d: .3 },      // tarlalardan haritaya
    { at: 'p6:Ama-0.2', type: 'dive', d: .35 },           // Bursa iğnesinden kayalara dalış
    { at: 'p7-0.3', type: 'dive', d: .3 },                // kulenin tepesine (öznel kamera)
    { at: 'p7:arada-0.45', type: 'dip', d: .3 },          // zaman atlaması: yaşlanan Osman
    { at: 'p7:Şehrin-0.3', type: 'rise', d: .3 },         // çadırdan haritaya
    { at: 'p8-0.3', type: 'dip', d: .35 },                // rivayete geçiş
    { at: "p8:Bursa'nın-0.3", type: 'dip', d: .3 },       // kubbeden kapıya
  ],
  badges: [
    { from: 'p1:temmuz', to: 'p2:Komutanı-0.3', k: 'tartismali', src: '27 Temmuz: Pakhymeres · yıl tartışmalı' },
    { from: 'p2:Komutanı', to: 'p2.end+0.3', k: 'tartismali', src: 'Atların Alanlara verilmesi: Pakhymeres' },
    { from: 'p3:dağ', to: 'p3.end+0.3', k: 'tartismali', src: 'Dağ geçidi ve sayı: Pakhymeres' },
    { from: 'p4', to: 'p4:Yalnızca-0.3', k: 'belge', src: 'Bizans hattının dağılışı: Pakhymeres' },
    { from: 'p4:Yalnızca', to: 'p4:kurtulanlar-0.3', k: 'tartismali', src: 'Alanların koruması: tartışmalı' },
    { from: 'p4:kurtulanlar', to: 'p5:Koyunhisar-0.3', k: 'belge', src: "İzmit'e sığınış: Pakhymeres" },
    { from: 'p5:Koyunhisar', to: 'p5:Zaferin-0.3', k: 'tartismali', src: 'Koyunhisar adı: Osmanlı kronikleri' },
    { from: 'p5:Zaferin', to: "p5:Bitinya'nın-0.3", k: 'belge', src: "Ün Paflagonya'ya: Pakhymeres" },
    { from: "p5:Bitinya'nın", to: 'p6-0.3', k: 'tartismali', src: 'Köylülerin kaçışı: Pakhymeres' },
    { from: 'p6:yüzden', to: 'p6.end+0.3', k: 'tartismali', src: 'İki kule: yılı belirsiz (1303–1317)' },
    { from: 'p7:kuleler', to: 'p7:arada-0.5', k: 'tartismali', src: "Bursa ablukası: TDV «Bursa»" },
    { from: 'p7:arada', to: 'p7:Şehrin-0.4', k: 'tartismali', src: "Osman'ın hastalığı: TDV «Osman I»" },
    { from: 'p7:Mudanya', to: 'p7.end+0.3', k: 'tartismali', src: "Mudanya'nın düşüşü: ~1321" },
    { from: 'p8:Anlatılır', to: "p8:Bursa'nın-0.3", k: 'rivayet', src: 'Gümüş kubbe: Osmanlı rivayeti' },
  ],
  cards: [
    { from: 'p1:imparatorun', to: 'p1:ovada+0.2', kicker: 'BÖLÜM 3', title: ['KOYUNHİSAR'], sub: 'TARİHE GİRİLEN GÜN', y: 720 },
    { type: 'next', from: 'p8.end+0.9', kicker: 'SIRADAKİ · BÖLÜM 4', title: ['BURSA'], sub: 'AKINCILARDAN DEVLETE' },
  ],
  hits: [
    // Konuşma altındaki vuruşların sesi kısık ya da 0 (yalnız sarsıntı): anlatıcı müziğin ≥ 10 dB üstünde kalsın (ses_olc; Bölüm 2 dersi).
    // Güçlü sesler konuşmasız anlara: doruğun son darbesi (sessizlik başı), sessizlikte def, kapanış kartında davul + gong.
    { at: 'p2:huzursuzdu', amp: 3, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p2:vermişti', amp: 4, sfx: 'vurus/timpani_alcak', gain: .1 },
    { at: 'p3:belirdi', amp: 9, sfx: 'vurus/buyuk_davul_mf', gain: .12 },
    { at: 'p4:hücuma', amp: 6, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: 'p4:dağıldı', amp: 13, sfx: 'vurus/buyuk_davul_ff', gain: .1 },
    { at: 'p4:sığındı', amp: 5, sfx: 'vurus/timpani_alcak', gain: .1 },
    { at: 'p4.end', amp: 6, sfx: 'vurus/buyuk_davul_ff', gain: .7 },              // "Meydan … kaldı." → 2 sn harita sessizliği
    { at: 'p4.end+1.0', amp: 0, sfx: 'ritim/def_buyuk', gain: .45 },              // sessizlikte rüya ağacı filizlenir
    { at: 'p5:Koyunhisar', amp: 10, sfx: 'vurus/buyuk_davul_mf', gain: .1 },
    { at: "p5:Paflagonya'ya", amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p5:koştu', amp: 4, sfx: 'ritim/def_buyuk', gain: .1 },
    { at: 'p5.end', amp: 4, sfx: 'vurus/timpani_alcak', gain: .12 },
    { at: "p6:Bursa'ydı", amp: 5, sfx: 'ritim/def_buyuk', gain: .1 },
    { at: 'p6:değildi', amp: 6, sfx: 'vurus/timpani_alcak', gain: .1 },
    { at: 'p6:diktirdi', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .1 },
    { at: "p6:Aktimur'u", amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: "p6:Balabancık'ı", amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p7:düşünce', amp: 9, sfx: 'vurus/buyuk_davul_ff', gain: .1 },
    { at: 'p8.end+0.9', amp: 4, sfx: 'vurus/buyuk_davul_mf', gain: .45 },        // sıradaki kartı
    { at: 'p8.end+0.9', amp: 0, sfx: 'vurus/gong_mf', gain: .3 },
  ],
  risers: [   // kısık timpani ruloları: konuşmanın altında kalır, sesi vuruşa varır
    { to: 'p3:belirdi', sfx: 'vurus/timpani_rulo_2', gain: .08 },
    { to: 'p4.end', sfx: 'vurus/timpani_rulo', gain: .1 },
    { to: 'p8.end+0.9', sfx: 'vurus/timpani_rulo_2', gain: .1 },
  ],
  blur: [ { from: 'p4:hücuma-0.2', to: 'p4:dağıldı+0.8' } ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi]. Konuşma altındaki yatak kısık (gain 0.17, duckDb 15);
  // konuşmasız iki an (harita sessizliği, kapanış kartı) aynı parçanın senkronlu ayrı, yüksek kopyasıyla öne çıkar.
  music: [
    { from: 'p1', to: 'p2-0.3', style: 'trk:bizans', sync: ['p1:imparatorun', 42], gain: .17, fallback: 'lib:byz' },            // Bölüm 2'nin kapanış tarzı: imparatorun ordusu
    { from: 'p2-0.3', to: 'p3-0.3', style: 'trk:saray', sync: ['p2:Ama', 18], gain: .17, fallback: 'lib:dark' },                // B motifi "Ama"da: huzursuz ordu
    { from: 'p3-0.3', to: 'p4.end', style: 'trk:akin', sync: ['p4:dağıldı', 38], gain: .17, fallback: 'lib:battle' },          // doruk "dağıldı"da
    { from: 'p4.end', to: 'p4.end+0.8', style: 'trk:akin', sync: ['p4:dağıldı', 38], gain: .75, fallback: 'lib:battle' },     // harita sessizliği: müzik öne çıkar
    { from: 'p5-0.3', to: 'p6:Ama-0.2', style: 'trk:destan', sync: ['p5:Koyunhisar', 30], gain: .17, fallback: 'lib:theme' },  // motif "Koyunhisar"da
    { from: 'p6:Ama-0.2', to: 'p7:arada-0.45', style: 'trk:saray', sync: ['p7:yıllarca', 38], gain: .17, fallback: 'lib:dark' }, // tik-tak: yıllar süren abluka
    { from: 'p7:arada-0.45', to: 'p8-0.3', style: 'trk:agit', sync: ['p7:hastalandı', 23], gain: .17, fallback: 'lib:dark' },   // yaşlanan Osman, yalnız kalan Bursa
    { from: 'p8-0.3', to: "p8:Bursa'nın-0.3", style: 'trk:rivayet', sync: ['p8:gümüş', 36.5], gain: .17, fallback: 'lib:dream' }, // el çanı motifi "gümüş"te
    { from: "p8:Bursa'nın-0.3", to: 'p8.end', style: 'trk:kurulus', sync: ['p8:açılacakları', 20], gain: .17, fallback: 'lib:theme' }, // ney motifi "açılacakları"nda
    { from: 'p8.end', to: 'end', style: 'trk:kurulus', sync: ['p8:açılacakları', 20], gain: .75, fallback: 'lib:theme' },     // kapanış kartı
  ],
};
