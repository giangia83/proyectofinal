const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

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

// Obtener un usuario por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la solicitud

    try {
        const usuario = await Usuario.findById(id); // Buscar el usuario por su ID en la base de datos

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario); // Enviar el usuario encontrado como respuesta
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.put('/configuracion/', async (req, res) => {
    // Verificar si hay un usuario en sesión
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'No has iniciado sesión' });
    }

    const usuarioId = req.session.usuario._id; // Obtener el ID del usuario desde la sesión
    const { nombre, correo, contraseña, direccion, ciudad, rif, number } = req.body; // Extraer los datos actualizados del usuario

    try {
        // Buscar y actualizar el usuario por su ID
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuarioId,
            { nombre, correo, contraseña, direccion, ciudad, rif, number },
            { new: true } // Devuelve el documento actualizado
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar los datos de sesión con la información actualizada del usuario
        req.session.usuario = usuarioActualizado;

        res.status(200).json(usuarioActualizado); // Enviar el usuario actualizado como respuesta
    } catch (error) {
        console.error('Error al actualizar configuración de usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Eliminar un usuario por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la solicitud

    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(id); // Buscar y eliminar el usuario por su ID

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
