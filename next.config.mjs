import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import { remarkMermaid } from '@theguild/remark-mermaid';
import path from 'node:path';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter, remarkMermaid],
    rehypePlugins: [],
  },
  extension: /\.(md|mdx)$/,
});

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@theguild/remark-mermaid/mermaid': path.resolve(
        process.cwd(),
        'components/mdx/mdx-mermaid.tsx'
      ),
    };

    return config;
  },
};

export default withMDX(withBundleAnalyzer(nextConfig));
