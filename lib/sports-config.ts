import { supabaseAdmin } from "@/lib/supabase-admin";

export interface FeaturedSportCard {
  id: string;
  title: string;
  subtitle: string; // Date de sortie de l'événement
  event_time?: string; // Heure de sortie de l'événement (ex: "12h15", "14:30")
  tag: string; // Ex: Cyclisme, Tennis, Sports mécaniques
  start_date?: string; // Date ISO ou date au format AAAA-MM-JJ pour calcul auto
  countdown_text?: string; // Ex: "Commence dans 14 jours" ou HH:MM:SS
  synopsis: string;
  image_url: string;
  link_url?: string;
  is_live?: boolean;
}

export interface CompactSportCard {
  id: string;
  recurrence?: string; // Ex: "Tous les lundis", "Chaque jour", "Tous les week-ends"
  title: string;
  subtitle: string; // Date de sortie de l'événement
  event_time?: string; // Heure de sortie (ex: "19h00", "20h45")
  countdown_text?: string; // Ex: "Commence dans 14 jours" ou "23:59:00"
  start_date?: string; // Date ISO ou AAAA-MM-JJ optionnelle
  image_url: string;
  link_url?: string;
  is_live?: boolean;
}

export interface SportsSectionConfig {
  section_title: string;
  section_subtitle: string;
  button_text: string;
  button_link: string;
  background_url: string;
  featured_events: FeaturedSportCard[];
  compact_events?: CompactSportCard[];
}

export const defaultFeaturedSportsCards: FeaturedSportCard[] = [
  {
    id: "tour-de-france",
    title: "Tour de France 2026",
    subtitle: "4 juillet 2026",
    event_time: "12h15",
    tag: "CYCLISME",
    countdown_text: "23:59:50",
    synopsis:
      "Toutes les étapes en direct et en intégralité sur Eurosport et Max, des cols mythiques des Alpes et Pyrénées jusqu'au sprint final sur les Champs-Élysées.",
    image_url:
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    link_url: "/actualites",
  },
  {
    id: "roland-garros",
    title: "Roland-Garros 2026",
    subtitle: "24 mai 2026",
    event_time: "11h00",
    tag: "TENNIS",
    countdown_text: "Commence dans 21 jours",
    synopsis:
      "Le sommet de la terre battue parisienne avec l'intégralité des courts Philippe-Chatrier et Suzanne-Lenglen en direct ultra-haute définition.",
    image_url:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    link_url: "/actualites",
  },
  {
    id: "24h-du-mans",
    title: "24 Heures du Mans 2026",
    subtitle: "13 juin 2026",
    event_time: "16h00",
    tag: "SPORTS MÉCANIQUES",
    countdown_text: "Commence dans 28 jours",
    synopsis:
      "La plus grande épreuve d'endurance automobile au monde. 24 heures de course continue entre Hypercars Porsche, Ferrari, Toyota, Alpine et Peugeot.",
    image_url:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    link_url: "/actualites",
  },
  {
    id: "us-open-tennis",
    title: "US Open Tennis 2026",
    subtitle: "31 août 2026",
    event_time: "18h00",
    tag: "TENNIS",
    countdown_text: "Commence dans 45 jours",
    synopsis:
      "L'atmosphère survoltée des sessions nocturnes new-yorkaises sur le court Arthur Ashe pour le dernier tournoi du Grand Chelem de l'année.",
    image_url:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
    link_url: "/actualites",
  },
  {
    id: "paris-roubaix",
    title: "Paris-Roubaix 2026",
    subtitle: "12 avril 2026",
    event_time: "10h30",
    tag: "CYCLISME",
    countdown_text: "Commence dans 7 jours",
    synopsis:
      "L'Enfer du Nord et ses légendaires secteurs pavés de la Trouée d'Arenberg jusqu'à l'entrée héroïque dans le vélodrome de Roubaix.",
    image_url:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
    link_url: "/actualites",
  },
];

