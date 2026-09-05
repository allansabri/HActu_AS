import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").eq("id", params.id).single();
  if (!data) notFound();

  return (
    <AdminShell title="Modifier l'article" subtitle="Contenu, statut, SEO, image et contenu lié." userLabel={user.email?.split("@")[0] || "Admin"}>
      <ArticleForm article={data as Article} />
    </AdminShell>
  );
}
