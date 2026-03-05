/// <reference types="mdx" />
import type { ArticleFrontmatter } from '@/lib/content/types';

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
  export const frontmatter: ArticleFrontmatter;
}
