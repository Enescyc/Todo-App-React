---
name: tarih-reels-senaryo
description: >-
  Tarih Reels bölümlerinin anlatım metni, storyboard'u ve timeline.js'i. Kapsadığı konular: akıcı belgesel üslubu, Emrullah Uzun hızına göre süre hesabı (~2 kelime/sn), kanca ve merak kancası, paragrafın zaman birimi olması, storyboard tablosu (çapa kelime, görüntü, amaç, çıkış, taşınan nesne), çekim yoğunluğu, kahraman an, yasaklar listesi, kelime çapası söz dizimi ("p2:Kösedağ'da+0.3") ve timeline.js alanları (scenes, transitions, badges, cards, hits, risers, music). Kullanıcı "metni yaz", "senaryoyu hazırla", "storyboard çıkar", "anlatım dilini düzelt", "bölümü kısalt/uzat", "timeline'ı kur", "sahneleri kelimelere bağla" dediğinde ya da bir bölüm metni veya zaman çizelgesi üzerinde çalışılırken bu skill'i kullan.
---

# Anlatım, storyboard ve timeline.js

## 1. Anlatım metni
**Üslup.** Belgesel anlatıcısının sesiyle akan paragraflar yaz; liste gibi ya da kesik cümleler kullanma. Cümleler bağlaçlarla akar: "Ama", "Oysa", "Ve", "Peki". Kullanıcı ilk taslaklardaki bölük pörçük dili reddetti, akıcı Peraşt metnini ise "çok daha iyi" diye onayladı. Ölçü o metin.

**Yapı (60–75 sn):**
- **İlk cümle kanca olsun.** İlk 3 saniyede bir çelişki ya da şaşırtıcı bir olgu ver: "600 yıl süren bir imparatorluğun nasıl kurulduğunu… kimse yazmadı."
- **Gövde 4–6 paragraf.** Her paragraf bir anlam birimidir ve aynı zamanda **zaman birimidir**: seslendirme paragraflardan bölünerek hizalanır.
- **Kahraman an:** Bölümün ~%60–75'inde tek bir unutulmaz görüntü olsun (sikke, deprem, çöküş).
- **Son cümle merak kancası** olsun ve sıradaki bölüme bağlansın. "Sıradaki bölümde" demek gerekmez; soru yeterli.

**Süre hesabı.** Emrullah Uzun ~2.0 kelime/sn okur. 110 kelime ≈ 55 sn; kartlarla birlikte ≈ 60–65 sn.

**Seslendirme için yazım:**
- Sayıları yazıyla yaz: "bin üç yüz yirmi altı".
- Kısaltma kullanma.
- Yabancı adları Türkçe okunuşuna yakın yaz: "Kantakuzenos", "Pakhymeres".
- Rozetli dil kullan: 🟡 için "kaynaklar ayrışır", 🔴 için "rivayete göre".
- Metindeki **kelimeler animasyonun zaman çapasıdır**. Onaydan sonra bir kelimeyi değiştirmek `timeline.js`'deki çapaları da değiştirir; değişiklikleri birlikte yap.

**Kullanıcıya sunuş.** Metni paragraf paragraf ver; kullanıcı "part part" değerlendiriyor. Her bölüm için kelime sayısını, tahmini süreyi ve rozet özetini göster.

## 2. Storyboard
Şablon: [references/storyboard-sablonu.md](references/storyboard-sablonu.md). Temel kurallar:
- **Bir görsel vuruş 1.4–3.5 saniyedir.** 60 sn'lik bölümde 16–24 vuruş olur; bir sahnenin içinde birden çok vuruş olabilir (iğne düşer, ok uzar, yazı çakılır).
- **"Çıkış / taşınan nesne" sütunu:** Her çekim bir sonrakine bir şey bırakır. Sınır çizgisi oka dönüşür, sikke haritaya düşer, kamera aynı noktaya iner. Geçişleri bu nesneler taşır, çapraz geçiş en son çaredir. Aynı haritayı kullanan ardışık sahneler aynı kamera yolunu paylaşır.
- **Renk yayı:** Bölümün renk eğrisini önceden yaz (ör. şafak sıcağı → harita sepyası → çöküşte soğuk gri → finalde altın).
- **Yasaklar listesi:** Her bölümde tekrar edilir. Parçacık patlaması, RGB kayması, mercek parlaması, neon parıltı, ciddi anlarda zıplayan yumuşatma, gerçek kişi portresi, dönemine uymayan bayrak ya da sembol, "strateji oyunu arayüzü" görünümü. Şablon görünümü çoğunlukla bunlardan gelir.

## 3. timeline.js
Şablon: [references/timeline-sablonu.js](references/timeline-sablonu.js). Alanların özeti:

| Alan | Biçim | Not |
|---|---|---|
| `series` | `{season, n, of}` | `n: 0` fragman demektir |
| `rate, lead, gap, tail` | hece/sn, sn | Ses gelene kadar tahmini zamanlama için `rate: 6.5` |
| `paras` | `[{text, hl:[vurgulu kelime başları]}]` | Seslendirme metniyle **birebir aynı kelimeler** |
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
- **Kontrol:** Sayfayı açıp `cue('p3:Osman\'dır')` değerlerine bakın ya da `shared/tools/kontrol.js` ile iletişim tablosu alın. Kelime bulunamazsa sayfa hata verir.

## 4. Kontrol listesi (kullanıcıya göstermeden önce)
- [ ] İlk 3 saniyede kanca var; son cümle merak bırakıyor.
- [ ] Her iddia `FACTS.md`'de; ⚪ yok; 🟡 ve 🔴 dilde belli.
- [ ] Kelime sayısı ve süre hedefte.
- [ ] Storyboard'da her çekimin çıkış nesnesi ve rozeti var; yasaklar listesi yazılı.
- [ ] `timeline.js` paragraf metinleri `SESLENDIRME.md`'deki metinle aynı. Etiketler (`[calm]` gibi) yalnızca ElevenLabs metninde bulunur.
