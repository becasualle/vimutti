import type { Metadata } from 'next';
import { ArticleListSection } from '@/features/magazine/components/article-list-section';
import { getAllArticles } from '@/features/magazine/lib/get-all-articles';

export const metadata: Metadata = {
  title: 'Статьи | Путь к освобождению',
  description:
    'Все статьи по психологии, буддизму и стоицизму: КПТ, психотерапия, философия освобождения ума.',
  alternates: { canonical: '/magazine' },
};

export default async function Page() {
  const articles = await getAllArticles();
  return <ArticleListSection articles={articles} title="Список статей" />;
}
