/**
 * Photo Routes Module
 * 
 * Define endpoints para gestionar fotos de publicaciones y fotos de perfil
 * Utiliza multer para manejo de carga de archivos con almacenamiento en disco local
 * 
 * Multer Storage Configuration:
 * - Destino: carpeta /uploads/ en raíz del proyecto
 * - Nombre de archivo: fieldname-timestamp-randomNumber.ext
 * - Máximo 6 archivos por upload de post
 * 
 * Endpoints para fotos de publicaciones:
 * - POST /api/post/:postId/photos: Subir fotos para publicación (protegido, máx 6 archivos)
 * - GET /api/post/:postId/photos: Obtener lista de fotos de una publicación (público)
 * - DELETE /api/post/photos/:photoId: Eliminar foto específica (protegido)
 * 
 * Endpoint para foto de perfil:
 * - POST /api/users/photo: Subir/actualizar foto de perfil del usuario autenticado (protegido)
 *   Realiza actualización directa en BD: UPDATE users SET profile_photo = ? WHERE id = ?
 * 
 * Middleware aplicado:
 * - verifyToken: Verificar JWT válido para endpoints de modificación
 * - upload.array('files', 6): Procesar múltiples archivos (máx 6) para posts
 * - upload.single('file'): Procesar un archivo único para foto de perfil
 */

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
