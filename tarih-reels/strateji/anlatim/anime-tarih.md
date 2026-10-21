# Anime Tarih: anlatım analizi

> Kaynak: YouTube Türkçe altyazıları (6 video otomatik, 1 video elle yazılmış), 21 Ekim 2026. Transkriptler `strateji/transkript/anime-tarih/` altında ve git dışında. Bu dosyada 12 kısa alıntı var. Amaç cümle değil, teknik almak.

## 1. Künye
- **Kanal:** Anime Tarih (`@AnimeTarih`). 823 bin abone, 299 uzun video (ortalama 17 dk). **Kanalda Shorts sekmesi yok.**
- **Çizgi:** Haritalı 2D animasyonla anlatılan siyasi ve askerî tarih: Osmanlı, Türk devletleri, dünya savaşları, Kurtuluş Savaşı ve Türkiye'nin yakın dönem güvenlik tarihi. Görsel dili bizimkine en yakın kanallardan biri: harita, ok, cephe hattı ve tarih kartı.
- **Seçilen videolar** (7 video). Shorts olmadığı için kısa formun yerine kanalın en kısa ve konumuza yakın videosu (5 dk) alındı.

| # | Video (id) | Tarih | Süre | Görüntülenme | Neden seçildi |
|---|---|---|---|---|---|
| 1 | 2. Dünya Savaşı: Haritalı Anlatım, Tek Part Belgesel (`J4UTmm0cBOc`) | 2021-02 | 81:41 | 7,57 M | En çok izlenen |
| 2 | Örgütün Kuruluşuna Giden Yol (`gAf7Uvqhmns`) | 2023-12 | 15:19 | 6,59 M | En çok izlenen ikinci video. Tek elle yazılmış altyazı. Konu yalnızca teknik açısından incelendi. |
| 3 | Kurtuluş Savaşı'nın 3 Kahramanı: Haritalı Anlatım (`uxokP0SdiLQ`) | 2026-10 | 56:44 | 36 B | En yeni. Biyografi formatı. |
| 4 | Tek Videoda 16 Türk Devleti (`NK91iIrlyTs`) | 2026-10 | 34:20 | 73 B | En yeni ikinci video |
| 5 | Osmanlı'nın 600 Yılı: Hangi Padişah Nereleri Fethetti (`UvNpPKKWjwk`) | 2025-10 | 24:16 | 2,90 M | Konumuza en yakın ve kanalın en çok izlenen Osmanlı videosu |
| 6 | İlk Osmanlı Muharebeleri: Kuruluşa Giden Yol (`GSAYx3sJWbM`) | 2025-03 | 13:54 | 124 B | Sezon 1 konumuz (Söğüt, Domaniç, Bilecik, Koyunhisar/Bafeus, 1299–1302) |
| 7 | Fatih Sultan Mehmet ile Kazıklı Voyvoda'nın Savaşı (`n94SvVQDFDI`) | 2020-08 | 5:14 | 81 B | Kanalın en kısa videosu; kısa formun yerine incelendi |

## 2. Nicel tablo
`anlatim_analiz.py` çıktısı (tam çıktı: `strateji/transkript/anime-tarih/olcum.md`). Boş hücreler otomatik altyazıda noktalama olmadığı için ölçülemedi.

