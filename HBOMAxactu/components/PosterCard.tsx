import Link from "next/link";
import { formatDate } from "@/lib/format";
import { titleHref } from "@/lib/links";
import { ProductionProject } from "@/lib/types";

export function PosterCard({ project, index = 0 }: { project: ProductionProject; index?: number }) {
  return (
    <Link href={titleHref(project.type, project.title)} className="card-reveal group relative z-0 block transition-all duration-300 ease-in-out hover:z-10 hover:scale-105" style={{ animationDelay: `${index * 55}ms` }}>
      <article className="overflow-hidden rounded-[6px] border border-white/10 bg-white/[0.045] transition-all duration-300 ease-in-out group-hover:border-white/25 group-hover:shadow-[0_24px_70px_rgba(20,80,180,.32)]">
        <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
          {project.poster_url || project.image_url ? (
            <img src={project.poster_url || project.image_url || ""} alt="" className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-white/10 to-white/0" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
        <div className="p-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-max-cyan">{project.type}</p>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-tight">{project.title}</h3>
          <p className="mt-1.5 text-xs text-white/50">{formatDate(project.release_date_france || project.release_date_estimated)}</p>
        </div>
      </article>
    </Link>
  );
}
