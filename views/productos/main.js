document.addEventListener('DOMContentLoaded', () => {
    const addToast = new bootstrap.Toast(document.getElementById('add-toast'));
    const removeToast = new bootstrap.Toast(document.getElementById('remove-toast'));
    const productListContainer = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    loadProducts();
    displayCart();

    async function loadProducts() {
        try {
            const response = await fetch('/api/productos');
            const productos = await response.json();
            productListContainer.innerHTML = '';

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
                    <button class="btn btn-add" data-producto-id="${producto._id}">Añadir</button>
                `;

                list.appendChild(listItem);
            });

            productListContainer.appendChild(list);
            attachAddToCartEvents();
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            productListContainer.innerHTML = '<p class="text-danger">Error al cargar los productos. Inténtalo más tarde.</p>';
        }
    }

    function attachAddToCartEvents() {
        const addButtons = document.querySelectorAll('.btn-add');
        addButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const productId = button.getAttribute('data-producto-id');
                const listItem = button.closest('.list-group-item');

                if (listItem) {
                    const productNameElement = listItem.querySelector('h6');
                    const productCategoryElement = listItem.querySelector('p');
                    const productImageElement = listItem.querySelector('img');

                    if (productNameElement && productCategoryElement && productImageElement) {
                        const productName = productNameElement.textContent;
                        const productCategory = productCategoryElement.textContent;
                        const productImage = productImageElement.getAttribute('src');

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

                            button.closest('.list-group-item').classList.add('added-to-cart');
                            addToast.show();
                            displayCart();
                            updateCardStyles();
                        } else {
                            console.log(`El producto '${productName}' ya está en el carrito.`);
                        }
                    }
                }
            });
        });
    }

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

        const removeButtons = document.querySelectorAll('.btn-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const productId = button.getAttribute('data-producto-id');
                removeFromCart(productId);
            });
        });
    }

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
        displayCart();
        updateCardStyles();
    }

    function updateCardStyles() {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const productCards = document.querySelectorAll('.card');

        productCards.forEach(card => {
            const productId = card.getAttribute('data-producto-id');
            if (cart.some(item => item.id === productId)) {
                card.classList.add('added-to-cart');
            } else {
                card.classList.remove('added-to-cart');
            }
        });
    }

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
                    attachAddToCartEvents();
                } else {
                    resultsContainer.innerHTML = '<p class="text-center spacedown">No se encontraron productos.</p>';
                }
            } catch (error) {
                console.error('Error al buscar productos:', error);
                resultsContainer.innerHTML = '<p class="text-center text-danger spacedown">Error al buscar productos. Inténtalo de nuevo.</p>';
            }
        } else {
            resultsContainer.innerHTML = '';
            loadProducts();
        }
    };

    searchInput.addEventListener('input', (event) => {
        performSearch(event.target.value);
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