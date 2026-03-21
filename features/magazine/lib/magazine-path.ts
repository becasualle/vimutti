/** Сегменты пути после домена: `['psychology','cbt']` → `/magazine/psychology/cbt`. */
export function magazineHref(segments: string[]): string {
  return `/magazine/${segments.join('/')}`;
}
