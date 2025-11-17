import { readdirSync } from 'fs';
import path from 'path';
import ArticleLayout from '../ArticleLayout';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { default: Post, frontmatter } = await import(`@/app/content/articles/${slug}.mdx`);

  const title = frontmatter?.title ?? '';
  return (
    <ArticleLayout title={title}>
      <Post />
    </ArticleLayout>
  );
}

function getAllSlugs() {
  const articlesDirectory = path.join(process.cwd(), 'app/content/articles');
  try {
    const filenames = readdirSync(articlesDirectory);

    const mdxFiles = filenames.filter((filename) => filename.endsWith('.mdx'));

    return mdxFiles.map((filename) => ({
      slug: filename.replace(/\.mdx$/, ''),
    }));
  } catch (error) {
    return [];
  }
}

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export const dynamicParams = false;
