/**
 * Post Type Routes Module
 * 
 * Define endpoint para obtener los tipos de publicaciones disponibles en el sistema
 * 
 * Endpoint:
 * - GET /api/posttype: Obtener lista de todos los tipos de publicaciones (público)
 *   Retorna: Array con tipos {id, nombre} - 1: Venta, 2: Servicios, 3: Eventos, 4: Empleos
 */

import { Router } from 'express'
import { listPostTypes } from '../controllers/posttype.controller.js'

const router = Router()

router.get('/posttype', listPostTypes)

export default router
