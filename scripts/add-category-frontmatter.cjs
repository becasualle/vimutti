/**
 * Добавляет поле category во frontmatter всех статей в content/articles
 * на основе структуры папок (путь от content/articles до файла = сегменты категории).
 * Пример: content/articles/psychology/cbt/file.mdx → category: ['psychology', 'cbt']
 */
const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

function getMdxFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      getMdxFiles(full, files);
    } else if (item.name.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

const files = getMdxFiles(ARTICLES_DIR);
let updated = 0;

for (const fp of files) {
  const relativeDir = path.relative(ARTICLES_DIR, path.dirname(fp));
  const category = relativeDir ? relativeDir.split(path.sep) : [];

  const raw = fs.readFileSync(fp, 'utf-8');
  const { data, content } = matter(raw);

  const prevCategory = data.category;
  data.category = category;

  const out = matter.stringify(content, data, { lineWidth: -1 });
  fs.writeFileSync(fp, out);
  updated++;
  const changed = JSON.stringify(prevCategory) !== JSON.stringify(category) ? ' (updated)' : '';
  console.log(path.relative(process.cwd(), fp), '→', JSON.stringify(category) + changed);
}

console.log('\nTotal:', updated, 'articles');
