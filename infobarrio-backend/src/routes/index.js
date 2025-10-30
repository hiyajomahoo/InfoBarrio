// Rutas principales del servidor
// Este archivo agrupa y monta las rutas por módulos bajo el prefijo /api
import { Router } from "express"
import userRoutes from "./user.routes.js"
import postRoutes from "./post.routes.js"
import posttypeRoutes from './posttype.routes.js'
import photoRoutes from './photo.routes.js'
import favoriteRoutes from './favorite.routes.js'
import followRoutes from './follow.routes.js'
import ratingRoutes from './rating.routes.js'

const router = Router()

// Montar cada conjunto de rutas bajo /api. Por ejemplo:
//  - /api/usuarios
//  - /api/post
//  - /api/posttype
router.use('/api', userRoutes)
router.use('/api', postRoutes)
router.use('/api', posttypeRoutes)
router.use('/api', photoRoutes)
router.use('/api', favoriteRoutes)
router.use('/api', followRoutes)
router.use('/api', ratingRoutes)

export default router