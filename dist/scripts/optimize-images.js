// Image optimization script
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');

// Create WebP versions of images
async function convertToWebP() {
  console.log('Converting images to WebP format...');
  
  const files = await imagemin(['images/**/*.{jpg,png}'], {
    destination: 'images/webp',
    plugins: [
      imageminWebp({quality: 75})
    ]
  });
  
  console.log(`${files.length} images converted to WebP format`);
}

// Optimize existing images
async function optimizeImages() {
  console.log('Optimizing images...');
  
  // Optimize JPGs
  const jpgs = await imagemin(['images/**/*.jpg', 'images/**/*.jpeg'], {
    destination: 'images/optimized',
    plugins: [
      imageminJpegtran()
    ]
  });
  
  // Optimize PNGs
  const pngs = await imagemin(['images/**/*.png'], {
    destination: 'images/optimized',
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });
  
  // Optimize SVGs
  const svgs = await imagemin(['images/**/*.svg'], {
    destination: 'images/optimized',
    plugins: [
      imageminSvgo()
    ]
  });
  
  // Optimize GIFs
  const gifs = await imagemin(['images/**/*.gif'], {
    destination: 'images/optimized',
    plugins: [
      imageminGifsicle()
    ]
  });
  
  const totalOptimized = jpgs.length + pngs.length + svgs.length + gifs.length;
  console.log(`${totalOptimized} images optimized`);
}

// Move optimized images back to their original locations
async function replaceWithOptimized() {
  console.log('Replacing original images with optimized versions...');
  
  const optimizedDir = path.join(__dirname, '..', 'images', 'optimized');
  
  // Check if optimized directory exists
  if (!fs.existsSync(optimizedDir)) {
    console.log('No optimized images found.');
    return;
  }
  
  // Walk through the optimized directory
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        // Get the relative path from the optimized directory
        const relativePath = path.relative(optimizedDir, filePath);
        
        // Construct the original file path
        const originalPath = path.join(__dirname, '..', 'images', relativePath);
        
        // Create directory if it doesn't exist
        const originalDir = path.dirname(originalPath);
        if (!fs.existsSync(originalDir)) {
          fs.mkdirSync(originalDir, { recursive: true });
        }
        
        // Copy the optimized file to the original location
        fs.copyFileSync(filePath, originalPath);
      }
    });
  }
  
  walkDir(optimizedDir);
  console.log('Replacement complete.');
}

// Run the optimization process
async function run() {
  try {
    await optimizeImages();
    await convertToWebP();
    await replaceWithOptimized();
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

run(); 