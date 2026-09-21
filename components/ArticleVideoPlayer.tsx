'use client';

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { youtubeId } from "@/lib/format";

interface ArticleVideoPlayerProps {
  url: string;
  title?: string;
}

export function ArticleVideoPlayer({ url, title }: ArticleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  const cleanUrl = url.trim();
  const ytId = youtubeId(cleanUrl);
  const isM3u8 = cleanUrl.includes(".m3u8") || cleanUrl.includes("/hls/");
  const isDirectVideo = cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".mov");

  useEffect(() => {
    if (!videoRef.current || !isM3u8) return;

    let hls: Hls | null = null;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(cleanUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn("HLS fatal error", data);
          setHasError(true);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = cleanUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [cleanUrl, isM3u8]);

  if (!cleanUrl) return null;

  // 1. YouTube Player
  if (ytId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-none bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
          title={title || "Bande-annonce vidéo"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 2. HLS / m3u8 ou Vidéo directe
  if (isM3u8 || isDirectVideo) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-none bg-black">
        <video
          ref={videoRef}
          controls
          playsInline
          className="h-full w-full object-contain"
          src={!isM3u8 ? cleanUrl : undefined}
          title={title || "Vidéo"}
        >
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 text-center text-sm text-neutral-300">
            Impossible de charger le flux vidéo HLS. Vérifiez le lien source.
          </div>
        )}
      </div>
    );
  }

  // 3. Fallback Embed (iframe générique si autre plateforme)
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-none bg-black">
      <iframe
        className="h-full w-full"
        src={cleanUrl}
        title={title || "Lecteur vidéo"}
        allowFullScreen
      />
    </div>
  );
}
