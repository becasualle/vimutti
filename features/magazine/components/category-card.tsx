'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { CategoryInfo } from '@/features/magazine/lib/get-category-tree';

const MAX_DIRECTIONS_PREVIEW = 5;

type CategoryCardProps = {
  category: CategoryInfo;
};

/**
 * Карточка категории на витрине `/magazine`: описание, ключевые направления с числом статей, ссылка на категорию.
 */
export function CategoryCard({ category }: CategoryCardProps) {
  const byCount = [...category.directions].sort((a, b) => b.articleCount - a.articleCount);
  const preview = byCount.slice(0, MAX_DIRECTIONS_PREVIEW);
  const restCount = byCount.length - preview.length;
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const visibleDirections = directionsOpen ? byCount : preview;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">{category.label}</CardTitle>
        <CardDescription className="text-base">{category.description}</CardDescription>
        <p className="text-muted-foreground text-sm">
          Всего статей:{' '}
          <span className="font-medium text-foreground">{category.totalArticleCount}</span>
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <p className="text-muted-foreground text-sm font-medium">Направления</p>
        <ul className="flex flex-wrap gap-2">
          {visibleDirections.map((d) => (
            <li key={d.href}>
              <Link href={d.href}>
                <Badge variant="secondary" className="hover:bg-accent">
                  {d.label} ({d.articleCount})
                </Badge>
              </Link>
            </li>
          ))}
          {restCount > 0 && (
            <li className="flex items-center">
              <button
                type="button"
                aria-expanded={directionsOpen}
                onClick={() => setDirectionsOpen((open) => !open)}
                className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 transition-colors hover:underline"
              >
                {directionsOpen ? 'Свернуть' : `+ ещё ${restCount}`}
              </button>
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col items-stretch gap-2 border-t pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={category.href}>Изучить</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
