export type Link = { label: string; href: string; external?: boolean };
export type HeroContent = { title: [string, string]; tagline: [string, string]; description: string; cta: Link };
export type Sala = { id: string; name: string; image?: string; href: string };
export type SalasContent = { title: string; subtitle: string; salas: Sala[] };
export type Principle = { number: string; title: string; text: string };
export type CuradoriaContent = {
  titleDim: string; titleLit: string; subtitle: string; cta: Link; principles: Principle[];
  labels: { prev: string; next: string };
};
export type PerguntasContent = { title: string; text: string; textStrong: string; themes: string[]; themesLabel: string; cta: Link; image: string };
export type Step = { numeral: string; title: string; meta: string; icon: string; href: string };
export type TrilhasContent = { titleDim: string; titleLit: string; steps: Step[] };
export type Article = { id: string; kicker: string; title: string; author: string; image?: string; href: string };
export type ArtigosContent = { titleDim: string; titleLit: string; subtitle: string; articles: Article[] };
export type Member = { name: string; avatar?: string };
export type ComunidadeContent = { badge: string; title: string; text: string; links: Link[]; members: Member[] };
export type FaqItem = { question: string; answer: string };
export type FaqContent = { title: string; text: string; items: FaqItem[] };
export type FooterColumn = { title: string; links: Link[] };
export type FooterContent = { logoAlt: string; description: string; columns: FooterColumn[]; copyright: string; credit: string; wordmark: [string, string] };
export type NavContent = { links: Link[]; cta: Link; labels: { menu: string; close: string; primary: string; logo: string } };
export type SiteContent = {
  meta: { title: string; description: string; ogImage: string };
  nav: NavContent; hero: HeroContent; salas: SalasContent; curadoria: CuradoriaContent;
  perguntas: PerguntasContent; trilhas: TrilhasContent; artigos: ArtigosContent;
  comunidade: ComunidadeContent; faq: FaqContent; footer: FooterContent;
};
