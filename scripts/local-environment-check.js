/**
 * Local Environment Check Script
 * 
 * This script checks for common issues that can cause differences between
 * local development and production environments.
 */

// Check if running in Node.js environment
if (typeof window === 'undefined') {
    console.log('Running environment checks in Node.js...');
    runNodeChecks();
} else {
    console.log('Running environment checks in browser...');
    runBrowserChecks();
}

/**
 * Node.js environment checks
 */
function runNodeChecks() {
    const fs = require('fs');
    const path = require('path');
    
    console.log('\n=== CHECKING FOR COMMON ISSUES ===\n');
    
    // Check for .env file
    if (!fs.existsSync('.env')) {
        console.warn('⚠️ .env file not found. This may cause issues with environment variables.');
        console.log('   SOLUTION: Create a .env file based on .env.example');
    } else {
        console.log('✅ .env file found');
    }
    
    // Check for absolute paths in HTML files
    console.log('\nChecking for absolute paths in HTML files...');
    const htmlFiles = findFiles('.', '.html');
    let absolutePathsFound = false;
    
    htmlFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const absolutePaths = content.match(/href=["']\/(.*?)["']/g) || [];
        const absoluteSrcPaths = content.match(/src=["']\/(.*?)["']/g) || [];
        
        if (absolutePaths.length > 0 || absoluteSrcPaths.length > 0) {
            absolutePathsFound = true;
            console.warn(`⚠️ Absolute paths found in ${file}:`);
            
            absolutePaths.forEach(path => {
                console.log(`   - ${path}`);
            });
            
            absoluteSrcPaths.forEach(path => {
                console.log(`   - ${path}`);
            });
        }
    });
    
    if (!absolutePathsFound) {
        console.log('✅ No absolute paths found in HTML files');
    }
    
    // Check for absolute paths in JS files
    console.log('\nChecking for absolute paths in JS files...');
    const jsFiles = findFiles('.', '.js');
    absolutePathsFound = false;
    
    jsFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const absolutePaths = content.match(/["']\/(.*?)["']/g) || [];
        
        if (absolutePaths.length > 0) {
            absolutePathsFound = true;
            console.warn(`⚠️ Potential absolute paths found in ${file}:`);
            
            absolutePaths.forEach(path => {
                // Exclude common patterns that are not file paths
                if (!path.includes('//') && !path.includes('/*')) {
                    console.log(`   - ${path}`);
                }
            });
        }
    });
    
    if (!absolutePathsFound) {
        console.log('✅ No absolute paths found in JS files');
    }
    
    // Check for API keys in public files
    console.log('\nChecking for exposed API keys...');
    const allFiles = [...htmlFiles, ...jsFiles];
    let apiKeysFound = false;
    
    const apiKeyPatterns = [
        /['"](sk_live_[0-9a-zA-Z]{24})['"]/g, // Stripe Secret Key
        /['"](pk_live_[0-9a-zA-Z]{24})['"]/g, // Stripe Public Key
        /['"](AIza[0-9A-Za-z-_]{35})['"]/g,   // Google API Key
        /['"](AKIA[0-9A-Z]{16})['"]/g,        // AWS Access Key
    ];
    
    allFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        apiKeyPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                apiKeysFound = true;
                console.warn(`⚠️ Potential API key found in ${file}`);
            }
        });
    });
    
    if (!apiKeysFound) {
        console.log('✅ No exposed API keys found');
    }
    
    console.log('\n=== ENVIRONMENT CHECK COMPLETE ===\n');
    
    if (absolutePathsFound || apiKeysFound) {
        console.log('⚠️ Issues were found that may cause problems between local and production environments.');
        console.log('   Please review the warnings above and fix them before deploying.');
    } else {
        console.log('✅ No common issues found. Your environment should work consistently in both local and production.');
    }
}

/**
 * Browser environment checks
 */
function runBrowserChecks() {
    console.log('\n=== CHECKING FOR COMMON ISSUES ===\n');
    
    // Check for CORS issues
    console.log('Checking for CORS issues...');
    fetch('./api/health-check')
        .then(response => {
            console.log('✅ Local API requests working properly');
        })
        .catch(error => {
            console.warn('⚠️ CORS issue detected with local API requests:', error);
            console.log('   SOLUTION: Ensure your API has proper CORS headers or use a CORS proxy for development');
        });
    
    // Check for Contentful configuration
    console.log('\nChecking Contentful configuration...');
    if (window.contentfulClient) {
        console.log('✅ Contentful client initialized');
    } else {
        console.warn('⚠️ Contentful client not initialized');
        console.log('   SOLUTION: Check that Contentful space ID and access tokens are correctly set');
    }
    
    // Check for browser compatibility issues
    console.log('\nChecking for browser compatibility issues...');
    const compatibilityIssues = [];
    
    if (!window.fetch) {
        compatibilityIssues.push('fetch API not supported');
    }
    
    if (!window.Promise) {
        compatibilityIssues.push('Promises not supported');
    }
    
    if (!Array.prototype.includes) {
        compatibilityIssues.push('Array.includes not supported');
    }
    
    if (compatibilityIssues.length > 0) {
        console.warn('⚠️ Browser compatibility issues detected:');
        compatibilityIssues.forEach(issue => {
            console.log(`   - ${issue}`);
        });
        console.log('   SOLUTION: Add polyfills for these features or use a tool like Babel');
    } else {
        console.log('✅ No browser compatibility issues detected');
    }
    
    console.log('\n=== ENVIRONMENT CHECK COMPLETE ===\n');
}

/**
 * Helper function to find files with a specific extension
 */
function findFiles(dir, extension) {
    const fs = require('fs');
    const path = require('path');
    let results = [];
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
            results = results.concat(findFiles(filePath, extension));
        } else if (file.endsWith(extension)) {
            results.push(filePath);
        }
    });
    
    return results;
}

// Export for Node.js
if (typeof module !== 'undefined') {
    module.exports = { runNodeChecks, runBrowserChecks };
} 