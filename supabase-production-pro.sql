-- Extension du module Productions pour les fiches type IMDbPro.
-- À exécuter dans Supabase SQL Editor.

create table if not exists public.production_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  company_type text,
  country text,
  logo_url text,
  website text,
  description text,
  imdb_id text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.production_company_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.production_companies(id) on delete cascade,
  label text,
  city text,
  country text,
  website text,
  email text,
  phone text,
  address text,
  sort_order int not null default 0
);

create table if not exists public.production_project_companies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  company_id uuid not null references public.production_companies(id) on delete cascade,
  role text not null default 'Production',
  unique(project_id, company_id, role)
);

create table if not exists public.production_company_sections (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.production_companies(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, slug)
);

create table if not exists public.production_company_section_projects (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.production_company_sections(id) on delete cascade,
  project_id uuid not null references public.production_projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(section_id, project_id)
);

create table if not exists public.production_credits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  imdb_person_id text,
  tmdb_person_id int,
  name text not null,
  department text not null default 'cast',
  job text,
  character_name text,
  profile_url text,
  episode_count int,
  years text,
  known_for text,
  sort_order int not null default 0
);

create table if not exists public.production_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  media_type text not null default 'image',
  title text,
  url text not null,
  thumbnail_url text,
  caption text,
  credit text,
  sort_order int not null default 0
);

create table if not exists public.production_episodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  imdb_id text,
  tmdb_id int,
  season_number int not null,
  episode_number int not null,
  title text,
  synopsis text,
  air_date date,
  image_url text,
  unique(project_id, season_number, episode_number)
);

create table if not exists public.production_status_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  status text not null,
  status_date date,
  details text,
  sort_order int not null default 0
);

create table if not exists public.production_filming_periods (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  start_date date,
  end_date date,
  details text
);

create table if not exists public.production_release_details (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  country text,
  alternate_title text,
  release_date date,
  details text
);

create table if not exists public.production_awards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.production_projects(id) on delete cascade,
  year int,
  organization text,
  award text,
  category text,
  result text,
  recipient text
);

alter table public.production_projects
  add column if not exists imdb_id text,
  add column if not exists original_title text,
  add column if not exists runtime_minutes int,
  add column if not exists content_rating text,
  add column if not exists country_of_origin text,
  add column if not exists languages jsonb default '[]'::jsonb,
  add column if not exists technical_details jsonb default '{}'::jsonb,
  add column if not exists official_links jsonb default '[]'::jsonb,
  add column if not exists trivia jsonb default '[]'::jsonb;

create index if not exists production_company_slug_idx on public.production_companies(slug);
create index if not exists production_company_sections_company_idx on public.production_company_sections(company_id, sort_order);
create index if not exists production_company_section_projects_section_idx on public.production_company_section_projects(section_id);
create index if not exists production_credits_project_idx on public.production_credits(project_id, department);
create index if not exists production_media_project_idx on public.production_media(project_id, media_type);
create index if not exists production_episodes_project_idx on public.production_episodes(project_id, season_number, episode_number);

alter table public.production_companies enable row level security;
alter table public.production_company_contacts enable row level security;
alter table public.production_project_companies enable row level security;
alter table public.production_company_sections enable row level security;
alter table public.production_company_section_projects enable row level security;
alter table public.production_credits enable row level security;
alter table public.production_media enable row level security;
alter table public.production_episodes enable row level security;
alter table public.production_status_history enable row level security;
alter table public.production_filming_periods enable row level security;
alter table public.production_release_details enable row level security;
alter table public.production_awards enable row level security;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'production_companies',
    'production_company_contacts',
    'production_project_companies',
    'production_company_sections',
    'production_company_section_projects',
    'production_credits',
    'production_media',
    'production_episodes',
    'production_status_history',
    'production_filming_periods',
    'production_release_details',
    'production_awards'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', table_name || '_public_read', table_name);
    execute format('create policy %I on public.%I for select using (true)', table_name || '_public_read', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_admin_all', table_name);
    execute format(
      'create policy %I on public.%I for all using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))',
      table_name || '_admin_all',
      table_name
    );
  end loop;
end $$;

insert into public.production_companies (name, slug, company_type, country, website)
values
  ('HBO', 'hbo', 'Diffuseur / société de production', 'États-Unis', 'https://www.hbo.com'),
  ('Max', 'max', 'Plateforme de streaming', 'États-Unis', 'https://www.max.com'),
  ('Warner Bros.', 'warner-bros', 'Studio / distributeur', 'États-Unis', 'https://www.warnerbros.com')
on conflict (slug) do nothing;
