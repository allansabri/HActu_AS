"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getTmdbPosterChoices, importTmdbUpcoming, searchTmdbUpcoming } from "@/app/admin/actions";
import { TmdbPoster, TmdbSearchResult } from "@/lib/tmdb";

export function UpcomingTmdbImport() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [posters, setPosters] = useState<Record<string, TmdbPoster[]>>({});
  const [selectedPosters, setSelectedPosters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function key(result: TmdbSearchResult) {
    return `${result.type}-${result.tmdbId}`;
  }

  function runSearch() {
    startTransition(async () => {
      setError(null);
      try {
        setResults(await searchTmdbUpcoming(query));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur TMDB");
      }
    });
  }

  function loadPosters(result: TmdbSearchResult) {
    startTransition(async () => {
      setError(null);
      try {
        const mediaType = result.type === "movie" ? "movie" : "tv";
        const data = await getTmdbPosterChoices(mediaType, result.tmdbId);
        const resultKey = key(result);
        setPosters((current) => ({ ...current, [resultKey]: data }));
        setSelectedPosters((current) => ({ ...current, [resultKey]: data[0]?.url || result.posterUrl || "" }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger les affiches");
      }
    });
  }

  function runImport(result: TmdbSearchResult) {
    startTransition(async () => {
      setError(null);
      try {
        const resultKey = key(result);
        await importTmdbUpcoming(result.type === "movie" ? "movie" : "tv", result.tmdbId, selectedPosters[resultKey] || result.posterUrl);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Import impossible");
      }
    });
  }

  return (
    <section className="mb-6 rounded-lg border border-max-cyan/25 bg-max-blue/10 p-5">
      <h2 className="text-xl font-black">Importer un titre prochainement depuis TMDB</h2>
      <p className="mt-2 text-sm leading-6 text-white/62">
        L’import remplit le titre, le synopsis, les genres, les images et la date TMDB. Tu peux ensuite corriger la date France et ajouter les bandes-annonces.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              runSearch();
            }
          }}
          placeholder="Ex : Harry Potter, It, The Last of Us..."
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
        />
        <button
          type="button"
          onClick={runSearch}
          disabled={isPending || query.trim().length < 2}
          className="rounded-md bg-max-blue px-4 py-3 font-bold text-black disabled:opacity-50"
        >
          Rechercher
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
      {results.length ? (
        <div className="mt-5 grid gap-3">
          {results.map((result) => {
            const resultKey = key(result);
            const posterChoices = posters[resultKey] || [];
            const selectedPoster = selectedPosters[resultKey] || result.posterUrl;

            return (
              <article key={resultKey} className="rounded-lg border border-white/10 bg-black/25 p-3">
                <div className="flex gap-4">
                  {selectedPoster ? (
                    <img src={selectedPoster} alt="" className="h-28 w-20 shrink-0 rounded-md object-cover" />
                  ) : (
                    <div className="h-28 w-20 shrink-0 rounded-md bg-white/10" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-widest text-max-cyan">
                      {result.type === "movie" ? "Film" : "Série"} {result.releaseDate ? `- ${result.releaseDate.slice(0, 4)}` : ""}
                    </p>
                    <h3 className="mt-1 font-bold">{result.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/58">{result.overview || "Pas de synopsis FR disponible."}</p>
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
                      onClick={() => runImport(result)}
                      disabled={isPending}
                      className="rounded-md border border-max-cyan px-3 py-2 text-sm font-bold text-max-cyan hover:bg-max-cyan hover:text-black disabled:opacity-50"
                    >
                      Importer
                    </button>
                  </div>
                </div>
                {posterChoices.length ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {posterChoices.map((poster) => (
                      <button
                        key={poster.url}
                        type="button"
                        onClick={() => setSelectedPosters((current) => ({ ...current, [resultKey]: poster.url }))}
                        className={`shrink-0 overflow-hidden rounded-md border ${selectedPoster === poster.url ? "border-max-cyan" : "border-white/10"}`}
                      >
                        <img src={poster.url} alt="" className="h-28 w-20 object-cover" />
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
