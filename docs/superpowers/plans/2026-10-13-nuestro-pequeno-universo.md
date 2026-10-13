# Nuestro pequeño universo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la web de cumpleaños de Larita: cinco escenas interactivas en una sola página, con todo el contenido personal centralizado en un archivo.

**Architecture:** Una página estática de Next.js monta `BirthdayExperience`, que guarda el estado en un `useReducer` puro (`src/state/experience.ts`) y muestra una sola escena por vez con `AnimatePresence`. Las escenas reciben su porción de estado y callbacks por props, y leen todos los textos de `src/config/birthday.ts`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Lucide React, Vitest + Testing Library (jsdom).

**Spec:** `docs/superpowers/specs/2026-10-13-nuestro-pequeno-universo-design.md`

## Global Constraints

- Sin backend, base de datos, autenticación, analítica ni APIs externas. Sin `localStorage`.
- Dependencias de runtime permitidas: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`. Nada más.
- Ningún componente contiene textos personales: todos salen de `src/config/birthday.ts`.
- No inventar anécdotas, fechas, nombres ni datos de la pareja. Los textos de la config de la Task 2 son definitivos: copiarlos tal cual.
- Idioma: español rioplatense (voseo) en toda la interfaz.
- Paleta: crema `#FFF5F2`, rosa pastel `#F8DCE6`, rosa intenso `#EBA8C0`, lavanda `#C9B8E8`, ciruela `#57394D`, blanco `#FFFFFF`, noche `#1F1430`.
- Todo control interactivo es un `<button>` real, con foco visible y área táctil de al menos 44×44 px. Nada depende de hover.
- Animar solo `transform` y `opacity`. Nada se mueve en bucle salvo el titilar de 6 estrellas en la escena final.
- Respetar `prefers-reduced-motion`: sin rebotes, partículas, confeti ni titileo.
- Sin scroll horizontal desde 320 px de ancho. Respetar `env(safe-area-inset-*)`.
- Valores aleatorios prohibidos en render (`Math.random`): todas las posiciones decorativas son deterministas.
- Cada commit termina con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- No desplegar: el deploy lo hace Nacho.

## Review Focus

1. **Doble toque en "continuar" durante la transición.** La escena saliente sigue en el DOM mientras hace su animación de salida; un segundo toque no debe saltear una escena. → Task 3 (`next` con `from`).
2. **Una foto no carga (archivo renombrado o red lenta).** El álbum debe mostrar un marcador con la ruta y seguir funcionando; en la escena final la foto favorita simplemente no aparece. → Task 5 (`Polaroid.test.tsx`).
3. **El celular rechaza `audio.play()` o falta el archivo.** El botón vuelve a "pausado", avisa y no rompe nada. → Task 9 (`MusicToggle.test.tsx`).
4. **Fecha de inicio inválida, vacía o futura.** El contador de días no debe mostrar `NaN` ni números negativos. → Task 2 (`daysTogether.test.ts`).
5. **Pregunta del quiz mal editada por Nacho** (opción correcta que no existe, opción sin reacción). Larita no debe ver una reacción vacía. → Task 2 (`birthday.test.ts`) y Task 6 (`quiz.test.ts`, texto de respaldo).

---

## Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `src/types/birthday.ts` | Tipos del contenido |
| `src/config/birthday.ts` | Todo el contenido editable |
| `src/state/experience.ts` | Reducer, estado inicial, tipos de estado |
| `src/lib/daysTogether.ts` | Días desde el inicio de la relación |
| `src/lib/quiz.ts` | Qué reacción corresponde a una respuesta |
| `src/lib/wrapIndex.ts` | Índice circular para el modal |
| `src/app/layout.tsx`, `page.tsx`, `globals.css` | Fuentes, metadatos, tokens, estilos base |
| `src/components/experience/BirthdayExperience.tsx` | Estado + cabecera + cambio de escena |
| `src/components/experience/*Scene.tsx` | Una escena cada uno |
| `src/components/ui/SceneShell.tsx` | Marco de escena: márgenes, "Volver", título con foco |
| `src/components/ui/PrimaryButton.tsx` | Botón principal |
| `src/components/ui/ProgressIndicator.tsx` | Cinco puntos de progreso |
| `src/components/ui/GiftBox.tsx`, `Burst.tsx`, `Doodles.tsx` | Caja SVG, partículas y garabatos |
| `src/components/ui/Polaroid.tsx`, `PhotoModal.tsx` | Foto con marco y modal |
| `src/components/ui/Envelope.tsx` | Sobre que se da vuelta |
| `src/components/ui/Stars.tsx`, `StarryHeart.tsx`, `Confetti.tsx` | Escena nocturna |
| `src/components/ui/MusicToggle.tsx` | Música opcional |

---

### Task 1: Proyecto base, estilos y fuentes

**Files:**
- Create: todo el scaffold de Next.js en la raíz, `vitest.config.ts`, `vitest.setup.tsx`, `public/audio/.gitkeep`
- Modify: `package.json`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

**Interfaces:**
- Produces: clases Tailwind `bg-cream`, `bg-blush`, `bg-rose`, `bg-lavender`, `bg-plum`, `bg-night`, `text-rose-deep` (y sus variantes `text-*`), `font-serif`, `font-sans`, `font-hand`; clases CSS `.paper`, `.cork`, `.polaroid`, `.tape`, `.twinkle`; scripts `npm run dev|build|lint|typecheck|test`.

- [ ] **Step 1: Generar el scaffold en una carpeta temporal y subirlo a la raíz**

La raíz no está vacía, así que `create-next-app` no puede correr ahí directamente.

```bash
cd "/d/Dev/Pruebas con claude code/Larita"
npx create-next-app@16.4.0 tmp-scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
rm -rf tmp-scaffold/.git tmp-scaffold/public tmp-scaffold/node_modules tmp-scaffold/README.md
cp -r tmp-scaffold/. .
rm -rf tmp-scaffold
```

Verificar: `ls public/images/memories` sigue listando las 9 fotos y existe `src/app/page.tsx`.

- [ ] **Step 2: Instalar dependencias**

En `package.json`, cambiar `"name"` a `"nuestro-pequeno-universo"`. Después:

```bash
npm install
npm install framer-motion lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
mkdir -p public/audio && touch public/audio/.gitkeep
```

- [ ] **Step 3: Agregar scripts**

En `package.json`, dentro de `"scripts"`, agregar (sin tocar los existentes):

```json
"typecheck": "tsc --noEmit",
"test": "vitest run"
```

- [ ] **Step 4: Configurar Vitest**

`vitest.config.ts`:

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.tsx"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

`vitest.setup.tsx`:

```tsx
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

// jsdom no trae matchMedia ni IntersectionObserver; Framer Motion los usa.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

// next/image se reemplaza por un <img> simple para poder disparar onError.
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onError,
  }: {
    src: string;
    alt: string;
    onError?: () => void;
  }) => <img src={src} alt={alt} onError={onError} />,
}));
```

- [ ] **Step 5: Escribir `src/app/globals.css`**

Reemplazar el archivo completo:

```css
@import "tailwindcss";

@theme inline {
  --color-cream: #fff5f2;
  --color-blush: #f8dce6;
  --color-rose: #eba8c0;
  --color-rose-deep: #a8456e;
  --color-lavender: #c9b8e8;
  --color-plum: #57394d;
  --color-night: #1f1430;
  --font-serif: var(--font-fraunces);
  --font-sans: var(--font-dm-sans);
  --font-hand: var(--font-caveat);
}

html,
body {
  overflow-x: hidden;
}

body {
  background: var(--color-cream);
  color: var(--color-plum);
  font-family: var(--font-dm-sans), system-ui, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

:focus-visible {
  outline: 3px solid var(--color-plum);
  outline-offset: 3px;
}

.tone-night :focus-visible {
  outline-color: var(--color-cream);
}

.paper {
  background-image: radial-gradient(rgba(87, 57, 77, 0.05) 1px, transparent 1px);
  background-size: 18px 18px;
}

.cork {
  background-color: #f1e2d6;
  background-image: radial-gradient(rgba(87, 57, 77, 0.08) 1px, transparent 1px);
  background-size: 11px 11px;
}

.polaroid {
  background: #fff;
  padding: 10px 10px 12px;
  border-radius: 3px;
  box-shadow:
    0 1px 2px rgba(87, 57, 77, 0.12),
    0 14px 26px -12px rgba(87, 57, 77, 0.3);
}

.tape {
  position: absolute;
  top: -11px;
  left: 50%;
  width: 72px;
  height: 22px;
  translate: -50% 0;
  rotate: -3deg;
  background: rgba(201, 184, 232, 0.78);
  z-index: 1;
}

dialog::backdrop {
  background: rgba(31, 20, 48, 0.86);
}

@keyframes twinkle {
  50% {
    opacity: 0.25;
  }
}

.twinkle {
  animation: twinkle 3.2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .twinkle {
    animation: none;
  }
  * {
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 6: Escribir `src/app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Nuestro pequeño universo",
  description: "Un regalito para vos.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff5f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Dejar `src/app/page.tsx` mínimo**

```tsx
export default function Home() {
  return <main className="paper min-h-dvh" />;
}
```

Borrar los SVG de ejemplo que el scaffold haya referenciado si quedó alguno (`grep -r "next.svg\|vercel.svg" src` no debe devolver nada).

- [ ] **Step 8: Verificar**

```bash
npm run typecheck && npm run lint && npm run build
```

Expected: los tres terminan sin errores.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with theme tokens and fonts"
```

Esto incluye las fotos de `public/images` y los dos `.txt`, que hasta ahora no estaban commiteados.

---

### Task 2: Tipos, contenido y helpers de fecha

**Files:**
- Create: `src/types/birthday.ts`, `src/config/birthday.ts`, `src/lib/daysTogether.ts`
- Test: `src/config/birthday.test.ts`, `src/lib/daysTogether.test.ts`

**Interfaces:**
- Produces:
  - Tipos `BirthdayConfig`, `Photo`, `MemoryPhoto`, `QuizOption`, `QuizQuestion`, `LoveNote`, `MusicConfig`.
  - `export const birthday: BirthdayConfig`.
  - `daysTogether(startIso: string | undefined, now: Date): number | null`.

- [ ] **Step 1: Escribir los tipos en `src/types/birthday.ts`**

```ts
export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface MemoryPhoto extends Photo {
  caption: string;
  date?: string;
  description?: string;
}

export interface QuizOption {
  id: string;
  label: string;
  /** Reacción propia de esta opción. Obligatoria en preguntas sin respuesta correcta. */
  reaction?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  /** Si falta, la pregunta es de humor y todas las opciones valen. */
  correctOptionId?: string;
  correctReaction?: string;
  missReaction?: string;
}

export interface LoveNote {
  id: string;
  title: string;
  message: string;
}

export interface MusicConfig {
  src: string;
  title?: string;
}

