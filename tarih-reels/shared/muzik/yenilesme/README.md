# `yenilesme` – Yenileşme / Avrupa ile karşılaşma (18.–20. yy)

İki dünyanın sohbeti: Batı oda müziği düzenli bir klavsen figürüyle ve solo kemanın galant bir cümlesiyle "soru sorar"; kanun benzeri bir telli ile ud, serinin leitmotifiyle Re Hicaz'da "cevap verir". Sonra Batı çalgısı (keman) makamla söyler, klavsen bunu Napoliten akorla (E♭ majör = Hicaz'ın 2. derecesi) uyumlar ve iki dünya aynı kadansta (E♭ → Re) buluşur. Son bölümde yumuşak askerî trampet ve alçak yaylı ostinatosuyla müzik 1914'e doğru ciddileşir. Anlatımın altında **orta yoğunlukta** çalar.

**Kullanım:** Reform anlatıları (Lale Devri, matbaa, Nizam-ı Cedid, Tanzimat, Islahat), elçilikler ve Avrupa diplomasisi, saray–Avrupa ilişkileri, Kanun-i Esasi 1876, II. Meşrutiyet 1908, geç dönem haritaları, Bölüm 1914'e giriş (55 sn sonrası ve kapanış). **Dönem:** Sezon 5–8.

## Dosyalar
| Dosya | İçerik |
|---|---|
| `out/yenilesme__tam.flac` | Tam miks, 82.0 sn (44.1 kHz, stereo, 24 bit) |
| `out/yenilesme__zemin.flac` | Klavsen Alberti figürü ve arpejleri, oda yaylıları (çello continuo + viyolalar), kontrbas Re isonu, son bölümde kontrbas/çello sekizlik ostinatosu |
| `out/yenilesme__ritim.flac` | Def ile Sofyan usulü (ölçü 7–12, 15–20), yumuşak askerî trampet (21–27) |
| `out/yenilesme__melodi.flac` | Solo keman (galant cümle + makamla leitmotif), kanun benzeri telli (leitmotif, Hicaz cümlesi, tremolo), ud heterofonisi, son bölümde çello/keman leitmotifi |
| `out/yenilesme__vurgu.flac` | 4.6 sn sting: trampet rulosu + E♭/D kabarması → klavsen Re majör arpeji, kanun Re tremolosu, ud |
| `onizleme.mp3` | Tam miksin 128 kbps MP3'ü |

Zemin + ritim + melodi = tam miks (örnek düzeyinde; en büyük fark 2·10⁻¹⁶). Klavsen bilinçli olarak `zemin`dedir: `melodi` kapatıldığında Batı dokusu (figür) korunur. Yeniden üretim: `python3 tarih-reels/shared/muzik/yenilesme/uret.py` (deterministik, ~45 sn). Eksik CC0 örnekler `/tmp/claude-0/sfx/{VCSL,VSCO-2-CE}` kısmi klonlarından git ile kendiliğinden indirilir.

## Yapı (tam miks zaman çizelgesi)
4/4, ♩ = 96; bir ölçü 2.5 sn. **Döngü: 5.0 → 75.0 sn** (28 ölçü, 70 sn), dairesel üretildi (uzayan notalar ve yankı kuyrukları gövde başına katlanır; döngü eki örnek düzeyinde kesintisiz). Giriş kendi müziğidir ve son 1 sn'de gövdenin son ölçüsüne (aynı A7 figürü + Re pedalı) eşit güçlü çapraz geçişle bağlanır.

