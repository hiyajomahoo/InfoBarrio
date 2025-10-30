import mysql from 'mysql2/promise'

// Configuración de la conexión a MySQL
// Este módulo exporta un pool de conexiones reutilizable (mysql2/promise)
// Las variables de entorno permitidas son:
//  - DB_HOST (por defecto 'localhost')
//  - DB_USER (por defecto 'root')
//  - DB_PASS o DB_PASSWORD (acepta ambos nombres para compatibilidad con docker-compose)
//  - DB_NAME (por defecto 'infobarriodb')
//  - DB_PORT (por defecto 3306)

// Leer configuración desde variables de entorno con valores por defecto
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
// Soportar tanto DB_PASS como DB_PASSWORD (docker-compose usa DB_PASSWORD)
const DB_PASS = process.env.DB_PASS ?? process.env.DB_PASSWORD ?? ''
const DB_NAME = process.env.DB_NAME || 'infobarriodb'
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306

// Crear un pool de conexiones. Usar pool es más eficiente que open/close por petición.
const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT
});

// Exportar el pool para que los modelos y controladores lo usen.
export default db;
