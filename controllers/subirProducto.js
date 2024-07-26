const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const router = express.Router();

// Configura multer para manejar archivos en memoria
const storage = multer.memoryStorage(); // Usamos almacenamiento en memoria
const upload = multer({ storage });

// Endpoint de Bunny.net
const bunnyStorageUrl = 'https://dash.bunny.net/storage/724391/access'; // Reemplaza con tu zona de almacenamiento
const bunnyAccessKey = 'YOUR_BUNNYNET_ACCESS_KEY'; // Reemplaza con tu clave de acceso

// Ruta para subir archivos
router.post('/upload', upload.single('inputImagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha cargado ningún archivo');
    }

    try {
        // Crea un formulario para enviar el archivo
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname });

        // Sube el archivo a Bunny.net
        const response = await axios.put(
            `${bunnyStorageUrl}/${req.file.originalname}`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    'AccessKey': bunnyAccessKey, // Clave de acceso para Bunny.net
                },
            }
        );

        // Devuelve la URL del archivo subido
        res.json({ url: `${bunnyStorageUrl}/${req.file.originalname}` });
    } catch (err) {
        console.error('Error al subir el archivo:', err);
        res.status(500).send('Error al subir el archivo');
    }
});

module.exports = router;
