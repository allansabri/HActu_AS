"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { slugify, todayIso } from "@/lib/format";
import { createClient } from "@/lib/supabase-server";
import { findTmdbTitle, getTmdbPosters, getTmdbProduction, searchTmdb, TmdbMediaType, TmdbPoster, TmdbSearchResult } from "@/lib/tmdb";
import { syncTmdbProductions } from "@/lib/production-sync";
import { ContentType, ProductionStatus, UpcomingTrailerSource } from "@/lib/types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function list(formData: FormData, key: string) {
  return (text(formData, key) || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => (typeof value === "string" ? value.trim() : ""));
}

function articlePayload(formData: FormData, authorId: string) {
  const title = text(formData, "title") || "";
  const slug = text(formData, "slug") || slugify(title);
  const status = (text(formData, "status") || "draft") as "draft" | "published" | "scheduled";

  return {
    title,
    slug,
    content: text(formData, "content") || "",
    excerpt: text(formData, "excerpt"),
    image_url: text(formData, "image_url"),
    youtube_video_url: text(formData, "youtube_video_url"),
    category: text(formData, "category") || "Actualités",
    status,
    author_id: authorId,
    seo_title: text(formData, "seo_title"),
    seo_description: text(formData, "seo_description"),
    related_content: text(formData, "related_content"),
    published_at: status === "published" || status === "scheduled" ? text(formData, "published_at") || new Date().toISOString() : null
  };
}

function basicArticlePayload(payload: ReturnType<typeof articlePayload>) {
  const { seo_title, seo_description, related_content, ...basic } = payload;
  return basic;
}

function redirectWithAdminMessage(path: string, message: string, isError = false): never {
  const params = new URLSearchParams();
  params.set(isError ? "error" : "ok", message);
  redirect(`${path}?${params.toString()}`);
}

export async function createArticle(formData: FormData) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const payload = articlePayload(formData, user.id);
  let { error } = await supabase.from("articles").insert(payload);
  if (error?.message.includes("seo_") || error?.message.includes("related_content")) {
    const retry = await supabase.from("articles").insert(basicArticlePayload(payload));
    error = retry.error;
  }
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/actualites");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const payload = articlePayload(formData, user.id);
  let { error } = await supabase.from("articles").update(payload).eq("id", id);
  if (error?.message.includes("seo_") || error?.message.includes("related_content")) {
    const retry = await supabase.from("articles").update(basicArticlePayload(payload)).eq("id", id);
    error = retry.error;
  }
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/actualites");
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/actualites");
}

export async function upsertProduction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = text(formData, "id");
  const posterUrl = text(formData, "poster_url") || text(formData, "image_url");

  const payload = {
    title: text(formData, "title") || "",
    type: (text(formData, "type") || "series") as ContentType,
    status: (text(formData, "status") || "upcoming") as ProductionStatus,
    production_label: text(formData, "production_label"),
    synopsis: text(formData, "synopsis"),
    casting: list(formData, "casting"),
    director: text(formData, "director"),
    release_date_estimated: text(formData, "release_date_estimated") || text(formData, "release_date_france"),
    release_date_france: text(formData, "release_date_france"),
    release_year: Number(text(formData, "release_year")) || null,
    next_episode_date: text(formData, "next_episode_date"),
    season_number: Number(text(formData, "season_number")) || null,
    episode_count: Number(text(formData, "episode_count")) || null,
    trailer_url: text(formData, "trailer_url"),
    genres: list(formData, "genres"),
    platform: text(formData, "platform") || "Max",
    poster_url: posterUrl,
    banner_url: text(formData, "banner_url"),
    tmdb_id: Number(text(formData, "tmdb_id")) || null,
    tmdb_media_type: text(formData, "tmdb_media_type"),
    production_company: text(formData, "production_company"),
    showrunner: text(formData, "showrunner"),
    writers: list(formData, "writers"),
    executive_producers: list(formData, "executive_producers"),
    cinematography: text(formData, "cinematography"),
    shooting_locations: list(formData, "shooting_locations"),
    filming_start_date: text(formData, "filming_start_date"),
    filming_end_date: text(formData, "filming_end_date"),
    production_notes: text(formData, "production_notes"),
    source_url: text(formData, "source_url"),
    imdb_id: text(formData, "imdb_id"),
    original_title: text(formData, "original_title"),
    runtime_minutes: Number(text(formData, "runtime_minutes")) || null,
    content_rating: text(formData, "content_rating"),
    country_of_origin: text(formData, "country_of_origin"),
    languages: list(formData, "languages"),
    technical_details: (() => {
      const raw = text(formData, "technical_details");
      if (!raw) return {};
      try { return JSON.parse(raw); } catch { return { notes: raw }; }
    })(),
    official_links: formValues(formData, "official_link_url").map((url, index) => ({
      label: formValues(formData, "official_link_label")[index] || "Lien officiel",
      url
    })).filter((item) => item.url),
    trivia: (text(formData, "trivia") || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    image_url: posterUrl
  };
  const basicPayload = {
    title: payload.title,
    type: payload.type,
    status: payload.status,
    synopsis: payload.synopsis,
    casting: payload.casting,
    director: payload.director,
    release_date_estimated: payload.release_date_estimated,
    image_url: payload.image_url
  };
  const legacyPayload = {
    title: payload.title,
    type: payload.type,
    status: payload.status,
    synopsis: payload.synopsis,
    casting: payload.casting,
    director: payload.director,
    release_date_estimated: payload.release_date_estimated,
    release_date_france: payload.release_date_france,
    next_episode_date: payload.next_episode_date,
    season_number: payload.season_number,
    episode_count: payload.episode_count,
    trailer_url: payload.trailer_url,
    genres: payload.genres,
    platform: payload.platform,
    poster_url: payload.poster_url,
    banner_url: payload.banner_url,
    image_url: payload.image_url
  };

  const query = id
    ? supabase.from("production_projects").update(payload).eq("id", id)
    : supabase.from("production_projects").insert(payload);
  let { error } = await query;
  if (error?.message.includes("column")) {
    const retryLegacy = id
      ? await supabase.from("production_projects").update(legacyPayload).eq("id", id)
      : await supabase.from("production_projects").insert(legacyPayload);
    error = retryLegacy.error;
  }
  if (error?.message.includes("column")) {
    const retryBasic = id
      ? await supabase.from("production_projects").update(basicPayload).eq("id", id)
      : await supabase.from("production_projects").insert(basicPayload);
    error = retryBasic.error;
  }
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/prochainement");
  revalidatePath("/productions");
  if (id) revalidatePath(`/productions/${id}`);
  revalidatePath("/admin");
  revalidatePath("/admin/productions");
}

