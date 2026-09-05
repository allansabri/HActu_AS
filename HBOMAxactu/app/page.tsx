import Link from "next/link";
import { subscribeNewsletter } from "@/app/actions";
import { SectionHeading } from "@/components/SectionHeading";
import { Top10Widget } from "@/components/Top10Widget";
import { formatDate, youtubeId } from "@/lib/format";
import { titleHref } from "@/lib/links";
import {
  getCollections,
  getLatestArticles,
  getProductionsByType,
  getTop10,
  getTrailerArticles,
  getUpcomingProductionProjects
} from "@/lib/queries";
import { Article, ProductionProject } from "@/lib/types";

export const revalidate = 60;

function TrendBar({ items }: { items: Array<{ title: string; href: string }> }) {
  if (!items.length) return null;
  return (
    <section className="border-y border-white/10 bg-white/[0.035]">
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 overflow-x-auto px-4 py-2 text-xs sm:px-6">
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.22em] text-max-cyan">
          En ce moment
        </span>
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 font-medium text-white/75 transition hover:border-white/30 hover:text-white"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection({ state }: { state?: string }) {
  return (
    <section id="newsletter" className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-max-cyan">Newsletter</p>
      <h2 className="mt-2 text-lg font-black leading-tight">Recevoir les sorties Max avant tout le monde.</h2>
      <form action={subscribeNewsletter} className="mt-4 space-y-2">
        <input
          name="email"
          type="email"
          required
          placeholder="ton@email.com"
          className="w-full rounded-full border border-white/10 bg-black/35 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-max-cyan"
        />
        <button className="w-full rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition-colors duration-200 ease-in-out hover:bg-max-cyan">
          S'abonner
        </button>
      </form>
      {state === "ok" ? <p className="mt-3 text-sm text-emerald-300">Inscription enregistree.</p> : null}
      {state === "invalid" ? <p className="mt-3 text-sm text-red-200">Email invalide.</p> : null}
      {state === "unavailable" ? <p className="mt-3 text-sm text-yellow-200">Newsletter a configurer dans Supabase.</p> : null}
    </section>
  );
}

function ArticleHero({ article }: { article: Article }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group grid overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] transition hover:border-white/25 md:grid-cols-[1.18fr_0.82fr]"
    >
      <div className="relative min-h-[230px] overflow-hidden bg-white/5 md:min-h-[360px]">
        <img
          src={article.image_url || "/max-reference-bg.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
      </div>
      <div className="flex flex-col justify-center p-4 md:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-max-cyan">{article.category}</p>
        <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight md:text-4xl">{article.title}</h2>
        {article.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/64">{article.excerpt}</p> : null}
        <time className="mt-5 text-xs font-medium text-white/45">{formatDate(article.published_at || article.created_at)}</time>
      </div>
    </Link>
  );
}

function ArticleRowCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      style={{ animationDelay: `${index * 45}ms` }}
      className="card-reveal group grid grid-cols-[112px_1fr] gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-2.5 transition hover:border-white/25 hover:bg-white/[0.07] sm:grid-cols-[156px_1fr]"
    >
      <img
        src={article.image_url || "/max-reference-bg.png"}
        alt=""
        className="aspect-[16/10] h-full w-full rounded-[5px] object-cover transition duration-300 group-hover:scale-[1.025]"
      />
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
  return (
    <Link
      href={titleHref(project.type, project.title)}
      style={{ animationDelay: `${index * 45}ms` }}
      className="card-reveal group grid grid-cols-[118px_1fr] overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.04] transition hover:border-white/25 hover:bg-white/[0.07] sm:grid-cols-[154px_1fr]"
    >
      <div className="relative min-h-[94px] overflow-hidden bg-white/5">
        {project.banner_url || project.poster_url || project.image_url ? (
          <img
            src={project.banner_url || project.poster_url || project.image_url || ""}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="min-w-0 p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-max-cyan">
          {project.production_label || (project.type === "series" ? "Serie" : "Film")}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-black leading-tight">{project.title}</h3>
        <p className="mt-1.5 text-xs text-white/45">{formatDate(project.release_date_france || project.release_date_estimated)}</p>
        {project.synopsis ? <p className="mt-2 hidden line-clamp-2 text-xs leading-5 text-white/55 sm:block">{project.synopsis}</p> : null}
      </div>
    </Link>
  );
}

export default async function HomePage({ searchParams }: { searchParams: { newsletter?: string } }) {
  const [articles, top10, trailers, upcoming, series, movies, collections] = await Promise.all([
    getLatestArticles(12),
    getTop10(),
    getTrailerArticles(3),
    getUpcomingProductionProjects(4),
    getProductionsByType("series", 6),
    getProductionsByType("movie", 6),
    getCollections(6)
  ]);

  const trendItems = [
    ...top10.slice(0, 6).map((item) => ({ title: item.title, href: titleHref(item.type, item.title) })),
    ...series.slice(0, 3).map((item) => ({ title: item.title, href: titleHref(item.type, item.title) }))
  ];

  return (
    <main>
      <TrendBar items={trendItems} />

      <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-9">
          <section>
            <SectionHeading
              eyebrow="Actu Max"
              title="Dernieres actualites"
              text="News, sorties, bandes-annonces et dossiers HBO, Max et Warner Bros."
            />
            {articles[0] ? <ArticleHero article={articles[0]} /> : <p className="text-white/60">Aucun article publie pour le moment.</p>}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {articles.slice(1, 5).map((article, index) => (
                <ArticleRowCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Catalogue"
              title="A voir sur Max"
              text="Une selection compacte de films et series pour donner un rendu plus proche d'un site media."
            />
            <div className="grid gap-3 md:grid-cols-2">
              {[...series.slice(0, 3), ...movies.slice(0, 3)].map((project, index) => (
                <MediaLandscapeCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Prochainement" title="Calendrier des sorties" text="Les prochaines fiches suivies depuis les productions." />
            <div className="grid gap-3 md:grid-cols-2">
              {upcoming.slice(0, 4).map((project, index) => (
                <MediaLandscapeCard key={project.id} project={project} index={index} />
              ))}
            </div>
            {!upcoming.length ? <p className="text-white/60">Aucun contenu prochainement pour le moment.</p> : null}
          </section>

          <section>
            <SectionHeading eyebrow="Collections" title="Univers thematiques" />
            <div className="grid gap-3 md:grid-cols-3">
              {collections.map((collection, index) => (
                <Link
                  key={collection.id}
                  href="/collections"
                  style={{ animationDelay: `${index * 45}ms` }}
                  className="card-reveal rounded-[8px] border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <h3 className="text-base font-black">{collection.title}</h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/55">{collection.description || "Collection editoriale."}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:h-fit">
          <Top10Widget items={top10} />
          <NewsletterSection state={searchParams.newsletter} />

          <section className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Bandes-annonces</h2>
              <Link href="/bandes-annonces" className="text-xs font-bold text-max-cyan hover:text-white">
                Voir plus
              </Link>
            </div>
            <div className="space-y-3">
              {trailers.map((article) => {
                const id = youtubeId(article.youtube_video_url);
                return (
                  <Link key={article.id} href={`/actualites/${article.slug}`} className="group block overflow-hidden rounded-[6px] border border-white/10 bg-black/20 hover:border-white/25">
                    {id ? <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${id}`} title={article.title} allowFullScreen /> : null}
                    <div className="p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-max-cyan">{article.category}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-black leading-tight">{article.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
