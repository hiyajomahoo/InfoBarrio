/**
 * Post Routes Module
 * 
 * Define endpoints para crear, leer, actualizar y eliminar publicaciones
 * 
 * Endpoints GET (públicos - sin autenticación):
 * - GET /api/post: Obtener todas las publicaciones (con paginación)
 * - GET /api/post/:id: Obtener detalles de una publicación específica
 * - GET /api/post/getNewestPost: Obtener últimas 5 publicaciones (excluyendo tipo 4 - empleos)
 * - GET /api/post/type/:id: Filtrar publicaciones por tipo (1-4)
 * - GET /api/post/user/:id: Obtener todas las publicaciones de un usuario específico
 * 
 * Endpoints POST/PUT/DELETE (protegidos - requieren JWT):
 * - POST /api/post: Crear nueva publicación (verifyToken + validatePost)
 * - PUT /api/post/:id: Actualizar publicación (verifyToken + validatePost)
 * - DELETE /api/post/:id: Eliminar publicación (verifyToken)
 * 
 * Middleware aplicado:
 * - verifyToken: Verificar JWT válido para endpoints de modificación
 * - validatePost: Validar estructura de datos de publicación (título, descripción, tipo)
 */

import { Router } from "express"
import { createPost, deletePost, editPost, getPosts, getPostsByType, getPost, getNewestPost, getPostsByUser } from "../controllers/post.controller.js"
import { verifyToken } from '../middleware/auth.js'
import { validatePost } from '../middleware/validate.js'

const router = Router()

router.get('/post/getNewestPost', getNewestPost)
router.get('/post/user/:id', getPostsByUser)
router.get('/post/type/:id', getPostsByType)
router.get('/post/:id', getPost)
router.get('/post', getPosts)

// Proteger endpoints que modifican datos con JWT, y validar input
router.post('/post', verifyToken, validatePost, createPost)
router.put('/post/:id', verifyToken, validatePost, editPost)
router.delete('/post/:id', verifyToken, deletePost)

export default router