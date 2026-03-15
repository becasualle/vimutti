import { isArray } from 'lodash-es';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button-link';
import {
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ArticleListCard } from '@/features/magazine/types';

const articleCardClasses =
  'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm';

export function ArticleList({ cards }: { cards: ArticleListCard[] }) {
  if (cards.length === 0) {
    return <div>К сожалению, не удалось найти статьи</div>;
  }

  return (
    <>
      {cards.map((c) => (
        <article
          key={c.slug || c.title}
          className={cn(articleCardClasses)}
          aria-labelledby={`article-title-${c.slug}`}
        >
          <CardHeader>
            <h2
              id={`article-title-${c.slug}`}
              className="leading-none font-semibold text-xl"
            >
              <Link
                href={`/magazine/${c.slug}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {c.title}
              </Link>
            </h2>
          </CardHeader>
          <CardContent>
            <p>{c.content}</p>
          </CardContent>
          <CardFooter>
            {isArray(c.footer) ? (
              <div className="flex flex-wrap gap-1 text-muted-foreground text-sm">
                {c.footer.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : (
              <span>{c.footer}</span>
            )}
          </CardFooter>
          <CardAction className="mt-auto pr-6 self-end">
            <ButtonLink href={`/magazine/${c.slug}`}>Читать</ButtonLink>
          </CardAction>
        </article>
      ))}
    </>
  );
}
