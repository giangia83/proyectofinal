const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Configuración de multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads')); // Usar path.join para asegurar la ruta correcta
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Nombre original del archivo
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('inputImagen'), async (req, res) => {
    // Verificar si se subió un archivo correctamente
    if (!req.file) {
        return res.status(400).send('No se ha cargado ningún archivo');
    }

    // Obtener el path del archivo subido
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    
    // Path para el archivo WebP convertido
    const webpFileName = `${path.parse(req.file.filename).name}.webp`;
    const webpFilePath = path.join(__dirname, '..', 'uploads', webpFileName);

    try {
        // Convertir la imagen a WebP usando sharp
        await sharp(filePath)
            .webp()
            .toFile(webpFilePath);

        // Eliminar el archivo original (opcional)
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error al eliminar el archivo original:', err);
        });

        // Construir la URL completa del archivo WebP convertido
        const imageUrl = '/uploads/' + webpFileName;

        // Crear un nuevo objeto Producto con los datos recibidos
        const newProduct = new Producto({
            nombre: req.body.nombre,
            precio: req.body.precio,
            costo: req.body.costo,
            categoria: req.body.categoria,
            file: {
                data: imageUrl, // Guardar la URL completa del archivo WebP
                contentType: 'image/webp'
            }
        });

        // Guardar el producto en la base de datos
        const savedProduct = await newProduct.save();
        res.json(savedProduct); // Enviar el objeto del producto guardado como respuesta

    } catch (err) {
        console.error('Error al procesar la imagen:', err);
        res.status(500).send('Error al procesar la imagen');
    }
});

module.exports = router;
