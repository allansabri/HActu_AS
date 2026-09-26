import { supabasePublic } from "@/lib/supabase-public";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { AdminCollection, Article, ProductionProject, Top10Item } from "@/lib/types";
import { todayIso } from "@/lib/format";
import { demoArticles, demoCollections, demoProductions, demoTop10 } from "@/lib/demo-data";

export function parseArticleMetadata(article: Article): Article {
  let authorName = article.author_name;
  if (!authorName && article.related_content) {
    if (article.related_content.startsWith("author:")) {
      const parts = article.related_content.split(" | ");
      authorName = parts[0].replace("author:", "").trim();
    } else {
      try {
        const parsed = JSON.parse(article.related_content);
        if (parsed.author_name) authorName = parsed.author_name;
      } catch {}
    }
  }
  return {
    ...article,
    author_name: authorName || "Allan",
  };
}

export async function getLatestArticles(limit = 12) {
  const { data } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  const dbArticles = ((data || []) as Article[]).map(parseArticleMetadata);
  const existingSlugs = new Set(dbArticles.map((a) => a.slug));
  const combined = [
    ...dbArticles,
    ...demoArticles.filter((a) => !existingSlugs.has(a.slug)),
  ];

  return combined.slice(0, limit);
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

  const found = data ? parseArticleMetadata(data as Article) : null;
  return found || demoArticles.find((article) => article.slug === slug) || null;
}

export async function getArticlesByCategory(category?: string) {
  let query = supabasePublic
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (category) {
    query = query.ilike("category", `%${category}%`);
  }

  const { data } = await query;
  const dbArticles = ((data || []) as Article[]).map(parseArticleMetadata);
  const existingSlugs = new Set(dbArticles.map((a) => a.slug));

  const fallback = category
    ? demoArticles.filter((article) => {
        const cat = (article.category || "").toLowerCase();
        const target = category.toLowerCase();
        return cat.includes(target) || (target === "hbo" && (cat.includes("hbo") || cat.includes("max")));
      })
    : demoArticles;

  return [...dbArticles, ...fallback.filter((a) => !existingSlugs.has(a.slug))];
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
  if (!items.length) {
    return demoTop10(date);
  }

  try {
    // 1. Check if metadata was saved in site_settings
    const metaKeys = [
      `top10_meta_${date}_series`,
      `top10_meta_${date}_movie`,
      `top10_meta_latest_series`,
      `top10_meta_latest_movie`,
    ];
    const { data: metaRows } = await supabaseAdmin
      .from("site_settings")
      .select("key, value")
      .in("key", metaKeys);

    const metaMap = new Map<
      string,
      {
        days_in_top?: number;
        previous_rank?: number | null;
        rank_diff?: number | null;
        is_new?: boolean;
        days_in_top_1?: number;
      }
    >();

    for (const row of metaRows || []) {
      try {
        const parsed = JSON.parse(row.value);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item.title) {
              metaMap.set(item.title.toLowerCase().trim(), item);
            }
          }
        }
      } catch {
        // ignore JSON parse error
      }
    }

    // 2. Fetch past dates from top_10_france to automatically calculate or fill any gaps
    const { data: pastRows } = await supabasePublic
      .from("top_10_france")
      .select("date, type, rank, title")
      .lt("date", date)
      .order("date", { ascending: false })
      .limit(80);

    const pastDateGroups = new Map<string, Map<string, number>>();
    for (const row of pastRows || []) {
      if (!pastDateGroups.has(row.date)) {
        pastDateGroups.set(row.date, new Map());
      }
      pastDateGroups.get(row.date)!.set(row.title.toLowerCase().trim(), row.rank);
    }
    const sortedPastDates = Array.from(pastDateGroups.keys()).sort().reverse();
    const mostRecentPastDate = sortedPastDates[0];
    const prevDateMap = mostRecentPastDate ? pastDateGroups.get(mostRecentPastDate) : null;

    return items.map((item) => {
      const key = item.title.toLowerCase().trim();
      const meta = metaMap.get(key);

      // Prioritize explicit metadata if available
      if (meta) {
        return {
          ...item,
          days_in_top: meta.days_in_top ?? 1,
          previous_rank: meta.previous_rank,
          rank_diff: meta.rank_diff,
          is_new: meta.is_new,
          days_in_top_1: meta.days_in_top_1,
        };
      }

      // Automatic computation based on history
      if (prevDateMap) {
        const prevRank = prevDateMap.get(key);
        if (prevRank != null) {
          const rankDiff = prevRank - item.rank; // e.g. was 1, now 2 -> 1 - 2 = -1 (down 1)
          let consecutiveDays = 1; // today
          for (const d of sortedPastDates) {
            if (pastDateGroups.get(d)?.has(key)) {
              consecutiveDays++;
            } else {
              break;
            }
          }
          return {
            ...item,
            days_in_top: consecutiveDays,
            previous_rank: prevRank,
            rank_diff: rankDiff,
            is_new: false,
          };
        } else {
          return {
            ...item,
            days_in_top: 1,
            previous_rank: null,
            rank_diff: null,
            is_new: true,
          };
        }
      }

      return {
        ...item,
        days_in_top: 1,
        rank_diff: 0,
        is_new: false,
      };
    });
  } catch {
    return items;
  }
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
    ["upcoming", "En développement", "Pré-production", "En tournage", "Post-production", "Prêt à diffuser"].includes(project.status)
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
