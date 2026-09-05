import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

export default async function AdminUsersPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <AdminShell title="Utilisateurs" subtitle="Administrateurs, rédacteurs, éditeurs, modérateurs et activité." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminPanel className="p-5">
        {data?.length ? (
          data.map((profile: { id: string; email: string | null; display_name: string | null }) => (
            <p key={profile.id} className="rounded-md border border-white/10 p-3 text-sm">{profile.display_name || profile.email || profile.id}</p>
          ))
        ) : (
          <EmptyState title="Pas encore de données" text="Aucun profil utilisateur visible." />
        )}
      </AdminPanel>
    </AdminShell>
  );
}
