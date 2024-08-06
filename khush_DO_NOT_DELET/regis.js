document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const city = document.getElementById('reg-city').value;
        const area = document.getElementById('reg-area').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ username, password, city, area, gender });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful!');
        window.location.href = 'index.html';
    });
});
