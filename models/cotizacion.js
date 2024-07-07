const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
    },
      estado:{
            type: String,
            default: 'Pendiente',
            

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
            required: true;
        },
      
    }],
});

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

module.exports = Cotizacion;
