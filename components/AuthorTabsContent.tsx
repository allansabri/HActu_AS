"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { ReviewCard } from "@/components/SeriesReviewsSection";
import { Article } from "@/lib/types";
import { SeriesReviewItem } from "@/lib/reviews-config";

type AuthorTabsClientProps = {
  authorName: string;
  authorArticles: Article[];
  authorReviews: SeriesReviewItem[];
};

// Item unifié pour l'onglet "Tous" mélangeant articles et critiques
type FeedItem =
  | { type: "article"; date: number; data: Article }
  | { type: "review"; date: number; data: SeriesReviewItem };

const ITEMS_PER_PAGE = 8; // 2 rangées de 4 cartes

export function AuthorTabsContent({
  authorName,
  authorArticles,
  authorReviews,
}: AuthorTabsClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "critiques">("all");
  
  // États de pagination indépendants
  const [allPage, setAllPage] = useState<number>(1);
  const [articlesPage, setArticlesPage] = useState<number>(1);
  const [reviewsPage, setReviewsPage] = useState<number>(1);

  // 1. Liste unifiée pour l'onglet "Tous" : triée par date décroissante
  const allFeedItems = useMemo<FeedItem[]>(() => {
    const list: FeedItem[] = [];

    authorArticles.forEach((art) => {
      const time = art.published_at ? new Date(art.published_at).getTime() : 0;
      list.push({ type: "article", date: isNaN(time) ? 0 : time, data: art });
    });

    authorReviews.forEach((rev) => {
      const time = rev.published_at ? new Date(rev.published_at).getTime() : 0;
      list.push({ type: "review", date: isNaN(time) ? 0 : time, data: rev });
    });

    // Tri du plus récent au plus ancien
    return list.sort((a, b) => b.date - a.date);
  }, [authorArticles, authorReviews]);

  // Pagination Onglet "Tous"
  const totalAllCount = allFeedItems.length;
  const totalAllPages = Math.max(1, Math.ceil(totalAllCount / ITEMS_PER_PAGE));
  const validAllPage = Math.min(Math.max(1, allPage), totalAllPages);
  const startAllIdx = (validAllPage - 1) * ITEMS_PER_PAGE;
  const paginatedAllItems = allFeedItems.slice(startAllIdx, startAllIdx + ITEMS_PER_PAGE);
  const allPageNumbers = Array.from({ length: totalAllPages }, (_, i) => i + 1);

  // Pagination Onglet "Articles"
  const totalArticlesCount = authorArticles.length;
  const totalArticlesPages = Math.max(1, Math.ceil(totalArticlesCount / ITEMS_PER_PAGE));
  const validArticlesPage = Math.min(Math.max(1, articlesPage), totalArticlesPages);
  const startArticlesIdx = (validArticlesPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = authorArticles.slice(startArticlesIdx, startArticlesIdx + ITEMS_PER_PAGE);
  const articlePageNumbers = Array.from({ length: totalArticlesPages }, (_, i) => i + 1);

  // Pagination Onglet "Critiques"
  const totalReviewsCount = authorReviews.length;
  const totalReviewsPages = Math.max(1, Math.ceil(totalReviewsCount / ITEMS_PER_PAGE));
  const validReviewsPage = Math.min(Math.max(1, reviewsPage), totalReviewsPages);
  const startReviewsIdx = (validReviewsPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviews = authorReviews.slice(startReviewsIdx, startReviewsIdx + ITEMS_PER_PAGE);
  const reviewsPageNumbers = Array.from({ length: totalReviewsPages }, (_, i) => i + 1);

  // Onglets
  const tabs = [
    {
      id: "all" as const,
      label: "Tous",
      icon: Sparkles,
    },
    {
      id: "articles" as const,
      label: "Articles",
      icon: FileText,
    },
    {
      id: "critiques" as const,
      label: "Critiques",
      icon: Star,
    },
  ];

  return (
    <div className="w-full">
      {/* 1. Barre d'onglets de catégories sous les réseaux sociaux : sans rectangle de hover, avec ligne blanche active permanente */}
      <div className="border-b border-white/10">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 text-sm sm:text-base font-semibold transition-colors duration-150 cursor-pointer outline-none whitespace-nowrap ${
                  isActive
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {/* Icône (même couleur normale que le texte, pas de jaune) */}
                <Icon
                  className={`h-4 w-4 sm:h-4.5 sm:w-4.5 transition-colors duration-150 ${
                    isActive
                      ? "text-white"
                      : "text-neutral-500 group-hover:text-white"
                  }`}
                />

                {/* Titre */}
                <span className="tracking-wide">{tab.label}</span>

                {/* Ligne blanche active permanente (comme sur la barre de navigation) */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-none shadow-[0_1px_8px_rgba(255,255,255,0.7)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Zone d'affichage du contenu selon l'onglet sélectionné */}
      <div className="py-8 sm:py-10">
        {/* ===================== ONGLET 1 : TOUS (MÉLANGÉ DIRECT SANS TITRE DE SECTION AVEC PAGINATION) ===================== */}
        {activeTab === "all" && (
          <section aria-label={`Tous les contenus publiés par ${authorName}`}>
            {paginatedAllItems.length > 0 ? (
              <>
                {/* Grille unifiée mélangeant les articles et les cartes de critiques */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {paginatedAllItems.map((item, index) => {
                    if (item.type === "article") {
                      return (
                        <ArticleCard
                          key={item.data.id || `art-${index}`}
                          article={item.data}
                          index={index}
                          large={true}
                        />
                      );
                    }
                    return (
                      <ReviewCard
                        key={item.data.id || `rev-${index}`}
                        item={item.data}
                        index={index}
                      />
                    );
                  })}
                </div>

                {/* Pagination (Page 1, 2, 3...) pour l'onglet Tous */}
                {totalAllPages > 1 && (
                  <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-xs sm:text-sm text-neutral-400">
                      Page <span className="font-semibold text-white">{validAllPage}</span> sur{" "}
                      <span className="font-semibold text-white">{totalAllPages}</span>
                      {" "}({totalAllCount} publications)
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAllPage(1)}
                        disabled={validAllPage === 1}
                        aria-label="Première page"
                        title="Première page"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validAllPage === 1
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setAllPage((p) => Math.max(1, p - 1))}
                        disabled={validAllPage === 1}
                        aria-label="Page précédente"
                        title="Page précédente"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validAllPage === 1
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {allPageNumbers.map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setAllPage(num)}
                            aria-label={`Page ${num}`}
                            className={`inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center px-2.5 rounded-none border text-xs sm:text-sm font-semibold transition-colors ${
                              validAllPage === num
                                ? "border-white bg-white text-black shadow-sm"
                                : "border-white/20 bg-white/[0.04] text-neutral-300 hover:border-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setAllPage((p) => Math.min(totalAllPages, p + 1))}
                        disabled={validAllPage === totalAllPages}
                        aria-label="Page suivante"
                        title="Page suivante"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validAllPage === totalAllPages
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setAllPage(totalAllPages)}
                        disabled={validAllPage === totalAllPages}
                        aria-label="Dernière page"
                        title="Dernière page"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validAllPage === totalAllPages
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-none border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-neutral-400">
                Aucune publication pour le moment par cet auteur.
              </div>
            )}
          </section>
        )}

        {/* ===================== ONGLET 2 : ARTICLES UNIQUEMENT ===================== */}
        {activeTab === "articles" && (
          <section aria-label={`Articles rédigés par ${authorName}`}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Articles
              </h2>
              <span className="text-xs sm:text-sm font-medium text-neutral-400">
                {totalArticlesCount} {totalArticlesCount > 1 ? "articles rédigés" : "article rédigé"}
              </span>
            </div>

            {authorArticles.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {paginatedArticles.map((art, index) => (
                    <ArticleCard
                      key={art.id || index}
                      article={art}
                      index={index}
                      large={true}
                    />
                  ))}
                </div>

                {totalArticlesPages > 1 && (
                  <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-xs sm:text-sm text-neutral-400">
                      Page <span className="font-semibold text-white">{validArticlesPage}</span> sur{" "}
                      <span className="font-semibold text-white">{totalArticlesPages}</span>
                      {" "}({totalArticlesCount} articles)
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setArticlesPage(1)}
                        disabled={validArticlesPage === 1}
                        aria-label="Première page"
                        title="Première page"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validArticlesPage === 1
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setArticlesPage((p) => Math.max(1, p - 1))}
                        disabled={validArticlesPage === 1}
                        aria-label="Page précédente"
                        title="Page précédente"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validArticlesPage === 1
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {articlePageNumbers.map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setArticlesPage(num)}
                            aria-label={`Page ${num}`}
                            className={`inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center px-2.5 rounded-none border text-xs sm:text-sm font-semibold transition-colors ${
                              validArticlesPage === num
                                ? "border-white bg-white text-black shadow-sm"
                                : "border-white/20 bg-white/[0.04] text-neutral-300 hover:border-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setArticlesPage((p) => Math.min(totalArticlesPages, p + 1))}
                        disabled={validArticlesPage === totalArticlesPages}
                        aria-label="Page suivante"
                        title="Page suivante"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validArticlesPage === totalArticlesPages
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setArticlesPage(totalArticlesPages)}
                        disabled={validArticlesPage === totalArticlesPages}
                        aria-label="Dernière page"
                        title="Dernière page"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validArticlesPage === totalArticlesPages
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-none border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-neutral-400">
                Aucun article publié pour le moment par cet auteur.
              </div>
            )}
          </section>
        )}

        {/* ===================== ONGLET 3 : CRITIQUES UNIQUEMENT ===================== */}
        {activeTab === "critiques" && (
          <section aria-label={`Critiques rédigées par ${authorName}`}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Critiques
              </h2>
              <span className="text-xs sm:text-sm font-medium text-neutral-400">
                {totalReviewsCount} {totalReviewsCount > 1 ? "critiques rédigées" : "critique rédigée"}
              </span>
            </div>

            {authorReviews.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {paginatedReviews.map((review, index) => (
                    <ReviewCard
                      key={review.id || index}
                      item={review}
                      index={index}
                    />
                  ))}
                </div>

                {totalReviewsPages > 1 && (
                  <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-xs sm:text-sm text-neutral-400">
                      Page <span className="font-semibold text-white">{validReviewsPage}</span> sur{" "}
                      <span className="font-semibold text-white">{totalReviewsPages}</span>
                      {" "}({totalReviewsCount} critiques)
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setReviewsPage(1)}
                        disabled={validReviewsPage === 1}
                        aria-label="Première page"
                        title="Première page"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validReviewsPage === 1
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                        disabled={validReviewsPage === 1}
                        aria-label="Page précédente"
                        title="Page précédente"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validReviewsPage === 1
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {reviewsPageNumbers.map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setReviewsPage(num)}
                            aria-label={`Page ${num}`}
                            className={`inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center px-2.5 rounded-none border text-xs sm:text-sm font-semibold transition-colors ${
                              validReviewsPage === num
                                ? "border-white bg-white text-black shadow-sm"
                                : "border-white/20 bg-white/[0.04] text-neutral-300 hover:border-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setReviewsPage((p) => Math.min(totalReviewsPages, p + 1))}
                        disabled={validReviewsPage === totalReviewsPages}
                        aria-label="Page suivante"
                        title="Page suivante"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validReviewsPage === totalReviewsPages
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewsPage(totalReviewsPages)}
                        disabled={validReviewsPage === totalReviewsPages}
                        aria-label="Dernière page"
                        title="Dernière page"
                        className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-white/20 bg-white/[0.04] text-neutral-300 transition-colors ${
                          validReviewsPage === totalReviewsPages
                            ? "pointer-events-none opacity-25 cursor-not-allowed"
                            : "hover:border-white hover:bg-white hover:text-black cursor-pointer"
                        }`}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-none border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-neutral-400">
                Aucune critique publiée pour le moment par cet auteur.
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
