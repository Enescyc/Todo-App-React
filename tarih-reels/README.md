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
