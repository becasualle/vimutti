export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description?: string;
  date: string;
  tags?: string[];
}

export interface ArticleListCard {
  slug: string;
  title: string;
  description?: string;
  action?: string;
  content?: string;
  footer?: string | string[];
  date: string;
}

export interface RemarkMdxParsedData {
  default: React.ComponentType;
  frontmatter: ArticleFrontmatter;
}
