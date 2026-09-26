import Link from "next/link";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/format";
import { SeriesReviewsSectionConfig, SeriesReviewItem, defaultSeriesReviewsConfig } from "@/lib/reviews-config";

export function ReviewCard({ item, index = 0 }: { item: SeriesReviewItem; index?: number }) {
  const ratingClamped = Math.max(0, Math.min(5, Math.round(item.rating || 0)));

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 hover:shadow-xl w-full"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Link href={`/critiques/${item.slug}`} className="flex flex-col flex-1">
        {/* 1. Image en haut - ratio 16/9 sans arrondi (identique à Les dernières actualités) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 rounded-none">
          <img
            src={item.image_url || "/max-reference-bg.png"}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* 2. Rectangle inférieur : fond blanc avec textes sombres sans arrondi */}
        <div className="flex flex-col justify-between flex-1 p-4 sm:p-5 bg-white rounded-none">
          <div>
            {/* Date de publication en haut à gauche */}
            <time className="block text-xs sm:text-[13px] font-normal tracking-normal text-neutral-500">
              {formatDate(item.published_at)}
            </time>

            {/* Titre de la critique en majuscules noir */}
            <h3 className="mt-2.5 text-sm sm:text-base font-extrabold uppercase leading-[1.32] tracking-tight text-neutral-950 line-clamp-3 min-h-[4.2em] group-hover:text-[#7a8fa1] transition-colors">
              {item.title}
            </h3>
          </div>

          {/* 3. Section profil auteur & Note avec étoiles (remplace le tag et le bouton Lire l'actualité) */}
          <div className="mt-5 pt-3.5 border-t border-neutral-100 flex flex-col gap-3">
            {/* Auteur : Rond photo de profil à gauche + nom/pseudo à côté */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-full bg-neutral-200 border border-neutral-300 shadow-inner">
                {item.author_avatar ? (
                  <img
                    src={item.author_avatar}
                    alt={item.author_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-[#0e171f] to-[#2c3947] text-white text-xs font-bold">
                    {item.author_name?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                {item.author_name}
              </span>
            </div>

            {/* Ligne Note : texte "Note", 5 étoiles jaunes selon la note, et affichage "X/5" à droite */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-600 uppercase text-[11px] tracking-wider">
                  Note
                </span>
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`Note : ${ratingClamped} sur 5`}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= ratingClamped;
                    return (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          isFilled
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_1px_1px_rgba(251,191,36,0.25)]"
                            : "text-neutral-300 fill-neutral-200"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <span className="font-black text-neutral-950 text-xs sm:text-sm">
                {ratingClamped}/5
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function SeriesReviewsSection({
  config = defaultSeriesReviewsConfig,
}: {
  config?: SeriesReviewsSectionConfig;
}) {
  const reviews =
    config.items && config.items.length > 0
      ? config.items.slice(0, 4)
      : defaultSeriesReviewsConfig.items.slice(0, 4);

  return (
    <section
      id="section-critiques-series"
      aria-label={config.section_title || "Les critiques des séries"}
      className="w-full bg-gradient-to-b from-[#0e171f] to-[#050a0a] py-8 sm:py-10 lg:py-12"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Titre de section identique aux autres sections */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {config.section_title || "Les critiques des séries"}
          </h2>
        </div>

        {/* Grille des 4 cartes agrandies côte à côte (identique à Les dernières actualités) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((item, index) => (
            <ReviewCard key={item.id || index} item={item} index={index} />
          ))}
        </div>

        {/* Bouton en pilule pour voir toutes les critiques */}
        <div className="mt-8 flex justify-center">
          <Link
            href={config.button_link || "/critiques"}
            className="inline-flex items-center justify-center rounded-full bg-[#8197a9] px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a5abb2] hover:shadow-lg active:scale-[0.99]"
          >
            {config.button_text || "Voir toutes les critiques"}
          </Link>
        </div>
      </div>
    </section>
  );
}
