const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

router.post('/', async (req, res) => {
    const { nombre, correo, contraseña, direccion, ciudad } = req.body;

    try {
        // Verificar si ya existe un usuario con el mismo correo electrónico
        const usuarioExistente = await Usuario.findOne({ correo });

        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        // Crear un nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            contraseña,
            direccion,
            ciudad
        });

        // Guardar el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        return res.status(200).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
