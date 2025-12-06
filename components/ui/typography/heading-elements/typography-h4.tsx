import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyH4Props {
  children: ReactNode;
  className?: string;
}

export function TypographyH4({ children, className }: TypographyH4Props) {
  return (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>
      {children}
    </h4>
  );
}
