import "server-only";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/**
 * Медиафайлы ищутся при сборке в /public, /public/media и /public/images (без вложенных папок):
 *   main-page.(png|jpg|jpeg|webp|avif)    — первый экран
 *   main-page2.(тот же список | mp4|webm|mov) — раздел «О садике»
 *   main-page2-poster.(jpg|png|webp)      — обложка для видео (необязательно)
 *   logo.png                               — логотип в шапке (прозрачный фон сохраняется)
 *   остальные фото                         — галерея (в алфавитном порядке имён)
 * Имена сравниваются без учёта регистра, а в URL идёт фактическое имя файла —
 * поэтому пути совпадают и на macOS, и на Vercel (Linux).
 * Логотипы, иконки, обложки и точные дубликаты (по содержимому) в галерею не попадают.
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  /** object-position для превью; для групповых кадров можно сдвинуть, чтобы сохранить лица у краёв. */
  focus?: string;
  /** Короткая подпись — только по тому, что действительно видно на снимке. */
  caption?: { ru: string; kk: string };
};

export type AboutMedia =
  | ({ kind: "image" } & Photo)
  | { kind: "video"; src: string; type: string; poster?: Photo };

export type Media = {
  hero: Photo | null;
  about: AboutMedia | null;
  logo: Photo | null;
  gallery: Photo[];
};

/**
 * Ручные настройки отдельных снимков по имени файла:
 *  focus   — кадрирование превью (object-position);
 *  caption — подпись. Пишите только то, что видно в кадре, без имён детей, событий и названий групп.
 */
const photoMeta: Record<string, Pick<Photo, "focus" | "caption">> = {
  // "group-room.jpg": { focus: "50% 30%", caption: { ru: "Комната группы", kk: "Топ бөлмесі" } },
  "image1.jpeg": { focus: "50% 55%" },
  "image2.jpeg": { focus: "50% 60%" },
  "image3.jpeg": { focus: "50% 58%" },
  "image5.jpeg": { focus: "50% 62%" },
  "image7.jpeg": { focus: "50% 66%" },
  "image8.jpeg": { focus: "50% 62%" },
  "image9.jpeg": { focus: "50% 62%" },
  "image10.jpeg": { focus: "75% 62%" },
  "image11.jpeg": { focus: "50% 48%" },
  "image12.jpeg": { focus: "50% 58%" },
  "image14.jpeg": { focus: "50% 28%" },
  "image15.jpeg": { focus: "50% 32%" },
  "image16.jpeg": { focus: "45% 52%" },
  "image17.jpeg": { focus: "50% 30%" },
  "image18.jpeg": { focus: "35% 55%" },
  "image19.jpeg": { focus: "50% 58%" },
  "image20.jpeg": { focus: "40% 48%" },
};

/**
 * Почти одинаковые кадры (та же сцена, повторный снимок) — байтами они различаются,
 * поэтому отсеиваются вручную. В галерее остаётся по одному кадру каждой сцены.
 */
const EXCLUDE = new Set(["image4.jpeg", "image6.jpeg", "image13.jpeg"]);

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const VIDEO_EXT: Record<string, string> = { ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/mp4" };
const SERVICE = /(logo|icon|favicon|poster|screenshot|скрин|og-image|placeholder)/i;

type Entry = { file: string; url: string; abs: string; base: string; ext: string };

function listDir(dir: string, urlPrefix: string): Entry[] {
  try {
    return readdirSync(dir)
      .filter((f) => !f.startsWith("."))
      .map((file) => {
        const abs = path.join(dir, file);
        const ext = path.extname(file).toLowerCase();
        return { file, abs, ext, base: path.basename(file, path.extname(file)).toLowerCase(), url: `${urlPrefix}/${encodeURI(file)}` };
      })
      .filter((e) => statSync(e.abs).isFile());
  } catch {
    return [];
  }
}

function toPhoto(e: Entry): Photo | null {
  try {
    const buf = readFileSync(e.abs);
    const size = imageSize(buf);
    if (!size.width || !size.height) return null;
    // Учитываем EXIF-поворот (5–8 — портретная ориентация при альбомных пикселях).
    const rotated = size.orientation !== undefined && size.orientation >= 5;
    return {
      src: e.url,
      width: rotated ? size.height : size.width,
      height: rotated ? size.width : size.height,
      ...photoMeta[e.file],
    };
  } catch {
    return null;
  }
}

function hashOf(e: Entry) {
  return createHash("sha1").update(readFileSync(e.abs)).digest("hex");
}

let cached: Media | null = null;

export function getMedia(): Media {
  if (cached) return cached;
  const pub = path.join(process.cwd(), "public");
  const entries = [
    ...listDir(pub, ""),
    ...listDir(path.join(pub, "media"), "/media"),
    ...listDir(path.join(pub, "images"), "/images"),
  ];
  const images = entries.filter((e) => IMAGE_EXT.has(e.ext));

  const heroEntry = images.find((e) => e.base === "main-page");
  const aboutImage = images.find((e) => e.base === "main-page2");
  const aboutVideo = entries.find((e) => e.base === "main-page2" && e.ext in VIDEO_EXT);
  const posterEntry = images.find((e) => e.base === "main-page2-poster");
  const logoEntry = entries.find((e) => e.base === "logo" && e.ext === ".png");

  const hero = heroEntry ? toPhoto(heroEntry) : null;
  let about: AboutMedia | null = null;
  if (aboutImage) {
    const p = toPhoto(aboutImage);
    if (p) about = { kind: "image", ...p };
  } else if (aboutVideo) {
    const poster = posterEntry ? toPhoto(posterEntry) : null;
    about = { kind: "video", src: aboutVideo.url, type: VIDEO_EXT[aboutVideo.ext], poster: poster ?? undefined };
  }

  const seen = new Set<string>();
  for (const e of [heroEntry, aboutImage].filter(Boolean) as Entry[]) seen.add(hashOf(e));

  // Из одинаковых по содержимому файлов остаётся оригинал — файл с самым коротким именем («photo.jpg», а не «photo-copy.jpg»).
  const gallery = images
    .filter((e) => !e.base.startsWith("main-page") && !SERVICE.test(e.base) && !EXCLUDE.has(e.file))
    .sort((a, b) => a.file.length - b.file.length || a.file.localeCompare(b.file))
    .filter((e) => {
      const h = hashOf(e);
      if (seen.has(h)) return false;
      seen.add(h);
      return true;
    })
    .sort((a, b) => a.file.localeCompare(b.file, "ru", { numeric: true }))
    .map(toPhoto)
    .filter((p): p is Photo => p !== null);

  cached = { hero, about, logo: logoEntry ? toPhoto(logoEntry) : null, gallery };
  return cached;
}
