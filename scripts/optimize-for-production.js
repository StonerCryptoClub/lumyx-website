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

// Load .env file
function loadEnvFile(envPath = '.env') {
    const envConfig = {};
    
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#') && line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=');
                envConfig[key.trim()] = value.trim();
            }
        });
    }
    
    return envConfig;
}

// Inject environment variables
function injectEnvVariables(htmlContent, envConfig) {
    const envScript = `
    <script>
        // Injected environment variables
        window.ENV_CONFIG = {
            supabase: {
                url: '${envConfig.SUPABASE_URL || ''}',
                anonKey: '${envConfig.SUPABASE_ANON_KEY || ''}'
            },
            contentful: {
                spaceId: '${envConfig.CONTENTFUL_SPACE_ID || ''}',
                accessToken: '${envConfig.CONTENTFUL_ACCESS_TOKEN || ''}'
            },
            emailjs: {
                publicKey: '${envConfig.EMAILJS_PUBLIC_KEY || ''}',
                serviceId: '${envConfig.EMAILJS_SERVICE_ID || ''}',
                clientTemplateId: '${envConfig.EMAILJS_CLIENT_TEMPLATE_ID || ''}',
                teamTemplateId: '${envConfig.EMAILJS_TEAM_TEMPLATE_ID || ''}'
            }
        };
    </script>`;
    
    // Inject before the closing head tag
    return htmlContent.replace('</head>', `${envScript}\n</head>`);
}

// Configuration
const config = {
  // JavaScript files to combine and minify
  jsFiles: [
    'js/meta-pixel-events.js',
    'js/newsletter.js',
    'js/form-validation.js',
    'js/form-fix.js',
    'js/performance-optimization.js',
    'js/animations.js'
  ],
  // CSS files to minify
  cssFiles: [
    'css/portfolio.css',
    'css/contact-fixes.css',
    'css/mobile-fixes.css',
    'css/value-card.css'
  ],
  // Output directory
  outputDir: 'dist',
  // HTML files to process
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

// Create output directory if it doesn't exist
function createDirectories() {
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir);
  }
  
  // Create subdirectories
  ['js', 'css', 'images'].forEach(subdir => {
    const dirPath = path.join(config.outputDir, subdir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
}

// Function to combine JavaScript files
function combineJsFiles() {
  console.log('Combining JavaScript files...');
  let combinedJs = '';
  
  config.jsFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      combinedJs += `/* ${file} */\n${content}\n\n`;
      console.log(`Added ${file}`);
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  });
  
  fs.writeFileSync(path.join(config.outputDir, 'js', 'bundle.js'), combinedJs);
  console.log('JavaScript files combined into bundle.js');
}

// Function to minify JavaScript
function minifyJs() {
  console.log('Minifying JavaScript...');
  
  // Use terser for minification (you need to install it: npm install -g terser)
  exec(`terser ${path.join(config.outputDir, 'js', 'bundle.js')} -o ${path.join(config.outputDir, 'js', 'bundle.min.js')} --compress --mangle`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error minifying JavaScript: ${error.message}`);
      console.log('You may need to install terser: npm install -g terser');
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log('JavaScript minified successfully');
  });
}

// Function to minify CSS
function minifyCss() {
  console.log('Minifying CSS...');
  
  config.cssFiles.forEach(file => {
    // Use clean-css for minification (you need to install it: npm install -g clean-css-cli)
    const outputFile = path.join(config.outputDir, 'css', path.basename(file, '.css') + '.min.css');
    
    exec(`cleancss -o ${outputFile} ${file}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error minifying ${file}: ${error.message}`);
        console.log('You may need to install clean-css-cli: npm install -g clean-css-cli');
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`CSS file ${file} minified successfully`);
    });
  });
}

// Function to copy all images
function copyAllImages() {
  console.log('Copying all images...');
  
  // Function to recursively copy directory
  function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.lstatSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcPath} to ${destPath}`);
      }
    });
  }
  
  // Copy entire images directory
  if (fs.existsSync('images')) {
    copyDir('images', path.join(config.outputDir, 'images'));
  }
}

