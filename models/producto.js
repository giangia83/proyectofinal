const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({

    nombre:{

        type:String,
        required:true


    },

    precio: {
        type: String,
        required: true
    },
    costo: {
        type: String,
        required: true
      
    },
    categoria: {
        type: String,
        required: true
    },

    imagen:{

        type:String,
        required: true

    }


 
})


const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;