import Link from "next/link";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { ProductionProject } from "@/lib/types";

export default async function AdminCalendarPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("production_projects")
    .select("*")
    .in("status", ["upcoming", "En développement", "Pré-production", "En tournage", "Post-production"])
    .order("release_date_estimated", { ascending: true, nullsFirst: false });
  const projects = (data || []) as ProductionProject[];

  return (
    <AdminShell title="Calendrier" subtitle="Sorties France et prochains épisodes issus des fiches Prochainement." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminPanel className="p-5">
        {projects.length ? (
          <div className="grid gap-3">
            {projects.map((project) => (
              <Link key={project.id} href="/admin/productions" className="rounded-md border border-white/10 bg-white/[0.04] p-4 hover:border-max-cyan">
                <p className="font-bold">{project.title}</p>
                <p className="text-sm text-white/55">Sortie France : {formatDate(project.release_date_france || project.release_date_estimated)} • Prochain épisode : {formatDate(project.next_episode_date)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucun contenu prochainement" text="Marque une production en statut Prochainement pour l'ajouter au calendrier." />
        )}
      </AdminPanel>
    </AdminShell>
  );
}
