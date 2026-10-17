# Ses kütüphanesi (CC0)
48 ses, hepsi **CC0 1.0 (kamu malı)**: ticari kullanım serbest, atıf zorunlu değil (yine de açıklamada teşekkür önerilir).
Kaynak: Versilian Studios – [VCSL](https://github.com/sgossner/VCSL) ve [VSCO 2 CE](https://github.com/sgossner/VSCO-2-CE).
Her sesin kaynak dosyası `KAYNAKLAR.tsv`'de, süresi ve seviyesi `katalog.json`'da.

| Klasör | İçerik |
|---|---|
| `vurus/` | timpani, büyük davul, gong, zil vuruşları: sahne vurguları ve doruk anları |
| `gecis/` | yükselen ziller (2/4/7.5 sn), yayla çalınan zil, gong sürtme: geçişler ve gerilim |
| `metal/` | zincir, örs, metal vuruş, taş sürtünmesi |
| `can/` | tüp çanlar (Bizans kilisesi, alarm) |
| `ritim/` | darbuka, def, çerçeve davul rulosu, askerî trampet: Anadolu ve Osmanlı ritmi |
| `doga/` | dalga (ocean drum), ortam |
| `doku/` | kadeh tınısı, Nepal çanları: rivayet ve rüya anları |
| `muzik/` | çello, kontrbas, keman ve korno uzun notaları (re minör zemin): sentez pedlerin yerine |

**Eksik olanlar (saha kaydı / foley):** at, kalabalık/ordu, kılıç şakırtısı, ateş, rüzgâr, kuş, kalem cızırtısı.
Bunlar CC0 olarak bu ortamdan erişilebilen kaynaklarda bulunamadı → Pixabay (ücretsiz, ticari kullanıma açık) ya da Epidemic Sound'dan seçilip `shared/sfx/foley/` altına eklenecek.

Yeniden üretmek için: `python3 shared/tools/build_sfx_library.py <klon-klasörü>` · dinleme dosyası için: `python3 shared/tools/audition_sfx.py <çıktı-klasörü>`
