import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Page() {
  const cards = [
    {
      title: 'Заголовок статьи 1',
      description: 'Текстовое описание о чем будет статья',
      action: 'Читать далее',
      content: 'Какой-то контент',
      footer: 'Опциональный футер контент',
    },
    {
      title: 'Заголовок статьи 2',
      description: 'Текстовое описание о чем будет статья',
      action: 'Читать далее',
      content: 'Какой-то контент',
      footer: 'Опциональный футер контент',
    },
    {
      title: 'Заголовок статьи 3',
      description: 'Текстовое описание о чем будет статья',
      action: 'Читать далее',
      content: 'Какой-то контент',
      footer: 'Опциональный футер контент',
    },
  ];

  const cardsTemplate = cards.map((c) => {
    return (
      <Card key={c.title}>
        <CardHeader>
          <CardTitle>{c.title}</CardTitle>
          <CardDescription>{c.description}</CardDescription>
          <CardAction>{c.action}</CardAction>
        </CardHeader>
        <CardContent>
          <p>{c.content}</p>
        </CardContent>
        <CardFooter>
          <p>{c.footer}</p>
        </CardFooter>
      </Card>
    );
  });

  return cardsTemplate;
}
