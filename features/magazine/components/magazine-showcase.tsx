import { TypographyH1 } from '@/components/ui/typography';
import { getCategoryTree } from '@/features/magazine/lib/get-category-tree';
import { MagazineCategoryCardsGrid } from './magazine-category-cards-grid';

/**
 * Витрина журнала на `/magazine`: крупные категории с направлениями и счётчиками статей.
 */
export async function MagazineShowcase() {
  const tree = await getCategoryTree();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <TypographyH1 className="mb-4">Статьи</TypographyH1>
          <p className="text-muted-foreground mx-auto max-w-4xl text-lg">
            Выберите интересующий раздел. Раздел психологии расскажет про актуальные научные теории,
            направления и техники, имеющие мощную доказательную базу. Раздел философии рассказывает
            про основные течения, которые прошли проверку временем и помогают современному человеку
            сформировать внутренний компас и картину мира, которая помогает справиться с любыми
            сложностями, подняться к вершинам благополучной и осмысленной жизни.
          </p>
        </header>
        <MagazineCategoryCardsGrid categories={tree} />
      </div>
    </div>
  );
}
