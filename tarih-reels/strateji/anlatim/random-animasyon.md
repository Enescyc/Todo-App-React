# Random Animasyon: anlatım analizi

> Kaynak: 21 Ekim 2026'da yt-dlp ile alınan Türkçe otomatik altyazılar (elle yazılmış Türkçe altyazı yok). Transkriptler `strateji/transkript/random-animasyon/` altında (git dışı). Araç çıktısı: `transkript/random-animasyon/olcum.md`.

## Künye
- **Kanal:** Random Animasyon (`@RandomAnimasyon`), yaklaşık **491 bin abone**, 417 uzun video ve 71 Shorts.
- **Kanal karakteri:** Kanal 2020–2022'de skeç ve parodi yapıyordu ("Google Türk olsaydı", "Among Us"). 2022'den sonra tarih ağırlıklı formatlara geçti: "… olsaydı?" alternatif tarih ("Animasyonlu Hızlı Anlatım", 8–10 dk) ve 2025–2026'da "Eğer … olsaydın?" serisi (12–13 dk). Uzun videoların çoğu **tek anlatıcılı değil**: birden çok seslendirmenin oynadığı diyaloglu sahnelerden oluşuyor. Anlatıcı yalnızca yeni "olsaydın" formatında, sahneler arasında köprü olarak giriyor.

