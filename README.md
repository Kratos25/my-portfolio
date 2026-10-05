# Studio After Dark — 3D developer portfolio

React 19 · Vite · TypeScript · React Three Fiber · Drei · GSAP · Zustand

## Run it
```bash
npm install
npm run dev          # local dev server
npm run build        # production build → dist/
```

## Make it yours
Edit **`src/data/content.ts`** — name, projects, stack, experience, links.
The 3D whiteboard, bookshelf, monitor text, terminal and quick view all read from it.

## Where things live
- `src/scene/Room.tsx` — walls, desk, window (sky follows the visitor's clock), rain
- `src/scene/objects.tsx` — every clickable object. To upgrade one to a Blender model,
  replace the meshes inside its `<Hotspot>` with a loaded glTF.
- `src/scene/CameraRig.tsx` — camera shots per section + responsive framing
- `src/ui/Terminal.tsx` — the terminal; add commands to the `commands` object
- `src/styles.css` — design tokens at the top

Tip: add `?debug` to the URL to disable animation lag-smoothing when testing in slow browsers.
