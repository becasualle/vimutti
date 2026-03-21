/**
 * Главная страница журнала: `/magazine` — витрина категорий и направлений.
 */
import type { Metadata } from 'next';
import { MagazineBreadcrumbs } from '@/features/magazine/components/magazine-breadcrumbs';
import { MagazineShowcase } from '@/features/magazine/components/magazine-showcase';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Статьи | ${SITE_NAME}`,
  description:
    'Все статьи по психологии, буддизму и стоицизму: КПТ, психотерапия, философия освобождения ума.',
  alternates: { canonical: '/magazine' },
};

export default function Page() {
  return (
    <>
      <MagazineBreadcrumbs
        categorySegments={[]}
        currentLabel="Статьи"
        articleMode={false}
      />
      <MagazineShowcase />
    </>
  );
}
