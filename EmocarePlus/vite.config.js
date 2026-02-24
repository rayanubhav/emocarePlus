import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // <--- Force Vite to use port 3000
    strictPort: true, // <--- Fail if port 3000 is taken
  }
})
