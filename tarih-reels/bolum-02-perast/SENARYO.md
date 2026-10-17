# Bölüm 2 – "Osmanlı'nın Alamadığı Kasaba: Peraşt" (hedef ~70–75 sn)

## Geçen bölümden alınan dersler → bu bölümde düzeltmeler
| Geçen sefer | Bu sefer |
|---|---|
| Ses 47.6 sn geldi, %15 hızlandırmak zorunda kaldık | Süre baştan planlandı: **168 kelime ≈ 70–75 sn**, hızlandırma yok |
| Ses tek dosyaydı; satırlar sessizlik tahminiyle eşlendi | **6 paragraf = 6 dosya** (p1–p6.mp3): paragraf içinde doğal akış, paragraflar arasında kesin senkron |
| Anlatım olay listesi gibiydi; kısa, kopuk cümleler ve fazla "…" / etiket akışı bölüyordu | **Akan belgesel anlatımı**: cümleler bağlaçlarla birbirine bağlanıyor ("Çünkü…", "Ve…", "Ama…"), etiket yalnızca paragraf başında. **Tek bir soru** hikâyeyi taşıyor: *"Neden alamadı?"* Karşı karşıya iki taraf (Peraştlılar ↔ Mehmed Ağa), bir dönüm noktası, bir sonuç ve açık bırakılan bir merak kancası |
| Doğrulanmamış ayrıntı riski | Çelişkili rakamlar temkinli söyleniyor ("altı bine yakın", "yüz kişiyi bile bulmayan"); doğrulanamayan "tek kurşun / müzedeki tüfek" çıkarıldı |
| Portre (Fatih) "mantar" gibi göründü | Gerçekçi portre yok: **sembol** kullanılıyor (tuğlu sancak, Venedik aslanı, çan kulesi) |
| Gece sahnesi kalabalık ve karanlıktı | **Her sahnede tek odak noktası**; telefonda okunur büyük formlar; ışık daha parlak |
| Altyazı kelime gruplarında tuhaf bölünmeler ("ASKER,") | Altyazı anlam bütünlüğüne göre gruplanır: önce virgül ve noktaya göre bölünür, grup başına en çok 4 kelime |
| Altyazı Instagram arayüzüne yakındı | Altyazı **y≈1350**'de; alt %18'lik şerit ve sağdaki buton sütunu boş bırakıldı |

---

## Anlatım metni (akan sürüm, 6 paragraf)

**1 · Kanca** (~9 sn)
Osmanlı, Karadağ'ı dört asra yakın yönetti. Ama Kotor Körfezi'nin kıyısında, gözünün önünde duran küçücük bir kasaba, hiçbir zaman Osmanlı'nın olmadı. Adı Peraşt'tı.

**2 · Bölünmüş körfez** (~13 sn)
Çünkü körfez ikiye bölünmüştü: denize açılan girişini bin dört yüz seksen ikiden beri Osmanlı tutuyordu, dağların arasına sokulan iç sularıysa Venedik'in elindeydi. Peraşt, tam bu sınırın üzerinde, denizcileriyle ünlü bir Venedik kasabasıydı.

**3 · Kıvılcım** (~9 sn)
Ve Peraştlılar yalnızca savunmakla yetinmedi. Bin altı yüz kırk sekizde, komşu Risan'daki Osmanlı garnizonunu oradan söküp attılar. Bunun cevapsız kalmayacağını herkes biliyordu.

**4 · Saldırı** (~16 sn)
On beş Mayıs, bin altı yüz elli dört. Risan'dan sürülen dizdar Mehmed Ağa, altı bine yakın askerle Peraşt'a yürüdü. Karşısında yüz kişiyi bile bulmayan bir savunma vardı. Saldırganlar sokaklara girdi, evler alev aldı ve kasaba düşmenin eşiğine geldi.

