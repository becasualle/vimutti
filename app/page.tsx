import type { Metadata } from 'next';
import { Welcome } from '@/features/welcome/components/welcome';

export const metadata: Metadata = {
  title: 'Путь к освобождению',
  description:
    'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма. Статьи о КПТ, буддизме и стоицизме.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Welcome />
    </>
  );
}
