import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CalendarDays, ExternalLink, MapPin, Pencil, Radio } from "lucide-react";
import { ProductionProTabs } from "@/components/production/ProductionProTabs";
import { formatDate } from "@/lib/format";
import { getLatestArticles, getProductionProjectById } from "@/lib/queries";
import { getProductionProjectPro } from "@/lib/production-pro";
import { getTmdbTitleDetails } from "@/lib/tmdb";

export const revalidate = 60;

function statusColor(status: string) {
  const value = status.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (value.includes("tournage") || value.includes("production")) return "bg-emerald-500/15 text-emerald-300";
  if (value.includes("post")) return "bg-violet-500/15 text-violet-200";
  if (value.includes("pre") || value.includes("develop")) return "bg-sky-500/15 text-sky-200";
  return "bg-white/10 text-white/70";
}

export default async function ProductionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProductionProjectById(id);
  if (!project) notFound();

  const [data, articles, tmdb] = await Promise.all([
    getProductionProjectPro(project),
    getLatestArticles(8),
    project.tmdb_id && project.tmdb_media_type
      ? getTmdbTitleDetails(project.tmdb_media_type, project.tmdb_id).catch(() => null)
      : Promise.resolve(null)
  ]);

  const relatedArticles = articles.filter((article) =>
    `${article.title} ${article.content}`.toLowerCase().includes(project.title.toLowerCase())
  );

  return (
    <main className="bg-[#06080d]">
      <section className="border-b border-white/10 bg-[#0a0d13]">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[210px_1fr_260px]">
          <div className="aspect-[2/3] overflow-hidden border border-white/10 bg-white/5">
            {project.poster_url || project.image_url ? <img src={project.poster_url || project.image_url || ""} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-black ${statusColor(project.status)}`}>{project.status}</span>
              <span className="rounded-full border border-white/12 px-3 py-1 text-xs font-bold text-white/62">{project.type === "series" ? "Série TV" : project.type === "movie" ? "Film" : project.type}</span>
              {project.content_rating ? <span className="rounded-full border border-white/12 px-3 py-1 text-xs font-bold text-white/62">{project.content_rating}</span> : null}
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{project.title}</h1>
            {project.original_title ? <p className="mt-2 text-sm text-white/45">Titre original : {project.original_title}</p> : null}
            <p className="mt-5 max-w-3xl leading-8 text-white/72">{project.synopsis || tmdb?.overview || "Aucun synopsis disponible."}</p>
            <dl className="mt-6 grid gap-x-7 gap-y-3 text-sm sm:grid-cols-2">
              {project.season_number ? <div><dt className="text-white/42">Saison suivie</dt><dd className="mt-1 font-black">{project.season_number}</dd></div> : null}
              {project.showrunner || project.director ? <div><dt className="text-white/42">Création / réalisation</dt><dd className="mt-1 font-black">{project.showrunner || project.director}</dd></div> : null}
              {project.production_company ? <div><dt className="text-white/42">Production</dt><dd className="mt-1 font-black">{project.production_company}</dd></div> : null}
              {project.genres?.length ? <div><dt className="text-white/42">Genres</dt><dd className="mt-1 font-black">{project.genres.join(", ")}</dd></div> : null}
            </dl>
          </div>
          <aside className="space-y-3">
            <Link href="/admin/productions" className="flex items-center justify-center gap-2 border border-max-cyan px-4 py-3 text-sm font-black text-max-cyan hover:bg-max-cyan hover:text-black"><Pencil className="h-4 w-4" />Modifier la fiche</Link>
            <div className="border border-white/10 bg-white/[0.035] p-4">
              <h2 className="font-black">Statut</h2>
              <p className="mt-3 text-lg font-black text-max-cyan">{project.status}</p>
              <p className="mt-1 text-xs text-white/42">Mis à jour le {formatDate(project.updated_at)}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.035] p-4">
              <h2 className="font-black">Sortie</h2>
              <p className="mt-3 text-sm text-white/70">{formatDate(project.release_date_france || project.release_date_estimated)}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-20 lg:h-fit">
          <div>
            <h2 className="text-2xl font-black">Contacts</h2>
            <div className="mt-4 space-y-3">
              {data.companies.map((company) => (
                <Link key={company.id} href={`/productions/entreprises/${company.slug}`} className="block border border-white/10 bg-white/[0.035] p-4 hover:border-max-cyan">
                  <p className="text-xs font-black uppercase tracking-wide text-white/42">{company.company_type || "Société"}</p>
                  <p className="mt-2 font-black text-max-cyan">{company.name}</p>
                </Link>
              ))}
              {data.contacts.map((contact) => (
                <div key={contact.id} className="border border-white/10 bg-white/[0.035] p-4 text-sm">
                  <p className="font-black">{contact.label || contact.city || "Bureau"}</p>
                  {contact.website ? <a href={contact.website} target="_blank" rel="noreferrer" className="mt-2 block text-max-cyan">{contact.website}</a> : null}
                  {contact.phone ? <p className="mt-2 text-white/68">{contact.phone}</p> : null}
                  {contact.address ? <p className="mt-2 leading-6 text-white/55">{contact.address}</p> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.035] p-4">
            <h2 className="font-black">Production</h2>
            <div className="mt-3 space-y-3 text-sm text-white/65">
              {project.shooting_locations?.length ? <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-max-cyan" />{project.shooting_locations.join(", ")}</p> : null}
              {project.filming_start_date ? <p className="flex gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-max-cyan" />Du {formatDate(project.filming_start_date)} au {formatDate(project.filming_end_date)}</p> : null}
              {project.platform ? <p className="flex gap-2"><Radio className="h-4 w-4 shrink-0 text-max-cyan" />{project.platform}</p> : null}
              {project.source_url ? <a href={project.source_url} target="_blank" rel="noreferrer" className="flex gap-2 text-max-cyan"><ExternalLink className="h-4 w-4" />Source</a> : null}
            </div>
          </div>
        </aside>

        <ProductionProTabs data={data} tmdb={tmdb} articles={relatedArticles} />
      </section>
    </main>
  );
}
