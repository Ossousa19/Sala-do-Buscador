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
    text: "Espiritualidade, consciência, filosofia, textos antigos, símbolos e tradições.",
    textStrong: "Organizados por tema, não por hierarquia.",
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
