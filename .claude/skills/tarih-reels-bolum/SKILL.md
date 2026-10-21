---
name: tarih-reels-bolum
description: >-
  Tarih Reels (Instagram 9:16, 60–90 sn, animasyonlu Osmanlı/Türk tarihi serisi) bölümlerini uçtan uca üretme akışı. Sıra: araştırma ve FACTS, anlatım metni, storyboard, timeline.js/scenes.js, kontrol tablosu, seslendirme hizalama, ses miksi, render ve jüri. Kullanıcı "yeni bölüm", "Bölüm N'i hazırla", "sıradaki bölüme geç", "Sezon 2'ye başlayalım", "videoyu çıkar / render et", "seslendirme geldi", "bu bölümü yayına hazırla" dediğinde ya da tarih-reels klasöründe bir bölümle ilgili herhangi bir iş yapıldığında bu skill'i mutlaka kullan. Hangi alt skill'in (arastirma, senaryo, gorsel, ses, seslendirme, kalite) ne zaman devreye gireceğini bu skill belirler.
---

# Tarih Reels: bölüm üretim akışı

Bu seri, haritalar ve siluetlerle anlatılan, kaynağa dayalı ve tarafsız bir belgesel dizisidir. Hedef, Kings & Generals kalitesinde anlatım ve görüntü elde etmektir.
Her bölüm kodla çizilir. Görüntü, 1080×1920 deterministik bir canvas ile üretilir; aynı zaman her seferinde aynı kareyi verir. Zamanlama anlatıcının kelimelerine bağlıdır. Müzik ve efektler CC0 kaynaklıdır.

