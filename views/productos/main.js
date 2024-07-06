document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    // Función para obtener el nombre de usuario desde la cookie
    function getUsuarioDesdeCookie() {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const parts = cookie.split('=');
            if (parts[0].trim() === 'usuario') {
                return decodeURIComponent(parts[1]);
            }
        }
        return null;
    }

    // Obtener el nombre de usuario actual
    const usuario = getUsuarioDesdeCookie();

    if (!usuario) {
        console.error('No se pudo obtener el nombre de usuario desde la cookie.');
        return;
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const checkIcon = card.querySelector('.check-icon');

            if (card.classList.contains('selected')) {
                // Deshacer selección
                card.classList.remove('selected');
                checkIcon.classList.add('hidden'); // Ocultar el ícono de check
                card.style.transform = 'scale(1)'; // Restaurar tamaño normal de la tarjeta
                const productId = card.getAttribute('data-producto-id');
                removeFromCart(productId);
            } else {
                // Seleccionar
                card.classList.add('selected');
                checkIcon.classList.remove('hidden'); // Mostrar el ícono de check
                card.style.transform = 'scale(0.95)'; // Reducir tamaño de la tarjeta al seleccionar
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

                let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
                const found = cart.some(item => item.id === productId);
                if (!found) {
                    cart.push(product);
                    sessionStorage.setItem('cart', JSON.stringify(cart));
                    console.log(`Producto '${productName}' (ID: ${productId}, Categoría: ${productCategory}) agregado al carrito.`);
                } else {
                    console.log(`El producto '${productName}' ya está en el carrito.`);
                }
            }
        });
    });

    function removeFromCart(productId) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        console.log(`Producto con ID ${productId} eliminado del carrito.`);
    }
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
