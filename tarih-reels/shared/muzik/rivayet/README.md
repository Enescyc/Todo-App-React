# `rivayet` – Rivayet / Rüya / Efsane

**Ne anlatıyor:** Osman Bey'in rüyasını, efsaneleri ve "kaynaklar ne diyor?" sorgusunu. Gizemli, rüya gibi ve zamansız. **Ritim yoktur.**

Doku şu katmanlardan oluşur:
- havada asılı kadeh (cam sürtünme) dronu,
- perdeye kilitli "fısıltı" havası,
- alçaltılmış Nepal çanları,
- çok yumuşak bir Re dronu.

Bunların üstünde uzaktan, serbest zamanlı, ney benzeri bir taksim duyulur. Rüyanın ortasında doku geri çekilir. Leitmotif **tek başına, uzaktan ve yarı saydam** biçimde çalar: el çanlarıyla, uzun yankıyla, ince bir cam hâlesiyle. Notaları: `A4 B♭4 A4 G4 | F♯4 G4 E♭4 D4`.

**Kullanım:**
- rüya sahnesi
- Bilecik düğün baskını rivayeti
- demir kafes efsanesi
- bütün "RİVAYET" rozetli anlar
- "kaynaklar ne diyor?" sorgusu
- geçmişe dönüş geçişleri (bunlar için `vurgu` dosyası)

Sezon: 1–8, çünkü rivayet rozeti her sezonda geçebilir.

**Ton / makam (dürüst not):** Merkez Re'dir. Taksim ve motif Hicaz'a yaklaşır: D E♭ F♯ G A B♭ C, E♭ +15 sent, F♯ −15 sent. Dronlar boş beşlidir (Re–La), böylece her renge uyar. Taksim, Hicaz seyrini kabaca izler:
- G (güçlü) çevresinde açılır,
- üst bölgeye (A–B♭–C) çıkar,
- Hicaz dörtlüsünü gösterir (G F♯ E♭),
- D'de karar verir.

Bu gerçek bir taksim değil, kısa ve yazılı bir yaklaşımdır. Usul yok; ♩ = 60 değeri yalnız nominaldir.

## Yapı (tam dosya 79.0 sn)

| Zaman (sn) | Bölüm | İçerik |
|---|---|---|
| 0 – 5.0 | Giriş | Gövdenin sonu sessizlikten açılır: kadeh dronu, fısıltı ve Nepal çanları. |
| **5.0** | **Döngü başı** | |
| 5 – 12 | | Kadeh Re5 ve La4, Re–La–Re fısıltı, alçak Re dronu. 8 sn'de bir flajole damlası düşer. |
| 12.0 – 18.0 | Ney 1 | G4 – A4 – G4. Uzaktan, aşağıdan kayarak açılır. |
| 19.4 – 26.0 | Ney 2 | A4 B♭4 C5 B♭4 A4 (üst bölge). |
| 27.0 – 33.5 | Ney 3 | G4 F♯4 E♭4 F♯4 G4: Hicaz dörtlüsü. Cümle sönerek biter. |
| 31 – 36 | Geri çekiliş | Fısıltı ve kadeh La'sı çekilir. Alçak dron yaklaşık 7 dB düşer. Motiften önce bir "nefes" anı oluşur (dosyanın en sessiz yeri, yaklaşık −25 dBFS). |
| **36.5 – 49** | **Leitmotif** | Tek başına, el çanlarıyla, uzun yankıyla. Altta yalnız kadeh Re5 ve çok alçak bir dron kalır. Hafif rubato vardır. Re4 uzun çınlar. |
| 47 – 51 | Dönüş | Fısıltı ve kadeh La'sı geri gelir. Nepal çanları açılır. 50 sn'de bir flajole damlası düşer. |
| 51.8 – 58.0 | Ney 4 | D5 C5 B♭4 A4 (yumuşak, üstten). |
| 59.6 – 66.5 | Ney 5 | G4 F♯4 E♭4 D4: karar. Uzun Re sönerek biter. |
| 66.5 – 73 | | Yalnız doku ve 68 sn'de bir flajole damlası. Bu kısım döngü başına kesintisiz bağlanır. |
| **73.0** | **Döngü sonu** | |
| 73 – 79 | Kapanış | Doku söner. 73.6 sn'de tek bir el çanı Re4 çalar ve uzun yankıyla biter. |

`vurgu` (5.2 sn), rüyaya geçiş için yazıldı. Önce ters şişme gelir: hava ve kadeh 1.6 sn'de doruğa çıkar. Ardından el çanı ikilisi Re4 + La4 ve bir flajole Re5 duyulur, sonra uzun yankıyla söner.

## Katmanlar

- `out/rivayet__zemin.flac`: kadeh dronu, fısıltı havası, alçak kontrbas ve çello dronu, Nepal çanları.
- `out/rivayet__melodi.flac`: ney taksimi, leitmotif (el çanları) ve flajole damlaları.
- **Ritim katmanı YOK.** Sessiz dosya yazılmadı. `meta.json` içinde `"ritim_katmani": false` ve katman listesinde `ritim: dosya null` olarak belirtildi.
- `out/rivayet__vurgu.flac`: sting.
- Toplam: zemin + melodi = tam. Hata ≤ 1e-16, 24 bit.
- Döngü: `[5.0, 73.0]` sn, örnek cinsinden `[220500, 3219300]`. Gövde dairesel olarak üretilir; sona taşan kuyruklar ve iki yankı başa sarar. Bu yüzden döngü örnek düzeyinde kusursuzdur.

