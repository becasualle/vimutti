'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import type { CategoryInfo } from '@/features/magazine/lib/get-category-tree';

type MagazineNavMenuProps = {
  categoryTree: CategoryInfo[];
};

/**
 * Десктопное выпадающее меню «Статьи» с колонками по категориям и направлениям.
 */
export function MagazineNavMenu({ categoryTree }: MagazineNavMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Статьи</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-6 p-4 md:w-[min(92vw,720px)] md:grid-cols-2 md:gap-8 lg:p-6">
              <div className="md:col-span-2">
                <Link
                  href="/magazine"
                  className="text-primary text-sm font-medium underline-offset-4 hover:underline"
                >
                  Обзор журнала
                </Link>
              </div>
              {categoryTree.map((cat) => (
                <div key={cat.slug} className="min-w-0">
                  <p className="text-foreground mb-2 font-semibold">{cat.label}</p>
                  <ul className="max-h-[min(50vh,320px)] space-y-1.5 overflow-y-auto text-sm">
                    {cat.directions.map((d) => (
                      <li key={d.href}>
                        <Link
                          href={d.href}
                          className="text-muted-foreground hover:text-foreground block truncate"
                        >
                          {d.label}{' '}
                          <span className="text-muted-foreground/80">({d.articleCount})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={cat.href}
                    className="text-primary mt-3 inline-block text-sm font-medium underline-offset-4 hover:underline"
                  >
                    К статьям →
                  </Link>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
