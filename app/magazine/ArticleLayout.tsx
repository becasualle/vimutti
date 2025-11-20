import { ReactNode } from 'react';

type ArticleLayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function ArticleLayout({ children, title }: ArticleLayoutProps) {
  return (
    <div
      className="max-w-[740px] mx-auto px-4 sm:px-6 md:px-12 lg:px-0 my-12 lg:my-16"
      style={{ lineHeight: 1.7 }}
    >
      <article>
        {title && (
          <h1 className="mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
        )}
        {children}
      </article>
    </div>
  );
}
