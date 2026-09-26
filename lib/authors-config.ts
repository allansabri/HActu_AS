import { supabasePublic } from "@/lib/supabase-public";
import { Article } from "@/lib/types";

export type AuthorSocials = {
  twitter?: string | null; // e.g. "hbomax_fr"
  instagram?: string | null; // e.g. "hbomax_fr"
  facebook?: string | null; // e.g. "hbomaxfr"
  youtube?: string | null; // e.g. "hbomaxfrance"
  linkedin?: string | null;
  tiktok?: string | null;
};

export type AuthorItem = {
  id: string;
  name: string;
  slug?: string; // URL slug e.g. "allan", "thomas-renard"
  avatar_url?: string | null;
  banner_url?: string | null; // TMDB or custom banner
  banner_title?: string | null; // Nom de la série ou du film choisi
  bio?: string | null; // Bio de l'auteur
  joined_date?: string | null; // Date d'inscription (ex: "2025-10-02")
  socials?: AuthorSocials;
  articles_last_30_days: number;
  total_articles?: number;
  last_article_date: string;
  recent_article_title: string;
  recent_article_url: string;
};

export type AuthorsSectionConfig = {
  section_title: string;
  items: AuthorItem[];
};

export function slugifyAuthor(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const defaultAuthors: AuthorItem[] = [
  {
    id: "author-allan",
    name: "Allan",
    slug: "allan",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    banner_title: "Dune: Prophecy",
    bio: "Passionné d'univers fantastiques, de science-fiction et des productions HBO. Rédacteur en chef et créateur de contenu pour HBO Max France.",
    joined_date: "2025-10-02T10:00:00.000Z",
    socials: {
      twitter: "allan_hbomax",
      instagram: "allan.cine",
      facebook: "allan.redac",
    },
    articles_last_30_days: 15,
    total_articles: 52,
    last_article_date: "2026-09-26T12:00:00.000Z",
    recent_article_title: "« DUNE : PROPHECY » | LA SÉRIE ORIGINALE HBO MAX DÉVOILE SA BANDE-ANNONCE OFFICIELLE",
    recent_article_url: "/actualites/dune-prophecy-nouvelle-serie-originale-hbo",
  },
  {
    id: "author-1",
    name: "Thomas Renard",
    slug: "thomas-renard",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/acevLdSl5I2MK5RYAm7gwAndt1w.jpg",
    banner_title: "The Last of Us",
    bio: "Chroniqueur séries télévisées et drames acclamés. Suivi rigoureux des productions HBO, de The Wire jusqu'à The Last of Us.",
    joined_date: "2025-11-14T08:30:00.000Z",
    socials: {
      twitter: "thomas_renard",
      instagram: "thomas.series",
    },
    articles_last_30_days: 14,
    total_articles: 41,
    last_article_date: "2026-09-25T11:30:00.000Z",
    recent_article_title: "« THE LAST OF US » | LA SAISON 2 DÉVOILE SA DATE DE DIFFUSION ET SES PREMIÈRES IMAGES",
    recent_article_url: "/actualites/the-last-of-us-saison-2-date-diffusion-premieres-images",
  },
  {
    id: "author-2",
    name: "Sophie Martin",
    slug: "sophie-martin",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/etj5CuHaHzXx5n5rQo3JvF3j9h.jpg",
    banner_title: "House of the Dragon",
    bio: "Spécialiste de l'univers de George R.R. Martin, des intrigues de Westeros et des grandes fresques médiévales fantastiques.",
    joined_date: "2025-12-05T14:15:00.000Z",
    socials: {
      twitter: "sophie_westeros",
      instagram: "sophiemartin_cine",
    },
    articles_last_30_days: 11,
    total_articles: 38,
    last_article_date: "2026-09-24T15:20:00.000Z",
    recent_article_title: "« HOUSE OF THE DRAGON » | LA SAISON 3 ENTRE OFFICIELLEMENT EN PRODUCTION",
    recent_article_url: "/actualites/house-of-the-dragon-saison-3-production-officielle",
  },
  {
    id: "author-3",
    name: "Alexandre D.",
    slug: "alexandre-d",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg",
    banner_title: "Lanterns",
    bio: "Féru de bandes dessinées et de cinéma super-héroïque. Au cœur des actualités de DC Studios, James Gunn et Warner Bros.",
    joined_date: "2026-01-10T11:00:00.000Z",
    socials: {
      twitter: "alex_dcstudios",
      youtube: "AlexandreComics",
    },
    articles_last_30_days: 9,
    total_articles: 29,
    last_article_date: "2026-09-23T09:45:00.000Z",
    recent_article_title: "« LANTERNS » | LA NOUVELLE SÉRIE DC STUDIOS ET HBO DÉVOILE SA BANDE-ANNONCE",
    recent_article_url: "/actualites/lanterns-serie-dc-studios-hbo-bande-annonce-officielle",
  },
  {
    id: "author-4",
    name: "Camille Roussel",
    slug: "camille-roussel",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    banner_title: "Dune: Deuxième Partie",
    bio: "Analyste cinéma et grands réalisateurs contemporains. De Denis Villeneuve à Christopher Nolan.",
    joined_date: "2026-01-22T16:40:00.000Z",
    socials: {
      twitter: "camille_roussel",
      instagram: "camilleroussel_critique",
    },
    articles_last_30_days: 8,
    total_articles: 24,
    last_article_date: "2026-09-22T14:10:00.000Z",
    recent_article_title: "« DUNE : DEUXIÈME PARTIE » | LE MONUMENT DU CINÉMA DE SCIENCE-FICTION",
    recent_article_url: "/actualites/dune-deuxieme-partie-rejoint-les-incontournables-science-fiction",
  },
  {
    id: "author-5",
    name: "Marc Lemaire",
    slug: "marc-lemaire",
    avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/13tEG5KN14i7W1p07z88yvU3zR5.jpg",
    banner_title: "The Penguin",
    bio: "Spécialiste du Batman Universe et des thrillers noirs. Suivi des projets Warner Bros. Discovery.",
    joined_date: "2026-02-05T09:20:00.000Z",
    socials: {
      twitter: "marc_lemaire_tv",
    },
    articles_last_30_days: 10,
    total_articles: 33,
    last_article_date: "2026-09-21T18:00:00.000Z",
    recent_article_title: "« THE PENGUIN » | LA SÉRIE ÉVÉNEMENT DU BATMAN UNIVERSE TRIOMPHE SUR MAX",
    recent_article_url: "/actualites/the-penguin-serie-batman-universe-triomphe-max",
  },
  {
    id: "author-6",
    name: "Élodie Chen",
    slug: "elodie-chen",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/x26Mw1dH6F89G12L0f074dJ7m1r.jpg",
    banner_title: "Tokyo Vice",
    bio: "Exploratrice de séries internationales, créations asiatiques et productions originales HBO d'outre-mer.",
    joined_date: "2026-02-18T14:00:00.000Z",
    socials: {
      instagram: "elodie_tokyotv",
      twitter: "elodiechen_press",
    },
    articles_last_30_days: 7,
    total_articles: 19,
    last_article_date: "2026-09-20T10:15:00.000Z",
    recent_article_title: "« TOKYO VICE » | LA SÉRIE INTERNATIONALE ÉVÉNEMENT EN INTÉGRALITÉ",
    recent_article_url: "/actualites/tokyo-vice-serie-internationale-integrale-hbo-max",
  },
  {
    id: "author-7",
    name: "Julien Vasseur",
    slug: "julien-vasseur",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1280&q=80",
    banner_title: "Roland-Garros & Eurosport",
    bio: "Journaliste sport et grand reporter Eurosport sur la plateforme Max. Tennis, cyclisme et sports d'endurance.",
    joined_date: "2026-03-01T10:30:00.000Z",
    socials: {
      twitter: "julien_vasseur_sport",
    },
    articles_last_30_days: 12,
    total_articles: 35,
    last_article_date: "2026-09-19T16:40:00.000Z",
    recent_article_title: "« ROLAND-GARROS & GRAND CHELEM » | TOUT LE SPORT EN DIRECT SUR MAX",
    recent_article_url: "/actualites/roland-garros-cyclisme-sport-direct-pass-warner-max",
  },
  {
    id: "author-8",
    name: "Léa Fontaine",
    slug: "lea-fontaine",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/q8p8jQn1K97f5u17m87bN28yq.jpg",
    banner_title: "The White Lotus",
    bio: "Chroniques sociétales, comédies satiriques et documentaires exclusifs de la marque HBO.",
    joined_date: "2026-03-12T15:20:00.000Z",
    socials: {
      instagram: "lea_fontaine_series",
      twitter: "lea_fontaine_hbo",
    },
    articles_last_30_days: 6,
    total_articles: 17,
    last_article_date: "2026-09-18T13:00:00.000Z",
    recent_article_title: "« THE WHITE LOTUS » | LA SAISON 3 DÉVOILE SON CASTING ET SON DÉCOR",
    recent_article_url: "/actualites/the-white-lotus-saison-3-casting-thailande-date",
  },
  {
    id: "author-9",
    name: "Nicolas Morel",
    slug: "nicolas-morel",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/x26Mw1dH6F89G12L0f074dJ7m1r.jpg",
    banner_title: "Superman",
    bio: "Veille box-office, sorties en salles Warner Bros. Pictures et évolution de l'industrie hollywoodienne.",
    joined_date: "2026-03-25T11:45:00.000Z",
    socials: {
      twitter: "nicolasmorel_boxoffice",
    },
    articles_last_30_days: 8,
    total_articles: 21,
    last_article_date: "2026-09-17T09:30:00.000Z",
    recent_article_title: "« SUPERMAN » | JAMES GUNN DÉVOILE LES COULISSES DU TOURNAGE",
    recent_article_url: "/actualites/superman-james-gunn-nouveau-film-cinema-warner",
  },
  {
    id: "author-10",
    name: "Inès Benali",
    slug: "ines-benali",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1280&q=80",
    banner_title: "Une Amie Dévouée",
    bio: "Suivi des productions françaises de Max, des talents hexagonaux et des séries francophones.",
    joined_date: "2026-04-04T09:10:00.000Z",
    socials: {
      instagram: "ines_benali_cinema",
      twitter: "inesbenali_tv",
    },
    articles_last_30_days: 7,
    total_articles: 18,
    last_article_date: "2026-09-16T17:15:00.000Z",
    recent_article_title: "« UNE AMIE DÉVOUÉE » | LA CRÉATION ORIGINALE HBO MAX FRANÇAISE",
    recent_article_url: "/actualites/une-amie-devouee-laure-calamy-serie-francaise-max",
  },
  {
    id: "author-11",
    name: "Antoine Girard",
    slug: "antoine-girard",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    banner_title: "Creature Commandos",
    bio: "Critique d'animation pour adultes, Cartoon Network, Adult Swim et univers fantastiques DC.",
    joined_date: "2026-04-18T13:00:00.000Z",
    socials: {
      twitter: "antoine_anim",
    },
    articles_last_30_days: 9,
    total_articles: 26,
    last_article_date: "2026-09-15T12:00:00.000Z",
    recent_article_title: "« CREATURE COMMANDOS » | L'ANIMATION DC STUDIOS DÉBUTE EN EXCLUSIVITÉ",
    recent_article_url: "/actualites/creature-commandos-dc-studios-animation-max",
  },
  {
    id: "author-12",
    name: "Sarah Belkacem",
    slug: "sarah-belkacem",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=360&q=80",
    banner_url: "https://image.tmdb.org/t/p/w1280/etj5CuHaHzXx5n5rQo3JvF3j9h.jpg",
    banner_title: "A Knight of the Seven Kingdoms",
    bio: "Actualité en temps réel des tournages, annonces de casting et rumeurs confirmées de l'écosystème Warner.",
    joined_date: "2026-05-02T16:30:00.000Z",
    socials: {
      twitter: "sarah_belkacem_news",
      instagram: "sarahb_hbo",
    },
    articles_last_30_days: 11,
    total_articles: 30,
    last_article_date: "2026-09-14T14:50:00.000Z",
    recent_article_title: "« A KNIGHT OF THE SEVEN KINGDOMS » | LE SPIN-OFF GAME OF THRONES SE DÉVOILE",
    recent_article_url: "/actualites/a-knight-of-the-seven-kingdoms-spin-off-game-of-thrones",
  },
];

export const defaultAuthorsSectionConfig: AuthorsSectionConfig = {
  section_title: "Nos auteurs",
  items: defaultAuthors,
};

export function findAuthorByName(name?: string | null): AuthorItem | undefined {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return defaultAuthors.find(
    (a) =>
      a.name.toLowerCase() === normalized ||
      a.name.toLowerCase().includes(normalized) ||
      normalized.includes(a.name.toLowerCase()) ||
      a.slug === slugifyAuthor(name)
  );
}

export function findAuthorBySlug(slug?: string | null): AuthorItem | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return defaultAuthors.find(
    (a) =>
      (a.slug || slugifyAuthor(a.name)).toLowerCase() === normalized ||
      a.id.toLowerCase() === normalized ||
      slugifyAuthor(a.name) === normalized
  );
}

