// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remover la clase 'selected' de todas las tarjetas
            cards.forEach(c => c.classList.remove('selected'));
            // Agregar la clase 'selected' a la tarjeta clickeada
            card.classList.add('selected');

            // Obtener elementos dentro de la tarjeta
            const img = card.querySelector('.product-image');
            const checkIcon = card.querySelector('.check-icon');

            // Aplicar transiciones
            img.style.opacity = '0';
            img.style.filter = 'blur(3px)';
            checkIcon.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
});
