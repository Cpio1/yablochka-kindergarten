import Image from "next/image";
import { Fragment } from "react";
import { getDictionary, PHONE_TOKEN, type Locale, type SectionId } from "@/lib/i18n";
import { getMedia, type AboutMedia, type Photo } from "@/lib/media";
import { hoursText, site } from "@/lib/site";
import {
  AppleMark,
  ClockIcon,
  DocIcon,
  FourApples,
  HeroApple,
  InstagramIcon,
  PaperApple,
  PaperCamera,
  PencilUnderline,
  PhoneIcon,
  Plate,
  StemLeaf,
  Twig,
  WhatsAppIcon,
} from "./art";
import { Gallery } from "./Gallery";
import {
  Backdrop,
  BlossomBranch,
  BlueStroke,
  Butterfly,
  Cloud,
  Daisy,
  FruitStillLife,
  GardenHills,
  HeroHill,
  Kite,
  Ladybug,
  PaperPlane,
  PlaneWithTrail,
  Sun,
  Tape,
  Wave,
} from "./scenery";
import { SectionLink } from "./SectionLink";
import { SiteHeader } from "./SiteHeader";

const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";
const btnPrimary =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-apple px-7 text-[1.0625rem] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(185_51_53/0.8)] transition-[background-color,transform] duration-150 hover:bg-apple-dark active:translate-y-px";
const btnSecondary =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-ink/20 bg-paper px-6 text-[1.0625rem] font-semibold text-ink transition-colors duration-150 hover:border-ink";
const h2 = "font-display text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.01em] text-ink";
const h3 = "font-display text-[1.25rem] font-semibold leading-snug text-ink lg:text-[1.375rem]";
const eyebrow = "text-[1rem] font-semibold text-ink-soft";
const lead = "text-[clamp(1.0625rem,1rem+0.35vw,1.25rem)] leading-relaxed text-ink";

