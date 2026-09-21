"use client";

import { useState } from "react";
import { UpcomingSeriesBannerConfig, UpcomingSeriesCard } from "@/lib/types";
import { fetchSeriesPosterForAdmin, saveUpcomingSeriesBannerAction } from "@/app/admin/actions";
import { defaultUpcomingSeriesCards } from "@/lib/upcoming-banner";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Film,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2
} from "lucide-react";

interface Props {
  initialConfig: UpcomingSeriesBannerConfig;
}

export function UpcomingSeriesBannerManager({ initialConfig }: Props) {
  const [title, setTitle] = useState(initialConfig.title || "À venir en 2026");
  const [cards, setCards] = useState<UpcomingSeriesCard[]>(
    initialConfig.cards && initialConfig.cards.length > 0
      ? initialConfig.cards
      : defaultUpcomingSeriesCards
  );

  // New card form state
  const [seriesQuery, setSeriesQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPosterUrl, setNewPosterUrl] = useState("");
  const [newSeriesId, setNewSeriesId] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle searching / loading poster by ID or query
  const handleFetchPoster = async () => {
    if (!seriesQuery.trim()) return;
    setIsSearching(true);
    setSaveMessage(null);
    try {
      const result = await fetchSeriesPosterForAdmin(seriesQuery);
      if (result) {
        setNewTitle(result.title);
        setNewPosterUrl(result.posterUrl);
        setNewSeriesId(result.seriesId);
      } else {
        setSaveMessage({
          type: "error",
          text: `Aucune série trouvée pour "${seriesQuery}". Entrez manuellement l'affiche et le titre.`
        });
      }
    } catch {
      setSaveMessage({
        type: "error",
        text: "Erreur lors de la recherche TMDB."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPosterUrl.trim()) {
      setSaveMessage({
        type: "error",
        text: "Veuillez renseigner au moins un titre et une URL d'affiche."
      });
      return;
    }

    const newCard: UpcomingSeriesCard = {
      id: `series-${Date.now()}`,
      series_id: newSeriesId || null,
      title: newTitle.trim(),
      badge: "",
      poster_url: newPosterUrl.trim(),
      accent_color: "#00e5ff",
      link_url: `/prochainement/${newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    };

    setCards([...cards, newCard]);
    // Reset form
    setSeriesQuery("");
    setNewTitle("");
    setNewPosterUrl("");
    setNewSeriesId("");
    setSaveMessage(null);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleMoveCard = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    const next = [...cards];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setCards(next);
  };

  const handleResetToDefault = () => {
    if (confirm("Réinitialiser avec les 6 séries de base (Lanterns, War, Paolo, Harry Potter, The Pitt, A Knight of the Seven Kingdoms) ?")) {
      setTitle("À venir en 2027");
      setCards(defaultUpcomingSeriesCards);
      setSaveMessage({ type: "success", text: "Données de base réinitialisées. N'oubliez pas d'enregistrer." });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const formData = new FormData();
      formData.append("banner_title", title.trim() || "À venir en 2027");
      formData.append("cards_json", JSON.stringify(cards));

      await saveUpcomingSeriesBannerAction(formData);
      setSaveMessage({
        type: "success",
        text: "Bandeau enregistré avec succès ! La page d'accueil a été mise à jour."
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setSaveMessage({
        type: "error",
        text: `Erreur lors de l'enregistrement: ${msg}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/10 bg-[#09111b] p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-max-cyan">
            <Sparkles className="h-4 w-4" />
            <span>Section Accueil : Nouvelles séries à venir en 2026/2027</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-white">Gestion du Bandeau &amp; Affiches</h1>
          <p className="mt-1 text-sm text-white/60">
            Configurez le texte en gras à gauche du rectangle ainsi que les affiches de séries et leurs badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser défaut
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-max-cyan px-5 py-2 text-sm font-bold text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            <span>Enregistrer</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`rounded-lg p-4 text-sm font-medium ${
            saveMessage.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* 1. Rectangle Title Configuration */}
      <div className="rounded-xl border border-white/10 bg-[#080f18] p-6">
        <h2 className="text-base font-bold text-white">1. Texte principal à gauche (affiché en gras)</h2>
        <p className="mt-1 text-xs text-white/60">
          Ce texte est centré verticalement tout à gauche dans le grand rectangle sur la page d&apos;accueil.
        </p>
        <div className="mt-4 max-w-xl">
          <label htmlFor="banner-title-input" className="block text-xs font-semibold text-white/80">
            Texte du rectangle
          </label>
          <input
            id="banner-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="À venir en 2027"
            className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-base font-bold text-white placeholder-white/30 focus:border-max-cyan focus:outline-none focus:ring-1 focus:ring-max-cyan"
          />
        </div>
      </div>

      {/* 2. Add New Series Card Form */}
      <div className="rounded-xl border border-white/10 bg-[#080f18] p-6">
        <h2 className="text-base font-bold text-white">2. Ajouter une série (avec ID TMDB ou nom)</h2>
        <p className="mt-1 text-xs text-white/60">
          Entrez l&apos;ID de la série (ex: 95350 pour Lanterns, 250307 pour The Pitt, 224372 pour A Knight of the Seven Kingdoms) pour charger automatiquement son affiche officielle.
        </p>

        {/* Search / ID fetcher */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={seriesQuery}
              onChange={(e) => setSeriesQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleFetchPoster())}
              placeholder="Ex: 95350 ou Lanterns"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 focus:border-max-cyan focus:outline-none focus:ring-1 focus:ring-max-cyan"
            />
          </div>
          <button
            type="button"
            onClick={handleFetchPoster}
            disabled={isSearching || !seriesQuery.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>Charger l&apos;affiche</span>
          </button>
        </div>

        {/* Card details form */}
        <form onSubmit={handleAddCard} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-white/80">Titre de la série</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Lanterns"
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-max-cyan focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-white/80">URL de l&apos;affiche</label>
            <input
              type="text"
              value={newPosterUrl}
              onChange={(e) => setNewPosterUrl(e.target.value)}
              placeholder="/series-a-venir/... ou https://..."
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-max-cyan focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-2">
            {newPosterUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-10 overflow-hidden rounded bg-zinc-900 shadow">
                  <img src={newPosterUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <span className="text-xs text-white/70">Affiche prête</span>
              </div>
            ) : <div />}

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter au carrousel</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Current Cards List with Drag / Re-order */}
      <div className="rounded-xl border border-white/10 bg-[#080f18] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">3. Affiches dans le carrousel ({cards.length})</h2>
            <p className="mt-1 text-xs text-white/60">
              Réorganisez l&apos;ordre d&apos;apparition ou supprimez des affiches.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="group relative flex flex-col rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-lg"
            >
              {/* Poster frame - borderless inside */}
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-md">
                <img
                  src={card.poster_url}
                  alt={card.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Card Meta */}
              <div className="mt-2.5 flex-1">
                <p className="text-xs font-bold text-white line-clamp-1">{card.title}</p>
                {card.series_id && (
                  <p className="text-[10px] text-white/40">ID TMDB: {card.series_id}</p>
                )}
              </div>

              {/* Controls */}
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-white/70">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, "up")}
                    disabled={idx === 0}
                    title="Déplacer vers la gauche"
                    className="rounded p-1 hover:bg-white/10 hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, "down")}
                    disabled={idx === cards.length - 1}
                    title="Déplacer vers la droite"
                    className="rounded p-1 hover:bg-white/10 hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCard(idx)}
                  title="Supprimer cette série"
                  className="rounded p-1 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Preview */}
      <div className="rounded-xl border border-white/10 bg-[#080f18] p-6">
        <h2 className="text-base font-bold text-white mb-2">4. Aperçu du bandeau</h2>
        <div className="overflow-hidden rounded-xl border border-white/15 bg-black">
          <div
            className="relative w-full overflow-hidden bg-[#070c14] bg-cover bg-center py-6 px-6"
            style={{
              backgroundImage: `url('https://i.ibb.co/GfJ3GBvY/Bandes-diagonales-abstraites-bleu-nuit.png')`
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="shrink-0 lg:w-72 flex justify-center">
                <div className="flex flex-col items-center text-center">
                  <span className="text-lg font-semibold text-white/90">À venir</span>
                  <span className="text-4xl font-black text-white leading-none mt-0.5">2026</span>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto py-2 scrollbar-none">
                {cards.map((c, i) => (
                  <div key={i} className="relative flex flex-col w-40 shrink-0 aspect-[2/3] rounded-none overflow-hidden bg-zinc-950 shadow-lg">
                    <div
                      className="w-full h-8 shrink-0 border-b border-white/10"
                      style={{
                        background: "linear-gradient(90deg, #352f34 0%, #404144 50%, #352f34 100%)"
                      }}
                    />
                    <div className="relative flex-1 w-full overflow-hidden">
                      <img src={c.poster_url} alt={c.title} className="h-full w-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
