import { readdirSync, statSync } from 'fs';
import path from 'path';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export function getAllSlugs() {
  return getFiles(articlesDirectory);
}

function getFiles(dir: string) {
  const items = readdirSync(dir);
  const slugs: string[][] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const isDirectory = statSync(fullPath).isDirectory();

    if (isDirectory) {
      const subSlugs = getFiles(fullPath);
      slugs.push(...subSlugs);
    } else if (item.endsWith('.mdx')) {
      const relativePath = path.relative(articlesDirectory, fullPath);
      const slug = relativePath
        .replace(/\.mdx/, '')
        .split(path.sep)
        .map((segment) => segment.trim());
      slugs.push(slug);
    }
  }

  return slugs;
}
