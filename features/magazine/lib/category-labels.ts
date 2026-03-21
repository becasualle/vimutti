/**
 * Человекочитаемые подписи для slug’ов категорий в URL и в хлебных крошках.
 * Неизвестные slug’и превращаются в Title Case по дефисам.
 */
const LABELS: Record<string, string> = {
  buddhism: 'Буддизм',
  philosophy: 'Философия',
  stoicism: 'Стоицизм',
  psychology: 'Психология',
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
  techniques: 'Техники',
};

function slugToLabel(slug: string): string {
  return (
    LABELS[slug] ??
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
