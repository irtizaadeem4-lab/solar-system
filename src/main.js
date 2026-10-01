import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ================================================================
   Solar System — three.js demo
   All textures are generated procedurally on <canvas>, so the demo
   works fully offline with no asset downloads.
   ================================================================ */

// ----------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------

/** Visual days advanced per second at speed = 1. */
const DAYS_PER_SECOND = 6;
/** Moon orbits are slowed down so fast moons stay readable. */
const MOON_DAYS_PER_SECOND = 2;
const MIN_MOON_ORBIT_SECONDS = 3;

const SUN_RADIUS = 6.2;

const PLANET_DATA = [
  {
    name: 'Mercury',
    radius: 0.62,
    orbit: 17,
    periodDays: 88,
    rotationHours: 1407.6,
    tilt: 0.03,
    startAngle: 2.1,
    palette: ['#9a8f85', '#7d7268', '#b3a89c', '#645b53'],
    type: 'Terrestrial planet',
    desc: 'The smallest planet and the closest to the Sun, scorched by day and frozen by night.',
    facts: [
      ['Diameter', '4,879 km'],
      ['Day length', '59 Earth days'],
      ['Year', '88 Earth days'],
      ['Distance from Sun', '57.9M km (0.39 AU)'],
      ['Moons', '0'],
      ['Avg. temperature', '167 °C'],
    ],
  },
  {
    name: 'Venus',
    radius: 0.88,
    orbit: 24,
    periodDays: 224.7,
    rotationHours: -5832.5, // retrograde
    tilt: 177.4,
    startAngle: 4.4,
    palette: ['#e8d5a3', '#d8bd7f', '#f2e6c4', '#c4a468'],
    type: 'Terrestrial planet',
    desc: 'A rocky world wrapped in a runaway greenhouse atmosphere hotter than an oven.',
    facts: [
      ['Diameter', '12,104 km'],
      ['Day length', '243 Earth days'],
      ['Year', '225 Earth days'],
      ['Distance from Sun', '108.2M km (0.72 AU)'],
      ['Moons', '0'],
      ['Avg. temperature', '464 °C'],
    ],
  },
  {
    name: 'Earth',
    radius: 0.92,
    orbit: 32,
    periodDays: 365.25,
    rotationHours: 23.9,
    tilt: 23.4,
    startAngle: 0.6,
    palette: ['#1c4f9c', '#2a6f3a', '#3f8f4a', '#c9b58a', '#123c78'],
    type: 'Terrestrial planet',
    desc: 'The only known world with oceans of liquid water and life.',
    facts: [
      ['Diameter', '12,756 km'],
      ['Day length', '24 hours'],
      ['Year', '365.25 days'],
      ['Distance from Sun', '149.6M km (1 AU)'],
      ['Moons', '1'],
      ['Avg. temperature', '15 °C'],
    ],
  },
  {
    name: 'Mars',
    radius: 0.71,
    orbit: 41,
    periodDays: 687,
    rotationHours: 24.6,
    tilt: 25.2,
    startAngle: 5.5,
    palette: ['#c1502e', '#9e3b1f', '#d97b4a', '#7c2f1a'],
    type: 'Terrestrial planet',
    desc: 'The rusty red planet, home to the largest volcano and canyon in the solar system.',
    facts: [
      ['Diameter', '6,792 km'],
      ['Day length', '24.7 hours'],
      ['Year', '687 Earth days'],
      ['Distance from Sun', '227.9M km (1.52 AU)'],
      ['Moons', '2'],
      ['Avg. temperature', '-65 °C'],
    ],
  },
  {
    name: 'Jupiter',
    radius: 2.35,
    orbit: 58,
    periodDays: 4331,
    rotationHours: 9.9,
    tilt: 3.1,
    startAngle: 1.7,
    palette: ['#d8a878', '#b57b4e', '#f0dcc0', '#8f5a38', '#e8c9a0'],
    gasGiant: true,
    spot: { color: '#a63d1e', y: 0.62, size: 0.16 },
    type: 'Gas giant',
    desc: 'The largest planet — a stormy colossus whose Great Red Spot could swallow Earth.',
    facts: [
      ['Diameter', '142,984 km'],
      ['Day length', '9.9 hours'],
      ['Year', '11.9 Earth years'],
      ['Distance from Sun', '778.5M km (5.2 AU)'],
      ['Moons', '95'],
      ['Avg. temperature', '-110 °C'],
    ],
  },
  {
    name: 'Saturn',
    radius: 2.1,
    orbit: 74,
    periodDays: 10747,
    rotationHours: 10.7,
    tilt: 26.7,
    startAngle: 3.6,
    palette: ['#e3cf9a', '#c9b177', '#f2e5c0', '#b39a63'],
    gasGiant: true,
    rings: true,
    type: 'Gas giant',
    desc: 'The ringed giant — its spectacular rings are made of countless chunks of ice and rock.',
    facts: [
      ['Diameter', '120,536 km'],
      ['Day length', '10.7 hours'],
      ['Year', '29.4 Earth years'],
      ['Distance from Sun', '1.43B km (9.58 AU)'],
      ['Moons', '146'],
      ['Avg. temperature', '-140 °C'],
    ],
  },
  {
    name: 'Uranus',
    radius: 1.5,
    orbit: 89,
    periodDays: 30589,
    rotationHours: -17.2, // retrograde
    tilt: 97.8,
    startAngle: 5.0,
    palette: ['#8fd8dc', '#a9e6e8', '#79c4c9', '#c2f0f1'],
    type: 'Ice giant',
    desc: 'An ice giant that rolls around the Sun on its side, tipped over by an ancient impact.',
    facts: [
      ['Diameter', '51,118 km'],
      ['Day length', '17.2 hours'],
      ['Year', '84 Earth years'],
      ['Distance from Sun', '2.87B km (19.2 AU)'],
      ['Moons', '28'],
      ['Avg. temperature', '-195 °C'],
    ],
  },
  {
    name: 'Neptune',
    radius: 1.48,
    orbit: 102,
    periodDays: 59800,
    rotationHours: 16.1,
    tilt: 28.3,
    startAngle: 0.9,
    palette: ['#2f5fd0', '#3f74e8', '#2449a8', '#6b96f5'],
    type: 'Ice giant',
    desc: 'The windiest planet, with supersonic storms howling across its deep blue atmosphere.',
    facts: [
      ['Diameter', '49,528 km'],
      ['Day length', '16.1 hours'],
      ['Year', '164.8 Earth years'],
      ['Distance from Sun', '4.52B km (30 AU)'],
      ['Moons', '16'],
      ['Avg. temperature', '-200 °C'],
    ],
  },
];

