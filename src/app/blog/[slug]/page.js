import { createClient } from 'contentful';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

// Create Contentful client
const client = createClient({
  space: '74kxarv2y1kp',
  accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
});

export async function generateStaticParams() {
  try {
    const response = await client.getEntries({ 
      content_type: 'blogPost' 
    });

    return response.items.map((item) => ({
      slug: item.fields.slug,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  
  try {
    // Get the blog post data
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2
    });

    // If no blog post found, redirect to 404
    if (response.items.length === 0) {
      notFound();
    }

    // Redirect to the blog post HTML page with the slug as parameter
    redirect(`/blog-post.html?slug=${slug}`);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
} 