export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    text: string;
    points: number;
  }[];
}

export interface QuizResult {
  id: string;
  title: string;
  minScore: number;
  maxScore: number;
  color: string;
  content: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quando alguém te indica, o que normalmente dizem sobre você?",
    options: [
      { label: "A", text: '"Ela faz [o serviço]"', points: 1 },
      { label: "B", text: '"Ela é boa no que faz"', points: 2 },
      { label: "C", text: '"Ela resolve bem [problema específico]"', points: 3 },
      { label: "D", text: '"Ela tem um jeito diferente de trabalhar"', points: 4 },
      { label: "E", text: '"Ela é referência nisso"', points: 5 },
    ],
  },
  {
    id: 2,
    question: "Hoje, como as pessoas chegam até você?",
    options: [
      { label: "A", text: "Somente indicação", points: 1 },
      { label: "B", text: "Somente Instagram + conteúdo", points: 2 },
      { label: "C", text: "Indicação + conteúdo consistente", points: 3 },
      { label: "D", text: "Comercial ativo com prospecção", points: 4 },
      { label: "E", text: "Comercial ativo + conteúdo + indicação", points: 5 },
    ],
  },
  {
    id: 3,
    question: "Você sente que o seu cliente entende claramente o que você entrega?",
    options: [
      { label: "A", text: "Não", points: 1 },
      { label: "B", text: "Um pouco", points: 2 },
      { label: "C", text: "Entendem, mas confundem com outros", points: 3 },
      { label: "D", text: "Entendem e percebem diferença", points: 4 },
      { label: "E", text: "Entendem e não comparam", points: 5 },
    ],
  },
  {
    id: 4,
    question: "Seu trabalho costuma ser comparado com…",
    options: [
      { label: "A", text: "Qualquer outra profissional", points: 1 },
      { label: "B", text: "O mais barato", points: 2 },
      { label: "C", text: "Quem faz algo parecido", points: 3 },
      { label: "D", text: "Concorrentes muito específicos", points: 4 },
      { label: "E", text: "Ninguém", points: 5 },
    ],
  },
  {
    id: 5,
    question: 'Com que frequência você escuta "tá caro"?',
    options: [
      { label: "A", text: "Quase sempre", points: 1 },
      { label: "B", text: "Muitas vezes", points: 2 },
      { label: "C", text: "Às vezes", points: 3 },
      { label: "D", text: "Raramente", points: 4 },
      { label: "E", text: "Nunca", points: 5 },
    ],
  },
  {
    id: 6,
    question: "Quando você fala seu preço, você sente…",
    options: [
      { label: "A", text: "Medo", points: 1 },
      { label: "B", text: "Insegurança", points: 2 },
      { label: "C", text: "Neutralidade", points: 3 },
      { label: "D", text: "Segurança", points: 4 },
      { label: "E", text: "Tranquilidade absoluta", points: 5 },
    ],
  },
  {
    id: 7,
    question: "O cliente precisa de muita explicação para entender seu valor?",
    options: [
      { label: "A", text: "Sim, demais", points: 1 },
      { label: "B", text: "Sim", points: 2 },
      { label: "C", text: "Um pouco", points: 3 },
      { label: "D", text: "Pouca explicação", points: 4 },
      { label: "E", text: "Ele já entende", points: 5 },
    ],
  },
  {
    id: 8,
    question: "Hoje você cobra mais por…",
    options: [
      { label: "A", text: "Hora", points: 1 },
      { label: "B", text: "Pacote fechado", points: 2 },
      { label: "C", text: "Escopo/projeto", points: 3 },
      { label: "D", text: "Transformação/resultado", points: 4 },
      { label: "E", text: "Percepção de valor", points: 5 },
    ],
  },
  {
    id: 9,
    question: "O que faz alguém escolher você?",
    options: [
      { label: "A", text: "Preço", points: 1 },
      { label: "B", text: "Disponibilidade", points: 2 },
      { label: "C", text: "Técnica", points: 3 },
      { label: "D", text: "Experiência", points: 4 },
      { label: "E", text: "Identificação / Status", points: 5 },
    ],
  },
  {
    id: 10,
    question: "Se você sumisse hoje do mercado…",
    options: [
      { label: "A", text: "Ninguém notaria", points: 1 },
      { label: "B", text: "Poucos sentiriam falta", points: 2 },
      { label: "C", text: "Alguns clientes sentiriam", points: 3 },
      { label: "D", text: "Muitos sentiriam", points: 4 },
      { label: "E", text: "Seu mercado sentiria", points: 5 },
    ],
  },
  {
    id: 11,
    question: "Você sente que joga o mesmo jogo que todo mundo do seu mercado?",
    options: [
      { label: "A", text: "Sim", points: 1 },
      { label: "B", text: "Quase igual", points: 2 },
      { label: "C", text: "Um pouco diferente", points: 3 },
      { label: "D", text: "Bem diferente", points: 4 },
      { label: "E", text: "Um jogo só seu", points: 5 },
    ],
  },
  {
    id: 12,
    question: "Você se sente confortável em ser…",
    options: [
      { label: "A", text: "Escolhida pelo preço", points: 1 },
      { label: "B", text: "Uma opção", points: 2 },
      { label: "C", text: "Uma boa opção", points: 3 },
      { label: "D", text: "A opção preferida", points: 4 },
      { label: "E", text: "A única opção possível", points: 5 },
    ],
  },
  {
    id: 13,
    question: "Hoje, sua marca é percebida no mercado como…",
    options: [
      { label: "A", text: "Executa bem, mas é substituível", points: 1 },
      { label: "B", text: "Competente, mas parecida com outras", points: 2 },
      { label: "C", text: "Clara no que faz, ainda comparável", points: 3 },
      { label: "D", text: "Diferente, com identidade reconhecível", points: 4 },
      { label: "E", text: "Com um lugar próprio, difícil de copiar", points: 5 },
    ],
  },
];

