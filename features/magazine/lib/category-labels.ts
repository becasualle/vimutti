/**
 * Человекочитаемые подписи для slug’ов категорий в URL и в хлебных крошках.
 * Корневые разделы подтягиваются из {@link ROOT_CATEGORIES}; остальные — из `LABELS`.
 * Неизвестные slug’и превращаются в Title Case по дефисам.
 */
import { ROOT_CATEGORIES } from '@/features/magazine/lib/category-meta';

const ROOT_LABELS: Record<string, string> = Object.fromEntries(
  ROOT_CATEGORIES.map((c) => [c.slug, c.label])
);

const LABELS: Record<string, string> = {
  buddhism: 'Буддизм',
  stoicism: 'Стоицизм',
  cbt: 'Когнитивно-поведенческая терапия',
  clinical: 'Клиническая психология',
  social: 'Социальная психология',
  coaching: 'Коучинг',
  behavioral: 'Бихевиоризм',
  'psychodynamic-psychology': 'Психодинамическая психология',
  'classical-psychoanalysis': 'Классический психоанализ',
  'analytical-psychology': 'Аналитическая психология',
  'object-relations-theory': 'Теория объектных отношений',
  'individual-psychology': 'Индивидуальная психология',
  'basic-methods-of-psychotherapy': 'Основы психотерапии',
  'vozrastnaya-psihologiya': 'Возрастная психология',
  'psihologicheskoe-konsultirovanie': 'Психологическое консультирование',
  'psihologiya-lichnosti': 'Психология личности',
  'osnovy-raboty-psihologa-s-posledstviyami-travmaticheskih-sobytij':
    'Работа с последствиями травмы и гореванием',
  'psihoterapiya-zavisimostej': 'Психотерапия зависимостей',
};

/** Slugs, для которых задана явная подпись в {@link LABELS} или корневых {@link ROOT_LABELS}. */
const KNOWN_CATEGORY_LABEL_SEGMENTS: ReadonlySet<string> = new Set([
  ...Object.keys(ROOT_LABELS),
  ...Object.keys(LABELS),
]);

/**
 * Есть ли явная подпись для сегмента пути категории (не Title Case по дефисам).
 * Используется при проверке данных на сборке / при загрузке статей.
 */
export function hasCategoryLabelEntry(segment: string): boolean {
  return KNOWN_CATEGORY_LABEL_SEGMENTS.has(segment);
}

function slugToLabel(slug: string): string {
  return (
    LABELS[slug] ??
    ROOT_LABELS[slug] ??
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

/**
 * Подпись для одного сегмента URL (папка в `content/articles/...`).
 * @param slug — сегмент пути, например `psychology`, `basic-methods-of-psychotherapy`.
 */
export function getCategorySegmentLabel(slug: string): string {
  return slugToLabel(slug);
}

/**
 * Заголовок текущего уровня категории — по последнему сегменту пути.
 * @param categoryPath — сегменты после `/magazine`, например `["psychology","cbt"]` → подпись для `cbt`.
 * @returns Пустой путь → `'Категория'` (запасной вариант).
 */
export function getCategoryTitle(categoryPath: string[]): string {
  if (categoryPath.length === 0) return 'Категория';
  return slugToLabel(categoryPath[categoryPath.length - 1]);
}
