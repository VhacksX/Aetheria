# Aetheria • Celestial Sky Observer

> **Apple-Grade Real-Time Astronomy Web Application & Ephemeris Engine**  
> Built by a Senior Full Stack Web Developer & Systems Architect.

[![Apple Design System](https://img.shields.io/badge/Design-Apple%20HIG%20%2F%20Cupertino-000000.svg?logo=apple&logoColor=white)](#apple-uiux-design-system)
[![Astronomy](https://img.shields.io/badge/Astrometry-Yale%20BSC5%20%2F%20Hipparcos-blue)](#astronomical-engine--real-data)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2F%20Python%203.14-009688.svg?logo=fastapi&logoColor=white)](#backend-architecture)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20432Hz-ff9f0a.svg)](#ambient-relaxing-sound-ambience)

---

## 🌟 Key Highlights & User Requirements Addressed

1. **Aesthetic Apple Dark Theme**:
   - Built with Apple's typography stack (**SF Pro Display & SF Pro Text**) imported directly via web delivery and system fallback.
   - Ultra-clean Cupertino glassmorphic materials (`backdrop-filter: blur(28px) saturate(190%)`), deep midnight pitch-black void (`#000000`), and Apple accent colors (Apple Orange `#ff9f0a`, Apple Green `#30d158`, Apple Celestial Blue `#0a84ff`).
2. **360° Spherical Panoramic View**:
   - Full 360° continuous Azimuth rotation (sideways, North/East/South/West) **AND** vertical pitch from -90° (Nadir) through 0° (Horizon) up to +90° (Zenith).
   - Natural pointer and touch drag physics with velocity momentum and smooth inertia decay.
3. **Linear Azimuth & Altitude Tape Scales (High-DPI Razor-Sharp)**:
   - **Top Linear Azimuth Compass**: Displays 0° to 360° continuously with 1°, 5°, and 10° tick marks, bold cardinal markers (**N**, **NE**, **E**, **SE**, **S**, **SW**, **W**, **NW**), and an amber pip indicator with a live digital degree readout (`184° S`).
   - **Left Linear Altitude Scale**: Spans -90° to +90° vertically, with a vibrant green marker at `0° HORIZON` and a live elevation badge (`+32.0° ALT`).
   - **Retina Anti-Blur Architecture**: Scaled using hardware `window.devicePixelRatio` and sub-pixel snapping, completely eliminating any blurriness or low-quality rendering.
4. **Real Astronomical Data ("No Random Stars")**:
   - Integrates real stars from the **Yale Bright Star Catalog (BSC5)** and **Hipparcos J2000 epoch** with verified Right Ascension, Declination, visual magnitude, and spectral types (color temperatures from blue O/B to red M).
   - **Organic Atmospheric Scintillation**: Realistic star twinkling shader based on astronomical scintillation equations.
   - **Constellations**: Verified star-to-star line linkages for Orion, Ursa Major (Big Dipper), Ursa Minor (Polaris), Cassiopeia, Cygnus, Taurus, Gemini, Scorpius, Canis Major, Crux, and Pegasus.
   - **Solar System Mechanics**: Real-time Keplerian orbital reduction for Sun, Mercury, Venus, Mars, Jupiter, Saturn, and the Moon with accurate phase angle illumination rendering (crescent, gibbous, full, new).
5. **Apple Screen Play Bar & Glued Timeline Scrubber**:
   - QuickTime / iOS style playback bar.
   - **Glued Scrubber Thumb**: As requested (*"when I slide the bar the circle moves first, make sure the circle sticks with the bar"*), the thumb circle is locked to the pointer coordinates via `Pointer Events API` and `setPointerCapture`, with zero transition delay.
   - **Apple Date/Time Picker**: iOS Cupertino segmented sheet allowing manual selection of Year, Month, Day, Hour, Minute, or rapid jumping to astronomical presets (Current Real Time, Midnight Tonight, Perseid Meteor Peak, Summer/Winter Solstices).
   - Play/Pause toggle and speed warp controls (`1×` real time, `10×`, `60×`, `3600×` 1hr/s, `86400×` 1day/s).
6. **Icons & Controls**:
   - **White Gemini Logo** for Constellations toggle.
   - **Flat White Minimal Telescope Logo** for Telescope / Reticle Mode (3.5× magnification with circular mil-dot crosshairs).
   - **Minimal Apple Sound Icon** with animated sound waves.
   - **Three-Dots (`•••`) Menu** with glass dropdown sheet.
7. **Relaxing Sound Ambience Engine**:
   - Built-in soothing celestial soundscape generated via the **Web Audio API** (432Hz harmonic drone, warm lowpass resonant filter with slow breathing LFO, and randomized pentatonic stardust chimes). No external audio files needed.
8. **Comprehensive Architecture Documentation**:
   - Complete technical and procedural manual compiled in both **Word (DOCX)** and **PDF**:
     - `docs/ASTRONOMY_APP_ARCHITECTURE_GUIDE.docx`
     - `docs/ASTRONOMY_APP_ARCHITECTURE_GUIDE.pdf`
     - Accessible for one-click download directly from the app's three-dots menu!

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (Python 3.14 recommended)
- `pip` package manager

### 2. Run the Application
You can run the application directly using the provided script:

```bash
./run.sh
```

Or manually:

```bash
# 1. Install dependencies
python3 -m pip install fastapi uvicorn reportlab python-docx pillow

# 2. Start the FastAPI server
python3 -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Open in Browser
Visit **[http://localhost:8000](http://localhost:8000)** in Safari, Chrome, Edge, or Firefox.

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── app.py                     # FastAPI application & RESTful endpoints
│   ├── astronomy_engine.py        # Astronomical algorithms (JD, LST, Alt/Az, orbits, lunar phase)
│   ├── star_catalog.py            # Yale Bright Star & Hipparcos catalog data
│   └── requirements.txt           # Python backend dependencies
├── frontend/
│   ├── index.html                 # Apple UI HTML5 Single Page Application
│   ├── css/
│   │   ├── apple-theme.css        # Apple SF Pro fonts, glassmorphism, play bar
│   │   └── compass.css            # High-DPI linear azimuth & altitude tape scales
│   └── js/
│       ├── astronomy.js           # Client-side celestial mathematics engine
│       ├── star_data.js           # Catalog database for zero-latency client rendering
│       ├── audio_engine.js        # Web Audio API ambient 432Hz sound synthesizer
│       ├── sky_renderer.js        # 360° spherical high-DPI canvas sky renderer
│       ├── compass_renderer.js    # Ultra-sharp linear top & left compass renderers
│       ├── time_controller.js     # QuickTime timeline scrubber & Apple date picker
│       └── app.js                 # Master orchestrator & event bus
├── docs/
│   ├── generate_docs.py           # ReportLab & python-docx generation script
│   ├── ASTRONOMY_APP_ARCHITECTURE_GUIDE.pdf   # Formatted PDF manual
│   └── ASTRONOMY_APP_ARCHITECTURE_GUIDE.docx  # Formatted Word manual
├── run.sh                         # Quickstart launcher
└── README.md
```

---

## 📐 Celestial Mathematics & Coordinate Transformations

### 1. Gregorian to Julian Date ($JD$)
$$\text{Day Fraction } D = \text{day} + \frac{\text{hour} + \frac{\text{min} + \text{sec}/60}{60}}{24}$$
$$JD = \lfloor 365.25 \times (Y + 4716) \rfloor + \lfloor 30.6001 \times (M + 1) \rfloor + D + B - 1524.5$$

### 2. Local Sidereal Time ($LST$) & Hour Angle ($H$)
$$LST = (GMST + \lambda_{\text{observer}}) \pmod{360^\circ}$$
$$H = (LST - \alpha) \pmod{360^\circ}$$

### 3. Horizontal Coordinate Transformation (Altitude $h$ & Azimuth $A$)
$$\sin h = \sin\delta \sin\phi + \cos\delta \cos\phi \cos H$$
$$\cos A = \frac{\sin\delta - \sin\phi \sin h}{\cos\phi \cos h}$$

### 4. 3D Spherical Perspective Projection onto Screen Viewport
$$v_x = \cos h \sin(A - A_{\text{cam}})$$
$$v_y = \sin h \cos h_{\text{cam}} - \cos h \sin h_{\text{cam}} \cos(A - A_{\text{cam}})$$
$$v_z = \sin h \sin h_{\text{cam}} + \cos h \cos h_{\text{cam}} \cos(A - A_{\text{cam}})$$
$$\text{Screen } X = \frac{W}{2} + \frac{v_x}{v_z} \cdot \frac{W}{2 \tan(\text{FOV}/2)}, \quad \text{Screen } Y = \frac{H}{2} - \frac{v_y}{v_z} \cdot \frac{W}{2 \tan(\text{FOV}/2)}$$

---

## 📄 Documentation Downloads
The complete procedural documentation detailing frontend and backend development can be downloaded directly from the application's three-dots menu or found in the `docs/` folder:
- [ASTRONOMY_APP_ARCHITECTURE_GUIDE.pdf](file:///Users/vibhash/AI/Antigravity%20workbench/docs/ASTRONOMY_APP_ARCHITECTURE_GUIDE.pdf)
- [ASTRONOMY_APP_ARCHITECTURE_GUIDE.docx](file:///Users/vibhash/AI/Antigravity%20workbench/docs/ASTRONOMY_APP_ARCHITECTURE_GUIDE.docx)
