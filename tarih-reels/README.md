# Tarih Reels – animasyonlu Türk/Osmanlı tarihi (Instagram 9:16, 30–40 sn)

Her bölüm bir klasör. İlk demo: **`demo-gemiler-karadan/`**, "Gemiler Karadan Yürür" (1453).

## Bölüm yapısı (şablon)
| Dosya | Görev |
|---|---|
| `timeline.js` | Tek kaynak: anlatım satırları, sahneler, geçişler, vuruşlar (darbe + sarsıntı + efekt), seslendirme ayarları |
| `anim.js` | 1080×1920 canvas motoru: harita (K&G tarzı), sinematik sahneler, kinetik yazı, karaoke altyazı, film grenli son işlem |
| `make_audio.py` | numpy ile müzik (hicaz ud, mehter davulu, kös, zil) + efektler + seslendirme miksi (ducking) |
| `render.js` | Headless Chromium → ffmpeg → MP4 |
| `SESLENDIRME.md` | ElevenLabs metni (v3 etiketli + v2 SSML) ve tarihî notlar |

## Üretim akışı
```bash
cd demo-gemiler-karadan
# 1) ElevenLabs çıktısını koy: vo/full.mp3  (veya satır satır vo/01.mp3 … 12.mp3)
python3 make_audio.py            # sesi hizalar/hızlandırır, audio/vo_timing.js + audio/final.wav üretir
NODE_PATH=$(npm root -g) node render.js gemiler-karadan.mp4 30
ffmpeg -i gemiler-karadan.mp4 -c:v libx264 -b:v 7M -maxrate 8M -bufsize 16M -c:a copy gemiler-karadan-instagram.mp4
```
Önizleme: `index.html`'i tarayıcıda açıp "Oynat" (sesli).

**Yeni ses kaydı gelince:** `make_audio.py` konuşma bloklarını sayar. `timeline.js` → `vo.line_seg` her satırın başladığı blok numarasıdır (0'dan başlar). `vo.anchors` önemli vuruşları belirli kelime bloğuna kilitler. Blok sayısı değişirse bu iki listeyi güncelleyin. Animasyon, sesin gerçek zamanlamasına göre otomatik esner.

## Ortak motor (Bölüm 3'ten itibaren) – `shared/`
| Dosya | Görev |
|---|---|
| `shared/engine.js` | Kelime çapalı zamanlama (`"p2:bomba+0.3"`), harita kamerası, domino, K&G okları, karaoke altyazı, geçişler, eski film efekti |
| `shared/data/europe1914.js` | 1914 siyasi sınırları (Natural Earth + ADM1'den `shared/tools/build_europe1914.py` ile üretildi) |
| `shared/make_audio.py <bölüm>` | `vo/p1.mp3…` → gerçek kelime zamanları (hızlandırma yok) + müzik/efekt + ducking miks |
| `shared/render.js <bölüm>` | MP4 render |

Bir bölüm = `timeline.js` (paragraflar + sahne/vuruş/müzik çapaları) + `scenes.js` (sahne çizimleri) + `index.html`.
```bash
python3 shared/make_audio.py bolum-03-birinci-dunya-savasi
NODE_PATH=$(npm root -g) node shared/render.js bolum-03-birinci-dunya-savasi
```

## Osmanlı serisi (Sezon 1'den itibaren) – `osmanli-serisi/`
| Dosya | Görev |
|---|---|
| `shared/data/anadolu_balkan.js` | Anadolu–Balkan–Orta Doğu birimleri (Türkiye/Bulgaristan il, Yunanistan bölge, Sırbistan okrug, diğerleri ülke); komşu sınırları, kıyı, nehirler, doğal göller. `shared/tools/build_anadolu_balkan.py` üretir |
| `osmanli-serisi/ortak/sahiplik.js` | **Zaman haritası:** her birimin yıla göre sahibi (1243–1402, yaklaşık), Osmanlı'ya/Moğollara tabiiyet taraması, tartışmalı tarihler için uzun geçiş |
| `osmanli-serisi/ortak/gorsel.js` | Seri imzası ve bölüm sayacı, güven rozetleri (BELGE/TARTIŞMALI/RİVAYET), başlık ve "sıradaki" kartları, yıl sayacı, harita iğnesi, sikke, parşömen, el yazısı, mürekkep, rüya ağacı, çadır/sancak/tuğ/atlı/Bizanslı tarihçi siluetleri, çatlak ve geri sarma efektleri |
| `shared/engine.js` → `drawTimeMap(t, cam, yıl, {focus, dim})`, `ownerLabels`, `ownCity` | Yıl değiştikçe topraklar yumuşakça el değiştirir; yeni katılan birim parlar |
| `shared/sesler.py` | CC0 kütüphane (`shared/sfx`) ile `lib:*` müzik stilleri (dawn, tension, collapse, dark, rewind, theme, march, dream, byz, sea, battle), leitmotif, ortak oda yankısı + tiz raf. `trk:<tarz>` ile `shared/muzik/<tarz>` parçaları |
| `shared/muzik/` | Seri boyunca kullanılacak müzik tarzları (her biri `uret.py` ile yeniden üretilir; git'e yalnız `onizleme.mp3` girer) |

Bölüm klasörü: `osmanli-serisi/sezon-1-kurulus/bNN-ad/` (`timeline.js` + `scenes.js` + `index.html`). `timeline.js`'te ayrıca `series`, `badges`, `cards`, `risers` alanları; efektler kütüphane kimliğiyle (`'vurus/timpani_alcak'`).
```bash
python3 shared/make_audio.py osmanli-serisi/sezon-1-kurulus/b01-kimsenin-yazmadigi-baslangic   # vo/full.mp3 varsa hizalar
NODE_PATH=$(npm root -g) node shared/render.js osmanli-serisi/sezon-1-kurulus/b01-kimsenin-yazmadigi-baslangic
```
