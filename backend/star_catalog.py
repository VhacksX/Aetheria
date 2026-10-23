"""
Real Astronomical Star & Constellation Catalog.
Contains verified celestial coordinates (RA, Dec, J2000), visual magnitudes,
spectral types, and constellation line connections based on the Yale Bright Star & Hipparcos catalogs.
"""

from typing import List, Dict, Any

BRIGHT_STARS: List[Dict[str, Any]] = [
    # Orion
    {"id": "betelgeuse", "name": "Betelgeuse", "ra": 88.793, "dec": 7.407, "mag": 0.42, "spec": "M2", "color": "#ff694b", "const": "Ori"},
    {"id": "rigel", "name": "Rigel", "ra": 78.634, "dec": -8.202, "mag": 0.18, "spec": "B8", "color": "#a8caff", "const": "Ori"},
    {"id": "bellatrix", "name": "Bellatrix", "ra": 81.283, "dec": 6.350, "mag": 1.64, "spec": "B2", "color": "#bad4ff", "const": "Ori"},
    {"id": "saiph", "name": "Saiph", "ra": 86.939, "dec": -9.670, "mag": 2.07, "spec": "B0", "color": "#bad4ff", "const": "Ori"},
    {"id": "alnitak", "name": "Alnitak", "ra": 85.190, "dec": -1.943, "mag": 1.77, "spec": "O9", "color": "#9bb8ff", "const": "Ori"},
    {"id": "alnilam", "name": "Alnilam", "ra": 84.053, "dec": -1.202, "mag": 1.69, "spec": "B0", "color": "#9bb8ff", "const": "Ori"},
    {"id": "mintaka", "name": "Mintaka", "ra": 83.002, "dec": -0.299, "mag": 2.23, "spec": "B0", "color": "#9bb8ff", "const": "Ori"},
    {"id": "meissa", "name": "Meissa", "ra": 83.784, "dec": 9.934, "mag": 3.39, "spec": "O8", "color": "#9bb8ff", "const": "Ori"},

    # Canis Major & Minor
    {"id": "sirius", "name": "Sirius", "ra": 101.287, "dec": -16.716, "mag": -1.46, "spec": "A1", "color": "#e2ecff", "const": "CMa"},
    {"id": "adhara", "name": "Adhara", "ra": 104.656, "dec": -28.972, "mag": 1.50, "spec": "B2", "color": "#bad4ff", "const": "CMa"},
    {"id": "wezen", "name": "Wezen", "ra": 107.098, "dec": -26.393, "mag": 1.83, "spec": "F8", "color": "#fff2d5", "const": "CMa"},
    {"id": "mirzam", "name": "Mirzam", "ra": 95.675, "dec": -17.956, "mag": 1.98, "spec": "B1", "color": "#bad4ff", "const": "CMa"},
    {"id": "aludra", "name": "Aludra", "ra": 111.024, "dec": -29.303, "mag": 2.45, "spec": "B5", "color": "#c2d8ff", "const": "CMa"},
    {"id": "procyon", "name": "Procyon", "ra": 114.825, "dec": 5.225, "mag": 0.34, "spec": "F5", "color": "#fff7e6", "const": "CMi"},
    {"id": "gomeisa", "name": "Gomeisa", "ra": 111.787, "dec": 8.289, "mag": 2.89, "spec": "B8", "color": "#bad4ff", "const": "CMi"},

    # Ursa Major (Big Dipper)
    {"id": "dubhe", "name": "Dubhe", "ra": 165.932, "dec": 61.751, "mag": 1.79, "spec": "K0", "color": "#ffd89f", "const": "UMa"},
    {"id": "merak", "name": "Merak", "ra": 165.460, "dec": 56.382, "mag": 2.37, "spec": "A1", "color": "#e2ecff", "const": "UMa"},
    {"id": "phecda", "name": "Phecda", "ra": 178.458, "dec": 53.695, "mag": 2.44, "spec": "A0", "color": "#e2ecff", "const": "UMa"},
    {"id": "megrez", "name": "Megrez", "ra": 183.857, "dec": 57.033, "mag": 3.31, "spec": "A3", "color": "#e2ecff", "const": "UMa"},
    {"id": "alioth", "name": "Alioth", "ra": 193.507, "dec": 55.960, "mag": 1.77, "spec": "A1", "color": "#e2ecff", "const": "UMa"},
    {"id": "mizar", "name": "Mizar", "ra": 200.981, "dec": 54.925, "mag": 2.23, "spec": "A2", "color": "#e2ecff", "const": "UMa"},
    {"id": "alkaid", "name": "Alkaid", "ra": 206.885, "dec": 49.313, "mag": 1.86, "spec": "B3", "color": "#bad4ff", "const": "UMa"},

    # Ursa Minor
    {"id": "polaris", "name": "Polaris (North Star)", "ra": 37.954, "dec": 89.264, "mag": 1.98, "spec": "F7", "color": "#fff7e6", "const": "UMi"},
    {"id": "kochab", "name": "Kochab", "ra": 222.676, "dec": 74.156, "mag": 2.08, "spec": "K4", "color": "#ffbe77", "const": "UMi"},
    {"id": "pherkad", "name": "Pherkad", "ra": 230.191, "dec": 71.834, "mag": 3.05, "spec": "A3", "color": "#e2ecff", "const": "UMi"},

    # Cassiopeia (The 'W')
    {"id": "schedar", "name": "Schedar", "ra": 10.127, "dec": 56.537, "mag": 2.24, "spec": "K0", "color": "#ffd89f", "const": "Cas"},
    {"id": "caph", "name": "Caph", "ra": 2.295, "dec": 59.150, "mag": 2.28, "spec": "F2", "color": "#fffbf0", "const": "Cas"},
    {"id": "gamma_cas", "name": "Navi", "ra": 14.177, "dec": 60.717, "mag": 2.15, "spec": "B0", "color": "#bad4ff", "const": "Cas"},
    {"id": "ruchbah", "name": "Ruchbah", "ra": 21.454, "dec": 60.235, "mag": 2.68, "spec": "A5", "color": "#e2ecff", "const": "Cas"},
    {"id": "segin", "name": "Segin", "ra": 26.549, "dec": 63.670, "mag": 3.37, "spec": "B7", "color": "#bad4ff", "const": "Cas"},

    # Taurus & Pleiades
    {"id": "aldebaran", "name": "Aldebaran", "ra": 68.980, "dec": 16.509, "mag": 0.85, "spec": "K5", "color": "#ffaa55", "const": "Tau"},
    {"id": "elnath", "name": "Elnath", "ra": 81.573, "dec": 28.608, "mag": 1.65, "spec": "B7", "color": "#bad4ff", "const": "Tau"},
    {"id": "alcyone", "name": "Alcyone (Pleiades)", "ra": 56.871, "dec": 24.105, "mag": 2.87, "spec": "B7", "color": "#9dc4ff", "const": "Tau"},
    {"id": "tianguan", "name": "Tianguan", "ra": 84.411, "dec": 21.143, "mag": 3.00, "spec": "B2", "color": "#bad4ff", "const": "Tau"},

    # Gemini
    {"id": "pollux", "name": "Pollux", "ra": 116.329, "dec": 28.026, "mag": 1.14, "spec": "K0", "color": "#ffd89f", "const": "Gem"},
    {"id": "castor", "name": "Castor", "ra": 113.650, "dec": 31.888, "mag": 1.58, "spec": "A1", "color": "#e2ecff", "const": "Gem"},
    {"id": "alhena", "name": "Alhena", "ra": 99.428, "dec": 16.399, "mag": 1.93, "spec": "A1", "color": "#e2ecff", "const": "Gem"},
    {"id": "wasat", "name": "Wasat", "ra": 110.031, "dec": 21.982, "mag": 3.53, "spec": "F0", "color": "#fffbf0", "const": "Gem"},
    {"id": "mebuda", "name": "Mebsuta", "ra": 100.983, "dec": 25.131, "mag": 3.06, "spec": "G8", "color": "#ffdfa4", "const": "Gem"},

    # Cygnus & Lyra (Summer Triangle)
    {"id": "deneb", "name": "Deneb", "ra": 310.358, "dec": 45.280, "mag": 1.25, "spec": "A2", "color": "#e2ecff", "const": "Cyg"},
    {"id": "albireo", "name": "Albireo", "ra": 292.680, "dec": 27.960, "mag": 3.05, "spec": "K3", "color": "#ffd89f", "const": "Cyg"},
    {"id": "sadr", "name": "Sadr", "ra": 305.557, "dec": 40.257, "mag": 2.23, "spec": "F8", "color": "#fff2d5", "const": "Cyg"},
    {"id": "gienah_cyg", "name": "Gienah", "ra": 311.556, "dec": 33.970, "mag": 2.48, "spec": "K0", "color": "#ffd89f", "const": "Cyg"},
    {"id": "fawaris", "name": "Fawaris", "ra": 296.244, "dec": 45.131, "mag": 2.87, "spec": "B9", "color": "#bad4ff", "const": "Cyg"},
    {"id": "vega", "name": "Vega", "ra": 279.235, "dec": 38.784, "mag": 0.03, "spec": "A0", "color": "#e2ecff", "const": "Lyr"},
    {"id": "sheliak", "name": "Sheliak", "ra": 282.520, "dec": 33.363, "mag": 3.52, "spec": "B7", "color": "#bad4ff", "const": "Lyr"},
    {"id": "sulafat", "name": "Sulafat", "ra": 284.743, "dec": 32.690, "mag": 3.25, "spec": "B9", "color": "#bad4ff", "const": "Lyr"},

    # Aquila
    {"id": "altair", "name": "Altair", "ra": 297.696, "dec": 8.868, "mag": 0.77, "spec": "A7", "color": "#f4f6ff", "const": "Aql"},
    {"id": "tarazed", "name": "Tarazed", "ra": 296.537, "dec": 10.613, "mag": 2.72, "spec": "K3", "color": "#ffd89f", "const": "Aql"},
    {"id": "alshain", "name": "Alshain", "ra": 298.828, "dec": 6.407, "mag": 3.71, "spec": "G8", "color": "#ffdfa4", "const": "Aql"},

    # Leo
    {"id": "regulus", "name": "Regulus", "ra": 152.093, "dec": 11.967, "mag": 1.36, "spec": "B7", "color": "#bad4ff", "const": "Leo"},
    {"id": "denebola", "name": "Denebola", "ra": 177.265, "dec": 14.572, "mag": 2.14, "spec": "A3", "color": "#e2ecff", "const": "Leo"},
    {"id": "algieba", "name": "Algieba", "ra": 154.993, "dec": 19.842, "mag": 2.01, "spec": "K1", "color": "#ffd89f", "const": "Leo"},
    {"id": "z业务", "name": "Zosma", "ra": 168.527, "dec": 20.524, "mag": 2.56, "spec": "A4", "color": "#e2ecff", "const": "Leo"},

    # Scorpius
    {"id": "antares", "name": "Antares", "ra": 247.352, "dec": -26.432, "mag": 1.06, "spec": "M1", "color": "#ff5533", "const": "Sco"},
    {"id": "shaula", "name": "Shaula", "ra": 263.402, "dec": -37.104, "mag": 1.62, "spec": "B1", "color": "#bad4ff", "const": "Sco"},
    {"id": "sargas", "name": "Sargas", "ra": 264.329, "dec": -42.998, "mag": 1.86, "spec": "F1", "color": "#fffbf0", "const": "Sco"},
    {"id": "dschubba", "name": "Dschubba", "ra": 240.083, "dec": -22.622, "mag": 2.29, "spec": "B0", "color": "#bad4ff", "const": "Sco"},
    {"id": "wei", "name": "Wei", "ra": 252.166, "dec": -34.293, "mag": 2.29, "spec": "K2", "color": "#ffd89f", "const": "Sco"},

    # Boötes & Virgo
    {"id": "arcturus", "name": "Arcturus", "ra": 213.915, "dec": 19.182, "mag": -0.05, "spec": "K2", "color": "#ffba66", "const": "Boo"},
    {"id": "spica", "name": "Spica", "ra": 201.298, "dec": -11.161, "mag": 0.98, "spec": "B1", "color": "#bad4ff", "const": "Vir"},

    # Auriga
    {"id": "capella", "name": "Capella", "ra": 79.172, "dec": 45.998, "mag": 0.08, "spec": "G3", "color": "#ffdfa4", "const": "Aur"},
    {"id": "menkalinan", "name": "Menkalinan", "ra": 89.882, "dec": 44.947, "mag": 1.90, "spec": "A2", "color": "#e2ecff", "const": "Aur"},

    # Crux (Southern Cross) & Centaurus
    {"id": "acrux", "name": "Acrux", "ra": 186.650, "dec": -63.099, "mag": 0.77, "spec": "B0", "color": "#9bb8ff", "const": "Cru"},
    {"id": "mimosa", "name": "Mimosa", "ra": 191.930, "dec": -59.689, "mag": 1.25, "spec": "B0", "color": "#bad4ff", "const": "Cru"},
    {"id": "gacrux", "name": "Gacrux", "ra": 187.791, "dec": -57.113, "mag": 1.64, "spec": "M3", "color": "#ff7755", "const": "Cru"},
    {"id": "immai", "name": "Imai", "ra": 183.840, "dec": -58.749, "mag": 2.79, "spec": "B2", "color": "#bad4ff", "const": "Cru"},
    {"id": "alpha_cen", "name": "Rigil Kentaurus", "ra": 219.902, "dec": -60.834, "mag": -0.01, "spec": "G2", "color": "#ffe2a8", "const": "Cen"},
    {"id": "hadar", "name": "Hadar", "ra": 210.956, "dec": -60.373, "mag": 0.61, "spec": "B1", "color": "#bad4ff", "const": "Cen"},

    # Carina & Eridanus & Piscis Austrinus
    {"id": "canopus", "name": "Canopus", "ra": 95.988, "dec": -52.696, "mag": -0.74, "spec": "A9", "color": "#f8f9ff", "const": "Car"},
    {"id": "achernar", "name": "Achernar", "ra": 24.429, "dec": -57.237, "mag": 0.45, "spec": "B6", "color": "#bad4ff", "const": "Eri"},
    {"id": "fomalhaut", "name": "Fomalhaut", "ra": 344.413, "dec": -29.622, "mag": 1.17, "spec": "A3", "color": "#e2ecff", "const": "PsA"},

    # Pegasus
    {"id": "markab", "name": "Markab", "ra": 346.190, "dec": 15.205, "mag": 2.49, "spec": "B9", "color": "#bad4ff", "const": "Peg"},
    {"id": "scheat", "name": "Scheat", "ra": 345.944, "dec": 28.083, "mag": 2.44, "spec": "M2", "color": "#ff8866", "const": "Peg"},
    {"id": "algenib", "name": "Algenib", "ra": 3.309, "dec": 15.183, "mag": 2.84, "spec": "B2", "color": "#bad4ff", "const": "Peg"},
    {"id": "enif", "name": "Enif", "ra": 326.046, "dec": 9.875, "mag": 2.38, "spec": "K2", "color": "#ffd89f", "const": "Peg"}
]

