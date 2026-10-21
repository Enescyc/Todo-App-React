# Yusuf Kayaalp: anlatım analizi

> Kaynak: YouTube Türkçe altyazıları (21 Ekim 2026). Üç videoda elle yazılmış altyazı, beşinde otomatik altyazı kullanıldı. Transkriptler `strateji/transkript/yusuf-kayaalp/` altında, git dışında.
> Alıntılar kısadır; yalnızca teknik göstermek için. Kanalın argo ve küfürlü bölümleri bilerek alıntılanmadı.

## Künye
- **Kanal:** Yusuf Kayaalp (`@YusufKayaalp`), ~2,03 Mn abone, 404 uzun video ve 22 Shorts. Konular: "haritalı hızlı anlatım" ile başlayan tarih, sonra jeopolitik, alternatif tarih ve güncel Türkiye siyaseti.
- **Altyazı:**
  - Eski üç videoda (I. ve II. Dünya Savaşı, Osmanlı İmparatorluğu) elle yazılmış Türkçe altyazı var. Metin seslendirmeyle birebir, skeç repliklerini de içeriyor.
  - Yeni videolarda YouTube'un noktalamalı otomatik altyazısı var.
  - Osmanlı kuruluşu videosuyla şehzade Shorts'unda noktalamasız otomatik altyazı var.
  - **Elenen:** "Osmanlının Kuruluşu – Osmanlı Nasıl Kuruldu?" (`iC9g3ERtNGU`, 3,1 Mn). Bu videonun elle yazılmış Türkçe altyazısı yalnızca 83 kelime: yalnızca skeç replikleri ve şakalar var, anlatım yok. Otomatik Türkçe altyazısı da yok. Yerine aynı konuyu işleyen yeni bir video alındı.

