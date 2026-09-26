import { supabaseAdmin } from "@/lib/supabase-admin";

export interface FeaturedEpisodeCard {
  id: string;
  series_title: string; // Ex: "Lanterns"
  episode_number: string; // Ex: "Épisode 1"
  episode_title?: string; // Ex: "Dans les profondeurs de l'Amérique"
  release_day?: string; // Ex: "Tous les lundis"
  release_time?: string; // Ex: "03h00"
  tag?: string; // Ex: "HBO ORIGINAL", "MAX ORIGINAL", "FINAL DE SAISON"
  countdown_text?: string; // Ex: "DISPONIBLE DÈS 03H00 (VF & VOSTFR)"
  synopsis: string;
  image_url: string;
  link_url?: string;
  is_new?: boolean;
}

export interface CompactEpisodeCard {
  id: string;
  recurrence?: string; // Ex: "TOUS LES LUNDIS", "CE MERCREDI"
  series_title: string; // Ex: "Lanterns"
  episode_number: string; // Ex: "Épisode 1"
  episode_title?: string; // Ex: "Dans les profondeurs de l'Amérique"
  release_time?: string; // Ex: "03h00"
  countdown_text?: string; // Ex: "28 sept." ou "Ce lundi"
  image_url: string;
  link_url?: string;
  is_new?: boolean;
}

export interface UpcomingEpisodesConfig {
  section_title: string;
  section_subtitle: string;
  button_text: string;
  button_link: string;
  background_url?: string;
  featured_episodes: FeaturedEpisodeCard[];
  compact_episodes: CompactEpisodeCard[];
}

export const defaultFeaturedEpisodes: FeaturedEpisodeCard[] = [
  {
    id: "ep-lanterns-1",
    series_title: "Lanterns",
    episode_number: "Épisode 1",
    episode_title: "Dans les profondeurs de l'Amérique",
    release_day: "Tous les lundis",
    release_time: "03h00",
    tag: "HBO ORIGINAL",
    countdown_text: "DISPONIBLE DÈS 03H00 (VF & VOSTFR)",
    synopsis: "Hal Jordan, officier intergalactique chevronné, et sa jeune recrue John Stewart sont dépêchés sur Terre pour élucider un crime mystérieux au cœur des États-Unis.",
    image_url: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    link_url: "/prochainement/lanterns",
    is_new: true,
  },
  {
    id: "ep-penguin-8",
    series_title: "The Penguin",
    episode_number: "Épisode 8",
    episode_title: "Une grande ou une petite chose",
    release_day: "Tous les lundis",
    release_time: "03h00",
    tag: "FINAL DE SAISON",
    countdown_text: "FINAL DE SAISON ÉVÉNEMENT",
    synopsis: "L'affrontement sans pitié pour le trône de Gotham atteint son apogée. Oz Cobb abat ses dernières cartes face à Sofia Falcone dans un dénouement explosif.",
    image_url: "https://image.tmdb.org/t/p/w1280/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    link_url: "/prochainement",
    is_new: true,
  },
  {
    id: "ep-dune-prophecy-1",
    series_title: "Dune: Prophecy",
    episode_number: "Épisode 1",
    episode_title: "La Voix Cachée",
    release_day: "Tous les lundis",
    release_time: "03h00",
    tag: "MAX ORIGINAL",
    countdown_text: "NOUVEAU - EN LIGNE À 03H00",
    synopsis: "Dix mille ans avant Paul Atréides, deux sœurs de la maison Harkonnen combattent des conspirations qui menacent l'humanité et établissent la mythique sororité du Bene Gesserit.",
    image_url: "https://image.tmdb.org/t/p/w1280/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    link_url: "/prochainement",
    is_new: true,
  },
  {
    id: "ep-white-lotus-1",
    series_title: "The White Lotus",
    episode_number: "Épisode 1",
    episode_title: "Bienvenue en Thaïlande",
    release_day: "Tous les lundis",
    release_time: "03h00",
    tag: "SAISON 3",
    countdown_text: "DIFFUSION EN SIMULTANÉ",
    synopsis: "Une nouvelle cohorte de voyageurs fortunés prend ses quartiers dans un somptueux complexe hôtelier thaïlandais, où faux-semblants et tensions mystiques s'entremêlent rapidement.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80",
    link_url: "/prochainement",
    is_new: true,
  },
  {
    id: "ep-the-last-of-us-1",
    series_title: "The Last of Us",
    episode_number: "Épisode 1",
    episode_title: "Les Échos de Jackson",
    release_day: "Tous les lundis",
    release_time: "03h00",
    tag: "HBO ORIGINAL",
    countdown_text: "SAISON 2 TRÈS PROCHAINEMENT",
    synopsis: "Cinq ans après les événements dramatiques de Salt Lake City, Joel et Ellie tentent de mener une existence normale à Jackson, mais leur passé ne tarde pas à ressurgir.",
    image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1280&q=80",
    link_url: "/prochainement",
    is_new: true,
  },
];

