import { ErrorBoundary } from '@/components/ErrorBoundary';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lumyx.agency'),
  title: {
    default: 'Lumyx Agency | Digital Solutions',
    template: '%s | Lumyx Agency'
  },
  description: 'Lumyx Agency provides cutting-edge digital solutions, web development, and digital marketing services to help businesses grow online.',
  keywords: ['digital agency', 'web development', 'digital marketing', 'SEO', 'web design'],
  authors: [{ name: 'Lumyx Agency' }],
  creator: 'Lumyx Agency',
  publisher: 'Lumyx Agency',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <GoogleAnalytics />
      </body>
    </html>
  );
} 