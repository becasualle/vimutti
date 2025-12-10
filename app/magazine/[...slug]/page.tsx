import ArticleLayout from '@/components/features/magazine/article-layout';
import type { ArticleFrontmatter } from '@/components/features/magazine/types';
import { getAllSlugs } from '@/lib/content/slugs-generator';

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const module = (await import(`@/content/articles/${slugPath}.mdx`)) as {
    default: React.ComponentType;
    frontmatter: ArticleFrontmatter;
  };
  const { default: Post, frontmatter } = module;
  const title = frontmatter?.title ?? '';
  return (
    <ArticleLayout title={title}>
      <Post />
    </ArticleLayout>
  );
}

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export const dynamicParams = false;
