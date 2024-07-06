const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    productos: [{
        id: { type: String, required: true },
        nombre: { type: String, required: true },
        categoria: { type: String },
        cantidad: { type: Number, default: 1 },
    }],
    fecha: { type: Date, default: Date.now },
});

// Definir el modelo de la cotización
const Cotizacion = mongoose.model('Cotizacion', CotizacionSchema);


module.exports = Cotizacion;