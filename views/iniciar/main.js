const formL = document.querySelector('#login-form');
const noti = document.querySelector('.notification');

formL.addEventListener('submit', async e => {
    e.preventDefault();

    const loginInput = document.querySelector('#inputEmail').value;
    const passwordInput = document.querySelector('#inputPassword').value;

    if (!loginInput || !passwordInput) {
        showNotification('El campo de correo o contraseña no puede estar vacío');
        return;
    }

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginInput,
                password: passwordInput
            })
        });

        if (response.ok) {
            window.location.href = '/cuenta';
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showNotification('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
});

function showNotification(message) {
    noti.textContent = message;
    noti.classList.add('show-notification');
    setTimeout(() => {
        noti.classList.remove('show-notification');
    }, 2000);
}
