import { Router } from 'express'
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favorite.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/favorites', verifyToken, addFavorite)
router.get('/favorites', verifyToken, listFavorites)
router.delete('/favorites/:postId', verifyToken, removeFavorite)

export default router
