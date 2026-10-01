# Solar System — three.js

An interactive 3D solar system demo built with [three.js](https://threejs.org/) and [Vite](https://vitejs.dev/).

![solar-system](https://img.shields.io/badge/three.js-r180-blue) ![vite](https://img.shields.io/badge/vite-7.x-purple)

## Features

- ☀️ The Sun with a procedural surface texture and additive glow
- 🪐 All 8 planets with procedurally generated textures (no external image assets — works fully offline)
- 🌑 Moons: Earth's Moon, Jupiter's four Galilean moons, and Saturn's Titan
- 💍 Saturn's rings (including the Cassini division) and Jupiter's Great Red Spot
- 🪨 The asteroid belt, rendered with `InstancedMesh`
- ⭐ A 6,500-star background with subtle nebula haze
- 🎛️ HUD controls: play/pause, orbital speed slider, orbit lines and label toggles
- 🖱️ Click any planet (or the Sun) for real astronomical data; the camera smoothly flies to and follows it
- 📱 Responsive resizing

## Requirements

- [Node.js](https://nodejs.org/) 20.19+ (or 22.12+)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (opens on http://localhost:5173)
npm run dev
```

Then open the URL shown in the terminal (default: <http://localhost:5173>).

## Production build

```bash
# Build to dist/
npm run build

# Preview the production build locally
npm run preview
```

## Controls

| Action | Result |
| --- | --- |
| Drag | Orbit the camera |
| Scroll / pinch | Zoom in and out |
| Click a planet / the Sun | Show info panel and focus the camera |
| `Esc` | Close the info panel and reset the view |
| `Space` | Pause / resume |

## Project structure

```
├── index.html        # Entry HTML + HUD markup
├── src/
│   ├── main.js       # Scene, planets, moons, camera, UI logic
│   └── style.css     # HUD / overlay styling
├── package.json
└── .gitignore
```

All planet, moon, Sun, and ring textures are generated at runtime on `<canvas>`, so the project ships with no binary assets.

## Tech stack

- [three.js](https://threejs.org/) — WebGL rendering
- [Vite](https://vitejs.dev/) — dev server and bundler
- Vanilla JavaScript (ES modules), no framework

## License

MIT
