document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
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
                console.log(`Producto '${productName}' agregado al carrito.`);
            } else {
                console.log(`El producto '${productName}' ya está en el carrito.`);
            }
        });
    });
});
