import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from thebarbellengineer.com/video-production/ by GitHub Pages.
  base: '/video-production/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
