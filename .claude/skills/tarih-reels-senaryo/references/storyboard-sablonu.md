# Storyboard şablonu (SENARYOLAR.md içinde, her bölüm için)

**Bölüm N · Başlık**: Biçim 90 sn / 2 dk / 3 dk · Kahraman an: <saniye / çapa> · Açık döngü: <açıldığı çapa> → <ödendiği çapa> · Renk yayı: <ör. şafak sıcağı → sepya harita → soğuk gri → altın>
**Yasaklar:** parçacık patlaması, RGB kayması, mercek parlaması, neon, ciddi anlarda zıplayan yumuşatma, portre, dönemine uymayan sembol, oyun arayüzü görünümü.

| # | Çapa kelime | ~Süre | Teknik | Görüntü (ne çizilir, kamera ne yapar) | Amaç (izleyici ne anlar) | Çıkış / taşınan nesne | Rozet | Ses / sessizlik |
|---|---|---|---|---|---|---|---|---|
| 1 | p1 | 2.5 | K2 | Koyu masa; 1299–1922 zaman çizgisi soldan sağa çizilir; kamera yavaş iter | 600 yılın büyüklüğü ve çelişki | Çizginin başındaki "?" → başlık kartı | 🟢 | `trk:rivayet` girişi |
| 2 | p2:Kösedağ | 3.0 | T1 | Doğu Anadolu haritası; Moğol okları doğudan, Selçuklu oku batıdan; iğne düşer | Çöküşün yeri ve tarihi | İğne → kırık ok çatlağı | 🟢 Kösedağ 1243 | `vurus/buyuk_davul_ff` "bozguna"da |
| 3 | p5.end | 2.0 | T15 | Konuşma yok: sınır çizgisi çatlar, kamera geri çekilir | Doruğun ağırlığı | Çatlak → zaman çizgisi | — | `pause: 2` · müzik öne çıkar |
| … | | | | | | | | |

**Teknik sütunu:** `ANLATICI-DILI.md` kodları: K1–K6 kanca, T1–T20 teknik, S1–S5 kapanış. Bir satırda birden çok kod olabilir. Bölümde 6–9 farklı teknik yeterli.
**Yeniden kanca:** Her 15–25 sn'de bir dönemeç (soru, "Ama", "Oysa", "Ta ki" ya da ölçek değişimi). Tabloda bu satırları **kalın** yaz; aralarında 25 sn'den uzun boşluk olmasın.
**Sessizlik:** Harita sessizliği (T15) kendi satırını alır; süresi `timeline.js`'te o paragrafın `pause` alanıdır. 90 sn'lik bölümde 1–2, 2 dk'da 2–3, 3 dk'da 3–4 sessizlik.
**Yoğunluk:** Her 1,5–3,5 sn'de bir görsel vuruş: 90 sn'de 24–36 satır (bir sahnede birden çok vuruş olabilir). 1.4 sn'den kısa vuruşlar okunmaz.
**Kamera:** Aynı haritayı kullanan ardışık satırlar aynı `camPath` anahtarlarını paylaşır. Uzak atlamalarda `flyTo` kullanılır.
**Altyazıyla çakışma:** Ekran yazısı ile karaoke altyazı (y≈1360) aynı anda aynı şeyi söylemesin. Ekran yazısı başlık, tarih ya da ad olsun; altyazı cümleyi taşısın.
