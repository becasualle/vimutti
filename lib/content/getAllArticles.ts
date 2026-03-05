import { cache } from 'react';
import { getAllSlugs } from '@/lib/content/slugs-generator';
import type { ArticleFrontmatter, ArticleListCard, RemarkMdxParsedData } from '@/lib/content/types';

async function getAllArticlesUncached(): Promise<ArticleFrontmatter[]> {
  const slugs = getAllSlugs();
  const slugPaths = slugs.map((parts) => parts.join('/'));

  const articles = await Promise.all(
    slugPaths.map(async (slugPath): Promise<ArticleFrontmatter> => {
      const {
        frontmatter: { title, description, date, tags, category },
      } = (await import(`@/content/articles/${slugPath}.mdx`)) as RemarkMdxParsedData;

      return {
        slug: slugPath,
        title: title ?? '',
        description: description ?? '',
        date: date ?? '',
        tags: tags ?? [],
        category: category ?? [],
      };
    })
  );

  return articles;
}

export const getAllArticles = cache(getAllArticlesUncached);

/**
 * Статьи, у которых category начинается с categoryPath (префикс).
 * getArticlesByCategory(["psychology"]) — все статьи в psychology и в подкатегориях (cbt, act, …)
 * getArticlesByCategory(["psychology", "cbt"]) — только статьи в psychology/cbt
 */
export async function getArticlesByCategory(categoryPath: string[]): Promise<ArticleFrontmatter[]> {
  const articles = await getAllArticles();
  return articles.filter(
    (a) =>
      a.category.length >= categoryPath.length &&
      categoryPath.every((seg, i) => a.category[i] === seg)
  );
}

/** Все префиксы категорий, для которых getArticlesByCategory(path).length > 0. */
export async function getCategoryPaths(): Promise<string[][]> {
  const articles = await getAllArticles();
  const seen = new Set<string>();
  for (const a of articles) {
    for (let len = 1; len <= a.category.length; len++) {
      const path = a.category.slice(0, len);
      const key = path.join('/');
      if (!seen.has(key)) seen.add(key);
    }
  }
  return Array.from(seen).map((s) => s.split('/'));
}

export function articleToCard(a: ArticleFrontmatter): ArticleListCard {
  return {
    slug: a.slug,
    title: a.title,
    content: a.description,
    action: 'Читать',
    footer: a.tags?.map((t) => `#${t}`),
    date: a.date,
  };
}
