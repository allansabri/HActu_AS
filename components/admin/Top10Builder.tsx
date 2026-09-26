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
  days_in_top?: number;
  previous_rank?: number | null;
  rank_diff?: number | null;
  is_new?: boolean;
  days_in_top_1?: number;
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
      .map((item) => ({
        title: item.title,
        image_url: item.image_url,
        days_in_top: item.days_in_top ?? 1,
        previous_rank: item.previous_rank ?? item.rank,
        rank_diff: item.rank_diff ?? 0,
        is_new: item.is_new ?? false,
        days_in_top_1: item.days_in_top_1 ?? (item.rank === 1 ? (item.days_in_top ?? 1) : undefined),
      })),
    movie: initialItems
      .filter((item) => item.type === "movie")
      .sort((a, b) => a.rank - b.rank)
      .map((item) => ({
        title: item.title,
        image_url: item.image_url,
        days_in_top: item.days_in_top ?? 1,
        previous_rank: item.previous_rank ?? item.rank,
        rank_diff: item.rank_diff ?? 0,
        is_new: item.is_new ?? false,
        days_in_top_1: item.days_in_top_1 ?? (item.rank === 1 ? (item.days_in_top ?? 1) : undefined),
      }))
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentRanking = rankings[type];
  const canSave = currentRanking.length >= 1;

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
      const newIndex = list.length;
      const newItem: RankingItem = {
        title: result.title,
        image_url: result.posterUrl,
        days_in_top: 1,
        previous_rank: null,
        rank_diff: null,
        is_new: true,
      };
      return {
        ...current,
        [type]: [...list, newItem]
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

      // Recalculer rank_diff pour chaque élément déplacé s'il a un previous_rank
      const updatedList = list.map((item, idx) => {
        const newRank = idx + 1;
        if (item.previous_rank != null) {
          const diff = item.previous_rank - newRank; // e.g. was 1, now 2 -> 1 - 2 = -1 (rouge)
          return {
            ...item,
            rank_diff: diff,
            is_new: false,
          };
        }
        return item;
      });

      return { ...current, [type]: updatedList };
    });
  }

  function updateDaysInTop(index: number, value: number) {
    setRankings((current) => {
      const list = [...current[type]];
      if (list[index]) {
        list[index] = { ...list[index], days_in_top: Math.max(1, value) };
      }
      return { ...current, [type]: list };
    });
  }

  function updateDaysInTop1(index: number, value: number) {
    setRankings((current) => {
      const list = [...current[type]];
      if (list[index]) {
        list[index] = { ...list[index], days_in_top_1: Math.max(0, value) };
      }
      return { ...current, [type]: list };
    });
  }

  function save() {
    startTransition(async () => {
      setMessage(null);
      try {
        await saveTop10Ranking(rankingDate, type, currentRanking);
        setMessage(`${labelForType(type)} sauvegardé avec succès : ${currentRanking.length} titre(s).`);
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

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-xl font-black">Recherche TMDB (Titre ou ID)</h2>
          <p className="mt-1 text-xs text-white/60">
            Recherchez par nom ou collez directement l'ID numérique TMDB (ex : 94605, 1399, 108978).
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
              placeholder="Titre ou ID TMDB direct..."
              className="flex-1 rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
            />
            <button
              type="button"
              onClick={runSearch}
              disabled={isPending || query.trim().length < 1}
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
          <p className="mt-1 text-xs text-white/60">
            Déplacez avec ↑/↓ pour voir l'évolution automatique (+1 vert, -1 rouge, =). Modifiez les jours dans le top directement.
          </p>
          <div className="mt-4 grid gap-2">
            {currentRanking.map((item, index) => (
              <article key={`${item.title}-${index}`} className="flex items-center gap-3 rounded-md bg-black/30 p-2.5 border border-white/5">
                <span className="text-xl font-black text-white/35 w-7 text-center">#{index + 1}</span>
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="h-13 w-9 rounded object-cover shrink-0" />
                ) : (
                  <div className="h-13 w-9 rounded bg-white/10 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-sm text-white">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap text-xs">
                    {/* Badge d'évolution (+1, -1, =, Nouveau) */}
                    {item.is_new ? (
                      <span className="font-bold text-max-cyan text-[10px] uppercase bg-max-cyan/15 px-1.5 py-0.5 rounded">
                        Nouveau
                      </span>
                    ) : item.rank_diff !== undefined && item.rank_diff !== null ? (
                      item.rank_diff < 0 ? (
                        <span className="font-extrabold text-red-400 flex items-center gap-0.5">
                          ▼ {item.rank_diff}
                        </span>
                      ) : item.rank_diff > 0 ? (
                        <span className="font-extrabold text-emerald-400 flex items-center gap-0.5">
                          ▲ +{item.rank_diff}
                        </span>
                      ) : (
                        <span className="font-bold text-white/40">=</span>
                      )
                    ) : null}

                    {/* Jours dans le top modifiables */}
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <input
                        type="number"
                        min="1"
                        value={item.days_in_top ?? 1}
                        onChange={(e) => updateDaysInTop(index, Number(e.target.value))}
                        title="Nombre de jours dans le top 10"
                        className="w-12 rounded bg-black/60 border border-emerald-500/30 px-1 py-0.5 text-center text-emerald-300 font-bold text-xs"
                      />
                      <span className="text-[11px]">J dans le top</span>
                    </div>

                    {/* Si descend du Top 1 : option mention spécifique */}
                    {index + 1 > 1 && (item.days_in_top_1 ?? 0) > 0 ? (
                      <div className="flex items-center gap-1 text-emerald-400/80 text-[11px]">
                        <span>(dont</span>
                        <input
                          type="number"
                          min="0"
                          value={item.days_in_top_1 ?? 0}
                          onChange={(e) => updateDaysInTop1(index, Number(e.target.value))}
                          className="w-10 rounded bg-black/60 border border-emerald-500/30 px-1 py-0.5 text-center text-emerald-300 font-bold text-xs"
                        />
                        <span>j dans le top 1)</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => moveItem(index, -1)} className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10">↑</button>
                  <button type="button" onClick={() => moveItem(index, 1)} className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10">↓</button>
                  <button type="button" onClick={() => removeItem(index)} className="rounded border border-red-300/30 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20">×</button>
                </div>
              </article>
            ))}
            {!currentRanking.length ? <p className="text-sm text-white/60">Ajoute les titres TMDB dans l'ordre du classement.</p> : null}
          </div>
          {message ? <p className="mt-3 text-sm text-emerald-400 font-medium">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}
