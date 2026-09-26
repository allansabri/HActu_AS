import { supabaseAdmin } from "@/lib/supabase-admin";
import { UpcomingRelease, ProductionProject } from "@/lib/types";

export interface NewReleaseCard {
  id: string;
  title: string;
  header_title: string;
  header_subtitle: string;
  genre: string;
  synopsis: string;
  poster_url: string;
  link_url: string;
}

export interface NewAndUpcomingConfig {
  section_title: string;
  section_subtitle: string;
  button_text: string;
  button_link: string;
  week_count: number;
  week_label: string;
  series_count: number;
  series_label: string;
  movies_count: number;
  movies_label: string;
}

export const defaultNewAndUpcomingConfig: NewAndUpcomingConfig = {
  section_title: "Nouveautés & À venir sur HBO Max",
  section_subtitle: "Découvrez tout ce qui arrive sur HBO Max cette semaine, la semaine prochaine et toutes les nouveautés à ne pas manquer.",
  button_text: "Voir tout ce qui arrive",
  button_link: "/prochainement",
  week_count: 30,
  week_label: "Nouveautés de la semaine",
  series_count: 30,
  series_label: "Nouvelles séries en septembre",
  movies_count: 30,
  movies_label: "Nouveaux films en septembre",
};

export async function getNewAndUpcomingConfig(): Promise<NewAndUpcomingConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "new_and_upcoming_section_config")
      .maybeSingle();

    if (error || !data || !data.value) {
      return defaultNewAndUpcomingConfig;
    }

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;

    return {
      section_title: parsed?.section_title?.trim() || defaultNewAndUpcomingConfig.section_title,
      section_subtitle: parsed?.section_subtitle?.trim() || defaultNewAndUpcomingConfig.section_subtitle,
      button_text: parsed?.button_text?.trim() || defaultNewAndUpcomingConfig.button_text,
      button_link: parsed?.button_link?.trim() || defaultNewAndUpcomingConfig.button_link,
      week_count: Number(parsed?.week_count) || defaultNewAndUpcomingConfig.week_count,
      week_label: parsed?.week_label?.trim() || defaultNewAndUpcomingConfig.week_label,
      series_count: Number(parsed?.series_count) || defaultNewAndUpcomingConfig.series_count,
      series_label: parsed?.series_label?.trim() || defaultNewAndUpcomingConfig.series_label,
      movies_count: Number(parsed?.movies_count) || defaultNewAndUpcomingConfig.movies_count,
      movies_label: parsed?.movies_label?.trim() || defaultNewAndUpcomingConfig.movies_label,
    };
  } catch {
    return defaultNewAndUpcomingConfig;
  }
}

export function calculateNewAndUpcomingMetrics(
  releases: UpcomingRelease[],
  movies: ProductionProject[],
  config: NewAndUpcomingConfig,
  referenceDate: Date = new Date()
): NewAndUpcomingConfig {
  const frenchMonth = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(referenceDate);
  const currentYear = referenceDate.getFullYear();
  const currentMonthNum = referenceDate.getMonth() + 1;
  const currentMonthPrefix = `${currentYear}-${String(currentMonthNum).padStart(2, "0")}`;

  // Semaine en cours : Lundi 00:00 à Dimanche 23:59
  const dayOfWeek = referenceDate.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const parseReleaseDate = (dateStr?: string | null): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.slice(0, 10).split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    }
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const isCurrentWeek = (dateStr?: string | null) => {
    const d = parseReleaseDate(dateStr);
    if (!d) return false;
    return d >= monday && d <= sunday;
  };

  const isCurrentMonth = (dateStr?: string | null) => {
    if (!dateStr) return false;
    return dateStr.startsWith(currentMonthPrefix);
  };

  // 1. Calcul automatique : nouveautés de la semaine (toutes sorties et films de la semaine)
  const weekReleases = releases.filter((r) => isCurrentWeek(r.release_date));
  const weekMovies = movies.filter((m) => isCurrentWeek(m.release_date_france || m.release_date_estimated));
  const totalWeekCount = weekReleases.length + weekMovies.length;

  // 2. Calcul automatique : nouvelles séries du mois en cours
  const monthSeries = releases.filter((r) => r.type === "series" && isCurrentMonth(r.release_date));

  // 3. Calcul automatique : nouveaux films du mois en cours
  const monthReleasesMovies = releases.filter((r) => r.type === "movie" && isCurrentMonth(r.release_date));
  const monthCatalogMovies = movies.filter((m) => isCurrentMonth(m.release_date_france || m.release_date_estimated));
  const uniqueMonthMovieTitles = new Set([
    ...monthReleasesMovies.map((m) => m.title.toLowerCase().trim()),
    ...monthCatalogMovies.map((m) => m.title.toLowerCase().trim()),
  ]);
  const totalMonthMoviesCount = uniqueMonthMovieTitles.size;

  // Si des titres sont présents dans le catalogue / base, on affiche le chiffre calculé en temps réel
  const resolvedWeekCount = totalWeekCount > 0 ? totalWeekCount : config.week_count;
  const resolvedSeriesCount = monthSeries.length > 0 ? monthSeries.length : config.series_count;
  const resolvedMoviesCount = totalMonthMoviesCount > 0 ? totalMonthMoviesCount : config.movies_count;

  return {
    ...config,
    week_count: resolvedWeekCount,
    series_count: resolvedSeriesCount,
    series_label: `Nouvelles séries en ${frenchMonth}`,
    movies_count: resolvedMoviesCount,
    movies_label: `Nouveaux films en ${frenchMonth}`,
  };
}

