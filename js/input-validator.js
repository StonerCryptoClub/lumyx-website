// Comprehensive Input Validation Utility
// Provides secure validation and sanitization for all user inputs

class InputValidator {
    constructor() {
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            phone: /^[\+]?[1-9][\d]{0,15}$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            name: /^[a-zA-Z\s\-'\.]{2,50}$/,
            alphanumeric: /^[a-zA-Z0-9\s]+$/,
            numeric: /^[0-9]+$/,
            // SQL injection patterns to block
            sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)|('|(\\x27)|(\\x2D\\x2D)|(\\x23)|(\\x3B))/i,
            // XSS patterns to block
            xssPatterns: /<script|javascript:|vbscript:|onload|onerror|onclick|onmouseover/i
        };
        
        this.maxLengths = {
            name: 100,
            email: 254,
            phone: 20,
            message: 5000,
            subject: 200,
            company: 100,
            url: 2048
        };
    }
    
    // Main validation method
    validate(input, type, options = {}) {
        if (!input || typeof input !== 'string') {
            return { isValid: false, error: 'Input is required' };
        }
        
        // Sanitize input first
        const sanitizedInput = this.sanitize(input);
        
        // Check for security threats
        const securityCheck = this.checkSecurity(sanitizedInput);
        if (!securityCheck.isValid) {
            return securityCheck;
        }
        
        // Type-specific validation
        switch (type) {
            case 'email':
                return this.validateEmail(sanitizedInput);
            case 'phone':
                return this.validatePhone(sanitizedInput);
            case 'url':
                return this.validateUrl(sanitizedInput);
            case 'name':
                return this.validateName(sanitizedInput);
            case 'message':
                return this.validateMessage(sanitizedInput, options.maxLength);
            case 'required':
                return this.validateRequired(sanitizedInput);
            case 'alphanumeric':
                return this.validateAlphanumeric(sanitizedInput);
            case 'numeric':
                return this.validateNumeric(sanitizedInput);
            default:
                return this.validateGeneric(sanitizedInput, options);
        }
    }
    
    // Sanitize input to prevent XSS and injection attacks
    sanitize(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        
        // Remove null bytes
        input = input.replace(/\0/g, '');
        
        // Trim whitespace
        input = input.trim();
        
        // Encode HTML entities
        input = input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
        
        return input;
    }
    
    // Check for security threats
    checkSecurity(input) {
        // Check for SQL injection patterns
        if (this.patterns.sqlInjection.test(input)) {
            return { isValid: false, error: 'Invalid characters detected' };
        }
        
        // Check for XSS patterns
        if (this.patterns.xssPatterns.test(input)) {
            return { isValid: false, error: 'Invalid characters detected' };
        }
        
        // Check for excessive length (potential DoS)
        if (input.length > 10000) {
            return { isValid: false, error: 'Input too long' };
        }
        
        return { isValid: true };
    }
    
    // Email validation
    validateEmail(email) {
        if (!email) {
            return { isValid: false, error: 'Email is required' };
        }
        
        if (email.length > this.maxLengths.email) {
            return { isValid: false, error: 'Email address too long' };
        }
        
        if (!this.patterns.email.test(email)) {
            return { isValid: false, error: 'Please enter a valid email address' };
        }
        
        // Check for common disposable email domains
        const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
        const domain = email.split('@')[1];
        if (disposableDomains.includes(domain)) {
            return { isValid: false, error: 'Please use a permanent email address' };
        }
        
        return { isValid: true, sanitizedValue: email };
    }
    
    // Phone validation
    validatePhone(phone) {
        if (!phone) {
            return { isValid: true, sanitizedValue: '' }; // Phone is optional
        }
        
        // Remove common formatting characters
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        
        if (cleanPhone.length > this.maxLengths.phone) {
            return { isValid: false, error: 'Phone number too long' };
        }
        
        if (!this.patterns.phone.test(cleanPhone)) {
            return { isValid: false, error: 'Please enter a valid phone number' };
        }
        
        return { isValid: true, sanitizedValue: cleanPhone };
    }
    
    // URL validation
    validateUrl(url) {
        if (!url) {
            return { isValid: true, sanitizedValue: '' }; // URL is optional
        }
        
        if (url.length > this.maxLengths.url) {
            return { isValid: false, error: 'URL too long' };
        }
        
        if (!this.patterns.url.test(url)) {
            return { isValid: false, error: 'Please enter a valid URL (must start with http:// or https://)' };
        }
        
        return { isValid: true, sanitizedValue: url };
    }
    
