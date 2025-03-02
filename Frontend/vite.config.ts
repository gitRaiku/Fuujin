import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  build: {
    assetsInlineLimit: 0 // Ensures WASM isn't inlined as base64
  },
  server: {
    mimeTypes: {
      'application/wasm': ['wasm'] // Ensure WASM is recognized
    }
  },
	plugins: [
    sveltekit(),
    tailwindcss()
  ]
});
