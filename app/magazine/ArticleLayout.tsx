'use client';

import { ReactNode } from 'react';
import { Container } from '@mantine/core';

type ArticleLayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function ArticleLayout({ children, title }: ArticleLayoutProps) {
  return (
    <Container
      maw={740}
      style={{ lineHeight: 1.7 }}
      px={{ base: 16, xs: 24, sm: 32, md: 48, lg: 0 }}
    >
      <article>
        {title && <h1 style={{ marginBottom: '1.5rem' }}>{title}</h1>}
        {children}
      </article>
    </Container>
  );
}
