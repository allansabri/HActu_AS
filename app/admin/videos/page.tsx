import Link from "next/link";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";

export default async function AdminVideosPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").not("youtube_video_url", "is", null).order("created_at", { ascending: false });
  const videos = (data || []) as Article[];

  return (
    <AdminShell title="Vidéos" subtitle="Bandes-annonces et vidéos liées aux articles." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminPanel className="p-5">
        {videos.length ? (
          <div className="grid gap-3">
            {videos.map((article) => (
              <Link key={article.id} href={`/admin/articles/${article.id}`} className="rounded-md border border-white/10 p-4 hover:border-max-cyan">
                <p className="font-bold">{article.title}</p>
                <p className="text-sm text-white/55">{article.youtube_video_url}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucune vidéo" text="Ajoute une URL YouTube dans un article ou une fiche production." />
        )}
      </AdminPanel>
    </AdminShell>
  );
}
