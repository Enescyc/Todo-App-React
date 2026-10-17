# Bölüm 2 – "Osmanlı'nın Alamadığı Kasaba: Peraşt" (hedef 38–40 sn)

## Geçen bölümden alınan dersler → bu bölümde düzeltmeler
| Geçen sefer | Bu sefer |
|---|---|
| Ses 47.6 sn geldi, %15 hızlandırmak zorunda kaldık | **86 kelime** (≈2.2 kelime/sn ile ~39 sn). Her satır için hedef süre verildi |
| Ses tek dosyaydı; satırlar sessizlik tahminiyle eşlendi | **Satır satır 12 dosya** (01–12.mp3) → kesin senkron, tahmin yok |
| Anlatım olay listesi gibiydi ("70 gemi… zincir… plan…") | **Tek bir soru** hikâyeyi taşıyor: *"Neden alamadı?"* Karşı karşıya iki taraf (Peraştlılar ↔ Mehmed Ağa), bir dönüm noktası, bir sonuç ve açık bırakılan bir merak kancası |
| Doğrulanmamış ayrıntı riski | Çelişkili rakamlar temkinli söyleniyor ("altı bine yakın", "yüz kişiyi bile bulmayan"); doğrulanamayan "tek kurşun / müzedeki tüfek" çıkarıldı |
| Portre (Fatih) "mantar" gibi göründü | Gerçekçi portre yok: **sembol** kullanılıyor (tuğlu sancak, Venedik aslanı, çan kulesi) |
| Gece sahnesi kalabalık ve karanlıktı | **Her sahnede tek odak noktası**; telefonda okunur büyük formlar; ışık daha parlak |
| Altyazı kelime gruplarında tuhaf bölünmeler ("ASKER,") | Altyazı grupları **senaryoda elle** belirlendi (aşağıda `/` ile) |
| Altyazı Instagram arayüzüne yakındı | Altyazı **y≈1350**'de; alt %18'lik şerit ve sağdaki buton sütunu boş bırakıldı |

---

## Anlatım metni (yalın sürüm + altyazı grupları)
`/` = altyazı grubu sınırı · hedef süreler toplamı ≈ 38 sn

| # | Hedef | Metin |
|---|---|---|
| 01 | 4.0 sn | Osmanlı, Karadağ'ı / yüzyıllarca yönetti. / Ama bu küçük kasabayı... / asla alamadı. |
| 02 | 3.6 sn | Kotor Körfezi / ikiye bölünmüştü: / girişi Osmanlı'da... / içi Venedik'te. |
| 03 | 2.8 sn | Ve tam ortada, / denizcilerin kasabası / Peraşt vardı. |
| 04 | 3.0 sn | Peraştlılar, Osmanlı'yı / komşu Risan'dan / söküp attı. |
| 05 | 2.8 sn | Cevap, / bin altı yüz elli dört / baharında geldi. |
| 06 | 4.0 sn | Risan'ın sürgündeki dizdarı / Mehmed Ağa, / altı bine yakın askerle / yürüdü. |
| 07 | 3.0 sn | Karşısında... / yüz kişiyi bile bulmayan / bir savunma. |
| 08 | 2.6 sn | Evler yanıyordu. / Kasaba / düşmek üzereydi. |
| 09 | 2.4 sn | Ve sonra... / Mehmed Ağa / vuruldu. |
| 10 | 2.6 sn | Komutanını kaybeden ordu / geri çekildi. |
| 11 | 4.6 sn | Peraşt düşmedi. / Otuz üç yıl sonra / Osmanlı, körfezden / tamamen çekildi. |
| 12 | 2.6 sn | Peki dağlardaki Karadağlılar? / Sıradaki bölümde. |

---

## ElevenLabs – Eleven v3 (önerilen)
**Ayarlar:** önceki ses ("Deniz S. – Bass-Baritone"), Stability **Natural**, Speed **1.0**.
**Önemli:** Her satırı **ayrı üretin** ve `01.mp3` … `12.mp3` olarak kaydedin. Bir satır hedef süreden 0.5 sn'den fazla uzun çıkarsa o satırı yeniden üretin ya da Speed'i 1.05 yapın.

```
01  [calm, intriguing] Osmanlı, Karadağ'ı yüzyıllarca yönetti. [short pause] Ama bu küçük kasabayı... [emphasized] asla alamadı.
02  [storytelling] Kotor Körfezi ikiye bölünmüştü: girişi Osmanlı'da... içi Venedik'te.
03  [warm] Ve tam ortada, denizcilerin kasabası... Peraşt vardı.
04  [bold] Peraştlılar, Osmanlı'yı komşu Risan'dan söküp attı.
05  [ominous] Cevap... bin altı yüz elli dört baharında geldi.
06  [serious, building] Risan'ın sürgündeki dizdarı Mehmed Ağa, altı bine yakın askerle yürüdü.
07  [low] Karşısında... yüz kişiyi bile bulmayan bir savunma.
08  [tense, urgent] Evler yanıyordu. Kasaba düşmek üzereydi.
09  [whispers] Ve sonra... [dramatic] Mehmed Ağa vuruldu.
10  [serious] Komutanını kaybeden ordu, geri çekildi.
11  [proud, slow] Peraşt düşmedi. [short pause] Otuz üç yıl sonra Osmanlı, körfezden tamamen çekildi.
12  [curious] Peki dağlardaki Karadağlılar? [short pause] Sıradaki bölümde.
```

