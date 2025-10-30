import Favorite from '../models/favorite.model.js'

export const addFavorite = async (req, res) => {
  const user_id = req.user?.id
  const { post_id } = req.body
  if (!user_id) return res.status(401).json({ message: 'No autenticado' })
  try {
    await Favorite.add({ user_id, post_id })
    return res.status(201).json({ message: 'Favorito agregado' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al agregar favorito' })
  }
}

export const removeFavorite = async (req, res) => {
  const user_id = req.user?.id
  const post_id = req.params.postId
  if (!user_id) return res.status(401).json({ message: 'No autenticado' })
  try {
    await Favorite.remove({ user_id, post_id })
    return res.status(200).json({ message: 'Favorito eliminado' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al eliminar favorito' })
  }
}

export const listFavorites = async (req, res) => {
  const user_id = req.user?.id
  if (!user_id) return res.status(401).json({ message: 'No autenticado' })
  try {
    const rows = await Favorite.findByUser(user_id)
    return res.status(200).json(rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener favoritos' })
  }
}

export default { addFavorite, removeFavorite, listFavorites }
