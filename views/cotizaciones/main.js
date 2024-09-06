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
          productosTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar las filas

          let total = 0;
          cotizacion.productos.forEach(producto => {
              const fila = document.createElement('tr');
              fila.innerHTML = `
                  <td>${producto.nombre}</td>
                  <td><img src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}" width="50"></td>
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
  const precioUnitario = parseFloat(input.value);
  const cantidad = parseFloat(input.closest('tr').querySelector('td:nth-child(3)').innerText);
  const subtotal = precioUnitario * cantidad;

  input.closest('tr').querySelector('.subtotal').innerText = subtotal.toFixed(2);

  calcularTotal();
}

function calcularTotal() {
  let total = 0;
  document.querySelectorAll('.subtotal').forEach(element => {
      total += parseFloat(element.innerText);
  });
  document.getElementById('totalPrecio').innerText = total.toFixed(2);
}
function guardarCotizacion() {
  const id = document.getElementById('cotizacionId').value;
  const precios = Array.from(document.querySelectorAll('input[type="number"]')).map(input => ({
      productoId: input.getAttribute('data-producto-id'), // Asegúrate de que este atributo esté en el HTML
      precio: parseFloat(input.value)
  }));

  fetch(`/vercotizaciones/actualizar/${id}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ precios })
  })
  .then(response => response.json())
  .then(data => {
      console.log('Cotización actualizada:', data);
      window.location.reload(); // O redirigir a otra página
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
  function verificarCotizacion() {
    const cotizacionId = document.getElementById('cotizacionId').value;
    
    if (!cotizacionId) {
        alert('No se ha seleccionado ninguna cotización.');
        return;
    }
    
    // Realizar la solicitud para verificar la cotización
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
        // Cerrar el modal si la verificación fue exitosa
        $('#cotizacionModal').modal('hide');
    })
    .catch(error => {
        console.error('Error al verificar la cotización:', error);
        alert('Error al verificar la cotización. Por favor, inténtalo de nuevo más tarde.');
    });
  }
}