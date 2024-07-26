const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const multer = require('multer');
const path = require('path'); // Asegúrate de importar 'path'
const fs = require('fs');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Crear directorio si no existe
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Ruta para subir productos
router.post('/upload', upload.single('inputImagen'), (req, res) => {
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
