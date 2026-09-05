import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Article, ProductionProject } from "@/lib/types";
import { titleHref } from "@/lib/links";

export default async function AdminSitemapPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const [{ data: articlesData }, { data: projectsData }] = await Promise.all([
    supabase.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false }),
    supabase.from("production_projects").select("*").order("updated_at", { ascending: false })
  ]);
  const urls = [
    "/",
    "/actualites",
    "/top-10-france",
    "/prochainement",
    "/bandes-annonces",
    ...((articlesData || []) as Article[]).map((article) => `/actualites/${article.slug}`),
    ...((projectsData || []) as ProductionProject[]).map((project) => titleHref(project.type, project.title))
  ];

  return (
    <AdminShell title="Sitemap" subtitle="URLs générées automatiquement depuis les contenus publiés." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminPanel className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">URLs</h3>
          <span className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/65">Régénération automatique au build</span>
        </div>
        {urls.length ? (
          <div className="grid gap-2">
            {urls.map((url) => <code key={url} className="rounded-md bg-black/30 px-3 py-2 text-sm text-white/70">{url}</code>)}
          </div>
        ) : (
          <EmptyState title="Aucune URL" text="Publie du contenu pour générer le sitemap." />
        )}
      </AdminPanel>
    </AdminShell>
  );
}
