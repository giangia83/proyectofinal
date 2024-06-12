const express = require('express');
const userRouter = express.Router();
const Usuario = require('../models/usuario');

userRouter.post('/', async (request, response) => {
    const { nombre, correo, contraseña, direccion, ciudad } = request.body;

    try {
        const usuarioExistente = await Usuario.findOne({ correo });

        if (usuarioExistente) {
            return response.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            contraseña,
            direccion,
            ciudad
        });

        await nuevoUsuario.save();
        return response.status(200).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = userRouter;
