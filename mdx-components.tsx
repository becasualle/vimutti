import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import { TypographyH1 } from '@/components/ui/typography/heading-elements/typography-h1';
import { TypographyH2 } from '@/components/ui/typography/heading-elements/typography-h2';

const components: MDXComponents = {
  h1: TypographyH1,
  h2: TypographyH2,
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