export interface BirthdayConfig {
  people: { from: string; to: string };
  age?: number;
  birthday: string;
  /** Formato ISO: AAAA-MM-DD. */
  relationshipStart?: string;
  intro: { lines: [string, string]; hint: string; boxLabel: string; cta: string };
  memories: { intro: string; sinceLabel: string; continueLabel: string; photos: MemoryPhoto[] };
  quiz: {
    title: string;
    nextLabel: string;
    resultLabel: string;
    result: string;
    continueLabel: string;
    questions: QuizQuestion[];
  };
  notes: { title: string; unlockedText: string; continueLabel: string; items: LoveNote[] };
  final: {
    intro: string;
    favoritePhoto?: Photo;
    letter: string[];
    closing: string;
    giftButton: string;
    giftMessage: { text: string; signature: string };
    restartLabel: string;
  };
  music?: MusicConfig;
}
```

- [ ] **Step 2: Escribir los tests que fallan**

`src/lib/daysTogether.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { daysTogether } from "./daysTogether";

describe("daysTogether", () => {
  it("cuenta los días entre el inicio y hoy", () => {
    expect(daysTogether("2023-07-16", new Date(2023, 6, 17, 9, 0))).toBe(1);
    expect(daysTogether("2023-07-16", new Date(2026, 9, 17, 23, 59))).toBe(1189);
  });

  it("da 0 el mismo día", () => {
    expect(daysTogether("2023-07-16", new Date(2023, 6, 16, 23, 0))).toBe(0);
  });

  it("devuelve null si falta la fecha", () => {
    expect(daysTogether(undefined, new Date())).toBeNull();
    expect(daysTogether("", new Date())).toBeNull();
  });

  it("devuelve null si la fecha es inválida", () => {
    expect(daysTogether("16/07/2023", new Date())).toBeNull();
    expect(daysTogether("2023-13-40", new Date())).toBeNull();
  });

  it("devuelve null si la fecha es futura", () => {
    expect(daysTogether("2030-01-01", new Date(2026, 9, 17))).toBeNull();
  });
});
```

`src/config/birthday.test.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { birthday } from "./birthday";

const publicPath = (src: string) => path.join(process.cwd(), "public", src);

describe("birthday config", () => {
  it("cada foto de recuerdos existe en public/ y tiene epígrafe y alt", () => {
    expect(birthday.memories.photos.length).toBeGreaterThanOrEqual(8);
    for (const photo of birthday.memories.photos) {
      expect(fs.existsSync(publicPath(photo.src)), photo.src).toBe(true);
      expect(photo.caption.trim()).not.toBe("");
      expect(photo.alt.trim()).not.toBe("");
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    }
  });

  it("la foto favorita, si está configurada, existe", () => {
    const fav = birthday.final.favoritePhoto;
    if (fav) expect(fs.existsSync(publicPath(fav.src)), fav.src).toBe(true);
  });

  it("el quiz tiene entre 4 y 5 preguntas con ids únicos", () => {
    const ids = birthday.quiz.questions.map((q) => q.id);
    expect(ids.length).toBeGreaterThanOrEqual(4);
    expect(ids.length).toBeLessThanOrEqual(5);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada pregunta tiene de 2 a 4 opciones y reacción para cualquier respuesta", () => {
    for (const q of birthday.quiz.questions) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.options.length, q.id).toBeLessThanOrEqual(4);
      expect(new Set(q.options.map((o) => o.id)).size, q.id).toBe(q.options.length);
      if (q.correctOptionId) {
        expect(q.options.some((o) => o.id === q.correctOptionId), q.id).toBe(true);
        expect(q.correctReaction?.trim(), q.id).toBeTruthy();
        expect(q.missReaction?.trim(), q.id).toBeTruthy();
      } else {
        for (const o of q.options) expect(o.reaction?.trim(), `${q.id}/${o.id}`).toBeTruthy();
      }
    }
  });

  it("hay 8 cartitas con ids únicos y mensaje", () => {
    const { items } = birthday.notes;
    expect(items).toHaveLength(8);
    expect(new Set(items.map((n) => n.id)).size).toBe(8);
    for (const n of items) expect(n.message.trim()).not.toBe("");
  });

  it("la carta tiene párrafos no vacíos y hay mensaje final", () => {
    expect(birthday.final.letter.length).toBeGreaterThan(0);
    for (const p of birthday.final.letter) expect(p.trim()).not.toBe("");
    expect(birthday.final.giftMessage.text.trim()).not.toBe("");
  });

  it("si hay música configurada, el archivo existe", () => {
    if (birthday.music) expect(fs.existsSync(publicPath(birthday.music.src))).toBe(true);
  });
});
```

- [ ] **Step 3: Correr los tests y ver que fallan**

Run: `npm test`
Expected: FAIL, no encuentra `./daysTogether` ni `./birthday`.

- [ ] **Step 4: Implementar `src/lib/daysTogether.ts`**

```ts
const MS_PER_DAY = 86_400_000;

/** Días completos desde `startIso` (AAAA-MM-DD) hasta `now`. Null si la fecha falta, es inválida o futura. */
export function daysTogether(startIso: string | undefined, now: Date): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(startIso ?? "");
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const start = new Date(year, month - 1, day);
  if (start.getFullYear() !== year || start.getMonth() !== month - 1 || start.getDate() !== day) {
    return null;
  }
  // Se compara en UTC para que el horario de verano no mueva la cuenta.
  const startDay = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((today - startDay) / MS_PER_DAY);
  return days < 0 ? null : days;
}
```

- [ ] **Step 5: Escribir `src/config/birthday.ts`**

Copiar tal cual. Estos textos son los definitivos aprobados en la spec.

```ts
import type { BirthdayConfig } from "@/types/birthday";

/**
 * TODO EL CONTENIDO EDITABLE DE LA WEB ESTÁ ACÁ.
 * Cambiá textos, fotos, preguntas y mensajes en este archivo y nada más.
 * Después corré `npm test` para chequear que no falte nada.
 */
export const birthday: BirthdayConfig = {
  people: { from: "Nacho", to: "Larita" },
  age: 21,
  birthday: "17/10",
  relationshipStart: "2023-07-16",

  intro: {
    lines: ["Hoy es un día muy especial...", "Y preparé algo para vos. ♡"],
    hint: "Tocá la caja",
    boxLabel: "Abrir la caja de regalo",
    cta: "Descubrir mi regalo",
  },

  memories: {
    intro: "Si hay algo que me encanta, es tener recuerdos con vos.",
    sinceLabel: "desde el 16/07/2023",
    continueLabel: "Ahora, un jueguito",
    photos: [
      {
        src: "/images/memories/foto-01.jpg",
        width: 960,
        height: 1280,
        caption: "La primer foto iconic de Larita y Nacho Iuzzo",
        alt: "Larita y Nacho a punto de darse un beso, de noche al aire libre",
      },
      {
        src: "/images/memories/foto-02.jpg",
        width: 768,
        height: 1024,
        caption: "Super mirada",
        alt: "Selfie muy de cerca de Larita y Nacho mirándose",
      },
      {
        src: "/images/memories/foto-03.jpg",
        width: 900,
        height: 1600,
        caption: "Año nuevo con la más linda del mundo mundial",
        alt: "Nacho abrazando a Larita y dándole un beso en la mejilla, de noche",
      },
      {
        src: "/images/memories/foto-04.jpg",
        width: 720,
        height: 1280,
        caption: "Un poquito de vitamina C con mi novia en el río",
        alt: "Selfie de Larita y Nacho sentados en el pasto con sol de tarde",
      },
      {
        src: "/images/memories/foto-05.jpg",
        width: 1080,
        height: 1920,
        caption: "Re bandidos con mi novia",
        alt: "Larita y Nacho con un filtro de gorros de Mario y Luigi",
      },
      {
        src: "/images/memories/foto-06.jpg",
        width: 1600,
        height: 900,
        caption: "Super fogata especial para mi novia",
        alt: "Selfie de Larita y Nacho con un ramo de flores blancas y una fogata en una pantalla de fondo",
      },
      {
        src: "/images/memories/foto-07.jpg",
        width: 1600,
        height: 900,
        caption: "Larita la más barrabrava",
        alt: "Nacho abrazando a Larita en la tribuna de una cancha de fútbol",
      },
      {
        src: "/images/memories/foto-08.jpg",
        width: 1200,
        height: 1600,
        caption: "Larita y Nacho Iuzzo siendo los más iconics del mundo",
        alt: "Larita y Nacho abrazados frente a una pared blanca, vestidos de negro",
      },
      {
        src: "/images/memories/foto-09.jpg",
        width: 1600,
        height: 1200,
        caption: "Re concierto de Ángela Torres y la vida rosa",
        alt: "Selfie de Larita y Nacho entre el público de un recital",
      },
    ],
  },

  quiz: {
    title: "¿Cuánto sabés de nosotros?",
    nextLabel: "Siguiente",
    resultLabel: "Ver resultado",
    result: "Resultado oficial: sos la novia más iconic del mundo.",
    continueLabel: "Tengo algo más para vos",
    questions: [
      {
        id: "inicio",
        question: "¿Qué día empezó nuestro pequeño universo?",
        options: [
          { id: "a", label: "17/10/2023" },
          { id: "b", label: "16/07/2023" },
          { id: "c", label: "16/06/2023" },
          { id: "d", label: "07/06/2023" },
        ],
        correctOptionId: "b",
        correctReaction: "¡Esa! El 16/07/2023, el mejor día del calendario.",
        missReaction: "Casi, casi. Fue el 16/07/2023, pero te lo perdono porque sos vos.",
      },
      {
        id: "concierto",
        question: "¿A quién fuimos a ver en ese re concierto?",
        options: [
          { id: "a", label: "Emilia" },
          { id: "b", label: "Tini" },
          { id: "c", label: "Ángela Torres" },
          { id: "d", label: "Nicki Nicole" },
        ],
        correctOptionId: "c",
        correctReaction: "¡Obvio! Ángela Torres y la vida rosa.",
        missReaction: "Mmm, no. Era Ángela Torres, y fue un re concierto.",
      },
      {
        id: "bandidos",
        question: "En la foto de los re bandidos, ¿quién es Luigi?",
        options: [
          { id: "a", label: "Larita" },
          { id: "b", label: "Nacho" },
          { id: "c", label: "Los dos" },
          { id: "d", label: "Ninguno" },
        ],
        correctOptionId: "a",
        correctReaction: "¡Sí! Luigi sos vos, la bandida de verde.",
        missReaction: "No, no: Luigi sos vos. Yo era Mario.",
      },
      {
        id: "linda",
        question: "¿Quién es la más linda del mundo mundial?",
        options: [
          { id: "a", label: "Larita", reaction: "Correcto. No hay otra respuesta posible." },
          { id: "b", label: "Obvio que Larita", reaction: "Exacto. Obvio." },
          { id: "c", label: "La novia de Nacho", reaction: "O sea, vos. Correctísimo." },
          { id: "d", label: "Todas las anteriores", reaction: "La respuesta más completa. Diez puntos." },
        ],
      },
      {
        id: "amor",
        question: "¿Quién ama más a quién?",
        options: [
          { id: "a", label: "Yo", reaction: "Bueno, bueno... te la dejo pasar porque es tu cumple." },
          { id: "b", label: "Vos", reaction: "Gracias por reconocerlo." },
          { id: "c", label: "Empate técnico", reaction: "Empate, pero con revancha." },
          { id: "d", label: "Esto no se discute", reaction: "Tenés razón: se demuestra." },
        ],
      },
    ],
  },

  notes: {
    title: "Pequeñas cosas que amo de vos",
    unlockedText: "Llevamos {days} días juntos, y contando.",
    continueLabel: "Una última cosa",
    items: [
      { id: "1", title: "Razón n.º 1", message: "Amo a mi novia porque siempre lo da todo por mejorar" },
      { id: "2", title: "Razón n.º 2", message: "Amo a mi novia porque es la más buena del mundo" },
      { id: "3", title: "Razón n.º 3", message: "Amo a mi novia porque es la más trabajadora y estudiosa del mundo" },
      { id: "4", title: "Razón n.º 4", message: "Amo a mi novia porque siempre me demuestra todo su amor de la manera más linda" },
      { id: "5", title: "Razón n.º 5", message: "Amo a mi novia porque es la más tierna y chiquita del mundo" },
      { id: "6", title: "Razón n.º 6", message: "Amo a mi novia porque es la más enojoncita y me encanta su carita de enojada" },
      { id: "7", title: "Razón n.º 7", message: "Amo a mi novia porque siempre nos reímos juntos" },
      { id: "8", title: "Razón n.º 8", message: "Amo a mi novia porque lo es todo para mí" },
    ],
  },

  final: {
    intro: "Y si llegaste hasta acá, es porque todavía me quedan cosas por decirte...",
    favoritePhoto: {
      src: "/images/final/foto-favorita.jpg",
      width: 1200,
      height: 1600,
      alt: "Larita sonriendo de cerca, con la cara apoyada en la mano",
    },
    // Un elemento por párrafo.
    letter: [
      "Felices 21 a mi novia, espero que pases el día más lindo y que disfrutes mucho, te lo mereces más que nadie por todo lo que sos y todo lo que haces día a día.",
      "Me encanta pasar los días con mi novia y poder acompañarte otra vez en tu cumpleaños sabiendo que es un día tan especial para vos, ojalá sea así siempre.",
      "Gracias por siempre querer ser mejor y preocuparte por nosotros para que seamos mejores juntos.",
      "Sos la más linda y buena del mundo, te amo infinito.",
    ],
    closing: "Feliz cumpleaños, mi amor. ♡",
    giftButton: "¿Abrimos tu último regalito?",
    giftMessage: {
      text: "Gracias por dejarme acompañarte un cumpleaños más. Te amo infinito.",
      signature: "Nacho",
    },
    restartLabel: "Volver a ver",
  },

  // Para agregar música: poné el archivo en public/audio/ y descomentá esto.
  // music: { src: "/audio/nuestra-cancion.mp3", title: "Nuestra canción" },
};
```

- [ ] **Step 6: Correr los tests y ver que pasan**

Run: `npm test`
Expected: PASS, 12 tests.

- [ ] **Step 7: Commit**

```bash
git add src/types src/config src/lib
git commit -m "feat: add typed birthday content and daysTogether helper"
```

---

### Task 3: Reducer de la experiencia

**Files:**
- Create: `src/state/experience.ts`
- Test: `src/state/experience.test.ts`

**Interfaces:**
- Produces:
  - `SCENES: readonly ["intro","memories","quiz","notes","final"]`, `type SceneId`.
  - `interface ExperienceState { scene: SceneId; maxReached: SceneId; quizAnswers: Record<string,string>; openedNotes: string[]; finalIntroDone: boolean; giftRevealed: boolean }`.
  - `type ExperienceAction` = `{type:"next";from:SceneId}` | `{type:"back";from:SceneId}` | `{type:"answerQuiz";questionId:string;optionId:string}` | `{type:"openNote";noteId:string}` | `{type:"finalIntroDone"}` | `{type:"revealGift"}` | `{type:"restart"}`.
  - `initialState: ExperienceState`, `experienceReducer(state, action): ExperienceState`.

Dos diferencias con la spec, ambas a propósito: `next`/`back` llevan `from` (la escena desde la que se disparó) para ignorar toques sobre una escena que ya está saliendo, y se agrega `finalIntroDone` para no repetir la secuencia nocturna al volver.

- [ ] **Step 1: Escribir el test que falla**

`src/state/experience.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { experienceReducer, initialState, type ExperienceState } from "./experience";

