// Obtener el elemento .info3


// Crear un elemento div para cada día del mes


// Obtener todos los elementos grid-item





const calendar = document.getElementById('calendar');

// Crear un elemento div para cada día del mes
for (let i = 1; i <= 31; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = i;
    calendar.appendChild(dayDiv);
}






/* 
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el usuario autenticado almacenado en sessionStorage
    var currentUser = sessionStorage.getItem("currentUser");

    if (currentUser) {
        currentUser = JSON.parse(currentUser);

        // Llenar los campos específicos con los detalles del usuario autenticado
        document.getElementById("nombreUsuario").innerText = currentUser.username;
        document.getElementById("congregacionUsuario").innerText = currentUser.congregation;
    } else {
        // Redirigir a la página de inicio de sesión si no hay usuario autenticado
        window.location.href = "/html/index.html";
    } */
/* }); */
document.addEventListener("DOMContentLoaded", function() {
    const sidenav = document.querySelector('.sidenav');
    const accountLink = document.querySelector('.header-right a[href="#cuenta"]');
    const closeBtn = document.querySelector('.close-btn');
    const extraInfo = document.querySelector('.extra-info');
    
    // Agregar evento al hacer clic en el enlace de cuenta
    accountLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto del enlace
        
        // Cambiar el ancho de la barra lateral para cubrir toda la página
        sidenav.style.width = "100%";
        
        // Mostrar el botón de cerrar
        closeBtn.style.display = "block";
        
        // Mostrar el texto adicional
        extraInfo.style.display = "block";
        
        // Mostrar la fecha y hora actual
        const now = new Date();
        const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        document.getElementById("fechaHora").textContent = formattedDateTime;
    });
    
    // Agregar evento al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', function() {
        // Restaurar el ancho de la barra lateral y ocultar el botón de cerrar
        sidenav.style.width = "160px"; // Ancho original
        closeBtn.style.display = "none";
        extraInfo.style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const sidenav = document.querySelector('.sidenav');
    const accountLink = document.querySelector('.header-right a[href="#cuenta"]');
    const closeBtn = document.querySelector('.close-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const extraInfo = document.querySelector('.extra-info');
    
    // Agregar evento al hacer clic en el enlace de cuenta
    accountLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto del enlace
        
        // Cambiar el ancho de la barra lateral para cubrir toda la página
        sidenav.style.width = "100%";
        
        // Mostrar el botón de cerrar
        closeBtn.style.display = "block";
        
        // Mostrar el texto adicional
        extraInfo.style.display = "block";
        logoutBtn.style.display = "block";
        
        // Mostrar la fecha y hora actual
        const now = new Date();
        const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        document.getElementById("fechaHora").textContent = formattedDateTime;
    });
    
    // Agregar evento al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', function() {
        // Restaurar el ancho de la barra lateral y ocultar el botón de cerrar
        sidenav.style.width = "160px"; // Ancho original
        closeBtn.style.display = "none";
        extraInfo.style.display = "none";
        logoutBtn.style.display = "none";
    });
    
    // Agregar evento al hacer clic en el botón de cerrar sesión
    logoutBtn.addEventListener('click', function() {
       
        sessionStorage.removeItem('currentUser');
            
        // Redirigir al usuario a la página de carga (loading.html)
        window.location.href = '/html/carga.html';


        alert("¡Sesión cerrada correctamente papá!");
        // Aquí podrías añadir más acciones según tus necesidades
    });
});


