#!/usr/bin/env python3
"""Anadolu–Balkanlar il/bölge haritası (Osmanlı sezonları için zaman haritasının geometrisi).

Birimler: TUR (81 il), BGR (28 il), GRC (14 bölge), SRB (25 okrug) il düzeyinde; diğer ülkeler tek birim.
Sahiplik (hangi yıl kimin elinde) bu dosyada DEĞİL, her sezonun kendi zaman dosyasında tutulur.
Kullanım: python3 build_anadolu_balkan.py --atlas countries-50m.json --adm1 .../assets/adm1
Çıktı: shared/data/anadolu_balkan.js (window.AB_MAP; LAEA 29E/40.5N, birim km)
"""
import argparse, json, math, os
from shapely.geometry import shape, Polygon, MultiPolygon, box
from shapely.ops import unary_union, transform

ap = argparse.ArgumentParser(); ap.add_argument("--atlas", required=True); ap.add_argument("--adm1", required=True)
ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "data", "anadolu_balkan.js")); a = ap.parse_args()
topo = json.load(open(a.atlas)); sc, tr = topo["transform"]["scale"], topo["transform"]["translate"]; arcs = []
for arc in topo["arcs"]:
    x = y = 0; pts = []
    for dx, dy in arc: x += dx; y += dy; pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)
def ring(ix):
    out = []
    for i in ix: pts = arcs[i] if i >= 0 else arcs[~i][::-1]; out.extend(pts if not out else pts[1:])
    return out
COUNTRY = {}
for g in topo["objects"]["countries"]["geometries"]:
    polys = [g["arcs"]] if g["type"] == "Polygon" else g["arcs"] if g["type"] == "MultiPolygon" else []
    if polys: COUNTRY[g["properties"]["name"]] = MultiPolygon([Polygon(ring(p[0]), [ring(h) for h in p[1:]]) for p in polys]).buffer(0)
def adm1(cc): return {f["properties"]["name"]: shape(f["geometry"]).buffer(0) for f in json.load(open(os.path.join(a.adm1, f"{cc}.json")))["features"]}

VIEW = box(10, 31, 50, 49)
units = {}
for iso, cc in (("TUR", "792"), ("BGR", "100"), ("GRC", "300"), ("SRB", "688")):
    for n, g in adm1(cc).items():
        k = f"{iso}:{n}"; units[k] = unary_union([units[k], g]) if k in units else g
for n in ("Macedonia", "Kosovo", "Albania", "Bosnia and Herz.", "Montenegro", "Croatia", "Slovenia", "Hungary", "Romania", "Moldova", "Ukraine", "Cyprus", "N. Cyprus",
          "Syria", "Iraq", "Iran", "Georgia", "Armenia", "Azerbaijan", "Lebanon", "Israel", "Palestine", "Jordan", "Russia", "Italy", "Austria", "Slovakia", "Egypt", "Libya", "Saudi Arabia", "Tunisia", "Malta"):
    if n in COUNTRY: units["C:" + n] = COUNTRY[n]
units["C:Cyprus"] = unary_union([units.pop("C:Cyprus"), units.pop("C:N. Cyprus")])

lon0, lat0, R = math.radians(29), math.radians(40.5), 6371.0
def laea(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    k = math.sqrt(2 / (1 + math.sin(lat0) * math.sin(p) + math.cos(lat0) * math.cos(p) * math.cos(l - lon0)))
    return (R * k * math.cos(p) * math.sin(l - lon0), -R * k * (math.cos(lat0) * math.sin(p) - math.sin(lat0) * math.cos(p) * math.cos(l - lon0)))
def proj(g): return transform(lambda xs, ys, zs=None: tuple(zip(*[laea(x, y) for x, y in zip(xs, ys)])), g)
def pack(g, tol=1.2, minarea=8):
    g = proj(g.intersection(VIEW)).simplify(tol, preserve_topology=True)
    polys = [g] if isinstance(g, Polygon) else list(getattr(g, "geoms", []))
    return [[[round(v, 1) for xy in p.exterior.coords[:-1] for v in xy]] for p in polys if isinstance(p, Polygon) and p.area >= minarea]
CITIES = {"Söğüt": (30.18, 40.02), "Bilecik": (29.98, 40.14), "Bursa": (29.06, 40.19), "İznik": (29.72, 40.43), "İzmit": (29.92, 40.77), "Mudanya": (28.88, 40.37),
          "Konstantinopolis": (28.98, 41.01), "Gelibolu": (26.67, 40.41), "Bolayır": (26.75, 40.52), "Dimetoka": (26.50, 41.35), "Edirne": (26.56, 41.68),
          "Çirmen": (26.23, 41.72), "Filibe": (24.75, 42.15), "Sofya": (23.32, 42.70), "Tırnova": (25.63, 43.08), "Niğbolu": (24.89, 43.70), "Vidin": (22.88, 43.99),
          "Kosova": (21.09, 42.66), "Selanik": (22.94, 40.64), "Belgrad": (20.46, 44.82), "Ankara": (32.85, 39.93), "Konya": (32.48, 37.87), "Kütahya": (29.98, 39.42),
          "Sivas": (37.02, 39.75), "Kayseri": (35.49, 38.73), "Malatya": (38.31, 38.35), "Erzincan": (39.49, 39.75), "Amasya": (35.83, 40.65), "Kastamonu": (33.78, 41.38),
          "Trabzon": (39.72, 41.0), "Alaşehir": (28.52, 38.35), "İzmir": (27.14, 38.42), "Kösedağ": (38.4, 40.1), "Çubuk Ovası": (32.95, 40.2), "Palekanon": (29.42, 40.78),
          "Bafeus": (29.75, 40.72), "Varna": (27.91, 43.21), "Buda": (19.04, 47.5), "Venedik": (12.33, 45.44), "Kahire": (31.24, 30.04), "Halep": (37.16, 36.2), "Tebriz": (46.29, 38.08)}
data = {"proj": {"type": "laea", "lon0": 29, "lat0": 40.5, "unit": "km"}, "units": {}, "cities": {k: [round(v, 1) for v in laea(*ll)] for k, ll in CITIES.items()}, "centroid": {}}
for k, g in units.items():
    pk = pack(g)
    if pk:
        data["units"][k] = pk
        c = proj(g.intersection(VIEW)).representative_point(); data["centroid"][k] = [round(c.x, 1), round(c.y, 1)]
other = unary_union(list(COUNTRY.values())).difference(unary_union(list(units.values())).buffer(.02))
data["other"] = pack(other, 2.5, 40)
os.makedirs(os.path.dirname(a.out), exist_ok=True)
open(a.out, "w", encoding="utf-8").write("// shared/tools/build_anadolu_balkan.py ile üretildi (Natural Earth + ADM1). Birim km, LAEA(29E,40.5N)\nwindow.AB_MAP = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("yazıldı", a.out, round(os.path.getsize(a.out) / 1024), "KB,", len(data["units"]), "birim")
