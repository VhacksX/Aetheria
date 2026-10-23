/**
 * Astronomy Calculation Engine (Client-Side)
 * High-precision algorithms for Julian Date, Sidereal Time, Alt/Az transformations,
 * Keplerian planetary mechanics, and Lunar Phase rendering.
 */

const Astronomy = {
  J2000: 2451545.0,
  DEG2RAD: Math.PI / 180.0,
  RAD2DEG: 180.0 / Math.PI,

  toJulianDate(date) {
    const year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate() + (date.getUTCHours() + (date.getUTCMinutes() + (date.getUTCSeconds() + date.getUTCMilliseconds() / 1000.0) / 60.0) / 60.0) / 24.0;

    let y = year;
    let m = month;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
    return jd;
  },

  greenwichMeanSiderealTime(jd) {
    const t = (jd - this.J2000) / 36525.0;
    let gmst = 280.46061837 + 360.98564736629 * (jd - this.J2000) + 0.000387933 * t * t - (t * t * t) / 38710000.0;
    gmst = ((gmst % 360.0) + 360.0) % 360.0;
    return gmst;
  },

  localSiderealTime(jd, longitudeDeg) {
    const gmst = this.greenwichMeanSiderealTime(jd);
    let lst = (gmst + longitudeDeg) % 360.0;
    return (lst + 360.0) % 360.0;
  },

  raDecToAltAz(raDeg, decDeg, latDeg, lonDeg, jd) {
    const lst = this.localSiderealTime(jd, lonDeg);
    const haDeg = ((lst - raDeg) % 360.0 + 360.0) % 360.0;

    const ha = haDeg * this.DEG2RAD;
    const dec = decDeg * this.DEG2RAD;
    const lat = latDeg * this.DEG2RAD;

    // Sin(Altitude)
    let sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
    sinAlt = Math.max(-1.0, Math.min(1.0, sinAlt));
    const altRad = Math.asin(sinAlt);
    const altDeg = altRad * this.RAD2DEG;

    // Azimuth
    const cosAlt = Math.cos(altRad);
    let azDeg = 0.0;
    if (Math.abs(cosAlt) > 1e-6) {
      let cosAz = (Math.sin(dec) - Math.sin(lat) * Math.sin(altRad)) / (Math.cos(lat) * cosAlt);
      cosAz = Math.max(-1.0, Math.min(1.0, cosAz));
      azDeg = Math.acos(cosAz) * this.RAD2DEG;
      if (Math.sin(ha) > 0) {
        azDeg = 360.0 - azDeg;
      }
    }
    azDeg = (azDeg % 360.0 + 360.0) % 360.0;

    return { altitude: altDeg, azimuth: azDeg };
  },

  calculateSun(jd) {
    const n = jd - this.J2000;
    const lDeg = ((280.460 + 0.9856474 * n) % 360.0 + 360.0) % 360.0;
    const gDeg = ((357.528 + 0.9856003 * n) % 360.0 + 360.0) % 360.0;
    const gRad = gDeg * this.DEG2RAD;

    const lambdaDeg = (lDeg + 1.915 * Math.sin(gRad) + 0.020 * Math.sin(2 * gRad)) % 360.0;
    const lambdaRad = lambdaDeg * this.DEG2RAD;

    const epsRad = (23.439 - 0.0000004 * n) * this.DEG2RAD;

    const sinDec = Math.sin(epsRad) * Math.sin(lambdaRad);
    const decDeg = Math.asin(sinDec) * this.RAD2DEG;

    const y = Math.cos(epsRad) * Math.sin(lambdaRad);
    const x = Math.cos(lambdaRad);
    const raDeg = ((Math.atan2(y, x) * this.RAD2DEG) % 360.0 + 360.0) % 360.0;

    return {
      name: "Sun",
      ra: raDeg,
      dec: decDeg,
      eclipticLon: lambdaDeg,
      magnitude: -26.7
    };
  },

  calculateMoon(jd) {
    const t = (jd - this.J2000) / 36525.0;
    const lPrime = (218.3164477 + 481267.88123421 * t) % 360.0;
    const d = (297.8501921 + 445267.1114034 * t) % 360.0;
    const m = (357.5291092 + 35999.0502909 * t) % 360.0;
    const mPrime = (134.9633964 + 477198.8675055 * t) % 360.0;
    const f = (93.2720950 + 483202.0175233 * t) % 360.0;

    const dRad = d * this.DEG2RAD;
    const mRad = m * this.DEG2RAD;
    const mpRad = mPrime * this.DEG2RAD;
    const fRad = f * this.DEG2RAD;

    const lonDeg = ((lPrime
      + 6.289 * Math.sin(mpRad)
      - 1.274 * Math.sin(2 * dRad - mpRad)
      + 0.658 * Math.sin(2 * dRad)
      - 0.214 * Math.sin(2 * mpRad)
      - 0.186 * Math.sin(mRad)
      - 0.114 * Math.sin(2 * fRad)) % 360.0 + 360.0) % 360.0;
    const lonRad = lonDeg * this.DEG2RAD;

    const latDeg = 5.128 * Math.sin(fRad)
      + 0.281 * Math.sin(mpRad + fRad)
      - 0.278 * Math.sin(mpRad - fRad)
      + 0.173 * Math.sin(2 * dRad - fRad);
    const latRad = latDeg * this.DEG2RAD;

    const epsRad = (23.439291 - 0.0130042 * t) * this.DEG2RAD;

    const sinDec = Math.sin(latRad) * Math.cos(epsRad) + Math.cos(latRad) * Math.sin(epsRad) * Math.sin(lonRad);
    const decDeg = Math.asin(sinDec) * this.RAD2DEG;

    const y = Math.sin(lonRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
    const x = Math.cos(lonRad);
    const raDeg = ((Math.atan2(y, x) * this.RAD2DEG) % 360.0 + 360.0) % 360.0;

    const sun = this.calculateSun(jd);
    const phaseAngle = ((lonDeg - sun.eclipticLon) % 360.0 + 360.0) % 360.0;
    const illumination = (1.0 + Math.cos(phaseAngle * this.DEG2RAD)) / 2.0;

    let phaseName = "New Moon";
    if (phaseAngle >= 22.5 && phaseAngle < 67.5) phaseName = "Waxing Crescent";
    else if (phaseAngle >= 67.5 && phaseAngle < 112.5) phaseName = "First Quarter";
    else if (phaseAngle >= 112.5 && phaseAngle < 157.5) phaseName = "Waxing Gibbous";
    else if (phaseAngle >= 157.5 && phaseAngle < 202.5) phaseName = "Full Moon";
    else if (phaseAngle >= 202.5 && phaseAngle < 247.5) phaseName = "Waning Gibbous";
    else if (phaseAngle >= 247.5 && phaseAngle < 292.5) phaseName = "Last Quarter";
    else if (phaseAngle >= 292.5 && phaseAngle < 337.5) phaseName = "Waning Crescent";

    return {
      name: "Moon",
      ra: raDeg,
      dec: decDeg,
      phaseAngle: phaseAngle,
      illumination: illumination,
      phaseName: phaseName,
      magnitude: -12.7
    };
  },

  calculatePlanets(jd) {
    const d = jd - this.J2000;
    const elements = {
      "Mercury": { a: 0.387098, e: 0.205630, I: 7.005, L: 252.25 + 4.0923344368 * d, w: 77.46, N: 48.33, color: "#d2d8e0", mag: -0.4 },
      "Venus":   { a: 0.723332, e: 0.006773, I: 3.395, L: 181.98 + 1.6021302244 * d, w: 131.57, N: 76.68, color: "#fff5db", mag: -4.3 },
      "Mars":    { a: 1.523679, e: 0.093405, I: 1.850, L: 355.45 + 0.5240207766 * d, w: 336.04, N: 49.56, color: "#ff6a3d", mag: -1.2 },
      "Jupiter": { a: 5.204267, e: 0.048498, I: 1.303, L: 34.40 + 0.0830853001 * d,  w: 14.75, N: 100.56, color: "#ffdcaa", mag: -2.4 },
      "Saturn":  { a: 9.582017, e: 0.055546, I: 2.489, L: 49.94 + 0.0334442282 * d,  w: 92.43, N: 113.72, color: "#f7e3b5", mag: 0.4 },
      "Uranus":  { a: 19.189165, e: 0.047168, I: 0.773, L: 313.23 + 0.011725806 * d, w: 170.96, N: 74.23, color: "#a5f2f3", mag: 5.7 },
      "Neptune": { a: 30.069923, e: 0.008586, I: 1.770, L: 304.88 + 0.005981070 * d, w: 44.97, N: 131.72, color: "#5b86e5", mag: 7.8 }
    };

    const earthL = (100.46 + 0.985647352 * d) % 360.0;
    const earthM = (357.528 + 0.9856003 * d) % 360.0;
    const earthE = 0.016709;
    const earthV = earthL + 1.915 * Math.sin(earthM * this.DEG2RAD);
    const earthR = 1.00014 - earthE * Math.cos(earthM * this.DEG2RAD);
    const xe = earthR * Math.cos(earthV * this.DEG2RAD);
    const ye = earthR * Math.sin(earthV * this.DEG2RAD);

    const list = [];
    for (const [name, el] of Object.entries(elements)) {
      const m = ((el.L - el.w) % 360.0 + 360.0) % 360.0;
      const mRad = m * this.DEG2RAD;
      const v = el.L + (2 * el.e - 0.25 * Math.pow(el.e, 3)) * Math.sin(mRad) * this.RAD2DEG;
      const vRad = v * this.DEG2RAD;
      const r = el.a * (1 - el.e * el.e) / (1 + el.e * Math.cos((v - el.w) * this.DEG2RAD));

      const iRad = el.I * this.DEG2RAD;
      const nRad = el.N * this.DEG2RAD;
      const uRad = vRad - nRad;

      const xh = r * (Math.cos(nRad) * Math.cos(uRad) - Math.sin(nRad) * Math.sin(uRad) * Math.cos(iRad));
      const yh = r * (Math.sin(nRad) * Math.cos(uRad) + Math.cos(nRad) * Math.sin(uRad) * Math.cos(iRad));
      const zh = r * (Math.sin(uRad) * Math.sin(iRad));

      const xg = xh - xe;
      const yg = yh - ye;
      const zg = zh;

      const epsRad = 23.439 * this.DEG2RAD;
      const xeq = xg;
      const yeq = yg * Math.cos(epsRad) - zg * Math.sin(epsRad);
      const zeq = yg * Math.sin(epsRad) + zg * Math.cos(epsRad);

      const dist = Math.sqrt(xeq * xeq + yeq * yeq + zeq * zeq);
      const raDeg = ((Math.atan2(yeq, xeq) * this.RAD2DEG) % 360.0 + 360.0) % 360.0;
      const decDeg = Math.asin(zeq / dist) * this.RAD2DEG;

      list.push({
        name: name,
        ra: raDeg,
        dec: decDeg,
        color: el.color,
        magnitude: el.mag,
        distanceAu: dist
      });
    }

    return list;
  },

  /**
   * Projects a celestial coordinate (Azimuth, Altitude) onto screen (x, y)
   * using a 3D spherical perspective projection centered on (camAz, camAlt).
   *
   * @param {number} az - Target object azimuth (0..360 deg)
   * @param {number} alt - Target object altitude (-90..+90 deg)
   * @param {number} camAz - Camera center azimuth (0..360 deg)
   * @param {number} camAlt - Camera center altitude (-90..+90 deg)
   * @param {number} fovDeg - Field of view in degrees (e.g. 75 deg)
   * @param {number} screenW - Canvas width in CSS pixels
   * @param {number} screenH - Canvas height in CSS pixels
   * @returns {{x: number, y: number, visible: boolean, depth: number}}
   */
  projectToScreen(az, alt, camAz, camAlt, fovDeg, screenW, screenH) {
    const deltaAz = (az - camAz) * this.DEG2RAD;
    const objAltRad = alt * this.DEG2RAD;
    const camAltRad = camAlt * this.DEG2RAD;

    // Unit vector in observer frame:
    // x = east, y = north, z = up
    // Rotate coordinate system so camera looks along +Z
    const vx = Math.cos(objAltRad) * Math.sin(deltaAz);
    const vy = Math.sin(objAltRad) * Math.cos(camAltRad) - Math.cos(objAltRad) * Math.sin(camAltRad) * Math.cos(deltaAz);
    const vz = Math.sin(objAltRad) * Math.sin(camAltRad) + Math.cos(objAltRad) * Math.cos(camAltRad) * Math.cos(deltaAz);

    // If vz <= 0, the object is behind the observer
    if (vz <= 0.05) {
      return { x: -9999, y: -9999, visible: false, depth: vz };
    }

    // Focal length
    const f = (screenW / 2) / Math.tan((fovDeg / 2) * this.DEG2RAD);

    const screenX = screenW / 2 + (vx / vz) * f;
    const screenY = screenH / 2 - (vy / vz) * f;

    const margin = 80;
    const inBounds = screenX >= -margin && screenX <= screenW + margin && screenY >= -margin && screenY <= screenH + margin;

    return {
      x: screenX,
      y: screenY,
      visible: inBounds,
      depth: vz
    };
  }
};
