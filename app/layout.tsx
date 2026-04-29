import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alfred AI Operations Command Center',
  description:
    'A decision system for monitoring, diagnosing, and improving AI support quality at global scale.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100%' }}>{children}</body>
    </html>
  );
}
