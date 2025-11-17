/**
 * Favorite Routes Module
 * 
 * Define endpoints para gestionar publicaciones favoritas de usuarios
 * 
 * Endpoints (todos protegidos - requieren JWT):
 * - POST /api/favorites: Añadir publicación a favoritos (verifyToken, body: {postId})
 * - GET /api/favorites: Obtener lista de publicaciones favoritas del usuario autenticado (verifyToken)
 * - DELETE /api/favorites/:postId: Remover publicación de favoritos (verifyToken)
 * 
 * Middleware aplicado:
 * - verifyToken: Verificar JWT válido en Authorization header
 */

import { Router } from 'express'
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favorite.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/favorites', verifyToken, addFavorite)
router.get('/favorites', verifyToken, listFavorites)
router.delete('/favorites/:postId', verifyToken, removeFavorite)

export default router