export const defaultCompactSportsCards: CompactSportCard[] = [
  {
    id: "compact-1",
    recurrence: "Tous les lundis",
    title: "Les Rois de la Pédale - Le Mag",
    subtitle: "Lundi 13 avril 2026",
    event_time: "18h30",
    countdown_text: "Commence dans 4 jours",
    image_url:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-2",
    recurrence: "Tous les week-ends",
    title: "ATP Masters 1000 - En direct",
    subtitle: "Samedi 18 avril 2026",
    event_time: "14h00",
    countdown_text: "Commence dans 9 jours",
    image_url:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-3",
    recurrence: "Chaque vendredi",
    title: "UFC Fight Night - Direct",
    subtitle: "Vendredi 24 avril 2026",
    event_time: "23h00",
    countdown_text: "23:58:30",
    image_url:
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-4",
    recurrence: "Tous les jours",
    title: "Eurosport News Flash",
    subtitle: "Édition quotidienne",
    event_time: "12h00",
    countdown_text: "Disponible sur HBO Max",
    image_url:
      "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-5",
    recurrence: "Chaque dimanche",
    title: "Championnat du Monde de Snooker",
    subtitle: "Dimanche 26 avril 2026",
    event_time: "20h00",
    countdown_text: "Commence dans 17 jours",
    image_url:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-6",
    recurrence: "Tous les samedis",
    title: "Endurance FIM WEC - Qualifications",
    subtitle: "Samedi 2 mai 2026",
    event_time: "15h30",
    countdown_text: "Commence dans 23 jours",
    image_url:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-7",
    recurrence: "Tous les mardis",
    title: "Cyclisme sur Piste - UCI Champions League",
    subtitle: "Mardi 5 mai 2026",
    event_time: "19h15",
    countdown_text: "Commence dans 26 jours",
    image_url:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-8",
    recurrence: "Chaque jeudi",
    title: "Grand Prix Moto - Essais Libres",
    subtitle: "Jeudi 14 mai 2026",
    event_time: "09h30",
    countdown_text: "Commence dans 35 jours",
    image_url:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-9",
    recurrence: "Tous les week-ends",
    title: "WTA 1000 - Demi-finales & Finales",
    subtitle: "Samedi 23 mai 2026",
    event_time: "16h00",
    countdown_text: "Commence dans 44 jours",
    image_url:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
  {
    id: "compact-10",
    recurrence: "Tous les dimanches",
    title: "World Athletics Tour - Direct Meeting",
    subtitle: "Dimanche 31 mai 2026",
    event_time: "17h45",
    countdown_text: "Commence dans 52 jours",
    image_url:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    link_url: "/actualites",
  },
];

export const defaultSportsSectionConfig: SportsSectionConfig = {
  section_title: "Événements sportifs en direct sur HBO Max",
  section_subtitle: "Découvrez les événements sportifs à venir en direct avec Eurosport sur HBO Max.",
  button_text: "Voir tout le sport",
  button_link: "/actualites?sport=1",
  background_url:
    "https://beam-images.warnermediacdn.com/2024-03/max-sports_background-1920x1080.jpg?host=wbd-dotcom-drupal-prd-us-east-1.s3.amazonaws.com",
  featured_events: defaultFeaturedSportsCards,
  compact_events: defaultCompactSportsCards,
};

export function getCountdownDisplay(
  card: { start_date?: string; countdown_text?: string },
  now: number = Date.now()
): string {
  // 1. Vérification si une date cible est spécifiée
  let targetMs: number | null = null;

  if (card.start_date) {
    const parsed = new Date(card.start_date).getTime();
    if (!isNaN(parsed)) {
      targetMs = parsed;
    }
  }

  // 2. Si pas de start_date, mais un texte countdown mentionnant des heures ou format HH:MM:SS
  if (targetMs === null && card.countdown_text) {
    const raw = card.countdown_text.trim().toLowerCase();
    if (raw === "0" || raw === "0s" || raw.includes("disponible")) {
      return "Disponible sur HBO Max";
    }
    const timeMatch = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      const h = Number(timeMatch[1]);
      const m = Number(timeMatch[2]);
      const s = Number(timeMatch[3] || 0);
      targetMs = now + (h * 3600 + m * 60 + s) * 1000;
    } else {
      const hoursMatch = raw.match(/(\d+)\s*h(?:eures?)?/);
      if (hoursMatch) {
        const h = Number(hoursMatch[1]);
        targetMs = now + h * 3600 * 1000;
      }
    }
  }

  // 3. Calcul du compte à rebours précis si targetMs est connu
  if (targetMs !== null) {
    const diff = targetMs - now;
    if (diff <= 0) {
      return "Disponible sur HBO Max";
    }

    // Moins de 24 heures : compte à rebours en HH:MM:SS
    if (diff <= 24 * 3600 * 1000) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `Commence dans ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    // Plus de 24 heures : compte en jours
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `Commence dans ${days} ${days > 1 ? "jours" : "jour"}`;
  }

  // 4. Traitement du texte manuel fallback
  if (card.countdown_text && card.countdown_text.trim()) {
    const raw = card.countdown_text.trim();
    if (raw === "0" || raw.toLowerCase().includes("disponible")) {
      return "Disponible sur HBO Max";
    }
    if (/^\d+$/.test(raw)) {
      const d = Number(raw);
      if (d === 0) return "Disponible sur HBO Max";
      return `Commence dans ${d} ${d > 1 ? "jours" : "jour"}`;
    }
    if (/^\d+\s*jours?$/i.test(raw)) {
      return `Commence dans ${raw}`;
    }
    return raw;
  }

  return "";
}

export async function getSportsSectionConfig(): Promise<SportsSectionConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "sports_section_config")
      .maybeSingle();

    if (error || !data || !data.value) {
      return defaultSportsSectionConfig;
    }

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;

    const featured_events: FeaturedSportCard[] =
      Array.isArray(parsed?.featured_events) && parsed.featured_events.length > 0
        ? parsed.featured_events.map((e: Partial<FeaturedSportCard>, idx: number) => ({
            id: e.id || `event-${idx}`,
            title: e.title?.trim() || defaultFeaturedSportsCards[idx]?.title || "Événement en direct",
            subtitle: e.subtitle?.trim() || defaultFeaturedSportsCards[idx]?.subtitle || "",
            event_time: e.event_time?.trim() || defaultFeaturedSportsCards[idx]?.event_time || "",
            tag: e.tag?.trim() || defaultFeaturedSportsCards[idx]?.tag || "SPORT",
            start_date: e.start_date || defaultFeaturedSportsCards[idx]?.start_date || "",
            countdown_text:
              e.countdown_text?.trim() || defaultFeaturedSportsCards[idx]?.countdown_text || "",
            synopsis: e.synopsis?.trim() || defaultFeaturedSportsCards[idx]?.synopsis || "",
            image_url: e.image_url?.trim() || defaultFeaturedSportsCards[idx]?.image_url || "",
            link_url: e.link_url?.trim() || defaultFeaturedSportsCards[idx]?.link_url || "/actualites",
            is_live: Boolean(e.is_live),
          }))
        : defaultFeaturedSportsCards;

    const compact_events: CompactSportCard[] =
      Array.isArray(parsed?.compact_events) && parsed.compact_events.length > 0
        ? parsed.compact_events.map((e: Partial<CompactSportCard>, idx: number) => ({
            id: e.id || `compact-${idx}`,
            recurrence: e.recurrence?.trim() || defaultCompactSportsCards[idx]?.recurrence || "",
            title: e.title?.trim() || defaultCompactSportsCards[idx]?.title || "Événement sportif",
            subtitle: e.subtitle?.trim() || defaultCompactSportsCards[idx]?.subtitle || "",
            event_time: e.event_time?.trim() || defaultCompactSportsCards[idx]?.event_time || "",
            countdown_text:
              e.countdown_text?.trim() || defaultCompactSportsCards[idx]?.countdown_text || "",
            start_date: e.start_date || defaultCompactSportsCards[idx]?.start_date || "",
            image_url: e.image_url?.trim() || defaultCompactSportsCards[idx]?.image_url || "",
            link_url: e.link_url?.trim() || defaultCompactSportsCards[idx]?.link_url || "/actualites",
            is_live: Boolean(e.is_live),
          }))
        : defaultCompactSportsCards;

    return {
      section_title: parsed?.section_title?.trim() || defaultSportsSectionConfig.section_title,
      section_subtitle: parsed?.section_subtitle?.trim() || defaultSportsSectionConfig.section_subtitle,
      button_text: parsed?.button_text?.trim() || defaultSportsSectionConfig.button_text,
      button_link: parsed?.button_link?.trim() || defaultSportsSectionConfig.button_link,
      background_url: parsed?.background_url?.trim() || defaultSportsSectionConfig.background_url,
      featured_events,
      compact_events,
    };
  } catch {
    return defaultSportsSectionConfig;
  }
}
