#!/usr/bin/env python3
"""1914 Avrupa/Yakın Doğu siyasi haritasını modern ülke + ADM1 sınırlarından kurar.

Girdi (npm paketleri, `npm pack` ile indirilir):
  world-atlas (Natural Earth 50m ülkeler)  → --atlas  .../world-atlas/package/countries-50m.json
  @geo-insight/data (ADM1, 234 ülke)        → --adm1   .../geo-insight-data/package/dist/assets/adm1
Çıktı: shared/data/europe1914.js  (window.EUROPE1914; Lambert eşit alan izdüşümü, birim km)

Not: 1914 sınırları modern il sınırlarıyla yaklaşıklanır (Galiçya, Transilvanya, Alsas-Loren,
Kongre Polonyası, Kars-Ardahan vb.). Küçük sapmalar (Kuzey Şlezvig, Batı Trakya…) bilinçli olarak yok sayıldı.
"""
import argparse, json, math, os
from shapely.geometry import shape, Polygon, MultiPolygon, box
from shapely.ops import unary_union, transform

ap = argparse.ArgumentParser()
ap.add_argument("--atlas", required=True); ap.add_argument("--adm1", required=True)
ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "data", "europe1914.js"))
a = ap.parse_args()

# ---------- topojson çözücü (world-atlas) ----------
topo = json.load(open(a.atlas))
sc, tr = topo["transform"]["scale"], topo["transform"]["translate"]
arcs = []
for arc in topo["arcs"]:
    x = y = 0; pts = []
    for dx, dy in arc:
        x += dx; y += dy; pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)
def ring(ix):
    out = []
    for i in ix:
        pts = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(pts if not out else pts[1:])
    return out
COUNTRY = {}
for g in topo["objects"]["countries"]["geometries"]:
    if g["type"] == "Polygon": polys = [g["arcs"]]
    elif g["type"] == "MultiPolygon": polys = g["arcs"]
    else: continue
    geom = MultiPolygon([Polygon(ring(p[0]), [ring(h) for h in p[1:]]) for p in polys]).buffer(0)
    COUNTRY[str(g.get("id", g["properties"]["name"]))] = (g["properties"]["name"], geom)

def adm1(ccn3):
    p = os.path.join(a.adm1, f"{ccn3}.json")
    return {f["properties"]["name"]: shape(f["geometry"]).buffer(0) for f in json.load(open(p))["features"]} if os.path.exists(p) else {}

def by_name(n):
    for k, (nm, g) in COUNTRY.items():
        if nm == n: return g
    raise KeyError(n)

def c(n): return by_name(n)
def part(ccn3, names, invert=False):
    A = adm1(ccn3); miss = [n for n in names if n not in A]
    assert not miss, (ccn3, miss)
    return unary_union([g for n, g in A.items() if (n in names) != invert])

# ---------- 1914 devletleri ----------
POL_DE = ["Warmian-Masurian", "Pomeranian", "West Pomeranian", "Lubusz", "Greater Poland", "Lower Silesian", "Opole", "Silesian", "Kuyavian-Pomeranian"]
POL_AT = ["Lesser Poland", "Subcarpathian"]
UKR_AT = ["L'viv", "Ivano-Frankivs'k", "Ternopil'", "Chernivtsi", "Transcarpathia"]
ROU_AT = ["Arad", "Bihor", "Caras-Severin", "Timis", "Alba", "Bistrita-Nasaud", "Cluj", "Hunedoara", "Maramures", "Mures", "Salaj", "Satu Mare", "Sibiu", "Brasov", "Covasna", "Harghita", "Suceava"]
SRB_AT = ["Južno-Backi", "Južno-Banatski", "Srednje-Banatski", "Zapadno-Backi", "Severno-Backi", "Severno-Banatski", "Sremski"]
ITA_AT = ["Trento", "Bozen", "Trieste", "Gorizia"]
TUR_RU = ["Kars", "Ardahan", "Artvin", "Iğdir"]
BGR_RO = ["Dobrich", "Silistra"]
SAU_OT = ["Al Madinah", "Makkah", "Tabuk", "Al Bahah", "`Asir", "Jizan"]

