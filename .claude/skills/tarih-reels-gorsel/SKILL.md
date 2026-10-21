---
name: tarih-reels-gorsel
description: Tarih Reels sahnelerinin (scenes.js) görsel dili ve motor API'si. Kapsam; seri stil kitabı (parşömen/sepya harita, altın Cinzel başlıklar, siluetler, rozetler), zaman haritası (drawTimeMap, sahiplik, tabiiyet taraması), sinematik kamera (camPath log-zoom, flyTo harita atlaması, sürekli hafif itme), yay ve vuruş hareketi, geçişler, Instagram 9:16 güvenli alanları, determinizm ve performans kuralları ve yasaklar listesi. Bir sahne çizilirken ya da güzelleştirilirken, harita, ok, kamera, yazı animasyonu, geçiş, siluet ya da efekt eklenirken, "görüntü kötü/sıkıcı", "kamera dursun/aksın", "Kings & Generals gibi olsun", "yazı taşıyor" denildiğinde bu skill'i kullan.
---

# Görsel dil ve sahne yazımı

Önce [references/stil-kitabi.md](references/stil-kitabi.md) dosyasını oku: serinin malzemesi, rengi, tipografisi, kamera dili ve tuzakları orada. Fonksiyon imzaları için [references/motor-api.md](references/motor-api.md) dosyasına bak.

## Sahne fonksiyonu nasıl yazılır
```js
window.SCENE_FNS = {
  harita(t, s) {                                   // s.t0, s.t1: sahnenin başı/sonu (saniye)
    const tk = C("p2:Kösedağ'da");                 // C = cue: kelimenin başladığı saniye
    const cam = camPath([[s.t0, 900, 40, .7], [tk, 810, 20, 1.1], [s.t1, 800, 20, 1.12]], t, { creep: .02 });
    drawTimeMap(t, cam, 1243.3, { focus: 'SEL', dim: .3 });
    arrow(cam, [CITY['Tebriz'], LL(41.3, 39.95), CITY['Kösedağ']], eIO(seg(t, s.t0 + .2, tk + .3)), 34, '#3a342c');
    mapPin(cam, ...CITY['Kösedağ'], t, tk - .1, 'KÖSEDAĞ', { date: '26 HAZİRAN 1243', left: true });
  },
};
```
- **Her şey `t`'nin saf bir fonksiyonu olmalı.** `Math.random`, `Date`, `performance.now` ve kareler arası durum kullanma; rastgelelik için `rng(tohum)` kullan. Render kareleri sırasız ve paralel çizebilir. `kontrol.js --det` bunu test eder.
- **Döngüsel fazlar için `fract(x)` kullan, `x % 1` kullanma.** JS'te `%` negatif zamanda negatif kalır; bu, eksi yarıçapla `arc` çağrısında render'ı çökertir. Çapadan önce başlayan animasyonlarda zaman farkı negatiftir. Yarıçap ve boyutları `Math.max(0, …)` ile koru.
- **Zamanlamayı kelimelere bağla:** `C('p3:Osman\'dır')`, `seg(t, a, b)` ve `eIO / eOut / eBack / spring`. Sabit saniye yazma; ses gelince her şey kayar.
- **Koordinatlar:** Haritada km (LAEA 29°D/40.5°K) kullan: `CITY['Bursa']`, `LL(boylam, enlem)`. Ekranda 1080×1920 piksel.

## Kamera
- **Kamera durmasın.** Tutuşlarda %2–5 yavaş itme kullan (`camPath(..., { creep: .02 })`). Statik bir harita "slayt" gibi görünür.
- **Ara noktalardan akarak geç.** Anahtar karelerde hız sıfırlanmamalı; zoom log uzayında ilerler. `keyed`/`eIO` yerine `camPath` kullan.
- **Uzak noktalar arası atlama** (Ankara → Kosova) için `flyTo(a, b, eIO(seg(t, t0, t1)))` kullan: uzaklaş, kay, yakınlaş.
- **Aynı haritayı kullanan ardışık sahneler aynı anahtarları paylaşır.** Bir sahnenin son karesi, sonrakinin ilk karesidir; kesme görünmez.
- **Vuruşlar:** `hits[].amp` hem sönümlü sarsıntı hem kısa bir zoom tepmesi üretir. Ciddi anlarda 6–14, yalnız ses için 0. Ayrıca kod yazma.

