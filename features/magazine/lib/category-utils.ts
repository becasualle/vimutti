/**
 * @file Утилиты для сравнения цепочек сегментов категории (`frontmatter.category` и путь после `/magazine`).
 *
 * **Зачем это журналу:** разделы заданы вложенными slug’ами (`psychology` → `psychology/cbt` → …). Чтобы показать
 * листинг по URL, собрать подразделы по счётчикам, отобрать «похожие» статьи, нужно отвечать на вопросы:
 * входит ли статья в выбранный раздел (префикс пути) и насколько близки две статьи по иерархии темы.
 * Эти операции — не про строки целиком, а про одинаковый порядок сегментов с начала массива.
 */

/**
 * Проверяет, что `category` начинается с `prefix` (поэлементно, с индекса 0).
 *
 * @param category — цепочка сегментов (например из frontmatter).
 * @param prefix — ожидаемый префикс (сегменты пути после `/magazine`).
 * @returns `true`, если длины совместимы и все элементы `prefix` совпадают с началом `category`.
 */
export function categoryStartsWith(category: string[], prefix: string[]): boolean {
  return category.length >= prefix.length && prefix.every((seg, i) => category[i] === seg);
}

/**
 * Длина общего префикса двух цепочек сегментов с начала (порядок важен).
 *
 * @param a — первая цепочка (например категория текущей статьи).
 * @param b — вторая цепочка (категория кандидата).
 * @returns Число совпадающих сегментов с индекса 0; 0, если первый сегмент уже различается.
 */
export function categorySharedPrefixLength(a: string[], b: string[]): number {
  let i = 0;
  const n = Math.min(a.length, b.length);
  while (i < n && a[i] === b[i]) i++;
  return i;
}
