# Motor API (shared/engine.js + osmanli-serisi/ortak/gorsel.js)

Hepsi global. `ctx` o an çizilen tuvaldir. Harita koordinatı km'dir (LAEA). Ekran koordinatı piksel (1080×1920).

## Zaman ve yumuşatma
| Fonksiyon | Ne |
|---|---|
| `cue('p2:kelime+0.3')` (`C`) | Çapanın saniyesi |
| `seg(t, a, b)` | 0..1 ilerleme |
| `clamp`, `lerp` | Sınırlama, doğrusal ara değer |
| `eIO`, `eOut`, `eIn`, `eBack` | Yumuşatmalar |
| `keyed([[t, ...değerler]], t)` | Eski anahtar kare yöntemi; kamera için `camPath` tercih edilir |
| `spring(t, t0, {freq:2.2, damp:.45})` | 0→1 sönümlü yay |
| `springSeq(t, [[t, v], ...])` | Hedefi değişen yay |
| `hitPulse(t, at, len)` | Vuruş anında 1'den 0'a sönen nabız |
| `handheld(t, amp)` | [dx, dy] el kamerası kayması |
| `rng(tohum)` | Deterministik rastgele üreteç |

## Kamera ve harita
| Fonksiyon | Ne |
|---|---|
| `camPath([[t, x, y, zoom], ...], t, {creep})` | Monoton kübik, log-zoom; tutuşta yavaş itme |
| `flyTo([x, y, z], [x, y, z], k, rho = 1.4)` | Uzaklaş, kay, yakınlaş uçuşu |
| `drawTimeMap(t, cam, yıl, {focus:'OSM', dim, rivers, riverA, borderA, hatchA, after(z, S)})` | Yıla göre sahiplik haritası; birim durumlarını (S) döndürür |
| `ownerLabels(cam, yıl, {only:[kodlar], a, minArea, size:[min, max], offset:{KOD:[dx, dy]}})` | Sahip adları |
| `ownCity(cam, 'Bursa', yıl, {r, size, a, align})` | Sahibinin renginde şehir noktası (`cityDot` üzerine kurulu) |
| `mapLabel(cam, 'BİZANS', x, y, boyut, {a, col, halo, sp})` | Harita yazısı |
| `arrow(cam, [[x, y], ...], k, genişlik, renk, {col0, edge})` | K&G konik ok; k çizim ilerlemesi |
| `riverGlow(cam, 'Tuna', a)` | Nehir parlatma (Tuna, Fırat, Meriç, Sakarya, Kızılırmak, Dicle, Morava…) |
| `mapPin(cam, x, y, t, t0, 'ETİKET', {date, left, col})` | Düşen iğne |
| `glowPath(cam, pts, t, k, {w, col, dash})` | Parlayan yol (uç bölgesi, sınır) |
| `flowDots(cam, pts, t, a, {n, speed, r})` | Akan sikke noktaları (vergi, ticaret) |
| `inWorld(cam, fn)` | Dünya koordinatında serbest çizim |
| `W2S(cam, x, y)` | Dünya → ekran |
| `LL(boylam, enlem)` | Coğrafi → harita km |
| `CITY['Söğüt']` | Hazır şehirler; tam liste `shared/data/anadolu_balkan.js` → `cities` |

## Yazı
| Fonksiyon | Ne |
|---|---|
| `title(s, x, y, boyut, {gold, col, fam, w, spacing, stroke})` | Statik başlık |
| `kinetic(s, x, y, boyut, t, t0, {mode:'letters'|'slam'|'fade', out, fam, gold, col, spacing})` | Animasyonlu yazı |
| `stamp('BELGE YOK', x, y, boyut, t, t0, renk, açı)` | Mühür damgası |
| `typewriter([satırlar], x, y, boyut, t, t0, cps)` | Daktilo yazısı |
| `yearTicker(x, y, yıl, boyut, {approx, label, a})` | Yıl sayacı |
| `up(s)` | Türkçe büyük harf |
| `setFont(boyut, F.cinzel|F.anton|F.mont, ağırlık)` | Font seçimi |

## Seri katmanı (otomatik)
- `BRAND`: Sol üstte sezon adı, bölüm N/10 ve ilerleme noktaları (`EP.series`).
- `POST`: Sıcak ton; `EP.badges` rozetleri; `EP.cards` başlık ve sıradaki kartı; sahne `note` notu.
- Sabitler: `SAFE_TOP = 232`, `NOTE_Y = 1452`.

## Nesneler ve siluetler
| Fonksiyon | Ne |
|---|---|
| `coin(x, y, r, t, {flip:-1..1, shine:0..1, seed})` | Akçe |
| `coinIcon(x, y, r)` | Küçük sikke simgesi |
| `parchment(x, y, w, h, {rot, seed, a})` | Parşömen |
| `inkScript(x, y, w, satır, t, t0, süre, {style:'greek'|'arabic', lh, seed})` | Soyut el yazısı; kalem ucunun konumunu döndürür |
| `inkDrop(x, y, t, t0, {r})` | Mürekkep damlası |
| `miniTree(x, y, ölçek, büyüme, t, {leaves, col})` | Rüya ağacı (sezon logosu) |
| `pennant(x, y, s, t, {col, sil})` | Sancak |
| `tent(x, y, s, t, {sil, door, smoke})` | Çadır |
| `tug(x, y, s, t, {fall, dir, sil})` | Tuğ (devrilebilir) |
| `rider(x, y, s, t, {speed, ph, flip, sil, spear, flag})` | Dörtnala atlı |
| `scribe(x, y, s, t, {write})` | Mum ışığında yazan Bizanslı tarihçi |
| `emptyArchive(t, {zoom, fill})` | Boş arşiv rafları |
| `timeline(t, {from, to, step, y, k, marks:[[yıl, etiket, alt, t0]], gap:[a, b, etiket], gapK})` | Zaman çizgisi |

## Atmosfer ve efekt
| Fonksiyon | Ne |
|---|---|
| `skyLand(t, {k:0..1 gece→şafak, sun, mist})` | Gökyüzü ve tepeler |
| `smokeLayer(t, a, renk, tohum)` | Duman |
| `embers(t, a)` | Kor parçacıkları |
| `glow(x, y, r, renk, a)` | Işık halesi |
| `cracks(cx, cy, k, tohum, {n, len})` | Çatlak |
| `rewindFX(t, k)` | Geri sarma efekti |
| `grain`, `vignette`, `oldFilm` | Son işlem (motor otomatik uygular; `EP.film` false ise eski film yok) |

## Render yardımcıları
- `window.renderAt(t)`
- `window.renderBlurred(t, n, dt)`
- `window.blurAt(t)`
- `window.exportCues()`: sahneler, geçişler, vuruşlar, yükselen sesler ve müziğin çözülmüş saniyeleri.
