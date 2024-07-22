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
router.get('/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Renderiza la vista editar.ejs con los datos del usuario
        res.render('plantilla-configuracion/index', { usuarioActual: usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// Ruta para procesar la actualización del usuario
router.put('/editar/:id', async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a actualizar
        const { nombre, correo, contraseña, direccion, ciudad, rif, number } = req.body; // Datos actualizados

        // Verificar si el usuario existe
        let usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar los campos del usuario
        usuario.nombre = nombre;
        usuario.correo = correo;
        usuario.contraseña = contraseña; // Asegúrate de implementar la encriptación de contraseñas
        usuario.direccion = direccion;
        usuario.ciudad = ciudad;
        usuario.rif = rif;
        usuario.number = number;

        // Guardar los cambios en la base de datos
        await usuario.save();

        // Redirigir al perfil del usuario o a otra página después de la actualización
        res.redirect(`plantilla-configuracion/index`); // Cambia esto por la ruta adecuada a tu aplicación

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
