import type { Metadata } from "next";
import Link from "next/link";
import { Users, BookOpen, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/format";
import {
  getAuthorsSectionConfig,
  syncAuthorsWithArticles,
  slugifyAuthor,
  AuthorItem,
} from "@/lib/authors-config";
import { getLatestArticles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Nos auteurs | HBO Max Actu",
  description:
    "Découvrez l'équipe de rédaction de HBO Max Actu : journalistes, critiques et rédacteurs passionnés par l'univers HBO et Warner Bros. Discovery.",
};

function TwitterXIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default async function AuteursPage() {
  const [config, articles] = await Promise.all([
    getAuthorsSectionConfig(),
    getLatestArticles(100),
  ]);

  const authors = syncAuthorsWithArticles(config.items, articles);

  return (
    <div className="min-h-screen bg-[#060709] text-white">
      {/* Fil d'ariane */}
      <div className="border-b border-white/[0.06] bg-black/30">
        <div className="mx-auto flex max-w-[1300px] items-center gap-2 px-4 py-3 text-xs text-neutral-400 sm:px-6">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-medium">Nos auteurs</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1300px] px-4 py-10 sm:px-6 lg:py-16">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-[#8197a9] mb-4">
            <Users size={14} />
            <span>L’équipe de rédaction</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Nos auteurs et rédacteurs
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Passionnés de séries, de grand cinéma et de l’écosystème Warner Bros. Discovery, nos rédacteurs décortiquent quotidiennement l’actualité pour vous offrir analyses, critiques et exclusivités.
          </p>
        </div>

        {/* Grille des auteurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {authors.map((author: AuthorItem) => {
            const authorSlug = author.slug || slugifyAuthor(author.name);
            const profileUrl = `/auteurs/${authorSlug}`;

            return (
              <div
                key={author.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#14171f] to-[#0c0e12] p-6 shadow-xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
              >
                {/* En-tête auteur avec avatar et nom */}
                <div>
                  <div className="flex items-start gap-4">
                    <Link href={profileUrl} className="shrink-0 relative group/avatar focus:outline-none">
                      <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-neutral-800">
                        {author.avatar_url ? (
                          <img
                            src={author.avatar_url}
                            alt={author.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-[#0e171f] to-[#3a4b5d] text-white text-xl font-bold">
                            {author.name?.charAt(0) || "A"}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={profileUrl}
                        className="text-lg font-bold text-white hover:text-[#8197a9] transition-colors block truncate"
                      >
                        {author.name}
                      </Link>
                      <p className="text-xs text-[#8197a9] font-medium mt-0.5">
                        Rédacteur HBO Max Actu
                      </p>

                      {/* Réseaux sociaux */}
                      {author.socials?.twitter && (
                        <div className="mt-2 flex items-center gap-2">
                          <a
                            href={`https://x.com/${author.socials.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
                          >
                            <TwitterXIcon className="h-3 w-3" />
                            <span>@{author.socials.twitter}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {author.bio && (
                    <p className="mt-4 text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                      {author.bio}
                    </p>
                  )}

                  {/* Statistiques d'articles */}
                  <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={14} className="text-[#8197a9]" />
                      <strong className="text-white">{author.articles_last_30_days}</strong> articles (30j)
                    </span>
                    {author.last_article_date && (
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Calendar size={13} className="text-neutral-500" />
                        {formatDate(author.last_article_date)}
                      </span>
                    )}
                  </div>

                  {/* Dernier article */}
                  {author.recent_article_title && (
                    <div className="mt-3 rounded-lg bg-black/40 p-2.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                        Dernier article publié :
                      </span>
                      <Link
                        href={author.recent_article_url || "/actualites"}
                        className="font-medium text-neutral-200 hover:text-[#8197a9] line-clamp-2 transition-colors"
                      >
                        {author.recent_article_title}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Bouton vers son profil */}
                <div className="mt-6 pt-2">
                  <Link
                    href={profileUrl}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#8197a9] hover:bg-[#a5abb2] text-neutral-950 font-bold px-4 py-2 text-xs transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <span>Voir le profil et ses articles</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
