/**
 * ASCENT — Interactive Parallax Scrolling Odyssey
 * Complete Dual-Parallax, Web Audio Generative Synthesizer,
 * Particle Physics, and Artifact Codex System.
 */

(function () {
  'use strict';

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    scrollY: 0,
    targetScrollY: 0,
    lastScrollY: 0,
    velocity: 0,
    lastTime: performance.now(),
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    targetMouseX: window.innerWidth / 2,
    targetMouseY: window.innerHeight / 2,
    currentZone: 'SURFACE NEXUS',
    currentAltitude: '0 m',
    activeSectionIndex: 0,
    isAudioOn: false,
    isAutopilot: false,
    autopilotSpeed: 2.2,
    discoveredArtifacts: new Set(JSON.parse(localStorage.getItem('ascent_artifacts') || '[]')),
    artifactsList: [
      { id: 1, name: 'Abyssal Core Specimen', realm: 'Mariana Abyss', depth: '-11,000 m', icon: '💎', desc: 'Dense crystallized geothermal mineral infused with hyperbaric bacteria.' },
      { id: 2, name: 'Iridescent Nautilus', realm: 'Coral Twilight', depth: '-500 m', icon: '🐚', desc: 'A bio-photonic shell that converts ambient caustics into living light.' },
      { id: 3, name: 'Verdant Runestone', realm: 'Emerald Highlands', depth: '+1,200 m', icon: '🌿', desc: 'Carved celestial lodestone resonating with mountain wind harmonics.' },
      { id: 4, name: 'Sky-Core Levitation Crystal', realm: 'Stratosphere', depth: '+18,000 m', icon: '✨', desc: 'Anti-gravitational crystal shard holding sky islands aloft in the jetstream.' },
      { id: 5, name: 'Quantum Flight Recorder', realm: 'Orbital Outpost', depth: '+420 km', icon: '🛰️', desc: 'Telemetry capsule containing orbital calculations and radiation scans.' },
      { id: 6, name: 'Cosmic Singularity Seed', realm: 'Quantum Singularity', depth: '+∞', icon: '🔮', desc: 'Infinite density spacetime artifact bending perspective in all dimensions.' }
    ]
  };

  // DOM Elements
  const viewport = document.getElementById('viewport');
  const sections = Array.from(document.querySelectorAll('.scene-section'));
  const navPills = Array.from(document.querySelectorAll('.nav-pill'));
  const waypointMarkers = Array.from(document.querySelectorAll('.waypoint-marker'));
  const altimeterIndicator = document.getElementById('altimeter-indicator');
  const hudAltitude = document.getElementById('hud-altitude');
  const hudZone = document.getElementById('hud-zone');
  const hudVelocity = document.getElementById('hud-velocity');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const toastNotification = document.getElementById('toast-notification');

  // Controls & Modals
  const btnAudio = document.getElementById('btn-audio');
  const btnAutopilot = document.getElementById('btn-autopilot');
  const btnCodex = document.getElementById('btn-codex');
  const codexDrawer = document.getElementById('codex-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const btnCloseCodex = document.getElementById('btn-close-codex');
  const codexCounter = document.getElementById('codex-counter');
  const codexFill = document.getElementById('codex-fill');
  const codexStatus = document.getElementById('codex-status');
  const codexList = document.getElementById('codex-list');

  const guideModal = document.getElementById('guide-modal');
  const btnViewManual = document.getElementById('btn-view-manual');
  const btnCloseGuide = document.getElementById('btn-close-guide');
  const btnCloseGuideAction = document.getElementById('btn-close-guide-action');
  const linkCredits = document.getElementById('link-credits');
  const linkControls = document.getElementById('link-controls');

  const btnDive = document.getElementById('btn-dive');
  const btnReascend = document.getElementById('btn-reascend');
  const btnHyperdrive = document.getElementById('btn-hyperdrive');

  const astralGyro = document.getElementById('astral-gyro');
  const bubbleContainer = document.getElementById('bubble-container');
  const firefliesField = document.getElementById('fireflies-field');

  // Canvases
  const ambientCanvas = document.getElementById('ambient-canvas');
  const ambientCtx = ambientCanvas.getContext('2d');
  const singularityCanvas = document.getElementById('singularity-canvas');
  const singularityCtx = singularityCanvas ? singularityCanvas.getContext('2d') : null;

  // =========================================================================
  // WEB AUDIO GENERATIVE SOUNDSCAPE ENGINE
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.droneSub = null;
      this.filter = null;
      this.noiseNode = null;
      this.noiseGain = null;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();

        // Master Volume
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Low-pass Filter for Atmospheric Depth
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(280, this.ctx.currentTime);
        this.filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
        this.filter.connect(this.masterGain);

        // Primary Ambient Drone Oscillator
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc1.type = 'sawtooth';
        this.droneOsc1.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

        // Secondary Drone Oscillator (Harmonic 5th detuned)
        this.droneOsc2 = this.ctx.createOscillator();
        this.droneOsc2.type = 'sine';
        this.droneOsc2.frequency.setValueAtTime(98.0, this.ctx.currentTime); // G2

        // Sub-Bass Generator
        this.droneSub = this.ctx.createOscillator();
        this.droneSub.type = 'sine';
        this.droneSub.frequency.setValueAtTime(32.7, this.ctx.currentTime); // C1

        const droneGain = this.ctx.createGain();
        droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

        this.droneOsc1.connect(this.filter);
        this.droneOsc2.connect(this.filter);
        this.droneSub.connect(this.filter);

        this.droneOsc1.start();
        this.droneOsc2.start();
        this.droneSub.start();

        // Atmospheric Wind Noise Buffer
        this.initNoise();

        this.initialized = true;
      } catch (e) {
        console.warn('Web Audio not supported or blocked:', e);
      }
    }

    initNoise() {
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      whiteNoise.start();
    }

    updateDepth(altitudeRatio) {
      if (!this.initialized || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      // Dynamically morph frequencies according to altitude:
      // Depth 0 = Abyss (Sub bass heavy, dark lowpass)
      // Depth 1 = Singularity (High resonant ethereal frequencies)
      const baseFreq = 40 + altitudeRatio * 160;
      const filterFreq = 180 + Math.pow(altitudeRatio, 1.8) * 3200;

      this.droneOsc1.frequency.setTargetAtTime(baseFreq, now, 0.2);
      this.droneOsc2.frequency.setTargetAtTime(baseFreq * 1.498, now, 0.2); // Just 5th
      this.droneSub.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.2);
      this.filter.frequency.setTargetAtTime(filterFreq, now, 0.2);

      if (this.noiseGain) {
        // More wind in highlands & stratosphere
        const windFactor = Math.sin(altitudeRatio * Math.PI) * 0.09;
        this.noiseGain.gain.setTargetAtTime(0.02 + windFactor, now, 0.3);
      }
    }

    playChime(pitchMultiplier = 1) {
      if (!this.initialized || !this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25 * pitchMultiplier, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5 * pitchMultiplier, now + 0.15); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    }

    playBubblePop() {
      if (!this.initialized || !this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(1200 + Math.random() * 300, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    }

    playWarpSound() {
      if (!this.initialized || !this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.7);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    }

    toggle() {
      if (!this.initialized) {
        this.init();
      }

      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
          state.isAudioOn = true;
        } else if (this.ctx.state === 'running') {
          this.ctx.suspend();
          state.isAudioOn = false;
        }
      }
      return state.isAudioOn;
    }
  }

  const sound = new SoundEngine();

  // =========================================================================
  // AMBIENT STARFIELD & WARP CANVAS
  // =========================================================================
  let stars = [];
  const STAR_COUNT = 240;

  function initStarfield() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
    stars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * ambientCanvas.width,
        y: Math.random() * ambientCanvas.height,
        size: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: ['#ffffff', '#38bdf8', '#c084fc', '#34d399'][Math.floor(Math.random() * 4)]
      });
    }
  }

  function renderStarfield() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

    // Dynamic streaks if scrolling fast
    const streakLength = Math.min(Math.abs(state.velocity) * 1.2, 35);
    const scrollDirection = state.velocity >= 0 ? 1 : -1;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Subtle pulse
      s.opacity += Math.sin(Date.now() * s.pulseSpeed) * 0.01;
      s.opacity = Math.max(0.2, Math.min(0.9, s.opacity));

      // Draw Star or Streak
      ambientCtx.beginPath();
      if (streakLength > 4) {
        ambientCtx.strokeStyle = s.color;
        ambientCtx.lineWidth = s.size;
        ambientCtx.globalAlpha = s.opacity;
        ambientCtx.moveTo(s.x, s.y);
        ambientCtx.lineTo(s.x, s.y - streakLength * scrollDirection * s.speed);
        ambientCtx.stroke();
      } else {
        ambientCtx.fillStyle = s.color;
        ambientCtx.globalAlpha = s.opacity;
        ambientCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ambientCtx.fill();
      }
    }

    ambientCtx.globalAlpha = 1;
  }

  // =========================================================================
  // SINGULARITY ACCRETION DISK CANVAS
  // =========================================================================
  let singularityParticles = [];
  const SINGULARITY_PARTICLE_COUNT = 180;

  function initSingularityCanvas() {
    if (!singularityCanvas) return;
    singularityCanvas.width = 700;
    singularityCanvas.height = 700;
    singularityParticles = [];

    for (let i = 0; i < SINGULARITY_PARTICLE_COUNT; i++) {
      singularityParticles.push({
        radius: Math.random() * 220 + 40,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.5 + 0.8,
        color: ['#e879f9', '#c084fc', '#38bdf8', '#ffffff'][Math.floor(Math.random() * 4)]
      });
    }
  }

  function renderSingularityCanvas() {
    if (!singularityCtx || !singularityCanvas) return;
    const centerX = singularityCanvas.width / 2;
    const centerY = singularityCanvas.height / 2;

    singularityCtx.clearRect(0, 0, singularityCanvas.width, singularityCanvas.height);

    for (let i = 0; i < singularityParticles.length; i++) {
      const p = singularityParticles[i];
      p.angle += p.speed;

      const x = centerX + Math.cos(p.angle) * p.radius;
      const y = centerY + Math.sin(p.angle) * (p.radius * 0.45); // Elliptical perspective

      singularityCtx.beginPath();
      singularityCtx.fillStyle = p.color;
      singularityCtx.globalAlpha = Math.min(1, (p.radius / 220) + 0.2);
      singularityCtx.arc(x, y, p.size, 0, Math.PI * 2);
      singularityCtx.fill();
    }

    singularityCtx.globalAlpha = 1;
  }

  // =========================================================================
  // DUAL PARALLAX ENGINE & RENDER LOOP
  // =========================================================================
  function updateParallax() {
    const now = performance.now();
    const dt = Math.max(1, now - state.lastTime);
    state.lastTime = now;

    // Smooth LERP for scroll position
    state.scrollY += (state.targetScrollY - state.scrollY) * 0.09;
    state.velocity = (state.scrollY - state.lastScrollY) / (dt * 0.06);
    state.lastScrollY = state.scrollY;

    // Smooth LERP for cursor tilt
    state.mouseX += (state.targetMouseX - state.mouseX) * 0.1;
    state.mouseY += (state.targetMouseY - state.mouseY) * 0.1;

    const normalizedMouseX = (state.mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
    const normalizedMouseY = (state.mouseY - window.innerHeight / 2) / (window.innerHeight / 2);

    // Update Astral Gyro 3D rotation in Hero
    if (astralGyro) {
      astralGyro.style.transform = `rotateX(${normalizedMouseY * 25}deg) rotateY(${normalizedMouseX * 35}deg)`;
    }

    // Process all scene parallax layers
    const windowH = window.innerHeight;
    const currentScroll = state.scrollY;

    sections.forEach((sec, idx) => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;

      // Only calculate if section is in or near viewport bounds
      if (currentScroll + windowH >= secTop - 200 && currentScroll <= secTop + secHeight + 200) {
        const relativeCenter = secTop + secHeight / 2;
        const distFromCenter = (currentScroll + windowH / 2) - relativeCenter;

        const layers = sec.querySelectorAll('.parallax-layer');
        layers.forEach((layer) => {
          const speed = parseFloat(layer.getAttribute('data-speed') || '0.5');
          const tiltFactor = parseFloat(layer.getAttribute('data-tilt') || '0.05');

          // Scroll displacement
          const translateY = distFromCenter * speed;

          // Mouse tilt displacement & perspective rotation
          const tiltX = normalizedMouseX * 45 * tiltFactor;
          const tiltY = normalizedMouseY * 30 * tiltFactor;
          const rotX = -normalizedMouseY * 12 * tiltFactor;
          const rotY = normalizedMouseX * 16 * tiltFactor;

          layer.style.transform = `translate3d(${tiltX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        });
      }
    });

    // Update Active Section & Altimeter
    updateActiveSectionAndHUD();

    // Render Canvas Animations
    renderStarfield();
    renderSingularityCanvas();

    // Autopilot cruise step
    if (state.isAutopilot) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (state.targetScrollY >= maxScroll - 5) {
        state.targetScrollY = 0; // Loop back or stop
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        state.targetScrollY += state.autopilotSpeed;
        window.scrollTo(0, state.targetScrollY);
      }
    }

    requestAnimationFrame(updateParallax);
  }

  // =========================================================================
  // HUD & ALTIMETER TELEMETRY
  // =========================================================================
  function updateActiveSectionAndHUD() {
    const scroll = state.scrollY;
    const windowH = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight - windowH;
    const scrollRatio = Math.max(0, Math.min(1, scroll / (totalHeight || 1)));

    // Update audio dynamic depth
    sound.updateDepth(scrollRatio);

    // Update Velocity HUD
    if (hudVelocity) {
      hudVelocity.textContent = Math.abs(state.velocity).toFixed(2);
    }

    // Determine current active section
    let activeIdx = 0;
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const rect = sec.getBoundingClientRect();
      if (rect.top <= windowH * 0.45 && rect.bottom >= windowH * 0.45) {
        activeIdx = i;
        break;
      }
    }

    if (activeIdx !== state.activeSectionIndex) {
      state.activeSectionIndex = activeIdx;
      const currentSec = sections[activeIdx];
      state.currentZone = currentSec.getAttribute('data-zone') || 'UNKNOWN';
      state.currentAltitude = currentSec.getAttribute('data-alt') || '0 m';

      if (hudAltitude) hudAltitude.textContent = state.currentAltitude;
      if (hudZone) hudZone.textContent = state.currentZone;

      // Update Nav Pills Active state
      navPills.forEach((pill, idx) => {
        pill.classList.toggle('active', idx === activeIdx);
      });
    }

    // Update Altimeter track progress
    if (altimeterIndicator) {
      altimeterIndicator.style.top = `${scrollRatio * 100}%`;
    }
  }

  // =========================================================================
  // INTERACTIVE BUBBLES GENERATOR (ZONE 2)
  // =========================================================================
  function initInteractiveBubbles() {
    if (!bubbleContainer) return;
    const BUBBLE_COUNT = 18;

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      createBubble();
    }
  }

  function createBubble() {
    if (!bubbleContainer) return;
    const bubble = document.createElement('div');
    bubble.className = 'water-bubble';

    const size = Math.floor(Math.random() * 45) + 20;
    const left = Math.random() * 90 + 5;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 10;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `-${delay}s`;

    // Interactive Pop on Hover or Click
    const pop = (e) => {
      e.stopPropagation();
      sound.playBubblePop();
      bubble.style.transform = 'scale(1.8)';
      bubble.style.opacity = '0';
      setTimeout(() => {
        bubble.remove();
        createBubble();
      }, 250);
    };

    bubble.addEventListener('mouseenter', pop);
    bubble.addEventListener('click', pop);

    bubbleContainer.appendChild(bubble);
  }

  // =========================================================================
  // FIREFLIES GENERATOR (ZONE 3)
  // =========================================================================
  function initFireflies() {
    if (!firefliesField) return;
    const FIREFLY_COUNT = 24;

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const fly = document.createElement('div');
      fly.className = 'firefly';
      fly.style.left = `${Math.random() * 95}%`;
      fly.style.top = `${Math.random() * 90}%`;
      fly.style.animationDuration = `${Math.random() * 4 + 3}s`;
      fly.style.animationDelay = `-${Math.random() * 5}s`;
      firefliesField.appendChild(fly);
    }
  }

  // =========================================================================
  // ARTIFACT CODEX SYSTEM
  // =========================================================================
  function renderCodexList() {
    if (!codexList) return;
    codexList.innerHTML = '';

    const discoveredCount = state.discoveredArtifacts.size;
    const totalCount = state.artifactsList.length;

    if (codexCounter) codexCounter.textContent = `${discoveredCount}/${totalCount}`;
    if (codexFill) codexFill.style.width = `${(discoveredCount / totalCount) * 100}%`;
    if (codexStatus) codexStatus.textContent = `${discoveredCount} OF ${totalCount} RELICS DISCOVERED`;

    state.artifactsList.forEach((art) => {
      const isFound = state.discoveredArtifacts.has(art.id);
      const item = document.createElement('div');
      item.className = `codex-item ${isFound ? 'unlocked' : 'locked'}`;

      item.innerHTML = `
        <div class="codex-item-icon">
          ${isFound ? art.icon : '🔒'}
        </div>
        <div class="codex-item-info">
          <div class="codex-item-title">${isFound ? art.name : 'Unknown Anomaly'}</div>
          <div class="codex-item-realm">${art.realm} • ${art.depth}</div>
          ${isFound ? `<p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;">${art.desc}</p>` : ''}
        </div>
      `;
      codexList.appendChild(item);
    });

    // Update collectible visual node states on page
    document.querySelectorAll('.collectible-node').forEach((node) => {
      const id = parseInt(node.getAttribute('data-id') || '0', 10);
      if (state.discoveredArtifacts.has(id)) {
        node.classList.add('discovered');
        const tooltip = node.querySelector('.artifact-tooltip');
        if (tooltip) tooltip.textContent = 'SCANNED & ARCHIVED';
      }
    });
  }

  function handleArtifactClick(node) {
    const id = parseInt(node.getAttribute('data-id') || '0', 10);
    const name = node.getAttribute('data-name') || 'Anomaly';
    const realm = node.getAttribute('data-realm') || 'Unknown';

    if (!state.discoveredArtifacts.has(id)) {
      state.discoveredArtifacts.add(id);
      localStorage.setItem('ascent_artifacts', JSON.stringify(Array.from(state.discoveredArtifacts)));
      sound.playChime(1 + id * 0.15);
      showToast(`✨ DISCOVERED: ${name} (${realm})`);
      renderCodexList();

      if (state.discoveredArtifacts.size === state.artifactsList.length) {
        showToast(`🌌 ALL CODEX RELICS UNLOCKED! OVERDRIVE ENGAGED!`);
        document.body.classList.add('overdrive-unlocked');
      }
    } else {
      sound.playChime(1.5);
      showToast(`Specimen already catalogued: ${name}`);
    }
  }

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastNotification._timer);
    toastNotification._timer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3500);
  }

  // =========================================================================
  // EVENT LISTENERS & NAVIGATION
  // =========================================================================
  function initEventListeners() {
    // Scroll Sync
    window.addEventListener('scroll', () => {
      state.targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
    }, { passive: true });

    // Pointer Tracking
    window.addEventListener('mousemove', (e) => {
      state.targetMouseX = e.clientX;
      state.targetMouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
      }
      if (cursorRing) {
        cursorRing.style.left = `${e.clientX}px`;
        cursorRing.style.top = `${e.clientY}px`;
      }
    });

    // Custom Cursor Hover expansion
    const interactiveElements = 'a, button, .nav-pill, .collectible-node, .water-bubble, .waypoint-marker';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Resize Event
    window.addEventListener('resize', () => {
      initStarfield();
      initSingularityCanvas();
    });

    // Navigation Pills Jump
    navPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const targetId = pill.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Altimeter Waypoints Jump
    waypointMarkers.forEach((marker, idx) => {
      marker.addEventListener('click', () => {
        if (sections[idx]) {
          sections[idx].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Audio Toggle
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const isPlaying = sound.toggle();
        btnAudio.classList.toggle('active', isPlaying);
        const iconOn = btnAudio.querySelector('.icon-sound-on');
        const iconOff = btnAudio.querySelector('.icon-sound-off');
        if (iconOn && iconOff) {
          iconOn.style.display = isPlaying ? 'block' : 'none';
          iconOff.style.display = isPlaying ? 'none' : 'block';
        }
        showToast(isPlaying ? '🎵 Generative Soundscape Activated' : '🔇 Audio Muted');
      });
    }

    // Autopilot Toggle
    if (btnAutopilot) {
      btnAutopilot.addEventListener('click', () => {
        state.isAutopilot = !state.isAutopilot;
        btnAutopilot.classList.toggle('active', state.isAutopilot);
        showToast(state.isAutopilot ? '🚀 Autopilot Cruise Engaged' : '🛑 Autopilot Disengaged');
      });
    }

    // Codex Drawer Controls
    if (btnCodex) {
      btnCodex.addEventListener('click', () => {
        codexDrawer.classList.add('open');
        drawerBackdrop.classList.add('open');
      });
    }
    if (btnCloseCodex) {
      btnCloseCodex.addEventListener('click', () => {
        codexDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('open');
      });
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', () => {
        codexDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('open');
      });
    }

    // Guide Modal Controls
    const openGuide = () => {
      if (guideModal) guideModal.classList.add('open');
    };
    const closeGuide = () => {
      if (guideModal) guideModal.classList.remove('open');
    };
    if (btnViewManual) btnViewManual.addEventListener('click', openGuide);
    if (btnCloseGuide) btnCloseGuide.addEventListener('click', closeGuide);
    if (btnCloseGuideAction) btnCloseGuideAction.addEventListener('click', closeGuide);
    if (linkControls) linkControls.addEventListener('click', (e) => { e.preventDefault(); openGuide(); });
    if (linkCredits) linkCredits.addEventListener('click', (e) => {
      e.preventDefault();
      codexDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
    });

    // Collectible Click Listeners
    document.querySelectorAll('.collectible-node').forEach((node) => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        handleArtifactClick(node);
      });
    });

    // Hero CTA Dive
    if (btnDive) {
      btnDive.addEventListener('click', () => {
        const abyss = document.getElementById('abyss');
        if (abyss) abyss.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Re-ascend CTA
    if (btnReascend) {
      btnReascend.addEventListener('click', () => {
        const hero = document.getElementById('hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Hyperdrive Warp CTA
    if (btnHyperdrive) {
      btnHyperdrive.addEventListener('click', () => {
        sound.playWarpSound();
        showToast('⚡ HYPERDRIVE WARP PULSE FIRED!');
        state.autopilotSpeed = 8.0;
        state.isAutopilot = true;
        if (btnAutopilot) btnAutopilot.classList.add('active');
        setTimeout(() => {
          state.autopilotSpeed = 2.2;
        }, 3000);
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (btnAutopilot) btnAutopilot.click();
          break;
        case 'm':
        case 'M':
          if (btnAudio) btnAudio.click();
          break;
        case 'c':
        case 'C':
          if (codexDrawer) {
            if (codexDrawer.classList.contains('open')) {
              codexDrawer.classList.remove('open');
              drawerBackdrop.classList.remove('open');
            } else {
              codexDrawer.classList.add('open');
              drawerBackdrop.classList.add('open');
            }
          }
          break;
        case 'Escape':
          closeGuide();
          if (codexDrawer) {
            codexDrawer.classList.remove('open');
            drawerBackdrop.classList.remove('open');
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          const targetSection = sections[parseInt(e.key, 10) - 1];
          if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
          break;
      }
    });
  }

  // =========================================================================
  // BOOTSTRAP INITIALIZATION
  // =========================================================================
  function init() {
    state.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    state.targetScrollY = state.scrollY;

    initStarfield();
    initSingularityCanvas();
    initInteractiveBubbles();
    initFireflies();
    renderCodexList();
    initEventListeners();

    // Start Main Animation Engine
    requestAnimationFrame(updateParallax);
    console.log('%c🌌 ASCENT: Parallax Odyssey Initialized', 'color:#38bdf8; font-weight:bold; font-size:14px;');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
