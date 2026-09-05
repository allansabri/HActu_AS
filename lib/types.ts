export type ArticleStatus = "draft" | "published" | "scheduled";
export type ContentType = "movie" | "series" | "documentary" | "special" | "sport";
export type UpcomingTrailerSource = "youtube" | "m3u" | "video" | "embed";
export type ProductionStatus =
  | "available"
  | "upcoming"
  | "ended"
  | "cancelled"
  | "En développement"
  | "Pré-production"
  | "En tournage"
  | "Post-production"
  | "Prêt à diffuser"
  | "Sorti";

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  youtube_video_url: string | null;
  category: string;
  status: ArticleStatus;
  author_id: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  related_content?: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductionProject = {
  id: string;
  title: string;
  type: ContentType;
  status: ProductionStatus;
  production_label?: string | null;
  synopsis: string | null;
  casting: string[] | null;
  director: string | null;
  release_date_estimated: string | null;
  release_date_france?: string | null;
  release_year?: number | null;
  next_episode_date?: string | null;
  season_number?: number | null;
  episode_count?: number | null;
  trailer_url?: string | null;
  genres?: string[] | null;
  platform?: string | null;
  poster_url?: string | null;
  banner_url?: string | null;
  tmdb_id?: number | null;
  tmdb_media_type?: "movie" | "tv" | null;
  production_company?: string | null;
  showrunner?: string | null;
  writers?: string[] | null;
  executive_producers?: string[] | null;
  cinematography?: string | null;
  shooting_locations?: string[] | null;
  filming_start_date?: string | null;
  filming_end_date?: string | null;
  production_notes?: string | null;
  source_url?: string | null;
  imdb_id?: string | null;
  original_title?: string | null;
  runtime_minutes?: number | null;
  content_rating?: string | null;
  country_of_origin?: string | null;
  languages?: string[] | null;
  technical_details?: Record<string, string> | null;
  official_links?: Array<{ label: string; url: string }> | null;
  trivia?: string[] | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Top10Item = {
  id: string;
  date: string;
  type: ContentType;
  rank: number;
  title: string;
  image_url: string | null;
  created_at: string;
};

export type AdminMediaItem = {
  id: string;
  title: string;
  url: string;
  media_type: "image" | "video" | "poster" | "banner" | "logo" | "thumbnail";
  folder: string | null;
  tags: string[] | null;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  status: string;
  interests: string[] | null;
  created_at: string;
};

export type AdminRedirection = {
  id: string;
  from_url: string;
  to_url: string;
  redirect_type: 301 | 302;
  active: boolean;
  created_at: string;
};

export type AdminCollection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type UpcomingTrailer = {
  id: string;
  release_id: string;
  title: string;
  url: string;
  source_type: UpcomingTrailerSource;
  sort_order: number;
  created_at: string;
};

export type UpcomingRelease = {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  synopsis: string | null;
  release_label: string | null;
  release_date: string | null;
  release_time?: string | null;
  country: string | null;
  genres: string[] | null;
  platform: string | null;
  poster_url: string | null;
  banner_url: string | null;
  tmdb_id: number | null;
  tmdb_media_type: "movie" | "tv" | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  upcoming_trailers?: UpcomingTrailer[];
};

export type ProductionCompany = {
  id: string;
  name: string;
  slug: string;
  company_type: string | null;
  country: string | null;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  imdb_id: string | null;
  source_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProductionCompanyContact = {
  id: string;
  company_id: string;
  label: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  sort_order: number;
};

export type ProductionCompanySection = {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  project_count?: number;
};

export type ProductionCredit = {
  id: string;
  project_id: string;
  imdb_person_id: string | null;
  tmdb_person_id: number | null;
  name: string;
  department: string;
  job: string | null;
  character_name: string | null;
  profile_url: string | null;
  episode_count: number | null;
  years: string | null;
  known_for: string | null;
  sort_order: number;
};

export type ProductionMedia = {
  id: string;
  project_id: string;
  media_type: string;
  title: string | null;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  credit: string | null;
  sort_order: number;
};

export type ProductionEpisode = {
  id: string;
  project_id: string;
  imdb_id: string | null;
  tmdb_id: number | null;
  season_number: number;
  episode_number: number;
  title: string | null;
  synopsis: string | null;
  air_date: string | null;
  image_url: string | null;
};

export type ProductionStatusHistory = {
  id: string;
  project_id: string;
  status: string;
  status_date: string | null;
  details: string | null;
  sort_order: number;
};

export type ProductionProjectPro = {
  project: ProductionProject;
  companies: ProductionCompany[];
  contacts: ProductionCompanyContact[];
  credits: ProductionCredit[];
  media: ProductionMedia[];
  episodes: ProductionEpisode[];
  statusHistory: ProductionStatusHistory[];
};
