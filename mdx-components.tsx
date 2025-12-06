import type { MDXComponents } from 'mdx/types';
import { ButtonLink } from '@/components/ui/button-link';
import {
  TypographyBlockquote,
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
  blockquote: TypographyBlockquote,
  ol: (props) => <TypographyList {...props} tag="ol" />,
  a: (props) => <ButtonLink {...props} className="p-0" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