export function Landing({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const media = getMedia();
  const hasGallery = media.gallery.length > 0;
  const hasDocs = Boolean(site.documentsFolder) || site.documents.length > 0;

  const navIds: SectionId[] = [
    "about",
    "groups",
    "food",
    ...(hasGallery ? (["gallery"] as const) : []),
    "faq",
    ...(hasDocs ? (["documents"] as const) : []),
    "contacts",
  ];
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
        {hasGallery && <GallerySection locale={locale} photos={media.gallery} />}
        <Faq locale={locale} />
        {hasDocs && <Documents locale={locale} />}
        <Contacts locale={locale} />
      </main>

      {/* Подвал — продолжение ближнего холма из раздела «Контакты». */}
      <footer className="bg-hill-front text-ink">
        <div className={`${container} flex flex-col gap-3 pb-8 pt-4 text-[0.9375rem] text-ink sm:flex-row sm:items-center sm:justify-between`}>
          <p className="flex items-center gap-2 font-semibold text-ink">
            <AppleMark className="h-7 w-7" />
            {t.footer.name}
          </p>
          <p>
            {t.footer.legal}: {site.legalName} · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}

/* ───────────── Первый экран: «Подходит ли нам сад по возрасту и графику?» ───────────── */

/** «Открываемся в 08:00» → ["Открываемся в ", "08:00", ""]; «08:00-де ашыламыз» → ["", "08:00", "-де ашыламыз"]. */
function splitTime(s: string): [string, string, string] {
  const m = s.match(/^(.*?)(\d{2}:\d{2})(.*)$/);
  return m ? [m[1], m[2], m[3]] : [s, "", ""];
}

function TimePart({ text }: { text: string }) {
  const [before, time, after] = splitTime(text);
  return (
    <span>
      {before}
      <strong className="font-bold tabular-nums">{time}</strong>
      {after}
    </span>
  );
}

function Hero({ locale, photo }: { locale: Locale; photo: Photo | null }) {
  const d = getDictionary(locale);
  const t = d.hero;
  // Яблочко из цветной бумаги рядом с названием: небольшое, не мешает заголовку и кнопке звонка.
  const kicker = (
    <span className="flex items-center gap-2 text-[clamp(1.375rem,1.05rem+1.4vw,2.125rem)] font-semibold leading-tight text-ink">
      {t.kicker}
      <PaperApple className="h-[1.5em] w-[1.5em] shrink-0 -translate-y-0.5" />
    </span>
  );
  const title = (
    <span className="block text-[clamp(3rem,1.9rem+5.2vw,5.75rem)] font-bold leading-[0.98] tracking-[-0.02em] text-apple">{t.title}</span>
  );

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate bg-cream pt-(--header-h) lg:flex lg:min-h-[min(100svh,880px)] lg:items-center"
    >
      {/* Под названием, описанием и кнопками фон остаётся чистым: фигурки — только в полосе под шапкой и у краёв. */}
      <Backdrop>
        {/* Телефон: одно солнце в правом верхнем углу, справа от названия. */}
        <Sun className="absolute right-3 top-[calc(var(--header-h)+0.5rem)] w-11 sm:right-6 sm:w-14 lg:hidden" />
        {/* Ноутбук: солнце и два облака в свободной полосе между шапкой и заголовком (если окно достаточно высокое). */}
        <div className="hidden lg:[@media(min-height:740px)]:block">
          <Sun className="absolute left-[max(14rem,calc(50%-600px+15rem))] top-[calc(var(--header-h)+0.6rem)] w-[clamp(44px,7svh,68px)]" />
          <Cloud className="absolute left-[max(20rem,calc(50%-600px+22rem))] top-[calc(var(--header-h)+1.1rem)] w-[clamp(72px,10svh,118px)]" />
          <Cloud variant={1} className="absolute right-[max(2rem,calc(50%-600px+4rem))] top-[calc(var(--header-h)+1.6rem)] w-[clamp(52px,7svh,84px)]" />
        </div>
        <HeroHill className="absolute inset-x-0 bottom-0 h-7 w-full sm:h-10 lg:h-[72px]" />
      </Backdrop>
      <div
        className={`${container} grid items-center gap-6 pb-10 pt-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:py-8 xl:gap-16 [@media(max-height:700px)]:pt-3`}
      >
        <div className="max-w-xl lg:max-w-[38rem]">
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
          {/* Полное вступление; на низких экранах — короткая версия, чтобы часы и кнопка остались на виду. */}
          <p className={`${lead} mt-4 max-w-[44ch] lg:mt-6 [@media(max-height:620px)]:hidden`}>{t.intro}</p>
          <p className={`${lead} mt-3 hidden max-w-[34ch] [@media(max-height:620px)]:block`}>{t.introShort}</p>

          {/* Часы работы: на телефоне — две строки, шире — одна строка через точку. */}
          <p className="mt-4 inline-flex items-start gap-2.5 rounded-2xl bg-leaf px-4 py-2.5 text-[1.0625rem] leading-snug text-ink lg:mt-6">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-leaf-deep" />
            <span className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-2">
              <TimePart text={t.opens} />
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
              <TimePart text={t.closes} />
            </span>
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:mt-8 [@media(max-height:700px)]:mt-4">
            <a href={site.phone.href} className={`${btnPrimary} w-full sm:w-auto`}>
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {d.call}
            </a>
            <SectionLink to="groups" className={`${btnSecondary} w-full sm:w-auto`}>
              {t.groupsLink}
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </SectionLink>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <Butterfly className="decor pointer-events-none absolute -top-4 right-0 z-10 hidden w-24 lg:block xl:-right-6 xl:w-28" />
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

/* ───────────── О садике: представление о «Яблочке» ───────────── */

function About({ locale, media }: { locale: Locale; media: AboutMedia | null }) {
  const t = getDictionary(locale).about;

  const intro = (
    <div className={media ? "lg:col-start-2" : ""}>
      <h2 id="about-title" className={h2}>
        {t.title}
      </h2>
      {/* Штрих цветного карандаша с листочком на правом конце. */}
      <PencilUnderline className="mt-2 h-5 w-40 lg:h-6 lg:w-52" />
      <p className={`${lead} mt-3 max-w-[60ch] lg:mt-4`}>{t.intro}</p>
    </div>
  );

  // Отдельный абзац для семьи, которая впервые выбирает сад.
  const firstTime = (
    <div className={`rounded-[1.75rem] border-2 border-line bg-paper p-6 sm:p-8 ${media ? "lg:col-start-2" : ""}`}>
      <h3 className={h3}>{t.firstTimeTitle}</h3>
      <p className="mt-3 leading-relaxed text-ink">{t.firstTime}</p>
      <a
        href={site.phone.href}
        className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full font-semibold text-apple underline decoration-apple/35 decoration-2 underline-offset-4 hover:decoration-apple"
      >
        <PhoneIcon className="h-5 w-5 shrink-0" />
        <span className="tabular-nums">{site.phone.display}</span>
      </a>
    </div>
  );

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate bg-[linear-gradient(to_bottom,var(--color-meadow)_0,var(--color-warm)_9rem)] py-12 lg:py-20"
    >
      <Backdrop>
        {/* Ветка яблони входит в кадр сбоку, у внешнего края; текст остаётся на ровном фоне. */}
        <BlossomBranch className="absolute -right-6 -top-2 w-24 lg:hidden" />
        <BlossomBranch className="absolute -right-12 top-8 hidden w-[clamp(220px,22vw,320px)] lg:block xl:right-[max(-3rem,calc(50%-600px-8rem))]" />
      </Backdrop>
      <div className={container}>
        {/* Телефон: заголовок → вступление → фото/видео → информация для родителей. */}
        <div data-anchor className={`grid gap-7 lg:grid-cols-2 lg:gap-x-16 ${media ? "lg:gap-y-8" : "lg:items-start"}`}>
          {intro}
          {media && <AboutMediaView media={media} t={t} />}
          {firstTime}
        </div>
      </div>
    </section>
  );
}

function AboutMediaView({ media, t }: { media: AboutMedia; t: ReturnType<typeof getDictionary>["about"] }) {
  const place = "lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center";
  if (media.kind === "image") {
    // Подпись к кадру не выводится: содержание снимка не подтверждено, alt нейтральный.
    return (
      <div className={`overflow-hidden rounded-[2rem] bg-line ${place}`} style={{ aspectRatio: `${media.width} / ${media.height}` }}>
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
    <div className={`mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-ink ${place}`} style={{ aspectRatio: ratio }}>
      {/* Без автозапуска: звук включает сам пользователь через стандартные элементы управления. */}
      <video controls playsInline preload="metadata" poster={media.poster?.src} aria-label={t.videoLabel} className="h-full w-full object-contain">
        <source src={media.src} type={media.type} />
      </video>
    </div>
  );
}

/* ───────────── Группы: «Как узнать про группу для моего ребёнка?» ───────────── */

function Groups({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).groups;
  return (
    <section id="groups" aria-labelledby="groups-title" className="relative isolate bg-sprout py-12 lg:py-16">
      <Wave color="var(--color-sprout)" variant={0} />
      <Backdrop>
        {/* От 1360px: воздушный змей в свободном правом поле рядом с «4 группы» (не заходит под карточку).
            Уже — только ветка с яблоками у заголовка. */}
        <Kite className="absolute right-[max(0.5rem,calc(50%-600px-8.5rem))] top-6 hidden w-[clamp(84px,8vw,124px)] rotate-6 min-[1360px]:block" />
      </Backdrop>
      <div className={container}>
        <div data-anchor className="grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            {/* Телефон: одна небольшая веточка в строке подписи — без отдельной строки под декор. */}
            <div className="flex items-center justify-between gap-3">
              <p className={eyebrow}>{t.eyebrow}</p>
              <FourApples className="h-auto w-28 shrink-0 lg:hidden" />
            </div>
            <div className="mt-2 flex items-center gap-6">
              {/* Читается как «4 группы для детей от 2 до 6 лет». */}
              <h2 id="groups-title" className="flex min-w-0 items-center gap-4 font-display text-ink sm:gap-5">
                <span className="text-[clamp(5rem,3.8rem+6vw,8.5rem)] font-bold leading-[0.8] tracking-[-0.04em] text-apple">{site.groups}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-bold leading-none">{t.unit}</span>
                  <span className="max-w-[20ch] text-[clamp(1.0625rem,0.95rem+0.6vw,1.5rem)] font-semibold leading-snug">{t.age}</span>
                </span>
              </h2>
              {/* Ноутбук: ветка с четырьмя яблоками рядом с «4 группы». */}
              <FourApples className="hidden h-auto w-[clamp(150px,14vw,210px)] shrink-0 lg:block" />
            </div>
            <p className="mt-5 max-w-[58ch] leading-relaxed text-ink lg:text-[1.125rem]">{t.text}</p>
          </div>

          <div className="flex flex-col gap-5 lg:justify-center">
            <div className="rounded-[1.5rem] bg-paper/80 p-4 sm:p-7">
              <h3 className={h3}>{t.askTitle}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {t.ask.map((q) => (
                  <li key={q} className="flex gap-3 leading-snug text-ink">
                    <span aria-hidden="true" className="decor mt-[0.45em] h-2.5 w-2.5 shrink-0 rounded-full bg-apple" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href={site.phone.href} className={`${btnPrimary} w-full sm:w-auto sm:self-start`}>
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Питание: «Сколько раз дети едят и где узнать меню?» ───────────── */

function Food({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).food;
  return (
    <section id="food" aria-labelledby="food-title" className="relative isolate bg-honey py-12 lg:py-16">
      <Wave color="var(--color-honey)" variant={1} />
      <Backdrop>
        {/* Ноутбук: натюрморт вдоль нижнего края под колонкой с цифрой 5. Телефон: только тарелка у заголовка. */}
        <FruitStillLife className="absolute bottom-0 left-[max(1rem,calc(50%-600px+1.5rem))] hidden w-[clamp(190px,17vw,240px)] lg:block" />
      </Backdrop>
      <div className={container}>
        <div data-anchor className="grid gap-x-14 gap-y-5 lg:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex items-center gap-3 lg:col-start-2 lg:block">
            <div className="min-w-0 flex-1">
              <p className={eyebrow}>{t.eyebrow}</p>
              <h2 id="food-title" className={`${h2} mt-2`}>
                {t.title}
              </h2>
            </div>
            {/* Телефон: тарелка сбоку от заголовка, а не отдельной строкой. */}
            <Plate className="w-20 shrink-0 sm:w-24 lg:hidden" />
          </div>

          {/* Визуальный акцент на цифре 5 (смысл уже передан заголовком). */}
          <div
            aria-hidden="true"
            className="decor hidden lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:flex lg:flex-col lg:items-start lg:justify-center lg:gap-2"
          >
            <span className="flex items-end gap-2 font-display text-ink">
              <span className="text-[clamp(5rem,3.8rem+6vw,8.5rem)] font-bold leading-[0.8] tracking-[-0.04em] text-apple">{site.meals}</span>
              <span className="pb-1 text-[1.25rem] font-semibold leading-tight lg:text-[1.5rem]">{t.countCaption}</span>
            </span>
            <Plate className="mt-4 w-40" />
          </div>

          <p className="max-w-[62ch] leading-relaxed text-ink lg:col-start-2 lg:text-[1.125rem]">{t.text}</p>

          <div className="rounded-[1.5rem] bg-paper/80 p-4 sm:p-7 lg:col-start-2">
            <h3 className={h3}>{t.specialTitle}</h3>
            <p className="mt-3 leading-relaxed text-ink">{t.special}</p>
            {site.menu && (
              <a href={site.menu.href} target="_blank" rel="noopener" className={`${btnSecondary} mt-5`}>
                <DocIcon className="h-5 w-5 shrink-0 text-apple" />
                {t.menu}
                <span className="font-normal text-ink-soft">· {site.menu.label[locale]}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Галерея (только когда есть реальные фото) ───────────── */

function GallerySection({ locale, photos }: { locale: Locale; photos: Photo[] }) {
  const t = getDictionary(locale).gallery;
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative isolate bg-paper py-14 lg:py-20">
      <Wave color="var(--color-paper)" variant={2} />
      <div className={container}>
        {/* Заголовок — как начало страницы детского альбома: скотч, фотоаппарат, голубой штрих карандаша. */}
        <div data-anchor className="relative mb-6 max-w-2xl lg:mb-10">
          <Tape className="pointer-events-none absolute -top-7 left-1 w-20 -rotate-6 lg:-top-9 lg:w-24" />
          <div className="flex items-center gap-3 lg:gap-4">
            <h2 id="gallery-title" className={h2}>
              {t.title}
            </h2>
            <PaperCamera className="h-9 w-11 shrink-0 lg:h-12 lg:w-14" />
          </div>
          <BlueStroke className="mt-1 h-4 w-44 lg:h-5 lg:w-56" />
          <p className={`${lead} mt-3`}>{t.intro}</p>
        </div>
        <Gallery locale={locale} photos={photos} />
      </div>
    </section>
  );
}

/* ───────────── Вопросы родителей: доступный аккордеон на <details>/<summary> ───────────── */

function Faq({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).faq;
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative isolate bg-sky py-12 lg:py-20">
      <Wave color="var(--color-sky)" variant={0} flip />
      <Backdrop>
        {/* Телефон: маленький самолётик в верхнем отступе, справа от заголовка. */}
        <PaperPlane className="absolute right-4 top-2 w-12 lg:hidden" />
        {/* От 1360px (поле шире самолётика): самолётик со следом вдоль внешнего поля аккордеона — вопросы остаются на ровном фоне. */}
        <PlaneWithTrail className="absolute right-[max(0.25rem,calc(50%-600px-7rem))] top-8 hidden h-[min(420px,85%)] w-[100px] min-[1360px]:block" />
      </Backdrop>
      <div className={`${container} grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
        <div data-anchor className="relative">
          <h2 id="faq-title" className={h2}>
            {t.title}
          </h2>
          <p className="mt-3 max-w-[36ch] leading-relaxed text-ink-soft">{t.lead}</p>
          {/* 1024–1359px: боковые поля узкие — самолётик под заголовком, в свободной части левой колонки. */}
          <PaperPlane className="pointer-events-none absolute left-0 top-full mt-8 hidden w-20 -rotate-6 lg:block min-[1360px]:hidden" />
        </div>
        <div className="border-t-2 border-sky-line">
          {t.items.map((item) => (
            <details key={item.q} className="group border-b-2 border-sky-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-xl py-4 font-display text-[1.125rem] font-semibold leading-snug text-ink transition-colors hover:text-apple lg:text-[1.25rem] [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="decor flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf text-ink transition-transform duration-200 group-open:rotate-45"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[62ch] pb-5 pr-2 leading-relaxed text-ink lg:pr-14">
                <WithPhone text={item.a} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Подставляет вместо {phone} кликабельный номер. */
function WithPhone({ text }: { text: string }) {
  const parts = text.split(PHONE_TOKEN);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <a href={site.phone.href} className="whitespace-nowrap font-semibold text-apple underline decoration-apple/35 underline-offset-2 hover:decoration-apple">
              {site.phone.display}
            </a>
          )}
        </Fragment>
      ))}
    </>
  );
}

/* ───────────── Документы (только когда есть папка или файлы) ───────────── */

function Documents({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).documents;
  return (
    <section id="documents" aria-labelledby="documents-title" className="relative isolate bg-sky pb-12 lg:pb-20">
      <div className={container}>
        <div data-anchor className="rounded-[2rem] border-2 border-line bg-paper px-5 py-7 sm:px-10 lg:px-14 lg:py-12">
          <h2 id="documents-title" className={h2}>
            {t.title}
          </h2>
          {site.documentsFolder && (
            <>
              <p className="mt-3 max-w-[60ch] leading-relaxed text-ink">{t.folderText}</p>
              <a href={site.documentsFolder} target="_blank" rel="noopener" className={`${btnSecondary} mt-5`}>
                <DocIcon className="h-5 w-5 shrink-0 text-apple" />
                {t.openFolder}
              </a>
            </>
          )}
          {site.documents.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {site.documents.map((doc) => (
                <li key={doc.href}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener"
                    className="flex min-h-16 items-center gap-3 rounded-2xl border-2 border-line bg-cream px-5 py-3 font-semibold text-ink transition-colors hover:border-ink"
                  >
                    <DocIcon className="h-6 w-6 shrink-0 text-apple" />
                    <span>{doc.label[locale]}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Контакты: «Куда обратиться и что можно уточнить?» ───────────── */

function Contacts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contacts;
  const card = "flex min-h-[4.5rem] items-center gap-4 rounded-[1.5rem] px-5 py-4 transition-colors";
  const label = "block text-[0.9375rem] leading-snug";
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="relative isolate bg-garden pb-24 pt-14 sm:pb-28 lg:pb-40 lg:pt-20">
      <Wave color="var(--color-garden)" variant={1} flip />
      {/* Сад внизу страницы. Нижний отступ секции выше холмов — телефон, часы и кнопки остаются над ними. */}
      <Backdrop>
        <GardenHills className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-20 lg:h-[120px]" />
        {/* Телефон: одна божья коровка на холме. */}
        <Ladybug className="absolute bottom-7 right-8 w-8 sm:hidden" />
        {/* Шире: ромашки на обоих холмах и божья коровка. */}
        <div className="hidden sm:block">
          <Daisy className="absolute bottom-6 left-[6%] w-7 lg:bottom-12 lg:w-9" />
          <Daisy className="absolute bottom-4 left-[10%] w-5 lg:bottom-9 lg:w-7" />
          <Daisy className="absolute bottom-3 left-[47%] w-6 lg:bottom-6 lg:w-8" />
          <Daisy className="absolute bottom-5 right-[14%] w-7 lg:bottom-10 lg:w-9" />
          <Daisy className="absolute bottom-3 right-[9%] w-5 lg:bottom-7 lg:w-7" />
          <Ladybug className="absolute bottom-8 right-[24%] w-8 lg:bottom-14 lg:w-10" />
        </div>
      </Backdrop>
      <div className={`${container} grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16`}>
        <div data-anchor>
          <Twig className="mb-3 h-6 w-24" />
          <h2 id="contacts-title" className={h2}>
            {t.title}
          </h2>
          <p className={`${lead} mt-4 max-w-[46ch]`}>{t.lead}</p>
        </div>

        <ul className="grid gap-3">
          <li>
            <a href={site.phone.href} className={`${card} bg-apple text-white shadow-[0_10px_24px_-14px_rgb(185_51_53/0.9)] hover:bg-apple-dark`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <PhoneIcon className="h-6 w-6" />
              </span>
              <span>
                <span className={`${label} text-white`}>{t.phone}</span>
                <span className="whitespace-nowrap font-display text-[clamp(1.375rem,1.1rem+1.2vw,1.875rem)] font-bold tabular-nums">
                  {site.phone.display}
                </span>
              </span>
            </a>
          </li>
          <li>
            <a href={site.instagram.href} target="_blank" rel="noopener" className={`${card} border-2 border-line bg-paper text-ink hover:border-ink`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-apple-soft text-apple">
                <InstagramIcon className="h-6 w-6" />
              </span>
              <span>
                <span className={`${label} text-ink-soft`}>{t.instagram}</span>
                <span className="font-display text-[1.25rem] font-semibold">{site.instagram.handle}</span>
              </span>
            </a>
          </li>
          {site.whatsapp && (
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener" className={`${card} border-2 border-line bg-paper text-ink hover:border-ink`}>
                <WhatsAppIcon className="h-6 w-6 shrink-0 text-leaf-deep" />
                <span className="font-semibold">{t.whatsapp}</span>
              </a>
            </li>
          )}
          {site.map2gis && (
            <li>
              <a href={site.map2gis} target="_blank" rel="noopener" className={`${card} border-2 border-line bg-paper text-ink hover:border-ink`}>
                <span className="font-semibold">{t.map}</span>
              </a>
            </li>
          )}
          <li className={`${card} bg-paper/70 text-ink`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf text-leaf-deep">
              <ClockIcon className="h-6 w-6" />
            </span>
            <span>
              <span className={`${label} text-ink-soft`}>{t.hours}</span>
              <span className="font-display text-[1.25rem] font-semibold tabular-nums">{hoursText}</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