export const defaultNewReleaseCards: NewReleaseCard[] = [
  {
    id: "dune-prophecy",
    title: "Dune: Prophecy",
    header_title: "MAX ORIGINAL",
    header_subtitle: "DISPONIBLE",
    genre: "SCIENCE-FICTION",
    synopsis: "10 000 ans avant l'ascension de Paul Atréides, deux sœurs Harkonnen combattent les forces qui menacent l'humanité.",
    poster_url: "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    link_url: "/actualites/dune-prophecy-nouvelle-serie-originale-hbo",
  },
  {
    id: "the-penguin",
    title: "The Penguin",
    header_title: "DC STUDIOS",
    header_subtitle: "DISPONIBLE",
    genre: "CRIME / DRAME",
    synopsis: "Oz Cobb tente de s'emparer du pouvoir dans les bas-fonds criminels de Gotham City.",
    poster_url: "https://image.tmdb.org/t/p/w500/aKaZpB4wXmG0x4eJ2t2WcO1D4Fk.jpg",
    link_url: "/actualites/the-penguin-colin-farrell-serie-hbo-max-originale",
  },
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    header_title: "HBO ORIGINAL",
    header_subtitle: "NOUVELLE SAISON",
    genre: "DRAME / SURVIE",
    synopsis: "Joel et Ellie poursuivent leur traversée d'une Amérique dévastée, confrontés à de nouvelles menaces.",
    poster_url: "https://image.tmdb.org/t/p/w500/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg",
    link_url: "/series/100088",
  },
  {
    id: "house-of-the-dragon",
    title: "House of the Dragon",
    header_title: "HBO ORIGINAL",
    header_subtitle: "DISPONIBLE",
    genre: "FANTASY / GUERRE",
    synopsis: "La maison Targaryen se fracture alors que la guerre de succession menace Westeros et ses dragons.",
    poster_url: "https://image.tmdb.org/t/p/w500/lP73xk4HGJ9CPxDWouzKzK6j82o.jpg",
    link_url: "/series/94997",
  },
  {
    id: "the-white-lotus",
    title: "The White Lotus",
    header_title: "HBO ORIGINAL",
    header_subtitle: "NOUVELLE SAISON",
    genre: "COMÉDIE / DRAME",
    synopsis: "Une nouvelle cohorte de vacanciers fortunés pose ses valises dans un complexe thaïlandais où les faux-semblants éclatent.",
    poster_url: "https://image.tmdb.org/t/p/w500/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg",
    link_url: "/series/the-white-lotus",
  },
  {
    id: "mickey-17",
    title: "Mickey 17",
    header_title: "WARNER BROS.",
    header_subtitle: "EXCLUSIVITÉ",
    genre: "SCIENCE-FICTION",
    synopsis: "Un employé jetable envoyé coloniser un monde de glace refuse de laisser sa place à son clone de remplacement.",
    poster_url: "https://image.tmdb.org/t/p/w500/pyNXnq8QBWoK3b37RS6C3axwUOy.jpg",
    link_url: "/films/mickey-17",
  },
  {
    id: "hacks",
    title: "Hacks",
    header_title: "MAX ORIGINAL",
    header_subtitle: "NOUVELLE SAISON",
    genre: "COMÉDIE",
    synopsis: "Deborah Vance et Ava poursuivent leur duel comique piquant dans les coulisses du stand-up américain.",
    poster_url: "https://image.tmdb.org/t/p/w500/577eXC8wFQT0eUrJcgznSiFPRmk.jpg",
    link_url: "/actualites/hacks-saison-nouvelle-comedie-hbo-max",
  },
  {
    id: "dune-part-two",
    title: "Dune : Deuxième partie",
    header_title: "WARNER BROS.",
    header_subtitle: "DISPONIBLE",
    genre: "SCIENCE-FICTION",
    synopsis: "Paul Atreides s'allie aux Fremen pour venger sa famille et affronter le destin d'Arrakis.",
    poster_url: "https://image.tmdb.org/t/p/w500/iRNbRAIGQQr5diGnjpwJFm0dgt4.jpg",
    link_url: "/films/dune-deuxieme-partie",
  },
  {
    id: "industry",
    title: "Industry",
    header_title: "HBO ORIGINAL",
    header_subtitle: "DISPONIBLE",
    genre: "DRAME / FINANCE",
    synopsis: "Dans les salles de marchés impitoyables de Londres, l'ambition et les trahisons atteignent leur paroxysme.",
    poster_url: "https://image.tmdb.org/t/p/w500/t9JGg10CW1DzXEdWL54ewkUko6N.jpg",
    link_url: "/series/industry",
  },
  {
    id: "the-batman",
    title: "The Batman",
    header_title: "DC STUDIOS",
    header_subtitle: "DISPONIBLE",
    genre: "ACTION / CRIME",
    synopsis: "Bruce Wayne enquête sur une série de crimes qui révèle la corruption profonde de Gotham City.",
    poster_url: "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    link_url: "/films/the-batman",
  },
];

