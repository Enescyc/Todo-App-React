# Anlatıcı dili: Osmanlı serisi

**Sürüm 1 · 21 Ekim 2026.** Dayanak: 6 Türkçe kanalın 46 videosunun transkript analizi (`strateji/anlatim/*.md`), kanal karşılaştırması (`strateji/ANLATIM-ANALIZI.md`) ve ölçüm aracı (`shared/tools/anlatim_analiz.py`).
**Kim kullanır:** Her yeni metin bu rehberle yazılır, §11'deki puan kartıyla ve §12'deki ölçüm hedefleriyle kontrol edilir. Skill: `tarih-reels-senaryo`.
**Amaç:** Bir şeyi 40–50 saniyeye sıkıştırmak değil; eğlenceli, dikkat çekici ve güvenilir bir anlatım. Süre gerekirse uzar (§7). Ama her saniye bir şey kazandırmalı.

---

## 0. Tek cümlede anlatıcı
> Haritanın başında oturan, kaynakları elinde tutan, sizi sahneye çağıran ve "bunu biliyoruz, bunu bilmiyoruz" demekten çekinmeyen sıcak bir anlatıcı.

Sezonun teması zaten bu: **"Bildiklerimiz ve sandıklarımız"** (`sezon-1-kurulus/OLAY-ORGUSU.md`). Anlatıcı bu temanın sesi. Belirsizlik bizde zayıflık değil, merakın motoru.

