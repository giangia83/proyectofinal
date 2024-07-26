const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

router.post('/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        // Buscar el usuario por correo
        const usuario = await Usuario.findOne({ correo });

        // Verificar si el usuario existe y si la contraseña es correcta
        if (!usuario || contraseña !== usuario.contraseña) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Configurar la sesión del usuario
        req.session.usuario = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            direccion: usuario.direccion,
            ciudad: usuario.ciudad,
            rif: usuario.rif,
            esAdmin: usuario.rol === 'admin'
        };

        // Establecer la cookie con el nombre de usuario
        res.cookie('usuario', usuario.nombre, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Cambiar según el entorno
            maxAge: 24 * 60 * 60 * 1000, // 1 día
            sameSite: 'lax'
        });

        // Redirigir según el rol del usuario
        const redirectTo = usuario.rol === 'admin' ? '/administrar' : '/';
        res.status(200).json({ message: 'Inicio de sesión exitoso', redirectTo });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
});

module.exports = router;
