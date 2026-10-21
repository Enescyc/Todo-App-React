# Kanal anlatım analizi – alt ajan brifi

Önce `tarih-reels/strateji/ANLATIM-ANALIZI.md` dosyasını oku: amaç, nitel şablon (9 soru) ve başlangıç ölçümümüz orada.
Proje: Instagram için animasyonlu Osmanlı tarihi serisi (Türkçe, tek erkek anlatıcı, haritalar ve siluetler). Kullanıcının hedefi kısa tutmak değil; **eğlenceli, dikkat çekici, sürdürülebilir bir anlatıcı dili** kurmak. Bu kanallardan teknikleri öğreneceğiz.

## Adımlar (kanal başına)
1. **Video listesi:** Kanaldaki videoları Türkçe başlıklarla al:
   `yt-dlp --flat-playlist --extractor-args "youtube:lang=tr" --print "%(id)s|%(view_count)s|%(duration)s|%(title)s" "https://www.youtube.com/@<kanal>/videos"`
   Görüntülenme bilgisi gelmezse ilk ~60 videonun ayrıntısını `--print` ile tek tek al (yavaş gitmekte sakınca yok).
2. **Seçim (5–6 video):**
   - en çok izlenen 2
   - en yeni 2
   - konumuza en yakın 1–2 (Osmanlı, Selçuklu, Bizans, Ortaçağ, savaş; yoksa genel tarih)
   - kanalın Shorts sekmesi varsa (`/shorts`) en çok izlenen 1–2 Shorts. Biz Instagram Reels yapıyoruz, kısa formdaki tekniği ayrıca görmek önemli.
3. **Transkript:** Video indirme, yalnızca altyazı:
   `yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs "tr,tr-orig,tr.*" --sub-format vtt --extractor-args "youtube:lang=tr" -o "tarih-reels/strateji/transkript/<kanal>/%(id)s.%(ext)s" <url>`
   Elle yazılmış Türkçe altyazı varsa onu tercih et (noktalama içerir). Otomatik altyazıda tekrarlar ve noktalama eksikliği olur; araç tekrarları ayıklar.
4. **Nicel ölçüm:**
   `python3 tarih-reels/shared/tools/anlatim_analiz.py tarih-reels/strateji/transkript/<kanal> --md tarih-reels/strateji/transkript/<kanal>/olcum.md`
5. **Nitel çözümleme:** Transkriptleri oku ve ANLATIM-ANALIZI.md'deki 9 soruyu her video için yanıtla. Zaman damgalarını kullan:
   - kanca kaç saniye sürüyor
   - ilk açık döngü (cevabı sonraya bırakılan soru) nerede açılıp nerede kapanıyor
   - mizah dakikada kaç kez geliyor

## Çıktı: `tarih-reels/strateji/anlatim/<kanal>.md`
- **Künye:** kanal, abone (varsa), seçilen videolar (başlık, süre, görüntülenme, neden seçildi).
- **Nicel tablo:** araç çıktısı ve kanal ortalaması.
- **Anlatıcı profili:** 5–8 cümle.
- **Teknik kataloğu:** Her teknik için ad, ne yapıyor, ne sıklıkla, neden işe yarıyor ve en fazla 1–2 cümlelik kısa örnek alıntı (zaman damgasıyla).
- **Yapı haritası:** Videonun iskeleti (ör. 0:00 kanca → 0:20 bağlam → … → kapanış) ve kısa formla uzun form farkı.
- **Bize ne alınır, ne alınmaz:** Bizim tarafsız ve kaynaklı belgesel çizgimize, Emrullah Uzun'un ciddi ama sıcak sesine ve rozet sistemimize göre.

## Kurallar
- **Telif:** Transkriptlerin tamamını `strateji/transkript/` dışına yazma; o klasör git dışıdır. Analiz dosyasındaki alıntılar kısa olmalı (kanal başına en fazla ~12, her biri en fazla 2 cümle). Amaç teknikleri öğrenmek, cümle kopyalamak değil.
- **Git:** commit ya da push yapma; ana ajan toplar.
- **Ağ:** YouTube'a nazik ol. İstekler arasında 1–2 sn bekle, paralel indirme yapma. HTTP 429 alırsan 30 sn bekleyip bir kez dene.
- Video, ses ya da görüntü indirme; yalnızca altyazı ve meta veri.
- Bir kanalda Türkçe altyazı hiç yoksa bunu yaz ve sonraki videoya geç.
