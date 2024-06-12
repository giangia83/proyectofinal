const sass = require('sass');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');

const app = express();
const port = process.env.PORT || 3001;

const result = sass.compile('styles.scss');
console.log(result.css);
// Conexión a la base de datos
try {
    mongoose.connect('mongodb+srv://giangia83:gian2005@starclean.krrul4s.mongodb.net/?retryWrites=true&w=majority&appName=starclean', {
       
    });
    console.log('Conexión a la base de datos establecida');
} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}

// Rutas de frontend - Servir archivos estáticos
app.use('/', express.static(path.resolve(__dirname, 'views', 'home')));
app.use('/cuenta', express.static(path.resolve(__dirname, 'views', 'cuenta')));
app.use('/informacion', express.static(path.resolve(__dirname, 'infocuenta')));
app.use('/iniciarsesion', express.static(path.resolve(__dirname, 'iniciar')));
app.use('/tuspedidos', express.static(path.resolve(__dirname, 'pedidos')));
app.use('/registrarse', express.static(path.resolve(__dirname, 'registrar')));
app.use('/configuracion', express.static(path.resolve(__dirname, 'plantila-configuracion')));
app.use('/servicioalcliente', express.static(path.resolve(__dirname, 'views', 'serviciocliente')));

// Middleware para procesar JSON
app.use(express.json());

// Rutas de backend
app.use('/api/users', userRouter);

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
