document.addEventListener('DOMContentLoaded', () => {
    const addToast = new bootstrap.Toast(document.getElementById('add-toast'));
    const removeToast = new bootstrap.Toast(document.getElementById('remove-toast'));
    const productListContainer = document.getElementById('product-list'); // Contenedor para los productos

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

    // Asignar evento a los botones después de cargar los productos
    function attachAddToCartEvents() {
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

    // Función para eliminar producto del carrito
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

    // Función para buscar productos y mostrar spinner mientras se carga
    const performSearch = async (query) => {
        if (query) {
            try {
                // Muestra el spinner y limpia los resultados previos
                resultsContainer.innerHTML = '';
                spinner.style.display = 'block';

                const response = await fetch(`/api/buscar?query=${encodeURIComponent(query)}`);
                const productos = await response.json();

                // Oculta el spinner una vez que los productos están listos
                spinner.style.display = 'none';

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
                spinner.style.display = 'none';
                resultsContainer.innerHTML = '<p class="text-center text-danger spacedown">Error al buscar productos. Inténtalo de nuevo.</p>';
            }
        } else {
            resultsContainer.innerHTML = ''; // Limpiar resultados si no hay búsqueda
            spinner.style.display = 'none';
        }
    };

    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query.length === 0) {
            resultsContainer.innerHTML = ''; // Limpiar si no hay búsqueda
        } else {
            performSearch(query);
        }
    });

    loadProducts(); // Cargar los productos al iniciar la página
    displayCart(); // Cargar el carrito al iniciar
});