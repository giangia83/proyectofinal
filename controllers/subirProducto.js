const express = require('express');
const multer = require('multer');
const axios = require('axios');
const sharp = require('sharp');
const Producto = require('../models/producto');
require('dotenv').config();

const router = express.Router();

// Configura multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configura Bunny.net
const bunnyStorageUrl = 'https://storage.bunnycdn.com/starclean';
const bunnyPullZoneUrl = 'https://starclean-bucket.b-cdn.net'; // URL del Pull Zone
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

        // Convierte la imagen a WebP usando sharp
        const webpBuffer = await sharp(fileBuffer)
            .webp()
            .toBuffer();

        // Crea un nuevo nombre para el archivo WebP (opcional)
        const webpFileName = fileName.replace(/\.[^/.]+$/, '') + '.webp';

        // Sube el archivo convertido a Bunny.net
        const response = await axios.put(
            `${bunnyStorageUrl}/${webpFileName}`,
            webpBuffer,
            {
                headers: {
                    'Content-Type': 'image/webp',
                    'AccessKey': bunnyAccessKey,
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            // URL del archivo subido usando el Pull Zone
            const fileUrl = `${bunnyPullZoneUrl}/${webpFileName}`;

            // Guardar el producto en MongoDB
            const nuevoProducto = new Producto({
                nombre: req.body.nombre,
                costo: req.body.costo,
                precio: req.body.precio,
                imagen: {
                    data: fileUrl, // Usamos la URL del Pull Zone como el campo data
                    contentType: 'image/webp' // Ajusta el tipo de contenido a 'image/webp'
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
