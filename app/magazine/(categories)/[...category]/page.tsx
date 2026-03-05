import { notFound } from 'next/navigation';
import ArticleLayout from '@/features/magazine/components/article-layout';
import type { RemarkMdxParsedData } from '@/features/magazine/types';
import { ArticleListSection } from '@/features/magazine/components/article-list-section';
import { getCategoryTitle } from '@/features/magazine/lib/category-labels';
import {
  getArticlesByCategory,
  getCategoryPaths,
} from '@/features/magazine/lib/get-all-articles';
import { getAllSlugs } from '@/features/magazine/lib/slugs-generator';

export default async function Page({ params }: { params: Promise<{ category: string[] }> }) {
  const { category: segments } = await params;
  if (segments.length === 0) notFound();

  const pathStr = segments.join('/');
  const articleSlugs = new Set(getAllSlugs().map((p) => p.join('/')));

  if (articleSlugs.has(pathStr)) {
    const { default: Post, frontmatter } = (await import(
      `@/content/articles/${pathStr}.mdx`
    )) as RemarkMdxParsedData;
    return (
      <ArticleLayout title={frontmatter?.title ?? ''}>
        <Post />
      </ArticleLayout>
    );
  }

  const articles = await getArticlesByCategory(segments);
  if (articles.length === 0) notFound();

  return <ArticleListSection articles={articles} title={getCategoryTitle(segments)} />;
}

export async function generateStaticParams() {
  const [articleSlugs, categoryPaths] = await Promise.all([
    Promise.resolve(getAllSlugs()),
    getCategoryPaths(),
  ]);
  const seen = new Set(articleSlugs.map((s) => s.join('/')));
  const params = [
    ...articleSlugs.map((slug) => ({ category: slug })),
    ...categoryPaths.filter((p) => !seen.has(p.join('/'))).map((path) => ({ category: path })),
  ];
  return params;
}

export const dynamicParams = true;