| # | Video | Süre | Görüntülenme | Neden seçildi |
|---|---|---|---|---|
| 1 | I. Dünya Savaşı: Haritalı Hızlı Anlatım (Tek Part), `rqE7llEveW0` | 12:09 | 8,29 Mn | En çok izlenen #1; Osmanlı'nın savaşa girişi de var |
| 2 | II. Dünya Savaşı: Animasyonlu Haritalı Anlatım (Tek Part), `5MrbulrI9t0` | 13:41 | 7,34 Mn | En çok izlenen #2 |
| 3 | TÜRKİYE Neden Dünyanın En İyi Coğrafyasına Sahip?, `68fipW09NB4` | 12:24 | 408 bin | En yeni #1 |
| 4 | Türkiye 2. Dünya Savaşına Katılsaydı?, `qZ1Z3g0HkHw` | 14:27 | 857 bin | En yeni #2 (alternatif tarih serisi) |
| 5 | OSMANLI İMPARATORLUĞU, `6SCVM_-l-FI` | 17:14 | 5,95 Mn | Konumuza yakın (aynı zamanda en çok izlenen #3); eski "meme" üslubu |
| 6 | Osmanlı Nasıl Kuruldu? (Kuruluş Osman), `lOmjmJM2gsk` | 9:57 | 418 bin | Bizim Bölüm 1 ile aynı dönem (1280–1324); yeni üslup |
| 7 | Shorts: İRAN İsterse Küresel Ekonomi Çöker! Hürmüz Boğazı!, `ZtC9yH3fFPk` | 0:50 | 8,44 Mn | Kanalın en çok izlenen Shorts'u |
| 8 | Shorts: SUÇSUZ YERE İDAM EDİLEN ŞEHZADE, `lNoM4gcYLQ4` | 0:32 | 4,33 Mn | Osmanlı konulu en çok izlenen Shorts (Kosova 1389, bizim dönemimiz) |

## Nicel tablo
Araç: `shared/tools/anlatim_analiz.py`. Tam çıktı `transkript/yusuf-kayaalp/olcum.md` dosyasında. Ek sütunlar (`? /dk`, `seslenme/dk`, `argo/dk`) aynı okuyucuyla sayıldı. `*` noktalama yok demek: zaman dağılımı bütün kelimelerden kabaca çıkarıldı. Not: Dünya Savaşı videolarındaki "dostum" seslenmeleri çoğunlukla skeçteki devletlerin birbirine hitabıdır, izleyiciye değil.

| Video | Altyazı | dk | Kelime | Kel/dk | Ort. cümle | Vurucu % | Uzun % | Soru/100 | ? /dk | Hitap/100 | Seslenme/dk | Biz/100 | Şimdiki/geniş/geçmiş/-mış/isim % | Merak/100 | Sayı/100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I. Dünya Savaşı | elle | 11.9 | 1859 | 157 | 7.5 | 33.7 | 0.4 | 1.51 | 1.60 | 0.48 | 1.01 | 0.75 | 10/7/48/6/24 | 1.18 | 0.27 |
| II. Dünya Savaşı | elle | 13.4 | 1994 | 149 | 7.6 | 28.9 | 0.8 | 0.30 | 0.37 | 0.15 | 0.07 | 0.55 | 9/3/56/8/22 | 0.85 | 0.90 |
| Türkiye'nin coğrafyası | oto, noktalı | 12.3 | 1911 | 155 | 11.2 | 19.4 | 5.9 | 0.63 | 0.65 | 1.31 | 0.49 | 1.41 | 15/9/28/2/45 | 0.26 | 0.94 |
| 2. DS'ye katılsaydı | oto, noktalı | 14.4 | 2202 | 153 | 11.7 | 19.1 | 10.6 | 0.95 | 1.11 | 1.27 | 0.90 | 1.41 | 13/3/44/7/33 | 0.59 | 0.36 |
| Osmanlı İmparatorluğu | elle | 16.9 | 3208 | **190** | 9.1 | 34.7 | 4.5 | 1.56 | 1.95 | 0.56 | 0.35 | 0.65 | 3/3/54/7/32 | 1.00 | 0.41 |
| Osmanlı nasıl kuruldu | oto | 9.9 | 1672 | 168 | – | – | – | 0.30 | – | 0.66 | 0.30 | 0.78 | 10/0/70/10/0* | 0.42 | 0.90 |
| S: Hürmüz | oto, noktalı | 0.9 | 134 | 156 | 9.6 | 21.4 | 0 | 0 | 0 | 0 | 0 | 0.75 | 29/50/0/0/21 | 0 | 0 |
| S: Suçsuz idam edilen şehzade | oto | 0.6 | 97 | 170 | – | – | – | 0 | – | 0 | 0 | 0 | 20/0/40/20/0* | 3.09 | 0 |

**Kanal ortalaması** (video başına basit ortalama; cümle ve zaman ölçüleri noktalı videolardan):

| | Kel/dk | Ort. cümle | Vurucu % | Uzun % | Soru/100 | ? /dk | Hitap/100 | Seslenme/dk | Argo/dk | Biz/100 | Zaman: şimdiki/geniş/geçmiş/-mış/isim % | Mizah/dk (elle sayım) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Uzun form (6) | **162** | 9.4 | 27.2 | 4.4 | 0.88 | 1.14 | 0.74 | 0.52 | 0.96 | 0.92 | 10/5/46/6/31 | **~2–3** (en yoğun anda ~5) |
| Shorts (2) | **163** | 9.6 | 21.4 | 0 | 0 | 0 | **0** | 0 | 0.58 | 0.38 | Hürmüz: 29/50/0/0/21 | Hürmüz 1 şaka, şehzade 0 |
| Bizim metinler | 120 | 8–13 | 15–43 | – | 0.5–3.6 | – | **0** | 0 | 0 | 0–0.5 | geniş zaman ağırlıklı | 0 |

**Okuma notları:**
- Hız iki biçimde de **~155–170 kel/dk**, eski Osmanlı videosunda 190. Bizimkinden %30–60 hızlı.
- Kısa ve vurucu cümle oranı yüksek (%20–35). Eski videolarda ortalama cümle 7,5 kelime; yeni analiz videolarında 11–12 kelimeye çıkmış.
- **Soru:** Kendi sorup kendi cevaplıyor, dakikada 1–2 soru. Hitap uzun formda yüksek ("dostlarım", "sevgili Kayaalp izleyicileri"). **Shorts'ta yalnızca kanca cümlesinde** var ("biliyor muydunuz?"), araç bunu sıfır ölçüyor.
- **Zaman:** Taban `-dı`. Hızlı olay zincirlerinde tarihsel şimdiki zaman ve geniş zaman kullanıyor ("tahta çıkar", "savaş ilan eder"). İsim cümlesi oranı yüksek (%22–45): "Avrupa'nın ilk faşist diktatörü!", "Savaş!" gibi ünlemli fragmanlar.

## Anlatıcı profili
Yusuf Kayaalp'in anlatıcısı bir **"mahalle abisi" ya da stand-up anlatıcısı**: hızlı, argolu, kendinden emin, sürekli şaka yapıyor. Devletleri ve padişahları kişileştirip birbirleriyle konuşturuyor. Skeçler eski videolarda tek ses, yeni videolarda birden çok seslendirmeciyle çekiliyor. Kendini de hikâyenin içine katıyor: Hitler'i onun videolarını izlerken gösteriyor, kendine "Evliya Kayaalp" adında bir sahte kronikçi uyduruyor. İzleyiciyle ilişkisi samimi ve aidiyet kuran türden ("dostlarım", "sizin tarihsel rakibiniz"). Yargısı sert ve tek yönlü ("en cahil", "en barbar"); yer yer etnik iğneleme ve cinsiyetçi ya da homofobik şakalara kayıyor. Eski videolar oyun ve meme diliyle akan bir hükümdar listesiydi. Yeni videolar daha analitik bir jeopolitik anlatı: senaryo ağacı, olası sonuçlar ve "gerçek tarihte" çapası var. Ama sponsorlu skeçle açılıyor, argo yoğunluğu sürüyor. Shorts'ta bambaşka: argo neredeyse yok, tek bir iddia ya da soruyla açılıp ironik bir ileri atlamayla ya da tezin tekrarıyla kapanıyor.

## Teknik kataloğu
| # | Teknik | Ne yapıyor | Sıklık | Neden işe yarıyor | Örnek (zaman) |
|---|---|---|---|---|---|
| 1 | **Ters köşe kanca (ironik kurulum)** | "Her şey harika" diye kuruyor, bir eksiklik sezdiriyor, sonra eksiği tek kelimeyle patlatıyor | Eski videolarda açılışta | Beklenti kırılması gülümsetiyor; konunun adı bir punchline oluyor | I. DS 0:12–0:22: "Harika bir dönem ama sanki bir şey eksik." … "Aha evet! Savaş!" |
| 2 | **Sahte karşı-olgu ("Ama dur")** | Olayın olmadığı bir dünya kurup hemen yıkıyor | Video başına 3–6 "Ama dur!" dönemeci | Bilinen olayı yeniden şaşırtıcı kılıyor; bir dönemeç işareti oluyor | I. DS 1:52: "Ama dur, ne geziye gitti ne de suikasta uğradı. Ve dünya yüzyıllar boyunca huzur içinde yaşadı." (1:57: "Ama öyle olmadı.") |
| 3 | **Kişileştirilmiş devlet diyalogları** | Diplomasiyi iki "dostum"un konuşmasına çeviriyor | I. DS'de ~8 skeç; yeni videolarda açılış skeci ve 2–3 ara skeç | İttifak ağını ilişkiye çeviriyor; anlaşılması kolay | (I. DS 1:57–9:00, alıntısız) |
| 4 | **Kendi sorup kendi cevaplama** | Bir soru atıp 1–2 saniye içinde cevaplıyor | 1–2/dk | Merak ve doyum döngüsünü saniyelere indiriyor; tempo veriyor | Osmanlı 13:24: "Nedir sizce? Tabii ki Ruslar!" |
| 5 | **İzleyiciyi hükümdar koltuğuna oturtma** | İkinci tekil şahısla izleyiciye karar soruyor ("Bunu düzeltmek mi istiyorsun hünkârım?") | Osmanlı'da ~10 kez | İzleyiciyi oyuncuya çeviriyor (strateji oyunu hissi) | Osmanlı 0:20: "Bu karmaşık, ne idüğü belirsiz dönemde sınırları hangi uç beyliğine emanet edeceksin dostum?" |
| 6 | **Refren ve tekrar şakası** | Bir sözü üç kez ya da bir eylemi zincirleme tekrarlıyor: "Tekmele!", fetih yaptı / fetih yaptı, "borç aldı" zinciri | Video başına 2–4 refren | Çok olayı tek ritimde sıkıştırıyor ve akılda kalıyor | II. DS ~4:10: "Bam! Burası artık Almanya'nın!" (iki kez) |
| 7 | **Modern ve oyun benzetmeleri** | Tarihî olayı oyun, kripto ya da gündelik hayat diliyle anlatıyor (seviye atlamak, ikiye katlamak, okey masası) | Eski videolarda dakikada 1+, yeni videolarda daha az | Genç izleyiciye anında anlam veriyor. Bedeli: anakronizm ve küçümseme | (Osmanlı 3:11, 7:24; I. DS 4:25, alıntısız) |
| 8 | **İronik ileri atlamayla kapanış** | Mutlu bir son kuruyor, sonra gelecekteki felaketi tek cümleyle söylüyor | Videoların çoğunda | Sonraki konuya merak bırakıyor ve ironiyle akılda kalıyor | I. DS 11:46: "Herkes mutlu mesut bir şekilde yaşayacaktı. Tabii ki sadece 20 yıl boyunca!" · II. DS 13:18: "O da yeni global bir çatışmaya sebep olacaktı. Çok soğuk bir çatışmaya…" |
| 9 | **Simetrik ironi (Shorts)** | Olayın kahramanını yıllar sonraki benzer kaderine bağlıyor | Şehzade Shorts'u | Kapanışı bir "aha" anına ve sonraki konuya köprüye çeviriyor | Şehzade 0:28: "Lakin savaş alanında tahta çıkan Yıldırım Bayezid, yıllar sonra tekrar bir savaş alanında tahtını kaybedecekti." |
| 10 | **Shorts kancası: "biliyor muydunuz?" ya da "X isterse Y"** | İlk cümle ya bir rekor sorusu ya da cüretli bir koşul cümlesi, hemen ardından "Çünkü …" | Her iki Shorts'ta | İlk saniyede iddia, ikinci saniyede gerekçe: kaydırma refleksini kırıyor | Şehzade 0:00: "Osmanlı tarihinde hiçbir suçu olmadan ve isyan etmeden idam edilen ilk şehzadeyi biliyor muydunuz?" · Hürmüz 0:00: "İran isterse dünya ekonomisini bir hamleyle altüst edebilir. Çünkü Hürmüz Boğazı onun elinde." |
| 11 | **Domino zinciri** | Bir olayın sonuçlarını geniş zamanda 4–6 kısa cümleyle sıralıyor (fiyat fırlar, fabrika durur, kriz çıkar…) ve tezi tekrar ederek kapatıyor | Hürmüz Shorts'u; analiz videolarında | Soyut riski somut bir sonuç sırasına çeviriyor | (Hürmüz 0:24–0:45, alıntısız) |
| 12 | **Karşı-olguda kip disiplini** | Senaryoyu `-ebilirdi` ve "kuvvetli ihtimal" ile, gerçeği "gerçek tarihte bile …" ile ayırıyor; kendi tezini de sınırlıyor | 2. DS videosunda ~10 kez | Spekülasyonla olguyu kulakla ayırt ettiriyor. Bizim 🟡 dilimize yakın | 2. DS 13:19: "Bunların kesinlikle yaşanacağı söylenemezdi ama böyle bir riskten kaçınılmış oldu." |
| 13 | **Şakayı açıkça işaretleme** | Uydurduğu ayrıntıyı hemen "uydurdum" diye itiraf ediyor; sahte kaynak (Evliya Kayaalp) şakayı belli ediyor | Eski videolarda 2–4 kez | Mizahla olguyu ayırmaya çalışıyor. Ama izleyicinin aklında uydurma kalabilir | II. DS 2:41: "Sonuncusunu uydurdum ama Almanları anlamamıza yardım oluyor." |
| 14 | **Yol haritası cümlesi** | "Önce …'ya kısaca bakalım. Ardından … geçelim" | Yeni videolarda 1 kez | Uzun analizde yön veriyor | (2. DS 1:50, alıntısız) |
| 15 | **Keskin ton dönüşü** | Şaka akışının ortasında vahşet anında tamamen ciddileşiyor (Nanking, Holokost, Kırım) | Savaş videolarında 2–3 kez | Kontrast trajediyi daha görünür kılıyor | (II. DS 4:40, 11:10, alıntısız) |
| 16 | **Tez cümlesiyle kapanış** | Analizi tek bir aforizmayla bitiriyor ("X bir tercih değil, bir ihtiyaç") ya da ünlü bir sözle | Yeni videolarda | Paylaşılabilir son cümle | (Coğrafya 12:03; 2. DS 14:00, alıntısız) |

## Video başına dokuz soru
1 kanca · 2 kişilik ve mizah · 3 izleyiciyle ilişki · 4 yapı ve açık döngüler · 5 ritim · 6 açıklama araçları · 7 belirsizlik dili · 8 kapanış · 9 tempo.

**I. Dünya Savaşı (12:09)**
1. Tarih kartı ("1914…") ve ters köşe kanca; **~22 sn**. Vaat: savaşın nasıl çıktığı.
2. Stand-up anlatıcı. Mizah ~1,7/dk (skeçler, argo, ironik yorum). Yargılar sert.
3. Tahmin onayı ("tahmin ettiğiniz gibi"), "Yani düşünün…". Anlatıcı kendini de katıyor ("devletler benim gibi düşünmüyor").
4. Ülke ülke gerilim haritası → kıvılcım (Saraybosna) → ittifak dominosu → Belçika → siper savaşı → yeni müttefikler (Osmanlı 7:10) → 1917 → ABD → çöküş → ağır anlaşma → "20 yıl" kancası. Döngüler mikro ("Peki kim?" sorusunun cevabı 1–3 sn'de geliyor). Büyük soru: "Kim önce pes edecekti?" (9:58), cevap hemen geliyor.
5. Ortalama 7,5 kelimelik cümleler, %34 vurucu, ünlem 1,56/100. "Ama dur" dönemeçleri.
6. Kişileştirilmiş diyalog ve gündelik benzetmeler (yemeğin tuzu, okey masası).
7. Az: "muhtemelen öyleydi", "olabilir". Yargılar kesin.
8. İronik ileri atlama, bağlantılı video önerisi ve "bir sonraki videoda görüşmek üzere".
9. 157 kel/dk. İlk 30 sn'de ~4 bilgi.

**II. Dünya Savaşı (13:41)**
1. Beğeni isteyen bir skeç (Hitler kanalı izliyor), 0:00–0:49. **Konu dışı 49 sn**, sonra "Yıl, 1902…" ile bir kişinin gençliğinden açılış.
2. Mizah ~1,5/dk. Argo var. Vahşet anlarında keskin ciddileşme.
3. Hitap düşük (0,15/100); "anlayacağınız".
4. Mussolini'nin gençliği → Hitler → Japonya → genişleme ("bam!") → Polonya → Garip Savaş → Norveç → Fransa → Britanya → Barbarossa → Pearl Harbor → Holokost → Stalingrad → Normandiya → çöküş → atom bombası → Soğuk Savaş kancası.
5. Ortalama 7,6 kelime, %29 vurucu. Girişte tarihsel geniş zaman (taşınır, yazar, tutuklanır).
6. Refren şakası ve diyalog.
7. Uydurmayı itiraf ediyor; kayıpları aralıkla veriyor (50–80 milyon).
8. Kelime oyunuyla sonraki konuya geçiş.
9. 149 kel/dk. İlk 30 sn'de 0 tarih bilgisi.

**Türkiye'nin coğrafyası (12:24, en yeni)**
1. Bir karakterin repliği ve kendisiyle dalga geçen bir düzeltme (0:00–0:06), ardından tez: Türkiye üç bölgeyi bağlayan köprü.
2. Argo yoğun (~1,7/dk), etnik iğnelemeler var. Mizah ~2/dk.
3. **En yüksek hitap** (1,31/100; siz/sen 1,1/dk). İzleyiciyi Türk vatandaşı olarak konumluyor.
4. Tez → avantajlar (Boğazlar, Akdeniz) → sponsor (1:20–2:35) → tarihsel tehditler (Rusya, Britanya, Fransa, Mussolini, Stalin) → NATO → 2003 tezkeresi → enerji ve Çin koridoru → göç → dezavantajlar (deprem, Ege, savaş komşuluğu) → tez cümlesi. Bölüm dönüşleri "Evet dostlarım" ile yapılıyor.
5. Ortalama 11,2 kelime; isim cümlesi %45 (iddia cümleleri).
6. Güncel olaylarla bağ (Montrö 2022, 1 Mart 2003, 2015 göç anlaşması).
7. Az. Görüş ve olgu iç içe.
8. Aforizma gibi bir tez cümlesi.
9. 155 kel/dk. İlk 30 sn'de ~5 bilgi.

**Türkiye 2. Dünya Savaşına Katılsaydı? (14:27)**
1. Tek cümlelik sponsor, seslendirilmiş skeç (Churchill ve Hitler, İnönü'yle), "Türkiye tarihinin en çok merak edilen 'ya girseydik' konusu" çerçevesi (0:50), seri tanıtımı ve beğeni çağrısı (1:10–1:50). İlk konu bilgisi ~0:50'de geliyor.
2. Argo ve siyasi göndermeler. Mizah ~1,5/dk.
3. "Dostlarım" 0,9/dk. İtirazı önceden söylüyor ("belki bazılarınız … diyebilir").
4. Yol haritası → İnönü kadrosu → Turancıların baskısı → senaryo 1 (1941, Mihver yanında) → sponsor (6:25–7:15) → Turancılık davası → senaryo 2 (1940, İngiliz baskısı) → senaryo 3 (1943, Adana) → gerçek kazanımlar → iletişim hatası → ünlü sözle kapanış.
5. Ortalama 11,7 kelime, %10,6 uzun cümle: analitik ritim.
6. Senaryo ağacı; "gerçek tarihte bile" çapası.
7. **Kanalın en iyi belirsizlik dili:** `-ebilirdi`, "kuvvetli ihtimal", "kesin değil", "kesinlikle söylenemez". Ama kapanıştaki İnönü sözü kaynaksız bir yaygın atıf ve düz söyleniyor.
8. Alıntıyla kapanış.
9. 153 kel/dk. İlk 30 sn'de 0 bilgi (skeç).

**Osmanlı İmparatorluğu (17:14, eski üslup)**
1. Sponsor cümlesi, Selçuklu'nun tek bir üçlemeyle özeti, izleyiciye karar sorusu ve cevap: Osman (0:24). **~24 sn**.
2. Oyun yayıncısı ya da meme anlatıcısı. Mizah ~3/dk (ilk 5 dk'da ~5/dk): oyun jargonu, sahte kronikçi, sert yargılar.
3. Padişahlara "sen/siz" diye sesleniyor; izleyiciye "Nedir sizce?" diye soruyor.
4. Padişah padişah kronoloji, her padişaha 15–60 sn. Dönem etiketleri (yükselme, duraklama, gerileme, dağılma) bölüm kapısı gibi kullanılıyor. Sona doğru şaka azalıyor, anlatı ciddileşiyor.
5. **190 kel/dk**, %35 vurucu. Refrenler.
6. Oyun ve pop kültür benzetmeleri.
7. Neredeyse yok. Tartışmalı konular (Abdülaziz'in ölümü, Fatih'in ölümü) kesin ya da imalı anlatılıyor; "rivayet" kelimesi bile şakaya malzeme oluyor.
8. Klişe ama net bir bitiş cümlesi.
9. İlk 30 sn'de ~8 bilgi.

**Osmanlı Nasıl Kuruldu? (9:57)**
1. Sponsor ve kitap çekilişi (0:00–0:12), dramatize diyalog (Bizans'ın İstanbul'a dönüşü, Türkmen beyleri), bağlam cümlesi (0:30).
2. Argolu. Mizah ~1,5/dk, çoğu skeçte. Anlatı kısmı daha düz.
3. "Dostlarım"; şakadan sonra izleyiciden özür dileyen bir sesleniş.
4. Güç boşluğu → Ertuğrul → Osman → İnegöl pususu (1284) → Kulaca ve Karacahisar → Bilecik düğün baskını (üç aşamalı plan ve skeç) → sponsor (4:40–5:43) → teşkilat → Koyunhisar (1302) → Orhan'ın yükselişi → ölüm (1324) → lirik kapanış.
5. Tarihli olay zinciri (1284, 1286, 1288, 1302, 1303, 1324).
6. Modern iş benzetmesi (gaza = maaş, yol ve yemek paketi); planı "üç aşama" diye listeleme.
7. Âşıkpaşazâde ve Neşrî rivayetleri (Bilecik düğünü, kadın kılığında askerler, Köse Mihal'in haber vermesi) tamamen düz anlatılıyor. Bizde 🔴.
8. Destan ve ağıt tonu.
9. 168 kel/dk. İlk 30 sn'de 0 bilgi.

**Shorts: Hürmüz (0:50)**
1. Cüretli iddia ve "Çünkü" (0:00–0:05).
2. Ciddi ve gündelik ton; tek bir şaka (kendini benzin kuyruğuna koyuyor).
3. Hitap 0.
4. İddia → coğrafya → oran → domino sonuçlar → ABD neden orada → tezin tekrarı.
5. Kısa geniş zaman cümleleri (geniş %50).
6. Oranı insanileştirme (her beş varilden biri).
7. Koşul kipi ("isterse").
8. Tezin tekrarıyla döngüsel kapanış.
9. 156 kel/dk. İlk 30 sn'de ~5 bilgi.

**Shorts: Suçsuz idam edilen şehzade (0:32)**
1. "…biliyor muydunuz?" (0:00–0:04).
2. Ciddi. Mizah 0.
3. Tek hitap kancada.
4. Kanca → Kosova'da suikast → Bayezid tahtta → Yakup çağrılıyor → idam → gerekçe → simetrik ironi.
5. Tarihsel şimdiki zamandan (çıkar, emredilir) geçmiş zamana (idam edildi) geçiş.
6. Yok, sade olay.
7. Padişahın iç dünyası (pişmanlık duymadı) kaynaksız iddia ediliyor.
8. İleriye atlayan ironi (1402 Ankara'ya gönderme).
9. 170 kel/dk. İlk 30 sn'de ~6 bilgi.

## Yapı haritası
**Uzun form (10–17 dk):**
`0:00 sponsor cümlesi ya da konu dışı skeç` (0–50 sn) → `ters köşe kanca ya da konu çerçevesi` → `seri tanıtımı ve şakalı beğeni çağrısı` → `yol haritası ("önce…, ardından…")` → `hızlı kronoloji ya da senaryo ağacı`: her alt bölüm "Peki …?" ya da "Ama dur!" ile dönüyor; araya skeçler ve refrenler giriyor → `sponsor` (1:20–2:35 ya da 4:40–7:15), dönüş "Nerede kalmıştık?" ile → `değerlendirme` ("Evet dostlarım, görüyorsunuz ki…") → `kapanış`: ironik ileri atlama, alıntı ya da tez cümlesi; bazen "bir sonraki videoda görüşmek üzere".

**Kısa form (30–50 sn):**
`0:00–0:05 iddia ya da "biliyor muydunuz?" ve "Çünkü"` → `0:05–0:40 olay ya da sonuç zinciri` (kısa geniş zaman cümleleri) → `son cümle`: tezin tekrarı ya da ironik simetri. Sponsor, skeç, hitap ve çağrı yok; argo yok ya da tek bir tane.

**Fark:** Uzun formdaki kanca ilk 30 saniyede çoğu zaman **sıfır bilgi** veriyor (sponsor ve skeç); izleyiciyi markaya sadakatle tutuyor. Shorts ise ilk 5 saniyede tez ve gerekçe veriyor, 30 saniyede ~6 bilgi. Mizah uzun formun motoru, Shorts'ta neredeyse yok: kısa formda kanalın başarısı şakadan değil, **iddia ve ironi kurgusundan** geliyor.

## Bize ne alınır, ne alınmaz
**Alınır** (ciddi ve sıcak bir tona çevrilerek)
1. **Shorts kancaları:** "…biliyor muydunuz?" (rekor ya da ilk olay) ve "X olursa Y. Çünkü…" (iddia ve gerekçe). İkisi de ilk 3 saniyeye sığıyor; Emrullah Uzun'un sesiyle de çalışır.
2. **İronik ya da simetrik kapanış:** Şehzade Yakup ile Bayezid'in Ankara'sı gibi, bölümün kahramanını gelecekteki kaderine bağlayan tek cümle. Bizim "son cümle merak kancası" kuralımızın en iyi örneği; doğrudan sıradaki bölüme köprü olur.
3. **Kendi sorup kendi cevaplama:** "Peki bu boşluğu kim dolduracaktı? Söğüt'teki küçük bir oba." 60–75 sn'de 2–3 kez, cevap 1 saniye içinde.
4. **Ters köşe kurulum (ciddi tonda):** "Her şey yolunda görünüyordu. Tek bir şey eksikti…" Şaka olmadan da beklenti kırar.
5. **"Ama" dönemeci:** "Ama dur!" yerine "Ama hikâye burada bitmedi." ya da "Ama…". Sahte karşı-olgu bizde kullanılmaz; gerçek dönemeci vurgulamak için kısa bir "Ama" yeter.
6. **Refrenle sıkıştırma:** "Bilecik… Yarhisar… İnegöl…" Her fetih bir harita vuruşuna (hit) kilitlenir. Tekrar ritmi kurgu ritmine dönüşür.
7. **İzleyiciyi karar anına oturtmak:** "Söğüt'te bir uç beyi olduğunuzu düşünün: Doğuda Moğol, batıda Bizans…" Bölüm başına en fazla bir kez, ikinci çoğul şahısla ve saygılı bir tonla.
8. **Karşı-olguda kip disiplini:** Senaryo `-ebilirdi`, olgu `-dı`; "gerçek tarihte…" çapası. 🟡 için hazır kalıp.
9. **Domino zinciri:** Bir olayın sonuçlarını 3–4 kısa cümleyle sıralamak (Kösedağ → vergi → beylikler → uçlar). Harita animasyonuyla birebir eşleşir.
10. **Tempo:** Kanalın Shorts'u 155–170 kel/dk. Bizim 120, Reels için yavaş. **140–150 kel/dk** hedefi makul.

**Alınmaz**
1. Argo, küfür, homofobik, cinsiyetçi ve etnik şakalar; "en cahil", "en barbar" gibi kesin yargılar. Tarafsız çizgimize ve Emrullah Uzun'un ciddi sesine aykırı.
2. Uydurma kaynak şakası (Evliya Kayaalp) ve "uydurdum" şakaları. Rozet sistemimizde ⚪ seslendirmeye bile giremez; uydurma ayrıntı izleyicinin aklında olgu gibi kalabilir.
3. Sponsor, beğeni ya da skeçle açılış: ilk 30 saniyede sıfır bilgi.
4. Rivayeti düz anlatmak (Bilecik düğünü, Osman'ın rüyası). Bizde bunlar 🔴 çerçevesiyle anlatılır.
5. Anakronik oyun jargonu (seviye, kripto). Dönemi küçümsüyor ve görsel stil kitabımızdaki "strateji oyunu arayüzü" yasağıyla çelişiyor.
6. 190 kel/dk ve %35 vurucu cümle. Bizim akıcı paragraf üslubumuzu (skill: "bölük pörçük dil reddedildi") bozar.
