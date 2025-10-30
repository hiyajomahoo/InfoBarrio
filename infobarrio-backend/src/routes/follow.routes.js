import { Router } from 'express'
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/follow.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/follows', verifyToken, followUser)
router.delete('/follows/:followedId', verifyToken, unfollowUser)
router.get('/follows/followers/:userId', getFollowers)
router.get('/follows/following/:userId', getFollowing)

export default router
