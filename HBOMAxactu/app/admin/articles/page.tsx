import Link from "next/link";
import { deleteArticle } from "@/app/admin/actions";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";

export default async function AdminArticlesPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  const articles = (data || []) as Article[];

  return (
    <AdminShell title="Articles" subtitle="Créer, modifier, supprimer, publier, programmer et optimiser le SEO." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminPanel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <h3 className="font-black">Liste des articles</h3>
          <Link href="/admin/articles/new" className="rounded-md bg-max-blue px-4 py-2 text-sm font-black text-black">Créer</Link>
        </div>
        {articles.length ? (
          <div className="overflow-x-auto p-5">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-white/45">
                <tr>
                  <th className="py-3">Titre</th>
                  <th>Statut</th>
                  <th>Catégorie</th>
                  <th>Auteur</th>
                  <th>Date</th>
                  <th>SEO</th>
                  <th>Image</th>
                  <th>Contenu lié</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="max-w-[260px] py-3">
                      <p className="truncate font-semibold">{article.title}</p>
                      <p className="truncate text-xs text-white/45">/{article.slug}</p>
                    </td>
                    <td>{article.status}</td>
                    <td>{article.category}</td>
                    <td className="text-white/55">{article.author_id ? "Auteur assigné" : "Non assigné"}</td>
                    <td className="text-white/55">{formatDate(article.published_at || article.created_at)}</td>
                    <td>{article.seo_title || article.seo_description || article.excerpt ? "OK" : "À compléter"}</td>
                    <td>{article.image_url ? "Oui" : "Non"}</td>
                    <td className="max-w-[160px] truncate text-white/55">{article.related_content || "-"}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link href={`/admin/articles/${article.id}`} className="rounded-md border border-white/10 px-3 py-2 hover:border-max-cyan">Modifier</Link>
                        <form action={deleteArticle}>
                          <input type="hidden" name="id" value={article.id} />
                          <button className="rounded-md border border-red-300/30 px-3 py-2 text-red-200 hover:bg-red-500/10">Supprimer</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5"><EmptyState title="Aucun article" text="Crée un article, une news, une analyse, un guide ou une critique." /></div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
