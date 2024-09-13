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
          <td><input type="number" class="form-control" value="${producto.productoId.precio || ''}" onchange="actualizarSubtotal(this)" data-producto-id="${producto.productoId._id}"></td>
          <td><span class="subtotal">${(producto.productoId.precio ? producto.productoId.precio * producto.cantidad : 0).toFixed(2)}</span></td>
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

  calcularTotal(); // Asegúrate de que esta función esté actualizando el total
}

function calcularTotal() {
  let total = 0;
  document.querySelectorAll('.subtotal').forEach(element => {
    total += parseFloat(element.innerText) || 0;
  });
  document.getElementById('totalPrecio').innerText = total.toFixed(2);
}

function guardarCotizacion() {
  const id = document.getElementById('cotizacionId').value;

  // Verificar que el ID de la cotización sea válido
  if (!id) {
    alert('No se ha seleccionado ninguna cotización.');
    return;
  }

  // Recolectar precios actualizados y sus IDs de producto
  const precios = Array.from(document.querySelectorAll('input[type="number"]')).map(input => {
    const productoId = input.getAttribute('data-producto-id');
    let precio = input.value.replace(',', '.');
    precio = parseFloat(precio);

    if (isNaN(precio) || precio < 0) {
      precio = null; // Definir como null si el precio es inválido
    }

    return {
      productoId: productoId,
      precio: precio
    };
  }).filter(item => item.precio !== null); // Filtrar precios nulos

  // Verificar que hay precios válidos antes de enviar
  if (precios.length === 0) {
    alert('No se han ingresado precios válidos.');
    return;
  }

  console.log('Datos a enviar:', { precios });

  // Enviar los precios actualizados al servidor
  fetch(`/vercotizaciones/actualizar/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ precios })
  })
    .then(response => {
      console.log('Respuesta del servidor:', response);
      return response.json();
    })
    .then(data => {
      console.log('Datos recibidos:', data);

      if (data.mensaje === 'Cotización actualizada exitosamente') {
        // Actualizar los subtotales y el total en la interfaz de usuario
        actualizarSubtotales();
        calcularTotal();
        alert('Cotización actualizada correctamente.');
      } else {
        alert('Hubo un problema al actualizar la cotización.');
      }

      // Cerrar el modal
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
      console.error('Error al guardar la cotización:', error);
      alert('Error al guardar la cotización. Por favor, inténtalo de nuevo más tarde.');
    });
}

function actualizarSubtotales() {
  const filas = document.querySelectorAll('#productosTableBody tr');
  filas.forEach(fila => {
    const cantidad = parseFloat(fila.querySelector('td:nth-child(2)').innerText);
    const input = fila.querySelector('input[type="number"]');
    const precioUnitario = parseFloat(input.value.replace(',', '.')) || 0;
    const subtotal = precioUnitario * cantidad;
    fila.querySelector('.subtotal').innerText = subtotal.toFixed(2);
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
