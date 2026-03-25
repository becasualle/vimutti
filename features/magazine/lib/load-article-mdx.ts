/**
 * @file Динамический импорт MDX статьи по сегментам пути в `content/articles`.
 *
 * Два шаблона импорта с литеральным `.mdx` в конце, чтобы webpack не тянул посторонние файлы из каталога.
 */
import { existsSync } from 'fs';
import path from 'path';
import {
  articlesDirectory,
  type ArticleSlugSegments,
} from '@/features/magazine/lib/slugs-generator';
import type { RemarkMdxParsedData } from '@/features/magazine/types';

export async function importArticleMdx(
  segments: ArticleSlugSegments
): Promise<RemarkMdxParsedData> {
  const joined = segments.join('/');
  const asFile = path.join(articlesDirectory, ...segments) + '.mdx';
  if (existsSync(asFile)) {
    return import(`@/content/articles/${joined}.mdx`) as Promise<RemarkMdxParsedData>;
  }
  return import(`@/content/articles/${joined}/index.mdx`) as Promise<RemarkMdxParsedData>;
}
