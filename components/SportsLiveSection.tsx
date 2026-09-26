"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SportsSectionConfig,
  defaultSportsSectionConfig,
  FeaturedSportCard,
  CompactSportCard,
  defaultCompactSportsCards,
  getCountdownDisplay,
} from "@/lib/sports-config";

interface SportsLiveSectionProps {
  config?: SportsSectionConfig;
}

function CompactLiveCountdown({ item }: { item: CompactSportCard }) {
  const [displayText, setDisplayText] = useState<string>(() =>
    getCountdownDisplay(item, Date.now())
  );

  useEffect(() => {
    const update = () => {
      setDisplayText(getCountdownDisplay(item, Date.now()));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [item.start_date, item.countdown_text]);

  if (!displayText) return null;

  const match = displayText.match(/^(commence dans)\s+(.+)$/i);

  if (match) {
    const prefix = match[1];
    const remainder = match[2];
    return (
      <div className="mt-0.5 flex flex-col items-end text-right select-none leading-tight">
        <span className="text-[10px] sm:text-[11px] font-normal text-white/50 tracking-normal">
          {prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase()}
        </span>
        <span className="text-[11px] sm:text-xs font-semibold text-white/80 tracking-wide">
          {remainder}
        </span>
      </div>
    );
  }

  return (
    <span className="mt-0.5 text-[10.5px] sm:text-xs font-semibold text-white/80 tracking-wide select-none text-right">
      {displayText}
    </span>
  );
}

function LiveCountdownBadge({ item }: { item: FeaturedSportCard }) {
  const [displayText, setDisplayText] = useState<string>(() =>
    getCountdownDisplay(item, Date.now())
  );

  useEffect(() => {
    // Calcul initial puis mise à jour chaque seconde pour décompte fluide
    const update = () => {
      setDisplayText(getCountdownDisplay(item, Date.now()));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [item.start_date, item.countdown_text]);

  if (!displayText) return null;

  return (
    <div
      className="mt-3 sm:mt-3.5 flex items-center justify-center w-full rounded-[7px] px-4 py-2 sm:py-2.5 text-center shadow-md select-none transition-all"
      style={{
        background: "linear-gradient(90deg, #d8dde3 0%, #edf1f5 50%, #d8dde3 100%)",
      }}
    >
      <span className="text-sm sm:text-[15px] md:text-base font-black tracking-wider text-zinc-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
        {displayText}
      </span>
    </div>
  );
}

export function SportsLiveSection({
  config = defaultSportsSectionConfig,
}: SportsLiveSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const events =
    config.featured_events && config.featured_events.length > 0
      ? config.featured_events
      : defaultSportsSectionConfig.featured_events;

  const compactEvents =
    config.compact_events && config.compact_events.length > 0
      ? config.compact_events
      : defaultCompactSportsCards;

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
  }, [events]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -440 : 440;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="sports-en-direct"
      aria-label={config.section_title}
      className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#070c14] bg-cover bg-center bg-no-repeat py-8 sm:py-10 lg:py-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url('${config.background_url}')`,
      }}
    >
      {/* Overlay pour assurer un contraste et une lisibilité parfaite */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/45 backdrop-brightness-[0.92]"
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
              href={config.button_link}
              className="group inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-md transition-all duration-200 hover:bg-[#8197a9] hover:text-white hover:shadow-lg active:scale-95"
            >
              <span>{config.button_text}</span>
            </Link>
          </div>
        </div>

        {/* Disposition : Événements sportifs liste compacte à gauche + Cartes EN AVANT à droite (sans titre) */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Colonne gauche : Rectangle avec dégradé gris noir blanc fin (pas blanc pur) et sans opacité sur les cartes individuelles */}
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
            {compactEvents.map((item) => (
              <Link
                key={item.id}
                href={item.link_url || "/actualites"}
                className="group flex items-center justify-between gap-3 sm:gap-4 py-2.5 sm:py-3 px-1 sm:px-2 rounded-none hover:bg-white/[0.04] transition-colors duration-150 focus:outline-none"
              >
                {/* 1. À gauche : card paysage plus petite */}
                <div className="relative aspect-video w-24 sm:w-28 md:w-32 shrink-0 overflow-hidden rounded-none bg-black/60 shadow">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                    loading="lazy"
                  />
                  {item.is_live && (
                    <div className="absolute top-0 left-0 z-10 flex items-center gap-1 bg-red-600/95 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow rounded-none">
                      <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                      DIRECT
                    </div>
                  )}
                </div>

                {/* 2. Au centre : au-dessus récurrence (tous les jours, chaque lundi...), titre de l'événement, sous-titre date */}
                <div className="flex flex-1 flex-col min-w-0 justify-center">
                  {item.recurrence && (
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/50 truncate">
                      {item.recurrence}
                    </span>
                  )}
                  <h4 className="text-sm sm:text-[15px] font-bold tracking-tight text-white group-hover:text-[#8197a9] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="mt-0.5 text-xs sm:text-[12.5px] font-normal text-white/60 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* 3. Tout à droite au centre : Heure de sortie et en dessous compte à rebours sans bandeau-rectangle */}
                <div className="shrink-0 flex flex-col items-end justify-center text-right pl-1 sm:pl-2">
                  {item.event_time && (
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
                      {item.event_time}
                    </span>
                  )}
                  <CompactLiveCountdown item={item} />
                </div>
              </Link>
            ))}
          </div>

          {/* Colonne droite : Les 5 cards EN AVANT au format paysage */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col min-w-0">
            {/* Flèches de navigation alignées à droite (pas de titre comme demandé) */}
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

            {/* Rangée horizontale des 5 cartes au format paysage (taille augmentée pour équilibrer la hauteur) */}
            <div
              ref={scrollRef}
              tabIndex={0}
              aria-label="Événements sportifs à la une"
              className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 scrollbar-none scroll-smooth focus:outline-none select-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {events.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={item.link_url || "/actualites"}
                  className="group w-[310px] sm:w-[350px] md:w-[390px] lg:w-[420px] shrink-0 cursor-pointer flex flex-col focus:outline-none"
                >
                  {/* 1. Carte paysage avec image au ratio vidéo élargie */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/60 shadow-xl rounded-none">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                      loading="lazy"
                    />

                    {/* Badge direct si l'événement est en cours */}
                    {item.is_live && (
                      <div className="absolute top-0 left-0 z-10 flex items-center gap-1 bg-red-600/95 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md rounded-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        DIRECT
                      </div>
                    )}
                  </div>

                  {/* 2. En dessous : Titre avec tag en texte à droite, date, compte à rebours et synopsis */}
                  <div className="mt-3.5 flex flex-col px-0.5">
                    {/* Ligne Titre de l'événement + Tag en texte normal à droite (sans rectangle, ni bleu) */}
                    <div className="flex items-baseline justify-between gap-2.5">
                      <h3 className="text-lg sm:text-xl md:text-[21px] font-extrabold tracking-tight text-white group-hover:text-[#7a8fa1] transition-colors truncate">
                        {item.title}
                      </h3>
                      {item.tag && (
                        <span className="shrink-0 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-300">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Sous-titre de la date de sortie avec tiret et heure de sortie de l'événement */}
                    {(() => {
                      const dateStr = item.subtitle?.trim();
                      const timeStr = item.event_time?.trim();
                      if (!dateStr && !timeStr) return null;
                      let fullDateDisplay = dateStr || "";
                      if (timeStr) {
                        if (!dateStr) {
                          fullDateDisplay = timeStr;
                        } else if (!dateStr.includes(timeStr)) {
                          fullDateDisplay = `${dateStr} - ${timeStr}`;
                        }
                      }
                      return (
                        <p className="mt-1 text-sm sm:text-[15px] font-medium text-white/80 truncate">
                          {fullDateDisplay}
                        </p>
                      );
                    })()}

                    {/* Compteur interactif dans un bandeau-rectangle blanc cassé sans bordure */}
                    <LiveCountdownBadge item={item} />

                    {/* Synopsis / Pitch de l'événement */}
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