## Hareket ve yazı
- **Belirme hareketleri:** Rozet, etiket, damga ve ok uçları `spring(t, t0, {freq, damp})` ile belirsin. Hedefi birçok kez değişen değerler `springSeq` ile hareket etsin. Doğal aşma olur ve hareket deterministik kalır.
- **Yazı modları:** `kinetic(s, x, y, boyut, t, t0, {mode: 'letters' | 'slam' | 'fade', fam: F.cinzel})`. Başlıklar Cinzel 900 ve altın olsun, vurucu tek kelimeler Anton slam, açıklamalar Montserrat 800–900.
- **Okunabilirlik:** Ekrandaki yazı en az 8 temiz kare ve 1.2 sn kalsın. Aynı anda tek bir yazı katmanı olsun; altyazıyla aynı cümleyi tekrarlama.
- **Türkçe büyük harf:** `up(s)` kullan; `toUpperCase` kullanma, "i"yi yanlış çevirir.

## Instagram güvenli alanları (1080×1920)
- **Üst 220 px:** Arayüz üst bölgeyi örter. Seri imzası ve rozetler `SAFE_TOP = 232`'den başlar.
- **Alt 420 px (y > 1500):** Açıklama ve düğmeler var. Altyazı y≈1360'ta; "yaklaşık sınırlar" notu `NOTE_Y = 1452`'de.
- **Sağ 140 px:** Beğeni ve paylaşım düğmeleri. Önemli yazıyı sağ kenara dayama.
- Yıl sayacı ve büyük başlıklar y ≥ 400'de dursun, böylece imzayla çakışmazlar.
- `kontrol.js --guvenli` bu bölgeleri tarar.

## Geçişler
- `transitions[].type`: `flash` (önemli an), `dip` (zaman atlaması), `whip` (hızlı yer değişimi), `dive` (haritaya dalış), `rise` (geri çekiliş).
- Mümkünse geçişi bir nesne taşısın: ok, çizgi, iğne, sikke. Çapraz geçiş son çaredir.
- **Bölüm içi bölümler** için mühür damgası ve davul vuruşu kullan (`stamp` + `hits`).

## Performans
- Kare başına ≤ 200 ms hedefle.
- Pahalı çizimleri (sikke yüzü, parşömen, yazı vuruşları) `mkCanvas` ile önbelleğe al; örnekler `gorsel.js`'te `COIN_CACHE` ve `PARCH_CACHE`.
- Harita birimleri `Path2D` önbelleğinde.
- Hareket bulanıklığını yalnızca hızlı anlarda (`blur` aralıkları ve geçişler) render'ın `--mb 6` seçeneğiyle aç.

## Yeni görsel ekleme
- **Bölüme özel çizim** `scenes.js`'te kalır. **Birden çok bölümde kullanılacak** çizim `osmanli-serisi/ortak/gorsel.js`'e girer. Başına tek satırlık açıklama koy; imza `(x, y, ölçek, t, o = {})` biçiminde olsun.
- **Siluet ilkesi:** Gerçek kişi portresi yok. Kişiler nesneyle anlatılır: tuğ, sancak, sikke, mühür, taç, eyer.
- **Geliştirme fırsatları:** Referans depolardan çıkanlar, sırayla: parşömen yırtılması, mürekkep silmesi, kemer/sikke/tuğra biçiminde iris geçişi, kalınlığı değişen mürekkep çizgisi (`inkStroke`) ve saniyede 12 kez kaynayan kontur, OKLab renk karışımı, yıllar arası sınır biçim değişimi (morph). Ayrıntı ve kaynak dosyaları için bkz. `tarih-reels/strateji/REFERANS-DEPOLAR.md`. MIT lisanslı kod taşınırsa telif notu korunur; lisanssız depolardan (PDoomVideo) kod taşınmaz.

## Bitirince
`NODE_PATH=$(npm root -g) node shared/tools/kontrol.js <bölüm>` çalıştır ve `kontrol/tablo.png`'ye kendin bak. Taşma, çakışma, okunmaz kare ya da güvenli alan ihlali varsa düzelt; sonra kullanıcıya göster.
