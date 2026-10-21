# Anlatım dili analizi: Türkçe tarih ve animasyon kanalları → serinin anlatıcı dili

**Amaç:** Bir şeyi 40–50 saniyeye sığdırmak değil, **eğlenceli, dikkat çekici ve sürdürülebilir** bir anlatıcı dili kurmak. Başarılı Türkçe kanalların seslendirme metinlerini (transkript) çıkarıp anlatım tekniklerini ölçeceğiz. Bu teknikleri kendi sesimize çevirip kurguyu buna göre ayarlayacağız.

## Kanallar ve video seçimi
| Kanal | Not | Seçilecek videolar |
|---|---|---|
| Holosen | Kanal bağlantısı kullanıcıdan alınacak (aramada bulunamadı) | Kanal başına 4–6 video: |
| Yusuf Kayaalp | Tarih, "basit bir dille" anlatım (vidIQ: ~1,7 M abone, 2024) | • en çok izlenen 2 video |
| Bebar Bilim | Bilim, uzay ve tarih anlatımı, animasyonlu | • en yeni 2 video |
| (öneri) Anime Tarih, Random Animasyon, Harp Tarihi | Haritalı, 2D animasyonlu tarih anlatımı; bizim görsel dilimize en yakın kanallar | • konumuza en yakın 1–2 video (Osmanlı, Selçuklu, Ortaçağ) |

## Transkriptleri alma
YouTube bu oturumun ağ politikası tarafından engelli (`www.youtube.com` CONNECT 403). Üç yol var:
1. **Ağ izni (önerilen):** Ortam ayarlarında `youtube.com` ve `www.youtube.com` izinli alan adlarına eklenir. Sonra yalnızca otomatik altyazılar indirilir; video inmez:
   `yt-dlp --skip-download --write-auto-subs --sub-langs tr --sub-format vtt <bağlantı>`
2. **Kopyala-yapıştır:** YouTube'da videonun açıklaması → "Transkripti göster" → tümünü seç → kopyala → sohbete yapıştır ya da `.txt` olarak yükle. Satır başlarındaki "0:12" zamanları da işe yarar.
3. **Kendi bilgisayarında yt-dlp:** Yukarıdaki komutla `.vtt` dosyalarını indirip yükle.

**Telif:** Transkriptler yalnızca analiz içindir. `strateji/transkript/` git dışında tutulur. Repoya yalnızca analiz ve kısa örnek alıntılar girer. Kendi metinlerimizde onların cümlelerini değil, tekniklerini kullanırız.

## Yöntem
**1. Nicel ölçüm** (`shared/tools/anlatim_analiz.py`):
- hız (kelime/dk)
- cümle uzunluğu, vurucu (≤5 kelime) ve uzun (>20 kelime) cümle oranı
- soru sıklığı
- izleyiciye hitap ("siz", "bakın", "düşünün")
- "biz" dili
- anlatı zamanı (cümle sonu yüklemine göre: şimdiki / geniş / geçmiş / -mış / gelecek)
- geçiş kelimeleri, merak kalıpları, ünlem, sayı yoğunluğu
- kanca ve kapanış cümleleri

**2. Nitel çözümleme** (her video için aynı şablon):
1. **Kanca (ilk 5–15 sn):** türü (soru, çelişki, şok olgu, bugüne bağ, sahnenin ortasından açılış, kişisel hitap), süresi, vaadi.
2. **Anlatıcı kişiliği:** arkadaş mı, öğretmen mi, belgeselci mi? Mizahın türü (ironi, abartı, modern benzetme, kendiyle dalga) ve dakikadaki sıklığı. Yorum ve yargı düzeyi.
3. **İzleyiciyle ilişki:** doğrudan hitap, soru sorma, tahmin ettirme, "siz olsanız ne yapardınız".
4. **Yapı:** açılış → bağlam → tırmanış → doruk → kapanış. Açık döngüler (cevabı sonraya bırakılan sorular) ve nerede kapandıkları; geleceğe atlama ve geri dönüş.
5. **Ritim:** uzun ve kısa cümle dengesi, tekrarlar, üçlemeler, duraklamalar.
6. **Açıklama araçları:** modern karşılık ("bugünün parasıyla…"), ölçek benzetmesi, sayıyı insanileştirme, kişileştirme, canlandırılan diyalog.
7. **Belirsizlik dili:** tartışmalı ya da efsanevi bilgiyi nasıl söylüyor? (Bizim rozet sistemimizle karşılaştırma.)
8. **Kapanış:** sonraki video kancası, takip çağrısı, şaka ya da düşündürücü cümle.
9. **Süre ve tempo:** toplam süre, bölüm başına süre, ilk 30 saniyede kaç bilgi verildiği.

**3. Çıktılar:**
- **Kanal karşılaştırma tablosu:** teknik × kanal, sıklıklar ve kısa örnekler.
- **`osmanli-serisi/ANLATICI-DILI.md`:** serinin anlatıcı kimliği, dil kuralları, teknik kataloğu, kanca ve kapanış kalıpları, yapı şablonları (90 sn, 2 dk, 3 dk). Önce/sonra örnekleri kendi bölümlerimizden.
- **Kalıcı hale getirme:** `tarih-reels-senaryo` skill'ine anlatıcı dili kuralları ve bir "anlatım puan kartı" girer. Her yeni metin bu kartla ve `anlatim_analiz.py` hedef aralıklarıyla kontrol edilir.
- **Kurgu:** Kesme sıklığı, görsel şakalar ve ekran yazısı anlatım temposuna göre yeniden ayarlanır (`STORYBOARD.md` şablonu güncellenir).
- **Uygulama:** Fragman, Bölüm 1 ve Bölüm 2 metinleri yeni dille yeniden yazılır ve parça parça onaya sunulur.

## Başlangıç ölçümü: bizim metinlerimiz (21 Ekim 2026)
| Bölüm | kelime | kelime/dk | ort. cümle | vurucu % | soru /100 | hitap /100 | "biz" /100 | baskın zaman | merak /100 |
|---|---|---|---|---|---|---|---|---|---|
| Fragman | 56 | 120* | 9.3 | 33 | 3.6 | **0** | 0 | geçmiş / -mış | 7.1 |
| Bölüm 1 | 115 | 120* | 8.8 | 15 | 1.7 | **0** | 0 | geniş zaman (62 %) | 3.5 |
| Bölüm 2 | 112 | 120* | 8.0 | 43 | 0.9 | **0** | 0 | geniş zaman (64 %) | 1.8 |
| 1914 (Bölüm 3) | 210 | 121 | 13.1 | 19 | 0.5 | **0** | 0.5 | geçmiş (69 %) | 1.9 |

\* Hız, Emrullah Uzun kaydından ölçülen ~2.0 kelime/sn'dir.

**İlk gözlem:** Metinlerimiz bilgi açısından doğru ve akıcı, ama izleyiciyle hiç konuşmuyor: hitap ve "biz" dili sıfır, soru ve merak kalıpları düşük. Anlatı "kitap dili" geniş zamanında. Karşılaştırmalı tablo, transkriptler gelince doldurulacak.
