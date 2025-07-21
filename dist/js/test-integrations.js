import 'dotenv/config';
import { testSupabaseConnection } from './database.js';
import emailjs from '@emailjs/nodejs';

// Test EmailJS configuration
async function testEmailJS() {
    try {
        // Initialize EmailJS
        emailjs.init({
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY // Optional for added security
        });

        // Test client email template
        const clientResult = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_CLIENT_TEMPLATE_ID,
            {
                to_name: 'Test User',
                to_email: process.env.ADMIN_EMAIL,
                meeting_date: '2024-01-01',
                meeting_time: '10:00 AM',
                call_type: 'zoom',
                meeting_link: 'https://zoom.us/test'
            }
        );

        console.log('Client email template test successful!');
        
        // Test admin email template
        const adminResult = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEAM_TEMPLATE_ID,
            {
                client_name: 'Test User',
                client_email: 'test@example.com',
                client_phone: '123-456-7890',
                meeting_date: '2024-01-01',
                meeting_time: '10:00 AM',
                call_type: 'zoom',
                meeting_link: 'https://zoom.us/test',
                to_email: process.env.ADMIN_EMAIL
            }
        );

        console.log('Admin email template test successful!');
        return true;
    } catch (error) {
        console.error('EmailJS test failed:', error);
        return false;
    }
}

// Test Contentful connection
async function testContentful() {
    try {
        const response = await fetch(
            `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`
        );
        
        if (!response.ok) {
            throw new Error(`Contentful API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Contentful connection successful!');
        return true;
    } catch (error) {
        console.error('Contentful test failed:', error);
        return false;
    }
}

// Run all tests
async function runIntegrationTests() {
    console.log('Starting integration tests...\n');

    // Test Supabase
    console.log('Testing Supabase connection...');
    const supabaseResult = await testSupabaseConnection();
    console.log(`Supabase test ${supabaseResult ? 'passed' : 'failed'}\n`);

    // Test EmailJS
    console.log('Testing EmailJS configuration...');
    const emailjsResult = await testEmailJS();
    console.log(`EmailJS test ${emailjsResult ? 'passed' : 'failed'}\n`);

    // Test Contentful
    console.log('Testing Contentful connection...');
    const contentfulResult = await testContentful();
    console.log(`Contentful test ${contentfulResult ? 'passed' : 'failed'}\n`);

    // Summary
    console.log('Integration Test Summary:');
    console.log('------------------------');
    console.log(`Supabase: ${supabaseResult ? '✓' : '✗'}`);
    console.log(`EmailJS: ${emailjsResult ? '✓' : '✗'}`);
    console.log(`Contentful: ${contentfulResult ? '✓' : '✗'}`);
}

// Run the tests
runIntegrationTests().catch(console.error); 