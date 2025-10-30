import PostType from '../models/posttype.model.js'

export const listPostTypes = async (req, res) => {
  try {
    const types = await PostType.findAll()
    return res.status(200).json(types)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener post types' })
  }
}

export default { listPostTypes }
