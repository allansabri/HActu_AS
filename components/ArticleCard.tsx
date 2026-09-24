import Link from "next/link";
import { formatDate } from "@/lib/format";
import { Article } from "@/lib/types";

function getArticleTag(article: Article): string {
  const cat = (article.category || "").toLowerCase();
  const title = (article.title || "").toLowerCase();

  // Programmes internationaux (acquisitions)
  if (cat.includes("programme international") || cat.includes("programmes internationaux") || title.includes("international")) {
    if (cat.includes("film") || title.includes("film")) {
      return "Programmes internationaux - Films";
    }
    return "Programmes internationaux - Séries";
  }

  // Cinéma
  if (cat.includes("cinéma") || cat.includes("cinema") || title.includes("au cinéma") || title.includes("en salles")) {
    return "Cinéma - Films";
  }

  // DC / HBO Original series
  if (title.includes("lanterns") || title.includes("green lantern")) {
    return "HBO - Séries";
  }

  // Si la catégorie ou le titre fait référence à HBO Original
  if (cat.includes("hbo original") || (cat === "hbo" && !cat.includes("max"))) {
    if (cat.includes("film") || title.includes("film")) {
      return "HBO - Films";
    }
    return "HBO - Séries";
  }

  // Si c'est HBO Max Original ou HBO Max
  if (cat.includes("hbo max") || cat.includes("max original")) {
    if (cat.includes("film") || title.includes("film")) {
      return "HBO Max - Films";
    }
    return "HBO Max - Séries";
  }

  // Films
  if (cat.includes("film") || title.includes("film")) {
    return "HBO Max - Films";
  }

  // Séries
  if (cat.includes("série") || cat.includes("series") || title.includes("saison") || title.includes("série")) {
    if (
      title.includes("last of us") ||
      title.includes("house of the dragon") ||
      title.includes("white lotus") ||
      title.includes("euphoria") ||
      title.includes("succession")
    ) {
      return "HBO - Séries";
    }
    return "HBO Max - Séries";
  }

  if (article.category && article.category !== "Actualités" && article.category !== "News") {
    return article.category;
  }

  return "HBO Max - Séries";
}

export function ArticleCard({
  article,
  large = true,
  imageHeight,
  index = 0
}: {
  article: Article;
  large?: boolean;
  imageHeight?: string;
  index?: number;
}) {
  const displayTitle =
    article.title.trim().toLowerCase() === "lanterns"
      ? "« LANTERNS » | LA NOUVELLE SÉRIE DC STUDIOS ET HBO DÉVOILE SA BANDE-ANNONCE OFFICIELLE"
      : article.title;

  return (
    <article 
      className="group flex flex-col overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 hover:shadow-xl w-full" 
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Link href={`/actualites/${article.slug}`} className="flex flex-col flex-1">
        {/* 1. Image en haut - sans arrondi */}
        <div className={`relative ${imageHeight ? `${imageHeight} w-full` : large ? "aspect-[16/9] w-full" : "aspect-[16/10] sm:aspect-[16/9] w-full"} overflow-hidden bg-neutral-100 rounded-none`}>
          <img
            src={article.image_url || "/max-reference-bg.png"}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* 2. Rectangle inférieur : fond blanc avec textes sombres sans arrondi */}
        <div className={`flex flex-col justify-between flex-1 ${large ? "p-5 sm:p-6" : "p-4 sm:p-4.5"} bg-white rounded-none`}>
          <div>
            {/* Date de publication en haut à gauche */}
            <time className={`block ${large ? "text-sm sm:text-[15px]" : "text-xs sm:text-[13px]"} font-normal tracking-normal text-neutral-600`}>
              {formatDate(article.published_at || article.created_at)}
            </time>

            {/* Titre de l'article en majuscules noir */}
            <h3 className={`mt-3 ${large ? "text-lg sm:text-[19px] lg:text-[20px] line-clamp-4 min-h-[5.2em]" : "text-sm sm:text-base line-clamp-3 min-h-[4em]"} font-extrabold uppercase leading-[1.32] tracking-tight text-neutral-950`}>
              {displayTitle}
            </h3>
          </div>

          {/* Ligne inférieure : Catégorie / Origine à gauche agrandie, Bouton 'Lire l'actualité' à droite agrandi */}
          <div className={`${large ? "mt-8 pt-2" : "mt-5 pt-2"} flex items-center justify-between gap-2 border-t border-neutral-100`}>
            <span className={`${large ? "text-sm sm:text-[15px]" : "text-xs sm:text-[13px]"} font-bold text-neutral-800 tracking-tight truncate`}>
              {getArticleTag(article)}
            </span>

            {/* Bouton agrandi, sans arrondi */}
            <span className={`inline-flex items-center justify-center rounded-none border border-neutral-900 bg-white ${large ? "px-4 py-2 text-sm sm:text-[14px]" : "px-3 py-1.5 text-xs sm:text-[13px]"} font-medium text-neutral-900 transition-colors duration-200 group-hover:bg-neutral-900 group-hover:text-white shrink-0 whitespace-nowrap`}>
              Lire l&apos;actualité
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ArticleLandscapeCard({ article, index = 0 }: { article: Article; index?: number }) {
  const displayTitle =
    article.title.trim().toLowerCase() === "lanterns"
      ? "« LANTERNS » | LA NOUVELLE SÉRIE DC STUDIOS ET HBO DÉVOILE SA BANDE-ANNONCE OFFICIELLE"
      : article.title;

  return (
    <article 
      className="group flex flex-row overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 hover:shadow-xl w-full" 
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Link href={`/actualites/${article.slug}`} className="flex flex-row flex-1 min-w-0">
        {/* 1. Image à gauche STRICTEMENT au format paysage (aspect 16/10) */}
        <div className="relative aspect-[16/10] w-[150px] xs:w-[180px] sm:w-[240px] md:w-[280px] lg:w-[310px] shrink-0 overflow-hidden bg-neutral-900 rounded-none self-stretch">
          <img
            src={article.image_url || "/max-reference-bg.png"}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* 2. Rectangle droit : fond blanc aéré, textes sombres sans arrondi */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-3.5 sm:p-5 md:p-6 bg-white rounded-none">
          <div>
            {/* Date de publication en haut à gauche */}
            <time className="block text-xs sm:text-sm font-normal tracking-normal text-neutral-600">
              {formatDate(article.published_at || article.created_at)}
            </time>

            {/* Titre de l'article en majuscules noir */}
            <h3 className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg font-extrabold uppercase leading-[1.32] tracking-tight text-neutral-950 line-clamp-2 sm:line-clamp-3">
              {displayTitle}
            </h3>
          </div>

          {/* Ligne inférieure : Catégorie / Origine à gauche, Bouton 'Lire l'actualité' à droite */}
          <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
            <span className="text-xs sm:text-sm font-bold text-neutral-800 tracking-tight truncate">
              {getArticleTag(article)}
            </span>

            {/* Bouton rectangulaire net */}
            <span className="inline-flex items-center justify-center rounded-none border border-neutral-900 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-neutral-900 transition-colors duration-200 group-hover:bg-neutral-900 group-hover:text-white shrink-0 whitespace-nowrap">
              Lire l&apos;actualité
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