/**
 * Synchronise dynamiquement les auteurs avec les articles réels publiés :
 * - Met à jour le titre et le lien de l'article récent
 * - Calcule le nombre exact d'articles publiés au cours des 30 derniers jours
 * - Calcule le total d'articles publiés
 * - Met à jour la date du dernier article publié
 */
export function syncAuthorsWithArticles(
  authors: AuthorItem[],
  articles: Article[] = []
): AuthorItem[] {
  if (!articles || articles.length === 0) {
    return authors.map((a) => ({
      ...a,
      slug: a.slug || slugifyAuthor(a.name),
      total_articles: a.total_articles || a.articles_last_30_days || 1,
    }));
  }

  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  return authors.map((author) => {
    const authorSlug = author.slug || slugifyAuthor(author.name);
    const authorLower = author.name.trim().toLowerCase();

    // Tous les articles publiés par cet auteur
    const authored = articles.filter((art) => {
      if (art.status !== "published") return false;
      const artAuthor = (art.author_name || "").trim().toLowerCase();
      return (
        artAuthor === authorLower ||
        art.author_id === author.id ||
        (author.id === "author-allan" && (!art.author_name || artAuthor === "allan"))
      );
    });

    if (authored.length === 0) {
      return {
        ...author,
        slug: authorSlug,
        total_articles: author.total_articles || author.articles_last_30_days || 1,
      };
    }

    // Tri par date de publication décroissante
    authored.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });

    const latest = authored[0];
    const articlesLast30Days = authored.filter((art) => {
      const artTime = new Date(art.published_at || art.created_at).getTime();
      return now - artTime <= thirtyDaysMs;
    }).length;

    return {
      ...author,
      slug: authorSlug,
      articles_last_30_days: Math.max(articlesLast30Days, 1),
      total_articles: Math.max(authored.length, author.total_articles || 1),
      last_article_date: latest.published_at || latest.created_at,
      recent_article_title: latest.title,
      recent_article_url: `/actualites/${latest.slug}`,
    };
  });
}

export async function getAuthorsSectionConfig(
  articles?: Article[]
): Promise<AuthorsSectionConfig> {
  let baseConfig = defaultAuthorsSectionConfig;

  try {
    const { data } = await supabasePublic
      .from("site_settings")
      .select("value")
      .eq("key", "authors_section_config")
      .maybeSingle();

    if (data?.value) {
      const parsed = JSON.parse(data.value);
      baseConfig = {
        section_title: parsed.section_title || defaultAuthorsSectionConfig.section_title,
        items:
          Array.isArray(parsed.items) && parsed.items.length > 0
            ? parsed.items
            : defaultAuthors,
      };
    }
  } catch {
    // ignore
  }

  // Synchronisation dynamique avec les articles publiés
  const syncedItems = syncAuthorsWithArticles(baseConfig.items, articles);

  return {
    ...baseConfig,
    items: syncedItems,
  };
}
