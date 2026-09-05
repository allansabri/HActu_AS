import { deleteProduction } from "@/app/admin/actions";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { ProductionFileImport } from "@/components/admin/ProductionFileImport";
import { ProductionForm } from "@/components/admin/ProductionForm";
import { ProductionSync } from "@/components/admin/ProductionSync";
import { ProductionTmdbEnrich } from "@/components/admin/ProductionTmdbEnrich";
import { TmdbImport } from "@/components/admin/TmdbImport";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { ProductionProject } from "@/lib/types";

export default async function AdminProductionsPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const [projectsResult, projectCountResult] = await Promise.all([
    supabase.from("production_projects").select("*").order("updated_at", { ascending: false }).limit(30),
    supabase.from("production_projects").select("id", { count: "exact", head: true })
  ]);
  const projects = (projectsResult.data || []) as ProductionProject[];
  const totalProjects = projectCountResult.count || projects.length;

  return (
    <AdminShell
      title="Fiches productions"
      subtitle="Crée et complète les fiches détaillées. Les rattachements aux sociétés sont gérés dans Entreprises."
      userLabel={user.email?.split("@")[0] || "Admin"}
    >
      <ProductionSync />
      <ProductionFileImport />
      <TmdbImport />
      <p className="mb-6 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white/70">
        Les pages professionnelles nécessitent l’exécution de <strong>supabase-production-pro.sql</strong> dans Supabase.
      </p>
      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <div>
          <h3 className="mb-3 text-xl font-black">Ajouter une fiche</h3>
          <ProductionForm />
        </div>
        <AdminPanel>
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="font-black">Fiches existantes</h3>
            <p className="mt-1 text-xs text-white/45">Les 30 fiches modifiées le plus récemment sur {totalProjects} sont affichées.</p>
          </div>
          <div className="space-y-4 p-5">
            {projects.map((project) => (
              <details key={project.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {project.poster_url || project.image_url ? (
                        <img src={project.poster_url || project.image_url || ""} alt="" className="h-16 w-11 object-cover" />
                      ) : (
                        <span className="h-16 w-11 bg-white/10" />
                      )}
                      <div>
                        <h2 className="text-xl font-black">{project.title}</h2>
                        <p className="text-sm text-white/55">
                          {project.production_label || project.type} · {project.status} · {project.release_date_france || project.release_date_estimated ? formatDate(project.release_date_france || project.release_date_estimated) : project.release_year || "Date à confirmer"}
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Saison {project.season_number || "-"} · {project.episode_count || 0} épisode(s) · {project.platform || "Max"}
                        </p>
                      </div>
                    </div>
                    <form action={deleteProduction}>
                      <input type="hidden" name="id" value={project.id} />
                      <button className="rounded-md border border-red-300/30 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10">Supprimer</button>
                    </form>
                  </div>
                </summary>
                <div className="mt-5">
                  <ProductionTmdbEnrich project={project} />
                  <ProductionForm project={project} />
                </div>
              </details>
            ))}
            {!projects.length ? <EmptyState title="Aucune fiche" text="Importe un film ou une série depuis TMDB, ou crée une fiche manuelle." /> : null}
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