export const defaultCompactEpisodes: CompactEpisodeCard[] = [
  {
    id: "c-ep-lanterns",
    recurrence: "TOUS LES LUNDIS",
    series_title: "Lanterns",
    episode_number: "Épisode 1",
    episode_title: "Dans les profondeurs de l'Amérique",
    release_time: "03h00",
    countdown_text: "Ce lundi",
    image_url: "https://image.tmdb.org/t/p/w500/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    link_url: "/prochainement/lanterns",
    is_new: true,
  },
  {
    id: "c-ep-penguin",
    recurrence: "TOUS LES LUNDIS",
    series_title: "The Penguin",
    episode_number: "Épisode 8",
    episode_title: "Une grande ou une petite chose",
    release_time: "03h00",
    countdown_text: "Final",
    image_url: "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    link_url: "/prochainement",
    is_new: true,
  },
  {
    id: "c-ep-dune",
    recurrence: "TOUS LES LUNDIS",
    series_title: "Dune: Prophecy",
    episode_number: "Épisode 2",
    episode_title: "Deux Sœurs dans l'ombre",
    release_time: "03h00",
    countdown_text: "En ligne",
    image_url: "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    link_url: "/prochainement",
    is_new: false,
  },
  {
    id: "c-ep-paolo",
    recurrence: "TOUS LES MERCREDIS",
    series_title: "Paolo",
    episode_number: "Épisode 3",
    episode_title: "Les liens du sang",
    release_time: "20h50",
    countdown_text: "Mercredi",
    image_url: "/series-a-venir/paolo.jpg",
    link_url: "/prochainement/paolo",
    is_new: true,
  },
  {
    id: "c-ep-the-pitt",
    recurrence: "TOUS LES JEUDIS",
    series_title: "The Pitt",
    episode_number: "Épisode 1",
    episode_title: "Urgence vitale à Pittsburgh",
    release_time: "09h00",
    countdown_text: "Jeudi",
    image_url: "/series-a-venir/the-pitt.jpg",
    link_url: "/prochainement/the-pitt",
    is_new: true,
  },
  {
    id: "c-ep-white-lotus",
    recurrence: "TOUS LES LUNDIS",
    series_title: "The White Lotus",
    episode_number: "Épisode 1",
    episode_title: "Bienvenue en Thaïlande",
    release_time: "03h00",
    countdown_text: "Lundi",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
    link_url: "/prochainement",
    is_new: true,
  },
  {
    id: "c-ep-industry",
    recurrence: "TOUS LES MARDIS",
    series_title: "Industry",
    episode_number: "Épisode 6",
    episode_title: "Marchés volatils",
    release_time: "03h00",
    countdown_text: "Mardi",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80",
    link_url: "/prochainement",
    is_new: false,
  },
  {
    id: "c-ep-hacks",
    recurrence: "TOUS LES VENDREDIS",
    series_title: "Hacks",
    episode_number: "Épisode 5",
    episode_title: "Le Grand Gala",
    release_time: "09h00",
    countdown_text: "Vendredi",
    image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80",
    link_url: "/prochainement",
    is_new: false,
  },
];

export const defaultUpcomingEpisodesConfig: UpcomingEpisodesConfig = {
  section_title: "Prochainement sur HBO Max",
  section_subtitle: "Découvrez les nouveaux épisodes de la semaine, les horaires de diffusion et toutes les sorties à ne pas manquer sur HBO Max.",
  button_text: "Voir tout le calendrier",
  button_link: "/prochainement",
  background_url: "https://i.ibb.co/GfJ3GBvY/Bandes-diagonales-abstraites-bleu-nuit.png",
  featured_episodes: defaultFeaturedEpisodes,
  compact_episodes: defaultCompactEpisodes,
};

export async function getUpcomingEpisodesConfig(): Promise<UpcomingEpisodesConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "upcoming_episodes_section_config")
      .maybeSingle();

    if (error || !data || !data.value) {
      return defaultUpcomingEpisodesConfig;
    }

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;

    return {
      section_title: parsed?.section_title?.trim() || defaultUpcomingEpisodesConfig.section_title,
      section_subtitle: parsed?.section_subtitle?.trim() || defaultUpcomingEpisodesConfig.section_subtitle,
      button_text: parsed?.button_text?.trim() || defaultUpcomingEpisodesConfig.button_text,
      button_link: parsed?.button_link?.trim() || defaultUpcomingEpisodesConfig.button_link,
      background_url: parsed?.background_url?.trim() || defaultUpcomingEpisodesConfig.background_url,
      featured_episodes:
        Array.isArray(parsed?.featured_episodes) && parsed.featured_episodes.length > 0
          ? parsed.featured_episodes
          : defaultUpcomingEpisodesConfig.featured_episodes,
      compact_episodes:
        Array.isArray(parsed?.compact_episodes) && parsed.compact_episodes.length > 0
          ? parsed.compact_episodes
          : defaultUpcomingEpisodesConfig.compact_episodes,
    };
  } catch {
    return defaultUpcomingEpisodesConfig;
  }
}
