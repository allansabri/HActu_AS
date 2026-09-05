"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { saveTop10Ranking, searchTmdbTop10 } from "@/app/admin/actions";
import { TmdbSearchResult } from "@/lib/tmdb";
import { ContentType, Top10Item } from "@/lib/types";

type Top10Type = Extract<ContentType, "movie" | "series">;

type RankingItem = {
  title: string;
  image_url: string | null;
};

function labelForType(type: Top10Type) {
  return type === "series" ? "Séries" : "Films";
}

export function Top10Builder({
  date,
  initialItems
}: {
  date: string;
  initialItems: Top10Item[];
}) {
  const router = useRouter();
  const [type, setType] = useState<Top10Type>("series");
  const [rankingDate, setRankingDate] = useState(date);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [rankings, setRankings] = useState<Record<Top10Type, RankingItem[]>>({
    series: initialItems
      .filter((item) => item.type === "series")
      .sort((a, b) => a.rank - b.rank)
      .map((item) => ({ title: item.title, image_url: item.image_url })),
    movie: initialItems
      .filter((item) => item.type === "movie")
      .sort((a, b) => a.rank - b.rank)
      .map((item) => ({ title: item.title, image_url: item.image_url }))
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentRanking = rankings[type];
  const canSave = currentRanking.length === 10;

  const resultType = useMemo(() => (type === "movie" ? "movie" : "series"), [type]);

  function runSearch() {
    startTransition(async () => {
      setMessage(null);
      const data = await searchTmdbTop10(query, resultType);
      setResults(data);
    });
  }

  function addItem(result: TmdbSearchResult) {
    setRankings((current) => {
      const list = current[type];
      if (list.length >= 10 || list.some((item) => item.title === result.title)) return current;
      return {
        ...current,
        [type]: [...list, { title: result.title, image_url: result.posterUrl }]
      };
    });
  }

  function removeItem(index: number) {
    setRankings((current) => ({
      ...current,
      [type]: current[type].filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setRankings((current) => {
      const list = [...current[type]];
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= list.length) return current;
      [list[index], list[nextIndex]] = [list[nextIndex], list[index]];
      return { ...current, [type]: list };
    });
  }

  function save() {
    startTransition(async () => {
      setMessage(null);
      try {
        await saveTop10Ranking(rankingDate, type, currentRanking);
        setMessage(`${labelForType(type)} sauvegardé : ${currentRanking.length}/10.`);
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Sauvegarde impossible");
      }
    });
  }

  return (
    <section className="rounded-lg border border-max-cyan/25 bg-max-blue/10 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/70">
          Date
          <input
            type="date"
            value={rankingDate}
            onChange={(event) => setRankingDate(event.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
          />
        </label>
        <label className="block text-sm text-white/70">
          Classement
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value as Top10Type);
              setResults([]);
              setQuery("");
              setMessage(null);
            }}
            className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
          >
            <option value="series">Top 10 Séries</option>
            <option value="movie">Top 10 Films</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-xl font-black">Recherche TMDB</h2>
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
              placeholder={`Rechercher dans les ${labelForType(type).toLowerCase()}`}
              className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
            />
            <button
              type="button"
              onClick={runSearch}
              disabled={isPending || query.trim().length < 2}
              className="rounded-md bg-max-blue px-4 py-3 font-bold text-black disabled:opacity-50"
            >
              Chercher
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {results.map((result) => (
              <article key={`${result.type}-${result.tmdbId}`} className="flex items-center gap-3 rounded-md bg-black/25 p-2">
                {result.posterUrl ? (
                  <img src={result.posterUrl} alt="" className="h-14 w-10 rounded object-cover" />
                ) : (
                  <div className="h-14 w-10 rounded bg-white/10" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{result.title}</p>
                  <p className="text-xs text-white/45">{result.releaseDate?.slice(0, 4) || "Date inconnue"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(result)}
                  className="rounded-md border border-max-cyan px-3 py-2 text-sm font-bold text-max-cyan hover:bg-max-cyan hover:text-black"
                >
                  Ajouter
                </button>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{labelForType(type)} ({currentRanking.length}/10)</h2>
            <button
              type="button"
              onClick={save}
              disabled={isPending || !canSave}
              className="rounded-md bg-max-blue px-4 py-3 text-sm font-bold text-black disabled:opacity-50"
            >
              Sauvegarder
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {currentRanking.map((item, index) => (
              <article key={`${item.title}-${index}`} className="grid grid-cols-[38px_42px_1fr_auto] items-center gap-3 rounded-md bg-black/25 p-2">
                <span className="text-xl font-black text-white/35">#{index + 1}</span>
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="h-14 w-10 rounded object-cover" />
                ) : (
                  <div className="h-14 w-10 rounded bg-white/10" />
                )}
                <p className="min-w-0 truncate font-semibold">{item.title}</p>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveItem(index, -1)} className="rounded border border-white/10 px-2 py-1 text-xs">↑</button>
                  <button type="button" onClick={() => moveItem(index, 1)} className="rounded border border-white/10 px-2 py-1 text-xs">↓</button>
                  <button type="button" onClick={() => removeItem(index)} className="rounded border border-red-300/30 px-2 py-1 text-xs text-red-200">×</button>
                </div>
              </article>
            ))}
            {!currentRanking.length ? <p className="text-sm text-white/60">Ajoute les titres TMDB dans l'ordre du classement.</p> : null}
          </div>
          {message ? <p className="mt-3 text-sm text-white/70">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}

