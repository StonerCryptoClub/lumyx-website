const https = require('https');

// Test fetching a specific blog post by slug
const slug = 'top-7-marketing-automations-2025';
const url = `https://cdn.contentful.com/spaces/74kxarv2y1kp/entries?content_type=blogPost&fields.slug=${slug}&access_token=yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c&include=2`;

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Found blog posts:', response.total);
      
      if (response.items.length > 0) {
        const post = response.items[0];
        console.log('\n--- Blog Post Details ---');
        console.log('Title:', post.fields.title);
        console.log('Slug:', post.fields.slug);
        console.log('Category:', post.fields.category);
        console.log('Publish Date:', post.fields.publishdate);
        console.log('Read Time:', post.fields.readtime);
        console.log('Excerpt:', post.fields.excerpt);
        console.log('\nContent structure:');
        console.log('Content type:', typeof post.fields.content);
        console.log('Content preview:', JSON.stringify(post.fields.content, null, 2).substring(0, 500) + '...');
        
        console.log('\nFeatured Image:');
        if (post.fields.featuredImage) {
          console.log('Featured Image ID:', post.fields.featuredImage.sys.id);
          
          // Check if includes has the asset
          if (response.includes && response.includes.Asset) {
            const asset = response.includes.Asset.find(a => a.sys.id === post.fields.featuredImage.sys.id);
            if (asset) {
              console.log('Image URL:', asset.fields.file.url);
            }
          }
        }
      } else {
        console.log('No blog post found with slug:', slug);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
}).on('error', (error) => {
  console.error('Error:', error);
}); 