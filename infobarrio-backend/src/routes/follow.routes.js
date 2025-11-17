/**
 * Follow Routes Module
 * 
 * Define endpoints para gestionar el sistema de seguimiento entre usuarios (follow/unfollow)
 * 
 * Endpoints GET (públicos):
 * - GET /api/follows/followers/:userId: Obtener lista de seguidores de un usuario
 * - GET /api/follows/following/:userId: Obtener lista de usuarios que sigue un usuario
 * 
 * Endpoints POST/DELETE (protegidos - requieren JWT):
 * - POST /api/follows: Seguir a un usuario (verifyToken, body: {followedId})
 * - DELETE /api/follows/:followedId: Dejar de seguir a un usuario (verifyToken)
 * 
 * Middleware aplicado:
 * - verifyToken: Verificar JWT válido para endpoints de seguimiento
 */

import { Router } from 'express'
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/follow.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/follows', verifyToken, followUser)
router.delete('/follows/:followedId', verifyToken, unfollowUser)
router.get('/follows/followers/:userId', getFollowers)
router.get('/follows/following/:userId', getFollowing)

export default router
