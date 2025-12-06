import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyListProps {
  children: ReactNode;
  tag?: 'ol' | 'ul';
  className?: string;
}

export function TypographyList({ children, tag, className }: TypographyListProps) {
  const baseClassName = 'my-6 ml-6 [&>li]:mt-2';

  if (tag === 'ol') {
    return <ol className={cn('list-decimal', baseClassName, className)}>{children}</ol>;
  }

  return <ul className={cn('list-disc', baseClassName, className)}>{children}</ul>;
}
