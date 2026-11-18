import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset paths, so the built site works on any host or under a sub-path.
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: true },
})
