require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');
const compression = require('compression');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGODB_URI;
const multer = require('multer');
const fs = require('fs');
const Producto = require("./models/producto")
const Usuario = require("./models/usuario")

/* marko for html */
let ejs = require('ejs');

const uploadDirectory = path.join(__dirname, 'uploads');

// Crear la carpeta uploads si no existe
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}



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


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'./public/upload'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Nombre original del archivo
    },
});

const upload = multer({ storage: storage }).single('image');

// Middleware para pasar usuario a todas las vistas
app.use((req, res, next) => {
    // Verificar si hay un usuario guardado en la sesión
    if (req.session.usuario) {
        res.locals.usuario = req.session.usuario;
    } else {
        // Si no hay usuario en la sesión, intentar obtenerlo de la cookie
        const usuarioNombre = req.cookies.usuario;
        if (usuarioNombre) {
            res.locals.usuario = { nombre: usuarioNombre };
        }
    }
    next();
});


app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error subiendo archivo');
        }

        console.log('Archivo subido correctamente:', req.file);

        const imageUrl = path.join(__dirname, 'uploads', req.file.filename);

        const newProduct = new Producto({
            nombre: req.body.nombre,
            precio: req.body.precio, 
            costo: req.body.costo,
            categoria: req.body.categoria,
            image: {
                data: imageUrl, // Guardar la URL 
                contentType: req.file.mimetype
            }
        });

        newProduct.save()
        .then(savedProduct => {
            res.json(savedProduct); // Enviar el objeto del producto guardado como respuesta
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error saving image details');
        });
    });
});






// Rutas de archivos estáticos
app.set('view engine', 'ejs');
app.use('/views', express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.render('home/index', {
         nombre: req.cookies.usuario // Pasar el usuario a la vista
    });
});

app.get('/iniciarsesion', (req, res) => {
    res.render('iniciar/index');
});

app.get('/tuspedidos', (req, res) => {
    res.render('pedidos', {
        usuario: req.session.usuario // Puedes pasar el usuario a la vista si es necesario
    });
});

app.use('/', express.static(path.resolve(__dirname, 'views', 'home')));
app.use('/public', express.static(path.join(__dirname, 'public')));
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

// Ruta para subir una imagen y guardar un producto
 


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



app.get('/infocuenta', (req, res) => {
    if (req.session.usuario) {
        res.render('infocuenta', { usuario: req.session.usuario });
    } else {
        res.redirect('/iniciarsesion');
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        req.session.destroy()
        res.clearCookie('usuario'); // Borra la cookie 'usuario'
        res.redirect('/'); // Redirige al inicio u otra página después de cerrar sesión
    });
});


// Middleware para servir archivos estáticos en la carpeta de uploads


// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
module.exports = app;