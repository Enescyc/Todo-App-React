#!/usr/bin/env python3
"""Anlatım dili ölçümü: YouTube transkriptleri (.vtt/.srt/.txt) ya da bizim timeline.js metinlerimiz.

Kullanım: python3 shared/tools/anlatim_analiz.py <dosya|klasör> [...] [--md çıktı.md] [--hedef]
  --hedef    : her dosyayı osmanli-serisi/ANLATICI-DILI.md §12'deki hedef aralıklarla karşılaştırır (timeline.js için kendiliğinden açık)
  .vtt/.srt  : zaman damgalı altyazı (yt-dlp --write-auto-subs --sub-langs tr ya da YouTube "Transkripti göster" kopyası)
  .txt       : düz metin (YouTube transkript kopyasındaki "0:12" satırları da zaman olarak okunur)
  timeline.js: bizim bölümlerimiz (paras[].text; hız Emrullah Uzun ~2.0 kelime/sn varsayılır)

Ölçtükleri (nicel; nitel analiz için iskelet: strateji/ANLATIM-ANALIZI.md):
  hız (kelime/dk) · cümle uzunluğu (ortalama, medyan, ≤5 kelimelik vurucu ve >20 kelimelik uzun cümle oranı) · soru oranı
  · izleyiciye hitap (siz/sen, bakın, düşünün, hayal edin…) · "biz" dili · anlatı zamanı (cümle sonu yüklemi: şimdiki/geniş/geçmiş/-mış/gelecek/isim)
  · geçiş kelimeleri (ama, peki, yani, işte, çünkü…) · merak kalıpları (peki, neden, nasıl, asıl, birazdan…) · ünlem
  · sayılar · sözcük çeşitliliği · ilk 3 cümle (kanca) ve son 2 cümle (kapanış)
  · ilk/son/en uzun cümle (kelime) · kaynak tartışması kelimeleri (kronik, belge, kayıt, kaynak, tarihçi) · yasak ve klişe kelimeler
Sürüm 2 (21 Ekim 2026): "-yordu" ve "-mıştı" geçmiş sayılır (şimdiki ve -mış sütunları yalnızca şimdiki zamanı ve rivayet kipini
gösterir); cümle sonu "-dır/-tır" (ve "-mıştır") ayrı "kitap" sütununa gider (sürüm 1'de geniş zamana düşüyordu); ikinci tekil
hitap ekleri (-iyorsun, -eceksin, -saydın, düşünsene…) ve "biz" iyelikleri (elimizde, bildiğimiz) sayılır; merak kalıplarına
"kim, nerede, hangi" eklendi. Kanal raporlarındaki (strateji/anlatim/) değerler sürüm 1'dir.
Türkçe biçimbilim için kaba düzenli ifadeler kullanır: sonuçlar karşılaştırma içindir, dilbilimsel kesinlik iddiası yoktur.
"""
import json, os, re, subprocess, sys
from collections import Counter

TS = re.compile(r"(\d{1,2}):(\d{2})(?::(\d{2}))?(?:[.,](\d{1,3}))?")


def secs(m):
    a, b, c, f = m.groups()
    h, mnt, s = (int(a), int(b), int(c)) if c else (0, int(a), int(b))
    return h * 3600 + mnt * 60 + s + (int(f) / 10 ** len(f) if f else 0)


def read(path):
    """→ (metin, süre_sn | None, kaynak türü)"""
    if path.endswith("timeline.js"):
        out = subprocess.run(["node", "-e", "global.window={};eval(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(JSON.stringify(window.EP.paras.map(p=>[p.text,p.pause||0])))", path], capture_output=True, text=True, check=True).stdout
        P = json.loads(out); text = " ".join(t for t, _ in P)
        return text, len(text.split()) / 2.0 + sum(x for _, x in P), "bizim (tahmini 2.0 kel/sn + harita sessizlikleri)", [t for t, _ in P]
    raw = open(path, encoding="utf-8", errors="replace").read()
    lines, times, prev = [], [], None
    for L in raw.splitlines():
        s = L.strip()
        if not s or s.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")) or s.isdigit(): continue
        if "-->" in s:
            for m in TS.finditer(s): times.append(secs(m))
            continue
        if TS.fullmatch(s): times.append(secs(TS.fullmatch(s))); continue    # YouTube transkript kopyası: "0:12" satırları
        s = re.sub(r"<[^>]+>", "", s); s = re.sub(r"\[(müzik|music|alkış|applause)[^\]]*\]", "", s, flags=re.I).strip()
        if s and s != prev: lines.append(s); prev = s                         # otomatik altyazıdaki kayan tekrarları at
    text = " ".join(lines)
    # otomatik altyazı tekrarları: bir satır öncekinin sonuyla başlıyorsa üst üste binen kısmı at
    dur = (max(times) - min(times)) if len(times) > 1 else None
    paras = lines if path.endswith(".txt") and not times else None    # düz metin taslağı: her satır bir paragraf
    return text, dur, "transkript", paras


