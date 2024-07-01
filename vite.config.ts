import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'; // Add this line

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [svelte()],
  assetsInclude: ['**/*.asm'],
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@logic": path.resolve(__dirname, "./src/logic"),
    },
  }
})