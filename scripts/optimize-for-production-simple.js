/**
 * Simplified Production Optimization Script
 * 
 * This script creates a production build without external dependencies
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  outputDir: 'dist',
  htmlFiles: [
    'index.html',
    'blog.html',
    'blog-post.html',
    'blog-launch.html',
    'blog-link-test.html',
    'case-study.html',
    'mailchimp-form-custom.html',
    'mailchimp-thank-you.html',
    '404.html',
    'error.html'
  ]
};

console.log('Starting simplified optimization process...');

// Create output directory
function createOutputDir() {
  if (fs.existsSync(config.outputDir)) {
    fs.rmSync(config.outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.mkdirSync(path.join(config.outputDir, 'css'), { recursive: true });
  fs.mkdirSync(path.join(config.outputDir, 'js'), { recursive: true });
  fs.mkdirSync(path.join(config.outputDir, 'images'), { recursive: true });
  console.log('Created output directory structure');
}

// Copy files
function copyFiles() {
  // Copy CSS files
  const cssDir = 'css';
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    cssFiles.forEach(file => {
      if (file.endsWith('.css')) {
        fs.copyFileSync(path.join(cssDir, file), path.join(config.outputDir, 'css', file));
      }
    });
    console.log('Copied CSS files');
  }

  // Copy JS files
  const jsDir = 'js';
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir);
    jsFiles.forEach(file => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(path.join(jsDir, file), path.join(config.outputDir, 'js', file));
      }
    });
    console.log('Copied JS files');
  }

  // Copy images
  const imagesDir = 'images';
  if (fs.existsSync(imagesDir)) {
    function copyRecursive(src, dest) {
      if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(file => {
          copyRecursive(path.join(src, file), path.join(dest, file));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    copyRecursive(imagesDir, path.join(config.outputDir, 'images'));
    console.log('Copied images');
  }

  // Copy HTML files
  config.htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(config.outputDir, file));
    }
  });
  console.log('Copied HTML files');

  // Copy other important files
  ['robots.txt', 'sitemap.xml', 'Logo.png'].forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(config.outputDir, file));
    }
  });
  console.log('Copied other files');
}

// Main execution
try {
  createOutputDir();
  copyFiles();
  console.log('✅ Optimization complete! Production files are in the dist directory.');
  process.exit(0);
} catch (error) {
  console.error('❌ Error during optimization:', error);
  process.exit(1);
} 