| Video | kelime | süre sn | kel/dk | ort. cümle | vurucu % | uzun % | soru /100 | hitap /100 | biz /100 | şimdiki % | geniş % | geçmiş % | mış % | gelecek % | isim % | geçiş /100 | merak /100 | sayı /100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2. Dünya Savaşı | 10066 | 4896 | 123 | 12.9 | 8.4 | 9.3 | 0.02 | 0.06 | 0.31 | 3 | 6 | 63 | 19 | 3 | 7 | 1.23 | 0.38 | 4.79 |
| Örgütün Kuruluşu | 1645 | 866 | 114 | 18.5 | 1.1 | 32.6 | 0.00 | 0.00 | 0.30 | 2 | 27 | 53 | 8 | 2 | 8 | 1.28 | 0.55 | 3.34 |
| Kurtuluş'un 3 Kahramanı | 5870 | 3376 | 104 | 11.7 | 8.5 | 3.6 | 0.00 | 0.20 | 0.22 | 7 | 3 | 80 | 4 | 1 | 5 | 1.12 | 0.53 | 2.78 |
| 16 Türk Devleti | 3260 | 2040 | 96 | 10.9 | 9.0 | 1.0 | 0.00 | 0.18 | 0.15 | 2 | 3 | 82 | 4 | 1 | 8 | 1.10 | 0.61 | 3.74 |
| Osmanlı'nın 600 Yılı | 2515 | 1455 | 104 | 9.9 | 22.8 | 3.1 | 0.08 | 0.08 | 0.60 | 1 | 6 | 72 | 5 | 0 | 17 | 1.47 | 1.03 | 4.73 |
| İlk Osmanlı Muharebeleri* | 1197 | 828 | 87 | | | | 0.00 | 0.08 | 0.25 | (2) | – | (82) | (10) | (6) | – | 0.67 | 0.25 | 2.17 |
| Fatih ve Kazıklı Voyvoda* | 625 | 315 | 119 | | | | 0.00 | 0.16 | 0.32 | (9) | – | (75) | (16) | (0) | – | 1.76 | 1.28 | 2.40 |

\* Noktalamasız altyazı. Zaman değerleri bütün kelimelerden sayıldığı için ortalamaya katılmadı.

**Kanal ortalaması ve karşılaştırma**

| Küme | kel/dk (brüt) | ort. cümle | vurucu % | uzun % | soru /100 | hitap /100 | biz /100 | şimdiki % | geniş % | geçmiş % | mış % | gelecek % | isim % | sayı /100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Anime Tarih, 7 video | 107 | 12.8† | 10.0† | 9.9† | 0.01 | 0.11 | 0.30 | 3.0† | 9.0† | 70.0† | 8.0† | 1.4† | 9.0† | 3.4 |
| Bebar Bilim, tarih videoları (3) | 117 | 10.1 | 25.6 | 6.8 | 0.20 | 0.30 | 1.2 | 13 | 6 | 41 | 10 | 9 | 20 | 0.9 |
| **Bizim Bölüm 1** | 120 | 8.8 | 15 | – | 1.7 | **0** | 0 | – | 62 | – | – | – | – | – |

† Yalnız noktalamalı 5 video.

**Ek ölçümler: konuşma ve sessizlik** (kelime zaman damgalarından)

| Video | brüt kel/dk | net kel/dk (≥2 sn boşluklar çıkınca) | sessizlik % | ≥2 sn sessiz ara | ilk söz (sn) | soru /dk | hitap /dk | cümle /dk |
|---|---|---|---|---|---|---|---|---|
| 2. Dünya Savaşı | 123 | 134 | 8.2 | 109 (1,3/dk) | 7 | 0.02 | 0.10 | 9.1 |
| Örgütün Kuruluşu | 114 | 118 | 3.6 | 10 | 33 | 0 | 0 | 6.2 |
| Kurtuluş'un 3 Kahramanı | 103 | 118 | 12.7 | 103 (1,8/dk) | 8 | 0 | 0.18 | 8.3 |
| 16 Türk Devleti | 97 | 109 | 10.8 | 48 | 50 | 0 | 0.15 | 8.2 |
| Osmanlı'nın 600 Yılı | 104 | 108 | 3.8 | 19 | 2 | 0 | 0.08 | 9.9 |
| İlk Osmanlı Muharebeleri | 87 | 118 | **25.7** | 39 (2,9/dk) | 1 | – | 0.07 | – |
| Fatih ve Kazıklı Voyvoda | 120 | 123 | 2.6 | 1 | 0 | – | 0 | – |
| **Ortalama** | 107 | **118** | **9.6** | yaklaşık 1,4/dk, ortalama 4–5 sn | | ≈0 | ≈0,1 | 8.3 |

