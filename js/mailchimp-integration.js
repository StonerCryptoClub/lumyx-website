/**
 * Mailchimp Newsletter Integration - 2025
 * This script ensures all newsletter forms use the correct eepurl URL
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mailchimp configuration
  const EEPURL_LINK = 'https://eepurl.com/jdPU6E';
  
  // Simple version - just make sure all forms have the correct eepurl link
  function updateMailchimpForms() {
    console.log('Updating forms to use eepurl link:', EEPURL_LINK);
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
      // Skip if already processed by form-fix.js
      if (form.dataset.processed === 'true') return;
      
      // Make sure it points to the correct URL
      form.action = EEPURL_LINK;
      form.method = 'get';
      form.target = '_blank';
      
      form.dataset.processed = 'true';
    });
    
    console.log('Mailchimp integration: All forms updated to use eepurl link');
  }

  // Update all Mailchimp forms
  updateMailchimpForms();
}); 