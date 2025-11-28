
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Debug log removed

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Force inject the key
      '__APP_GEMINI_API_KEY__': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      }
    },
    build: {
      chunkSizeWarningLimit: 2000
    }
  };
});
