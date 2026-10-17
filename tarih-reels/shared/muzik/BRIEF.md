# Seri müzik kütüphanesi – üretim brifi (alt ajanlar için)

**Proje:** Instagram için dikey (9:16), 60–90 sn'lik animasyonlu Osmanlı tarihi serisi (1280–1922, 8 sezon). Anlatıcı: tek erkek ses (ElevenLabs, sakin belgesel anlatıcısı). Müzik **anlatımın altında** çalar; ön planda değil.
Kalite hedefi: Kings & Generals / büyük tarih kanallarının sinematik ama ölçülü müzik dili. Telifsiz, %100 kendi üretimimiz + CC0 örnekler.

## Kullanıcının ses geri bildirimi (en önemli kural)
"Bas seslerden sonra çok tiz sesler geliyor, o kadar zıtlık dikkati bozuyor; daha uyumlu olabilir." → Sert tiz geçişler, cızırtılı zil/çan saldırıları, ani parlak transientler YOK. Yumuşak, sıcak, uyumlu bir spektrum.

## Kaynaklar
- **Hazır CC0 kütüphane:** `tarih-reels/shared/sfx/` (48 FLAC, `katalog.json`; kimlikler ör. `muzik/cello_D2`, `ritim/darbuka_dum`, `vurus/timpani_rulo`). Yalnızca okuyun, değiştirmeyin.
- **CC0 örnek depoları (kısmi klon, blob'lar talep üzerine iner):** `/tmp/claude-0/sfx/VCSL` (Versilian Community Sample Library, CC0) ve `/tmp/claude-0/sfx/VSCO-2-CE` (CC0). Yol listesi: `/tmp/claude-0/sfx/paths_VCSL.txt`, `paths_VSCO-2-CE.txt`. Dosya almak için: `git -C /tmp/claude-0/sfx/VCSL checkout HEAD -- "<yol>"` (yalnız gerekeni çekin). Örn. VCSL'de: psaltery (kanun benzeri), harp, harpsichord, recorder/ocarina (ney'e yaklaşım), frame drum/darbuka/davul türleri, gong, çan, cello/viola vb.; VSCO 2 CE'de: yaylılar (solo/ensemble, sustain/tremolo/pizz), korno, trompet, trombon, tuba, timpani, org, klavsen.
- Başka bir kaynak kullanacaksanız **yalnızca CC0 / kamu malı** ve lisans dosyasını doğrulayın; `KAYNAKLAR.tsv`'ye yazın. GitHub (git clone, raw.githubusercontent.com) ve PyPI erişilebilir; freesound/pixabay/archive.org erişilemez.
- **Sentez serbest:** numpy ile Karplus-Strong (ud/kanun/tambur benzeri telliler), nefesli modelleme (ney: filtreli gürültü + sinüs + nefes zarfı), kös/davul, vb. Hazır fonksiyon örnekleri için `tarih-reels/shared/make_audio.py` (`oud`, `pad`, `timpani`) ve `shared/tools/build_sfx_library.py` (`harmonize`) dosyalarına bakın.
- Python: numpy, (gerekirse scipy, soundfile pip ile kurulabilir), ffmpeg mevcut. Ses DİNLEYEMEZSİNİZ: nesnel ölçümlerle doğrulayın (aşağıda).

## Serinin ortak leitmotifi (her tarz bir yerinde, kendi kılığında kullanmalı)
Re (D) Hicaz: D – E♭ – F♯ – G – A – B♭ – C – D. Motif (4/4, ♩ = tarzın temposu):
`A4 ♩ · B♭4 ♩ · A4 𝅗𝅥 · G4 ♩ | F♯4 ♩ · G4 ♩ · E♭4 ♩ · D4 𝅗𝅥.`
Makam rengi için isteğe bağlı koma: E♭ ≈ +15 sent, F♯ ≈ −15 sent (12-TET de kabul). Motif tarzınıza göre transpoze, yavaşlatılmış, parçalanmış, bas hattında ya da tek enstrümanla verilebilir; bir tarzda tam, bir tarzda ima olarak.

## Teslimat (her tarz için, yalnız kendi klasörünüzde: `tarih-reels/shared/muzik/<tarz-id>/`)
1. `uret.py` – deterministik (sabit tohum) üretici. `python3 tarih-reels/shared/muzik/<id>/uret.py` çalıştırılınca `out/` altına yazar:
   - `out/<id>__tam.flac` – tam miks, **75–90 sn**: ~4–6 sn giriş, **döngülenebilir gövde** (döngü noktaları meta'da, kesintisiz), ~4–6 sn kapanış.
   - Katmanlar (stem), toplamı tam miksi verir: `out/<id>__zemin.flac` (drone/pad/bas), `out/<id>__ritim.flac` (yoksa sessiz dosya yazmayın, meta'da belirtin), `out/<id>__melodi.flac`. Böylece motor anlatı yoğunluğuna göre katman açıp kapatabilir.
   - `out/<id>__vurgu.flac` – 3–6 sn'lik kapanış/vurgu "sting"i (bölüm sonu ya da sahne dönüşü için).
   - 44.1 kHz, stereo, 16 ya da 24 bit FLAC.
2. `onizleme.mp3` – tam miksin 128 kbps MP3'ü (git'e girecek tek ses dosyası; `out/` git'e girmez).
3. `meta.json` – `{"id","ad","tarz","kullanim":[...sahne türleri...],"donem":[...sezonlar...],"ton_makam","bpm","usul_olcu","sure","dongu":[bas_sn,son_sn],"katmanlar":[...],"yogunluk":"dusuk|orta|yuksek","olcumler":{...},"kaynaklar":[...]}`
4. `README.md` – kısa: ne anlatıyor, hangi sahnelerde kullanılır, yapı (zaman çizelgesi), kullanılan örnekler/sentez, ölçüm sonuçları.
5. Kullandığınız harici örnekler için `KAYNAKLAR.tsv` (dosya, depo, yol, lisans).

## Ses kuralları (anlatımın altında çalacak)
- **Spektrum:** 4 kHz üstü enerji tam miksin ≤ %6'sı; 1.5–4 kHz (konuşma netliği bölgesi) hafif boş bırakılmalı (melodi orta-pes ya da yumuşak). Gerekirse `build_sfx_library.py`'deki `harmonize` yaklaşımını uygulayın.
- **Yumuşak saldırılar:** zil/çan/metal vuruşları ya düşük seviyede, ya oktav pes, ya yumuşatılmış (attack ≥ 5–10 ms, tiz raf). Ani bas → tiz zıtlığı yok: ardışık 250 ms pencerelerde spektral merkez sıçraması ≤ ~1 oktav olmalı.
- **Seviye:** tam miks RMS ≈ −20 dBFS (±2), tepe ≤ −1 dBFS; yoğunluk eğrisi yumuşak (ani patlama yok, varsa vurgu dosyasında).
- **Ortak oda:** kısa, sıcak yankı (ör. 1.5–2 sn, %15–20 ıslak) – serideki diğer tarzlarla aynı mekânda duyulsun.
- **Ton:** ana tonal merkez D (Re) – farklı tarzlar birbirine kesilerek bağlanabilsin. Tarzınız gerektiriyorsa (ör. Bizans ilahisi ison dronu) D ya da A üzerinde kalın.
- **Kültürel doğruluk:** makam/usul kullanıyorsanız adını ve yaklaşık doğruluğunu README'de dürüstçe belirtin ("Hicaz'a yaklaşım, 12-TET" gibi). Klişe "oryantal" kalıplardan kaçının; mehter, ilahi, Bizans müziği gibi geleneklere saygılı yorum.

## Doğrulama (dinleyemediğiniz için zorunlu)
`uret.py` sonunda ya da ayrı `olc.py` ile ölçün ve meta'ya yazın: RMS, tepe, >4 kHz enerji oranı, 1.5–4 kHz oranı, 250 ms pencerelerde spektral merkez (en büyük sıçrama, oktav cinsinden), döngü noktasında sürekliliği (döngü sonu → başı geçişinde dalga/RMS farkı), kırpılma yok. Bir spektrogram PNG'si (`/tmp/...` altında; git'e değil) üretip Read aracıyla görsel kontrol yapın. Sorunlu ölçüm varsa düzeltip yeniden üretin.

## Kurallar
- **Yalnız kendi klasörünüzde çalışın**; `shared/sfx`, motor dosyaları ve diğer tarz klasörlerine yazmayın. **git commit/push YAPMAYIN** (ana ajan toplayıp commit edecek). `out/` ve geçici dosyalar git dışı kalacak (`tarih-reels/shared/muzik/.gitignore` ana ajanda).
- Geçici dosyaları `/tmp/claude-0/muzik-<id>/` altında tutun, bitince büyük ara dosyaları silin.
- Sonunda kısa rapor: her tarz için yapı, ölçümler, bilinen zayıflıklar, hangi sahnelerde kullanılacağı.
