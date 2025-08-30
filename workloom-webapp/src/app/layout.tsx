import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/providers/app';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WorkLoom - LinkedIn Mapping & Tracking Platform',
  description: 'Create, track, and manage LinkedIn profile mappings with advanced comparison and export features.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}