export const defaultMovieCards: NewReleaseCard[] = [
  {
    id: "movie-the-batman",
    title: "The Batman",
    header_title: "DC STUDIOS",
    header_subtitle: "DISPONIBLE",
    genre: "ACTION / CRIME",
    synopsis: "Bruce Wayne s'enfonce dans les bas-fonds de Gotham pour traquer un tueur en série sadique ciblant l'élite de la ville.",
    poster_url: "https://image.tmdb.org/t/p/w500/t9JGg10CW1DzXEdWL54ewkUko6N.jpg",
    link_url: "/films/the-batman",
  },
  {
    id: "movie-dune-2",
    title: "Dune : Deuxième partie",
    header_title: "WARNER BROS.",
    header_subtitle: "DISPONIBLE",
    genre: "SCIENCE-FICTION",
    synopsis: "Paul Atréides s'unit à Chani et aux Fremen pour mener la révolte contre les conspirateurs qui ont anéanti sa famille.",
    poster_url: "https://image.tmdb.org/t/p/w500/iRNbRAIGQQr5diGnjpwJFm0dgt4.jpg",
    link_url: "/films/dune-deuxieme-partie",
  },
  {
    id: "movie-dark-knight",
    title: "The Dark Knight : Le Chevalier noir",
    header_title: "DC STUDIOS",
    header_subtitle: "CULTE",
    genre: "ACTION / CRIME",
    synopsis: "Batman, le lieutenant Gordon et Harvey Dent s'allient pour éradiquer la pègre, mais le Joker plonge Gotham dans le chaos.",
    poster_url: "https://image.tmdb.org/t/p/w500/pyNXnq8QBWoK3b37RS6C3axwUOy.jpg",
    link_url: "/films/the-dark-knight",
  },
  {
    id: "movie-furiosa",
    title: "Furiosa : Une saga Mad Max",
    header_title: "WARNER BROS.",
    header_subtitle: "DISPONIBLE",
    genre: "ACTION / SF",
    synopsis: "Arrachée à la Terre Verte des Mille Mères, la jeune Furiosa survit aux Terres Dévastées face aux seigneurs de guerre.",
    poster_url: "https://image.tmdb.org/t/p/w500/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg",
    link_url: "/films/furiosa",
  },
  {
    id: "movie-beetlejuice",
    title: "Beetlejuice Beetlejuice",
    header_title: "WARNER BROS.",
    header_subtitle: "EXCLUSIVITÉ",
    genre: "COMÉDIE / FANTASTIQUE",
    synopsis: "Trois générations de la famille Deetz reviennent à Winter River. Quand le portail s'ouvre, le bio-exorciste sème la zizanie.",
    poster_url: "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    link_url: "/films/beetlejuice-beetlejuice",
  },
  {
    id: "movie-joker-2",
    title: "Joker : Folie à Deux",
    header_title: "DC STUDIOS",
    header_subtitle: "ÉVÉNEMENT",
    genre: "DRAME / THRILLER",
    synopsis: "Enfermé à Arkham dans l'attente de son procès, Arthur Fleck trouve l'amour et libère sa folie sur une scène de théâtre.",
    poster_url: "https://image.tmdb.org/t/p/w500/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg",
    link_url: "/films/joker-folie-a-deux",
  },
  {
    id: "movie-barbie",
    title: "Barbie",
    header_title: "WARNER BROS.",
    header_subtitle: "DISPONIBLE",
    genre: "COMÉDIE / AVENTURE",
    synopsis: "Vivant dans le monde rose de Barbie Land, Barbie et Ken partent explorer le monde réel dans une quête existentielle unique.",
    poster_url: "https://image.tmdb.org/t/p/w500/577eXC8wFQT0eUrJcgznSiFPRmk.jpg",
    link_url: "/films/barbie",
  },
  {
    id: "movie-interstellar",
    title: "Interstellar",
    header_title: "WARNER BROS.",
    header_subtitle: "CHEF-D'ŒUVRE",
    genre: "SCIENCE-FICTION",
    synopsis: "Une équipe d'explorateurs franchit une faille spatiotemporelle pour repousser les limites humaines et sauver notre espèce.",
    poster_url: "https://image.tmdb.org/t/p/w500/acevLdSl5I2MK5RYAm7gwAndt1w.jpg",
    link_url: "/films/interstellar",
  },
  {
    id: "movie-inception",
    title: "Inception",
    header_title: "WARNER BROS.",
    header_subtitle: "CULTE",
    genre: "SF / THRILLER",
    synopsis: "Dom Cobb s'infiltre dans les rêves pour voler des secrets industriels avant d'accomplir une ultime mission d'implantation.",
    poster_url: "https://image.tmdb.org/t/p/w500/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    link_url: "/films/inception",
  },
  {
    id: "movie-matrix",
    title: "Matrix",
    header_title: "WARNER BROS.",
    header_subtitle: "CLASSIQUE",
    genre: "SCIENCE-FICTION",
    synopsis: "Neo réalise que la réalité humaine n'est qu'une simulation virtuelle conçue par des machines et s'engage dans la résistance.",
    poster_url: "https://image.tmdb.org/t/p/w500/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg",
    link_url: "/films/matrix",
  },
];

