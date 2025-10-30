import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { uploadPhotos, listPhotos, deletePhoto } from '../controllers/photo.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// Multer setup: store files in uploads/ with unique names
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({ storage })

// Upload photos for a post (protected)
router.post('/post/:postId/photos', verifyToken, upload.array('files', 6), uploadPhotos)
router.get('/post/:postId/photos', listPhotos)
router.delete('/post/photos/:photoId', verifyToken, deletePhoto)

// Upload profile photo for current user
router.post('/users/photo', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    const conexion = await (await import('../config/database.js')).default.getConnection()
    await conexion.query('UPDATE users SET profile_photo = ? WHERE id = ?', [url, req.user.id])
    conexion.release()
    return res.status(200).json({ message: 'Profile photo uploaded', url })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error uploading profile photo' })
  }
})

export default router
