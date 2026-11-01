import type { Link, SiteContent } from "./types";

const PORTAL = "https://sala-dos-buscadores.vercel.app";
const CANAL = "https://www.youtube.com/@ASALADOSBUSCADORES";
const video = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const acervo: Link = { label: "Entrar no acervo", href: `${PORTAL}/salas` };
const youtube: Link = { label: "YouTube", href: CANAL, external: true };

const navLinks: Link[] = [
  { label: "Início", href: "#inicio" },
  { label: "Salas", href: "#salas" },
  { label: "A Sala", href: "#curadoria" },
  { label: "A Busca", href: "#perguntas" },
  { label: "Trilhas", href: "#trilhas" },
  { label: "Artigos", href: "#artigos" },
];

export const site: SiteContent = {
  meta: {
    title: "A Sala dos Buscadores",
    description:
      "Um portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis. Sem hierarquizar crenças, sem apagar diferenças.",
    ogImage: "/images/og.jpg",
  },
  nav: { links: navLinks, cta: acervo, labels: { menu: "Menu", close: "Fechar", primary: "Principal", logo: "A Sala dos Buscadores, início" } },
  hero: {
    title: ["A porta", "continua aberta"],
    description:
      "Um portal de Salas temáticas onde diferentes vozes compartilham conhecimentos, tradições e perspectivas sobre a experiência espiritual humana.",
    cta: acervo,
  },
  salas: {
    title: "A sala do primeiro ciclo",
    subtitle: "Os documentários e episódios do canal da Sala. Cada capa abre o vídeo no YouTube.",
    // Capas do canal oficial (i.ytimg.com/vi/<id>/maxresdefault.jpg), em ordem alfabética
    salas: [
      { id: "espiral", name: "E se o tempo fosse uma espiral?", image: "/images/salas/espiral.webp", href: video("WdfozbD1Lyo") },
      { id: "enoque", name: "Enoque: para onde ele foi? Trailer oficial", image: "/images/salas/enoque.webp", href: video("_YBJhQ2C6jc") },
      { id: "nag-hammadi", name: "Nag Hammadi: os textos esquecidos e a porta da consciência", image: "/images/salas/nag-hammadi.webp", href: video("tcIkPbnpHLo") },
      { id: "urantia", name: "O Livro de Urântia: origem, universo e Jesus", image: "/images/salas/urantia.webp", href: video("BMd3HC6ZpKY") },
    ],
  },
  curadoria: {
    label: "Curadoria",
    line1: "Curador de museu,",
    line2: "não pregador.",
    text: "A Sala dos Buscadores organiza o conhecimento religioso, espiritual e filosófico da humanidade em Salas, cada uma dedicada a uma tradição ou corpus documental. A IA organiza o que o acervo diz; não determina qual crença é verdadeira.",
    image: "/images/anfitrioes/claustro.webp",
    imageLabel: "Acervo · ilustração",
    imageCaption: "Claustro junto ao mar, ilustração do acervo",
    principles: [
      { title: "Neutralidade doutrinária", text: "Salas em ordem alfabética; a ordem não indica importância." },
      { title: "Fontes primárias à vista", text: "Original e tradução lado a lado, quando disponíveis." },
      { title: "Revisão da curadoria", text: "Os conteúdos passam pela revisão da curadoria antes de ir ao ar." },
    ],
  },
  perguntas: {
    label: "A busca",
    line1: "Perguntas que",
    line2: "atravessam tradições.",
    text: "Espiritualidade, consciência, filosofia, textos antigos, símbolos e tradições.",
    textStrong: "Organizados por tema, não por hierarquia.",
    themes: ["Morte", "Alma", "Meditação", "Origem do universo", "Conhecimento interior", "Formação da Bíblia", "Monoteísmo", "Origem do mal", "Manuscritos antigos", "Jesus"],
    themesLabel: "Temas",
    cta: { label: "Comparar temas", href: `${PORTAL}/comparar` },
    image: "/images/perguntas/scene.webp",
  },
  trilhas: {
    label: "Trilhas",
    line1: "Trilha de conhecimento",
    line2: "em degraus.",
    note: "Trilhas guiadas em preparação. Por enquanto, comece por estas leituras.",
    steps: [
      { numeral: "I", title: "O que é o hermetismo", meta: "Artigo", href: `${PORTAL}/salas/corpus-hermeticum` },
      { numeral: "II", title: "Poimandres: a visão de Hermes", meta: "Artigo", href: `${PORTAL}/salas/corpus-hermeticum` },
      { numeral: "III", title: "As sete esferas", meta: "Artigo", href: `${PORTAL}/salas/corpus-hermeticum` },
      { numeral: "IV", title: "O Asclépio em latim", meta: "Artigo", href: `${PORTAL}/salas/corpus-hermeticum` },
    ],
  },
  artigos: {
    label: "No acervo",
    line1: "Artigos,",
    line2: "vídeos e verbetes.",
    text: "Comece por um documentário do canal ou por uma leitura dentro das Salas.",
    filtersLabel: "Filtrar por tipo",
    filters: [
      { id: "all", label: "Todos" },
      { id: "artigo", label: "Artigos" },
      { id: "video", label: "Vídeos" },
      { id: "verbete", label: "Verbetes" },
    ],
    // Todas as imagens vêm do canal oficial: capas dos vídeos e dos Shorts. Artigos e verbete levam à Sala até haver URLs canônicas.
    items: [
      { id: "urantia", kind: "video", source: "A Sala de Urântia", title: "O Livro de Urântia: origem, universo e Jesus", meta: "Vídeo · 17 min", action: "Assistir", image: "/images/salas/urantia.webp", wide: true, alt: "Capa do documentário: livro aberto diante da Terra vista do espaço", focus: "92% 50%", href: video("BMd3HC6ZpKY"), external: true },
      { id: "nag-hammadi", kind: "video", source: "A Sala de Nag Hammadi", title: "Nag Hammadi: os textos esquecidos e a porta da consciência", meta: "Vídeo · 28 min", action: "Assistir", image: "/images/artigos/capa-nag-hammadi.webp", alt: "Capa do documentário: livros e jarros antigos diante de uma porta iluminada numa caverna", focus: "50% 50%", href: video("tcIkPbnpHLo"), external: true },
      { id: "enoque", kind: "video", source: "Documentário especial", title: "Enoque: para onde ele foi?", meta: "Trailer · 1 min", action: "Assistir", image: "/images/salas/enoque.webp", wide: true, alt: "Capa do trailer: homem de barba olha para o alto diante de uma espiral de luz", focus: "4% 50%", href: video("_YBJhQ2C6jc"), external: true },
      { id: "tome", kind: "artigo", source: "Biblioteca de Nag Hammadi", title: "O Evangelho de Tomé e os 114 ditos", meta: "Artigo", action: "Ver na Sala", image: "/images/artigos/capa-evangelho-tome.webp", alt: "Figura de capuz lê um livro à luz de vela numa sala de pedra", href: `${PORTAL}/salas/nag-hammadi` },
      { id: "poimandres", kind: "artigo", source: "Corpus Hermeticum", title: "Poimandres, §24–26: a subida pelas esferas", meta: "Fonte primária", action: "Ver na Sala", image: "/images/artigos/capa-esferas.webp", alt: "Figura caminha por um corredor de pedra em direção à luz", href: `${PORTAL}/salas/corpus-hermeticum` },
      { id: "tabua-esmeralda", kind: "verbete", source: "O Caibalion", title: "A Tábua de Esmeralda", meta: "Verbete", action: "Ver na Sala", image: "/images/artigos/capa-tabua.webp", alt: "Homem observa uma peça de madeira descer uma rampa e derrubar blocos, com o livro O Caibalion sobre a mesa", focus: "50% 8%", href: `${PORTAL}/salas/caibalion` },
    ],
    cta: { label: "Ver o canal no YouTube", href: CANAL, external: true },
  },
  leitura: {
    label: "Leitura na fonte",
    modesLabel: "Como ler o trecho",
    modes: [
      { id: "original", label: "Original" },
      { id: "translation", label: "Tradução" },
      { id: "side", label: "Lado a lado" },
    ],
    quote: {
      original: "τοῦτό ἐστι τὸ ἀγαθὸν τέλος τοῖς γνῶσιν ἐσχηκόσι…",
      translation: "Este é o bom fim para os que alcançaram o conhecimento…",
      source: "Corpus Hermeticum · Tratado I, 26 · Poimandres",
      originalLabel: "Original · grego",
      translationLabel: "Tradução",
    },
    features: [
      { title: "Original e tradução", text: "Alterne ou leia lado a lado, quando disponíveis, com a edição citada." },
      { title: "Glossário da Sala", text: "Demiurgo · grego · δημιουργός · artesão." },
      { title: "Continue de onde parou", text: "Retome a leitura no ponto em que parou." },
    ],
  },
  conquistas: {
    label: "Seu caminho no acervo",
    line1: "Cada descoberta",
    line2: "deixa uma marca.",
    gemsLabel: "Conquistas",
    gems: [
      { name: "Citrino", title: "Primeiro passo", from: "#F2C14E", to: "#B9770E" },
      { name: "Esmeralda", title: "Palavra por palavra", from: "#5FD39A", to: "#0E6B43" },
      { name: "Cristal de rocha", title: "Na fonte", from: "#F4F8FA", to: "#9FB3BF" },
      { name: "Safira", title: "Além da primeira leitura", from: "#6E95F0", to: "#1C3A8A" },
      { name: "Turmalina", title: "Lado a lado", from: "#F59AB5", to: "#2E9C6A" },
      { name: "Opala", title: "Entre Salas", from: "#EAF2F8", to: "#B7A6D9" },
      { name: "Ametista", title: "Leitura atenta", from: "#B48CE0", to: "#4E2A80" },
      { name: "Rubi", title: "Caminho percorrido", from: "#F0566F", to: "#7A0B1E" },
    ],
    text: "Leituras, encontros com as fontes e conexões entre Salas. Cada jornada tem seu próprio ritmo.",
  },
  anfitriao: {
    label: "Para anfitriões",
    line1: "Tem uma pesquisa?",
    line2: "Abra a sua Sala.",
    text: "Pesquisadores, professores e estudiosos de uma tradição podem manter uma Sala própria no acervo, com os seus artigos e as suas fontes, ao lado das Salas da curadoria.",
    steps: [
      { title: "Candidatura", text: "Você conta a sua pesquisa." },
      { title: "Convite", text: "A curadoria analisa e convida." },
      { title: "Revisão", text: "Nada vai ao ar sem aprovação." },
    ],
    // Até haver formulário, a candidatura começa por e-mail.
    primary: { label: "Quero ser anfitrião", href: "mailto:contato@asaladosbuscadores.com.br?subject=Candidatura%20para%20anfitri%C3%A3o" },
    secondary: { label: "Como funciona", href: "/anfitrioes" },
    seal: "Anfitrião · revisado pela curadoria",
    caption: "Exemplo de Sala de anfitriã (perfil de demonstração)",
    card: {
      image: "/images/anfitrioes/claustro.webp",
      count: "2 conteúdos",
      title: "Leituras do Evangelho de Tomé",
      description: "Sala de anfitriã · Helena Varga (demonstração)",
      level: "Iniciante",
      updated: "Atualizada em 7 out 2026",
      note: "Exemplo de demonstração",
    },
  },
  faq: {
    label: "Dúvidas",
    line1: "Perguntas",
    line2: "frequentes.",
    invite: "Não achou o que procurava?",
    email: "contato@asaladosbuscadores.com.br",
    items: [
      { question: "A Sala dos Buscadores defende alguma religião?", answer: "Não. O acervo organiza tradições religiosas, espirituais e filosóficas com neutralidade doutrinária. As Salas aparecem em ordem alfabética, e a ordem não indica importância." },
      { question: "A conta é paga?", answer: "Não. A conta é gratuita." },
      { question: "Quem escreve os conteúdos?", answer: "As equipes editoriais de cada Sala e anfitriões convidados. Nada vai ao ar sem a revisão da curadoria." },
      { question: "Como funciona o assistente?", answer: "A IA organiza o que o acervo diz; não determina qual crença é verdadeira." },
      { question: "Preciso informar minha religião?", answer: "Não. Esse campo é opcional no cadastro." },
    ],
  },
  chamado: {
    line1: "Abra espaço para",
    line2: "novas formas de conhecer.",
    text: "Uma curadoria de conhecimentos para explorar, questionar e descobrir no seu próprio ritmo.",
    cta: acervo,
  },
  footer: {
    logoAlt: "A Sala dos Buscadores",
    description: "Um acervo para quem busca: tradições, textos e símbolos organizados com rigor e sem hierarquia.",
    columns: [
      { title: "Menu", links: navLinks.filter((l) => l.href !== "#perguntas") },
      {
        title: "Legal",
        links: [
          { label: "Privacidade e LGPD", href: `${PORTAL}/sobre#privacidade` },
          { label: "Termos de uso", href: `${PORTAL}/sobre#termos` },
        ],
      },
      { title: "Social", links: [youtube] },
    ],
    copyright: "2026 © A Sala dos Buscadores",
    credit: "Feito com cuidado pela equipe da Sala",
    backToTop: "Voltar ao topo",
  },
};
