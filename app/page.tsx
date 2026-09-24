import Link from "next/link";
import { subscribeNewsletter } from "@/app/actions";
import { SectionHeading } from "@/components/SectionHeading";
import { ArticleCard, ArticleLandscapeCard } from "@/components/ArticleCard";
import { PosterCard } from "@/components/PosterCard";
import { HeroTeaser } from "@/components/HeroTeaser";
import { UpcomingSeriesBanner } from "@/components/UpcomingSeriesBanner";
import { LatestTrailersBanner } from "@/components/LatestTrailersBanner";
import { HomeTop10Section } from "@/components/HomeTop10Section";
import { formatDate, youtubeId } from "@/lib/format";
import { titleHref } from "@/lib/links";
import { getUpcomingSeriesBanner } from "@/lib/upcoming-banner";
import { getTrailersBannerConfig } from "@/lib/trailers-banner";
import { getTop10Config } from "@/lib/top10-config";
import { demoArticles } from "@/lib/demo-data";
import {
  getArticlesByCategory,
  getCollections,
  getLatestArticles,
  getProductionsByType,
  getTop10,
  getTrailerArticles,
  getUpcomingProductionProjects
} from "@/lib/queries";
import { Article, ProductionProject } from "@/lib/types";

export const revalidate = 60;

function NewsletterSection({ state }: { state?: string }) {
  return (
    <section id="newsletter" className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="uppercase tracking-[1.5px] text-[10px] font-bold text-max-cyan">Newsletter</div>
      <h3 className="mt-1.5 text-[17px] font-black leading-tight">Les sorties Max avant tout le monde.</h3>
      <form action={subscribeNewsletter} className="mt-4 space-y-2.5">
        <input
          name="email"
          type="email"
          required
          placeholder="votre@email.com"
          className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-sm placeholder:text-white/40 focus:border-max-cyan focus:outline-none"
        />
        <button className="w-full rounded-full bg-white py-2.5 text-sm font-bold text-black transition hover:bg-max-cyan">
          Je m’abonne gratuitement
        </button>
      </form>
      {state === "ok" && <p className="mt-2 text-sm text-emerald-400">Merci ! Inscription confirmée.</p>}
      {state === "invalid" && <p className="mt-2 text-sm text-red-300">Email invalide.</p>}
      {state === "unavailable" && <p className="mt-2 text-sm text-yellow-300">Service newsletter non configuré.</p>}
    </section>
  );
}

function ArticleRowCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      style={{ animationDelay: `${index * 45}ms` }}
      className="card-reveal group grid grid-cols-[112px_1fr] gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-2.5 transition hover:border-white/25 hover:bg-white/[0.07] sm:grid-cols-[156px_1fr]"
    >
      <div className="relative overflow-hidden rounded-[5px]">
        <img
          src={article.image_url || "/max-reference-bg.png"}
          alt=""
          className="aspect-[16/10] h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      <div className="min-w-0 py-1">
        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-max-cyan">
          <span>{article.category}</span>
          <time className="text-white/38">{formatDate(article.published_at || article.created_at)}</time>
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-black leading-tight md:text-base">{article.title}</h3>
        {article.excerpt ? <p className="mt-1.5 hidden line-clamp-2 text-xs leading-5 text-white/55 sm:block">{article.excerpt}</p> : null}
      </div>
    </Link>
  );
}