export function buildUpcomingReleaseCards(
  releases: UpcomingRelease[] = [],
  fallbackCards: NewReleaseCard[] = defaultNewReleaseCards
): NewReleaseCard[] {
  const safeReleases = Array.isArray(releases) ? releases : [];
  const safeFallbacks = Array.isArray(fallbackCards) ? fallbackCards : defaultNewReleaseCards;

  const cards: NewReleaseCard[] = safeReleases.map((release) => {
    let headerSubtitle = "PROCHAINEMENT";
    if (release.release_label) {
      headerSubtitle = release.release_label.toUpperCase();
    } else if (release.release_date) {
      const parts = release.release_date.slice(0, 10).split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
        const day = d.getDate();
        const monthStr = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(d);
        headerSubtitle = `LE ${day} ${monthStr.toUpperCase()}`;
      }
    }

    const genre = release.genres?.length
      ? release.genres.slice(0, 2).join(" / ").toUpperCase()
      : release.type === "series" ? "SÉRIE" : "FILM";

    return {
      id: release.id,
      title: release.title,
      header_title: release.platform ? release.platform.toUpperCase() : (release.type === "series" ? "SÉRIE HBO" : "WARNER BROS."),
      header_subtitle: headerSubtitle,
      genre,
      synopsis: release.synopsis || `Découvrez prochainement ${release.title} sur la plateforme HBO Max.`,
      poster_url: release.poster_url || release.banner_url || "https://image.tmdb.org/t/p/w500/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
      link_url: `/prochainement/${release.slug}`,
    };
  });

  const seenTitles = new Set(cards.map((c) => c.title.toLowerCase().trim()));
  for (const fallback of safeFallbacks) {
    if (!seenTitles.has(fallback.title.toLowerCase().trim())) {
      cards.push(fallback);
      seenTitles.add(fallback.title.toLowerCase().trim());
    }
  }

  return cards.slice(0, 10);
}

