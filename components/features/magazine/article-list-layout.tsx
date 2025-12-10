import { ReactNode } from 'react';

export function ArticleListLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">{children}</div>
    </div>
  );
}
