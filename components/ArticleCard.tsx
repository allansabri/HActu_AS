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

export function ArticleCard({ article, index = 0 }: { article: Article; large?: boolean; index?: number }) {
  const displayTitle =
    article.title.trim().toLowerCase() === "lanterns"
      ? "« LANTERNS » | LA NOUVELLE SÉRIE DC STUDIOS ET HBO DÉVOILE SA BANDE-ANNONCE OFFICIELLE"
      : article.title;

  return (
    <article 
      className="group flex flex-col overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 hover:shadow-xl" 
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Link href={`/actualites/${article.slug}`} className="flex flex-col flex-1">
        {/* 1. Image en haut - sans arrondi */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-100 rounded-none">
          <img
            src={article.image_url || "/max-reference-bg.png"}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* 2. Rectangle inférieur : fond blanc avec textes sombres sans arrondi */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 bg-white rounded-none">
          <div>
            {/* Date de publication en haut à gauche : augmentée comme demandé */}
            <time className="block text-sm sm:text-[15px] font-normal tracking-normal text-neutral-600">
              {formatDate(article.published_at || article.created_at)}
            </time>

            {/* Titre de l'article en majuscules noir : plus grand, sur 3 à 4 lignes sans coupure précipitée */}
            <h3 className="mt-3.5 text-lg sm:text-[19px] lg:text-[20px] font-extrabold uppercase leading-[1.32] tracking-tight text-neutral-950 line-clamp-4 min-h-[5.2em]">
              {displayTitle}
            </h3>
          </div>

          {/* Ligne inférieure : Catégorie / Origine à gauche agrandie, Bouton 'Lire l'actualité' à droite agrandi */}
          <div className="mt-8 flex items-center justify-between gap-3 pt-2">
            <span className="text-sm sm:text-[15px] font-bold text-neutral-800 tracking-tight">
              {getArticleTag(article)}
            </span>

            {/* Bouton agrandi, sans arrondi (rounded-none ou léger rectangle strict) */}
            <span className="inline-flex items-center justify-center rounded-none border border-neutral-900 bg-white px-4 py-2 text-sm sm:text-[14px] font-medium text-neutral-900 transition-colors duration-200 group-hover:bg-neutral-900 group-hover:text-white">
              Lire l&apos;actualité
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
