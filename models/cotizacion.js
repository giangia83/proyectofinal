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
        productoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',  // Referencia al modelo Producto
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        },
     
        precio: {
            type: Number,
        }
    }],
});

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

module.exports = Cotizacion;
