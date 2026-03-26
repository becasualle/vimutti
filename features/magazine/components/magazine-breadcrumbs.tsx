/**
 * Хлебные крошки раздела «Статьи»: рендерятся на уровне страниц (не layout),
 * чтобы использовать уже известные на сервере сегменты URL и заголовок без клиентского `usePathname`.
 *
 * Режимы:
 * - Индекс `/magazine`: `categorySegments=[]`, `articleMode=false`, `currentLabel` — например «Статьи».
 * - Список по категории: `categorySegments` = полный путь категории, `articleMode=false` — последний сегмент только в `currentLabel`.
 * - Статья: `categorySegments` = родительские папки (без slug статьи), `articleMode=true`, `currentLabel` = `title` из frontmatter.
 */
import * as React from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getCategorySegmentLabel } from '@/features/magazine/lib/category-labels';
import { magazineHref } from '@/features/magazine/lib/magazine-path';

type MagazineBreadcrumbsProps = {
  /**
   * Сегменты пути категории из URL (без `/magazine`).
   * Для статьи — все сегменты кроме последнего (slug файла); на `/magazine` — `[]`.
   */
  categorySegments: string[];
  /** Текущая страница: заголовок списка, название категории-листа или заголовок статьи. */
  currentLabel: string;
  /**
   * `true` — статья: каждый элемент `categorySegments` — ссылка, затем нессылочный `currentLabel` (заголовок статьи).
   * `false` — список/индекс: ссылки на префиксы пути, `currentLabel` — текущий уровень (лист или «Статьи»).
   */
  articleMode: boolean;
};

/**
 * Строка крошек: Главная → Статьи → … → текущая страница.
 * Подписи сегментов — через `getCategorySegmentLabel` из `category-labels`.
 */
export function MagazineBreadcrumbs({
  categorySegments,
  currentLabel,
  articleMode,
}: MagazineBreadcrumbsProps) {
  const isMagazineIndex = !articleMode && categorySegments.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Главная</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {isMagazineIndex ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={magazineHref([])}>Статьи</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {articleMode
                ? categorySegments.map((seg, i) => {
                    const href = magazineHref(categorySegments.slice(0, i + 1));
                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link href={href}>{getCategorySegmentLabel(seg)}</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })
                : categorySegments.slice(0, -1).map((seg, i) => {
                    const prefix = categorySegments.slice(0, i + 1);
                    const href = magazineHref(prefix);
                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link href={href}>{getCategorySegmentLabel(seg)}</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
