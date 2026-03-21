/**
 * Оболочка раздела журнала. Шапка и `<main>` задаются в корневом `app/layout.tsx`.
 * Хлебные крошки рендерятся внутри дочерних страниц, чтобы иметь доступ к `params` и данным статьи.
 */
export default function MagazineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
