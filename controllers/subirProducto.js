const express = require('express');
const multer = require('multer');
const axios = require('axios');
const Producto = require('../models/producto');
require('dotenv').config();

const router = express.Router();

// Configura multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configura Bunny.net
const bunnyStorageUrl = 'https://storage.bunnycdn.com/starclean';
const bunnyAccessKey = process.env.YOUR_BUNNYNET_ACCESS_KEY;

// Ruta para subir archivos
router.post('/upload', upload.single('inputImagen'), async (req, res) => {
    if (!req.file) {
        const errorMsg = 'No se ha cargado ningún archivo';
        console.error(errorMsg);
        return res.status(400).send(errorMsg);
    }

    try {
        const fileName = req.file.originalname;
        const fileBuffer = req.file.buffer;

        // Sube el archivo a Bunny.net
        const response = await axios.put(
            `${bunnyStorageUrl}/${fileName}`,
            fileBuffer,
            {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'AccessKey': bunnyAccessKey,
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            // URL del archivo subido
            const fileUrl = `${bunnyStorageUrl}/${fileName}`;

            // Guardar el producto en MongoDB
            const nuevoProducto = new Producto({
                nombre: req.body.nombre,
                costo: req.body.costo,
                precio: req.body.precio,
                imagen: {
                    data: fileUrl, // Usamos la URL como el campo data
                    contentType: 'image/jpeg' // Ajusta el tipo de contenido según el archivo subido
                },
                categoria: req.body.categoria
            });

            await nuevoProducto.save();

            // Responder con la URL del archivo y confirmación de guardado
            res.json({ url: fileUrl, mensaje: 'Producto subido y guardado exitosamente' });
        } else {
            const errorMsg = `Error al subir el archivo. Código de estado: ${response.status}`;
            console.error(errorMsg);
            res.status(response.status).send(errorMsg);
        }
    } catch (err) {
        if (err.response) {
            console.error(`Error en la respuesta de Bunny.net: ${err.response.status} - ${err.response.data}`);
            res.status(err.response.status).send(`Error en la respuesta de Bunny.net: ${err.response.status}`);
        } else if (err.request) {
            console.error('Error en la solicitud a Bunny.net:', err.request);
            res.status(500).send('Error en la solicitud a Bunny.net. Verifica la conexión de red.');
        } else {
            console.error('Error inesperado:', err.message);
            res.status(500).send('Error inesperado. Por favor, intenta nuevamente.');
        }
    }
});

module.exports = router;
