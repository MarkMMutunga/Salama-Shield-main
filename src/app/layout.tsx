/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the root layout component with global providers
 * and authentication modal. Unauthorized copying or distribution
 * of this file is strictly prohibited.
 */
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import PinInputModal from '@/components/auth/PinInputModal';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

export const metadata: Metadata = {
  title: 'Salama Shield',
  description: 'Stay safe with Salama Shield',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <LocalizationProvider>
          <AppProvider>
            {children}
            <PinInputModal />
            <Toaster /> {/* Add Toaster here for app-wide notifications */}
          </AppProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
