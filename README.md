# A Sala dos Buscadores — landing page

Landing page da **A Sala dos Buscadores**, um portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis. Construída com Next.js 16, Tailwind CSS 4, Motion e Lenis: cenas fixadas ("pinned") conduzidas pela rolagem, com fallback completo para `prefers-reduced-motion`.

## Rodando localmente

```bash
npm install
npm run dev   # http://localhost:3111
```

O projeto usa a **porta 3111** (dev, `npm start`, Playwright e o script de screenshots). A porta 3000 desta máquina pertence a outro projeto — não use nem encerre o que roda nela.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm test` | Testes unitários e de componentes (Vitest + Testing Library) |
| `npm run e2e` | Testes ponta a ponta (Playwright; gera o build de produção e sobe em 3111) |
| `npm run shot -- <id> <progresso> <largura> [altura]` | Captura `shots/<id>-<progresso>-<largura>.png` com a cena `#id` no progresso 0–1 (requer o dev server; `REDUCED=1` simula movimento reduzido) |
| `npm run check:assets` | Confere se todas as imagens do site existem |
| `npm run lint` / `npx tsc --noEmit` | Lint e checagem de tipos |

## Onde fica cada coisa

- **Textos e links:** `content/site.ts` (tipos em `content/types.ts`). Nenhum texto fica fixo no JSX.
- **Cenas:** `components/scenes/` — cada seção da página; as fixadas usam `components/motion/SceneTrack.tsx`.
- **Movimento:** `components/motion/` e `lib/motion/math.ts` (use `holdRange` em faixas de rolagem).
- **Imagens:** `public/images/**`. O Hero é feito de duas camadas do Figma: o céu (`public/images/salas/space.webp` + vídeo `public/assets/hero/cosmos.*`, compartilhado com as Salas) e a parede com o arco vazado (`public/images/hero/arch.webp`), que recebe o zoom. As texturas (`public/images/textures/`) já estão giradas para paisagem; `velvet.webp` foi ampliada (lanczos) a partir do original de 375×500 do Figma.
- **Tokens visuais:** `app/globals.css`.

Em produção, defina `NEXT_PUBLIC_SITE_URL` (ou publique na Vercel) para que as URLs de Open Graph apontem para o domínio real.
