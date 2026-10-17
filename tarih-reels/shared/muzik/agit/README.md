# `agit` – Ağıt / Çöküş

**Ne anlatıyor:** Yenilgiyi, kaybı, bir dönemin sonunu. Yavaş, seyrek ve derin. Tek bir çello hattı Re pedalının üstünde ağıt söyler. Uzaktan kalp atışına benzer bir nabız duyulur. Sona doğru ney benzeri tek bir nefesli hat gelir. Seri leitmotifi burada **yavaşlatılmış** (nota değerleri iki katı), **minörleşmiş** (F♯ yerine F) ve **yarım kalan** biçimde çalınır: `A3 B♭3 A3 G3 | F3 G3 E♭3 …`. Son nota olan Re hiç gelmez. E♭, Re pedalının üstünde sönerek asılı kalır.

**Kullanım:** Ankara 1402 (Bayezid'in esir düşüşü), Kosova 1389 (Murad'ın ölümü), Süleyman Paşa'nın ölümü, Zigetvar 1566, Viyana 1683, 1922'de saltanatın sonu. Ayrıca sezon finalleri ve "bir dönemin sonu" anlatımı için. Sezonlar: 1, 2, 3, 4, 5, 8.

**Ton / makam (dürüst not):** Merkez Re'dir. Çello ve zemin Re Kürdi/minör rengindedir (D E♭ F G A B♭ C, 12-TET). Ney cümlesi motifin ikinci yarısını Hicaz'a yaklaşan bir renkle tekrarlar: F♯ −15 sent, E♭ +15 sent. Bu gerçek bir makam icrası değil, Hicaz/Kürdi rengine bir yaklaşımdır. Usul kullanılmadı: 4/4, ♩ = 52, serbest rubato.

## Yapı (tam dosya 85.06 sn; ölçü = 4.615 sn)

| Zaman (sn) | Bölüm | İçerik |
|---|---|---|
| 0 – 4.62 | Giriş | Gövdenin son ölçüsü (Re minör zemini) sessizlikten açılır. 2.3 sn'de yumuşak bir kalp atışı duyulur. |
| **4.62** | **Döngü başı** | |
| 4.6 – 10.4 | 1. ölçü | Kontrbas Re pedalı ve yumuşak çello akoru (Dm). Kalp atışı çok seyrektir. |
| 10.4 – 17.3 | 2.–3. ölçü | Çellonun pes iç çekişi: F3 – E♭3 – D3. |
| 23.1 – 46.7 | 5.–9. ölçü | **Leitmotif (yarım kalan).** A3 B♭3 A3 G3, sonra F3 G3 E♭3. Altında ağıt basında inen dörtlü vardır: D – C – B♭ – A (Dm, F/C, Gm/B♭, Aø). 41.5 sn'de bas Re'ye döner, ama melodi E♭'te kalır ve söner. Uzak timpani vuruşları: 23.1, 41.5 ve 60.0 sn. |
| 50.8 – 63.5 | 11.–13. ölçü | Daha yüksekten cevap: D4 C4 B♭3 A3 G3 F3, B♭ ve Gm akorları üstünde. Fa'da asılı kalır. |
| 61.7 – 76.2 | 13.–16. ölçü | **Ney benzeri hat** (uzak, sağda). A4 B♭4 A4 G4 F♯4 G4 E♭4. Altında Aø ve A° akorları çalar. Cümle E♭'te söner ve yine Re'ye inmez. |
| 73.8 – 78.46 | 16. ölçü | Yalnız zemin ve tek bir kalp atışı. Bu ölçü döngü başına kesintisiz bağlanır. |
| **78.46** | **Döngü sonu** | |
| 78.46 – 85.06 | Kapanış | Zemin yavaşça söner. Çellonun kırık son sözü A3 – B♭3 – A3 da söner. Eser La'da açık kalır. |

`vurgu` (5.4 sn): timpani, kalp atışı ve Re pedalı birlikte girer. Çello B♭3 → A3 çalar ve çözülmeden kalır.

## Katmanlar (toplamları tam miksi verir; hata ≤ 1e-16, 24 bit)

- `out/agit__zemin.flac`: kontrbas pedalı ve inen bas, yumuşak çello (v1) akorları.
- `out/agit__ritim.flac`: kalp atışı ve 3 yumuşak timpani. Kalp atışı büyük davul pp örneğidir, ×1.746 hızla D2'ye akortlanmıştır ("lub-dub"). Timpani D2'dedir.
- `out/agit__melodi.flac`: çello (v3) ve ney benzeri hat.
- `out/agit__vurgu.flac`: sting.
- Döngü: `[4.615374, 78.461519]` sn, örnek cinsinden `[203538, 3460153]`. Gövde dairesel olarak üretilir: sona taşan nota kuyrukları ve yankı başa sarar. Bu yüzden döngü örnek düzeyinde kusursuzdur.

## Örnekler ve sentez

- **Hazır CC0 kütüphaneden:** `shared/sfx/muzik/kontrbas_D1`.
- **VSCO 2 CE (CC0):**
  - Cello Section susvib v3, melodi için (G2 B2 D3 F3 A3 C4).
  - Cello Section susvib v1, zemin için.
  - Solo Contrabass SusNV v1 (B♭1, C2).
  - Flute susNV v1 (E4 A4 C5), ney tabanı olarak.
