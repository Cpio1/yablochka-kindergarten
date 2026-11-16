/* Авторские иллюстрации. Всё декоративное: aria-hidden, без фокуса, pointer-events: none. */

const RED = "#B93335";
const RED_LIGHT = "#D4554F";
const LEAF = "#5B8A45";
const LEAF_LIGHT = "#8DB86B";
const STEM = "#6B4A2B";
const CREAM = "#FFF3D6";
const SEED = "#4A2E1C";

const APPLE_BODY =
  "M200 122C170 97 96 96 81 176C67 252 111 346 166 351C183 353 190 344 200 344C210 344 217 353 234 351C289 346 333 252 319 176C304 96 230 97 200 122Z";

/** Знак в шапке, если у садика нет PNG-логотипа. */
export function AppleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path
        d="M32 19c-5-4-17-4-20 9-2 12 5 27 14 28 3 0 4-1 6-1s3 1 6 1c9-1 16-16 14-28-3-13-15-13-20-9Z"
        fill={RED}
      />
      <ellipse cx="20" cy="30" rx="3" ry="6" transform="rotate(-20 20 30)" fill="#fff" opacity=".35" />
      <path d="M32 20c0-4 1-8 3-11" stroke={STEM} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M34 12c4-6 11-7 16-5-3 5-9 8-16 5Z" fill={LEAF} />
    </svg>
  );
}

/** Главная иллюстрация первого экрана — используется, пока нет фотографии main-page. */
export function HeroApple({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 420" className={`decor ${className}`} aria-hidden="true" focusable="false">
      {/* мягкая подложка-пятно */}
      <path
        d="M205 30c95-6 170 60 172 165 2 100-62 196-170 198C98 395 22 320 26 210 30 105 110 36 205 30Z"
        fill="#DCEBCF"
      />
      <circle cx="338" cy="92" r="10" fill="#FFE3A1" />
      <circle cx="58" cy="128" r="6" fill="#FFE3A1" />
      {/* тонкая веточка */}
      <path d="M40 74c30 6 58 20 78 40" stroke={LEAF} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M72 84c-2-14 6-24 18-26 1 13-6 23-18 26Z" fill={LEAF_LIGHT} />
      <path d="M98 100c8-11 20-13 30-8-6 11-18 14-30 8Z" fill={LEAF_LIGHT} />

      {/* яблоко */}
      <path d={APPLE_BODY} fill={RED} />
      <path
        d="M200 344c10 0 17 9 34 7 55-5 99-99 85-175-5-27-17-46-32-58 9 18 13 41 9 66-10 74-50 132-96 160Z"
        fill="#9E2A2C"
        opacity=".35"
      />
      <ellipse cx="128" cy="196" rx="17" ry="38" transform="rotate(-18 128 196)" fill="#fff" opacity=".32" />
      <ellipse cx="146" cy="146" rx="7" ry="9" fill="#fff" opacity=".4" />
      <path d="M200 124c-2-24 2-44 14-62" stroke={STEM} strokeWidth="9" strokeLinecap="round" fill="none" />

      {/* лист — лёгкое покачивание (отключается при prefers-reduced-motion) */}
      <g className="origin-[212px_78px] motion-safe:animate-sway">
        <path d="M212 78c20-34 66-40 92-26-15 31-56 47-92 26Z" fill={LEAF} />
        <path d="M216 76c28-12 52-18 82-22" stroke="#3F6B30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* долька */}
      <g transform="translate(250 300) rotate(-12)">
        <path d="M0 0h112A56 56 0 0 1 0 0Z" fill={CREAM} stroke={RED} strokeWidth="8" strokeLinejoin="round" />
        <path d="M14 8h84A42 42 0 0 1 14 8Z" fill="#FFF8EC" opacity=".7" />
        <ellipse cx="44" cy="18" rx="5" ry="8" transform="rotate(-20 44 18)" fill={SEED} />
        <ellipse cx="68" cy="18" rx="5" ry="8" transform="rotate(20 68 18)" fill={SEED} />
      </g>
      {/* семечки */}
      <ellipse cx="92" cy="352" rx="5" ry="8" transform="rotate(-30 92 352)" fill={SEED} opacity=".85" />
      <ellipse cx="112" cy="370" rx="4" ry="7" transform="rotate(25 112 370)" fill={SEED} opacity=".6" />
    </svg>
  );
}

