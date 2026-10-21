# Bebar Bilim: anlatım analizi

> Kaynak: YouTube Türkçe altyazıları (9 video otomatik, 1 video elle yazılmış), 21 Ekim 2026. Transkriptler `strateji/transkript/bebar-bilim/` altında ve git dışında. Bu dosyadaki alıntılar kısa tutuldu (12 adet). Amaç cümle değil, teknik almak.

## 1. Künye
- **Kanal:** Bebar Bilim (`@BebarBilim`). 1,53 milyon abone, 513 uzun video (ortalama 12 dk) ve yaklaşık 200 Shorts.
- **Çizgi:** Bilim, uzay ve teknoloji ağırlıklı. Son bir yılda "Her Şeyin Tarihi" serisiyle (Roma, Orta Çağ, Cengiz–Timur) ve anlatı ağırlıklı tarih belgeselleriyle (İskenderiye, Marcus Aurelius, Tesla) tarihe de giriyor.
- **Seçilen videolar** (10 video: 7 uzun, 3 Shorts; kullanıcının isteğiyle tarih ve anlatı ağırlıklı 3 video eklendi):

| # | Video (id) | Tarih | Süre | Görüntülenme | Neden seçildi |
|---|---|---|---|---|---|
| 1 | Zaman Nedir? #9 (`W_IH8c5JZKE`) | 2019-11 | 14:58 | 4,93 M | En çok izlenen. Tek elle yazılmış altyazı, noktalama tam. |
| 2 | Evrenin Akılalmaz Büyüklüğü! (`8GhKoyWY6fY`) | 2021-01 | 12:51 | 3,58 M | En çok izlenen ikinci video. Ölçek benzetmelerinin örneği. |
| 3 | Kötü Haber: Yapay Zekâ Kendini Kopyalamayı Öğreniyor (`W1kSpErGj9c`) | 2026-10 | 15:13 | 215 B | En yeni. Kanalın bugünkü sesi. |
| 4 | Çalışmak Zorunda Olmadığımız Bir Dünya Mümkün mü? (`iPmJJi7j1UY`) | 2026-10 | 13:24 | 228 B | En yeni ikinci video. Tarihle açılan bir deneme. |
| 5 | Tarihin Reset Tuşları: Cengiz Han ve Timur (`Bw0QHu_19iE`) | 2025-11 | 22:37 | 203 B | Konumuza en yakın video: Moğollar, Timur, Ankara 1402, Fetret. |
| 6 | 22 Dakikada Roma Tarihi (`SOnBGsl4Mmk`) | 2025-11 | 22:10 | 833 B | Tarih serisinin en çok izlenen bölümü. Bizans ile 1453'e kadar gelip orada kesiliyor. |
| 7 | İskenderiye Kütüphanesine Gerçekten Ne Oldu? (`oLF2wrCFeaI`) | 2026-08 | 21:03 | 347 B | Anlatı ağırlıklı yeni tarih belgeseli. Efsaneyi kaynakla düzeltiyor. |
| 8 | Shorts: Yaşam Nasıl Başladı? (`mxZh-c9wHgA`) | 2022-03 | 0:51 | 4,23 M | En çok izlenen Shorts. |
| 9 | Shorts: Maddenin İmkânsız Hali (`jPboFPzhMRw`) | 2026-09 | 2:33 | 2,96 M | En çok izlenen ikinci Shorts. Yeni dönem kısa form. |
| 10 | Shorts: 3. Dünya Savaşının Eşiğinden Nasıl Döndük? (`irU9LM0pSOk`) | 2024-12 | 0:59 | 1,51 M | En çok izlenen tarih Shorts'u. Formatı Reels'imize en yakın video. |

## 2. Nicel tablo
`anlatim_analiz.py` çıktısı (tam çıktı: `strateji/transkript/bebar-bilim/olcum.md`). Boş hücreler otomatik altyazıda noktalama olmadığı için ölçülemedi.

