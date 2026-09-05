import { createRedirection, deleteRedirection } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { InputField } from "@/components/admin/Field";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { AdminRedirection } from "@/lib/types";

export default async function AdminRedirectionsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("redirections").select("*").order("created_at", { ascending: false });
  const redirections = (data || []) as AdminRedirection[];

  return (
    <AdminShell title="Redirections" subtitle="Créer des redirections 301/302 actives ou inactives." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminNotice searchParams={searchParams} />
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Ajouter</h3>
          <form action={createRedirection} className="space-y-4">
            <InputField label="Ancienne URL" name="from_url" required placeholder="/ancienne-page" />
            <InputField label="Nouvelle URL" name="to_url" required placeholder="/nouvelle-page" />
            <label className="block text-sm text-white/70">
              Type
              <select name="redirect_type" className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan">
                <option value="301">301 permanent</option>
                <option value="302">302 temporaire</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70"><input name="active" type="checkbox" defaultChecked /> Active</label>
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">Enregistrer</button>
          </form>
        </AdminPanel>
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Redirections</h3>
          {error ? <EmptyState title="Fonctionnalité à configurer" text="La table redirections n'existe pas encore. Applique supabase-admin-upgrade.sql." /> : null}
          {!error && redirections.length ? redirections.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 p-3 text-sm">
              <span>{item.from_url} → {item.to_url} • {item.redirect_type} • {item.active ? "active" : "inactive"}</span>
              <form action={deleteRedirection}>
                <input type="hidden" name="id" value={item.id} />
                <button className="rounded-md border border-red-300/30 px-3 py-2 text-xs text-red-200 hover:bg-red-500/10">Supprimer</button>
              </form>
            </div>
          )) : null}
          {!error && !redirections.length ? <EmptyState title="Aucune redirection" text="Ajoute une redirection 301 ou 302." /> : null}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
