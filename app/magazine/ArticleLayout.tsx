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
      size="md"
      px={{ base: 'md', sm: 'lg', lg: 'xl' }}
      py="xl"
      style={{ lineHeight: 1.7 }}
    >
      <article>
        {title && <h1 style={{ marginBottom: '1.5rem' }}>{title}</h1>}
        {children}
      </article>
    </Container>
  );
}
