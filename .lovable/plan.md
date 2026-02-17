

## Melhorias no CRM e botao WhatsApp

### 1. Detalhamento das respostas no CRM

Na tabela de leads do CRM, a coluna "Respostas" atualmente mostra apenas os numeros (ex: "3, 2, 4, 1..."). Vamos substituir por um botao/tooltip que ao clicar expande um painel mostrando cada pergunta com a resposta escolhida e a pontuacao.

**Arquivo: `src/pages/CRM.tsx`**
- Importar `quizQuestions` de `QuizData.ts` para mapear as respostas aos textos das perguntas
- Substituir a celula de texto simples por um componente expansivel (Collapsible ou Dialog) que mostra:
  - Pergunta 1: "resposta escolhida" (X pts)
  - Pergunta 2: "resposta escolhida" (X pts)
  - ...e assim por diante para as 13 perguntas
- Usar um botao "Ver detalhes" na celula da tabela que abre um Dialog com o detalhamento completo

### 2. Filtro por datas no CRM

**Arquivo: `src/pages/CRM.tsx`**
- Adicionar dois seletores de data (de/ate) usando o componente Popover + Calendar (datepicker do shadcn)
- Filtrar os leads pela coluna `created_at` comparando com as datas selecionadas
- Botao para limpar o filtro de datas
- Posicionar os seletores junto aos filtros existentes

### 3. Alterar copy do botao WhatsApp

**Arquivo: `src/components/quiz/QuizResult.tsx`**
- Trocar o texto do botao CTA de "QUERO SER INCOMPARAVEL" para "Quero ajustar meu posicionamento agora"
- Manter o mesmo comportamento de redirecionamento para WhatsApp

---

### Secao tecnica

**CRM.tsx - Detalhamento de respostas:**
- Importar `Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger` de `@/components/ui/dialog`
- Importar `quizQuestions` de `@/components/quiz/QuizData`
- Criar componente inline `LeadAnswersDialog` que recebe `answers: number[]` e mapeia cada resposta ao texto da pergunta correspondente usando `quizQuestions[index].options.find(o => o.points === answer)`
- Renderizar em lista formatada dentro do Dialog

**CRM.tsx - Filtro por datas:**
- Adicionar estados `dateFrom` e `dateTo` (tipo `Date | undefined`)
- Usar componente Popover + Calendar (ja disponivel no projeto) para selecao de datas
- Adicionar logica no `filteredLeads` para comparar `created_at` com o range de datas
- Usar `format` de `date-fns` para exibir as datas selecionadas nos botoes

**QuizResult.tsx - Copy do botao:**
- Linha 100: trocar `"QUERO SER INCOMPARAVEL"` por `"Quero ajustar meu posicionamento agora"`
