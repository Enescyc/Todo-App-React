/* Osmanlı serisi – zaman haritası sahiplik tablosu (window.OWNERS), şimdilik 1243–1402 (Sezon 1).
 * Geometri: shared/data/anadolu_balkan.js (modern il/bölge birimleri). Biçim için bkz. shared/engine.js "zaman haritası".
 *
 * ⚠ YAKLAŞIK: Ortaçağ sınırları modern il sınırlarıyla çizilemez; her il, dönemin büyük kısmında elinde tutan güce boyanır.
 * Tarihler ARASTIRMA.md'deki kaynaklı tarihlerle uyumludur (Bursa 1326, İznik 1331, İzmit 1337, Gelibolu 1354, Çirmen 1371,
 * Tırnova 1393, Vidin 1396, Ankara 1402). Tartışmalı tarihler uzun geçişle verilir (Edirne 1361→1369, Hamid satışı 1374→1381).
 * Beylikler ve doğu Anadolu için dayanak: İnalcık, Emecen ve TDV İslâm Ansiklopedisi maddelerindeki genel kronoloji;
 * ayrıntılar (ör. bir ilin tam devir yılı) ⚪ doğrulanacak düzeyindedir. Videoda haritanın altına "yaklaşık sınırlar" notu düşülür.
 *
 * Satır biçimi: [yıl, 'KOD' | 'KOD/v' (Osmanlı'ya tabi) | 'KOD/m' (Moğollara tabi) | null, geçiş süresi (yıl, varsayılan 1)] */
