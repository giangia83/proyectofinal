require('dotenv').config();
const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const saltRounds = 10; 



// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await Usuario.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener información del admin
router.get('/admin', async (req, res) => {
    try {
        // Suponiendo que tienes un usuario con rol 'admin'
        const admin = await Usuario.findOne({ rol: 'admin' });
        if (!admin) {
            return res.status(404).json({ error: 'Admin no encontrado' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error('Error al obtener admin:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, correo, contraseña, direccion, ciudad, rif, number } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        // Crear el nuevo usuario con la contraseña encriptada
        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            contraseña: hashedPassword, // Guardar la contraseña encriptada
            direccion,
            ciudad,
            rif,
            number
        });

        // Guardar el usuario en la base de datos
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Obtener un usuario por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



// Renderizar la vista para editar un usuario por su ID
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.render('plantilla-configuracion/index', { usuarioActual: usuario }); // Renderiza la vista 'editar.ejs' con los datos del usuario
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Procesar la actualización del usuario por su ID
router.put('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, contraseña, direccion, ciudad, rif, number } = req.body;

    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, {
            nombre,
            correo,
            contraseña,
            direccion,
            ciudad,
            rif,
            number
        }, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar res.locals.usuario con los datos actualizados
        res.locals.usuario = {
            _id: usuarioActualizado._id,
            nombre: usuarioActualizado.nombre,
            correo: usuarioActualizado.correo,
            direccion: usuarioActualizado.direccion,
            ciudad: usuarioActualizado.ciudad,
            rif: usuarioActualizado.rif,
            number: usuarioActualizado.number,
         
        };

        // Actualizar la cookie con el nombre de usuario actualizado
        res.cookie('usuario', usuarioActualizado.nombre, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'lax' });

        // Enviar respuesta con el usuario actualizado
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar un usuario por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
