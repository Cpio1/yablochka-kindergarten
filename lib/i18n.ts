import { hoursText, site } from "./site";

export const locales = ["ru", "kk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const LANG_STORAGE_KEY = "yablochko-lang";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Русская версия живёт в корне «/», казахская — в «/kk». */
export function localePath(l: Locale): string {
  return l === "ru" ? "/" : "/kk";
}

export type SectionId = "about" | "groups" | "food" | "gallery" | "documents" | "contacts";

const { from: ageFrom, to: ageTo } = site.age;

const ru = {
  meta: {
    title: "Детский сад «Яблочко» — для детей от 2 до 6 лет",
    description: `Детский сад «Яблочко»: 4 группы для детей от ${ageFrom} до ${ageTo} лет, обучение на русском языке, 5-разовое питание. Время работы ${hoursText}. Телефон ${site.phone.display}.`,
  },
  skip: "Перейти к содержанию",
  homeLabel: "«Яблочко» — в начало страницы",
  nav: {
    about: "О садике",
    groups: "Группы",
    food: "Питание",
    gallery: "Галерея",
    documents: "Документы",
    contacts: "Контакты",
  } satisfies Record<SectionId, string>,
  menu: { open: "Открыть меню", close: "Закрыть меню", title: "Меню" },
  lang: { label: "Язык сайта" },
  hero: {
    kicker: "Детский сад",
    title: "«Яблочко»",
    titleOrder: "kicker-first" as "kicker-first" | "title-first",
    lead: `Для детей от ${ageFrom} до ${ageTo} лет. Обучение на русском языке`,
    hoursLabel: "Время работы",
    call: "Позвонить в садик",
    instagram: "Наш Instagram",
    imageAlt: "Дети в детском саду «Яблочко»",
  },
  about: {
    title: "О садике",
    text: [
      `В «Яблочке» четыре группы для детей от ${ageFrom} до ${ageTo} лет.`,
      "Занятия проходят на русском языке, для детей предусмотрено пятиразовое питание.",
    ],
    mediaAlt: "Жизнь в детском саду «Яблочко»",
    videoLabel: "Видео о детском саде «Яблочко»",
  },
  groups: {
    title: "Группы",
    unit: "группы",
    age: `Для детей от ${ageFrom} до ${ageTo} лет`,
  },
  food: {
    title: "Питание",
    headline: `${site.meals}-разовое питание`,
  },
  gallery: {
    title: "Фотографии",
    more: "Показать больше",
    less: "Свернуть",
    open: (n: number) => `Открыть фото ${n}`,
    photoAlt: (n: number) => `Фото из детского сада «Яблочко», ${n}`,
    viewer: "Просмотр фотографий",
    close: "Закрыть",
    prev: "Предыдущее фото",
    next: "Следующее фото",
    counter: (i: number, total: number) => `${i} из ${total}`,
  },
  documents: { title: "Документы", open: "Открыть" },
  contacts: {
    title: "Контакты",
    lead: "Позвоните — расскажем о садике и ответим на вопросы.",
    phone: "Телефон",
    hours: "Время работы",
    instagram: "Instagram",
    whatsapp: "Написать в WhatsApp",
    map: "Открыть в 2GIS",
  },
  footer: { rights: "Детский сад «Яблочко»", toTop: "Наверх" },
};

export type Dictionary = typeof ru;

const kk: Dictionary = {
  meta: {
    title: "«Яблочко» балабақшасы — 2 жастан 6 жасқа дейінгі балаларға",
    description: `«Яблочко» балабақшасы: ${ageFrom} жастан ${ageTo} жасқа дейінгі балаларға арналған 4 топ, оқыту тілі — орыс тілі, күніне 5 рет тамақтану. Жұмыс уақыты ${hoursText}. Телефон ${site.phone.display}.`,
  },
  skip: "Негізгі мазмұнға өту",
  homeLabel: "«Яблочко» — беттің басына",
  nav: {
    about: "Біз туралы",
    groups: "Топтар",
    food: "Тамақтану",
    gallery: "Галерея",
    documents: "Құжаттар",
    contacts: "Байланыс",
  },
  menu: { open: "Мәзірді ашу", close: "Мәзірді жабу", title: "Мәзір" },
  lang: { label: "Сайт тілі" },
  hero: {
    kicker: "балабақшасы",
    title: "«Яблочко»",
    titleOrder: "title-first",
    lead: `${ageFrom} жастан ${ageTo} жасқа дейінгі балаларға. Оқыту тілі — орыс тілі`,
    hoursLabel: "Жұмыс уақыты",
    call: "Балабақшаға қоңырау шалу",
    instagram: "Біздің Instagram",
    imageAlt: "«Яблочко» балабақшасындағы балалар",
  },
  about: {
    title: "Балабақша туралы",
    text: [
      `«Яблочко» балабақшасында ${ageFrom} жастан ${ageTo} жасқа дейінгі балаларға арналған төрт топ бар.`,
      "Сабақтар орыс тілінде өтеді, балалар күніне бес рет тамақтанады.",
    ],
    mediaAlt: "«Яблочко» балабақшасындағы күн",
    videoLabel: "«Яблочко» балабақшасы туралы бейне",
  },
  groups: {
    title: "Топтар",
    unit: "топ",
    age: `${ageFrom} жастан ${ageTo} жасқа дейінгі балаларға`,
  },
  food: {
    title: "Тамақтану",
    headline: `Күніне ${site.meals} рет тамақтану`,
  },
  gallery: {
    title: "Фотосуреттер",
    more: "Көбірек көрсету",
    less: "Жасыру",
    open: (n: number) => `${n}-фотоны ашу`,
    photoAlt: (n: number) => `«Яблочко» балабақшасынан фото, ${n}`,
    viewer: "Фотоларды қарау",
    close: "Жабу",
    prev: "Алдыңғы фото",
    next: "Келесі фото",
    counter: (i: number, total: number) => `${i} / ${total}`,
  },
  documents: { title: "Құжаттар", open: "Ашу" },
  contacts: {
    title: "Байланыс",
    lead: "Қоңырау шалыңыз — балабақша туралы айтып, сұрақтарыңызға жауап береміз.",
    phone: "Телефон",
    hours: "Жұмыс уақыты",
    instagram: "Instagram",
    whatsapp: "WhatsApp-қа жазу",
    map: "2GIS-те ашу",
  },
  footer: { rights: "«Яблочко» балабақшасы", toTop: "Жоғары" },
};

const dictionaries: Record<Locale, Dictionary> = { ru, kk };

export function getDictionary(l: Locale): Dictionary {
  return dictionaries[l];
}
