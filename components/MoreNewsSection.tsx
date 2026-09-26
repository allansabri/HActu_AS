import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { subscribeNewsletter } from "@/app/actions";
import { formatDate } from "@/lib/format";
import { Article } from "@/lib/types";
import { MoreNewsConfig } from "@/lib/more-news-config";

interface MoreNewsSectionProps {
  articles: Article[];
  sidebarArticles: Article[];
  config?: MoreNewsConfig | null;
  newsletterState?: string;
}

export function MoreNewsSection({
  articles,
  sidebarArticles,
  config,
  newsletterState,
}: MoreNewsSectionProps) {
  const sectionTitle = config?.section_title || "Encore plus d'actualités";
  const newsletterTitle = config?.newsletter_title || "Restez au cœur de l'actualité Max";
  const newsletterSubtitle =
    config?.newsletter_subtitle ||
    "Recevez en avant-première les sorties, bandes-annonces et exclusivités du catalogue HBO Max.";
  const sidebarTitle = config?.sidebar_title || "À ne pas manquer";

  // Ne garder que 9 articles pour la grille 3x3
  const gridArticles = articles.slice(0, 9);
  // Articles latéraux sous la newsletter (4 à 6 articles)
  const asideArticles = sidebarArticles.slice(0, 5);

  return (
    <section
      id="encore-plus-d-actualites"
      aria-label={sectionTitle}
      className="w-full bg-gradient-to-b from-[#050a0a] to-[#0e171f] py-8 sm:py-10 lg:py-12"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Titre de section identique aux autres sections */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {sectionTitle}
          </h2>
        </div>

        {/* Layout : Colonne principale à gauche (9 articles 3x3) + Colonne latérale à droite (Newsletter + articles carrés) */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 xl:gap-10">
          
          {/* Colonne gauche : Grille de 9 articles (3 côte à côte × 3 en dessous) */}
          <div className="w-full lg:flex-1 min-w-0 flex flex-col">
            {gridArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {gridArticles.map((article, index) => (
                  <ArticleCard
                    key={article.id || index}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white/50 py-8 text-center">Aucun article supplémentaire disponible.</p>
            )}

            {/* Bouton Voir toutes les actualités sous les 9 articles */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/actualites"
                className="inline-flex items-center justify-center rounded-full bg-[#8197a9] px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99]"
              >
                Voir toutes les actualités
              </Link>
            </div>
          </div>

          {/* Colonne droite : Formulaire newsletter + Articles carrés en dessous */}
          <aside className="w-full lg:w-[350px] xl:w-[380px] shrink-0 flex flex-col gap-6">
            {/* Formulaire Newsletter aux couleurs du site */}
            <div
              id="newsletter"
              className="relative overflow-hidden rounded-none border border-white/15 bg-gradient-to-b from-[#1c2430] via-[#141b24] to-[#0d1219] p-5 sm:p-6 shadow-xl backdrop-blur-md"
            >
              {/* Badge d'en-tête */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-max-cyan">
                  Newsletter
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-max-cyan animate-pulse" />
              </div>

              {/* Titre & description */}
              <h3 className="mt-2 text-lg sm:text-[19px] font-black leading-snug text-white">
                {newsletterTitle}
              </h3>
              <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/70">
                {newsletterSubtitle}
              </p>

              {/* Formulaire d'inscription */}
              <form action={subscribeNewsletter} className="mt-4 space-y-3">
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Votre adresse email..."
                    className="w-full rounded-full border border-white/15 bg-black/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-white/40 outline-none transition-colors duration-200 focus:border-[#8197a9] focus:bg-black/70"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#8197a9] px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99]"
                >
                  Je m’abonne gratuitement
                </button>
              </form>

              {/* Feedback messages */}
              {newsletterState === "ok" && (
                <div className="mt-3 rounded-md bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-xs font-semibold text-emerald-400">
                  ✓ Merci ! Votre inscription à la newsletter est confirmée.
                </div>
              )}
              {newsletterState === "invalid" && (
                <div className="mt-3 rounded-md bg-red-500/15 border border-red-500/30 p-2.5 text-xs font-semibold text-red-300">
                  Adresse email invalide. Veuillez vérifier votre saisie.
                </div>
              )}
              {newsletterState === "unavailable" && (
                <div className="mt-3 rounded-md bg-yellow-500/15 border border-yellow-500/30 p-2.5 text-xs font-semibold text-yellow-300">
                  Service temporairement indisponible. Réessayez plus tard.
                </div>
              )}

              <p className="mt-3 text-[10px] text-white/40 text-center">
                Gratuit et sans engagement. Désinscription possible à tout moment.
              </p>
            </div>

            {/* Articles plus petits avec card carrée (style identique à la colonne droite Cinéma) */}
            {asideArticles.length > 0 && (
              <div className="flex flex-col">
                {sidebarTitle && (
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white/85">
                      {sidebarTitle}
                    </h3>
                  </div>
                )}

                <div className="flex flex-col divide-y divide-white/5">
                  {asideArticles.map((article, index) => (
                    <Link
                      key={article.id || index}
                      href={`/actualites/${article.slug}`}
                      className="group flex items-center gap-3.5 py-2.5 px-1 rounded-none transition-all duration-200 hover:bg-white/[0.04]"
                    >
                      {/* Card au format carré pas trop petite à gauche */}
                      <div className="relative aspect-square w-18 h-18 sm:w-20 sm:h-20 md:w-[78px] md:h-[78px] rounded-none overflow-hidden shrink-0 bg-neutral-900 border border-white/10 shadow-md group-hover:border-[#7a8fa1]/50 transition-colors">
                        <img
                          src={article.image_url || "/max-reference-bg.png"}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Titre centré verticalement par rapport à la card */}
                      <div className="flex flex-col justify-center min-w-0 flex-1">
                        <time className="text-[11px] sm:text-xs font-normal text-neutral-400">
                          {formatDate(article.published_at || article.created_at)}
                        </time>
                        <h4 className="mt-0.5 text-xs sm:text-[13.5px] font-extrabold uppercase leading-snug tracking-tight text-white group-hover:text-[#7a8fa1] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <span className="mt-0.5 text-[10px] sm:text-[11px] font-semibold text-neutral-300">
                          {article.category || "Actualités"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
