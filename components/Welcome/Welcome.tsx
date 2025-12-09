import Link from 'next/link';
import { TypographyH1 } from '../ui/typography';

export function Welcome() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center mt-[-8vh]">
        <TypographyH1 className="lg:text-8xl text-5xl text-center">
          Путь к{' '}
          <span className="bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            освобождению ума
          </span>
        </TypographyH1>
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
    </div>
  );
}
