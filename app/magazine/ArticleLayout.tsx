'use client';

import { ReactNode } from 'react';
import { Container, Text, Title } from '@mantine/core';

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
      my={{ base: 48, lg: 64 }}
    >
      <article>
        {title && (
          <Title order={1} mb="lg">
            <Text gradient={{ from: 'blue', to: 'cyan', deg: 171 }} variant="gradient" inherit>
              {' '}
              {title}
            </Text>
          </Title>
        )}
        {children}
      </article>
    </Container>
  );
}
