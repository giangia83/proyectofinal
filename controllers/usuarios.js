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

router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Detalles del usuario ${id}`);
});



// Ruta para editar un usuario por su ID (usando el middleware de autenticación)
// Ruta para editar un usuario por su ID (usando el middleware de autenticación)

router.put('/editar/:id', async (req, res) => {
    const { id } = req.params; // ID del usuario a actualizar desde el parámetro de la ruta
    const { nombre, correo, contraseña, direccion, ciudad, rif } = req.body; // Datos actualizados del usuario

    try {
        // Verificar si el usuario está autenticado y obtener su ID desde la sesión
        const usuarioID = req.session.usuario._id;

        // Verificar que el usuario que intenta actualizar sea el mismo que está autenticado
        if (usuarioID !== id) {
            return res.status(401).json({ error: 'No tienes permisos para realizar esta acción' });
        }

        // Actualizar los campos del usuario en la base de datos
        await Usuario.findByIdAndUpdate(id, {
            nombre,
            correo,
            contraseña, // Aquí deberías manejar la encriptación de contraseñas si es necesario
            direccion,
            ciudad,
            rif
        });

        // Obtener el usuario actualizado desde la base de datos
        const usuarioActualizado = await Usuario.findById(id);

        // Responder con el usuario actualizado
        res.json(usuarioActualizado);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
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
