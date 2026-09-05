import { createAdminMedia, deleteAdminMedia } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPanel, AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { InputField } from "@/components/admin/Field";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { AdminMediaItem } from "@/lib/types";

export default async function AdminMediaPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
  const media = (data || []) as AdminMediaItem[];

  return (
    <AdminShell title="Médiathèque" subtitle="Images, posters, bannières, vidéos, logos et thumbnails." userLabel={user.email?.split("@")[0] || "Admin"}>
      <AdminNotice searchParams={searchParams} />
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Ajouter un média</h3>
          <form action={createAdminMedia} className="space-y-4">
            <InputField label="Titre" name="title" required />
            <InputField label="URL du fichier" name="url" required placeholder="Image, vidéo ou asset déjà hébergé" />
            <label className="block text-sm text-white/70">
              Type de média
              <select name="media_type" className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan">
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
                <option value="poster">Poster</option>
                <option value="banner">Bannière</option>
                <option value="logo">Logo</option>
                <option value="thumbnail">Thumbnail</option>
              </select>
            </label>
            <InputField label="Dossier" name="folder" placeholder="posters, trailers, logos..." />
            <InputField label="Tags, séparés par virgules" name="tags" />
            <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">Enregistrer</button>
            <p className="text-xs text-white/45">Upload direct fichier : fonctionnalité à venir. Cette version gère les médias par URL.</p>
          </form>
        </AdminPanel>
        <AdminPanel className="p-5">
          <h3 className="mb-4 font-black">Bibliothèque</h3>
          {error ? <EmptyState title="Fonctionnalité à configurer" text="La table media_library n'existe pas encore. Applique supabase-admin-upgrade.sql." /> : null}
          {!error && media.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {media.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
                  {item.media_type === "video" ? (
                    <div className="flex aspect-video items-center justify-center bg-black/40 text-sm text-white/55">Vidéo</div>
                  ) : (
                    <img src={item.url} alt="" className="aspect-video w-full object-cover" />
                  )}
                  <div className="p-3">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-white/45">{item.media_type} • {item.folder || "Sans dossier"}</p>
                    <form action={deleteAdminMedia} className="mt-3">
                      <input type="hidden" name="id" value={item.id} />
                      <button className="rounded-md border border-red-300/30 px-3 py-2 text-xs text-red-200 hover:bg-red-500/10">Supprimer</button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
          {!error && !media.length ? <EmptyState title="Aucun média" text="Ajoute une image, une vidéo, un poster ou une bannière." /> : null}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
