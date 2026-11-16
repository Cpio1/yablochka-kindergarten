"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Photo } from "@/lib/media";

const MOBILE_INITIAL = 4;
const DESKTOP_INITIAL = 6;

/**
 * Одна сетка — две раскладки:
 *  телефон  — 2 столбца, до 4 превью, остальное по «Показать больше»;
 *  десктоп  — 3 столбца, до 6 превью; первый горизонтальный кадр занимает 2×2.
 */
export function Gallery({ locale, photos }: { locale: Locale; photos: Photo[] }) {
  const t = getDictionary(locale).gallery;
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastIndex = useRef(0);

  const n = photos.length;
  // Крупный горизонтальный кадр — только когда сетка остаётся ровной (3 или 6+ снимков).
  const featured = n === 3 || n >= 6 ? photos.findIndex((p) => p.width / p.height >= 1.25) : -1;
  const all = Array.from(photos.keys());
  // Крупный кадр ставим первым, остальные — в исходном порядке.
  const order = featured > 0 ? [featured, ...all.filter((i) => i !== featured)] : all;
  // На телефоне крупный кадр занимает всю строку: он + 2 превью, иначе 4 превью.
  const mobileInitial = featured === -1 ? MOBILE_INITIAL : 3;
  const desktopCols =
    n === 1 ? "lg:grid-cols-1 lg:max-w-3xl" : n === 2 || n === 4 ? "lg:grid-cols-2 lg:max-w-4xl lg:mx-auto" : "lg:grid-cols-3";

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
      // Возвращаем пользователя к снимку, на котором он остановился.
      const el = thumbs.current[back];
      if (el) {
        if (el.offsetParent === null) setExpanded(true);
        requestAnimationFrame(() => {
          el.scrollIntoView({ block: "nearest" });
          el.focus({ preventScroll: true });
        });
      }
    };
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  // Свайп на телефоне.
  const touchX = useRef<number | null>(null);

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className={`grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4 ${desktopCols}`}>
        {order.map((i, pos) => {
          const p = photos[i];
          const big = i === featured && featured !== -1;
          const hiddenMobile = !expanded && pos >= mobileInitial;
          const hiddenDesktop = !expanded && pos >= DESKTOP_INITIAL;
          return (
            <li
              key={p.src}
              className={[
                big ? "col-span-2 lg:row-span-2" : "",
                hiddenMobile ? "max-lg:hidden" : "",
                hiddenDesktop ? "lg:hidden" : "",
              ].join(" ")}
            >
              <button
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                type="button"
                onClick={() => open(i)}
                aria-label={t.open(i + 1)}
                className={`group relative block w-full overflow-hidden rounded-2xl bg-line/60 lg:rounded-3xl ${
                  big ? "aspect-[3/2] lg:aspect-auto lg:h-full" : n === 1 ? "aspect-[3/2]" : "aspect-[4/5] lg:aspect-[4/3]"
                }`}
              >
                <Image
                  src={p.src}
                  alt={t.photoAlt(i + 1)}
                  fill
                  sizes={big ? "(min-width:1024px) 760px, 100vw" : "(min-width:1024px) 380px, 50vw"}
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ objectPosition: p.focus ?? "50% 40%" }}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {(n > mobileInitial || n > DESKTOP_INITIAL) && (
        <div className={`mt-6 flex justify-center ${n > DESKTOP_INITIAL ? "" : "lg:hidden"}`}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-paper px-6 font-semibold text-ink transition-colors hover:bg-leaf"
          >
            {expanded ? t.less : t.more}
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label={t.viewer}
        onKeyDown={onKey}
        onClick={(e) => e.target === e.currentTarget && closeViewer()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-[#12241b] p-0 text-cream backdrop:bg-[#12241b] open:flex open:items-center open:justify-center open:motion-safe:animate-pop"
      >
        {current && index !== null && (
          <>
            <figure className="pointer-events-none flex h-full w-full items-center justify-center px-2 pb-20 pt-16 sm:px-20 sm:pb-16">
              <Image
                key={current.src}
                src={current.src}
                alt={t.photoAlt(index + 1)}
                width={current.width}
                height={current.height}
                sizes="100vw"
                className="pointer-events-auto h-full max-h-full w-auto max-w-full object-contain"
              />
            </figure>
            <p className="absolute left-4 top-4 rounded-full bg-[#12241b]/80 px-3 py-2 text-sm font-semibold text-cream" aria-live="polite">
              {t.counter(index + 1, n)}
            </p>
            <button
              type="button"
              onClick={closeViewer}
              aria-label={t.close}
              autoFocus
              className="absolute right-3 top-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg"
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
                  className="absolute bottom-4 left-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t.next}
                  className="absolute bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
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
