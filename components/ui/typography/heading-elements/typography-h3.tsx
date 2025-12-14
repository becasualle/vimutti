import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyH3Props {
  children: ReactNode;
  className?: string;
}

export function TypographyH3({ children, className }: TypographyH3Props) {
  return (
    <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight mt-8', className)}>
      {children}
    </h3>
  );
}
