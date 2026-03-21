import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DirectionInfo } from '@/features/magazine/lib/get-category-tree';

type DirectionTilesProps = {
  directions: DirectionInfo[];
  /** Заголовок блока (например название текущей категории). */
  heading?: string;
};

/**
 * Сетка направлений над списком статей на странице категории.
 */
export function DirectionTiles({ directions, heading = 'Направления' }: DirectionTilesProps) {
  if (directions.length === 0) return null;

  return (
    <section className="mb-10" aria-labelledby="direction-tiles-heading">
      <h2 id="direction-tiles-heading" className="mb-4 text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {directions.map((d) => (
          <Link key={d.href} href={d.href} className="group block focus-visible:outline-none">
            <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/30">
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <span className="font-medium leading-snug group-hover:underline">{d.label}</span>
                <Badge variant="secondary">{d.articleCount}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
