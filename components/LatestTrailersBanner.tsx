"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import {
  TrailersBannerConfig,
  defaultTrailersBannerConfig,
  detectVideoSource,
  VideoSourceInfo,
} from "@/lib/trailers-banner";

interface LatestTrailersBannerProps {
  config?: TrailersBannerConfig;
}

function UniversalVideoPlayer({ source }: { source: VideoSourceInfo }) {
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

  if (source.type === "youtube" && source.youtubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${source.youtubeId}?autoplay=1&rel=0`}
        title="Bande-annonce"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (source.type === "hls") {
    return (
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        className="h-full w-full object-contain bg-black"
      />
    );
  }

  return (
    <video
      controls
      autoPlay
      playsInline
      className="h-full w-full object-contain bg-black"
    >
      <source src={source.raw} />
      Votre navigateur ne prend pas en charge la lecture directe de cette vidéo.
    </video>
  );
}

export function LatestTrailersBanner({ config = defaultTrailersBannerConfig }: LatestTrailersBannerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -360 : 360;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const trailers = config?.trailers && config.trailers.length > 0 ? config.trailers : defaultTrailersBannerConfig.trailers;
  const bgImage = config?.background_image_url || defaultTrailersBannerConfig.background_image_url;
  const heroLogo = config?.hero_logo_url || defaultTrailersBannerConfig.hero_logo_url;
  const heroSubtitle = config?.hero_subtitle || defaultTrailersBannerConfig.hero_subtitle;
  const heroSynopsis = config?.hero_synopsis || defaultTrailersBannerConfig.hero_synopsis;
  const heroVideo = config?.hero_video_url || config?.hero_youtube_id || defaultTrailersBannerConfig.hero_video_url || defaultTrailersBannerConfig.hero_youtube_id;
  const heroButtonText = config?.hero_button_text || defaultTrailersBannerConfig.hero_button_text;
  const sectionTitle = config?.section_title || defaultTrailersBannerConfig.section_title;

  const resolvedSource = activeVideoUrl ? detectVideoSource(activeVideoUrl) : null;

  return (
    <section
      id="dernieres-bandes-annonces"
      aria-label={sectionTitle}
      className="relative w-full overflow-hidden border-y border-white/[0.08] bg-[#070c14] bg-cover bg-center bg-no-repeat shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-h-[700px] sm:min-h-[760px] lg:min-h-[820px] flex flex-col justify-between pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12"
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      {/* Dégradé doux progressif du bas jusqu'au milieu des cards pour la lisibilité */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 sm:h-80 lg:h-96 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
        aria-hidden="true"
      />

      {/* Conteneur principal calé sur les marges globales */}
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-between h-full flex-1">
        
        {/* BLOC SUPÉRIEUR : Logo + Sous-titre majuscule semi-bold + Pitch 4 lignes + Bouton Regarder la bande-annonce */}
        <div className="max-w-2xl">
          {heroLogo && (
            <div className="mb-4 sm:mb-5">
              <img
                src={heroLogo}
                alt="Logo officiel"
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
              />
            </div>
          )}

          {heroSubtitle && (
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {heroSubtitle}
            </p>
          )}

          {heroSynopsis && (
            <p className="mt-2.5 text-xs sm:text-sm md:text-[14.5px] font-normal text-white/85 line-clamp-4 leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {heroSynopsis}
            </p>
          )}

          <div className="mt-4 sm:mt-5">
            <button
              type="button"
              onClick={() => setActiveVideoUrl(heroVideo)}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#8197a9] px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{heroButtonText}</span>
            </button>
          </div>
        </div>

        {/* BLOC INFÉRIEUR : Titre de la section + Défilement des cards de bandes-annonces */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          {/* En-tête : Titre + boutons flèches */}
          <div className="mb-4 sm:mb-5 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {sectionTitle}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Défiler vers la gauche"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 disabled:pointer-events-none disabled:opacity-20 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Défiler vers la droite"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 disabled:pointer-events-none disabled:opacity-20 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Défilement horizontal des cards au format paysage */}
          <div
            ref={scrollRef}
            tabIndex={0}
            aria-label="Liste des bandes-annonces"
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth focus:outline-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {trailers.map((item) => {
              const videoSrc = item.videoUrl || item.youtubeId || "";
              return (
                <div
                  key={item.id}
                  className="group w-[270px] sm:w-[300px] md:w-[320px] shrink-0 cursor-pointer flex flex-col"
                  onClick={() => setActiveVideoUrl(videoSrc)}
                >
                  {/* 1. Card paysage avec image (sans zoom, juste transition douce d'opacité) */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/60 shadow-lg">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                      loading="lazy"
                    />

                    {/* Uniquement l'icône Play dans le coin inférieur gauche (sans rond) */}
                    <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-10 flex items-center">
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-white text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" />
                    </div>
                  </div>

                  {/* 2. En dessous : Titre et sous-titre directement sur le fond */}
                  <div className="mt-3 flex flex-col px-0.5">
                    <h3 className="text-base sm:text-lg md:text-[19px] font-semibold tracking-tight text-white group-hover:text-[#7a8fa1] transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] sm:text-sm font-normal text-white/75 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal lecteur vidéo universel (YouTube, MP4, M3U8/M3U) intégré au site */}
      {resolvedSource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-xl bg-black shadow-2xl border border-white/20 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideoUrl(null)}
              aria-label="Fermer la vidéo"
              className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer border border-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <UniversalVideoPlayer source={resolvedSource} />
          </div>
        </div>
      )}
    </section>
  );
}
