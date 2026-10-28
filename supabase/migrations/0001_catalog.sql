-- Engineering Technics catalogue: categories, brands, products, admins, image storage.
-- Run in the Supabase SQL editor (or `supabase db push`).

create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  icon        text not null default 'Package',
  description text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.brands (
  slug        text primary key,
  name        text not null,
  full_name   text,
  logo        jsonb,            -- { src, width, height, blurDataURL? } | null
  country     text,
  description text not null default '',
  contact     jsonb,            -- { email, phone, whatsapp } | null
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name           text not null,
  brand_slug     text not null references public.brands(slug) on update cascade on delete restrict,
  category_slug  text not null references public.categories(slug) on update cascade on delete restrict,
  summary        text not null default '',
  description    text not null default '',
  highlights     text[] not null default '{}',
  specs          jsonb  not null default '[]',   -- [{ label, value }]
  tables         jsonb  not null default '[]',   -- [{ title, columns[], rows[][], note? }]
  models         text[] not null default '{}',
  standards      text[] not null default '{}',
  images         jsonb  not null default '[]',   -- [{ src, width, height, blurDataURL?, alt? }]
  featured       boolean not null default false,
  published      boolean not null default true,
  catalogue_page int,
  contact        jsonb,
  seo_title      text,
  seo_description text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_brand_idx    on public.products (brand_slug);
create index if not exists products_published_idx on public.products (published);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- Admins: add a user's id here (after they sign up in Supabase Auth) to grant access.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Row level security -----------------------------------------------------------
alter table public.categories enable row level security;
alter table public.brands     enable row level security;
alter table public.products   enable row level security;
alter table public.admins     enable row level security;

drop policy if exists "categories read" on public.categories;
create policy "categories read"  on public.categories for select using (true);
drop policy if exists "brands read" on public.brands;
create policy "brands read"      on public.brands     for select using (true);
drop policy if exists "products read published" on public.products;
create policy "products read published" on public.products for select using (published or public.is_admin());

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "brands admin write" on public.brands;
create policy "brands admin write"     on public.brands     for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write"   on public.products   for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins self read" on public.admins;
create policy "admins self read"       on public.admins     for select using (user_id = auth.uid());

-- Storage: public bucket for product & brand images --------------------------------
insert into storage.buckets (id, name, public)
values ('catalog', 'catalog', true)
on conflict (id) do nothing;

drop policy if exists "catalog images public read" on storage.objects;
create policy "catalog images public read" on storage.objects
  for select using (bucket_id = 'catalog');
drop policy if exists "catalog images admin write" on storage.objects;
create policy "catalog images admin write" on storage.objects
  for all using (bucket_id = 'catalog' and public.is_admin())
  with check (bucket_id = 'catalog' and public.is_admin());
