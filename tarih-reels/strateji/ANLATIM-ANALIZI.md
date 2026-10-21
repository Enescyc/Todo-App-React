# Anlatım dili analizi: Türkçe tarih ve animasyon kanalları → serinin anlatıcı dili

**Amaç:** Bir şeyi 40–50 saniyeye sığdırmak değil, **eğlenceli, dikkat çekici ve sürdürülebilir** bir anlatıcı dili kurmak. Başarılı Türkçe kanalların seslendirme metinlerini (transkript) çıkarıp anlatım tekniklerini ölçeceğiz. Bu teknikleri kendi sesimize çevirip kurguyu buna göre ayarlayacağız.

**Durum (21 Ekim 2026): tamamlandı.** 6 kanal, 46 video analiz edildi; sonuç rehberi: `osmanli-serisi/ANLATICI-DILI.md`.

## Kanallar ve raporlar
| Kanal | Abone | Video | Neden | Rapor |
|---|---|---|---|---|
| Holosen (`@holosen`) | ~590 bin | 5 uzun + 2 Shorts | belgesel biyografi ve tarih, ciddi ses | `anlatim/holosen.md` |
| Yusuf Kayaalp (`@YusufKayaalp`) | ~2,03 M | 6 uzun + 2 Shorts | haritalı hızlı anlatım, mizah, kendi sorup cevaplama | `anlatim/yusuf-kayaalp.md` |
| Bebar Bilim (`@BebarBilim`) | ~1,53 M | 7 uzun + 3 Shorts | anlatı ağırlıklı tarih ve bilim, efsane düzeltme | `anlatim/bebar-bilim.md` |
| Anime Tarih (`@AnimeTarih`) | ~823 bin | 7 uzun (Shorts yok) | haritalı 2D animasyon, görsel dilimize en yakın | `anlatim/anime-tarih.md` |
| Random Animasyon (`@RandomAnimasyon`) | ~491 bin | 6 uzun + 2 Shorts | "olsaydın?" formatı, izleyiciyi sahneye koyma | `anlatim/random-animasyon.md` |
| Harp Tarihi (`@HarpTarihi`) | ~879 bin | 5 uzun + 1 Shorts | Kings & Generals'a en yakın Türkçe kanal, Osman Gazi serisi | `anlatim/harp-tarihi.md` |

## Transkriptleri alma
Kullanıcı ortamın ağ izinlerine YouTube'u ekledi. Bu ortamda çalışan `yt-dlp` bayrakları ve alt ajan adımları: `anlatim/BRIEF.md`. Elle transkript için YouTube'da "Transkripti göster" kopyası da araçla okunur.

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

## Kanal karşılaştırması
Kanal raporlarındaki ortalamalar (araç sürüm 1). "Net hız", 1,5–2 sn'den uzun duraklamalar çıkarılarak altyazının kelime zamanlarından hesaplandı.

| Küme | Net hız (kel/sn) | Ort. cümle | Vurucu % | Soru /100 | Hitap /100 | "Biz" /100 | Taban kip | Sessizlik % | Mizah /dk |
|---|---|---|---|---|---|---|---|---|---|
| Holosen, Shorts | 2,7 | 12,1 | 7 | 0,3 | 0 | 0,9 | -dı (%53), -mış (%33) | ~0 | 0 |
| Holosen, uzun | 2,1 | 13,3 | 9 | 0,2 | 0,4 | 0,8 | -dı / şimdiki / -mış | ~0 | ~0,1 |
| Yusuf Kayaalp | 2,6–2,8 | 9,4 | 27 | 0,9 | 0,7 | 0,9 | -dı (%46) | ~0 | 2–3 |
| Bebar Bilim, tarih | 2,0 | 10,1 | 26 | 0,2 | 0,3 | 1,2 | -dı (%41), -ecekti %9 | 0 | 0,1–0,2 |
| Anime Tarih | 2,0 | 12,8 | 10 | ≈0 | 0,1 | 0,3 | -dı (%70) | **9,6** | ≈0 |
| Random Animasyon, anlatıcı | 2,5 | 7,2 | 39 | 1,4 | ~4 ("sen") | 3,6 | -dı, isim cümlesi | 6 | 0,2–1,4 |
| Harp Tarihi | 2,0 | 13,2 | 8 | 0,05 | 0,15 | 0,9 | -dı (%60), -mıştı | **22** | 0 |
| **Bizim eski metinler** | 2,0 | 8,0–8,8 | 15–43 | 0,9–1,7 | **0** | **0** | geniş zaman (%62) | 0 (yalnız 0,6 sn paragraf arası) | 0 |
| **Hedef** (`ANLATICI-DILI.md` §12) | 2,0 | 7,5–11,5 | 20–40 | 1,0–3,5 | 0,5–2,0 | 0,3–2,5 | -dı; doruk şimdiki | 5–10 | belgeden, ≤ 0,2 |

**Ana sonuçlar:**
1. Belgesel tarih kanallarının hızı Emrullah Uzun'unkiyle aynı (≈2,0 kel/sn). Hızlı kanallarda bu hızı mizah ve skeç taşıyor. Enerjiyi hızdan değil cümle boyundan, dönemeçlerden ve sessizlikten alacağız.
2. Bizim asıl eksiğimiz izleyiciyle ilişki (hitap, "biz", soru) ve anlatı zamanı (yazı dilinin geniş zamanı ve "-dır").
3. Haritalı kanallar haritaya susuyor (Anime Tarih %10, Harp Tarihi %22). Bizde sessizlik yoktu; motor artık paragraf başına `pause` alıyor.
4. Rozet sistemimizin sesli karşılığı kanallarda hazır: "Efsane şöyle:" (Holosen), "Ama bir saniye" (Bebar), "kimilerine göre" (Anime Tarih), "İki anlatım var" (Harp Tarihi). Hiçbir kanal bunları bir sisteme bağlamıyor; bu bizim farkımız olabilir.

## Başlangıç ölçümü: bizim metinlerimiz (21 Ekim 2026)
Araç sürüm 2 (`-yordu`/`-mıştı` geçmiş, `-dır` ayrı sütun). Hedef kontrolü: `python3 shared/tools/anlatim_analiz.py <bölüm>/timeline.js`.

| Bölüm | kelime | ort. cümle | vurucu % | soru /100 | hitap /100 | "biz" /100 | geniş % | "-dır" % | şimdiki % | merak /100 | hedef |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Fragman | 56 | 9.3 | 33 | 3.6 | **0** | 0 | 0 | 0 | 0 | 7.1 | 11/17 |
| Bölüm 1 | 115 | 8.8 | 15 | 1.7 | **0** | 0 | **31** | **31** | 0 | 3.5 | 10/17 |
| Bölüm 2 | 112 | 8.0 | 43 | 0.9 | 0.9 | 0 | **50** | 14 | 0 | 1.8 | 10/17 |

Hız, Emrullah Uzun kaydından ölçülen ~2.0 kelime/sn'dir.

**İlk gözlem:** Metinlerimiz bilgi açısından doğru ve akıcı, ama izleyiciyle konuşmuyor: hitap ve "biz" dili neredeyse sıfır, soru ve merak kalıpları düşük. Olaylar yazı dilinin geniş zamanıyla ve "-dır" ekiyle anlatılıyor; doruk anında şimdiki zamana geçen tek cümle yok.
