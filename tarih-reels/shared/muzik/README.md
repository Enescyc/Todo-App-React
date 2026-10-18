# Seri müzik kütüphanesi (10 tarz)

Her tarz kendi klasöründe: `uret.py` (deterministik üretici), `out/` (git dışı; `uret.py` yeniden üretir), `onizleme.mp3`, `meta.json` (yapı, döngü noktaları, ölçümler), `README.md`, `KAYNAKLAR.tsv`.
Bütün örnekler CC0 (Versilian VCSL, VSCO 2 CE, `shared/sfx`) ya da numpy sentezi. Üretim kuralları: [BRIEF.md](BRIEF.md).
**Ortak dil:** hepsi Re merkezli ve aynı **leitmotifi** (Re Hicaz: A B♭ A G | F♯ G E♭ D) kendi kılığında taşır; aynı oda yankısını paylaşır, böylece birbirine kesilerek bağlanabilir.
**Dinleme:** [dinleme-derlemesi.mp3](dinleme-derlemesi.mp3) – her tarzdan ~24 sn ([zaman listesi](dinleme-derlemesi.txt)).

| Tarz | Karakter | ♩ / ölçü | Yoğunluk | Leitmotif | Nerede kullanılır |
|---|---|---|---|---|---|
| `kurulus` | Uç teması: ney + ud/kopuz, bendir, sofyan | 66, 4/4 | düşük | ney ile tam ve açık | harita açılışları, Söğüt, kuruluş, sezon kartları |
| `destan` | Destansı yükseliş: yaylılar, korno, timpani, büyük davul | 76, 4/4 | yüksek | korno + viyola, doruk | fetih ve dönüm noktaları (Bursa, Gelibolu, Kosova, İstanbul) |
| `mehter` | Mehter yürüyüşü (yaklaşım): zurna/boru/kös benzetmesi, düyek | 84, 8/8 | orta | zurnada tam | ordu yürüyüşü, sefer başlangıcı, cülus |
| `akin` | Akın / savaş: 9/8 aksak darbuka, spiccato ostinato | 126, 9/8 | yüksek | kornoda parçalı | meydan savaşları, akıncı okları |
| `derya` | Deniz ve keşif: açık beşliler, 6/8 salınım | 72, 6/8 | orta | kornoda geniş | boğaz geçişleri, donanma, kıyı şehirleri |
| `bizans` | Bizans ilahisi: ison dronu + serbest ilahi, çanlar | serbest | düşük | ima | Bizans sarayı, Konstantinopolis, Bizanslı tarihçiler |
| `saray` | Saray entrikası / gerilim: tremolo, tik-tak, nabız | 72, 4/4 | orta | basta, karanlık | taht kavgaları, iç savaş, Fetret, "ama bir sorun vardı" |
| `rivayet` | Rüya / efsane: çanlar, kadeh, ney taksimi; ritimsiz | serbest | düşük | tek başına, uzaktan | rüya, efsaneler, RİVAYET rozetli anlar |
| `agit` | Ağıt / çöküş: çello, kalp atışı, ney | 52, 4/4 | düşük | minör ve yarım kalan | Ankara 1402, Kosova, Viyana 1683, 1922 |
| `yenilesme` | Yenileşme: klavsen/oda yaylıları ↔ kanun/ud; sonda trampet | 96, 4/4 | orta | kanun ve kemanda makamla | Lale Devri, Tanzimat, diplomasi, 1914'e giriş |

**Ölçümler (tam miks, bağımsız kontrol):** hepsinde RMS −20 dBFS, tepe ≤ −1.2 dBFS, 4 kHz üstü enerji ≤ %0.22, 250 ms spektral merkez sıçraması ≤ 0.99 oktav.

**Bölümlerde kullanım** (`timeline.js` → `music`):
```js
{ from: 'p3', to: 'p4', style: 'trk:kurulus', offset: 18, gain: .8, layers: ['tam'], fallback: 'lib:theme' }
// layers: ['zemin','melodi'] gibi katman seçimi; offset: parçanın kaçıncı saniyesinden başlanacağı (leitmotifi bir kelimeye denk getirmek için)
```
**Bilinen sınırlar:** ney, ud, kanun, zurna ve koro gerçek çalgı/ses değil, yaklaşım; legato çapraz geçişle taklit. Tını bilinçli olarak koyu (anlatımın altında çalmak için). Yayından önce kulakla dinlenmeli.
