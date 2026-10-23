# Instagram'a otomatik yayın (Meta Instagram API)

Araştırma tarihi: 23 Ekim 2026. Meta'nın geliştirici sayfaları bu ortamdan açılamadı (ağ politikası). Bilgiler Meta belgelerinin arama özetlerinden ve geliştirici rehberlerinden derlendi. Meta'nın kendi sayfasıyla üçüncü taraf rehberleri çelişirse Meta esas alındı; doğrulanmamış noktalar **(doğrula)** diye işaretli. Kaynaklar en altta.

## 1. Özet
- Instagram, Reels'i resmî **Content Publishing API** ile yayınlamaya izin verir. Akış iki adımlıdır: önce bir medya kabı (container) oluşturulur, video işlenince kap yayınlanır.
- **Hesap:** Profesyonel bir Instagram hesabı gerekir (İşletme ya da İçerik üreticisi).
- **Uygulama:** Meta geliştirici hesabında bir uygulama açılır.
- **App Review:** Yalnız kendi hesabımıza yayın yapacaksak gerekmez. Hesap uygulamada rol sahibi olunca "Standard Access" yeterlidir.
- **Zamanlama:** API'nin kendi zamanlama alanı yok. Yayın anında çağrıyı biz yaparız. Bu oturumda bunu zamanlanmış görevle (Routine) kurabilirim.
- **Engel:** Bu ortamın ağı Meta sunucularını şu an engelliyor (`graph.facebook.com`, `rupload.facebook.com`, `graph.instagram.com`: 403). İzin listesine eklenmeleri gerekir.

## 2. İki giriş yolu

| | A · Instagram Login | B · Facebook Login for Business (**önerilen**) |
|---|---|---|
| API sunucusu | `graph.instagram.com` | `graph.facebook.com` + `rupload.facebook.com` |
| Facebook Sayfası | Gerekmez | Instagram hesabına bağlı bir Sayfa gerekir |
| İzinler | `instagram_business_basic`, `instagram_business_content_publish` | `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement` |
| Video nasıl gider | `video_url`: Meta dosyayı **herkese açık bir adresten** çeker. Bu yolda doğrudan yükleme üçüncü taraf rehberlerinde var, Meta belgesinde görmedim **(doğrula)** | **Doğrudan yükleme (resumable):** dosya bu makineden `rupload.facebook.com`'a gönderilir; açık bir adrese koymak gerekmez |
| Anahtar (token) | Uzun ömürlü kullanıcı anahtarı **60 gün** geçerli. `ig_refresh_token` ile yenilenir; 60 gün yenilenmezse ölür | Business ayarlarında bir **sistem kullanıcısı** anahtarı. Süresiz üretilebilir **(doğrula)** |

**Neden B:** Videolar bu makinede render ediliyor ve git'e girmiyor (`*.mp4`). B yolunda dosyayı doğrudan Meta'ya yüklerim; geçici bir barındırma gerekmez. Sistem kullanıcısı anahtarı da her 60 günde yenileme işini ortadan kaldırır. Tek ek iş: bir Facebook Sayfası açıp Instagram hesabına bağlamak.

## 3. Yayın akışı (B yolu)
1. **Kap:** `POST graph.facebook.com/<sürüm>/<IG_USER_ID>/media`, `media_type=REELS`, `upload_type=resumable`, `caption=…`, isteğe bağlı alanlar (aşağıda). Yanıt: kap kimliği ve yükleme adresi.
2. **Yükleme:** `POST rupload.facebook.com/ig-api-upload/<sürüm>/<kap_id>`. Başlıklar: `Authorization: OAuth <anahtar>`, `offset: 0`, `file_size: <bayt>`. Gövdede mp4.
3. **Bekleme:** `GET /<kap_id>?fields=status_code` değeri `FINISHED` olana kadar beklenir (`ERROR` olursa durulur). Kap 24 saat içinde yayınlanmazsa düşer.
4. **Yayın:** `POST /<IG_USER_ID>/media_publish?creation_id=<kap_id>`. Yanıt: gönderi kimliği.
5. **Doğrulama:** `GET /<media_id>?fields=media_product_type,permalink`. Değer `REELS` olmalı; yayınlanmış Reels okurken `media_type` `VIDEO` görünür.

