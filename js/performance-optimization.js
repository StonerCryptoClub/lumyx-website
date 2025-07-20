/**
 * Website Performance Optimization
 * Enhanced for better PageSpeed scores and Core Web Vitals
 * Safe optimizations that preserve all functionality
 */

// Performance monitoring
const perfData = {
  start: performance.now(),
  metrics: {}
};

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Immediate performance fixes
  hidePageLoader();
  optimizeImages();
  preventLayoutShift();
  
  // Defer non-critical operations
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      optimizeThirdPartyScripts();
      preloadCriticalResources();
      trackPerformance();
    });
  } else {
    setTimeout(() => {
      optimizeThirdPartyScripts();
      preloadCriticalResources();
      trackPerformance();
    }, 1000);
  }
});

// Hide page loader immediately
function hidePageLoader() {
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    loader.style.display = 'none';
  }
}

// Optimize all images with lazy loading and proper attributes
function optimizeImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading="lazy" if not already set and not above fold
    if (!img.getAttribute('loading') && !img.closest('.hero-section')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add error handling
    img.addEventListener('error', function() {
      console.warn('Image failed to load:', this.src);
      this.style.display = 'none';
    });
    
    // Prevent layout shift by setting dimensions
    if (!img.getAttribute('width') && !img.getAttribute('height')) {
      img.style.aspectRatio = 'auto';
    }
  });
}

// Prevent layout shift by reserving space
function preventLayoutShift() {
  // Reserve space for dynamic content
  const portfolioContainer = document.querySelector('#portfolio-grid');
  if (portfolioContainer && !portfolioContainer.hasAttribute('data-optimized')) {
    portfolioContainer.style.minHeight = '400px';
    portfolioContainer.setAttribute('data-optimized', 'true');
  }
  
  const caseStudiesContainer = document.querySelector('#case-studies-grid');
  if (caseStudiesContainer && !caseStudiesContainer.hasAttribute('data-optimized')) {
    caseStudiesContainer.style.minHeight = '600px';
    caseStudiesContainer.setAttribute('data-optimized', 'true');
  }
}

// Optimize third-party scripts loading
function optimizeThirdPartyScripts() {
  // Defer Calendly until interaction
  let calendlyLoaded = false;
  function loadCalendly() {
    if (calendlyLoaded) return;
    calendlyLoaded = true;
    
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }
  
  // Load Calendly on scroll or after 5 seconds
  let scrollLoaded = false;
  window.addEventListener('scroll', () => {
    if (!scrollLoaded && window.scrollY > 500) {
      scrollLoaded = true;
      loadCalendly();
    }
  }, { passive: true });
  
  setTimeout(loadCalendly, 5000);
}

// Preload critical resources
function preloadCriticalResources() {
  const criticalResources = [
    { href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap', as: 'style' },
    { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', as: 'style' }
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Track performance metrics safely
function trackPerformance() {
  try {
    // Track Core Web Vitals
    if (typeof PerformanceObserver !== 'undefined') {
      // Track Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        perfData.metrics.lcp = lcpEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Track First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          perfData.metrics.fid = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });
    }
    
    // Basic load time tracking
    window.addEventListener('load', () => {
      perfData.metrics.loadTime = performance.now() - perfData.start;
      console.log('Page Performance:', perfData.metrics);
    });
    
  } catch (error) {
    console.warn('Performance tracking error:', error);
  }
}

// Enhanced error handling for better user experience
window.addEventListener('error', function(e) {
  console.warn('Script error caught:', e.error);
  // Don't break the page for minor errors
  e.preventDefault();
});

// Optimize scroll performance
let scrollTimeout;
window.addEventListener('scroll', function() {
  if (scrollTimeout) return;
  
  scrollTimeout = setTimeout(() => {
    scrollTimeout = null;
    // Perform scroll-based optimizations here
  }, 16); // ~60fps
}, { passive: true });

// Service Worker registration for caching (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/public/service-worker.js')
      .catch(() => {
        // Silently fail if service worker not available
      });
  });
}

console.log('✅ Performance optimizations loaded - preserving all functionality'); 