import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <Landing locale={lang} />;
}
