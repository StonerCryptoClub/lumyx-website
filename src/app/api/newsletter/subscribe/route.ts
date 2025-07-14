import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_DC = 'us10'; // Your data center from the API key

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      console.error('Missing Mailchimp configuration');
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      );
    }

    // Add member to Mailchimp list
    const response = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'pending', // Double opt-in
          merge_fields: name ? { FNAME: name } : undefined,
          tags: ['website-signup'],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle existing subscribers gracefully
      if (response.status === 400 && data.title === 'Member Exists') {
        return NextResponse.json(
          { error: 'You are already subscribed to our newsletter' },
          { status: 400 }
        );
      }
      
      console.error('Mailchimp error:', data);
      throw new Error(data.detail || 'Failed to subscribe');
    }

    return NextResponse.json(
      { message: 'Successfully subscribed! Please check your email to confirm.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
} 