**Okuma:**
- **Hız:** Net konuşma hızı yaklaşık 2,0 kel/sn, bizim anlatıcımızla aynı. Ancak anlatıcı dakikada 1–3 kez susuyor (ortalama 4–5 sn). Bu boşluklarda haritada bir şey oluyor: ordu ilerliyor, kale düşüyor, sınır değişiyor.
- **Muharebe videoları:** En uzun sessizlikler savaş anlarında. İlk Osmanlı Muharebeleri'nde her muharebeden sonra 10–20 sn'lik müzik ve animasyon arası var; sürenin %26'sı sessiz.
- **Cümle:** Cümleler Bebar'dan uzun (12,8 kelime), vurucu cümle az (%10).
- **Zaman:** Neredeyse yalnızca -dı'lı geçmiş (%70). Biyografilerde şimdiki zamanın hikâyesi yerine geniş zamanın hikâyesi kullanılıyor ("girer", "başlar"): Örgütün Kuruluşu videosunda geniş zaman %27.
- **Hitap ve soru:** İkisi de sıfıra yakın.
- **Sayı:** Sayı yoğunluğu Bebar'ın yaklaşık 3–4 katı (100 kelimede 3,4): her cümlede bir tarih, bir asker sayısı ya da bir yer adı var.

## 3. Anlatıcı profili
Anime Tarih'in anlatıcısı bir **ders kitabı anlatıcısı ya da haber spikeri**: kronolojik, nötr, sayı ve isim yoğun. Kendini nadiren gösteriyor. Kanal sesi çoğulla konuşuyor ("sizlere anlattık", "iyi seyirler dileriz"); yalnızca açılış ve kapanış çağrılarında tekile geçiyor. İzleyiciye neredeyse hiç seslenmiyor ve soru sormuyor; merak, başlık, küçük resim ve haritanın kendisinden geliyor. Mizah yok denecek kadar az (dakikada 0–0,05); birkaç gündelik deyim ve olayların yan yana konmasından doğan ironi dışında ton düz. Yargı düzeyi düşük ama kalıplaşmış: kahramanlar için tören dili (adını tarihe altın harflerle yazdırmak), talihsiz padişah ya da "en ciddi hata" türü tek kelimelik etiketler. Tartışmalı noktalarda seçenekleri sayıyor ve zaman zaman kaynağın adını veriyor. Bu yönüyle bizim rozet çizgimize Bebar'dan daha yakın. Güçlü yanı ritmin haritaya bırakılması: anlatıcı susuyor, harita konuşuyor.

## 4. Teknik kataloğu

