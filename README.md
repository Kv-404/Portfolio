# KV_404 Portfolio

A futuristic, cyber-themed portfolio website built with React, Three.js, and Framer Motion. Features a "terminal/classified" aesthetic with WebGL dithered backgrounds, custom cursor, scanline overlays, and encrypted text animations.

## 🚀 Features

- **Immersive UI**: WebGL dither background with adjustable intensity, custom cursor, scanline overlay
- **Interactive Navigation**: Accordion-style home menu with smooth Framer Motion transitions
- **Redacted Identity**: Classified bio and skills on the About page
- **Project Archive**: Card-based project showcase with status indicators
- **Custom 404**: Terminal-style error page with live log feed
- **Responsive**: Optimized for desktop and mobile

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS with CSS custom properties
- **Animation**: Framer Motion (`motion/react`)
- **3D/WebGL**: Three.js, @react-three/fiber, @react-three/postprocessing
- **Routing**: React Router DOM

## 📦 Getting Started

```bash
git clone https://github.com/Kv-404/Portfolio.git
cd Portfolio
npm install
npm run dev
```

## 🚀 Deploy

```bash
npm run build
```

Configured for **Vercel** — push to main and it auto-deploys. The `vercel.json` handles SPA rewrites.

## 📂 Structure

```
src/
├── components/   # Layout, BackgroundCanvas, CustomCursor, Dither, Scanlines, etc.
├── pages/        # Home, About, Projects, Socials, Contact, NotFound
├── index.css     # Global styles and design tokens
├── App.jsx       # Routes
└── main.jsx      # Entry point
```

## 📜 License

[MIT](LICENSE)
