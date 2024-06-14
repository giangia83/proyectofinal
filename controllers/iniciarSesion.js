// iniciarSesionController.js



async function iniciarSesion(email, contraseña) {
    try {
        // Buscar el usuario por su correo electrónico
        const usuario = await usuariosController.buscarUsuarioPorCorreo(email);

        if (!usuario) {
            // El usuario no existe en la base de datos
            return null;
        }

        // Verificar si la contraseña coincide
        if (usuario.contraseña !== contraseña) {
            // La contraseña no coincide
            return null;
        }

        // La autenticación fue exitosa
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
