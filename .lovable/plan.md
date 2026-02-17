
## Restaurar Diagnóstico na Página + WhatsApp no Final

### O que muda

O fluxo atual vai de "Analisando..." direto para a tela de WhatsApp sem mostrar o diagnóstico. Vamos restaurar o fluxo original onde o diagnóstico completo aparece na página, com o botão de WhatsApp no final.

### Novo fluxo

1. Quiz (13 perguntas)
2. Captura de dados (nome, email, WhatsApp)
3. Tela "Analisando..." (3 segundos)
4. **Tela de resultado completo** (mostra o diagnóstico com todo o conteúdo)
5. Botão "QUERO SER INCOMPARÁVEL" no final do diagnóstico abre WhatsApp com mensagem específica por resultado

### Alterações técnicas

**1. `src/components/quiz/Quiz.tsx`**
- Trocar o import de `QuizWhatsAppRedirect` de volta para `QuizResult`
- Mudar o tipo `QuizStep` de `"whatsapp"` para `"result"`
- Alterar `handleAnalyzingComplete` para ir para `"result"`
- Renderizar `QuizResult` passando `result`, `score` e futuramente o número de WhatsApp

**2. `src/components/quiz/QuizResult.tsx`**
- Já existe e já tem o botão WhatsApp com mensagem por diagnóstico
- Atualizar as mensagens de WhatsApp para usar o mesmo formato do `QuizWhatsAppRedirect` (incluindo nome do usuário na mensagem)
- Receber `userName` como prop adicional para incluir na mensagem

**3. Kommo CRM**
- A integração com Kommo requer o webhook/API que você ainda vai fornecer
- Por enquanto, os dados do lead continuam sendo logados no console (nome, email, WhatsApp, respostas, pontuação, resultado)
- Quando você enviar os dados do Kommo, criaremos um edge function para enviar os leads automaticamente

### Resultado final
O usuário verá seu diagnóstico completo na página e terá um botão no final para iniciar conversa no WhatsApp com a mensagem correta para seu tipo de resultado.
