create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text default '',
  email text default '',
  whatsapp text default '',
  answers jsonb,
  total_score integer,
  result_id text default '',
  result_title text default '',
  utm_source text default '',
  utm_medium text default '',
  utm_campaign text default '',
  utm_term text default '',
  utm_content text default ''
);

alter table public.leads enable row level security;

create policy "Allow anonymous inserts" on public.leads
  for insert with check (true);

create policy "Allow authenticated reads" on public.leads
  for select using (auth.role() = 'authenticated');
