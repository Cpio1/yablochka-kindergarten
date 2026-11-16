import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { body, display } from "@/lib/fonts";
import { getDictionary, isLocale, LANG_STORAGE_KEY, localePath, locales } from "@/lib/i18n";
import { resolveSiteUrl, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#fff8ec",
  colorScheme: "only light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  const base = resolveSiteUrl();
  return {
    metadataBase: base,
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.name,
    alternates: base
      ? { canonical: localePath(lang), languages: { ru: localePath("ru"), kk: localePath("kk"), "x-default": localePath("ru") } }
      : undefined,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "kk" ? "kk_KZ" : "ru_RU",
      ...(base ? { url: localePath(lang) } : {}),
    },
    formatDetection: { telephone: false },
  };
}

/** Первый визит — русская версия. Если раньше выбран казахский, «/» сразу открывает «/kk» (до отрисовки). */
const restoreLanguageScript = `try{if(location.pathname==="/"&&localStorage.getItem(${JSON.stringify(
  LANG_STORAGE_KEY,
)})==="kk"){location.replace("/kk"+location.search+location.hash)}}catch(e){}`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`} style={{ colorScheme: "only light" }}>
      <head>{lang === "ru" && <script dangerouslySetInnerHTML={{ __html: restoreLanguageScript }} />}</head>
      <body>{children}</body>
    </html>
  );
}
