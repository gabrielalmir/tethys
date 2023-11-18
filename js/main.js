const baseURL = 'https://tethys-api-auth.onrender.com'
const $registerForm = document.getElementById('register');
const $loginForm = document.getElementById('login');

function main() {
    if ($registerForm) {
        $registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            register(e);
        });
    }

    if ($loginForm) {
        $loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login(e);
        });
    }
}

function login(e) {
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log('Logging in...');
    console.log(email, password);

    fetch(`${baseURL}/login`, {
        method: 'POST',
        body: JSON.stringify({ username: email, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.status === 'success') {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            }
        })
        .catch(err => console.error(err));
}

function register(e) {
    const email = e.target.email.value;
    const password = e.target.password.value;
    const cep = e.target.cep.value;
    const phone = e.target.phone.value;

    console.log('Registering...');
    console.log(email, password, cep, phone);

    fetch(`${baseURL}/register`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
}

main();
