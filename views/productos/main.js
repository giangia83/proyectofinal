document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const checkIcon = card.querySelector('.check-icon');

            if (card.classList.contains('selected')) {
                // Deshacer selección
                card.classList.remove('selected');
                checkIcon.classList.add('hidden'); // Ocultar el ícono de check
                card.style.transform = 'scale(1)'; // Restaurar tamaño normal de la tarjeta
                card.style.backgroundColor = ''; // Restaurar color de fondo original si se había cambiado
                card.querySelector('h5 a').style.color = ''; // Restaurar color de texto original
                const productId = card.getAttribute('data-producto-id');
                removeFromCart(productId);
            } else {
                // Seleccionar
                card.classList.add('selected');
                checkIcon.classList.remove('hidden'); // Mostrar el ícono de check
                card.style.transform = 'scale(0.95)'; // Reducir tamaño de la tarjeta al seleccionar
                card.style.backgroundColor = '#cdeccd'; // Cambiar color de fondo al seleccionar (verde claro)
                card.querySelector('h5 a').style.color = '#ffffff'; // Cambiar color de texto a blanco
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
