// scripts/header.js

// Función para crear el encabezado
function createHeader(usuario) {
    // Crea el elemento <header>
    const header = document.createElement('header');
  
    // HTML para la sección izquierda del encabezado
    const leftSection = `
      <div class="header-left">
        <a href="/"><img src="/public/img/starcleanlogo4.webp" id="imgmeet" alt="" width="80px"></a>
      </div>
    `;
  
    // HTML para la sección central del encabezado
    const centerSection = `
      <div class="header-center">
        <a href="/tuspedidos" class="btn btn-secondary e btn-special" type="button" aria-expanded="false">Mis pedidos</a>
        <a href="/servicioalcliente" class="btn btn-secondary e btn-special" type="button" aria-expanded="false">Contacto</a>
      </div>
    `;
  
    // HTML para la sección derecha del encabezado
    const rightSection = `
      <div class="header-right">
        ${usuario ? usuario.nombre : ''}
        <div class="dropdown hover-dropdown">
          <svg xmlns="http://www.w3.org/2000/svg" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" class="icon icon-tabler icon-tabler-user-circle" width="42" height="42" viewBox="0 0 24 24" stroke-width="1" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
          </svg>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            ${usuario ? `
              <li><a class="dropdown-item" href="/cuenta">Cuenta</a></li>
              <li><a class="dropdown-item" href="/logout">Cerrar sesión</a></li>
            ` : `
              <li><a class="dropdown-item" href="/iniciarsesion">Iniciar sesión</a></li>
              <li><a class="dropdown-item" href="/registrarse">Registrarse</a></li>
            `}
          </ul>
        </div>
      </div>
    `;
  
    // Agrega las secciones al <header>
    header.innerHTML = leftSection + centerSection + rightSection;
  
    // Agrega el <header> al documento
    document.body.prepend(header);
  }
  
  // Ejemplo de uso:
  const usuario = { nombre: 'Nombre del Usuario' }; // Datos del usuario (simulado)
  createHeader(usuario);
  