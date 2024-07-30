const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Definir el esquema del usuario
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true // Garantiza que no haya usuarios duplicados con el mismo correo electrónico
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
    },
    rif: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario' // Por defecto, todos los usuarios son de tipo 'usuario'
    },
    
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Producto' }],
    // Cambia el campo de imagen para usar URL
    imagen: {
        data: String, // URL de la imagen
        contentType: String // Tipo de contenido
    }
  
});

// Crear el modelo de usuario a partir del esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Exportar el modelo para poder usarlo en otras partes de la aplicación
module.exports = Usuario;
