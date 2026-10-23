/**
 * Apple-Grade Time Controller & Timeline Scrubber
 * Features QuickTime-style glass play bar, real-time astronomical time warping,
 * zero-lag scrubber thumb synchronization, and Apple Cupertino date/time picker.
 */

class TimeController {
  constructor(skyRenderer) {
    this.sky = skyRenderer;

    // Time tracking
    this.simulatedTime = new Date();
    this.isRealtime = true;
    this.isPlaying = true;
    this.timeScale = 1.0; // 1x = real time (1 sec/sec)

    // Last animation frame timestamp
    this.lastFrameTime = performance.now();

    // DOM Elements
    this.playBtn = document.getElementById("play-pause-btn");
    this.nowBtn = document.getElementById("now-btn");
    this.speedBtn = document.getElementById("speed-btn");
    this.timeDisplay = document.getElementById("current-time-readout");
    this.dateDisplay = document.getElementById("current-date-readout");

    this.scrubberTrack = document.getElementById("timeline-track");
    this.scrubberFill = document.getElementById("timeline-fill");
    this.scrubberThumb = document.getElementById("timeline-thumb");
    this.datePickerModal = document.getElementById("apple-date-modal");
    this.datePickerBtn = document.getElementById("date-picker-open-btn");
    this.timePickerModal = document.getElementById("apple-time-modal");
    this.timePickerBtn = document.getElementById("time-picker-open-btn");
    this.locationCapsule = document.getElementById("location-capsule-trigger");

    this.isScrubbing = false;

    this.init();
  }

  init() {
    this.setupTimelineInteractions();
    this.setupPlaybackControls();
    this.setupDatePickerModal();
    this.sky.setTime(this.simulatedTime);
    this.updateDisplay(this.simulatedTime);
  }

