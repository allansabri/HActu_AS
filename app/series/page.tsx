import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { formatDate } from "@/lib/format";
import { titleHref } from "@/lib/links";
import { getProductionsByType } from "@/lib/queries";

export const revalidate = 60;

export default async function SeriesPage() {
  const series = await getProductionsByType("series", 60);

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <SectionHeading eyebrow="Catalogue" title="Séries HBO & Max" text="Toutes les séries ajoutées depuis les fiches productions et enrichies via TMDB." />
        <span className="hidden text-sm text-white/50 md:block">{series.length} titres</span>
      </div>
      <div className="space-y-3">
        {series.map((project) => (
          <Link 
            key={project.id} 
            href={titleHref(project.type, project.title)} 
            className="flex gap-4 rounded-xl border border-white/10 bg-[#0a0c14] p-3.5 transition hover:border-white/30 hover:bg-white/[0.02]"
          >
            <div className="h-[78px] w-[56px] flex-shrink-0 overflow-hidden rounded-md bg-zinc-950">
              {(project.poster_url || project.image_url) && <img src={project.poster_url || project.image_url || ""} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-max-cyan">{project.production_label || "Série"}</p>
              <h3 className="mt-0.5 font-bold leading-tight tracking-tight text-[15.5px]">{project.title}</h3>
              <p className="mt-0.5 text-xs text-white/55">{formatDate(project.release_date_france || project.release_date_estimated)}</p>
              {project.synopsis && <p className="mt-1.5 line-clamp-2 text-xs text-white/65">{project.synopsis}</p>}
            </div>
          </Link>
        ))}
      </div>
      {!series.length ? <p className="text-white/60">Aucune série enregistrée.</p> : null}
      <div className="mt-8 text-center text-xs text-white/50">
        <Link href="/productions" className="hover:text-white">Explorer toutes les productions →</Link>
      </div>
    </main>
  );
}