const MOON_DATA = {
  Earth: [
    { name: 'Moon', radius: 0.25, distance: 2.7, periodDays: 27.3, palette: ['#b9b3ab', '#8f8a83', '#d2cdc6'] },
  ],
  Jupiter: [
    { name: 'Io', radius: 0.16, distance: 3.1, periodDays: 1.77, palette: ['#e8d46a', '#c9a83c', '#f2e79a'] },
    { name: 'Europa', radius: 0.14, distance: 3.8, periodDays: 3.55, palette: ['#dcd4c8', '#b8ab9a', '#f0ebe3'] },
    { name: 'Ganymede', radius: 0.2, distance: 4.6, periodDays: 7.15, palette: ['#a89a8a', '#7d7064', '#c4b8aa'] },
    { name: 'Callisto', radius: 0.22, distance: 5.5, periodDays: 16.7, palette: ['#6f675e', '#544e47', '#8a8177'] },
  ],
  Saturn: [
    { name: 'Titan', radius: 0.22, distance: 4.4, periodDays: 15.9, palette: ['#d9a24a', '#b8853a', '#e8bd70'] },
  ],
};

// ----------------------------------------------------------------
// Procedural texture helpers
// ----------------------------------------------------------------

function makeTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/** Seamless-by-construction periodic noise along the texture height. */
function periodicNoise(y, h, phases) {
  let n = 0;
  const freqs = [1, 2, 3, 5, 7];
  for (let i = 0; i < phases.length; i++) {
    n += Math.sin((2 * Math.PI * freqs[i] * y) / h + phases[i]) / (i + 1.6);
  }
  return (n / phases.length + 1) / 2; // → 0..1
}

