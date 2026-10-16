# Seslendirme metni – "Gemiler Karadan Yürür" (≈38 sn)

ElevenLabs önerisi: derin/tok erkek belgesel sesi · Multilingual v2/v3 · Stability ~%40 · Similarity ~%75 · Style ~%30.
Her satırı ayrı dosya olarak indirin: `vo/01.mp3` … `vo/12.mp3`. `make_audio.py` her birini aşağıdaki başlangıç saniyesine yerleştirir.
(Tek dosya da olur: `vo/full.mp3`.) Sayılar bilerek yazıyla yazılmıştır.

| # | Başlangıç–bitiş (sn) | Metin |
|---|---|---|
| 01 | 0.2 – 3.4 | Yetmiş savaş gemisi… tek bir gecede, karadan yürüdü. |
| 02 | 3.7 – 7.3 | Yıl, bin dört yüz elli üç. Fatih Sultan Mehmed, İstanbul’u kuşatmıştı. |
| 03 | 7.6 – 10.4 | Ama Haliç’in ağzı, dev bir zincirle kapatılmıştı. |
| 04 | 10.6 – 13.1 | Osmanlı donanması, içeri giremiyordu. |
| 05 | 13.5 – 17.2 | Yirmi bir yaşındaki padişah, kimsenin aklına gelmeyeni düşündü: |
| 06 | 17.5 – 19.5 | Gemiler… karadan geçecekti! |
| 07 | 19.9 – 24.2 | Yağlanmış kütükler döşendi. Öküzler ve binlerce asker, gemileri tepelere çekti. |
| 08 | 24.4 – 27.3 | Yelkenler açık… davullar çalarak! |
| 09 | 27.7 – 31.5 | Sabah Bizanslılar uyandığında… Osmanlı gemileri, Haliç’in içindeydi! |
| 10 | 31.8 – 33.4 | Savunma, ikiye bölündü. |
| 11 | 33.7 – 36.0 | Ve yirmi dokuz Mayıs’ta… İstanbul fethedildi. |
| 12 | 36.3 – 38.9 | Bir çağ kapandı. Yeni bir çağ açıldı. |

## Tarihî notlar (doğruluk kontrolü)
- Kuşatma 6 Nisan 1453'te başladı; Haliç'in girişi Bizanslılarca zincirle kapatılmıştı.
- 20 Nisan'da birkaç Hristiyan gemisi Osmanlı donanmasını yarıp Haliç'e girdi; bu, Fatih'i karadan geçiş planına itti.
- 21–22 Nisan gecesi ~70 gemi (kaynaklarda 67–72) Galata'nın arkasındaki tepelerden yağlanmış kütükler üzerinde Kasımpaşa'ya indirildi.
- Kritovulos ve Dukas: gemilerde yelkenler açılmış, kürekçiler havada kürek çekiyor, davul ve zurna çalınıyordu.
- Haliç'teki gemiler Bizans'ı deniz surlarına da asker ayırmaya zorladı; şehir 29 Mayıs 1453'te fethedildi.
- Fatih o sırada 21 yaşındaydı (d. 30 Mart 1432). Fetih, Orta Çağ'ın sonu kabul edilir.

## ElevenLabs – Sürüm A: Eleven v3 (önerilen, duygu etiketli)
Stability: "Creative" veya "Natural". Köşeli parantezler okunmaz, tonu yönetir.

```
[dramatic] Yetmiş savaş gemisi... [pause] tek bir gecede... [emphasized] KARADAN yürüdü.

[serious] Yıl... bin dört yüz elli üç. Fatih Sultan Mehmed, İstanbul'u kuşatmıştı.

[tense] Ama Haliç'in ağzı... dev bir ZİNCİRLE kapatılmıştı.

[frustrated] Osmanlı donanması... içeri giremiyordu.

[low, mysterious] Yirmi bir yaşındaki padişah... kimsenin aklına gelmeyeni düşündü:

[excited, emphasized] Gemiler... KARADAN geçecekti!

[storytelling] Yağlanmış kütükler döşendi. Öküzler ve binlerce asker, gemileri tepelere çekti.

[epic, rising] Yelkenler açık... davullar çalarak!

[whispers] Sabah, Bizanslılar uyandığında... [pause] [dramatic] Osmanlı gemileri, HALİÇ'İN İÇİNDEYDİ!

[serious] Savunma... ikiye bölündü.

[epic] Ve yirmi dokuz Mayıs'ta... İstanbul, fethedildi.

[slow, majestic] Bir çağ kapandı. [pause] Yeni bir çağ... açıldı.
```

## ElevenLabs – Sürüm B: Multilingual v2 (SSML duraklamalı)
Stability 0.35 · Similarity 0.80 · Style 0.40 · Speaker Boost açık.

```
Yetmiş savaş gemisi... <break time="0.4s" /> tek bir gecede, karadan yürüdü!
<break time="0.5s" />
Yıl, bin dört yüz elli üç. <break time="0.3s" /> Fatih Sultan Mehmed, İstanbul'u kuşatmıştı.
<break time="0.3s" />
Ama Haliç'in ağzı, dev bir zincirle kapatılmıştı.
<break time="0.2s" />
Osmanlı donanması, içeri giremiyordu.
<break time="0.6s" />
Yirmi bir yaşındaki padişah, kimsenin aklına gelmeyeni düşündü:
<break time="0.4s" />
Gemiler... karadan geçecekti!
<break time="0.5s" />
Yağlanmış kütükler döşendi. Öküzler ve binlerce asker, gemileri tepelere çekti.
<break time="0.2s" />
Yelkenler açık... davullar çalarak!
<break time="0.6s" />
Sabah Bizanslılar uyandığında... <break time="0.5s" /> Osmanlı gemileri, Haliç'in içindeydi!
<break time="0.4s" />
Savunma, ikiye bölündü.
<break time="0.3s" />
Ve yirmi dokuz Mayıs'ta... İstanbul fethedildi!
<break time="0.5s" />
Bir çağ kapandı. <break time="0.4s" /> Yeni bir çağ açıldı.
```

İpucu: Tek dosya olarak üretin (`vo/full.mp3`); animasyon sesin gerçek zamanlamasına göre hizalanır. Hedef 36–40 sn; uzun çıkarsa Speed 1.05–1.1.
