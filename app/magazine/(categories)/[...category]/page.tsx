/**
 * Catch-all маршрут журнала: `/magazine/[...category]`.
 * Отдаёт либо одну статью (MDX), либо список статей по префиксу категории.
 * Перед контентом рендерится `MagazineBreadcrumbs` с пропсами из `segments` и frontmatter.
 */
import { notFound } from 'next/navigation';
import ArticleLayout from '@/features/magazine/components/article-layout';
import { ArticleListSection } from '@/features/magazine/components/article-list-section';
import { DirectionTiles } from '@/features/magazine/components/direction-tiles';
import { MagazineBreadcrumbs } from '@/features/magazine/components/magazine-breadcrumbs';
import { TypographyH1 } from '@/components/ui/typography';
import { getCategoryTitle } from '@/features/magazine/lib/category-labels';
import {
  getArticlesByCategory,
  getCategoryPaths,
  getRelatedArticles,
} from '@/features/magazine/lib/get-all-articles';
import { getArticleHeroImage } from '@/features/magazine/lib/article-hero-images';
import { getSubDirectionsForPath } from '@/features/magazine/lib/get-category-tree';
import { importArticleMdx } from '@/features/magazine/lib/load-article-mdx';
import { magazineHref } from '@/features/magazine/lib/magazine-path';
import { getAllSlugs, resolveMagazineSegments } from '@/features/magazine/lib/slugs-generator';

export { generateMetadata } from '@/features/magazine/lib/magazine-catchall-metadata';

/**
 * Catch-all magazine page: renders either a single article or a category listing.
 * - Article: when `category` matches an article slug (e.g. `psychology/cbt/some-article`), loads the MDX and wraps it in ArticleLayout.
 * - Category: when `category` is a category path, shows ArticleListSection with articles in that category.
 * @param props - Next.js page props with `params.category` as the path segments.
 */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string[] }>;
  searchParams: Promise<{ full?: string }>;
}) {
  const { category: segments } = await params;
  if (segments.length === 0) notFound();

  const { full } = await searchParams;
  const showFull = full === '1';

  const { pathStr, isArticle } = resolveMagazineSegments(segments);

  if (isArticle) {
    const { default: Post, frontmatter } = await importArticleMdx(segments);
    const relatedArticles = await getRelatedArticles(
      pathStr,
      frontmatter?.category ?? [],
      frontmatter?.tags ?? [],
      5
    );
    const heroImage = await getArticleHeroImage(pathStr);
    return (
      <>
        {/* Родительские сегменты URL без slug статьи; заголовок — из frontmatter */}
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
          heroImage={heroImage}
          heroAlt={frontmatter?.coverAlt ?? frontmatter?.title ?? ''}
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
  const subDirections = await getSubDirectionsForPath(segments);
  const hasChildDirections = subDirections.length > 0;

  if (hasChildDirections) {
    return (
      <>
        <MagazineBreadcrumbs
          categorySegments={segments}
          currentLabel={title}
          articleMode={false}
        />
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <TypographyH1 className="mb-8 text-center">{title}</TypographyH1>
          <DirectionTiles directions={subDirections} />
          <ArticleListSection
            articles={articles}
            title={showFull ? 'Все статьи' : 'Последние статьи'}
            titleAs="h2"
            limit={showFull ? undefined : 6}
            showAllHref={
              !showFull && articles.length > 6 ? `${magazineHref(segments)}?full=1` : undefined
            }
            className="max-w-none py-0 px-0 sm:px-0 lg:px-0"
          />
        </div>
      </>
    );
  }

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
