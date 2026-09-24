import { supabasePublic } from "@/lib/supabase-public";

export type VideoSourceType = "youtube" | "direct" | "hls";

export interface VideoSourceInfo {
  type: VideoSourceType;
  raw: string;
  youtubeId?: string;
}

export function detectVideoSource(input?: string): VideoSourceInfo | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // HLS .m3u8 or .m3u
  if (/\.(m3u8|m3u)(\?.*)?$/i.test(trimmed)) {
    return { type: "hls", raw: trimmed };
  }

  // Direct HTML5 video (.mp4, .webm, .ogg, .mov, etc.)
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed)) {
    return { type: "direct", raw: trimmed };
  }

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch) {
    return { type: "youtube", raw: trimmed, youtubeId: ytMatch[1] };
  }

  // 11 chars YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: "youtube", raw: trimmed, youtubeId: trimmed };
  }

  // Direct media or stream link fallback
  if (/^https?:\/\//i.test(trimmed)) {
    // If it looks like an m3u8 stream by path
    if (trimmed.includes("m3u8") || trimmed.includes("m3u")) {
      return { type: "hls", raw: trimmed };
    }
    return { type: "direct", raw: trimmed };
  }

  return { type: "youtube", raw: trimmed, youtubeId: trimmed };
}

export interface TrailerItem {
  id: string;
  title: string;
  subtitle: string;
  videoUrl?: string; // YouTube, MP4, M3U8/M3U
  youtubeId?: string; // rétro-compatibilité
  thumbnail: string;
  category: "Série" | "Film";
}

export interface TrailersBannerConfig {
  section_title: string;
  background_image_url: string;
  hero_logo_url: string;
  hero_subtitle: string;
  hero_synopsis: string;
  hero_video_url?: string; // YouTube, MP4, M3U8/M3U
  hero_youtube_id: string; // rétro-compatibilité
  hero_button_text: string;
  trailers: TrailerItem[];
}

export const defaultTrailersBannerConfig: TrailersBannerConfig = {
  section_title: "Les dernières bandes-annonces",
  background_image_url: "https://image.tmdb.org/t/p/original/g0VmjKGMyipJSlPwlQvlLBvXTAQ.jpg",
  hero_logo_url: "https://image.tmdb.org/t/p/original/7Bhukr3f2cHRfdQnaWP1U47c0WT.png",
  hero_subtitle: "NOUVELLE SÉRIE ORIGINALE HBO",
  hero_synopsis:
    "Chaque saison de cette nouvelle série originale HBO explorera en profondeur et fidèlement l'un des sept tomes emblématiques de J.K. Rowling. Redécouvrez la magie de Poudlard, les mystères du monde des sorciers et le destin extraordinaire de Harry Potter face à la montée des forces obscures.",
  hero_video_url: "o_m2vV83y4A",
  hero_youtube_id: "o_m2vV83y4A",
  hero_button_text: "Regarder la bande-annonce",
  trailers: [
    {
      id: "trailer-1",
      title: "House of the Dragon",
      subtitle: "Saison 2 - Bande-annonce officielle (VF)",
      videoUrl: "DotnJ7tTA34",
      youtubeId: "DotnJ7tTA34",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      category: "Série",
    },
    {
      id: "trailer-2",
      title: "The Penguin",
      subtitle: "Saison 1 - Bande-annonce principale (VF)",
      videoUrl: "sfJG6hvoqw4",
      youtubeId: "sfJG6hvoqw4",
      thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      category: "Série",
    },
    {
      id: "trailer-3",
      title: "The Last of Us",
      subtitle: "Saison 2 - Première bande-annonce officielle",
      videoUrl: "0hWf6h2_37g",
      youtubeId: "0hWf6h2_37g",
      thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      category: "Série",
    },
    {
      id: "trailer-4",
      title: "Dune : Deuxième Partie",
      subtitle: "Bande-annonce officielle 3 (VF)",
      videoUrl: "8g1vE_R4L_g",
      youtubeId: "8g1vE_R4L_g",
      thumbnail: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      category: "Film",
    },
    {
      id: "trailer-5",
      title: "Joker : Folie à Deux",
      subtitle: "Bande-annonce officielle (VF)",
      videoUrl: "_OKAwz2NiJs",
      youtubeId: "_OKAwz2NiJs",
      thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      category: "Film",
    },
    {
      id: "trailer-6",
      title: "A Knight of the Seven Kingdoms",
      subtitle: "Saison 1 - Teaser officiel (VOST)",
      videoUrl: "hY8D0dGq3_k",
      youtubeId: "hY8D0dGq3_k",
      thumbnail: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80",
      category: "Série",
    },
    {
      id: "trailer-7",
      title: "The White Lotus",
      subtitle: "Saison 3 - Teaser officiel",
      videoUrl: "Z3g0B0G6wS4",
      youtubeId: "Z3g0B0G6wS4",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      category: "Série",
    },
    {
      id: "trailer-8",
      title: "Superman",
      subtitle: "Bande-annonce teaser officielle (VF)",
      videoUrl: "uhUht6vAsMY",
      youtubeId: "uhUht6vAsMY",
      thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      category: "Film",
    },
  ],
};

export async function getTrailersBannerConfig(): Promise<TrailersBannerConfig> {
  try {
    const { data, error } = await supabasePublic
      .from("site_settings")
      .select("value")
      .eq("key", "trailers_banner_config")
      .maybeSingle();

    if (error || !data || !data.value) {
      return defaultTrailersBannerConfig;
    }

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
    return {
      ...defaultTrailersBannerConfig,
      ...parsed,
      trailers: Array.isArray(parsed?.trailers) && parsed.trailers.length > 0 ? parsed.trailers : defaultTrailersBannerConfig.trailers,
    };
  } catch {
    return defaultTrailersBannerConfig;
  }
}
