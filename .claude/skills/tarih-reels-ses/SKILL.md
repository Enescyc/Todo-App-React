---
name: tarih-reels-ses
description: Tarih Reels'in müzik, efekt ve miks kuralları. Kapsam; 10 seri müzik tarzının (kurulus, destan, mehter, akin, derya, bizans, saray, rivayet, agit, yenilesme) sahnelere seçimi, leitmotifi bir kelimeye kilitleyen sync, CC0 efekt kütüphanesi (shared/sfx) ve uyumlu efekt seçimi, konuşma altında −15 dB kısma, −14 LUFS mastering ve ses_olc.py ile ölçüm. "Müzik seç", "ses efekti ekle", "ses kulak tırmalıyor", "bas sonrası tiz", "müzik konuşmayı bastırıyor", "ses çok kısık/yüksek", "yeni müzik tarzı üret" denildiğinde ya da timeline.js'te music, hits veya risers düzenlenirken bu skill'i kullan.
---

# Ses, müzik ve miks

## Kullanıcının kulağı
Kullanıcı demo miksi beğendi, ama "bazı bas seslerden sonra çok tiz sesler geliyor, o kadar zıtlık dikkati bozuyor" dedi. Bu yüzden:
- Her şey **koyu ve sıcak** olsun. Kütüphane sesleri zaten uyumlandı (4 kHz üstü ≤ %6).
- Vuruşlar ve yükselen sesler için koyu kaynak seç: timpani, davul, kös. **Parlak zil kabarması, örs, kilise çanı ya da metal vuruşu bir bas vuruşunun hemen önüne veya arkasına koyma.** Ölçümde tam bu kalıp yakalanmıştı.
- Ses dinlenemez; **ölçerek** doğrula (aşağıda).

## Müzik: `shared/muzik` (10 tarz)
Katalog ve dinleme derlemesi: `tarih-reels/shared/muzik/README.md`. Kısaca:

| Sahne duygusu | Tarz |
|---|---|
| Açılış, kuruluş, umut, sezon kartı | `trk:kurulus` (ney ile leitmotif ~20. sn) |
| Fetih, dönüm noktası, doruk | `trk:destan` (motif ~30 sn, doruk 42–55 sn) |
| Ordu yürüyüşü, cülus | `trk:mehter` |
| Meydan savaşı, akıncı okları | `trk:akin` (doruk ~38 sn) |
| Boğaz, donanma, kıyı | `trk:derya` |
| Bizans sarayı, Konstantinopolis, Bizanslı tarihçi | `trk:bizans` (motif iması ~42 sn) |
| Entrika, iç savaş, "ama bir sorun vardı" | `trk:saray` (A 5 sn, B motif 18 sn, C gerilim 38 sn) |
| Rivayet, rüya, efsane, gizem | `trk:rivayet` (motif tek başına ~36.5 sn) |
| Yenilgi, ölüm, çöküş | `trk:agit` (yarım kalan motif ~23 sn) |
| Reform, Avrupa, geç dönem | `trk:yenilesme` |

```js
{ from: 'p3:Liderinin-0.15', to: 'p4-0.15', style: 'trk:kurulus', sync: ["p3:Osman'dır", 20], gain: .9, fallback: 'lib:theme' }
```
- **`sync: [çapa, sn]`:** Parçanın o saniyesi çapaya denk gelir. Böylece leitmotif "Osman'dır" sözüne oturur; seslendirme gelince kendiliğinden kayar.
- **Geçişler:** Ardışık parçalar 1 sn girişle, 2 sn çıkışla otomatik olarak birbirine geçer. Bir sahne 3 sn'den kısaysa ayrı parça açma, öncekini uzat.
- **Katman seçimi:** `layers: ['zemin', 'melodi']` (ritimsiz) gibi.
- **Yedek:** Parça yoksa `fallback` stili (`lib:*`, `shared/sesler.py`) çalar. Parçaların `out/` dosyaları git dışıdır; yoksa `uret.py` kendiliğinden yeniden üretir.
- **Yeni tarz:** `shared/muzik/BRIEF.md` brifiyle alt ajana ürettir. Kurallar: CC0, Re merkezli, leitmotif, ölçümler, kendi klasörü.

## Efektler: `shared/sfx` (48 CC0 ses)
Kimlikler:
- **vurus/:** timpani_alcak, timpani_rulo, buyuk_davul_ff/mf/kresendo, gong_mf/fff, zil_gong, zil_timpani, zil_crash
- **ritim/:** darbuka_*, def_*, trampet_askeri
- **metal/:** zincir_*, ors_*, tas_surtunme
- **can/:** kilise_cani_D3/C3
- **doga/:** deniz_1/2, ortam_1
- **doku/:** fx_uzun_1/2, kadeh_D#4
- **gecis/:** zil_kresendo_*, zil_yay, gong_suruntu

Ayrıntı: `shared/sfx/katalog.json`.

**Seçim kuralları:**
- **Az ama güçlü:** Bölüm başına 3–5 güçlü an ve birkaç ince doku. Her cümleye efekt koyma.
- **Zamanlama:** Vuruşu eylemin tam karesine koy: `{ at: 'p2:dağıldı', amp: 14, sfx: 'vurus/buyuk_davul_ff', gain: .85 }`.
- **Yükselen ses:** `risers: [{ to: 'p2:dağıldı', sfx: 'vurus/timpani_rulo', gain: .5 }]`. Sesin sonu çapaya oturur. Zil kabarması yerine timpani rulosu kullan.
- **Dokular:** kadeh ve Nepal çanları rüya ve rivayet için düşük seviyede; zincir esaret için; deniz geçişler için.

## Miks standardı (`shared/make_audio.py`, kütüphane modu)
- **Ortak oda:** 1.8 sn, %18 ıslak; 7 kHz üstüne −4 dB raf.
- **Konuşma altında müzik:** `EP.duckDb` (varsayılan 15 dB) kadar kısılır; efektler %30 kısılır.
- **Mastering:** −14 LUFS bütünleşik (Instagram/YouTube hedefi), tepe ≤ −1 dBFS, yumuşak sınırlayıcı.
- **Ara katmanlar:** `audio/_arka.wav` ve `audio/_vo.wav` ölçüm için yazılır.

```bash
python3 shared/make_audio.py <bölüm>
python3 shared/tools/ses_olc.py <bölüm>
```
`ses_olc.py` hedefleri:
- −14 ±1 LUFS
- tepe ≤ −1 dBFS
- 4 kHz üstü ≤ %6
- bas → tiz sıçrama yok (müzik + efekt izinde, `audio/_arka.wav`; anlatıcının ş/s/z geçişleri ölçüt değildir, bilgi olarak yazılır)
- anlatıcı müziğin ≥ 10 dB üstünde (en kötü %10'luk dilimde)

✗ çıkan madde varsa düzelt: efekti değiştir ya da kıs, `duckDb`'yi artır, müziğin `gain` değerini düşür. Sonra yeniden ölç. Kullanıcıya ölçüm özetini ver ve "dinleyip onaylayın" de; ses dinlenemediğini saklama.

## Önizlemeye yeni ses koymak (görüntü değişmediyse)
```bash
ffmpeg -y -i <bölüm>/onizleme-720.mp4 -i <bölüm>/audio/final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest <bölüm>/tmp.mp4 && mv <bölüm>/tmp.mp4 <bölüm>/onizleme-720.mp4
```
