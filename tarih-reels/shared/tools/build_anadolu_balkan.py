#!/usr/bin/env python3
"""Anadolu–Balkanlar il/bölge haritası (Osmanlı sezonları için zaman haritasının geometrisi).

Birimler: TUR (81 il), BGR (28 il), GRC (14 bölge), SRB (25 okrug) il düzeyinde; diğer ülkeler tek birim.
Sahiplik (hangi yıl kimin elinde) bu dosyada DEĞİL, her sezonun kendi zaman dosyasında tutulur.
İstanbul ve Çanakkale boğazdan ikiye bölünür (TUR:Istanbul = Avrupa yakası, TUR:Istanbul-A = Asya yakası;
TUR:Çanakkale = Asya yakası, TUR:Gelibolu = yarımada + Gökçeada) çünkü tarihleri farklıdır.
Ek katmanlar: komşu birimler arası sınır çizgileri (edges), kıyı çizgisi (coast), nehirler ve doğal göller (Natural Earth 10m).
Kullanım: python3 build_anadolu_balkan.py --atlas countries-50m.json --adm1 .../assets/adm1 --ne <ne_10m geojson klasörü>
Çıktı: shared/data/anadolu_balkan.js (window.AB_MAP; LAEA 29E/40.5N, birim km)
"""
import argparse, json, math, os
from shapely.geometry import shape, Point, Polygon, MultiPolygon, LineString, MultiLineString, box
from shapely.ops import unary_union, transform, linemerge
from shapely.strtree import STRtree

ap = argparse.ArgumentParser(); ap.add_argument("--atlas", required=True); ap.add_argument("--adm1", required=True); ap.add_argument("--ne", required=True)
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
def adm1(cc):
    out = {}
    for f in json.load(open(os.path.join(a.adm1, f"{cc}.json")))["features"]:
        n, g = f["properties"]["name"], shape(f["geometry"]).buffer(0)
        if cc == "688" and n == "Pomoravski" and g.contains(Point(21.33, 43.58)): n = "Rasinski"   # veride Rasinski yanlış adla geliyor (Kruševac)
        out[n] = unary_union([out[n], g]) if n in out else g
    return out

VIEW = box(0, 20, 62, 58)
units = {}
for iso, cc in (("TUR", "792"), ("BGR", "100"), ("GRC", "300"), ("SRB", "688")):
    for n, g in adm1(cc).items():
        k = f"{iso}:{n}"; units[k] = unary_union([units[k], g]) if k in units else g
for n in ("Macedonia", "Kosovo", "Albania", "Bosnia and Herz.", "Montenegro", "Croatia", "Slovenia", "Hungary", "Romania", "Moldova", "Ukraine", "Cyprus", "N. Cyprus",
          "Syria", "Iraq", "Iran", "Georgia", "Armenia", "Azerbaijan", "Lebanon", "Israel", "Palestine", "Jordan", "Russia", "Italy", "Austria", "Slovakia", "Egypt", "Libya", "Saudi Arabia", "Tunisia", "Malta", "Belarus", "Poland", "Lithuania", "Latvia", "Czechia", "Germany", "Switzerland", "Algeria", "Sudan", "Kuwait", "Turkmenistan", "Kazakhstan", "Uzbekistan", "Afghanistan", "Yemen", "Oman", "United Arab Emirates", "Qatar", "Bahrain", "Chad", "Niger", "Estonia", "France", "San Marino", "Vatican", "Liechtenstein", "Andorra", "Monaco", "Spain"):
    if n in COUNTRY: units["C:" + n] = COUNTRY[n]
units["C:Cyprus"] = unary_union([units.pop("C:Cyprus"), units.pop("C:N. Cyprus")])
# boğazdan bölme: parçalar şehir noktasına göre ayrılır
def split(key, pt, other_key):
    parts = list(units[key].geoms); side = [p for p in parts if p.contains(Point(*pt))]
    assert side, key
    units[key] = unary_union(side); units[other_key] = unary_union([p for p in parts if p not in side])
split("TUR:Istanbul", (28.98, 41.01), "TUR:Istanbul-A")      # Avrupa yakası (Sultanahmet) ↔ Asya yakası
split("TUR:Çanakkale", (26.41, 40.15), "TUR:Gelibolu")       # Asya yakası (Çanakkale) ↔ yarımada + Gökçeada

