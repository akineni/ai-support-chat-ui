import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),

  title: {
    default:  'SupportAI — AI-Powered Customer Support',
    template: '%s | SupportAI',
  },

  description:
    'SupportAI delivers instant, intelligent customer support powered by AI. ' +
    'Get answers in seconds, escalate to human agents seamlessly.',

  keywords: [
    'AI customer support',
    'live chat',
    'support chatbot',
    'customer service AI',
    'pension support',
    'AI agent',
    'real-time chat',
  ],

  authors:   [{ name: 'SupportAI' }],
  creator:   'SupportAI',
  publisher: 'SupportAI',

  robots: {
    index:     true,
    follow:    true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://your-domain.com',
    siteName:    'SupportAI',
    title:       'SupportAI — AI-Powered Customer Support',
    description:
      'Instant, intelligent customer support powered by AI. ' +
      'Get answers in seconds, escalate to human agents seamlessly.',
    images: [
      {
        url:    '/og',
        width:  1200,
        height: 630,
        alt:    'SupportAI — AI-Powered Customer Support Chat',
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    site:        '@yourtwitterhandle',
    creator:     '@yourtwitterhandle',
    title:       'SupportAI — AI-Powered Customer Support',
    description:
      'Instant, intelligent customer support powered by AI. ' +
      'Get answers in seconds, escalate to human agents seamlessly.',
    images: ['/og'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico',               sizes: 'any'   },
      { url: '/icon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple:    [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon.ico' }],
  },

  manifest: '/manifest.json',

  verification: {
    google: 'your-google-site-verification-code',
  },

  alternates: {
    canonical: 'https://your-domain.com',
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
        <meta name="theme-color" content="#6c63ff" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SupportAI" />
      </head>
      <body className={dmSans.className}>
        {children}
      </body>
    </html>
  );
}