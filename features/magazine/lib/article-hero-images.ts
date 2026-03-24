import { existsSync } from 'fs';
import path from 'path';
import type { StaticImageData } from 'next/image';
import { articlesDirectory } from '@/features/magazine/lib/slugs-generator';

/**
 * Обложка статьи: файл `hero.webp` в папке статьи (рядом с `index.mdx` или с одноимённым `.mdx`).
 * Webpack подхватывает все пути вида `…/hero.webp` под `content/articles` — без ручного реестра.
 * До ~10 прочих иллюстраций на материал подключайте из MDX: `import fig from './diagram.webp'`.
 */
export async function getArticleHeroImage(slugPath: string): Promise<StaticImageData | undefined> {
  const heroFsPath = path.join(articlesDirectory, ...slugPath.split('/'), 'hero.webp');
  if (!existsSync(heroFsPath)) return undefined;

  const mod = (await import(`@/content/articles/${slugPath}/hero.webp`)) as {
    default: StaticImageData;
  };
  return mod.default;
}
