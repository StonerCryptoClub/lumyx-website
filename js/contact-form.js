// Input validation and sanitization
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '').trim();
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function validateName(name) {
    // Allow letters, spaces, and basic punctuation
    const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
    return nameRegex.test(name);
}

function validateMessage(message) {
    // Check for minimum length and maximum length
    return message.length >= 10 && message.length <= 1000;
}

// Rate limiting
const rateLimiter = {
    attempts: new Map(),
    maxAttempts: 5,
    timeWindow: 15 * 60 * 1000, // 15 minutes

    isAllowed(email) {
        const now = Date.now();
        const userAttempts = this.attempts.get(email) || { count: 0, timestamp: now };

        if (now - userAttempts.timestamp > this.timeWindow) {
            // Reset if time window has passed
            userAttempts.count = 0;
            userAttempts.timestamp = now;
        }

        if (userAttempts.count >= this.maxAttempts) {
            return false;
        }

        userAttempts.count++;
        this.attempts.set(email, userAttempts);
        return true;
    }
};

// Contact form handler
async function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        // Get and validate form data
        const name = sanitizeInput(form.querySelector('#name').value);
        const email = sanitizeInput(form.querySelector('#email').value);
        const message = sanitizeInput(form.querySelector('#message').value);

        // Validate inputs
        if (!validateName(name)) {
            throw new Error('Please enter a valid name (2-50 characters, letters only)');
        }
        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        if (!validateMessage(message)) {
            throw new Error('Message must be between 10 and 1000 characters');
        }

        // Check rate limiting
        if (!rateLimiter.isAllowed(email)) {
            throw new Error('Too many attempts. Please try again later.');
        }

        // Show loading state
        submitButton.innerHTML = '<span>Sending...</span>';
        submitButton.disabled = true;

        // Send email using EmailJS
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: process.env.ADMIN_EMAIL
        };

        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_CONTACT_TEMPLATE_ID,
            templateParams
        );

        // Clear form and show success message
        form.reset();
        alert('Message sent successfully! We will get back to you soon.');
        
    } catch (error) {
        console.error('Contact form error:', error);
        alert(error.message || 'There was an error sending your message. Please try again.');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Rate limiting implementation
const RATE_LIMIT_DURATION = 3600000; // 1 hour
const MAX_ATTEMPTS = 5;

function checkRateLimit() {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem('contactAttempts') || '[]');
    
    // Remove old attempts
    const recentAttempts = attempts.filter(timestamp => 
        now - timestamp < RATE_LIMIT_DURATION
    );
    
    if (recentAttempts.length >= MAX_ATTEMPTS) {
        return false;
    }
    
    // Add new attempt
    recentAttempts.push(now);
    localStorage.setItem('contactAttempts', JSON.stringify(recentAttempts));
    return true;
}

function showError(message) {
    const errorDiv = document.getElementById('formError') || createMessageDiv('formError');
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff4444';
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('formSuccess') || createMessageDiv('formSuccess');
    successDiv.textContent = message;
    successDiv.style.color = '#00C851';
    successDiv.style.display = 'block';
    setTimeout(() => successDiv.style.display = 'none', 5000);
}

function createMessageDiv(id) {
    const div = document.createElement('div');
    div.id = id;
    div.style.marginTop = '10px';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    document.getElementById('contactForm').appendChild(div);
    return div;
} 