export interface ArticleFrontmatter {
  title: string;
  slug?: string;
  description?: string;
  date?: string;
  tags?: string[];
}

export interface ArticleListCard {
  title: string;
  description: string;
  action: string;
  content: string;
  footer: string;
}
