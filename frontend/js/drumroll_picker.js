/**
 * Apple iOS & macOS Cupertino 3D Cylindrical Drumroll Date & Time Picker
 *
 * Engineered according to Apple Human Interface Guidelines:
 * 1. Viewport Perspective Scroll:
 *    - 3D cylinder projection (perspective: 1000px, transform-style: preserve-3d)
 *    - Continuous angular displacement with dynamic foreshortening scale and rotateX tilt
 *    - Smooth distance-decay opacity transforms with backface-visibility: hidden
 *    - Flat 2D translucent selection lens positioned at center
 * 2. Smooth Gestural Drag & Inertial Snapping Physics:
 *    - Sub-pixel Pointer Events tracking (pointerdown, pointermove, pointerup, pointercancel)
 *    - Natural inverted Apple wheel scroll direction
 *    - Logarithmic rubber-band resistance on boundary overscroll
 *    - Momentum coasting on release with exponential friction decay transitioning into spring easing snap
 *    - Dual-tier haptics (navigator.vibrate(8) + Web Audio acoustic notch click detents)
 * 3. Dynamic Day Array:
 *    - Real-time adjustment of maximum days per month/year (leap years, 28-31 days)
 *    - Instant smooth clamping of selected day without invalid state transitions
 * 4. Direct Interface Bindings:
 *    - Binds `#apple-date-drumroll-container` (Month, Day, Year)
 *    - Binds `#apple-time-drumroll-container` (Hour, Minute, Second)
 *    - Real-time synchronization with app astronomical date state
 */

class AppleDrumrollPicker {
  static hapticAudioCtx = null;

