import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { getProductionCompanyBySlug } from "@/lib/production-pro";
import { ProductionProject } from "@/lib/types";

export const revalidate = 60;

function normalize(value?: string | null) {
  return (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function groupName(project: ProductionProject) {
  const status = normalize(project.status);
  if (status.includes("develop") || status.includes("script") || status.includes("pitch")) return "Projets en développement";
  if (status.includes("pre")) return "Pré-production";
  if (status.includes("tournage") || status.includes("production")) return "En production";
  if (status.includes("post")) return "Post-production";
  if (status.includes("sorti") || status.includes("available") || status.includes("ended")) return "Déjà diffusés";
  return "Autres projets";
}

export default async function CompanyDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { slug } = await params;
  const filters = await searchParams;
  const data = await getProductionCompanyBySlug(slug);
  if (!data) notFound();

  const projects = data.projects.filter((project) => {
    if (filters.type && project.type !== filters.type) return false;
    if (filters.status && normalize(project.status) !== normalize(filters.status)) return false;
    return true;
  });
  const groups = Array.from(projects.reduce((map, project) => {
    const group = groupName(project);
    map.set(group, [...(map.get(group) || []), project]);
    return map;
  }, new Map<string, ProductionProject[]>()));
  const types = Array.from(new Set(data.projects.map((project) => project.type)));
  const statuses = Array.from(new Set(data.projects.map((project) => project.status)));

  return (
    <main className="bg-[#06080d]">
      <section className="border-b border-white/10 bg-[#0a0d13]">
        <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-4 py-8 sm:px-6">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center border border-white/10 bg-white/[0.04]">
            {data.company.logo_url ? <img src={data.company.logo_url} alt="" className="h-full w-full object-contain" /> : <Building2 className="h-12 w-12 text-white/25" />}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{data.company.name}</h1>
            <p className="mt-3 text-lg text-white/60">{data.company.company_type || "Entreprise de production"} {data.company.country ? `· ${data.company.country}` : ""}</p>
          </div>
          <Link href="/admin/productions" className="hidden border border-max-cyan px-4 py-3 text-sm font-black text-max-cyan hover:bg-max-cyan hover:text-black sm:block">Modifier</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5">
          <div>
            <Link href="/productions" className="text-sm font-bold text-max-cyan hover:text-white">← Retour aux productions</Link>
          </div>
          <div>
            <h2 className="text-2xl font-black">Contacts</h2>
            <div className="mt-4 space-y-3">
              {data.contacts.map((contact) => (
                <div key={contact.id} className="border border-white/10 bg-white/[0.035] p-4">
                  <h3 className="font-black">{contact.label || contact.city || "Bureau"}</h3>
                  {contact.website ? <a href={contact.website} target="_blank" rel="noreferrer" className="mt-3 flex gap-2 text-sm text-max-cyan"><ExternalLink className="h-4 w-4" />Site web</a> : null}
                  {contact.email ? <p className="mt-2 flex gap-2 text-sm text-white/65"><Mail className="h-4 w-4 text-max-cyan" />{contact.email}</p> : null}
                  {contact.phone ? <p className="mt-2 flex gap-2 text-sm text-white/65"><Phone className="h-4 w-4 text-max-cyan" />{contact.phone}</p> : null}
                  {contact.address ? <p className="mt-2 flex gap-2 text-sm leading-6 text-white/55"><MapPin className="h-4 w-4 shrink-0 text-max-cyan" />{contact.address}</p> : null}
                </div>
              ))}
              {!data.contacts.length ? (
                <div className="border border-white/10 bg-white/[0.035] p-4 text-sm text-white/55">
                  {data.company.website ? <a href={data.company.website} target="_blank" rel="noreferrer" className="text-max-cyan">{data.company.website}</a> : "Contacts à compléter dans l’admin."}
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="min-w-0 border border-white/10 bg-[#0b0e14] p-5 md:p-7">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black">Crédits et productions</h2>
              <p className="mt-2 text-sm text-white/48">{projects.length} titre(s)</p>
            </div>
            <form className="flex flex-wrap gap-2">
              <select name="type" defaultValue={filters.type || ""} className="border border-white/10 bg-black/30 px-3 py-2 text-sm">
                <option value="">Tous les types</option>
                {types.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <select name="status" defaultValue={filters.status || ""} className="border border-white/10 bg-black/30 px-3 py-2 text-sm">
                <option value="">Tous les statuts</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button className="bg-max-cyan px-4 py-2 text-sm font-black text-black">Filtrer</button>
            </form>
          </div>

          <div className="mt-6 space-y-8">
            {groups.map(([name, items]) => (
              <section key={name}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-black">{name}</h3>
                  <span className="text-xs font-bold text-white/42">{items.length} titre(s)</span>
                </div>
                <div className="divide-y divide-white/10">
                  {items.map((project) => (
                    <Link key={project.id} href={`/productions/${project.id}`} className="grid grid-cols-[46px_1fr_auto] items-center gap-4 py-4 hover:bg-white/[0.025]">
                      {project.poster_url || project.image_url ? <img src={project.poster_url || project.image_url || ""} alt="" className="h-16 w-11 object-cover" /> : <div className="h-16 w-11 bg-white/8" />}
                      <div>
                        <h4 className="font-black text-max-cyan">{project.title}</h4>
                        <p className="mt-1 text-sm text-white/52">{project.type} · {project.production_label || data.company.company_type}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-300">{project.status}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
            {!groups.length ? <p className="text-white/50">Aucun projet ne correspond aux filtres.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
