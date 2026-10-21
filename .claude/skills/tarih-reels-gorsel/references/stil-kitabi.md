# Osmanlı serisi stil kitabı

Bu kitabın 11 bölümlük yapısı, lemo-opuscar'ın STYLE.md düzeninden (MIT) esinlenmiştir. İçerik bu seriye özgüdür.

## 1. Öz / ne değildir
- **Öz:** Eski bir atlasın sayfasında canlanan, kaynağını gösteren bir belgesel. Harita anlatır; siluetler ve nesneler kişileri temsil eder; rozetler dürüstlüğü gösterir.
- **Ne değildir:**
  - Strateji oyunu arayüzü değildir.
  - Dizi sahnesinin taklidi değildir.
  - Neonlu "viral şablon" değildir.
  - Kahramanlık propagandası değildir.

## 2. Malzeme
- Parşömen ve kâğıt dokusu: `GRAIN` çarpımı, sıcak yumuşak ışık (`POST` katmanı).
- Mürekkep çizgisi.
- Altın varak: Cinzel başlıklar, iğne etiketleri.
- Sikke gümüşü.
- Mum ışığı (`glow`).
- Duman ve kor parçacıkları yalnızca savaş sonrasında.

## 3. Renk
- **Harita:** Deniz `#7f9fa6`, kâğıt kara `#e3d3ac`.
- **Sahipler:** Osmanlı `#a8322a`, Bizans `#7a5a9a`, Selçuklu `#3f7f7a`, Moğol/İlhanlı `#5a544a`, beylikler aşı ve okra tonları, Balkan devletleri çelik mavisi, Latinler yeşil, Timur `#3e4a3c`. Tam liste `ortak/sahiplik.js` → `pal`.
- **Vurgu altını:** `#f2c75c`.
- **Rozetler:** BELGE `#3f9a4a`, TARTIŞMALI `#d9a21b`, RİVAYET `#c0392b`.
- **Odak:** Odak dışı sahipler `dim: .3–.5` ile soluklaşır, odak (genelde OSM) canlı kalır.
- **Renk yayı:** Her bölümde bir yay yazılır. Çöküş sahneleri soğur, finaller altına döner.

## 4. Tipografi
- **Başlık:** Cinzel 900, altın gradyan, harf harf (`mode: 'letters'`).
- **Vurucu kelime:** Anton, slam, krem `#f4ead2`.
- **Etiket ve altyazı:** Montserrat 800–900, büyük harf `up()`, harf aralığı 2–10 px.
- **Harita adları:** Cinzel 900, kâğıt halesiyle (`mapLabel`).
- **Altyazı:** Grubu en fazla 4 kelime ya da 22 karakter; anahtar kelimeler sarı (`hl`).

## 5. Hareket
- **Yumuşatmalar:**
  - Belirme: yay ya da `eBack`.
  - Yer değiştirme: `eIO`.
  - Ok uzaması: `eIO(seg(…))`, ok `spline` ile kıvrılır.
- **Ciddi anlar:** Zıplama yok; yavaş `fade` ya da `slam` ile çakılma.
- **Tutuşlar:** "Yaşayan tutuş": kamera itmesi, sancak dalgası, duman.
- **Final karesi:** 0.8–1.2 sn tutulur.

## 6. Kamera dili
- Harita: `camPath` (log-zoom, hafif itme). Uzak atlama: `flyTo`.
- Dalış: `dive` geçişi + yakınlaşma.
- Vuruşta zoom tepmesi (`hits.amp`).
- Bir bölümde en az dört farklı kamera hareketi bulunsun: dalış, kayma, uçuş, geri çekilme.

## 7. Ses (bkz. `tarih-reels-ses`)
- Müzik tarzı sahnenin duygusuna göre seçilir ve leitmotif bir kelimeye kilitlenir.
- Vuruş sesleri koyu tonlu olur: timpani, davul, kös.
- Bir bölümde en az iki kez ses geçişi taşır: rulo kabarıp vuruşa varır.

## 8. İmza hareketleri
- Yıl sayacının dönmesi ya da geri sarılması.
- Haritada sahip değişirken birimin parlaması.
- Tabiiyet taraması.
- Mühür ya da "BELGE YOK" damgası.
- Sikke dönüşü ve ışık süpürmesi.
- Parşömene mürekkep damlası.
- Rüya ağacının büyümesi.
- Tuğun devrilmesi.

## 9. Tuzaklar
- Yazı imza ya da rozetle çakışıyor: `SAFE_TOP`'tan sonraki ilk 170 px'e büyük başlık koyma.
- Etiket ekrandan taşıyor: kamera merkezini kaydır ya da etiketi `LL()` ile içeri al.
- Harita etiketleri kalabalıklaşıyor: `ownerLabels({ only: [...] })` ile sınırla.
- Siluet karanlıkta kayboluyor: arkasına sıcak ışık koy (`rg` gradyanı).
- Uzun statik kare.
- Altyazı ile ekran yazısı aynı şeyi söylüyor.
- Ses yokken zamanlamaya güvenmek: tahmini, gerçek sesle kayar.

## 10. Motor
- Canvas 2D, 1080×1920, 30 fps.
- `drawScene` ölçek 1.03 + sarsıntı; `POST`: sıcak ton, rozetler ve kartlar; altyazı en üstte.

## 11. Varyasyon (sezona göre)
| Sezon | Görsel ağırlık |
|---|---|
| S1 | Uç, bozkır şafağı, sepya harita; Bizans moru belirgin |
| S2–S3 | İstanbul ve imparatorluk altını; mühür ve tuğra süslemesi; İznik çini/saz motifleri |
| S4–S5 | Barok süsleme, Avrupa gravürü |
| S6–S7 | Gazete ve fotoğraf dokusu; telgraf |
| S8 | 1914 film greni (`oldFilm`), siyah-beyaz yakın |