  /**
   * Dual-tier Apple haptic feedback:
   * 1. Physical chassis vibration for mobile/touch devices
   * 2. Synthesized acoustic mechanical detent click for desktop & iOS/macOS Web Audio
   */
  static triggerHaptic() {
    // Strictly restrict haptic feedback to verified user wheel scrolling/dragging only.
    // Completely suppresses all sounds from button clicks, GPS menu, modals, cancel, ok, etc.
    if (typeof DrumrollColumnWheel !== "undefined" && !DrumrollColumnWheel.activeInteraction) {
      return;
    }

    // 1. Touch vibration
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(8);
      }
    } catch (e) {}

    // 2. Synthesized acoustic notch click detent
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!AppleDrumrollPicker.hapticAudioCtx) {
        AppleDrumrollPicker.hapticAudioCtx = new AudioCtx();
      }

      const ctx = AppleDrumrollPicker.hapticAudioCtx;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Sharp, subtle mechanical detent click (1600Hz -> 300Hz in 11ms)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1600, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.011);

      filter.type = "highpass";
      filter.frequency.setValueAtTime(650, t);

      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.011);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.014);
    } catch (err) {}
  }

  constructor(options = {}) {
    this.mode = options.mode || "date"; // "date" or "time"
    this.container = options.container;
    this.idPrefix = options.idPrefix || (this.mode === "time" ? "time-col-" : "date-col-");
    this.onDateChange = options.onDateChange || (() => {});

    this.simulatedTime = options.initialDate ? new Date(options.initialDate) : new Date();
    this.columns = {};
    this.MONTH_NAMES = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    this.init();
  }

  init() {
    if (!this.container) return;
    this.buildMarkup();
    this.initColumns();
    this.setDate(this.simulatedTime, false, false);
  }

  buildMarkup() {
    if (this.mode === "time") {
      this.container.innerHTML = `
        <div class="drumroll-selection-lens"></div>
        <div class="drumroll-fade-top"></div>
        <div class="drumroll-fade-bottom"></div>
        <div class="drumroll-columns-wrapper time-columns">
          <div class="drumroll-column" id="${this.idPrefix}hour" data-column="hour">
            <div class="drumroll-wheel"></div>
          </div>
          <div class="drumroll-time-colon">:</div>
          <div class="drumroll-column" id="${this.idPrefix}minute" data-column="minute">
            <div class="drumroll-wheel"></div>
          </div>
          <div class="drumroll-time-colon">:</div>
          <div class="drumroll-column" id="${this.idPrefix}second" data-column="second">
            <div class="drumroll-wheel"></div>
          </div>
        </div>
      `;
    } else {
      // Date Mode: Month, Day, Year (Full Cupertino 3-column drumroll)
      this.container.innerHTML = `
        <div class="drumroll-selection-lens"></div>
        <div class="drumroll-fade-top"></div>
        <div class="drumroll-fade-bottom"></div>
        <div class="drumroll-columns-wrapper date-columns">
          <div class="drumroll-column" id="${this.idPrefix}month" data-column="month">
            <div class="drumroll-wheel"></div>
          </div>
          <div class="drumroll-column" id="${this.idPrefix}day" data-column="day">
            <div class="drumroll-wheel"></div>
          </div>
          <div class="drumroll-column" id="${this.idPrefix}year" data-column="year">
            <div class="drumroll-wheel"></div>
          </div>
        </div>
      `;
    }
  }

  initColumns() {
    if (this.mode === "time") {
      // Hour items (00..23)
      const hourItems = [];
      for (let h = 0; h < 24; h++) {
        hourItems.push({ value: h, label: String(h).padStart(2, "0") });
      }

      // Minute items (00..59)
      const minuteItems = [];
      for (let m = 0; m < 60; m++) {
        minuteItems.push({ value: m, label: String(m).padStart(2, "0") });
      }

      // Second items (00..59)
      const secondItems = [];
      for (let s = 0; s < 60; s++) {
        secondItems.push({ value: s, label: String(s).padStart(2, "0") });
      }

      this.columns.hour = new DrumrollColumnWheel({
        colEl: document.getElementById(`${this.idPrefix}hour`),
        items: hourItems,
        initialValue: this.simulatedTime.getHours(),
        onChange: (val) => this.handleWheelChange("hour", val)
      });

      this.columns.minute = new DrumrollColumnWheel({
        colEl: document.getElementById(`${this.idPrefix}minute`),
        items: minuteItems,
        initialValue: this.simulatedTime.getMinutes(),
        onChange: (val) => this.handleWheelChange("minute", val)
      });

      this.columns.second = new DrumrollColumnWheel({
        colEl: document.getElementById(`${this.idPrefix}second`),
        items: secondItems,
        initialValue: this.simulatedTime.getSeconds(),
        onChange: (val) => this.handleWheelChange("second", val)
      });
    } else {
      // Date Mode: Month, Day, Year
      const monthItems = this.MONTH_NAMES.map((name, idx) => ({
        value: idx,
        label: name
      }));

      const dayItems = this.generateDayItems(this.simulatedTime.getFullYear(), this.simulatedTime.getMonth());

      const yearItems = [];
      for (let y = 1950; y <= 2050; y++) {
        yearItems.push({ value: y, label: String(y) });
      }

      this.columns.month = new DrumrollColumnWheel({
        colEl: document.getElementById(`${this.idPrefix}month`),
        items: monthItems,
        initialValue: this.simulatedTime.getMonth(),
        onChange: (val) => this.handleWheelChange("month", val)
      });

      this.columns.day = new DrumrollColumnWheel({
        colEl: document.getElementById(`${this.idPrefix}day`),
        items: dayItems,
        initialValue: this.simulatedTime.getDate(),
        onChange: (val) => this.handleWheelChange("day", val)
      });

      this.columns.year = new DrumrollColumnWheel({
        colEl: document.getElementById(`${this.idPrefix}year`),
        items: yearItems,
        initialValue: this.simulatedTime.getFullYear(),
        onChange: (val) => this.handleWheelChange("year", val)
      });
    }
  }

  /**
   * Generates day objects array for a specific year and month
   * Month is 0-indexed (0 = January, 1 = February, etc.)
   * Correctly resolves leap years (e.g., Feb 2024 -> 29 days, Feb 2025 -> 28 days)
   */
  generateDayItems(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const items = [];
    for (let d = 1; d <= daysInMonth; d++) {
      items.push({ value: d, label: String(d) });
    }
    return items;
  }

  handleWheelChange(columnType, newValue) {
    if (this.mode === "time") {
      const hr = this.columns.hour ? this.columns.hour.getValue() : 0;
      const min = this.columns.minute ? this.columns.minute.getValue() : 0;
      const sec = this.columns.second ? this.columns.second.getValue() : 0;

      this.simulatedTime.setHours(hr, min, sec);
    } else {
      // When Month or Year column changes, check and dynamically adjust Day array
      if (columnType === "month" || columnType === "year") {
        const curYear = columnType === "year" ? newValue : (this.columns.year ? this.columns.year.getValue() : this.simulatedTime.getFullYear());
        const curMonth = columnType === "month" ? newValue : (this.columns.month ? this.columns.month.getValue() : this.simulatedTime.getMonth());
        const curDay = this.columns.day ? this.columns.day.getValue() : this.simulatedTime.getDate();

        const newDayItems = this.generateDayItems(curYear, curMonth);
        const maxDays = newDayItems.length;
        const clampedDay = Math.min(curDay, maxDays);

        if (this.columns.day && (this.columns.day.items.length !== maxDays || curDay > maxDays)) {
          this.columns.day.updateItems(newDayItems, clampedDay, false);
        }
      }

      const y = this.columns.year ? this.columns.year.getValue() : this.simulatedTime.getFullYear();
      const m = this.columns.month ? this.columns.month.getValue() : this.simulatedTime.getMonth();
      const d = this.columns.day ? this.columns.day.getValue() : this.simulatedTime.getDate();

      this.simulatedTime.setFullYear(y, m, d);
    }

    this.onDateChange(new Date(this.simulatedTime));
  }

  setDate(date, triggerCallback = true, animated = true) {
    this.simulatedTime = new Date(date);

    if (this.mode === "time") {
      const curHour = this.simulatedTime.getHours();
      const curMinute = this.simulatedTime.getMinutes();
      const curSecond = this.simulatedTime.getSeconds();

      if (this.columns.hour) this.columns.hour.setValue(curHour, animated);
      if (this.columns.minute) this.columns.minute.setValue(curMinute, animated);
      if (this.columns.second) this.columns.second.setValue(curSecond, animated);
    } else {
      const curYear = this.simulatedTime.getFullYear();
      const curMonth = this.simulatedTime.getMonth();
      const curDay = this.simulatedTime.getDate();

      const dayItems = this.generateDayItems(curYear, curMonth);
      if (this.columns.day) {
        if (this.columns.day.items.length !== dayItems.length || this.columns.day.getValue() !== curDay) {
          this.columns.day.updateItems(dayItems, curDay, animated);
        }
      }

      if (this.columns.year) this.columns.year.setValue(curYear, animated);
      if (this.columns.month) this.columns.month.setValue(curMonth, animated);
      if (this.columns.day) this.columns.day.setValue(curDay, animated);
    }

    if (triggerCallback) {
      this.onDateChange(new Date(this.simulatedTime));
    }
  }

  getDate() {
    return new Date(this.simulatedTime);
  }
}

