const express = require('express');
const axios = require('axios');
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
