import PostPhoto from '../models/postPhoto.model.js'
import path from 'path'
import fs from 'fs'


export const uploadPhotos = async (req, res) => {
  const postId = req.params.postId
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' })
  try {
    const uploaded = []
    for (const file of req.files) {
      // Save the accessible URL path (served from /uploads)
      const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      const id = await PostPhoto.create({ post_id: postId, url })
      uploaded.push({ id, url })
    }
    return res.status(201).json({ photos: uploaded })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error uploading photos' })
  }
}

export const listPhotos = async (req, res) => {
  const postId = req.params.postId
  try {
    const photos = await PostPhoto.findByPostId(postId)
    return res.status(200).json(photos)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error fetching photos' })
  }
}

export const deletePhoto = async (req, res) => {
  const photoId = req.params.photoId
  try {
    // Find photo record to remove file from disk
    const conexion = await (await import('../config/database.js')).default.getConnection()
    const [rows] = await conexion.query('SELECT * FROM post_photos WHERE id = ?', [photoId])
    conexion.release()
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Photo not found' })
    const url = rows[0].url
    // url expected like http://host/uploads/filename
    const filename = url.split('/uploads/').pop()
    const filepath = path.join(process.cwd(), 'uploads', filename)
    // remove file if exists
    try { if (fs.existsSync(filepath)) fs.unlinkSync(filepath) } catch (e) { console.warn('Could not remove file', filepath, e) }

    await PostPhoto.remove(photoId)
    return res.status(200).json({ message: 'Photo deleted' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error deleting photo' })
  }
}

export default { uploadPhotos, listPhotos, deletePhoto }
