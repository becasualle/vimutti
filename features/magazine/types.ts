import type { ComponentType } from 'react';

/**
 * Frontmatter as MDX/remark actually yields it: keys may be absent or empty depending on the file.
 */
export interface RawFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  category?: string[];
  /** Подпись к обложке (alt), если для статьи подключён hero в `article-hero-images.ts`. */
  coverAlt?: string;
  /** Часто задаётся в MDX; маршрут строится по пути файла, не по этому полю. */
  slug?: string;
}

/** Нормализованные метаданные статьи после загрузки MDX и заполнения полей по умолчанию. */
export interface ArticleFrontmatter {
  title: string;
  /** Joined path under `content/articles` (e.g. `psychology/cbt/article`); URL segment after `/magazine/`. */
  path: string;
  /** Сегменты пути статьи (как в `getAllSlugs`); для `magazineHref` без join/split. */
  segments: string[];
  description: string;
  date: string;
  tags: string[];
  category: string[]; // ["psychology", "cbt"]
  /** Подпись к обложке (alt), если для статьи подключён hero в `article-hero-images.ts`. */
  coverAlt?: string;
}

export interface ArticleListCard {
  path: string;
  segments: string[];
  title: string;
  description?: string;
  action?: string;
  content?: string;
  footer?: string | string[];
  date: string;
}

export interface RemarkMdxParsedData {
  default: ComponentType;
  frontmatter: RawFrontmatter;
}
