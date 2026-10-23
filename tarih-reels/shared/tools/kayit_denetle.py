#!/usr/bin/env python3
"""Yeni seslendirme kaydını bölüme koymadan dener: paragraf kesimleri, hız oranları, paragraf süreleri.
Bölüm klasörüne hiçbir şey yazmaz (parçalar geçici klasöre gider).
  python3 shared/tools/kayit_denetle.py <bölüm-klasörü> <kayıt.mp3>
Kesimler make_audio.py'nin split_full'u ile bulunur (aynı kod). Hız oranları 0,75–1,35 dışındaysa bir sınır yanlış olabilir."""
import ast, json, os, re, subprocess, sys, tempfile, wave
import numpy as np

MA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "make_audio.py")


def yukle_make_audio():
    """make_audio.py'den yalnız SR ve bölme fonksiyonlarını alır (modülü çalıştırmadan)."""
    ns = {"np": np, "os": os, "re": re, "subprocess": subprocess, "wave": wave}
    for node in ast.parse(open(MA, encoding="utf-8").read()).body:
        if isinstance(node, ast.Assign) and any(getattr(t, "id", "") == "SR" for t in node.targets) or \
           isinstance(node, ast.FunctionDef) and node.name in ("load_audio", "movavg", "syll", "split_full"):
            exec(compile(ast.Module([node], []), MA, "exec"), ns)
    return ns


def main():
    if len(sys.argv) < 3: sys.exit(__doc__)
    ep, kayit = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
    js = "global.window={};eval(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(JSON.stringify(window.EP.paras.map(p=>p.text)))"
    texts = json.loads(subprocess.run(["node", "-e", js, os.path.join(ep, "timeline.js")], capture_output=True, check=True, text=True).stdout)
    ns = yukle_make_audio()
    with tempfile.TemporaryDirectory() as tmp:
        os.makedirs(os.path.join(tmp, "audio")); ns["EPD"] = tmp
        v = ns["load_audio"](kayit); kel = sum(len(t.split()) for t in texts)
        print(f"== {os.path.basename(kayit)}: {len(v) / ns['SR']:.1f} sn, {kel} kelime, {kel / (len(v) / ns['SR']):.2f} kel/sn")
        parts = ns["split_full"](kayit, len(texts), texts)
        for k, (t, p) in enumerate(zip(texts, parts), 1):
            with wave.open(p) as w: d = w.getnframes() / w.getframerate()
            print(f"  p{k}: {d:5.1f} sn · {len(t.split()):3d} kelime · {len(t.split()) / d:.2f} kel/sn · «{t[:38]}…»")


if __name__ == "__main__":
    main()
