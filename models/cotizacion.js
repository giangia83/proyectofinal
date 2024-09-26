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
            type: mongoose.Schema.Types.ObjectId, // Referencia al modelo Producto
            ref: 'Producto',
            required: true,
        },
        nombre: {
            type: String,
            required: true,
        },
        categoria: {
            type: String,
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
    detallesPago: {
        numeroCuenta: { type: String },
        monto: { type: Number },
        fechaPago: { type: Date },
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Método virtual para calcular el total
cotizacionSchema.virtual('total').get(function() {
    return this.productos.reduce((sum, producto) => {
        return sum + (producto.precio * producto.cantidad);
    }, 0);
});

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

module.exports = Cotizacion;
