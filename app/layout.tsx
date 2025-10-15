/**
 * Root layout with PWA support
 */

import type { Metadata } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from '@/src/shared/ui/sw-register';
import { THEME_COLOR } from '@/src/shared/lib/constants';

export const metadata: Metadata = {
  title: 'Маникюр PWA',
  description: 'Веб-приложение для записи к мастеру маникюра',
  themeColor: THEME_COLOR,
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Маникюр PWA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
