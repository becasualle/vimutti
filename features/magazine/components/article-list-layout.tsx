import { ReactNode } from 'react';

export function ArticleListLayout({ children }: { children: ReactNode }) {
  return <div className="grid auto-rows-min gap-4 md:grid-cols-3">{children}</div>;
}
