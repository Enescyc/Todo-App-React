---
name: tarih-reels-kalite
description: Tarih Reels bölümleri için kalite kapıları ve jüri değerlendirmesi. Araçlar; kontrol.js (sahne başına iletişim tablosu, zor anların kare şeridi, determinizm testi, Instagram güvenli alan taraması), ses_olc.py (LUFS, tepe, tiz, bas→tiz sıçrama, anlatıcı/müzik farkı), FACTS karşılaştırması, 7 boyutlu "sert jüri" rubriği ve yayın render ayarları. "Kontrol et", "gözden geçir", "yayına hazır mı", "render almadan önce bak", "kalite", "jüri", "neden şablon gibi duruyor", "Instagram'da bir şey örtülüyor mu" denildiğinde, render'dan önce ve kullanıcıya video göndermeden önce bu skill'i kullan.
---

# Kalite kapıları

Render pahalıdır: 60 sn'lik yayın render'ı yaklaşık 11 dk sürer. Kullanıcının dikkati daha da pahalıdır. Hataları ucuz aşamada yakala. Her kapıdan sonra bulduğunu düzelt, kapıyı yeniden çalıştır, sonra ilerle.

## Kapı 1: İletişim tablosu (render'dan önce, her zaman)
```bash
NODE_PATH=$(npm root -g) node shared/tools/kontrol.js <bölüm>            # tablo + determinizm + güvenli alan
NODE_PATH=$(npm root -g) node shared/tools/kontrol.js <bölüm> --serit 14.5 18.5 12   # en zor 2–4 saniye
NODE_PATH=$(npm root -g) node shared/tools/kontrol.js <bölüm> --kare 5,22,56          # tam boy kareler
```
`kontrol/tablo.png`'ye kendin bak (Read). Şunları ara:
- **Yazı:** Ekrandan, karttan ya da parşömenden taşıyan, kesilen ya da başka yazıyla çakışan yazı. İmza ve rozet (y 232–330) ile büyük başlıkların çakışması.
- **Güvenli alan:** Kırmızı taranmış bölgelere giren önemli yazı (üst 220, alt 420, sağ 140 px).
- **Okunabilirlik:** Okunmayacak kadar kısa sahne (araç 1.4 sn altını uyarır); karanlıkta kaybolan siluet; zeminden ayrılmayan etiket.
- **Statiklik:** Art arda iki kare neredeyse aynıysa kamera duruyor demektir.
- **Kontrol sonuçları:** Determinizm sonucu "10/10 kare aynı" olmalı; değilse sahnede `Math.random` ya da durum var. Sayfa hatası satırı olmamalı.

Tabloyu kullanıcıya da gönder; kurgu üzerine konuşmanın en hızlı yolu budur.

## Kapı 2: Olgular
Ekrandaki her yazıyı (tarih, ad, unvan, rakam, rozet `src`'si, harita notu) bölümün `FACTS.md`'siyle karşılaştır. Tabloda olmayan ya da ⚪ olan her şey çıkar veya doğrulanır. Rozet doğru mu: 🟡 bir iddiaya BELGE rozeti konmuş mu?

## Kapı 3: Ses
`python3 shared/tools/ses_olc.py <bölüm>`: bütün maddeler ✓ olmalı. Ayrıntı için bkz. `tarih-reels-ses`.

## Kapı 4: Jüri
[references/juri-rubrigi.md](references/juri-rubrigi.md) dosyasındaki 7 boyutu 1–5 puanla. Değerlendirirken kendini sert bir jüri gibi konumla: "temiz ama şablon gibi" bir sonuç başarısızdır. Her boyutta ≥ 4 olmayan bölüm yayına çıkmaz. En düşük iki boyut için somut düzeltme yaz, uygula ve yeniden puanla.

## Kapı 5: Yayın render'ı
```bash
NODE_PATH=$(npm root -g) node shared/render.js <bölüm> <bölüm>/final.mp4 30 --mb 6
```
- **Ayarlar:** PNG kare, CRF 16, bt709; geçişlerde ve `blur` aralıklarında 6 alt kare hareket bulanıklığı.
- **Arka planda çalıştır.**
- **Sonrasında:** `ffprobe` ile süreyi ve ses akışını doğrula. 720p kopyayı kullanıcıya gönder.

## Rapor (kullanıcıya)
```
Kapı 1 – iletişim tablosu: ✓ (2 düzeltme: … )   determinizm 10/10   güvenli alan ✓
Kapı 2 – olgular: 14 ekran yazısı, hepsi FACTS'te (🟢 10, 🟡 3, 🔴 1)
Kapı 3 – ses: −14.0 LUFS, tepe −1.8, tiz %0.1, sıçrama yok, anlatıcı +13 dB
Kapı 4 – jüri: Kanca 5 · Anlatım 4 · Görsel 4 · Hareket 4 · Ses 4 · Doğruluk 5 · Bitiş 4
Dinleyerek onaylamanız gerekenler: …
```
