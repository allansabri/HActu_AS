"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { FileJson, Link2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProductionCompanySection, upsertProductionCompanySection } from "@/app/admin/actions";
import { ProductionCompany, ProductionCompanySection, ProductionProject } from "@/lib/types";

type Assignment = { section_id: string; project_id: string };
type ImportResult = { created: number; updated: number; skipped: number; errors: string[] };
type ImportRow = Record<string, unknown>;
type BatchResult = ImportResult & { projectIds: string[] };
type EnrichResult = { enriched: number; alreadyLinked: number; notFound: number; errors: string[] };
type SectionProject = Pick<ProductionProject, "id" | "title" | "status" | "type" | "imdb_id" | "poster_url" | "image_url">;

function readRows(parsed: unknown): ImportRow[] {
  if (Array.isArray(parsed)) return parsed as ImportRow[];
  if (parsed && typeof parsed === "object") {
    const object = parsed as Record<string, unknown>;
    const rows = object.productions || object.projects || object.results || object.data || object.items;
    if (Array.isArray(rows)) return rows as ImportRow[];
  }
  throw new Error("JSON invalide : aucune liste productions/projects trouvée.");
}

function createImportBatches(rows: ImportRow[]) {
  const batches: ImportRow[][] = [];
  let current: ImportRow[] = [];
  let currentSize = 0;
  for (const row of rows) {
    const size = new Blob([JSON.stringify(row)]).size;
    if (current.length && (current.length >= 5 || currentSize + size > 350_000)) {
      batches.push(current);
      current = [];
      currentSize = 0;
    }
    current.push(row);
    currentSize += size;
  }
  if (current.length) batches.push(current);
  return batches;
}

async function request<T>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/admin/production-section-import", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({ error: `Réponse HTTP ${response.status}` }));
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : `Erreur HTTP ${response.status}`);
  return data as T;
}

