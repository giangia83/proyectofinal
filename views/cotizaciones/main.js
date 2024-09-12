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


// Función para cargar los datos del producto en el modal
function cargarProducto(id) {
  if (!id || typeof id !== 'string') {
      console.error('ID del producto no es válido:', id);
      alert('ID del producto no es válido');
      return;
  }

  fetch(`/api/productos/${id}`)
    .then(response => response.json())
    .then(producto => {
    
      document.getElementById('inputPrecioEditar').value = producto.precio;
      
    })
    .catch(error => {
      console.error('Error al cargar el producto:', error);
      alert('Hubo un problema al cargar el producto. Por favor, intenta nuevamente.');
    });
}


function loadCotizacionDetails(id) {
  fetch(`/vercotizaciones/detalles/${id}`)
      .then(response => response.json())
      .then(cotizacion => {
          document.getElementById('cotizacionId').value = cotizacion._id;

          const productosTableBody = document.getElementById('productosTableBody');
          productosTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar las filas

          let total = 0;
          cotizacion.productos.forEach(producto => {
              const fila = document.createElement('tr');
              fila.innerHTML = `
                  <td>${producto.nombre}</td>
                 
                  <td>${producto.cantidad}</td>
                  <td><input type="number" class="form-control" value="${producto.precio || ''}" onchange="actualizarSubtotal(this)" data-producto-id="${producto.id}"></td>
                  <td><span class="subtotal">${(producto.precio ? producto.precio * producto.cantidad : 0).toFixed(2)}</span></td>
              `;
              productosTableBody.appendChild(fila);

              total += producto.precio ? producto.precio * producto.cantidad : 0;
          });

          document.getElementById('totalPrecio').innerText = total.toFixed(2);
      })
      .catch(error => {
          console.error('Error al cargar los detalles de la cotización:', error);
      });
}
function actualizarSubtotal(input) {
  const valor = input.value.replace(',', '.'); // Reemplaza la coma por un punto
  const precioUnitario = parseFloat(valor);
  const cantidad = parseFloat(input.closest('tr').querySelector('td:nth-child(2)').innerText);
  const subtotal = precioUnitario * cantidad;

  input.closest('tr').querySelector('.subtotal').innerText = subtotal.toFixed(2);

  calcularTotal();
}

function calcularTotal() {
  let total = 0;
  document.querySelectorAll('.subtotal').forEach(element => {
    total += parseFloat(element.innerText) || 0; // Agrega 0 si el valor no es un número
  });
  document.getElementById('totalPrecio').innerText = total.toFixed(2);
}

function guardarCotizacion() {
  const id = document.getElementById('cotizacionId').value;
  
  const precios = Array.from(document.querySelectorAll('input[type="number"]')).map(input => {
    const productoId = input.getAttribute('data-producto-id');
    let precio = input.value.replace(',', '.'); 
    precio = parseFloat(precio); 
    
    if (isNaN(precio)) {
      precio = null; // Si el precio no es válido o está vacío, se define como null
    }

    return {
      productoId: productoId,
      precio: precio // Se envía null si el valor es inválido
    };
  });

  // Envía los precios actualizados al servidor
  fetch(`/vercotizaciones/actualizar/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ precios }) // Enviar precios al backend
  })
    .then(response => response.json())
    .then(data => {
      console.log('Cotización actualizada:', data);
      window.location.reload(); // Refresca la página tras la actualización
    })
    .catch(error => {
      console.error('Error al guardar la cotización:', error);
    });
}



function descargarPDF(idCotizacion) {
  window.location.href = `/vercotizaciones/pdf/${idCotizacion}`;
}

function verificarCotizacion() {
  const cotizacionId = document.getElementById('cotizacionId').value;

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
