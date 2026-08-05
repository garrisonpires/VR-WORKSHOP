/* ===============================================================
   LUMINA – Custom A-Frame Components & Game Logic
   lumina.js
   =============================================================== */

'use strict';

// ─── UTILITY ────────────────────────────────────────────────────────────────

const LUMINA = {
  state: {
    fuel: 100,
    oxygen: 100,
    hull: 100,
    shield: 100,
    velocity: 0,
    xp: 0,
    level: 1,
    credits: 850,
    minerals: 3,
    crystals: 1,
    evaMode: false,
    nearBlackHole: false,
    currentPlanet: null,
    missionProgress: 35,
    upgrades: {
      thrusters: 1,
      scanner: 1,
      fuelEff: 0,
      shield: 1,
      navigation: 0,
      ai: 1,
      jetpack: 0,
      radar: 1,
      storage: 0,
      appearance: 0
    }
  },

  planetData: {
    mercury:  { name:'MERCURY',  icon:'☿', temp:'-180°C to 430°C', atmo:'None', gravity:'3.7 m/s²', diameter:'4,879 km', dist:'57.9M km', fact:'Mercury has no atmosphere, so it has extreme temperature swings.' },
    venus:    { name:'VENUS',    icon:'♀', temp:'465°C',          atmo:'CO₂, N₂', gravity:'8.87 m/s²', diameter:'12,104 km', dist:'108.2M km', fact:'Venus is the hottest planet despite not being closest to the Sun.' },
    earth:    { name:'EARTH',    icon:'🌍', temp:'15°C avg',       atmo:'N₂, O₂', gravity:'9.81 m/s²', diameter:'12,742 km', dist:'149.6M km', fact:'71% of Earth\'s surface is covered by water.' },
    moon:     { name:'THE MOON', icon:'🌙', temp:'-173°C to 127°C',atmo:'Trace', gravity:'1.62 m/s²', diameter:'3,474 km', dist:'384,400 km', fact:'The Moon is slowly drifting away from Earth at ~3.8 cm/year.' },
    mars:     { name:'MARS',     icon:'♂', temp:'-63°C avg',      atmo:'CO₂', gravity:'3.72 m/s²', diameter:'6,779 km', dist:'227.9M km', fact:'Mars has the tallest volcano in the solar system: Olympus Mons.' },
    jupiter:  { name:'JUPITER',  icon:'♃', temp:'-108°C',         atmo:'H₂, He', gravity:'24.8 m/s²', diameter:'139,820 km', dist:'778.5M km', fact:'Jupiter\'s Great Red Spot is a storm that has lasted over 350 years.' },
    saturn:   { name:'SATURN',   icon:'♄', temp:'-138°C',         atmo:'H₂, He', gravity:'10.4 m/s²', diameter:'116,460 km', dist:'1.43B km', fact:'Saturn\'s rings are made mostly of ice and rock, spanning 282,000 km.' },
    uranus:   { name:'URANUS',   icon:'⛢', temp:'-197°C',         atmo:'H₂, He, CH₄', gravity:'8.87 m/s²', diameter:'50,724 km', dist:'2.87B km', fact:'Uranus rotates on its side with an axial tilt of 97.77°.' },
    neptune:  { name:'NEPTUNE',  icon:'♆', temp:'-201°C',         atmo:'H₂, He, CH₄', gravity:'11.15 m/s²', diameter:'49,244 km', dist:'4.5B km', fact:'Neptune has the fastest winds in the solar system at 2,100 km/h.' },
    wormhole: { name:'WORMHOLE', icon:'🌀', temp:'Unknown',        atmo:'Exotic matter', gravity:'Undefined', diameter:'Variable', dist:'Unknown', fact:'Wormholes are theoretical tunnels through spacetime predicted by general relativity.' },
    blackhole:{ name:'BLACK HOLE',icon:'⚫',temp:'~0 K',           atmo:'Event Horizon', gravity:'∞ at singularity', diameter:'Variable', dist:'Variable', fact:'Time slows down near a black hole due to extreme gravitational time dilation.' }
  },

  novaMessages: [
    'Welcome aboard the LUMINA Explorer. I am NOVA, your AI navigation companion.',
    'Unknown planet detected on long-range scanners. Investigating...',
    'Fascinating — gravitational readings suggest a dense metallic core.',
    'Excellent discovery, Commander. This data will advance our research.',
    'Warning: Radiation levels increasing. Recommend raising shields.',
    'I\'ve detected an alien beacon signature. Shall we investigate?',
    'Fuel reserves at 60%. Consider refueling before deep-space transit.',
    'Asteroid field ahead. Reducing speed recommended.',
    'Wormhole signature detected! This could take us to a new galaxy.',
    'Remarkable. These ruins suggest an advanced ancient civilization.',
    'Energy crystal cluster detected. EVA mode recommended for collection.',
    'Mission progress updated. Outstanding work, Commander.'
  ],

  showNotification(msg, type = '') {
    const container = document.getElementById('notifications');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  },

  speakNova(index) {
    const panel = document.getElementById('nova-panel');
    const textEl = document.getElementById('nova-text');
    if (!panel || !textEl) return;
    const msg = typeof index === 'string' ? index : this.novaMessages[index % this.novaMessages.length];
    textEl.textContent = `"${msg}"`;
    panel.classList.remove('hidden');
    clearTimeout(this._novaTimeout);
    this._novaTimeout = setTimeout(() => panel.classList.add('hidden'), 6000);
  },

  showPlanetScanner(key) {
    const data = this.planetData[key];
    if (!data) return;
    const panel = document.getElementById('planet-scanner');
    if (!panel) return;
    panel.querySelector('.scanner-planet-name').textContent = data.name;
    panel.querySelector('#scan-icon').textContent = data.icon;
    panel.querySelector('#scan-temp').textContent = data.temp;
    panel.querySelector('#scan-atmo').textContent = data.atmo;
    panel.querySelector('#scan-grav').textContent = data.gravity;
    panel.querySelector('#scan-diam').textContent = data.diameter;
    panel.querySelector('#scan-dist').textContent = data.dist;
    panel.querySelector('#scan-fact').textContent = data.fact;
    panel.classList.remove('hidden');
    this.state.currentPlanet = key;
    clearTimeout(this._scannerTimeout);
    this._scannerTimeout = setTimeout(() => panel.classList.add('hidden'), 8000);
  },

  hidePlanetScanner() {
    document.getElementById('planet-scanner')?.classList.add('hidden');
    this.state.currentPlanet = null;
  },

  updateMeters() {
    const s = this.state;
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.style.width = val + '%';
    };
    set('fuel-bar', s.fuel);
    set('oxygen-bar', s.oxygen);
    set('hull-bar', s.hull);
    set('shield-bar', s.shield);

    const fuelV = document.getElementById('fuel-val');
    const oxyV = document.getElementById('oxygen-val');
    const hullV = document.getElementById('hull-val');
    const shieldV = document.getElementById('shield-val');
    if (fuelV) fuelV.textContent = Math.round(s.fuel) + '%';
    if (oxyV) oxyV.textContent = Math.round(s.oxygen) + '%';
    if (hullV) hullV.textContent = Math.round(s.hull) + '%';
    if (shieldV) shieldV.textContent = Math.round(s.shield) + '%';

    const velEl = document.getElementById('velocity-val');
    if (velEl) velEl.textContent = Math.round(s.velocity);

    // XP
    const xpFill = document.getElementById('xp-fill');
    const xpLabel = document.getElementById('xp-label');
    const xpPct = (s.xp % 1000) / 10;
    if (xpFill) xpFill.style.width = xpPct + '%';
    if (xpLabel) xpLabel.textContent = `LVL ${s.level}  ·  ${s.xp % 1000}/1000 XP`;

    // Credits
    const credEl = document.getElementById('credits-val');
    if (credEl) credEl.textContent = s.credits;
  },

  gainXP(amount) {
    this.state.xp += amount;
    if (this.state.xp >= this.state.level * 1000) {
      this.state.level++;
      this.showNotification(`⬆ LEVEL UP! You are now Level ${this.state.level}`, 'success');
      this.speakNova(`Level ${this.state.level} reached, Commander. New systems unlocked.`);
    }
    this.updateMeters();
  }
};

