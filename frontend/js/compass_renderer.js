/**
 * High-DPI Linear Azimuth & Altitude Tape Compass Renderer (Pure White Scales)
 * Uses exact devicePixelRatio scaling and crisp sub-pixel alignment.
 * Strictly uses white color for all scale lines, borders, ticks, reticles, and pips.
 */

class LinearCompassRenderer {
  constructor(topCanvasId, leftCanvasId) {
    this.topCanvas = document.getElementById(topCanvasId);
    this.leftCanvas = document.getElementById(leftCanvasId);

    this.topCtx = this.topCanvas ? this.topCanvas.getContext("2d") : null;
    this.leftCtx = this.leftCanvas ? this.leftCanvas.getContext("2d") : null;

    this.headingDisplay = document.getElementById("top-heading-readout");
    this.altitudeDisplay = document.getElementById("left-alt-readout");

    this.currentAzimuth = 0;   // 0..360
    this.currentAltitude = 35; // -90..+90

    this.pixelsPerDegreeAz = 8.5;  // Spacing for pristine legibility
    this.pixelsPerDegreeAlt = 7.5; // Spacing for vertical tick marks

    this.init();
  }

  init() {
    window.addEventListener("resize", () => this.resize());
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;

    if (this.topCanvas && this.topCtx) {
      const rect = this.topCanvas.getBoundingClientRect();
      const cssW = rect.width || 560;
      const cssH = rect.height || 74;

      this.topCanvas.width = Math.round(cssW * dpr);
      this.topCanvas.height = Math.round(cssH * dpr);
      this.topCtx.resetTransform ? this.topCtx.resetTransform() : this.topCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.topCtx.scale(dpr, dpr);
      this.topW = cssW;
      this.topH = cssH;
    }

    if (this.leftCanvas && this.leftCtx) {
      const rect = this.leftCanvas.getBoundingClientRect();
      const cssW = rect.width || 76;
      const cssH = rect.height || 420;

      this.leftCanvas.width = Math.round(cssW * dpr);
      this.leftCanvas.height = Math.round(cssH * dpr);
      this.leftCtx.resetTransform ? this.leftCtx.resetTransform() : this.leftCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.leftCtx.scale(dpr, dpr);
      this.leftW = cssW;
      this.leftH = cssH;
    }

    this.render(this.currentAzimuth, this.currentAltitude);
  }

  getCardinalLabel(deg) {
    const normalized = Math.round(((deg % 360) + 360) % 360);
    switch (normalized) {
      case 0:
      case 360:
        return { text: "N", isCardinal: true, isNorth: true };
      case 45:
        return { text: "NE", isCardinal: true };
      case 90:
        return { text: "E", isCardinal: true };
      case 135:
        return { text: "SE", isCardinal: true };
      case 180:
        return { text: "S", isCardinal: true };
      case 225:
        return { text: "SW", isCardinal: true };
      case 270:
        return { text: "W", isCardinal: true };
      case 315:
        return { text: "NW", isCardinal: true };
      default:
        return null;
    }
  }

  render(azimuth, altitude) {
    this.currentAzimuth = ((azimuth % 360) + 360) % 360;
    this.currentAltitude = Math.max(-90, Math.min(90, altitude));

    this.renderTopAzimuth();
    this.renderLeftAltitude();
    this.updateReadouts();
  }

  renderTopAzimuth() {
    if (!this.topCtx) return;
    const ctx = this.topCtx;
    const w = this.topW;
    const h = this.topH;
    const centerX = w / 2;

    ctx.clearRect(0, 0, w, h);

    // Visible angular range
    const halfFov = (w / 2) / this.pixelsPerDegreeAz;
    const minDeg = Math.floor(this.currentAzimuth - halfFov) - 1;
    const maxDeg = Math.ceil(this.currentAzimuth + halfFov) + 1;

    // Draw tape tick marks in pure white
    for (let deg = minDeg; deg <= maxDeg; deg++) {
      const offset = (deg - this.currentAzimuth) * this.pixelsPerDegreeAz;
      const x = Math.round(centerX + offset) + 0.5; // pixel-snapped
      const normDeg = ((deg % 360) + 360) % 360;

      const isTen = normDeg % 10 === 0;
      const isFive = normDeg % 5 === 0;
      const cardinal = isFive ? this.getCardinalLabel(normDeg) : null;

      if (cardinal) {
        // Cardinal direction letter (Pure White)
        ctx.fillStyle = "#ffffff";
        ctx.font = cardinal.isNorth
          ? "700 13px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
          : "600 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(cardinal.text, x, 6);

        // Major tick in pure white
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 24);
        ctx.lineTo(x, 48);
        ctx.stroke();

        // Degree label below tick (Pure White)
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "500 10px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif";
        ctx.fillText(String(normDeg).padStart(3, "0") + "°", x, 52);

      } else if (isTen) {
        // 10 degree tick (Pure White)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, 28);
        ctx.lineTo(x, 46);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "500 9.5px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(String(normDeg).padStart(3, "0") + "°", x, 52);

      } else if (isFive) {
        // 5 degree tick (Pure White)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(x, 32);
        ctx.lineTo(x, 44);
        ctx.stroke();

      } else {
        // 1 degree fine tick (Pure White)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, 36);
        ctx.lineTo(x, 42);
        ctx.stroke();
      }
    }

