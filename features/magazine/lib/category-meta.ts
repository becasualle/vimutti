/**
 * @file Ручные метаданные корневых разделов журнала (витрина `/magazine`, шапка, карточки).
 *
 * Slug’и здесь должны совпадать с первым сегментом `frontmatter.category` у статей.
 * Порядок витрины — порядок элементов в {@link ROOT_CATEGORIES} (единственный источник).
 */
export const ROOT_CATEGORIES = [
  {
    slug: 'psychology',
    label: 'Психология',
    description:
      'Клиническая психология, психотерапия, коучинг, работа с зависимостями и травмой',
  },
  {
    slug: 'philosophy',
    label: 'Философия',
    description: 'Буддизм, стоицизм и другие философские традиции освобождения ума',
  },
] as const;

export type RootCategorySlug = (typeof ROOT_CATEGORIES)[number]['slug'];

/** Одна корневая категория: slug, подпись и описание для витрины. */
export type CategoryMeta = (typeof ROOT_CATEGORIES)[number];

/** Порядок корневых разделов на `/magazine` и в навигации (производно от {@link ROOT_CATEGORIES}). */
export const CATEGORY_ORDER: readonly RootCategorySlug[] = ROOT_CATEGORIES.map((c) => c.slug);

/** Доступ по slug для мест, где удобнее lookup, чем перебор массива. */
export const CATEGORIES_META: Record<RootCategorySlug, CategoryMeta> = Object.fromEntries(
  ROOT_CATEGORIES.map((c) => [c.slug, c]),
) as Record<RootCategorySlug, CategoryMeta>;
