"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Photo } from "@/lib/media";

/** Размер подборки: телефон/планшет — сетка 2 × 2, компьютер (от 1024px) — 3 × 2. */
const MOBILE_PER_PAGE = 4;
const DESKTOP_PER_PAGE = 6;
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useIsDesktop = () =>
  useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );

/**
 * Галерея с постраничным листанием: стрелки (и свайп) меняют подборку на месте,
 * поэтому высота раздела не зависит от количества снимков.
 * Сетка растягивается на всю высоту родителя (flex-1) — родитель задаёт высоту
 * по окну, чтобы заголовок, оба ряда и стрелки помещались на одном экране.
 */
export function Gallery({ locale, photos }: { locale: Locale; photos: Photo[] }) {
  const t = getDictionary(locale).gallery;
  const isDesktop = useIsDesktop();
  const perPage = isDesktop ? DESKTOP_PER_PAGE : MOBILE_PER_PAGE;
  const n = photos.length;
  const pages = Math.max(1, Math.ceil(n / perPage));

  // Храним индекс первого показанного снимка: при смене раскладки подборка остаётся «той же».
  const [first, setFirst] = useState(0);
  const page = Math.min(Math.floor(first / perPage), pages - 1);
  const shown = photos.slice(page * perPage, page * perPage + perPage);

  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastIndex = useRef(0);
  const focusAfter = useRef<number | null>(null);

  const goPage = useCallback(
    (d: number) => setFirst((f) => (((Math.floor(f / perPage) + d) % pages + pages) % pages) * perPage),
    [perPage, pages],
  );

  const open = (i: number) => {
    lastIndex.current = i;
    setIndex(i);
  };
  const closeViewer = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (index !== null && dlg && !dlg.open) dlg.showModal();
    if (index !== null) lastIndex.current = index;
  }, [index]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      const back = lastIndex.current;
      setIndex(null);
      // Возвращаемся к подборке со снимком, на котором остановились в просмотре.
      focusAfter.current = back;
      setFirst(back);
    };
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    const i = focusAfter.current;
    if (i === null || index !== null) return;
    focusAfter.current = null;
    requestAnimationFrame(() => thumbs.current[i]?.focus({ preventScroll: true }));
  }, [page, index]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  // Свайп: в просмотре — по снимкам, в сетке — по подборкам.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const swipe = (e: React.TouchEvent, go: (d: number) => void) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
  };

  const current = index === null ? null : photos[index];
  const arrow =
    "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink transition-colors hover:bg-leaf active:translate-y-px";

  return (
    <>
      <ul
        key={page}
        onTouchStart={pages > 1 ? onTouchStart : undefined}
        onTouchEnd={pages > 1 ? (e) => swipe(e, goPage) : undefined}
        className="grid min-h-0 flex-1 touch-pan-y grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 lg:grid-cols-3 lg:gap-4 motion-safe:animate-pop"
      >
        {shown.map((p, k) => {
          const i = page * perPage + k;
          return (
            <li key={p.src} className="min-h-0">
              <button
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                type="button"
                onClick={() => open(i)}
                aria-label={p.caption ? `${t.open(i + 1)}: ${p.caption[locale]}` : t.open(i + 1)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-line/60 lg:rounded-3xl"
              >
                <Image
                  src={p.src}
                  alt={p.caption?.[locale] ?? t.photoAlt(i + 1)}
                  fill
                  sizes="(min-width:1024px) 380px, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ objectPosition: p.focus ?? "50% 40%" }}
                />
                {p.caption && (
                  <span className="absolute inset-x-2 bottom-2 rounded-xl bg-cream/95 px-3 py-1.5 text-left text-[0.9375rem] font-medium leading-snug text-ink lg:inset-x-3 lg:bottom-3">
                    {p.caption[locale]}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {pages > 1 && (
        <nav aria-label={t.pager} className="mt-3 flex shrink-0 items-center justify-center gap-5 lg:mt-4">
          <button type="button" onClick={() => goPage(-1)} aria-label={t.prevPage} className={arrow}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="min-w-[4.5ch] text-center text-[1.0625rem] font-semibold tabular-nums text-ink" aria-live="polite">
            <span aria-hidden="true">
              {page + 1} / {pages}
            </span>
            <span className="sr-only">{t.pageStatus(page + 1, pages)}</span>
          </p>
          <button type="button" onClick={() => goPage(1)} aria-label={t.nextPage} className={arrow}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      )}

      <dialog
        ref={dialogRef}
        aria-label={t.viewer}
        onKeyDown={onKey}
        onClick={(e) => e.target === e.currentTarget && closeViewer()}
        onTouchStart={onTouchStart}
        onTouchEnd={(e) => swipe(e, step)}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-[#12241b] p-0 text-cream backdrop:bg-[#12241b] open:flex open:items-center open:justify-center open:motion-safe:animate-pop"
      >
        {current && index !== null && (
          <>
            <figure className="pointer-events-none flex h-full w-full items-center justify-center px-2 pb-20 pt-16 sm:px-20 sm:pb-16">
              <Image
                key={current.src}
                src={current.src}
                alt={current.caption?.[locale] ?? t.photoAlt(index + 1)}
                width={current.width}
                height={current.height}
                sizes="100vw"
                className="pointer-events-auto h-full max-h-full w-auto max-w-full object-contain"
              />
              {current.caption && (
                <figcaption className="pointer-events-auto absolute inset-x-20 bottom-5 text-center text-[1.0625rem] font-medium text-cream sm:bottom-4">
                  {current.caption[locale]}
                </figcaption>
              )}
            </figure>
            <p className="absolute left-4 top-4 z-10 rounded-full bg-[#12241b]/80 px-3 py-2 text-sm font-semibold text-cream" aria-live="polite">
              {t.counter(index + 1, n)}
            </p>
            <button
              type="button"
              onClick={closeViewer}
              aria-label={t.close}
              autoFocus
              className="absolute right-3 top-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t.prev}
                  className="absolute bottom-4 left-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t.next}
                  className="absolute bottom-4 right-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
