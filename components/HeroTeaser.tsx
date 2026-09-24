"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

export interface HeroTeaserItem {
  id: string;
  title: string;
  category?: string;
  genres?: [string, string] | string[];
  releaseDate?: string;
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
    category: "SUPER-HÉROS",
    genres: ["SUPER-HÉROS", "ACTION"],
    releaseDate: "AU CINÉMA LE 24 JUIN 2026",
    synopsis:
      "Supergirl s'allie à un allié improbable dans un voyage interstellaire épique de vengeance et de justice lorsqu'un ennemi inattendu frappe trop près de chez elle.",
    detailUrl: "/titres/movie/supergirl",
    dailymotionId: "xa3s4fy",
    backdropUrl: "/hero-supergirl.jpg",
    durationSec: 172
  },
  {
    id: "harry-potter",
    title: "Harry Potter",
    category: "FANTASTIQUE",
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
    category: "SUPER-HÉROS",
    genres: ["SUPER-HÉROS", "HORREUR"],
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
    category: "DRAME",
    genres: ["DRAME", "THRILLER"],
    releaseDate: "SÉRIE ORIGINALE HBO LE 1ER OCTOBRE 2026",
    synopsis:
      "Deux prestigieux cabinets d'avocats londoniens s'affrontent sans pitié lors du divorce hautement explosif et médiatisé d'un milliardaire de la tech et d'une actrice internationale.",
    detailUrl: "/titres/series/war",
    dailymotionId: "xb9fd82",
    backdropUrl: "/hero-war.jpg",
    durationSec: 107
  }
];

