import Image from "next/image";
import { getDictionary, type Locale, type SectionId } from "@/lib/i18n";
import { getMedia, type AboutMedia, type Photo } from "@/lib/media";
import { hoursText, site } from "@/lib/site";
import { AppleMark, ClockIcon, DocIcon, FourApples, HeroApple, InstagramIcon, PhoneIcon, Plate, StemLeaf, Twig, WhatsAppIcon } from "./art";
import { Gallery } from "./Gallery";
import { SiteHeader } from "./SiteHeader";

const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";
const btnPrimary =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-apple px-7 text-[1.0625rem] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(185_51_53/0.8)] transition-[background-color,transform] duration-150 hover:bg-apple-dark active:translate-y-px";
const h2 = "font-display text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.01em] text-ink";

export function Landing({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const media = getMedia();
  const hasGallery = media.gallery.length > 0;
  const hasDocs = site.documents.length > 0;

  const navIds: SectionId[] = ["about", "groups", "food", ...(hasGallery ? (["gallery"] as const) : []), ...(hasDocs ? (["documents"] as const) : []), "contacts"];
  const nav = navIds.map((id) => ({ id, label: t.nav[id] }));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        {t.skip}
      </a>
      <SiteHeader locale={locale} nav={nav} logo={media.logo} />

      <main id="main">
        <Hero locale={locale} photo={media.hero} />
        <About locale={locale} media={media.about} />
        <Groups locale={locale} />
        <Food locale={locale} />
        {hasGallery && (
          <section id="gallery" aria-labelledby="gallery-title" className="bg-paper py-14 lg:py-20">
            <div className={container}>
              <h2 id="gallery-title" data-anchor className={`${h2} mb-6 lg:mb-10`}>
                {t.gallery.title}
              </h2>
              <Gallery locale={locale} photos={media.gallery} />
            </div>
          </section>
        )}
        {hasDocs && (
          <section id="documents" aria-labelledby="documents-title" className="py-12 lg:py-16">
            <div className={container}>
              <h2 id="documents-title" data-anchor className={`${h2} mb-6`}>
                {t.documents.title}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {site.documents.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener"
                      className="flex min-h-16 items-center gap-3 rounded-2xl border-2 border-line bg-paper px-5 py-3 font-semibold text-ink transition-colors hover:border-ink"
                    >
                      <DocIcon className="h-6 w-6 shrink-0 text-apple" />
                      <span>{d.label[locale]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        <Contacts locale={locale} />
      </main>

      <footer className="border-t border-line bg-cream">
        <div className={`${container} flex flex-col gap-3 py-8 text-[0.9375rem] text-ink-soft sm:flex-row sm:items-center sm:justify-between`}>
          <p className="flex items-center gap-2 font-semibold text-ink">
            <AppleMark className="h-7 w-7" />
            {t.footer.rights}
          </p>
          <p>
            {site.legalName} · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}

/* ───────────── Первый экран ───────────── */

function Hero({ locale, photo }: { locale: Locale; photo: Photo | null }) {
  const t = getDictionary(locale).hero;
  const kicker = (
    <span className="block text-[clamp(1.375rem,1.05rem+1.4vw,2.125rem)] font-semibold leading-tight text-ink">{t.kicker}</span>
  );
  const title = (
    <span className="block text-[clamp(3.25rem,2rem+5.6vw,6rem)] font-bold leading-[0.98] tracking-[-0.02em] text-apple">{t.title}</span>
  );

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative pt-(--header-h) lg:flex lg:min-h-[min(100svh,880px)] lg:items-center"
    >
      <div
        className={`${container} grid items-center gap-6 pb-10 pt-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:py-8 xl:gap-16 [@media(max-height:700px)]:pt-3`}
      >
        <div className="max-w-xl">
          <h1 id="hero-title" className="font-display">
            {t.titleOrder === "kicker-first" ? (
              <>
                {kicker}
                {title}
              </>
            ) : (
              <>
                {title}
                {kicker}
              </>
            )}
          </h1>
          <p className="mt-4 max-w-[30ch] text-[clamp(1.125rem,1rem+0.55vw,1.375rem)] leading-snug text-ink lg:mt-6">{t.lead}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-[1.0625rem] text-ink lg:mt-5">
            <ClockIcon className="h-5 w-5 shrink-0 text-leaf-deep" />
            <span>
              {t.hoursLabel} · <strong className="font-bold tabular-nums">{hoursText}</strong>
            </span>
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5 lg:mt-8 [@media(max-height:700px)]:mt-5">
            <a href={site.phone.href} className={`${btnPrimary} w-full sm:w-auto`}>
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {t.call}
            </a>
            <a
              href={site.instagram.href}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-3 font-semibold text-ink underline decoration-apple/40 decoration-2 underline-offset-4 transition-colors hover:decoration-apple sm:justify-start"
            >
              <InstagramIcon className="h-5 w-5 shrink-0 text-apple" />
              {t.instagram}
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          {photo ? (
            <HeroPhoto photo={photo} alt={t.imageAlt} />
          ) : (
            <HeroApple className="h-[clamp(200px,34svh,320px)] w-auto sm:h-[360px] lg:h-[min(540px,calc(100svh-var(--header-h)-120px))] lg:min-h-[340px]" />
          )}
        </div>
      </div>
    </section>
  );
}

/** Фото в мягкой рамке + стебелёк с листом сверху + красная «яблочная» подложка: вместе читаются как яблоко. */
function HeroPhoto({ photo, alt }: { photo: Photo; alt: string }) {
  const ratio = photo.width / photo.height;
  return (
    <div className="relative mx-5 mt-6 sm:mx-6 lg:mr-6 lg:mt-0">
      <div
        aria-hidden="true"
        className="decor absolute -inset-3 rotate-[-3deg] rounded-[45%_45%_42%_42%/50%_50%_44%_44%] bg-apple sm:-inset-4"
      />
      <StemLeaf className="absolute -top-14 left-1/2 z-10 w-20 -translate-x-1/2 sm:-top-16 sm:w-24" />
      <div
        className="relative overflow-hidden rounded-[2rem] bg-line sm:rounded-[2.5rem]"
        style={{ aspectRatio: `${Math.max(0.75, Math.min(ratio, 1.5))}` }}
      >
        <Image
          src={photo.src}
          alt={alt}
          width={photo.width}
          height={photo.height}
          priority
          fetchPriority="high"
          sizes="(min-width:1024px) 560px, 92vw"
          className="h-[clamp(220px,40svh,420px)] w-full object-cover sm:h-[420px] lg:h-[min(540px,calc(100svh-var(--header-h)-140px))] lg:w-auto"
          style={{ objectPosition: photo.focus ?? "50% 35%" }}
        />
      </div>
    </div>
  );
}

/* ───────────── О садике ───────────── */

function About({ locale, media }: { locale: Locale; media: AboutMedia | null }) {
  const t = getDictionary(locale).about;
  const text = (
    <div data-anchor className={media ? "" : "max-w-2xl"}>
      <Twig className="mb-3 h-6 w-24" />
      <h2 id="about-title" className={h2}>
        {t.title}
      </h2>
      <p className="mt-4 text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-relaxed text-ink lg:mt-6">
        {t.text[0]} {t.text[1]}
      </p>
    </div>
  );

  return (
    <section id="about" aria-labelledby="about-title" className="py-12 lg:py-20">
      <div className={container}>
        {media ? (
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {text}
            <AboutMediaView media={media} t={t} />
          </div>
        ) : (
          text
        )}
      </div>
    </section>
  );
}

function AboutMediaView({ media, t }: { media: AboutMedia; t: ReturnType<typeof getDictionary>["about"] }) {
  if (media.kind === "image") {
    return (
      <div className="overflow-hidden rounded-[2rem] bg-line lg:order-first" style={{ aspectRatio: `${media.width} / ${media.height}` }}>
        <Image
          src={media.src}
          alt={t.mediaAlt}
          width={media.width}
          height={media.height}
          sizes="(min-width:1024px) 560px, 92vw"
          className="h-full max-h-[70svh] w-full object-cover"
          style={{ objectPosition: media.focus ?? "50% 40%" }}
        />
      </div>
    );
  }
  const ratio = media.poster ? `${media.poster.width} / ${media.poster.height}` : "4 / 5";
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-ink lg:order-first" style={{ aspectRatio: ratio }}>
      {/* Без автозапуска: звук включает сам пользователь через стандартные элементы управления. */}
      <video
        controls
        playsInline
        preload="metadata"
        poster={media.poster?.src}
        aria-label={t.videoLabel}
        className="h-full w-full object-contain"
      >
        <source src={media.src} type={media.type} />
      </video>
    </div>
  );
}

/* ───────────── Группы ───────────── */

function Groups({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).groups;
  return (
    <section id="groups" aria-labelledby="groups-title" className="pb-6 lg:pb-10">
      <div className={container}>
        <div data-anchor className="relative grid items-center gap-x-10 gap-y-3 overflow-hidden rounded-[2rem] bg-leaf px-6 py-7 sm:px-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:rounded-[2.75rem] lg:px-14 lg:py-12">
          <h2 id="groups-title" className={`${h2} lg:col-span-2`}>
            {t.title}
          </h2>
          <p className="flex items-center gap-4 text-ink sm:gap-6">
            <span className="font-display text-[clamp(5.5rem,4rem+7vw,9.5rem)] font-bold leading-[0.8] tracking-[-0.04em] text-apple">{site.groups}</span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-semibold leading-none">{t.unit}</span>
              <span className="max-w-[22ch] text-[clamp(1.0625rem,0.95rem+0.6vw,1.5rem)] font-medium leading-snug">{t.age}</span>
            </span>
          </p>
          <FourApples className="mt-1 w-[min(100%,260px)] justify-self-start lg:mt-0 lg:w-[340px] lg:justify-self-end" />
        </div>
      </div>
    </section>
  );
}

/* ───────────── Питание ───────────── */

function Food({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).food;
  return (
    <section id="food" aria-labelledby="food-title" className="py-6 lg:py-10">
      <div className={container}>
        <div data-anchor className="flex items-center gap-4 rounded-[2rem] bg-butter px-5 py-6 sm:gap-8 sm:px-10 lg:max-w-4xl lg:rounded-[2.75rem] lg:px-14 lg:py-10">
          <Plate className="w-24 shrink-0 sm:w-32 lg:w-40" />
          <div>
            <p className="text-[1.0625rem] font-semibold text-ink-soft">{t.title}</p>
            <h2 id="food-title" className="mt-1 font-display text-[clamp(1.625rem,1.25rem+1.8vw,2.5rem)] font-bold leading-[1.1] text-ink">
              {t.headline}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Контакты ───────────── */

function Contacts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contacts;
  const row =
    "flex min-h-16 items-center gap-4 rounded-2xl border-2 border-line bg-paper px-5 py-3 text-ink transition-colors";
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="py-14 lg:py-20">
      <div className={`${container} grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16`}>
        <div data-anchor>
          <Twig className="mb-3 h-6 w-24" />
          <h2 id="contacts-title" className={h2}>
            {t.title}
          </h2>
          <p className="mt-3 max-w-[34ch] text-ink-soft">{t.lead}</p>
          <p className="mt-6 text-[0.9375rem] text-ink-soft">{t.phone}</p>
          <a
            href={site.phone.href}
            className="mt-1 inline-flex min-h-14 items-center gap-3 rounded-2xl font-display text-[clamp(1.75rem,1.2rem+2.6vw,3.25rem)] font-bold leading-none text-apple underline decoration-apple/30 decoration-[3px] underline-offset-[6px] transition-colors hover:decoration-apple"
          >
            <span className="whitespace-nowrap tabular-nums">{site.phone.display}</span>
          </a>
        </div>

        <ul className="grid gap-3">
          <li className={row}>
            <ClockIcon className="h-6 w-6 shrink-0 text-leaf-deep" />
            <span>
              <span className="block text-[0.9375rem] text-ink-soft">{t.hours}</span>
              <span className="font-display text-xl font-semibold tabular-nums">{hoursText}</span>
            </span>
          </li>
          <li>
            <a href={site.instagram.href} target="_blank" rel="noopener" className={`${row} hover:border-ink`}>
              <InstagramIcon className="h-6 w-6 shrink-0 text-apple" />
              <span>
                <span className="block text-[0.9375rem] text-ink-soft">{t.instagram}</span>
                <span className="font-display text-xl font-semibold">{site.instagram.handle}</span>
              </span>
            </a>
          </li>
          {site.whatsapp && (
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener" className={`${row} hover:border-ink`}>
                <WhatsAppIcon className="h-6 w-6 shrink-0 text-leaf-deep" />
                <span className="font-semibold">{t.whatsapp}</span>
              </a>
            </li>
          )}
          {site.map2gis && (
            <li>
              <a href={site.map2gis} target="_blank" rel="noopener" className={`${row} hover:border-ink`}>
                <span className="font-semibold">{t.map}</span>
              </a>
            </li>
          )}
          <li className="pt-1">
            <a href={site.phone.href} className={`${btnPrimary} w-full`}>
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {getDictionary(locale).hero.call}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
