const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        
        // Buscar el usuario por correo
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Comparar la contraseña proporcionada con la encriptada en la base de datos
        const match = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!match) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Guardar los datos de sesión
        req.session.userId = usuario._id; // Almacena el ID del usuario en la sesión
        req.session.usuario = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            direccion: usuario.direccion,
            ciudad: usuario.ciudad,
            rif: usuario.rif,
            esAdmin: usuario.rol === 'admin',
            rol: usuario.rol
        };

        // Establecer la cookie con el nombre de usuario
        res.cookie('usuario', usuario.nombre, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });

        // Redirigir según el rol
        if (usuario.rol === 'admin') {
            return res.status(200).json({ message: 'Inicio de sesión exitoso como admin', redirectTo: '/administrar' });
        } else {
            return res.status(200).json({ message: 'Inicio de sesión exitoso', redirectTo: '/' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
});

module.exports = router;
