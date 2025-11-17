/*
  Modelo: Publicación
  - create: inserta una nueva publicación.
  - findById: obtiene una publicación por ID.
  - update: actualiza datos de una publicación.
  - remove: elimina una publicación.
*/
import db from "../config/database.js"

export const create = async ({ user_id, post_type_id, title, description, price, status }) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('INSERT INTO posts (user_id, post_type_id, title, description, price, status) VALUES (?, ?, ?, ?, ?, ?)', [user_id, post_type_id, title, description, price, status])
  conexion.release()
  return result.insertId
}

export const findById = async (id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT * FROM posts WHERE id = ?', [id])
  conexion.release()
  return rows[0]
}

export const update = async (id, data) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('UPDATE posts SET ? WHERE id = ?', [data, id])
  conexion.release()
  return result
}

export const remove = async (id) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('DELETE FROM posts WHERE id = ?', [id])
  conexion.release()
  return result
}

export default { create, findById, update, remove }
