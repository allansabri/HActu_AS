"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import {
  UpcomingEpisodesConfig,
  defaultUpcomingEpisodesConfig,
  FeaturedEpisodeCard,
  CompactEpisodeCard,
} from "@/lib/upcoming-episodes-config";

interface UpcomingEpisodesSectionProps {
  config?: UpcomingEpisodesConfig;
}

export function UpcomingEpisodesSection({
  config = defaultUpcomingEpisodesConfig,
}: UpcomingEpisodesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const featuredEpisodes =
    config.featured_episodes && config.featured_episodes.length > 0
      ? config.featured_episodes
      : defaultUpcomingEpisodesConfig.featured_episodes;

  const compactEpisodes =
    config.compact_episodes && config.compact_episodes.length > 0
      ? config.compact_episodes
      : defaultUpcomingEpisodesConfig.compact_episodes;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [featuredEpisodes]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -440 : 440;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const backgroundUrl =
    config.background_url ||
    "https://i.ibb.co/GfJ3GBvY/Bandes-diagonales-abstraites-bleu-nuit.png";

  return (
    <section
      id="prochainement-sur-hbo-max"
      aria-label={config.section_title}
      className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#070c14] bg-cover bg-center bg-no-repeat py-8 sm:py-10 lg:py-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url('${backgroundUrl}')`,
      }}
    >
      {/* Overlay pour le contraste, identique à la section Nouveautés & À venir */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/35 backdrop-brightness-[0.92]"
        aria-hidden="true"
      />

      {/* Conteneur principal calé sur les marges globales du site */}
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Ligne d'en-tête : Titre & Sous-titre à gauche + Bouton blanc à droite */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {config.section_title}
            </h2>
            <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-zinc-300 font-normal">
              {config.section_subtitle}
            </p>
          </div>

          {/* Bouton blanc identique qui passe en #8197a9 au survol */}
          <div className="shrink-0 self-start sm:self-center">
            <Link
              href={config.button_link || "/prochainement"}
              className="group inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-md transition-all duration-200 hover:bg-[#8197a9] hover:text-white hover:shadow-lg active:scale-95"
            >
              <span>{config.button_text}</span>
            </Link>
          </div>
        </div>

        {/* Disposition : Nouveaux épisodes compacts à gauche + Cartes EN AVANT à droite */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Colonne gauche : Rectangle avec dégradé identique et liste compacte des épisodes de la semaine */}
          <div
            className="lg:col-span-5 xl:col-span-5 rounded-xl p-2.5 sm:p-3.5 shadow-2xl min-w-0 flex flex-col max-h-[580px] overflow-y-auto divide-y divide-white/[0.07] pr-1"
            style={{
              background:
                "linear-gradient(160deg, rgba(220, 226, 235, 0.14) 0%, rgba(44, 51, 63, 0.85) 25%, rgba(18, 22, 29, 0.95) 70%, rgba(9, 11, 15, 0.98) 100%)",
              border: "1px solid rgba(215, 222, 232, 0.22)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
            }}
          >
            {compactEpisodes.map((item) => (
              <Link
                key={item.id}
                href={item.link_url || "/prochainement"}
                className="group flex items-center justify-between gap-3 sm:gap-4 py-2.5 sm:py-3 px-1 sm:px-2 rounded-none hover:bg-white/[0.04] transition-colors duration-150 focus:outline-none"
              >
                {/* 1. À gauche : card paysage 16:9 */}
                <div className="relative aspect-video w-24 sm:w-28 md:w-32 shrink-0 overflow-hidden rounded-none bg-black/60 shadow">
                  <img
                    src={item.image_url}
                    alt={`${item.series_title} - ${item.episode_number}`}
                    className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                    loading="lazy"
                  />
                  {item.is_new && (
                    <div className="absolute top-0 left-0 z-10 flex items-center gap-1 bg-white px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-black shadow rounded-none">
                      NOUVEAU
                    </div>
                  )}
                </div>

                {/* 2. Au centre : au-dessus récurrence / jour, Titre série + Épisode, sous-titre nom de l'épisode */}
                <div className="flex flex-1 flex-col min-w-0 justify-center">
                  {item.recurrence && (
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/50 truncate">
                      {item.recurrence}
                    </span>
                  )}
                  <h4 className="text-sm sm:text-[15px] font-bold tracking-tight text-white group-hover:text-[#8197a9] transition-colors line-clamp-1 leading-snug">
                    {item.series_title} - {item.episode_number}
                  </h4>
                  {item.episode_title && (
                    <p className="mt-0.5 text-xs sm:text-[12.5px] font-normal text-white/70 truncate italic">
                      « {item.episode_title} »
                    </p>
                  )}
                </div>

                {/* 3. Tout à droite au centre : Heure de sortie et statut / jour */}
                <div className="shrink-0 flex flex-col items-end justify-center text-right pl-1 sm:pl-2">
                  {item.release_time && (
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
                      {item.release_time}
                    </span>
                  )}
                  {item.countdown_text && (
                    <span className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-white/60">
                      {item.countdown_text}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Colonne droite : Les 5 cards EN AVANT au format paysage */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col min-w-0">
            {/* Flèches de navigation alignées à droite */}
            <div className="mb-3 flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Défiler vers la gauche"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 disabled:pointer-events-none disabled:opacity-20 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Défiler vers la droite"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 disabled:pointer-events-none disabled:opacity-20 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Rangée horizontale des 5 cartes au format paysage */}
            <div
              ref={scrollRef}
              tabIndex={0}
              aria-label="Nouveaux épisodes à la une"
              className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 scrollbar-none scroll-smooth focus:outline-none select-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {featuredEpisodes.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={item.link_url || "/prochainement"}
                  className="group w-[310px] sm:w-[350px] md:w-[390px] lg:w-[420px] shrink-0 cursor-pointer flex flex-col focus:outline-none"
                >
                  {/* 1. Carte paysage avec image au ratio vidéo élargie */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/60 shadow-xl rounded-none">
                    <img
                      src={item.image_url}
                      alt={`${item.series_title} - ${item.episode_number}`}
                      className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                      loading="lazy"
                    />

                    {/* Badge nouvel épisode : blanc, aucun bleu, collé au coin supérieur gauche */}
                    {item.is_new && (
                      <div className="absolute top-0 left-0 z-10 flex items-center bg-white px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-black shadow-md rounded-none">
                        NOUVEL ÉPISODE
                      </div>
                    )}
                  </div>

                  {/* 2. En dessous : Titre série + Épisode avec tag à droite, sous-titre nom épisode, bandeau et synopsis */}
                  <div className="mt-3.5 flex flex-col px-0.5">
                    {/* Ligne Titre de la série + Épisode + Tag en texte normal à droite */}
                    <div className="flex items-baseline justify-between gap-2.5">
                      <h3 className="text-lg sm:text-xl md:text-[21px] font-extrabold tracking-tight text-white group-hover:text-[#7a8fa1] transition-colors truncate">
                        {item.series_title} - {item.episode_number}
                      </h3>
                      {item.tag && (
                        <span className="shrink-0 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-300">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Sous-titre : Titre de l'épisode + jour et heure de sortie */}
                    {(() => {
                      const epTitle = item.episode_title?.trim();
                      const dayStr = item.release_day?.trim();
                      const timeStr = item.release_time?.trim();
                      
                      const schedule = [dayStr, timeStr].filter(Boolean).join(" à ");
                      const subtitleParts = [
                        epTitle ? `« ${epTitle} »` : null,
                        schedule || null
                      ].filter(Boolean);

                      if (subtitleParts.length === 0) return null;

                      return (
                        <p className="mt-1 text-sm sm:text-[15px] font-medium text-white/80 truncate">
                          {subtitleParts.join(" - ")}
                        </p>
                      );
                    })()}

                    {/* Bandeau élégant blanc-cassé avec décompte / statut */}
                    {item.countdown_text && (
                      <div
                        className="mt-3 sm:mt-3.5 flex items-center justify-center w-full rounded-[7px] px-4 py-2 sm:py-2.5 text-center shadow-md select-none transition-all"
                        style={{
                          background:
                            "linear-gradient(90deg, #d8dde3 0%, #edf1f5 50%, #d8dde3 100%)",
                        }}
                      >
                        <span className="text-xs sm:text-sm font-black tracking-wider text-zinc-950 uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] truncate">
                          {item.countdown_text}
                        </span>
                      </div>
                    )}

                    {/* Synopsis détaillé de l'épisode */}
                    {item.synopsis && (
                      <p className="mt-2 text-xs sm:text-[13.5px] md:text-sm font-normal text-white/70 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                        {item.synopsis}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
