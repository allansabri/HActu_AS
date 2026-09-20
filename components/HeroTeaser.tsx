"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

export interface HeroTeaserItem {
  id: string;
  title: string;
  genres: [string, string];
  releaseDate: string;
  synopsis: string;
  detailUrl: string;
  dailymotionId: string;
  backdropUrl: string;
  durationSec: number;
}

const DEFAULT_HERO_ITEMS: HeroTeaserItem[] = [
  {
    id: "supergirl",
    title: "Supergirl",
    genres: ["SUPER-HÉROS", "ACTION"],
    releaseDate: "AU CINÉMA LE 24 JUIN 2026",
    synopsis:
      "Supergirl s'allie à un compagnon inattendu dans une odyssée interstellaire spectaculaire de vengeance et de justice alors qu'une menace frappe le cœur de son passé.",
    detailUrl: "/titres/movie/supergirl",
    dailymotionId: "xa3s4fy",
    backdropUrl: "/hero-supergirl.jpg",
    durationSec: 172
  },
  {
    id: "harry-potter",
    title: "Harry Potter",
    genres: ["FANTASTIQUE", "AVENTURE"],
    releaseDate: "NOUVELLE SÉRIE ORIGINALE HBO SUR MAX EN 2026",
    synopsis:
      "L'adaptation fidèle et inédite des romans légendaires de J.K. Rowling explorant l'univers de Poudlard avec un tout nouveau casting et une plongée authentique dans chaque année d'apprentissage.",
    detailUrl: "/titres/series/harry-potter",
    dailymotionId: "xb3d9v2",
    backdropUrl: "/hero-harry-potter.jpg",
    durationSec: 141
  },
  {
    id: "clayface",
    title: "Clayface",
    genres: ["HORREUR", "SUPER-HÉROS"],
    releaseDate: "AU CINÉMA LE 23 OCTOBRE 2026",
    synopsis:
      "Un acteur hollywoodien déchu voit son existence basculer dans le cauchemar après un traitement expérimental le métamorphosant en une créature d'argile terrifiante en quête de vengeance.",
    detailUrl: "/titres/movie/clayface",
    dailymotionId: "xarfive",
    backdropUrl: "/hero-clayface.jpg",
    durationSec: 144
  },
  {
    id: "war",
    title: "War",
    genres: ["DRAME", "THRILLER"],
    releaseDate: "SÉRIE ORIGINALE HBO LE 1ER OCTOBRE 2026",
    synopsis:
      "Deux prestigieux cabinets d'avocats londoniens s'affrontent sans pitié lors du divorce hautement explosif et médiatisé d'un milliardaire de la tech et d'une actrice internationale.",
    detailUrl: "/titres/series/war",
    dailymotionId: "xb9fd82",
    backdropUrl: "/hero-war.jpg",
    durationSec: 107
  },
  {
    id: "paolo",
    title: "Paolo",
    genres: ["THRILLER", "DRAME"],
    releaseDate: "SÉRIE FRANÇAISE ORIGINALE MAX LE 25 SEPTEMBRE 2026",
    synopsis:
      "Le quotidien de Paolo bascule lorsqu'il renoue avec un ancien camarade de classe devenu une figure politique influente. Une fascination mutuelle qui vire rapidement à l'obsession dévorante.",
    detailUrl: "/titres/series/paolo",
    dailymotionId: "xb0y3m2",
    backdropUrl: "/hero-paolo.jpg",
    durationSec: 107
  }
];

