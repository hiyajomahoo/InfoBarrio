/*
  Modelo: Favoritos
  - add: agrega una publicación a favoritos (usa INSERT ... ON DUPLICATE para evitar duplicados).
  - remove: elimina una publicación de los favoritos.
  - findByUser: obtiene todos los favoritos de un usuario (con datos de la publicación).
*/
import db from "../config/database.js"

export const add = async ({ user_id, post_id }) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('INSERT INTO favorites (user_id, post_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP', [user_id, post_id])
  conexion.release()
  return result
}

export const remove = async ({ user_id, post_id }) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('DELETE FROM favorites WHERE user_id = ? AND post_id = ?', [user_id, post_id])
  conexion.release()
  return result
}

export const findByUser = async (user_id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT f.post_id, p.title, p.description FROM favorites f JOIN posts p ON p.id = f.post_id WHERE f.user_id = ?', [user_id])
  conexion.release()
  return rows
}

export default { add, remove, findByUser }
