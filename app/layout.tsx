import './globals.css';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from 'next-themes';

import { MagazineHeader } from '@/features/magazine/components/magazine-header';
import { getCategoryTree } from '@/features/magazine/lib/get-category-tree';
import { SITE_NAME } from '@/lib/site';

export const metadata = {
  metadataBase: new URL('https://www.vimutti.ru'),
  alternates: { canonical: '/' },
  title: SITE_NAME,
  description:
    'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.',
  openGraph: {
    title: SITE_NAME,
    description:
      'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.',
    url: 'https://www.vimutti.ru/',
    siteName: SITE_NAME,
    images: [],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description:
      'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.',
    images: ['https://www.vimutti.ru/'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categoryTree = await getCategoryTree();

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MagazineHeader categoryTree={categoryTree} />
          <main>{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