| Video | kelime | süre sn | kel/dk | ort. cümle | vurucu % | uzun % | soru /100 | hitap /100 | biz /100 | şimdiki % | geniş % | geçmiş % | mış % | gelecek % | isim % | geçiş /100 | merak /100 | sayı /100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Zaman Nedir | 1963 | 874 | 135 | 7.8 | 47.4 | 4.8 | 1.63 | 0.41 | 2.39 | 12 | 11 | 13 | 2 | 2 | 61 | 3.26 | 0.82 | 1.99 |
| Evrenin Büyüklüğü* | 1619 | 773 | 126 | | | | 0.56 | 0.56 | 4.82 | (46) | – | (41) | (5) | (7) | – | 3.27 | 0.86 | 4.76 |
| YZ Kendini Kopyalıyor | 2119 | 905 | 140 | 8.6 | 31.4 | 2.0 | 1.70 | 1.84 | 1.89 | 40 | 7 | 5 | 0 | 2 | 44 | 3.87 | 1.13 | 1.37 |
| Çalışmak Zorunda… | 1806 | 796 | 136 | 10.0 | 21.5 | 6.6 | 1.38 | 0.66 | 2.71 | 19 | 8 | 23 | 1 | 3 | 45 | 3.71 | 0.61 | 1.88 |
| Cengiz Han ve Timur | 2586 | 1356 | 114 | 11.4 | 15.9 | 8.8 | 0.15 | 0.08 | 1.04 | 10 | 4 | 53 | 12 | 9 | 12 | 2.59 | 0.54 | 0.43 |
| Roma Tarihi | 2541 | 1330 | 115 | 9.3 | 34.2 | 8.5 | 0.16 | 0.31 | 0.83 | 12 | 9 | 36 | 11 | 14 | 18 | 2.52 | 0.28 | 0.67 |
| İskenderiye | 2526 | 1255 | 121 | 9.5 | 26.7 | 3.0 | 0.28 | 0.63 | 1.66 | 18 | 5 | 35 | 8 | 5 | 29 | 3.84 | 1.46 | 1.50 |
| S: Yaşam* | 115 | 53 | 129 | | | | 0.00 | 0.00 | 0.87 | (29) | – | (57) | (14) | (0) | – | 1.74 | 2.61 | 2.61 |
| S: Maddenin Hali | 315 | 155 | 122 | 10.5 | 26.7 | 6.7 | 1.59 | 0.95 | 1.27 | 23 | 13 | 10 | 3 | 0 | 50 | 4.44 | 1.59 | 1.90 |
| S: 3. Dünya Savaşı* | 138 | 60 | 137 | | | | 0.00 | 0.00 | 0.00 | (11) | – | (68) | (16) | (5) | – | 0.00 | 0.00 | 1.45 |

\* Noktalamasız altyazı. Araç bu videolarda zamanı cümle sonundan değil bütün kelimelerden sayıyor; parantezli değerler karşılaştırmaya katılmadı.

**Kanal ortalamaları**

| Küme | kel/dk | ort. cümle | vurucu % | uzun % | soru /100 | hitap /100 | biz /100 | şimdiki % | geniş % | geçmiş % | mış % | gelecek % | isim % | sayı /100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Uzun form, 7 video | 127 | 9.4 | 29.5 | 5.6 | 0.80 | 0.60 | 2.2 | 18.5† | 7.3† | 27.5† | 5.7† | 5.8† | 34.8† | 1.8 |
| Yalnız tarih videoları (Cengiz, Roma, İskenderiye) | 117 | 10.1 | 25.6 | 6.8 | 0.20 | 0.30 | 1.2 | 13 | 6 | 41 | 10 | 9 | 20 | 0.9 |
| Bilim ve yorum videoları (4) | 134 | 8.8 | 33.4 | 4.5 | 1.30 | 0.90 | 3.0 | 29 | 7 | 21 | 2 | 4 | 38 | 2.5 |
| Shorts, 3 video | 129 | 10.5 | 26.7 | 6.7 | 0.50 | 0.30 | 0.7 | – | – | – | – | – | – | 2.0 |
| **Bizim Bölüm 1 (karşılaştırma)** | 120 | 8.8 | 15 | – | 1.7 | **0** | 0 | – | 62 | – | – | – | – | – |

† Yalnız noktalamalı 6 uzun video.

**Ek ölçümler** (altyazıdaki kelime zaman damgalarından hesaplandı):

| Video | net kel/dk (≥2 sn boşluklar çıkınca) | sessizlik % | soru /dk | hitap /dk* | cümle /dk |
|---|---|---|---|---|---|
| Zaman Nedir | 135 | 0 | 1.44 | 0.34 | 17.2 |
| Evrenin Büyüklüğü | 133 | 5.3 | – | 0.39 | – |
| YZ Kendini Kopyalıyor | 141 | 0.3 | 1.66 | 1.13 | 16.3 |
| Çalışmak Zorunda… | 138 | 0.6 | 1.06 | 0.38 | 13.5 |
| Cengiz Han ve Timur | 115 | 0 | 0.09 | 0.04 | 10.1 |
| Roma Tarihi | 115 | 0 | 0.14 | 0.09 | 12.3 |
| İskenderiye | 121 | 0.3 | 0.34 | 0.43 | 12.6 |
| S: Maddenin Hali | 128 | 3.0 | 1.58 | 0.79 | 11.4 |

