require('dotenv').config(); // Al principio de tu archivo principal
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const router = express.Router();

// Configura multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint de Bunny.net
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
            fileBuffer, // Enviar el archivo directamente en el cuerpo
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
            res.json({ url: `${bunnyStorageUrl}/${fileName}` });
        } else {
            const errorMsg = `Error al subir el archivo. Código de estado: ${response.status}`;
            console.error(errorMsg);
            res.status(response.status).send(errorMsg);
        }
    } catch (err) {
        if (err.response) {
            // Errores específicos de la respuesta (ej. errores del servidor de Bunny.net)
            console.error(`Error en la respuesta de Bunny.net: ${err.response.status} - ${err.response.data}`);
            res.status(err.response.status).send(`Error en la respuesta de Bunny.net: ${err.response.status}`);
        } else if (err.request) {
            // Errores en la solicitud (ej. problemas de red)
            console.error('Error en la solicitud a Bunny.net:', err.request);
            res.status(500).send('Error en la solicitud a Bunny.net. Verifica la conexión de red.');
        } else {
            // Otros errores (ej. errores de configuración o programación)
            console.error('Error inesperado:', err.message);
            res.status(500).send('Error inesperado. Por favor, intenta nuevamente.');
        }
    }
});

module.exports = router;