  setupTimelineInteractions() {
    if (!this.scrubberTrack || !this.scrubberThumb) return;

    // Compute fraction of the current day (0.0 to 1.0)
    const updateScrubberFromTime = () => {
      if (this.isScrubbing) return;
      const hours = this.simulatedTime.getHours() +
                    this.simulatedTime.getMinutes() / 60.0 +
                    this.simulatedTime.getSeconds() / 3600.0;
      const pct = hours / 24.0;
      this.setThumbPosition(pct);
    };

    this.updateScrubberFromTime = updateScrubberFromTime;

    const handlePointerMove = (clientX) => {
      const rect = this.scrubberTrack.getBoundingClientRect();
      const rawPct = (clientX - rect.left) / rect.width;
      const pct = Math.max(0, Math.min(1, rawPct));

      // Strictly stick thumb with pointer without lag
      this.setThumbPosition(pct);

      // Convert pct to hours/minutes/seconds of the current day
      const totalSecondsInDay = pct * 86400;
      const hours = Math.floor(totalSecondsInDay / 3600);
      const minutes = Math.floor((totalSecondsInDay % 3600) / 60);
      const seconds = Math.floor(totalSecondsInDay % 60);

      this.simulatedTime.setHours(hours, minutes, seconds);
      this.isRealtime = false;

      this.sky.setTime(this.simulatedTime);
      this.updateDisplay(this.simulatedTime);
    };

    // Pointer Events for immediate 1:1 responsive stickiness
    this.scrubberTrack.addEventListener("pointerdown", (e) => {
      this.isScrubbing = true;
      this.scrubberThumb.classList.add("dragging");
      this.scrubberTrack.setPointerCapture(e.pointerId);
      handlePointerMove(e.clientX);
    });

    this.scrubberTrack.addEventListener("pointermove", (e) => {
      if (!this.isScrubbing) return;
      handlePointerMove(e.clientX);
    });

    const stopScrubbing = (e) => {
      if (!this.isScrubbing) return;
      this.isScrubbing = false;
      this.scrubberThumb.classList.remove("dragging");
      try {
        this.scrubberTrack.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    this.scrubberTrack.addEventListener("pointerup", stopScrubbing);
    this.scrubberTrack.addEventListener("pointercancel", stopScrubbing);
  }

  setThumbPosition(pct) {
    const percentStr = (pct * 100).toFixed(3) + "%";
    this.scrubberFill.style.width = percentStr;
    this.scrubberThumb.style.left = percentStr;
  }

  setupPlaybackControls() {
    // Play/Pause
    if (this.playBtn) {
      this.playBtn.addEventListener("click", () => {
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
      });
    }

    // "Now" button - snap back to real-time
    if (this.nowBtn) {
      this.nowBtn.addEventListener("click", () => {
        this.simulatedTime = new Date();
        this.isRealtime = true;
        this.timeScale = 1.0;
        this.isPlaying = true;
        this.updatePlayButton();
        this.updateSpeedButton();
        this.sky.setTime(this.simulatedTime);
        this.updateDisplay(this.simulatedTime);
        this.updateScrubberFromTime();
      });
    }

    // Speed warp button
    const speeds = [1, 10, 60, 3600, 86400]; // 1x, 10x, 1min/s, 1hr/s, 1day/s
    let speedIndex = 0;

    if (this.speedBtn) {
      this.speedBtn.addEventListener("click", () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        this.timeScale = speeds[speedIndex];
        this.isRealtime = (this.timeScale === 1.0);
        this.updateSpeedButton();
      });
    }
  }

  updatePlayButton() {
    if (!this.playBtn) return;
    const playIcon = this.playBtn.querySelector(".icon-play");
    const pauseIcon = this.playBtn.querySelector(".icon-pause");
    if (this.isPlaying) {
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "block";
    } else {
      if (playIcon) playIcon.style.display = "block";
      if (pauseIcon) pauseIcon.style.display = "none";
    }
  }

  updateSpeedButton() {
    if (!this.speedBtn) return;
    let label = "1×";
    if (this.timeScale === 10) label = "10×";
    else if (this.timeScale === 60) label = "60×";
    else if (this.timeScale === 3600) label = "3600×";
    else if (this.timeScale === 86400) label = "86400×";
    this.speedBtn.textContent = label;
    this.speedBtn.title = `Playback Speed: ${label} (Click to cycle speed)`;
  }

  setupDatePickerModal() {
    // Subtitle formatting (Full Month Name matching Apple Photo)
    const dateSubtitleEl = document.getElementById("date-modal-subtitle");
    const timeSubtitleEl = document.getElementById("time-modal-subtitle");
    const dateTimePreviewEl = document.getElementById("date-card-time-preview");
    const timeDatePreviewEl = document.getElementById("time-card-date-preview");

    const updateDateSubtitle = (date) => {
      const opts = { month: "long", day: "numeric", year: "numeric" };
      const formatted = date.toLocaleDateString("en-US", opts);
      if (dateSubtitleEl) dateSubtitleEl.textContent = formatted;
      if (timeDatePreviewEl) timeDatePreviewEl.textContent = formatted;
    };

    const updateTimeSubtitle = (date) => {
      const h = String(date.getHours()).padStart(2, "0");
      const m = String(date.getMinutes()).padStart(2, "0");
      const s = String(date.getSeconds()).padStart(2, "0");
      const formatted = `${h}:${m}:${s} Local Time`;
      if (timeSubtitleEl) timeSubtitleEl.textContent = formatted;
      if (dateTimePreviewEl) dateTimePreviewEl.textContent = `${h}:${m}:${s} Local`;
    };

    // 1. Initialize Cupertino Date Drumroll Picker (Month, Day, Year)
    const dateDrumrollContainer = document.getElementById("apple-date-drumroll-container");
    if (dateDrumrollContainer && typeof AppleDrumrollPicker !== "undefined") {
      this.dateDrumroll = new AppleDrumrollPicker({
        mode: "date",
        container: dateDrumrollContainer,
        idPrefix: "date-col-",
        initialDate: this.simulatedTime,
        onDateChange: (newDate) => {
          this.simulatedTime = new Date(newDate);
          this.isRealtime = false;
          this.sky.setTime(this.simulatedTime);
          this.updateDisplay(this.simulatedTime);
          this.updateScrubberFromTime();
          updateDateSubtitle(this.simulatedTime);
          if (this.timeDrumroll) {
            this.timeDrumroll.setDate(this.simulatedTime, false, false);
          }
        }
      });
    }

    // 2. Initialize Cupertino Time Drumroll Picker (Hour, Minute, Second)
    const timeDrumrollContainer = document.getElementById("apple-time-drumroll-container");
    if (timeDrumrollContainer && typeof AppleDrumrollPicker !== "undefined") {
      this.timeDrumroll = new AppleDrumrollPicker({
        mode: "time",
        container: timeDrumrollContainer,
        idPrefix: "time-col-",
        initialDate: this.simulatedTime,
        onDateChange: (newDate) => {
          this.simulatedTime = new Date(newDate);
          this.isRealtime = false;
          this.sky.setTime(this.simulatedTime);
          this.updateDisplay(this.simulatedTime);
          this.updateScrubberFromTime();
          updateTimeSubtitle(this.simulatedTime);
          if (this.dateDrumroll) {
            this.dateDrumroll.setDate(this.simulatedTime, false, false);
          }
        }
      });
    }

    // Toggle Date Sheet (clicking icon or readout closes if open, opens if closed)
    const toggleDateModal = () => {
      if (!this.datePickerModal) return;
      if (this.datePickerModal.classList.contains("active")) {
        this.datePickerModal.classList.remove("active");
      } else {
        if (this.timePickerModal) this.timePickerModal.classList.remove("active");
        this.savedDateSnapshot = new Date(this.simulatedTime);
        if (this.dateDrumroll) {
          this.dateDrumroll.setDate(this.simulatedTime, false, false);
        }
        updateDateSubtitle(this.simulatedTime);
        this.datePickerModal.classList.add("active");
      }
    };

    // Toggle Time Sheet (clicking clock icon or readout closes if open, opens if closed)
    const toggleTimeModal = () => {
      if (!this.timePickerModal) return;
      if (this.timePickerModal.classList.contains("active")) {
        this.timePickerModal.classList.remove("active");
      } else {
        if (this.datePickerModal) this.datePickerModal.classList.remove("active");
        this.savedDateSnapshot = new Date(this.simulatedTime);
        if (this.timeDrumroll) {
          this.timeDrumroll.setDate(this.simulatedTime, false, false);
        }
        updateTimeSubtitle(this.simulatedTime);
        this.timePickerModal.classList.add("active");
      }
    };

    if (this.datePickerBtn) {
      this.datePickerBtn.addEventListener("click", toggleDateModal);
    }
    if (this.dateDisplay) {
      this.dateDisplay.addEventListener("click", toggleDateModal);
    }

    if (this.timePickerBtn) {
      this.timePickerBtn.addEventListener("click", toggleTimeModal);
    }
    if (this.timeDisplay) {
      this.timeDisplay.addEventListener("click", toggleTimeModal);
    }

    // Close & Apply buttons without clicking sound
    const dateCloseBtn = document.getElementById("date-modal-close-btn");
    const dateApplyBtn = document.getElementById("date-modal-apply-btn");
    const dateTodayBtn = document.getElementById("date-modal-today-btn");

    if (dateCloseBtn) {
      dateCloseBtn.addEventListener("click", () => {
        if (this.datePickerModal) this.datePickerModal.classList.remove("active");
      });
    }
    if (dateApplyBtn) {
      dateApplyBtn.addEventListener("click", () => {
        if (this.datePickerModal) this.datePickerModal.classList.remove("active");
      });
    }

    const dateCancelBtn = document.getElementById("date-modal-cancel-btn");
    if (dateCancelBtn) {
      dateCancelBtn.addEventListener("click", () => {
        if (this.savedDateSnapshot) {
          this.simulatedTime = new Date(this.savedDateSnapshot);
          this.sky.setTime(this.simulatedTime);
          this.updateDisplay(this.simulatedTime);
          this.updateScrubberFromTime();
          if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
          if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
          updateDateSubtitle(this.simulatedTime);
          updateTimeSubtitle(this.simulatedTime);
        }
        if (this.datePickerModal) this.datePickerModal.classList.remove("active");
      });
    }

    const timeCloseBtn = document.getElementById("time-modal-close-btn");
    const timeApplyBtn = document.getElementById("time-modal-apply-btn");
    if (timeCloseBtn) {
      timeCloseBtn.addEventListener("click", () => {
        if (this.timePickerModal) this.timePickerModal.classList.remove("active");
      });
    }
    if (timeApplyBtn) {
      timeApplyBtn.addEventListener("click", () => {
        if (this.timePickerModal) this.timePickerModal.classList.remove("active");
      });
    }

    const timeCancelBtn = document.getElementById("time-modal-cancel-btn");
    const timeNowBtn = document.getElementById("time-modal-now-btn");
    if (timeCancelBtn) {
      timeCancelBtn.addEventListener("click", () => {
        if (this.savedDateSnapshot) {
          this.simulatedTime = new Date(this.savedDateSnapshot);
          this.sky.setTime(this.simulatedTime);
          this.updateDisplay(this.simulatedTime);
          this.updateScrubberFromTime();
          if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
          if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
          updateDateSubtitle(this.simulatedTime);
          updateTimeSubtitle(this.simulatedTime);
        }
        if (this.timePickerModal) this.timePickerModal.classList.remove("active");
      });
    }

    const dateToTimeRow = document.getElementById("date-switch-to-time-row");
    if (dateToTimeRow) {
      dateToTimeRow.addEventListener("click", () => {
        toggleTimeModal();
      });
    }

    const timeToDateRow = document.getElementById("time-switch-to-date-row");
    if (timeToDateRow) {
      timeToDateRow.addEventListener("click", () => {
        toggleDateModal();
      });
    }

    // Date Presets & Today button
    if (dateTodayBtn) {
      dateTodayBtn.addEventListener("click", () => {
        this.simulatedTime = new Date();
        this.isRealtime = true;
        if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
        if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
        this.sky.setTime(this.simulatedTime);
        this.updateDisplay(this.simulatedTime);
        this.updateScrubberFromTime();
        updateDateSubtitle(this.simulatedTime);
        updateTimeSubtitle(this.simulatedTime);
      });
    }

    document.querySelectorAll("#apple-date-modal .quick-preset-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const preset = pill.dataset.preset;
        const now = new Date();
        if (preset === "now") {
          this.simulatedTime = new Date();
          this.isRealtime = true;
        } else if (preset === "perseids") {
          this.simulatedTime = new Date(now.getFullYear(), 7, 12, 23, 0, 0);
          this.isRealtime = false;
        } else if (preset === "solstice_summer") {
          this.simulatedTime = new Date(now.getFullYear(), 5, 21, 22, 0, 0);
          this.isRealtime = false;
        } else if (preset === "solstice_winter") {
          this.simulatedTime = new Date(now.getFullYear(), 11, 21, 22, 0, 0);
          this.isRealtime = false;
        }
        if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
        if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
        this.sky.setTime(this.simulatedTime);
        this.updateDisplay(this.simulatedTime);
        this.updateScrubberFromTime();
        updateDateSubtitle(this.simulatedTime);
        updateTimeSubtitle(this.simulatedTime);
      });
    });

    // Time Presets & Live Time button
    if (timeNowBtn) {
      timeNowBtn.addEventListener("click", () => {
        this.simulatedTime = new Date();
        this.isRealtime = true;
        if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
        if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
        this.sky.setTime(this.simulatedTime);
        this.updateDisplay(this.simulatedTime);
        this.updateScrubberFromTime();
        updateDateSubtitle(this.simulatedTime);
        updateTimeSubtitle(this.simulatedTime);
      });
    }

    document.querySelectorAll("#apple-time-modal .quick-preset-pill.time-preset").forEach(pill => {
      pill.addEventListener("click", () => {
        const timePreset = pill.dataset.time;
        const cur = new Date(this.simulatedTime);
        if (timePreset === "now") {
          this.simulatedTime = new Date();
          this.isRealtime = true;
        } else if (timePreset === "midnight") {
          cur.setHours(0, 0, 0);
          this.simulatedTime = cur;
          this.isRealtime = false;
        } else if (timePreset === "dusk") {
          cur.setHours(18, 30, 0);
          this.simulatedTime = cur;
          this.isRealtime = false;
        } else if (timePreset === "peak") {
          cur.setHours(22, 0, 0);
          this.simulatedTime = cur;
          this.isRealtime = false;
        } else if (timePreset === "dawn") {
          cur.setHours(5, 30, 0);
          this.simulatedTime = cur;
          this.isRealtime = false;
        }
        if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
        if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
        this.sky.setTime(this.simulatedTime);
        this.updateDisplay(this.simulatedTime);
        this.updateScrubberFromTime();
        updateDateSubtitle(this.simulatedTime);
        updateTimeSubtitle(this.simulatedTime);
      });
    });

    // Wheel scroll on Date Readout:
    // Scrolling down advances date (+), scrolling up steps back (-)
    if (this.dateDisplay) {
      let dateWheelAccum = 0;
      this.dateDisplay.addEventListener("wheel", (e) => {
        e.preventDefault();
        dateWheelAccum += e.deltaY;
        const threshold = 35;
        if (Math.abs(dateWheelAccum) >= threshold) {
          const daysToStep = Math.trunc(dateWheelAccum / threshold);
          dateWheelAccum %= threshold;

          const newTime = new Date(this.simulatedTime.getTime() + daysToStep * 86400000);
          this.simulatedTime = newTime;
          this.isRealtime = false;

          if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
          if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
          this.sky.setTime(this.simulatedTime);
          this.updateDisplay(this.simulatedTime);
          this.updateScrubberFromTime();
          updateDateSubtitle(this.simulatedTime);
          updateTimeSubtitle(this.simulatedTime);
        }
      }, { passive: false });
    }

    // Wheel scroll on Time Readout:
    // Scrolling down advances time (+1 min per notch), scrolling up steps back (-)
    if (this.timeDisplay) {
      let timeWheelAccum = 0;
      this.timeDisplay.addEventListener("wheel", (e) => {
        e.preventDefault();
        timeWheelAccum += e.deltaY;
        const threshold = 35;
        if (Math.abs(timeWheelAccum) >= threshold) {
          const minutesToStep = Math.trunc(timeWheelAccum / threshold);
          timeWheelAccum %= threshold;

          const newTime = new Date(this.simulatedTime.getTime() + minutesToStep * 60000);
          this.simulatedTime = newTime;
          this.isRealtime = false;

          if (this.timeDrumroll) this.timeDrumroll.setDate(this.simulatedTime, false, false);
          if (this.dateDrumroll) this.dateDrumroll.setDate(this.simulatedTime, false, false);
          this.sky.setTime(this.simulatedTime);
          this.updateDisplay(this.simulatedTime);
          this.updateScrubberFromTime();
          updateDateSubtitle(this.simulatedTime);
          updateTimeSubtitle(this.simulatedTime);
        }
      }, { passive: false });
    }

    // Dismiss floating date/time cards when clicking outside
    document.addEventListener("click", (e) => {
      if (this.datePickerModal && this.datePickerModal.classList.contains("active")) {
        const isClickInside = this.datePickerModal.contains(e.target);
        const isTriggerBtn = (this.datePickerBtn && this.datePickerBtn.contains(e.target)) ||
                            (this.dateDisplay && this.dateDisplay.contains(e.target));
        if (!isClickInside && !isTriggerBtn) {
          this.datePickerModal.classList.remove("active");
        }
      }
      if (this.timePickerModal && this.timePickerModal.classList.contains("active")) {
        const isClickInside = this.timePickerModal.contains(e.target);
        const isTriggerBtn = (this.timePickerBtn && this.timePickerBtn.contains(e.target)) ||
                            (this.timeDisplay && this.timeDisplay.contains(e.target));
        if (!isClickInside && !isTriggerBtn) {
          this.timePickerModal.classList.remove("active");
        }
      }
    });
  }

  updateDisplay(date) {
    if (this.timeDisplay) {
      const h = String(date.getHours()).padStart(2, "0");
      const m = String(date.getMinutes()).padStart(2, "0");
      const s = String(date.getSeconds()).padStart(2, "0");
      this.timeDisplay.textContent = `${h}:${m}:${s}`;
    }

    if (this.dateDisplay) {
      const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
      this.dateDisplay.textContent = date.toLocaleDateString("en-US", options);
    }

    this.updateRealtimeStatus();
  }

  updateRealtimeStatus() {
    if (!this.locationCapsule) {
      this.locationCapsule = document.getElementById("location-capsule-trigger");
    }
    if (!this.locationCapsule) return;
    const hasCustomClass = this.locationCapsule.classList.contains("custom-time");
    if (this.isRealtime && hasCustomClass) {
      this.locationCapsule.classList.remove("custom-time");
    } else if (!this.isRealtime && !hasCustomClass) {
      this.locationCapsule.classList.add("custom-time");
    }
  }

  tick(timestamp) {
    const deltaMs = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    if (this.isPlaying && !this.isScrubbing) {
      if (this.isRealtime) {
        this.simulatedTime = new Date();
      } else {
        const addedMs = deltaMs * this.timeScale;
        this.simulatedTime = new Date(this.simulatedTime.getTime() + addedMs);
      }

      this.sky.setTime(this.simulatedTime);
      this.updateDisplay(this.simulatedTime);
      this.updateScrubberFromTime();
    }
  }
}
