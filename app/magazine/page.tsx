import { ArticleListSection } from '@/features/magazine/components/article-list-section';
import { getAllArticles } from '@/features/magazine/lib/get-all-articles';

export default async function Page() {
  const articles = await getAllArticles();
  return <ArticleListSection articles={articles} title="Список статей" />;
}
