import Link from "next/link";
import { formatDate } from "@/lib/format";
import { titleHref } from "@/lib/links";
import { ProductionProject } from "@/lib/types";

function getYear(project: ProductionProject) {
  if (project.release_date_france) return new Date(project.release_date_france).getFullYear();
  if (project.release_date_estimated) return new Date(project.release_date_estimated).getFullYear();
  return project.release_year || null;
}

function getStatusColor(status?: string | null) {
  const s = (status || "").toLowerCase();
  if (s.includes("tournage") || s.includes("production")) return "bg-emerald-500/90 text-white";
  if (s.includes("post")) return "bg-violet-500/90 text-white";
  if (s.includes("pré") || s.includes("develop")) return "bg-sky-500/90 text-white";
  if (s.includes("sorti") || s.includes("available")) return "bg-white/90 text-black";
  return "bg-white/15 text-white";
}

export function PosterCard({ project, index = 0, showStatus = true }: { project: ProductionProject; index?: number; showStatus?: boolean }) {
  const year = getYear(project);
  const label = project.production_label || (project.type === "series" ? "Série" : "Film");

  return (
    <Link
      href={titleHref(project.type, project.title)}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-[#0a0c14] transition-all hover:border-white/25"
      style={{ animationDelay: `${index * 25}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-950">
        {project.poster_url || project.image_url ? (
          <img
            src={project.poster_url || project.image_url || ""}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="h-full w-full bg-zinc-900" />
        )}
        {showStatus && project.status && (
          <span className="absolute top-2 right-2 rounded bg-black/75 px-1.5 py-px text-[9px] font-medium tracking-wider text-white/90">
            {project.status}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 text-[11px] text-white/50">
          <span className="font-semibold uppercase tracking-[0.5px] text-max-cyan/90">{label}</span>
          {year && <span className="text-white/35">• {year}</span>}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[14.5px] font-bold leading-snug text-white group-hover:text-white">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
