"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { enrichProductionFromTmdb, getTmdbPosterChoices, searchTmdbProductions } from "@/app/admin/actions";
import { ProductionProject } from "@/lib/types";
import { TmdbPoster, TmdbSearchResult } from "@/lib/tmdb";

export function ProductionTmdbEnrich({ project }: { project: ProductionProject }) {
  const router = useRouter();
  const [query, setQuery] = useState(project.title);
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [posters, setPosters] = useState<Record<string, TmdbPoster[]>>({});
  const [selectedPosters, setSelectedPosters] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resultKey(result: TmdbSearchResult) {
    return `${result.type}-${result.tmdbId}`;
  }

  function runSearch() {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      try {
        const data = await searchTmdbProductions(query);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Recherche TMDB impossible");
      }
    });
  }

  function loadPosters(result: TmdbSearchResult) {
    startTransition(async () => {
      setError(null);
      try {
        const mediaType = result.type === "movie" ? "movie" : "tv";
        const data = await getTmdbPosterChoices(mediaType, result.tmdbId);
        const key = resultKey(result);
        setPosters((current) => ({ ...current, [key]: data }));
        setSelectedPosters((current) => ({ ...current, [key]: data[0]?.url || result.posterUrl || "" }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger les affiches");
      }
    });
  }

  function runEnrich(result: TmdbSearchResult) {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      try {
        const key = resultKey(result);
        const data = await enrichProductionFromTmdb(
          project.id,
          result.type === "movie" ? "movie" : "tv",
          result.tmdbId,
          selectedPosters[key] || result.posterUrl
        );
        setMessage(data.message);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Enrichissement impossible");
      }
    });
  }

  return (
    <section className="mb-5 rounded-lg border border-max-cyan/20 bg-max-blue/10 p-4">
      <h3 className="font-black">Compléter cette fiche avec TMDB</h3>
      <p className="mt-1 text-sm leading-6 text-white/62">
        Recherche le titre puis complète uniquement les champs vides. Les infos déjà remplies dans la fiche ne sont pas remplacées.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              runSearch();
            }
          }}
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/35 px-3 py-2.5 text-white outline-none focus:border-max-cyan"
        />
        <button
          type="button"
          onClick={runSearch}
          disabled={isPending || query.trim().length < 2}
          className="rounded-md border border-white/15 px-3 py-2 text-sm font-bold hover:border-max-cyan disabled:opacity-50"
        >
          Rechercher
        </button>
      </div>

      {message ? <p className="mt-3 rounded-md border border-max-cyan/20 bg-black/20 p-3 text-sm text-max-cyan">{message}</p> : null}
      {error ? <p className="mt-3 rounded-md border border-red-300/25 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}

      {results.length ? (
        <div className="mt-4 grid gap-3">
          {results.map((result) => {
            const key = resultKey(result);
            const posterChoices = posters[key] || [];
            const selectedPoster = selectedPosters[key] || result.posterUrl;

            return (
              <article key={key} className="rounded-md border border-white/10 bg-black/25 p-3">
                <div className="flex gap-3">
                  {selectedPoster ? (
                    <img src={selectedPoster} alt="" className="h-24 w-16 shrink-0 rounded object-cover" />
                  ) : (
                    <div className="h-24 w-16 shrink-0 rounded bg-white/10" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-widest text-max-cyan">
                      {result.type === "movie" ? "Film" : "Série"} {result.releaseDate ? `- ${result.releaseDate.slice(0, 4)}` : ""}
                    </p>
                    <h4 className="mt-1 font-bold">{result.title}</h4>
                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-white/58">
                      {result.overview || "Pas de synopsis FR disponible."}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadPosters(result)}
                      disabled={isPending}
                      className="rounded-md border border-white/15 px-3 py-2 text-sm font-bold text-white/75 hover:border-white/40 disabled:opacity-50"
                    >
                      Affiches
                    </button>
                    <button
                      type="button"
                      onClick={() => runEnrich(result)}
                      disabled={isPending}
                      className="rounded-md border border-max-cyan px-3 py-2 text-sm font-bold text-max-cyan hover:bg-max-cyan hover:text-black disabled:opacity-50"
                    >
                      Compléter
                    </button>
                  </div>
                </div>
                {posterChoices.length ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {posterChoices.map((poster) => (
                      <button
                        key={poster.url}
                        type="button"
                        onClick={() => setSelectedPosters((current) => ({ ...current, [key]: poster.url }))}
                        className={`shrink-0 overflow-hidden rounded-md border ${selectedPoster === poster.url ? "border-max-cyan" : "border-white/10"}`}
                        title={poster.language ? `Langue : ${poster.language}` : "Sans langue"}
                      >
                        <img src={poster.url} alt="" className="h-24 w-16 object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
