import { todayIso } from "@/lib/format";
import { AdminCollection, Article, ProductionProject, Top10Item } from "@/lib/types";

const now = "2026-06-04T10:00:00.000Z";
const tmdbImage = (path: string, size: "w500" | "w1280" = "w500") =>
  `https://image.tmdb.org/t/p/${size}${path}`;

export const demoArticles: Article[] = [
  {
    id: "article-dune-prophecy",
    title: "« DUNE : PROPHECY » | LA SÉRIE ORIGINALE HBO MAX DÉVOILE SA BANDE-ANNONCE OFFICIELLE AVANT SA SORTIE",
    slug: "dune-prophecy-nouvelle-serie-originale-hbo",
    content: `La série événement **HBO Max** « Dune: Prophecy » se dévoile à travers une nouvelle bande-annonce spectaculaire explorant les origines du **Bene Gesserit**, dix mille ans avant l'avènement de **Paul Atréides** et les événements relatés dans les chefs-d'œuvre cinématographiques de **Denis Villeneuve**.

Coproduite par **HBO** et **Legendary Television**, cette superproduction sérielle s'inspire du roman *La Communauté des sœurs* de Brian Herbert et Kevin J. Anderson. Elle propose une immersion inédite dans les coulisses politiques et mystiques de l'Imperium, à une époque charnière où l'humanité tente encore de se reconstruire après la guerre contre les machines pensantes.

## Une plongée 10 000 ans avant l'épopée d'Arrakis

L'intrigue suit deux sœurs de la maison Harkonnen, **Valya** et **Tula Harkonnen**, qui luttent contre des forces obscures menaçant l'avenir de l'univers connu et établissent la redoutable sororité qui deviendra plus tard le mythique Bene Gesserit.

![Les intrigues de la cour impériale et les décors monumentaux de Dune: Prophecy](https://image.tmdb.org/t/p/w1280/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg)

Dans un univers où chaque parole murmure une trahison et où les lignées génétiques sont minutieusement orchestrées, la série s'annonce comme une fresque politique impitoyable digne des plus grands drames de la chaîne.

> « Ce que nous façonnons dans l'ombre et le secret déterminera le destin de tout l'Imperium pour les millénaires à venir. »

## Un casting international de grand prestige

Portée par les actrices d'exception **Emily Watson** (nommée aux Oscars pour *Breaking the Waves* et remarquée dans *Chernobyl*) et **Olivia Williams** (*The Ghost Writer*, *The Crown*), la distribution réunit également **Travis Fimmel** (*Vikings*), **Jodhi May**, **Sarah-Sofie Boussnina** et **Mark Strong** dans le rôle de l'Empereur Javicco Corrino.

La série sera diffusée en exclusivité mondiale sur la [plateforme officielle Max](https://www.max.com) avec des épisodes hebdomadaires d'une envergure visuelle exceptionnelle. Retrouvez toutes les dates et analyses complètes dans notre rubrique [Toutes les actualités](/actualites).`,
    excerpt:
      "La série événement HBO Max « Dune: Prophecy » dévoile une bande-annonce spectaculaire explorant les origines du Bene Gesserit.",
    image_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    category: "HBO Max",
    status: "published",
    author_id: null,
    author_name: "Allan",
    published_at: "2026-09-18T10:00:00.000Z",
    created_at: "2026-09-18T10:00:00.000Z",
    updated_at: now
  },
  {
    id: "article-the-penguin",
    title: "« THE PENGUIN » | COLIN FARRELL REVIENT DANS LA SÉRIE HBO MAX ORIGINALE AU CŒUR DE GOTHAM",
    slug: "the-penguin-colin-farrell-serie-hbo-max-originale",
    content:
      "Après les événements de The Batman, Oswald Cobblepot s'apprête à régner sur les bas-fonds de Gotham City dans la nouvelle série dramatique événement signée HBO Max.",
    excerpt:
      "Oswald Cobblepot prend le contrôle de la pègre de Gotham dans la nouvelle série événement HBO Max.",
    image_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    category: "HBO Max",
    status: "published",
    author_id: null,
    published_at: "2026-09-18T08:30:00.000Z",
    created_at: "2026-09-18T08:30:00.000Z",
    updated_at: now
  },
  {
    id: "article-white-lotus-s3",
    title: "« THE WHITE LOTUS » | LA SAISON 3 EN THAÏLANDE DÉVOILE SES NOUVELLES IMAGES ET SON CASTING COMPLET",
    slug: "the-white-lotus-saison-3-thailande-nouvelles-images",
    content:
      "Après Hawaï et la Sicile, la satire primée aux Emmy Awards signée Mike White pose ses valises en Thaïlande avec un casting prestigieux et de nouveaux mystères.",
    excerpt:
      "Mike White emmène The White Lotus en Thaïlande avec une nouvelle galerie de personnages hauts en couleur.",
    image_url: tmdbImage("/577eXC8wFQT0eUrJcgznSiFPRmk.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=kYJvK6dI4QY",
    category: "HBO",
    status: "published",
    author_id: null,
    published_at: "2026-09-17T15:00:00.000Z",
    created_at: "2026-09-17T15:00:00.000Z",
    updated_at: now
  },
  {
    id: "demo-article-the-last-of-us-s3",
    title: "« THE LAST OF US » | HBO CONFIRME LA PRÉPARATION DE LA SAISON 3 ET DE NOUVEAUX PROJETS",
    slug: "the-last-of-us-saison-3-ce-que-max-peut-deja-preparer",
    content:
      "Après une deuxième saison très surveillée, The Last of Us reste l’une des marques fortes de HBO. La suite devrait continuer à mélanger récit intime, survie et grandes séquences de tension.\n\nPour Max, l’enjeu est clair : garder l’événement vivant entre deux saisons avec bandes-annonces, entretiens, récapitulatifs des épisodes et dossiers sur les personnages.",
    excerpt:
      "La série originale HBO reste un pilier majeur : calendrier, personnages et attentes pour la suite.",
    image_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=uLtkt8BonwM",
    category: "HBO",
    status: "published",
    author_id: null,
    published_at: "2026-06-03T08:30:00.000Z",
    created_at: "2026-06-03T08:30:00.000Z",
    updated_at: now
  },
  {
    id: "demo-article-house-of-the-dragon",
    title: "« HOUSE OF THE DRAGON » | LA GUERRE DES TARGARYEN S'INTENSIFIE DANS LA NOUVELLE SAISON HBO",
    slug: "house-of-the-dragon-pourquoi-la-guerre-targaryen-reste-centrale",
    content:
      "House of the Dragon installe une guerre de succession où chaque alliance compte. Les familles, les dragons et les choix politiques donnent au prequel une identité plus resserrée que Game of Thrones.",
    excerpt:
      "Le prequel de Game of Thrones garde un potentiel éditorial fort pour les guides, récits et dossiers personnages.",
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
    title: "« THE BATMAN » | LE CHEF-D'ŒUVRE CINÉMA DE MATT REEVES AU CŒUR DU CATALOGUE WARNER",
    slug: "the-batman-sur-max-la-place-du-film-dans-lunivers-dc",
    content:
      "The Batman reste l’un des titres DC les plus identifiables du catalogue Warner. Son ambiance détective, sa Gotham plus urbaine et son casting en font un des plus grands succès du cinéma récent.",
    excerpt:
      "Avec son Gotham noir et son approche détective, The Batman reste un jalon incontournable du cinéma DC.",
    image_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    category: "Cinéma",
    status: "published",
    author_id: null,
    published_at: "2026-06-01T15:45:00.000Z",
    created_at: "2026-06-01T15:45:00.000Z",
    updated_at: now
  },
  {
    id: "demo-article-dune-2",
    title: "« DUNE : DEUXIÈME PARTIE » | LE MONUMENT DU CINÉMA DE SCIENCE-FICTION DE DENIS VILLENEUVE",
    slug: "dune-deuxieme-partie-rejoint-les-incontournables-science-fiction",
    content:
      "Dune : Deuxième partie confirme l’ampleur visuelle de la saga et son importance monumentale au cinéma. C’est le triomphe critique et public de Warner Bros. Pictures.",
    excerpt:
      "Le chef-d'œuvre de Denis Villeneuve continue de marquer les mémoires des spectateurs du monde entier.",
    image_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    category: "Cinéma",
    status: "published",
    author_id: null,
    published_at: "2026-05-31T09:10:00.000Z",
    created_at: "2026-05-31T09:10:00.000Z",
    updated_at: now
  },
  {
    id: "article-superman-cinema",
    title: "« SUPERMAN » | LE NOUVEAU FILM DE JAMES GUNN DÉVOILE SES COULISSES POUR SA SORTIE EN SALLES",
    slug: "superman-james-gunn-nouveau-film-cinema-warner",
    content:
      "Le tournage du grand film événement DC Studios réalisé par James Gunn est désormais achevé. Le réalisateur promet une épopée cinématographique lumineuse et spectaculaire dans les salles de cinéma du monde entier.",
    excerpt:
      "James Gunn prépare l'arrivée sur grand écran du nouvel univers cinématographique DC avec David Corenswet.",
    image_url: tmdbImage("/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=DotnJ7tTA34",
    category: "Cinéma",
    status: "published",
    author_id: null,
    published_at: "2026-05-28T14:00:00.000Z",
    created_at: "2026-05-28T14:00:00.000Z",
    updated_at: now
  },
  {
    id: "article-tokyo-vice-international",
    title: "« TOKYO VICE » | LA SÉRIE INTERNATIONALE ÉVÉNEMENT DISPONIBLE EN INTÉGRALITÉ SUR HBO MAX",
    slug: "tokyo-vice-serie-internationale-integrale-hbo-max",
    content:
      "Plongez dans les bas-fonds de Tokyo avec cette série policière internationale haletante portée par Ansel Elgort et Ken Watanabe, acquise et diffusée avec grand succès sur la plateforme HBO Max.",
    excerpt:
      "La production internationale saluée par la critique mondiale s'impose parmi les grandes séries acquises diffusées sur HBO Max.",
    image_url: tmdbImage("/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=kYJvK6dI4QY",
    category: "Programmes internationaux",
    status: "published",
    author_id: null,
    published_at: "2026-05-25T11:00:00.000Z",
    created_at: "2026-05-25T11:00:00.000Z",
    updated_at: now
  },
  {
    id: "article-acquisitions-internationales",
    title: "FILMS ET SÉRIES INTERNATIONAUX : LE GUIDE DES NOUVELLES ACQUISITIONS EN DIFFUSION SUR HBO MAX",
    slug: "acquisitions-internationales-nouveaux-films-series-hbo-max",
    content:
      "Au-delà des productions originales, HBO Max enrichit continuellement son catalogue avec les meilleures œuvres acquises à travers le monde : drames scandinaves, thrillers britanniques et longs métrages primés en festivals internationaux.",
    excerpt:
      "Un aperçu exclusif des programmes acquis et coproductions internationales qui enrichissent l'offre HBO Max.",
    image_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=uLtkt8BonwM",
    category: "Programmes internationaux",
    status: "published",
    author_id: null,
    published_at: "2026-05-20T16:30:00.000Z",
    created_at: "2026-05-20T16:30:00.000Z",
    updated_at: now
  },
  {
    id: "article-furiosa-cinema",
    title: "« FURIOSA : UNE SAGA MAD MAX » | L'ODYSSÉE EXPLOSIVE DE GEORGE MILLER EN SALLES DE CINÉMA",
    slug: "furiosa-une-saga-mad-max-george-miller-cinema",
    content:
      "Anya Taylor-Joy et Chris Hemsworth s'affrontent dans les terres désolées dans cette préquelle magistrale signée George Miller pour Warner Bros. Pictures.",
    excerpt:
      "L'épopée post-apocalyptique impressionne par sa mise en scène spectaculaire et son univers visuel sans équivalent.",
    image_url: tmdbImage("/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=DotnJ7tTA34",
    category: "Cinéma",
    status: "published",
    author_id: null,
    published_at: "2026-05-18T10:00:00.000Z",
    created_at: "2026-05-18T10:00:00.000Z",
    updated_at: now
  },
  {
    id: "article-beetlejuice-cinema",
    title: "« BEETLEJUICE BEETLEJUICE » | LE RETOUR TRIOMPHAL DU CLASSIQUE DE TIM BURTON AU CINÉMA",
    slug: "beetlejuice-beetlejuice-tim-burton-cinema-warner",
    content:
      "Michael Keaton et Winona Ryder reprennent leurs rôles cultes aux côtés de Jenna Ortega dans cette comédie macabre réjouissante produite par Warner Bros.",
    excerpt:
      "Tim Burton renoue avec son univers gothique et fantasque dans cette suite attendue par des millions de spectateurs.",
    image_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    category: "Cinéma",
    status: "published",
    author_id: null,
    published_at: "2026-05-15T09:30:00.000Z",
    created_at: "2026-05-15T09:30:00.000Z",
    updated_at: now
  },
  {
    id: "article-peacemaker-hbo-max",
    title: "« PEACEMAKER » | LA SAISON 2 DE LA SÉRIE ORIGINALE HBO MAX ENFIN EN TOURNAGE AVEC JOHN CENA",
    slug: "peacemaker-saison-2-serie-originale-hbo-max-john-cena",
    content:
      "James Gunn confirme que la deuxième saison de Peacemaker s'intégrera directement dans la nouvelle continuité DC avec encore plus d'humour noir et d'action débridée.",
    excerpt:
      "John Cena renfile le costume de Peacemaker pour de nouvelles aventures explosives exclusives à HBO Max.",
    image_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    category: "HBO Max",
    status: "published",
    author_id: null,
    published_at: "2026-05-12T14:15:00.000Z",
    created_at: "2026-05-12T14:15:00.000Z",
    updated_at: now
  },
  {
    id: "article-hacks-hbo-max",
    title: "« HACKS » | LA COMÉDIE MULTI-RÉCOMPENSÉE AUX EMMY AWARDS DE RETOUR SUR HBO MAX",
    slug: "hacks-saison-nouvelle-comedie-hbo-max",
    content:
      "Jean Smart et Hannah Einbinder reprennent leur duel comique piquant dans les coulisses du stand-up de Las Vegas et de Los Angeles.",
    excerpt:
      "La satire d'humour acérée plébiscitée par la critique internationale prépare une nouvelle salve d'épisodes croustillants.",
    image_url: tmdbImage("/577eXC8wFQT0eUrJcgznSiFPRmk.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=kYJvK6dI4QY",
    category: "HBO Max",
    status: "published",
    author_id: null,
    published_at: "2026-05-10T11:00:00.000Z",
    created_at: "2026-05-10T11:00:00.000Z",
    updated_at: now
  },
  {
    id: "article-euphoria-hbo",
    title: "« EUPHORIA » | HBO ANNONCE LES DÉTAILS DE PRODUCTION DE LA TRÈS ATTENDUE SAISON 3",
    slug: "euphoria-saison-3-details-production-hbo-original",
    content:
      "Zendaya et le créateur Sam Levinson préparent un saut dans le temps captivant pour la suite de la série phénomène de HBO qui a marqué toute une génération.",
    excerpt:
      "Le drame viscéral de HBO amorce une nouvelle étape narrative avec le retour de sa distribution prestigieuse.",
    image_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=uLtkt8BonwM",
    category: "HBO",
    status: "published",
    author_id: null,
    published_at: "2026-05-08T17:00:00.000Z",
    created_at: "2026-05-08T17:00:00.000Z",
    updated_at: now
  },
  {
    id: "article-true-detective-hbo",
    title: "« TRUE DETECTIVE » | LA CÉLÈBRE ANTHOLOGIE POLICIÈRE RENOUVELÉE PAR HBO POUR UNE NOUVELLE ENQUÊTE",
    slug: "true-detective-nouvelle-enquete-hbo-original",
    content:
      "Après le succès retentissant de Night Country portée par Jodie Foster, HBO confirme une cinquième saison sous la houlette d'Issa López.",
    excerpt:
      "L'atmosphère sombre et mystique de True Detective se poursuivra avec une nouvelle énigme policière glaçante.",
    image_url: tmdbImage("/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=kYJvK6dI4QY",
    category: "HBO",
    status: "published",
    author_id: null,
    published_at: "2026-05-05T08:45:00.000Z",
    created_at: "2026-05-05T08:45:00.000Z",
    updated_at: now
  },
  {
    id: "article-serie-scandinave-international",
    title: "« LE MYSTÈRE NORDIQUE » | NOUVELLE SÉRIE THRILLER ACQUISE POUR DIFFUSION EN FRANCE SUR HBO MAX",
    slug: "thriller-nordique-serie-internationale-acquisitions-hbo-max",
    content:
      "Découvrez ce polar scandinave sombre et captivant, récompensé dans plusieurs festivals européens et intégré à la sélection des acquisitions internationales de prestige.",
    excerpt:
      "Un nouveau thriller international d'une grande intensité psychologique disponible prochainement en streaming.",
    image_url: tmdbImage("/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=DotnJ7tTA34",
    category: "Programmes internationaux",
    status: "published",
    author_id: null,
    published_at: "2026-05-02T13:20:00.000Z",
    created_at: "2026-05-02T13:20:00.000Z",
    updated_at: now
  },
  {
    id: "article-cinema-mickey17",
    title: "« MICKEY 17 » | BONG JOON HO RÉVÈLE SON ODYSSÉE DE SCIENCE-FICTION AU CINÉMA AVEC ROBERT PATTINSON",
    slug: "mickey-17-bong-joon-ho-robert-pattinson-cinema-warner",
    content:
      "Le réalisateur oscarisé de Parasite livre une œuvre visuelle saisissante produite par Warner Bros. Pictures où Robert Pattinson incarne un employé sacrifiable à l'infini.",
    excerpt:
      "Une des propositions cinématographiques les plus singulières et audacieuses de l'année sur grand écran.",
    image_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    youtube_video_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
    category: "Cinéma",
    status: "published",
    author_id: null,
    published_at: "2026-04-28T16:00:00.000Z",
    created_at: "2026-04-28T16:00:00.000Z",
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
      "Joel et Ellie traversent une Amérique ravagée, entre survie, violence et liens familiaux impossibles.",
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
      "Fiche de démonstration alimentée par les visuels TMDB. Les dates peuvent être ajustées depuis le back-office.",
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
      "Dans Westeros, les grandes familles se disputent le Trône de fer pendant qu’une menace ancienne se réveille.",
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
      "Bruce Wayne enquête sur une série de crimes qui révèle la corruption profonde de Gotham City.",
    casting: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
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
    title: "Dune : Deuxième partie",
    type: "movie",
    status: "Sorti",
    production_label: "Warner Bros.",
    synopsis:
      "Paul Atreides s’allie aux Fremen pour venger sa famille et affronter le destin d’Arrakis.",
    casting: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
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
  },
  {
    id: "demo-prod-the-penguin",
    title: "The Penguin",
    type: "series",
    status: "Sorti",
    production_label: "DC / HBO Original",
    synopsis: "Oz Cobb tente de s'emparer du pouvoir à Gotham City après les événements de The Batman.",
    casting: ["Colin Farrell", "Cristin Milioti", "Rhenzy Feliz"],
    director: "Craig Zobel",
    release_date_estimated: "2024-09-19",
    release_year: 2024,
    genres: ["Crime", "Drame"],
    platform: "Max",
    poster_url: tmdbImage("/aKaZpB4wXmG0x4eJ2t2WcO1D4Fk.jpg"),
    banner_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    tmdb_id: 194764,
    tmdb_media_type: "tv",
    production_company: "DC Studios, Warner Bros. Television",
    source_url: "https://www.themoviedb.org/tv/194764",
    image_url: tmdbImage("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-succession",
    title: "Succession",
    type: "series",
    status: "Sorti",
    production_label: "HBO Original",
    synopsis: "La lutte fratricide au sein de la famille Roy pour prendre le contrôle du conglomérat Waystar RoyCo.",
    casting: ["Brian Cox", "Jeremy Strong", "Sarah Snook"],
    director: "Jesse Armstrong",
    release_date_estimated: "2018-06-03",
    release_year: 2018,
    genres: ["Drame"],
    platform: "Max",
    poster_url: tmdbImage("/77tEN7Xk4rG91hG1qK3g9z1wDq9.jpg"),
    banner_url: tmdbImage("/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg", "w1280"),
    tmdb_id: 76331,
    tmdb_media_type: "tv",
    production_company: "HBO",
    source_url: "https://www.themoviedb.org/tv/76331",
    image_url: tmdbImage("/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-furiosa",
    title: "Furiosa : Une saga Mad Max",
    type: "movie",
    status: "Sorti",
    production_label: "Warner Bros.",
    synopsis: "Dans un monde en déclin, la jeune Furiosa est arrachée à la Terre Verte des Mille Mères.",
    casting: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"],
    director: "George Miller",
    release_date_estimated: "2024-05-22",
    release_year: 2024,
    genres: ["Action", "Science-fiction"],
    platform: "Max",
    poster_url: tmdbImage("/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg"),
    banner_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    tmdb_id: 786892,
    tmdb_media_type: "movie",
    production_company: "Warner Bros. Pictures",
    source_url: "https://www.themoviedb.org/movie/786892",
    image_url: tmdbImage("/acevLdSl5I2MK5RYAm7gwAndt1w.jpg", "w1280"),
    created_at: now,
    updated_at: now
  },
  {
    id: "demo-prod-beetlejuice",
    title: "Beetlejuice Beetlejuice",
    type: "movie",
    status: "Sorti",
    production_label: "Warner Bros.",
    synopsis: "Après une tragédie familiale inattendue, trois générations de la famille Deetz reviennent à Winter River.",
    casting: ["Michael Keaton", "Winona Ryder", "Jenna Ortega"],
    director: "Tim Burton",
    release_date_estimated: "2024-09-04",
    release_year: 2024,
    genres: ["Comédie", "Fantastique"],
    platform: "Max",
    poster_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg"),
    banner_url: tmdbImage("/DotnJ7tTA34", "w1280"),
    tmdb_id: 917496,
    tmdb_media_type: "movie",
    production_company: "Warner Bros. Pictures",
    source_url: "https://www.themoviedb.org/movie/917496",
    image_url: tmdbImage("/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg", "w1280"),
    created_at: now,
    updated_at: now
  }
];

export const demoCollections: AdminCollection[] = [
  {
    id: "demo-collection-hbo-originals",
    title: "HBO Originals",
    slug: "hbo-originals",
    description: "Séries prestige, sagas HBO et grands événements Max.",
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

const defaultDemoSeries = [
  { title: "The Last of Us", poster: "/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg" },
  { title: "House of the Dragon", poster: "/lP73xk4HGJ9CPxDWouzKzK6j82o.jpg" },
  { title: "Game of Thrones", poster: "/eRMfekBOnwyE9G0ffyEJIBOjX2n.jpg" },
  { title: "The Penguin", poster: "/aKaZpB4wXmG0x4eJ2t2WcO1D4Fk.jpg" },
  { title: "Succession", poster: "/77tEN7Xk4rG91hG1qK3g9z1wDq9.jpg" },
  { title: "The White Lotus", poster: "/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg" },
  { title: "Euphoria", poster: "/acevLdSl5I2MK5RYAm7gwAndt1w.jpg" },
  { title: "True Detective", poster: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg" },
  { title: "Chernobyl", poster: "/577eXC8wFQT0eUrJcgznSiFPRmk.jpg" },
  { title: "Les Soprano", poster: "/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg" },
];

const defaultDemoMovies = [
  { title: "The Batman", poster: "/t9JGg10CW1DzXEdWL54ewkUko6N.jpg" },
  { title: "Dune : Deuxième partie", poster: "/iRNbRAIGQQr5diGnjpwJFm0dgt4.jpg" },
  { title: "The Dark Knight : Le Chevalier noir", poster: "/pyNXnq8QBWoK3b37RS6C3axwUOy.jpg" },
  { title: "Furiosa : Une saga Mad Max", poster: "/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg" },
  { title: "Beetlejuice Beetlejuice", poster: "/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg" },
  { title: "Joker : Folie à Deux", poster: "/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg" },
  { title: "Barbie", poster: "/DotnJ7tTA34.jpg" },
  { title: "Interstellar", poster: "/acevLdSl5I2MK5RYAm7gwAndt1w.jpg" },
  { title: "Inception", poster: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg" },
  { title: "Matrix", poster: "/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg" },
];

export function demoTop10(date = todayIso()): Top10Item[] {
  const seriesItems: Top10Item[] = defaultDemoSeries.map((s, index) => ({
    id: `demo-top10-series-${index + 1}`,
    date,
    type: "series",
    rank: index + 1,
    title: s.title,
    image_url: tmdbImage(s.poster),
    created_at: now,
  }));

  const movieItems: Top10Item[] = defaultDemoMovies.map((m, index) => ({
    id: `demo-top10-movie-${index + 1}`,
    date,
    type: "movie",
    rank: index + 1,
    title: m.title,
    image_url: tmdbImage(m.poster),
    created_at: now,
  }));

  return [...seriesItems, ...movieItems];
}
