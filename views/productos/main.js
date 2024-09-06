document.addEventListener('DOMContentLoaded', () => {
    const addToast = new bootstrap.Toast(document.getElementById('add-toast'));
    const removeToast = new bootstrap.Toast(document.getElementById('remove-toast'));

    // Manejar añadir productos al carrito desde la vista de productos
    const addButtons = document.querySelectorAll('.btn-add');

    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const productId = button.getAttribute('data-producto-id');
            const card = button.closest('.card');
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

                card.classList.add('added-to-cart');
                addToast.show();
                displayCart(); // Actualiza la lista de productos en el carrito
                updateCardStyles(); // Actualiza la visualización de las tarjetas
            } else {
                console.log(`El producto '${productName}' ya está en el carrito.`);
            }
        });
    });

    // Eliminar producto del carrito
    function removeFromCart(productId) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        console.log(`Producto con ID ${productId} eliminado del carrito.`);

        const card = document.querySelector(`.card[data-producto-id="${productId}"]`);
        if (card) {
            card.classList.remove('added-to-cart');
        }

        removeToast.show();
        displayCart(); // Actualizar la lista de productos en el carrito
        updateCardStyles(); // Actualiza la visualización de las tarjetas
    }

    // Muestra los productos en el carrito
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

        // Añadir evento a los botones de eliminar después de que se generen dinámicamente
        const removeButtons = document.querySelectorAll('.btn-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const productId = button.getAttribute('data-producto-id');
                removeFromCart(productId);
            });
        });
    }

    displayCart(); // Cargar el carrito al iniciar

    // Buscar productos
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    const performSearch = async (query) => {
        if (query) {
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

                    // Añadir evento a los botones de añadir después de que se generen dinámicamente
                    const addButtons = document.querySelectorAll('.btn-add');
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
                                addToast.show(); // Muestra el toast de añadido
                                displayCart(); // Actualiza la lista de productos en el carrito
                                updateCardStyles(); // Actualiza la visualización de las tarjetas
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
