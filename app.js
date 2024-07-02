require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');
const productosRouter = require('./controllers/productos'); // Asegúrate de la ruta correcta
const Handlebars = require('handlebars');

const compression = require('compression');
const session = require('express-session');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGODB_URI;
const multer = require('multer');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo en el servidor (timestamp + extensión)
    }
});

const upload = multer({ storage: storage });







// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(compression());
// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Debería ser true en producción con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 día de expiración
    }
}));

// Conexión a la base de datos
mongoose.connect(mongoURI, {
 
})
.then(() => {
    console.log('Conexión a la base de datos establecida');
})
.catch(err => console.error('Error al conectar a la base de datos:', err));
// Rutas de archivos estáticos
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use( 'public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.resolve(__dirname, 'views', 'gestionar')));
app.use('/cuenta', express.static(path.resolve(__dirname, 'views', 'cuenta')));
app.use('/informacion', express.static(path.resolve(__dirname, 'views', 'infocuenta')));
app.use('/iniciarsesion', express.static(path.resolve(__dirname, 'views', 'iniciar')));
app.use('/tuspedidos', express.static(path.resolve(__dirname, 'views', 'pedidos')));
app.use('/registrarse', express.static(path.resolve(__dirname, 'views', 'registrar')));
app.use('/configuracion', express.static(path.resolve(__dirname, 'views', 'plantila-configuracion')));
app.use('/servicioalcliente', express.static(path.resolve(__dirname, 'views', 'serviciocliente')));
app.use('/clientes', express.static(path.resolve(__dirname, 'views', 'clientes')));
app.use('/gestion', express.static(path.resolve(__dirname, 'views', 'gestionar')));
app.use('/administrar', express.static(path.resolve(__dirname, 'views', 'admin')));
app.use('/cotizaciones', express.static(path.resolve(__dirname, 'views', 'cotizaciones')));
app.use('/verproductos', express.static(path.resolve(__dirname, 'views', 'productos')));

// Rutas de API
app.use('/api/users', userRouter);

app.use('/api/subir-producto', productosRouter); // Monta el enrutador de productos


// Ruta para subir una imagen y guardar un producto

router.post('/subir-producto', upload.single('imagen'), async (req, res) => {
    try {
        // Verificar si se subió correctamente el archivo
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha seleccionado ningún archivo para subir.' });
        }

        // Validar los datos recibidos del formulario
        const { nombre, precio, costo, categoria } = req.body;
        if (!nombre || !precio || !costo || !categoria) {
            return res.status(400).json({ error: 'Por favor completa todos los campos.' });
        }

        // Crear un nuevo producto con la información recibida
        const nuevoProducto = new Producto({
            nombre,
            precio,
            costo,
            categoria,
            imagen: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        // Guardar el nuevo producto en la base de datos
        const productoGuardado = await nuevoProducto.save();

        // Enviar respuesta al cliente con el producto guardado
        res.status(201).json({ mensaje: 'Producto subido correctamente', producto: productoGuardado });
    } catch (error) {
        console.error('Error al subir producto:', error);
        res.status(500).json({ error: 'Error interno al guardar el producto' });
    }
});


// Rutas de autenticación y sesión
app.post('/api/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario || usuario.contraseña !== contraseña) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.usuario = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            direccion: usuario.direccion,
            ciudad: usuario.ciudad,
            rif: usuario.rif,
            // Agregar otros datos según sea necesario
        };

        res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
});

// Ruta para subir archivos 

app.get('/cuenta', (req, res) => {
    if (req.session.usuario) {
        console.log(`Bienvenido, ${req.session.usuario.nombre}!`);
        res.render('cuenta', { usuario: req.session.usuario });
    } else {
        res.redirect('/iniciarsesion');
    }
});

app.get('/infocuenta', (req, res) => {
    if (req.session.usuario) {
        res.render('infocuenta', { usuario: req.session.usuario });
    } else {
        res.redirect('/iniciarsesion');
    }
});



// Middleware para servir archivos estáticos en la carpeta de uploads


// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
module.exports = app;
module.exports = router;
// Exportar upload para que esté disponible en otros archivos

