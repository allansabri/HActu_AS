import Link from "next/link";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";

export default async function AdminNewsPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").ilike("category", "%news%").order("created_at", { ascending: false });
  const news = (data || []) as Article[];

  return (
    <AdminShell title="News" subtitle="Gestion dédiée des news et actualités courtes." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminPanel className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">News</h3>
          <Link href="/admin/articles/new?category=News" className="rounded-md bg-max-blue px-4 py-2 text-sm font-black text-black">Créer une news</Link>
        </div>
        {news.length ? (
          <div className="grid gap-3">
            {news.map((article) => (
              <Link key={article.id} href={`/admin/articles/${article.id}`} className="rounded-md border border-white/10 bg-white/[0.04] p-4 hover:border-max-cyan">
                <p className="font-bold">{article.title}</p>
                <p className="mt-1 text-sm text-white/50">{article.status} • {article.slug}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucune news" text="Crée une news depuis cette page ou classe un article dans la catégorie News." />
        )}
      </AdminPanel>
    </AdminShell>
  );
}
