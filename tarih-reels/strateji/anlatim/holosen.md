# Holosen: anlatım analizi

> Kaynak: YouTube otomatik Türkçe altyazıları (21 Ekim 2026). Transkriptler `strateji/transkript/holosen/` altında, git dışında.
> Alıntılar kısadır; noktalama ve büyük harf düzeltmeleri bizimdir (otomatik altyazının bir kısmında noktalama yok).

## Künye
- **Kanal:** Holosen (`@holosen`), ~590 bin abone, 87 uzun video ve 113 Shorts. Konular: bilim, uzay, biyografi, tarih belgeseli (Fatih, Ayasofya, Nutuk).
- **Altyazı:** Hiçbir videoda elle yazılmış Türkçe altyazı yok, hepsi otomatik. Venüs, Ayasofya 2 ve Fatih Shorts'unda YouTube'un yeni noktalamalı otomatik altyazısı var. Öteki dört videoda noktalama yok; bu videolarda cümle ölçüleri alınamadı.

| # | Video | Süre | Görüntülenme | Neden seçildi |
|---|---|---|---|---|
| 1 | ALBERT EINSTEIN: Evrenin sırrını çözen adam (Biyografi #2), `6pnNgITRmIE`, 2022 | 27:36 | 4,67 Mn | En çok izlenen #1 |
| 2 | LEONARDO DA VINCI: Tarihteki en meraklı insan (Biyografi #9), `3kfs_T9BfOI` | 1:46:23 | 4,42 Mn | En çok izlenen #2 |
| 3 | AYASOFYA: Tarihin en kadim mabedi (2. Bölüm), `j0EO3kKgzLg` | 1:52:14 | 52 bin | En yeni #1, konumuza yakın (Bizans, Osmanlı, efsaneler) |
| 4 | VENÜS: Dünya'nın Asi İkizi (Gezegenler #4), `PKsY89qA-3s` | 39:22 | 221 bin | En yeni #2 |
| 5 | Türklerin Tarih Sahnesine Çıkışı, `k6XhF_yX-Hg` | 22:08 | 2,44 Mn | Konumuza en yakın video (aynı zamanda en çok izlenen #4) |
| 6 | Shorts: Fatih'in karşılaştığı ceset ormanı, `VE07KDZ1eH0` | 1:08 | 5,27 Mn | Osmanlı konulu en çok izlenen Shorts |
| 7 | Shorts: Mona Lisa'nın gerçek hali, `kEwYQRRpmYM` | 1:00 | 8,91 Mn | Kanalın en çok izlenen Shorts'u |

## Nicel tablo
Araç: `shared/tools/anlatim_analiz.py`. Tam çıktı `transkript/holosen/olcum.md` dosyasında. Ek sütunlar (`? /dk`, `seslenme/dk`) aynı okuyucuyla ayrıca sayıldı: `? /dk` soru işareti sayısının dakikaya oranıdır, `seslenme/dk` ise "arkadaşlar / dostlarım" gibi seslenmelerin. `*` olan satırlarda noktalama yok; zaman dağılımı bütün kelimelerden kabaca çıkarıldı, cümle sonundaki yüklemden değil.

| Video | Altyazı | dk | Kelime | Kel/dk | Ort. cümle | Vurucu % | Uzun % | Soru/100 | ? /dk | Hitap/100 | Seslenme/dk | Biz/100 | Şimdiki/geniş/geçmiş/-mış/isim % | Merak/100 | Sayı/100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Einstein | oto | 27.6 | 3910 | 142 | – | – | – | 0.38 | – | 0.74 | 0.54 | 0.49 | 17/0/63/14/0* | 1.38 | 0.82 |
| Leonardo | oto | 106.3 | 13205 | 124 | – | – | – | 0.06 | – | 0.48 | 0.01 | 0.87 | 21/0/48/24/0* | 0.73 | 1.05 |
| Ayasofya 2 | oto, noktalı | 112.0 | 14508 | 130 | 12.4 | 9.4 | 8.4 | 0.05 | 0.04 | 0.15 | 0 | 0.93 | 28/3/16/26/27 | 0.37 | 1.03 |
| Venüs | oto, noktalı | 39.2 | 4901 | 125 | 14.2 | 8.1 | 19.7 | 0.35 | 0.31 | 0.22 | 0 | 1.24 | 26/3/31/2/29 | 0.65 | 1.94 |
| Türklerin Tarih Sahnesine Çıkışı | oto | 22.2 | 2680 | 121 | – | – | – | 0.07 | – | 0.22 | 0 | 0.49 | 19/0/64/13/0* | 0.56 | 0.86 |
| S: Fatih, ceset ormanı | oto, noktalı | 1.1 | 182 | 161 | 12.1 | 6.7 | 6.7 | 0 | 0 | 0 | 0 | 0 | 13/0/53/33/0 | 0.55 | 0.55 |
| S: Mona Lisa | oto | 1.0 | 170 | 166 | – | – | – | 0.59 | – | 0 | 0 | 1.76 | 22/0/65/4/0* | 2.35 | 1.18 |

**Kanal ortalaması** (video başına basit ortalama; cümle ve zaman ölçüleri yalnızca noktalı videolardan):

| | Kel/dk | Ort. cümle | Vurucu % | Uzun % | Soru/100 | ? /dk | Hitap/100 | Biz/100 | Zaman: şimdiki/geniş/geçmiş/-mış/isim % | Mizah/dk (elle sayım) |
|---|---|---|---|---|---|---|---|---|---|---|
| Uzun form (5) | **128** | 13.3 | 8.8 | 14.1 | 0.18 | 0.17 | 0.36 | 0.80 | 27/3/24/14/28 | ~0.1 (Einstein 0.2, öteki videolarda ~0) |
| Shorts (2) | **164** | 12.1 | 6.7 | 6.7 | 0.29 | 0 | **0** | 0.88 | 13/0/53/33/0 | 0 |
| Bizim metinler (karşılaştırma için) | 120 | 8–13 | 15–43 | – | 0.5–3.6 | – | **0** | 0–0.5 | geniş zaman ağırlıklı | 0 |

**Okuma notları:**
- Uzun formda hız bizimkine çok yakın (~125–130 kel/dk). **Shorts'ta aynı anlatıcı ~%30 hızlanıyor (161–166 kel/dk)**, ciddiyeti de kaybetmiyor.
- Doğrudan hitap çok düşük; Shorts'ta yalnızca kanca sorusunda var ("merak ettiniz mi?"). Yeni videolarda (Venüs, Ayasofya) neredeyse sıfır. "Arkadaşlar" yalnızca 2022 tarihli Einstein'da sık geçiyor (0.54/dk). Kanal "YouTuber" sesinden "belgesel" sesine geçmiş.
- Soru oranı bizim metinlerimizden bile düşük. Merakı soruyla değil, **"öyle bir … ki" türü açık döngülerle** ve sona saklanan görüntüyle kuruyor.
- Anlatı zamanı: tarih anlatırken `-dı` ve arka plan için `-mıştı`. Efsanelerde **`-mış` kipine geçiyor** (Ayasofya'da `-mış` %26). Mekânı gezdirirken şimdiki zaman kullanıyor: "görüyoruz", "dikkat çekiyor".

## Anlatıcı profili
Holosen'in anlatıcısı sıcak ama ölçülü bir **belgeselci-öğretmen**. Konuya hayranlıkla yaklaşıyor, sesini neredeyse hiç yükseltmiyor. Eski biyografilerde (Einstein, 2022) "arkadaşlar" diye sesleniyor, küçük sınavlar ve "siz olsaydınız" sahneleri kuruyor. Yeni videolarda (Venüs, Ayasofya) aynı ses, cilalı ve neredeyse hitapsız bir belgesel diline dönmüş; izleyiciyle bağı sorular yerine somut ölçeklerle ve "gelin, bakalım" davetiyle kuruyor. Mizah çok seyrek ve hafif: alçakgönüllü ironi ya da tarihî kişilerin belgelenmiş esprileri. Anlatıcının kendi şakası neredeyse yok. Yorum ve yargı orta-yüksek. Kapanışlar hep bir "ders" ya da lirik sentezle bitiyor, bazen değer yüklü çerçeveler taşıyor ("haçlıların barbarlığı" ile "sultanların adaleti" yan yana). Kaynak adını anarak anlatmayı seviyor (Herodot, Kaşgarlı Mahmud, Carter Findley). Ama tartışmalı kimlik sorularında (İskitler) sonucu tek yöne bağlıyor ve alıntıları doğrulamıyor. Shorts'ta aynı ses hızlanıyor; hitap, sponsor ve çağrı olmadan tek bir açık döngüyü 60 saniyede kapatıyor.

## Teknik kataloğu
| # | Teknik | Ne yapıyor | Sıklık | Neden işe yarıyor | Örnek (zaman) |
|---|---|---|---|---|---|
| 1 | **Adı geciktiren betimleme** | Konunun adını vermeden önce onu 2–3 cümleyle betimliyor, ad bir "açılış" gibi düşüyor | Uzun videoların 2/5'inde (Venüs, Einstein) | İzleyici ilk saniyelerde tahmin yürütür; ad duyulunca küçük bir ödül alır | Venüs 0:00: "Güneş ve Ay'dan sonra gökyüzünde gördüğümüz en parlak gök cismi." (ad 0:13'te geliyor) |
| 2 | **"Öyle bir … ki" açık döngüsü** | İlk 8 saniyede sonucu söylemeden olayın şiddetini vaat ediyor | Shorts'larda her seferinde | 60 sn'lik bir vaat: izleyici cevabı görmek için kalır. Cevap 0:50'de geliyor | Fatih Shorts 0:07: "Bu sefer sırasında öyle bir manzarayla karşılaştı ki bunu hayatının sonuna kadar unutamadı." |
| 3 | **Soru kancası ve son saniyede görsel ödeme** | Kancada bir görüntü vaat ediyor, ödemeyi son 5 saniyeye saklıyor | Mona Lisa Shorts | İzlenme oranı sona taşınıyor; ödeme ekranda olduğu için "tekrar izle" etkisi doğuyor | Mona Lisa 0:00: "Hiç Mona Lisa'nın gerçek halini merak ettiniz mi? O aslında ilk çizildiğinde böyle değildi." (ödeme 0:54) |
| 4 | **Tahmin ettirme (mini sınav)** | Bir sayı ya da özellik soruyor, seçenek veriyor, hemen cevaplıyor | Eski videolarda 1–3 kez | İzleyiciyi zihinsel olarak oyuna sokuyor; cevap bir "şaşkınlık" anı oluyor | Leonardo 0:16: "Size bir soru: Bir insan en fazla kaç alanda uzmanlaşabilir? Bir, üç, beş?" |
| 5 | **"Siz olsaydınız" yerleştirmesi** | İzleyiciyi ikinci çoğul şahısla sahnenin içine koyuyor | Videoda 1–2 kez, genelde ilk 3 dk'da | Soyut olguyu bedensel bir deneyime çeviriyor | Venüs 2:15: "Eğer oraya gidecek olsaydınız anında pişer, ezilir ve asit içinde çözünerek yok olurdunuz." |
| 6 | **Ölçeği bedene ve tek benzetmeye indirme** | Rakamı "santimetrekarenize 94 kilogram", "kurşunu eritir" gibi somut karşılıklarla veriyor, sonra tek bir benzetmeyle özetliyor ("dev bir ayna") | Bilim videolarında her 2–3 dk'da | Sayı akılda kalmaz, görüntü kalır | (Venüs 1:13–2:05, alıntısız) |
| 7 | **Şaşkınlık onayı** | Şok edici bir rakamdan sonra tek cümlelik bir duraklama koyuyor | Videoda 1 kez | İzleyicinin tepkisini dillendiriyor ve rakamı ikinci kez vurguluyor | Venüs 1:57: "Evet, yanlış duymadınız." |
| 8 | **Uzun açık döngü ve "Peki …?" bölüm açıcıları** | Kancada büyük bir soru açıyor, bölümleri "Peki …?" sorularıyla açıp büyük soruyu sona doğru kapatıyor | Her uzun videoda; Türkler'de 2:55'te açılıp 17:09'da kapanıyor (~14 dk) | Uzun formu tek bir merak ipine bağlıyor; ara sorular bölümleri ayırıyor | Türkler 2:55: "İskitler Türk müydü? Gelin şimdi sizleri bir yolculuğa çıkarayım." |
| 9 | **Şakacı ileri gönderme** | Hikâyenin sonunu ima edip izleyicinin hükmünü erteliyor | Einstein'da 1 kez (9:07'de açılıp 20:20'de kapanıyor) | Hafif bir mizahla ikinci bir merak ipi kuruyor | Einstein 9:07: "İşte aşkın gücü diyorsunuz değil mi? Bence erken karar vermeyin, hikâyenin sonunu bekleyin arkadaşlar." |
| 10 | **Ödünç imge ve kaynak adıyla açılış** | Bir tarihçinin benzetmesini (Findley'nin "Türk otobüsü") açıyor, sonra onu sorgulayıp genişletiyor; anlatı boyunca kaynak adı veriyor ("Herodot'a göre", "Kaşgarlı Mahmud'un deyimiyle") | Tarih videolarında her 2–3 dk'da bir kaynak adı | Güven veriyor; benzetme karmaşık bir konuya tutunacak bir yer açıyor | (Türkler 0:05–1:30, alıntısız) |
| 11 | **Rivayet çerçevesi ve açık yalanlama** | "Efsane şöyle:" diye bir çerçeve açıyor, `-mış` kipine geçiyor, sonra "kesin bildiğimiz" olguya dönüyor. Yaygın bir yanlışı da adıyla yalanlıyor | Ayasofya'da 6 efsane, 2 yalanlama | Masal tadını korurken izleyiciyi kandırmıyor. **Bizim 🔴 rozetimizin sesli hâli** | Ayasofya 1:06:00: "…uzandığı iddiası kesinlikle doğru değil. Sadece bir şehir efsanesi." · 1:48:24: "Tarihsel olarak bizlerin kesin bir şekilde bildiği tek bir şey varsa…" |
| 12 | **Yol haritası, vaat ve "Hazırsanız başlıyoruz"** | Kancadan sonra videoda ne olacağını sayıyor, bir şaşkınlık vaat ediyor ("inanamayacaksınız"), müzikle bölüm başlatıyor | Her uzun videoda (1:10–3:00 arası) | Uzun formda izleyiciye yolun haritasını veriyor | (Venüs 2:22–3:00, Leonardo 2:24–3:00) |
| 13 | **Belgelenmiş espriyle sıcaklık** | Mizahı kendi şakasıyla değil, tarihî kişinin gerçek nüktesiyle getiriyor (Planck'ın uyarısı, Eddington'ın "üçüncü kişi" esprisi) | Einstein'da 2 kez | Gülümsetiyor ama tonu bozmuyor; olgu olarak da doğrulanabilir | (Einstein 15:49, 19:39) |
| 14 | **Üçlemeler ve liste ritmi** | "saatlerce, haftalarca, aylarca, hatta yıllarca"; "bazen …, bazen …, bazen de …" | Her videoda birkaç kez | Ritim ve büyüklük duygusu veriyor; kapanışlarda doruk oluyor | (Einstein 0:30, Ayasofya 1:49:57) |
| 15 | **Bugüne bağ** | Eski bir olguyu bugünkü bir adla, yerle ya da gelenekle bağlıyor: Venüs'e "Çoban Yıldızı" denmesi, Malazgirt'teki hilal taktiği, söğüt dalıyla fal | Tarih ve bilim videolarında 2–4 kez | "Bu bizimle ilgili" duygusu yaratıyor | (Türkler 9:24, 16:55; Venüs 0:05) |
| 16 | **Duygusal yumrukla kapanış (Shorts)** | Son cümlede güçlü bir karakterin bile sarsıldığını söylüyor; çağrı yok | Fatih Shorts | Duyguyu izleyicinin kendisine bırakıyor; paylaşma isteği uyandırıyor | Fatih Shorts 1:03: "Bu manzara karşısında korkusuzluğuyla bilinen Fatih Sultan Mehmet'in bile tüyleri ürperdi." |
| 17 | **Lirik sentez kapanışı (uzun)** | Bütün videoyu üçlemelerle özetliyor ve "biz"e dönüyor | Uzun videoların hepsinde | Uzun bir videoya duygusal bir son veriyor | Ayasofya 1:51:40: "Bu kadim mabette gördüğümüz şey aslında kendimiz." |

## Video başına dokuz soru
Numaralar `ANLATIM-ANALIZI.md`'deki şablona göre: 1 kanca · 2 kişilik ve mizah · 3 izleyiciyle ilişki · 4 yapı ve açık döngüler · 5 ritim · 6 açıklama araçları · 7 belirsizlik dili · 8 kapanış · 9 tempo.

**Einstein (27:36)**
1. Kanca: alıntıyla soğuk açılış (0:00–0:12), seri tanıtımı, dahi kavramı üzerinden bir "kim?" sorusu, ardından seçenekli bir "onu ne ölümsüz kıldı?" sorusu ve tek kelimelik cevap. "Hazırsanız başlayalım" 1:20'de geliyor. **~80 sn**; vaat: büyük hayat dersleri.
2. Öğretmen-arkadaş. "Arkadaşlar" 0.54/dk. Mizah ~0.2/dk: kafa şekli anekdotu, Planck ve Eddington esprileri. Yorum yüksek.
3. Okul fotoğrafını izleyicinin kendi okul deneyimine bağlayan bir soru ve bir tahmin sorusu var. "Düşünsenize…" (10:22) ile izleyiciyi patent memuru Einstein'ın yerine koyuyor.
4. Kronoloji: çocukluk → okul → aşk → 1905 → genel görelilik → 1919 kanıtı → aile → ABD ve bomba → ölüm → başarılar listesi. Döngü: "aşkın gücü" 9:07'de açılıp 20:20'de kapanıyor (~11 dk). "Peki bunları nasıl yaptı?" sorusu bütün videoyu taşıyor.
5. Soru-cevap ikilileri ve sayma ritmi; düşünce deneylerinde uzun paragraflar.
6. Asansör ve uzay gemisi düşünce deneyleri canlandırılıyor; Newton'la kıyas; Einstein'ın kendi mektupları.
7. Zayıf. Açılıştaki "her şey enerjidir, frekans…" sözü Einstein'a ait değil (internette yaygın yanlış atıf). Kapanıştaki söz zincirinde de doğrulanmamış atıflar var.
8. Başarı listesi, ardından hikâyenin bittiğini ama Einstein'a geri döneceklerini söyleyen köprü cümlesi (26:25), atfedilen sözler ve abone çağrısı.
9. 142 kel/dk. İlk 30 sn'de ~2 bilgi.

**Leonardo (1:46:23)**
1. Seri tanıtımı, mini sınav (0:16), alanların listesi ve alçakgönüllü bir ironi: ressamlığını listenin sonuna "bir de" diye ekliyor. Ardından yol haritası, şaşkınlık vaadi ve "başlıyoruz" (3:00). **~3 dk**.
2. Hayran belgeselci. Mizah ~0.1/dk: ironik yeniden çerçeveleme. Evlilik dışı doğmayı bir şans olarak sunuyor, çünkü öteki yol ailenin noterlik geleneğiydi.
3. Hitap düşük; yalnızca kapanışta doğrudan "siz".
4. Çocukluk → çıraklık → eserler (tematik) → bilim ve mühendislik → son yıllar → miras. Salvator Mundi vaadi 2:47'de açılıyor, çok geç kapanıyor.
5. Uzun sayma cümleleri; Leonardo'nun defterindeki soruların ard arda dizilmesi.
6. Defter soruları merakı canlandırıyor; "7200 sayfa, kayıpların ancak dörtte biri" ölçeği.
7. Yeni bulguyu tarihiyle veriyor ("2017'de ortaya çıkan kayıtlar"). Kralın kollarında ölüm sahnesi (Vasari rivayeti) düz anlatılıyor.
8. "Unutmayın" diye başlayan bir ders kapanışı, ardından izleyiciye somut gözlem önerileri.
9. 124 kel/dk. İlk 30 sn'de ~2 bilgi.

**Ayasofya 2 (1:52:14)**
1. Önceki bölümün özeti (0:00–0:26), "Şimdi gelin…" daveti, büyük bir iddia (Ayasofya mimariyi değiştiren bir avuç binadan biri) ve ilk merak sorusu: kilise neden kıbleye dönük? (1:40; 15 sn sonra cevaplanıyor).
2. Rehber-belgeselci. Mizah ~0.
3. "Gelin… inceleyelim", "görüyoruz": izleyiciyi gezintiye katan "biz" dili (0.93/100).
4. Mimari → Bizans sanatı → semboller → yeraltı → Osmanlı eserleri → efsaneler → kapanış. Soru açılıp hemen kapanan mikro döngüler; bölümler "Bakalım…" ile geçiliyor.
5. Orta uzunlukta cümleler (12.4 kelime); efsanelerde `-mış` kipinin ritmi.
6. Mekânsal yönlendirme; terimi söyleyip hemen tanımlama (ör. book matching); "Anlayacağınız…" diye özetleyen cümleler.
7. **En güçlü yanı:** "Efsane şöyle:" çerçevesi, `-mış` kipi, "kesinlikle doğru değil", "kesin bildiğimiz tek şey". Zayıf yanı: kripto oda gibi spekülasyonlar "olasılığı yüksek" denerek büyütülüyor.
8. Lirik üçlemelerle sentez ve "biz"e dönüş.
9. 130 kel/dk. İlk 30 sn'de önceki bölümün 6 başlığı özetleniyor.

**Venüs (39:22)**
1. Adı geciktiren betimleme (0:00–0:13), halk adları, şok olgu (Jimmy Carter'ın UFO raporu), sayı ve "yanlış duymadınız", "siz olsaydınız" (2:15), yol haritası (2:22–3:00). **~3 dk**, ama ilk 15 sn kendi başına bir kanca.
2. Ölçülü belgeselci. Mizah 0.
3. Hitap 0.22/100, hepsi ilk 2 dakikada toplanmış.
4. Fiziksel özellikler → oluşum → iç yapı → atmosfer → yüzey → yaşam ihtimali → keşif → mitolojiye dönüş. Döngü: "ters dönüşün sebeplerini inceleyeceğiz" 2:25'te açılıp 4:50'de "Peki neden?" diye kapanıyor (~2,5 dk).
5. Ölçümlerde 3–4 kelimelik kısa cümleler, açıklamalarda uzun cümleler (uzun cümle %19.7).
6. Dünya'yla sürekli kıyas (ikiz); ölçeği bedene indirme; "dev bir ayna".
7. Örnek bilimsel dil: "inanıyor", "alternatif bir hipotez", "düşünülüyor", "olabilir".
8. Mitolojiyle halkayı kapatıyor: tanrıça ile gezegen, "baş döndürücü ve yıkıcı".
9. 125 kel/dk. İlk 30 sn'de ~5 bilgi.

**Türklerin Tarih Sahnesine Çıkışı (22:08)**
1. Seri çerçevesi, ödünç imge (Findley'nin otobüs benzetmesi), imgeyi beğendiğini söyleyen kişisel bir not, imgenin sorgulanması, soru yağmuru ve büyük soru (2:55). **~3 dk**, yavaş.
2. Ozan-belgeselci: lirik doğa betimlemesi, destan tonu. Mizah 0. Ulusal gurur çerçevesi güçlü.
3. "Gelin", "sizleri", "Türkiye'deki bizler".
4. İmge → anayurt → bozkıra göç → at kültürü → Kimmer ve İskitler → yaşam ("Peki… nasıldı?" 9:01) → savaş taktiği → kimlik sorusunun cevabı (17:09) → Alp Er Tunga → lirik kapanış → kardeş kanal reklamı. Döngü ~14 dk.
5. Soru zincirleri ("ne yer, ne içer, ne giyer"); uzun betimleme cümleleri.
6. Bugüne bağlar (hilal taktiği, kümbetler); kaynak adları.
7. "Kesin tarihi bilinmemekle beraber", "tartışılmış olsa da" diye başlıyor, sonra "oldukça yüksek ihtimal" ile tartışmalı sonucu kesinleştiriyor. 🟡 olması gereken iddialar 🟢 gibi anlatılıyor.
8. Destan cümlesi ve başka kanalın tanıtımı.
9. 121 kel/dk. İlk 30 sn'de ~2 bilgi.

**Shorts: Fatih, ceset ormanı (1:08)**
1. Tarih, kişi ve hedef (1462, Vlad), ardından "öyle bir manzara… ki" (0:00–0:08). Vaat: dehşet veren görüntü.
2. Ciddi belgeselci. Mizah 0.
3. Hitap 0.
4. Kanca → farklı arazi → çelişki ("Oysa Vlad…") → ilerleyiş → terk edilmiş başkent (ters köşe) → takip → doruk (8 km, on binlerce ceset) → duygusal yumruk. Döngü 0:08'de açılıp 0:50'de kapanıyor.
5. Cümleler orta uzunlukta (12.1); geçişleri "Ama" ve "Oysa" taşıyor.
6. Ölçek rakamları.
7. Yok. Rakamlar kronik kaynaklı ve muhtemelen abartılı; kaynak söylenmiyor (bizde 🟡 olur).
8. Duygusal yumruk; çağrı yok.
9. 161 kel/dk. İlk 30 sn'de ~6 bilgi.

**Shorts: Mona Lisa (1:00)**
1. Soru ve iddia (0:00–0:04).
2. Rehber. Mizah 0.
3. Tek hitap kancada.
4. Kanca → model kimdi → teknik (sfumato, perspektif) → dönemeç: anlatıcı o ana kadar anlattıklarını kendisi küçümseyip asıl sorunu (yıpranma) açıyor → görsel ödeme (0:54).
5. Hızlı bilgi dizisi.
6. Kızılötesi tarama kanıtı.
7. Dijital "temizlenmiş" hâli gerçekmiş gibi sunma riski.
8. Görsel ödeme.
9. 166 kel/dk. İlk 30 sn'de ~7 bilgi.

## Yapı haritası
**Uzun form (22 dk – 1 sa 52 dk):**
`0:00 kanca` (alıntı, adı geciktiren betimleme ya da soru; 10–20 sn) → `0:15 seri tanıtımı ve kişisel not` → `0:40–2:20 şaşırtıcı olgular ve "neden önemli"` → `2:20–3:00 yol haritası, vaat, "Hazırsanız başlıyoruz"` (müzik) → `bölümler` (her biri "Peki …?" ile açılıyor; büyük kanallarda "kısım" adıyla 10–15 dk'lık bölümler) → `büyük açık döngünün çözümü` (videonun %70–80'i) → `miras ya da başarı listesi` → `ders ve lirik sentez` → (eski videolarda) `abone ya da kanal çağrısı`.

**Kısa form (60–70 sn):**
`0:00–0:08 olay ve açık döngü (1–2 cümle)` → `0:08–0:45 kronolojik tırmanış` (çelişki: "Oysa", engel: "Ama", ters köşe) → `0:45–0:58 doruk` (görüntü ya da rakam) → `son cümle: duygusal yumruk ya da görsel ödeme`. Hitap, sponsor ve çağrı yok; hız ~165 kel/dk.

**Fark:** Uzun formdaki 3 dakikalık giriş Shorts'ta 8 saniyeye iniyor. Hız %30 artıyor, ilk 30 saniyedeki bilgi 2'den 6–7'ye çıkıyor. Hitap kancadaki tek bir soruya iniyor. Kapanıştaki "ders" düşüyor, yerine tek bir duygu cümlesi geliyor.

## Bize ne alınır, ne alınmaz
**Alınır**
1. **Shorts iskeleti olduğu gibi:** 1–2 cümlelik "öyle bir … ki" açık döngüsü, kronolojik tırmanış ("Oysa", "Ama"), doruk ve son cümlede duygusal yumruk ya da sıradaki bölüme kanca. 60–75 sn'lik bölümlerimize birebir uyuyor ve ciddi bir sesle çalışıyor.
2. **Adı geciktiren betimleme:** "Söğüt'te, iki imparatorluğun arasında küçük bir oba…" gibi bir açılışla adı (Osman) 3.–5. saniyede düşürmek.
3. **"Efsane şöyle:" çerçevesi = 🔴 dili.** Çerçeveyi bir kez açmak, `-mış` kipine geçmek, "kesin bildiğimiz şu:" ile 🟢'ye dönmek. Yaygın bir yanlışı adıyla yalanlamak ("Bu bir şehir efsanesi"). Bu, `tarih-reels-arastirma`'daki "Rivayete göre… Ama…" kuralının ilk elden kanıtlanmış uygulaması.
4. **Bilimsel hipotez dili = 🟡 dili:** "Tarihçilerin çoğu … düşünüyor; başka bir görüşe göre …". Venüs'teki "inanıyor / alternatif bir hipotez" kalıbı.
5. **Ölçeği bedene indirme ve tek benzetme:** her bölümde bir kez ("bugünkü bir ilçe kadar", "bir günlük at yolu").
6. **"Evet, yanlış duymadınız."** türü şaşkınlık onayı: 90 sn'de en fazla bir kez, en şaşırtıcı rakamdan sonra.
7. **Mizahı belgelenmiş sözlerden almak:** anlatıcı şaka yapmasın; kroniklerdeki nükteli bir söz (🟢 rozetle) sıcaklık versin. Emrullah Uzun'un ciddi ama sıcak sesine en uygun mizah bu.
8. **Kaynak adıyla anlatmak:** "Âşıkpaşazâde'ye göre…", "Bizanslı Pakhymeres'in yazdığına göre…". Ekrandaki rozetin sesli karşılığı olur.
9. **Tempo:** Holosen'in Shorts'u, ciddi belgesel sesinin ~160 kel/dk'da da çalıştığını gösteriyor. Bizim 120 kel/dk Reels için yavaş. **2,3–2,5 kel/sn (140–150 kel/dk)** denenebilir.

**Alınmaz**
1. Üç dakikalık giriş, seri tanıtımı, "Hazırsanız başlıyoruz": bizde kanca ilk 3 saniyede biter.
2. Doğrulanmamış ya da yanlış atfedilmiş alıntıyla açılış (Einstein'daki "frekans" sözü). Bizde ⚪ seslendirmeye girmez.
3. Tartışmalı kimlik sorularını tek yöne bağlamak (İskitler); değer yüklü karşıtlıklar ("haçlıların barbarlığı" ile "sultanların adaleti"). Tarafsızlık çizgimize aykırı.
4. Spekülasyonu "olasılığı yüksek" diye büyütmek (kripto oda). Bizde ya 🟡 ve kaynakla ya da hiç.
5. Kardeş kanal reklamı ve abone çağrısı.
