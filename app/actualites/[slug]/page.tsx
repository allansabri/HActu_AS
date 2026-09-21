import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getArticleBySlug, getLatestArticles } from "@/lib/queries";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleVideoPlayer } from "@/components/ArticleVideoPlayer";
import { ArticleContent } from "@/components/ArticleContent";
import { Article } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt || article.content.slice(0, 155),
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.image_url ? [article.image_url] : undefined
    }
  };
}

function getArticleGenreLabel(article: Article): string {
  const cat = (article.category || "").toLowerCase();
  const title = (article.title || "").toLowerCase();

  // Programmes internationaux
  if (
    cat.includes("programme international") ||
    cat.includes("programmes internationaux") ||
    title.includes("international")
  ) {
    return "Programmes internationaux";
  }

  // Cinéma
  if (
    cat.includes("cinéma") ||
    cat.includes("cinema") ||
    title.includes("au cinéma") ||
    title.includes("en salles") ||
    cat.includes("films")
  ) {
    return "Cinéma";
  }

  // HBO (séries et prestigieuses créations de la chaîne HBO)
  if (
    cat === "hbo" ||
    cat.includes("hbo original") ||
    title.includes("lanterns") ||
    title.includes("last of us") ||
    title.includes("house of the dragon") ||
    title.includes("white lotus") ||
    title.includes("euphoria") ||
    title.includes("true detective")
  ) {
    return "HBO";
  }

  // HBO Max
  if (cat.includes("max") || title.includes("hbo max") || title.includes("max originale")) {
    return "HBO Max";
  }

  return article.category || "HBO Max";
}

function getFirstFiveWords(title: string): string {
  if (!title) return "";
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 5) return title;
  return words.slice(0, 5).join(" ") + "...";
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // Récupération des 4 autres actualités récentes pour le bas de page
  const latestArticles = await getLatestArticles(6);
  const otherArticles = latestArticles.filter((a) => a.id !== article.id).slice(0, 4);

  const genreLabel = getArticleGenreLabel(article);
  const firstFiveWords = getFirstFiveWords(article.title);
  const formattedDate = formatDate(article.published_at || article.created_at);
  const authorName = article.author_name || "Allan";

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      {/* 1. Rectangle blanc sous la navbar : Fil d'Ariane */}
      <nav aria-label="Fil d'Ariane" className="w-full border-b border-neutral-200/90 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center px-4 py-3.5 sm:px-8 lg:px-12">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-normal text-neutral-600">
            <li>
              <Link href="/" className="transition-colors hover:text-neutral-950">
                Accueil
              </Link>
            </li>
            <li className="flex items-center text-neutral-400">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/actualites" className="transition-colors hover:text-neutral-950">
                Toutes les actualités
              </Link>
            </li>
            <li className="flex items-center text-neutral-400">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-neutral-900" title={article.title}>
              {firstFiveWords}
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. Image Hero de l'article */}
      <section className="w-full bg-[#f5f6f8] pt-6 sm:pt-8 lg:pt-10">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8 lg:px-12">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden rounded-none border border-neutral-200/80 bg-neutral-200 shadow-sm">
            <img
              src={article.image_url || "/max-reference-bg.png"}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Section centrale de l'article : Genre/Date, Grand Titre, et Corps de texte */}
      <article className="w-full bg-[#f5f6f8] pb-16 pt-8 sm:pb-24 sm:pt-12">
        <div className="mx-auto max-w-[860px] px-4 sm:px-8">
          {/* Genre en semi-bold, Date en regular et Nom de l'auteur */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-sm sm:text-base">
            <span className="font-semibold text-neutral-900 tracking-tight">
              {genreLabel}
            </span>
            <span className="select-none text-neutral-300 font-light">|</span>
            <time className="font-normal text-neutral-500">
              {formattedDate}
            </time>
            <span className="select-none text-neutral-300 font-light">|</span>
            <span className="font-normal text-neutral-600">
              Par <span className="font-semibold text-neutral-900">{authorName}</span>
            </span>
          </div>

          {/* Grand Titre en gras majuscule centré */}
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold uppercase leading-[1.25] tracking-tight text-neutral-950 text-center">
            {article.title}
          </h1>

          {/* Séparateur minimaliste */}
          <div className="mx-auto my-7 sm:my-9 h-px w-20 bg-neutral-300" />

          {/* Corps de l'article écrit directement après le séparateur, sans boîte ni carré blanc */}
          <div className="mt-8 text-neutral-800">
            {/* Chapô / Excerpt si présent */}
            {article.excerpt && (
              <p className="mb-8 text-lg sm:text-xl font-medium leading-relaxed text-neutral-700 italic border-l-2 border-neutral-900 pl-4 py-1">
                {article.excerpt}
              </p>
            )}

            {/* Lecteur Vidéo (support YouTube, HLS .m3u8, et fichiers directs MP4) */}
            {article.youtube_video_url && (
              <div className="my-8">
                <ArticleVideoPlayer
                  url={article.youtube_video_url}
                  title={article.title}
                />
              </div>
            )}

            {/* Contenu textuel enrichi (titres de sections, mots en gras, liens, images insérées, citations) */}
            <ArticleContent content={article.content} />

            {/* Fin de l'article : Signature Auteur & Appel à rejoindre le compte X */}
            <div className="mt-14 pt-8 border-t border-neutral-300">
              {/* Nom de la personne qui a écrit l'article */}
              <div className="flex items-center gap-3.5 mb-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-neutral-950 text-white font-extrabold text-base select-none">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                    Article rédigé par
                  </span>
                  <span className="block text-lg font-extrabold text-neutral-950">
                    {authorName}
                  </span>
                </div>
              </div>

              {/* Bloc Retrouvez-nous sur X */}
              <div className="relative overflow-hidden rounded-none bg-neutral-950 p-6 sm:p-7 text-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2.5">
                      {/* Logo officiel X (Twitter) */}
                      <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                        Retrouvez-nous sur X
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Suivez toute l&apos;actualité en temps réel, les annonces exclusives et les coulisses HBO Max &amp; Warner sur notre compte.
                    </p>
                  </div>

                  <a
                    href="https://x.com/HBOMaxActuFR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-bold text-neutral-950 transition-all hover:bg-neutral-200"
                  >
                    <span>@HBOMaxActuFR</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 4. Section Recommandations / Autres actualités récentes */}
      {otherArticles.length > 0 && (
        <section className="border-t border-neutral-200/80 bg-white py-14 sm:py-18">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-950">
                Autres actualités
              </h2>
              <Link
                href="/actualites"
                className="text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                Voir tout →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {otherArticles.map((otherArticle, idx) => (
                <ArticleCard key={otherArticle.id} article={otherArticle} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
