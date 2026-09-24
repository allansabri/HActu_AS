"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UpcomingSeriesBannerConfig, UpcomingSeriesCard } from "@/lib/types";

interface UpcomingSeriesBannerProps {
  config: UpcomingSeriesBannerConfig;
}

function parseBannerTitle(raw: string) {
  const trimmed = (raw || "À venir en 2026").trim();
  const yearMatch = trimmed.match(/(20\d{2})/);
  if (yearMatch) {
    const year = yearMatch[1];
    const prefix = trimmed.replace(new RegExp(`\\s*(en\\s+)?${year}\\s*$`, "i"), "").trim() || "À venir";
    return { prefix, highlight: year };
  }
  return { prefix: "À venir", highlight: "2026" };
}

export function UpcomingSeriesBanner({ config }: UpcomingSeriesBannerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const title = config.title || "À venir en 2026";
  const cards = config.cards || [];
  const { prefix, highlight } = parseBannerTitle(title);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [cards]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = 240; // card + gap width
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="nouvelles-series-a-venir"
      aria-label="Nouvelles séries à venir"
      className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#070c14] bg-cover bg-center bg-no-repeat py-6 sm:py-7 lg:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url('https://i.ibb.co/GfJ3GBvY/Bandes-diagonales-abstraites-bleu-nuit.png')`
      }}
    >
      {/* Background overlay for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col lg:flex-row lg:items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Left Side: "À venir" in semi-bold, centered relative to "2026" */}
        <div
          id="upcoming-series-text-block"
          className="relative z-20 flex shrink-0 flex-col items-center justify-center text-center px-4 sm:px-6 lg:w-64 xl:w-72 lg:pl-0 lg:pr-6"
        >
          <div className="flex flex-col items-center text-center">
            <span className="text-lg font-semibold tracking-tight text-white/90 sm:text-xl lg:text-2xl leading-tight">
              {prefix}
            </span>
            <span className="mt-0.5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-none">
              {highlight}
            </span>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Faire défiler vers la gauche"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 disabled:pointer-events-none disabled:opacity-20 active:scale-95"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Faire défiler vers la droite"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 disabled:pointer-events-none disabled:opacity-20 active:scale-95"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Portrait Cards Carousel */}
        <div className="relative mt-5 min-w-0 flex-1 lg:mt-0">
          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            aria-label="Liste des séries à venir"
            className="flex gap-4 overflow-x-auto px-6 sm:px-8 py-2.5 scrollbar-none scroll-smooth focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {cards.map((card, idx) => (
              <SeriesPortraitCard key={card.id || idx} card={card} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SeriesPortraitCard({ card, index }: { card: UpcomingSeriesCard; index: number }) {
  const href =
    card.link_url ||
    (card.series_id
      ? `/series/${card.series_id}`
      : `/prochainement/${encodeURIComponent(card.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`);

  const displayGenre = card.genre || "SÉRIE";
  const displaySynopsis =
    card.synopsis || `Découvrez prochainement ${card.title} sur la plateforme.`;

  return (
    <Link
      href={href}
      id={`series-card-${card.id || index}`}
      className="group relative flex w-[170px] sm:w-[195px] md:w-[220px] lg:w-[240px] shrink-0 flex-col select-none focus:outline-none cursor-pointer"
    >
      <div className="relative flex flex-col w-full overflow-hidden rounded-none bg-zinc-950">
        {/* Bandeau supérieur en dégradé: début #352f34, centre #404144, fin #352f34 avec titre principal et sous-titre */}
        <div
          className="relative flex flex-col items-center justify-center w-full h-14 sm:h-16 px-3 py-1.5 shrink-0 text-center select-none"
          style={{
            background: "linear-gradient(90deg, #352f34 0%, #404144 50%, #352f34 100%)"
          }}
        >
          {/* Titre principal: police plus grande et en bold */}
          {(card.header_title || card.badge) && (
            <span className="text-[13px] sm:text-[15px] md:text-base font-extrabold text-white tracking-wider uppercase leading-tight truncate max-w-full drop-shadow-sm">
              {card.header_title || card.badge}
            </span>
          )}

          {/* Sous-titre: en semi-bold avec espacement subtil (pas trop collé) */}
          {card.header_subtitle && (
            <span className="text-xs sm:text-[13px] md:text-sm font-semibold text-zinc-200 tracking-wide leading-tight mt-0.5 truncate max-w-full">
              {card.header_subtitle}
            </span>
          )}

          {/* Ligne fine en dégradé: gauche #564f55, milieu #818183, droite #564f55 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background: "linear-gradient(90deg, #564f55 0%, #818183 50%, #564f55 100%)"
            }}
          />

          {/* Effet lumineux pur sans point solide (lueur optique diffuse) */}
          <div
            className="pointer-events-none absolute bottom-0 left-[68%] -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-10"
            aria-hidden="true"
          >
            {/* Halo optique ovale diffus */}
            <div
              className="absolute w-8 h-4 rounded-full blur-[2px]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 45%, rgba(255, 255, 255, 0) 80%)"
              }}
            />
            {/* Reflet lumineux horizontal le long de la ligne */}
            <div
              className="absolute w-12 h-[1px]"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)"
              }}
            />
          </div>
        </div>

        {/* Poster avec son ratio standard 2/3 complet (aucun zoom au survol) */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
          {card.poster_url ? (
            <img
              src={card.poster_url}
              alt={card.title}
              loading={index < 4 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-center p-3">
              <span className="text-xs font-bold text-white/60">{card.title}</span>
            </div>
          )}

          {/* Overlay sombre au survol avec genre (#788d9f semi-bold), synopsis (regular) et bouton 'EN SAVOIR PLUS' */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between items-center px-4 py-6 sm:px-5 sm:py-7 text-center">
            {/* Bloc central: Genre + Synopsis */}
            <div className="flex-1 flex flex-col items-center justify-center my-auto w-full px-1">
              {displayGenre && (
                <span className="text-sm sm:text-[15px] font-semibold tracking-wider text-[#788d9f] uppercase mb-2.5 sm:mb-3">
                  {displayGenre}
                </span>
              )}
              {displaySynopsis && (
                <p className="text-[13px] sm:text-sm md:text-[15px] font-normal text-white leading-relaxed line-clamp-6 text-center">
                  {displaySynopsis}
                </p>
              )}
            </div>

            {/* Bouton En savoir plus: pilule avec bordure blanche, devient #788d9f au survol */}
            <div className="w-full pt-4 pb-1 flex justify-center">
              <span className="w-full max-w-[200px] sm:max-w-[210px] inline-flex items-center justify-center rounded-full border border-white bg-transparent px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#788d9f] hover:border-[#788d9f] hover:text-white">
                EN SAVOIR PLUS
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
