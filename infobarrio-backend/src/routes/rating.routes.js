/**
 * Rating Routes Module
 * 
 * Define endpoints para valorar (calificar) usuarios y consultar sus reputación
 * 
 * Endpoints:
 * - POST /api/ratings: Crear o actualizar una calificación de usuario (protegido - verifyToken)
 *   Body: {ratedUserId, stars} - stars debe estar entre 1 y 5
 *   Middleware: validateRating para validar entrada
 * 
 * - GET /api/ratings/:userId: Obtener todas las calificaciones recibidas por un usuario (público)
 *   Retorna lista de ratings con nombre del usuario que calificó
 * 
 * Middleware aplicado:
 * - verifyToken: Verificar JWT válido para endpoint de calificación
 * - validateRating: Validar estructura de datos (stars entre 1-5, ratedUserId válido)
 */

import { Router } from 'express'
import { addRating, getRatings } from '../controllers/rating.controller.js'
import { verifyToken } from '../middleware/auth.js'
import { validateRating } from '../middleware/validate.js'

const router = Router()

router.post('/ratings', verifyToken, validateRating, addRating)
router.get('/ratings/:userId', getRatings)

export default router
