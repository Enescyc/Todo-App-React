# `bizans` – Bizans ilahisi / Konstantinopolis

Taş kubbenin altında, mum ışığında söylenen bir Bizans ilahisi hissi: sürekli bir **ison** (erkek korosunun tuttuğu Re dronu) üzerinde serbest ritimli, tek sesli bir psaltis melodisi; uzaktan, yumuşak bir kilise çanı. Törensel ve ağırbaşlı; anlatımın altında **düşük yoğunlukta** çalar.

**Kullanım:** Bizans sarayı ve imparator, Konstantinopolis / Ayasofya görüntüleri, Bizanslı tarihçilerden alıntılar (Pakhymeres, Gregoras, Kantakuzenos), törensel anlar (Theodora'nın 1346 düğünü, taç giyme, antlaşma), "karşı taraf" tanıtımı. **Dönem:** Sezon 1–2 (1453'e kadar).

## Dosyalar
| Dosya | İçerik |
|---|---|
| `out/bizans__tam.flac` | Tam miks, 81.5 sn (44.1 kHz, stereo, 24 bit) |
| `out/bizans__zemin.flac` | Ison korosu (Re2 + Re3) + çok hafif çello/kontrbas Re |
| `out/bizans__ritim.flac` | **Vuruş yok.** Bu katmanda yalnız seyrek, uzak kilise çanları var (çanlar istenmezse kapatılır) |
| `out/bizans__melodi.flac` | Psaltis melodisi (3 psaltın unisonu, tek sesli çizgi) |
| `out/bizans__vurgu.flac` | 5.5 sn kapanış: koro "a→o→u" şişip söner + çello/kontrbas Re + uzak Re çanı |
| `onizleme.mp3` | Tam miksin 128 kbps MP3'ü |

Zemin + ritim + melodi = tam miks (örnek düzeyinde). Yeniden üretim: `python3 tarih-reels/shared/muzik/bizans/uret.py` (deterministik, ~1.5 dk).

## Yapı (tam miks zaman çizelgesi)
**Döngü: 5.0 → 75.0 sn** (70 sn; örnek olarak 220500 → 3307500, `meta.json` → `dongu_ornek`). Döngü dairesel üretildi: ison seslerinin perde eğrileri döngüde tam sayıda periyot yapar, yankı kuyrukları başa sarılır. Motor 75.0'dan 5.0'a atladığında dalga, yankı ve tını kesintisizdir. Giriş, döngünün son 5 saniyesinin açılışıdır (bu yüzden girişten döngüye geçiş de kesintisizdir).

| Zaman (sn) | Olay |
|---|---|
| 0.0–5.0 | **Giriş:** ison 4.5 sn'de açılır; uzak Re çanı (0.4), La çanı (2.4) |
| 6.2–11.0 | Cümle 1: açılış formülü, Pa–Vou–Ga–Vou–Pa (bir *apeçema*nın hissini verir, birebir değildir) |
| 12.0–21.4 | Cümle 2: Ke'ye (La) yükseliş, omalon süsü, Di (Sol) üzerinde yarım duruş |
| 22.4–31.6 | Cümle 3: doruk, üst Pa'ya (Re4) çıkış |
| 33.0–39.9 | Cümle 4: Pa'ya (Re) kadans. 40.3'te uzak Re çanı |
| **42.2–49.3** | **Cümle 5, leitmotif iması:** La – Si♭ – La – Sol – **Fa♯** – Sol (Hicaz başı, ♩≈0.9 sn, yavaş). Bizans dizisine yabancı Fa♯ ve Si♭ ile yaklaşan Osmanlı teması. |
| 50.0–53.9 | Cümle 6: diyatonik çözülme Fa–Mi–Re (Bizans dünyası geri döner) |
| 55.4–67.3 | Cümle 7: alt Ni'ye (Do3) inen son kadans, Pa'da uzun bitiş |
| 67.3–75.0 | Yalnız ison; Re çanı (70.4), La çanı (72.4) → döngü başına bağlanır |
| 75.0–81.5 | **Kapanış:** son Re çanı (75.35), kısa kadans Ga–Vou–Pa (75.6–80), ison 77'den 81.3'e söner |

