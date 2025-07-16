# Deployment Checklist

## Pre-Deployment Optimization

- [x] Add resource preloading for critical assets
- [x] Create production build script for minification
- [x] Optimize JavaScript files
- [x] Update performance optimization script
- [x] Configure Netlify deployment settings

## Final Checks Before Deployment

- [ ] Run the optimization script: `node scripts/optimize-for-production.js`
- [ ] Test the optimized site locally: `npx serve dist`
- [ ] Verify all pages load correctly
- [ ] Check mobile responsiveness
- [ ] Ensure all forms work properly
- [ ] Verify Calendly integration
- [ ] Test newsletter subscription

## Performance Verification

- [ ] Run Lighthouse audit (aim for scores > 90)
- [ ] Check Core Web Vitals:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Test page load speed on mobile networks

## Deployment Steps

1. Install required optimization tools:
   ```
   npm install -g terser clean-css-cli imagemin-cli
   ```

2. Run the optimization script:
   ```
   node scripts/optimize-for-production.js
   ```

3. Test the optimized build locally:
   ```
   npx serve dist
   ```

4. Deploy to Netlify using one of these methods:
   - Connect GitHub repository to Netlify for automatic deployments
   - Use Netlify CLI: `netlify deploy --prod`
   - Drag and drop the `dist` folder to Netlify's manual deploy area

5. After deployment, verify:
   - Site loads correctly
   - Forms work properly
   - All links function
   - Calendly integration works
   - Newsletter subscription works

## Post-Deployment

- [ ] Set up custom domain (if not already configured)
- [ ] Enable HTTPS (automatic with Netlify)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up monitoring (optional)
- [ ] Test site on multiple browsers and devices

## Ongoing Maintenance

- Regular content updates
- Performance monitoring
- Security updates
- Analytics review
- Backup strategy

## Rollback Plan

If issues are detected after deployment:
1. Identify the problem
2. Fix locally and test
3. Re-deploy or rollback to previous version in Netlify dashboard

## Troubleshooting Local vs. Production Environment Issues

If you encounter differences between local development and production environments, check the following:

### Path Issues
- **Relative Paths**: Always use relative paths with `./` prefix for local resources (e.g., `./case-study.html` instead of `/case-study.html` or `case-study.html`)
- **Image Paths**: Ensure image paths work in both environments by using relative paths

### CORS Issues
- **API Requests**: Local development may face CORS restrictions when making API calls
- **Solution**: Use a CORS proxy for local development or ensure your API endpoints have proper CORS headers
- **Testing**: Test API calls with browser developer tools to identify CORS errors

### API Keys and Environment Variables
- **Environment Variables**: Ensure all necessary environment variables are set in both environments
- **API Keys**: Check that API keys are valid and have proper permissions
- **Contentful Space**: Verify that the Contentful space ID and access tokens are correct

### Browser Cache
- **Hard Refresh**: Use Ctrl+F5 (Windows) or Cmd+Shift+R (Mac) to perform a hard refresh
- **Incognito Mode**: Test in an incognito/private window to rule out cache issues
- **Clear Cache**: Clear browser cache and cookies if needed

### Local Server Setup
- **Run a proper local server**: Use `npx serve` or similar instead of opening files directly
- **Port Conflicts**: Ensure no port conflicts with other services

### Content Loading
- **Check Console**: Always check browser console (F12) for specific error messages
- **Network Tab**: Monitor network requests to identify failed requests
- **Fallbacks**: Implement proper fallbacks for when content can't be loaded

### JavaScript Errors
- **Browser Compatibility**: Ensure your code works in all target browsers
- **Polyfills**: Add necessary polyfills for older browsers
- **Error Handling**: Implement proper error handling for asynchronous operations

By addressing these common issues, you can ensure consistent behavior between local development and production environments. 