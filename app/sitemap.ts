/**
 * @file Карта сайта vimutti.ru: генерируется при сборке и отдаётся по `/sitemap.xml`.
 *
 * Next.js вызывает экспорт по умолчанию и собирает XML. Поисковики по нему находят публичные
 * URL и ориентируются в приоритетах обхода.
 *
 * **Состав записей:** главная и индекс журнала, страницы категорий со статьями, страницы статей
 * (каждый файл `.mdx` в дереве каталога `content/articles`).
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';
import { getCategoryPaths } from '@/features/magazine/lib/get-all-articles';
import { getAllSlugs } from '@/features/magazine/lib/slugs-generator';

/** Базовый origin для абсолютных URL в sitemap; должен совпадать с продакшен-доменом. */
const BASE_URL = 'https://www.vimutti.ru';

/**
 * Собирает полный список URL: статика, категории журнала, статьи.
 *
 * - **Статика** — `/` и `/magazine` (повышенный `priority`).
 * - **Категории** — все пути из `getCategoryPaths`, по которым реально есть материалы
 *   (например `psychology`, `psychology/cbt`). Путь исключается, если он совпадает со слогом
 *   статьи, чтобы не дублировать один URL в разделах «категория» и «статья».
 * - **Статьи** — по одному URL на каждый `.mdx` под `content/articles/`.
 *
 * @returns Массив записей sitemap Next.js: `url`, `lastModified`, `priority`, `changeFrequency`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleSlugs, categoryPaths] = await Promise.all([
    Promise.resolve(getAllSlugs()),
    getCategoryPaths(),
  ]);

  const articleSlugSet = new Set(articleSlugs.map((s) => s.join('/')));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' },
    {
      url: `${BASE_URL}/magazine`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: 'weekly',
    },
  ];

  const categories: MetadataRoute.Sitemap = categoryPaths
    .filter((p) => !articleSlugSet.has(p.join('/')))
    .map((path) => ({
      url: `${BASE_URL}/magazine/${path.join('/')}`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    }));

  const articles: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${BASE_URL}/magazine/${slug.join('/')}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticPages, ...categories, ...articles];
}
