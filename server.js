// Node.js Backend for Email Sending
// This requires a backend server to handle email sending

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/contact', limiter);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, company, jobTitle, industry, companySize, challenges } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !company || !jobTitle || !industry) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Email to your team
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'infera.contact@gmail.com',
            subject: 'New Consultation Request - Infera AI',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                        New Consultation Request
                    </h2>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
                        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Company:</strong> ${company}</p>
                        <p><strong>Job Title:</strong> ${jobTitle}</p>
                        <p><strong>Industry:</strong> ${industry}</p>
                        <p><strong>Company Size:</strong> ${companySize || 'Not specified'}</p>
                    </div>
                    
                    ${challenges ? `
                        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #92400e; margin-top: 0;">Current Challenges</h3>
                            <p style="white-space: pre-wrap;">${challenges}</p>
                        </div>
                    ` : ''}
                    
                    <div style="background-color: #e5e7eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                            <strong>Submitted:</strong> ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `
        };

        // Auto-reply to user
        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for your consultation request - Infera AI',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                        Thank you for your interest in Infera AI!
                    </h2>
                    
                    <p>Dear ${firstName},</p>
                    
                    <p>Thank you for your interest in Infera AI's automation solutions!</p>
                    
                    <p>We have received your consultation request and our team will review it shortly. 
                    You can expect to hear from one of our automation specialists within 24 hours.</p>
                    
                    <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
                        <ul style="color: #374151;">
                            <li>Our team will review your requirements</li>
                            <li>We'll schedule a personalized consultation call</li>
                            <li>You'll receive a custom automation strategy</li>
                            <li>We'll discuss implementation timelines and ROI</li>
                        </ul>
                    </div>
                    
                    <p>In the meantime, feel free to explore our case studies and resources on our website.</p>
                    
                    <p>Best regards,<br>
                    The Infera AI Team</p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">
                        This is an automated response. For immediate assistance, contact us at infera.contact@gmail.com
                    </p>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReplyOptions);

        res.json({ 
            success: true, 
            message: 'Consultation request sent successfully!' 
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email. Please try again.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Clean URL routing - serve HTML files without .html extension
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

// 404 handler
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'pages', 'home'));
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

module.exports = app;
