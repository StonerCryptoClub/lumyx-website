# How to Set Up Custom Thank You Page Redirects in Mailchimp

## What We've Done So Far:
1. Created a beautiful custom thank you page (mailchimp-thank-you.html)
2. Added "Subscribe to Newsletter" buttons that link to the Mailchimp form

## How to Add the Redirect URL in Mailchimp:

1. Log in to your Mailchimp account
2. Go to "Audience" → Select your audience
3. Click "Manage Audience" dropdown → Choose "Signup forms"
4. Click "Form builder"
5. In the form builder:
   - Find and select the "Forms and response emails" dropdown at the top
   - Select "Confirmation thank you page"
   - In the text editor that appears, look for the URL field
   - Enter: `https://lumyx.co/mailchimp-thank-you.html`
   - Click Save

6. Repeat the same process for the "Signup thank you page":
   - Find and select the "Forms and response emails" dropdown
   - Select "Signup thank you page"
   - In the text editor, enter the URL: `https://lumyx.co/mailchimp-thank-you.html`
   - Click Save

## Important Notes:
- The URL must be exactly: `https://lumyx.co/mailchimp-thank-you.html`
- You need to set up the redirect for both pages: "Confirmation thank you page" AND "Signup thank you page"
- Make sure your thank you page file is uploaded to your website before testing

## Flow After Implementation:
1. User clicks "Subscribe to Newsletter" on your website
2. User is taken to the Mailchimp form at eepurl.com
3. User enters their information and submits the form
4. User is redirected to your custom thank you page at lumyx.co/mailchimp-thank-you.html

This implementation keeps the form fields on Mailchimp's servers which is more secure and reliable, while providing a seamless branded experience with your custom thank you page. 