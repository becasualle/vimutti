import type { ComponentType } from 'react';

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  category: string[]; // ["psychology", "cbt"]
  /** Подпись к обложке (alt), если для статьи подключён hero в `article-hero-images.ts`. */
  coverAlt?: string;
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
  default: ComponentType;
  frontmatter: ArticleFrontmatter;
}
