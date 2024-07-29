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
        const favoriteList = document.querySelector('#favoriteList');
        const favoriteModalElement = document.querySelector('#favoriteModal');
        const favoriteModal = new bootstrap.Modal(favoriteModalElement);
    
        const agregarAFavoritos = async (productoId) => {
            try {
                const response = await fetch('/fav/add-to-favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productoId })
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
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
    
        // Añadir evento de clic a los botones de estrella
        document.querySelectorAll('.btn-star').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
                const productoId = button.dataset.productoId; // Obtener el ID del producto
                console.log('Producto ID:', productoId); // Añadir un log para verificar el ID
                agregarAFavoritos(productoId);
            });
        });
    });
    
    
    
});
