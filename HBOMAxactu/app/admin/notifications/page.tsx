import { AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";

export default async function AdminNotificationsPage() {
  const user = await requireAdmin();
  return (
    <AdminShell title="Notifications" subtitle="Alertes nouvelles sorties, push notifications et segmentation." userLabel={user.email?.split("@")[0] || "Admin"}>
      <EmptyState title="Fonctionnalité à venir" text="Aucun service push n'est branché pour l'instant. Cette page évite les boutons décoratifs et affichera les campagnes réelles une fois configurée." />
    </AdminShell>
  );
}
