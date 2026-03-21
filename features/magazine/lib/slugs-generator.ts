/**
 * @file Обход дерева `content/articles` и построение списка «слогов» статей для статической
 * генерации, карты сайта и загрузки MDX.
 *
 * **Контракт:** одна статья — один файл `*.mdx`. Подкаталоги задают префикс URL (категории).
 * **Окружение:** синхронный `fs`, только Node.js (build / SSR), не вызывать из клиентского бандла.
 *
 * **Связанные модули:** `getAllArticles` (`get-all-articles.ts`), `generateStaticParams` в
 * `app/magazine/(categories)/[...category]/page.tsx`, sitemap в `app/sitemap.ts`.
 */
import { readdirSync, statSync } from 'fs';
import path from 'path';

/** Корень статей относительно корня репозитория. */
const articlesDirectory = path.join(process.cwd(), 'content/articles');

/**
 * Сегменты пути статьи относительно `content/articles` (без расширения `.mdx`).
 * Совпадает с путём импорта MDX: `@/content/articles/${segments.join('/')}.mdx`.
 *
 * @example
 * Файл `content/articles/psychology/cbt/article-slug.mdx` → `["psychology", "cbt", "article-slug"]`.
 */
export type ArticleSlugSegments = string[];

/**
 * Возвращает список всех статей: рекурсивно обходит каталоги, собирает пути ко всем `.mdx`.
 * Порядок имён на каждом уровне — лексикографический (`sort()`).
 *
 * @returns Массив слогов; пустые каталоги и файлы не-`.mdx` игнорируются.
 */
export function getAllSlugs(): ArticleSlugSegments[] {
  return collectSlugsFromDir(articlesDirectory);
}

/**
 * Рекурсивный обход: вложенные папки — глубже в URL, листья — только `.mdx`.
 */
function collectSlugsFromDir(dir: string): ArticleSlugSegments[] {
  const items = readdirSync(dir).sort();
  const slugs: ArticleSlugSegments[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const isDirectory = statSync(fullPath).isDirectory();

    if (isDirectory) {
      slugs.push(...collectSlugsFromDir(fullPath));
    } else if (item.endsWith('.mdx')) {
      const relativePath = path.relative(articlesDirectory, fullPath);
      const slug = relativePath.replace(/\.mdx$/, '').split(path.sep);
      slugs.push(slug);
    }
  }

  return slugs;
}
