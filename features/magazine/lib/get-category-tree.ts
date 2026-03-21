/**
 * @file Дерево разделов журнала для витрины: корневые категории из `category-meta` и дочерние
 * «направления» (следующий сегмент пути), посчитанные по `frontmatter.category` статей.
 *
 * Данные кэшируются через `react` `cache` на время запроса. Источник истины — `getAllArticles`.
 */
import { cache } from 'react';
import { getCategorySegmentLabel } from '@/features/magazine/lib/category-labels';
import { CATEGORIES_META, CATEGORY_ORDER } from '@/features/magazine/lib/category-meta';
import { getAllArticles } from '@/features/magazine/lib/get-all-articles';
import { magazineHref } from '@/features/magazine/lib/magazine-path';
import type { ArticleFrontmatter } from '@/features/magazine/types';

/**
 * Одно **прямое** поднаправление под выбранным префиксом категории: следующий сегмент пути и
 * сколько статей с `frontmatter.category` уходят в этот сегмент на следующем уровне.
 *
 * Связь с данными: объекты собираются в {@link directionsForArticles} из `ArticleFrontmatter.category`
 * (массив сегментов в том же порядке, что и в URL после `/magazine`). Используется для карточек,
 * меню и ссылок «на уровень глубже».
 *
 * @example
 * ```ts
 * const direction: DirectionInfo = {
 *   slug: 'cbt',
 *   label: 'Когнитивно-поведенческая терапия',
 *   articleCount: 5,
 *   path: ['psychology', 'cbt'],
 *   href: '/magazine/psychology/cbt',
 * };
 * ```
 *
 * @see {@link getCategorySegmentLabel} — `features/magazine/lib/category-labels.ts`
 * @see {@link magazineHref} — `features/magazine/lib/magazine-path.ts`
 */
export interface DirectionInfo {
  /**
   * Идентификатор **дочернего** сегмента на текущем уровне (тот самый «следующий» после префикса).
   *
   * Совпадает с `category[parentPath.length]` у учтённых статей и с последним элементом {@link path}.
   * В URL обычно в kebab-case, как в папках `content/articles/...` и в frontmatter.
   *
   * @example `'cbt'`, `'clinical'`, `'basic-methods-of-psychotherapy'`
   */
  slug: string;

  /**
   * Подпись для UI (карточка, список направлений).
   *
   * Берётся через {@link getCategorySegmentLabel}: словарь в `category-labels.ts`, корневые slug’и
   * из {@link ROOT_CATEGORIES} в `category-meta.ts`, иначе — Title Case по дефисам из `slug`.
   * Пустая строка из фабрики не возвращается; при неизвестном slug всё равно будет непустой fallback.
   */
  label: string;

  /**
   * Сколько статей отнесено к этому направлению: у каждой `frontmatter.category` длиннее префикса
   * родителя, начало совпадает с родителем, а следующий после родителя сегмент равен {@link slug}
   * (тот же последний элемент {@link path}).
   *
   * В {@link directionsForArticles} в выдачу попадают только направления с ненулевым счётом, поэтому
   * для данных из `getSubDirectionsForPath` значение **≥ 1**. Ноль возможен только при ручной сборке
   * объекта или смене правил агрегации.
   */
  articleCount: number;

  /**
   * Полный префикс категории **включая** этот сегмент: `[...parentPath, slug]`.
   *
   * **Почему массив, а не строка:** тот же тип, что и `frontmatter.category` и сегменты в роуте
   * `[...category]` — удобно сравнивать, резать префиксы и передавать в {@link magazineHref} без
   * парсинга строки. Склейка в URL — `path.join('/')` (не начинается с `/`).
   *
   * **Длина:** для объектов из `directionsForArticles` длина ≥ 2 (есть корень и дочерний сегмент).
   * Пустой массив здесь не производится. Верхней границы в коде нет — глубина как у цепочки в MDX.
   *
   * **Символы:** те же ограничения, что у slug’ов в контенте (проект не валидирует отдельно).
   */
  path: string[];

  /**
   * Путь в приложении Next.js (App Router): всегда от корня сайта, для `<Link href={...}>`.
   *
   * Строится вызовом {@link magazineHref} с аргументом {@link path} (результат: сегменты после
   * `/magazine`, соединённые `/`). Это не абсолютный URL с доменом — такие ссылки задаются в sitemap.
   */
  href: string;
}

/**
 * Корневой раздел журнала на витрине: метаданные из {@link CATEGORIES_META} и список дочерних
 * направлений первого уровня (см. {@link DirectionInfo}).
 *
 * @example
 * ```ts
 * const root: CategoryInfo = {
 *   slug: 'psychology',
 *   label: 'Психология',
 *   description: 'Клиническая психология, …',
 *   totalArticleCount: 12,
 *   directions: [
 *     {
 *       slug: 'cbt',
 *       label: 'Когнитивно-поведенческая терапия',
 *       articleCount: 5,
 *       path: ['psychology', 'cbt'],
 *       href: '/magazine/psychology/cbt',
 *     },
 *   ],
 *   href: '/magazine/psychology',
 * };
 * ```
 *
 * @see {@link ROOT_CATEGORIES} — `features/magazine/lib/category-meta.ts`
 */
