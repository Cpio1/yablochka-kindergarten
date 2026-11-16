"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getDictionary, type Locale, type SectionId } from "@/lib/i18n";
import type { Photo } from "@/lib/media";
import { hoursText, site } from "@/lib/site";
import { AppleMark, PhoneIcon } from "./art";
import { LangSwitch } from "./LangSwitch";
import { scrollToSection } from "./scroll";

type NavItem = { id: SectionId; label: string };

export function SiteHeader({ locale, nav, logo }: { locale: Locale; nav: NavItem[]; logo: Photo | null }) {
  const t = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Открытие страницы с #раздел (например, после смены языка): тот же отступ под шапкой, что и при переходе из меню.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && document.getElementById(id)) requestAnimationFrame(() => scrollToSection(id, true));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  };

  // Пока меню открыто: блокируем прокрутку страницы, закрываем по Esc, держим фокус внутри.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a,button")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    // Если окно расширили до десктопа — мобильное меню больше не нужно.
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    // Ждём, пока меню закроется и прокрутка освободится, затем переходим к разделу.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id, wasOpen)));
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 h-(--header-h) bg-cream/95 text-ink backdrop-blur-md transition-shadow duration-200 ${
        scrolled || open ? "shadow-[0_1px_0_var(--color-line),0_6px_20px_-12px_rgb(32_63_49/0.35)]" : ""
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          onClick={(e) => go(e, "top")}
          aria-label={t.homeLabel}
          className="-ml-1 flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-1"
        >
          {logo ? (
            <Image src={logo.src} alt="" width={logo.width} height={logo.height} priority className="h-10 w-auto lg:h-12" sizes="96px" />
          ) : (
            <AppleMark className="h-9 w-9 lg:h-11 lg:w-11" />
          )}
          <span className="font-display text-[1.375rem] font-bold leading-none tracking-tight lg:text-[1.625rem]">{t.hero.title.replace(/[«»]/g, "")}</span>
        </a>

        <nav aria-label={t.menu.title} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-[0.9875rem] font-semibold text-ink transition-colors duration-150 hover:bg-leaf xl:px-4"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <LangSwitch locale={locale} />
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/15 bg-paper text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.menu.close : t.menu.open}
            onClick={() => (open ? close(false) : setOpen(true))}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-(--header-h) z-40 overflow-y-auto overscroll-contain bg-cream text-ink motion-safe:animate-pop lg:hidden"
        >
          <nav aria-label={t.menu.title} className="mx-auto max-w-md px-4 pb-10 pt-4">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.id} className="border-b border-line last:border-b-0">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    className="flex min-h-14 items-center rounded-xl px-2 font-display text-[1.375rem] font-semibold text-ink active:bg-leaf"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={site.phone.href}
              className="mt-6 flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-apple px-6 text-[1.0625rem] font-semibold text-white"
            >
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {t.hero.call}
            </a>
            <p className="mt-3 text-center text-ink-soft">
              {t.hero.hoursLabel} · <span className="font-semibold tabular-nums text-ink">{hoursText}</span>
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