## 1. Kanallardan ne aldık
| Kanal | En güçlü yanı | Bizim aldığımız | Almadığımız |
|---|---|---|---|
| **Holosen** | Shorts iskeleti: "öyle bir … ki" açık döngüsü → "Oysa/Ama" tırmanışı → doruk → tek cümlelik duygu | İskelet (§7), "Efsane şöyle:" çerçevesi (🔴), kaynak adıyla anlatım, "Evet, yanlış duymadınız." | 3 dakikalık giriş, doğrulanmamış alıntı, tek yönlü kimlik iddiaları |
| **Yusuf Kayaalp** | Kendi sorup kendi cevaplama; ironik ileri atlamayla kapanış; domino zinciri ve refren | "Peki…? Cevap." (T4), simetrik kapanış (S2), domino (T10), refren (T11), "-ebilirdi"/"gerçek tarihte" kip disiplini | Argo, uydurma kaynak şakası, oyun jargonu, 190 kel/dk |
| **Bebar Bilim** | "Ama bir saniye" ile efsane düzeltme; "siz o kaptansınız" sahnesi; ölçek benzetmesi; kesik üçleme | T5, T6, T8, T9, "X dediler ona" (T19), taşınan imge (T18), "-ecekti" önsezisi | Uzun felsefi giriş, argo, kişilere psikolojik teşhis |
| **Anime Tarih** | Haritaya susmak (sürenin %10'u sessiz); "Tarih…, yer…" levhası; iki seçenekli ihtilaf dili | Harita sessizliği (T15), levha (T1), "kimilerine göre…" (T7), yan yana ironi (T12), "Ta ki…" (T13) | Kancasız açılış, envanter dili, tören sıfatları |
| **Random Animasyon** | İzleyiciyi karar anına oturtmak; kısa cümle (ort. 7 kelime) | "Düşünün…" sahnesi (siz diliyle), kancada anılıp sonda ödenen ayrıntı, kısa ama tam kanca ve doruk cümleleri | "Sen" dili, gerçek kişilere uydurma diyalog, efsaneyi olgu gibi oynamak |
| **Harp Tarihi** | "Yıl 1302." açılışı; "-acaktı" askısı; rivayet karşılaştırması; doruktan sonra müzikli nefes | Hızın teyidi (2,0 kel/sn), tarih damgalı ilk cümle, "İki anlatım var" (🟡), sayı aralığı | Abone çağrısıyla açılış, dinî-taraflı ve eski dil, 20+ kelimelik cümleler |

**Ölçülerin özeti** (ayrıntı: `strateji/ANLATIM-ANALIZI.md`):
- Belgesel tarih kanallarının (Bebar tarih, Anime Tarih, Harp Tarihi) net hızı **≈2,0 kel/sn**: Emrullah Uzun'la aynı. Hızlı kanallar (Holosen Shorts, Yusuf Kayaalp, Random Animasyon) 2,5–2,8 kel/sn konuşuyor; son ikisinde bu hızı mizah ve skeç taşıyor.
- Bizim farkımız hızda değil, **izleyiciyle ilişkide**. Hitap neredeyse sıfırdı, "biz" dili yalnız kalıp ifadelerdeydi, soru azdı, anlatı yazı dilinin geniş zamanındaydı (%62) ve hiç susmuyorduk.

---

## 2. Anlatıcının kimliği
1. **Merak ortağı.** Soru sorar, cevabı bekletmez. Tek bir büyük soruyu ise bilerek sona saklar.
2. **Dürüst tanık.** Kesin olanı, tartışmalı olanı ve efsaneyi sesiyle ayırır. Kaynağın adını söyler. "Bilmiyoruz" demekten çekinmez.
3. **Sahne kurucu.** Bilgiyi önce bir görüntüyle verir: bir ses, bir ışık, bir yer. Sonra anlamını söyler.
4. **Ölçülü.** Kişilere sıfat takmaz ("hain", "büyük", "talihsiz"). Fiiller ve sonuçlar konuşur. Dram, yorumdan değil, olguları yan yana koymaktan doğar.
5. **Sıcak ama ciddi.** İzleyiciye "siz" der. Yer yer "biz"le yanına alır ("bakalım", "biliyoruz"). "Dostlarım", "arkadaşlar" ve "sen" dili yok.
6. **Mizahı belgeden.** Anlatıcı şaka yapmaz. Gülümseten şey, kroniklerdeki nükteli bir söz (künyesiyle) ya da durumun kendi ironisidir.

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
| Önsezi ve kapanış | **-ecekti** | "Bu küçük sikke, yüzyıllar sonra tek kanıt olacaktı." |
| Kaynakların bugünkü durumu, genel doğru | geniş zaman (az) | "Bizans kaynakları bu düğünden hiç söz etmez." |
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
Kullanıcı Fragman'ın ilk taslağını "çok kopuk ve anlatım bozukluğu var" diye geri çevirdi. O taslaktaki hataların her biri aşağıda bir kural oldu. Her metin, kullanıcıya gitmeden önce **yüksek sesle** okunur ve her cümle bu sekiz soruyla denetlenir:

| # | Kural | Bozuk örnek (eski taslaklarımızdan) | Doğrusu |
|---|---|---|---|
| 1 | **Her cümlenin yüklemi var.** İsim öbeklerini sıralamak cümle kurmak değildir. İstisnalar: hemen önceki soruya verilen kısa cevap ("Peki elimizde ne var? Küçük bir sikke.") ve bölüm başında bir kez "Yıl bin üç yüz iki." kalıbı | "Balkanlar'dan Fırat'a uzanan topraklar, yenilmez sanılan bir ordu ve Yıldırım lakaplı bir sultan." · "Ankara, bin dört yüz iki." | "Sultanın toprakları Balkanlar'dan Fırat'a kadar uzanıyor ve ordusu yenilmez sanılıyor." |
| 2 | **Zaman geçişi çerçevelidir.** Şimdiki zamana bir sahne çerçevesiyle girilir ("Bin dört yüz iki yazında, Ankara yakınlarında…") ve sahne bitene kadar orada kalınır. Geçmişe bir zaman işaretiyle dönülür ("Oysa yüz yıl önce…"). | "…bir imparatorluk vardı." → "…saflar bozuluyor." (çerçevesiz geçmişten şimdiye) | "…iki ordu karşı karşıya geliyor. (…) Oysa bu devlet, yüz yıl önce küçük bir sınır beyliğiydi." |
| 3 | **Özne ve gönderim açıktır.** "Saflar" kimin, "bu devlet" hangisi, "buraya" neresi? Zamir ve işaret sıfatı bir önceki cümlede adı geçen şeye döner. Aynı şeyin adı değişmez (imparatorluk, devlet, beylik bilinçli seçilir). | "Peki bu devlet (…) buraya nasıl gelmişti?" (önceki cümlede "imparatorluk"; "buraya" belirsiz) | "Peki o küçük beylik, bir asırda nasıl bu kadar büyüdü?" |
| 4 | **"Ve" aynı türden öğeleri bağlar.** İsimle cümle, "ve" ile bağlanmaz. Ortak yüklem bütün öğelere uyar. | "Küçük bir sikke ve üzerinde (…) Ertuğrul oğlu Osman yazıyor." | "Küçük bir sikke. Üzerinde, okunabildiği kadarıyla, Ertuğrul oğlu Osman yazıyor." |
| 5 | **Kelimeler anlamca uyar.** | "Cevap, sandığınızdan çok daha az." (cevap az olmaz) · "hikâyenin başını yazmak" | "Bildiklerimiz, sandığınızdan çok daha az." · "kuruluşunu yazıya geçirmek" |
| 6 | **Özne ile yüklemin arasına virgül girmez.** Seslendirmede duraklama gerekiyorsa cümle yeniden kurulur. | "Adı, Osman." · "Gelinin adı, Nilüfer." | "Başlarındaki beyin adı ise Osman." · "Gelinin adı Nilüfer'miş." |
| 7 | **Mantık sırası korunur.** Her soru önceki cümleden doğar. Birbirine bağlanmayan iki soru arka arkaya sorulmaz. Çöküşü gösterdikten hemen sonra "buraya nasıl geldi" diye sorulmaz; önce zirve ile başlangıç arasındaki fark kurulur. | "…nasıl gelmişti? Ve neden (…) kimse yazmamıştı?" | "Oysa bu devlet (…) küçük bir sınır beyliğiydi. Peki (…) nasıl bu kadar büyüdü? Cevabı bulmak sandığınızdan zor, çünkü…" |
| 8 | **İç tutarlılık ve tekrar.** Metin öbür bölümlerle çelişmez. Bir kelime ya da kök, anlam gerektirmediği hâlde aynı cümlede ya da art arda cümlelerde tekrarlanmaz ("küçük bir sikke … küçük bir sikkede", "ancak … ancak"). Konunun anahtar adı (düğün, rüya) gerektiğinde tekrar edebilir. Aynı ad üç cümle üst üste kullanılmaz. Aynı cümlede iki ayrı -de tümleci olmaz ("metinlerde … kroniklerde"). | "kimse yazmamıştı" (Bölüm 1'de Pakhymeres yazıyor) · "adı… adına" · "sığan… sığıyor" | "hiçbir Osmanlı yazmadı" · "imaret, bugün hâlâ İznik'te ayakta" |

**Araç desteği:** `anlatim_analiz.py`, yüklemi olmayan cümle adaylarını listeler (kural 1). Liste kaba bir elemedir: çıkan her cümleye elle bakılır. Bilinçli bir isim cümlesi ("Bilecik'teki düğün baskını da öyle.") kalabilir, ama nedeni sunuşta yazılır. Öbür yedi kural elle denetlenir.

---

## 4. Rozetlerin sesli karşılığı
Ekrandaki rozet ile anlatıcının sesi aynı şeyi söyler. İzleyici rozeti görmese de duyduğundan ayırt edebilmeli.

| Rozet | Sesli kalıp | Örnek |
|---|---|---|
| 🟢 **BELGE** | Düz "-dı" kipi. Gerekirse kaynak adı ya da "kaynakların hemen hepsi". Önemli anda: "Bunu kesin biliyoruz." | "Bizanslı tarihçi Pakhymeres'e göre, Bizans ordusu dağıldı." |
| 🟡 **TARTIŞMALI** | "İki anlatım var: X'e göre…, Y'ye göre…" · "Tarihçiler burada ayrışıyor." · sayı aralığı · karşı olguda "-ebilirdi" ve "gerçek tarihte" | "Savaşın yılı bile tartışmalı. Gelenek bin üç yüz iki der, bin iki yüz doksan dokuzu savunanlar da var." |
| 🔴 **RİVAYET** | Çerçeveyi aç: "Efsane şöyle anlatır:" ya da "Rivayete göre…" → içeride "-mış" → çerçeveyi kapat: "Güzel bir hikâye. Ama…" ya da "Kesin bildiğimiz tek şey şu:" (🟢'ye dönüş) | "Efsaneye göre şeyhin göğsünden bir ay doğmuş ve Osman'ın göğsüne girmiş." |
| ⚪ **DOĞRULANACAK** | Seslendirmeye **girmez**. | — |

**"Ama bir saniye" hamlesi (T6)** rozetlerin anlatı motorudur: önce yaygın bilinen anlatılır (🔴), sonra anlatı durur, soru sorulur ("Bu hikâyeyi kim yazdı?"), cevap bir kaynakla verilir (🟢). İzleyici bildiği bir şeyin öbür yüzünü öğrenir.

---

## 5. Teknik kataloğu
Storyboard'da her satırın "Teknik" sütununa kod yazılır (ör. `T4`). Bir bölümde 6–9 farklı teknik yeterli. Hepsini bir bölüme koymak, şablon gibi durmanın en kısa yoludur.

| Kod | Teknik | Kalıp | Doz | Kurgu karşılığı | Kaynak |
|---|---|---|---|---|---|
| T1 | **Tarih ve yer levhası** | "Yıl bin üç yüz iki. İzmit yakınları." | açılış ya da perde başı | yıl sayacı ve iğne aynı karede | Anime Tarih, Harp Tarihi, Bebar |
| T2 | **Adı geciktirme** | "İki imparatorluğun arasında, adı bile bilinmeyen bir topluluk yaşıyordu." → ad 3–5 sn sonra | bölümde 1 | önce siluet, ad kartı adla birlikte çakılır | Holosen, Bebar |
| T3 | **Açık döngü** | büyük soru %10–25'te açılır, %60–80'de ödenir | 1 büyük (+1 küçük) | soru ekranda bir nesneyle işaretlenir; ödemede aynı nesne döner | Bebar, Anime Tarih |
| T4 | **Peki–cevap** | "Peki elimizde ne var? Küçük bir sikke." (sorunun cevabı yüklemsiz olabilir; §3.6) | 2–3 | soruda kamera durur, cevapta kesme ya da vuruş | Yusuf Kayaalp, Bebar |
| T5 | **Sizi sahneye koyma** | "Bir an kendinizi Söğüt'te düşünün…" | en çok 1 | yakın plan, öznel kamera, ortam sesi | Bebar, Random Animasyon |
| T6 | **Ama bir saniye** | yaygın bilgi → dur → "Bunu kim yazdı?" → kaynakla cevap | 1 | görüntü donar ya da geri sarar (`rewindFX`), müzik bir an kesilir | Bebar, Holosen |
| T7 | **İki anlatım** | "X'e göre…, Y'ye göre…" | gerektikçe | bölünmüş ekran ya da iki kart | Harp Tarihi, Anime Tarih |
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
| T18 | **Taşınan imge** | sezon boyunca tek motif (§9) | her bölümde 1 an | `inkDrop`, parşömen, ağaç | Bebar |
| T19 | **"X dediler ona"** | "Ona Yıldırım dediler." | sezonda 1–2 | unvan kartı çakılır | Bebar |
| T20 | **Kaynak adıyla anlatım** | "Pakhymeres'e göre…", "Âşıkpaşazâde'nin anlattığına göre…" | 1–2 | künye satırı, rozet `src` | Holosen, Harp Tarihi, Anime Tarih |

---

## 6. Kancalar ve kapanışlar

### Kancalar (ilk 3 saniye)
İlk kelime ilk karede gelir: müzikli giriş, seri tanıtımı, "merhaba" yok. İlk cümle ≤ 8 kelime.

| Kod | Kalıp | Örnek (Sezon 1) |
|---|---|---|
| K1 | **Tarih + yer + tehlike** | "Yıl bin üç yüz iki. Bir Bizans ordusu yürüyor." |
| K2 | **Çelişki** | "Osmanlı İmparatorluğu altı yüz yıldan fazla ayakta kaldı. Ama kuruluşunu, o günlerde hiçbir Osmanlı yazmadı." |
| K3 | **Bildiğinizi sanıyorsunuz** | "Osman Bey'in ünlü rüyasını duymuşsunuzdur. Peki onu ilk kim yazdı?" |
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
| 70–82 sn | Döngünün ödemesi | Büyük soru cevaplanır; ne biliyoruz, ne bilmiyoruz | T20, rozet dili |
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

## 9. Sezon ipliği: "Bunu kim yazdı?"
Sezon 1'in taşınan imgesi **mürekkep ve yazı**. Her bölüm bir kaynağın gözünden de okunur: kim, ne zaman, hangi tarafta durarak yazdı? Bu, seriyi bağlayan "E. Bilgi ve kaynak" ipliğinin (`TUM-OLAY-ORGUSU.md`) Sezon 1'deki karşılığı. Görsel karşılığı mürekkep damlası (`inkDrop`) ve parşömen.

| Bölüm | Kim yazdı? (öneri; her satır bölüm araştırmasında doğrulanır) |
|---|---|
| Fragman, B1 | Kimse: kuruluşu yaşandığı günlerde hiçbir Osmanlı yazmadı. Elimizde bir sikke var. |
| B2 | Yüz yıl sonraki Osmanlı kronikleri (Âşıkpaşazâde): rüya ve düğün |
| B3 | Bir Bizanslı, olaylar yaşanırken: Pakhymeres |
| B4–B6 | Bizans tarihçileri; aralarında bir imparator, Kantakuzenos |
| B7 | Kaynaklar çelişiyor: Edirne'nin alındığı tarih |
| B8 | Üç hafıza: Osmanlı kroniği, Sırp destanı, Floransa mektubu |
| B9–B10 | Esir düşen bir Avrupalı asker, Timur'un tarihçileri, Bizans tarihçileri |

**Bölümler arası köprü zinciri** (sezon akışındaki boşluğu kapatır; şu an Bölüm 1'in son cümlesi Bölüm 3'ün konusunu açıyor):
- B1 sonu → B2: "Peki o yüz yıllık boşluğu ne doldurdu? Efsaneler."
- B2 sonu → B3: "Peki efsanelerden çok önce, Osman'ı anlatan ilk metni kim yazdı? Bir Bizans tarihçisi, hem de bir savaşı anlatırken."

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
| 7 | **Dürüstlük dili** | Her 🟡 ve 🔴 seste belli (§4); en az bir kaynak adı; ⚪ yok |
| 8 | **Anlam tutamağı** | En az bir ölçek, bugüne köprü ya da "bu neden önemli" cümlesi |
| 9 | **Ritim ve dil** | §12 ölçüleri hedefte; §3.6 denetimi temiz (yüklemsiz cümle, çerçevesiz zaman geçişi, belirsiz gönderim yok); "-dır" yazı dili yok |
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
| Kaynak dili (adet) | ≥ 1 | 1 ✓ | 8 ✓ | rozetlerin sesli karşılığı |
| Yasak, klişe | yok | ✓ | ✓ | §3.5 |
| Yüklemsiz cümle adayı | 0 (elle bak) | 0 ✓ | 2 ✗ | §3.6; eski Fragman'da da 2 |

Ölçümler kaba düzenli ifadelerle yapılır, karar puan kartınındır. Bir ölçü hedef dışındaysa ve bunun iyi bir nedeni varsa (ör. Fragman 56 kelime olduğu için şimdiki zaman yok), nedeni sunuşta tek cümleyle yazılır.

---

## 13. Açık kararlar (kullanıcıya)
1. **Varsayılan süre:** 90 sn (öneri); muharebe ve iki taraflı bölümler 2 dk; sezon finali 3 dk.
2. **Hız:** ElevenLabs Speed 1.0 korunur (öneri: belgesel kanallarının hızı zaten bu). İstenirse Bölüm 2'nin bir paragrafı 1.1 ile de kaydedilip kulakla karşılaştırılır.
3. **Sezon ipliği ve köprü zinciri** (§9): "Bunu kim yazdı?" motifi ve B1 → B2 → B3 kapanışları.
4. **İmza kapanış:** Her bölümün aynı sözle bitmesi güven ve süreklilik kurar (Bebar'ın vedası gibi), ama 90 sn'de 2–3 saniye harcar. Öneri: sözlü imza yok; imza, seri kartı ve müzikteki leitmotif.
