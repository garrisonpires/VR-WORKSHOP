# LUMINA — Immersive WebXR VR Space Exploration & Flight Simulator

LUMINA is an interactive, browser-based space exploration experience built with **A-Frame 1.7.1**. It allows users to freely roam a realistic rendering of our solar system (Explore Mode) or pilot a spacecraft through a hazardous asteroid field (Flight Mode). Designed for both standard desktop browsers and WebXR-enabled VR headsets (such as Meta Quest).

---

## 🚀 Key Features

### 🌌 1. Solar System Explore Mode (`index.html`)
*   **Realistic Planetary Textures:** Features high-resolution, seamless planetary textures based on real space missions (MESSENGER, Magellan, Viking, Clementine, Voyager, etc.).
*   **Volumetric Blue Nebula Void:** A deep space atmosphere featuring volumetric gas clouds (blue, purple, and cyan) with additively blended starfields.
*   **Gaze-Based Planet Scanner:** Point/hover over any planet to instantly display its range, physical size, atmosphere type, and facts. Completed scans reward XP and credits.
*   **Dynamic 3D Range Labels:** Floating labels in space display real-time Astronomical Unit (AU) distance from the player to every planet.
*   **Cosmic Anomalies:** Interactive gravitational black holes (with multi-layered rotating accretion rings and event horizon warning systems) and event-horizon wormholes.

### 🕹️ 2. Spaceship Flight Simulator (`cockpit.html` & `index.html`)
*   **Premium Light-Grey Cockpit:** An illuminated Matte Light-Grey console (`#cbd5e1`/`#d2d6dd`/`#e2e8f0`) complete with armrests, yoke column, thruster quadrants, and illuminated control buttons.
*   **Perfect Windshield Clarity:** Completely clear, low-opacity windshield glass overlay for unobstructed views of space.
*   **3-Axis Flight Controls (Keyboard & VR):**
    *   **Throttle:** `W`/`S` (or left stick in VR) to adjust ship speed.
    *   **Roll:** `A`/`D` or `Left`/`Right` arrows (or left stick X in VR) to bank the spacecraft.
    *   **Yaw:** `Q`/`E` (or right stick X in VR) to turn left/right.
    *   **Pitch:** `Up`/`Down` arrows (or left stick Y in VR) to climb/dive.
    *   **Boost:** Hold `Shift` (or triggers/A-button in VR) to travel at ultra-fast speeds (up to 300 units/sec).
    *   **Brake:** Hold `Space` (or grip buttons in VR) to decelerate quickly.
*   **Attitude Indicator (ADI):** Dynamic 2D artificial horizon indicator tracking pitch and roll rotations in real-time.

### 🔊 3. Synthesized Audio System (`LUMINA_AUDIO`)
Fully synthesized audio nodes generating high-fidelity space sound effects directly in the browser (no external `.mp3` dependencies):
*   **Sub-Bass Drone:** Atmospheric ambient soundscape for space exploration.
*   **Dynamic Engine Hum:** Real-time sawtooth pitch and volume tracking your throttle level.
*   **Black Hole Rumble:** Low-frequency gravity wobble when approaching the singularity.
*   **Interface SFX:** Interactive button clicks, scanning chime chords, and upgrade buy chimes.
*   **NOVA AI:** Integrated synthesized vocals informing you of system status, warnings, and alerts.

---

## 🛠️ Technology Stack
*   **Engine:** A-Frame 1.7.1 (Three.js WebGL/WebXR wrapper)
*   **Logic:** Pure JavaScript (Vanilla DOM & custom A-Frame components)
*   **Styling:** Custom CSS (incorporating modern dark mode HUD gradients and glassmorphism)
*   **Typography:** Google Fonts (Orbitron & Exo 2)

---

## 📂 File Directory

| File | Purpose |
|---|---|
| [`index.html`](file:///d:/VR_WORKSHOP/index.html) | Main game entry point containing the Explore Mode scene, cockpit overlay, and HUD panels. |
| [`cockpit.html`](file:///d:/VR_WORKSHOP/cockpit.html) | Standalone asteroid-dodger flight simulator showcasing flight physics. |
| [`lumina.js`](file:///d:/VR_WORKSHOP/lumina.js) | Shared JavaScript codebase handling Starfields, Orbits, Custom components, and Upgrades. |
| [`lumina.css`](file:///d:/VR_WORKSHOP/lumina.css) | HUD stylesheets, futuristic glow panels, and typography layouts. |

---

## 🎮 How to Play

### 💻 Desktop Browser
1.  Open [`index.html`](file:///d:/VR_WORKSHOP/index.html) in any modern browser (Chrome, Firefox, Edge, Safari).
2.  Press **Explore Mode** or **Flight Mode** on the landing dashboard.
3.  **Explore Mode:** Use WASD keys and mouse-drag to fly around. Look at planets for 2 seconds to scan them. Press `U` to open the ship upgrades menu.
4.  **Flight Mode:** Use `W`/`S` for throttle, `Q`/`E` for yaw, `A`/`D` to roll, and `ArrowUp`/`ArrowDown` to pitch. Dodge incoming asteroids and score points.

### 🥽 WebXR (Meta Quest 1/2/3/3S/Pro)
1.  Serve the project folder using a local server (e.g., `npx serve` or python's `http.server`) over HTTPS or localhost.
2.  Open the address in the Quest browser.
3.  Click the **VR** button in the bottom right corner of the screen to enter immersive VR space.
4.  **Left Thumbstick:** Strafe & Move forward/backward.
5.  **Right Thumbstick:** Smooth Yaw turning.
6.  **Triggers / A-Button:** Engage Thruster Speed Boost.
7.  **Grips / B-Button:** Space brakes.
