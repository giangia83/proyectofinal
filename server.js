const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Requerir y configurar el archivo app.js
require("./app");

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
