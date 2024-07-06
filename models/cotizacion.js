const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
    },
    productos: [{
        id: {
            type: String,
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
            default: 1,
        },
    }],
});

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

module.exports = Cotizacion;
