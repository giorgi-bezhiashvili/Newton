import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['recently-impressive-discipline-piece.trycloudflare.com'],
    proxy: {
      // Any request starting with /api will be sent to localhost:3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes '/api' before sending to backend
      },
    },
  },
});
