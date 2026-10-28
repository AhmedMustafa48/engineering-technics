-- Hierarchy: Product (e.g. Power Transformer) → Items (e.g. Radiators) → Suppliers (the `brands` table).
-- Replaces the flat products/categories model from 0001. Run in the Supabase SQL editor.
-- WARNING: drops the old `products` and `categories` tables (they held only seed data).

drop table if exists public.item_suppliers cascade;
drop table if exists public.items cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;

-- Main products ---------------------------------------------------------------
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name            text not null,
  icon            text not null default 'Package',   -- lucide icon name
  summary         text not null default '',
  description     text not null default '',
  image           jsonb,                              -- { src, width, height, blurDataURL? }
  published       boolean not null default true,
  sort_order      int not null default 0,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Items that belong to a main product ------------------------------------------
create table public.items (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  slug        text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  description text not null default '',
  image       jsonb,                                  -- optional default, used when a supplier has no photo
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (product_id, slug)
);
create index items_product_idx on public.items (product_id);

-- Which suppliers/makers offer an item (many-to-many; supplier = row in public.brands).
-- `image` is that supplier's own photo of the item (their branding / logo printing).
create table public.item_suppliers (
  item_id    uuid not null references public.items(id) on delete cascade,
  brand_slug text not null references public.brands(slug) on update cascade on delete restrict,
  image      jsonb,                                   -- { src, width, height, blurDataURL? }
  sort_order int not null default 0,
  primary key (item_id, brand_slug)
);
create index item_suppliers_brand_idx on public.item_suppliers (brand_slug);

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger items_touch before update on public.items
  for each row execute function public.touch_updated_at();

-- Row level security -----------------------------------------------------------
alter table public.products       enable row level security;
alter table public.items          enable row level security;
alter table public.item_suppliers enable row level security;

create policy "products read"  on public.products for select using (published or public.is_admin());
create policy "items read"     on public.items for select using (
  public.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.published)
);
create policy "item_suppliers read" on public.item_suppliers for select using (true);

create policy "products admin write"       on public.products       for all using (public.is_admin()) with check (public.is_admin());
create policy "items admin write"          on public.items          for all using (public.is_admin()) with check (public.is_admin());
create policy "item_suppliers admin write" on public.item_suppliers for all using (public.is_admin()) with check (public.is_admin());

-- Make the API pick up the new tables immediately.
notify pgrst, 'reload schema';
