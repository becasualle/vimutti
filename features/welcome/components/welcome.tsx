import { TypographyH1 } from '@/components/ui/typography';
import { MagazineCategoryCardsGrid } from '@/features/magazine/components/magazine-category-cards-grid';
import { getCategoryTree } from '@/features/magazine/lib/get-category-tree';

export async function Welcome() {
  const categoryTree = await getCategoryTree();

  return (
    <section
      className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
      aria-label="Главная"
    >
      {/* Один блок: заголовок + текст + карточки, компактный gap; целиком центрируется в первом экране */}
      <div className="flex w-full max-w-7xl flex-col items-center gap-6 md:gap-8">
        <div className="flex flex-col items-center">
          <TypographyH1 className="text-center text-5xl lg:text-8xl">
            Путь к{' '}
            <span className="bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              освобождению ума
            </span>
          </TypographyH1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-[580px] text-center text-lg">
            Обретите благополучие и освободитесь от неудовлетворённости благодаря лучшим знаниям и
            навыкам из психологии и философии.
          </p>
        </div>

        <MagazineCategoryCardsGrid categories={categoryTree} className="w-full" />
      </div>
    </section>
  );
}
