import { AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";

export default async function AdminCommentsPage() {
  const user = await requireAdmin();
  return (
    <AdminShell title="Commentaires" subtitle="Modération, signalements, réponses, bannissement et anti-spam." userLabel={user.email?.split("@")[0] || "Admin"}>
      <EmptyState title="Pas encore de données" text="Aucune table commentaires n'est configurée. Les boutons de modération apparaîtront quand les commentaires réels existeront." />
    </AdminShell>
  );
}
