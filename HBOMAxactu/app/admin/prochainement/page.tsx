import Link from "next/link";
import { deleteUpcomingRelease } from "@/app/admin/actions";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { UpcomingForm } from "@/components/admin/UpcomingForm";
import { UpcomingTmdbImport } from "@/components/admin/UpcomingTmdbImport";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase-server";
import { UpcomingRelease } from "@/lib/types";
import { demoUpcomingReleases } from "@/lib/upcoming";

export default async function AdminUpcomingPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("upcoming_releases")
    .select("*, upcoming_trailers(*)")
    .order("release_date", { ascending: true, nullsFirst: false });

  const releases = error ? demoUpcomingReleases : ((data || []) as UpcomingRelease[]);

  return (
    <AdminShell
      title="Prochainement"
      subtitle="Gère les sorties à venir, leurs affiches TMDB et leurs bandes-annonces. Cette section est séparée du suivi des productions."
      userLabel={user.email?.split("@")[0] || "Admin"}
    >
      <UpcomingTmdbImport />

      {error ? (
        <p className="mb-6 rounded-lg border border-amber-300/25 bg-amber-400/10 p-4 text-sm text-amber-100">
          Les tables Prochainement ne sont pas encore disponibles dans Supabase. La page publique affiche une démo, mais l’admin sauvegardera après exécution de <strong>supabase-upcoming.sql</strong>.
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[480px_1fr]">
        <div>
          <h3 className="mb-3 text-xl font-black">Ajouter un titre</h3>
          <UpcomingForm />
        </div>

        <AdminPanel>
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="font-black">Titres prochainement</h3>
          </div>
          <div className="space-y-4 p-5">
            {releases.map((release) => (
              <details key={release.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {release.poster_url ? (
                        <img src={release.poster_url} alt="" className="h-16 w-11 rounded object-cover" />
                      ) : (
                        <span className="h-16 w-11 rounded bg-white/10" />
                      )}
                      <div>
                        <h2 className="text-xl font-black">{release.title}</h2>
                        <p className="text-sm text-white/55">
                          {release.type} - {formatDate(release.release_date)} - {release.platform || "Max"}
                        </p>
                        <Link href={`/prochainement/${release.slug}`} className="mt-1 inline-block text-xs font-bold text-max-cyan hover:text-white">
                          Voir la fiche publique
                        </Link>
                      </div>
                    </div>
                    {!release.id.startsWith("demo-") ? (
                      <form action={deleteUpcomingRelease}>
                        <input type="hidden" name="id" value={release.id} />
                        <button className="rounded-md border border-red-300/30 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10">
                          Supprimer
                        </button>
                      </form>
                    ) : null}
                  </div>
                </summary>
                <div className="mt-5">
                  <UpcomingForm release={release} />
                </div>
              </details>
            ))}
            {!releases.length ? <EmptyState title="Aucun titre" text="Importe un titre depuis TMDB ou crée une fiche manuelle." /> : null}
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
