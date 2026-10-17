# kurulus – Uç / Kuruluş teması

Sezon 1–2'nin ana teması. Anadolu bozkırı, göçebe Türkmen uç beyliği, sabah sisi: sakin ama umutlu.
Seri leitmotifi burada **tam ve açık** biçimde, ney benzeri sesle duyulur. Ud/kopuz benzeri telli taksim gibi serbest süsler, yaylı dem altta durur, bendir çok hafiftir.

**Kullanım:** harita açılışları, Söğüt / uç beyliği, belirsiz başlangıçlar, kuruluş anlatısı, sabah / yolculuk / bozkır planları, sezon açılışı.
**Yoğunluk:** düşük. ♩ = 66, 4/4, usul sofyan (Düm . Te Ke). Ton D.

## Dosyalar
| Dosya | İçerik |
|---|---|
| `out/kurulus__tam.flac` | Tam miks, 85.2 sn (44.1 kHz, stereo, 24 bit) |
| `out/kurulus__zemin.flac` | Dem: kontrbas D2 + çello D3/A3 + viola D4, faz hizalı döngü; bozkır rüzgârı |
| `out/kurulus__ritim.flac` | Bendir/def, sofyan, 5–18. ölçüler, çok hafif |
| `out/kurulus__melodi.flac` | Ney benzeri nefesli + ud/kopuz benzeri telli |
| `out/kurulus__vurgu.flac` | 5.2 sn kapanış sting'i: dem akoru, ney E♭→D inişi, hafif bendir |
| `onizleme.mp3` | Tam miksin 128 kbps MP3'ü |

Üç katmanın toplamı tam miksi verir (en büyük fark 4e-7). Motor anlatı yoğunluğuna göre `melodi` ya da `ritim` katmanını kapatabilir.

**Döngü:** `dongu = [5.454535, 78.181814]` sn, örnek olarak `[240545, 3447818]`. Gövde 20 ölçüdür ve dairesel üretilir: her olay, her kuyruk ve yankı döngü başına sarılır. Bu yüzden döngü sonundan başa atlayış kesintisizdir. Giriş, gövdenin son 6 vuruşunun sisin içinden yükselerek açılmasıdır. Kapanış, döngü sonundan sonra gelen ayrı bir sönüştür.

## Yapı (tam miks zamanı)
| Zaman | Ölçü | Olay |
|---|---|---|
| 0–5.5 sn | giriş | Dem kabarır. Telli C→D kayarak açılır, A3 (B♭ çarpmalı), G–F♯–D. |
| 5.5–20.0 | 1–4 | Telli taksim. Serbesttir, Hicaz alt dörtlüsünü dolaşır, F♯→G kaydırma, E♭ çarpma ve tremolo yapar, A'da (güçlü) durur. |
| 20.0–30.0 | 5–7 | **LEITMOTIF, ney ile tam:** A B♭ A G · F♯ G E♭ D. Altta telli dem. Bendir sofyanı girer. |
| 30.9–34.5 | 8 | Telli motif sonunu yankılar (G F♯ E♭ D, tremolo). |
| 34.5–45.5 | 9–11 | Ney süslü ikinci verilişi çalar ve A'da açık biter. Telli bir oktav pesten heterofoni yapar. |
| 45.5–49.1 | 12 | Telli Uşşak renkli köprüyü çalar (E segah −40 sent, F natürel). |
| 49.1–63.6 | 13–16 | Ney gelişmesi: Uşşak renginden Hicaz'a, D5'e umutlu yükseliş, A'da durak. |
| 63.6–70.9 | 17–18 | Motifin ilk yarısını telli, son yarısını (F♯ G E♭ D) ney çalar. Bendirin son düm'ü. |
| 70.9–78.2 | 19–20 | Sakinleşme. Son 6 vuruş giriş malzemesidir ve döngü başına bağlanır. |
| 78.2–85.2 | kapanış | Telli dem akoru (D2–D3–A3), ney E♭→D, tek hafif düm, dem söner. |

