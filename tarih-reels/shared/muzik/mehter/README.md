# mehter – Mehter yürüyüşü

Ağır, görkemli, törensel ordu yürüyüşü. Davulun düm/tek'i, kösün derin vuruşu, nakkare ve yumuşatılmış zil üzerinde
boru dronu ve zurna takımıyla (zurna + kaba zurna, heterofonik) serinin leitmotifi. Anlatımın altında çalacak
şekilde sıcak ve koyu tutuldu: zurna orta perdede, yumuşak; zil bir oktav pes ve düşük seviyede.

**Kullanım:** ordu yürüyüşü, sefer başlangıcı, cülus (tahta çıkış) töreni, alay / ordu toplanması, zafer sonrası geçit.
**Yoğunluk:** orta · **Sezonlar:** 1–6 (mehterin kaldırıldığı 1826'ya kadar; sonrası için "yeniden kuruluş" sahnelerinde de olur).

## Müzikal kimlik (dürüst not)
- **Ton/makam:** Re Hicaz'a yaklaşım (D–E♭–F♯–G–A–B♭–C), zurnada koma renkleri E♭ +15 sent, F♯ −15 sent.
  Miyan bölümünde Sol üzerinde **Rast rengi** (Si −15 sent "segah" ile) sonra Hicaz'a dönüş. Dron/boru 12-TET.
- **Usul:** **düyek'e yaklaşım** – 8/8: düm(1) tek(2) · tek(4) düm(5) · tek(7) · ; 4/4 ölçü olarak yazıldı, ♩ = 84.
  Kös ölçü başlarında (doruğa 3. vuruşta da), nakkare ve zil desenleri serbest/basitleştirilmiş; gerçek mehter icrasının
  süsleme ve vurgu ayrıntılarını iddia etmez.
- **Form:** mehter marşı mantığıyla zemin – nakarat – miyan – dönüş + davul arası.
- **Leitmotif:** zurnada tam hâliyle, 4/4'e uyarlanmış: `| A4 B♭4 A4— | G4 F♯4 G4 E♭4 | D4—— · |` (3 ölçü), ardından cevap cümlesi.

## Yapı (tam miks, 80.00 sn; ölçü = 2.857 sn)
| zaman (sn) | bölüm | içerik |
|---|---|---|
| 0.00–5.71 | giriş (2 ölçü) | Re2'ye akortlu timpani rulosu (kös gürlemesi) kreşendo; boru Re3, sonra La3 kabarır; 2. ölçüde düm + tek-tek kalkışı |
| **5.71–74.29** | **döngü gövdesi (24 ölçü)** | `dongu = [5.714286, 74.285714]` (örnek: 252000–3276000) |
| 5.71–17.14 | A · davul (ö. 1–4) | düyek davul, kös, boru dronu (Re3+La3), çok alçak kontrbas/çello Re pedalı, nakkare 3–4. ölçüde |
| 17.14–28.57 | B · zemin (ö. 5–8) | zurna leitmotifi + cevap (D–E♭–F♯–G–A), kaba zurna bir oktav altta hafif |
| 28.57–40.00 | C · nakarat (ö. 9–12) | motif iki zurna (heterofoni, çarpma süsleri) + kaba zurna, zil her ölçü başı |
| 40.00–51.43 | D · miyan (ö. 13–16) | Sol üzerinde Rast rengi (boru Sol2–Re3), seyrek kös; 15–16'da Hicaz'a iniş |
| 51.43–62.86 | E · doruk (ö. 17–20) | tam kadro motif, kös 1. ve 3. vuruşta, nakkare sekizlikleri, boru uzun notalarla destek, iniş cümlesi |
| 62.86–74.29 | F · davul arası (ö. 21–24) | zurna susar, boru çağrısı (Re3–La3–Re4), davul + kös; son ölçüde tek kalkışı (döngü başına ya da kapanışa bağlanır) |
| 74.29–80.00 | kapanış (2 ölçü) | zurna/kaba zurna kadansı F♯–G–E♭–D, 77.14 sn'de son kös + düm + zil, sönüş |

**Vurgu (`mehter__vurgu.flac`, 4.8 sn):** tek-tek → DÜM + kös + zil + zurna/kaba zurna/boru Re üzerinde, sönüş.

## Katmanlar (toplamları tam miksi verir; fark ≤ 2.4e-7)
- `mehter__zemin.flac` – boru dronu (korno Re3/La3, miyanda Sol2/Re3) + çok alçak kontrbas/çello Re pedalı (sinematik sıcaklık; mehterde yoktur)
- `mehter__ritim.flac` – davul (düm/tek), kös, nakkare, zil
- `mehter__melodi.flac` – zurna ×2, kaba zurna, boru çağrıları
- Anlatı yoğunken: yalnız `zemin` + `ritim`; doruk anları için `melodi` açılır.

## Ses kaynakları
- **VSCO 2 CE (CC0):** zurna = obua (Sus/Vib, v1) ±3 yarım ses kaydırılmış, 2 kHz'de yumuşatılmış; kaba zurna = fagot (vib);
  boru = korno (sus); kös = Timpani1 (Re2'ye akort); davul = "EthnicLarge" dev davul (tokmak = düm, çubuk = tek).
- **shared/sfx (CC0):** `muzik/korno_D2`, `muzik/korno_A2`, `muzik/kontrbas_D1`, `muzik/cello_D2`, `vurus/buyuk_davul_ff/mf`,
  `vurus/timpani_rulo` (Re2'ye pes), `vurus/zil_crash` (**1 oktav pes**, 220 Hz–2.4 kHz bant, ≥14 ms yumuşak saldırı, 0.42 sn susturma, düşük seviye).
- **Sentez:** nakkare (zar kipleri 1 : 1.59 : 2.14 : 2.30 : 2.65 + yumuşatılmış tokmak tıkırtısı, La3/Re4).
- Tam liste: `KAYNAKLAR.tsv` ve `meta.json → kaynaklar`.
- Ortak oda: sabit tohumlu sentetik yankı, RT60 ≈ 2.0 sn (bas) / 1.8 sn (orta) / 0.4–1.3 sn (tiz), 12 ms ön gecikme, %18 ıslak, katman başına doğrusal.

## Ölçümler (`meta.json → olcumler`)
| ölçüt | değer | hedef |
|---|---|---|
| RMS (tam / gövde) | −20.00 / −19.83 dBFS | −20 ± 2 |
| tepe | −2.17 dBFS, kırpılma 0 | ≤ −1 |
| > 4 kHz enerji | < %0.01 | ≤ %6 |
| 1.5–4 kHz enerji | %1.2 | "hafif boş" |
| ortalama spektral merkez | 461 Hz | – |
| 250 ms merkez sıçraması | en büyük 0.90 okt, p99 0.83 okt | ≤ ~1 okt |
| 3 sn yoğunluk eğrisi | en büyük ardışık fark 1.07 dB | yumuşak |
| döngü dikişi | gövde periyodik (katlanmış); dikişteki örnek adımı 0.010 < döngü içi en büyük 0.063; dikiş RMS farkı +7.1 dB, diğer ölçü başlarında +1.6…+7.9 dB (vuruş başı); merkez sıçraması 0.13 okt | kesintisiz |
| vurgu | RMS −21.5, tepe −1.1 dBFS, merkez sıçraması ≤ 0.73 okt | – |

Spektrogram (ffmpeg showspectrumpic) görsel olarak kontrol edildi: tiz bölgede parlak geçici yok; kös/düm alçak
bölgede, zurna harmonikleri ~2.5 kHz altında.

## Yeniden üretim
`python3 tarih-reels/shared/muzik/mehter/uret.py` (≈45 sn; numpy + ffmpeg + git). Örnekler `/tmp/claude-0/sfx` kısmi
klonlarından `git show` ile tek tek çekilir (yoksa klonlanır), önbellek `/tmp/claude-0/muzik-mehter/ornek`. Çıktı deterministiktir.

## Bilinen zayıflıklar
- Dinlenemedi; yalnız nesnel ölçümlerle doğrulandı. Zurna gerçek zurna değil: yumuşatılmış obua (kasıtlı olarak sert ve tiz değil);
  kaba zurna fagot, boru korno, kös timpani + büyük davul.
- Spektrum bilerek çok koyu (1.5–4 kHz ≈ %1.2); tam bantlı dinlemede "kapalı" gelebilir. Açmak için `TON["melodi"]["hi"]` yükseltilebilir
  (merkez sıçraması payı ~0.1 oktav, dikkat).
- Notalar yeniden örneklemeyle ±3 yarım sese kadar kaydırıldı (formant kayması); legato geçişler çapraz geçiş + kısa glissando ile.
- Ritim katmanına yalnız tepe törpüleyici (belleksiz yumuşak diz, −6 dBFS → −3 dBFS) uygulandı.
