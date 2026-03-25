import { cache } from 'react';
import { hasCategoryLabelEntry } from '@/features/magazine/lib/category-labels';
import { importArticleMdx } from '@/features/magazine/lib/load-article-mdx';
import { getAllSlugs } from '@/features/magazine/lib/slugs-generator';
import type { ArticleFrontmatter, ArticleListCard } from '@/features/magazine/types';

let warnedMissingCategoryLabels = false;

function warnMissingCategoryLabelsOnce(articles: ArticleFrontmatter[]): void {
  if (warnedMissingCategoryLabels) return;
  warnedMissingCategoryLabels = true;
  const segments = new Set<string>();
  for (const a of articles) {
    for (const seg of a.category) {
      segments.add(seg);
    }
  }
  const missing = [...segments].filter((s) => !hasCategoryLabelEntry(s)).sort();
  if (missing.length === 0) return;
  console.warn(
    '[magazine] Сегменты category без записей в LABELS/ROOT_LABELS (подпись — Title Case): ' +
      missing.join(', ')
  );
}

async function getAllArticlesUncached(): Promise<ArticleFrontmatter[]> {
  const slugs = getAllSlugs();

  const articles = await Promise.all(
    slugs.map(async (parts): Promise<ArticleFrontmatter> => {
      const articlePath = parts.join('/');
      const {
        frontmatter: { title, description, date, tags, category },
      } = await importArticleMdx(parts);

      return {
        path: articlePath,
        segments: parts,
        title: title ?? '',
        description: description ?? '',
        date: date ?? '',
        tags: tags ?? [],
        category: category ?? [],
      };
    })
  );

  warnMissingCategoryLabelsOnce(articles);

  return articles;
}

export const getAllArticles = cache(getAllArticlesUncached);

/**
 * Статьи, у которых `frontmatter.category` начинается с `categoryPath` (префикс).
 *
 * @example
 * getArticlesByCategory(["psychology"]) — все статьи в psychology и в подкатегориях (cbt, act, …).
 * @example
 * getArticlesByCategory(["psychology", "cbt"]) — только статьи, чья категория ровно `psychology/cbt/...`.
 *
 * @param categoryPath — сегменты пути категории в том же порядке, что в URL после `/magazine`.
 * @returns Массив frontmatter всех подходящих статей.
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
    path: a.path,
    segments: a.segments,
    title: a.title,
    content: a.description,
    action: 'Читать',
    footer: a.tags?.map((t) => `#${t}`),
    date: a.date,
  };
}

/** Related article for internal linking (SEO and UX). */
export type RelatedArticle = { path: string; title: string; segments: string[] };

/** Length of the shared prefix from index 0 between two category segment arrays (order matters). */
function sharedCategoryPrefixLength(a: string[], b: string[]): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

/**
 * Похожие статьи по глубине общего префикса категории и пересечению тегов;
 * текущая статья исключается. Сортировка: сначала релевантность (длина префикса категории, затем число общих тегов), затем дата по убыванию.
 *
 * @param currentPath — путь статьи без префикса `/magazine`, например `psychology/cbt/article`.
 * @param category — массив сегментов категории из frontmatter текущей статьи.
 * @param tags — теги текущей статьи.
 * @param limit — максимум записей в ответе (по умолчанию 5).
 * @returns `{ path, title }` для внутренних ссылок и SEO.
 */
export async function getRelatedArticles(
  currentPath: string,
  category: string[],
  tags: string[],
  limit = 5
): Promise<RelatedArticle[]> {
  const articles = await getAllArticles();
  const tagSet = new Set(tags);

  const scored = articles
    .filter((a) => a.path !== currentPath)
    .map((a) => {
      const prefixLen =
        category.length > 0 ? sharedCategoryPrefixLength(category, a.category) : 0;
      const tagOverlap = a.tags?.filter((t) => tagSet.has(t)).length ?? 0;
      return { article: a, score: prefixLen * 10 + tagOverlap };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) => b.score - a.score || (b.article.date ?? '').localeCompare(a.article.date ?? '')
    );

  return scored
    .slice(0, limit)
    .map(({ article }) => ({
      path: article.path,
      title: article.title,
      segments: article.segments,
    }));
}
