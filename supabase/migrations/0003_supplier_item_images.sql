-- Each supplier's own photo of an item (their branding / logo printing).
-- Safe to run more than once. (0002 already includes this column for fresh installs.)
alter table public.item_suppliers add column if not exists image jsonb;

notify pgrst, 'reload schema';
