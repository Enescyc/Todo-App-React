---
name: tarih-reels-arastirma
description: Tarih Reels serisi için tarihî araştırma, doğrulama ve tarafsızlık kuralları. Kaynak hiyerarşisi (çağdaş kaynak → Türk tarihçiler İnalcık, Emecen, Ortaylı ve TDV İslâm Ansiklopedisi → modern akademi), güven rozetleri (🟢 BELGE, 🟡 TARTIŞMALI, 🔴 RİVAYET, ⚪ DOĞRULANACAK), bölümün FACTS.md'si ve harita sahiplik tablosunun dayanakları burada. Bir dönemi ya da olayı araştırırken, "doğrula", "kaynak bul", "bu doğru mu", "tarafsız anlat", "İnalcık ne diyor", "tarih tartışmalı mı" denildiğinde, yeni bir bölüm ya da sezon başlatılırken, ekrana tarih, rakam, sınır ya da isim yazılacağı her durumda bu skill'i kullan. Hassas başlıklarda (ör. 1915) da önce buraya bak.
---

# Araştırma ve doğrulama

Seri, doğru bilgiyi harmanlayıp Osmanlı tarihini **tek bir hikâye** olarak anlatır. Doğruluk işimizin temelidir ama anlatının konusu değildir: kullanıcı "şunun kaydı yok, bunu şu yazdı" diye kaynağa odaklanan metinleri istemiyor. Kaynak ayrıntısı `FACTS.md`'de, ekrandaki rozette ve paylaşım açıklamasında durur; anlatıcı hikâyeyi anlatır.
Bu yüzden araştırma, anlatım yazılmadan önce yapılır ve **hikâye malzemesi** de toplar: sahneler, kişiler, mekânlar, kronik anlatılarının ayrıntıları (rivayet olarak işaretlenmiş hâlde). Ekrandaki her yazı ve haritadaki her sınır değişikliği bir kaynağa dayanmalıdır.

## Kaynak hiyerarşisi
1. **Çağdaş kaynaklar:** Olayla aynı dönemde yazılmış metinler.
   - Örnekler: Pakhymeres, Gregoras, Kantakuzenos, İbn Battûta, el-Ömerî, Floransa Senatosu mektubu (1389), sikke ve kitabe.
   - Bunlara doğrudan değil, onları değerlendiren akademik yayınlar üzerinden ulaşılır.
