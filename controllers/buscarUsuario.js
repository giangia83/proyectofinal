

const Usuario = require('../models/usuario');

async function buscarUsuarioPorCorreo(correo) {
    try {
        const usuario = await Usuario.findOne({ correo });
        return usuario;
    } catch (error) {
        throw new Error('Error al buscar usuario por correo');
    }
}

async function buscarUsuarioPorNombre(nombreUsuario) {
    try {
        const usuario = await Usuario.findOne({ nombreUsuario });
        return usuario;
    } catch (error) {
        throw new Error('Error al buscar usuario por nombre de usuario');
    }
}

module.exports = {
    buscarUsuarioPorCorreo,
    buscarUsuarioPorNombre
};
