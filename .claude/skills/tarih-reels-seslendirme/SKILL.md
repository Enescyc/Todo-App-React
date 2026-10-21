---
name: tarih-reels-seslendirme
description: Tarih Reels seslendirmesinin hazırlanması ve hizalanması. ElevenLabs v4 metni ve ayarları (anlatıcı Emrullah Uzun, ton etiketleri, paragraflar arası [pause]), kullanıcının gönderdiği mp3'ün vo/full.mp3 olarak yerleştirilmesi, paragraflara bölme ve kelime zamanlarını çıkarma, yanlış ya da eksik kayıt tespiti. "ElevenLabs metni ver", "seslendirme metnini hazırla", "tonlama ayarları", "ses dosyasını gönderdim", "kayıt geldi", "ses senkron değil", "altyazı kayıyor" denildiğinde ya da kullanıcı bir mp3/wav yüklediğinde bu skill'i kullan.
---

# Seslendirme: ElevenLabs v4 → hizalama

## 1. Metni hazırla (`sezon/SESLENDIRME.md`)
Kullanıcı ayarları ve tonlamayı açıkça istedi ("tonlama vs ayarları yok"). Bu yüzden her metinle birlikte ayar tablosunu ve ton planını ver.

| Ayar | Değer |
|---|---|
| Ses | **Emrullah Uzun** (bütün seri) |
| Model | Eleven v4 |
| Stability | Natural (kaydırıcıysa %40–45) |
| Similarity | %80 |
| Style | %30–35 |
| Speaker Boost | Açık |
| Speed | 1.0. Hızlandırma yok; süreyi metin belirler |

**Biçim:** Her bölüm **tek parça** üretilir. Paragraflar arasına boş satır, `[pause]` ve yine boş satır koy; bölme bu duraklamalardan yapılır.
```
[calm, storytelling] Birinci paragraf metni... [serious] devamı.

[pause]

[curious] İkinci paragraf...
```
- **Etiketler:** Kısa İngilizce ton etiketleri kullan: `[calm]`, `[storytelling]`, `[serious]`, `[dramatic, slow]`, `[curious]`, `[mysterious, low]`, `[warm]`, `[confident]`.
- **Duraklama:** Vurgudan önce "…" koy ("Liderinin adı… Osman'dır").
- **Kelimeler `timeline.js` → `paras[].text` ile birebir aynı olmalı.** Etiketler, üç nokta ve virgül eklenebilir, kelime eklenemez ya da silinemez. Hizalama kelimeleri hecelere göre dağıtır; fazladan bir kelime bütün çapaları kaydırır.
- **Tablo ve kontrol satırı:** Her bölümün ardından paragraf, ton ve doruk an tablosunu ver. Bir de kontrol satırı ekle: beklenen süre (kelime / 2.0 sn), ilk ve son cümle, paragraf sayısı.
- **Etiket uyarısı:** Etiketler sesli okunursa kullanıcı etiketleri silip aynı metni kullansın; noktalama tonu yine taşır. Bunu kullanıcıya söyle.
- **Telaffuz:** Riskli adları listele (Kösedağ, Pakhymeres, Kantakuzenos…). Yanlış okunursa yazımı tek başına değiştirme; değişiklik `timeline.js`'e de işlenir.

## 2. Kayıt gelince
1. Dosyayı bölüm klasörüne `vo/full.mp3` olarak koy. Ayrı paragraf dosyaları varsa `vo/p1.mp3 … pN.mp3`.
2. Kayıt **doğru kayıt mı?** Süreyi kelime sayısına böl; Emrullah Uzun ≈ 2.0 kelime/sn okur.
   - Bir kez başka bir sesle (Deniz S.) ve farklı bir metinle kayıt geldi; hız tutmadığı için yakalandı. Tutmayan dosyayı `vo/kontrol/`'e taşı (git dışı) ve kullanıcıya sor.
   - Kayıt beklenenden ≥ %25 kısaysa metin kesilmiş olabilir.
3. `python3 shared/make_audio.py <bölüm>` çalıştır. Çıktıda şunlar var:
   - `paragraf kesimleri (sn)` ve `hız oranı: p1:1.00 p2:0.97 …`
   - **Oran 0.75–1.35 dışındaysa** ya da "UYARI: bir paragraf sınırı yanlış olabilir" çıkarsa: o paragrafın gerçekten bölünüp bölünmediğine bak. Kayıtta `[pause]` atlanmış olabilir.
   - `audio/vo_timing.js` yazılır; sayfa ve render artık gerçek kelime zamanlarını kullanır.
4. **Hızlandırma yapma.** Süre uzarsa animasyon kendiliğinden esner. Çok uzunsa (Instagram için > 90 sn) metni kısaltmayı kullanıcıya öner.
5. `kontrol.js` ile iletişim tablosunu yeniden al. Sahneler, rozetler ve kartlar yeni zamana oturdu mu? `ses_olc.py` ile anlatıcının müziğin ≥ 10 dB üstünde olduğunu doğrula.
6. Render et ve 720p kopyayı gönder.

## Sık sorunlar
- **Altyazı kelimeden önde ya da arkada:** Kelime zamanları hece oranıyla dağıtılır. Noktalamalı kelimelerin sonu en yakın gerçek duraklamaya yaslanır. Belirgin bir kayma varsa önce paragraf kesimlerini kontrol et.
- **Paragraf sayısı tutmuyor:** Kayıt bir `[pause]`'u atlamış. Kullanıcıdan o paragrafı yeniden üretmesini iste ya da paragrafları `vo/p1.mp3…` olarak ayrı yükletmeyi öner.
- **Etiket sesli okunmuş:** Etiketsiz metinle yeniden üretim.
