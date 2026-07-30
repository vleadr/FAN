import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  // imagetools: for any image imported from source (e.g. `import x from './x.png?w=800&format=webp`),
  // resizes/re-encodes it at build time. Doesn't apply to files served as-is from `public/`
  // (those are pre-optimized directly — see public/assets/README.md).
  plugins: [react(), tailwindcss(), imagetools()],
})
