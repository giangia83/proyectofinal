const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    usuarioNombre: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        default: 'Pendiente',
    },
    productos: [{
        productoId: { // Cambiar id por productoId y usar ObjectId
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto', // Hacer referencia a la colección de productos
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        }
    }],
});

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

module.exports = Cotizacion;
