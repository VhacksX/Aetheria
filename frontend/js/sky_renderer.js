/**
 * 360° Celestial Sphere Renderer (Aqua & Turquoise Navy Edition)
 * High-DPI Retina Canvas with interactive object selection, comets & asteroids,
 * realistic tails, Moon phases, planets, and Apple liquid glass targeting reticles.
 */

class SkyRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Camera orientation
    this.camAzimuth = 180;  // South by default
    this.camAltitude = 32;  // Looking up 32 degrees
    this.targetAz = 180;
    this.targetAlt = 32;

    // Field of view (degrees)
    this.fov = 75;
    this.targetFov = 75;
    this.minFov = 18;
    this.maxFov = 95;

    // Observer location (Default: Tokyo or User GPS)
    this.observerLat = 35.6762;
    this.observerLon = 139.6503;
    this.observerName = "Tokyo, Japan";

    // Date/Time
    this.currentDate = new Date();

    // Display Toggles
    this.showStars = true;
    this.showPlanets = true;
    this.showCometsAndAsteroids = true;
    this.showMoon = true;
    this.showConstellations = true;
    this.showHorizon = true;
    this.telescopeMode = false;

    // Selected object for inspection
    this.selectedObject = null;
    this.onSelectObject = null;

    // Interaction state
    this.isDragging = false;
    this.pointerStartX = 0;
    this.pointerStartY = 0;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.velocityX = 0;
    this.velocityY = 0;

    // Listeners for compass updates
    this.onViewChange = null;

    // Cached celestial objects
    this.cachedStars = [];
    this.cachedBgStars = [];
    this.cachedPlanets = [];
    this.cachedCometsAndAsteroids = [];
    this.cachedSun = null;
    this.cachedMoon = null;

    this.init();
  }

  init() {
    window.addEventListener("resize", () => this.resize());
    this.resize();
    this.setupInteractions();
    this.updateCelestialPositions();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.resetTransform ? this.ctx.resetTransform() : this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.cssWidth = w;
    this.cssHeight = h;
  }

  setupInteractions() {
    // Pointer Dragging for 360-degree rotation (sideways & vertical)
    this.canvas.addEventListener("pointerdown", (e) => {
      this.isDragging = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.velocityX = 0;
      this.velocityY = 0;
      this.canvas.setPointerCapture(e.pointerId);
    });

    this.canvas.addEventListener("pointermove", (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;

      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      // Sensitivity scaled by current FOV
      const factor = (this.fov / this.cssWidth) * 1.35;
      const dAz = -dx * factor;
      const dAlt = dy * factor;

      this.camAzimuth = ((this.camAzimuth + dAz) % 360 + 360) % 360;
      this.camAltitude = Math.max(-90, Math.min(90, this.camAltitude + dAlt));

      this.targetAz = this.camAzimuth;
      this.targetAlt = this.camAltitude;

      this.velocityX = dAz;
      this.velocityY = dAlt;

      if (this.onViewChange) {
        this.onViewChange(this.camAzimuth, this.camAltitude);
      }
    });

    const endDrag = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      try {
        this.canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // Click detection: if moved less than 7 pixels, it's a tap/click on celestial object!
      const dist = Math.hypot(e.clientX - this.pointerStartX, e.clientY - this.pointerStartY);
      if (dist < 7) {
        this.handleCanvasClick(e.clientX, e.clientY);
      }
    };

    this.canvas.addEventListener("pointerup", endDrag);
    this.canvas.addEventListener("pointercancel", endDrag);

    // Zoom (Mouse wheel)
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      this.targetFov = Math.max(this.minFov, Math.min(this.maxFov, this.targetFov * zoomFactor));
    }, { passive: false });

    // Touch pinch-to-zoom
    let initialPinchDist = null;
    let initialFov = this.fov;

    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialFov = this.fov;
      }
    }, { passive: true });

    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && initialPinchDist) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ratio = initialPinchDist / dist;
        this.targetFov = Math.max(this.minFov, Math.min(this.maxFov, initialFov * ratio));
      }
    }, { passive: true });

    this.canvas.addEventListener("touchend", () => {
      initialPinchDist = null;
    }, { passive: true });
  }

  handleCanvasClick(clickX, clickY) {
    const candidates = [];
    const w = this.cssWidth;
    const h = this.cssHeight;

    // Check Planets
    if (this.showPlanets && this.cachedPlanets) {
      this.cachedPlanets.forEach(p => {
        const proj = Astronomy.projectToScreen(p.azimuth, p.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h);
        if (proj.visible) {
          const d = Math.hypot(clickX - proj.x, clickY - proj.y);
          if (d < 30) candidates.push({ object: p, dist: d, category: "Planet" });
        }
      });
    }

    // Check Comets & Asteroids
    if (this.showCometsAndAsteroids && this.cachedCometsAndAsteroids) {
      this.cachedCometsAndAsteroids.forEach(c => {
        const proj = Astronomy.projectToScreen(c.azimuth, c.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h);
        if (proj.visible) {
          const d = Math.hypot(clickX - proj.x, clickY - proj.y);
          if (d < 32) {
            let cat = "Asteroid";
            if (c.type === "comet") cat = "Comet";
            else if (c.type === "meteorite" || c.type === "meteor_shower") cat = "Meteorite";
            candidates.push({ object: c, dist: d, category: cat });
          }
        }
      });
    }

    // Check Moon
    if (this.showMoon && this.cachedMoon) {
      const proj = Astronomy.projectToScreen(this.cachedMoon.azimuth, this.cachedMoon.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h);
      if (proj.visible) {
        const d = Math.hypot(clickX - proj.x, clickY - proj.y);
        if (d < 35) candidates.push({ object: this.cachedMoon, dist: d, category: "Natural Satellite" });
      }
    }

    // Check Sun
    if (this.cachedSun) {
      const proj = Astronomy.projectToScreen(this.cachedSun.azimuth, this.cachedSun.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h);
      if (proj.visible) {
        const d = Math.hypot(clickX - proj.x, clickY - proj.y);
        if (d < 40) candidates.push({ object: this.cachedSun, dist: d, category: "Host Star" });
      }
    }

    // Check Bright Stars
    if (this.showStars && this.cachedStars) {
      this.cachedStars.forEach(s => {
        const proj = Astronomy.projectToScreen(s.azimuth, s.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h);
        if (proj.visible) {
          const d = Math.hypot(clickX - proj.x, clickY - proj.y);
          if (d < 26) candidates.push({ object: s, dist: d, category: "Star" });
        }
      });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => a.dist - b.dist);
      const chosen = candidates[0].object;
      this.selectedObject = chosen;
      if (this.onSelectObject) {
        this.onSelectObject(chosen);
      }
    } else {
      // Clicked on empty space: dismiss inspector
      if (this.selectedObject) {
        this.selectedObject = null;
        if (this.onSelectObject) {
          this.onSelectObject(null);
        }
      }
    }
  }

  centerOnObject(obj) {
    if (!obj) return;
    this.targetAz = ((obj.azimuth % 360) + 360) % 360;
    this.targetAlt = Math.max(-90, Math.min(90, obj.altitude));
    if (this.onViewChange) {
      this.onViewChange(this.targetAz, this.targetAlt);
    }
  }

  setTelescopeMode(active) {
    this.telescopeMode = active;
    if (active) {
      this.targetFov = 24.0;
    } else {
      this.targetFov = 75.0;
    }
  }

  setObserver(lat, lon, name) {
    this.observerLat = lat;
    this.observerLon = lon;
    if (name) this.observerName = name;
    this.updateCelestialPositions();
  }

  setTime(date) {
    this.currentDate = new Date(date);
    this.updateCelestialPositions();
  }

  updateCelestialPositions() {
    const jd = Astronomy.toJulianDate(this.currentDate);

    // Update Sun
    this.cachedSun = Astronomy.calculateSun(jd);
    const sunAltAz = Astronomy.raDecToAltAz(
      this.cachedSun.ra, this.cachedSun.dec,
      this.observerLat, this.observerLon, jd
    );
    this.cachedSun.altitude = sunAltAz.altitude;
    this.cachedSun.azimuth = sunAltAz.azimuth;

    // Update Moon
    this.cachedMoon = Astronomy.calculateMoon(jd);
    const moonAltAz = Astronomy.raDecToAltAz(
      this.cachedMoon.ra, this.cachedMoon.dec,
      this.observerLat, this.observerLon, jd
    );
    this.cachedMoon.altitude = moonAltAz.altitude;
    this.cachedMoon.azimuth = moonAltAz.azimuth;

    // Update Planets
    const planets = Astronomy.calculatePlanets(jd);
    this.cachedPlanets = planets.map(p => {
      const pos = Astronomy.raDecToAltAz(p.ra, p.dec, this.observerLat, this.observerLon, jd);
      return { ...p, altitude: pos.altitude, azimuth: pos.azimuth, type: "planet" };
    });

    // Update Comets and Asteroids
    if (typeof COMET_AND_ASTEROID_CATALOG !== "undefined") {
      this.cachedCometsAndAsteroids = COMET_AND_ASTEROID_CATALOG.map(c => {
        const pos = Astronomy.raDecToAltAz(c.ra, c.dec, this.observerLat, this.observerLon, jd);
        return { ...c, altitude: pos.altitude, azimuth: pos.azimuth };
      });
    }

    // Update Bright Stars
    this.cachedStars = STAR_CATALOG.map(s => {
      const pos = Astronomy.raDecToAltAz(s.ra, s.dec, this.observerLat, this.observerLon, jd);
      return { ...s, altitude: pos.altitude, azimuth: pos.azimuth, type: "star" };
    });

    // Update Background Stars
    this.cachedBgStars = BACKGROUND_STARS.map(s => {
      const pos = Astronomy.raDecToAltAz(s.ra, s.dec, this.observerLat, this.observerLon, jd);
      return { ...s, altitude: pos.altitude, azimuth: pos.azimuth };
    });
  }

  render(timestamp) {
    // Smooth camera interpolation towards target
    if (!this.isDragging) {
      if (Math.abs(this.velocityX) > 0.001 || Math.abs(this.velocityY) > 0.001) {
        this.camAzimuth = ((this.camAzimuth + this.velocityX) % 360 + 360) % 360;
        this.camAltitude = Math.max(-90, Math.min(90, this.camAltitude + this.velocityY));
        this.velocityX *= 0.92;
        this.velocityY *= 0.92;

        if (this.onViewChange) {
          this.onViewChange(this.camAzimuth, this.camAltitude);
        }
      } else {
        // Smooth snap to target when centering
        let dAz = this.targetAz - this.camAzimuth;
        if (dAz > 180) dAz -= 360;
        if (dAz < -180) dAz += 360;
        if (Math.abs(dAz) > 0.05) {
          this.camAzimuth = ((this.camAzimuth + dAz * 0.12) % 360 + 360) % 360;
          if (this.onViewChange) this.onViewChange(this.camAzimuth, this.camAltitude);
        }
        let dAlt = this.targetAlt - this.camAltitude;
        if (Math.abs(dAlt) > 0.05) {
          this.camAltitude = Math.max(-90, Math.min(90, this.camAltitude + dAlt * 0.12));
          if (this.onViewChange) this.onViewChange(this.camAzimuth, this.camAltitude);
        }
      }
    }

    // Smooth FOV zoom
    this.fov += (this.targetFov - this.fov) * 0.12;

    const ctx = this.ctx;
    const w = this.cssWidth || window.innerWidth;
    const h = this.cssHeight || window.innerHeight;
    if (!ctx || !w || !h) return;

    // 1. Draw Deep Space Navy Sky Background
    this.renderSkyBackground(ctx, w, h);

    // 2. Draw Constellation Lines & Labels
    if (this.showConstellations) {
      this.renderConstellations(ctx, w, h);
    }

    // 3. Draw Background Twinkling Stars
    if (this.showStars) {
      this.renderBackgroundStars(ctx, w, h, timestamp);
      this.renderBrightStars(ctx, w, h, timestamp);
    }

    // 4. Draw Solar System Objects (Planets, Moon, Sun, Comets & Asteroids)
    if (this.showPlanets) {
      this.renderPlanets(ctx, w, h);
    }
    if (this.showCometsAndAsteroids) {
      this.renderCometsAndAsteroids(ctx, w, h, timestamp);
    }
    if (this.showMoon && this.cachedMoon) {
      this.renderMoon(ctx, w, h);
    }
    if (this.cachedSun) {
      this.renderSun(ctx, w, h);
    }

    // 5. Draw Horizon & Cardinal Markers
    if (this.showHorizon) {
      this.renderHorizon(ctx, w, h);
    }

    // 6. Draw Selected Object Target Highlight
    if (this.selectedObject) {
      this.renderSelectedTargetReticle(ctx, w, h, timestamp);
    }

    // 7. Draw Telescope Reticle Overlay if active
    if (this.telescopeMode) {
      this.renderTelescopeReticle(ctx, w, h);
    }
  }

  renderSkyBackground(ctx, w, h) {
    // Pitch black night sky background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    // If Sun is near horizon, calculate atmospheric twilight in soft atmospheric blue and deep navy
    const sunAlt = this.cachedSun ? this.cachedSun.altitude : -30;
    if (sunAlt > -18) {
      const twilightIntensity = Math.max(0, Math.min(1, (sunAlt + 18) / 18));
      const horizProj = Astronomy.projectToScreen(
        this.cachedSun.azimuth, 0,
        this.camAzimuth, this.camAltitude, this.fov, w, h
      );

      if (horizProj.depth > 0) {
        const glowRadius = Math.max(w, h) * 0.75;
        const grad = ctx.createRadialGradient(
          horizProj.x, horizProj.y, 10,
          horizProj.x, horizProj.y, glowRadius
        );
        grad.addColorStop(0, `rgba(180, 215, 255, ${twilightIntensity * 0.28})`);
        grad.addColorStop(0.35, `rgba(16, 44, 110, ${twilightIntensity * 0.35})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
    }
  }

  renderConstellations(ctx, w, h) {
    if (!this.cachedStars || this.cachedStars.length === 0) return;

    const starMap = {};
    this.cachedStars.forEach(s => { starMap[s.id] = s; });

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1.0;
    ctx.setLineDash([3, 4]);

    CONSTELLATION_DATA.forEach(constell => {
      let sumX = 0, sumY = 0, count = 0;

      constell.lines.forEach(pair => {
        const s1 = starMap[pair[0]];
        const s2 = starMap[pair[1]];
        if (!s1 || !s2) return;

        const p1 = Astronomy.projectToScreen(s1.azimuth, s1.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h);
        const p2 = Astronomy.projectToScreen(s2.azimuth, s2.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h);

        if (p1.visible && p2.visible) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          sumX += p1.x + p2.x;
          sumY += p1.y + p2.y;
          count += 2;
        }
      });

      // Constellation label in pure white
      if (count > 0) {
        const cx = sumX / count;
        const cy = sumY / count;
        ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.textAlign = "center";
        ctx.fillText(constell.name.toUpperCase(), cx, cy - 8);
        ctx.font = "400 9px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.fillText(constell.english, cx, cy + 5);
      }
    });

    ctx.restore();
  }

  renderBackgroundStars(ctx, w, h, timestamp) {
    if (!this.cachedBgStars) return;
    const timeSec = (timestamp || 0) * 0.001;

    for (let i = 0; i < this.cachedBgStars.length; i++) {
      const star = this.cachedBgStars[i];
      if (star.altitude < -2) continue;

      const proj = Astronomy.projectToScreen(
        star.azimuth, star.altitude,
        this.camAzimuth, this.camAltitude, this.fov, w, h
      );

      if (!proj.visible) continue;

      const twinkle = 0.75 + 0.35 * Math.sin(timeSec * star.twinkleSpeed + star.twinklePhase);
      const radius = Math.max(0.6, (4.8 - star.mag * 0.6) * twinkle);
      const alpha = Math.min(1.0, Math.max(0.2, (0.9 - star.mag * 0.1) * twinkle));

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color || "#ffffff";
      ctx.globalAlpha = alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  renderBrightStars(ctx, w, h, timestamp) {
    if (!this.cachedStars) return;
    const timeSec = (timestamp || 0) * 0.001;

    for (let i = 0; i < this.cachedStars.length; i++) {
      const star = this.cachedStars[i];
      if (star.altitude < -3) continue;

      const proj = Astronomy.projectToScreen(
        star.azimuth, star.altitude,
        this.camAzimuth, this.camAltitude, this.fov, w, h
      );

      if (!proj.visible) continue;

      const twinkle = 0.85 + 0.22 * Math.sin(timeSec * 2.3 + i * 1.7);
      const baseRadius = Math.max(1.2, 4.2 - star.mag * 0.7);
      const radius = baseRadius * twinkle;

      if (star.mag < 1.8) {
        const haloRadius = radius * 4.5;
        const haloGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, haloRadius);
        haloGrad.addColorStop(0, star.color || "rgba(255, 255, 255, 0.9)");
        haloGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.18)");
        haloGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color || "#ffffff";
      ctx.shadowColor = star.color || "#ffffff";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (star.mag < 2.2 || this.fov < 50) {
        ctx.font = "500 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(star.name, proj.x + radius + 6, proj.y + 4);

        if (this.fov < 45) {
          ctx.font = "400 9px -apple-system, BlinkMacSystemFont, 'SF Pro Text', monospace";
          ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
          ctx.fillText(`mag ${star.mag.toFixed(2)} • ${star.spec}`, proj.x + radius + 6, proj.y + 15);
        }
      }
    }
  }

  renderPlanets(ctx, w, h) {
    if (!this.cachedPlanets) return;

    this.cachedPlanets.forEach(p => {
      if (p.altitude < -3) return;

      const proj = Astronomy.projectToScreen(
        p.azimuth, p.altitude,
        this.camAzimuth, this.camAltitude, this.fov, w, h
      );

      if (!proj.visible) return;

      const radius = 4.2;

      // Clean natural planetary halo
      const grad = ctx.createRadialGradient(proj.x, proj.y, 1, proj.x, proj.y, 16);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.35, "rgba(255, 255, 255, 0.14)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 16, 0, Math.PI * 2);
      ctx.fill();

      // Natural planet disk
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      if (p.name === "Saturn" && this.fov < 45) {
        ctx.strokeStyle = "rgba(247, 227, 181, 0.75)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(proj.x, proj.y, 10, 3.5, 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pure white Apple typography
      ctx.font = "600 11.5px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(p.name, proj.x + 9, proj.y + 4);

      ctx.font = "400 9px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      ctx.fillText(`Planet • mag ${p.magnitude}`, proj.x + 9, proj.y + 15);
    });
  }

  renderCometsAndAsteroids(ctx, w, h, timestamp) {
    if (!this.cachedCometsAndAsteroids) return;

    this.cachedCometsAndAsteroids.forEach(item => {
      if (item.altitude < -3) return;

      const proj = Astronomy.projectToScreen(
        item.azimuth, item.altitude,
        this.camAzimuth, this.camAltitude, this.fov, w, h
      );

      if (!proj.visible) return;

      if (item.type === "comet") {
        // Draw comet with soft white/silver ion & dust tail pointing away from Sun
        const sunProj = this.cachedSun
          ? Astronomy.projectToScreen(this.cachedSun.azimuth, this.cachedSun.altitude, this.camAzimuth, this.camAltitude, this.fov, w, h)
          : { x: w / 2, y: h + 200 };

        let dx = proj.x - sunProj.x;
        let dy = proj.y - sunProj.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;

        const tailLengthPx = Math.max(28, (item.tailLengthDeg || 3) * (w / this.fov));

        // Soft white/silver dust tail
        const tailEnd = { x: proj.x + dx * tailLengthPx, y: proj.y + dy * tailLengthPx };
        const tailGrad = ctx.createLinearGradient(proj.x, proj.y, tailEnd.x, tailEnd.y);
        tailGrad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
        tailGrad.addColorStop(0.35, "rgba(230, 240, 255, 0.35)");
        tailGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(proj.x - dy * 3, proj.y + dx * 3);
        ctx.lineTo(tailEnd.x - dy * 10, tailEnd.y + dx * 10);
        ctx.lineTo(tailEnd.x + dy * 10, tailEnd.y - dx * 10);
        ctx.lineTo(proj.x + dy * 3, proj.y - dx * 3);
        ctx.closePath();
        ctx.fillStyle = tailGrad;
        ctx.fill();
        ctx.restore();

        // Brilliant Coma Nucleus in Pure White
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pure white typography
        ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(item.name, proj.x + 8, proj.y - 4);

        ctx.font = "400 9px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fillText(`Comet • mag ${item.mag}`, proj.x + 8, proj.y + 7);

      } else if (item.type === "meteorite" || item.type === "meteor_shower") {
        // Meteor Shower / Meteorite: radiant burst with radiating rays
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ff9f94";
        ctx.shadowColor = "#ff6347";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "rgba(255, 159, 148, 0.70)";
        ctx.lineWidth = 1;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5);
          ctx.lineTo(Math.cos(angle) * 8.5, Math.sin(angle) * 8.5);
          ctx.stroke();
        }
        ctx.restore();

        ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(item.name, proj.x + 9, proj.y - 2);

        ctx.font = "400 9px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fillText(`Meteor Shower Radiant • Peak ZHR`, proj.x + 9, proj.y + 9);

      } else {
        // Asteroid: crisp pure white diamond glyph
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-2.5, -2.5, 5, 5);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-4, -4, 8, 8);
        ctx.restore();

        ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(item.name, proj.x + 9, proj.y - 2);

        ctx.font = "400 9px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fillText(`Asteroid • mag ${item.mag}`, proj.x + 9, proj.y + 9);
      }
    });
  }

  renderMoon(ctx, w, h) {
    const moon = this.cachedMoon;
    if (!moon || moon.altitude < -4) return;

    const proj = Astronomy.projectToScreen(
      moon.azimuth, moon.altitude,
      this.camAzimuth, this.camAltitude, this.fov, w, h
    );

    if (!proj.visible) return;

    const baseR = Math.max(10, (50 / this.fov) * 12);

    // Natural soft pale lunar halo
    const glow = ctx.createRadialGradient(proj.x, proj.y, baseR * 0.8, proj.x, proj.y, baseR * 3.5);
    glow.addColorStop(0, "rgba(255, 255, 255, 0.25)");
    glow.addColorStop(0.4, "rgba(220, 235, 255, 0.08)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, baseR * 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(proj.x, proj.y, baseR, 0, Math.PI * 2);
    ctx.fillStyle = "#080808";
    ctx.fill();

    const phaseRad = moon.phaseAngle * Astronomy.DEG2RAD;
    const isWaxing = moon.phaseAngle < 180;

    ctx.save();
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, baseR, -Math.PI / 2, Math.PI / 2, !isWaxing);
    const k = Math.cos(phaseRad);
    ctx.ellipse(proj.x, proj.y, Math.abs(k) * baseR, baseR, 0, Math.PI / 2, -Math.PI / 2, (isWaxing && k < 0) || (!isWaxing && k > 0));
    ctx.fillStyle = "#f5f7fc";
    ctx.fill();
    ctx.restore();

    ctx.font = "600 12px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText("Moon", proj.x + baseR + 8, proj.y - 2);

    ctx.font = "400 9.5px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillText(`${moon.phaseName} • ${(moon.illumination * 100).toFixed(0)}%`, proj.x + baseR + 8, proj.y + 11);
  }

  renderSun(ctx, w, h) {
    const sun = this.cachedSun;
    if (!sun || sun.altitude < -12) return;

    const proj = Astronomy.projectToScreen(
      sun.azimuth, sun.altitude,
      this.camAzimuth, this.camAltitude, this.fov, w, h
    );

    if (!proj.visible) return;

    const r = Math.max(14, (50 / this.fov) * 16);

    const corona = ctx.createRadialGradient(proj.x, proj.y, r * 0.5, proj.x, proj.y, r * 6);
    corona.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    corona.addColorStop(0.25, "rgba(255, 240, 200, 0.4)");
    corona.addColorStop(0.65, "rgba(255, 220, 160, 0.1)");
    corona.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, r * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.font = "600 12px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText("Sun", proj.x + r + 10, proj.y + 4);
  }

  renderHorizon(ctx, w, h) {
    const points = [];
    for (let az = 0; az <= 360; az += 10) {
      const p = Astronomy.projectToScreen(az, 0, this.camAzimuth, this.camAltitude, this.fov, w, h);
      if (p.depth > 0) {
        points.push({ az, x: p.x, y: p.y });
      }
    }

    if (points.length > 1) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    const cardinals = [
      { text: "N", az: 0 },
      { text: "NE", az: 45 },
      { text: "E", az: 90 },
      { text: "SE", az: 135 },
      { text: "S", az: 180 },
      { text: "SW", az: 225 },
      { text: "W", az: 270 },
      { text: "NW", az: 315 }
    ];

    cardinals.forEach(c => {
      const p = Astronomy.projectToScreen(c.az, 0, this.camAzimuth, this.camAltitude, this.fov, w, h);
      if (p.visible) {
        ctx.font = c.text.length === 1
          ? "700 12px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
          : "600 10.5px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(c.text, p.x, p.y + 16);

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fill();
      }
    });
  }

  renderSelectedTargetReticle(ctx, w, h, timestamp) {
    const obj = this.selectedObject;
    if (!obj) return;

    const proj = Astronomy.projectToScreen(
      obj.azimuth, obj.altitude,
      this.camAzimuth, this.camAltitude, this.fov, w, h
    );

    if (!proj.visible) return;

    const timeSec = (timestamp || 0) * 0.001;
    const ringRadius = 18 + Math.sin(timeSec * 3) * 1.5;

    ctx.save();
    // Pure White Targeting Ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.6;
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Four corner target brackets in Pure White
    const bLen = 6;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.8;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(proj.x - ringRadius - 4, proj.y - ringRadius + bLen);
    ctx.lineTo(proj.x - ringRadius - 4, proj.y - ringRadius - 4);
    ctx.lineTo(proj.x - ringRadius + bLen, proj.y - ringRadius - 4);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(proj.x + ringRadius + 4, proj.y - ringRadius + bLen);
    ctx.lineTo(proj.x + ringRadius + 4, proj.y - ringRadius - 4);
    ctx.lineTo(proj.x + ringRadius - bLen, proj.y - ringRadius - 4);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(proj.x - ringRadius - 4, proj.y + ringRadius - bLen);
    ctx.lineTo(proj.x - ringRadius - 4, proj.y + ringRadius + 4);
    ctx.lineTo(proj.x - ringRadius + bLen, proj.y + ringRadius + 4);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(proj.x + ringRadius + 4, proj.y + ringRadius - bLen);
    ctx.lineTo(proj.x + ringRadius + 4, proj.y + ringRadius + 4);
    ctx.lineTo(proj.x + ringRadius - bLen, proj.y + ringRadius + 4);
    ctx.stroke();

    ctx.restore();
  }

  renderTelescopeReticle(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(w, h) * 0.44;

    ctx.save();

    // Pitch black mask outside circular field-of-view
    ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2, true);
    ctx.fill();

    // Pure White barrel bezel
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1.0;

    // Horizontal
    ctx.beginPath();
    ctx.moveTo(cx - outerR, cy);
    ctx.lineTo(cx - 18, cy);
    ctx.moveTo(cx + 18, cy);
    ctx.lineTo(cx + outerR, cy);
    ctx.stroke();

    // Vertical
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    ctx.lineTo(cx, cy - 18);
    ctx.moveTo(cx, cy + 18);
    ctx.lineTo(cx, cy + outerR);
    ctx.stroke();

    // Center targeting ring in Pure White
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Mil-dot tick marks along reticle
    for (let d = 40; d < outerR; d += 40) {
      ctx.beginPath();
      ctx.moveTo(cx + d, cy - 4);
      ctx.lineTo(cx + d, cy + 4);
      ctx.moveTo(cx - d, cy - 4);
      ctx.lineTo(cx - d, cy + 4);
      ctx.moveTo(cx - 4, cy + d);
      ctx.lineTo(cx + 4, cy + d);
      ctx.moveTo(cx - 4, cy - d);
      ctx.lineTo(cx + 4, cy - d);
      ctx.stroke();
    }

    ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText("TELESCOPE FOV: 24.0° • MAGNIFICATION 3.5×", cx - outerR + 24, cy - outerR + 32);

    ctx.restore();
  }
}
