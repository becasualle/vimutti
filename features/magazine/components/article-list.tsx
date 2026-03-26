import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button-link';
import {
  CardAction,
  cardBaseClasses,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { magazineHref } from '@/features/magazine/lib/magazine-path';
import type { ArticleListCard } from '@/features/magazine/types';
import { cn } from '@/lib/utils';

/**
 * Сетка карточек превью статей: заголовок-ссылка, описание, футер (теги), кнопка «Читать».
 *
 * Пустой `cards`: короткое сообщение пользователю (не throw).
 *
 * @param cards — объекты в форме `ArticleListCard` (`features/magazine/types.ts`). Частый источник —
 *   `articleToCard` в `features/magazine/lib/get-all-articles.ts`. В `map` ключ элемента — `path` или `title`.
 */
export function ArticleList({ cards }: { cards: ArticleListCard[] }) {
  if (cards.length === 0) {
    return <div>К сожалению, не удалось найти статьи</div>;
  }

  return (
    <>
      {cards.map((c) => (
        <article
          key={c.path || c.title}
          className={cn(cardBaseClasses)}
          aria-labelledby={`article-title-${c.path}`}
        >
          <CardHeader>
            <h2 id={`article-title-${c.path}`} className="leading-none font-semibold text-xl">
              <Link
                href={magazineHref(c.segments)}
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
            {Array.isArray(c.footer) ? (
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
            <ButtonLink href={magazineHref(c.segments)}>Читать</ButtonLink>
          </CardAction>
        </article>
      ))}
    </>
  );
}
