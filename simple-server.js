const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Clean URL routing - serve files without .html extension
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'about'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'services'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'contact'));
});

// 404 handler - redirect to home
app.get('*', (req, res) => {
    res.redirect('/home');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Available routes:`);
    console.log(`  http://localhost:${PORT}/`);
    console.log(`  http://localhost:${PORT}/home`);
    console.log(`  http://localhost:${PORT}/about`);
    console.log(`  http://localhost:${PORT}/services`);
    console.log(`  http://localhost:${PORT}/contact`);
});

module.exports = app;
