

## Ajuste de responsividade da pagina de resultado no mobile

### Problema
O botao "Quero ajustar meu posicionamento agora" esta transbordando a tela em dispositivos mobile devido ao padding fixo (`px-12`) e texto largo sem quebra de linha.

### Solucao

**Arquivo: `src/components/quiz/QuizResult.tsx`**

Ajustes no botao CTA:
- Trocar `px-12` por `px-6 sm:px-12` para reduzir padding no mobile
- Adicionar `w-full sm:w-auto` para o botao ocupar 100% da largura no mobile e voltar ao tamanho natural no desktop
- Remover `whitespace-nowrap` (herdado do buttonVariants) adicionando `whitespace-normal` para permitir quebra de texto no mobile
- Ajustar fonte: `text-base sm:text-lg` em vez de `text-lg`

Ajustes no container do botao:
- Adicionar `px-2 sm:px-0` ao wrapper `div` do botao para garantir margem lateral no mobile

Essas mudancas garantem que o botao se adapte a telas pequenas sem transbordar, mantendo a aparencia no desktop.

