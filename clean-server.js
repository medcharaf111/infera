const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    let filePath = '';
    
    // Handle clean URLs
    if (req.url === '/' || req.url === '/home') {
        filePath = path.join(__dirname, 'pages', 'home');
    } else if (req.url === '/about') {
        filePath = path.join(__dirname, 'pages', 'about');
    } else if (req.url === '/services') {
        filePath = path.join(__dirname, 'pages', 'services');
    } else if (req.url === '/contact') {
        filePath = path.join(__dirname, 'pages', 'contact');
    } else if (req.url.startsWith('/css/')) {
        filePath = path.join(__dirname, req.url);
    } else if (req.url.startsWith('/public/')) {
        filePath = path.join(__dirname, req.url);
    } else {
        // Default to home page for unknown routes
        filePath = path.join(__dirname, 'pages', 'home');
    }
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/html';
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve 404
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Page Not Found</h1>');
            } else {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Available routes:`);
    console.log(`  http://localhost:${PORT}/`);
    console.log(`  http://localhost:${PORT}/home`);
    console.log(`  http://localhost:${PORT}/about`);
    console.log(`  http://localhost:${PORT}/services`);
    console.log(`  http://localhost:${PORT}/contact`);
});

module.exports = server;
