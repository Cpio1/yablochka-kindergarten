/*
 * Фон-«разворот детской книжки про яблоневый сад».
 * Все фигурки — бумажная аппликация: плоские формы, мягкие неровные края,
 * лёгкая тень «под бумагой». Только декор: aria-hidden, pointer-events: none.
 *
 * Правила размещения:
 *  - каждый раздел — `relative isolate` со своим светлым фоном;
 *  - фигурки лежат в <Backdrop> (absolute inset-0, -z-10, overflow-hidden):
 *    не влияют на высоту секции и не создают горизонтальной прокрутки;
 *  - <Wave> поднимается из верхнего края секции в нижний отступ предыдущей.
 */

const SHADOW = "#203F31";
const RED = "#C63B3C";
const RED_LIGHT = "#E36A60";
const LEAF = "#5B8A45";
const LEAF_LIGHT = "#86BA5F";
const STEM = "#6B4A2B";
const SKY = "#6FB3DE";
const SKY_LIGHT = "#BFE0F4";
const SUN = "#FFC93C";
const SUN_DEEP = "#F4A922";
const CORAL = "#F47C64";
const CREAM = "#FFF3D6";
const SEED = "#4A2E1C";

type Props = { className?: string };

/** Фоновый слой секции. */
export function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className="decor pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {children}
    </div>
  );
}

/* ───────────── Волны между разделами ───────────── */

const WAVES = [
  "M0 30C200 6 380 6 600 24S1000 46 1220 22 1400 8 1440 14V48H0Z",
  "M0 18C160 40 420 44 700 20S1180 2 1440 28V48H0Z",
  "M0 26C120 12 260 10 420 26S700 42 900 22 1260 10 1440 30V48H0Z",
];

/** Плавная волна цвета текущей секции, заходящая в нижний отступ предыдущей. */
export function Wave({ color, variant = 0, flip = false }: { color: string; variant?: 0 | 1 | 2; flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={`decor pointer-events-none absolute inset-x-0 top-0 -z-10 h-6 w-full -translate-y-[calc(100%-1px)] lg:h-10 ${flip ? "-scale-x-100" : ""}`}
    >
      <path d={WAVES[variant]} fill={color} />
    </svg>
  );
}

/* ───────────── Первый экран ───────────── */

/** Солнце с неровными лучами. */
export function Sun({ className = "" }: Props) {
  const rays = [0, 38, 80, 118, 160, 200, 238, 282, 320].map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    const len = i % 2 ? 31 : 36; // неровная длина лучей
    const w = 0.17;
    const p = (r: number, da: number) => `${(40 + r * Math.cos(a + da)).toFixed(1)} ${(40 + r * Math.sin(a + da)).toFixed(1)}`;
    return `M${p(21, -w)}L${p(len, 0)}L${p(21, w)}Z`;
  });
  return (
    <svg viewBox="0 0 80 80" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <g transform="translate(1.5 2)" fill={SHADOW} opacity=".1">
        {rays.map((d, i) => (
          <path key={i} d={d} />
        ))}
        <circle cx="40" cy="40" r="20" />
      </g>
      {rays.map((d, i) => (
        <path key={i} d={d} fill={i % 2 ? SUN_DEEP : SUN} />
      ))}
      <path d="M40 19c12 0 21 9 21 21-.5 11-9.5 20.5-21 20.5S19 51 19.5 40C19 28 28 19 40 19Z" fill={SUN} />
      <path d="M30 31c3-4 8-6 12-5-5 2-9 6-10 11-2-1-3-3-2-6Z" fill="#FFE38A" />
    </svg>
  );
}

