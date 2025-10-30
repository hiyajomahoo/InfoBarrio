// Middleware global de manejo de errores
// Si algún middleware o ruta llama next(err) llegará aquí
export const errorHandler = (err, req, res, next) => {
  // Log del error en servidor para debugging
  console.error('Unhandled error:', err)

  // Respuesta genérica al cliente. En producción puedes mostrar menos detalle.
  res.status(500).json({ message: 'Error interno del servidor' })
}

export default errorHandler