(() => {
  const pal = {
    OSM: { c: '#a8322a', n: 'OSMANLI' },
    BIZ: { c: '#7a5a9a', n: 'BİZANS' },
    LAT: { c: '#5f8a5a', n: [[0, 'LATİNLER'], [1261, null]] },        // Latin İmparatorluğu, Venedik, Ceneviz, Haçlı devletleri, Rodos şövalyeleri
    SEL: { c: '#3f7f7a', n: 'SELÇUKLU' },
    ILH: { c: '#5a544a', n: [[0, 'MOĞOLLAR'], [1256, 'İLHANLI']] },
    ORT: { c: '#8c7b5e', n: [[0, 'İLHANLI'], [1335, 'ERETNA'], [1381, 'K. BURHANEDDİN'], [1398, null]] }, // orta Anadolu'da İlhanlı valileri ve ardılları
    BEY: { c: '#c9a564' },                                              // adı verilmeyen küçük Türkmen beylikleri
    GER: { c: '#d4a04a', n: 'GERMİYAN' }, KRS: { c: '#bf8f48', n: 'KARESİ' }, SAR: { c: '#dcb565', n: 'SARUHAN' },
    AYD: { c: '#c98a3e', n: 'AYDIN' }, MEN: { c: '#e0b97a', n: 'MENTEŞE' }, HAM: { c: '#b9894f', n: 'HAMİD' }, TEK: { c: '#cf9f5f', n: 'TEKE' },
    KRM: { c: '#b0702e', n: 'KARAMAN' }, CAN: { c: '#c8a25a', n: 'CANDAR' }, DUL: { c: '#b48c5c', n: 'DULKADİR' },
    TRB: { c: '#9a7ab0', n: 'TRABZON' }, ERM: { c: '#7e8f5a', n: 'KİLİKYA' }, EYY: { c: '#c4ad78', n: 'EYYUBİLER' }, MEM: { c: '#bfa36a', n: 'MEMLÜKLER' },
    ABB: { c: '#6f8a62', n: 'ABBASİLER' },
    BUL: { c: '#5f7fa0', n: 'BULGAR' }, BUT: { c: '#5f7fa0', n: 'TIRNOVA' }, BUV: { c: '#6d8aa8', n: 'VİDİN' },
    SRP: { c: '#3f5f8f', n: [[0, 'SIRP'], [1346, 'SIRP İMP.'], [1371, 'SIRP'], [1402, 'SIRP DESP.']] }, ZET: { c: '#4d6c96', n: 'ZETA' },
    BOS: { c: '#4f7f9f', n: 'BOSNA' }, MAC: { c: '#6f7f9f', n: 'MACAR' }, EFL: { c: '#7f8fa8', n: 'EFLAK' }, BOG: { c: '#8a96ab', n: 'BOĞDAN' },
    ARN: { c: '#6a8095', n: 'ARNAVUT BEYLERİ' }, EPR: { c: '#8a7aa0', n: 'EPİR' }, GUR: { c: '#8f9f7a', n: 'GÜRCÜ' },
    ALT: { c: '#9a8a6a', n: 'ALTIN ORDA' }, DOGU: { c: '#8a8070' }, TIM: { c: '#3e4a3c', n: 'TİMUR' },
  };
  const u = {};
  const set = (keys, list) => keys.forEach(k => { u[k] = list; });
  const T = s => s.split(',').map(x => 'TUR:' + x.trim());
  const B = s => s.split(',').map(x => 'BGR:' + x.trim());
  const G = s => s.split(',').map(x => 'GRC:' + x.trim());
  const R = s => s.split(',').map(x => 'SRB:' + x.trim());

  /* ---------- Bitinya ve Marmara ---------- */
  set(T('Istanbul'), [[0, 'LAT'], [1261, 'BIZ']]);                                  // Konstantinopolis: Latin İmparatorluğu → 1261 Bizans
  set(T('Istanbul-A'), [[0, 'BIZ'], [1337, 'OSM', 2]]);                               // Üsküdar yakası, İzmit ile birlikte
  set(T('Bilecik'), [[0, 'BIZ'], [1299, 'OSM', 2]]);                                  // Söğüt çevresi uçtur; Bilecik, Yarhisar, İnegöl ~1299 (geleneksel)
  set(T('Eskisehir'), [[0, 'SEL'], [1243.5, 'SEL/m', .3], [1299, 'OSM', 4]]);         // Karacahisar–Eskişehir uç bölgesi
  set(T('Sakarya'), [[0, 'BIZ'], [1310, 'OSM', 12]]);                                 // Sakarya vadisi adım adım
  set(T('Bursa'), [[0, 'BIZ'], [1305, 'OSM', 21]]);                                   // kırsal erken, şehir 1326'da (şehir noktası ayrı)
  set(T('Yalova'), [[0, 'BIZ'], [1331, 'OSM', 6]]);
  set(T('Kocaeli'), [[0, 'BIZ'], [1337, 'OSM', 1]]);
  set(T('Düzce'), [[0, 'BIZ'], [1320, 'OSM', 6]]);                                    // Konrapa (Konuralp)
  set(T('Bolu'), [[0, 'SEL'], [1243.5, 'SEL/m', .3], [1300, 'BEY', 4], [1322, 'OSM', 8]]);
  set(T('Balikesir,Çanakkale'), [[0, 'BIZ'], [1297, 'KRS', 6], [1345, 'OSM', 4]]);    // Karesi; ilhak tarihi 1336–1361 arasında tartışmalı
  set(T('Gelibolu'), [[0, 'BIZ'], [1354.2, 'OSM', .5]]);                             // 2 Mart 1354 depremi
  /* ---------- Trakya ---------- */
  set(T('Tekirdag'), [[0, 'BIZ'], [1357, 'OSM', 5]]);
  set(T('Edirne'), [[0, 'BIZ'], [1361, 'OSM', 8]]);                                   // fetih yılı tartışmalı: 1361 / 1363 / 1369
  set(T('Kirklareli'), [[0, 'BIZ'], [1368, 'OSM', 3]]);
  /* ---------- Batı Anadolu beylikleri ---------- */
  const SELm = [[0, 'SEL'], [1243.5, 'SEL/m', .3]];
  set(T('Kütahya'), [...SELm, [1290, 'GER', 10], [1381, 'OSM', 1], [1402.6, 'GER', .4]]);      // 1381 çeyiz (Devlet Hatun)
  set(T('Usak'), [...SELm, [1290, 'GER', 10], [1390, 'OSM', 1], [1402.6, 'GER', .4]]);
  set(T('Afyonkarahisar'), [...SELm, [1300, 'BEY', 4], [1341, 'GER', 4], [1390, 'OSM', 1], [1402.6, 'GER', .4]]);
  set(T('Denizli'), [...SELm, [1290, 'BEY', 6], [1368, 'GER', 2], [1390, 'OSM', 1], [1402.6, 'GER', .4]]);
  set(T('Manisa'), [[0, 'BIZ'], [1313, 'SAR', 3], [1390, 'OSM', 1], [1402.6, 'SAR', .4]]);
  set(T('Izmir'), [[0, 'BIZ'], [1308, 'AYD', 10], [1390, 'OSM', 1], [1402.6, 'AYD', .4]]);
  set(T('Aydin'), [[0, 'BIZ'], [1300, 'BEY', 6], [1308, 'AYD', 4], [1390, 'OSM', 1], [1402.6, 'AYD', .4]]);
  set(T('Mugla'), [[0, 'BIZ'], [1270, 'MEN', 15], [1390, 'OSM', 1], [1402.6, 'MEN', .4]]);
  set(T('Isparta,Burdur'), [...SELm, [1300, 'HAM', 8], [1374, 'OSM', 7], [1402.6, 'KRM', .4]]); // Hamid ilinin satışı 1374/1381
  set(T('Antalya'), [...SELm, [1300, 'BEY', 4], [1321, 'TEK', 5], [1390, 'OSM', 1], [1402.6, 'TEK', .4]]);
  /* ---------- Karadeniz ve Candar ---------- */
  set(T('Kastamonu,Çankiri,Karabük'), [...SELm, [1292, 'CAN', 5], [1392, 'OSM', 1], [1402.6, 'CAN', .4]]);
  set(T('Zinguldak,Bartın'), [[0, 'BIZ'], [1320, 'CAN', 20], [1392, 'OSM', 1], [1402.6, 'CAN', .4]]);
  set(T('Sinop'), [...SELm, [1300, 'BEY', 4], [1322, 'CAN', 3]]);
  set(T('Samsun'), [...SELm, [1300, 'BEY', 4], [1393, 'OSM', 1]]);
  set(T('Trabzon,Rize,Giresun,Gümüshane'), [[0, 'TRB']]);
  set(T('Ordu'), [[0, 'TRB'], [1300, 'BEY', 30]]);
  set(T('Artvin,Ardahan'), [[0, 'GUR']]);
  /* ---------- Orta Anadolu: Selçuklu → İlhanlı → Eretna → Kadı Burhaneddin ---------- */
  const ORTA = [...SELm, [1308, 'ORT', 4]];
  set(T('Ankara,Kinkkale'), [...ORTA, [1354, 'OSM', 2]]);
  set(T('Amasya,Çorum'), [...ORTA, [1392, 'OSM', 1]]);                              // Amasya emiri 1392'de bağlanır; Mehmed Çelebi'nin üssü
  set(T('Tokat'), [...ORTA, [1398, 'OSM', 1]]);
  set(T('Yozgat,Nevsehir,Kirsehir,Kayseri'), [...ORTA, [1398, 'OSM', 1], [1402.6, 'BEY', .4]]);
  set(T('Sivas'), [...ORTA, [1398, 'OSM', 1], [1400.6, 'TIM', .3], [1402.6, 'BEY', .4]]);       // Timur Sivas'ı Ağustos 1400'de alır
  set(T('Konya'), [...SELm, [1308, 'ORT', 2], [1320, 'KRM', 8], [1397, 'OSM', 1], [1402.6, 'KRM', .4]]);
  set(T('Karaman'), [...SELm, [1256, 'KRM', 20], [1397, 'OSM', 1], [1402.6, 'KRM', .4]]);
  set(T('Aksaray'), [...ORTA, [1350, 'KRM', 20], [1397, 'OSM', 1], [1402.6, 'KRM', .4]]);
  set(T('Nigde'), [...ORTA, [1375, 'KRM', 5], [1397, 'OSM', 1], [1402.6, 'KRM', .4]]);
  set(T('Mersin'), [[0, 'ERM'], [1300, 'KRM', 40]]);
  /* ---------- Güneydoğu ve doğu ---------- */
  set(T('Malatya'), [...SELm, [1308, 'ORT', 4], [1366, 'MEM', 5], [1399, 'OSM', 1], [1402.6, 'MEM', .4]]);
  set(T('Erzincan,Bayburt'), [[0, 'SEL'], [1243.5, 'ILH', .3], [1335, 'ORT', 2], [1379, 'DOGU', 2]]);   // Mutahharten (Timur'a tabi)
  set(T('Erzurum'), [[0, 'SEL'], [1243.5, 'ILH', .3], [1335, 'DOGU', 2], [1387, 'TIM', 3]]);
  set(T('Elazig,Tunceli,Bingöl'), [...SELm, [1308, 'ILH', 2], [1335, 'DOGU', 2], [1394, 'TIM', 4]]);
  set(T('Kars,Iğdir,Agri,Van,Mus,Bitlis,Hakkari'), [[0, 'ILH'], [1335, 'DOGU', 2], [1387, 'TIM', 3]]);
  set(T('Diyarbakir,Batman,Mardin,Siirt,Sirnak,Adiyaman'), [[0, 'DOGU'], [1260, 'ILH', 5], [1335, 'DOGU', 2], [1394, 'TIM', 4]]);
  set(T('Gaziantep,Kilis,Sanliurfa'), [[0, 'EYY'], [1260, 'MEM', 3]]);
  set(T('Hatay'), [[0, 'LAT'], [1268, 'MEM', 1]]);                                    // Antakya Haçlı prensliği → 1268 Memlükler
  set(T('Adana,Osmaniye'), [[0, 'ERM'], [1375, 'MEM', 3]]);
  set(T('K. Maras'), [[0, 'ERM'], [1290, 'MEM', 10], [1337, 'DUL', 3]]);
  /* ---------- Bulgaristan ---------- */
  set(B('Plovdiv'), [[0, 'BUL'], [1246, 'BIZ', 4], [1344, 'BUL', 1], [1363, 'OSM', 2]]);              // Filibe 1363 (geleneksel)
  set(B('Pazardzhik,Haskovo,Kardzhali,Smolyan,Stara Zagora'), [[0, 'BUL'], [1246, 'BIZ', 4], [1344, 'BUL', 1], [1356, 'BUT'], [1371, 'OSM', 3]]);
  set(B('Yambol,Sliven,Burgas'), [[0, 'BUL'], [1356, 'BUT'], [1371, 'OSM', 6]]);
  set(B('Sofia,Grad Sofiya,Pernik'), [[0, 'BUL'], [1356, 'BUT'], [1382, 'OSM', 3]]);                  // Sofya 1382/1385
  set(B('Kyustendil,Blagoevgrad'), [[0, 'BUL'], [1330, 'SRP', 4], [1371, 'SRP/v', 1], [1395, 'OSM', 1]]); // Dragaş toprakları; Rovine 1395
  set(B('Veliko Tarnovo,Gabrovo,Lovech,Targovishte,Razgrad,Ruse'), [[0, 'BUL'], [1356, 'BUT'], [1371, 'BUT/v', 5], [1393.5, 'OSM', .5]]); // Tırnova 17 Temmuz 1393
  set(B('Shumen'), [[0, 'BUL'], [1356, 'BUT'], [1371, 'BUT/v', 5], [1388, 'OSM', 1]]);
  set(B('Pleven'), [[0, 'BUL'], [1356, 'BUT'], [1371, 'BUT/v', 5], [1395, 'OSM', 1]]);               // Niğbolu
  set(B('Varna,Dobrich,Silistra'), [[0, 'BUL'], [1388, 'OSM', 4]]);                                   // Dobruca despotluğu
  set(B('Vidin,Montana,Vratsa'), [[0, 'BUL'], [1356, 'BUV'], [1388, 'BUV/v', 1], [1396.8, 'OSM', .4]]); // Vidin, Niğbolu'dan (25 Eylül 1396) sonra
  /* ---------- Yunanistan ---------- */
  set(G('Anatoliki Makedonia kai Thraki'), [[0, 'BIZ'], [1361, 'OSM', 10]]);         // Dimetoka 1361 ... Kavala–Drama 1380'ler
  set(G('Kentriki Makedonia'), [[0, 'BIZ'], [1345, 'SRP', 4], [1371, 'SRP/v', 1], [1383, 'OSM', 4]]); // Serez 1383, Selanik 1387
  set(G('Ayion Oros'), [[0, 'BIZ'], [1345, 'SRP', 2], [1371, 'BIZ', 2]]);
  set(G('Dytiki Makedonia'), [[0, 'EPR'], [1260, 'BIZ', 4], [1348, 'SRP', 4], [1371, 'SRP/v', 1], [1385, 'OSM', 5]]);
  set(G('Thessalia'), [[0, 'EPR'], [1348, 'SRP', 3], [1393, 'OSM', 3]]);
  set(G('Ipeiros,Dytiki Ellada'), [[0, 'EPR']]);
  set(G('Stereá Elláda,Attiki,Kriti,Ionioi Nisoi,Notio Aigaio'), [[0, 'LAT']]);
  set(G('Peloponnisos'), [[0, 'LAT'], [1349, 'BIZ', 2]]);                            // Mora Despotluğu (Latin Ahaya ile paylaşılır)
  set(G('Voreio Aigaio'), [[0, 'BIZ'], [1346, 'LAT', 10]]);                          // Sakız (Ceneviz) 1346, Midilli (Gattilusio) 1355
  /* ---------- Sırbistan, Bosna, Kosova, Makedonya, Arnavutluk ---------- */
  set(R('Južno-Backi,Južno-Banatski,Srednje-Banatski,Zapadno-Backi,Severno-Backi,Severno-Banatski,Sremski'), [[0, 'MAC']]);
  set(R('Grad Beograd'), [[0, 'MAC'], [1284, 'SRP'], [1319, 'MAC']]);
  set(R('Macvanski'), [[0, 'MAC'], [1284, 'SRP'], [1319, 'MAC'], [1380, 'SRP', 5], [1390, 'SRP/v', 1], [1402.6, 'SRP', .4]]);
  set(R('Kolubarski,Šumadijski,Pomoravski,Rasinski,Moravicki,Zlatiborski,Raški,Toplicki,Podunavski,Branicevski,Borski'), [[0, 'SRP'], [1390, 'SRP/v', 1], [1402.6, 'SRP', .4]]);
  set(R('Nišavski,Pirotski,Jablanicki,Pcinjski'), [[0, 'SRP'], [1386, 'OSM', 2]]);   // Niş 1386
  set(R('Zajecarski'), [[0, 'BUL'], [1356, 'BUV'], [1388, 'BUV/v', 1], [1396.8, 'OSM', .4]]);
  set(['C:Kosovo'], [[0, 'SRP'], [1392, 'SRP/v', 1]]);                               // Vuk Branković 1392'de tabi
  set(['C:Macedonia'], [[0, 'BUL'], [1246, 'BIZ', 2], [1282, 'SRP', 30], [1371, 'SRP/v', 1], [1395, 'OSM', 1]]);
  set(['C:Albania'], [[0, 'EPR'], [1350, 'ARN', 10], [1385, 'ARN/v', 5]]);            // Savra 1385; tabiiyet kısmi ve tartışmalı
  set(['C:Montenegro'], [[0, 'SRP'], [1356, 'ZET', 3]]);
  set(['C:Bosnia and Herz.'], [[0, 'BOS']]);
  set(['C:Hungary', 'C:Croatia', 'C:Slovakia'], [[0, 'MAC']]);
  set(['C:Romania'], [[0, null], [1330, 'EFL', 10]]);
  set(['C:Moldova'], [[0, 'ALT'], [1359, 'BOG', 5]]);
  set(['C:Ukraine', 'C:Russia'], [[0, 'ALT']]);
  /* ---------- Kafkasya, İran, Irak, Suriye, Mısır ---------- */
  set(['C:Georgia'], [[0, 'GUR']]);
  set(['C:Armenia', 'C:Azerbaijan'], [[0, 'ILH'], [1335, 'DOGU', 2], [1386, 'TIM', 2]]);
  set(['C:Iran'], [[0, 'ILH'], [1335, 'DOGU', 2], [1381, 'TIM', 6]]);
  set(['C:Iraq'], [[0, 'ABB'], [1258, 'ILH', 1], [1335, 'DOGU', 2], [1393, 'TIM', 1]]);  // Bağdat 1258 Moğollar, 1393 Timur
  set(['C:Syria', 'C:Jordan'], [[0, 'EYY'], [1260, 'MEM', 2]]);
  set(['C:Lebanon', 'C:Israel', 'C:Palestine'], [[0, 'LAT'], [1265, 'MEM', 26]]);     // Haçlı kıyı şeridi → 1291 Akka
  set(['C:Egypt'], [[0, 'EYY'], [1250, 'MEM', 1]]);
  set(['C:Cyprus'], [[0, 'LAT']]);

  // şehir noktaları (ilin genelinden farklı olduğunda)
  const cities = {
    'Söğüt': [[0, 'SEL'], [1280, 'OSM', 2]],
    'Bilecik': [[0, 'BIZ'], [1299, 'OSM']],
    'Bursa': [[0, 'BIZ'], [1326.3, 'OSM', .3]],
    'İznik': [[0, 'BIZ'], [1331.2, 'OSM', .3]],
    'İzmit': [[0, 'BIZ'], [1337, 'OSM', .3]],
    'Konstantinopolis': [[0, 'LAT'], [1261.6, 'BIZ', .3]],
    'Alaşehir': [[0, 'BIZ'], [1390, 'OSM', .3], [1402.6, 'SAR', .3]],                // Philadelphia: Anadolu'da son Bizans şehri
    'Gelibolu': [[0, 'BIZ'], [1354.2, 'OSM', .3]],
    'Edirne': [[0, 'BIZ'], [1361, 'OSM', 8]],
    'Selanik': [[0, 'BIZ'], [1387.3, 'OSM', .3]],
    'Ankara': [[0, 'SEL'], [1243.5, 'SEL/m', .3], [1308, 'ORT', 2], [1354, 'OSM', .5]],
  };
  window.OWNERS = { pal, units: u, cities };
})();
