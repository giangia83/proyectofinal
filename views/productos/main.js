document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones "Añadir"
    const addButtons = document.querySelectorAll('.btn-add');

    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Previene el comportamiento por defecto del botón si es necesario
            event.preventDefault();

            // Obtiene el ID del producto desde el botón
            const productId = button.getAttribute('data-producto-id');
            const card = button.closest('.card'); // Encuentra la tarjeta asociada
            const productName = card.querySelector('h5 a').textContent;
            const productCategory = card.querySelector('.font-italic').textContent;
            const productImage = card.querySelector('.product-image').getAttribute('src');

            const product = {
                id: productId,
                name: productName,
                category: productCategory,
                image: productImage,
            };

            let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            const found = cart.some(item => item.id === productId);
            if (!found) {
                cart.push(product);
                sessionStorage.setItem('cart', JSON.stringify(cart));
                console.log(`Producto '${productName}' (ID: ${productId}, Categoría: ${productCategory}) agregado al carrito.`);
            } else {
                console.log(`El producto '${productName}' ya está en el carrito.`);
            }
        });
    });
});

function irAVerCarrito() {
    // Obtener productos seleccionados del sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    // Redireccionar a la página /vercarrito solo si hay productos en el carrito
    if (cart.length > 0) {
        // Convertir el array de productos a JSON codificado para pasar como parámetro
        const cartJson = encodeURIComponent(JSON.stringify(cart));
        // Redirigir a la página de carrito con los productos seleccionados
        window.location.href = '/vercarrito?productos=' + cartJson;
    } else {
        // Mostrar un mensaje o tomar alguna acción si el carrito está vacío
        console.log('El carrito está vacío.');
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    console.log(`Producto con ID ${productId} eliminado del carrito.`);
}
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    // Función para realizar la búsqueda y actualizar los resultados
    const performSearch = async (query) => {
        if (query) {
            try {
                const response = await fetch(`/api/buscar?query=${encodeURIComponent(query)}`);
                const productos = await response.json();

                resultsContainer.innerHTML = ''; // Limpia resultados anteriores

                if (productos.length > 0) {
                    // Crear una lista desordenada para los resultados
                    const list = document.createElement('ul');
                    list.classList.add('list-group');

                    productos.forEach(producto => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('list-group-item', 'd-flex', 'align-items-center');
                        listItem.innerHTML = `
                            <img src="${producto.imagen.data}" alt="Imagen del producto" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover; margin-right: 15px;">
                            <div class="me-auto">
                                <h6 class="mb-1">${producto.nombre}</h6>
                                <p class="mb-1 text-muted">${producto.categoria}</p>
                            </div>
                            <button class="btn btn-add btn-sm" data-producto-id="${producto._id}">Añadir</button>
                        `;
                        list.appendChild(listItem);
                    });

                    resultsContainer.appendChild(list);

                    // Añadir eventos a los botones de añadir al carrito
                    const addButtons = document.querySelectorAll('.btn-primary');
                    addButtons.forEach(button => {
                        button.addEventListener('click', (event) => {
                            event.preventDefault();

                            const productId = button.getAttribute('data-producto-id');
                            const listItem = button.closest('.list-group-item');
                            const productName = listItem.querySelector('h6').textContent;
                            const productCategory = listItem.querySelector('p').textContent;
                            const productImage = listItem.querySelector('img').getAttribute('src');

                            const product = {
                                id: productId,
                                name: productName,
                                category: productCategory,
                                image: productImage,
                            };

                            let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
                            const found = cart.some(item => item.id === productId);
                            if (!found) {
                                cart.push(product);
                                sessionStorage.setItem('cart', JSON.stringify(cart));
                                console.log(`Producto '${productName}' (ID: ${productId}, Categoría: ${productCategory}) agregado al carrito.`);
                            } else {
                                console.log(`El producto '${productName}' ya está en el carrito.`);
                            }
                        });
                    });

                } else {
                    resultsContainer.innerHTML = '<p class="text-center spacedown">No se encontraron productos.</p>';
                }
            } catch (error) {
                console.error('Error al buscar productos:', error);
                resultsContainer.innerHTML = '<p class="text-center text-danger spacedown">Error al buscar productos. Inténtalo de nuevo.</p>';
            }
        } else {
            resultsContainer.innerHTML = '<p class="text-center spacedown">Por favor, ingresa una búsqueda.</p>';
        }
    };

    // Llama a la función de búsqueda cuando se detecta un cambio en el campo de búsqueda
    searchInput.addEventListener('input', (event) => {
        performSearch(event.target.value.trim());
    });
});
