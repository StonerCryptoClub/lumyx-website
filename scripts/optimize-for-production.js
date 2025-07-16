/**
 * Production Optimization Script
 * 
 * This script:
 * 1. Combines and minifies JavaScript files
 * 2. Minifies CSS files
 * 3. Optimizes images
 * 4. Creates a production-ready build
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Ensure dist directory exists
function ensureDistDirectory() {
    const distPath = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }
    return distPath;
}

// Copy files to dist directory
function copyFiles() {
    const sourceDir = path.join(__dirname, '..');
    const distDir = ensureDistDirectory();
    
    console.log('Copying files to dist directory...');
    
    // Files to copy
    const filesToCopy = [
        'index.html',
        'blog.html',
        'case-study.html',
        'blog-post.html',
        'blog-launch.html',
        'blog-link-test.html',
        'super-simple-blog-test.html',
        'error.html',
        '404.html',
        'robots.txt',
        'sitemap.xml',
        'serve.json',
        'netlify.toml',
        'calendly-integration.js',
        'contentful-loader.js',
        'mailchimp-form-custom.html',
        'mailchimp-thank-you.html',
        'newsletter-popup.html',
        'portfolio-section.html'
    ];
    
    // Copy individual files
    filesToCopy.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(distDir, file);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copied ${file}`);
        } else {
            console.warn(`File not found: ${file}`);
        }
    });
    
    // Copy directories
    const dirsToCopy = [
        'css',
        'js',
        'images',
        'case-studies',
        'sections',
        'templates',
        'public'
    ];
    
    dirsToCopy.forEach(dir => {
        const sourceDir = path.join(__dirname, '..', dir);
        const destDir = path.join(distDir, dir);
        
        if (fs.existsSync(sourceDir)) {
            copyDirectory(sourceDir, destDir);
            console.log(`Copied directory: ${dir}`);
        } else {
            console.warn(`Directory not found: ${dir}`);
        }
    });
}

// Recursively copy directory
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Minify JavaScript files
function minifyJavaScript() {
    console.log('Minifying JavaScript files...');
    
    const jsDir = path.join(__dirname, '..', 'dist', 'js');
    if (!fs.existsSync(jsDir)) {
        console.warn('JavaScript directory not found');
        return;
    }
    
    const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
    
    jsFiles.forEach(file => {
        const filePath = path.join(jsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Simple minification: remove comments and extra whitespace
        content = content
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
        
        fs.writeFileSync(filePath, content);
        console.log(`Minified ${file}`);
    });
}

// Minify CSS files
function minifyCSS() {
    console.log('Minifying CSS files...');
    
    const cssDir = path.join(__dirname, '..', 'dist', 'css');
    if (!fs.existsSync(cssDir)) {
        console.warn('CSS directory not found');
        return;
    }
    
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    
    cssFiles.forEach(file => {
        const filePath = path.join(cssDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Simple CSS minification
        content = content
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
            .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
            .replace(/;\s*/g, ';') // Remove spaces after semicolon
            .trim();
        
        fs.writeFileSync(filePath, content);
        console.log(`Minified ${file}`);
    });
}

// Main build function
function build() {
    console.log('Starting production build...');
    
    try {
        // Copy files to dist
        copyFiles();
        
        // Minify JavaScript
        minifyJavaScript();
        
        // Minify CSS
        minifyCSS();
        
        console.log('Production build completed successfully!');
        console.log('Files are ready in the dist/ directory');
        
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// Run build if script is executed directly
if (require.main === module) {
    build();
}

module.exports = {
    build,
    copyFiles,
    minifyJavaScript,
    minifyCSS
}; 