    // Name validation
    validateName(name) {
        if (!name) {
            return { isValid: false, error: 'Name is required' };
        }
        
        if (name.length > this.maxLengths.name) {
            return { isValid: false, error: 'Name too long' };
        }
        
        if (name.length < 2) {
            return { isValid: false, error: 'Name must be at least 2 characters' };
        }
        
        if (!this.patterns.name.test(name)) {
            return { isValid: false, error: 'Name contains invalid characters' };
        }
        
        return { isValid: true, sanitizedValue: name };
    }
    
    // Message validation
    validateMessage(message, maxLength = this.maxLengths.message) {
        if (!message) {
            return { isValid: false, error: 'Message is required' };
        }
        
        if (message.length > maxLength) {
            return { isValid: false, error: `Message too long (max ${maxLength} characters)` };
        }
        
        if (message.length < 10) {
            return { isValid: false, error: 'Message must be at least 10 characters' };
        }
        
        return { isValid: true, sanitizedValue: message };
    }
    
    // Required field validation
    validateRequired(input) {
        if (!input || input.trim() === '') {
            return { isValid: false, error: 'This field is required' };
        }
        
        return { isValid: true, sanitizedValue: input };
    }
    
    // Alphanumeric validation
    validateAlphanumeric(input) {
        if (!input) {
            return { isValid: false, error: 'This field is required' };
        }
        
        if (!this.patterns.alphanumeric.test(input)) {
            return { isValid: false, error: 'Only letters, numbers, and spaces are allowed' };
        }
        
        return { isValid: true, sanitizedValue: input };
    }
    
    // Numeric validation
    validateNumeric(input) {
        if (!input) {
            return { isValid: false, error: 'This field is required' };
        }
        
        if (!this.patterns.numeric.test(input)) {
            return { isValid: false, error: 'Only numbers are allowed' };
        }
        
        return { isValid: true, sanitizedValue: input };
    }
    
    // Generic validation with custom options
    validateGeneric(input, options = {}) {
        const {
            required = false,
            minLength = 0,
            maxLength = 1000,
            pattern = null,
            customMessage = 'Invalid input'
        } = options;
        
        if (required && (!input || input.trim() === '')) {
            return { isValid: false, error: 'This field is required' };
        }
        
        if (input && input.length < minLength) {
            return { isValid: false, error: `Minimum length is ${minLength} characters` };
        }
        
        if (input && input.length > maxLength) {
            return { isValid: false, error: `Maximum length is ${maxLength} characters` };
        }
        
        if (pattern && input && !pattern.test(input)) {
            return { isValid: false, error: customMessage };
        }
        
        return { isValid: true, sanitizedValue: input };
    }
    
    // Validate entire form
    validateForm(formData, schema) {
        const results = {};
        const errors = [];
        
        for (const [field, rules] of Object.entries(schema)) {
            const value = formData[field];
            const validation = this.validate(value, rules.type, rules.options);
            
            results[field] = validation;
            
            if (!validation.isValid) {
                errors.push(`${field}: ${validation.error}`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            results
        };
    }
    
    // Rate limiting helper
    checkRateLimit(identifier, maxAttempts = 5, timeWindow = 900000) { // 15 minutes
        const now = Date.now();
        const key = `rate_limit_${identifier}`;
        
        let attempts = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Remove old attempts outside time window
        attempts = attempts.filter(timestamp => now - timestamp < timeWindow);
        
        if (attempts.length >= maxAttempts) {
            return { 
                isAllowed: false, 
                error: 'Too many attempts. Please try again later.' 
            };
        }
        
        // Add current attempt
        attempts.push(now);
        localStorage.setItem(key, JSON.stringify(attempts));
        
        return { isAllowed: true };
    }
}

// Create global instance
window.inputValidator = new InputValidator();

// Provide convenient global functions
window.validateInput = function(input, type, options) {
    return window.inputValidator.validate(input, type, options);
};

window.sanitizeInput = function(input) {
    return window.inputValidator.sanitize(input);
};

window.validateForm = function(formData, schema) {
    return window.inputValidator.validateForm(formData, schema);
};

window.checkRateLimit = function(identifier, maxAttempts, timeWindow) {
    return window.inputValidator.checkRateLimit(identifier, maxAttempts, timeWindow);
};

console.log('Input Validator initialized - Enhanced security validation enabled'); 