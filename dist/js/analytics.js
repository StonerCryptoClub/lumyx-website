/**
 * Google Analytics Integration
 * Initializes GA4 and sets up event tracking
 */

// Google Analytics 4 Measurement ID - Replace with your actual ID
const GA_MEASUREMENT_ID = 'G-YOUR_ACTUAL_GA4_ID'; // Replace with your GA4 measurement ID from Google Analytics

// Initialize Google Analytics
function initializeAnalytics() {
  // Create script elements
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  
  // Add the script to the document
  document.head.appendChild(gaScript);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
  
  // Make gtag available globally
  window.gtag = gtag;
  
  // Log initialization
  console.log('Google Analytics initialized');
  
  // Set up custom event listeners
  setupEventTracking();
}

// Set up event tracking for important user interactions
function setupEventTracking() {
  // Track form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const formId = this.id || 'unknown-form';
      trackEvent('form_submission', {
        form_id: formId,
        page: window.location.pathname
      });
    });
  });
  
  // Track button clicks
  document.querySelectorAll('button, a.btn, .cta-button, .home-button, .contact-button, .subscribe-button')
    .forEach(button => {
      button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        const buttonId = this.id || 'unknown-button';
        trackEvent('button_click', {
          button_id: buttonId,
          button_text: buttonText,
          page: window.location.pathname
        });
      });
    });
  
  // Track navigation
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const linkText = this.textContent.trim();
      const linkHref = this.getAttribute('href');
      trackEvent('navigation_click', {
        link_text: linkText,
        link_href: linkHref,
        page: window.location.pathname
      });
    });
  });
  
  // Track scroll depth
  let scrollDepthMarks = [25, 50, 75, 90];
  let scrollDepthMarksReached = [];
  
  window.addEventListener('scroll', function() {
    const scrollPercentage = getScrollPercentage();
    
    scrollDepthMarks.forEach(mark => {
      if (scrollPercentage >= mark && !scrollDepthMarksReached.includes(mark)) {
        scrollDepthMarksReached.push(mark);
        trackEvent('scroll_depth', {
          depth_percentage: mark,
          page: window.location.pathname
        });
      }
    });
  });
}

// Helper to track events
function trackEvent(eventName, eventParams = {}) {
  if (window.gtag) {
    gtag('event', eventName, eventParams);
    console.log(`Event tracked: ${eventName}`, eventParams);
  }
}

// Helper to get scroll percentage
function getScrollPercentage() {
  const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPosition = window.scrollY;
  return Math.round((scrollPosition / documentHeight) * 100);
}

// Initialize analytics when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnalytics);

// Export functions for external use
window.trackEvent = trackEvent; 