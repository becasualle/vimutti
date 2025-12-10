import { isArray } from 'lodash-es';
import { ButtonLink } from '@/components/ui/button-link';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
          <CardTitle>{c.title}</CardTitle>
          <CardDescription>{c.description}</CardDescription>
          <CardAction>
            <ButtonLink href={`/magazine/${c.slug}`}>Читать</ButtonLink>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>{c.content}</p>
        </CardContent>
        <CardFooter>
          {isArray(c.footer) ? (
            <div className="flex flex-wrap gap-2">
              {c.footer.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : (
            <span>{c.footer}</span>
          )}
        </CardFooter>
      </Card>
    );
  });

  return cardsTemplate;
}
