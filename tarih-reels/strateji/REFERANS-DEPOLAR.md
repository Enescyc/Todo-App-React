# Opus video referans depoları – inceleme (21 Ekim 2026)

8 depo okundu; hiçbirinin kodu çalıştırılmadı ya da kurulmadı. lemo-opuscar, pdoom-video, ClaudeAnimationBase ve opus-video-prompts'u bu oturumun güvenlik politikası klonlatmadı; bu dördünün yalnızca README ve belgeleri okundu.

## Depolar
| Depo | Ne | Lisans | Bize faydası |
|---|---|---|---|
| yihui-dev/awesome-opus5-5-videos | 703 video kaydı + prompt (207'si yalnızca paylaşım metni). Kod ve video yok, skillry.dev'e trafik yönlendiriyor | MIT (liste); prompt ve videolar yaratıcılarına ait | Prompt kalıpları. En yakın örnek `prompts/dotey-927166.md` (Çin medeniyeti kroniği: mühür, hanedan adı, yıl cetveli, dönem süslemeleri) |
| athemeroy/awesome-opus-5-5-videos | 424 paylaşım, 168 ayrıntılı vaka, ~60 analiz belgesi; dürüst bir "abartı denetimi" | CC BY 4.0 (X içeriklerini kapsamaz) | Üretim brifi, kabul kapıları, tarih vakaları (Dan-no-ura: K&G tarzına en yakın) |
| lemomo-ai/lemo-opuscar | Claude Code eklentisi, 51 stil; her biri 11 bölümlü STYLE.md + DIRECTOR.md | MIT (kod), CC BY 4.0 (demo filmler) | **Kurulmayacak** (üçüncü taraf kod ve araç kuruyor). Stil şablonu ve kurallar okunarak kullanılır: Archive Light Table, Satellite Briefing, Copperplate Engraving |
| mexicat/pdoom-video | three.js müzik videosu; Demucs + CTC/Whisper ile şarkı sözü hizalama | MIT (kod); şarkı ve sözler hariç | Hizalama yaklaşımı (zorlamalı hizalama + Whisper kontrolü), alt kare hareket bulanıklığı |
| JohnHeibel/PDoomVideo | p5.js + p5.brush ile 9 bölümlük müzik videosu, STORYBOARD.md ve ANIMATION_GUIDE.md | **LICENSE dosyası yok** → kod kopyalanmaz, yalnızca öğrenilir | Storyboard tablosundaki "Out" (sonraki çekime ne taşınır) sütunu, fırça silme geçişi, temaşa kâğıdı |
| JohnHeibel/ClaudeAnimationBase | El çizimi karakter animasyonu başlangıç kiti | MIT | Çizgi "kaynaması" (boil), iletişim tablosu (contact sheet). p5.brush WebGL ve yavaş, bize uymuyor |
| Vincentwei1021/mg-styles-15 | 15 hareketli grafik stili, kodu ve prompt iskeleti, 7 boyutlu "sert jüri" rubriği | MIT (taşınan dosyada telif notu korunur) | Kamera (log-zoom, uçuş), mürekkep çizgisi, geçişler, render kalitesi. Belgesele uyan stiller: 19-paperclip, 02-line-art, 06-collage |
| joeseesun/opus-video-prompts | 18 Çince prompt, 54 vaka | Lisans yok (yalnızca referans) | `<inputs>/<direction>/<structure>/<build>/<gotchas>/<start>` iskeleti ve "yasaklar listesi" |

## Uygulama planı (öncelik sırasıyla)
1. **Kamera:** `camPath` (x, y ve log(zoom) üzerinde monoton kübik eğri) ve `flyTo` (uzaklaş → kay → yakınlaş; K&G harita atlaması). Anahtar karelerde duraklama olmaz.
2. **Render kalitesi:** JPEG yerine kayıpsız kare, CRF 14–16, bt709 renk etiketi. Yalnızca hızlı oklarda ve geçişlerde 4–8 alt kare hareket bulanıklığı.
3. **Kalite kapısı:** Tam render'dan önce her sahneden bir kareyle iletişim tablosu, en zor 2–4 saniyeden kare şeridi ve "farklı sırayla render aynı kareyi verir" testi.
4. **Ses miksi:** Müzik konuşmanın altında şu an ~−7 dB kısılıyor; −15/−18 dB'e indirilecek. Ses yüksekliği hedefi −14 LUFS; vuruşlar eylemin tam karesine.
5. **Altyazı:** Gerçek fontla ölçülüp Instagram güvenli alanına sığdırılacak. Ekranda en az 1,8 sn ya da "satır + 0,6 sn" kalacak, kelime gri → beyaz geçişle belirecek.
6. **Seri katmanı:** Köşede mühür ya da tuğra (bölüm numarası ve hükümdar adı), altta sürekli akan yıl cetveli. Bölüm geçişlerinde mühür vuruşu + davul. Döneme göre değişen süsleme: Selçuklu yıldızı → İznik çini/saz → Osmanlı barok.
7. **Hareket:** Rozet, etiket ve damgalarda kapalı formda yay (spring) eğrisi; rastgele sarsıntı yerine sönümlü `kick()`; yıl sayacında yuvarlanarak dönen rakamlar.
8. **Geçişler:** Parşömen yırtılması, mürekkep silmesi, kemer/sikke/tuğra biçiminde iris.
9. **Çizgi dili:** Kalınlığı değişen mürekkep çizgisi (`inkStroke`), saniyede 12 kez kaynayan kontur, gravür taraması. Renk geçişleri OKLab'de.
10. **Süreç:** `SENARYO.md`'ye storyboard tablosu (çapa kelime | görüntü | amaç | çıkış | taşınan nesne) ve renk yayı eklenecek. Bütün tarih ve sınırlar için kaynak + güven düzeyli bir `FACTS.md` tutulacak. Her bölüme bir "yasaklar listesi" (parçacık patlaması, RGB kayması, mercek parlaması, neon, zıplayan yumuşatma) ve bir jüri turu.

## Yapılmayacaklar
- Eklenti ya da skill kurmak (üçüncü taraf kod çalıştırır).
- Prompt, video ya da müzik kopyalamak (lisanslar kapsamıyor).
- Mixkit, Pexels ya da Prelinger varlıkları kullanmak (CC0 değil).
- "Tek seferde, insansız" iddialarını doğru kabul etmek: athemeroy vakaları gizli girdileri ve çok sayıda düzeltme turunu belgeliyor.
- "Makul görünen" bir animasyonu doğrulanmış tarih saymak.
