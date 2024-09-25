
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Configura el entorno (sandbox o live)
function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID;
    let clientSecret = process.env.PAYPAL_SECRET;

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
    // Para producción:
    // return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
}

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };
