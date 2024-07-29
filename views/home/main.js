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
                item.innerHTML = `
                  <img src="${producto.imagen.data}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                    <div>
                        <small class="text-muted d-block mb-1">${producto.nombre}</small>
                        <span class="text-muted">${producto.categoria}</span>
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
                    item.innerHTML = `
                       <img src="${producto.imagen.data}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                        <div>
                            <strong class="d-block mb-1">${producto.nombre}</strong>
                            <span class="text-muted">${producto.categoria}</span>
                        </div>
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
