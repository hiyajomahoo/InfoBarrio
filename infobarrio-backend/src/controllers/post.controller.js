/*
  Controlador: Post
  - CRUD y queries comunes para publicaciones.
  - createPost: inserta una publicación en la BD.
  - getNewestPost: obtiene los últimos 5 posts (sin trabajos, type 4).
  - getPost: obtiene detalle de una publicación por ID.
  - getPosts: obtiene todas las publicaciones.
  - getPostsByType: filtra publicaciones por tipo.
  - getPostsByUser: filtra publicaciones por usuario.
  - deletePost: elimina una publicación.
  - editPost: actualiza una publicación.
*/
import db from "../config/database.js"

export const createPost = async (req, res) => {
    const consulta = 'INSERT INTO posts (user_id, post_type_id, title, description, price, status) VALUES (?,?,?,?,?,?)'
    const {user_id, post_type_id, title, description, price, status} = req.body
    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta, [user_id, post_type_id, title, description, price, status]) 
        conexion.release()
        res.status(201).json({message:"Post creado satisfactoriamente"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error al realizar la consulta."})    }
}

export const getNewestPost = async (req, res) => {
    const consulta = 'SELECT * FROM posts WHERE NOT post_type_id = 4 ORDER BY id DESC LIMIT 5'
    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta)
        conexion.release()
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({message:"Error al realizar la consulta."})
    }
}

export const getPost = async (req, res) => {
    const consulta = 'SELECT * FROM posts WHERE id = ?'
    const id = req.params.id
    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta, id)
        conexion.release()
    res.status(200).json(respuesta[0])
    } catch (error) {
        res.status(500).json({message:"Error al realizar la consulta."})
    }
}

export const getPosts = async (req, res) => {
    const consulta = 'SELECT * FROM posts'
    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta)
        conexion.release()
    res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({message:"Error al realizar la consulta."})
    }    
}

export const getPostsByType = async (req, res) => {
    const consulta = 'SELECT * FROM posts WHERE post_type_id = ?'
    const id = req.params.id
    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta, id)
        conexion.release()
    res.status(200).json(respuesta)        
    } catch (error) {
        res.status(500).json({message:"Error al realizar la consulta."})  
    }
}

export const getPostsByUser = async (req, res) => {
    const consulta = 'SELECT * FROM posts WHERE user_id = ?'
    const id = req.params.id
    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta, id)
        conexion.release()
    res.status(200).json(respuesta)        
    } catch (error) {
        res.status(500).json({message:"Error al realizar la consulta."})  
    }
}

export const deletePost = async (req, res) => {
    const consulta = 'DELETE FROM posts WHERE id = ?'
    const id = req.params.id
    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta, [id])
        conexion.release()
    res.status(200).json({message:"Post eliminado satisfactoriamente"})        
    } catch (error) {
        res.status(500).json({message:"Error al realizar la consulta."}) 
        console.log(error)        
    }
}

export const editPost = async (req, res) => {
    const consulta = 'UPDATE posts SET ? WHERE id = ?'
    const post = req.body
    const id = req.params.id

    try {
        const conexion = await db.getConnection()
        const [respuesta] = await conexion.query(consulta, [post, id])
        conexion.release()        
    res.status(200).json({message:"Post actualizado satisfactoriamente"})        
    } catch (error) {
        res.status(500).json({message:"Error al realizar la consulta."})                  
    }
}