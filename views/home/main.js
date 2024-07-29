// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Manejo del menú hamburguesa
    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuDesplegable = document.getElementById('menuDesplegable');

    if (menuHamburguesa && menuDesplegable) {
        menuHamburguesa.addEventListener('click', () => {
            menuDesplegable.classList.toggle('activo');
        });
    }

    // Manejo del modal de favoritos
    const favoriteModal = document.getElementById('favoriteModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const favoriteList = document.getElementById('favoriteList');

    if (favoriteModal && closeModal) {
        document.querySelectorAll('.btn-star').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const productoId = this.getAttribute('data-producto-id');
                agregarAFavoritos(productoId);
            });
        });

        closeModal.addEventListener('click', () => {
            favoriteModal.style.display = 'none';
        });

        modalOverlay.addEventListener('click', () => {
            favoriteModal.style.display = 'none';
        });
    }

    // Función para agregar productos a favoritos
    const agregarAFavoritos = async (productoId) => {
        try {
            const response = await fetch('/fav/add-to-favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productoId })
            });

            const result = await response.json();
            if (result.success) {
                const item = document.createElement('li');
                item.textContent = `Producto ID ${productoId}`;
                favoriteList.appendChild(item);
                favoriteModal.style.display = 'block';
            } else {
                alert('Error al añadir producto a favoritos: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al añadir producto a favoritos');
        }
    };
});
