import { Router } from 'express'
import { listPostTypes } from '../controllers/posttype.controller.js'

const router = Router()

router.get('/posttype', listPostTypes)

export default router