lon0, lat0, R = math.radians(29), math.radians(40.5), 6371.0
def laea(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    k = math.sqrt(2 / (1 + math.sin(lat0) * math.sin(p) + math.cos(lat0) * math.cos(p) * math.cos(l - lon0)))
    return (R * k * math.cos(p) * math.sin(l - lon0), -R * k * (math.cos(lat0) * math.sin(p) - math.sin(lat0) * math.cos(p) * math.cos(l - lon0)))
def proj(g): return transform(lambda xs, ys, zs=None: tuple(zip(*[laea(x, y) for x, y in zip(xs, ys)])), g)
def simp(g, tol=1.2): return proj(g.intersection(VIEW)).simplify(tol, preserve_topology=True)
def keep(g, minarea=8):
    polys = [g] if isinstance(g, Polygon) else list(getattr(g, "geoms", []))
    return [p for p in polys if isinstance(p, Polygon) and p.area >= minarea]
def pack(g, tol=1.2, minarea=8):
    return [[[round(v, 1) for xy in p.exterior.coords[:-1] for v in xy]] for p in keep(simp(g, tol), minarea)]
def lines(g, minlen=3):
    if g.is_empty: return []
    ls = [g] if isinstance(g, LineString) else [x for x in getattr(g, "geoms", []) if isinstance(x, LineString)]
    if len(ls) > 1: m = linemerge(ls); ls = [m] if isinstance(m, LineString) else list(m.geoms)
    return [[round(v, 1) for xy in l.coords for v in xy] for l in ls if l.length >= minlen]
CITIES = {"Söğüt": (30.18, 40.02), "Bilecik": (29.98, 40.14), "Bursa": (29.06, 40.19), "İznik": (29.72, 40.43), "İzmit": (29.92, 40.77), "Mudanya": (28.88, 40.37),
          "Konstantinopolis": (28.98, 41.01), "Gelibolu": (26.67, 40.41), "Bolayır": (26.75, 40.52), "Dimetoka": (26.50, 41.35), "Edirne": (26.56, 41.68),
          "Çirmen": (26.23, 41.72), "Filibe": (24.75, 42.15), "Sofya": (23.32, 42.70), "Tırnova": (25.63, 43.08), "Niğbolu": (24.89, 43.70), "Vidin": (22.88, 43.99),
          "Kosova": (21.09, 42.66), "Selanik": (22.94, 40.64), "Belgrad": (20.46, 44.82), "Ankara": (32.85, 39.93), "Konya": (32.48, 37.87), "Kütahya": (29.98, 39.42),
          "Sivas": (37.02, 39.75), "Kayseri": (35.49, 38.73), "Malatya": (38.31, 38.35), "Erzincan": (39.49, 39.75), "Amasya": (35.83, 40.65), "Kastamonu": (33.78, 41.38),
          "Trabzon": (39.72, 41.0), "Alaşehir": (28.52, 38.35), "İzmir": (27.14, 38.42), "Kösedağ": (38.4, 40.1), "Çubuk Ovası": (32.95, 40.2), "Palekanon": (29.42, 40.78),
          "Bafeus": (29.75, 40.72), "Varna": (27.91, 43.21), "Buda": (19.04, 47.5), "Venedik": (12.33, 45.44), "Kahire": (31.24, 30.04), "Halep": (37.16, 36.2), "Tebriz": (46.29, 38.08)}
data = {"proj": {"type": "laea", "lon0": 29, "lat0": 40.5, "unit": "km"}, "units": {}, "cities": {k: [round(v, 1) for v in laea(*ll)] for k, ll in CITIES.items()},
        "centroid": {}, "area": {}, "cityUnit": {}}
P = {}
for k, g in units.items():
    ps = keep(simp(g))
    if ps:
        P[k] = unary_union(ps); data["units"][k] = [[[round(v, 1) for xy in p.exterior.coords[:-1] for v in xy]] for p in ps]
        c = P[k].representative_point(); data["centroid"][k] = [round(c.x, 1), round(c.y, 1)]; data["area"][k] = round(P[k].area)
for n, xy in data["cities"].items():
    hit = [k for k in P if P[k].buffer(4).contains(Point(*xy))]
    if hit: data["cityUnit"][n] = min(hit, key=lambda k: P[k].distance(Point(*xy)))
other = unary_union(list(COUNTRY.values())).difference(unary_union(list(units.values())).buffer(.02))
data["other"] = pack(other, 2.5, 40)
OTHER = unary_union(keep(simp(other, 2.5), 40))

# komşu birimler arası sınırlar: A'nın sınırının B'ye TOL km yakın kısmı (kaynak verileri birebir örtüşmediği için tamponla)
TOL = 3.5; keys = sorted(P); tree = STRtree([P[k] for k in keys]); edges = []
for i, ka in enumerate(keys):
    bnd = P[ka].boundary
    for j in tree.query(P[ka].buffer(TOL)):
        kb = keys[int(j)]
        if kb <= ka: continue
        ls = lines(bnd.intersection(P[kb].buffer(TOL)).simplify(1.0))
        if ls: edges.append([ka, kb, ls])
    ls = lines(bnd.intersection(OTHER.buffer(TOL)).simplify(1.0))
    if ls: edges.append([ka, "other", ls])
data["edges"] = edges
# kıyı: bütün karanın sınırı, görüş kutusunun kenarı hariç
land = unary_union(list(P.values()) + [OTHER])
viewb = proj(VIEW).boundary.buffer(6)
data["coast"] = lines(land.boundary.difference(viewb).simplify(1.0), 4)
# nehirler ve doğal göller (baraj gölleri hariç)
RIV = {"Danube": "Tuna", "Evros": "Meriç", "Sakarya": "Sakarya", "Kiz?lirmak": "Kızılırmak", "Firat": "Fırat", "Al Furat": "Fırat", "Euphrates": "Fırat",
       "Dicle": "Dicle", "Tigris": "Dicle", "Morava": "Morava", "Sava": "Sava", "Drina": "Drina", "Strymnas": "Struma", "Byk Menderes": "B. Menderes",
       "Kelkit": "Kelkit", "Murat": "Murat", "Aras": "Aras", "Ceyhan": "Ceyhan", "Simav": "Simav", "Haliacmon": "Vistrica", "Drin": "Drin", "Prut": "Prut",
       "Olt": "Olt", "Tisa": "Tisa", "Tisza": "Tisa", "Dnipro": "Dinyeper", "Dniester": "Turla", "Mures": "Moriş", "Jordan": "Şeria", "Po": "Po", "Bojana": "Bojana"}
rv = {}
for f in json.load(open(os.path.join(a.ne, "ne_10m_rivers_lake_centerlines.geojson")))["features"]:
    n = RIV.get(f["properties"].get("name"))
    if not n: continue
    g = shape(f["geometry"])
    if not g.intersects(VIEW): continue
    rv.setdefault(n, []).append(proj(g.intersection(VIEW)).simplify(1.5))
data["rivers"] = {n: lines(unary_union(gs), 5) for n, gs in rv.items()}
LAKES = {"Lake Van", "Lake Tuz", "Lake Urmia", "Lake Sevan", "Beyşehir", "Eğirdir", "Lake Balaton", "Lake Skadar", "Sea of Galilee"}
lk = []
for f in json.load(open(os.path.join(a.ne, "ne_10m_lakes.geojson")))["features"]:
    g = shape(f["geometry"]); n = f["properties"].get("name")
    if n in LAKES or (n is None and g.intersects(box(20.5, 40.6, 21.2, 41.2))): lk.append(g)   # adsızlar: Ohri ve Prespa
lk.append(Polygon([(29.33, 40.45), (29.40, 40.48), (29.52, 40.475), (29.65, 40.47), (29.71, 40.44), (29.66, 40.41), (29.52, 40.40), (29.40, 40.405)]))  # İznik Gölü (elle, yaklaşık)
lk.append(Polygon([(30.17, 40.71), (30.22, 40.73), (30.30, 40.725), (30.33, 40.71), (30.27, 40.69), (30.20, 40.69)]))                                 # Sapanca Gölü (elle, yaklaşık)
data["lakes"] = pack(unary_union(lk), 1.0, 20)
os.makedirs(os.path.dirname(a.out), exist_ok=True)
open(a.out, "w", encoding="utf-8").write("// shared/tools/build_anadolu_balkan.py ile üretildi (Natural Earth + ADM1). Birim km, LAEA(29E,40.5N)\nwindow.AB_MAP = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("yazıldı", a.out, round(os.path.getsize(a.out) / 1024), "KB,", len(data["units"]), "birim")
