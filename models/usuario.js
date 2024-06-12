const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true // Para garantizar que no haya usuarios duplicados con el mismo correo electrónico
    },
    contraseña: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    }
    // Otros campos que puedas necesitar
});

usuarioSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v; // Elimina el campo __v si lo deseas
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
