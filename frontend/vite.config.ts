import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In production the frontend is served same-origin with the API, so the
    // axios baseURL is empty ("/api/..."). In dev, forward those calls to the
    // backend on :4000 instead of letting Vite return the SPA index.html.
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
    },
  },
})
