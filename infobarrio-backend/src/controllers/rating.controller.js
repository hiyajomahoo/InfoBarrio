import Rating from '../models/rating.model.js'
import UserModel from '../models/user.model.js'

export const addRating = async (req, res) => {
  const rater_id = req.user?.id
  const { rated_id, stars, comment } = req.body
  if (!rater_id) return res.status(401).json({ message: 'No autenticado' })
  if (!rated_id || !stars) return res.status(400).json({ message: 'Parámetros insuficientes' })
  try {
    await Rating.addOrUpdate({ rater_id, rated_id, stars, comment })
    // recalcular average and write to users.reputation
    const avg = await Rating.avgStars(rated_id)
    const conexion = await (await import('../config/database.js')).default.getConnection()
    await conexion.query('UPDATE users SET reputation = ? WHERE id = ?', [avg, rated_id])
    conexion.release()
    return res.status(201).json({ message: 'Rating registrado', average: avg })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al guardar rating' })
  }
}

export const getRatings = async (req, res) => {
  const rated_id = req.params.userId
  try {
    const rows = await Rating.findByRated(rated_id)
    return res.status(200).json(rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener ratings' })
  }
}

export default { addRating, getRatings }
