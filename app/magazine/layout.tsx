import { MagazineHeader } from '@/features/magazine/components/magazine-header';

export default function MagazineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MagazineHeader />
      <main>{children}</main>
    </>
  );
}