function drawBandedTexture(ctx, w, h, palette, opts = {}) {
  const phases = palette.map(() => Math.random() * Math.PI * 2);
  const rowH = opts.rowH ?? 2;
  for (let y = 0; y < h; y += rowH) {
    const n = periodicNoise(y, h, phases);
    const idx = n * (palette.length - 1);
    const i0 = Math.floor(idx);
    const i1 = Math.min(palette.length - 1, i0 + 1);
    const t = idx - i0;
    const c0 = new THREE.Color(palette[i0]);
    const c1 = new THREE.Color(palette[i1]);
    const c = c0.clone().lerp(c1, t);
    ctx.fillStyle = `#${c.getHexString()}`;
    ctx.fillRect(0, y, w, rowH);
  }
  // Turbulent streaks
  const streaks = opts.streaks ?? 90;
  for (let i = 0; i < streaks; i++) {
    const y = Math.random() * h;
    const hgt = 1 + Math.random() * 4;
    const x = Math.random() * w;
    const len = w * (0.08 + Math.random() * 0.35);
    const light = Math.random() > 0.5;
    ctx.globalAlpha = 0.06 + Math.random() * 0.12;
    ctx.fillStyle = light ? '#ffffff' : '#000000';
    ctx.fillRect(x, y, len, hgt);
    if (x + len > w) ctx.fillRect(x - w, y, len, hgt); // wrap seam
  }
  ctx.globalAlpha = 1;
}

