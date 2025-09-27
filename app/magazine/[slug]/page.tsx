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

export function generateStaticParams() {
  return [{ slug: 'four-noble-truths' }];
}

export const dynamicParams = false;
