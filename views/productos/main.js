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
    const form = document.getElementById('search-form');
    const resultsContainer = document.getElementById('search-results');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = document.getElementById('search-input').value.trim();

        if (query) {
            try {
                const response = await fetch(`/api/buscar?query=${encodeURIComponent(query)}`);
                const productos = await response.json();
                
                resultsContainer.innerHTML = ''; // Limpia resultados anteriores

                if (productos.length > 0) {
                    productos.forEach(producto => {
                        resultsContainer.innerHTML += `
                            <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
                                <div class="card rounded shadow-sm border-0">
                                    <div class="card-body p-4">
                                        <div class="image-container">
                                            <img src="${producto.imagen.data}" alt="Imagen del producto" class="img-fluid product-image">
                                        </div>
                                        <h5><a href="#" class="text-dark">${producto.nombre}</a></h5>
                                        <p class="small text-muted font-italic">${producto.categoria}</p>
                                        <div class="card-buttons">
                                            <button class="btn btn-add" data-producto-id="${producto._id}">Añadir</button>
                                            <a href="#" class="btn btn-star" data-producto-id="${producto._id}">
                                                <i class="fa fa-star"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    resultsContainer.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
                }
            } catch (error) {
                console.error('Error al buscar productos:', error);
                resultsContainer.innerHTML = '<p class="text-center text-danger">Error al buscar productos. Inténtalo de nuevo.</p>';
            }
        } else {
            resultsContainer.innerHTML = '<p class="text-center">Por favor, ingresa una búsqueda.</p>';
        }
    });
});