**5 · Dönüm noktası** (~11 sn)
Ama savaşın en kızgın anında Mehmed Ağa vuruldu. Komutanını kaybeden ordu geri çekildi ve Peraşt ayakta kaldı. Otuz üç yıl sonra ise Osmanlı, Kotor Körfezi'nden tamamen çekilecekti.

**6 · Kapanış + merak kancası** (~11 sn)
Peraştlılar o günü bugün hâlâ her on beş Mayıs'ta kutluyor. Peki, Osmanlı'nın yönettiği ama hiçbir zaman tam olarak boyun eğdiremediği Karadağ dağları? Onların hikâyesi, bir sonraki bölümde.

> Doğruluk notu: "1648" kaynaklarda "1648–49"; "yüz kişiyi bile bulmayan" en yüksek tahmin (~100) baz alınarak; "evler alev aldı" yerel anlatıma dayanır; "1687 körfezden çekiliş" = Venedik'in Herceg Novi'yi alması. Ayrıntılar: ARASTIRMA.md

---

## ElevenLabs – Eleven v3
**Ayarlar:** aynı ses ("Deniz S. – Bass-Baritone"), Stability **Natural**, Speed **1.0**.
**Her paragrafı ayrı üretin:** `p1.mp3` … `p6.mp3`. Etiket yalnızca paragraf başında; cümle içinde "…" yok. Böylece okuma akıcı kalır.

```
p1  [calm, storytelling] Osmanlı, Karadağ'ı dört asra yakın yönetti. Ama Kotor Körfezi'nin kıyısında, gözünün önünde duran küçücük bir kasaba, hiçbir zaman Osmanlı'nın olmadı. Adı Peraşt'tı.

p2  [storytelling] Çünkü körfez ikiye bölünmüştü: denize açılan girişini bin dört yüz seksen ikiden beri Osmanlı tutuyordu, dağların arasına sokulan iç sularıysa Venedik'in elindeydi. Peraşt, tam bu sınırın üzerinde, denizcileriyle ünlü bir Venedik kasabasıydı.

p3  [storytelling, slightly tense] Ve Peraştlılar yalnızca savunmakla yetinmedi. Bin altı yüz kırk sekizde, komşu Risan'daki Osmanlı garnizonunu oradan söküp attılar. Bunun cevapsız kalmayacağını herkes biliyordu.

p4  [serious, building tension] On beş Mayıs, bin altı yüz elli dört. Risan'dan sürülen dizdar Mehmed Ağa, altı bine yakın askerle Peraşt'a yürüdü. Karşısında yüz kişiyi bile bulmayan bir savunma vardı. Saldırganlar sokaklara girdi, evler alev aldı ve kasaba düşmenin eşiğine geldi.

p5  [dramatic, then calm] Ama savaşın en kızgın anında Mehmed Ağa vuruldu. Komutanını kaybeden ordu geri çekildi ve Peraşt ayakta kaldı. Otuz üç yıl sonra ise Osmanlı, Kotor Körfezi'nden tamamen çekilecekti.

p6  [reflective, curious] Peraştlılar o günü bugün hâlâ her on beş Mayıs'ta kutluyor. Peki, Osmanlı'nın yönettiği ama hiçbir zaman tam olarak boyun eğdiremediği Karadağ dağları? Onların hikâyesi, bir sonraki bölümde.
```
Multilingual v2 kullanılırsa: etiketleri silin, aynı metni aynı paragraf bölümüyle üretin.

---

## Sahne planı (storyboard)
Paragraf süreleri ses gelince kesinleşecek; sahneler cümlelere bağlı. Geçişler sert kesme değil, **kamera hareketiyle akar** (harita ↔ sahne geçişleri zoom ile).

