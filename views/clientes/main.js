// main.js
async function cargarUsuarios() {
    try {
        const response = await fetch('/usuarios/');
        const users = await response.json();

        if (!response.ok) {
            throw new Error(users.message || 'Error al cargar usuarios');
        }

        const container = document.getElementById('userCardsContainer');
        container.innerHTML = ''; // Limpiar el contenido actual

        users.forEach(user => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');

            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'shadow-sm');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.textContent = user.nombre;

            const cardText = document.createElement('p');
            cardText.classList.add('card-text');
            cardText.innerHTML = `
                <strong>Teléfono:</strong> ${user.number}<br>
                <strong>Dirección:</strong> ${user.direccion}<br>
                <strong>Ciudad:</strong> ${user.ciudad}<br>
                <strong>Correo:</strong> ${user.correo}<br>
                <strong>RIF:</strong> ${user.rif}
            `;

            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#userDetailsModal');
            button.setAttribute('onclick', `loadUserDetails('${user._id}')`);
            button.textContent = 'Ver Detalles';

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(button);
            cardElement.appendChild(cardBody);
            card.appendChild(cardElement);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar usuarios. Por favor, inténtalo de nuevo más tarde.');
    }
}

async function loadUserDetails(userId) {
    try {
        const response = await fetch(`/usuarios/${userId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar detalles del usuario');
        }

        const content = `
          <p><strong>Nombre:</strong> ${data.nombre}</p>
          <p><strong>Correo:</strong> ${data.correo}</p>
          <p><strong>Dirección:</strong> ${data.direccion}</p>
          <p><strong>Ciudad:</strong> ${data.ciudad}</p>
          <p><strong>RIF:</strong> ${data.rif}</p>
          <p><strong>Número:</strong> ${data.number}</p>
        `;
        document.getElementById('userDetailsContent').innerHTML = content;

    } catch (error) {
        console.error('Error al cargar detalles del usuario:', error);
        alert('Error al cargar detalles del usuario. Por favor, inténtalo de nuevo más tarde.');
    }
}

// Ejecutar la función para cargar usuarios al cargar la página
window.addEventListener('DOMContentLoaded', cargarUsuarios);
