const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Define tus rutas y configuraciones de Express aquí

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
