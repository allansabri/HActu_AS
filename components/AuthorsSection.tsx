import Link from "next/link";
import { formatDate } from "@/lib/format";
import {
  AuthorItem,
  AuthorsSectionConfig,
  defaultAuthorsSectionConfig,
  slugifyAuthor,
} from "@/lib/authors-config";

function AuthorCard({ author }: { author: AuthorItem }) {
  const profileUrl = `/auteurs/${author.slug || slugifyAuthor(author.name)}`;

  return (
    <div
      className="group relative flex flex-col items-center justify-between rounded-none p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:opacity-90"
      style={{
        background:
          "linear-gradient(160deg, rgba(220, 226, 235, 0.16) 0%, rgba(55, 65, 78, 0.75) 28%, rgba(26, 32, 40, 0.95) 70%, rgba(13, 17, 22, 0.98) 100%)",
        border: "1px solid rgba(215, 225, 235, 0.20)",
      }}
    >
      {/* Contenu supérieur : Photo de profil au centre, nom/pseudo, statistiques - Cliquable vers le profil de l'auteur */}
      <Link
        href={profileUrl}
        className="flex flex-col items-center text-center w-full group/author focus:outline-none"
      >
        {/* 1. Rond photo de profil au centre */}
        <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-full overflow-hidden border-2 border-white/25 shadow-xl bg-neutral-800 shrink-0">
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/author:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-[#0e171f] to-[#3a4b5d] text-white text-xl font-bold">
              {author.name?.charAt(0) || "A"}
            </div>
          )}
        </div>

        {/* 2. Nom ou pseudo de l'auteur */}
        <h3 className="mt-3.5 text-base sm:text-[17px] font-extrabold text-white tracking-tight group-hover/author:text-[#778b9d] transition-colors">
          {author.name}
        </h3>

        {/* 3. En plus petit : nombre d'articles publiés ces 30 derniers jours et date du dernier article */}
        <div className="mt-2.5 flex flex-col items-center gap-0.5 text-xs text-neutral-300">
          <span className="font-medium text-white/90">
            {`${author.articles_last_30_days} ${author.articles_last_30_days > 1 ? "articles publiés" : "article publié"} ces 30 derniers jours`}
          </span>
          <span className="text-[11px] text-neutral-400">
            Dernier article le {formatDate(author.last_article_date)}
          </span>
        </div>
      </Link>

      {/* 4. Titre 'Article récent :' et à côté le titre de cet article */}
      <div className="mt-4 pt-3.5 border-t border-white/10 w-full text-center text-xs sm:text-[12.5px] leading-snug">
        <span className="font-bold text-neutral-400 mr-1.5 inline">
          Article récent :
        </span>
        <Link
          href={author.recent_article_url || "/actualites"}
          className="font-medium text-white transition-colors duration-150 hover:text-[#778b9d] line-clamp-2 inline"
        >
          {author.recent_article_title}
        </Link>
      </div>
    </div>
  );
}

export function AuthorsSection({
  config = defaultAuthorsSectionConfig,
}: {
  config?: AuthorsSectionConfig;
}) {
  const authors =
    config.items && config.items.length > 0
      ? config.items
      : defaultAuthorsSectionConfig.items;

  return (
    <section
      id="section-nos-auteurs"
      aria-label={config.section_title || "Nos auteurs"}
      className="w-full bg-gradient-to-b from-[#0e171f] to-[#050a0a] py-8 sm:py-10 lg:py-12"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Titre de section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {config.section_title || "Nos auteurs"}
          </h2>
        </div>

        {/* Grille directe de cartes : 4 cartes côte à côte sur chaque rangée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </section>
  );
}
