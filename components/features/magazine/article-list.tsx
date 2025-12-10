import { isArray } from 'lodash-es';
import { ButtonLink } from '@/components/ui/button-link';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ArticleListCard } from './types';

export function ArticleList({ cards }: { cards: ArticleListCard[] }) {
  if (cards.length === 0) {
    return <div>К сожалению, не удалось найти статьи</div>;
  }

  const cardsTemplate = cards.map((c) => {
    return (
      <Card key={c.slug || c.title}>
        <CardHeader>
          <CardTitle className=" text-xl">{c.title}</CardTitle>
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
      </Card>
    );
  });

  return cardsTemplate;
}
