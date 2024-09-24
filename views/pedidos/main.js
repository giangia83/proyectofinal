 document.querySelectorAll('select[name="metodoPago"]').forEach(function(selectElement, index) {
        selectElement.addEventListener('change', function() {
            const isEfectivo = this.value === 'Efectivo';
            const cuentaField = document.getElementById('cuenta' + index);
            const telefonoField = document.getElementById('telefono' + index);
            const numeroTransaccionField = document.getElementById('numeroTransaccion' + index);

            // Desactivar o activar campos según la opción seleccionada
            cuentaField.disabled = isEfectivo;
            telefonoField.disabled = isEfectivo;
            numeroTransaccionField.disabled = isEfectivo;
        });
    });

    function submitPago(event, cotizacionId) {
        event.preventDefault(); // Evita el comportamiento predeterminado de enviar el formulario
    
        // Captura los datos del formulario
        const formData = new FormData(event.target);
    
        // Convierte el FormData a un objeto
        const data = {};
        formData.forEach((value, key) => data[key] = value);
    
        // Realiza la petición POST al servidor
        fetch(`/vercotizaciones/pagar/${cotizacionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Pago verificado y correo enviado al admin') {
                // Muestra un pop-up o modal de confirmación
                alert('El pago ha sido verificado y el correo ha sido enviado exitosamente');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '100.00'  // Ajusta esto con el monto dinámico de tu producto
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          // Captura el pago cuando el comprador lo aprueba
          return actions.order.capture().then(function(details) {
            // Enviar los detalles del pago al servidor para procesarlo
            return fetch('/paypal/payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                orderID: data.orderID  // El ID de la orden de PayPal
              })
            }).then(response => response.json())
              .then(data => {
                alert('Pago completado. ID de la transacción: ' + data.id);
                // Aquí puedes redirigir a una página de confirmación o actualizar el estado del pedido
              });
          });
        }
      }).render('#paypal-button-container'); // Renderiza el botón en el contenedor específico
      