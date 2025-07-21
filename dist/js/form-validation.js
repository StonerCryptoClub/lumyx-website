/**
 * Form Validation Script
 * Provides comprehensive validation for all forms on the site
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get all forms on the page
  const forms = document.querySelectorAll('form');
  
  // Apply validation to each form
  forms.forEach(form => {
    // Skip forms with 'novalidate' attribute
    if (form.getAttribute('novalidate') === 'true') return;
    
    // Add validation event listeners
    setupFormValidation(form);
  });
  
  // Initialize specific form types if they exist
  initContactForm();
  initNewsletterForm();
});

/**
 * Set up form validation for a specific form
 * @param {HTMLFormElement} form - The form element to validate
 */
function setupFormValidation(form) {
  const inputs = form.querySelectorAll('input, textarea, select');
  
  // Add input validation listeners
  inputs.forEach(input => {
    // Skip hidden inputs
    if (input.type === 'hidden') return;
    
    // Validate on blur
    input.addEventListener('blur', function() {
      validateInput(this);
    });
    
    // Remove error styling on input
    input.addEventListener('input', function() {
      this.classList.remove('invalid');
      
      // Find and hide error message
      const errorElement = this.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    });
  });
  
  // Form submission validation
  form.addEventListener('submit', function(e) {
    let isValid = true;
    
    // Validate all inputs
    inputs.forEach(input => {
      if (input.type !== 'hidden' && !validateInput(input)) {
        isValid = false;
      }
    });
    
    // If form is invalid, prevent submission
    if (!isValid) {
      e.preventDefault();
      
      // Scroll to the first invalid input
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Show form-level error message if it exists
      const formError = form.querySelector('.form-error');
      if (formError) {
        formError.textContent = 'Please correct the errors in the form.';
        formError.style.display = 'block';
      }
    } else {
      // Hide form-level error message
      const formError = form.querySelector('.form-error');
      if (formError) {
        formError.style.display = 'none';
      }
      
      // Show loading state if available
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Restore button state after 3 seconds (fallback if AJAX fails)
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }, 3000);
      }
    }
  });
}

/**
 * Validate a single input field
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input - The input to validate
 * @returns {boolean} - Is the input valid
 */
function validateInput(input) {
  // Skip disabled inputs
  if (input.disabled) return true;
  
  // Get validation rules from attributes
  const isRequired = input.hasAttribute('required');
  const minLength = input.getAttribute('minlength');
  const maxLength = input.getAttribute('maxlength');
  const pattern = input.getAttribute('pattern');
  const type = input.type;
  const value = input.value.trim();
  
  // Find or create error message element
  let errorElement = input.parentElement.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    input.parentElement.appendChild(errorElement);
  }
  
  // Initialize as valid
  let isValid = true;
  let errorMessage = '';
  
  // Required field validation
  if (isRequired && value === '') {
    isValid = false;
    errorMessage = 'This field is required';
  }
  // Email validation
  else if (type === 'email' && value !== '' && !validateEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  }
  // URL validation
  else if (type === 'url' && value !== '' && !validateUrl(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid URL';
  }
  // Phone validation
  else if ((type === 'tel' || input.classList.contains('phone-input')) && value !== '' && !validatePhone(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid phone number';
  }
  // Min length validation
  else if (minLength && value.length < parseInt(minLength)) {
    isValid = false;
    errorMessage = `Please enter at least ${minLength} characters`;
  }
  // Max length validation
  else if (maxLength && value.length > parseInt(maxLength)) {
    isValid = false;
    errorMessage = `Please enter no more than ${maxLength} characters`;
  }
  // Pattern validation
  else if (pattern && value !== '' && !new RegExp(pattern).test(value)) {
    isValid = false;
    errorMessage = input.getAttribute('data-pattern-message') || 'Please match the requested format';
  }
  
  // Update input styling
  if (isValid) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  } else {
    input.classList.remove('valid');
    input.classList.add('invalid');
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'block';
  }
  
  return isValid;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is the email valid
 */
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Is the URL valid
 */
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Is the phone number valid
 */
function validatePhone(phone) {
  // Allow different phone formats
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  // Remove spaces, dashes, and parentheses for validation
  const cleanedPhone = phone.replace(/[\s()-]/g, '');
  return re.test(cleanedPhone);
}

/**
 * Initialize the contact form with specific validations
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  // Add form submission handling
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate inputs
    let isValid = true;
    isValid = validateInput(document.getElementById('name')) && isValid;
    isValid = validateInput(document.getElementById('email')) && isValid;
    isValid = validateInput(document.getElementById('message')) && isValid;
    
    if (isValid) {
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Collect form data
      const formData = {
        name: name,
        email: email,
        message: message
      };
      
      // Send form data to backend (using EmailJS or other service)
      sendContactForm(formData)
        .then(response => {
          // Show success message
          showFormSuccess(contactForm, 'Thank you for your message! We will get back to you soon.');
          
          // Reset form
          contactForm.reset();
          
          // Track successful submission
          if (window.trackEvent) {
            window.trackEvent('contact_form_submission', {
              status: 'success'
            });
          }
        })
        .catch(error => {
          // Show error message
          showFormError(contactForm, 'There was an error sending your message. Please try again later or contact us directly.');
          
          // Track form error
          if (window.trackEvent) {
            window.trackEvent('contact_form_submission', {
              status: 'error',
              error: error.message
            });
          }
        })
        .finally(() => {
          // Restore button state
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message';
        });
    }
  });
}

/**
 * Initialize newsletter form with specific validations
 */
function initNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get email input
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;
      
      // Validate email
      if (validateInput(emailInput)) {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        }
        
        // Track newsletter signup
        if (window.trackEvent) {
          window.trackEvent('newsletter_signup', {
            source: 'website_footer'
          });
        }
        
        // Submit to Mailchimp or redirect to signup page
        setTimeout(() => {
          form.submit();
        }, 500);
      }
    });
  });
}

/**
 * Send contact form data to backend
 * @param {Object} formData - The form data to send
 * @returns {Promise} - Promise resolving to the response
 */
function sendContactForm(formData) {
  // Placeholder for actual implementation
  return new Promise((resolve, reject) => {
    // Use EmailJS or other service here
    
    // Simulate API call for now
    setTimeout(() => {
      resolve({ success: true });
      // Uncomment to test error case
      // reject(new Error('Server error'));
    }, 1500);
  });
}

/**
 * Show success message after form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - Success message to display
 */
function showFormSuccess(form, message) {
  // Look for existing success message container
  let successMessage = form.querySelector('.success-message');
  
  // Create success message if it doesn't exist
  if (!successMessage) {
    successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    form.prepend(successMessage);
  }
  
  // Set message and show
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  
  // Scroll to success message
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Hide after 5 seconds
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
}

/**
 * Show error message after form submission failure
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - Error message to display
 */
function showFormError(form, message) {
  // Look for existing form error container
  let errorMessage = form.querySelector('.form-error');
  
  // Create error message if it doesn't exist
  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.className = 'form-error';
    form.prepend(errorMessage);
  }
  
  // Set message and show
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  
  // Scroll to error message
  errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Hide after 5 seconds
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
} 