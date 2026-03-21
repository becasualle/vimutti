'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { CategoryInfo } from '@/features/magazine/lib/get-category-tree';

type MagazineMobileNavProps = {
  categoryTree: CategoryInfo[];
};

/**
 * Мобильная навигация по журналу: Sheet + Accordion по категориям.
 */
export function MagazineMobileNav({ categoryTree }: MagazineMobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Открыть меню разделов">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(100vw,320px)] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Статьи</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-4">
          <SheetClose asChild>
            <Link
              href="/magazine"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Обзор журнала
            </Link>
          </SheetClose>
          <Accordion type="multiple" className="w-full">
            {categoryTree.map((cat) => (
              <AccordionItem key={cat.slug} value={cat.slug}>
                <AccordionTrigger className="text-left">{cat.label}</AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-2 border-l-2 border-border pl-3">
                    {cat.directions.map((d) => (
                      <li key={d.href}>
                        <SheetClose asChild>
                          <Link
                            href={d.href}
                            className="text-muted-foreground hover:text-foreground text-sm"
                          >
                            {d.label} ({d.articleCount})
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                    <li>
                      <SheetClose asChild>
                        <Link href={cat.href} className="text-primary text-sm font-medium">
                          К статьям →
                        </Link>
                      </SheetClose>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
