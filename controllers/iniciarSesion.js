const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');


router.post('/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario || usuario.contraseña !== contraseña) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si el usuario es administrador
        if (usuario.rol === 'admin') {
            // Guardar los datos de sesión y cookies para el administrador
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
                httpOnly: true, // Ajustar según tus necesidades de seguridad
                secure: true, // Cambiar a true en producción con HTTPS
                maxAge: 24 * 60 * 60 * 1000, // 1 día de expiración
                sameSite: 'lax'
            });

            // Redirigir a la interfaz de administración
            return res.status(200).json({ message: 'Inicio de sesión exitoso como admin', redirectTo: '/administrar' });
        }

        // Si no es administrador, es un usuario normal
        req.session.usuario = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            direccion: usuario.direccion,
            ciudad: usuario.ciudad,
            rif: usuario.rif
           
        };

        // Establecer la cookie con el nombre de usuario
        res.cookie('usuario', usuario.nombre, {
            httpOnly: true, // Ajustar según tus necesidades de seguridad
            secure: true, // Cambiar a true en producción con HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 día de expiración
            sameSite: 'lax'
        });

        // Redirigir al área de usuario normal, por ejemplo, la página principal
        res.status(200).json({ message: 'Inicio de sesión exitoso', redirectTo: '/' });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
});

module.exports = router;