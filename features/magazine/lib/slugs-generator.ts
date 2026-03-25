/**
 * @file Обход дерева `content/articles` и построение списка «слогов» статей для статической
 * генерации, карты сайта и загрузки MDX.
 *
 * **Контракт:** статья — это либо `…/<slug>.mdx`, либо папка `…/<slug>/index.mdx` (одна папка на
 * материал: рядом кладут `hero.webp`, иллюстрации и т.д.). Подкаталоги без `index.mdx` задают
 * префикс URL (категории). **Окружение:** синхронный `fs`, только Node.js (build / SSR).
 *
 * `frontmatter.category` должен совпадать с сегментами пути к файлу **без последнего сегмента**
 * (последний — идентификатор статьи). Проверка: `validateArticlesContent()` / первый вызов
 * `getAllSlugs()`.
 *
 * @see `importArticleMdx` в `load-article-mdx.ts` — загрузка MDX для страниц и списков.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import matter from 'gray-matter';
import path from 'path';

/** Корень статей относительно корня репозитория. */
export const articlesDirectory = path.join(process.cwd(), 'content/articles');

/** Игнорируем служебные файлы ОС при поиске «лишних» не-MDX файлов. */
const IGNORED_NON_MDX_NAMES = new Set(['.DS_Store', 'Thumbs.db']);

/**
 * Расширения вложений рядом со статьёй (не предупреждаем). Всё остальное не-.mdx — предупреждение.
 */
const ALLOWED_NON_MDX_EXTENSIONS = new Set([
  '.avif',
  '.eot',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.ttf',
  '.webp',
  '.woff',
  '.woff2',
]);

let didValidateArticles = false;

function normalizeCategory(raw: unknown): string[] {
  if (raw === undefined || raw === null) return [];
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') return [raw];
  return [];
}

function resolveArticleMdxPath(segments: ArticleSlugSegments): string {
  const asFile = path.join(articlesDirectory, ...segments) + '.mdx';
  if (existsSync(asFile)) return asFile;
  return path.join(articlesDirectory, ...segments, 'index.mdx');
}

function expectedCategoryFromSlugSegments(segments: ArticleSlugSegments): string[] {
  return segments.slice(0, -1);
}

function categoriesEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((s, i) => s === b[i]);
}

/**
 * Рекурсивно собирает пути (относительно `articlesDirectory`) к файлам, которые не являются
 * статьями `.mdx` и не похожи на ожидаемые вложения (изображения, шрифты).
 */
function collectStrayNonMdxFiles(dir: string): string[] {
  const strays: string[] = [];
  for (const item of readdirSync(dir).sort()) {
    if (IGNORED_NON_MDX_NAMES.has(item)) continue;
    const fullPath = path.join(dir, item);
    const isDirectory = statSync(fullPath).isDirectory();
    if (isDirectory) {
      strays.push(...collectStrayNonMdxFiles(fullPath));
      continue;
    }
    if (item.endsWith('.mdx')) continue;
    const ext = path.extname(item).toLowerCase();
    if (ALLOWED_NON_MDX_EXTENSIONS.has(ext)) continue;
    strays.push(path.relative(articlesDirectory, fullPath));
  }
  return strays;
}

/**
 * Проверяет контракт путь ↔ `frontmatter.category` для всех статей и предупреждает о лишних
 * не-MDX файлах. Вызывается один раз при первом `getAllSlugs()` и из `npm run validate:articles`.
 *
 * @throws Error если у какой-либо статьи category не совпадает с каталогом на диске.
 */
export function validateArticlesContent(): void {
  if (didValidateArticles) return;
  didValidateArticles = true;

  const strays = collectStrayNonMdxFiles(articlesDirectory);
  if (strays.length > 0) {
    console.warn(
      '[magazine] В дереве content/articles найдены файлы не .mdx (не изображения/шрифты). ' +
        'Удалите лишнее или перенесите:\n  ' +
        strays.join('\n  ')
    );
  }

  const slugs = collectSlugsFromDir(articlesDirectory);
  for (const segments of slugs) {
    const mdxPath = resolveArticleMdxPath(segments);
    const rel = path.relative(process.cwd(), mdxPath);
    const raw = readFileSync(mdxPath, 'utf8');
    const { data } = matter(raw);
    const expected = expectedCategoryFromSlugSegments(segments);
    const actual = normalizeCategory(data.category);

    if (!categoriesEqual(expected, actual)) {
      throw new Error(
        `[magazine] frontmatter.category не совпадает с путём к файлу.\n` +
          `  Файл: ${rel}\n` +
          `  Ожидается category (сегменты пути без последнего): ${JSON.stringify(expected)}\n` +
          `  В frontmatter: ${JSON.stringify(actual)}`
      );
    }
  }
}

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
  validateArticlesContent();
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
