// Netlify Forms Integration
// This works automatically if you're hosting on Netlify

class NetlifyFormsService {
    constructor() {
        this.formName = 'consultation-form';
    }

    async submitForm(formData) {
        try {
            this.showLoading(true);

            // Create form data for Netlify
            const formDataToSend = new FormData();
            formDataToSend.append('form-name', this.formName);
            
            // Add all form fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formDataToSend).toString()
            });

            if (response.ok) {
                return { success: true, message: 'Form submitted successfully!' };
            } else {
                throw new Error('Form submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            return { 
                success: false, 
                message: 'Failed to submit form. Please try again.' 
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
                submitButton.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                `;
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Schedule Consultation';
            }
        }
    }
}

// Initialize Netlify Forms service
const netlifyFormsService = new NetlifyFormsService();

// Export for use in other files
window.NetlifyFormsService = NetlifyFormsService;
window.netlifyFormsService = netlifyFormsService;
