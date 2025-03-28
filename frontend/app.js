const apiUrl = 'http://localhost:3000';

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    document.getElementById('message').innerText = data.message;
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        document.getElementById('message').innerText = 'Login successful';
    } else {
        document.getElementById('message').innerText = data.message;
    }
}

async function getProtectedData() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/protected`, {
        headers: { 'Authorization': token }
    });
    const data = await response.json();
    document.getElementById('message').innerText = data.message;
}