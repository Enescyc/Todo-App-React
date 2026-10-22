// Sezon 1 · Bölüm 4: Bursa: Akıncılardan Devlete. Zamanlar kelime çapalarıyla (bkz. shared/engine.js). Seslendirme: Emrullah Uzun (bekleniyor).
// Metin: SENARYOLAR.md → Bölüm 4 (onaylı, 22 Ekim 2026; kelimesi kelimesine, 9 paragraf). Olgular: FACTS.md. Çekimler: STORYBOARD.md.
// Ses gelene kadar tahmini hece hızı (rate 6.5); vo/full.mp3 gelince make_audio hizalar ve bütün çapalar kendiliğinden kayar.
window.EP = {
  series: { season: 'UÇTAKİ BEYLİK', n: 4, of: 10 },
  rate: 6.5, lead: .8, gap: .6, tail: 4.4, film: false, duckDb: 15,
  paras: [
    { text: "Bin üç yüz yirmi altı baharında, yıllarca süren kuşatmanın sonunda Bursa'nın kapıları açıldı. Şehir kılıçla değil bir anlaşmayla teslim oldu: kimseye dokunulmayacak, gitmek isteyen malını alıp gidecekti.",
      hl: ["Bursa'nın", "açıldı", "anlaşmayla"] },
    { text: "Ama Osman bu günü göremedi; beyliğin başında artık oğlu Orhan vardı. Orhan babasını Bursa'da, eski bir manastırın gümüş kubbesinin altına gömdü.",
      hl: ["Osman", "Orhan", "gümüş"] },
    { text: "Bursa, Orhan'ın elinde beyliğin yeni merkezine dönüştü. Burada basılan akçelerin üzerinde artık Orhan'ın adıyla birlikte şehrin adı yazıyordu.",
      hl: ["merkezine", "akçelerin", "şehrin"] },
    { text: "Bizans bu yükselişe seyirci kalmadı. Bin üç yüz yirmi dokuz yazında imparator Üçüncü Andronikos, kuşatma altındaki İznik'i kurtarmak için ordusuyla Boğaz'ı geçti. Ama Pelekanon'da bacağından yaralanınca \"İmparator ölüyor\" sözü bir anda yayıldı ve ordu dağıldı.",
      hl: ["Andronikos", "Pelekanon'da", "dağıldı"], pause: 2 },            // doruk → 2 sn harita sessizliği (T15)
    { text: "Kurtarılamayan İznik, iki yıl sonra kapılarını Orhan'a açtı. Şehrin büyük kilisesi camiye çevrildi ve Orhan burada, Osmanlıların ilk medresesi olarak hatırlanan okulu kurdu.",
      hl: ["İznik", "camiye", "medresesi"] },
    { text: "Bu yıllarda Fas'tan gelen gezgin İbn Battûta da Orhan'ın topraklarından geçti. Ona göre Orhan, Türkmen beylerinin en zenginiydi: yüz kadar kalesi vardı ve vaktinin çoğu onları tek tek dolaşmakla geçiyordu.",
      hl: ["İbn", "Battûta", "zenginiydi", "yüz"] },
    { text: "Geriye Bizans'ın bölgedeki son büyük şehri İzmit kalmıştı. Bin üç yüz otuz yedide erzakı tükenince o da teslim oldu ve Bitinya'nın üç büyük şehri Orhan'ın eline geçti.",
      hl: ["İzmit", "teslim", "Bitinya'nın"] },
    { text: "Fetihlerin ardından Orhan Bursa'yı imar etti. Surların dışında bir cami, bir aşevi ve bir han yaptırdı. Çarşı bu hanın çevresinde büyüdü ve uçtaki beylik bir devlete dönüştü.",
      hl: ["cami", "aşevi", "han", "devlete"] },
    { text: "Ama Bizans'ın asıl yarası dışarıdan değil, içeriden açılacaktı.",
      hl: ["dışarıdan", "içeriden"] },
  ],
  scenes: [
    { id: 'kapi', from: 'p1' },                                                         // 1326 baharı: Bursa'nın kapısı açılır (Uludağ arkada)
    { id: 'anlasma', from: 'p1:Şehir-0.2' },                                            // kılıç kınına girer, anlaşmaya mühür basılır
    { id: 'cikis', from: 'p1:kimseye-0.2' },                                            // aynı kapıdan halk eşyasıyla çıkar; atlılar kenarda, mızraklar dik
    { id: 'tug', from: 'p2-0.3' },                                                      // akşam: Osman'ın tuğu söner, Orhan'ınki ışığı alır
    { id: 'kubbe', from: 'p2:Orhan#2-0.25' },                                           // #1 = "Orhan vardı"; hisarda gümüş kubbe (Bölüm 3'ün karşılığı)
    { id: 'merkez', from: 'p3-0.3', note: 'YAKLAŞIK SINIRLAR · 1326' },                // Bursa kızıla döner; Söğüt'ten Bursa'ya altın iz
    { id: 'akce', from: 'p3:Burada-0.2' },                                              // yakın plan akçe: ORHAN + BURSA
    { id: 'bizans', from: 'p4-0.3', note: 'YAKLAŞIK SINIRLAR · 1329' },                // sikke haritaya düşer → Konstantinopolis'e uçuş, 1329
    { id: 'sefer', from: 'p4:kuşatma-0.2', note: 'YAKLAŞIK SINIRLAR · 1329' },         // İznik kuşatması; mor ok Boğaz'ı geçer
    { id: 'pelekanon', from: 'p4:Ama-0.2', note: 'YAKLAŞIK SINIRLAR · 1329' },          // Pelekanon: yara, söylenti halkaları, ordu dağılır
    { id: 'sessizlik', from: 'p4.end+0.2', note: 'YAKLAŞIK SINIRLAR · 1329' },          // 2 sn harita sessizliği: mor noktalar denize çekilir, İznik yalnız
    { id: 'iznik', from: 'p5-0.3', note: 'YAKLAŞIK SINIRLAR · 1331' },                 // İznik kapılarını açar (1329 → 1331)
    { id: 'kilise', from: 'p5:Şehrin-0.2' },                                            // büyük kilise; yanında minare yükselir
    { id: 'medrese', from: 'p5:Orhan#2-0.25' },                                         // #1 = "Orhan'a"; medrese avlusu, kandiller, rahle
    { id: 'gezgin', from: 'p6-0.3' },                                                   // İbn Battûta: yoldaki gezgin
    { id: 'kaleler', from: 'p6:Ona-0.25', note: 'YAKLAŞIK SINIRLAR · ~1333' },          // zenginlik (akçe akışı), kale işaretleri, kaleleri dolaşan iz
    { id: 'izmit', from: 'p7-0.3', note: 'YAKLAŞIK SINIRLAR · 1337' },                 // aynı kamera: İzmit kuşatması, 1333 → 1337
    { id: 'bitinya', from: "p7:Bitinya'nın-0.2", note: 'YAKLAŞIK SINIRLAR · 1337' },  // Bursa, İznik, İzmit: üç şehir
    { id: 'imar', from: 'p8-0.3' },                                                     // Bursa manzarası: surların dışında cami, aşevi, han
    { id: 'carsi', from: 'p8:Çarşı-0.2' },                                              // hanın çevresinde çarşı; sezon ağacı büyür
    { id: 'yara', from: 'p9-0.3', note: 'YAKLAŞIK SINIRLAR · ~1340' },                 // Konstantinopolis: taç içeriden çatlayıp ikiye bölünür
  ],
  transitions: [
    { at: 'p1:Şehir-0.2', type: 'dive', d: .3 },            // kapının ışığına dalış → anlaşma
    { at: 'p1:kimseye-0.2', type: 'dip', d: .25 },
    { at: 'p2-0.3', type: 'dip', d: .3 },                   // sabah → akşam
    { at: 'p2:Orhan#2-0.25', type: 'dip', d: .3 },
    { at: 'p3-0.3', type: 'rise', d: .3 },                  // kubbeden haritaya geri çekiliş
    { at: 'p3:Burada-0.2', type: 'dive', d: .3 },           // Bursa noktasına dalış → akçe
    { at: 'p4-0.3', type: 'dive', d: .3 },                  // akçe haritaya düşer
    { at: 'p5:Şehrin-0.2', type: 'dive', d: .3 },           // İznik'e dalış → kilise
    { at: 'p5:Orhan#2-0.25', type: 'dip', d: .25 },
    { at: 'p6-0.3', type: 'dip', d: .3 },
    { at: 'p6:Ona-0.25', type: 'rise', d: .3 },             // yoldan haritaya
    { at: 'p8-0.3', type: 'dive', d: .35 },                 // haritada Bursa'ya dalış → şehir
    { at: 'p9-0.3', type: 'rise', d: .3 },                  // şehirden haritaya
  ],
  badges: [   // src ≤ ~40 karakter; her satır FACTS.md'de
    { from: "p1:Bursa'nın", to: 'p1:Şehir-0.15', k: 'belge', src: "Bursa'nın teslimi: 1326" },
    { from: 'p1:Şehir', to: 'p1.end+0.3', k: 'tartismali', src: 'Teslim şartları: İnalcık, 2009' },
    { from: 'p2', to: 'p2:Orhan#2-0.3', k: 'tartismali', src: "Osman'ın ölümü: ~1324" },
    { from: 'p2:Orhan#2', to: 'p2.end+0.3', k: 'belge', src: 'Gümüşlü Kümbet, Bursa' },
    { from: 'p3', to: 'p3:Burada-0.3', k: 'tartismali', src: "Merkez Bursa'ya: ~1326" },
    { from: 'p3:Burada', to: 'p3.end+0.3', k: 'belge', src: 'Orhan akçesi: Bursa, H. 727' },
    { from: 'p4:Bin', to: 'p4.end+1.9', k: 'belge', src: 'Pelekanon: Kantakuzenos, Gregoras' },
    { from: 'p5', to: 'p5:Şehrin-0.3', k: 'belge', src: "İznik'in teslimi: 1331" },
    { from: 'p5:Şehrin', to: 'p5:Orhan#2-0.3', k: 'tartismali', src: 'Kilise → cami: Âşıkpaşazâde' },
    { from: 'p5:Orhan#2', to: 'p5.end+0.3', k: 'tartismali', src: 'İznik Medresesi: ilk olarak anılır' },
    { from: 'p6:İbn', to: 'p6.end+0.3', k: 'belge', src: "İbn Battûta'nın gözlemi, 1330'lar" },
    { from: 'p7:Bin', to: 'p7:erzakı-0.15', k: 'belge', src: "İzmit'in teslimi: 1337" },
    { from: 'p7:erzakı', to: "p7:Bitinya'nın-0.3", k: 'tartismali', src: 'Teslim nedeni: TDV «İzmit»' },
    { from: "p7:Bitinya'nın", to: 'p7.end+0.3', k: 'belge', src: 'Bursa, İznik, İzmit: 1326–1337' },
    { from: 'p8:Surların', to: 'p8.end+0.3', k: 'belge', src: 'Orhan Gazi külliyesi: 1339–40' },
  ],
  cards: [
    { from: 'p1:baharında+0.2', to: 'p1:kapıları', kicker: 'BÖLÜM 4', title: ['BURSA'], sub: 'AKINCILARDAN DEVLETE', y: 800 },
    { type: 'next', from: 'p9.end+0.9', kicker: 'SIRADAKİ · BÖLÜM 5', title: ['İMPARATORUN', 'KIZI'] },
  ],
  hits: [
    // Konuşma altındaki vuruşlar kısık ya da yalnız sarsıntı (anlatıcı müziğin ≥ 10 dB üstünde kalsın); güçlü vuruşlar konuşmasız anlarda.
    { at: 'p1:açıldı', amp: 8, sfx: 'vurus/buyuk_davul_mf', gain: .12 },          // kapı açılır
    { at: 'p1:anlaşmayla+0.3', amp: 5, sfx: 'vurus/timpani_alcak', gain: .12 },   // mühür
    { at: 'p2:göremedi', amp: 0, sfx: 'vurus/timpani_alcak', gain: .08 },
    { at: 'p3:merkezine', amp: 4, sfx: 'ritim/def_buyuk', gain: .12 },
    { at: 'p3:basılan', amp: 3, sfx: 'ritim/def_kucuk', gain: .1 },
    { at: 'p4:Bin', amp: 0, sfx: 'ritim/def_boguk', gain: .12 },
    { at: 'p4:geçti', amp: 6, sfx: 'vurus/buyuk_davul_mf', gain: .1 },
    { at: "p4:Pelekanon'da", amp: 8, sfx: 'vurus/timpani_alcak', gain: .14 },
    { at: 'p4:yaralanınca', amp: 9, sfx: 'vurus/buyuk_davul_mf', gain: .1 },
    { at: 'p4:dağıldı', amp: 13, sfx: 'vurus/buyuk_davul_ff', gain: .1 },
    { at: 'p4.end', amp: 5, sfx: 'vurus/buyuk_davul_ff', gain: .7 },              // doruğun son darbesi → 2 sn harita sessizliği
    { at: 'p4.end+1.0', amp: 0, sfx: 'ritim/def_buyuk', gain: .45 },              // sessizlikte mor ordu denize çekilir
    { at: 'p5:açtı', amp: 8, sfx: 'vurus/timpani_alcak', gain: .14 },
    { at: 'p5:camiye', amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p6:yüz', amp: 4, sfx: 'ritim/def_buyuk', gain: .12 },
    { at: 'p7:İzmit', amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: 'p7:teslim', amp: 9, sfx: 'vurus/buyuk_davul_mf', gain: .12 },
    { at: 'p7:üç#2', amp: 0, sfx: 'ritim/def_boguk', gain: .1 },
    { at: "p7:Orhan'ın", amp: 5, sfx: 'ritim/def_buyuk', gain: .12 },
    { at: 'p8:cami', amp: 0, sfx: 'ritim/def_kucuk', gain: .1 },
    { at: 'p8:aşevi', amp: 0, sfx: 'ritim/def_kucuk', gain: .1 },
    { at: 'p8:han', amp: 3, sfx: 'ritim/def_buyuk', gain: .1 },
    { at: 'p8:dönüştü', amp: 6, sfx: 'vurus/buyuk_davul_mf', gain: .12 },         // sezon ağacı tamamlanır
    { at: 'p9:içeriden', amp: 10, sfx: 'vurus/buyuk_davul_ff', gain: .1 },        // taç çatlar
    { at: 'p9.end', amp: 6, sfx: 'vurus/buyuk_davul_ff', gain: .6 },
    { at: 'p9.end+0.9', amp: 4, sfx: 'vurus/buyuk_davul_mf', gain: .45 },          // sıradaki kartı
    { at: 'p9.end+0.9', amp: 0, sfx: 'vurus/gong_mf', gain: .3 },
  ],
  risers: [   // kısık timpani ruloları: konuşmanın altında kalır, sesi konuşmasız vuruşa varır
    { to: 'p4.end', sfx: 'vurus/timpani_rulo', gain: .1 },
    { to: 'p9.end+0.9', sfx: 'vurus/timpani_rulo_2', gain: .1 },
  ],
  blur: [ { from: 'p4:dağıldı-0.1', to: 'p4:dağıldı+0.7' } ],
  // müzik: shared/muzik tarz parçaları; sync = [çapa, parçanın saniyesi], fallback = parça yoksa kütüphane stili.
  // Konuşma altındaki yatak kısık (gain 0.17, duckDb 15; Bölüm 2'de ses_olc ile doğrulanan düzen); konuşmasız iki an
  // (harita sessizliği, sıradaki kartı) aynı parçanın senkronlu, yüksek kopyasıyla öne çıkar.
  // Leitmotif kafiyesi: destan motifi üç "kapı" anında: Bursa "açıldı", İznik "açtı", beylik "devlete" (doruk).
  music: [
    { from: 'p1-0.3', to: 'p2-0.3', style: 'trk:destan', sync: ['p1:açıldı', 30], gain: .17, fallback: 'lib:theme' },         // tam motif kapı açılırken
    { from: 'p2-0.3', to: 'p3-0.3', style: 'trk:agit', sync: ['p2:gümüş', 23.1], gain: .17, fallback: 'lib:dark' },            // yarım kalan motif kubbede
    { from: 'p3-0.3', to: 'p4-0.3', style: 'trk:kurulus', sync: ['p3:akçelerin', 20], gain: .17, fallback: 'lib:theme' },      // ney motifi akçede
    { from: 'p4-0.3', to: 'p4:Ama-0.2', style: 'trk:bizans', sync: ['p4:imparator', 42.2], gain: .17, fallback: 'lib:byz' },    // motif iması "imparator"da
    { from: 'p4:Ama-0.2', to: 'p4.end', style: 'trk:akin', sync: ['p4:dağıldı', 38], gain: .17, fallback: 'lib:battle' },      // doruk "dağıldı"da
    { from: 'p4.end', to: 'p4.end+0.8', style: 'trk:akin', sync: ['p4:dağıldı', 38], gain: .75, fallback: 'lib:battle' },      // harita sessizliği: müzik öne çıkar
    { from: 'p5-0.3', to: 'p6-0.3', style: 'trk:destan', sync: ['p5:açtı', 30], gain: .17, fallback: 'lib:theme' },           // tam motif İznik "açtı"da
    { from: 'p6-0.3', to: 'p7-0.3', style: 'trk:kurulus', sync: ['p6:Battûta', 20], gain: .17, fallback: 'lib:theme' },        // ney motifi gezginde
    { from: 'p7-0.3', to: 'p8-0.3', style: 'trk:saray', sync: ['p7:İzmit', 18.3], gain: .17, fallback: 'lib:tension' },        // bas motifi İzmit kuşatmasında
    { from: 'p8-0.3', to: 'p9-0.3', style: 'trk:destan', sync: ['p8:devlete', 42.6], gain: .17, fallback: 'lib:theme' },       // doruk "devlete"de
    { from: 'p9-0.3', to: 'p9.end', style: 'trk:saray', sync: ['p9:içeriden', 38.3], gain: .17, fallback: 'lib:dark' },        // gerilim "içeriden"de
    { from: 'p9.end', to: 'end', style: 'trk:saray', sync: ['p9:içeriden', 38.3], gain: .7, fallback: 'lib:dark' },           // sıradaki kartı
  ],
};