// Function to process HTML files
function processHtmlFiles() {
  console.log('Processing HTML files...');
  
  // Load environment variables
  const envConfig = loadEnvFile();
  console.log('Environment variables loaded for injection');
  
  config.htmlFiles.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      
      // Inject environment variables FIRST
      content = injectEnvVariables(content, envConfig);
      
      // Replace individual JS files with the minified bundle
      config.jsFiles.forEach(jsFile => {
        const jsFileName = path.basename(jsFile);
        content = content.replace(
          new RegExp(`<script src="js/${jsFileName}"></script>`, 'g'),
          ''
        );
      });
      
      // Add the minified bundle before the closing body tag
      content = content.replace(
        '</body>',
        '  <script src="js/bundle.min.js"></script>\n</body>'
      );
      
      // Replace individual CSS files with minified versions
      config.cssFiles.forEach(cssFile => {
        const cssFileName = path.basename(cssFile);
        const minCssFileName = cssFileName.replace('.css', '.min.css');
        content = content.replace(
          `<link rel="stylesheet" href="css/${cssFileName}">`,
          `<link rel="stylesheet" href="css/${minCssFileName}">`
        );
      });
      
      // Write the processed HTML file to the output directory
      fs.writeFileSync(path.join(config.outputDir, file), content);
      console.log(`HTML file ${file} processed with env injection`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  });
}

// Function to copy other files
function copyOtherFiles() {
  console.log('Copying other files...');
  
  // Copy all essential files
  const filesToCopy = [
    'robots.txt',
    'sitemap.xml', 
    'favicon.ico',
    'Logo.png',
    'Logo.png.png',
    'mailchimp-form-custom.html',
    'mailchimp-thank-you.html',
    'mailchimp-redirect-instructions.md',
    'newsletter-popup.html',
    'portfolio-section.html',
    'super-simple-blog-test.html',
    'netlify.toml',
    'serve.json',
    'deployment-checklist.md',
    'README.md'
  ];
  
  filesToCopy.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(config.outputDir, file));
        console.log(`Copied ${file}`);
      } else {
        console.log(`File ${file} doesn't exist, skipping`);
      }
    } catch (err) {
      console.error(`Error copying ${file}:`, err);
    }
  });

  // Explicitly check and copy Logo.png.png
  try {
    if (fs.existsSync('Logo.png.png')) {
      fs.copyFileSync('Logo.png.png', path.join(config.outputDir, 'Logo.png.png'));
      console.log('Explicitly copied Logo.png.png');
    } else {
      console.error('Could not find Logo.png.png in root directory');
    }
  } catch (err) {
    console.error('Error explicitly copying Logo.png.png:', err);
  }
}

// Function to copy ALL JavaScript files
function copyAllJsFiles() {
  console.log('Copying all JavaScript files...');
  
  try {
    if (fs.existsSync('js')) {
      const jsFiles = fs.readdirSync('js');
      
      jsFiles.forEach(file => {
        if (file.endsWith('.js')) {
          const srcPath = path.join('js', file);
          const destPath = path.join(config.outputDir, 'js', file);
          
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied ${srcPath} to ${destPath}`);
        }
      });
    }
  } catch (err) {
    console.error('Error copying JavaScript files:', err);
  }
}

// Function to copy other JavaScript files (legacy)
function copyAdditionalJsFiles() {
  console.log('Copying additional JavaScript files...');
  
  // List of JS files that should be copied individually
  const additionalJsFiles = [
    'js/portfolio-manager.js',
    'js/case-study-loader.js',
    'js/contentful-integration.js',
    'js/calendly-integration.js',
    'js/generate-placeholders.js',
    'js/contentful-client.js',
    'js/content-loader-init.js',
    'js/contentful-loader.js'
  ];
  
  additionalJsFiles.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        const destPath = file.startsWith('js/') 
          ? path.join(config.outputDir, file)
          : path.join(config.outputDir, 'js', path.basename(file));
        
        // Create directory if it doesn't exist
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.copyFileSync(file, destPath);
        console.log(`Copied ${file} to ${destPath}`);
      } else {
        console.log(`File ${file} does not exist, skipping`);
      }
    } catch (err) {
      console.error(`Error copying ${file}:`, err);
    }
  });
}

// Function to copy all CSS files
function copyAllCssFiles() {
  console.log('Copying all CSS files...');
  
  try {
    if (fs.existsSync('css')) {
      const cssFiles = fs.readdirSync('css');
      
      cssFiles.forEach(file => {
        if (file.endsWith('.css')) {
          const srcPath = path.join('css', file);
          const destPath = path.join(config.outputDir, 'css', file);
          
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied ${srcPath} to ${destPath}`);
        }
      });
    }
  } catch (err) {
    console.error('Error copying CSS files:', err);
  }
}

