import { cache } from 'react';
import type { RemarkMdxParsedData } from '@/components/features/magazine/types';
import { getAllSlugs } from '@/lib/content/slugs-generator';

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string[];
};

async function getAllArticlesUncached(): Promise<ArticleMeta[]> {
  const slugs = getAllSlugs();
  const slugPaths = slugs.map((parts) => parts.join('/'));

  const articles = await Promise.all(
    slugPaths.map(async (slugPath): Promise<ArticleMeta> => {
      const { frontmatter } = (await import(
        `@/content/articles/${slugPath}.mdx`
      )) as RemarkMdxParsedData;

      return {
        slug: slugPath,
        title: frontmatter.title ?? '',
        description: frontmatter.description ?? '',
        date: frontmatter.date ?? '',
        tags: frontmatter.tags ?? [],
        category: frontmatter.category ?? [],
      };
    })
  );

  return articles;
}

export const getAllArticles = cache(getAllArticlesUncached);
