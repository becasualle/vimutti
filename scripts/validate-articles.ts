/**
 * Standalone CI/build check: path ↔ frontmatter.category contract and stray files.
 * @see features/magazine/lib/slugs-generator.ts — same logic runs on first getAllSlugs().
 */
import { validateArticlesContent } from '@/features/magazine/lib/slugs-generator';

validateArticlesContent();
console.log('[validate:articles] OK');
