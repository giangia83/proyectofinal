const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Nombre original del archivo
    }
});



const upload = multer({ storage });


router.post('/upload', upload.single('file'), (req, res) => {
    // Verificar si se subió un archivo correctamente
    if (!req.file) {
        return res.status(400).send('No se ha cargado ningún archivo');
    }

    // Construir la URL completa del archivo subido
    const imageUrl = '/uploads/' + req.file.filename;

    // Crear un nuevo objeto Producto con los datos recibidos
    const newProduct = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        costo: req.body.costo,
        categoria: req.body.categoria,
        file: {
            data: imageUrl, // Guardar la URL completa del archivo
            contentType: req.file.mimetype
        }
    });
/*  */
    // Guardar el producto en la base de datos
    newProduct.save()
        .then(savedProduct => {
            res.json(savedProduct); // Enviar el objeto del producto guardado como respuesta
        })
        .catch(err => {
            console.error('Error al guardar el producto:', err);
            res.status(500).send('Error al guardar el producto en la base de datos');
        });
});

module.exports = router;