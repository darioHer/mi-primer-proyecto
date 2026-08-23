import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Leer datos de PQRS compatible con local y despliegues en Vercel
export const getPqrsData = () => {
  let filePath = path.resolve(process.cwd(), 'data/pqrs.json');
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(__dirname, '../data/pqrs.json');
  }
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

const handlePqrs = (_req: express.Request, res: express.Response) => {
  try {
    const data = getPqrsData();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al leer pqrs.json:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener las solicitudes PQRS' 
    });
  }
};

// Rutas compatibles local y serverless Vercel
app.get('/api/pqrs', handlePqrs);
app.get('/', handlePqrs);

// Iniciar puerto únicamente en entorno local (fuera de Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend PQRS ejecutándose en http://localhost:${PORT}`);
  });
}

export default app;
