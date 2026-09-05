import { prepareNewsDraft } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { InputField, TextAreaField } from "@/components/admin/Field";
import { requireAdmin } from "@/lib/auth";

export default async function NewsGeneratorPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="text-4xl font-black">Générateur de news</h1>
      <p className="mt-3 max-w-3xl text-white/62">
        Colle une source américaine. Le bouton prépare un brouillon structuré dans l'éditeur. Ce module ne fait pas d'appel IA externe pour éviter d'ajouter une clé API.
      </p>
      <form action={prepareNewsDraft} className="mt-6 space-y-5 rounded-lg border border-white/10 bg-white/[0.045] p-5">
        <InputField label="Titre de travail" name="title" placeholder="Titre du brouillon" />
        <TextAreaField label="Article source" name="source" rows={18} required />
        <button className="rounded-md bg-max-blue px-5 py-3 font-bold text-black">
          Préparer un brouillon en français
        </button>
      </form>
    </main>
  );
}