| # | Teknik | Ne yapıyor | Sıklık | Neden işe yarıyor | Örnek |
|---|---|---|---|---|---|
| 1 | **Tarih ve yer levhası** | Bölümü ya da sahneyi "tarih, yer" kalıbıyla açıyor; ardından müzik arası ve harita. | Muharebe videolarında açılışta; biyografilerde her bölüm başında. | İzleyiciyi bir saniyede konumlandırıyor. Ekrandaki tarih kartıyla birebir örtüşüyor. | «Tarih 13. yüzyılın ortaları, yer Söğüt ve çevresi.» (İlk Osmanlı, 0:31; otomatik altyazıya noktalama eklendi) |
| 2 | **"Tarihler … gösterdiğinde" geçişi** | Yıllar arasında atlarken tarihi öznenin önüne koyuyor. | Biyografilerde 3–6 dakikada bir. | Zaman atlamasını yumuşatıyor ve haritada yıl sayacını ilerletmek için çapa oluyor. | «Tarihler 1912 yılını gösterip Balkan Savaşı patlak verdiğinde…» (Kurtuluş'un 3 Kahramanı, 3:43) |
| 3 | **Kapsam vaadi ve sayıyla kanca** | Açılışta büyük bir sayı ve "tek video" vaadi veriyor ya da tanım, sayı ve neden sorusunu art arda diziyor. | Uzun derleme videolarında. | Ne alacağını bilen izleyici kalıyor; sayı büyüklük hissi veriyor. | «623 yıllık Osmanlı İmparatorluğu toplam 36 padişah tarafından yönetildi. Biz de sizlere bu 36 padişahı tek bir videoda anlattık.» (600 Yılı, 0:02) · «Peki tüm dünyanın birbirine acımasızca saldırdığı 50 milyon insanın hayatına mal olan savaşın sebepleri neydi? Hadi gelin daha ayrıntılı anlatayım.» (2. Dünya Savaşı, 0:26) |
| 4 | **Sabit kalıplı envanter** | Her birim aynı sırayla anlatılıyor: sıra numarası → tahta çıkış → süre → fetihler listesi → en önemli olay → ölüm nedeni. | 600 Yılı'nda 36 kez; 16 Türk Devleti'nde 16 kez. | Tahmin edilebilir bir ritim kuruyor; liste harita üzerinde tek tek yanıp sönen yerlere çevrilebiliyor. | «Birinci sırada Osmangazi var.» (600 Yılı, 0:27) |
| 5 | **Sessiz harita araları** | Anlatıcı susuyor, müzik ve animasyon (ordu oku, kuşatma, sınır değişimi) konuşuyor. | Dakikada 1–3 kez, ortalama 4–5 sn; muharebelerde 10–20 sn. | Bilgi yoğun cümlelerden sonra nefes aldırıyor ve görsele "kahraman an" alanı açıyor. | (İlk Osmanlı: 2:47, 3:13, 4:51, 8:01, 12:03 ve 12:45'te 12–20 sn'lik aralar. Alıntı yok.) |
| 6 | **Açık döngü: "birazdan"** | Akademik bir tartışmayı ya da tarihi açıp cevabı muharebenin sonuna bırakıyor. | Videoda 0–1 kez (kanalda nadir). | Kuru kronolojiye bir merak ipi ekliyor. Bizim TARTIŞMALI rozetimize birebir uyuyor. | «…Halil İnalcık Osmanlı Devleti'nin kuruluş yılını 1299 değil 1302 olarak kabul etmiştir. Bunun nedenini birazdan anlatacağız.» (İlk Osmanlı, 8:44; 13:05'te Bafeus ile kapanıyor) |
| 7 | **Kaynakla yaygın bilgiyi düzeltme** | Popüler anlatıyı kaynak adı vererek düzeltiyor (çağdaş Bizans tarihçisi ve Osmanlı kayıtları). | Konuya yakın videolarda 1–2 kez. | Uzmanlık güveni veriyor ve "bunu bilmiyordum" anı yaratıyor. | «…yaygın bilinenin aksine Koyunhisar'da yapılmamıştır.» (İlk Osmanlı, 10:58; ardından Pakhymeres ve Osmanlı kayıtları anılıyor) |
| 8 | **İhtilaf dili: "kimilerine göre…, kimilerine göre…"** | Tartışmalı ölüm nedenlerini ve tarihleri iki seçenekle veriyor; tanıklığı kesin olmayan anlatılar için "iddia" kelimesini kullanıyor. | 600 Yılı'nda 3–4 kez; Kurtuluş'ta 2 kez; Kazıklı Voyvoda'da "söylentiler". | Belirsizliği bir cümlede ve tarafsız biçimde söylüyor. Bizim TARTIŞMALI ve RİVAYET rozetlerimizin sözlü karşılığı. | «1481 yılında kimilerine göre gut hastalığı nedeniyle kimilerine göre ise zehirlenerek hayatını kaybetmiştir.» (600 Yılı, 5:06) · «Anlatılan bu olay Latife Hanım kitabında da yer almaktadır. İddianın doğruluğu kesin değildir.» (Kurtuluş'un 3 Kahramanı, 54:44) |
| 9 | **Yan yana koymadan doğan ironi** | Yorum eklemeden bir beklentiyi ve hemen ardından onu bozan olayı veriyor. | Uzun videolarda birkaç kez. | Yargı bildirmeden dram kuruyor; tarafsız çizgiyle uyumlu. | «Bugüne kadar hiçbir Alman mareşalinin esir alınamamış olduğuna güvenen Hitler, Paulus'un asla teslim olmayacağını umuyordu.» (2. Dünya Savaşı, 40:45; bir cümle sonra teslim oluyor) |
| 10 | **"Ta ki…" ile küçük asma** | Bir sessizlik dönemini kesen tek cümle, ardından yeni perde. | Videoda 0–2 kez. | Sahne geçişinde gerilimi ucuz ama etkili biçimde diri tutuyor. | «Ta ki 1982 yılına kadar.» (Örgütün Kuruluşu, 11:01) |
| 11 | **Kalıplaşmış kapanış ve ileriye bakan "-acaktı"** | Birim, "tarih sahnesinden silindi" ya da "tarihe karıştı" kalıbıyla ya da sonraki büyük süreci haber veren "-acaktı"lı bir cümleyle kapanıyor. | Her birimin sonunda. | Bir sonraki birime geçiş sinyali veriyor (haritada alan söner, yeni alan yanar). | (16 Türk Devleti, birim sonları; İlk Osmanlı, 13:18. Alıntı yok.) |
| 12 | **Seyrek gündelik deyim** | Resmî metne tek bir konuşma dili cümlesi ekliyor. | Videoda 0–1 kez. | Düz anlatıda küçük bir gülümseme ve nefes anı. | «Tam huzura erdik derken Mora'da ve Mısır'da yeni isyanlar patlak verdi.» (600 Yılı, 18:44) |
| 13 | **Oyun içinde oyun ve rakip karakter kurgusu** | Muharebeyi pusu, intikam, düğün tuzağı gibi bir hikâye halkasıyla bağlıyor (İnegöl tekfuru → pusu → yarım kalan hesap → 1299). | İlk Osmanlı'da baştan sona. | Kronolojiyi tek bir rakibe bağlayıp dram eğrisi kuruyor. | (İlk Osmanlı, 2:22 → 7:42. Alıntı yok.) |

