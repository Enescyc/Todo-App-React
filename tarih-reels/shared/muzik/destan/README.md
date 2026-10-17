# destan – Destansı yükseliş

Seri leitmotifinin büyük, sinematik hali. Sessiz bir girişle başlar, düyek vurgulu bir ostinatoyla kurulur. Motif önce korno ve violalarla tam verilir, sonra keman ve viola oktavında doruğa çıkar. Doruğu ♭II–I (E♭→D) Hicaz kadansı ve geri çekilme izler. Doruk bile anlatımın altında kalacak biçimde ayarlandı: zil ya da crash yoktur, tiz bölge yumuşaktır.

**Kullanım:** fetih ve dönüm noktası anları (Bursa'nın teslimi, Gelibolu'ya geçiş, Kosova, İstanbul'un fethi), sezon finali öncesi doruk, zafer sonrası geniş plan.
**Yoğunluk:** yüksek. ♩ = 76, 4/4. Ostinatonun sekizlik vurguları düyek kalıbındadır (Düm Tek . Tek Düm . Tek .), dorukta timpani de düyek çalar. Ton D, kontrbas D pedalı.

## Dosyalar
| Dosya | İçerik |
|---|---|
| `out/destan__tam.flac` | Tam miks, 81.2 sn (44.1 kHz, stereo, 24 bit) |
| `out/destan__zemin.flac` | Kontrbas D pedalı (faz hizalı döngü), çello dem'i ve armoni kökleri, viola dolgusu, doruk sonu akorları |
| `out/destan__ritim.flac` | Çello spiccato ostinatosu, kontrbas pizz, timpani (D2/A2, rulolar), büyük davul |
| `out/destan__melodi.flac` | Korno (parçalar, tam motif, doruk, yankı), viola unison, dorukta keman oktavı |
| `out/destan__vurgu.flac` | 5.3 sn sting: timpani ve büyük davul, D–A–D yaylı akoru, korno E♭→D. Bölüm sonu ve dönüm noktası vurgusu için. |
| `onizleme.mp3` | Tam miksin 128 kbps MP3'ü |

Üç katmanın toplamı tam miksi verir. Sınırlayıcının kazanç eğrisi üç katmana aynen uygulanır. Anlatım yoğunken `melodi` kapatılabilir; geriye ostinato ve pedal kalır.

**Döngü:** `dongu = [4.736848, 74.210522]` sn, örnek olarak `[208895, 3272684]`. Gövde 22 ölçüdür ve dairesel üretilir. Giriş, gövdenin son 6 vuruşudur: dem ve timpani rulosu yükselerek açılır. Döngü başı, rulonun ostinato başlangıcına bağlandığı yerdir.

## Yapı (tam miks zamanı)
| Zaman | Ölçü | Olay | Ölçü RMS (dBFS) |
|---|---|---|---|
| 0–4.7 sn | giriş | Kontrbas D2 ve çello D3 dem'i, timpani rulosu pp→p | |
| 4.7–17.4 | 1–4 | Çello spiccato ostinatosu (D D D E♭ D D C D, düyek vurgulu), pp→p. Seyrek timpani ve davul. | −30 → −27 |
| 17.4–30.0 | 5–8 | Violalar D (boş beşli) → Gm → C°7 dolgusu, kornoda motif parçaları (ima), kontrbas pizz, timpani düm'leri. 8. ölçüde F♯ üzerinde gerilim ve rulo kresendosu. | −24.5 → −21 |
| 30.0–39.5 | 9–11 | **LEITMOTIF TAM:** korno ve viola unison (A B♭ A G · F♯ G E♭ D). Çellolar armoni köklerini çalar (D–G–D–C · D–G–E♭–D). | −19.5 |
| 39.5–42.6 | 12 | Çellolarda Hicaz dörtlüsü (D E♭ F♯ G), korno A3 çağrısı, rulo kresendosu | −18 |
| 42.6–55.3 | 13–16 | **DORUK:** motif keman (A4–D4), viola ve korno (A3–D3) oktavında. Timpani düyek çalar, büyük davul, ostinatoda oktav katlaması. 16. ölçü D akoru. | −14.3 |
| 55.3–61.6 | 17–18 | E♭ → D (♭II–I) kadansı. Pedal E♭'ye kalkar, dekresendo. | −18.7 → −22.6 |
| 61.6–67.9 | 19–20 | Geri çekilme: korno yankısı (F♯ G E♭ D), viola pp | −25 → −26.5 |
| 67.9–74.2 | 21–22 | Dem ve timpani rulosu (giriş malzemesi), döngü başına bağlanır | −29.7 → −28.5 |
| 74.2–81.2 | kapanış | Yumuşak D2 timpani, D–A–D yaylı dem akoru, korno E♭→D, sönüş. Patlama yok. | |

## Kullanılan örnekler (hepsi CC0, VSCO 2 CE)
Dosya adlarındaki nota bir oktav pestir (C3 = orta do). Bu, ölçümle doğrulandı: `susvib_D2` gerçekte Re3 = 146.9 Hz'dir. `uret.py` buna göre kaydırır.
- Kontrbas SusNV (C1, D1, p/f), Pizz (D1). E1 örneğinin temel frekansı zayıf olduğu için E♭2 de D1'den çekilir.
- Çello grubu: susvib (G1–C3, p/f) ve spiccato (B1, D2, C3; v1/v2, RR1/RR2).
- Viola grubu susvib (C2–C4) ve keman grubu susVib (G2–E4), p/f.
- F korno sus (G1–C3, v1–v3). Dinamik katmanları eşit güçle harmanlanır, böylece p'den f'ye tını da değişir.
- Timpani: Timpani1 (ana kip ≈ 90.5 Hz → D2), Timpani2 (≈ 122 Hz → A2), v1/v3/v4, RR1/2. Rulo için Timpani1 v3/v5 harmanı.
- Büyük davul: BDrumNewhit v1–v7 (hıza göre katman).

Tam liste `KAYNAKLAR.tsv`'dedir; yalnız gerçekten yüklenen 60 dosya yazılır. Bunlar `shared/sfx` içindeki `muzik/*`, `vurus/*` seslerinin kaynağıyla aynı kütüphanedir. Daha fazla nota ve dinamik katmanı gerektiği için özgün dosyalar kullanıldı.

**Ortak oda:** kurulus ile aynı sentetik IR (RT60 ≈ 1.8 sn, sıcak), ıslak oran %18–24. Süzgeçler: kemanlarda ve kornoda 1.9–2.5 kHz'den itibaren −3/−4.5 dB raf ve 3.2–3.8 kHz alçak geçiren; timpani ve davulda 2.5–3 kHz alçak geçiren.

## Kültürel doğruluk (dürüst not)
D Hicaz'a orkestral bir yaklaşımdır ve **12-TET** kullanır (orkestra armonisi için koma uygulanmadı). Armoni Hicaz dizisinden kurulur: D (Hicaz tonik üçlüsü D–F♯–A), Gm, Cm, E♭, C°7 gerilimi ve ♭II–I (E♭→D) kadansı. Düyek usulü yalnız ostinato ve timpani vurgu kalıbı olarak ima edilir; mehter taklidi değildir.

## Ölçümler (`meta.json` → `olcumler`)
| Ölçüt | Değer | Hedef |
|---|---|---|
| RMS | −20.0 dBFS | −20 ± 2 |
| Tepe | −1.2 dBFS (yumuşak sınırlayıcı en çok −1.0 dB) | ≤ −1 |
| Kırpılma | 0 | 0 |
| >4 kHz enerji | %0.01 | ≤ %6 |
| 1.5–4 kHz enerji | %1.3 | düşük |
| 250 ms spektral merkez sıçraması | en çok 0.99 oktav (p95 0.60), 1 oktavı aşan yok | ≤ ~1 |
| 1 sn RMS artışı | gövdede en çok +3.9 dB; tüm dosyada +7.3 dB (girişin sessizlikten ilk saniyesi) | yumuşak |
| Döngü geçişi | örnek adımı yerel en büyük adımın 0.80'i (tık yok); merkez sıçraması 0.08 oktav; 250 ms RMS farkı +2.8 dB | kesintisiz |
| Vurgu | RMS −18.0, tepe −1.6 dBFS, >4 kHz %0.00, merkez sıçraması en çok 0.23 oktav | |

Spektrogram görsel kontrolü `/tmp/claude-0/muzik-destan/spektrogram_*.png` dosyalarıyla yapıldı.

## Yeniden üretim
`python3 tarih-reels/shared/muzik/destan/uret.py` komutu deterministiktir (tohum 1453). Gereksinimler ve örnek çekme yöntemi kurulus ile aynıdır.

## Bilinen zayıflıklar
- Döngü başında +2.8 dB'lik bir RMS farkı var. Bunun nedeni rulonun 1. ölçü vuruşuna bağlanmasıdır, yani müzikal bir vuruştur. Dalga sürekliliği kesintisizdir.
- Legato için iki örnek arasında 0.14 sn çapraz geçiş yapılır (örneğin saldırısı atlanır). Gerçek legato örneği olmadığından korno ve viola geçişleri hafif "yapay" olabilir.
- Doruk (−14 dBFS RMS) gövde ortalamasından yaklaşık 6 dB yüksektir. Anlatım altında motorun ducking'i ya da `melodi` katmanını kısması önerilir.
- Ses dinlenerek değil, nesnel ölçümlerle ayarlandı.
