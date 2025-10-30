import { Router } from "express"
import { createPost, deletePost, editPost, getPosts, getPostsByType, getPost } from "../controllers/post.controller.js"
import { verifyToken } from '../middleware/auth.js'
import { validatePost } from '../middleware/validate.js'

const router = Router()

router.get('/post/type/:id', getPostsByType)
router.get('/post/:id', getPost)
router.get('/post', getPosts)

// Proteger endpoints que modifican datos con JWT, y validar input
router.post('/post', verifyToken, validatePost, createPost)
router.put('/post/:id', verifyToken, validatePost, editPost)
router.delete('/post/:id', verifyToken, deletePost)

export default router