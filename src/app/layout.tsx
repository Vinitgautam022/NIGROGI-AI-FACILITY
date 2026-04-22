import type { Metadata } from 'next';
import { IBM_Plex_Sans, Sora } from 'next/font/google';
import './globals.css';

const headingFont = Sora({
  subsets: ['latin'],
  variable: '--font-heading'
});

const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: 'AI-Powered Virtual Hospital',
  description: 'A starter app for symptom analysis, report review, and medical triage.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