/** Облачко двух форм. */
export function Cloud({ className = "", variant = 0 }: Props & { variant?: 0 | 1 }) {
  const d =
    variant === 0
      ? "M16 50c-9 0-14-6-12-13 2-7 9-10 16-8 2-11 13-17 24-13 6-10 20-12 29-4 7-6 19-4 23 6 10-1 18 7 16 16-1 7-7 11-13 11H16Z"
      : "M12 38c-7 0-10-5-8-10 2-5 7-7 12-5 3-9 13-12 20-7 5-6 15-6 19 1 7-1 13 4 12 11-1 6-5 10-11 10H12Z";
  const vb = variant === 0 ? "0 0 120 60" : "0 0 76 46";
  return (
    <svg viewBox={vb} className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d={d} transform="translate(2 3)" fill={SKY} opacity=".3" />
      <path d={d} fill="#FFFFFF" stroke={SKY_LIGHT} strokeWidth="2" />
    </svg>
  );
}

/** Бабочка с коротким пунктирным следом. */
export function Butterfly({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 70" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M4 64C22 44 42 66 60 46S84 32 90 30" stroke={CORAL} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6" fill="none" />
      <g transform="translate(98 24) rotate(-14)">
        <g transform="translate(1.5 2)" fill={SHADOW} opacity=".12">
          <ellipse cx="-9" cy="-6" rx="10" ry="8" />
          <ellipse cx="9" cy="-6" rx="10" ry="8" />
        </g>
        <ellipse cx="-9" cy="-6" rx="10" ry="8" transform="rotate(-20 -9 -6)" fill={CORAL} />
        <ellipse cx="9" cy="-6" rx="10" ry="8" transform="rotate(20 9 -6)" fill={CORAL} />
        <ellipse cx="-7" cy="6" rx="6" ry="5" transform="rotate(20 -7 6)" fill={SUN} />
        <ellipse cx="7" cy="6" rx="6" ry="5" transform="rotate(-20 7 6)" fill={SUN} />
        <circle cx="-10" cy="-7" r="2.6" fill="#FFF3D6" />
        <circle cx="10" cy="-7" r="2.6" fill="#FFF3D6" />
        <path d="M0-10v20" stroke={SHADOW} strokeWidth="3" strokeLinecap="round" />
        <path d="M0-10c-2-5-5-7-8-8M0-10c2-5 5-7 8-8" stroke={SHADOW} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/** Плавная светло-зелёная линия холма по нижнему краю первого экрана. */
export function HeroHill({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M0 58C240 20 420 18 640 42S1040 84 1240 52 1400 30 1440 36V90H0Z" fill="var(--color-meadow)" />
      <path d="M0 58C240 20 420 18 640 42S1040 84 1240 52 1400 30 1440 36" stroke="var(--color-hill)" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ───────────── О садике ───────────── */

function Blossom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform="translate(1.5 2)" fill={SHADOW} opacity=".1">
        {petals.map((a) => (
          <circle key={a} cx={9 * Math.cos((a * Math.PI) / 180)} cy={9 * Math.sin((a * Math.PI) / 180)} r="8" />
        ))}
      </g>
      {petals.map((a) => (
        <circle key={a} cx={9 * Math.cos((a * Math.PI) / 180)} cy={9 * Math.sin((a * Math.PI) / 180)} r="8" fill="#FFFFFF" stroke="#F6D5CC" strokeWidth="1" />
      ))}
      <circle r="5" fill={CORAL} />
      <circle cx="-1.5" cy="-1.5" r="1.6" fill="#FFC7B8" />
    </g>
  );
}

function Leaf({ x, y, r = 0, s = 1, light = false }: { x: number; y: number; r?: number; s?: number; light?: boolean }) {
  const d = "M0 0c5-10 17-13 26-8-5 10-17 13-26 8Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={d} transform="translate(1.2 1.8)" fill={SHADOW} opacity=".1" />
      <path d={d} fill={light ? LEAF_LIGHT : LEAF} />
      <path d="M2-.6c6-3 13-5 21-6.4" stroke="#DCEBCF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Ветка яблони с белыми цветами, входящая в кадр справа. */
export function BlossomBranch({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 300 200" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M302 70C240 72 190 92 140 82S70 60 26 78" stroke={STEM} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M192 88C182 110 170 128 150 142" stroke={STEM} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M96 70C86 54 82 42 84 28" stroke={STEM} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <Leaf x={230} y={72} r={-150} s={1.1} />
      <Leaf x={160} y={84} r={30} light />
      <Leaf x={60} y={68} r={-160} s={0.9} />
      <Leaf x={172} y={118} r={60} s={0.8} />
      <Blossom x={120} y={64} />
      <Blossom x={84} y={26} s={0.8} />
      <Blossom x={36} y={80} s={0.9} />
      <Blossom x={150} y={144} s={0.95} />
      <Blossom x={214} y={54} s={0.75} />
    </svg>
  );
}

/* ───────────── Группы ───────────── */

/** Воздушный змей из цветной бумаги с изогнутым хвостом и бантиками. */
export function Kite({ className = "" }: Props) {
  const bow = (x: number, y: number, c: string, r: number) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M0 0l-9-6v12ZM0 0l9-6v12Z" fill={c} />
      <circle r="2.2" fill={SHADOW} opacity=".5" />
    </g>
  );
  return (
    <svg viewBox="0 0 140 210" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M70 8 112 54 70 112 28 54Z" transform="translate(2 3)" fill={SHADOW} opacity=".12" />
      <path d="M70 8 70 54 28 54Z" fill={CORAL} />
      <path d="M70 8 112 54 70 54Z" fill={SUN} />
      <path d="M28 54 70 54 70 112Z" fill={SKY} />
      <path d="M70 54 112 54 70 112Z" fill={LEAF_LIGHT} />
      <path d="M70 8v104M28 54h84" stroke={SHADOW} strokeWidth="1.4" opacity=".35" />
      <path d="M70 112C58 140 98 148 80 172S48 190 66 206" stroke={SHADOW} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".55" />
      {bow(66, 132, RED, -10)}
      {bow(86, 160, SKY, 15)}
      {bow(60, 188, SUN_DEEP, -5)}
    </svg>
  );
}

/* ───────────── Питание ───────────── */

/** Маленький натюрморт: яблочная долька, груша и пара листьев. */
export function FruitStillLife({ className = "" }: Props) {
  const pear =
    "M150 22c7 0 9 9 9 17 0 11 15 21 15 41 0 19-13 29-25 29s-25-10-25-29c0-20 15-30 15-41 0-8 3-17 11-17Z";
  return (
    <svg viewBox="0 0 260 116" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx="130" cy="110" rx="118" ry="6" fill={SHADOW} opacity=".08" />
      <Leaf x={190} y={100} r={-28} s={1.4} />
      <Leaf x={196} y={104} r={-70} s={1.1} light />
      <path d={pear} transform="translate(2 3)" fill={SHADOW} opacity=".12" />
      <path d={pear} fill="#A6C93A" />
      <path d="M135 70c2-12 8-20 12-24-2 10-3 22 0 34-6-2-12-6-12-10Z" fill="#C9E05E" />
      <path d="M150 23c0-7 2-12 6-16" stroke={STEM} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <Leaf x={156} y={14} r={-30} s={0.7} />
      <g transform="translate(26 74) rotate(-8)">
        <path d="M0 0h88A44 44 0 0 1 0 0Z" transform="translate(2 3)" fill={SHADOW} opacity=".12" />
        <path d="M0 0h88A44 44 0 0 1 0 0Z" fill={CREAM} stroke={RED} strokeWidth="7" strokeLinejoin="round" />
        <path d="M12 6h64A32 32 0 0 1 12 6Z" fill="#FFF8EC" opacity=".8" />
        <ellipse cx="36" cy="14" rx="4" ry="7" transform="rotate(-20 36 14)" fill={SEED} />
        <ellipse cx="52" cy="14" rx="4" ry="7" transform="rotate(20 52 14)" fill={SEED} />
      </g>
    </svg>
  );
}

/* ───────────── Галерея ───────────── */

/** Голубой штрих цветного карандаша. */
export function BlueStroke({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 220 22" className={`decor ${className}`} aria-hidden="true" focusable="false" preserveAspectRatio="xMinYMid meet">
      <path d="M4 12C46 7 92 15 136 10S196 9 214 10" stroke={SKY} strokeWidth="4.5" strokeLinecap="round" fill="none" opacity=".9" />
      <path d="M10 15C52 11 96 17 140 13S194 12 208 13" stroke={SKY} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".45" />
    </svg>
  );
}

/** Полоска бумажного скотча с зубчатыми краями. */
export function Tape({ className = "", color = CORAL }: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 120 30" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M4 4 8 9 4 15 8 21 4 26H116L112 21 116 15 112 9 116 4Z" fill={color} opacity=".85" />
      <path d="M22 4 34 26M48 4 60 26M74 4 86 26M100 4 110 22" stroke="#FFFFFF" strokeWidth="5" opacity=".28" />
    </svg>
  );
}

/* ───────────── Вопросы ───────────── */

/** Бумажный самолётик без следа — для телефона и узких экранов. */
export function PaperPlane({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 64 44" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M4 22 60 4 44 40 32 28Z" transform="translate(2 3)" fill={SHADOW} opacity=".12" />
      <path d="M4 22 60 4 32 28Z" fill="#FFFFFF" stroke={SKY_LIGHT} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M32 28 60 4 44 40Z" fill={SKY} />
      <path d="M32 28 36 38 44 40Z" fill="#4E93C0" />
    </svg>
  );
}

/** Самолётик вверху и мягко изогнутый пунктирный след вниз — вдоль внешнего поля аккордеона. */
export function PlaneWithTrail({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 110 420" className={`decor ${className}`} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMin meet">
      <path
        d="M30 416C70 370 18 320 52 270S96 190 60 140 40 80 58 52"
        stroke={SKY}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="3 9"
        fill="none"
      />
      <g transform="translate(36 6) rotate(-28 32 22)">
        <path d="M4 22 60 4 44 40 32 28Z" transform="translate(2 3)" fill={SHADOW} opacity=".12" />
        <path d="M4 22 60 4 32 28Z" fill="#FFFFFF" stroke={SKY_LIGHT} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M32 28 60 4 44 40Z" fill={SKY} />
        <path d="M32 28 36 38 44 40Z" fill="#4E93C0" />
      </g>
    </svg>
  );
}

/* ───────────── Контакты и подвал ───────────── */

/** Два холма разной формы на всю ширину; цвет ближнего совпадает с фоном подвала. */
export function GardenHills({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M0 86C240 28 520 36 780 84S1210 102 1440 64V140H0Z" fill="var(--color-hill)" />
      <path d="M0 116C300 80 560 96 840 120S1260 92 1440 106V140H0Z" fill="var(--color-hill-front)" />
    </svg>
  );
}

/** Ромашка. */
export function Daisy({ className = "" }: Props) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 40 64" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M20 30c-1 12 1 22-1 32" stroke={LEAF} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M20 48c-6-6-12-6-15-3 4 4 10 5 15 3Z" fill={LEAF_LIGHT} />
      <g transform="translate(20 20)">
        {petals.map((a) => (
          <ellipse key={a} cx="0" cy="-9" rx="4" ry="8" transform={`rotate(${a})`} fill="#FFFFFF" stroke="#E4EAD8" strokeWidth="1" />
        ))}
        <circle r="5.5" fill={SUN} />
        <circle cx="-1.5" cy="-1.5" r="1.8" fill="#FFE38A" />
      </g>
    </svg>
  );
}

/** Маленькая божья коровка. */
export function Ladybug({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 32 26" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx="17" cy="16" rx="12" ry="9" transform="translate(1 1.5)" fill={SHADOW} opacity=".12" />
      <circle cx="6" cy="14" r="4.5" fill={SHADOW} />
      <path d="M5 4c4 0 4 4 5 6M3 6c3-1 4 3 4 5" stroke={SHADOW} strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx="17" cy="15" rx="12" ry="9" fill={RED} />
      <path d="M17 6v18" stroke={SHADOW} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2" fill={SHADOW} />
      <circle cx="22" cy="12" r="2" fill={SHADOW} />
      <circle cx="13" cy="19" r="1.7" fill={SHADOW} />
      <circle cx="22" cy="19" r="1.7" fill={SHADOW} />
      <ellipse cx="10" cy="10" rx="2" ry="1" fill={RED_LIGHT} />
    </svg>
  );
}
