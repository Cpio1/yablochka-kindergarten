"use client";

import { scrollToSection } from "./scroll";

/** Ссылка на раздел страницы с тем же отступом под шапкой, что и у пунктов меню. */
export function SectionLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        scrollToSection(to);
      }}
    >
      {children}
    </a>
  );
}
