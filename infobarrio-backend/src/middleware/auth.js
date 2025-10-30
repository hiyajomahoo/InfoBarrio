// Middleware de verificación de JWT
// Acepta el token en el header Authorization: Bearer <token> o en la cookie 'tokenSesion'
import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  try {
    // Extraer token desde header Authorization o cookie
    const authHeader = req.headers.authorization
    let token = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (req.cookies && req.cookies.tokenSesion) {
      token = req.cookies.tokenSesion
    }

    // Si no hay token, devolver 401
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' })

    // Verificar y decodificar token usando la clave SECRETO_JWT
    // En caso de token inválido jwt.verify lanzará excepción
    const payload = jwt.verify(token, process.env.SECRETO_JWT)

    // Guardar payload (info del usuario) en req.user para que lo usen controladores
    req.user = payload
    next()
  } catch (error) {
    // Errores comunes: token expirado, firma incorrecta, token malformado
    console.error('verifyToken error:', error)
    return res.status(401).json({ message: 'Token inválido' })
  }
}

export default verifyToken
