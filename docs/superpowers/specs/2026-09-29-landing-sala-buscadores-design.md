# Landing page — A Sala dos Buscadores

**Data:** 2026-09-29
**Status:** aguardando revisão
**Fonte de design:** Figma `OXY_AGENTES` (fileKey `Kw7UmIWAfqAb3UkvGIELrJ`), página `Page 24`, frame `196:24` "Lading Page - A Sala dos Buscadores" (1440 × 7455).

## 1. Objetivo

Publicar a landing page de A Sala dos Buscadores, portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis, com neutralidade doutrinária e a fonte sempre à vista.

A entrega é uma página única, responsiva, fiel ao Figma e publicada na Vercel. A experiência é cinematográfica: as seções são cenas conduzidas pelo scroll, no estilo de jeskojets.com.

**Critérios de sucesso**
- A página visualmente corresponde ao Figma no desktop (1440px) e se adapta a tablet e celular sem rolagem horizontal.
- A cena do Hero atravessa a porta de forma contínua, sem travar, em um notebook comum e em um celular intermediário.
- Com `prefers-reduced-motion`, a página é estática, legível e completa.
- A página está publicada numa URL da Vercel.

**Fora de escopo nesta entrega:** acervo, páginas internas das Salas e Trilhas, login, CMS e busca. Os botões "Entrar no acervo" apontam para um link configurável em `content/site.ts`, que por padrão é `#`.

## 2. Stack

- **Next.js** (App Router) com TypeScript.
- **Tailwind CSS**, com os tokens de design em variáveis CSS.
- **Motion** (`motion/react`) para animações, `useScroll` e `useTransform`.
- **Lenis** para a rolagem suave.
- `next/font` para as fontes e `next/image` para as imagens estáticas.
- Deploy na **Vercel**.

A página é renderizada no servidor como estática. Só os componentes de cena e de animação são componentes de cliente (`"use client"`).

## 3. Arquitetura

```
app/
  layout.tsx            fontes, metadados/SEO/Open Graph, <SmoothScroll>
  page.tsx              compõe as cenas em ordem
  globals.css           tokens (variáveis CSS) + base
components/
  motion/
    SmoothScroll.tsx    provider do Lenis; desligado com reduced-motion
    SceneTrack.tsx      trilho (altura em vh) + palco sticky; expõe o progresso 0→1
    FrameSequence.tsx   canvas que desenha o frame N conforme o progresso
    SplitText.tsx       divide o texto em palavras/letras para revelar
    ParallaxLayer.tsx   deslocamento/escala por progresso
    Marquee.tsx         faixa infinita com velocidade ligada ao scroll
  scenes/
    HeroDoor.tsx  Sala.tsx  Curadoria.tsx  Perguntas.tsx  Trilhas.tsx
    Artigos.tsx   Comunidade.tsx  Faq.tsx  Footer.tsx
  ui/
    Nav.tsx  Pill.tsx  MuseumFrame.tsx  ArticleCard.tsx  StepCard.tsx  Accordion.tsx
content/
  site.ts               todos os textos e links, tipados
public/
  images/               imagens exportadas do Figma
  frames/hero/desktop/  frames WebP da porta (~120)
  frames/hero/mobile/   frames WebP menores (~80)
```

**Regras**
- Nenhum texto fica fixo no JSX. Cada cena recebe o próprio conteúdo de `content/site.ts`.
- As cenas combinam as peças de `motion/`. A lógica de progresso fica em `SceneTrack`, e as cenas só mapeiam o progresso para propriedades visuais.
- A duração de cada cena (em vh, com variantes para desktop e mobile) fica declarada num lugar só, no topo de cada cena.
- Cada unidade tem uma responsabilidade: `FrameSequence` não sabe nada da porta, só desenha frames a partir de uma lista de URLs e de um progresso.

## 4. Sistema visual

A página alterna ambientes, como as salas de um museu. Cada cena "acende" o próprio ambiente.

| Token | Uso | Valor inicial |
|---|---|---|
| `--night` | Hero, Sala | `#120C0C` |
| `--wine-deep` | fundo dos Artigos | `#2B0E12` |
| `--wine` | ícones das Trilhas, acentos | `#7A2430` |
| `--stone` | fundo das Trilhas | `#161515` |
| `--parchment` | fundo da Curadoria | `#E8D8B6` |
| `--ink` | títulos sobre pergaminho | `#5A2A2E` |
| `--cream` | títulos sobre fundo escuro | `#F2E6D2` |
| `--mist` | secundário, parte apagada dos títulos | `--cream` a 55% |

