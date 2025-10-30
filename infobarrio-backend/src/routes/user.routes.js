import { Router } from "express"
import { createUser, login, logout, me, getUserById } from "../controllers/user.controller.js"
import { verifyToken } from '../middleware/auth.js'
import { validateRegister, validateLogin } from '../middleware/validate.js'

const router = Router()

router.post('/usuarios', validateRegister, createUser)
router.get('/usuarios/:id', getUserById)
router.post('/login', validateLogin, login)
router.post('/logout', logout)
router.get('/me', verifyToken, me)

export default router