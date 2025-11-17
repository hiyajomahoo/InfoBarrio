/**
 * User Routes Module
 * 
 * Define endpoints para autenticación de usuarios y gestión de perfiles
 * 
 * Endpoints:
 * - POST /api/usuarios: Crear nuevo usuario (registro)
 * - GET /api/usuarios/:id: Obtener datos de usuario por ID
 * - POST /api/login: Autenticar usuario y obtener JWT
 * - POST /api/logout: Cerrar sesión (limpiar cookie)
 * - GET /api/me: Obtener datos del usuario autenticado (requiere JWT)
 * 
 * Middleware aplicado:
 * - validateRegister: Validar email, password, username en registro
 * - validateLogin: Validar email y password en login
 * - verifyToken: Verificar JWT válido en Authorization header
 */

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