POL = adm1("616")
S = {
  "DE": ("ALMANYA", unary_union([c("Germany"), part("616", POL_DE), part("643", ["Kaliningrad"]), part("250", ["Bas-Rhin", "Haute-Rhin", "Moselle"]), part("440", ["Klaipedos"])])),
  "AH": ("AVUSTURYA-MACARİSTAN", unary_union([c("Austria"), c("Hungary"), c("Czechia"), c("Slovakia"), c("Slovenia"), c("Croatia"), c("Bosnia and Herz."),
          part("616", POL_AT), part("804", UKR_AT), part("642", ROU_AT), part("688", SRB_AT), part("380", ITA_AT)])),
  "RU": ("RUSYA", unary_union([part("643", ["Kaliningrad"], invert=True), c("Finland"), c("Estonia"), c("Latvia"), part("440", ["Klaipedos"], invert=True),
          c("Belarus"), part("804", UKR_AT, invert=True), c("Moldova"), part("616", POL_DE + POL_AT, invert=True), c("Georgia"), c("Armenia"), c("Azerbaijan"),
          part("792", TUR_RU)])),
  "RS": ("SIRBİSTAN", unary_union([part("688", SRB_AT, invert=True), c("Kosovo"), c("Macedonia")])),
  "ME": ("KARADAĞ", c("Montenegro")),
  "OT": ("OSMANLI", unary_union([part("792", TUR_RU, invert=True), c("Syria"), c("Lebanon"), c("Israel"), c("Palestine"), c("Jordan"), c("Iraq"), part("682", SAU_OT)])),
  "FR": ("FRANSA", part("250", ["Bas-Rhin", "Haute-Rhin", "Moselle", "Martinique", "Guyane française", "La Réunion", "Mayotte", "Guadeloupe"], invert=True)),
  "GB": ("BİRLEŞİK KRALLIK", unary_union([c("United Kingdom"), c("Ireland")])),
  "IT": ("İTALYA", part("380", ITA_AT, invert=True)),
  "BE": ("BELÇİKA", c("Belgium")), "NL": ("HOLLANDA", c("Netherlands")), "LU": ("LÜKSEMBURG", c("Luxembourg")),
  "CH": ("İSVİÇRE", c("Switzerland")), "ES": ("İSPANYA", c("Spain")), "PT": ("PORTEKİZ", c("Portugal")),
  "DK": ("DANİMARKA", c("Denmark")), "NO": ("NORVEÇ", c("Norway")), "SE": ("İSVEÇ", c("Sweden")),
  "RO": ("ROMANYA", unary_union([part("642", ROU_AT, invert=True), part("100", BGR_RO)])),
  "BG": ("BULGARİSTAN", part("100", BGR_RO, invert=True)), "GR": ("YUNANİSTAN", c("Greece")), "AL": ("ARNAVUTLUK", c("Albania")),
  "IR": ("İRAN", c("Iran")), "EG": ("MISIR", c("Egypt")),
}
VIEW = box(-26, 22, 62, 72)
used = unary_union([g for _, g in S.values()])
other = unary_union([g for _, g in COUNTRY.values()]).difference(used.buffer(0.02))

lon0, lat0 = math.radians(20), math.radians(47); R = 6371.0
def laea(lon, lat, z=None):
    l, p = math.radians(lon), math.radians(lat)
    k = math.sqrt(2 / (1 + math.sin(lat0) * math.sin(p) + math.cos(lat0) * math.cos(p) * math.cos(l - lon0)))
    return (R * k * math.cos(p) * math.sin(l - lon0), -R * k * (math.cos(lat0) * math.sin(p) - math.sin(lat0) * math.cos(p) * math.cos(l - lon0)))
def proj(geom): return transform(lambda xs, ys, zs=None: tuple(zip(*[laea(x, y) for x, y in zip(xs, ys)])), geom)

def pack(geom, tol=2.0, minarea=60):
    geom = proj(geom.intersection(VIEW)).simplify(tol, preserve_topology=True)
    polys = [geom] if isinstance(geom, Polygon) else list(getattr(geom, "geoms", []))
    out = []
    for p in polys:
        if not isinstance(p, Polygon) or p.area < minarea: continue
        out.append([[round(v, 1) for xy in p.exterior.coords[:-1] for v in xy]] + [[round(v, 1) for xy in h.coords[:-1] for v in xy] for h in p.interiors if Polygon(h).area > minarea])
    return out

CITIES = {"Saraybosna": (18.41, 43.86), "Viyana": (16.37, 48.21), "Belgrad": (20.46, 44.82), "Berlin": (13.40, 52.52), "Paris": (2.35, 48.86),
          "Londra": (-0.13, 51.51), "St. Petersburg": (30.31, 59.94), "Brüksel": (4.35, 50.85), "İstanbul": (28.98, 41.01), "Odessa": (30.73, 46.48),
          "Sivastopol": (33.52, 44.62), "Novorossiysk": (37.77, 44.72), "Çanakkale": (26.40, 40.15), "Roma": (12.50, 41.90), "Budapeşte": (19.04, 47.50),
          "Bükreş": (26.10, 44.43), "Sofya": (23.32, 42.70), "Atina": (23.73, 37.98), "Moskova": (37.62, 55.75), "Liège": (5.57, 50.63), "Kiel": (10.13, 54.32)}
data = {"proj": {"type": "laea", "lon0": 20, "lat0": 47, "unit": "km"},
        "states": {k: {"name": n, "polys": pack(g)} for k, (n, g) in S.items()},
        "other": pack(other.difference(box(-180, -90, -26, 90)), 3.0, 150),
        "cities": {k: [round(v, 1) for v in laea(*ll)] for k, ll in CITIES.items()},
        "centroid": {}}
for k, (n, g) in S.items():
    p = proj(max(getattr(g.intersection(VIEW), "geoms", [g.intersection(VIEW)]), key=lambda q: q.area)).representative_point()
    data["centroid"][k] = [round(p.x, 1), round(p.y, 1)]
os.makedirs(os.path.dirname(a.out), exist_ok=True)
with open(a.out, "w", encoding="utf-8") as f:
    f.write("// shared/tools/build_europe1914.py ile üretildi (Natural Earth + ADM1). Birim: km, LAEA(20E,47N)\nwindow.EUROPE1914 = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("yazıldı:", a.out, round(os.path.getsize(a.out) / 1024), "KB")
for k, v in data["states"].items(): print(k, v["name"], len(v["polys"]), "parça", sum(len(r) // 2 for p in v["polys"] for r in p), "nokta")
