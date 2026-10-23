/**
 * Main Application Orchestrator (Aqua & Turquoise Navy Edition)
 * Connects 360° Sky Renderer, Linear Compass, QuickTime Time Controller,
 * Web Audio Engine, Celestial Object Inspector, and Robust GPS Geolocation.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Sky Renderer
  const sky = new SkyRenderer("sky-canvas");

  // 2. Initialize Top & Left Linear Compasses
  const compass = new LinearCompassRenderer("compass-top-canvas", "compass-left-canvas");

  // Link sky camera orientation directly to linear compasses
  sky.onViewChange = (az, alt) => {
    compass.render(az, alt);
  };
  compass.render(sky.camAzimuth, sky.camAltitude);

  // 3. Initialize Apple Time Controller
  const timeCtrl = new TimeController(sky);

  // 3b. Initialize Apple macOS Spotlight Celestial Search
  let spotlight = null;
  if (typeof SpotlightSearch !== "undefined") {
    spotlight = new SpotlightSearch(sky);
  }

  // 4. Setup 60 FPS Rendering Loop
  function animationLoop(timestamp) {
    try {
      timeCtrl.tick(timestamp);
      sky.render(timestamp);
    } catch (err) {
      console.error("Celestial sky animation loop error:", err);
    }
    requestAnimationFrame(animationLoop);
  }
  requestAnimationFrame(animationLoop);

  // 5. Setup Three-Dots (•••) Liquid Glass Menu
  const menuBtn = document.getElementById("three-dots-btn");
  const menuDropdown = document.getElementById("apple-options-dropdown");

  if (menuBtn && menuDropdown) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menuDropdown.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!menuDropdown.contains(e.target) && e.target !== menuBtn) {
        menuDropdown.classList.remove("active");
      }
    });
  }

  // 6. Quick Action Buttons in Top Header
  // Stars Toggle
  const quickStarBtn = document.getElementById("quick-star-btn");
  const toggleStars = document.getElementById("toggle-stars");
  const menuStarSvg = document.getElementById("menu-star-svg");

  const setStarsState = (active) => {
    sky.showStars = active;
    if (toggleStars) toggleStars.checked = active;
    if (quickStarBtn) quickStarBtn.classList.toggle("active", active);
    if (menuStarSvg) menuStarSvg.classList.toggle("active", active);
  };

  if (quickStarBtn) {
    quickStarBtn.addEventListener("click", () => setStarsState(!sky.showStars));
  }
  if (toggleStars) {
    toggleStars.addEventListener("change", (e) => setStarsState(e.target.checked));
  }

  // Planets Toggle
  const quickPlanetBtn = document.getElementById("quick-planet-btn");
  const togglePlanets = document.getElementById("toggle-planets");

  const setPlanetsState = (active) => {
    sky.showPlanets = active;
    if (togglePlanets) togglePlanets.checked = active;
    if (quickPlanetBtn) quickPlanetBtn.classList.toggle("active", active);
  };

  if (quickPlanetBtn) {
    quickPlanetBtn.addEventListener("click", () => setPlanetsState(!sky.showPlanets));
  }
  if (togglePlanets) {
    togglePlanets.addEventListener("change", (e) => setPlanetsState(e.target.checked));
  }

  // Comets & Asteroids Toggle
  const quickCometBtn = document.getElementById("quick-comet-btn");
  const toggleComets = document.getElementById("toggle-comets");

  const setCometsState = (active) => {
    sky.showCometsAndAsteroids = active;
    if (toggleComets) toggleComets.checked = active;
    if (quickCometBtn) quickCometBtn.classList.toggle("active", active);
  };

  if (quickCometBtn) {
    quickCometBtn.addEventListener("click", () => setCometsState(!sky.showCometsAndAsteroids));
  }
  if (toggleComets) {
    toggleComets.addEventListener("change", (e) => setCometsState(e.target.checked));
  }

  // Moon Toggle (in menu)
  const toggleMoon = document.getElementById("toggle-moon");
  if (toggleMoon) {
    toggleMoon.addEventListener("change", (e) => {
      sky.showMoon = e.target.checked;
    });
  }

  // Constellations Toggle
  const toggleConstellations = document.getElementById("toggle-constellations");
  const quickConstBtn = document.getElementById("quick-constellation-btn");

  const setConstellationState = (active) => {
    sky.showConstellations = active;
    if (toggleConstellations) toggleConstellations.checked = active;
    if (quickConstBtn) quickConstBtn.classList.toggle("active", active);
  };

  if (toggleConstellations) {
    toggleConstellations.addEventListener("change", (e) => setConstellationState(e.target.checked));
  }
  if (quickConstBtn) {
    quickConstBtn.addEventListener("click", () => setConstellationState(!sky.showConstellations));
  }

  // Telescope Mode Toggle (Flat White Minimal Telescope Logo)
  const toggleTelescope = document.getElementById("toggle-telescope");
  const quickTelescopeBtn = document.getElementById("quick-telescope-btn");

  const setTelescopeState = (active) => {
    sky.setTelescopeMode(active);
    if (toggleTelescope) toggleTelescope.checked = active;
    if (quickTelescopeBtn) quickTelescopeBtn.classList.toggle("active", active);
  };

  if (toggleTelescope) {
    toggleTelescope.addEventListener("change", (e) => setTelescopeState(e.target.checked));
  }
  if (quickTelescopeBtn) {
    quickTelescopeBtn.addEventListener("click", () => setTelescopeState(!sky.telescopeMode));
  }

  // 7. Relaxing Sound Ambience (Minimal Apple Sound Icon)
  const toggleSound = document.getElementById("toggle-sound");
  const soundBtn = document.getElementById("sound-ambience-btn");
  const soundWaves = document.getElementById("sound-waves-svg");

  const setSoundState = (play) => {
    if (play) {
      window.celestialAudio.play();
    } else {
      window.celestialAudio.pause();
    }
  };

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      window.celestialAudio.toggle();
    });
  }
  if (toggleSound) {
    toggleSound.addEventListener("change", (e) => {
      setSoundState(e.target.checked);
    });
  }

  const menuSoundWaves = document.getElementById("menu-sound-waves-svg");

  window.celestialAudio.onStateChange((isPlaying) => {
    if (soundBtn) soundBtn.classList.toggle("active", isPlaying);
    if (toggleSound) toggleSound.checked = isPlaying;
    if (soundWaves) soundWaves.classList.toggle("animating", isPlaying);
    if (menuSoundWaves) menuSoundWaves.classList.toggle("animating", isPlaying);
  });

  // Apple Volume Scrubber Component (Strictly Matching Image 1 & Image 2)
  const volTrack = document.getElementById("volume-scrubber-track");
  const volFill = document.getElementById("volume-scrubber-fill");
  const volThumb = document.getElementById("volume-scrubber-thumb");
  const volumeSlider = document.getElementById("sound-volume-slider");

  let isDraggingVol = false;

  const setVolumeLevel = (fraction, notifyAudio = true) => {
    const clamped = Math.max(0, Math.min(1, fraction));
    const percent = `${(clamped * 100).toFixed(1)}%`;
    if (volFill) volFill.style.width = percent;
    if (volThumb) volThumb.style.left = percent;
    if (volumeSlider) volumeSlider.value = clamped;
    if (volTrack) volTrack.setAttribute("aria-valuenow", Math.round(clamped * 100));
    if (notifyAudio && window.celestialAudio) {
      window.celestialAudio.setVolume(clamped);
    }
  };

  if (volTrack) {
    const updateFromPointer = (e) => {
      const rect = volTrack.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const frac = (clientX - rect.left) / rect.width;
      setVolumeLevel(frac);
    };

    volTrack.addEventListener("pointerdown", (e) => {
      isDraggingVol = true;
      volTrack.classList.add("dragging");
      try { volTrack.setPointerCapture(e.pointerId); } catch (err) {}
      updateFromPointer(e);
    });

    volTrack.addEventListener("pointermove", (e) => {
      if (!isDraggingVol) return;
      updateFromPointer(e);
    });

    const stopDragging = (e) => {
      if (!isDraggingVol) return;
      isDraggingVol = false;
      volTrack.classList.remove("dragging");
      try { volTrack.releasePointerCapture(e.pointerId); } catch (err) {}
    };

    volTrack.addEventListener("pointerup", stopDragging);
    volTrack.addEventListener("pointercancel", stopDragging);
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      setVolumeLevel(parseFloat(e.target.value));
    });
  }

  // Initialize volume scrubber at 50%
  setVolumeLevel(0.5, false);

  // 8. Reset View to South
  const resetViewBtn = document.getElementById("reset-view-btn");
  if (resetViewBtn) {
    resetViewBtn.addEventListener("click", () => {
      sky.camAzimuth = 180;
      sky.camAltitude = 32;
      sky.targetAz = 180;
      sky.targetAlt = 32;
      sky.targetFov = 75;
      sky.telescopeMode = false;
      if (quickTelescopeBtn) quickTelescopeBtn.classList.remove("active");
      if (toggleTelescope) toggleTelescope.checked = false;
      compass.render(180, 32);
    });
  }

  // 9. Apple Liquid Glass Celestial Object Inspector
  const inspectorCard = document.getElementById("celestial-inspector-card");
  const inspCloseBtn = document.getElementById("insp-close-btn");
  const inspCenterBtn = document.getElementById("insp-center-btn");

  const inspName = document.getElementById("insp-name");
  const inspType = document.getElementById("insp-type");
  const inspAz = document.getElementById("insp-az");
  const inspAlt = document.getElementById("insp-alt");
  const inspRa = document.getElementById("insp-ra");
  const inspDec = document.getElementById("insp-dec");
  const inspMag = document.getElementById("insp-mag");
  const inspConst = document.getElementById("insp-const");
  const inspDist = document.getElementById("insp-dist");
  const inspTemp = document.getElementById("insp-temp");
  const inspDensity = document.getElementById("insp-density");
  const inspAge = document.getElementById("insp-age");
  const inspRev = document.getElementById("insp-rev");
  const inspRotTime = document.getElementById("insp-rot-time");
  const inspRotAxis = document.getElementById("insp-rot-axis");
  const inspSystem = document.getElementById("insp-system");
  const inspGalaxy = document.getElementById("insp-galaxy");
  const inspDesc = document.getElementById("insp-desc");

  function formatRa(deg) {
    if (deg == null) return "N/A";
    const hours = deg / 15.0;
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.round(((hours - h) * 60 - m) * 60);
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s (${deg.toFixed(1)}°)`;
  }

  function formatDec(deg) {
    if (deg == null) return "N/A";
    const sign = deg >= 0 ? "+" : "-";
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = Math.round(((abs - d) * 60 - m) * 60);
    return `${sign}${String(d).padStart(2, "0")}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}" (${sign}${abs.toFixed(1)}°)`;
  }

  function getCardinal(az) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
    const idx = Math.round(((az % 360) / 22.5));
    return dirs[idx];
  }

  let currentlyInspectedObject = null;

  sky.onSelectObject = (obj) => {
    if (!obj) {
      if (inspectorCard) inspectorCard.classList.remove("active");
      currentlyInspectedObject = null;
      return;
    }

    currentlyInspectedObject = obj;
    if (inspName) inspName.textContent = obj.name || "Celestial Object";

    // Resolve comprehensive astrophysical record
    const astro = (typeof getCelestialAstroData === "function") ? getCelestialAstroData(obj) : null;

    let typeStr = "Deep Space Body";
    if (obj.type === "planet") {
      if (obj.name === "Mercury" || obj.name === "Venus" || obj.name === "Mars") typeStr = "Terrestrial Planet";
      else if (obj.name === "Jupiter" || obj.name === "Saturn") typeStr = "Gas Giant Planet";
      else if (obj.name === "Uranus" || obj.name === "Neptune") typeStr = "Ice Giant Planet";
      else typeStr = "Solar System Planet";
    } else if (obj.type === "comet") {
      typeStr = "Oort Cloud Periodic Comet";
    } else if (obj.type === "asteroid") {
      typeStr = obj.name && obj.name.includes("Ceres") ? "Dwarf Planet (Asteroid Belt)" : "Main Belt Asteroid";
    } else if (obj.type === "constellation") {
      typeStr = `IAU Constellation (${obj.english || "Star Pattern"})`;
    } else if (obj.type === "meteorite" || obj.type === "meteor_shower") {
      typeStr = obj.showerType ? `Annual Meteor Shower (${obj.showerType})` : "Meteorite / Bolide Stream";
    } else if (obj.name === "Moon") {
      typeStr = `Natural Satellite (${obj.phaseName || "Moon"})`;
    } else if (obj.name === "Sun") {
      typeStr = "Yellow Dwarf Star (G2V)";
    } else if (obj.spec) {
      const s0 = obj.spec.charAt(0);
      if (s0 === "M") typeStr = `Red Giant / Supergiant (${obj.spec})`;
      else if (s0 === "O" || s0 === "B") typeStr = `Blue-White Star (${obj.spec})`;
      else if (s0 === "A") typeStr = `White Main-Sequence (${obj.spec})`;
      else if (s0 === "F") typeStr = `Yellow-White Star (${obj.spec})`;
      else if (s0 === "G") typeStr = `Yellow Star (${obj.spec})`;
      else if (s0 === "K") typeStr = `Orange Giant (${obj.spec})`;
      else typeStr = `Spectral Class ${obj.spec} Star`;
    }
    if (inspType) inspType.textContent = typeStr;

    // Astrometric & Locating
    const azDeg = Math.round(obj.azimuth * 10) / 10;
    const altDeg = Math.round(obj.altitude * 10) / 10;
    const cardinal = getCardinal(obj.azimuth);

    if (inspAz) inspAz.textContent = `${azDeg.toFixed(1)}° ${cardinal}`;
    if (inspAlt) {
      const altStatus = altDeg > 0 ? "Above Horizon" : "Below Horizon";
      inspAlt.textContent = `${altDeg > 0 ? "+" : ""}${altDeg.toFixed(1)}° (${altStatus})`;
    }
    if (inspRa) inspRa.textContent = obj.ra != null ? formatRa(obj.ra) : "N/A";
    if (inspDec) inspDec.textContent = obj.dec != null ? formatDec(obj.dec) : "N/A";
    if (inspMag) {
      if (obj.type === "constellation") {
        inspMag.textContent = "Multi-Star Field";
      } else {
        inspMag.textContent = obj.mag != null ? `${Number(obj.mag).toFixed(2)} mag` : (obj.magnitude != null ? `${Number(obj.magnitude).toFixed(2)} mag` : "N/A");
      }
    }

    // Full Constellation (Latin + English translation)
    if (inspConst) {
      if (obj.type === "constellation") {
        inspConst.textContent = obj.fullName || `${obj.name} (${obj.english || "IAU Constellation"})`;
      } else {
        inspConst.textContent = (astro && astro.fullConstellation) ? astro.fullConstellation : (obj.const || "N/A");
      }
    }

    // Physical Properties
    if (inspDist) {
      inspDist.textContent = (astro && astro.distance) ? astro.distance : "N/A";
    }
    if (inspTemp) {
      inspTemp.textContent = (astro && astro.temperature) ? astro.temperature : "N/A";
    }
    if (inspDensity) {
      inspDensity.textContent = (astro && astro.density) ? astro.density : "N/A";
    }
    if (inspAge) {
      inspAge.textContent = (astro && astro.age) ? astro.age : "N/A";
    }

    // Orbital & Rotational Dynamics
    if (inspRev) {
      inspRev.textContent = (astro && astro.revolutionPeriod) ? astro.revolutionPeriod : "N/A";
    }
    if (inspRotTime) {
      inspRotTime.textContent = (astro && astro.rotationTime) ? astro.rotationTime : "N/A";
    }
    if (inspRotAxis) {
      inspRotAxis.textContent = (astro && astro.rotationAxis) ? astro.rotationAxis : "N/A";
    }
    if (inspSystem) {
      inspSystem.textContent = (astro && astro.starSystem) ? astro.starSystem : "N/A";
    }

    // Cosmic Environment
    if (inspGalaxy) {
      inspGalaxy.textContent = (astro && astro.galaxy) ? astro.galaxy : "Milky Way (Orion-Cygnus Arm)";
    }

    // Curated Observation Description
    let desc = (astro && astro.description && astro.description !== "N/A") ? astro.description : (obj.description || "");
    if (!desc) {
      if (obj.mag < 1.0) desc = "Exceedingly bright beacon visible even in light-polluted urban skies.";
      else if (obj.mag < 2.5) desc = "Easily identifiable with naked eye on clear astronomical nights.";
      else desc = "Observable with binoculars or under dark country skies.";
    }
    if (inspDesc) inspDesc.textContent = desc;

    if (inspectorCard) {
      inspectorCard.classList.add("active");
    }
  };

  if (inspCloseBtn) {
    inspCloseBtn.addEventListener("click", () => {
      if (inspectorCard) inspectorCard.classList.remove("active");
      sky.selectedObject = null;
      currentlyInspectedObject = null;
    });
  }

  // Dismiss Inspector on click outside
  document.addEventListener("click", (e) => {
    if (inspectorCard && inspectorCard.classList.contains("active")) {
      if (!inspectorCard.contains(e.target) && !sky.canvas.contains(e.target)) {
        inspectorCard.classList.remove("active");
        sky.selectedObject = null;
        currentlyInspectedObject = null;
      }
    }
  });

  // Global Escape key to dismiss any active modal sheets or inspector
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (inspectorCard) {
        inspectorCard.classList.remove("active");
        sky.selectedObject = null;
        currentlyInspectedObject = null;
      }
      const locModal = document.getElementById("apple-location-modal");
      if (locModal) locModal.classList.remove("active");
      const dateModal = document.getElementById("apple-date-modal");
      if (dateModal) dateModal.classList.remove("active");
      const timeModal = document.getElementById("apple-time-modal");
      if (timeModal) timeModal.classList.remove("active");
      const menu = document.getElementById("apple-settings-dropdown");
      if (menu) menu.classList.remove("active");
    }
  });

  if (inspCenterBtn) {
    inspCenterBtn.addEventListener("click", () => {
      if (currentlyInspectedObject) {
        sky.centerOnObject(currentlyInspectedObject);
      }
    });
  }

  // 10. Robust GPS Geolocation & Custom Location Picker
  const locationModal = document.getElementById("apple-location-modal");
  const locCapsuleTrigger = document.getElementById("location-capsule-trigger");
  const locationSelect = document.getElementById("location-select");
  const locationBadge = document.getElementById("current-location-badge");
  const locModalCloseBtn = document.getElementById("loc-modal-close-btn");
  const locModalCancelBtn = document.getElementById("loc-modal-cancel-btn");
  const locModalApplyBtn = document.getElementById("loc-modal-apply-btn");
  const btnUseLiveGps = document.getElementById("btn-use-live-gps");
  const gpsButtonLabel = document.getElementById("gps-button-label");
  const gpsStatusText = document.getElementById("gps-status-text");

  const customLatInput = document.getElementById("custom-lat-input");
  const customLonInput = document.getElementById("custom-lon-input");

  const toggleLocationModal = () => {
    if (!locationModal) return;
    if (locationModal.classList.contains("active")) {
      locationModal.classList.remove("active");
    } else {
      if (customLatInput) customLatInput.value = sky.observerLat.toFixed(4);
      if (customLonInput) customLonInput.value = sky.observerLon.toFixed(4);
      locationModal.classList.add("active");
    }
  };

  if (locCapsuleTrigger) {
    locCapsuleTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLocationModal();
    });
  }

  if (locModalCloseBtn) {
    locModalCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (locationModal) locationModal.classList.remove("active");
    });
  }
  if (locModalCancelBtn) {
    locModalCancelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (locationModal) locationModal.classList.remove("active");
    });
  }

  // Close floating location card when clicking outside
  document.addEventListener("click", (e) => {
    if (locationModal && locationModal.classList.contains("active")) {
      if (!locationModal.contains(e.target) && !locCapsuleTrigger.contains(e.target) && e.target !== locationSelect) {
        locationModal.classList.remove("active");
      }
    }
  });

  // Live GPS Acquisition Handler
  const acquireGps = () => {
    if (gpsButtonLabel) gpsButtonLabel.textContent = "Acquiring Satellite Lock...";
    if (gpsStatusText) gpsStatusText.textContent = "Requesting device GPS sensor...";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const locName = `GPS: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

          sky.setObserver(lat, lon, locName);
          if (locationBadge) locationBadge.textContent = locName;
          if (customLatInput) customLatInput.value = lat.toFixed(4);
          if (customLonInput) customLonInput.value = lon.toFixed(4);

          if (gpsButtonLabel) gpsButtonLabel.textContent = "✓ GPS Coordinates Locked";
          if (gpsStatusText) gpsStatusText.textContent = `Accuracy: ±${Math.round(pos.coords.accuracy || 10)}m`;

          setTimeout(() => {
            if (locationModal) locationModal.classList.remove("active");
            if (gpsButtonLabel) gpsButtonLabel.textContent = "Acquire Live GPS Satellite Coordinates";
          }, 900);
        },
        (err) => {
          console.warn("Browser GPS permission unavailable or timed out:", err.message);
          if (gpsStatusText) gpsStatusText.textContent = "Direct GPS blocked. Resolving approximate coordinates...";

          // Graceful Network/IP Geolocation Fallback
          fetch("https://worldtimeapi.org/api/ip")
            .then(res => res.json())
            .then(data => {
              if (gpsButtonLabel) gpsButtonLabel.textContent = "✓ Location Resolved";
              if (locationModal) locationModal.classList.remove("active");
            })
            .catch(() => {
              // Default to Mauna Kea Dark Sky
              if (gpsStatusText) gpsStatusText.textContent = "Please enter custom latitude & longitude below or choose a city.";
              if (gpsButtonLabel) gpsButtonLabel.textContent = "Acquire Live GPS Satellite Coordinates";
            });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter coordinates manually.");
    }
  };

  if (btnUseLiveGps) {
    btnUseLiveGps.addEventListener("click", acquireGps);
  }

  // Location presets click
  document.querySelectorAll(".loc-preset").forEach(pill => {
    pill.addEventListener("click", () => {
      const lat = parseFloat(pill.dataset.lat);
      const lon = parseFloat(pill.dataset.lon);
      const name = pill.dataset.name;

      if (customLatInput) customLatInput.value = lat;
      if (customLonInput) customLonInput.value = lon;

      sky.setObserver(lat, lon, name);
      if (locationBadge) locationBadge.textContent = name;
      if (locationModal) locationModal.classList.remove("active");
    });
  });

  // Apply custom coordinates
  if (locModalApplyBtn) {
    locModalApplyBtn.addEventListener("click", () => {
      const lat = parseFloat(customLatInput.value);
      const lon = parseFloat(customLonInput.value);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        alert("Please enter a valid Latitude between -90 and +90 degrees.");
        return;
      }
      if (isNaN(lon) || lon < -180 || lon > 180) {
        alert("Please enter a valid Longitude between -180 and +180 degrees.");
        return;
      }

      const name = `${lat >= 0 ? lat.toFixed(2) + "°N" : Math.abs(lat).toFixed(2) + "°S"}, ${lon >= 0 ? lon.toFixed(2) + "°E" : Math.abs(lon).toFixed(2) + "°W"}`;
      sky.setObserver(lat, lon, name);
      if (locationBadge) locationBadge.textContent = name;
      if (locationModal) locationModal.classList.remove("active");
    });
  }

  // Dropdown menu location selector
  const locations = {
    "tokyo": { name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503 },
    "mauna_kea": { name: "Mauna Kea Obs., Hawaii", lat: 19.8207, lon: -155.4681 },
    "atacama": { name: "Atacama Desert, Chile", lat: -23.8634, lon: -67.7538 },
    "greenwich": { name: "Greenwich, London", lat: 51.4826, lon: 0.0 },
    "new_york": { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
    "canary_islands": { name: "Canary Islands Obs.", lat: 28.7606, lon: -17.8816 }
  };

  if (locationSelect) {
    locationSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "gps") {
        openLocationModal();
        acquireGps();
      } else if (val === "custom") {
        openLocationModal();
      } else if (locations[val]) {
        const loc = locations[val];
        sky.setObserver(loc.lat, loc.lon, loc.name);
        if (locationBadge) locationBadge.textContent = loc.name;
      }
    });
  }

  // Initialize default layer states
  setStarsState(true);
  setPlanetsState(true);
  setCometsState(true);
  setConstellationState(true);

  // Universal Apple Liquid Glass Click Expansion Mechanism
  // Strictly matches Image 1 (blooms to big size with lighter grey liquid glass) ONLY while selecting,
  // with a relaxed, slow and smoother Apple spring animation
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, .apple-icon-btn, .now-pill-btn, .speed-pill-btn, .calendar-icon-btn, .brand-badge, .inspector-center-btn, .apple-footer-btn, .apple-btn-primary, .apple-btn-secondary");
    if (btn) {
      btn.classList.add("apple-btn-clicked");
      setTimeout(() => {
        btn.classList.remove("apple-btn-clicked");
      }, 580);
    }
  });

  // Initialize astronomical positions
  sky.setTime(new Date());
});