## Müzik dili ve kültürel doğruluk (dürüst not)
- **Mod:** Bizans **1. echos'una (Echos protos)** yaklaşım. Pa = Re üzerinde diyatonik dizi; aralıklar Chrysanthine 72 moria sistemine yaklaşık: Vou (Mi) ≈ −33 sent, Zo (Si) ≈ −33 sent, inişte Zo♭ ≈ Si♭. Bu bir **yorumdur**: gerçek bir ilahinin (troparion, heirmos vb.) melodisi değildir, metin yoktur (vokaller hecesiz: a, e, o, ɔ, u).
- **Ison:** Gerçek pratikte isokratlar ison'u melodinin kadans perdesine göre (ör. Ke'ye) taşır. Burada serinin ortak tonal merkezi için ison **hep Pa'da (Re)** kalır.
- **Leitmotif iması:** Hicaz başı (Mi♭ +15, Fa♯ −15 sent koma), plagal 2. echos'un sert kromatik dizisinin de akrabasıdır. Tam motif çalınmaz: yalnızca baş kısmı duyulur, sonra melodi diyatonik Fa–Mi–Re ile Bizans dizisine geri çözülür.
- **Org kullanılmadı:** Ortodoks litürjisi a cappella'dır. Yaylılar koronun 12 dB'den fazla altında yalnızca sıcaklık için var.
- **Unison psaltlar:** Melos birkaç psalt tarafından unison söylenir (baş psalt + iki eşlikçi, −6 dB, 28 ve 43 ms gecikme, ±5 sent). Çizgi tek seslidir.

## Ses kaynakları
- **Sentez (numpy):** Koro ve psaltis **toplamsal formant sentezi** ile üretildi: harmonik başına kaynak eğimi, 5 formantlı kademeli gırtlak modeli ve üst kutup düzeltmesi, vokal geçişleri, portamento, omalon benzeri salınım, alttan yaklaşma, gecikmeli vibrato, perde kayması ve titreme, hafif nefes gürültüsü. Koroda 12 ses var (4 bas Re2, 8 bariton Re3); her sesin kendi kayması ve vibratosu var, nefesler sırayla alınır. Oda: bantlara göre sönen gürültü yankısı (≈3.0 sn alçak → 0.8 sn tiz, 24 ms ön gecikme), %24 ıslak; çanlar %60 ıslak, uzakta duyulsun diye.
- **CC0 örnekler** (bkz. `KAYNAKLAR.tsv`): VSCO 2 CE çello grubu Re3 ve kontrbas Re2 (zemin ve vurgu). `shared/sfx` içinden `can/kilise_cani_D3` (bir oktav pes) ve `can/kilise_cani_C3` (La'ya, 15 yarım ses pes). Çanlara 18 ms yumuşak saldırı, 1.7 kHz alçak geçiren süzgeç ve 700 Hz'den −7 dB tiz raf uygulandı.

## Ölçümler (`uret.py` her çalıştırmada `meta.json`'a yazar)
| Ölçüm | Tam miks | Hedef |
|---|---|---|
| RMS | **−20.0 dBFS** | −20 ± 2 |
| Tepe | **−5.5 dBFS**, kırpılma 0 | ≤ −1 |
| >4 kHz enerji | **%0.00** | ≤ %6 |
| 1.5–4 kHz enerji | **%0.38** | hafif boş |
| Spektral merkez (medyan) | 475 Hz | sıcak |
| 250 ms merkez sıçraması (en büyük) | **0.52 oktav** | ≤ ~1 |
| 0.5 sn'de en büyük yükseliş (gövde) | 4.2 dB (cümle girişi) | yumuşak |
| Döngü eki: dalga sıçraması | 0.0068 (gövdede örnekten örneğe farkın %99.9'u: 0.036) | kesintisiz |
| Döngü eki: 50 ms RMS farkı | 0.5 dB (gövdede bitişik 50 ms pencerelerin %95'i: ≤ 2.0 dB) | kesintisiz |
| Döngü eki: merkez farkı | 0.02 oktav | — |

Katman RMS değerleri: zemin −22.1, melodi −24.0, ritim (çanlar) −40.1 dBFS (tepe −20). Vurgu: RMS −17.9, tepe −4.1 dBFS, 1.5–4 kHz %0.13. Spektrogramlar `/tmp/claude-0/muzik-bizans/*_spektrogram.png` dosyalarına yazılır (alt şeritte 250 ms RMS ve spektral merkez çizgileri var) ve görsel olarak kontrol edildi.

## Bilinen zayıflıklar
- Psaltis ve koro **sentezdir**: unison ve yankı yapaylığı azaltır ama gerçek bir Bizans korosunun ses rengine ulaşmaz. Ses dinlenemediği için yalnızca nesnel ölçümlerle doğrulandı. Kulakla kontrol önerilir, özellikle melodi katmanında.
- Tını bilinçli olarak koyu (1.5–4 kHz yalnızca %0.4). Anlatı yokken yalnız başına çalınırsa biraz "kapalı" gelebilir.
- Çanlar uzak ve kısık. Çan sesi öne çıkarılmak istenirse `ritim` katmanı +3–6 dB yükseltilebilir.
