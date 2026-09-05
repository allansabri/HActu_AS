import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewArticlePage({
  searchParams
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const user = await requireAdmin();

  return (
    <AdminShell title="Nouvel article" subtitle="Article, news, rumeur, analyse, guide, top, critique ou dossier." userLabel={user.email?.split("@")[0] || "Admin"}>
      <ArticleForm defaults={searchParams} />
    </AdminShell>
  );
}
