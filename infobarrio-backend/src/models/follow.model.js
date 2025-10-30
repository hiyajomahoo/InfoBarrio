import db from "../config/database.js"

export const follow = async ({ follower_id, followed_id }) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('INSERT INTO follows (follower_id, followed_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP', [follower_id, followed_id])
  conexion.release()
  return result
}

export const unfollow = async ({ follower_id, followed_id }) => {
  const conexion = await db.getConnection()
  const [result] = await conexion.query('DELETE FROM follows WHERE follower_id = ? AND followed_id = ?', [follower_id, followed_id])
  conexion.release()
  return result
}

export const followersOf = async (user_id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT follower_id FROM follows WHERE followed_id = ?', [user_id])
  conexion.release()
  return rows
}

export const followingOf = async (user_id) => {
  const conexion = await db.getConnection()
  const [rows] = await conexion.query('SELECT followed_id FROM follows WHERE follower_id = ?', [user_id])
  conexion.release()
  return rows
}

export default { follow, unfollow, followersOf, followingOf }