| Zaman (sn) | Ölçü | Olay |
|---|---|---|
| 0.0–5.0 | giriş | Klavsen tek başına: Dm Alberti → A7, altında yumuşak Re–La pedalı |
| 5.0–20.0 | 1–6 | **Batı:** klavsen Alberti figürü Dm – Gm/B♭ – A7 – Dm – B♭ – Gm/A, çello continuo + viyolalar; 10.0–20.0 solo keman galant cümlesi, Do♯ (yeden) ile yarım kadans → "soru" |
| 20.0–35.0 | 7–12 | **Doğu cevabı:** Re–La isonu (yaylılar + kontrbas); kanunda leitmotif (20.0–27.5, uzun notalarda tremolo), ud bir oktav aşağıdan heterofoni; 27.5–35.0 Hicaz cümlesi (Re–Mi♭–Fa♯–Sol–La … Do–Re kalışı); def Sofyan |
| 35.0–40.0 | 13–14 | **Sohbet:** klavsen yeniden sorar (Dm → Gm–A7) |
| 40.0–45.0 | 15–16 | Kanun Hicaz sekizlikleriyle cevaplar, Re tremolosu; ud Sol–Fa♯–Mi♭–Re ile ekler |
| 45.0–52.5 | 17–19 | **Buluşma:** solo keman leitmotifi makamla söyler, kanun bir oktav aşağıdan heterofoni; klavsen D – Gm – **E♭ (Napoliten)** – D ile uyumlar; def çok hafif |
| 52.5–55.0 | 20 | İki dünya aynı kadansta: klavsen E♭ → D, kanun ve ud Sol–Fa♯–Mi♭–Re inişi |
| 55.0–70.0 | 21–26 | **Ciddileşme (1914'e doğru):** askerî trampet (55'te seyrek, 60'tan itibaren tam kalıp, kresendo), kontrbas + çello Re sekizlik ostinatosu; leitmotif çellolarda (55.0), sonra kemanlar + çellolar oktav (62.5); Dm–Gm–Cm–D5 / Dm–Gm–E♭–D5; 69.4'te kısa kresendo rulosu |
| 70.0–75.0 | 27–28 | **Geri çekiliş:** trampet diminuendo rulosu (70.0–71.9), Re pedalı; 72.5'ten uzaktan dönen klavsen A7 figürü → döngüde 5.0'daki Dm'ye çözülür |
| 75.0–82.0 | kapanış | E♭/D → D5, çellolarda leitmotifin son iki notası Mi♭3 → Re3, trampet rulosu (75.0–76.2) ve tek vuruş (76.25); 80–82 sn son kısma |

## Müzik dili ve kültürel doğruluk (dürüst not)
- **Batı tarafı:** 18. yy galant/geç barok üslubuna **genel bir yaklaşım** (Alberti figürü, continuo, yeden sesli Re minör kadans); tarihî bir eserden alıntı değildir.
- **Doğu tarafı:** Re **Hicaz'a yaklaşım**, 12-TET + koma (Mi♭ +15 sent, Fa♯ −15 sent; koma bütün çalgılarda aynı). Seyir kısaca Hicaz dörtlüsü (Re–Mi♭–Fa♯–Sol), La'ya çıkış ve Do üzerinden Re'ye kalış ile verildi; tam bir taksim ya da peşrev değildir.
- **Usul:** Doğu bölümlerinde def ile **Sofyan usulüne yaklaşım** (4/4: Düm – Tek – Ka, her ikinci ölçüde hafif süsleme). Gerçek icrada kudüm/bendir/darbuka kullanılırdı; burada serideki `shared/sfx` def örnekleri kullanıldı.
- **Kanun:** Elde CC0 kanun örneği yok. VCSL'deki **Đàn tranh** (Vietnam zitheri; mızrapla çalınan, metal telli bir kanun akrabası) "Normal" ve "Tremolo" örnekleri kullanıldı. VCSL psaltery'nin en pes örneği La♯4 olduğu için Re4 için −8 yarım ses kaydırma gerekirdi; Đàn tranh Re4–Si♭4 aralığını ±1–2 yarım sesle karşılıyor ve daha az tiz enerji taşıyor. Tını kanuna yaklaşır ama aynısı değildir.
- **Ud:** Karplus-Strong sentezi (tutuş noktasında üçgen + hafif gürültü uyarımı, üç uçlu kayıp süzgeci, ≈110/240/480 Hz gövde rezonansları, T60 ≈ 2 sn). Mızrap süslemeleri ve glissando yoktur.
- **Leitmotif:** Kanunda tam (ölçü 7–9), solo kemanda tam ve makamla (17–19), çellolarda ve kemanlarda tam (21–23, 24–26), kapanışta son iki notası (Mi♭ → Re).

## Ses kaynakları
- **CC0 örnekler** (tam liste `KAYNAKLAR.tsv`): VCSL – İngiliz klavseni "lute" registeri (Zuckermann, sustain örnekleri), Đàn tranh Normal/Tremolo, eski bando trampeti (drum3_marching p/pp; 90 Hz–2.6 kHz bant, 6 ms yumuşak atak). VSCO 2 CE – solo keman (Arco Vib, p), çello/viyola/keman grupları (susvib v1), solo kontrbas. `shared/sfx`: `ritim/def_buyuk`, `def_kucuk`, `def_boguk`.
- **Sentez (numpy):** Karplus-Strong ud. Örnek perdeleri ölçüldü (YIN), yeniden örneklemeyle ±2 yarım sese kadar perdelendi. Legato eşit genlikli çapraz geçiş. Ortak oda: derya ile aynı yankı (≈2.0 sn alçak → 0.6 sn tiz, %20 ıslak).

## Ölçümler (`uret.py` her çalıştırmada `meta.json`'a yazar)
| Ölçüm | Tam miks | Hedef |
|---|---|---|
| RMS | **−20.0 dBFS** | −20 ± 2 |
| Tepe | **−1.8 dBFS**, kırpılma 0 | ≤ −1 |
| >4 kHz enerji | **%0.22** | ≤ %6 |
| 1.5–4 kHz enerji | **%4.0** | hafif boş |
| Spektral merkez (medyan) | 443 Hz | sıcak |
| 250 ms merkez sıçraması | en büyük **0.90 oktav** (p99 0.80; kanun girişleri, ölçü 7–12) | ≤ ~1 |
| Gövdede ardışık 250 ms RMS farkı | en büyük 5.7 dB (bir vuruş sonrası sönüm); en büyük yükseliş ≈ 4.6 dB (telli/klavsen atakları) | yumuşak |
| Döngü eki: dalga sıçraması | 0.0087 (gövdede tipik örnek farkı 0.0089, p99.9 0.059) | kesintisiz |
| Döngü eki: RMS farkı | 250 ms: −4.1 dB (1. ölçünün vurgulu ilk vuruşu) · 1 sn: −1.1 dB | kesintisiz |

Katman RMS: zemin −22.2, melodi −24.5, ritim −32.9 dBFS. Grup seviyeleri (gövde RMS'ine göre): yaylı akorlar −4.2, klavsen −5.6, solo keman/kemanlar −7.7, kanun −9.4, çello leitmotifi −9.7, kontrbas −9.8, ud −12.1, trampet −13.1, ostinato −16.4, def −19.0 dB. Vurgu: RMS −19.7, tepe −1.2 dBFS, >4 kHz %0.17, merkez sıçraması 0.39 oktav. Spektrogram `/tmp/claude-0/muzik-yenilesme/spektrogram.png` üretildi ve görsel kontrol edildi (ayrıca 64–78 sn yakın çekim): tık yok; trampet rulolarının tiz enerjisi −50 dB civarında soluk bulutlar olarak görünüyor.

## Bilinen zayıflıklar
- Ses dinlenemedi; yalnızca nesnel ölçümler ve kromagram (perde/akor doğrulaması) ile kontrol edildi. Kulakla kontrol önerilir, özellikle kanun (Đàn tranh) ve Karplus-Strong ud tınısı.
- Klavsen ve telli atakları 250 ms ölçeğinde 4–5 dB'lik doğal dalgalanma yaratır (derya'dan daha "hareketli"). Döngü başındaki 250 ms farkı (−4.1 dB) 1. ölçünün vurgulu ilk vuruşundan gelir; 1 sn ölçeğinde fark 1.1 dB.
- Merkez sıçraması (0.90 oktav) sınıra yakın: Doğu bölümünde kanun girişleri alçak Re isonunun üstünde parlak kalıyor. Daha da yumuşatmak için `melodi` katmanı 1–2 dB kısılabilir.
- Galant keman cümlesi ve trampet kalıbı üslup taklididir; trampet bilinçli olarak uzak ve boğuktur (2.6 kHz alçak geçiren). Daha belirgin bir askerî renk istenirse `ritim` +3 dB açılabilir.
- Giriş, son 1 sn'de gövde sonuna çapraz geçer; bu sırada iki aynı A7 klavsen figürü üst üste biner (kısa bir koro etkisi).
