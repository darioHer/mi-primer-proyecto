import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'pqrs-mock-api-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/pqrs' || req.url?.startsWith('/api/pqrs?')) {
            try {
              const filePath = path.resolve(__dirname, 'data/pqrs.json');
              const fileData = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(fileData);
              return;
            } catch {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Error al leer archivo de PQRS' }));
              return;
            }
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
