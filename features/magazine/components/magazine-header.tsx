'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function MagazineHeader() {
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Главная
          </Link>
          <Link
            href="/magazine"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Статьи
          </Link>
        </nav>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme('light')}
            aria-label="Светлая тема"
          >
            Светлая
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme('dark')}
            aria-label="Тёмная тема"
          >
            Тёмная
          </Button>
        </div>
      </div>
    </header>
  );
}
