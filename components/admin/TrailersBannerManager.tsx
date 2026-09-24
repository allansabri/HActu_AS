"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  TrailersBannerConfig,
  TrailerItem,
  defaultTrailersBannerConfig,
  detectVideoSource,
  VideoSourceInfo,
} from "@/lib/trailers-banner";
import { saveTrailersBannerAction } from "@/app/admin/actions";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Play,
  Film,
  Tv,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";

function VideoFormatBadge({ input }: { input?: string }) {
  const source = detectVideoSource(input);
  if (!source) {
    return (
      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
        Non configuré
      </span>
    );
  }

  if (source.type === "youtube") {
    return (
      <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/30">
        YouTube
      </span>
    );
  }

  if (source.type === "hls") {
    return (
      <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">
        Flux HLS (M3U8 / M3U)
      </span>
    );
  }

  return (
    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
      Vidéo directe (MP4 / WebM)
    </span>
  );
}

function AdminVideoModal({
  source,
  onClose,
}: {
  source: VideoSourceInfo;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (source.type !== "hls" || !videoRef.current) return;
    const video = videoRef.current;
    let hlsInstance: { destroy: () => void } | null = null;

    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hlsInstance = hls;
        hls.loadSource(source.raw);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source.raw;
        video.play().catch(() => {});
      }
    });

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [source]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl aspect-video overflow-hidden rounded-xl bg-black shadow-2xl border border-white/20 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer border border-white/20"
        >
          <X className="h-4 w-4" />
        </button>

        {source.type === "youtube" && source.youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${source.youtubeId}?autoplay=1&rel=0`}
            title="Aperçu vidéo"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {source.type === "hls" && (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain bg-black"
          />
        )}

        {source.type === "direct" && (
          <video
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain bg-black"
          >
            <source src={source.raw} />
          </video>
        )}
      </div>
    </div>
  );
}

export function TrailersBannerManager({
  initialConfig,
}: {
  initialConfig: TrailersBannerConfig;
}) {
  const [config, setConfig] = useState<TrailersBannerConfig>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [previewVideo, setPreviewVideo] = useState<VideoSourceInfo | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdate = <K extends keyof TrailersBannerConfig>(
    key: K,
    value: TrailersBannerConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleHeroVideoChange = (val: string) => {
    const detected = detectVideoSource(val);
    setConfig((prev) => ({
      ...prev,
      hero_video_url: val,
      hero_youtube_id: detected?.youtubeId || val,
    }));
  };

  const handleUpdateTrailer = (
    index: number,
    field: keyof TrailerItem,
    val: string
  ) => {
    setConfig((prev) => {
      const nextTrailers = [...prev.trailers];
      if (field === "videoUrl") {
        const detected = detectVideoSource(val);
        nextTrailers[index] = {
          ...nextTrailers[index],
          videoUrl: val,
          youtubeId: detected?.youtubeId || val,
        };
      } else {
        nextTrailers[index] = {
          ...nextTrailers[index],
          [field]: val,
        };
      }
      return { ...prev, trailers: nextTrailers };
    });
  };

  const handleAddTrailer = () => {
    const newTrailer: TrailerItem = {
      id: `trailer-${Date.now()}`,
      title: "Nouveau titre",
      subtitle: "Saison 1 - Bande-annonce officielle (VF)",
      videoUrl: "",
      youtubeId: "",
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      category: "Série",
    };
    setConfig((prev) => ({ ...prev, trailers: [...prev.trailers, newTrailer] }));
  };

  const handleRemoveTrailer = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      trailers: prev.trailers.filter((_, i) => i !== index),
    }));
  };

  const handleMoveTrailer = (index: number, direction: "up" | "down") => {
    setConfig((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.trailers.length) return prev;
      const nextTrailers = [...prev.trailers];
      const temp = nextTrailers[index];
      nextTrailers[index] = nextTrailers[targetIndex];
      nextTrailers[targetIndex] = temp;
      return { ...prev, trailers: nextTrailers };
    });
  };

  const handleReset = () => {
    if (confirm("Réinitialiser tous les paramètres aux valeurs d'origine ?")) {
      setConfig(defaultTrailersBannerConfig);
      setStatusMessage({
        type: "success",
        text: "Valeurs réinitialisées par défaut. Cliquez sur Enregistrer pour valider.",
      });
    }
  };

  const handleSave = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("config_json", JSON.stringify(config));
        const res = await saveTrailersBannerAction(formData);
        if (res?.success) {
          setStatusMessage({
            type: "success",
            text: "Configuration enregistrée avec succès !",
          });
        } else {
          setStatusMessage({
            type: "error",
            text: "Erreur lors de l'enregistrement.",
          });
        }
      } catch (err: unknown) {
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Erreur inattendue.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Barre d'action supérieure */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-bold text-white">
            Section Bandes-Annonces &amp; Promotion
          </h2>
          <p className="text-xs text-white/60">
            Personnalisez le visuel principal, le contenu mis en avant (Harry Potter)
            ainsi que les cartes de bandes-annonces avec support MP4, M3U/M3U8 et YouTube.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-max-cyan px-5 py-2 text-xs font-bold text-black transition hover:bg-white active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isPending ? "Enregistrement..." : "Enregistrer"}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-lg border p-4 text-xs font-medium ${
            statusMessage.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 1. Configuration Générale & Image de Fond */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-max-cyan">
          <Sparkles className="h-4 w-4" />
          1. Arrière-plan &amp; Titre de section
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-white/70">
              Titre de la section (au-dessus des cartes)
            </label>
            <input
              type="text"
              value={config.section_title}
              onChange={(e) => handleUpdate("section_title", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-max-cyan focus:outline-none"
              placeholder="Les dernières bandes-annonces"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70">
              Image d&apos;arrière-plan (URL)
            </label>
            <input
              type="text"
              value={config.background_image_url}
              onChange={(e) =>
                handleUpdate("background_image_url", e.target.value)
              }
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-max-cyan focus:outline-none"
              placeholder="https://image.tmdb.org/..."
            />
          </div>
        </div>

        {/* Aperçu du fond */}
        {config.background_image_url && (
          <div className="mt-4">
            <span className="block text-[11px] font-medium text-white/50">
              Aperçu du fond :
            </span>
            <div className="relative mt-1.5 h-28 w-full max-w-lg overflow-hidden rounded-lg border border-white/10 bg-black">
              <img
                src={config.background_image_url}
                alt="Aperçu fond"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Encart Promo du Haut (Logo, Sous-titre, Synopsis, Bouton) */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-max-cyan">
          <Film className="h-4 w-4" />
          2. Promotion du haut (Logo, Sous-titre, Pitch 4 lignes, Vidéo principale)
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Logo URL */}
          <div>
            <label className="block text-xs font-medium text-white/70">
              Logo officiel / Titre détouré (URL PNG)
            </label>
            <input
              type="text"
              value={config.hero_logo_url}
              onChange={(e) => handleUpdate("hero_logo_url", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-max-cyan focus:outline-none"
              placeholder="https://image.tmdb.org/.../logo.png"
            />
            {config.hero_logo_url && (
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[10px] text-white/40">Aperçu logo :</span>
                <div className="rounded border border-white/10 bg-black/60 p-2">
                  <img
                    src={config.hero_logo_url}
                    alt="Aperçu logo"
                    className="h-10 max-w-[200px] object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sous-titre (en majuscule semi-bold) */}
          <div>
            <label className="block text-xs font-medium text-white/70">
              Sous-titre (ex: NOUVELLE SÉRIE ORIGINALE HBO)
            </label>
            <input
              type="text"
              value={config.hero_subtitle}
              onChange={(e) => handleUpdate("hero_subtitle", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-max-cyan focus:outline-none"
              placeholder="NOUVELLE SÉRIE ORIGINALE HBO"
            />
          </div>

          {/* Synopsis / Pitch 4 lignes */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-white/70">
              Pitch / Synopsis (environ 4 lignes en police regular)
            </label>
            <textarea
              rows={4}
              value={config.hero_synopsis}
              onChange={(e) => handleUpdate("hero_synopsis", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-max-cyan focus:outline-none"
              placeholder="Chaque saison de cette nouvelle série originale HBO explorera en profondeur et fidèlement l'un des sept tomes emblématiques de J.K. Rowling..."
            />
          </div>

          {/* Vidéo URL pour le bouton (MP4, M3U8 ou YouTube) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-white/70">
                Bande-annonce du bouton (MP4, M3U/M3U8 ou YouTube)
              </label>
              <VideoFormatBadge input={config.hero_video_url || config.hero_youtube_id} />
            </div>
            <input
              type="text"
              value={config.hero_video_url || config.hero_youtube_id || ""}
              onChange={(e) => handleHeroVideoChange(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-max-cyan focus:outline-none"
              placeholder="URL .mp4, .m3u8, lien YouTube ou ID..."
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/50">
              <span>Formats acceptés : lien MP4/WebM, flux M3U/M3U8 ou YouTube</span>
              {(config.hero_video_url || config.hero_youtube_id) && (
                <button
                  type="button"
                  onClick={() => {
                    const src = detectVideoSource(config.hero_video_url || config.hero_youtube_id);
                    if (src) setPreviewVideo(src);
                  }}
                  className="flex items-center gap-1 font-semibold text-max-cyan hover:underline cursor-pointer"
                >
                  <Play className="h-3 w-3" />
                  <span>Tester le lecteur</span>
                </button>
              )}
            </div>
          </div>

          {/* Texte du bouton */}
          <div>
            <label className="block text-xs font-medium text-white/70">
              Texte du bouton
            </label>
            <input
              type="text"
              value={config.hero_button_text}
              onChange={(e) => handleUpdate("hero_button_text", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-max-cyan focus:outline-none"
              placeholder="Regarder la bande-annonce"
            />
          </div>
        </div>
      </div>

      {/* 3. Liste des cartes de Bandes-Annonces */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-max-cyan">
            <Tv className="h-4 w-4" />
            3. Cartes de bandes-annonces ({config.trailers.length})
          </h3>

          <button
            type="button"
            onClick={handleAddTrailer}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter une carte</span>
          </button>
        </div>

        <p className="mt-1 text-xs text-white/60">
          Chaque carte s&apos;affiche au format paysage avec le <strong>Titre principal</strong>, le <strong>Sous-titre</strong>, l&apos;<strong>URL de l&apos;image de la carte</strong> et la <strong>Bande-annonce (MP4, M3U/M3U8 ou YouTube)</strong>.
        </p>

        <div className="mt-6 space-y-4">
          {config.trailers.map((item, index) => {
            const currentVideo = item.videoUrl || item.youtubeId || "";
            return (
              <div
                key={item.id || index}
                className="rounded-lg border border-white/10 bg-black/40 p-4 transition-all hover:border-white/20"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {item.title || `Carte #${index + 1}`}
                    </span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
                      {item.category}
                    </span>
                    <VideoFormatBadge input={currentVideo} />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveTrailer(index, "up")}
                      disabled={index === 0}
                      aria-label="Monter"
                      className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-white/70 transition hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveTrailer(index, "down")}
                      disabled={index === config.trailers.length - 1}
                      aria-label="Descendre"
                      className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-white/70 transition hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrailer(index)}
                      aria-label="Supprimer"
                      className="flex h-7 w-7 items-center justify-center rounded border border-red-500/20 text-red-400 transition hover:bg-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Titre principal */}
                  <div>
                    <label className="block text-[11px] font-medium text-white/70">
                      Titre principal (film / série)
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleUpdateTrailer(index, "title", e.target.value)
                      }
                      className="mt-1 w-full rounded border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-max-cyan focus:outline-none"
                      placeholder="House of the Dragon"
                    />
                  </div>

                  {/* Sous-titre */}
                  <div>
                    <label className="block text-[11px] font-medium text-white/70">
                      Sous-titre (saison / type bande-annonce)
                    </label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) =>
                        handleUpdateTrailer(index, "subtitle", e.target.value)
                      }
                      className="mt-1 w-full rounded border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-max-cyan focus:outline-none"
                      placeholder="Saison 2 - Bande-annonce officielle (VF)"
                    />
                  </div>

                  {/* Bande-annonce : URL MP4, M3U/M3U8 ou YouTube */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-medium text-white/70">
                        Bande-annonce (MP4, M3U/M3U8 ou YouTube)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={currentVideo}
                      onChange={(e) =>
                        handleUpdateTrailer(index, "videoUrl", e.target.value)
                      }
                      className="mt-1 w-full rounded border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-max-cyan focus:outline-none"
                      placeholder="URL .mp4, .m3u8, lien ou ID YouTube..."
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-[11px] font-medium text-white/70">
                      Catégorie
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleUpdateTrailer(
                          index,
                          "category",
                          e.target.value as "Série" | "Film"
                        )
                      }
                      className="mt-1 w-full rounded border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-max-cyan focus:outline-none"
                    >
                      <option value="Série">Série</option>
                      <option value="Film">Film</option>
                    </select>
                  </div>

                  {/* URL de l'image de la card */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[11px] font-medium text-white/70">
                      URL de l&apos;image de la card (miniature paysage)
                    </label>
                    <input
                      type="text"
                      value={item.thumbnail}
                      onChange={(e) =>
                        handleUpdateTrailer(index, "thumbnail", e.target.value)
                      }
                      className="mt-1 w-full rounded border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-max-cyan focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Aperçu miniature & bouton tester lecteur */}
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-video h-12 overflow-hidden rounded border border-white/10 bg-black">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt="Miniature"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-white/40">
                          N/A
                        </div>
                      )}
                    </div>

                    {currentVideo && (
                      <button
                        type="button"
                        onClick={() => {
                          const src = detectVideoSource(currentVideo);
                          if (src) setPreviewVideo(src);
                        }}
                        className="flex items-center gap-1 rounded bg-white/10 px-2.5 py-1.5 text-[11px] font-medium text-max-cyan hover:bg-white/20 transition cursor-pointer"
                      >
                        <Play className="h-3 w-3" />
                        <span>Tester le lecteur</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bouton Enregistrer au bas */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-max-cyan px-6 py-2.5 text-xs font-bold text-black transition hover:bg-white active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isPending ? "Enregistrement..." : "Enregistrer les modifications"}</span>
        </button>
      </div>

      {/* Modal de test lecteur vidéo dans l'admin */}
      {previewVideo && (
        <AdminVideoModal
          source={previewVideo}
          onClose={() => setPreviewVideo(null)}
        />
      )}
    </div>
  );
}
