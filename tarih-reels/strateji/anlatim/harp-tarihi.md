# Harp Tarihi: anlatım analizi

> Kaynak: 21 Ekim 2026'da yt-dlp ile alınan Türkçe altyazılar. Elle yazılmış Türkçe altyazı 3 videoda vardı ve tercih edildi; diğerlerinde otomatik altyazı kullanıldı. Transkriptler `strateji/transkript/harp-tarihi/` altında (git dışı). Araç çıktısı: `transkript/harp-tarihi/olcum.md`.

## Künye
- **Kanal:** Harp Tarihi (`@HarpTarihi`), yaklaşık **879 bin abone**, 204 uzun video ve 5 Shorts. Video başlıkları varsayılan olarak İngilizce, yanında Türkçe başlık ve altyazı var, yani kanal uluslararası izleyiciye de açılıyor. Sponsorlu videoları var (World of Tanks).
- **Kanal karakteri:** 2D harita ve birlik animasyonuyla savaş anlatımı; Kings & Generals tarzına en yakın Türkçe kanal. Sefer sefer ilerleyen diziler yapıyor (Osman Gazi #1–5, Yavuz #1–6, Fatih #1–4…), ardından bunları "TEK PARÇA" derlemelerde birleştiriyor. Ayrıca **soru-cevap ve doğrulama** videoları var ("Yorumlara Cevaplar", "… Katledildi Mi?", "Küpe Takar Mıydı?").

| # | Video | Süre | Görüntülenme | Neden seçildi | Altyazı |
|---|---|---|---|---|---|
| 1 | Yavuz Sultan Selim Savaşları [1512-1520] (TEK PARÇA) (0sWbNF-k7uo) | 2:24:15 | 8,48 M | En çok izlenen (1.). Yavuz #1–6'nın derlemesi, 2022 | otomatik |
| 2 | Osman Gazi Savaşları [1281-1326] (TEK PARÇA) \| Osmanlı Devleti #1 (Bc-ZJg-H1KU) | 1:02:29 | 7,46 M | En çok izlenen 2. ve **konumuz** (Sezon 1: kuruluş, Bilecik, Koyunhisar) | elle, **yalnızca ilk 46 dk** |
| 3 | 1453: Fetihten Sonra Neler Oldu? \| İstanbul Yağması \| Fatih #4 (4nlrqKxOZ3Q) | 34:31 | 274 b | En yeni video | elle |
| 4 | On Binlerin Dönüşü: Anabasis (M.Ö. 401-400) \| Ksenophon (gVOJ_wt9qko) | 40:48 | 597 b | En yeni 2. video | elle |
| 5 | 70.000 Sırpa 800 Osmanlı \| Çirmen Muharebesi (1371) (CC0S4K3sRyE) | 9:04 | 661 b | **Konumuz** (Sezon 1 dönemi, I. Murad). Kanalın kısa-orta format örneği | otomatik (noktalamalı) |
| 6 | Shorts: 22 Devlet vs Fatih Sultan Mehmed (yWB-r-jpRJc) | 0:60 | 1,87 M | En çok izlenen 2. Shorts | otomatik |

*Eksik:* En çok izlenen Shorts "Çok Rahat, Çok Profesyonel #yıldırımbayezid" (7JXzEfdaRgA, 2,24 M, 37 sn) ve "Skanderbeg vs Ottomans" (KdrCqW3dnaY) için altyazı sunucusu HTTP 429 döndürdü. Brifteki bekle ve yeniden dene kuralı uygulandı, alınamadı.

## Nicel tablo
Araç çıktısı (`anlatim_analiz.py`, seçili sütunlar) ve ek ölçüler. **Net hız**, altyazı aralıklarından ya da otomatik altyazının kelime zamanlarından hesaplandı; 1,5 sn'den uzun duraklama ve müzik araları hariç.

| Video | kelime | kel/dk brüt | **net kel/dk** | duraklama/müzik payı | ort. cümle | vurucu % | uzun % | soru /100 | hitap /100 | "biz" /100 | geçmiş / -mış(tı) / şimdiki / geniş / isim % | sayı /100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Yavuz (derleme) | 12811 | 89 | 113 | %22 | – | – | – | 0.05 | 0.16 | 1.27 | (noktalama yok) | 0.94 |
| 2 Osman Gazi (derleme) | 3569 | 78 | 116 | %33 | 13.0 | 7.3 | 13.5 | 0.08 | 0.20 | 0.39 | 56 / 27 / 8 / 3 / 4 | 0.62 |
| 3 Fetihten sonra | 4015 | 121 | 128 | %5 | 16.5 | 7.0 | 27.0 | 0.12 | 0.22 | 0.90 | 59 / 11 / 3 / 12 / 14 | 0.65 |
| 4 Anabasis | 4695 | 116 | 126 | %8 | 10.7 | 8.2 | 3.9 | 0.06 | 0.00 | 0.66 | 67 / 13 / 16 / 1 / 1 | 0.30 |
| 5 Çirmen | 673 | 75 | 129 | %41 | 12.5 | 11.1 | 11.1 | 0.00 | 0.30 | 0.30 | 57 / 28 / 7 / 0 / 7 | 2.82 |
| 6 Shorts 22 Devlet | 53 | 53 | 113 | ≈%50 (0:29'dan sonra müzik) | – | – | – | 0.00 | 0.00 | 1.89 | (noktalama yok) | 7.55 |
| **Kanal ortalaması** | 4303 | **89** | **≈121 (≈2,0 kel/sn)** | **≈%22** (uzun videolar) | **13.2** (n=4) | **8.4** | **13.9** | **0.05** | **0.15** | 0.90 | **60 / 20 / 8,5 / 4 / 6,5** (n=4) | 2.15 |

- **Duraklamalar:** #5'te 1,5 sn'yi aşan 35 duraklama var (dakikada ~4), en uzunu 21 sn (6:12, savaş sonrası görüntü). #2'de bölüm geçişlerinde 25–53 sn'lik müzik araları var (13:49, 21:58). Savaş sahnelerini konuşma değil, müzik ve harita taşıyor.
- **Hitap ve "biz":** Anlatı içinde neredeyse sıfır. Ölçülen değerler başa konan abone çağrısından (#2), sponsor metninden (#5), fetihnamedeki "kuşattık, hazırladık" gibi birinci çoğul alıntılardan ve düzenli ifade gürültüsünden geliyor.
- **Belirsizlik dili:** 1,3–1,4/1000 kelime (#1, #2, #4); 4,5 (#5); **7,0** (#3: 9 kez "rivayet", "kaynaklarda", "iddia"). Kanal yeni videolarda kaynak karşılaştırmasını belirgin biçimde artırmış.
- **Mizah:** 0/dk. **Soru:** yaklaşık 2000 kelimede 1. Bu 1 soru da genellikle bir dönemeç işlevi görüyor.
- **İlk 30 saniyede verilen bilgi:** #4'te ~6, #5'te ~7, #3'te ~4, #1'de ~3. #2'de 0, çünkü ilk 50 sn abone çağrısı.

## Anlatıcı profili
Tek erkek anlatıcı, ağır ve resmî bir **belgeselci-vakanüvis** sesiyle konuşuyor. Cümleleri uzun ve "-mıştı / -dı" ile kapanıyor (geçmiş %60, -mış(tı) %20). Kelime dağarcığı bilerek eski: nefer, mahiyet, fütuhat, lakin, zira, mukabil. İzleyiciye hiç dönmüyor; dikkati harita animasyonu, birlik hareketleri ve sahneler arasındaki müzikli nefes araları taşıyor. Anlatının dönemeçleri "Ancak / Fakat / Bunun üzerine" zinciriyle kuruluyor. Gerilim, gelecek-içinde-geçmiş ("olmayacaktı", "yapacaklardı") önsezileriyle tırmanıyor. Eski Osmanlı videolarında dinî-milli bir değer çerçevesi baskın (mücahid, gaza, küffar, şehadet) ve efsaneler olgu gibi anlatılıyor. Yeni videolarda (2026) dil daha nötr, kaynak adları (Ksenophon, Kritovulos, Dukas, Sfrancis, İbn Kemal) ve "iki farklı rivayet" karşılaştırması öne çıkıyor. Mizah yok; duygu, duyusal doruk görüntüleriyle veriliyor (nehrin kanla kızarması, "Thalatta!" çığlığı).

## Teknik kataloğu
| # | Teknik | Ne yapıyor | Sıklık | Neden işe yarıyor | Kısa örnek |
|---|---|---|---|---|---|
| 1 | **Tarih damgalı, olayın ortasından açılış** | İlk cümle bir yıl söylüyor, ardından karakterleri en çaresiz anlarında gösteriyor. Sonra geriye dönülüyor | Yeni videolar; eski videolarda "1500'lü yılların başlarında" gibi düz bir versiyonu var | Zaman, yer ve tehlike 3 saniyede kuruluyor | (#4, 0:01) "Yıl Milattan Önce 401." |
| 2 | **"Ne … ne de" çaresizlik ikilisi** | Olumsuz paralel yapıyla gerilimi tek cümlede topluyor | Kanca başına 1 | Ritimli, akılda kalan bir tehlike ifadesi | (#4, 0:27) "Ne arkalarından gelecek bir yardım vardı, ne de başlarında onlara yol gösterecek bir lider..." |
| 3 | **Gelecek-içinde-geçmiş önsezisi ve yol haritası üçlemesi** | "-acaktı" ile gelecek zorluklar önceden sayılıyor (savaşacak, mücadele edecek, çarpışacaklardı) | Kancada ve bölüm sonlarında | Uzun videonun vaadini veriyor, açık döngüyü açıyor | (#4, 0:39) "Ancak bu yürüyüş hiç kolay olmayacaktı." |
| 4 | **Uzun açık döngü ve ödül** | Kancadaki hedef (Karadeniz'e ulaşmak, 0:33) videonun dorukunda kapanıyor ("Thalatta!", 30:26) | Yeni uzun videolarda 1 ana döngü (~30 dk) | Bütün videoyu tek bir soruya bağlıyor | (aktarım) Karadeniz hedefi 0:33'te konuyor, 30:26'da askerlerin "Deniz!" çığlığıyla ödeniyor |
| 5 | **Paradoks kancası** | Kehaneti, kurucunun doğumundan önceki bir tarihe yerleştiriyor | #2 | Zaman çelişkisi merak uyandırıyor | (#2, 1:20) "Henüz meydanda Osmanlı Devleti diye bir devlet yok, hatta devletin kurucusu Osman Bey'in doğmasına bile daha 28 yıl vardı." |
| 6 | **Rivayet karşılaştırması** | İki kaynak adıyla anılıyor (Kritovulos'a göre…, Dukas'a göre…), sonra ortak noktada birleştiriliyor | #3'te 4 kez | Hem merak hem güven kuruyor: izleyiciye "bilmediğimizi de söylüyoruz" deniyor | (#3, 11:41) "…Şehzade Orhan'ın akıbeti konusundaysa iki farklı rivayet mevcuttur." |
| 7 | **Sayı aralığı** | Ordu büyüklüğünü tek sayı yerine kaynak aralığıyla veriyor | #5, #3 | Abartılı rakamlara karşı dürüst bir dil | (#5, 0:05) "Kimi kaynaklarda 40.000, kimi kaynaklarda 60.000 mevcudu olan bu orduyu…" |
| 8 | **Efsane sorgulama sorusu** | Bilinen bir sözün ya da hikâyenin "aslını" soruyor, kaynakla cevaplıyor | #3'te 1 kez, kanalın ayrı doğrulama videoları da var | Tek soru, yarım dakikalık bir açık döngü kuruyor | (#3, 30:02) "Peki "bu şehri kılıcımla aldım" meselesinin aslı nedir?" |
| 9 | **Bölüm sonu askısı** | Bölüm, sürmekte olan bir tehditle ("…yürüyordu…") ya da "-acaklardı" ile bitiyor, ardından müzik | Derlemelerde her bölüm sonunda; #5'in sonunda | Bir sonraki bölüme bağlıyor | (#2, 13:29) "Bu iki ordu Osmanlıları tarih sahnesinden tamamen silmek için yürüyordu..." · (#5, 8:01) "Haçlılar Türkleri Rumeli topraklarından atmak için ellerinden geleni yapacaklardı." |
| 10 | **Bugüne bağla ödül** | Tuhaf bir ayrıntının bugünkü karşılığını kısa bir cümleyle açıklıyor | #4'te 1 kez | Uzun anlatıda "aa" anı yaratıyor, bilgiyi bugüne bağlıyor | (#4, 31:37) "Yedikleri şey, bugün de Karadeniz'de bilinen meşhur deli baldı." |
| 11 | **Müzikli nefes ve duyusal doruk** | Savaş anında anlatım susuyor (12–53 sn). Doruk, tek bir görüntüyle (nehrin rengi) kapanıyor | Uzun videolarda süresinin %5–41'i | Görüntüye ve müziğe alan açıyor, tempo değişiyor | (aktarım, #5, 6:33) Sabah Meriç'in renginin değiştiği söyleniyor, sonra 20 sn müzik |
| 12 | **Ritüel giriş** | Abone çağrısından sonra sabit bir "başlıyoruz" sözü | #2 (2023 derlemesi) | Kanal kimliği ve "rahat izleme" sözü veriyor | (#2, 0:34) "Şimdi çayınızı alıp arkanıza yaslanabilirsiniz. Harp Tarihi başlıyor." |
| 13 | **Kısa formda tırmanan sayım** | Tarihler ve düşman listesi art arda sayılıyor, ardından tek cümlelik yalnızlık vurgusu geliyor | Shorts #6 | Liste baskı kuruyor, son cümle bunu boşaltıyor | (#6, 0:24) "…bu 20 devlete karşı Osmanlı Devleti müttefiksiz olarak tek başına idi" |

Diğer tekrarlayan araçlar (alıntısız):
- birincil kaynaktan uzun okuma (#3'te fetihname 0:40–5:32)
- önceki bölümün özetiyle açılış (#3, #5)
- kanat, süvari ve piyade hareketlerinin adım adım taktik anlatımı (#2, 42:39 ve sonrası)
- karakteri tanıtan sıfat yığını ("cesur, takva ehli, faziletli…")
- bir sonraki ihaneti önceden sezdiren ayrıntı (#4: Tissaphernes'in "beklenmedik sıcak" karşılaması, 14:03)

## Video başına 9 soru (kısa)
- **#1 Yavuz (derleme):** *Kanca:* "1500'lerin başı" diye bağlam kurarak açılıyor, ~0:45'te üç şehzadeden hangisinin tahta çıkacağı sorusu örtük olarak soruluyor; ayrı bir kanca yok. *Kişilik:* vakanüvis, değer yargısı yüksek (Safevîler mezhepsel bir tehdit olarak çerçeveleniyor). *İlişki:* yok. *Yapı:* taht kavgası, Çaldıran, Turnadağ, Mercidabık, Ridaniye ve vefat. Bölüm araları müzikli. *Ritim:* uzun, bağlaçlı cümleler. *Belirsizlik:* yalnızca "rivayet edilir" (tebdil-i kıyafetle Tebriz'e gitmesi). *Kapanış:* övgü, Yahya Kemal'in dizeleri ve dua. *Tempo:* net 113 kel/dk, %22 duraklama.
- **#2 Osman Gazi (derleme):** *Kanca:* 0:04–0:50 abone çağrısı ve ritüel; ardından kehanet alıntısı ve paradoks (0:54–1:45). *Kişilik:* menkıbevi, sıfat yoğun. *Yapı:* Kayıların göçü, Söğüt, Mevlânâ ile buluşma, İnegöl, Kulaca Hisar ("ilk fetih"), Domaniç, Karacahisar, Bilecik düğünü, Koyunhisar (Bapheus). Her bölüm askıyla bitiyor. *Açık döngü:* kehanet 0:54'te açılıyor, Mevlânâ'nın "Âl-i Osman'a verdim" duası 5:19'da kapatıyor. *Belirsizlik:* **yok denecek kadar az**. Mevlânâ–Osman buluşması kanalın kendi verdiği tarihlerle çelişiyor: 1230'da Osman'ın doğmasına 28 yıl olduğunu söyleyip onu I. Alâeddin Keykubad'ın (ö. 1237) sarayına elçi olarak gönderiyor. Bilecik fıçıları ve kadın kılığındaki askerler olgu gibi anlatılıyor (bizde 🔴). *Kapanış (altyazılı kısmın sonu, 46:00):* zaferin yayılması ve "Roma'nın mecali yoktu". *Tempo:* net 116 kel/dk, %33 müzik ve duraklama.
- **#3 Fetihten sonra:** *Kanca:* 1453'ün özeti ve hadis (0:04–0:40), ardından ~5 dk fetihname okuması. İlk merak sorusu 5:32'de geliyor (Konstantinos nasıl öldü?). *Kişilik:* kaynak okuyan bir vakanüvis; alıntılarda sert dinî dil var. *Yapı:* imparatorun ölümü (Sfrancis, Barbaro, Samuele), Şehzade Orhan (iki rivayet), yağma, Çandarlı, "kılıcımla aldım" efsanesinin sorgulanması ve Belgrad dersi. *Belirsizlik:* kanalın en yüksek değeri (7/1000). *Kapanış:* kibrin bedeli üzerine ahlaki bir anekdot. *Tempo:* net 128 kel/dk, %5 duraklama.
- **#4 Anabasis:** *Kanca:* olayın ortasından açılış ve önsezi üçlemesi, 55 sn (0:00–0:55). *Yapı:* Pers sarayındaki entrika, Kunaksa, komutanlara ihanet, kuzeye yürüyüş (Karduklar, kış, Halibler), "Thalatta!" (30:26), deli bal (31:37) ve Ksenophon'un mirası. *Açık döngü:* Karadeniz (0:33'ten 30:26'ya). Ayrıca 33:32'de tek bir "Peki…" sorusuyla geriye dönüş yapılıyor. *Açıklama:* bugüne bağ, mesafe ölçeği ("dört bin kilometre"). *Belirsizlik:* "Ksenophon'un anlattığına göre". *Kapanış:* miras cümlesi ("binlerce yıl sonra bile"). *Tempo:* net 126 kel/dk, ilk 30 sn'de 6 bilgi.
- **#5 Çirmen:** *Kanca:* başlıktaki sayı farkı taşıyor. Metin önceki savaşın özetiyle açılıyor (0:05–1:00), 70.000 rakamı 3:34'te, 800 rakamı 4:15'te geliyor. *Yapı:* Bizans ve Papa diplomasisi, Sırp kardeşler, Lala Şahin'in keşfi, davullu gece baskını, Meriç ve sonuçlar listesi. *Belirsizlik:* sayı aralığı, ama başlıktaki 70.000'e 800 rakamı tartışmasız sunuluyor. *Kapanış:* askı ve sponsor. *Tempo:* net 129, brüt 75 kel/dk, %41 müzik ve duraklama.
- **#6 Shorts:** *Kanca:* ilk saniyede tarih ve ilk düşman. *Yapı:* tırmanan sayım (28 sn), son cümlede yalnızlık vurgusu, ardından 30 sn müzik ve görüntü. *Not:* başlık "22 devlet" diyor, metin "20 devlet": başlık ile metin tutarsız.

## Yapı haritası
**Yeni uzun form (2025–2026, 34–41 dk):**
`0:00 yıl + çaresiz an (olayın ortasından) → 0:27 "ne … ne de" → 0:39 "-acaktı" yol haritası (~55 sn) → 1:00 geri dönüş, bağlam → aktörler ve entrika → engeller zinciri (her biri 3–5 dk, "Ancak…" ile dönüyor) → doruk ve ödül (açık döngü kapanıyor) → bugüne bağ → sonrası ve miras cümlesi`
**Eski derleme (2022–2023):** `abone çağrısı + ritüel → alıntı/kehanet kancası → kronolojik bölümler (her bölümün sonunda "-iyordu…" askısı ve 25–50 sn müzik) → övgü, şiir ya da dua`
**Orta form (9 dk):** `önceki savaşın özeti → düşman ittifakı → sayı uçurumu → hile ve gece baskını → duyusal doruk → sonuçlar listesi → askı + sponsor`
**Kısa form (60 sn):** `tarih + tırmanan düşman listesi (≈28 sn) → tek cümlelik vurgu → müzik ve görüntü`
**Kısa ve uzun form farkı:** Kanalın kısa formu az (5 Shorts) ve neredeyse uzun videodan alınmış bir harita sahnesi gibi. Anlatım yarım dakika sürüyor, gerisini görüntü taşıyor. Kısa formda da hitap, soru ya da mizah yok; sayı yoğunluğu çok yüksek (7,5/100). Uzun formun gücü (açık döngü, rivayet karşılaştırması, ödül) kısa forma taşınmamış.

## Bize ne alınır, ne alınmaz
**Alınır:**
1. **Hızın teyidi:** Harp Tarihi'nin net hızı ≈121 kel/dk, yani Emrullah Uzun'un 2,0 kel/sn'si. Belgesel hızımız doğru. Enerjiyi hızı artırarak değil, açılış ve duraklama tasarımıyla kazanmalıyız.
2. **Tarih damgalı ilk cümle:** "Yıl 1302. …" ya da "1243, Kösedağ." 3 saniyede zaman, yer ve tehlike. Ekrandaki tarih kartıyla aynı anda söylenmeli.
3. **"-acaktı" önsezisi:** Kanca sonu ve bölüm sonu askısı için. Bölüm 1'deki "İlk Osmanlı tarihleri ancak yüz yıl ve daha sonra yazılacaktır" zaten bu teknik; her bölümün son cümlesi bu kalıpla bir sonraki bölüme bağlanabilir.
4. **Rivayet karşılaştırması, rozetlerimizle birebir:** "İki farklı anlatım var. X'e göre …, Y'ye göre … İkisi de şu noktada birleşir." Bu 🟡 TARTIŞMALI rozetine karşılık gelir. "Kaynakların hemen hepsine göre" 🟢 BELGE'ye karşılık gelir. Kaynak adı (Pakhymeres, Aşıkpaşazâde) ekranda küçük bir künye olarak yazılmalı.
5. **Sayı aralığı:** "Kimi kaynakta 40, kimi kaynakta 60 bin" kalıbı ekranda aralık olarak yazılır ve 🟡 rozeti alır.
6. **"Peki … meselesinin aslı nedir?"**: Bölüm 2 tipi efsane bölümleri için güçlü bir kanca. Kanalın "… Mı?" doğrulama videoları, ayrı bir "Rivayet mi, belge mi?" mini serisi fikrini de destekliyor.
7. **Bugüne bağla ödül:** Bölüm sonunda tek kısa cümle ("Bugün hâlâ …").
8. **Müzikli nefes:** Doruk cümlesinden sonra 1,5–3 sn konuşmasız an; kahraman anda görüntünün konuşmasına izin vermek. Bizim ölçeğimizde Harp Tarihi'nin %22'lik payı yerine %5–10.
9. **Birincil kaynaktan tek cümle:** Örneğin Koyunhisar için Bizans tarihçisinin tek bir cümlesi, kaynak adıyla.

**Alınmaz:**
- **Abone çağrısını başa koymak** (#2'de ilk 50 sn). Reels'te kancayı öldürür.
- **Uzun kaynak okuması** (5 dk fetihname). Bizde en fazla 1 cümle.
- **Eski ve dinî-taraflı dil:** nefer, mahiyet, mevlağ, fütuhat; mücahid, küffar, kafir, şehadet şerbeti. Övgü sıfatı yığınları da. Tarafsız ve sade Türkçe kullanmalıyız: "Osmanlı akıncıları", "Bizans askerleri".
- **Efsaneyi olgu gibi anlatmak:** Mevlânâ–Osman buluşması, İbn Arabî kehaneti, Bilecik fıçıları ve başlıktaki 70.000'e 800 rakamı bizde 🔴 ya da 🟡 rozetiyle verilir.
- **Sıfır hitap ve sıfır soru:** Uzun formda görüntü ve süre bunu telafi ediyor, 60–90 sn'lik Reels'te etmiyor. Random Animasyon'dan alınacak hitap ve soru dozu burada gerekli.
- **Uzun cümle:** Harp Tarihi ortalaması 13,2 kelime, %14'ü 20 kelimeyi aşıyor (#3'te %27). Bizde 20 kelimeyi aşan cümle olmamalı.
