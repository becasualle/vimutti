/**
 * Вёрстка страницы одной статьи: заголовок, дата, JSON-LD Article, блок «Похожие статьи».
 * Хлебные крошки задаются снаружи (страница catch-all), не внутри этого компонента.
 */
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { TypographyH1 } from '@/components/ui/typography';
import type { RelatedArticle } from '@/features/magazine/lib/get-all-articles';
import { magazineHref } from '@/features/magazine/lib/magazine-path';
import { BASE_URL, SITE_NAME } from '@/lib/site';

type ArticleLayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  /**
   * Путь статьи относительно `/magazine` (как в файловой системе `content/articles`), например `psychology/cbt/slug`.
   * Нужен для канонического URL и разметки JSON-LD.
   */
  slugPath?: string;
  /** Обложка под заголовком (коллокированный `.webp`, см. `article-hero-images.ts`). */
  heroImage?: StaticImageData;
  /** Alt для обложки; при отсутствии — пустая строка (лучше задать в frontmatter `coverAlt`). */
  heroAlt?: string;
  /** Похожие статьи для внутренней перелинковки и SEO. */
  relatedArticles?: RelatedArticle[];
};

function ArticleJsonLd({
  title,
  description,
  datePublished,
  url,
}: {
  title: string;
  description: string;
  datePublished: string;
  url: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * @param props.children — тело статьи (MDX).
 * @param props.title — заголовок H1 и schema.org `headline`.
 * @param props.description — описание для meta / JSON-LD.
 * @param props.date — дата публикации (ISO) для `<time>` и JSON-LD.
 * @param props.slugPath — путь статьи под `/magazine` для канонического URL и JSON-LD.
 * @param props.relatedArticles — похожие статьи для блока внизу страницы.
 */
export default function ArticleLayout({
  children,
  title,
  description,
  date,
  slugPath,
  heroImage,
  heroAlt,
  relatedArticles,
}: ArticleLayoutProps) {
  const canonicalUrl = slugPath ? `${BASE_URL}/magazine/${slugPath}` : undefined;

  return (
    <div
      className="max-w-[740px] mx-auto px-4 sm:px-6 md:px-12 lg:px-0 my-12 lg:my-16"
      style={{ lineHeight: 1.7 }}
    >
      {title && canonicalUrl && description && date && (
        <ArticleJsonLd
          title={title}
          description={description}
          datePublished={date}
          url={canonicalUrl}
        />
      )}
      <article>
        {title && (
          <TypographyH1 className="mb-6 text-blue-500">
            <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {title}
            </span>
          </TypographyH1>
        )}
        {heroImage && (
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg border border-border shadow-sm">
            <Image
              src={heroImage}
              alt={heroAlt ?? ''}
              fill
              priority
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 740px"
              className="object-cover"
            />
          </div>
        )}
        {date && (
          <time
            dateTime={date}
            className="mb-6 block text-muted-foreground text-sm"
          >
            {new Date(date).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
        {children}
      </article>
      {relatedArticles && relatedArticles.length > 0 && (
        <aside className="mt-16 border-t border-border pt-8" aria-label="Похожие статьи">
          <h2 className="mb-4 text-xl font-semibold">Похожие статьи</h2>
          <ul className="space-y-2">
            {relatedArticles.map((a) => (
              <li key={a.path}>
                <Link
                  href={magazineHref(a.segments)}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
