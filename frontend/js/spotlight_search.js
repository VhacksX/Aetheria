/**
 * Aetheria macOS Spotlight Celestial Search
 * Features:
 * - Liquid glass morphism with 30% background bar opacity and bubble corners
 * - Silky smooth & slow macOS Spotlight spring/ease-out entrance & exit animations
 * - Universal search finding: Stars, Planets, Constellations, Asteroids, Meteorites, Comets
 * - Instant suggestions on typing any alphabet with live altitude & sky visibility tracking
 * - Smooth camera targeting (sky.centerOnObject) and Celestial Inspector integration
 * - Keyboard shortcuts: Cmd+K / Ctrl+K, Escape, Arrow Up/Down, Enter
 */

(function (window) {
  "use strict";

  // Standard IAU Constellation Centroids (Right Ascension in degrees 0-360, Declination in degrees -90 to +90)
  const IAU_CONSTELLATION_CENTROIDS = {
    "And": { ra: 15.0, dec: 37.0, stars: 100 },
    "Ant": { ra: 151.0, dec: -32.5, stars: 42 },
    "Aps": { ra: 242.0, dec: -75.0, stars: 39 },
    "Aqr": { ra: 334.0, dec: -9.0, stars: 90 },
    "Aql": { ra: 296.0, dec: 3.5, stars: 70 },
    "Ara": { ra: 261.0, dec: -53.5, stars: 60 },
    "Ari": { ra: 39.0, dec: 20.0, stars: 67 },
    "Aur": { ra: 90.0, dec: 42.0, stars: 90 },
    "Boo": { ra: 219.0, dec: 31.0, stars: 90 },
    "Cae": { ra: 71.0, dec: -38.0, stars: 20 },
    "Cam": { ra: 88.0, dec: 69.0, stars: 50 },
    "Cnc": { ra: 130.0, dec: 20.0, stars: 60 },
    "CVn": { ra: 195.0, dec: 38.0, stars: 57 },
    "CMa": { ra: 104.0, dec: -22.0, stars: 80 },
    "CMi": { ra: 118.0, dec: 5.0, stars: 20 },
    "Cap": { ra: 315.0, dec: -18.0, stars: 50 },
    "Car": { ra: 130.0, dec: -63.0, stars: 110 },
    "Cas": { ra: 15.0, dec: 60.0, stars: 90 },
    "Cen": { ra: 196.0, dec: -47.0, stars: 150 },
    "Cep": { ra: 340.0, dec: 70.0, stars: 60 },
    "Cet": { ra: 25.0, dec: -7.0, stars: 100 },
    "Cha": { ra: 166.0, dec: -79.0, stars: 22 },
    "Cir": { ra: 228.0, dec: -63.0, stars: 34 },
    "Col": { ra: 86.0, dec: -35.0, stars: 40 },
    "Com": { ra: 192.0, dec: 23.0, stars: 50 },
    "CrA": { ra: 286.0, dec: -40.0, stars: 40 },
    "CrB": { ra: 236.0, dec: 32.0, stars: 35 },
    "Crv": { ra: 186.0, dec: -18.0, stars: 15 },
    "Crt": { ra: 171.0, dec: -16.0, stars: 20 },
    "Cru": { ra: 186.0, dec: -60.0, stars: 30 },
    "Cyg": { ra: 308.0, dec: 44.0, stars: 150 },
    "Del": { ra: 309.0, dec: 11.5, stars: 30 },
    "Dor": { ra: 76.0, dec: -55.0, stars: 30 },
    "Dra": { ra: 257.0, dec: 67.0, stars: 80 },
    "Equ": { ra: 318.0, dec: 7.0, stars: 10 },
    "Eri": { ra: 54.0, dec: -29.0, stars: 100 },
    "For": { ra: 42.0, dec: -31.0, stars: 35 },
    "Gem": { ra: 107.0, dec: 22.0, stars: 70 },
    "Gru": { ra: 340.0, dec: -46.0, stars: 30 },
    "Her": { ra: 258.0, dec: 27.0, stars: 140 },
    "Hor": { ra: 50.0, dec: -53.0, stars: 20 },
    "Hya": { ra: 150.0, dec: -14.0, stars: 130 },
    "Hyi": { ra: 35.0, dec: -70.0, stars: 20 },
    "Ind": { ra: 317.0, dec: -56.0, stars: 20 },
    "Lac": { ra: 336.0, dec: 46.0, stars: 25 },
    "Leo": { ra: 160.0, dec: 15.0, stars: 70 },
    "LMi": { ra: 153.0, dec: 33.0, stars: 20 },
    "Lep": { ra: 83.0, dec: -19.0, stars: 40 },
    "Lib": { ra: 228.0, dec: -15.0, stars: 50 },
    "Lup": { ra: 230.0, dec: -42.0, stars: 70 },
    "Lyn": { ra: 120.0, dec: 47.0, stars: 60 },
    "Lyr": { ra: 283.0, dec: 36.0, stars: 45 },
    "Men": { ra: 85.0, dec: -77.0, stars: 15 },
    "Mic": { ra: 314.0, dec: -36.0, stars: 20 },
    "Mon": { ra: 106.0, dec: -5.0, stars: 85 },
    "Mus": { ra: 188.0, dec: -70.0, stars: 30 },
    "Nor": { ra: 239.0, dec: -52.0, stars: 20 },
    "Oct": { ra: 345.0, dec: -82.0, stars: 35 },
    "Oph": { ra: 258.0, dec: -4.0, stars: 100 },
    "Ori": { ra: 83.8, dec: 5.9, stars: 120 },
    "Pav": { ra: 294.0, dec: -65.0, stars: 45 },
    "Peg": { ra: 340.0, dec: 20.0, stars: 100 },
    "Per": { ra: 47.0, dec: 42.0, stars: 90 },
    "Phe": { ra: 6.0, dec: -42.0, stars: 40 },
    "Pic": { ra: 86.0, dec: -53.0, stars: 30 },
    "Psc": { ra: 14.0, dec: 14.0, stars: 75 },
    "PsA": { ra: 332.0, dec: -30.0, stars: 30 },
    "Pup": { ra: 113.0, dec: -31.0, stars: 140 },
    "Pyx": { ra: 133.0, dec: -27.0, stars: 25 },
    "Ret": { ra: 59.0, dec: -60.0, stars: 15 },
    "Sge": { ra: 298.0, dec: 19.0, stars: 18 },
    "Sgr": { ra: 286.0, dec: -25.0, stars: 115 },
    "Sco": { ra: 253.0, dec: -27.0, stars: 100 },
    "Scl": { ra: 8.0, dec: -32.0, stars: 30 },
    "Sct": { ra: 282.0, dec: -10.0, stars: 20 },
    "Ser": { ra: 235.0, dec: 6.0, stars: 60 },
    "Sex": { ra: 154.0, dec: -1.0, stars: 25 },
    "Tau": { ra: 65.0, dec: 18.0, stars: 98 },
    "Tel": { ra: 287.0, dec: -51.0, stars: 30 },
    "Tri": { ra: 33.0, dec: 32.0, stars: 15 },
    "TrA": { ra: 240.0, dec: -65.0, stars: 20 },
    "Tuc": { ra: 357.0, dec: -65.0, stars: 25 },
    "UMa": { ra: 160.0, dec: 55.0, stars: 125 },
    "UMi": { ra: 225.0, dec: 78.0, stars: 25 },
    "Vel": { ra: 134.0, dec: -47.0, stars: 110 },
    "Vir": { ra: 198.0, dec: -4.0, stars: 95 },
    "Vol": { ra: 114.0, dec: -70.0, stars: 20 },
    "Vul": { ra: 305.0, dec: 24.0, stars: 45 }
  };

  // Comprehensive Catalog of Meteor Showers & Celebrated Meteorites
  const METEORITE_CATALOG = [
    {
      id: "meteor_perseids",
      name: "Perseids Meteor Shower",
      category: "Meteorite",
      type: "meteorite",
      showerType: "Annual Meteor Shower (High Velocity)",
      ra: 46.2,
      dec: 57.6,
      mag: -2.0,
      peak: "August 12-13 (ZHR ~100)",
      parent: "Comet 109P/Swift-Tuttle",
      const: "Per",
      description: "One of the brightest and most prolific annual meteor showers, famous for rapid green-white meteors and incandescent persistent fireballs.",
      astroData: {
        age: "~2,000 Year Stream Old",
        starSystem: "Solar System (Perseid Complex)",
        density: "0.8 g/cm³ (Fluffy Porous Dust)",
        distance: "~100 km (Atmospheric Ablation Layer)",
        temperature: "1,650°C (Entry Ionization Streak)",
        galaxy: "Milky Way (Local Bubble)",
        revolutionPeriod: "133 Years (Parent Comet Orbit)",
        rotationAxis: "Retrograde Stream Vector",
        rotationTime: "59 km/s Velocity",
        fullConstellation: "Perseus (Radiant Point)",
        description: "Atmospheric incandescent ablation of ancient debris released by periodic comet 109P/Swift-Tuttle."
      }
    },
    {
      id: "meteor_geminids",
      name: "Geminids Meteor Shower",
      category: "Meteorite",
      type: "meteorite",
      showerType: "King of Meteor Showers (Dense Rocky)",
      ra: 112.5,
      dec: 32.5,
      mag: -3.0,
      peak: "December 13-14 (ZHR ~120-150)",
      parent: "Asteroid 3200 Phaethon",
      const: "Gem",
      description: "The most intense annual meteor shower, producing multi-colored slow glowing meteors from rocky asteroid fragments rather than icy comet dust.",
      astroData: {
        age: "~1,000 Years Stream",
        starSystem: "Solar System (Apollo Asteroid Stream)",
        density: "2.9 g/cm³ (Rocky Silicate Meteoroids)",
        distance: "~95 km (Atmospheric Layer)",
        temperature: "1,750°C (Impact Heating)",
        galaxy: "Milky Way",
        revolutionPeriod: "1.43 Years (Phaethon Orbit)",
        rotationAxis: "35 km/s Earth Entry Vector",
        rotationTime: "Dense Fireballs",
        fullConstellation: "Gemini (Near Castor)",
        description: "Dense rocky meteoroids ejected from Apollo asteroid 3200 Phaethon causing luminous winter fireballs."
      }
    },
    {
      id: "meteor_quadrantids",
      name: "Quadrantids Meteor Shower",
      category: "Meteorite",
      type: "meteorite",
      showerType: "Sharp Winter Shower",
      ra: 230.1,
      dec: 49.5,
      mag: 1.0,
      peak: "January 3-4 (ZHR ~110)",
      parent: "Asteroid 2003 EH1",
      const: "Boo",
      description: "Spectacular early January shower with a sharp 6-hour peak radiant between Boötes and Draco.",
      astroData: {
        age: "~500 Years",
        starSystem: "Solar System",
        density: "2.2 g/cm³",
        distance: "~105 km",
        temperature: "1,600°C",
        galaxy: "Milky Way",
        revolutionPeriod: "5.52 Years",
        rotationAxis: "41 km/s",
        rotationTime: "Sharp Radiant",
        fullConstellation: "Boötes / Quadrans Muralis",
        description: "Brief, intense burst of meteors originating from shattered comet nucleus 2003 EH1."
      }
    },
    {
      id: "meteor_lyrids",
      name: "Lyrids Meteor Shower",
      category: "Meteorite",
      type: "meteorite",
      showerType: "Historic Spring Shower",
      ra: 271.4,
      dec: 33.3,
      mag: 1.2,
      peak: "April 21-22 (ZHR ~18)",
      parent: "Comet C/1861 G1 (Thatcher)",
      const: "Lyr",
      description: "One of the oldest recorded meteor showers, observed by Chinese astronomers in 687 BCE. Originates near radiant star Vega.",
      astroData: {
        age: ">2,700 Years Observed",
        starSystem: "Solar System (Thatcher Complex)",
        density: "1.0 g/cm³",
        distance: "~100 km",
        temperature: "1,700°C",
        galaxy: "Milky Way",
        revolutionPeriod: "415.5 Years",
        rotationAxis: "49 km/s Velocity",
        rotationTime: "Vega Radiant",
        fullConstellation: "Lyra (Near Vega)",
        description: "Historical meteor stream recorded for millennia, producing dramatic dusty smoke trails."
      }
    },
    {
      id: "meteor_orionids",
      name: "Orionids Meteor Shower",
      category: "Meteorite",
      type: "meteorite",
      showerType: "Halley's Autumn Shower",
      ra: 94.5,
      dec: 15.8,
      mag: -1.0,
      peak: "October 21-22 (ZHR ~25)",
      parent: "1P/Halley",
      const: "Ori",
      description: "Extremely fast meteors with prolonged incandescent trails, caused by Earth passing through the inbound dust orbit of Halley's Comet.",
      astroData: {
        age: "~2,200 Years",
        starSystem: "Solar System (Halleyid Stream)",
        density: "0.6 g/cm³",
        distance: "~102 km",
        temperature: "1,800°C",
        galaxy: "Milky Way",
        revolutionPeriod: "75.3 Years",
        rotationAxis: "66 km/s Velocity",
        rotationTime: "Halley Inbound",
        fullConstellation: "Orion (Near Betelgeuse)",
        description: "Hyper-velocity particles shed from Halley's Comet entering Earth's upper atmosphere."
      }
    },
    {
      id: "meteor_leonids",
      name: "Leonids Meteor Shower",
      category: "Meteorite",
      type: "meteorite",
      showerType: "Periodic Meteor Storm",
      ra: 152.0,
      dec: 22.0,
      mag: -2.5,
      peak: "November 17-18 (ZHR ~15, Cyclical Storms)",
      parent: "Comet 55P/Tempel-Tuttle",
      const: "Leo",
      description: "Famous for cyclic historic meteor super-storms (thousands of fireballs per hour every 33 years), radiating from the Sickle of Leo.",
      astroData: {
        age: "~1,000 Years Stream",
        starSystem: "Solar System (Tempel-Tuttle)",
        density: "0.7 g/cm³",
        distance: "~100 km",
        temperature: "1,850°C",
        galaxy: "Milky Way",
        revolutionPeriod: "33.2 Years (Storm Cycle)",
        rotationAxis: "71 km/s (Fastest Major Stream)",
        rotationTime: "Sickle of Leo",
        fullConstellation: "Leo (The Lion)",
        description: "The fastest major meteor stream on Earth (71 km/s), generating vibrant ionic trails and sonic booms."
      }
    },
    {
      id: "meteor_chelyabinsk",
      name: "Chelyabinsk Meteorite",
      category: "Meteorite",
      type: "meteorite",
      showerType: "LL5 Chondrite Superbolide",
      ra: 320.0,
      dec: 55.0,
      mag: -27.3,
      peak: "February 15, 2013 Impact Event",
      parent: "Near-Earth Asteroid Fragment",
      const: "Cep",
      description: "The historic 20-meter asteroid superbolide that exploded over the Ural Mountains with ~500 kilotons of energy, scattering pristine LL5 chondrites.",
      astroData: {
        age: "4.45 Billion Years",
        starSystem: "Solar System (Asteroid Belt Origin)",
        density: "3.30 g/cm³ (Shock-veined Chondrite)",
        distance: "Dispersed Fragment Field (Lake Chebarkul)",
        temperature: "~2,500°C Peak Plasma",
        galaxy: "Milky Way",
        revolutionPeriod: "1.34 Years (Pre-impact)",
        rotationAxis: "19.16 km/s Entry",
        rotationTime: "Impacted Earth 2013",
        fullConstellation: "Urals Atmospheric Entry Point",
        description: "One of the most documented asteroid impact fireballs in modern scientific history."
      }
    },
    {
      id: "meteor_hoba",
      name: "Hoba Meteorite",
      category: "Meteorite",
      type: "meteorite",
      showerType: "Ataxite Iron Meteorite",
      ra: 265.0,
      dec: -19.0,
      mag: 5.0,
      peak: "Discovered 1920 (Grootfontein, Namibia)",
      parent: "Differentiated Protoplanetary Core",
      const: "Sgr",
      description: "The largest known intact single meteorite on Earth, weighing over 60 metric tonnes. Composed of 84% iron and 16% nickel (ataxite).",
      astroData: {
        age: "~4.56 Billion Years",
        starSystem: "Solar System (Core of Shattered Asteroid)",
        density: "7.96 g/cm³ (High-Nickel Iron)",
        distance: "Otjozondjupa, Namibia",
        temperature: "Ambient Earth Ground",
        galaxy: "Milky Way",
        revolutionPeriod: "Protoplanetary Collision",
        rotationAxis: "Prehistoric Impact (~80,000 yrs ago)",
        rotationTime: "Solid Native Metal",
        fullConstellation: "Ground Specimen (Namibia)",
        description: "Massive solid tabular block of primordial iron-nickel alloy preserved in situ without an impact crater."
      }
    },
    {
      id: "meteor_allende",
      name: "Allende Meteorite",
      category: "Meteorite",
      type: "meteorite",
      showerType: "CV3 Carbonaceous Chondrite",
      ra: 85.0,
      dec: 27.0,
      mag: 4.8,
      peak: "February 8, 1969 Shower (Pueblito de Allende)",
      parent: "Primitive Undifferentiated Asteroid",
      const: "Tau",
      description: "Considered the Rosetta Stone of meteoritics. Contains Calcium-Aluminum-rich Inclusions (CAIs) that are 4.567 billion years old—the oldest solid matter formed in our solar system.",
      astroData: {
        age: "4.567 Billion Years (Oldest Solar System Solid)",
        starSystem: "Solar System (Solar Nebula Condensate)",
        density: "2.95 g/cm³",
        distance: "Chihuahua, Mexico",
        temperature: "Sub-zero Space Matrix",
        galaxy: "Milky Way (Pre-Solar Stardust)",
        revolutionPeriod: "Outer Belt Parent",
        rotationAxis: "Primitive Solar Nebula",
        rotationTime: "Pristine CAIs",
        fullConstellation: "Taurus Nebula Association",
        description: "The most extensively studied meteorite in science, holding pre-solar presolar diamond and silicon carbide grains."
      }
    },
    {
      id: "meteor_murchison",
      name: "Murchison Meteorite",
      category: "Meteorite",
      type: "meteorite",
      showerType: "CM2 Carbonaceous Chondrite",
      ra: 120.0,
      dec: -36.0,
      mag: 5.2,
      peak: "September 28, 1969 Shower (Victoria, Australia)",
      parent: "Primitive Volatile-Rich Asteroid",
      const: "Pup",
      description: "Celebrated meteorite packed with extraterrestrial organic compounds, including over 70 distinct amino acids, purines, and pre-solar silicon carbide older than the Sun.",
      astroData: {
        age: "4.55 Billion Years (Presolar grains ~7B yrs)",
        starSystem: "Solar System (Hydrated Asteroid Matrix)",
        density: "2.40 g/cm³ (Hydrated Silicates)",
        distance: "Victoria, Australia",
        temperature: "Cold Primordial Storage",
        galaxy: "Milky Way",
        revolutionPeriod: "Outer Asteroid Belt",
        rotationAxis: "Aqueous Alteration Zone",
        rotationTime: "Rich Amino Acids",
        fullConstellation: "Puppis Association",
        description: "Definitive evidence of extraterrestrial organic prebiotic chemistry and prebiotic building blocks of life."
      }
    }
  ];

  // Extended Asteroids Catalog
  const EXTENDED_ASTEROIDS = [
    {
      id: "asteroid_pallas",
      name: "2 Pallas",
      category: "Asteroid",
      type: "asteroid",
      ra: 250.2,
      dec: 17.5,
      mag: 8.0,
      color: "#e2e8f0",
      spectral: "B-type Asteroid",
      description: "Third largest asteroid by volume, discovered in 1802 with a steeply inclined 34.8° orbit.",
      astroData: {
        age: "4.53 Billion Years",
        starSystem: "Asteroid Belt (Pallas Family)",
        density: "2.57 g/cm³",
        distance: "2.77 AU (~414M km)",
        temperature: "164 K (-109°C)",
        galaxy: "Milky Way",
        revolutionPeriod: "4.62 Earth Years",
        rotationAxis: "34.8° Orbital Tilt",
        rotationTime: "7.81 Hours",
        fullConstellation: "Main Asteroid Belt",
        description: "Massive protoplanet remnant that survived solar system planetesimal accretion."
      }
    },
    {
      id: "asteroid_hygiea",
      name: "10 Hygiea",
      category: "Asteroid",
      type: "asteroid",
      ra: 180.5,
      dec: -12.1,
      mag: 9.1,
      color: "#cbd5e1",
      spectral: "C-type Carbonaceous",
      description: "Fourth largest asteroid and potential smallest dwarf planet in the solar system, nearly spherical in hydrostatic equilibrium.",
      astroData: {
        age: "4.50 Billion Years",
        starSystem: "Outer Asteroid Belt (Hygiea Family)",
        density: "2.08 g/cm³",
        distance: "3.14 AU (~470M km)",
        temperature: "158 K (-115°C)",
        galaxy: "Milky Way",
        revolutionPeriod: "5.56 Earth Years",
        rotationAxis: "3.84° to Ecliptic",
        rotationTime: "27.63 Hours",
        fullConstellation: "Outer Asteroid Belt",
        description: "Carbonaceous primitive world formed after a catastrophic shattering impact ~2 billion years ago."
      }
    },
    {
      id: "asteroid_eros",
      name: "433 Eros",
      category: "Asteroid",
      type: "asteroid",
      ra: 310.2,
      dec: -8.4,
      mag: 8.5,
      color: "#f8fafc",
      spectral: "S-type (Silicate / Stony)",
      description: "First near-Earth asteroid ever discovered (1898) and first to be orbited and soft-landed upon by a spacecraft (NEAR Shoemaker).",
      astroData: {
        age: "4.51 Billion Years",
        starSystem: "Amor / Near-Earth Asteroid Group",
        density: "2.67 g/cm³ (Porous Silicate)",
        distance: "1.45 AU (~217M km)",
        temperature: "227 K (-46°C to +100°C day)",
        galaxy: "Milky Way",
        revolutionPeriod: "1.76 Earth Years",
        rotationAxis: "10.8° to Ecliptic",
        rotationTime: "5.27 Hours",
        fullConstellation: "Near-Earth Space",
        description: "Elongated peanut-shaped stony asteroid with extensive boulder fields and surface regolith ponds."
      }
    },
    {
      id: "asteroid_phaethon",
      name: "3200 Phaethon",
      category: "Asteroid",
      type: "asteroid",
      ra: 110.0,
      dec: 30.0,
      mag: 10.2,
      color: "#e2e8f0",
      spectral: "B-type (Rock Comet)",
      description: "Apollo asteroid that approaches closer to the Sun than any other named asteroid (0.14 AU), source of the intense Geminids meteor shower.",
      astroData: {
        age: "4.50 Billion Years",
        starSystem: "Apollo Asteroid Family",
        density: "2.90 g/cm³",
        distance: "1.27 AU (Perihelion 0.14 AU)",
        temperature: "~1,020 K (+750°C at Perihelion)",
        galaxy: "Milky Way",
        revolutionPeriod: "1.43 Earth Years (523 Days)",
        rotationAxis: "22.2° Inclination",
        rotationTime: "3.60 Hours",
        fullConstellation: "Gemini / Apollo Path",
        description: "Thermal-fracturing 'rock comet' that sheds rocky grit during scorching passes near the Sun."
      }
    }
  ];

  // Extended Comets Catalog
  const EXTENDED_COMETS = [
    {
      id: "comet_neowise",
      name: "Comet C/2020 F3 (NEOWISE)",
      category: "Comet",
      type: "comet",
      ra: 165.2,
      dec: 42.8,
      mag: 5.5,
      tailLengthDeg: 6.0,
      color: "#f1f5f9",
      spectral: "Sodium / C2 / Dust",
      description: "Spectacular naked-eye comet of July 2020 with brilliant bifurcated gold dust and blue ion tails.",
      astroData: {
        age: "~4.6 Billion Years (Oort Cloud)",
        starSystem: "Solar System (Oort Cloud)",
        density: "0.5 g/cm³ (Porous Ice & Dust)",
        distance: "1.85 AU (~276M km)",
        temperature: "120 K (-153°C)",
        galaxy: "Milky Way",
        revolutionPeriod: "~6,800 Earth Years",
        rotationAxis: "128.9° (Retrograde)",
        rotationTime: "7.58 Hours",
        fullConstellation: "Ursa Major / Oort Inbound",
        description: "Pristine long-period comet with twin radiant tails that thrilled skygazers across the Northern Hemisphere."
      }
    },
    {
      id: "comet_halebopp",
      name: "Comet Hale-Bopp (C/1995 O1)",
      category: "Comet",
      type: "comet",
      ra: 280.4,
      dec: -30.5,
      mag: 8.2,
      tailLengthDeg: 8.0,
      color: "#ffffff",
      spectral: "CO / Cyanogen / Silicate",
      description: "The Great Comet of 1997, visible to the naked eye for a record-breaking 18 straight months with an enormous 40km nucleus.",
      astroData: {
        age: "4.60 Billion Years",
        starSystem: "Solar System (Oort Cloud)",
        density: "0.6 g/cm³",
        distance: "35.8 AU (~5.35 Billion km)",
        temperature: "50 K (-223°C)",
        galaxy: "Milky Way",
        revolutionPeriod: "2,533 Earth Years",
        rotationAxis: "89.4° Inclination",
        rotationTime: "11.35 Hours",
        fullConstellation: "Outer Deep Space",
        description: "Colossal periodic comet with one of the largest active nuclei ever observed in the solar system."
      }
    },
    {
      id: "comet_pons_brooks",
      name: "12P/Pons-Brooks (Devil Comet)",
      category: "Comet",
      type: "comet",
      ra: 45.6,
      dec: 15.3,
      mag: 5.0,
      tailLengthDeg: 3.5,
      color: "#e2e8f0",
      spectral: "Cryovolcanic CO2 / Water Ice",
      description: "Halley-type periodic comet famous for explosive cryovolcanic eruptions creating luminous horned outbursts.",
      astroData: {
        age: "4.55 Billion Years",
        starSystem: "Solar System (Kuiper / Halley Type)",
        density: "0.45 g/cm³",
        distance: "2.10 AU (~314M km)",
        temperature: "140 K (-133°C)",
        galaxy: "Milky Way",
        revolutionPeriod: "71.3 Earth Years",
        rotationAxis: "74.2° Inclination",
        rotationTime: "57 Hours",
        fullConstellation: "Andromeda / Aries Track",
        description: "Famous for periodic cryomagma explosions spewing gas and crystalline ice into space."
      }
    }
  ];

  class SpotlightSearch {
    constructor(sky) {
      this.sky = sky;
      this.isOpen = false;
      this.catalog = [];
      this.filteredResults = [];
      this.selectedIndex = -1;

      // DOM Elements
      this.btn = document.getElementById("search-celestial-btn");
      this.backdrop = document.getElementById("apple-spotlight-backdrop");
      this.modal = document.getElementById("apple-spotlight-modal");
      this.input = document.getElementById("spotlight-search-input");
      this.clearBtn = document.getElementById("spotlight-clear-btn");
      this.micBtn = document.getElementById("spotlight-mic-btn");
      this.closeBtn = document.getElementById("spotlight-close-btn");
      this.cursor = document.getElementById("ios-search-cursor");
      this.wrapper = document.getElementById("spotlight-suggestions-wrapper");
      this.list = document.getElementById("spotlight-suggestions-list");

      this.init();
    }

    init() {
      this.buildCatalog();
      this.bindEvents();
    }

    buildCatalog() {
      const items = [];

      // 1. Stars (Bright Star Catalog + Sun + Moon)
      if (typeof STAR_CATALOG !== "undefined" && Array.isArray(STAR_CATALOG)) {
        STAR_CATALOG.forEach(s => {
          items.push({
            id: s.id,
            name: s.name,
            category: "Star",
            type: "star",
            spec: s.spec,
            mag: s.mag,
            ra: s.ra,
            dec: s.dec,
            const: s.const,
            description: s.description || `Bright spectral class ${s.spec || "star"} in constellation ${s.const || "the sky"}.`
          });
        });
      }

      // Host Sun
      items.push({
        id: "Sun",
        name: "Sun",
        category: "Star",
        type: "host_star",
        spec: "G2V",
        mag: -26.74,
        ra: 0.0,
        dec: 0.0,
        const: "Ecliptic",
        description: "The yellow dwarf star at the center of our Solar System, host to all planetary orbits."
      });

      // Natural Satellite: Moon
      items.push({
        id: "Moon",
        name: "Moon",
        category: "Star",
        type: "satellite",
        mag: -12.7,
        ra: 0.0,
        dec: 0.0,
        const: "Ecliptic",
        description: "Earth's luminous natural satellite displaying dramatic crater highlands and maria."
      });

      // 2. Planets (Solar System)
      const planetsList = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
      planetsList.forEach(p => {
        items.push({
          id: p.toLowerCase(),
          name: p,
          category: "Planet",
          type: "planet",
          mag: p === "Venus" ? -4.4 : (p === "Jupiter" ? -2.7 : (p === "Mars" ? -1.5 : (p === "Saturn" ? 0.4 : 5.8))),
          ra: 0.0,
          dec: 0.0,
          description: `Major planet in our Solar System orbiting the Sun along the ecliptic plane.`
        });
      });

      // 3. Constellations (All 88 IAU Constellations)
      if (typeof CONSTELLATION_NAMES !== "undefined") {
        Object.entries(CONSTELLATION_NAMES).forEach(([id, fullName]) => {
          let english = "Star Pattern";
          let name = id;
          const match = fullName.match(/^([^(]+)\s*\(([^)]+)\)$/);
          if (match) {
            name = match[1].trim();
            english = match[2].trim();
          } else {
            name = fullName;
          }

          const coords = IAU_CONSTELLATION_CENTROIDS[id] || { ra: 180.0, dec: 0.0 };
          items.push({
            id: id,
            name: name,
            english: english,
            fullName: fullName,
            category: "Constellation",
            type: "constellation",
            ra: coords.ra,
            dec: coords.dec,
            mag: 2.0,
            description: `Official IAU Constellation: ${fullName}. Centroid located at RA ${coords.ra.toFixed(1)}°, Dec ${coords.dec > 0 ? "+" : ""}${coords.dec.toFixed(1)}°.`,
            astroData: {
              age: "Ancient Greek / IAU (1922 Standard)",
              starSystem: "Multiple Bound & Line-of-Sight Star Systems",
              density: "Interstellar Medium (~1 atom/cm³)",
              distance: "Spans 10 to 1,500+ Light-Years",
              temperature: "2.7 K (Cosmic Microwave Background)",
              galaxy: "Milky Way (Local Galactic Neighborhood)",
              revolutionPeriod: "~230 Million Years (Galactic Rotation)",
              rotationAxis: "IAU Defined Celestial Boundary",
              rotationTime: "Sidereal Day (23h 56m)",
              fullConstellation: fullName,
              description: `One of the 88 officially recognized astronomical constellations designated by the International Astronomical Union.`
            }
          });
        });
      }

      // 4. Asteroids (Main Catalog + Extended)
      if (typeof COMET_AND_ASTEROID_CATALOG !== "undefined") {
        COMET_AND_ASTEROID_CATALOG.forEach(obj => {
          if (obj.type === "asteroid") {
            items.push({
              id: obj.id,
              name: obj.name,
              category: "Asteroid",
              type: "asteroid",
              ra: obj.ra,
              dec: obj.dec,
              mag: obj.mag,
              spectral: obj.spectral,
              description: obj.description
            });
          }
        });
      }
      EXTENDED_ASTEROIDS.forEach(a => items.push(a));

      // 5. Meteorites & Major Meteor Showers
      METEORITE_CATALOG.forEach(m => items.push(m));

      // 6. Comets (Main Catalog + Extended)
      if (typeof COMET_AND_ASTEROID_CATALOG !== "undefined") {
        COMET_AND_ASTEROID_CATALOG.forEach(obj => {
          if (obj.type === "comet") {
            items.push({
              id: obj.id,
              name: obj.name,
              category: "Comet",
              type: "comet",
              ra: obj.ra,
              dec: obj.dec,
              mag: obj.mag,
              spectral: obj.spectral,
              tailLengthDeg: obj.tailLengthDeg,
              description: obj.description
            });
          }
        });
      }
      EXTENDED_COMETS.forEach(c => items.push(c));

      this.catalog = items;
    }

    bindEvents() {
      // Button Toggle
      if (this.btn) {
        this.btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggle();
        });
      }

      // Backdrop dismissal
      if (this.backdrop) {
        this.backdrop.addEventListener("click", (e) => {
          if (e.target === this.backdrop) {
            this.close();
          }
        });
      }

      // Prevent modal click from closing
      if (this.modal) {
        this.modal.addEventListener("click", (e) => e.stopPropagation());
      }

      // Close button (Circular Cross Button from Image 2 & Image 3/1)
      if (this.closeBtn) {
        this.closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.close();
        });
      }

      // Voice Search Microphone from Image 2
      if (this.micBtn) {
        this.micBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRec) {
            try {
              const rec = new SpeechRec();
              rec.lang = "en-US";
              rec.start();
              this.micBtn.style.color = "#FF3B30";
              rec.onresult = (ev) => {
                const text = ev.results[0][0].transcript;
                if (this.input) {
                  this.input.value = text;
                  this.input.dispatchEvent(new Event("input"));
                }
              };
              rec.onend = () => { this.micBtn.style.color = "#ffffff"; };
              rec.onerror = () => { this.micBtn.style.color = "#ffffff"; };
            } catch (err) {
              if (this.input) this.input.focus();
            }
          } else {
            if (this.input) this.input.focus();
          }
        });
      }

      // Search input live typing
      if (this.input) {
        this.input.addEventListener("input", () => {
          const query = this.input.value.trim();
          if (this.cursor) {
            this.cursor.style.display = this.input.value.length > 0 ? "none" : "block";
          }
          if (query.length > 0) {
            if (this.clearBtn) this.clearBtn.classList.add("visible");
            this.search(query);
          } else {
            if (this.clearBtn) this.clearBtn.classList.remove("visible");
            this.collapseSuggestions();
          }
        });

        // Keyboard navigation inside input
        this.input.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            this.close();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            this.navigateSelection(1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            this.navigateSelection(-1);
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredResults.length) {
              this.selectItem(this.filteredResults[this.selectedIndex]);
            } else if (this.filteredResults.length > 0) {
              this.selectItem(this.filteredResults[0]);
            }
          }
        });
      }

      // Clear button
      if (this.clearBtn) {
        this.clearBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (this.input) {
            this.input.value = "";
            this.input.focus();
          }
          if (this.cursor) this.cursor.style.display = "block";
          this.clearBtn.classList.remove("visible");
          this.collapseSuggestions();
        });
      }

      // Global Keyboard Shortcuts (⌘K, Ctrl+K, Escape)
      document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          this.toggle();
        } else if (e.key === "Escape" && this.isOpen) {
          e.preventDefault();
          this.close();
        }
      });
    }

    open() {
      if (this.isOpen) return;
      this.isOpen = true;

      if (this.btn) this.btn.classList.add("active");
      if (this.backdrop) this.backdrop.classList.add("active");

      setTimeout(() => {
        if (this.input) {
          this.input.focus();
          if (this.cursor) {
            this.cursor.style.display = this.input.value.length > 0 ? "none" : "block";
          }
          if (this.input.value.trim().length > 0) {
            this.search(this.input.value.trim());
          }
        }
      }, 60);
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;

      if (this.btn) this.btn.classList.remove("active");
      if (this.backdrop) this.backdrop.classList.remove("active");
      if (this.input) this.input.blur();

      this.collapseSuggestions();
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    collapseSuggestions() {
      if (this.wrapper) {
        this.wrapper.classList.remove("has-results");
      }
      this.filteredResults = [];
      this.selectedIndex = -1;
    }

    getLiveCoordinates(item) {
      // 1. If planet, retrieve from sky.cachedPlanets
      if (item.category === "Planet" && this.sky && this.sky.cachedPlanets) {
        const found = this.sky.cachedPlanets.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        if (found) {
          return { azimuth: found.azimuth, altitude: found.altitude, ra: found.ra, dec: found.dec, obj: found };
        }
      }

      // 2. If Sun
      if (item.name === "Sun" && this.sky && this.sky.cachedSun) {
        return { azimuth: this.sky.cachedSun.azimuth, altitude: this.sky.cachedSun.altitude, ra: this.sky.cachedSun.ra, dec: this.sky.cachedSun.dec, obj: this.sky.cachedSun };
      }

      // 3. If Moon
      if (item.name === "Moon" && this.sky && this.sky.cachedMoon) {
        return { azimuth: this.sky.cachedMoon.azimuth, altitude: this.sky.cachedMoon.altitude, ra: this.sky.cachedMoon.ra, dec: this.sky.cachedMoon.dec, obj: this.sky.cachedMoon };
      }

      // 4. If Star, check cachedStars
      if (item.category === "Star" && this.sky && this.sky.cachedStars) {
        const found = this.sky.cachedStars.find(s => s.id === item.id || s.name.toLowerCase() === item.name.toLowerCase());
        if (found) {
          return { azimuth: found.azimuth, altitude: found.altitude, ra: found.ra, dec: found.dec, obj: found };
        }
      }

      // 5. If Comet or Asteroid, check cachedCometsAndAsteroids
      if ((item.category === "Comet" || item.category === "Asteroid") && this.sky && this.sky.cachedCometsAndAsteroids) {
        const found = this.sky.cachedCometsAndAsteroids.find(c => c.id === item.id);
        if (found) {
          return { azimuth: found.azimuth, altitude: found.altitude, ra: found.ra, dec: found.dec, obj: found };
        }
      }

      // 6. Compute mathematically from current sky observer and julian date
      if (typeof Astronomy !== "undefined" && item.ra != null && item.dec != null && this.sky) {
        const jd = Astronomy.toJulianDate(this.sky.currentDate || new Date());
        const pos = Astronomy.raDecToAltAz(
          item.ra, item.dec,
          this.sky.observerLat || 35.6762,
          this.sky.observerLon || 139.6503,
          jd
        );
        return { azimuth: pos.azimuth, altitude: pos.altitude, ra: item.ra, dec: item.dec, obj: item };
      }

      return { azimuth: 0, altitude: 0, ra: item.ra || 0, dec: item.dec || 0, obj: item };
    }

    search(query) {
      if (!query || query.length === 0) {
        this.collapseSuggestions();
        return;
      }

      const q = query.toLowerCase().trim();
      const scored = [];

      this.catalog.forEach(item => {
        const name = (item.name || "").toLowerCase();
        const eng = (item.english || "").toLowerCase();
        const cat = (item.category || "").toLowerCase();
        const fullConst = (item.fullName || "").toLowerCase();
        const spec = (item.spectral || item.spec || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const shower = (item.showerType || "").toLowerCase();

        let score = 999;

        // Rank 1: Object name starts with query
        if (name.startsWith(q)) {
          score = 10 + (name.length - q.length);
        }
        // Rank 2: Word inside name starts with query
        else if (name.split(/[\s-]+/).some(w => w.startsWith(q))) {
          score = 30 + (name.length - q.length);
        }
        // Rank 3: English meaning / translation starts with query (e.g. "Hunter" for Orion)
        else if (eng.startsWith(q) || eng.split(/\s+/).some(w => w.startsWith(q))) {
          score = 50 + (eng.length - q.length);
        }
        // Rank 4: Category starts with query (e.g. "comet", "star", "planet", "asteroid", "meteor")
        else if (cat.startsWith(q) || (q === "meteor" && cat === "meteorite")) {
          score = 70;
        }
        // Rank 5: Substring anywhere in name
        else if (name.includes(q)) {
          score = 90 + name.indexOf(q);
        }
        // Rank 6: Substring in English name or shower type
        else if (eng.includes(q) || shower.includes(q) || fullConst.includes(q)) {
          score = 110;
        }
        // Rank 7: Substring in description / spectral class
        else if (desc.includes(q) || spec.includes(q)) {
          score = 150;
        }

        if (score < 900) {
          // Compute real-time positioning for display
          const pos = this.getLiveCoordinates(item);
          scored.push({
            ...item,
            _score: score,
            azimuth: pos.azimuth,
            altitude: pos.altitude,
            liveRa: pos.ra,
            liveDec: pos.dec,
            realSkyObj: pos.obj
          });
        }
      });

      // Sort by score ascending, then by visual magnitude (brightest first)
      scored.sort((a, b) => {
        if (a._score !== b._score) return a._score - b._score;
        return (a.mag != null ? a.mag : 99) - (b.mag != null ? b.mag : 99);
      });

      this.filteredResults = scored.slice(0, 14);
      this.selectedIndex = this.filteredResults.length > 0 ? 0 : -1;
      this.renderSuggestions(this.filteredResults, q);
    }

    highlightMatch(text, query) {
      if (!text || !query) return text || "";
      const idx = text.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) return text;
      const before = text.substring(0, idx);
      const match = text.substring(idx, idx + query.length);
      const after = text.substring(idx + query.length);
      return `${before}<span class="spotlight-match">${match}</span>${after}`;
    }

    renderSuggestions(results, query) {
      if (!this.wrapper || !this.list) return;

      if (results.length === 0) {
        this.list.innerHTML = `
          <div class="spotlight-empty-state">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>No celestial targets match "${query}"</span>
            <span style="font-size: 11.5px; opacity: 0.65;">Try searching for stars, planets, constellations, asteroids, meteorites, or comets</span>
          </div>
        `;
        this.wrapper.classList.add("has-results");
        return;
      }

      const rowsHtml = results.map((item, idx) => {
        const isSelected = idx === this.selectedIndex ? "selected" : "";
        const titleHtml = this.highlightMatch(item.name, query);

        // Subtitle text
        let subText = "";
        if (item.category === "Constellation") {
          subText = `${item.english || "IAU Constellation"} • 88 Official Constellations`;
        } else if (item.category === "Planet") {
          subText = `Solar System Planet • Mag ${item.mag != null ? item.mag.toFixed(1) : "N/A"}`;
        } else if (item.category === "Meteorite") {
          subText = `${item.showerType || "Meteor Stream"} • Peak ${item.peak || "Annual"}`;
        } else if (item.category === "Comet") {
          subText = `Periodic Comet • ${item.spectral || "Dust & Ion Tail"}`;
        } else if (item.category === "Asteroid") {
          subText = `Asteroid • ${item.spectral || "Main Belt"}`;
        } else {
          // Star
          subText = `Spectral Class ${item.spec || "Star"} • Constellation: ${item.const || "Sky"}`;
        }

        // Category Badge Details
        const badgeClass = `type-${item.category.toLowerCase()}`;
        let badgeIcon = "★";
        if (item.category === "Planet") badgeIcon = "🪐";
        else if (item.category === "Constellation") badgeIcon = "✨";
        else if (item.category === "Asteroid") badgeIcon = "🪨";
        else if (item.category === "Meteorite") badgeIcon = "☄️";
        else if (item.category === "Comet") badgeIcon = "💫";

        // Real-time altitude pill
        const alt = Math.round(item.altitude * 10) / 10;
        const isVisible = alt > 0;
        const altClass = isVisible ? "visible-sky" : "below-horizon";
        const altText = isVisible ? `+${alt.toFixed(1)}° • Visible` : `${alt.toFixed(1)}° • Below Horizon`;

        return `
          <div class="spotlight-row ${isSelected}" data-index="${idx}" role="option" aria-selected="${idx === this.selectedIndex}">
            <div class="spotlight-row-left">
              <span class="spotlight-type-badge ${badgeClass}">${badgeIcon} ${item.category}</span>
              <div class="spotlight-row-info">
                <span class="spotlight-row-title">${titleHtml}</span>
                <span class="spotlight-row-sub">${subText}</span>
              </div>
            </div>
            <div class="spotlight-row-right">
              <span class="spotlight-alt-pill ${altClass}">${altText}</span>
            </div>
          </div>
        `;
      }).join("");

      this.list.innerHTML = rowsHtml;
      this.wrapper.classList.add("has-results");

      // Attach click events to rows
      this.list.querySelectorAll(".spotlight-row").forEach(row => {
        row.addEventListener("click", () => {
          const index = parseInt(row.dataset.index, 10);
          if (!isNaN(index) && this.filteredResults[index]) {
            this.selectItem(this.filteredResults[index]);
          }
        });

        row.addEventListener("mouseenter", () => {
          const index = parseInt(row.dataset.index, 10);
          if (!isNaN(index)) {
            this.setSelectedIndex(index);
          }
        });
      });
    }

    navigateSelection(delta) {
      if (this.filteredResults.length === 0) return;
      let next = this.selectedIndex + delta;
      if (next < 0) next = this.filteredResults.length - 1;
      if (next >= this.filteredResults.length) next = 0;
      this.setSelectedIndex(next);

      // Scroll into view
      const rows = this.list.querySelectorAll(".spotlight-row");
      if (rows[next]) {
        rows[next].scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    setSelectedIndex(idx) {
      this.selectedIndex = idx;
      const rows = this.list.querySelectorAll(".spotlight-row");
      rows.forEach((r, i) => {
        if (i === idx) {
          r.classList.add("selected");
          r.setAttribute("aria-selected", "true");
        } else {
          r.classList.remove("selected");
          r.setAttribute("aria-selected", "false");
        }
      });
    }

    selectItem(item) {
      if (!item || !this.sky) return;

      // Close Spotlight with Apple exit animation
      this.close();

      // Ensure corresponding sky layer is activated so target is visible
      if (item.category === "Star" && !this.sky.showStars) {
        this.sky.showStars = true;
        const btn = document.getElementById("quick-star-btn");
        if (btn) btn.classList.add("active");
        const chk = document.getElementById("toggle-stars");
        if (chk) chk.checked = true;
      } else if (item.category === "Planet" && !this.sky.showPlanets) {
        this.sky.showPlanets = true;
        const btn = document.getElementById("quick-planet-btn");
        if (btn) btn.classList.add("active");
        const chk = document.getElementById("toggle-planets");
        if (chk) chk.checked = true;
      } else if (item.category === "Constellation") {
        this.sky.showConstellations = true;
        const btn = document.getElementById("quick-constellation-btn");
        if (btn) btn.classList.add("active");
        const chk = document.getElementById("toggle-constellations");
        if (chk) chk.checked = true;
      } else if ((item.category === "Asteroid" || item.category === "Comet" || item.category === "Meteorite") && !this.sky.showCometsAndAsteroids) {
        this.sky.showCometsAndAsteroids = true;
        const btn = document.getElementById("quick-comet-btn");
        if (btn) btn.classList.add("active");
        const chk = document.getElementById("toggle-comets");
        if (chk) chk.checked = true;
      }

      // Smoothly pan camera onto the celestial target
      this.sky.centerOnObject(item);

      // Select target and open Apple Celestial Inspector
      const targetObj = item.realSkyObj || item;
      this.sky.selectedObject = targetObj;
      if (this.sky.onSelectObject) {
        this.sky.onSelectObject(targetObj);
      }
    }
  }

  window.SpotlightSearch = SpotlightSearch;

})(window);
