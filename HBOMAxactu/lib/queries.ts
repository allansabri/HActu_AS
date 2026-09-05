import { supabasePublic } from "@/lib/supabase-public";
import { AdminCollection, Article, ProductionProject, Top10Item } from "@/lib/types";
import { todayIso } from "@/lib/format";
import { demoArticles, demoCollections, demoProductions, demoTop10 } from "@/lib/demo-data";

export async function getLatestArticles(limit = 12) {
  const { data } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  const articles = (data || []) as Article[];
  return articles.length ? articles : demoArticles.slice(0, limit);
}

export async function getFeaturedArticles() {
  return getLatestArticles(3);
}

export async function getArticleBySlug(slug: string) {
  const { data } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return (data as Article | null) || demoArticles.find((article) => article.slug === slug) || null;
}

export async function getArticlesByCategory(category?: string) {
  let query = supabasePublic
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data } = await query;
  const articles = (data || []) as Article[];
  if (articles.length) return articles;
  return category ? demoArticles.filter((article) => article.category === category) : demoArticles;
}

export async function getCategories() {
  const { data } = await supabasePublic
    .from("articles")
    .select("category")
    .eq("status", "published");

  const categories = (data || []).map((item) => item.category);
  const fallbackCategories = demoArticles.map((article) => article.category);
  return Array.from(new Set(categories.length ? categories : fallbackCategories)).sort();
}

export async function getTop10(date = todayIso()) {
  const { data } = await supabasePublic
    .from("top_10_france")
    .select("*")
    .eq("date", date)
    .order("type", { ascending: true })
    .order("rank", { ascending: true });

  const items = (data || []) as Top10Item[];
  return items.length ? items : demoTop10(date);
}

export async function getProductionProjects() {
  const { data } = await supabasePublic
    .from("production_projects")
    .select("*")
    .order("release_date_estimated", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  const projects = (data || []) as ProductionProject[];
  return projects.length ? projects : demoProductions;
}

export async function getProductionProjectById(id: string) {
  const { data } = await supabasePublic
    .from("production_projects")
    .select("*")
    .eq("id", id)
    .single();

  return (data as ProductionProject | null) || demoProductions.find((project) => project.id === id) || null;
}

export async function getUpcomingProductionProjects(limit?: number) {
  let query = supabasePublic
    .from("production_projects")
    .select("*")
    .or("status.eq.upcoming,status.eq.En développement,status.eq.Pré-production,status.eq.En tournage,status.eq.Post-production,status.eq.Prêt à diffuser")
    .order("release_date_estimated", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  const projects = (data || []) as ProductionProject[];
  const fallback = demoProductions.filter((project) =>
    ["upcoming", "En developpement", "En développement", "Pre-production", "Pré-production", "En tournage", "Post-production", "Pret a diffuser", "Prêt à diffuser"].includes(project.status)
  );
  const result = projects.length ? projects : fallback;
  return limit ? result.slice(0, limit) : result;
}

export async function getTrailerArticles(limit = 24) {
  const { data } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("status", "published")
    .not("youtube_video_url", "is", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  const articles = (data || []) as Article[];
  return articles.length
    ? articles
    : demoArticles.filter((article) => article.youtube_video_url).slice(0, limit);
}

export async function getProductionsByType(type: "movie" | "series", limit = 24) {
  const { data } = await supabasePublic
    .from("production_projects")
    .select("*")
    .eq("type", type)
    .order("updated_at", { ascending: false })
    .limit(limit);

  const projects = (data || []) as ProductionProject[];
  return projects.length
    ? projects
    : demoProductions.filter((project) => project.type === type).slice(0, limit);
}

export async function getCollections(limit = 24) {
  const { data, error } = await supabasePublic
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return demoCollections.slice(0, limit);
  const collections = (data || []) as AdminCollection[];
  return collections.length ? collections : demoCollections.slice(0, limit);
}