export async function deleteProduction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("production_projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/prochainement");
  revalidatePath("/productions");
  revalidatePath("/admin/productions");
  revalidatePath("/admin/entreprises");
}

export async function upsertProductionCompany(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = text(formData, "id");
  const name = text(formData, "name") || "";
  const payload = {
    name,
    slug: text(formData, "slug") || slugify(name),
    company_type: text(formData, "company_type"),
    country: text(formData, "country"),
    logo_url: text(formData, "logo_url"),
    website: text(formData, "website"),
    description: text(formData, "description"),
    imdb_id: text(formData, "imdb_id"),
    source_url: text(formData, "source_url")
  };
  const query = id
    ? supabase.from("production_companies").update(payload).eq("id", id).select("id").single()
    : supabase.from("production_companies").insert(payload).select("id").single();
  const { data, error } = await query;
  if (error) throw new Error(`${error.message}. Applique supabase-production-pro.sql dans Supabase.`);

  const companyId = data.id as string;
  const labels = formValues(formData, "contact_label");
  const cities = formValues(formData, "contact_city");
  const websites = formValues(formData, "contact_website");
  const emails = formValues(formData, "contact_email");
  const phones = formValues(formData, "contact_phone");
  const addresses = formValues(formData, "contact_address");
  await supabase.from("production_company_contacts").delete().eq("company_id", companyId);
  const contacts = labels.map((label, index) => ({
    company_id: companyId,
    label,
    city: cities[index] || null,
    website: websites[index] || null,
    email: emails[index] || null,
    phone: phones[index] || null,
    address: addresses[index] || null,
    sort_order: index
  })).filter((contact) => contact.label || contact.city || contact.website || contact.email || contact.phone || contact.address);
  if (contacts.length) {
    const { error: contactError } = await supabase.from("production_company_contacts").insert(contacts);
    if (contactError) throw new Error(contactError.message);
  }
  revalidatePath("/productions");
  revalidatePath(`/productions/entreprises/${payload.slug}`);
  revalidatePath("/admin/productions");
  revalidatePath("/admin/entreprises");
  revalidatePath(`/admin/entreprises/${companyId}`);
}

export async function deleteProductionCompany(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("production_companies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/productions");
  revalidatePath("/admin/productions");
  revalidatePath("/admin/entreprises");
}

export async function upsertProductionCompanySection(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = text(formData, "id");
  const companyId = text(formData, "company_id");
  const name = text(formData, "name");
  if (!companyId || !name) throw new Error("Le nom de la section est obligatoire.");
  const payload = {
    company_id: companyId,
    name,
    slug: text(formData, "slug") || slugify(name),
    description: text(formData, "description"),
    sort_order: Number(text(formData, "sort_order")) || 0,
    updated_at: new Date().toISOString()
  };
  const query = id
    ? supabase.from("production_company_sections").update(payload).eq("id", id)
    : supabase.from("production_company_sections").insert(payload);
  const { error } = await query;
  if (error) throw new Error(`${error.message}. Réexécute supabase-production-pro.sql dans Supabase.`);
  revalidatePath("/admin/productions");
  revalidatePath("/admin/entreprises");
  revalidatePath(`/admin/entreprises/${companyId}`);
  revalidatePath("/productions");
}

export async function deleteProductionCompanySection(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("production_company_sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/productions");
  revalidatePath("/admin/entreprises");
  revalidatePath("/productions");
}

type ImportRow = Record<string, unknown>;

type ProductionImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

function normalizeImportKey(key: string) {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function normalizeImportRow(row: ImportRow) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeImportKey(key), value])
  ) as ImportRow;
}

