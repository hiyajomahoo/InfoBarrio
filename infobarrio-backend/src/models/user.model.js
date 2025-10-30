import db from "../config/database.js"

export const findByUsername = async (username) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT * FROM users WHERE username = ?', [username])
  conexion.release()
  return rows
}

export const findById = async (id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT id, name, dni, numberPhone, email, username, profile_photo, bio, reputation, created_at FROM users WHERE id = ?', [id])
  conexion.release()
  return rows[0]
}

export const createUser = async ({ name, dni, numberPhone, email, username, password_hash }) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('INSERT INTO users (name, dni, numberPhone, email, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)', [name, dni, numberPhone, email, username, password_hash])
  conexion.release()
  return result.insertId
}

export default { findByUsername, findById, createUser }
