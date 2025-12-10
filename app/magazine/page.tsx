import { ArticleList } from '@/components/features/magazine/article-list';
import { ArticleListLayout } from '@/components/features/magazine/article-list-layout';
import { ArticleListCard } from '@/components/features/magazine/types';
import type { RemarkMdxParsedData } from '@/components/features/magazine/types';
import { TypographyH1 } from '@/components/ui/typography';
import { getAllSlugs } from '@/lib/content/slugs-generator';

export default async function Page() {
  const slugs = getAllSlugs();
  const slugPaths = slugs.map((pathSlugParts) => pathSlugParts.join('/'));

  let cards: ArticleListCard[] = [];

  try {
    cards = await Promise.all(slugPaths.map((slugPath) => getArticleCardData(slugPath)));
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="py-12">
      <TypographyH1 className="mb-8 text-center">Список статей</TypographyH1>
      <ArticleListLayout>
        <ArticleList cards={cards} />
      </ArticleListLayout>
    </div>
  );
}

async function getArticleCardData(slugPath: string): Promise<ArticleListCard> {
  const { frontmatter } = (await import(
    `@/content/articles/${slugPath}.mdx`
  )) as RemarkMdxParsedData;

  const footerTags = frontmatter.tags?.map((t) => `#${t}`);

  const cardData: ArticleListCard = {
    slug: slugPath,
    title: frontmatter.title,
    description: frontmatter.description,
    action: 'Читать',
    footer: footerTags,
  };

  return cardData;
}
