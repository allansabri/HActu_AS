import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import {
  findAuthorBySlug,
  findAuthorByName,
  defaultAuthors,
  getAuthorsSectionConfig,
} from "@/lib/authors-config";
import { getLatestArticles } from "@/lib/queries";
import { ArticleCard } from "@/components/ArticleCard";
import { ReviewCard } from "@/components/SeriesReviewsSection";
import { Article } from "@/lib/types";
import { getSeriesReviewsConfig, SeriesReviewItem } from "@/lib/reviews-config";

// Icons custom pour réseaux sociaux (X, Instagram, Facebook, YouTube)
function TwitterXIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function formatInscriptionDate(dateStr?: string | null): string {
  if (!dateStr) return "2 octobre 2025";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "2 octobre 2025";
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "2 octobre 2025";
  }
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getLatestArticles(100);
  const authorsConfig = await getAuthorsSectionConfig(articles);

  // Recherche de l'auteur par slug ou nom
  const author =
    authorsConfig.items.find(
      (a) =>
        (a.slug || "").toLowerCase() === slug.toLowerCase() ||
        a.id.toLowerCase() === slug.toLowerCase()
    ) || findAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // 1. Articles rédigés par cet auteur
  const authorLower = author.name.trim().toLowerCase();
  const authorArticles = (articles as Article[]).filter((art: Article) => {
    if (art.status !== "published") return false;
    const artAuthor = (art.author_name || "").trim().toLowerCase();
    return (
      artAuthor === authorLower ||
      art.author_id === author.id ||
      (author.id === "author-allan" && (!art.author_name || artAuthor === "allan"))
    );
  });

  // 2. Critiques rédigées par cet auteur
  const reviewsConfig = await getSeriesReviewsConfig();
  const authorReviews = (reviewsConfig.items || []).filter((rev: SeriesReviewItem) => {
    const revAuthor = (rev.author_name || "").trim().toLowerCase();
    return (
      revAuthor === authorLower ||
      revAuthor.includes(authorLower) ||
      authorLower.includes(revAuthor)
    );
  });

  // 3. Fusion et tri chronologique de tous les items de l'auteur
  type PublicationFeedItem =
    | { type: "article"; date: string; article: Article }
    | { type: "review"; date: string; review: SeriesReviewItem };

  const allItems: PublicationFeedItem[] = [
    ...authorArticles.map(
      (a: Article) =>
        ({
          type: "article",
          date: a.published_at || a.created_at,
          article: a,
        } as const)
    ),
    ...authorReviews.map(
      (r: SeriesReviewItem) =>
        ({
          type: "review",
          date: r.published_at,
          review: r,
        } as const)
    ),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Si l'auteur a peu de publications spécifiques, inclure son article récent pour qu'il soit bien mis en avant
  if (allItems.length === 0 && author.recent_article_title) {
    const fallbackArticle = (articles as Article[]).find(
      (a: Article) =>
        a.title.toLowerCase() === author.recent_article_title.toLowerCase() ||
        (author.recent_article_url &&
          author.recent_article_url.includes(a.slug))
    );
    if (fallbackArticle) {
      allItems.push({
        type: "article",
        date: fallbackArticle.published_at || fallbackArticle.created_at,
        article: fallbackArticle,
      });
    }
  }

  // 4 cartes en mise en avant principale (comme 'Les dernières actualités' de l'accueil)
  const featuredItems = allItems.slice(0, 4);
  const remainingItems = allItems.slice(4);

  const totalPublished = Math.max(
    allItems.length,
    author.total_articles || 1
  );
  const inscriptionFormatted = formatInscriptionDate(author.joined_date);
  const bannerImage =
    author.banner_url ||
    "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg";

  return (
    <main className="min-h-screen bg-[#090b0e] text-white">
      {/* 1. Bannière de profil (inchangée) */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 bg-neutral-900 overflow-hidden border-b border-white/10">
        <img
          src={bannerImage}
          alt={`Bannière de profil de ${author.name}`}
          className="h-full w-full object-cover object-center"
        />
        {/* Voile dégradé supérieur & inférieur pour intégration parfaite */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-black/25 to-black/60" />
      </div>

      {/* Conteneur principal de la page auteur */}
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* 2. En-tête profil : Seule la photo de profil déborde de la bannière. Le nom et les stats sont bien SOUS la bannière */}
        <div className="relative z-20 pb-6 border-b border-white/10">
          {/* Photo de profil agrandie (en rond pur) qui chevauche légèrement la bannière */}
          <div className="relative -mt-16 sm:-mt-20 md:-mt-22 mb-4">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 shrink-0 overflow-hidden rounded-full bg-neutral-900 shadow-2xl">
              {author.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-[#0e171f] to-[#3a4b5d] text-white text-4xl font-black">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Nom du profil, article publié et inscrit depuis le... TOTALEMENT sous la bannière */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {author.name}
            </h1>

            {/* Total des articles publiés et date d'inscription bien en dessous */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-[15px] text-neutral-300 font-medium">
              <span className="text-white">
                <strong className="font-bold text-white">
                  {totalPublished}
                </strong>{" "}
                {totalPublished > 1 ? "articles publiés" : "article publié"}
              </span>

              <span className="text-neutral-500">•</span>

              <span className="text-neutral-300">
                Inscrit depuis le {inscriptionFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Section Bio & Réseaux sociaux sous la photo de profil (sans titre "À propos de l'auteur") */}
        <div className="py-6 border-b border-white/10 space-y-5">
          {/* Bio de l'auteur sans titre au-dessus */}
          <div>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-3xl">
              {author.bio ||
                `Passionné d'univers fantastiques, de cinéma et des séries HBO. Rédacteur et chroniqueur régulier.`}
            </p>
          </div>

          {/* Section Réseaux sociaux avec boutons arrondis (icône + @compte) */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 shrink-0">
                Réseaux sociaux :
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Twitter / X */}
                {author.socials?.twitter && (
                  <a
                    href={`https://x.com/${author.socials.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 shadow-sm hover:border-[#778b9d]"
                  >
                    <TwitterXIcon className="h-3.5 w-3.5 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-neutral-300 group-hover:text-white transition-colors">
                      @{author.socials.twitter}
                    </span>
                  </a>
                )}

                {/* Instagram */}
                {author.socials?.instagram && (
                  <a
                    href={`https://instagram.com/${author.socials.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 shadow-sm hover:border-pink-500/50"
                  >
                    <InstagramIcon className="h-3.5 w-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="text-neutral-300 group-hover:text-white transition-colors">
                      @{author.socials.instagram}
                    </span>
                  </a>
                )}

                {/* Facebook */}
                {author.socials?.facebook && (
                  <a
                    href={`https://facebook.com/${author.socials.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 shadow-sm hover:border-blue-500/50"
                  >
                    <FacebookIcon className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-neutral-300 group-hover:text-white transition-colors">
                      @{author.socials.facebook}
                    </span>
                  </a>
                )}

                {/* YouTube */}
                {author.socials?.youtube && (
                  <a
                    href={`https://youtube.com/@${author.socials.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 shadow-sm hover:border-red-500/50"
                  >
                    <YoutubeIcon className="h-3.5 w-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-neutral-300 group-hover:text-white transition-colors">
                      @{author.socials.youtube}
                    </span>
                  </a>
                )}

                {/* Bouton par défaut si aucun réseau n'a été renseigné */}
                {!author.socials?.twitter &&
                  !author.socials?.instagram &&
                  !author.socials?.facebook &&
                  !author.socials?.youtube && (
                    <span className="text-xs text-neutral-400 italic">
                      Aucun réseau social configuré pour le moment.
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Section de mise en avant des derniers articles / critiques de l'auteur (même style que 'Les dernières actualités' de l'accueil) */}
        <div className="py-8 space-y-6">
          {featuredItems.length > 0 ? (
            <div className="space-y-10">
              {/* Grille principale de mise en avant : 4 cartes côte à côte (comme 'Les dernières actualités' de l'accueil) */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featuredItems.map((item, index) => {
                  if (item.type === "review") {
                    return (
                      <ReviewCard
                        key={`review-${item.review.id || index}`}
                        item={item.review}
                        index={index}
                      />
                    );
                  }
                  return (
                    <ArticleCard
                      key={`article-${item.article.id || index}`}
                      article={item.article}
                      index={index}
                      large={false}
                    />
                  );
                })}
              </div>

              {/* Reste des publications si l'auteur a plus de 4 articles/critiques */}
              {remainingItems.length > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Autres publications de {author.name}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      {remainingItems.length} {remainingItems.length > 1 ? "articles" : "article"}
                    </span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {remainingItems.map((item, index) => {
                      if (item.type === "review") {
                        return (
                          <ReviewCard
                            key={`rem-review-${item.review.id || index}`}
                            item={item.review}
                            index={index + 4}
                          />
                        );
                      }
                      return (
                        <ArticleCard
                          key={`rem-article-${item.article.id || index}`}
                          article={item.article}
                          index={index + 4}
                          large={false}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-none border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-neutral-400">
              Aucun article ou critique publié pour le moment par cet auteur.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
