"use client";

import { useTransition, useState } from "react";
import { saveTop10SectionConfigAction } from "@/app/admin/actions";
import { Top10Config } from "@/lib/top10-config";

export function Top10SectionConfigForm({ config }: { config: Top10Config }) {
  const [isPending, startTransition] = useTransition();
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [sectionTitle, setSectionTitle] = useState(config.section_title);
  const [seriesSubtitle, setSeriesSubtitle] = useState(config.series_subtitle);
  const [moviesSubtitle, setMoviesSubtitle] = useState(config.movies_subtitle);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavedMessage(null);
    const formData = new FormData();
    formData.append("section_title", sectionTitle);
    formData.append("series_subtitle", seriesSubtitle);
    formData.append("movies_subtitle", moviesSubtitle);

    startTransition(async () => {
      try {
        await saveTop10SectionConfigAction(formData);
        setSavedMessage("Titres et sous-titres de la section mis à jour avec succès !");
      } catch (err) {
        setSavedMessage(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
      }
    });
  }

  return (
    <section className="rounded-lg border border-white/15 bg-white/[0.04] p-5 sm:p-6 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Titres et sous-titres de la section</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Personnalisez ou videz un champ pour supprimer le titre ou sous-titre de la page d'accueil.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
              Titre principal de la section
            </label>
            {sectionTitle && (
              <button
                type="button"
                onClick={() => setSectionTitle("")}
                className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
              >
                Supprimer le titre
              </button>
            )}
          </div>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            placeholder="Ex : Les plus populaires sur HBO Max (laisser vide pour masquer)"
            className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-max-cyan"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                Sous-titre Séries
              </label>
              {seriesSubtitle && (
                <button
                  type="button"
                  onClick={() => setSeriesSubtitle("")}
                  className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>
            <input
              type="text"
              value={seriesSubtitle}
              onChange={(e) => setSeriesSubtitle(e.target.value)}
              placeholder="Ex : Top 10 des séries le 24 septembre 2026"
              className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-max-cyan"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                Sous-titre Films
              </label>
              {moviesSubtitle && (
                <button
                  type="button"
                  onClick={() => setMoviesSubtitle("")}
                  className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>
            <input
              type="text"
              value={moviesSubtitle}
              onChange={(e) => setMoviesSubtitle(e.target.value)}
              placeholder="Ex : Top 10 des films le 24 septembre 2026"
              className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-max-cyan"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedMessage && (
            <p className="text-xs font-semibold text-emerald-400">{savedMessage}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="ml-auto rounded-md bg-[#8197a9] hover:bg-[#a5abb2] px-5 py-2.5 text-sm font-bold text-white shadow transition-all disabled:opacity-50"
          >
            {isPending ? "Enregistrement..." : "Enregistrer les textes"}
          </button>
        </div>
      </form>
    </section>
  );
}
