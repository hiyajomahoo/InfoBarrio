// Servidor Express principal
// - Configura middlewares generales (parsing JSON, logging, CORS)
// - Registra rutas desde ./routes
// - Sirve archivos estáticos de uploads/
// - Añade un health-check en /ping

import express from "express";
import cors from "cors"
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import fs from 'fs'
import path from 'path'
import mainRouter from "./routes/index.js"
import errorHandler from './middleware/errorHandler.js'

// Carga variables de entorno desde .env (si existe)
dotenv.config()

const app = express();

// --- Middlewares básicos ---
// Permitir recibir bodies JSON
app.use(express.json());

// Seguridad HTTP (helmet) está comentado para desarrollo local, puedes activarlo en producción
// app.use(helmet())

// Logger (morgan) en modo 'dev' imprime requests en la consola
app.use(morgan('dev'))

// Límite de peticiones para evitar abuso básico (rate limiting)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

// CORS: en dev permitimos cualquier origen. En producción restringir a dominios concretos.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parser de cookies (usado para lectura de token en cookie 'tokenSesion')
app.use(cookieParser());

// Asegurar que exista la carpeta de uploads y servirla estáticamente en /uploads
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

// Health-check simple para comprobar que el servidor está vivo
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Registrar rutas principales (todas bajo /api tal como está definido en routes/index.js)
app.use('/', mainRouter);

// Manejador global de errores (middleware final)
app.use(errorHandler)

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT} en todas las interfaces`);
    console.log('Intentar acceder desde:');
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Red local: http://:${PORT}`);
    console.log('CORS configurado para permitir todas las conexiones en desarrollo');
});