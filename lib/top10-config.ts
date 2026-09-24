import { supabasePublic } from "@/lib/supabase-public";

export interface Top10Config {
  section_title: string;
  series_subtitle: string;
  movies_subtitle: string;
  limit?: number;
}

export const defaultTop10Config: Top10Config = {
  section_title: "Les plus populaires sur HBO Max",
  series_subtitle: "Top 10 des séries le 24 septembre 2026",
  movies_subtitle: "Top 10 des films le 24 septembre 2026",
  limit: 5,
};

export async function getTop10Config(): Promise<Top10Config> {
  try {
    const { data, error } = await supabasePublic
      .from("site_settings")
      .select("value")
      .eq("key", "top10_section_config")
      .maybeSingle();

    if (error || !data || !data.value) {
      return defaultTop10Config;
    }

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
    return {
      section_title: parsed?.section_title !== undefined ? parsed.section_title : defaultTop10Config.section_title,
      series_subtitle: parsed?.series_subtitle !== undefined ? parsed.series_subtitle : defaultTop10Config.series_subtitle,
      movies_subtitle: parsed?.movies_subtitle !== undefined ? parsed.movies_subtitle : defaultTop10Config.movies_subtitle,
      limit: typeof parsed?.limit === "number" ? parsed.limit : 5,
    };
  } catch {
    return defaultTop10Config;
  }
}
