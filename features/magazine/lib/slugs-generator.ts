/**
 * @file Обход дерева `content/articles` и построение списка «слогов» статей для статической
 * генерации, карты сайта и загрузки MDX.
 *
 * **Контракт:** статья — это либо `…/<slug>.mdx`, либо папка `…/<slug>/index.mdx` (одна папка на
 * материал: рядом кладут `hero.webp`, иллюстрации и т.д.). Подкаталоги без `index.mdx` задают
 * префикс URL (категории). **Окружение:** синхронный `fs`, только Node.js (build / SSR).
 *
 * @see `importArticleMdx` в `load-article-mdx.ts` — загрузка MDX для страниц и списков.
 */
import { existsSync, readdirSync, statSync } from 'fs';
import path from 'path';

/** Корень статей относительно корня репозитория. */
export const articlesDirectory = path.join(process.cwd(), 'content/articles');

/**
 * Сегменты пути статьи относительно `content/articles` (без суффикса `.mdx` / без сегмента `index`).
 * Совпадает с путём в URL после `/magazine`.
 *
 * @example Файл `content/articles/psychology/cbt/article-slug.mdx` → `["psychology", "cbt", "article-slug"]`.
 * @example Папка `content/articles/techniques/thought-diary/index.mdx` → `["techniques", "thought-diary"]`.
 */
export type ArticleSlugSegments = string[];

/**
 * Возвращает список всех статей: рекурсивно обходит каталоги, собирает пути ко всем `.mdx`.
 * Порядок имён на каждом уровне — лексикографический (`sort()`).
 */
export function getAllSlugs(): ArticleSlugSegments[] {
  return collectSlugsFromDir(articlesDirectory);
}

function collectSlugsFromDir(dir: string): ArticleSlugSegments[] {
  const items = readdirSync(dir).sort();
  const slugs: ArticleSlugSegments[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const isDirectory = statSync(fullPath).isDirectory();

    if (isDirectory) {
      const indexPath = path.join(fullPath, 'index.mdx');
      if (existsSync(indexPath)) {
        const rel = path.relative(articlesDirectory, fullPath);
        slugs.push(rel.split(path.sep).filter(Boolean));
      } else {
        slugs.push(...collectSlugsFromDir(fullPath));
      }
    } else if (item.endsWith('.mdx')) {
      if (item === 'index.mdx') {
        const relDir = path.relative(articlesDirectory, dir);
        if (relDir) {
          slugs.push(relDir.split(path.sep).filter(Boolean));
        }
      } else {
        const relativePath = path.relative(articlesDirectory, fullPath);
        const slug = relativePath.replace(/\.mdx$/, '').split(path.sep);
        slugs.push(slug);
      }
    }
  }

  return slugs;
}
