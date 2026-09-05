import { createCollection, deleteCollection } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { AdminCollection } from "@/lib/types";

export default async function AdminCollectionsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("collections").select("*").order("created_at", { ascending: false });
  const collections = (data || []) as AdminCollection[];

  return (
    <AdminShell title="Collections" subtitle="Créer des univers éditoriaux puis y rattacher films, séries et articles." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminNotice searchParams={searchParams} />
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Nouvelle collection</h3>
          <form action={createCollection} className="space-y-4">
            <InputField label="Nom" name="title" required placeholder="Univers DC, Harry Potter, HBO Originals..." />
            <InputField label="Slug" name="slug" placeholder="univers-dc" />
            <TextAreaField label="Description" name="description" rows={4} />
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">Créer la collection</button>
          </form>
        </AdminPanel>
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Collections existantes</h3>
          {error ? <EmptyState title="Fonctionnalité à configurer" text="La table collections n'existe pas encore. Applique supabase-admin-upgrade.sql." /> : null}
          {!error && collections.length ? (
            <div className="grid gap-3">
              {collections.map((collection) => (
                <article key={collection.id} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-bold">{collection.title}</p>
                  <p className="text-sm text-white/50">/{collection.slug}</p>
                  <p className="mt-2 text-sm text-white/65">{collection.description || "Aucune description."}</p>
                  <p className="mt-3 text-xs text-white/45">Ajout de films/séries/articles : fonctionnalité à venir.</p>
                  <form action={deleteCollection} className="mt-3">
                    <input type="hidden" name="id" value={collection.id} />
                    <button className="rounded-md border border-red-300/30 px-3 py-2 text-xs text-red-200 hover:bg-red-500/10">Supprimer</button>
                  </form>
                </article>
              ))}
            </div>
          ) : null}
          {!error && !collections.length ? <EmptyState title="Aucune collection" text="Crée une première collection, par exemple HBO Originals ou Nouveautés." /> : null}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
