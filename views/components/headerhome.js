// scripts/header.js

// Función para crear el encabezado
function createHeader() {
    // Crea el elemento <header>
    const header = document.createElement('header');
  
    // HTML para la sección izquierda del encabezado
    const leftSection = `
      <div class="header-left">
        <a href="/"><img src="/public/img/starcleanlogo4.webp" id="imgmeet" alt="" width="80px"></a>
      </div>
    `;
const style=
   `<style>
   
   


   .btn-special{

    background-color: ##FFED00;
    border: none;
    color: #1b1b1b;
    }

    .btn-special:hover{

        background-color: ##FFED00;
        border: none;
        color: #EA5730;
        }
   
   .header-center {
      /* Ajusta según tus necesidades */
      display: flex;
     
      align-items: center; /* Alinea verticalmente los elementos */
      padding: 0px 30px; /* Añade relleno arriba y abajo */
    }
    
    .btn-center {
      margin-right: 20px ; /* Margen entre cada elemento <a> */
    }
    /* styles/styles.css */
  
    .menu-hamburguesa {
      cursor: pointer;
      display: none; /* Oculta por defecto en pantallas grandes */
    }
  
    
    .menu-desplegable {
      display: none;
      position: absolute;
      top: 80px;
      right: 22px;
      background-color: #ffffff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      padding: 40px;
      z-index: 1000;
      width: 200px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      border-radius: 20px;
    }
  
    a {
      color: #333; /* Cambia el color de los enlaces a un tono oscuro */
      text-decoration: none; /* Elimina el subrayado de los enlaces */
      transition: color 0.3s ease; /* Agrega una transición suave para el color */
    }
  
  
  a:hover {
      color: #666; /* Cambia el color al pasar el cursor */
    }
    
    .menu-desplegable ul {
      list-style-type: none;
      text-decoration: none; 
      padding: 0;
      margin: 0;
    }
    
    .menu-desplegable ul li {
      list-style-type: none;
      text-decoration: none;
      margin-bottom: 10px; /* Espacio entre cada elemento del menú */
    }
    
    @media (max-width: 500px) {
      /* Estilos específicos para pantallas móviles */
      .header-center {
        padding: 10px; /* Ajusta el relleno en pantallas móviles */
      }
    
      .btn-center {
        display: none; /* Oculta los botones en pantallas móviles */
      }
    
      .menu-hamburguesa {
        display: block; /* Muestra el icono de hamburguesa en pantallas móviles */
      }
    
      .menu-desplegable.activo {
        transform: translateX(0); /* Muestra el menú desplegable al activarlo */
      }
  
      .menu-desplegable.activo {
          display: block;



      }
    }</style>
    
    
    `;
  
    // HTML para la sección central del encabezado
    const centerSection = `
      <div class="header-center">
        <a href="/tuspedidos" class="btn e btn-special btn-center" type="button" aria-expanded="false">Mis pedidos</a>
          <a href="/cuenta" class="btn e btn-special btn-center" type="button" aria-expanded="false">Mi cuenta</a>
        <a href="/servicioalcliente" class="btn e btn-special btn-center" type="button" aria-expanded="false">Contacto</a>
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
           
              <li><a class="dropdown-item" href="/cuenta">Cuenta</a></li>
              <li><a class="dropdown-item" href="/logout">Cerrar sesión</a></li>
           
              <li><a class="dropdown-item" href="/iniciarsesion">Iniciar sesión</a></li>
              <li><a class="dropdown-item" href="/registrarse">Registrarse</a></li>
            
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
            <% if (usuario && usuario.nombre) { %>
              <li><a href="/cuenta">Cuenta</a></li>
                <li><a href="/tuspedidos">Mis pedidos</a></li>
              <li><a href="/logout">Cerrar sesión</a></li>
             <% } else { %>
              <li><a href="/iniciarsesion">Iniciar sesión</a></li>
              <li><a href="/registrarse">Registrarse</a></li>
            <% } %>
          
            <li><a href="/servicioalcliente">Contacto</a></li>
          
           
          </ul>
        </div>
      </div>
    `;  
    // Agrega las secciones al <header> según el tamaño de la pantalla
    if (window.innerWidth <= 500) {
      header.innerHTML = leftSection + centerSection + rightSectionMobile + style;
    } else {
      header.innerHTML = leftSection + centerSection + rightSectionDesktop;
    }
  
    // Agrega el <header> al documento
    document.body.prepend(header);
  
    // Evento para abrir y cerrar el menú desplegable en móviles
    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuDesplegable = document.getElementById('menuDesplegable');
  
    if (menuHamburguesa && menuDesplegable) {
      menuHamburguesa.addEventListener('click', () => {
        menuDesplegable.classList.toggle('activo');
      });
    }
  }
  
  // Ejemplo de uso:
 
  createHeader();
  