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