import { createClient } from 'contentful';
import { redirect } from 'next/navigation';

// Create Contentful client
const client = createClient({
  space: '74kxarv2y1kp',
  accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
});

export default async function BlogPage() {
  // Redirect to the HTML page that will handle the blog listing
  redirect('/blog.html');
} 