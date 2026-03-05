import type { ArticleFrontmatter } from '@/features/magazine/types';
import { articleToCard } from '@/features/magazine/lib/get-all-articles';
import { ArticleList } from './article-list';
import { ArticleListLayout } from './article-list-layout';
import { TypographyH1 } from '@/components/ui/typography';

type ArticleListSectionProps = {
  articles: ArticleFrontmatter[];
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
