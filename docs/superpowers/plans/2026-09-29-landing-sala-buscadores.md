# Landing A Sala dos Buscadores: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the cinematic landing page for A Sala dos Buscadores (Next.js). Scroll-driven scenes: a frame sequence through the door in the Hero and a 3D tunnel of Salas, faithful to the Figma.

**Architecture:** Next.js App Router with a static page. Each section is a "scene". The pinned scenes use `SceneTrack` (a tall track with a sticky stage, exposing progress 0→1 through Motion's `useScroll`), and the free-scroll scenes use their own in-view progress. All copy lives in `content/site.ts`. Pure math (frames, tunnel, wrap) lives in `lib/motion/math.ts` and is covered by unit tests. The animation pieces live in `components/motion/`, and the scenes only compose them.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion 13 (`motion/react`), Lenis 1.3, Vitest + Testing Library, Playwright, ffmpeg/cwebp (assets), Vercel.

**Spec:** `docs/superpowers/specs/2026-09-29-landing-sala-buscadores-design.md` (read it before starting any task).

## Global Constraints

- Figma source: fileKey `Kw7UmIWAfqAb3UkvGIELrJ`, frame `196:24` (1440 × 7455). Before calling `get_design_context`, load the skill `figma:figma-design-to-code` and pass `skillNames: "figma-design-to-code"`.
- Fonts: **Gambetta** (titles, 400 and 500, Fontshare, loaded with `next/font/local`) and **Inter** (300, 500 and 600, `next/font/google`).
- Colors (exact values from Figma): night `#0c0404`, cream `#f6e7ce`, bone `#d9d9d9`, wine `#3b0a0a`, ink `#390007`, charcoal `#1f1f1d`, wine-deep `#2b0e12`, parchment `#e8d8b6` (fallback color under the textures).
- Container: `width: min(1184px, 100% - 2*clamp(16px, 5vw, 128px))`, centered.
- No copy hardcoded in JSX: everything comes from `content/site.ts`.
- Animate only `transform`, `opacity`, `filter` and `clip-path`.
- `prefers-reduced-motion: reduce` → no pinning, Lenis off, Hero without a frame sequence (static image), Salas as a grid, short fades only.
- Scene durations: Hero 400vh / 240vh (mobile), Salas 400 / 260, Curadoria 300 / 180, Perguntas 150 / 100, Trilhas 250 / 160. Mobile = `max-width: 767px`.
- Section ids (nav anchors): `inicio`, `salas`, `curadoria`, `perguntas`, `trilhas`, `artigos`, `comunidade`, `faq`.
- Hero frames: desktop ~120 WebP at 1920px (≤ 6 MB), mobile ~80 WebP at 900px (≤ 2.5 MB).
- Lighthouse mobile targets: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95. LCP ≤ 2.5 s, CLS ≤ 0.05.
- `lang="pt-BR"`. A single `<h1>`, "A porta está aberta".
- Every commit ends with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (use a second `-m`).
- Visual design and motion: apply the skills `ui-ux-pro-max` and `emil-design-eng` in the visual review of every scene (Tasks 8–16) and in Task 17.

## File Structure

```
app/
  layout.tsx                 fonts, metadata, <SmoothScroll>
  page.tsx                   composes Nav + scenes + FooterCurtain
  globals.css                Tailwind 4, @theme tokens, container-page, Lenis, grain
  fonts/Gambetta-Regular.woff2, Gambetta-Medium.woff2
components/
  motion/
    SmoothScroll.tsx         Lenis (off with reduced motion)
    SceneTrack.tsx           track + sticky stage + progress
    FrameSequence.tsx        canvas that draws frames by progress
    SplitText.tsx            word-by-word reveal by progress
    TwoToneTitle.tsx         dim/lit title; the lit part "turns on"
    ParallaxLayer.tsx        y offset by the element's own scroll
    DepthTunnel.tsx          items in Z; camera follows progress
    Marquee.tsx              infinite strip; speed tied to scroll
  ui/
    Pill.tsx                 Pill (link) and Tag (label)
    MuseumFrame.tsx          side lines + ornaments
    ArrowButton.tsx          circular arrow button
    SalaCard.tsx  StepCard.tsx  ArticleCard.tsx  Accordion.tsx
  scenes/
    Nav.tsx HeroDoor.tsx Salas.tsx Curadoria.tsx Perguntas.tsx
    Trilhas.tsx Artigos.tsx Comunidade.tsx Faq.tsx FooterCurtain.tsx
content/
  types.ts  site.ts  site.test.ts  hero-frames.json
lib/
  cn.ts  useMediaQuery.ts  heroFrames.ts  scrollToSceneProgress.ts
  motion/math.ts  motion/math.test.ts
scripts/
  extract-frames.sh  make-placeholder-video.sh  check-assets.mjs  shot.mjs
public/
  images/{brand,hero,salas,textures,perguntas,trilhas,artigos,icons,ornaments}/
  frames/hero/{desktop,mobile}/frame_0001.webp …
e2e/landing.spec.ts
vitest.config.ts  vitest.setup.ts  playwright.config.ts
```

---

### Task 1: Project base (Next.js, Tailwind tokens, fonts, tests)

**Files:**
- Create: the whole Next.js scaffold, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/fonts/*.woff2`, `lib/cn.ts`, `lib/useMediaQuery.ts`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `scripts/shot.mjs`
- Test: `lib/cn.test.ts`, `lib/useMediaQuery.test.tsx`

**Interfaces:**
- Produces: `cn(...classes: (string | false | null | undefined)[]): string`; `useMediaQuery(query: string): boolean` (always `false` on the first render); `usePrefersReducedMotion(): boolean`; Tailwind utilities `bg-night`, `text-cream`, `text-bone`, `text-wine`, `text-ink`, `text-charcoal`, `bg-wine-deep`, `bg-parchment`, `font-display`, `font-sans`, `ease-cinema`, `container-page`; test helper `setMatchMedia(fn: (query: string) => boolean)` exported from `vitest.setup.ts`.

- [ ] **Step 1: Scaffold Next.js inside the existing folder** (the `docs/` folder and `.git` are allowed by create-next-app)

```bash
cd ~/Sala_Buscador
npx create-next-app@16 . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
npm i motion@13 lenis@1.3
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
npx playwright install chromium
rm -f public/*.svg
```

Expected: `package.json` has `next@16`, `tailwindcss@4`, `motion`, `lenis`.

- [ ] **Step 2: Download the Gambetta font (Fontshare)**

```bash
mkdir -p app/fonts
curl -s "https://api.fontshare.com/v2/css?f[]=gambetta@400,500&display=swap" -o /tmp/gambetta.css
python3 - <<'EOF'
import re, urllib.request
css = open("/tmp/gambetta.css").read()
for block in re.findall(r"@font-face\s*{[^}]*}", css):
    w = re.search(r"font-weight:\s*(\d+)", block).group(1)
    url = re.search(r"url\('?(//[^')]+\.woff2)'?\)", block).group(1)
    name = {"400": "Regular", "500": "Medium"}[w]
    urllib.request.urlretrieve("https:" + url, f"app/fonts/Gambetta-{name}.woff2")
    print(w, "->", name)
EOF
ls -la app/fonts
```

Expected: `Gambetta-Regular.woff2` and `Gambetta-Medium.woff2`, both non-empty.

- [ ] **Step 3: Configure Vitest**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", "e2e/**", ".next/**"],
  },
});
```

`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "motion/react";
import { vi } from "vitest";

MotionGlobalConfig.skipAnimations = true;

let matcher: (query: string) => boolean = () => false;
export function setMatchMedia(fn: (query: string) => boolean) {
  matcher = fn;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: matcher(query),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class RO { observe() {} unobserve() {} disconnect() {} }
class IO { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
Object.assign(globalThis, { ResizeObserver: RO, IntersectionObserver: IO });
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
```

In `package.json`, add under `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"e2e": "playwright test",
"check:assets": "node scripts/check-assets.mjs",
"shot": "node scripts/shot.mjs"
```

- [ ] **Step 4: Write the failing tests for `cn` and `useMediaQuery`**

`lib/cn.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins only truthy classes", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});
```

`lib/useMediaQuery.test.tsx`:
```tsx
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setMatchMedia } from "@/vitest.setup";
import { useMediaQuery, usePrefersReducedMotion } from "./useMediaQuery";

describe("useMediaQuery", () => {
  it("reflects matchMedia after mount", () => {
    setMatchMedia((q) => q === "(max-width: 767px)");
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(true);
  });

  it("detects prefers-reduced-motion", () => {
    setMatchMedia((q) => q.includes("reduce"));
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
    setMatchMedia(() => false);
  });
});
```

- [ ] **Step 5: Run and confirm failure**

Run: `npm test`
Expected: FAIL. Modules `./cn` and `./useMediaQuery` not found.

- [ ] **Step 6: Implement**

`lib/cn.ts`:
```ts
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

`lib/useMediaQuery.ts`:
```ts
"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
```

- [ ] **Step 7: Run and confirm it passes**

Run: `npm test`
Expected: PASS (3 tests).

- [ ] **Step 8: Tokens, layout and empty page**

`app/globals.css` (replace everything):
```css
@import "tailwindcss";

@theme {
  --color-night: #0c0404;
  --color-cream: #f6e7ce;
  --color-bone: #d9d9d9;
  --color-wine: #3b0a0a;
  --color-wine-deep: #2b0e12;
  --color-ink: #390007;
  --color-charcoal: #1f1f1d;
  --color-parchment: #e8d8b6;
  --font-display: var(--font-gambetta), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --ease-cinema: cubic-bezier(0.22, 1, 0.36, 1);
}

@utility container-page {
  width: min(1184px, 100% - 2 * clamp(16px, 5vw, 128px));
  margin-inline: auto;
}

html {
  background: var(--color-night);
  color: var(--color-cream);
  -webkit-font-smoothing: antialiased;
}
body {
  font-family: var(--font-sans);
  background: var(--color-night);
  overflow-x: clip;
}
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: clip; }

.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
```

`app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const gambetta = localFont({
  src: [
    { path: "./fonts/Gambetta-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Gambetta-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-gambetta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Sala dos Buscadores",
  description: "Um portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${gambetta.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <main />;
}
```

- [ ] **Step 9: Configure Playwright and the screenshot script**

`playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 240_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: "reduced", use: { viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: "reduce" } } },
  ],
});
```

`scripts/shot.mjs` (captures one scene at a given progress, for comparison with Figma; needs `npm run dev` running):
```js
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [, , id = "inicio", progress = "0", width = "1440"] = process.argv;
const w = Number(width);
mkdirSync("shots", { recursive: true });
const out = `shots/${id}-${progress}-${w}.png`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: w < 768 ? 812 : 900 } });
await page.goto("http://localhost:3000");
await page.waitForLoadState("networkidle");
await page.evaluate(([sectionId, p]) => {
  const el = document.getElementById(sectionId);
  if (!el) throw new Error(`section #${sectionId} not found`);
  const top = el.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(0, el.offsetHeight - window.innerHeight);
  window.scrollTo(0, top + range * p);
}, [id, Number(progress)]);
await page.waitForTimeout(900);
await page.screenshot({ path: out });
await browser.close();
console.log(out);
```

Add `shots/` and `/tmp/` to `.gitignore`.

- [ ] **Step 10: Check build and lint**

Run: `npm run build && npm run lint && npm test`
Expected: build with no errors, lint clean, tests PASS.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: base Next.js + Tailwind tokens + fontes + Vitest/Playwright" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Typed content (`content/site.ts`)

**Files:**
- Create: `content/types.ts`, `content/site.ts`
- Test: `content/site.test.ts`

**Interfaces:**
- Produces (all exported from `content/types.ts`):
```ts
export type Link = { label: string; href: string; external?: boolean };
export type HeroContent = { title: [string, string]; tagline: [string, string]; description: string; cta: Link };
export type Sala = { id: string; name: string; image?: string; href: string };
export type SalasContent = { title: string; subtitle: string; salas: Sala[] };
export type Principle = { number: string; title: string; text: string };
export type CuradoriaContent = { titleDim: string; titleLit: string; subtitle: string; cta: Link; principles: Principle[] };
export type PerguntasContent = { title: string; text: string; themes: string[]; cta: Link; image: string };
export type Step = { numeral: string; title: string; meta: string; icon: string; href: string };
export type TrilhasContent = { titleDim: string; titleLit: string; steps: Step[] };
export type Article = { id: string; kicker: string; title: string; author: string; image?: string; href: string };
export type ArtigosContent = { titleDim: string; titleLit: string; subtitle: string; articles: Article[] };
export type ComunidadeContent = { badge: string; title: string; text: string; links: Link[]; members: string[] };
export type FaqItem = { question: string; answer: string };
export type FaqContent = { title: string; text: string; items: FaqItem[] };
export type FooterColumn = { title: string; links: Link[] };
export type FooterContent = { description: string; columns: FooterColumn[]; copyright: string; credit: string; wordmark: [string, string] };
export type NavContent = { links: Link[]; cta: Link };
export type SiteContent = {
  meta: { title: string; description: string; ogImage: string };
  nav: NavContent; hero: HeroContent; salas: SalasContent; curadoria: CuradoriaContent;
  perguntas: PerguntasContent; trilhas: TrilhasContent; artigos: ArtigosContent;
  comunidade: ComunidadeContent; faq: FaqContent; footer: FooterContent;
};
```
- `export const site: SiteContent` in `content/site.ts`.

- [ ] **Step 1: Write the failing test**

`content/site.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { site } from "./site";

const SECTION_IDS = ["inicio", "salas", "curadoria", "perguntas", "trilhas", "artigos", "comunidade", "faq"];

describe("site content", () => {
  it("has the quantities the scenes expect", () => {
    expect(site.salas.salas).toHaveLength(5);
    expect(site.curadoria.principles).toHaveLength(3);
    expect(site.perguntas.themes).toHaveLength(10);
    expect(site.trilhas.steps).toHaveLength(4);
    expect(site.artigos.articles).toHaveLength(3);
    expect(site.faq.items).toHaveLength(4);
    expect(site.comunidade.members.length).toBeGreaterThanOrEqual(24);
  });

  it("contains no leftover template text", () => {
    const json = JSON.stringify(site);
    for (const bad of ["NFT", "Italian", "Forwwward", "Heading 3", "Link →", "Lorem"]) {
      expect(json).not.toContain(bad);
    }
  });

  it("menu anchors point to existing scenes", () => {
    for (const link of site.nav.links) {
      expect(SECTION_IDS).toContain(link.href.replace("#", ""));
    }
  });

  it("3 distinct articles", () => {
    const titles = new Set(site.artigos.articles.map((a) => a.title));
    expect(titles.size).toBe(3);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run content`
Expected: FAIL. Module `./site` not found.

- [ ] **Step 3: Write `content/types.ts`** exactly as in the Interfaces block above.

- [ ] **Step 4: Write `content/site.ts`**

```ts
import type { Link, SiteContent } from "./types";

const ACERVO = "#";
const acervo: Link = { label: "Entrar no acervo", href: ACERVO };
const youtube: Link = { label: "YouTube", href: "#", external: true };
const instagram: Link = { label: "Instagram", href: "#", external: true };

const navLinks: Link[] = [
  { label: "Início", href: "#inicio" },
  { label: "A Sala", href: "#curadoria" },
  { label: "A Busca", href: "#perguntas" },
  { label: "Salas", href: "#salas" },
  { label: "Trilhas", href: "#trilhas" },
  { label: "Comunidade", href: "#comunidade" },
];

export const site: SiteContent = {
  meta: {
    title: "A Sala dos Buscadores",
    description:
      "Um portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis. Sem hierarquizar crenças, sem apagar diferenças, sempre com a fonte à vista.",
    ogImage: "/images/hero/door-still.webp",
  },
  nav: { links: navLinks, cta: acervo },
  hero: {
    title: ["A porta", "está aberta"],
    tagline: ["A escada é de", "quem sobe"],
    description:
      "Um portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis. Sem hierarquizar crenças, sem apagar diferenças, sempre com a fonte à vista.",
    cta: acervo,
  },
  salas: {
    title: "A sala do primeiro ciclo",
    subtitle: "Cinco corpora documentais abrem o acervo, sem que a ordem indique importância.",
    salas: [
      { id: "proposito", name: "A Sala do Propósito", image: "/images/salas/proposito.webp", href: ACERVO },
      { id: "fe-poder", name: "A Sala da Fé e do Poder", image: "/images/salas/fe-poder.webp", href: ACERVO },
      { id: "silencio", name: "A Sala do Silêncio", href: ACERVO },
      { id: "origem", name: "A Sala da Origem", href: ACERVO },
      { id: "simbolos", name: "A Sala dos Símbolos", href: ACERVO },
    ],
  },
  curadoria: {
    titleDim: "Curadoria de museu,",
    titleLit: "não pregação",
    subtitle: "A Sala dos Buscadores organiza o conhecimento religioso, espiritual e filosófico da humanidade em Salas.",
    cta: acervo,
    principles: [
      {
        number: "01",
        title: "Fonte à vista",
        text: "Toda afirmação aponta para o texto, a tradição ou o estudo de onde veio. Quem lê pode sempre conferir a origem.",
      },
      {
        number: "02",
        title: "Neutralidade doutrinária",
        text: "A Sala dos Buscadores organiza o conhecimento religioso, espiritual e filosófico da humanidade em Salas, cada uma dedicada a uma tradição ou corpus documental.",
      },
      {
        number: "03",
        title: "Comparar sem hierarquizar",
        text: "As Salas lado a lado revelam semelhanças e diferenças entre tradições, sem ranking de verdade e sem apagar o que é próprio de cada uma.",
      },
    ],
  },
  perguntas: {
    title: "Perguntas que atravessam tradições",
    text: "Espiritualidade, consciência, filosofia, textos antigos, símbolos e tradições. Organizados por tema, não por hierarquia.",
    themes: ["Morte", "Alma", "Meditação", "Origem do universo", "Conhecimento interior", "Reencarnação", "Sofrimento", "Ética", "Oração", "Consciência"],
    cta: acervo,
    image: "/images/perguntas/scene.webp",
  },
  trilhas: {
    titleDim: "Trilha de",
    titleLit: "conhecimento em degraus",
    steps: [
      { numeral: "I", title: "O que é o hermetismo", meta: "Artigo · 12 min", icon: "/images/trilhas/step-1.webp", href: ACERVO },
      { numeral: "II", title: "Poimandres: a visão de Hermes", meta: "Artigo · 16 min", icon: "/images/trilhas/step-2.webp", href: ACERVO },
      { numeral: "III", title: "As sete esferas", meta: "Artigo · 42 min", icon: "/images/trilhas/step-3.webp", href: ACERVO },
      { numeral: "IV", title: "O Asclépio em latim", meta: "Artigo · 60 min", icon: "/images/trilhas/step-4.webp", href: ACERVO },
    ],
  },
  artigos: {
    titleDim: "Artigos,",
    titleLit: "vídeos e verbetes",
    subtitle: "A Sala dos Buscadores organiza o conhecimento religioso, espiritual e filosófico da humanidade em Salas.",
    articles: [
      {
        id: "tome",
        kicker: "Artigo · 14 min · Biblioteca de Nag Hammadi",
        title: "O Evangelho de Tomé e os 114 ditos",
        author: "Marvin Meyer · Estudioso de textos coptas",
        href: ACERVO,
      },
      {
        id: "bardo",
        kicker: "Vídeo · 22 min · Budismo tibetano",
        title: "O Bardo Thödol e a travessia da morte",
        author: "Curadoria da Sala · Tradições do Himalaia",
        href: ACERVO,
      },
      {
        id: "tao",
        kicker: "Verbete · 8 min · Taoísmo",
        title: "Tao Te Ching: o caminho que não se nomeia",
        author: "Curadoria da Sala · Filosofia chinesa clássica",
        href: ACERVO,
      },
    ],
  },
  comunidade: {
    badge: "Comunidade",
    title: "Acompanhe antes de entrar",
    text: "Novos episódios e conteúdos chegam primeiro pelo canal e pelo perfil da Sala.",
    links: [
      { label: "Assistir no YouTube ↗", href: youtube.href, external: true },
      { label: "Seguir no Instagram ↗", href: instagram.href, external: true },
    ],
    members: [
      "Ana L.", "Rafael M.", "Júlia S.", "Tomás R.", "Helena C.", "Caio B.", "Marina F.", "Davi P.",
      "Lívia A.", "Otávio N.", "Beatriz G.", "Samuel T.", "Clara V.", "Igor D.", "Yasmin K.", "Bruno E.",
      "Sofia H.", "Pedro Q.", "Alice W.", "Mateus J.", "Laura O.", "Gabriel Z.", "Isis U.", "Nina Y.",
    ],
  },
  faq: {
    title: "Tá com dúvida? A gente responde!",
    text: "As perguntas mais comuns de quem chega à Sala pela primeira vez.",
    items: [
      {
        question: "O que é A Sala dos Buscadores?",
        answer: "Um portal que reúne tradições religiosas, espirituais e filosóficas em Salas comparáveis, cada uma dedicada a uma tradição ou corpus documental, com as fontes sempre à vista.",
      },
      {
        question: "A Sala defende alguma religião?",
        answer: "Não. A curadoria segue o modelo de museu: apresenta, contextualiza e compara, sem pregar nem colocar uma crença acima de outra.",
      },
      {
        question: "De onde vêm os conteúdos?",
        answer: "De textos originais, traduções reconhecidas e estudos acadêmicos. Cada artigo, vídeo ou verbete indica as fontes usadas.",
      },
      {
        question: "Preciso pagar para acessar?",
        answer: "A abertura do acervo e as Trilhas do primeiro ciclo são gratuitas. Novidades sobre outros formatos chegam primeiro pela comunidade.",
      },
    ],
  },
  footer: {
    description: "Um acervo para quem busca: tradições, textos e símbolos organizados com rigor e sem hierarquia.",
    columns: [
      { title: "Menu", links: navLinks.filter((l) => l.href !== "#perguntas") },
      {
        title: "Legal",
        links: [
          { label: "Política de privacidade", href: "#" },
          { label: "Política de cookies", href: "#" },
        ],
      },
      { title: "Social", links: [youtube, instagram] },
    ],
    copyright: "2026 © A Sala dos Buscadores",
    credit: "Feito com cuidado pela equipe da Sala",
    wordmark: ["A SALA DOS", "BUSCADORES"],
  },
};
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run content`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add content
git commit -m "feat: conteúdo tipado da landing com rascunhos" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Figma assets + placeholder Hero frames

**Files:**
- Create: `public/images/**`, `public/frames/hero/**`, `content/hero-frames.json`, `scripts/extract-frames.sh`, `scripts/make-placeholder-video.sh`, `scripts/check-assets.mjs`, `lib/heroFrames.ts`
- Test: `lib/heroFrames.test.ts`, `npm run check:assets`

**Interfaces:**
- Produces: the files in the table below; `content/hero-frames.json` = `{ "desktop": number, "mobile": number }`; `heroFrameUrls(variant: "desktop" | "mobile", count?: number): string[]` returning `/frames/hero/<variant>/frame_0001.webp`…

**Asset table** (download with `curl -L -o` into `/tmp/figma/`, then convert with `cwebp -q 80 in.png -o out.webp`; keep SVGs as SVG):

| Final file | Figma source |
|---|---|
| `public/images/brand/logo.svg` | `get_design_context 196:25` → asset of the "Vector" layer (196:37) |
| `/tmp/figma/hero-bg.png` | `get_design_context 196:25` → "image 49" (196:26) |
| `/tmp/figma/hero-arch.png` | `get_design_context 196:25` → "image 215" (196:27) |
| `public/images/salas/space.webp` | `get_design_context 196:47` → "image 49" (196:49) |
| `public/images/salas/proposito.webp` | `get_design_context 196:47` → "ChatGPT Image … 02_15_27" (196:57) |
| `public/images/salas/fe-poder.webp` | `get_design_context 196:47` → "ChatGPT Image … 02_13_50" (196:54) |
| `public/images/textures/parchment.webp` | `get_design_context 196:58` → the section's background image (fill of the frame or the first `img` covering the frame) |
| `public/images/ornaments/finial-ink.svg` | `get_design_context 196:58` → "Group 2147220799" (196:61) |
| `public/images/icons/arrow-prev.svg`, `arrow-next.svg` | `get_design_context 196:73` → the two "Arrow" (196:74, 196:76) |
| `public/images/perguntas/scene.webp` | `get_design_context 196:88` → "image 482" (196:89) |
| `public/images/textures/stone-row.webp` | `get_screenshot 196:121` (`maxDimension: 1513`), a row of the brick texture |
| `public/images/trilhas/step-1..4.webp` | `get_screenshot` of 196:162, 196:172, 196:184, 196:196 (`maxDimension: 192`, transparent background) |
| `public/images/textures/velvet.webp` | `get_design_context 196:202` → the section's background image |
| `public/images/ornaments/finial-cream.svg` | `get_design_context 196:202` → "Group 2147220799" (196:205) |
| `public/images/textures/comunidade.webp` | `get_design_context 196:234` → the section's background image |
| `public/images/icons/faq-toggle.svg` | `get_design_context 196:354` → "Group 59" (196:358) |

- [ ] **Step 1: Load the skill `figma:figma-design-to-code`**, call `get_design_context` for nodes 196:25, 196:47, 196:58, 196:73, 196:88, 196:202, 196:234 and 196:354 (`clientFrameworks: "react,nextjs"`, `clientLanguages: "typescript,css"`, `skillNames: "figma-design-to-code"`) and `get_screenshot` for the nodes in the table. Download each asset URL into `/tmp/figma/` and produce the final files in the table. Asset URLs expire in 7 days: do not reference them in code.

- [ ] **Step 2: Compose the Hero's still image** (background + arch, with the Figma positions: background at y = -284, arch at x = 144)

```bash
mkdir -p public/images/hero
ffmpeg -v error -y -i /tmp/figma/hero-bg.png -i /tmp/figma/hero-arch.png \
  -filter_complex "[0]scale=1440:1459,crop=1440:642:0:284[bg];[1]scale=1151:642[arch];[bg][arch]overlay=144:0,scale=2880:-2:flags=lanczos" \
  -frames:v 1 public/images/hero/door-still.png
cwebp -q 82 public/images/hero/door-still.png -o public/images/hero/door-still.webp
```

Expected: `door-still.png` at 2880 × 1284. Open it and confirm the arch is centered and the brick wall fills both sides.

- [ ] **Step 3: Write the frame scripts**

`scripts/make-placeholder-video.sh`:
```bash
#!/usr/bin/env bash
# Synthetic zoom "into the door" from the still. Replaced by the Magnific video in Task 18.
set -euo pipefail
SRC="${1:-public/images/hero/door-still.png}"
OUT="${2:-/tmp/hero-placeholder.mp4}"
ffmpeg -v error -y -loop 1 -i "$SRC" \
  -vf "scale=5760:-2,zoompan=z='1+0.035*on':x='iw/2-(iw/zoom/2)':y='ih*0.57-(ih/zoom/2)':d=120:s=1920x856:fps=24" \
  -frames:v 120 -pix_fmt yuv420p -c:v libx264 "$OUT"
echo "$OUT"
```

`scripts/extract-frames.sh`:
```bash
#!/usr/bin/env bash
# Usage: scripts/extract-frames.sh <video>  → public/frames/hero/{desktop,mobile} + content/hero-frames.json
set -euo pipefail
SRC="${1:?usage: extract-frames.sh <video>}"
OUT="public/frames/hero"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")

extract() {
  local variant=$1 count=$2 filter=$3 quality=$4
  rm -rf "${OUT:?}/$variant" && mkdir -p "$OUT/$variant"
  local fps
  fps=$(awk -v c="$count" -v d="$DUR" 'BEGIN { printf "%.4f", c / d }')
  ffmpeg -v error -i "$SRC" -vf "fps=$fps,$filter" -c:v libwebp -quality "$quality" -compression_level 6 "$OUT/$variant/frame_%04d.webp"
  find "$OUT/$variant" -name '*.webp' | wc -l | tr -d ' '
}

D=$(extract desktop 120 "scale=1920:-2:flags=lanczos" 70)
M=$(extract mobile 80 "crop=min(iw\,ih*9/16):ih,scale=900:-2:flags=lanczos" 65)
printf '{ "desktop": %s, "mobile": %s }\n' "$D" "$M" > content/hero-frames.json
du -sh "$OUT/desktop" "$OUT/mobile"
```

```bash
chmod +x scripts/*.sh
ffmpeg -hide_banner -encoders | grep -q libwebp && echo "libwebp ok"
```

Expected: `libwebp ok`. (If it is missing: `brew reinstall ffmpeg`.)

- [ ] **Step 4: Generate the placeholder frames**

```bash
scripts/make-placeholder-video.sh
scripts/extract-frames.sh /tmp/hero-placeholder.mp4
cat content/hero-frames.json
```

Expected: `{ "desktop": 120, "mobile": 80 }` (±1). `du` shows desktop ≤ 6 MB and mobile ≤ 2.5 MB. If a folder is over the limit, lower the quality (70 → 60, 65 → 55) and run again.

- [ ] **Step 5: Write the failing tests for `heroFrameUrls` and the assets check**

`lib/heroFrames.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { heroFrameUrls } from "./heroFrames";

describe("heroFrameUrls", () => {
  it("generates numbered paths starting at 0001", () => {
    const urls = heroFrameUrls("mobile", 3);
    expect(urls).toEqual([
      "/frames/hero/mobile/frame_0001.webp",
      "/frames/hero/mobile/frame_0002.webp",
      "/frames/hero/mobile/frame_0003.webp",
    ]);
  });

  it("uses the manifest count by default", () => {
    expect(heroFrameUrls("desktop").length).toBeGreaterThan(60);
  });
});
```

`scripts/check-assets.mjs`:
```js
import { existsSync, statSync, readFileSync } from "node:fs";

const files = [
  "public/images/brand/logo.svg",
  "public/images/hero/door-still.webp",
  "public/images/salas/space.webp",
  "public/images/salas/proposito.webp",
  "public/images/salas/fe-poder.webp",
  "public/images/textures/parchment.webp",
  "public/images/textures/stone-row.webp",
  "public/images/textures/velvet.webp",
  "public/images/textures/comunidade.webp",
  "public/images/ornaments/finial-ink.svg",
  "public/images/ornaments/finial-cream.svg",
  "public/images/icons/arrow-prev.svg",
  "public/images/icons/arrow-next.svg",
  "public/images/icons/faq-toggle.svg",
  "public/images/perguntas/scene.webp",
  ...[1, 2, 3, 4].map((n) => `public/images/trilhas/step-${n}.webp`),
];
const manifest = JSON.parse(readFileSync("content/hero-frames.json", "utf8"));
for (const variant of ["desktop", "mobile"]) {
  for (let i = 1; i <= manifest[variant]; i++) {
    files.push(`public/frames/hero/${variant}/frame_${String(i).padStart(4, "0")}.webp`);
  }
}
const missing = files.filter((f) => !existsSync(f) || statSync(f).size === 0);
if (missing.length) {
  console.error("Missing or empty assets:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} assets`);
```

- [ ] **Step 6: Run and confirm failure**

Run: `npx vitest run lib/heroFrames`
Expected: FAIL. Module `./heroFrames` not found.

- [ ] **Step 7: Implement `lib/heroFrames.ts`**

```ts
import manifest from "@/content/hero-frames.json";

export type FrameVariant = "desktop" | "mobile";

export function heroFrameUrls(variant: FrameVariant, count: number = manifest[variant]): string[] {
  return Array.from(
    { length: count },
    (_, i) => `/frames/hero/${variant}/frame_${String(i + 1).padStart(4, "0")}.webp`,
  );
}
```

- [ ] **Step 8: Run and confirm it passes**

Run: `npx vitest run lib/heroFrames && npm run check:assets`
Expected: PASS (2 tests) and `OK: <n> assets`.

- [ ] **Step 9: Commit**

```bash
git add public content/hero-frames.json scripts lib/heroFrames.ts lib/heroFrames.test.ts
git commit -m "feat: assets do Figma e frames provisórios do Hero" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Motion math (`lib/motion/math.ts`)

**Files:**
- Create: `lib/motion/math.ts`
- Test: `lib/motion/math.test.ts`

**Interfaces:**
- Produces:
```ts
clamp(v: number, min?: number, max?: number): number
progressToFrame(progress: number, frameCount: number): number
frameLoadOrder(frameCount: number, stride?: number): number[]
nearestLoaded(target: number, loaded: readonly boolean[]): number   // -1 if none
coverRect(iw: number, ih: number, cw: number, ch: number, focalY?: number): { dx: number; dy: number; dw: number; dh: number }
type TunnelLayout = { zs: number[]; total: number }
tunnelLayout(count: number, opts?: { spacing?: number; start?: number; exit?: number }): TunnelLayout
progressForItem(index: number, layout: TunnelLayout): number
tunnelVisual(distance: number, opts?: { far?: number; fadeOut?: number; maxBlur?: number }): { opacity: number; blur: number }
indexAtProgress(p: number, starts: readonly number[]): number
wrap(min: number, max: number, v: number): number
```

- [ ] **Step 1: Write the failing tests**

`lib/motion/math.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import {
  clamp, coverRect, frameLoadOrder, indexAtProgress, nearestLoaded,
  progressForItem, progressToFrame, tunnelLayout, tunnelVisual, wrap,
} from "./math";

describe("clamp", () => {
  it("limits to [0, 1] by default", () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(2)).toBe(1);
    expect(clamp(0.4)).toBe(0.4);
  });
});

describe("progressToFrame", () => {
  it("maps 0 → first frame and 1 → last frame", () => {
    expect(progressToFrame(0, 120)).toBe(0);
    expect(progressToFrame(1, 120)).toBe(119);
    expect(progressToFrame(0.5, 121)).toBe(60);
  });
  it("clamps out-of-range progress and zero frames", () => {
    expect(progressToFrame(1.5, 10)).toBe(9);
    expect(progressToFrame(-0.2, 10)).toBe(0);
    expect(progressToFrame(0.5, 0)).toBe(0);
  });
});

describe("frameLoadOrder", () => {
  it("loads coarse first, then the last frame, then fills the gaps", () => {
    expect(frameLoadOrder(10, 4)).toEqual([0, 4, 8, 9, 2, 6, 1, 3, 5, 7]);
  });
  it("contains every frame exactly once", () => {
    const order = frameLoadOrder(121);
    expect(order).toHaveLength(121);
    expect(new Set(order).size).toBe(121);
  });
});

describe("nearestLoaded", () => {
  it("returns the target when loaded, or the nearest one (lower index wins a tie)", () => {
    const loaded = [true, false, false, false, true];
    expect(nearestLoaded(0, loaded)).toBe(0);
    expect(nearestLoaded(1, loaded)).toBe(0);
    expect(nearestLoaded(3, loaded)).toBe(4);
    expect(nearestLoaded(2, loaded)).toBe(0);
  });
  it("returns -1 when nothing is loaded", () => {
    expect(nearestLoaded(2, [false, false, false])).toBe(-1);
  });
});

describe("coverRect", () => {
  it("covers the canvas keeping the proportion and centers it", () => {
    expect(coverRect(200, 100, 100, 100)).toEqual({ dx: -50, dy: 0, dw: 200, dh: 100 });
  });
  it("respects focalY when cropping vertically", () => {
    expect(coverRect(100, 200, 100, 100, 0)).toEqual({ dx: 0, dy: 0, dw: 100, dh: 200 });
    expect(coverRect(100, 200, 100, 100, 1)).toEqual({ dx: 0, dy: -100, dw: 100, dh: 200 });
  });
});

describe("tunnel", () => {
  it("spaces items in Z and computes the total path", () => {
    const layout = tunnelLayout(3, { spacing: 1000, start: 500, exit: 800 });
    expect(layout.zs).toEqual([500, 1500, 2500]);
    expect(layout.total).toBe(3300);
    expect(progressForItem(1, layout)).toBeCloseTo(1500 / 3300);
  });
  it("empty layout", () => {
    expect(tunnelLayout(0)).toEqual({ zs: [], total: 0 });
  });
  it("visual by distance: far is invisible/blurred, close is sharp, past fades out", () => {
    const o = { far: 4000, fadeOut: -600, maxBlur: 6 };
    expect(tunnelVisual(5000, o)).toEqual({ opacity: 0, blur: 6 });
    expect(tunnelVisual(4000, o)).toEqual({ opacity: 0, blur: 6 });
    expect(tunnelVisual(2000, o)).toEqual({ opacity: 0.5, blur: 3 });
    expect(tunnelVisual(0, o)).toEqual({ opacity: 1, blur: 0 });
    expect(tunnelVisual(-300, o)).toEqual({ opacity: 0.5, blur: 0 });
    expect(tunnelVisual(-600, o)).toEqual({ opacity: 0, blur: 0 });
    expect(tunnelVisual(-900, o)).toEqual({ opacity: 0, blur: 0 });
  });
});

describe("indexAtProgress", () => {
  it("returns the last start reached", () => {
    const starts = [0.3, 0.55, 0.78];
    expect(indexAtProgress(0, starts)).toBe(0);
    expect(indexAtProgress(0.56, starts)).toBe(1);
    expect(indexAtProgress(0.9, starts)).toBe(2);
  });
});

describe("wrap", () => {
  it("wraps into the interval [min, max)", () => {
    expect(wrap(-50, 0, -60)).toBe(-10);
    expect(wrap(-50, 0, 10)).toBe(-40);
    expect(wrap(-50, 0, -25)).toBe(-25);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run lib/motion`
Expected: FAIL. Module `./math` not found.

- [ ] **Step 3: Implement**

`lib/motion/math.ts`:
```ts
export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

export function progressToFrame(progress: number, frameCount: number): number {
  if (frameCount <= 0) return 0;
  return Math.round(clamp(progress) * (frameCount - 1));
}

export function frameLoadOrder(frameCount: number, stride = 8): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const add = (i: number) => {
    if (i >= 0 && i < frameCount && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  let s = Math.max(1, stride);
  let first = true;
  while (true) {
    for (let i = 0; i < frameCount; i += s) add(i);
    if (first) {
      add(frameCount - 1);
      first = false;
    }
    if (s === 1) break;
    s = Math.max(1, Math.floor(s / 2));
  }
  return order;
}

export function nearestLoaded(target: number, loaded: readonly boolean[]): number {
  for (let d = 0; d < loaded.length; d++) {
    if (loaded[target - d]) return target - d;
    if (loaded[target + d]) return target + d;
  }
  return -1;
}

export function coverRect(iw: number, ih: number, cw: number, ch: number, focalY = 0.5) {
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  return { dx: (cw - dw) / 2, dy: (ch - dh) * focalY, dw, dh };
}

export type TunnelLayout = { zs: number[]; total: number };

export function tunnelLayout(
  count: number,
  { spacing = 1400, start = 1200, exit = 1200 }: { spacing?: number; start?: number; exit?: number } = {},
): TunnelLayout {
  const zs = Array.from({ length: count }, (_, i) => start + i * spacing);
  return { zs, total: count ? zs[count - 1] + exit : 0 };
}

export function progressForItem(index: number, layout: TunnelLayout): number {
  return layout.total ? layout.zs[index] / layout.total : 0;
}

export function tunnelVisual(
  distance: number,
  { far = 4200, fadeOut = -600, maxBlur = 6 }: { far?: number; fadeOut?: number; maxBlur?: number } = {},
): { opacity: number; blur: number } {
  if (distance >= far) return { opacity: 0, blur: maxBlur };
  if (distance >= 0) {
    const t = 1 - distance / far;
    return { opacity: t, blur: maxBlur * (1 - t) };
  }
  if (distance > fadeOut) return { opacity: 1 - distance / fadeOut, blur: 0 };
  return { opacity: 0, blur: 0 };
}

export function indexAtProgress(p: number, starts: readonly number[]): number {
  let idx = 0;
  starts.forEach((s, i) => {
    if (p >= s) idx = i;
  });
  return idx;
}

export function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}
```

- [ ] **Step 4: Run and confirm it passes**

Run: `npx vitest run lib/motion`
Expected: PASS (all tests). `tunnelVisual(2000)` returns exactly `0.5`/`3` (t = 0.5).

- [ ] **Step 5: Commit**

```bash
git add lib/motion
git commit -m "feat: matemática de motion (frames, túnel, wrap)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: SmoothScroll + SceneTrack + scrollToSceneProgress

**Files:**
- Create: `components/motion/SmoothScroll.tsx`, `components/motion/SceneTrack.tsx`, `lib/scrollToSceneProgress.ts`
- Modify: `app/layout.tsx` (wrap `children` in `<SmoothScroll>`)
- Test: `components/motion/SceneTrack.test.tsx`

**Interfaces:**
- Consumes: `cn`, `usePrefersReducedMotion` (Task 1).
- Produces:
```ts
export type TrackHeights = { desktop: number; mobile: number };
<SceneTrack id: string labelledBy: string heights: TrackHeights className?: string stageClassName?: string>
  {(progress: MotionValue<number>, reduced: boolean) => ReactNode}
</SceneTrack>
<SmoothScroll>{children}</SmoothScroll>
scrollToSceneProgress(sectionId: string, progress: number, behavior?: ScrollBehavior): void
```

- [ ] **Step 1: Write the failing test**

`components/motion/SceneTrack.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setMatchMedia } from "@/vitest.setup";
import { SceneTrack } from "./SceneTrack";

const heights = { desktop: 300, mobile: 180 };

describe("SceneTrack", () => {
  it("creates the track with the height variables and a sticky stage", () => {
    setMatchMedia(() => false);
    render(
      <SceneTrack id="teste" labelledBy="t" heights={heights}>
        {(_p, reduced) => <h2 id="t">{reduced ? "reduzido" : "animado"}</h2>}
      </SceneTrack>,
    );
    const section = document.getElementById("teste")!;
    expect(section).toHaveAttribute("data-reduced", "false");
    expect(section.style.getPropertyValue("--track-d")).toBe("300svh");
    expect(section.style.getPropertyValue("--track-m")).toBe("180svh");
    expect(section.firstElementChild).toHaveClass("sticky");
    expect(screen.getByRole("heading", { name: "animado" })).toBeInTheDocument();
  });

  it("with reduced motion it neither pins nor sets a height", () => {
    setMatchMedia((q) => q.includes("reduce"));
    render(
      <SceneTrack id="red" labelledBy="r" heights={heights}>
        {(_p, reduced) => <h2 id="r">{reduced ? "reduzido" : "animado"}</h2>}
      </SceneTrack>,
    );
    const section = document.getElementById("red")!;
    expect(section).toHaveAttribute("data-reduced", "true");
    expect(section.style.getPropertyValue("--track-d")).toBe("");
    expect(section.firstElementChild).not.toHaveClass("sticky");
    expect(screen.getByRole("heading", { name: "reduzido" })).toBeInTheDocument();
    setMatchMedia(() => false);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/motion/SceneTrack`
Expected: FAIL. Module `./SceneTrack` not found.

- [ ] **Step 3: Implement**

`components/motion/SceneTrack.tsx`:
```tsx
"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScroll, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export type TrackHeights = { desktop: number; mobile: number };

type Props = {
  id: string;
  labelledBy: string;
  heights: TrackHeights;
  className?: string;
  stageClassName?: string;
  children: (progress: MotionValue<number>, reduced: boolean) => ReactNode;
};

export function SceneTrack({ id, labelledBy, heights, className, stageClassName, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const style = reduced
    ? undefined
    : ({ "--track-d": `${heights.desktop}svh`, "--track-m": `${heights.mobile}svh` } as CSSProperties);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      data-reduced={reduced ? "true" : "false"}
      style={style}
      className={cn("relative", !reduced && "h-[var(--track-m)] md:h-[var(--track-d)]", className)}
    >
      <div className={cn(reduced ? "relative" : "sticky top-0 h-svh overflow-hidden", stageClassName)}>
        {children(scrollYProgress, reduced)}
      </div>
    </section>
  );
}
```

`components/motion/SmoothScroll.tsx`:
```tsx
"use client";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    let raf = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);
  return <>{children}</>;
}
```

`lib/scrollToSceneProgress.ts`:
```ts
export function scrollToSceneProgress(sectionId: string, progress: number, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(0, el.offsetHeight - window.innerHeight);
  window.scrollTo({ top: top + range * progress, behavior });
}
```

In `app/layout.tsx`: `import { SmoothScroll } from "@/components/motion/SmoothScroll";` and replace `<body>{children}</body>` with `<body><SmoothScroll>{children}</SmoothScroll></body>`.

- [ ] **Step 4: Run and confirm it passes**

Run: `npx vitest run components/motion/SceneTrack && npm run build`
Expected: PASS (2 tests) and build OK.

- [ ] **Step 5: Commit**

```bash
git add components/motion lib/scrollToSceneProgress.ts app/layout.tsx
git commit -m "feat: SceneTrack, SmoothScroll (Lenis) e scrollToSceneProgress" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: FrameSequence (canvas driven by scroll)

**Files:**
- Create: `components/motion/FrameSequence.tsx`
- Test: `components/motion/FrameSequence.test.tsx`

**Interfaces:**
- Consumes: `frameLoadOrder`, `nearestLoaded`, `progressToFrame`, `coverRect` (Task 4).
- Produces: `<FrameSequence frames: string[] progress: MotionValue<number> focalY?: number className?: string />`, rendering a `<canvas aria-hidden="true" data-testid="frame-sequence">`.

- [ ] **Step 1: Write the failing test**

`components/motion/FrameSequence.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { motionValue } from "motion/react";
import { describe, expect, it } from "vitest";
import { FrameSequence } from "./FrameSequence";

describe("FrameSequence", () => {
  it("renders a decorative canvas and survives without a 2d context (jsdom)", () => {
    render(<FrameSequence frames={["/a.webp", "/b.webp"]} progress={motionValue(0.5)} className="x" />);
    const canvas = screen.getByTestId("frame-sequence");
    expect(canvas.tagName).toBe("CANVAS");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas).toHaveClass("x");
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/motion/FrameSequence`
Expected: FAIL. Module not found.

- [ ] **Step 3: Implement**

`components/motion/FrameSequence.tsx`:
```tsx
"use client";
import { useCallback, useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { coverRect, frameLoadOrder, nearestLoaded, progressToFrame } from "@/lib/motion/math";

type Props = { frames: string[]; progress: MotionValue<number>; focalY?: number; className?: string };

const CONCURRENCY = 6;

export function FrameSequence({ frames, progress, focalY = 0.5, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const loaded = useRef<boolean[]>([]);
  const drawn = useRef(-1);

  const draw = useCallback(
    (force = false) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const target = progressToFrame(progress.get(), frames.length);
      const idx = nearestLoaded(target, loaded.current);
      if (idx < 0 || (idx === drawn.current && !force)) return;
      const img = images.current[idx];
      const { dx, dy, dw, dh } = coverRect(img.naturalWidth, img.naturalHeight, canvas.width, canvas.height, focalY);
      ctx.drawImage(img, dx, dy, dw, dh);
      drawn.current = idx;
    },
    [frames, progress, focalY],
  );

  useEffect(() => {
    images.current = [];
    loaded.current = new Array(frames.length).fill(false);
    drawn.current = -1;
    let cancelled = false;
    const order = frameLoadOrder(frames.length);
    let cursor = 0;
    const next = () => {
      if (cancelled || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        loaded.current[i] = true;
        draw();
        next();
      };
      img.onerror = () => next();
      img.src = frames[i];
      images.current[i] = img;
    };
    for (let k = 0; k < CONCURRENCY; k++) next();
    return () => {
      cancelled = true;
    };
  }, [frames, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(true);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  useMotionValueEvent(progress, "change", () => draw());

  return <canvas ref={canvasRef} aria-hidden="true" data-testid="frame-sequence" className={className} />;
}
```

- [ ] **Step 4: Run and confirm it passes**

Run: `npx vitest run components/motion/FrameSequence`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/motion/FrameSequence.tsx components/motion/FrameSequence.test.tsx
git commit -m "feat: FrameSequence com carregamento progressivo de frames" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Text and parallax (SplitText, TwoToneTitle, ParallaxLayer)

**Files:**
- Create: `components/motion/SplitText.tsx`, `components/motion/TwoToneTitle.tsx`, `components/motion/ParallaxLayer.tsx`
- Test: `components/motion/text.test.tsx`

**Interfaces:**
- Consumes: `cn`, `usePrefersReducedMotion`.
- Produces:
```ts
<SplitText text: string progress: MotionValue<number> range: [number, number] reduced?: boolean className?: string />
// renders <span class="sr-only">text</span> + aria-hidden words
<TwoToneTitle dim: string lit: string id?: string className?: string dimClassName?: string litClassName?: string
  progress?: MotionValue<number> range?: [number, number] breakAfterDim?: boolean />   // always an <h2>
<ParallaxLayer speed?: number className?: string>{children}</ParallaxLayer>   // speed in px (default 80)
```

- [ ] **Step 1: Write the failing test**

`components/motion/text.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { motionValue } from "motion/react";
import { describe, expect, it } from "vitest";
import { ParallaxLayer } from "./ParallaxLayer";
import { SplitText } from "./SplitText";
import { TwoToneTitle } from "./TwoToneTitle";

describe("SplitText", () => {
  it("keeps the whole text for screen readers and hides the words", () => {
    render(<h2><SplitText text="Curadoria de museu" progress={motionValue(0)} range={[0, 0.2]} /></h2>);
    expect(screen.getByRole("heading", { name: "Curadoria de museu" })).toBeInTheDocument();
    const hidden = document.querySelector("[aria-hidden='true']")!;
    expect(hidden.children).toHaveLength(3);
  });
});

describe("TwoToneTitle", () => {
  it("renders an h2 with both parts", () => {
    render(<TwoToneTitle id="x" dim="Artigos," lit="vídeos e verbetes" />);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h).toHaveAttribute("id", "x");
    expect(h).toHaveTextContent("Artigos, vídeos e verbetes");
  });
});

describe("ParallaxLayer", () => {
  it("renders the children", () => {
    render(<ParallaxLayer><p>conteúdo</p></ParallaxLayer>);
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/motion/text`
Expected: FAIL. Modules not found.

- [ ] **Step 3: Implement**

`components/motion/SplitText.tsx`:
```tsx
"use client";
import { motion, useTransform, type MotionValue } from "motion/react";

type Props = { text: string; progress: MotionValue<number>; range: [number, number]; reduced?: boolean; className?: string };

export function SplitText({ text, progress, range, reduced = false, className }: Props) {
  const words = text.split(" ");
  const [start, end] = range;
  const step = (end - start) / words.length;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word key={`${word}-${i}`} word={word} progress={progress} from={start + i * step} to={start + (i + 2) * step} reduced={reduced} />
        ))}
      </span>
    </span>
  );
}

function Word({ word, progress, from, to, reduced }: { word: string; progress: MotionValue<number>; from: number; to: number; reduced: boolean }) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], ["0.35em", "0em"]);
  const filter = useTransform(progress, [from, to], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.span className="mr-[0.25em] inline-block last:mr-0" style={reduced ? undefined : { opacity, y, filter }}>
      {word}
    </motion.span>
  );
}
```

`components/motion/TwoToneTitle.tsx`:
```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

type Props = {
  dim: string;
  lit: string;
  id?: string;
  className?: string;
  dimClassName?: string;
  litClassName?: string;
  progress?: MotionValue<number>;
  range?: [number, number];
  breakAfterDim?: boolean;
};

export function TwoToneTitle({ dim, lit, id, className, dimClassName, litClassName, progress, range = [0, 1], breakAfterDim = false }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();
  const own = useScroll({ target: ref, offset: ["start 85%", "start 35%"] }).scrollYProgress;
  const litOpacity = useTransform(progress ?? own, range, [0.35, 1]);
  return (
    <h2 ref={ref} id={id} className={cn("font-display", className)}>
      <span className={dimClassName}>{dim}</span>
      {breakAfterDim ? <br /> : " "}
      <motion.span className={litClassName} style={{ opacity: reduced ? 1 : litOpacity }}>
        {lit}
      </motion.span>
    </h2>
  );
}
```

`components/motion/ParallaxLayer.tsx`:
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export function ParallaxLayer({ children, speed = 80, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} className={className} style={{ y: reduced ? 0 : y }}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run and confirm it passes**

Run: `npx vitest run components/motion/text`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/motion
git commit -m "feat: SplitText, TwoToneTitle e ParallaxLayer" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Nav + Hero (through the door)

**Files:**
- Create: `components/ui/Pill.tsx`, `components/scenes/Nav.tsx`, `components/scenes/HeroDoor.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx` (metadata from `site.meta`)
- Test: `components/scenes/hero.test.tsx`

**Interfaces:**
- Consumes: `SceneTrack`, `FrameSequence`, `heroFrameUrls`, `useMediaQuery`, `cn`, `site`, types `NavContent` / `HeroContent`.
- Produces: `<Pill href variant?: "solid" | "glass" external? className?>`, `<Tag>{label}</Tag>`, `<Nav nav: NavContent />`, `<HeroDoor content: HeroContent />`, `HERO_TRACK`.

- [ ] **Step 1: Write the failing test**

`components/scenes/hero.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { HeroDoor } from "./HeroDoor";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("lists the anchors and the acervo CTA", () => {
    render(<Nav nav={site.nav} />);
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Entrar no acervo" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Trilhas" })[0]).toHaveAttribute("href", "#trilhas");
  });

  it("opens the mobile menu", async () => {
    render(<Nav nav={site.nav} />);
    const btn = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("menu-mobile")).toBeInTheDocument();
  });
});

describe("HeroDoor", () => {
  it("has the page's only h1 and the canvas", () => {
    render(<HeroDoor content={site.hero} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A porta está aberta");
    expect(document.getElementById("inicio")).toHaveAttribute("aria-labelledby", "hero-title");
    expect(screen.getByTestId("frame-sequence")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/hero`
Expected: FAIL. Modules not found.

- [ ] **Step 3: Implement `Pill` / `Tag`**

`components/ui/Pill.tsx`:
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "glass";

const variants: Record<Variant, string> = {
  solid: "bg-white px-5 py-2.5 text-wine hover:bg-cream",
  glass: "bg-black/20 px-7 py-3 text-white backdrop-blur-md hover:bg-black/35",
};

export function Pill({ href, children, variant = "solid", external, className }: {
  href: string; children: ReactNode; variant?: Variant; external?: boolean; className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold",
        "transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream",
        variants[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-cream/20 bg-white/5 px-4 py-2.5 text-sm text-cream/80", className)}>
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Implement `Nav`**

`components/scenes/Nav.tsx`:
```tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import type { NavContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { Pill } from "@/components/ui/Pill";

export function Nav({ nav }: { nav: NavContent }) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 80));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,padding,backdrop-filter] duration-300 ease-cinema",
        compact ? "bg-night/70 py-2 backdrop-blur-md" : "py-3",
      )}
    >
      <nav aria-label="Principal" className="container-page flex items-center justify-between">
        <a href="#inicio" aria-label="A Sala dos Buscadores, início" className="rounded-sm focus-visible:outline-2 focus-visible:outline-cream">
          <Image
            src="/images/brand/logo.svg"
            alt=""
            width={134}
            height={41}
            priority
            className={cn("h-auto transition-[width] duration-300 ease-cinema", compact ? "w-[104px]" : "w-[134px]")}
          />
        </a>
        <ul className="hidden items-center gap-8 lg:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium text-cream/60 transition-colors duration-200 hover:text-cream focus-visible:text-cream">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Pill href={nav.cta.href}>{nav.cta.label}</Pill>
          </li>
        </ul>
        <div className="flex items-center gap-3 lg:hidden">
          <Pill href={nav.cta.href}>{nav.cta.label}</Pill>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-cream/30 px-4 py-2 text-sm text-cream transition-transform duration-150 active:scale-[0.97]"
          >
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </nav>
      {open && (
        <ul id="menu-mobile" className="container-page mt-3 flex flex-col gap-1 rounded-2xl bg-night/95 p-4 lg:hidden">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base text-cream/80 hover:bg-white/5">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
```

- [ ] **Step 5: Implement `HeroDoor`**

`components/scenes/HeroDoor.tsx`:
```tsx
"use client";
import Image from "next/image";
import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { HeroContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { FrameSequence } from "@/components/motion/FrameSequence";
import { Pill } from "@/components/ui/Pill";
import { heroFrameUrls } from "@/lib/heroFrames";
import { useMediaQuery } from "@/lib/useMediaQuery";

export const HERO_TRACK = { desktop: 400, mobile: 240 };

const SIDE_SHADE =
  "linear-gradient(90deg,#0c0404 0%,#0c0404 11.7%,rgba(12,4,4,0) 41%,rgba(12,4,4,0) 59%,#0c0404 88.3%,#0c0404 100%)";

export function HeroDoor({ content }: { content: HeroContent }) {
  return (
    <SceneTrack id="inicio" labelledBy="hero-title" heights={HERO_TRACK} className="bg-night">
      {(progress, reduced) => <HeroStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function HeroStage({ content, progress, reduced }: { content: HeroContent; progress: MotionValue<number>; reduced: boolean }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const frames = useMemo(() => heroFrameUrls(isMobile ? "mobile" : "desktop"), [isMobile]);

  const leftX = useTransform(progress, [0.08, 0.5], ["0vw", "-45vw"]);
  const rightX = useTransform(progress, [0.08, 0.5], ["0vw", "45vw"]);
  const copyOpacity = useTransform(progress, [0.08, 0.4], [1, 0]);
  const copyBlur = useTransform(progress, [0.08, 0.4], ["blur(0px)", "blur(14px)"]);
  const ctaOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  const shade = useTransform(progress, [0.2, 0.6], [1, 0]);
  const on = <T,>(v: T) => (reduced ? undefined : v);

  return (
    <div className="relative h-svh min-h-[560px] w-full overflow-hidden bg-night">
      <Image src="/images/hero/door-still.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      {!reduced && <FrameSequence frames={frames} progress={progress} focalY={0.57} className="absolute inset-0 h-full w-full" />}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: SIDE_SHADE, opacity: on(shade) }} />

      <div className="container-page relative flex h-full flex-col justify-between pb-10 pt-[18vh] md:pb-12 md:pt-[24vh]">
        <motion.h1
          id="hero-title"
          style={{ x: on(leftX), opacity: on(copyOpacity), filter: on(copyBlur) }}
          className="font-display text-[clamp(52px,5.8vw,84px)] leading-[0.85] text-bone"
        >
          {content.title[0]}
          <br />
          {content.title[1]}
        </motion.h1>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p style={{ x: on(leftX), opacity: on(copyOpacity) }} className="max-w-[282px] text-base font-light leading-[1.1] text-bone/60">
            {content.description}
          </motion.p>
          <motion.div style={{ opacity: on(ctaOpacity) }} className="md:absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2">
            <Pill href={content.cta.href} variant="glass">{content.cta.label}</Pill>
          </motion.div>
          <motion.p
            style={{ x: on(rightX), opacity: on(copyOpacity), filter: on(copyBlur) }}
            className="font-display text-[clamp(44px,5vw,72px)] leading-[0.85] text-bone md:text-right"
          >
            {content.tagline[0]}
            <br />
            {content.tagline[1]}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Wire it into the page and the metadata**

`app/page.tsx`:
```tsx
import { site } from "@/content/site";
import { Nav } from "@/components/scenes/Nav";
import { HeroDoor } from "@/components/scenes/HeroDoor";

export default function Home() {
  return (
    <>
      <Nav nav={site.nav} />
      <main>
        <HeroDoor content={site.hero} />
      </main>
    </>
  );
}
```

In `app/layout.tsx`, replace the `metadata` object:
```tsx
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
  openGraph: { title: site.meta.title, description: site.meta.description, images: [site.meta.ogImage], locale: "pt_BR", type: "website" },
};
```

- [ ] **Step 7: Run the tests**

Run: `npx vitest run components/scenes/hero`
Expected: PASS (3 tests).

- [ ] **Step 8: Visual check against Figma**

```bash
npm run dev &   # leave it running
npm run shot -- inicio 0 1440
npm run shot -- inicio 0.5 1440
npm run shot -- inicio 1 1440
npm run shot -- inicio 0 375
```

Compare `shots/inicio-0-1440.png` with `get_screenshot 196:25`. Check: position and size of the titles, nav, CTA, side gradients. Adjust classes for any visible difference (compare against the `get_design_context 196:25` values: titles 84px/72px, `leading-[0.85]`, text 16px Inter Light at 60%). At progress 0.5, the texts have left and the door is closer. At 1, the starry sky fills the screen. At 375, no horizontal overflow. Apply the `emil-design-eng` checklist to the Hero motion (easing, no pop, consistent speed).

- [ ] **Step 9: Commit**

```bash
git add components app
git commit -m "feat: Nav e cena Hero atravessando a porta" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Salas — 3D tunnel (DepthTunnel + SalaCard)

**Files:**
- Create: `components/motion/DepthTunnel.tsx`, `components/ui/SalaCard.tsx`, `components/scenes/Salas.tsx`
- Modify: `app/page.tsx`
- Test: `components/scenes/salas.test.tsx`

**Interfaces:**
- Consumes: `tunnelLayout`, `progressForItem`, `tunnelVisual`, `TunnelLayout` (Task 4); `SceneTrack`; `scrollToSceneProgress`; `useMediaQuery`.
- Produces:
```ts
export type TunnelEntry = { key: string; x: number /* vw */; y: number /* vh */; node: ReactNode };
<DepthTunnel items: TunnelEntry[] layout: TunnelLayout progress: MotionValue<number> maxBlur?: number perspective?: number className?: string />
<SalaCard sala: Sala size: "tunnel" | "grid" onFocus?: () => void />
<Salas content: SalasContent />   SALAS_TRACK
```

- [ ] **Step 1: Write the failing test**

`components/scenes/salas.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { setMatchMedia } from "@/vitest.setup";
import { Salas } from "./Salas";

