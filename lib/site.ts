/**
 * Единый источник фактов о садике. Меняйте данные только здесь —
 * обе языковые версии, мобильная и десктопная раскладки берут их отсюда.
 */
export const site = {
  name: "Яблочко",
  legalName: "ТОО Mary-May Group",
  phone: {
    display: "+7 701 100 37 30",
    href: "tel:+77011003730",
  },
  /**
   * WhatsApp. Пока заказчик не подтвердил номер — null, кнопка не выводится.
   * После подтверждения: "https://wa.me/77011003730".
   */
  whatsapp: null as string | null,
  hours: { from: "08:00", to: "18:30" },
  groups: 4,
  age: { from: 2, to: 6 },
  meals: 5,
  instagram: {
    handle: "@yablochko.kids",
    href: "https://www.instagram.com/yablochko.kids/",
  },
  /**
   * Документы. Раздел и пункт меню появляются, только если задана папка или хотя бы один файл.
   * folder — ссылка на папку, предоставленную заказчиком.
   * documents — отдельные файлы (в /public/docs/…); подпись — по реальному содержанию («Меню», «Лицензия»…).
   */
  documentsFolder: null as string | null,
  documents: [] as { href: string; label: { ru: string; kk: string } }[],
  /**
   * Актуальное меню (файл в /public/docs/ или ссылка). null — кнопка «Посмотреть меню» не выводится.
   * label — подпись с датой, например { ru: "Меню на ноябрь 2026", kk: "2026 жылғы қараша мәзірі" }.
   */
  menu: null as { href: string; label: { ru: string; kk: string } } | null,
  /** Ссылка 2GIS от заказчика. null — карта и ссылка не выводятся. */
  map2gis: null as string | null,
} as const;

export const hoursText = `${site.hours.from}–${site.hours.to}`;

/** Канонический адрес для метаданных. Задаётся в Vercel через SITE_URL или берётся из VERCEL_PROJECT_PRODUCTION_URL. */
export function resolveSiteUrl(): URL | undefined {
  const raw =
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}
