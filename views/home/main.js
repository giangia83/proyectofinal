document.addEventListener('DOMContentLoaded', () => {
    // Manejo del menú hamburguesa
    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuDesplegable = document.getElementById('menuDesplegable');

    if (menuHamburguesa && menuDesplegable) {
        menuHamburguesa.addEventListener('click', () => {
            menuDesplegable.classList.toggle('activo');
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const favoriteList = document.querySelector('#favoriteList'); // Lista de favoritos
        const favoriteModalElement = document.querySelector('#favoriteModal'); // Modal de favoritos
        const favoriteModal = new bootstrap.Modal(favoriteModalElement); // Inicialización del modal de Bootstrap
    
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
                        <img src="${producto.imagen.data}" alt="${producto.nombre}" class="img-thumbnail" style="width: 100px; height: auto;">
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
    
        // Evento de clic en los botones de estrella para añadir a favoritos
        document.querySelectorAll('.btn-star').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevenir comportamiento por defecto del enlace
                const productoId = button.dataset.productoId; // Obtener el ID del producto
                agregarAFavoritos(productoId);
            });
        });
    });
    
    
});
