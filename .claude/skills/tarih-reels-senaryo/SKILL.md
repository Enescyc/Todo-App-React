---
name: tarih-reels-senaryo
description: >-
  Tarih Reels bölümlerinin anlatım metni, storyboard'u ve timeline.js'i. Kapsadığı konular: serinin anlatıcı dili (ANLATICI-DILI.md: anlatıcı kimliği, teknik kataloğu, kanca ve kapanış kalıpları, rozetlerin sesli karşılığı, puan kartı), akıcı belgesel üslubu, Emrullah Uzun hızına göre süre hesabı (~2 kelime/sn), 90 sn / 2 dk / 3 dk yapı şablonları, kanca ve merak kancası, harita sessizliği (pause), paragrafın zaman birimi olması, storyboard tablosu (çapa kelime, görüntü, amaç, çıkış, taşınan nesne), çekim yoğunluğu, kahraman an, yasaklar listesi, kelime çapası söz dizimi ("p2:Kösedağ'da+0.3") ve timeline.js alanları (scenes, transitions, badges, cards, hits, risers, music). Kullanıcı "metni yaz", "senaryoyu hazırla", "storyboard çıkar", "anlatım dilini düzelt", "anlatıcı dili", "daha eğlenceli/dikkat çekici anlat", "kanca zayıf", "bölümü kısalt/uzat", "timeline'ı kur", "sahneleri kelimelere bağla" dediğinde ya da bir bölüm metni veya zaman çizelgesi üzerinde çalışılırken bu skill'i kullan.
---

# Anlatım, storyboard ve timeline.js

## 1. Anlatım metni
**Önce rehberi oku:** `tarih-reels/osmanli-serisi/ANLATICI-DILI.md`. 6 Türkçe tarih kanalının analizinden çıkan anlatıcı kimliği, dil kuralları, teknik kataloğu (T1–T20), kancalar (K1–K6), kapanışlar (S1–S5), yapı şablonları, puan kartı ve ölçüm hedefleri orada. Aşağısı yalnızca özet.

**Amaç.** Kısa tutmak değil; eğlenceli, dikkat çekici ve güvenilir anlatmak. Varsayılan biçim 90 sn (150–170 kelime); muharebe ve iki taraflı bölümler 2 dk (210–230); sezon finali 3 dk (320–340). Kullanıcı hangi biçimi seçtiyse o geçerli.

**Anlatıcı.** Haritanın başında oturan, olayları tek bir hikâye gibi anlatan, sizi sahneye çağıran sıcak bir anlatıcı. İzleyiciye "siz" der, yer yer "biz"le yanına alır; "sen", "dostlarım", argo ve abone çağrısı yok. Kişilere sıfat takmaz; dram, olguları yan yana koymaktan doğar.

**Üslup.** Akıcı paragraflar: kullanıcı bölük pörçük dili reddetti, akıcı Peraşt metnini "çok daha iyi" diye onayladı. Kısa cümle paragrafın içinde bir vuruştur, liste değil.
- **Zaman:** olaylar **-dı**; arka plan -yordu/-mıştı; **doruk şimdiki zaman**; rivayet çerçevesinin içi -mış; kapanış -ecekti. Geniş zaman ≤ %15, "-dır/-tır" ≤ %10 ("Liderinin adı Osman'dır" değil, "Başlarındaki beyin adı ise Osman."). Şimdiki zamana bir sahne çerçevesiyle girilir ("Bin dört yüz iki yazında, Ankara yakınlarında…") ve sahne bitene kadar orada kalınır.
- **Cümle:** ortalama 8–11 kelime; 20 kelimeyi aşan cümle yok; kanca ve doruk cümleleri kısa ama **tam** (yüklemli). Cümleyi parçalara bölmek kısa cümle yazmak değildir.
- **Anlatım bozukluğu yok** (rehber §3.6, kırmızı çizgi): her cümlenin yüklemi var (istisna: soruya kısa cevap); zaman geçişi çerçeveli; özne ve gönderim açık ("saflar" kimin, "bu devlet" hangisi); "ve" aynı türden öğeleri bağlar; özne ile yüklem arasına virgül girmez; metin öbür bölümlerle çelişmez. Kullanıcı Fragman taslağını tam bu yüzden geri çevirdi. Metni yüksek sesle okuyarak denetle.
- **Kopukluk yok** (rehber §3.6 kural 9): her paragrafın ilk cümlesi öncekinin son öğesine bağlanır (aynı ad, "Bu…", "Bunun üzerine", "Tam bu sırada", "Ama"). Bölüm bir olay listesi değil, neden-sonuç zinciridir; bir paragrafa sığmayan olay çıkarılır. Kullanıcı Bölüm 3–5 taslaklarını "kopukluklar hâlâ mevcut" diye geri çevirdi.
- **İzleyici:** 2–4 soru ("Peki…?" cevabı hemen gelir), 1–2 hitap ("Düşünün…"), 1–3 "biz".
- **Dönemeç:** her 15–25 sn'de bir "Ama / Oysa / Peki / Ta ki" ya da yeni görüntü ölçeği.

