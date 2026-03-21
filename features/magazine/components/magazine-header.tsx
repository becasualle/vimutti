'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { IconCircleHalf2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import type { CategoryInfo } from '@/features/magazine/lib/get-category-tree';
import { MagazineMobileNav } from './magazine-mobile-nav';
import { MagazineNavMenu } from './magazine-nav-menu';

type MagazineHeaderProps = {
  categoryTree: CategoryInfo[];
};

export function MagazineHeader({ categoryTree }: MagazineHeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <nav className="flex min-w-0 flex-1 items-center gap-2 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Главная
          </Link>
          <Link
            href="/magazine"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors md:hidden"
          >
            Статьи
          </Link>
          <div className="hidden md:block">
            <MagazineNavMenu categoryTree={categoryTree} />
          </div>
          <div className="md:hidden">
            <MagazineMobileNav categoryTree={categoryTree} />
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            <IconCircleHalf2 className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
