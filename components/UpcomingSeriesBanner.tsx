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
    const cardWidth = 205; // card + gap width
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

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-col lg:flex-row lg:items-center">
        {/* Left Side: "À venir" in semi-bold, centered relative to "2026" */}
        <div
          id="upcoming-series-text-block"
          className="relative z-20 flex shrink-0 flex-col items-center justify-center text-center px-6 sm:px-8 lg:w-72 xl:w-80 lg:pl-10 lg:pr-4"
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

        {/* Right Side: Portrait Cards Carousel with Subtle Edge Fade */}
        <div className="relative mt-5 min-w-0 flex-1 lg:mt-0">
          {/* Subtle edge fade overlays */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-6 sm:w-10 bg-gradient-to-r from-black/50 to-transparent"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 sm:w-10 bg-gradient-to-l from-black/50 to-transparent"
            aria-hidden="true"
          />

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
  const href = card.link_url || "/prochainement";

  return (
    <Link
      href={href}
      id={`series-card-${card.id || index}`}
      className="group relative flex w-[145px] sm:w-[165px] md:w-[185px] lg:w-[205px] shrink-0 flex-col select-none transition-all duration-300 hover:-translate-y-1 focus:outline-none"
    >
      <div className="relative flex flex-col aspect-[2/3] w-full overflow-hidden rounded-none bg-zinc-950 shadow-[0_8px_24px_rgba(0,0,0,0.65)]">
        {/* Bandeau supérieur en dégradé: début #352f34, centre #404144, fin #352f34 sans texte */}
        <div
          className="w-full h-9 sm:h-10 shrink-0 border-b border-white/10"
          style={{
            background: "linear-gradient(90deg, #352f34 0%, #404144 50%, #352f34 100%)"
          }}
        />

        {/* Poster */}
        <div className="relative flex-1 w-full overflow-hidden bg-zinc-900">
          {card.poster_url ? (
            <img
              src={card.poster_url}
              alt={card.title}
              loading={index < 4 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-center p-3">
              <span className="text-xs font-bold text-white/60">{card.title}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
