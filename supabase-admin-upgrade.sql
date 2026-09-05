-- Upgrade back-office fonctionnel.
-- À exécuter une fois dans Supabase SQL editor si les tables/champs n'existent pas encore.

alter type public.article_status add value if not exists 'scheduled';
alter type public.content_type add value if not exists 'documentary';
alter type public.content_type add value if not exists 'special';
alter type public.production_status add value if not exists 'available';
alter type public.production_status add value if not exists 'upcoming';
alter type public.production_status add value if not exists 'ended';
alter type public.production_status add value if not exists 'cancelled';
alter type public.production_status add value if not exists 'Prêt à diffuser';

alter table public.articles
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists related_content text;

alter table public.production_projects
  add column if not exists release_date_france date,
  add column if not exists release_year int check (release_year between 1900 and 2200),
  add column if not exists next_episode_date date,
  add column if not exists season_number int,
  add column if not exists episode_count int,
  add column if not exists trailer_url text,
  add column if not exists genres jsonb default '[]'::jsonb,
  add column if not exists platform text default 'Max',
  add column if not exists poster_url text,
  add column if not exists banner_url text,
  add column if not exists production_label text,
  add column if not exists tmdb_id int,
  add column if not exists tmdb_media_type text check (tmdb_media_type in ('movie', 'tv')),
  add column if not exists production_company text,
  add column if not exists showrunner text,
  add column if not exists writers jsonb default '[]'::jsonb,
  add column if not exists executive_producers jsonb default '[]'::jsonb,
  add column if not exists cinematography text,
  add column if not exists shooting_locations jsonb default '[]'::jsonb,
  add column if not exists filming_start_date date,
  add column if not exists filming_end_date date,
  add column if not exists production_notes text,
  add column if not exists source_url text;

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  media_type text not null default 'image',
  folder text,
  tags jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active',
  interests jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  content text not null,
  status text not null default 'draft',
  opens int not null default 0,
  clicks int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.redirections (
  id uuid primary key default gen_random_uuid(),
  from_url text not null unique,
  to_url text not null,
  redirect_type int not null default 301 check (redirect_type in (301, 302)),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_visits (
  id uuid primary key default gen_random_uuid(),
  path text,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_page_views (
  id uuid primary key default gen_random_uuid(),
  path text,
  created_at timestamptz not null default now()
);

create table if not exists public.article_reads (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_clicks (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.newsletter_campaigns(id) on delete cascade,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.internal_searches (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  created_at timestamptz not null default now()
);

alter table public.media_library enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_campaigns enable row level security;
alter table public.redirections enable row level security;
alter table public.site_settings enable row level security;
alter table public.analytics_visits enable row level security;
alter table public.analytics_page_views enable row level security;
alter table public.article_reads enable row level security;
alter table public.newsletter_clicks enable row level security;
alter table public.internal_searches enable row level security;

drop policy if exists "admin_media_all" on public.media_library;
create policy "admin_media_all" on public.media_library for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_collections_all" on public.collections;
create policy "admin_collections_all" on public.collections for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
drop policy if exists "collections_public_read" on public.collections;
create policy "collections_public_read" on public.collections for select using (true);

drop policy if exists "admin_collection_items_all" on public.collection_items;
create policy "admin_collection_items_all" on public.collection_items for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_newsletter_subscribers_all" on public.newsletter_subscribers;
create policy "admin_newsletter_subscribers_all" on public.newsletter_subscribers for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
create policy "newsletter_public_insert" on public.newsletter_subscribers for insert with check (true);
drop policy if exists "newsletter_public_update_self" on public.newsletter_subscribers;
create policy "newsletter_public_update_self" on public.newsletter_subscribers for update using (true) with check (true);

drop policy if exists "admin_newsletter_campaigns_all" on public.newsletter_campaigns;
create policy "admin_newsletter_campaigns_all" on public.newsletter_campaigns for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_redirections_all" on public.redirections;
create policy "admin_redirections_all" on public.redirections for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_site_settings_all" on public.site_settings;
create policy "admin_site_settings_all" on public.site_settings for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_analytics_select" on public.analytics_visits;
create policy "admin_analytics_select" on public.analytics_visits for select using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_page_views_select" on public.analytics_page_views;
create policy "admin_page_views_select" on public.analytics_page_views for select using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_article_reads_select" on public.article_reads;
create policy "admin_article_reads_select" on public.article_reads for select using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_newsletter_clicks_select" on public.newsletter_clicks;
create policy "admin_newsletter_clicks_select" on public.newsletter_clicks for select using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin_internal_searches_select" on public.internal_searches;
create policy "admin_internal_searches_select" on public.internal_searches for select using (public.has_role(auth.uid(), 'admin'));