Os valores exatos são extraídos do Figma (`get_design_context`) na implementação e substituem os iniciais.

**Tipografia**
- Títulos: a serifa editorial do Figma. O nome exato é confirmado via `get_design_context`. Tamanho fluido com `clamp()`, de ~40px a ~96px.
- Texto e interface: sans do Figma (provavelmente Inter). Metadados em caixa alta com espaçamento entre letras.
- Títulos em dois tons: a primeira parte em `--mist` e a segunda acesa. Na animação, a parte acesa "liga".

**Grid:** container de 1184px (1440 − 2 × 128). No mobile, margens de 16–24px.

**Componentes recorrentes:** Pill (botão ou tag branca arredondada), MuseumFrame (linhas laterais finas com ornamentos no topo), texturas (tijolo, pergaminho, veludo) com grão leve.

## 5. Roteiro das cenas

"Presa" quer dizer que a cena usa `SceneTrack`: o palco fica fixo e o progresso comanda a cena.

| # | Cena | Tipo | Desktop / Mobile | Roteiro |
|---|---|---|---|---|
| 1 | Hero: atravessar a porta | presa | 400vh / 240vh | `FrameSequence` avança a câmera pelo arco. "A porta está aberta" sai pela esquerda e "A escada é de quem sobe" pela direita, com desfoque. O Nav recolhe para uma barra compacta. O último frame é o céu estrelado, que é o fundo da cena 2. |
| 2 | A Sala: salão no espaço | presa | 250vh / 150vh | Os cards das Salas vêm do fundo em profundidades diferentes. "A sala do primeiro ciclo" acende no centro. Preparado para 5 cards. No mobile, os cards ficam empilhados com revelação simples. |
| 3 | Curadoria: o museu se acende | presa | 300vh / 180vh | O pergaminho abre a partir de uma linha central (clip-path). O título entra palavra por palavra. Os princípios 01 → 02 → 03 trocam conforme o progresso, com a numeração ativa à direita. As setas levam ao princípio correspondente (rolando até ele). |
| 4 | Perguntas | presa curta | 150vh / 100vh | As pílulas começam espalhadas e desfocadas e se encaixam nas fileiras. A imagem lateral faz parallax lento. |
| 5 | Trilhas: subir a escada | presa | 250vh / 160vh | A linha em degraus é desenhada (SVG `pathLength`). Cada degrau I–IV acende quando a linha chega nele (o ícone sobe e o título aparece). |
| 6 | Artigos | livre | — | O título em dois tons acende. Os 3 cards sobem em velocidades diferentes. No hover, a foto aproxima levemente. |
| 7 | Comunidade | livre | — | 3 faixas de avatares em direções alternadas. A velocidade aumenta com a velocidade do scroll. |
| 8 | FAQ | livre | — | Acordeão com animação de altura. O ícone "+" gira para "×". Acessível por teclado. |
| 9 | Footer: cortina | fixo por baixo | — | A última seção sobe e revela o footer. "A SALA DOS BUSCADORES" sobe letra por letra. |

**Reduced motion:** `SceneTrack` não prende (altura = conteúdo), o Lenis fica desligado, `FrameSequence` mostra um frame fixo (o arco) e as revelações viram fades curtos de opacidade.

## 6. Hero: sequência de frames

- **Origem:** um vídeo de 4–6 s gerado via Magnific. O primeiro frame é a imagem do arco do Figma, e a câmera avança e atravessa a porta até o céu estrelado. O custo é mostrado e aprovado antes de gerar.
- **Processamento** (script em `scripts/extract-frames`, com ffmpeg):
  - desktop: ~120 frames WebP, 1920px de largura, qualidade ~70;
  - mobile: ~80 frames WebP, 900px de largura.
  - Meta: ≤ 6 MB no desktop e ≤ 2,5 MB no mobile.
