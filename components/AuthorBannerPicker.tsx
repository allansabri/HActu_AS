"use client";

import { useState, useTransition } from "react";
import {
  Camera,
  Search,
  Check,
  X,
  Loader2,
  Sparkles,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { saveAuthorProfileAction } from "@/app/admin/actions";

type TmdbSearchResult = {
  tmdbId: number;
  title: string;
  originalTitle: string;
  type: "movie" | "series";
  releaseDate: string | null;
  posterUrl: string | null;
  overview: string | null;
};

type TmdbBackdrop = {
  url: string;
  voteAverage: number;
  width: number;
  height: number;
};

interface AuthorBannerPickerProps {
  authorId: string;
  authorSlug: string;
  currentBannerUrl?: string | null;
  currentBannerTitle?: string | null;
}

export function AuthorBannerPicker({
  authorId,
  authorSlug,
  currentBannerUrl,
  currentBannerTitle,
}: AuthorBannerPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TmdbSearchResult[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<TmdbSearchResult | null>(
    null
  );
  const [isLoadingBackdrops, setIsLoadingBackdrops] = useState(false);
  const [backdrops, setBackdrops] = useState<TmdbBackdrop[]>([]);
  const [selectedBackdropUrl, setSelectedBackdropUrl] = useState<string | null>(
    null
  );
  const [savedBannerUrl, setSavedBannerUrl] = useState<string | null>(
    currentBannerUrl || null
  );
  const [savedBannerTitle, setSavedBannerTitle] = useState<string | null>(
    currentBannerTitle || null
  );
  const [isPending, startTransition] = useTransition();

  // Suggestions rapides de séries/films phares HBO / Warner Bros / DC
  const quickPicks = [
    { title: "Dune: Prophecy", type: "series" },
    { title: "The Last of Us", type: "series" },
    { title: "House of the Dragon", type: "series" },
    { title: "The Penguin", type: "series" },
    { title: "Lanterns", type: "series" },
    { title: "Superman", type: "movie" },
    { title: "The White Lotus", type: "series" },
    { title: "Succession", type: "series" },
    { title: "Euphoria", type: "series" },
    { title: "Game of Thrones", type: "series" },
  ];

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    setSelectedTitle(null);
    setBackdrops([]);

    try {
      const res = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(queryText.trim())}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTitle = async (title: TmdbSearchResult) => {
    setSelectedTitle(title);
    setIsLoadingBackdrops(true);
    setSelectedBackdropUrl(null);

    const mediaType = title.type === "series" ? "tv" : "movie";
    try {
      const res = await fetch(
        `/api/tmdb/search?id=${title.tmdbId}&type=${mediaType}`
      );
      const data = await res.json();
      setBackdrops(data.backdrops || []);
    } catch (err) {
      console.error("Backdrop error", err);
    } finally {
      setIsLoadingBackdrops(false);
    }
  };

  const handleApplyBanner = () => {
    if (!selectedBackdropUrl || !selectedTitle) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("author_id", authorId);
      formData.set("author_slug", authorSlug);
      formData.set("banner_url", selectedBackdropUrl);
      formData.set("banner_title", selectedTitle.title);

      const res = await saveAuthorProfileAction(formData);
      if (res?.success) {
        setSavedBannerUrl(selectedBackdropUrl);
        setSavedBannerTitle(selectedTitle.title);
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      {/* Bouton sur la bannière pour changer le fond d'écran */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white border border-white/20 shadow-xl transition-all duration-200 active:scale-95 group"
        title="Personnaliser la bannière TMDB"
      >
        <Camera className="h-4 w-4 text-max-cyan group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Changer la bannière</span>
        <span className="sm:hidden">Bannière</span>
      </button>

      {/* Modal interactif de choix de fond d'écran TMDB */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#12161f] border border-white/15 shadow-2xl overflow-hidden">
            {/* Header du modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0e121a]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#778b9d] to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-max-cyan" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Choisir une bannière TMDB
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Séries &amp; films Warner Bros., HBO et DC sans texte ni logo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corps du modal */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Barre de recherche */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Rechercher une série ou un film
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch(searchQuery);
                        }
                      }}
                      placeholder="Ex: The Last of Us, House of the Dragon, Dune..."
                      className="w-full rounded-xl bg-white/[0.06] border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-max-cyan focus:ring-1 focus:ring-max-cyan transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSearch(searchQuery)}
                    disabled={isSearching}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2c3746] to-[#1e252e] hover:from-[#3a485a] hover:to-[#28323e] border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Rechercher"
                    )}
                  </button>
                </div>

                {/* Suggestions rapides */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Suggestions :
                  </span>
                  {quickPicks.map((pick) => (
                    <button
                      key={pick.title}
                      type="button"
                      onClick={() => {
                        setSearchQuery(pick.title);
                        handleSearch(pick.title);
                      }}
                      className="text-[11px] rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 px-2.5 py-0.5 text-neutral-300 hover:text-white transition-colors"
                    >
                      {pick.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Étape 1 : Résultats de la recherche de titre */}
              {searchResults.length > 0 && !selectedTitle && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Sélectionnez l&apos;œuvre :
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {searchResults.map((item) => (
                      <button
                        key={`${item.type}-${item.tmdbId}`}
                        type="button"
                        onClick={() => handleSelectTitle(item)}
                        className="group flex flex-col text-left rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-max-cyan hover:bg-white/[0.08] transition-all p-2"
                      >
                        <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-900 relative mb-2">
                          {item.posterUrl ? (
                            <img
                              src={item.posterUrl}
                              alt={item.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-neutral-500">
                              Pas d&apos;affiche
                            </div>
                          )}
                          <span className="absolute top-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-neutral-300 uppercase">
                            {item.type === "series" ? "Série" : "Film"}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-max-cyan transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400">
                          {item.releaseDate
                            ? item.releaseDate.split("-")[0]
                            : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape 2 : Fonds d'écran textless proposés pour le titre sélectionné */}
              {selectedTitle && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-max-cyan">
                        Fonds d&apos;écran sans texte pour « {selectedTitle.title}{" "}
                        » :
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Cliquez sur une image 16:9 pour l&apos;appliquer en bannière
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTitle(null);
                        setBackdrops([]);
                      }}
                      className="text-xs text-neutral-400 hover:text-white underline"
                    >
                      Changer d&apos;œuvre
                    </button>
                  </div>

                  {isLoadingBackdrops ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
                      <Loader2 className="h-6 w-6 animate-spin text-max-cyan" />
                      <span className="text-xs">
                        Récupération des fonds d&apos;écran HD sans texte...
                      </span>
                    </div>
                  ) : backdrops.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {backdrops.map((backdrop, idx) => {
                        const isSelected = selectedBackdropUrl === backdrop.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedBackdropUrl(backdrop.url)}
                            className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                              isSelected
                                ? "border-max-cyan ring-2 ring-max-cyan/40 scale-[1.02]"
                                : "border-white/10 hover:border-white/30"
                            }`}
                          >
                            <img
                              src={backdrop.url}
                              alt={`Fond ${idx + 1}`}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-cyan-950/40 flex items-center justify-center">
                                <div className="h-8 w-8 rounded-full bg-max-cyan text-black flex items-center justify-center shadow-lg">
                                  <Check className="h-5 w-5 stroke-[3]" />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-neutral-400 bg-white/[0.02] rounded-xl border border-white/10">
                      Aucun fond d&apos;écran sans texte trouvé pour ce titre.
                      Essayez un autre film ou série.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pied du modal avec validation */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/10 bg-[#0e121a]">
              <span className="text-xs text-neutral-400">
                {selectedBackdropUrl
                  ? "Image sélectionnée prête à être appliquée"
                  : "Sélectionnez une image"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={!selectedBackdropUrl || isPending}
                  onClick={handleApplyBanner}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-2 text-xs font-bold text-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-500/20"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Appliquer la bannière
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