// ─── CLOCK ──────────────────────────────────────────────────────────────────

function updateClock() {
  const el = document.getElementById('hud-clock');
  if (!el) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${hh}:${mm}:${ss} UTC`;
}
setInterval(updateClock, 1000);
updateClock();

// ─── DYNAMIC EVENTS ─────────────────────────────────────────────────────────

const EVENTS = [
  { msg: '⚡ Solar flare detected! Hull stress increasing.', type: 'danger', novIdx: 4 },
  { msg: '☄ Meteor shower incoming. Evasive maneuvers advised.', type: 'warning', novIdx: 7 },
  { msg: '🌀 Gravity anomaly detected in sector 7.', type: 'warning', novIdx: 2 },
  { msg: '📡 Distress signal received from unknown origin.', type: '', novIdx: 5 },
  { msg: '💎 Energy crystal cluster detected nearby.', type: 'success', novIdx: 10 },
  { msg: '🛰 Damaged satellite detected. EVA mission available.', type: '', novIdx: 11 },
  { msg: '🌌 Wormhole signature growing stronger.', type: 'warning', novIdx: 8 },
  { msg: '👽 Alien beacon activated on nearby planet.', type: 'success', novIdx: 5 }
];

let evtIndex = 0;
function triggerRandomEvent() {
  const evt = EVENTS[evtIndex % EVENTS.length];
  LUMINA.showNotification(evt.msg, evt.type);
  setTimeout(() => LUMINA.speakNova(evt.novIdx), 1000);
  evtIndex++;
  // small resource drain on danger events
  if (evt.type === 'danger') {
    LUMINA.state.hull = Math.max(0, LUMINA.state.hull - 5);
    LUMINA.updateMeters();
  }
}

// Schedule events
setInterval(triggerRandomEvent, 35000);
setTimeout(() => triggerRandomEvent(), 12000);

// ─── FUEL / OXYGEN DRAIN ────────────────────────────────────────────────────

setInterval(() => {
  LUMINA.state.fuel = Math.max(0, LUMINA.state.fuel - 0.05);
  if (LUMINA.state.evaMode) {
    LUMINA.state.oxygen = Math.max(0, LUMINA.state.oxygen - 0.1);
  }
  LUMINA.updateMeters();

  if (LUMINA.state.fuel < 20 && Math.random() < 0.1) {
    LUMINA.showNotification('⛽ Fuel reserves critical! Seek refueling station.', 'danger');
  }
  if (LUMINA.state.oxygen < 20 && LUMINA.state.evaMode) {
    LUMINA.showNotification('😮‍💨 Oxygen low! Return to spacecraft immediately.', 'danger');
  }
}, 1000);

// ─── A-FRAME: STARFIELD COMPONENT ───────────────────────────────────────────

AFRAME.registerComponent('starfield', {
  schema: {
    count: { type: 'number', default: 3000 },
    radius: { type: 'number', default: 400 }
  },
  init() {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const starColors = [
      [1.0, 1.0, 1.0],    // white
      [0.9, 0.9, 1.0],    // cool white
      [1.0, 0.95, 0.8],   // warm white
      [0.7, 0.85, 1.0],   // blue-white
      [1.0, 0.8, 0.6],    // orange
      [0.8, 0.9, 1.0],    // ice blue
    ];
    for (let i = 0; i < this.data.count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = this.data.radius * (0.3 + Math.random() * 0.7);
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const c = starColors[Math.floor(Math.random() * starColors.length)];
      colors.push(c[0], c[1], c[2]);
      sizes.push(Math.random() * 2.5 + 0.5);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.8,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stars = new THREE.Points(geo, mat);
    this.el.object3D.add(this.stars);
  },
  tick(t) {
    this.stars.rotation.y = t * 0.00001;
    this.stars.rotation.x = Math.sin(t * 0.000003) * 0.002;
  }
});

// ─── A-FRAME: SPACE DUST PARTICLES ──────────────────────────────────────────

AFRAME.registerComponent('space-dust', {
  schema: { count: { type: 'number', default: 500 } },
  init() {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < this.data.count; i++) {
      positions.push(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color(0.8, 0.9, 1.0),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.dust = new THREE.Points(geo, mat);
    this.el.object3D.add(this.dust);
    this.velocity = new THREE.Vector3(0.002, 0.001, 0.003);
  },
  tick() {
    this.dust.position.add(this.velocity);
    if (Math.abs(this.dust.position.x) > 40) this.velocity.x *= -1;
    if (Math.abs(this.dust.position.y) > 40) this.velocity.y *= -1;
    if (Math.abs(this.dust.position.z) > 40) this.velocity.z *= -1;
  }
});

// ─── A-FRAME: PLANET ORBIT ───────────────────────────────────────────────────

AFRAME.registerComponent('orbit', {
  schema: {
    radius: { type: 'number', default: 10 },
    speed: { type: 'number', default: 0.1 },
    offset: { type: 'number', default: 0 },
    tilt: { type: 'number', default: 0 }
  },
  init() {
    this.angle = this.data.offset;
  },
  tick(t, dt) {
    this.angle += (dt / 1000) * this.data.speed;
    const x = Math.cos(this.angle) * this.data.radius;
    const z = Math.sin(this.angle) * this.data.radius;
    const y = Math.sin(this.angle) * this.data.tilt;
    this.el.setAttribute('position', { x, y, z });
  }
});

// ─── A-FRAME: SELF-ROTATE ────────────────────────────────────────────────────

AFRAME.registerComponent('self-rotate', {
  schema: {
    speed: { type: 'number', default: 0.2 },
    axis: { type: 'string', default: 'y' }
  },
  tick(t, dt) {
    const rad = (dt / 1000) * this.data.speed;
    this.el.object3D.rotation[this.data.axis] += rad;
  }
});

// ─── A-FRAME: ATMOSPHERE GLOW ───────────────────────────────────────────────

AFRAME.registerComponent('atmosphere', {
  schema: {
    color: { type: 'color', default: '#4488ff' },
    opacity: { type: 'number', default: 0.15 },
    scale: { type: 'number', default: 1.12 }
  },
  init() {
    const radius = parseFloat(this.el.getAttribute('radius') || 1);
    const geo = new THREE.SphereGeometry(radius * this.data.scale, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.data.color),
      transparent: true,
      opacity: this.data.opacity,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.el.object3D.add(mesh);
  }
});

// ─── A-FRAME: WORMHOLE ANIMATION ─────────────────────────────────────────────

AFRAME.registerComponent('wormhole-spin', {
  schema: { speed: { type: 'number', default: 1.5 } },
  tick(t, dt) {
    this.el.object3D.rotation.z += (dt / 1000) * this.data.speed;
  }
});

// ─── A-FRAME: THRUSTER PARTICLES ─────────────────────────────────────────────

AFRAME.registerComponent('thruster-glow', {
  schema: { intensity: { type: 'number', default: 1 } },
  init() {
    this.particles = [];
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.SphereGeometry(0.04, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0, 0.7, 1.0),
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.life = Math.random();
      mesh.userData.speed = 0.02 + Math.random() * 0.05;
      this.el.object3D.add(mesh);
      this.particles.push(mesh);
    }
  },
  tick() {
    this.particles.forEach(p => {
      p.userData.life -= p.userData.speed;
      if (p.userData.life <= 0) {
        p.userData.life = 1;
        p.position.set(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          0
        );
      }
      p.position.z += p.userData.speed * 0.5;
      p.material.opacity = p.userData.life * 0.7;
      const s = p.userData.life;
      p.scale.set(s, s, s);
    });
  }
});

// ─── A-FRAME: COMET ──────────────────────────────────────────────────────────

AFRAME.registerComponent('comet', {
  schema: {
    speed: { type: 'number', default: 0.8 },
    range: { type: 'number', default: 200 }
  },
  init() {
    this.resetPos();
    // tail
    const geo = new THREE.CylinderGeometry(0.02, 0, 4, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.5, 0.9, 1.0),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tail = new THREE.Mesh(geo, mat);
    tail.rotation.x = Math.PI / 2;
    tail.position.z = 2;
    this.el.object3D.add(tail);
  },
  resetPos() {
    const r = this.data.range;
    this.el.setAttribute('position', {
      x: (Math.random() - 0.5) * r,
      y: (Math.random() - 0.5) * r * 0.5,
      z: -r / 2
    });
    this.dir = new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.1,
      this.data.speed
    ).normalize().multiplyScalar(this.data.speed);
  },
  tick(t, dt) {
    const pos = this.el.object3D.position;
    this.dir && pos.add(this.dir.clone().multiplyScalar(dt / 100));
    if (pos.z > this.data.range / 2) this.resetPos();
  }
});

// ─── A-FRAME: HOVERING ASTEROID ──────────────────────────────────────────────

AFRAME.registerComponent('asteroid-drift', {
  schema: { speed: { type: 'number', default: 0.01 } },
  init() {
    this.rotSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    };
    this.driftDir = new THREE.Vector3(
      (Math.random() - 0.5) * this.data.speed,
      (Math.random() - 0.5) * this.data.speed * 0.3,
      (Math.random() - 0.5) * this.data.speed
    );
    this.origin = this.el.object3D.position.clone();
  },
  tick() {
    this.el.object3D.rotation.x += this.rotSpeed.x;
    this.el.object3D.rotation.y += this.rotSpeed.y;
    this.el.object3D.rotation.z += this.rotSpeed.z;
    // drift but keep within range
    this.el.object3D.position.add(this.driftDir);
    const dist = this.el.object3D.position.distanceTo(this.origin);
    if (dist > 5) {
      this.driftDir.negate();
    }
  }
});

// ─── A-FRAME: BLACK HOLE DISTORTION ──────────────────────────────────────────

AFRAME.registerComponent('blackhole-effect', {
  schema: { warningDist: { type: 'number', default: 30 } },
  tick() {
    const camera = document.querySelector('[camera]');
    if (!camera) return;
    const camPos = camera.object3D.position;
    const bhPos = this.el.object3D.position;
    const dist = camPos.distanceTo(bhPos);
    const warning = document.getElementById('blackhole-warning');
    if (!warning) return;
    if (dist < this.data.warningDist) {
      warning.classList.add('active');
      LUMINA.state.nearBlackHole = true;
      if (!this._warned) {
        LUMINA.showNotification('☠ EVENT HORIZON APPROACHING — CRITICAL DANGER!', 'danger');
        LUMINA.speakNova('Warning! Black hole gravity is pulling us in. Maximum thrust required!');
        this._warned = true;
        setTimeout(() => { this._warned = false; }, 20000);
      }
    } else {
      warning.classList.remove('active');
      LUMINA.state.nearBlackHole = false;
    }
  }
});

// ─── A-FRAME: PLANET GAZE SCANNER ────────────────────────────────────────────

AFRAME.registerComponent('planet-scannable', {
  schema: { planet: { type: 'string', default: 'earth' } },
  init() {
    this._gazeStart = null;
    this._gazeThreshold = 2000;
    this._scanned = false;
    this.el.addEventListener('mouseenter', () => {
      this._gazeStart = Date.now();
    });
    this.el.addEventListener('mouseleave', () => {
      this._gazeStart = null;
    });
    this.el.addEventListener('click', () => {
      LUMINA.showPlanetScanner(this.data.planet);
      LUMINA.gainXP(50);
      LUMINA.showNotification(`🔭 Planet scan complete: ${LUMINA.planetData[this.data.planet]?.name}`, 'success');
    });
  },
  tick() {
    if (this._gazeStart && Date.now() - this._gazeStart > this._gazeThreshold) {
      LUMINA.showPlanetScanner(this.data.planet);
      if (!this._scanned) {
        LUMINA.gainXP(30);
        this._scanned = true;
        setTimeout(() => { this._scanned = false; }, 15000);
      }
      this._gazeStart = null;
    }
  }
});

// ─── A-FRAME: WORMHOLE ENTER ─────────────────────────────────────────────────

AFRAME.registerComponent('wormhole-enter', {
  init() {
    this.el.addEventListener('click', () => {
      const overlay = document.getElementById('galaxy-transition');
      if (overlay) {
        overlay.classList.add('active');
        LUMINA.speakNova('Wormhole traversal initiated. Preparing for inter-galactic jump.');
        LUMINA.showNotification('🌀 WORMHOLE ENGAGED — Jumping to unknown galaxy!', 'warning');
        LUMINA.gainXP(200);
        setTimeout(() => {
          overlay.classList.remove('active');
          LUMINA.showNotification('✨ Arrived in new galaxy. Sensors calibrating.', 'success');
          LUMINA.speakNova('We have arrived in an uncharted galaxy, Commander. Remarkable.');
        }, 2500);
      }
    });
  }
});

// ─── A-FRAME: ALIEN ARTIFACT ─────────────────────────────────────────────────

AFRAME.registerComponent('artifact-scannable', {
  schema: { story: { type: 'string', default: 'An ancient device of unknown origin.' } },
  init() {
    this._scanning = false;
    this.el.addEventListener('click', () => {
      if (this._scanning) return;
      this._scanning = true;
      LUMINA.showNotification('📡 Scanning alien artifact...', '');
      setTimeout(() => {
        LUMINA.showNotification(`👽 Scan complete: ${this.data.story}`, 'success');
        LUMINA.speakNova('Extraordinary. This artifact contains encrypted data from a civilization millions of years old.');
        LUMINA.gainXP(150);
        LUMINA.state.credits += 50;
        LUMINA.updateMeters();
        this._scanning = false;
      }, 2000);
    });
  }
});

// ─── A-FRAME: RESOURCE COLLECT ───────────────────────────────────────────────

AFRAME.registerComponent('collectible', {
  schema: {
    type: { type: 'string', default: 'mineral' },
    amount: { type: 'number', default: 1 }
  },
  init() {
    this._collected = false;
    this.el.addEventListener('click', () => {
      if (this._collected) return;
      this._collected = true;
      LUMINA.state[this.data.type + 's'] = (LUMINA.state[this.data.type + 's'] || 0) + this.data.amount;
      LUMINA.gainXP(25 * this.data.amount);
      LUMINA.state.credits += 30 * this.data.amount;
      LUMINA.showNotification(`💎 Collected ${this.data.amount}x ${this.data.type}!`, 'success');
      LUMINA.updateMeters();
      // Animate collect
      const start = this.el.object3D.position.clone();
      const cam = document.querySelector('[camera]').object3D.position;
      const tween = { t: 0 };
      const interval = setInterval(() => {
        tween.t += 0.05;
        this.el.object3D.position.lerp(cam, tween.t);
        this.el.object3D.scale.setScalar(1 - tween.t);
        if (tween.t >= 1) {
          clearInterval(interval);
          this.el.parentNode.removeChild(this.el);
        }
      }, 16);
    });
  },
  tick(t) {
    if (!this._collected) {
      this.el.object3D.position.y = this.el.object3D.userData.baseY 
        || (this.el.object3D.userData.baseY = this.el.object3D.position.y)
        + Math.sin(t * 0.002) * 0.15;
      this.el.object3D.rotation.y = t * 0.001;
    }
  }
});

// ─── UPGRADE MENU ────────────────────────────────────────────────────────────

window.openUpgradeMenu = function() {
  document.getElementById('upgrade-menu')?.classList.remove('hidden');
};

window.closeUpgradeMenu = function() {
  document.getElementById('upgrade-menu')?.classList.add('hidden');
};

window.buyUpgrade = function(system) {
  const cost = { thrusters:200, scanner:150, fuelEff:120, shield:200, navigation:100, ai:180, jetpack:250, radar:130, storage:90, appearance:80 };
  const c = cost[system] || 150;
  if (LUMINA.state.credits < c) {
    LUMINA.showNotification('⚠ Insufficient credits for this upgrade.', 'warning');
    return;
  }
  if ((LUMINA.state.upgrades[system] || 0) >= 5) {
    LUMINA.showNotification('✅ System already at maximum level.', '');
    return;
  }
  LUMINA.state.credits -= c;
  LUMINA.state.upgrades[system] = (LUMINA.state.upgrades[system] || 0) + 1;
  const level = LUMINA.state.upgrades[system];
  LUMINA.showNotification(`🚀 ${system.toUpperCase()} upgraded to Level ${level}!`, 'success');
  LUMINA.speakNova(`${system.charAt(0).toUpperCase() + system.slice(1)} system upgraded. Performance enhanced.`);
  LUMINA.gainXP(100);
  refreshUpgradeMenu();
};

function refreshUpgradeMenu() {
  document.querySelectorAll('.upgrade-card').forEach(card => {
    const sys = card.dataset.system;
    const lvl = LUMINA.state.upgrades[sys] || 0;
    const pips = card.querySelectorAll('.upgrade-pip');
    pips.forEach((p, i) => {
      p.classList.toggle('filled', i < lvl);
    });
    if (lvl >= 5) card.classList.add('maxed');
    const credEl = document.getElementById('credits-val');
    if (credEl) credEl.textContent = LUMINA.state.credits;
  });
}

// ─── EVA MODE TOGGLE ─────────────────────────────────────────────────────────

window.toggleEVA = function() {
  LUMINA.state.evaMode = !LUMINA.state.evaMode;
  const ind = document.getElementById('eva-indicator');
  if (ind) ind.classList.toggle('active', LUMINA.state.evaMode);
  const msg = LUMINA.state.evaMode
    ? '🚶 EVA MODE ACTIVE — Jetpack engaged'
    : '🚀 EVA MODE ENDED — Returning to ship';
  LUMINA.showNotification(msg, LUMINA.state.evaMode ? 'warning' : 'success');
  LUMINA.speakNova(LUMINA.state.evaMode
    ? 'EVA mode activated. Monitor oxygen levels carefully, Commander.'
    : 'EVA complete. Welcome back aboard, Commander.');
};

// ─── KEYBOARD CONTROLS ───────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  switch (e.key.toLowerCase()) {
    case 'u': openUpgradeMenu(); break;
    case 'e': toggleEVA(); break;
    case 'n': LUMINA.speakNova(Math.floor(Math.random() * LUMINA.novaMessages.length)); break;
    case 'escape': closeUpgradeMenu(); break;
  }
});

// ─── VELOCITY SIMULATION ─────────────────────────────────────────────────────

let velTarget = 0;
setInterval(() => {
  velTarget = 180 + Math.sin(Date.now() * 0.001) * 60 + Math.random() * 20;
  LUMINA.state.velocity += (velTarget - LUMINA.state.velocity) * 0.1;
  LUMINA.updateMeters();
}, 500);

// ─── NOVA INTRO SEQUENCE ─────────────────────────────────────────────────────

window.addEventListener('load', () => {
  LUMINA.updateMeters();

  // Loading screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const statuses = [
      'INITIALIZING NAVIGATION CORE...',
      'LOADING STAR CHARTS...',
      'CALIBRATING SENSORS...',
      'CHARGING THRUSTERS...',
      'ACTIVATING NOVA AI...',
      'READY FOR DEPARTURE.'
    ];
    let si = 0;
    const statusEl = document.getElementById('loading-status');
    const statusInterval = setInterval(() => {
      if (statusEl) statusEl.textContent = statuses[si % statuses.length];
      si++;
    }, 700);
    setTimeout(() => {
      clearInterval(statusInterval);
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        LUMINA.speakNova(0);
        LUMINA.showNotification('🚀 LUMINA Explorer initialized. Welcome, Commander.', 'success');
        setTimeout(() => LUMINA.speakNova(1), 8000);
      }, 500);
    }, 4500);
  }
});
