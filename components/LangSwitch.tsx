"use client";

import { getDictionary, LANG_STORAGE_KEY, localePath, type Locale } from "@/lib/i18n";
import { currentSectionId } from "./scroll";

const options: { locale: Locale; short: string; name: string }[] = [
  { locale: "ru", short: "RU", name: "Русский" },
  { locale: "kk", short: "ҚАЗ", name: "Қазақша" },
];

export function LangSwitch({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const onSwitch = (e: React.MouseEvent<HTMLAnchorElement>, next: Locale) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* хранилище недоступно — выбор просто не запомнится */
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const id = currentSectionId();
    window.location.assign(localePath(next) + (id ? `#${id}` : ""));
  };

  return (
    <div role="group" aria-label={t.lang.label} className="flex items-center rounded-full border-2 border-ink/15 bg-paper p-0.5 text-ink">
      {options.map((o) =>
        o.locale === locale ? (
          <span
            key={o.locale}
            lang={o.locale}
            aria-current="true"
            className="inline-flex h-10 min-w-11 items-center justify-center rounded-full bg-ink px-2.5 text-[0.9375rem] font-bold text-cream"
          >
            <span aria-hidden="true">{o.short}</span>
            <span className="sr-only">{o.name}</span>
          </span>
        ) : (
          <a
            key={o.locale}
            href={localePath(o.locale)}
            hrefLang={o.locale}
            lang={o.locale}
            onClick={(e) => onSwitch(e, o.locale)}
            className="inline-flex h-10 min-w-11 items-center justify-center rounded-full px-2.5 text-[0.9375rem] font-bold text-ink transition-colors duration-150 hover:bg-leaf"
          >
            <span aria-hidden="true">{o.short}</span>
            <span className="sr-only">{o.name}</span>
          </a>
        ),
      )}
    </div>
  );
}
