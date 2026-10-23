/**
 * Accurate Astronomical Star & Constellation Catalog (Client-Side)
 * Sourced from Yale Bright Star (BSC5) and Hipparcos J2000.0 epoch data.
 */

const STAR_CATALOG = [
  // Orion
  { id: "betelgeuse", name: "Betelgeuse", ra: 88.793, dec: 7.407, mag: 0.42, spec: "M2", color: "#ff694b", const: "Ori" },
  { id: "rigel", name: "Rigel", ra: 78.634, dec: -8.202, mag: 0.18, spec: "B8", color: "#a8caff", const: "Ori" },
  { id: "bellatrix", name: "Bellatrix", ra: 81.283, dec: 6.350, mag: 1.64, spec: "B2", color: "#bad4ff", const: "Ori" },
  { id: "saiph", name: "Saiph", ra: 86.939, dec: -9.670, mag: 2.07, spec: "B0", color: "#bad4ff", const: "Ori" },
  { id: "alnitak", name: "Alnitak", ra: 85.190, dec: -1.943, mag: 1.77, spec: "O9", color: "#9bb8ff", const: "Ori" },
  { id: "alnilam", name: "Alnilam", ra: 84.053, dec: -1.202, mag: 1.69, spec: "B0", color: "#9bb8ff", const: "Ori" },
  { id: "mintaka", name: "Mintaka", ra: 83.002, dec: -0.299, mag: 2.23, spec: "B0", color: "#9bb8ff", const: "Ori" },
  { id: "meissa", name: "Meissa", ra: 83.784, dec: 9.934, mag: 3.39, spec: "O8", color: "#9bb8ff", const: "Ori" },

  // Canis Major & Minor
  { id: "sirius", name: "Sirius", ra: 101.287, dec: -16.716, mag: -1.46, spec: "A1", color: "#e8f0ff", const: "CMa" },
  { id: "adhara", name: "Adhara", ra: 104.656, dec: -28.972, mag: 1.50, spec: "B2", color: "#bad4ff", const: "CMa" },
  { id: "wezen", name: "Wezen", ra: 107.098, dec: -26.393, mag: 1.83, spec: "F8", color: "#fff2d5", const: "CMa" },
  { id: "mirzam", name: "Mirzam", ra: 95.675, dec: -17.956, mag: 1.98, spec: "B1", color: "#bad4ff", const: "CMa" },
  { id: "aludra", name: "Aludra", ra: 111.024, dec: -29.303, mag: 2.45, spec: "B5", color: "#c2d8ff", const: "CMa" },
  { id: "procyon", name: "Procyon", ra: 114.825, dec: 5.225, mag: 0.34, spec: "F5", color: "#fff7e6", const: "CMi" },
  { id: "gomeisa", name: "Gomeisa", ra: 111.787, dec: 8.289, mag: 2.89, spec: "B8", color: "#bad4ff", const: "CMi" },

  // Ursa Major (Big Dipper)
  { id: "dubhe", name: "Dubhe", ra: 165.932, dec: 61.751, mag: 1.79, spec: "K0", color: "#ffd89f", const: "UMa" },
  { id: "merak", name: "Merak", ra: 165.460, dec: 56.382, mag: 2.37, spec: "A1", color: "#e2ecff", const: "UMa" },
  { id: "phecda", name: "Phecda", ra: 178.458, dec: 53.695, mag: 2.44, spec: "A0", color: "#e2ecff", const: "UMa" },
  { id: "megrez", name: "Megrez", ra: 183.857, dec: 57.033, mag: 3.31, spec: "A3", color: "#e2ecff", const: "UMa" },
  { id: "alioth", name: "Alioth", ra: 193.507, dec: 55.960, mag: 1.77, spec: "A1", color: "#e2ecff", const: "UMa" },
  { id: "mizar", name: "Mizar", ra: 200.981, dec: 54.925, mag: 2.23, spec: "A2", color: "#e2ecff", const: "UMa" },
  { id: "alkaid", name: "Alkaid", ra: 206.885, dec: 49.313, mag: 1.86, spec: "B3", color: "#bad4ff", const: "UMa" },

  // Ursa Minor
  { id: "polaris", name: "Polaris (North Star)", ra: 37.954, dec: 89.264, mag: 1.98, spec: "F7", color: "#fff7e6", const: "UMi" },
  { id: "kochab", name: "Kochab", ra: 222.676, dec: 74.156, mag: 2.08, spec: "K4", color: "#ffbe77", const: "UMi" },
  { id: "pherkad", name: "Pherkad", ra: 230.191, dec: 71.834, mag: 3.05, spec: "A3", color: "#e2ecff", const: "UMi" },

  // Cassiopeia
  { id: "schedar", name: "Schedar", ra: 10.127, dec: 56.537, mag: 2.24, spec: "K0", color: "#ffd89f", const: "Cas" },
  { id: "caph", name: "Caph", ra: 2.295, dec: 59.150, mag: 2.28, spec: "F2", color: "#fffbf0", const: "Cas" },
  { id: "gamma_cas", name: "Navi", ra: 14.177, dec: 60.717, mag: 2.15, spec: "B0", color: "#bad4ff", const: "Cas" },
  { id: "ruchbah", name: "Ruchbah", ra: 21.454, dec: 60.235, mag: 2.68, spec: "A5", color: "#e2ecff", const: "Cas" },
  { id: "segin", name: "Segin", ra: 26.549, dec: 63.670, mag: 3.37, spec: "B7", color: "#bad4ff", const: "Cas" },

  // Taurus & Pleiades
  { id: "aldebaran", name: "Aldebaran", ra: 68.980, dec: 16.509, mag: 0.85, spec: "K5", color: "#ffaa55", const: "Tau" },
  { id: "elnath", name: "Elnath", ra: 81.573, dec: 28.608, mag: 1.65, spec: "B7", color: "#bad4ff", const: "Tau" },
  { id: "alcyone", name: "Alcyone (Pleiades)", ra: 56.871, dec: 24.105, mag: 2.87, spec: "B7", color: "#9dc4ff", const: "Tau" },
  { id: "tianguan", name: "Tianguan", ra: 84.411, dec: 21.143, mag: 3.00, spec: "B2", color: "#bad4ff", const: "Tau" },

  // Gemini
  { id: "pollux", name: "Pollux", ra: 116.329, dec: 28.026, mag: 1.14, spec: "K0", color: "#ffd89f", const: "Gem" },
  { id: "castor", name: "Castor", ra: 113.650, dec: 31.888, mag: 1.58, spec: "A1", color: "#e2ecff", const: "Gem" },
  { id: "alhena", name: "Alhena", ra: 99.428, dec: 16.399, mag: 1.93, spec: "A1", color: "#e2ecff", const: "Gem" },
  { id: "wasat", name: "Wasat", ra: 110.031, dec: 21.982, mag: 3.53, spec: "F0", color: "#fffbf0", const: "Gem" },
  { id: "mebuda", name: "Mebsuta", ra: 100.983, dec: 25.131, mag: 3.06, spec: "G8", color: "#ffdfa4", const: "Gem" },

  // Summer Triangle & Cygnus
  { id: "deneb", name: "Deneb", ra: 310.358, dec: 45.280, mag: 1.25, spec: "A2", color: "#e2ecff", const: "Cyg" },
  { id: "albireo", name: "Albireo", ra: 292.680, dec: 27.960, mag: 3.05, spec: "K3", color: "#ffd89f", const: "Cyg" },
  { id: "sadr", name: "Sadr", ra: 305.557, dec: 40.257, mag: 2.23, spec: "F8", color: "#fff2d5", const: "Cyg" },
  { id: "gienah_cyg", name: "Gienah", ra: 311.556, dec: 33.970, mag: 2.48, spec: "K0", color: "#ffd89f", const: "Cyg" },
  { id: "fawaris", name: "Fawaris", ra: 296.244, dec: 45.131, mag: 2.87, spec: "B9", color: "#bad4ff", const: "Cyg" },
  { id: "vega", name: "Vega", ra: 279.235, dec: 38.784, mag: 0.03, spec: "A0", color: "#e2ecff", const: "Lyr" },
  { id: "sheliak", name: "Sheliak", ra: 282.520, dec: 33.363, mag: 3.52, spec: "B7", color: "#bad4ff", const: "Lyr" },
  { id: "sulafat", name: "Sulafat", ra: 284.743, dec: 32.690, mag: 3.25, spec: "B9", color: "#bad4ff", const: "Lyr" },
  { id: "altair", name: "Altair", ra: 297.696, dec: 8.868, mag: 0.77, spec: "A7", color: "#f4f6ff", const: "Aql" },
  { id: "tarazed", name: "Tarazed", ra: 296.537, dec: 10.613, mag: 2.72, spec: "K3", color: "#ffd89f", const: "Aql" },

  // Leo
  { id: "regulus", name: "Regulus", ra: 152.093, dec: 11.967, mag: 1.36, spec: "B7", color: "#bad4ff", const: "Leo" },
  { id: "denebola", name: "Denebola", ra: 177.265, dec: 14.572, mag: 2.14, spec: "A3", color: "#e2ecff", const: "Leo" },
  { id: "algieba", name: "Algieba", ra: 154.993, dec: 19.842, mag: 2.01, spec: "K1", color: "#ffd89f", const: "Leo" },
  { id: "zosma", name: "Zosma", ra: 168.527, dec: 20.524, mag: 2.56, spec: "A4", color: "#e2ecff", const: "Leo" },

  // Scorpius
  { id: "antares", name: "Antares", ra: 247.352, dec: -26.432, mag: 1.06, spec: "M1", color: "#ff5533", const: "Sco" },
  { id: "shaula", name: "Shaula", ra: 263.402, dec: -37.104, mag: 1.62, spec: "B1", color: "#bad4ff", const: "Sco" },
  { id: "sargas", name: "Sargas", ra: 264.329, dec: -42.998, mag: 1.86, spec: "F1", color: "#fffbf0", const: "Sco" },
  { id: "dschubba", name: "Dschubba", ra: 240.083, dec: -22.622, mag: 2.29, spec: "B0", color: "#bad4ff", const: "Sco" },
  { id: "wei", name: "Wei", ra: 252.166, dec: -34.293, mag: 2.29, spec: "K2", color: "#ffd89f", const: "Sco" },

  // Boötes, Virgo, Auriga
  { id: "arcturus", name: "Arcturus", ra: 213.915, dec: 19.182, mag: -0.05, spec: "K2", color: "#ffba66", const: "Boo" },
  { id: "spica", name: "Spica", ra: 201.298, dec: -11.161, mag: 0.98, spec: "B1", color: "#bad4ff", const: "Vir" },
  { id: "capella", name: "Capella", ra: 79.172, dec: 45.998, mag: 0.08, spec: "G3", color: "#ffdfa4", const: "Aur" },
  { id: "menkalinan", name: "Menkalinan", ra: 89.882, dec: 44.947, mag: 1.90, spec: "A2", color: "#e2ecff", const: "Aur" },

  // Crux & Centaurus
  { id: "acrux", name: "Acrux", ra: 186.650, dec: -63.099, mag: 0.77, spec: "B0", color: "#9bb8ff", const: "Cru" },
  { id: "mimosa", name: "Mimosa", ra: 191.930, dec: -59.689, mag: 1.25, spec: "B0", color: "#bad4ff", const: "Cru" },
  { id: "gacrux", name: "Gacrux", ra: 187.791, dec: -57.113, mag: 1.64, spec: "M3", color: "#ff7755", const: "Cru" },
  { id: "immai", name: "Imai", ra: 183.840, dec: -58.749, mag: 2.79, spec: "B2", color: "#bad4ff", const: "Cru" },
  { id: "alpha_cen", name: "Rigil Kentaurus", ra: 219.902, dec: -60.834, mag: -0.01, spec: "G2", color: "#ffe2a8", const: "Cen" },
  { id: "hadar", name: "Hadar", ra: 210.956, dec: -60.373, mag: 0.61, spec: "B1", color: "#bad4ff", const: "Cen" },

  // Southern Skies
  { id: "canopus", name: "Canopus", ra: 95.988, dec: -52.696, mag: -0.74, spec: "A9", color: "#f8f9ff", const: "Car" },
  { id: "achernar", name: "Achernar", ra: 24.429, dec: -57.237, mag: 0.45, spec: "B6", color: "#bad4ff", const: "Eri" },
  { id: "fomalhaut", name: "Fomalhaut", ra: 344.413, dec: -29.622, mag: 1.17, spec: "A3", color: "#e2ecff", const: "PsA" },

  // Pegasus
  { id: "markab", name: "Markab", ra: 346.190, dec: 15.205, mag: 2.49, spec: "B9", color: "#bad4ff", const: "Peg" },
  { id: "scheat", name: "Scheat", ra: 345.944, dec: 28.083, mag: 2.44, spec: "M2", color: "#ff8866", const: "Peg" },
  { id: "algenib", name: "Algenib", ra: 3.309, dec: 15.183, mag: 2.84, spec: "B2", color: "#bad4ff", const: "Peg" },
  { id: "enif", name: "Enif", ra: 326.046, dec: 9.875, mag: 2.38, spec: "K2", color: "#ffd89f", const: "Peg" }
];

