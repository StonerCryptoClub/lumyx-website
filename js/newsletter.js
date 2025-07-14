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