V = "aeıioöuüâîû"
NUMW = {"sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on", "yirmi", "otuz", "kırk", "elli", "altmış",
        "yetmiş", "seksen", "doksan", "yüz", "bin", "milyon", "milyar"}
def words(t): return re.findall(r"[\wçğıöşüâîûÇĞİÖŞÜÂÎÛ'’]+", t)


def analyse(path):
    text, dur, kind, paras = read(path)
    w = words(text); n = len(w); lw = [x.lower().replace("’", "'") for x in w]
    sents = [s.strip() for s in re.split(r"(?<=[.!?…])\s+", text) if s.strip()]
    auto_punct = len(sents) < max(3, n / 60)          # otomatik altyazıda noktalama çoğu zaman yok
    sl = [len(words(s)) for s in sents] if not auto_punct else []
    q = sum(1 for s in sents if s.endswith("?")) + sum(1 for x in lw if x in ("mi", "mı", "mu", "mü") or re.fullmatch(r"(mi|mı|mu|mü)(yd[ıiuü]|ydi|ydı|s[ıiuü]n(ız|iz|uz|üz)?|y[ıiuü]z)", x))
    hitap = sum(1 for x in lw if x in ("siz", "sen", "sizin", "senin", "size", "sana", "sizi", "seni", "sizce", "bakın", "bakalım", "düşünün", "düşünsenize", "hayal", "tahmin", "dikkat", "unutmayın", "görün", "inanır", "inanın"))
    hitap += sum(1 for x in lw if re.search(r"(sınız|siniz|sunuz|sünüz|ırsınız|irsiniz|ursunuz|ürsünüz|abilirsiniz|ebilirsiniz)(d[ıiuü]r)?$", x))
    hitap += sum(1 for x in lw if re.search(r"(ınız|iniz|unuz|ünüz)(dan|den|da|de|ı|i|u|ü|a|e|ın|in|un|ün)$", x) and len(x) > 7)   # sandığınızdan, avucunuza
    # ikinci tekil (Random Animasyon "sen" dili): yalnız yanlış pozitifi az olan biçimler; "olsun/versin" gibi 3. tekil emirler sayılmaz
    hitap += sum(1 for x in lw if re.search(r"([ıiuü]yorsun|(acak|ecek)s[ıi]n|(abilir|ebilir)s[ıi]n|(mal|mel)[ıi]s[ıi]n|(sa|se)yd[ıi]n|(sa|se)n[ıi]z|m[ıiuü]s[ıiuü]n|m[ıi]şs[ıi]n|(sana|sene|senize|sanıza))$", x) and len(x) > 5)
    biz = sum(1 for x in lw if x in ("biz", "bizim", "bize", "bizi", "hepimiz", "bizce")) + sum(1 for x in lw if re.search(r"(yoruz|acağız|eceğiz|alım|elim|dık|dik|duk|dük|tık|tik|tuk|tük)$", x) and len(x) > 4)
    biz += sum(1 for x in lw if re.search(r"(ımız|imiz|umuz|ümüz)(da|de|dan|den|daki|deki|ı|i|u|ü|a|e|ın|in|un|ün)?$", x) and len(x) > 5)   # elimizde, bildiğimiz
    # anlatı zamanı: Türkçe yüklem çoğunlukla cümle sonundadır → cümle sonu kelimelerinden (noktalama yoksa bütün kelimelerden, kaba)
    preds = [words(x)[-1].lower() for x in sents if words(x)] if not auto_punct else lw
    zaman = Counter()
    for x in preds:
        if re.search(r"(yor|m[ıiuü]ş)(d[uıü]|t[ıiuü])(m|n|k|nuz|lar|ler)?$", x): zaman["geçmiş"] += 1      # -yordu, -mıştı: hikâye ve arka plan
        elif re.search(r"[ıiuü]yor(um|sun|uz|sunuz|lar|muş|mış)?$", x): zaman["şimdiki"] += 1
        elif re.search(r"(acak|ecek)(t[ıi]r|lar|ler|t[ıi])?$", x): zaman["gelecek"] += 1
        elif re.search(r"(d|t)[ıiuü]r(lar|ler)?$", x) and len(x) > 3: zaman["kitap"] += 1                  # -dır/-tır, -mıştır: yazı dili
        elif re.search(r"m[ıiuü]ş(lar|ler)?$", x): zaman["mış"] += 1
        elif re.search(r"(d|t)[ıiuü](m|n|k|nız|niz|nuz|nüz|lar|ler)?$", x) and len(x) > 3: zaman["geçmiş"] += 1
        elif not auto_punct and re.search(r"(ar|er|ır|ir|ur|ür)(lar|ler)?$", x) and len(x) > 4 and x not in ("kadar", "bunlar", "onlar", "şunlar", "yer", "bir", "her", "var", "bazılar"): zaman["geniş"] += 1
        elif not auto_punct: zaman["isim/diğer"] += 1
    zt = max(1, sum(zaman.values()))
    gecis = Counter(x for x in lw if x in ("ama", "fakat", "ancak", "peki", "yani", "işte", "üstelik", "çünkü", "derken", "oysa", "sonra", "şimdi", "aslında", "hatta", "bile", "tabii"))
    merak = sum(1 for x in lw if x in ("peki", "neden", "nasıl", "niye", "kim", "nerede", "hangi", "acaba", "asıl", "birazdan", "sonra", "gizem", "sır", "kimse", "hiç"))
    # sayı: yazıyla yazılmış sayılar tek ifade sayılır ("bin dört yüz iki" = 1); tek başına "bir" (belirsizlik sıfatı) sayılmaz
    nums, grp = 0, []
    for x in lw + [""]:
        if re.fullmatch(r"\d+", x) or x in NUMW: grp.append(x); continue
        if grp and grp != ["bir"]: nums += 1
        grp = []
    # kaynak tartışması (ANLATICI-DILI.md §4: hikâye önde, kaynak arkada): anlatı kaynağı konu ediyorsa bu sayı büyür
    kaynak = sum(1 for x in lw if x.startswith(("kronik", "belge", "kayıt", "kayd", "kaynak", "tarihçi")))
    # yüklemsiz cümle adayı (ANLATICI-DILI.md §3.6): soru değil, sorunun cevabı değil, "Yıl …" açılışı değil ve son kelimesi
    # bir yüklem ekiyle bitmiyor. Kaba bir eleme: listede çıkan her cümleye elle bakılır.
    yuklemsiz = []
    if not auto_punct:
        for i, x in enumerate(sents):
            ws = [y.lower().replace("’", "'") for y in words(x)]
            if not ws or x.endswith("?") or (i and sents[i - 1].endswith("?")) or ws[0] == "yıl": continue
            last = ws[-1].split("'")[-1] if "'" in ws[-1] else ws[-1]
            if last in YUKLEM_KELIME or YUKLEM_EK.search(last): continue
            yuklemsiz.append(x)
    # paragraf köprüsü (ANLATICI-DILI.md §3.6 kural 9): her paragraf bir öncekine bağlanmalı. Bağ sayılanlar: ilk iki kelimede
    # bir bağlaç ya da gönderim sözü; ya da önceki paragrafın son iki cümlesiyle ortak bir içerik kökü (ilk 5 harf).
    bagsiz = []
    if paras:
        kok = lambda t: {x.lower()[:5] for x in words(t) if len(x) >= 5 and x.lower() not in DURAK}
        for a, b in zip(paras, paras[1:]):
            sa = [x for x in re.split(r"(?<=[.!?…])\s+", a) if x.strip()]; sb = [x for x in re.split(r"(?<=[.!?…])\s+", b) if x.strip()]
            ilk = [x.lower() for x in words(sb[0])[:2]] if sb else []
            if any(x in BAGLAC for x in ilk) or " ".join(ilk) in BAGLAC or (kok(" ".join(sa[-2:])) & kok(sb[0] if sb else "")): continue
            bagsiz.append(sb[0] if sb else b)
    # kip denetimi (ANLATICI-DILI.md §3.1): taban -dı; -mış yalnız rivayet paragrafında; -yor yalnız seslenme paragrafında;
    # aynı cümlede -mış ile -yor ya da -dı birleşmez. Yalnız yan cümle sonundaki fiillere bakılır ("vermiş ve", "büyüyor."),
    # "kuşatılmış şehri" gibi sıfat-fiiller sayılmaz.
    kip_uyari = []
    if not auto_punct:
        MIS = re.compile(r"[\wçğıöşüâîû']+m[ıiuü]ş(?:lar|ler)?(?=\s+(?:ve|ama)\b|[,;:.!?…])", re.I)
        YOR = re.compile(r"[\wçğıöşüâîû']+[ıiuü]yor(?:lar|um|uz|sun|sunuz)?(?=\s+(?:ve|ama)\b|[,;:.!?…])", re.I)
        DI = re.compile(r"[\wçğıöşüâîû']+(?:d|t)[ıiuü](?:lar|ler|k|m|n)?(?=\s+(?:ve|ama)\b|[,;:.!?…])", re.I)
        onceki_rivayet = False
        for para in (paras or [text]):
            pl = para.lower()
            ilk = (re.split(r"(?<=[.!?…])\s+", para) or [""])[0]
            # rivayet bölümü birkaç paragraf sürebilir: işaretli paragraftan sonra -mış'la açılan paragraflar da rivayettir
            rivayet = any(k in pl for k in ("anlatılır", "rivayet", "efsane")) or (onceki_rivayet and bool(MIS.search(ilk)))
            onceki_rivayet = rivayet
            seslenme = any(k in pl for k in ("düşünün", "kendinizi", "bakalım", "görelim", "bugün"))
            for snt in [x for x in re.split(r"(?<=[.!?…])\s+", para) if x.strip()]:
                m, y, d = MIS.findall(snt), YOR.findall(snt), [w for w in DI.findall(snt) if len(w) > 3 and not w.lower().endswith(("ydı", "ydi"))]
                if m and not rivayet: kip_uyari.append((snt, "rivayet dışında -mış: " + ", ".join(m)))
                elif y and not seslenme: kip_uyari.append((snt, "olay şimdiki zamanla: " + ", ".join(y)))
                elif m and (y or d) and rivayet: kip_uyari.append((snt, "aynı cümlede karışık kip: " + ", ".join(m + y + d)))
    low = " " + " ".join(lw) + " "
    yasak = sorted({x for x in lw if x in YASAK} | {p for p in YASAK_IFADE if f" {p} " in low})
    klise = sorted({x for x in lw if x in KLISE} | {p for p in KLISE_IFADE if f" {p} " in low})
    r = lambda a: round(100 * a / max(1, n), 2)
    res = {
        "dosya": os.path.relpath(path), "tür": kind, "kelime": n,
        "süre_sn": round(dur, 1) if dur else None, "kelime_dk": round(n / dur * 60) if dur else None,
        "cümle": len(sents) if not auto_punct else None,
        "ort_cümle": round(sum(sl) / len(sl), 1) if sl else None, "medyan_cümle": sorted(sl)[len(sl) // 2] if sl else None,
        "vurucu_%": round(100 * sum(1 for x in sl if x <= 5) / len(sl), 1) if sl else None,
        "uzun_%": round(100 * sum(1 for x in sl if x > 20) / len(sl), 1) if sl else None,
        "soru_100": r(q), "hitap_100": r(hitap), "biz_100": r(biz), "ünlem_100": r(text.count("!")),
        "şimdiki_%": round(100 * zaman["şimdiki"] / zt), "geniş_%": round(100 * zaman["geniş"] / zt), "geçmiş_%": round(100 * zaman["geçmiş"] / zt),
        "mış_%": round(100 * zaman["mış"] / zt), "gelecek_%": round(100 * zaman["gelecek"] / zt), "kitap_%": round(100 * zaman["kitap"] / zt),
        "isim_%": round(100 * zaman["isim/diğer"] / zt),
        "geçiş_100": r(sum(gecis.values())), "en_sık_geçişler": ", ".join(f"{k}:{v}" for k, v in gecis.most_common(5)),
        "merak_100": r(merak), "sayı_100": r(nums), "çeşitlilik": round(len(set(lw)) / max(1, n), 2),
        "kanca": " ".join(sents[:3])[:300] if not auto_punct else " ".join(w[:45]),
        "kapanış": " ".join(sents[-2:])[:240] if not auto_punct else " ".join(w[-35:]),
        "noktalama_yok": auto_punct,
        "ilk_cümle": sl[0] if sl else None, "son_cümle": sl[-1] if sl else None, "en_uzun": max(sl) if sl else None,
        "kaynak_dili": kaynak, "yasak": yasak, "klişe": klise, "yüklemsiz": len(yuklemsiz) if not auto_punct else None, "yüklemsiz_liste": yuklemsiz,
        "bağsız": len(bagsiz) if paras else None, "bağsız_liste": bagsiz,
        "kip": len(kip_uyari) if not auto_punct else None, "kip_liste": kip_uyari,
    }
    return res


# Kaynak: osmanli-serisi/ANLATICI-DILI.md §3 ve §12. (alt, üst) kapalı aralık; None = sınır yok.
HEDEF = [
    ("ort_cümle", 7.5, 11.5, "ortalama cümle (kelime)"),
    ("vurucu_%", 10, 35, "≤5 kelimelik cümle"),
    ("en_uzun", None, 20, "en uzun cümle (kelime)"),
    ("ilk_cümle", None, 8, "ilk cümle (kanca)"),
    ("son_cümle", None, 12, "son cümle (kapanış)"),
    ("soru_100", 1.0, 3.5, "soru /100 kelime"),
    ("hitap_100", 0.5, 2.0, "izleyiciye hitap /100"),
    ("biz_100", 0.3, 2.5, '"biz" dili /100'),
    ("geniş_%", None, 15, "geniş zaman (cümle sonu)"),
    ("kitap_%", None, 10, '"-dır/-tır" yazı dili'),
    ("şimdiki_%", None, 10, "şimdiki zaman (yalnız seslenme, §3.1)"),
    ("gelecek_%", 3, 20, '"-ecekti" önsezisi'),
    ("merak_100", 2.0, None, "merak kalıpları /100"),
    ("sayı_100", None, 4.0, "sayı /100"),
    ("kaynak_dili", None, 2, "kaynak tartışması kelimeleri (adet, §4)"),
    ("yüklemsiz", None, 0, "yüklemsiz cümle adayı (elle bak, §3.6)"),
    ("bağsız", None, 0, "öncekine bağlanmayan paragraf (elle bak, §3.6 kural 9)"),
    ("kip", None, 0, "kip uyarısı (elle bak, §3.1)"),
]
BAGLAC = {"ama", "oysa", "fakat", "ancak", "çünkü", "bu", "bunun", "bunu", "buna", "böylece", "derken", "tam", "ertesi", "sonunda",
          "ardından", "o", "onu", "ona", "onun", "onlar", "aynı", "peki", "işte", "yine", "üstelik", "kısa", "sonra", "geriye", "bir an",
          "anlatılır", "rivayete", "efsaneye", "şimdi", "artık", "böyle", "öyle", "oradan", "orada", "burada", "bunun üzerine",
          "sabah", "akşam", "o gece", "o gün", "o sabah", "düşünün", "bir an", "aynı yıl", "aynı yıllarda", "bu sırada", "tam bu"}
DURAK = {"ancak", "sonra", "kadar", "bütün", "değil", "olarak", "artık", "şimdi", "bunun", "üzerine", "içinde", "arasında"}
YUKLEM_KELIME = {"var", "yok", "değil", "gibi", "mı", "mi", "mu", "mü", "evet", "hayır"}
YUKLEM_EK = re.compile(r"(yor|yordu|m[ıiuü]ş|d[ıiuü]|t[ıiuü]|d[ıiuü][mnk]|t[ıiuü][mnk]|d[ıiuü]lar|d[ıiuü]ler|acak|ecek|acağ[ıi][mz]|eceğ[ıi][mz]|"
                       r"[aeıiuü]r|[aeıiuü]rlar|[aeıiuü]rler|maz|mez|mal[ıi]|mel[ıi]|s[ıiuü]n|s[ıiuü]n[ıiuü]z|[ıiuü]n|[ıiuü]n[ıiuü]z|[ıiuü]z|"
                       r"l[ıi]m|d[ıiuü]r|t[ıiuü]r|yd[ıiuü]|yd[ıiuü]lar|ym[ıiuü]ş|ysa|yse|sa|se|ken)$")
YASAK = {"kafir", "kâfir", "kafirler", "gavur", "gavurlar", "küffar", "mücahid", "mücahit", "mücahitler", "hain", "hainler", "hainlik",
         "dostlarım", "arkadaşlar", "abone", "merhaba", "videoda", "videomuzda"}
YASAK_IFADE = ["beğenmeyi unutmayın", "bu videoda", "abone olun"]
KLISE = {"şanlı", "yüce", "muhteşem", "efsanevi", "inanılmaz", "destansı", "kahramanca", "acımasız", "barbar", "vahşi"}
KLISE_IFADE = ["altın harflerle", "tarihin en", "en büyük", "dünyanın en"]


def hedef(r):
    """→ [(ölçü, değer, aralık metni, geçti mi)]; ölçülemeyen değerler atlanır."""
    out = []
    for k, lo, hi, ad in HEDEF:
        v = r.get(k)
        if v is None: continue
        ok = (lo is None or v >= lo) and (hi is None or v <= hi)
        rng = f"{lo if lo is not None else ''}–{hi if hi is not None else ''}" if lo is not None and hi is not None else (f"≤ {hi}" if lo is None else f"≥ {lo}")
        out.append((ad, v, rng, ok))
    out.append(("yasak kelime", ", ".join(r["yasak"]) or "yok", "yok", not r["yasak"]))
    out.append(("klişe / övgü sıfatı", ", ".join(r["klişe"]) or "yok", "yok (gerekçesiz)", not r["klişe"]))
    return out


def main():
    args, md = [a for a in sys.argv[1:] if not a.startswith("--")], None
    if "--md" in sys.argv: md = sys.argv[sys.argv.index("--md") + 1]; args = [a for a in args if a != md]
    files = []
    for a in args:
        if os.path.isdir(a):
            for root, _, fs in os.walk(a):
                files += [os.path.join(root, f) for f in sorted(fs) if f.endswith((".vtt", ".srt", ".txt")) or f == "timeline.js"]
        else: files.append(a)
    rows = [analyse(f) for f in files]
    cols = ["kelime", "süre_sn", "kelime_dk", "ort_cümle", "vurucu_%", "uzun_%", "soru_100", "hitap_100", "biz_100", "ünlem_100", "şimdiki_%", "geniş_%", "geçmiş_%", "mış_%", "gelecek_%", "kitap_%", "isim_%", "geçiş_100", "merak_100", "sayı_100", "çeşitlilik"]
    out = ["| dosya | " + " | ".join(cols) + " |", "|---|" + "---|" * len(cols)]
    for r in rows: out.append(f"| {r['dosya']} | " + " | ".join("" if r[c] is None else str(r[c]) for c in cols) + " |")
    out.append("\n**Kanca / kapanış ve sık geçişler**")
    for r in rows: out.append(f"- **{r['dosya']}**{' (noktalama yok: cümle ölçüleri atlandı)' if r['noktalama_yok'] else ''}\n  - kanca: {r['kanca']}\n  - kapanış: {r['kapanış']}\n  - geçişler: {r['en_sık_geçişler']}")
    for r in rows:
        if not ("--hedef" in sys.argv or r["dosya"].endswith("timeline.js")): continue
        h = hedef(r); n_ok = sum(1 for x in h if x[3])
        out.append(f"\n**Hedef kontrolü: {r['dosya']}** ({n_ok}/{len(h)} ✓; nitel puan kartı ayrıca: ANLATICI-DILI.md §11)")
        out.append("| ölçü | değer | hedef | |\n|---|---|---|---|")
        out += [f"| {ad} | {v} | {rng} | {'✓' if ok else '✗'} |" for ad, v, rng, ok in h]
        if r["kip_liste"]: out.append("\nKip uyarıları (§3.1; elle bak):\n" + "\n".join(f"- «{a}» → {b}" for a, b in r["kip_liste"]))
        if r["bağsız_liste"]: out.append("\nÖncekine bağlanmayan paragraf başları (kopukluk adayı; bağlaç, gönderim ya da ortak öğe ekle):\n" + "\n".join(f"- «{x}»" for x in r["bağsız_liste"]))
        if r["yüklemsiz_liste"]: out.append("\nYüklemsiz cümle adayları (anlatım bozukluğu mu, bilinçli isim cümlesi mi? elle karar ver):\n" + "\n".join(f"- «{x}»" for x in r["yüklemsiz_liste"]))
    s = "\n".join(out); print(s)
    if md: open(md, "w", encoding="utf-8").write(s + "\n")


if __name__ == "__main__":
    main()
