"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { syncProductionSources } from "@/app/admin/actions";
import { ProductionSyncResult } from "@/lib/production-sync";

export function ProductionSync() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<ProductionSyncResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function runSync() {
    startTransition(async () => {
      setError(null);
      try {
        const data = await syncProductionSources();
        setResults(data);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Synchronisation impossible");
      }
    });
  }

  return (
    <section className="mb-6 rounded-lg border border-max-cyan/25 bg-[linear-gradient(135deg,rgba(142,161,172,.14),rgba(255,255,255,.035))] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-black">Synchronisation productions</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/66">
            Importe et met a jour les fiches via TMDB pour HBO, HBO Max et Warner Bros. Les vrais statuts production
            comme tournage, pre-production ou post-production restent a valider manuellement depuis les sources autorisees.
          </p>
        </div>
        <button
          type="button"
          onClick={runSync}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-max-blue px-4 py-3 text-sm font-black text-black disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Synchronisation..." : "Synchroniser maintenant"}
        </button>
      </div>

      {error ? <p className="mt-4 rounded-md border border-red-300/25 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}

      {results ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {results.map((result) => (
            <div key={result.source} className="rounded-md border border-white/10 bg-black/24 p-4">
              <h3 className="font-black">{result.source}</h3>
              <p className="mt-2 text-sm text-white/62">
                {result.created} ajoutee(s), {result.updated} mise(s) a jour, {result.skipped} ignoree(s)
              </p>
              <p className="mt-1 text-xs text-white/42">{result.found} resultat(s) TMDB analyses</p>
              {result.errors.length ? (
                <details className="mt-3 text-xs text-red-100">
                  <summary className="cursor-pointer font-bold">Erreurs ({result.errors.length})</summary>
                  <ul className="mt-2 space-y-1">
                    {result.errors.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </details>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
