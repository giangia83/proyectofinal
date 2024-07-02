const mongoose = require('mongoose');


const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    image: {
        data: { type: String, required: true }, // Cambiado a String para la URL de la imagen
        contentType: { type: String, required: true } // Tipo de contenido del archivo (ej. 'image/png')
    }
});


 
/*  */


const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;