// Ortak zaman çizelgesi: animasyon (anim.js) ve ses (make_audio.py) bu dosyayı okur.
// Değiştirirken geçerli JSON olarak bırakın (çift tırnak, sonda virgül yok).
window.TL = {
  "duration": 40,
  "lines": [
    {"t0": 0.20, "t1": 3.40, "text": "Yetmiş savaş gemisi… tek bir gecede karadan yürüdü.", "hl": ["yetmiş", "gecede", "karadan"]},
    {"t0": 3.75, "t1": 7.30, "text": "Yıl 1453. Fatih Sultan Mehmed, İstanbul’u kuşatmıştı.", "hl": ["1453.", "istanbul’u"]},
    {"t0": 7.60, "t1": 10.40, "text": "Ama Haliç’in ağzı, dev bir zincirle kapatılmıştı.", "hl": ["zincirle", "haliç’in"]},
    {"t0": 10.60, "t1": 13.10, "text": "Osmanlı donanması içeri giremiyordu.", "hl": ["giremiyordu."]},
    {"t0": 13.55, "t1": 17.25, "text": "Yirmi bir yaşındaki padişah, kimsenin aklına gelmeyeni düşündü:", "hl": ["yirmi", "bir", "gelmeyeni"]},
    {"t0": 17.55, "t1": 19.55, "text": "Gemiler karadan geçecekti!", "hl": ["karadan"]},
    {"t0": 19.95, "t1": 24.20, "text": "Yağlanmış kütükler döşendi. Öküzler ve binlerce asker, gemileri tepelere çekti.", "hl": ["kütükler", "binlerce"]},
    {"t0": 24.40, "t1": 27.30, "text": "Yelkenler açık… davullar çalarak!", "hl": ["yelkenler", "davullar"]},
    {"t0": 27.75, "t1": 31.55, "text": "Sabah Bizanslılar uyandığında, Osmanlı gemileri Haliç’in içindeydi!", "hl": ["haliç’in", "içindeydi!"]},
    {"t0": 31.80, "t1": 33.45, "text": "Savunma ikiye bölündü.", "hl": ["ikiye"]},
    {"t0": 33.70, "t1": 36.00, "text": "Ve 29 Mayıs’ta İstanbul fethedildi.", "hl": ["29", "fethedildi."]},
    {"t0": 36.35, "t1": 38.90, "text": "Bir çağ kapandı. Yeni bir çağ açıldı.", "hl": ["yeni"]}
  ],
  "scenes": [
    {"id": "hook",     "t0": 0.0,  "t1": 3.6},
    {"id": "siege",    "t0": 3.6,  "t1": 13.4},
    {"id": "portrait", "t0": 13.4, "t1": 17.5},
    {"id": "route",    "t0": 17.5, "t1": 19.9},
    {"id": "haul",     "t0": 19.9, "t1": 27.6},
    {"id": "dawn",     "t0": 27.6, "t1": 31.8},
    {"id": "fall",     "t0": 31.8, "t1": 36.2},
    {"id": "finale",   "t0": 36.2, "t1": 40.0}
  ],
  "transitions": [
    {"t": 3.6,  "d": 0.22, "type": "flash"},
    {"t": 13.4, "d": 0.30, "type": "dip"},
    {"t": 17.5, "d": 0.22, "type": "whip"},
    {"t": 19.9, "d": 0.35, "type": "dive"},
    {"t": 27.6, "d": 0.30, "type": "flash"},
    {"t": 31.8, "d": 0.22, "type": "whip"},
    {"t": 36.2, "d": 0.30, "type": "flash"}
  ],
  "hits": [
    {"t": 0.30, "amp": 14, "sfx": "davul"},
    {"t": 1.40, "amp": 14, "sfx": "davul"},
    {"t": 2.45, "amp": 22, "sfx": "boom"},
    {"t": 4.10, "amp": 6,  "sfx": "stamp"},
    {"t": 8.10, "amp": 8,  "sfx": "chain"},
    {"t": 11.55, "amp": 10, "sfx": "thud"},
    {"t": 12.05, "amp": 6,  "sfx": "thud"},
    {"t": 15.70, "amp": 0,  "sfx": "chime"},
    {"t": 17.60, "amp": 10, "sfx": "davul"},
    {"t": 24.40, "amp": 12, "sfx": "boom"},
    {"t": 30.15, "amp": 26, "sfx": "boom"},
    {"t": 34.05, "amp": 22, "sfx": "boom"},
    {"t": 36.30, "amp": 10, "sfx": "boom"}
  ],
  "risers": [[12.4, 13.4], [26.2, 27.6], [29.0, 30.15], [33.0, 34.05]],
  "vo": {
    "file": "vo/full.mp3",
    "line_seg": [0, 3, 6, 8, 9, 11, 13, 15, 17, 21, 23, 25],
    "max_gap": 0.2, "max_line_gap": 0.3, "target": 38.2, "max_speed": 1.15,
    "anchors": [[1.38, 1], [2.43, 2], [8.1, 7], [30.15, 20], [34.05, 24]]
  }
};
