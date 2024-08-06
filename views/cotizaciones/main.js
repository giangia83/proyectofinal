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
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td><img src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}"></td>
                <td>${producto.cantidad}</td>
                <td><input type="number" class="form-control" value="${producto.precio || ''}" onchange="actualizarSubtotal(this)" data-precio="${producto.precio || '0'}"></td>
                <td><span class="subtotal">0</span></td>
            `;
            productosTableBody.appendChild(fila);

            total += producto.precio * producto.cantidad;
        });

        document.getElementById('totalPrecio').innerText = total.toFixed(2);
    })
    .catch(error => {
        console.error('Error al cargar los detalles de la cotización:', error);
    });
}

function actualizarSubtotal(input) {
const precioUnitario = parseFloat(input.getAttribute('data-precio'));
const cantidad = parseFloat(input.closest('tr').querySelector('td:nth-child(3)').innerText);
const subtotal = input.value * cantidad;

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
    productoId: input.getAttribute('data-producto-id'),
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
function descargarPDF(id) {
  fetch(`/vercotizaciones/pdf/${id}`)
      .then(response => {
          if (response.ok) {
              return response.blob();
          } else {
              throw new Error('Error al generar el PDF');
          }
      })
      .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cotizacion_${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
      })
      .catch(error => {
          console.error('Error al descargar el PDF:', error);
      });
}
