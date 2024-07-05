document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle para mostrar/ocultar el check icon
            const checkIcon = card.querySelector('.check-icon');

            if (checkIcon.style.display === 'block') {
                // Ocultar check icon y eliminar del carrito
                checkIcon.style.display = 'none';
                const productId = card.getAttribute('data-producto-id');
                removeFromCart(productId);
            } else {
                // Mostrar check icon y agregar al carrito
                checkIcon.style.display = 'block';
                const productId = card.getAttribute('data-producto-id');
                const productName = card.querySelector('h5 a').textContent;
                const productCategory = card.querySelector('.font-italic').textContent;
                const productImage = card.querySelector('.product-image').getAttribute('src');

                const product = {
                    id: productId,
                    name: productName,
                    category: productCategory,
                    image: productImage,
                };

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const found = cart.some(item => item.id === productId);
                if (!found) {
                    cart.push(product);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    console.log(`Producto '${productName}' (ID: ${productId}, Categoría: ${productCategory}) agregado al carrito.`);
                } else {
                    console.log(`El producto '${productName}' ya está en el carrito.`);
                }
            }
        });
    });

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(`Producto con ID ${productId} eliminado del carrito.`);
    }
});