function MediaLandscapeCard({ project, index = 0 }: { project: ProductionProject; index?: number }) {
  const year = project.release_year || (project.release_date_france ? new Date(project.release_date_france).getFullYear() : null);
  const label = project.production_label || (project.type === "series" ? "Série" : "Film");
  return (
    <Link
      href={titleHref(project.type, project.title)}
      style={{ animationDelay: `${index * 25}ms` }}
      className="card-reveal group grid grid-cols-[104px_1fr] overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] transition hover:border-white/30 hover:bg-white/[0.055] sm:grid-cols-[126px_1fr]"
    >
      <div className="relative min-h-[82px] overflow-hidden bg-zinc-950">
        {project.banner_url || project.poster_url || project.image_url ? (
          <img
            src={project.banner_url || project.poster_url || project.image_url || ""}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>
      <div className="min-w-0 p-3.5">
        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-max-cyan">
          <span>{label}</span>
          {year && <span className="font-normal text-white/35">• {year}</span>}
        </div>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-tight tracking-tight">{project.title}</h3>
        <p className="mt-1 text-[12px] text-white/50">
          {formatDate(project.release_date_france || project.release_date_estimated)}
        </p>
      </div>
    </Link>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ newsletter?: string }>;
}) {
  const params = await searchParams;
  const [articles, top10, trailers, upcoming, series, movies, upcomingSeriesBanner, cinemaArticles, trailersBannerConfig, top10Config] = await Promise.all([
    getLatestArticles(16),
    getTop10(),
    getTrailerArticles(3),
    getUpcomingProductionProjects(6),
    getProductionsByType("series", 8),
    getProductionsByType("movie", 8),
    getUpcomingSeriesBanner(),
    getArticlesByCategory("Cinéma"),
    getTrailersBannerConfig(),
    getTop10Config(),
  ]);

  const moreNews = articles.slice(0, 4);
  const cinemaFiltered = [
    ...(cinemaArticles || []),
    ...articles.filter((a) => {
      const cat = (a.category || "").toLowerCase();
      const title = (a.title || "").toLowerCase();
      return cat.includes("ciné") || cat.includes("film") || title.includes("film") || title.includes("cinéma");
    }),
    ...demoArticles.filter((a) => {
      const cat = (a.category || "").toLowerCase();
      const title = (a.title || "").toLowerCase();
      return cat.includes("ciné") || cat.includes("film") || title.includes("film") || title.includes("cinéma");
    }),
    ...articles,
  ];
  const seenCinema = new Set<string>();
  const cinemaCards: Article[] = [];
  const cinemaSidebarArticles: Article[] = [];
  for (const art of cinemaFiltered) {
    if (!seenCinema.has(art.slug)) {
      seenCinema.add(art.slug);
      if (cinemaCards.length < 5) {
        cinemaCards.push(art);
      } else if (cinemaSidebarArticles.length < 8) {
        cinemaSidebarArticles.push(art);
      }
    }
    if (cinemaCards.length >= 5 && cinemaSidebarArticles.length >= 8) break;
  }

  const recentProductions = [...series.slice(0, 4), ...movies.slice(0, 4)];

  return (
    <main className="bg-[#050a0a]">
      {/* Cinematic Hero Teaser, touching navbar */}
      <HeroTeaser />

      {/* Section 1 : Les dernières actualités */}
      <section className="w-full bg-gradient-to-b from-[#050a0a] to-[#0e171f] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Les dernières actualités</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {moreNews.length > 0 ? (
              moreNews.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))
            ) : (
              <p className="text-white/50 col-span-full">Pas encore d’articles publiés.</p>
            )}
          </div>

          {/* Bouton en pilule pour voir toutes les actualités */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/actualites"
              className="inline-flex items-center justify-center rounded-full bg-[#8197a9] px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99]"
            >
              Voir toutes les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* Section : Nouvelles séries à venir en 2026 / 2027 */}
      <UpcomingSeriesBanner config={upcomingSeriesBanner} />

      {/* Section : Cinéma (2 grandes cards en haut + 3 moins grandes en dessous, format portrait comme Les dernières actualités) */}
      <section
        id="section-cinema"
        aria-label="Section Cinéma"
        className="w-full bg-gradient-to-b from-[#050a0a] to-[#0e171f] py-8 sm:py-10 lg:py-12"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Cinéma</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8 xl:gap-10">
            {/* Colonne Cinéma : 2 grandes cartes en haut (largeur réduite, grande hauteur préservée) + 3 moins grandes en dessous */}
            <div className="w-full lg:w-[680px] xl:w-[700px] shrink-0 flex flex-col justify-between">
              {/* 2 grandes cartes côte à côte : largeur réduite à ~340px avec hauteur d'affiche maintenue */}
              <div className="flex flex-col sm:flex-row gap-5">
                {cinemaCards.slice(0, 2).map((article, index) => (
                  <div key={article.id || index} className="w-full sm:w-[330px] xl:w-[340px] shrink-0">
                    <ArticleCard
                      article={article}
                      index={index}
                      large={true}
                      imageHeight="h-[225px] sm:h-[250px]"
                    />
                  </div>
                ))}
              </div>

              {/* 3 cartes moins grandes en dessous */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4.5 mt-6">
                {cinemaCards.slice(2, 5).map((article, index) => (
                  <ArticleCard key={article.id || index + 2} article={article} index={index + 2} large={false} />
                ))}
              </div>
            </div>

            {/* Colonne à droite : liste des articles cinéma sans rectangle de fond */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col mt-6 lg:mt-0">
              <div className="flex flex-col justify-between h-full gap-2 sm:gap-2.5">
                {cinemaSidebarArticles.map((article, index) => (
                  <Link
                    key={article.id || index}
                    href={`/actualites/${article.slug}`}
                    className="group flex items-center gap-3.5 p-1 sm:p-1.5 rounded-none transition-all duration-200 hover:bg-white/[0.04]"
                  >
                    {/* Card au format carré pas trop petite à gauche */}
                    <div className="relative aspect-square w-18 h-18 sm:w-20 sm:h-20 md:w-[78px] md:h-[78px] rounded-none overflow-hidden shrink-0 bg-neutral-900 border border-white/10 shadow-md group-hover:border-[#7a8fa1]/50 transition-colors">
                      <img
                        src={article.image_url || "/max-reference-bg.png"}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                        {article.category || "Cinéma"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton en pilule identique à la section Les dernières actualités */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/actualites?tab=cinema"
              className="inline-flex items-center justify-center rounded-full bg-[#8197a9] px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99]"
            >
              Voir toutes les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* Section : Les dernières bandes-annonces (fond identique à la section À venir 2026) */}
      <LatestTrailersBanner config={trailersBannerConfig} />

      {/* Section : Les plus populaires sur HBO Max (Top 5 Séries à gauche + Top 5 Films à droite) */}
      <HomeTop10Section items={top10} config={top10Config} />

      {/* Section 2 : Nouveautés sur Max */}
      <section className="w-full bg-gradient-to-b from-[#050a0a] to-[#0e171f] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 flex items-baseline justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-max-cyan">Catalogue Max</p>
              <h2 className="text-3xl font-black tracking-[-0.02em]">Nouveautés &amp; à voir sur Max</h2>
            </div>
            <div className="hidden gap-4 text-sm md:flex">
              <Link href="/series" className="font-medium text-max-cyan hover:underline">Séries</Link>
              <Link href="/films" className="font-medium text-max-cyan hover:underline">Films</Link>
              <Link href="/nouveautes" className="font-medium text-white/70 hover:text-white">Toutes →</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {recentProductions.slice(0, 12).map((project, i) => (
              <PosterCard key={project.id} project={project} index={i} showStatus={false} />
            ))}
          </div>

          <div className="mt-2 text-right text-sm">
            <Link href="/productions" className="text-max-cyan hover:underline">Explorer tout le catalogue →</Link>
          </div>
        </div>
      </section>

      {/* Section 3 : Prochainement sur Max */}
      <section className="w-full bg-gradient-to-b from-[#050a0a] to-[#0e171f] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-max-cyan">Agenda</p>
              <h2 className="text-3xl font-black tracking-[-0.02em]">Prochainement sur Max</h2>
            </div>
            <Link href="/prochainement" className="hidden text-sm font-medium text-max-cyan hover:underline md:block">Voir le calendrier complet →</Link>
          </div>

          {upcoming.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.slice(0, 6).map((project, index) => (
                <MediaLandscapeCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-white/60">Aucune sortie annoncée pour le moment.</p>
          )}

          <div className="mt-3 md:hidden">
            <Link href="/prochainement" className="text-sm font-medium text-max-cyan">Voir tout le calendrier →</Link>
          </div>
        </div>
      </section>

      {/* Section 4 : Newsletter + Extraits & Bandes-annonces */}
      <section className="w-full bg-gradient-to-b from-[#050a0a] to-[#0e171f] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <NewsletterSection state={params.newsletter} />
            </div>

            <div className="space-y-6 lg:col-span-7">
              {trailers.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight">Extraits &amp; Bandes-annonces</h3>
                    <Link href="/bandes-annonces" className="text-xs font-bold text-max-cyan hover:text-white">Toutes →</Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {trailers.map((article) => {
                      const id = youtubeId(article.youtube_video_url);
                      return (
                        <Link key={article.id} href={`/actualites/${article.slug}`} className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/25">
                          {id && <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${id}`} title={article.title} allowFullScreen />}
                          <div className="p-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-max-cyan">{article.category}</p>
                            <h4 className="mt-1 line-clamp-2 text-[15px] font-black leading-tight group-hover:text-max-cyan">{article.title}</h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
