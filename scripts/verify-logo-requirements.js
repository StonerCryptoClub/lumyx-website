/**
 * Logo Requirements Verification Script
 * 
 * This script helps verify that your logo meets Google's requirements
 * for appearing in Knowledge Graph search results.
 */

const fs = require('fs');
const path = require('path');

function checkLogoFile() {
  console.log('\n🔍 Verifying Logo Requirements for Google Knowledge Graph...\n');
  
  const logoPath = path.join(__dirname, '..', 'Logo.png');
  
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Logo.png not found in root directory');
    return false;
  }
  
  const stats = fs.statSync(logoPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  
  console.log(`✅ Logo file found: Logo.png`);
  console.log(`📁 File size: ${fileSizeKB} KB`);
  
  // Check if file size is reasonable (not too large)
  if (stats.size > 2 * 1024 * 1024) { // 2MB limit
    console.warn('⚠️  Logo file is quite large. Consider optimizing for web.');
  }
  
  console.log('\n📋 Google Logo Requirements Checklist:');
  console.log('□ Logo should be square (1:1 aspect ratio)');
  console.log('□ Minimum size: 160x160 pixels');
  console.log('□ Maximum size: 1920x1920 pixels');
  console.log('□ Recommended size: 512x512 pixels (current schema setting)');
  console.log('□ Format: PNG, JPG, or WebP');
  console.log('□ Accessible via HTTPS');
  console.log('□ Clear, high-contrast design');
  console.log('□ Represents your brand well');
  
  console.log('\n🔧 To verify dimensions, you can:');
  console.log('1. Right-click Logo.png → Properties → Details');
  console.log('2. Use online tools like TinyPNG to optimize size');
  console.log('3. Ensure it\'s square (width = height)');
  
  return true;
}

function checkStructuredData() {
  console.log('\n🔍 Checking Structured Data Configuration...\n');
  
  const indexPath = path.join(__dirname, '..', 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found');
    return false;
  }
  
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Check for structured data
  if (content.includes('@type": "Organization"')) {
    console.log('✅ Organization schema markup found');
  } else {
    console.error('❌ Organization schema markup missing');
    return false;
  }
  
  // Check for logo in structured data
  if (content.includes('"logo": {')) {
    console.log('✅ Logo included in structured data');
  } else {
    console.error('❌ Logo missing from structured data');
    return false;
  }
  
  // Check for consistent domain
  const domainMatches = content.match(/https:\/\/lumyx\.co/g);
  if (domainMatches && domainMatches.length > 0) {
    console.log('✅ Consistent domain usage found');
  } else {
    console.warn('⚠️  Check domain consistency across all files');
  }
  
  return true;
}

function displayNextSteps() {
  console.log('\n🚀 Next Steps for Google Knowledge Graph:\n');
  
  console.log('1. 📝 Google Search Console Setup:');
  console.log('   • Visit https://search.google.com/search-console');
  console.log('   • Add your property: https://lumyx.co');
  console.log('   • Verify ownership (HTML file or DNS)');
  console.log('   • Submit sitemap: https://lumyx.co/sitemap.xml');
  
  console.log('\n2. 🔍 Submit for Indexing:');
  console.log('   • Request indexing for your homepage');
  console.log('   • Monitor coverage reports');
  console.log('   • Check for mobile usability issues');
  
  console.log('\n3. 🏗️ Build Brand Authority:');
  console.log('   • Get mentioned on other websites');
  console.log('   • Ensure consistent NAP (Name, Address, Phone)');
  console.log('   • Build quality backlinks');
  console.log('   • Create Google My Business listing');
  
  console.log('\n4. 🔄 Monitor & Wait:');
  console.log('   • Check Google Search Console weekly');
  console.log('   • Monitor brand searches');
  console.log('   • Knowledge Graph updates can take 2-8 weeks');
  
  console.log('\n📊 Testing Tools:');
  console.log('   • Rich Results Test: https://search.google.com/test/rich-results');
  console.log('   • Schema Markup Validator: https://validator.schema.org');
  console.log('   • Google Search Console: https://search.google.com/search-console');
}

// Run the verification
if (require.main === module) {
  console.log('🔍 GOOGLE KNOWLEDGE GRAPH LOGO VERIFICATION');
  console.log('=' .repeat(50));
  
  const logoOK = checkLogoFile();
  const schemaOK = checkStructuredData();
  
  if (logoOK && schemaOK) {
    console.log('\n✅ All basic requirements met!');
    displayNextSteps();
  } else {
    console.log('\n❌ Some issues need to be addressed first.');
  }
  
  console.log('\n=' .repeat(50));
  console.log('💡 Tip: Run this script regularly to verify your setup');
}

module.exports = { checkLogoFile, checkStructuredData, displayNextSteps }; 