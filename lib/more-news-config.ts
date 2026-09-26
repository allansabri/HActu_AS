import { supabaseAdmin } from "@/lib/supabase-admin";

export interface MoreNewsConfig {
  section_title: string;
  newsletter_title: string;
  newsletter_subtitle: string;
  sidebar_title: string;
}

export const defaultMoreNewsConfig: MoreNewsConfig = {
  section_title: "Encore plus d'actualités",
  newsletter_title: "Restez au cœur de l'actualité Max",
  newsletter_subtitle: "Recevez en avant-première les sorties, bandes-annonces et exclusivités du catalogue HBO Max.",
  sidebar_title: "À ne pas manquer",
};

export async function getMoreNewsConfig(): Promise<MoreNewsConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "more_news_section_config")
      .maybeSingle();

    if (error || !data || !data.value) {
      return defaultMoreNewsConfig;
    }

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
    return {
      section_title: parsed?.section_title?.trim() || defaultMoreNewsConfig.section_title,
      newsletter_title: parsed?.newsletter_title?.trim() || defaultMoreNewsConfig.newsletter_title,
      newsletter_subtitle: parsed?.newsletter_subtitle?.trim() || defaultMoreNewsConfig.newsletter_subtitle,
      sidebar_title: parsed?.sidebar_title?.trim() || defaultMoreNewsConfig.sidebar_title,
    };
  } catch {
    return defaultMoreNewsConfig;
  }
}