## Örnekler ve sentez

- **Hazır CC0 kütüphaneden:**
  - `doku/kadeh_D#4`: 633 Hz'ten Re5'e ve La4'e kaydırıldı. Bir "yavaş sıkıştırıcı", sürtünme dalgalanmasının yaklaşık %60'ını alır.
  - `doku/fx_uzun_1` ve `doku/fx_uzun_2`: Nepal çanları ×0.4527 hızla (yaklaşık 1.15 oktav) pesleştirildi. Böylece kısmi sesleri La4–Re5–La5 bölgesine oturur ve parıltı yavaşlar. 150 Hz–1.8 kHz bandına süzüldü, yumuşak girişlidir, düşük seviyededir.
  - `muzik/kontrbas_D1`.
- **VSCO 2 CE:** Cello Section susvib v1 (D3, A3) ve Flute susNV v1 (E4, A4, C5), ney tabanı olarak.
- **VCSL:** Hand Chimes D4 E4 F♯4 G♯4 A♯4. Gerçek perdeleri etiketin bir oktav üstündedir. İlk 1.2 sn enerjisine göre eşitlendi. Tokmak sesi 28 ms girişle yumuşatıldı ve 2 kHz'te alçak geçiren süzgeçten geçti (3. derece). Tam liste `KAYNAKLAR.tsv` dosyasında.
- **Sentez:**
  - "Fısıltı": perdeye kilitli ±18 Hz dar bant gürültü, biraz saf ton ve ±4 sent yavaş sapma.
  - Flajole damlaları: saf sinüs ve çok zayıf 2. ve 3. kısmi sesler. 12 ms giriş, yaklaşık 1 sn sönüm.
  - Cam hâlesi: çan notasının üstünde yavaş girişli saf bir ton.
  - Ney: motor ve ayarları `agit` ile aynıdır (flüt örneği, perdeye kilitli 2. ve 3. harmonik, nefes, kayarak giriş, titreşim).
- **Yankı:** ortak oda 1.8 sn ve %18 ıslak, tohum `ODA_TOHUM = 58` (`agit` ile aynı mekân). Uzaklık için ayrıca bir "rüya salonu" var: 4.6 sn RT60, tizler 1.4 sn'de söner. Payı ney ve çanlarda %50, dokuda %45'tir. İki yankının tohumu da gam seslerinde dar rezonans tepesi en az olacak biçimde tarandı (bkz. Bilinen zayıflıklar).

## Ölçümler (`meta.json` → `olcumler`)

| Ölçüm | Değer | Hedef |
|---|---|---|
| RMS (tam / gövde) | −20.0 / −19.7 dBFS | −20 ± 2 |
| Tepe (örnek / gerçek) | −3.52 dBFS / −3.5 dBTP | ≤ −1 |
| Kırpılma | 0 örnek | 0 |
| > 4 kHz enerji | %0.00 | ≤ %6 |
| 1.5–4 kHz enerji | %0.09 | düşük |
| 250 ms spektral merkez sıçraması | en çok 0.41, p99 0.29 oktav | ≤ ~1 oktav |
| Ortalama spektral merkez | 371 Hz (aralık 243–469) | |
| Döngü eklemi | örnek sıçraması 0.0050 (gövdedeki tipik p99 değeri 0.0201'dir); RMS son/baş 250 ms −20.3 / −21.1 dBFS; merkez farkı 0.08 oktav | kesintisiz |
| Entegre yükseklik | −17.5 LUFS | |
| Vurgu | RMS −19.7, tepe −6.3 dBFS, > 4 kHz %0 | |

Spektrogram ve dalga biçimi: `/tmp/claude-0/muzik-rivayet/` (git dışı). Görsel olarak kontrol edildi. Perde izlemeyle motif, taksim notaları ve koma değerleri doğrulandı.

## Yeniden üretme

`python3 tarih-reels/shared/muzik/rivayet/uret.py` komutu deterministiktir. İki ardışık çalıştırmada çıktıların md5 özetleri aynı çıktı. Çalışma yaklaşık 35 sn sürer. Örnekler `CC0_KLON` ortam değişkeninden okunur (varsayılan `/tmp/claude-0/sfx`). Eksik dosyaları betik `git checkout` ile kendisi indirir.

Motor kodu (`ORTAK MOTOR` bölümü) `agit/uret.py` ile birebir aynıdır.

## Bilinen zayıflıklar

- **"Fısıltı" havası tamamen sentezdir.** Dar bant gürültü kulağa rüzgâr ya da ıslık gibi gelebilir. Seviyesi orta.
- **Saf tonlar yankıda renklenir.** Kadeh ve el çanları gibi saf tonlar yankıdan geçince notadan notaya birkaç dB fark oluşur. Tohum seçimi ve neydeki sürekli küçük titreşim bunu azalttı, ama tamamen yok etmedi.
- **Kadeh Re5 dronu döngü boyunca kesintisizdir.** Çok uzun döngülerde yorucu olabilir. Gerekirse zemin katmanı kısılabilir.
- **Ney sentetik bir yaklaşımdır** (`agit` ile aynı not).
- **Leitmotif öncesi bilerek seviye düşer.** 31–36 sn arasında seviye yaklaşık −25 dBFS'e iner ("nefes" anı).
- **Ses dinlenmedi.** Denetim nesnel ölçümlerle, spektrogramla ve perde izlemeyle yapıldı.