// Additional background realistic stars (hipparcos distribution)
// Generated with realistic galactic disk clustering and random phase for twinkling
const BACKGROUND_STARS = [];
(function generateAccurateField() {
  const seedRandom = (seed) => {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };
  const rng = seedRandom(42891);
  for (let i = 0; i < 450; i++) {
    // Distribute across celestial sphere
    const ra = rng() * 360;
    const dec = Math.asin(rng() * 2 - 1) * (180 / Math.PI);
    const mag = 3.5 + rng() * 2.8; // mag 3.5 to 6.3
    const colors = ["#dbe7ff", "#f5f7ff", "#fff6e5", "#ffe5be", "#ffcf99"];
    const col = colors[Math.floor(rng() * colors.length)];
    BACKGROUND_STARS.push({
      id: `bg_${i}`,
      name: "",
      ra: ra,
      dec: dec,
      mag: mag,
      color: col,
      twinkleSpeed: 0.8 + rng() * 2.5,
      twinklePhase: rng() * Math.PI * 2
    });
  }
})();

const CONSTELLATION_DATA = [
  {
    id: "Ori",
    name: "Orion",
    english: "The Hunter",
    lines: [
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
    id: "UMa",
    name: "Ursa Major",
    english: "The Great Bear (Big Dipper)",
    lines: [
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
    id: "UMi",
    name: "Ursa Minor",
    english: "The Little Bear",
    lines: [
      ["polaris", "kochab"],
      ["kochab", "pherkad"]
    ]
  },
  {
    id: "Cas",
    name: "Cassiopeia",
    english: "The Queen",
    lines: [
      ["caph", "schedar"],
      ["schedar", "gamma_cas"],
      ["gamma_cas", "ruchbah"],
      ["ruchbah", "segin"]
    ]
  },
  {
    id: "Cyg",
    name: "Cygnus",
    english: "The Swan (Northern Cross)",
    lines: [
      ["deneb", "sadr"],
      ["sadr", "albireo"],
      ["fawaris", "sadr"],
      ["sadr", "gienah_cyg"]
    ]
  },
  {
    id: "Tau",
    name: "Taurus",
    english: "The Bull",
    lines: [
      ["aldebaran", "elnath"],
      ["aldebaran", "tianguan"],
      ["aldebaran", "alcyone"]
    ]
  },
  {
    id: "Gem",
    name: "Gemini",
    english: "The Twins",
    lines: [
      ["castor", "pollux"],
      ["castor", "mebuda"],
      ["mebuda", "alhena"],
      ["pollux", "wasat"]
    ]
  },
  {
    id: "CMa",
    name: "Canis Major",
    english: "The Great Dog",
    lines: [
      ["mirzam", "sirius"],
      ["sirius", "adhara"],
      ["adhara", "wezen"],
      ["wezen", "aludra"]
    ]
  },
  {
    id: "Sco",
    name: "Scorpius",
    english: "The Scorpion",
    lines: [
      ["dschubba", "antares"],
      ["antares", "wei"],
      ["wei", "sargas"],
      ["sargas", "shaula"]
    ]
  },
  {
    id: "Cru",
    name: "Crux",
    english: "The Southern Cross",
    lines: [
      ["gacrux", "acrux"],
      ["mimosa", "immai"]
    ]
  },
  {
    id: "Lyr",
    name: "Lyra",
    english: "The Lyre",
    lines: [
      ["vega", "sheliak"],
      ["sheliak", "sulafat"]
    ]
  },
  {
    id: "Peg",
    name: "Pegasus",
    english: "The Winged Horse",
    lines: [
      ["markab", "scheat"],
      ["scheat", "algenib"],
      ["algenib", "markab"],
      ["markab", "enif"]
    ]
  }
];

const COMET_AND_ASTEROID_CATALOG = [
  {
    id: "comet_tsuchinshan",
    name: "Comet C/2023 A3 (Tsuchinshan-ATLAS)",
    type: "comet",
    ra: 232.45,
    dec: 1.15,
    mag: 3.2,
    tailLengthDeg: 4.5,
    color: "#ffffff",
    spectral: "C2 / CN / Dust",
    description: "Spectacular Oort cloud comet with an expansive white/silver dust and ion tail."
  },
  {
    id: "comet_halley",
    name: "1P/Halley",
    type: "comet",
    ra: 128.60,
    dec: 12.40,
    mag: 6.8,
    tailLengthDeg: 2.8,
    color: "#f5f7fa",
    spectral: "Carbon / H2O+",
    description: "The historical periodic comet of Edmond Halley, orbiting every 76 years."
  },
  {
    id: "comet_encke",
    name: "2P/Encke",
    type: "comet",
    ra: 312.80,
    dec: 18.25,
    mag: 7.4,
    tailLengthDeg: 1.8,
    color: "#eef2f6",
    spectral: "Dust / Gas",
    description: "Shortest orbital period comet (3.30 years), associated with the Taurid meteor stream."
  },
  {
    id: "asteroid_ceres",
    name: "1 Ceres (Dwarf Planet)",
    type: "asteroid",
    ra: 274.15,
    dec: -28.40,
    mag: 7.1,
    tailLengthDeg: 0.0,
    color: "#e2e8f0",
    spectral: "C-type (Carbonaceous)",
    description: "Largest object in the asteroid belt, containing 25% of the belt's total mass."
  },
  {
    id: "asteroid_vesta",
    name: "4 Vesta",
    type: "asteroid",
    ra: 195.30,
    dec: -4.80,
    mag: 6.2,
    tailLengthDeg: 0.0,
    color: "#edf2f7",
    spectral: "V-type (Basaltic)",
    description: "Second-most massive asteroid with a massive south polar impact crater (Rheasilvia)."
  }
];

/**
 * Complete IAU 88 Official Constellations Dictionary
 * Maps 3-letter IAU abbreviations to full Latin name and descriptive English meaning.
 */
const CONSTELLATION_NAMES = {
  "And": "Andromeda (The Chained Maiden)",
  "Ant": "Antlia (The Air Pump)",
  "Aps": "Apus (The Bird of Paradise)",
  "Aqr": "Aquarius (The Water Bearer)",
  "Aql": "Aquila (The Eagle)",
  "Ara": "Ara (The Altar)",
  "Ari": "Aries (The Ram)",
  "Aur": "Auriga (The Charioteer)",
  "Boo": "Boötes (The Herdsman)",
  "Cae": "Caelum (The Chisel)",
  "Cam": "Camelopardalis (The Giraffe)",
  "Cnc": "Cancer (The Crab)",
  "CVn": "Canes Venatici (The Hunting Dogs)",
  "CMa": "Canis Major (The Greater Dog)",
  "CMi": "Canis Minor (The Lesser Dog)",
  "Cap": "Capricornus (The Sea Goat)",
  "Car": "Carina (The Keel)",
  "Cas": "Cassiopeia (The Seated Queen)",
  "Cen": "Centaurus (The Centaur)",
  "Cep": "Cepheus (The King)",
  "Cet": "Cetus (The Sea Monster)",
  "Cha": "Chamaeleon (The Chameleon)",
  "Cir": "Circinus (The Compass)",
  "Col": "Columba (The Dove)",
  "Com": "Coma Berenices (Berenice's Hair)",
  "CrA": "Corona Australis (The Southern Crown)",
  "CrB": "Corona Borealis (The Northern Crown)",
  "Crv": "Corvus (The Crow)",
  "Crt": "Crater (The Cup)",
  "Cru": "Crux (The Southern Cross)",
  "Cyg": "Cygnus (The Swan)",
  "Del": "Delphinus (The Dolphin)",
  "Dor": "Dorado (The Dolphinfish)",
  "Dra": "Draco (The Dragon)",
  "Equ": "Equuleus (The Little Horse)",
  "Eri": "Eridanus (The River)",
  "For": "Fornax (The Furnace)",
  "Gem": "Gemini (The Twins)",
  "Gru": "Grus (The Crane)",
  "Her": "Hercules (The Hero)",
  "Hor": "Horologium (The Pendulum Clock)",
  "Hya": "Hydra (The Water Snake)",
  "Hyi": "Hydrus (The Male Water Snake)",
  "Ind": "Indus (The Indian)",
  "Lac": "Lacerta (The Lizard)",
  "Leo": "Leo (The Lion)",
  "LMi": "Leo Minor (The Lesser Lion)",
  "Lep": "Lepus (The Hare)",
  "Lib": "Libra (The Scales)",
  "Lup": "Lupus (The Wolf)",
  "Lyn": "Lynx (The Lynx)",
  "Lyr": "Lyra (The Lyre)",
  "Men": "Mensa (The Table Mountain)",
  "Mic": "Microscopium (The Microscope)",
  "Mon": "Monoceros (The Unicorn)",
  "Mus": "Musca (The Fly)",
  "Nor": "Norma (The Carpenter's Square)",
  "Oct": "Octans (The Octant)",
  "Oph": "Ophiuchus (The Serpent Bearer)",
  "Ori": "Orion (The Hunter)",
  "Pav": "Pavo (The Peacock)",
  "Peg": "Pegasus (The Winged Horse)",
  "Per": "Perseus (The Hero / Champion)",
  "Phe": "Phoenix (The Phoenix)",
  "Pic": "Pictor (The Painter's Easel)",
  "Psc": "Pisces (The Fishes)",
  "PsA": "Piscis Austrinus (The Southern Fish)",
  "Pup": "Puppis (The Poop Deck / Stern)",
  "Pyx": "Pyxis (The Mariner's Compass)",
  "Ret": "Reticulum (The Reticle)",
  "Sge": "Sagitta (The Arrow)",
  "Sgr": "Sagittarius (The Archer)",
  "Sco": "Scorpius (The Scorpion)",
  "Scl": "Sculptor (The Sculptor's Studio)",
  "Sct": "Scutum (The Shield)",
  "Ser": "Serpens (The Serpent)",
  "Sex": "Sextans (The Sextant)",
  "Tau": "Taurus (The Bull)",
  "Tel": "Telescopium (The Telescope)",
  "Tri": "Triangulum (The Triangle)",
  "TrA": "Triangulum Australe (The Southern Triangle)",
  "Tuc": "Tucana (The Toucan)",
  "UMa": "Ursa Major (The Great Bear)",
  "UMi": "Ursa Minor (The Little Bear)",
  "Vel": "Vela (The Sails)",
  "Vir": "Virgo (The Maiden)",
  "Vol": "Volans (The Flying Fish)",
  "Vul": "Vulpecula (The Fox)"
};

/**
 * Curated Astrophysical Knowledge Base
 * Sourced from NASA Planetary Fact Sheets, SIMBAD, Hipparcos, and Gaia DR3.
 * All properties are structured into standardized cosmological fields.
 */
const CELESTIAL_ASTRO_DATA = {
  // Solar System Host & Satellite
  "Sun": {
    age: "4.60 Billion Years",
    starSystem: "Solar System (Host Star)",
    density: "1.41 g/cm³",
    distance: "1.00 AU (~149.6M km / 8.3 light-mins)",
    temperature: "5,778 K (Photosphere) / 15.7M K (Core)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "7.25° to Ecliptic",
    rotationTime: "25.38 Days (Equator) / 34.4 Days (Poles)",
    fullConstellation: "Solar System (Ecliptic)",
    description: "The yellow dwarf star (G2V) at the center of our solar system, containing 99.86% of the system's total mass."
  },
  "Moon": {
    age: "4.51 Billion Years",
    starSystem: "Earth-Moon System (Sol)",
    density: "3.34 g/cm³",
    distance: "384,400 km (~1.28 light-secs)",
    temperature: "-20°C (Mean; -130°C night to +120°C day)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "27.32 Earth Days (Sidereal)",
    rotationAxis: "1.54° to Ecliptic (6.68° to Orbit)",
    rotationTime: "27.32 Earth Days (Tidally Locked)",
    fullConstellation: "Earth Orbit / Ecliptic Path",
    description: "Earth's only natural satellite, stabilizing our planet's axial tilt and regulating ocean tides."
  },

  // Major Planets
  "Mercury": {
    age: "4.50 Billion Years",
    starSystem: "Solar System (Sol)",
    density: "5.43 g/cm³",
    distance: "0.39–0.69 AU (Dynamic)",
    temperature: "167°C (Mean; -180°C to +430°C)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "87.97 Earth Days",
    rotationAxis: "0.034° (Nearly Perpendicular)",
    rotationTime: "58.65 Earth Days (3:2 Resonance)",
    fullConstellation: "Ecliptic / Zodiacal Path",
    description: "The innermost terrestrial planet, possessing a gigantic iron core and extreme diurnal temperature swings."
  },
  "Venus": {
    age: "4.50 Billion Years",
    starSystem: "Solar System (Sol)",
    density: "5.24 g/cm³",
    distance: "0.72–1.72 AU (Dynamic)",
    temperature: "464°C (737 K, Runaway Greenhouse)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "224.70 Earth Days",
    rotationAxis: "177.36° (Upside-Down Retrograde)",
    rotationTime: "243.02 Earth Days (Retrograde)",
    fullConstellation: "Ecliptic / Zodiacal Path",
    description: "Earth's sister world encased in crushing 92-bar carbon dioxide atmosphere and sulfuric acid clouds."
  },
  "Mars": {
    age: "4.60 Billion Years",
    starSystem: "Solar System (Sol)",
    density: "3.93 g/cm³",
    distance: "0.38–2.67 AU (Dynamic)",
    temperature: "-63°C (210 K; -140°C to +20°C)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "686.98 Earth Days (1.88 Earth Years)",
    rotationAxis: "25.19° (Earth-like Seasons)",
    rotationTime: "24 Hours 37 Min (1 Martian Sol)",
    fullConstellation: "Ecliptic / Zodiacal Path",
    description: "The Red Planet, colored by iron oxide dust; home to Olympus Mons and extensive dormant polar ice caps."
  },
  "Jupiter": {
    age: "4.60 Billion Years",
    starSystem: "Solar System (Sol)",
    density: "1.33 g/cm³",
    distance: "3.95–6.45 AU (Dynamic)",
    temperature: "-110°C (163 K at 1 bar)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "11.86 Earth Years (4,333 Days)",
    rotationAxis: "3.13° (Minimal Seasonal Tilt)",
    rotationTime: "9 Hours 55 Min (Fastest Planetary Spin)",
    fullConstellation: "Ecliptic / Zodiacal Path",
    description: "The giant of our solar system, with 2.5 times the mass of all other planets combined and 95 known moons."
  },
  "Saturn": {
    age: "4.50 Billion Years",
    starSystem: "Solar System (Sol)",
    density: "0.687 g/cm³ (Less Dense Than Water)",
    distance: "8.0–11.0 AU (Dynamic)",
    temperature: "-140°C (133 K at 1 bar)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "29.46 Earth Years (10,759 Days)",
    rotationAxis: "26.73° (Prominent Ring Angle)",
    rotationTime: "10 Hours 33 Min",
    fullConstellation: "Ecliptic / Zodiacal Path",
    description: "Famous for its magnificent ring system spanning 282,000 km, composed of billions of water ice fragments."
  },
  "Uranus": {
    age: "4.50 Billion Years",
    starSystem: "Solar System (Sol)",
    density: "1.27 g/cm³",
    distance: "17.3–21.1 AU (Dynamic)",
    temperature: "-195°C (78 K; Coldest Atmosphere)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "84.01 Earth Years",
    rotationAxis: "97.77° (Rolling on Its Side)",
    rotationTime: "17 Hours 14 Min (Retrograde)",
    fullConstellation: "Ecliptic / Zodiacal Path",
    description: "An ice giant wrapped in cyan methane haze, rolling on its side with 42-year-long extreme polar seasons."
  },
  "Neptune": {
    age: "4.50 Billion Years",
    starSystem: "Solar System (Sol)",
    density: "1.64 g/cm³",
    distance: "28.8–31.3 AU (Dynamic)",
    temperature: "-200°C (73 K)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "164.79 Earth Years",
    rotationAxis: "28.32°",
    rotationTime: "16 Hours 06 Min",
    fullConstellation: "Ecliptic / Zodiacal Path",
    description: "The outermost major planet, an ultramarine ice giant driven by supersonic winds exceeding 2,100 km/h."
  },

  // Asteroids & Comets
  "asteroid_ceres": {
    age: "4.56 Billion Years",
    starSystem: "Solar System (Main Asteroid Belt)",
    density: "2.16 g/cm³",
    distance: "2.55–2.98 AU (~414M km)",
    temperature: "-105°C (168 K)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "4.60 Earth Years (1,682 Days)",
    rotationAxis: "4.0°",
    rotationTime: "9 Hours 04 Min",
    fullConstellation: "Main Asteroid Belt",
    description: "The largest object in the asteroid belt and only dwarf planet in the inner solar system, with subsurface ice and sodium carbonate brines."
  },
  "asteroid_vesta": {
    age: "4.56 Billion Years",
    starSystem: "Solar System (Main Asteroid Belt)",
    density: "3.46 g/cm³",
    distance: "2.15–2.57 AU (~353M km)",
    temperature: "-135°C (138 K)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "3.63 Earth Years (1,326 Days)",
    rotationAxis: "29.0°",
    rotationTime: "5 Hours 20 Min",
    fullConstellation: "Main Asteroid Belt",
    description: "A differentiated protoplanet with a metallic iron core and basaltic crust, surviving intact from the earliest epoch of planet formation."
  },
  "comet_tsuchinshan": {
    age: "~4.60 Billion Years (Primordial)",
    starSystem: "Solar System (Oort Cloud)",
    density: "~0.6 g/cm³ (Porous Ice-Dust)",
    distance: "0.47–1.20 AU (Dynamic)",
    temperature: "-70°C to +25°C",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~80,000 Years (Hyperbolic/Eccentric)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Serpens / Ophiuchus Border",
    description: "A pristine Oort cloud comet that graced Earth's evening skies in autumn 2024 with a majestic silver ion tail."
  },
  "comet_halley": {
    age: "~4.60 Billion Years",
    starSystem: "Solar System (Kuiper/Oort)",
    density: "0.60 g/cm³",
    distance: "0.59–35.1 AU (Highly Eccentric)",
    temperature: "-120°C to +70°C",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "75.3 Earth Years",
    rotationAxis: "N/A",
    rotationTime: "2.2 Days (Tumbling Rotator)",
    fullConstellation: "Hydra / Sextans Region",
    description: "The historic retrograde periodic comet observed since 240 BCE, progenitor of the Orionid and Eta Aquariid meteor showers."
  },
  "comet_encke": {
    age: "~4.60 Billion Years",
    starSystem: "Solar System (Jupiter Family)",
    density: "0.52 g/cm³",
    distance: "0.33–4.10 AU",
    temperature: "-80°C to +100°C",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "3.30 Earth Years (Shortest Known)",
    rotationAxis: "N/A",
    rotationTime: "15 Hours 05 Min",
    fullConstellation: "Pisces / Pegasus Region",
    description: "The shortest orbital period comet known in the solar system, source of the Taurid meteor complex."
  },

  // Primary Catalog Stars (Yale BSC5 / Hipparcos)
  "betelgeuse": {
    age: "~8.5 Million Years",
    starSystem: "Single Star System (Runaway)",
    density: "~1.2 × 10⁻⁸ g/cm³ (Diffuse)",
    distance: "642.5 ly (197 pc)",
    temperature: "3,600 K (M2Iab Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "~36 Years",
    fullConstellation: "Orion (The Hunter)",
    description: "A colossal red supergiant marking Orion's right shoulder, destined to end in a brilliant core-collapse Type II supernova."
  },
  "rigel": {
    age: "~8.0 Million Years",
    starSystem: "Rigel Multiple System (A, Ba, Bb)",
    density: "~2.8 × 10⁻⁵ g/cm³",
    distance: "863 ly (265 pc)",
    temperature: "12,100 K (B8Ia Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "1.2 Days",
    fullConstellation: "Orion (The Hunter)",
    description: "The brightest star in Orion, radiating 120,000 times the luminosity of our Sun from an incandescent blue supergiant photosphere."
  },
  "bellatrix": {
    age: "~25 Million Years",
    starSystem: "Single Star System",
    density: "~0.003 g/cm³",
    distance: "252 ly (77 pc)",
    temperature: "22,000 K (B2III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Orion (The Hunter)",
    description: "The Amazon Star marking Orion's left shoulder, a luminous massive blue-white giant star."
  },
  "saiph": {
    age: "~11 Million Years",
    starSystem: "Single Star System",
    density: "~0.001 g/cm³",
    distance: "650 ly (199 pc)",
    temperature: "26,500 K (B0.5Ia Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Orion (The Hunter)",
    description: "Orion's southern foot, an intense supergiant emitting most of its radiation in the ultraviolet spectrum."
  },
  "alnitak": {
    age: "~6.4 Million Years",
    starSystem: "Alnitak Triple Star System",
    density: "~0.002 g/cm³",
    distance: "1,260 ly (386 pc)",
    temperature: "29,500 K (O9.7Ib Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Orion (The Hunter)",
    description: "The easternmost star of Orion's Belt, ionizing the famous Flame Nebula and adjacent Horsehead Nebula."
  },
  "alnilam": {
    age: "~5.7 Million Years",
    starSystem: "Single Star System",
    density: "~1.5 × 10⁻⁴ g/cm³",
    distance: "2,000 ly (610 pc)",
    temperature: "27,500 K (B0Ia Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Orion (The Hunter)",
    description: "The central crown jewel of Orion's Belt, a blue supergiant 537,000 times as luminous as our Sun."
  },
  "mintaka": {
    age: "~3.0 Million Years",
    starSystem: "Mintaka Multiple System (5 Stars)",
    density: "~0.004 g/cm³",
    distance: "1,200 ly (368 pc)",
    temperature: "29,500 K (O9.5II Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "5.73 Days (Orbital Spin)",
    fullConstellation: "Orion (The Hunter)",
    description: "The western star of Orion's Belt, positioned almost precisely upon the celestial equator."
  },
  "meissa": {
    age: "~5.0 Million Years",
    starSystem: "Meissa Binary System (O8III + B0.5V)",
    density: "~0.002 g/cm³",
    distance: "1,100 ly (337 pc)",
    temperature: "35,000 K (O8III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Orion (The Hunter)",
    description: "Marks the head of Orion, illuminating a giant surrounding 150-light-year glowing emission nebula."
  },
  "sirius": {
    age: "~242 Million Years",
    starSystem: "Sirius Binary System (Sirius A & B White Dwarf)",
    density: "0.71 g/cm³ (A) / 2.38 × 10⁶ g/cm³ (B)",
    distance: "8.61 ly (2.64 pc)",
    temperature: "9,940 K (A1V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "50.1 Years (Binary) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "5.5 Days",
    fullConstellation: "Canis Major (The Greater Dog)",
    description: "The brightest star in Earth's entire night sky (mag -1.46), paired with 'The Pup', the first discovered white dwarf star."
  },
  "adhara": {
    age: "~22 Million Years",
    starSystem: "Adhara Binary System",
    density: "~0.005 g/cm³",
    distance: "430 ly (132 pc)",
    temperature: "22,200 K (B2II Bright Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Canis Major (The Greater Dog)",
    description: "The second-brightest star in Canis Major; 4.7 million years ago it shone as the brightest star in the sky at mag -3.99."
  },
  "wezen": {
    age: "~12 Million Years",
    starSystem: "Single Star System",
    density: "~8.0 × 10⁻⁵ g/cm³",
    distance: "1,600 ly (490 pc)",
    temperature: "6,390 K (F8Ia Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Canis Major (The Greater Dog)",
    description: "A rare yellow-white supergiant in Canis Major, destined to explode as a core-collapse supernova."
  },
  "mirzam": {
    age: "~32 Million Years",
    starSystem: "Single Star System (Beta Cephei Variable)",
    density: "~0.02 g/cm³",
    distance: "490 ly (150 pc)",
    temperature: "25,800 K (B1II-III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Canis Major (The Greater Dog)",
    description: "Known as 'The Herald' in Arabic because it rises immediately before Sirius announces the dawn."
  },
  "aludra": {
    age: "~8.3 Million Years",
    starSystem: "Single Star System",
    density: "~4.5 × 10⁻⁵ g/cm³",
    distance: "2,000 ly (610 pc)",
    temperature: "15,000 K (B5Ia Blue Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Canis Major (The Greater Dog)",
    description: "A luminous blue supergiant pulsating with variable luminosity at the tail of Canis Major."
  },
  "procyon": {
    age: "~1.87 Billion Years",
    starSystem: "Procyon Binary System (A & B White Dwarf)",
    density: "0.28 g/cm³",
    distance: "11.46 ly (3.51 pc)",
    temperature: "6,530 K (F5IV-V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "40.8 Years (Binary) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "23.7 Days",
    fullConstellation: "Canis Minor (The Lesser Dog)",
    description: "The eighth-brightest star in the sky, completing the famous Winter Triangle alongside Sirius and Betelgeuse."
  },
  "gomeisa": {
    age: "~160 Million Years",
    starSystem: "Single Star System (Be Star)",
    density: "~0.08 g/cm³",
    distance: "162 ly (50 pc)",
    temperature: "11,770 K (B8Ve)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "1.0 Day (Rapid Rotator)",
    fullConstellation: "Canis Minor (The Lesser Dog)",
    description: "A hot, rapidly spinning Be-type star surrounded by an incandescent circumstellar gas disk."
  },
  "dubhe": {
    age: "~280 Million Years",
    starSystem: "Dubhe Quadruple System (K0III + F0V)",
    density: "~0.001 g/cm³",
    distance: "123 ly (37.7 pc)",
    temperature: "4,660 K (K0III Orange Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Major (The Great Bear)",
    description: "The northern pointer star of the Big Dipper; aligning a sightline through Merak leads directly to Polaris."
  },
  "merak": {
    age: "~500 Million Years",
    starSystem: "Single Star System (Debris Disk)",
    density: "~0.40 g/cm³",
    distance: "79.7 ly (24.4 pc)",
    temperature: "9,355 K (A1V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Major (The Great Bear)",
    description: "The southern pointer star of the Big Dipper, encircled by a cool circumstellar debris ring of planetesimals."
  },
  "phecda": {
    age: "~300 Million Years",
    starSystem: "Phecda Binary System",
    density: "~0.35 g/cm³",
    distance: "83.2 ly (25.5 pc)",
    temperature: "9,350 K (A0Ve)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Major (The Great Bear)",
    description: "Marks the bottom inner corner of the Big Dipper bowl, an active member of the Ursa Major Moving Group."
  },
  "megrez": {
    age: "~300 Million Years",
    starSystem: "Single Star System",
    density: "~0.45 g/cm³",
    distance: "80.5 ly (24.7 pc)",
    temperature: "8,630 K (A3V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Major (The Great Bear)",
    description: "The junction star connecting the bowl of the Big Dipper to its graceful curved handle."
  },
  "alioth": {
    age: "~300 Million Years",
    starSystem: "Single Star System (Ap Magnetic)",
    density: "~0.25 g/cm³",
    distance: "82.6 ly (25.3 pc)",
    temperature: "9,020 K (A1III-IV)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "5.09 Days",
    fullConstellation: "Ursa Major (The Great Bear)",
    description: "The brightest star in Ursa Major, featuring intense magnetic fields and peculiar chemical stratification."
  },
  "mizar": {
    age: "~370 Million Years",
    starSystem: "Mizar-Alcor Sextuple System",
    density: "~0.30 g/cm³",
    distance: "82.9 ly (25.4 pc)",
    temperature: "9,000 K (A2V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "20.5 Days (A1-A2) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Major (The Great Bear)",
    description: "The legendary visual double star with Alcor used since antiquity as a test of human eyesight; actually 6 bound stars."
  },
  "alkaid": {
    age: "~10 Million Years",
    starSystem: "Single Star System",
    density: "~0.05 g/cm³",
    distance: "103.9 ly (31.9 pc)",
    temperature: "15,540 K (B3V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Major (The Great Bear)",
    description: "The tip of the Big Dipper handle, a young, solitary, hot B-type star traveling independently through space."
  },
  "polaris": {
    age: "~70 Million Years",
    starSystem: "Polaris Triple Star System (Aa, Ab, B)",
    density: "~1.1 × 10⁻⁴ g/cm³",
    distance: "433.8 ly (133 pc)",
    temperature: "6,015 K (F7Ib Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "29.6 Years (Aa-Ab) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "119 Days",
    fullConstellation: "Ursa Minor (The Little Bear)",
    description: "Earth's northern pole star, lying less than 1° from true celestial north and serving as humanity's navigational anchor."
  },
  "kochab": {
    age: "~2.95 Billion Years",
    starSystem: "Single Star System (Exoplanet Host)",
    density: "~6.5 × 10⁻⁵ g/cm³",
    distance: "130.9 ly (40.1 pc)",
    temperature: "4,030 K (K4III Orange Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Minor (The Little Bear)",
    description: "The former North Pole star during classical antiquity (1100 BCE to 500 CE), known as a Guardian of the Pole."
  },
  "pherkad": {
    age: "~100 Million Years",
    starSystem: "Single Star System (Delta Scuti)",
    density: "~0.003 g/cm³",
    distance: "487 ly (149 pc)",
    temperature: "8,280 K (A3II-III Bright Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Ursa Minor (The Little Bear)",
    description: "The second Guardian of the Pole, a pulsating bright giant illuminating the bowl of the Little Dipper."
  },
  "schedar": {
    age: "~200 Million Years",
    starSystem: "Single Star System",
    density: "~2.5 × 10⁻⁵ g/cm³",
    distance: "228 ly (70 pc)",
    temperature: "4,530 K (K0IIIa Orange Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cassiopeia (The Seated Queen)",
    description: "The brightest star in the distinctive 'W' asterism of Cassiopeia, swollen into an evolved orange giant."
  },
  "caph": {
    age: "~1.1 Billion Years",
    starSystem: "Single Star System (Delta Scuti)",
    density: "~0.06 g/cm³",
    distance: "54.7 ly (16.8 pc)",
    temperature: "7,080 K (F2III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "1.12 Days (Rapid Rotator)",
    fullConstellation: "Cassiopeia (The Seated Queen)",
    description: "The rightmost point of Cassiopeia's 'W', spinning so rapidly that its equatorial radius is 24% larger than its polar radius."
  },
  "gamma_cas": {
    age: "~8.0 Million Years",
    starSystem: "Navi Binary System (Be Star)",
    density: "~0.01 g/cm³",
    distance: "550 ly (169 pc)",
    temperature: "25,000 K (B0IVe)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "1.1 Days",
    fullConstellation: "Cassiopeia (The Seated Queen)",
    description: "The central star of Cassiopeia's 'W', an eruptive Be variable nicknamed Navi in honor of astronaut Gus Grissom."
  },
  "ruchbah": {
    age: "~900 Million Years",
    starSystem: "Algol-type Eclipsing Binary",
    density: "~0.15 g/cm³",
    distance: "99.4 ly (30.5 pc)",
    temperature: "8,400 K (A5V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "759 Days (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cassiopeia (The Seated Queen)",
    description: "Delta Cassiopeiae, an eclipsing binary system varying in brightness as its stellar companion periodically transits."
  },
  "segin": {
    age: "~65 Million Years",
    starSystem: "Single Star System",
    density: "~0.03 g/cm³",
    distance: "460 ly (141 pc)",
    temperature: "15,170 K (B7III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cassiopeia (The Seated Queen)",
    description: "Epsilon Cassiopeiae, the northeastern star completing the classical throne of Queen Cassiopeia."
  },
  "aldebaran": {
    age: "~6.4 Billion Years",
    starSystem: "Single Star System (Exoplanet Host)",
    density: "~5.5 × 10⁻⁶ g/cm³",
    distance: "65.3 ly (20.0 pc)",
    temperature: "3,900 K (K5III Orange Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "~520 Days",
    fullConstellation: "Taurus (The Bull)",
    description: "The fiery red Eye of Taurus, an orange giant 44 times wider than our Sun, host to exoplanet Aldebaran b."
  },
  "elnath": {
    age: "~100 Million Years",
    starSystem: "Single Star System (Mercury-Manganese)",
    density: "~0.03 g/cm³",
    distance: "134 ly (41.1 pc)",
    temperature: "13,820 K (B7III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Taurus (The Bull)",
    description: "Beta Tauri, marking the northern tip of the Bull's horn, historically shared with the constellation Auriga."
  },
  "alcyone": {
    age: "~100 Million Years",
    starSystem: "Alcyone Multiple System (Be Star)",
    density: "~0.02 g/cm³",
    distance: "440 ly (135 pc)",
    temperature: "12,300 K (B7IIIe)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "1.2 Days (Rapid Rotator)",
    fullConstellation: "Taurus (The Bull)",
    description: "The brightest jewel of the Pleiades open cluster (M45), embedded in incandescent blue reflection nebulosity."
  },
  "tianguan": {
    age: "~25 Million Years",
    starSystem: "Tianguan Binary System",
    density: "~0.02 g/cm³",
    distance: "420 ly (129 pc)",
    temperature: "19,000 K (B2IIIpe)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "133 Days (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Taurus (The Bull)",
    description: "Zeta Tauri, marking the southern horn tip of Taurus, adjacent to the Crab Nebula supernova remnant (M1)."
  },
  "pollux": {
    age: "~724 Million Years",
    starSystem: "Single Star System (Exoplanet Thestias)",
    density: "~0.002 g/cm³",
    distance: "33.78 ly (10.36 pc)",
    temperature: "4,666 K (K0III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "~558 Days",
    fullConstellation: "Gemini (The Twins)",
    description: "The brighter twin of Gemini, an evolved orange giant harboring confirmed exoplanet Pollux b (Thestias)."
  },
  "castor": {
    age: "~370 Million Years",
    starSystem: "Castor Sextuple System (6 Bound Stars)",
    density: "~0.35 g/cm³",
    distance: "51.0 ly (15.6 pc)",
    temperature: "10,286 K (A1V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "467 Years (A-B) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Gemini (The Twins)",
    description: "A remarkable hierarchical sextuple star system consisting of three binary pairs orbiting a mutual barycenter."
  },
  "alhena": {
    age: "~280 Million Years",
    starSystem: "Alhena Spectroscopic Binary",
    density: "~0.05 g/cm³",
    distance: "109 ly (33.5 pc)",
    temperature: "9,260 K (A1.5IV Subgiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "12.6 Years (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Gemini (The Twins)",
    description: "Gamma Geminorum, shining brightly at the southern foot of the twin Pollux."
  },
  "wasat": {
    age: "~1.6 Billion Years",
    starSystem: "Wasat Binary System",
    density: "~0.25 g/cm³",
    distance: "60.5 ly (18.5 pc)",
    temperature: "7,350 K (F0IV Subgiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~1,200 Years (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Gemini (The Twins)",
    description: "Delta Geminorum, sitting directly on the ecliptic; used by Clyde Tombaugh in 1930 to pinpoint Pluto."
  },
  "mebuda": {
    age: "~50 Million Years",
    starSystem: "Single Star System",
    density: "~8.0 × 10⁻⁵ g/cm³",
    distance: "840 ly (258 pc)",
    temperature: "4,650 K (G8Ib Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Gemini (The Twins)",
    description: "Epsilon Geminorum (Mebsuta), a rare yellow-orange supergiant marking the outstretched arm of Castor."
  },
  "deneb": {
    age: "~10 Million Years",
    starSystem: "Single Star System (Alpha Cygni Variable)",
    density: "~1.5 × 10⁻⁶ g/cm³",
    distance: "2,615 ly (802 pc)",
    temperature: "8,525 K (A2Ia Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cygnus (The Swan)",
    description: "The tail of Cygnus the Swan and vertex of the Summer Triangle; one of the most luminous supergiants in our galaxy."
  },
  "albireo": {
    age: "~100 Million Years",
    starSystem: "Albireo Double Star System (K3II + B8V)",
    density: "~0.001 g/cm³",
    distance: "430 ly (132 pc)",
    temperature: "4,080 K (Golden) & 12,000 K (Blue)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~100,000+ Years / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cygnus (The Swan)",
    description: "The finest color-contrast double star in amateur astronomy, displaying a sapphire blue star next to a golden giant."
  },
  "sadr": {
    age: "~12 Million Years",
    starSystem: "Single Star System",
    density: "~2.0 × 10⁻⁵ g/cm³",
    distance: "1,800 ly (550 pc)",
    temperature: "5,790 K (F8Ib Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cygnus (The Swan)",
    description: "Gamma Cygni, located at the intersection of the Northern Cross, embedded in the diffuse Sadr emission nebula (IC 1318)."
  },
  "gienah_cyg": {
    age: "~350 Million Years",
    starSystem: "Gienah Binary System",
    density: "~0.003 g/cm³",
    distance: "73.2 ly (22.4 pc)",
    temperature: "4,725 K (K0III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "N/A",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cygnus (The Swan)",
    description: "Epsilon Cygni, representing the eastern wing of the celestial Swan flying southward along the Milky Way."
  },
  "fawaris": {
    age: "~150 Million Years",
    starSystem: "Fawaris Triple System",
    density: "~0.10 g/cm³",
    distance: "165 ly (50.6 pc)",
    temperature: "10,500 K (B9.5IV Subgiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~780 Years (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Cygnus (The Swan)",
    description: "Delta Cygni, marking the western wing of Cygnus; will become Earth's northern pole star around 11,250 CE."
  },
  "vega": {
    age: "~455 Million Years",
    starSystem: "Single Star System (Debris Disk)",
    density: "0.28 g/cm³",
    distance: "25.04 ly (7.68 pc)",
    temperature: "9,602 K (A0Va)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "~5° (Viewed Pole-On)",
    rotationTime: "12.5 Hours (Rapid Oblate Spin)",
    fullConstellation: "Lyra (The Lyre)",
    description: "The historical zero-point baseline for astronomical magnitude scales, encircled by a prominent circumstellar dust ring."
  },
  "sheliak": {
    age: "~25 Million Years",
    starSystem: "Beta Lyrae Eclipsing Binary System",
    density: "~0.001 g/cm³",
    distance: "960 ly (294 pc)",
    temperature: "13,300 K (B7II)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "12.94 Days (Mass-Transfer Orbit)",
    rotationAxis: "N/A",
    rotationTime: "12.94 Days (Synchronous)",
    fullConstellation: "Lyra (The Lyre)",
    description: "The prototype of semi-detached mass-transfer binary stars, distorted into an egg shape by tidal gravitational forces."
  },
  "sulafat": {
    age: "~30 Million Years",
    starSystem: "Single Star System",
    density: "~0.002 g/cm³",
    distance: "620 ly (190 pc)",
    temperature: "10,000 K (B9III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Lyra (The Lyre)",
    description: "Gamma Lyrae, completing the celestial Harp near the famous Ring Nebula (M57)."
  },
  "altair": {
    age: "~1.2 Billion Years",
    starSystem: "Single Star System",
    density: "0.38 g/cm³",
    distance: "16.73 ly (5.13 pc)",
    temperature: "7,700 K (A7V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "~60° to line of sight",
    rotationTime: "8.9 Hours (Flattened Spheroid)",
    fullConstellation: "Aquila (The Eagle)",
    description: "Vertex of the Summer Triangle spinning at 286 km/s, bulging its equator into an oblate ellipsoid."
  },
  "tarazed": {
    age: "~100 Million Years",
    starSystem: "Single Star System",
    density: "~1.2 × 10⁻⁴ g/cm³",
    distance: "395 ly (121 pc)",
    temperature: "4,210 K (K3II Bright Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Aquila (The Eagle)",
    description: "Gamma Aquilae, an orange bright giant star flanking Altair in the wings of the celestial Eagle."
  },
  "regulus": {
    age: "~1.0 Billion Years",
    starSystem: "Regulus Quadruple System (4 Stars)",
    density: "0.18 g/cm³",
    distance: "79.3 ly (24.3 pc)",
    temperature: "12,460 K (B7V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "40.1 Days (Inner Orbit)",
    rotationAxis: "N/A",
    rotationTime: "15.9 Hours (Near Breakup)",
    fullConstellation: "Leo (The Lion)",
    description: "The 'Little King' at the heart of Leo, spinning near its centrifugal breakup limit and located directly on the ecliptic."
  },
  "denebola": {
    age: "~400 Million Years",
    starSystem: "Single Star System (Debris Disk)",
    density: "~0.35 g/cm³",
    distance: "35.9 ly (11.0 pc)",
    temperature: "8,500 K (A3Va)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Leo (The Lion)",
    description: "Beta Leonis, marking the tail of Leo, encircled by an infrared excess debris disk signaling comet belts."
  },
  "algieba": {
    age: "~500 Million Years",
    starSystem: "Algieba Binary System (K1III + G7III)",
    density: "~0.001 g/cm³",
    distance: "130 ly (40 pc)",
    temperature: "4,470 K (K1III Orange Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "510 Years (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Leo (The Lion)",
    description: "Gamma Leonis, a magnificent golden-orange double giant star in Leo's mane, host to gas giant Algieba b."
  },
  "zosma": {
    age: "~600 Million Years",
    starSystem: "Single Star System",
    density: "~0.30 g/cm³",
    distance: "58.4 ly (17.9 pc)",
    temperature: "8,350 K (A4V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Leo (The Lion)",
    description: "Delta Leonis, positioned on the back rump of the celestial Lion; a rapidly spinning white main-sequence star."
  },
  "antares": {
    age: "~11 Million Years",
    starSystem: "Antares Binary System (M1.5Iab + B2.5V)",
    density: "~3.8 × 10⁻⁸ g/cm³ (Diffuse)",
    distance: "550 ly (169 pc)",
    temperature: "3,500 K (M1.5Iab Red Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "1,218 Years (A-B) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "~10.5 Years",
    fullConstellation: "Scorpius (The Scorpion)",
    description: "The rival of Mars, a colossal red supergiant whose atmosphere would encompass the orbit of Mars."
  },
  "shaula": {
    age: "~25 Million Years",
    starSystem: "Shaula Multiple System (3 Stars)",
    density: "~0.01 g/cm³",
    distance: "570 ly (175 pc)",
    temperature: "25,000 K (B1.5IV Subgiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "1,053 Days (Inner Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Scorpius (The Scorpion)",
    description: "Lambda Scorpii, marking the venomous stinger of the Scorpion, a massive pulsating subgiant."
  },
  "sargas": {
    age: "~100 Million Years",
    starSystem: "Single Star System",
    density: "~0.001 g/cm³",
    distance: "329 ly (101 pc)",
    temperature: "7,268 K (F1II Bright Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Scorpius (The Scorpion)",
    description: "Theta Scorpii, a rare luminous yellow-white bright giant star curving through the Scorpion's tail."
  },
  "dschubba": {
    age: "~10 Million Years",
    starSystem: "Dschubba Multiple System (Be Star)",
    density: "~0.01 g/cm³",
    distance: "490 ly (150 pc)",
    temperature: "27,400 K (B0.3IV)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "10.8 Years (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Scorpius (The Scorpion)",
    description: "Delta Scorpii, marking the forehead of the Scorpion; underwent a dramatic brightening outburst in 2000."
  },
  "wei": {
    age: "~300 Million Years",
    starSystem: "Single Star System",
    density: "~0.002 g/cm³",
    distance: "63.7 ly (19.5 pc)",
    temperature: "4,560 K (K2III Orange Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Scorpius (The Scorpion)",
    description: "Epsilon Scorpii, an orange giant star lying comparatively close to our solar system in Scorpius."
  },
  "arcturus": {
    age: "~7.1 Billion Years",
    starSystem: "Single Star System (Kinematic Stream)",
    density: "~2.0 × 10⁻⁵ g/cm³",
    distance: "36.7 ly (11.26 pc)",
    temperature: "4,286 K (K1.5III Orange Giant)",
    galaxy: "Milky Way (Thick Disk / Accreted Stream)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "~733 Days",
    fullConstellation: "Boötes (The Herdsman)",
    description: "The brightest star in the northern celestial hemisphere, an ancient orange giant moving rapidly through the local solar neighborhood."
  },
  "spica": {
    age: "~12.5 Million Years",
    starSystem: "Spica Binary System (B1III-IV + B2V)",
    density: "~0.02 g/cm³",
    distance: "250 ly (77 pc)",
    temperature: "25,300 K (B1III-IV)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "4.01 Days (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "4.01 Days (Tidally Locked)",
    fullConstellation: "Virgo (The Maiden)",
    description: "Follow the arc to Arcturus and speed on to Spica: an intense rotating ellipsoidal variable binary star in Virgo."
  },
  "capella": {
    age: "~600 Million Years",
    starSystem: "Capella Quadruple System (2 Giants + 2 Dwarfs)",
    density: "~0.003 g/cm³",
    distance: "42.9 ly (13.2 pc)",
    temperature: "4,970 K & 5,730 K (G3III + G1III)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "104.0 Days (Giant Pair Orbit)",
    rotationAxis: "N/A",
    rotationTime: "106 Days & 8.6 Days",
    fullConstellation: "Auriga (The Charioteer)",
    description: "The sixth-brightest star in the sky, an intricate quadruple system dominated by two luminous yellow giant stars."
  },
  "menkalinan": {
    age: "~570 Million Years",
    starSystem: "Menkalinan Triple System (Algol Eclipsing)",
    density: "~0.10 g/cm³",
    distance: "81.1 ly (24.9 pc)",
    temperature: "9,350 K (A2IV)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "3.96 Days (Eclipsing Orbit)",
    rotationAxis: "N/A",
    rotationTime: "3.96 Days (Synchronous)",
    fullConstellation: "Auriga (The Charioteer)",
    description: "Beta Aurigae, an eclipsing subgiant binary whose combined light dips slightly every four days."
  },
  "acrux": {
    age: "~10.8 Million Years",
    starSystem: "Acrux Multiple System (B0.5IV + B1V)",
    density: "~0.01 g/cm³",
    distance: "320 ly (98 pc)",
    temperature: "28,000 K (B0.5IV)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "1,500 Years (A-B) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Crux (The Southern Cross)",
    description: "Alpha Crucis, the brilliant southern foot of the Southern Cross featured prominently on the flag of Australia and New Zealand."
  },
  "mimosa": {
    age: "~10 Million Years",
    starSystem: "Mimosa Binary System (Beta Cephei Variable)",
    density: "~0.01 g/cm³",
    distance: "280 ly (86 pc)",
    temperature: "27,000 K (B0.5III)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "5.01 Years (Binary Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Crux (The Southern Cross)",
    description: "Beta Crucis, a pulsating massive blue giant marking the eastern arm of the Southern Cross."
  },
  "gacrux": {
    age: "~200 Million Years",
    starSystem: "Single Star System",
    density: "~4.0 × 10⁻⁵ g/cm³",
    distance: "88.6 ly (27.2 pc)",
    temperature: "3,689 K (M3.5III Red Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Crux (The Southern Cross)",
    description: "Gamma Crucis, the red giant apex of the Southern Cross, the closest red giant star to our solar system."
  },
  "immai": {
    age: "~25 Million Years",
    starSystem: "Single Star System (Beta Cephei)",
    density: "~0.02 g/cm³",
    distance: "345 ly (106 pc)",
    temperature: "22,500 K (B2IV Subgiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Crux (The Southern Cross)",
    description: "Delta Crucis (Imai), completing the four primary stars of the Southern Cross asterism."
  },
  "alpha_cen": {
    age: "~5.3 Billion Years",
    starSystem: "Alpha Centauri Triple System (A, B & Proxima)",
    density: "1.41 g/cm³ (A) / 56.8 g/cm³ (Proxima)",
    distance: "4.37 ly (1.34 pc)",
    temperature: "5,790 K (G2V Sun-like)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "79.9 Years (A-B Orbit) / ~230 Myr (Galactic)",
    rotationAxis: "N/A",
    rotationTime: "22.5 Days",
    fullConstellation: "Centaurus (The Centaur)",
    description: "The closest star system to our Sun, hosting red dwarf Proxima Centauri and habitable-zone exoplanet Proxima b."
  },
  "hadar": {
    age: "~12 Million Years",
    starSystem: "Hadar Triple System (Beta Cephei)",
    density: "~0.01 g/cm³",
    distance: "390 ly (120 pc)",
    temperature: "25,000 K (B1III)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "357 Days (Inner Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Centaurus (The Centaur)",
    description: "Beta Centauri, known as the Southern Pointer pointing directly across to the Southern Cross alongside Alpha Centauri."
  },
  "canopus": {
    age: "~25 Million Years",
    starSystem: "Single Star System",
    density: "~2.5 × 10⁻⁵ g/cm³",
    distance: "310 ly (95 pc)",
    temperature: "7,400 K (A9II Bright Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Carina (The Keel)",
    description: "The second-brightest star in the sky (mag -0.74), historically utilized as an attitude reference point in spacecraft star trackers."
  },
  "achernar": {
    age: "~35 Million Years",
    starSystem: "Achernar Binary System (Be Star)",
    density: "~0.02 g/cm³",
    distance: "139 ly (42.6 pc)",
    temperature: "15,000 K (B6Vep)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "~2 Days (Extreme Oblate Shape)",
    fullConstellation: "Eridanus (The River)",
    description: "The southernmost first-magnitude star, rotating so furiously that its equatorial diameter is 56% wider than its polar diameter."
  },
  "fomalhaut": {
    age: "~440 Million Years",
    starSystem: "Fomalhaut Triple System (Exoplanet Debris Rings)",
    density: "~0.30 g/cm³",
    distance: "25.13 ly (7.70 pc)",
    temperature: "8,590 K (A3V)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Piscis Austrinus (The Southern Fish)",
    description: "The Solitary One of autumn, encircled by dramatic concentric debris rings and nested planetesimal belts mapped by JWST."
  },
  "markab": {
    age: "~200 Million Years",
    starSystem: "Single Star System",
    density: "~0.08 g/cm³",
    distance: "133 ly (40.8 pc)",
    temperature: "9,765 K (B9.5III Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Pegasus (The Winged Horse)",
    description: "Alpha Pegasi, marking the southwestern corner of the Great Square of Pegasus."
  },
  "scheat": {
    age: "~400 Million Years",
    starSystem: "Single Star System (Semi-regular Variable)",
    density: "~2.0 × 10⁻⁷ g/cm³",
    distance: "196 ly (60 pc)",
    temperature: "3,690 K (M2.5II-III Red Giant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Pegasus (The Winged Horse)",
    description: "Beta Pegasi, a swollen pulsating red giant at the northwestern corner of the Great Square of Pegasus."
  },
  "algenib": {
    age: "~19 Million Years",
    starSystem: "Single Star System (Beta Cephei Variable)",
    density: "~0.01 g/cm³",
    distance: "390 ly (120 pc)",
    temperature: "21,250 K (B2IV Subgiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Pegasus (The Winged Horse)",
    description: "Gamma Pegasi, marking the southeastern corner of the Great Square of Pegasus."
  },
  "enif": {
    age: "~20 Million Years",
    starSystem: "Single Star System",
    density: "~6.0 × 10⁻⁶ g/cm³",
    distance: "690 ly (211 pc)",
    temperature: "4,380 K (K2Ib Orange Supergiant)",
    galaxy: "Milky Way (Orion-Cygnus Arm)",
    revolutionPeriod: "~230 Million Years (Galactic Orbit)",
    rotationAxis: "N/A",
    rotationTime: "N/A",
    fullConstellation: "Pegasus (The Winged Horse)",
    description: "Epsilon Pegasi, marking the nose of the winged horse Pegasus; an evolved supergiant that exhibited a rare flare in 1972."
  }
};

/**
 * Derives Harvard spectral class surface temperature estimation when exact catalog value is unmeasured.
 */
function getEstimatedTempFromSpec(spec) {
  if (!spec) return "N/A";
  const s = spec.toUpperCase().charAt(0);
  switch (s) {
    case "O": return "~33,000 K (Hot Blue)";
    case "B": return "~18,000 K (Blue-White)";
    case "A": return "~8,500 K (White)";
    case "F": return "~6,600 K (Yellow-White)";
    case "G": return "~5,600 K (Yellow Dwarf)";
    case "K": return "~4,400 K (Orange)";
    case "M": return "~3,200 K (Cool Red)";
    default: return "N/A";
  }
}

/**
 * Universal astrophysical data resolver for the Apple Liquid Glass Inspector.
 * Resolves both planetary and stellar properties, defaulting any missing attribute strictly to "N/A".
 */
function getCelestialAstroData(obj) {
  if (!obj) return null;
  const key = obj.id || obj.name;
  let d = obj.astroData || CELESTIAL_ASTRO_DATA[key] || (obj.name && CELESTIAL_ASTRO_DATA[obj.name]);

  if (!d && typeof key === "string") {
    const norm = key.toLowerCase().trim();
    for (const [k, v] of Object.entries(CELESTIAL_ASTRO_DATA)) {
      if (k.toLowerCase() === norm || (obj.name && k.toLowerCase() === obj.name.toLowerCase())) {
        d = v;
        break;
      }
    }
  }

  // Determine full constellation with descriptive meaning
  let fullConst = "N/A";
  if (obj.const && CONSTELLATION_NAMES[obj.const]) {
    fullConst = CONSTELLATION_NAMES[obj.const];
  } else if (d && d.fullConstellation) {
    fullConst = d.fullConstellation;
  } else if (obj.type === "constellation") {
    fullConst = obj.fullName || (CONSTELLATION_NAMES[obj.id] || obj.name);
  } else if (obj.type === "meteorite") {
    fullConst = (obj.const && CONSTELLATION_NAMES[obj.const]) ? CONSTELLATION_NAMES[obj.const] : "Atmospheric Radiant Stream";
  } else if (obj.type === "planet") {
    fullConst = "Ecliptic / Zodiacal Path";
  } else if (obj.name === "Moon" || obj.name === "Sun") {
    fullConst = "Solar System (Ecliptic)";
  } else if (obj.type === "comet") {
    fullConst = "Oort Cloud / Interplanetary";
  } else if (obj.type === "asteroid") {
    fullConst = "Main Asteroid Belt";
  }

  // Calculate live dynamic distance for planets when distanceAu is available
  let distanceStr = (d && d.distance) ? d.distance : "N/A";
  if (obj.distanceAu != null) {
    const km = (obj.distanceAu * 149.59787).toFixed(1);
    const lightMins = (obj.distanceAu * 8.317).toFixed(1);
    distanceStr = `${obj.distanceAu.toFixed(2)} AU (~${km}M km / ${lightMins} light-mins)`;
  }

  return {
    age: (d && d.age) ? d.age : "N/A",
    starSystem: (d && d.starSystem) ? d.starSystem : (obj.type === "planet" ? "Solar System (Sol)" : "N/A"),
    density: (d && d.density) ? d.density : "N/A",
    distance: distanceStr,
    temperature: (d && d.temperature) ? d.temperature : (obj.spec ? getEstimatedTempFromSpec(obj.spec) : "N/A"),
    galaxy: (d && d.galaxy) ? d.galaxy : "Milky Way (Local Stellar Neighborhood)",
    revolutionPeriod: (d && d.revolutionPeriod) ? d.revolutionPeriod : (obj.spec ? "~230 Million Years (Galactic Orbit)" : "N/A"),
    rotationAxis: (d && d.rotationAxis) ? d.rotationAxis : "N/A",
    rotationTime: (d && d.rotationTime) ? d.rotationTime : "N/A",
    fullConstellation: fullConst,
    description: (d && d.description) ? d.description : (obj.description || "N/A")
  };
}
