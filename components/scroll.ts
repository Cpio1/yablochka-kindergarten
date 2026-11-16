/** Переход к разделу с учётом фактической высоты фиксированной шапки. */
export function scrollToSection(id: string, instant = false) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduce || instant ? "auto" : "smooth";
  if (id === "top") {
    window.scrollTo({ top: 0, behavior });
    history.replaceState(null, "", location.pathname + location.search);
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  // Отступ = фактическая высота шапки + 12px (тот же, что scroll-padding-top для переходов по ссылке с #).
  const header = document.querySelector("header");
  const offset = (header?.getBoundingClientRect().height ?? 64) + 12;
  // Выравниваем первый видимый элемент раздела (data-anchor), а не его внутренний отступ.
  const target = el.querySelector<HTMLElement>("[data-anchor]") ?? el;
  window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior });
  history.replaceState(null, "", `#${id}`);
  // Переносим фокус в раздел для клавиатуры и скринридеров, не сдвигая страницу.
  const heading = el.querySelector<HTMLElement>("h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

/** Раздел, который сейчас под шапкой — чтобы при смене языка остаться на месте. */
export function currentSectionId(): string | null {
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
  const line = headerH + 24;
  let current: string | null = null;
  for (const el of document.querySelectorAll<HTMLElement>("main section[id]")) {
    if (el.getBoundingClientRect().top <= line) current = el.id;
  }
  return current;
}
