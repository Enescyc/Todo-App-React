# Anlatıcı dili: Osmanlı serisi

**Sürüm 2 · 21 Ekim 2026** (sürüm 1'den fark: hikâye önde, kaynak arkada; §0, §4, §9). Dayanak: 6 Türkçe kanalın 46 videosunun transkript analizi (`strateji/anlatim/*.md`), kanal karşılaştırması (`strateji/ANLATIM-ANALIZI.md`) ve ölçüm aracı (`shared/tools/anlatim_analiz.py`).
**Kim kullanır:** Her yeni metin bu rehberle yazılır, §11'deki puan kartıyla ve §12'deki ölçüm hedefleriyle kontrol edilir. Skill: `tarih-reels-senaryo`.
**Amaç:** Bir şeyi 40–50 saniyeye sıkıştırmak değil; eğlenceli, dikkat çekici ve güvenilir bir anlatım. Süre gerekirse uzar (§7). Ama her saniye bir şey kazandırmalı.

---

## 0. Tek cümlede anlatıcı
> Haritanın başında oturan, doğru bilgiyi harmanlayıp bütün Osmanlı tarihini tek bir hikâye gibi anlatan ve sizi sahneye çağıran sıcak bir anlatıcı.

**Temel ilke: hikâye önde, kaynak arkada.** Doğruluk işimizin temeli, anlatının konusu değil. Kullanıcı "şunun kaydı yok, bunu şu yazdı" diye kaynağa odaklanan metinleri geri çevirdi: amaç olayları anlatmak. Kaynak ayrıntısı `FACTS.md`'de, ekrandaki rozette ve paylaşım açıklamasında yaşar. Anlatıcı efsaneyi tek bir işaretle ayırır ("anlatılana göre") ve hikâyeye devam eder (§4).

## 1. Kanallardan ne aldık
| Kanal | En güçlü yanı | Bizim aldığımız | Almadığımız |
|---|---|---|---|
| **Holosen** | Shorts iskeleti: "öyle bir … ki" açık döngüsü → "Oysa/Ama" tırmanışı → doruk → tek cümlelik duygu | İskelet (§7), "Efsane şöyle:" çerçevesi (🔴), kaynak adıyla anlatım, "Evet, yanlış duymadınız." | 3 dakikalık giriş, doğrulanmamış alıntı, tek yönlü kimlik iddiaları |
| **Yusuf Kayaalp** | Kendi sorup kendi cevaplama; ironik ileri atlamayla kapanış; domino zinciri ve refren | "Peki…? Cevap." (T4), simetrik kapanış (S2), domino (T10), refren (T11), "-ebilirdi"/"gerçek tarihte" kip disiplini | Argo, uydurma kaynak şakası, oyun jargonu, 190 kel/dk |
| **Bebar Bilim** | "Ama bir saniye" ile efsane düzeltme; "siz o kaptansınız" sahnesi; ölçek benzetmesi; kesik üçleme | T5, T6, T8, T9, "X dediler ona" (T19), taşınan imge (T18), "-ecekti" önsezisi | Uzun felsefi giriş, argo, kişilere psikolojik teşhis |
| **Anime Tarih** | Haritaya susmak (sürenin %10'u sessiz); "Tarih…, yer…" levhası; iki seçenekli ihtilaf dili | Harita sessizliği (T15), levha (T1), "kimilerine göre…" (T7), yan yana ironi (T12), "Ta ki…" (T13) | Kancasız açılış, envanter dili, tören sıfatları |
| **Random Animasyon** | İzleyiciyi karar anına oturtmak; kısa cümle (ort. 7 kelime) | "Düşünün…" sahnesi (siz diliyle), kancada anılıp sonda ödenen ayrıntı, kısa ama tam kanca ve doruk cümleleri | "Sen" dili, gerçek kişilere uydurma diyalog, efsaneyi olgu gibi oynamak |
| **Harp Tarihi** | "Yıl 1302." açılışı; "-acaktı" askısı; rivayet karşılaştırması; doruktan sonra müzikli nefes | Hızın teyidi (2,0 kel/sn), tarih damgalı ilk cümle, "İki anlatım var" (🟡), sayı aralığı | Abone çağrısıyla açılış, dinî-taraflı ve eski dil, 20+ kelimelik cümleler |

**Not:** Tablodaki kaynak teknikleri ("Efsane şöyle:", kaynak adıyla anlatım, "Ama bir saniye", "İki anlatım var") analizde güçlü çıktı. Ama §0'daki ilke gereği bizde seyrek kullanılır: yalnız tartışmanın kendisi hikâyenin parçasıysa (§4).

**Ölçülerin özeti** (ayrıntı: `strateji/ANLATIM-ANALIZI.md`):
- Belgesel tarih kanallarının (Bebar tarih, Anime Tarih, Harp Tarihi) net hızı **≈2,0 kel/sn**: Emrullah Uzun'la aynı. Hızlı kanallar (Holosen Shorts, Yusuf Kayaalp, Random Animasyon) 2,5–2,8 kel/sn konuşuyor; son ikisinde bu hızı mizah ve skeç taşıyor.
- Bizim farkımız hızda değil, **izleyiciyle ilişkide**. Hitap neredeyse sıfırdı, "biz" dili yalnız kalıp ifadelerdeydi, soru azdı, anlatı yazı dilinin geniş zamanındaydı (%62) ve hiç susmuyorduk.

---

## 2. Anlatıcının kimliği
1. **Merak ortağı.** Soru sorar, cevabı bekletmez. Tek bir büyük soruyu ise bilerek sona saklar.
2. **Güvenilir hikâyeci.** Doğru bilgiyi harmanlar ve hikâye olarak anlatır. Kaynakları değil olayları anlatır. Efsaneyi tek bir işaretle ayırır, tartışmalı ayrıntıyı yuvarlak ve doğru söyler, hikâyeye devam eder.
3. **Sahne kurucu.** Bilgiyi önce bir görüntüyle verir: bir ses, bir ışık, bir yer. Sonra anlamını söyler.
4. **Ölçülü.** Kişilere sıfat takmaz ("hain", "büyük", "talihsiz"). Fiiller ve sonuçlar konuşur. Dram, yorumdan değil, olguları yan yana koymaktan doğar.
5. **Sıcak ama ciddi.** İzleyiciye "siz" der. Yer yer "biz"le yanına alır ("bakalım", "biliyoruz"). "Dostlarım", "arkadaşlar" ve "sen" dili yok.
6. **Mizahı olaylardan.** Anlatıcı şaka yapmaz. Gülümseten şey durumun kendi ironisi ya da kroniklerde anlatılan nükteli bir sözdür.

**Ses:** Emrullah Uzun (ElevenLabs v4), ayarlar `sezon-1-kurulus/SESLENDIRME.md`'de. Enerjiyi hızdan değil; kısa cümleden, dönemeç kelimesinden ve sessizlikten alırız.

---

## 3. Dil kuralları

### 3.1 Anlatı zamanı
| Ne anlatılıyor | Kip | Örnek |
|---|---|---|
| Olay (taban kip) | **-dı** | "Moğollar Selçuklu ordusunu bozguna uğrattı." |
| Arka plan, süreç | -yordu, -mıştı | "Merkez her yıl biraz daha zayıflıyordu." |
| **Doruk** (1–4 cümle) | **şimdiki zaman**, bir sahne çerçevesi içinde (§3.6) | "Gece yarısı yer sarsılıyor ve surlar çöküyor." |
| Rivayet çerçevesinin içi | **-mış** | "…şeyhin göğsünden bir ay doğmuş." |
| Önsezi ve kapanış | **-ecekti** | "Bu küçük beylik, yüz yıl sonra Balkanlar'dan Fırat'a uzanacaktı." |
| Coğrafya, genel doğru | geniş zaman (az) | "Sakarya, Söğüt'ün hemen yanından akar." |
| **Kaçın:** yazı dili "-dır/-tır" | — | "Liderinin adı Osman'dır." yerine "Başlarındaki beyin adı ise Osman." |

Geniş zaman en çok %15, "-dır/-tır" en çok %10 (ölçü: §12). Eski metinlerimizde olaylar geniş zamanla anlatılıyordu ("yener", "dönüşür"). Bu, ders kitabı sesi veriyor.

### 3.2 Cümle
- **Ortalama 8–11 kelime.** Cümlelerin %10–35'i 5 kelime ya da daha kısa (üst sınır kopukluğa karşı). **20 kelimeyi aşan cümle yok.**
- **Kanca ve doruk cümleleri kısa ama tam cümledir** (yüklemi olan). İlk cümle ≤ 8 kelime hedeflenir; tarih yazıyla yazıldığı için birkaç kelime aşabilir. Son cümle ≤ 12 kelime.
- Kısa cümle, cümleyi bölmek değildir: "Tek bir gün. Saflar bozuluyor." gibi parçalar yerine "Günün sonunda ordu dağılıyor ve sultan esir düşüyor."
- Akış korunur. Kullanıcı bölük pörçük dili reddetti, akıcı Peraşt paragrafını onayladı. Kısa cümleler bağlaçlarla bağlanır ve paragrafın içinde bir vuruş olur; paragraf bir liste gibi okunmaz.
- **Dönemeç kelimeleri:** "Ama", "Oysa", "Peki", "Çünkü", "İşte", "Ta ki". Aynı bağlaç art arda iki cümlede kullanılmaz. Cümleye "Ve" ile başlamak bölümde en çok iki kez.

### 3.3 İzleyiciyle ilişki
| Araç | Doz (90 sn'lik bölüm) | Kural |
|---|---|---|
| Soru | 2–4 | "Peki…?" sorusunun cevabı 1 saniye içinde gelir. Yalnız açık döngü sorusu ve son soru bekletilir. |
| Doğrudan hitap | 1–2 | Bir "Düşünün…" ya da "Bir an kendinizi … yerinde düşünün" sahnesi; bir de "…duymuşsunuzdur" ya da "değil mi?" türü bir ima. |
| "Biz" dili | 1–3 | "Biliyoruz", "elimizde", "bakalım", "gidelim". Kanal adına konuşan "biz" değil, izleyiciyle yan yana duran "biz". |
| Şaşkınlık onayı | en çok 1 | "Evet, yanlış duymadınız." Yalnız gerçekten şaşırtıcı bir rakamdan sonra. |

### 3.4 Sayılar
- Seslendirme metninde sayılar yazıyla yazılır: "bin üç yüz iki".
- Bölümde en çok 4–5 sayı. Her sayının bir tutamağı olur: bir ölçek benzetmesi, haritada bir alan ya da bir zaman çizgisi.
- Kaynaklar ayrışıyorsa aralık söylenir: "kimi kaynakta kırk, kimi kaynakta altmış bin". Ekranda da aralık yazılır, 🟡 rozeti konur.

### 3.5 Kelime seçimi
- **Sade, bugünün Türkçesi.** İlk geçişte kısa açıklama: "tekfur, yani Bizanslı kale komutanı", "uç, yani sınır bölgesi".
- **Tarafsız adlandırma:** "Osmanlı akıncıları", "Bizans askerleri", "Sırp ordusu". "Fethetti" yerine olayın kendisi: "teslim aldı", "kuşattı", "müzakereyle aldı".
- **Yasak:** kafir, gavur, küffar, mücahid, hain; "dostlarım", "arkadaşlar"; "merhaba", "bu videoda", abone ve beğeni çağrısı.
- **Gerekçesiz kullanılmaz:** şanlı, yüce, muhteşem, efsanevi, inanılmaz, barbar, vahşi; "altın harflerle", "tarihin en …", "dünyanın en …". Bir "ilk" ya da "en" iddiası ancak FACTS'te 🟢 ise söylenir.
- Gerçek kişilere uydurma söz yazılmaz. Alıntı yalnız belgeliyse ve künyesiyle yapılır.

### 3.6 Anlatım bozukluğu denetimi
Kullanıcı Fragman'ın ilk taslağını "çok kopuk ve anlatım bozukluğu var" diye geri çevirdi. O taslaktaki hataların her biri aşağıda bir kural oldu. Her metin, kullanıcıya gitmeden önce **yüksek sesle** okunur ve bu dokuz kuralla denetlenir. Dokuzuncu kural, kullanıcı Bölüm 3–5 taslaklarını "kopukluklar hâlâ mevcut" diye geri çevirince eklendi:

| # | Kural | Bozuk örnek (eski taslaklarımızdan) | Doğrusu |
|---|---|---|---|
| 1 | **Her cümlenin yüklemi var.** İsim öbeklerini sıralamak cümle kurmak değildir. İstisnalar: hemen önceki soruya verilen kısa cevap ("Peki elimizde ne var? Küçük bir sikke.") ve bölüm başında bir kez "Yıl bin üç yüz iki." kalıbı | "Balkanlar'dan Fırat'a uzanan topraklar, yenilmez sanılan bir ordu ve Yıldırım lakaplı bir sultan." · "Ankara, bin dört yüz iki." | "Sultanın toprakları Balkanlar'dan Fırat'a kadar uzanıyor ve ordusu yenilmez sanılıyor." |
| 2 | **Zaman geçişi çerçevelidir.** Şimdiki zamana bir sahne çerçevesiyle girilir ("Bin dört yüz iki yazında, Ankara yakınlarında…") ve sahne bitene kadar orada kalınır. Geçmişe bir zaman işaretiyle dönülür ("Oysa yüz yıl önce…"). | "…bir imparatorluk vardı." → "…saflar bozuluyor." (çerçevesiz geçmişten şimdiye) | "…iki ordu karşı karşıya geliyor. (…) Oysa bu devlet, yüz yıl önce küçük bir sınır beyliğiydi." |
| 3 | **Özne ve gönderim açıktır.** "Saflar" kimin, "bu devlet" hangisi, "buraya" neresi? Zamir ve işaret sıfatı bir önceki cümlede adı geçen şeye döner. Aynı şeyin adı değişmez (imparatorluk, devlet, beylik bilinçli seçilir). | "Peki bu devlet (…) buraya nasıl gelmişti?" (önceki cümlede "imparatorluk"; "buraya" belirsiz) | "Peki o küçük beylik, bir asırda nasıl bu kadar büyüdü?" |
| 4 | **"Ve" aynı türden öğeleri bağlar.** İsimle cümle, "ve" ile bağlanmaz. Ortak yüklem bütün öğelere uyar. | "Küçük bir sikke ve üzerinde (…) Ertuğrul oğlu Osman yazıyor." | "Küçük bir sikke. Üzerinde, okunabildiği kadarıyla, Ertuğrul oğlu Osman yazıyor." |
| 5 | **Kelimeler anlamca uyar.** | "Cevap, sandığınızdan çok daha az." (cevap az olmaz) · "hikâyenin başını yazmak" | "Bildiklerimiz sandığınızdan çok daha az." · "kuruluşunu yazıya geçirmek" |
| 6 | **Özne ile yüklemin arasına virgül girmez.** Seslendirmede duraklama gerekiyorsa cümle yeniden kurulur. | "Adı, Osman." · "Gelinin adı, Nilüfer." | "Başlarındaki beyin adı ise Osman." · "Gelinin adı Nilüfer'miş." |
| 7 | **Mantık sırası korunur.** Her soru önceki cümleden doğar. Birbirine bağlanmayan iki soru arka arkaya sorulmaz. Çöküşü gösterdikten hemen sonra "buraya nasıl geldi" diye sorulmaz; önce zirve ile başlangıç arasındaki fark kurulur. | "…nasıl gelmişti? Ve neden (…) kimse yazmamıştı?" | "Oysa bu devlet (…) küçük bir sınır beyliğiydi. Peki (…) nasıl bu kadar büyüdü? Cevabı bulmak sandığınızdan zor, çünkü…" |
| 8 | **İç tutarlılık ve tekrar.** Metin öbür bölümlerle çelişmez. Bir kelime ya da kök, anlam gerektirmediği hâlde aynı cümlede ya da art arda cümlelerde tekrarlanmaz ("küçük bir sikke … küçük bir sikkede", "ancak … ancak"). Konunun anahtar adı (düğün, rüya) gerektiğinde tekrar edebilir. Aynı ad üç cümle üst üste kullanılmaz. Aynı cümlede iki ayrı -de tümleci olmaz ("metinlerde … kroniklerde"). | "kimse yazmamıştı" (Bölüm 1'de Pakhymeres yazıyor) · "adı… adına" · "sığan… sığıyor" | "hiçbir Osmanlı yazmadı" · "imaret, bugün hâlâ İznik'te ayakta" |

| 9 | **Her paragraf bir öncekine bağlanır; bölüm olay listesi değil, neden-sonuç zinciridir.** Paragrafın ilk cümlesi öncekinin son öğesini devralır: aynı ad ya da gönderim ("Bu surlu şehirlerden biri…", "Kurtarılamayan İznik…"), neden-sonuç bağlacı ("Bunun üzerine", "Bu yüzden", "Böylece"), zaman köprüsü ("Tam bu sırada", "Ertesi yıl") ya da karşıtlık ("Ama", "Oysa"). Bir paragrafa sığmayan olay bölümden çıkarılır; olaylar art arda sıralanmaz. | "Bursa beyliğin yeni merkezi oldu." (gömülmeden sonra, bağsız) · "Şimdi Orhan'ın beyliğini bir yabancının gözünden görelim." · "Sıra Bursa'ya geliyordu." | "Bursa, Orhan'ın elinde beyliğin yeni merkezine dönüştü." · "Bu yıllarda Fas'tan gelen gezgin İbn Battûta da…" · "Bu surlu şehirlerden biri de Uludağ'ın eteğindeki Bursa'ydı." |

**Araç desteği:** `anlatim_analiz.py`, yüklemi olmayan cümle adaylarını (kural 1) ve öncekine bağlanmayan paragraf başlarını (kural 9) listeler. İki liste de kaba bir elemedir: çıkan her cümleye elle bakılır. Bilinçli bir isim cümlesi ("Bilecik'teki düğün baskını da öyle.") kalabilir, ama nedeni sunuşta yazılır. Öbür yedi kural elle denetlenir.

---

## 4. Hikâye önde, kaynak arkada
Rozetler ekranda durur ve güven verir. Ses ise hikâyeyi anlatır. İzleyici bir olayın efsane olduğunu duyduğundan anlamalı, ama anlatı kaynak tartışmasına dönmemeli.

| Rozet | Seste | Örnek | Yapma |
|---|---|---|---|
| 🟢 **BELGE** | Düz anlatılır; kaynak adı söylenmez | "Bin iki yüz kırk üç yılında Moğollar, Selçuklu ordusunu Kösedağ'da bozguna uğrattı." | "Bizanslı tarihçi Pakhymeres'e göre…" (kaynak kişi hikâyenin karakteri değilse) |
| 🟡 **TARTIŞMALI** | Yuvarlak ve doğru söylenir; tartışmalı ayrıntıya girilmez | "Bin üç yüzlerin başında, İzmit yakınlarında…" · "yaklaşık" | "Savaşın yılı bile tartışmalı. Gelenek … der, … savunanlar da var." |
| 🔴 **RİVAYET** | Tek bir işaretle hikâyenin içinde anlatılır: "anlatılana göre", "rivayete göre"; içeride -mış kipi. Sonra hikâye belgeli olaylarla devam eder | "Anlatılana göre Osman, Şeyh Edebali'nin evinde misafirken bir rüya görmüş…" | "Güzel bir hikâye. Ama onu yazanların hiçbiri Osman'ı görmemişti." · "Bizans kaynaklarında tek satır yok." |
| ⚪ **DOĞRULANACAK** | Seslendirmeye **girmez** | — | — |

**Kaynak ne zaman seste yer alır?** Yalnız üç durumda ve bölümde en çok bir kez, iki cümleyi geçmeden:
1. **Tartışmanın kendisi hikâyenin parçasıysa:** Kosova'da iki tarafın hafızası; Ankara'dan sonra Avrupa'da yayılan demir kafes hikâyesi.
2. **Kaynak kişi hikâyenin karakteriyse:** Kantakuzenos hem imparator hem tarihçi; ama anlatı onun yazdıklarını değil, yaptıklarını anlatır.
3. **Yaygın bir yanlış, hikâyeyi değiştiriyorsa:** İzleyicinin bildiği hikâye yanlışsa ve doğrusu daha ilginçse (T6).

Kaynak ayrıntısının yeri: `FACTS.md` (tam künye), ekrandaki rozetin `src` satırı ve paylaşım açıklamasındaki kısa "Kaynaklar" satırı.

## 5. Teknik kataloğu
Storyboard'da her satırın "Teknik" sütununa kod yazılır (ör. `T4`). Bir bölümde 6–9 farklı teknik yeterli. Hepsini bir bölüme koymak, şablon gibi durmanın en kısa yoludur.

| Kod | Teknik | Kalıp | Doz | Kurgu karşılığı | Kaynak |
|---|---|---|---|---|---|
| T1 | **Tarih ve yer levhası** | "Yıl bin üç yüz iki. İzmit yakınları." | açılış ya da perde başı | yıl sayacı ve iğne aynı karede | Anime Tarih, Harp Tarihi, Bebar |
| T2 | **Adı geciktirme** | "İki imparatorluğun arasında, adı bile bilinmeyen bir topluluk yaşıyordu." → ad 3–5 sn sonra | bölümde 1 | önce siluet, ad kartı adla birlikte çakılır | Holosen, Bebar |
| T3 | **Açık döngü** | büyük soru %10–25'te açılır, %60–80'de ödenir | 1 büyük (+1 küçük) | soru ekranda bir nesneyle işaretlenir; ödemede aynı nesne döner | Bebar, Anime Tarih |
| T4 | **Peki–cevap** | "Peki elimizde ne var? Küçük bir sikke." (sorunun cevabı yüklemsiz olabilir; §3.6) | 2–3 | soruda kamera durur, cevapta kesme ya da vuruş | Yusuf Kayaalp, Bebar |
| T5 | **Sizi sahneye koyma** | "Bir an kendinizi Söğüt'te düşünün…" | en çok 1 | yakın plan, öznel kamera, ortam sesi | Bebar, Random Animasyon |
| T6 | **Ama bir saniye** | yaygın bilinen hikâye → dur → doğrusu, hikâyeyi değiştiren bir olguyla | sezonda 1–2 (§4) | görüntü donar ya da geri sarar (`rewindFX`), müzik bir an kesilir | Bebar, Holosen |
| T7 | **İki anlatım** | "Bir yanda …, öbür yanda …" | yalnız tartışma hikâyenin parçasıysa (Kosova) | bölünmüş ekran ya da iki kart | Harp Tarihi, Anime Tarih |
| T8 | **Ölçek ve bugüne köprü** | "Bu, bugün birinin Birinci Dünya Savaşı'nı ilk kez yazması gibi." · "Bugün hâlâ İznik'te…" | 1 | haritada iki alan yan yana; bugünkü şehir adı | Bebar, Holosen, Harp Tarihi |
| T9 | **Kesik üçleme** | "Saflar bozuluyor, ordu dağılıyor ve sultan esir düşüyor." (her biri yüklemli; sahne çerçevesi içinde) | yalnız doruğa, 1 | her fiile bir vuruş (`hits`) | Bebar |
| T10 | **Domino zinciri** | olayın sonuçları 3–4 kısa cümle | 0–1 | haritada sırayla yanan alanlar | Yusuf Kayaalp |
| T11 | **Refren** | "Bilecik… Yarhisar… İnegöl…" | 0–1 | her ada bir iğne | Yusuf Kayaalp |
| T12 | **Yan yana ironi** | beklenti cümlesi + onu bozan olgu, yorum yok | 0–1 | aynı kadrajda iki zaman ya da iki harita | Anime Tarih |
| T13 | **"Ta ki…"** | uzun bir sessizlik dönemini kesen tek cümle | 0–1 | müzik ve renk değişir | Anime Tarih |
| T14 | **"-ecekti" önsezisi** | "Ama ilk büyük şehri almak, yıllar sürecekti." | 1–2 | zaman çizgisinde ileri bakış | Harp Tarihi, Bebar |
| T15 | **Harita sessizliği** | anlatıcı 1,5–3 sn susar, harita konuşur | 1–3 (sürenin %5–10'u) | `paras[i].pause`, vuruş, sınır ya da ok hareketi | Anime Tarih, Harp Tarihi |
| T16 | **Belgelenmiş nükte** | kroniklerdeki esprili bir söz, künyesiyle | 0–1 | alıntı kartı ve künye | Holosen |
| T17 | **Şaşkınlık onayı** | "Evet, yanlış duymadınız." | en çok 1 | sayı kartı ikinci kez vurulur | Holosen |
| T18 | **Taşınan imge** | sezon boyunca tek motif (§9: rüyadaki ağaç) | her bölümde 1 an | `miniTree`: dallar haritaya yayılır | Bebar |
| T19 | **"X dediler ona"** | "Ona Yıldırım dediler." | sezonda 1–2 | unvan kartı çakılır | Bebar |
| T20 | **Kaynak adıyla anlatım** | "Kantakuzenos'un kendi anlattığına göre…" | yalnız §4'teki üç durumda, en çok 1 | künye satırı, rozet `src` | Holosen, Harp Tarihi, Anime Tarih |

---

## 6. Kancalar ve kapanışlar

### Kancalar (ilk 3 saniye)
İlk kelime ilk karede gelir: müzikli giriş, seri tanıtımı, "merhaba" yok. İlk cümle ≤ 8 kelime.

| Kod | Kalıp | Örnek (Sezon 1) |
|---|---|---|
| K1 | **Tarih + yer + tehlike** | "Yıl bin üç yüz iki. Bir Bizans ordusu yürüyor." |
| K2 | **Çelişki** | "Altı yüz yıl sürecek bir imparatorluk, Söğüt'te küçük bir sınır beyliği olarak doğdu." |
| K3 | **Bildiğinizi sanıyorsunuz** | "Osman Bey'in ünlü rüyasını duymuşsunuzdur. Peki o rüyadan sonra neler oldu?" |
| K4 | **Sahnenin ortası** | "Bin dört yüz iki yazında, Ankara yakınlarında iki ordu karşı karşıya geliyor." |
| K5 | **Olmasaydı** (karşı olgu, "-ebilirdi") | "O gece deprem olmasaydı, hikâye Asya'da kalabilirdi." (🟡: kaynakla desteklenmeli) |
| K6 | **Adı geciktiren betimleme** | "İki imparatorluğun arasında, adı bile bilinmeyen bir topluluk yaşıyordu." → ad 3–5 sn sonra |

### Kapanışlar (son 5–8 saniye)
Son cümle ≤ 12 kelime. Abone, beğeni ve "sıradaki bölümde görüşmek üzere" yok. Sıradaki bölüme köprü sözle kurulur, kartla tamamlanır.

| Kod | Kalıp | Örnek |
|---|---|---|
| S1 | **"-ecekti" askısı** | "Ve o şehir, kılıçla değil, müzakereyle alınacaktı." |
| S2 | **Simetrik ironi** | "Osman bir şehir alamadan öldü. Oğlu ise bir şehri kılıç çekmeden aldı." |
| S3 | **Kancalı soru** (sıradaki bölüm cevaplar) | "Peki o yüz yıllık boşluğu ne doldurdu?" |
| S4 | **Fener ödemesi** (başta anılan ayrıntı sonda döner) | başta görünen sikke, sonda "tek kanıt" olarak geri gelir |
| S5 | **Bugüne köprü** | "Bugün hâlâ İznik'te, onun adını taşıyan bir yapı ayakta." |

**Reels döngüsü (isteğe bağlı):** Instagram videoyu başa sarar. Son cümle ilk cümleye bağlanırsa izleyici ikinci turda cümleyi tamamlar. Fragman buna uygun: "…kimse yazmamıştı?" → "Bir sabah, bir imparatorluk vardı."

---

## 7. Yapı şablonları
Hız 2,0 kel/sn (Emrullah Uzun). Süreye harita sessizlikleri ve kartlar eklenir.

| Biçim | Kelime | Konuşma | Sessizlik | Toplam | Ne zaman |
|---|---|---|---|---|---|
| **90 sn** (varsayılan) | 150–170 | 75–85 sn | 3–6 sn (1–2 ara) | ~85–95 sn | tek olay, tek doruk |
| **2 dk** | 210–230 | 105–115 sn | 6–9 sn (2–3 ara) | ~120 sn | muharebe, iki taraflı tartışma (B3, B8, B10) |
| **3 dk** | 320–340 | 160–170 sn | 9–12 sn (3–4 ara) | ~180 sn | sezon finali, özel bölüm |

**Yeniden kanca kuralı:** Her 15–25 saniyede bir dönemeç olur: bir soru, "Ama…", "Oysa…", "Ta ki…" ya da yeni bir görüntü ölçeği (haritadan yakın plana, gece sahnesinden zaman çizgisine). Instagram'da izleyici bir sonraki dönemece kadar kalır.

### 90 sn iskeleti
| Zaman | Bölüm | Ne olur | Teknikler |
|---|---|---|---|
| 0–3 sn | Kanca | K1–K6; ilk cümle ≤ 8 kelime | T1, T2 |
| 3–12 sn | Vaat ve açık döngü | Bölümün büyük sorusu açılır | T3 |
| 12–40 sn | Bağlam ve tırmanış | "Oysa/Ama" dönemeçleri, bir Peki–cevap, bir ölçek | T4, T8, T14 |
| 40–50 sn | Kırılma | "Düşünün…" sahnesi ya da "Ama bir saniye" | T5 veya T6, T7 |
| 50–70 sn | **Doruk (kahraman an)** | sahne çerçevesi içinde şimdiki zaman, kısa ve tam cümleler, kesik üçleme; ardından 1,5–3 sn harita sessizliği | T9, T15 |
| 70–82 sn | Döngünün ödemesi | Büyük soru hikâyenin içinde cevaplanır; sonucu ve anlamı söylenir | T8, T14 |
| son 5–8 sn | Kapanış | S1–S5; sonraki bölüm kartı | T14 |

### 2 dk iskeleti
90 sn iskeleti iki perdeye bölünür. 1. perde (0–55 sn) kendi küçük dorukla biter. ~55. saniyede "Ta ki…" ya da "Ama asıl soru başka." ile ikinci perde açılır. Büyük döngü 2. perdenin dorukundan sonra ödenir. 2–3 harita sessizliği; bir T7 (iki anlatım) bu biçime çok uygun.

### 3 dk iskeleti
Üç perde: **kurulum → çatışma → sonuç**. Her perde kendi mini kancasıyla açılır (T1 levhası ya da soru). Her 30–40 saniyede bir yeniden kanca zorunlu. Perdeler arasında 2–3 sn'lik müzikli nefes (T15). Ara özet yapılmaz; harita özeti gösterir.

---

## 8. Anlatım ve kurgu
Anlatıcı dili kurgunun temposunu belirler. Storyboard'da her satırın **Teknik** ve **Sessizlik** sütunu doldurulur (`.claude/skills/tarih-reels-senaryo/references/storyboard-sablonu.md`).

| Anlatımda | Kurguda |
|---|---|
| Yeni bilgi | Yeni görüntü vuruşu (1,5–3,5 sn) |
| Dönemeç kelimesi ("Ama", "Oysa", "Ta ki") | Geçiş, ölçek değişimi ya da renk değişimi; müzik cümlesi değişir |
| Soru (T4) | Kamera durur; cevap kelimesinde kesme ya da vuruş |
| "Ama bir saniye" (T6) | Görüntü donar ya da geri sarar, müzik bir an düşer |
| "Düşünün…" (T5) | Yakın plan, öznel kamera, ortam sesi öne çıkar |
| Kesik üçleme (T9) | Her fiile bir vuruş, sarsıntı küçükten büyüğe |
| Harita sessizliği (T15) | `paras[i].pause: 1.5–3` (paragraftan sonra ek boşluk); müzik kısılmadan öne gelir; haritada sınır, ok ya da çöküş |
| Kaynak adı (T20) | Küçük künye satırı ve rozet `src` aynı anda |
| Sayı | Sayı kartı ya da harita ölçeği; sayı ekranda yazıyla değil rakamla |

**Ekran yazısı ve altyazı:** Altyazı cümleyi taşır. Ekran yazısı yalnız tarih, yer, ad, unvan ve künye taşır, 3–4 kelimeyi aşmaz. Altyazı vurguları (`hl`) her paragrafta 2–4 kelime: ad, sayı, dönemeç.

**Seslendirme:** Harita sessizlikleri ElevenLabs metnine değil `timeline.js`'e yazılır (`pause`). Böylece kayıt yeniden alınmadan ayarlanır. ElevenLabs metninde paragraf arası `[long pause]` kalır (paragraf bölme noktası).

---

## 9. Sezonun hikâye ipliği
Sezon 1, Kösedağ'dan Ankara'ya **tek bir hikâyedir**. Her bölüm bir sonrakinin başladığı yerde biter; izleyici bölümleri sırayla izlediğinde kesintisiz bir anlatı duyar. Taşınan imge **rüyadaki ağaç** (sezon logosu): beylik büyüdükçe dalları haritaya yayılır, Ankara'da kurur, sezon sonunda tek bir filiz kalır.

| Bölüm | Hikâyedeki yeri | Bitiş köprüsü |
|---|---|---|
| Fragman | Ankara 1402: zirvede bir günde çöküş; "o küçük beylik nasıl bu kadar büyüdü?" | Sezonun başına |
| B1 | Anadolu dağılıyor; uçlar doluyor; Söğüt'te Ertuğrul ve Osman | Osman'ın yükselişine |
| B2 | Osman'ın yükselişi: Edebali, rüya, ilk kaleler, Nilüfer | Bizans'ın ordu göndermesine |
| B3 | Bafeus: Bizans ilk kez Osman'a karşı | Bursa kuşatmasına |
| B4 | Bursa, İznik, İzmit: beylik devlete dönüşüyor | Bizans iç savaşına |
| B5 | Kantakuzenos ile Orhan'ın ittifakı; Avrupa'ya geçiş | Gelibolu depremine |
| B6 | Gelibolu: Rumeli'de kalış | Edirne'ye |
| B7 | Edirne ve Balkanlar'a yayılış | Kosova'ya |
| B8 | Kosova: iki hükümdarın ölümü | Yıldırım'a |
| B9 | Niğbolu, İstanbul ablukası, beyliklerin alınması | Timur'a |
| B10 | Ankara: bir günde çöküş | Sezon 2'ye |

Kaynak ve belge konusu (seri ipliği "E. Bilgi ve kaynak", `TUM-OLAY-ORGUSU.md`) anlatıya taşınmaz. Paylaşım açıklamasında her bölümün kısa bir "Kaynaklar" satırı olur.

---

## 10. Önce ve sonra
Bölümlerimizden örnekler. Olgular aynı kalır, değişen dildir. Tam yeniden yazımlar ayrı ayrı onaya sunulur.

**1. Kanca (Bölüm 1)**
- Önce: "Altı yüz yılı aşkın süre ayakta kalan bir imparatorluğun nasıl kurulduğunu, aslında kimse yazmadı." (14 kelime; bilgi doğru ama vuruş yok)
- Sonra: "Osmanlı İmparatorluğu altı yüz yıldan fazla ayakta kaldı. Ama kuruluşunu, o günlerde hiçbir Osmanlı yazmadı." (K2; iki tam cümle, iki vuruş. "Hiçbir Osmanlı" ifadesi, Pakhymeres'in yazdığı kapanışla çelişmez.)

**2. Anlatı zamanı (Bölüm 1)**
- Önce: "Moğollar Selçuklu ordusunu yener ve Anadolu Selçuklu Devleti vergi ödeyen bir tabi devlete dönüşür."
- Sonra: "Bin iki yüz kırk üç yılında, Sivas ile Erzincan arasındaki Kösedağ'da Moğollar Selçuklu ordusunu bozguna uğrattı. Anadolu'nun hâkimi Selçuklular artık Moğollara vergi ödüyordu." (taban kip -dı + arka plan -yordu)

**3. Yazı dili → sahne (Bölüm 1)**
- Önce: "Bunlardan biri, Bizans sınırında, Söğüt çevresindeki küçük bir topluluktur. Liderinin adı Osman'dır."
- Sonra: "Bir an kendinizi o yılların Söğüt'ünde düşünün. Doğunuzda Moğollara bağlı Selçuklular, batınızda Bizans'ın kaleleri var. Aradaki küçük topluluğun başındaki beyin adı ise Osman." (T5 + T2; "-dır" yok, her cümle yüklemli)

**4. Rivayet çerçevesi ve "Ama bir saniye" (Bölüm 2)**
- Önce: "Osman Bey'in rüyasını belki duymuşsunuzdur. Şeyh Edebali'nin göğsünden bir ay doğar ve Osman'ın göğsüne girer."
- Sonra: "Osman Bey'in ünlü rüyasını duymuşsunuzdur. Peki onu ilk kim yazdı? Efsaneye göre Osman bir gece rüyasında, Şeyh Edebali'nin göğsünden bir ay doğduğunu ve gelip kendi göğsüne girdiğini görmüş. (…) Kulağa güzel geliyor. Ama durun bir saniye: onu yazanların hiçbiri Osman'ı görmemişti." (🔴 çerçeve açık, içerisi -mış; T6 ile 🟢'ye dönüş. FACTS'teki "p2'de rivayete göre yok" sorunu da çözülür.)

**5. Fragman: kopukluktan akışa** (kullanıcının geri çevirdiği taslak → yeniden yazım; ayrıntı §3.6)
- Önce: "Bir sabah, bir imparatorluk vardı. Balkanlar'dan Fırat'a uzanan topraklar, yenilmez sanılan bir ordu ve Yıldırım lakaplı bir sultan. Ankara, bin dört yüz iki. Tek bir gün içinde saflar bozuluyor…" (yüklemsiz iki cümle, çerçevesiz zaman geçişi, belirsiz özne)
- Sonra: "Bin dört yüz iki yazında, Ankara yakınlarında iki ordu karşı karşıya geliyor. Bir yanda Timur, öbür yanda Osmanlı sultanı Yıldırım Bayezid var. Sultanın toprakları Balkanlar'dan Fırat'a kadar uzanıyor ve ordusu yenilmez sanılıyor. Ama savaşın ortasında, Osmanlı saflarındaki bazı birlikler taraf değiştiriyor. Günün sonunda ordu dağılıyor ve sultan esir düşüyor." + `pause: 2` (K4 sahne çerçevesi, şimdiki zaman sahne boyunca, T15)

**6. Kapanış ve köprü (Bölüm 2 → Bölüm 3)**
- Önce: "Peki o hâlde, belgelere geçen ilk an neydi?"
- Sonra: "Peki efsanelerden çok önce, Osman'ı anlatan ilk metni kim yazdı? Bir Bizans tarihçisi, hem de bir savaşı anlatırken." (S3; soru-cevap; §9'daki köprü zinciri)

**7. Bugüne köprü (Bölüm 2, öneri)**
- "Bilecik'teki o düğünden tek bir belge yok. Ama oğlunun Nilüfer Hatun için yaptırdığı imaret, bugün hâlâ İznik'te ayakta." (T8/S5; kaynak: TDV "Nilüfer Hatun İmareti", FACTS #12)

---

## 11. Anlatım puan kartı
Her metin kullanıcıya sunulmadan önce puanlanır. Her madde 0 (yok), 1 (var ama zayıf), 2 (güçlü).

| # | Madde | 2 puan için |
|---|---|---|
| 1 | **Kanca** | İlk cümle ≤ 8 kelime; tarih, yer, çelişki ya da sahne; ilk 3 sn'de gerilim var |
| 2 | **Açık döngü** | Büyük soru %10–25'te açılıyor, %60–80'de ödeniyor (ya da sonraki bölüme taşındığı açık) |
| 3 | **Yeniden kancalar** | Her 15–25 sn'de bir dönemeç; 25 sn'den uzun düz anlatım yok |
| 4 | **İzleyiciyle ilişki** | 2–4 soru (cevaplar hemen), 1–2 hitap, "biz" dili var; "sen" ve "dostlarım" yok |
| 5 | **Somut sahne** | En az bir duyusal sahne (ses, ışık, mekân, kişi); bilgi önce görüntüyle geliyor |
| 6 | **Doruk** | %55–75'te tek kahraman an; şimdiki zaman; kısa cümleler; ardından harita sessizliği |
| 7 | **Doğruluk, sessizce** | Her 🔴 tek bir işaretle ayrılmış, 🟡 yuvarlak ve doğru söylenmiş (§4); anlatı kaynak tartışmasına kaymıyor; ⚪ yok |
| 8 | **Anlam tutamağı** | En az bir ölçek, bugüne köprü ya da "bu neden önemli" cümlesi |
| 9 | **Ritim ve dil** | §12 ölçüleri hedefte; §3.6 denetimi temiz (yüklemsiz cümle, çerçevesiz zaman geçişi, belirsiz gönderim ve bağsız paragraf yok); "-dır" yazı dili yok |
| 10 | **Kapanış** | Son cümle ≤ 12 kelime; S1–S5'ten biri; sıradaki bölüme bağlı |

**Geçme:** 20 üzerinden ≥ 16 ve hiçbir maddede 0 yok.
**Kırmızı çizgiler** (biri bile varsa metin sunulmaz): anlatım bozukluğu (§3.6); ⚪ iddia seste; efsane olgu gibi anlatılmış; gerçek kişiye uydurma söz; §3.5'teki yasak kelimeler; taraf tutan sıfat; anlatının içinde sponsor ya da abone çağrısı.

Kullanıcıya sunarken puanı ve en zayıf iki maddeyi tek satırda göster: `Puan 17/20 · zayıf: 3 (yeniden kanca), 8 (ölçek)`.

---

## 12. Ölçüm hedefleri
```bash
python3 shared/tools/anlatim_analiz.py <bölüm>/timeline.js          # timeline.js için hedef kontrolü kendiliğinden çalışır
python3 shared/tools/anlatim_analiz.py taslak.txt --hedef          # düz metin taslağı için
```
| Ölçü | Hedef | Eski B1 | Eski B2 | Neden |
|---|---|---|---|---|
| Ortalama cümle | 7,5–11,5 kelime | 8,8 ✓ | 8,0 ✓ | Bebar tarih 10,1; Random Animasyon 7,2 |
| ≤ 5 kelimelik cümle | %10–35 | 15 ✓ | 43 ✗ | vuruş var ama liste gibi değil; Bebar tarih %26, Anime Tarih %10 |
| En uzun cümle | ≤ 20 kelime | 14 ✓ | 16 ✓ | Harp Tarihi'nde %14 uzun cümle; bizde yok |
| İlk cümle | ≤ 8 kelime | 14 ✗ | 5 ✓ | kanca |
| Son cümle | ≤ 12 kelime | 8 ✓ | 8 ✓ | kapanış |
| Soru /100 kelime | 1,0–3,5 | 1,7 ✓ | 0,9 ✗ | Random Animasyon anlatıcısı 1,4 |
| Hitap /100 | 0,5–2,0 | 0 ✗ | 0,9 ✓ | Bebar tarih 0,3; Random Animasyon 1,5 |
| "Biz" /100 | 0,3–2,5 | 0,9 ✓ | 0,9 ✓ | Bebar tarih 1,2; bizde yalnız kalıp ifadelerde ("elimizdeki", "karşımıza") |
| Geniş zaman | ≤ %15 | 31 ✗ | 50 ✗ | Bebar tarih %6 |
| "-dır/-tır" | ≤ %10 | 31 ✗ | 14 ✗ | yazı dili |
| Şimdiki zaman | %5–30 | 0 ✗ | 0 ✗ | doruk |
| "-ecekti" | %3–20 | 8 ✓ | 7 ✓ | Bebar tarih %9 |
| Merak kalıpları /100 | ≥ 2 | 3,5 ✓ | 1,8 ✗ | |
| Sayı /100 | ≤ 4 | 2,6 ✓ | 0,9 ✓ | Anime Tarih 3,4 (fazla) |
| Kaynak tartışması kelimeleri (adet: kronik, belge, kayıt, kaynak, tarihçi) | ≤ 2 | 2 ✓ | 4 ✗ | §4: hikâye önde, kaynak arkada |
| Yasak, klişe | yok | ✓ | ✓ | §3.5 |
| Yüklemsiz cümle adayı | 0 (elle bak) | 0 ✓ | 2 ✗ | §3.6; eski Fragman'da da 2 |

Ölçümler kaba düzenli ifadelerle yapılır, karar puan kartınındır. Bir ölçü hedef dışındaysa ve bunun iyi bir nedeni varsa (ör. Fragman 56 kelime olduğu için şimdiki zaman yok), nedeni sunuşta tek cümleyle yazılır.

---

## 13. Kararlar
- **21 Ekim 2026 · Hikâye önde, kaynak arkada.** Kullanıcı: "Bunun kaydı yok, bunu şu kayıt etti gibi gereksiz yere odaklanıyoruz; mevzu doğru bilgileri harmanlayıp bütün Osmanlı tarihini bir hikâye olarak sunabilmek." Sezon teması "Bildiklerimiz ve sandıklarımız" bırakıldı; §0, §2, §4, §9 ve puan kartının 7. maddesi buna göre değişti.
- **21 Ekim 2026 · Anlatım bozukluğu kırmızı çizgi.** Fragman taslağı kopuk bulundu; §3.6 eklendi.
- **21 Ekim 2026 · Paragraf köprüsü.** Bölüm 3–5 taslakları olay listesi gibi bulundu ("kopukluklar hâlâ mevcut"); §3.6 kural 9 ve araçta bağsız paragraf taraması eklendi.

## 14. Açık kararlar (kullanıcıya)
1. **Varsayılan süre:** 90 sn (öneri); muharebe ve iki taraflı bölümler 2 dk; sezon finali 3 dk.
2. **Hız:** ElevenLabs Speed 1.0 korunur (öneri: belgesel kanallarının hızı zaten bu). İstenirse Bölüm 2'nin bir paragrafı 1.1 ile de kaydedilip kulakla karşılaştırılır.
3. **Sezon ipliği ve köprü zinciri** (§9): "Bunu kim yazdı?" motifi ve B1 → B2 → B3 kapanışları.
4. **İmza kapanış:** Her bölümün aynı sözle bitmesi güven ve süreklilik kurar (Bebar'ın vedası gibi), ama 90 sn'de 2–3 saniye harcar. Öneri: sözlü imza yok; imza, seri kartı ve müzikteki leitmotif.