# Verified Constellation lines connecting star IDs
CONSTELLATIONS: List[Dict[str, Any]] = [
    {
        "id": "Ori",
        "name": "Orion",
        "english": "The Hunter",
        "lines": [
            ["betelgeuse", "bellatrix"],
            ["bellatrix", "mintaka"],
            ["mintaka", "alnilam"],
            ["alnilam", "alnitak"],
            ["alnitak", "saiph"],
            ["saiph", "rigel"],
            ["alnitak", "betelgeuse"],
            ["betelgeuse", "meissa"],
            ["meissa", "bellatrix"]
        ]
    },
    {
        "id": "UMa",
        "name": "Ursa Major",
        "english": "The Great Bear (Big Dipper)",
        "lines": [
            ["dubhe", "merak"],
            ["merak", "phecda"],
            ["phecda", "megrez"],
            ["megrez", "dubhe"],
            ["megrez", "alioth"],
            ["alioth", "mizar"],
            ["mizar", "alkaid"]
        ]
    },
    {
        "id": "UMi",
        "name": "Ursa Minor",
        "english": "The Little Bear",
        "lines": [
            ["polaris", "kochab"],
            ["kochab", "pherkad"]
        ]
    },
    {
        "id": "Cas",
        "name": "Cassiopeia",
        "english": "The Queen",
        "lines": [
            ["caph", "schedar"],
            ["schedar", "gamma_cas"],
            ["gamma_cas", "ruchbah"],
            ["ruchbah", "segin"]
        ]
    },
    {
        "id": "Cyg",
        "name": "Cygnus",
        "english": "The Swan (Northern Cross)",
        "lines": [
            ["deneb", "sadr"],
            ["sadr", "albireo"],
            ["fawaris", "sadr"],
            ["sadr", "gienah_cyg"]
        ]
    },
    {
        "id": "Tau",
        "name": "Taurus",
        "english": "The Bull",
        "lines": [
            ["aldebaran", "elnath"],
            ["aldebaran", "tianguan"],
            ["aldebaran", "alcyone"]
        ]
    },
    {
        "id": "Gem",
        "name": "Gemini",
        "english": "The Twins",
        "lines": [
            ["castor", "pollux"],
            ["castor", "mebuda"],
            ["mebuda", "alhena"],
            ["pollux", "wasat"]
        ]
    },
    {
        "id": "CMa",
        "name": "Canis Major",
        "english": "The Great Dog",
        "lines": [
            ["mirzam", "sirius"],
            ["sirius", "adhara"],
            ["adhara", "wezen"],
            ["wezen", "aludra"]
        ]
    },
    {
        "id": "Sco",
        "name": "Scorpius",
        "english": "The Scorpion",
        "lines": [
            ["dschubba", "antares"],
            ["antares", "wei"],
            ["wei", "sargas"],
            ["sargas", "shaula"]
        ]
    },
    {
        "id": "Cru",
        "name": "Crux",
        "english": "The Southern Cross",
        "lines": [
            ["gacrux", "acrux"],
            ["mimosa", "immai"]
        ]
    },
    {
        "id": "Lyr",
        "name": "Lyra",
        "english": "The Lyre",
        "lines": [
            ["vega", "sheliak"],
            ["sheliak", "sulafat"]
        ]
    },
    {
        "id": "Peg",
        "name": "Pegasus",
        "english": "The Winged Horse",
        "lines": [
            ["markab", "scheat"],
            ["scheat", "algenib"],
            ["algenib", "markab"],
            ["markab", "enif"]
        ]
    }
]

