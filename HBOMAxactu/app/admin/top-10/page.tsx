import { importTop10 } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { TextAreaField } from "@/components/admin/Field";
import { Top10Builder } from "@/components/admin/Top10Builder";
import { todayIso } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { getTop10 } from "@/lib/queries";

export default async function AdminTop10Page() {
  await requireAdmin();
  const items = await getTop10();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="text-4xl font-black">Mise à jour du Top 10</h1>
      <p className="mt-3 max-w-3xl text-white/62">
        Recherche les titres via TMDB, ajoute-les dans l'ordre du classement, puis sauvegarde les 10 lignes avec leurs vignettes.
      </p>
      <div className="mt-6">
        <Top10Builder date={todayIso()} initialItems={items} />
      </div>
      <details className="mt-6 rounded-lg border border-white/10 bg-white/[0.035] p-5">
        <summary className="cursor-pointer text-sm font-bold text-white/70">Import texte brut de secours</summary>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <form action={importTop10} className="space-y-4 rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Date
              <input name="date" type="date" defaultValue={todayIso()} className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan" />
            </label>
            <label className="block text-sm text-white/70">
              Type
              <select name="type" defaultValue="series" className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan">
                <option value="series">Séries</option>
                <option value="movie">Films</option>
              </select>
            </label>
          </div>
          <TextAreaField
            label="Texte brut"
            name="raw"
            rows={12}
            required
            placeholder={"1. The Last of Us\n2. The Penguin\n3. House of the Dragon\n..."}
          />
          <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">
            Importer les 10 lignes
          </button>
        </form>
        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <h2 className="mb-4 text-xl font-black">Classement du jour</h2>
          <div className="grid gap-2">
            {items.map((item) => (
              <p key={item.id} className="rounded-md bg-black/25 px-3 py-2 text-sm">
                #{item.rank} {item.type === "movie" ? "Film" : "Série"} - {item.title}
              </p>
            ))}
            {!items.length ? <p className="text-white/60">Aucun classement pour aujourd'hui.</p> : null}
          </div>
        </section>
      </div>
      </details>
    </main>
  );
}