export function HeroTeaser({ items = DEFAULT_HERO_ITEMS }: { items?: HeroTeaserItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const endTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Exactement 4 teasers selon la référence visuelle (1, 2, 3, 4)
  const heroList = items.slice(0, 4);
  const currentItem = heroList[currentIndex] || heroList[0];

  // Passage direct au hero suivant (muet au départ pour garantir l'autoplay)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroList.length);
    setIsMuted(true);
    setIsPlaying(true);
  }, [heroList.length]);

  // Sélection directe au clic sur une pastille (1, 2, 3, 4)
  const selectIndex = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setIsMuted(true);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const nextPlaying = !prev;
      if (iframeRef.current?.contentWindow) {
        const cmd = nextPlaying ? "play" : "pause";
        try {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ command: cmd }), "*");
          iframeRef.current.contentWindow.postMessage(cmd, "*");
        } catch {}
      }
      return nextPlaying;
    });
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (iframeRef.current?.contentWindow) {
        const cmd = nextMuted ? "mute" : "unmute";
        const vol = nextMuted ? "0" : "1";
        try {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ command: cmd }), "*");
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ command: "volume", parameters: [vol] }),
            "*"
          );
          iframeRef.current.contentWindow.postMessage(cmd, "*");
        } catch {}
      }
      return nextMuted;
    });
  };

  // Minuteur automatique basé sur la durée réelle de la vidéo
  useEffect(() => {
    if (!isPlaying) {
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
      return;
    }

    if (endTimerRef.current) clearTimeout(endTimerRef.current);
    const durationMs = (currentItem.durationSec || 90) * 1000;

    endTimerRef.current = setTimeout(() => {
      handleNext();
    }, durationMs);

    return () => {
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, [currentIndex, isPlaying, currentItem.durationSec, handleNext]);

  // Écoute des événements Dailymotion (postMessage) pour enchaîner dès la fin du teaser
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            const str = data.toLowerCase();
            if (
              str.includes("video_end") ||
              str.includes("event=end") ||
              str.includes("ended") ||
              str.includes("playback_end")
            ) {
              handleNext();
              return;
            }
          }
        }
        if (data && typeof data === "object") {
          const evt = (data.event || data.type || "").toString().toLowerCase();
          if (
            evt === "video_end" ||
            evt === "end" ||
            evt === "ended" ||
            evt === "playback_end" ||
            evt === "player_end" ||
            evt === "onvideoend"
          ) {
            handleNext();
          }
        }
      } catch {
        // Ignorer les messages non-JSON externes
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleNext]);

  return (
    <section
      aria-label="Teaser Hero"
      className="relative w-full h-[76vh] min-h-[560px] max-h-[820px] overflow-hidden bg-black text-white select-none"
    >
      {/* 1. Couche Affiche HD (Z-0) : visible immédiatement en fond */}
      <div
        key={`backdrop-${currentItem.id}`}
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 pointer-events-none"
        style={{ backgroundImage: `url(${currentItem.backdropUrl})` }}
      />

      {/* 2. Couche Vidéo Dailymotion (Z-10) : maintenue montée pour pause/reprise instantanée sans retour à zéro */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-10 pointer-events-none">
        <iframe
          ref={iframeRef}
          key={`dm-${currentItem.id}`}
          src={`https://geo.dailymotion.com/player.html?video=${currentItem.dailymotionId}&mute=true&autoplay=true&api=postMessage`}
          title={currentItem.title}
          tabIndex={-1}
          aria-hidden="true"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
          className="w-[115vw] h-[115vh] min-w-[177.77vh] min-h-[56.25vw] object-cover scale-105 pointer-events-none select-none border-0"
        />
      </div>

      {/* 3. Dégradés cinématiques réduits : ombrage adouci pour préserver la clarté et la luminosité de la vidéo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent w-full sm:w-[48%] pointer-events-none z-20" />
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#050a0a] to-transparent pointer-events-none z-20" />

      {/* 4. Couche interactive avant-plan (Z-30) : 100% cliquable */}
      <div className="relative z-30 flex flex-col justify-end h-full w-full pointer-events-auto">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 sm:pb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full">
          
          {/* À GAUCHE : Titre, Catégorie / Genres, Synopsis et Boutons EN SAVOIR PLUS + Son */}
          <div className="flex flex-col items-start text-left max-w-lg lg:max-w-xl order-1">
            {/* Titre */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {currentItem.title}
            </h1>

            {/* 2 Genres avec espacement aéré par rapport au titre */}
            <p className="mt-4 sm:mt-5 text-xs sm:text-sm font-black uppercase tracking-[0.22em] text-white/90">
              {currentItem.genres && currentItem.genres.length >= 2
                ? `${currentItem.genres[0]} • ${currentItem.genres[1]}`
                : currentItem.category || "SUPER-HÉROS"}
            </p>

            {/* Synopsis */}
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/90 font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {currentItem.synopsis}
            </p>

            {/* Ligne d'actions à gauche : Bouton EN SAVOIR PLUS + Bouton Son réduit */}
            <div className="mt-6 sm:mt-7 flex items-center justify-start gap-3">
              {/* Bouton EN SAVOIR PLUS */}
              <Link
                href={currentItem.detailUrl}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-black tracking-wider text-black uppercase shadow-lg transition-transform duration-200 hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
              >
                EN SAVOIR PLUS
              </Link>

              {/* Bouton Son réduit */}
              <button
                type="button"
                id="hero-toggle-mute"
                onClick={toggleMute}
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
                title={isMuted ? "Activer le son" : "Couper le son"}
                className="w-9 h-9 rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition hover:border-white hover:bg-black/75 active:scale-95 cursor-pointer select-none"
              >
                {isMuted ? (
                  <svg className="w-4 h-4 fill-current text-white/80" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* À DROITE EN BAS : Bouton Pause / Lecture + Pastilles 1 2 3 4 */}
          <div className="flex items-center gap-2 order-2 md:order-2 self-start md:self-end">
            {/* Bouton Pause / Lecture réduit */}
            <button
              type="button"
              id="hero-toggle-play"
              onClick={togglePlay}
              aria-label={isPlaying ? "Mettre en pause le teaser" : "Lancer le teaser"}
              title={isPlaying ? "Mettre en pause" : "Lire"}
              className="w-7 h-7 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition hover:border-white hover:bg-black/70 active:scale-95 cursor-pointer select-none"
            >
              {isPlaying ? (
                <span className="w-2 h-2 rounded-[1px] bg-white" />
              ) : (
                <svg className="w-2.5 h-2.5 translate-x-0.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Pastilles numérotées 1, 2, 3, 4 réduites */}
            {heroList.map((item, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`hero-pastille-${index + 1}`}
                  onClick={() => selectIndex(index)}
                  aria-label={`Afficher le teaser ${index + 1} : ${item.title}`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? "bg-white text-black font-extrabold shadow-md scale-105"
                      : "bg-[#253243]/80 border border-white/20 text-white/90 hover:bg-white/30 hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
