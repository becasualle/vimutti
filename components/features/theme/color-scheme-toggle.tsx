'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ColorSchemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex justify-center gap-2 mt-8">
      <Button onClick={() => setTheme('light')}>Light</Button>
      <Button onClick={() => setTheme('dark')}>Dark</Button>
      <Button onClick={() => setTheme('system')}>Auto</Button>
    </div>
  );
}
