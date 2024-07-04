// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Obtener todas las tarjetas de producto
    const cards = document.querySelectorAll('.myCard');

    // Función para marcar como seleccionado al hacer click
    function selectCard(card) {
        // Cambiar tamaño y opacidad del div
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0.7';

        // Reemplazar imagen por icono de check
        const img = card.querySelector('.img-fluid');
        img.style.filter = 'blur(3px)';
        
        // Mostrar el icono de check
        const checkIcon = card.querySelector('.check-icon');
        checkIcon.style.display = 'inline'; // Cambiado a 'inline' para mostrar el icono

        // Agregar la clase 'selected' para estilos adicionales si es necesario
        card.classList.add('selected');
    }

    // Añadir evento de click a cada tarjeta de producto
    cards.forEach(card => {
        card.addEventListener('click', () => {
            selectCard(card);
        });
    });

    // Script para agregar al carrito y mostrar alerta
    const addToCartButtons = document.querySelectorAll('.addToCart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-nombre');
            showAlert(productName);
        });
    });

    function showAlert(productName) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = `${productName} ha sido agregado al carrito`;

        const container = document.querySelector('.container'); // Selector adecuado para el contenedor de la página
        container.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000); // Desaparece la alerta después de 5 segundos
    }
});