## Ses üretimi
- **Ney benzeri nefesli (sentez):** 7 harmonikli sinüs, perdeli nefes ve geniş bant hava gürültüsü kullanılır. Dar bant gürültü, temel ve 2. harmonik taşıyıcılarıyla çarpılır. Cümle başında ön nefes ve "çıf" vardır. Notalar portamentoyla bağlanır (60–110 ms). Gecikmeli vibrato 12–15 sent, yaklaşık 5.1 Hz'dir. Giriş −30 sentten kayar, uzun notalar hafifçe şişer. Süzgeç 160 Hz–3.6 kHz arasındadır.
- **Ud/kopuz benzeri telli (sentez):** Karplus-Strong ile, bloklu ve vektörel işlenir. Her nota çift teldir (±1.5 sent, mızrap 4–9 ms arayla). Mızrap parlaklığı hıza bağlıdır ve sıcak tutulur. Perdesiz kaydırma, tek mızraplı çarpma (süs perdesinde kısa bekleyip hızla iner) ve tremolo yapılır. Armudi gövde rezonansları yaklaşık olarak EQ ile verilir.
- **Dem:** VSCO 2 CE kontrbas (SusNV, D2), çello grubu (D3, A3) ve viola grubu (D4), p dinamikte. Sürekli döngü kararlı bölgeden alınan tanelerle kurulur ve **faz hizalı** kısa çapraz geçişlerle birleştirilir, böylece çukur oluşmaz. Döngü sarma noktası da hizalanır.
- **Bendir/def:** VCSL Frame Drum. Büyük açık vuruş = düm, büyük boğuk = te, küçük boğuk = ke. Her vuruş ±18 sent rastgele perde alır ve 2.6 kHz alçak geçirenden geçer.
- **Rüzgâr:** dairesel süzülmüş gürültü, iki bant (110–480 Hz ve 380–1100 Hz), yavaş periyodik salınım.
- **Ortak oda:** sentetik IR, RT60 ≈ 1.8 sn, tiz bantlar daha hızlı söner, 15 ms ön gecikme, ıslak oran %18–24. Destan da aynı IR'yi kullanır (aynı tohum).

## Kültürel doğruluk (dürüst not)
- Makam **Hicaz'a yaklaşımdır**: perdesiz sazlarda (ney, telli) E♭ +15 sent ve F♯ −15 sent komayla çalınır, yaylı dem yalnız D–A'dır. Uşşak geçişi (E ≈ −40 sent segah, F) Uşşak'ın rengini verir. Gerçek makam seyri değildir, kısa bir renk geçişidir.
- Sofyan usulü, Düm . Te Ke kalıbının basit bir uygulamasıdır. Ney ve ud gerçek kayıt değil, sentezdir: tını yaklaşıktır, yorum ve süsleme kuralları basitleştirilmiştir.
- Klişe "oryantal" kalıplardan (artırılmış ikiliyi sürekli vurgulama, zil/darbuka kalıbı) kaçınılmıştır. Çalgı seçiminde bozkır Türkmen'ine uygun kopuz/ney rengi esas alınmıştır.

## Ölçümler (uret.py sonunda hesaplanır, `meta.json` → `olcumler`)
| Ölçüt | Değer | Hedef |
|---|---|---|
| RMS | −20.0 dBFS | −20 ± 2 |
| Tepe | −4.5 dBFS (sınırlayıcı devrede değil) | ≤ −1 |
| Kırpılma | 0 örnek | 0 |
| >4 kHz enerji | %0.01 | ≤ %6 |
| 1.5–4 kHz enerji | %0.95 | düşük |
| 250 ms spektral merkez sıçraması | en çok 0.89 oktav (p95 0.51), 1 oktavı aşan yok | ≤ ~1 |
| 1 sn RMS artışı (gövde) | en çok +3.6 dB | yumuşak |
| Döngü geçişi | örnek adımı yerel en büyük adımın 0.30'u; 250 ms RMS farkı −0.5 dB; merkez sıçraması 0.09 oktav | kesintisiz |
| Vurgu | RMS −19.0, tepe −6.3 dBFS, >4 kHz %0.01, merkez sıçraması en çok 0.34 oktav | |

Spektrogram görsel kontrolü `/tmp/claude-0/muzik-kurulus/spektrogram_*.png` dosyalarıyla yapıldı (git dışı).

## Yeniden üretim
`python3 tarih-reels/shared/muzik/kurulus/uret.py` komutu deterministiktir (tohum 1299, iki çalıştırmada aynı md5). Gerekenler: numpy, ffmpeg, git. Pillow isteğe bağlıdır ve yalnız spektrogram için kullanılır. CC0 örnekler `SFX_KLON` (varsayılan `/tmp/claude-0/sfx`) altındaki kısmi klonlardan `git checkout` ile çekilir. Klon yoksa `--filter=blob:none` ile klonlanır. Kullanılan örnek dosyalar `KAYNAKLAR.tsv`'de listelenir.

## Bilinen zayıflıklar
- Ney ve ud sentezdir. Gerçek ney'in nefes dokusuna ve ud'un gövde tınısına yaklaşır ama ulaşamaz. Ses dinlenerek değil, yalnız nesnel ölçümlerle ayarlandı.
- Miks bilerek koyu tutuldu (1.5–4 kHz yaklaşık %1). Kulaklıkta "fazla yumuşak" gelirse ney `lp` ve harmonik değerleri biraz açılabilir.
- Dem örnekleri (p dinamikli yaylılar) kendi içinde ±4 dB nefes alır. Bu doğal dalgalanma döngüde de duyulur.
