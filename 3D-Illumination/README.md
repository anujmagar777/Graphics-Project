# 3D Illumination & Surface Rendering Visualization

## Overview

An interactive 3D visualization built with React + Three.js that lets you explore basic illumination / reflection components on a set of shapes.

## Features

### Shape Selection

- Choose from multiple built-in shapes (Cube, Sphere, Cone, Torus, Cylinder, Tetrahedron, Octahedron, Spiral).
- Navigate from the shape grid (`/`) to a dedicated viewer page (`/view/:shapeId`).

### Rendering Controls

- Wireframe toggle.
- Z-buffer (Hidden Surface Removal) toggle (enables/disables depth testing & depth writing on the material).
- Rotation toggle (auto-rotation on/off).
- Shape color picker / hex input.

### Lighting + Scene

- Toggle lighting components:
  - Ambient illumination
  - Diffuse (directional) light
  - Specular (point) light
- Optional “Visible Light Sources” helper markers.
- Background selection (White / Gray / Black / Space). The Space background renders a star field.
- Orbit controls: rotate / pan / zoom.

## Tech Stack

- React + TypeScript
- Vite
- Three.js via `@react-three/fiber` and `@react-three/drei`
- Tailwind CSS + shadcn/ui components

## Run Locally

Prereqs: Node.js (recommended 18+).

```sh
# install
npm install

# start dev server
npm run dev

# production build
npm run build

# preview production build
npm run preview
```

If you prefer Bun:

```sh
bun install
bun run dev
```

## Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "..."`)
4. Push (`git push origin feature-name`)
5. Open a Pull Request

