document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle para mostrar/ocultar información del producto
            const cardBody = card.querySelector('.card-body');
            const checkIcon = card.querySelector('.check-icon');

            if (card.classList.contains('selected')) {
                // Restaurar tarjeta
                card.classList.remove('selected');
                cardBody.style.display = 'block';
                checkIcon.style.display = 'none';

                // Eliminar producto del carrito si está presente
                const productId = card.getAttribute('data-producto-id');
                removeFromCart(productId);
            } else {
                // Ocultar información de la tarjeta
                card.classList.add('selected');
                cardBody.style.display = 'none';
                
                // Mostrar check azul en el centro de la tarjeta
                checkIcon.style.display = 'block';
            }

            // Obtener información del producto
            const productId = card.getAttribute('data-producto-id');
            const productName = card.querySelector('h5 a').textContent;
            const productCategory = card.querySelector('.font-italic').textContent;
            const productImage = card.querySelector('.product-image').getAttribute('src');

            // Crear objeto con la información del producto
            const product = {
                id: productId,
                name: productName,
                category: productCategory,
                image: productImage,
                // Otros detalles según sea necesario
            };

            // Obtener el carrito desde localStorage o inicializar un array vacío
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Agregar el producto al carrito si no está ya agregado
            const found = cart.some(item => item.id === productId);
            if (!found) {
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log(`Producto '${productName}' (ID: ${productId}, Categoría: ${productCategory}) agregado al carrito.`);
            } else {
                console.log(`El producto '${productName}' ya está en el carrito.`);
            }
        });
    });

    function removeFromCart(productId) {
        // Obtener el carrito desde localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Filtrar el producto del carrito
        cart = cart.filter(item => item.id !== productId);

        // Actualizar localStorage con el nuevo carrito
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(`Producto con ID ${productId} eliminado del carrito.`);
    }
});
