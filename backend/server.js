const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path'); // Добавлено

const app = express();
app.use(express.json());

// Разрешение CORS для фронтенда
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));

// Раздача статических файлов из ../frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Хранилище пользователей
const SECRET_KEY = 'supersecretkey';
const users = [];

// Регистрация пользователя
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username, password });
    res.json({ message: "User registered successfully" });
});

// Авторизация
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
};

// Защищенный маршрут
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "This is a protected resource", user: req.user });
});

// Обслуживание index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
