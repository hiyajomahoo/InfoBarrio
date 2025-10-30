// Validaciones de entrada usando express-validator
// Cada export es un array de validadores que se usan como middleware en rutas.
import { body, validationResult } from 'express-validator'

export const validateRegister = [
  // Validar username, password y email en el registro
  body('username').isLength({ min: 3 }).withMessage('username requerido (min 3)'),
  body('password').isLength({ min: 6 }).withMessage('password requerido (min 6)'),
  body('email').isEmail().withMessage('email inválido'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    next()
  }
]

export const validateLogin = [
  // En login comprobamos username y password no vacíos
  body('username').notEmpty().withMessage('username requerido'),
  body('password').notEmpty().withMessage('password requerido'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    next()
  }
]

export const validatePost = [
  // Validaciones básicas para crear/editar posts
  body('post_type_id').isInt().withMessage('post_type_id inválido'),
  body('title').isLength({ min: 3 }).withMessage('title requerido'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    next()
  }
]

export const validateRating = [
  // Validación para valoraciones: rated_id entero y stars entre 1 y 5
  body('rated_id').isInt().withMessage('rated_id inválido'),
  body('stars').isInt({ min: 1, max: 5 }).withMessage('stars debe ser 1-5'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    next()
  }
]

export default { validateRegister, validateLogin, validatePost, validateRating }
