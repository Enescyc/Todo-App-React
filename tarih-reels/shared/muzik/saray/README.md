# `saray` – Saray entrikası / Gerilim

Kapalı kapılar ardında dönen işlerin müziği: altta kesintisiz, pes bir yaylı tremolo; saatin tik-takı gibi yumuşak bir ahşap vuruş; derinde bir nabız (timpani ve kontrbas pizzicato). Bas hattında serinin leitmotifi iki kat yavaş ve karanlık geçer. Üstte viyola ve kemanlar yarım ses sürtüşmeli uzun notalar tutar. Tiz çığlık yoktur: en tiz nota Sol4 (392 Hz). **Yoğunluk: orta.**

**Kullanım:** taht kavgaları ve veraset meseleleri, iç savaş (Bizans iç savaşı 1341–47, Kantakuzenos), Fetret dönemi, kardeş katli, komplo, gizli diplomasi, belirsizlik, "ama bir sorun vardı" dönüş anları. **Dönem:** Sezon 1–7.

## Dosyalar
| Dosya | İçerik |
|---|---|
| `out/saray__tam.flac` | Tam miks, 77.67 sn (44.1 kHz, stereo, 24 bit) |
| `out/saray__zemin.flac` | Pes yaylı tremolo Re2 + Re3, çok hafif kontrbas Re2. Bölümlere göre yavaşça kabarır |
| `out/saray__ritim.flac` | Ahşap tik-tak (her vuruşta), yumuşak timpani Re2, kontrbas pizzicato Re2 (C bölümünde Re–Re–Mi♭–Re) |
| `out/saray__melodi.flac` | Bas leitmotifi (çello grubu + kontrbas unison) ve viyola/keman sürtüşmeleri |
| `out/saray__vurgu.flac` | 4.5 sn karanlık vurgu: timpani ve pizz Re2, Re/Mi♭ tremolo kümesi hızla şişip yavaşça söner, viyola Re4 / keman Mi♭4 |
| `onizleme.mp3` | Tam miksin 128 kbps MP3'ü |

Zemin + ritim + melodi = tam miks (fark −117 dB). Yeniden üretim: `python3 tarih-reels/shared/muzik/saray/uret.py` (deterministik, ~30 sn).

## Yapı
♩ = 72, 4/4. Döngü 20 ölçü = 66.67 sn: **5.0 → 71.667 sn** (örnek olarak 220500 → 3160500; `meta.json` → `dongu_ornek`). Döngü dairesel üretildi: olaylar ve yankı kuyrukları başa sarılır, viyola Re4 pedalı ek yerinin üzerinden geçer. Giriş, döngünün son 5 saniyesinin açılışıdır.

| Tam miks (sn) | Ölçü | Olay |
|---|---|---|
| 0.0–5.0 | (19–20) | **Giriş:** döngü sonu açılır (tremolo 4 sn'de, vurmalılar 2.5 sn'de) |
| 5.0–18.3 | 1–4 **A** | Tremolo + tik-tak; timpani 1. ve 3. ölçüde; viyola Re4 pedalı, 3–4. ölçüde keman Mi♭4 ile sürtüşme |
| 18.3–38.3 | 5–10 **B** | **Leitmotif, bas hattında, tam:** La2–Si♭2–La2–Sol2–Fa♯2–Sol2–Mi♭2–Re2 (♩→𝅗𝅥, 18.3–36.7). Nabız 1. ve 3. vuruşta. Viyola La3 + keman Si♭3 sürtüşmesi |
| 38.3–51.7 | 11–14 **C** | Gerilimin doruğu: pizz her vuruşta Re–Re–Mi♭–Re, timpani 1. ve 3. vuruşta, araya hafif "tak"lar; viyola Re4 + keman Fa♯4 + viyola Sol4 (Fa♯/Sol sürtüşmesi), tremolo en gür (13. ölçü) |
| 51.7–71.7 | 15–20 **D** | **Leitmotif parçalı ve daha koyu** (700 Hz alçak geçiren): La–Si♭–La … Fa♯–Sol–Mi♭–Re (51.7–70.8). Nabız seyrekleşir, viyola Re4 + keman Mi♭4 döner. A'ya yumuşak bağlanır |
| 71.7–77.7 | — | **Kapanış:** vurmalılar durur, son vuruşta yumuşak timpani + pizz Re2, çello+kontrbas Re2 uzun notası, tremolo 72.7'den 77'ye söner |

Bölüm ortalama seviyeleri (0.5 sn RMS): A −22.7, B −19.2, C −19.0, D −19.8 dBFS. Geçişler yumuşaktır: 0.5 sn'de en büyük yükseliş 3.2 dB.