export function ProductionCompanySections({
  company,
  sections,
  assignments,
  projects
}: {
  company: ProductionCompany;
  sections: ProductionCompanySection[];
  assignments: Assignment[];
  projects: SectionProject[];
}) {
  const router = useRouter();
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [jsonValues, setJsonValues] = useState<Record<string, string>>({});
  const [searches, setSearches] = useState<Record<string, string>>({});
  const projectMap = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);

  function message(sectionId: string, value: string) {
    setMessages((current) => ({ ...current, [sectionId]: value }));
  }

  async function importRows(sectionId: string, rows: ImportRow[], replaceSection: boolean) {
    if (!rows.length) throw new Error("Le JSON ne contient aucun projet.");
    const batches = createImportBatches(rows);
    const totals: ImportResult = { created: 0, updated: 0, skipped: 0, errors: [] };
    const projectIds: string[] = [];

    for (let index = 0; index < batches.length; index += 1) {
      message(sectionId, `Lot ${index + 1}/${batches.length} · ${projectIds.length}/${rows.length} projet(s) traité(s)...`);
      const result = await request<BatchResult>({
        operation: "batch",
        companyId: company.id,
        sectionId,
        rows: batches[index]
      });
      totals.created += result.created;
      totals.updated += result.updated;
      totals.skipped += result.skipped;
      totals.errors.push(...result.errors.map((error) => `Lot ${index + 1}: ${error}`));
      projectIds.push(...result.projectIds);
    }

    const summary = `${totals.created} créé(s), ${totals.updated} mis à jour, ${totals.skipped} ignoré(s)`;
    if (totals.errors.length) throw new Error(`${summary}. ${totals.errors.slice(0, 5).join(" | ")}`);
    await request<{ ok: true }>({
      operation: "finalize",
      sectionId,
      projectIds,
      canRemoveStale: replaceSection
    });
    message(sectionId, `${summary}. Import terminé.`);
    router.refresh();
  }

  async function submitFile(sectionId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get("file");
    if (!(file instanceof File) || !file.size) return message(sectionId, "Sélectionne un fichier JSON.");
    setPendingSection(sectionId);
    try {
      await importRows(sectionId, readRows(JSON.parse(await file.text())), true);
    } catch (error) {
      message(sectionId, `ERREUR : ${error instanceof Error ? error.message : "Import impossible"}`);
    } finally {
      setPendingSection(null);
    }
  }

  async function submitPastedJson(sectionId: string) {
    setPendingSection(sectionId);
    try {
      await importRows(sectionId, readRows(JSON.parse(jsonValues[sectionId] || "")), false);
      setJsonValues((current) => ({ ...current, [sectionId]: "" }));
    } catch (error) {
      message(sectionId, `ERREUR : ${error instanceof Error ? error.message : "JSON impossible à importer"}`);
    } finally {
      setPendingSection(null);
    }
  }

  async function assignExisting(sectionId: string, projectId: string) {
    if (!projectId) return message(sectionId, "Choisis une fiche projet.");
    setPendingSection(sectionId);
    try {
      await request({ operation: "assign", companyId: company.id, sectionId, projectId });
      message(sectionId, "Fiche projet ajoutée à la catégorie.");
      setSearches((current) => ({ ...current, [sectionId]: "" }));
      router.refresh();
    } catch (error) {
      message(sectionId, `ERREUR : ${error instanceof Error ? error.message : "Rattachement impossible"}`);
    } finally {
      setPendingSection(null);
    }
  }

  async function createProject(sectionId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPendingSection(sectionId);
    try {
      await request({
        operation: "create",
        companyId: company.id,
        sectionId,
        project: {
          title: String(formData.get("title") || ""),
          type: String(formData.get("type") || "series"),
          status: String(formData.get("status") || "development"),
          imdbId: String(formData.get("imdb_id") || "")
        }
      });
      message(sectionId, "Nouvelle fiche créée et ajoutée à la catégorie.");
      event.currentTarget.reset();
      router.refresh();
    } catch (error) {
      message(sectionId, `ERREUR : ${error instanceof Error ? error.message : "Création impossible"}`);
    } finally {
      setPendingSection(null);
    }
  }

  async function removeProject(sectionId: string, projectId: string) {
    setPendingSection(sectionId);
    try {
      await request({ operation: "remove", companyId: company.id, sectionId, projectId });
      message(sectionId, "Projet retiré de cette catégorie. Sa fiche détaillée est conservée.");
      router.refresh();
    } catch (error) {
      message(sectionId, `ERREUR : ${error instanceof Error ? error.message : "Retrait impossible"}`);
    } finally {
      setPendingSection(null);
    }
  }

  async function enrichSection(sectionId: string, projectIds: string[]) {
    if (!projectIds.length) return message(sectionId, "Aucun projet à enrichir.");
    setPendingSection(sectionId);
    const totals: EnrichResult = { enriched: 0, alreadyLinked: 0, notFound: 0, errors: [] };
    try {
      const batches = Array.from({ length: Math.ceil(projectIds.length / 3) }, (_, index) => projectIds.slice(index * 3, index * 3 + 3));
      for (let index = 0; index < batches.length; index += 1) {
        message(sectionId, `TMDB ${index + 1}/${batches.length} · ${Math.min(index * 3, projectIds.length)}/${projectIds.length} traité(s)...`);
        const result = await request<EnrichResult>({ operation: "enrich", sectionId, projectIds: batches[index] });
        totals.enriched += result.enriched;
        totals.alreadyLinked += result.alreadyLinked;
        totals.notFound += result.notFound;
        totals.errors.push(...result.errors);
      }
      message(sectionId, `${totals.enriched} enrichi(s), ${totals.alreadyLinked} déjà lié(s), ${totals.notFound} introuvable(s).`);
      router.refresh();
    } catch (error) {
      message(sectionId, `ERREUR TMDB : ${error instanceof Error ? error.message : "Enrichissement impossible"}`);
    } finally {
      setPendingSection(null);
    }
  }

  return (
    <section>
      <div className="mb-5">
        <h3 className="text-xl font-black">Catégories de projets</h3>
        <p className="mt-1 text-sm text-white/50">Chaque catégorie possède ses propres imports et reste reliée aux fiches détaillées de Productions.</p>
      </div>

      <form action={upsertProductionCompanySection} className="grid gap-3 border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_120px_auto] md:items-end">
        <input type="hidden" name="company_id" value={company.id} />
        <label className="text-sm text-white/65">Nom de la catégorie
          <input name="name" required placeholder="Ex : Projets en développement" className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-white outline-none focus:border-white" />
        </label>
        <label className="text-sm text-white/65">Ordre
          <input name="sort_order" type="number" defaultValue={sections.length * 10} className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-white outline-none focus:border-white" />
        </label>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black text-black hover:bg-[#8EA1AC]"><Plus size={16} /> Créer</button>
      </form>

      <div className="mt-5 space-y-4">
        {sections.map((section) => {
          const sectionProjects = assignments
            .filter((assignment) => assignment.section_id === section.id)
            .map((assignment) => projectMap.get(assignment.project_id))
            .filter((project): project is SectionProject => Boolean(project));
          const assignedIds = new Set(sectionProjects.map((project) => project.id));
          const search = searches[section.id] || "";
          const availableProjects = projects
            .filter((project) => !assignedIds.has(project.id) && (!search || project.title.toLowerCase().includes(search.toLowerCase()) || project.imdb_id?.toLowerCase().includes(search.toLowerCase())))
            .slice(0, 30);
          return (
            <details key={section.id} className="border border-white/10 bg-white/[0.025]">
              <summary className="cursor-pointer list-none px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div><h4 className="font-black">{section.name}</h4><p className="mt-1 text-xs text-white/45">{sectionProjects.length} projet(s) · ordre {section.sort_order}</p></div>
                  <span className="rounded-md bg-white/10 px-3 py-1 text-sm font-black">{sectionProjects.length}</span>
                </div>
              </summary>

              <div className="space-y-4 border-t border-white/10 p-4">
                <form action={upsertProductionCompanySection} className="grid gap-3 md:grid-cols-[1fr_100px_auto_auto] md:items-end">
                  <input type="hidden" name="id" value={section.id} /><input type="hidden" name="company_id" value={company.id} />
                  <label className="text-sm text-white/65">Nom
                    <input name="name" defaultValue={section.name} required className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-white outline-none focus:border-white" />
                  </label>
                  <label className="text-sm text-white/65">Ordre
                    <input name="sort_order" type="number" defaultValue={section.sort_order} className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-white outline-none focus:border-white" />
                  </label>
                  <button className="h-11 rounded-md border border-white/15 px-4 text-sm font-bold hover:bg-white/10">Enregistrer</button>
                  <button formAction={deleteProductionCompanySection} name="id" value={section.id} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-red-300/25 px-4 text-sm font-bold text-red-200 hover:bg-red-500/10"><Trash2 size={15} /> Supprimer</button>
                </form>

                <div className="border border-white/10 bg-black/20 p-4">
                  <div className="space-y-3">
                    <details className="border border-white/10 bg-white/[0.025]" open>
                      <summary className="cursor-pointer list-none px-4 py-3 font-bold">Importer un fichier JSON</summary>
                      <div className="border-t border-white/10 p-4">
                    <form onSubmit={(event) => void submitFile(section.id, event)} className="flex flex-col gap-3 lg:flex-row lg:items-center">
                      <input name="file" type="file" accept=".json,application/json" required className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-bold file:text-black" />
                      <button disabled={pendingSection !== null} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black text-black hover:bg-[#8EA1AC] disabled:opacity-50"><FileJson size={16} /> Importer et synchroniser</button>
                    </form>
                      </div>
                    </details>

                    <details className="border border-white/10 bg-white/[0.025]">
                      <summary className="cursor-pointer list-none px-4 py-3 font-bold">Coller directement un JSON</summary>
                      <div className="border-t border-white/10 p-4">
                      <p className="mb-3 text-xs leading-5 text-white/50">Ouvre ton fichier JSON, copie tout son contenu puis colle-le dans cette zone.</p>
                      <textarea value={jsonValues[section.id] || ""} onChange={(event) => setJsonValues((current) => ({ ...current, [section.id]: event.target.value }))} rows={9} placeholder='Colle ici le JSON complet : {"productions":[...]}' className="w-full resize-y rounded-md border border-white/10 bg-black/35 p-3 font-mono text-xs leading-5 text-white outline-none focus:border-white" />
                      <button type="button" disabled={pendingSection !== null || !jsonValues[section.id]?.trim()} onClick={() => void submitPastedJson(section.id)} className="mt-3 inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-black text-black hover:bg-[#8EA1AC] disabled:opacity-50"><FileJson size={16} /> Importer le JSON collé</button>
                      </div>
                    </details>

                    <details className="border border-white/10 bg-white/[0.025]">
                      <summary className="cursor-pointer list-none px-4 py-3 font-bold">Ajouter une fiche projet existante</summary>
                      <div className="border-t border-white/10 p-4">
                      <input value={search} onChange={(event) => setSearches((current) => ({ ...current, [section.id]: event.target.value }))} placeholder="Rechercher une fiche par titre ou identifiant IMDb" className="w-full rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-white" />
                      <div className="mt-3 max-h-64 divide-y divide-white/10 overflow-y-auto border-y border-white/10">
                        {availableProjects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between gap-3 py-3">
                            <div className="min-w-0"><p className="truncate font-bold">{project.title}</p><p className="text-xs text-white/45">{project.type} · {project.status} · {project.imdb_id || "Sans IMDb"}</p></div>
                            <button type="button" disabled={pendingSection !== null} onClick={() => void assignExisting(section.id, project.id)} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-white/15 px-3 text-sm font-bold hover:bg-white/10"><Link2 size={14} /> Ajouter</button>
                          </div>
                        ))}
                        {!availableProjects.length ? <p className="py-4 text-sm text-white/45">Aucune fiche disponible pour cette recherche.</p> : null}
                      </div>
                      </div>
                    </details>

                    <details className="border border-white/10 bg-white/[0.025]">
                      <summary className="cursor-pointer list-none px-4 py-3 font-bold">Créer un nouveau projet</summary>
                      <div className="border-t border-white/10 p-4">
                    <form onSubmit={(event) => void createProject(section.id, event)} className="grid gap-3 md:grid-cols-2">
                      <input name="title" required placeholder="Titre du projet" className="rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-white md:col-span-2" />
                      <select name="type" defaultValue="series" className="rounded-md border border-white/10 bg-[#101318] px-3 py-2.5 text-sm text-white"><option value="series">Série</option><option value="movie">Film</option><option value="documentary">Documentaire</option><option value="special">Spécial</option></select>
                      <select name="status" defaultValue="development" className="rounded-md border border-white/10 bg-[#101318] px-3 py-2.5 text-sm text-white"><option value="development">En développement</option><option value="pre-production">Pré-production</option><option value="filming">En tournage</option><option value="post-production">Post-production</option><option value="completed">Terminé</option><option value="released">Sorti</option></select>
                      <input name="imdb_id" placeholder="Identifiant IMDb facultatif" className="rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-white" />
                      <button disabled={pendingSection !== null} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black text-black hover:bg-[#8EA1AC] disabled:opacity-50"><Plus size={16} /> Créer et ajouter</button>
                    </form>
                      </div>
                    </details>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="font-black">Enrichissement TMDB</p><p className="mt-1 text-xs text-white/45">Complète uniquement les champs vides des fiches rattachées.</p></div>
                  <button type="button" disabled={pendingSection !== null || !sectionProjects.length} onClick={() => void enrichSection(section.id, sectionProjects.map((project) => project.id))} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-[#8EA1AC]/60 bg-white px-4 text-sm font-black text-black hover:bg-[#8EA1AC] disabled:opacity-50"><Sparkles size={16} /> Enrichir avec TMDB</button>
                </div>

                {messages[section.id] ? <p className="border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">{messages[section.id]}</p> : null}

                <div className="max-h-[460px] divide-y divide-white/10 overflow-y-auto border-y border-white/10">
                  {sectionProjects.map((project) => (
                    <div key={project.id} className="flex items-center gap-3 py-3">
                      {project.poster_url || project.image_url ? <img src={project.poster_url || project.image_url || ""} alt="" className="h-14 w-10 object-cover" /> : <span className="h-14 w-10 bg-white/10" />}
                      <div className="min-w-0 flex-1"><Link href={`/productions/${project.id}`} className="truncate font-bold hover:underline">{project.title}</Link><p className="mt-1 text-xs text-white/45">{project.status} · {project.type} · {project.imdb_id || "Sans IMDb"}</p></div>
                      <Link href="/admin/productions" className="shrink-0 rounded-md border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">Modifier la fiche</Link>
                      <button type="button" disabled={pendingSection !== null} onClick={() => void removeProject(section.id, project.id)} title="Retirer de cette catégorie" className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-red-300/20 text-red-200 hover:bg-red-500/10"><Trash2 size={15} /></button>
                    </div>
                  ))}
                  {!sectionProjects.length ? <p className="py-5 text-sm text-white/45">Aucun projet dans cette catégorie.</p> : null}
                </div>
              </div>
            </details>
          );
        })}
        {!sections.length ? <p className="border border-dashed border-white/15 p-6 text-center text-sm text-white/45">Crée une première catégorie pour commencer.</p> : null}
      </div>
    </section>
  );
}
