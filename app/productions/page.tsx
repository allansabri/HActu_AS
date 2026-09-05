import Link from "next/link";
import { CalendarDays, Grid2X2, LayoutList, MapPin, Plus, Search, Table2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { productionHref } from "@/lib/links";
import { getProductionCompanies } from "@/lib/production-pro";
import { getProductionProjects } from "@/lib/queries";
import { ProductionProject } from "@/lib/types";

export const revalidate = 60;

type ViewMode = "browse" | "cards" | "weekly";

const statusOrder = [
  "En développement",
  "Pré-production",
  "En tournage",
  "Post-production",
  "Prêt à diffuser",
  "Sorti",
  "upcoming",
  "available",
  "ended",
  "cancelled"
];

function normalize(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function projectType(project: ProductionProject) {
  if (project.production_label) return project.production_label;
  return project.type === "series" ? "Série" : "Long métrage";
}

function shootDate(project: ProductionProject) {
  return project.filming_start_date || project.release_date_estimated || project.release_date_france || null;
}

function displayShootDate(project: ProductionProject) {
  const date = shootDate(project);
  return date ? formatDate(date) : project.release_year ? project.release_year.toString() : "À confirmer";
}

function locationText(project: ProductionProject) {
  return project.shooting_locations?.[0] || "À confirmer";
}

function statusClass(status: string) {
  const value = normalize(status);
  if (value.includes("tournage") || value.includes("production")) return "bg-emerald-400/12 text-emerald-300";
  if (value.includes("post")) return "bg-violet-400/12 text-violet-200";
  if (value.includes("pre") || value.includes("develop")) return "bg-sky-400/12 text-sky-200";
  if (value.includes("sorti") || value.includes("available")) return "bg-white/10 text-white/70";
  return "bg-yellow-400/12 text-yellow-200";
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function ViewTabs({ view, query }: { view: ViewMode; query: URLSearchParams }) {
  const tabs: Array<{ id: ViewMode; label: string; icon: typeof Table2 }> = [
    { id: "browse", label: "Parcourir", icon: Table2 },
    { id: "cards", label: "Cartes", icon: Grid2X2 },
    { id: "weekly", label: "Hebdomadaire", icon: CalendarDays }
  ];

  return (
    <div className="inline-flex rounded-[8px] border border-max-cyan/20 bg-black/30 p-1 shadow-[0_12px_35px_rgba(0,0,0,.25)]">
      {tabs.map((tab) => {
        const params = new URLSearchParams(query);
        params.set("view", tab.id);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={`/productions?${params.toString()}`}
            className={`inline-flex items-center gap-2 rounded-[6px] px-3 py-2 text-sm font-bold transition ${view === tab.id ? "bg-max-cyan text-black" : "text-white/62 hover:bg-white/10 hover:text-white"}`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

function FilterSelect({ label, name, value, options }: { label: string; name: string; value?: string; options: string[] }) {
  return (
    <label className="block rounded-[8px] border border-white/10 bg-[#070b13]/66 p-4">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</span>
      <select name={name} defaultValue={value || ""} className="mt-3 w-full rounded-[6px] border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-max-cyan">
        <option value="">Tous</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SidebarFilters({
  query,
  types,
  statuses,
  locations,
  search,
  type,
  status,
  location
}: {
  query: URLSearchParams;
  types: string[];
  statuses: string[];
  locations: string[];
  search: string;
  type?: string;
  status?: string;
  location?: string;
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
      <form action="/productions" className="rounded-[10px] border border-white/10 bg-white/[0.035] p-4">
        <input type="hidden" name="view" value={(query.get("view") as ViewMode) || "browse"} />
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Recherche</p>
        <div className="mt-3 flex items-center gap-2 rounded-[6px] border border-white/10 bg-black/25 px-3 py-2.5">
          <Search className="h-4 w-4 text-white/38" />
          <input name="s" defaultValue={search} placeholder="Recherche de productions..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35" />
        </div>
        <div className="mt-3 grid gap-3">
          <FilterSelect label="Type de production" name="type" value={type} options={types} />
          <FilterSelect label="Étape de production" name="status" value={status} options={statuses} />
          <FilterSelect label="Emplacement" name="location" value={location} options={locations} />
        </div>
        <button className="mt-4 w-full rounded-[6px] bg-max-cyan px-4 py-2.5 text-sm font-black text-black hover:bg-white">Filtrer</button>
      </form>

      {(search || type || status || location) ? (
        <div className="rounded-[10px] border-l-4 border-max-cyan bg-max-cyan/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Résultats pour</p>
            <Link href="/productions" className="text-xs font-bold text-red-200 hover:text-white">Effacer</Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[search, type, status, location].filter(Boolean).map((item) => (
              <span key={item} className="rounded-full bg-black/25 px-2.5 py-1 text-xs font-bold text-max-cyan">{item}</span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-[10px] border border-white/10 bg-white/[0.035] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Filtres rapides</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["En tournage", "Pré-production", "Post-production", "Sorti"].map((item) => {
            const params = new URLSearchParams(query);
            params.set("status", item);
            return (
              <Link key={item} href={`/productions?${params.toString()}`} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-bold text-white/70 hover:border-max-cyan hover:text-white">
                {item}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function BrowseTable({ projects }: { projects: ProductionProject[] }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[#070b13]/72 shadow-[0_18px_55px_rgba(0,0,0,.24)]">
      <div className="grid grid-cols-[1.2fr_0.55fr_0.7fr_0.95fr_0.55fr_54px] gap-4 border-b border-white/10 bg-white/[0.025] px-5 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-white/45 max-lg:hidden">
        <span>Titre</span>
        <span>Type</span>
        <span>Statut</span>
        <span>Emplacement</span>
        <span>Date de prise de vue</span>
        <span />
      </div>
      {projects.map((project) => (
        <Link key={project.id} href={productionHref(project.id)} className="group grid gap-3 border-b border-white/10 px-4 py-4 transition hover:bg-max-cyan/[0.055] last:border-b-0 lg:grid-cols-[1.2fr_0.55fr_0.7fr_0.95fr_0.55fr_54px] lg:items-center lg:gap-4 lg:px-5">
          <h3 className="text-base font-black leading-tight">{project.title}</h3>
          <p className="text-sm text-white/72">{projectType(project)}</p>
          <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-black ${statusClass(project.status)}`}>{project.status}</span>
          <p className="inline-flex min-w-0 items-center gap-1.5 truncate text-sm text-white/60"><MapPin className="h-3.5 w-3.5 shrink-0 text-white/35" />{locationText(project)}</p>
          <p className="text-sm text-white/72">{displayShootDate(project)}</p>
          <span className="text-sm font-black text-max-cyan transition group-hover:text-white lg:text-right">Voir</span>
        </Link>
      ))}
    </div>
  );
}

function CardsView({ projects }: { projects: ProductionProject[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <Link key={project.id} href={productionHref(project.id)} style={{ animationDelay: `${index * 45}ms` }} className="card-reveal group overflow-hidden rounded-[10px] border border-white/10 bg-[#070b13]/72 transition hover:border-max-cyan/50 hover:bg-white/[0.07]">
          <div className="relative aspect-[16/7] bg-white/5">
            {project.banner_url || project.poster_url || project.image_url ? <img src={project.banner_url || project.poster_url || project.image_url || ""} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:scale-105" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-black ${statusClass(project.status)}`}>{project.status}</span>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-black leading-tight">{project.title}</h3>
            <div className="mt-3 grid gap-2 text-sm text-white/62">
              <span>{projectType(project)}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-max-cyan" />{displayShootDate(project)}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-max-cyan" />{locationText(project)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function WeeklyView({ projects }: { projects: ProductionProject[] }) {
  const groups = Array.from(
    projects.reduce((map, project) => {
      const label = displayShootDate(project);
      map.set(label, [...(map.get(label) || []), project]);
      return map;
    }, new Map<string, ProductionProject[]>())
  );

  return (
    <div className="space-y-4">
      {groups.map(([label, items]) => (
        <section key={label} className="rounded-[10px] border border-white/10 bg-[#070b13]/72">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-lg font-black">{label}</h2>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">{items.length} production(s)</span>
          </div>
          <div className="divide-y divide-white/10">
            {items.map((project) => (
              <Link key={project.id} href={productionHref(project.id)} className="grid gap-2 px-5 py-4 hover:bg-max-cyan/[0.055] md:grid-cols-[1fr_150px_180px] md:items-center">
                <h3 className="font-black">{project.title}</h3>
                <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-black ${statusClass(project.status)}`}>{project.status}</span>
                <span className="text-sm text-white/62">{locationText(project)}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default async function ProductionsPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string; s?: string; type?: string; status?: string; location?: string }>;
}) {
  const params = await searchParams;
  const [allProjects, companies] = await Promise.all([getProductionProjects(), getProductionCompanies()]);
  const view = (["browse", "cards", "weekly"].includes(params.view || "") ? params.view : "browse") as ViewMode;
  const search = params.s?.trim() || "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => value && query.set(key, value));

  const types = uniqueValues(allProjects.map(projectType));
  const statuses = statusOrder.filter((status) => allProjects.some((project) => normalize(project.status) === normalize(status)));
  const extraStatuses = uniqueValues(allProjects.map((project) => project.status).filter((status) => !statuses.includes(status)));
  const locations = uniqueValues(allProjects.map(locationText).filter((location) => location !== "À confirmer"));

  const projects = allProjects.filter((project) => {
    const haystack = normalize(`${project.title} ${project.synopsis} ${project.production_company} ${project.director} ${project.showrunner} ${locationText(project)} ${project.casting?.join(" ")}`);
    if (search && !haystack.includes(normalize(search))) return false;
    if (params.type && projectType(project) !== params.type) return false;
    if (params.status && normalize(project.status) !== normalize(params.status)) return false;
    if (params.location && locationText(project) !== params.location) return false;
    return true;
  });
  const matchingCompanies = search
    ? companies.filter((company) => normalize(`${company.name} ${company.company_type} ${company.country}`).includes(normalize(search)))
    : [];

  const inProduction = allProjects.filter((project) => normalize(project.status).includes("tournage") || normalize(project.status).includes("production")).length;

  return (
    <main>
      <section className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(5,12,24,.98),rgba(16,34,52,.92)),radial-gradient(circle_at_20%_0%,rgba(142,161,172,.18),transparent_26rem)]">
        <div className="mx-auto max-w-[1520px] px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-max-cyan">Production tracker</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">Productions</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">Suivi éditorial des projets HBO, Max et Warner Bros. en développement, tournage, post-production ou diffusion.</p>
            </div>
            <ViewTabs view={view} query={query} />
          </div>
          <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3"><span className="rounded-[8px] bg-white/10 p-2.5 text-max-cyan"><LayoutList className="h-5 w-5" /></span><div><p className="text-2xl font-black">{allProjects.length}</p><p className="text-xs uppercase tracking-[0.18em] text-white/45">Productions</p></div></div>
            <div className="flex items-center gap-3"><span className="rounded-[8px] bg-white/10 p-2.5 text-max-cyan"><Plus className="h-5 w-5" /></span><div><p className="text-2xl font-black">{inProduction}</p><p className="text-xs uppercase tracking-[0.18em] text-white/45">En activité</p></div></div>
            <div className="flex items-center gap-3"><span className="rounded-[8px] bg-white/10 p-2.5 text-max-cyan"><MapPin className="h-5 w-5" /></span><div><p className="text-2xl font-black">{locations.length}</p><p className="text-xs uppercase tracking-[0.18em] text-white/45">Lieux</p></div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1520px] px-4 py-7 sm:px-6">
        <form action="/productions" className="rounded-[10px] border border-white/10 bg-[#070b13]/74 p-3 shadow-[0_18px_60px_rgba(0,0,0,.22)]">
          <input type="hidden" name="view" value={view} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[8px] bg-black/25 px-4 py-3">
              <Search className="h-5 w-5 text-max-cyan" />
              <input name="s" defaultValue={search} placeholder="Rechercher des productions, sociétés ou personnes..." className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-white/42" />
            </div>
            <Link href="/productions" className="inline-flex items-center justify-center px-3 text-sm font-bold text-white/55 hover:text-white">Effacer</Link>
            <button className="rounded-[8px] bg-max-cyan px-6 py-3 text-sm font-black text-black hover:bg-white">Rechercher</button>
          </div>
        </form>
        <p className="mt-3 text-sm text-white/50">Recherche par titre, société, équipe, casting ou lieu.</p>

        {matchingCompanies.length ? (
          <section className="mt-6 border border-max-cyan/25 bg-max-cyan/[0.06] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-max-cyan">Entreprises trouvées</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {matchingCompanies.map((company) => (
                <Link key={company.id} href={`/productions/entreprises/${company.slug}`} className="flex items-center gap-4 border border-white/10 bg-black/20 p-4 hover:border-max-cyan">
                  <div className="flex h-12 w-12 items-center justify-center bg-white/8 text-xl font-black text-white/35">{company.name.slice(0, 1)}</div>
                  <div>
                    <h2 className="font-black text-max-cyan">{company.name}</h2>
                    <p className="mt-1 text-sm text-white/52">{company.company_type || "Entreprise"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-6 rounded-[10px] border border-max-cyan/25 bg-[linear-gradient(135deg,rgba(142,161,172,.12),rgba(255,255,255,.035))] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-white/78"><strong>Dossiers production.</strong> Les fiches peuvent combiner dates, lieux, sociétés, notes internes et données TMDB.</p>
            <Link href="/admin/productions" className="rounded-[8px] bg-max-cyan px-4 py-2.5 text-sm font-black text-black hover:bg-white">Gérer dans l'admin</Link>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[340px_1fr]">
          <SidebarFilters query={query} types={types} statuses={[...statuses, ...extraStatuses]} locations={locations} search={search} type={params.type} status={params.status} location={params.location} />
          <div className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-white/62">Affichage de <strong className="text-white">{projects.length}</strong> production(s) sur <strong className="text-white">{allProjects.length}</strong>{search ? <> correspondant à <strong className="text-max-cyan">"{search}"</strong></> : null}</p>
              <select className="w-full rounded-[8px] border border-white/10 bg-[#080c14] px-3 py-2 text-sm text-white outline-none md:w-[280px]">
                <option>Date de prise de vue récente</option>
                <option>Titre</option>
                <option>Dernière mise à jour</option>
              </select>
            </div>
            {view === "browse" ? <BrowseTable projects={projects} /> : null}
            {view === "cards" ? <CardsView projects={projects} /> : null}
            {view === "weekly" ? <WeeklyView projects={projects} /> : null}
            {!projects.length ? <p className="rounded-[10px] border border-white/10 bg-white/[0.045] p-6 text-white/60">Aucune production ne correspond aux filtres.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
