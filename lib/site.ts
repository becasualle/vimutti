/**
 * Единый бренд сайта: вкладка браузера, SEO `<title>`, Open Graph / Twitter, `siteName`, JSON-LD.
 */
export const SITE_NAME = 'Доказательная психология и практическая философия' as const;

export const BASE_URL = 'https://www.vimutti.ru' as const;

export const SITE_DESCRIPTION =
  'Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии, философии и буддизма.' as const;

/** Главная страница: базовое описание + уточнение тематики. */
export const HOME_PAGE_DESCRIPTION = `${SITE_DESCRIPTION} Статьи о КПТ, буддизме и стоицизме.`;