## ElevenLabs – Multilingual v2 (alternatif)
Stability 0.35 · Similarity 0.80 · Style 0.40 · Speaker Boost açık. Yine satır satır üretin. Satır içi duraklama: `<break time="0.3s" />`.

---

## Sahne planı (storyboard)
Sesin gerçek süresi gelince saniyeler yeniden ayarlanacak; sahneler satırlara bağlı.

| Sahne | Satır | ~Zaman | Görsel | Ekran yazısı | Ses / müzik |
|---|---|---|---|---|---|
| **1 · Kanca** | 01 | 0–4 | Gece, alçak açı. Körfezin suyunda yansıyan Peraşt silüeti: **çan kulesi**, iki adacık (kubbeli kilise + selvili ada), arkada dik dağ. Kamera yavaşça yaklaşır. "asla alamadı" sözünde kasabanın üstüne **kırmızı bir harita iğnesi** düşer | `OSMANLI'NIN ALAMADIĞI KASABA` | Düşük drone sesi, tek kös vuruşu "asla"da |
| **2 · Karadağ haritası** | 01 sonu–02 | 4–8 | Balkanlar haritası, Karadağ **kırmızıya** boyanır, damga `1496–1878`. Kamera Kotor Körfezi'ne dalar. Körfez ikiye ayrılır: giriş (Herceg Novi, Risan) **kırmızı + hilal**, iç kısım (Kotor, Peraşt) **altın + Venedik aslanı** | `OSMANLI` / `VENEDİK` | Kâğıt hışırtısı, "whoosh" |
| **3 · Peraşt** | 03 | 8–11 | Haritada Peraşt'a yakın plan, **Verige Boğazı** (en dar nokta) işaretli. Kesme: sabah ışığında Peraşt rıhtımı, yelkenli gemiler, çan kulesi | `PERAŞT · DENİZCİLER KASABASI` | Martı + deniz sesi, ud motifi |
| **4 · Kıvılcım** | 04 | 11–14 | Harita: Peraşt'tan Risan'a altın ok. Risan'daki Osmanlı sancağı düşer, Venedik sancağı çıkar | `1648–49 · RİSAN` | Kısa davul geçişi |
| **5 · Cevap** | 05–06 | 14–21 | Sinematik: şafak öncesi dağlar. Sırttan aşağı inen **meşale kolları** (ordu); önde tuğlu sancak, komutan siluetiyle. "altı bine yakın"da ekran ikiye bölünür: solda yüzlerce kırmızı nokta | `1654 BAHARI` → `MEHMED AĞA` | Mehter davulu başlar, giderek hızlanır |
| **6 · Dengesizlik** | 07 | 21–24 | Bölünmüş ekranın sağında **avuç kadar altın nokta**. Rakamlar sayarak büyür: `~6.000` ↔ `~100` | `6.000 ↔ 100` | Davul susar, tek tel gerilimi |
| **7 · Yangın** | 08 | 24–27 | Peraşt sokakları: turuncu ateş ışığı, duman, kıvılcımlar. **Çan kulesi alarm verir** (çan sallanır) | `KASABA DÜŞMEK ÜZERE` | Çan, ateş çıtırtısı, kalabalık uğultusu |
| **8 · Dönüm noktası** | 09 | 27–30 | Ağır çekim: kuleden **tüfek parıltısı** (kan/şiddet gösterilmez), tuğlu sancak ağır çekimde yere düşer. Ekran bir an susar | `VURULDU` | Sessizlik → tek kös → reverb |
| **9 · Geri çekilme** | 10 | 30–33 | Harita: kırmızı oklar dağlara doğru geri döner; yangınlar söner | — | Müzik açılır |
| **10 · Sonuç** | 11 | 33–37 | Peraşt'a **"HİÇ DÜŞMEDİ"** mührü basılır. Zaman çizgisi `1654 → 1687`; körfezin girişi de altına döner (Osmanlı çekilir) | `PERAŞT HİÇ DÜŞMEDİ` · `1687` | Zafer akoru, zil |
| **11 · Kanca / CTA** | 12 | 37–40 | Kamera körfezden yükselir, arkadaki **sisli Karadağ dağları**. Kart: `SIRADAKİ: Osmanlı ve Karadağ'ın dağları` + `TAKİP ET` | — | Müzik açık kalır (merak) |

### Görsel kurallar (bu bölüm için)
- Renk kodu her yerde aynı: **Osmanlı = kırmızı**, **Venedik/Peraşt = altın**.
- Harita doğruluğu: Kotor Körfezi'nin gerçek biçimi (Herceg Novi girişi → Kumbor → Tivat → **Verige** → iç körfezler: batıda **Risan**, güneydoğuda **Kotor**; Peraşt Verige'nin hemen içinde, kuzey kıyıda; iki adacık Peraşt'ın önünde).
- Her sahnede tek odak noktası; büyük formlar; yazılar ekranın üst yarısında.
- Şiddet sembolle anlatılır (düşen sancak, sönen ateş). Taraflardan biri küçümsenmez.

## Kaynaklar
Ayrıntılı notlar ve bağlantılar: [ARASTIRMA.md](ARASTIRMA.md)
