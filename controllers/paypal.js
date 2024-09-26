
const express = require('express');
const router = express.Router();
router.post('/paypal/payment', async (req, res) => {
  const orderID = req.body.orderID;
  const cotizacionId = req.body.cotizacionId;  // Captura el ID de la cotización si lo envías

  // Aquí procesas la captura del pago con PayPal
  const { data } = await axios.post(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET
    }
  });

  // Procesar los detalles del pago
  res.json(data);
});


// Exportar el router
module.exports = router; // Asegúrate de que estás exportando el router correctamente
