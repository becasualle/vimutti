/**
 * @file Метаданные маршрута `/magazine/[...category]` для Next.js Metadata API.
 *
 * Статья: title/description из frontmatter, OpenGraph `article`, Twitter summary.
 * Категория (листинг): заголовок из {@link getCategoryTitle}, описание-шаблон по теме.
 *
 * Вынесено из `page.tsx`, чтобы страница отвечала только за разметку, а SEO-логика жила рядом
 * с `resolveMagazineSegments` и загрузкой MDX.
 */
import type { Metadata } from 'next';
import { getCategoryTitle } from '@/features/magazine/lib/category-labels';
import { importArticleMdx } from '@/features/magazine/lib/load-article-mdx';
import { resolveMagazineSegments } from '@/features/magazine/lib/slugs-generator';
import { BASE_URL, SITE_NAME } from '@/lib/site';

/**
 * Генерирует title, description, canonical и Open Graph для текущего catch-all URL.
 *
 * @param params — `params.category` — сегменты пути после `/magazine`.
 * @returns Объект `Metadata`; при пустых сегментах — `{}` (крайний случай; роут обычно отдаёт 404).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string[] }>;
}): Promise<Metadata> {
  const { category: segments } = await params;
  if (segments.length === 0) return {};

  const { pathStr, isArticle } = resolveMagazineSegments(segments);

  if (isArticle) {
    const { frontmatter } = await importArticleMdx(segments);

    const title = frontmatter.title || pathStr;
    const description = frontmatter.description || '';
    const url = `${BASE_URL}/magazine/${pathStr}`;

    return {
      title,
      description,
      alternates: { canonical: `/magazine/${pathStr}` },
      openGraph: {
        title,
        description,
        url,
        siteName: SITE_NAME,
        type: 'article',
        locale: 'ru_RU',
        publishedTime: frontmatter.date,
        tags: frontmatter.tags,
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  }

  const categoryTitle = getCategoryTitle(segments);
  const description = `Статьи по теме «${categoryTitle}»`;
  const url = `${BASE_URL}/magazine/${pathStr}`;

  return {
    title: categoryTitle,
    description,
    alternates: { canonical: `/magazine/${pathStr}` },
    openGraph: {
      title: categoryTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ru_RU',
    },
  };
}
