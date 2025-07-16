# Website Performance Checklist

## Tools to Use
- [ ] Google PageSpeed Insights (https://pagespeed.web.dev/)
- [ ] Lighthouse in Chrome DevTools
- [ ] WebPageTest (https://www.webpagetest.org/)
- [ ] GTmetrix (https://gtmetrix.com/)

## Performance Metrics to Check
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Total Blocking Time (TBT) < 200ms

## Optimization Areas

### Images
- [ ] All images are properly compressed
- [ ] WebP format is used with fallbacks
- [ ] Proper image dimensions (not oversized)
- [ ] Lazy loading implemented for below-the-fold images
- [ ] Responsive images using srcset

### JavaScript
- [ ] Minified and bundled
- [ ] Unused code removed
- [ ] Third-party scripts loaded asynchronously
- [ ] Critical JS inlined
- [ ] Non-critical JS deferred

### CSS
- [ ] Minified and bundled
- [ ] Critical CSS inlined
- [ ] Non-critical CSS loaded asynchronously
- [ ] Unused CSS removed

### Fonts
- [ ] Web fonts optimized
- [ ] Font display set to swap
- [ ] Limited font variations

### Server
- [ ] GZIP/Brotli compression enabled
- [ ] Browser caching properly configured
- [ ] CDN used for static assets
- [ ] DNS prefetching for external domains

### HTML
- [ ] Minified HTML
- [ ] Proper document structure
- [ ] No render-blocking resources

## Action Items
1. Run Lighthouse audit on all key pages
2. Document performance scores
3. Prioritize issues based on impact
4. Implement fixes
5. Re-test to verify improvements 