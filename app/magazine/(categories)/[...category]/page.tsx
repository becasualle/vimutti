/**
 * Magazine catch-all route: `/magazine/[...category]`.
 * Serves article pages (single MDX) and category listing pages (articles in a category).
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/features/magazine/components/article-layout';
import { ArticleListSection } from '@/features/magazine/components/article-list-section';
import { MagazineBreadcrumbs } from '@/features/magazine/components/magazine-breadcrumbs';
import { getCategoryTitle } from '@/features/magazine/lib/category-labels';
import {
  getArticlesByCategory,
  getCategoryPaths,
  getRelatedArticles,
} from '@/features/magazine/lib/get-all-articles';
import { getAllSlugs } from '@/features/magazine/lib/slugs-generator';
import type { RemarkMdxParsedData } from '@/features/magazine/types';

/** Site name used in OpenGraph and metadata. */
const SITE_NAME = 'Путь к освобождению';
/** Canonical base URL for absolute links in metadata. */
const BASE_URL = 'https://www.vimutti.ru';

/**
 * Resolves catch-all route segments into a path string and whether it points to an article.
 * @param segments - URL path segments from the `[...category]` param (e.g. `['psychology', 'cbt']`).
 * @returns Object with `pathStr` (e.g. `'psychology/cbt'`) and `isArticle` (true if that path is an article slug).
 */
function resolveSegments(segments: string[]) {
  const pathStr = segments.join('/');
  const articleSlugs = new Set(getAllSlugs().map((p) => p.join('/')));
  return { pathStr, isArticle: articleSlugs.has(pathStr) };
}

/**
 * Generates per-page metadata for SEO (title, description, OpenGraph, Twitter).
 * For article paths, uses frontmatter; for category paths, uses the category title.
 * @param props - Next.js page props with resolved `params`.
 * @returns Metadata for the current route, or empty object when segments are empty.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string[] }>;
}): Promise<Metadata> {
  const { category: segments } = await params;
  if (segments.length === 0) return {};

  const { pathStr, isArticle } = resolveSegments(segments);

  if (isArticle) {
    const { frontmatter } = (await import(
      `@/content/articles/${pathStr}.mdx`
    )) as RemarkMdxParsedData;

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

/**
 * Catch-all magazine page: renders either a single article or a category listing.
 * - Article: when `category` matches an article slug (e.g. `psychology/cbt/some-article`), loads the MDX and wraps it in ArticleLayout.
 * - Category: when `category` is a category path, shows ArticleListSection with articles in that category.
 * @param props - Next.js page props with `params.category` as the path segments.
 */
export default async function Page({ params }: { params: Promise<{ category: string[] }> }) {
  const { category: segments } = await params;
  if (segments.length === 0) notFound();

  const { pathStr, isArticle } = resolveSegments(segments);

  if (isArticle) {
    const { default: Post, frontmatter } = (await import(
      `@/content/articles/${pathStr}.mdx`
    )) as RemarkMdxParsedData;
    const relatedArticles = await getRelatedArticles(
      pathStr,
      frontmatter?.category ?? [],
      frontmatter?.tags ?? [],
      5
    );
    return (
      <>
        <MagazineBreadcrumbs
          categorySegments={segments.slice(0, -1)}
          currentLabel={frontmatter?.title ?? ''}
          articleMode
        />
        <ArticleLayout
          title={frontmatter?.title ?? ''}
          description={frontmatter?.description}
          date={frontmatter?.date}
          slugPath={pathStr}
          relatedArticles={relatedArticles}
        >
          <Post />
        </ArticleLayout>
      </>
    );
  }

  const articles = await getArticlesByCategory(segments);
  if (articles.length === 0) notFound();

  const title = getCategoryTitle(segments);
  return (
    <>
      <MagazineBreadcrumbs
        categorySegments={segments}
        currentLabel={title}
        articleMode={false}
      />
      <ArticleListSection articles={articles} title={title} />
    </>
  );
}

/**
 * Returns all static paths for this route: every article slug plus every category path that is not an article.
 * Used by Next.js for static generation at build time.
 */
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

/** When true, allows dynamic paths not in generateStaticParams to be generated on demand. */
export const dynamicParams = true;