\* Burada hitap; siz/sen zamirleri ile "bakın, düşünün, gelin, hadi, hayal" kelimelerinin dakikadaki sayısıdır. Araçtaki "hitap /100" ise bunlara ek olarak "-sınız" eklerini de sayar.

**Okuma:**
- **Hız:** Tarih videolarında hız 115–121 kel/dk, yani yaklaşık 2,0 kel/sn. Bu, Emrullah Uzun'un hızıyla aynı. Bilim ve yorum videolarında hız 2,3 kel/sn'ye çıkıyor.
- **Sessizlik:** Anlatım hiç durmuyor; müzik konuşmanın altında akıyor (sessizlik %0–5).
- **Cümle:** Ortalama cümle kısa (9–10 kelime). Cümlelerin yaklaşık üçte biri 5 kelime ya da daha kısa. Bunların önemli bir kısmı isim cümlesi ("…bu.", "Bilgi.", "Kartacalılar."): uzun form isim cümlesi oranı %35.
- **Zaman:** Tarih videolarında geçmiş zaman (-dı) önde (%41). Ardından şimdiki zaman, -mış ve gelecek zamanın hikâyesi geliyor; sonuncusu "-ecekti" biçimiyle önceden haber veriyor.
- **Bizimle fark:** Geniş zaman neredeyse hiç yok (%6). Bizim Bölüm 1'de bu oran %62.

## 3. Anlatıcı profili
Bebar'ın anlatıcısı kanalın sahibi. Belgeselci değil, **"meraklı bir arkadaş"** gibi konuşuyor. Kendinden birinci tekil şahısla söz ediyor (elinin dolu olduğunu, kendisinin de bazen zorlandığını söylüyor) ve izleyiciyi "biz" diline katıyor (uzun formda 100 kelimede 2,2). Tarih videolarında belgeselci tonuna geçiyor: hitap ve soru 4–5 kat azalıyor, geçmiş zaman ve "-ecekti" öne çıkıyor. Bilim ve gündem videolarında köşe yazarı gibi yorum yapıyor. Mizahı ironi, gündelik deyim ve hafif argo (İngilizceden alınmış gençlik argosu, "yardırmak" gibi fiiller) üzerine kurulu; sıklığı tarihte dakikada 0,1–0,2, bilimde 0,3–0,5, Shorts'ta 1'e yakın. Yargı düzeyi yüksek: tarihî kişiler için hata ve takıntı gibi kesin değerlendirmeler yapıyor, videonun sonunda ahlaki ya da felsefi bir ders veriyor. Duygu tonu sıcak ve teselli edici; uzun videolar aynı veda ritüeliyle bitiyor ("iyi ki varsınız" ve "sevgiler" kalıbı).

## 4. Teknik kataloğu

