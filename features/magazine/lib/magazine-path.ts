/**
 * @file Сборка пути URL под префиксом `/magazine` из массива сегментов.
 *
 * `[]` → `/magazine`, `['psychology','cbt']` → `/magazine/psychology/cbt`.
 */
export function magazineHref(segments: string[]): string {
  if (segments.length === 0) return '/magazine';
  return `/magazine/${segments.join('/')}`;
}