## Kullanıcıyı tanı
Bu kurallar konuşmalardan çıktı. Akışın her adımında geçerlidir.
- **Dil:** Kullanıcıyla Türkçe konuş. Teknik terimleri kısa açıkla.
- **Anlatım:** Akıcı belgesel diliyle yaz. Kesik kesik, liste gibi cümleler beğenilmedi ("Bak bu anlatım dili çok daha iyi" denen üslup, Bölüm 2 Peraşt'taki 6 paragraflık akış). Süre gerekirse uzar, ama bütünlük korunur.
- **Tarafsızlık ve kaynak:** İnalcık, Emecen, Ortaylı gibi Türk tarihçilerin eserleriyle doğrula. Efsaneyi efsane diye söyle.
- **Anlatıcı:** Bütün seride tek anlatıcı var: **Emrullah Uzun** (ElevenLabs v4). Metinler kullanıcıya **parça parça** sunulur. En önemli hedef, bütün serinin olay örgüsünü eksiksiz anlatabilmesidir.
- **Ses:** Kulak tırmalamasın. Bastan sonra çok tiz bir ses gelmesin. Uyumlu bir miks istenir.
- **Hazır kaynaklar:** Hazır asset ve ses kullanılabilir, ama yalnızca CC0 ya da kamu malı olanlar.

## Proje haritası (`tarih-reels/`)
| Yol | Ne |
|---|---|
| `osmanli-serisi/TUM-OLAY-ORGUSU.md`, `SEZON-PLANI.md` | 8 sezonun olay örgüsü, seriyi bağlayan iplikler, hassas başlıklar |
| `osmanli-serisi/sezon-N-*/ARASTIRMA.md`, `OLAY-ORGUSU.md`, `SENARYOLAR.md`, `SESLENDIRME.md` | Sezonun araştırması, kurgusu, metinleri, ElevenLabs metinleri |
| `osmanli-serisi/sezon-N-*/bNN-ad/` | Bölüm klasörü: `timeline.js`, `scenes.js`, `index.html`, `vo/`, `audio/`, `kontrol/` |
| `osmanli-serisi/ortak/sahiplik.js`, `gorsel.js` | Zaman haritası sahiplik tablosu; serinin görsel kitaplığı |
| `shared/engine.js`, `make_audio.py`, `render.js`, `sesler.py` | Motor, ses hattı, render |
| `shared/tools/kontrol.js`, `ses_olc.py` | Kalite kontrol araçları |
| `shared/sfx/`, `shared/muzik/` | CC0 efekt kütüphanesi (48 ses) ve 10 müzik tarzı |
| `strateji/REFERANS-DEPOLAR.md` | Dış referanslardan çıkan dersler |

## Akış ve kapılar
Her aşamanın çıktısı bir sonraki aşamanın girdisidir. Bir kapı geçilmeden sonraki aşamaya geçme. Böylece hatalar ucuzken yakalanır: render'dan sonra fark edilen yanlış bir tarih, bütün videoyu baştan üretmek demektir.

| # | Aşama | Çıktı | Skill | Kapı |
|---|---|---|---|---|
| 1 | Araştırma | `ARASTIRMA.md` bölümü + bölümün `FACTS.md`'si | `tarih-reels-arastirma` | Anlatıma ve ekrana girecek her iddianın kaynağı ve güven rozeti var; ⚪ (doğrulanmamış) iddia yok |
| 2 | Anlatım + storyboard | `SENARYOLAR.md`'de metin (paragraflar) ve storyboard tablosu | `tarih-reels-senaryo` | Kullanıcı metni onayladı (parça parça) |
| 3 | Uygulama | `timeline.js`, `scenes.js`, `index.html` | `tarih-reels-senaryo` + `tarih-reels-gorsel` | Sayfa hatasız açılıyor; çapalar doğru kelimeye oturuyor |
| 4 | Ön kontrol | `kontrol/tablo.png`, şeritler | `tarih-reels-kalite` | İletişim tablosu kullanıcıya gösterildi; taşma, okunmaz kare ya da güvenli alan ihlali yok |
| 5 | Önizleme | Tahmini zamanlamalı ses + `--taslak` render (720p kopya) | `tarih-reels-ses` | Kullanıcıya gönderildi |
| 6 | Seslendirme | ElevenLabs v4 metni → kullanıcı `vo/full.mp3` gönderir → hizalama | `tarih-reels-seslendirme` | Paragraf kesimleri ve hız oranları tutarlı |
| 7 | Final | `make_audio` + yayın render'ı (`--mb 6`) + jüri raporu | `tarih-reels-kalite` | Jüri puanı ≥ 4/5 her boyutta; `ses_olc.py` bütün maddeler ✓ |

Seslendirme gelmeden 1–5 tamamlanabilir. Animasyon, tahmini hece hızıyla (`rate: 6.5`) çalışır; gerçek ses gelince kendiliğinden yeni zamana oturur.

## Komutlar (`tarih-reels/` içinden)
```bash
B=osmanli-serisi/sezon-1-kurulus/b01-kimsenin-yazmadigi-baslangic
NODE_PATH=$(npm root -g) node shared/tools/kontrol.js $B                    # iletişim tablosu + determinizm + güvenli alan
python3 shared/make_audio.py $B                                             # ses (vo/full.mp3 varsa hizalar)
python3 shared/tools/ses_olc.py $B                                          # LUFS, tepe, tiz, anlatıcı/müzik farkı
NODE_PATH=$(npm root -g) node shared/render.js $B $B/onizleme.mp4 30 --taslak   # hızlı önizleme
NODE_PATH=$(npm root -g) node shared/render.js $B $B/final.mp4 30 --mb 6         # yayın (PNG kare, CRF 16, bt709)
ffmpeg -i $B/onizleme.mp4 -vf scale=720:1280 -c:v libx264 -crf 25 -c:a aac -b:a 160k $B/onizleme-720.mp4   # kullanıcıya gönderilecek kopya
```
Uzun render'ları arka planda çalıştır (60 sn'lik bölüm: taslak ~6 dk, yayın ~11 dk). Kullanıcıya dosya göndermek için 720p kopyayı `SendUserFile` ile yolla.

## Yeni bölüm klasörü
1. Aynı sezondaki bir bölümün `index.html` ve `.gitignore` dosyalarını kopyala; yalnız `<title>`'ı değiştir.
2. `timeline.js`'i `tarih-reels-senaryo` skill'indeki şablondan kur.
3. `scenes.js`'te her `scenes[].id` için bir fonksiyon yaz. `C = cue` ve `A(şehir, kayma)` yardımcılarını kullan.

## Git
- Değişiklikleri anlamlı parçalar halinde commit'le ve oturumun dalına push'la.
- Commit mesajı Türkçe ve açıklayıcı olsun. Oturumun istediği ortak yazar satırlarını ekle.
- Git dışında kalanlar: `*.mp4`, `audio/*.wav`, `audio/_*`, `vo/kontrol/`, `kontrol/`, `shared/muzik/*/out/`.
- `audio/final.m4a` önizleme için commit'lenir.

## Sezon sonuna doğru
- Her bölüm bir merak kancasıyla biter ve bir sonraki bölüme bağlanır.
- Bir bölümün son cümlesi başka bir bölümde karşılanacaksa (ör. Bölüm 1 → Bölüm 3) bunu kullanıcıya söyle. Gerekirse kancayı bir sonraki bölüme bağla.
- Sezon finali bir sonraki sezonun sorusunu açar.
