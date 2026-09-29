import type { Link, SiteContent } from "./types";

const ACERVO = "#";
const avatar = (n: number) => `/images/comunidade/avatars/avatar-${String(n).padStart(2, "0")}.svg`;
const acervo: Link = { label: "Entrar no acervo", href: ACERVO };
const youtube: Link = { label: "YouTube", href: "#", external: true };
const instagram: Link = { label: "Instagram", href: "#", external: true };

const navLinks: Link[] = [
  { label: "Início", href: "#inicio" },
  { label: "Salas", href: "#salas" },
  { label: "A Sala", href: "#curadoria" },
  { label: "A Busca", href: "#perguntas" },
  { label: "Trilhas", href: "#trilhas" },
  { label: "Comunidade", href: "#comunidade" },
];

export const site: SiteContent = {
  meta: {
    title: "A Sala dos Buscadores",
    description:
      "Um portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis. Sem hierarquizar crenças, sem apagar diferenças, sempre com a fonte à vista.",
    ogImage: "/images/og.jpg",
  },
  nav: { links: navLinks, cta: acervo, labels: { menu: "Menu", close: "Fechar", primary: "Principal", logo: "A Sala dos Buscadores, início" } },
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
    labels: { prev: "Princípio anterior", next: "Próximo princípio" },
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
    text: "Espiritualidade, consciência, filosofia, textos antigos, símbolos e tradições.",
    textStrong: "Organizados por tema, não por hierarquia.",
    themes: ["Morte", "Alma", "Meditação", "Origem do universo", "Conhecimento interior", "Reencarnação", "Sofrimento", "Ética", "Oração", "Consciência"],
    themesLabel: "Temas",
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
        image: "/images/artigos/tome.webp",
        kicker: "Artigo · 14 min · Biblioteca de Nag Hammadi",
        title: "O Evangelho de Tomé e os 114 ditos",
        author: "Marvin Meyer · Estudioso de textos coptas",
        href: ACERVO,
      },
      {
        id: "poimandres",
        image: "/images/artigos/poimandres.webp",
        kicker: "Vídeo · 22 min · Corpus Hermeticum",
        title: "As sete esferas no Poimandres: o que o Tratado I descreve sobre a subida da alma",
        author: "Ana Ribeiro · Doutora em História Antiga, USP",
        href: ACERVO,
      },
      {
        id: "nag-hammadi",
        image: "/images/artigos/nag-hammadi.webp",
        kicker: "Vídeo · 18:42 · Biblioteca de Nag Hammadi",
        title: "O que foi encontrado em Nag Hammadi",
        author: "Episódio 3 · 12 set 2026",
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
    // TODO: substituir pelos avatares reais (placeholders abstratos de scripts/make-avatars.mjs)
    members: [
      { name: "Ana L.", avatar: avatar(1) },
      { name: "Rafael M.", avatar: avatar(2) },
      { name: "Júlia S.", avatar: avatar(3) },
      { name: "Tomás R.", avatar: avatar(4) },
      { name: "Helena C.", avatar: avatar(5) },
      { name: "Caio B.", avatar: avatar(6) },
      { name: "Marina F.", avatar: avatar(7) },
      { name: "Davi P.", avatar: avatar(8) },
      { name: "Lívia A.", avatar: avatar(9) },
      { name: "Otávio N.", avatar: avatar(10) },
      { name: "Beatriz G.", avatar: avatar(11) },
      { name: "Samuel T.", avatar: avatar(12) },
      { name: "Clara V.", avatar: avatar(13) },
      { name: "Igor D.", avatar: avatar(14) },
      { name: "Yasmin K.", avatar: avatar(15) },
      { name: "Bruno E.", avatar: avatar(16) },
      { name: "Sofia H.", avatar: avatar(17) },
      { name: "Pedro Q.", avatar: avatar(18) },
      { name: "Alice W.", avatar: avatar(19) },
      { name: "Mateus J.", avatar: avatar(20) },
      { name: "Laura O.", avatar: avatar(21) },
      { name: "Gabriel Z.", avatar: avatar(22) },
      { name: "Isis U.", avatar: avatar(23) },
      { name: "Nina Y.", avatar: avatar(24) },
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
    logoAlt: "A Sala dos Buscadores",
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
