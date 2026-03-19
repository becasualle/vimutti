/**
 * Общая оболочка раздела журнала: шапка и `<main>`.
 * Хлебные крошки рендерятся внутри дочерних страниц, чтобы иметь доступ к `params` и данным статьи.
 */
import { MagazineHeader } from '@/features/magazine/components/magazine-header';

export default function MagazineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MagazineHeader />
      <main>{children}</main>
    </>
  );
}