export function HeroTeaser({ items = DEFAULT_HERO_ITEMS }: { items?: HeroTeaserItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const endTimerRef = useRef<NodeJS.Timeout | null>(null);

  const heroList = items.slice(0, 5);
  const currentItem = heroList[currentIndex] || heroList[0];

  // Passage direct au hero suivant (avec son coupé au démarrage pour garantir l'autoplay sans blocage navigateur)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroList.length);
    setIsMuted(true);
    setIsPlaying(true);
  }, [heroList.length]);

  // Passage au hero précédent
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroList.length) % heroList.length);
    setIsMuted(true);
    setIsPlaying(true);
  }, [heroList.length]);

  // Sélection manuelle au clic sur une pastille 1, 2, 3, 4, 5
  const selectIndex = (index: number) => {
    setCurrentIndex(index);
    setIsMuted(true);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Minuteur automatique basé sur la durée exacte de la bande-annonce
  useEffect(() => {
    if (!isPlaying) {
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
      return;
    }

    if (endTimerRef.current) clearTimeout(endTimerRef.current);
    const durationMs = (currentItem.durationSec || 75) * 1000;

    endTimerRef.current = setTimeout(() => {
      handleNext();
    }, durationMs);

    return () => {
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, [currentIndex, isPlaying, currentItem.durationSec, handleNext]);

  // Écoute des événements Dailymotion postMessage pour transition automatique dès la fin du flux
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            if (data.includes("video_end") || data.includes("event=end")) {
              handleNext();
              return;
            }
          }
        }
        if (data && typeof data === "object") {
          if (
            data.event === "video_end" ||
            data.event === "end" ||
            data.type === "video_end" ||
            data.event === "onVideoEnd"
          ) {
            handleNext();
          }
        }
      } catch {
        // ignorer
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleNext]);

  return (
    <section
      aria-label="Teaser Hero"
      className="relative w-full h-[76vh] min-h-[580px] max-h-[820px] overflow-hidden bg-black text-white select-none"
    >
      {/* 1. Couche Affiche HD (Z-0) : en arrière-plan immédiat */}
      <div
        key={`backdrop-${currentItem.id}`}
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 pointer-events-none"
        style={{ backgroundImage: `url(${currentItem.backdropUrl})` }}
      />

      {/* 2. Couche Vidéo Dailymotion (Z-10) : AU-DESSUS de l'affiche, visible dès la première image */}
      {isPlaying && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-10 pointer-events-none">
          <iframe
            key={`dm-${currentItem.id}-${currentIndex}-${isMuted ? "muted" : "unmuted"}`}
            src={`https://geo.dailymotion.com/player.html?video=${currentItem.dailymotionId}&mute=${isMuted ? "true" : "false"}&autoplay=true`}
            title={currentItem.title}
            tabIndex={-1}
            aria-hidden="true"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
            className="w-[115vw] h-[115vh] min-w-[177.77vh] min-h-[56.25vw] object-cover scale-105 pointer-events-none select-none border-0"
          />
        </div>
      )}

      {/* 3. Dégradés cinématiques fidèles au style officiel HBO Max (Z-20) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent w-full sm:w-[65%] pointer-events-none z-20" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0a0c14] to-transparent pointer-events-none z-20" />

      {/* 4. Couche interactive avant-plan (Z-30) : 100% au-dessus, totalement cliquable */}
      <div className="relative z-30 flex flex-col justify-end h-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 pointer-events-auto">
        {/* Bloc d'informations sur le titre */}
        <div key={`content-${currentItem.id}`} className="max-w-xl lg:max-w-2xl text-left">
          {/* Titre avec ombre légère */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {currentItem.title}
          </h1>

          {/* Genres + Date / Statut */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold tracking-widest uppercase">
            <span className="text-white/90">
              {currentItem.genres[0]} • {currentItem.genres[1]}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[#778b9d] font-bold tracking-wider">{currentItem.releaseDate}</span>
          </div>

          {/* Mini-Pitch / Synopsis */}
          <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-white/90 font-normal line-clamp-3 md:line-clamp-4 max-w-xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
            {currentItem.synopsis}
          </p>

          {/* Bouton d'action : EN SAVOIR PLUS */}
          <div className="mt-6 sm:mt-7">
            <Link
              href={currentItem.detailUrl}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-xs sm:text-sm font-bold tracking-wider text-black uppercase shadow-sm transition-transform duration-200 hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
            >
              EN SAVOIR PLUS
            </Link>
          </div>
        </div>

        {/* 4. Barre de contrôles et pastilles 1, 2, 3, 4, 5 */}
        <div className="mt-6 flex items-center gap-2.5 sm:gap-3">
          {/* Bouton Pause / Lecture */}
          <button
            type="button"
            id="hero-toggle-play"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? "Mettre en pause le teaser" : "Lancer le teaser"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/40 bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition hover:border-white hover:bg-black/80 active:scale-95 cursor-pointer select-none"
          >
            {isPlaying ? (
              <span className="w-2.5 h-2.5 rounded-[2px] bg-white" />
            ) : (
              <svg
                className="w-3 h-3 translate-x-0.5 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Bouton Son (Activer / Couper) */}
          <button
            type="button"
            id="hero-toggle-mute"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            aria-label={isMuted ? "Activer le son de la bande-annonce" : "Couper le son de la bande-annonce"}
            title={isMuted ? "Activer le son" : "Couper le son"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/40 bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition hover:border-white hover:bg-black/80 active:scale-95 cursor-pointer select-none"
          >
            {isMuted ? (
              <svg className="w-3.5 h-3.5 fill-current text-white/80" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          {/* Pastilles numérotées 1, 2, 3, 4, 5 (réactivité totale aux clics et appuis) */}
          {heroList.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                id={`hero-pastille-${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  selectIndex(index);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  selectIndex(index);
                }}
                aria-label={`Afficher le teaser ${index + 1} : ${item.title}`}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 backdrop-blur-md cursor-pointer select-none ${
                  isActive
                    ? "bg-white text-black font-black shadow-md scale-105 ring-2 ring-white/60"
                    : "bg-white/20 text-white/90 hover:bg-white/40 hover:text-white hover:scale-105 active:scale-95"
                }`}
              >
                {index + 1}
              </button>
            );
          })}

          {/* Boutons Suivant / Précédent */}
          <div className="ml-1 flex items-center gap-1.5">
            <button
              type="button"
              id="hero-prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Teaser précédent"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 transition cursor-pointer select-none"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              type="button"
              id="hero-next-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Teaser suivant"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 transition cursor-pointer select-none"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
