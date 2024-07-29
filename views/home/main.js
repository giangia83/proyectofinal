document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modal = document.querySelector('.modal');
    const closeButton = document.querySelector('.close');
    const favoriteList = document.getElementById('favoriteList');

    const openModal = () => {
        modalOverlay.style.display = 'block';
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modalOverlay.style.display = 'none';
        modal.style.display = 'none';
    };

    closeButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.getElementById('verFavoritos').addEventListener('click', () => {
        cargarFavoritos();
        openModal();
    });

    const cargarFavoritos = async () => {
        try {
            const response = await fetch('/fav/get-favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                favoriteList.innerHTML = ''; // Limpiar la lista antes de actualizar
                result.favorites.forEach(producto => {
                    const item = document.createElement('li');
                    item.innerHTML = `
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail" style="width: 100px; height: auto;">
                        <strong>${producto.nombre}</strong><br>
                        <span>${producto.categoria}</span>
                    `;
                    favoriteList.appendChild(item);
                });
            } else {
                console.error('Error al cargar favoritos:', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Manejo del menú hamburguesa
    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuDesplegable = document.getElementById('menuDesplegable');

    if (menuHamburguesa && menuDesplegable) {
        menuHamburguesa.addEventListener('click', () => {
            menuDesplegable.classList.toggle('activo');
        });
    }

    // Manejo del modal de favoritos
    if (document.querySelectorAll('.btn-star')) {
        document.querySelectorAll('.btn-star').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const productoId = this.getAttribute('data-producto-id');
                agregarAFavoritos(productoId);
            });
        });
    }

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
                alert('Producto agregado a favoritos');
                // Aquí podrías actualizar la lista de favoritos o mostrar un mensaje
            } else {
                alert('Error al añadir producto a favoritos: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al añadir producto a favoritos');
        }
    };
});
