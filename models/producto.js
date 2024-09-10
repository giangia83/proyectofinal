const mongoose = require('mongoose');


const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    imagen: {
        data: { type: String, required: true }, 
        contentType: { type: String, required: true } 
    }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;