/**
 * Individual Cupertino 3D Cylindrical Drumroll Column Wheel
 * Features:
 * - 3D cylinder geometry (perspective, rotateX, depth translate, vertical foreshortening)
 * - Continuous sub-pixel gesture tracking with natural Apple inverted scrolling
 * - Elastic rubber-band resistance on boundary overscroll
 * - Dynamic kinetic inertia on release with friction decay transitioning into spring snapping
 * - Full integer row alignment fallback
 * - Acoustic mechanical detent notch clicks
 */
class DrumrollColumnWheel {
  static activeInteraction = false;

  constructor(options) {
    this.colEl = options.colEl;
    this.wheelEl = this.colEl.querySelector(".drumroll-wheel");
    this.items = options.items || [];
    this.onChange = options.onChange || (() => {});

    // High-density Cupertino Wheel Geometry strictly matching reference photo
    // 220px viewport, 30px item height, 27.5px slot pitch, 95px center offset
    this.ITEM_HEIGHT = 30;
    this.SLOT_HEIGHT = 27.5;
    this.WHEEL_HEIGHT = 220;
    this.CENTER_Y = (this.WHEEL_HEIGHT - this.ITEM_HEIGHT) / 2; // 95px
    this.CYLINDER_RADIUS = 86; // Virtual cylinder radius in px
    this.THETA_PER_SLOT = 0.315; // Angular pitch (~18.05 degrees per slot)

    this.selectedIndex = 0;
    if (options.initialValue !== undefined) {
      const idx = this.items.findIndex(it => it.value === options.initialValue);
      if (idx !== -1) this.selectedIndex = idx;
    }

    // Continuous floating-point scroll position in slot units (0 to items.length - 1)
    this.currentScroll = this.selectedIndex;
    this.targetScroll = this.selectedIndex;
    this.lastEmittedIndex = this.selectedIndex;

    // Gesture & Inertia Tracking
    this.isDragging = false;
    this.dragStartY = 0;
    this.dragStartScroll = 0;
    this.pointerSamples = [];
    this.velocity = 0; // slots per millisecond
    this.rafId = null;
    this.wheelSnapTimer = null;
    this.animState = "idle"; // "idle" | "inertia" | "snapping"

    this.itemElements = [];

    this.renderDOM();
    this.bindEvents();
    this.applyTransform();
  }

