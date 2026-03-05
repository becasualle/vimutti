import { MagazineHeader } from '@/components/features/magazine/magazine-header';

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
