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
    const favoriteModalElement = document.getElementById('favoriteModal');
    const favoriteModal = new bootstrap.Modal(favoriteModalElement);
    const favoriteList = document.getElementById('favoriteList');

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
                item.classList.add('list-group-item', 'd-flex', 'align-items-center');
                item.dataset.productoId = producto._id; // Añadir ID del producto como atributo de datos
                item.innerHTML = `
                  <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                    <div>
                        <small class="text-muted d-block mb-1">${producto.nombre}</small>
                        <span class="text-muted">${producto.categoria}</span>
                        <button class="btn btn-danger btn-sm ms-2 btn-remove" data-producto-id="${producto._id}">Eliminar</button>
                    </div>
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

    const eliminarDeFavoritos = async (productoId) => {
        try {
            const response = await fetch('/fav/remove-from-favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productoId })
            });
    
            const result = await response.json();
            if (result.success) {
                const item = document.querySelector(`li[data-producto-id="${productoId}"]`);
                if (item) {
                    item.remove();
                }
            } else {
                alert('Error al eliminar producto de favoritos: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar producto de favoritos');
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
                    item.classList.add('list-group-item', 'd-flex', 'align-items-center');
                    item.dataset.productoId = producto._id;
                    item.innerHTML = `
                       <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                        <div>
                            <strong class="d-block mb-1">${producto.nombre}</strong>
                            <span class="text-muted">${producto.categoria}</span>
                            <button class="btn btn-danger btn-sm ms-2 btn-remove" data-producto-id="${producto._id}">Eliminar</button>
                        </div>
                    `;
                    favoriteList.appendChild(item);
                });

                // Añadir el manejador de eventos para los botones de eliminar favoritos
                document.querySelectorAll('.btn-remove').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        event.preventDefault();
                        const productoId = button.getAttribute('data-producto-id');
                        await eliminarDeFavoritos(productoId);
                    });
                });
                
            } else {
                console.error('Error al cargar favoritos:', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    // Evento para abrir el modal y cargar los favoritos
    document.getElementById('verFavoritos').addEventListener('click', () => {
        cargarFavoritos();
        favoriteModal.show();
    });

    // Manejo del botón de agregar a favoritos
    document.querySelectorAll('.btn-star').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const productoId = this.getAttribute('data-producto-id');
            agregarAFavoritos(productoId);
        });
    });
});
