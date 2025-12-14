import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ButtonLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export function ButtonLink({ children, href, className }: ButtonLinkProps) {
  if (!href) {
    return (
      <Button variant="link" className={className}>
        {children}
      </Button>
    );
  }

  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  if (isExternal) {
    return (
      <Button variant="link" asChild className={className}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button variant="link" asChild className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
