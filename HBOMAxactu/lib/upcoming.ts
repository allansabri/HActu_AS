import { supabasePublic } from "@/lib/supabase-public";
import { demoProductions } from "@/lib/demo-data";
import { slugify } from "@/lib/format";
import { ContentType, UpcomingRelease, UpcomingTrailer } from "@/lib/types";

export type UpcomingFilters = {
  q?: string | null;
  type?: ContentType | "all" | null;
  month?: string | null;
};

const now = "2026-06-04T10:00:00.000Z";

const demoTrailers: Record<string, UpcomingTrailer[]> = {
  "the-last-of-us-saison-3": [
    {
      id: "demo-trailer-tlou-teaser",
      release_id: "demo-upcoming-the-last-of-us",
      title: "Teaser officiel",
      url: "https://www.youtube.com/watch?v=uLtkt8BonwM",
      source_type: "youtube",
      sort_order: 0,
      created_at: now
    }
  ],
  "house-of-the-dragon-saison-3": [
    {
      id: "demo-trailer-hotd-s3",
      release_id: "demo-upcoming-house-of-the-dragon",
      title: "Bande-annonce",
      url: "https://www.youtube.com/watch?v=DotnJ7tTA34",
      source_type: "youtube",
      sort_order: 0,
      created_at: now
    }
  ]
};

export const demoUpcomingReleases: UpcomingRelease[] = demoProductions
  .filter((project) => project.status !== "Sorti")
  .map((project) => {
    const slug =
      project.title === "The Last of Us"
        ? "the-last-of-us-saison-3"
        : project.title === "House of the Dragon"
          ? "house-of-the-dragon-saison-3"
          : slugify(project.title);

    return {
      id: `demo-upcoming-${slug}`,
      title: project.title === "The Last of Us" ? "The Last of Us - Saison 3" : project.title === "House of the Dragon" ? "House of the Dragon - Saison 3" : project.title,
      slug,
      type: project.type,
      synopsis: project.synopsis,
      release_label: project.title === "The Last of Us" || project.title === "House of the Dragon" ? "Saison 3" : null,
      release_date: project.release_date_france || project.release_date_estimated,
      country: "France",
      genres: project.genres || [],
      platform: project.platform || "Max",
      poster_url: project.poster_url || project.image_url,
      banner_url: project.banner_url || project.image_url,
      tmdb_id: project.tmdb_id || null,
      tmdb_media_type: project.tmdb_media_type || null,
      source_url: project.source_url || null,
      created_at: project.created_at,
      updated_at: project.updated_at,
      upcoming_trailers: demoTrailers[slug] || []
    };
  });

function normalizeType(value?: string | null): ContentType | "all" {
  return value === "movie" || value === "series" || value === "documentary" || value === "special" ? value : "all";
}

function monthKey(date?: string | null) {
  return date ? date.slice(0, 7) : "";
}

export function currentMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function nextMonthKey(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year || 2026, (monthNumber || 1), 1));
  return date.toISOString().slice(0, 7);
}

export function monthLabel(month?: string | null) {
  if (!month) return "ce mois-ci";
  const [year, monthNumber] = month.split("-").map(Number);
  if (!year || !monthNumber) return "ce mois-ci";
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
    new Date(Date.UTC(year, monthNumber - 1, 1))
  );
}

function applyFilters(items: UpcomingRelease[], filters: UpcomingFilters) {
  const q = filters.q?.trim().toLowerCase();
  const type = normalizeType(filters.type);
  const month = filters.month;

  return items
    .filter((item) => (type === "all" ? true : item.type === type))
    .filter((item) => (month ? monthKey(item.release_date) === month : true))
    .filter((item) => {
      if (!q) return true;
      return [item.title, item.synopsis, item.genres?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => (a.release_date || "9999-12-31").localeCompare(b.release_date || "9999-12-31"));
}

export async function getUpcomingMonths(filters: Omit<UpcomingFilters, "month"> = {}) {
  const releases = await getUpcomingReleases({ ...filters, month: null });
  return Array.from(new Set(releases.map((item) => monthKey(item.release_date)).filter(Boolean))).sort();
}

function normalizeRelease(item: UpcomingRelease): UpcomingRelease {
  const trailers = (item.upcoming_trailers || [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return { ...item, upcoming_trailers: trailers };
}

export async function getUpcomingReleases(filters: UpcomingFilters = {}) {
  const { data, error } = await supabasePublic
    .from("upcoming_releases")
    .select("*, upcoming_trailers(*)")
    .order("release_date", { ascending: true, nullsFirst: false });

  const source = error || !data?.length ? demoUpcomingReleases : (data as UpcomingRelease[]).map(normalizeRelease);
  return applyFilters(source, filters);
}

export async function getUpcomingReleaseBySlug(slug: string) {
  const { data, error } = await supabasePublic
    .from("upcoming_releases")
    .select("*, upcoming_trailers(*)")
    .eq("slug", slug)
    .single();

  if (!error && data) return normalizeRelease(data as UpcomingRelease);
  return demoUpcomingReleases.find((item) => item.slug === slug) || null;
}