## Müzik dili (dürüst not)
- Re pedalı üzerinde **Hicaz dizisi** (Re–Mi♭–Fa♯–Sol–La–Si♭–Do). Mi♭ +15 sent, Fa♯ −15 sent koma ile verildi; perdeler YIN ile ölçüldü, sapma ≤ 5 sent. Makam seyri yoktur: bu batı orkestrası dilinde, Hicaz renkli bir gerilim müziğidir. Ölçü 4/4'tür, usul kullanılmadı (saat tik-takı hissi).
- Leitmotif, B bölümünde iki kat yavaş ve tam olarak çalar; D bölümünde parçalı ve daha koyudur.
- Yarım ses sürtüşmeleri (Re/Mi♭, La/Si♭, Fa♯/Sol) orta bölgede tutuldu, tiz rafla yumuşatıldı (2.6 kHz alçak geçiren, 1.3 kHz'den −6 dB).

## Ses kaynakları
Tümü **CC0** örnektir; sentez yok, yalnızca işleme var (bkz. `KAYNAKLAR.tsv`):
- **VSCO 2 CE:** çello grubu ve kontrbas tremolo, çello grubu / kontrbas / viyola grubu / keman grubu uzun notaları (en yakın örnekten ≤ 2 yarım ses perde kaydırma; çapraz geçişli döngüyle uzatma), kontrbas pizzicato, yumuşak timpani (≈90 Hz → Re2).
- **VCSL:** slit drum / log drum (ahşap tik-tak). Saldırılar 6–9 ms'lik rampayla yumuşatıldı, 1.8 kHz alçak geçiren uygulandı.
- **shared/sfx:** `muzik/cello_tremolo_D2`.
- Not: VSCO dosya adları gerçek perdenin bir oktav altını yazar (ör. `susvib_D2` = Re3). Perdeler YIN ile doğrulanarak eşlendi.
- Oda: ortak sıcak oda, ≈1.9 sn (orta bölge) → 0.6 sn (tiz) sönüm, %18 ıslak.

## Ölçümler (`meta.json` → `olcumler`)
| Ölçüm | Tam miks | Hedef |
|---|---|---|
| RMS | **−20.0 dBFS** | −20 ± 2 |
| Tepe | **−3.9 dBFS**, kırpılma 0 | ≤ −1 |
| >4 kHz enerji | **%0.00** | ≤ %6 |
| 1.5–4 kHz enerji | **%0.67** | hafif boş |
| Spektral merkez (medyan) | 283 Hz | sıcak / karanlık |
| 250 ms merkez sıçraması (en büyük) | **0.86 oktav** (kapanışın ilk vuruşu). Döngü içinde ≤ 0.73 | ≤ ~1 |
| 0.5 sn'de en büyük yükseliş (gövde) | 3.2 dB | yumuşak |
| Döngü eki: dalga sıçraması | 0.0025 (gövdede örnekten örneğe farkın %99.9'u: 0.031) | kesintisiz |
| Döngü eki: 50 ms RMS farkı | 0.97 dB (gövdede bitişik pencerelerin %95'i: ≤ 1.96 dB) | kesintisiz |

Katmanlar: zemin −23.3, ritim −26.0 (tepe −10.6), melodi −25.3 dBFS. Vurgu: RMS −21.6, tepe −6.4 dBFS. Spektrogramlar `/tmp/claude-0/muzik-saray/*_spektrogram.png` dosyalarına yazılır ve görsel olarak kontrol edildi.

## Bilinen zayıflıklar
- Uzun notalar, örneklerin sürekli bölümünden çapraz geçişli parçalarla uzatıldı. Vibratolu yaylılarda geçişler çok hafif bir koro etkisi yaratabilir. Ses dinlenemediği için kulakla kontrol önerilir.
- `melodi` katmanı tek başına çalınırsa bas motifi ile üst yaylılar arasında tını sıçraması 2.5 oktavı bulur (motif bitip yalnız viyola/keman kaldığında). Zemin açıkken (normal kullanım) en büyük sıçrama 0.86 oktavdır.
- Tremolo yatağı geniş bantlı (yay gürültüsü) ve yoğundur. Çok yoğun anlatımda `zemin` 2–3 dB kısılabilir ya da yalnız `zemin + ritim` kullanılabilir.
- Kontrbas Re2 ve timpani küçük telefon hoparlörlerinde temel frekansıyla değil, harmonikleriyle duyulur. Motifi taşıyan çello olduğu için tanınırlık korunur.