**Kullanacağımız isteğe bağlı alanlar**
- `caption`: açıklama ve etiketler.
- `share_to_feed=true`: ana akışta da görünsün.
- `thumb_offset` (ms) ya da `cover_url`: kapak. `cover_url` açık bir görsel adresi ister; ikisi birlikteyse `cover_url` kazanır. Bizim için en kolayı `thumb_offset` (ör. başlık kartının karesi).
- `audio_name`: sesin adı ("Tarih Reels · Uçtaki Beylik"). Yalnız bir kez değiştirilebilir.
- `collaborators`: en çok 3 kullanıcı adı.
- `trial_params`: deneme Reels'i, yalnız takipçi olmayanlara gösterilir; `MANUAL` ya da `SS_PERFORMANCE`. Meta'nın değişiklik günlüğünde var. Hesap için takipçi eşiği resmî değil (~1.000 deniyor) **(doğrula)**.

**Sınırlar**
- **Günlük sınır:** 24 saatte 100 API gönderisi. Kalanı `GET /<IG_USER_ID>/content_publishing_limit` söyler.
- **Uygulama müziği:** Instagram'ın müzik kütüphanesi API'den eklenemez. Bizim müzik zaten videonun içinde ve CC0.

## 4. Video koşulları (Meta IG User Media başvurusu, Reels)

| Koşul | Meta | Bizim yayın render'ı | Gerekli |
|---|---|---|---|
| Kap | MP4/MOV, moov başta | MP4, `+faststart` | ✓ |
| Video | H.264/HEVC, ≤ 25 Mbps, genişlik ≤ 1920, 23–60 fps | H.264, `maxrate 20M`, 1080×1920, 30 fps | ✓ |
| Ses | AAC, ≤ 48 kHz, **≤ 128 kbps** | AAC **256 kbps**, 44,1 kHz | ✗ → Instagram çıktısı 128 kbps, 48 kHz |
| Boyut | ≤ 300 MB | 2 dk'da 20 Mbps tavanla 300 MB'ı aşabilir | Instagram çıktısında boyut denetimi |
| Süre | 3 sn – 15 dk | fragman ~0:50; bölümler 1:38 – 2:15 | ✓ (bkz. §5) |

Yapılacak: render'dan sonra bir **Instagram çıktısı** adımı (sesi 128 kbps / 48 kHz'e indir, video tavanını ~12 Mbps'e çek, 300 MB ve süre denetimi). Bu adımı yayın aracıyla birlikte yazacağım.

## 5. Açık riskler
1. **90 saniye sorusu.** Uygulamada Reels Ocak 2025'ten beri 3 dakikaya kadar. Meta'nın başvurusu API için 15 dakikaya kadar diyor. Ama bazı rehberler, API'den gelen 90 saniyeden uzun videoların Reels sekmesine girmediğini ya da reddedildiğini yazıyor **(doğrula)**. Fragman (~50 sn) dışında bütün bölümlerimiz 90 saniyenin üstünde (1:38–2:15).
   → İlk denemeyi en kısa bölümle (Bölüm 2, 97,5 sn) yapacağım. `media_product_type` ve Reels sekmesi kontrol edilecek. Sorun çıkarsa iki seçenek var: o bölümler elle yüklenir ya da ≤ 90 sn kesimler hazırlanır.
2. **Yapay zekâ etiketi.** Seslendirme ElevenLabs ile üretiliyor. Meta'nın yardım sayfası, gerçekçi bir yapay zekâ seslendirmesi olan Reels'i "AI info" etiketi gereken içeriğe örnek veriyor. API'de bu etiket için bir alan bulamadım.
   → Açıklamaya sabit bir not koyacağız: "Seslendirme yapay zekâ ile üretilmiştir." Etiketin yayından sonra uygulamadan eklenip eklenemediği ilk denemede kontrol edilecek. Meta etiketi kendisi de ekleyebilir.
3. **Bilinen API arızaları.** Yayın araçları 2024'te ve 2026'da Reels yayınında geçici hatalar bildirdi. Aracımız `ERROR` durumunda durup haber verecek; körlemesine yeniden denemeyecek.

