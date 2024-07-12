require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');
const productosRouter = require('./controllers/productos');
const cotizacionesRouter = require('./controllers/cotizaciones'); // Ruta relativa al archivo cotizaciones.js
const Cotizacion = require('./models/cotizacion');
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
        maxAge: 24 * 60 * 60 * 1000, // 1 día de expiración
        sameSite: 'lax' // Puede ser 'strict', 'lax', o 'none'
    }
}));

// Conexión a la base de datos
mongoose.connect(mongoURI, {
 
})
.then(() => {
    console.log('Conexión a la base de datos establecida');
})
.catch(err => console.error('Error al conectar a la base de datos:', err));



//storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Nombre original del archivo
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: storage });

app.use((req, res, next) => {
    // Obtener el nombre de usuario desde la cookie 'usuario'
    const usuarioNombre = req.cookies.usuario;

    // Verificar si hay un nombre de usuario en la cookie
    if (usuarioNombre) {
        // Consultar la base de datos para obtener los detalles del usuario
        Usuario.findOne({ nombre: usuarioNombre })
            .then(usuario => {
                if (usuario) {
                    // Si encontramos al usuario, configuramos res.locals.usuario con sus detalles
                    res.locals.usuario = {
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        direccion: usuario.direccion,
                        number: usuario.number,
                        rif: usuario.rif,
                        ciudad: usuario.ciudad,

                        // Otros campos del usuario que desees mostrar
                    };
                } else {
                    // Manejar el caso en el que no se encuentre el usuario
                    delete res.locals.usuario; // Asegurarse de no definir res.locals.usuario
                }
                next();
            })
            .catch(error => {
                console.error('Error al obtener el usuario:', error);
                delete res.locals.usuario; // Manejar errores de consulta a la base de datos
                next();
            });
    } else {
        delete res.locals.usuario; // Si no hay cookie de usuario, asegurarse de no definir res.locals.usuario
        next();
    }
});



