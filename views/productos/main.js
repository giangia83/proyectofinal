document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
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
                // Añadir producto al carrito
                cart.push(product);
                sessionStorage.setItem('cart', JSON.stringify(cart));
                console.log(`Producto '${productName}' (ID: ${productId}, Categoría: ${productCategory}) agregado al carrito.`);

                // Animación para desaparecer la tarjeta seleccionada
                card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(-20px)';
                card.style.pointerEvents = 'none'; // Deshabilitar eventos de ratón durante la animación
                setTimeout(() => {
                    card.style.display = 'none';
                    card.remove();
                    // Reordenar visualmente las tarjetas restantes
                    reorganizarTarjetas();
                }, 300); // Esperar 300ms (duración de la transición) antes de eliminar completamente la tarjeta
            } else {
                console.log(`El producto '${productName}' ya está en el carrito.`);
            }
        });
    });

    function reorganizarTarjetas() {
        // Obtener todas las tarjetas visibles después de eliminar una
        const visibleCards = Array.from(document.querySelectorAll('.myCard'));

        // Calcular el espacio entre tarjetas
        const gap = 20; // Espacio en píxeles entre tarjetas
        const cardWidth = visibleCards[0].offsetWidth + gap; // Ancho de la tarjeta más el espacio

        // Ajustar la posición de las tarjetas restantes
        visibleCards.forEach((card, index) => {
            card.style.transition = 'transform 0.3s ease-out';
            const offsetLeft = index * cardWidth;
            card.style.transform = `translateX(${offsetLeft}px)`;
        });
    }

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
});
