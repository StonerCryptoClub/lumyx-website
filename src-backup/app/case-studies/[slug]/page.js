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
      content_type: 'caseStudies' 
    });

    return response.items.map((item) => ({
      slug: item.fields.slug,
    }));
  } catch (error) {
    console.error('Error fetching case studies for static params:', error);
    return [];
  }
}

export default async function CaseStudyPage({ params }) {
  const { slug } = params;
  
  try {
    // Get the case study data
    const response = await client.getEntries({
      content_type: 'caseStudies',
      'fields.slug': slug,
      include: 2
    });

    // If no case study found, redirect to 404
    if (response.items.length === 0) {
      notFound();
    }

    // Redirect to the case study HTML page with the slug as parameter
    redirect(`/case-study.html?slug=${slug}`);
  } catch (error) {
    console.error('Error fetching case study:', error);
    notFound();
  }
} 