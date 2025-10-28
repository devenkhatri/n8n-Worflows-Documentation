import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      middleware: [
        (req, res, next) => {
          // Redirect all non-asset requests to index.html
          if (!req.url.includes('.')) {
            req.url = '/';
          }
          next();
        }
      ]
    },
    plugins: [react()],
    define: {
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY),
      'process.env.VITE_GOOGLE_SHEET_ID': JSON.stringify(env.VITE_GOOGLE_SHEET_ID),
      'process.env.VITE_GOOGLE_SHEET_NAME': JSON.stringify(env.VITE_GOOGLE_SHEET_NAME)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