app.post('/upload', upload.single('file'), (req, res) => {
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de archivos estáticos
app.set('view engine', 'ejs');
app.use('/views', express.static(path.join(__dirname, 'views')));

app.get('/configuracion', async (req, res) => {
    try {
        // Obtener todos los productos desde la base de datos
        res.render('plantilla-configuracion/index', {usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

/* rutas */
app.get('/verproductos', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('productos/index', { productos,  usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});
// En tu archivo principal de la aplicación (app.js o index.js)
app.get('/', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('home/index', { productos,  usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});



// Ruta para renderizar la página de servicio al cliente
app.get('/servicioalcliente', async (req, res) => {
    try {
    
        const usuarioAdmin = await Usuario.findOne({ correo: "jbiadarola@hotmail.com" });

        // Verificar si se encontró el usuario admin
        if (!usuarioAdmin) {
            return res.status(404).send('Usuario admin no encontrado');
        }

      
        res.render('serviciocliente/index', { usuario: usuarioAdmin });
    } catch (error) {
        console.error('Error al obtener el usuario admin:', error);
        res.status(500).send('Error al obtener el usuario admin');
    }
});

app.get('/gestionar', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('gestion/index', { productos,  usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});
// En tu archivo principal de la aplicación (app.js o index.js)


app.get('/administrar', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('admin/index', { productos,  usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

app.get('/clientes', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('clientes/index', { productos, usuario: res.locals.usuario }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});



app.get('/cuenta', async (req, res) => {
    try {
        // Obtener todos los productos desde la base de datos
        res.render('cuenta/index', {usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});




app.get('/vercarrito', async (req, res) => {
    try {
        const productosCarrito = req.query.productos;
        
        // Decodificar y parsear los productos del carrito
        const cart = JSON.parse(decodeURIComponent(productosCarrito));
        
        // Puedes ajustar esto para consultar solo los productos que están en el carrito
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        
        // Renderizar la vista 'carrito/index' con los productos, el usuario y los productos en el carrito
        res.render('carrito/index', { productos, usuario: res.locals.usuario || { nombre: '' }, cart });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});


app.use('/', express.static(path.resolve(__dirname, 'views', 'home')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/cuenta', express.static(path.resolve(__dirname, 'views', 'cuenta')));
app.use('/vercarrito', express.static(path.resolve(__dirname, 'views', 'carrito')));
app.use('/informacion', express.static(path.resolve(__dirname, 'views', 'infocuenta')));
app.use('/iniciarsesion', express.static(path.resolve(__dirname, 'views', 'iniciar')));
app.use('/tuspedidos', express.static(path.resolve(__dirname, 'views', 'pedidos')));
app.use('/registrarse', express.static(path.resolve(__dirname, 'views', 'registrar')));

app.use('/servicioalcliente', express.static(path.resolve(__dirname, 'views', 'serviciocliente')));
app.use('/clientes', express.static(path.resolve(__dirname, 'views', 'clientes')));
app.use('/gestion', express.static(path.resolve(__dirname, 'views', 'gestionar')));
app.use('/administrar', express.static(path.resolve(__dirname, 'views', 'admin')));

app.use('/verproductos', express.static(path.resolve(__dirname, 'views', 'productos')));

app.use("/main",express.static(__dirname + '/main'));


app.use(cotizacionesRouter);
// Ruta para subir una imagen y guardar un producto
 // Rutas de API
app.use('/api/users', userRouter);
app.use('/api', productosRouter); // Ruta base para las rutas del enrutador de productos

const adminEmail = 'jbiadarola@hotmail.com';
const adminPassword = 'starclean123';

app.post('/api/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario || usuario.contraseña !== contraseña) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si el usuario es el admin
        if (correo === adminEmail && contraseña === adminPassword) {
            // Si es el admin, guardar los datos de sesión
            req.session.usuario = {
                nombre: usuario.nombre,
                correo: usuario.correo,
                direccion: usuario.direccion,
                ciudad: usuario.ciudad,
                rif: usuario.rif,
                // Agregar otros datos según sea necesario
                esAdmin: true  // Puedes agregar un indicador de admin si lo necesitas en el front-end
            };

            // Redirigir a la interfaz de administración
            return res.status(200).json({ message: 'Inicio de sesión exitoso como admin', redirectTo: '/administrar' });
        }
        // Si no es admin, guardar los datos de sesión normal
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

// Ruta para editar un usuario por su ID (usando el middleware de autenticación)
// Ruta para editar un usuario por su ID (usando el middleware de autenticación)

app.post('/proseguircompra', async (req, res) => {
    const { usuario, productos } = req.body;

    try {
        // Crear una nueva instancia de Cotizacion
        const nuevaCotizacion = new Cotizacion({
            usuario,
            productos,
        });

        // Guardar en la base de datos
        const cotizacionGuardada = await nuevaCotizacion.save();

        // Enviar respuesta al cliente
        res.status(201).json(cotizacionGuardada);
    } catch (error) {
        console.error('Error al guardar la cotización:', error);
        res.status(500).json({ error: 'Error al guardar la cotización' });
    }
});



app.get('/tuspedidos', async (req, res) => {
    try {
        // Obtener el nombre de usuario desde la sesión o cookie
        const usuarioNombre = req.cookies.usuario; // O donde tengas guardado el nombre de usuario

        // Consultar las cotizaciones del usuario desde la base de datos
        const cotizaciones = await Cotizacion.find({ usuario: usuarioNombre }).sort({ fecha: -1 });

        // Renderizar la vista 'pedidos/index' con las cotizaciones del usuario
        res.render('pedidos/index', { cotizaciones,  usuario: res.locals.usuario || { nombre: '' } });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).send('Error al obtener los pedidos del usuario');
    }
});


app.get('/informacion', (req, res) => {
   
        res.render('infocuenta/index', { usuario: res.locals.usuario });
});




// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
     
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