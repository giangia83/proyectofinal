document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');
    const continueButton = document.getElementById('continueButton'); // Suponiendo que tienes un botón con id="continueButton"

    // Función para obtener el nombre de usuario desde la cookie
    function getCurrentUserFromCookie() {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const parts = cookie.split('=');
            if (parts[0] === 'nombreUsuario') {
                return decodeURIComponent(parts[1]);
            }
        }
        return null;
    }

    // Obtener el nombre de usuario actual
    const currentUser = getCurrentUserFromCookie();

    if (!currentUser) {
        console.error('No se pudo obtener el nombre de usuario desde la cookie.');
        return;
    }

    const cart = new ShoppingCart(currentUser);

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const checkIcon = card.querySelector('.check-icon');

            if (card.classList.contains('selected')) {
                // Deshacer selección
                card.classList.remove('selected');
                const productId = card.getAttribute('data-producto-id');
                removeFromCart(productId);
            } else {
                // Seleccionar
                card.classList.add('selected');
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

                cart.addToCart(product); // Agregar producto al carrito

                console.log(`Producto '${productName}' (ID: ${productId}, Categoría: ${productCategory}) agregado al carrito.`);
            }
        });
    });

    continueButton.addEventListener('click', () => {
        // Al hacer clic en "Continuar con la compra"

        // Transferir el carrito a localStorage y asignar nombre al carrito
        cart.transferToLocalStorage();
        const cartId = cart.getCartId();
        localStorage.setItem(`cart_${currentUser}_${cartId}`, JSON.stringify(cart.products));

        // Limpiar sessionStorage
        cart.clearSessionStorage();

        console.log(`Carrito transferido a localStorage con nombre: cart_${currentUser}_${cartId}`);

        // Aquí puedes hacer más acciones, como redireccionar a la página de pago o realizar otras operaciones relacionadas con la compra
    });

    function removeFromCart(productId) {
        cart.removeFromCart(productId);
        console.log(`Producto con ID ${productId} eliminado del carrito.`);
    }

    // Clase ShoppingCart para gestionar el carrito de compras
    class ShoppingCart {
        constructor(user) {
            this.user = user;
            this.cartId = `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            this.storage = sessionStorage;
            this.products = [];

            // Cargar productos del sessionStorage si ya existen
            const storedCart = this.storage.getItem('cart');
            if (storedCart) {
                try {
                    this.products = JSON.parse(storedCart);
                } catch (error) {
                    console.error('Error parsing cart data from sessionStorage:', error);
                }
            }
        }

        addToCart(product) {
            this.products.push(product);
            this.saveCart();
        }

        removeFromCart(productId) {
            this.products = this.products.filter(item => item.id !== productId);
            this.saveCart();
        }

        saveCart() {
            this.storage.setItem('cart', JSON.stringify(this.products));
        }

        transferToLocalStorage() {
            this.storage = localStorage;
            this.saveCart();
        }

        clearSessionStorage() {
            sessionStorage.removeItem('cart');
        }

        getCartId() {
            return this.cartId;
        }
    }
});
