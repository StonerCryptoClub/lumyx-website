import security from './security-middleware.js';

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

// Form validation schema
const contactFormSchema = {
  name: (value) => typeof value === 'string' && value.length >= 2,
  email: (value) => security.validateEmail(value),
  message: (value) => typeof value === 'string' && value.length >= 10,
  phone: (value) => !value || /^\+?[\d\s-]{10,}$/.test(value)
};

async function handleContactForm(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  
  // Sanitize and validate input
  const sanitizedData = {};
  for (const [key, value] of formData.entries()) {
    sanitizedData[key] = security.sanitizeInput(value);
  }
  
  // Validate request
  const validationErrors = security.validateRequest(sanitizedData, contactFormSchema);
  if (validationErrors) {
    alert('Please check your input: ' + validationErrors.join(', '));
    return;
  }
  
  // Check rate limiting
  const userIdentifier = sanitizedData.email || 'anonymous';
  if (security.isRateLimited(userIdentifier)) {
    alert('Too many attempts. Please try again later.');
    return;
  }
  
  // Disable submit button
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  
  try {
    // Send form data to your backend
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify(sanitizedData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    // Show success message
    form.reset();
    alert('Message sent successfully!');
    
  } catch (error) {
    // Handle error securely
    const errorResponse = security.handleError(error, 'contact form submission');
    alert(errorResponse.error);
    
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
  }
}

// Initialize form
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