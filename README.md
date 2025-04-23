# Lumyx Agency Website

A modern, responsive website for Lumyx Agency featuring a beautiful design with interactive elements and a booking system.

## Features

- Responsive design that works on all devices
- Interactive booking system
- Modern UI with animations and transitions
- Blog section
- Newsletter subscription
- Contact form
- Social media integration

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Font Awesome Icons
- Google Fonts
- FullCalendar.js

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. No build process required - it's a static website

## Deployment

This website is deployed using GitHub Pages. Visit the live site at: [Your GitHub Pages URL will go here]

## License

© 2025 Lumyx Agency. All rights reserved.

## Security Features

- Content Security Policy (CSP) headers
- XSS protection
- CSRF protection
- Rate limiting
- Input sanitization and validation
- Secure HTTP headers
- Production build optimization

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- EmailJS account and API keys
- Supabase account and credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
EMAILJS_TEMPLATE_ID=your_template_id
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run security checks:
   ```bash
   npm run security-check
   ```

## Development

```bash
npm run dev
```

## Production Build

1. Run linting:
   ```bash
   npm run lint
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Start production server:
   ```bash
   npm start
   ```

## Security Best Practices

1. Keep dependencies updated:
   ```bash
   npm audit
   npm update
   ```

2. Regular security checks:
   ```bash
   npm run security-check
   ```

3. Code quality checks:
   ```bash
   npm run lint
   ```

## Deployment

1. Set up SSL/TLS certificates
2. Configure proper CORS settings
3. Set up proper error logging
4. Configure rate limiting based on your needs
5. Set up monitoring and alerting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 