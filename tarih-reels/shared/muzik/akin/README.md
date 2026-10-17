# akin – Akın / Savaş

Hızlı, nabzı yüksek savaş müziği: atlı akıncıların ve meydan savaşlarının enerjisi. Enerji çatışma "çeliğinden"
değil ritimden gelir: 9/8 aksak darbuka–def–davul, Re–La timpani ostinatosu ve kontrbas + çello spiccato ostinatosu.
Leitmotif kornoda ve violada **parçalanmış** hâlde. Tizler yumuşak; anlatımın altında çalacak şekilde koyu ve sıcak.

**Kullanım:** meydan savaşları (Koyunhisar, Çirmen, Kosova, Niğbolu, Ankara…), akıncı baskını / süvari hücumu,
harita okları (ordu ve akıncı hareketi), kuşatma hücumu, kovalamaca. **Yoğunluk:** yüksek · **Sezonlar:** 1–5 (sonraki savaş sahnelerinde de kullanılabilir).

## Müzikal kimlik (dürüst not)
- **Ton/makam:** Re Hicaz'a yaklaşım; ezgisel E♭ +15 sent, F♯ −15 sent koma renkleri (korno, viola, çello ostinatosu).
  Timpani ve korno vurguları 12-TET. Ara bölümde Sol (iv) ve E♭ (Hicaz'ın II. derecesi; gerilim) pedalları.
- **Ölçü/usul:** **9/8 aksak, 2+2+2+3** (karşılama / Balkan aksağı gruplaması), sekizlik = 252/dk (♩ = 126).
  Darbuka: `D k T k T k D k T` (D = düm, T = tek, k = hafif hayalet vuruş). Klasik Türk müziğindeki "Aksak usulü"nün
  vuruş dizilişini birebir iddia etmez; gruplama yaklaşımıdır.
- **Leitmotif:** 9/8'e oturtulmuş: `| A3(2) B♭3(2) A3(5) | G3(2) F♯3(2) G3(2) E♭3(3) | D3 |`. Gövdede önce iki parça hâlinde
  (A–B♭–A / G–F♯–G–E♭→D), ara bölümde Sol üzerinde dizi, violada tekrar eden aksak sekizliklerle, doruğa tam hâliyle.

## Yapı (tam miks, 78.74 sn; ölçü = 2.143 sn)
| zaman (sn) | bölüm | içerik |
|---|---|---|
| 0.00–4.29 | giriş (2 ölçü) | Re2 timpani rulosu kreşendo, çello tremolo + Re dronu; 2. ölçüde ostinato ve darbuka girer, onaltılık kalkış |
| **4.29–72.86** | **döngü gövdesi (32 ölçü)** | `dongu = [4.285714, 72.857143]` (örnek: 189000–3213000) |
| 4.29–12.86 | ö. 1–4 | çello + kontrbas ostinatosu (Re), darbuka/def aksak, timpani 1. ve 7. sekizlikte, violada hafif oktav |
| 12.86–21.43 | ö. 5–8 | timpani ostinatosu (Re–La), kornoda motif parçası 1 (A–B♭–A), sonra parça 2 (G–F♯–G–E♭ → D) |
| 21.43–30.00 | ö. 9–12 | parça 1 tekrar; 11–12 Sol pedalı, kornoda B♭–C–B♭ / A–G–F♯–G dizisi |
| 30.00–38.57 | ö. 13–16 | davul girer, timpani sekizlikleri; violalar motifi aksak sekizliklerle; kornolar Re–La beşlisi; kalkış |
| 38.57–47.14 | ö. 17–20 | **doruk:** tam motif iki kornoda + violalar, büyük davul; 20. ölçü E♭ gerilimi + timpani dolgusu |
| 47.14–55.71 | ö. 21–24 | E♭/Re dönüşümlü ostinato, korno vurguları (E♭–B♭ / Re–La), çello tremolo, violada motif başı cevapları |
| 55.71–64.29 | ö. 25–28 | **kırılma:** kontrbas, davul, timpani sekizlikleri susar; uzun korno Re, 27. ölçüde motif başı yumuşak |
| 64.29–72.86 | ö. 29–32 | yeniden kuruluş: timpani (29) ve davul (31) döner, violada Re sekizlikleri, kornoda parça 2 → D; son grupta darbuka kalkışı (döngü başına bağlanır) |
| 72.86–78.74 | kapanış | tam ritim + kornoda parça 2; 75.00 sn'de Re unison vuruşu (timpani, büyük davul, davul, def, yaylılar, korno beşlisi), sönüş |

**Vurgu (`akin__vurgu.flac`, 3.9 sn):** iki sekizlik kalkış (çello + darbuka, ikincisinde timpani) → Re unison vuruşu, korno beşlisi söner.

## Katmanlar (toplamları tam miksi verir; fark ≤ 2.4e-7)
- `akin__zemin.flac` – kontrbas + çello spiccato ostinatosu, viola oktav ikilemesi, Re dronu (çello/kontrbas), çello tremolo
- `akin__ritim.flac` – darbuka, def, davul, timpani, büyük davul
- `akin__melodi.flac` – korno motifleri ve vurguları, viola motif sekizlikleri
- Anlatı yoğunken `zemin` + `ritim` tek başına da tam bir savaş nabzı verir; harita okları için `ritim` + `zemin` yeterli.

## Ses kaynakları
- **VSCO 2 CE (CC0):** Cello Section spic (Re3/Sol2/Si2/Fa3/La3, iki hız katmanı × iki rr), Solo Contrabass spic (Re2/Do2/Sol1/Mi2),
  Viola Section spic (Re4/Fa4/La4), F Horn sus + stac, Timpani1/Timpani2 (Re2, La2, Si♭2'ye akort), EthnicLarge dev davul (tokmak).
- **VCSL (CC0):** Darbuka 1/2/3/4/5 (iki hız katmanı × iki rr), Frame Drum (HDrumL açık/boğuk).
- **shared/sfx (CC0):** `muzik/cello_D2`, `muzik/kontrbas_D1`, `muzik/cello_tremolo_D2` (E♭3'e de kaydırıldı), `vurus/timpani_rulo` (Re2'ye pes), `vurus/buyuk_davul_mf`.
- Tam liste: `KAYNAKLAR.tsv` ve `meta.json → kaynaklar`. Ortak oda: mehter ile aynı sabit tohumlu yankı (RT60 ≈ 1.8 sn, 12 ms ön gecikme, %18 ıslak).

## Ölçümler (`meta.json → olcumler`)
| ölçüt | değer | hedef |
|---|---|---|
| RMS (tam / gövde) | −20.19 / −20.10 dBFS | −20 ± 2 |
| tepe | −1.50 dBFS, kırpılma 0 | ≤ −1 |
| > 4 kHz enerji | < %0.01 | ≤ %6 |
| 1.5–4 kHz enerji | %1.3 | "hafif boş" |
| ortalama spektral merkez | 378 Hz | – |
| 250 ms merkez sıçraması | en büyük 0.91 okt, p99 0.80 okt | ≤ ~1 okt |
| 3 sn yoğunluk eğrisi | en büyük ardışık fark 1.53 dB | yumuşak |
| döngü dikişi | gövde periyodik (katlanmış); dikişteki örnek adımı 0.0065 < döngü içi en büyük 0.081; dikiş RMS farkı +1.9 dB (diğer ölçü başları −0.3…+7.5 dB); merkez sıçraması 0.11 okt | kesintisiz |
| vurgu | RMS −21.7, tepe −3.7 dBFS, merkez sıçraması ≤ 0.81 okt | – |

Spektrogram görsel olarak kontrol edildi: yoğun ama tiz bölgede parlak geçici yok; enerji 120–1000 Hz'de, darbuka tek'leri 3 kHz altında.

## Yeniden üretim
`python3 tarih-reels/shared/muzik/akin/uret.py` (≈45 sn; numpy + ffmpeg + git). Örnekler `/tmp/claude-0/sfx` kısmi klonlarından
`git show` ile tek tek çekilir (yoksa klonlanır), önbellek `/tmp/claude-0/muzik-akin/ornek`. Çıktı deterministiktir.

## Bilinen zayıflıklar
- Dinlenemedi; yalnız ölçümlerle doğrulandı. Gerçek zurna/davul takımı yok: orkestral (korno, yaylı, timpani) + darbuka/def karışımı sinematik dil.
- Spektrum bilerek koyu (1.5–4 kHz ≈ %1.3): darbuka ve spiccato "ısırığı" yumuşatıldı; çok tiz sevmeyen kulağa uygun, ama tam bantlı
  dinlemede biraz kapalı gelebilir (`TON` süzgeçleri açılarak ayarlanabilir; merkez sıçraması payı ~0.1 oktav).
- Spiccato notalar yeniden örneklemeyle ±2 yarım sese kadar kaydırıldı; korno notaları legato çapraz geçişle bağlandı.
- E♭ ölçülerinde Re dronu yok (çello tremolo var); 21–24. ölçülerde her ölçü E♭/Re arasında gidip geldiği için ostinato hareketli, dron yok.
- Ritim katmanına yalnız tepe törpüleyici (belleksiz yumuşak diz, −7 dBFS → −3.5 dBFS) uygulandı.
