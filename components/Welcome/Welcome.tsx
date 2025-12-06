import Link from 'next/link';
import { Button } from '../ui/button';

export function Welcome() {
  return (
    <div
      className="flex h-screen flex-col items-center justify-center"
      style={{ marginTop: '-5%' }}
    >
      <h1 className="text-center text-6xl font-black leading-tight tracking-[-2px] lg:text-8xl  mt-[100px]">
        Путь к{' '}
        <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
          освобождению ума
        </span>
      </h1>
      <p className="text-muted-foreground text-center text-lg max-w-[580px] mx-auto mt-8">
        Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии,
        философии и буддизма. Начните с{' '}
        <Link
          href="magazine/buddhism/four-noble-truths"
          className="text-lg text-primary underline-offset-4 hover:underline"
        >
          четырёх благородных истин{' '}
        </Link>
        или{' '}
        <Link
          href="/magazine/stoicism/doc"
          className="text-lg text-primary underline-offset-4 hover:underline"
        >
          дихотомии контроля.
        </Link>
      </p>
    </div>
  );
}
