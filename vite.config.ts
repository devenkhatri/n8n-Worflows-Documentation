import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // Handle SPA routing during development
      middleware: [
        (req, res, next) => {
          if (!req.url.includes('.') && !req.url.startsWith('/api/')) {
            req.url = '/';
          }
          next();
        }
      ]
    },
    plugins: [react()],
    // Define env variables
    define: {
      __VITE_GOOGLE_API_KEY__: JSON.stringify(env.VITE_GOOGLE_API_KEY),
      __VITE_GOOGLE_SHEET_ID__: JSON.stringify(env.VITE_GOOGLE_SHEET_ID),
      __VITE_GOOGLE_SHEET_NAME__: JSON.stringify(env.VITE_GOOGLE_SHEET_NAME)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Generate source maps for production build
      sourcemap: true,
      // Improve chunking strategy
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          }
        }
      },
      // Ensure correct asset paths
      assetsDir: 'assets',
      // Clean the output directory before build
      emptyOutDir: true,
    }
  };
});
