 // JavaScript para manejar el menú hamburguesa en pantallas móviles
 const menuHamburguesa = document.getElementById('menuHamburguesa');
 const menuDesplegable = document.getElementById('menuDesplegable');

 if (menuHamburguesa && menuDesplegable) {
     menuHamburguesa.addEventListener('click', () => {
         menuDesplegable.classList.toggle('activo');
     });
 }