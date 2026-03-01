import { cache } from 'react';
import type { ArticleFrontmatter, RemarkMdxParsedData } from '@/components/features/magazine/types';
import { getAllSlugs } from '@/lib/content/slugs-generator';

async function getAllArticlesUncached(): Promise<ArticleFrontmatter[]> {
  const slugs = getAllSlugs();
  const slugPaths = slugs.map((parts) => parts.join('/'));

  const articles = await Promise.all(
    slugPaths.map(async (slugPath): Promise<ArticleFrontmatter> => {
      const {
        frontmatter: { title, description, date, tags, category },
      } = (await import(`@/content/articles/${slugPath}.mdx`)) as RemarkMdxParsedData;

      return {
        slug: slugPath,
        title: title ?? '',
        description: description ?? '',
        date: date ?? '',
        tags: tags ?? [],
        category: category ?? [],
      };
    })
  );

  return articles;
}

export const getAllArticles = cache(getAllArticlesUncached);
