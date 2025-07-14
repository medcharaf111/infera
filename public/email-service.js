// EmailJS Configuration and Form Handling
// This file handles email sending using EmailJS service (no backend required)

class EmailService {
    constructor() {
        // Initialize EmailJS with your public key
        // Replace these with your actual EmailJS credentials
        this.publicKey = 'mSkoxoP47HpRDAH9u'; // Get from Integration page
        this.serviceId = 'service_ppd1j8f'; // Get from Email Services page
        this.templateId = 'template_ojgxt0e'; // Get from your main contact template
        
        // Initialize EmailJS
        this.init();
    }

    init() {
        // Load EmailJS library dynamically
        if (!window.emailjs) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(this.publicKey);
            };
            document.head.appendChild(script);
        } else {
            emailjs.init(this.publicKey);
        }
    }

    async sendEmail(formData) {
        try {
            // Show loading state
            this.showLoading(true);

            // Prepare template parameters
            const templateParams = {
                from_name: `${formData.firstName} ${formData.lastName}`,
                from_email: formData.email,
                company: formData.company,
                job_title: formData.jobTitle,
                industry: formData.industry,
                company_size: formData.companySize,
                challenges: formData.challenges,
                timestamp: new Date().toLocaleString(),
                to_name: 'Infera AI Team',
                to_email: 'infera.contact@gmail.com'
            };

            // Send email
            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            return { success: true, message: 'Email sent successfully!' };

        } catch (error) {
            console.error('Email sending failed:', error);
            return { 
                success: false, 
                message: 'Failed to send email. Please try again or contact us directly.' 
            };
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const submitButton = document.querySelector('#consultation-form button[type="submit"]');
        if (submitButton) {
            if (show) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Sending...';
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Schedule Consultation';
            }
        }
    }
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validateRequired(value) {
        return value && value.trim().length > 0;
    }

    static validateForm(formData) {
        const errors = {};

        if (!this.validateRequired(formData.firstName)) {
            errors.firstName = 'First name is required';
        }

        if (!this.validateRequired(formData.lastName)) {
            errors.lastName = 'Last name is required';
        }

        if (!this.validateRequired(formData.email)) {
            errors.email = 'Email is required';
        } else if (!this.validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!this.validateRequired(formData.company)) {
            errors.company = 'Company name is required';
        }

        if (!this.validateRequired(formData.jobTitle)) {
            errors.jobTitle = 'Job title is required';
        }

        if (!this.validateRequired(formData.industry)) {
            errors.industry = 'Please select an industry';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Initialize email service
const emailService = new EmailService();

// Export for use in other files
window.EmailService = EmailService;
window.FormValidator = FormValidator;
window.emailService = emailService;
