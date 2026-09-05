import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/format";
import { productionHref } from "@/lib/links";
import { Article, ProductionProject } from "@/lib/types";

function productionDate(project: ProductionProject) {
  if (project.release_date_france || project.release_date_estimated) {
    return formatDate(project.release_date_france || project.release_date_estimated);
  }
  return project.release_year ? project.release_year.toString() : "Date à confirmer";
}

export function FeatureCardSlider({
  projects,
  articles
}: {
  projects: ProductionProject[];
  articles: Article[];
}) {
  const cards = [
    ...projects.slice(0, 4).map((project) => ({
      key: `production-${project.id}`,
      href: productionHref(project.id),
      image: project.banner_url || project.poster_url || project.image_url || "/max-reference-bg.png",
      eyebrow: project.production_label || "Production",
      badge: project.status,
      title: project.title,
      text: project.synopsis || "Informations de production a venir.",
      detail: productionDate(project)
    })),
    ...articles.slice(0, 3).map((article) => ({
      key: `article-${article.id}`,
      href: `/actualites/${article.slug}`,
      image: article.image_url || "/max-reference-bg.png",
      eyebrow: "Actualité",
      badge: article.category,
      title: article.title,
      text: article.excerpt || "Retrouvez toutes les informations dans l'article.",
      detail: formatDate(article.published_at || article.created_at)
    }))
  ].slice(0, 5);

  if (!cards.length) {
    return (
      <section className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
        <div className="max-w-4xl rounded-lg border border-white/10 bg-white/[0.045] p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-max-cyan">Sélection</p>
          <h1 className="mt-3 text-2xl font-black md:text-4xl">Ajoutez des productions ou articles pour alimenter les cartes.</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-max-cyan">À suivre</p>
          <h1 className="mt-1.5 text-xl font-black md:text-2xl">Productions et actualités en vue</h1>
        </div>
        <p className="hidden text-xs text-white/45 md:block">Faire défiler les cartes</p>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
        {cards.map((card, index) => (
          <Link
            key={card.key}
            href={card.href}
            style={{ animationDelay: `${index * 65}ms` }}
            className="card-reveal group relative z-0 min-h-[270px] w-[82vw] max-w-[550px] shrink-0 snap-start overflow-hidden rounded-lg border border-white/10 bg-[#101318] transition-all duration-300 ease-in-out hover:z-10 hover:scale-105 hover:border-white/25 hover:shadow-[0_24px_70px_rgba(20,80,180,.34)] md:min-h-[310px] md:w-[44vw]"
          >
            <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-300 ease-in-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060b] via-[#05060b]/48 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em]">
                <span className="rounded-full bg-max-blue px-2.5 py-1 text-black">{card.badge}</span>
                <span className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-white/75">{card.eyebrow}</span>
                {index === 0 ? <span className="rounded-full border border-max-cyan/40 px-2.5 py-1 text-max-cyan">En avant</span> : null}
              </div>
              <h2 className="text-2xl font-black leading-none tracking-tight md:text-4xl">{card.title}</h2>
              <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-5 text-white/72 md:text-sm">{card.text}</p>
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-white/65">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{card.detail}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-white transition-colors duration-200 ease-in-out group-hover:bg-max-cyan group-hover:text-black">Voir la fiche <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
