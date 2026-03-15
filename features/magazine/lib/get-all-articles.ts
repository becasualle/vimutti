import { cache } from 'react';
import type {
  ArticleFrontmatter,
  ArticleListCard,
  RemarkMdxParsedData,
} from '@/features/magazine/types';
import { getAllSlugs } from '@/features/magazine/lib/slugs-generator';

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
export async function getArticlesByCategory(
  categoryPath: string[]
): Promise<ArticleFrontmatter[]> {
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

/** Related article for internal linking (SEO and UX). */
export type RelatedArticle = { slug: string; title: string };

/**
 * Returns articles related by shared category or overlapping tags, excluding the current article.
 * Sorted by relevance (same category first, then by tag overlap), then by date descending.
 */
export async function getRelatedArticles(
  currentSlug: string,
  category: string[],
  tags: string[],
  limit = 5
): Promise<RelatedArticle[]> {
  const articles = await getAllArticles();
  const tagSet = new Set(tags);

  const scored = articles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => {
      const categoryMatch =
        category.length > 0 && a.category.length >= category.length
          ? category.every((seg, i) => a.category[i] === seg)
            ? 2
            : a.category.some((seg) => category.includes(seg))
              ? 1
              : 0
          : 0;
      const tagOverlap = a.tags?.filter((t) => tagSet.has(t)).length ?? 0;
      return { article: a, score: categoryMatch * 10 + tagOverlap };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (b.article.date ?? '').localeCompare(a.article.date ?? ''));

  return scored.slice(0, limit).map(({ article }) => ({ slug: article.slug, title: article.title }));
}
