import { supabasePublic } from "@/lib/supabase-public";

export type SeriesReviewItem = {
  id: string;
  title: string;
  slug: string;
  series_title: string;
  image_url: string;
  published_at: string;
  author_name: string;
  author_avatar?: string | null;
  rating: number; // Note sur 5 (ex: 2, 3, 4, 5)
  excerpt?: string | null;
};

export type SeriesReviewsSectionConfig = {
  section_title: string;
  button_text?: string;
  button_link?: string;
  items: SeriesReviewItem[];
};

export const defaultSeriesReviews: SeriesReviewItem[] = [
  {
    id: "review-the-last-of-us-s2",
    title: "THE LAST OF US (SAISON 2) | UN RETOUR BOULEVERSANT ET VISCÉRAL AU SOMMET DU DRAME",
    slug: "the-last-of-us-saison-2",
    series_title: "The Last of Us",
    image_url: "https://image.tmdb.org/t/p/w1280/acevLdSl5I2MK5RYAm7gwAndt1w.jpg",
    published_at: "2026-06-18T10:00:00.000Z",
    author_name: "Thomas Renard",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    excerpt: "Une intensité dramatique inouïe portée par Pedro Pascal et Bella Ramsey.",
  },
  {
    id: "review-house-of-the-dragon-s3",
    title: "HOUSE OF THE DRAGON (SAISON 3) | LA GUERRE CIVILE TARGARYEN S'EMBRASE AVEC FRACAS",
    slug: "house-of-the-dragon-saison-3",
    series_title: "House of the Dragon",
    image_url: "https://image.tmdb.org/t/p/w1280/etj5CuHaHzXx5n5rQo3JvF3j9h.jpg",
    published_at: "2026-06-15T14:30:00.000Z",
    author_name: "Alexandre D.",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 4,
    excerpt: "Des batailles aériennes à couper le souffle et des trahisons sanglantes.",
  },
  {
    id: "review-lanterns-s1",
    title: "LANTERNS | LE POLICIER SCI-FI DE DC ET HBO TIENDRAIT-IL TOUTES SES PROMESSES ?",
    slug: "lanterns-saison-1",
    series_title: "Lanterns",
    image_url: "https://image.tmdb.org/t/p/w1280/bU8wVjDqWbJqN1fCjW6W1p9D7F9.jpg",
    published_at: "2026-06-12T09:15:00.000Z",
    author_name: "Sophie Martin",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 4,
    excerpt: "Une enquête sombre et captivante dans le cœur des mystères de l'univers DC.",
  },
  {
    id: "review-the-white-lotus-s3",
    title: "THE WHITE LOTUS (SAISON 3) | SATIRE JOUISSEIVE ET MEURTRES PARFUMÉS EN THAÏLANDE",
    slug: "the-white-lotus-saison-3",
    series_title: "The White Lotus",
    image_url: "https://image.tmdb.org/t/p/w1280/4pMd9VAdqm96KA2W4X8yetgc7EF.jpg",
    published_at: "2026-06-08T16:00:00.000Z",
    author_name: "Julien V.",
    author_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    excerpt: "Mike White affine son écriture acide avec un nouveau casting éblouissant.",
  },
  {
    id: "review-the-penguin-s1",
    title: "THE PENGUIN | COLIN FARRELL LIVRE UNE PERFORMANCE MONUMENTALE DE PARRAIN DU CRIME",
    slug: "the-penguin-mini-serie",
    series_title: "The Penguin",
    image_url: "https://image.tmdb.org/t/p/w1280/v9L7v53p7eM2N2N6kY4w2sFf9xQ.jpg",
    published_at: "2026-06-02T11:45:00.000Z",
    author_name: "Élodie Blanc",
    author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    rating: 4,
    excerpt: "Gotham sous son jour le plus poisseux et magistralement violent.",
  },
  {
    id: "review-dune-prophecy-s1",
    title: "DUNE : PROPHECY | UNE PLONGÉE COMPLEXE ET AMBITIEUSE AUX SOURCES DU BENE GESSERIT",
    slug: "dune-prophecy-saison-1",
    series_title: "Dune: Prophecy",
    image_url: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    published_at: "2026-05-29T18:20:00.000Z",
    author_name: "Marc Lemaire",
    author_avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
    rating: 3,
    excerpt: "Un univers politique dense et fascinant, même si le rythme peut diviser.",
  },
];

export const defaultSeriesReviewsConfig: SeriesReviewsSectionConfig = {
  section_title: "Les critiques des séries",
  button_text: "Voir toutes les critiques",
  button_link: "/critiques",
  items: defaultSeriesReviews,
};

export async function getSeriesReviewsConfig(): Promise<SeriesReviewsSectionConfig> {
  try {
    const { data } = await supabasePublic
      .from("site_settings")
      .select("value")
      .eq("key", "series_reviews_config")
      .maybeSingle();

    if (data?.value) {
      const parsed = JSON.parse(data.value);
      return {
        section_title: parsed.section_title || defaultSeriesReviewsConfig.section_title,
        button_text: parsed.button_text || defaultSeriesReviewsConfig.button_text,
        button_link: parsed.button_link || defaultSeriesReviewsConfig.button_link,
        items:
          Array.isArray(parsed.items) && parsed.items.length > 0
            ? parsed.items
            : defaultSeriesReviews,
      };
    }
  } catch {
    // ignore
  }

  return defaultSeriesReviewsConfig;
}