| # | Teknik | Ne yapıyor | Sıklık | Neden işe yarıyor | Örnek |
|---|---|---|---|---|---|
| 1 | **Zaman damgalı sahne açılışı** | İlk cümle yıl ve tablo veriyor; şimdiki ya da geniş zamanla izleyiciyi doğrudan o güne koyuyor. | Yeni videolarda her açılışta ya bir sahne ya da bir soru var. | Bağlamı tek nefeste kuruyor; harita ve tarih yazısı için doğal bir kare oluyor. | «Yıl 1930. Dünya büyük buhranın ortasında.» (Çalışmak, 0:00) |
| 2 | **Olmasaydı açılışı ve geciken kahraman** | Kanca "olmasaydı" kurgusuyla açılıyor; kahramanın adı videonun yaklaşık %65'ine kadar söylenmiyor. | 3 Shorts'tan 2'sinde; Roma'da "sır"rın cevabı 15 sn sonra geliyor. | Kanca sorusu ancak isim söylendiğinde kapanıyor, izleyici bu yüzden sona kadar kalıyor. | «Bir adam 1962 yılında hayır demeseydi bugün tüm dünya belki de kıyameti yaşamıştı.» (3. DS Shorts, 0:00; isim 0:37'de) |
| 3 | **"X dediler ona" adlandırması** | Kahramanı önce eylemiyle anlatıyor, adını sonra kısa ve törensel bir cümleyle koyuyor. | Cengiz–Timur'da 2 kez. | Destan tadı veriyor; ad bir vuruş anına dönüşüyor (ekranda başlık çakmak için ideal). | «Timur dediler ona da.» (Cengiz–Timur, 2:05) |
| 4 | **Kesik üçleme ve sıralama** | Uzun bir açıklamanın ardından 3–4 kısa yüklemi art arda diziyor. | Tarih videolarında 2–3 dakikada bir. | Ritmi kırıyor ve hızlanma hissi veriyor. Yıkım ve yükseliş anları böyle anlatılıyor. | «Kaçırıldı, köleleştirildi, ihanete uğradı, kabilesiz kaldı.» (Cengiz–Timur, 2:20) |
| 5 | **"Siz oradasınız" kipi** | Konuya geçmeden önce izleyiciyi çağın içine koyuyor ve olayı şimdiki zamanla yaşatıyor. | İskenderiye'de 2 dakikalık bir bölüm; Zaman'da düşünce deneyleri. | Soyut bilgiyi duyuya çeviriyor (fener, liman, ölçek). Merak, bilgi gelmeden önce kuruluyor. | «Ama şöyle düşünün. Milattan önce 2. yüzyılda (…) sıradan bir Yunan ticaret gemisinin kaptanısınız.» (İskenderiye, 1:31) |
| 6 | **"Ama bir saniye" araları: efsaneyi düzeltme** | Anlatıyı durdurup yaygın inancı soruyor; kanıtı ya da bağlamı ekliyor. | Her tarih videosunda 1–3 kez. | İzleyicinin bildiğiyle oynuyor ve "bilmediğimi öğrendim" hissi veriyor. Tartışmalı bilgiyi anlatıya dönüştürüyor. | «Ama bir saniye, biz Cengiz Han'ı çok vahşi biliyoruz, değil mi?» (Cengiz–Timur, 7:06) · «Kısa cevap, çoğu kişinin düşündüğü gibi bir gecede bir yangınla yok olmadı.» (İskenderiye, 12:38) |
| 7 | **Kendine sorup kendin cevaplama** | Kısa bir soru soruyor ve hemen kısa, beklenmedik bir cevap veriyor; cevap çoğu zaman modern bir kelime. | Bilimde dakikada 1–1,7 soru, tarihte dakikada 0,1–0,3. | Soru dikkati topluyor, modern cevap da "tak" diye oturuyor. | «E devlet kontrolünü kaybettiğinde ne olur? Karteller doğar.» (Roma, 13:05) |
| 8 | **Açık döngü: "birazdan"** | Cevabı bilerek sonraya bırakıyor ve bunu açıkça söylüyor. | Uzun videoda 1–2 büyük ve 1–2 küçük döngü. Evren'de 1:18'de açılıp 11:04'te, İskenderiye'deki ana soru 1:12'de açılıp 12:34–19:48'de kapanıyor. | Ara bölümlerde (bağlam, sponsor) izleyiciyi tutuyor. | «Neden olduğunu da birazdan konuşacağız.» (İskenderiye, 10:50; 12:34'te kapanıyor) |
| 9 | **Ölçek benzetmesi ve sayıyı insanileştirme** | Büyük sayıyı gündelik bir ölçüye çeviriyor: bir milyara kadar saymak 32 yıl sürer; Roma 5 milyon km², Moğollar 24 milyon km²; 700 bin tomar, 700 bin kitap demek değil. | Bilimde her 1–2 dakikada; tarihte videoda 2–4 kez. | Sayı akılda kalıyor ve haritada iki alanı yan yana koymak için gerekçe oluyor. | (Evren, 8:05; Cengiz–Timur, 1:10; İskenderiye, 11:00. Alıntı yok, teknik bu.) |
| 10 | **Bugüne köprü** | Eski bir şeyi bugün görülen bir izle bağlıyor: rögar kapağındaki SPQR, "Rubikon'u geçmek" deyimi, "müze" kelimesi, GPS. | Videoda 2–4 kez. | "Bu bana ne ifade ediyor" sorusunu cevaplıyor ve kalıcı bir ipucu bırakıyor. | (Roma, 5:04 ve 13:48; İskenderiye, 5:37. Alıntı yok.) |
| 11 | **Kesin bilgi ile tahmini ayıran dil** | Kaynağın adını veriyor (Strabon, Ammianus Marcellinus, "antik kaynaklar"); belirsizliği açıkça söylüyor ("kesin bilmiyoruz", "birçok tarihçi düşünüyor", "rivayete göre", "efsanelere göre"). | İskenderiye'de 10'dan fazla; Cengiz–Timur'da 3–4 kez. | Güven veriyor, belirsizlik de merakın parçası oluyor. Bizim rozet sistemimizin sözlü karşılığı bu. | (İskenderiye, 10:42–19:00; Cengiz–Timur, 0:36 ve 10:24. Alıntı yok.) |
| 12 | **Bölüm sonu özdeyişi ve çaprazlama** | Bir perde ya da video, iki karşıt öğeyi yer değiştiren tek bir cümleyle kapanıyor. | Her uzun videoda 1–3 kez. | Paylaşılabilir ve akılda kalan "son söz" oluyor. | «Çünkü bir kütüphaneyi yok etmek için her zaman kitapları yakmanız gerekmez.» (İskenderiye, 16:59) · «Biri düzen kurarak yıktı, diğeri yıkarak düzen kurdu.» (Cengiz–Timur, 21:35; otomatik altyazı düzeltildi) |
| 13 | **Taşınan imge (leitmotif)** | Bütün videoyu tek bir benzetme taşıyor: fırtına, kasırga, artçı sarsıntı. | Cengiz–Timur'da 10'dan fazla kez. | Ses ve görüntü için ortak bir motif kuruyor (fırtına bulutu harita üzerinde ilerleyebilir). | (Cengiz–Timur, 0:10 → 21:26. Alıntı yok.) |
| 14 | **"-ecekti" ile önceden haber verme** | Olay anlatılırken sonucu önceden fısıldıyor. | Tarihte yüklemlerin %9–14'ü. | Gerilim yaratıyor; izleyici sonucu biliyor ama yolu merak ediyor. | (Roma, Cengiz–Timur boyunca. Alıntı yok.) |
| 15 | **Hafif mizah, argo ve ironi** | Gündelik deyimler ve kendiyle dalga geçme. | Tarihte dakikada 0,1–0,2; bilimde 0,3–0,5. | Anlatıcıyı insanlaştırıyor ve ağır bilgiden sonra izleyiciye nefes aldırıyor. | «Ama yoktu işte. Yok oğlu yoktu.» (Zaman, 3:44) |
| 16 | **Dünya panoraması** | Bir olaydan önce "bu sırada" diye başlayıp 4–6 bölgeyi tek cümleyle dolaşıyor (Bizans, Avrupa, İslam dünyası, Çin, Rusya). | Cengiz–Timur'da 2 kez (2:48 ve 14:48). | Haritada bölge bölge vurgu yapmanın sözlü karşılığı. Bağlamı hızla veriyor. | (Alıntı yok.) |

## 5. Video başına nitel çözümleme (9 soru, kısa)
*Bu bölümde alıntı yok, yalnızca özet var. K = kanca, AD = ilk açık döngü, M = mizah/dk, B = ilk 30 sn'deki bilgi sayısı.*

- **Roma Tarihi (22:10).** (1) K: kuruluş efsanesine dair bir alıntıyla açılış. "En büyük sır" vaadi 0:35'te, cevabı (düzen kurmak) 0:50'de; kanca yaklaşık 60 sn. (2) Belgeselci ama ironi serpiştiriyor, M yaklaşık 0,2. (3) Hitap seyrek ama vurgulu ("unutmayın" ve "anlayacağınız" kalıpları), dizinin önceki bölümlerine göndermeler var. (4) Kronolojik merdiven: Krallık → Cumhuriyet → Galyalılar → Pön Savaşları → Sezar → Pax Romana → bölünme → Bizans; her basamak "Ama" ile dönüyor. AD 0:35→0:50. Son, 1453 öncesinde yarım bir cümleyle kesiliyor. (5) Uzun açıklama cümleleri ile 2–4 kelimelik yağma ve kaçış cümleleri dönüşümlü. (6) Bugüne köprü (SPQR, Rubikon deyimi), Latince sözlerin çevirisi. (7) "Efsanelere göre" ve "kesin olmasa da" kalıpları. (8) Kapanış: asma (cliffhanger). (9) 22 konu, konu başına yaklaşık 1 dk; B yaklaşık 3.
- **Cengiz Han ve Timur (22:37).** (1) K: dizinin önceki bölümüne gönderme, fırtına benzetmesi ve doğum efsanesi; vaat 1:25'te. Kanca yaklaşık 2:10, uzun. (2) Belgeselci ve yorumcu; M yaklaşık 0,1 (geç kalmışlara motivasyon esprisi). (3) "Değil mi?" ile ortak bilgiyi sınıyor. (4) AD: ikinci bir liderden söz edileceği vaadi 1:38'de veriliyor, adı 2:05'te açılıyor, hikâyesi 14:12'de başlıyor. Akış: dünya panoraması → Çin → Harezm → Avrupa → Bağdat → Pax Mongolica → çöküş → Timur → Ankara 1402 → miras → çaprazlama kapanış. (5) Fırtına motifi, kesik sıralamalar. (6) Ölçek (km² karşılaştırması), Pax Romana ile Pax Mongolica benzetmesi. (7) "Efsanelere göre" ve "rivayete göre" kalıpları; Marco Polo için "süslü olabilir ama özü doğru" türü bir dengeleme. (8) Özet çaprazlama, Orta Çağ'ın kapandığı duyurusu, haftaya buluşma sözü. (9) B yaklaşık 2. Ankara 1402 yalnızca 1:20 sürüyor.
- **İskenderiye (21:03).** (1) K: insanın unutkanlığı üzerine felsefi monolog; konu adı 1:10'da, "gelin … bakalım" daveti 1:12'de. Kanca yaklaşık 84 sn. (2) Sıcak ve yer yer esprili (limanda tomar avlayan memurların tarifi); M yaklaşık 0,15. (3) İkinci şahıs kaptan sahnesi (1:31–3:27), "bir düşünün" kalıbı. (4) Ana soru 1:12'de açılıyor, 12:34'te "asıl soruya" dönülüyor. Cevap 4 darbede veriliyor (Sezar, Caracalla, Aurelianus, Serapeum ve Hypatia); her darbe "hikâye burada bitmedi" merdiveniyle bağlanıyor. (5) Bölüm sonunda üçlü olumsuzlama (ne tek bir yangın, ne tek bir hükümdar, ne de tek bir savaş). (6) Sayıyı insanileştirme (tomar ile kitap farkı, okuma yazma oranı, kopya emeği), salon salon bilim insanı turu. (7) Kanalın en titiz videosu: kaynaklar adıyla veriliyor, "kesin bilmiyoruz" tekrar ediyor. (8) Karşı olgu sorusu (yok olmasaydı ne olurdu), özdeyiş, imza veda. (9) İlk 30 sn'de B = 0, sonra yoğunlaşıyor.
- **Zaman Nedir (14:58).** (1) K: 1–2 kelimelik soru parçaları (0:04–0:21) ve Einstein'ın günlüğünde Newton'dan özür dilediği sahne; vaat 1:30'da. Kanca yaklaşık 86 sn. (2) Coşkulu bir arkadaş; M yaklaşık 0,5 (argo, abartı, "sıkı durun" kalıbı). (3) 3:53'te izleyiciden bildiklerini unutmasını istiyor, "hatırladınız mı?" diye soruyor. (4) AD: önceki videonun sonunda bırakılan "bir sorun vardı" cümlesine dönüyor (2:57) ve Merkür'le kapatıyor. (5) Vurucu cümle oranı %47, kanalın en kesik metni. (6) Düşünce deneyleri (tren, güneş yok olursa), ikizlere ad veriyor (Ahmet ve Ayşe), ataş ile Hiroşima benzetmesi, GPS. (7) Bilim videosu, düşük belirsizlik. (8) Kişisel itiraf (fiziğin kendisini anlattığı), bir sonraki buluşma sorusu, imza veda. (9) B yaklaşık 1.
- **Evrenin Büyüklüğü (12:51).** (1) K: izleyiciyi rahat bir yere oturup yolculuğa çıkmaya davet ediyor ve sonda iki ihtimal olduğunu vaat ediyor; yaklaşık 80 sn. (2) Rehber gibi; M yaklaşık 0,45 (mola vermeden araba yolculuğu esprileri). (3) Sürekli "biz" ile yolculuk ediyor ve izleyiciye öneri soruları soruyor. (4) AD: "neden"in cevabı sona bırakılıyor (1:18 → 11:04). Yakından uzağa sıralı kamera: Dünya → Ay → Güneş → Neptün → Voyager → Oort → Proxima → Samanyolu → süperküme → gözlenebilir evren. (5) Aynı ölçüyü tekrar kullanıyor: saatte 100 km giden araba, uçak, Voyager. (6) Bir milyara kadar saymanın 32 yıl sürmesi, bozuk para ile Amerika kıtası benzetmesi. (8) Varoluşçu ders (evren ile insanın bir olduğu), imza veda. (9) B yaklaşık 2.
- **YZ Kendini Kopyalıyor (15:13).** (1) K: felaket tellalı olmadığını söyleyerek kendini savunuyor, korku senaryosunu ikinci şahısla anlatıyor, kısa bir espriyle kötü haberi veriyor; 1:25'te "gelin anlatayım". Ardından 1:26–2:50 arası sponsor. (2) Köşe yazarı; M yaklaşık 0,33. (3) Kanalın en yüksek hitap oranı (100 kelimede 1,84); izleyicinin evindeki eşyaları örnek veriyor. (4) AD: "fişini çekeriz" önermesi 0:30'da açılıp 8:28'de geri dönüyor, 12:30'da kapanıyor. (6) Ölçek (fiber ağın dünyanın çevresini 250 kez dolaşması), ev eşyası benzetmeleri. (7) Kurum ve tarih vererek "birçok uzman" dili. (8) İzleyiciye görüşünü soran tek soru. (9) B yaklaşık 2.
- **Çalışmak Zorunda… (13:24).** (1) K: 1930 sahnesi → Keynes'in kehaneti → izleyiciye haftada 15 saat çalışan birini tanıyıp tanımadığını soran çelişki; 1:47'de "gelin konuşalım", ardından sponsor. (2) Deneme yazarı; M yaklaşık 0,3. (4) Ana soru 1:38'de açılıp 9:55'te geri dönüyor. Önce tarih, sonra veri, sonra iki gelecek senaryosu. (5) Edilgen fiillerle sıralamalar (talep, örgütlenme, mücadele). (7) Kurum, yıl ve deney sayıları veriliyor. (8) Hikâyeyi kimin yazdığına dair özdeyiş. (9) B yaklaşık 4.
- **Shorts: 3. Dünya Savaşı (0:59).** (1) K: olmasaydı cümlesi, 5 sn. (2) Ciddi belgeselci, mizah yok. (4) Kahramanın adı ve reddi 0:37–0:44'te, yani sürenin yaklaşık %65'inde (kahraman an). Tarih (27 Ekim 1962) gerilimi artırıyor. 0:22'de Amerikalıların bilmediği gizli tehlike açılıyor. (8) Tek bir insanın sağduyusu üzerine ders cümlesi. (9) Yaklaşık 140 kelime, 2,3 kel/sn; ilk 30 sn'de 5 bilgi.
- **Shorts: Maddenin İmkânsız Hali (2:33).** (1) K: soğutma eylemini artan tekrarla büyütüyor, 0:26'da "durun anlatayım" ile konuya giriyor. (2) Samimi; M yaklaşık 1,2/dk (Einstein'a takılma, kendi cümlesine ironi). (4) 1:04'te "daha da ileri gidersek ne olur?" sorusu soruluyor, cevabın 100 yıl önce verildiği söyleniyor, isim 1:10'da açılıyor; döngü 6 sn. (8) Kapanışta izleyiciyi konu üzerine düşünmeye çağırıyor. (9) 2,1 kel/sn.
- **Shorts: Yaşam Nasıl Başladı (0:51).** (1) K: dizi adı ve "en zor soru" vaadi. (4) Cevapsız bırakılan bir soru dizisi. (8) Cevabın hâlâ bulunmayı beklediğini söyleyen özdeyiş. (9) Mizah yok, 2,2 kel/sn.

## 6. Yapı haritası
**Uzun form, tarih (20–22 dk):**
`0:00 soğuk açılış (alıntı, felsefi monolog ya da önceki bölüme gönderme; 60–130 sn)` → `"Bugün … bahsedeceğiz / Gelin … bakalım" vaadi` → `(yeni videolarda burada 60–90 sn sponsor)` → `"bu sırada" dünya panoraması ya da "siz oradasınız" sahnesi (1–2 dk)` → `kronolojik kırılma anları: her biri kurulum → kesik doruk → "Yani…" özeti → "Ama…" ile sonrakine dönüş; 2–4 dakikada bir doğrudan ara (efsane düzeltme, bugüne köprü)` → `"gelelim asıl soruya" (ana döngü kapanıyor)` → `tez cümlesi ya da çaprazlama` → `karşı olgu, ders ya da asma` → `dizi köprüsü ("haftaya…")` → `imza veda`.

**Kısa form (50–150 sn):**
`0:00 olmasaydı cümlesi ya da kuralın kendisi (0–5 sn)` → `bağlam (7–12 sn)` → `tarihli tırmanış ve "bilinmeyen şey"` → `kahramanın ya da cevabın açılması (%60–70'te)` → `tehlikenin büyüklüğü` → `tek cümlelik ders`.

**Kısa ve uzun form farkı:**
- Shorts'ta kanca 5 sn, uzun formda 60–130 sn. Uzun formdaki felsefi giriş Shorts'ta hiç yok.
- Shorts'ta mizah artıyor (yeni dönem) ya da tamamen kalkıyor (tarih Shorts'u).
- Shorts'ta hitap ve "biz" dili azalıyor; tarih Shorts'unda ikisi de sıfır.
- Shorts tek bir açık döngü ve tek bir kahraman anı üzerine kurulu.

