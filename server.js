// Simple Express Server for EmailJS Frontend
// EmailJS handles email sending on the client-side

const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Clean URL routing - serve HTML files without .html extension
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});

app.get('/home', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});

app.get('/about', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/services', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'pages', 'services.html'));
});

app.get('/contact', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'pages', 'contact.html'));
});

// Health check endpoint for Azure
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'pages', 'home.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Available routes:`);
    console.log(`  http://localhost:${PORT}/`);
    console.log(`  http://localhost:${PORT}/home`);
    console.log(`  http://localhost:${PORT}/about`);
    console.log(`  http://localhost:${PORT}/services`);
    console.log(`  http://localhost:${PORT}/contact`);
});