/** Стебелёк с листом над фотографией на первом экране: фото + лист читаются как яблоко. */
export function StemLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M58 88c-2-24 2-50 12-70" stroke={STEM} strokeWidth="8" strokeLinecap="round" fill="none" />
      <g className="origin-[68px_30px] motion-safe:animate-sway">
        <path d="M68 30c14-24 40-28 50-20-8 22-32 32-50 20Z" fill={LEAF} />
        <path d="M71 29c16-8 30-14 44-17" stroke="#3F6B30" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/** Четыре яблока на ветке — визуальная опора для цифры 4 в разделе «Группы». */
export function FourApples({ className = "" }: { className?: string }) {
  const apples = [
    { x: 58, y: 54, s: 1 },
    { x: 128, y: 70, s: 0.92 },
    { x: 200, y: 66, s: 1.05 },
    { x: 270, y: 50, s: 0.9 },
  ];
  return (
    <svg viewBox="0 0 330 108" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M6 30C70 18 120 44 180 36S290 14 324 22" stroke={STEM} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M96 30c4-14 18-20 30-16-4 13-17 19-30 16Z" fill={LEAF} />
      <path d="M232 26c6-13 20-17 31-11-6 12-19 16-31 11Z" fill={LEAF_LIGHT} />
      {apples.map((a, i) => (
        <g key={i} transform={`translate(${a.x} ${a.y}) scale(${a.s})`}>
          <path d="M0 -20v-10" stroke={STEM} strokeWidth="3" strokeLinecap="round" />
          <path
            d="M0 -18c-7-5-26-5-29 13-3 17 7 37 20 38 4 0 6-2 9-2s5 2 9 2c13-1 23-21 20-38-3-18-22-18-29-13Z"
            fill={i % 2 ? RED_LIGHT : RED}
          />
          <ellipse cx="-14" cy="-2" rx="4" ry="8" transform="rotate(-18 -14 -2)" fill="#fff" opacity=".35" />
        </g>
      ))}
    </svg>
  );
}

/** Тарелка с яблочной долькой — раздел «Питание». */
export function Plate({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx="70" cy="70" rx="64" ry="44" fill="#fff" stroke="#E7C978" strokeWidth="3" />
      <ellipse cx="70" cy="68" rx="44" ry="28" fill="#FFFDF8" stroke="#F1DCA0" strokeWidth="2" />
      <g transform="translate(46 56) rotate(-8)">
        <path d="M0 0h50A25 25 0 0 1 0 0Z" fill={CREAM} stroke={RED} strokeWidth="5" strokeLinejoin="round" />
        <ellipse cx="20" cy="8" rx="2.6" ry="4.5" transform="rotate(-20 20 8)" fill={SEED} />
        <ellipse cx="31" cy="8" rx="2.6" ry="4.5" transform="rotate(20 31 8)" fill={SEED} />
      </g>
      <path d="M96 30c6-12 18-15 28-10-6 11-17 15-28 10Z" fill={LEAF} />
    </svg>
  );
}

/** Тонкая веточка-разделитель возле заголовков. */
export function Twig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 24" className={`decor ${className}`} aria-hidden="true" focusable="false">
      <path d="M2 16c22-8 52-10 92-4" stroke={LEAF} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M30 13c2-8 9-11 16-9-2 8-9 11-16 9Z" fill={LEAF_LIGHT} />
      <path d="M58 12c4-7 12-8 18-4-4 7-12 8-18 4Z" fill={LEAF} />
    </svg>
  );
}

export function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6L3 21Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-1.8-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-1.8L9 9.5Z" />
    </svg>
  );
}

export function DocIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}
