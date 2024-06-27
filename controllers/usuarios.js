// usuario.js

const express = require('express');
const router = express.Router();
const { iniciarSesion } = require('../controllers/iniciarSesionController');
const Usuario = require('../models/usuario');

// Ruta para crear un nuevo usuario
router.post('/registrar', async (req, res) => {
    // Extraer los datos del usuario del cuerpo de la solicitud
    const { nombre, correo, contraseña, direccion, ciudad, rif, number } = req.body;

    try {
        // Validar si algún campo está vacío
        if (!nombre || !correo || !contraseña || !direccion || !ciudad) {
            // Retornar un mensaje de error si algún campo está vacío
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si ya existe un usuario con el mismo correo electrónico
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Ya existe un usuario con este correo electrónico' });
        }

        // Crear un nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            contraseña,
            direccion,
            ciudad,
            rif,
            number
        });

        // Guardar el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        // Responder con un mensaje de éxito
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso
        console.error('Error al crear usuario:', error);
        // Responder con un mensaje de error
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    // Extraer correo y contraseña del cuerpo de la solicitud
    const { correo, contraseña } = req.body;

    try {
        // Intentar iniciar sesión usando el controlador
        const usuario = await iniciarSesion(correo, contraseña);

        if (usuario) {
            // Inicio de sesión exitoso, devolver el usuario
            res.status(200).json({ usuario });
        } else {
            // Credenciales inválidas
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
    }
});

module.exports = router;
