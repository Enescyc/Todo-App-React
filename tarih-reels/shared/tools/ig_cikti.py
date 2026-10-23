#!/usr/bin/env python3
"""Instagram çıktısı: bölüm videosunu Meta'nın Reels koşullarına uyan bir kopyaya çevirir ve denetler.
  python3 shared/tools/ig_cikti.py <bölüm-klasörü> [girdi.mp4]   → <bölüm>/instagram.mp4
Girdi verilmezse final.mp4, o yoksa onizleme.mp4 (taslak; yalnız deneme için) kullanılır.
Koşullar (Meta IG User Media başvurusu, Reels): MP4 + moov başta, H.264, ≤ 25 Mbps, genişlik ≤ 1920, 23–60 fps,
AAC ≤ 48 kHz ve ≤ 128 kbps, 3 sn – 15 dk, ≤ 300 MB. Ayrıntı: strateji/INSTAGRAM-YAYIN.md §4."""
import json, os, subprocess, sys

SINIR = {"boyut_mb": 300, "sure": (3, 900), "fps": (23, 60), "genislik": 1920, "video_kbps": 25000, "ses_kbps": 128, "ses_hz": 48000}


def probe(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", p], capture_output=True, check=True).stdout
    return json.loads(out)


def denetle(p):
    """Dosyayı Meta'nın koşullarıyla karşılaştırır; (geçti mi, satırlar) döner."""
    d = probe(p); v = next(s for s in d["streams"] if s["codec_type"] == "video"); a = next((s for s in d["streams"] if s["codec_type"] == "audio"), None)
    sure, boyut = float(d["format"]["duration"]), os.path.getsize(p) / 1e6
    num, den = map(int, v["avg_frame_rate"].split("/")); fps = num / den if den else 0
    vk = int(v.get("bit_rate") or d["format"].get("bit_rate") or 0) / 1000
    ak, ahz = (int(a.get("bit_rate") or 0) / 1000, int(a.get("sample_rate") or 0)) if a else (0, 0)
    with open(p, "rb") as f: bas = f.read(1 << 16)
    moov_basta = bas.find(b"moov") != -1 and (bas.find(b"mdat") == -1 or bas.find(b"moov") < bas.find(b"mdat"))
    S = [("kap MP4, moov başta", moov_basta, "+faststart"),
         ("video H.264/HEVC", v["codec_name"] in ("h264", "hevc"), v["codec_name"]),
         (f"video ≤ {SINIR['video_kbps'] // 1000} Mbps", vk <= SINIR["video_kbps"], f"{vk / 1000:.1f} Mbps"),
         (f"genişlik ≤ {SINIR['genislik']}", v["width"] <= SINIR["genislik"], f"{v['width']}×{v['height']}"),
         ("9:16", abs(v["width"] / v["height"] - 9 / 16) < .01, f"{v['width'] / v['height']:.3f}"),
         ("23–60 fps", SINIR["fps"][0] <= fps <= SINIR["fps"][1], f"{fps:.2f}"),
         ("ses AAC", bool(a) and a["codec_name"] == "aac", a["codec_name"] if a else "ses yok"),
         (f"ses ≤ {SINIR['ses_kbps']} kbps", ak <= SINIR["ses_kbps"] + 2, f"{ak:.0f} kbps"),
         (f"ses ≤ {SINIR['ses_hz'] // 1000} kHz", ahz <= SINIR["ses_hz"], f"{ahz} Hz"),
         ("süre 3 sn – 15 dk", SINIR["sure"][0] <= sure <= SINIR["sure"][1], f"{sure:.1f} sn"),
         (f"boyut ≤ {SINIR['boyut_mb']} MB", boyut <= SINIR["boyut_mb"], f"{boyut:.1f} MB")]
    ok = all(s[1] for s in S)
    satir = [f"  {'✓' if g else '✗'} {ad}: {deger}" for ad, g, deger in S]
    if sure > 90: satir.append(f"  · bilgi: {sure:.0f} sn > 90 sn. API'den gelen uzun Reels'in Reels sekmesine girip girmediği doğrulanmadı (INSTAGRAM-YAYIN §5)")
    return ok, satir


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    ep = os.path.abspath(sys.argv[1])
    src = sys.argv[2] if len(sys.argv) > 2 else next((os.path.join(ep, f) for f in ("final.mp4", "onizleme.mp4") if os.path.exists(os.path.join(ep, f))), None)
    if not src or not os.path.exists(src): sys.exit(f"girdi video yok: {src or ep + '/final.mp4'} (önce render.js)")
    if os.path.basename(src) == "onizleme.mp4": print("uyarı: taslak önizleme kullanılıyor; yayın için final.mp4 render edin")
    out = os.path.join(ep, "instagram.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-map", "0:v:0", "-map", "0:a:0",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-maxrate", "12M", "-bufsize", "24M", "-r", "30",
                    "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
                    "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", out], check=True)
    ok, satir = denetle(out)
    print(out); print("\n".join(satir))
    print("Instagram koşulları: " + ("✓ hepsi tamam" if ok else "✗ karşılanmayan madde var"))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
