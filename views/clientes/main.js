async function cargarUsuarios() {
    try {
        // Realizar la petición GET a la API de usuarios
        const response = await fetch('/api/users');
        const users = await response.json();

        if (!response.ok) {
            throw new Error(users.message || 'Error al cargar usuarios');
        }

        // Obtener el contenedor de los acordeones
        const accordion = document.getElementById('accordion');
        accordion.innerHTML = ''; // Limpiar el contenido actual del acordeón

        // Recorrer todos los usuarios y crear un acordeón para cada uno
        users.forEach(user => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');

            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header');
            cardHeader.id = `heading-${user._id}`;

            const button = document.createElement('button');
            button.classList.add('btn', 'btn-link', 'collapsed');
            button.setAttribute('type', 'button');
            button.setAttribute('data-bs-toggle', 'collapse');
            button.setAttribute('data-bs-target', `#collapse-${user._id}`);
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `collapse-${user._id}`);
            button.textContent = user.nombre; // Nombre del usuario

            cardHeader.appendChild(button);
            card.appendChild(cardHeader);

            const collapse = document.createElement('div');
            collapse.classList.add('collapse');
            collapse.id = `collapse-${user._id}`;
            collapse.setAttribute('aria-labelledby', `heading-${user._id}`);
            collapse.setAttribute('data-bs-parent', '#accordion');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            // Contenido del acordeón (información del usuario)
            const ul = document.createElement('ul');
            ul.classList.add('list-group');

            const liNombre = document.createElement('li');
            liNombre.classList.add('list-group-item');
            liNombre.textContent = `Nombre: ${user.nombre}`;

            const liTelefono = document.createElement('li');
            liTelefono.classList.add('list-group-item');
            liTelefono.textContent = `Teléfono: ${user.number}`;

            const liDireccion = document.createElement('li');
            liDireccion.classList.add('list-group-item');
            liDireccion.textContent = `Dirección: ${user.direccion}`;

            const liCiudad = document.createElement('li');
            liCiudad.classList.add('list-group-item');
            liCiudad.textContent = `Ciudad: ${user.ciudad}`;

            const liCorreo = document.createElement('li');
            liCorreo.classList.add('list-group-item');
            liCorreo.textContent = `Correo: ${user.correo}`;

            const liRif = document.createElement('li');
            liRif.classList.add('list-group-item');
            liRif.textContent = `RIF: ${user.rif}`;

            // Agregar elementos a la lista
            ul.appendChild(liNombre);
            ul.appendChild(liTelefono);
            ul.appendChild(liDireccion);
            ul.appendChild(liCiudad);
            ul.appendChild(liCorreo);
            ul.appendChild(liRif);

            cardBody.appendChild(ul);
            collapse.appendChild(cardBody);
            card.appendChild(collapse);
            accordion.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar usuarios. Por favor, inténtalo de nuevo más tarde.');
    }
}

// Ejecutar la función para cargar usuarios al cargar la página
window.addEventListener('DOMContentLoaded', cargarUsuarios);
