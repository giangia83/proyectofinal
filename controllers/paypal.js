const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/payment', async (req, res) => {
  const orderID = req.body.orderID;

  try {
    const { data } = await axios.post(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET
      }
    });

    // Procesar los detalles del pago
    res.json(data);
  } catch (error) {
    // Manejo de errores de Axios
    if (error.response) {
      const errorCode = error.response.data.name;
      const errorMessage = error.response.data.message || 'Error desconocido';

      switch (errorCode) {
        case 'ORDER_ALREADY_CAPTURED':
          return res.status(400).json({ error: 'El pago ya ha sido capturado.' });
        case 'ORDER_NOT_FOUND':
          return res.status(404).json({ error: 'La orden no fue encontrada.' });
        case 'INVALID_REQUEST':
          return res.status(400).json({ error: 'Solicitud no válida.' });
        case 'UNAUTHORIZED':
          return res.status(403).json({ error: 'No autorizado para capturar esta orden.' });
        default:
          console.error(`Error desconocido: ${errorCode}`, errorMessage);
          return res.status(500).json({ error: 'Error al capturar el pago. ' + errorMessage });
      }
    }

    // Manejo de otros errores
    console.error('Error al capturar el pago:', error);
    res.status(500).json({ error: 'Error al capturar el pago. ' + error.message || 'Error desconocido' });
  }
});

// Exportar el router
module.exports = router;