- **VCSL (CC0):** Bass Drum 2 `hit_pp1/pp2` (kalp atışı) ve Timpani 2 `Timpani1B_hit_v3` (D2). Tam liste `KAYNAKLAR.tsv` dosyasında.
- **Perde:** en yakın örnekten en çok ±2 yarım sesle kaydırılır. Okuma değişken hızlıdır (Catmull-Rom). Legatoda yay saldırısı atlanır ve 0.14 sn portamento uygulanır. Uzun notalar faz hizalı, eş-güç örtüşmeli tanelerle uzatılır (WSOLA benzeri).
- **Ney:** gerçek flüt örneği kesintisiz okunur, böylece notalar arasında doğal kaydırmalar oluşur. Üstüne şunlar eklenir:
  - perdeye kilitli 2. harmonik (≈ −8 dB) ve 3. harmonik (≈ −17 dB),
  - 1. ve 2. harmoniğe kilitli dar bant nefes gürültüsü ve geniş bant hava sesi (HNR ≈ 14 dB),
  - aşağıdan kayarak giriş, geciken titreşim ve yavaş perde sapması.
- **Ortak oda:** 1.8 sn RT60, %18 ıslak (enerji payı). Tizler hızlı söner. Tohum `ODA_TOHUM = 58`, `rivayet` ile aynıdır. Tohum, yankının dar rezonans tepeleri gam seslerine en az denk gelecek biçimde tarandı. Ney ayrıca 3.2 sn'lik bir "uzaklık" yankısından geçer.
- **Tiz rafı:** çelloda 2 kHz'den −3 dB raf ve 3.8 kHz alçak geçiren süzgeç var.

## Ölçümler (`meta.json` → `olcumler`)

| Ölçüm | Değer | Hedef |
|---|---|---|
| RMS (tam / gövde) | −20.0 / −19.6 dBFS | −20 ± 2 |
| Tepe (örnek / gerçek) | −4.05 dBFS / −4.0 dBTP | ≤ −1 |
| Kırpılma | 0 örnek | 0 |
| > 4 kHz enerji | %0.00 | ≤ %6 |
| 1.5–4 kHz enerji | %1.06 | düşük |
| 250 ms spektral merkez sıçraması | en çok 0.77, p99 0.63 oktav | ≤ ~1 oktav |
| Ortalama spektral merkez | 335 Hz (aralık 150–521) | |
| Döngü eklemi | örnek sıçraması 0.0136 (gövdedeki tipik p99 değeri 0.0243'tür); RMS son/baş 250 ms −23.8 / −24.2 dBFS; merkez farkı 0.46 oktav | kesintisiz |
| Entegre yükseklik | −17.7 LUFS | |
| Vurgu | RMS −20.4, tepe −5.5 dBFS, > 4 kHz %0 | |

Spektrogram ve dalga biçimi: `/tmp/claude-0/muzik-agit/` (git dışı). Görsel olarak kontrol edildi. Ayrıca perde izlemeyle notalar doğrulandı: çello ve ney doğru perdede, koma değerleri F♯4 ≈ −15 sent ve E♭4 ≈ +14 sent.

## Yeniden üretme

`python3 tarih-reels/shared/muzik/agit/uret.py` komutu deterministiktir (sabit tohum) ve yaklaşık 45 sn sürer. Gerekenler numpy ve ffmpeg. Ayrıca VSCO-2-CE ve VCSL kısmi klonları gerekir. Bunlar `CC0_KLON` ortam değişkeninden okunur (varsayılan `/tmp/claude-0/sfx`). Klon yoksa betik `git clone --filter=blob:none --no-checkout` komutunu yazdırır. Eksik dosyaları `git checkout` ile kendisi indirir.

## Bilinen zayıflıklar

- **"Solo çello" aslında çello grubudur.** CC0 setlerde solo çello yok, bu yüzden tını içli bir soloya göre daha geniştir.
- **Ney sentetik bir yaklaşımdır.** Flüt örneğine harmonik ve nefes eklendi. Gerçek neyin üfleme saldırısı ve perde oyunları yoktur.
- **Kalp atışı telefon hoparlöründe duyulmayabilir.** 73 Hz'tedir ve bu hoparlörler o kadar pesi vermez. Kulaklıkta hafif bir nabız olarak duyulur. Re pedalıyla aynı perdede olduğu için kısmen örtülür; bu bilerek seçildi ("çok hafif" istendi).
- **Bas ağırlığı yüksek.** Enerjinin yaklaşık %21'i 80 Hz altındadır. Ağıt için seçildi, ama gerekirse zemin katmanı kısılabilir.
- **Bazı sıçramalar sınıra yakın.** Çello, yalnız zeminin çaldığı ölçülerden sonra girince spektral merkez 0.6–0.8 oktav sıçrıyor. Bu, sınırın (1 oktav) altında.
- **Ses dinlenmedi.** Bütün denetim nesnel ölçümlerle, spektrogramla ve perde izlemeyle yapıldı.
