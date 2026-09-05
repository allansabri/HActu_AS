import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

async function countTable(supabase: Awaited<ReturnType<typeof createClient>>, table: string) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  return error ? null : count || 0;
}

export default async function AdminAnalyticsPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const [visits, pageViews, reads, clicks, searches] = await Promise.all([
    countTable(supabase, "analytics_visits"),
    countTable(supabase, "analytics_page_views"),
    countTable(supabase, "article_reads"),
    countTable(supabase, "newsletter_clicks"),
    countTable(supabase, "internal_searches")
  ]);
  const hasData = [visits, pageViews, reads, clicks, searches].some((value) => value && value > 0);

  return (
    <AdminShell title="Analytics" subtitle="Statistiques réelles uniquement. Aucun chiffre factice." userLabel={user.email?.split("@")[0] || "Admin"}>
      {!hasData ? (
        <EmptyState title="Pas encore de données" text="Aucune visite, page vue, lecture, recherche interne ou clic newsletter réel n'a encore été enregistré." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Visites", visits],
            ["Pages vues", pageViews],
            ["Articles lus", reads],
            ["Clics newsletter", clicks],
            ["Recherches internes", searches]
          ].map(([label, value]) => (
            <AdminPanel key={label as string} className="p-5">
              <p className="text-xs uppercase text-white/45">{label}</p>
              <strong className="mt-3 block text-3xl">{value ?? "Pas encore de données"}</strong>
            </AdminPanel>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
