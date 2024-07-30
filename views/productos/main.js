document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones "Añadir"
    const addButtons = document.querySelectorAll('.btn-add');

    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Previene el comportamiento por defecto del botón si es necesario
            event.preventDefault();

            // Obtiene el ID del producto desde el botón
            const productId = button.getAttribute('data-producto-id');
            const card = button.closest('.card-container'); // Encuentra el contenedor de la tarjeta asociado
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

            // Aplicar el efecto de minimización
            card.querySelector('.card').classList.add('minimize');
            
            // Eliminar el efecto después de la animación para que se pueda volver a aplicar
            setTimeout(() => {
                card.querySelector('.card').classList.remove('minimize');
            }, 500); // La duración de la animación en milisegundos
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
