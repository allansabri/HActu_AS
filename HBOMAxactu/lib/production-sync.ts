import { getTmdbProduction, searchTmdb, TmdbMediaType } from "@/lib/tmdb";
import { ContentType, ProductionProject, ProductionStatus } from "@/lib/types";

type SupabaseLike = {
  from: (table: string) => any;
};

type SyncSource = {
  label: string;
  query: string;
  platform: string;
  productionCompany: string;
};

export type ProductionSyncResult = {
  source: string;
  found: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export const productionSyncSources: SyncSource[] = [
  {
    label: "HBO",
    query: "HBO",
    platform: "Max",
    productionCompany: "HBO"
  },
  {
    label: "HBO Max",
    query: "HBO Max",
    platform: "Max",
    productionCompany: "HBO Max"
  },
  {
    label: "Warner Bros.",
    query: "Warner Bros",
    platform: "Max",
    productionCompany: "Warner Bros."
  }
];

function mediaTypeFromContentType(type: ContentType): TmdbMediaType | null {
  if (type === "movie") return "movie";
  if (type === "series") return "tv";
  return null;
}

function inferredStatus(releaseDate: string | null): ProductionStatus {
  if (!releaseDate) return "En développement";
  return new Date(releaseDate).getTime() <= Date.now() ? "Sorti" : "En développement";
}

function mergeStatus(existing?: ProductionProject | null, fallback?: ProductionStatus) {
  if (!existing?.status || existing.status === "upcoming" || existing.status === "available") {
    return fallback || "En développement";
  }
  return existing.status;
}

function mergeArray(existing?: string[] | null, incoming?: string[] | null) {
  return existing?.length ? existing : incoming || [];
}

async function findExistingProduction(supabase: SupabaseLike, tmdbId: number, mediaType: TmdbMediaType, title: string) {
  const byTmdb = await supabase
    .from("production_projects")
    .select("*")
    .eq("tmdb_id", tmdbId)
    .eq("tmdb_media_type", mediaType)
    .maybeSingle();

  if (byTmdb.data) return byTmdb.data as ProductionProject;

  const byTitle = await supabase
    .from("production_projects")
    .select("*")
    .ilike("title", title)
    .limit(1)
    .maybeSingle();

  return (byTitle.data || null) as ProductionProject | null;
}

function payloadFromTmdb(
  item: Awaited<ReturnType<typeof getTmdbProduction>>,
  mediaType: TmdbMediaType,
  source: SyncSource,
  existing?: ProductionProject | null
) {
  const posterUrl = existing?.poster_url || existing?.image_url || item.posterUrl;
  const releaseYear = item.releaseDate ? Number(item.releaseDate.slice(0, 4)) : existing?.release_year || null;
  const sourceNote = `Synchronisation TMDB ${source.label}. Les statuts de production precis (pre-production, tournage, post-production) doivent etre valides depuis une source production autorisee.`;

  return {
    title: item.title,
    type: item.type,
    status: mergeStatus(existing, inferredStatus(item.releaseDate)),
    production_label: existing?.production_label || (item.type === "series" && item.seasonCount ? `Saison ${item.seasonCount}` : source.label),
    synopsis: item.overview || existing?.synopsis || null,
    casting: mergeArray(existing?.casting, item.casting),
    director: existing?.director || item.director,
    release_date_estimated: existing?.release_date_estimated || item.releaseDate,
    release_date_france: existing?.release_date_france || item.releaseDate,
    release_year: releaseYear,
    episode_count: existing?.episode_count || item.episodeCount,
    genres: mergeArray(existing?.genres, item.genres),
    platform: existing?.platform || source.platform,
    poster_url: posterUrl,
    banner_url: existing?.banner_url || item.bannerUrl,
    tmdb_id: item.tmdbId,
    tmdb_media_type: mediaType,
    production_company: existing?.production_company || source.productionCompany,
    production_notes: existing?.production_notes || sourceNote,
    source_url: existing?.source_url || `https://www.themoviedb.org/${mediaType}/${item.tmdbId}`,
    image_url: posterUrl
  };
}

export async function syncTmdbProductions(supabase: SupabaseLike, maxPerSource = 8): Promise<ProductionSyncResult[]> {
  const results: ProductionSyncResult[] = [];

  for (const source of productionSyncSources) {
    const result: ProductionSyncResult = {
      source: source.label,
      found: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    try {
      const searchResults = await searchTmdb(source.query);
      const candidates = searchResults.slice(0, maxPerSource);
      result.found = candidates.length;

      for (const candidate of candidates) {
        const mediaType = mediaTypeFromContentType(candidate.type);
        if (!mediaType) {
          result.skipped += 1;
          continue;
        }

        try {
          const [details, existing] = await Promise.all([
            getTmdbProduction(mediaType, candidate.tmdbId),
            findExistingProduction(supabase, candidate.tmdbId, mediaType, candidate.title)
          ]);
          const payload = payloadFromTmdb(details, mediaType, source, existing);
          const query = existing?.id
            ? supabase.from("production_projects").update(payload).eq("id", existing.id)
            : supabase.from("production_projects").insert(payload);
          const { error } = await query;

          if (error) {
            result.errors.push(`${candidate.title}: ${error.message}`);
            continue;
          }

          if (existing?.id) result.updated += 1;
          else result.created += 1;
        } catch (error) {
          result.errors.push(`${candidate.title}: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
        }
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : "Erreur inconnue");
    }

    results.push(result);
  }

  return results;
}