    // Smooth horizontal edge alpha fade via destination-in (so blurry grey liquid glass shines through cleanly)
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(0.12, "rgba(0, 0, 0, 1)");
    grad.addColorStop(0.88, "rgba(0, 0, 0, 1)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Center Pure White Reticle Hairline & Pip
    const centerSnap = Math.round(centerX) + 0.5;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(centerSnap, 20);
    ctx.lineTo(centerSnap, 50);
    ctx.stroke();

    // Pure White top pip
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(centerSnap - 4, 16);
    ctx.lineTo(centerSnap + 4, 16);
    ctx.lineTo(centerSnap, 22);
    ctx.closePath();
    ctx.fill();
  }

  renderLeftAltitude() {
    if (!this.leftCtx) return;
    const ctx = this.leftCtx;
    const w = this.leftW;
    const h = this.leftH;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Altitude range: altitude increases as camera looks up
    const halfFov = (h / 2) / this.pixelsPerDegreeAlt;
    const minDeg = Math.floor(this.currentAltitude - halfFov) - 1;
    const maxDeg = Math.ceil(this.currentAltitude + halfFov) + 1;

    for (let deg = minDeg; deg <= maxDeg; deg++) {
      if (deg < -90 || deg > 90) continue;

      const offset = (deg - this.currentAltitude) * this.pixelsPerDegreeAlt;
      const y = Math.round(centerY - offset) + 0.5;

      const isTen = deg % 10 === 0;
      const isFive = deg % 5 === 0;
      const isHorizon = deg === 0;
      const isZenith = deg === 90;
      const isNadir = deg === -90;

      if (isHorizon) {
        // Horizon line (0 deg) in Pure White
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(38, y);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "700 10px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("0° HORIZON", 42, y);

      } else if (isZenith || isNadir) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(14, y);
        ctx.lineTo(36, y);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "700 9.5px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(isZenith ? "+90° ZEN" : "-90° NAD", 40, y);

      } else if (isTen) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(18, y);
        ctx.lineTo(34, y);
        ctx.stroke();

        const sign = deg > 0 ? "+" : "";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "500 9.5px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`${sign}${deg}°`, 38, y);

      } else if (isFive) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(22, y);
        ctx.lineTo(32, y);
        ctx.stroke();

      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(26, y);
        ctx.lineTo(30, y);
        ctx.stroke();
      }
    }

    // Smooth vertical edge alpha fade via destination-in (so blurry grey liquid glass shines through cleanly)
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(0.12, "rgba(0, 0, 0, 1)");
    grad.addColorStop(0.88, "rgba(0, 0, 0, 1)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Center Altitude Reticle Hairline & Pip (Pure White)
    const centerSnapY = Math.round(centerY) + 0.5;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(6, centerSnapY);
    ctx.lineTo(36, centerSnapY);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(4, centerSnapY - 4);
    ctx.lineTo(4, centerSnapY + 4);
    ctx.lineTo(10, centerSnapY);
    ctx.closePath();
    ctx.fill();
  }

  updateReadouts() {
    if (this.headingDisplay) {
      const az = Math.round(this.currentAzimuth);
      const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
      const dirIndex = Math.round(((az % 360) / 22.5));
      const dirText = dirs[dirIndex];
      this.headingDisplay.innerHTML = `<span class="deg-val">${String(az).padStart(3, "0")}°</span> <span class="dir-val">${dirText}</span>`;
    }

    if (this.altitudeDisplay) {
      const alt = Math.round(this.currentAltitude * 10) / 10;
      const sign = alt > 0 ? "+" : "";
      this.altitudeDisplay.innerHTML = `<span class="alt-label">ALT</span> <span class="alt-val">${sign}${alt.toFixed(1)}°</span>`;
    }
  }
}
