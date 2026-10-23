"""
Astronomy Engine - High precision celestial mechanics & coordinate transformations.
Computes Local Sidereal Time, Alt/Az transformations, Keplerian planetary orbits,
and accurate lunar phases based on standard astronomical algorithms (Meeus / Duffett-Smith).
"""

import math
from datetime import datetime, timezone
from typing import Dict, List, Tuple, Any

# Astronomical Constants
J2000 = 2451545.0  # Julian Date of J2000.0 epoch (2000 Jan 1.5 TT)
RAD2DEG = 180.0 / math.pi
DEG2RAD = math.pi / 180.0

def to_julian_date(dt: datetime) -> float:
    """Converts a UTC datetime into Julian Date."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
        
    year = dt.year
    month = dt.month
    day = dt.day + (dt.hour + (dt.minute + (dt.second + dt.microsecond / 1e6) / 60.0) / 60.0) / 24.0

    if month <= 2:
        year -= 1
        month += 12

    a = math.floor(year / 100)
    b = 2 - a + math.floor(a / 4)
    jd = math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (month + 1)) + day + b - 1524.5
    return jd

def greenwich_mean_sidereal_time(jd: float) -> float:
    """Calculates GMST in degrees for a given Julian Date."""
    t = (jd - J2000) / 36525.0
    # IAU 1982 formula
    gmst = 280.46061837 + 360.98564736629 * (jd - J2000) + 0.000387933 * t**2 - (t**3) / 38710000.0
    return gmst % 360.0

def local_sidereal_time(jd: float, longitude: float) -> float:
    """Calculates Local Sidereal Time in degrees for given longitude (East positive)."""
    gmst = greenwich_mean_sidereal_time(jd)
    lst = (gmst + longitude) % 360.0
    return lst

def ra_dec_to_alt_az(ra_deg: float, dec_deg: float, lat_deg: float, lon_deg: float, jd: float) -> Tuple[float, float]:
    """
    Transforms Right Ascension and Declination to local Altitude and Azimuth.
    ra_deg: Right Ascension in degrees (0..360)
    dec_deg: Declination in degrees (-90..+90)
    lat_deg: Observer latitude in degrees (-90..+90)
    lon_deg: Observer longitude in degrees (-180..+180, East positive)
    Returns: (altitude_deg, azimuth_deg)
    Azimuth: 0=North, 90=East, 180=South, 270=West
    """
    lst = local_sidereal_time(jd, lon_deg)
    ha_deg = (lst - ra_deg) % 360.0  # Hour Angle

    ha = ha_deg * DEG2RAD
    dec = dec_deg * DEG2RAD
    lat = lat_deg * DEG2RAD

    # Sin(Altitude) = sin(dec)*sin(lat) + cos(dec)*cos(lat)*cos(ha)
    sin_alt = math.sin(dec) * math.sin(lat) + math.cos(dec) * math.cos(lat) * math.cos(ha)
    sin_alt = max(-1.0, min(1.0, sin_alt))
    alt_rad = math.asin(sin_alt)
    alt_deg = alt_rad * RAD2DEG

    # Azimuth calculation
    cos_alt = math.cos(alt_rad)
    if abs(cos_alt) < 1e-6:
        az_deg = 0.0
    else:
        cos_az = (math.sin(dec) - math.sin(lat) * math.sin(alt_rad)) / (math.cos(lat) * cos_alt)
        cos_az = max(-1.0, min(1.0, cos_az))
        az_deg = math.acos(cos_az) * RAD2DEG
        if math.sin(ha) > 0:
            az_deg = 360.0 - az_deg

    return alt_deg, (az_deg % 360.0)

def calculate_sun_position(jd: float) -> Dict[str, float]:
    """Calculates Sun RA, Dec, and ecliptic longitude."""
    n = jd - J2000
    # Mean longitude of the Sun
    l_deg = (280.460 + 0.9856474 * n) % 360.0
    # Mean anomaly
    g_deg = (357.528 + 0.9856003 * n) % 360.0
    g_rad = g_deg * DEG2RAD

    # Ecliptic longitude
    lambda_deg = (l_deg + 1.915 * math.sin(g_rad) + 0.020 * math.sin(2 * g_rad)) % 360.0
    lambda_rad = lambda_deg * DEG2RAD

    # Obliquity of ecliptic
    eps_deg = 23.439 - 0.0000004 * n
    eps_rad = eps_deg * DEG2RAD

    # RA and Dec
    sin_dec = math.sin(eps_rad) * math.sin(lambda_rad)
    dec_deg = math.asin(sin_dec) * RAD2DEG

    y = math.cos(eps_rad) * math.sin(lambda_rad)
    x = math.cos(lambda_rad)
    ra_deg = (math.atan2(y, x) * RAD2DEG) % 360.0

    return {
        "name": "Sun",
        "ra": ra_deg,
        "dec": dec_deg,
        "ecliptic_lon": lambda_deg,
        "magnitude": -26.7
    }

def calculate_moon_position(jd: float) -> Dict[str, Any]:
    """Calculates Moon RA, Dec, Distance, and Lunar Phase."""
    t = (jd - J2000) / 36525.0
    # Moon's mean elements
    l_prime = (218.3164477 + 481267.88123421 * t) % 360.0  # Mean longitude
    d = (297.8501921 + 445267.1114034 * t) % 360.0        # Mean elongation
    m = (357.5291092 + 35999.0502909 * t) % 360.0         # Sun's mean anomaly
    m_prime = (134.9633964 + 477198.8675055 * t) % 360.0  # Moon's mean anomaly
    f = (93.2720950 + 483202.0175233 * t) % 360.0         # Argument of latitude

    d_rad = d * DEG2RAD
    m_rad = m * DEG2RAD
    mp_rad = m_prime * DEG2RAD
    f_rad = f * DEG2RAD

    # Longitude perturbations
    lon_deg = l_prime \
        + 6.289 * math.sin(mp_rad) \
        - 1.274 * math.sin(2 * d_rad - mp_rad) \
        + 0.658 * math.sin(2 * d_rad) \
        - 0.214 * math.sin(2 * mp_rad) \
        - 0.186 * math.sin(m_rad) \
        - 0.114 * math.sin(2 * f_rad)
    lon_deg = lon_deg % 360.0
    lon_rad = lon_deg * DEG2RAD

    # Latitude perturbations
    lat_deg = 5.128 * math.sin(f_rad) \
        + 0.281 * math.sin(mp_rad + f_rad) \
        - 0.278 * math.sin(mp_rad - f_rad) \
        + 0.173 * math.sin(2 * d_rad - f_rad)
    lat_rad = lat_deg * DEG2RAD

    # Obliquity
    eps_rad = (23.439291 - 0.0130042 * t) * DEG2RAD

    # Equatorial coordinates (RA, Dec)
    sin_dec = math.sin(lat_rad) * math.cos(eps_rad) + math.cos(lat_rad) * math.sin(eps_rad) * math.sin(lon_rad)
    dec_deg = math.asin(sin_dec) * RAD2DEG

    y = math.sin(lon_rad) * math.cos(eps_rad) - math.tan(lat_rad) * math.sin(eps_rad)
    x = math.cos(lon_rad)
    ra_deg = (math.atan2(y, x) * RAD2DEG) % 360.0

    # Phase calculation
    sun_pos = calculate_sun_position(jd)
    phase_angle = (lon_deg - sun_pos["ecliptic_lon"]) % 360.0
    illumination = (1.0 + math.cos(phase_angle * DEG2RAD)) / 2.0

    # Phase name
    if phase_angle < 22.5 or phase_angle >= 337.5:
        phase_name = "New Moon"
    elif phase_angle < 67.5:
        phase_name = "Waxing Crescent"
    elif phase_angle < 112.5:
        phase_name = "First Quarter"
    elif phase_angle < 157.5:
        phase_name = "Waxing Gibbous"
    elif phase_angle < 202.5:
        phase_name = "Full Moon"
    elif phase_angle < 247.5:
        phase_name = "Waning Gibbous"
    elif phase_angle < 292.5:
        phase_name = "Last Quarter"
    else:
        phase_name = "Waning Crescent"

    return {
        "name": "Moon",
        "ra": ra_deg,
        "dec": dec_deg,
        "illumination": round(illumination, 3),
        "phase_angle": round(phase_angle, 1),
        "phase_name": phase_name,
        "magnitude": -12.7 + 5 * math.log10(max(0.01, 1 - illumination)) if illumination < 0.99 else -12.7
    }

def calculate_planets(jd: float) -> List[Dict[str, Any]]:
    """Calculates approximate geocentric coordinates for the major planets."""
    d = jd - J2000

    # Approximate Keplerian orbital elements (semi-major axis, eccentricity, inclination, mean long, arg perihelion, long asc node)
    elements = {
        "Mercury": {"a": 0.387098, "e": 0.205630, "I": 7.005, "L": 252.25 + 4.0923344368 * d, "w": 77.46, "N": 48.33, "color": "#e0d7c6", "mag": -0.4},
        "Venus":   {"a": 0.723332, "e": 0.006773, "I": 3.395, "L": 181.98 + 1.6021302244 * d, "w": 131.57, "N": 76.68, "color": "#ffeec2", "mag": -4.2},
        "Mars":    {"a": 1.523679, "e": 0.093405, "I": 1.850, "L": 355.45 + 0.5240207766 * d, "w": 336.04, "N": 49.56, "color": "#ff7b54", "mag": -1.5},
        "Jupiter": {"a": 5.204267, "e": 0.048498, "I": 1.303, "L": 34.40 + 0.0830853001 * d,  "w": 14.75, "N": 100.56, "color": "#ffdfaa", "mag": -2.5},
        "Saturn":  {"a": 9.582017, "e": 0.055546, "I": 2.489, "L": 49.94 + 0.0334442282 * d,  "w": 92.43, "N": 113.72, "color": "#fae3b0", "mag": 0.2}
    }

    # Earth orbital elements for geocentric vector reduction
    earth_L = (100.46 + 0.985647352 * d) % 360.0
    earth_M = (357.528 + 0.9856003 * d) % 360.0
    earth_e = 0.016709
    earth_v = earth_L + 1.915 * math.sin(earth_M * DEG2RAD)
    earth_r = 1.00014 - earth_e * math.cos(earth_M * DEG2RAD)
    xe = earth_r * math.cos(earth_v * DEG2RAD)
    ye = earth_r * math.sin(earth_v * DEG2RAD)
    ze = 0.0

    planets_data = []

    for name, el in elements.items():
        m = (el["L"] - el["w"]) % 360.0
        m_rad = m * DEG2RAD
        # Equation of center
        v = el["L"] + (2 * el["e"] - 0.25 * el["e"]**3) * math.sin(m_rad) * RAD2DEG
        v_rad = v * DEG2RAD
        r = el["a"] * (1 - el["e"]**2) / (1 + el["e"] * math.cos((v - el["w"]) * DEG2RAD))

        # Heliocentric coordinates
        i_rad = el["I"] * DEG2RAD
        n_rad = el["N"] * DEG2RAD
        u_rad = v_rad - n_rad

        xh = r * (math.cos(n_rad) * math.cos(u_rad) - math.sin(n_rad) * math.sin(u_rad) * math.cos(i_rad))
        yh = r * (math.sin(n_rad) * math.cos(u_rad) + math.cos(n_rad) * math.sin(u_rad) * math.cos(i_rad))
        zh = r * (math.sin(u_rad) * math.sin(i_rad))

        # Geocentric coordinates
        xg = xh - xe
        yg = yh - ye
        zg = zh - ze

        # Equatorial coordinates (Ecliptic to equatorial)
        eps_rad = 23.439 * DEG2RAD
        xeq = xg
        yeq = yg * math.cos(eps_rad) - zg * math.sin(eps_rad)
        zeq = yg * math.sin(eps_rad) + zg * math.cos(eps_rad)

        dist = math.sqrt(xeq**2 + yeq**2 + zeq**2)
        ra_deg = (math.atan2(yeq, xeq) * RAD2DEG) % 360.0
        dec_deg = math.asin(zeq / dist) * RAD2DEG

        planets_data.append({
            "name": name,
            "ra": round(ra_deg, 3),
            "dec": round(dec_deg, 3),
            "distance_au": round(dist, 3),
            "color": el["color"],
            "magnitude": el["mag"]
        })

    return planets_data
