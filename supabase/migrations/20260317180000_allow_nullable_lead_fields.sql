-- Allow name, email, whatsapp to be empty since fields can be skipped in quiz
ALTER TABLE public.leads ALTER COLUMN name SET DEFAULT '';
ALTER TABLE public.leads ALTER COLUMN name DROP NOT NULL;

ALTER TABLE public.leads ALTER COLUMN email SET DEFAULT '';
ALTER TABLE public.leads ALTER COLUMN email DROP NOT NULL;

ALTER TABLE public.leads ALTER COLUMN whatsapp SET DEFAULT '';
ALTER TABLE public.leads ALTER COLUMN whatsapp DROP NOT NULL;
