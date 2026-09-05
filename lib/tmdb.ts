import { ContentType } from "@/lib/types";

const tmdbBaseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

export type TmdbMediaType = "movie" | "tv";

type TmdbSearchItem = {
  id: number;
  media_type: TmdbMediaType;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
};

type TmdbCredit = {
  id?: number;
  name: string;
  character?: string;
  job?: string;
  order?: number;
  profile_path?: string | null;
};

type TmdbDetails = TmdbSearchItem & {
  tagline?: string;
  backdrop_path?: string | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: TmdbSeason[];
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  credits?: {
    cast?: TmdbCredit[];
    crew?: TmdbCredit[];
  };
  created_by?: TmdbCredit[];
};

export type TmdbSearchResult = {
  tmdbId: number;
  title: string;
  originalTitle: string;
  type: ContentType;
  releaseDate: string | null;
  posterUrl: string | null;
  overview: string | null;
};

export type TmdbProductionImport = TmdbSearchResult & {
  casting: string[];
  director: string | null;
  bannerUrl: string | null;
  genres: string[];
  seasonCount: number | null;
  episodeCount: number | null;
};

export type TmdbPoster = {
  url: string;
  language: string | null;
  voteAverage: number;
};

type TmdbImage = {
  file_path: string;
  iso_639_1: string | null;
  vote_average: number;
};

type TmdbSeason = {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
};

type TmdbPersonDetails = {
  id: number;
  name: string;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string | null;
  combined_credits?: {
    cast?: Array<TmdbSearchItem & { character?: string; media_type: TmdbMediaType }>;
    crew?: Array<TmdbSearchItem & { job?: string; media_type: TmdbMediaType }>;
  };
};

export type TmdbPersonCredit = TmdbSearchResult & {
  role: string | null;
};

export type TmdbPerson = {
  id: number;
  name: string;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  profileUrl: string | null;
  knownForDepartment: string | null;
  credits: TmdbPersonCredit[];
};

export type TmdbTitleCredit = {
  id: number;
  name: string;
  role: string | null;
  profileUrl: string | null;
};

export type TmdbTitleSeason = {
  id: number;
  name: string;
  overview: string | null;
  seasonNumber: number;
  episodeCount: number;
  airDate: string | null;
  posterUrl: string | null;
};

export type TmdbTitleDetails = TmdbSearchResult & {
  tagline: string | null;
  backdropUrl: string | null;
  genres: string[];
  runtime: number | null;
  status: string | null;
  seasonCount: number | null;
  episodeCount: number | null;
  seasons: TmdbTitleSeason[];
  cast: TmdbTitleCredit[];
  crew: TmdbTitleCredit[];
};

function getTmdbAuth() {
  const bearer = process.env.TMDB_BEARER_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (!bearer && !apiKey) {
    throw new Error("Ajoute TMDB_API_KEY ou TMDB_BEARER_TOKEN dans .env.local");
  }

  return { bearer, apiKey };
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}) {
  const { bearer, apiKey } = getTmdbAuth();
  const url = new URL(`${tmdbBaseUrl}${path}`);

  url.searchParams.set("language", "fr-FR");
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  if (!bearer && apiKey) url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, {
    headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined,
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Erreur TMDB ${response.status}`);
  }

  return (await response.json()) as T;
}

function posterUrl(path?: string | null) {
  return path ? `${imageBaseUrl}${path}` : null;
}

function backdropUrl(path?: string | null) {
  return path ? `https://image.tmdb.org/t/p/w1280${path}` : null;
}

function profileUrl(path?: string | null) {
  return path ? `${imageBaseUrl}${path}` : null;
}

function mapType(mediaType: TmdbMediaType): ContentType {
  return mediaType === "movie" ? "movie" : "series";
}

function mapSearchItem(item: TmdbSearchItem): TmdbSearchResult {
  return {
    tmdbId: item.id,
    title: item.title || item.name || "Sans titre",
    originalTitle: item.original_title || item.original_name || item.title || item.name || "Sans titre",
    type: mapType(item.media_type),
    releaseDate: item.release_date || item.first_air_date || null,
    posterUrl: posterUrl(item.poster_path),
    overview: item.overview || null
  };
}

export async function searchTmdb(query: string) {
  const data = await tmdbFetch<{ results: TmdbSearchItem[] }>("/search/multi", {
    query,
    include_adult: "false",
    page: "1"
  });

  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 8)
    .map(mapSearchItem);
}

export async function findTmdbTitle(type: ContentType, title: string) {
  const mediaType: TmdbMediaType = type === "series" ? "tv" : "movie";
  const path = mediaType === "movie" ? "/search/movie" : "/search/tv";
  const data = await tmdbFetch<{ results: TmdbSearchItem[] }>(path, {
    query: title,
    include_adult: "false",
    page: "1"
  });
  const first = data.results[0];
  return first ? mapSearchItem({ ...first, media_type: mediaType }) : null;
}

