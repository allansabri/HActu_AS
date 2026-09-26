"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  NewAndUpcomingConfig,
  defaultNewAndUpcomingConfig,
  NewReleaseCard,
  defaultNewReleaseCards,
  defaultMovieCards,
} from "@/lib/new-and-upcoming-config";

export type { NewReleaseCard };
export { defaultNewReleaseCards, defaultMovieCards };

interface ReleaseCardRowProps {
  title: string;
  cards: NewReleaseCard[];
}

function ReleaseCardRow({ title, cards }: ReleaseCardRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [cards]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="mt-8 sm:mt-10">
      {/* Sous-titre pas grande police + flèches de navigation */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
          {title}
        </h3>

        {/* Boutons de défilement horizontal */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label={`Faire défiler ${title} vers la gauche`}
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-all ${
              canScrollLeft
                ? "hover:border-white/30 hover:bg-white/15 cursor-pointer"
                : "opacity-35 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label={`Faire défiler ${title} vers la droite`}
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-all ${
              canScrollRight
                ? "hover:border-white/30 hover:bg-white/15 cursor-pointer"
                : "opacity-35 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 10 cartes identiques à la section À venir 2026 mais plus petites, avec le bandeau */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none select-none scroll-smooth"
      >
        {cards.slice(0, 10).map((card, index) => (
          <Link
            key={card.id || index}
            href={card.link_url || `/nouveautes`}
            className="group relative flex w-[138px] sm:w-[155px] md:w-[170px] lg:w-[180px] shrink-0 flex-col select-none focus:outline-none cursor-pointer"
          >
            <div className="relative flex flex-col w-full overflow-hidden rounded-none bg-zinc-950 shadow-md">
              {/* Bandeau supérieur en dégradé identique à la section À venir 2026 */}
              <div
                className="relative flex flex-col items-center justify-center w-full h-11 sm:h-12 px-2 py-1 shrink-0 text-center select-none"
                style={{
                  background: "linear-gradient(90deg, #352f34 0%, #404144 50%, #352f34 100%)",
                }}
              >
                {/* Titre principal du bandeau */}
                {card.header_title && (
                  <span className="text-[11px] sm:text-xs md:text-[12.5px] font-extrabold text-white tracking-wider uppercase leading-tight truncate max-w-full drop-shadow-sm">
                    {card.header_title}
                  </span>
                )}

                {/* Sous-titre du bandeau */}
                {card.header_subtitle && (
                  <span className="text-[9.5px] sm:text-[10px] md:text-[11px] font-semibold text-zinc-200 tracking-wide leading-tight mt-0.5 truncate max-w-full">
                    {card.header_subtitle}
                  </span>
                )}

                {/* Ligne fine en dégradé */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{
                    background: "linear-gradient(90deg, #564f55 0%, #818183 50%, #564f55 100%)",
                  }}
                />

                {/* Effet lumineux pur sans point solide (lueur optique diffuse) */}
                <div
                  className="pointer-events-none absolute bottom-0 left-[68%] -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-10"
                  aria-hidden="true"
                >
                  <div
                    className="absolute w-6 h-3 rounded-full blur-[2px]"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 45%, rgba(255, 255, 255, 0) 80%)",
                    }}
                  />
                  <div
                    className="absolute w-10 h-[1px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Poster avec ratio standard 2/3 */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                <img
                  src={card.poster_url}
                  alt={card.title}
                  loading={index < 4 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />

                {/* Overlay sombre au survol avec genre (#788d9f semi-bold), synopsis et bouton 'EN SAVOIR PLUS' */}
                <div className="absolute inset-0 bg-black/90 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between items-center px-3 py-4 sm:px-3.5 sm:py-5 text-center">
                  <div className="flex-1 flex flex-col items-center justify-center my-auto w-full px-1">
                    {card.genre && (
                      <span className="text-xs sm:text-[13px] font-semibold tracking-wider text-[#788d9f] uppercase mb-1.5">
                        {card.genre}
                      </span>
                    )}
                    {card.synopsis && (
                      <p className="text-[11px] sm:text-xs font-normal text-white leading-relaxed line-clamp-5 text-center">
                        {card.synopsis}
                      </p>
                    )}
                  </div>

                  <div className="w-full pt-2 pb-0.5 flex justify-center">
                    <span className="w-full max-w-[150px] inline-flex items-center justify-center rounded-full border border-white bg-transparent px-3 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#788d9f] hover:border-[#788d9f] hover:text-white">
                      EN SAVOIR PLUS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface NewAndUpcomingSectionProps {
  config?: NewAndUpcomingConfig;
  cards?: NewReleaseCard[];
  movieCards?: NewReleaseCard[];
}

export function NewAndUpcomingSection({
  config = defaultNewAndUpcomingConfig,
  cards = defaultNewReleaseCards,
  movieCards = defaultMovieCards,
}: NewAndUpcomingSectionProps) {
  const filterCards = [
    {
      id: "week" as const,
      count: config.week_count,
      label: config.week_label,
    },
    {
      id: "series" as const,
      count: config.series_count,
      label: config.series_label,
    },
    {
      id: "movies" as const,
      count: config.movies_count,
      label: config.movies_label,
    },
  ];

  return (
    <section
      id="nouveaute-a-venir"
      aria-label={config.section_title}
      className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#070c14] bg-cover bg-center bg-no-repeat py-8 sm:py-10 lg:py-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url('https://i.ibb.co/GfJ3GBvY/Bandes-diagonales-abstraites-bleu-nuit.png')`,
      }}
    >
      {/* Overlay pour le contraste, identique à la section À venir 2026 */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden="true" />

      {/* Conteneur principal bien aligné et aéré sans être collé au coin */}
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

          {/* Bouton épuré sans icône qui redirige vers Prochainement et prend la couleur du bouton actualités au survol (#8197a9) */}
          <div className="shrink-0 self-start sm:self-center">
            <Link
              href="/prochainement"
              className="group inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-md transition-all duration-200 hover:bg-[#8197a9] hover:text-white hover:shadow-lg active:scale-95"
            >
              <span>{config.button_text}</span>
            </Link>
          </div>
        </div>

        {/* Rectangles de filtres : redirigent vers Prochainement, dégradé noir/gris, bordure nette sans opacité au survol */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5">
          {filterCards.map((card) => {
            return (
              <Link
                key={card.id}
                href="/prochainement"
                className="relative flex flex-col items-center justify-center rounded-xl px-4 py-4 sm:py-5 text-center border border-white/10 bg-gradient-to-b from-[#26282e] via-[#1a1c20] to-[#121316] hover:border-white/35 shadow-sm transition-all duration-200 cursor-pointer select-none"
              >
                {/* Chiffre centré avec la couleur exacte du hover de la navbar (#778b9d) */}
                <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#778b9d] drop-shadow-sm">
                  {card.count}
                </span>

                {/* Libellé centré en dessous */}
                <span className="mt-1.5 sm:mt-2 text-sm sm:text-base font-bold text-white/90">
                  {card.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Section 1 : « Dernière nouveauté » */}
        <ReleaseCardRow title="Dernière nouveauté" cards={cards} />

        {/* Section 2 : « Les films à voir sur HBO Max » */}
        <ReleaseCardRow title="Les films à voir sur HBO Max" cards={movieCards} />
      </div>
    </section>
  );
}
