/* js/meta-pixel-events.js */
// Meta Pixel Event Tracking

// Track when someone starts the booking process
function trackBookingStart() {
    console.log('Tracking booking start');
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            content_category: 'Booking',
            content_name: 'Strategy Call'
        });
    }
}

// Track when a booking is completed
async function trackBookingComplete(eventData) {
    console.log('Tracking booking completion:', eventData);
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Schedule', {
            content_category: 'Booking',
            content_name: 'Strategy Call',
            currency: 'USD',
            value: 0.00,
            predicted_ltv: 0.00
        });
    }

    // Store booking in database
    if (eventData && eventData.event) {
        const event = eventData.event;
        const invitee = eventData.invitee || {};
        
        try {
            const bookingData = {
                email: invitee.email,
                name: invitee.name,
                phone: invitee.phone || null,
                date: new Date(event.start_time).toISOString().split('T')[0],
                time: new Date(event.start_time).toLocaleTimeString('en-US', { hour12: false }),
                callType: 'Strategy Call',
                eventId: event.uuid,
                notes: invitee.questions_and_responses || null
            };

            console.log('Storing booking data:', bookingData);
            
            if (typeof window.addBooking === 'function') {
                const result = await window.addBooking(bookingData);
                console.log('Booking storage result:', result);
                
                if (!result.success) {
                    console.error('Failed to store booking:', result.error);
                }
            } else {
                console.error('addBooking function not available');
            }
        } catch (error) {
            console.error('Error processing booking:', error);
        }
    } else {
        console.error('Invalid event data:', eventData);
    }
}

// Track when contact form is submitted
function trackContactSubmit() {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
    }
}

// Track when someone views the pricing section
function trackPricingView() {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_category: 'Pricing',
            content_name: 'Services Pricing'
        });
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing event listeners');
    
    // Track booking events
    const calendlyContainer = document.getElementById('calendly-container');
    if (calendlyContainer) {
        console.log('Found Calendly container, setting up event listeners');
        
        // Track when Calendly widget loads
        window.addEventListener('calendly.event_scheduled', function(e) {
            console.log('Calendly event scheduled:', e.data);
            trackBookingComplete(e.data);
        });

        // Track when someone clicks to start booking
        calendlyContainer.addEventListener('click', function() {
            trackBookingStart();
        });
    } else {
        console.error('Calendly container not found');
    }

    // Track contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            trackContactSubmit();
        });
    }

    // Track pricing section view
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackPricingView();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(pricingSection);
    }
}); 

/* js/newsletter.js */
// Simple newsletter styling 
document.addEventListener('DOMContentLoaded', function() {
  console.log('Newsletter script loaded - simple styling only');
  
  // Apply custom styling to form inputs on focus
  const newsletterInputs = document.querySelectorAll('.newsletter-form input');
  newsletterInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.classList.remove('focused');
      
      // Add validation styling
      if (this.checkValidity()) {
        this.classList.add('valid');
        this.classList.remove('invalid');
      } else if (this.value) {
        this.classList.add('invalid');
        this.classList.remove('valid');
      }
    });
  });
}); 

/* js/form-validation.js */
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

/* js/form-fix.js */
// This script ensures forms submit directly to Mailchimp without creating popups
document.addEventListener('DOMContentLoaded', function() {
  // Main script functionality
  console.log('Simple form fix applied - no popups');
  
  // Fix the existing forms only
  const allNewsletterForms = document.querySelectorAll('.newsletter-form');
  
  allNewsletterForms.forEach(form => {
    // Make sure the form uses the correct eepurl link
    form.setAttribute('action', 'https://eepurl.com/jdPU6E');
    form.setAttribute('method', 'get');
    form.setAttribute('target', '_blank');
    
    // Make sure email field has correct name
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.setAttribute('name', 'EMAIL');
    }
    
    // Make sure name field has correct name
    const nameInput = form.querySelector('input[type="text"]');
    if (nameInput) {
      nameInput.setAttribute('name', 'FNAME');
    }
    
    // Add redirect parameter to form if it doesn't exist
    let redirectInput = form.querySelector('input[name="redirect"]');
    if (!redirectInput) {
      redirectInput = document.createElement('input');
      redirectInput.setAttribute('type', 'hidden');
      redirectInput.setAttribute('name', 'redirect');
      // Use absolute URL for the redirect to Lumyx.co
      redirectInput.setAttribute('value', 'https://lumyx.co/mailchimp-thank-you.html');
      form.appendChild(redirectInput);
      console.log('Added redirect parameter to form pointing to custom thank you page.');
    }
    
    // Add event listener to prevent scrolling issues
    form.addEventListener('submit', function(e) {
      // Just log the submission - don't manipulate the form behavior
      console.log('Form submitting to Mailchimp via eepurl link...');
    });
  });
  
  console.log('All newsletter forms updated to use eepurl.com link. Forms should now submit correctly.');
});