## 6. Kurulum: kullanıcının yapacakları
1. **Instagram hesabı:** Profesyonel hesaba geç (Ayarlar → Hesap türü → İçerik üreticisi ya da İşletme).
2. **Facebook Sayfası:** Bir Sayfa aç ve Instagram hesabını bu Sayfaya bağla (Sayfa ayarları → Bağlı hesaplar → Instagram).
3. **Meta geliştirici uygulaması:** developers.facebook.com'da "Business" türünde bir uygulama oluştur. "Instagram" ürününü ekle ve "API setup with Facebook login" yolunu seç. Kendi hesabın uygulamada yönetici olarak kalır; App Review'e gerek yok.
4. **Anahtar:** Business ayarları (business.facebook.com) → Kullanıcılar → Sistem kullanıcıları:
   - Bir sistem kullanıcısı ekle.
   - Sayfayı, Instagram hesabını ve uygulamayı ona varlık olarak ata.
   - "Anahtar oluştur" de; §2'deki dört izni seç, süre olarak "Süresiz"i seç.
5. **Anahtarı ortama koy:** Cloud ortamının ayarlarına ekle (oturum başlığındaki ortam menüsü → Edit → Network secrets; eski sürümde "API credentials" ya da ortam değişkeni). Değişken adı: `IG_ACCESS_TOKEN`. Anahtarı sohbete yapıştırma. Yeni oturumda okunur.
6. **Ağ izni:** Aynı ayarlarda Network access → Allowed domains'e `graph.facebook.com` ve `rupload.facebook.com` ekle ("Allow package managers" işaretli kalsın). A yolu seçilirse `graph.instagram.com` da eklenir. Adımlar: https://code.claude.com/docs/en/cloud-environments#network-access
7. **Hesap kimliği:** `IG_USER_ID`'yi anahtarla ben bulurum (`/me/accounts?fields=instagram_business_account`).

## 7. Kararlar (kullanıcıdan)
- **Yayın takvimi:** gün, saat, saat dilimi (ör. haftada 2 bölüm, Salı ve Cuma 19.30).
- **Açıklama şablonu:** kanca cümlesi, bölüm numarası, kaynak notu, etiketler, yapay zekâ notu.
- **Onay:** varsayılan olarak her gönderiden önce son sürümü ve açıklamayı gösterip onay isterim. Yayın geri alınamaz. İstersen takvimdeki gönderiler için bir kerelik genel izin verebilirsin.
- **Deneme Reels'i:** kullanılacak mı?

## 8. Hazır olunca benim yapacaklarım
- `shared/tools/ig_cikti.py`: Instagram çıktısı (ses 128 kbps / 48 kHz, boyut ve süre denetimi).
- `shared/tools/ig_yayinla.py`: kap → yükleme → durum bekleme → yayın → doğrulama. `--dene` kipi yalnız kap oluşturur; kap 24 saatte kendiliğinden düşer.
- `tarih-reels-bolum` skill'ine 8. aşama: "Yayın".
- Takvim için zamanlanmış görevler (Routine). Her biri yayından önce kontrol listesini çalıştırır.

## Kaynaklar
- Meta · [Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- Meta · [Resumable uploads](https://developers.facebook.com/documentation/instagram-platform/content-publishing/resumable-uploads)
- Meta · [IG User Media başvurusu](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media/)
- Meta · [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- Meta · [Instagram Platform genel bakış](https://developers.facebook.com/documentation/instagram-platform/overview)
- Meta · [Refresh Access Token](https://developers.facebook.com/documentation/instagram-platform/reference/refresh_access_token)
- Meta · [Instagram Platform değişiklik günlüğü (trial reels)](https://developers.facebook.com/docs/instagram-platform/changelog)
- Instagram Yardım · [Yapay zekâ etiketi](https://help.instagram.com/761121959519495)
- Rehberler: [postproxy.dev Reels](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/) · [upload-post.com](https://www.upload-post.com/instagram-api/) · [rapidevelopers](https://www.rapidevelopers.com/api-automations/how-to-automate-instagram-reels-scheduling-using-the-api) · [bundle.social (trial reels)](https://info.bundle.social/api-reference/platforms/instagram) · [wireflow (tester rolü)](https://www.wireflow.ai/docs/publishing-to-instagram.md) · [Blotato (sınırlar)](https://www.blotato.com/blog/social-media-api-rate-limits)
- 3 dakikalık Reels: [David Zucker](https://davidzucker.substack.com/p/three-minute-instagram-reels-have) · [House of Marketers](https://houseofmarketers.com/instagram-reels-3-minutes-nyc-algorithm-change/)
