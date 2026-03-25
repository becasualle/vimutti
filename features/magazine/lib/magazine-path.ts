/**
 * Сегменты пути после `/magazine`: `[]` → `/magazine`, `['psychology','cbt']` → `/magazine/psychology/cbt`.
 */
export function magazineHref(segments: string[]): string {
  if (segments.length === 0) return '/magazine';
  return `/magazine/${segments.join('/')}`;
}
