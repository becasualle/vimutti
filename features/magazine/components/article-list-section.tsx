/**
 * Блок списка статей: заголовок страницы и сетка карточек (сортировка по дате убыв.).
 * Используется на `/magazine` и на страницах категорий.
 */
import { TypographyH1 } from '@/components/ui/typography';
import { articleToCard } from '@/features/magazine/lib/get-all-articles';
import type { ArticleFrontmatter } from '@/features/magazine/types';
import { ArticleList } from './article-list';
import { ArticleListLayout } from './article-list-layout';

type ArticleListSectionProps = {
  /** Статьи для отображения (уже отфильтрованы вызывающим кодом). */
  articles: ArticleFrontmatter[];
  /** Заголовок над списком (совпадает с последней крошкой на странице категории). */
  title: string;
};

export function ArticleListSection({ articles, title }: ArticleListSectionProps) {
  const cards = [...articles]
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .map(articleToCard);

  return (
    <div className="py-12">
      <TypographyH1 className="mb-8 text-center">{title}</TypographyH1>
      <ArticleListLayout>
        <ArticleList cards={cards} />
      </ArticleListLayout>
    </div>
  );
}