export async function getTmdbTitleDetails(mediaType: TmdbMediaType, id: number): Promise<TmdbTitleDetails> {
  const details = await tmdbFetch<TmdbDetails>(`/${mediaType}/${id}`, {
    append_to_response: "credits"
  });
  const base = mapSearchItem({ ...details, media_type: mediaType });
  const cast = (details.credits?.cast || [])
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, 18)
    .map((person) => ({
      id: person.id || 0,
      name: person.name,
      role: person.character || null,
      profileUrl: profileUrl(person.profile_path)
    }))
    .filter((person) => person.id && person.name);
  const crew = (details.credits?.crew || [])
    .filter((person) => ["Director", "Creator", "Writer", "Executive Producer", "Screenplay"].includes(person.job || ""))
    .slice(0, 12)
    .map((person) => ({
      id: person.id || 0,
      name: person.name,
      role: person.job || null,
      profileUrl: profileUrl(person.profile_path)
    }))
    .filter((person) => person.id && person.name);

  return {
    ...base,
    tagline: details.tagline || null,
    backdropUrl: backdropUrl(details.backdrop_path),
    genres: details.genres?.map((genre) => genre.name).filter(Boolean) || [],
    runtime: mediaType === "movie" ? details.runtime || null : details.episode_run_time?.[0] || null,
    status: details.status || null,
    seasonCount: mediaType === "tv" ? details.number_of_seasons || null : null,
    episodeCount: mediaType === "tv" ? details.number_of_episodes || null : null,
    seasons: (details.seasons || [])
      .filter((season) => season.season_number > 0)
      .map((season) => ({
        id: season.id,
        name: season.name,
        overview: season.overview || null,
        seasonNumber: season.season_number,
        episodeCount: season.episode_count,
        airDate: season.air_date,
        posterUrl: posterUrl(season.poster_path)
      })),
    cast,
    crew
  };
}

export async function getTmdbProduction(mediaType: TmdbMediaType, id: number): Promise<TmdbProductionImport> {
  const details = await tmdbFetch<TmdbDetails>(`/${mediaType}/${id}`, {
    append_to_response: "credits"
  });
  const base = mapSearchItem({ ...details, media_type: mediaType });
  const cast = details.credits?.cast
    ?.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, 8)
    .map((person) => person.name)
    .filter(Boolean);

  const crew = details.credits?.crew || [];
  const movieDirector = crew.find((person) => person.job === "Director")?.name;
  const tvCreators = details.created_by?.map((person) => person.name).filter(Boolean) || [];
  const tvFallback = crew
    .filter((person) => ["Creator", "Director", "Writer", "Executive Producer"].includes(person.job || ""))
    .map((person) => person.name)
    .filter(Boolean);
  const director =
    mediaType === "movie"
      ? movieDirector || null
      : Array.from(new Set([...tvCreators, ...tvFallback])).slice(0, 4).join(", ") || null;

  return {
    ...base,
    casting: cast || [],
    director,
    bannerUrl: backdropUrl(details.backdrop_path),
    genres: details.genres?.map((genre) => genre.name).filter(Boolean) || [],
    seasonCount: mediaType === "tv" ? details.number_of_seasons || null : null,
    episodeCount: mediaType === "tv" ? details.number_of_episodes || null : null
  };
}

export async function getTmdbPosters(mediaType: TmdbMediaType, id: number): Promise<TmdbPoster[]> {
  const data = await tmdbFetch<{ posters: TmdbImage[] }>(`/${mediaType}/${id}/images`, {
    include_image_language: "fr,en,null"
  });

  return data.posters
    .filter((poster) => poster.file_path)
    .sort((a, b) => {
      const languageScore = (image: TmdbImage) => (image.iso_639_1 === "fr" ? 0 : image.iso_639_1 === "en" ? 1 : 2);
      return languageScore(a) - languageScore(b) || b.vote_average - a.vote_average;
    })
    .slice(0, 12)
    .map((poster) => ({
      url: posterUrl(poster.file_path) || "",
      language: poster.iso_639_1,
      voteAverage: poster.vote_average
    }));
}

export async function getTmdbPerson(id: number): Promise<TmdbPerson> {
  const person = await tmdbFetch<TmdbPersonDetails>(`/person/${id}`, {
    append_to_response: "combined_credits"
  });
  const cast = (person.combined_credits?.cast || []).map((credit) => ({
    ...mapSearchItem(credit),
    role: credit.character || null
  }));
  const crew = (person.combined_credits?.crew || []).map((credit) => ({
    ...mapSearchItem(credit),
    role: credit.job || null
  }));
  const credits = [...cast, ...crew]
    .filter((credit, index, list) => list.findIndex((item) => item.tmdbId === credit.tmdbId && item.type === credit.type) === index)
    .sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""))
    .slice(0, 30);

  return {
    id: person.id,
    name: person.name,
    biography: person.biography,
    birthday: person.birthday,
    deathday: person.deathday,
    placeOfBirth: person.place_of_birth,
    profileUrl: profileUrl(person.profile_path),
    knownForDepartment: person.known_for_department,
    credits
  };
}
