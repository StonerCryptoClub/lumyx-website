/**
 * Performance Optimization Script - 2025 Edition
 * Optimized for Core Web Vitals and 90+ PageSpeed scores
 */

// Performance observer to monitor Core Web Vitals
class PerformanceMonitor {
  constructor() {
    this.initObservers();
    this.optimizeImages();
    this.optimizeInteractions();
    this.scheduleNonCriticalTasks();
  }

  initObservers() {
    // Monitor LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('LCP:', entry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              console.log('CLS:', entry.value);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Monitor INP (Interaction to Next Paint)
        const inpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('INP:', entry.duration);
          }
        });
        inpObserver.observe({ entryTypes: ['event'] });
      } catch (e) {
        console.log('Performance monitoring not supported');
      }
    }
  }

  optimizeImages() {
    // Implement intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the actual image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
            }
            
            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            // Remove loading class and observer
            img.classList.remove('loading');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Load images 50px before they enter viewport
        threshold: 0.01
      });

      // Observe all images with data-src
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
      });
    }
  }

  optimizeInteractions() {
    // Debounce scroll events for better INP
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        // Batch DOM updates
        requestAnimationFrame(() => {
          this.updateVisibleElements();
        });
        scrollTimeout = null;
      }, 16); // ~60fps
    };

    // Use passive listeners for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
  }

  updateVisibleElements() {
    // Fade in elements as they become visible
    const elements = document.querySelectorAll('.fade-in:not(.visible)');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight * 0.8) {
        element.classList.add('visible');
      }
    });
  }

  scheduleNonCriticalTasks() {
    // Use scheduler.postTask if available, fallback to setTimeout
    const scheduleTask = (task, priority = 'background') => {
      if ('scheduler' in window && 'postTask' in window.scheduler) {
        return window.scheduler.postTask(task, { priority });
      } else if ('requestIdleCallback' in window) {
        return requestIdleCallback(task);
      } else {
        return setTimeout(task, 0);
      }
    };

    // Schedule non-critical animations
    scheduleTask(() => {
      document.body.classList.add('animations-ready');
    });

    // Preload next likely navigation
    scheduleTask(() => {
      this.preloadLikelyPages();
    });
  }

  preloadLikelyPages() {
    // Preload pages user is likely to visit
    const likelyPages = ['/blog.html', '/case-study.html'];
    
    likelyPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }

  // Break up long tasks to prevent blocking
  breakUpLongTask(task, chunkSize = 5) {
    return new Promise((resolve) => {
      let index = 0;
      
      const processChunk = () => {
        const end = Math.min(index + chunkSize, task.length);
        
        for (let i = index; i < end; i++) {
          if (typeof task === 'function') {
            task(i);
          }
        }
        
        index = end;
        
        if (index < task.length) {
          setTimeout(processChunk, 0); // Yield to browser
        } else {
          resolve();
        }
      };
      
      processChunk();
    });
  }

  // Optimize third-party script loading
  loadThirdPartyScript(src, priority = 'low') {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      if (priority === 'low') {
        // Load after other tasks
        setTimeout(() => {
          document.head.appendChild(script);
        }, 100);
      } else {
        document.head.appendChild(script);
      }
      
      script.onload = resolve;
      script.onerror = reject;
    });
  }
}

// Resource hints for critical assets
function addResourceHints() {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
    { rel: 'dns-prefetch', href: '//apis.google.com' },
    { rel: 'preconnect', href: 'https://connect.facebook.net' },
    { rel: 'preconnect', href: 'https://www.googletagmanager.com' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.rel === 'preconnect') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  // Add resource hints immediately
  addResourceHints();
  
  // Initialize performance monitor
  const monitor = new PerformanceMonitor();
  
  // Set up service worker for caching (if supported)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
});

// Export for use in other scripts
window.PerformanceOptimizer = {
  monitor: null,
  init() {
    this.monitor = new PerformanceMonitor();
    return this.monitor;
  },
  preloadImage(src) {
    const img = new Image();
    img.src = src;
  },
  defer(fn, delay = 0) {
    setTimeout(fn, delay);
  }
}; 