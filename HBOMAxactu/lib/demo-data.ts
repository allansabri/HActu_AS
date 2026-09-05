import { todayIso } from "@/lib/format";
import { AdminCollection, Article, ProductionProject, Top10Item } from "@/lib/types";

const now = "2026-06-04T10:00:00.000Z";
const tmdbImage = (path: string, size: "w500" | "w1280" = "w500") =>
  `https://image.tmdb.org/t/p/${size}${path}`;

export const demoArticles: Article[] = [
  {
    id: "demo-article-the-last-of-us-s3",
    title: "The Last of Us saison 3 : ce que Max peut deja preparer",
    slug: "the-last-of-us-saison-3-ce-que-max-peut-deja-preparer",
    content:
      "Apres une deuxieme saison tres surveillee, The Last of Us reste l'une des marques fortes de HBO. La suite devrait continuer a melanger recit intime, survie et grandes sequences de tension.\n\nPour Max, l'enjeu est clair : garder l'evenement vivant entre deux saisons avec bandes-annonces, entretiens, recapitulatif des episodes et dossiers sur les personnages. C'est exactement le type de contenu qui peut nourrir une page actualite comme celle-ci.\n\nCette fiche utilise des visuels TMDB pour donner un rendu proche d'un vrai site editorial.",
    excerpt:
      "La serie HBO reste un pilier de Max : calendrier, personnages et attentes, voici le type d'article qui peut alimenter le site.",
    image_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=uLtkt8BonwM",
    category: "Series",
    status: "published",
    author_id: null,
    published_at: "2026-06-03T08:30:00.000Z",
    created_at: "2026-06-03T08:30:00.000Z",
    updated_at: now
  },
  {
    id: "demo-article-house-of-the-dragon",
    title: "House of the Dragon : pourquoi la guerre Targaryen reste centrale",
    slug: "house-of-the-dragon-pourquoi-la-guerre-targaryen-reste-centrale",
    content:
      "House of the Dragon installe une guerre de succession ou chaque alliance compte. Les familles, les dragons et les choix politiques donnent au prequel une identite plus resserree que Game of Thrones.\n\nUn site HBO Max peut transformer chaque annonce en dossier : resume de saison, carte des camps, analyse des personnages et suivi de production. Les fiches TMDB servent ici de base visuelle pour donner de la profondeur au rendu.\n\nL'objectif de cette demo est de montrer comment une actualite longue apparait avec image hero, chapos et paragraphes.",
    excerpt:
      "Le prequel de Game of Thrones garde un potentiel editorial fort pour les guides, recap et dossiers personnages.",
    image_url: tmdbImage("/577eXC8wFQT0eUrJcgznSiFPRmk.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=DotnJ7tTA34",
    category: "HBO",
    status: "published",
    author_id: null,
    published_at: "2026-06-02T12:00:00.000Z",
    created_at: "2026-06-02T12:00:00.000Z",
    updated_at: now
  },
  {
    id: "demo-article-the-batman",
    title: "The Batman sur Max : la place du film dans l'univers DC",
    slug: "the-batman-sur-max-la-place-du-film-dans-lunivers-dc",
    content:
      "The Batman reste l'un des titres DC les plus identifiables du catalogue Warner. Son ambiance detective, sa Gotham plus urbaine et son casting en font un bon point d'entree pour une collection dediee.\n\nSur le site, ce type d'article peut renvoyer vers une fiche titre, une collection DC, une bande-annonce et des dossiers de production. Les images viennent de TMDB afin de donner un rendu proche d'une vraie publication.\n\nLa structure permet aussi de tester les cartes d'actualites, les pages detail et les blocs video.",
    excerpt:
      "Avec son Gotham noir et son approche detective, The Batman donne une bonne base pour tester les articles cinema.",
    image_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    category: "Films",
    status: "published",
    author_id: null,
    published_at: "2026-06-01T15:45:00.000Z",
    created_at: "2026-06-01T15:45:00.000Z",
    updated_at: now
  },
  {
    id: "demo-article-dune-2",
    title: "Dune : Deuxieme partie rejoint les incontournables science-fiction",
    slug: "dune-deuxieme-partie-rejoint-les-incontournables-science-fiction",
    content:
      "Dune : Deuxieme partie confirme l'ampleur visuelle de la saga et son importance dans le catalogue Warner. C'est le type de film qui fonctionne a la fois en nouveaute, en recommandation et en dossier thematique.\n\nPour un media specialise Max, le sujet peut etre decline en critique, guide de visionnage, focus sur les personnages ou article sur les coulisses. La page sert ici a tester un rendu riche avec image grand format et texte editorial.\n\nCes donnees sont des contenus de demonstration et peuvent ensuite etre remplacees par les vraies publications du back-office.",
    excerpt:
      "Un exemple d'article cinema pour tester les cartes, les categories et les pages detail avec un visuel fort.",
    image_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    category: "Cinema",
    status: "published",
    author_id: null,
    published_at: "2026-05-31T09:10:00.000Z",
    created_at: "2026-05-31T09:10:00.000Z",
    updated_at: now
  }
];

export const demoProductions: ProductionProject[] = [
  {
    id: "demo-prod-the-last-of-us",
    title: "The Last of Us",
    type: "series",
    status: "En tournage",
    production_label: "HBO Original",
    synopsis:
      "Joel et Ellie traversent une Amerique ravagee, entre survie, violence et liens familiaux impossibles.",
    casting: ["Pedro Pascal", "Bella Ramsey", "Kaitlyn Dever"],
    director: "Craig Mazin, Neil Druckmann",
    release_date_estimated: "2026-09-15",
    release_date_france: "2026-09-16",
    release_year: 2026,
    episode_count: 7,
    genres: ["Drame", "Science-fiction"],
    platform: "Max",
    poster_url: tmdbImage("/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg"),
    banner_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    tmdb_id: 100088,
    tmdb_media_type: "tv",
    production_company: "HBO",
    showrunner: "Craig Mazin",
    writers: ["Craig Mazin", "Neil Druckmann"],
    executive_producers: ["Craig Mazin", "Neil Druckmann"],
    shooting_locations: ["Canada"],
    production_notes:
      "Fiche de demonstration alimentee par les visuels TMDB. Les dates peuvent etre ajustees depuis le back-office.",
    source_url: "https://www.themoviedb.org/tv/100088",
    image_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-house-of-the-dragon",
    title: "House of the Dragon",
    type: "series",
    status: "Post-production",
    production_label: "HBO Original",
    synopsis:
      "La maison Targaryen se fracture alors que la guerre de succession menace Westeros et ses dragons.",
    casting: ["Emma D'Arcy", "Olivia Cooke", "Matt Smith"],
    director: "Ryan Condal",
    release_date_estimated: "2026-06-21",
    release_year: 2026,
    episode_count: 8,
    genres: ["Fantasy", "Drame"],
    platform: "Max",
    poster_url: tmdbImage("/lP73xk4HGJ9CPxDWouzKzK6j82o.jpg"),
    banner_url: tmdbImage("/577eXC8wFQT0eUrJcgznSiFPRmk.jpg", "w1280"),
    tmdb_id: 94997,
    tmdb_media_type: "tv",
    production_company: "HBO",
    showrunner: "Ryan Condal",
    writers: ["Ryan Condal", "George R. R. Martin"],
    executive_producers: ["Ryan Condal", "George R. R. Martin"],
    shooting_locations: ["Royaume-Uni", "Espagne"],
    production_notes: "Exemple de fiche production pour visualiser les statuts, le casting et les notes.",
    source_url: "https://www.themoviedb.org/tv/94997",
    image_url: tmdbImage("/577eXC8wFQT0eUrJcgznSiFPRmk.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-game-of-thrones",
    title: "Game of Thrones",
    type: "series",
    status: "Sorti",
    production_label: "HBO Classic",
    synopsis:
      "Dans Westeros, les grandes familles se disputent le Trone de fer pendant qu'une menace ancienne se reveille.",
    casting: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
    director: "David Benioff, D. B. Weiss",
    release_date_estimated: "2011-04-17",
    release_year: 2011,
    episode_count: 73,
    genres: ["Fantasy", "Aventure"],
    platform: "Max",
    poster_url: tmdbImage("/eRMfekBOnwyE9G0ffyEJIBOjX2n.jpg"),
    banner_url: tmdbImage("/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg", "w1280"),
    tmdb_id: 1399,
    tmdb_media_type: "tv",
    production_company: "HBO",
    showrunner: "David Benioff, D. B. Weiss",
    writers: ["David Benioff", "D. B. Weiss"],
    executive_producers: ["David Benioff", "D. B. Weiss"],
    shooting_locations: ["Irlande du Nord", "Croatie", "Espagne"],
    source_url: "https://www.themoviedb.org/tv/1399",
    image_url: tmdbImage("/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-the-batman",
    title: "The Batman",
    type: "movie",
    status: "Sorti",
    production_label: "DC",
    synopsis:
      "Bruce Wayne enquete sur une serie de crimes qui revele la corruption profonde de Gotham City.",
    casting: ["Robert Pattinson", "Zoe Kravitz", "Paul Dano"],
    director: "Matt Reeves",
    release_date_estimated: "2022-03-01",
    release_year: 2022,
    genres: ["Action", "Crime"],
    platform: "Max",
    poster_url: tmdbImage("/t9JGg10CW1DzXEdWL54ewkUko6N.jpg"),
    banner_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg", "w1280"),
    tmdb_id: 414906,
    tmdb_media_type: "movie",
    production_company: "Warner Bros. Pictures",
    writers: ["Matt Reeves", "Peter Craig"],
    source_url: "https://www.themoviedb.org/movie/414906",
    image_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-dune-part-two",
    title: "Dune : Deuxieme partie",
    type: "movie",
    status: "Sorti",
    production_label: "Warner Bros.",
    synopsis:
      "Paul Atreides s'allie aux Fremen pour venger sa famille et affronter le destin d'Arrakis.",
    casting: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson"],
    director: "Denis Villeneuve",
    release_date_estimated: "2024-02-27",
    release_year: 2024,
    genres: ["Science-fiction", "Aventure"],
    platform: "Max",
    poster_url: tmdbImage("/iRNbRAIGQQr5diGnjpwJFm0dgt4.jpg"),
    banner_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    tmdb_id: 693134,
    tmdb_media_type: "movie",
    production_company: "Legendary Pictures, Warner Bros. Pictures",
    writers: ["Denis Villeneuve", "Jon Spaihts"],
    source_url: "https://www.themoviedb.org/movie/693134",
    image_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-dark-knight",
    title: "The Dark Knight : Le Chevalier noir",
    type: "movie",
    status: "Sorti",
    production_label: "DC",
    synopsis:
      "Batman, Gordon et Harvey Dent affrontent le Joker, qui plonge Gotham dans le chaos.",
    casting: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    director: "Christopher Nolan",
    release_date_estimated: "2008-07-16",
    release_year: 2008,
    genres: ["Action", "Crime"],
    platform: "Max",
    poster_url: tmdbImage("/pyNXnq8QBWoK3b37RS6C3axwUOy.jpg"),
    banner_url: tmdbImage("/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg", "w1280"),
    tmdb_id: 155,
    tmdb_media_type: "movie",
    production_company: "Warner Bros. Pictures",
    writers: ["Christopher Nolan", "Jonathan Nolan"],
    source_url: "https://www.themoviedb.org/movie/155",
    image_url: tmdbImage("/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg", "w1280"),
    created_at: now,
    updated_at: now
  }
];

export const demoCollections: AdminCollection[] = [
  {
    id: "demo-collection-hbo-originals",
    title: "HBO Originals",
    slug: "hbo-originals",
    description: "Series prestige, sagas HBO et grands evenements Max.",
    created_at: now
  },
  {
    id: "demo-collection-dc",
    title: "Univers DC",
    slug: "univers-dc",
    description: "Films Batman, Justice League et contenus issus de DC.",
    created_at: now
  },
  {
    id: "demo-collection-warner-sf",
    title: "Science-fiction Warner",
    slug: "science-fiction-warner",
    description: "Dune, Inception et les grands films de catalogue.",
    created_at: now
  }
];

export function demoTop10(date = todayIso()): Top10Item[] {
  const rows = [
    ...demoProductions
      .filter((project) => project.type === "series")
      .slice(0, 5)
      .map((project, index) => ({ project, rank: index + 1 })),
    ...demoProductions
      .filter((project) => project.type === "movie")
      .slice(0, 5)
      .map((project, index) => ({ project, rank: index + 1 }))
  ];

  return rows.map(({ project, rank }) => ({
    id: `demo-top10-${project.type}-${rank}`,
    date,
    type: project.type,
    rank,
    title: project.title,
    image_url: project.poster_url || project.image_url,
    created_at: now
  }));
}