  renderDOM() {
    this.wheelEl.innerHTML = "";
    this.itemElements = [];

    this.items.forEach((item, idx) => {
      const el = document.createElement("div");
      el.className = "drumroll-item";
      el.textContent = item.label;
      el.dataset.index = idx;
      this.wheelEl.appendChild(el);
      this.itemElements.push(el);
    });
  }

  updateItems(newItems, newValue, animated = false) {
    DrumrollColumnWheel.activeInteraction = false;
    this.stopAnimation();
    this.items = newItems;
    this.renderDOM();

    let newIdx = this.items.findIndex(it => it.value === newValue);
    if (newIdx === -1) {
      newIdx = Math.max(0, Math.min(this.selectedIndex, this.items.length - 1));
    }
    this.selectedIndex = newIdx;
    this.lastEmittedIndex = newIdx;

    if (animated) {
      this.targetScroll = newIdx;
      this.startSpringAnimation();
    } else {
      this.currentScroll = newIdx;
      this.targetScroll = newIdx;
      this.applyTransform();
    }
  }

  setValue(val, animated = true) {
    const idx = this.items.findIndex(it => it.value === val);
    if (idx !== -1 && idx !== this.selectedIndex) {
      DrumrollColumnWheel.activeInteraction = false;
      this.selectedIndex = idx;
      this.lastEmittedIndex = idx;
      if (animated) {
        this.targetScroll = idx;
        this.startSpringAnimation();
      } else {
        this.stopAnimation();
        this.currentScroll = idx;
        this.targetScroll = idx;
        this.applyTransform();
      }
    }
  }

  getValue() {
    if (this.items[this.selectedIndex]) {
      return this.items[this.selectedIndex].value;
    }
    return null;
  }

