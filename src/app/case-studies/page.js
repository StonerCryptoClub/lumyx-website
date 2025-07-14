import { createClient } from 'contentful';
import { redirect } from 'next/navigation';

// Create Contentful client
const client = createClient({
  space: '74kxarv2y1kp',
  accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
});

export default async function CaseStudiesPage() {
  // Redirect to the portfolio section on the home page
  redirect('/index.html#portfolio');
} 