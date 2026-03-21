/**
 * Блок списка статей: заголовок страницы и сетка карточек (сортировка по дате убыв.).
 * Используется на страницах категорий; на витрине `/magazine` не используется.
 */
import Link from 'next/link';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { articleToCard } from '@/features/magazine/lib/get-all-articles';
import type { ArticleFrontmatter } from '@/features/magazine/types';
import { ArticleList } from './article-list';
import { ArticleListLayout } from './article-list-layout';

type ArticleListSectionProps = {
  /** Статьи для отображения (уже отфильтрованы вызывающим кодом). */
  articles: ArticleFrontmatter[];
  /** Заголовок над списком (совпадает с последней крошкой на странице категории). */
  title: string;
  /** Уровень заголовка: на странице с плитками направлений — `h2`, иначе `h1`. */
  titleAs?: 'h1' | 'h2';
  /** Ограничить число карточек (например превью «последние статьи»). */
  limit?: number;
  /** Ссылка «показать все», если список урезан по `limit`. */
  showAllHref?: string;
  showAllLabel?: string;
  className?: string;
};

export function ArticleListSection({
  articles,
  title,
  titleAs = 'h1',
  limit,
  showAllHref,
  showAllLabel = 'Показать все статьи',
  className,
}: ArticleListSectionProps) {
  const sorted = [...articles].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  const limited = limit !== undefined ? sorted.slice(0, limit) : sorted;
  const cards = limited.map(articleToCard);
  const hasMore = limit !== undefined && sorted.length > limit;

  const Heading = titleAs === 'h2' ? TypographyH2 : TypographyH1;

  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className ?? 'py-12')}>
      <Heading className={titleAs === 'h1' ? 'mb-8 text-center' : 'mb-6'}>{title}</Heading>
      <ArticleListLayout>
        <ArticleList cards={cards} />
      </ArticleListLayout>
      {hasMore && showAllHref && (
        <p className="mt-8 text-center">
          <Link
            href={showAllHref}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {showAllLabel}
          </Link>
        </p>
      )}
    </div>
  );
}