## 7. Bize ne alınır, ne alınmaz
Çerçeve: tarafsız ve kaynaklı belgesel çizgi, Emrullah Uzun'un ciddi ama sıcak sesi, güven rozetleri (BELGE, TARTIŞMALI, RİVAYET, DOĞRULANACAK) ve 60–90 sn'lik Reels.

**Alınır:**
1. **Zaman damgalı sahne açılışı** (teknik 1). İlk 3 sn'yi bu doldurur. Ekranda tarih kartı, seste tek cümle: örneğin "Yıl bin iki yüz kırk üç. Kösedağ." Haritayla birebir örtüşür. Kanca kuralımızla uyumlu.
2. **Olmasaydı açılışı ve geciken kahraman** (teknik 2). 3. Dünya Savaşı Shorts'u bizim formatımızın neredeyse aynısı: 60 sn, kahraman sürenin yaklaşık %65'inde açılıyor. Bu, storyboard'daki "kahraman an %60–75" kuralımızla örtüşüyor. Bölüm 1'in "Ama o kişi bir Türk değil, bir Bizanslıydı" kapanışı aynı kalıbın bölümler arası versiyonu; bu kalıbı her bölümün içine de taşıyabiliriz.
3. **"Ama bir saniye" ile efsaneyi düzeltme** (teknik 6) ve **kesin bilgiyi tahminden ayıran dil** (teknik 11). Rozet sistemimizin anlatı motoru olabilir. TARTIŞMALI ya da RİVAYET rozetli bir satır, ardından "Kısa cevap: …" ve BELGE rozeti. İskenderiye videosu, belirsizliği söylemenin merakı azaltmadığını, artırdığını gösteriyor.
4. **Bölümde bir kez ölçek ya da bugüne köprü** (teknik 9–10). Örnekler: "Söğüt'ten İznik'e at sırtında iki gün", "beyliğin toprağı bugünkü bir ilçe kadar". Tek cümle yeter, haritada iki alanı yan yana koymaya bağlanır.
5. **Ölçülü hitap.** Bizde hitap sıfır. Bebar'ın tarih videolarındaki düzey (100 kelimede 0,3–0,6) Emrullah Uzun'un ciddi sesine uygun. 120 kelimelik bölümde bu, **bir** "şöyle düşünün" ya da "değil mi?" demek. Soru hedefi bölümde 1–2 soru (birinin cevabı hemen gelir, biri son cümlede kalır).
6. **"X dediler ona" ve kesik üçleme** (teknik 3–4). Yalnızca doruk anında ve bölümde en çok bir kez kullanılmalı. Kullanıcı bölük pörçük dili reddetti; akıcı paragrafın içinde tek bir kesik vuruş, kahraman anına ses ve görüntü vuruşu (hit) için çapa olur.
7. **Taşınan imge** (teknik 13). Sezon boyunca tek bir motif ("uç", "sınır", "fırtına" gibi), müzikteki leitmotif ve haritadaki görsel nesneyle eşlenir.
8. **Anlatı zamanı dengesi.** Kitap dilindeki geniş zamandan (%62) çıkıp tarih videolarındaki karışıma geçmek: olaylar -dı ile, doruk sahnesi şimdiki zamanla, sonuç "-ecekti" ile önceden. Geniş zaman yalnızca genel geçer cümlelerde kalsın.
9. **Sabit bir veda.** Kısa, sıcak ve seriye özgü bir kapanış sözü (Bebar'ın imza vedasının karşılığı) güven ve süreklilik kurar. Örneğin her bölüm aynı iki kelimeyle bitebilir. Dizi kartının seslendirmesi olarak kullanılabilir.

**Alınmaz:**
- **Uzun felsefi giriş.** 60–130 sn'lik soğuk açılış Reels'te izleyiciyi kaçırır.
- **Argo ve sert yargı.** Gençlik argosu ve kişiler hakkında psikolojik teşhis ya da "büyük hata" türü kesin değerlendirmeler. Tarafsız çizgimizde yargı yerine kaynaklar konuşmalı ("kaynaklar ayrışır").
- **Kaynağı belirsiz alıntılar.** Mektuplardan yaklaşık alıntılar (Bayezid–Timur mektuplaşması gibi) ve yorum katılmış nedenler (Hypatia'nın ölümünün tek bir sebebe bağlanması gibi). Bizde böyle bir satır ya RİVAYET rozeti alır ya da metinden çıkar.
- **Bir videoya 22 konu sığdırmak.** Roma videosunda bir yüzyıla 30 sn düşüyor. Bizde tek bir olay ve tek bir kahraman an olmalı.
- **Sponsor ve abone çağrısını anlatının içine koymak.**
- **Kesintisiz anlatım.** Bebar müziğin altında hiç susmuyor. Bizim harita vuruşlarımız 1–2 sn'lik sessizliğe ihtiyaç duyuyor; bunu Anime Tarih'ten alacağız (bkz. `anime-tarih.md`).
