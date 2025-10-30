import { Router } from 'express'
import { addRating, getRatings } from '../controllers/rating.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { validateRating } from '../middleware/validate.js'

const router = Router()

router.post('/ratings', verifyToken, validateRating, addRating)
router.get('/ratings/:userId', getRatings)

export default router