export interface CategoryInfo {
  /** Slug корневой категории; совпадает с `path[0]` у дочерних {@link DirectionInfo} этого блока. */
  slug: string;
  /** Заголовок раздела с витрины — из {@link CATEGORIES_META} (`ROOT_CATEGORIES` в `category-meta.ts`). */
  label: string;
  /** Текст для карточки корневого раздела — тот же источник, что и `label`. */
  description: string;
  /**
   * Сумма {@link DirectionInfo.articleCount} по всем `directions`. Каждая статья учитывается
   * ровно в одном дочернем направлении (по первому сегменту после корня), дублей между соседними
   * карточками нет.
   */
  totalArticleCount: number;
  /** Направления первого уровня внутри раздела; пустой список не отдаётся с витрины (корень отфильтрован). */
  directions: DirectionInfo[];
  /** `magazineHref([slug])` — страница листинга корневой категории. */
  href: string;
}

/**
 * Строит список **прямых** поднаправлений под префиксом `parentPath`: для каждого следующего
 * сегмента `frontmatter.category` считает, сколько статей в него «проваливаются».
 *
 * Берутся только статьи, у которых цепочка категории **строго длиннее** префикса и **покрывает**
 * его с начала (`category[0] === parentPath[0]`, …). Берётся ровно один сегмент —
 * `category[parentPath.length]` — это не суммарно по всему поддереву, а только «ребро» на один
 * уровень вниз.
 *
 * Статьи, у которых `category` совпадает с префиксом по длине (нет следующего сегмента),
 * в подсчёт не входят.
 *
 * @param parentPath — сегменты пути после `magazine`, без пустого корня. Пустой массив: функция
 *   сразу возвращает `[]` (корневой уровень витрины задаётся через `CATEGORY_ORDER`, не здесь).
 *
 * @example
 * `parentPath = ['psychology']`, статьи:
 * - `[psychology, cbt, …]` → +1 к счётчику `cbt`;
 * - `[psychology, clinical, …]` → +1 к `clinical`;
 * - `[psychology]` — отбрасывается;
 * - `[philosophy, …]` — отбрасывается (не тот префикс).
 *
 * @example
 * `parentPath = ['psychology', 'cbt']` — следующий сегмент у глубокой статьи
 * `[psychology, cbt, techniques, …]` будет `techniques`; статья ровно `[psychology, cbt]`
 * в направления не попадает.
 */
function directionsForArticles(
  articles: ArticleFrontmatter[],
  parentPath: string[],
): DirectionInfo[] {
  if (parentPath.length === 0) return [];
  const counts = new Map<string, number>();

  for (const a of articles) {
    if (a.category.length <= parentPath.length) continue;
    if (!parentPath.every((seg, i) => a.category[i] === seg)) continue;
    const nextSeg = a.category[parentPath.length];
    counts.set(nextSeg, (counts.get(nextSeg) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([slug, articleCount]) => {
      const path = [...parentPath, slug];
      return {
        slug,
        label: getCategorySegmentLabel(slug),
        articleCount,
        path,
        href: magazineHref(path),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'ru'));
}

async function getSubDirectionsForPathUncached(parentPath: string[]): Promise<DirectionInfo[]> {
  const articles = await getAllArticles();
  return directionsForArticles(articles, parentPath);
}

/**
 * Дочерние направления для префикса категории (корень раздела или вложенный путь).
 *
 * @param parentPath — сегменты после `/magazine`, без ведущего слеша; например `['psychology']`
 *   или `['psychology', 'clinical']`.
 */
export const getSubDirectionsForPath = cache(getSubDirectionsForPathUncached);

/**
 * Список корневых разделов в порядке {@link CATEGORY_ORDER}, у каждого — направления с ненулевым
 * числом статей. Разделы без материалов и без метаданных в `CATEGORIES_META` не попадают в список.
 */
async function getCategoryTreeUncached(): Promise<CategoryInfo[]> {
  const articles = await getAllArticles();
  const result: CategoryInfo[] = [];

  for (const slug of CATEGORY_ORDER) {
    const meta = CATEGORIES_META[slug];
    const directions = directionsForArticles(articles, [slug]);
    if (!meta || directions.length === 0) continue;

    const totalArticleCount = directions.reduce((sum, d) => sum + d.articleCount, 0);

    result.push({
      slug,
      label: meta.label,
      description: meta.description,
      totalArticleCount,
      directions,
      href: magazineHref([slug]),
    });
  }

  return result;
}

/** Витрина журнала: дерево корневых категорий с подразделами и счётчиками. */
export const getCategoryTree = cache(getCategoryTreeUncached);