2. **Türk tarihçilerin akademik eserleri:**
   - Halil İnalcık: *Klasik Çağ*, *Devlet-i Aliyye*, TDV maddeleri.
   - Feridun Emecen; İlber Ortaylı (*Osmanlı'yı Yeniden Keşfetmek*, *Son İmparatorluk Osmanlı*); Cemal Kafadar (*İki Cihan Âresinde*); Fuad Köprülü; Abdülkadir Özcan.
   - Kitapların tam metnine bu ortamdan erişilemiyor. **TDV İslâm Ansiklopedisi** maddeleri (çoğu bu yazarların kaleminden), Belleten ve DergiPark makaleleri bu katmanın erişilebilir yüzüdür.
   - Yazar bir kitabı elinde tutuyorsa sayfa kontrolünü ona bırak ve `ARASTIRMA.md`'de "sayfa kontrolü" sütunuyla işaretle.
3. **Modern uluslararası akademi:** Imber, Lowry, Lindner, Heywood; Britannica.
4. **Wikipedia ve popüler siteler:** Yalnızca kaynağa giden yolu bulmak için. Tek başına dayanak olmaz.
5. **15. yüzyıl Osmanlı kronikleri:** Âşıkpaşazâde, Neşrî, Oruç Bey. Değerli ama olaydan 100+ yıl sonra yazıldılar. Kuruluş dönemi için tek dayanak olduklarında iddia en fazla 🟡 olur; rüya ve düğün gibi hikâyeler 🔴 olur.

**Erişim:** WebSearch çalışır. Wikipedia'ya doğrudan fetch genellikle engellidir. TDV maddeleri arama sonuçlarından okunur.

**Arama özetleri çelişirse:** Örneğin damadın Bilecik tekfuru mu yoksa oğlu mu olduğunda özetler ayrıştı. Bu durumda TDV ya da akademik metnin kendi ifadesini esas al. Çözemiyorsan iddia 🟡'dür: varyantları `FACTS.md`'ye yaz, anlatımda tartışmalı ayrıntıya girmeden söyle ("Bilecik tekfurunun düğünü").

## Güven rozetleri
| Rozet | Anlamı | Anlatımda nasıl |
|---|---|---|
| 🟢 BELGE | Çağdaş kaynak ya da nesnel kanıt var | Düz anlatılır |
| 🟡 TARTIŞMALI | Olay kesin; tarih, ayrıntı ya da yorum farklı | Yuvarlak ve doğru söylenir: "bin üç yüzlerin başında", "yaklaşık", tartışmalı ayrıntıya girmeden. Seçenekleri saymak yalnız tartışmanın kendisi hikâyenin parçasıysa (ör. Kosova'da iki tarafın hafızası). Ekranda rozet ve gerekirse tarih aralığı |
| 🔴 RİVAYET | Çok sonra yazılmış anlatı ya da efsane | Tek bir işaretle hikâyenin içinde anlatılır ("anlatılana göre", "rivayete göre"; içeride -mış kipi). Ekranda kırmızı rozet efsane boyunca durur ve `rivayet` müziği çalar. Ardından "ama bu doğrulanmaz" türü açıklamaya girilmez; hikâye belgeli olaylarla devam eder |
| ⚪ DOĞRULANACAK | Kaynakla doğrulanamadı | **Seslendirmeye ve ekrana girmez.** Doğrulanınca rozetini alır |

Rozetler `timeline.js` → `badges` ile ekranın sağ üstünde görünür: `{from, to, k: 'belge'|'tartismali'|'rivayet'|'dogrulanacak', src}`. `src` en fazla ~40 karakterlik bir **dayanak etiketidir**: kaynak ("Âşıkpaşazâde, ~1480") ya da iddianın özeti ("Kösedağ · 26 Haziran 1243").

**Rozet iddiaya verilir, olaya değil.** "Bu rüya ilk kez 15. yüzyıl kroniklerinde görülür" cümlesi 🟢'dür, rüyanın kendisi 🔴 olsa bile. "Bizans kaynaklarında doğrulanmaz" da 🟢'dür.

## FACTS.md (her bölüm klasöründe)
Ekrandaki her tarih, rakam, isim, unvan, alıntı ve harita değişikliği bir satırdır. Biçim: [references/facts-sablonu.md](references/facts-sablonu.md).
Satırlar senaryodan önce yazılır, senaryo yazılırken güncellenir. Kalite kontrolünde ekrandaki her yazı bu tabloyla karşılaştırılır. Bunun nedeni şu: kodla çizilen animasyon "makul görünür" ama doğrulanmış tarih değildir. Referans incelemesindeki bir vaka, inşaat sırasını tamamen uydurmuştu.

## Harita sahipliği
`osmanli-serisi/ortak/sahiplik.js` modern il ve bölge birimlerini yıla göre bir güce boyar.
- Her yeni satır ya da tarih değişikliği için `FACTS.md`'ye bir satır ekle: hangi il, hangi yıl, dayanak, güven.
- Kesin olmayan tarihleri **uzun geçişle** ver: `[1361, 'OSM', 8]`, yani 1361–1369 arasında adım adım. Tek bir tarih uydurma.
- Ekranda her harita sahnesinde "YAKLAŞIK SINIRLAR" notu bulunur (sahne `note` alanı).
- Tabi devletler `'KOD/v'` ile taranır. Ordu büyüklüğü gibi kaynaklar arasında çok farklı rakamları ekrana yazma.

## Tarafsız dil
- Olayı tanımla, yargılama: "teslim aldı", "kuşattı", "müzakereyle aldı", "yenildi".
- Duygu müzikle verilir, anlatıcı yargıda bulunmaz.
- İki tarafın hafızası farklıysa (ör. Kosova'da Murad'ın ölümü) **iki tarafı yan yana** göster, birini seçme.
- Dizilerle karşılaştırmayı yalnızca gönderi açıklamasında yap. Videoda dizi görüntüsü ya da adı kullanılmaz.
- Portre yok: Kişileri siluet, sancak, sikke ve mühürle anlat. Dönemine uymayan bayrak ya da sembol kullanma (ör. erken Osmanlı için ay-yıldızlı bayrak yok).

## Hassas başlıklar
`osmanli-serisi/TUM-OLAY-ORGUSU.md` içindeki hassas başlıklar tablosuna uy. 1915 olayları için kullanıcının kararı (a: bölüm yok / b: çok kaynaklı, hukuki incelemeli bölüm) gelmeden metin yazma.

## Çıktı
- Bölümün **araştırma notu:** `ARASTIRMA.md`'ye eklenir; her madde rozetli ve köşeli parantezli kaynak listesiyle.
- Bölüm klasöründe **`FACTS.md`**.
- Kullanıcıya kısa özet: "Bu bölümde 🟢 7, 🟡 3, 🔴 1 iddia var; ⚪ kalmadı. Tartışmalı noktalar: …"
