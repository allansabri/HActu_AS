import { UpcomingSeriesBannerConfig, UpcomingSeriesCard } from "@/lib/types";
import { supabasePublic } from "@/lib/supabase-public";

export const defaultUpcomingSeriesCards: UpcomingSeriesCard[] = [
  {
    id: "series-lanterns",
    series_id: "95350",
    title: "Lanterns",
    badge: "Disponible",
    poster_url: "/series-a-venir/lanterns.jpg",
    accent_color: "#00e5ff",
    link_url: "/prochainement/lanterns"
  },
  {
    id: "series-war",
    series_id: "82670",
    title: "War",
    badge: "Le 2 octobre",
    poster_url: "/series-a-venir/war.jpg",
    accent_color: "#f59e0b",
    link_url: "/prochainement/war"
  },
  {
    id: "series-paolo",
    series_id: "288385",
    title: "Paolo",
    badge: "Le 24 septembre",
    poster_url: "/series-a-venir/paolo.jpg",
    accent_color: "#10b981",
    link_url: "/prochainement/paolo"
  },
  {
    id: "series-harry-potter",
    series_id: "224377",
    title: "Harry Potter",
    badge: "À Noël",
    poster_url: "/series-a-venir/harry-potter.jpg",
    accent_color: "#eab308",
    link_url: "/prochainement/harry-potter"
  },
  {
    id: "series-the-pitt",
    series_id: "250307",
    title: "The Pitt",
    badge: "En 2027",
    poster_url: "/series-a-venir/the-pitt.jpg",
    accent_color: "#38bdf8",
    link_url: "/prochainement/the-pitt"
  },
  {
    id: "series-knight-seven-kingdoms",
    series_id: "224372",
    title: "A Knight of the Seven Kingdoms",
    badge: "En 2027",
    poster_url: "/series-a-venir/knight-seven-kingdoms.jpg",
    accent_color: "#f97316",
    link_url: "/prochainement/a-knight-of-the-seven-kingdoms"
  }
];

export const defaultUpcomingSeriesBanner: UpcomingSeriesBannerConfig = {
  title: "À venir en 2026",
  cards: defaultUpcomingSeriesCards
};

export const knownSeriesCatalog: Record<string, { title: string; poster_url: string; badge: string; accent_color: string }> = {
  "95350": {
    title: "Lanterns",
    poster_url: "/series-a-venir/lanterns.jpg",
    badge: "Disponible",
    accent_color: "#00e5ff"
  },
  "82670": {
    title: "War",
    poster_url: "/series-a-venir/war.jpg",
    badge: "Le 2 octobre",
    accent_color: "#f59e0b"
  },
  "288385": {
    title: "Paolo",
    poster_url: "/series-a-venir/paolo.jpg",
    badge: "Le 24 septembre",
    accent_color: "#10b981"
  },
  "224377": {
    title: "Harry Potter",
    poster_url: "/series-a-venir/harry-potter.jpg",
    badge: "À Noël",
    accent_color: "#eab308"
  },
  "250307": {
    title: "The Pitt",
    poster_url: "/series-a-venir/the-pitt.jpg",
    badge: "En 2027",
    accent_color: "#38bdf8"
  },
  "224372": {
    title: "A Knight of the Seven Kingdoms",
    poster_url: "/series-a-venir/knight-seven-kingdoms.jpg",
    badge: "En 2027",
    accent_color: "#f97316"
  },
  "94997": {
    title: "House of the Dragon",
    poster_url: "https://image.tmdb.org/t/p/w500/lP73xk4HGJ9CPxDWouzKzK6j82o.jpg",
    badge: "Saison 3",
    accent_color: "#ef4444"
  },
  "100088": {
    title: "The Last of Us",
    poster_url: "https://image.tmdb.org/t/p/w500/acevLdSl5I2MK5RYAm7gwAndt1w.jpg",
    badge: "Saison 3",
    accent_color: "#10b981"
  },
  "124834": {
    title: "The Penguin",
    poster_url: "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    badge: "Disponible",
    accent_color: "#a855f7"
  },
  "106379": {
    title: "Dune: Prophecy",
    poster_url: "https://image.tmdb.org/t/p/w500/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    badge: "Disponible",
    accent_color: "#f59e0b"
  }
};

export async function getUpcomingSeriesBanner(): Promise<UpcomingSeriesBannerConfig> {
  try {
    const { data, error } = await supabasePublic
      .from("site_settings")
      .select("key, value")
      .in("key", ["upcoming_series_banner_title", "upcoming_series_banner_items"]);

    if (error || !data || data.length === 0) {
      return defaultUpcomingSeriesBanner;
    }

    const settingsMap = Object.fromEntries(data.map((item) => [item.key, item.value]));
    const title = settingsMap.upcoming_series_banner_title?.trim() || defaultUpcomingSeriesBanner.title;
    
    let cards = defaultUpcomingSeriesCards;
    if (settingsMap.upcoming_series_banner_items) {
      try {
        const parsed = JSON.parse(settingsMap.upcoming_series_banner_items);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cards = parsed;
        }
      } catch {
        cards = defaultUpcomingSeriesCards;
      }
    }

    return {
      title,
      cards
    };
  } catch {
    return defaultUpcomingSeriesBanner;
  }
}
