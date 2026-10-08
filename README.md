# kittikun.dev — portfolio

Personal portfolio of Kittikun Buntoyut, built with Next.js 16, React 19, Three.js (React Three Fiber) and custom GLSL.

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build
```

## What's inside

- **Morphing particle field** (`src/components/canvas/ParticleField.tsx`, `shaders.ts`): about 22k GPU particles that morph from a sphere to a torus knot, a wave terrain, a DNA helix and finally a galaxy as you scroll. They react to the cursor and get a bloom pass.
- **Liquid-lens portrait** (`DistortImage.tsx`): the photo renders through a shader as a warm duotone. Hovering reveals true colour under a lens, and fast movement adds an RGB split.
- **Terminal**: press <kbd>`</kbd> or <kbd>⌘K</kbd>. Try `help`, `work`, `open rcpanda`, `goto contact` or `hyperdrive`.
- **Konami code** (↑↑↓↓←→←→BA): turns on hyperdrive mode for the particle field.
- Other effects: Lenis smooth scroll, a preloader, a custom cursor, magnetic buttons, scramble text, a horizontal-scroll project track, a draggable 3D tag sphere and an award list with cursor-following previews.

## Editing content

- Resume data (work, projects, skills, awards): `src/data/resume.ts`
- Blog posts (Markdown): `content/*.mdx`
- Project gallery images: `public/projects/<slug>/` (picked up automatically)
