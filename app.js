const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');

const app = express();
const port = process.env.PORT || 3001;



// Conexión a la base de datos
try {
    mongoose.connect('mongodb+srv://giangia83:gian2005@starclean.krrul4s.mongodb.net/?retryWrites=true&w=majority&appName=starclean', {
       
    });
    console.log('Conexión a la base de datos establecida');
} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}

app.use('/views', express.static(path.join(__dirname, 'views')));

// Rutas de frontend - Servir archivos estáticos
app.use('/', express.static(path.resolve(__dirname, 'views', 'registrar')));
app.use('/cuenta', express.static(path.resolve(__dirname, 'views', 'cuenta')));
app.use('/informacion', express.static(path.resolve(__dirname, 'views', 'infocuenta')));
app.use('/iniciarsesion', express.static(path.resolve(__dirname, 'views', 'iniciar')));
app.use('/tuspedidos', express.static(path.resolve(__dirname, 'views', 'pedidos')));
app.use('/registrarse', express.static(path.resolve(__dirname, 'views', 'registrar')));
app.use('/configuracion', express.static(path.resolve(__dirname, 'views', 'plantila-configuracion')));
app.use('/servicioalcliente', express.static(path.resolve(__dirname, 'views', 'serviciocliente')));
app.use('/clientes', express.static(path.resolve(__dirname, 'views', 'clientes')));


// Middleware para procesar JSON
app.use(express.json());

// Rutas de backend
app.use('/api/users', userRouter);

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
