import Link from "next/link";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Article, ProductionProject, Top10Item } from "@/lib/types";

async function tableCount(supabase: Awaited<ReturnType<typeof createClient>>, table: string) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  return error ? null : count || 0;
}

function metricLabel(value: number | null) {
  if (value === null) return "Pas encore de données";
  return value.toString();
}

export default async function AdminPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const [{ data: articlesData }, { data: projectsData }, { data: top10Data }, visits, pageViews, reads, newsletterClicks, internalSearches] = await Promise.all([
    supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(6),
    supabase.from("production_projects").select("*").order("release_date_estimated", { ascending: true, nullsFirst: false }).limit(6),
    supabase.from("top_10_france").select("*").order("rank", { ascending: true }).limit(5),
    tableCount(supabase, "analytics_visits"),
    tableCount(supabase, "analytics_page_views"),
    tableCount(supabase, "article_reads"),
    tableCount(supabase, "newsletter_clicks"),
    tableCount(supabase, "internal_searches")
  ]);

  const articles = (articlesData || []) as Article[];
  const projects = (projectsData || []) as ProductionProject[];
  const top10 = (top10Data || []) as Top10Item[];
  const userLabel = user.email?.split("@")[0] || "Admin";
  const published = articles.filter((article) => article.status === "published").length;
  const drafts = articles.filter((article) => article.status === "draft").length;
  const scheduled = articles.filter((article) => article.status === "scheduled").length;
  const upcoming = projects.filter((project) => project.status === "upcoming" || project.status === "En développement").length;

  return (
    <AdminShell title="Tableau de bord" subtitle={`Bienvenue de retour, ${userLabel}. Données réelles uniquement.`} userLabel={userLabel}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Visites", metricLabel(visits)],
          ["Pages vues", metricLabel(pageViews)],
          ["Articles lus", metricLabel(reads)],
          ["Clics newsletter", metricLabel(newsletterClicks)],
          ["Recherches internes", metricLabel(internalSearches)]
        ].map(([label, value]) => (
          <AdminPanel key={label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{label}</p>
            <strong className="mt-4 block text-2xl font-black">{value}</strong>
          </AdminPanel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <AdminPanel>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 className="text-lg font-black">Gestion des contenus</h3>
              <Link href="/admin/articles" className="text-sm text-max-cyan">Ouvrir</Link>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="rounded-md bg-white/[0.04] p-4"><p className="text-white/50">Publiés</p><strong className="text-2xl">{published}</strong></div>
              <div className="rounded-md bg-white/[0.04] p-4"><p className="text-white/50">Brouillons</p><strong className="text-2xl">{drafts}</strong></div>
              <div className="rounded-md bg-white/[0.04] p-4"><p className="text-white/50">Programmés</p><strong className="text-2xl">{scheduled}</strong></div>
            </div>
            <div className="overflow-x-auto px-5 pb-5">
              {articles.length ? (
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs uppercase text-white/45">
                    <tr><th className="py-3">Titre</th><th>Catégorie</th><th>Statut</th><th>Date</th><th></th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {articles.map((article) => (
                      <tr key={article.id}>
                        <td className="py-3 font-semibold">{article.title}</td>
                        <td>{article.category}</td>
                        <td>{article.status}</td>
                        <td className="text-white/55">{formatDate(article.published_at || article.created_at)}</td>
                        <td><Link href={`/admin/articles/${article.id}`} className="text-max-cyan">Modifier</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState title="Aucun article" text="Crée un premier article pour alimenter le back-office." />
              )}
            </div>
          </AdminPanel>

          <div className="grid gap-5 lg:grid-cols-2">
            <AdminPanel className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-black">Fiches productions</h3>
                <Link href="/admin/productions" className="text-sm text-max-cyan">Gérer</Link>
              </div>
              <p className="mt-3 text-sm text-white/55">{projects.length} fiche(s), {upcoming} marquée(s) prochainement.</p>
              <div className="mt-4 space-y-3">
                {projects.slice(0, 4).map((project) => (
                  <Link key={project.id} href="/admin/productions" className="flex items-center gap-3 rounded-md bg-white/[0.04] p-3 hover:bg-white/[0.07]">
                    {project.image_url ? <img src={project.image_url} alt="" className="h-12 w-9 rounded object-cover" /> : <span className="h-12 w-9 rounded bg-white/10" />}
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{project.title}</span>
                    <span className="text-xs text-white/45">{project.status}</span>
                  </Link>
                ))}
                {!projects.length ? <EmptyState title="Aucune production" text="Importe une fiche via TMDB ou crée-la manuellement." /> : null}
              </div>
            </AdminPanel>

            <AdminPanel className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-black">Top 10 & carrousels</h3>
                <Link href="/admin/top-10" className="text-sm text-max-cyan">Gérer</Link>
              </div>
              <div className="mt-4 space-y-3">
                {top10.map((item) => (
                  <Link key={item.id} href="/admin/top-10" className="flex items-center gap-3 rounded-md bg-white/[0.04] p-3 hover:bg-white/[0.07]">
                    <strong className="w-6">{item.rank}</strong>
                    {item.image_url ? <img src={item.image_url} alt="" className="h-12 w-9 rounded object-cover" /> : null}
                    <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                  </Link>
                ))}
                {!top10.length ? <EmptyState title="Pas encore de Top 10" text="Ajoute un classement pour afficher les contenus populaires." /> : null}
              </div>
            </AdminPanel>
          </div>
        </div>

        <aside className="space-y-5">
          <AdminPanel className="p-5">
            <h3 className="font-black">Actions rapides</h3>
            <div className="mt-4 grid gap-2">
              <Link href="/admin/articles/new" className="rounded-md border border-white/10 px-3 py-3 text-sm hover:border-max-cyan">Nouvel article</Link>
              <Link href="/admin/productions" className="rounded-md border border-white/10 px-3 py-3 text-sm hover:border-max-cyan">Importer depuis TMDB</Link>
              <Link href="/admin/entreprises" className="rounded-md border border-white/10 px-3 py-3 text-sm hover:border-max-cyan">Gérer les entreprises</Link>
              <Link href="/admin/mediatheque" className="rounded-md border border-white/10 px-3 py-3 text-sm hover:border-max-cyan">Ajouter un média</Link>
              <Link href="/admin/newsletter" className="rounded-md border border-white/10 px-3 py-3 text-sm hover:border-max-cyan">Créer une campagne</Link>
            </div>
          </AdminPanel>
          <AdminPanel className="p-5">
            <h3 className="font-black">Commentaires récents</h3>
            <EmptyState title="Pas encore de données" text="La modération s'activera dès que la table commentaires existera." />
          </AdminPanel>
        </aside>
      </div>
    </AdminShell>
  );
}
