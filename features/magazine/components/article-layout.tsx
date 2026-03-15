import Link from 'next/link';
import { TypographyH1 } from '@/components/ui/typography/heading-elements/typography-h1';
import type { RelatedArticle } from '@/features/magazine/lib/get-all-articles';

const BASE_URL = 'https://www.vimutti.ru';
const SITE_NAME = 'Путь к освобождению';

type ArticleLayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  /** Article path segment (e.g. 'psychology/cbt/article-slug') for canonical URL and JSON-LD. */
  slugPath?: string;
  /** Related articles for internal linking (SEO). */
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

export default function ArticleLayout({
  children,
  title,
  description,
  date,
  slugPath,
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
              <li key={a.slug}>
                <Link
                  href={`/magazine/${a.slug}`}
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
