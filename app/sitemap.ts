/**
 * Sitemap for vimutti.ru — generated at build time and served at /sitemap.xml.
 *
 * Next.js calls this function to produce the sitemap XML. Search engines use it
 * to discover all public pages (home, magazine index, category listings, and
 * individual articles) and to prioritize crawling.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/features/magazine/lib/slugs-generator';
import { getCategoryPaths } from '@/features/magazine/lib/get-all-articles';

/** Canonical origin for sitemap URLs. Must match production domain. */
const BASE_URL = 'https://www.vimutti.ru';

/**
 * Builds the full sitemap: static pages, category listing pages, and article pages.
 *
 * - **Static pages**: `/` and `/magazine` with higher priority.
 * - **Category pages**: Every category path that has articles (e.g. `psychology`, `psychology/cbt`),
 *   excluding paths that coincide with an article slug so we don’t list the same URL twice.
 * - **Article pages**: Every MDX file under `content/articles/`, one URL per article.
 *
 * @returns Next.js sitemap entries (url, lastModified, priority, changeFrequency).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleSlugs, categoryPaths] = await Promise.all([
    Promise.resolve(getAllSlugs()),
    getCategoryPaths(),
  ]);

  const articleSlugSet = new Set(articleSlugs.map((s) => s.join('/')));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/magazine`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
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
