"use client";

import { useRef, useState, useTransition } from "react";
import { importProductionFile } from "@/app/admin/actions";

type ImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export function ProductionFileImport() {
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runImport(formData: FormData) {
    startTransition(async () => {
      setError(null);
      setResult(null);
      try {
        const data = await importProductionFile(formData);
        setResult(data);
        formRef.current?.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Import impossible");
      }
    });
  }

  return (
    <section className="mb-6 rounded-lg border border-white/10 bg-[#101318]/85 p-5">
      <h2 className="text-xl font-black">Importer un fichier ProductionList</h2>
      <p className="mt-2 text-sm leading-6 text-white/62">
        Envoie un fichier CSV ou JSON extrait de productionlist.com. L’import accepte des colonnes souples comme title, status, season, synopsis, casting, company, locations, source_url ou productionlist_url.
      </p>

      <form ref={formRef} action={runImport} className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          name="file"
          type="file"
          accept=".csv,.json,text/csv,application/json"
          required
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-bold file:text-black"
        />
        <button
          disabled={isPending}
          className="rounded-md bg-max-blue px-5 py-3 text-sm font-black text-black hover:bg-max-cyan disabled:opacity-55"
        >
          {isPending ? "Import..." : "Importer"}
        </button>
      </form>

      {result ? (
        <div className="mt-4 rounded-md border border-max-cyan/25 bg-max-blue/10 p-4 text-sm text-white/75">
          <p className="font-bold text-white">
            Import terminé : {result.created} créée(s), {result.updated} mise(s) à jour, {result.skipped} ignorée(s).
          </p>
          {result.errors.length ? (
            <div className="mt-3">
              <p className="font-bold text-amber-100">Erreurs :</p>
              <ul className="mt-2 space-y-1 text-amber-100/85">
                {result.errors.slice(0, 8).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {result.errors.length > 8 ? <p className="mt-2 text-amber-100/70">+ {result.errors.length - 8} autre(s) erreur(s)</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="mt-3 rounded-md border border-red-300/25 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
    </section>
  );
}
