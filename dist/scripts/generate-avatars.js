const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure testimonials directory exists
const testimonialsDir = path.join(__dirname, '..', 'images', 'testimonials');
if (!fs.existsSync(testimonialsDir)) {
  fs.mkdirSync(testimonialsDir, { recursive: true });
}

// Configuration
const avatars = [
  { name: 'alex', letter: 'A', colors: ['#FFA500', '#FF6B00'] },
  { name: 'maria', letter: 'M', colors: ['#1E90FF', '#00CED1'] },
  { name: 'james', letter: 'J', colors: ['#FFA500', '#1E90FF'] }
];

// Create avatars
avatars.forEach(avatar => {
  // Create canvas
  const size = 200;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Create circular clipping path
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, avatar.colors[0]);
  gradient.addColorStop(1, avatar.colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Add letter
  ctx.fillStyle = 'white';
  ctx.font = 'bold 100px Montserrat, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(avatar.letter, size/2, size/2);
  
  // Save to file
  const outputPath = path.join(testimonialsDir, `${avatar.name}.jpg`);
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Created ${outputPath}`);
});

console.log('All avatars generated successfully!'); 