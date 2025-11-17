/*
  Modelo: Tipo de Publicación
  - findAll: obtiene la lista completa de tipos de publicación disponibles.
*/
import db from "../config/database.js"

export const findAll = async () => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT * FROM posttype ORDER BY id')
  conexion.release()
  return rows
}

export default { findAll }
