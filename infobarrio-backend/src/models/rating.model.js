import db from "../config/database.js"

export const addOrUpdate = async ({ rater_id, rated_id, stars, comment }) => {
  const conexion = await db.getConnection()
  // Try insert, on duplicate key update
  const [result] = await conexion.query('INSERT INTO ratings (rater_id, rated_id, stars, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE stars = VALUES(stars), comment = VALUES(comment), created_at = CURRENT_TIMESTAMP', [rater_id, rated_id, stars, comment])
  conexion.release()
  return result
}

export const findByRated = async (rated_id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT r.id, r.rater_id, r.stars, r.comment, r.created_at, u.username FROM ratings r LEFT JOIN users u ON u.id = r.rater_id WHERE r.rated_id = ? ORDER BY r.created_at DESC', [rated_id])
  conexion.release()
  return rows
}

export const avgStars = async (rated_id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT AVG(stars) AS avg_stars FROM ratings WHERE rated_id = ?', [rated_id])
  conexion.release()
  return rows[0]?.avg_stars || 0
}

export default { addOrUpdate, findByRated, avgStars }