describe("Salas", () => {
  it("tunnel: title and 5 links with each Sala's name", () => {
    setMatchMedia(() => false);
    render(<Salas content={site.salas} />);
    expect(screen.getByRole("heading", { name: "A sala do primeiro ciclo" })).toBeInTheDocument();
    for (const sala of site.salas.salas) {
      expect(screen.getByRole("link", { name: sala.name })).toBeInTheDocument();
    }
    expect(document.querySelector("[data-tunnel]")).toBeInTheDocument();
  });

  it("reduced motion: grid with no tunnel", () => {
    setMatchMedia((q) => q.includes("reduce"));
    render(<Salas content={site.salas} />);
    expect(document.querySelector("[data-tunnel]")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(5);
    setMatchMedia(() => false);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/salas`
Expected: FAIL. Module not found.

- [ ] **Step 3: Implement `DepthTunnel`**

`components/motion/DepthTunnel.tsx`:
```tsx
"use client";
import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { tunnelVisual, type TunnelLayout } from "@/lib/motion/math";

export type TunnelEntry = { key: string; x: number; y: number; node: ReactNode };

type Props = {
  items: TunnelEntry[];
  layout: TunnelLayout;
  progress: MotionValue<number>;
  maxBlur?: number;
  perspective?: number;
  className?: string;
};

export function DepthTunnel({ items, layout, progress, maxBlur = 6, perspective = 1200, className }: Props) {
  const camera = useTransform(progress, [0, 1], [0, layout.total]);
  return (
    <div data-tunnel className={className} style={{ perspective: `${perspective}px` }}>
      <motion.div className="absolute inset-0" style={{ z: camera, transformStyle: "preserve-3d" }}>
        {items.map((item, i) => (
          <TunnelItem key={item.key} entry={item} z={layout.zs[i]} camera={camera} maxBlur={maxBlur} />
        ))}
      </motion.div>
    </div>
  );
}

function TunnelItem({ entry, z, camera, maxBlur }: { entry: TunnelEntry; z: number; camera: MotionValue<number>; maxBlur: number }) {
  const opacity = useTransform(camera, (c) => tunnelVisual(z - c, { maxBlur }).opacity);
  const filter = useTransform(camera, (c) => {
    const b = tunnelVisual(z - c, { maxBlur }).blur;
    return b > 0.05 ? `blur(${b.toFixed(2)}px)` : "none";
  });
  return (
    <motion.div
      className="absolute"
      style={{ left: `calc(50% + ${entry.x}vw)`, top: `calc(50% + ${entry.y}vh)`, x: "-50%", y: "-50%", z: -z, opacity, filter }}
    >
      {entry.node}
    </motion.div>
  );
}
```

- [ ] **Step 4: Implement `SalaCard`**

`components/ui/SalaCard.tsx`:
```tsx
import Image from "next/image";
import type { Sala } from "@/content/types";
import { cn } from "@/lib/cn";

const sizes = {
  tunnel: "w-[80vw] md:w-[min(36vw,560px)]",
  grid: "w-full",
};

export function SalaCard({ sala, size, onFocus }: { sala: Sala; size: keyof typeof sizes; onFocus?: () => void }) {
  return (
    <a
      href={sala.href}
      onFocus={onFocus}
      className={cn(
        "group relative block aspect-video overflow-hidden rounded-sm shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]",
        "outline-offset-4 focus-visible:outline-2 focus-visible:outline-cream",
        sizes[size],
      )}
    >
      {sala.image ? (
        <>
          <Image
            src={sala.image}
            alt=""
            fill
            sizes="(max-width: 767px) 80vw, 560px"
            className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.03]"
          />
          <span className="sr-only">{sala.name}</span>
        </>
      ) : (
        <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#2a1a14_0%,#0c0404_75%)] px-6 text-center font-display text-[clamp(20px,2.4vw,36px)] uppercase tracking-[0.12em] text-[#e9cf9f]">
          {sala.name}
        </span>
      )}
    </a>
  );
}
```

- [ ] **Step 5: Implement the `Salas` scene**

`components/scenes/Salas.tsx`:
```tsx
"use client";
import Image from "next/image";
import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { SalasContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { DepthTunnel, type TunnelEntry } from "@/components/motion/DepthTunnel";
import { SalaCard } from "@/components/ui/SalaCard";
import { progressForItem, tunnelLayout } from "@/lib/motion/math";
import { scrollToSceneProgress } from "@/lib/scrollToSceneProgress";
import { useMediaQuery } from "@/lib/useMediaQuery";

export const SALAS_TRACK = { desktop: 400, mobile: 260 };

// Positions (vw, vh) relative to the center, following the Figma composition (196:47)
const DESKTOP_POS = [
  { x: -22, y: -18 },
  { x: 22, y: -16 },
  { x: -20, y: 18 },
  { x: 18, y: 20 },
  { x: 0, y: -4 },
];

export function Salas({ content }: { content: SalasContent }) {
  return (
    <SceneTrack id="salas" labelledBy="salas-title" heights={SALAS_TRACK} className="bg-night">
      {(progress, reduced) => (reduced ? <SalasGrid content={content} /> : <SalasTunnel content={content} progress={progress} />)}
    </SceneTrack>
  );
}

function SalasTitle({ content }: { content: SalasContent }) {
  return (
    <div className="text-center">
      <h2 id="salas-title" className="font-display text-[clamp(36px,3.8vw,56px)] leading-none text-bone">{content.title}</h2>
      <p className="mx-auto mt-6 max-w-[356px] text-sm font-light leading-snug text-bone/60">{content.subtitle}</p>
    </div>
  );
}

function SalasTunnel({ content, progress }: { content: SalasContent; progress: MotionValue<number> }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const layout = useMemo(
    () => tunnelLayout(content.salas.length, isMobile ? { spacing: 1000, start: 900, exit: 900 } : undefined),
    [content.salas.length, isMobile],
  );
  const bgScale = useTransform(progress, [0, 1], [1, 1.25]);
  const titleOpacity = useTransform(progress, [0, 0.1, 0.18, 0.9, 1], [1, 1, 0, 0, 1]);

  const items: TunnelEntry[] = content.salas.map((sala, i) => {
    const pos = isMobile ? { x: 0, y: i % 2 ? 6 : -6 } : DESKTOP_POS[i % DESKTOP_POS.length];
    return {
      key: sala.id,
      ...pos,
      node: <SalaCard sala={sala} size="tunnel" onFocus={() => scrollToSceneProgress("salas", progressForItem(i, layout), "instant")} />,
    };
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ scale: bgScale }}>
        <Image src="/images/salas/space.webp" alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <DepthTunnel items={items} layout={layout} progress={progress} maxBlur={isMobile ? 0 : 6} className="absolute inset-0" />
      <motion.div style={{ opacity: titleOpacity }} className="pointer-events-none absolute inset-0 grid place-items-center px-4">
        <SalasTitle content={content} />
      </motion.div>
    </div>
  );
}

function SalasGrid({ content }: { content: SalasContent }) {
  return (
    <div className="relative overflow-hidden py-28">
      <Image src="/images/salas/space.webp" alt="" fill sizes="100vw" className="object-cover" />
      <div className="container-page relative">
        <SalasTitle content={content} />
        <ul className="mt-16 grid gap-6 md:grid-cols-2">
          {content.salas.map((sala) => (
            <li key={sala.id}>
              <SalaCard sala={sala} size="grid" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

In `app/page.tsx`, import `Salas` and add `<Salas content={site.salas} />` right after `<HeroDoor … />`.

- [ ] **Step 6: Run the tests**

Run: `npx vitest run components/scenes/salas`
Expected: PASS (2 tests).

- [ ] **Step 7: Visual and motion check**

```bash
for p in 0 0.2 0.45 0.7 1; do npm run shot -- salas $p 1440; done
npm run shot -- salas 0.45 375
```

Expected: at 0, only the title over the starry sky. From 0.2 on, cards come from the back (small and blurred), grow and pass the viewer. At 1, the title is back. Scroll manually in `npm run dev` and confirm there is no stutter (Chrome DevTools → Performance, frames ≥ 50 fps on scroll). Press Tab through the cards: each one comes into focus and the page scrolls to it. Compare typography with `get_design_context 196:50`.

- [ ] **Step 8: Commit**

```bash
git add components app
git commit -m "feat: cena Salas como túnel 3D no scroll" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Curadoria (parchment + principles)

**Files:**
- Create: `components/ui/MuseumFrame.tsx`, `components/ui/ArrowButton.tsx`, `components/scenes/Curadoria.tsx`
- Modify: `app/page.tsx`
- Test: `components/scenes/curadoria.test.tsx`

**Interfaces:**
- Consumes: `SceneTrack`, `SplitText`, `Pill`, `indexAtProgress`, `scrollToSceneProgress`, `cn`.
- Produces: `<MuseumFrame tone: "ink" | "cream" />`, `<ArrowButton dir: "prev" | "next" label: string onClick />`, `<Curadoria content: CuradoriaContent />`, `CURADORIA_TRACK`, `PRINCIPLE_STARTS = [0.3, 0.55, 0.78]`.

- [ ] **Step 1: Write the failing test**

`components/scenes/curadoria.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { setMatchMedia } from "@/vitest.setup";
import { Curadoria } from "./Curadoria";

describe("Curadoria", () => {
  it("title and first principle", () => {
    setMatchMedia(() => false);
    render(<Curadoria content={site.curadoria} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Curadoria de museu, não pregação");
    expect(screen.getByRole("heading", { level: 3, name: "Fonte à vista" })).toBeInTheDocument();
  });

  it("with reduced motion, the arrows switch principles directly", async () => {
    setMatchMedia((q) => q.includes("reduce"));
    render(<Curadoria content={site.curadoria} />);
    await userEvent.click(screen.getByRole("button", { name: "Próximo princípio" }));
    expect(await screen.findByRole("heading", { level: 3, name: "Neutralidade doutrinária" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Princípio anterior" }));
    await userEvent.click(screen.getByRole("button", { name: "Princípio anterior" }));
    expect(await screen.findByRole("heading", { level: 3, name: "Comparar sem hierarquizar" })).toBeInTheDocument();
    setMatchMedia(() => false);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/curadoria`
Expected: FAIL. Module not found.

- [ ] **Step 3: Implement `MuseumFrame` and `ArrowButton`**

`components/ui/MuseumFrame.tsx`:
```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";

const tones = {
  ink: { line: "bg-ink/40", ornament: "/images/ornaments/finial-ink.svg" },
  cream: { line: "bg-cream/25", ornament: "/images/ornaments/finial-cream.svg" },
};

export function MuseumFrame({ tone }: { tone: keyof typeof tones }) {
  const t = tones[tone];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className={cn("absolute inset-x-0 top-6 h-px", t.line)} />
      <div className={cn("absolute bottom-0 left-3 top-6 w-px md:left-[90px]", t.line)} />
      <div className={cn("absolute bottom-0 right-3 top-6 w-px md:right-[90px]", t.line)} />
      <Image src={t.ornament} alt="" width={21} height={15} className="absolute left-[2px] top-[33px] h-auto w-[21px] md:left-20" />
      <Image src={t.ornament} alt="" width={21} height={15} className="absolute right-[2px] top-[33px] h-auto w-[21px] md:right-20" />
    </div>
  );
}
```

`components/ui/ArrowButton.tsx`:
```tsx
import Image from "next/image";

export function ArrowButton({ dir, label, onClick }: { dir: "prev" | "next"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Image src={`/images/icons/arrow-${dir}.svg`} alt="" width={44} height={44} />
    </button>
  );
}
```

- [ ] **Step 4: Implement `Curadoria`**

`components/scenes/Curadoria.tsx`:
```tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import type { CuradoriaContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { SplitText } from "@/components/motion/SplitText";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { MuseumFrame } from "@/components/ui/MuseumFrame";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { indexAtProgress } from "@/lib/motion/math";
import { scrollToSceneProgress } from "@/lib/scrollToSceneProgress";

export const CURADORIA_TRACK = { desktop: 300, mobile: 180 };
export const PRINCIPLE_STARTS = [0.3, 0.55, 0.78] as const;

export function Curadoria({ content }: { content: CuradoriaContent }) {
  return (
    <SceneTrack id="curadoria" labelledBy="curadoria-title" heights={CURADORIA_TRACK} className="bg-night">
      {(progress, reduced) => <CuradoriaStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function CuradoriaStage({ content, progress, reduced }: { content: CuradoriaContent; progress: MotionValue<number>; reduced: boolean }) {
  const [active, setActive] = useState(0);
  const n = content.principles.length;
  useMotionValueEvent(progress, "change", (v) => {
    if (!reduced) setActive(indexAtProgress(v, PRINCIPLE_STARTS));
  });
  const clip = useTransform(progress, [0, 0.15], ["inset(50% 0% 50% 0%)", "inset(0% 0% 0% 0%)"]);
  const principlesOpacity = useTransform(progress, [0.22, 0.3], [0, 1]);

  const go = (i: number) => {
    const idx = (i + n) % n;
    if (reduced) setActive(idx);
    else scrollToSceneProgress("curadoria", PRINCIPLE_STARTS[idx] + 0.02);
  };
  const principle = content.principles[active];

  return (
    <motion.div style={{ clipPath: reduced ? undefined : clip }} className="relative h-full min-h-svh w-full overflow-hidden bg-parchment text-charcoal">
      <Image src="/images/textures/parchment.webp" alt="" fill sizes="100vw" className="object-cover" />
      <MuseumFrame tone="ink" />
      <div className="container-page relative flex min-h-svh flex-col justify-between gap-12 py-[12vh]">
        <div className="mx-auto flex max-w-[765px] flex-col items-center gap-10 text-center">
          <h2 id="curadoria-title" className="font-display text-[clamp(44px,5.7vw,82px)] leading-[0.8]">
            <SplitText text={content.titleDim} progress={progress} range={[0.06, 0.14]} reduced={reduced} className="text-ink/60" />
            <br />
            <SplitText text={content.titleLit} progress={progress} range={[0.1, 0.18]} reduced={reduced} className="text-ink/80" />
          </h2>
          <p className="max-w-[475px] text-base font-light leading-[1.2] text-charcoal/80">{content.subtitle}</p>
          <Pill href={content.cta.href}>{content.cta.label}</Pill>
        </div>

        <motion.div style={{ opacity: reduced ? 1 : principlesOpacity }} className="flex items-end justify-between gap-8">
          <div className="max-w-[654px]">
            <div aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span aria-hidden="true" className="block font-display text-[clamp(72px,9vw,134px)] leading-[0.7] text-charcoal/30">
                    {principle.number}
                  </span>
                  <h3 className="-mt-4 font-display text-[clamp(28px,2.6vw,36px)] leading-none text-charcoal">{principle.title}</h3>
                  <p className="mt-8 text-[clamp(16px,1.5vw,22px)] font-light leading-snug text-charcoal/70">{principle.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-10 flex gap-2">
              <ArrowButton dir="prev" label="Princípio anterior" onClick={() => go(active - 1)} />
              <ArrowButton dir="next" label="Próximo princípio" onClick={() => go(active + 1)} />
            </div>
          </div>
          <ol className="hidden flex-col gap-2.5 text-right font-display text-[40px] leading-none md:flex">
            {content.principles.map((p, i) => (
              <li key={p.number} aria-current={i === active ? "step" : undefined} className={cn("transition-colors duration-300", i === active ? "text-charcoal" : "text-charcoal/30")}>
                {p.number}
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </motion.div>
  );
}
```

In `app/page.tsx`, add `<Curadoria content={site.curadoria} />` after `<Salas … />`.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run components/scenes/curadoria`
Expected: PASS (2 tests).

- [ ] **Step 6: Visual check**

```bash
for p in 0.05 0.2 0.4 0.65 0.9; do npm run shot -- curadoria $p 1440; done
npm run shot -- curadoria 0.65 375
```

Expected: at 0.05, the parchment is opening from the center line. At 0.2, the title is complete. At 0.4 / 0.65 / 0.9, principles 01 / 02 / 03. Compare with `get_screenshot 196:58` and `get_design_context 196:69`, and adjust sizes and spacing.

- [ ] **Step 7: Commit**

```bash
git add components app
git commit -m "feat: cena Curadoria com pergaminho e princípios" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Perguntas (themes falling into place)

**Files:**
- Create: `components/scenes/Perguntas.tsx`
- Modify: `app/page.tsx`
- Test: `components/scenes/perguntas.test.tsx`

**Interfaces:**
- Consumes: `SceneTrack`, `Pill`, `Tag`.
- Produces: `<Perguntas content: PerguntasContent />`, `PERGUNTAS_TRACK`.

- [ ] **Step 1: Write the failing test**

`components/scenes/perguntas.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Perguntas } from "./Perguntas";

describe("Perguntas", () => {
  it("title, 10 themes and CTA", () => {
    render(<Perguntas content={site.perguntas} />);
    expect(screen.getByRole("heading", { name: site.perguntas.title })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Temas" }).querySelectorAll("li")).toHaveLength(10);
    expect(screen.getByRole("link", { name: "Entrar no acervo" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/perguntas`
Expected: FAIL.

- [ ] **Step 3: Implement**

`components/scenes/Perguntas.tsx`:
```tsx
"use client";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { PerguntasContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { Pill, Tag } from "@/components/ui/Pill";

export const PERGUNTAS_TRACK = { desktop: 150, mobile: 100 };

// Deterministic "scattered" starting position for each theme
function scatter(i: number) {
  return { x: (((i * 37) % 11) - 5) * 28, y: (((i * 53) % 7) - 3) * 36, r: (((i * 29) % 9) - 4) * 4 };
}

export function Perguntas({ content }: { content: PerguntasContent }) {
  return (
    <SceneTrack id="perguntas" labelledBy="perguntas-title" heights={PERGUNTAS_TRACK} className="bg-night">
      {(progress, reduced) => <PerguntasStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function PerguntasStage({ content, progress, reduced }: { content: PerguntasContent; progress: MotionValue<number>; reduced: boolean }) {
  const imageY = useTransform(progress, [0, 1], ["-6%", "6%"]);
  return (
    <div className="relative flex h-full min-h-svh w-full items-center overflow-hidden bg-night">
      <motion.div aria-hidden="true" className="absolute inset-y-0 right-0 w-full md:w-[81%]" style={{ y: reduced ? 0 : imageY }}>
        <Image src={content.image} alt="" fill sizes="(max-width: 767px) 100vw, 81vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/60 to-transparent" />
      </motion.div>
      <div className="container-page relative py-24">
        <div className="max-w-[863px]">
          <h2 id="perguntas-title" className="font-display text-[clamp(40px,4.4vw,64px)] leading-[1.05] text-cream">{content.title}</h2>
          <p className="mt-8 max-w-[700px] text-[clamp(16px,1.4vw,20px)] font-light leading-snug text-cream/60">{content.text}</p>
          <ul aria-label="Temas" className="mt-8 flex max-w-[640px] flex-wrap gap-3">
            {content.themes.map((theme, i) => (
              <ScatterTag key={theme} label={theme} index={i} progress={progress} reduced={reduced} />
            ))}
          </ul>
          <div className="mt-8">
            <Pill href={content.cta.href}>{content.cta.label}</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScatterTag({ label, index, progress, reduced }: { label: string; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const s = scatter(index);
  const from = 0.05 + index * 0.02;
  const to = 0.45 + index * 0.02;
  const x = useTransform(progress, [from, to], [s.x, 0]);
  const y = useTransform(progress, [from, to], [s.y, 0]);
  const rotate = useTransform(progress, [from, to], [s.r, 0]);
  const opacity = useTransform(progress, [from, to], [0.2, 1]);
  const filter = useTransform(progress, [from, to], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.li style={reduced ? undefined : { x, y, rotate, opacity, filter }}>
      <Tag>{label}</Tag>
    </motion.li>
  );
}
```

In `app/page.tsx`, add `<Perguntas content={site.perguntas} />` after `<Curadoria … />`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run components/scenes/perguntas`
Expected: PASS.

- [ ] **Step 5: Visual check**

```bash
for p in 0 0.3 0.7; do npm run shot -- perguntas $p 1440; done
npm run shot -- perguntas 0.7 375
```

Compare with `get_screenshot 196:88`. Check the pill style of the themes against `get_design_context 196:94`: adjust `Tag` (border, background, padding, font size) to match exactly.

- [ ] **Step 6: Commit**

```bash
git add components app
git commit -m "feat: cena Perguntas com temas se organizando" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Trilhas (drawn staircase)

**Files:**
- Create: `components/ui/StepCard.tsx`, `components/scenes/Trilhas.tsx`
- Modify: `app/page.tsx`
- Test: `components/scenes/trilhas.test.tsx`

**Interfaces:**
- Consumes: `SceneTrack`, `TwoToneTitle`.
- Produces: `<StepCard step: Step />`, `<Trilhas content: TrilhasContent />`, `TRILHAS_TRACK`, `STAIR_PATH`, `STEP_THRESHOLDS`.

- [ ] **Step 1: Write the failing test**

`components/scenes/trilhas.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Trilhas } from "./Trilhas";

describe("Trilhas", () => {
  it("title and 4 steps as links", () => {
    render(<Trilhas content={site.trilhas} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Trilha de conhecimento em degraus");
    for (const step of site.trilhas.steps) {
      expect(screen.getAllByRole("link", { name: new RegExp(step.title) }).length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/trilhas`
Expected: FAIL.

- [ ] **Step 3: Implement `StepCard`**

`components/ui/StepCard.tsx`:
```tsx
import Image from "next/image";
import type { Step } from "@/content/types";

export function StepCard({ step }: { step: Step }) {
  return (
    <a href={step.href} className="group block w-[233px] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
      <Image
        src={step.icon}
        alt=""
        width={88}
        height={96}
        className="mx-auto h-24 w-auto transition-transform duration-300 ease-out group-hover:-translate-y-1"
      />
      <span className="mt-4 block font-display text-2xl leading-[1.3] text-cream">{step.title}</span>
      <span className="mt-2 block text-sm font-light text-white/60">{step.meta}</span>
    </a>
  );
}
```

- [ ] **Step 4: Implement `Trilhas`**

`components/scenes/Trilhas.tsx`:
```tsx
"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { Step, TrilhasContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { TwoToneTitle } from "@/components/motion/TwoToneTitle";
import { StepCard } from "@/components/ui/StepCard";

export const TRILHAS_TRACK = { desktop: 250, mobile: 160 };
// Coordinates of the "Degaraus" frame (196:157), 1157 × 714
const STEP_POS = [
  { x: 0, y: 0 },
  { x: 288, y: 169 },
  { x: 577, y: 339 },
  { x: 865, y: 510 },
];
export const STAIR_PATH = "M3 32 V203 H291 V372 H580 V542 H868 V714 H1157";
export const STEP_THRESHOLDS = [0.12, 0.34, 0.56, 0.78];

export function Trilhas({ content }: { content: TrilhasContent }) {
  return (
    <SceneTrack id="trilhas" labelledBy="trilhas-title" heights={TRILHAS_TRACK} className="bg-[#161515]">
      {(progress, reduced) => <TrilhasStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function TrilhasStage({ content, progress, reduced }: { content: TrilhasContent; progress: MotionValue<number>; reduced: boolean }) {
  const pathLength = useTransform(progress, [0.08, 0.9], [0, 1]);
  const lineScale = useTransform(progress, [0.08, 0.9], [0, 1]);
  return (
    <div
      className="relative h-full min-h-svh w-full overflow-hidden bg-[#161515] bg-[url('/images/textures/stone-row.webp')] bg-[length:1513px_253px] bg-repeat"
    >
      <div className="container-page relative flex min-h-svh flex-col justify-center gap-16 py-20">
        <TwoToneTitle
          id="trilhas-title"
          dim={content.titleDim}
          lit={content.titleLit}
          progress={progress}
          range={[0, 0.12]}
          className="max-w-[545px] text-[clamp(44px,5.7vw,82px)] leading-[0.82]"
          dimClassName="text-white/60"
          litClassName="text-cream"
        />

        {/* Desktop: diagonal staircase */}
        <div className="relative hidden h-[714px] w-[1157px] xl:block">
          <svg aria-hidden="true" viewBox="0 0 1157 714" fill="none" className="absolute inset-0 h-full w-full">
            <motion.path d={STAIR_PATH} stroke="rgba(246,231,206,0.25)" strokeWidth={1} style={{ pathLength: reduced ? 1 : pathLength }} />
          </svg>
          <ol>
            {content.steps.map((step, i) => (
              <StepItem key={step.numeral} step={step} index={i} progress={progress} reduced={reduced} className="absolute" style={{ left: STEP_POS[i].x, top: STEP_POS[i].y }} />
            ))}
          </ol>
        </div>

        {/* Mobile/tablet: vertical list */}
        <div className="relative xl:hidden">
          <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-cream/10" />
          <motion.div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px origin-top bg-cream/40" style={{ scaleY: reduced ? 1 : lineScale }} />
          <ol className="flex flex-col gap-12 pl-8">
            {content.steps.map((step, i) => (
              <StepItem key={step.numeral} step={step} index={i} progress={progress} reduced={reduced} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function StepItem({ step, index, progress, reduced, className, style }: {
  step: Step; index: number; progress: MotionValue<number>; reduced: boolean; className?: string; style?: React.CSSProperties;
}) {
  const t = STEP_THRESHOLDS[index];
  const opacity = useTransform(progress, [t, t + 0.08], [0.15, 1]);
  const y = useTransform(progress, [t, t + 0.08], [24, 0]);
  return (
    <li className={className} style={style}>
      <span className="block font-display text-sm text-cream/60">{step.numeral}</span>
      <motion.div className="ml-6 mt-1" style={reduced ? undefined : { opacity, y }}>
        <StepCard step={step} />
      </motion.div>
    </li>
  );
}
```

In `app/page.tsx`, add `<Trilhas content={site.trilhas} />` after `<Perguntas … />`.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run components/scenes/trilhas`
Expected: PASS.

- [ ] **Step 6: Visual check**

```bash
for p in 0.1 0.4 0.95; do npm run shot -- trilhas $p 1440; done
npm run shot -- trilhas 0.6 375
```

Compare `shots/trilhas-0.95-1440.png` with `get_screenshot 196:119`: the line forms the staircase and the steps line up at the corners. If the line and the cards are misaligned, adjust `STEP_POS`/`STAIR_PATH` against `get_design_context 196:157`.

- [ ] **Step 7: Commit**

```bash
git add components app
git commit -m "feat: cena Trilhas com escada desenhada no scroll" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Artigos (columns at different speeds)

**Files:**
- Create: `components/ui/ArticleCard.tsx`, `components/scenes/Artigos.tsx`
- Modify: `app/page.tsx`
- Test: `components/scenes/artigos.test.tsx`

**Interfaces:**
- Consumes: `TwoToneTitle`, `ParallaxLayer`, `MuseumFrame`.
- Produces: `<ArticleCard article: Article aspect: string />`, `<Artigos content: ArtigosContent />`.

- [ ] **Step 1: Write the failing test**

`components/scenes/artigos.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Artigos } from "./Artigos";

describe("Artigos", () => {
  it("title, 3 articles with h3 and a placeholder when there is no image", () => {
    render(<Artigos content={site.artigos} />);
    expect(document.getElementById("artigos")).toHaveAttribute("aria-labelledby", "artigos-title");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getAllByTestId("article-placeholder")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/artigos`
Expected: FAIL.

- [ ] **Step 3: Implement**

`components/ui/ArticleCard.tsx`:
```tsx
import Image from "next/image";
import type { Article } from "@/content/types";

export function ArticleCard({ article, aspect }: { article: Article; aspect: string }) {
  return (
    <a href={article.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
        {article.image ? (
          <Image src={article.image} alt="" fill sizes="(max-width: 767px) 100vw, 360px" className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.04]" />
        ) : (
          <div data-testid="article-placeholder" className="grain absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#4a1c22_0%,#1a0709_80%)]" />
        )}
      </div>
      <div className="mt-8 flex max-w-[350px] flex-col gap-3">
        <p className="text-xs font-light uppercase leading-[1.2] text-white/60">{article.kicker}</p>
        <h3 className="font-display text-2xl font-medium leading-[1.05] text-white/80">{article.title}</h3>
        <p className="text-base font-light leading-[1.2] text-white/60">{article.author}</p>
      </div>
    </a>
  );
}
```

`components/scenes/Artigos.tsx`:
```tsx
import Image from "next/image";
import type { ArtigosContent } from "@/content/types";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { TwoToneTitle } from "@/components/motion/TwoToneTitle";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { MuseumFrame } from "@/components/ui/MuseumFrame";

// Figma: heights 360 / 492 / 434 on a 360 width; vertical offsets 54 / 0 / 137
const LAYOUT = [
  { aspect: "360 / 360", offset: "md:mt-[54px]", speed: 40 },
  { aspect: "360 / 492", offset: "", speed: 90 },
  { aspect: "360 / 434", offset: "md:mt-[137px]", speed: 60 },
];

export function Artigos({ content }: { content: ArtigosContent }) {
  return (
    <section id="artigos" aria-labelledby="artigos-title" className="relative overflow-hidden bg-wine-deep py-[clamp(96px,10vw,140px)]">
      <Image src="/images/textures/velvet.webp" alt="" fill sizes="100vw" className="object-cover" />
      <MuseumFrame tone="cream" />
      <div className="container-page relative">
        <div className="mx-auto max-w-[888px] text-center">
          <TwoToneTitle
            id="artigos-title"
            dim={content.titleDim}
            lit={content.titleLit}
            className="text-[clamp(40px,4.4vw,64px)] leading-none"
            dimClassName="text-white/60"
            litClassName="text-cream"
          />
          <p className="mx-auto mt-10 max-w-[475px] text-base font-light leading-[1.2] text-white/70">{content.subtitle}</p>
        </div>
        <ul className="mt-16 grid gap-16 md:mt-24 md:grid-cols-3 md:gap-[52px]">
          {content.articles.map((article, i) => (
            <li key={article.id} className={LAYOUT[i].offset}>
              <ParallaxLayer speed={LAYOUT[i].speed}>
                <ArticleCard article={article} aspect={LAYOUT[i].aspect} />
              </ParallaxLayer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

In `app/page.tsx`, add `<Artigos content={site.artigos} />` after `<Trilhas … />`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run components/scenes/artigos`
Expected: PASS.

- [ ] **Step 5: Visual check**

```bash
npm run shot -- artigos 0 1440 && npm run shot -- artigos 0 375
```

Compare with `get_screenshot 196:202`. The kicker is 12px uppercase, the title 24px Gambetta Medium, the author 16px. Hover on the card: the image zooms in smoothly.

- [ ] **Step 6: Commit**

```bash
git add components app
git commit -m "feat: seção Artigos com colunas em parallax" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Comunidade (living strips)

**Files:**
- Create: `components/motion/Marquee.tsx`, `components/scenes/Comunidade.tsx`
- Modify: `app/page.tsx`
- Test: `components/scenes/comunidade.test.tsx`

**Interfaces:**
- Consumes: `wrap` (Task 4), `Pill`, `usePrefersReducedMotion`.
- Produces: `<Marquee baseVelocity?: number /* % per second; negative = left */ className?>{children}</Marquee>` (the second copy is `aria-hidden`), `<Comunidade content: ComunidadeContent />`.

- [ ] **Step 1: Write the failing test**

`components/scenes/comunidade.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Comunidade } from "./Comunidade";

describe("Comunidade", () => {
  it("title, external links and the marquee copy hidden from screen readers", () => {
    render(<Comunidade content={site.comunidade} />);
    expect(screen.getByRole("heading", { name: "Acompanhe antes de entrar" })).toBeInTheDocument();
    const yt = screen.getByRole("link", { name: /YouTube/ });
    expect(yt).toHaveAttribute("target", "_blank");
    expect(document.querySelectorAll("[data-marquee-copy][aria-hidden='true']")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/comunidade`
Expected: FAIL.

- [ ] **Step 3: Implement `Marquee`**

`components/motion/Marquee.tsx`:
```tsx
"use client";
import type { ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { cn } from "@/lib/cn";
import { wrap } from "@/lib/motion/math";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export function Marquee({ children, baseVelocity = -2, className }: { children: ReactNode; baseVelocity?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const move = baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + move + move * Math.abs(boost.get()));
  });

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div className="flex w-max" style={{ x: reduced ? 0 : x }}>
        <div className="flex gap-3 pr-3">{children}</div>
        <div data-marquee-copy aria-hidden="true" className="flex gap-3 pr-3">{children}</div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Implement `Comunidade`**

`components/scenes/Comunidade.tsx`:
```tsx
import Image from "next/image";
import type { ComunidadeContent } from "@/content/types";
import { Marquee } from "@/components/motion/Marquee";
import { Pill } from "@/components/ui/Pill";

const ROWS = [
  { velocity: -2, offset: "ml-[1vw]" },
  { velocity: 2, offset: "-ml-[6vw]" },
  { velocity: -1.5, offset: "ml-[0.5vw]" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

export function Comunidade({ content }: { content: ComunidadeContent }) {
  const perRow = Math.ceil(content.members.length / ROWS.length);
  return (
    <section id="comunidade" aria-labelledby="comunidade-title" className="relative overflow-hidden bg-night pb-16 pt-[115px]">
      <Image src="/images/textures/comunidade.webp" alt="" fill sizes="100vw" className="object-cover" />
      <div className="container-page relative mx-auto flex max-w-[426px] flex-col items-center text-center">
        <span className="rounded-full border border-cream/25 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-cream/80">{content.badge}</span>
        <h2 id="comunidade-title" className="mt-6 font-display text-[clamp(40px,4.4vw,56px)] leading-[0.92] text-cream">{content.title}</h2>
        <p className="mt-6 max-w-[348px] text-base font-light leading-snug text-cream/60">{content.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {content.links.map((link) => (
            <Pill key={link.label} href={link.href} external={link.external}>{link.label}</Pill>
          ))}
        </div>
      </div>
      <div className="relative mt-16 flex flex-col gap-3">
        {ROWS.map((row, r) => (
          <Marquee key={r} baseVelocity={row.velocity} className={row.offset}>
            {content.members.slice(r * perRow, (r + 1) * perRow).map((name) => (
              <span key={name} className="flex w-[179px] items-center gap-2.5 rounded-full py-px pl-px">
                <span aria-hidden="true" className="grid size-[38px] place-items-center rounded-full bg-wine text-xs font-semibold text-cream">{initials(name)}</span>
                <span className="text-xs text-cream/70">{name}</span>
              </span>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
```

In `app/page.tsx`, add `<Comunidade content={site.comunidade} />` after `<Artigos … />`.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run components/scenes/comunidade`
Expected: PASS.

- [ ] **Step 6: Visual check**

`npm run shot -- comunidade 0 1440`. Compare with `get_screenshot 196:234` and adjust the badge/title against `get_design_context 196:236`. In `npm run dev`, confirm the strips move in alternating directions and speed up with fast scrolling.

- [ ] **Step 7: Commit**

```bash
git add components app
git commit -m "feat: seção Comunidade com faixas de membros" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: FAQ (accessible accordion)

**Files:**
- Create: `components/ui/Accordion.tsx`, `components/scenes/Faq.tsx`
- Modify: `app/page.tsx`
- Test: `components/ui/Accordion.test.tsx`

**Interfaces:**
- Consumes: type `FaqItem`.
- Produces: `<Accordion items: FaqItem[] defaultOpen?: number | null />` (one item open at a time), `<Faq content: FaqContent />`.

- [ ] **Step 1: Write the failing test**

`components/ui/Accordion.test.tsx`:
```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion } from "./Accordion";

const items = [
  { question: "Pergunta A", answer: "Resposta A" },
  { question: "Pergunta B", answer: "Resposta B" },
];

describe("Accordion", () => {
  it("opens the first one by default with the correct ARIA", () => {
    render(<Accordion items={items} />);
    const a = screen.getByRole("button", { name: "Pergunta A" });
    expect(a).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: "Pergunta A" });
    expect(a).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveTextContent("Resposta A");
  });

  it("opening another closes the previous one", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Pergunta B" }));
    expect(screen.getByRole("button", { name: "Pergunta B" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(screen.queryByText("Resposta A")).not.toBeInTheDocument());
  });

  it("works from the keyboard (Enter)", async () => {
    render(<Accordion items={items} defaultOpen={null} />);
    screen.getByRole("button", { name: "Pergunta B" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Resposta B")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/ui/Accordion`
Expected: FAIL.

- [ ] **Step 3: Implement**

`components/ui/Accordion.tsx`:
```tsx
"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";

export function Accordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  return (
    <ul className="flex flex-col gap-8">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-b${i}`;
        const panelId = `${baseId}-p${i}`;
        return (
          <li key={item.question} className="rounded-[20px] bg-white/[0.04] ring-1 ring-cream/10 backdrop-blur-sm">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 rounded-[20px] px-6 py-6 text-left md:px-[42px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <span className="font-display text-xl leading-tight text-cream md:text-2xl">{item.question}</span>
                <Image
                  src="/images/icons/faq-toggle.svg"
                  alt=""
                  width={48}
                  height={48}
                  className={cn("shrink-0 transition-transform duration-300 ease-cinema", isOpen && "rotate-45")}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[945px] px-6 pb-6 text-base font-light leading-snug text-cream/60 md:px-[42px]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
```

`components/scenes/Faq.tsx`:
```tsx
import type { FaqContent } from "@/content/types";
import { Accordion } from "@/components/ui/Accordion";

export function Faq({ content }: { content: FaqContent }) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative bg-[#161515] bg-[url('/images/textures/stone-row.webp')] bg-[length:1513px_253px] bg-repeat py-16"
    >
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 id="faq-title" className="max-w-[409px] font-display text-[clamp(36px,3.4vw,48px)] leading-none text-cream">{content.title}</h2>
          <p className="max-w-[421px] text-base font-light leading-snug text-cream/60">{content.text}</p>
        </div>
        <div className="mt-[60px]">
          <Accordion items={content.items} />
        </div>
      </div>
    </section>
  );
}
```

In `app/page.tsx`, add `<Faq content={site.faq} />` after `<Comunidade … />`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run components/ui/Accordion`
Expected: PASS (3 tests).

- [ ] **Step 5: Visual check**

`npm run shot -- faq 0 1440`. Compare with `get_screenshot 196:321` and adjust the item's background, radius and padding against `get_design_context 196:355` / `196:361`.

- [ ] **Step 6: Commit**

```bash
git add components app
git commit -m "feat: FAQ com acordeão acessível" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Footer (curtain + rising wordmark)

**Files:**
- Create: `components/scenes/FooterCurtain.tsx`
- Modify: `app/page.tsx`
- Test: `components/scenes/footer.test.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion`, `cn`, type `FooterContent`.
- Produces: `<FooterCurtain content: FooterContent />`.

- [ ] **Step 1: Write the failing test**

`components/scenes/footer.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { FooterCurtain } from "./FooterCurtain";

describe("FooterCurtain", () => {
  it("footer with columns, credit and a readable wordmark", () => {
    render(<FooterCurtain content={site.footer} />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("2026 © A Sala dos Buscadores");
    expect(screen.getByRole("navigation", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByText("A SALA DOS BUSCADORES", { selector: ".sr-only" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx vitest run components/scenes/footer`
Expected: FAIL.

- [ ] **Step 3: Implement**

`components/scenes/FooterCurtain.tsx`:
```tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { FooterContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const HEIGHT = "h-[900px] md:h-[753px]";

export function FooterCurtain({ content }: { content: FooterContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  if (reduced) {
    return <FooterBody content={content} progress={scrollYProgress} reduced />;
  }
  return (
    <div ref={ref} className={cn("relative", HEIGHT)} style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className={cn("fixed bottom-0 left-0 w-full", HEIGHT)}>
        <FooterBody content={content} progress={scrollYProgress} reduced={false} />
      </div>
    </div>
  );
}

function FooterBody({ content, progress, reduced }: { content: FooterContent; progress: MotionValue<number>; reduced: boolean }) {
  return (
    <footer className={cn("flex flex-col justify-between bg-night py-16", HEIGHT)}>
      <div className="container-page flex flex-col gap-12 md:flex-row md:justify-between">
        <div className="max-w-[291px]">
          <Image src="/images/brand/logo.svg" alt="A Sala dos Buscadores" width={191} height={58} className="h-auto w-[191px]" />
          <p className="mt-8 text-base font-light leading-snug text-cream/60">{content.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-20">
          {content.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-base font-medium text-cream">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-base font-light text-cream/60 transition-colors duration-200 hover:text-cream"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="container-page">
        <p className="sr-only">{content.wordmark.join(" ")}</p>
        <div aria-hidden="true" className="font-display uppercase leading-[0.85] text-cream">
          {content.wordmark.map((line, li) => (
            <WordmarkLine key={line} text={line} progress={progress} lineIndex={li} reduced={reduced} />
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 text-sm font-light text-cream/60 md:flex-row md:justify-between">
          <span>{content.copyright}</span>
          <span>{content.credit}</span>
        </div>
      </div>
    </footer>
  );
}

function WordmarkLine({ text, progress, lineIndex, reduced }: { text: string; progress: MotionValue<number>; lineIndex: number; reduced: boolean }) {
  const letters = Array.from(text);
  return (
    <div className="flex justify-between overflow-hidden text-[clamp(44px,12.4vw,178px)]">
      {letters.map((ch, i) => (
        <Letter key={`${ch}-${i}`} ch={ch} progress={progress} start={0.35 + lineIndex * 0.12 + i * 0.025} reduced={reduced} />
      ))}
    </div>
  );
}

function Letter({ ch, progress, start, reduced }: { ch: string; progress: MotionValue<number>; start: number; reduced: boolean }) {
  const y = useTransform(progress, [start, start + 0.25], ["100%", "0%"]);
  return (
    <motion.span className="inline-block" style={reduced ? undefined : { y }}>
      {ch === " " ? " " : ch}
    </motion.span>
  );
}
```

`app/page.tsx` (final version):
```tsx
import { site } from "@/content/site";
import { Nav } from "@/components/scenes/Nav";
import { HeroDoor } from "@/components/scenes/HeroDoor";
import { Salas } from "@/components/scenes/Salas";
import { Curadoria } from "@/components/scenes/Curadoria";
import { Perguntas } from "@/components/scenes/Perguntas";
import { Trilhas } from "@/components/scenes/Trilhas";
import { Artigos } from "@/components/scenes/Artigos";
import { Comunidade } from "@/components/scenes/Comunidade";
import { Faq } from "@/components/scenes/Faq";
import { FooterCurtain } from "@/components/scenes/FooterCurtain";

export default function Home() {
  return (
    <>
      <Nav nav={site.nav} />
      <main className="relative z-10">
        <HeroDoor content={site.hero} />
        <Salas content={site.salas} />
        <Curadoria content={site.curadoria} />
        <Perguntas content={site.perguntas} />
        <Trilhas content={site.trilhas} />
        <Artigos content={site.artigos} />
        <Comunidade content={site.comunidade} />
        <Faq content={site.faq} />
      </main>
      <FooterCurtain content={site.footer} />
    </>
  );
}
```

- [ ] **Step 4: Run all the tests**

Run: `npm test`
Expected: PASS (whole suite).

- [ ] **Step 5: Visual check**

Scroll to the end in `npm run dev`. The FAQ rises and reveals the fixed footer underneath, and the letters rise one by one. Compare with `get_screenshot 196:380` and adjust the wordmark (font, size, tracking) against `get_design_context 196:404`.

- [ ] **Step 6: Commit**

```bash
git add components app
git commit -m "feat: footer em cortina com wordmark animado" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: E2E, performance, accessibility and design review

**Files:**
- Create: `e2e/landing.spec.ts`
- Modify: whatever the audits point out

- [ ] **Step 1: Write the E2E**

`e2e/landing.spec.ts`:
```ts
import { expect, test } from "@playwright/test";

const IDS = ["inicio", "salas", "curadoria", "perguntas", "trilhas", "artigos", "comunidade", "faq"];

test("the whole page renders with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/A porta\s*está aberta/);
  for (const id of IDS) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await expect(page.getByRole("contentinfo")).toContainText("A Sala dos Buscadores");
  expect(errors).toEqual([]);
});

test("no horizontal scroll", async ({ page }) => {
  await page.goto("/");
  for (let y = 0; y < 30; y++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(60);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  }
});

test("reduced motion: scenes are not pinned", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced");
  await page.goto("/");
  for (const id of ["inicio", "salas", "curadoria", "perguntas", "trilhas"]) {
    await expect(page.locator(`#${id}`)).toHaveAttribute("data-reduced", "true");
  }
  await expect(page.getByTestId("frame-sequence")).toHaveCount(0);
});
```

- [ ] **Step 2: Run the E2E**

Run: `npm run e2e`
Expected: PASS in the 3 projects (desktop, mobile, reduced). Fix any failure before moving on.

- [ ] **Step 3: Lighthouse (mobile)**

```bash
npm run build && (npm run start &) && sleep 5
npx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility,seo --output=json --output-path=/tmp/lh.json --chrome-flags="--headless"
node -e "const r=require('/tmp/lh.json');for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100));console.log('LCP',r.audits['largest-contentful-paint'].displayValue,'CLS',r.audits['cumulative-layout-shift'].displayValue)"
```

Expected: performance ≥ 85, accessibility ≥ 95, seo ≥ 95, LCP ≤ 2.5 s, CLS ≤ 0.05. If performance is low: confirm that `door-still.webp` has `priority`, that the textures are ≤ 300 KB (`cwebp -q 70` if needed) and that frames only start loading after the first paint.

- [ ] **Step 4: Design and motion review**

Invoke the skill `ui-ux-pro-max` (checklist: contrast AA, focus visible on every control, tap targets ≥ 44px on mobile, heading hierarchy) and the skill `emil-design-eng` (easing and duration of each transition, no layout animation, hover/active consistent across Pill, ArrowButton and cards). Apply the fixes they point out, run `npm test && npm run e2e` again and generate shots at 1440/768/375 for each scene to compare with Figma.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: E2E e ajustes de performance/acessibilidade" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: Real Hero video via Magnific

**Files:**
- Modify: `public/frames/hero/**`, `content/hero-frames.json`

**Prerequisite:** the user's approval of the cost. **Do not generate without it.**

- [ ] **Step 1: Estimate the cost.** Load `mcp__claude_ai_Magnific__video_models_list` and `mcp__claude_ai_Magnific__simulate_cost` via ToolSearch. Pick an image-to-video model that supports a 5 s duration and a 16:9 ratio, and simulate the cost. Show the cost to the user and wait for an explicit "yes".

- [ ] **Step 2: Upload the first frame.** Use `mcp__claude_ai_Magnific__creations_upload_image` with `public/images/hero/door-still.png`.

- [ ] **Step 3: Generate the video.** `mcp__claude_ai_Magnific__video_generate`, with the uploaded creation as the initial keyframe, 5 s, 16:9, prompt:

> Slow, steady cinematic dolly forward through an ancient brick archway with an ornate carved frame. The camera moves straight toward the open doorway and passes through it into a vast starry night sky with soft golden haze and distant clouds. No people, no text. Smooth constant speed, no shake, no cuts, photorealistic, warm dim light, deep burgundy bricks.

Follow the tool's `instruction`, call `creations_show` and `creations_wait`, and get the final URL.

- [ ] **Step 4: Show it to the user and get approval of the result.** If they want an adjustment, generate again only with a new approval.

- [ ] **Step 5: Extract the frames**

```bash
curl -L -o /tmp/hero-magnific.mp4 "<final URL returned by creations_wait>"
scripts/extract-frames.sh /tmp/hero-magnific.mp4
npm run check:assets
```

Expected: `content/hero-frames.json` updated. Sizes within the limits (≤ 6 MB / ≤ 2.5 MB). Then check `npm run shot -- inicio 0` / `0.5` / `1`: frame 0 matches the still image (no "jump" when the canvas replaces the `<img>`), and the last frame blends into the Salas sky.

- [ ] **Step 6: Commit**

```bash
git add public/frames content/hero-frames.json
git commit -m "feat: frames reais do Hero gerados via Magnific" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: Deploy to Vercel

**Prerequisite:** the user's approval to publish (this is an outward-facing action).

- [ ] **Step 1: Final check.** `npm run lint && npm test && npm run build && npm run e2e`. Everything passes.

- [ ] **Step 2: Log in.** The user runs in the terminal: `npx vercel login` (interactive login in the browser).

- [ ] **Step 3: Publish**

```bash
npx vercel --yes          # preview
npx vercel --prod --yes   # production, only after the user approves the preview
```

Expected: a `https://<project>.vercel.app` URL. Open it on desktop and mobile, and repeat Lighthouse against the production URL.

- [ ] **Step 4: Record the URL** in the spec (`docs/superpowers/specs/…`, section 11) and commit.

```bash
git add docs
git commit -m "docs: URL de produção" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
