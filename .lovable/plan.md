

## Adicionar UTM Parameters + Mover Webhook para Edge Function

### Contexto do teste

O fluxo do quiz foi testado de ponta a ponta e funciona corretamente. O diagnostico aparece na pagina e o botao WhatsApp esta no final. Porem, o webhook da Kwid retornou **erro 402 (Payment Required)** -- isso e um problema no lado da Kwid/Kommo (plano ou cota). Os dados estao sendo enviados corretamente pelo quiz.

### 1. Adicionar parametros UTM ao payload

Capturar automaticamente os parametros UTM da URL quando o usuario acessa o quiz (ex: `?utm_source=instagram&utm_medium=stories&utm_campaign=lancamento`).

**Alteracao em `src/components/quiz/Quiz.tsx`:**
- Ao iniciar o quiz, extrair `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` e `utm_content` da URL usando `URLSearchParams`
- Armazenar no estado do quiz
- Incluir no payload enviado ao webhook

**Dados adicionais no payload:**
```text
{
  ...dados existentes,
  utm_source: "instagram",
  utm_medium: "stories",
  utm_campaign: "lancamento",
  utm_term: "",
  utm_content: ""
}
```

### 2. Mover webhook para Edge Function (seguranca)

Atualmente a URL do webhook fica exposta no codigo frontend. Vamos mover para uma Edge Function no Supabase para que a URL fique protegida no servidor.

**Pre-requisito:** O projeto precisa estar conectado ao Lovable Cloud ou Supabase.

**Criar `supabase/functions/send-to-kommo/index.ts`:**
- Recebe os dados do lead via POST do frontend
- Faz o POST para o webhook da Kwid usando a URL armazenada como secret
- Retorna sucesso/erro
- Inclui CORS headers

**Criar secret:**
- `KOMMO_WEBHOOK_URL` = URL completa do webhook da Kwid

**Atualizar `src/components/quiz/Quiz.tsx`:**
- Trocar o `fetch` direto para o webhook por `supabase.functions.invoke('send-to-kommo', { body: payload })`
- Importar o cliente Supabase

**Atualizar `supabase/config.toml`:**
- Adicionar configuracao da funcao com `verify_jwt = false` (quiz nao tem autenticacao)

### Secao tecnica

**Edge Function (`supabase/functions/send-to-kommo/index.ts`):**
```text
- CORS headers padrao
- OPTIONS handler para preflight
- Recebe POST com body JSON
- Le KOMMO_WEBHOOK_URL do Deno.env
- Faz fetch POST para o webhook
- Retorna status da resposta
```

**UTM no Quiz.tsx:**
```text
- useEffect no mount para ler window.location.search
- Armazenar UTMs no estado (ou ref)
- Incluir no payload do handleLeadCapture
```

### Ordem de implementacao

1. Primeiro: conectar ao Lovable Cloud (se nao estiver conectado)
2. Segundo: criar o secret KOMMO_WEBHOOK_URL
3. Terceiro: criar a Edge Function send-to-kommo
4. Quarto: atualizar Quiz.tsx com UTMs + chamada a Edge Function

### Nota importante

O erro 402 do webhook da Kwid precisa ser resolvido no painel da Kwid/Kommo. As melhorias acima nao corrigem esse erro -- ele e um problema de pagamento/cota do servico externo.

