/**
 * @file Обложка статьи: коллокированный `hero.webp` в каталоге материала (рядом с MDX).
 *
 * Webpack подхватывает пути `…/hero.webp` под `content/articles` без реестра. Прочие иллюстрации — из MDX
 * (`import fig from './diagram.webp'`).
 */
import { existsSync } from 'fs';
import path from 'path';
import type { StaticImageData } from 'next/image';
import { articlesDirectory } from '@/features/magazine/lib/slugs-generator';

/** @param slugPath — путь под `content/articles` через `/` (как в URL после `/magazine`). */
export async function getArticleHeroImage(slugPath: string): Promise<StaticImageData | undefined> {
  const heroFsPath = path.join(articlesDirectory, ...slugPath.split('/'), 'hero.webp');
  if (!existsSync(heroFsPath)) return undefined;

  const mod = (await import(`@/content/articles/${slugPath}/hero.webp`)) as {
    default: StaticImageData;
  };
  return mod.default;
}
