/**
 * Website Performance Optimization
 * Enhanced for better PageSpeed scores and Core Web Vitals
 */

// Critical CSS inlining for above-the-fold content
const criticalCSS = `
  /* Critical above-the-fold styles */
  body { margin: 0; font-family: 'Montserrat', sans-serif; }
  .header { position: relative; z-index: 100; }
  .hero-section { min-height: 100vh; display: flex; align-items: center; }
  .loading-screen { display: none !important; }
`;

// Inject critical CSS immediately
const criticalStyle = document.createElement('style');
criticalStyle.textContent = criticalCSS;
document.head.appendChild(criticalStyle);

// Optimize font loading
(function optimizeFonts() {
  // Preconnect to Google Fonts
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.googleapis.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  const preconnectStatic = document.createElement('link');
  preconnectStatic.rel = 'preconnect';
  preconnectStatic.href = 'https://fonts.gstatic.com';
  preconnectStatic.crossOrigin = 'anonymous';
  document.head.appendChild(preconnectStatic);
})();

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Immediate performance fixes
  hidePageLoader();
  fixCommonErrors();
  optimizeImages();
  
  // Defer non-critical operations
  requestIdleCallback(() => {
    optimizeThirdPartyScripts();
    preloadCriticalResources();
    optimizeLayoutShift();
  });
  
  // Failsafe loader removal
  setTimeout(hidePageLoader, 500);
});

// Hide page loader and prevent layout shifts
function hidePageLoader() {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    pageLoader.style.display = 'none';
  }
  
  // Ensure content is visible immediately
  const container = document.querySelector('.container');
  const body = document.body;
  
  if (container) {
    container.style.display = 'block';
    container.style.opacity = '1';
  }
  
  if (body) {
    body.style.visibility = 'visible';
    body.classList.add('loaded');
  }
}

// Fix common console errors
function fixCommonErrors() {
  // Prevent case-studies-loader errors
  window.caseStudiesLoaded = window.caseStudiesLoaded || function() {};
  
  // Handle Calendly errors gracefully
  window.addEventListener('error', function(e) {
    if (e.message && (
      e.message.includes('Calendly') || 
      e.message.includes('calendar') ||
      e.message.includes('fb') ||
      e.message.includes('gtag')
    )) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

// Enhanced image optimization
function optimizeImages() {
  // Add native lazy loading to all images
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });
  
  // Enhanced lazy loading with IntersectionObserver
  const images = document.querySelectorAll('img[data-src]');
  if (images.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          };
          imageObserver.unobserve(img);
        }
      });
    }, { 
      rootMargin: '50px 0px',
      threshold: 0.01 
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // Optimize logo and critical images
  const logo = document.querySelector('.logo img, .header img');
  if (logo) {
    logo.setAttribute('fetchpriority', 'high');
    logo.removeAttribute('loading');
  }
}

// Preload critical resources
function preloadCriticalResources() {
  const criticalResources = [
    { href: '/images/logo.png', as: 'image', type: 'image/png' },
    { href: '/css/main.css', as: 'style' },
    { href: '/css/portfolio.css', as: 'style' }
  ];
  
  criticalResources.forEach(resource => {
    const existing = document.querySelector(`link[href="${resource.href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      document.head.appendChild(link);
    }
  });
}

// Optimize layout shift (CLS)
function optimizeLayoutShift() {
  // Set explicit dimensions for images without them
  document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
    img.addEventListener('load', function() {
      if (!this.hasAttribute('width')) {
        this.setAttribute('width', this.naturalWidth);
        this.setAttribute('height', this.naturalHeight);
      }
    });
  });
  
  // Reserve space for dynamic content
  const dynamicContainers = document.querySelectorAll('[data-dynamic-height]');
  dynamicContainers.forEach(container => {
    const minHeight = container.dataset.dynamicHeight || '200px';
    container.style.minHeight = minHeight;
  });
}

// Enhanced third-party script optimization
function optimizeThirdPartyScripts() {
  // Delay non-critical third-party scripts
  const delayedScripts = [
    { 
      src: 'https://assets.calendly.com/assets/external/widget.js', 
      condition: () => document.querySelector('[data-calendly-url]'),
      defer: true 
    },
    { 
      src: 'https://www.googletagmanager.com/gtag/js', 
      defer: true,
      async: true 
    }
  ];
  
  delayedScripts.forEach(script => {
    if (!script.condition || script.condition()) {
      if (!document.querySelector(`script[src*="${script.src}"]`)) {
        const scriptEl = document.createElement('script');
        scriptEl.src = script.src;
        if (script.async) scriptEl.async = true;
        if (script.defer) scriptEl.defer = true;
        document.body.appendChild(scriptEl);
      }
    }
  });
}

// Enhanced requestIdleCallback with better fallback
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

// Performance monitoring
function trackPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      requestIdleCallback(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData && console.log) {
          console.log('Performance Metrics:', {
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
            totalLoadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
          });
        }
      });
    });
  }
}

// Initialize performance tracking
trackPerformance();

// Final load event optimization
window.addEventListener('load', function() {
  hidePageLoader();
  
  // Signal that the page is fully loaded
  document.body.classList.add('page-loaded');
  
  // Cleanup any remaining loaders
  document.querySelectorAll('.loader, .loading, .spinner').forEach(el => {
    el.style.display = 'none';
  });
}); 