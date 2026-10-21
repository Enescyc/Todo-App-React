#!/usr/bin/env python3
"""Anlatım dili ölçümü: YouTube transkriptleri (.vtt/.srt/.txt) ya da bizim timeline.js metinlerimiz.

Kullanım: python3 shared/tools/anlatim_analiz.py <dosya|klasör> [...] [--md çıktı.md]
  .vtt/.srt  : zaman damgalı altyazı (yt-dlp --write-auto-subs --sub-langs tr ya da YouTube "Transkripti göster" kopyası)
  .txt       : düz metin (YouTube transkript kopyasındaki "0:12" satırları da zaman olarak okunur)
  timeline.js: bizim bölümlerimiz (paras[].text; hız Emrullah Uzun ~2.0 kelime/sn varsayılır)

Ölçtükleri (nicel; nitel analiz için iskelet: strateji/ANLATIM-ANALIZI.md):
  hız (kelime/dk) · cümle uzunluğu (ortalama, medyan, ≤5 kelimelik vurucu ve >20 kelimelik uzun cümle oranı) · soru oranı
  · izleyiciye hitap (siz/sen, bakın, düşünün, hayal edin…) · "biz" dili · anlatı zamanı (cümle sonu yüklemi: şimdiki/geniş/geçmiş/-mış/gelecek/isim)
  · geçiş kelimeleri (ama, peki, yani, işte, çünkü…) · merak kalıpları (peki, neden, nasıl, asıl, birazdan…) · ünlem
  · sayılar · sözcük çeşitliliği · ilk 3 cümle (kanca) ve son 2 cümle (kapanış)
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
        out = subprocess.run(["node", "-e", "global.window={};eval(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(JSON.stringify(window.EP.paras.map(p=>p.text)))", path], capture_output=True, text=True, check=True).stdout
        text = " ".join(json.loads(out)); return text, len(text.split()) / 2.0, "bizim (tahmini 2.0 kel/sn)"
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
    return text, dur, "transkript"


V = "aeıioöuüâîû"
def words(t): return re.findall(r"[\wçğıöşüâîûÇĞİÖŞÜÂÎÛ'’]+", t)


def analyse(path):
    text, dur, kind = read(path)
    w = words(text); n = len(w); lw = [x.lower().replace("’", "'") for x in w]
    sents = [s.strip() for s in re.split(r"(?<=[.!?…])\s+", text) if s.strip()]
    auto_punct = len(sents) < max(3, n / 60)          # otomatik altyazıda noktalama çoğu zaman yok
    sl = [len(words(s)) for s in sents] if not auto_punct else []
    q = sum(1 for s in sents if s.endswith("?")) + sum(1 for x in lw if x in ("mi", "mı", "mu", "mü") or re.fullmatch(r"(mi|mı|mu|mü)(yd[ıiuü]|ydi|ydı|s[ıiuü]n(ız|iz|uz|üz)?|y[ıiuü]z)", x))
    hitap = sum(1 for x in lw if x in ("siz", "sen", "sizin", "senin", "size", "sana", "sizi", "seni", "sizce", "bakın", "bakalım", "düşünün", "düşünsenize", "hayal", "tahmin", "dikkat", "unutmayın", "görün", "inanır", "inanın"))
    hitap += sum(1 for x in lw if re.search(r"(sınız|siniz|sunuz|sünüz|ırsınız|irsiniz|ursunuz|ürsünüz|abilirsiniz|ebilirsiniz)$", x))
    biz = sum(1 for x in lw if x in ("biz", "bizim", "bize", "bizi", "hepimiz", "bizce")) + sum(1 for x in lw if re.search(r"(yoruz|acağız|eceğiz|alım|elim|dık|dik|duk|dük|tık|tik|tuk|tük)$", x) and len(x) > 4)
    # anlatı zamanı: Türkçe yüklem çoğunlukla cümle sonundadır → cümle sonu kelimelerinden (noktalama yoksa bütün kelimelerden, kaba)
    preds = [words(x)[-1].lower() for x in sents if words(x)] if not auto_punct else lw
    zaman = Counter()
    for x in preds:
        if re.search(r"[ıiuü]yor(um|sun|uz|sunuz|lar|du|dı|muş|mış)?$", x): zaman["şimdiki"] += 1
        elif re.search(r"(acak|ecek)(t[ıi]r|lar|ler|t[ıi])?$", x): zaman["gelecek"] += 1
        elif re.search(r"m[ıiuü]ş(t[ıiuü]r|t[ıiuü]|lar)?$", x): zaman["mış"] += 1
        elif re.search(r"(d|t)[ıiuü](m|n|k|nız|niz|nuz|nüz|lar|ler)?$", x) and len(x) > 3: zaman["geçmiş"] += 1
        elif not auto_punct and re.search(r"(ar|er|ır|ir|ur|ür)(lar|ler)?$", x) and len(x) > 4 and x not in ("kadar", "bunlar", "onlar", "şunlar", "yer", "bir", "her", "var", "bazılar"): zaman["geniş"] += 1
        elif not auto_punct: zaman["isim/diğer"] += 1
    zt = max(1, sum(zaman.values()))
    gecis = Counter(x for x in lw if x in ("ama", "fakat", "ancak", "peki", "yani", "işte", "üstelik", "çünkü", "derken", "oysa", "sonra", "şimdi", "aslında", "hatta", "bile", "tabii"))
    merak = sum(1 for x in lw if x in ("peki", "neden", "nasıl", "niye", "acaba", "asıl", "birazdan", "sonra", "gizem", "sır", "kimse", "hiç"))
    nums = sum(1 for x in lw if re.fullmatch(r"\d+", x) or x in ("bin", "yüz", "milyon", "milyar"))
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
        "mış_%": round(100 * zaman["mış"] / zt), "gelecek_%": round(100 * zaman["gelecek"] / zt), "isim_%": round(100 * zaman["isim/diğer"] / zt),
        "geçiş_100": r(sum(gecis.values())), "en_sık_geçişler": ", ".join(f"{k}:{v}" for k, v in gecis.most_common(5)),
        "merak_100": r(merak), "sayı_100": r(nums), "çeşitlilik": round(len(set(lw)) / max(1, n), 2),
        "kanca": " ".join(sents[:3])[:300] if not auto_punct else " ".join(w[:45]),
        "kapanış": " ".join(sents[-2:])[:240] if not auto_punct else " ".join(w[-35:]),
        "noktalama_yok": auto_punct,
    }
    return res


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
    cols = ["kelime", "süre_sn", "kelime_dk", "ort_cümle", "vurucu_%", "uzun_%", "soru_100", "hitap_100", "biz_100", "ünlem_100", "şimdiki_%", "geniş_%", "geçmiş_%", "mış_%", "gelecek_%", "isim_%", "geçiş_100", "merak_100", "sayı_100", "çeşitlilik"]
    out = ["| dosya | " + " | ".join(cols) + " |", "|---|" + "---|" * len(cols)]
    for r in rows: out.append(f"| {r['dosya']} | " + " | ".join("" if r[c] is None else str(r[c]) for c in cols) + " |")
    out.append("\n**Kanca / kapanış ve sık geçişler**")
    for r in rows: out.append(f"- **{r['dosya']}**{' (noktalama yok: cümle ölçüleri atlandı)' if r['noktalama_yok'] else ''}\n  - kanca: {r['kanca']}\n  - kapanış: {r['kapanış']}\n  - geçişler: {r['en_sık_geçişler']}")
    s = "\n".join(out); print(s)
    if md: open(md, "w", encoding="utf-8").write(s + "\n")


if __name__ == "__main__":
    main()
