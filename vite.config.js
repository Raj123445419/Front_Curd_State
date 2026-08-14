import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Yeh add karein

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Yeh yahan plugins array mein daalein
  ],
})