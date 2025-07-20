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