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
        <a href="/tuspedidos" class="btn btn-special btn-center" type="button" aria-expanded="false">Mis pedidos</a>
        <a href="/cuenta" class="btn btn-special btn-center" type="button" aria-expanded="false">Mi cuenta</a>
        <a href="/servicioalcliente" class="btn btn-special btn-center" type="button" aria-expanded="false">Contacto</a>
      </div>
    `;

    // HTML para la sección derecha del encabezado en pantallas grandes
    const rightSectionDesktop = `
      <div class="header-right">
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

    // HTML para la sección derecha del encabezado en pantallas móviles
    const rightSectionMobile = `
      <div class="header-right">
        <div class="menu-hamburguesa" id="menuHamburguesa">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <div class="menu-desplegable" id="menuDesplegable">
          <ul>
            ${usuario ? `
              <li><a href="/cuenta">Cuenta</a></li>
              <li><a href="/tuspedidos">Mis pedidos</a></li>
              <li><a href="/logout">Cerrar sesión</a></li>
            ` : `
              <li><a href="/iniciarsesion">Iniciar sesión</a></li>
              <li><a href="/registrarse">Registrarse</a></li>
            `}
            <li><a href="/servicioalcliente">Contacto</a></li>
          </ul>
        </div>
      </div>
    `;

    // Agrega las secciones al <header> según el tamaño de la pantalla
    if (window.innerWidth <= 500) {
        header.innerHTML = leftSection + centerSection + rightSectionMobile;
    } else {
        header.innerHTML = leftSection + centerSection + rightSectionDesktop;
    }

    // Agrega el <header> al documento
    document.body.prepend(header);
}



    // Evento para abrir y cerrar el menú desplegable en móviles
    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuDesplegable = document.getElementById('menuDesplegable');

    if (menuHamburguesa && menuDesplegable) {
        menuHamburguesa.addEventListener('click', () => {
            menuDesplegable.classList.toggle('activo');
        });
    }


// Lógica para verificar si hay un usuario en la cookie y cargar los detalles del usuario
function checkUserAndCreateHeader() {
    // Realiza una solicitud al servidor para obtener los detalles del usuario desde la cookie
  
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            // Llama a createHeader con los detalles del usuario obtenidos
            createHeader(data.usuario);
        })
        .catch(error => {
            console.error('Error al obtener los detalles del usuario:', error);
            // Si hay un error, crea el encabezado sin usuario
            createHeader(null);
        });
}

// Llama a checkUserAndCreateHeader cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    checkUserAndCreateHeader();
});