export function buildMovieCards(
  releases: UpcomingRelease[] = [],
  productionMovies: ProductionProject[] = [],
  fallbackCards: NewReleaseCard[] = defaultMovieCards
): NewReleaseCard[] {
  const safeReleases = Array.isArray(releases) ? releases : [];
  const safeMovies = Array.isArray(productionMovies) ? productionMovies : [];
  const safeFallbacks = Array.isArray(fallbackCards) ? fallbackCards : defaultMovieCards;

  const movieReleases = safeReleases.filter((r) => r.type === "movie");

  const releaseCards: NewReleaseCard[] = movieReleases.map((release) => {
    let headerSubtitle = "DISPONIBLE";
    if (release.release_label) {
      headerSubtitle = release.release_label.toUpperCase();
    } else if (release.release_date) {
      const parts = release.release_date.slice(0, 10).split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
        const day = d.getDate();
        const monthStr = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(d);
        headerSubtitle = `LE ${day} ${monthStr.toUpperCase()}`;
      }
    }

    const genre = release.genres?.length
      ? release.genres.slice(0, 2).join(" / ").toUpperCase()
      : "CINÉMA";

    return {
      id: release.id,
      title: release.title,
      header_title: release.platform ? release.platform.toUpperCase() : "WARNER BROS.",
      header_subtitle: headerSubtitle,
      genre,
      synopsis: release.synopsis || `Retrouvez le film ${release.title} sur HBO Max.`,
      poster_url: release.poster_url || release.banner_url || "https://image.tmdb.org/t/p/w500/t9JGg10CW1DzXEdWL54ewkUko6N.jpg",
      link_url: `/prochainement/${release.slug}`,
    };
  });

  const prodCards: NewReleaseCard[] = safeMovies.map((movie) => {
    const genre = movie.genres?.length
      ? movie.genres.slice(0, 2).join(" / ").toUpperCase()
      : "CINÉMA / WARNER BROS.";

    return {
      id: movie.id,
      title: movie.title,
      header_title: movie.platform ? movie.platform.toUpperCase() : "WARNER BROS.",
      header_subtitle: movie.production_label?.toUpperCase() || (movie.status === "Sorti" ? "DISPONIBLE" : "AU CATALOGUE"),
      genre,
      synopsis: movie.synopsis || `Découvrez le film ${movie.title} disponible sur HBO Max.`,
      poster_url: movie.poster_url || movie.banner_url || movie.image_url || "https://image.tmdb.org/t/p/w500/t9JGg10CW1DzXEdWL54ewkUko6N.jpg",
      link_url: `/films`,
    };
  });

  const cards: NewReleaseCard[] = [...releaseCards, ...prodCards];
  const seenTitles = new Set(cards.map((c) => c.title.toLowerCase().trim()));

  for (const fallback of safeFallbacks) {
    if (!seenTitles.has(fallback.title.toLowerCase().trim())) {
      cards.push(fallback);
      seenTitles.add(fallback.title.toLowerCase().trim());
    }
  }

  return cards.slice(0, 10);
}