  stopAnimation() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.animState = "idle";
    DrumrollColumnWheel.activeInteraction = false;
  }

  /**
   * Applies 3D perspective cylindrical transforms to all items
   * Uses rotateX tilt, cylinder depth displacement, vertical foreshortening,
   * distance-decay opacity transforms, and backface-visibility: hidden
   */
  applyTransform() {
    const totalSlots = this.items.length;
    if (totalSlots === 0) return;

    for (let i = 0; i < totalSlots; i++) {
      const el = this.itemElements[i];
      if (!el) continue;

      // Distance in slots from center (continuous floating-point)
      const d = i - this.currentScroll;
      const absD = Math.abs(d);

      // Cull items rotated past the cylinder horizon (> ~83 degrees)
      if (absD > 4.6) {
        el.style.display = "none";
        el.classList.remove("selected");
        continue;
      }

      el.style.display = "flex";

      // 3D Cylinder geometry calculations
      const theta = d * this.THETA_PER_SLOT;
      const y = this.CYLINDER_RADIUS * Math.sin(theta);
      const z = this.CYLINDER_RADIUS * (Math.cos(theta) - 1.0); // Depth curves away (z <= 0)

      // Angular rotation around X axis:
      // d < 0 (above center): rotX > 0 tilts top backwards into screen (\)
      // d = 0 (center): rotX = 0 flat upright inside lens (|)
      // d > 0 (below center): rotX < 0 tilts bottom backwards into screen (/)
      const rotX = -theta * (180.0 / Math.PI);

      // ( | ) Profile: vertical foreshortening compression as rows curve around the cylinder
      const cosTheta = Math.cos(theta);
      const scaleY = Math.max(0.14, Math.pow(Math.max(0, cosTheta), 1.5));
      const scaleX = Math.max(0.88, 1.0 - absD * 0.03);

      // Distance-decay opacity curve matching photo: center is 1.0, decaying naturally to faint edge rows
      const opacity = Math.max(0.04, Math.exp(-0.35 * Math.pow(absD, 1.3)));

      el.style.transform = `translate3d(0, ${(this.CENTER_Y + y).toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);

      if (absD < 0.45) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    }
  }

  /**
   * Kinetic Inertia Coasting:
   * Simulates momentum coasting with exponential friction decay.
   * In overscroll territory, applies elastic rubber-band spring dampening.
   * As velocity drops below threshold, smoothly hands off to Spring Easing Snap.
   */
  startInertia() {
    this.stopAnimation();
    this.animState = "inertia";
    let lastTime = performance.now();
    const maxIndex = Math.max(0, this.items.length - 1);

    const step = (currentTime) => {
      const dt = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;

      // 1. Advance scroll position by velocity * dt
      this.currentScroll += this.velocity * dt;

      // 2. Check bounds and apply friction / rubber-band spring
      if (this.currentScroll >= 0 && this.currentScroll <= maxIndex) {
        // Friction decay: ~0.952 per 16.7ms frame
        const friction = Math.pow(0.952, dt / 16.67);
        this.velocity *= friction;

        // When velocity drops below cutoff, seamlessly switch to integer slot snap
        if (Math.abs(this.velocity) < 0.0006) {
          this.targetScroll = Math.max(0, Math.min(maxIndex, Math.round(this.currentScroll)));
          this.startSpringAnimation();
          return;
        }
      } else {
        // Overscroll territory: apply spring resistance pulling back towards bound
        const bound = this.currentScroll < 0 ? 0 : maxIndex;
        const dist = bound - this.currentScroll;
        const restoring = dist * 0.012 * dt;
        this.velocity = (this.velocity + restoring) * Math.pow(0.82, dt / 16.67);

        // When nearly stopped in overscroll, snap back
        if (Math.abs(this.velocity) < 0.0003) {
          this.targetScroll = bound;
          this.startSpringAnimation();
          return;
        }
      }

      // 3. Acoustic mechanical detent click when crossing an integer row
      const rounded = Math.round(this.currentScroll);
      if (rounded !== this.lastEmittedIndex && rounded >= 0 && rounded <= maxIndex) {
        this.selectedIndex = rounded;
        this.lastEmittedIndex = rounded;
        AppleDrumrollPicker.triggerHaptic();
        this.onChange(this.getValue());
      }

      // 4. Update 3D cylindrical transform
      this.applyTransform();

      this.rafId = requestAnimationFrame(step);
    };

    this.rafId = requestAnimationFrame(step);
  }

  /**
   * Smooth Spring Easing Snap:
   * Smoothly eases towards target full integer row alignment with critically damped spring interpolation
   */
  startSpringAnimation() {
    this.stopAnimation();
    this.animState = "snapping";
    const maxIndex = Math.max(0, this.items.length - 1);
    this.targetScroll = Math.max(0, Math.min(maxIndex, Math.round(this.targetScroll)));

    const tick = () => {
      const diff = this.targetScroll - this.currentScroll;

      if (Math.abs(diff) > 0.002) {
        // High-fidelity spring easing: 22% interpolation per frame
        this.currentScroll += diff * 0.22;

        const rounded = Math.round(this.currentScroll);
        if (rounded !== this.lastEmittedIndex && rounded >= 0 && rounded <= maxIndex) {
          this.selectedIndex = rounded;
          this.lastEmittedIndex = rounded;
          AppleDrumrollPicker.triggerHaptic();
          this.onChange(this.getValue());
        }

        this.applyTransform();
        this.rafId = requestAnimationFrame(tick);
      } else {
        // Full integer snap complete
        this.currentScroll = this.targetScroll;
        this.selectedIndex = Math.round(this.currentScroll);
        this.lastEmittedIndex = this.selectedIndex;
        this.applyTransform();
        this.onChange(this.getValue());
        this.stopAnimation();
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  bindEvents() {
    // 1. Wheel Event (Continuous Sub-Pixel Inverted Scroll with Integer Snap Debounce)
    this.colEl.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopPropagation();

      DrumrollColumnWheel.activeInteraction = true;
      this.stopAnimation();
      DrumrollColumnWheel.activeInteraction = true;
      const maxIndex = Math.max(0, this.items.length - 1);

      // Inverted: scroll down increases target (+), scroll up decreases (-)
      const deltaSlots = e.deltaY / 60.0;
      this.targetScroll = Math.max(0, Math.min(maxIndex, this.targetScroll + deltaSlots));
      this.startSpringAnimation();

      clearTimeout(this.wheelSnapTimer);
      this.wheelSnapTimer = setTimeout(() => {
        DrumrollColumnWheel.activeInteraction = true;
        this.targetScroll = Math.round(this.targetScroll);
        this.startSpringAnimation();
      }, 90);
    }, { passive: false });

    // 2. Direct Pointer / Touch Dragging with Kinetic Inertia
    this.colEl.addEventListener("pointerdown", (e) => {
      DrumrollColumnWheel.activeInteraction = true;
      this.stopAnimation();
      DrumrollColumnWheel.activeInteraction = true;
      this.isDragging = true;
      this.dragStartY = e.clientY;
      this.dragStartScroll = this.currentScroll;
      const now = performance.now();
      this.pointerSamples = [{ y: e.clientY, time: now }];
      this.velocity = 0;

      this.colEl.classList.add("grabbing");
      try {
        this.colEl.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    this.colEl.addEventListener("pointermove", (e) => {
      if (!this.isDragging) return;

      const now = performance.now();
      this.pointerSamples.push({ y: e.clientY, time: now });
      // Keep only recent samples within last 100ms for accurate release velocity
      this.pointerSamples = this.pointerSamples.filter(s => now - s.time <= 100);

      const totalDy = e.clientY - this.dragStartY;
      const maxIndex = Math.max(0, this.items.length - 1);

      // Natural Apple inverted drag: pulling up moves forward/down list
      const rawScroll = this.dragStartScroll - (totalDy / this.SLOT_HEIGHT);

      // Logarithmic rubber-band resistance on boundary overscroll
      if (rawScroll < 0) {
        const overscroll = -rawScroll;
        this.currentScroll = -(0.35 * Math.log1p(overscroll * 2.2));
      } else if (rawScroll > maxIndex) {
        const overscroll = rawScroll - maxIndex;
        this.currentScroll = maxIndex + (0.35 * Math.log1p(overscroll * 2.2));
      } else {
        this.currentScroll = rawScroll;
      }

      this.targetScroll = this.currentScroll;

      // Real-time integer slot crossing detent during active drag
      const rounded = Math.round(this.currentScroll);
      if (rounded !== this.lastEmittedIndex && rounded >= 0 && rounded <= maxIndex) {
        this.selectedIndex = rounded;
        this.lastEmittedIndex = rounded;
        AppleDrumrollPicker.triggerHaptic();
        this.onChange(this.getValue());
      }

      this.applyTransform();
    });

    const finishDrag = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.colEl.classList.remove("grabbing");

      try {
        this.colEl.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // Calculate release velocity in slots per millisecond
      if (this.pointerSamples.length >= 2) {
        const first = this.pointerSamples[0];
        const last = this.pointerSamples[this.pointerSamples.length - 1];
        const dt = Math.max(10, last.time - first.time);
        const dy = last.y - first.y;
        const velPixelsPerMs = dy / dt;
        this.velocity = -(velPixelsPerMs / this.SLOT_HEIGHT);
      } else {
        this.velocity = 0;
      }

      // Clamp velocity to prevent runaway speeds
      const MAX_VELOCITY = 0.045;
      this.velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, this.velocity));

      // Trigger momentum inertia if released with flick velocity
      if (Math.abs(this.velocity) > 0.0025) {
        DrumrollColumnWheel.activeInteraction = true;
        this.startInertia();
      } else {
        // Fall back directly onto full integer row alignment with spring snap
        DrumrollColumnWheel.activeInteraction = true;
        const maxIndex = Math.max(0, this.items.length - 1);
        this.targetScroll = Math.max(0, Math.min(maxIndex, Math.round(this.currentScroll)));
        this.startSpringAnimation();
      }
    };

    this.colEl.addEventListener("pointerup", finishDrag);
    this.colEl.addEventListener("pointercancel", finishDrag);

    // 3. Click directly on item to smoothly rotate into center lens
    this.wheelEl.addEventListener("click", (e) => {
      const itemEl = e.target.closest(".drumroll-item");
      if (!itemEl) return;
      const targetIdx = parseInt(itemEl.dataset.index, 10);
      if (!isNaN(targetIdx) && targetIdx !== this.selectedIndex) {
        DrumrollColumnWheel.activeInteraction = true;
        this.targetScroll = targetIdx;
        this.startSpringAnimation();
      }
    });
  }
}