## 5. Video başına nitel çözümleme (9 soru, kısa)
*Bu bölümde alıntı yok, yalnızca özet var. K = kanca, AD = ilk açık döngü, M = mizah/dk, B = ilk 30 sn'deki bilgi sayısı.*

- **2. Dünya Savaşı (81:41).** (1) K: tanım, iki tarih, iki ittifak ve ölü sayısı; ardından neden sorusu ve "gelin anlatayım" daveti. Kanca 26 sn. (2) Spiker; M yaklaşık 0. Yargı tek cümleyle sınırlı (Stresa'nın çöküşü için "en ciddi hatalardan biri"). (3) Yalnız açılıştaki davet. (4) AD: nedenler sorusu 0:26'da açılıp hemen kronolojiyle cevaplanıyor. Akış: nedenler → Polonya → Batı → Barbarossa → Stalingrad → Kursk → Pasifik → atom bombası. (5) Uzun cümleler ve dakikada 1,3 sessiz ara. (6) Kayıp sayıları ve oranlar (91.000 esirden 5.000'inin dönmesi gibi). (7) Neredeyse hiç belirsizlik dili yok. (8) Serinin bittiği duyurusu ve bir sonraki videoda buluşma. (9) B yaklaşık 5.
- **Örgütün Kuruluşu (15:19).** (1) K yok. 33 sn müzikli başlık, ardından doğum tarihi ve yeri. (2) Biyografi spikeri, mizah yok. (4) Doğrusal biyografi. Sahneler "Tarihler … gösterdiğinde" kalıbıyla açılıyor; tek küçük asma 11:01'de. (5) Kanalın en uzun cümleleri (ortalama 18,5 kelime, %33'ü 20 kelimeden uzun). (6) İsim, tarih ve sayı listeleri. (7) Tanıklara ve anılara atıf. (8) İleriye bakan bir "-acaktı" cümlesi. (9) B yaklaşık 6.
- **Kurtuluş'un 3 Kahramanı (56:44).** (1) K yok; doğum cümlesiyle açılıyor. (2) Spiker; ara sıra "açıkça belirtmek gerekir" türü yorum vurguları var. (4) Üç biyografi art arda; karakterlerin yollarının kesiştiği anlar vurgulanıyor (iki ismin aynı harekâtta birbirinden habersiz görev yapması gibi). (5) Dakikada 1,8 sessiz ara. (7) İddia ile kanıt ayrımı açık (Latife Hanım kitabı, yeğenin tanıklığı, Cebesoy'un anıları). (8) Bir alıntıyla, yarım cümlede kapanış. (9) B yaklaşık 4.
- **16 Türk Devleti (34:20).** (1) K yok. 50 sn sessiz giriş, ardından beğeni ricası; içerik 1:14'te başlıyor. (2) Spiker. (4) 16 birimlik envanter; her birim kuruluş → zirve → bölünme → yıkılış sırasını izliyor. 5:46'da sponsor ve çekiliş. (6) Taktik adları (sahte geri çekilme). (7) Papa ve Attila sahnesi için "rivayet edilir" diyor; buna karşılık "ilk" ve "en" türü üstünlük iddialarını kaynaksız bırakıyor. (8) "16 devletin tamamını anlattık", beğeni ricası, veda. (9) B yaklaşık 4.
- **Osmanlı'nın 600 Yılı (24:16).** (1) K: kapsam vaadi (18 sn). (2) Spiker; tek gündelik deyim 18:44'te; M yaklaşık 0,04. (4) 36 birimlik envanter, birim başına yaklaşık 37 sn. Açık döngü yok. (5) Birim içinde fetih listeleri. (7) Ölüm nedenlerinde ihtilaf dili, Abdülaziz'in ölümü için kesinlik kazanmadığı söyleniyor. (8) Kardeş kanal tanıtımı ve veda. (9) Kanca sonrası ilk 30 sn'de yaklaşık 7 bilgi.
- **İlk Osmanlı Muharebeleri (13:54).** (1) K: sponsor ve çekiliş (0:00–0:25), ardından tarih ve yer levhası. (2) Spiker, ama rakip kurgusu var (İnegöl tekfuru Ayanikola). (4) AD: İnalcık'ın 1302 tercihi 8:44'te açılıp 13:05'te Bafeus zaferiyle kapanıyor. Akış: 1283 Ermeni Beli → 1284 Kulaca Hisar → 1286 Domaniç → 1288 Karaca Hisar → Bilecik düğünü → 1299 İnegöl → 1302 Bafeus. (5) Her muharebeden sonra 10–20 sn müzik arası; sürenin %26'sı sessiz. (6) Asker sayıları (120 süvari, 300 kişi, 2.000'e karşı 5.000). (7) Osman'ın doğum yılı için iki seçenek veriyor; Bafeus'un yeri için çağdaş tarihçiye dayanıyor. Öte yandan Ertuğrul'un ölüm yaşı gibi kaynaksız kesinlikler de var. (8) Kurulan devletin 600 yıl süreceğini haber veren bir "-acaktı". (9) B yaklaşık 3.
- **Fatih ve Kazıklı Voyvoda (5:14, kısa form).** (1) K: Drakula bağlantısı ve "korkunç hikâye" vaadi (12 sn). (2) Hikâye anlatıcısı; ton daha dramatik. (4) AD: Drakula ve vampir bağlantısı 0:00'da açılıp 2:11'de kapanıyor. Akış: rehinelik → Fatih'le birlikte eğitim → ihanet → vahşet → baskın → Fatih'in seferi → sürgün → ölüm. (6) Kendi ifadesine dayanan ölü sayısı. (7) "Batılı kaynaklar" ve "söylentiler" diyerek mesafe koyuyor. (8) Kalıp kapanış ("tarihin tozlu yaprakları"), abone çağrısı. (9) B yaklaşık 4.

## 6. Yapı haritası
**Uzun form, savaş ve derleme (15–80 dk):**
`0:00 (müzikli başlık 0–50 sn) → sponsor ya da çekiliş ya da beğeni ricası` → `tanım, sayı ve soru kancası ya da "tarih, yer" levhası (0–25 sn)` → `bağlam (nedenler, soy, harita)` → `kronolojik birimler: her biri tarih → kuvvetler → manevra → [sessiz harita arası] → sonuç → kayıplar` → `(seyrek) "birazdan" döngüsünün kapanışı` → `kalıp kapanış ya da ileriye bakan "-acaktı"` → `beğeni ya da abone çağrısı, "Şimdilik hoşça kalın"`.

**Envanter formatı (600 Yılı, 16 Devlet):**
`kapsam vaadi` → `N × [sıra → tahta çıkış/kuruluş → süre → fetih listesi → en önemli olay → ölüm/yıkılış]` → `"hepsini anlattık" + veda`.

**Kısa form (5 dk, Shorts yerine):**
`efsane kancası (Drakula)` → `kişisel bağ (Fatih'le aynı derslik)` → `ihanet` → `vahşet (kaynaklara mesafe koyarak)` → `doruk (Tuna baskını)` → `ceza ve kaçış` → `ölüm` → `kalıp kapanış`. Tek bir kahraman ve rakip çifti, tek bir doruk. Uzun formdan farkları: kanca var, ton daha dramatik, sessiz ara neredeyse yok (%2,6).

## 7. Bize ne alınır, ne alınmaz
Çerçeve: tarafsız ve kaynaklı belgesel çizgi, Emrullah Uzun'un ciddi ama sıcak sesi, güven rozetleri (BELGE, TARTIŞMALI, RİVAYET, DOĞRULANACAK) ve 60–90 sn'lik Reels.

**Alınır:**
1. **Sessiz harita araları** (teknik 5). Bizim en eksik yanımız bu. 60–75 sn'lik bölümde 1–2 kez 1,5–3 sn susmak gerekiyor: kahraman anında ve sınırın değiştiği karede. `timeline.js`'te bu, paragraflar arasına boşluk (`gap`) ve vuruş (`hit`) koymak demek. Anime Tarih'in net hızı da 2,0 kel/sn; aradaki fark tamamen sessizlikten geliyor. Önerilen hesap: 110–120 kelime, 55–60 sn konuşma ve yaklaşık 4–6 sn harita sessizliği.
2. **Tarih ve yer levhası** (teknik 1). Açılış ya da sahne geçişinde tek bir kısa cümle, aynı anda ekranda tarih kartı. Bebar'ın zaman damgalı açılışıyla birleşince ilk 3 sn'nin kancası olur. Örnek kurgu: yıl, yer, ardından tek bir çelişki.
3. **İhtilaf dili ve kaynakla düzeltme** (teknik 7–8). Kaynak adını söylemek (İnalcık, Pakhymeres) bizim TARTIŞMALI rozetimizi sözlü hale getirir. İki seçenekli cümle kalıbı ("kimilerine göre…, kimilerine göre…" ya da bizim "kaynaklar ayrışır" kalıbımız) bir rozetle eşlenir.
4. **"Birazdan" döngüsü** (teknik 6). İlk Osmanlı videosundaki 1299 ile 1302 döngüsü bizim Bölüm 3 (Koyunhisar) ve Bölüm 1 konumuzla birebir aynı. Reels'te döngü bölümün %20'sinde açılıp %70'inde kapanmalı ya da bir sonraki bölüme taşınmalı.
5. **Yan yana koyarak ironi** (teknik 9). Yorum eklemeden beklentiyi ve sonucu art arda vermek, tarafsız çizgiyi bozmadan dram kuruyor. Ankara 1402 bölümü buna çok uygun: Yıldırım lakabı ve bir günde çöküş.
6. **Rakip karakter halkası** (teknik 13). Bölümü tek bir rakiple kurmak (İnegöl tekfuru, Kantakuzenos gibi) kronolojiye çatışma ekliyor. Ancak rakip hakkındaki her iddia FACTS dosyasında yer almalı.

**Alınmaz:**
- **Kancasız açılış, uzun müzikli başlık, sponsor ve beğeni ricasıyla başlamak.** Reels'te ilk 3 sn bunlara harcanamaz.
- **Envanter dili.** Fetih listeleri ve "N yıl tahtta kaldı, X nedeniyle hayatını kaybetti" kalıbı uzun formda işliyor; 60 sn'de ise listeyi harita göstermeli, anlatıcı tek bir anlamı söylemeli.
- **Sıfır hitap ve sıfır soru.** Emrullah Uzun'un sıcaklığını boşa harcar. Bebar'ın ölçülü hitabı daha doğru bir hedef.
- **Uzun cümleler.** Kanalın biyografi videosunda cümlelerin %33'ü 20 kelimeden uzun. Bizim hedefimiz ortalama 9–11 kelime ve en fazla birkaç uzun cümle.
- **Kaynaksız kesinlikler ve üstünlük iddiaları.** "Tarihte ilk", kesin yaş ve kişi sayıları, "en büyük" gibi. Bizde bunlar ya BELGE rozetiyle kaynağa bağlanır ya da DOĞRULANACAK olarak işaretlenip metinden çıkar.
  - **Not:** İlk Osmanlı Muharebeleri'ndeki Bafeus'un yeri iddiası (Koyunhisar değil, Yalakova'nın güneyi) Bölüm 3 araştırmamızda ayrıca doğrulanmalı. Bu dosyada doğru ya da yanlış diye işaretlenmedi.
- **Tören dili ve tek kelimelik etiketler.** "Altın harflerle yazdırdı" ve "en şanssız padişah" türü ifadeler tarafsız çizgimize uymuyor.
- **Hassas yakın dönem konularının dili.** Seçimde en çok izlenen ikinci video olduğu için incelendi. Bu tür yakın dönem güvenlik tarihi konuları serimizin kapsamı dışında. Oradaki etiketleme dili de örnek alınmayacak.
