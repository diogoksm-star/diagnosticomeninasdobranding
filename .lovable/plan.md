

## Integrar Quiz com Kommo CRM via Webhook Kwid

### Abordagem

Como o webhook da Kwid aceita POST direto, vamos enviar os dados do lead diretamente do frontend, sem necessidade de backend ou Edge Function. Isso simplifica a implementacao e evita configuracoes extras.

### O que sera feito

**1. Atualizar `src/components/quiz/Quiz.tsx`**
- No `handleLeadCapture`, alem do console.log, adicionar um `fetch` POST para o webhook da Kwid
- Enviar todos os dados do lead: nome, email, WhatsApp, respostas (Q1-Q13), pontuacao total, resultado do diagnostico, data/hora
- O envio sera fire-and-forget (nao bloqueia o fluxo do quiz — o usuario continua vendo "Analisando..." normalmente)
- Tratar erros silenciosamente (apenas log no console)

**2. Dados enviados ao webhook**

```text
{
  name: "Nome do usuario",
  email: "email@exemplo.com",
  whatsapp: "(11) 99999-9999",
  answers: [3, 2, 4, 1, ...],      // pontos de cada resposta (Q1-Q13)
  totalScore: 42,
  result: "diferenciado",           // ID do resultado
  resultTitle: "POSICIONAMENTO DIFERENCIADO",
  timestamp: "2026-02-17T14:30:00Z"
}
```

### Detalhes tecnicos

- URL do webhook: `https://data.widgets.wearekwid.com/api/webhook/34486363/15c0adf418ac74139c4d580c53e3c9e8c89c7da310b4be3e058c9f267bf085e6`
- Metodo: POST com `Content-Type: application/json`
- Sem autenticacao necessaria (o token ja esta na URL)
- Envio assincrono — nao interfere na experiencia do usuario

### Nota sobre seguranca

A URL do webhook ficara visivel no codigo frontend. Isso e aceitavel para webhooks de ingestao de dados (somente escrita), mas se no futuro voce quiser proteger essa URL, podemos mover para uma Edge Function com Supabase Cloud.

### Resultado final

Quando o usuario preencher nome, email e WhatsApp no quiz, os dados serao enviados automaticamente para o Kommo via webhook da Kwid, sem nenhuma acao adicional necessaria.