**Yapı (90 sn):** kanca 0–3 sn (ilk cümle ≤ 8 kelime, ilk kelime ilk karede) → açık döngü 3–12 sn → bağlam ve tırmanış → kırılma ("Düşünün…" ya da "Ama bir saniye") → **doruk %55–75'te** (kahraman an) ve 1,5–3 sn harita sessizliği → döngünün ödemesi → kapanış (son cümle ≤ 12 kelime, sıradaki bölüme bağlı). 2 ve 3 dakikalık iskeletler rehberin §7'sinde.

**Paragraf zaman birimidir.** Seslendirme paragraflardan bölünerek hizalanır. Bir paragraf bir anlam birimi; harita sessizliği paragraf sonuna `pause` olarak konur. `SENARYOLAR.md`'de metin tek blok halindeyse kelimelerine dokunmadan cümle sınırlarından böl ve bölmeyi kullanıcıya göster.

**Hikâye önde, kaynak arkada** (rehber §4; kullanıcı kararı): Anlatı, doğru bilgiyi harmanlayıp hikâye olarak anlatır. "Bunun kaydı yok", "bunu şu tarihçi yazdı", "kroniklerde ilk kez…" türü cümleler istenmiyor; kaynak ayrıntısı ekrandaki rozette ve `FACTS.md`'de kalır.
- 🟢 düz anlatılır, kaynak adı söylenmez (kaynak kişi hikâyenin karakteri değilse).
- 🟡 yuvarlak ve doğru söylenir ("bin üç yüzlerin başında", "yaklaşık"); seçenekleri saymak yalnız tartışma hikâyenin parçasıysa.
- 🔴 tek bir işaretle hikâyenin içinde anlatılır ("anlatılana göre…", içeride -mış); ardından çürütme paragrafı yazılmaz.
- ⚪ seslendirmeye girmez.

**Süre hesabı.** Emrullah Uzun ~2.0 kelime/sn okur. 160 kelime ≈ 80 sn konuşma; harita sessizlikleri ve kartlarla ≈ 90 sn. Hız artırılmaz; enerji kısa cümle ve sessizlikten gelir.

**Seslendirme için yazım:**
- Sayıları yazıyla yaz: "bin üç yüz yirmi altı".
- Kısaltma kullanma.
- Yabancı adları Türkçe okunuşuna yakın yaz: "Kantakuzenos", "Pakhymeres".
- Metindeki **kelimeler animasyonun zaman çapasıdır**. Onaydan sonra bir kelimeyi değiştirmek `timeline.js`'deki çapaları da değiştirir; değişiklikleri birlikte yap.

**Kontrol (kullanıcıya göstermeden önce):**
```bash
python3 shared/tools/anlatim_analiz.py <bölüm>/timeline.js      # ölçüm + hedef kontrolü (rehber §12)
python3 shared/tools/anlatim_analiz.py taslak.txt --hedef       # timeline'a girmemiş taslak
```
Araç yüklemsiz cümle adaylarını ve öncekine bağlanmayan paragraf başlarını listeler; her birine elle bak. Sonra rehberin §11'indeki **puan kartını** doldur: 10 madde × 0–2, geçme ≥ 16/20 ve hiçbir maddede 0 yok. Kırmızı çizgilerden biri varsa metni sunma.

**Kullanıcıya sunuş.** Metni paragraf paragraf ver; kullanıcı "part part" değerlendiriyor. Her paragrafın yanında kullandığın teknik kodları (ör. `K2 · T3`) ve rozetleri yaz. Sonda kelime sayısı, tahmini süre, puan kartı (`Puan 17/20 · zayıf: 3, 8`) ve hedef dışı ölçüler (nedeniyle) bulunsun.

## 2. Storyboard
Şablon: [references/storyboard-sablonu.md](references/storyboard-sablonu.md). Temel kurallar:
- **Bir görsel vuruş 1.4–3.5 saniyedir.** 90 sn'lik bölümde 24–36 vuruş olur; bir sahnenin içinde birden çok vuruş olabilir (iğne düşer, ok uzar, yazı çakılır). Harita sessizlikleri (`pause`) ve yeniden kancalar storyboard'da ayrı işaretlenir.
- **"Çıkış / taşınan nesne" sütunu:** Her çekim bir sonrakine bir şey bırakır. Sınır çizgisi oka dönüşür, sikke haritaya düşer, kamera aynı noktaya iner. Geçişleri bu nesneler taşır, çapraz geçiş en son çaredir. Aynı haritayı kullanan ardışık sahneler aynı kamera yolunu paylaşır.
- **Renk yayı:** Bölümün renk eğrisini önceden yaz (ör. şafak sıcağı → harita sepyası → çöküşte soğuk gri → finalde altın).
- **Yasaklar listesi:** Her bölümde tekrar edilir. Parçacık patlaması, RGB kayması, mercek parlaması, neon parıltı, ciddi anlarda zıplayan yumuşatma, gerçek kişi portresi, dönemine uymayan bayrak ya da sembol, "strateji oyunu arayüzü" görünümü. Şablon görünümü çoğunlukla bunlardan gelir.

