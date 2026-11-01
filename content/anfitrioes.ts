import type { AnfitrioesContent, Link } from "./types";
import { site } from "./site";

const EMAIL = "contato@asaladosbuscadores.com.br";
// Até haver formulário, a candidatura começa por e-mail.
const candidatura: Link = { label: "Candidatar-me como anfitrião", href: `mailto:${EMAIL}?subject=Candidatura%20para%20anfitri%C3%A3o` };

const navLinks: Link[] = [
  { label: "Início", href: "/" },
  { label: "Por que", href: "#por-que" },
  { label: "A sua Sala", href: "#sala" },
  { label: "O editor", href: "#editor" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Perguntas", href: "#faq" },
];

// Textos do PDF "Landing Page — Anfitriões (crie sua Sala)". As respostas 03 a 05 do FAQ estão
// fechadas no PDF: foram escritas a partir do resto da página e precisam de revisão da curadoria.
export const anfitrioes: AnfitrioesContent = {
  meta: {
    title: "Seja anfitrião · A Sala dos Buscadores",
    description: "A curadoria convida anfitriões para manter uma Sala própria: a sua leitura de uma tradição, com os seus artigos e as suas fontes, ao lado das Salas da curadoria.",
  },
  nav: { ...site.nav, links: navLinks, cta: { label: "Candidatar-me", href: candidatura.href } },
  hero: {
    label: "Para pesquisadores, professores e estudiosos de uma tradição",
    image: "/images/anfitrioes/hero.webp",
    secondary: { label: "Ver uma Sala de anfitriã", href: "#sala" },
    title: ["Abra a sua Sala", "no acervo"],
    description: "A curadoria convida anfitriões para manter uma Sala própria: a sua leitura de uma tradição, com os seus artigos e as suas fontes, ao lado das Salas da curadoria.",
    cta: candidatura,
  },
  porQue: {
    label: "Por que ser anfitrião",
    line1: "Curadoria de museu,",
    line2: "com a sua assinatura.",
    text: "Sua pesquisa ganha uma Sala própria, organizada com o mesmo rigor do acervo: textos em seus próprios contextos, fontes à vista e nenhuma hierarquia entre tradições.",
    image: "/images/anfitrioes/arco-do-ceu.webp",
    imageLabel: "Acervo · ilustração",
    imageCaption: "O buscador diante do arco do céu",
    reasons: [
      { title: "A sua leitura, com o seu nome", text: "Cada artigo traz a sua assinatura e o selo de anfitrião. O leitor sabe que é a leitura de um anfitrião." },
      { title: "Toda afirmação com fonte", text: "Termos, obras e chamadas de fonte ficam marcados no texto e ligados às obras citadas." },
      { title: "A curadoria revisa, não reescreve", text: "Nada vai ao ar sem revisão, mas a curadoria aprova ou reprova sem editar o seu conteúdo." },
    ],
  },
  sala: {
    label: "Como fica a sua Sala",
    line1: "Uma Sala no acervo,",
    line2: "com o seu nome.",
    text: "Exemplo de demonstração: a Sala de Helena Varga, publicada ao lado das Salas da curadoria, no mesmo card, na mesma grade.",
    card: site.anfitriao.card,
    profile: {
      avatar: "/images/anfitrioes/avatar.webp",
      label: "Página pública do anfitrião",
      name: "Helena Varga (demonstração)",
      note: "Exemplo ilustrativo, sem página publicada",
      seal: site.anfitriao.seal,
    },
    articles: [
      { state: "Publicado", title: "O Hino da Pérola nos Atos de Tomé", text: "Escrito por um anfitrião na própria Sala e aprovado pela curadoria." },
      { state: "Em revisão", title: "O príncipe que esquece: a narrativa do Hino da Pérola", text: "Esperando a decisão da curadoria." },
      { state: "Em revisão", title: "Quem compôs o Hino? Hipóteses sobre a origem siríaca", text: "Esperando a decisão da curadoria." },
    ],
    reach: [
      { title: "Na grade comparativa", text: "A Sala entra no Comparar, ao lado das Salas da curadoria." },
      { title: "No acervo do assistente", text: "As respostas do assistente citam a sua Sala como fonte." },
    ],
  },
  editor: {
    label: "O editor",
    line1: "Escreva com rigor,",
    line2: "cite cada fonte.",
    text: "Um editor de blocos feito para o acervo: o rascunho é salvo sozinho, e cada afirmação fica ligada a uma obra.",
    srNote: "Demonstração do editor. Nada é enviado.",
    toolbarLabel: "Ferramentas do editor",
    tools: [
      { id: "termo", title: "Termo", text: "Para o vocabulário próprio da tradição. Vira verbete no glossário da Sala." },
      { id: "obra", title: "Obra", text: "Para títulos de obras, sempre marcados do mesmo jeito em todo o acervo." },
      { id: "citar", title: "Citar fonte", text: "Insere a chamada [n] ligada a uma obra do card Fontes." },
    ],
    status: { saving: "Salvando…", saved: "Rascunho salvo", sent: "Em revisão" },
    draft: {
      eyebrow: "Leituras do Evangelho de Tomé · Novo artigo",
      title: "O Hino da Pérola nos Atos de Tomé",
      work: "Atos de Tomé",
      term: "hino",
      source: "Fonte primária · obra do card Fontes",
    },
    send: {
      label: "Para enviar",
      requirements: ["Título e apresentação", "Pelo menos uma fonte", "Toda afirmação atribuída a uma fonte", "Sala escolhida"],
      note: "A curadoria revisa antes de publicar. Enquanto isso, o artigo fica em “Em revisão”.",
      action: "Enviar para revisão",
      done: "Em revisão",
    },
  },
  etapas: {
    label: "Como funciona",
    line1: "Do convite",
    line2: "à Sala publicada.",
    text: "Cinco degraus. Você acompanha cada etapa na sua área de anfitrião, em “Minhas Salas”.",
    listLabel: "Etapas do convite à Sala publicada",
    steps: [
      { numeral: "I", title: "Candidatura", text: "Você conta a sua pesquisa e a tradição ou corpus que quer apresentar." },
      { numeral: "II", title: "Convite", text: "A curadoria analisa e envia um convite. A conta de anfitrião usa o e-mail do convite." },
      { numeral: "III", title: "Sala e artigos", text: "Você cria a Sala, escreve os artigos e indica vídeos. O rascunho é salvo sozinho." },
      { numeral: "IV", title: "Revisão", text: "A curadoria aprova ou reprova, sem editar o seu conteúdo." },
      { numeral: "V", title: "Publicação", text: "A Sala vai ao portal com o selo de anfitrião e a sua página pública." },
    ],
    cta: { label: "Candidatar-me", href: candidatura.href },
  },
  politica: {
    label: "Política editorial",
    line1: "Apresentar,",
    line2: "não pregar.",
    text: "As mesmas regras valem para a curadoria e para os anfitriões. É isso que mantém o acervo comparável e confiável.",
    rules: [
      { title: "Neutralidade doutrinária", text: "A Sala apresenta uma tradição em seus próprios contextos, sem tratá-la como superior às outras." },
      { title: "Toda afirmação com origem", text: "Cada afirmação é atribuída a uma fonte (“Segundo o Poimandres…”). Artigo sem fonte não é publicado." },
      { title: "Leitura sinalizada", text: "Artigos de anfitrião avisam o leitor que trazem a leitura de um anfitrião, com assinatura e selo." },
      { title: "Revisão antes de publicar", text: "Salas e artigos passam pela curadoria. A decisão aparece na sua área: publicados, em revisão ou reprovados." },
    ],
  },
  faq: {
    label: "Dúvidas",
    line1: "Perguntas de",
    line2: "anfitriões.",
    invite: "Quer conversar antes de se candidatar?",
    email: EMAIL,
    items: [
      { question: "Como eu me torno anfitrião?", answer: "Pela candidatura. A curadoria analisa a proposta e, se fizer sentido para o acervo, envia um convite para o seu e-mail. A conta de anfitrião é criada com o e-mail do convite." },
      { question: "A curadoria edita o meu texto?", answer: "Não. A curadoria revisa e aprova ou reprova Salas e artigos, sem editar o conteúdo do anfitrião." },
      { question: "O que acontece se um artigo for reprovado?", answer: "O artigo não é publicado. A decisão aparece na sua área de anfitrião, em “Minhas Salas”." },
      { question: "Posso indicar vídeos na minha Sala?", answer: "Sim. Depois do convite, você cria a Sala, escreve os artigos e indica vídeos." },
      { question: "Posso manter mais de uma Sala?", answer: `Converse com a curadoria antes de propor uma nova Sala: ${EMAIL}.` },
    ],
  },
  chamado: {
    line1: "A porta está aberta;",
    line2: "a sua Sala também pode estar.",
    text: "Conte a sua pesquisa para a curadoria. Se fizer sentido para o acervo, o convite chega no seu e-mail.",
    cta: candidatura,
  },
  footer: {
    ...site.footer,
    columns: [
      { title: "Anfitriões", links: navLinks.filter((l) => l.href.startsWith("#")) },
      { title: "A Sala", links: [{ label: "Início", href: "/" }, { label: "Salas", href: "/#salas" }, { label: "Artigos", href: "/#artigos" }] },
      ...site.footer.columns.filter((c) => c.title !== "Menu"),
    ],
  },
};