| # | Video | Süre | Görüntülenme | Neden seçildi |
|---|---|---|---|---|
| 1 | ATATÜRK DAHA UZUN YAŞASAYDI? (x1gh1NjAqcc) | 9:42 | 2,16 M | En çok izlenen tarih videosu (kanalda 1.) |
| 2 | 1. DÜNYA SAVAŞINI OSMANLI KAZANSAYDI? (pfrpkxPgNCQ) | 8:12 | 1,43 M | En çok izlenen 2. tarih videosu (aradaki 1,9 M'lik Among Us derlemesi tarih dışı olduğu için atlandı) |
| 3 | 1. DÜNYA SAVAŞINDA OSMANLI ASKERİ OLSAYDIN? (eKI-gAbAcF8) | 12:38 | 144 b | En yeni tarih videosu ("olsaydın" formatı). En yeni video "Afganistan'da doğsaydın" tarih dışı olduğu için atlandı |
| 4 | OSMANLI'DAKİ EN GARİP YASAKLAR! (H77lGSsHzlU) | 12:54 | 359 b | En yeni 2. tarih videosu |
| 5 | OSMANLI İMPARATORLUĞUNUN KURULUŞU (ksIpNc-PpLw) | 8:00 | 364 b | Konumuz: Sezon 1 (kuruluş, Bilecik, Karacahisar) |
| 6 | OSMANLININ DEVLEŞTİĞİ SAVAŞ: VARNA 1444 (m_lB2EO4ZBs) | 9:11 | 184 b | Konumuz: Osmanlı meydan muharebesi; 8 numaralı Shorts'un kaynağı |
| 7 | Shorts: 1 DAKİKADA BİRİNCİ DÜNYA SAVAŞI NASIL BAŞLADI (V2_r-zm8BlE) | 0:60 | 3,79 M | Kanalın en çok izlenen Shorts'u |
| 8 | Shorts: HAÇLI SEFERİ \| VARNA SAVAŞI 1444 (bRaKxZ-LHkM) | 0:46 | 956 b | En çok izlenen Osmanlı Shorts'u. 6 numaralı videodan kesilmiş sahne, kısa ve uzun formu karşılaştırmak için |

## Nicel tablo
Araç çıktısı (`anlatim_analiz.py`, seçili sütunlar). Noktalaması olmayan otomatik altyazılarda (5/8) cümle ölçüleri ve anlatı zamanı hesaplanamadı.

| Video | kelime | kel/dk (brüt) | ort. cümle | vurucu % | uzun % | soru /100 | hitap /100 | "biz" /100 | şimdiki / geniş / geçmiş / -mış / isim % | merak /100 | sayı /100 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Atatürk | 1286 | 133 | – | – | – | 0.62 | 1.63 | 4.51 | (noktalama yok) | 0.93 | 0.08 |
| 2 1. DS kazansaydı | 1010 | 125 | – | – | – | 2.08 | 2.38 | 3.07 | (noktalama yok) | 1.49 | 0.10 |
| 3 Osmanlı askeri olsaydın | 2090 | 166 | 6.7 | 38.7 | 0.3 | 1.53 | 0.57 | 4.59 | 16 / 6 / 21 / 4 / 50 | 0.96 | 0.53 |
| 4 Garip yasaklar | 2162 | 169 | 7.4 | 37.0 | 1.7 | 4.21 | 1.62 | 1.57 | 5 / 15 / 14 / 1 / 63 | 0.97 | 0.00 |
| 5 Kuruluş | 824 | 103 | – | – | – | 0.73 | 1.58 | 4.73 | (noktalama yok) | 0.61 | 0.12 |
| 6 Varna | 1245 | 145 | 7.5 | 41.8 | 2.4 | 2.89 | 1.12 | 3.13 | 9 / 8 / 16 / 4 / 59 | 0.64 | 1.12 |
| 7 Shorts 1. DS | 136 | 138 | – | – | – | 2.94 | 1.47 | 4.41 | (noktalama yok) | 2.21 | 1.47 |
| 8 Shorts Varna | 118 | 148 | – | – | – | 0.85 | 1.69 | 2.54 | (noktalama yok) | 0.00 | 0.00 |
| **Kanal ortalaması** | 1109 | **141** | **7.2** (n=3) | **39** | **1.5** | **1.98** | **1.51** | 3.57 | 10 / 10 / 17 / 3 / 57 (n=3) | 0.98 | 0.43 |

**Ek ölçüler** (otomatik altyazının kelime zamanlarından, betik `scratchpad`):

| Ölçü | Değer |
|---|---|
| **Net konuşma hızı** (1,5 sn'den uzun duraklamalar hariç) | 136–165 kel/dk, ortalama **≈152 kel/dk (≈2,5 kel/sn)** |
| Duraklama ve müzik payı | %0–13, ortalama **≈%6**. 1,5 sn'yi aşan duraklama dakikada ~1, en uzunu 4–14 sn |
| **Anlatıcı pencereleri** (yalnızca anlatıcı: #4 2:44–3:31 ve 6:25–6:56; #3 4:15–5:02 ve 9:18–10:08) | 156–170 kel/dk · ort. cümle 7,2–11,5 · vurucu %26–37 · soru 0–1,4/100 · **2. tekil hitap ≈4/100 kelime** (elle sayım; araç "sen" fiil eklerini saymıyor) · zaman: geçmiş %42–57, isim %26–42, şimdiki %5–14 |
| Anlatıcının süreye oranı (yeni format) | %10–13 (12–13 dakikalık videoda toplam 78–97 sn) |
| Belirsizlik dili ("göre, belki, olabilir, derler…") | 0–7,4 / 1000 kelime. Neredeyse tamamı karakter ağzından, kaynak belirtmek için değil |
| Mizah sıklığı (elle sayım, yaklaşık) | Eski "Hızlı Anlatım" videoları **≈1,4 espri/dk**; yeni "olsaydın" videoları **0,2–0,7/dk** |

**Okuma notu:** Uzun videolarda hitap, "biz" ve soru değerleri büyük ölçüde **karakterlerin birbirine** söylediklerinden geliyor. Örneğin karakterlerin padişaha "siz" demesi hitap olarak sayılıyor, ama izleyiciye yönelik değil. İzleyiciye gerçekten konuşan ses yalnızca anlatıcı pencerelerinde var, orada da ikinci tekil "sen" kullanılıyor.

## Anlatıcı profili
Random Animasyon'un asıl "anlatıcısı" bir kişi değil, bir **oyuncu kadrosu**. Tarih, padişahların, paşaların, köylülerin ve kişileştirilmiş ülkelerin ağzından, sokak Türkçesiyle oynanan sahnelerle aktarılıyor. Bilgi çoğunlukla padişaha havadis getiren bir habercinin ağzından geliyor. Ardından gelen tepki cümlesi espriyi taşıyor. Yeni formatta sahnelerin arasına ikinci tekil şahısla konuşan, empati kuran bir **rehber anlatıcı** giriyor ("Düşün…", "Şimdi zamanı geriye sar…"). Bu anlatıcı izleyiciyi olayın içine yerleştiriyor ve sonraki bölümün yol haritasını veriyor. Mizah eski videolarda argo, anakronizm ve küfre yakın tepkilerle yoğun; yeni videolarda dramatik ve duygusal bir tona geçilmiş. Yorum ve yargı düzeyi yüksek: taraflar açıkça "iyi" ve "hain" diye kuruluyor, efsaneler (Bilecik düğün baskını, Nilüfer, fıçılara saklanan askerler) belirsizlik işareti olmadan olgu gibi oynanıyor. Tempo hızlı (≈2,5 kel/sn) ve neredeyse hiç sessizlik yok: sahneler müzik altında arka arkaya bağlanıyor.

## Teknik kataloğu
| # | Teknik | Ne yapıyor | Sıklık | Neden işe yarıyor | Kısa örnek |
|---|---|---|---|---|---|
| 1 | **Sahne ortasından soğuk açılış** | Video, başlıktaki konuyu açıklamadan bir sahnenin ortasında açılıyor (tellal, kayıkçı, toplantı) | 8/8 video. Kanca 12–50 sn, yeni formatta açılış sahnesi 2,5–4 dk | Merak bilgiden önce geliyor. İzleyici bağlamı kendi kuruyor | (#3, 0:00) Tellal seferberliği duyurarak açıyor. Anlatım yok, doğrudan olay |
| 2 | **"Sen"li hipotetik kanca** | Anlatıcı izleyiciyi döneme yerleştiriyor: "olsaydın… kalırdın/sürüklenirdin" | Yeni formatın 2 videosunda da var, soğuk açılıştan sonra 45–50 sn | Kişisel risk duygusu yaratıyor. Başlık vaadini ("olsaydın?") doğrudan izleyiciye bağlıyor | (#4, 2:56) "Şimdi zamanı birkaç yüzyıl geriye sar." (#3, 4:15) "Düşün, henüz 18'ine bile basmadın." |
| 3 | **Tebrik ironisi + şok vaadi** | Ağır bir sonucu hafif bir kalıpla söylüyor ("tebrikler") | Kanca başına 1 | Zıtlık akılda kalıyor. Kural ile ceza arasındaki orantısızlığı tek cümlede gösteriyor | (#4, 2:58) "Eğer elinde mumlu bir fenerin yoksa tebrikler. Birazdan kafan gövdenden ayrılabilir." |
| 4 | **Üçleme ve "Peki sen…?" sorusu** | Üç somut yasak ya da üç cephe sıralanıyor, ardından izleyiciye soru soruluyor | Her "sen" kancasında | Üçleme ritim kuruyor, soru açık döngüyü açıyor | (#4, 3:20) "Peki sen bu akıl almaz yasakların ortasında sıradan bir vatandaş olsaydın kelle koltukta bu sokaklarda nasıl hayatta kalırdın?" |
| 5 | **Yol haritası + açık döngü** | Kancada sayılan maddelerden biri ileride "ödeniyor" | #4: fener 2:56'da anılıyor, 6:25–9:40'ta sahnesi geliyor. #3: Sarıkamış, Çanakkale, Kanal 4:30'da sayılıyor, sırayla işleniyor | İzleyici neyin geleceğini bildiği için kalıyor | (#3, 4:30) Cepheler önceden sayılıyor, sonra sırayla sahneye dönüşüyor |
| 6 | **Köprü cümlesi (işaret levhası)** | Anlatıcı bir bölümü özetleyip sonrakini ilan ediyor | Yeni formatta 2–3 kez | Uzun videoyu bölümlere ayırıyor, yeniden dikkat topluyor | (#4, 6:51) "Şimdi Osmanlı'da gece uygulanan o acımasız yasaya gidiyoruz." |
| 7 | **Habercinin kötü haberi** | Bilgiyi haberci ya da vezir getiriyor, hükümdarın tepkisi espriyi kuruyor. "Bir şey daha var" ile tırmanıyor | Eski formatta dakikada ~1 | Kuru bilgiyi diyaloga çeviriyor, gerilim ve mizah aynı anda kuruluyor | (#6, 1:58) "Bir şey daha var ama söylemeye dilim varmıyor." |
| 8 | **Anakronik ve argo espri** | Modern oyun, teknoloji ve argo referansları tarihî sahneye yerleştiriliyor | Eski formatta ≈1,4/dk | Genç izleyici için tanıdıklık ve şaşırtma yaratıyor | (#6, 3:40) Okçular için "Sanki kantır oynuyor." |
| 9 | **Kişileştirme** | Ülkeler masa başında kavga eden karakterlere dönüşüyor | Alternatif tarih videolarının tamamı | Karmaşık diplomasiyi kişiler arası çatışmaya indiriyor | (#2, 0:20–1:13) İçeriği sonraya bırakılan "mektup" sahnesi, açık döngü ~50 sn |
| 10 | **Sayıyı insanileştirme** | Kayıp istatistiğini tek bir aileye indiriyor | Yeni formatta kapanışa yakın 1 kez | Duygusal ağırlık kuruyor | (#3, 4:46) Anlatıcı, sayıların kâğıtta yalnızca rakam olduğunu ama her birinin evde beklenen biri olduğunu söylüyor (aktarım) |
| 11 | **Çerçeve anlatıcı (kısa form)** | Bir karakter arkadaşlarına "olayı" anlatıyor, anlattığı sahneler canlandırılıyor | Shorts #7 | Kısa formda anlatıcıyı hikâyenin içine koyuyor | (#7, 0:00) "Ulan bir adam öldü diye savaş mı çıkar?" (#7, 0:12) "Abi olay tam olarak şöyle oluyor." |
| 12 | **Tekrarlayan kapanış ve imza sözü** | Sahnenin son sözü bir punchline ya da imza söz oluyor | #1 ve #5'te "Ha şunu bileydiniz" | Kanal kimliği ve "bir sonraki"ne bırakılan gülümseme | (#2, 7:44) "Osmanlı hazır fırsatımız varken Amerika'ya da mı gitsek ne diyorsun?" |

## Video başına 9 soru (kısa)
- **#1 Atatürk:** *Kanca:* doktorlar ve İnönü arasında hastalık sahnesi; vaat (~0:47): ülkenin ona daha uzun yıllar ihtiyacı olduğu. Soğuk açılış, ~50 sn. *Kişilik:* yalnızca karakterler, ≈1,4 espri/dk, yargı yüksek (Atatürk her hamlede dâhi). *İlişki:* yok. *Yapı:* Churchill, Hitler ve İnönü sahneleri, pazarlıklar tırmanıyor, Misak-ı Millî kazanımları ve punchline. *Ritim:* kısa replikler, "tam olsun" türü tekrar esprileri. *Açıklama:* modern benzetmeler (freni boşalmış kamyon, uçak kaptanı anonsu). *Belirsizlik:* yok; kurgu olduğu başlıktan belli. *Kapanış:* "Ha şunu bileydiniz" ve müzik. *Tempo:* 9:42, ilk 30 sn'de ~2 bilgi.
- **#2 1. DS kazansaydı:** *Kanca:* kişileştirilmiş ülkeler toplantısının ortasında Rusya savaşı bırakıyor; mektup sırrı açık döngü (0:20 açılıyor, 1:13'te "İtalya'nın mektubu" sürpriziyle kapanıyor). *Kişilik:* parodi ve kişileştirme, ≈1,5 espri/dk. *Yapı:* hile, savaşın dönüşü, barış masası, yeni harita. *Kapanış:* bir sonraki maceraya göz kırpan soru. *Tempo:* 8:12, ilk 30 sn'de ~2 bilgi.
- **#3 Osmanlı askeri olsaydın:** *Kanca:* tellalın seferberlik duyurusu (0–12 sn), köylülerin konuşması. Asıl kanca 4:15'teki anlatıcı monoloğu ("Düşün…"). *Kişilik:* dramatik, mizah ≈0,2/dk. Anlatıcı empati kuruyor, ikinci tekil kullanıyor. *Yapı:* köy, Sarıkamış, Çanakkale, anlatıcı yol haritası, Kanal, Kut, Medine, anlatıcı köprüsü ("4 yıl boyunca…", 9:18), Filistin, Mustafa Kemal'in yola çıkışı. *Açıklama:* sayıyı insanileştirme, cephe ile ev cephesi karşıtlığı. *Belirsizlik:* yok. *Kapanış:* ulusal umut cümlesi (Kurtuluş Savaşı). *Tempo:* 12:38, ilk 30 sn'de ~3 bilgi.
- **#4 Garip yasaklar:** *Kanca:* 2:40'lık kayıkçı sahnesi, ardından 2:44–3:31 arası anlatıcı (bugünün özgürlüğüyle karşılaştırma, tebrik ironisi, üçleme, "Peki sen…?"). *Açık döngü:* fener (2:56 açılıyor, 6:25–9:40'ta ödeniyor). *Kişilik:* kara mizah ≈0,7/dk, padişah sert ve korkutucu. *Açıklama:* bugünle karşılaştırma. *Belirsizlik:* yok. Kahve yasağı cezaları ve fermanlar dramatize ediliyor, kaynak verilmiyor. *Kapanış:* sahnenin cezasıyla bitiyor, toparlama yok. *Tempo:* 12:54, ilk 30 sn'de ~1 bilgi.
- **#5 Kuruluş:** *Kanca:* Kayı obasında dedikodu, ~0:25'te Ertuğrul'un ölüm haberiyle ilk kırılma. *Kişilik:* halk komedisi (deyim ve atasözü esprileri). *Yapı:* İnegöl pususu, Bilecik düğünü planı, Karacahisar ve hutbe ile bağımsızlık. *Belirsizlik:* **yok**. Düğün baskını, kadın kılığında 40 yiğit ve Nilüfer'in adının değiştirilmesi olgu gibi oynanıyor (bizim sistemde 🔴). *Kapanış:* hutbeyle bağımsızlık ilanı. *Tempo:* 8:00, net 136 kel/dk, %13 duraklama.
- **#6 Varna:** *Kanca:* Haçlı tarafının Türkleri küçümsemesi (0:16). İzleyici sonucu bildiği için dramatik ironi var. *Yapı:* Papa'nın çağrısı, Niş, kötü haber zinciri, Zlatitsa çatışması, Segedin, antlaşmanın bozulması, Varna, kralın başı. *Mizah:* ≈1,4/dk (anakronizm, argo). *Açıklama:* sayılar diyalog içinde veriliyor. *Belirsizlik:* yok. *Kapanış:* zafer ilanı. *Tempo:* 9:11, ilk 30 sn'de ~3 bilgi.
- **#7 Shorts 1. DS:** *Kanca:* 0–2 sn'de kışkırtıcı soru, 12 sn'de "abi olay şöyle". *Yapı:* soru, çerçeve anlatı, suikast (tarih: 28 Haziran 1914), "İşte buradayız" ve insanlığa dair tek bir dilek cümlesi. *Tempo:* 60 sn, net 154 kel/dk.
- **#8 Shorts Varna:** Uzun videodan kesilmiş 46 sn'lik sahne. Kanca, düşmanı zaten yendiğini sanan komutanın şaşkın sorusu, kapanış punchline. Bağlam ve tarih verilmiyor, başlık ve görsel taşıyor.

## Yapı haritası
**Eski "Animasyonlu Hızlı Anlatım" (8–10 dk, anlatıcısız):**
`0:00 sahne ortası (premise karakter ağzından) → 0:45 ilk çatışma → her 1–2 dk'da yeni sahne: haberci getiriyor, tepki ve espri → 6–8 dk doruk (savaş ya da masa) → punchline, imza sözü, müzik`

**Yeni "Eğer … olsaydın?" (12–13 dk):**
`0:00 soğuk açılış sahnesi (2,5–4 dk) → anlatıcı kancası 45–50 sn ("sen", üçleme, "Peki sen…?", yol haritası) → 2–3 dk'lık bölüm sahneleri → anlatıcı köprüsü (30–50 sn, "Şimdi … gidiyoruz") → sahneler → duygusal ya da ulusal kapanış cümlesi`

**Kısa form (45–60 sn):** `0–2 sn soru veya şaşkınlık → (çerçeve anlatıcı "olay şöyle") → tek olay → 1 düşündürücü cümle ya da punchline`.
**Kısa ve uzun form farkı:** Shorts ya özel çekilmiş bir çerçeve skeç ya da uzun videodan kesilmiş tek sahne. Kısa formda tarih, yer ve sonuç tek cümleye iniyor, mizah ve tepki öne çıkıyor. Bağlam, başlık ve görüntüye bırakılıyor. Hız aynı kalıyor (~150 kel/dk).

## Bize ne alınır, ne alınmaz
**Alınır (Emrullah Uzun'un ciddi ama sıcak sesine uyarlayarak):**
1. **İzleyiciyi döneme yerleştiren tek bir cümle:** "Düşünün…", "Bir an kendinizi … yerine koyun." Kancada ya da kahraman anda, bölüm başına en fazla 1–2 kez. "Sen" yerine "siz" ya da kapsayıcı "biz" kullanılmalı: genç argo tonu yerine sıcak belgesel tonu.
2. **Somut sahneden teze geçiş:** 3–6 sn'lik bir mikro sahne (bir ses, bir siluet, tek cümle), ardından tez cümlesi. Bizim 60–90 sn'imize 2,5 dakikalık açılış sığmaz, ama sıra (önce sahne, sonra anlam) aynı kalır.
3. **Kancada anılıp sonda ödenen tek madde** (fener tekniği): 2. cümlede küçük bir ayrıntıyı anıp son 15 sn'de ödemek ya da bir sonraki bölüme taşımak.
4. **Üçleme + "Peki…?" sorusu:** Bölüm başına 1 soru; bizim soru oranımız 0,5–1,7/100, RA anlatıcısı 1,4/100.
5. **Sayıyı insanileştirme:** "Kâğıtta bir rakam, ama…" tipi cümle, ölçülü bir duyguyla.
6. **İşaret levhası cümlesi** ("Şimdi Koyunhisar'a gidiyoruz"): 2–3 dakikalık özel bölümlerde ya da sezon özetlerinde.
7. **Cümle uzunluğu:** RA ortalaması 7,2 kelime, %39 vurucu. Bizim 8–13 kelimelik metinlerimizde kanca ve doruk cümleleri ≤6 kelimeye inmeli.

**Alınmaz:**
- **Efsaneyi olgu gibi oynamak** (Bilecik düğünü, fıçılar, Nilüfer). Bunlar bizde 🔴 RİVAYET rozetiyle ve "rivayete göre" diye anlatılır.
- **Gerçek tarihî kişilere uydurma diyalog yazmak.** Kullanılacaksa yalnızca belgeli bir söz olur, rozetiyle birlikte.
- **Argo, küfür, anakronik oyun esprileri, "kafir/gavur" türü aşağılayıcı tepkiler** ve taraf tutan "iyi/hain" kurgusu: tarafsız çizgimize aykırı.
- **Hız:** RA anlatıcısı ≈2,6–2,8 kel/sn. Emrullah Uzun'un 2,0 kel/sn hızında kalmalıyız. Enerjiyi hızdan değil, kısa cümleden ve duraklamadan almalıyız.
- **Kaynak vermemek:** RA hiçbir yerde kaynak anmıyor. Bizim farkımız tam olarak bu.
