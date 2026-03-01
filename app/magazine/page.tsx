import { ArticleListSection } from '@/components/features/magazine/article-list-section';
import { getAllArticles } from '@/lib/content/getAllArticles';

export default async function Page() {
  const articles = await getAllArticles();
  return <ArticleListSection articles={articles} title="Список статей" />;
}
