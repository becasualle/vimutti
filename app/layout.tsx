import './globals.css';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Путь к освобождению',
  description:
    'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.',
  openGraph: {
    title: 'Путь к освобождению',
    description:
      'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.',
    url: 'https://www.vimutti.ru/',
    siteName: 'Путь к освобождению',
    images: [],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Путь к освобождению',
    description:
      'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.',
    images: ['https://www.vimutti.ru/'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
