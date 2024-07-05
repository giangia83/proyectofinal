document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const checkIcon = card.querySelector('.check-icon');
            const productId = card.getAttribute('data-producto-id');
            const productName = card.querySelector('h5 a').textContent;
            const productCategory = card.querySelector('.font-italic').textContent;
            const productImage = card.querySelector('.product-image').getAttribute('src');

            if (card.classList.contains('selected')) {
                // Ocultar check icon y eliminar del carrito
                checkIcon.style.transform = 'translate(-50%, -50%) scale(0)';
                card.classList.remove('selected');
                removeFromCart(productId);
                showPopup(`Producto '${productName}' eliminado del carrito.`);
            } else {
                // Mostrar check icon y agregar al carrito
                checkIcon.classList.remove('hidden');
                checkIcon.style.transform = 'translate(-50%, -50%) scale(1)';
                card.classList.add('selected');

                const product = {
                    id: productId,
                    name: productName,
                    category: productCategory,
                    image: productImage,
                };

                addToCart(product);
                showPopup(`Producto '${productName}' agregado al carrito.`);
            }
        });
    });

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const found = cart.some(item => item.id === product.id);
        if (!found) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.textContent = message;
        document.body.appendChild(popup);

        // Ajustar posición responsive de la esquina
        const topOffset = 20;
        const rightOffset = 20;
        popup.style.top = `${topOffset}px`;
        popup.style.right = `${rightOffset}px`;

        // Quitar el pop-up después de 3 segundos
        setTimeout(() => {
            popup.remove();
        }, 3000); // 3000 milisegundos = 3 segundos
    }
});