// Function to copy important CSS files
function copyImportantCssFiles() {
  console.log('Copying important CSS files...');
  
  // List of important CSS files
  const importantCssFiles = [
    'css/main.css',
    'css/styles.css',
    'css/style.css',
    'css/global.css'
  ];
  
  importantCssFiles.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        const destPath = path.join(config.outputDir, file);
        
        // Create directory if it doesn't exist
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.copyFileSync(file, destPath);
        console.log(`Copied important CSS file: ${file} to ${destPath}`);
      }
    } catch (err) {
      console.error(`Error copying important CSS file ${file}:`, err);
    }
  });
}

// Function to copy logo and ensure it's available
function copyLogoFiles() {
  console.log('Copying logo files...');

  // Create images directory if it doesn't exist
  const imagesDir = path.join(config.outputDir, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Try multiple potential logo file locations and names
  const potentialLogos = [
    'Logo.png.png',
    'Logo.png',
    'logo.png',
    'images/logo.png',
    'images/Logo.png',
    'images/Logo.png.png'
  ];

  let logoFound = false;
  potentialLogos.forEach(logoPath => {
    try {
      if (fs.existsSync(logoPath)) {
        // Copy to both root and images directory to be safe
        fs.copyFileSync(logoPath, path.join(config.outputDir, path.basename(logoPath)));
        console.log(`Copied ${logoPath} to dist/${path.basename(logoPath)}`);

        // Also copy to images directory
        fs.copyFileSync(logoPath, path.join(imagesDir, path.basename(logoPath)));
        console.log(`Copied ${logoPath} to dist/images/${path.basename(logoPath)}`);
        
        logoFound = true;
      }
    } catch (err) {
      console.error(`Error copying logo ${logoPath}:`, err);
    }
  });

  if (!logoFound) {
    console.warn('Could not find any logo file to copy. Website may display without a logo.');
  }
}

// Function to copy all directories
function copyAllDirectories() {
  console.log('Copying all directories...');
  
  // Function to recursively copy directory
  function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.lstatSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcPath} to ${destPath}`);
      }
    });
  }
  
  // List of directories to copy
  const directoriesToCopy = [
    'case-studies',
    'templates', 
    'scripts',
    'public',
    'sections',
    'e2e'
  ];
  
  directoriesToCopy.forEach(dir => {
    if (fs.existsSync(dir)) {
      copyDir(dir, path.join(config.outputDir, dir));
    }
  });
}

// Function to clear the dist directory
function clearDistDirectory() {
  console.log('Clearing dist directory...');
  
  try {
    if (fs.existsSync(config.outputDir)) {
      const items = fs.readdirSync(config.outputDir);
      
      items.forEach(item => {
        const itemPath = path.join(config.outputDir, item);
        
        if (fs.lstatSync(itemPath).isDirectory()) {
          // Recursively delete directory
          fs.rmdirSync(itemPath, { recursive: true });
        } else {
          // Delete file
          fs.unlinkSync(itemPath);
        }
        
        console.log(`Removed ${itemPath}`);
      });
    }
    
    // Recreate the directory structure
    createDirectories();
    console.log('Recreated directory structure');
  } catch (err) {
    console.error('Error clearing dist directory:', err);
  }
}

// Run the optimization process
function runOptimization() {
  console.log('Starting optimization process...');
  
  // Run each step in sequence
  clearDistDirectory(); // Clear the dist directory first
  createDirectories();  // Ensure directories exist
  
  // Copy all files and directories
  copyAllImages();      // Copy all images including testimonials
  copyAllJsFiles();     // Copy all JavaScript files
  copyAllCssFiles();    // Copy all CSS files
  copyAllDirectories(); // Copy all directories (case-studies, templates, etc.)
  copyOtherFiles();     // Copy individual files (sitemap, robots.txt, etc.)
  copyLogoFiles();      // Ensure logo files are copied
  
  // Process and optimize
  combineJsFiles();
  minifyJs();
  minifyCss();
  copyImportantCssFiles(); // Copy important CSS files
  processHtmlFiles();
  copyAdditionalJsFiles(); // Legacy function for specific files
  
  console.log('Optimization complete! Production files are in the dist directory.');
}

// Start the optimization
runOptimization(); 