// Fix email overflow in contact section
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the DOM to be fully loaded
  // Apply additional styling to email address
  const emailElement = document.querySelector('.email-address');
  
  if (emailElement) {
    // Make sure the element exists
    emailElement.style.wordBreak = 'break-all';
    emailElement.style.wordWrap = 'break-word';
    emailElement.style.overflowWrap = 'anywhere';
    emailElement.style.maxWidth = '100%';
    emailElement.style.whiteSpace = 'nowrap';
    emailElement.style.textOverflow = 'ellipsis';
    emailElement.style.overflow = 'hidden';
    emailElement.style.display = 'inline-block';
    
    // For mobile devices
    if (window.innerWidth <= 768) {
      emailElement.style.fontSize = '0.9rem';
      emailElement.style.maxWidth = '95%';
    }
    
    // For very small devices
    if (window.innerWidth <= 480) {
      emailElement.style.fontSize = '0.85rem';
      emailElement.style.letterSpacing = '-0.5px';
      emailElement.style.maxWidth = '90%';
    }
    
    // Additional fix for parent container
    const contactItem = emailElement.closest('.contact-item');
    if (contactItem) {
      contactItem.style.maxWidth = '100%';
      contactItem.style.overflow = 'hidden';
    }
  }
  
  // Ensure contact items adjust properly on resize
  window.addEventListener('resize', function() {
    if (emailElement) {
      if (window.innerWidth <= 480) {
        emailElement.style.fontSize = '0.85rem';
        emailElement.style.letterSpacing = '-0.5px';
        emailElement.style.maxWidth = '90%';
      } else if (window.innerWidth <= 768) {
        emailElement.style.fontSize = '0.9rem';
        emailElement.style.letterSpacing = 'normal';
        emailElement.style.maxWidth = '95%';
      } else {
        emailElement.style.fontSize = '1rem';
        emailElement.style.letterSpacing = 'normal';
        emailElement.style.maxWidth = '100%';
      }
    }
  });
}); 

/* js/performance-optimization.js */
/**
 * Website Performance Optimization
 * This script improves page load times and handles common errors
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Ensure the page loader is removed immediately
  hidePageLoader();
  
  // Fix for known console errors
  fixCommonErrors();
  
  // Optimize images loading
  lazyLoadImages();
  
  // Defer non-critical operations
  requestIdleCallback(() => {
    optimizeThirdPartyScripts();
  });
  
  // Force hide any loader after 1 second regardless of page load status
  setTimeout(hidePageLoader, 1000);
});

// Hide the page loader
function hidePageLoader() {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    pageLoader.style.display = 'none';
  }
  
  // Also ensure content is visible
  const container = document.querySelector('.container');
  if (container) {
    container.style.display = 'block';
    container.style.opacity = '1';
  }
}

// Fix common errors that appear in console
function fixCommonErrors() {
  // Prevent errors for missing case-studies-loader.js
  window.caseStudiesLoaded = window.caseStudiesLoaded || function() {};
  
  // Handle any Calendly errors
  window.addEventListener('error', function(e) {
    if (e.message && (e.message.includes('Calendly') || e.message.includes('calendar'))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

// Lazy load images to improve performance
function lazyLoadImages() {
  // Use native lazy loading where supported
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
  
  // Simple lazy loading for images with data-src
  const images = document.querySelectorAll('img[data-src]');
  if (images.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.removeAttribute('data-src');
          };
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Optimize third-party scripts loading
function optimizeThirdPartyScripts() {
  // Delay loading of non-critical third-party scripts
  const thirdPartyScripts = [
    { src: 'https://assets.calendly.com/assets/external/widget.js', async: true, defer: true },
    { src: 'https://connect.facebook.net/en_US/fbevents.js', async: true, defer: true }
  ];
  
  thirdPartyScripts.forEach(script => {
    // Check if script is already loaded
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      const scriptEl = document.createElement('script');
      scriptEl.src = script.src;
      if (script.async) scriptEl.async = true;
      if (script.defer) scriptEl.defer = true;
      document.body.appendChild(scriptEl);
    }
  });
}

// Use requestIdleCallback with fallback
const requestIdleCallback = window.requestIdleCallback || 
  function(cb) {
    const start = Date.now();
    return setTimeout(function() {
      cb({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

// Window load event - final check to ensure everything is shown
window.addEventListener('load', function() {
  hidePageLoader();
}); 

/* js/animations.js */
// Animation utilities
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        // Stop observing after first animation to prevent re-triggering
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => observer.observe(element));
};

class AnimationManager {
  constructor() {
    this.initSectionReveal();
    this.initServiceCards();
    this.initValueCards();
    this.initSmoothScroll();
    this.initProcessContainers();
    this.initTestimonialReveal();
  }

  initSectionReveal() {
    const sections = document.querySelectorAll('.section-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));
  }

  initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
  }

  initValueCards() {
    const cards = document.querySelectorAll('.value-card');
    cards.forEach(card => {
      const icon = card.querySelector('.value-icon i');
      if (icon) {
        card.addEventListener('mouseenter', () => {
          icon.style.transform = 'scale(1.1)';
          icon.style.color = 'var(--primary-orange)';
        });
        card.addEventListener('mouseleave', () => {
          icon.style.transform = 'scale(1)';
          icon.style.color = '';
        });
      }
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initProcessContainers() {
    const containers = document.querySelectorAll('.process-container');
    containers.forEach(container => {
      container.addEventListener('mouseenter', () => {
        container.style.borderColor = 'var(--primary-orange)';
        container.style.backgroundColor = 'rgba(47, 69, 255, 0.03)';
      });
      container.addEventListener('mouseleave', () => {
        container.style.borderColor = '';
        container.style.backgroundColor = '';
      });
    });
  }

  initTestimonialReveal() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    testimonials.forEach(testimonial => observer.observe(testimonial));
  }
}

// Mouse parallax effect
const initMouseParallax = () => {
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 20;
    const yPos = (clientY / window.innerHeight - 0.5) * 20;

    const elements = document.querySelectorAll('.floating-element');
    elements.forEach((el, index) => {
      const speed = 1 - (index * 0.1);
      el.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
    });
  });
};

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
  // Add dynamic background
  const dynamicBg = document.createElement('div');
  dynamicBg.className = 'dynamic-bg';
  document.body.prepend(dynamicBg);

  // Initialize all animations
  animateOnScroll();
  new AnimationManager();
  initMouseParallax();
}); 