export const quizResults: QuizResult[] = [
  {
    id: "invisivel",
    title: "POSICIONAMENTO INVISÍVEL",
    minScore: 13,
    maxScore: 27,
    color: "destructive",
    content: [
      "Não é que você não seja boa.",
      "É que o mercado não te enxerga como escolha.",
      "A maioria das profissionais que estão invisíveis não está errando na entrega. Está errando no lugar que ocupa na mente do cliente.",
      "Quando alguém precisa do que você faz, o cérebro dela não lembra de você automaticamente. E quando isso acontece, o jogo vira um só: preço, comparação, dúvida.",
      "Por isso você sente que precisa explicar demais, provar demais, baixar demais.",
      "Não porque você vale menos. Porque o mercado ainda te lê como opção genérica.",
      "O erro comum aqui é tentar sair do invisível fazendo mais: mais conteúdo, mais cursos, mais esforço. Invisibilidade não se resolve com volume. Se resolve com clareza de posicionamento.",
      'A boa notícia? Existe um caminho claro para sair daqui. E ele não começa com "aparecer mais", mas com mudar o jogo que você está jogando.',
    ],
  },
  {
    id: "notado",
    title: "POSICIONAMENTO NOTADO",
    minScore: 28,
    maxScore: 41,
    color: "accent",
    content: [
      "Você já é vista.",
      "Mas ainda não é a escolha óbvia.",
      "Você não está mais invisível. As pessoas sabem que você existe. Algumas até te admiram.",
      "Mas se o cliente ainda compara, é porque o seu lugar ainda não está claro o suficiente.",
      "No nível \"notada\", acontece algo perigoso: você começa a ter resultados, mas sente que eles vêm com esforço demais.",
      "Alguns clientes fecham rápido. Outros travam. Outros pedem desconto. E isso gera uma confusão interna: \"Será que estou cobrando caro?\" \"Será que preciso explicar melhor?\"",
      "Não precisa.",
      "O que está faltando não é visibilidade. É direção de percepção. Você já chamou atenção. Agora precisa organizar o que o cliente entende sobre você.",
      "Porque quando isso não acontece, você vira \"mais uma boa opção\". E boa opção sempre é comparada.",
      "O próximo nível não é falar mais alto. É falar do jeito certo, para a pessoa certa.",
    ],
  },
  {
    id: "diferenciado",
    title: "POSICIONAMENTO DIFERENCIADO",
    minScore: 42,
    maxScore: 65,
    color: "primary",
    content: [
      "Você não disputa mais preço. Agora disputa lugar.",
      "O mercado já percebe que você não é comum.",
      "O cliente sente diferença. Sente segurança. Sente que com você é diferente.",
      "Por isso o preço pesa menos, a conversa é mais madura, a decisão é mais consciente.",
      "Mas existe um risco silencioso nesse nível.",
      "Diferenciação sem sustentação vira fase. Fase boa, mas passageira.",
      "Muitas marcas chegam até aqui e param de evoluir achando que \"já está bom\". É nesse ponto que o mercado copia, o discurso se espalha e o que era diferencial vira padrão.",
      "O próximo salto não é entregar mais. É consolidar um território.",
      "Um lugar onde o cliente entende o valor sem esforço, a comparação perde força, e você deixa de ser apenas \"preferida\" para se tornar difícil de substituir.",
    ],
  },
];

export const getResultByScore = (score: number): QuizResult => {
  return (
    quizResults.find(
      (result) => score >= result.minScore && score <= result.maxScore
    ) || quizResults[0]
  );
};
