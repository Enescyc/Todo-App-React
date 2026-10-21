# Storyboard şablonu (SENARYOLAR.md içinde, her bölüm için)

**Bölüm N · Başlık**: Süre hedefi 60–70 sn · Kahraman an: <saniye / çapa> · Renk yayı: <ör. şafak sıcağı → sepya harita → soğuk gri → altın>
**Yasaklar:** parçacık patlaması, RGB kayması, mercek parlaması, neon, ciddi anlarda zıplayan yumuşatma, portre, dönemine uymayan sembol, oyun arayüzü görünümü.

| # | Çapa kelime | ~Süre | Görüntü (ne çizilir, kamera ne yapar) | Amaç (izleyici ne anlar) | Çıkış / taşınan nesne | Rozet | Ses |
|---|---|---|---|---|---|---|---|
| 1 | p1 | 2.5 | Koyu masa; 1299–1922 zaman çizgisi soldan sağa çizilir; kamera yavaş iter | 600 yılın büyüklüğü | Çizginin başındaki "?" → başlık kartı | 🟢 | `trk:rivayet` girişi |
| 2 | p2:Kösedağ'da | 3.0 | Doğu Anadolu haritası; Moğol okları doğudan, Selçuklu oku batıdan; iğne düşer | Çöküşün yeri ve tarihi | İğne → kırık ok çatlağı | 🟢 Kösedağ 1243 | `vurus/buyuk_davul_ff` "yener"de |
| … | | | | | | | |

**Yoğunluk:** 60 sn'de 16–24 satır (bir sahnede birden çok vuruş olabilir). 1.4 sn'den kısa vuruşlar okunmaz.
**Kamera:** Aynı haritayı kullanan ardışık satırlar aynı `camPath` anahtarlarını paylaşır. Uzak atlamalarda `flyTo` kullanılır.
**Altyazıyla çakışma:** Ekran yazısı ile karaoke altyazı (y≈1360) aynı anda aynı şeyi söylemesin. Ekran yazısı başlık, tarih ya da ad olsun; altyazı cümleyi taşısın.