const at = (overrides: Partial<ExperienceState>): ExperienceState => ({ ...initialState, ...overrides });

describe("experienceReducer", () => {
  it("empieza en la caja", () => {
    expect(initialState.scene).toBe("intro");
    expect(initialState.maxReached).toBe("intro");
  });

  it("next avanza una escena y actualiza maxReached", () => {
    const s = experienceReducer(initialState, { type: "next", from: "intro" });
    expect(s.scene).toBe("memories");
    expect(s.maxReached).toBe("memories");
  });

  it("ignora un segundo next disparado desde la escena anterior (doble toque)", () => {
    const once = experienceReducer(initialState, { type: "next", from: "intro" });
    const twice = experienceReducer(once, { type: "next", from: "intro" });
    expect(twice).toBe(once);
  });

  it("next no hace nada en la última escena", () => {
    const s = at({ scene: "final", maxReached: "final" });
    expect(experienceReducer(s, { type: "next", from: "final" })).toBe(s);
  });

  it("back retrocede sin bajar maxReached", () => {
    const s = experienceReducer(at({ scene: "quiz", maxReached: "notes" }), { type: "back", from: "quiz" });
    expect(s.scene).toBe("memories");
    expect(s.maxReached).toBe("notes");
  });

  it("back no hace nada en la primera escena ni desde otra escena", () => {
    expect(experienceReducer(initialState, { type: "back", from: "intro" })).toBe(initialState);
    const s = at({ scene: "quiz", maxReached: "quiz" });
    expect(experienceReducer(s, { type: "back", from: "notes" })).toBe(s);
  });

  it("volver y avanzar de nuevo conserva maxReached", () => {
    const s = experienceReducer(at({ scene: "memories", maxReached: "notes" }), { type: "next", from: "memories" });
    expect(s.scene).toBe("quiz");
    expect(s.maxReached).toBe("notes");
  });

  it("guarda solo la primera respuesta de cada pregunta", () => {
    const first = experienceReducer(initialState, { type: "answerQuiz", questionId: "q1", optionId: "a" });
    const second = experienceReducer(first, { type: "answerQuiz", questionId: "q1", optionId: "b" });
    expect(second).toBe(first);
    expect(second.quizAnswers).toEqual({ q1: "a" });
  });

  it("openNote es idempotente y conserva el orden", () => {
    let s = experienceReducer(initialState, { type: "openNote", noteId: "2" });
    s = experienceReducer(s, { type: "openNote", noteId: "1" });
    const again = experienceReducer(s, { type: "openNote", noteId: "2" });
    expect(again).toBe(s);
    expect(s.openedNotes).toEqual(["2", "1"]);
  });

  it("finalIntroDone y revealGift marcan sus banderas", () => {
    let s = experienceReducer(initialState, { type: "finalIntroDone" });
    s = experienceReducer(s, { type: "revealGift" });
    expect(s.finalIntroDone).toBe(true);
    expect(s.giftRevealed).toBe(true);
  });

  it("restart vuelve al estado inicial", () => {
    const s = at({
      scene: "final",
      maxReached: "final",
      quizAnswers: { q1: "a" },
      openedNotes: ["1"],
      finalIntroDone: true,
      giftRevealed: true,
    });
    expect(experienceReducer(s, { type: "restart" })).toEqual(initialState);
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run src/state`
Expected: FAIL, no encuentra `./experience`.

- [ ] **Step 3: Implementar `src/state/experience.ts`**

```ts
export const SCENES = ["intro", "memories", "quiz", "notes", "final"] as const;
export type SceneId = (typeof SCENES)[number];

export interface ExperienceState {
  scene: SceneId;
  maxReached: SceneId;
  quizAnswers: Record<string, string>;
  openedNotes: string[];
  finalIntroDone: boolean;
  giftRevealed: boolean;
}

export type ExperienceAction =
  | { type: "next"; from: SceneId }
  | { type: "back"; from: SceneId }
  | { type: "answerQuiz"; questionId: string; optionId: string }
  | { type: "openNote"; noteId: string }
  | { type: "finalIntroDone" }
  | { type: "revealGift" }
  | { type: "restart" };

export const initialState: ExperienceState = {
  scene: "intro",
  maxReached: "intro",
  quizAnswers: {},
  openedNotes: [],
  finalIntroDone: false,
  giftRevealed: false,
};

export function experienceReducer(state: ExperienceState, action: ExperienceAction): ExperienceState {
  switch (action.type) {
    case "next": {
      const index = SCENES.indexOf(state.scene);
      if (action.from !== state.scene || index === SCENES.length - 1) return state;
      const scene = SCENES[index + 1];
      const maxReached = SCENES.indexOf(state.maxReached) > index + 1 ? state.maxReached : scene;
      return { ...state, scene, maxReached };
    }
    case "back": {
      const index = SCENES.indexOf(state.scene);
      if (action.from !== state.scene || index === 0) return state;
      return { ...state, scene: SCENES[index - 1] };
    }
    case "answerQuiz":
      if (state.quizAnswers[action.questionId] !== undefined) return state;
      return { ...state, quizAnswers: { ...state.quizAnswers, [action.questionId]: action.optionId } };
    case "openNote":
      if (state.openedNotes.includes(action.noteId)) return state;
      return { ...state, openedNotes: [...state.openedNotes, action.noteId] };
    case "finalIntroDone":
      return state.finalIntroDone ? state : { ...state, finalIntroDone: true };
    case "revealGift":
      return state.giftRevealed ? state : { ...state, giftRevealed: true };
    case "restart":
      return initialState;
  }
}
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run src/state`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add src/state
git commit -m "feat: add experience reducer with scene navigation"
```

---

### Task 4: Marco de la experiencia y escena de la caja

**Files:**
- Create: `src/components/ui/SceneShell.tsx`, `src/components/ui/PrimaryButton.tsx`, `src/components/ui/ProgressIndicator.tsx`, `src/components/ui/Burst.tsx`, `src/components/ui/Doodles.tsx`, `src/components/ui/GiftBox.tsx`, `src/components/experience/IntroScene.tsx`, `src/components/experience/BirthdayExperience.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `experienceReducer`, `initialState`, `SCENES`, `SceneId` (Task 3); `birthday` (Task 2).
- Produces:
  - `SceneShell({ heading, eyebrow?, tone?, headingClassName?, onBack?, children })`.
  - `PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "light" | "night" })`.
  - `ProgressIndicator({ current, tone? })` con `current: SceneId`.
  - `Burst({ count? })`: partículas absolutas centradas en su contenedor `relative`.
  - `GiftBox({ opened, onOpen, label })`.
  - `IntroScene({ initiallyOpened, onNext })`.
  - `BirthdayExperience()`.

- [ ] **Step 1: `src/components/ui/PrimaryButton.tsx`**

```tsx
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "light" | "night" };

export function PrimaryButton({ tone = "light", className = "", type = "button", ...props }: Props) {
  const colors = tone === "night" ? "bg-cream text-plum" : "bg-plum text-cream";
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-center text-base font-semibold shadow-[0_5px_0_rgba(87,57,77,0.2)] transition-transform duration-100 active:translate-y-0.5 active:shadow-none ${colors} ${className}`}
      {...props}
    />
  );
}
```

- [ ] **Step 2: `src/components/ui/SceneShell.tsx`**

```tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

interface SceneShellProps {
  heading: string;
  eyebrow?: string;
  tone?: "light" | "night";
  headingClassName?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function SceneShell({ heading, eyebrow, tone = "light", headingClassName = "", onBack, children }: SceneShellProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Al entrar a una escena, el foco pasa a su título para teclado y lectores de pantalla.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section
      className={`mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-[calc(4.5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] ${
        tone === "night" ? "tone-night text-cream" : "text-plum"
      }`}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex min-h-11 items-center gap-1 self-start rounded-full pr-3 text-sm underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden /> Volver
        </button>
      )}
      {eyebrow && <p className="font-hand text-xl text-rose-deep">{eyebrow}</p>}
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`font-serif text-3xl leading-tight text-balance outline-none sm:text-4xl ${headingClassName}`}
      >
        {heading}
      </h1>
      {children}
    </section>
  );
}
```

- [ ] **Step 3: `src/components/ui/ProgressIndicator.tsx`**

```tsx
import { SCENES, type SceneId } from "@/state/experience";

export function ProgressIndicator({ current, tone = "light" }: { current: SceneId; tone?: "light" | "night" }) {
  const index = SCENES.indexOf(current);
  const on = tone === "night" ? "bg-cream" : "bg-plum";
  const off = tone === "night" ? "bg-cream/30" : "bg-plum/20";
  return (
    <div role="img" aria-label={`Parte ${index + 1} de ${SCENES.length}`} className="flex items-center gap-1.5">
      {SCENES.map((scene, i) => (
        <span
          key={scene}
          className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? `w-5 ${on}` : `w-1.5 ${i < index ? on : off}`}`}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: `src/components/ui/Burst.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, Star } from "lucide-react";

const COLORS = ["#EBA8C0", "#C9B8E8", "#57394D"];

/** Partículas que salen del centro del contenedor `relative` más cercano. Se dibujan una sola vez. */
export function Burst({ count = 12 }: { count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 block">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const distance = 80 + (i % 3) * 30;
        const Icon = i % 2 === 0 ? Heart : Star;
        return (
          <motion.span
            key={i}
            className="absolute -top-2 -left-2 block"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 50, scale: 1, opacity: 0 }}
            transition={{ duration: 1.1, delay: 0.3 + (i % 4) * 0.04, ease: "easeOut" }}
          >
            <Icon size={14 + (i % 3) * 4} fill={COLORS[i % 3]} color={COLORS[i % 3]} />
          </motion.span>
        );
      })}
    </span>
  );
}
```

- [ ] **Step 4b: `src/components/ui/Doodles.tsx`**

Garabatos decorativos fijos (no se animan). Se ubican con `className` desde quien los usa.

```tsx
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function DoodleStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path d="M24 5l5 13 14 1-11 9 4 14-12-8-12 8 4-14L5 19l14-1z" {...stroke} />
    </svg>
  );
}

export function DoodleHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path d="M24 41C10 31 5 23 8 15c3-7 12-7 16 0 4-7 13-7 16 0 3 8-2 16-16 26z" {...stroke} />
    </svg>
  );
}

export function DoodleSquiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 24" aria-hidden className={className}>
      <path d="M4 14c8-12 14 10 22 0s14 10 22 0 14 10 22 0 14 10 22 0" {...stroke} />
    </svg>
  );
}
```

- [ ] **Step 5: `src/components/ui/GiftBox.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

interface GiftBoxProps {
  opened: boolean;
  onOpen: () => void;
  label: string;
}

export function GiftBox({ opened, onOpen, label }: GiftBoxProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={opened}
      aria-label={label}
      className="block w-56 rounded-3xl disabled:cursor-default sm:w-64"
    >
      <motion.svg
        viewBox="0 0 240 260"
        className="block h-auto w-full overflow-visible"
        initial={false}
        animate={opened ? { y: [0, -12, 0] } : { y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ellipse cx="120" cy="246" rx="86" ry="9" fill="#57394D" opacity="0.12" />

        {/* Base */}
        <rect x="36" y="112" width="168" height="128" rx="10" fill="#EBA8C0" />
        <rect x="36" y="112" width="168" height="20" fill="#57394D" opacity="0.1" />
        <rect x="106" y="112" width="28" height="128" fill="#C9B8E8" />

        {/* Tapa: gira sobre su esquina inferior izquierda */}
        <motion.g
          style={{ originX: 0, originY: 1 }}
          initial={false}
          animate={opened ? { rotate: -34, x: -18, y: -44 } : { rotate: 0, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 170, damping: 13, delay: 0.25 }}
        >
          <rect x="26" y="84" width="188" height="36" rx="8" fill="#F8DCE6" stroke="#57394D" strokeOpacity="0.18" />
          <rect x="104" y="84" width="32" height="36" fill="#C9B8E8" />
        </motion.g>

        {/* Moño: se suelta y cae */}
        <motion.g
          initial={false}
          animate={opened ? { y: 150, x: 46, rotate: 50, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeIn" }}
        >
          <path d="M120 84C96 48 68 52 73 74C76 89 104 87 120 84Z" fill="#C9B8E8" stroke="#57394D" strokeOpacity="0.2" />
          <path d="M120 84C144 48 172 52 167 74C164 89 136 87 120 84Z" fill="#C9B8E8" stroke="#57394D" strokeOpacity="0.2" />
          <circle cx="120" cy="82" r="9" fill="#B49CE0" />
        </motion.g>
      </motion.svg>
    </button>
  );
}
```

- [ ] **Step 6: `src/components/experience/IntroScene.tsx`**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { Burst } from "@/components/ui/Burst";
import { DoodleHeart, DoodleSquiggle, DoodleStar } from "@/components/ui/Doodles";
import { GiftBox } from "@/components/ui/GiftBox";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";

interface IntroSceneProps {
  /** True si ya pasó por acá: la caja aparece abierta y sin animación de partículas. */
  initiallyOpened: boolean;
  onNext: () => void;
}

export function IntroScene({ initiallyOpened, onNext }: IntroSceneProps) {
  const { intro } = birthday;
  const [opened, setOpened] = useState(initiallyOpened);
  const [justOpened, setJustOpened] = useState(false);

  const open = () => {
    setOpened(true);
    setJustOpened(true);
  };

  return (
    <SceneShell heading={intro.lines[0]} headingClassName="text-center">
      <p className="mt-2 text-center font-serif text-xl italic sm:text-2xl">{intro.lines[1]}</p>

      <DoodleSquiggle className="mx-auto mt-4 w-24 text-rose" />

      <div className="relative mt-10 flex flex-1 flex-col items-center justify-center">
        <DoodleStar className="absolute top-2 left-2 w-9 -rotate-12 text-lavender" />
        <DoodleHeart className="absolute top-10 right-3 w-8 rotate-12 text-rose" />
        <DoodleStar className="absolute bottom-24 right-6 w-6 rotate-6 text-rose" />
        <div className="relative">
          <GiftBox opened={opened} onOpen={open} label={intro.boxLabel} />
          {justOpened && <Burst />}
        </div>

        {/* Altura fija para que el cambio de pista a botón no mueva la caja. */}
        <div className="mt-8 flex h-16 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {opened ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: justOpened ? 0.9 : 0, duration: 0.4 }}
              >
                <PrimaryButton onClick={onNext}>{intro.cta}</PrimaryButton>
              </motion.div>
            ) : (
              <motion.p key="hint" exit={{ opacity: 0 }} className="font-hand text-2xl text-rose-deep">
                {intro.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SceneShell>
  );
}
```

- [ ] **Step 7: `src/components/experience/BirthdayExperience.tsx`**

```tsx
"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useReducer } from "react";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { experienceReducer, initialState } from "@/state/experience";
import { IntroScene } from "./IntroScene";

export function BirthdayExperience() {
  const [state, dispatch] = useReducer(experienceReducer, initialState);
  const { scene } = state;
  const night = scene === "final";

  // `from` hace que un toque sobre una escena que ya está saliendo no tenga efecto.
  const next = useCallback(() => dispatch({ type: "next", from: scene }), [scene]);
  const back = useCallback(() => dispatch({ type: "back", from: scene }), [scene]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scene]);

  const renderScene = () => {
    switch (scene) {
      case "intro":
        return <IntroScene initiallyOpened={state.maxReached !== "intro"} onNext={next} />;
      default:
        return null;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-dvh transition-colors duration-[2000ms] ${night ? "bg-night" : "paper bg-cream"}`}>
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))]">
          <ProgressIndicator current={scene} tone={night ? "night" : "light"} />
          <div className="pointer-events-auto" data-slot="music" />
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={scene}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {renderScene()}
          </motion.main>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
```

`back` todavía no se usa; si el lint lo marca, dejarlo: la Task 5 lo consume. Si el lint falla por eso, agregar `void back;` debajo de su definición y quitarlo en la Task 5.

- [ ] **Step 8: Montar en `src/app/page.tsx`**

```tsx
import { BirthdayExperience } from "@/components/experience/BirthdayExperience";

export default function Home() {
  return <BirthdayExperience />;
}
```

- [ ] **Step 9: Verificar en el navegador**

Run: `npm run dev` y abrir `http://localhost:3000` a 390×844.
Expected:
- Se ven las dos frases, la caja centrada y "Tocá la caja".
- Al tocar la caja: el moño cae, la tapa se abre, la caja rebota, salen partículas y aparece "Descubrir mi regalo" sin que la caja se mueva de lugar.
- Con Tab se llega a la caja y Enter la abre.
- Al tocar "Descubrir mi regalo" la pantalla queda vacía con el indicador en el segundo punto (todavía no hay escena 2).
- Consola sin errores ni advertencias de hidratación.

Si la tapa gira desde un punto raro, ajustar solo `originX`/`originY` y los valores de `rotate`/`x`/`y` de la tapa en `GiftBox.tsx` hasta que se vea como una tapa que se levanta hacia la izquierda.

- [ ] **Step 10: Verificar y commitear**

```bash
npm run typecheck && npm run lint && npm test
git add src
git commit -m "feat: add experience shell and gift box intro scene"
```

---

### Task 5: Escena de recuerdos

**Files:**
- Create: `src/lib/wrapIndex.ts`, `src/components/ui/Polaroid.tsx`, `src/components/ui/PhotoModal.tsx`, `src/components/experience/MemoriesScene.tsx`
- Modify: `src/components/experience/BirthdayExperience.tsx`
- Test: `src/lib/wrapIndex.test.ts`, `src/components/ui/Polaroid.test.tsx`

**Interfaces:**
- Consumes: `Photo`, `MemoryPhoto` (Task 2); `SceneShell`, `PrimaryButton` (Task 4).
- Produces:
  - `wrapIndex(index: number, length: number): number`.
  - `Polaroid({ photo, caption?, rotate?, tape?, priority?, sizes, onOpen?, onMissing? })` con `onMissing: "placeholder" | "hide"` (por defecto `"placeholder"`).
  - `PhotoModal({ photos, index, onChange, onClose })` con `photos: MemoryPhoto[]`, `index: number`.
  - `MemoriesScene({ onNext, onBack })`.

- [ ] **Step 1: Escribir los tests que fallan**

`src/lib/wrapIndex.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { wrapIndex } from "./wrapIndex";

describe("wrapIndex", () => {
  it("deja igual un índice válido", () => {
    expect(wrapIndex(3, 9)).toBe(3);
  });
  it("vuelve al principio después del último", () => {
    expect(wrapIndex(9, 9)).toBe(0);
  });
  it("va al último antes del primero", () => {
    expect(wrapIndex(-1, 9)).toBe(8);
  });
  it("devuelve 0 si no hay elementos", () => {
    expect(wrapIndex(2, 0)).toBe(0);
  });
});
```

`src/components/ui/Polaroid.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Polaroid } from "./Polaroid";

const photo = { src: "/images/memories/foto-01.jpg", alt: "Una foto", width: 960, height: 1280 };

describe("Polaroid", () => {
  it("muestra la foto y el epígrafe", () => {
    render(<Polaroid photo={photo} caption="Super mirada" sizes="100vw" />);
    expect(screen.getByAltText("Una foto")).toBeInTheDocument();
    expect(screen.getByText("Super mirada")).toBeInTheDocument();
  });

  it("si la foto no carga, muestra un marcador con la ruta y conserva el epígrafe", () => {
    render(<Polaroid photo={photo} caption="Super mirada" sizes="100vw" />);
    fireEvent.error(screen.getByAltText("Una foto"));
    expect(screen.getByText("public/images/memories/foto-01.jpg")).toBeInTheDocument();
    expect(screen.getByText("Super mirada")).toBeInTheDocument();
  });

  it("con onMissing='hide', si la foto no carga no dibuja nada", () => {
    const { container } = render(<Polaroid photo={photo} sizes="100vw" onMissing="hide" />);
    fireEvent.error(screen.getByAltText("Una foto"));
    expect(container).toBeEmptyDOMElement();
  });

  it("con onOpen expone un botón que lo llama, y sin foto cargada no hay botón", () => {
    const onOpen = vi.fn();
    render(<Polaroid photo={photo} caption="Super mirada" sizes="100vw" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: "Ampliar foto: Super mirada" }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    fireEvent.error(screen.getByAltText("Una foto"));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Correr y ver que fallan**

Run: `npx vitest run src/lib/wrapIndex.test.ts src/components/ui/Polaroid.test.tsx`
Expected: FAIL, módulos inexistentes.

- [ ] **Step 3: `src/lib/wrapIndex.ts`**

```ts
/** Índice circular: después del último viene el primero y antes del primero, el último. */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}
```

- [ ] **Step 4: `src/components/ui/Polaroid.tsx`**

```tsx
"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/types/birthday";

interface PolaroidProps {
  photo: Photo;
  caption?: string;
  /** Grados de inclinación. */
  rotate?: number;
  tape?: boolean;
  priority?: boolean;
  sizes: string;
  onOpen?: () => void;
  /** Qué hacer si el archivo no carga. */
  onMissing?: "placeholder" | "hide";
}

export function Polaroid({
  photo,
  caption,
  rotate = 0,
  tape = false,
  priority = false,
  sizes,
  onOpen,
  onMissing = "placeholder",
}: PolaroidProps) {
  const [failed, setFailed] = useState(false);

  if (failed && onMissing === "hide") return null;

  return (
    <figure className="polaroid relative" style={{ rotate: `${rotate}deg` }}>
      {tape && <span className="tape" aria-hidden />}
      <div className="relative overflow-hidden bg-blush" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        {failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-plum/70">
            <ImageOff size={28} aria-hidden />
            <p className="text-sm">Acá va una foto</p>
            <code className="text-xs break-all">{`public${photo.src}`}</code>
          </div>
        ) : (
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes={sizes}
            priority={priority}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {caption && <figcaption className="px-1 pt-2 text-center font-hand text-xl leading-tight text-plum">{caption}</figcaption>}
      {onOpen && !failed && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Ampliar foto: ${caption ?? photo.alt}`}
          className="absolute inset-0 rounded-[3px]"
        />
      )}
    </figure>
  );
}
```

- [ ] **Step 5: Correr y ver que pasan**

Run: `npx vitest run src/lib/wrapIndex.test.ts src/components/ui/Polaroid.test.tsx`
Expected: PASS, 8 tests.

- [ ] **Step 6: `src/components/ui/PhotoModal.tsx`**

Usa `<dialog>` nativo: `showModal()` da gratis el foco atrapado, el cierre con Escape y la devolución del foco al cerrar.

```tsx
"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { wrapIndex } from "@/lib/wrapIndex";
import type { MemoryPhoto } from "@/types/birthday";

interface PhotoModalProps {
  photos: MemoryPhoto[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

const roundButton = "inline-flex size-11 items-center justify-center rounded-full bg-cream/15 text-cream";

export function PhotoModal({ photos, index, onChange, onClose }: PhotoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = photos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onChange(wrapIndex(index + 1, photos.length));
        if (event.key === "ArrowLeft") onChange(wrapIndex(index - 1, photos.length));
      }}
      aria-label={`Foto ${index + 1} de ${photos.length}`}
      className="tone-night m-auto w-full max-w-xl bg-transparent p-4 text-cream"
    >
      <div className="flex justify-end">
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar" className={roundButton}>
          <X size={22} aria-hidden />
        </button>
      </div>

      <Image
        key={photo.src}
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 640px) 576px, 100vw"
        className="mx-auto mt-3 h-auto max-h-[calc(100dvh-13rem)] w-auto max-w-full rounded-sm"
      />

      <p className="mt-3 text-center font-hand text-2xl leading-tight">{photo.caption}</p>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange(wrapIndex(index - 1, photos.length))}
          aria-label="Foto anterior"
          className={roundButton}
        >
          <ChevronLeft size={22} aria-hidden />
        </button>
        <span className="text-sm text-cream/80" aria-hidden>
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={() => onChange(wrapIndex(index + 1, photos.length))}
          aria-label="Foto siguiente"
          className={roundButton}
        >
          <ChevronRight size={22} aria-hidden />
        </button>
      </div>
    </dialog>
  );
}
```

- [ ] **Step 7: `src/components/experience/MemoriesScene.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { PhotoModal } from "@/components/ui/PhotoModal";
import { Polaroid } from "@/components/ui/Polaroid";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";

// Inclinación fija por posición: evita diferencias entre renders y da ritmo al álbum.
const ROTATIONS = [-3, 2, 0, -2, 3, 0, -1, 2, 0];

interface MemoriesSceneProps {
  onNext: () => void;
  onBack: () => void;
}

export function MemoriesScene({ onNext, onBack }: MemoriesSceneProps) {
  const { memories, relationshipStart } = birthday;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SceneShell heading={memories.intro} eyebrow={relationshipStart ? memories.sinceLabel : undefined} onBack={onBack}>
      <ol className="mt-10 flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-16">
        {memories.photos.map((photo, i) => {
          const landscape = photo.width > photo.height;
          const side = i % 2 === 0 ? "self-start" : "self-end";
          return (
            <motion.li
              key={photo.src}
              className={
                landscape
                  ? "w-full md:col-span-2 md:mx-auto md:w-3/4"
                  : `w-[80%] ${side} md:w-full md:self-auto ${i % 2 === 1 ? "md:mt-20" : ""}`
              }
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Polaroid
                photo={photo}
                caption={photo.caption}
                rotate={ROTATIONS[i % ROTATIONS.length]}
                tape={i % 3 === 0}
                priority={i < 2}
                sizes={landscape ? "(min-width: 768px) 540px, 100vw" : "(min-width: 768px) 340px, 80vw"}
                onOpen={() => setOpenIndex(i)}
              />
              {photo.date && <p className="mt-2 text-center text-sm text-plum/70">{photo.date}</p>}
              {photo.description && <p className="mt-1 text-center text-base">{photo.description}</p>}
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-14 flex justify-center">
        <PrimaryButton onClick={onNext}>{memories.continueLabel}</PrimaryButton>
      </div>

      {openIndex !== null && (
        <PhotoModal
          photos={memories.photos}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </SceneShell>
  );
}
```

- [ ] **Step 8: Conectar la escena en `BirthdayExperience.tsx`**

Agregar el import:

```tsx
import { MemoriesScene } from "./MemoriesScene";
```

Y dentro del `switch`, antes de `default`:

```tsx
      case "memories":
        return <MemoriesScene onNext={next} onBack={back} />;
```

Si en la Task 4 se agregó `void back;`, quitarlo.

- [ ] **Step 9: Verificar en el navegador**

Con `npm run dev`, a 390×844 y también a 320 de ancho:
- Las 9 fotos aparecen en orden, cada una con su epígrafe, ninguna recortada de forma rara.
- Las horizontales (06, 07, 09) ocupan el ancho completo; las verticales alternan izquierda y derecha.
- No hay scroll horizontal (`document.documentElement.scrollWidth === window.innerWidth` en la consola da `true`).
- Tocar una foto abre el modal con la foto entera visible; las flechas cambian de foto y dan la vuelta; cerrar con la X, tocando el fondo y con Escape devuelve el foco a la foto.
- "Volver" regresa a la caja, que aparece ya abierta.
- A 1280 de ancho: dos columnas desfasadas, horizontales centradas.

Probar el fallo: renombrar `public/images/memories/foto-04.jpg` a `foto-04x.jpg`, recargar, confirmar que aparece el marcador con la ruta y que el resto funciona. **Volver a ponerle el nombre original.**

- [ ] **Step 10: Verificar y commitear**

```bash
npm run typecheck && npm run lint && npm test
git status --short   # no debe aparecer foto-04x.jpg
git add src
git commit -m "feat: add memories scene with polaroids and photo modal"
```

---

### Task 6: Escena del quiz

**Files:**
- Create: `src/lib/quiz.ts`, `src/components/experience/CoupleQuizScene.tsx`
- Modify: `src/components/experience/BirthdayExperience.tsx`
- Test: `src/lib/quiz.test.ts`

**Interfaces:**
- Consumes: `QuizQuestion` (Task 2); `Burst`, `PrimaryButton`, `SceneShell` (Task 4).
- Produces:
  - `getReaction(question: QuizQuestion, optionId: string): { text: string; correctOptionId?: string }`. `correctOptionId` viene definido solo cuando la pregunta tiene respuesta correcta y la persona eligió otra.
  - `CoupleQuizScene({ answers, onAnswer, onNext, onBack })` con `answers: Record<string,string>` y `onAnswer(questionId: string, optionId: string): void`.

- [ ] **Step 1: Escribir el test que falla**

`src/lib/quiz.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "@/types/birthday";
import { FALLBACK_REACTION, getReaction } from "./quiz";

const factual: QuizQuestion = {
  id: "q",
  question: "¿?",
  options: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
  correctOptionId: "b",
  correctReaction: "¡Bien!",
  missReaction: "Era B.",
};

const humor: QuizQuestion = {
  id: "h",
  question: "¿?",
  options: [
    { id: "a", label: "A", reaction: "Reacción A" },
    { id: "b", label: "B" },
  ],
};

describe("getReaction", () => {
  it("al acertar devuelve la reacción de acierto y no marca ninguna opción", () => {
    expect(getReaction(factual, "b")).toEqual({ text: "¡Bien!" });
  });

  it("al no acertar devuelve la reacción cariñosa y cuál era la correcta", () => {
    expect(getReaction(factual, "a")).toEqual({ text: "Era B.", correctOptionId: "b" });
  });

  it("en preguntas de humor devuelve la reacción de la opción elegida", () => {
    expect(getReaction(humor, "a")).toEqual({ text: "Reacción A" });
  });

  it("usa un texto de respaldo si la config quedó incompleta", () => {
    expect(getReaction(humor, "b")).toEqual({ text: FALLBACK_REACTION });
    expect(getReaction({ ...factual, correctReaction: "" }, "b")).toEqual({ text: FALLBACK_REACTION });
    expect(getReaction({ ...factual, missReaction: undefined }, "a")).toEqual({
      text: FALLBACK_REACTION,
      correctOptionId: "b",
    });
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run src/lib/quiz.test.ts`
Expected: FAIL, no encuentra `./quiz`.

- [ ] **Step 3: `src/lib/quiz.ts`**

```ts
import type { QuizQuestion } from "@/types/birthday";

/** Se muestra solo si alguien dejó una reacción vacía al editar la config. */
export const FALLBACK_REACTION = "♡";

export interface Reaction {
  text: string;
  /** Presente solo cuando había respuesta correcta y se eligió otra. */
  correctOptionId?: string;
}

export function getReaction(question: QuizQuestion, optionId: string): Reaction {
  const { correctOptionId } = question;
  if (!correctOptionId) {
    const option = question.options.find((o) => o.id === optionId);
    return { text: option?.reaction?.trim() || FALLBACK_REACTION };
  }
  if (optionId === correctOptionId) {
    return { text: question.correctReaction?.trim() || FALLBACK_REACTION };
  }
  return { text: question.missReaction?.trim() || FALLBACK_REACTION, correctOptionId };
}
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run src/lib/quiz.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: `src/components/experience/CoupleQuizScene.tsx`**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { Burst } from "@/components/ui/Burst";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { getReaction } from "@/lib/quiz";

interface CoupleQuizSceneProps {
  answers: Record<string, string>;
  onAnswer: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CoupleQuizScene({ answers, onAnswer, onNext, onBack }: CoupleQuizSceneProps) {
  const { quiz } = birthday;
  const total = quiz.questions.length;

  // Al volver a la escena se retoma en la primera pregunta sin responder (o en el resultado).
  const [step, setStep] = useState(() => {
    const firstUnanswered = quiz.questions.findIndex((q) => answers[q.id] === undefined);
    return firstUnanswered === -1 ? total : firstUnanswered;
  });

  const question = quiz.questions[step];
  const chosen = question ? answers[question.id] : undefined;
  const reaction = question && chosen !== undefined ? getReaction(question, chosen) : null;
  const done = step >= total;

  return (
    <SceneShell heading={quiz.title} onBack={onBack}>
      <div
        role="progressbar"
        aria-label="Avance del juego"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(step + (chosen ? 1 : 0), total)}
        className="mt-5 h-2 overflow-hidden rounded-full bg-plum/15"
      >
        <div
          className="h-full origin-left rounded-full bg-rose transition-transform duration-500"
          style={{ transform: `scaleX(${Math.min(step + (chosen ? 1 : 0), total) / total})` }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mt-10 flex flex-1 flex-col items-center justify-center gap-8 text-center"
          >
            <Burst />
            <p className="max-w-md font-serif text-3xl leading-snug text-balance">{quiz.result}</p>
            <PrimaryButton onClick={onNext}>{quiz.continueLabel}</PrimaryButton>
          </motion.div>
        ) : (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl bg-white p-5 shadow-[0_14px_28px_-16px_rgba(87,57,77,0.35)]"
          >
            <p className="font-hand text-xl text-rose-deep">
              Pregunta {step + 1} de {total}
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-snug">{question.question}</h2>

            <div className="mt-5 grid gap-3">
              {question.options.map((option) => {
                const isChosen = chosen === option.id;
                const isCorrectHint = reaction?.correctOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={chosen !== undefined}
                    aria-pressed={isChosen}
                    onClick={() => onAnswer(question.id, option.id)}
                    className={`min-h-12 rounded-xl border-2 px-4 py-3 text-left text-base font-medium transition-colors ${
                      isChosen
                        ? "border-plum bg-blush"
                        : isCorrectHint
                          ? "border-rose-deep border-dashed bg-cream"
                          : "border-plum/15 bg-cream disabled:opacity-60"
                    }`}
                  >
                    {option.label}
                    {isCorrectHint && <span className="ml-2 font-hand text-lg text-rose-deep">← era esta</span>}
                  </button>
                );
              })}
            </div>

            {/* Altura reservada para que la reacción no empuje el contenido. */}
            <div className="relative mt-5 min-h-28" aria-live="polite">
              {reaction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex flex-col items-start gap-4"
                >
                  <Burst count={6} />
                  <p className="font-hand text-2xl leading-tight">{reaction.text}</p>
                  <PrimaryButton onClick={() => setStep(step + 1)}>
                    {step + 1 === total ? quiz.resultLabel : quiz.nextLabel}
                    <ArrowRight size={18} aria-hidden />
                  </PrimaryButton>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
```

- [ ] **Step 6: Conectar en `BirthdayExperience.tsx`**

Import:

```tsx
import { CoupleQuizScene } from "./CoupleQuizScene";
```

Callback, junto a `next` y `back`:

```tsx
  const answerQuiz = useCallback(
    (questionId: string, optionId: string) => dispatch({ type: "answerQuiz", questionId, optionId }),
    [],
  );
```

Caso en el `switch`:

```tsx
      case "quiz":
        return <CoupleQuizScene answers={state.quizAnswers} onAnswer={answerQuiz} onNext={next} onBack={back} />;
```

- [ ] **Step 7: Verificar en el navegador**

- Las 5 preguntas aparecen de a una, con 4 botones grandes.
- Acertar la pregunta 1 muestra la reacción de acierto; errar la 2 muestra la reacción cariñosa y marca "← era esta" sobre Ángela Torres, sin rojo ni puntaje.
- Después de elegir, las otras opciones no responden.
- En las preguntas 4 y 5 cada opción da su propia reacción.
- La barra avanza con cada respuesta; el último botón dice "Ver resultado".
- El resultado muestra la frase final y el botón de continuar.
- Volver a la escena de fotos y regresar al quiz muestra directamente el resultado.

- [ ] **Step 8: Verificar y commitear**

```bash
npm run typecheck && npm run lint && npm test
git add src
git commit -m "feat: add couple quiz scene"
```

---

### Task 7: Escena de cartitas

**Files:**
- Create: `src/components/ui/Envelope.tsx`, `src/components/experience/LoveNotesScene.tsx`
- Modify: `src/components/experience/BirthdayExperience.tsx`

**Interfaces:**
- Consumes: `LoveNote` (Task 2); `daysTogether` (Task 2); `PrimaryButton`, `SceneShell` (Task 4).
- Produces:
  - `Envelope({ title, message, opened, onOpen, rotate, tint })`.
  - `LoveNotesScene({ opened, onOpen, onNext, onBack })` con `opened: string[]` y `onOpen(noteId: string): void`.

- [ ] **Step 1: `src/components/ui/Envelope.tsx`**

Las dos caras ocupan la misma celda de un grid, así el sobre mide siempre lo que la cara más alta y abrirlo no mueve a los vecinos.

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

interface EnvelopeProps {
  title: string;
  message: string;
  opened: boolean;
  onOpen: () => void;
  /** Grados de inclinación. */
  rotate: number;
  /** Color de fondo del sobre. */
  tint: string;
}

export function Envelope({ title, message, opened, onOpen, rotate, tint }: EnvelopeProps) {
  const reduce = useReducedMotion();
  const face = "col-start-1 row-start-1 min-h-44 rounded-lg [backface-visibility:hidden]";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={opened}
      className="block w-full text-left [perspective:900px]"
      style={{ rotate: `${rotate}deg` }}
    >
      <motion.span
        className="grid [transform-style:preserve-3d]"
        initial={false}
        animate={reduce ? undefined : { rotateY: opened ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <span
          aria-hidden={opened}
          className={`${face} relative flex flex-col items-center justify-end gap-2 overflow-hidden p-3 text-plum shadow-[0_10px_20px_-12px_rgba(87,57,77,0.45)] transition-opacity duration-300`}
          style={{ background: tint, opacity: reduce && opened ? 0 : 1 }}
        >
          {/* Solapa del sobre */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 bg-plum/10 [clip-path:polygon(0_0,100%_0,50%_100%)]"
          />
          <Heart size={22} fill="#57394D" color="#57394D" aria-hidden className="relative" />
          <span className="relative font-hand text-xl">{title}</span>
        </span>

        <span
          aria-hidden={!opened}
          className={`${face} flex items-center bg-white p-4 font-hand text-xl leading-snug text-plum shadow-[0_10px_20px_-12px_rgba(87,57,77,0.45)] transition-opacity duration-300`}
          style={reduce ? { opacity: opened ? 1 : 0 } : { transform: "rotateY(180deg)" }}
        >
          {message}
        </span>
      </motion.span>
    </button>
  );
}
```

- [ ] **Step 2: `src/components/experience/LoveNotesScene.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { Envelope } from "@/components/ui/Envelope";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { daysTogether } from "@/lib/daysTogether";

const ROTATIONS = [-2, 1.5, 2, -1, 1, -2, -1.5, 2];
const TINTS = ["#F8DCE6", "#C9B8E8", "#EBA8C0", "#FFF5F2"];

interface LoveNotesSceneProps {
  opened: string[];
  onOpen: (noteId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LoveNotesScene({ opened, onOpen, onNext, onBack }: LoveNotesSceneProps) {
  const { notes, relationshipStart } = birthday;
  const [now] = useState(() => new Date());
  const remaining = notes.items.filter((note) => !opened.includes(note.id)).length;
  const days = daysTogether(relationshipStart, now);

  return (
    <SceneShell heading={notes.title} onBack={onBack}>
      <p className="mt-2 font-hand text-2xl text-rose-deep" aria-live="polite">
        {remaining === 0
          ? "¡Las abriste todas!"
          : remaining === 1
            ? "Te queda 1 por abrir"
            : `Te quedan ${remaining} por abrir`}
      </p>

      <ul className="cork mt-6 grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl p-4 sm:grid-cols-4 sm:p-6">
        {notes.items.map((note, i) => (
          <li key={note.id}>
            <Envelope
              title={note.title}
              message={note.message}
              opened={opened.includes(note.id)}
              onOpen={() => onOpen(note.id)}
              rotate={ROTATIONS[i % ROTATIONS.length]}
              tint={TINTS[i % TINTS.length]}
            />
          </li>
        ))}
      </ul>

      {remaining === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-6 text-center"
        >
          <div className="polaroid -rotate-1 px-6 py-4">
            {days === null ? (
              <Heart size={28} fill="#EBA8C0" color="#EBA8C0" aria-hidden />
            ) : (
              <p className="font-hand text-2xl leading-tight">{notes.unlockedText.replace("{days}", String(days))}</p>
            )}
          </div>
          <PrimaryButton onClick={onNext}>{notes.continueLabel}</PrimaryButton>
        </motion.div>
      )}
    </SceneShell>
  );
}
```

- [ ] **Step 3: Conectar en `BirthdayExperience.tsx`**

Import:

```tsx
import { LoveNotesScene } from "./LoveNotesScene";
```

Callback:

```tsx
  const openNote = useCallback((noteId: string) => dispatch({ type: "openNote", noteId }), []);
```

Caso:

```tsx
      case "notes":
        return <LoveNotesScene opened={state.openedNotes} onOpen={openNote} onNext={next} onBack={back} />;
```

- [ ] **Step 4: Verificar en el navegador**

A 390×844 y a 320 de ancho:
- Se ven 8 sobres en 2 columnas, levemente inclinados, sin superponerse ni salirse de la pantalla.
- Tocar uno lo da vuelta y muestra el mensaje completo y legible; el texto no se ve en espejo.
- Los sobres vecinos no se mueven al abrir uno. Si el mensaje más largo (n.º 4) se corta, subir `min-h-44` en `Envelope.tsx` hasta que entre a 320 de ancho.
- El contador baja: "Te quedan 7 por abrir" … "Te queda 1 por abrir" … "¡Las abriste todas!".
- Con los 8 abiertos aparece la nota "Llevamos N días juntos, y contando." (N = 1185 el 13/10/2026) y el botón de continuar.
- Volver al quiz y regresar: los sobres siguen abiertos.
- A 1280 de ancho: 4 columnas.

- [ ] **Step 5: Verificar y commitear**

```bash
npm run typecheck && npm run lint && npm test
git add src
git commit -m "feat: add love notes scene with flipping envelopes"
```

---

### Task 8: Escena final

**Files:**
- Create: `src/components/ui/Stars.tsx`, `src/components/ui/StarryHeart.tsx`, `src/components/ui/Confetti.tsx`, `src/components/experience/FinalLetterScene.tsx`
- Modify: `src/components/experience/BirthdayExperience.tsx`

**Interfaces:**
- Consumes: `Polaroid` con `onMissing="hide"` (Task 5); `PrimaryButton`, `SceneShell` (Task 4).
- Produces:
  - `Stars({ visible })`, `StarryHeart({ lit })`, `Confetti()`.
  - `FinalLetterScene({ introDone, giftRevealed, onIntroDone, onRevealGift, onRestart, onBack })`. `onIntroDone` debe ser una función estable (`useCallback` sin dependencias): la escena la usa dentro de un efecto con temporizadores.

- [ ] **Step 1: `src/components/ui/Stars.tsx`**

```tsx
/** 40 estrellas en posiciones fijas; solo 6 titilan. */
const STARS = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 92,
  size: 1 + (i % 3),
  twinkle: i % 7 === 0,
  delay: (i % 5) * 0.6,
}));

export function Stars({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 transition-opacity duration-[1500ms] ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-cream ${star.twinkle ? "twinkle" : ""}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.twinkle ? 1 : 0.7,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `src/components/ui/StarryHeart.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const POINT_COUNT = 30;

// Curva clásica del corazón, recorrida en puntos equidistantes en t.
const POINTS = Array.from({ length: POINT_COUNT }, (_, i) => {
  const t = (i / POINT_COUNT) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { cx: Number((50 + x * 2.6).toFixed(2)), cy: Number((46 - y * 2.6).toFixed(2)) };
});

export function StarryHeart({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="mx-auto block w-36 sm:w-44">
      {POINTS.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.cx}
          cy={point.cy}
          r={i % 4 === 0 ? 1.6 : 1.1}
          fill={i % 3 === 0 ? "#EBA8C0" : "#FFF5F2"}
          initial={false}
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.4, delay: lit ? i * 0.05 : 0 }}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: `src/components/ui/Confetti.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#EBA8C0", "#C9B8E8", "#F8DCE6", "#FFF5F2"];

const PIECES = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 29 + 5) % 100,
  drift: ((i * 17) % 60) - 30,
  rotate: (i * 47) % 360,
  delay: (i % 10) * 0.07,
  duration: 2.2 + (i % 5) * 0.25,
  color: COLORS[i % COLORS.length],
  round: i % 3 === 0,
}));

/** Confeti que cae una sola vez. Montarlo dispara la animación. */
export function Confetti() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {PIECES.map((piece, i) => (
        <motion.span
          key={i}
          className={`absolute top-0 block h-3 w-2 ${piece.round ? "rounded-full" : "rounded-[1px]"}`}
          style={{ left: `${piece.left}%`, background: piece.color }}
          initial={{ y: "-5vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: piece.drift, rotate: piece.rotate + 360, opacity: [1, 1, 0] }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: `src/components/experience/FinalLetterScene.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { birthday } from "@/config/birthday";
import { Confetti } from "@/components/ui/Confetti";
import { Polaroid } from "@/components/ui/Polaroid";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { Stars } from "@/components/ui/Stars";
import { StarryHeart } from "@/components/ui/StarryHeart";

/**
 * Momento (ms desde que entra la escena) en que se alcanza cada etapa:
 * 1 estrellas, 2 corazón, 3 texto y foto, 4 carta, 5 cierre y botón.
 */
const STAGE_AT = [600, 1800, 3600, 5200, 6800];
const LAST_STAGE = STAGE_AT.length;

const reveal = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

interface FinalLetterSceneProps {
  /** True si la secuencia ya se vio: todo aparece revelado de entrada. */
  introDone: boolean;
  giftRevealed: boolean;
  /** Debe ser estable entre renders. */
  onIntroDone: () => void;
  onRevealGift: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export function FinalLetterScene({
  introDone,
  giftRevealed,
  onIntroDone,
  onRevealGift,
  onRestart,
  onBack,
}: FinalLetterSceneProps) {
  const { final } = birthday;
  const [stage, setStage] = useState(introDone ? LAST_STAGE : 0);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (introDone) return;
    const timers = STAGE_AT.map((ms, i) =>
      window.setTimeout(() => {
        setStage(i + 1);
        if (i + 1 === LAST_STAGE) onIntroDone();
      }, ms),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [introDone, onIntroDone]);

  const revealGift = () => {
    setCelebrate(true);
    onRevealGift();
  };

  return (
    <SceneShell
      heading={final.intro}
      tone="night"
      onBack={onBack}
      headingClassName={`text-center transition-opacity duration-1000 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}
    >
      <Stars visible={stage >= 1} />
      {celebrate && <Confetti />}

      <div className="relative mt-8">
        <StarryHeart lit={stage >= 2} />
      </div>

      {stage >= 3 && final.favoritePhoto && (
        <motion.div {...reveal} className="relative mx-auto mt-8 w-[70%] max-w-xs">
          <Polaroid
            photo={final.favoritePhoto}
            rotate={-2}
            tape
            sizes="(min-width: 640px) 320px, 70vw"
            onMissing="hide"
          />
        </motion.div>
      )}

      {stage >= 4 && (
        <>
          {!introDone && (
            <motion.p {...reveal} aria-hidden className="relative mt-6 flex items-center justify-center gap-1 font-hand text-xl text-cream/80">
              seguí bajando <ChevronDown size={18} />
            </motion.p>
          )}
          <motion.article
            {...reveal}
            className="paper relative mx-auto mt-8 w-full max-w-xl rounded-sm bg-cream px-6 py-8 text-plum shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] sm:px-10"
          >
            {final.letter.map((paragraph, i) => (
              <p key={i} className="mt-4 font-serif text-lg leading-relaxed first:mt-0">
                {paragraph}
              </p>
            ))}
          </motion.article>
        </>
      )}

      {stage >= 5 && (
        <motion.div {...reveal} className="relative mt-12 flex flex-col items-center gap-8 text-center">
          <p className="font-serif text-3xl leading-snug text-balance">{final.closing}</p>

          {giftRevealed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="polaroid max-w-sm rotate-1 px-6 py-6 text-plum" aria-live="polite">
                <p className="font-serif text-xl leading-relaxed">{final.giftMessage.text}</p>
                <p className="mt-3 text-right font-hand text-2xl">— {final.giftMessage.signature}</p>
              </div>
              <PrimaryButton tone="night" onClick={onRestart}>
                <RotateCcw size={18} aria-hidden /> {final.restartLabel}
              </PrimaryButton>
            </motion.div>
          ) : (
            <PrimaryButton tone="night" onClick={revealGift}>
              {final.giftButton}
            </PrimaryButton>
          )}
        </motion.div>
      )}
    </SceneShell>
  );
}
```

- [ ] **Step 5: Conectar en `BirthdayExperience.tsx`**

Import:

```tsx
import { FinalLetterScene } from "./FinalLetterScene";
```

Callbacks (los tres sin dependencias, para que sean estables):

```tsx
  const finalIntroDone = useCallback(() => dispatch({ type: "finalIntroDone" }), []);
  const revealGift = useCallback(() => dispatch({ type: "revealGift" }), []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);
```

Caso (y borrar el `default: return null;`, que ya no hace falta porque el `switch` cubre las cinco escenas):

```tsx
      case "final":
        return (
          <FinalLetterScene
            introDone={state.finalIntroDone}
            giftRevealed={state.giftRevealed}
            onIntroDone={finalIntroDone}
            onRevealGift={revealGift}
            onRestart={restart}
            onBack={back}
          />
        );
```

Si TypeScript se queja de que `renderScene` puede no devolver nada, es que falta algún caso.

- [ ] **Step 6: Verificar en el navegador**

- Al entrar desde las cartitas, el fondo pasa de crema a violeta oscuro de forma gradual.
- En orden y sin saltos: estrellas, corazón de puntos que se enciende, frase introductoria con la foto favorita, carta, cierre con el botón.
- La carta se lee bien a 390 de ancho: cuatro párrafos separados, texto ciruela sobre papel crema.
- "Volver" y el indicador de progreso se leen sobre el fondo oscuro.
- Tocar "¿Abrimos tu último regalito?": cae confeti una vez, aparece la tarjeta con el mensaje y la firma "— Nacho", y el botón "Volver a ver".
- "Volver" a las cartitas y regresar: todo aparece ya revelado, sin repetir la secuencia ni el confeti.
- "Volver a ver" lleva a la caja cerrada, con fondo crema y todo reiniciado (quiz sin responder, sobres cerrados).
- Consola sin errores.

- [ ] **Step 7: Verificar y commitear**

```bash
npm run typecheck && npm run lint && npm test
git add src
git commit -m "feat: add final letter scene with starry heart and closing message"
```

---

### Task 9: Música, README y verificación final

**Files:**
- Create: `src/components/ui/MusicToggle.tsx`, `README.md`
- Modify: `src/components/experience/BirthdayExperience.tsx`
- Test: `src/components/ui/MusicToggle.test.tsx`

**Interfaces:**
- Consumes: `MusicConfig` (Task 2).
- Produces: `MusicToggle({ music, tone? })` con `music?: MusicConfig`. Devuelve `null` si `music` no está definido.

- [ ] **Step 1: Escribir el test que falla**

`src/components/ui/MusicToggle.test.tsx`:

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MusicToggle } from "./MusicToggle";

const music = { src: "/audio/cancion.mp3", title: "Nuestra canción" };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MusicToggle", () => {
  it("no dibuja nada si no hay música configurada", () => {
    const { container } = render(<MusicToggle />);
    expect(container).toBeEmptyDOMElement();
  });

  it("empieza pausado y no reproduce solo", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    render(<MusicToggle music={music} />);
    expect(screen.getByRole("button", { name: "Reproducir música" })).toHaveAttribute("aria-pressed", "false");
    expect(play).not.toHaveBeenCalled();
  });

  it("reproduce y pausa", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    render(<MusicToggle music={music} />);

    fireEvent.click(screen.getByRole("button", { name: "Reproducir música" }));
    const pauseButton = await screen.findByRole("button", { name: "Pausar música" });
    expect(pauseButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(pauseButton);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Reproducir música" })).toBeInTheDocument();
  });

  it("si play() falla, queda pausado y avisa", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new Error("NotAllowedError"));
    render(<MusicToggle music={music} />);

    fireEvent.click(screen.getByRole("button", { name: "Reproducir música" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("No se pudo reproducir la música"));
    expect(screen.getByRole("button", { name: "Reproducir música" })).toHaveAttribute("aria-pressed", "false");
  });

  it("si el archivo de audio da error, queda pausado y avisa", () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const { container } = render(<MusicToggle music={music} />);
    fireEvent.error(container.querySelector("audio")!);
    expect(screen.getByRole("status")).toHaveTextContent("No se pudo reproducir la música");
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run src/components/ui/MusicToggle.test.tsx`
Expected: FAIL, no encuentra `./MusicToggle`.

- [ ] **Step 3: `src/components/ui/MusicToggle.tsx`**

```tsx
"use client";

import { Music, Pause } from "lucide-react";
import { useRef, useState } from "react";
import type { MusicConfig } from "@/types/birthday";

export function MusicToggle({ music, tone = "light" }: { music?: MusicConfig; tone?: "light" | "night" }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!music) return null;

  const fail = () => {
    setPlaying(false);
    setFailed(true);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setFailed(false);
    } catch {
      fail();
    }
  };

  const colors = tone === "night" ? "bg-cream/15 text-cream" : "bg-white text-plum shadow-sm";

  return (
    <div className="flex items-center gap-2">
      {failed && (
        <p role="status" className={`text-xs ${tone === "night" ? "text-cream/80" : "text-plum/80"}`}>
          No se pudo reproducir la música
        </p>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        title={music.title}
        className={`inline-flex size-11 items-center justify-center rounded-full ${colors}`}
      >
        {playing ? <Pause size={18} aria-hidden /> : <Music size={18} aria-hidden />}
      </button>
      <audio ref={audioRef} src={music.src} loop preload="none" onError={fail} />
    </div>
  );
}
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run src/components/ui/MusicToggle.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Poner el botón en la cabecera**

En `BirthdayExperience.tsx`, agregar los imports:

```tsx
import { MusicToggle } from "@/components/ui/MusicToggle";
import { birthday } from "@/config/birthday";
```

Y reemplazar `<div className="pointer-events-auto" data-slot="music" />` por:

```tsx
          <div className="pointer-events-auto">
            <MusicToggle music={birthday.music} tone={night ? "night" : "light"} />
          </div>
```

El botón vive en la cabecera, fuera del `AnimatePresence`, así la música sigue sonando al cambiar de escena.

- [ ] **Step 6: Probar la música con un archivo temporal**

Generar un tono de prueba (no se commitea):

```bash
node -e "const sr=8000,n=sr*2,b=Buffer.alloc(44+n);b.write('RIFF',0);b.writeUInt32LE(36+n,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr,28);b.writeUInt16LE(1,32);b.writeUInt16LE(8,34);b.write('data',36);b.writeUInt32LE(n,40);for(let i=0;i<n;i++)b[44+i]=128+40*Math.sin(i*2*Math.PI*440/sr);require('fs').writeFileSync('public/audio/prueba.wav',b)"
```

En `src/config/birthday.ts`, agregar temporalmente `music: { src: "/audio/prueba.wav" },` al final del objeto. En el navegador: el botón aparece arriba a la derecha, no suena al cargar, suena al tocarlo, se pausa al tocarlo de nuevo y sigue sonando al cambiar de escena. Después cambiar `src` a `"/audio/no-existe.mp3"`, tocar el botón y confirmar que aparece el aviso y que la navegación sigue funcionando.

**Deshacer:** borrar la línea `music:` temporal y el archivo.

```bash
rm public/audio/prueba.wav
git diff --stat src/config/birthday.ts   # no debe mostrar cambios
```

- [ ] **Step 7: Escribir `README.md`**

````markdown
# Nuestro pequeño universo

Web de cumpleaños para Larita: una caja de regalo, un álbum de fotos, un quiz,
ocho cartitas y una carta final.

## Cómo ejecutarla

Necesitás Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. Para verla como en un celular, usá las herramientas
de desarrollo del navegador (F12) y elegí un dispositivo móvil.

## Dónde se cambia cada cosa

Todo el contenido está en **`src/config/birthday.ts`**. No hace falta tocar
ningún otro archivo.

| Quiero cambiar... | Buscá en `birthday.ts` |
|---|---|
| Los textos de la caja | `intro` |
| Las fotos y sus epígrafes | `memories.photos` |
| Las preguntas del quiz | `quiz.questions` |
| Las cartitas | `notes.items` |
| La carta final | `final.letter` (un texto entre comillas por párrafo) |
| El mensaje del último regalito | `final.giftMessage` |
| La foto favorita | `final.favoritePhoto` |
| La música | `music` (al final del archivo) |

Después de editar, corré `npm test`: avisa si falta una foto, si una pregunta
quedó sin reacción o si la carta quedó vacía.

### Fotos

- Recuerdos: `public/images/memories/`
- Foto final: `public/images/final/`

Para cambiar una foto, reemplazá el archivo con el mismo nombre. Si la nueva
tiene otro tamaño, actualizá `width` y `height` en `birthday.ts` (en Windows:
clic derecho sobre el archivo, Propiedades, Detalles).

Para agregar una foto, copiala a `public/images/memories/` y sumá un bloque a
`memories.photos`, en el orden en que querés que aparezca:

```ts
{
  src: "/images/memories/foto-10.jpg",
  width: 1200,
  height: 1600,
  caption: "El texto manuscrito que va debajo",
  alt: "Descripción corta de lo que se ve en la foto",
},
```

Si un archivo falta, la web no se rompe: muestra un marcador con la ruta donde
hay que ponerlo.

### Quiz

Hay dos tipos de pregunta:

- **Con respuesta correcta:** lleva `correctOptionId`, `correctReaction` (si
  acierta) y `missReaction` (si no acierta).
- **De humor, todas valen:** no lleva `correctOptionId`, y cada opción tiene
  su propia `reaction`.

Tienen que ser entre 4 y 5 preguntas, con 2 a 4 opciones cada una.

### Música

1. Copiá la canción a `public/audio/` (por ejemplo `nuestra-cancion.mp3`).
2. En `birthday.ts`, descomentá la línea `music` y poné el nombre del archivo.

La música nunca empieza sola: aparece un botón arriba a la derecha para
activarla. Usá solo un archivo que tengas derecho a publicar.

## Antes de compartirla

```bash
npm test
npm run lint
npm run build
```

Los tres tienen que terminar sin errores. Después abrila en tu propio celular
y recorrela completa una vez.

## Publicarla en Vercel

**Opción A, desde GitHub:**

1. Creá un repositorio **privado** en GitHub (tiene fotos personales) y subí
   el proyecto.
2. En https://vercel.com, "Add New" → "Project" e importá el repositorio.
3. Dejá la configuración por defecto y tocá "Deploy".

**Opción B, desde la terminal:**

```bash
npx vercel          # crea una versión de prueba
npx vercel --prod   # publica la definitiva
```

Vercel te da un link. Cualquiera que lo tenga puede abrir la web, así que
compartilo solo con ella. La página pide a los buscadores que no la indexen.
````

- [ ] **Step 8: Verificación automática completa**

```bash
npm test && npm run typecheck && npm run lint && npm run build
```

Expected: los cuatro sin errores ni advertencias. En la salida de `build`, la ruta `/` figura como estática (`○`).

- [ ] **Step 9: Recorrido final contra los 17 criterios de `prompt.txt`**

Correr `npm run build && npm start` (versión de producción) y recorrer la experiencia completa dos veces: a 390×844 y a 1280×800. Anotar cada punto como verificado o no verificado, con lo observado:

1. La web se inicia correctamente.
2. La caja de regalo responde a la interacción.
3. Las cinco escenas se pueden recorrer.
4. Se puede volver a escenas anteriores.
5. El minijuego funciona con todas las preguntas.
6. Las tarjetas revelan sus mensajes.
7. El progreso se actualiza (puntos de la cabecera, barra del quiz, contador de sobres).
8. La carta muestra los párrafos correctamente.
9. La sorpresa final se desbloquea.
10. Las fotografías se reemplazan desde `birthday.ts` (ya probado en la Task 5).
11. La falta de imágenes no rompe la experiencia (ya probado en la Task 5).
12. La música se puede activar y pausar (ya probado en el Step 6).
13. No hay errores en la consola.
14. No hay errores de TypeScript ni de compilación (Step 8).
15. Funciona en viewport móvil y de escritorio.
16. Con "reducir movimiento" emulado en las herramientas de desarrollo (Rendering → prefers-reduced-motion: reduce): no hay rebotes, partículas, confeti ni titileo; la caja se abre, los sobres muestran su mensaje y la secuencia final avanza igual.
17. La experiencia tiene principio, desarrollo y final.

Además:
- Recorrido completo solo con teclado (Tab, Enter, Escape en el modal): todo es alcanzable y el foco siempre se ve.
- A 320 de ancho, en cada escena, `document.documentElement.scrollWidth === window.innerWidth` da `true`.
- Doble clic rápido en cada botón de continuar: avanza una sola escena.
- Comparar en pantalla, contra `contenido-personal.txt`: los 9 epígrafes en orden, las 8 cartitas y la carta completa.

Corregir lo que falle y repetir el Step 8 antes de commitear.

- [ ] **Step 10: Commit**

```bash
git status --short   # no debe aparecer public/audio/prueba.wav
git add -A
git commit -m "feat: add optional music toggle and README"
```
