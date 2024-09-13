document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('product-list'); // Contenedor para los productos
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    // Cargar productos al iniciar
    loadProducts();
    displayCart(); // Cargar el carrito al iniciar

    async function loadProducts() {
        try {
            const response = await fetch('/api/productos'); // Cambia esta URL si es necesario
            const productos = await response.json();

            // Limpia el contenedor antes de añadir nuevos productos
            productListContainer.innerHTML = '';

            // Crear una lista de productos
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
                    <div class="card-buttons">
                        <button class="btn btn-add" data-producto-id="${producto._id}">Añadir</button>
                    </div>
                `;

                list.appendChild(listItem);
            });

            // Añadir la lista de productos al contenedor
            productListContainer.appendChild(list);

            // Añadir eventos a los botones de añadir productos al carrito
            attachAddToCartEvents();
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            productListContainer.innerHTML = '<p class="text-danger">Error al cargar los productos. Inténtalo más tarde.</p>';
        }
    }

    function attachAddToCartEvents() {
        document.addEventListener('click', (event) => {
            if (event.target.matches('.btn-add')) {
                event.preventDefault();
                const button = event.target;
                const productId = button.getAttribute('data-producto-id');
                const card = button.closest('.card') || button.closest('.list-group-item');
                const productName = card.querySelector('h5 a')?.textContent || card.querySelector('h6.mb-1').textContent;
                const productCategory = card.querySelector('.font-italic')?.textContent || card.querySelector('.text-muted').textContent;
                const productImage = card.querySelector('.product-image')?.getAttribute('src') || card.querySelector('img').getAttribute('src');
    
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
    
                    // Deshabilitar el botón "Añadir"
                    button.disabled = true;
                    button.textContent = 'Añadido';
    
                    if (card) card.classList.add('added-to-cart');
                    displayCart();
                    updateCardStyles();
                } else {
                    console.log(`El producto '${productName}' ya está en el carrito.`);
                }
            }
        });
    }
    
    // Función para mostrar productos en el carrito
    function displayCart() {
        const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');

        cartItemsContainer.innerHTML = '';

        cartItems.forEach(product => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'align-items-center');
            listItem.innerHTML = `
                <img src="${product.image}" alt="Imagen del producto" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover; margin-right: 15px;">
                <div class="me-auto">
                    <h6 class="mb-1">${product.name}</h6>
                    <p class="mb-1 text-muted">${product.category}</p>
                </div>
                <button class="btn btn-danger btn-remove" data-producto-id="${product.id}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(listItem);
        });

        // Añadir evento a los botones de eliminar productos
        const removeButtons = document.querySelectorAll('.btn-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const productId = button.getAttribute('data-producto-id');
                removeFromCart(productId);
            });
        });
    }

    // Eliminar producto del carrito
    function removeFromCart(productId) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        console.log(`Producto con ID ${productId} eliminado del carrito.`);

        const card = document.querySelector(`.card[data-producto-id="${productId}"]`);
        if (card) {
            card.classList.remove('added-to-cart');
            const button = card.querySelector('.btn-add');
            
            // Volver a habilitar el botón "Añadir"
            if (button) {
                button.disabled = false;
                button.textContent = 'Añadir';
            }
        }

        displayCart();
        updateCardStyles();
    }

    // Actualiza los estilos de las tarjetas en función del carrito
    function updateCardStyles() {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const productCards = document.querySelectorAll('.card');

        productCards.forEach(card => {
            const productId = card.getAttribute('data-producto-id');
            if (cart.some(item => item.id === productId)) {
                card.classList.add('added-to-cart'); // Añadir una clase si el producto está en el carrito
            } else {
                card.classList.remove('added-to-cart'); // Quitar la clase si no está en el carrito
            }
        });
    }

    // Buscar productos
    const performSearch = async (query) => {
        if (query.length > 0) {
            try {
                const response = await fetch(`/api/buscar?query=${encodeURIComponent(query)}`);
                const productos = await response.json();

                resultsContainer.innerHTML = '';

                if (productos.length > 0) {
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
                            <button class="btn btn-add btn-2" data-producto-id="${producto._id}">Añadir</button>
                        `;
                        list.appendChild(listItem);
                    });

                    resultsContainer.appendChild(list);
                    attachAddToCartEvents(); // Añadir eventos para productos buscados
                } else {
                    resultsContainer.innerHTML = '<p class="text-center spacedown">No se encontraron productos.</p>';
                }
            } catch (error) {
                console.error('Error al buscar productos:', error);
                resultsContainer.innerHTML = '<p class="text-center text-danger spacedown">Error al buscar productos. Inténtalo de nuevo.</p>';
            }
        } else {
            // Limpia los resultados si no hay búsqueda
            resultsContainer.innerHTML = ''; 
         
        }
    };

    searchInput.addEventListener('input', (event) => {
        performSearch(event.target.value.trim());
    });
});

function irAVerCarrito() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        const cartJson = encodeURIComponent(JSON.stringify(cart));
        window.location.href = '/vercarrito?productos=' + cartJson;
    } else {
        console.log('El carrito está vacío.');
    }
}
