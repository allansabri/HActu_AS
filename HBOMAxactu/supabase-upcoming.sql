create table if not exists public.upcoming_releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type text not null default 'series' check (type in ('movie', 'series', 'documentary', 'special')),
  synopsis text,
  release_label text,
  release_date date,
  country text default 'France',
  genres text[] default '{}',
  platform text default 'Max',
  poster_url text,
  banner_url text,
  tmdb_id integer,
  tmdb_media_type text check (tmdb_media_type in ('movie', 'tv') or tmdb_media_type is null),
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tmdb_id, tmdb_media_type)
);

create table if not exists public.upcoming_trailers (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.upcoming_releases(id) on delete cascade,
  title text not null,
  url text not null,
  source_type text not null default 'youtube' check (source_type in ('youtube', 'm3u', 'video', 'embed')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists upcoming_releases_release_date_idx on public.upcoming_releases(release_date);
create index if not exists upcoming_releases_type_idx on public.upcoming_releases(type);
create index if not exists upcoming_trailers_release_id_idx on public.upcoming_trailers(release_id);

alter table public.upcoming_releases add column if not exists release_label text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_upcoming_releases_updated_at on public.upcoming_releases;
create trigger set_upcoming_releases_updated_at
before update on public.upcoming_releases
for each row execute function public.set_updated_at();

alter table public.upcoming_releases enable row level security;
alter table public.upcoming_trailers enable row level security;

drop policy if exists "Public read upcoming releases" on public.upcoming_releases;
create policy "Public read upcoming releases"
on public.upcoming_releases for select
using (true);

drop policy if exists "Public read upcoming trailers" on public.upcoming_trailers;
create policy "Public read upcoming trailers"
on public.upcoming_trailers for select
using (true);

drop policy if exists "Admin write upcoming releases" on public.upcoming_releases;
create policy "Admin write upcoming releases"
on public.upcoming_releases for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admin write upcoming trailers" on public.upcoming_trailers;
create policy "Admin write upcoming trailers"
on public.upcoming_trailers for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
