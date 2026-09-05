-- =========================================
-- HBO Max Actu — Schéma initial
-- =========================================

-- 1. ENUMS
create type public.app_role as enum ('admin', 'user');
create type public.article_status as enum ('draft', 'published');
create type public.content_type as enum ('movie', 'series');
create type public.production_status as enum (
  'En développement',
  'Pré-production',
  'En tournage',
  'Post-production',
  'Prêt à diffuser',
  'Sorti'
);

-- 2. PROFILES (lié à auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

-- 3. USER_ROLES (séparé pour éviter les escalades de privilèges)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);

-- Fonction security definer pour vérifier le rôle (évite la récursion RLS)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 4. ARTICLES
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  image_url text,
  youtube_video_url text,
  category text not null,
  status article_status not null default 'draft',
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index articles_status_published_at_idx
  on public.articles (status, published_at desc);
create index articles_category_idx on public.articles (category);

-- 5. PRODUCTION_PROJECTS
create table public.production_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type content_type not null,
  status production_status not null default 'En développement',
  production_label text,
  synopsis text,
  casting jsonb default '[]'::jsonb,
  director text,
  release_date_estimated date,
  release_date_france date,
  release_year int check (release_year between 1900 and 2200),
  next_episode_date date,
  season_number int,
  episode_count int,
  trailer_url text,
  genres jsonb default '[]'::jsonb,
  platform text default 'Max',
  poster_url text,
  banner_url text,
  tmdb_id int,
  tmdb_media_type text check (tmdb_media_type in ('movie', 'tv')),
  production_company text,
  showrunner text,
  writers jsonb default '[]'::jsonb,
  executive_producers jsonb default '[]'::jsonb,
  cinematography text,
  shooting_locations jsonb default '[]'::jsonb,
  filming_start_date date,
  filming_end_date date,
  production_notes text,
  source_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index production_release_idx
  on public.production_projects (release_date_estimated);

-- 6. TOP_10_FRANCE
create table public.top_10_france (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  type content_type not null,
  rank int not null check (rank between 1 and 10),
  title text not null,
  image_url text,
  created_at timestamptz not null default now(),
  unique (date, type, rank)
);
create index top10_date_idx on public.top_10_france (date desc, type, rank);

-- =========================================
-- TRIGGERS — updated_at
-- =========================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_articles_updated
  before update on public.articles
  for each row execute function public.set_updated_at();

create trigger trg_production_updated
  before update on public.production_projects
  for each row execute function public.set_updated_at();

-- Création auto du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================
alter table public.profiles            enable row level security;
alter table public.user_roles          enable row level security;
alter table public.articles            enable row level security;
alter table public.production_projects enable row level security;
alter table public.top_10_france       enable row level security;

-- PROFILES : chacun voit son profil, admin voit tout
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- USER_ROLES : lecture seule pour l'utilisateur concerné + admin
create policy "user_roles_select" on public.user_roles
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "user_roles_admin_write" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ARTICLES : tout le monde lit les publiés, admin gère tout
create policy "articles_public_read" on public.articles
  for select using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "articles_admin_all" on public.articles
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- PRODUCTION_PROJECTS : lecture publique, écriture admin
create policy "production_public_read" on public.production_projects
  for select using (true);
create policy "production_admin_all" on public.production_projects
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- TOP_10_FRANCE : lecture publique, écriture admin
create policy "top10_public_read" on public.top_10_france
  for select using (true);
create policy "top10_admin_all" on public.top_10_france
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
