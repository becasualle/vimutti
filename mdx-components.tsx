import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyList,
  TypographyP,
} from '@/components/ui/typography';

const components: MDXComponents = {
  h1: TypographyH1,
  h2: TypographyH2,
  h3: TypographyH3,
  h4: TypographyH4,
  p: TypographyP,
  ul: TypographyList,
  ol: (props) => <TypographyList {...props} tag="ol" />,
  a: (props) => (
    <Link
      {...props}
      className="text-lg text-primary underline-offset-4 hover:underline"
      target="_blank"
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
