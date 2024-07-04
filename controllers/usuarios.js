const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    // Extraer los datos del usuario del cuerpo de la solicitud
    const { nombre, correo, contraseña, direccion, ciudad, rif, number } = req.body;

    try {
        // Validar si algún campo está vacío
        if (!nombre || !correo || !contraseña || !direccion || !ciudad) {
            // Retornar un mensaje de error si algún campo está vacío
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await Usuario.find(); // Busca todos los usuarios en la base de datos

        res.status(200).json(users); // Envía los usuarios encontrados como respuesta
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = router;
