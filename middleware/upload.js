const multer = require('multer');
const path = require('path');
const upload = require('/app')
// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads'); // Directorio donde se almacenarán los archivos
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para el archivo
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Configurar la instancia de Multer
const upload = multer({ storage: storage });

module.exports = upload;
