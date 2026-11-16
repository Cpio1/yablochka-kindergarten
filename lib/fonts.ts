import { Golos_Text, Rubik } from "next/font/google";

/**
 * Заголовки — Rubik (мягкие скруглённые формы), текст — Golos Text (спокойный, читаемый).
 * Подмножество cyrillic-ext содержит казахские ә ғ қ ң ө ұ ү һ і в каждом используемом начертании.
 */
export const display = Rubik({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--ff-display",
});

export const body = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--ff-body",
});