# Real Observable Comets & Asteroids
COMETS_AND_ASTEROIDS: List[Dict[str, Any]] = [
    {
        "id": "comet_tsuchinshan",
        "name": "Comet C/2023 A3 (Tsuchinshan-ATLAS)",
        "type": "comet",
        "ra": 232.45,
        "dec": 1.15,
        "mag": 3.2,
        "tail_length_deg": 4.5,
        "color": "#ffffff",
        "description": "Oort cloud comet with a brilliant dust and ion tail visible in the evening sky."
    },
    {
        "id": "comet_halley",
        "name": "1P/Halley",
        "type": "comet",
        "ra": 128.60,
        "dec": 12.40,
        "mag": 6.8,
        "tail_length_deg": 2.8,
        "color": "#f5f7fa",
        "description": "The most famous periodic retrograde comet in human history (period ~76 years)."
    },
    {
        "id": "comet_encke",
        "name": "2P/Encke",
        "type": "comet",
        "ra": 312.80,
        "dec": 18.25,
        "mag": 7.4,
        "tail_length_deg": 1.8,
        "color": "#eef2f6",
        "description": "Shortest orbital period of any known comet in the solar system (3.3 years)."
    },
    {
        "id": "asteroid_ceres",
        "name": "1 Ceres (Dwarf Planet)",
        "type": "asteroid",
        "ra": 274.15,
        "dec": -28.40,
        "mag": 7.1,
        "tail_length_deg": 0.0,
        "color": "#e2e8f0",
        "description": "Largest object in the asteroid belt between Mars and Jupiter, discovered in 1801."
    },
    {
        "id": "asteroid_vesta",
        "name": "4 Vesta",
        "type": "asteroid",
        "ra": 195.30,
        "dec": -4.80,
        "mag": 6.2,
        "tail_length_deg": 0.0,
        "color": "#edf2f7",
        "description": "Brightest asteroid visible from Earth with a basaltic rocky crust and deep impact craters."
    }
]
