import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { body, display } from "@/lib/fonts";

export const metadata: Metadata = { title: "404 — Яблочко", robots: { index: false } };
export const viewport: Viewport = { themeColor: "#fff8ec", colorScheme: "only light" };

export default function GlobalNotFound() {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`} style={{ colorScheme: "only light" }}>
      <body>
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-4 px-6">
          <p className="font-display text-6xl font-bold text-apple">404</p>
          <h1 className="font-display text-2xl font-bold">
            Страница не найдена
            <span className="block text-lg font-medium text-ink-soft" lang="kk">Бет табылмады</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-apple px-6 font-semibold text-white hover:bg-apple-dark">
              На главную
            </Link>
            <Link href="/kk" lang="kk" className="inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-paper px-6 font-semibold text-ink">
              Басты бет
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