/** Draw a blob at x and at x±w so it wraps seamlessly. */
function wrapBlob(ctx, w, x, y, r, color, alpha) {
  for (const ox of [x - w, x, x + w]) {
    const grad = ctx.createRadialGradient(ox, y, 0, ox, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ox, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function makeRockyTexture(palette, opts = {}) {
  return makeTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);
    const blobs = opts.blobs ?? 150;
    for (let i = 0; i < blobs; i++) {
      const c = palette[1 + Math.floor(Math.random() * (palette.length - 1))];
      wrapBlob(
        ctx, w,
        Math.random() * w, Math.random() * h,
        6 + Math.random() * (opts.blobSize ?? 34),
        c, 0.16 + Math.random() * 0.3,
      );
    }
    if (opts.craters) {
      for (let i = 0; i < opts.craters; i++) {
        const x = Math.random() * w;
        const y = 30 + Math.random() * (h - 60);
        const r = 3 + Math.random() * 12;
        const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
        grad.addColorStop(0, 'rgba(0,0,0,0.35)');
        grad.addColorStop(0.75, 'rgba(0,0,0,0.18)');
        grad.addColorStop(1, 'rgba(255,255,255,0.16)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (opts.polarCaps) {
      const capGradT = ctx.createLinearGradient(0, 0, 0, h * 0.14);
      capGradT.addColorStop(0, 'rgba(255,255,255,0.92)');
      capGradT.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = capGradT;
      ctx.fillRect(0, 0, w, h * 0.14);
      const capGradB = ctx.createLinearGradient(0, h, 0, h * 0.86);
      capGradB.addColorStop(0, 'rgba(255,255,255,0.92)');
      capGradB.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = capGradB;
      ctx.fillRect(0, h * 0.86, w, h * 0.14);
    }
  });
}

function makeEarthTexture() {
  return makeTexture(1024, 512, (ctx, w, h) => {
    // Ocean
    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#123c78');
    ocean.addColorStop(0.5, '#1c4f9c');
    ocean.addColorStop(1, '#0e3468');
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, w, h);
    // Continents
    const land = ['#2a6f3a', '#3f8f4a', '#57733a', '#c9b58a', '#2f5c31'];
    for (let i = 0; i < 42; i++) {
      const x = Math.random() * w;
      const y = 40 + Math.random() * (h - 80);
      const r = 24 + Math.random() * 95;
      const c = land[Math.floor(Math.random() * land.length)];
      wrapBlob(ctx, w, x, y, r, c, 0.75);
      // Coast shading
      wrapBlob(ctx, w, x, y, r * 1.25, 'rgba(18,44,60,0.35)', 0.4);
    }
    // Clouds
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const rx = 20 + Math.random() * 70;
      const ry = 8 + Math.random() * 22;
      for (const ox of [x - w, x, x + w]) {
        const grad = ctx.createRadialGradient(ox, y, 0, ox, y, rx);
        grad.addColorStop(0, 'rgba(255,255,255,0.85)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.save();
        ctx.translate(ox, y);
        ctx.scale(1, ry / rx);
        ctx.translate(-ox, -y);
        ctx.globalAlpha = 0.28 + Math.random() * 0.3;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, y, rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    // Ice caps
    const top = ctx.createLinearGradient(0, 0, 0, h * 0.09);
    top.addColorStop(0, 'rgba(240,250,255,0.98)');
    top.addColorStop(1, 'rgba(240,250,255,0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, w, h * 0.09);
    const bot = ctx.createLinearGradient(0, h, 0, h * 0.9);
    bot.addColorStop(0, 'rgba(240,255,255,0.98)');
    bot.addColorStop(1, 'rgba(240,255,255,0)');
    ctx.fillStyle = bot;
    ctx.fillRect(0, h * 0.9, w, h * 0.1);
  });
}

function makeSunTexture() {
  return makeTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#ff9518';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 420; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 4 + Math.random() * 22;
      const colors = ['#ffd257', '#ff8c1a', '#ffe9a3', '#ff6b00'];
      wrapBlob(ctx, w, x, y, r, colors[Math.floor(Math.random() * colors.length)], 0.5);
    }
    // A few darker sunspots
    for (let i = 0; i < 8; i++) {
      wrapBlob(ctx, w, Math.random() * w, Math.random() * h, 6 + Math.random() * 14, '#8a3b00', 0.5);
    }
  });
}

function makeRingTexture() {
  // Concentric circles drawn on a square canvas; RingGeometry's planar
  // UVs map them directly onto the ring.
  return makeTexture(1024, 1024, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const maxR = w / 2;
    for (let r = maxR * 0.42; r < maxR; r += 2) {
      const t = (r - maxR * 0.42) / (maxR * 0.58);
      // Ring bands with the Cassini division baked in
      let alpha = 0.72 + Math.sin(t * 60) * 0.16 + Math.sin(t * 17) * 0.1;
      if (t > 0.6 && t < 0.68) alpha *= 0.22; // Cassini division
      if (t < 0.06) alpha *= t / 0.06;
      const shade = 200 + Math.sin(t * 43) * 34;
      ctx.strokeStyle = `rgba(${shade}, ${shade - 24}, ${shade - 66}, ${Math.max(0, alpha)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function makeGlowSprite() {
  const texture = makeTexture(256, 256, (ctx, w, h) => {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, 'rgba(255,236,180,1)');
    grad.addColorStop(0.25, 'rgba(255,178,64,0.55)');
    grad.addColorStop(0.55, 'rgba(255,120,20,0.16)');
    grad.addColorStop(1, 'rgba(255,90,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
  const material = new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.setScalar(SUN_RADIUS * 7);
  return sprite;
}

// ----------------------------------------------------------------
// Renderer / scene / camera
// ----------------------------------------------------------------

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000104);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 6000);
const HOME_POSITION = new THREE.Vector3(0, 46, 108);
camera.position.copy(HOME_POSITION);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 4;
controls.maxDistance = 900;
controls.target.set(0, 0, 0);

// ----------------------------------------------------------------
// Lighting
// ----------------------------------------------------------------

scene.add(new THREE.AmbientLight(0xffffff, 0.14));

const sunLight = new THREE.PointLight(0xfff2dc, 3.2, 0, 0); // decay 0 → outer planets stay lit
scene.add(sunLight);

// ----------------------------------------------------------------
// Starfield + nebula haze
// ----------------------------------------------------------------

function addStars() {
  const COUNT = 6500;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const color = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    const r = 900 + Math.random() * 1400;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const pick = Math.random();
    color.setHSL(pick < 0.75 ? 0.6 : Math.random() * 0.12, pick < 0.75 ? 0.1 : 0.5, 0.6 + Math.random() * 0.4);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 2.4,
    sizeAttenuation: true,
    vertexColors: true,
    depthWrite: false,
  });
  scene.add(new THREE.Points(geometry, material));
}

function addNebula(colorHex, position, scale) {
  const texture = makeTexture(256, 256, (ctx, w, h) => {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, colorHex);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
  const material = new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.16,
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.setScalar(scale);
  scene.add(sprite);
}

addStars();
addNebula('rgba(64,60,180,1)', new THREE.Vector3(-700, 260, -900), 900);
addNebula('rgba(150,50,140,1)', new THREE.Vector3(820, -180, -700), 750);

// ----------------------------------------------------------------
// The Sun
// ----------------------------------------------------------------

const clickable = [];
const labels = [];
const orbitLines = [];

const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(SUN_RADIUS, 64, 32),
  new THREE.MeshBasicMaterial({ map: makeSunTexture() }),
);
sunMesh.userData.body = {
  name: 'Sun',
  type: 'G-type star',
  desc: 'Our star — a giant ball of plasma containing 99.86% of the solar system’s mass.',
  facts: [
    ['Diameter', '1,392,700 km'],
    ['Rotation', '25 Earth days'],
    ['Age', '~4.6 billion years'],
    ['Distance from Earth', '149.6M km'],
    ['Surface temperature', '5,505 °C'],
    ['Composition', '73% hydrogen, 25% helium'],
  ],
  labelAnchor: sunMesh,
  focusDistance: SUN_RADIUS * 5,
};
scene.add(sunMesh);
scene.add(makeGlowSprite());
clickable.push(sunMesh);

// ----------------------------------------------------------------
// Planets
// ----------------------------------------------------------------

function makeOrbitLine(radius) {
  const points = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x5f7ba8,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  orbitLines.push(line);
  return line;
}

function makeLabel(text, anchor) {
  const el = document.createElement('div');
  el.className = 'label';
  el.textContent = text;
  document.getElementById('labels').appendChild(el);
  labels.push({ el, anchor });
  return el;
}

function buildPlanet(data) {
  // Pivot rotates around the Sun; anchor carries the orbital radius.
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  const anchor = new THREE.Object3D();
  anchor.position.x = data.orbit;
  pivot.add(anchor);

  let map;
  if (data.name === 'Earth') {
    map = makeEarthTexture();
  } else if (data.gasGiant) {
    map = makeTexture(1024, 512, (ctx, w, h) =>
      drawBandedTexture(ctx, w, h, data.palette, { rowH: 2, streaks: 140 }));
  } else {
    map = makeRockyTexture(data.palette, {
      craters: data.name === 'Mercury' ? 90 : 0,
      polarCaps: data.name === 'Mars',
      blobSize: data.name === 'Venus' ? 60 : 34,
    });
    if (data.name === 'Venus') {
      // Swirled cloud look on top of the rocky base
      const ctx = map.image.getContext('2d');
      drawBandedTexture(ctx, map.image.width, map.image.height, data.palette, { rowH: 3, streaks: 180 });
      ctx.globalAlpha = 0.35;
      drawBandedTexture(ctx, map.image.width, map.image.height, ['#f2e6c4', '#d8bd7f'], { rowH: 5, streaks: 120 });
      ctx.globalAlpha = 1;
      map.needsUpdate = true;
    }
  }

  const material = new THREE.MeshStandardMaterial({
    map,
    roughness: data.gasGiant ? 0.75 : 0.95,
    metalness: 0,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 48, 32), material);
  mesh.rotation.z = THREE.MathUtils.degToRad(data.tilt);
  anchor.add(mesh);

  // Jupiter's Great Red Spot
  if (data.spot) {
    const spot = new THREE.Mesh(
      new THREE.SphereGeometry(data.radius * 1.005, 32, 16, 0, Math.PI * 0.5, data.spot.y * Math.PI * 0.5, Math.PI * 0.22),
      new THREE.MeshBasicMaterial({ color: data.spot.color, transparent: true, opacity: 0.85 }),
    );
    spot.rotation.y = Math.PI * 0.15;
    mesh.add(spot);
  }

  // Saturn's rings
  if (data.rings) {
    const ringGeo = new THREE.RingGeometry(data.radius * 1.32, data.radius * 2.28, 128, 1);
    const ringMat = new THREE.MeshBasicMaterial({
      map: makeRingTexture(),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring); // inherits Saturn's axial tilt — rings tilt with the planet
  }

  const body = {
    ...data,
    pivot,
    anchor,
    mesh,
    angle: data.startAngle,
    spin: 0,
    focusDistance: data.radius * 7 + 3,
  };
  mesh.userData.body = body;
  clickable.push(mesh);
  makeLabel(data.name, anchor);

  makeOrbitLine(data.orbit);

  // Moons
  body.moons = (MOON_DATA[data.name] ?? []).map((m) => {
    const moonPivot = new THREE.Object3D();
    anchor.add(moonPivot);
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(m.radius, 24, 16),
      new THREE.MeshStandardMaterial({
        map: makeRockyTexture(m.palette, { craters: 50, blobs: 90 }),
        roughness: 1,
      }),
    );
    moonMesh.position.x = m.distance;
    moonPivot.add(moonMesh);
    makeLabel(m.name, moonMesh);
    return { ...m, pivot: moonPivot, angle: Math.random() * Math.PI * 2 };
  });

  return body;
}

const planets = PLANET_DATA.map(buildPlanet);

// ----------------------------------------------------------------
// Asteroid belt
// ----------------------------------------------------------------

const beltGroup = new THREE.Object3D();
scene.add(beltGroup);

{
  const COUNT = 700;
  const geometry = new THREE.IcosahedronGeometry(0.09, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 1 });
  const belt = new THREE.InstancedMesh(geometry, material, COUNT);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 46.5 + Math.random() * 3.5;
    dummy.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 1.4,
      Math.sin(angle) * radius,
    );
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.scale.setScalar(0.4 + Math.random() * 1.8);
    dummy.updateMatrix();
    belt.setMatrixAt(i, dummy.matrix);
  }
  beltGroup.add(belt);
}

// ----------------------------------------------------------------
// UI wiring
// ----------------------------------------------------------------

const speedInput = document.getElementById('speed');
const pauseBtn = document.getElementById('pause-btn');
const orbitsToggle = document.getElementById('orbits');
const labelsToggle = document.getElementById('labels-toggle');
const labelsRoot = document.getElementById('labels');
const infoPanel = document.getElementById('planet-info');

let speed = 1;
let paused = false;

speedInput.addEventListener('input', () => {
  speed = Number(speedInput.value);
});

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? '▶' : '⏸';
});

orbitsToggle.addEventListener('change', () => {
  orbitLines.forEach((line) => (line.visible = orbitsToggle.checked));
});

labelsToggle.addEventListener('change', () => {
  labelsRoot.classList.toggle('hidden', !labelsToggle.checked);
});

function showInfo(body) {
  infoPanel.classList.remove('hidden');
  infoPanel.innerHTML = `
    <div class="pi-head">
      <h2>${body.name}</h2>
      <button id="pi-close" title="Close">✕</button>
    </div>
    <p class="pi-type">${body.type}</p>
    <p class="pi-desc">${body.desc}</p>
    <dl>
      ${body.facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}
    </dl>`;
  document.getElementById('pi-close').addEventListener('click', () => {
    infoPanel.classList.add('hidden');
    setFocus(null);
  });
}

// ----------------------------------------------------------------
// Picking + camera focus
// ----------------------------------------------------------------

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDown = null;

let focusBody = null;          // body the camera follows (null → Sun/origin)
let flying = false;            // smooth transition in progress
let flyT = 0;
const flyFromPos = new THREE.Vector3();
const flyFromTarget = new THREE.Vector3();
const flyToPos = new THREE.Vector3();
const flyToTarget = new THREE.Vector3();
const lastTargetPos = new THREE.Vector3();
const _worldPos = new THREE.Vector3();

function setFocus(body, focusDistance) {
  if (body === focusBody) return;
  focusBody = body;

  const targetPos = new THREE.Vector3();
  if (body) {
    getBodyWorldPos(body, targetPos);
  }

  // Choose an approach direction that keeps the current view angle
  const dir = camera.position.clone().sub(controls.target);
  if (dir.lengthSq() < 1e-6) dir.set(0, 0.5, 1);
  dir.normalize();
  dir.y = Math.max(dir.y, 0.35);
  dir.normalize();

  const dist = focusDistance ?? 32;
  flyFromPos.copy(camera.position);
  flyFromTarget.copy(controls.target);
  flyToTarget.copy(targetPos);
  flyToPos.copy(targetPos).addScaledVector(dir, dist);
  flyT = 0;
  flying = true;
}

function getBodyWorldPos(body, out) {
  if (body.labelAnchor) {
    body.labelAnchor.getWorldPosition(out);
  } else {
    body.anchor.getWorldPosition(out);
  }
}

canvas.addEventListener('pointerdown', (e) => {
  pointerDown = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('pointerup', (e) => {
  if (!pointerDown) return;
  const moved = Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y);
  pointerDown = null;
  if (moved > 6) return; // it was a drag, not a click

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(clickable, false);
  if (hits.length) {
    const body = hits[0].object.userData.body;
    showInfo(body);
    if (body.name !== 'Sun') {
      setFocus(body, body.focusDistance);
    } else {
      setFocus(null, SUN_RADIUS * 6);
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    infoPanel.classList.add('hidden');
    setFocus(null, undefined, HOME_POSITION);
  }
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    pauseBtn.click();
  }
});

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// ----------------------------------------------------------------
// Animation loop
// ----------------------------------------------------------------

const clock = new THREE.Clock();
const projected = new THREE.Vector3();

function updateLabels() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (const { el, anchor } of labels) {
    anchor.getWorldPosition(projected);
    projected.project(camera);
    const behind = projected.z > 1;
    const x = (projected.x * 0.5 + 0.5) * w;
    const y = (-projected.y * 0.5 + 0.5) * h;
    if (behind || x < -60 || x > w + 60 || y < -30 || y > h + 30) {
      el.classList.remove('visible');
      continue;
    }
    el.classList.add('visible');
    el.style.left = `${x}px`;
    el.style.top = `${y - 16}px`;
  }
}

function tick() {
  const dt = Math.min(clock.getDelta(), 0.1);

  if (!paused && speed > 0) {
    // Planets orbit
    for (const p of planets) {
      p.angle += ((Math.PI * 2) / p.periodDays) * DAYS_PER_SECOND * speed * dt;
      p.pivot.rotation.y = p.angle;

      // Planets spin (clamped so slow rotators still visibly turn)
      const hours = p.rotationHours;
      const dir = hours < 0 ? -1 : 1;
      const rate = THREE.MathUtils.clamp(24 / Math.abs(hours), 0.25, 3) * dir;
      p.spin += rate * 0.7 * speed * dt;
      p.mesh.rotation.y = p.spin;

      // Moons orbit
      for (const m of p.moons) {
        const secondsPerOrbit = Math.max(m.periodDays / MOON_DAYS_PER_SECOND, MIN_MOON_ORBIT_SECONDS);
        m.angle += ((Math.PI * 2) / secondsPerOrbit) * speed * dt;
        m.pivot.rotation.y = m.angle;
      }
    }
    sunMesh.rotation.y += 0.04 * speed * dt;
    beltGroup.rotation.y += 0.02 * speed * dt;
  }

  // Camera focus / follow
  if (flying) {
    flyT += dt / 1.1;
    const t = easeInOut(Math.min(flyT, 1));
    camera.position.lerpVectors(flyFromPos, flyToPos, t);
    controls.target.lerpVectors(flyFromTarget, flyToTarget, t);
    if (flyT >= 1) {
      flying = false;
      lastTargetPos.copy(flyToTarget);
    }
  } else if (focusBody) {
    getBodyWorldPos(focusBody, _worldPos);
    const delta = _worldPos.clone().sub(lastTargetPos);
    camera.position.add(delta);
    controls.target.add(delta);
    lastTargetPos.copy(_worldPos);
  }

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

tick();
