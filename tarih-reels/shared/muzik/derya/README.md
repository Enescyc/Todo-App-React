# `derya` – Derya / Deniz ve keşif

Kıyıdan açık denize bakan, geniş ve ferah bir zemin. Yaylılar Re–La açık beşlileri üzerinde dalga gibi kabarıp çekilir (6/8 salınım), korno serinin leitmotifini uzun ve geniş notalarla söyler, en altta çok kısık bir deniz dokusu var. Renk umutlu (G/D, C/D: Si ve Mi naturel) ama Re merkezli ve ara ara Hicaz'a göz kırpar (E♭/D, Gm/D). Anlatımın altında **orta yoğunlukta** çalar.

**Kullanım:** Deniz geçişleri (Gelibolu'ya geçiş 1354), Boğaz sahneleri (Rumeli Hisarı, İstanbul Boğazı), donanma ve deniz savaşlarının öncesi/sonrası (Barbaros, Preveze 1538), liman ve kıyı şehirleri, keşif ve genişleme haritaları, Akdeniz hâkimiyeti. **Dönem:** Sezon 1–4.

## Dosyalar
| Dosya | İçerik |
|---|---|
| `out/derya__tam.flac` | Tam miks, 82.0 sn (44.1 kHz, stereo, 24 bit) |
| `out/derya__zemin.flac` | Kontrbas Re pedalı, çello/viyola/keman akorları (dalga dinamiği), deniz dokusu |
| `out/derya__ritim.flac` | Def ile yumuşak 6/8 sallanması (ölçü 9–24) + timpani rulosu kabarmaları (Re, La) |
| `out/derya__melodi.flac` | Viyola karşı ezgisi, kornoda leitmotif, kemanlarda "açık deniz" çizgisi, leitmotif II (keman + korno oktav), korno çağrısı |
| `out/derya__vurgu.flac` | 4.6 sn sting: timpani kabarması + E♭/D → geniş Re majör, kornolar Re3 + La3 |
| `onizleme.mp3` | Tam miksin 128 kbps MP3'ü |

Zemin + ritim + melodi = tam miks (örnek düzeyinde; en büyük fark 2·10⁻¹⁶). Yeniden üretim: `python3 tarih-reels/shared/muzik/derya/uret.py` (deterministik, ~40 sn). Eksik CC0 örnekler `/tmp/claude-0/sfx/{VCSL,VSCO-2-CE}` kısmi klonlarından git ile kendiliğinden indirilir (yol `VCSL_DIR` / `VSCO_DIR` ile değiştirilebilir).

## Yapı (tam miks zaman çizelgesi)
6/8, ♪ = 144 (♩ ≈ 72, ♩. = 48). Bir ölçü 2.5 sn. **Döngü: 5.0 → 75.0 sn** (28 ölçü, 70 sn).
Gövde dairesel üretilir: uzayan notalar, yankı kuyrukları ve dinamik eğrileri gövde başına katlanır, dalga salınımları döngüde tam sayıda periyot yapar. Motor 75.0'dan 5.0'a atladığında dalga, yankı ve legato kesintisizdir. Giriş, gövdenin son iki ölçüsünün 3.5 sn'de açılan hâlidir; bu yüzden girişten gövdeye geçiş de kesintisizdir.

| Zaman (sn) | Ölçü | Olay |
|---|---|---|
| 0.0–5.0 | (27–28) | **Giriş:** deniz ve Re–La pedalı açılır, uzaktan korno çağrısı La3 → Re3 |
| 5.0–15.0 | 1–4 | **Kıyı:** kontrbas + çello Re–La açık beşlisi, deniz dokusu; viyolalar 10.0'da girer, ölçü 3'te G/D |
| 15.0–25.0 | 5–8 | **İlk dalga:** viyola karşı ezgisi La–Si♭–Sol–Fa♯ (leitmotifin büyütülmüş gölgesi) · D → **E♭/D** (Hicaz) → C/D (umut) → D |
| 25.0–40.0 | 9–14 | **Leitmotif, korno:** La3 Si♭3 · La3 · Sol3 Fa♯3 · Sol3 Mi♭3 · Re3 (5 sn). Def 6/8 nabzı başlar; 32.5–36.5 timpani kabarması → 35.0'te kemanlarla Re majöre varış |
| 40.0–50.0 | 15–18 | **Açık deniz:** G/D – D – C/D – D5; kemanlarda Re4–Fa♯4–Sol4/Mi4–Fa♯4; 45–50 korno La3 pedalı, 46.3'te hafif La timpani |
| 50.0–65.0 | 19–24 | **Leitmotif II:** kemanlar La4'ten, korno bir oktav aşağıda; def'e 6/8 öncü vuruş eklenir; 55–63 uzun Re timpani rulosu (doruk ≈ 60 sn) |
| 65.0–75.0 | 25–28 | **Dinginleşme:** D → E♭/D → D5; 70–75 uzak korno çağrısı La3 → Re3 → döngü başına bağlanır |
| 75.0–82.0 | kapanış | **Hicaz kadansı:** E♭/D → D (Fa♯ −15 sent ≈ saf majör üçlü), korno Mi♭3 → Re3, yumuşak Re timpani rulosu, deniz söner (80–82 sn son kısma) |

## Müzik dili ve kültürel doğruluk (dürüst not)
- **Ton:** Re merkezli modal karışım: açık beşli D5, Re majör/Miksolidyen umut renkleri (G/D, C/D) ve Hicaz'dan ödünç E♭/D, Gm/D geçişleri. Bu bir **makam icrası değildir**; Batı orkestrasyonu içinde "Hicaz'a göz kırpma"dır. Leitmotif Re Hicaz'dır (12-TET + koma: Mi♭ +15 sent, Fa♯ −15 sent; koma bütün çalgılarda aynı uygulandı, böylece akorlar içinde çatışmaz).
- **Leitmotif:** Kornoda tam ve özgün hâliyle (♩ → ♩. büyütme: her vuruş 1.25 sn, son Re 4 vuruş). İkinci söyleyişte kemanlarla oktav. Viyola karşı ezgisi (ölçü 5–8) motifin La–Si♭ … Sol–Fa♯ iskeletini önceden duyurur. Kapanış ve vurgu motifin son iki notasıyla (Mi♭ → Re) biter.
- **6/8 ve def:** Belirli bir Türk usulü değildir; denizin sallanmasını veren serbest bir 6/8 nabzıdır (düm – tek – [öncü]). Def çok yumuşak ve alçak geçiren süzgeçlidir.
- **Dalga dinamiği:** Yaylılar 2 ölçüde bir (5 sn) ±2 dB kabarır, her büyük vuruşta ±0.6 dB sallanır; deniz dokusu aynı fazda ±4 dB.

## Ses kaynakları
- **CC0 örnekler** (tam liste `KAYNAKLAR.tsv`): VSCO 2 CE – çello grubu, viyola grubu, keman grubu (susvib, yumuşak v1 katmanı), solo kontrbas (SusVib), F korno (sus v2), timpani rulosu (Timpani3, Re3 ve La2'ye perdelenmiş). `shared/sfx`: `muzik/korno_D2`, `muzik/korno_A2`, `doga/deniz_1`, `doga/deniz_2` (90–900 Hz bant, çok kısık), `ritim/def_buyuk`, `def_boguk`, `def_kucuk`.
- **İşleme (numpy):** örnek perdeleri ölçülerek (YIN) yeniden örnekleme ile ±2 yarım sese kadar perdelendi; legato, notalar arası eşit genlikli çapraz geçişle (yaylı 0.35–0.4 sn, korno 0.22 sn) taklit edildi; uzun notalar sürdürme bölümünün çapraz geçişli döngüsüyle uzatıldı. Ortak oda: bantlara göre sönen gürültü yankısı (≈2.0 sn alçak → 0.6 sn tiz, 12 ms ön gecikme, erken yansımalar), %20 ıslak.

## Ölçümler (`uret.py` her çalıştırmada `meta.json`'a yazar)
| Ölçüm | Tam miks | Hedef |
|---|---|---|
| RMS | **−20.0 dBFS** | −20 ± 2 |
| Tepe | **−3.4 dBFS**, kırpılma 0 | ≤ −1 |
| >4 kHz enerji | **%0.05** | ≤ %6 |
| 1.5–4 kHz enerji | **%2.5** | hafif boş |
| Spektral merkez (medyan) | 400 Hz | sıcak |
| 250 ms merkez sıçraması | en büyük **0.72 oktav** (p99 0.64) | ≤ ~1 |
| Gövdede ardışık 250 ms RMS farkı | en büyük 2.8 dB | yumuşak |
| Döngü eki: dalga sıçraması | 0.0080 (gövdede tipik örnek farkı 0.0078, p99.9 0.043) | kesintisiz |
| Döngü eki: RMS farkı | 250 ms: 0.06 dB · 1 sn: 2.3 dB (dalga salınımı) | kesintisiz |

Katman RMS: zemin −22.8, melodi −24.3, ritim −32.7 dBFS. Grup seviyeleri (gövde RMS'ine göre): yaylı akorlar −3.3, kontrbas −5.7, korno −4.8, keman ezgisi −9.5, viyola ezgisi −12.4, def −12.5, timpani −20.4, deniz −20.5 dB. Vurgu: RMS −18.6, tepe −4.4 dBFS, >4 kHz %0.03, merkez sıçraması 0.33 oktav. Spektrogram `/tmp/claude-0/muzik-derya/spektrogram.png` (log frekans) olarak üretildi ve görsel kontrol edildi: tık/kırpılma yok, enerji 700 Hz altında yoğun, def vuruşları yalnızca soluk dikey çizgiler.

## Bilinen zayıflıklar
- Ses dinlenemedi; yalnızca nesnel ölçümler ve kromagram (perde/akor doğrulaması) ile kontrol edildi. Kulakla kontrol önerilir.
- Legato gerçek bir legato örneği değil, çapraz geçiştir; hızlı geçişlerde hafif "yumuşak yeniden atak" duyulabilir. Korno tek dinamik katmandan (v2) gelir; kabarmalar kazanç eğrisiyle yapılır.
- Tını bilinçli olarak koyu (>4 kHz %0.05). Anlatı olmadan tek başına dinlenirse biraz kapalı gelebilir; gerekirse `melodi` katmanı +2 dB açılabilir.
- Deniz dokusu bir "ocean drum" kaydının süzülmüş hâlidir: dalga sesinden çok uzak bir uğultu/yıkanma hissi verir. Gerçek dalga kaydı ayrı bir efekt olarak eklenebilir.
- Dalga dinamiği (±2 dB / 5 sn) tasarım gereğidir; çok yoğun anlatım altında daha düz bir zemin gerekirse yalnız `zemin` katmanı ve motor tarafında hafif sıkıştırma kullanılabilir.
