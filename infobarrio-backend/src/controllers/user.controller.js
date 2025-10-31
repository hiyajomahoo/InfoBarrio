// Controlador de usuarios: login, registro, logout y obtener perfil
// Explicación general:
// - Usa el pool de conexiones exportado en src/config/database.js
// - En login compara el password con bcrypt y devuelve un JWT en cookie y en JSON
// - En createUser inserta un nuevo usuario con password hasheado
import db from "../config/database.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'


export const login = async (req, res) => {
    // Extraer credenciales del body
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).send("Parámetros insuficientes.")
    }

    try {
        // Consulta de usuario por username
        const consulta = `SELECT * FROM users WHERE username = ?`
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta, [username])
        conexion.release()

        // Si no existe el usuario retornar 404
        if (!respuesta[0]) return res.status(404).json({message: "El usuario no existe."})

        // Comparar password con el hash almacenado
        if (!await bcrypt.compare(password, respuesta[0].password_hash)) {
            return res.status(401).send("Contraseña incorrecta.")
        }

        const user = respuesta[0]

        // Construir payload que se incluirá en el JWT (no incluir password)
        const payload = {
            id: user.id,
            name: user.name,
            dni: user.dni,
            numberPhone: user.numberPhone,
            email: user.email,
            username: user.username,
            profile_photo: user.profile_photo,
            bio: user.bio,
            reputation: user.reputation
        }

        // Firmar JWT con la clave en SECRETO_JWT (ver .env)
        const token = jwt.sign(payload, process.env.SECRETO_JWT, { expiresIn: '24h' })

        // Configurar cookie segura en producción
        const secureFlag = process.env.NODE_ENV === 'production'
        const sameSite = secureFlag ? 'none' : 'lax'

        // Enviar cookie httpOnly para navegadores que la soporten
        res.cookie('tokenSesion', token, {
            httpOnly: true,
            sameSite,
            secure: secureFlag,
            maxAge: 86400000 // 24 horas en milisegundos
        })

        // Devolver token y usuario sin el hash de contraseña
        const { password_hash, ...sanitizedUser } = user
        res.status(200).json({ message: 'Inicio de sesion satisfactorio!', token, user: sanitizedUser })
    } catch (error) {
        console.log(error)
        res.status(500).send("Error en la consulta")
    }
}

export const createUser = async (req, res) => {
    // Registro de nuevo usuario: recibir campos y guardar con password hasheado
    const {username, password, name, dni, numberPhone, email} = req.body
    const rondasSalt = 12

    if (!username || !password) {
        console.log("Faltan cosas!")
       return res.status(400).send("Parametros insuficientes.")
    }

    try {
        const conexion = await db.getConnection()
        // Comprobar si username ya existe
        let consulta = `SELECT * FROM users WHERE username = ?`
        let [respuesta] = await conexion.query(consulta, [username])
        if(respuesta.length > 0) {
            conexion.release()
            console.log("Existe")
            return res.status(400).json({message: "El usuario ya existe."})
        }

        // Generar hash de la contraseña y guardar el usuario
        const salt = await bcrypt.genSalt(rondasSalt)
        const contraseñaHash = await bcrypt.hash(password, salt)
        consulta = `INSERT INTO users (name, dni, numberPhone, email, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)`
        
        await conexion.query(consulta, [name, dni, numberPhone, email, username, contraseñaHash])
        conexion.release()
        res.status(201).send("Usuario creado satisfactoriamente.")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error en la consulta")
    }
}

export const logout = async (req, res) => {
    try {
        // Borrar cookie de sesión (en dev secure puede no aplicarse)
        res.clearCookie('tokenSesion', { httpOnly: true, sameSite: 'none', secure: false })
        return res.status(200).json({ message: 'Sesión cerrada' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error cerrando sesión' })
    }
}

export const me = async (req, res) => {
    // Devuelve la información del usuario extraída del token (middleware auth debe setear req.user)
    if (!req.user) return res.status(401).json({ message: 'No autenticado' })
    return res.status(200).json({ user: req.user })
}

export const getUserById = async (req, res) => {
    const userId = req.params.id
    try {
        const conexion = await db.getConnection()
        const consulta = `SELECT id, name, username, profile_photo, bio, reputation FROM users WHERE id = ?`
        const [rows] = await conexion.query(consulta, [userId])
        conexion.release()
        if (!rows || rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' })
        return res.status(200).json({ user: rows[0] })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en la consulta' })
    }
}