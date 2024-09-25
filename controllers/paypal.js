
const express = require('express');
const router = express.Router();

router.post('/paypal/payment', async (req, res) => {
  const orderID = req.body.orderID;
  
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
