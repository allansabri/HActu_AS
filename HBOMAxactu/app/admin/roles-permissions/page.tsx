import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

const roles = [
  ["admin", "Accès complet"],
  ["rédacteur", "Créer et modifier ses brouillons"],
  ["éditeur", "Publier et programmer les contenus"],
  ["modérateur", "Modérer les commentaires"],
  ["seo_manager", "Gérer SEO, sitemap et redirections"]
];

export default async function AdminRolesPage() {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("user_roles").select("*");

  return (
    <AdminShell title="Rôles & permissions" subtitle="Gérer les accès autorisés et interdits." userLabel={user.email?.split("@")[0] || "Admin"}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Rôles disponibles</h3>
          <div className="grid gap-3">
            {roles.map(([role, desc]) => (
              <article key={role} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <p className="font-bold">{role}</p>
                <p className="text-sm text-white/55">{desc}</p>
              </article>
            ))}
          </div>
        </AdminPanel>
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Affectations</h3>
          {data?.length ? (
            data.map((item: { id: string; user_id: string; role: string }) => (
              <p key={item.id} className="rounded-md border border-white/10 p-3 text-sm">{item.user_id} • {item.role}</p>
            ))
          ) : (
            <EmptyState title="Pas encore de données" text="Aucun rôle supplémentaire à afficher." />
          )}
          <p className="mt-4 text-xs text-white/45">Modification des rôles depuis l'interface : fonctionnalité à venir.</p>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
