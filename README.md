# ASCENT — Interactive Parallax Scrolling Odyssey

An interactive, multi-layered vertical parallax scrolling web experience crafted with pure HTML5, CSS3, JavaScript, Canvas 2D, and the Web Audio API.

Experience a journey across 6 planetary strata—from the crushing depths of the oceanic hadal zone to the event horizon of an infinite cosmic singularity.

---

## 🌟 Key Features

### 1. Dual-Engine Parallax Architecture
- **Multi-Velocity Scroll Parallax**: Background, midground, narrative, and foreground planes travel at differential velocities (`data-speed` between `0.1x` and `1.5x`), producing deep stereoscopic depth.
- **Dynamic 3D Pointer Tilt**: Mouse cursor displacement drives subtle spatial 3D rotation (`rotateX`, `rotateY`, `translate3d`) across all active layers for an organic, tactile perspective shift.
- **Linear Interpolation (LERP)**: Buttery smooth 60–120 FPS rendering powered by hardware-accelerated transforms and `requestAnimationFrame`.

### 2. Six Immersive Strata & Realms
1. **Surface Nexus (0 m)**: The launching hub featuring an interactive 3D gyroscope that tracks cursor orientation, floating glass monoliths, and neon grid floor.
2. **The Mariana Abyss (-11,000 m)**: Crushing trench canyon silhouettes, pulsing hydrothermal vents with thermal smoke, drifting bioluminescent jellyfish, and abyssal kelp.
3. **The Coral Twilight (-500 m)**: Volumetric god-ray caustics, a giant pelagic manta ray gliding across the reef, and interactive bubbles that expand and pop on hover or click.
4. **The Emerald Highlands (+1,200 m)**: Mountain silhouettes, pine ridge mist, ancient shrine pillars, swaying branches, and reactive fireflies.
5. **The Stratosphere Realm (+18,000 m)**: Earth's limb curvature, floating magnetic sky islands, cascading vapor mist, and pastel sunset clouds.
6. **Orbital Station Aethelgard (+420 km)**: Rotating habitat rings, solar panel arrays, space station communication modules, and a floating astronaut.
7. **The Quantum Nexus (+∞)**: Relativistic spacetime singularity with dynamic canvas accretion disk simulation, gravitational warp portal rings, and tesseract monolith.

### 3. Generative Web Audio Synthesizer
- Built-in multi-oscillator synthesizer running on the **Web Audio API** with zero external audio assets.
- **Altitude-Adaptive Drone**: Sound shifts automatically from deep sub-bass low-pass rumbles in the Abyss to airy wind resonance in the Highlands and high-frequency crystalline harmonics in Orbit.
- **Synthesized SFX**: Distinct audio feedback for bubble pops, artifact discovery chimes, and warp drive acceleration.

### 4. Interactive Artifact Codex
- 6 hidden anomalies hidden throughout the journey (indicated by floating glowing diamond nodes).
- Clicking an anomaly scans it, triggers visual/audio celebrations, and archives it to your persistent **Expedition Codex** (saved via `localStorage`).
- Discovering all 6 anomalies activates the **Hyperdrive Overdrive Mode**.

### 5. Telemetry HUD & Autopilot
- Real-time Altimeter sidebar displaying depth/altitude, current zone, and instantaneous scroll velocity.
- Interactive waypoint elevator allowing one-click teleportation between strata.
- **Autopilot Cruise Mode**: Sit back and let the page scroll through the odyssey automatically at a cinematic velocity.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Toggle Autopilot Cruise Mode |
| <kbd>M</kbd> | Toggle Ambient Generative Audio |
| <kbd>C</kbd> | Open / Close Expedition Codex |
| <kbd>Esc</kbd> | Close Modals & Codex Drawer |
| <kbd>1</kbd> – <kbd>7</kbd> | Quick Jump to Strata 1 through 7 |

---

## 🚀 How to Run

Zero build tools, npm packages, or configuration required:

1. **Directly in Browser**: Double-click [index.html](file:///d:/WebDevIITB/Interactive%20Parallax%20Scrolling%20Page/index.html) to open in Chrome, Edge, Safari, or Firefox.
2. **Using Python**:
   ```bash
   cd "Interactive Parallax Scrolling Page"
   python -m http.server 8000
   ```
   Then open `http://localhost:8000`.
3. **Using VS Code Live Server**: Right-click `index.html` and click **Open with Live Server**.

---

## 📁 File Structure

```
Interactive Parallax Scrolling Page/
├── index.html       # Semantic layout, SVG graphics, HUD & 6 realm sections
├── style.css        # Hardware-accelerated 3D parallax styles, animations & glassmorphism
├── script.js        # Dual-parallax engine, Web Audio synth, canvas particles, & codex logic
└── README.md        # Documentation, feature highlights & controls
```
