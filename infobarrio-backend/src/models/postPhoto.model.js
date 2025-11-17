/*
  Modelo: Fotos de Publicación
  - create: inserta una foto asociada a una publicación.
  - findByPostId: obtiene todas las fotos de una publicación específica.
  - remove: elimina un registro de foto de la BD.
*/
import db from "../config/database.js"

export const create = async ({ post_id, url }) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('INSERT INTO post_photos (post_id, url) VALUES (?, ?)', [post_id, url])
  conexion.release()
  return result.insertId
}

export const findByPostId = async (post_id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT * FROM post_photos WHERE post_id = ?', [post_id])
  conexion.release()
  return rows
}

export const remove = async (id) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('DELETE FROM post_photos WHERE id = ?', [id])
  conexion.release()
  return result
}

export default { create, findByPostId, remove }
