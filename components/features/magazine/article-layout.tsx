import { TypographyH1 } from '@/components/ui/typography/heading-elements/typography-h1';

type ArticleLayoutProps = {
  children: React.ReactNode;
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
          <TypographyH1 className="mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {title}
            </span>
          </TypographyH1>
        )}
        {children}
      </article>
    </div>
  );
}
