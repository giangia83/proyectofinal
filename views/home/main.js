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
    const favoriteModal = new bootstrap.Modal(document.getElementById('favoriteModal'));
    const favoriteList = document.getElementById('favoriteList');

    if (favoriteModal) {
        document.querySelectorAll('.btn-star').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const productoId = this.getAttribute('data-producto-id');
                agregarAFavoritos(productoId);
            });
        });

        document.getElementById('verFavoritos').addEventListener('click', () => {
            // Actualiza la lista de favoritos al abrir el modal
            cargarFavoritos();
            favoriteModal.show();
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
                const producto = result.producto;
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail" style="width: 100px; height: auto;">
                    <strong>${producto.nombre}</strong><br>
                    <span>${producto.categoria}</span>
                `;
                favoriteList.appendChild(item);
                favoriteModal.show();
            } else {
                alert('Error al añadir producto a favoritos: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al añadir producto a favoritos');
        }
    };

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
                    item.classList.add('list-group-item');
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
});
