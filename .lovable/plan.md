

## Exportar CSV + Criar Usuario Admin

### 1. Criar usuario admin do CRM

Criar uma Edge Function temporaria ou usar a Edge Function existente para registrar o usuario admin com as credenciais fornecidas e atribuir a role "admin" na tabela `user_roles`.

**Abordagem:** Criar o usuario via `supabase.auth.admin.createUser()` usando o service role key em uma Edge Function, e inserir a role admin na tabela `user_roles`.

- Email: contato.thewhole@gmail.com
- Senha: Alicate2025@

**Arquivo: `supabase/functions/create-admin/index.ts`**
- Funcao unica para criar o usuario e atribuir role admin
- Usa service role key para criar usuario confirmado (sem necessidade de verificar email)
- Insere registro na tabela `user_roles` com role = 'admin'
- Sera invocada uma vez e depois pode ser removida

### 2. Adicionar exportacao CSV ao CRM

**Arquivo: `src/pages/CRM.tsx`**
- Adicionar botao "Exportar CSV" ao lado dos filtros
- Funcao `exportToCSV` que:
  - Pega os leads filtrados (respeitando busca e filtro ativo)
  - Gera string CSV com headers: Nome, Email, WhatsApp, Resultado, Pontuacao, Respostas, UTM Source, UTM Medium, UTM Campaign, Data
  - Cria um Blob e faz download automatico com nome `leads-YYYY-MM-DD.csv`
- Icone de download no botao (lucide-react `Download`)

### Secao tecnica

**Edge Function create-admin:**
```text
- Import createClient from @supabase/supabase-js
- Usa SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
- POST handler:
  1. supabase.auth.admin.createUser({ email, password, email_confirm: true })
  2. INSERT INTO user_roles (user_id, role) VALUES (new_user.id, 'admin')
  3. Retorna sucesso
- Funcao sera chamada uma vez para setup e pode ser deletada depois
```

**Funcao exportToCSV no CRM.tsx:**
```text
- Mapeia filteredLeads para linhas CSV
- Escapa campos com virgulas usando aspas duplas
- Adiciona BOM UTF-8 para Excel reconhecer acentos
- Cria link temporario com URL.createObjectURL e dispara click
```

### Ordem de implementacao

1. Criar Edge Function `create-admin`
2. Deploy e invocar para criar o usuario
3. Adicionar botao e funcao de exportar CSV ao CRM
4. Testar login com as credenciais e exportacao

