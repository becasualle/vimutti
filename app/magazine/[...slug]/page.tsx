import { getAllSlugs } from '@/app/content/utils/slugs-generator';
import ArticleLayout from '../ArticleLayout';

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  const slugPath = slug.join('/');
  const { default: Post, frontmatter } = await import(`@/app/content/articles/${slugPath}.mdx`);
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
