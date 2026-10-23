"""
Celestial Observer Backend - FastAPI Application.
Provides ephemeris computation, star catalogs, time synchronization,
and architecture guide download endpoints.
"""

import os
from datetime import datetime, timezone
from typing import Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.astronomy_engine import (
    to_julian_date,
    ra_dec_to_alt_az,
    calculate_sun_position,
    calculate_moon_position,
    calculate_planets
)
from backend.star_catalog import BRIGHT_STARS, CONSTELLATIONS, COMETS_AND_ASTEROIDS

app = FastAPI(
    title="Aetheria Celestial API",
    description="High-precision astronomical ephemerides and celestial observation engine",
    version="2.0.0"
)

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    if request.url.path.endswith((".js", ".html", ".css", ".json")):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
DOCS_DIR = os.path.join(BASE_DIR, "docs")

@app.get("/api/time")
def get_current_time():
    """Returns current atomic server UTC time."""
    now = datetime.now(timezone.utc)
    return {
        "utc_iso": now.isoformat(),
        "timestamp_ms": int(now.timestamp() * 1000),
        "julian_date": to_julian_date(now)
    }

@app.get("/api/stars")
def get_stars_and_constellations():
    """Returns the immutable bright star catalog, constellations, and comets/asteroids."""
    return {
        "stars": BRIGHT_STARS,
        "constellations": CONSTELLATIONS,
        "comets_asteroids": COMETS_AND_ASTEROIDS
    }

@app.get("/api/ephemeris")
def get_ephemeris(
    timestamp: Optional[float] = Query(None, description="UNIX epoch timestamp in seconds"),
    lat: float = Query(35.6762, description="Observer latitude in degrees (default: Tokyo 35.68)"),
    lon: float = Query(139.6503, description="Observer longitude in degrees (default: Tokyo 139.65)")
):
    """
    Computes real-time horizontal coordinates (Altitude and Azimuth)
    for Sun, Moon, major planets, comets/asteroids, and all cataloged stars for observer location.
    """
    if timestamp is not None:
        dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    else:
        dt = datetime.now(timezone.utc)

    jd = to_julian_date(dt)

    # Sun
    sun = calculate_sun_position(jd)
    sun_alt, sun_az = ra_dec_to_alt_az(sun["ra"], sun["dec"], lat, lon, jd)
    sun["altitude"] = round(sun_alt, 2)
    sun["azimuth"] = round(sun_az, 2)

    # Moon
    moon = calculate_moon_position(jd)
    moon_alt, moon_az = ra_dec_to_alt_az(moon["ra"], moon["dec"], lat, lon, jd)
    moon["altitude"] = round(moon_alt, 2)
    moon["azimuth"] = round(moon_az, 2)

    # Planets
    planets = calculate_planets(jd)
    for p in planets:
        alt, az = ra_dec_to_alt_az(p["ra"], p["dec"], lat, lon, jd)
        p["altitude"] = round(alt, 2)
        p["azimuth"] = round(az, 2)

    # Comets & Asteroids
    comets_data = []
    for c in COMETS_AND_ASTEROIDS:
        alt, az = ra_dec_to_alt_az(c["ra"], c["dec"], lat, lon, jd)
        comets_data.append({
            **c,
            "altitude": round(alt, 2),
            "azimuth": round(az, 2),
            "visible": alt > -5.0
        })

    # Stars with calculated Alt/Az
    stars_with_altaz = []
    for s in BRIGHT_STARS:
        alt, az = ra_dec_to_alt_az(s["ra"], s["dec"], lat, lon, jd)
        stars_with_altaz.append({
            **s,
            "altitude": round(alt, 2),
            "azimuth": round(az, 2),
            "visible": alt > -5.0
        })

    return {
        "timestamp": dt.timestamp(),
        "utc_iso": dt.isoformat(),
        "julian_date": round(jd, 5),
        "observer": {"lat": lat, "lon": lon},
        "sun": sun,
        "moon": moon,
        "planets": planets,
        "comets_asteroids": comets_data,
        "stars": stars_with_altaz,
        "constellations": CONSTELLATIONS
    }

@app.get("/api/download/pdf")
def download_pdf_guide():
    """Download the comprehensive architecture and build procedure PDF document."""
    pdf_path = os.path.join(DOCS_DIR, "ASTRONOMY_APP_ARCHITECTURE_GUIDE.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF guide not yet generated.")
    return FileResponse(
        path=pdf_path,
        filename="ASTRONOMY_APP_ARCHITECTURE_GUIDE.pdf",
        media_type="application/pdf"
    )

@app.get("/api/download/docx")
def download_docx_guide():
    """Download the comprehensive architecture and build procedure Word (DOCX) document."""
    docx_path = os.path.join(DOCS_DIR, "ASTRONOMY_APP_ARCHITECTURE_GUIDE.docx")
    if not os.path.exists(docx_path):
        raise HTTPException(status_code=404, detail="Word guide not yet generated.")
    return FileResponse(
        path=docx_path,
        filename="ASTRONOMY_APP_ARCHITECTURE_GUIDE.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )

# Mount frontend directory for static serving
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