- **Carregamento:** o frame 0 vem como `<img>` com prioridade (LCP) e é desenhado na hora. O restante carrega em segundo plano, em ordem de 8 em 8 e depois preenchendo os intervalos, para o scroll ter frames aproximados desde cedo. Se um frame não carregou, desenha o frame carregado mais próximo.
- **Canvas:** redimensiona com `devicePixelRatio` (limitado a 2), com `object-fit: cover` calculado manualmente. Redesenha só quando o índice muda.
- **Até o vídeo existir:** frames provisórios são gerados a partir da imagem do Figma, com um zoom sintético feito por ffmpeg. O código não muda quando o vídeo real chegar.

## 7. Conteúdo

Todos os textos ficam em `content/site.ts`. Os que ainda são placeholder no Figma recebem rascunhos escritos por mim, coerentes com a proposta, para o usuário revisar:

- FAQ: 4 perguntas reais sobre o portal (o que é, se há viés religioso, de onde vêm as fontes, se é gratuito).
- Footer: descrição, links do menu (Início, A Sala, Salas, Trilhas, Comunidade), Legal e Social (YouTube, Instagram) e o crédito.
- Artigos: 3 artigos distintos. As fotos são fornecidas pelo usuário depois; até lá, fundo com textura neutra.
- Curadoria: princípios 01 e 03 (só o 02, "Neutralidade doutrinária", existe).
- Sala: 5 Salas. Os nomes além de "Propósito" e "Fé e do Poder" ficam como rascunho.
- Comunidade: nomes de avatar genéricos.
- Trilhas: o ícone do degrau I é recriado no mesmo estilo dos outros.

## 8. Desempenho e acessibilidade

- Metas no Lighthouse mobile: Performance ≥ 85, Acessibilidade ≥ 95, SEO ≥ 95. LCP ≤ 2,5 s e CLS ≤ 0,05.
- Imagens estáticas com `next/image` (AVIF/WebP, `sizes` corretos). Texturas comprimidas.
- As animações usam só `transform`, `opacity`, `filter` e `clip-path`, sem animar propriedades de layout.
- HTML semântico: `<header>`, `<nav>`, `<main>`, uma `<section>` por cena com `aria-labelledby`, e `<footer>`. Um único `<h1>` ("A porta está aberta").
- O texto sobre o canvas é HTML real (legível por leitores de tela e buscadores). O canvas fica com `aria-hidden`.
- Foco visível em todos os controles. O acordeão segue o padrão de disclosure (`button` + `aria-expanded`). Contraste AA garantido nos pares de cores do sistema.
- Metadados: title, description, Open Graph com imagem do arco, `lang="pt-BR"`.

## 9. Testes e verificação

- **Unitários (Vitest):** mapeamento progresso → índice de frame em `FrameSequence`, ordem de carregamento dos frames, seleção do frame mais próximo e o fallback de reduced motion em `SceneTrack`.
- **Componentes (Testing Library):** o acordeão do FAQ (abre e fecha, teclado, `aria-expanded`) e o conteúdo de `site.ts` renderizado em cada cena.
- **E2E (Playwright):** carrega a página, rola até o fim, confirma que cada cena aparece, que não há erros no console e que não há rolagem horizontal em 375px. Roda também com `reducedMotion: 'reduce'`.
- **Visual:** screenshots em 1440, 768 e 375 comparados manualmente com o Figma a cada cena concluída.
- **Revisão de design e motion:** skills `ui-ux-pro-max` (UI/UX e acessibilidade) e `emil-design-eng` (acabamento e animação) aplicadas na implementação e na revisão de cada cena.
- `npm run build` sem erros ou avisos de tipo antes de publicar.

## 10. Entregáveis e ordem

1. Projeto base: Next.js, Tailwind, tokens, fontes, Lenis e `content/site.ts`.
2. Peças de motion (`SceneTrack`, `FrameSequence`, `SplitText`, `ParallaxLayer`, `Marquee`) com testes.
3. Cenas na ordem da página, com frames provisórios no Hero.
4. Vídeo via Magnific → frames reais do Hero.
5. Revisão de desempenho, acessibilidade e responsividade.
6. Deploy na Vercel.

## 11. Pendências do usuário

- 3 fotos dos cards de Artigos.
- Revisão dos textos-rascunho em `content/site.ts`.
- Aprovação do custo de geração do vídeo no Magnific.
- Destino real do botão "Entrar no acervo" (pode ficar `#` no lançamento).
