function loadUserDetails(userId) {
  fetch(`/usuarios/${userId}`)
    .then(response => response.json())
    .then(data => {
      const content = `
        <div class="container">
          <h5 class="text-primary mb-3">Detalles del Usuario</h5>
          <div class="list-group">
            <div class="list-group-item">
              <h6 class="mb-1 text-muted">Nombre:</h6>
              <p class="mb-0">${data.nombre}</p>
            </div>
            <div class="list-group-item">
              <h6 class="mb-1 text-muted">Correo:</h6>
              <p class="mb-0">${data.correo}</p>
            </div>
            <div class="list-group-item">
              <h6 class="mb-1 text-muted">Dirección:</h6>
              <p class="mb-0">${data.direccion}</p>
            </div>
            <div class="list-group-item">
              <h6 class="mb-1 text-muted">Ciudad:</h6>
              <p class="mb-0">${data.ciudad}</p>
            </div>
            <div class="list-group-item">
              <h6 class="mb-1 text-muted">RIF:</h6>
              <p class="mb-0">${data.rif}</p>
            </div>
            <div class="list-group-item">
              <h6 class="mb-1 text-muted">Número:</h6>
              <p class="mb-0">${data.number}</p>
            </div>
          </div>
        </div>
      `;
      document.getElementById('userDetailsContent').innerHTML = content;
    })
    .catch(error => console.error('Error:', error));
}

function loadCotizacionDetails(id) {
  fetch(`/vercotizaciones/detalles/${id}`)
    .then(response => response.json())
    .then(cotizacion => {
      document.getElementById('cotizacionId').value = cotizacion._id;

      const productosTableBody = document.getElementById('productosTableBody');
      productosTableBody.innerHTML = '';

      let total = 0;
      cotizacion.productos.forEach(producto => {
        if (!producto.productoId) {
          console.error('Producto sin información:', producto);
          return;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${producto.productoId.nombre}</td>
          <td>${producto.cantidad}</td>
          <td>
            <input type="number" value="${producto.productoId.precio}" onchange="actualizarSubtotal(this)" />
          </td>
          <td><span class="subtotal">${(producto.productoId.precio ? producto.productoId.precio * producto.cantidad : 0).toFixed(2)}</span></td>
           <td>
      <button onclick="actualizarProducto('${producto.productoId._id}', this)">Actualizar</button>
    </td>
        `;
        productosTableBody.appendChild(fila);

        total += producto.productoId.precio ? producto.productoId.precio * producto.cantidad : 0;
      });

      document.getElementById('totalPrecio').innerText = total.toFixed(2);
    
  
    })
    .catch(error => console.error('Error al cargar los detalles de la cotización:', error));
}
function actualizarSubtotal(input) {
  const valor = input.value.replace(',', '.');
  const precioUnitario = parseFloat(valor);
  const cantidad = parseFloat(input.closest('tr').querySelector('td:nth-child(2)').innerText);
  const subtotal = precioUnitario * cantidad;

  input.closest('tr').querySelector('.subtotal').innerText = subtotal.toFixed(2);
  calcularTotal(); 
}

function calcularTotal() {
  let total = 0;
  document.querySelectorAll('.subtotal').forEach(element => {
    total += parseFloat(element.innerText) || 0; // Convierte a número
  });
  document.getElementById('totalPrecio').innerText = total.toFixed(2);
  enviarTotalAlServidor(document.getElementById('cotizacionId').value, total); // Envía el total al servidor
}

function enviarTotalAlServidor(cotizacionId, total) {
  if (cotizacionId) {
    fetch(`/vercotizaciones/actualizarTotal/${cotizacionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ total: Number(total) }), 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al actualizar el total en el servidor');
      }
      return response.json();
    })
    .then(data => {
      console.log('Total actualizado en el servidor:', data);
    })
    .catch(error => {
      console.error('Error al enviar el total:', error);
    });
  }
}
function actualizarProducto(productoId, button) {
  const nuevoPrecio = parseFloat(button.closest('tr').querySelector('input[type="number"]').value.replace(',', '.'));

  if (!productoId) {
    alert('ID de producto no válido.');
    return;
  }

  // Validar el nuevo precio
  if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
    alert('Por favor, introduce un precio válido.');
    return;
  }

  const data = {
    id: productoId,
    precio: nuevoPrecio,
  };

  fetch('/subir/actualizar-precio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al actualizar precio: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    alert(data.mensaje); // Muestra el mensaje de éxito
    console.log('Precio actualizado:', data.producto);
    
    // Aquí puedes actualizar el subtotal, si es necesario
    actualizarSubtotal(button.closest('tr').querySelector('input[type="number"]'));
  })
  .catch(error => {
    console.error('Error al actualizar el precio:', error);
    alert('Error al actualizar el precio. Por favor, inténtalo de nuevo más tarde.');
  });
}


