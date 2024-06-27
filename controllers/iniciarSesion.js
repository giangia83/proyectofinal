// iniciarSesionController.js

const Usuario = require('../models/usuario');

async function iniciarSesion(correo, contraseña) {
    try {
        // Buscar el usuario por su correo electrónico
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // El usuario no existe en la base de datos
            console.log("No existe el usuario.");
            return null;
        }

        // Verificar si la contraseña coincide
        if (usuario.contraseña !== contraseña) {
            // La contraseña no coincide
            return null;
        }

        // La autenticación fue exitosa
        console.log("Usuario encontrado exitosamente.");
        return usuario;
    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso
        console.error('Error al iniciar sesión:', error);
        return null;
    }
}

module.exports = {
    iniciarSesion
};
