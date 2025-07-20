/**
 * Advanced Performance Optimization for TBT Reduction - 2025 Edition
 * Targets 90+ PageSpeed scores with aggressive TBT optimization
 */

class AdvancedPerformanceOptimizer {
  constructor() {
    this.isInitialized = false;
    this.taskQueue = [];
    this.isProcessingTasks = false;
    this.loadedResources = new Set();
    this.performanceMetrics = {};
    
    this.init();
  }

  /**
   * Initialize performance optimizations with TBT focus
   */
  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Ultra-aggressive task scheduling
    this.setupTaskScheduler();
    
    // Advanced lazy loading with intersection observer
    this.initIntersectionObservers();
    
    // Yield-based script loading
    this.setupYieldBasedLoading();
    
    // Performance monitoring
    this.initPerformanceMonitoring();
    
    // Critical CSS optimization
    this.optimizeCriticalCSS();
    
    // Advanced image optimization
    this.initAdvancedImageOptimization();
    
    // Service worker for aggressive caching
    this.initServiceWorker();
  }

  /**
   * Advanced task scheduler using the new Scheduler API with fallbacks
   */
  setupTaskScheduler() {
    this.scheduleTask = (callback, priority = 'user-blocking') => {
      // Use new Scheduler API if available
      if ('scheduler' in window && 'postTask' in window.scheduler) {
        return window.scheduler.postTask(callback, { priority });
      }
      
      // Fallback to yield-based execution
      return this.yieldToMain(callback);
    };

    this.scheduleBackgroundTask = (callback) => {
      return this.scheduleTask(callback, 'background');
    };

    this.scheduleUserVisibleTask = (callback) => {
      return this.scheduleTask(callback, 'user-visible');
    };
  }

  /**
   * Yield to main thread to prevent blocking
   */
  async yieldToMain(callback) {
    return new Promise(resolve => {
      // Use MessageChannel for faster yielding than setTimeout
      const channel = new MessageChannel();
      channel.port2.onmessage = () => {
        try {
          const result = callback();
          resolve(result);
        } catch (error) {
          console.error('Task execution error:', error);
          resolve(null);
        }
      };
      channel.port1.postMessage(null);
    });
  }

  /**
   * Break large tasks into smaller chunks with yielding
   */
  async processTasksInChunks(tasks, chunkSize = 5) {
    const results = [];
    
    for (let i = 0; i < tasks.length; i += chunkSize) {
      const chunk = tasks.slice(i, i + chunkSize);
      
      // Process chunk
      const chunkResults = await Promise.all(
        chunk.map(task => this.scheduleBackgroundTask(task))
      );
      
      results.push(...chunkResults);
      
      // Yield to main thread between chunks
      if (i + chunkSize < tasks.length) {
        await this.yieldToMain(() => {});
      }
    }
    
    return results;
  }

  /**
   * Ultra-aggressive intersection observers for lazy loading
   */
  initIntersectionObservers() {
    // Calendly with massive root margin for earlier loading
    this.calendlyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadCalendlyOptimized();
          this.calendlyObserver.disconnect();
        }
      });
    }, { 
      rootMargin: '500px',
      threshold: 0.1
    });

    // Generic lazy loading for all images and iframes
    this.lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.scheduleBackgroundTask(() => {
            const element = entry.target;
            if (element.dataset.src) {
              element.src = element.dataset.src;
              element.removeAttribute('data-src');
            }
            if (element.dataset.srcset) {
              element.srcset = element.dataset.srcset;
              element.removeAttribute('data-srcset');
            }
            this.lazyObserver.unobserve(element);
          });
        }
      });
    }, { rootMargin: '50px' });

    // Observe booking section immediately
    document.addEventListener('DOMContentLoaded', () => {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        this.calendlyObserver.observe(bookingSection);
      }

      // Observe all lazy images
      document.querySelectorAll('[data-src]').forEach(img => {
        this.lazyObserver.observe(img);
      });
    });
  }

  /**
   * Optimized Calendly loading with chunked execution
   */
  async loadCalendlyOptimized() {
    if (this.loadedResources.has('calendly')) return;
    this.loadedResources.add('calendly');

    // Task 1: Load script asynchronously
    await this.scheduleBackgroundTask(() => {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.defer = true;
      
      // Add loading indicator
      script.onload = () => {
        this.scheduleBackgroundTask(() => this.initializeCalendlyWidget());
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Calendly widget with error handling
   */
  async initializeCalendlyWidget() {
    let attempts = 0;
    const maxAttempts = 30;

    const tryInit = async () => {
      if (typeof window.Calendly !== 'undefined') {
        await this.scheduleUserVisibleTask(() => {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/cadenbuiting6/30min',
            parentElement: document.getElementById('calendly-container'),
            prefill: {},
            utm: {},
            styles: { height: '650px' }
          });
        });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryInit, 100);
      }
    };

    tryInit();
  }

  /**
   * Yield-based script loading for better TBT
   */
  setupYieldBasedLoading() {
    const criticalScripts = [
      'js/env-loader.js',
      'js/html-sanitizer.js',
      'js/input-validator.js'
    ];

    const nonCriticalScripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
      'https://apis.google.com/js/api.js',
      'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js',
      'https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js'
    ];

    // Load critical scripts immediately but with yielding
    document.addEventListener('DOMContentLoaded', async () => {
      await this.loadScriptsWithYielding(criticalScripts, 'user-visible');
    });

    // Load non-critical scripts on interaction
    this.setupInteractionBasedLoading(nonCriticalScripts);
  }

  /**
   * Load scripts with yielding between each load
   */
  async loadScriptsWithYielding(scripts, priority = 'background') {
    const loadTasks = scripts.map(src => () => {
      return new Promise((resolve, reject) => {
        if (this.loadedResources.has(src)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          this.loadedResources.add(src);
          resolve();
        };
        script.onerror = reject;
        
        document.head.appendChild(script);
      });
    });

    await this.processTasksInChunks(loadTasks, 2);
  }

  /**
   * Setup interaction-based loading with multiple triggers
   */
  setupInteractionBasedLoading(scripts) {
    let scriptsLoaded = false;
    
    const loadScripts = async () => {
      if (scriptsLoaded) return;
      scriptsLoaded = true;
      
      await this.loadScriptsWithYielding(scripts, 'background');
    };

    // Multiple interaction triggers
    const events = ['click', 'scroll', 'keydown', 'touchstart', 'mousemove', 'wheel'];
    
    events.forEach(event => {
      document.addEventListener(event, loadScripts, { 
        once: true, 
        passive: true,
        capture: true
      });
    });

    // Reduced timeout for faster loading
    setTimeout(loadScripts, 1500);
  }

  /**
   * Advanced performance monitoring with TBT focus
   */
  initPerformanceMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor long tasks for TBT optimization
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          this.performanceMetrics.longTasks = this.performanceMetrics.longTasks || [];
          this.performanceMetrics.longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
          
          // Break up long tasks in the future
          if (entry.duration > 100) {
            console.warn(`Long task detected: ${entry.duration}ms - consider breaking this up`);
          }
        }
      }
    });

    // Monitor Core Web Vitals
    const vitalsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.performanceMetrics[entry.name] = entry.value;
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      vitalsObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (e) {
      console.warn('Performance observer not fully supported');
    }
  }

  /**
   * Optimize critical CSS loading
   */
  optimizeCriticalCSS() {
    // Preload critical CSS asynchronously
    const criticalStyles = [
      'css/main.css',
      'css/styles.css'
    ];

    criticalStyles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = function() {
        this.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }

  /**
   * Advanced image optimization with WebP detection
   */
  initAdvancedImageOptimization() {
    // WebP support detection
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    if (supportsWebP()) {
      document.documentElement.classList.add('webp');
    }

    // Optimize all images with loading="lazy"
    document.addEventListener('DOMContentLoaded', () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
      });
    });
  }

  /**
   * Initialize service worker for aggressive caching
   */
  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          await navigator.serviceWorker.register('/service-worker.js');
        } catch (error) {
          console.warn('Service Worker registration failed:', error);
        }
      });
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return this.performanceMetrics;
  }
}

// Initialize performance optimizer
if (typeof window !== 'undefined') {
  window.performanceOptimizer = new AdvancedPerformanceOptimizer();
}

export default AdvancedPerformanceOptimizer; 