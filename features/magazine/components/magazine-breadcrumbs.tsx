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

type MagazineBreadcrumbsProps = {
  /** Category path from URL or frontmatter (`[]` on `/magazine`). */
  categorySegments: string[];
  /** Current page label (list heading or article title). */
  currentLabel: string;
  /** When true, every segment is a link and `currentLabel` is the article title. */
  articleMode: boolean;
};

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
                  <Link href="/magazine">Статьи</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {articleMode
                ? categorySegments.map((seg, i) => {
                    const href = `/magazine/${categorySegments.slice(0, i + 1).join('/')}`;
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
                    const href = `/magazine/${prefix.join('/')}`;
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
