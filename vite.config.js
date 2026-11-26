import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sur GitHub Pages, le site est servi depuis /<repo>/
const base = process.env.GITHUB_ACTIONS ? '/LATRANSPORT/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
