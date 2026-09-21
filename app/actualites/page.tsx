import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { getLatestArticles } from "@/lib/queries";

export const revalidate = 60;

type TabKey = "all" | "cinema" | "hbo" | "hbo-max" | "international";

interface TabItem {
  key: TabKey;
  label: string;
  breadcrumb: string;
}

const TABS: TabItem[] = [
  { key: "all", label: "Toutes les actualités", breadcrumb: "Toutes les actualités" },
  { key: "cinema", label: "Cinéma", breadcrumb: "Cinéma" },
  { key: "hbo", label: "HBO", breadcrumb: "HBO" },
  { key: "hbo-max", label: "HBO Max", breadcrumb: "HBO Max" },
  { key: "international", label: "Programmes internationaux", breadcrumb: "Programmes internationaux" }
];

const ITEMS_PER_PAGE = 8; // 2 rangées de 4 cartes

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const rawTab = (params.tab || "all").toLowerCase();
  const currentTab: TabKey = TABS.some((t) => t.key === rawTab) ? (rawTab as TabKey) : "all";
  const activeTabConfig = TABS.find((t) => t.key === currentTab) || TABS[0];

  const allArticles = await getLatestArticles(100);

  // Filtrage selon l'onglet sélectionné
  let filtered = allArticles;
  if (currentTab === "cinema") {
    filtered = allArticles.filter((a) => {
      const cat = (a.category || "").toLowerCase();
      const title = (a.title || "").toLowerCase();
      return (
        cat.includes("cinéma") ||
        cat.includes("cinema") ||
        cat.includes("films") ||
        title.includes("cinéma") ||
        title.includes("cinema") ||
        title.includes("en salles") ||
        title.includes("film")
      );
    });
  } else if (currentTab === "hbo") {
    filtered = allArticles.filter((a) => {
      const cat = (a.category || "").toLowerCase();
      const title = (a.title || "").toLowerCase();
      const isHBO = cat === "hbo" || cat.includes("hbo original") || title.includes("hbo");
      const isMax = cat.includes("max") || title.includes("hbo max");
      return isHBO && !isMax;
    });
  } else if (currentTab === "hbo-max") {
    filtered = allArticles.filter((a) => {
      const cat = (a.category || "").toLowerCase();
      const title = (a.title || "").toLowerCase();
      return cat.includes("max") || title.includes("hbo max") || title.includes("max originale");
    });
  } else if (currentTab === "international") {
    filtered = allArticles.filter((a) => {
      const cat = (a.category || "").toLowerCase();
      const title = (a.title || "").toLowerCase();
      return cat.includes("international") || title.includes("international");
    });
  }

  // Filtrage textuel optionnel
  const query = params.q?.toLowerCase().trim();
  const articles = query
    ? filtered.filter((article) =>
        `${article.title} ${article.excerpt} ${article.content}`.toLowerCase().includes(query)
      )
    : filtered;

  // Calculs de pagination
  const totalPages = Math.max(1, Math.ceil(articles.length / ITEMS_PER_PAGE));
  const parsedPage = parseInt(params.page || "1", 10);
  const currentPage = Math.min(Math.max(1, isNaN(parsedPage) ? 1 : parsedPage), totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Fonction de génération d'URL pour la pagination
  const buildPageUrl = (pageNumber: number) => {
    const sp = new URLSearchParams();
    if (currentTab !== "all") sp.set("tab", currentTab);
    if (params.q) sp.set("q", params.q);
    if (pageNumber > 1) sp.set("page", pageNumber.toString());
    const qs = sp.toString();
    return qs ? `/actualites?${qs}` : "/actualites";
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      {/* 1. Grand rectangle en dégradé identique à la barre de navigation */}
      <section className="w-full bg-[linear-gradient(to_right,#1c2a37_0%,#050a0a_25%,#050a0a_100%)]">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Toutes les actualités
          </h1>
        </div>
      </section>

      {/* 2. Bandeau fil d'Ariane (breadcrumb) beige clair */}
      <nav aria-label="Fil d'Ariane" className="w-full border-b border-[#eae8dc] bg-[#f6f5ef]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 sm:px-8 sm:py-3.5 lg:px-12">
          <ol className="flex items-center gap-1.5 text-xs font-normal text-neutral-600 sm:text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-neutral-950">
                Accueil
              </Link>
            </li>
            <li className="flex items-center text-neutral-400">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-[#0b2545]">
              {activeTabConfig.breadcrumb}
            </li>
          </ol>
        </div>
      </nav>

      {/* 3. Sélecteur centré avec séparateurs '|' */}
      <section className="w-full pb-16">
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-8 sm:py-9 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5 sm:gap-x-4 lg:gap-x-5">
            {TABS.map((tab, idx) => {
              const isActive = currentTab === tab.key;
              const href = tab.key === "all" ? "/actualites" : `/actualites?tab=${tab.key}`;
              return (
                <div key={tab.key} className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                  <Link
                    href={href}
                    className={`transition-colors duration-150 text-[14.5px] sm:text-[15.5px] lg:text-[16px] ${
                      isActive
                        ? "font-bold text-neutral-950"
                        : "font-normal text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {tab.label}
                  </Link>
                  {idx < TABS.length - 1 && (
                    <span className="select-none font-light text-neutral-300">|</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4. Grille des articles pour la page sélectionnée */}
          <div className="mt-8 sm:mt-10">
            {displayedArticles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {displayedArticles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-neutral-500">
                <p className="text-base">Aucune actualité disponible pour cette catégorie.</p>
              </div>
            )}
          </div>

          {/* 5. Pagination */}
          {totalPages > 1 && (
            <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-200/80 pt-8 sm:flex-row">
              {/* Indicateur de position */}
              <p className="text-xs sm:text-sm text-neutral-500">
                Page <span className="font-semibold text-neutral-900">{currentPage}</span> sur{" "}
                <span className="font-semibold text-neutral-900">{totalPages}</span> ({articles.length} actualités)
              </p>

              {/* Barre de navigation de la pagination */}
              <nav aria-label="Pagination des actualités" className="flex items-center gap-1 sm:gap-1.5">
                {/* Aller à la première page */}
                <Link
                  href={buildPageUrl(1)}
                  aria-label="Aller à la première page"
                  title="Première page"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-none border border-neutral-300 bg-white text-neutral-700 transition-colors ${
                    currentPage === 1
                      ? "pointer-events-none opacity-25 cursor-not-allowed"
                      : "hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Link>

                {/* Page précédente */}
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  aria-label="Page précédente"
                  title="Page précédente"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-none border border-neutral-300 bg-white text-neutral-700 transition-colors ${
                    currentPage === 1
                      ? "pointer-events-none opacity-25 cursor-not-allowed"
                      : "hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>

                {/* Chiffres des pages (1, 2, 3...) */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {pageNumbers.map((num) => {
                    const isCurrent = num === currentPage;
                    return (
                      <Link
                        key={num}
                        href={buildPageUrl(num)}
                        aria-label={`Aller à la page ${num}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`inline-flex h-10 min-w-[2.5rem] px-3 items-center justify-center rounded-none border text-sm transition-colors ${
                          isCurrent
                            ? "border-neutral-950 bg-neutral-950 font-bold text-white shadow-sm"
                            : "border-neutral-300 bg-white font-medium text-neutral-700 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        {num}
                      </Link>
                    );
                  })}
                </div>

                {/* Page suivante */}
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  aria-label="Page suivante"
                  title="Page suivante"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-none border border-neutral-300 bg-white text-neutral-700 transition-colors ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-25 cursor-not-allowed"
                      : "hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>

                {/* Aller directement à la dernière page */}
                <Link
                  href={buildPageUrl(totalPages)}
                  aria-label="Aller directement à la dernière page"
                  title="Dernière page"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-none border border-neutral-300 bg-white text-neutral-700 transition-colors ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-25 cursor-not-allowed"
                      : "hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
