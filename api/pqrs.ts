import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para JSON
app.use(express.json());

// Función auxiliar para leer los datos de PQRS desde data/pqrs.json
export const getPqrsData = () => {
  const filePath = path.resolve(__dirname, '../data/pqrs.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// Endpoint GET /api/pqrs
app.get('/api/pqrs', (_req, res) => {
  try {
    const data = getPqrsData();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al leer pqrs.json:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener las solicitudes PQRS' 
    });
  }
});

// Iniciar servidor Express en el puerto 3001
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend PQRS ejecutándose en http://localhost:${PORT}`);
  console.log(`📌 Endpoint de prueba: http://localhost:${PORT}/api/pqrs`);
});

export default app;
