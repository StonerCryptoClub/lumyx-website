/**
 * Enhanced Cards Interactive System for Lumyx.co
 * Handles scroll animations, 3D tilt, cursor tracking, and touch interactions
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detect touch device
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  // Configuration
  const CONFIG = {
    tiltAngleLimit: 8, // degrees
    tiltSmoothness: 0.1,
    glowUpdateThrottle: 16, // ~60fps
    scrollThreshold: 0.15, // 15% of card must be visible
    magneticStrength: 0.15,
    enableMagnetic: false // Set to true to enable magnetic effect
  };

  // ================================
  // Utility Functions
  // ================================

  /**
   * Throttle function calls
   */
  function throttle(func, delay) {
    let timeoutId;
    let lastExec = 0;
    
    return function(...args) {
      const elapsed = Date.now() - lastExec;
      
      const execute = () => {
        lastExec = Date.now();
        func.apply(this, args);
      };
      
      if (elapsed > delay) {
        execute();
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(execute, delay - elapsed);
      }
    };
  }

  /**
   * Get element's bounding rect with caching
   */
  function getCardBounds(element) {
    if (!element._cachedBounds || Date.now() - element._boundsTimestamp > 100) {
      element._cachedBounds = element.getBoundingClientRect();
      element._boundsTimestamp = Date.now();
    }
    return element._cachedBounds;
  }

  /**
   * Calculate cursor position relative to card center
   */
  function getRelativePosition(event, element) {
    const bounds = getCardBounds(element);
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    return {
      x: ((event.clientX - centerX) / bounds.width) * 2,
      y: ((event.clientY - centerY) / bounds.height) * 2,
      centerX,
      centerY
    };
  }

  // ================================
  // Scroll Animation (Intersection Observer)
  // ================================

  function initScrollAnimations() {
    if (prefersReducedMotion) {
      // Skip animations, just show cards
      document.querySelectorAll('.service-card, .industry-card').forEach(card => {
        card.classList.add('animate-in');
      });
      return;
    }

    const observerOptions = {
      threshold: CONFIG.scrollThreshold,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
          entry.target.classList.add('animate-in');
          // Unobserve after animating to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.service-card, .industry-card').forEach(card => {
      observer.observe(card);
    });
  }

  // ================================
  // 3D Tilt Effect (Desktop Only)
  // ================================

  function init3DTilt() {
    if (prefersReducedMotion || isTouchDevice) return;

    const cards = document.querySelectorAll('.service-card, .industry-card');
    
    cards.forEach(card => {
      card.classList.add('tilt-enabled');
      let tiltX = 0;
      let tiltY = 0;

      const handleMouseMove = throttle((e) => {
        const pos = getRelativePosition(e, card);
        
        // Calculate target tilt angles
        const targetTiltX = -pos.y * CONFIG.tiltAngleLimit;
        const targetTiltY = pos.x * CONFIG.tiltAngleLimit;
        
        // Smooth interpolation
        tiltX += (targetTiltX - tiltX) * CONFIG.tiltSmoothness;
        tiltY += (targetTiltY - tiltY) * CONFIG.tiltSmoothness;
        
        // Apply via CSS variables
        requestAnimationFrame(() => {
          card.style.setProperty('--tiltX', `${tiltY}deg`);
          card.style.setProperty('--tiltY', `${tiltX}deg`);
        });
      }, CONFIG.glowUpdateThrottle);

      const handleMouseLeave = () => {
        // Smooth return to neutral
        requestAnimationFrame(() => {
          card.style.setProperty('--tiltX', '0deg');
          card.style.setProperty('--tiltY', '0deg');
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  // ================================
  // Dynamic Glow/Spotlight Effect
  // ================================

  function initDynamicGlow() {
    if (prefersReducedMotion || isTouchDevice) return;

    const cards = document.querySelectorAll('.service-card, .industry-card');
    
    cards.forEach(card => {
      const handleMouseMove = throttle((e) => {
        const bounds = getCardBounds(card);
        const x = ((e.clientX - bounds.left) / bounds.width) * 100;
        const y = ((e.clientY - bounds.top) / bounds.height) * 100;
        
        requestAnimationFrame(() => {
          card.style.setProperty('--x', `${x}%`);
          card.style.setProperty('--y', `${y}%`);
        });
      }, CONFIG.glowUpdateThrottle);

      card.addEventListener('mousemove', handleMouseMove);
    });
  }

  // ================================
  // Icon Microinteractions
  // ================================

  function initIconAnimations() {
    // Already handled via CSS, but we can add SVG path animations here if needed
    const icons = document.querySelectorAll('.service-icon svg, .industry-card .emoji');
    
    // Optional: Add draw animation for SVG icons
    icons.forEach(icon => {
      if (icon.tagName === 'svg') {
        const paths = icon.querySelectorAll('path');
        paths.forEach(path => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length;
          
          // Trigger draw on scroll-in
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                path.style.transition = 'stroke-dashoffset 1s ease-out';
                path.style.strokeDashoffset = '0';
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.5 });
          
          observer.observe(icon);
        });
      }
    });
  }

  // ================================
  // Mobile Touch Interactions
  // ================================

  function initTouchInteractions() {
    if (!isTouchDevice) return;

    const cards = document.querySelectorAll('.service-card, .industry-card');
    
    cards.forEach(card => {
      let touchActivated = false;

      card.addEventListener('touchstart', (e) => {
        if (!touchActivated) {
          e.preventDefault();
          card.classList.add('touch-active');
          touchActivated = true;
          
          // Show glow at touch point
          const touch = e.touches[0];
          const bounds = card.getBoundingClientRect();
          const x = ((touch.clientX - bounds.left) / bounds.width) * 100;
          const y = ((touch.clientY - bounds.top) / bounds.height) * 100;
          
          card.style.setProperty('--x', `${x}%`);
          card.style.setProperty('--y', `${y}%`);
          
          // Reset after delay
          setTimeout(() => {
            card.classList.remove('touch-active');
            touchActivated = false;
          }, 300);
        }
      }, { passive: false });

      // Allow second tap to follow link
      card.addEventListener('click', (e) => {
        if (touchActivated) {
          // Let the click through
          touchActivated = false;
        }
      });
    });
  }

  // ================================
  // Optional: Magnetic Attraction Effect
  // ================================

  function initMagneticEffect() {
    if (!CONFIG.enableMagnetic || prefersReducedMotion || isTouchDevice) return;

    const containers = document.querySelectorAll('.services-overview > .container');
    
    containers.forEach(container => {
      const cards = container.querySelectorAll('.service-card, .industry-card');
      
      const handleMouseMove = throttle((e) => {
        cards.forEach(card => {
          const bounds = getCardBounds(card);
          const centerX = bounds.left + bounds.width / 2;
          const centerY = bounds.top + bounds.height / 2;
          
          const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
          const maxDistance = 200; // pixels
          
          if (distance < maxDistance) {
            const strength = (1 - distance / maxDistance) * CONFIG.magneticStrength;
            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;
            
            card.classList.add('magnetic-active');
            card.style.setProperty('--magnetX', `${deltaX}px`);
            card.style.setProperty('--magnetY', `${deltaY}px`);
          } else {
            card.classList.remove('magnetic-active');
            card.style.setProperty('--magnetX', '0px');
            card.style.setProperty('--magnetY', '0px');
          }
        });
      }, CONFIG.glowUpdateThrottle);

      container.addEventListener('mousemove', handleMouseMove);
      
      container.addEventListener('mouseleave', () => {
        cards.forEach(card => {
          card.classList.remove('magnetic-active');
          card.style.setProperty('--magnetX', '0px');
          card.style.setProperty('--magnetY', '0px');
        });
      });
    });
  }

  // ================================
  // Performance: Invalidate cached bounds on resize/scroll
  // ================================

  function setupBoundsCache() {
    const cards = document.querySelectorAll('.service-card, .industry-card');
    
    const invalidateCache = throttle(() => {
      cards.forEach(card => {
        delete card._cachedBounds;
        delete card._boundsTimestamp;
      });
    }, 100);

    window.addEventListener('resize', invalidateCache);
    window.addEventListener('scroll', invalidateCache, { passive: true });
  }

  // ================================
  // Initialization
  // ================================

  function init() {
    // Check if cards exist on page
    const hasCards = document.querySelector('.service-card, .industry-card');
    if (!hasCards) return;

    // Mark sections as loaded to prevent flash
    document.querySelectorAll('.services-overview').forEach(section => {
      section.classList.add('cards-loaded');
    });

    // Initialize all features
    initScrollAnimations();
    init3DTilt();
    initDynamicGlow();
    initIconAnimations();
    initTouchInteractions();
    initMagneticEffect();
    setupBoundsCache();

    // Log initialization (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('✨ Enhanced Cards System Initialized', {
        reducedMotion: prefersReducedMotion,
        touchDevice: isTouchDevice,
        cardsCount: document.querySelectorAll('.service-card, .industry-card').length
      });
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page visibility changes (pause animations when hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause expensive operations
      document.querySelectorAll('.service-card, .industry-card').forEach(card => {
        card.style.transition = 'none';
      });
    } else {
      // Resume
      document.querySelectorAll('.service-card, .industry-card').forEach(card => {
        card.style.transition = '';
      });
    }
  });

})();

