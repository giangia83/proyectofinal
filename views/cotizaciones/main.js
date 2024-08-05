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