function rowValue(row: ImportRow, keys: string[]) {
  for (const key of keys) {
    const value = row[normalizeImportKey(key)];
    if (Array.isArray(value) && value.length) return value.join(", ");
    if (typeof value === "number") return String(value);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function rowList(row: ImportRow, keys: string[]) {
  const value = rowValue(row, keys);
  if (!value) return [];
  return value
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function rowNumber(row: ImportRow, keys: string[]) {
  const value = rowValue(row, keys);
  if (!value) return null;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function rowDate(row: ImportRow, keys: string[]) {
  const value = rowValue(row, keys);
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function rowObject(row: ImportRow, keys: string[]) {
  for (const key of keys) {
    const value = row[normalizeImportKey(key)];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    if (typeof value === "string" && value.trim()) {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch {}
    }
  }
  return {};
}

function rowArray(row: ImportRow, keys: string[]) {
  for (const key of keys) {
    const value = row[normalizeImportKey(key)];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function inferContentType(value?: string | null): ContentType {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("doc")) return "documentary";
  if (normalized.includes("film") || normalized.includes("movie") || normalized.includes("feature")) return "movie";
  if (normalized.includes("special")) return "special";
  return "series";
}

function inferProductionStatus(value?: string | null): ProductionStatus {
  const normalized = (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized.includes("post")) return "Post-production";
  if (normalized.includes("pre")) return "Pré-production";
  if (normalized.includes("develop")) return "En développement";
  if (normalized.includes("ready") || normalized.includes("diffuser") || normalized.includes("completed") || normalized.includes("wrapped")) return "Prêt à diffuser";
  if (normalized.includes("released") || normalized.includes("sorti")) return "Sorti";
  if (normalized.includes("shoot") || normalized.includes("film") || normalized.includes("tournage") || normalized.includes("production")) return "En tournage";
  return "En développement";
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function parseCsv(content: string) {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(normalizeImportKey);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function parseProductionImport(content: string, filename: string) {
  if (filename.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(content) as unknown;
    if (Array.isArray(parsed)) return parsed as ImportRow[];
    if (parsed && typeof parsed === "object") {
      const object = parsed as Record<string, unknown>;
      const rows = object.productions || object.results || object.data || object.items;
      if (Array.isArray(rows)) return rows as ImportRow[];
    }
    throw new Error("JSON invalide : attends un tableau ou une clé productions/results/data/items.");
  }

  return parseCsv(content);
}

function productionImportPayload(rawRow: ImportRow) {
  const row = normalizeImportRow(rawRow);
  const title = rowValue(row, ["title", "name", "project", "production", "production_title", "project_title"]);
  if (!title) return null;

  const typeText = rowValue(row, ["type", "format", "production_type", "content_type"]);
  const statusText = rowValue(row, ["status", "stage", "production_status", "phase"]);
  const posterUrl = rowValue(row, ["poster_url", "image_url", "poster", "image"]);
  const releaseDate = rowDate(row, ["release_date_france", "release_date", "air_date", "date_de_sortie"]);

  return {
    title,
    type: inferContentType(typeText),
    status: inferProductionStatus(statusText),
    production_label: rowValue(row, ["production_label", "label", "season_label", "object", "objet"]),
    synopsis: rowValue(row, ["synopsis", "summary", "overview", "description", "logline"]),
    casting: rowList(row, ["casting", "cast", "actors", "stars"]),
    director: rowValue(row, ["director", "directors", "realisation", "realizer"]),
    release_date_estimated: releaseDate,
    release_date_france: releaseDate,
    release_year: rowNumber(row, ["release_year", "year", "annee"]),
    next_episode_date: rowDate(row, ["next_episode_date", "next_air_date"]),
    season_number: rowNumber(row, ["season", "season_number", "saison"]),
    episode_count: rowNumber(row, ["episode_count", "episodes", "number_of_episodes"]),
    trailer_url: rowValue(row, ["trailer_url", "trailer", "youtube_url"]),
    genres: rowList(row, ["genres", "genre"]),
    platform: rowValue(row, ["platform", "network", "streamer"]) || "Max",
    poster_url: posterUrl,
    banner_url: rowValue(row, ["banner_url", "backdrop_url", "banner", "backdrop"]),
    tmdb_id: rowNumber(row, ["tmdb_id", "tmdb"]),
    tmdb_media_type: rowValue(row, ["tmdb_media_type", "media_type"]),
    production_company: rowValue(row, ["production_company", "company", "studio", "companies", "societe"]),
    showrunner: rowValue(row, ["showrunner", "creator", "created_by"]),
    writers: rowList(row, ["writers", "writer", "screenwriters", "scenaristes"]),
    executive_producers: rowList(row, ["executive_producers", "executive_producer", "producers"]),
    cinematography: rowValue(row, ["cinematography", "dop", "director_of_photography"]),
    shooting_locations: rowList(row, ["shooting_locations", "locations", "filming_locations", "lieux"]),
    filming_start_date: rowDate(row, ["filming_start_date", "start_date", "shoot_start", "debut_tournage"]),
    filming_end_date: rowDate(row, ["filming_end_date", "end_date", "shoot_end", "fin_tournage"]),
    production_notes: rowValue(row, ["production_notes", "notes", "details"]),
    source_url: rowValue(row, ["source_url", "url", "link", "productionlist_url"]),
    imdb_id: rowValue(row, ["imdb_id", "imdb"]),
    original_title: rowValue(row, ["original_title"]),
    runtime_minutes: rowNumber(row, ["runtime_minutes", "runtime"]),
    content_rating: rowValue(row, ["content_rating", "rating"]),
    country_of_origin: rowValue(row, ["country_of_origin", "country"]),
    languages: rowList(row, ["languages", "language"]),
    technical_details: rowObject(row, ["technical_details"]),
    official_links: rowArray(row, ["official_links"]),
    trivia: rowArray(row, ["trivia"]).map((item) => String(item)).filter(Boolean),
    image_url: posterUrl
  };
}

async function writeProductionImportRow(supabase: Awaited<ReturnType<typeof createClient>>, payload: ReturnType<typeof productionImportPayload>) {
  if (!payload) return { status: "skipped" as const, id: null };

  let existingId: string | null = null;
  if (payload.imdb_id) {
    const { data } = await supabase
      .from("production_projects")
      .select("id")
      .eq("imdb_id", payload.imdb_id)
      .maybeSingle();
    existingId = data?.id || null;
  }
  if (payload.source_url) {
    const { data } = await supabase
      .from("production_projects")
      .select("id")
      .eq("source_url", payload.source_url)
      .maybeSingle();
    existingId = existingId || data?.id || null;
  }

  if (!existingId) {
    const { data } = await supabase
      .from("production_projects")
      .select("id")
      .eq("title", payload.title)
      .maybeSingle();
    existingId = data?.id || null;
  }

  const query = existingId
    ? supabase.from("production_projects").update(payload).eq("id", existingId).select("id").single()
    : supabase.from("production_projects").insert(payload).select("id").single();
  let { data: saved, error } = await query;

  if (error?.message.includes("column")) {
    const legacyPayload = {
      title: payload.title,
      type: payload.type,
      status: payload.status,
      synopsis: payload.synopsis,
      casting: payload.casting,
      director: payload.director,
      release_date_estimated: payload.release_date_estimated,
      release_date_france: payload.release_date_france,
      next_episode_date: payload.next_episode_date,
      season_number: payload.season_number,
      episode_count: payload.episode_count,
      trailer_url: payload.trailer_url,
      genres: payload.genres,
      platform: payload.platform,
      poster_url: payload.poster_url,
      banner_url: payload.banner_url,
      image_url: payload.image_url
    };
    const retry = existingId
      ? await supabase.from("production_projects").update(legacyPayload).eq("id", existingId).select("id").single()
      : await supabase.from("production_projects").insert(legacyPayload).select("id").single();
    error = retry.error;
    saved = retry.data;
  }

  if (error?.message.includes("column")) {
    const basicPayload = {
      title: payload.title,
      type: payload.type,
      status: payload.status,
      synopsis: payload.synopsis,
      casting: payload.casting,
      director: payload.director,
      release_date_estimated: payload.release_date_estimated,
      image_url: payload.image_url
    };
    const retry = existingId
      ? await supabase.from("production_projects").update(basicPayload).eq("id", existingId).select("id").single()
      : await supabase.from("production_projects").insert(basicPayload).select("id").single();
    error = retry.error;
    saved = retry.data;
  }

  if (error) throw new Error(error.message);
  return { status: existingId ? "updated" as const : "created" as const, id: saved?.id || existingId };
}

async function syncImportedProductionDetails(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  rawRow: ImportRow
) {
  const row = normalizeImportRow(rawRow);
  const replaceRows = async (table: string, values: Array<Record<string, unknown>>) => {
    if (!values.length) return;
    const { error: deleteError } = await supabase.from(table).delete().eq("project_id", projectId);
    if (deleteError) throw new Error(deleteError.message);
    const { error } = await supabase.from(table).insert(values.map((value) => ({ ...value, project_id: projectId })));
    if (error) throw new Error(error.message);
  };

  const credits = Array.isArray(row.credits) ? row.credits : [];
  await replaceRows("production_credits", credits.map((value, index) => {
    const item = value as Record<string, unknown>;
    return {
      imdb_person_id: item.imdb_person_id || null,
      name: String(item.name || ""),
      department: String(item.department || "cast"),
      job: item.job || null,
      character_name: item.character_name || null,
      profile_url: item.profile_url || null,
      episode_count: Number(item.episode_count) || null,
      years: item.years || null,
      sort_order: index
    };
  }).filter((item) => item.name));

  const media = Array.isArray(row.media) ? row.media : [];
  await replaceRows("production_media", media.map((value, index) => {
    const item = value as Record<string, unknown>;
    return {
      media_type: String(item.media_type || "image"),
      title: item.title || null,
      url: String(item.url || ""),
      thumbnail_url: item.thumbnail_url || null,
      caption: item.caption || null,
      credit: item.credit || null,
      sort_order: index
    };
  }).filter((item) => item.url));

  const episodes = Array.isArray(row.episodes) ? row.episodes : [];
  await replaceRows("production_episodes", episodes.map((value) => {
    const item = value as Record<string, unknown>;
    return {
      imdb_id: item.imdb_id || null,
      season_number: Number(item.season_number) || 0,
      episode_number: Number(item.episode_number) || 0,
      title: item.title || null,
      synopsis: item.synopsis || null,
      air_date: item.air_date || null,
      image_url: item.image_url || null
    };
  }));

  const history = Array.isArray(row.status_history) ? row.status_history : [];
  await replaceRows("production_status_history", history.map((value, index) => {
    const item = value as Record<string, unknown>;
    return {
      status: String(item.status || ""),
      status_date: item.status_date || null,
      details: item.details || null,
      sort_order: index
    };
  }).filter((item) => item.status));

  const filmingPeriods = Array.isArray(row.filming_periods) ? row.filming_periods : [];
  await replaceRows("production_filming_periods", filmingPeriods.map((value) => {
    const item = value as Record<string, unknown>;
    return {
      start_date: item.start_date || null,
      end_date: item.end_date || null,
      details: item.details || null
    };
  }).filter((item) => item.start_date || item.end_date || item.details));

  const releaseDetails = Array.isArray(row.release_details) ? row.release_details : [];
  await replaceRows("production_release_details", releaseDetails.map((value) => {
    const item = value as Record<string, unknown>;
    return {
      country: item.country || null,
      alternate_title: item.alternate_title || null,
      release_date: item.release_date || null,
      details: item.details || null
    };
  }).filter((item) => item.country || item.alternate_title || item.release_date || item.details));

  const awards = Array.isArray(row.awards) ? row.awards : [];
  await replaceRows("production_awards", awards.map((value) => {
    const item = value as Record<string, unknown>;
    return {
      year: Number(item.year) || null,
      organization: item.organization || null,
      award: item.award || null,
      category: item.category || null,
      result: item.result || null,
      recipient: item.recipient || null
    };
  }).filter((item) => item.organization || item.award || item.category || item.recipient));

  const companies = Array.isArray(row.companies) ? row.companies : [];
  for (const value of companies) {
    const item = value as Record<string, unknown>;
    const name = String(item.name || "").trim();
    if (!name) continue;
    const imdbCompanyId = typeof item.imdb_id === "string" ? item.imdb_id : null;
    let companyId: string | null = null;
    if (imdbCompanyId) {
      const { data } = await supabase.from("production_companies").select("id").eq("imdb_id", imdbCompanyId).maybeSingle();
      companyId = data?.id || null;
    }
    if (!companyId) {
      const companySlug = slugify(name);
      const { data, error } = await supabase.from("production_companies").upsert({
        name,
        slug: companySlug,
        imdb_id: imdbCompanyId,
        source_url: item.source_url || null
      }, { onConflict: "slug" }).select("id").single();
      if (error) throw new Error(error.message);
      companyId = data.id;
    }
    const { error } = await supabase.from("production_project_companies").upsert({
      project_id: projectId,
      company_id: companyId,
      role: "Production"
    }, { onConflict: "project_id,company_id,role" });
    if (error) throw new Error(error.message);
  }
}

export async function importProductionCompanySectionFile(formData: FormData): Promise<ProductionImportResult> {
  await requireAdmin();
  const companyId = text(formData, "company_id");
  const sectionId = text(formData, "section_id");
  const file = formData.get("file");
  if (!companyId || !sectionId) throw new Error("Entreprise ou section manquante.");
  if (!file || typeof file === "string" || typeof file.text !== "function") {
    throw new Error("Ajoute le fichier JSON généré par l’extension.");
  }

  const filename = "name" in file && typeof file.name === "string" ? file.name : "imdbpro-productions.json";
  const rows = parseProductionImport(await file.text(), filename);
  if (!rows.length) throw new Error("Aucun projet trouvé dans le fichier.");

  const supabase = await createClient();
  const { data: section, error: sectionError } = await supabase
    .from("production_company_sections")
    .select("id, company_id")
    .eq("id", sectionId)
    .eq("company_id", companyId)
    .single();
  if (sectionError || !section) throw new Error("Cette section n’appartient pas à l’entreprise sélectionnée.");

  const result: ProductionImportResult = { created: 0, updated: 0, skipped: 0, errors: [] };
  const importedProjectIds: string[] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    try {
      const saved = await writeProductionImportRow(supabase, productionImportPayload(row));
      result[saved.status] += 1;
      if (!saved.id) continue;
      importedProjectIds.push(saved.id);
      await syncImportedProductionDetails(supabase, saved.id, row);

      const { error: companyError } = await supabase.from("production_project_companies").upsert({
        project_id: saved.id,
        company_id: companyId,
        role: "Production"
      }, { onConflict: "project_id,company_id,role" });
      if (companyError) throw new Error(companyError.message);

      const { error: assignmentError } = await supabase.from("production_company_section_projects").upsert({
        section_id: sectionId,
        project_id: saved.id
      }, { onConflict: "section_id,project_id" });
      if (assignmentError) throw new Error(assignmentError.message);
    } catch (error) {
      result.errors.push(`Projet ${index + 1}: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  }

  const { data: previousAssignments, error: assignmentsError } = await supabase
    .from("production_company_section_projects")
    .select("id, project_id")
    .eq("section_id", sectionId);
  if (assignmentsError) throw new Error(assignmentsError.message);
  if (!result.errors.length) {
    const importedSet = new Set(importedProjectIds);
    const staleIds = (previousAssignments || [])
      .filter((assignment) => !importedSet.has(assignment.project_id))
      .map((assignment) => assignment.id);
    if (staleIds.length) {
      const { error } = await supabase.from("production_company_section_projects").delete().in("id", staleIds);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/");
  revalidatePath("/productions");
  revalidatePath("/admin/productions");
  revalidatePath("/admin/entreprises");
  return result;
}

export async function importProductionCompanySectionBatch(
  companyId: string,
  sectionId: string,
  rows: ImportRow[]
): Promise<ProductionImportResult & { projectIds: string[] }> {
  await requireAdmin();
  if (!companyId || !sectionId || !Array.isArray(rows) || !rows.length) {
    throw new Error("Lot d’import invalide.");
  }
  const supabase = await createClient();
  const { data: section, error: sectionError } = await supabase
    .from("production_company_sections")
    .select("id")
    .eq("id", sectionId)
    .eq("company_id", companyId)
    .single();
  if (sectionError || !section) throw new Error("Section introuvable pour cette entreprise.");

  const result: ProductionImportResult & { projectIds: string[] } = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    projectIds: []
  };

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    try {
      const saved = await writeProductionImportRow(supabase, productionImportPayload(row));
      result[saved.status] += 1;
      if (!saved.id) continue;
      result.projectIds.push(saved.id);
      await syncImportedProductionDetails(supabase, saved.id, row);

      const { error: companyError } = await supabase.from("production_project_companies").upsert({
        project_id: saved.id,
        company_id: companyId,
        role: "Production"
      }, { onConflict: "project_id,company_id,role" });
      if (companyError) throw new Error(companyError.message);

      const { error: assignmentError } = await supabase.from("production_company_section_projects").upsert({
        section_id: sectionId,
        project_id: saved.id
      }, { onConflict: "section_id,project_id" });
      if (assignmentError) throw new Error(assignmentError.message);
    } catch (error) {
      result.errors.push(`Projet ${index + 1}: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  }

  return result;
}

export async function finalizeProductionCompanySectionImport(sectionId: string, projectIds: string[], canRemoveStale: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  if (canRemoveStale) {
    const { data, error } = await supabase
      .from("production_company_section_projects")
      .select("id, project_id")
      .eq("section_id", sectionId);
    if (error) throw new Error(error.message);
    const imported = new Set(projectIds);
    const staleIds = (data || []).filter((item) => !imported.has(item.project_id)).map((item) => item.id);
    if (staleIds.length) {
      const { error: deleteError } = await supabase
        .from("production_company_section_projects")
        .delete()
        .in("id", staleIds);
      if (deleteError) throw new Error(deleteError.message);
    }
  }
  revalidatePath("/");
  revalidatePath("/productions");
  revalidatePath("/admin/productions");
  revalidatePath("/admin/entreprises");
}

async function validateCompanySection(
  supabase: Awaited<ReturnType<typeof createClient>>,
  companyId: string,
  sectionId: string
) {
  const { data, error } = await supabase
    .from("production_company_sections")
    .select("id")
    .eq("id", sectionId)
    .eq("company_id", companyId)
    .single();
  if (error || !data) throw new Error("Section introuvable pour cette entreprise.");
}

export async function assignProductionProjectToSection(companyId: string, sectionId: string, projectId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await validateCompanySection(supabase, companyId, sectionId);

  const { data: project, error: projectError } = await supabase
    .from("production_projects")
    .select("id")
    .eq("id", projectId)
    .single();
  if (projectError || !project) throw new Error("Fiche projet introuvable.");

  const { error: companyError } = await supabase.from("production_project_companies").upsert({
    project_id: projectId,
    company_id: companyId,
    role: "Production"
  }, { onConflict: "project_id,company_id,role" });
  if (companyError) throw new Error(companyError.message);

  const { error } = await supabase.from("production_company_section_projects").upsert({
    section_id: sectionId,
    project_id: projectId
  }, { onConflict: "section_id,project_id" });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/entreprises");
  revalidatePath(`/admin/entreprises/${companyId}`);
  revalidatePath("/productions");
}

export async function createProductionProjectInSection(
  companyId: string,
  sectionId: string,
  values: { title: string; type?: string; status?: string; imdbId?: string }
) {
  await requireAdmin();
  const supabase = await createClient();
  await validateCompanySection(supabase, companyId, sectionId);
  const payload = productionImportPayload({
    title: values.title,
    type: values.type || "series",
    status: values.status || "development",
    imdb_id: values.imdbId || null
  });
  const saved = await writeProductionImportRow(supabase, payload);
  if (!saved.id) throw new Error("Impossible de créer la fiche projet.");
  await assignProductionProjectToSection(companyId, sectionId, saved.id);
  return { projectId: saved.id, status: saved.status };
}

export async function removeProductionProjectFromSection(companyId: string, sectionId: string, projectId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await validateCompanySection(supabase, companyId, sectionId);
  const { error } = await supabase
    .from("production_company_section_projects")
    .delete()
    .eq("section_id", sectionId)
    .eq("project_id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/entreprises");
  revalidatePath(`/admin/entreprises/${companyId}`);
  revalidatePath("/productions");
}

export async function importProductionFile(formData: FormData): Promise<ProductionImportResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!file || typeof file === "string" || typeof file.text !== "function") {
    throw new Error("Ajoute un fichier CSV ou JSON.");
  }

  const filename = "name" in file && typeof file.name === "string" ? file.name : "productions.csv";
  const content = await file.text();
  const rows = parseProductionImport(content, filename);
  if (!rows.length) throw new Error("Aucune production trouvée dans le fichier.");

  const supabase = await createClient();
  const result: ProductionImportResult = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    try {
      const saved = await writeProductionImportRow(supabase, productionImportPayload(row));
      result[saved.status] += 1;
      if (saved.id) await syncImportedProductionDetails(supabase, saved.id, row);
    } catch (error) {
      result.errors.push(`Ligne ${index + 2}: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/productions");
  revalidatePath("/prochainement");
  revalidatePath("/admin/productions");
  return result;
}

export async function searchTmdbProductions(query: string): Promise<TmdbSearchResult[]> {
  await requireAdmin();
  if (!query.trim() || query.trim().length < 2) return [];
  return searchTmdb(query.trim());
}

export async function searchTmdbTop10(query: string, type: ContentType): Promise<TmdbSearchResult[]> {
  await requireAdmin();
  if (!query.trim() || query.trim().length < 2) return [];
  const results = await searchTmdb(query.trim());
  return results.filter((result) => result.type === type);
}

export async function getTmdbPosterChoices(mediaType: TmdbMediaType, tmdbId: number): Promise<TmdbPoster[]> {
  await requireAdmin();
  return getTmdbPosters(mediaType, tmdbId);
}

export async function importTmdbProduction(mediaType: TmdbMediaType, tmdbId: number, selectedPosterUrl?: string | null) {
  await requireAdmin();
  const supabase = await createClient();
  const item = await getTmdbProduction(mediaType, tmdbId);

  const payload = {
    title: item.title,
    type: item.type,
    status: "upcoming",
    synopsis: item.overview,
    casting: item.casting,
    director: item.director,
    release_date_estimated: item.releaseDate,
    release_date_france: item.releaseDate,
    release_year: item.releaseDate ? Number(item.releaseDate.slice(0, 4)) : null,
    tmdb_id: tmdbId,
    tmdb_media_type: mediaType,
    genres: item.genres,
    episode_count: item.episodeCount,
    platform: "Max",
    poster_url: selectedPosterUrl || item.posterUrl,
    banner_url: item.bannerUrl,
    image_url: selectedPosterUrl || item.posterUrl
  };
  let { error } = await supabase.from("production_projects").insert(payload);
  if (error?.message.includes("column")) {
    const retryLegacy = await supabase.from("production_projects").insert({
      title: item.title,
      type: item.type,
      status: "upcoming",
      synopsis: item.overview,
      casting: item.casting,
      director: item.director,
      release_date_estimated: item.releaseDate,
      release_date_france: item.releaseDate,
      genres: item.genres,
      episode_count: item.episodeCount,
      platform: "Max",
      poster_url: selectedPosterUrl || item.posterUrl,
      banner_url: item.bannerUrl,
      image_url: selectedPosterUrl || item.posterUrl
    });
    error = retryLegacy.error;
  }
  if (error?.message.includes("column") || error?.message.includes("enum")) {
    const retryBasic = await supabase.from("production_projects").insert({
      title: item.title,
      type: item.type,
      status: "En développement",
      synopsis: item.overview,
      casting: item.casting,
      director: item.director,
      release_date_estimated: item.releaseDate,
      image_url: selectedPosterUrl || item.posterUrl
    });
    error = retryBasic.error;
  }

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/prochainement");
  revalidatePath("/productions");
  revalidatePath("/admin/productions");
}

function hasText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasList(value?: string[] | null) {
  return Array.isArray(value) && value.length > 0;
}

export async function enrichProductionFromTmdb(
  id: string,
  mediaType: TmdbMediaType,
  tmdbId: number,
  selectedPosterUrl?: string | null
) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: current, error: currentError } = await supabase
    .from("production_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (currentError || !current) throw new Error(currentError?.message || "Fiche introuvable.");

  const item = await getTmdbProduction(mediaType, tmdbId);
  const project = current as {
    synopsis?: string | null;
    casting?: string[] | null;
    director?: string | null;
    release_date_estimated?: string | null;
    release_date_france?: string | null;
    release_year?: number | null;
    episode_count?: number | null;
    genres?: string[] | null;
    poster_url?: string | null;
    image_url?: string | null;
    banner_url?: string | null;
    tmdb_id?: number | null;
    tmdb_media_type?: string | null;
  };

  const payload: Record<string, unknown> = {};
  const filled: string[] = [];
  const posterUrl = selectedPosterUrl || item.posterUrl;

  function setIfMissing(key: string, currentValue: unknown, nextValue: unknown, label: string) {
    if (nextValue == null) return;
    if (Array.isArray(currentValue) ? currentValue.length > 0 : hasText(String(currentValue || ""))) return;
    if (Array.isArray(nextValue) && !nextValue.length) return;
    if (typeof nextValue === "string" && !nextValue.trim()) return;
    payload[key] = nextValue;
    filled.push(label);
  }

  setIfMissing("synopsis", project.synopsis, item.overview, "synopsis");
  setIfMissing("casting", project.casting, item.casting, "casting");
  setIfMissing("director", project.director, item.director, "réalisation");
  setIfMissing("release_date_estimated", project.release_date_estimated, item.releaseDate, "date estimée");
  setIfMissing("release_date_france", project.release_date_france, item.releaseDate, "date France");
  setIfMissing("release_year", project.release_year, item.releaseDate ? Number(item.releaseDate.slice(0, 4)) : null, "année");
  setIfMissing("episode_count", project.episode_count, item.episodeCount, "épisodes");
  if (!hasList(project.genres) && item.genres.length) {
    payload.genres = item.genres;
    filled.push("genres");
  }
  if (!hasText(project.poster_url) && !hasText(project.image_url) && posterUrl) {
    payload.poster_url = posterUrl;
    payload.image_url = posterUrl;
    filled.push("affiche");
  }
  setIfMissing("banner_url", project.banner_url, item.bannerUrl, "bannière");
  if (!project.tmdb_id) {
    payload.tmdb_id = tmdbId;
    filled.push("TMDB ID");
  }
  if (!project.tmdb_media_type) {
    payload.tmdb_media_type = mediaType;
    filled.push("type TMDB");
  }

  if (!Object.keys(payload).length) {
    return { filled, message: "Aucun champ vide à compléter." };
  }

  let { error } = await supabase.from("production_projects").update(payload).eq("id", id);
  if (error?.message.includes("column")) {
    const legacyPayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) =>
        [
          "synopsis",
          "casting",
          "director",
          "release_date_estimated",
          "release_date_france",
          "episode_count",
          "genres",
          "poster_url",
          "banner_url",
          "image_url"
        ].includes(key)
      )
    );
    const retry = await supabase.from("production_projects").update(legacyPayload).eq("id", id);
    error = retry.error;
  }
  if (error?.message.includes("column")) {
    const basicPayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) =>
        ["synopsis", "casting", "director", "release_date_estimated", "image_url"].includes(key)
      )
    );
    const retry = await supabase.from("production_projects").update(basicPayload).eq("id", id);
    error = retry.error;
  }
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/productions");
  revalidatePath(`/productions/${id}`);
  revalidatePath("/admin/productions");
  return { filled, message: filled.length ? `Champs complétés : ${filled.join(", ")}.` : "Aucun champ vide à compléter." };
}

export async function enrichProductionSectionTmdbBatch(sectionId: string, projectIds: string[]) {
  await requireAdmin();
  if (!sectionId || !projectIds.length || projectIds.length > 5) {
    throw new Error("Lot TMDB invalide.");
  }

  const supabase = await createClient();
  const { data: assignments, error: assignmentError } = await supabase
    .from("production_company_section_projects")
    .select("project_id")
    .eq("section_id", sectionId)
    .in("project_id", projectIds);
  if (assignmentError) throw new Error(assignmentError.message);

  const allowedIds = new Set((assignments || []).map((item) => item.project_id));
  const ids = projectIds.filter((id) => allowedIds.has(id));
  if (!ids.length) throw new Error("Aucun projet valide dans cette section.");

  const { data: projects, error: projectError } = await supabase
    .from("production_projects")
    .select("id,title,type,tmdb_id")
    .in("id", ids);
  if (projectError) throw new Error(projectError.message);

  const result = { enriched: 0, alreadyLinked: 0, notFound: 0, errors: [] as string[] };
  for (const project of projects || []) {
    try {
      if (project.tmdb_id) {
        result.alreadyLinked += 1;
        continue;
      }
      const found = await findTmdbTitle(project.type as ContentType, project.title);
      if (!found) {
        result.notFound += 1;
        continue;
      }
      await enrichProductionFromTmdb(
        project.id,
        found.type === "movie" ? "movie" : "tv",
        found.tmdbId,
        found.posterUrl
      );
      result.enriched += 1;
    } catch (error) {
      result.errors.push(`${project.title}: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  }
  return result;
}

function upcomingPayload(formData: FormData) {
  const title = text(formData, "title") || "";
  const posterUrl = text(formData, "poster_url") || text(formData, "image_url");
  const mediaType = text(formData, "tmdb_media_type");

  return {
    title,
    slug: text(formData, "slug") || slugify(title),
    type: (text(formData, "type") || "series") as ContentType,
    synopsis: text(formData, "synopsis"),
    release_label: text(formData, "release_label"),
    release_date: text(formData, "release_date"),
    release_time: text(formData, "release_time") || null,
    country: text(formData, "country") || "France",
    genres: list(formData, "genres"),
    platform: text(formData, "platform") || "Max",
    poster_url: posterUrl,
    banner_url: text(formData, "banner_url"),
    tmdb_id: Number(text(formData, "tmdb_id")) || null,
    tmdb_media_type: mediaType === "movie" || mediaType === "tv" ? mediaType : null,
    source_url: text(formData, "source_url")
  };
}

function upcomingTrailersPayload(formData: FormData, releaseId: string) {
  const titles = formValues(formData, "trailer_title");
  const urls = formValues(formData, "trailer_url");
  const sources = formData.getAll("trailer_source_type").map((value) => (typeof value === "string" ? value : "youtube"));

  return urls
    .map((url, index) => ({
      release_id: releaseId,
      title: titles[index] || `Bande-annonce ${index + 1}`,
      url,
      source_type: (sources[index] || "youtube") as UpcomingTrailerSource,
      sort_order: index
    }))
    .filter((trailer) => trailer.url);
}

export async function upsertUpcomingRelease(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = text(formData, "id");
  const payload = upcomingPayload(formData);

  const query = id
    ? supabase.from("upcoming_releases").update(payload).eq("id", id).select("id,slug").single()
    : supabase.from("upcoming_releases").insert(payload).select("id,slug").single();

  const { data, error } = await query;
  if (error) throw new Error(`${error.message}. Si la table n'existe pas encore, applique supabase-upcoming.sql dans Supabase.`);

  const releaseId = data.id as string;
  const { error: deleteError } = await supabase.from("upcoming_trailers").delete().eq("release_id", releaseId);
  if (deleteError) throw new Error(deleteError.message);

  const trailers = upcomingTrailersPayload(formData, releaseId);
  if (trailers.length) {
    const { error: trailerError } = await supabase.from("upcoming_trailers").insert(trailers);
    if (trailerError) throw new Error(trailerError.message);
  }

  revalidatePath("/");
  revalidatePath("/prochainement");
  revalidatePath(`/prochainement/${payload.slug}`);
  revalidatePath("/admin/prochainement");
}

export async function deleteUpcomingRelease(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("upcoming_trailers").delete().eq("release_id", id);
  const { error } = await supabase.from("upcoming_releases").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/prochainement");
  revalidatePath("/admin/prochainement");
}

export async function searchTmdbUpcoming(query: string): Promise<TmdbSearchResult[]> {
  await requireAdmin();
  if (!query.trim() || query.trim().length < 2) return [];
  return searchTmdb(query.trim());
}

export async function importTmdbUpcoming(mediaType: TmdbMediaType, tmdbId: number, selectedPosterUrl?: string | null) {
  await requireAdmin();
  const supabase = await createClient();
  const item = await getTmdbProduction(mediaType, tmdbId);
  const title = item.title;
  const payload = {
    title,
    slug: slugify(title),
    type: item.type,
    synopsis: item.overview,
    release_label: item.type === "series" ? "Nouvelle série" : item.type === "movie" ? "Nouveau film" : null,
    release_date: item.releaseDate,
    country: "France",
    genres: item.genres,
    platform: "Max",
    poster_url: selectedPosterUrl || item.posterUrl,
    banner_url: item.bannerUrl,
    tmdb_id: tmdbId,
    tmdb_media_type: mediaType,
    source_url: `https://www.themoviedb.org/${mediaType === "movie" ? "movie" : "tv"}/${tmdbId}`
  };

  const { error } = await supabase.from("upcoming_releases").upsert(payload, { onConflict: "tmdb_id,tmdb_media_type" });
  if (error) throw new Error(`${error.message}. Si la table n'existe pas encore, applique supabase-upcoming.sql dans Supabase.`);

  revalidatePath("/prochainement");
  revalidatePath("/admin/prochainement");
}

export async function syncProductionSources() {
  await requireAdmin();
  const supabase = await createClient();
  const results = await syncTmdbProductions(supabase);
  revalidatePath("/");
  revalidatePath("/productions");
  revalidatePath("/prochainement");
  revalidatePath("/admin/productions");
  return results;
}

export async function importTop10(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const type = (text(formData, "type") || "series") as ContentType;
  const date = text(formData, "date") || todayIso();
  const raw = text(formData, "raw") || "";

  const rows = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const cleaned = line.replace(/^\s*(?:#?\d{1,2}[\).\-\s]+)\s*/, "").trim();
      return {
        date,
        type,
        rank: index + 1,
        title: cleaned,
        image_url: null
      };
    })
    .filter((row) => row.rank <= 10 && row.title);

  if (rows.length !== 10) {
    throw new Error("Colle exactement 10 lignes, une par titre.");
  }

  const { error } = await supabase.from("top_10_france").upsert(rows, {
    onConflict: "date,type,rank"
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/top-10-france");
  revalidatePath("/admin/top-10");
}

export async function saveTop10Ranking(
  date: string,
  type: ContentType,
  items: Array<{ title: string; image_url: string | null }>
) {
  await requireAdmin();
  if (!date) throw new Error("Date manquante.");
  if (items.length !== 10) throw new Error("Le classement doit contenir exactement 10 titres.");

  const supabase = await createClient();
  const rows = items.map((item, index) => ({
    date,
    type,
    rank: index + 1,
    title: item.title,
    image_url: item.image_url
  }));

  const { error } = await supabase.from("top_10_france").upsert(rows, {
    onConflict: "date,type,rank"
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/top-10-france");
  revalidatePath("/admin/top-10");
}

export async function prepareNewsDraft(formData: FormData) {
  await requireAdmin();
  const source = text(formData, "source") || "";
  const title = text(formData, "title") || "Brouillon à finaliser";
  const sentences = source
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 7);

  const summary = [
    "Résumé préparé en français :",
    "",
    ...sentences.map((sentence) => `- ${sentence}`),
    "",
    "Angle conseillé : replacer l'information dans le contexte français de Max, HBO et Warner Bros. Discovery."
  ].join("\n");

  const params = new URLSearchParams({
    title,
    category: "Actualités",
    content: summary,
    status: "draft"
  });

  redirect(`/admin/articles/new?${params.toString()}`);
}

export async function createAdminMedia(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("media_library").insert({
    title: text(formData, "title") || "Média sans titre",
    url: text(formData, "url") || "",
    media_type: text(formData, "media_type") || "image",
    folder: text(formData, "folder"),
    tags: list(formData, "tags")
  });
  if (error) redirectWithAdminMessage("/admin/mediatheque", "Table media_library absente. Applique supabase-admin-upgrade.sql.", true);
  revalidatePath("/admin/mediatheque");
  redirectWithAdminMessage("/admin/mediatheque", "Média enregistré.");
}

export async function deleteAdminMedia(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("media_library").delete().eq("id", id);
  if (error) redirectWithAdminMessage("/admin/mediatheque", "Suppression impossible : table media_library absente.", true);
  revalidatePath("/admin/mediatheque");
  redirectWithAdminMessage("/admin/mediatheque", "Média supprimé.");
}

export async function createCollection(formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title") || "";
  const supabase = await createClient();
  const { error } = await supabase.from("collections").insert({
    title,
    slug: text(formData, "slug") || slugify(title),
    description: text(formData, "description")
  });
  if (error) redirectWithAdminMessage("/admin/collections", "Table collections absente. Applique supabase-admin-upgrade.sql.", true);
  revalidatePath("/admin/collections");
  redirectWithAdminMessage("/admin/collections", "Collection créée.");
}

export async function deleteCollection(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) redirectWithAdminMessage("/admin/collections", "Suppression impossible : table collections absente.", true);
  revalidatePath("/admin/collections");
  redirectWithAdminMessage("/admin/collections", "Collection supprimée.");
}

export async function createNewsletterCampaign(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_campaigns").insert({
    subject: text(formData, "subject") || "",
    content: text(formData, "content") || "",
    status: "draft"
  });
  if (error) redirectWithAdminMessage("/admin/newsletter", "Table newsletter_campaigns absente. Applique supabase-admin-upgrade.sql.", true);
  revalidatePath("/admin/newsletter");
  redirectWithAdminMessage("/admin/newsletter", "Campagne enregistrée en brouillon.");
}

export async function createRedirection(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("redirections").insert({
    from_url: text(formData, "from_url") || "",
    to_url: text(formData, "to_url") || "",
    redirect_type: Number(text(formData, "redirect_type")) || 301,
    active: text(formData, "active") === "on"
  });
  if (error) redirectWithAdminMessage("/admin/redirections", "Table redirections absente. Applique supabase-admin-upgrade.sql.", true);
  revalidatePath("/admin/redirections");
  redirectWithAdminMessage("/admin/redirections", "Redirection enregistrée.");
}

export async function deleteRedirection(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("redirections").delete().eq("id", id);
  if (error) redirectWithAdminMessage("/admin/redirections", "Suppression impossible : table redirections absente.", true);
  revalidatePath("/admin/redirections");
  redirectWithAdminMessage("/admin/redirections", "Redirection supprimée.");
}

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const rows = [
    "site_name",
    "logo_url",
    "main_menu",
    "footer_text",
    "social_links",
    "global_seo_title",
    "global_seo_description",
    "maintenance_mode",
    "newsletter_sender",
    "tmdb_api_status"
  ].map((key) => ({ key, value: text(formData, key) || "" }));
  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) redirectWithAdminMessage("/admin/reglages", "Table site_settings absente. Applique supabase-admin-upgrade.sql.", true);
  revalidatePath("/admin/reglages");
  redirectWithAdminMessage("/admin/reglages", "Réglages enregistrés.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
