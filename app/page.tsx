import type { Metadata } from 'next';
import { Welcome } from '@/features/welcome/components/welcome';
import { HOME_PAGE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: HOME_PAGE_DESCRIPTION,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Welcome />
    </>
  );
}
