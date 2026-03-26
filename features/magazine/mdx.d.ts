/// <reference types="mdx" />
import type { RawFrontmatter } from '@/features/magazine/types';

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
  export const frontmatter: RawFrontmatter;
}
