const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const router = express.Router();

// Configura multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint de Bunny.net
const bunnyStorageUrl = 'https://storage.bunnycdn.com/starclean'; // Reemplaza con tu zona de almacenamiento
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
            req.file.buffer, // Enviar el archivo directamente en el cuerpo
            {
                headers: {
                    'Content-Type': 'application/octet-stream', // Tipo de contenido adecuado para archivos binarios
                    'AccessKey': bunnyAccessKey, // Clave de acceso para Bunny.net
                },
            }
        );

        // Verifica el estado de la respuesta para asegurarse de que la carga fue exitosa
        if (response.status === 200 || response.status === 201) {
            // Devuelve la URL del archivo subido
            res.json({ url: `${bunnyStorageUrl}/${req.file.originalname}` });
        } else {
            res.status(response.status).send('Error al subir el archivo');
        }
    } catch (err) {
        console.error('Error al subir el archivo:', err);
        res.status(500).send('Error al subir el archivo');
    }
});

module.exports = router;
