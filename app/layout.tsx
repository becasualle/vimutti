import '@mantine/core/styles.css';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';

export const metadata = {
  title: 'Путь к освобождению',
  description:
    'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  );
}
