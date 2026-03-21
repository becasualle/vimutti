import type { CategoryInfo } from '@/features/magazine/lib/get-category-tree';
import { cn } from '@/lib/utils';
import { CategoryCard } from './category-card';

type MagazineCategoryCardsGridProps = {
  categories: CategoryInfo[];
  className?: string;
};

/**
 * Сетка карточек верхнего уровня (психология, философия и т.д.) для витрины и главной страницы.
 */
export function MagazineCategoryCardsGrid({
  categories,
  className,
}: MagazineCategoryCardsGridProps) {
  return (
    <div className={cn('grid gap-8 md:grid-cols-2', className)}>
      {categories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}
