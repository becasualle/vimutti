import { readdirSync } from 'fs';
import path from 'path';
import ArticleLayout from '../ArticleLayout';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { default: Post } = await import(`@/app/content/articles/${slug}.mdx`);

  return (
    <ArticleLayout>
      <Post />
    </ArticleLayout>
  );
}

function getAllSlugs() {
  const articlesDirectory = path.join(process.cwd(), 'app/content/articles');
  try {
    const filenames = readdirSync(articlesDirectory);
    return filenames
      .filter((filename) => filename.endsWith('.mdx'))
      .map((filename) => filename.replace(/\.mdx$/, ''));
  } catch (error) {
    return [];
  }
}

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export const dynamicParams = false;