function descargarPDF(idCotizacion) {
  if (!idCotizacion) {
      console.error('ID de cotización no válido');
      return;
  }

  const spinner = document.getElementById('spinner'); 
  if (spinner) spinner.style.display = 'block';

  window.location.href = `/vercotizaciones/pdf/${idCotizacion}`;


  setTimeout(() => {
      if (spinner) spinner.style.display = 'none';
  }, 3000); 
}

function verificarCotizacion() {
  const cotizacionId = document.getElementById('cotizacionId').value;
  const total = parseFloat(document.getElementById('totalPrecio').innerText); // Obtener el total actual

  if (!cotizacionId) {
    alert('No se ha seleccionado ninguna cotización.');
    return;
  }

  fetch(`/vercotizaciones/verificar/${cotizacionId}`, {
    method: 'POST'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);

      
      enviarTotalAlServidor(cotizacionId, total); 

      const modal = document.getElementById('cotizacionModal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    })
    .catch(error => {
      console.error('Error al verificar la cotización:', error);
      alert('Error al verificar la cotización. Por favor, inténtalo de nuevo más tarde.');
    });
}

// Función para aprobar el pago
function aprobarPago(cotizacionId) {
  fetch(`/vercotizaciones/aprobarPago/${cotizacionId}`, {
    method: 'POST'
  })
  .then(response => {
    if (response.ok) {
      showToast('Pago aprobado', 'bg-success');
      location.reload(); // Refresca la página para ver los cambios
    }
  })
  .catch(error => {
    console.error('Error al aprobar el pago:', error);
  });
}

// Función para rechazar el pago
function rechazarPago(cotizacionId) {
  fetch(`/vercotizaciones/rechazarPago/${cotizacionId}`, {
    method: 'POST'
  })
  .then(response => {
    if (response.ok) {
      showToast('Pago rechazado', 'bg-danger');
      location.reload();
    }
  })
  .catch(error => {
    console.error('Error al rechazar el pago:', error);
  });
}

// Función para mostrar el toast
function showToast(message, bgClass) {
  const toastElement = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Actualizar el mensaje y el color de fondo del toast
  toastMessage.textContent = message;
  toastElement.classList.remove('bg-success', 'bg-danger'); 
  toastElement.classList.add(bgClass); 

  // Inicializa el toast de Bootstrap y lo muestra
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

let cotizacionId = null; // Variable global para almacenar el ID de la cotización

function loadPaymentDetails(cotizacionIdParam) {
  cotizacionId = cotizacionIdParam; 

  fetch(`/vercotizaciones/detallesPago/${cotizacionId}`)
    .then(response => response.json())
    .then(data => {
      const paymentDetailsContent = document.getElementById('paymentDetailsContent');
      paymentDetailsContent.innerHTML = `
        <div class="card p-3 mb-3 shadow-sm">
          <div class="mb-2">
            <span class="fw-bold">Número de cuenta:</span>
            <span class="text-muted">${data.numeroCuenta}</span>
          </div>
          <div class="mb-2">
            <span class="fw-bold">Monto Pagado:</span>
            <span class="text-muted">${data.monto}</span>
          </div>
          <div class="mb-2">
            <span class="fw-bold">Fecha de Pago:</span>
            <span class="text-muted">${data.fechaPago}</span>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error al cargar los detalles del pago:', error);
    });
}

