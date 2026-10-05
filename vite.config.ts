import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` -> normal multi-file production build for real hosting.
// `npm run build:single` -> one self-contained HTML file (used for the live preview).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: { chunkSizeWarningLimit: 2000 },
}))