| Par. | Cümle / an | Görsel | Ekran yazısı | Ses |
|---|---|---|---|---|
| **1** | "dört asra yakın yönetti" | Balkanlar haritası; Karadağ kırmızıya boyanır | `1496 – 1878` | Düşük drone |
| | "küçücük bir kasaba…" | Haritadan dalış → gece, suda yansıyan Peraşt: **çan kulesi**, iki adacık, dik dağ. Kamera yavaşça yaklaşır | — | Deniz, uzak çan |
| | "Adı Peraşt'tı." | Kasabanın üstüne başlık iner | `PERAŞT` | Tek kös |
| **2** | "körfez ikiye bölünmüştü" | Kamera yükselir → Kotor Körfezi haritası (gerçek biçim). Giriş (Herceg Novi, Risan) **kırmızı + hilal**, iç sular (Kotor) **altın + Venedik aslanı**; sınır çizgisi çizilir | `OSMANLI · 1482` / `VENEDİK` | Kâğıt, whoosh |
| | "tam bu sınırın üzerinde" | Peraşt'a iğne; **Verige Boğazı** vurgulanır. Kesme: gündüz rıhtım, yelkenliler, kaptanlar | `DENİZCİLER KASABASI` | Martılar, ud motifi |
| **3** | "yetinmedi… söküp attılar" | Harita: Peraşt'tan Risan'a altın ok; Risan'daki kırmızı sancak düşer | `1648 · RİSAN` | Davul vuruşu |
| | "cevapsız kalmayacağını" | Dağların üstünde kararan gökyüzü, uzakta tek meşale | — | Gerilim teli |
| **4** | "15 Mayıs 1654" | Tarih damgası | `15 MAYIS 1654` | Kös |
| | "Mehmed Ağa… yürüdü" | Şafak öncesi dağ sırtından inen **meşale kolları**; önde **tuğlu sancak** (portre yok) | `MEHMED AĞA` | Mehter davulu başlar |
| | "yüz kişiyi bile bulmayan" | Bölünmüş ekran: solda yüzlerce kırmızı nokta, sağda avuç kadar altın nokta; sayaç | `~6.000 ↔ ~100` | Davul durur, tek tel |
| | "sokaklara girdi, evler alev aldı" | Peraşt sokakları, turuncu ateş, duman; **çan kulesi alarm verir** | `KASABA DÜŞMEK ÜZERE` | Çan, ateş, uğultu |
| **5** | "Mehmed Ağa vuruldu" | Ağır çekim: kuleden tüfek parıltısı → tuğlu sancak düşer (kan yok) | — | Sessizlik → kös → reverb |
| | "geri çekildi… ayakta kaldı" | Harita: kırmızı oklar dağlara döner; yangınlar söner, şafak | `PERAŞT DÜŞMEDİ` (mühür) | Müzik açılır |
| | "Otuz üç yıl sonra" | Zaman çizgisi `1654 → 1687`; körfezin girişi de altına döner | `1687` | Zafer akoru |
| **6** | "15 Mayıs'ta kutluyor" | Bugünkü Peraşt, gün batımı, rıhtımda bayrak/kutlama siluetleri, adacıklar | `HER 15 MAYIS` | Sıcak, sakin müzik |
| | "Karadağ dağları?" | Kamera körfezden yükselir, sisli Karadağ dağları | `SIRADAKİ: KARADAĞ'IN DAĞLARI` + `TAKİP ET` | Açık kalan akor |

### Görsel kurallar
- Renk kodu: **Osmanlı = kırmızı**, **Venedik/Peraşt = altın**.
- Harita doğruluğu: Herceg Novi girişi → Kumbor → Tivat → **Verige** → iç körfezler (batıda **Risan**, güneydoğuda **Kotor**). Peraşt Verige'nin hemen içinde, kuzey kıyıda; iki adacık önünde.
- Her sahnede tek odak; büyük formlar; yazılar üst yarıda. Altyazı y≈1350, alt %18 ve sağ kenar boş.
- Şiddet sembolle anlatılır; taraflardan biri küçümsenmez.

## Kaynaklar
Ayrıntılı notlar ve bağlantılar: [ARASTIRMA.md](ARASTIRMA.md)