## 3. timeline.js
Şablon: [references/timeline-sablonu.js](references/timeline-sablonu.js). Alanların özeti:

| Alan | Biçim | Not |
|---|---|---|
| `series` | `{season, n, of}` | `n: 0` fragman demektir |
| `rate, lead, gap, tail` | hece/sn, sn | Ses gelene kadar tahmini zamanlama için `rate: 6.5` |
| `paras` | `[{text, hl:[vurgulu kelime başları], pause?}]` | Seslendirme metniyle **birebir aynı kelimeler**. `pause`: paragraftan sonra ek sessizlik (sn; harita sessizliği T15, 1.5–3). Gerçek seste de `make_audio` aynı boşluğu koyar |
| `scenes` | `[{id, from, note?}]` | Her sahne bir sonrakinin başladığı ana kadar sürer. Haritalı sahnede `note: 'YAKLAŞIK SINIRLAR · 1402'` |
| `transitions` | `[{at, type, d}]` | `flash`, `dip`, `whip`, `dive`, `rise` |
| `badges` | `[{from, to, k, src}]` | `k`: `belge`, `tartismali`, `rivayet`, `dogrulanacak` |
| `cards` | `[{from, to?, kicker, title:[satırlar], sub?, type?:'next', y?}]` | Bölüm başlığı ve sıradaki bölüm kartı |
| `hits` | `[{at, amp, sfx, gain}]` | `amp` ekran sarsıntısı ve zoom tepmesi; `sfx` için `shared/sfx` kimliği |
| `risers` | `[{to, sfx, gain}]` | Sesin sonu çapaya oturur; koyu sesler seçilir (`vurus/timpani_rulo`) |
| `music` | `[{from, to, style:'trk:kurulus', sync:[çapa, sn], gain, fallback}]` | Bkz. `tarih-reels-ses` |
| `blur` | `[{from, to}]` | `render.js --mb N` ile hareket bulanıklığı alacak hızlı anlar (geçişler otomatik eklenir) |
| `duckDb`, `capY` | sayı | Müziğin konuşma altında kısılma miktarı (varsayılan 15); altyazının y konumu (1360) |

**Çapa söz dizimi:** `'p2'` paragraf başı, `'p2.end'` paragraf sonu, `'p2:Kösedağ'da'` o paragrafta bu harflerle **başlayan ilk** kelime, `'p4:bir#2'` ikinci eşleşme, `'+0.3'` ve `'-0.2'` saniye kaydırma, `'end'` videonun sonu.
- **Tuzak:** Arama önek eşleşmesidir. `'p2:on'` "on dört"ü yakalar, `'p3:Bir'` paragraftaki ilk "bir"i yakalar. Ayırt edici bir kelime seç ya da `#n` kullan.
- **Kontrol:** `NODE_PATH=$(npm root -g) node shared/tools/kontrol.js <bölüm> --capalar`. Her çapanın saniyesini ve **yakaladığı kelimeyi** listeler (ör. `p4:baskın` → «baskını» uyarısı). Kelime bulunamazsa satır HATA olarak görünür.

## 4. Kontrol listesi (kullanıcıya göstermeden önce)
- [ ] `anlatim_analiz.py` hedef kontrolü yapıldı; hedef dışı ölçülerin nedeni yazıldı.
- [ ] Metin yüksek sesle okundu; §3.6 anlatım bozukluğu denetimi temiz.
- [ ] Puan kartı ≥ 16/20, hiçbir maddede 0 yok, kırmızı çizgi yok (`ANLATICI-DILI.md` §11).
- [ ] İlk 3 saniyede kanca var; son cümle sıradaki bölüme bağlanıyor.
- [ ] Her iddia `FACTS.md`'de; ⚪ yok; 🟡 ve 🔴 dilde belli.
- [ ] Kelime sayısı ve süre seçilen biçimde (90 sn / 2 dk / 3 dk).
- [ ] Storyboard'da her çekimin teknik kodu, çıkış nesnesi ve rozeti var; harita sessizlikleri `pause` olarak işaretli; yasaklar listesi yazılı.
- [ ] `timeline.js` paragraf metinleri `SENARYOLAR.md` ile aynı. Bölüm `SESLENDIRME.md`'ye eklendiyse (onaydan sonra, `tarih-reels-seslendirme`) oradaki kelimelerle de aynı. Etiketler (`[calm]` gibi) yalnızca ElevenLabs metninde bulunur.
