document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('Tarjeta clickeada:', card.dataset.productId); // Agregar console log

            // Remover la clase 'selected' de todas las tarjetas
            cards.forEach(c => {
                c.classList.remove('selected');
                // Revertir el tamaño de las tarjetas
                c.style.transform = 'scale(1)';
            });

            // Agregar la clase 'selected' a la tarjeta clickeada
            card.classList.add('selected');

            // Reducir el tamaño de la tarjeta clickeada
            card.style.transform = 'scale(0.95)';

            // Obtener elementos dentro de la tarjeta clickeada
            const img = card.querySelector('.product-image');
            const checkIcon = card.querySelector('.check-icon');

            // Aplicar transiciones
            img.style.opacity = '0';
            img.style.filter = 'blur(3px)';
            checkIcon.classList.remove('hidden'); // Mostrar el icono de check
            checkIcon.style.transform = 'translate(-50%, -50%) scale(1)';

            // Agregar producto al carrito usando localStorage
            const productName = card.querySelector('.addToCart').getAttribute('data-nombre');
            addToCart(productName);

            // Mostrar alerta de producto agregado al carrito
            showAlert(productName);
        });
    });

    function addToCart(productName) {
        // Obtener el carrito desde localStorage o inicializar un array vacío
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Agregar el nuevo producto al carrito si no está ya agregado
        if (!cart.includes(productName)) {
            cart.push(productName);
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        console.log('Carrito actual:', cart); // Mostrar el carrito actual en consola
    }

    function showAlert(productName) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = `${productName} ha sido agregado al carrito`;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000); // Desaparece la alerta después de 5 segundos
    }
});
